const express = require("express");
const router = express.Router();
const { admin, firestore } = require("../adminConfig");
const verifyToken = require("../middleware/verifyToken");
const requireAdmin = require("../middleware/requireAdmin");

router.use(verifyToken, requireAdmin);

router.get("/users", async (req, res) => {
  try {
    const snapshot = await firestore.collection("users").get();
    const users = [];
    snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Gagal mengambil data users." });
  }
});

router.patch("/users/:uid/role", async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Role harus 'user' atau 'admin'." });
    }
    await firestore.collection("users").doc(uid).update({ role });
    res.json({ message: "Role berhasil diupdate." });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Gagal mengupdate role." });
  }
});

router.delete("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    await firestore.collection("users").doc(uid).delete();
    await admin.auth().deleteUser(uid);
    res.json({ message: "User berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Gagal menghapus user." });
  }
});

router.get("/modules", async (req, res) => {
  try {
    const snapshot = await firestore.collection("modul").orderBy("namaModul", "asc").get();
    const modules = [];
    snapshot.forEach((doc) => modules.push({ id: doc.id, data: doc.data() }));
    res.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ error: "Gagal mengambil data modul." });
  }
});

router.patch("/modules/:id/lock", async (req, res) => {
  try {
    const { id } = req.params;
    const modulRef = firestore.collection("modul").doc(id);
    const modul = await modulRef.get();
    if (!modul.exists) {
      return res.status(404).json({ error: "Modul tidak ditemukan." });
    }
    const current = modul.data().isLocked || false;
    await modulRef.update({ isLocked: !current });
    res.json({ id, isLocked: !current });
  } catch (error) {
    console.error("Error toggling lock:", error);
    res.status(500).json({ error: "Gagal mengubah status lock." });
  }
});

module.exports = router;
