import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // هادي كتسمح للـ Dev Server يتقبل اتصالات من الـ IP ديال السيرفر ديالك
    allowedDevOrigins: ['192.168.1.151', 'localhost:3000']
  },
  // هادي اختيارية: إلا بغيتي توقف الـ Linting وقت الـ Build باش يسرع الخدمة
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;