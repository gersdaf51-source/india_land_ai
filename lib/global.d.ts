// global.d.ts

// 擴展 Window 介面，讓 TypeScript 認識 gtag_report_conversion 和 fbq
interface Window {
  gtag_report_conversion?: (url?: string) => boolean;
  gtag?: (...args: any[]) => void;
  fbq?: (event: string, params?: string | object) => void; // 更新 fbq 函式的型別，第二個參數可以是 string 或 object
}