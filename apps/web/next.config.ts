import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // هادي هي الطريقة الصحيحة فـ النسخة الجديدة
  devIndicators: {
    appIsrStatus: false,
  },
  // جرب هادي باش تحل مشكل الـ Blockage
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;