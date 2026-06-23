const express = require("express");
const adminConfig = require("./adminConfig");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 8080;
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

require("events").EventEmitter.defaultMaxListeners = 15;

// Middleware untuk mengurai data JSON dari permintaan POST
app.use(bodyParser.json());

// api modul
const modulApi = require("./modul");
app.use("/api/modul", modulApi);

// api compiler
const compilerApi = require("./compiler");
app.use("/api/compiler", compilerApi);

// api forum diskusi
const forumApi = require("./forum");
app.use("/api/forum", forumApi);

// api chatbot
const chatBot = require("./chatBot");
app.use("/api/chatbot", chatBot);

// api login
const loginApi = require("./login");
app.use("/api/login", loginApi.router);
app.post("/login", loginApi.login);
app.post("/google-login", loginApi.googleLogin);

const userApi = require("./user");
app.use("/api/user", userApi);

const historyApi = require("./history");
app.use("/api/history", historyApi);

// Middleware untuk memberikan akses ke direktori uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
