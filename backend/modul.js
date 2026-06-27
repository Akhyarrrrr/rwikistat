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

// Middleware untuk verifikasi token bearer
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;

    // Verifikasi token menggunakan Firebase Admin SDK atau metode autentikasi yang sesuai
    admin
      .auth()
      .verifyIdToken(bearerToken)
      .then((decodedToken) => {
        req.user = decodedToken;
        next(); // Lanjutkan ke middleware atau fungsi berikutnya setelah autentikasi
      })
      .catch((error) => {
        console.error("Token tidak valid:", error);
        res.status(403).json({ error: "Token tidak valid." });
      });
  } else {
    // Jika tidak ada token
    res.status(403).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }
};

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

      const modulRef = await firestore.collection("modul").add(modulData);

      console.log("Data modul berhasil ditambahkan dengan ID:", modulRef.id);
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
