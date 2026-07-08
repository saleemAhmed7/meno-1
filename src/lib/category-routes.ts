import { Category } from '@/types/menu';

export interface CategoryRouteMeta {
  slug: string;
  href: string;
  title: { ar: string; tr: string; en: string };
}

const CATEGORY_ROUTE_MAP: Record<string, CategoryRouteMeta> = {
  breakfast: {
    slug: 'breakfast',
    href: '/breakfast',
    title: { ar: 'الإفطار', tr: 'Kahvaltı', en: 'Breakfast' }
  },
  lunch: {
    slug: 'lunch',
    href: '/lunch',
    title: { ar: 'الغداء', tr: 'Öğle Yemeği', en: 'Lunch' }
  },
  drinks: {
    slug: 'drinks',
    href: '/drinks',
    title: { ar: 'المشروبات', tr: 'İçecekler', en: 'Drinks' }
  },
  'individual-dishes': {
    slug: 'individual-dishes',
    href: '/individual-dishes',
    title: { ar: 'الأطباق الفردية', tr: 'Bireysel Yemekler', en: 'Individual Dishes' }
  }
};

const CATEGORY_ID_ROUTE_MAP: Record<string, CategoryRouteMeta> = {
  'الإفطار': CATEGORY_ROUTE_MAP.breakfast,
  'الغداء': CATEGORY_ROUTE_MAP.lunch,
  'المشروبات': CATEGORY_ROUTE_MAP.drinks,
  'الأطباق الفردية': CATEGORY_ROUTE_MAP['individual-dishes']
};

export function getCategoryRouteMeta(category: Pick<Category, 'id' | 'name'>): CategoryRouteMeta | null {
  const direct = CATEGORY_ID_ROUTE_MAP[category.id];
  if (direct) return direct;

  const normalizedId = category.id.toLowerCase();
  const fallback = CATEGORY_ROUTE_MAP[normalizedId as keyof typeof CATEGORY_ROUTE_MAP];
  if (fallback) return fallback;

  const englishName = category.name.en?.toLowerCase();
  if (englishName) {
    const matched = Object.values(CATEGORY_ROUTE_MAP).find((route) => route.title.en.toLowerCase() === englishName);
    if (matched) return matched;
  }

  return null;
}

export function getCategoryRouteMetaBySlug(slug: string): CategoryRouteMeta | null {
  return Object.values(CATEGORY_ROUTE_MAP).find((route) => route.slug === slug) || null;
}
