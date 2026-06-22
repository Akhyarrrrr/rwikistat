# Gunakan image Node.js yang sesuai dengan versi Next.js Anda
FROM node:16-alpine AS builder

# Buat direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu untuk memanfaatkan cache build layer
COPY package*.json ./

# Install dependency proyek
RUN npm install

# Salin seluruh kode proyek
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Gunakan image Nginx untuk menjalankan aplikasi yang telah di-build
FROM nginx:1.23-alpine

# Salin file build ke direktori nginx
COPY --from=builder /app/.next /usr/share/nginx/html

# Salin file konfigurasi nginx (jika ada)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Jalankan Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
