"use client";
import React, { useEffect, ChangeEvent, useState } from "react";
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
import { getFirebaseIdTokenHeaders } from "@/lib/authHeaders";

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
  const [shinyUrl, setShinyUrl] = useState("");

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
  const [processing, setProcessing] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [outputType, setOutputType] = useState<string | null>(null);

  useEffect(() => {
    if (modulId) {
      // Lakukan permintaan ke API untuk mendapatkan data detail modul berdasarkan ID
      fetch(`${config.API_URL}/api/modul/${modulId}`, {
        headers: getFirebaseIdTokenHeaders(),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data detail modul.");
          }
          return response.json();
        })
        .then((data) => {
          setDetailModul(data); // Menyimpan data detail modul dalam state
          setPdfUrl(data.data.pdfPath); // Set URL PDF
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
      const response = await axios.get(`${config.API_URL}/api/modul`, {
        headers: getFirebaseIdTokenHeaders(),
      });
      if (response.status === 200) {
        setTestData(response.data);
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
  const handleRunGraph = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.API_URL}/api/compiler/newshiny-web`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getFirebaseIdTokenHeaders(),
          },
          body: JSON.stringify({
            code,
          }),
        }
      );

      const responseData = await response.text();
      if (response.ok) {
        try {
          const data = JSON.parse(responseData);
          if (data.success) {
            if (data.link) {
              setShinyUrl(data.link);
            } else {
              setOutput("Error: Shiny URL not found in server response.");
            }
          } else {
            setOutput(`Error: ${data.error || "Failed to start Shiny app"}`);
          }
        } catch (parseError) {
          setOutput("Error: Failed to parse JSON response.");
        }
      } else {
        setOutput(`Error: ${responseData || "Failed to start Shiny app"}`);
      }
    } catch (error) {
      console.error("Error executing R code for Shiny:", error);
      setOutput("Error: Failed to execute Shiny app. Please try again.");
    } finally {
      setLoading(false);
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

                <Button
                  onClick={handleRunGraph}
                  disabled={!code}
                  value={code}
                  className={classnames(
                    "block w-56 bg-[#00726B] py-2 rounded-lg duration-500 text-white font-semibold md:col-span-1",
                    !code ? "opacity-50" : ""
                  )}
                >
                  {processing ? "Processing..." : "Compile"}
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

          <div className=" flex flex-shrink-0 w-full  flex-col mt-5">
            <h1 className="font-bold text-xl mb-2 text-[#00726B]">Output</h1>
            <iframe
              className="w-full h-[700px]"
              src={shinyUrl}
              width="100%"
              height="100%"
            />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
