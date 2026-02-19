// Analytics tracking utilities for GA4 and Meta Pixel

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
export const trackGA4Event = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log(`📊 GA4 Event: ${eventName}`, parameters);
  }
};

// Meta Pixel Events
export const trackMetaEvent = (eventName: string, parameters?: Record<string, any>) => {
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
  // GA4
  trackGA4Event('purchase', {
    transaction_id: purchaseData.transactionId,
    value: purchaseData.value,
    currency: purchaseData.currency,
    items: purchaseData.products.map(product => ({
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      item_category: product.subcategory,
      price: product.price,
      quantity: 1
    }))
  });

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
export const trackLogin = (method: string = 'email') => {
  // GA4
  trackGA4Event('login', {
    method: method
  });

  // Meta Pixel
  trackMetaEvent('CompleteRegistration', {
    content_name: 'Login',
    status: 'completed'
  });
};

export const trackSignUp = (method: string = 'email') => {
  // GA4
  trackGA4Event('sign_up', {
    method: method
  });

  // Meta Pixel
  trackMetaEvent('CompleteRegistration', {
    content_name: 'Registration',
    status: 'completed'
  });
};

// 10. Error Tracking
export const trackError = (error: string, context?: string) => {
  // GA4
  trackGA4Event('exception', {
    description: error,
    fatal: false
  });

  console.error(`🚨 Analytics Error: ${error}`, context);
};

// 11. Custom Events
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
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

// Type declarations for global window objects
declare global {
  interface Window {
    gtag: (command: string, eventName: string, parameters?: Record<string, any>) => void;
    fbq: (command: string, eventName: string, parameters?: Record<string, any>) => void;
  }
}
