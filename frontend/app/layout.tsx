import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientWrapper from "./ClientWrapper";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "RWikiStat",
  description: "Platform belajar statistika dengan R, compiler, modul, forum, dan AI.",
  verification: {
    google: "11Xtq9cHvNyWjdeZUEQJriO-737INPZVdPCkjC8LTpc",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-ink-50 text-ink-900 antialiased font-sans">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
