"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/lib/firebase";
import { usePathname } from "next/navigation";
import Image from "next/image";
import TimeAgo from "react-timeago";
import { UserAuth } from "@/app/context/authContext";
import { BiCommentDetail } from "react-icons/bi";
import LikeButton from "@/components/LikeButton";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import config from "@/lib/config";
import Bookmark from "@/components/Bookmark";
import { SkeletonBlock, SkeletonLine } from "@/components/Skeleton";

function Avatar({ src, name, size = 50 }: { src?: string; name?: string; size?: number }) {
  if (src) return <Image src={src} alt={name || "Avatar"} width={size} height={size} className="rounded-xl object-cover" />;
  return (
    <div className="flex rounded-xl bg-brand-50 font-semibold text-brand-700" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {(name || "U").slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function DetailPage() {
  useEffect(() => {
    document.title = "Forum | RWikiStat";
  }, []);

  const { user } = UserAuth();
  const pathname = usePathname();
  const forumId = pathname.split("/")[2];
  const [commentInput, setCommentInput] = useState({ text: "", uid: "" });
  const [detailForum, setDetailForum] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  const fetchComments = async (topicId: string, headers: { Authorization: string }) => {
    const response = await fetch(`${config.API_URL}/api/forum/${topicId}/comments`, { headers });
    if (!response.ok) throw new Error("Gagal mengambil komentar.");
    const data = await response.json();
    setComments(
      data.sort((a: any, b: any) => {
        const dateA = a.data.createdAt._seconds * 1000 + a.data.createdAt._nanoseconds / 1000000;
        const dateB = b.data.createdAt._seconds * 1000 + b.data.createdAt._nanoseconds / 1000000;
        return dateB - dateA;
      })
    );
  };

  useEffect(() => {
    if (!forumId) return;
    const storedToken = localStorage.getItem("customToken");
    const headers = { Authorization: `Bearer ${storedToken}` };

    fetch(`${config.API_URL}/api/forum/${forumId}`, { headers })
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil data postingan.");
        return response.json();
      })
      .then((data) => setDetailForum(data))
      .catch((error) => console.error("Gagal mengambil data postingan:", error));

    fetchComments(forumId, headers).catch((error) => console.error("Gagal mengambil komentar:", error));
  }, [forumId]);

  const handleCommentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCommentInput((input) => ({ ...input, [name]: value }));
  };

  const handleCommentSubmit = async (event: FormEvent, topicId: string) => {
    event.preventDefault();
    try {
      const uid = auth.currentUser ? auth.currentUser.uid : null;
      if (!uid) return;

      const storedToken = localStorage.getItem("customToken");
      const headers = { Authorization: `Bearer ${storedToken}` };
      const response = await axios.post(`${config.API_URL}/api/forum/${topicId}/comments`, { text: commentInput.text, uid }, { headers });

      if (response.status === 200) {
        setCommentInput({ text: "", uid: "" });
        fetchComments(topicId, headers).catch((error) => console.error("Gagal mengambil komentar:", error));
      }
    } catch (error) {
      console.error("Gagal menambahkan komentar:", error);
    }
  };

  return (
    <main className="rw-page max-w-4xl">
      {detailForum ? (
        <article className="rw-card p-5 md:p-6">
          <Link href={`/userId/${detailForum.data.uid || ""}`} className="flex items-center gap-3">
            <Avatar src={detailForum.user.photoURL} name={detailForum.user.displayName} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate font-semibold text-ink-950">{detailForum.user.displayName}</p>
                {detailForum.user.verified ? <MdVerified size={17} className="shrink-0 text-brand-600" /> : null}
              </div>
              <p className="text-xs text-ink-500">
                <TimeAgo date={new Date(detailForum.data.createdAt._seconds * 1000)} />
              </p>
            </div>
          </Link>

          <div className="mt-5">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950 md:text-3xl">{detailForum.data.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-700">{detailForum.data.topics}</p>
            <div className="mt-5 grid gap-3">
              {(detailForum.data.images || []).map((image: string, index: number) => (
                <Image key={image} src={image} width={1200} height={800} alt={`Gambar ${index + 1}`} className="rounded-2xl border border-ink-200 object-cover" />
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-ink-100 pt-4 text-sm text-ink-600">
            <div className="flex items-center gap-1">
              <LikeButton itemId={detailForum.id} />
              <span>{detailForum.data.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <BiCommentDetail size={20} />
              <span>{detailForum.commentCount}</span>
            </div>
            <Bookmark itemId={detailForum.id} />
          </div>

          {user ? (
            <form className="mt-5 flex gap-3 border-t border-ink-100 pt-5" onSubmit={(e) => handleCommentSubmit(e, detailForum.id)}>
              <input
                type="text"
                name="text"
                autoComplete="off"
                className="input-field"
                placeholder="Tambahkan komentar"
                value={commentInput.text}
                onChange={handleCommentInputChange}
                required
              />
              <button type="submit" className="btn-primary min-w-36">
                Kirim
              </button>
            </form>
          ) : (
            <p className="mt-5 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-600">Login terlebih dahulu untuk berkomentar.</p>
          )}
        </article>
      ) : (
        <div className="animate-pulse space-y-4 p-6">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="size-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonLine width="w-1/3" />
              <SkeletonLine width="w-1/4" />
            </div>
          </div>
          <SkeletonBlock className="h-6 w-3/4" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="h-24 w-full" />
        </div>
      )}

      {comments.length > 0 ? (
        <section className="mt-5 rw-card p-5">
          <h2 className="text-lg font-semibold text-ink-950">Komentar</h2>
          <div className="mt-4 grid gap-4">
            {comments.map((comment: any) => (
              <article key={comment.id} className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={comment.user.photoURL} name={comment.user.displayName} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="truncate font-semibold text-ink-950">{comment.user.displayName}</p>
                      {comment.user.verified ? <MdVerified size={17} className="shrink-0 text-brand-600" /> : null}
                    </div>
                    <p className="text-xs text-ink-500">
                      <TimeAgo date={new Date(comment.data.createdAt._seconds * 1000)} />
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-700">{comment.data.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
