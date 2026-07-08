'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Product, Restaurant } from '@/types/menu';

interface HeroSlide {
  product: Product;
  categoryId: string;
}

interface HeroSectionProps {
  restaurant: Restaurant;
  lang: 'ar' | 'tr' | 'en';
  featuredProducts: HeroSlide[];
  onScrollToProduct?: (categoryId: string, productId: string) => void;
}

export default function HeroSection({ restaurant, lang, featuredProducts }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [featuredProducts.length]);

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
      <section id="home" className="relative overflow-hidden bg-[#f7efe2] pt-20 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          <div className="relative overflow-hidden rounded-[36px] border border-[#c79c4f]/20 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.12)]">
            <Image src="/placeholder-food.jpg" alt={restaurant.name[lang]} fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" priority />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,34,25,0.2),rgba(47,34,25,0.7))]" />
          </div>
        </div>
      </section>
    );
  }

  const imageUrl = currentSlide.product.media[0]?.type === 'image' ? currentSlide.product.media[0].url : '/placeholder-food.jpg';

  return (
    <section id="home" className="relative overflow-hidden bg-[#f7efe2] pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pb-8">
        <div className="relative overflow-hidden rounded-[36px] border border-[#c79c4f]/20 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.12)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.product.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[420px] w-full sm:h-[520px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Image src={imageUrl} alt={currentSlide.product.name[lang] || 'Featured dish'} fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" priority={activeSlide === 0} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,34,25,0.2),rgba(47,34,25,0.75))]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f8e6c0] backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{lang === 'ar' ? 'مختارات اليوم' : lang === 'tr' ? 'Bugünün seçkileri' : 'Today’s picks'}</span>
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
      </div>
    </section>
  );
}
