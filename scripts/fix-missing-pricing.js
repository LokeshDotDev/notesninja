import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing products with missing compareAtPrice...');

  try {
    // Find all products that have a price but no compareAtPrice
    const productsWithoutComparePrice = await prisma.post.findMany({
      where: {
        price: { not: null },
        compareAtPrice: null
      },
      select: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    console.log(`Found ${productsWithoutComparePrice.length} products without compareAtPrice`);

    for (const product of productsWithoutComparePrice) {
      // Set compareAtPrice to 1.5x the price (rounded to nearest 100)
      const compareAtPrice = Math.round((product.price * 1.5) / 100) * 100;
      
      await prisma.post.update({
        where: { id: product.id },
        data: {
          compareAtPrice: compareAtPrice
        }
      });

      console.log(`✅ Updated: "${product.title}" - Price: ₹${product.price}, MRP: ₹${compareAtPrice}`);
    }

    // Also find products where compareAtPrice <= price (invalid pricing)
    const productsWithInvalidPricing = await prisma.post.findMany({
      where: {
        price: { not: null },
        compareAtPrice: { not: null },
        compareAtPrice: { lte: prisma.post.fields.price }
      },
      select: {
        id: true,
        title: true,
        price: true,
        compareAtPrice: true
      }
    });

    console.log(`Found ${productsWithInvalidPricing.length} products with invalid pricing (MRP <= Price)`);

    for (const product of productsWithInvalidPricing) {
      // Fix the compareAtPrice to be higher than price
      const compareAtPrice = Math.round((product.price * 1.5) / 100) * 100;
      
      await prisma.post.update({
        where: { id: product.id },
        data: {
          compareAtPrice: compareAtPrice
        }
      });

      console.log(`🔧 Fixed invalid pricing: "${product.title}" - Price: ₹${product.price}, New MRP: ₹${compareAtPrice}`);
    }

    console.log('🎉 All product pricing has been fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing product pricing:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
