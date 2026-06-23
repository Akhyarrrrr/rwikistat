const express = require("express");
const adminConfig = require("./adminConfig");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const { firestore, storage } = adminConfig;

// Fungsi untuk menambah skor ke koleksi users
async function addScoreToUser(uid, scoreToAdd) {
  if (!uid) return;

  const userDocRef = firestore.collection("users").doc(uid);
  const userDoc = await userDocRef.get();
  const currentScore = Number(userDoc.data()?.score || 0);

  await userDocRef.set({ score: currentScore + scoreToAdd }, { merge: true });
}

// Rute untuk membuat topik baru
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const topics = req.body.topics;
    const uid = req.body.uid;
    const title = req.body.title;
    const images = req.files;

    if (!uid || !title || !topics) {
      return res
        .status(400)
        .json({ error: "uid, title, dan topics wajib diisi." });
    }

    const topicsData = {
      topics: topics,
      uid: uid,
      title: title,
      createdAt: new Date(),
      likes: 0,
    };

    // Menambahkan data ke koleksi "forum" di Firestore
    const firestoreResponse = await firestore
      .collection("forum")
      .add(topicsData);
    const documentId = firestoreResponse.id;

    // Upload setiap gambar ke Firebase Storage
    const imageUrls = [];

    for (const image of images) {
      const bucket = storage.bucket();
      const fileName = `images/${documentId}/${image.originalname}`;
      const file = bucket.file(fileName);

      // Menyimpan file gambar ke Firebase Storage
      await file.save(image.buffer, {
        metadata: {
          contentType: image.mimetype,
        },
      });

      // Dapatkan URL publik gambar yang diunggah
      const options = {
        version: "v4", // Menggunakan versi API terbaru
        action: "read", // Aksi "read" memungkinkan akses publik
        expires: Date.now() + 1000 * 60 * 60 * 24, // URL berlaku selama satu hari (Anda dapat mengatur berapa lama sesuai kebutuhan)
      };

      const [url] = await file.getSignedUrl(options);
      imageUrls.push(url);
    }

    // Update dokumen Firestore dengan URL gambar
    await firestore
      .collection("forum")
      .doc(documentId)
      .update({ images: imageUrls });

    // Menambah skor pengguna saat memberikan pertanyaan
    const scoreToAdd = 5; // Atur sesuai aturan skor yang Anda tentukan
    await addScoreToUser(uid, scoreToAdd);

    res.json({ message: "Data berhasil ditambahkan." });
  } catch (error) {
    console.error("Gagal menambahkan data:", error);
    res.status(500).json({ error: "Gagal menambahkan data." });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    // Validasi apakah query telah diberikan
    if (!query) {
      return res
        .status(400)
        .json({ error: "Parameter query tidak ditemukan." });
    }

    // Mencari data di koleksi 'forum' menggunakan Firebase Firestore
    const forumsRef = firestore.collection("forum");
    const snapshot = await forumsRef
      .where("title", ">=", query)
      .where("title", "<=", query + "\uf8ff")
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

    return res.json(forumData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Terjadi kesalahan dalam server." });
  }
});

const itemsPerPage = 5; // Jumlah item per halaman

router.get("/page/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Ambil nomor halaman dari parameter query
    const startIndex = (page - 1) * itemsPerPage;

    // Hitung totalItems (jumlah total item di koleksi 'forum')
    const totalItemsSnapshot = await firestore.collection("forum").get();
    const totalItems = totalItemsSnapshot.size;

    const snapshot = await firestore
      .collection("forum")
      .orderBy("createdAt", "desc")
      .limit(itemsPerPage)
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
    });
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.get("/", async (req, res) => {
  try {
    // Hitung totalItems (jumlah total item di koleksi 'forum')
    const totalItemsSnapshot = await firestore.collection("forum").get();
    const totalItems = totalItemsSnapshot.size;

    const snapshot = await firestore
      .collection("forum")
      .orderBy("createdAt", "desc")
      // .limit(itemsPerPage)
      // .offset(startIndex)
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

    res.json({
      forumData: forumData,
    });
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.get("/user/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    const userSnapshot = await firestore.collection("users").doc(uid).get();
    const user = userSnapshot.data();

    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan." });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      photo: user.photo,
    });
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    res.status(500).json({ error: "Gagal mengambil data user." });
  }
});

