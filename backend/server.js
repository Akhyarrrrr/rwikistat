const express = require("express");
const adminConfig = require("./adminConfig");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 8080;
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

require("events").EventEmitter.defaultMaxListeners = 15;

// Gunakan objek admin dan firestore dari adminConfig
const { firestore, auth } = adminConfig;
const admin = adminConfig.admin;
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
app.use("/api/login", loginApi);

const userApi = require("./user");
app.use("/api/user", userApi);

const historyApi = require("./history");
app.use("/api/history", historyApi);

// Middleware untuk memberikan akses ke direktori uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user data from Firebase Authentication
    const userRecord = await auth.getUser(userId);

    // Extract relevant user data and custom claims
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      // Add other user properties as needed
      customClaims: userRecord.customClaims || {}, // Display custom claims
      isVerified: userRecord.isVerified,
    };
    console.log(userData.isVerified);

    // Respond with user data
    res.json(userData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Server Express
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Lakukan validasi email dan password
    if (!email || !password) {
      throw new Error("Email dan password harus diisi.");
    }

    // Dapatkan informasi pengguna berdasarkan email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Jika email valid, hasilkan custom token
    const customToken = await admin.auth().createCustomToken(userRecord.email);

    // Kirim custom token sebagai respons
    res.json({ customToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({ error: "Login gagal" });
  }
});

app.post("/google-login", async (req, res) => {
  const { email, role, uid, displayName, photoURL } = req.body;
  const score = 0;
  const data = { email, role, displayName, photoURL, score };

  if (!uid) {
    res
      .status(400)
      .json({ error: "uid pengguna harus disertakan dalam data." });
    return;
  }

  // Periksa apakah ID pengguna sudah ada di collection user
  const userRef = firestore.collection("users").doc(uid);
  const userExists = await userRef.get();

  // Jika ID pengguna sudah ada, maka tidak perlu menambahkan data lagi
  if (userExists.exists) {
    console.log("Data pengguna sudah ada di server.");
    res.json({ message: "Data pengguna sudah ada di server." });
    return;
  } else {
    firestore
      .collection("users")
      .doc(uid) // Gunakan UID sebagai nama dokumen
      .set(data) // Set data pada dokumen tersebut
      .then(() => {
        console.log("Data berhasil ditambahkan dengan ID:", uid);
        res.json({ message: "Data berhasil ditambahkan." });
      })
      .catch((error) => {
        console.error("Gagal menambahkan data:", error);
        res.status(500).json({ error: "Gagal menambahkan data." });
      });
  }
});

app.get("/api/user/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const userRecord = await admin.auth().getUser(uid);
    const userData = {
      email: userRecord.email,
      displayName: userRecord.displayName,
      created: userRecord.created,
      // email: userRecord.email,
      // Tambahkan properti pengguna lainnya sesuai kebutuhan
    };

    res.json(userData);
  } catch (error) {
    res.status(404).json({ error: "Pengguna tidak ditemukan" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
