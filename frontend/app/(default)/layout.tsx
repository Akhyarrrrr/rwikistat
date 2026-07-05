"use client";
import "../globals.css";
import { AuthContextProvider } from "../context/authContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "../context/authContext";
import { CssVarsProvider, StyledEngineProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

function DefaultShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = UserAuth();
  const router = useRouter();
  const adminLearningMode = typeof window !== "undefined" && localStorage.getItem("adminLearningMode") === "true";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/signin");
      return;
    }
    if (isAdmin && localStorage.getItem("adminLearningMode") !== "true") {
      router.replace("/admin");
    }
  }, [isAdmin, loading, router, user]);

  if (loading || !user || (isAdmin && !adminLearningMode)) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-ink-50 text-sm font-semibold text-ink-600">
        Memuat sesi...
      </main>
    );
  }

  return (
    <StyledEngineProvider injectFirst>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Sidebar />
          <Header />
          <Box
            component="main"
            className="MainContent animate-fade-in"
            sx={{
              pt: {
                xs: "80px",
                md: 0,
              },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              overflow: "auto",
              background: "#f8faf9",
            }}
          >
            {children}
          </Box>
        </Box>
      </CssVarsProvider>
    </StyledEngineProvider>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <DefaultShell>{children}</DefaultShell>
    </AuthContextProvider>
  );
}
