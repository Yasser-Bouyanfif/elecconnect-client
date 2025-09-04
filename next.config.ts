import type { NextConfig } from "next";

const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
  /^http:/,
  "https:"
);
const hostname = serverUrl ? new URL(serverUrl).hostname : undefined;

const nextConfig: NextConfig = {
  images: hostname
    ? {
        remotePatterns: [{ protocol: "https", hostname }],
      }
    : {},
};

export default nextConfig;
