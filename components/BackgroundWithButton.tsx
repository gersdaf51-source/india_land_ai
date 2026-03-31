// components/BackgroundWithButton.tsx
"use client";

import type { FC } from 'react';
import { RestoredImage } from '@/components/RestoredImage';
import StepButton from './Step2';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface BackgroundWithButtonProps {
  baseName?: string;
  className?: string;

  // 新增：由外部传入的无效状态
  isInvalid?: boolean;

  // 可选：当金额选择变化时，外部可以接收事件
  onAmountChange?: (value: string) => void;
}

const BackgroundWithButton: FC<BackgroundWithButtonProps> = ({
  baseName = "14",
  className = "",
  isInvalid = false,
  onAmountChange,
}) => {
  const handleAmountChangeInternal = (value: string) => {
    // 通知外部
    onAmountChange?.(value);

  };




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
            baseName={baseName}
          />
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-1 sm:px-8 md:px-12 lg:px-16">

 
<div className="
  absolute
  bottom-3
  right-2
  w-full
   gap-4
  max-w-[min(90%,480px)]
  flex flex-col items-end
">
  {/* 第一個按鈕：普通大按钮 */}
  <Button
    onClick={() => handleAmountChangeInternal("c")}
    className="button button-blue button-large"
  >
    目前考慮
  </Button>

  {/* 第二個按鈕：呼吸效果的按钮 */}
  <Button
    onClick={() => handleAmountChangeInternal("a")}
    className="button button-green button-large button-breathe"
  >
    立即加入
  </Button>
</div>
      </div>
    </div>
  );
};

export default BackgroundWithButton;