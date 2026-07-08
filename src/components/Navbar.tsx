'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, MapPin, Menu, X, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageSwitcher, { Language } from './LanguageSwitcher';
import { Category, Restaurant, Branch } from '@/types/menu';

interface NavbarProps {
  categories: Category[];
  activeSection: string;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  restaurant: Restaurant;
  selectedBranch: Branch | null;
  onBranchChange: (branch: Branch) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  categories,
  activeSection,
  currentLang,
  onLanguageChange,
  restaurant,
  selectedBranch,
  onBranchChange,
  searchQuery,
  onSearchChange
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRtl = currentLang === 'ar';

  const labels = {
    ar: { searchPlaceholder: 'ابحث عن طبق...', branch: 'الفرع', contact: 'اتصل بنا' },
    tr: { searchPlaceholder: 'Yemek ara...', branch: 'Şube', contact: 'İletişim' },
    en: { searchPlaceholder: 'Search for a dish...', branch: 'Branch', contact: 'Contact' }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 96;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav
        className={`fixed left-1/2 top-3 z-40 w-[calc(100%-1rem)] max-w-7xl -translate-x-1/2 rounded-full border border-[#c79c4f]/15 px-3 py-2 transition-all duration-300 sm:px-4 ${
          isScrolled
            ? 'bg-[#fcf8f1]/90 shadow-[0_18px_45px_rgba(79,52,33,0.12)] backdrop-blur-xl'
            : 'bg-[#fcf8f1]/75 shadow-[0_10px_32px_rgba(79,52,33,0.08)] backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] p-2 text-[#4f3421] shadow-sm md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#c79c4f]/25 bg-[#fff9ee] shadow-sm">
              <Image src="/logo.png" alt={restaurant.name[currentLang]} width={40} height={40} className="h-full w-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-sm font-semibold tracking-[0.16em] text-[#2f2219]">
                {restaurant.name[currentLang]}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.25em] text-[#8b632c]">
                Uzungöl, Trabzon
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                activeSection === 'home' ? 'bg-[#2f2219] text-[#fcf8f1]' : 'text-[#4f3421] hover:bg-[#f7efe2] hover:text-[#2f2219]'
              }`}
            >
              {currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home'}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`rounded-full px-3 py-2 text-sm font-medium ${
                  activeSection === cat.id ? 'bg-[#2f2219] text-[#fcf8f1]' : 'text-[#4f3421] hover:bg-[#f7efe2] hover:text-[#2f2219]'
                }`}
              >
                {cat.name[currentLang]}
              </button>
            ))}
          </div>

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
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] p-2 text-[#8b632c] shadow-sm"
                aria-label="Toggle search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {restaurant.branches && restaurant.branches.length > 1 && (
              <div className="hidden items-center gap-1 rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] px-3 py-2 text-xs text-[#4f3421] lg:flex">
                <MapPin className="h-3.5 w-3.5 text-[#c79c4f]" />
                <select
                  value={selectedBranch?.id || ''}
                  onChange={(e) => {
                    const branch = restaurant.branches.find((b) => b.id === e.target.value);
                    if (branch) onBranchChange(branch);
                  }}
                  className="cursor-pointer bg-transparent pr-4 text-xs outline-none"
                >
                  {restaurant.branches.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#fcf8f1] text-[#2f2219]">
                      {b.name[currentLang]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <a
              href={`tel:${selectedBranch?.phone || restaurant.phone}`}
              className="hidden rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] p-2 text-[#8b632c] shadow-sm sm:flex"
              title={labels[currentLang].contact}
            >
              <Phone className="h-4 w-4" />
            </a>

            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#2f2219]/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className={`fixed top-0 bottom-0 z-50 flex w-72 flex-col justify-between border-[#c79c4f]/15 bg-[#fcf8f1] p-6 shadow-2xl ${
                isRtl ? 'right-0 border-l' : 'left-0 border-r'
              }`}
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#c79c4f]/15 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#c79c4f]/25 bg-[#fff9ee]">
                      <Image src="/logo.png" alt={restaurant.name[currentLang]} width={32} height={32} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-serif text-base font-semibold text-[#2f2219]">{restaurant.name[currentLang]}</span>
                  </div>

                  <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1 text-[#7a5941] hover:bg-[#f7efe2] hover:text-[#2f2219]">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="relative mt-6">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b632c]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={labels[currentLang].searchPlaceholder}
                    className="w-full rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] py-2.5 pl-10 pr-4 text-sm text-[#2f2219] outline-none"
                    style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                  />
                </div>

                <div className="mt-8 space-y-2">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full rounded-xl px-4 py-3 text-right text-sm ${
                      activeSection === 'home' ? 'bg-[#2f2219] text-[#fcf8f1]' : 'text-[#4f3421] hover:bg-[#f7efe2] hover:text-[#2f2219]'
                    }`}
                  >
                    {currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home'}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        scrollToSection(cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full rounded-xl px-4 py-3 text-right text-sm ${
                        activeSection === cat.id ? 'bg-[#2f2219] text-[#fcf8f1]' : 'text-[#4f3421] hover:bg-[#f7efe2] hover:text-[#2f2219]'
                      }`}
                    >
                      {cat.name[currentLang]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#c79c4f]/15 bg-[#fff9ee] p-4 text-sm text-[#7a5941]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#c79c4f]" />
                  <span>{restaurant.address[currentLang]}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
