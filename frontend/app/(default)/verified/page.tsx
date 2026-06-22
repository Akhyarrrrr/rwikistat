"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import ChipDelete from "@mui/joy/ChipDelete";
import { BiSolidEditAlt, BiX } from "react-icons/bi";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import IconButton from "@mui/joy/IconButton";
import { MdVerified } from "react-icons/md";
import VeriviedCard from "@/components/VeriviedCard";
import AvatarTest from "@/public/avatar-test.png";
import config from "@/config.js";

function Verivied() {
  // Buat sebuah jenis yang mencerminkan struktur data dari API
  interface UserData {
    id: number;
    data: {
      photoURL: string;
      displayName: string;
      email: string;
      verified: boolean;
    };
  }

  useEffect(() => {
    document.title = "Verified | Rwikistat";
    return () => {};
  }, []);

  // Kemudian gunakan jenis ini untuk menentukan jenis state
  const [testData, setTestData] = useState<UserData[]>([]);
  const [open, setOpen] = React.useState<number | null>(null);

  const fetchData = async () => {
    try {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      const response = await axios.get(`${config.API_URL}/api/user/`, {
        headers,
      });
      if (response.status === 200) {
        setTestData(response.data);
        console.log(response.data);
      } else {
        console.error("Gagal mengambil data:", response.statusText);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const handleDeleteUser = (id: number) => {
    setTestData((prevData) => prevData.filter((user) => user.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="px-4 md:px-7">
      <div className="flex items-center justify-between h-16 mb-5">
        <h2 className="font-bold text-2xl text-[#00726B] ">Manage User</h2>
        <Link href={`/verified/addUser`}>
          <button
            type="submit"
            className=" w-full bg-[#00726B] py-2 px-10 rounded-lg hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
          >
            Tambah User
          </button>
        </Link>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 mx-auto md:grid-cols-3 ">
        {testData.map((item) => (
          <VeriviedCard
            key={item.id}
            profileImage={item.data.photoURL}
            name={item.data.displayName}
            email={item.data.email}
            verified={item.data.verified}
            link={`userId/${item.id}`}
            id={item.id}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>
    </div>
  );
}

export default Verivied;
