"use client";
import { useState } from "react";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const API_HOST = "https://rest-api-zzvthujxxq-as.a.run.app"; // Ganti dengan host Anda jika berbeda
  const API_PORT = 3001;

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_HOST}:${API_PORT}/api/compiler`, {
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
