'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Product } from '@/types/menu';
import { Language } from './LanguageSwitcher';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, lang, onSelect }: ProductCardProps) {
  const isRtl = lang === 'ar';
  
  // Localized texts
  const labels = {
    ar: { askForPrice: "إسأل عن السعر", outOfStock: "نفدت الكمية", bestseller: "الأكثر مبيعاً", new: "جديد" },
    tr: { askForPrice: "Fiyat Sorunuz", outOfStock: "Tükendi", bestseller: "Çok Satan", new: "Yeni" },
    en: { askForPrice: "Ask for Price", outOfStock: "Out of Stock", bestseller: "Best Seller", new: "New" }
  };

  const hasDiscount = typeof product.price === 'number' && typeof product.oldPrice === 'number' && product.oldPrice > product.price;

  // Render spicy indicators
  const renderSpicy = () => {
    if (!product.spicyLevel || product.spicyLevel <= 0) return null;
    return (
      <div className="flex items-center gap-0.5 text-red-500 bg-red-950/40 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px]" title={`Spicy Level: ${product.spicyLevel}`}>
        {Array.from({ length: Math.min(product.spicyLevel, 3) }).map((_, i) => (
          <Flame key={i} className="h-3 w-3 fill-current shrink-0" />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(product)}
      className={`group cursor-pointer flex flex-col h-full bg-[#161614]/40 hover:bg-[#161614]/80 border border-[#d4af37]/10 hover:border-[#d4af37]/35 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300 ${
        !product.available ? 'opacity-80' : ''
      }`}
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      {/* Product Image Wrapper */}
      <div className="relative w-full aspect-[4/3] bg-[#0d0d0c] overflow-hidden">
        {/* Badges top left/right */}
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap gap-1.5 justify-start">
          {product.bestSeller && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-[#d4af37] text-[#0d0d0c] shadow-md">
              {labels[lang].bestseller}
            </span>
          )}
          {product.new && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-[#b38f2d] text-[#f4f2ee] shadow-md">
              {labels[lang].new}
            </span>
          )}
          {renderSpicy()}
        </div>

        {/* Next.js Optimized Image with Hover Zoom */}
        <Image
          src={product.media[0]?.type === 'image' ? product.media[0].url : '/placeholder-food.jpg'}
          alt={product.name[lang] || 'Food item'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            !product.available ? 'grayscale contrast-75' : ''
          }`}
          loading="lazy"
        />

        {/* Unavailable overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs uppercase font-semibold tracking-widest px-4 py-2 border border-red-500/35 bg-red-950/70 text-red-400 rounded-lg shadow-xl animate-pulse">
              {labels[lang].outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Header name and price */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif font-medium text-[#f4f2ee] text-base sm:text-lg group-hover:text-[#d4af37] transition-colors leading-tight">
              {product.name[lang]}
            </h3>
            
            {/* Price Badge */}
            <div className="flex flex-col items-end shrink-0">
              {product.price === null ? (
                <span className="text-xs font-light text-[#c5a880] tracking-wide whitespace-nowrap bg-[#c5a880]/10 px-2.5 py-1 border border-[#c5a880]/15 rounded-md">
                  {labels[lang].askForPrice}
                </span>
              ) : (
                <div className="flex flex-col items-end">
                  {hasDiscount && (
                    <span className="text-xs text-[#a69f95] line-through font-sans font-light mb-0.5 leading-none">
                      {product.oldPrice} {product.currency}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-medium font-sans text-[#d4af37]">
                    {product.price} <span className="text-[10px] font-light text-[#c5a880]">{product.currency}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description line clamp */}
          {product.description?.[lang] && (
            <p className="text-xs sm:text-sm font-light text-[#a69f95] line-clamp-2 leading-relaxed mb-4">
              {product.description[lang]}
            </p>
          )}
        </div>

        {/* Tags footer */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.03]">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-sans font-light text-[#a69f95] bg-[#161614] border border-white/[0.04] px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
