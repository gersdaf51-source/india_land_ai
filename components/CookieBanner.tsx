'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split('; ')
      .find(row => row.startsWith('cookie_consent='))
      ?.split('=')[1];

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const setConsentCookie = (value: string) => {
    document.cookie = `cookie_consent=${value}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    setShowBanner(false);
  };

  const acceptAll = () => setConsentCookie('all');
  const acceptNecessary = () => setConsentCookie('necessary');

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-23 left-0 right-0 z-50 bg-zinc-900/95 border-t border-zinc-700 text-white py-3 px-4 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-0 text-sm">
        
        <p className="flex-1">
          本網站使用 cookies 提升體驗與分析流量。
          繼續瀏覽即表示同意我們的 
          <a href="/privacy" className="underline hover:text-blue-400">隱私政策</a>。
        </p>

        <div className="flex gap-2 bottom-0 shrink-0">
          <button
            onClick={acceptNecessary}
            className="px-4 py-1.5 text-xs border border-zinc-600 hover:bg-zinc-800 rounded-md transition-colors"
          >
            必要 cookies
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-md font-medium transition-colors"
          >
            接受全部
          </button>
        </div>
      </div>
    </div>
  );
}