async function getCommentCount(forumId) {
  const topicRef = firestore.collection("forum").doc(forumId);
  const commentsSnapshot = await topicRef.collection("comments").get();

  return commentsSnapshot.size;
}

router.get("/:id", async (req, res) => {
  const forumId = req.params.id; // Mengambil ID dari parameter rute

  try {
    const forumDoc = await firestore.collection("forum").doc(forumId).get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const commentCount = await getCommentCount(forumId);

      // Panggil endpoint untuk mendapatkan data user berdasarkan userId
      const userSnapshot = await firestore
        .collection("users")
        .doc(forumData.uid)
        .get();
      const user = userSnapshot.data();

      res.json({
        id: forumDoc.id,
        data: forumData,
        user: user,
        commentCount: commentCount,
      });
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

// Rute untuk menambahkan komentar ke topik
router.post("/:topicId/comments", async (req, res) => {
  try {
    const { topicId } = req.params;
    const { text, uid } = req.body;

    if (!uid || !text) {
      return res.status(400).json({ error: "uid dan text wajib diisi." });
    }

    // Data komentar yang akan ditambahkan
    const commentData = {
      text: text,
      uid: uid,
      createdAt: new Date(),
    };

    // Menambahkan komentar ke koleksi komentar dalam dokumen topik yang sesuai
    const topicRef = firestore.collection("forum").doc(topicId);
    await topicRef.collection("comments").add(commentData);

    // Menambah skor pengguna saat memberikan pertanyaan
    const scoreToAdd = 10; // Atur sesuai aturan skor yang Anda tentukan
    await addScoreToUser(uid, scoreToAdd);

    res.json({ message: "Komentar berhasil ditambahkan." });
  } catch (error) {
    console.error("Gagal menambahkan komentar:", error);
    res.status(500).json({ error: "Gagal menambahkan komentar." });
  }
});

// Rute untuk mendapatkan komentar dari suatu topik
router.get("/:topicId/comments", async (req, res) => {
  try {
    const { topicId } = req.params;

    // Dapatkan koleksi komentar dari dokumen topik yang sesuai
    const topicRef = firestore.collection("forum").doc(topicId);
    const commentsSnapshot = await topicRef
      .collection("comments")
      .orderBy("createdAt", "desc")
      .get();

    const comments = [];
    // Gunakan Promise.all untuk menunggu semua panggilan asinkron selesai
    await Promise.all(
      commentsSnapshot.docs.map(async (doc) => {
        // Panggil endpoint untuk mendapatkan data user berdasarkan userId
        const userSnapshot = await firestore
          .collection("users")
          .doc(doc.data().uid)
          .get();
        const user = userSnapshot.data();

        comments.push({
          id: doc.id,
          data: doc.data(),
          user: user, // Tambahkan data user ke objek komentar
        });
      })
    );

    res.json(comments);
  } catch (error) {
    console.error("Gagal mengambil komentar:", error);
    res.status(500).json({ error: "Gagal mengambil komentar." });
  }
});

// Rute untuk memberikan "like" pada postingan
router.post("/like/:id", async (req, res) => {
  const forumId = req.params.id;
  const uid = req.body.uid; // Ambil ID pengguna yang sudah masuk

  if (!uid) {
    return res.status(400).json({ error: "uid wajib diisi." });
  }

  try {
    // Dapatkan dokumen postingan berdasarkan ID
    const forumDocRef = firestore.collection("forum").doc(forumId);
    const forumDoc = await forumDocRef.get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const likedBy = forumData.likedBy || [];

      // Periksa apakah pengguna sudah memberikan "like"
      if (!likedBy.includes(uid)) {
        // Tambahkan ID pengguna ke array "likedBy"
        likedBy.push(uid);

        // Perbarui jumlah "like" dan array "likedBy" di dokumen postingan
        await forumDocRef.update({
          likes: forumData.likes + 1,
          likedBy: likedBy,
        });

        res.json({ message: "Postingan disukai." });
      } else {
        res
          .status(400)
          .json({ error: "Anda sudah memberikan like pada postingan ini." });
      }
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal menyukai postingan:", error);
    res.status(500).json({ error: "Gagal menyukai postingan." });
  }
});

// Rute untuk unlike postingan
router.post("/unlike/:id", async (req, res) => {
  const forumId = req.params.id;
  const uid = req.body.uid; // Ambil ID pengguna yang sudah masuk

  if (!uid) {
    return res.status(400).json({ error: "uid wajib diisi." });
  }

  try {
    // Dapatkan dokumen postingan berdasarkan ID
    const forumDocRef = firestore.collection("forum").doc(forumId);
    const forumDoc = await forumDocRef.get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const likedBy = forumData.likedBy || [];

      // Periksa apakah pengguna sudah memberikan like
      if (likedBy.includes(uid)) {
        // Hapus ID pengguna dari array "likedBy"
        likedBy.splice(likedBy.indexOf(uid), 1);

        // Perbarui jumlah "like" dan array "likedBy" di dokumen postingan
        await forumDocRef.update({
          likes: forumData.likes - 1,
          likedBy: likedBy,
        });

        res.json({ message: "Postingan tidak disukai." });
      } else {
        res
          .status(400)
          .json({ error: "Anda belum memberikan like pada postingan ini." });
      }
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal unlike postingan:", error);
    res.status(500).json({ error: "Gagal unlike postingan." });
  }
});

// Rute untuk memeriksa apakah user sudah memberikan like
router.get("/like/:id/is-liked", async (req, res) => {
  const forumId = req.params.id;
  const uid = req.query.uid; // Ambil ID pengguna dari query parameters

  try {
    // Pastikan parameter forumId ada dan sesuai
    if (!forumId || typeof forumId !== "string") {
      return res.status(400).json({ error: "Invalid forum ID" });
    }

    // Pastikan parameter userId ada dan sesuai
    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ error: "Invalid user uid" });
    }

    // Lakukan autentikasi atau otorisasi di sini untuk memeriksa apakah pengguna memiliki izin
    // untuk mengakses data like.

    // Dapatkan dokumen postingan berdasarkan ID
    const forumDocRef = firestore.collection("forum").doc(forumId);
    const forumDoc = await forumDocRef.get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const likedBy = forumData.likedBy || [];

      // Periksa apakah ID pengguna ada di array "likedBy"
      const isLiked = likedBy.includes(uid);

      res.json({
        isLiked: isLiked,
      });
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal memeriksa apakah user sudah memberikan like:", error);
    res
      .status(500)
      .json({ error: "Gagal memeriksa apakah user sudah memberikan like." });
  }
});

