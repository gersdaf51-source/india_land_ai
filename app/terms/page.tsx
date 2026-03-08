import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">利用規約</h1>
        
        <p className="mb-4 text-gray-300">最終更新日: 2026年3月</p>
        
        <p className="mb-4 leading-relaxed">
          Sato Tech AIは、学習・受験対策・就活支援・日常生活の生産性向上を目的とした個人利用に限り、完全に無料で提供しています。
        </p>
        
        <p className="mb-4 leading-relaxed">
          当サービスは金融・投資・医療・法律に関する助言を提供するものではありません。  
          ユーザーの判断・決定によるいかなる結果についても、当方は一切の責任を負いかねます。
        </p>
        
        <p className="mb-4 leading-relaxed">
          コミュニティ（WhatsAppグループなど）をご利用の際は、他のメンバーを尊重してください。  
          スパム、嫌がらせ、違法な内容の投稿・共有は固く禁止します。これに違反した場合、予告なく利用制限やグループ退出をさせていただくことがあります。
        </p>
        
        <p className="mb-6 leading-relaxed">
          当サービスは「広告なし・課金なし・個人情報非売却」を原則として運営しています。  
          利用規約に違反する行為、または当サービスの趣旨に反する利用が確認された場合、アクセス制限等の措置を取ることがあります。
        </p>
        
        <p className="font-medium leading-relaxed">
          <strong>運営:</strong><br />
          Sato Tech AI<br />
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