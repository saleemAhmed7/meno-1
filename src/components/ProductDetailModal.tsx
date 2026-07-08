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

export default function ProductDetailModal({ product, lang, onClose, whatsappNumber }: ProductDetailModalProps) {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  useEffect(() => {
    setActiveMediaIdx(0);
  }, [product]);

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
      askForPrice: 'إسأل عن السعر',
      outOfStock: 'نفدت الكمية',
      orderWhatsApp: 'اطلب الآن عبر الواتساب',
      spicyLevel: 'مستوى الحار',
      notSpicy: 'غير حار',
      mild: 'حار قليل',
      medium: 'حار متوسط',
      hot: 'حار جداً',
      hello: 'مرحباً، أود طلب المنتج التالي من قائمة الطعام:',
      price: 'السعر',
      bestseller: 'الأكثر مبيعاً',
      new: 'جديد'
    },
    tr: {
      askForPrice: 'Fiyat Sorunuz',
      outOfStock: 'Tükendi',
      orderWhatsApp: 'WhatsApp ile Sipariş Et',
      spicyLevel: 'Acı Derecesi',
      notSpicy: 'Acısız',
      mild: 'Az Acılı',
      medium: 'Orta Acılı',
      hot: 'Çok Acılı',
      hello: 'Merhaba, menüden şu ürünü sipariş etmek istiyorum:',
      price: 'Fiyat',
      bestseller: 'Çok Satan',
      new: 'Yeni'
    },
    en: {
      askForPrice: 'Ask for Price',
      outOfStock: 'Out of Stock',
      orderWhatsApp: 'Order on WhatsApp',
      spicyLevel: 'Spicy Level',
      notSpicy: 'Not Spicy',
      mild: 'Mild',
      medium: 'Medium',
      hot: 'Very Spicy',
      hello: 'Hello, I would like to order the following item from the menu:',
      price: 'Price',
      bestseller: 'Best Seller',
      new: 'New'
    }
  };

  const hasDiscount = typeof product.price === 'number' && typeof product.oldPrice === 'number' && product.oldPrice > product.price;

  const getSpicyText = (level?: number) => {
    if (!level || level <= 0) return labels[lang].notSpicy;
    if (level === 1) return labels[lang].mild;
    if (level === 2) return labels[lang].medium;
    return labels[lang].hot;
  };

  const getWhatsAppUrl = () => {
    const cleanNumber = whatsappNumber.replace(/\+/g, '').replace(/\s/g, '');
    const priceText = product.price === null ? labels[lang].askForPrice : `${product.price} ${product.currency}`;

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.72 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#2f2219]/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-[#c79c4f]/20 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.16)] md:flex-row"
        >
          <button
            onClick={onClose}
            className={`absolute top-4 z-30 rounded-full border border-[#c79c4f]/20 bg-[#fff9ee]/90 p-2.5 text-[#4f3421] shadow-sm transition-all hover:bg-[#2f2219] hover:text-[#fcf8f1] ${isRtl ? 'left-4' : 'right-4'}`}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden bg-[#fff9ee] md:w-[46%] md:aspect-auto md:min-h-[480px]">
            <AnimatePresence mode="wait">
              {product.media[activeMediaIdx]?.type === 'video' ? (
                <motion.video
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full object-cover"
                  src={product.media[activeMediaIdx].url}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                />
              ) : (
                <motion.div key={activeMediaIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="relative h-full w-full">
                  <Image src={product.media[activeMediaIdx]?.url || '/placeholder-food.jpg'} alt={product.name[lang]} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
                </motion.div>
              )}
            </AnimatePresence>

            {product.media.length > 1 && (
              <>
                <button onClick={prevMedia} className="absolute left-4 z-20 rounded-full border border-white/20 bg-[#2f2219]/60 p-2 text-[#fcf8f1] backdrop-blur-sm hover:bg-[#c79c4f] hover:text-[#2f2219]">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextMedia} className="absolute right-4 z-20 rounded-full border border-white/20 bg-[#2f2219]/60 p-2 text-[#fcf8f1] backdrop-blur-sm hover:bg-[#c79c4f] hover:text-[#2f2219]">
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
                  {product.media.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMediaIdx(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === activeMediaIdx ? 'w-5 bg-[#c79c4f]' : 'w-2 bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {product.bestSeller && (
                  <span className="rounded-full bg-[#2f2219] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fcf8f1]">
                    {labels[lang].bestseller}
                  </span>
                )}
                {product.new && (
                  <span className="rounded-full bg-[#c79c4f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2f2219]">
                    {labels[lang].new}
                  </span>
                )}
              </div>

              <div className="mb-4 flex flex-col justify-between gap-4 border-b border-[#c79c4f]/15 pb-4 sm:flex-row sm:items-baseline">
                <h2 className="font-serif text-2xl font-light leading-tight text-[#2f2219] sm:text-3xl">
                  {product.name[lang]}
                </h2>

                <div className="flex flex-col sm:items-end">
                  {product.price === null ? (
                    <span className="rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] px-3 py-1.5 text-sm font-medium tracking-[0.16em] text-[#8b632c]">
                      {labels[lang].askForPrice}
                    </span>
                  ) : (
                    <div className="flex flex-col sm:items-end">
                      {hasDiscount && (
                        <span className="mb-1 text-sm font-light text-[#8b632c] line-through">
                          {product.oldPrice} {product.currency}
                        </span>
                      )}
                      <span className="text-xl font-semibold text-[#2f2219] sm:text-2xl">
                        {product.price} <span className="text-xs font-light text-[#8b632c]">{product.currency}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {product.spicyLevel !== undefined && product.spicyLevel > 0 && (
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <span className="font-medium text-[#7a5941]">{labels[lang].spicyLevel}:</span>
                  <div className="flex items-center gap-1 rounded-full border border-[#ef4444]/20 bg-[#fff1f2] px-3 py-1 text-xs font-medium text-[#b91c1c]">
                    <Flame className="mr-1 h-4 w-4 fill-current" />
                    <span>{getSpicyText(product.spicyLevel)}</span>
                  </div>
                </div>
              )}

              {product.description?.[lang] && (
                <div className="mb-6">
                  <p className="text-sm leading-8 text-[#7a5941] sm:text-base">
                    {product.description[lang]}
                  </p>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="rounded-full border border-[#c79c4f]/15 bg-[#fff9ee] px-2.5 py-1 text-xs font-medium tracking-[0.16em] text-[#8b632c]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto border-t border-[#c79c4f]/15 pt-6">
              {product.available ? (
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#2f2219] px-8 py-3.5 text-sm font-semibold tracking-[0.2em] text-[#fcf8f1] shadow-[0_18px_40px_rgba(47,34,25,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#4f3421]"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{labels[lang].orderWhatsApp}</span>
                </a>
              ) : (
                <button disabled className="w-full cursor-not-allowed rounded-full border border-[#c79c4f]/15 bg-[#fff9ee] px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-[#7a5941]">
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
