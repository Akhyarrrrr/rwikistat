"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { UserAuth } from "../context/authContext";
import config from "@/lib/config";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";

export default function AdminDashboard() {
  const { user } = UserAuth();
  const [stats, setStats] = useState({ users: 0, modules: 0, forumPosts: 0 });

  useEffect(() => {
    const token = localStorage.getItem("customToken");
    if (!token) return;

    fetch(`${config.API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, users: data.length })))
      .catch(() => {});

    fetch(`${config.API_URL}/api/admin/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats((s) => ({ ...s, modules: data.length })))
      .catch(() => {});

    fetch(`${config.API_URL}/api/forum`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const count = Array.isArray(data) ? data.length : data.forumData?.length || 0;
        setStats((s) => ({ ...s, forumPosts: count }));
      })
      .catch(() => {});
  }, []);

  return (
    <Box>
      <Typography level="h2" sx={{ color: "#00726B", mb: 3 }}>
        Dashboard
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Sheet sx={{ p: 3, borderRadius: "md", minWidth: 200 }}>
          <Typography level="body-sm">Total Users</Typography>
          <Typography level="h2">{stats.users}</Typography>
        </Sheet>
        <Sheet sx={{ p: 3, borderRadius: "md", minWidth: 200 }}>
          <Typography level="body-sm">Total Modul</Typography>
          <Typography level="h2">{stats.modules}</Typography>
        </Sheet>
        <Sheet sx={{ p: 3, borderRadius: "md", minWidth: 200 }}>
          <Typography level="body-sm">Forum Posts</Typography>
          <Typography level="h2">{stats.forumPosts}</Typography>
        </Sheet>
      </Box>
    </Box>
  );
}
