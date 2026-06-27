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
import ModalDialog from "@mui/joy/ModalDialog";
import DeleteForever from "@mui/icons-material/DeleteForever";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import axios from "axios";
import config from "@/lib/config";

interface VeriviedData {
  profileImage: any;
  name: string;
  email: string;
  verified: boolean;
  link: string;
  id: number;
  onDelete: (id: number) => void;
}

const VeriviedCard = ({
  profileImage,
  name,
  email,
  verified,
  link,
  id,
  onDelete,
}: VeriviedData) => {
  const [openVerify, setOpenVerify] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);

  const handleVerified = (id: number) => {
    const storedToken = localStorage.getItem("customToken");
    const headers = { Authorization: `Bearer ${storedToken}` };

    axios
      .post(`${config.API_URL}/api/user/${id}`, {}, { headers })
      .then(() => {
        setOpenVerify(false);
      })
      .catch((error) => {
        console.error("Gagal memverifikasi user:", error);
      });
  };

  const handleDelete = (id: number) => {
    const storedToken = localStorage.getItem("customToken");
    const headers = { Authorization: `Bearer ${storedToken}` };

    axios
      .delete(`${config.API_URL}/api/user/${id}`, { headers })
      .then(() => {
        setOpenDelete(false);
        onDelete(id);
      })
      .catch((error) => {
        console.error("Gagal menghapus user:", error);
      });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-md">
      <Link href={link} className="flex">
        <div className="mr-2">
          <Image
            src={profileImage}
            className="rounded-full"
            alt="profile"
            width={52}
            height={52}
          />
        </div>
        <div className="items-center justify-between">
          <div className="flex items-center">
            <p className="-mt-1 text-lg font-semibold text-gray-900">{name}</p>
            {verified ? (
              <MdVerified size={18} className="mb-1 ml-1 text-[#00726B]" />
            ) : (
              ""
            )}
          </div>
          <p className="text-sm text-gray-700">{email}</p>
        </div>
      </Link>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="plain"
          color="success"
          onClick={() => setOpenVerify(true)}
        >
          Verified
        </Button>
        <Button
          size="sm"
          variant="plain"
          color="danger"
          onClick={() => setOpenDelete(true)}
        >
          <DeleteForever />
        </Button>
      </div>

      {/* Modal Verifikasi */}
      <Modal open={openVerify} onClose={() => setOpenVerify(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Apakah anda yakin ingin memverifikasi user ini?
          </DialogContent>
          <DialogActions>
            <Button
              variant="soft"
              color="success"
              onClick={() => handleVerified(id)}
            >
              Verifikasi
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenVerify(false)}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Modal Hapus */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Konfirmasi Penghapusan
          </DialogTitle>
          <Divider />
          <DialogContent>
            Apakah Anda yakin ingin menghapus user ini?
          </DialogContent>
          <DialogActions>
            <Button
              variant="soft"
              color="danger"
              onClick={() => handleDelete(id)}
            >
              Hapus
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenDelete(false)}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default VeriviedCard;
