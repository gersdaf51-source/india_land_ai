import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',   // ← 這行最關鍵！沒有這行就不會產生 out/
};

export default nextConfig;
