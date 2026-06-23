const express = require("express");
const { admin, firestore } = require("./adminConfig");
const router = express.Router();

async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password harus diisi." });
    }

    const userRecord = await admin.auth().getUserByEmail(email);
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.json({ customToken });
  } catch (error) {
    console.error("Login gagal:", error);
    res.status(401).json({ error: "Login gagal" });
  }
}

async function googleLogin(req, res) {
  const { email, role, uid, displayName, photoURL } = req.body;

  if (!uid) {
    return res
      .status(400)
      .json({ error: "uid pengguna harus disertakan dalam data." });
  }

  const data = {
    email,
    role,
    displayName,
    photoURL,
    score: 0,
  };

  try {
    const userRef = firestore.collection("users").doc(uid);
    const userExists = await userRef.get();

    if (userExists.exists) {
      return res.json({ message: "Data pengguna sudah ada di server." });
    }

    await userRef.set(data);
    res.json({ message: "Data berhasil ditambahkan." });
  } catch (error) {
    console.error("Gagal menambahkan data pengguna:", error);
    res.status(500).json({ error: "Gagal menambahkan data." });
  }
}

router.post("/", login);
router.post("/google-login", googleLogin);

module.exports = { router, login, googleLogin };
