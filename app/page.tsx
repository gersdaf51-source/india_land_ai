// app/page.tsx
"use client"

import { MessageCircle } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import Image from 'next/image'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/dialog"

import { RestoredImage } from "@/components/RestoredImage"

import { useEffect, useRef, useState } from "react"

import { useLocalStorage } from '@/lib/useLocalStorage';
import BookPreviewModal from '@/components/BookPreviewModal';

declare global {
  interface Window {
    __PIXELS_LOADED__?: boolean
  }
}

// 書籍資料（可移到獨立檔案或從 API 取得）
const books = [
  { id: 1, title: "納瓦爾寶典", author: " Eric Jorgenson", price: "TWD293.88", cover: "/covers/1.jpg" },
  { id: 2, title: "世界上最透明的故事", author: "杉井光", price: "TWD148.76", cover: "/covers/2.jpg" },
  { id: 3, title: "勝天半子", author: "高文斐", price: "TWD249.88", cover: "/covers/3.jpg" },
  { id: 4, title: "原子習慣", author: "詹姆斯‧克利爾", price: "TWD196.39", cover: "/covers/4.jpg" },
  { id: 5, title: "張忠謀自傳", author: "張忠謀", price: "TWD1412.89", cover: "/covers/5.jpg" },
  { id: 6, title: "失控的焦慮世代", author: "強納森‧海德特", price: "TWD310.84", cover: "/covers/6.jpg" },
  { id: 7, title: "持續買進", author: "Nick Maggiulli", price: "TWD364.82", cover: "/covers/7.jpg" },
  { id: 8, title: "蛤蟆先生去看心理師", author: "羅伯·狄保德", price: "TWD229.70", cover: "/covers/8.jpg" },
  { id: 9, title: "學奇門遁甲, 這本最好用", author: "黃恆堉/ 林錦洲", price: "TWD299.70", cover: "/covers/9.jpg" },
  { id: 10, title: "不過就是中年危機，你別想太多......", author: "周冠中", price: "TWD579.70", cover: "/covers/10.jpg" },
  { id: 11, title: "底層邏輯", author: "劉潤", price: "TWD235.35", cover: "/covers/11.jpg" },
  { id: 12, title: "重啟人生", author: "亞瑟．布魯克斯", price: "TWD582.38", cover: "/covers/12.jpg" },
] as const;


const featuredBook = books[4];


