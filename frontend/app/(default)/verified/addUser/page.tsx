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
    <div className="flex items-center justify-center py-12 md:px-12">
      <div className="w-full mx-auto bg-white">
        <p className="py-2 px-9 text-2xl md:text-3xl font-extrabold text-[#00726B]">
          Tambah User
        </p>
        <form className="py-6 px-9" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
            <div className="mb-5">
              <label htmlFor="nama" className="block mb-3 text-base font-medium text-black">
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
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#00726B] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-3 text-base font-medium text-black">
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
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#00726B] focus:shadow-md"
              />
            </div>
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-3 text-base font-medium text-black">
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
              className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#00726B] focus:shadow-md"
            />
          </div>
          {message && (
            <p className={`mb-4 text-sm ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#00726B] py-3 px-8 text-center text-base font-semibold text-white outline-none hover:shadow-form"
            >
              {loading ? "Menambahkan..." : "Tambah User Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
