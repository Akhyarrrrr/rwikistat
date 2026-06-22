"use client";
import React, { useState, useEffect, FormEvent, useRef } from "react";
import axios from "axios";
import { auth } from "../app/firebaseConfig";
import { UserAuth } from "../app/context/authContext";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";

const API_HOST = "https://rest-api-zzvthujxxq-as.a.run.app"; // Ganti dengan host Anda jika berbeda
const API_PORT = 5000;

interface ChatData {
  id: string;
  data: {
    author: string;
    content: string;
    response: string;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
  };
}

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
  (config) => {
    // Konversi header userId ke cookie
    config.headers.cookie = {
      userId: config.headers["userId"],
    };

    return config;
  },
  (error) => {
    // Handle error
    return error;
  }
);

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<ChatData[]>([]);
  const { user } = UserAuth();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [chats]);

  useEffect(() => {
    // Memuat data obrolan saat komponen pertama kali dimuat
    loadChatbotData();
  }, [user]);

  const loadChatbotData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Dapatkan ID user yang sedang login
      const user = auth.currentUser;
      const userId = user?.uid;

      if (!userId) {
        setLoading(false);
        return;
      }
      const response = await axiosInstance.get(
        `${API_HOST}:${API_PORT}/api/chatbot/`
      );
      if (response.status === 200) {
        const data = response.data;
        // Saring data berdasarkan ID user yang sedang login
        const userChats = data.filter(
          (chat: { data: { author: string } }) => chat.data.author === userId
        );

        // Urutkan data berdasarkan createdAt
        userChats.sort(
          (
            a: { data: { createdAt: number } },
            b: { data: { createdAt: number } }
          ) => b.data.createdAt - a.data.createdAt
        );

        setChats(userChats);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const refreshChatbotData = async () => {
    await loadChatbotData();
    setChats((prevChatbotData) => [...prevChatbotData]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Dapatkan ID user
    const user = auth.currentUser;
    const userId = user?.uid;

    // Kirim permintaan ke endpoint chatbot
    const response = await axios.post(`${API_HOST}:${API_PORT}/api/chatbot/`, {
      instances: [
        {
          context:
            "Kamu adalah Seorang Yang ahli di bidang statistika dan pemrograman R, nama kamu adalah R bot.",
          examples: [
            {
              input: {
                author: "user",
                content: "siapa kamu?",
              },
              output: {
                author: "bot",
                content: "saya adalah Rbot.",
              },
            },
          ],
          messages: [
            {
              author: userId,
              content: message,
            },
          ],
        },
      ],
      parameters: {
        candidateCount: 1,
        maxOutputTokens: 1024,
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      },
    });

    // Periksa respons
    if (response.status === 200) {
      // reset jika berhasil
      setMessage("");
    } else {
      // Tangani kesalahan
      throw new Error("Failed to get response");
    }

    // Refresh data chatbot setelah submit berhasil
    await refreshChatbotData();
  };

  useEffect(() => {
    loadChatbotData();
  }, []);

  return (
    <div className="flex flex-col justify-between items-center h-screen overflow-hidden ">
      <div className="flex flex-col overflow-y-auto p-4 w-full md:px-28">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="flex flex-col gap-7">
            {chats.map((chat, index) => (
              <div key={index} className="mb-10">
                <div className="flex justify-end mb-3">
                  <div className="bg-green-100 text-black font-medium px-8 py-3 rounded-l-2xl  text-end">
                    {chat.data.content}
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-green-300 text-black  px-8 py-3 rounded-r-2xl  ">
                    {chat.data.response}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <div className=" w-full bottom-0 bg-gray-50">
        <form
          className="max-w-screen-lg m-auto w-full p-4 flex space-x-4 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            type="text"
            autoComplete="off"
            className="border rounded-md p-2 flex-1 border-gray-300"
            // x-model="newMessage"
            placeholder="Masukkan pesan Anda..."
          />
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
