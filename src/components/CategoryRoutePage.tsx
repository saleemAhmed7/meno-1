'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Phone, Sparkles } from 'lucide-react';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import InstallPWA from '@/components/InstallPWA';
import SchemaOrg from '@/components/SchemaOrg';
import { Language } from '@/components/LanguageSwitcher';
import { Category, Product, Restaurant, Branch } from '@/types/menu';

const categorySlugs = [
  { slug: 'breakfast', route: '/breakfast', labels: { ar: 'الإفطار', tr: 'Kahvaltı', en: 'Breakfast' } },
  { slug: 'lunch', route: '/lunch', labels: { ar: 'الغداء', tr: 'Öğle Yemeği', en: 'Lunch' } },
  { slug: 'drinks', route: '/drinks', labels: { ar: 'المشروبات', tr: 'İçecekler', en: 'Drinks' } },
  { slug: 'individual-dishes', route: '/individual-dishes', labels: { ar: 'الأطباق الفردية', tr: 'Tek Kişilik Yemekler', en: 'Individual Dishes' } }
];

interface CategoryRoutePageProps {
  slug: string;
  fallbackTitle?: { ar: string; tr: string; en: string };
}

export default function CategoryRoutePage({ slug, fallbackTitle }: CategoryRoutePageProps) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('arab_cafe_lang') as Language | null;
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

        if (restData.branches?.length) {
          setSelectedBranch(restData.branches[0]);
        }
      } catch (err) {
        console.error('Failed to load menu data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('arab_cafe_lang', lang);
    localStorage.setItem('khaled_menu_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const category = useMemo(() => {
    const normalizedSlug = slug.toLowerCase();
    return categories.find((item) => {
      const idMatch = item.id.toLowerCase() === normalizedSlug || item.id.toLowerCase().replace(/\s+/g, '-') === normalizedSlug;
      const nameMatch = [item.name.ar, item.name.tr, item.name.en].some((value) => value?.toLowerCase().replace(/\s+/g, '-') === normalizedSlug);
      return idMatch || nameMatch;
    });
  }, [categories, slug]);

  const filteredProducts = useMemo(() => {
    if (!category) return [];

    if (!searchQuery.trim()) return category.products;

    const query = searchQuery.toLowerCase().trim();
    return category.products.filter((product) => {
      const nameMatch = product.name[currentLang]?.toLowerCase().includes(query) || false;
      const descMatch = product.description?.[currentLang]?.toLowerCase().includes(query) || false;
      const tagMatch = product.tags?.some((tag) => tag.toLowerCase().includes(query)) || false;
      return nameMatch || descMatch || tagMatch;
    });
  }, [category, currentLang, searchQuery]);

  const isRtl = currentLang === 'ar';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://arab-cafe-uzungol.com';

  // Helper to get localized category label
  const getCatLabel = (s: { labels: { ar: string; tr: string; en: string } }) => s.labels[currentLang] || s.labels.en;

  const uiTexts = {
    ar: {
      title: fallbackTitle?.ar || category?.name.ar || 'القسم',
      subtitle: 'استكشف الأطباق المختارة في هذا القسم',
      noResults: 'لم يتم العثور على أطباق تطابقة بحثك.',
      back: 'العودة',
      featured: 'الأطباق المتاحة'
    },
    tr: {
      title: fallbackTitle?.tr || category?.name.tr || 'Kategori',
      subtitle: 'Bu bölümdeki özel lezzetleri keşfedin',
      noResults: 'Aramanızla eşleşen ürün bulunamadı.',
      back: 'Geri dön',
      featured: 'Mevcut lezzetler'
    },
    en: {
      title: fallbackTitle?.en || category?.name.en || 'Category',
      subtitle: 'Discover the curated dishes from this section',
      noResults: 'No products matched your search query.',
      back: 'Go back',
      featured: 'Available dishes'
    }
  };

  if (loading || !restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7efe2]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-[#c79c4f]" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b632c]">Loading menu...</span>
        </div>
      </div>
    );
  }

  const bannerImage = category?.coverImage || category?.products[0]?.media[0]?.url || '/placeholder-food.jpg';

  return (
    <div className="min-h-screen bg-[#f7efe2] text-[#2f2219]" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <SchemaOrg restaurant={restaurant} siteUrl={siteUrl} />

      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        restaurant={restaurant}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Category tabs - sticky below header, glass background, RTL-aware */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="sticky top-16 sm:top-20 z-50 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="backdrop-blur-md bg-white/70 border border-white/30 shadow-md py-3">
            <div className="overflow-x-auto scroll-smooth px-2">
              <div className="flex gap-3 min-w-max">
                {categorySlugs.map((s) => {
                  const active = slug === s.slug;
                  return (
                    <button
                      key={s.slug}
                      onClick={() => router.push(s.route)}
                      aria-current={active ? 'true' : 'false'}
                      className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? 'bg-[#c79c4f] text-white shadow-lg' : 'bg-[#fff9ee] text-[#2f2219] border border-[#e9d8b4]'}`}
                    >
                      {getCatLabel(s)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <section className="overflow-hidden rounded-[36px] border border-[#c79c4f]/15 bg-[#fcf8f1] shadow-[0_24px_70px_rgba(79,52,33,0.12)]">
          <div className="relative h-72 w-full sm:h-80 lg:h-96">
            <Image src={bannerImage} alt={uiTexts[currentLang].title} fill sizes="(max-width: 1024px) 100vw, 1200px" className="object-cover" priority />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(47,34,25,0.75),rgba(47,34,25,0.25))]" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
              <button
                onClick={() => router.push('/')}
                className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[#fcf8f1] backdrop-blur-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{uiTexts[currentLang].back}</span>
              </button>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f8e6c0] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{uiTexts[currentLang].featured}</span>
              </div>
              <h1 className="mt-4 max-w-2xl font-serif text-3xl font-light text-[#fcf8f1] sm:text-4xl lg:text-5xl">
                {uiTexts[currentLang].title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-8 text-[#f4e2c5] sm:text-base">
                {uiTexts[currentLang].subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-[#c79c4f]/15 bg-[#fcf8f1]/80 p-5 shadow-[0_18px_45px_rgba(79,52,33,0.06)] sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-col gap-2 border-b border-[#c79c4f]/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#8b632c]">{uiTexts[currentLang].featured}</p>
              <h2 className="mt-2 font-serif text-2xl font-light text-[#2f2219] sm:text-3xl">{uiTexts[currentLang].title}</h2>
            </div>
            <p className="text-sm text-[#7a5941]">{filteredProducts.length} {uiTexts[currentLang].featured}</p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} lang={currentLang} onSelect={setSelectedProduct} anchorId={`menu-${category?.id}-${product.id}`} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#c79c4f]/25 bg-[#fff9ee] py-16 text-center text-sm font-medium text-[#7a5941]">
              {uiTexts[currentLang].noResults}
            </div>
          )}
        </section>
      </main>

      <InstallPWA lang={currentLang} />
      <ProductDetailModal product={selectedProduct} lang={currentLang} onClose={() => setSelectedProduct(null)} whatsappNumber={selectedBranch?.whatsapp || restaurant.whatsapp} />

      <footer className="border-t border-[#c79c4f]/15 bg-[#fcf8f1] py-14 text-[#7a5941]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f2219] font-serif text-base font-semibold text-[#fcf8f1]">
              {restaurant.name[currentLang]?.charAt(0)}
            </div>
            <span className="font-serif text-lg font-semibold text-[#2f2219]">{restaurant.name[currentLang]}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#c79c4f]" /><span>{restaurant.workingHours[currentLang]}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#c79c4f]" /><span>{restaurant.address[currentLang]}</span></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#c79c4f]" /><span>{restaurant.phone}</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
