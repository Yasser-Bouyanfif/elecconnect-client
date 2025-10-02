import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "137.74.42.151",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "serverelec.duckdns.org",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
  typescript: {
    // ⚠️ Permet de builder même s’il y a des erreurs TS
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
