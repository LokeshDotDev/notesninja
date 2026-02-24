# Quick Setup: Campaign & Purchase Tracking

## ✅ What I've Added to Your Code

### 1. **UTM Parameter Tracking** 
   - `captureUTMParameters()` - Captures URL query params like `?utm_source=facebook`
   - `getUTMParameters()` - Retrieves stored UTM data

### 2. **Traffic Source Detection**
   - `getTrafficSource()` - Detects if user came from Facebook, Google, direct, etc
   - Identifies: Facebook, Instagram, Twitter/X, LinkedIn, YouTube, Google, WhatsApp

### 3. **Enhanced Purchase Tracking**
   - Updated `trackPurchase()` to include campaign source
   - Now logs: Which campaign, which platform, which traffic source

### 4. **Auto-Initialization**
   - `initializeCampaignTracking()` - Runs automatically on page load
   - GoogleAnalytics component now calls this automatically

---

## 📝 How It Works

### Example User Journey:

```
1. User sees your Facebook ad: 
   "Get NEET Biology Notes - 50% OFF"
   
2. Clicks link with UTM:
   https://notesninja.com/pdp/neet-biology?utm_source=facebook&utm_medium=paid_social&utm_campaign=neet_spring_2025

3. Visits your site → System captures:
   ✅ utm_source = facebook
   ✅ utm_medium = paid_social  
   ✅ utm_campaign = neet_spring_2025

4. User buys the product

5. In Google Analytics you see:
   "Purchase from Facebook campaign NEET_Spring_2025 - ₹499"
```

---

## 🎯 Your Next Steps

### Step 1: Create UTM Links for All Marketing
Use this tool: https://ga-dev-tools.google/ga4/campaign-url-builder/

**Examples:**

```
Facebook Paid Ads:
https://notesninja.com/pdp/products?utm_source=facebook&utm_medium=paid_social&utm_campaign=spring_sale_2025

Google Search Ads:
https://notesninja.com/pdp/products?utm_source=google&utm_medium=paid_search&utm_campaign=biology_keywords

Instagram Organic:
https://notesninja.com/pdp/products?utm_source=instagram&utm_medium=organic&utm_campaign=student_motivation

Email Newsletter:
https://notesninja.com/pdp/products?utm_source=email&utm_medium=newsletter&utm_campaign=weekly_offer

YouTube Channel:
https://notesninja.com/pdp/products?utm_source=youtube&utm_medium=organic&utm_campaign=explainer_video
```

### Step 2: Add Links to Your Campaigns
Replace plain links with UTM-tagged links in:
- ✅ Facebook Ads
- ✅ Google Ads
- ✅ Instagram Posts
- ✅ Email Campaigns
- ✅ YouTube Descriptions
- ✅ WhatsApp Broadcast

### Step 3: Check Google Analytics
1. Open https://analytics.google.com
2. Go to **Acquisition** → **Traffic Acquisition**
3. Look at **Sessions by Source/Medium**
4. Filter by **Purchase** conversion
5. See which campaigns are making money!

---

## 🧪 Test It Now!

### Test Link:
```
https://notesninja.com/pdp/products?utm_source=test_facebook&utm_medium=paid_social&utm_campaign=test_tracking_2025
```

### Test Steps:
1. Open the link above
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for message: `📍 UTM Data Captured: {...}`
5. Complete a purchase
6. Check GA4 Realtime to see the purchase event

### Expected Console Output:
```javascript
📍 UTM Data Captured: {
  utm_source: "test_facebook",
  utm_medium: "paid_social",
  utm_campaign: "test_tracking_2025"
}
🎯 Purchase tracked with attribution: {
  transaction_id: "12345",
  value: 499,
  currency: "INR",
  utm_source: "test_facebook",
  utm_medium: "paid_social",
  utm_campaign: "test_tracking_2025",
  ...
}
```

---

## 📊 What You'll See in Google Analytics

### Daily Report (Example):
| Date | Source | Campaign | Sessions | Purchases | Revenue |
|------|--------|----------|----------|-----------|---------|
| Feb 23 | facebook | spring_sale | 245 | 12 | ₹5,988 |
| Feb 23 | google | biology_keywords | 183 | 8 | ₹3,992 |
| Feb 23 | email | weekly_offer | 45 | 5 | ₹2,495 |
| Feb 23 | instagram | organic | 92 | 2 | ₹998 |
| Feb 23 | direct | - | 56 | 4 | ₹1,996 |

### ROI Calculation:
```
Facebook spent: ₹5,000 → Revenue: ₹5,988 → ROI: 119%
Google spent: ₹3,500 → Revenue: ₹3,992 → ROI: 114%
Email spent: ₹500 → Revenue: ₹2,495 → ROI: 399% ✅ BEST!
```

---

## ❓ FAQ

**Q: Why isn't it tracking my campaign?**
- Make sure you used the UTM link (check URL has `?utm_source=...`)
- Check DevTools console for "UTM Data Captured" message
- Wait 24 hours for GA4 to process data

**Q: Can I track affiliate links?**
- Yes! Use: `?utm_source=affiliate_name&utm_medium=affiliate&utm_campaign=affiliate_program`

**Q: What if user closes browser and comes back?**
- UTM data is stored in sessionStorage (current browser session only)
- Next visit from same person will be counted as "direct" (unless they click UTM link again)
- This is expected behavior

**Q: Can I see WHO purchased?**
- Not with UTM alone. You need User ID tracking (requires login)
- Then you can see: "User john@email.com from Facebook campaign bought"

**Q: How long to see data?**
- Real-time updates in GA4 Realtime dashboard (1-2 minutes)
- Regular reports update every 24 hours

---

## 🚀 Advanced: Track Individual Customers

Want to know: "Which customer purchased from which campaign?"

Add this to your checkout/success page:

```typescript
import { trackCustomerPurchase } from '@/lib/analytics';

// After successful payment
await trackCustomerPurchase({
  userId: user.id,
  email: user.email,
  purchaseValue: 499,
  transactionId: 'TXN123456',
  products: [{
    id: 'NEET_BIO_001',
    title: 'NEET Biology',
    price: 499
  }]
});
```

Then in GA4: **Users** → See exact customer data + which campaign brought them

---

## 📞 Need Help?

Check browser console for debug messages:
- ✅ "📍 UTM Data Captured" = Tracking working
- ✅ "🎯 Purchase tracked with attribution" = Purchase recorded
- ❌ If missing = Check DevTools console for errors

---

## Summary

✅ **Campaign tracking is now SET UP!**
✅ **Purchase tracking includes source info!**
✅ **Google Analytics ready for reports!**

**Your next action:** Create UTM links for your marketing and start using them! 🚀

