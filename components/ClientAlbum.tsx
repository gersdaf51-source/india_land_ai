// components/ClientAlbum.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  images: string[];  // 例如 ["/pics/photo1.jpg", "/pics/IMG_123.png", ...]
};

export default function ClientAlbum({ images }: Props) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const openModal = (filename: string) => setSelectedImg(filename);
  const closeModal = () => setSelectedImg(null);

  // Esc 鍵關閉 modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800">
        <p className="text-2xl text-gray-600 dark:text-gray-300">
          目前沒有圖片可顯示
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 主要內容 */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              校園的她
            </h1>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
              共 {images.length} 張珍貴瞬間
            </p>
          </div>

          {/* Masonry 瀑布流 */}
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-6 space-y-6">
            {images.map((filename) => (
              <div
                key={filename}
                className="group break-inside-avoid cursor-pointer relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.04] bg-white dark:bg-gray-800"
                onClick={() => openModal(filename)}
              >
                <Image
                  src={filename}
                  alt={filename.split('/').pop() || '照片'}
                  width={900}
                  height={1200}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={82}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJnIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0yMCAwTDIwIDQwTDAgNDBMMCAwWiIgZmlsbD0iI2VlZWVlZSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
                />

                {/* Hover 覆蓋層 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white w-full">
                    <p className="font-semibold text-lg truncate">
                      {filename.split('/').pop()}
                    </p>
                    <p className="text-sm opacity-80 mt-1">點擊放大查看</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右下角懸浮按鈕 */}
      <Link
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <button
            className={`
              bg-gradient-to-r from-pink-500 to-purple-600 
              text-white font-bold text-lg px-8 py-5 rounded-full 
              shadow-2xl hover:shadow-pink-500/50 
              transition-all duration-300 transform 
              hover:scale-110 hover:-translate-y-1 
              flex items-center gap-3
              ring-4 ring-pink-400/30 hover:ring-pink-400/60
            `}
          >
            <span>點擊這裡查找我想見的她</span>
            <svg
              className="w-6 h-6 group-hover:rotate-12 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            去尋找更多！
          </div>
        </div>
      </Link>

      {/* 放大 Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm p-4"
          onClick={closeModal} // 點背景關閉
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh]"
            onClick={closeModal} // 點擊 modal 容器關閉（包含圖片區域）
          >
            <button
              className="absolute -top-5 -right-5 z-20 bg-black/50 text-white text-6xl rounded-full w-16 h-16 flex items-center justify-center hover:bg-black/70 transition-colors"
              onClick={closeModal}
            >
              ×
            </button>

            <div
              className="rounded-2xl overflow-hidden shadow-2xl bg-black/40"
              onClick={(e) => e.stopPropagation()} // 阻止圖片本身觸發關閉（但外層已處理）
            >
              <Image
                src={selectedImg}
                alt={selectedImg.split('/').pop() || '放大照片'}
                width={2000}
                height={1500}
                className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
                priority
                quality={92}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 text-white text-center pointer-events-none">
                {/* 可選擇顯示檔名或留空 */}
                {/* <p className="text-2xl font-medium truncate">{selectedImg.split('/').pop()}</p> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}