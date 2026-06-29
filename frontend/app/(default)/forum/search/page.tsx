"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { BiCommentDetail } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import { MdVerified } from "react-icons/md";
import config from "@/lib/config";
import { SkeletonCard } from "@/components/Skeleton";
import LinkButton from "@/components/LinkButton";

interface ForumData {
  id: string;
  data: {
    email: string;
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
    email: string;
  };
  commentCount: number;
}

function Avatar({ src, name }: { src?: string; name?: string }) {
  if (src) return <Image src={src} alt={name || "Avatar"} width={48} height={48} className="rounded-xl object-cover" />;
  return <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 font-semibold text-brand-700">{(name || "U").slice(0, 1).toUpperCase()}</div>;
}

export default function Search() {
  useEffect(() => {
    document.title = "Search Forum | RWikiStat";
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ForumData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);

  const handleSearch = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!query.trim()) return;

    try {
      const storedToken = localStorage.getItem("customToken");
      setLoading(true);
      const response = await fetch(`${config.API_URL}/api/forum/search?query=${encodeURIComponent(query.trim())}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setResults(await response.json());
      setSearchExecuted(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rw-page max-w-4xl">
      <section className="rw-reveal">
        <p className="rw-kicker">Forum Search</p>
        <h1 className="rw-heading mt-2">Temukan diskusi yang sudah ada.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
          Cari berdasarkan judul topik sebelum membuat pertanyaan baru.
        </p>
      </section>

      <form onSubmit={handleSearch} className="rw-card mt-7 flex gap-3 p-3">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-ink-50 px-4">
          <IoSearch className="text-ink-400" size={21} />
          <input
            className="w-full border-0 bg-transparent py-3 text-sm text-ink-900 outline-none placeholder:text-ink-400"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul forum..."
          />
        </div>
        <button className="btn-primary" disabled={loading || !query.trim()}>
          {loading ? "Mencari..." : "Cari"}
        </button>
      </form>

      <section className="mt-6 grid gap-4">
        {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : null}

        {searchExecuted && results.length === 0 && !loading ? (
          <div className="rw-card p-12 text-center">
            <h2 className="text-lg font-semibold text-ink-950">Tidak ada hasil.</h2>
            <p className="mt-2 text-sm text-ink-500">Coba kata kunci yang lebih pendek atau buat topik baru.</p>
          </div>
        ) : null}

        {!loading && results.map((result) => (
          <article key={result.id} className="rw-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
            <Link href={`userId/${result.data.email}`} className="flex items-center gap-3">
              <Avatar src={result.user.photoURL} name={result.user.displayName} />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate font-semibold text-ink-950">{result.user.displayName}</p>
                  {result.user.verified ? <MdVerified size={17} className="text-brand-600" /> : null}
                </div>
                <p className="text-xs text-ink-500">
                  {result.data.createdAt._seconds * 1000 > new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                    <TimeAgo date={new Date(result.data.createdAt._seconds * 1000)} />
                  ) : (
                    <span>{new Date(result.data.createdAt._seconds * 1000).toLocaleDateString()}</span>
                  )}
                </p>
              </div>
            </Link>
            <Link href={`/forum/${result.id}`} className="mt-4 block">
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink-950">{result.data.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-600">{result.data.topics}</p>
            </Link>
            <div className="mt-5 flex items-center gap-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
              <div className="flex items-center gap-1">
                <LikeButton itemId={result.id} />
                <span>{result.data.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <BiCommentDetail size={20} />
                <span>{result.commentCount}</span>
              </div>
              <Bookmark itemId={result.id} />
              <LinkButton itemId={result.id} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
