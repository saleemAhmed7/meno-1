'use client';

import React, { useState, useEffect } from 'react';
import { X, Flame, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/menu';
import { Language } from './LanguageSwitcher';

interface ProductDetailModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
  whatsappNumber: string;
}

export default function ProductDetailModal({
  product,
  lang,
  onClose,
  whatsappNumber
}: ProductDetailModalProps) {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  // Reset active index when product changes
  useEffect(() => {
    setActiveMediaIdx(0);
  }, [product]);

  // Lock scroll on background when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const isRtl = lang === 'ar';
  
  const labels = {
    ar: {
      askForPrice: "إسأل عن السعر",
      outOfStock: "نفدت الكمية",
      orderWhatsApp: "اطلب الآن عبر الواتساب",
      spicyLevel: "مستوى الحار",
      notSpicy: "غير حار",
      mild: "حار قليل",
      medium: "حار متوسط",
      hot: "حار جداً",
      hello: "مرحباً، أود طلب المنتج التالي من قائمة الطعام:",
      price: "السعر",
      bestseller: "الأكثر مبيعاً",
      new: "جديد"
    },
    tr: {
      askForPrice: "Fiyat Sorunuz",
      outOfStock: "Tükendi",
      orderWhatsApp: "WhatsApp ile Sipariş Et",
      spicyLevel: "Acı Derecesi",
      notSpicy: "Acısız",
      mild: "Az Acılı",
      medium: "Orta Acılı",
      hot: "Çok Acılı",
      hello: "Merhaba, menüden şu ürünü sipariş etmek istiyorum:",
      price: "Fiyat",
      bestseller: "Çok Satan",
      new: "Yeni"
    },
    en: {
      askForPrice: "Ask for Price",
      outOfStock: "Out of Stock",
      orderWhatsApp: "Order on WhatsApp",
      spicyLevel: "Spicy Level",
      notSpicy: "Not Spicy",
      mild: "Mild",
      medium: "Medium",
      hot: "Very Spicy",
      hello: "Hello, I would like to order the following item from the menu:",
      price: "Price",
      bestseller: "Best Seller",
      new: "New"
    }
  };

  const hasDiscount = typeof product.price === 'number' && typeof product.oldPrice === 'number' && product.oldPrice > product.price;

  const getSpicyText = (level?: number) => {
    if (!level || level <= 0) return labels[lang].notSpicy;
    if (level === 1) return labels[lang].mild;
    if (level === 2) return labels[lang].medium;
    return labels[lang].hot;
  };

  // Build the WhatsApp URL
  const getWhatsAppUrl = () => {
    const cleanNumber = whatsappNumber.replace(/\+/g, '').replace(/\s/g, '');
    const priceText = product.price === null 
      ? labels[lang].askForPrice 
      : `${product.price} ${product.currency}`;
      
    const textMessage = `${labels[lang].hello}
*${product.name[lang]}*
${labels[lang].price}: ${priceText}`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIdx((prev) => (prev + 1) % product.media.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMediaIdx((prev) => (prev - 1 + product.media.length) % product.media.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Modal Window Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#161614]/95 border border-[#d4af37]/20 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 z-30 p-2.5 rounded-full bg-black/60 border border-white/[0.08] hover:bg-[#d4af37]/20 text-[#f4f2ee] hover:text-[#d4af37] active:scale-90 transition-all duration-200 ${
              isRtl ? 'left-4' : 'right-4'
            }`}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Media Slider (Left Column) */}
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[450px] bg-black overflow-hidden flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait">
              {product.media[activeMediaIdx]?.type === 'video' ? (
                <motion.video
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                  src={product.media[activeMediaIdx].url}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                />
              ) : (
                <motion.div
                  key={activeMediaIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.media[activeMediaIdx]?.url || '/placeholder-food.jpg'}
                    alt={product.name[lang]}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Slider arrows */}
            {product.media.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-4 p-2 rounded-full bg-black/50 border border-white/[0.05] hover:bg-[#d4af37] text-white hover:text-black transition-colors z-20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-4 p-2 rounded-full bg-black/50 border border-white/[0.05] hover:bg-[#d4af37] text-white hover:text-black transition-colors z-20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dot markers */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {product.media.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setActiveMediaIdx(idx); }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeMediaIdx ? 'w-5 bg-[#d4af37]' : 'w-2 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details Column (Right Column) */}
          <div
            className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-none"
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            <div>
              {/* Product Badges (Featured/New) */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.bestSeller && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#d4af37] text-[#0d0d0c]">
                    {labels[lang].bestseller}
                  </span>
                )}
                {product.new && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#b38f2d] text-[#f4f2ee]">
                    {labels[lang].new}
                  </span>
                )}
              </div>

              {/* Title and pricing */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4 pb-4 border-b border-white/[0.04]">
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#f4f2ee] leading-tight">
                  {product.name[lang]}
                </h2>

                <div className="flex flex-col sm:items-end">
                  {product.price === null ? (
                    <span className="text-sm font-light text-[#c5a880] tracking-wide whitespace-nowrap bg-[#c5a880]/10 px-3 py-1 border border-[#c5a880]/15 rounded-md">
                      {labels[lang].askForPrice}
                    </span>
                  ) : (
                    <div className="flex flex-col sm:items-end">
                      {hasDiscount && (
                        <span className="text-sm text-[#a69f95] line-through font-sans font-light mb-1 leading-none">
                          {product.oldPrice} {product.currency}
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl font-serif text-[#d4af37] leading-none">
                        {product.price} <span className="text-xs font-light text-[#c5a880]">{product.currency}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed spicy level */}
              {product.spicyLevel !== undefined && product.spicyLevel > 0 && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-[#a69f95] font-light">{labels[lang].spicyLevel}:</span>
                  <div className="flex items-center gap-0.5 text-red-500 bg-red-950/40 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    <Flame className="h-4 w-4 fill-current shrink-0 mr-1" />
                    <span>{getSpicyText(product.spicyLevel)}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description?.[lang] && (
                <div className="mb-6">
                  <p className="text-sm sm:text-base font-light text-[#a69f95] leading-relaxed">
                    {product.description[lang]}
                  </p>
                </div>
              )}

              {/* Tags list */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs font-sans font-light text-[#a69f95] bg-[#161614] border border-white/[0.04] px-2.5 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions CTA (WhatsApp Button) */}
            <div className="pt-6 border-t border-white/[0.04] mt-auto">
              {product.available ? (
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f2d] hover:brightness-110 text-[#0d0d0c] font-medium shadow-lg shadow-[#d4af37]/10 active:scale-[0.98] transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>{labels[lang].orderWhatsApp}</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full px-8 py-3.5 rounded-xl bg-white/5 border border-white/[0.05] text-[#a69f95] font-light cursor-not-allowed text-center uppercase tracking-widest text-sm"
                >
                  {labels[lang].outOfStock}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
