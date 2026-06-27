const express = require("express");
const router = express.Router();
const { firestore, admin } = require("../adminConfig");
const verifyToken = require("../middleware/verifyToken");

router.post("/:uid", verifyToken, async (req, res) => {
  try {
    const callerDoc = await firestore.collection("users").doc(req.user.uid).get();
    if (!callerDoc.exists || callerDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak. Hanya untuk admin." });
    }
    await firestore.collection("users").doc(req.params.uid).update({ verified: true });
    res.json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const querySnapshot = await firestore.collection("users").get();
    const users = [];
    querySnapshot.forEach((doc) => users.push({ id: doc.id, data: doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await firestore.collection("users").doc(req.params.id).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.status(404).json({ message: "Data tidak ditemukan." });
    }
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    res.status(500).json({ error: "Gagal mengambil data." });
  }
});

const itemsPerPage = 5;

router.get("/posted/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const query = firestore.collection("forum").where("uid", "==", uid);
    const totalItemsSnapshot = await query.get();
    const totalItems = totalItemsSnapshot.size;
    const snapshot = await query.offset(startIndex).get();
    const forumDataPromises = snapshot.docs.map(async (doc) => {
      const userSnapshot = await firestore.collection("users").doc(doc.data().uid).get();
      return { id: doc.id, data: doc.data(), user: userSnapshot.data() };
    });
    const forumData = await Promise.all(forumDataPromises);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    res.json({ forumData: forumData.slice(0, itemsPerPage), currentPage: page, totalPages, totalPosts: totalItems });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang diposting:", error);
    res.status(500).json({ error: "Gagal mendapatkan postingan yang diposting." });
  }
});

router.get("/posted-all/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const query = firestore.collection("forum").where("uid", "==", uid);
    const totalItemsSnapshot = await query.get();
    const totalItems = totalItemsSnapshot.size;
    const snapshot = await query.get();
    const forumDataPromises = snapshot.docs.map(async (doc) => {
      const userSnapshot = await firestore.collection("users").doc(doc.data().uid).get();
      return { id: doc.id, data: doc.data(), user: userSnapshot.data() };
    });
    const forumData = await Promise.all(forumDataPromises);
    res.json({ forumData, totalPosts: totalItems });
  } catch (error) {
    console.error("Gagal mendapatkan postingan yang diposting:", error);
    res.status(500).json({ error: "Gagal mendapatkan postingan yang diposting." });
  }
});

router.get("/:uid/score", async (req, res) => {
  try {
    const uid = req.params.uid;
    const userDoc = await firestore.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan." });
    }
    res.json({ uid, score: userData.score || 0 });
  } catch (error) {
    console.error("Gagal mendapatkan skor pengguna:", error);
    res.status(500).json({ error: "Gagal mendapatkan skor pengguna." });
  }
});

router.delete("/:uid", verifyToken, async (req, res) => {
  try {
    await firestore.collection("users").doc(req.params.uid).delete();
    await admin.auth().deleteUser(req.params.uid);
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    res.status(500).json({ error: "Gagal menghapus user." });
  }
});

module.exports = router;
