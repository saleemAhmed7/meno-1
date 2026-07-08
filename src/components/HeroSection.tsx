'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { Product, Restaurant } from '@/types/menu';

interface HeroSlide {
  product: Product;
  categoryId: string;
}

interface HeroSectionProps {
  restaurant: Restaurant;
  lang: 'ar' | 'tr' | 'en';
  featuredProducts: HeroSlide[];
  onScrollToProduct: (categoryId: string, productId: string) => void;
}

export default function HeroSection({ restaurant, lang, featuredProducts, onScrollToProduct }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [featuredProducts.length]);

  const content = {
    ar: {
      badge: 'مختارات اليوم',
      title: 'أطباق مميزة تقدمها Arab Cafe',
      description: 'تجربة فاخرة من الأطباق العربية المميزة والأجواء الهادئة.',
      cta: 'استكشف الطبق',
      note: 'تبديل تلقائي • سحب للهواتف'
    },
    tr: {
      badge: 'Bugünün Öne Çıkanları',
      title: 'Arab Cafe’nin seçkin lezzetleri',
      description: 'Özenle hazırlanan Arap mutfağı tatları ve sakin bir deneyim.',
      cta: 'Yemeği İncele',
      note: 'Otomatik geçiş • Mobil kaydırma'
    },
    en: {
      badge: 'Today’s highlights',
      title: 'Signature dishes from Arab Cafe',
      description: 'A refined journey through authentic Arabic flavours and warm hospitality.',
      cta: 'Explore dish',
      note: 'Auto-rotating • Swipe-ready'
    }
  };

  const currentSlide = featuredProducts[activeSlide];

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStart === null) return;

    const delta = event.changedTouches[0].clientX - touchStart;

    if (delta > 60) {
      setActiveSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    } else if (delta < -60) {
      setActiveSlide((prev) => (prev + 1) % featuredProducts.length);
    }

    setTouchStart(null);
  };

  if (!featuredProducts.length) {
    return (
      <section id="home" className="relative overflow-hidden bg-[#f7efe2] pt-24 sm:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_45%)]" />
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
          <div className="relative overflow-hidden rounded-[36px] border border-[#c79c4f]/20 bg-[#fcf8f1] p-8 shadow-[0_24px_70px_rgba(79,52,33,0.12)] sm:p-10 lg:p-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8b632c]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{content[lang].badge}</span>
              </div>
              <h1 className="font-serif text-3xl font-light leading-tight text-[#2f2219] sm:text-4xl lg:text-5xl">
                {restaurant.name[lang]}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#634b3a] sm:text-lg">
                {content[lang].description}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const imageUrl = currentSlide.product.media[0]?.type === 'image' ? currentSlide.product.media[0].url : '/placeholder-food.jpg';

  return (
    <section id="home" className="relative overflow-hidden bg-[#f7efe2] pt-24 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_45%)]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:flex-row lg:items-stretch lg:gap-10 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="relative flex-1 overflow-hidden rounded-[36px] border border-[#c79c4f]/20 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.12)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.product.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[420px] w-full sm:h-[500px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image src={imageUrl} alt={currentSlide.product.name[lang] || 'Featured dish'} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" priority={activeSlide === 0} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,34,25,0.72)_0%,rgba(47,34,25,0.28)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%)]" />

              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8 lg:p-10">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f8e6c0] backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{content[lang].badge}</span>
                </div>

                <h1 className="max-w-2xl font-serif text-3xl font-light leading-tight text-[#fcf8f1] sm:text-4xl lg:text-5xl">
                  {currentSlide.product.name[lang]}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-8 text-[#f4e2c5] sm:text-base">
                  {currentSlide.product.description?.[lang] || content[lang].description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onScrollToProduct(currentSlide.categoryId, currentSlide.product.id)}
                    className="flex items-center gap-2 rounded-full bg-[#c79c4f] px-5 py-3 text-sm font-semibold tracking-[0.2em] text-[#2f2219] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8ae60]"
                  >
                    <span>{content[lang].cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-[#f8e6c0] backdrop-blur-sm">
                    {content[lang].note}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#c79c4f]/20 bg-[#fcf8f1]/85 px-3 py-2 shadow-sm backdrop-blur">
            {featuredProducts.map((item, index) => (
              <button
                key={item.product.id}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-7 bg-[#2f2219]' : 'w-2.5 bg-[#c79c4f]/60'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col justify-between gap-4 rounded-[36px] border border-[#c79c4f]/20 bg-[linear-gradient(145deg,#fcf8f1_0%,#f4e4c9_100%)] p-6 shadow-[0_20px_60px_rgba(79,52,33,0.08)] sm:p-8 lg:min-h-[500px] lg:justify-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8b632c]">
              {restaurant.name[lang]}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light leading-tight text-[#2f2219] sm:text-4xl">
              {content[lang].title}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-[#634b3a]">
              {content[lang].description}
            </p>
          </div>

          <div className="rounded-[28px] border border-[#c79c4f]/20 bg-[#fff9ee]/90 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#2f2219]">{lang === 'ar' ? 'تجربة فاخرة' : lang === 'tr' ? 'Şık bir deneyim' : 'Luxury experience'}</p>
                <p className="mt-1 text-sm text-[#7a5941]">{lang === 'ar' ? 'أطباق عربية مميزة وأجواء مريحة' : lang === 'tr' ? 'Seçkin Arap lezzetleri ve rahat atmosfer' : 'Elegant Arabic flavours in a warm setting'}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2f2219] text-[#fcf8f1]">
                <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
