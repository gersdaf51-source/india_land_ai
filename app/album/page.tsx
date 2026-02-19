// app/album/page.tsx  (或其他頁面路徑)

// ── Server Component ── (不要加 'use client')
import ClientAlbum from '@/components/ClientAlbum';
import fs from 'node:fs/promises';
import path from 'node:path';


export default async function AlbumPage() {
  const picsDir = path.join(process.cwd(), 'public', 'pics');
  let imageFiles: string[] = [];

  try {
    const files = await fs.readdir(picsDir);
    // 過濾常見圖片格式（可自行增加副檔名）
    imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .sort(); // 按檔名字母順序排序，可改成其他邏輯
  } catch (err) {
    console.error('無法讀取 /public/pics 資料夾:', err);
    // 發生錯誤時給空陣列，頁面不會 crash
  }

  return <ClientAlbum images={imageFiles} />;
}