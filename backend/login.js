const express = require("express");
const { auth, firestore } = require("./adminConfig");
const router = express.Router();

router.post("/", async (req, res) => {
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

router.post("/google-login", async (req, res) => {
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

router.get("/user/:userId", async (req, res) => {
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

module.exports = router;
