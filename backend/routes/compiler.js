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
    try { fs.rmSync(s.rFilePath, { recursive: true, force: true }); } catch {}
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

let nextPort = 7000;
const MAX_PORT = 7999;

function getNextPort() {
  const port = nextPort;
  nextPort = port >= MAX_PORT ? 7000 : port + 1;
  return port;
}

async function handleShinyCode(code, res) {
  const sessionId = Math.random().toString(36).substring(7);
  const port = getNextPort();
  const appDir = path.join(TEMP_DIR, `shiny_${sessionId}`);
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, "app.R"), code);
  const child = spawn("Rscript", [
    "-e",
    `shiny::runApp("${appDir.replace(/\\/g, "/")}", port = ${port}, host = "127.0.0.1", launch.browser = FALSE)`,
  ], { stdio: ["ignore", "pipe", "pipe"] });
  shinySessions[sessionId] = { pid: child.pid, port, createdAt: Date.now(), rFilePath: appDir };
  let outputBuf = "";
  child.stdout.on("data", (d) => { outputBuf += d.toString(); });
  child.stderr.on("data", (d) => { outputBuf += d.toString(); });
  // Wait 3s for Shiny to boot, then check if it's still alive
  await new Promise((r) => setTimeout(r, 3000));
  if (child.exitCode !== null) {
    killShinySession(sessionId);
    return res.json({ output: outputBuf || `Shiny gagal start (exit code ${child.exitCode}). Periksa kode Anda.`, image: null });
  }
  res.json({ type: "shiny", url: `http://127.0.0.1:${port}`, port, sessionId });
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
