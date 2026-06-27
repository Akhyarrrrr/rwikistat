const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

function findServiceAccountFile() {
  const files = fs.readdirSync(path.join(__dirname, ".."));
  const match = files.find(
    (f) => f.endsWith(".json") && f.includes("firebase-adminsdk")
  );
  return match ? path.join(__dirname, "..", match) : null;
}

const serviceAccountPath = findServiceAccountFile();
if (!serviceAccountPath) {
  console.error("Service account file not found");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "rwikistat-538da.firebasestorage.app",
});

const firestore = admin.firestore();

const moduls = [
  {
    judulModul: "Pengantar R Programming",
    namaModul: "R-Dasar",
    codeSampel: '# Contoh dasar R\nprint("Hello, R!")\n\n# Vektor\nangka <- c(1, 2, 3, 4, 5)\nmean(angka)\nsum(angka)\n\n# Matriks\nmat <- matrix(1:9, nrow=3, byrow=TRUE)\nprint(mat)',
    textMarkdown: "# Pengantar R Programming\n\nR adalah bahasa pemrograman untuk statistik dan data science.\n\n## Materi:\n1. **Tipe Data**: numeric, character, logical\n2. **Vektor**: membuat dan memanipulasi vektor\n3. **Matriks**: operasi matriks dasar\n4. **Function**: membuat fungsi sendiri\n\n## Contoh:\n```r\nx <- c(10, 20, 30, 40, 50)\nmean(x)\nsd(x)\n```",
    textData: "R Programming Language\nBahasa pemrograman untuk komputasi statistik",
    pdfPath: "",
    urlShiny: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    judulModul: "Visualisasi Data dengan ggplot2",
    namaModul: "Visualisasi",
    codeSampel: '# Visualisasi dengan ggplot2\nlibrary(ggplot2)\n\n# Data frame sederhana\ndata <- data.frame(\n  x = 1:10,\n  y = (1:10)^2\n)\n\n# Plot dasar\nprint(ggplot(data, aes(x=x, y=y)) +\n  geom_line(color="blue") +\n  geom_point(size=3) +\n  labs(title="Kuadrat", x="X", y="Y"))',
    textMarkdown: "# Visualisasi Data dengan ggplot2\n\nggplot2 adalah paket visualisasi paling populer di R.\n\n## Jenis Plot:\n1. **Scatter plot**: `geom_point()`\n2. **Line chart**: `geom_line()`\n3. **Bar chart**: `geom_bar()`\n4. **Histogram**: `geom_histogram()`\n\n## Konsep Grammar of Graphics:\n- `data`: dataset\n- `aes`: aesthetic mapping\n- `geom`: tipe visualisasi\n- `theme`: tampilan plot",
    textData: "ggplot2\nGrammar of Graphics untuk visualisasi data",
    pdfPath: "",
    urlShiny: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    judulModul: "Statistika Deskriptif",
    namaModul: "Statistika",
    codeSampel: '# Statistika Deskriptif\ndata <- c(12, 15, 14, 10, 18, 20, 22, 17, 14, 16)\n\n# Ukuran pemusatan\nmean(data)\nmedian(data)\n\n# Ukuran penyebaran\nsd(data)\nvar(data)\nIQR(data)\n\n# Ringkasan 5 angka\nsummary(data)\n\n# Frekuensi\ntable(cut(data, breaks=3))',
    textMarkdown: "# Statistika Deskriptif dengan R\n\nStatistika deskriptif menjelaskan karakteristik data.\n\n## Ukuran Pemusatan:\n- **Mean**: rata-rata\n- **Median**: nilai tengah\n- **Modus**: nilai paling sering muncul\n\n## Ukuran Penyebaran:\n- **Varians & SD**: sebaran data\n- **IQR**: rentang interkuartil\n- **Range**: nilai max - min",
    textData: "Statistika Deskriptif\nMengenal ukuran pemusatan dan penyebaran data",
    pdfPath: "",
    urlShiny: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seed() {
  console.log("Menambahkan data modul...");
  const batch = firestore.batch();
  for (const modul of moduls) {
    const ref = firestore.collection("modul").doc();
    batch.set(ref, modul);
    console.log(`  + ${modul.judulModul}`);
  }
  await batch.commit();
  console.log("Selesai! 3 modul berhasil ditambahkan.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
