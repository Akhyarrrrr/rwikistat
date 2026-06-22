"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { auth } from "@/app/firebase";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { UserAuth } from "@/app/context/authContext";
import Pagination from "@/components/Pagination";
import { BiCommentDetail, BiLink } from "react-icons/bi";
import LikeButton from "@/components/LikeButton";
import Bookmark from "@/components/Bookmark";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Modal from "@mui/joy/Modal";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "@/config.js";
import Snackbar from "@mui/joy/Snackbar";
import { Button, Typography } from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";
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
    uid: string;
  };
  commentCount: number;
}

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  // Tambahkan properti pengguna lainnya sesuai kebutuhan
}

interface NewPost {
  topics: string;
  title: string;
  images: File[];
  uid: string;
}

const ForumComponent: React.FC = () => {
  const notify = () =>
    toast("🦄 Wow so easy!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  useEffect(() => {
    document.title = "Forum Diskusi | Rwikistat";
    return () => {};
  }, []);

  const [open, setOpen] = React.useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(true);
  const { user } = UserAuth();
  const [forumData, setForumData] = useState<ForumData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [newPost, setNewPost] = useState<NewPost>({
    topics: "",
    title: "",
    images: [],
    uid: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const photoURL = user?.photoURL || "";
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page: number | undefined) => {
    try {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");
      console.log(storedToken);

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      const url = `${config.API_URL}/api/forum/page?page=${page}`;

      const response = await axios.get(url, { headers });
      if (response.status === 200) {
        const { forumData, currentPage, totalPages } = response.data;

        // Set data forum, nomor halaman saat ini, dan jumlah total halaman
        setForumData(forumData);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
      } else {
        console.error("Gagal mengambil data:", response.statusText);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    // Memanggil fetchData untuk mengambil data awal
    fetchData(currentPage);
  }, [currentPage]);

  // Dapatkan data forum untuk halaman saat ini
  const currentForumData = forumData;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPost({
        ...newPost,
        images: Array.from(event.target.files),
      });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      const user = auth.currentUser;

      formData.append("topics", newPost.topics);
      formData.append("title", newPost.title);
      if (user) {
        console.log("user", user.uid);
        formData.append("uid", user?.uid ?? "");
      }
      newPost.images.forEach((image) => {
        formData.append("images", image);
      });
      console.log("form", formData);

      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      const response = await axios.post(
        `${config.API_URL}/api/forum`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh data setelah berhasil menambahkan postingan
        fetchData(currentPage);
        setOpen(false);
        // Reset formulir setelah berhasil menambahkan postingan
        setNewPost({
          topics: "",
          uid: "",
          images: [],
          title: "",
        });
      }
    } catch (error) {
      console.error("Gagal menambahkan postingan:", error);
    }
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="w-full md:w-3/4 items-center justify-center mx-auto px-3">
      <div className="w-full shadow-md bg-white rounded-lg border mb-3 font-poppins">
        <React.Fragment>
          {/* <Button variant="outlined" color="neutral" onClick={() => setOpenSnackbar(true)}>
            Show Snackbar
          </Button> */}
          <Snackbar
            variant="soft"
            color="success"
            open={openSnackbar}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            startDecorator={<StarIcon />}
            endDecorator={
              <Button
                onClick={() => setOpenSnackbar(false)}
                size="sm"
                variant="soft"
                color="success"
                sx={{ fontFamily: "Poppins" }}
              >
                Mengerti
              </Button>
            }
          >
            <Typography className="font-poppins" level="title-sm">
              Dapatkan 5 Poin untuk setiap pertanyaan, atau dapatkan 10 Poin
              untuk setiap jawaban yang membantu!
            </Typography>
          </Snackbar>
        </React.Fragment>
        <Link href={"/forum/search"}>
          <div
            className=" flex items-center md:py-2 mx-7 my-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
            // onClick={() => setOpen(true)}
          >
            <IoSearch size={22} className="text-gray-500 ml-2" />
            <h3 className=" text-sm text-gray-500 ">Cari Sesuatu...</h3>
          </div>
        </Link>
      </div>
      <div className="p-4 md:p-6 shadow-md bg-white rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="rounded-full mr-2">
              <Image
                src={photoURL}
                alt="profile"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
          </div>
          <div
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <h3 className=" text-base text-gray-500">
              Tanyakan Sesuatu di Forum Diskusi ini...
            </h3>
          </div>
        </div>
      </div>

      <React.Fragment>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999999,
            p: 2,
          }}
        >
          <Sheet
            variant="plain"
            sx={{
              width: 700,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <div className="px-4 py-2 mt-10">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className=" block text-base font-medium text-black">
                    Judul Topik
                  </label>
                  <label className="block text-xs font-medium text-gray-400">
                    Tolong berikan informasi yang spesifik dan dengan konteks
                    yang jelas.
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    required
                    placeholder="contoh : Apa itu bahasa pemrograman R?"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white  p-3 text-sm text-gray-800 outline-none "
                  />
                </div>

                <div className="mb-5">
                  <label className=" block text-base font-medium text-black">
                    Deskripsi Penjelasan
                  </label>
                  <label className="block text-xs font-medium text-gray-400">
                    Jelaskan masalah anda sesuai dengan judul
                  </label>
                  <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <div className="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
                      <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                        <div className="flex items-center space-x-1 sm:pr-4">
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 "
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 px-4 bg-white rounded-b-lg ">
                      <label htmlFor="editor" className="sr-only">
                        Publish post
                      </label>
                      <textarea
                        id="editor"
                        className="block px-0 w-full text-sm text-gray-800 bg-white border-0  focus:ring-0 md:h-40"
                        name="topics"
                        placeholder="Topik"
                        value={newPost.topics}
                        onChange={handleTextareaChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className=" block text-base font-medium text-black">
                    Tambahkan Foto
                  </label>
                  <label className="block text-xs font-medium text-gray-400">
                    Masukan foto pendukung jika ada
                  </label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900  rounded-md cursor-pointer bg-gray-50  focus:outline-none border "
                  />
                </div>
                <button
                  type="submit"
                  className="mt-7 hover:shadow-form w-full rounded-md bg-[#00726B] py-2 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Tanyakan
                </button>
              </form>
            </div>
          </Sheet>
        </Modal>
      </React.Fragment>

      {/* Tampilkan postingan yang ada */}
      {currentForumData.map((item) => (
        <div
          key={item.id}
          className=" items-start px-4 py-6 my-5 shadow-md rounded-lg outline-1 border"
        >
          <Link href={`userId/${item.data.uid}`}>
            <div className="flex">
              <div className=" rounded-full mr-2">
                <Image
                  src={item.user.photoURL}
                  alt="Picture of the author"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>

              <div className="items-center justify-between">
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-gray-900 -mt-1">
                    {item.user.displayName}
                  </p>
                  {item.user.verified && (
                    <MdVerified
                      size={18}
                      className="mb-1 ml-1 text-[#00726B]"
                    />
                  )}
                </div>
                <p className="text-gray-700 text-sm">
                  {item.data.createdAt._seconds * 1000 >
                  new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
                    <TimeAgo
                      date={new Date(item.data.createdAt._seconds * 1000)}
                    />
                  ) : (
                    <span>
                      {new Date(
                        item.data.createdAt._seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Link>
          <Link href={`/forum/${item.id}`}>
            <div className="my-3">
              <p className="text-gray-700 text-xl font-bold">
                {item.data.title}
              </p>
              <p className="text-gray-700">{item.data.topics}</p>
            </div>
          </Link>
          <hr />
          <div className=" mt-3 flex items-center">
            <div className="flex 2 text-gray-700 text-sm mr-3">
              <LikeButton itemId={item.id} />
              <span>{item.data.likes}</span>
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <BiCommentDetail size="20" />
              <span>{item.commentCount}</span>
            </div>
            <div className="flex  text-gray-700 text-sm mr-3">
              <Bookmark itemId={item.id} />
            </div>
            <div className="flex  text-gray-700 text-sm mr-3 hover:text-[#00726B]">
              <LinkButton itemId={item.id} />
            </div>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default ForumComponent;