// Rute untuk memberikan "bookmark" pada postingan
router.post("/bookmark/:id", async (req, res) => {
  const forumId = req.params.id;
  const uid = req.body.uid; // Ambil ID pengguna yang sudah masuk

  if (!uid) {
    return res.status(400).json({ error: "uid wajib diisi." });
  }

  try {
    // Dapatkan dokumen postingan berdasarkan ID
    const forumDocRef = firestore.collection("forum").doc(forumId);
    const forumDoc = await forumDocRef.get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const bookmarks = forumData.bookmarks || [];

      // Periksa apakah pengguna sudah memberikan "like"
      if (!bookmarks.includes(uid)) {
        // Tambahkan ID pengguna ke array "likedBy"
        bookmarks.push(uid);

        // Perbarui jumlah "like" dan array "likedBy" di dokumen postingan
        await forumDocRef.update({
          bookmarks: bookmarks,
        });

        res.json({ message: "Postingan dibookmark." });
      } else {
        res.status(400).json({
          error: "Anda sudah memberikan bookmark pada postingan ini.",
        });
      }
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal bookamrk postingan:", error);
    res.status(500).json({ error: "Gagal bookmark postingan." });
  }
});

// Rute untuk unlike postingan
router.post("/unbookmark/:id", async (req, res) => {
  const forumId = req.params.id;
  const uid = req.body.uid; // Ambil ID pengguna yang sudah masuk

  if (!uid) {
    return res.status(400).json({ error: "uid wajib diisi." });
  }

  try {
    // Dapatkan dokumen postingan berdasarkan ID
    const forumDocRef = firestore.collection("forum").doc(forumId);
    const forumDoc = await forumDocRef.get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const bookmarks = forumData.bookmarks || [];

      // Periksa apakah pengguna sudah memberikan like
      if (bookmarks.includes(uid)) {
        // Hapus ID pengguna dari array "likedBy"
        bookmarks.splice(bookmarks.indexOf(uid), 1);

        // Perbarui jumlah "like" dan array "likedBy" di dokumen postingan
        await forumDocRef.update({
          bookmarks: bookmarks,
        });

        res.json({ message: "Postingan di unbookmark." });
      } else {
        res.status(400).json({
          error: "Anda belum memberikan bookmark pada postingan ini.",
        });
      }
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal unbookmark postingan:", error);
    res.status(500).json({ error: "Gagal unbookmark postingan." });
  }
});

