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


declare global {
  interface Window {
    __PIXELS_LOADED__?: boolean
  }
}


export default function Home() {
  const [count, setCount] = useState(68942)
  const [isLoading, setIsLoading] = useState(false)
  const [showGallery, setShowGallery] = useState(false) // For gallery toggle if needed
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0) //增加彈窗數量
  let question_ans = 0


  const handleOpenStep1 = () => {
    setStep(1)
    setOpen(true)
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)  //設置狀態會自動更新ui.
    } else {
      setOpen(false)           // 最後一個關閉
      setStep(1)
      handleJoin()

      // 或者可以再做其他事，例如導向 whatsapp
    }
  }

  const handleClose = () => {
    setOpen(false)
    // 如果你希望「關閉後不要再自動跳下一個」，就不要在這裡 setStep
  }




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
          // setOpen(shouldOpen);                        // 用 data 的值，而不是旧的 ischangelink
          if (shouldOpen) {
            handleOpenStep1()

          }


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


  const handleJoin = () => {
    const canJoin = !isNeedLimtClick || clickCount < 3;
    // console.log("canJoin:" + canJoin)
    // console.log("clickCount:" + clickCount)


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


  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#000428] to-[#0a1a3a] text-white bg-fixed overflow-x-hidden">
      <div className="container mx-auto max-w-[480px] px-4 py-4 relative z-10 text-center">

        {/* Hero Section */}
        <div className="hero p-4 md:p-[40px_20px] bg-gradient-to-br from-[rgba(138,43,226,0.3)] to-[rgba(0,212,255,0.15)] rounded-[32px] border border-[rgba(138,43,226,0.4)] shadow-[0_20px_60px_rgba(138,43,226,0.25)] backdrop-blur-xl mb-6">
          <div className="live-badge inline-block bg-[#ff2d55] text-white px-[10px_28px] py-[10px] rounded-full font-black text-[1.1rem] shadow-[0_0_30px_rgba(255,45,85,0.6)]   animate-pulse
  scale-[1.03]">
            JUST WENT LIVE!
          </div>

          <h1 className="main-title text-[2.9rem] font-black leading-tight my-4 bg-gradient-to-r from-[#ff8c00] via-[#ff2d55] via-[#9c27b0] to-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,45,85,0.4)]">
            Aarush AI
          </h1>

          <p className="hero-subtitle text-[1.5rem] my-3">
            Real AI Power — Completely Free for All
          </p>

          <div className="no-tension text-3xl font-black text-[#00ff88] my-3 drop-shadow-[0_0_20px_#00ff88]">
            No fees, no tension!
          </div>

          <p className="hero-tagline my-4 text-[1.1rem] leading-[1.6]">
            It&apos;s amazing — Aarush AI has performed exceptionally well so far.<br />
            <strong className="text-[#ff2d55]">Seize this learning opportunity!</strong>
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
                    {['Market data', 'Index values', 'Aarush AI Learning', 'How to use Aarush AI', 'What is Aarush AI', 'Daily tips & updates'].map((item, i) => (
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
                <span className='text-white'>Excellent results.</span>
              </div>

              {/* 輸入框 */}
              <input
                type="text"
                placeholder="Enter your code or question..."
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



          <button
            onClick={() => { setOpen(true) }}
            disabled={isLoading}
            className="hero-cta bg-[#25d366] text-white text-[1.4rem] font-black py-5 px-10 rounded-full w-[92%] max-w-[380px] mx-auto mt-5 shadow-[0_15px_40px_rgba(37,211,102,0.5)] cursor-pointer flex items-center justify-center gap-2 transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(37,211,102,0.6)]"
          >
            <MessageCircle className="wa-icon h-16 w-16" />
            Join WhatsApp & Start Using Instantly
          </button>
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
                      grid grid-cols-1 md:grid-cols-2 gap-8
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
                      p-1 md:p-1
                      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                      grid grid-cols-1 md:grid-cols-2 gap-8
                    "
                        >

                          <div className=" max-w-3xl mx-auto">
                            <h1 className='font-bold text-2xl py-3'>Please answer the following questions:</h1>


                            {/* 另一個例子 */}
                            <StepChoice
                              question="1、Which AI tools have you used?"
                              options={[
                                { id: "chatgpt", label: "ChatGPT" },
                                { id: "claude", label: "Claude" },
                                { id: "gemini", label: "Gemini" },

                              ]}
                              defaultSelectedId="chatgpt"
                              onChange={(value) => {


                              }}
                            />


                            <StepChoice
                              question="2、What is your expected daily profit?"
                              options={[
                                { id: "a", label: "500" },
                                { id: "b", label: "1,000" },
                                { id: "c", label: "5,000" },
                              ]}

                              onChange={(value) => {
                                question_ans=1;
                                console.log("使用者選擇了：", value)
                              }}
                            />
                          </div>





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
                  Do you want to learn how to use AI? Join the group to get the latest learning resources and shared materials.

                </div>


                }
              </DialogDescription>

            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">
                  Cancel
                </button>
              </DialogClose>

              <button
                onClick={() => {
                  if (step === 2) {
                    if(question_ans===1){
                    handleNext()

                    }else{
                      toast.error("You need to click on your answer.")
                    }


                  } else {
                    handleNext()

                  }




                }}
                className="bg-[#25d366] px-6 py-3 rounded-full font-black shadow-[0_10px_30px_rgba(37,211,102,0.6)]"
              >
                👉 I want to Join.
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
              {["1", "2", "3", "5", "6", "7", "8", "9", "10", "11", "12"].map((id) =>
                ["1", "5", "12"].includes(id) ? (
                  <div
                    key={id}
                    onClick={() => {
                      handleOpenStep1()
                    }}
                    className={id}
                  >
                    <RestoredImage baseName={id} />
                  </div>
                ) : (
                  <RestoredImage key={id} baseName={id} />
                )
              )}

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
            <span className="text-[#ff2d55] text-3xl animate-glow" id="counter">{count.toLocaleString()}</span> learners joined <span className="highlight text-[#00ff88]">today</span>
          </div>
        </div>

        {/* Features */}
        <div className="features bg-[rgba(255,255,255,0.06)] rounded-[24px] p-7 border border-[rgba(255,255,255,0.1)] my-6">
          <h3 className="text-[1.4rem] mb-5 text-[#00d4ff] font-bold">Why 68,000+ Learners Choose Aarush AI Every Day</h3>
          <div className="feature-grid grid grid-cols-2 gap-4 text-left">
            {[
              { strong: 'Speaks English + Spanish', text: 'English, Spanish + more' },
              { strong: 'SAT/ACT/College Prep', text: 'Instant explanations, mock tests, study plans' },
              { strong: 'Resume & Interview Prep', text: 'Write perfect resume & crack interviews' },
              { strong: 'Daily Life Helper', text: 'Essays, emails, Instagram captions in seconds' },
              { strong: '24×7 Personal Tutor', text: 'Math, Science, History — step by step' },
              { strong: 'Creative Tools', text: 'Generate images, code, business ideas' },
              { strong: 'Daily New Tips', text: 'Prompts, features, updates in group' },
              { strong: '100% Free Forever', text: 'No ads, no payment, no data selling' },
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
            { p: '"Scored 95% in SAT mock after using Aarush AI for 1 week. Best free tool ever!"', cite: '— Alex Johnson, College Aspirant, New York' },
            { p: '"Finally an AI that understands Spanish and helps with exam prep!"', cite: '— Maria L., Los Angeles' },
            { p: '"Got my dream job resume written in 5 minutes. Joined the group for daily tips!"', cite: '— Ryan M., San Francisco' },
          ].map((test, i) => (
            <div key={i} className="testimonial bg-[rgba(255,255,255,0.07)] rounded-[20px] p-5 my-3 border-l-[5px] border-[#ff2d55]">
              <p className="text-base leading-[1.5] mb-2">{test.p}</p>
              <cite className="block text-[0.9rem] text-[#aaa] mt-2">{test.cite}</cite>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="trust-badges flex justify-center flex-wrap gap-4 my-[30px]">
          {['Made in California', '100% Free Forever', 'No Data Selling', '68,000+ Members'].map((badge, i) => (
            <div key={i} className="badge bg-[rgba(0,255,136,0.15)] text-[#00ff88] px-5 py-[10px] rounded-full font-bold text-[0.9rem] border border-[rgba(0,255,136,0.4)]">
              {badge}
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="footer-links flex justify-center gap-6 text-sm my-8">
          <a href="/about" className="text-gray-400 hover:text-[#4ecdc4] transition-colors">About Us</a>
          <a href="/privacy" className="text-gray-400 hover:text-[#4ecdc4] transition-colors">Privacy Policy</a>
          <a href="/terms" className="text-gray-400 hover:text-[#4ecdc4] transition-colors">Terms of Service</a>
        </div>

        {/* Disclaimer */}
        <div className="
            disclaimer 
            text-sm text-gray-500 
            mt-16 mb-24               // 加大上邊距，讓它與上面內容有區隔
            text-center leading-relaxed
            border-t border-gray-700/40 pt-8 pb-20
          ">
          Aarush AI Technologies • 2219 Harvest Lane, Palmdale, California 93550 • Phone: 661-233-4435<br />
          Educational AI Assistant • Not financial advice • Made with ❤️ in the USA
        </div>

        {/* Bottom CTA */}
        <div className="  bottom-cta
  fixed bottom-0 left-0 right-0
  p-4
  bg-[rgba(18,7,49,0.26)]
  backdrop-blur-xl
  z-[999]
  border-t border-[rgba(138,43,226,0.3)]
  flex justify-center items-center">
          <button
            onClick={() => { setOpen(true) }}
            disabled={isLoading}
            className="bg-[#25d366] text-white text-[1.3rem] font-black py-[18px] px-[36px] rounded-full w-[92%] max-w-[400px] shadow-[0_12px_40px_rgba(37,211,102,0.5)] flex items-center justify-center gap-[14px]"
          >
            <MessageCircle className="wa-icon h-[56px] w-[56px]" />
            Join 68,000+ Everyday People Now – Totally FREE!
          </button>
        </div>

        <Toaster position="bottom-center" richColors />
      </div>
    </main>
  )




}