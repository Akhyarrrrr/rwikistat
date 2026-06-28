const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

require("events").EventEmitter.defaultMaxListeners = 15;

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});

// Root status endpoint — landing page
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>RWikiStat API</title>
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.1.1/index.css">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  body{font-family:'Geist Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    background:linear-gradient(135deg,#00726B 0%,#005b54 100%);min-height:100dvh;
    display:flex;align-items:center;justify-content:center;color:#fff}
  .card{text-align:center;padding:2rem;animation:fadeUp .6s ease}
  .card .logo{width:56px;height:56px;background:rgba(255,255,255,.15);border-radius:14px;
    display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:1.5rem;font-weight:600}
  .card h1{font-size:2.8rem;font-weight:600;letter-spacing:-.02em;margin-bottom:.35rem}
  .card p{font-size:1.05rem;opacity:.8;margin-bottom:2rem}
  .card .status{display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.12);
    padding:.35rem 1rem .35rem .75rem;border-radius:20px;font-size:.82rem;margin-bottom:2rem}
  .card .status .dot{width:8px;height:8px;background:#4ade80;border-radius:50%;animation:pulse 2s infinite}
  .card .links a{background:#fff;color:#00726B;text-decoration:none;padding:.7rem 1.5rem;
    border-radius:8px;font-weight:500;font-size:.9rem;transition:all .2s;display:inline-block}
  .card .links a:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.2)}
  .card .time{font-size:.78rem;opacity:.5;margin-top:2.5rem;font-family:'Geist Mono','SF Mono',monospace}
</style></head>
<body><div class="card">
  <div class="logo">R</div>
  <h1>RWikiStat API</h1>
  <p>Backend untuk platform belajar statistika dengan R</p>
  <div class="status"><span class="dot"></span>Server berjalan</div>
  <div class="links"><a href="/api-docs">Dokumentasi API</a></div>
  <div class="time">${new Date().toISOString()}</div>
</div></body>
</html>`);
});

// API Documentation (EJS)
const endpoints = require("./data/endpoints");
app.get("/api-docs", (req, res) => {
  res.render("api-docs", { groups: endpoints });
});


// Routes
const authApi = require("./routes/auth");
app.use("/api/auth", authApi);

const modulApi = require("./routes/modul");
app.use("/api/modul", modulApi);

const compilerApi = require("./routes/compiler");
app.use("/api/compiler", compilerApi);

const forumApi = require("./routes/forum");
app.use("/api/forum", forumApi);

const chatBot = require("./routes/chatBot");
app.use("/api/chatbot", chatBot);

const userApi = require("./routes/user");
app.use("/api/user", userApi);

const historyApi = require("./routes/history");
app.use("/api/history", historyApi);

const shinyApi = require("./routes/shiny");
app.use("/api/shiny", shinyApi);

const adminApi = require("./routes/admin");
app.use("/api/admin", adminApi);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
