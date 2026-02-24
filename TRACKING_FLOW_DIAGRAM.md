# Campaign Tracking Flow Diagram

## 1. User Journey with Campaign Tracking

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

STEP 1: CAMPAIGN CLICK
┌──────────────────────────┐
│   Facebook Paid Ad       │
│   "Get NEET Notes 50%"   │
└────────────┬─────────────┘
             │
             ▼
   https://notesninja.com/pdp?
   utm_source=facebook
   &utm_medium=paid_social
   &utm_campaign=neet_spring_2025


STEP 2: WEBSITE VISIT
┌──────────────────────────────────────────────┐
│  Browser loads page                          │
│  ✅ JavaScript detects UTM parameters       │
│  ✅ Stores in sessionStorage                │
│  ✅ Sends to GA4                            │
└────────────┬─────────────────────────────────┘
             │
             ▼
   📍 UTM Data Captured:
   {
     utm_source: "facebook",
     utm_medium: "paid_social",
     utm_campaign: "neet_spring_2025"
   }


STEP 3: PRODUCT BROWSING
┌────────────────────────────┐
│  User views product        │
│  trackViewItem() fired     │
│  Campaign data included    │
└────────────┬───────────────┘
             │
             ▼
   GA4 Event: view_item
   - Product: NEET Biology
   - Campaign: neet_spring_2025
   - Source: facebook


STEP 4: ADD TO CART / CHECKOUT
┌───────────────────────────────────┐
│  User adds to cart                │
│  trackBeginCheckout() fired       │
│  Campaign data included           │
└────────────┬──────────────────────┘
             │
             ▼
   GA4 Event: begin_checkout
   - Campaign: neet_spring_2025
   - Source: facebook


STEP 5: PAYMENT
┌──────────────────────────────────┐
│  User enters payment info        │
│  trackAddPaymentInfo() fired    │
│  Campaign data included          │
└────────────┬─────────────────────┘
             │
             ▼
   GA4 Event: add_payment_info
   - Campaign: neet_spring_2025
   - Source: facebook


STEP 6: PURCHASE COMPLETE ✅
┌──────────────────────────────────┐
│  Payment successful              │
│  trackPurchase() fired          │
│  ✅ With campaign attribution   │
└────────────┬─────────────────────┘
             │
             ▼
   🎯 Purchase tracked with attribution: {
     transaction_id: "TXN123456",
     value: 499,
     currency: "INR",
     utm_source: "facebook",        ← KEY!
     utm_medium: "paid_social",     ← KEY!
     utm_campaign: "neet_spring_2025" ← KEY!
   }


STEP 7: GOOGLE ANALYTICS REPORTS
┌──────────────────────────────────────────────────────┐
│  GA4 Dashboard shows:                               │
│                                                     │
│  Campaign Report:                                  │
│  ┌─────────────────────────────────────────────┐  │
│  │ Source  │ Campaign      │ Revenue │ Conv    │  │
│  ├─────────┼───────────────┼─────────┼────────┤  │
│  │facebook │neet_spring... │ ₹5,988  │ 12     │  │
│  │google   │biology_key... │ ₹3,992  │  8     │  │
│  │email    │weekly_offer   │ ₹2,495  │  5     │  │
│  └─────────┴───────────────┴─────────┴────────┘  │
│                                                     │
│  ✅ Now you know: Facebook ads work best!          │
└──────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE (BROWSER)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page Load                                                       │
│      ▼                                                            │
│  ┌──────────────────────────────────┐                           │
│  │ GoogleAnalytics Component        │                           │
│  │ (components/analytics/...)       │                           │
│  └────────┬─────────────────────────┘                           │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────────────────────────────┐                  │
│  │ initializeCampaignTracking()             │                  │
│  │ (lib/analytics.ts)                       │                  │
│  └────────┬─────────────────────────────────┘                  │
│           │                                                     │
│           ├──▶ captureUTMParameters()                           │
│           │    - Read URL query params                          │
│           │    - Check for ?utm_source=...                     │
│           │    - Store in sessionStorage                        │
│           │                                                     │
│           └──▶ getTrafficSource()                               │
│                - Check document.referrer                        │
│                - Detect platform (facebook, google, etc)        │
│                - Return source + medium                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                   TRACKING EVENTS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Action          Function Called         GA4 Event        │
│  ───────────          ───────────────         ────────         │
│  Views Product    →   trackViewItem()    →    view_item        │
│  Starts Checkout  →   trackBeginCheckout()    begin_checkout   │
│  Adds Payment     →   trackAddPaymentInfo()   add_payment_info │
│  Completes Buy    →   trackPurchase()    →    purchase ✅      │
│                                          (with attribution)     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                 DATA WITH ATTRIBUTION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Event Data:                                                   │
│  ┌─────────────────────────────────────┐                       │
│  │ transaction_id: "TXN123456"         │                       │
│  │ value: 499                          │                       │
│  │ currency: "INR"                     │                       │
│  │ utm_source: "facebook"         ◄──┐ │                       │
│  │ utm_medium: "paid_social"      ◄──┤ │ From captureUTMParams │
│  │ utm_campaign: "neet_2025"      ◄──┤ │ or getTrafficSource   │
│  │ traffic_source: "facebook"     ◄──┘ │                       │
│  └─────────────────────────────────────┘                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              SENDS TO GOOGLE ANALYTICS (GA4)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  trackGA4Event('purchase', {                                   │
│    transaction_id, value, currency,                            │
│    utm_source, utm_medium, utm_campaign,  ← Attribution data  │
│    items: [...]                                                │
│  })                                                             │
│      ▼                                                          │
│  window.gtag('event', 'purchase', {...})                       │
│      ▼                                                          │
│  Google Analytics servers                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                              ▼
                    
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE ANALYTICS CLOUD                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Stores and processes:                                         │
│  - Purchase event with campaign attribution                    │
│  - Associates with user ID / session ID                        │
│  - Builds reports and dashboards                               │
│                                                                 │
│  Available Reports:                                            │
│  • Traffic Acquisition (by Source/Medium)                      │
│  • Campaign Performance (by utm_campaign)                      │
│  • Conversion by Campaign                                      │
│  • ROI by Campaign                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. UTM Parameter Capture Logic

