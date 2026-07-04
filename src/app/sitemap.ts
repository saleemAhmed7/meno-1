import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable or default fallback URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arab-cafe-uzungol.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}
