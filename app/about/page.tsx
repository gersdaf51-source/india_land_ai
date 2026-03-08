import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Sato Tech AI について</h1>
        
        <p className="mb-4 leading-relaxed">
          私たちは福島県を拠点とする日本のAIプロジェクトで、誰でも・いつでも・完全に無料で使える高品質なAIを目指しています。
        </p>
        
        <p className="mb-4 leading-relaxed">
          Sato Tech AI は日本生まれ100%、受験勉強・就活・日常の生産性向上をサポート。  
          数学・理科・歴史からビジネスメール・SNS投稿まで、丁寧にステップで教えてくれます。
        </p>
        
        <p className="mb-6 font-medium">
          広告なし • 個人情報売却一切なし • 100%永遠に無料
        </p>
        
        <address className="not-italic leading-relaxed mb-8">
          <strong>Sato Tech AI</strong><br />
          〒969-6106 福島県大沼郡会津美里町黒川内461-1118<br />
          日本<br /><br />
          電話: <a href="tel:+81130934708" className="text-[#4ecdc4] hover:underline">013-093-4708</a><br />
          メール: <a href="mailto:hello@satotech.ai" className="text-[#4ecdc4] hover:underline">hello@satotech.ai</a>
        </address>
        
        <div className="mt-10">
          <Link 
            href="/" 
            className="text-[#4ecdc4] hover:underline"
          >
            ← 戻る
          </Link>
        </div>
      </div>
    </div>
  )
}