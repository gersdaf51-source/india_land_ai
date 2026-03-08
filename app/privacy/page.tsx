import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-[rgba(255,255,255,0.05)] p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
        
        <p className="mb-4 text-gray-300">Última actualización: Marzo 2026</p>
        
        <p className="mb-4 leading-relaxed">
          Respetamos tu privacidad. NO recolectamos datos personales de los miembros del grupo de WhatsApp. Todas las conversaciones ocurren dentro de WhatsApp – nunca accedemos a tus chats privados.
        </p>
        
        <p className="mb-4 leading-relaxed">
          No almacenamos números de teléfono de forma permanente. Solo usamos el enlace de WhatsApp para ayudarte a unirte a la comunidad.
        </p>
        
        <p className="mb-6 leading-relaxed">
          Sin cookies, sin rastreo, sin anuncios de terceros.
        </p>
        
        <p className="font-medium">
          <strong>Compañía:</strong> Clarity AI Learning<br />
          495 Chapmans Lane, Los Lunas, NM 87031<br />
          Teléfono: <a href="tel:+15058658201" className="text-[#4ecdc4] hover:underline">505-865-8201</a>
        </p>
        
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