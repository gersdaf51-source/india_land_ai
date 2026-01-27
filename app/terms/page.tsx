import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <p className="mb-4 leading-relaxed">
          Aarush AI is provided free of charge for educational and personal use only.
        </p>
        
        <p className="mb-4 leading-relaxed">
          We do not provide financial, medical, or legal advice. Users are responsible for their own decisions.
        </p>
        
        <p className="mb-6 leading-relaxed">
          Respect all community members. No spam, harassment, or illegal content.
        </p>
        
        <p className="font-medium">
          <strong>Operated by:</strong><br />
          Aarush AI Technologies<br />
          40, Sirthiyagaraja Rd, T Nagar<br />
          Chennai, Tamil Nadu 600017<br />
          Phone: 044 2431 5340
        </p>
        
<div className="mt-10">
  <Link 
    href="/" 
    className="text-[#4ecdc4] hover:underline"
  >
    ← Back
  </Link>
</div>
      </div>
    </div>
  )
}