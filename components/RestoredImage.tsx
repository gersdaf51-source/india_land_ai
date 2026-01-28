"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { restoreImageToCanvas } from "@/lib/restore-image"
import { loadPswd } from "@/lib/load-pswd"

export function RestoredImage({ baseName }: { baseName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [highlight, setHighlight] = useState(false)

  // 自动取消高亮
  useEffect(() => {
    if (!highlight) return

    const timer = setTimeout(() => {
      setHighlight(false)
    }, 1200) // 1.2 秒后消失，可自行调整

    return () => clearTimeout(timer)
  }, [highlight])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const pswd = await loadPswd()
      if (!canvasRef.current || cancelled) return

      canvasRef.current.width = 600
      canvasRef.current.height = 600

      await restoreImageToCanvas(baseName, canvasRef.current, pswd)

      if (!cancelled) setReady(true)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [baseName])

  const handleClick = () => {
    setHighlight(true)          // 点击 → 触发高亮
    // 不需要手动取反，定时器会自动清除
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`
        relative w-full max-w-full aspect-square overflow-hidden rounded-2xl
        cursor-pointer transition-all duration-200 ease-out
        ${highlight 
          ? "ring-4 ring-blue-500 ring-offset-2 scale-[1.02] shadow-xl" 
          : "hover:ring-2 hover:ring-gray-300 hover:scale-[1.01]"
        }
      `}
    >
      <Image
        src={`/imgs/${baseName}_1.jpg`}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover transition-opacity duration-500 ${
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