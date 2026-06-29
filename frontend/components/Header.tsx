"use client";

import { IoMenu } from "react-icons/io5";
import { toggleSidebar } from "./utils";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[9997] flex h-16 items-center border-b border-white/80 bg-white/90 px-4 shadow-sm shadow-ink-950/5 backdrop-blur md:hidden">
      <button
        onClick={toggleSidebar}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-900 transition-colors hover:border-brand-200 hover:text-brand-700"
        aria-label="Buka sidebar"
      >
        <IoMenu size={24} />
      </button>
      <div className="ml-3">
        <p className="text-sm font-semibold text-ink-950">RWikiStat</p>
        <p className="text-xs text-ink-500">Belajar statistika dengan R</p>
      </div>
    </header>
  );
}
