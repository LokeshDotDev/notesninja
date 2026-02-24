# Customer Purchase Tracking & Attribution Guide

## What You Want to Track
✅ **Which user purchased**  
✅ **Where they came from** (campaign, direct, social, referrer, etc)  
✅ **How they discovered your product**

---

## Current Status of Your Setup

### ✅ What's Already Set Up
Your analytics has **GA4 and Meta Pixel tracking**, but it's **missing campaign/traffic source attribution**.

Your current events:
- ✅ `view_item` - When user views product
- ✅ `begin_checkout` - When user starts checkout
- ✅ `add_payment_info` - Payment details entered
- ✅ `purchase` - Payment success
- ✅ `search` - When users search
- ✅ `login` / `sign_up` - User registration

### ❌ What's MISSING (Critical!)

**NO UTM Parameter Tracking** - Can't track campaigns!  
**NO Traffic Source Detection** - Can't tell if direct or referred!  
**NO Referrer Tracking** - Don't know where clicks came from!

---

## How to Fix It: Step-by-Step

### Step 1: Add UTM Parameter Tracking
UTM parameters are added to links like this:
```
https://notesninja.com/product?utm_source=facebook&utm_medium=paid_ad&utm_campaign=spring_sale
```

**Add this to `lib/analytics.ts`:**

```typescript
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
    Object.entries(utmData).filter(([_, v]) => v !== null)
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
```

### Step 2: Add Traffic Source Detection
Track where users are coming from:

```typescript
// Detect traffic source
export const getTrafficSource = () => {
  if (typeof window === 'undefined') return null;
  
  const referrer = document.referrer;
  const hostname = window.location.hostname;
  
  let source = 'direct';
  let medium = 'direct';
  
  if (referrer) {
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
    } else if (referrerHost === hostname) {
      source = 'internal';
      medium = 'internal';
    } else {
      source = referrerHost || 'referral';
      medium = 'referral';
    }
  }
  
  return { source, medium, referrer };
};
```

### Step 3: Update Purchase Tracking
Add traffic source to purchase events:

```typescript
export const trackPurchase = (purchaseData: PurchaseData) => {
  // Get UTM and traffic source data
  const utmData = getUTMParameters();
  const trafficSource = getTrafficSource();
  
  const fullPurchaseData = {
    transaction_id: purchaseData.transactionId,
    value: purchaseData.value,
    currency: purchaseData.currency,
    // ADD THIS ↓
    source: utmData?.utm_source || trafficSource?.source,
    medium: utmData?.utm_medium || trafficSource?.medium,
    campaign: utmData?.utm_campaign,
    referrer: trafficSource?.referrer,
    // ADD THIS ↑
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
  trackGA4Event('purchase', fullPurchaseData);
  
  // Meta Pixel
  trackMetaEvent('Purchase', {
    content_name: purchaseData.products[0]?.title,
    content_ids: purchaseData.products.map(p => p.id),
    value: purchaseData.value,
    currency: purchaseData.currency,
    transaction_id: purchaseData.transactionId
  });
};
```

### Step 4: Track Campaign on Every User Interaction
Add this to your layout or app initialization:

```typescript
// Add to components/analytics/GoogleAnalytics.tsx or layout.tsx
useEffect(() => {
  // Capture UTM parameters on page load
  const utmData = captureUTMParameters();
  const trafficSource = getTrafficSource();
  
  // Set GA4 session parameters
  if (utmData || trafficSource) {
    window.gtag('config', GA_ID, {
      'campaign_name': utmData?.utm_campaign,
      'campaign_source': utmData?.utm_source || trafficSource?.source,
      'campaign_medium': utmData?.utm_medium || trafficSource?.medium,
    });
  }
}, []);
```

---

## How to Use This in Your Marketing

### Creating Tracked Links

**Facebook Ads:**
```
https://notesninja.com/product?utm_source=facebook&utm_medium=paid_social&utm_campaign=spring_sale_v1
```

**Google Ads:**
```
https://notesninja.com/product?utm_source=google&utm_medium=paid_search&utm_campaign=biology_exam_prep
```

**Email Campaign:**
```
https://notesninja.com/product?utm_source=email&utm_medium=newsletter&utm_campaign=discount_offer
```

**Instagram Stories:**
```
https://notesninja.com/product?utm_source=instagram&utm_medium=social&utm_campaign=summer_promo
```

### View Results in Google Analytics

1. Go to **Google Analytics Dashboard**
2. Click **Acquisition** → **Traffic Acquisition** → **Sessions by Source/Medium**
3. Filter by **Purchase** conversion
4. See which campaigns are bringing paying customers

---

## What Data You'll Get

After setup, in Google Analytics you'll see:

| Source | Medium | Campaign | Conversions | Revenue |
|--------|--------|----------|-------------|---------|
| facebook | paid_social | spring_sale | 45 | ₹45,000 |
| google | paid_search | biology_prep | 32 | ₹32,000 |
| direct | direct | - | 28 | ₹28,000 |
| instagram | social | summer_v2 | 18 | ₹18,000 |
| email | newsletter | discount | 12 | ₹12,000 |

---

## Additional Tracking: Customer ID

To track individual customers, add this:

```typescript
export const trackUserPurchase = async (userId: string, customerEmail: string, purchaseData: PurchaseData) => {
  const hashedEmail = await sha256Hash(customerEmail);
  
  // Track with user ID
  trackGA4Event('purchase', {
    ...purchaseData,
    user_id: userId,
    user_data: {
      email: hashedEmail
    }
  });
  
  // Now you can see: User X from Facebook campaign bought product Y
};
```

---

## Implementation Checklist

- [ ] Add `captureUTMParameters()` function to analytics.ts
- [ ] Add `getTrafficSource()` function to analytics.ts
- [ ] Update `trackPurchase()` to include traffic source
- [ ] Add initialization code to capture UTM on page load
- [ ] Test with sample URLs with UTM parameters
- [ ] Create UTM links for all your campaigns
- [ ] Set up GA4 goals/conversions for purchase
- [ ] Check GA4 dashboard weekly

---

## Testing

**Test Link (with UTM):**
```
https://notesninja.com/product?utm_source=test&utm_medium=manual&utm_campaign=tracking_test
```

Open this link, go through purchase flow, and check:
1. **Google Analytics** (Realtime) → See the event
2. **Browser DevTools Console** → Look for "📍 UTM Data Captured" message
3. **GA4 Dashboard** → Traffic Acquisition report

**Expected output in console:**
```
📍 UTM Data Captured: {
  utm_source: "test",
  utm_medium: "manual",
  utm_campaign: "tracking_test"
}
```

---

## Questions?

**Q: Why use UTM parameters instead of just Google Ads integration?**  
A: UTM parameters work with ANY traffic source (email, social, affiliates, etc). Google Ads integration only works for Google Ads.

**Q: Does this track personal data?**  
A: No. UTM parameters are just URL tags. User privacy is protected by GA4's privacy settings.

**Q: Can I track specific users?**  
A: Yes! Use User ID feature - requires users to be logged in so you can link email to purchase.

