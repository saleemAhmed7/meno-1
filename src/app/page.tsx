'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Category, Product, Restaurant } from '@/types/menu';
import Navbar from '@/components/Navbar';
import InstallPWA from '@/components/InstallPWA';
import SchemaOrg from '@/components/SchemaOrg';
import { Language } from '@/components/LanguageSwitcher';

const categorySlugs = [
  { slug: 'breakfast', labelKey: 'categoryBreakfast', route: '/breakfast' },
  { slug: 'lunch', labelKey: 'categoryLunch', route: '/lunch' },
  { slug: 'drinks', labelKey: 'categoryDrinks', route: '/drinks' },
  { slug: 'individual-dishes', labelKey: 'categoryIndividual', route: '/individual-dishes' }
];

const translations = {
  ar: {
    headerSearch: 'ابحث',
    heroTitle: 'جرب أصالة النكهات العربية',
    heroSubtitle: 'في Arab Cafe نقدّم لك تجربة طعام فاخرة عبر قائمة سريعة وسهلة التصفح.',
    shortcutBreakfast: 'الإفطار',
    shortcutLunch: 'الكبسة',
    shortcutDrinks: 'الدلة',
    welcomeTitle: 'مرحباً بك في Arab Cafe',
    welcomeText: 'نقدم لك أطباقاً عربية تقليدية وخدمة سريعة لضمان تجربة مميزة من الهاتف إلى المائدة.',
    categoriesTitle: 'الأقسام الرئيسية',
    categoriesSub: 'اختر القسم الذي تفضله وابدأ رحلتك بين الأطباق',
    featuredTitle: 'أطباقنا المختارة',
    featuredSub: 'أفضل الاختيارات مقدمة لك بأناقة',
    viewCategory: 'عرض القسم',
    noFeatured: 'لا توجد أطباق مميزة حالياً.'
  },
  tr: {
    headerSearch: 'Ara',
    heroTitle: 'Arap lezzetlerinin ruhunu keşfedin',
    heroSubtitle: 'Arab Cafe’de hızlı ve şık bir menü deneyimi sizi bekliyor.',
    shortcutBreakfast: 'Kahvaltı',
    shortcutLunch: 'Kabsa',
    shortcutDrinks: 'Dallah',
    welcomeTitle: 'Arab Cafe’ye Hoş Geldiniz',
    welcomeText: 'Geleneksel tatları modern şıklıkla sunuyoruz. Menüye göz atmaktan keyif alın.',
    categoriesTitle: 'Ana Kategoriler',
    categoriesSub: 'Tercih ettiğiniz bölümü seçin ve menü yolculuğuna başlayın',
    featuredTitle: 'Seçkin Lezzetler',
    featuredSub: 'Özenle seçilmiş özel ürünler',
    viewCategory: 'Kategoriyi Gör',
    noFeatured: 'Şu anda öne çıkan ürün yok.'
  },
  en: {
    headerSearch: 'Search',
    heroTitle: 'Discover authentic Arabic flavors',
    heroSubtitle: 'Arab Cafe delivers a premium mobile-first dining experience with bold, elegant cuisine.',
    shortcutBreakfast: 'Breakfast',
    shortcutLunch: 'Kabsa',
    shortcutDrinks: 'Arabic Dallah',
    welcomeTitle: 'Welcome to Arab Cafe',
    welcomeText: 'Enjoy handcrafted Arabic dishes, refined design, and effortless menu browsing from your phone.',
    categoriesTitle: 'Main Categories',
    categoriesSub: 'Choose a section and dive into our curated selection',
    featuredTitle: 'Featured Picks',
    featuredSub: 'Hand-selected premium dishes curated for you',
    viewCategory: 'View category',
    noFeatured: 'No featured dishes available right now.'
  }
};

