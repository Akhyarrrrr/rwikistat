"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Spinner from "./Spinner";
import config from "@/config.js";


export default function DetailPage() {
  const pathname = usePathname();
  const modulId = pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState(null);
  const [detailModul, setDetailModul] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState(""); // State untuk URL PDF

  useEffect(() => {
    if (modulId) {
      // Lakukan permintaan ke API untuk mendapatkan data detail modul berdasarkan ID
      fetch(`${config.API_URL}/api/modul/${modulId}`)
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

  return (
    <div className="p-4">
      {detailModul ? (
        <div>
          <h1>Halaman Detail Modul</h1>
          <h2>Detail Modul {modulId}</h2>
          <p>Nama Modul: {detailModul.data.namaModul}</p>
          <p>code: {detailModul.data.codeSampel}</p>
          {/* Tampilkan data lain sesuai kebutuhan */}
          {pdfUrl && (
            <embed
              type="application/pdf"
              src={pdfUrl}
              width="50%"
              height="1000px"
              title="PDF Viewer"
            />
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
