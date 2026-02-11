# Environment Variables Checklist for Production

## 🚨 CRITICAL: Copy ALL these to your production deployment

### Required for Post Creation to Work

```bash
# ===================================
# DATABASE
# ===================================
DATABASE_URL="your_production_database_url"

# ===================================
# CLOUDINARY (File Uploads)
# ===================================
# ⚠️ CRITICAL: Without these, post creation will fail!
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dtan6xot2"
CLOUDINARY_API_KEY="955171912794399"
CLOUDINARY_API_SECRET="qcWuMqE3ON3G3_DtrrJ--Oetlco"
CLOUDINARY_URL="cloudinary://955171912794399:qcWuMqE3ON3G3_DtrrJ--Oetlco@dtan6xot2"

# ===================================
# CLERK AUTHENTICATION
# ===================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_dGVuZGVyLWJlZXRsZS0yMS5jbGVyay5hY2NvdW50cy5kZXYk"
CLERK_SECRET_KEY="your_clerk_secret_key_here"

# ===================================
# CLERK ROUTES
# ===================================
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# ===================================
# SITE CONFIGURATION
# ===================================
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# ===================================
# RAZORPAY (Optional - for payments)
# ===================================
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# ===================================
# ANALYTICS (Optional)
# ===================================
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_GTM_ID=""

# ===================================
# EMAIL (Optional - if using email features)
# ===================================
BREVO_API_KEY=""
```

---

## 📋 Step-by-Step Deployment Checklist

### For Vercel:

1. **Go to your project on Vercel**
   - Visit: https://vercel.com/dashboard

2. **Navigate to Settings → Environment Variables**

3. **Add each variable above**
   - Click "Add New"
   - Enter Variable Name (e.g., `CLOUDINARY_API_KEY`)
   - Enter Value
   - Select environments: Production, Preview, Development
   - Click "Save"

4. **CRITICAL: After adding ALL variables**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Select "Redeploy with existing Build Cache" or "Redeploy from scratch"

5. **Verify deployment**
   - Wait for deployment to complete
   - Visit: `https://yourdomain.com/api/health-check`
   - Check that all values show `true`

---

### For Netlify:

1. **Go to your site on Netlify**
   - Visit: https://app.netlify.com/

2. **Navigate to Site Settings → Environment Variables**

3. **Add each variable**
   - Click "Add a variable"
   - Select "Add a single variable"
   - Enter Key and Value
   - Click "Create variable"

4. **CRITICAL: Trigger new deployment**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

5. **Verify**
   - Visit: `https://yourdomain.com/api/health-check`

---

## 🔍 Verification Steps

### 1. Check Health Endpoint
```bash
curl https://yourdomain.com/api/health-check
```

Should return:
```json
{
  "status": "healthy",
  "checks": {
    "cloudinary": {
      "cloudName": true,
      "apiKey": true,
      "apiSecret": true
    },
    "database": {
      "configured": true,
      "connected": true
    }
  }
}
```

### 2. Check Production Logs
- **Vercel**: Run `vercel logs` or check dashboard
- **Netlify**: Check "Functions" tab for logs

Look for:
- ✓ "Environment check" showing all values as "✓ Set"
- ✗ Any "✗ Missing" indicators
- ✗ Cloudinary errors
- ✗ Database connection errors

### 3. Test Post Creation
1. Go to `/admin` on production
2. Try creating a simple post (no files first)
3. Check browser console for errors
4. Check production logs for detailed output

---

## 🐛 Common Issues

### Issue: "Cloudinary credentials are not found"
**Solution**: 
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Verify `CLOUDINARY_API_KEY` is set
- Verify `CLOUDINARY_API_SECRET` is set
- Redeploy after adding

### Issue: "Failed to create post" (400 error)
**Solution**:
- Check required fields: title, description, categoryId
- Verify form is sending all required data

### Issue: "Failed to create post" (500 error)
**Solution**:
- Check production logs for detailed error
- Usually database connection or Cloudinary issue

### Issue: Request timeout
**Solution**:
- Check deployment tier limits
- Consider implementing client-side uploads
- Reduce file sizes

---

## 🎯 Quick Verification Script

Run this after deployment to verify environment:

```bash
# Check health
curl https://yourdomain.com/api/health-check | jq

# Should show "status": "healthy"
# All "checks" should be true
```

---

## ⚠️ SECURITY NOTE

- Never commit these values to Git
- Keep `.env` in `.gitignore`
- Only add to production via deployment platform UI
- Rotate credentials if accidentally exposed

---

## 🚀 After Everything is Set Up

1. ✅ All environment variables added
2. ✅ New deployment triggered
3. ✅ Health check passes
4. ✅ Post creation works!

**If post creation still fails:**
- Check the debug guide: `POST_CREATION_DEBUG_GUIDE.md`
- Review production logs for specific errors
- Use the detailed logging we added to `/api/posts/route.ts`
