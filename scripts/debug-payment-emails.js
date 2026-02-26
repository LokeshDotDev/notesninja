require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugPaymentEmails() {
  console.log('🔍 Debugging Payment Email Issues...\n');

  try {
    // 1. Check recent purchases
    console.log('1. 📊 Checking recent purchases:');
    const recentPurchases = await prisma.purchase.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            digitalFiles: true
          }
        },
        user: true
      }
    });

    console.log(`Found ${recentPurchases.length} recent purchases:`);
    
    recentPurchases.forEach((purchase, index) => {
      console.log(`\n${index + 1}. Purchase ID: ${purchase.id}`);
      console.log(`   Email: ${purchase.userEmail}`);
      console.log(`   Status: ${purchase.status}`);
      console.log(`   Payment ID: ${purchase.paymentId}`);
      console.log(`   Product: ${purchase.post.title}`);
      console.log(`   Is Digital: ${purchase.post.isDigital}`);
      console.log(`   Digital Files Count: ${purchase.post.digitalFiles.length}`);
      console.log(`   Should Send Email: ${purchase.post.isDigital && purchase.post.digitalFiles.length > 0 ? 'YES' : 'NO'}`);
      console.log(`   Created: ${purchase.createdAt}`);
    });

    // 2. Check products with digital files
    console.log('\n\n2. 📦 Checking digital products:');
    const digitalProducts = await prisma.post.findMany({
      where: {
        isDigital: true
      },
      include: {
        digitalFiles: true,
        purchases: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    console.log(`Found ${digitalProducts.length} digital products:`);
    
    digitalProducts.forEach((product, index) => {
      console.log(`\n${index + 1}. Product: ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   Digital Files: ${product.digitalFiles.length}`);
      console.log(`   Recent Purchases: ${product.purchases.length}`);
      
      if (product.digitalFiles.length > 0) {
        product.digitalFiles.forEach((file, fileIndex) => {
          console.log(`     File ${fileIndex + 1}: ${file.fileName} (${file.fileType})`);
        });
      }
    });

    // 3. Check environment variables
    console.log('\n\n3. 🔧 Environment Variables:');
    console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Configured' : '❌ Missing'}`);
    console.log(`RAZORPAY_WEBHOOK_SECRET: ${process.env.RAZORPAY_WEBHOOK_SECRET ? '✅ Configured' : '❌ Missing'}`);
    console.log(`NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://notesninja.in'}`);

    // 4. Test email template generation
    console.log('\n\n4. 📧 Email Template Analysis:');
    
    if (recentPurchases.length > 0) {
      const testPurchase = recentPurchases[0];
      if (testPurchase.post.isDigital && testPurchase.post.digitalFiles.length > 0) {
        console.log('✅ Email conditions met for recent purchase');
        console.log(`   Recipient: ${testPurchase.userEmail}`);
        console.log(`   Product: ${testPurchase.post.title}`);
        console.log(`   Download Links: ${testPurchase.post.digitalFiles.length}`);
        console.log('📝 Email should have been sent for this purchase');
      } else {
        console.log('⏭️ No digital product with files found for email test');
      }
    }

  } catch (error) {
    console.error('❌ Debug script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the debug script
debugPaymentEmails();
