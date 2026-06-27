FROM node:18-bullseye

RUN apt-get update && apt-get install -y r-base r-cran-ggplot2 r-cran-lattice && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
