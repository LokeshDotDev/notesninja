# Cloudinary File Upload Limits & Troubleshooting

## Current File Size Limits

### Images (Product Display)
- **Max Size**: 10 MB per file
- **Accepted Formats**: PNG, JPG, GIF, BMP, WebP, SVG
- **Use Case**: Product showcase images

### Digital Files (Downloadable Content)
- **Max Size**: 100 MB per file
- **Accepted Formats**: PDF, DOCX, TXT, ZIP, RAR
- **Use Case**: Study materials, notes, guides

### Video Files
- **Max Size**: 100 MB per file (Cloudinary free tier)
- **Accepted Formats**: MP4, AVI, MOV, WMV, FLV, WebM

---

## Why Can't You Upload Large ZIP Files or PDFs?

### Reason 1: Cloudinary Free Tier Limits ⚠️
**Cloudinary's free tier has a 100MB maximum file size limit**. If your ZIP or PDF exceeds 100MB, it will fail.

**Solution**: 
- For files > 100MB, you have two options:
  1. **Split the large file** into smaller chunks
  2. **Upgrade your Cloudinary plan** to a paid tier (Pro, Business, etc.)

### Reason 2: Upload Timeout Issues
Large file uploads can timeout due to network slowness.

**Solution**:
- Make sure your internet connection is stable
- Try uploading from a different network if possible
- Upload during off-peak hours if the server is under heavy load

### Reason 3: Browser Memory Limitations
The browser has limits on how much data it can process at once.

**Solution**:
- Use a modern browser (Chrome, Firefox, Edge)
- Close other tabs and applications to free up RAM
- Try uploading files one at a time instead of multiple files

---

## Configuration Details

### Backend Settings
- **API Timeout**: 300 seconds (5 minutes) for large file uploads
- **Body Size Limit**: 500 MB
- **Resource Types**: 
  - `raw` - For digital files and non-media files (ZIP, PDF, DOCX, etc.)
  - `image` - For image files
  - `video` - For video files

### Cloudinary Upload Configuration
```typescript
// File size validation (added in v1.0.1)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;      // 10MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;      // 100MB
```

---

## Step-by-Step Upload Instructions

### For PDF Files
1. ✅ Keep PDF under 100 MB
2. ✅ Make sure product is marked as "Digital Product"
3. ✅ Click "Upload digital files"
4. ✅ Select the PDF
5. ✅ Wait for upload to complete (shows in file list)
6. ✅ Click "Create Post"

### For ZIP Files
1. ✅ Keep ZIP under 100 MB
2. ✅ Mark product as "Digital Product"
3. ✅ Click "Upload digital files"
4. ✅ Select the ZIP file
5. ✅ Verify file appears in the list
6. ✅ Submit form

### If Upload Fails
1. Check the browser console (F12) for error messages
2. Verify file size is under the limit
3. Try in a different browser
4. Try uploading to a different category
5. If error persists, check:
   - Internet connection speed
   - Cloudinary API credentials in `.env.local`
   - Server logs for detailed errors

---

## Upgrading Cloudinary Plan for Larger Files

If you need to upload files **larger than 100MB**, consider upgrading:

| Feature | Free Tier | Pro Tier | Business Tier |
|---------|-----------|----------|---------------|
| Max File Size | 100 MB | 100 MB | Custom (Contact) |
| Monthly Transformations | 125,000 | 1 million+ | Custom |
| Video Duration | 20 mins | Unlimited | Unlimited |
| API Requests | 100/hour | Higher | Higher |

**Visit**: https://cloudinary.com/pricing

---

## Error Messages & Solutions

### "File exceeds maximum size"
```
❌ File "data.zip" (150MB) exceeds the maximum allowed size of 100MB
```
**Solution**: Split ZIP or upgrade Cloudinary plan

### "Upload timeout"
```
❌ Error uploading the content to Cloudinary!
```
**Solution**: Retry upload, check internet speed, or split file

### "Network error during upload"
```
❌ Failed to upload file
```
**Solution**: Check Cloudinary credentials, retry with smaller file

---

## Performance Tips for Large File Uploads

1. **Optimize Before Upload**
   - Compress ZIP files (7-Zip or WinRAR can compress better)
   - Reduce PDF size using online tools
   - Remove unnecessary files from ZIP

2. **Network Optimization**
   - Use wired connection if possible (faster than Wi-Fi)
   - Close bandwidth-heavy applications
   - Upload single file at a time

3. **Browser Optimization**
   - Use latest browser version
   - Disable browser extensions that might interfere
   - Clear browser cache if experiencing issues

---

## Contact & Support

- **Cloudinary Support**: https://support.cloudinary.com
- **Project Admin**: Check with project administrator for plan details
- **Local Testing**: Use `npm run dev` and check browser console (F12) for detailed logs

---

## Version History

- **v1.0.1** - Added file size validation and improved error messages
- **v1.0.0** - Initial upload system
