import React from 'react';

interface ProductSchemaProps {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price?: string;
  availability?: string;
}

export default function ProductSchema({
  name,
  description,
  imageUrl,
  category,
  price = "Contact for pricing",
  availability = "https://schema.org/InStock"
}: ProductSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": name,
    "image": imageUrl,
    "description": description,
    "category": category,
    "offers": {
      "@type": "Offer",
      "url": `https://elevatemotel.com/${category.toLowerCase().replace(/ /g, '_')}`,
      "priceCurrency": "USD",
      "price": price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": availability,
      "seller": {
        "@type": "Organization",
        "name": "Elevate Motel Supply"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "Elevate"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
