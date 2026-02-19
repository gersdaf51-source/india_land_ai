// app/page.tsx
// 這是 Server Component（不要加 'use client'）

import ClientAlbum from '@/components/ClientAlbum';  // 請根據你的實際路徑調整

// 建議加入 ISR 或動態快取設定（可根據需求調整秒數）
export const revalidate = 60;  // 每 60 秒重新驗證一次資料（可設 0 每次都重新請求）

export default async function Home() {
  let imageList: string[] = [];

  try {
    // 推薦使用相對路徑（最穩，開發與生產都適用）
    // const res = await fetch('/pics/pic.php', {
    //   next: { revalidate: 60 },        // ISR 快取 60 秒
    //   // cache: 'no-store',            // 如果想要完全即時（每次請求都抓最新），可改用這行取代上面
    // });


       const res = await fetch('https://sharpdarkhe.online/pics/pic.php', {
      next: { revalidate: 60 },        // ISR 快取 60 秒
      // cache: 'no-store',            // 如果想要完全即時（每次請求都抓最新），可改用這行取代上面
    });

      console.log("獲取數據")



    if (!res.ok) {
      throw new Error(`pic.php 回應失敗，狀態碼: ${res.status}`);
    }

    const data = await res.json();

    if (data.success && Array.isArray(data.images)) {
      // 清理路徑：移除多餘的反斜線，確保格式正確
      imageList = data.images.map((path: string) =>
        path
          .replace(/\\/g, '')           // 移除所有 \
          .replace(/^\/+/, '/')         // 確保開頭只有一個 /
      );
      console.log("顯示列表是否正常")
      console.log(imageList)
    } else {
      console.warn('pic.php 回傳格式異常', data);
    }
  } catch (err) {
    console.error('無法從 /pics/pic.php 取得圖片列表:', err);
    // 可選擇給預設空陣列，或顯示錯誤頁面
  }

  return (
    <ClientAlbum images={imageList} />
  );
}