"use client";

import { useState, useEffect } from "react";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  updateProfile,
  setDoc,
  doc,
} from "@/firebase.config";

export default function Page() {
  const [userData, setUserData] = useState({
    nama: "",
    nim: "",
    password: "",
    foto: "https://lh3.googleusercontent.com/a/ACg8ocKAuEkaBrnfZeyNP1l1D4sv2XIrFOrOa5isqAvi8-93=s96-c",
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useDefaultPassword, setUseDefaultPassword] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      const timer = setTimeout(() => setModalOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [modalOpen]);

  const handleChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleDefaultPassword = () => {
    setUseDefaultPassword(!useDefaultPassword);
    setUserData({
      ...userData,
      password: useDefaultPassword ? "" : userData.nim,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const uid = `user_${userData.nim}`;
    const emailAuth = `${userData.nim}@example.com`;

    try {
      // Buat user di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAuth,
        userData.password
      );

      // Update profile user
      await updateProfile(userCredential.user, {
        displayName: userData.nama,
        photoURL: userData.foto,
      });

      // Simpan data ke Firestore
      await setDoc(doc(db, "users", uid), {
        displayName: userData.nama,
        nim: userData.nim,
        email: emailAuth,
        photoURL: userData.foto,
        score: 0,
        role: "user",
      });

      setModalOpen(true);
      setUserData({ nama: "", nim: "", password: "", foto: "" });
      setUseDefaultPassword(false);
    } catch (error: any) {
      console.error("Gagal menambahkan user:", error);
      alert("Error: " + error.message);
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
              <label
                htmlFor="nama"
                className="block mb-3 text-base font-medium text-black"
              >
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
              <label
                htmlFor="nim"
                className="block mb-3 text-base font-medium text-black"
              >
                NIM User
              </label>
              <input
                type="text"
                name="nim"
                id="nim"
                value={userData.nim}
                onChange={handleChange}
                required
                placeholder="Masukkan NIM user"
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#00726B] focus:shadow-md"
              />
            </div>
          </div>
          <div className="relative mb-5">
            <label
              htmlFor="password"
              className="block mb-3 text-base font-medium text-black"
            >
              Password User
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={userData.password}
                onChange={handleChange}
                required
                placeholder="Masukkan password user"
                className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base text-[#6B7280] outline-none focus:border-[#00726B] focus:shadow-md"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="ml-3 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="defaultPassword"
                checked={useDefaultPassword}
                onChange={handleDefaultPassword}
                className="mr-2"
              />
              <label
                htmlFor="defaultPassword"
                className="text-sm text-gray-600"
              >
                Gunakan NIM sebagai password
              </label>
            </div>
          </div>
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
