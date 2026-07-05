const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
const { admin, firestore, storage } = require("../adminConfig");
const verifyToken = require("../middleware/verifyToken");

async function addScoreToUser(uid, scoreToAdd) {
  await firestore.collection("users").doc(uid).set({
    score: admin.firestore.FieldValue.increment(scoreToAdd),
    uid,
    createdAt: new Date(),
  }, { merge: true });
}

async function isAdmin(uid) {
  const doc = await firestore.collection("users").doc(uid).get();
  return doc.exists && doc.data().role === "admin";
}

async function forumResponse(doc) {
  const data = doc.data();
  const user = (await firestore.collection("users").doc(data.uid).get()).data() || {};
  const commentCount = await getCommentCount(doc.id);
  return {
    id: doc.id,
    data,
    user: {
      uid: data.uid,
      displayName: user.displayName || "Pengguna",
      photoURL: user.photoURL || "",
      verified: user.verified || false,
    },
    commentCount,
  };
}

async function queryCount(query) {
  const snapshot = await query.count().get();
  return snapshot.data().count;
}

router.post("/", verifyToken, upload.array("images", 3), async (req, res) => {
  try {
    const { topics, title } = req.body;
    const uid = req.user.uid;
    const images = req.files;
    const firestoreResponse = await firestore.collection("forum").add({ topics, uid, title, createdAt: new Date(), likes: 0 });
    const documentId = firestoreResponse.id;
    const imageUrls = [];
    const imagePaths = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const bucket = storage.bucket();
        const fileName = `images/forum/${documentId}/${Date.now()}_${image.originalname}`;
        const file = bucket.file(fileName);
        await file.save(image.buffer, { metadata: { contentType: image.mimetype } });
        const options = { version: "v4", action: "read", expires: Date.now() + 1000 * 60 * 60 * 24 };
        const [url] = await file.getSignedUrl(options);
        imageUrls.push(url);
        imagePaths.push(fileName);
      }
    }
    await firestore.collection("forum").doc(documentId).update({ images: imageUrls, imagePaths });
    await addScoreToUser(uid, 5);
    res.json({ message: "Data berhasil ditambahkan." });
  } catch (error) {
    console.error("Gagal menambahkan data:", error);
    res.status(500).json({ error: "Gagal menambahkan data." });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Parameter query tidak ditemukan." });
    }
    const snapshot = await firestore.collection("forum").where("title", ">=", query).where("title", "<=", query + "\uf8ff").get();
    const forumData = await Promise.all(snapshot.docs.map(forumResponse));
    res.json(forumData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan dalam server." });
  }
});

const itemsPerPage = 5;

