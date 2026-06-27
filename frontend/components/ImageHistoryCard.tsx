import { MdVerified } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DeleteForever from "@mui/icons-material/DeleteForever";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import axios from "axios";
import testImage from "@/public/mipa.jpeg";
import { FaDownload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import config from "@/config.js";
import { Typography } from "@mui/joy";

interface VeriviedData {
  id: number;
  imageName: string;
  imageUrl: string;
}

const VeriviedCard = ({ id, imageName, imageUrl }: VeriviedData) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const url = `${config.API_URL}${imageUrl}`;

  const handleDownload = async () => {
    try {
      // Kirim permintaan GET ke endpoint download
      const response = await fetch(
        `${config.API_URL}/api/history/download/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Jika Anda membutuhkan otentikasi, tambahkan header token di sini
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
        }
      );

      // Periksa apakah respon adalah sukses (status kode 200)
      if (response.ok) {
        // Ubah respons ke blob untuk mendownload file
        const blob = await response.blob();
        // Buat URL objek dari blob
        const url = window.URL.createObjectURL(blob);
        // Buat link <a> untuk mengunduh file
        const link = document.createElement("a");
        link.href = url;
        link.download = imageName; // Nama file yang diunduh
        // Klik pada link untuk memulai unduhan
        link.click();
        // Hapus URL objek setelah unduhan selesai
        window.URL.revokeObjectURL(url);
        setOpen(false);
      } else {
        // Tangani jika ada kesalahan dalam permintaan
        console.error("Failed to download image:", response.statusText);
      }
    } catch (error) {
      // Tangani jika terjadi kesalahan saat melakukan permintaan
      console.error("Error downloading image:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Kirim permintaan DELETE ke endpoint hapus gambar
      const response = await fetch(
        `${config.API_URL}/api/history/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Jika Anda membutuhkan otentikasi, tambahkan header token di sini
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
        }
      );

      // Periksa apakah respon adalah sukses (status kode 200)
      if (response.ok) {
        // Tambahkan logika untuk menangani jika gambar berhasil dihapus
        console.log("Image deleted successfully");
        setOpen(false);
        // Tambahkan logika untuk memperbarui tampilan setelah gambar dihapus
      } else {
        // Tangani jika ada kesalahan dalam permintaan
        console.error("Failed to delete image:", response.statusText);
      }
    } catch (error) {
      // Tangani jika terjadi kesalahan saat melakukan permintaan
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="p-3 shadow-sm flex justify-between bg-white rounded-md border items-center ">
      <p className="text-base text-[#00726B]">{imageName}</p>
      <div>
        <React.Fragment>
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            Lihat
          </Button>
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
              <ModalClose
                variant="plain"
                sx={{ m: 1 }}
                onClick={() => setOpen(false)}
              />
              <div className="px-4 py-2 mt-10  mx-auto">
                <div className="mb-5">
                  <p className="text-base text-[#00726B]">{imageName}</p>
                  <Image
                    src={url}
                    alt={"plot image"}
                    width={500}
                    height={500}
                  />
                </div>
                <div className="flex flex-row gap-3 items-end">
                  <button
                    onClick={handleDownload}
                    className=" bg-[#00726B] py-2 px-10 rounded-lg hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                  >
                    <FaDownload size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className=" bg-red-600 py-2 px-10 rounded-lg hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                  >
                    <MdDeleteForever size={16} />
                  </button>
                </div>
              </div>
            </Sheet>
          </Modal>
        </React.Fragment>
      </div>
    </div>
  );
};
export default VeriviedCard;
