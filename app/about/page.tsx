import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">關於 XREX AI</h1>
        
        <p className="mb-4 leading-relaxed">
          我們是一家總部位於美國的永續科技公司，致力讓人工智慧應用在永續發展與財務領域變得人人可及 — 完全免費。
        </p>
        
        <p className="mb-4 leading-relaxed">
          XREX AI 採用頂尖美國技術打造，支援中文 + 英文，專注於 ESG 教育、永續投資分析，以及負責任的決策工具。
        </p>
        
        <p className="mb-6 font-medium">
          無廣告 • 不賣資料 • 100% 永久免費
        </p>
        
        <address className="not-italic leading-relaxed mb-8">
          <strong>XREX AI Learning</strong><br />
          3336 Red Maple Drive<br />
          Los Angeles, California 90017<br />
          United States<br /><br />
          電話：<a href="tel:+12139019112" className="text-[#4ecdc4] hover:underline">213-901-9112</a><br />
          Email：<a href="mailto:hello@XREX.ai" className="text-[#4ecdc4] hover:underline">hello@XREX.ai</a>
        </address>
        
        <div className="mt-10">
          <Link 
            href="/" 
            className="text-[#4ecdc4] hover:underline"
          >
            ← 返回首頁
          </Link>
        </div>
      </div>
    </div>
  )
}