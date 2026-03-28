// app/page.tsx
"use client"

import { MessageCircle, Radio } from 'lucide-react'
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
import StepChoice from '@/components/Step2'   // 正確（@ 是 Next.js 常見 alias）
import { Value } from '@radix-ui/react-select'
import BackgroundWithChoice from '@/components/BackgroundWithChoice'
import type { Metadata } from 'next';
import LineButton from '@/components/LineButton'





declare global {
  interface Window {
    __PIXELS_LOADED__?: boolean
  }
}


// export const metadata: Metadata = {
//   title: '我的首頁標題',                  // 會顯示在瀏覽器分頁
//   description: '這是網站首頁的描述文字，建議 120-160 字',

//   // 可選：加更多常見設定
//   // keywords: 'next.js, react, 我的網站',
//   // robots: 'index, follow',
//   // viewport: 'width=device-width, initial-scale=1',
// };


export default function Home() {
  const [count, setCount] = useState(68942)
  const [isLoading, setIsLoading] = useState(false)
  const [showGallery, setShowGallery] = useState(false) // For gallery toggle if needed
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0) //增加彈窗數量

  const isQuestionAnswer = useRef(false)



  const [isAmountInvalid, setIsAmountInvalid] = useState(false);




  const [whatsappLink, setWhatsappLink] = useState<string>("https://google.com/")
  const [ischangelink, setIsChangeLink] = useState<boolean>(false)


  const [buttonText, setButtonTxt] = useState<string>(" ")
  const [appName, setAppName] = useState<string>("")

  const [clickCount, setClickCount] = useLocalStorage<number>('join_click_count', 0);
  const [isNeedLimtClick, setIsNeedLimtClick] = useLocalStorage<boolean>('is_need_limit_click', false);

  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    if (window.__PIXELS_LOADED__) return

    const loadPixels = async () => {
      try {
        // const res = await fetch("http://127.0.0.1:8000/gg.php", { cache: "no-store" })
        const res = await fetch("http://127.0.0.1:8000/gg.php", { cache: "no-store" })
        // const res = await fetch("/gg.php", { cache: "no-store" })



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
          setIsChangeLink(!!data.is_change_link);

        }

        if (data.button_text !== undefined) {
          setButtonTxt(data.button_text);

        }
        if (data.app_name !== undefined) {
          setAppName(data.app_name);

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




  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 18) + 8)
    }, 3800)
    return () => clearInterval(interval)
  }, [])

  // Simulate canvas loading or drawing - replace with actual logic from pp.js if needed
  useEffect(() => {
    // Placeholder for canvas drawing logic
    const canvases = document.querySelectorAll('.imgCanvas')
    canvases.forEach(canvas => {
      const ctx = (canvas as HTMLCanvasElement).getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, 600, 600)
        // Add actual drawing code here
      }
    })
  }, [showGallery])


  function appendScriptFragment(html: string, id: string) {
    const container = document.createElement("div")
    container.id = id

    const range = document.createRange()
    range.selectNode(document.head)
    const fragment = range.createContextualFragment(html)

    container.appendChild(fragment)
    document.head.appendChild(container)
  }

  useEffect(() => {
    // 這裡的代碼只在 isChangeLink **變化** 時執行（不包含初次 mount）

    if (ischangelink === undefined) return; // 避免初次 undefined

    if (ischangelink) {
      handleOpenStep1()

    }



  }, [ischangelink]);




  // 事件A
  const handleOpenStep1 = () => {
    setStep(1)
    setOpen(true)
  }

  //事件B
  const handleNext = () => {
    // console.log("是否审核："+ischangelink)
    // console.log("setp:："+step)

    if (!ischangelink) {
      handleJoin()
      return
    }
    //这段不跳第二步，只用一步
    // handleJoin()

    // return
    // 后续修改再改过来





    if (step < 2) {
      setStep(step + 1)  //設置狀態會自動更新ui.
    } else {
      // 第二步后进行验证数据 然后才能跳转
      if (isQuestionAnswer.current) {
        setOpen(false)           // 最後一個關閉
        setStep(1)
        handleJoin()
        isQuestionAnswer.current = false

      } else {
        setIsAmountInvalid(true)

        setTimeout(() => {
          setIsAmountInvalid(false)
        }, 600)


      }

    }


  }

  const handleClose = () => {
    setOpen(false)
    // 如果你希望「關閉後不要再自動跳下一個」，就不要在這裡 setStep
  }

  //事件C

  const handleJoin = () => {
    const canJoin = !isNeedLimtClick || clickCount < 3;
    // console.log("canJoin:" + canJoin)
    // console.log("clickCount:" + clickCount)


    if (!canJoin) {
      // setWhatsappLink("https://google.com/search?q=hello");
      window.open("https://cutt.ly/rtjaj890", "_blank", "noopener,noreferrer");

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


  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#000428] to-[#0a1a3a] text-white bg-fixed overflow-x-hidden">
      <div className="container mx-auto max-w-[480px] px-2 py-4 relative z-10 text-center">

        {/* Hero Section */}
        <div className=" hidden hero p-4 md:p-[40px_20px] bg-gradient-to-br from-[rgba(138,43,226,0.3)] to-[rgba(0,212,255,0.15)] rounded-[32px] border border-[rgba(138,43,226,0.4)] shadow-[0_20px_60px_rgba(138,43,226,0.25)] backdrop-blur-xl mb-6">
          <div className="  live-badge inline-block bg-[#ff2d55] text-white px-[10px_28px] py-[10px] rounded-full font-black text-[1.1rem] shadow-[0_0_30px_rgba(255,45,85,0.6)]   animate-pulse
  scale-[1.03]">
            重磅發佈
          </div>

          <h1 className="main-title text-[2.9rem] font-black leading-tight my-4 bg-gradient-to-r from-[#ff8c00] via-[#ff2d55] via-[#9c27b0] to-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,45,85,0.4)]">
            Aarush AI
          </h1>

          <p className="hero-subtitle text-[1.5rem] my-3">
            終身免費使用
          </p>

          <div className="no-tension text-3xl font-black text-[#00ff88] my-3 drop-shadow-[0_0_20px_#00ff88]">
            零手續費，零煩惱！
          </div>

          <p className="hero-tagline my-4 text-[1.1rem] leading-[1.6]">
            太厲害了！Aarush AI 到目前為止表現超級出色。<br />
            <strong className="text-[#ff2d55] text-2xl">把握這個免費學習機會！</strong>
          </p>

          {/* Search Container */}
          {/* Search Container - 整體卡片 */}
          <div className="
                search-container
                w-full
                my-6
                rounded-3xl               // 更大圓角，更現代
                overflow-hidden
                bg-gradient-to-b from-[#001deb]/90 to-[#001deb]/70   // 藍色基底漸層
                backdrop-blur-md
                border border-blue-400/30
                shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
                transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,29,235,0.35)]
              ">

            {/* 跑馬燈區 - 藍色標頭 */}
            <div className="
                  marquee
                  relative h-11               // 略矮一點，更精緻
                  overflow-hidden
                  bg-gradient-to-r from-[#001deb] via-[#0a2aff] to-[#001deb]
                  flex items-center
                  border-b border-blue-400/40
                ">
              <div className="
                    marquee-track
                    flex items-center whitespace-nowrap
                    animate-[scroll_28s_linear_infinite]   // 速度調到28s，更自然
                  ">
                {/* 內容重複 3 次確保無縫 + 手機不卡 */}
                {Array(3).fill(null).map((_, group) => (
                  <div key={group} className="flex">
                    {['數據洞察與趨向', '數據評分與評判', 'Aarush AI 學習資源', '如何使用 Aarush AI', '什麼是 Aarush AI', '生活每日小撇步'].map((item, i) => (
                      <span
                        key={`${group}-${i}`}
                        className="
                marquee-item
                inline-flex items-center px-10 md:px-12
                text-sm md:text-[15px] font-medium
                text-white/95 tracking-wide
              "
                      >
                        {item}
                        <span className="mx-6 text-blue-300/60">•</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 輸入區域 */}
            <div className="input-area p-3 pb-7 bg-blue">
              {/* 標籤行 */}
              <div className="
                  input-labels
                  flex items-center gap-3
                  mb-3.5
                  text-sm font-medium text-gray-700
                ">
                <div className="
                        dot
                        w-2.5 h-2.5 rounded-full
                        bg-[#00ff15]
                        shadow-[0_0_8px_#4285f4/60]
                        flex-shrink-0
                        animate-pulse
                      " />
                <span className='text-white'>最新的回答</span>
              </div>

              {/* 輸入框 */}
              <input
                type="text"
                placeholder="請輸入你的問題或者代碼"
                autoComplete="off"
                className="
                    question-input
                    w-full h-14               // 更高一點，更舒適
                    px-6
                    text-base md:text-lg
                    font-medium
                    text-gray-900
                    bg-white
                    border-2 border-gray-200/80
                    rounded-2xl               // 更圓
                    outline-none
                    transition-all duration-200
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
                    placeholder:text-gray-400
                    hover:border-gray-300
                    hover:shadow-[0_0_0_3px_rgba(66,133,244,0.15),inset_0_2px_4px_rgba(0,0,0,0.06)]
                    focus:border-[#4285f4]
                    focus:shadow-[0_0_0_4px_rgba(66,133,244,0.25),inset_0_1px_3px_rgba(0,0,0,0.05)]
                  "
              />
            </div>
          </div>




        </div>




        <Dialog open={open} onOpenChange={setOpen}>
          {/* 触发器（也可以不用 Trigger，下面会说） */}
          {/* <DialogTrigger asChild>
            <button
              className="hero-cta bg-[#25d366] text-white text-[1.4rem] font-black py-5 px-10 rounded-full"
            >
              Join WhatsApp & Start Using Instantly
            </button>
          </DialogTrigger> */}

          <DialogContent className="bg-[#0a1a3a] border-[#8a2be2]/40 text-white rounded-3xl">
            <DialogHeader>

              <DialogDescription className="text-white/80">
                {
                  step === 1 && (
                    ischangelink && <>
                      <div className=" flex justify-center  py-1">
                        <div
                          className="
                      w-full
                      max-w-6xl
                      bg-white/5
                      backdrop-blur-xl
                      rounded-3xl
                      p-1 md:p-1
                      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                      grid grid-cols-1  gap-8
                    "
                        >
                          {["13"].map((id) => (
                            <RestoredImage key={id} baseName={id} />
                          ))}
                        </div>
                      </div>

                    </>
                  )
                }
                {
                  step === 2 && (
                    ischangelink && <>
                      <div className=" flex justify-center  py-1">
                        <div
                          className="
                            w-full
                            max-w-6xl
                            bg-white/5
                            backdrop-blur-xl
                            rounded-3xl
                            p-1 
                            shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                            grid grid-cols-1  gap-8
                          "
                        >
                          <h1 className='font-bold text-2xl py-3'>Please answer the following questions:</h1>


                          <BackgroundWithChoice
                            baseName="14"
                            isInvalid={isAmountInvalid}
                            onAmountChange={(value) => {

                              isQuestionAnswer.current = true



                            }}

                          />





                        </div>
                      </div>

                    </>
                  )
                }
                {/* {
                  step === 3 && (
                    <>


                    </>
                  )
                } */}





                {!ischangelink && <div>
                  超過 68,000 人已經在學 AI 了！
                  想學會用 AI 嗎？快加入群組，拿到最新學習資源和大家分享的材料！

                </div>

                }
              </DialogDescription>

            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">
                  離開
                </button>
              </DialogClose>

              <button
                onClick={() => {
                  handleNext()
                }}
                className="bg-[#25d366] px-6 py-3 rounded-full font-black shadow-[0_10px_30px_rgba(37,211,102,0.6)]"
              >
                👉 {buttonText}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>



        {ischangelink && (
          <div className="flex justify-center py-12">
            <div
              className="
                      w-full
                      max-w-6xl
                      bg-white/5
                      backdrop-blur-xl
                      rounded-3xl
                      p-1 md:p-10
                      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                      grid grid-cols-1  gap-8
                    "
            >

              {/* <button
                onClick={() => { handleOpenStep1() }}
                disabled={isLoading}
                className="hero-cta bg-[#25d366] text-white text-[1.4rem] font-black py-5 px-10 rounded-full w-[92%] max-w-[380px] mx-auto mt-5 shadow-[0_15px_40px_rgba(37,211,102,0.5)] cursor-pointer flex items-center justify-center gap-2 transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(37,211,102,0.6)]"
              >
                <MessageCircle className="wa-icon h-16 w-16" />
                加入Line，立即學習使用
              </button> */}


              {
              ["1", "2", "3", "4", "5", "6"].map((id) =>
              
              

                ["1", "4", "6"].includes(id) ? (
                  
                  <div
                    key={id}
                    onClick={() => handleOpenStep1()}
                    className={id}
                  >
                    <RestoredImage baseName={id} />

                    {/* Line 按鈕：只有 id 是 1 或 2 時才顯示 */}
                    {["1", "2"].includes(id) && (
                      <LineButton 
                        onClick={() => handleOpenStep1()} 
                        disabled={isLoading} 
                      />

          
                    )}
                  </div>
                ) : (
                  <>
          
                  <RestoredImage key={id} baseName={id} />
                                      {["1", "2"].includes(id) && (
                      <button
                        onClick={() => handleOpenStep1()}
                        disabled={isLoading}
                        className="hero-cta bg-[#25d366] text-white text-[1.4rem] font-black py-5 px-10 rounded-full w-[92%] max-w-[380px] mx-auto mt-5 shadow-[0_15px_40px_rgba(37,211,102,0.5)] cursor-pointer flex items-center justify-center gap-2 transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(37,211,102,0.6)]"
                      >
                        <MessageCircle className="wa-icon h-16 w-16" />
                        加入Line，立即學習使用
                      </button>

          
                    )}
                  
                  </>
                  



                )


              )
              
            
              }

            </div>
          </div>
        )}


        {/* Live Proof */}
        <div className="live-proof bg-[rgba(255,255,255,0.08)] rounded-[24px] p-6 border border-[rgba(255,255,255,0.15)] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)] my-5">
          <div className="avatars flex justify-center items-center my-4">
            {['/imgs/32.jpg', '/imgs/44.jpg', '/imgs/68.jpg', '/imgs/21.jpg', '/imgs/55.jpg'].map((src, i) => (
              <Image
                key={i}
                src={src}
                alt=""
                width={56}
                height={56}
                className={`rounded-full border-4 border-[#1a0033] -ml-4 shadow-[0_0_20px_rgba(0,212,255,0.4)] ${i === 0 ? 'ml-0' : ''}`}
              />
            ))}
            <div className="plus bg-[#00ff88] text-black w-16 h-16 rounded-full grid place-items-center font-black text-base border-4 border-[#1a0033] -ml-4 shadow-[0_0_25px_#00ff88]">
              +68K
            </div>
          </div>
          <div className="live-count text-[1.4rem] font-extrabold my-2">
            <span className="highlight text-[#00ff88]">今天</span> <span className="text-[#ff2d55] text-3xl animate-glow" id="counter">{count.toLocaleString()}</span> 位專業人士加入
          </div>
        </div>

        {/* Features */}
        <div className=" hidden features bg-[rgba(255,255,255,0.06)] rounded-[24px] p-7 border border-[rgba(255,255,255,0.1)] my-6">
          <h3 className="text-[1.4rem] mb-5 text-[#00d4ff] font-bold">為什麼超過 68,000 位專業人士每天選擇使用 Aarush AI？</h3>
          <div className="feature-grid grid grid-cols-2 gap-4 text-left">
            {[
              { strong: '中英雙語支援', text: '全球趨勢洞察' },
              { strong: '快速上手', text: '即時解說、模擬測試、最優策略規劃' },
              { strong: '需求組合建構', text: '打造最優組合、精準事件解析' },
              { strong: '每日 必用 小工具', text: '秒出報告、碳排指標、影響力分析' },
              { strong: '24 小時 策略 導師', text: '時事議題、熱點氣候一步步教' },
              { strong: 'AI 分析神器', text: '生成洞察、模型、創新想法、與時俱進' },
              { strong: '每日最新數據更新', text: 'Prompt 技巧、功能更新、群組分享' },
              { strong: '終身免費使用', text: '零廣告、零付費、絕不賣資料' },
            ].map((item, i) => (
              <div key={i} className="feature-item bg-[rgba(255,255,255,0.05)] rounded-2xl p-4 border border-[rgba(0,212,255,0.2)]">
                <strong className="block text-[1.1rem] mb-[6px] text-[#00ff88]">{item.strong}</strong>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials my-6 space-y-3">
          {[
            { p: '"Aarush AI 幫我快速客製 需求 數據，短短幾週就大幅提升決策品質，真的超級好用！完全免費的入門神器！"', cite: '— 陳怡君，策略分析師，台北' },
            { p: '"終於找到懂中文的 AI，能給出精準又實用的分析，結果超乎預期，學習曲線超短！"', cite: '— 林志偉，門店經理，台中' },
            { p: '"用 Aarush AI 幾分鐘就做出完整的影響報告，太方便了！馬上加入群組，每天都有新 tips 和更新，超值！"', cite: '— 黃美玲，生活顧問，高雄' },
          ].map((test, i) => (
            <div key={i} className="testimonial bg-[rgba(255,255,255,0.07)] rounded-[20px] p-5 my-3 border-l-[5px] border-[#ff2d55]">
              <p className="text-base leading-[1.5] mb-2">{test.p}</p>
              <cite className="block text-[0.9rem] text-[#aaa] mt-2">{test.cite}</cite>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="trust-badges flex justify-center flex-wrap gap-4 my-[30px]">
          {['紐約技術研發', '終身免費使用', '零資料販售', '68,000+ 全球會員'].map((badge, i) => (
            <div key={i} className="badge bg-[rgba(0,255,136,0.15)] text-[#00ff88] px-5 py-[10px] rounded-full font-bold text-[0.9rem] border border-[rgba(0,255,136,0.4)]">
              {badge}
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="footer-links flex justify-center gap-6 text-sm my-8">
          <a href="/about" className="text-gray-400 hover:text-[#4ecdc4] transition-colors">關於我們</a>
          <a href="/privacy" className="text-gray-400 hover:text-[#4ecdc4] transition-colors">隱私權政策</a>
          <a href="/terms" className="text-gray-400 hover:text-[#4ecdc4] transition-colors">服務條款</a>
        </div>

        {/* Disclaimer */}
        <div className="
    disclaimer 
    text-sm text-gray-500 
    mt-16 mb-24               // 加大上邊距，讓它與上面內容有區隔
    text-center leading-relaxed
    border-t border-gray-700/40 pt-8 pb-20
  ">
          Aarush AI Learning • 3336 Red Maple Drive, Los Angeles, California 90017 • Phone: 213-901-9112<br />
          Educational AI Assistant for Sustainability • Not financial advice • Made with ❤️ in the USA
        </div>

        {/* Bottom CTA */}
        <div className="bottom-cta
  fixed bottom-0 left-0 right-0
  p-4
  bg-[rgba(18,7,49,0.26)]
  backdrop-blur-xl
  z-[999]
  border-t border-[rgba(138,43,226,0.3)]
  flex justify-center items-center">
          <button
            onClick={() => { handleOpenStep1() }}
            disabled={isLoading}
            className="bg-[#25d366] text-white text-[1.3rem] font-black py-[18px] px-[36px] rounded-full w-[92%] max-w-[400px] shadow-[0_12px_40px_rgba(37,211,102,0.5)] flex items-center justify-center gap-[14px]"
          >
            <MessageCircle className="wa-icon h-[56px] w-[56px]" />
            現在加入 +68,000 人 – 完全免費！
          </button>
        </div>

        <Toaster position="bottom-center" richColors />
      </div>
    </main>
  )




}