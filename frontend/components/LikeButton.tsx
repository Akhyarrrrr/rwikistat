import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "@/lib/firebase";
import { BiSolidLike, BiLike } from "react-icons/bi";
import config from "@/lib/config";

const LikeButton: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [likedButton, setLikedButton] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Periksa apakah pengguna telah menyukai postingan
    handleIsLiked(itemId);
  }, [itemId]);

  const handleIsLiked = async (itemId: string) => {
    try {
      const user = auth.currentUser;
      const uid = user?.uid; // Get the user ID from the authentication object

      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };

      if (user) {
        // Kirim permintaan API untuk mengambil data like
        const response = await axios.get(
          `${config.API_URL}/api/forum/like/${itemId}/is-liked`,
          {
            headers: headers, // Pass headers in the config object
            params: { uid: uid }, // Include email as a query parameter
          }
        );

        if (response.status === 200) {
          setLikedButton(response.data.isLiked);
          // console.log(response.data.isLiked);
          setIsLoading(false);
        }
      } else {
        // Pengguna belum masuk, jangan lakukan apa-apa
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal mengambil like:", error);
      setIsLoading(false);
    }
  };

  const handleLike = async (itemId: string) => {
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
          `${config.API_URL}/api/forum/like/${itemId}`,
          { uid: uid },
          { headers: headers }
        );

        if (response.status === 200) {
          // Set state dan simpan status like di sesi penyimpanan lokal
          setLikedButton(true);
          sessionStorage.setItem(`liked_${itemId}`, "true");
        }
      } else {
        // Pengguna belum masuk, jangan lakukan apa-apa
      }
    } catch (error) {
      console.error("Gagal menyukai postingan:", error);
    }
  };

  const handleUnlike = async (itemId: string) => {
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
          `${config.API_URL}/api/forum/unlike/${itemId}`,
          { uid: uid }, // Include email in the data payload
          { headers: headers } // Pass headers as the third argument
        );

        if (response.status === 200) {
          // Set state dan simpan status unlike di sesi penyimpanan lokal
          setLikedButton(false);
          sessionStorage.setItem(`liked_${itemId}`, "false");
        }
      } else {
        // Pengguna belum masuk, jangan lakukan apa-apa
      }
    } catch (error) {
      console.error("Gagal membatalkan like postingan:", error);
    }
  };

  const onPressHandler = likedButton ? handleUnlike : handleLike;

  return (
    <button onClick={() => onPressHandler(itemId)} id={itemId}>
      {likedButton ? (
        <BiSolidLike size="20" color="#00726B" />
      ) : (
        <BiLike size="20" color="black" />
      )}
    </button>
  );
};

export default LikeButton;
