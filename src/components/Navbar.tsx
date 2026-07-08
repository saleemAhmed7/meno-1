'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSwitcher, { Language } from './LanguageSwitcher';
import { Restaurant } from '@/types/menu';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  restaurant: Restaurant;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ currentLang, onLanguageChange, restaurant, searchQuery, onSearchChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRtl = currentLang === 'ar';

  const labels = {
    ar: { searchPlaceholder: 'ابحث عن طبق...' },
    tr: { searchPlaceholder: 'Yemek ara...' },
    en: { searchPlaceholder: 'Search for a dish...' }
  };

  return (
    <nav
      className={`fixed left-1/2 top-3 z-40 w-[calc(100%-1rem)] max-w-7xl -translate-x-1/2 rounded-full border border-[#c79c4f]/15 px-3 py-2 transition-all duration-300 sm:px-4 ${
        isScrolled ? 'bg-[#fcf8f1]/90 shadow-[0_18px_45px_rgba(79,52,33,0.12)] backdrop-blur-xl' : 'bg-[#fcf8f1]/75 shadow-[0_10px_32px_rgba(79,52,33,0.08)] backdrop-blur-xl'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 rounded-full px-2 py-1.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#c79c4f]/25 bg-[#fff9ee] shadow-sm">
            <Image src="/logo.png" alt={restaurant.name[currentLang]} width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-[0.16em] text-[#2f2219]">{restaurant.name[currentLang]}</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-[#8b632c]">Uzungöl, Trabzon</span>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={labels[currentLang].searchPlaceholder}
                  className="hidden rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] px-4 py-2 text-xs text-[#2f2219] outline-none sm:block"
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                />
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] p-2 text-[#8b632c] shadow-sm"
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
        </div>
      </div>
    </nav>
  );
}
