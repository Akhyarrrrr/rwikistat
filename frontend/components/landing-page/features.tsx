"use client";

import { FaBookOpen, FaLaptopCode } from "react-icons/fa6";
import { IoMdChatboxes } from "react-icons/io";
import { RiRobot2Fill } from "react-icons/ri";

const features = [
  {
    icon: <FaLaptopCode size={22} />,
    title: "R Compiler",
    desc: "Eksekusi R standar, grafik, dan Shiny dengan output yang mudah dibaca.",
  },
  {
    icon: <FaBookOpen size={22} />,
    title: "Modul interaktif",
    desc: "PDF, markdown, contoh kode, dan status lock admin berada di satu alur.",
  },
  {
    icon: <IoMdChatboxes size={24} />,
    title: "Forum diskusi",
    desc: "Topik, komentar, like, bookmark, dan pencarian dibuat untuk tanya jawab belajar.",
  },
  {
    icon: <RiRobot2Fill size={24} />,
    title: "RWikiChat",
    desc: "AI stateless untuk penjelasan cepat tanpa menyimpan riwayat percakapan server.",
  },
];

export default function Features() {
  return (
    <section id="fitur" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="rw-reveal">
            <h2 className="rw-heading">Tool belajar yang benar-benar dipakai.</h2>
            <p className="mt-4 text-base leading-7 text-ink-600">
              Fokusnya bukan dekorasi. Setiap layar membantu mahasiswa membaca materi, menjalankan kode, dan meminta bantuan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((item, i) => (
              <article
                key={item.title}
                className={`rw-card rw-reveal stagger-${i + 1} p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <span className="rw-icon shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-ink-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{item.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
