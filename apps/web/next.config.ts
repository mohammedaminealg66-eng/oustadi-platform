import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore كنفورصيو هاد الخاصية باش السيرفر يقبل الـ IP
  allowedDevOrigins: ['192.168.1.151', 'localhost:3000'],
};

export default nextConfig;