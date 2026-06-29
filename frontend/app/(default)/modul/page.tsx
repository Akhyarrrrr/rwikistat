"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { BiX } from "react-icons/bi";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import IconButton from "@mui/joy/IconButton";
import { UserAuth } from "@/app/context/authContext";
import config from "@/lib/config";

interface ModulData {
  id: number;
  data: {
    namaModul: string;
    codeSampel: string;
    judulModul: string;
    isLocked?: boolean;
  };
}

function ModulList() {
  useEffect(() => {
    document.title = "Modul Belajar | RWikiStat";
  }, []);

  const [modules, setModules] = useState<ModulData[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState<number | null>(null);
  const { user, userData } = UserAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    user
      .getIdTokenResult()
      .then((idTokenResult) => setIsAdmin(Boolean(idTokenResult.claims?.admin || userData?.role === "admin")))
      .catch(() => setIsAdmin(userData?.role === "admin"));
  }, [user, userData?.role]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const storedToken = localStorage.getItem("customToken");
      const response = await axios.get(`${config.API_URL}/api/modul`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (response.status === 200) {
        const sortedData = response.data.sort((a: ModulData, b: ModulData) => {
          const numA = parseInt(a.data.namaModul.match(/\d+/)?.[0] || "0", 10);
          const numB = parseInt(b.data.namaModul.match(/\d+/)?.[0] || "0", 10);
          return numA - numB;
        });
        setModules(sortedData);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    const storedToken = localStorage.getItem("customToken");
    axios
      .delete(`${config.API_URL}/api/modul/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        setOpen(null);
        fetchData();
      })
      .catch((error) => {
        console.error("Gagal menghapus data:", error);
      });
  };

  return (
    <main className="rw-page">
      <section className="rw-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="rw-kicker">Modul</p>
          <h1 className="rw-heading mt-2">Pilih materi, lalu praktikkan dengan R.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
            Setiap modul dapat berisi PDF, markdown, contoh kode, dan tautan Shiny.
          </p>
        </div>
        {user && isAdmin ? (
          <Link href="/modul/addNew" className="btn-primary w-fit">
            Tambah Modul
          </Link>
        ) : null}
      </section>

      <section className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-ink-200" />
          ))
        ) : modules.length === 0 ? (
          <div className="rw-card col-span-full p-12 text-center">
            <h2 className="text-lg font-semibold text-ink-950">Belum ada modul pembelajaran.</h2>
            <p className="mt-2 text-sm text-ink-500">Modul akan tampil di sini setelah ditambahkan admin.</p>
          </div>
        ) : (
          modules.map((item, i) => {
            const locked = Boolean(item.data.isLocked);
            const href = locked ? "#" : `/modul/${item.id}`;
            return (
              <article
                key={item.id}
                className={`rw-card rw-reveal stagger-${Math.min(i + 1, 8)} group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl bg-brand-50 px-4 py-3 font-mono text-sm font-semibold text-brand-700">
                    {item.data.namaModul.match(/\d+/)?.[0] ? `M${item.data.namaModul.match(/\d+/)?.[0]}` : "R"}
                  </div>
                  <div className="flex items-center gap-2">
                    {locked ? (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Terkunci</span>
                    ) : (
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Aktif</span>
                    )}
                    {user && isAdmin ? (
                      <IconButton color="danger" variant="soft" onClick={() => setOpen(item.id)} size="sm">
                        <BiX size={20} />
                      </IconButton>
                    ) : null}
                  </div>
                </div>

                <Link href={href} className={locked ? "pointer-events-none opacity-55" : "block"}>
                  <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-ink-950">{item.data.namaModul}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-ink-600">{item.data.judulModul}</p>
                  <div className="mt-5 rounded-xl bg-ink-950 p-4 font-mono text-xs leading-6 text-brand-100">
                    {(item.data.codeSampel || "summary(data)").slice(0, 88)}
                  </div>
                </Link>

                <Modal open={open === item.id} onClose={() => setOpen(null)} sx={{ zIndex: 99999 }}>
                  <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle><WarningRoundedIcon /> Konfirmasi</DialogTitle>
                    <Divider />
                    <DialogContent>Apa Anda yakin ingin menghapus modul?</DialogContent>
                    <DialogActions>
                      <Button variant="plain" color="danger" onClick={() => handleDelete(item.id)}>Hapus</Button>
                      <Button variant="plain" color="neutral" onClick={() => setOpen(null)}>Batal</Button>
                    </DialogActions>
                  </ModalDialog>
                </Modal>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

export default ModulList;