// Rute untuk memeriksa apakah user sudah memberikan bookmark
router.get("/bookmark/:id/is-bookmarked", async (req, res) => {
  const forumId = req.params.id;
  const uid = req.query.uid; // Ambil ID pengguna dari query parameters

  try {
    // Pastikan parameter forumId ada dan sesuai
    if (!forumId || typeof forumId !== "string") {
      return res.status(400).json({ error: "Invalid forum ID" });
    }

    // Pastikan parameter userId ada dan sesuai
    if (!uid || typeof uid !== "string") {
      return res.status(400).json({ error: "Invalid user uid" });
    }

    // Lakukan autentikasi atau otorisasi di sini untuk memeriksa apakah pengguna memiliki izin
    // untuk mengakses data like.

    // Dapatkan dokumen postingan berdasarkan ID
    const forumDocRef = firestore.collection("forum").doc(forumId);
    const forumDoc = await forumDocRef.get();

    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      const bookmarks = forumData.bookmarks || [];

      // Periksa apakah ID pengguna ada di array "likedBy"
      const isBookmarked = bookmarks.includes(uid);

      res.json({
        isBookmarked: isBookmarked,
      });
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error(
      "Gagal memeriksa apakah user sudah memberikan Bookmark:",
      error
    );
    res.status(500).json({
      error: "Gagal memeriksa apakah user sudah memberikan Bookmark.",
    });
  }
});

// Rute untuk mendapatkan postingan yang di-bookmark oleh pengguna
router.get("/bookmarks/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const page = parseInt(req.query.page) || 1; // Ambil nomor halaman dari parameter query
    const startIndex = (page - 1) * itemsPerPage;

    const query = firestore
      .collection("forum")
      .where("bookmarks", "array-contains", uid);

    // Hitung totalItems (jumlah total item yang cocok dengan query)
    const totalItemsSnapshot = await query.get();
    const totalBookmarks = totalItemsSnapshot.size;

    const snapshot = await query
      // .orderBy('createdAt', 'desc')
      .limit(itemsPerPage)
      .offset(startIndex)
      .get();

    const bookmarkPromises = snapshot.docs.map(async (doc) => {
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

    const bookmark = await Promise.all(bookmarkPromises);

    const totalBookmarkPages = Math.ceil(totalBookmarks / itemsPerPage);

    const paginatedBookmark = bookmark.slice(0, itemsPerPage); // Mengambil 5 item pertama

    res.json({
      bookmarks: paginatedBookmark,
      currentBookmarkPage: page,
      totalBookmarkPages: totalBookmarkPages,
      totalBookmarks: totalBookmarks,
    });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang dibookmark:", error);
    res
      .status(500)
      .json({ error: "Gagal mendapatkan postingan yang dibookmark." });
  }
});

// Rute untuk mendapatkan postingan yang di-bookmark oleh pengguna
router.get("/bookmarks-all/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    const query = firestore
      .collection("forum")
      .where("bookmarks", "array-contains", uid);

    // Hitung totalItems (jumlah total item yang cocok dengan query)
    const totalItemsSnapshot = await query.get();
    const totalBookmarks = totalItemsSnapshot.size;

    const snapshot = await query.get();

    const bookmarkPromises = snapshot.docs.map(async (doc) => {
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

    const bookmark = await Promise.all(bookmarkPromises);

    res.json({
      bookmarks: bookmark,
      totalBookmarks: totalBookmarks,
    });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang dibookmark:", error);
    res
      .status(500)
      .json({ error: "Gagal mendapatkan postingan yang dibookmark." });
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

    const forumData = await Promise.all(forumDataPromises); // Mengambil 5 item pertama

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
      .limit(itemsPerPage)
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

// Rute untuk menghapus postingan berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Hapus dokumen dari koleksi "forum"
    await firestore.collection("forum").doc(id).delete();

    res.json({ message: "Postingan berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus postingan:", error);
    res.status(500).json({ error: "Gagal menghapus postingan." });
  }
});


module.exports = router;
