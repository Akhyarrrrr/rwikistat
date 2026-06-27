const express = require("express");
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_INSTRUCTION = "Kamu adalah seorang ahli statistika dan bahasa pemrograman R. Jawab pertanyaan dengan jelas, ringkas, dan berikan contoh kode R jika relevan.";

router.post("/chat", async (req, res) => {
  const userMessage = req.body.userMessage;
  if (!userMessage) {
    return res.status(400).json({ error: "userMessage harus diisi." });
  }
  try {
    const geminiRes = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": GEMINI_API_KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      }),
    });
    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return res.status(500).json({ error: "Gagal mendapatkan respons dari Gemini." });
    }
    const geminiData = await geminiRes.json();
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada respons.";
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
