"use client";
import React, { useEffect, ChangeEvent, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Spinner from "@/components/Spinner";
import CodeEditorWindow from "@/components/compiler/CodeEditorWindows";
import Select from "react-select";
import axios from "axios";
import { useRouter } from "next/navigation";
import MarkdownPreview from "@uiw/react-markdown-preview";
import config from "@/config.js";
import { Button } from "@nextui-org/react";
import { classnames } from "@/components/compiler/utils/general";

interface ModulData {
  id: number;
  data: {
    namaModul: string;
    codeSampel: string;
    judulModul: string;
    textData: string;
  };
}

interface DropdownProps {
  options: string[];
}

export default function DetailPage() {
  useEffect(() => {
    document.title = "Baca Modul | Rwikistat";
    return () => {};
  }, []);

  const pathname = usePathname();
  const modulId = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState(null);
  const [detailModul, setDetailModul] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [theme, setTheme] = useState("amy");
  const router = useRouter();
  const [postContent, setPostContent] = useState("");
  const [output, setOutput] = useState("");
  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [shinyUrl, setShinyUrl] = useState<string | null>(null);
  const [shinySessionId, setShinySessionId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const language = {
    id: 80,
    name: "R (4.0.0)",
    label: "R (4.0.0)",
    value: "r",
  };

  const [testData, setTestData] = useState<ModulData[]>([]);
  const [response, setResponse] = useState("");
  const defaultCode = detailModul?.data?.codeSampel || "";
  const [code, setCode] = useState<string>(defaultCode);
  const pdfUrlWithParams = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
  const [downloadClicked, setDownloadClicked] = useState(false);

  useEffect(() => {
    if (modulId) {
      const storedToken = localStorage.getItem("customToken");
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      fetch(`${config.API_URL}/api/modul/${modulId}`, { headers })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data detail modul.");
          }
          return response.json();
        })
        .then((data) => {
          setDetailModul(data);
          setPdfUrl(data.data.pdfPath);
        })
        .catch((error) => {
          console.error("Gagal mengambil data detail modul:", error);
        });
    }
  }, [modulId]);

  // Fungsi untuk menangani klik tombol download
  const handleDownloadClick = () => {
    setDownloadClicked(true);

    // Lakukan proses download (bisa menggunakan window.open atau metode lain)
    // Misalnya, menggunakan window.open
    window.open(pdfUrlWithParams, "_blank");
  };

  const fetchData = async () => {
    try {
      // Mendapatkan token dari localStorage atau sumber lainnya
      const storedToken = localStorage.getItem("customToken");

      // Membuat header dengan menyertakan token
      const headers = {
        Authorization: `Bearer ${storedToken}`,
      };
      const response = await axios.get(`${config.API_URL}/api/modul`, {
        headers,
      });
      if (response.status === 200) {
        setTestData(response.data);
        // console.log(response.data);
      } else {
        console.error("Gagal mengambil data:", response.statusText);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const options = testData
    .map((module) => ({
      label: module.data.namaModul,
      value: module.id,
    }))
    .sort((a: any, b: any) => {
      const numA = parseInt(a.label.match(/\d+/));
      const numB = parseInt(b.label.match(/\d+/));
      return numA - numB;
    });

  const handleChange = (selectedOption: any) => {
    router.push(`/modul/${selectedOption.value}`);
  };

  const handleCodeChange = (action: any, data: string) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        // console.warn("case not handled!", action, data);
      }
    }
  };
  const [mode, setMode] = useState<"text" | "graph">("text");

  const handleRunString = async () => {
    try {
      setProcessing(true);
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
    } catch (error) {
      console.error("Error:", error);
      setOutput("Terjadi kesalahan saat mengirim kode.");
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

  useEffect(() => {
    return () => { stopShiny(); };
  }, [stopShiny]);

  const handleRunGraph = async () => {
    try {
      setProcessing(true);
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
    } catch (error) {
      console.error("Error:", error);
      setOutput("Terjadi kesalahan saat menjalankan kode.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="px-8">
      {detailModul ? (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-7 mb-5 bg-gray-100 px-5 py-3 outline outline-1 rounded-lg outline-gray-300">
            <h1 className=" font-extrabold text-base md:text-2xl text-[#00726B]">
              {detailModul.data.namaModul} :{" "}
              <span className="font-medium">{detailModul.data.judulModul}</span>
            </h1>
            <div className="grid grid-cols-2 gap-3">
              <Select
                placeholder="Pilih Modul"
                options={options}
                onChange={handleChange}
              />
              <div>
                {pdfUrl && !downloadClicked && (
                  <a href={pdfUrlWithParams} download="your-pdf-file.pdf">
                    <button
                      onClick={handleDownloadClick}
                      className='block w-full bg-[#00726B] py-2 rounded-lg text-white font-semibold md:col-span-1"'
                    >
                      Download PDF
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>

          <article data-color-mode="light" className="px-14 py-7">
            <MarkdownPreview source={detailModul.data.textData} />
          </article>
          <hr />
          <div className=" mt-5">
            <div className="flex p-5 justify-between items-center">
              <div>
                <h1 className="font-bold text-base md:text-2xl text-[#00726B]">
                  Compiler {detailModul.data.namaModul}
                </h1>
                <p className="text-gray-600 text-sm mt-2">
                  Harap melakukan aksi seperti mengetik, menghapus atau mengedit
                  apapun pada editor sebelum menekan tombol{" "}
                  <strong>Compile</strong>.
                </p>
              </div>

              <div className="flex gap-3 items-center">
                {errorMessage && (
                  <p className="text-red-600 text-sm">{errorMessage}</p>
                )}

                <select
                  className="text-center text-[#00726B] font-semibold outline-none rounded-md font-poppins border border-gray-300 p-2"
                  value={mode}
                  onChange={async (e) => {
                    setMode(e.target.value as "text" | "graph");
                    setOutput("");
                    setPlotImage(null);
                    if (e.target.value !== "graph") {
                      await stopShiny();
                    }
                  }}
                >
                  <option value="text">R Compiler</option>
                  <option value="graph">Graph Compiler</option>
                </select>

                <Button
                  onClick={mode === "text" ? handleRunString : handleRunGraph}
                  disabled={!code || processing}
                  value={code}
                  className={classnames(
                    "block w-56 bg-[#00726B] py-2 rounded-lg duration-500 text-white font-semibold md:col-span-1",
                    !code ? "opacity-50" : ""
                  )}
                >
                  {processing ? "Processing..." : "Run"}
                </Button>
              </div>
            </div>

            <div>
              <CodeEditorWindow
                code={detailModul.data.codeSampel}
                onChange={handleCodeChange}
                language="r"
                theme="vs-dark"
                defaultValue={undefined}
              />
            </div>
          </div>

          <div className="flex flex-col mt-5">
            <h1 className="font-bold text-xl mb-2 text-[#00726B]">Output</h1>

            {mode === "text" && (
              <div className="w-full h-96 bg-[#1E1E1E] text-green-500 font-normal text-sm overflow-y-auto p-4 rounded-lg">
                {output}
              </div>
            )}

            {mode === "graph" && (
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
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
