# 🎯 Campaign Tracking - Quick Reference Card

## What's Working Now ✅

- **UTM Parameter Tracking** - `?utm_source=facebook`
- **Traffic Source Detection** - Auto-detects where users come from
- **Purchase Attribution** - Knows which campaign drove the sale
- **GA4 Integration** - All data goes to Google Analytics

---

## 3 Steps to Start Tracking

### Step 1: Create UTM Links (5 min)

Go to: https://ga-dev-tools.google/ga4/campaign-url-builder/

Fill in:
- Website URL: `https://notesninja.com/pdp/products`
- Campaign source: `facebook` (or google, instagram, email, etc)
- Campaign medium: `paid_social` (or paid_search, organic, etc)
- Campaign name: `spring_sale_2025`

Get: `https://notesninja.com/pdp/products?utm_source=facebook&utm_medium=paid_social&utm_campaign=spring_sale_2025`

### Step 2: Use the Links in Your Ads (2 min)

Replace plain links with UTM-tagged links in:
- Facebook Ads
- Google Ads
- Instagram Posts
- Email Campaigns
- YouTube Descriptions

### Step 3: Monitor Results (Ongoing)

Open Google Analytics → **Acquisition** → **Traffic Acquisition**
See which campaigns bring customers!

---

## UTM Quick Templates

Copy/paste these and just change the values:

**Facebook Ads:**
```
?utm_source=facebook&utm_medium=paid_social&utm_campaign=CAMPAIGN_NAME
```

**Google Ads:**
```
?utm_source=google&utm_medium=paid_search&utm_campaign=CAMPAIGN_NAME
```

**Instagram Organic:**
```
?utm_source=instagram&utm_medium=organic&utm_campaign=CAMPAIGN_NAME
```

**Email Newsletter:**
```
?utm_source=email&utm_medium=newsletter&utm_campaign=CAMPAIGN_NAME
```

**YouTube:**
```
?utm_source=youtube&utm_medium=organic&utm_campaign=CAMPAIGN_NAME
```

**WhatsApp:**
```
?utm_source=whatsapp&utm_medium=social&utm_campaign=CAMPAIGN_NAME
```

---

## Campaign Naming Examples

✅ GOOD:
- `spring_sale_2025`
- `neet_biology_feb`
- `50percent_off_email`
- `facebook_video_ads_v1`

❌ AVOID:
- `Campaign1` (too generic)
- `Spring Sale 2025` (spaces break things)
- `SPRING SALE 2025` (inconsistent capitalization)
- `My Campaign!@#` (special characters break things)

---

## Test It (2 min)

```
1. Copy this test link:
https://notesninja.com?utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign

2. Open link in browser

3. Open DevTools (F12 or Cmd+Option+I)

4. Go to Console tab

5. Look for: 📍 UTM Data Captured: {...}

6. If you see it = ✅ WORKING!
```

---

## Daily Checklist

- [ ] Are all ad links using UTM parameters?
- [ ] Are campaign names consistent?
- [ ] Did I check GA4 today?
- [ ] Which campaign had the most sales?
- [ ] Which campaign had the best ROI?

---

## Where to Find Data

| Question | Where to Look |
|----------|---------------|
| Which campaign drove sales? | Acquisition → Traffic Acquisition |
| What's the ROI? | Create custom report: Revenue ÷ Ad Spend |
| Real-time purchases? | Realtime → Overview |
| Customer details? | User → Audience |
| Which ad perform best? | Acquisition → Campaign |

---

## Common Campaign Sources

| Source | Type | Example |
|--------|------|---------|
| `facebook` | Social Paid | FB Ads |
| `instagram` | Social Paid | Instagram Ads |
| `google` | Search Paid | Google Ads |
| `tiktok` | Social Paid | TikTok Ads |
| `youtube` | Video | YouTube Channel |
| `email` | Email | Newsletter |
| `direct` | Direct | Typed URL |
| `organic_social` | Organic | Posted link |
| `referral` | Other sites | Mentioned on blog |

