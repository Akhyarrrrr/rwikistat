"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import VerifiedCard from "@/components/VerifiedCard";
import config from "@/lib/config";
import { SkeletonCard } from "@/components/Skeleton";

function Verivied() {
  // Buat sebuah jenis yang mencerminkan struktur data dari API
  interface UserData {
    id: number;
    data: {
      photoURL: string;
      displayName: string;
      email: string;
      verified: boolean;
    };
  }

  useEffect(() => {
    document.title = "Verified | Rwikistat";
    return () => {};
  }, []);

  const [testData, setTestData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const storedToken = localStorage.getItem("customToken");
      const headers = { Authorization: `Bearer ${storedToken}` };
      const response = await axios.get(`${config.API_URL}/api/user/`, { headers });
      if (response.status === 200) {
        setTestData(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setTestData((prevData) => prevData.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="rw-page">
      <section className="rw-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="rw-kicker">Verified User</p>
          <h1 className="rw-heading mt-2">Kelola pengguna terverifikasi.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
            Verifikasi akun, cek profil publik, atau hapus user jika diperlukan.
          </p>
        </div>
        <Link href={`/verified/addUser`}>
          <button type="button" className="btn-primary">
            Tambah User
          </button>
        </Link>
      </section>

      <div className="mt-7 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        : testData.length === 0 ? (
          <div className="rw-card col-span-full p-12 text-center">
            <p className="text-lg font-semibold text-ink-950">Belum ada user terverifikasi.</p>
            <p className="mt-2 text-sm text-ink-500">User akan tampil setelah data tersedia.</p>
          </div>
        ) : testData.map((item) => (
          <VerifiedCard
            key={item.id}
            profileImage={item.data.photoURL}
            name={item.data.displayName}
            email={item.data.email}
            verified={item.data.verified}
            link={`userId/${item.id}`}
            id={item.id}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>
    </main>
  );
}

export default Verivied;
