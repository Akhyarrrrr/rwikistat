import Image from "next/image";
import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import ModalClose from "@mui/joy/ModalClose";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import config from "@/lib/config";

interface VeriviedData {
  id: number;
  imageName: string;
  imageUrl: string;
}

const VeriviedCard = ({ id, imageName, imageUrl }: VeriviedData) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const url = imageUrl.startsWith("http") ? imageUrl : `${config.API_URL}${imageUrl}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = imageName;
    link.click();
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const storedToken = localStorage.getItem("customToken");
      const response = await fetch(`${config.API_URL}/api/history/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (response.ok) {
        console.log("Image deleted successfully");
        setOpen(false);
      } else {
        console.error("Failed to delete image:", response.statusText);
      }
    } catch (error) {
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
