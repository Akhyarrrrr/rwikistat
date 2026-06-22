"use client";
import React, { useEffect, useState } from "react";
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
  const [processing, setProcessing] = useState(false);
  const [option, setOption] = useState("string");
  const [shinyUrl, setShinyUrl] = useState("");

  const handleRunString = async () => {
    try {
      setProcessing(true);
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

  const handleRunGraph = async () => {
    try {
      setProcessing(true);
      const storedToken = localStorage.getItem("customToken");

      const response = await fetch(
        `${config.API_URL}/api/compiler/newshiny-web`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const responseData = await response.json();
      if (response.ok && responseData.success) {
        setShinyUrl(responseData.link || "");
        setOutput(""); // Clear text output when showing graph
      } else {
        setOutput(
          `Error: ${responseData.error || "Failed to execute Shiny app."}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error: Failed to execute Shiny app. Please try again.");
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
        {/* Dropdown & Button in a responsive row */}
        <div className="flex flex-col md:flex-row items-center gap-4 pb-4 px-3 justify-end">
          <div className="flex">
            <select
              className="w-96 text-center text-[#00726B] font-semibold outline-none rounded-md font-poppins border border-gray-300 p-2 "
              name="option"
              id="pilihan"
              onChange={(e) => {
                setOption(e.target.value);
                setOutput("");
                setShinyUrl("");
              }}
            >
              <option value="string">String Compiler</option>
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
            {processing ? "Processing..." : "Compile"}
          </button>
        </div>

        {/* Code Editor */}
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
        {/* Output Section */}
        {option === "string" && (
          <div className="flex flex-col">
            <div className="w-full h-96 bg-[#1E1E1E] text-green-500 font-normal text-sm overflow-y-auto p-4">
              {output}
            </div>
          </div>
        )}

        {option === "graph" && shinyUrl && (
          <div className="flex flex-col">
            <iframe
              className="w-full h-[700px]"
              src={shinyUrl}
              width="100%"
              height="100%"
              title="Shiny Graph Output"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CodeEditor;
