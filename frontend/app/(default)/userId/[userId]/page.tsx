"use client";
import React, { useCallback, useEffect, useState } from "react";
import profile from "@/assets/images/profile.png";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { ListItemDecorator } from "@mui/joy";
import Pagination from "@/components/Pagination";
import { MdVerified } from "react-icons/md";
import { BiCommentDetail, BiLink } from "react-icons/bi";
import TimeAgo from "react-timeago";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import { BiSolidBookmark } from "react-icons/bi";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import config from "@/config.js";
import LinkButton from "@/components/LinkButton";
import { getFirebaseIdTokenHeaders } from "@/lib/authHeaders";

interface UserData {
  id: number;
  data: {
    displayName: string;
    email: string;
    photoURL: string;
  };
}

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

export default function Page() {
  useEffect(() => {
    document.title = "User | Rwikistat";
    return () => {};
  }, []);

  const pathname = usePathname();
  const uid = pathname.split("/")[2];
  const [detailUser, setDetailUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [forumData, setForumData] = useState<ForumData[]>([]);
  const [score, setScore] = useState(null);

  const fetchScore = useCallback(async () => {
    try {
      if (uid) {
        // Mengirim request ke API
        const response = await axios.get(
          `${config.API_URL}/api/user/${uid}/score`,
          { headers: getFirebaseIdTokenHeaders() }
        );

        // Mengubah state dengan data yang diterima dari API
        setScore(response.data.score);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, [uid]);

  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchScore();
  }, [fetchScore]);

  useEffect(() => {
    if (uid) {
      // Lakukan permintaan ke API untuk mendapatkan data detail modul berdasarkan ID
      fetch(`${config.API_URL}/api/user/${uid}`, {
        headers: getFirebaseIdTokenHeaders(),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data detail user.");
          }
          return response.json();
        })
        .then((data) => {
          setDetailUser(data);
        })
        .catch((error) => {
          console.error("Gagal mengambil data detail user:", error);
        });
    }
  }, [uid]);

  const fetchPosted = useCallback(async (page: number | undefined) => {
    try {
      const url = `${config.API_URL}/api/forum/posted/${uid}?page=${page}`;
      const response = await axios.get(url, {
        headers: getFirebaseIdTokenHeaders(),
      });
      if (response.status === 200) {
        const { forumData, currentPage, totalPages, totalPosts } =
          response.data;
        setForumData(forumData);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setTotalPosts(totalPosts);
      } else {
        console.error(
          "Gagal mendapatkan postingan yang diposting:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, [uid]);

  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchPosted(currentPage);
  }, [currentPage, fetchPosted]);

  const currentPosted = forumData;
  const jumlahCurrentPosted = totalPosts;

  return (
    <div className="w-full -mt-6  items-center justify-center mx-auto bg-white">
      <main className="flex-1">
        <section className="h-36 md:h-56 bg-gradient-to-t from-[#00726B] to-[#38B68D] bg-center bg-cover "></section>
        <section className="container px-4 py-10 mx-auto -mt-28">
          {detailUser && (
            <div className="flex flex-col items-center">
              <div className="object-cover w-32 h-32 bg-red-300  border-4 border-white rounded-lg shadow-md">
                <Image
                  src={detailUser.photoURL}
                  alt="profile"
                  width={128}
                  height={128}
                />
              </div>

              <div className="flex flex-col items-center mt-4">
                <h3 className="text-xl font-semibold text-center text-gray-800 sm:text-3xl ">
                  {detailUser.displayName}
                </h3>
                <h5 className="text-lg text-center text-gray-500 ">
                  {detailUser.email}
                </h5>
                <div className="flex items-center justify-center mt-4 space-x-2">
                  {score !== null ? (
                    <div>
                      {/* <p>Your Score: {score}</p> */}
                      <StarRating score={score} />
                    </div>
                  ) : (
                    <p>Loading score...</p>
                  )}
                </div>
                <div className="flex flex-col items-center mt-10 sm:flex-row sm:space-x-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    <span className="font-bold">{jumlahCurrentPosted}</span>{" "}
                    Posts in Forum{" "}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full md:w-3/4 mx-auto h-96 mt-10">
            <Tabs
              defaultValue={0}
              sx={{ alignItems: "center", backgroundColor: "white" }}
            >
              <TabList
                disableUnderline
                sx={{
                  p: 0.5,
                  gap: 0.5,
                  borderRadius: "xl",
                  bgcolor: "background.level1",
                }}
              >
                <Tab
                  variant="plain"
                  color="neutral"
                  disableIndicator
                  indicatorInset
                >
                  <ListItemDecorator>
                    <QuestionAnswerRoundedIcon sx={{ with: 20, height: 20 }} />
                  </ListItemDecorator>
                  User Post
                </Tab>
              </TabList>
              <TabPanel value={0}>
                {currentPosted.map((post) => (
                  <div
                    key={post.id}
                    className=" w-[700px] items-start px-4 py-6 my-5 shadow-md rounded-lg outline-1 border"
                  >
                    <div className="flex">
                      <div className=" rounded-full mr-2">
                        <Image
                          src={post.user.photoURL}
                          alt="Picture of the author"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </div>
                      <div className="items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-lg font-semibold text-gray-900 -mt-1">
                            {post.user.displayName}
                          </p>
                          {post.user.verified && (
                            <MdVerified
                              size={18}
                              className="mb-1 ml-1 text-[#00726B]"
                            />
                          )}
                        </div>
                        <p className="text-gray-700 text-sm">
                          {post.data.createdAt._seconds * 1000 >
                          new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                            <TimeAgo
                              date={
                                new Date(post.data.createdAt._seconds * 1000)
                              }
                            />
                          ) : (
                            <span>
                              {new Date(
                                post.data.createdAt._seconds * 1000
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Link href={`/forum/${post.id}`}>
                      <div className="my-3">
                        <p className="text-gray-700 text-xl font-bold">
                          {post.data.title}
                        </p>
                        <p className="text-gray-700">{post.data.topics}</p>
                      </div>
                    </Link>
                    <hr />
                    <div className=" mt-3 flex items-center">
                      <div className="flex 2 text-gray-700 text-sm mr-3">
                        <LikeButton itemId={post.id} />
                        <span>{post.data.likes}</span>
                      </div>
                      <div className="flex  text-gray-700 text-sm mr-3">
                        <BiCommentDetail size="20" />
                        <span>{post.commentCount}</span>
                      </div>
                      <div className="flex  text-gray-700 text-sm mr-3">
                        <Bookmark itemId={post.id} />
                      </div>
                      <div className="flex  text-gray-700 text-sm mr-3 hover:text-[#00726B]">
                        <LinkButton itemId={post.id} />
                      </div>
                    </div>
                  </div>
                ))}
                {currentPosted.length > 0 ? (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                ) : null}
              </TabPanel>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
}