export default function Home() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('arab_cafe_lang') as Language | null;
    if (savedLang && ['ar', 'tr', 'en'].includes(savedLang)) {
      setCurrentLang(savedLang);
      document.documentElement.lang = savedLang;
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }

    const loadData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([fetch('/restaurant.json'), fetch('/api/menu')]);
        const restaurantData = await restRes.json();
        const menuData = await menuRes.json();

        setRestaurant(restaurantData);
        setCategories(menuData.categories || []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % Math.min(4, sliderItems.length));
    }, 4500);
    return () => window.clearInterval(interval);
  }, [categories]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('arab_cafe_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const texts = translations[currentLang];

  const sliderItems = useMemo(() => {
    const items: Array<{ image: string; label: string }> = [];
    categories.forEach((category) => {
      category.products.slice(0, 2).forEach((product) => {
        if (items.length < 5) {
          items.push({
            image: product.media[0]?.type === 'image' ? product.media[0].url : '/placeholder-food.jpg',
            label: product.name[currentLang] || product.name.en || category.name[currentLang] || category.name.en || 'Arab Cafe'
          });
        }
      });
    });
    if (!items.length) {
      return [
        { image: '/placeholder-food.jpg', label: texts.heroTitle }
      ];
    }
    return items;
  }, [categories, currentLang, texts.heroTitle]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase().trim();
    return categories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) => {
          const title = product.name[currentLang] || product.name.en || '';
          const description = product.description?.[currentLang] || product.description?.en || '';
          return title.toLowerCase().includes(query) || description.toLowerCase().includes(query);
        })
      }))
      .filter((category) => category.products.length > 0);
  }, [categories, currentLang, searchQuery]);

  const featuredProducts = useMemo(() => {
    const featured: Product[] = [];
    categories.forEach((category) => {
      category.products.forEach((product) => {
        if ((product.featured || product.bestSeller) && featured.length < 8) {
          featured.push(product);
        }
      });
    });
    return featured;
  }, [categories]);

  const getLocalized = (value: { ar: string; tr: string; en: string } | undefined, fallback = '') => {
    if (!value) return fallback;
    return value[currentLang] || value.en || fallback;
  };

  if (loading || !restaurant) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f7efe2]">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-[#c79c4f]" />
        <span className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#8b632c]">Loading Arab Cafe...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7efe2] text-[#2f2219]" style={{ direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
      <SchemaOrg restaurant={restaurant} siteUrl={typeof window !== 'undefined' ? window.location.origin : 'https://arab-cafe-uzungol.com'} />

      <Navbar currentLang={currentLang} onLanguageChange={handleLanguageChange} restaurant={restaurant} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <header className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-[#c79c4f]/15 bg-[#fcf8f1] p-6 shadow-[0_28px_80px_rgba(79,52,33,0.12)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8b632c]">{texts.heroTitle}</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#2f2219] sm:text-5xl">{texts.heroTitle}</h1>
              <p className="max-w-2xl text-base leading-8 text-[#634b3a]">{texts.heroSubtitle}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/breakfast" className="inline-flex items-center justify-center rounded-full bg-[#2f2219] px-6 py-3 text-sm font-semibold text-[#fff9ee] transition hover:bg-[#3d2b1f]">
                  {texts.shortcutBreakfast}
                </Link>
                <Link href="/lunch" className="inline-flex items-center justify-center rounded-full border border-[#c79c4f] bg-white px-6 py-3 text-sm font-semibold text-[#2f2219] transition hover:border-[#a98349]">
                  {texts.shortcutLunch}
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[32px] border border-[#c79c4f]/10 bg-[#fff9ee] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#e9d8b4]">
                <Image src={sliderItems[activeSlide]?.image || '/placeholder-food.jpg'} alt={sliderItems[activeSlide]?.label} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,34,25,0.05),rgba(47,34,25,0.45))]" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8b632c]">{texts.featuredTitle}</p>
                  <p className="text-sm font-semibold text-[#2f2219]">{sliderItems[activeSlide]?.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  {sliderItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-8 bg-[#2f2219]' : 'w-2.5 bg-[#c79c4f]/40'}`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: texts.shortcutBreakfast, href: '/breakfast', image: categories.find((cat) => cat.id.toLowerCase().includes('breakfast'))?.coverImage || '/placeholder-food.jpg' },
            { label: texts.shortcutLunch, href: '/lunch', image: categories.find((cat) => cat.id.toLowerCase().includes('lunch'))?.coverImage || '/placeholder-food.jpg' },
            { label: texts.shortcutDrinks, href: '/drinks', image: categories.find((cat) => cat.id.toLowerCase().includes('drinks'))?.coverImage || '/placeholder-food.jpg' }
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group overflow-hidden rounded-[28px] border border-[#c79c4f]/15 bg-[#fff9ee] shadow-[0_18px_45px_rgba(79,52,33,0.08)] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={item.image} alt={item.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,34,25,0.24),rgba(47,34,25,0.6))]" />
              </div>
              <div className="p-4 text-center text-[#2f2219]">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2f2219]">{item.label}</p>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-[34px] border border-[#c79c4f]/15 bg-[linear-gradient(135deg,#fcf8f1_0%,#f4e4c9_100%)] p-8 shadow-[0_18px_55px_rgba(79,52,33,0.08)]">
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl font-light text-[#2f2219] sm:text-4xl">{texts.welcomeTitle}</h2>
            <p className="mt-4 text-base leading-8 text-[#634b3a]">{texts.welcomeText}</p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8b632c]">{texts.categoriesTitle}</p>
            <h2 className="mt-3 font-serif text-3xl font-light text-[#2f2219] sm:text-4xl">{texts.categoriesSub}</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredCategories.map((category) => (
              <Link key={category.id} href={`/${category.id.toLowerCase().replace(/\s+/g, '-')}`} className="group overflow-hidden rounded-[32px] border border-[#c79c4f]/15 bg-[#fcf8f1] shadow-[0_18px_45px_rgba(79,52,33,0.08)] transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={category.coverImage || '/placeholder-food.jpg'} alt={category.name[currentLang] || category.name.en || ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="100vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,34,25,0.2),rgba(47,34,25,0.72))]" />
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                    <div>
                      <h3 className="font-serif text-3xl font-semibold uppercase tracking-[0.08em] text-white sm:text-4xl">{category.name[currentLang] || category.name.en}</h3>
                      <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#e6d8be]">{texts.viewCategory}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-[#c79c4f]/15 bg-[#fcf8f1]/90 p-6 shadow-[0_18px_45px_rgba(79,52,33,0.08)]">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8b632c]">{texts.featuredTitle}</p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#2f2219] sm:text-4xl">{texts.featuredTitle}</h2>
            </div>
            <p className="text-sm text-[#7a5941]">{texts.featuredSub}</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {featuredProducts.length ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="min-w-[280px] max-w-[300px] snap-start">
                  <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#c79c4f]/15 bg-white shadow-[0_16px_36px_rgba(79,52,33,0.08)] transition-transform duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.media[0]?.type === 'image' ? product.media[0].url : '/placeholder-food.jpg'}
                        alt={getLocalized(product.name)}
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-semibold text-[#2f2219]">{getLocalized(product.name)}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#7a5941]">{getLocalized(product.description, '')}</p>
                      <div className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-[#2f2219]">
                        <span>{product.price !== null ? `${product.price} ${product.currency}` : '—'}</span>
                        <span className="rounded-full bg-[#f4e4c9] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#8b632c]">{product.bestSeller ? 'Best seller' : 'Special'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-[#c79c4f]/15 bg-[#fff9ee] p-8 text-center text-sm text-[#7a5941]">{texts.noFeatured}</div>
            )}
          </div>
        </section>
      </main>

      <InstallPWA lang={currentLang} />
    </div>
  );
}
