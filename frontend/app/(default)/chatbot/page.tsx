"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
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
    document.title = "Chatbot | RWikiStat";
  }, []);

  const { user } = UserAuth();
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [error, setError] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData, loading]);

  useEffect(() => {
    setChatData([]);
  }, [user]);

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    setLoading(true);
    setError("");
    const message = userMessage.trim();
    setUserMessage("");

    try {
      const storedToken = localStorage.getItem("customToken");
      const currentUser = auth.currentUser;
      const response = await fetch(`${config.API_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ userMessage: message }),
      });
      const data = await response.json();

      const newChat = {
        id: Date.now().toString(),
        userId: currentUser?.uid || "",
        message,
        response: data.response || "Maaf, tidak ada respons.",
        timestamp: { _seconds: Math.floor(Date.now() / 1000), _nanoseconds: 0 },
      };
      setChatData((prev) => [...prev, newChat]);
    } catch {
      setError("Gagal menghubungi chatbot. Pastikan backend dan API key aktif.");
      setUserMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col px-4 py-5 md:px-7 md:py-7">
      <section className="rw-reveal">
        <p className="rw-kicker">RWikiChat</p>
        <h1 className="rw-heading mt-2">Tanya konsep statistik tanpa meninggalkan modul.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
          Chat ini stateless. Pertanyaan tidak disimpan di server, jadi tulis konteks yang cukup.
        </p>
      </section>

      <section className="mt-6 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-ink-200 bg-white p-4 shadow-sm md:p-6">
        {chatData.length === 0 && !loading ? (
          <div className="grid min-h-[360px] place-items-center text-center">
            <div className="max-w-md">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50 font-mono text-xl font-bold text-brand-700">R</div>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink-950">Mulai dari pertanyaan spesifik.</h2>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                Contoh: jelaskan interpretasi p-value pada regresi linear dan beri contoh kode R sederhana.
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          {chatData.map((chat) => (
            <div key={chat.id} className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[82%] rounded-2xl rounded-tr-md bg-ink-900 px-5 py-3 text-sm leading-6 text-white shadow-sm">
                  {chat.message}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-brand-50 px-5 py-3 text-sm leading-6 text-ink-800 ring-1 ring-brand-100">
                  {chat.response}
                </div>
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex items-center gap-2 rounded-2xl bg-brand-50 px-5 py-4 text-brand-700 ring-1 ring-brand-100">
              <span className="size-2 animate-bounce rounded-full bg-brand-600" />
              <span className="size-2 animate-bounce rounded-full bg-brand-600 [animation-delay:150ms]" />
              <span className="size-2 animate-bounce rounded-full bg-brand-600 [animation-delay:300ms]" />
            </div>
          ) : null}
        </div>
        <div ref={chatContainerRef} />
      </section>

      {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <form className="mt-4 flex gap-3 rounded-2xl border border-ink-200 bg-white p-3 shadow-lg shadow-ink-950/5" onSubmit={handleChatSubmit}>
        <input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          type="text"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-transparent bg-ink-50 px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-300 focus:bg-white"
          placeholder="Tulis pertanyaan statistik atau error R..."
        />
        <button className="btn-primary min-w-24" type="submit" disabled={loading || !userMessage.trim()}>
          {loading ? "Kirim..." : "Kirim"}
        </button>
      </form>
    </main>
  );
};

export default ChatBot;
