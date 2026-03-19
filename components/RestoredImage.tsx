// components/RestoredImage.tsx   （或你原本的檔案）
"use client"

import { useEffect, useRef, useState } from "react"
import { restoreImageToCanvas } from "@/lib/restore-image"
import { loadPswd } from "@/lib/load-pswd"

export function RestoredImage({ imageSrc }: { imageSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    if (highlight) {
      const timer = setTimeout(() => setHighlight(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [highlight])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const pswd = await loadPswd()
      if (!canvasRef.current || cancelled) return

      canvasRef.current.width = 600
      canvasRef.current.height = 600

      // 從 imageSrc 提取 baseName（給 restoreImageToCanvas 使用）
      const baseName = imageSrc.split('/').pop()?.replace('_1.jpg', '') || ''

      await restoreImageToCanvas(baseName, canvasRef.current, pswd)
      if (!cancelled) setReady(true)
    }

    run()
    return () => { cancelled = true }
  }, [imageSrc])

  const handleClick = () => setHighlight(true)

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-full aspect-square overflow-hidden rounded-2xl cursor-pointer
        transition-all duration-200 ease-out
        ${highlight 
          ? "ring-4 ring-blue-500 ring-offset-2 scale-[1.02] shadow-xl" 
          : "hover:ring-2 hover:ring-gray-300 hover:scale-[1.01]"
        }
      `}
    >
      <img
        src={imageSrc}
        alt=""
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}