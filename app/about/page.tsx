import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Acerca de Clarity AI</h1>
        
        <p className="mb-4 leading-relaxed">
          Somos una empresa de tecnología sostenible con sede en Estados Unidos, apasionada por hacer que la inteligencia artificial aplicada a la sostenibilidad y las finanzas sea accesible para todos — completamente gratis.
        </p>
        
        <p className="mb-4 leading-relaxed">
          Clarity AI está construido con tecnología de punta en EE.UU., soporta inglés + español y se enfoca en educación sobre ESG, análisis de inversiones sostenibles y toma de decisiones responsables.
        </p>
        
        <p className="mb-6 font-medium">
          Sin anuncios • Sin venta de datos • 100% Gratis para siempre
        </p>
        
        <address className="not-italic leading-relaxed mb-8">
          <strong>Clarity AI Learning</strong><br />
          495 Chapmans Lane<br />
          Los Lunas, NM 87031<br />
          United States<br /><br />
          Teléfono: <a href="tel:+15058658201" className="text-[#4ecdc4] hover:underline">505-865-8201</a><br />
          Email: <a href="mailto:hello@clarity.ai" className="text-[#4ecdc4] hover:underline">hello@clarity.ai</a>
        </address>
        
        <div className="mt-10">
          <Link 
            href="/" 
            className="text-[#4ecdc4] hover:underline"
          >
            ← Regresar
          </Link>
        </div>
      </div>
    </div>
  )
}