// components/BackgroundWithChoice.tsx
"use client";

import type { FC } from 'react';
import { RestoredImage } from '@/components/RestoredImage';
import StepChoice from './Step2';
import { toast } from 'sonner';

interface BackgroundWithChoiceProps {
  baseName?: string;
  className?: string;

  // 新增：由外部传入的无效状态
  isInvalid?: boolean;

  // 可选：当金额选择变化时，外部可以接收事件
  onAmountChange?: (value: string) => void;
}

const BackgroundWithChoice: FC<BackgroundWithChoiceProps> = ({
  baseName = "14",
  className = "",
  isInvalid = false,
  onAmountChange,
}) => {
  const handleAmountChangeInternal = (value: string) => {
    // 通知外部
    onAmountChange?.(value);

    // 同时也可以在这里 toast（可选，看你想把 toast 放在哪里）
    // if (value === "b") {
    //   toast.success("你选择了 " + value);
    // }
  };



const bottomValues: Record<string, string> = {
  "14": "35%",
  "15": "35%",
  "16": "20%",

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
        {/* 上方选项 */}
        {/* <div
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
              { id: "chatgpt", label: "ChatGPT" },
              { id: "claude", label: "Claude" },
              { id: "gemini", label: "Gemini" },
            ]}
            defaultSelectedId="chatgpt"
            onChange={(value) => {
              // 上方选项的逻辑保持不变
            }}
          />
        </div> */}



        
 
      



        <div
          className="
            absolute 
            
                 
            w-full 
            max-w-[min(90%,480px)]
            flex flex-col items-center
          "

          style={{
        bottom: bottomValues[baseName] || "35%",
      }}

        >

          {baseName == "14" && (
            <StepChoice
              options={[
                { id: "a", label: "10,000" },
                { id: "b", label: "30,000" },
                { id: "c", label: "100,000" },
              ]}
              defaultSelectedId="b"
      
              onChange={handleAmountChangeInternal}
            />
          )
          }
           {baseName == "15" && (
            <StepChoice
              options={[
                { id: "a", label: "價值投資" },
                { id: "b", label: "財務投資" },
                { id: "c", label: "我是新手" },
              ]}
              defaultSelectedId="b"
              
              onChange={handleAmountChangeInternal}
            />
          )
          }
            {baseName == "16" && (
            <StepChoice
              options={[
                { id: "a", label: "立即加入" },
                { id: "b", label: "我需要考慮" },
               
              ]}
              defaultSelectedId="b"
              onChange={handleAmountChangeInternal}
            />
          )
          }

        </div>
      </div>
    </div>
  );
};

export default BackgroundWithChoice;