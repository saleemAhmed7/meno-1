import type { Metadata, Viewport } from 'next';
import { Outfit, Playfair_Display, Cairo, Amiri } from 'next/font/google';
import fs from 'fs';
import path from 'path';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-arabic-sans',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#d4af37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  const restaurantPath = path.join(process.cwd(), 'public', 'restaurant.json');
  let name = "Arab Cafe";
  let address = "Uzungöl, Trabzon, Turkey";
  
  if (fs.existsSync(restaurantPath)) {
    try {
      const content = fs.readFileSync(restaurantPath, 'utf8');
      const data = JSON.parse(content);
      name = data.name.en || name;
      address = data.address.en || address;
    } catch (e) {
      console.error('Error loading metadata restaurant.json:', e);
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arab-cafe-uzungol.com';

  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}`,
    },
    description: `Explore the elegant, multilingual culinary collection of ${name} in ${address}. View ingredients, pricing, spicy levels, discounts, and order directly via WhatsApp.`,
    manifest: '/manifest.json',
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: `${name}`,
      description: `View our luxury dining selection. Easy ordering, multi-language support (AR, TR, EN), available offline.`,
      url: siteUrl,
      siteName: name,
      locale: 'ar_SA',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${outfit.variable} ${playfair.variable} ${cairo.variable} ${amiri.variable}`}>
      <body className="min-h-screen bg-[#f7efe2] text-[#2f2219] antialiased">
        {children}
      </body>
    </html>
  );
}
