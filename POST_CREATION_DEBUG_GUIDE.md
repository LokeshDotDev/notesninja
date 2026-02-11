# Post Creation Debugging Guide

## Issue: Posts work locally but fail in production

### Common Causes & Solutions

---

## 1. ⚠️ MISSING ENVIRONMENT VARIABLES (Most Common)

### Check Your Production Environment Variables

Your deployment platform (Vercel/Netlify/etc.) needs ALL these environment variables:

```env
# Database
DATABASE_URL=your_production_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Cloudinary (CRITICAL for file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dtan6xot2
CLOUDINARY_API_KEY=955171912794399
CLOUDINARY_API_SECRET=qcWuMqE3ON3G3_DtrrJ--Oetlco

# Site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### How to Fix:
- **Vercel**: Go to Project Settings → Environment Variables
- **Netlify**: Go to Site Settings → Environment Variables
- Add EACH variable from your `.env` file
- **IMPORTANT**: After adding variables, redeploy!

---

## 2. 🔒 CLOUDINARY CONFIGURATION ISSUE

### Problem:
The Cloudinary library might fail silently in production if:
- API credentials are missing
- Cloud name is incorrect
- API secret is wrong

### How to Verify:
Check the server logs in your production dashboard for errors like:
- "Cloudinary credentials are not found"
- "Error uploading the content to Cloudinary"
- 401/403 errors from Cloudinary

### Fix:
1. Verify Cloudinary credentials in production env
2. Make sure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` starts with `NEXT_PUBLIC_` (it's used client-side)
3. Test by creating a simple post without files first

---

## 3. ⏱️ TIMEOUT ISSUES (Vercel Specific)

### Problem:
- **Vercel Free/Hobby**: 10 second timeout
- **Vercel Pro**: 60 second timeout
- Large file uploads might timeout

### Current Configuration:
```typescript
// In /app/api/posts/route.ts
export const maxDuration = 300; // 5 minutes - only works on Pro+
```

### Fix for Free Tier:
If you're on Vercel Free tier:

```typescript
// Update /app/api/posts/route.ts
export const maxDuration = 10; // Match free tier limit
```

And implement **chunked uploads** or **direct Cloudinary uploads from client**.

---

## 4. 📦 BODY SIZE LIMIT

### Problem:
Production platforms have stricter body size limits than localhost.

### Current Config:
```typescript
// next.config.ts
experimental: {
  serverActions: {
    bodySizeLimit: '500mb', // Might be too large for some platforms
  },
}
```

### Platform Limits:
- **Vercel**: 4.5 MB request body (on free tier)
- **Netlify**: 6 MB
- **Cloudflare Pages**: 100 MB

### Fix:
Implement **direct Cloudinary uploads** from the client-side instead of routing through your API:

1. Generate a signed upload URL on the server
2. Upload files directly from client to Cloudinary
3. Save only the URLs to your database

---

## 5. 🗄️ DATABASE CONNECTION ISSUES

### Problem:
Production database might have:
- Connection pooling limits
- Different connection string format
- Geographic latency

### How to Check:
```bash
# Test database connection
npx prisma db pull
```

### Fix:
1. Verify `DATABASE_URL` in production environment
2. Check database connection limits
3. Consider using Prisma Data Proxy for serverless

---

## 6. 🔍 DEBUGGING STEPS

### Step 1: Check Production Logs
```bash
# For Vercel
vercel logs

# Check for errors in deployment dashboard
```

Look for:
- "Missing required fields"
- "Cloudinary credentials are not found"
- "Failed to create post"
- Timeout errors
- Database connection errors

### Step 2: Test Without Files
Try creating a post without uploading any files first:
- Just title, description, and category
- If this works, problem is with file uploads
- If this fails, check database/environment variables

### Step 3: Check Browser Console
Open browser DevTools → Network tab:
- Find the POST request to `/api/posts`
- Check status code (400, 401, 500, etc.)
- View response body for error messages

### Step 4: Add More Logging
Update `/app/api/posts/route.ts`:

```typescript
export async function POST(req: NextRequest) {
  console.log("=== POST /api/posts started ===");
  
  try {
    console.log("1. Parsing form data...");
    const formData = await req.formData();
    
    console.log("2. Extracting fields...");
    const title = formData.get("title") as string;
    console.log("   - Title:", title);
    
    console.log("3. Checking Cloudinary config...");
    console.log("   - Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✓" : "✗");
    console.log("   - API Key:", process.env.CLOUDINARY_API_KEY ? "✓" : "✗");
    console.log("   - API Secret:", process.env.CLOUDINARY_API_SECRET ? "✓" : "✗");
    
    // ... rest of code
  } catch (error) {
    console.error("=== ERROR in POST /api/posts ===", error);
    // ... error handling
  }
}
```

---

## 7. 🚀 QUICK FIX CHECKLIST

- [ ] All environment variables added to production
- [ ] Cloudinary credentials verified (test in Cloudinary dashboard)
- [ ] Database URL is correct and accessible
- [ ] Deployed after adding environment variables
- [ ] Checked production logs for specific error messages
- [ ] Tested creating post without files first
- [ ] Verified API route is not timing out (check deployment platform limits)
- [ ] Browser console shows no CORS or network errors

---

## 8. 🎯 MOST LIKELY SOLUTION

**90% of the time, it's missing environment variables!**

### Quick Test:
1. Go to your deployment platform (Vercel/Netlify)
2. Check Environment Variables section
3. Verify ALL variables from `.env` are there
4. **Trigger a new deployment**
5. Try creating a post again

---

## 9. 💡 ALTERNATIVE: CLIENT-SIDE UPLOAD

To avoid timeout issues completely, implement direct uploads:

```typescript
// 1. Create signed upload URL endpoint
// /app/api/cloudinary-signature/route.ts
export async function POST() {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET!
  );
  
  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}

// 2. Upload from client
// Then save only URLs to your database
```

This bypasses all server-side file handling issues!

---

## 📞 Need More Help?

1. Check the actual error message in production logs
2. Test with a minimal post (no files)
3. Verify each environment variable individually
4. Consider upgrading deployment tier if hitting limits

**Remember**: The most common issue is MISSING or INCORRECT environment variables in production!
