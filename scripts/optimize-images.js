// Image optimization script for better performance
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'assets');

async function optimizeImages() {
  console.log('🚀 Starting image optimization...');
  
  const optimizeImage = async (filePath) => {
    try {
      const stats = fs.statSync(filePath);
      if (stats.isFile() && /\.(jpg|jpeg|png)$/i.test(filePath)) {
        const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Skip if already optimized
        if (fs.existsSync(outputPath)) return;
        
        await sharp(filePath)
          .webp({ quality: 85, effort: 4 })
          .toFile(outputPath);
        
        console.log(`✅ Optimized: ${path.basename(filePath)} -> ${path.basename(outputPath)}`);
      }
    } catch (error) {
      console.error(`❌ Error optimizing ${filePath}:`, error.message);
    }
  };

  const processDirectory = async (dir) => {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        await optimizeImage(fullPath);
      }
    }
  };

  if (fs.existsSync(IMAGES_DIR)) {
    await processDirectory(IMAGES_DIR);
    console.log('🎉 Image optimization complete!');
  } else {
    console.log('📁 No images directory found');
  }
}

if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = { optimizeImages };
