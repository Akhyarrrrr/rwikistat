"use client";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "../context/authContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import { StyledEngineProvider } from "@mui/joy/styles";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthContextProvider>
        <StyledEngineProvider injectFirst>
          <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100dvh" }}>
              <Sidebar />
              <Header />
              <Box
                component="main"
                className="MainContent"
                sx={{
                  pt: {
                    xs: "calc(12px + var(--Header-height))",
                    md: 3,
                  },
                  pb: {
                    xs: 2,
                    sm: 2,
                    md: 3,
                  },
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  height: "100dvh",
                  gap: 1,
                  overflow: "auto",
                }}
              >
                {children}
              </Box>
            </Box>
          </CssVarsProvider>
        </StyledEngineProvider>
      </AuthContextProvider>
    </div>
  );
}
