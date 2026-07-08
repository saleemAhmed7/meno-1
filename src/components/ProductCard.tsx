'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { Product } from '@/types/menu';
import { Language } from './LanguageSwitcher';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, lang, onSelect }: ProductCardProps) {
  const isRtl = lang === 'ar';

  const labels = {
    ar: { askForPrice: 'إسأل عن السعر', outOfStock: 'نفدت الكمية', bestseller: 'الأكثر مبيعاً', new: 'جديد' },
    tr: { askForPrice: 'Fiyat Sorunuz', outOfStock: 'Tükendi', bestseller: 'Çok Satan', new: 'Yeni' },
    en: { askForPrice: 'Ask for Price', outOfStock: 'Out of Stock', bestseller: 'Best Seller', new: 'New' }
  };

  const hasDiscount = typeof product.price === 'number' && typeof product.oldPrice === 'number' && product.oldPrice > product.price;

  const renderSpicy = () => {
    if (!product.spicyLevel || product.spicyLevel <= 0) return null;
    return (
      <div className="flex items-center gap-0.5 rounded-full border border-[#c79c4f]/25 bg-[#fff9ee] px-2 py-1 text-[10px] font-semibold text-[#8b632c]" title={`Spicy Level: ${product.spicyLevel}`}>
        {Array.from({ length: Math.min(product.spicyLevel, 3) }).map((_, i) => (
          <Flame key={i} className="h-3 w-3 shrink-0 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={() => onSelect(product)}
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[#c79c4f]/15 bg-[#fcf8f1] shadow-[0_18px_45px_rgba(79,52,33,0.08)] transition-all duration-300 hover:border-[#c79c4f]/30 hover:shadow-[0_24px_60px_rgba(79,52,33,0.14)] ${!product.available ? 'opacity-90' : ''}`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#fff9ee]">
        <div className="absolute left-3 right-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {product.bestSeller && (
            <span className="rounded-full bg-[#2f2219] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fcf8f1] shadow-sm">
              {labels[lang].bestseller}
            </span>
          )}
          {product.new && (
            <span className="rounded-full bg-[#c79c4f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2f2219] shadow-sm">
              {labels[lang].new}
            </span>
          )}
          {renderSpicy()}
        </div>

        <Image
          src={product.media[0]?.type === 'image' ? product.media[0].url : '/placeholder-food.jpg'}
          alt={product.name[lang] || 'Food item'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${!product.available ? 'grayscale contrast-75' : ''}`}
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2f2219]/70 to-transparent" />

        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#fcf8f1] backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          {product.available ? 'Available' : labels[lang].outOfStock}
        </div>

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2f2219]/65 backdrop-blur-[2px]">
            <span className="rounded-full border border-[#ef4444]/30 bg-[#7f1d1d]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#fecaca]">
              {labels[lang].outOfStock}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-tight text-[#2f2219] transition-colors group-hover:text-[#8b632c] sm:text-lg">
              {product.name[lang]}
            </h3>

            <div className="shrink-0">
              {product.price === null ? (
                <span className="rounded-full border border-[#c79c4f]/25 bg-[#fff9ee] px-2.5 py-1 text-[11px] font-medium tracking-[0.2em] text-[#8b632c]">
                  {labels[lang].askForPrice}
                </span>
              ) : (
                <div className="flex flex-col items-end">
                  {hasDiscount && (
                    <span className="mb-0.5 text-xs font-light text-[#8b632c] line-through">
                      {product.oldPrice} {product.currency}
                    </span>
                  )}
                  <span className="rounded-full bg-[#2f2219] px-3 py-1.5 text-sm font-semibold text-[#fcf8f1]">
                    {product.price} <span className="text-[10px] font-light">{product.currency}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {product.description?.[lang] && (
            <p className="mb-4 text-sm leading-7 text-[#7a5941]">
              {product.description[lang]}
            </p>
          )}
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-[#c79c4f]/12 pt-3">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="rounded-full border border-[#c79c4f]/15 bg-[#fff9ee] px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-[#8b632c]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
