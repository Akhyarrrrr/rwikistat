# RWikiStat — Project Knowledge Base

## Overview
Monorepo: **RWikiStat** — platform belajar statistika dengan R. Tiga client: backend API (Express), web app (Next.js 15), mobile app (Expo). Firebase project: `rwikistat-538da`.

---

## Stack
- **Backend**: Node.js + Express, Firebase Admin SDK (Auth, Firestore, Storage), multer, dotenv, cors
- **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS, MUI Joy, Firebase Client SDK (auth only), Monaco Editor
- **Mobile**: Expo (React Native), Expo Router, Google Sign-In
- **AI**: Google Gemini 2.5 Flash API (chatbot), JDoodle API (R compilation)
- **Storage**: Google Cloud Storage (GCS) via signed URLs — no local disk storage for uploads

---

## Backend Routes (all mounted at `/api/`)

| Route file | Prefix | Key endpoints | Auth |
|---|---|---|---|
| `routes/auth.js` | `/auth` | POST `/register`, POST `/login`, GET `/me` | None / Bearer |
| `routes/modul.js` | `/modul` | POST `/` (PDF upload to GCS), GET `/`, GET `/:id`, DELETE `/:id` | POST/DELETE: Bearer |
| `routes/compiler.js` | `/compiler` | POST `/` (JDoodle), POST `/graph` (local Rscript), POST `/test/`, POST `/shiny/stop` | None |
| `routes/forum.js` | `/forum` | CRUD topics, comments (subcollection), like/unlike, bookmark/unbookmark | POST/DELETE: Bearer |
| `routes/chatBot.js` | `/chatbot` | POST `/chat` (Gemini 2.5 Flash) | None |
| `routes/user.js` | `/user` | GET `/`, GET `/:id`, POST `/:uid` (verify), GET `/posted/:uid`, GET `/:uid/score`, DELETE `/:uid` | Varies |
| `routes/history.js` | `/history` | POST `/` (image upload to GCS), POST `/mobile`, GET `/:uid`, GET `/download/:id` (302 redirect), DELETE `/delete/:id` | Upload/Delete: Bearer |
| `routes/shiny.js` | `/shiny` | GET `/`, POST `/`, DELETE `/:id` | POST/DELETE: Bearer |
| `routes/admin.js` | `/admin` | User/module management (role change, lock, delete) | **Admin** Bearer |

### Middleware
- `middleware/verifyToken.js` — verifies Firebase ID token from `Authorization: Bearer` header, attaches `req.user`
- Admin routes use inline `verifyAdmin` checking `role === "admin"` in Firestore

---

## Firestore Collections

| Collection | Key fields |
|---|---|
| `users` | `email`, `displayName`, `role` ("user"|"admin"), `photoURL`, `score`, `verified`, `createdAt` |
| `modul` | `pdfPath` (signed URL), `codeSampel`, `judulModul`, `namaModul`, `urlShiny`, `textData`, `textMarkdown`, `createdAt`, `isLocked` |
| `forum` | `title`, `uid`, `createdAt`, `likes`, `likedBy`[], `bookmarks`[], `images`[] |
| `forum/{id}/comments` | (subcollection) `text`, `uid`, `createdAt` |
| `image` | `url` (signed), `gcsPath`, `fileName`, `uid` |
| `shiny_apps` | `title`, `url`, `description`, `createdAt` |

---

## Frontend Pages (Next.js App Router)

- **Landing** (`/`): Hero, Features, Download, Footer — no layout wrapper
- **Auth** (`/signin`): Login form (email+password only, no Google popup)
- **App** (`/chatbot`, `/compiler`, `/forum`, `/forum/[forumId]`, `/forum/search`, `/modul`, `/modul/[modulId]`, `/modul/addNew`, `/profile`, `/riwayat`, `/userId`, `/userId/[userId]`, `/verified`, `/verified/addUser`): All wrapped in layout with Sidebar + Header, requires auth
- **Admin** (`/admin`, `/admin/manage-users`, `/admin/manage-modul`): admin-only layout with gate checking `role === "admin"`

### Auth flow
1. Firebase Client SDK `signInWithEmailAndPassword` → get `idToken`
2. Send `idToken` to `POST /api/auth/login` → backend verifies via Admin SDK → returns user data + `customToken`
3. `customToken` stored in `localStorage`, sent as `Authorization: Bearer` header for subsequent requests
4. Register: `POST /api/auth/register` creates Firebase Auth user + Firestore `users` doc with `role: "user"`

### Key frontend files
- `lib/firebase.ts` — Firebase client SDK init, exports only `auth`
- `lib/config.ts` — `API_URL` constant
- `app/context/authContext.tsx` — React context wrapping auth state (signIn, signOut, register, user)
- `app/(default)/layout.tsx` — Auth-wrapped layout for authenticated pages

---

## Project Cleanup (completed)
- **Backend routes restructured**: All routes live in `backend/routes/`, old root files deleted
- **Backend junk deleted**: `temp/`, `data/`, `seed/`, `public/`, `Dockerfile`, `.dockerignore`, `app.yaml`, `run_shiny.*`, `.env.example`
- **Frontend restructured**: `config.js` → `lib/config.ts`, firebase config → `lib/firebase.ts`, auth middleware → `lib/hooks/use-auth-middleware.ts`
- **Frontend junk deleted**: 14+ orphaned/unused files (Dockerfile, public assets, unused components)
- **Build passes**: `npm run build` — 20/20 routes compile
- **Chatbot**: Stateless — no Firestore saves, no in-memory context, each question independent
- **Uploads**: All via GCS signed URLs — multer `memoryStorage`, no local disk

---

## File Upload Architecture
1. multer `memoryStorage` receives file in `req.file.buffer`
2. Saved directly to GCS: `const file = storage.bucket().file(destination); await file.save(buffer, { metadata: { contentType } })`
3. Signed URL generated: `file.getSignedUrl({ version: "v4", action: "read", expires: Date.now() + 7d })`
4. Signed URL saved to Firestore

**Routes using GCS**: `modul.js` (PDF), `history.js` (images), `forum.js` (topic images)

---

## Environment
- Backend `.env`: `PORT`, `CORS_ORIGIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET`, `JDOODLE_CLIENT_ID`, `JDOODLE_CLIENT_SECRET`, `GEMINI_API_KEY`
- Frontend `.env`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_FIREBASE_*` (6 vars)
- Admin SDK also supports credential from `rwikistat-538da-firebase-adminsdk-*.json` file

---

## Key Design Decisions
- **Module lock**: Firestore boolean `isLocked` toggled by admin; frontend pages must check and honor it
- **Compiler temp files**: `path.join(os.tmpdir(), "rwikistat-compiler")` — auto-cleaned by OS
- **Shiny apps**: Killed by process ID via `router.post("/shiny/stop")` in compiler
- **Forum scoring**: +5 for new topic, +10 for comment
- **Router `/download/:id`**: Issues 302 redirect to signed URL (avoids proxying through Node)

---

## Current State (all stable, tested)
- ✅ Backend starts clean, all routes respond
- ✅ Frontend builds with 0 errors (only pre-existing ESLint warnings)
- ✅ Chatbot responds via `gemini-2.5-flash`
- ✅ History upload/download/delete works via GCS
- ✅ Modul PDF upload works via GCS
- ✅ Compiler executes R scripts (JDoodle remote + local Rscript)
- ✅ Admin panel manages users and module locks
- ⚠️ `/forum/search` uses `startAt`/`endAt` prefix matching — basic but works
- ⚠️ Modul `DELETE` does not clean up GCS file (Firestore doc deleted only)
