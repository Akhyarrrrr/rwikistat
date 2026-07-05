import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import ClientWrapper from "./ClientWrapper";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
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
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-ink-50 text-ink-900 antialiased font-sans">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
