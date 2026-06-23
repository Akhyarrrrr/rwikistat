const express = require("express");
const { admin, storage, firestore } = require("./adminConfig");
const { spawn, ChildProcess, exec } = require("child_process");
const fs = require("fs");
const { PNG } = require("pngjs");
const router = express.Router();
const detect = require("detect-port");
const waitOn = require("wait-on");
const path = require("path");

// Middleware untuk verifikasi token bearer
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;

    // Verifikasi token menggunakan Firebase Admin SDK atau metode autentikasi yang sesuai
    admin
      .auth()
      .verifyIdToken(bearerToken)
      .then((decodedToken) => {
        req.user = decodedToken;
        next(); // Lanjutkan ke middleware atau fungsi berikutnya setelah autentikasi
      })
      .catch((error) => {
        console.error("Token tidak valid:", error);
        res.status(403).json({ error: "Token tidak valid." });
      });
  } else {
    // Jika tidak ada token
    res.status(403).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }
};

router.post("/", (req, res) => {
  const code = req.body.code;

  const random = Math.random().toString(36).substring(7);
  const filePath = `./temp/${random}.R`;

  fs.writeFileSync(filePath, code);

  const process = spawn("Rscript", [filePath]);

  let output = "";

  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    output += data.toString();
  });

  process.on("close", (code) => {
    // Delete the generated file
    fs.unlinkSync(filePath);

    // Send the output to the client
    res.send(output);
  });
});

router.post("/test/", (req, res) => {
  const code = req.body.code;

  const random = Math.random().toString(36).substring(7);
  const filePath = `./temp/${random}.R`;

  fs.writeFileSync(filePath, code);

  const process = spawn("Rscript", [filePath]);

  let output = "";

  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    output += data.toString();
  });

  process.on("close", (code) => {
    // Delete the generated file
    fs.unlinkSync(filePath);

    // Check if out.png file exists
    const pngFilePath = "out.png";
    if (fs.existsSync(pngFilePath)) {
      // If it exists, send the image file to the client
      res.sendFile(pngFilePath, { root: "./" }, (err) => {
        if (err) {
          // Handle any errors that occurred during sending the file
          console.error(err);
          res.status(500).send("Error sending file");
        } else {
          // File sent successfully
          fs.unlinkSync(pngFilePath);
          // console.log('File sent:', pngFilePath);
        }
      });
    } else {
      // If out.png doesn't exist, send the output to the client
      res.send(output);
    }
  });
});

router.post("/modul", (req, res) => {
  const code = req.body.code;

  const random = Math.random().toString(36).substring(7);
  const filePath = `./temp/${random}.R`;

  fs.writeFileSync(filePath, code);

  // Run the Shiny app with IPC (Inter-Process Communication)
  const process = spawn("Rscript", ["--vanilla", "--slave", filePath], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });

  let output = "";

  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    output += data.toString();
  });

  process.on("message", (message) => {
    if (message.port) {
      // Send the output and shiny port to the client
      res.send({ output, port: message.port });
    }
  });

  process.on("close", (code) => {
    // Delete the generated file
    fs.unlinkSync(filePath);

    if (code !== 0) {
      // If the code is not 0, it means there was an error
      res.send({
        success: false,
        error: `Process exited with code ${code}. Output: ${output}`,
      });
    }
  });
});

router.post("/shiny", (req, res) => {
  const code = req.body.code;
  const port = req.body.port;

  const random = Math.random().toString(36).substring(7);
  const filePath = `./temp/${random}.R`;

  fs.writeFileSync(filePath, code);

  const process = spawn("Rscript", [filePath]);

  let output = "";

  process.stdout.on("data", (data) => {
    output += data.toString();
  });

  process.stderr.on("data", (data) => {
    output += data.toString();
  });

  process.on("close", (code) => {
    // Ambil satu atau dua angka terakhir dari nilai port
    const shinyOutput = port;

    // Send the manipulated output and original output to the client as an object
    res.json({ shinyOutput: shinyOutput, originalOutput: output });
  });
});

