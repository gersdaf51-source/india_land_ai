"use client"

import { useState } from "react"

type Option = {
  id: string
  label: string
}

interface StepChoice {
  question: string
  options: Option[]
  defaultSelectedId?: string
  onChange?: (selectedId: string) => void
  isOk?:()=>void
}

export default function StepChoice({
  question = "你今天的心情如何？",
  options = [
    { id: "good", label: "很好" },
    { id: "normal", label: "普通" },
    { id: "bad", label: "不太好" },
  ],
  defaultSelectedId,
  onChange,
  isOk,
}: StepChoice) {
  const [selected, setSelected] = useState<string | undefined>(defaultSelectedId)

  const handleClick = (id: string) => {
    setSelected(id)
    onChange?.(id)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-5 bg-slate-900/60 rounded-xl border border-slate-700/70">
      {/* 左邊文字 */}
      <div className="text-white text-lg font-medium">
        {question}
      </div>

      {/* 右邊三個選項 */}
      <div className="flex gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleClick(opt.id)}
              className={`
                min-w-[80px]  py-2.5 rounded-full text-sm font-medium transition-all
                border
                ${isSelected 
                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-[0_0_12px_-4px] shadow-emerald-500/40" 
                  : "bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-700/60"
                }
              `}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}