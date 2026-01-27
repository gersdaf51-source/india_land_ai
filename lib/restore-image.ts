export async function restoreImageToCanvas(
  baseName: string,
  canvas: HTMLCanvasElement,
  pswd: number[]
) {
  const ctx = canvas.getContext("2d")!
  const size = 600
  const stripsCount = 60
  const stripHeight = size / stripsCount

  // loading 占位
  ctx.fillStyle = "#f8f9fa"
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = "#888"
  ctx.font = "24px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("Loading...", size / 2, size / 2)

  // pswd 容错
  if (!pswd || pswd.length < stripsCount) {
    throw new Error("pswd missing or invalid")
  }

  // 加载图片（比 onload 快）
  const img = new Image()
  img.src = `/imgs/${baseName}_1.jpg`
  await img.decode()

  // 原图 canvas
  const temp = document.createElement("canvas")
  temp.width = size
  temp.height = size
  temp.getContext("2d")!.drawImage(img, 0, 0)

  // 切条
  const strips: HTMLCanvasElement[] = []
  for (let i = 0; i < stripsCount; i++) {
    const c = document.createElement("canvas")
    c.width = size
    c.height = stripHeight
    c
      .getContext("2d")!
      .drawImage(
        temp,
        0,
        i * stripHeight,
        size,
        stripHeight,
        0,
        0,
        size,
        stripHeight
      )
    strips.push(c)
  }

  // 反向映射
  const inverse = new Array(stripsCount)
  for (let i = 0; i < stripsCount; i++) {
    inverse[pswd[i]] = i
  }

  // 重组
  const ordered = document.createElement("canvas")
  ordered.width = size
  ordered.height = size
  const octx = ordered.getContext("2d")!
  for (let i = 0; i < stripsCount; i++) {
    octx.drawImage(strips[inverse[i]], 0, i * stripHeight)
  }

  // 绘制 + 旋转
  ctx.clearRect(0, 0, size, size)
  ctx.save()
  ctx.translate(size / 2, size / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.translate(-size / 2, -size / 2)
  ctx.drawImage(ordered, 0, 0)
  ctx.restore()
}
