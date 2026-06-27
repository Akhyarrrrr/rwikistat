const { admin } = require("../adminConfig");

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }
  const token = bearerHeader.split(" ")[1];
  try {
    req.user = await admin.auth().verifyIdToken(token);
    req.token = token;
    next();
  } catch (error) {
    console.error("Token tidak valid:", error);
    res.status(403).json({ error: "Token tidak valid." });
  }
};

module.exports = verifyToken;
