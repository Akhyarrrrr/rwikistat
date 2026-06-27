"use client";
import React, { useEffect, useState, useCallback } from "react";
import CodeEditorWindow from "@/components/compiler/CodeEditorWindows";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "@/config.js";

const CodeEditor = () => {
  useEffect(() => {
    document.title = "Compiler | Rwikistat";
  }, []);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [shinyUrl, setShinyUrl] = useState<string | null>(null);
  const [shinySessionId, setShinySessionId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [option, setOption] = useState("string");

  const handleRunString = async () => {
    try {
      setProcessing(true);
      setErrorMsg("");
      setPlotImage(null);
      const storedToken = localStorage.getItem("customToken");

      const response = await fetch(`${config.API_URL}/api/compiler/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.text();
      setOutput(data);
    } catch (error: any) {
      console.error("Error:", error);
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ sessionId: shinySessionId }),
      });
    } catch {}
    setShinyUrl(null);
    setShinySessionId(null);
  }, [shinySessionId]);

  // Cleanup Shiny on unmount
  useEffect(() => {
    return () => { stopShiny(); };
  }, [stopShiny]);

  const handleRunGraph = async () => {
    try {
      setProcessing(true);
      setErrorMsg("");
      setOutput("");
      setPlotImage(null);
      setShinyUrl(null);
      setShinySessionId(null);
      const storedToken = localStorage.getItem("customToken");

      const response = await fetch(`${config.API_URL}/api/compiler/graph`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          code,
          libs: ["library(ggplot2)", "library(lattice)"],
        }),
      });

      const data = await response.json();

      if (data.type === "shiny") {
        setShinyUrl(data.url);
        setShinySessionId(data.sessionId);
      } else {
        setOutput(data.output || "");
        if (data.image) {
          setPlotImage(data.image);
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMsg("Gagal terhubung ke server. Pastikan backend sedang berjalan.");
    } finally {
      setProcessing(false);
    }
  };

  const onChange = (action: string, data: string) => {
    if (action === "code") {
      setCode(data);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="px-5">
        <div className="flex flex-col md:flex-row items-center gap-4 pb-4 px-3 justify-end">
          <div className="flex">
            <select
              className="w-96 text-center text-[#00726B] font-semibold outline-none rounded-md font-poppins border border-gray-300 p-2"
              name="option"
              id="pilihan"
              onChange={async (e) => {
                setOption(e.target.value);
                setOutput("");
                setPlotImage(null);
                setErrorMsg("");
                if (e.target.value !== "graph") {
                  await stopShiny();
                }
              }}
            >
              <option value="string">R Compiler</option>
              <option value="graph">Graph Compiler</option>
            </select>
          </div>
          <button
            onClick={option === "string" ? handleRunString : handleRunGraph}
            disabled={!code || processing}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              processing ? "bg-gray-400" : "bg-[#00726B] hover:bg-[#005b54]"
            }`}
          >
            {processing ? "Processing..." : "Run"}
          </button>
        </div>

        <div className="w-full">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language="r"
            theme="vs-dark"
            defaultValue=""
          />
        </div>

        <h1 className="font-bold text-xl mb-2 mt-5 text-[#00726B]">Output</h1>

        {errorMsg && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}

        {option === "string" && (
          <div className="flex flex-col">
            <div className="w-full h-96 bg-[#1E1E1E] text-green-500 font-normal text-sm overflow-y-auto p-4">
              {output}
            </div>
          </div>
        )}

        {option === "graph" && (
          <div className="flex flex-col gap-4">
            {shinyUrl && (
              <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 flex justify-between items-center">
                  <span>Shiny App running at <a href={shinyUrl} target="_blank" className="text-[#00726B] underline">{shinyUrl}</a></span>
                  <button
                    onClick={stopShiny}
                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    Stop
                  </button>
                </div>
                <iframe
                  src={shinyUrl}
                  className="w-full h-[600px]"
                  title="Shiny App"
                />
              </div>
            )}
            {plotImage && (
              <img
                src={`data:image/png;base64,${plotImage}`}
                alt="Plot output"
                className="max-w-full border border-gray-300 rounded-lg"
              />
            )}
            {output && (
              <div className="w-full h-48 bg-[#1E1E1E] text-green-500 font-normal text-sm overflow-y-auto p-4 rounded-lg">
                {output}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CodeEditor;
