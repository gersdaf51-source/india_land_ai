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

  const [isouttime, setIsOutTime] = useState<boolean>(false)




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
        // const res = await fetch("http://127.0.0.1:8000/gg.php", { cache: "no-store" })
        const res = await fetch("/gg.php", { cache: "no-store" })



        if (!res.ok) throw new Error("無法載入像素設定")

        const data = await res.json()

        console.log("數據設定:", data)

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
        if (data.set_time !== undefined) {
          const currentTime = new Date();
          const setTimeStr = data.set_time.trim();

          const setTime = new Date(setTimeStr);

          console.log("当前时间:", currentTime);
          console.log("设置的时间字符串:", setTime);
          console.log("设置setTime>currentTime", setTime>currentTime);



          if (isNaN(setTime.getTime())) { //格式錯誤也是正常狀態
            setIsOutTime(true);
            return;
          }
          if (setTime > currentTime) {
            setIsOutTime(true);
          } else {
            setIsOutTime(false);
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

  useEffect(() => {
    // 這裡的代碼只在 isChangeLink **變化** 時執行（不包含初次 mount）

    if (ischangelink === undefined) return; // 避免初次 undefined

    if (ischangelink) {

      if(isouttime){// 沒有過期才會彈窗，否則，不可用
      handleOpenStep1()


      }


    }

    if (isouttime) {
      // 做某件事，例如顯示到期提示、關閉某些功能等
       console.log("當前可用");
     
    }else{
        console.log("已過期，執行特定邏輯");
    }


  }, [ischangelink, isouttime]);








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
    handleJoin()

    return
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
      <div className="container mx-auto max-w-[480px] px-4 py-4 relative z-10 text-center">

        {/* Hero Section */}
        <div className="hero p-4 md:p-[40px_20px] bg-gradient-to-br from-[rgba(138,43,226,0.3)] to-[rgba(0,212,255,0.15)] rounded-[32px] border border-[rgba(138,43,226,0.4)] shadow-[0_20px_60px_rgba(138,43,226,0.25)] backdrop-blur-xl mb-6">
          <div className="live-badge inline-block bg-[#ff2d55] text-white px-[10px_28px] py-[10px] rounded-full font-black text-[1.1rem] shadow-[0_0_30px_rgba(255,45,85,0.6)]   animate-pulse
  scale-[1.03]">
            すぐに明らかになる
          </div>

          <h1 className="main-title text-[2.9rem] font-black leading-tight my-4 bg-gradient-to-r from-[#ff8c00] via-[#ff2d55] via-[#9c27b0] to-[#00d4ff] to-[#00ff88] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,45,85,0.4)]">
            Sato AI
          </h1>

          <p className="hero-subtitle text-[1.5rem] my-3">
            日本で独自に開発された100%無料のAIモデル
          </p>

          <div className="no-tension text-3xl font-black text-[#00ff88] my-3 drop-shadow-[0_0_20px_#00ff88]">
            手数料なし、緊張なし！
          </div>

          <p className="hero-tagline my-4 text-[1.1rem] leading-[1.6]">
            素晴らしい！佐藤AIは今のところ非常に優れたパフォーマンスを発揮しています。<br />
            <strong className="text-[#ff2d55]">この学習機会をつかみましょう!</strong>
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
                    {[
                      '日本株市場データ（7203トヨタなど）',
                      '指数値（日経平均・TOPIX）',
                      'Sato Tech AI で株学習（8306三菱UFJ・9984SBG）',
                      'Sato Tech AI の使い方（6758ソニー・6501日立分析）',
                      'Sato Tech AI とは',
                      '毎日株Tips & 更新（7974任天堂・9432NTTなど）'
                    ].map((item, i) => (
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
                placeholder="銘柄コードや会社名を入力"
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
            onClick={() => { handleOpenStep1() }}
            disabled={isLoading}
            className="hero-cta bg-[#25d366] text-white text-[1.4rem] font-black py-5 px-10 rounded-full w-[92%] max-w-[380px] mx-auto mt-5 shadow-[0_15px_40px_rgba(37,211,102,0.5)] cursor-pointer flex items-center justify-center gap-2 transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(37,211,102,0.6)]"
          >
            <img
              src="./line-messenger-logo.svg"
              alt="LINE Icon"
              className="h-16 w-16 rounded-2xl"  // 圆角正方形，像 App 图标
            />
            Line Now
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
                  日本株の分析や投資学習をAIで効率的にやりたい方へ  <br />
                  LINEグループで毎日「トヨタ7203の最新動向」「日経平均予想」「神プロンプト」などを共有中！  <br />
                  無料で参加OK、一緒に賢く投資しませんか？

                </div>


                }
              </DialogDescription>

            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <button className="px-4 py-2 text-sm text-gray-400 hover:text-white">
                  キャンセル
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



        {isouttime && ischangelink && (
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
              {["1", "2", "3", "4", "5", "6"].map((id) =>
                ["1", "4", "6"].includes(id) ? (
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
            <span className="highlight text-[#00ff88]">今日の</span><span className="text-[#ff2d55] text-3xl animate-glow" id="counter">{count.toLocaleString()}</span>日本の参加
          </div>
        </div>

        {/* Features */}
        <div className="features bg-[rgba(255,255,255,0.06)] rounded-[24px] p-7 border border-[rgba(255,255,255,0.1)] my-6">
          <h3 className="text-[1.4rem] mb-5 text-[#00d4ff] font-bold">68,000人以上の日本人が佐藤AIデイリーを選ぶ理由</h3>
          <div className="feature-grid grid grid-cols-2 gap-4 text-left">
            {[
              { strong: '多言語対応でグローバルも安心', text: 'インド主要10言語＋英語でスムーズなやり取り' },
              { strong: '資格・昇進試験の効率化パートナー', text: '難解な問題の解説・学習スケジュール・弱点分析' },
              { strong: '書類・面接準備をワンランクアップ', text: '職務経歴書のブラッシュアップ・行動質問対策' },
              { strong: '業務メール・資料作成の時短ツール', text: '丁寧な報告書・提案メール・議事録要約を瞬時に' },
              { strong: '24時間365日頼れる学習支援', text: 'ビジネス数学・データ分析・業界史を体系的に' },
              { strong: '企画・新規事業のブレスト相手', text: '市場アイデア・プレゼン資料構成・画像素材提案' },
              { strong: '最新AI活用術を毎朝お届け', text: '業務効率化プロンプト・アップデート情報' },
              { strong: '完全無料・安心して長く使える', text: '広告表示なし・料金請求なし・プライバシー厳守' },
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
            { p: '"受験勉強で詰まった問題をステップごとに丁寧に解説してくれて、理解が深まった。無料でここまでできるなんて驚きです"', cite: '— みゆき、高3生、横浜' },
            { p: '"職務経歴書と自己PRを添削してもらったら、面接で「文章が読みやすい」と言われ、内定につながった。本当に助かりました"', cite: '— けんた、転職成功、札幌' },
            { p: '"日常のビジネスメールや企画書の下書きが一瞬で完成。24時間いつでも頼れる相棒みたいで、仕事の効率がかなり上がった"', cite: '— さくら、営業職、福岡' },
          ].map((test, i) => (
            <div key={i} className="testimonial bg-[rgba(255,255,255,0.07)] rounded-[20px] p-5 my-3 border-l-[5px] border-[#ff2d55]">
              <p className="text-base leading-[1.5] mb-2">{test.p}</p>
              <cite className="block text-[0.9rem] text-[#aaa] mt-2">{test.cite}</cite>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="trust-badges flex justify-center flex-wrap gap-4 my-[30px]">
          {['日本で急成長中', '100%永遠に無料', '個人情報一切売却なし', '7万人以上の仲間が参加中'].map((badge, i) => (
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
              border-t border-gray-200 pt-10
              max-w-3xl mx-auto px-4
            ">
          <div className="font-medium mb-3">
            Sato Tech AI
            〒969-6106 福島県大沼郡会津美里町黒川内461-1118
            TEL: 013-093-4708
          </div>

          <div className="mb-4 text-gray-500">
            勉強・就活のお助けAI　｜　投資・金融に関するアドバイスではありません
            日本で心を込めて作りました ❤️
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-500">
            <span>日本で急成長中</span>
            <span>100%永遠に無料</span>
            <span>個人情報一切売却なし</span>
            <span>7.5万人以上のコミュニティ</span>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            © 2026 Sato Tech AI. All rights reserved.
          </div>
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
            onClick={() => { handleOpenStep1() }}
            disabled={isLoading}
            className="bg-[#25d366] text-white text-[1.0rem] font-black py-[18px] px-[36px] rounded-full w-[92%] max-w-[400px] shadow-[0_12px_40px_rgba(37,211,102,0.5)] flex items-center justify-center gap-[14px]"
          >

            {'>>>'}今すぐLINEを追加 {'<<<'} <br />

            残り空き枠：80名！今すぐ行動を！！
          </button>
        </div>

        <Toaster position="bottom-center" richColors />
      </div>
    </main>
  )




}