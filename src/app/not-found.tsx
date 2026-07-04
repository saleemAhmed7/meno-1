import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0c] px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-8xl font-extralight tracking-widest text-[#d4af37]/80 select-none">
          404
        </h1>
        
        <h2 className="mt-6 text-2xl font-serif text-[#f4f2ee]">
          الصفحة غير موجودة | Sayfa Bulunamadı
        </h2>
        
        <p className="mt-3 text-sm text-[#a69f95] font-light leading-relaxed">
          The page you are looking for does not exist or has been moved. Explore our premium menu page instead.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block px-8 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38f2d] text-[#0d0d0c] hover:brightness-110 shadow-lg shadow-[#d4af37]/10 active:scale-95 transition-all duration-200"
          >
            الذهاب إلى القائمة / Menüye Git / Go to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
