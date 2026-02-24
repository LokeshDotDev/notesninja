// Analytics tracking utilities for GA4 and Meta Pixel

// SHA-256 hashing utility for user data (Enhanced Conversions)
async function sha256Hash(value: string): Promise<string> {
  const normalizedValue = value.toLowerCase().trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedValue);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

interface Product {
  id: string;
  title: string;
  price?: number;
  compareAtPrice?: number;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
}

interface PurchaseData {
  transactionId: string;
  value: number;
  currency: string;
  products: Product[];
  customerEmail?: string;
  customerName?: string;
}

// GA4 Events
export const trackGA4Event = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log(`📊 GA4 Event: ${eventName}`, parameters);
  }
};

// Meta Pixel Events
export const trackMetaEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
    console.log(`📘 Meta Event: ${eventName}`, parameters);
  }
};

// E-commerce Events

// 1. View Item - When user views a product
export const trackViewItem = (product: Product) => {
  // GA4
  trackGA4Event('view_item', {
    currency: 'INR',
    value: product.price || 0,
    items: [{
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      item_category: product.subcategory,
      price: product.price,
      quantity: 1
    }]
  });

  // Meta Pixel
  trackMetaEvent('ViewContent', {
    content_name: product.title,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'INR'
  });
};

// 2. Add to Cart - When user starts checkout
export const trackBeginCheckout = (product: Product) => {
  // GA4
  trackGA4Event('begin_checkout', {
    currency: 'INR',
    value: product.price || 0,
    items: [{
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      item_category: product.subcategory,
      price: product.price,
      quantity: 1
    }]
  });

  // Meta Pixel
  trackMetaEvent('InitiateCheckout', {
    content_name: product.title,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'INR'
  });
};

// 3. Add Payment Info - When user enters payment details
export const trackAddPaymentInfo = (product: Product) => {
  // GA4
  trackGA4Event('add_payment_info', {
    currency: 'INR',
    value: product.price || 0,
    payment_type: 'Razorpay',
    items: [{
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      item_category: product.subcategory,
      price: product.price,
      quantity: 1
    }]
  });

  // Meta Pixel
  trackMetaEvent('AddPaymentInfo', {
    content_name: product.title,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'INR'
  });
};

// 4. Purchase - When payment is successful
export const trackPurchase = (purchaseData: PurchaseData) => {
  // Get UTM and traffic source data
  const utmData = getUTMParameters();
  const trafficSource = getTrafficSource();
  
  const fullEventData = {
    transaction_id: purchaseData.transactionId,
    value: purchaseData.value,
    currency: purchaseData.currency,
    // Campaign attribution data
    utm_source: utmData?.utm_source || trafficSource?.source,
    utm_medium: utmData?.utm_medium || trafficSource?.medium,
    utm_campaign: utmData?.utm_campaign,
    traffic_source: trafficSource?.source,
    items: purchaseData.products.map(product => ({
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      item_category: product.subcategory,
      price: product.price,
      quantity: 1
    }))
  };
  
  // GA4
  trackGA4Event('purchase', fullEventData);

  // Meta Pixel
  trackMetaEvent('Purchase', {
    content_name: purchaseData.products[0]?.title,
    content_category: purchaseData.products[0]?.category,
    content_ids: purchaseData.products.map(p => p.id),
    content_type: 'product',
    value: purchaseData.value,
    currency: purchaseData.currency,
    transaction_id: purchaseData.transactionId
  });

  // Meta Pixel - CompleteRegistration for new users
  if (purchaseData.customerEmail) {
    trackMetaEvent('CompleteRegistration', {
      content_name: 'Customer',
      currency: purchaseData.currency,
      value: purchaseData.value,
      status: 'completed'
    });
  }
  
  console.log('🎯 Purchase tracked with attribution:', fullEventData);
};

// 5. Page View - For checkout pages
export const trackCheckoutPageView = (step: string, product?: Product) => {
  // GA4
  trackGA4Event('page_view', {
    page_title: `Checkout - ${step}`,
    page_location: window.location.href,
    ...(product && {
      ecommerce: {
        items: [{
          item_id: product.id,
          item_name: product.title,
          category: product.category,
          price: product.price,
          quantity: 1
        }]
      }
    })
  });

  // Meta Pixel
  trackMetaEvent('PageView');
};

// 6. Search - When users search for notes
export const trackSearch = (searchTerm: string) => {
  // GA4
  trackGA4Event('search', {
    search_term: searchTerm
  });

  // Meta Pixel
  trackMetaEvent('Search', {
    search_string: searchTerm
  });
};

// 7. Category View - When users browse categories
export const trackCategoryView = (categoryName: string) => {
  // GA4
  trackGA4Event('view_item_list', {
    item_list_name: categoryName,
    item_list_id: categoryName.toLowerCase().replace(/\s+/g, '_')
  });

  // Meta Pixel
  trackMetaEvent('ViewContent', {
    content_category: categoryName,
    content_type: 'category'
  });
};

// 8. Download - When users download digital files
export const trackDownload = (fileName: string, productId: string) => {
  // GA4
  trackGA4Event('file_download', {
    file_name: fileName,
    content_type: 'digital_file',
    item_id: productId
  });

  // Meta Pixel
  trackMetaEvent('Lead', {
    content_name: fileName,
    content_type: 'download'
  });
};