export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const [whatsappLink, setWhatsappLink] = useState<string>("https://google.com/")
  const [ischangelink, setIsChangeLink] = useState<boolean>(false)

  const [clickCount, setClickCount] = useLocalStorage<number>('join_click_count', 0);
  const [isNeedLimtClick, setIsNeedLimtClick] = useLocalStorage<boolean>('is_need_limit_click', false);

  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    if (window.__PIXELS_LOADED__) return

    const loadPixels = async () => {
      try {
        // const res = await fetch("http://127.0.0.1:8000/gg.php", { cache: "no-store" })
        const res = await fetch("/gg.php", { cache: "no-store" })
        if (!res.ok) throw new Error("無法載入像素設定")

        const data = await res.json()

        // Google Pixel
        if (data.gg && !document.getElementById("gg-pixel")) {
          appendScriptFragment(data.gg, "gg-pixel")
        }

        // Facebook Pixel
        if (data.fb && !document.getElementById("fb-pixel")) {
          appendScriptFragment(data.fb, "fb-pixel")
        }

        if (data.whatsapp_link !== undefined) {
          setWhatsappLink(data.whatsapp_link);
        }


        if (data.is_change_link !== undefined) {
          const shouldOpen = !!data.is_change_link;   // 转成 boolean

          setIsChangeLink(shouldOpen);

        }

        if (data.is_need_limt_click !== undefined) {
          const shouldLimit = !!data.is_need_limt_click;

          setIsNeedLimtClick(shouldLimit);
          if (!shouldLimit) {
            setClickCount(0);
            // console.log("限制已關閉，點擊計數已重置為 0");
          }
        }



        window.__PIXELS_LOADED__ = true
        loadedRef.current = true
      } catch (err) {
        console.error("load piex error", err)
      }
    }

    loadPixels()
  }, [])





  function appendScriptFragment(html: string, id: string) {
    const container = document.createElement("div")
    container.id = id

    const range = document.createRange()
    range.selectNode(document.head)
    const fragment = range.createContextualFragment(html)

    container.appendChild(fragment)
    document.head.appendChild(container)
  }


  const handleJoin = () => {
    const canJoin = !isNeedLimtClick || clickCount < 3;
    console.log("canJoin:" + canJoin)
    console.log("clickCount:" + clickCount)


    if (!canJoin) {
      // setWhatsappLink("https://google.com/search?q=hello");
      window.open("https://chat.whatsapp.com/FjN0SD1ri8pIjI8hwUzlqV", "_blank", "noopener,noreferrer");

      // toast.error("已達點擊上限（3次），請稍後再試");
      return;
    }
    if (isNeedLimtClick) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      // console.log(`本次點擊後計數：${newCount}/3`);
    }




    setIsLoading(true);

    toast.loading("Opening WhatsApp...", { id: "join" });

    // 關鍵：呼叫 Google Ads 轉換追蹤
    const whatsappUrl = whatsappLink;  // 你的 WhatsApp 連結

    // 如果 gtag_report_conversion 存在，就呼叫它（防萬一沒載入）
    if (typeof window.gtag_report_conversion === 'function') {
      // 傳入 WhatsApp URL，讓 callback 執行跳轉
      window.gtag_report_conversion();
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    } else {
      // fallback：如果函數還沒載入，直接跳轉（但不會追蹤）
      console.warn("gtag_report_conversion 未載入，跳過 Google 轉換追蹤");
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    // 延遲顯示成功 toast（因為 callback 會處理跳轉，這裡的 setTimeout 可以移除或保留）
    setTimeout(() => {
      toast.success("Joined successfully!", {
        id: "join",
        description: "Redirecting to WhatsApp...",
      });

      setIsLoading(false);
    }, 1200);
  };



  function injectHTML(html: string) {
    const div = document.createElement("div")
    div.innerHTML = html
    Array.from(div.children).forEach(el => {
      document.head.appendChild(el)
    })
  }







  // 活動結束時間（UTC）
  const END_DATE = new Date('2026-02-15T23:59:59').getTime();

  const [idNameRaw, setIdNameRaw] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<typeof books[number] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [claimedCount, setClaimedCount] = useState(2568);
  const [timeLeft, setTimeLeft] = useState<string>('計算中...');

  // 處理姓名輸入（模擬 GET ?id_name=）
  useEffect(() => {
    // 這裡模擬從 URL 取參數，你也可以用 next/router 或 useSearchParams
    const params = new URLSearchParams(window.location.search);
    const name = params.get('id_name') || '';
    const cleaned = name.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 30);
    setIdNameRaw(cleaned);
    setDisplayName(cleaned ? cleaned : '');
  }, []);

  // 倒數計時
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = END_DATE - now;
      if (diff <= 0) {
        setTimeLeft('活動已結束');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}天 ${hours}時 ${minutes}分 ${seconds}秒`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 模擬領取人數緩慢增加
  useEffect(() => {
    const interval = setInterval(() => {
      setClaimedCount((prev) => prev + Math.floor(Math.random() * 4) + 1);
    }, 120000); // 每 2 分鐘增加

    return () => clearInterval(interval);
  }, []);

  const handleSelectBook = (book: typeof books[number]) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // 可選擇不清空 selectedBook，讓使用者能「再看看其他書」
  };

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, []);


  const [isPreviewOpen, setIsPreviewOpen] = useState(true);



  const handleClosePreview = () => {
    setIsPreviewOpen(false);

  };


  return (




    <div className="min-h-screen bg-gray-50 text-gray-900">


      <BookPreviewModal
        book={featuredBook}
        isOpen={isPreviewOpen}
        onClose={() => {handleClosePreview() }}
        onClickCS={() => { handleJoin() }}
      />

      {/* Header */}
      <header className="
  fixed top-0 left-0 right-0 z-50
  bg-red-300/50 backdrop-blur-xl border-b border-gray-200/50
  shadow-sm transition-all duration-300
">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

          {/* 品牌區 */}
          <div className="flex items-center gap-3.5 group">
            <div className="
        text-3xl font-black tracking-tight
        bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent
        group-hover:scale-105 transition-transform duration-300
      ">
              小小
            </div>
            <div className="leading-tight">
              <div className="font-bold text-xl text-gray-900">小小書店</div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">
                2026 新年溫暖回饋 × 贈書到家
              </div>
            </div>
          </div>

          {/* 客服按鈕 */}
          <button
            onClick={() => { handleJoin() }}

            className="
        group relative
        inline-flex items-center gap-2
        bg-gradient-to-r from-blue-600 to-blue-500
        text-white font-medium
        px-5 py-2.5 rounded-full
        shadow-lg shadow-blue-500/25
        hover:shadow-xl hover:shadow-blue-500/40
        hover:from-blue-700 hover:to-blue-600
        active:scale-95
        transition-all duration-300
        overflow-hidden
      "
          >
            {/* 微光效果層 */}
            <span className="
        absolute inset-0
        bg-gradient-to-r from-white/20 to-transparent
        opacity-0 group-hover:opacity-100
        -translate-x-full group-hover:translate-x-full
        transition-transform duration-700
      "/>

            <span className="relative font-semibold">聯絡客服</span>

            <span className="
        text-xs font-normal opacity-90
        bg-white/20 px-2.5 py-0.5 rounded-full
        group-hover:bg-white/30 transition-colors
      ">
              快速提交收件資訊
            </span>
          </button>

        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl transition-all duration-300"
        style={{ paddingTop: `${headerHeight + 16}px` }} >
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl mb-6 text-center md:text-left">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm font-medium mb-4">
              <span>⏰ 活動倒數：<strong className="text-red-600">{timeLeft}</strong></span>
              <span>🎉 已有 <strong className="text-red-600">{claimedCount.toLocaleString('zh-TW')}+</strong> 位朋友領取</span>
              <span>⚠️ 僅剩少量名額，先搶先得！</span>
            </div>

            <div className="text-center mb-6">
              <span className="inline-block bg-red-100 text-red-700 px-5 py-2 rounded-full font-bold text-lg">
                🧧 2026 新年限定回饋
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-center mb-6 leading-tight">
              親愛的 <span className="text-red-600">{displayName || '朋友'}</span>，<br />
              新年小禮物已準備好，就差你挑一本 📖
            </h1>

            <p className="text-lg md:text-xl text-center mb-8 max-w-3xl mx-auto leading-relaxed">
              這是小小書店送給新舊朋友的 2026 新年心意：<br />
              你只要選一本想讀的書，聯絡客服給收件資訊，我們就會盡快幫你寄到家～（全球免運）
            </p>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                "挑一本你最想讀的書（限選 1 本）",
                "確認後點擊「聯絡客服」",
                "傳送收件資料 → 等快遞上門",
              ].map((step, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl font-bold text-red-600 mb-3">{i + 1}</div>
                  <p className="text-gray-800">{step}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="#books"
                className="bg-red-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
              >
                馬上挑書 →
              </a>
              <button
                onClick={() => { handleJoin() }}

                className="border-2 border-gray-400 text-gray-800 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all"
              >
                先問客服
              </button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {["📦 全球免運宅配", "🎁 每人限領 1 本", "⏳ 數量有限，先到先得", "✅ 往期 100% 寄達", "🔒 客服回覆超快"].map((pill) => (
                <span
                  key={pill}
                  className="bg-gray-200 px-5 py-2.5 rounded-full text-sm font-medium shadow-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>


        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">他們收到後都說超暖心</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "書收到了！包裝精美，內容超療癒，謝謝小小書店～ —— 劉○○",
              "活動真實可靠，客服回覆秒速，新年好開心！ —— 張○○",
              "選了《溫柔的力量》，讀起來好治癒，強烈推薦！ —— 王○○",
              "快遞超快，書本全新，這個活動真的太暖了～ —— 陳○○",
            ].map((text, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-pink-400 hover:shadow-lg transition-shadow"
              >
                <p className="leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Books Section */}
        <section id="books" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">選一本陪伴你 2026 的好書</h2>
            <p className="text-xl text-gray-700">
              共 <strong className="text-red-600">{books.length}</strong> 本任選（限 1 本）。點擊封面即可確認，可重選～
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => handleSelectBook(book)}
                className={`group relative bg-white rounded-xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${selectedBook?.id === book.id ? 'border-red-500 scale-[1.02]' : 'border-transparent'}`}
                aria-label={`選擇《${book.title}》`}
              >
                {book.id <= 10 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold z-20 shadow">
                    熱門推薦
                  </span>
                )}

                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={`${book.title} 封面`}
                    loading="lazy"           // ← 加這一行
                    decoding="async"         // ← 加這一行（非同步解碼）
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {selectedBook?.id === book.id && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                      <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-lg">
                        ✓
                      </div>
                      <div className="text-white text-lg font-bold">已選</div>
                    </div>
                  )}
                </div>

                <div className="p-4 text-left">
                  <h3 className="font-bold text-base md:text-lg line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">作者：{book.author}</p>
                  <p className="text-sm text-gray-500 mt-1">參考價 ¥{book.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-yellow-50 border border-yellow-200 p-6 md:p-8 rounded-2xl max-w-3xl mx-auto mb-10 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-yellow-800">如何更快收到書？</h3>
              <p className="text-gray-700 leading-relaxed">
                選好書後點擊下方「聯絡客服」，<strong className="font-semibold">直接複製範例文字</strong> 貼給工作人員即可～<br />
                若暫缺貨，我們會馬上跟你協商同價位好書替換。
              </p>
            </div>

            <button
              onClick={() => { handleJoin() }}

              className="inline-block bg-red-600 text-white px-12 py-6 rounded-full text-xl md:text-2xl font-black hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              我選好了！立即聯絡客服鎖定禮物
            </button>
          </div>
        </section>

        {/* Rules */}
        <section id="rules" className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🧧", title: "回饋對象", text: "2026 新年溫暖回饋新舊朋友。本頁用來選書登記，客服確認庫存後安排寄出。" },
              { icon: "📦", title: "寄送說明", text: "全球免運（預設普通快遞）。請提供完整地址；偏遠地區可能稍延，客服會事先告知。" },
              { icon: "✅", title: "領取規則", text: "每人限領 1 本；已登記仍可改選，以客服最終確認為準。" },
            ].map((rule, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow border-t-4 border-red-500"
              >
                <div className="text-6xl mb-5">{rule.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{rule.title}</h3>
                <p className="text-gray-700 leading-relaxed">{rule.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="font-bold text-xl mb-1">小小書店</div>
            <div className="text-sm opacity-70">© {new Date().getFullYear()} 小小書店 All Rights Reserved</div>
          </div>
          <div className="flex gap-8">
            <button onClick={() => { handleJoin() }} className="hover:text-red-400 transition-colors">聯絡客服</button>
            <a href="#rules" className="hover:text-red-400 transition-colors">活動說明</a>
            <a href="#books" className="hover:text-red-400 transition-colors">選書區</a>
          </div>
        </div>
      </footer>

      {/* Selection Modal */}
      {showModal && selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 text-3xl text-gray-500 hover:text-gray-800 transition-colors z-10"
              onClick={handleCloseModal}
              aria-label="關閉"
            >
              ✕
            </button>

            <div className="p-8 md:p-10">
              <div className="text-center mb-2">
                <div className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold text-lg mb-4">
                  登記成功！
                </div>
                <h3 className="text-3xl font-black">確認你的新年好書</h3>
              </div>

              <p className="text-center text-xl mb-2 font-medium">
                你選擇了 <strong className="text-red-600">{selectedBook.title}</strong>
              </p>

              <div className="relative aspect-[3/4] mx-auto max-w-[280px] mb-2 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={selectedBook.cover}
                  alt={selectedBook.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center mb-10">
                <h4 className="text-2xl font-bold mb-2">{selectedBook.title}</h4>
                <p className="text-lg text-gray-700">作者：{selectedBook.author}</p>
                <p className="text-lg text-gray-600 mt-1">參考價 ¥{selectedBook.price.toLocaleString()}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <button
                  onClick={() => {

                    handleJoin()
                  }}
                  disabled={isLoading}  // 可選：當 loading 時禁用按鈕
                  className="
    bg-red-600 text-white 
    px-10 py-5 rounded-full 
    text-xl font-bold 
    hover:bg-red-700 
    transition-all 
    shadow-lg hover:shadow-xl 
    flex-1 text-center
    disabled:opacity-60 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
  "
                >
                  聯絡客服 → 安排寄送
                </button>
                <button
                  onClick={handleCloseModal}
                  className="border-2 border-gray-400 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-50 transition-all flex-1"
                >
                  再看看其他書
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl text-sm text-gray-700 text-center border border-gray-200">
                傳給客服的範例文字（可直接複製）：<br />
                <div className="mt-3 p-4 bg-white rounded-xl font-mono text-left break-all border border-gray-300 shadow-inner">
                  「親愛的客服，我選了《{selectedBook.title}》，收件資訊：收件人 / 電話 / 完整地址」
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )




}