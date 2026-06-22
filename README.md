# RWikiStat

Monorepo untuk RWikiStat: backend API, web app, dan mobile app.

## Struktur

- `backend/` - Express API, Firebase Admin, modul, forum, compiler, chatbot.
- `frontend/` - Next.js web app.
- `mobile/` - Expo React Native app.

## Setup Lokal

1. Buat Firebase project baru.
2. Salin env example:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cp mobile/.env.example mobile/.env
```

3. Isi credential Firebase baru di masing-masing env.
4. Jalankan backend:

```bash
cd backend
npm install
npm start
```

5. Cek backend:

```bash
curl http://localhost:8080/health
```

6. Jalankan web:

```bash
cd frontend
npm install
npm run dev
```

`npm run build` di frontend juga membutuhkan nilai `NEXT_PUBLIC_FIREBASE_*` di `frontend/.env.local`.

7. Jalankan mobile:

```bash
cd mobile
npm install
npm start
```

Untuk Expo di device fisik, ganti `EXPO_PUBLIC_API_URL` ke IP LAN komputer backend.

## Catatan Keamanan

Jangan commit `.env`, service account Firebase, Google services file, credential EAS, atau seed data asli.
