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

const VerifiedCard = ({
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
    <div className="rw-card flex items-center justify-between gap-4 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
      <Link href={link} className="flex min-w-0 items-center gap-3">
        {profileImage ? (
          <Image
            src={profileImage}
            className="rounded-xl object-cover"
            alt="profile"
            width={52}
            height={52}
          />
        ) : (
          <div className="flex size-[52px] items-center justify-center rounded-xl bg-brand-50 font-semibold text-brand-700">
            {(name || "U").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center">
            <p className="truncate text-sm font-semibold text-ink-950">{name}</p>
            {verified ? (
              <MdVerified size={18} className="ml-1 shrink-0 text-brand-600" />
            ) : (
              ""
            )}
          </div>
          <p className="truncate text-xs text-ink-500">{email}</p>
        </div>
      </Link>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="soft"
          color="success"
          onClick={() => setOpenVerify(true)}
        >
          Verify
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

export default VerifiedCard;
