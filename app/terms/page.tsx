import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">服務條款</h1>
        
        <p className="mb-4 leading-relaxed">
          XREX AI Learning 僅提供免費的教育與個人使用，不得用於商業目的。
        </p>
        
        <p className="mb-4 leading-relaxed">
          本平台不提供任何財務、投資、醫療或法律建議。使用者需自行承擔所有決策責任，包括但不限於永續發展分析或投資判斷。
        </p>
        
        <p className="mb-6 leading-relaxed">
          請尊重社群所有成員，嚴禁發送垃圾訊息、騷擾、非法內容或任何違反群組規範的行為。
        </p>
        
        <p className="font-medium">
          <strong>營運單位：</strong><br />
          XREX AI Learning<br />
          3336 Red Maple Drive<br />
          Los Angeles, California 90017<br />
          電話：<a href="tel:+12139019112" className="text-[#4ecdc4] hover:underline">213-901-9112</a>
        </p>
        
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