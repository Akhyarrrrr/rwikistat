"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext";
import config from "@/lib/config";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";

interface Module {
  id: string;
  data: {
    judulModul: string;
    namaModul: string;
    isLocked?: boolean;
  };
}

export default function ManageModul() {
  const { user } = UserAuth();
  const [modules, setModules] = useState<Module[]>([]);

  const fetchModules = () => {
    const token = localStorage.getItem("customToken");
    fetch(`${config.API_URL}/api/admin/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setModules)
      .catch(() => {});
  };

  useEffect(() => { fetchModules(); }, []);

  const toggleLock = (id: string) => {
    const token = localStorage.getItem("customToken");
    fetch(`${config.API_URL}/api/admin/modules/${id}/lock`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        setModules((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, data: { ...m.data, isLocked: res.isLocked } } : m
          )
        );
      })
      .catch(() => {});
  };

  return (
    <Box>
      <Typography level="h2" sx={{ color: "#00726B", mb: 3 }}>
        Manage Modul
      </Typography>
      {modules.map((mod) => (
        <Sheet
          key={mod.id}
          sx={{ p: 2, mb: 1, borderRadius: "md", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <Box>
            <Typography level="title-md">{mod.data.judulModul || mod.data.namaModul}</Typography>
            <Typography level="body-sm" sx={{ color: mod.data.isLocked ? "danger.500" : "success.500" }}>
              {mod.data.isLocked ? "Terkunci" : "Terbuka"}
            </Typography>
          </Box>
          <Button
            size="sm"
            color={mod.data.isLocked ? "success" : "danger"}
            onClick={() => toggleLock(mod.id)}
          >
            {mod.data.isLocked ? "Buka" : "Kunci"}
          </Button>
        </Sheet>
      ))}
    </Box>
  );
}
