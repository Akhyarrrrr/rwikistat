"use client";

import { FaApple } from "react-icons/fa";
import { IoLogoAndroid } from "react-icons/io";

export default function DownloadNow() {
  return (
    <section id="download" className="bg-ink-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rw-panel overflow-hidden bg-brand-800 text-white">
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10 lg:p-14">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
                Lanjutkan belajar dari web atau mobile.
              </h2>
              <p className="mt-4 text-base leading-7 text-brand-50">
                Akses modul, forum, compiler, dan profil belajar dari perangkat yang paling nyaman.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                <IoLogoAndroid size={24} />
                Android
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                onClick={() => window.open("https://apps.apple.com/id/app/rwikistat/id6739125153", "_blank")}
              >
                <FaApple size={22} />
                iOS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
