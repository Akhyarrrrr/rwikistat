"use client";
import { useState } from "react";
import config from "@/config.js";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/compiler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.text();
      setResponse(data);
    } catch (error) {
      console.error(error);
      setResponse("Terjadi kesalahan saat mengirim kode.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "16px",
        }}
      />
      <button onClick={handleSubmit}>Kirim Kode</button>
      <div>
        <h2>Respons dari Server Express:</h2>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
