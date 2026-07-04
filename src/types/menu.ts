export interface MultilingualText {
  ar: string;
  tr: string;
  en: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface Product {
  id: string;
  name: MultilingualText;
  description?: MultilingualText;
  price: number | null;
  oldPrice?: number | null;
  currency: string;
  available: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  new?: boolean;
  spicyLevel?: number; // 0 (none), 1 (mild), 2 (medium), 3 (hot)
  tags?: string[];
  order?: number;
  media: MediaItem[];
}

export interface Category {
  id: string;
  name: MultilingualText;
  order: number;
  coverImage: string | null;
  products: Product[];
}

export interface Branch {
  id: string;
  name: MultilingualText;
  address: MultilingualText;
  phone: string;
  whatsapp: string;
  mapsLink: string;
}

export interface Restaurant {
  name: MultilingualText;
  logo: string;
  defaultCurrency: string;
  phone: string;
  whatsapp: string;
  tiktok?: string;
  tiktokLink?: string;
  snapchat?: string;
  snapchatLink?: string;
  address: MultilingualText;
  workingHours: MultilingualText;
  branches: Branch[];
}
