/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@firebase/firestore$": path.resolve(
        __dirname,
        "node_modules/@firebase/firestore/dist/index.esm2017.js"
      ),
    };

    config.module.rules.push({
      test: /canvas.node$/,
      use: "raw-loader",
    });

    return config;
  },
};

module.exports = nextConfig;
