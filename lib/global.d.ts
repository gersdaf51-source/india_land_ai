// global.d.ts

// 擴展 Window 介面，讓 TypeScript 認識 gtag_report_conversion
interface Window {
  gtag_report_conversion?: (url?: string) => boolean;
  // 如果你也用到 gtag 本身，也可以一起加
  gtag?: (...args: any[]) => void;
}