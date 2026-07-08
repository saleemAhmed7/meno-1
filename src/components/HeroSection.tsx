'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Sparkles } from 'lucide-react';
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
      subtitle: 'مرحباً بكم في تجربة طهي فاخرة',
      title: 'أطباقنا تحضر بشغف لتناسب ذوقكم الرفيع',
      cta: 'استكشف القائمة',
      note: 'مأكولات مميزة • أجواء هادئة • خدمة شخصية'
    },
    tr: {
      subtitle: 'Seçkin Lezzetlerimize Hoş Geldiniz',
      title: 'Ustalıkla Hazırlanan Eşsiz Tarifler',
      cta: 'Menüyü Keşfet',
      note: 'Özel tatlar • Sakin atmosfer • Kişisel servis'
    },
    en: {
      subtitle: 'Welcome to Premium Culinary Delights',
      title: 'Crafted with Passion for Distinguished Tastes',
      cta: 'Explore Menu',
      note: 'Signature dishes • Cozy ambience • Thoughtful service'
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f7efe2]"
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-1000"
        style={{ backgroundImage: "url('/hero_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(252,248,241,0.95)_0%,rgba(247,239,226,0.82)_35%,rgba(79,52,33,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_50%)]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#c79c4f]/30 bg-[#fcf8f1]/80 shadow-[0_20px_55px_rgba(79,52,33,0.16)] backdrop-blur"
        >
          <Image src="/logo.png" alt={restaurant.name[lang]} width={90} height={90} className="h-full w-full object-cover p-1" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c79c4f]/20 bg-[#fcf8f1]/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8b632c]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{content[lang].subtitle}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 max-w-3xl px-2 font-serif text-4xl font-light leading-[1.08] text-[#2f2219] sm:text-5xl md:text-6xl"
        >
          {restaurant.name[lang]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mb-8 max-w-2xl px-2 text-base leading-8 text-[#634b3a] sm:text-lg"
        >
          {content[lang].title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
          className="mb-6 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            onClick={onExploreClick}
            className="group flex items-center gap-2 rounded-full bg-[#2f2219] px-7 py-3.5 text-sm font-semibold tracking-[0.2em] text-[#fcf8f1] shadow-[0_18px_40px_rgba(47,34,25,0.18)] hover:-translate-y-0.5 hover:bg-[#4f3421]"
          >
            <span>{content[lang].cta}</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
          <span className="rounded-full border border-[#c79c4f]/25 bg-[#fcf8f1]/70 px-4 py-2 text-sm text-[#7a5941]">
            {content[lang].note}
          </span>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center">
        <span className="mb-2 text-[10px] uppercase tracking-[0.34em] text-[#7a5941]/70">
          {lang === 'ar' ? 'اسحب للأسفل' : lang === 'tr' ? 'Kaydırın' : 'Scroll Down'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="cursor-pointer rounded-full border border-[#c79c4f]/25 bg-[#fcf8f1]/70 p-2 shadow-sm backdrop-blur"
          onClick={onExploreClick}
        >
          <ChevronDown className="h-4 w-4 text-[#8b632c]" />
        </motion.div>
      </div>
    </section>
  );
}
