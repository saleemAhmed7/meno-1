'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Category, Product, Restaurant } from '@/types/menu';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
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
    categoryBreakfast: 'الإفطار',
    categoryLunch: 'الغداء',
    categoryDrinks: 'المشروبات',
    categoryIndividual: 'الأطباق الفردية',
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
    categoryBreakfast: 'Kahvaltı',
    categoryLunch: 'Öğle Yemeği',
    categoryDrinks: 'İçecekler',
    categoryIndividual: 'Tek Kişilik Yemekler',
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
    categoryBreakfast: 'Breakfast',
    categoryLunch: 'Lunch',
    categoryDrinks: 'Drinks',
    categoryIndividual: 'Individual Dishes',
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

  // autoplay handled below after `sliderItems` is computed

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('arab_cafe_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const texts = translations[currentLang];

  const router = useRouter();
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(categorySlugs[0].slug);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  // touch handlers & swipe support for slider
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef<number>(0);

  const nextSlide = () => setActiveSlide((s) => (s + 1) % Math.max(1, sliderItems.length));
  const prevSlide = () => setActiveSlide((s) => (s - 1 + Math.max(1, sliderItems.length)) % Math.max(1, sliderItems.length));

  useEffect(() => {
    if (!sliderItems.length) return;
    const id = window.setInterval(() => {
      setActiveSlide((s) => (s + 1) % sliderItems.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [sliderItems.length]);

  const findCategoryBySlug = (slug: string) => {
    const normalized = (s?: string) => (s || '').toLowerCase().replace(/\s+/g, '-');
    return categories.find((cat) => {
      const id = (cat.id || '').toLowerCase();
      if (id === slug || normalized(id) === slug) return true;
      const names = [cat.name.ar, cat.name.tr, cat.name.en];
      return names.some((n) => normalized(n) === slug);
    });
  };

  const getRouteForCategory = (cat: Category) => {
    for (const s of categorySlugs) {
      const found = findCategoryBySlug(s.slug);
      if (found && found.id === cat.id) return s.route;
    }
    return `/${cat.id.toLowerCase().replace(/\s+/g, '-')}`;
  };

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

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div
          className="rounded-[32px] overflow-hidden border border-[#c79c4f]/15 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.12)]"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchMove={(e) => { if (touchStartX.current != null) touchDelta.current = e.touches[0].clientX - touchStartX.current; }}
          onTouchEnd={() => {
            if (Math.abs(touchDelta.current) > 50) {
              if (touchDelta.current < 0) nextSlide(); else prevSlide();
            }
            touchStartX.current = null;
            touchDelta.current = 0;
          }}
        >
          <div className="relative h-[420px] sm:h-[520px] w-full">
            {sliderItems.map((item, index) => (
              <div key={index} className={`absolute inset-0 transition-all duration-700 ${index === activeSlide ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'}`}>
                <Image src={item.image} alt={item.label} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(47,34,25,0.05),rgba(47,34,25,0.45))]" />
              </div>
            ))}

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {sliderItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-8 bg-[#2f2219]' : 'w-2.5 bg-[#c79c4f]/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* top category image cards removed; replaced by text-only tabs below */}

        {/* Horizontal category navigation + chips + banner + products for active category */}
        <section className="mt-8">
          <div className="mb-4">
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="sticky top-20 z-40 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="overflow-x-auto py-2">
                  <div className="flex gap-3 min-w-max">
                    {categorySlugs.map((s) => {
                      const active = activeCategorySlug === s.slug || (typeof window !== 'undefined' && window.location.pathname === s.route);
                      const label = (texts as any)[s.labelKey] || s.slug;
                      return (
                        <button
                          key={s.slug}
                          onClick={() => { setActiveCategorySlug(s.slug); router.push(s.route); }}
                          className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? 'bg-[#c79c4f] text-white shadow-md' : 'bg-[#fff9ee] text-[#2f2219] border border-[#e9d8b4]'}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* subcategory chips removed per request (redundant) */}
          </div>

          {/* large category banner for active category */}
          {(() => {
            const activeCat = findCategoryBySlug(activeCategorySlug) || categories[0];
            if (!activeCat) return null;
            const bannerImage = activeCat.coverImage || activeCat.products[0]?.media[0]?.url || '/placeholder-food.jpg';
            return (
              <div className="overflow-hidden rounded-[36px] border border-[#c79c4f]/15 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.12)]">
                <div className="relative h-64 w-full sm:h-80 lg:h-96">
                  <Image src={bannerImage} alt={activeCat.name[currentLang] || activeCat.name.en} fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,34,25,0.75),rgba(47,34,25,0.25))]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                    <h2 className="mt-4 max-w-2xl font-serif text-3xl font-light text-[#fcf8f1] sm:text-4xl lg:text-5xl">{activeCat.name[currentLang] || activeCat.name.en}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#f4e2c5]">{texts.featuredSub}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* products for active category */}
          <div className="mt-8">
            {(() => {
              const activeCat = findCategoryBySlug(activeCategorySlug) || categories[0];
              if (!activeCat) return null;
              return (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeCat.products.map((product) => (
                    <ProductCard key={product.id} product={product} lang={currentLang} onSelect={setSelectedProduct} anchorId={`menu-${activeCat.id}-${product.id}`} />
                  ))}
                </div>
              );
            })()}
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
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} lang={currentLang} onClose={() => setSelectedProduct(null)} whatsappNumber={restaurant?.whatsapp || restaurant?.phone || ''} />
      )}
    </div>
  );
}
