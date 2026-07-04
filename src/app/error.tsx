'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Next.js Runtime Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0c] px-4 text-center">
      <div className="max-w-md border border-[#d4af37]/20 bg-[#161614]/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/40 border border-red-500/30 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h2 className="mt-6 text-xl font-medium text-[#f4f2ee]">
          حدث خطأ ما | Bir Hata Oluştu
        </h2>
        
        <p className="mt-3 text-sm text-[#a69f95] font-light">
          Something went wrong while loading the menu. Please check the product configurations and try again.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b38f2d] text-[#0d0d0c] hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            إعادة المحاولة / Yeniden Dene / Retry
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880]/10 active:scale-95 transition-all duration-200"
          >
            تحديث الصفحة / Sayfayı Yenile
          </button>
        </div>
      </div>
    </div>
  );
}
