import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
        
        <p className="mb-4 text-gray-300">最終更新日: 2026年3月</p>
        
        <p className="mb-4 leading-relaxed">
          私たちはユーザーのプライバシーを最も大切に考えています。  
          Sato Tech AIでは、個人情報を一切収集・保存しません。  
          すべてのやり取りはWhatsAppグループ内で行われ、私たちがあなたのプライベートな会話を閲覧・アクセスすることはありません。
        </p>
        
        <p className="mb-4 leading-relaxed">
          電話番号やメールアドレスなどの個人情報は、永続的に保存されません。  
          WhatsAppグループ参加のためのリンク提供にのみ一時的に使用し、それ以外では利用いたしません。
        </p>
        
        <p className="mb-6 leading-relaxed">
          クッキー使用なし、トラッキングなし、第三者広告なし。  
          あなたのデータを売却したり共有したりすることは一切ありません。
        </p>

        <p className="mb-6 leading-relaxed font-medium">
          私たちは「広告ゼロ・課金ゼロ・データ非売却」を徹底し、  
          安心して長く使っていただけるAIを目指しています。
        </p>
        
        <p className="font-medium leading-relaxed">
          <strong>運営:</strong> Sato Tech AI<br />
          〒969-6106 福島県大沼郡会津美里町黒川内461-1118<br />
          電話: 013-093-4708<br />
          メール: hello@satotech.ai
        </p>
        
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