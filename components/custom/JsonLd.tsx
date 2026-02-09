import React from 'react';

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Elevate Motel Supply",
    "url": "https://elevatemotel.com",
    "logo": "https://elevatemotel.com/logo.png", 
    "description": "Leading supplier of high-quality motel and hotel furniture, beds, lighting, and essentials for the hospitality industry.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Hospitality Drive",
      "addressLocality": "Orlando", 
      "addressRegion": "FL",
      "postalCode": "32819",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+1-800-123-4567", 
      "email": "sales@elevatemotel.com"
    },
    "sameAs": [
      "https://www.facebook.com/elevatemotel",
      "https://twitter.com/elevatemotel",
      "https://www.instagram.com/elevatemotel",
      "https://www.linkedin.com/company/elevate-motel-supply"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