---

## Common Campaign Mediums

| Medium | Use For |
|--------|---------|
| `paid_social` | Paid social ads |
| `paid_search` | Google/Bing paid search |
| `organic` | Organic social/search |
| `email` | Email campaigns |
| `social` | Any social platform |
| `display` | Display ads |
| `affiliate` | Affiliate links |
| `newsletter` | Email newsletter |
| `direct` | Direct traffic |

---

## Pro Tips 💡

1. **Be Consistent**
   - Use same campaign names across platforms
   - Use same format: lowercase, underscores
   - Don't change names mid-campaign

2. **Be Specific**
   - Include month: `feb_2025`
   - Include version: `v1`, `v2`
   - Include channel: `facebook_video`, `google_search`

3. **Track Everything**
   - Every ad platform gets UTM
   - Every email campaign gets UTM
   - Every social post gets UTM
   - Every affiliate link gets UTM

4. **Review Weekly**
   - Check GA4 every Monday
   - See which campaigns work
   - Double down on winners
   - Kill losers

5. **Calculate ROI**
   - Revenue from campaign ÷ Ad spend = ROI
   - Example: ₹5,000 revenue ÷ ₹2,500 spent = 2x ROI = 100%

---

## Troubleshooting

**UTM not appearing in GA4:**
- ✓ Check URL has `?utm_source=...`
- ✓ Check console for "📍 UTM Data Captured"
- ✓ Wait 24 hours (GA4 needs time to process)
- ✓ Check GA4 Realtime (updates every 1-2 min)

**GA4 not showing purchase:**
- ✓ Verify purchase tracking is firing (check console)
- ✓ Check if Razorpay integration is working
- ✓ Look in GA4 Realtime tab
- ✓ Wait 24 hours for reports to update

**Campaign name showing as (not set):**
- ✓ You didn't use UTM link OR
- ✓ User came directly (no campaign)
- ✓ This is normal for organic/direct traffic

---

## Monthly Report Template

**February 2025 Campaign Performance**

| Campaign | Platform | Spend | Revenue | ROI | Status |
|----------|----------|-------|---------|-----|--------|
| spring_sale | Facebook | ₹5,000 | ₹5,988 | 119% | ✅ SCALE UP |
| biology_keys | Google | ₹3,500 | ₹3,992 | 114% | ✅ SCALE UP |
| weekly_email | Email | ₹500 | ₹2,495 | 399% | ✅ MAXIMIZE |
| insta_stories | Instagram | ₹2,000 | ₹998 | 45% | ❌ PAUSE |
| direct | Direct | ₹0 | ₹1,996 | — | ✅ MONITOR |

**Insights:**
- Best ROI: Email (399%)
- Best Volume: Facebook (₹5,988)
- Worst: Instagram (45%)

**Next Month Actions:**
- Scale Facebook + Email
- Pause Instagram
- Test new email subject lines

---

## Important Files to Reference

📄 **TRACKING_GUIDE.md** - Detailed technical guide  
📄 **CAMPAIGN_TRACKING_SETUP.md** - Step-by-step setup  
📄 **IMPLEMENTATION_SUMMARY.md** - What was implemented  
📄 **TRACKING_FLOW_DIAGRAM.md** - Visual explanations  

---

## Questions? Check These Files First

| Question | File |
|----------|------|
| How do I create UTM links? | CAMPAIGN_TRACKING_SETUP.md |
| What was implemented? | IMPLEMENTATION_SUMMARY.md |
| How does it work technically? | TRACKING_GUIDE.md |
| Show me visually | TRACKING_FLOW_DIAGRAM.md |

---

## 🚀 You're All Set!

✅ Campaign tracking is live  
✅ Purchase attribution is working  
✅ GA4 is receiving data  

**Next:** Create your first UTM link and test! 🎯