// 9. Login/Register Events
export const trackLogin = async (method: string = 'email', userData?: { email?: string; name?: string }) => {
  const params: Record<string, unknown> = { method };
  const metaParams: Record<string, unknown> = {
    content_name: 'Login',
    status: 'completed'
  };

  // Enhanced Conversions - Hash user data if provided
  if (userData?.email) {
    const hashedEmail = await sha256Hash(userData.email);
    params.user_data = {
      email_address: hashedEmail
    };
    // Meta Pixel Advanced Matching
    metaParams.em = hashedEmail; // hashed email
  }

  if (userData?.name) {
    const hashedName = await sha256Hash(userData.name);
    if (params.user_data) {
      (params.user_data as Record<string, unknown>).name = hashedName;
    }
    // Meta Pixel Advanced Matching
    metaParams.fn = hashedName; // hashed first name
  }

  // GA4
  trackGA4Event('login', params);

  // Meta Pixel
  trackMetaEvent('CompleteRegistration', metaParams);
};

export const trackSignUp = async (method: string = 'email', userData?: { email?: string; name?: string }) => {
  const params: Record<string, unknown> = { method };
  const metaParams: Record<string, unknown> = {
    content_name: 'Registration',
    status: 'completed'
  };

  // Enhanced Conversions - Hash user data if provided
  if (userData?.email) {
    const hashedEmail = await sha256Hash(userData.email);
    params.user_data = {
      email_address: hashedEmail
    };
    // Meta Pixel Advanced Matching
    metaParams.em = hashedEmail; // hashed email
  }

  if (userData?.name) {
    const hashedName = await sha256Hash(userData.name);
    if (params.user_data) {
      (params.user_data as Record<string, unknown>).name = hashedName;
    }
    // Meta Pixel Advanced Matching
    metaParams.fn = hashedName; // hashed first name
  }

  // GA4
  trackGA4Event('sign_up', params);

  // Meta Pixel
  trackMetaEvent('CompleteRegistration', metaParams);
};

// 10. Error Tracking
export const trackError = (error: string, context?: string) => {
  // GA4
  trackGA4Event('exception', {
    description: error,
    fatal: false,
    ...(context && { context })
  });

  console.error(`🚨 Analytics Error: ${error}${context ? ` | Context: ${context}` : ''}`);
};

// 11. Custom Events
export const trackCustomEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  // GA4
  trackGA4Event(eventName, parameters);

  // Meta Pixel (if it's a standard event)
  const standardMetaEvents = [
    'AddToWishlist', 'Lead', 'Schedule', 'StartTrial', 
    'SubmitApplication', 'Subscribe', 'Contact'
  ];
  
  if (standardMetaEvents.includes(eventName)) {
    trackMetaEvent(eventName, parameters);
  }
};

// ============================================
// CAMPAIGN & TRAFFIC SOURCE TRACKING
// ============================================

// Capture UTM parameters from URL
export const captureUTMParameters = () => {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  
  const utmData = {
    utm_source: params.get('utm_source'),      // facebook, google, instagram, etc
    utm_medium: params.get('utm_medium'),      // paid_ad, organic, email, etc
    utm_campaign: params.get('utm_campaign'),  // spring_sale, black_friday, etc
    utm_content: params.get('utm_content'),    // ad variation
    utm_term: params.get('utm_term'),          // keyword
  };
  
  // Remove null values
  const cleanData = Object.fromEntries(
    Object.entries(utmData).filter(([, v]) => v !== null)
  );
  
  // Store in sessionStorage so it persists during user journey
  if (Object.keys(cleanData).length > 0) {
    sessionStorage.setItem('utm_data', JSON.stringify(cleanData));
    console.log('📍 UTM Data Captured:', cleanData);
  }
  
  return cleanData;
};

// Get stored UTM data
export const getUTMParameters = () => {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem('utm_data');
  return stored ? JSON.parse(stored) : null;
};

// Detect traffic source from referrer
export const getTrafficSource = () => {
  if (typeof window === 'undefined') return null;
  
  const referrer = document.referrer;
  const hostname = window.location.hostname;
  
  let source = 'direct';
  let medium = 'direct';
  
  if (referrer) {
    try {
      const referrerURL = new URL(referrer);
      const referrerHost = referrerURL.hostname;
      
      if (referrerHost.includes('facebook.com')) {
        source = 'facebook';
        medium = 'social';
      } else if (referrerHost.includes('instagram.com')) {
        source = 'instagram';
        medium = 'social';
      } else if (referrerHost.includes('twitter.com') || referrerHost.includes('x.com')) {
        source = 'twitter';
        medium = 'social';
      } else if (referrerHost.includes('linkedin.com')) {
        source = 'linkedin';
        medium = 'social';
      } else if (referrerHost.includes('google.com')) {
        source = 'google';
        medium = 'organic';
      } else if (referrerHost.includes('youtube.com')) {
        source = 'youtube';
        medium = 'social';
      } else if (referrerHost.includes('whatsapp.com')) {
        source = 'whatsapp';
        medium = 'social';
      } else if (referrerHost === hostname) {
        source = 'internal';
        medium = 'internal';
      } else {
        source = referrerHost || 'referral';
        medium = 'referral';
      }
    } catch (e) {
      console.error('Error parsing referrer:', e);
    }
  }
  
  return { source, medium, referrer };
};

// Initialize campaign tracking on page load
export const initializeCampaignTracking = () => {
  if (typeof window === 'undefined') return;
  
  // Capture UTM parameters
  const utmData = captureUTMParameters();
  const trafficSource = getTrafficSource();
  
  // Send initial session data to GA4
  if (utmData || trafficSource) {
    trackGA4Event('page_view', {
      utm_source: utmData?.utm_source || trafficSource?.source,
      utm_medium: utmData?.utm_medium || trafficSource?.medium,
      utm_campaign: utmData?.utm_campaign,
      traffic_source: trafficSource?.source,
      referrer: trafficSource?.referrer,
    });
  }
};

// Type declarations for global window objects
declare global {
  interface Window {
    gtag: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
    fbq: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
  }
}
