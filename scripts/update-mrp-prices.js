import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating existing products with MRP comparison prices...');

  // Define pricing strategy for different course types
  const pricingStrategy = {
    // MBA courses - premium pricing
    mba: {
      price: 3999,
      compareAtPrice: 5999
    },
    // BBA courses - standard pricing  
    bba: {
      price: 3999,
      compareAtPrice: 5999
    },
    // MCA courses - premium pricing
    mca: {
      price: 3999,
      compareAtPrice: 5999
    },
    // BCA courses - standard pricing
    bca: {
      price: 3999,
      compareAtPrice: 5999
    },
    // MA Economics courses - premium pricing
    maeco: {
      price: 3999,
      compareAtPrice: 5999
    },
    // MAJMC courses - standard pricing
    majmc: {
      price: 3999,
      compareAtPrice: 5999
    }
  };

  try {
    // Get all posts that don't have compareAtPrice set
    const postsToUpdate = await prisma.post.findMany({
      where: {
        compareAtPrice: null
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    console.log(`Found ${postsToUpdate.length} products to update`);

    for (const post of postsToUpdate) {
      // Determine pricing based on category
      let pricing = { price: 3999, compareAtPrice: 5999 }; // default pricing
      
      const categorySlug = post.category.slug.toLowerCase();
      
      if (categorySlug.includes('mba')) {
        pricing = pricingStrategy.mba;
      } else if (categorySlug.includes('bba')) {
        pricing = pricingStrategy.bba;
      } else if (categorySlug.includes('mca')) {
        pricing = pricingStrategy.mca;
      } else if (categorySlug.includes('bca')) {
        pricing = pricingStrategy.bca;
      } else if (categorySlug.includes('ma') && categorySlug.includes('eco')) {
        pricing = pricingStrategy.maeco;
      } else if (categorySlug.includes('majmc') || categorySlug.includes('jmc')) {
        pricing = pricingStrategy.majmc;
      }

      // Update the post with pricing
      await prisma.post.update({
        where: { id: post.id },
        data: {
          price: pricing.price,
          compareAtPrice: pricing.compareAtPrice,
          isDigital: true // Mark all as digital products
        }
      });

      console.log(`✅ Updated: "${post.title}" - Price: ₹${pricing.price}, MRP: ₹${pricing.compareAtPrice}`);
    }

    // Also update posts that have price but no compareAtPrice
    const postsWithPriceOnly = await prisma.post.findMany({
      where: {
        price: { not: null },
        compareAtPrice: null
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    for (const post of postsWithPriceOnly) {
      const compareAtPrice = Math.round((post.price * 1.5) / 100) * 100; // Round to nearest 100
      
      await prisma.post.update({
        where: { id: post.id },
        data: {
          compareAtPrice: compareAtPrice
        }
      });

      console.log(`✅ Updated MRP for: "${post.title}" - Price: ₹${post.price}, MRP: ₹${compareAtPrice}`);
    }

    console.log('🎉 All products updated successfully with MRP comparison prices!');

  } catch (error) {
    console.error('❌ Error updating products:', error);
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
