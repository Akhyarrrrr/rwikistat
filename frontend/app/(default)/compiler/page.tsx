"use client";
import React, { useEffect, useState, useCallback } from "react";
import CodeEditorWindow from "@/components/compiler/CodeEditorWindows";
import config from "@/lib/config";

const CodeEditor = () => {
  useEffect(() => {
    document.title = "Compiler R | Rwikistat";
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
    setOutput(""); setPlotImage(null); setErrorMsg(""); setShinyUrl(null);
  };

  const handleRunString = async () => {
    try {
      setProcessing(true); clearOutput();
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
    return () => { stopShiny(); };
  }, [stopShiny]);

  const handleRunGraph = async () => {
    try {
      setProcessing(true); clearOutput();
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

  const processingLabel = option === "graph"
    ? (code.includes("shinyApp") || code.includes("runApp") ? "Menjalankan Shiny..." : "Memproses...")
    : "Memproses...";

  return (
    <>
      <div className="px-5">
        <div className="flex flex-col md:flex-row items-center gap-4 pb-4 px-3 justify-end">
          <select
            className="w-64 text-center text-[#00726B] font-semibold outline-none rounded-md border border-gray-300 p-2"
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
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              processing ? "bg-gray-400" : "bg-[#00726B] hover:bg-[#005b54]"
            }`}
          >
            {processing ? processingLabel : "Run"}
          </button>
        </div>

        <div className="w-full">
          <CodeEditorWindow code={code} onChange={onChange} language="r" theme="vs-dark" defaultValue="" />
        </div>

        <h2 className="font-bold text-xl mb-2 mt-5 text-[#00726B]">Output</h2>

        {errorMsg && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}

        {processing && option === "graph" && (code.includes("shinyApp") || code.includes("runApp")) && !shinyUrl && (
          <div className="w-full bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
            Menunggu aplikasi Shiny siap...
          </div>
        )}

        {shinyUrl && (
          <div className="w-full border border-gray-300 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
              <span className="font-medium text-green-700">Aplikasi Shiny berjalan</span>
              <div className="flex items-center gap-2">
                <button onClick={stopShiny} className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                  Stop
                </button>
              </div>
            </div>
            <iframe
              src={shinyUrl}
              className="w-full h-[600px]"
              title="Shiny App"
              onError={() => setErrorMsg("Gagal memuat aplikasi Shiny. Periksa apakah port dapat diakses.")}
            />
          </div>
        )}

        {plotImage && (
          <img src={`data:image/png;base64,${plotImage}`} alt="Output grafik" className="max-w-full border border-gray-300 rounded-lg mb-4" />
        )}

        {(option === "string" || output) && !shinyUrl && (
          <div className="w-full min-h-48 bg-[#1E1E1E] text-green-500 font-normal text-sm overflow-y-auto p-4 rounded-lg">
            {output || (processing ? "" : "Klik Run untuk menjalankan kode.")}
          </div>
        )}
      </div>
    </>
  );
};

export default CodeEditor;
