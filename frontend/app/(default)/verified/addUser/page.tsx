"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import config from "@/lib/config";

export default function Page() {
  const [userData, setUserData] = useState({
    nama: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${config.API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          displayName: userData.nama,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan user");
      }

      setMessage("User berhasil ditambahkan!");
      setUserData({ nama: "", email: "", password: "" });
    } catch (error: any) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rw-page max-w-3xl">
      <section className="rw-reveal">
        <p className="rw-kicker">User</p>
        <h1 className="rw-heading mt-2">Tambah user baru.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
          Buat akun email dan password untuk pengguna yang akan diverifikasi.
        </p>
      </section>

      <div className="rw-card mt-7 p-5 md:p-7">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="nama" className="mb-2 block text-sm font-semibold text-ink-800">
                Nama User
              </label>
              <input
                type="text"
                name="nama"
                id="nama"
                value={userData.nama}
                onChange={handleChange}
                required
                placeholder="Masukkan nama user"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink-800">
                Email User
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleChange}
                required
                placeholder="Masukkan email user"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink-800">
              Password User
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={userData.password}
              onChange={handleChange}
              required
              placeholder="Masukkan password user"
              className="input-field"
            />
          </div>
          {message && (
            <p className={`rounded-xl border px-4 py-3 text-sm ${message.startsWith("Error") ? "border-red-200 bg-red-50 text-red-700" : "border-brand-200 bg-brand-50 text-brand-800"}`}>
              {message}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? "Menambahkan..." : "Tambah User Baru"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
