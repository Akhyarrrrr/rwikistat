const express = require("express");
const router = express.Router();
const { firestore, admin } = require("../adminConfig");
const verifyToken = require("../middleware/verifyToken");

router.get("/", async (req, res) => {
  try {
    const snapshot = await firestore.collection("shiny_apps").orderBy("createdAt", "desc").get();
    const apps = [];
    snapshot.forEach((doc) => apps.push({ id: doc.id, ...doc.data() }));
    res.json(apps);
  } catch (error) {
    console.error("Error fetching Shiny apps:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, url, description } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Title dan URL harus diisi." });
    }
    const docRef = await firestore.collection("shiny_apps").add({
      title, url, description: description || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id, title, url, description });
  } catch (error) {
    console.error("Error adding Shiny app:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await firestore.collection("shiny_apps").doc(req.params.id).delete();
    res.json({ message: "Shiny app deleted." });
  } catch (error) {
    console.error("Error deleting Shiny app:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
