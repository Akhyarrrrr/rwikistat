import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../app/firebaseConfig";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import config from "@/config.js";

const Bookmark: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [bookmarkButton, setBookmarkButton] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Periksa apakah pengguna telah menyukai postingan
    handleIsBookmarked(itemId);
  }, [itemId]);

  const handleIsBookmarked = async (itemId: string) => {
    try {
      const user = auth.currentUser;
      const uid = user?.uid; // Get the user ID from the authentication object

      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };

      if (uid) {
        // Kirim permintaan API untuk mengambil data like
        const response = await axios.get(
          `${config.API_URL}/api/forum/bookmark/${itemId}/is-bookmarked`,
          {
            headers: headers, // Pass headers in the config object
            params: { uid: uid }, // Include email as a query parameter
          }
        );

        if (response.status === 200) {
          setBookmarkButton(response.data.isBookmarked);
          // console.log(response.data.isLiked);
          setIsLoading(false);
        }
      } else {
        // Pengguna belum masuk, jangan lakukan apa-apa
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal mengambil bookmark:", error);
      setIsLoading(false);
    }
  };

  const handleBookmark = async (itemId: string) => {
    try {
      const user = auth.currentUser;
      const uid = user?.uid; // Get the user ID from the authentication object

      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };

      if (uid) {
        // Kirim permintaan API untuk menyukai postingan
        const response = await axios.post(
          `${config.API_URL}/api/forum/bookmark/${itemId}`,
          { uid: uid },
          { headers: headers }
        );

        if (response.status === 200) {
          // Set state dan simpan status like di sesi penyimpanan lokal
          setBookmarkButton(true);
          sessionStorage.setItem(`bookmarked_${itemId}`, "true");
        }
      } else {
        // Pengguna belum masuk, jangan lakukan apa-apa
      }
    } catch (error) {
      console.error("Gagal bookmark postingan:", error);
    }
  };

  const handleUnbookmark = async (itemId: string) => {
    try {
      const user = auth.currentUser;
      const uid = user?.uid; // Get the user ID from the authentication object

      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };

      if (uid) {
        // Kirim permintaan API untuk membatalkan like postingan
        const response = await axios.post(
          `${config.API_URL}/api/forum/unbookmark/${itemId}`,
          { uid: uid },
          { headers: headers }
        );

        if (response.status === 200) {
          // Set state dan simpan status unlike di sesi penyimpanan lokal
          setBookmarkButton(false);
          sessionStorage.setItem(`bookmarked_${itemId}`, "false");
        }
      } else {
        // Pengguna belum masuk, jangan lakukan apa-apa
      }
    } catch (error) {
      console.error("Gagal membatalkan bookmark postingan:", error);
    }
  };

  const onPressHandler = bookmarkButton ? handleUnbookmark : handleBookmark;

  return (
    <button onClick={() => onPressHandler(itemId)} id={itemId}>
      {bookmarkButton ? (
        <BiSolidBookmark size="20" color="#00726B" />
      ) : (
        <BiBookmark size="20" color="black" />
      )}
    </button>
  );
};

export default Bookmark;
