// components/BookPreviewModal.tsx
'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  summary?: string;
  price?: string;
}

interface BookPreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onClickCS: () => void;  // 父組件傳入的點擊客服按鈕事件
}

export default function BookPreviewModal({
  book,
  isOpen,
  onClose,
  onClickCS,
}: BookPreviewModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 20, y: 0 }); // 初始安全值
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);
  const hasSetInitialPosition = useRef(false);

  // 按 ESC 關閉
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 只在第一次開啟時計算左下角位置（避免跳動）
  useEffect(() => {
    if (isOpen && cardRef.current && !hasSetInitialPosition.current) {
      // 等一小段時間確保 DOM 已渲染完成，取得真實高度
      const timer = setTimeout(() => {
        const cardHeight = cardRef.current?.offsetHeight || 450; // 防取不到用預估值
        const bottomY = window.innerHeight - cardHeight - 80; // 底部向上 80px

        setPosition({ x: 20, y: bottomY });
        hasSetInitialPosition.current = true;
      }, 100); // 100ms 延遲確保高度正確

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 拖曳開始
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!cardRef.current) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };

    scrollY.current = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.width = '100%';

    setIsDragging(true);
  };

  // 拖曳中（允許左右 + 上下）
  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !cardRef.current) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let newX = clientX - dragStart.current.x;
    let newY = clientY - dragStart.current.y;

    const maxX = window.innerWidth - cardRef.current.offsetWidth - 20;
    const maxY = window.innerHeight - cardRef.current.offsetHeight - 20;

    newX = Math.max(20, Math.min(newX, maxX));
    newY = Math.max(20, Math.min(newY, maxY));

    setPosition({ x: newX, y: newY });
  };

  // 拖曳結束
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY.current);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  if (!isOpen || !book) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"

    >
      <div
        ref={cardRef}
        className={`
          pointer-events-auto
          absolute
          w-[70%] max-w-md
          bg-white/95 backdrop-blur-xl
          rounded-2xl shadow-2xl border border-gray-200/50
          overflow-hidden
          transition-shadow duration-200
          ${isDragging ? 'shadow-2xl cursor-grabbing scale-[1.02]' : 'cursor-grab hover:shadow-2xl'}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'top 0.3s ease-out, left 0.3s ease-out', // 平滑移動
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >


        {/* 封面 */}
        <div className="relative h-84 bg-gradient-to-b from-gray-50 to-white">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-contain p-6 drop-shadow-md"
            priority
          />
        </div>
                {/* 右上角關閉按鈕 */}
        <button
          onClick={onClose}
          className="
            absolute top-60 right-3 z-10
            w-15 h-15 flex items-center justify-center
            rounded-full bg-white/80 hover:bg-gray-100
            text-black hover:text-gray-900
            shadow-sm transition-all border border-neutral-800
          "
          aria-label="關閉"
        >
          <X size={40} />
        </button>

        {/* 內容 */}
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-amber-50 text-amber-800 text-xs font-medium rounded-full border border-amber-200">
              <span className="text-base">⭐</span> 名家推薦
            </div>
            <div className="
              inline-flex items-center px-1 py-2 
              bg-green-50 text-green-700 
              text-base font-bold 
              rounded-full 
              border border-green-300/60 
              shadow-sm
            ">
              全球免運宅配
            </div>
          </div>


          {book.price && (
            <p className="text-xl font-bold text-red-600 mb-4">
              {book.price}
            </p>
          )}

          {/* 最下面的按鈕 */}
          <div className="flex gap-3">
            <button
              onClick={onClickCS}  // 直接使用父組件傳入的事件
              className="
                flex-1 py-4 px-6 rounded-xl 
                bg-red-600 hover:bg-red-700 
                text-white font-bold text-2xl 
                transition-all shadow-lg hover:shadow-xl
                active:scale-95
              "
            >
              免費領取-客服
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}