const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

require("events").EventEmitter.defaultMaxListeners = 15;

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root status endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "RWikiStat API is running", timestamp: new Date().toISOString() });
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
