'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Restaurant } from '@/types/menu';

interface HeroSectionProps {
  restaurant: Restaurant;
  lang: 'ar' | 'tr' | 'en';
  onExploreClick: () => void;
}

export default function HeroSection({ restaurant, lang, onExploreClick }: HeroSectionProps) {
  const content = {
    ar: {
      subtitle: "مرحباً بكم في تجربة طهي فاخرة",
      title: "أطباقنا تحضر بشغف لتناسب ذوقكم الرفيع",
      cta: "استكشف القائمة"
    },
    tr: {
      subtitle: "Seçkin Lezzetlerimize Hoş Geldiniz",
      title: "Ustalıkla Hazırlanan Eşsiz Tarifler",
      cta: "Menüyü Keşfet"
    },
    en: {
      subtitle: "Welcome to Premium Culinary Delights",
      title: "Crafted with Passion for Distinguished Tastes",
      cta: "Explore Menu"
    }
  };

  return (
    <section 
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Dark Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: "url('/hero_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0c] via-[#0d0d0c]/70 to-[#0d0d0c]/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,#0d0d0c_80%)]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
        
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#d4af37]/35 bg-[#161614]/30 backdrop-blur-sm text-[#d4af37] shadow-xl shadow-[#d4af37]/5 overflow-hidden"
        >
          <Image 
            src="/logo.png" 
            alt={restaurant.name[lang]} 
            width={80} 
            height={80} 
            className="object-cover w-full h-full p-0.5"
          />
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-xs sm:text-sm font-light tracking-widest text-[#c5a880] uppercase mb-4"
        >
          {content[lang].subtitle}
        </motion.p>

        {/* Animated Slogan Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#f4f2ee] leading-tight mb-8 max-w-2xl px-4"
        >
          {restaurant.name[lang]}
        </motion.h1>

        {/* Slogan Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-sm sm:text-lg font-light text-[#a69f95] max-w-xl leading-relaxed mb-10 px-4"
        >
          {content[lang].title}
        </motion.p>

        {/* Explore Button */}
        <motion.button
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          onClick={onExploreClick}
          className="group relative px-10 py-4 text-sm font-light tracking-wider rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38f2d] text-[#0d0d0c] hover:brightness-110 shadow-lg shadow-[#d4af37]/15 active:scale-95 transition-all duration-300 flex items-center gap-2"
        >
          <span>{content[lang].cta}</span>
          <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1 duration-300" />
        </motion.button>
      </div>

      {/* Downward Navigation Pointer (Pulsing Arrow) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <span className="text-[10px] tracking-widest text-[#a69f95]/50 uppercase mb-2">
          {lang === 'ar' ? 'اسحب للأسفل' : lang === 'tr' ? 'Kaydırın' : 'Scroll Down'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="cursor-pointer p-2 bg-[#161614]/30 border border-white/[0.05] rounded-full backdrop-blur-sm"
          onClick={onExploreClick}
        >
          <ChevronDown className="h-4 w-4 text-[#c5a880]" />
        </motion.div>
      </div>
    </section>
  );
}
