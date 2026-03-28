// components/LineButton.tsx
import { MessageCircle } from "lucide-react";   // 假設你用 lucide-react

interface LineButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;        // 如果想額外自訂樣式
}

export default function LineButton({
  onClick,
  disabled = false,
  className = "",
}: LineButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hero-cta bg-[#25d366] text-white text-[1.4rem] font-black py-5 px-10 rounded-full w-[92%] max-w-[380px] mx-auto mt-5 
                  shadow-[0_15px_40px_rgba(37,211,102,0.5)] cursor-pointer flex items-center justify-center gap-2 
                  transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(37,211,102,0.6)] 
                  ${className}`}
    >
      <MessageCircle className="wa-icon h-16 w-16" />
      加入Line，立即學習使用
    </button>
  );
}