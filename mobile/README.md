<div align="center">
  <h1><b>RWikiStat Mobile App</b></h1>
</div>

![RWikiStat (1024 x 500 px)](https://github.com/user-attachments/assets/85d0991e-974b-403b-8f5b-95942d453c3e)

**RwikiStat Mobile App** adalah aplikasi pembelajaran interaktif berbasis **React Native** yang dirancang untuk mendukung pembelajaran statistika. Aplikasi ini memungkinkan pengguna menjalankan sintaks R, mengakses modul pembelajaran, dan berdiskusi melalui forum langsung dari perangkat mobile, baik **iOS** maupun **Android**.

## 🎯 Tujuan Proyek

1. Mengembangkan aplikasi **RwikiStat** sebagai media interaktif untuk pembelajaran statistika.
2. Memberikan pengalaman belajar yang mudah digunakan, fokus pada materi R.
3. Menyediakan fitur eksekusi sintaks R dan modul pembelajaran terstruktur.
4. Menghadirkan dukungan lintas platform untuk pengguna **Android** dan **iOS**.

---

## 🚀 Fitur Utama

- **Forum Diskusi:** Wadah untuk bertukar ide dan berdiskusi tentang statistika.
- **Eksekusi Sintaks R:** Kemampuan menjalankan kode R secara langsung.
- **Modul Pembelajaran:** Materi statistika yang terstruktur dan interaktif.
- **Dukungan Lintas Platform:** Responsif di perangkat **Android** dan **iOS**.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** [React Native](https://reactnative.dev/) dengan [Expo](https://expo.dev/)
- **Backend:** [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Database:** [Firebase](https://firebase.google.com/)
- **Build Tools:** [Expo Application Services (EAS)](https://expo.dev/eas)

---

## 📖 Panduan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Akhyarrrrr/iOS-version
cd iOS-version
```

### 2. Install Dependencies
Pastikan sudah menginstall [Node.js](https://nodejs.org/) dan [Expo CLI](https://docs.expo.dev/get-started/installation/).
```bash
npm install
```

---

## Build dengan EAS

EAS (Expo Application Services) digunakan untuk membangun aplikasi **Preview**, **Development**, dan **Production** untuk platform **iOS** dan **Android**.

### 1. Login ke Expo CLI
```bash
expo login
```

### 2. Setup EAS
Jika belum ada file `eas.json`, jalankan:
```bash
eas build:configure
```

File `eas.json` akan dibuat dengan konfigurasi default. Kamu bisa menyesuaikan sesuai kebutuhan.

---

### 📱 Membuat Build untuk Android dan iOS

#### **Preview Build**
Untuk menguji aplikasi tanpa harus mendaftar ke Play Store/App Store.
```bash
eas build --profile preview --platform all
```

#### **Development Build**
Untuk pengujian lokal dengan debug tools.
```bash
eas build --profile development --platform all
```

#### **Production Build**
Untuk mengunggah ke Play Store atau App Store.
```bash
eas build --profile production --platform all
```

---

### 🚀 Instalasi Build di Perangkat
1. Setelah build selesai, kamu akan mendapatkan link dari **Expo CLI**.
2. Gunakan aplikasi **Expo Go** atau unduh file `.apk` / `.ipa` untuk instalasi langsung.

---

## 📬 Kontak

📧 Email: [ahyar12324@gmail.com](mailto:ahyar12324@gmail.com)  
🌐 LinkedIn: [linkedin.com/in/akhyarrrrr](https://www.linkedin.com/in/akhyarrrrr)

---

⭐ Jangan lupa beri **star** pada repository ini jika kamu merasa proyek ini bermanfaat! 😊
