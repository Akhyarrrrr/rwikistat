"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import TimeAgo from "react-timeago";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Modal from "@mui/joy/Modal";
import { BiCommentDetail } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { UserAuth } from "@/app/context/authContext";
import Pagination from "@/components/Pagination";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import LinkButton from "@/components/LinkButton";
import { SkeletonCard } from "@/components/Skeleton";
import config from "@/lib/config";

interface ForumData {
  id: string;
  data: {
    uid: string;
    topics: string;
    title: string;
    images: string[];
    likes: number;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
  };
  user: {
    displayName: string;
    photoURL: string;
    verified: boolean;
    uid: string;
  };
  commentCount: number;
}

interface NewPost {
  topics: string;
  title: string;
  images: File[];
  uid: string;
}

function Avatar({ src, name, size = 48 }: { src?: string; name?: string; size?: number }) {
  if (src) {
    return <Image src={src} alt={name || "Avatar"} width={size} height={size} className="rounded-xl object-cover" />;
  }

  return (
    <div className="flex rounded-xl bg-brand-50 font-semibold text-brand-700" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {(name || "U").slice(0, 1).toUpperCase()}
    </div>
  );
}

const ForumComponent: React.FC = () => {
  useEffect(() => {
    document.title = "Forum Diskusi | RWikiStat";
  }, []);

  const { user } = UserAuth();
  const [open, setOpen] = useState(false);
  const [forumData, setForumData] = useState<ForumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState<NewPost>({
    topics: "",
    title: "",
    images: [],
    uid: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page: number | undefined) => {
    try {
      setLoading(true);
      const storedToken = localStorage.getItem("customToken");
      const response = await axios.get(`${config.API_URL}/api/forum/page?page=${page}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (response.status === 200) {
        const { forumData, currentPage, totalPages } = response.data;
        setForumData(forumData);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPost((post) => ({ ...post, [name]: value }));
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewPost((post) => ({ ...post, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost((post) => ({ ...post, images: Array.from(event.target.files || []) }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      const currentUser = auth.currentUser;

      formData.append("topics", newPost.topics);
      formData.append("title", newPost.title);
      if (currentUser) formData.append("uid", currentUser.uid ?? "");
      newPost.images.forEach((image) => formData.append("images", image));

      const storedToken = localStorage.getItem("customToken");
      const response = await axios.post(`${config.API_URL}/api/forum`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.status === 200) {
        fetchData(currentPage);
        setOpen(false);
        setNewPost({ topics: "", uid: "", images: [], title: "" });
      }
    } catch (error) {
      console.error("Gagal menambahkan postingan:", error);
    }
  };

  return (
    <main className="rw-page max-w-4xl">
      <section className="rw-reveal">
        <p className="rw-kicker">Forum</p>
        <h1 className="rw-heading mt-2">Tanya, jawab, dan simpan diskusi statistik.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
          Gunakan forum untuk membahas konsep, error R, grafik, dan interpretasi output.
        </p>
      </section>

      <section className="mt-7 grid gap-4">
        <div className="rw-card p-4">
          <Link href="/forum/search" className="flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-3 text-sm font-medium text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700">
            <IoSearch size={21} />
            Cari topik forum
          </Link>
        </div>

        <div className="rw-card p-4">
          <div className="flex items-center gap-4">
            <Avatar src={user?.photoURL || ""} name={user?.displayName || user?.email || ""} size={52} />
            <button
              type="button"
              className="flex-1 rounded-2xl bg-ink-50 px-4 py-4 text-left text-sm font-medium text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
              onClick={() => setOpen(true)}
            >
              Tanyakan sesuatu di forum diskusi ini
            </button>
          </div>
        </div>
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999999, p: 2 }}
      >
        <Sheet variant="plain" sx={{ width: 720, maxWidth: "100%", borderRadius: 18, p: 0, boxShadow: "lg", overflow: "hidden" }}>
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">Buat topik baru</h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">Tulis judul spesifik dan konteks yang cukup supaya pengguna lain bisa membantu.</p>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Judul topik</span>
              <input
                type="text"
                name="title"
                value={newPost.title}
                onChange={handleInputChange}
                required
                placeholder="Contoh: Kenapa hasil lm() saya tidak signifikan?"
                className="input-field mt-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Deskripsi</span>
              <textarea
                name="topics"
                placeholder="Jelaskan data, kode, error, atau output yang ingin dibahas."
                value={newPost.topics}
                onChange={handleTextareaChange}
                required
                className="input-field mt-2 min-h-40 resize-y"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink-800">Foto pendukung</span>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleImageChange}
                className="mt-2 block w-full cursor-pointer rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700"
              />
            </label>

            <button type="submit" className="btn-primary w-full py-3">
              Kirim Pertanyaan
            </button>
          </form>
        </Sheet>
      </Modal>

      <section className="mt-6 grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : forumData.length === 0 ? (
          <div className="rw-card p-12 text-center">
            <h2 className="text-lg font-semibold text-ink-950">Belum ada diskusi.</h2>
            <p className="mt-2 text-sm text-ink-500">Jadilah yang pertama membuka topik.</p>
          </div>
        ) : (
          forumData.map((item, i) => (
            <article key={item.id} className={`rw-card rw-reveal stagger-${Math.min(i + 1, 8)} p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg`}>
              <Link href={`userId/${item.data.uid}`} className="flex items-center gap-3">
                <Avatar src={item.user.photoURL} name={item.user.displayName} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="truncate font-semibold text-ink-950">{item.user.displayName}</p>
                    {item.user.verified ? <MdVerified size={17} className="shrink-0 text-brand-600" /> : null}
                  </div>
                  <p className="text-xs text-ink-500">
                    {item.data.createdAt._seconds * 1000 > new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                      <TimeAgo date={new Date(item.data.createdAt._seconds * 1000)} />
                    ) : (
                      <span>{new Date(item.data.createdAt._seconds * 1000).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
              </Link>

              <Link href={`/forum/${item.id}`} className="mt-4 block">
                <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink-950">{item.data.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-600">{item.data.topics}</p>
              </Link>

              <div className="mt-5 flex items-center gap-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
                <div className="flex items-center gap-1">
                  <LikeButton itemId={item.id} />
                  <span>{item.data.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BiCommentDetail size={20} />
                  <span>{item.commentCount}</span>
                </div>
                <Bookmark itemId={item.id} />
                <LinkButton itemId={item.id} />
              </div>
            </article>
          ))
        )}
      </section>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </main>
  );
};

export default ForumComponent;
