"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { auth } from "@/app/firebase";
import { usePathname } from "next/navigation";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import TimeAgo from "react-timeago";
import { UserAuth } from "@/app/context/authContext";
import { BiCommentDetail, BiBookmark } from "react-icons/bi";
import LikeButton from "@/components/LikeButton";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import config from "@/config.js";
import Bookmark from "@/components/Bookmark";

export default function DetailPage() {
  useEffect(() => {
    document.title = "Forum | Rwikistat";
    return () => {};
  }, []);

  const { user } = UserAuth();
  const pathname = usePathname();
  const forumId = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);

  const [commentInput, setCommentInput] = useState({
    text: "",
    uid: "", // Tambahkan data pengguna saat ini jika diperlukan
  });
  const [detailForum, setDetailForum] = useState<any>(null); // State untuk data detail modul
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (forumId) {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      // Lakukan permintaan ke API untuk mendapatkan data detail modul berdasarkan ID
      fetch(`${config.API_URL}/api/forum/${forumId}`, { headers })
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

      fetch(`${config.API_URL}/api/forum/${forumId}/comments`, { headers })
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
      const uid = auth.currentUser ? auth.currentUser.uid : null;

      if (!uid) {
        // Handle jika pengguna tidak terotentikasi atau belum masuk
        console.error("Pengguna belum terotentikasi atau belum masuk.");
        return;
      }
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };

      // Kirim komentar ke endpoint Express dengan ID pengguna yang aktif
      const response = await axios.post(
        `${config.API_URL}/api/forum/${topicId}/comments`,
        { text, uid },
        { headers }
      );

      if (response.status === 200) {
        // Clear the comment input after a successful submission
        setCommentInput({
          text: "",
          uid: "",
        });

        // Refresh comments data after a successful submission
        fetch(`${config.API_URL}/api/forum/${topicId}/comments`, { headers })
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
    <div className="p-4 w-full md:w-3/4 items-center justify-center mx-auto font-poppins">
      {detailForum ? (
        <div className="items-start px-4 py-6 my-5 shadow-md rounded-lg border font-poppins">
          <Link href={`/userId`}>
            <div className="flex">
              <div className=" rounded-full mr-2">
                <Image
                  src={detailForum.user.photoURL}
                  alt="Picture of the author"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <div className="items-center justify-between">
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-gray-900 -mt-1">
                    {detailForum.user.displayName}
                  </p>
                  {detailForum.user.verified && (
                    <MdVerified
                      size={18}
                      className="mb-1 ml-1 text-[#00726B]"
                    />
                  )}
                </div>
                <p className="text-gray-700 text-sm">
                  {" "}
                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={new Date(detailForum.data.createdAt._seconds * 1000)}
                  />
                </p>
              </div>
            </div>
          </Link>
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
              <Bookmark itemId={detailForum.id} />
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
                className="bg-[#00726B] text-white px-4 py-2 rounded-md text-sm"
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
                <div className="rounded-full mr-2">
                  <Image
                    src={comment.user.photoURL}
                    alt="Picture of the author"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div className="items-center justify-between mt-2">
                  <div className="flex items-center">
                    <p className="text-lg font-semibold text-gray-900 -mt-1">
                      {comment.user.displayName}
                    </p>
                    {comment.user.verified && (
                      <MdVerified
                        size={18}
                        className="mb-1 ml-1 text-[#00726B]"
                      />
                    )}
                  </div>
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
