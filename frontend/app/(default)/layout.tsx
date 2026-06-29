"use client";
import "../globals.css";
import { AuthContextProvider } from "../context/authContext";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import * as React from "react";
import { CssVarsProvider, StyledEngineProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

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
                  background:
                    "linear-gradient(180deg, rgba(232,248,244,.7), rgba(248,250,249,0) 320px), #f8faf9",
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
