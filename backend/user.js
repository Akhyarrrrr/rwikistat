const express = require("express");
const router = express.Router();
const adminConfig = require("./adminConfig");
const { firestore, admin } = adminConfig;

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

router.post("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    // Dapatkan referensi ke collection user di Firestore
    const userRef = firestore.collection("users").doc(uid);

    // Update field verified menjadi true
    await userRef.update({ verified: true });

    // Kirim response sukses
    res.json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get('/', async (req, res) => {
//     try {
//       // Dapatkan referensi ke collection users
//       const usersRef = firestore.collection('users');

//       // Fetch semua data user
//       const querySnapshot = await usersRef.get();
//       const usersData = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       // Kirim response dengan data user
//       res.json(usersData);
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

// Mengambil semua dokumen dari koleksi "modul"
router.get("/", (req, res) => {
  firestore
    .collection("users")
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

router.get("/:id", (req, res) => {
  const id = req.params.id;

  firestore
    .collection("users")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json(doc.data());
      } else {
        res.status(404).json({ message: "Data tidak ditemukan." });
      }
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      res.status(500).json({ error: "Gagal mengambil data." });
    });
});

const itemsPerPage = 5;

// Rute untuk mendapatkan postingan yang diposting oleh pengguna
router.get("/posted/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const page = parseInt(req.query.page) || 1; // Ambil nomor halaman dari parameter query
    const startIndex = (page - 1) * itemsPerPage;

    // Dapatkan postingan yang memiliki bookmark oleh pengguna tertentu
    const query = firestore.collection("forum").where("uid", "==", uid);

    // Hitung totalItems (jumlah total item yang cocok dengan query)
    const totalItemsSnapshot = await query.get();
    const totalItems = totalItemsSnapshot.size;

    const snapshot = await query
      // .orderBy('createdAt', 'desc')
      // .limit(itemsPerPage)
      .offset(startIndex)
      .get();

    const forumDataPromises = snapshot.docs.map(async (doc) => {
      // Panggil endpoint untuk mendapatkan data user berdasarkan userId
      const userSnapshot = await firestore
        .collection("users")
        .doc(doc.data().uid)
        .get();
      const user = userSnapshot.data();

      return {
        id: doc.id,
        data: doc.data(),
        user: user,
      };
    });

    const forumData = await Promise.all(forumDataPromises);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = forumData.slice(0, itemsPerPage); // Mengambil 5 item pertama

    res.json({
      forumData: paginatedData,
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalItems,
    });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang diposting:", error);
    res
      .status(500)
      .json({ error: "Gagal mendapatkan postingan yang diposting." });
  }
});

// Rute untuk mendapatkan postingan yang diposting oleh pengguna
router.get("/posted-all/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    // Dapatkan postingan yang memiliki bookmark oleh pengguna tertentu
    const query = firestore.collection("forum").where("uid", "==", uid);

    // Hitung totalItems (jumlah total item yang cocok dengan query)
    const totalItemsSnapshot = await query.get();
    const totalItems = totalItemsSnapshot.size;

    const snapshot = await query.get();

    const forumDataPromises = snapshot.docs.map(async (doc) => {
      // Panggil endpoint untuk mendapatkan data user berdasarkan userId
      const userSnapshot = await firestore
        .collection("users")
        .doc(doc.data().uid)
        .get();
      const user = userSnapshot.data();

      return {
        id: doc.id,
        data: doc.data(),
        user: user,
      };
    });

    const forumData = await Promise.all(forumDataPromises);

    res.json({
      forumData: forumData,
      totalPosts: totalItems,
    });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang diposting:", error);
    res
      .status(500)
      .json({ error: "Gagal mendapatkan postingan yang diposting." });
  }
});

// Rute untuk mendapatkan skor pengguna
router.get("/:uid/score", async (req, res) => {
  try {
    const uid = req.params.uid;

    // Ambil data pengguna dari Firestore
    const userDoc = await firestore.collection("users").doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      res.status(404).json({ error: "Pengguna tidak ditemukan." });
      return;
    }

    const userScore = userData.score || 0;

    res.json({ uid, score: userScore });
  } catch (error) {
    console.error("Gagal mendapatkan skor pengguna:", error);
    res.status(500).json({ error: "Gagal mendapatkan skor pengguna." });
  }
});

router.delete("/:uid", verifyToken, async (req, res) => {
  try {
    const uid = req.params.uid;

    // Hapus user dari Firestore
    await firestore.collection("users").doc(uid).delete();

    // Hapus user dari Firebase Authentication
    await admin.auth().deleteUser(uid);

    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    res.status(500).json({ error: "Gagal menghapus user." });
  }
});

module.exports = router;
