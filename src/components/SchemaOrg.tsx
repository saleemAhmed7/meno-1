import React from 'react';
import { Restaurant } from '@/types/menu';

interface SchemaOrgProps {
  restaurant: Restaurant;
  siteUrl: string;
}

export default function SchemaOrg({ restaurant, siteUrl }: SchemaOrgProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": restaurant.name.en,
    "image": `${siteUrl}${restaurant.logo}`,
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": restaurant.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": restaurant.address.en,
      "addressLocality": "Istanbul",
      "addressCountry": "TR"
    },
    "menu": siteUrl,
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "00:00"
      }
    ],
    "sameAs": [
      restaurant.tiktokLink || '',
      restaurant.snapchatLink || ''
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
