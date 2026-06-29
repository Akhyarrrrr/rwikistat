"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { UserAuth } from "../../context/authContext";
import config from "@/lib/config";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Link from "next/link";
import { SkeletonBlock } from "@/components/Skeleton";

interface User {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  photoURL?: string;
  verified?: boolean;
}

export default function ManageUsers() {
  const { user } = UserAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem("customToken");
    fetch(`${config.API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => { setUsers(res); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = (uid: string, currentRole: string) => {
    const token = localStorage.getItem("customToken");
    const newRole = currentRole === "admin" ? "user" : "admin";
    fetch(`${config.API_URL}/api/admin/users/${uid}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    })
      .then((r) => {
        if (r.ok) {
          setUsers((prev) =>
            prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
          );
        }
      })
      .catch(() => {});
  };

  const deleteUser = (uid: string) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    const token = localStorage.getItem("customToken");
    fetch(`${config.API_URL}/api/admin/users/${uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== uid));
        }
      })
      .catch(() => {});
  };

  return (
    <Box className="animate-fade-in">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography level="h2" sx={{ color: "#007a70", fontWeight: 700 }}>
          Manage Users
        </Typography>
        <Link href="/verified/addUser">
          <Button size="sm" sx={{ bgcolor: "#007a70" }}>
            Tambah User
          </Button>
        </Link>
      </Box>
      {loading ? Array.from({ length: 5 }).map((_, i) => (
        <Sheet key={i} sx={{ p: 2, mb: 1, borderRadius: "md", display: "flex", alignItems: "center", gap: 2 }}>
          <SkeletonBlock className="w-8 h-8 rounded-full" />
          <Box sx={{ flex: 1 }}>
            <SkeletonBlock className="h-4 w-32 rounded" />
            <SkeletonBlock className="h-3 w-48 mt-1 rounded" />
          </Box>
          <SkeletonBlock className="h-5 w-14 rounded" />
          <SkeletonBlock className="h-8 w-28 rounded" />
          <SkeletonBlock className="h-8 w-16 rounded" />
        </Sheet>
      )) : users.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography>Belum ada user.</Typography>
        </Box>
      ) : users.map((u) => (
        <Sheet key={u.id} sx={{ p: 2, mb: 1, borderRadius: "md", display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={u.photoURL || ""} alt={u.displayName} size="sm" />
          <Box sx={{ flex: 1 }}>
            <Typography level="title-sm">{u.displayName || "-"}</Typography>
            <Typography level="body-xs">{u.email}</Typography>
          </Box>
          <Typography level="body-xs" sx={{ px: 1, py: 0.5, borderRadius: "sm", bgcolor: u.role === "admin" ? "primary.100" : "neutral.100" }}>
            {u.role}
          </Typography>
          <Button size="sm" variant="soft" color="neutral" onClick={() => toggleRole(u.id, u.role || "user")}>
            {u.role === "admin" ? "Turunkan" : "Jadikan Admin"}
          </Button>
          <Button size="sm" variant="soft" color="danger" onClick={() => deleteUser(u.id)}>
            Hapus
          </Button>
        </Sheet>
      ))}
    </Box>
  );
}
