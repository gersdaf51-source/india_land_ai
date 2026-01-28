import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">About Aarush AI</h1>
        
        <p className="mb-4 leading-relaxed">
          We are a Palmdale-based American AI startup passionate about making world-class AI accessible to every American – completely free.
        </p>
        
        <p className="mb-4 leading-relaxed">
          Aarush AI is built 100% in the USA, supports English + Spanish, and focuses on education, career growth, and daily productivity.
        </p>
        
        <p className="mb-6 font-medium">
          No ads • No data selling • 100% Free forever
        </p>
        
        <address className="not-italic leading-relaxed mb-8">
          <strong>Aarush AI Technologies</strong><br />
          2219 Harvest Lane<br />
          Palmdale<br />
          California 93550<br />
          USA<br /><br />
          Phone: <a href="tel:+16612334435" className="text-[#4ecdc4] hover:underline">661-233-4435</a><br />
          Email: <a href="mailto:hello@aarush.ai" className="text-[#4ecdc4] hover:underline">hello@aarush.ai</a>
        </address>
        
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