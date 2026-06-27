const express = require("express");
const { admin, firestore, storage } = require("../adminConfig");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/verifyToken");

const upload = multer({ storage: multer.memoryStorage() }).single("image");

const BUCKET_NAME = process.env.FIREBASE_STORAGE_BUCKET || "rwikistat-538da.firebasestorage.app";
const SIGNED_URL_EXPIRY = 7 * 24 * 60 * 60 * 1000;

async function uploadToGCS(buffer, destination) {
  const bucket = storage.bucket();
  const file = bucket.file(destination);
  await file.save(buffer, { metadata: { contentType: "image/png" } });
  const [url] = await file.getSignedUrl({ version: "v4", action: "read", expires: Date.now() + SIGNED_URL_EXPIRY });
  return url;
}

router.post("/", verifyToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "Gagal mengunggah file." });
    try {
      const { fileName } = req.body;
      const uid = req.user.uid;
      if (!uid || !fileName || !req.file) {
        return res.status(400).json({ error: "UID, fileName, dan file harus disertakan" });
      }
      const existingData = await firestore.collection("image").where("uid", "==", uid).where("fileName", "==", fileName).get();
      if (!existingData.empty) {
        return res.status(400).json({ error: "Anda sudah menggunakan nama ini" });
      }
      const gcsPath = `images/history/${uid}_${Date.now()}_${fileName}.png`;
      const url = await uploadToGCS(req.file.buffer, gcsPath);
      await firestore.collection("image").add({ url, gcsPath, fileName, uid });
      res.status(200).json({ message: "Image saved successfully" });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

router.post("/mobile", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { fileName, image } = req.body;
    const imageData = image.split(",");
    const decodedImage = Buffer.from(imageData.length === 2 ? imageData[1] : "", "base64");
    const existingData = await firestore.collection("image").where("uid", "==", uid).where("fileName", "==", fileName).get();
    if (!existingData.empty) {
      return res.status(400).json({ error: "Anda sudah menggunakan nama ini" });
    }
    const gcsPath = `images/history/${uid}_${Date.now()}_${fileName}.png`;
    const url = await uploadToGCS(decodedImage, gcsPath);
    await firestore.collection("image").add({ url, gcsPath, fileName, uid });
    res.status(200).json({ message: "Image saved successfully" });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    if (!uid) return res.status(400).json({ error: "UID harus disertakan" });
    const querySnapshot = await firestore.collection("image").where("uid", "==", uid).get();
    const images = querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/download/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    if (!imageId) return res.status(400).json({ error: "ID gambar harus disertakan" });
    const imageRef = await firestore.collection("image").doc(imageId).get();
    if (!imageRef.exists) return res.status(404).json({ error: "Gambar tidak ditemukan" });
    const { url } = imageRef.data();
    res.redirect(url);
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "ID gambar harus disertakan" });
    const imageRef = firestore.collection("image").doc(id);
    const imageDoc = await imageRef.get();
    if (!imageDoc.exists) return res.status(404).json({ error: "Gambar tidak ditemukan" });
    const { gcsPath } = imageDoc.data();
    if (gcsPath) {
      try { await storage.bucket().file(gcsPath).delete(); } catch {}
    }
    await imageRef.delete();
    res.status(200).json({ message: "Gambar berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
