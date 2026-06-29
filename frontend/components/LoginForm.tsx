"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoEyeOffOutline, IoEyeOutline, IoLockClosedOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { UserAuth } from "@/app/context/authContext";

const LoginForm = () => {
  const { emailSignIn, register } = UserAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setMessage("");
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    setLoading(true);

    try {
      if (mode === "login") {
        await emailSignIn(email.trim(), password);
      } else {
        await register(email.trim(), password, displayName.trim());
        setMode("login");
        setDisplayName("");
        setPassword("");
        setIsSuccess(true);
        setMessage("Pendaftaran berhasil. Silakan masuk dengan akun baru.");
      }
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-ink-50">
      <div className="absolute inset-0 rw-surface-grid opacity-70" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-[0.95fr_1.05fr] md:px-6">
        <section className="hidden md:block">
          <Link href="/" className="inline-flex rounded-2xl bg-white p-2 ring-1 ring-ink-100">
            <Image src="/logo-horizontal.png" alt="RWikiStat" width={150} height={46} priority />
          </Link>
          <h1 className="mt-10 max-w-xl text-5xl font-semibold leading-[1] tracking-[-0.04em] text-ink-950">
            Masuk ke ruang belajar statistik R.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-ink-600">
            Lanjutkan modul, compiler, forum, dan profil belajar dengan akun email RWikiStat.
          </p>
          <div className="mt-8 grid max-w-lg gap-3">
            {["Compiler R siap jalan", "Forum diskusi dengan skor", "Modul dan grafik tersimpan"].map((item) => (
              <div key={item} className="rw-card flex items-center gap-3 px-4 py-3">
                <span className="font-mono text-xs font-semibold text-brand-700">R</span>
                <span className="text-sm font-medium text-ink-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rw-panel mx-auto w-full max-w-md p-5 md:p-7">
          <div className="md:hidden">
            <Link href="/" className="inline-flex rounded-2xl bg-white p-2 ring-1 ring-ink-100">
              <Image src="/logo-horizontal.png" alt="RWikiStat" width={132} height={42} priority />
            </Link>
          </div>

          <div className="mt-6 flex rounded-2xl bg-ink-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                mode === "login" ? "bg-white text-brand-700 shadow-sm" : "text-ink-500 hover:text-ink-800"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                mode === "register" ? "bg-white text-brand-700 shadow-sm" : "text-ink-500 hover:text-ink-800"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink-950">
                {mode === "login" ? "Selamat datang kembali" : "Buat akun baru"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                {mode === "login" ? "Masuk untuk melanjutkan sesi belajar." : "Daftar untuk mulai belajar statistika dengan R."}
              </p>
            </div>

            {message ? (
              <div className={`rounded-xl border px-4 py-3 text-sm ${isSuccess ? "border-brand-200 bg-brand-50 text-brand-800" : "border-red-200 bg-red-50 text-red-700"}`}>
                {message}
              </div>
            ) : null}

            {mode === "register" ? (
              <label className="block">
                <span className="text-sm font-semibold text-ink-800">Nama lengkap</span>
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                  <IoPersonOutline className="text-ink-400" size={20} />
                  <input
                    placeholder="Nama Anda"
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                    className="w-full border-0 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                    required
                  />
                </span>
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Email</span>
              <span className="mt-2 flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                <IoMailOutline className="text-ink-400" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full border-0 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Password</span>
              <span className="mt-2 flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
                <IoLockClosedOutline className="text-ink-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-0 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-ink-400 transition-colors hover:text-brand-700"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </span>
            </label>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default LoginForm;
