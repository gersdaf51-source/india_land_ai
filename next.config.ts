import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',   // ← 這行最關鍵！沒有這行就不會產生 out/
  images: {
    unoptimized: true,           // ← 這行關掉內建圖片優化
  },
  trailingSlash: true,
};

export default nextConfig;