```
URL Received
    │
    ▼
┌─────────────────────────────────┐
│ Extract Query Params            │
│ (?utm_source=facebook&...)      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Check each parameter:           │
│ ✓ utm_source                    │
│ ✓ utm_medium                    │
│ ✓ utm_campaign                  │
│ ✓ utm_content                   │
│ ✓ utm_term                      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Filter out NULL values          │
│ (Keep only present params)      │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Store in sessionStorage         │
│ Persists during user session    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Available until:                │
│ • Browser tab closed            │
│ • New session started           │
│ • 24 hours pass                 │
└─────────────────────────────────┘
```

---

## 4. Traffic Source Detection

```
User visits your website
        │
        ▼
┌──────────────────────────────────────┐
│ Check document.referrer              │
│ (Where did they come from?)          │
└────────┬─────────────────────────────┘
         │
         ├─ NULL/Empty  →  "direct" (typed URL)
         │
         ├─ facebook.com  →  "facebook" (social)
         │
         ├─ instagram.com  →  "instagram" (social)
         │
         ├─ google.com  →  "google" (organic)
         │
         ├─ youtube.com  →  "youtube" (social)
         │
         ├─ twitter.com/x.com  →  "twitter" (social)
         │
         ├─ linkedin.com  →  "linkedin" (social)
         │
         ├─ whatsapp.com  →  "whatsapp" (social)
         │
         └─ other domain  →  That domain (referral)


Result: { source: "facebook", medium: "social" }
```

---

## 5. Purchase Funnel with Attribution

```
100 Facebook Users
        │
        ├─▶ 20 click ad
        │       │
        │       ├─▶ 15 visit website
        │       │       │
        │       │       ├─▶ 10 view product
        │       │       │       │
        │       │       │       ├─▶ 8 add to cart
        │       │       │       │       │
        │       │       │       │       ├─▶ 5 checkout
        │       │       │       │       │       │
        │       │       │       │       │       ├─▶ 4 pay
        │       │       │       │       │       │       │
        │       │       │       │       │       │       ├─▶ 3 PURCHASE ✅
        │       │       │       │       │       │       │
        │       │       │       │       │       │       └─▶ 1 ABANDONED
        │       │       │       │       │       │
        │       │       │       │       │       └─▶ 3 ABANDONED
        │       │       │       │       │
        │       │       │       │       └─▶ 3 ABANDONED
        │       │       │       │
        │       │       │       └─▶ 2 ABANDONED
        │       │       │
        │       │       └─▶ 5 BOUNCE
        │       │
        │       └─▶ 5 DON'T LOAD
        │
        └─▶ 80 DON'T CLICK


METRICS:
• CTR (Click Through Rate) = 20%
• Visit Rate = 75%
• View Rate = 67%
• Add to Cart Rate = 80%
• Checkout Rate = 63%
• Purchase Rate = 60%
• Overall Conversion = 3%
• Revenue = 3 × ₹499 = ₹1,497


INSIGHTS:
✓ High CTR = Good ad creative
✓ Low bounce = Good landing page
✗ High cart abandonment = Friction in checkout
✓ Final conversion = 60% → GOOD!
```

