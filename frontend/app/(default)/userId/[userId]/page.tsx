"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Pagination from "@/components/Pagination";
import { MdVerified } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import TimeAgo from "react-timeago";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import config from "@/lib/config";
import LinkButton from "@/components/LinkButton";
import { SkeletonBlock, SkeletonCard, SkeletonLine } from "@/components/Skeleton";

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
  };
  commentCount: number;
}

function Avatar({ src, name, size = 96 }: { src?: string; name?: string; size?: number }) {
  if (src) return <Image src={src} alt={name || "Profil"} width={size} height={size} className="rounded-2xl object-cover" />;
  return (
    <div className="flex rounded-2xl bg-brand-50 font-semibold text-brand-700" style={{ width: size, height: size, alignItems: "center", justifyContent: "center", fontSize: size / 3 }}>
      {(name || "U").slice(0, 1).toUpperCase()}
    </div>
  );
}

function ForumCard({ post }: { post: ForumData }) {
  return (
    <article className="rw-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <Avatar src={post.user.photoURL} name={post.user.displayName} size={46} />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate font-semibold text-ink-950">{post.user.displayName}</p>
            {post.user.verified ? <MdVerified size={17} className="shrink-0 text-brand-600" /> : null}
          </div>
          <p className="text-xs text-ink-500">
            {post.data.createdAt._seconds * 1000 > new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
              <TimeAgo date={new Date(post.data.createdAt._seconds * 1000)} />
            ) : (
              <span>{new Date(post.data.createdAt._seconds * 1000).toLocaleDateString()}</span>
            )}
          </p>
        </div>
      </div>
      <Link href={`/forum/${post.id}`} className="mt-4 block">
        <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink-950">{post.data.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-600">{post.data.topics}</p>
      </Link>
      <div className="mt-5 flex items-center gap-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
        <div className="flex items-center gap-1">
          <LikeButton itemId={post.id} />
          <span>{post.data.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <BiCommentDetail size={20} />
          <span>{post.commentCount}</span>
        </div>
        <Bookmark itemId={post.id} />
        <LinkButton itemId={post.id} />
      </div>
    </article>
  );
}

export default function Page() {
  useEffect(() => {
    document.title = "User | RWikiStat";
  }, []);

  const pathname = usePathname();
  const uid = pathname.split("/")[2];
  const [detailUser, setDetailUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [forumData, setForumData] = useState<ForumData[]>([]);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const storedToken = localStorage.getItem("customToken");
        if (!uid) return;
        const response = await axios.get(`${config.API_URL}/api/user/${uid}/score`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setScore(response.data.score);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchScore();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const storedToken = localStorage.getItem("customToken");
    fetch(`${config.API_URL}/api/user/${uid}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil data detail user.");
        return response.json();
      })
      .then((data) => setDetailUser(data))
      .catch((error) => console.error("Gagal mengambil data detail user:", error));
  }, [uid]);

  useEffect(() => {
    const fetchPosted = async (page: number | undefined) => {
      try {
        const storedToken = localStorage.getItem("customToken");
        const response = await axios.get(`${config.API_URL}/api/forum/posted/${uid}?page=${page}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (response.status === 200) {
          const { forumData, currentPage, totalPages, totalPosts } = response.data;
          setForumData(forumData);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
          setTotalPosts(totalPosts);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    if (uid) fetchPosted(currentPage);
  }, [currentPage, uid]);

  if (!detailUser) {
    return (
      <main className="rw-page">
        <div className="rw-panel p-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <SkeletonBlock className="size-28 rounded-2xl" />
            <div className="w-full space-y-3">
              <SkeletonBlock className="h-8 w-64" />
              <SkeletonLine width="w-80" />
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <SkeletonCard />
        </div>
      </main>
    );
  }

  return (
    <main className="rw-page">
      <section className="rw-panel overflow-hidden">
        <div className="bg-brand-800 px-5 py-10 text-white md:px-8">
          <p className="text-sm font-semibold text-brand-100">Profil Publik</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Aktivitas pengguna.</h1>
        </div>

        <div className="p-5 md:p-8">
          <div className="-mt-20 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="rounded-[1.35rem] border-4 border-white bg-white shadow-xl shadow-ink-950/10">
                <Avatar src={detailUser.photoURL} name={detailUser.displayName} />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950 md:text-3xl">{detailUser.displayName}</h2>
                  {detailUser.verified ? <MdVerified size={24} className="text-brand-600" /> : null}
                </div>
                <p className="mt-1 text-sm text-ink-500">{detailUser.email}</p>
                <div className="mt-3">{score !== null ? <StarRating score={score} /> : <span className="text-sm text-ink-500">Memuat skor...</span>}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-ink-200 bg-white p-4 sm:min-w-40">
              <p className="font-mono text-2xl font-semibold text-ink-950">{totalPosts}</p>
              <p className="mt-1 text-xs font-medium text-ink-500">Post forum</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-ink-950">User Post</h2>
        <div className="mt-4 grid gap-4">
          {forumData.length === 0 ? (
            <div className="rw-card p-10 text-center">
              <h3 className="text-lg font-semibold text-ink-950">Belum ada post.</h3>
              <p className="mt-2 text-sm text-ink-500">Aktivitas forum pengguna ini akan tampil di sini.</p>
            </div>
          ) : (
            forumData.map((post) => <ForumCard key={post.id} post={post} />)
          )}
        </div>
        {forumData.length > 0 ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} /> : null}
      </section>
    </main>
  );
}
