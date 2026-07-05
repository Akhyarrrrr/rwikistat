"use client";

import { FaApple, FaGooglePlay } from "react-icons/fa6";

export default function DownloadNow() {
  return (
    <section id="download" className="relative overflow-hidden bg-ink-50 py-20 md:py-32">
      {/* subtle bg gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(0,122,112,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-800 via-brand-800 to-brand-900 p-1 shadow-2xl shadow-brand-950/20">
          <div className="grid gap-0 rounded-[2.25rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_50%)] p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-6 md:p-12 lg:p-16">
            {/* Text */}
            <div className="max-w-xl">
              <p className="rw-kicker text-brand-200">Akses di mana saja</p>
              <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
                Belajar dari web atau mobile, sesukamu.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-brand-100/80">
                Akses modul, forum, compiler, dan profil belajar dari perangkat yang paling nyaman. Tersedia di Android dan iOS.
              </p>

              {/* Download buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-ink-900 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 active:translate-y-0 active:scale-[0.98]">
                  <FaGooglePlay size={22} className="text-brand-700" />
                  <div className="text-left leading-tight">
                    <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-ink-400">Segera Hadir</span>
                    <span>Google Play</span>
                  </div>
                </button>
                <button
                  onClick={() => window.open("https://apps.apple.com/id/app/rwikistat/id6739125153", "_blank")}
                  className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-ink-900 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 active:translate-y-0 active:scale-[0.98]"
                >
                  <FaApple size={24} className="text-brand-700" />
                  <div className="text-left leading-tight">
                    <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-ink-400">Unduh di</span>
                    <span>App Store</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone mockup visual */}
            <div className="relative mt-10 hidden md:block md:mt-0">
              <div className="relative mx-auto h-[420px] w-[210px] overflow-hidden rounded-[2.5rem] border-[3px] border-white/20 bg-brand-950 shadow-2xl shadow-black/30">
                {/* notch */}
                <div className="absolute left-1/2 top-0 z-10 h-7 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
                {/* screen */}
                <div className="flex h-full flex-col justify-center px-4 pt-10">
                  <div className="mb-3 text-center">
                    <span className="inline-flex rounded-lg bg-brand-500/20 px-3 py-1 font-mono text-[0.6rem] font-semibold text-brand-200">R Compiler</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-white/10" />
                    <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
                    <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
                  </div>
                  <div className="mt-5 rounded-xl bg-brand-500/15 p-3 font-mono text-[0.55rem] leading-relaxed text-brand-100">
                    {`model <- lm(nilai ~ latihan)
summary(model)`}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/5 p-2 text-center">
                      <div className="font-mono text-sm font-bold text-white">12</div>
                      <div className="text-[0.5rem] text-brand-200/70">Modul</div>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2 text-center">
                      <div className="font-mono text-sm font-bold text-white">89</div>
                      <div className="text-[0.5rem] text-brand-200/70">Forum</div>
                    </div>
                  </div>
                  {/* bottom nav */}
                  <div className="mt-auto flex justify-between pb-2 pt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 w-6 rounded-full ${i === 2 ? "bg-brand-300" : "bg-white/15"}`} />
                    ))}
                  </div>
                </div>
              </div>
              {/* glow behind phone */}
              <div className="absolute inset-0 -z-10 translate-y-8 scale-90 rounded-full bg-brand-400/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
