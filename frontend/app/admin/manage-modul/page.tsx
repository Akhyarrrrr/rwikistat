"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext";
import config from "@/lib/config";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import { SkeletonBlock } from "@/components/Skeleton";

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
  const [loading, setLoading] = useState(true);

  const fetchModules = () => {
    setLoading(true);
    const token = localStorage.getItem("customToken");
    fetch(`${config.API_URL}/api/admin/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => { setModules(res); setLoading(false); })
      .catch(() => setLoading(false));
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
    <Box className="animate-fade-in">
      <Typography level="h2" sx={{ color: "#007a70", mb: 3, fontWeight: 700 }}>
        Manage Modul
      </Typography>
      {loading ? Array.from({ length: 4 }).map((_, i) => (
        <Sheet key={i} sx={{ p: 2, mb: 1, borderRadius: "md", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }}>
            <SkeletonBlock className="h-5 w-48 rounded" />
            <SkeletonBlock className="h-4 w-20 mt-1 rounded" />
          </Box>
          <SkeletonBlock className="h-8 w-16 rounded" />
        </Sheet>
      )) : modules.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography>Belum ada modul.</Typography>
        </Box>
      ) : modules.map((mod) => (
        <Sheet key={mod.id} sx={{ p: 2, mb: 1, borderRadius: "md", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography level="title-md">{mod.data.judulModul || mod.data.namaModul}</Typography>
            <Typography level="body-sm" sx={{ color: mod.data.isLocked ? "danger.500" : "success.500" }}>
              {mod.data.isLocked ? "Terkunci" : "Terbuka"}
            </Typography>
          </Box>
          <Button size="sm" color={mod.data.isLocked ? "success" : "danger"} onClick={() => toggleLock(mod.id)}>
            {mod.data.isLocked ? "Buka" : "Kunci"}
          </Button>
        </Sheet>
      ))}
    </Box>
  );
}
