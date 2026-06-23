const express = require("express");
const { admin, storage, firestore } = require("./adminConfig");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Konfigurasi multer untuk mengunggah gambar dan PDF
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = "uploads/pdf";
      fs.mkdirSync(folderName, { recursive: true });
      cb(null, folderName);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // Batas ukuran file 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PDF yang diperbolehkan."));
    }
  },
}).single("pdfFile");

// Rute untuk mengunggah file PDF
router.post("/", (req, res) => {
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

      const codeSampel = req.body.codeSampel;
      const namaModul = req.body.namaModul;
      const judulModul = req.body.judulModul;
      const urlShiny = req.body.urlShiny;
      const textData = req.body.textData;
      const textMarkdown = req.body.textMarkdown;

      // Membuat nama unik untuk file PDF
      const uniqueFileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}_${req.file.originalname}`;
      const folderName = "modul";
      const fileName = `${folderName}/${uniqueFileName}`;

      // Referensi ke bucket Firebase Storage
      const bucket = storage.bucket();
      const file = bucket.file(fileName);

      // Baca file dari disk
      const fileBuffer = fs.readFileSync(req.file.path);

      // Menyimpan file PDF ke Firebase Storage
      await file.save(fileBuffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Hapus file temporary
      fs.unlinkSync(req.file.path);

      // Dapatkan URL publik untuk file PDF yang diunggah
      const options = {
        version: "v4",
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      const [publicUrl] = await file.getSignedUrl(options);

      // Simpan URL file PDF yang dapat diakses ke koleksi 'modul' bersama data lainnya
      const modulData = {
        pdfPath: publicUrl,
        codeSampel,
        judulModul,
        namaModul,
        urlShiny,
        textData,
        textMarkdown,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await firestore.collection("modul").add(modulData);
      res.json({
        message:
          "File PDF berhasil diunggah dan data modul berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Gagal menyimpan data modul:", error);
      res.status(500).json({ error: "Gagal menyimpan data modul." });
    }
  });
});

// Endpoint untuk mengunggah file PDF dan gambar
router.post("/test", (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Terjadi kesalahan saat mengunggah
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Terjadi kesalahan yang tidak diketahui
      return res.status(500).json({ error: "Gagal mengunggah file." });
    }

    try {
      const folderName = `uploads/${req.body.namaModul}`;
      const imageUrls = req.files["imageFiles"].map(
        (image) => `${folderName}/${image.filename}`
      );
      const pdfUrl = `${folderName}/${req.files["pdfFile"][0].filename}`;

      // Pastikan folder untuk modul sudah dibuat
      fs.mkdirSync(folderName, { recursive: true });

      const modulData = {
        imagePaths: imageUrls,
        pdfPath: pdfUrl,
        codeSampel: req.body.codeSampel,
        judulModul: req.body.judulModul,
        namaModul: req.body.namaModul,
        urlShiny: req.body.urlShiny,
        textData: req.body.textData,
      };

      await firestore.collection("modul").add(modulData);
      res.json({
        message: "File berhasil diunggah dan data modul berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Gagal menyimpan data modul:", error);
      res.status(500).json({ error: "Gagal menyimpan data modul." });
    }
  });
});

// Mengambil semua dokumen dari koleksi "modul"
router.get("/", (req, res) => {
  firestore
    .collection("modul")
    .orderBy("namaModul", "asc")
    .get()
    .then((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      res.json(users);
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      res.status(500).json({ error: "Gagal mengambil data." });
    });
});

// Endpoint untuk mengambil data berdasarkan ID
router.get("/:id", (req, res) => {
  const testItemId = req.params.id;

  // Mengambil data berdasarkan ID
  firestore
    .collection("modul")
    .doc(testItemId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const modulData = doc.data();
        const pdfPath = modulData.pdfPath; // URL file PDF

        // Mengirim data modul beserta URL file PDF ke klien
        res.json({ id: doc.id, data: { ...modulData, pdfPath } });
      } else {
        res.status(404).json({ error: "Data tidak ditemukan." });
      }
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      res.status(500).json({ error: "Gagal mengambil data." });
    });
});

// Endpoint untuk menghapus data berdasarkan ID
router.delete("/:id", (req, res) => {
  const testItemId = req.params.id;

  // Menghapus data berdasarkan ID
  firestore
    .collection("modul")
    .doc(testItemId)
    .delete()
    .then(() => {
      res.json({ message: "Data berhasil dihapus." });
    })
    .catch((error) => {
      console.error("Gagal menghapus data:", error);
      res.status(500).json({ error: "Gagal menghapus data." });
    });
});

module.exports = router;
