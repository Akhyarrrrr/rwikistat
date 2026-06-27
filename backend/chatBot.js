const express = require("express");
const router = express.Router();
const adminConfig = require("./adminConfig");
const { firestore, admin } = adminConfig;
const dotenv = require("dotenv");

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// In-memory conversation history per user
const conversationHistory = {};

const SYSTEM_INSTRUCTION =
  "Kamu adalah seorang ahli statistika dan bahasa pemrograman R. Jawab pertanyaan dengan jelas, ringkas, dan berikan contoh kode R jika relevan.";

router.post("/chat", async (req, res) => {
  const userId = req.body.userId;
  const userMessage = req.body.userMessage;

  if (!userId || !userMessage) {
    return res
      .status(400)
      .json({ error: "userId dan userMessage harus diisi." });
  }

  // Initialize conversation history for this user
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  // Add user message to history
  conversationHistory[userId].push({ role: "user", parts: [{ text: userMessage }] });

  // Build contents array: system instruction + conversation history
  const contents = [
    { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
    ...conversationHistory[userId],
  ];

  try {
    const geminiRes = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({ contents }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return res.status(500).json({ error: "Gagal mendapatkan respons dari Gemini." });
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, tidak ada respons.";

    // Add model response to history
    conversationHistory[userId].push({
      role: "model",
      parts: [{ text: responseText }],
    });

    // Keep only last 20 messages to avoid context overflow
    if (conversationHistory[userId].length > 20) {
      conversationHistory[userId] = conversationHistory[userId].slice(-20);
    }

    console.log("User:", userMessage);
    console.log("Assistant:", responseText);

    // Save to Firestore
    const chatRef = firestore.collection("chats").doc();
    await chatRef.set({
      userId,
      message: userMessage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      response: responseText,
    });

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menampilkan data chat berdasarkan userId
router.get("/chats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Mendapatkan semua data chat dari koleksi 'chats' berdasarkan userId
    const chatsSnapshot = await firestore
      .collection("chats")
      .where("userId", "==", userId)
      // .orderBy('timestamp', 'desc')
      .get();

    const chatsData = [];

    // Memproses setiap dokumen chat
    chatsSnapshot.forEach((doc) => {
      const data = doc.data();
      chatsData.push({
        id: doc.id,
        userId: data.userId,
        message: data.message,
        timestamp: data.timestamp,
        response: data.response,
      });
    });

    // Mengirim data chat ke frontend
    res.status(200).json(chatsData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menampilkan respons berdasarkan id pertanyaan
router.get("/responses/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Mendapatkan data respons dari Firestore berdasarkan id pertanyaan
    const responseRef = firestore
      .collection("chats")
      .doc(questionId)
      .collection("responses");
    const responseSnapshot = await responseRef.get();

    // Membuat array untuk menyimpan data respons
    const responseData = [];

    // Iterasi melalui hasil query dan menambahkan data respons ke array
    responseSnapshot.forEach((doc) => {
      const data = doc.data();
      responseData.push({
        id: doc.id,
        response: data.response,
        timestamp: data.timestamp,
      });
    });

    // Mengirim data respons ke frontend
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
