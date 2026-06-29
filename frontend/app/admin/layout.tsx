"use client";
import "../globals.css";
import { AuthContextProvider, UserAuth } from "../context/authContext";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Link from "next/link";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, userData } = UserAuth();

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Silakan <Link href="/signin" className="text-brand-700">login</Link> terlebih dahulu.</Typography>
      </Box>
    );
  }

  if (!userData || userData.role !== "admin") {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography level="h4">Akses ditolak. Halaman ini hanya untuk admin.</Typography>
        <Link href="/" className="text-brand-700">Kembali ke Beranda</Link>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Sheet
        sx={{
          width: 260,
          p: 2,
          borderRight: "1px solid",
          borderColor: "rgba(219, 227, 225, .9)",
          bgcolor: "rgba(255,255,255,.92)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography level="h4" sx={{ color: "#007a70", mb: 2, fontWeight: 700 }}>
          Admin Panel
        </Typography>
        <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography level="body-md" sx={{ py: 1, px: 1, borderRadius: "sm", "&:hover": { bgcolor: "background.level1" } }}>
            Dashboard
          </Typography>
        </Link>
        <Link href="/admin/manage-modul" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography level="body-md" sx={{ py: 1, px: 1, borderRadius: "sm", "&:hover": { bgcolor: "background.level1" } }}>
            Manage Modul
          </Typography>
        </Link>
        <Link href="/admin/manage-users" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography level="body-md" sx={{ py: 1, px: 1, borderRadius: "sm", "&:hover": { bgcolor: "background.level1" } }}>
            Manage Users
          </Typography>
        </Link>
        <Box sx={{ flex: 1 }} />
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography level="body-sm" sx={{ py: 1, px: 1, borderRadius: "sm", "&:hover": { bgcolor: "background.level1" } }}>
            &larr; Kembali ke Aplikasi
          </Typography>
        </Link>
      </Sheet>
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          overflow: "auto",
          height: "100dvh",
          bgcolor: "#f8faf9",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AuthContextProvider>
        <CssVarsProvider disableTransitionOnChange>
          <CssBaseline />
          <AdminShell>{children}</AdminShell>
        </CssVarsProvider>
      </AuthContextProvider>
    </div>
  );
}
