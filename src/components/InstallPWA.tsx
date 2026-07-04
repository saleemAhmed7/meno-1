'use client';

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { MultilingualText } from '@/types/menu';

interface InstallPWAProps {
  lang: 'ar' | 'tr' | 'en';
}

export default function InstallPWA({ lang }: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA installation choice outcome: ${outcome}`);
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const text: Record<'ar' | 'tr' | 'en', { title: string; button: string }> = {
    ar: {
      title: "تثبيت تطبيق القائمة لتصفح أسرع وبدون إنترنت!",
      button: "تثبيت الآن"
    },
    tr: {
      title: "Daha hızlı ve internetsiz kullanım için uygulamayı yükleyin!",
      button: "Şimdi Yükle"
    },
    en: {
      title: "Install our menu app for offline access and faster loading!",
      button: "Install Now"
    }
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-45 anim-fade-in-up">
      <div className="glass bg-[#161614]/90 border border-[#d4af37]/30 shadow-2xl p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-light text-[#a69f95] leading-relaxed">
              {text[lang].title}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleInstallClick}
          className="shrink-0 px-4 py-2 text-xs font-semibold rounded-lg bg-[#d4af37] text-[#0d0d0c] hover:bg-[#c5a880] active:scale-95 transition-all duration-200"
        >
          {text[lang].button}
        </button>
      </div>
    </div>
  );
}
