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
import config from "@/config.js";


function ModulList() {
  // Buat sebuah jenis yang mencerminkan struktur data dari API
  interface ModulData {
    id: number;
    data: {
      namaModul: string;
      codeSampel: string;
      judulModul: string;
    };
  }

  // Kemudian gunakan jenis ini untuk menentukan jenis state
  const [testData, setTestData] = useState<ModulData[]>([]);
  const [open, setOpen] = React.useState<number | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/modul`);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (id: number) => {
    setOpen(id);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleDelete = (id: number) => {
    // Panggil endpoint dengan menggunakan ID modul
    axios
      .delete(`${config.API_URL}/api/modul/${id}`)
      .then((response) => {
        console.log(id);
        setOpen(null);
        fetchData();
      })
      .catch((error) => {
        console.error("Gagal menghapus data:", error);
        // Handle error secara sesuai kebutuhan Anda
      });
  };

  return (
    <div className="md:px-7">
      <div className="flex justify-between h-16 mb-5">
        <h2 className="font-bold text-2xl text-[#00726B] ">
          Modul Pembelajaran
        </h2>
        <Link href={`/modul/addNew`}>
          <button
            type="submit"
            className=" w-full bg-[#00726B] py-2 px-10 rounded-lg hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
          >
            Tambah Modul
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto w-full gap-5 ">
        {testData.map((item) => (
          <div
            key={item.id}
            className="group relative m-0 flex h-48 w-full rounded-xl shadow-xl  sm:mx-auto "
          >
            <div className="bg-gradient-to-t from-[#00726B] to-[#38B68D]  z-10 h-full w-full overflow-hidden rounded-xl  opacity-90 transition duration-300 ease-in-out group-hover:opacity-100">
              <div className="mx-auto flex p-3">
                <div className="p-2 absolute top-0 right-0">
                  <React.Fragment>
                    <IconButton
                      color="danger"
                      variant="solid"
                      onClick={() => handleOpen(item.id)}
                      size="md"
                    >
                      <BiX size="24" color="#fff" />
                    </IconButton>
                    <Modal
                      open={open === item.id}
                      onClose={handleClose}
                      sx={{ zIndex: 99999 }}
                    >
                      <ModalDialog variant="outlined" role="alertdialog">
                        <DialogTitle>
                          <WarningRoundedIcon />
                          Confirmation
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                          Apa anda yakin ingin menghapus modul?
                        </DialogContent>
                        <DialogActions>
                          <Button
                            variant="plain"
                            color="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </Button>
                          <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setOpen(null)}
                          >
                            Cancel
                          </Button>
                        </DialogActions>
                      </ModalDialog>
                    </Modal>
                  </React.Fragment>
                </div>
              </div>
            </div>
            <Link
              href={`/modul/${item.id}`}
              className="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110"
            >
              <div className="">
                <h1 className=" text-2xl md:text-3xl font-bold text-white">
                  {item.data.namaModul}
                </h1>
                <h1 className="text-base md:text-xl  text-gray-200">
                  {item.data.judulModul}
                </h1>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModulList;
