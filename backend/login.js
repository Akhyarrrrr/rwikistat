const express = require("express");
const { auth, storage, firestore } = require("./adminConfig");
const multer = require("multer");
const router = express.Router();
const upload = multer();

router.post("/", async (req, res) => {
  try {
    // If authentication is successful, userCredential will contain user information
    const user = userCredential.user;

    // Generate a custom token
    const customToken = await auth.createCustomToken(user.uid);

    // Respond with the custom token
    res.json({ message: "Login berhasil", customToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({ error: "Login gagal" });
  }
});

module.exports = router;