router.get("/page/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const query = firestore.collection("forum").orderBy("createdAt", "desc");
    const totalItems = await queryCount(firestore.collection("forum"));
    const snapshot = await query.offset(startIndex).limit(itemsPerPage).get();
    const forumData = await Promise.all(snapshot.docs.map(forumResponse));
    res.json({ forumData, currentPage: page, totalPages: Math.ceil(totalItems / itemsPerPage) });
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.get("/", async (req, res) => {
  try {
    const snapshot = await firestore.collection("forum").orderBy("createdAt", "desc").get();
    const forumData = await Promise.all(snapshot.docs.map(forumResponse));
    res.json({ forumData });
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.get("/user/:uid", async (req, res) => {
  try {
    const user = (await firestore.collection("users").doc(req.params.uid).get()).data();
    if (!user) return res.status(404).json({ error: "User tidak ditemukan." });
    res.json({ id: user.id, name: user.name, photo: user.photo });
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    res.status(500).json({ error: "Gagal mengambil data user." });
  }
});

async function getCommentCount(forumId) {
  return (await firestore.collection("forum").doc(forumId).collection("comments").get()).size;
}

router.get("/:id", async (req, res) => {
  try {
    const forumDoc = await firestore.collection("forum").doc(req.params.id).get();
    if (forumDoc.exists) {
      const forumData = forumDoc.data();
      res.json(await forumResponse(forumDoc));
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.post("/:topicId/comments", verifyToken, async (req, res) => {
  try {
    const { topicId } = req.params;
    const { text } = req.body;
    const uid = req.user.uid;
    await firestore.collection("forum").doc(topicId).collection("comments").add({ text, uid, createdAt: new Date() });
    await addScoreToUser(uid, 10);
    res.json({ message: "Komentar berhasil ditambahkan." });
  } catch (error) {
    console.error("Gagal menambahkan komentar:", error);
    res.status(500).json({ error: "Gagal menambahkan komentar." });
  }
});

router.get("/:topicId/comments", async (req, res) => {
  try {
    const { topicId } = req.params;
    const commentsSnapshot = await firestore.collection("forum").doc(topicId).collection("comments").orderBy("createdAt", "desc").get();
    const comments = [];
    await Promise.all(commentsSnapshot.docs.map(async (doc) => {
      const user = (await firestore.collection("users").doc(doc.data().uid).get()).data();
      comments.push({ id: doc.id, data: doc.data(), user });
    }));
    res.json(comments);
  } catch (error) {
    console.error("Gagal mengambil komentar:", error);
    res.status(500).json({ error: "Gagal mengambil komentar." });
  }
});

router.post("/like/:id", verifyToken, async (req, res) => {
  try {
    const forumId = req.params.id;
    const uid = req.user.uid;
    const forumDocRef = firestore.collection("forum").doc(forumId);
    await firestore.runTransaction(async (tx) => {
      const forumDoc = await tx.get(forumDocRef);
      if (!forumDoc.exists) throw new Error("not-found");
      const forumData = forumDoc.data();
      const likedBy = forumData.likedBy || [];
      if (likedBy.includes(uid)) throw new Error("already-liked");
      tx.update(forumDocRef, {
        likes: admin.firestore.FieldValue.increment(1),
        likedBy: admin.firestore.FieldValue.arrayUnion(uid),
      });
    });
    res.json({ message: "Postingan disukai." });
  } catch (error) {
    if (error.message === "not-found") return res.status(404).json({ error: "Data tidak ditemukan" });
    if (error.message === "already-liked") return res.status(400).json({ error: "Anda sudah memberikan like pada postingan ini." });
    console.error("Gagal menyukai postingan:", error);
    res.status(500).json({ error: "Gagal menyukai postingan." });
  }
});

router.post("/unlike/:id", verifyToken, async (req, res) => {
  try {
    const forumId = req.params.id;
    const uid = req.user.uid;
    const forumDocRef = firestore.collection("forum").doc(forumId);
    await firestore.runTransaction(async (tx) => {
      const forumDoc = await tx.get(forumDocRef);
      if (!forumDoc.exists) throw new Error("not-found");
      const forumData = forumDoc.data();
      const likedBy = forumData.likedBy || [];
      if (!likedBy.includes(uid)) throw new Error("not-liked");
      tx.update(forumDocRef, {
        likes: admin.firestore.FieldValue.increment(-1),
        likedBy: admin.firestore.FieldValue.arrayRemove(uid),
      });
    });
    res.json({ message: "Postingan tidak disukai." });
  } catch (error) {
    if (error.message === "not-found") return res.status(404).json({ error: "Data tidak ditemukan" });
    if (error.message === "not-liked") return res.status(400).json({ error: "Anda belum memberikan like pada postingan ini." });
    console.error("Gagal unlike postingan:", error);
    res.status(500).json({ error: "Gagal unlike postingan." });
  }
});

router.get("/like/:id/is-liked", async (req, res) => {
  try {
    const forumId = req.params.id;
    const uid = req.query.uid;
    if (!forumId || !uid) return res.status(400).json({ error: "Invalid parameters" });
    const forumDoc = await firestore.collection("forum").doc(forumId).get();
    if (!forumDoc.exists) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ isLiked: (forumDoc.data().likedBy || []).includes(uid) });
  } catch (error) {
    console.error("Gagal memeriksa like:", error);
    res.status(500).json({ error: "Gagal memeriksa like." });
  }
});

router.post("/bookmark/:id", verifyToken, async (req, res) => {
  try {
    const forumId = req.params.id;
    const uid = req.user.uid;
    const forumDocRef = firestore.collection("forum").doc(forumId);
    await firestore.runTransaction(async (tx) => {
      const forumDoc = await tx.get(forumDocRef);
      if (!forumDoc.exists) throw new Error("not-found");
      const bookmarks = forumDoc.data().bookmarks || [];
      if (bookmarks.includes(uid)) throw new Error("already-bookmarked");
      tx.update(forumDocRef, { bookmarks: admin.firestore.FieldValue.arrayUnion(uid) });
    });
    res.json({ message: "Postingan dibookmark." });
  } catch (error) {
    if (error.message === "not-found") return res.status(404).json({ error: "Data tidak ditemukan" });
    if (error.message === "already-bookmarked") return res.status(400).json({ error: "Anda sudah memberikan bookmark pada postingan ini." });
    console.error("Gagal bookmark postingan:", error);
    res.status(500).json({ error: "Gagal bookmark postingan." });
  }
});

router.post("/unbookmark/:id", verifyToken, async (req, res) => {
  try {
    const forumId = req.params.id;
    const uid = req.user.uid;
    const forumDocRef = firestore.collection("forum").doc(forumId);
    await firestore.runTransaction(async (tx) => {
      const forumDoc = await tx.get(forumDocRef);
      if (!forumDoc.exists) throw new Error("not-found");
      const bookmarks = forumDoc.data().bookmarks || [];
      if (!bookmarks.includes(uid)) throw new Error("not-bookmarked");
      tx.update(forumDocRef, { bookmarks: admin.firestore.FieldValue.arrayRemove(uid) });
    });
    res.json({ message: "Postingan di unbookmark." });
  } catch (error) {
    if (error.message === "not-found") return res.status(404).json({ error: "Data tidak ditemukan" });
    if (error.message === "not-bookmarked") return res.status(400).json({ error: "Anda belum memberikan bookmark pada postingan ini." });
    console.error("Gagal unbookmark postingan:", error);
    res.status(500).json({ error: "Gagal unbookmark postingan." });
  }
});

router.get("/bookmark/:id/is-bookmarked", async (req, res) => {
  try {
    const forumId = req.params.id;
    const uid = req.query.uid;
    if (!forumId || !uid) return res.status(400).json({ error: "Invalid parameters" });
    const forumDoc = await firestore.collection("forum").doc(forumId).get();
    if (!forumDoc.exists) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ isBookmarked: (forumDoc.data().bookmarks || []).includes(uid) });
  } catch (error) {
    console.error("Gagal memeriksa bookmark:", error);
    res.status(500).json({ error: "Gagal memeriksa bookmark." });
  }
});

router.get("/bookmarks/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const query = firestore.collection("forum").where("bookmarks", "array-contains", uid);
    const totalBookmarks = await queryCount(query);
    const snapshot = await query.offset(startIndex).limit(itemsPerPage).get();
    const bookmarks = await Promise.all(snapshot.docs.map(forumResponse));
    res.json({ bookmarks, currentBookmarkPage: page, totalBookmarkPages: Math.ceil(totalBookmarks / itemsPerPage), totalBookmarks });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang dibookmark:", error);
    res.status(500).json({ error: "Gagal mendapatkan postingan yang dibookmark." });
  }
});

router.get("/bookmarks-all/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const query = firestore.collection("forum").where("bookmarks", "array-contains", uid);
    const totalBookmarks = (await query.get()).size;
    const snapshot = await query.get();
    const bookmarks = await Promise.all(snapshot.docs.map(forumResponse));
    res.json({ bookmarks, totalBookmarks });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang dibookmark:", error);
    res.status(500).json({ error: "Gagal mendapatkan postingan yang dibookmark." });
  }
});

