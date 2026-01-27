"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { restoreImageToCanvas } from "@/lib/restore-image"
import { loadPswd } from "@/lib/load-pswd"

export function RestoredImage({ baseName }: { baseName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const pswd = await loadPswd()
      if (!canvasRef.current || cancelled) return

      // 固定逻辑分辨率（用于解码）
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

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full aspect-square overflow-hidden rounded-2xl"
    >
      {/* 快速显示层 */}
      <Image
        src={`/imgs/${baseName}_1.jpg`}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* canvas 显示层（自动缩放） */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
