const express = require("express");
const { firestore } = require("./adminConfig");
const { spawn, ChildProcess } = require("child_process");
const fs = require("fs");
const { PNG } = require("pngjs");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Konfigurasi Multer untuk menangani unggahan file
const storage = multer.diskStorage({
  destination: "uploads/", // Folder tempat menyimpan file
  filename: (req, file, cb) => {
    const fileName = req.body.fileName || "default"; // Default jika fileName tidak tersedia
    const fileExtension = path.extname(file.originalname); // Mendapatkan ekstensi file asli
    const newFileName = `${fileName}${fileExtension}`;
    cb(null, newFileName); // Nama file yang disimpan di server
  },
});

const upload = multer({ storage: storage });

// Endpoint untuk menyimpan gambar
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const fileName = req.body.fileName;

    const uid = req.body.uid;

    // Periksa apakah uid dan fileName ada sebelum melakukan query
    if (!uid || !fileName) {
      return res
        .status(400)
        .json({ error: "UID dan fileName harus disertakan" });
    }

    // Periksa apakah sudah ada data dengan UID dan fileName yang sama
    const existingData = await firestore
      .collection("image")
      .where("uid", "==", uid)
      .where("fileName", "==", fileName)
      .get();

    if (!existingData.empty) {
      // Jika data sudah ada, kirim pesan kesalahan
      return res.status(400).json({ error: "Anda sudah menggunakan nama ini" });
    }

    // Jika tidak ada data dengan UID dan fileName yang sama, lanjutkan proses penyimpanan
    const url = `/uploads/${req.file.filename}`;

    const imageData = {
      url: url,
      fileName: fileName,
      uid: uid, // Menyimpan nama file ke dalam data
    };

    // Menambahkan data ke koleksi "image" di Firestore
    const firestoreResponse = await firestore
      .collection("image")
      .add(imageData);

    res.status(200).json({ message: "Image saved successfully" });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/mobile", async (req, res) => {
  try {
    const { uid, fileName, image } = req.body;

    // Split data gambar berdasarkan tanda koma (,)
    const imageDataArray = image.split(",");
    // Ambil bagian dari string setelah tanda koma sebagai data base64 sebenarnya
    const imageData = imageDataArray.length === 2 ? imageDataArray[1] : "";

    // Decode data gambar base64 menjadi bentuk biner
    const decodedImage = Buffer.from(imageData, "base64");

    // Tentukan ekstensi file berdasarkan tipe gambar yang diterima
    const fileExtension = ".png"; // Ganti sesuai dengan ekstensi file yang sesuai dengan tipe gambar
    const fileNameWithExtension = fileName + fileExtension;

    // Path untuk menyimpan file di folder uploads
    const uploadPath = path.join(
      __dirname,
      "..",
      "server",
      "uploads",
      fileNameWithExtension
    );

    // Cek apakah direktori uploads sudah ada, jika tidak, buat direktori tersebut
    const uploadDir = path.join(__dirname, "..", "server", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Simpan data gambar ke file di folder uploads
    fs.writeFile(uploadPath, decodedImage, async (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      const existingData = await firestore
        .collection("image")
        .where("uid", "==", uid)
        .where("fileName", "==", fileName)
        .get();

      if (!existingData.empty) {
        // Jika data sudah ada, kirim pesan kesalahan
        return res
          .status(400)
          .json({ error: "Anda sudah menggunakan nama ini" });
      }

      // Jika tidak ada data dengan UID dan fileName yang sama, lanjutkan proses penyimpanan
      const url = `/uploads/${fileNameWithExtension}`;

      const data = {
        url: url,
        fileName: fileName,
        uid: uid, // Menyimpan nama file ke dalam data
      };

      // Menambahkan data ke koleksi "image" di Firestore
      const firestoreResponse = await firestore.collection("image").add(data);

      // Kirim respon setelah penyimpanan ke Firestore berhasil
      res.status(200).json({ message: "Image saved successfully" });
    });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    // Periksa apakah uid ada sebelum melakukan query
    if (!uid) {
      return res.status(400).json({ error: "UID harus disertakan" });
    }

    // Query untuk mendapatkan gambar berdasarkan UID
    const querySnapshot = await firestore
      .collection("image")
      .where("uid", "==", uid)
      .get();

    // Mengumpulkan data gambar dari hasil query
    const images = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Add the document ID as the unique identifier
        data: {
          url: data.url,
          fileName: data.fileName,
          uid: data.uid,
        },
      };
    });

    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint untuk menyimpan gambar
router.post(
  "/mobile/",

  upload.single("image"),
  async (req, res) => {
    try {
      const image = req.body.image;

      const fileName = req.body.fileName;

      const uid = req.body.uid;

      // Periksa apakah uid dan fileName ada sebelum melakukan query
      if (!uid || !fileName) {
        return res
          .status(400)
          .json({ error: "UID dan fileName harus disertakan" });
      }

      // Periksa apakah sudah ada data dengan UID dan fileName yang sama
      const existingData = await firestore
        .collection("image")
        .where("uid", "==", uid)
        .where("fileName", "==", fileName)
        .get();

      if (!existingData.empty) {
        // Jika data sudah ada, kirim pesan kesalahan
        return res
          .status(400)
          .json({ error: "Anda sudah menggunakan nama ini" });
      }

      // Jika tidak ada data dengan UID dan fileName yang sama, lanjutkan proses penyimpanan
      const url = `/uploads/${req.file.filename}`;

      const imageData = {
        url: url,
        fileName: fileName,
        uid: uid, // Menyimpan nama file ke dalam data
      };

      // Menambahkan data ke koleksi "image" di Firestore
      const firestoreResponse = await firestore
        .collection("image")
        .add(imageData);

      res.status(200).json({ message: "Image saved successfully" });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Endpoint untuk mendownload gambar berdasarkan ID
router.get("/download/:id", async (req, res) => {
  try {
    const imageId = req.params.id;

    // Cek apakah ID gambar ada
    if (!imageId) {
      return res.status(400).json({ error: "ID gambar harus disertakan" });
    }

    // Dapatkan data gambar dari Firestore berdasarkan ID
    const imageRef = await firestore.collection("image").doc(imageId).get();

    if (!imageRef.exists) {
      // Jika gambar tidak ditemukan, kirim pesan kesalahan
      return res.status(404).json({ error: "Gambar tidak ditemukan" });
    }

    // Dapatkan nama file gambar dari data Firestore
    const imageData = imageRef.data();
    const fileName = imageData.fileName;

    // Path lengkap menuju file
    const filePath = `uploads/${fileName}.png`;

    // Cek apakah file ada di server
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        // Jika file tidak ditemukan, kirim pesan kesalahan
        return res.status(404).json({ error: "File tidak ditemukan" });
      }

      // Jika file ada, kirim file ke client
      res.download(filePath);
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Cek apakah ID gambar ada
    if (!id) {
      return res.status(400).json({ error: "ID gambar harus disertakan" });
    }

    // Query database atau Firestore untuk mendapatkan informasi tentang gambar berdasarkan ID
    const imageRef = await firestore.collection("image").doc(id);
    const imageDoc = await imageRef.get();

    // Jika tidak ada gambar dengan ID yang diberikan, kirim respons dengan status kode 404
    if (!imageDoc.exists) {
      return res.status(404).json({ error: "Gambar tidak ditemukan" });
    }

    // Path lengkap menuju file
    const filePath = `uploads/${imageDoc.data().fileName}.png`;

    // Hapus gambar dari database atau Firestore
    await imageRef.delete();

    // Hapus gambar dari sistem file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Kirim respons berhasil
    res.status(200).json({ message: "Gambar berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
