const express = require("express");
const { admin, storage, firestore } = require("../adminConfig");
const multer = require("multer");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Hanya file PDF yang diperbolehkan."));
  },
}).single("pdfFile");

router.post("/", verifyToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Gagal mengunggah file." });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ error: "File PDF tidak ditemukan." });
      }
      const { codeSampel, namaModul, judulModul, urlShiny, textData, textMarkdown } = req.body;
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${req.file.originalname}`;
      const file = storage.bucket().file(`modul/${uniqueFileName}`);
      await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
      const options = { version: "v4", action: "read", expires: Date.now() + 7 * 24 * 60 * 60 * 1000 };
      const [publicUrl] = await file.getSignedUrl(options);
      const modulRef = await firestore.collection("modul").add({
        pdfPath: publicUrl, codeSampel, judulModul, namaModul, urlShiny, textData, textMarkdown,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Data modul berhasil ditambahkan dengan ID:", modulRef.id);
      res.json({ message: "File PDF berhasil diunggah dan data modul berhasil ditambahkan." });
    } catch (error) {
      console.error("Gagal menyimpan data modul:", error);
      res.status(500).json({ error: "Gagal menyimpan data modul." });
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const querySnapshot = await firestore.collection("modul").orderBy("namaModul", "asc").get();
    const users = [];
    querySnapshot.forEach((doc) => users.push({ id: doc.id, data: doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const doc = await firestore.collection("modul").doc(req.params.id).get();
    if (doc.exists) {
      const modulData = doc.data();
      res.json({ id: doc.id, data: { ...modulData, pdfPath: modulData.pdfPath } });
    } else {
      res.status(404).json({ error: "Data tidak ditemukan." });
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await firestore.collection("modul").doc(req.params.id).delete();
    res.json({ message: "Data berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    res.status(500).json({ error: "Gagal menghapus data." });
  }
});

module.exports = router;
