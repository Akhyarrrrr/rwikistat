"use client";
import React, { useState, useEffect } from "react";
import { UserAuth } from "@/app/context/authContext";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import { BiCommentDetail, BiLink } from "react-icons/bi";
import TimeAgo from "react-timeago";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import { BiSolidBookmark } from "react-icons/bi";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { ListItemDecorator } from "@mui/joy";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import { MdVerified } from "react-icons/md";
import StarRating from "@/components/StarRating";
import config from "@/lib/config";
import LinkButton from "@/components/LinkButton";

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

interface userData {
  uid: string;
  email: string;
}

const Page = () => {
  useEffect(() => {
    document.title = "Pengguna | Rwikistat";
    return () => {};
  }, []);

  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<ForumData[]>([]);
  const [posted, setPosted] = useState<ForumData[]>([]);
  const [forumData, setForumData] = useState<ForumData[]>([]);
  const photoURL = user?.photoURL || "";
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentBookmarkPage, setCurrentBookmarkPage] = useState(1);
  const [totalBookmarkPages, setTotalBookmarkPages] = useState(0);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [score, setScore] = useState(null);
  const [detailUser, setDetailUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };
    checkUser();
  }, [user]);

  const fetchScore = async () => {
    try {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };

      if (user) {
        const uid = user.uid;
        // Mengirim request ke API
        const response = await axios.get(
          `${config.API_URL}/api/user/${uid}/score`,
          { headers }
        );

        // Mengubah state dengan data yang diterima dari API
        setScore(response.data.score);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchScore();
  }, [user]);

  const fetchUser = async () => {
    if (user) {
      const id = user.uid;
      const storedToken = localStorage.getItem("customToken");
      // Lakukan permintaan ke API untuk mendapatkan data detail modul berdasarkan ID
      fetch(`${config.API_URL}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data user.");
          }
          return response.json();
        })
        .then((data) => {
          setDetailUser(data); // Menyimpan data detail modul dalam state
          console.log("datauser", data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };
  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchUser();
  }, [user]);

  const fetchBookmark = async (page: number | undefined) => {
    try {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      if (user) {
        const uid = user.uid;
        const url = `${config.API_URL}/api/forum/bookmarks/${uid}?page=${page}`;
        const response = await axios.get(url, { headers });
        if (response.status === 200) {
          const {
            bookmarks,
            currentBookmarkPage,
            totalBookmarkPages,
            totalBookmarks,
          } = response.data;
          setBookmarks(bookmarks);
          setCurrentBookmarkPage(currentBookmarkPage);
          setTotalBookmarkPages(totalBookmarkPages);
          setTotalBookmarks(totalBookmarks);
        } else {
          console.error(
            "Gagal mendapatkan postingan yang dibookmark:",
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchBookmark(currentBookmarkPage);
  }, [currentBookmarkPage, user]);

  const currentBookmarked = bookmarks;

  const fetchPosted = async (page: number | undefined) => {
    try {
      if (user) {
        // Mendapatkan token dari localStorage atau sumber lainnya
        const storedToken = localStorage.getItem("customToken");

        // Membuat header dengan menyertakan token
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const uid = user.uid;
        const url = `${config.API_URL}/api/forum/posted/${uid}?page=${page}`;
        const response = await axios.get(url, { headers });
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
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchPosted(currentPage);
  }, [currentPage, user]);

  const currentPosted = forumData;
  const jumlahCurrentPosted = totalPosts;

  return (
    <div className="">
      {loading ? (
        <Spinner />
      ) : user ? (
        <div className="w-full -mt-6  items-center justify-center mx-auto bg-white">
          <main className="flex-1">
            <section className="h-36 md:h-56 bg-gradient-to-t from-[#00726B] to-[#38B68D] bg-center bg-cover "></section>
            <section className="container px-4 py-10 mx-auto -mt-28">
              <div className="flex flex-col items-center">
                <div className="object-cover w-32 h-32  border-4 border-white rounded-lg shadow-md">
                  <Image
                    src={photoURL}
                    alt="profile"
                    width={128}
                    height={128}
                  />
                </div>

                <div className="flex flex-col items-center mt-4">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="text-xl font-semibold text-gray-800 sm:text-3xl">
                      {user.displayName}
                    </h3>
                    {detailUser?.verified && (
                      <MdVerified size={24} className="text-[#00726B]" />
                    )}
                  </div>

                  <h5 className="text-lg text-center text-gray-500 ">
                    {detailUser?.email}
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

              <div className="w-full mx-auto h-96 mt-10">
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
                      fontFamily: "Poppins",
                    }}
                  >
                    <Tab
                      variant="plain"
                      color="neutral"
                      disableIndicator
                      indicatorInset
                    >
                      <ListItemDecorator>
                        <QuestionAnswerRoundedIcon
                          sx={{ with: 20, height: 20 }}
                        />
                      </ListItemDecorator>
                      My Post
                    </Tab>
                    <Tab
                      variant="plain"
                      color="neutral"
                      disableIndicator
                      indicatorInset
                    >
                      <ListItemDecorator>
                        <BiSolidBookmark size="20" />
                      </ListItemDecorator>
                      My Bookmark
                    </Tab>
                  </TabList>
                  <TabPanel value={0}>
                    {currentPosted.map((post) => (
                      <div
                        key={post.id}
                        className=" w-[700px]  items-start px-4 py-6 my-5 shadow-md rounded-lg outline-1 border font-poppins"
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
                              <p className="text-lg font-semibold text-gray-900 -mt-1 font-poppins">
                                {post.user.displayName}
                              </p>
                              {post.user.verified && (
                                <MdVerified
                                  size={18}
                                  className="mb-1 ml-1 text-[#00726B]"
                                />
                              )}
                            </div>
                            <p className="text-gray-700 text-sm font-poppins">
                              {post.data.createdAt._seconds * 1000 >
                              new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                                <TimeAgo
                                  date={
                                    new Date(
                                      post.data.createdAt._seconds * 1000
                                    )
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
                            <p className="text-gray-700 text-xl font-bold font-poppins">
                              {post.data.title}
                            </p>
                            <p className="text-gray-700 font-poppins">
                              {post.data.topics}
                            </p>
                          </div>
                        </Link>
                        <hr />
                        <div className=" mt-3 flex items-center">
                          <div className="flex 2 text-gray-700 text-sm mr-3 font-poppins">
                            <LikeButton itemId={post.id} />
                            <span>{post.data.likes}</span>
                          </div>
                          <div className="flex  text-gray-700 text-sm mr-3 font-poppins">
                            <BiCommentDetail size="20" />
                            <span>{post.commentCount}</span>
                          </div>
                          <div className="flex  text-gray-700 text-sm mr-3 font-poppins">
                            <Bookmark itemId={post.id} />
                          </div>
                          <div className="flex  text-gray-700 text-sm mr-3 hover:text-[#00726B] font-poppins">
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
                  <TabPanel value={1}>
                    {currentBookmarked.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="w-[700px] items-start px-4 py-6 my-5 shadow-md rounded-lg outline-1 border font-poppins"
                      >
                        <div className="flex">
                          <div className=" rounded-full mr-2">
                            <Image
                              src={bookmark.user.photoURL}
                              alt="Picture of the author"
                              width={50}
                              height={50}
                              className="rounded-full"
                            />
                          </div>
                          <div className="items-center justify-between">
                            <div className="flex items-center">
                              <p className="text-lg font-semibold text-gray-900 -mt-1 font-poppins">
                                {bookmark.user.displayName}
                              </p>
                              {bookmark.user.verified && (
                                <MdVerified
                                  size={18}
                                  className="mb-1 ml-1 text-[#00726B]"
                                />
                              )}
                            </div>

                            <p className="text-gray-700 text-sm font-poppins">
                              {bookmark.data.createdAt._seconds * 1000 >
                              new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                                <TimeAgo
                                  date={
                                    new Date(
                                      bookmark.data.createdAt._seconds * 1000
                                    )
                                  }
                                />
                              ) : (
                                <span>
                                  {new Date(
                                    bookmark.data.createdAt._seconds * 1000
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Link href={`/forum/${bookmark.id}`}>
                          <div className="my-3">
                            <p className="text-gray-700 text-xl font-bold font-poppins">
                              {bookmark.data.title}
                            </p>
                            <p className="text-gray-700 font-poppins">
                              {bookmark.data.topics}
                            </p>
                          </div>
                        </Link>
                        <hr />
                        <div className=" mt-3 flex items-center font-poppins">
                          <div className="flex 2 text-gray-700 text-sm mr-3">
                            <LikeButton itemId={bookmark.id} />
                            <span>{bookmark.data.likes}</span>
                          </div>
                          <div className="flex  text-gray-700 text-sm mr-3">
                            <BiCommentDetail size="20" />
                            <span>{bookmark.commentCount}</span>
                          </div>
                          <div className="flex  text-gray-700 text-sm mr-3">
                            <Bookmark itemId={bookmark.id} />
                          </div>
                          <div className="flex  text-gray-700 text-sm mr-3 hover:text-[#00726B]">
                            <LinkButton itemId={bookmark.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentBookmarked.length > 0 ? (
                      <Pagination
                        currentPage={currentBookmarkPage}
                        totalPages={totalBookmarkPages}
                        onPageChange={(page) => setCurrentBookmarkPage(page)}
                      />
                    ) : null}
                  </TabPanel>
                </Tabs>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <p>Silahkan Login terlebih dahulu - Protected Route</p>
      )}
    </div>
  );
};

export default Page;
