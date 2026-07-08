'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, Phone } from 'lucide-react';

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

  useEffect(() => {
    const savedLang = localStorage.getItem('khaled_menu_lang') as Language;
    if (savedLang && ['ar', 'tr', 'en'].includes(savedLang)) {
      setCurrentLang(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }

    const loadData = async () => {
      try {
        const [resRest, resMenu] = await Promise.all([fetch('/restaurant.json'), fetch('/api/menu')]);
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

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (reg) => console.log('PWA ServiceWorker registered scope:', reg.scope),
          (err) => console.error('PWA ServiceWorker registration failed:', err)
        );
      });
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('arab_cafe_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

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
    const targets = document.querySelectorAll('section[id]');
    targets.forEach((t) => observer.observe(t));

    return () => {
      targets.forEach((t) => observer.unobserve(t));
    };
  }, [loading, categories]);

  if (loading || !restaurant) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f7efe2]">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-[#c79c4f]" />
        <span className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#8b632c] animate-pulse">
          Loading Arab Cafe...
        </span>
      </div>
    );
  }

  const isRtl = currentLang === 'ar';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://arab-cafe-uzungol.com';

  const uiTexts = {
    ar: {
      featuredTitle: 'الأطباق المتميزة',
      featuredSub: 'توصية الشيف الخاصة المحضرة بعناية',
      noResults: 'لم يتم العثور على أطباق تطابق بحثك.',
      workingHours: 'أوقات العمل',
      address: 'العنوان',
      branches: 'فروعنا',
      menuTitle: 'قائمة الطعام',
      currency: 'ل.ت'
    },
    tr: {
      featuredTitle: 'Öne Çıkan Lezzetler',
      featuredSub: 'Şefin özenle hazırladığı imza tabaklar',
      noResults: 'Aramanızla eşleşen ürün bulunamadı.',
      workingHours: 'Çalışma Saatleri',
      address: 'Adres',
      branches: 'Şubelerimiz',
      menuTitle: 'Yemek Menüsü',
      currency: 'TL'
    },
    en: {
      featuredTitle: 'Featured Masterpieces',
      featuredSub: "Chef's special recommendations prepared with care",
      noResults: 'No products matched your search query.',
      workingHours: 'Working Hours',
      address: 'Address',
      branches: 'Branches',
      menuTitle: 'Culinary Menu',
      currency: 'TL'
    }
  };

  const featuredProducts: Product[] = [];
  categories.forEach((cat) => {
    cat.products.forEach((prod) => {
      if (prod.featured) {
        featuredProducts.push(prod);
      }
    });
  });

  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    return categories
      .map((cat) => {
        const filteredProducts = cat.products.filter((prod) => {
          const nameMatch = prod.name[currentLang]?.toLowerCase().includes(query) || false;
          const descMatch = prod.description?.[currentLang]?.toLowerCase().includes(query) || false;
          const tagMatch = prod.tags?.some((tag) => tag.toLowerCase().includes(query)) || false;
          return nameMatch || descMatch || tagMatch;
        });

        return {
          ...cat,
          products: filteredProducts
        };
      })
      .filter((cat) => cat.products.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  const handleExploreClick = () => {
    if (categories.length > 0) {
      const firstCatElement = document.getElementById(categories[0].id);
      if (firstCatElement) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = firstCatElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex min-h-screen select-none flex-col bg-[#f7efe2] font-sans text-[#2f2219]">
      <SchemaOrg restaurant={restaurant} siteUrl={siteUrl} />

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

      <HeroSection restaurant={restaurant} lang={currentLang} onExploreClick={handleExploreClick} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 sm:px-6 lg:px-8">
        <div className="sticky top-[84px] z-30 mb-12 flex items-center justify-start gap-2 overflow-x-auto rounded-full border border-[#c79c4f]/20 bg-[#fcf8f1]/85 px-3 py-3 shadow-[0_18px_40px_rgba(79,52,33,0.08)] backdrop-blur-md sm:justify-center sm:gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs uppercase tracking-[0.22em] transition-all ${
              activeSection === 'home'
                ? 'border-[#c79c4f] bg-[#2f2219] text-[#fcf8f1] shadow-sm'
                : 'border-[#c79c4f]/15 bg-[#fff9ee] text-[#7a5941] hover:border-[#c79c4f]/30 hover:text-[#2f2219]'
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
                    const offset = 140;
                    const y = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs uppercase tracking-[0.22em] transition-all ${
                  isSelected
                    ? 'border-[#c79c4f] bg-[#2f2219] text-[#fcf8f1] shadow-sm'
                    : 'border-[#c79c4f]/15 bg-[#fff9ee] text-[#7a5941] hover:border-[#c79c4f]/30 hover:text-[#2f2219]'
                }`}
              >
                {cat.name[currentLang]}
              </button>
            );
          })}
        </div>

        {featuredProducts.length > 0 && !searchQuery && (
          <section id="_featured" className="mb-20">
            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#c79c4f]/20 bg-[#fcf8f1]/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8b632c]">
                <Sparkles className="h-4 w-4" />
                <span>{uiTexts[currentLang].featuredTitle}</span>
              </div>
              <h2 className="font-serif text-2xl font-light tracking-wide text-[#2f2219] sm:text-4xl">
                {uiTexts[currentLang].featuredSub}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {featuredProducts.slice(0, 3).map((prod) => (
                <ProductCard key={`featured-${prod.id}`} product={prod} lang={currentLang} onSelect={setSelectedProduct} />
              ))}
            </div>
          </section>
        )}

        <div className="space-y-20">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-36">
                <div className="relative mb-8 flex h-[180px] items-center justify-center overflow-hidden rounded-[32px] border border-[#c79c4f]/15 shadow-[0_18px_45px_rgba(79,52,33,0.08)] sm:h-[220px]">
                  <div className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat opacity-45 transition-all duration-700" style={{ backgroundImage: `url('${cat.coverImage || '/placeholder-food.jpg'}')` }} />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(252,248,241,0.1),rgba(47,34,25,0.7))]" />

                  <div className="relative z-10 px-4 text-center">
                    <h2 className="font-serif text-3xl font-light tracking-wide text-[#fcf8f1] shadow-text sm:text-4xl md:text-5xl">
                      {cat.name[currentLang]}
                    </h2>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[#f5e7c4] sm:text-xs">
                      {cat.products.length} {uiTexts[currentLang].menuTitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                  {cat.products.map((prod) => (
                    <ProductCard key={prod.id} product={prod} lang={currentLang} onSelect={setSelectedProduct} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-[32px] border border-[#c79c4f]/15 bg-[#fcf8f1]/80 py-20 text-center shadow-[0_18px_45px_rgba(79,52,33,0.04)]">
              <p className="text-sm font-medium text-[#7a5941]">{uiTexts[currentLang].noResults}</p>
            </div>
          )}
        </div>
      </main>

      <InstallPWA lang={currentLang} />

      <ProductDetailModal product={selectedProduct} lang={currentLang} onClose={() => setSelectedProduct(null)} whatsappNumber={selectedBranch?.whatsapp || restaurant.whatsapp} />

      <footer className="border-t border-[#c79c4f]/15 bg-[#fcf8f1] py-16 text-[#7a5941]" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2f2219] font-serif text-lg font-semibold text-[#fcf8f1]">
                {restaurant.name[currentLang]?.charAt(0)}
              </div>
              <span className="font-serif text-lg font-semibold text-[#2f2219]">{restaurant.name[currentLang]}</span>
            </div>

            <div className="mt-2 flex items-start gap-2 text-sm leading-7">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#c79c4f]" />
              <div>
                <p className="mb-1 font-semibold text-[#2f2219]">{uiTexts[currentLang].workingHours}</p>
                <p>{restaurant.workingHours[currentLang]}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 text-sm leading-7">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c79c4f]" />
              <div>
                <p className="mb-2 font-semibold text-[#2f2219]">{uiTexts[currentLang].branches}</p>
                <div className="space-y-3">
                  {restaurant.branches.map((b) => (
                    <div key={b.id} className="border-l border-[#c79c4f]/15 pl-3 py-0.5">
                      <p className="text-sm font-medium text-[#8b632c]">{b.name[currentLang]}</p>
                      <p className="mt-1 text-xs">{b.address[currentLang]}</p>
                      <a href={b.mapsLink} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs font-medium text-[#c79c4f] hover:underline">
                        {currentLang === 'ar' ? 'عرض على الخريطة' : currentLang === 'tr' ? 'Haritada Göster' : 'Show on Map'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-2 text-sm leading-7">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c79c4f]" />
              <div>
                <p className="mb-1 font-semibold text-[#2f2219]">{uiTexts[currentLang].address}</p>
                <p className="mb-3">{restaurant.address[currentLang]}</p>
                <p className="mb-1 font-semibold text-[#2f2219]">الرقم الرئيسي / Genel Numara</p>
                <p>{restaurant.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 border-t border-[#c79c4f]/15 px-4 pt-8 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-[#a27b57] sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} {restaurant.name.en}. All Rights Reserved. Designed for Arab Cafe.
        </div>
      </footer>

      <section className="border-t border-[#c79c4f]/15 bg-[#f3e6d2] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="mb-2 font-serif text-xl text-[#2f2219]">
            {currentLang === 'ar' ? 'حساباتنا الرسمية' : currentLang === 'tr' ? 'Resmi Hesaplarımız' : 'Our Official Accounts'}
          </h3>
          <p className="mx-auto mb-10 max-w-md text-sm leading-7 text-[#7a5941]">
            {currentLang === 'ar' ? 'تابعونا لتصلكم أحدث العروض والفعاليات في أوزنجول' : currentLang === 'tr' ? 'Uzungöl\'deki en son fırsatları ve etkinlikleri takip edin' : 'Follow us to stay updated with latest offers and events in Uzungöl'}
          </p>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            {restaurant.tiktokLink && (
              <a href={restaurant.tiktokLink} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center rounded-[24px] border border-[#c79c4f]/15 bg-[#fcf8f1] p-6 shadow-[0_12px_30px_rgba(79,52,33,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c79c4f]/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] text-[#8b632c] transition-colors group-hover:text-[#2f2219]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#7a5941]">{restaurant.tiktok ? `@${restaurant.tiktok}` : ''}</span>
                <span className="mt-3 rounded-full bg-[#2f2219] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fcf8f1]">
                  {currentLang === 'ar' ? 'تابعنا على تيك توك' : currentLang === 'tr' ? 'TikTok\'ta Takip Et' : 'Follow on TikTok'}
                </span>
              </a>
            )}

            {restaurant.snapchatLink && (
              <a href={restaurant.snapchatLink} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center rounded-[24px] border border-[#c79c4f]/15 bg-[#fcf8f1] p-6 shadow-[0_12px_30px_rgba(79,52,33,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c79c4f]/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#c79c4f]/20 bg-[#fff9ee] text-[#8b632c] transition-colors group-hover:text-[#2f2219]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 3a6 6 0 0 0-6 6c0 3.27 1.5 5 2.5 6a1 1 0 0 1 .3.7l-.3 1.5a1 1 0 0 0 1 1.2h5a1 1 0 0 0 1-1.2l-.3-1.5a1 1 0 0 1 .3-.7c1-1 2.5-2.73 2.5-6a6 6 0 0 0-6-6z" />
                    <path d="M18.3 19a9.7 9.7 0 0 1-12.6 0" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#7a5941]">{restaurant.snapchat}</span>
                <span className="mt-3 rounded-full bg-[#2f2219] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fcf8f1]">
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
