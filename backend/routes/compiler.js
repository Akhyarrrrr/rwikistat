const express = require("express");
const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const router = express.Router();

const TEMP_DIR = path.join(os.tmpdir(), "rwikistat-compiler");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const shinySessions = {};

setInterval(() => {
  const now = Date.now();
  for (const [id, s] of Object.entries(shinySessions)) {
    if (now - s.createdAt > 3600000) {
      killShinySession(id);
    }
  }
}, 300000);

function killShinySession(sessionId) {
  const s = shinySessions[sessionId];
  if (!s) return;
  try {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(s.pid), "/f", "/t"]);
    } else {
      process.kill(-s.pid, "SIGTERM");
    }
  } catch {}
  if (s.rFilePath && fs.existsSync(s.rFilePath)) {
    try { fs.unlinkSync(s.rFilePath); } catch {}
  }
  if (s.tempPngPath && fs.existsSync(s.tempPngPath)) {
    try { fs.unlinkSync(s.tempPngPath); } catch {}
  }
  delete shinySessions[sessionId];
}

router.post("/", async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).send("Error: Code is required");
  }
  try {
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code, stdin: "", language: "r", versionIndex: "4", compileOnly: false,
      }),
    });
    const result = await response.json();
    res.send(result.output || `Error: ${result.error || "Unknown error"}`);
  } catch (error) {
    console.error("JDoodle API error:", error);
    res.status(500).send("Error: Failed to execute R code via JDoodle API");
  }
});

router.post("/graph", async (req, res) => {
  const { code, libs } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }
  if (code.includes("shinyApp(") || code.includes("runApp(")) {
    return handleShinyCode(code, res);
  }
  const random = Math.random().toString(36).substring(7);
  const rFilePath = path.join(TEMP_DIR, `${random}.R`);
  const pngPath = path.join(TEMP_DIR, `${random}.png`);
  const libCode = libs ? libs.join("\n") : "library(ggplot2)";
  const wrappedCode = `${libCode}\npng("${pngPath.replace(/\\/g, "/")}", width=800, height=600)\n${code}\ndev.off()`;
  fs.writeFileSync(rFilePath, wrappedCode);
  try {
    const stdout = execSync(`Rscript "${rFilePath}"`, { timeout: 30000, encoding: "utf8" });
    let image = null;
    if (fs.existsSync(pngPath)) {
      image = fs.readFileSync(pngPath).toString("base64");
      fs.unlinkSync(pngPath);
    }
    res.json({ output: stdout, image });
  } catch (err) {
    let errorMsg = err.stderr?.toString() || err.message || "R execution error";
    if (err.stdout) {
      errorMsg = err.stdout.toString() + "\n" + errorMsg;
    }
    let image = null;
    if (fs.existsSync(pngPath)) {
      image = fs.readFileSync(pngPath).toString("base64");
      fs.unlinkSync(pngPath);
    }
    res.json({ output: errorMsg, image });
  } finally {
    if (fs.existsSync(rFilePath)) fs.unlinkSync(rFilePath);
  }
});

async function handleShinyCode(code, res) {
  for (const [id, _] of Object.entries(shinySessions)) {
    killShinySession(id);
  }
  await new Promise((r) => setTimeout(r, 500));
  const SHINY_PORT = 7000;
  const sessionId = Math.random().toString(36).substring(7);
  const rFilePath = path.join(TEMP_DIR, `shiny_${sessionId}.R`);
  let modifiedCode;
  if (code.includes("shinyApp(")) {
    const injectShinyApp = `options = list(port = ${SHINY_PORT}, host = "0.0.0.0", launch.browser = FALSE)`;
    modifiedCode = code.replace(/shinyApp\s*\(/, `shinyApp(${injectShinyApp}, `);
  } else {
    modifiedCode = code.replace(/runApp\s*\(/, `runApp(port = ${SHINY_PORT}, host = "0.0.0.0", launch.browser = FALSE, `);
  }
  fs.writeFileSync(rFilePath, modifiedCode);
  const child = spawn("Rscript", [rFilePath], { stdio: ["ignore", "pipe", "pipe"] });
  shinySessions[sessionId] = { pid: child.pid, port: SHINY_PORT, createdAt: Date.now(), rFilePath };
  let resolved = false;
  const timeout = setTimeout(() => {
    if (!resolved) {
      resolved = true;
      killShinySession(sessionId);
      res.json({ output: "Shiny app timed out (15s). Periksa kode Anda.", image: null });
    }
  }, 15000);
  let stderrBuf = "";
  const onOutput = (text) => {
    if (resolved) return;
    const match = text.match(/Listening on\s+http[s]?:\/\/([^:]+):(\d+)/i);
    if (match) {
      const host = match[1];
      const actualPort = match[2];
      resolved = true;
      clearTimeout(timeout);
      shinySessions[sessionId].port = Number(actualPort);
      res.json({ type: "shiny", url: `http://${host}:${actualPort}`, port: Number(actualPort), sessionId });
    } else if (/listening on/i.test(text)) {
      resolved = true;
      clearTimeout(timeout);
      res.json({ type: "shiny", url: `http://localhost:${SHINY_PORT}`, port: SHINY_PORT, sessionId });
    }
  };
  child.stdout.on("data", (data) => onOutput(data.toString()));
  child.stderr.on("data", (data) => {
    stderrBuf += data.toString();
    onOutput(data.toString());
  });
  child.on("error", (err) => {
    if (!resolved) {
      resolved = true;
      clearTimeout(timeout);
      res.json({ output: `Gagal start: ${err.message}`, image: null });
    }
  });
  child.on("exit", (code) => {
    if (!resolved) {
      resolved = true;
      clearTimeout(timeout);
      res.json({ output: stderrBuf || `Proses selesai dengan kode ${code}`, image: null });
    }
    delete shinySessions[sessionId];
  });
}

router.post("/shiny/stop", (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }
  killShinySession(sessionId);
  res.json({ ok: true });
});

router.post("/test/", (req, res) => {
  const code = req.body.code;
  const random = Math.random().toString(36).substring(7);
  const filePath = path.join(TEMP_DIR, `${random}.R`);
  fs.writeFileSync(filePath, code);
  const process = spawn("Rscript", [filePath]);
  let output = "";
  process.stdout.on("data", (data) => { output += data.toString(); });
  process.stderr.on("data", (data) => { output += data.toString(); });
  process.on("close", (code) => {
    fs.unlinkSync(filePath);
    const pngFilePath = path.join(process.cwd(), "out.png");
    if (fs.existsSync(pngFilePath)) {
      res.sendFile(pngFilePath, { root: "./" }, (err) => {
        if (!err) fs.unlinkSync(pngFilePath);
        else res.status(500).send("Error sending file");
      });
    } else {
      res.send(output);
    }
  });
});
// ponytail: out.png still created in cwd by Rscript, cleaned up after send

module.exports = router;
