"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import CodeEditorWindow from "@/components/compiler/CodeEditorWindows";
import config from "@/lib/config";

const CodeEditor = () => {
  useEffect(() => {
    document.title = "Compiler R | RWikiStat";
  }, []);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [shinyUrl, setShinyUrl] = useState<string | null>(null);
  const [shinySessionId, setShinySessionId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [option, setOption] = useState("string");

  const clearOutput = () => {
    setOutput("");
    setPlotImage(null);
    setErrorMsg("");
    setShinyUrl(null);
  };

  const handleRunString = async () => {
    try {
      setProcessing(true);
      clearOutput();
      const storedToken = localStorage.getItem("customToken");
      const response = await fetch(`${config.API_URL}/api/compiler/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${storedToken}` },
        body: JSON.stringify({ code }),
      });
      setOutput(await response.text());
    } catch {
      setOutput("Gagal terhubung ke server. Pastikan backend sedang berjalan.");
    } finally {
      setProcessing(false);
    }
  };

  const stopShiny = useCallback(async () => {
    if (!shinySessionId) return;
    try {
      const storedToken = localStorage.getItem("customToken");
      await fetch(`${config.API_URL}/api/compiler/shiny/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${storedToken}` },
        body: JSON.stringify({ sessionId: shinySessionId }),
      });
    } catch {}
    setShinyUrl(null);
    setShinySessionId(null);
  }, [shinySessionId]);

  useEffect(() => {
    return () => {
      stopShiny();
    };
  }, [stopShiny]);

  const handleRunGraph = async () => {
    try {
      setProcessing(true);
      clearOutput();
      const storedToken = localStorage.getItem("customToken");
      const response = await fetch(`${config.API_URL}/api/compiler/graph`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${storedToken}` },
        body: JSON.stringify({ code, libs: ["library(ggplot2)", "library(lattice)"] }),
      });
      const data = await response.json();
      if (data.type === "shiny") {
        setShinyUrl(data.url);
        setShinySessionId(data.sessionId);
      } else {
        setOutput(data.output || "");
        if (data.image) setPlotImage(data.image);
      }
    } catch {
      setErrorMsg("Gagal terhubung ke server. Pastikan backend sedang berjalan.");
    } finally {
      setProcessing(false);
    }
  };

  const onChange = (action: string, data: string) => {
    if (action === "code") setCode(data);
  };

  const isShinyRun = option === "graph" && (code.includes("shinyApp") || code.includes("runApp"));
  const processingLabel = option === "graph" ? (isShinyRun ? "Menjalankan Shiny..." : "Memproses grafik...") : "Menjalankan...";

  return (
    <main className="rw-page">
      <section className="rw-reveal grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="rw-kicker">R Compiler</p>
          <h1 className="rw-heading mt-2">Tulis kode R, lihat outputnya langsung.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600">
            Gunakan mode standar untuk teks, atau mode grafik untuk plot dan Shiny.
          </p>
        </div>

        <div className="rw-card flex flex-col gap-3 p-3 sm:flex-row">
          <select
            className="input-field min-w-56 py-2.5 text-center font-semibold text-brand-700"
            value={option}
            onChange={async (e) => {
              setOption(e.target.value);
              clearOutput();
              if (e.target.value !== "graph") await stopShiny();
            }}
          >
            <option value="string">Eksekusi Standar</option>
            <option value="graph">Grafik &amp; Shiny</option>
          </select>
          <button
            onClick={option === "string" ? handleRunString : handleRunGraph}
            disabled={!code || processing}
            className="btn-primary min-w-32"
          >
            {processing ? processingLabel : "Run"}
          </button>
        </div>
      </section>

      <section className="mt-6 rw-reveal stagger-2">
        <CodeEditorWindow code={code} onChange={onChange} language="r" theme="vs-dark" defaultValue="" />
      </section>

      <section className="mt-6 rw-reveal stagger-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink-950">Output</h2>
          {shinyUrl ? (
            <button onClick={stopShiny} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100">
              Stop Shiny
            </button>
          ) : null}
        </div>

        {errorMsg ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        ) : null}

        {processing && isShinyRun && !shinyUrl ? (
          <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            Menunggu aplikasi Shiny siap...
          </div>
        ) : null}

        {shinyUrl ? (
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-600">
              <span className="font-semibold text-brand-700">Aplikasi Shiny berjalan</span>
              <a href={shinyUrl} target="_blank" className="font-mono text-xs text-brand-700 underline">
                buka tab baru
              </a>
            </div>
            <iframe
              src={shinyUrl}
              className="h-[600px] w-full"
              title="Shiny App"
              onError={() => setErrorMsg("Gagal memuat aplikasi Shiny. Periksa apakah port dapat diakses.")}
            />
          </div>
        ) : null}

        {plotImage ? (
          <Image
            src={`data:image/png;base64,${plotImage}`}
            alt="Output grafik"
            width={1200}
            height={800}
            unoptimized
            className="mb-4 h-auto max-w-full rounded-2xl border border-ink-200 bg-white shadow-sm"
          />
        ) : null}

        {(option === "string" || output) && !shinyUrl ? (
          <pre className="min-h-48 overflow-auto rounded-2xl border border-ink-800 bg-ink-950 p-5 font-mono text-sm leading-6 text-brand-100 shadow-xl shadow-ink-950/10">
            {processing ? "Memproses output..." : output || "Klik Run untuk menjalankan kode."}
          </pre>
        ) : null}
      </section>
    </main>
  );
};

export default CodeEditor;
