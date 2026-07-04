'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type Language = 'ar' | 'tr' | 'en';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages: { code: Language; name: string; flag: string; locale: string }[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', locale: 'ar_SA' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', locale: 'tr_TR' },
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en_US' }
];

export default function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d4af37]/20 hover:border-[#d4af37]/50 bg-[#161614]/40 hover:bg-[#161614]/80 text-[#f4f2ee] text-sm font-light select-none transition-all duration-200"
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{activeLang.flag}</span>
        <span className="hidden sm:inline font-sans">{activeLang.name}</span>
        <ChevronDown className={`h-3 w-3 text-[#c5a880] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute mt-2 w-40 rounded-xl border border-[#d4af37]/20 bg-[#161614]/95 shadow-2xl backdrop-blur-md overflow-hidden ${
              activeLang.code === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
            }`}
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-right text-sm hover:bg-[#d4af37]/10 transition-colors duration-150 ${
                    currentLang === lang.code ? 'text-[#d4af37] font-semibold bg-[#d4af37]/5' : 'text-[#f4f2ee]/85 font-light'
                  }`}
                  style={{ direction: lang.code === 'ar' ? 'rtl' : 'ltr' }}
                >
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <span className="font-sans">{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
