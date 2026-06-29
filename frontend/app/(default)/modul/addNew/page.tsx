"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Editor from "@monaco-editor/react";
import config from "@/lib/config";

export default function Page() {
  useEffect(() => {
    document.title = "Tambah Modul | Rwikistat";
    return () => {};
  }, []);

  const [codeSampel, setCodeSampel] = useState("");
  const [textMarkdown, setTextMarkdown] = useState("");
  const [namaModul, setNamaModul] = useState("");
  const [judulModul, setJudulModul] = useState("");
  const [urlShiny, setUrlShiny] = useState("");
  const [textData, setTextData] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!namaModul || !codeSampel || !pdfFile) {
      alert("Harap lengkapi semua field.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);
    formData.append("namaModul", namaModul);
    formData.append("codeSampel", codeSampel);
    formData.append("judulModul", judulModul);
    formData.append("urlShiny", urlShiny);
    formData.append("textData", textData);
    formData.append("textMarkdown", textMarkdown);

    try {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      // Menggunakan fetch untuk mengirim data ke endpoint
      const response = await fetch(`${config.API_URL}/api/modul`, {
        method: "POST",
        body: formData,
        headers,
      });

      if (response.ok) {
        window.location.href = "/modul";
      } else {
        alert("Gagal menambahkan modul.");
      }
    } catch (error) {
      alert("Gagal menambahkan modul.");
      console.error(error);
    }
  };
  return (
    <main className="rw-page">
      <section className="rw-reveal">
        <p className="rw-kicker">Admin Modul</p>
        <h1 className="rw-heading mt-2">Tambah modul pembelajaran.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
          Upload PDF ke storage, lalu lengkapi metadata, contoh kode R, dan markdown modul.
        </p>
      </section>

      <div className="rw-card mt-7 p-5 md:p-7">
        <form
          className="space-y-6"
          onSubmit={handleFormSubmit}
          action=""
          method=""
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink-800">
                Nama modul
              </label>
              <input
                type="namaModul"
                name="namaModul"
                id="namaModul"
                value={namaModul}
                onChange={(e) => setNamaModul(e.target.value)}
                placeholder="Contoh: Modul 1"
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink-800">
                Judul modul
              </label>
              <input
                type="judulModul"
                name="judulModul"
                id="judulModul"
                value={judulModul}
                onChange={(e) => setJudulModul(e.target.value)}
                placeholder="Contoh: Belajar Dasar Statistik"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              URL Shiny
            </label>
            <input
              type="urlShiny"
              name="urlShiny"
              id="urlShiny"
              value={urlShiny}
              onChange={(e) => setUrlShiny(e.target.value)}
              placeholder="local"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              Contoh kode R
            </label>
            <textarea
              value={codeSampel}
              onChange={(e) => setCodeSampel(e.target.value)}
              autoCorrect="false"
              placeholder="Contoh: summary(cars)"
              className="input-field h-44 font-mono"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              Upload PDF modul
            </label>

            <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 px-5 py-8">
              <input
                name="file"
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-xl border border-ink-200 bg-white text-sm text-ink-600 file:mr-4 file:border-0 file:bg-brand-600 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              Markdown modul
            </label>

            <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-950">
              <Editor
                height="55vh"
                width={`100%`}
                language="markdown"
                value={textData}
                theme="vs-dark"
                defaultValue="# Add some markdown text here"
                onChange={(value) => setTextData(value || "")}
                options={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 14,
                  minimap: { enabled: false },
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              Preview markdown
            </label>
            <article
              className="rounded-2xl border border-ink-200 bg-white p-3"
              data-color-mode="light"
            >
              <MarkdownPreview source={textData} className="px-8 py-3" />
            </article>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
            >
              Tambah Modul Baru
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
