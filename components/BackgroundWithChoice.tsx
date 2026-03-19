// components/BackgroundWithChoice.tsx
"use client";

import type { FC } from 'react';
import { RestoredImage } from '@/components/RestoredImage';
import StepChoice from './Step2';
import { toast } from 'sonner';

interface BackgroundWithChoiceProps {
  baseName?: string;        // 保留原本的 prop（方便外部傳入）
  className?: string;
  isInvalid?: boolean;
  onAmountChange?: (value: string) => void;
}

const BackgroundWithChoice: FC<BackgroundWithChoiceProps> = ({
  baseName = "14",
  className = "",
  isInvalid = false,
  onAmountChange,
}) => {
  const handleAmountChangeInternal = (value: string) => {
    onAmountChange?.(value);
    // 如果需要 toast，可以在這裡加上
    // if (value === "b") toast.success("你選擇了 1000");
  };

  // 關鍵修改：把 baseName 轉成完整靜態圖片路徑
  const imageSrc = `/imgs/${baseName}_1.jpg`;

  return (
    <div
      className={`
        relative 
        aspect-square 
        w-full max-w-[min(90vw,600px)] mx-auto
        overflow-hidden rounded-2xl
        shadow-2xl bg-gray-950/60 backdrop-blur-[1px]
        transition-all duration-300
        ${isInvalid 
          ? 'animate-[pulse_200ms_ease-in-out_3] border-4 border-red-500/80 shadow-[0_0_20px_#ef4444]' 
          : 'border-2 border-transparent'
        }
        ${className}
      `}
    >
      {/* 背景 */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
        <div className="w-full h-full flex items-center justify-center">
          <RestoredImage
            key={baseName}
            imageSrc={imageSrc}     
          />
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16">
        {/* 上方 Yes / No 選項 */}
        <div
          className="
            absolute 
            top-[33%]         
            w-full 
            max-w-[min(90%,480px)]
            flex flex-col items-center 
          "
        >
          <StepChoice
            options={[
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ]}
            defaultSelectedId="chatgpt"
            onChange={(value) => {
              // 上方選項的邏輯保持不變
            }}
          />
        </div>

        {/* 下方金額選擇 */}
        <div
          className="
            absolute 
            bottom-[2%]         
            w-full 
            max-w-[min(90%,480px)]
            flex flex-col items-center
          "
        >
          <StepChoice
            options={[
              { id: "a", label: "500" },
              { id: "b", label: "1000" },
              { id: "c", label: "5000" },
            ]}
            onChange={handleAmountChangeInternal}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundWithChoice;