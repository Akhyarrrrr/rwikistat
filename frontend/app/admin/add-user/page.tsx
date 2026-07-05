"use client";

import { useState } from "react";
import config from "@/lib/config";

export default function AdminAddUser() {
  const [form, setForm] = useState({ displayName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${config.API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Gagal menambahkan user.");
      setForm({ displayName: "", email: "", password: "" });
      setMessage("User berhasil ditambahkan.");
    } catch (error: any) {
      setMessage(error.message || "Gagal menambahkan user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink-950">Tambah user</h1>
      <p className="mt-2 text-sm leading-6 text-ink-600">Buat akun baru untuk pengguna RWikiStat.</p>

      <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-ink-800">Nama</span>
          <input
            className="input-field mt-2"
            value={form.displayName}
            onChange={(event) => setForm((value) => ({ ...value, displayName: event.target.value }))}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink-800">Email</span>
          <input
            className="input-field mt-2"
            type="email"
            value={form.email}
            onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink-800">Password</span>
          <input
            className="input-field mt-2"
            type="password"
            value={form.password}
            onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
            required
          />
        </label>
        {message ? <p className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-700">{message}</p> : null}
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? "Menambahkan..." : "Tambah User"}
        </button>
      </form>
    </main>
  );
}
