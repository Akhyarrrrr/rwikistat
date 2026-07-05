"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-50 pt-28 md:pt-32">
      <div className="relative mx-auto grid min-h-[calc(100dvh-7rem)] max-w-6xl items-center gap-10 px-4 pb-16 md:grid-cols-[1.02fr_0.98fr] md:px-6">
        <div className="rw-reveal">
          <p className="mb-5 inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            Statistik, R, dan diskusi dalam satu ruang belajar
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-ink-950 md:text-7xl">
            Belajar statistika R dengan alur yang rapi.
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
          <div className="rw-panel overflow-hidden p-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <div>
                <p className="text-sm font-semibold text-ink-950">R Compiler</p>
                <p className="text-xs text-ink-500">Modul 03: regresi linear</p>
              </div>
              <span className="rounded-lg bg-brand-50 px-3 py-1 font-mono text-xs font-semibold text-brand-700">ready</span>
            </div>
            <pre className="mt-4 overflow-hidden rounded-xl bg-ink-950 p-4 font-mono text-xs leading-6 text-brand-100">
{`model <- lm(nilai ~ latihan)
summary(model)
plot(model)`}
            </pre>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Modul", "Forum", "Compiler"].map((item) => (
                <div key={item} className="rounded-xl border border-ink-100 bg-white p-4">
                  <p className="font-mono text-2xl font-semibold text-brand-700">R</p>
                  <p className="mt-2 text-sm font-semibold text-ink-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
