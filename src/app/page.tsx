'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Clock, Phone, MessageSquare } from 'lucide-react';

import { Category, Product, Restaurant, Branch } from '@/types/menu';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import InstallPWA from '@/components/InstallPWA';
import SchemaOrg from '@/components/SchemaOrg';
import { Language } from '@/components/LanguageSwitcher';

export default function Home() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Load configuration and register service worker
  useEffect(() => {
    // 1. Load language from localStorage
    const savedLang = localStorage.getItem('khaled_menu_lang') as Language;
    if (savedLang && ['ar', 'tr', 'en'].includes(savedLang)) {
      setCurrentLang(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }

    // 2. Fetch Restaurant Profile & Menu categories
    const loadData = async () => {
      try {
        const [resRest, resMenu] = await Promise.all([
          fetch('/restaurant.json'),
          fetch('/api/menu')
        ]);
        
        const restData = await resRest.json();
        const menuData = await resMenu.json();
        
        setRestaurant(restData);
        setCategories(menuData.categories || []);
        
        if (restData.branches && restData.branches.length > 0) {
          setSelectedBranch(restData.branches[0]);
        }
      } catch (err) {
        console.error('Failed to load menu database:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 3. Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => console.log('PWA ServiceWorker registered scope:', reg.scope),
          (err) => console.error('PWA ServiceWorker registration failed:', err)
        );
      });
    }
  }, []);

  // Update HTML lang and direction dynamically on language toggle
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('arab_cafe_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  // Scroll active section observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe categories and home section
    const targets = document.querySelectorAll('section[id]');
    targets.forEach((t) => observer.observe(t));

    return () => {
      targets.forEach((t) => observer.unobserve(t));
    };
  }, [loading, categories]);

  if (loading || !restaurant) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0d0d0c]">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-[#d4af37]" />
        <span className="mt-4 text-xs font-light tracking-widest text-[#c5a880] uppercase animate-pulse">
          Loading Arab Cafe...
        </span>
      </div>
    );
  }

  const isRtl = currentLang === 'ar';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://arab-cafe-uzungol.com';

  // Labels dictionary
  const uiTexts = {
    ar: {
      featuredTitle: "الأطباق المتميزة",
      featuredSub: "توصية الشيف الخاصة المحضرة بعناية",
      allDishes: "كل الأطباق",
      noResults: "لم يتم العثور على أطباق تطابق بحثك.",
      workingHours: "أوقات العمل",
      address: "العنوان",
      branches: "فروعنا",
      menuTitle: "قائمة الطعام",
      currency: "ل.ت"
    },
    tr: {
      featuredTitle: "Öne Çıkan Lezzetler",
      featuredSub: "Şefin özenle hazırladığı imza tabaklar",
      allDishes: "Tüm Yemekler",
      noResults: "Aramanızla eşleşen ürün bulunamadı.",
      workingHours: "Çalışma Saatleri",
      address: "Adres",
      branches: "Şubelerimiz",
      menuTitle: "Yemek Menüsü",
      currency: "TL"
    },
    en: {
      featuredTitle: "Featured Masterpieces",
      featuredSub: "Chef's special recommendations prepared with care",
      allDishes: "All Dishes",
      noResults: "No products matched your search query.",
      workingHours: "Working Hours",
      address: "Address",
      branches: "Branches",
      menuTitle: "Culinary Menu",
      currency: "TL"
    }
  };

  // 1. Extract featured products
  const featuredProducts: Product[] = [];
  categories.forEach((cat) => {
    cat.products.forEach((prod) => {
      if (prod.featured) {
        // Embed category context for category navigation inside modal
        featuredProducts.push(prod);
      }
    });
  });

  // 2. Filter products inside categories based on Search Query
  // Checks name, description, and tags
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    return categories.map((cat) => {
      const filteredProducts = cat.products.filter((prod) => {
        const nameMatch = prod.name[currentLang]?.toLowerCase().includes(query) || false;
        const descMatch = prod.description?.[currentLang]?.toLowerCase().includes(query) || false;
        const tagMatch = prod.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        return nameMatch || descMatch || tagMatch;
      });

      return {
        ...cat,
        products: filteredProducts
      };
    }).filter(cat => cat.products.length > 0); // Only return categories that have matched items
  };

  const filteredCategories = getFilteredCategories();

  const handleExploreClick = () => {
    if (categories.length > 0) {
      const firstCatElement = document.getElementById(categories[0].id);
      if (firstCatElement) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = firstCatElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none bg-[#0d0d0c] text-[#f4f2ee]">
      {/* Schema.org Search Engine Structured Markup */}
      <SchemaOrg restaurant={restaurant} siteUrl={siteUrl} />

      {/* Sticky Header Nav bar */}
      <Navbar
        categories={categories}
        activeSection={activeSection}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        restaurant={restaurant}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Welcome banner */}
      <HeroSection
        restaurant={restaurant}
        lang={currentLang}
        onExploreClick={handleExploreClick}
      />

      {/* Main Contents */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Horizontal Filter Navbar (Sleek Anchor Jumps) */}
        <div className="sticky top-[72px] z-30 py-4 bg-[#0d0d0c]/90 backdrop-blur-md border-b border-white/[0.04] mb-12 overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center gap-2 sm:gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`px-5 py-2 text-xs uppercase tracking-wider rounded-full whitespace-nowrap transition-all duration-300 border ${
              activeSection === 'home'
                ? 'bg-[#d4af37] border-[#d4af37] text-[#0d0d0c] font-medium shadow-md shadow-[#d4af37]/15'
                : 'bg-[#161614]/50 border-white/[0.05] text-[#a69f95] hover:text-[#f4f2ee]'
            }`}
          >
            {currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home'}
          </button>
          
          {categories.map((cat) => {
            const isSelected = activeSection === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const el = document.getElementById(cat.id);
                  if (el) {
                    const offset = 140; // accounted for sticky navbar + sub category filters
                    const y = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className={`px-5 py-2 text-xs whitespace-nowrap transition-all duration-300 border rounded-full ${
                  isSelected
                    ? 'bg-[#d4af37] border-[#d4af37] text-[#0d0d0c] font-semibold shadow-md shadow-[#d4af37]/15'
                    : 'bg-[#161614]/50 border-white/[0.05] text-[#a69f95] hover:text-[#f4f2ee]'
                }`}
              >
                {cat.name[currentLang]}
              </button>
            );
          })}
        </div>

        {/* --- DEDICATED FEATURED MASTERPIECES SECTION --- */}
        {featuredProducts.length > 0 && !searchQuery && (
          <section id="_featured" className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#d4af37] tracking-widest uppercase mb-2">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span>{uiTexts[currentLang].featuredTitle}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#f4f2ee] tracking-wide">
                {uiTexts[currentLang].featuredSub}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.slice(0, 3).map((prod) => (
                <ProductCard
                  key={`featured-${prod.id}`}
                  product={prod}
                  lang={currentLang}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- ALL FOOD CATEGORIES LISTS --- */}
        <div className="space-y-20">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <section
                key={cat.id}
                id={cat.id}
                className="scroll-mt-36"
              >
                {/* Category Cover Banner Header */}
                <div className="relative w-full h-[180px] sm:h-[220px] rounded-2xl md:rounded-3xl overflow-hidden mb-8 border border-[#d4af37]/10 flex items-center justify-center shadow-lg">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 opacity-40 brightness-75 transition-all duration-700"
                    style={{ backgroundImage: `url('${cat.coverImage || '/placeholder-food.jpg'}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0c] via-transparent to-black/30" />
                  
                  <div className="relative z-10 text-center px-4">
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#f4f2ee] tracking-wide shadow-text drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                      {cat.name[currentLang]}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-[#c5a880] tracking-widest uppercase mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {cat.products.length} {uiTexts[currentLang].menuTitle}
                    </p>
                  </div>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {cat.products.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      lang={currentLang}
                      onSelect={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-20 border border-white/[0.03] bg-[#161614]/30 rounded-2xl">
              <p className="text-sm font-light text-[#a69f95]">
                {uiTexts[currentLang].noResults}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Floating PWA Install Prompt */}
      <InstallPWA lang={currentLang} />

      {/* Product Detail Lightbox Modal (WhatsApp Order Drawer) */}
      <ProductDetailModal
        product={selectedProduct}
        lang={currentLang}
        onClose={() => setSelectedProduct(null)}
        whatsappNumber={selectedBranch?.whatsapp || restaurant.whatsapp}
      />

      {/* Global Page Footer */}
      <footer className="bg-[#090908] border-t border-white/[0.03] py-16 text-[#a69f95]" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Logo & Hours */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-tr from-[#d4af37] to-[#b38f2d] rounded-full flex items-center justify-center font-serif text-[#0d0d0c] font-bold text-lg">
                {restaurant.name[currentLang]?.charAt(0)}
              </div>
              <span className="font-serif font-semibold text-lg text-[#f4f2ee]">
                {restaurant.name[currentLang]}
              </span>
            </div>
            
            <div className="flex items-start gap-2 text-xs font-light leading-relaxed mt-2">
              <Clock className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#f4f2ee]/90 font-medium mb-1">{uiTexts[currentLang].workingHours}</p>
                <p className="font-sans">{restaurant.workingHours[currentLang]}</p>
              </div>
            </div>
          </div>

          {/* Branches list */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 text-xs font-light leading-relaxed">
              <MapPin className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#f4f2ee]/90 font-medium mb-2">{uiTexts[currentLang].branches}</p>
                <div className="space-y-3">
                  {restaurant.branches.map((b) => (
                    <div key={b.id} className="border-l border-white/[0.05] pl-3 py-0.5">
                      <p className="text-xs font-medium text-[#c5a880]">{b.name[currentLang]}</p>
                      <p className="text-[11px] text-[#a69f95] mt-1">{b.address[currentLang]}</p>
                      <a
                        href={b.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#d4af37] hover:underline block mt-1 font-sans"
                      >
                        {currentLang === 'ar' ? 'عرض على الخريطة' : currentLang === 'tr' ? 'Haritada Göster' : 'Show on Map'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-2 text-xs font-light leading-relaxed">
              <Phone className="h-4 w-4 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#f4f2ee]/90 font-medium mb-1">{uiTexts[currentLang].address}</p>
                <p className="mb-3">{restaurant.address[currentLang]}</p>
                
                <p className="text-[#f4f2ee]/90 font-medium mb-1">الرقم الرئيسي / Genel Numara</p>
                <p className="font-sans">{restaurant.phone}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.03] mt-12 pt-8 text-center text-[10px] font-sans font-light tracking-wider uppercase text-[#a69f95]/50">
          &copy; {new Date().getFullYear()} {restaurant.name.en}. All Rights Reserved. Designed for Arab Cafe.
        </div>
      </footer>

      {/* Official Social Media (Last Section) */}
      <section className="bg-[#080807] py-16 border-t border-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-serif text-lg text-[#d4af37] tracking-wider uppercase mb-2">
            {currentLang === 'ar' ? 'حساباتنا الرسمية' : currentLang === 'tr' ? 'Resmi Hesaplarımız' : 'Our Official Accounts'}
          </h3>
          <p className="text-xs text-[#a69f95] font-light max-w-md mx-auto mb-10">
            {currentLang === 'ar' ? 'تابعونا لتصلكم أحدث العروض والفعاليات في أوزنجول' : currentLang === 'tr' ? 'Uzungöl\'deki en son fırsatları ve etkinlikleri takip edin' : 'Follow us to stay updated with latest offers and events in Uzungöl'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {restaurant.tiktokLink && (
              <a
                href={restaurant.tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] hover:bg-[#d4af37]/5 border border-white/[0.04] hover:border-[#d4af37]/30 shadow-lg hover:shadow-[#d4af37]/5 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-full bg-white/[0.02] group-hover:bg-[#d4af37]/10 flex items-center justify-center text-[#c5a880] group-hover:text-[#d4af37] transition-colors duration-500 mb-4 border border-white/[0.05] group-hover:border-[#d4af37]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </div>
                <span className="text-xs text-[#a69f95] group-hover:text-[#f4f2ee] font-sans transition-colors duration-300">
                  {restaurant.tiktok ? `@${restaurant.tiktok}` : ''}
                </span>
                <span className="mt-3 px-4 py-1.5 rounded-full bg-white/[0.03] group-hover:bg-[#d4af37] text-[10px] text-[#c5a880] group-hover:text-[#0d0d0c] font-sans font-medium uppercase tracking-wider transition-all duration-500">
                  {currentLang === 'ar' ? 'تابعنا على تيك توك' : currentLang === 'tr' ? 'TikTok\'ta Takip Et' : 'Follow on TikTok'}
                </span>
              </a>
            )}

            {restaurant.snapchatLink && (
              <a
                href={restaurant.snapchatLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.01] hover:bg-[#d4af37]/5 border border-white/[0.04] hover:border-[#d4af37]/30 shadow-lg hover:shadow-[#d4af37]/5 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-full bg-white/[0.02] group-hover:bg-[#d4af37]/10 flex items-center justify-center text-[#c5a880] group-hover:text-[#d4af37] transition-colors duration-500 mb-4 border border-white/[0.05] group-hover:border-[#d4af37]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 3a6 6 0 0 0-6 6c0 3.27 1.5 5 2.5 6a1 1 0 0 1 .3.7l-.3 1.5a1 1 0 0 0 1 1.2h5a1 1 0 0 0 1-1.2l-.3-1.5a1 1 0 0 1 .3-.7c1-1 2.5-2.73 2.5-6a6 6 0 0 0-6-6z" />
                    <path d="M18.3 19a9.7 9.7 0 0 1-12.6 0" />
                  </svg>
                </div>
                <span className="text-xs text-[#a69f95] group-hover:text-[#f4f2ee] font-sans transition-colors duration-300">
                  {restaurant.snapchat}
                </span>
                <span className="mt-3 px-4 py-1.5 rounded-full bg-white/[0.03] group-hover:bg-[#d4af37] text-[10px] text-[#c5a880] group-hover:text-[#0d0d0c] font-sans font-medium uppercase tracking-wider transition-all duration-500">
                  {currentLang === 'ar' ? 'تابعنا على سناب شات' : currentLang === 'tr' ? 'Snapchat\'te Takip Et' : 'Follow on Snapchat'}
                </span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
