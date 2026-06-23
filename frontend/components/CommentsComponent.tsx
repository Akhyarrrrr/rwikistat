"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { auth } from "../app/firebaseConfig";
import { usePathname } from "next/navigation";
import Spinner from "./Spinner";
import UserInfo from "./UserInfo";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import TimeAgo from "react-timeago";
import { UserAuth } from "../app/context/authContext";
import {
  BiSolidLike,
  BiLike,
  BiSolidCommentDetail,
  BiCommentDetail,
  BiBookmark,
} from "react-icons/bi";
import LikeButton from "./LikeButton";
import config from "@/config.js";


export default function DetailPage() {
  const { user } = UserAuth();
  const pathname = usePathname();
  const forumId = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);

  const [commentInput, setCommentInput] = useState({
    text: "",
    userId: "", // Tambahkan data pengguna saat ini jika diperlukan
  });
  const [detailForum, setDetailForum] = useState<any>(null); // State untuk data detail modul
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (forumId) {
      // Lakukan permintaan ke API untuk mendapatkan data detail modul berdasarkan ID
      fetch(`${config.API_URL}/api/forum/${forumId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data postingan.");
          }
          return response.json();
        })
        .then((data) => {
          setDetailForum(data); // Menyimpan data detail modul dalam state
        })
        .catch((error) => {
          console.error("Gagal mengambil data postingan:", error);
        });

      fetch(`${config.API_URL}/api/forum/${forumId}/comments`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil komentar.");
          }
          return response.json();
        })
        .then((data) => {
          // Mengurutkan komentar berdasarkan waktu terbaru
          const sortedComments = data.sort(
            (
              a: {
                data: { createdAt: { _seconds: number; _nanoseconds: number } };
              },
              b: {
                data: { createdAt: { _seconds: number; _nanoseconds: number } };
              }
            ) => {
              const dateA = new Date(
                a.data.createdAt._seconds * 1000 +
                  a.data.createdAt._nanoseconds / 1000000
              ).getTime();
              const dateB = new Date(
                b.data.createdAt._seconds * 1000 +
                  b.data.createdAt._nanoseconds / 1000000
              ).getTime();

              // Urutkan data berdasarkan createdAt dari yang terbaru ke yang terlama
              return dateB - dateA;
            }
          );

          setComments(sortedComments); // Menyimpan data komentar yang telah diurutkan dalam state
        })
        .catch((error) => {
          console.error("Gagal mengambil komentar:", error);
        });
    }
  }, [forumId]);

  const handleCommentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCommentInput({
      ...commentInput,
      [name]: value,
    });
  };

  const handleCommentSubmit = async (event: FormEvent, topicId: string) => {
    event.preventDefault();
    try {
      const { text } = commentInput;

      // Dapatkan ID pengguna yang aktif (dalam hal ini, kita asumsikan pengguna sudah login)
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      if (!userId) {
        // Handle jika pengguna tidak terotentikasi atau belum masuk
        console.error("Pengguna belum terotentikasi atau belum masuk.");
        return;
      }

      // Kirim komentar ke endpoint Express dengan ID pengguna yang aktif
      const response = await axios.post(
        `${config.API_URL}/api/forum/${topicId}/comments`,
        { text, userId }
      );

      if (response.status === 200) {
        // Clear the comment input after a successful submission
        setCommentInput({
          text: "",
          userId: "",
        });

        // Refresh comments data after a successful submission
        fetch(`${config.API_URL}/api/forum/${topicId}/comments`)
          .then((response) => response.json())
          .then((data) => {
            setComments(data); // Update comments with the latest data
          })
          .catch((error) => {
            console.error("Gagal mengambil komentar:", error);
          });
      }
    } catch (error) {
      console.error("Gagal menambahkan komentar:", error);
    }
  };

  return (
    <div className="p-4 w-full md:w-3/4 items-center justify-center mx-auto">
      {detailForum ? (
        <div className="items-start px-4 py-6 my-5 shadow-md rounded-lg border">
          <div className="flex">
            <div className="p-6 bg-slate-500 rounded-full mr-2"></div>
            <div className="items-center justify-between">
              <p className="text-lg font-semibold text-gray-900 -mt-1">
                <UserInfo uid={detailForum.data.userId as string} />
              </p>
              <p className="text-gray-700 text-sm">
                {" "}
                <TimeAgo
                  className="text-sm text-gray-500"
                  date={new Date(detailForum.data.createdAt._seconds * 1000)}
                />
              </p>
            </div>
          </div>
          <div className="my-3">
            <p className="text-gray-700 text-xl font-bold">
              {detailForum.data.title}
            </p>
            <p className="text-gray-700">{detailForum.data.topics}</p>
            {detailForum.data.images.map(
              (
                image: string | StaticImport,
                index: React.Key | null | undefined
              ) => (
                <Image
                  key={index}
                  src={image}
                  width={1000}
                  height={1000}
                  alt={`Gambar ${index}`}
                />
              )
            )}
          </div>
          <hr />
          <div className=" mt-3 flex items-center">
            <div className="flex 2 text-gray-700 text-sm mr-3">
              <LikeButton itemId={detailForum.id} />
              <span>{detailForum.data.likes}</span>
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <BiCommentDetail size="20" />
              <span>{detailForum.commentCount}</span>
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <BiBookmark size="20" />
            </div>
          </div>
          <hr className="mt-3" />
          {user ? (
            <form
              className=" w-full p-4 flex space-x-4"
              onSubmit={(e) => handleCommentSubmit(e, detailForum.id)}
            >
              <input
                type="text"
                name="text"
                autoComplete="off"
                className="border rounded-md p-2 flex-1 border-gray-300"
                placeholder="Tambahkan komentar"
                value={commentInput.text}
                onChange={handleCommentInputChange}
                required
              />
              <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm"
              >
                Kirim Komentar
              </button>
            </form>
          ) : (
            <p>Login dulu bang - Protected Route</p>
          )}
          {/* Formulir komentar */}
        </div>
      ) : (
        <Spinner />
      )}

      {comments.length > 0 ? (
        <div className=" items-start px-4 py-6 my-5 shadow-md rounded-lg outline-1 border">
          {comments.map((comment: any) => (
            <div key={comment.id} className=" my-3">
              <div className="flex">
                <div className="p-6 bg-slate-500 rounded-full mr-2"></div>
                <div className="items-center justify-between mt-2">
                  <p className="text-base font-semibold text-gray-900 -mt-1">
                    <UserInfo uid={comment.data.userId as string} />
                  </p>
                  <p className="text-gray-700 text-sm">
                    <TimeAgo
                      className="text-sm text-gray-500"
                      date={new Date(comment.data.createdAt._seconds * 1000)}
                    />
                  </p>
                </div>
              </div>
              <div className="my-3">
                <p className="text-gray-700">{comment.data.text}</p>
              </div>
              <hr />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
