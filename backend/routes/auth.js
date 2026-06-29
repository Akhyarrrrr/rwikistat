const express = require("express");
const router = express.Router();
const { admin, firestore } = require("../adminConfig");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "Email, password, dan displayName harus diisi." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter." });
    }
    const userRecord = await admin.auth().createUser({ email, password, displayName });
    await firestore.collection("users").doc(userRecord.uid).set({
      email, displayName, role: "user", photoURL: "", score: 0, verified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === "auth/email-already-exists") {
      return res.status(409).json({ error: "Email sudah terdaftar." });
    }
    res.status(500).json({ error: "Gagal mendaftarkan pengguna." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "idToken harus diisi." });
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    let userDoc = await firestore.collection("users").doc(uid).get();
    let userData = userDoc.exists ? userDoc.data() : null;
    if (!userData) {
      const userRecord = await admin.auth().getUser(uid);
      userData = {
        email: userRecord.email || "", displayName: userRecord.displayName || "",
        role: "user", photoURL: userRecord.photoURL || "", score: 0, verified: false,
      };
      await firestore.collection("users").doc(uid).set({
        ...userData, createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    res.json({
      uid, email: userData.email, displayName: userData.displayName, role: userData.role,
      photoURL: userData.photoURL || "", score: userData.score || 0, verified: userData.verified || false,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Token tidak valid." });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await firestore.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan." });
    }
    const data = userDoc.data();
    res.json({
      uid, email: data.email, displayName: data.displayName, role: data.role,
      photoURL: data.photoURL || "", score: data.score || 0, verified: data.verified || false,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ error: "Token tidak valid." });
  }
});

module.exports = router;
