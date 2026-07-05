const { firestore } = require("../adminConfig");

const requireAdmin = async (req, res, next) => {
  try {
    const doc = await firestore.collection("users").doc(req.user.uid).get();
    if (!doc.exists || doc.data().role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak. Hanya untuk admin." });
    }
    next();
  } catch (error) {
    console.error("Admin verify error:", error);
    res.status(500).json({ error: "Gagal memeriksa akses admin." });
  }
};

module.exports = requireAdmin;
