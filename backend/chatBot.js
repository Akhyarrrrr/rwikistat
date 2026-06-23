const express = require("express");
const router = express.Router();
const adminConfig = require("./adminConfig");
const { firestore, admin } = adminConfig;
const OpenAI = require("openai");

const openai = process.env.AI_API_KEY
  ? new OpenAI({ apiKey: process.env.AI_API_KEY })
  : null;

const threadByUser = {}; // Store thread IDs by user

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

router.post("/chat", async (req, res) => {
  if (!openai || !process.env.AI_ASSISTANT_ID) {
    return res.status(503).json({ error: "Chatbot belum dikonfigurasi." });
  }

  const assistantIdToUse = process.env.AI_ASSISTANT_ID;
  const userId = req.body.userId; // You should include the user ID in the request
  const userMessage = req.body.userMessage;

  if (!userId || !userMessage) {
    return res
      .status(400)
      .json({ error: "userId dan userMessage wajib diisi." });
  }

  // Create a new thread if it's the user's first message
  if (!threadByUser[userId]) {
    try {
      const myThread = await openai.beta.threads.create();
      threadByUser[userId] = myThread.id; // Store the thread ID for this user
    } catch (error) {
      console.error("Error creating thread:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  // Add a Message to the Thread
  try {
    await openai.beta.threads.messages.create(
      threadByUser[userId], // Use the stored thread ID for this user
      {
        role: "user",
        content: userMessage,
      }
    );

    // Run the Assistant
    const myRun = await openai.beta.threads.runs.create(
      threadByUser[userId], // Use the stored thread ID for this user
      {
        assistant_id: assistantIdToUse,
        instructions:
          "kamu adalah seorang ahli statistika dan bahasa pemrograman R.", // Your instructions here
        tools: [
          { type: "code_interpreter" }, // Code interpreter tool
          { type: "retrieval" }, // Retrieval tool
        ],
      }
    );

    // Periodically retrieve the Run to check on its status
    const retrieveRun = async () => {
      let run = myRun;

      while (["queued", "in_progress"].includes(run.status)) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await openai.beta.threads.runs.retrieve(
          threadByUser[userId], // Use the stored thread ID for this user
          myRun.id
        );
      }

      if (run.status !== "completed") {
        throw new Error(`Assistant run ended with status: ${run.status}`);
      }
    };

    // Retrieve the Messages added by the Assistant to the Thread
    const waitForAssistantMessage = async () => {
      await retrieveRun();

      const allMessages = await openai.beta.threads.messages.list(
        threadByUser[userId] // Use the stored thread ID for this user
      );

      // Send the response back to the front end
      res.status(200).json({
        response: allMessages.data[0].content[0].text.value,
      });
      const chatRef = firestore.collection("chats").doc();

      // Membuat objek data untuk disimpan ke Firestore
      const chatData = {
        userId: userId,
        message: userMessage,
        timestamp: admin.firestore.FieldValue.serverTimestamp(), // Menambahkan timestamp
        response: allMessages.data[0].content[0].text.value,
      };

      // Menyimpan data ke Firestore
      await chatRef.set(chatData);
    };
    await waitForAssistantMessage();
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