router.get("/posted-all/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const query = firestore.collection("forum").where("uid", "==", uid);
    const totalItems = (await query.get()).size;
    const snapshot = await query.get();
    const forumData = await Promise.all(snapshot.docs.map(forumResponse));
    res.json({ forumData, totalPosts: totalItems });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang diposting:", error);
    res.status(500).json({ error: "Gagal mendapatkan postingan yang diposting." });
  }
});

router.get("/posted/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const query = firestore.collection("forum").where("uid", "==", uid);
    const totalItems = await queryCount(query);
    const snapshot = await query.offset(startIndex).limit(itemsPerPage).get();
    const forumData = await Promise.all(snapshot.docs.map(forumResponse));
    res.json({ forumData, currentPage: page, totalPages: Math.ceil(totalItems / itemsPerPage), totalPosts: totalItems });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang diposting:", error);
    res.status(500).json({ error: "Gagal mendapatkan postingan yang diposting." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const ref = firestore.collection("forum").doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Data tidak ditemukan" });
    const data = doc.data();
    if (data.uid !== req.user.uid && !(await isAdmin(req.user.uid))) {
      return res.status(403).json({ error: "Akses ditolak." });
    }
    await Promise.all((data.imagePaths || []).map((gcsPath) => storage.bucket().file(gcsPath).delete().catch(() => {})));
    await ref.delete();
    res.json({ message: "Postingan berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus postingan:", error);
    res.status(500).json({ error: "Gagal menghapus postingan." });
  }
});

module.exports = router;
