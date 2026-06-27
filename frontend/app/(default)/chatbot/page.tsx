"use client";
import React, { useState, useEffect, FormEvent, useRef } from "react";
import { auth } from "@/lib/firebase";
import { UserAuth } from "@/app/context/authContext";
import config from "@/lib/config";

interface ChatData {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
}

const ChatBot = () => {
  useEffect(() => {
    document.title = "Chat Bot | Rwikistat";
    scrollToBottom();
    return () => {};
  }, []);

  const { user } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom(); // Memanggil fungsi untuk mengatur fokus pada percakapan terbaru setiap kali chatData berubah
  }, [chatData]);

  // Fungsi untuk mengatur fokus pada percakapan terbaru (di bagian bawah)
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  };

  const fetchChatData = async () => {
    // Chat is stateless — no server-side history. Start empty.
    setChatData([]);
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting chat...");
    const storedToken = localStorage.getItem("customToken");
    // Dapatkan ID user
    const user = auth.currentUser;
    const userId = user?.uid;
    console.log(userId);

    const response = await fetch(`${config.API_URL}/api/chatbot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({ userMessage }),
    });

    const data = await response.json();

    const newChat = {
      id: Date.now().toString(),
      userId: userId || "",
      message: userMessage,
      response: data.response || "Maaf, tidak ada respons.",
      timestamp: { _seconds: Math.floor(Date.now() / 1000), _nanoseconds: 0 },
    };
    setChatData((prev) => [...prev, newChat]);
    setLoading(false);

    setUserMessage("");
  };

  useEffect(() => {
    fetchChatData();
  }, [user]);

  return (
    <div className="flex flex-col justify-between items-center h-screen overflow-hidden">
      <div className="flex flex-col overflow-y-auto p-4 w-full md:px-28">
        <div className="flex flex-col gap-7">
          {chatData.map((chat, index) => (
            <div
              key={chat.id}
              className={`mb-10 ${
                index === chatData.length - 1 ? "last-chat" : ""
              }`}
            >
              <div className="flex justify-end mb-3">
                <div className="bg-gray-400 text-white font-medium px-8 py-3 rounded-l-2xl text-end">
                  {chat.message}
                </div>
              </div>
              <div className="flex">
                <div className="bg-[#00726B] text-white px-8 py-3 rounded-r-2xl">
                  <p>{chat.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={chatContainerRef}></div>
      </div>
      <div className="w-full bottom-0 bg-gray-50">
        <form
          className="max-w-screen-lg m-auto w-full p-4 flex space-x-4 justify-center items-center"
          onSubmit={handleChatSubmit}
        >
          <input
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            type="text"
            autoComplete="off"
            className="border rounded-md p-2 flex-1 border-gray-300"
            placeholder="Masukkan pesan Anda..."
          />
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
