import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">隱私權政策</h1>
        
        <p className="mb-4 text-gray-300">最後更新日期：2026年3月</p>
        
        <p className="mb-4 leading-relaxed">
          我們非常重視您的隱私。我們不會從 WhatsApp 群組成員收集任何個人資料。所有對話都發生在 WhatsApp 內，我們絕不存取您的私人聊天內容。
        </p>
        
        <p className="mb-4 leading-relaxed">
          我們不會永久儲存電話號碼，僅使用 WhatsApp 邀請連結協助您加入社群。
        </p>
        
        <p className="mb-6 leading-relaxed">
          無 Cookie、無追蹤、無第三方廣告。
        </p>
        
        <p className="font-medium">
          <strong>公司：</strong> Aarush AI Learning<br />
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