---

## 6. Analytics Dashboard View

```
╔═══════════════════════════════════════════════════════════════════╗
║           GOOGLE ANALYTICS - CAMPAIGN PERFORMANCE                ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Date Range: Feb 1 - Feb 28, 2025                               ║
║                                                                   ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │ CONVERSION BY CAMPAIGN                                  │   ║
║  ├──────────────────────────────────────────────────────────┤   ║
║  │ Campaign          │ Sessions │ Purchases │ Revenue    │ ROI│   ║
║  ├───────────────────┼──────────┼───────────┼────────────┼────┤   ║
║  │ neet_spring_2025  │   245    │    12     │ ₹5,988    │119%│   ║
║  │ biology_keywords  │   183    │     8     │ ₹3,992    │114%│   ║
║  │ weekly_email      │    45    │     5     │ ₹2,495    │399%│   ║
║  │ student_stories   │    92    │     2     │   ₹998    │ 45%│   ║
║  │ direct            │    56    │     4     │ ₹1,996    │  —%│   ║
║  ├───────────────────┼──────────┼───────────┼────────────┼────┤   ║
║  │ TOTAL             │   621    │    31     │ ₹15,469   │    │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                   ║
║  KEY INSIGHTS:                                                  ║
║  ✅ Weekly email has BEST ROI (399%)                            ║
║  ✅ Facebook spring campaign has HIGH volume + good ROI         ║
║  ❌ Instagram stories campaign underperforming (45% ROI)        ║
║                                                                   ║
║  ACTIONS:                                                       ║
║  → Scale up: Weekly email campaign                             ║
║  → Scale up: Facebook spring ads                               ║
║  → Optimize: Instagram story content                           ║
║  → Test: New call-to-action on direct traffic                 ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 7. Code Execution Timeline

```
TIME: T=0
PAGE LOAD TRIGGERED
    │
    ▼ (Immediately)
┌──────────────────────────────────────────┐
│ GoogleAnalytics component renders        │
│ useEffect hook runs                      │
└────────┬─────────────────────────────────┘
    │
    ▼ (T+0ms)
┌──────────────────────────────────────────┐
│ initializeCampaignTracking() called      │
│ Checks URL for ?utm_...                  │
└────────┬─────────────────────────────────┘
    │
    ├──▶ captureUTMParameters()
    │    └─▶ Stores in sessionStorage
    │        └─▶ Logs: "📍 UTM Data Captured"
    │
    └──▶ getTrafficSource()
         └─▶ Checks document.referrer
             └─▶ Returns: {source, medium}


TIME: T+100ms (User action)
USER CLICKS PRODUCT
    │
    ▼
trackViewItem() called
    │
    ▼
Combines data:
{
  product: {id, name, price, ...},
  utm_data: {source: "facebook", ...},
  traffic_source: {source: "facebook", ...}
}
    │
    ▼
window.gtag('event', 'view_item', {...})
    │
    ▼
✅ Data sent to Google Analytics


TIME: T+2000ms (User makes purchase)
PAYMENT SUCCESS
    │
    ▼
trackPurchase() called
    │
    ▼
getUTMParameters() + getTrafficSource()
retrieves stored campaign data
    │
    ▼
fullEventData = {
  transaction_id: "TXN123",
  value: 499,
  utm_source: "facebook",      ← Key attribution data
  utm_campaign: "neet_2025",
  ...
}
    │
    ▼
trackGA4Event('purchase', fullEventData)
trackMetaEvent('Purchase', {...})
    │
    ▼
Console logs: "🎯 Purchase tracked with attribution"
    │
    ▼
✅ Data with attribution sent to GA4 + Meta
```

---

## Summary

The system works in 3 phases:

1. **CAPTURE PHASE** (Page Load)
   - Read UTM from URL OR
   - Detect from referrer
   - Store for session

2. **TRACKING PHASE** (User Actions)
   - Every action includes campaign data
   - Events: view → add to cart → purchase

3. **ATTRIBUTION PHASE** (Purchase)
   - Purchase event includes source
   - GA4 knows: which campaign → which sale
   - Reports show: ROI by campaign

**Result:** Complete visibility into customer acquisition! 🎯

