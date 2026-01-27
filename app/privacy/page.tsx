import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <p className="mb-4 text-gray-300">Last updated: December 2025</p>
        
        <p className="mb-4 leading-relaxed">
          We respect your privacy. We do NOT collect any personal data from WhatsApp group members. All conversations happen inside WhatsApp – we never access your private chats.
        </p>
        
        <p className="mb-4 leading-relaxed">
          No phone numbers are stored permanently. We only use the WhatsApp link to help you join the community.
        </p>
        
        <p className="mb-6 leading-relaxed">
          No cookies, no tracking, no third-party ads.
        </p>
        
        <p className="font-medium">
          <strong>Company:</strong> Aarush AI Technologies<br />
          40, Sirthiyagaraja Rd, T Nagar, Chennai, Tamil Nadu 600017<br />
          Phone: 044 2431 5340
        </p>
        
<div className="mt-10">
  <Link 
    href="/" 
    className="text-[#4ecdc4] hover:underline"
  >
    ← 返回主頁
  </Link>
</div>
      </div>
    </div>
  )
}