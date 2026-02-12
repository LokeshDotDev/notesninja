import React from 'react';

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NotesNinja",
    "url": "https://notesninja.com",
    "logo": "https://notesninja.com/assets/Notes ninja Logo copy.png", 
    "description": "Premium study materials and educational resources for students across various subjects and disciplines.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Education Street",
      "addressLocality": "San Francisco", 
      "addressRegion": "CA",
      "postalCode": "94102",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+1-800-123-4567", 
      "email": "support@notesninja.com"
    },
    "sameAs": [
      "https://www.facebook.com/notesninja",
      "https://twitter.com/notesninja",
      "https://www.instagram.com/notesninja",
      "https://www.linkedin.com/company/notesninja"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
