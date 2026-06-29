"use client";

import Image from "next/image";
import Link from "next/link";
import Typed from "typed.js";
import React from "react";
import mipa from "@/public/mipa.jpeg";

export default function Hero() {
  const word = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!word.current) return;
    const typed = new Typed(word.current, {
      strings: ["praktis", "interaktif", "terarah"],
      typeSpeed: 76,
      backSpeed: 38,
      backDelay: 1200,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink-50 pt-28 md:pt-32">
      <div className="absolute inset-0 rw-surface-grid opacity-70" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[calc(100dvh-7rem)] max-w-6xl items-center gap-10 px-4 pb-16 md:grid-cols-[1.02fr_0.98fr] md:px-6">
        <div className="rw-reveal">
          <p className="mb-5 inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            Statistik, R, dan diskusi dalam satu ruang belajar
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-ink-950 md:text-7xl">
            Belajar statistika R secara <span className="text-brand-700" ref={word} />.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">
            Baca modul, jalankan kode R, simpan grafik, dan tanya komunitas tanpa pindah platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signin" className="btn-primary px-6 py-3 text-base">
              Mulai Belajar
            </Link>
            <Link href="#fitur" className="btn-secondary px-6 py-3 text-base">
              Lihat Fitur
            </Link>
          </div>
        </div>

        <div className="rw-reveal stagger-2">
          <div className="rw-panel overflow-hidden p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={mipa}
                alt="Lingkungan belajar RWikiStat"
                fill
                priority
                sizes="(min-width: 768px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-xl bg-brand-700 p-4 text-white">
                <p className="font-mono text-3xl font-semibold">R</p>
                <p className="mt-2 text-sm text-brand-50">Compiler dan grafik siap dipakai di browser.</p>
              </div>
              <pre className="overflow-hidden rounded-xl bg-ink-950 p-4 font-mono text-xs leading-6 text-brand-100">
{`model <- lm(nilai ~ latihan)
summary(model)
plot(model)`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
