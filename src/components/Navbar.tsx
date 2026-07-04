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
    ar: { searchPlaceholder: "ابحث عن طبق...", branch: "الفرع", contact: "اتصل بنا" },
    tr: { searchPlaceholder: "Yemek ara...", branch: "Şube", contact: "İletişim" },
    en: { searchPlaceholder: "Search for a dish...", branch: "Branch", contact: "Contact" }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0d0d0c]/85 backdrop-blur-md border-b border-[#d4af37]/15 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Trigger (RTL Left, LTR Right) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-[#f4f2ee] hover:bg-[#161614] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Restaurant Branding */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center border border-[#d4af37]/30 overflow-hidden bg-[#161614]">
              <Image 
                src="/logo.png" 
                alt={restaurant.name[currentLang]} 
                width={40} 
                height={40} 
                className="object-cover w-full h-full animate-pulse-subtle"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif font-semibold tracking-wide text-sm block leading-none text-[#f4f2ee]">
                {restaurant.name[currentLang]}
              </span>
              <span className="text-[10px] text-[#c5a880]/80 tracking-widest uppercase block mt-1">
                Uzungöl, Trabzon
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`text-sm font-light hover:text-[#d4af37] transition-colors ${
                activeSection === 'home' ? 'text-[#d4af37] font-medium' : 'text-[#f4f2ee]/85'
              }`}
            >
              {currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home'}
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className={`text-sm font-light hover:text-[#d4af37] transition-colors ${
                  activeSection === cat.id ? 'text-[#d4af37] font-semibold' : 'text-[#f4f2ee]/85'
                }`}
              >
                {cat.name[currentLang]}
              </button>
            ))}
          </div>

          {/* Action Utilities (Search, Branch, Lang, Phone) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search toggler */}
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
                    className="hidden sm:block outline-none text-xs rounded-full border border-[#d4af37]/25 bg-[#161614]/90 px-4 py-1.5 text-[#f4f2ee] focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/30 transition-all font-sans"
                    style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                  />
                )}
              </AnimatePresence>
              
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-[#161614] text-[#c5a880] transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Branch Selector (Desktop & Tablet) */}
            {restaurant.branches && restaurant.branches.length > 1 && (
              <div className="hidden lg:flex items-center gap-1 text-[#f4f2ee]/95 bg-[#161614]/40 border border-[#d4af37]/15 rounded-full px-3 py-1 text-xs">
                <MapPin className="h-3.5 w-3.5 text-[#d4af37]" />
                <select
                  value={selectedBranch?.id || ''}
                  onChange={(e) => {
                    const branch = restaurant.branches.find(b => b.id === e.target.value);
                    if (branch) onBranchChange(branch);
                  }}
                  className="bg-transparent border-none outline-none cursor-pointer pr-4 font-sans text-xs text-[#f4f2ee] hover:text-[#d4af37] transition-colors"
                >
                  {restaurant.branches.map(b => (
                    <option key={b.id} value={b.id} className="bg-[#0d0d0c] text-[#f4f2ee]">
                      {b.name[currentLang]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Direct Dial Phone Link */}
            <a
              href={`tel:${selectedBranch?.phone || restaurant.phone}`}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/15 bg-[#161614]/20 hover:bg-[#d4af37]/15 text-[#c5a880] transition-colors"
              title={labels[currentLang].contact}
            >
              <Phone className="h-4 w-4" />
            </a>

            {/* Language dropdown */}
            <LanguageSwitcher currentLang={currentLang} onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile Menu Navigation (Framer Motion Drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Drawer container */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 z-50 w-72 bg-[#121211] border-[#d4af37]/10 shadow-2xl p-6 flex flex-col justify-between ${
                isRtl ? 'right-0 border-l' : 'left-0 border-r'
              }`}
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#d4af37]/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center border border-[#d4af37]/35 overflow-hidden bg-[#161614]">
                      <Image 
                        src="/logo.png" 
                        alt={restaurant.name[currentLang]} 
                        width={32} 
                        height={32} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-serif font-semibold text-[#f4f2ee]">
                      {restaurant.name[currentLang]}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-[#a69f95] hover:bg-[#161614] hover:text-[#f4f2ee]"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Search input */}
                <div className="relative mt-6">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a69f95]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={labels[currentLang].searchPlaceholder}
                    className="w-full text-xs rounded-xl border border-[#d4af37]/15 bg-[#161614]/80 pl-9 pr-4 py-2.5 text-[#f4f2ee] focus:border-[#d4af37]/50 focus:outline-none font-sans"
                  />
                </div>

                {/* Menu list */}
                <div className="mt-8 flex flex-col gap-5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-right text-base font-light hover:text-[#d4af37] transition-colors pb-2 border-b border-white/[0.03] ${
                      activeSection === 'home' ? 'text-[#d4af37] font-semibold' : 'text-[#f4f2ee]/85'
                    }`}
                  >
                    {currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home'}
                  </button>
                  
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToSection(cat.id)}
                      className={`text-right text-base font-light hover:text-[#d4af37] transition-colors pb-2 border-b border-white/[0.03] ${
                        activeSection === cat.id ? 'text-[#d4af37] font-semibold' : 'text-[#f4f2ee]/85'
                      }`}
                    >
                      {cat.name[currentLang]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Branch Selector (Mobile Only) */}
              <div>
                {restaurant.branches && restaurant.branches.length > 1 && (
                  <div className="flex flex-col gap-2 border-t border-[#d4af37]/10 pt-4 mt-6">
                    <label className="text-[10px] text-[#c5a880] tracking-widest uppercase font-light">
                      {labels[currentLang].branch}
                    </label>
                    <div className="flex items-center gap-2 text-[#f4f2ee]/95 bg-[#161614] border border-[#d4af37]/15 rounded-xl px-3 py-2 text-xs">
                      <MapPin className="h-4 w-4 text-[#d4af37]" />
                      <select
                        value={selectedBranch?.id || ''}
                        onChange={(e) => {
                          const branch = restaurant.branches.find(b => b.id === e.target.value);
                          if (branch) onBranchChange(branch);
                        }}
                        className="bg-transparent border-none outline-none cursor-pointer w-full text-xs text-[#f4f2ee] font-sans"
                      >
                        {restaurant.branches.map(b => (
                          <option key={b.id} value={b.id} className="bg-[#121211] text-[#f4f2ee]">
                            {b.name[currentLang]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                <a
                  href={`tel:${selectedBranch?.phone || restaurant.phone}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 py-2.5 text-xs text-[#c5a880] hover:bg-[#d4af37]/20 active:scale-95 transition-all font-sans font-medium"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {selectedBranch?.phone || restaurant.phone}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