router.post("/check-port", async (req, res) => {
  const port = req.body.port;

  try {
    detect(port)
      .then((_port) => {
        if (port == _port) {
          // console.log(`port: ${port} was not occupied`);
          res
            .status(200)
            .json({ message: `Port ${port} tidak digunakan`, status: "false" });
        } else {
          // console.log(`port: ${port} was occupied, try port: ${_port}`);
          res
            .status(200)
            .json({ message: `Port ${port} sedang digunakan`, status: "true" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat memeriksa port",
    });
  }
});

router.post("/check-ports", async (req, res) => {
  const ports = req.body.ports;

  if (!ports || !Array.isArray(ports)) {
    return res
      .status(400)
      .json({ status: "error", message: "Input tidak valid" });
  }

  try {
    const results = await Promise.all(
      ports.map(async (port) => {
        try {
          const isOccupied = await detect(port);
          detect(port)
            .then((_port) => {
              if (port == _port) {
                // console.log(`port: ${port} was not occupied`);
                res.status(200).json({
                  message: `Port ${port} tidak digunakan`,
                  status: "false",
                });
              } else {
                // console.log(`port: ${port} was occupied, try port: ${_port}`);
                res.status(200).json({
                  message: `Port ${port} sedang digunakan`,
                  status: "true",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          return {
            port,
            isOccupied: false,
            error: err.message || "Terjadi kesalahan saat memeriksa port",
          };
        }
      })
    );

    res.status(200).json({ status: "success", results });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat memeriksa port",
    });
  }
});

// Endpoint di local
// router.post("/newshiny", async (req, res) => {
//   try {
//     const code = req.body.code;
//     const random = Math.random().toString(36).substring(7);
//     const fileName = `${random}.R`;
//     const tempDir = path.join(__dirname, "temp");

//     if (!fs.existsSync(tempDir)) {
//       fs.mkdirSync(tempDir);
//     }

//     fs.writeFileSync(path.join(tempDir, fileName), code);

//     const port = await detect();
//     const url = `http://127.0.0.1:${port}`;

//     const command = `Rscript -e "shiny::runApp('./temp/${fileName}', host='127.0.0.1', port=${port})"`;

//     exec(command, (error, stdout) => {
//       if (error) {
//         console.error(`Error executing R script: ${error}`);
//         return res
//           .status(500)
//           .json({ success: false, error: "Error executing script" });
//       }
//       console.log(`R Script Output: ${stdout}`);
//     });

//     const waitOptions = {
//       resources: [url],
//       delay: 2000,
//       interval: 100,
//       timeout: 20000,
//     };
//     await waitOn(waitOptions);
//     console.log(`${url} is now available`);
//     res.json({ success: true, link: url });

//     setTimeout(() => {
//       const filePath = path.join(__dirname, "temp", fileName);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//         console.log(`File ${fileName} deleted from temp folder after delay.`);
//       } else {
//         console.error("File not found");
//       }
//     }, 30000); // delay 30 detik
//   } catch (err) {
//     console.error("Error in /newshiny:", err);
//     res.status(500).json({ success: false, error: "Server Error" });
//   }
// });

// Endpoint di server mobile
router.post("/newshiny", async (req, res) => {
  try {
    const code = req.body.code;
    const random = Math.random().toString(36).substring(7);
    const filePath = `./temp/${random}.R`;

    if (!fs.existsSync("./temp")) {
      fs.mkdirSync("./temp");
    }

    fs.writeFileSync(filePath, code);
    // console.log(
    //   `File contents for ${filePath}:`,
    //   fs.readFileSync(filePath, "utf8")
    // );

    const port = await detect();

    const terminalCommand = "bash";
    const terminalArgs = ["./run_shiny.sh", path.resolve(filePath), port];

    const shinyProcess = spawn(terminalCommand, terminalArgs, {
      stdio: "ignore",
      detached: true,
    });
    shinyProcess.unref();

    const url = `${process.env.PUBLIC_HOST || "http://localhost"}:${port}`;
    const waitOptions = {
      resources: [url],
      delay: 2000,
      interval: 100,
      timeout: 20000,
    };

    // console.log(`${url} is now available`);
    await waitOn(waitOptions);
    res.json({ success: true, link: url });
    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        // console.log(`File ${random}.R deleted from temp folder after delay.`);
      } else {
        console.error("File not found");
      }
    }, 30000); // delay 30 detik
  } catch (err) {
    console.error("Error in /newshiny:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Endpoint di server web
router.post("/newshiny-web", async (req, res) => {
  let filePath;
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ success: false, error: "Code is required" });
    }

    const random = Math.random().toString(36).substring(7);
    filePath = `./temp/${random}.R`;

    if (!fs.existsSync("./temp")) {
      fs.mkdirSync("./temp");
    }

    fs.writeFileSync(filePath, code);
    // console.log(`File created: ${filePath}`);

    const port = await detect();

    const terminalCommand = "bash";
    const terminalArgs = ["./run_shiny.sh", path.resolve(filePath), port];

    const shinyProcess = spawn(terminalCommand, terminalArgs, {
      stdio: "ignore",
      detached: true,
    });
    shinyProcess.unref();

    const url = `${process.env.PUBLIC_HOST || "http://localhost"}:${port}`;
    const waitOptions = {
      resources: [url],
      delay: 2000,
      interval: 100,
      timeout: 30000,
    };

    await waitOn(waitOptions);
    res.status(200).json({ success: true, link: url });

    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        // console.log(`File ${random}.R deleted from temp folder.`);
      }
    }, 120000);
  } catch (err) {
    console.error("Error in /newshiny:", err);

    // Cleanup in case of error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).json({ success: false, error: "Server Error" });
  }
});

module.exports = router;
