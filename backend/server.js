const express = require("express");
const adminConfig = require("./adminConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const { firestore, auth } = adminConfig;
const admin = adminConfig.admin;

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
const loginApi = require("./login");
app.use("/api/login", loginApi);

// Backward compatibility: root-level endpoints
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password harus diisi." });
    }
    const userRecord = await auth.getUserByEmail(email);
    const customToken = await auth.createCustomToken(userRecord.uid);
    res.json({ customToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Login gagal" });
  }
});

app.post("/google-login", async (req, res) => {
  const { email, role, uid, displayName, photoURL } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "uid pengguna harus disertakan." });
  }
  try {
    const userRef = firestore.collection("users").doc(uid);
    const userExists = await userRef.get();
    if (userExists.exists) {
      return res.json({ message: "Data pengguna sudah ada di server." });
    }
    await userRef.set({
      email: email || "",
      role: role || "user",
      displayName: displayName || "",
      photoURL: photoURL || "",
      score: 0,
    });
    res.json({ message: "Data berhasil ditambahkan." });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Gagal menambahkan data." });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      customClaims: userRecord.customClaims || {},
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const modulApi = require("./modul");
app.use("/api/modul", modulApi);

const compilerApi = require("./compiler");
app.use("/api/compiler", compilerApi);

const forumApi = require("./forum");
app.use("/api/forum", forumApi);

const chatBot = require("./chatBot");
app.use("/api/chatbot", chatBot);

const userApi = require("./user");
app.use("/api/user", userApi);

const historyApi = require("./history");
app.use("/api/history", historyApi);

const shinyApi = require("./shiny");
app.use("/api/shiny", shinyApi);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
