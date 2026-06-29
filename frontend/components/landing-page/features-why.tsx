import { FaBoltLightning, FaLightbulb, FaPeopleGroup } from "react-icons/fa6";
import { IoLibrarySharp } from "react-icons/io5";

const items = [
  {
    icon: <IoLibrarySharp size={22} />,
    title: "Materi bertahap",
    desc: "Modul disusun untuk memahami konsep, lalu langsung mencoba contoh R.",
  },
  {
    icon: <FaBoltLightning size={20} />,
    title: "Compiler siap jalan",
    desc: "Jalankan script, grafik, dan Shiny dari browser tanpa setup lokal panjang.",
  },
  {
    icon: <FaPeopleGroup size={22} />,
    title: "Forum belajar",
    desc: "Pertanyaan statistik punya konteks, komentar, bookmark, dan skor partisipasi.",
  },
  {
    icon: <FaLightbulb size={20} />,
    title: "AI pendamping",
    desc: "Chatbot membantu menjelaskan konsep ketika modul atau error R masih membingungkan.",
  },
];

export default function FeaturesBlocks() {
  return (
    <section id="modul" className="bg-ink-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl rw-reveal">
          <h2 className="rw-heading">Belajar statistik tanpa memisahkan teori dan praktik.</h2>
          <p className="mt-4 text-base leading-7 text-ink-600">
            RWikiStat dirancang untuk ritme belajar kampus: baca, coba, simpan hasil, lalu diskusi ketika mentok.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <div key={item.title} className={`rw-card rw-reveal stagger-${i + 1} p-6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg`}>
              <div className="rw-icon">{item.icon}</div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-ink-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
