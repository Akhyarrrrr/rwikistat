/** @type {import('next').NextConfig} */

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
    config.module.rules.push({
      test: /canvas.node$/,
      use: "raw-loader",
    });

    return config;
  },
};

module.exports = nextConfig;
