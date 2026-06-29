"use client";

import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./mobile-menu";

const navItems = [
  { href: "#fitur", label: "Fitur" },
  { href: "#modul", label: "Modul" },
  { href: "#download", label: "Mobile" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-4 z-30 px-4">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/80 bg-white/90 px-4 shadow-xl shadow-brand-950/10 backdrop-blur-xl md:px-5">
        <Link href="/" className="flex items-center rounded-xl bg-white px-2 py-1 ring-1 ring-ink-100">
          <Image
            className="object-contain"
            src="/logo-horizontal.png"
            alt="RWikiStat"
            width={132}
            height={42}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/signin" className="btn-primary ml-2">
            Belajar Sekarang
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
