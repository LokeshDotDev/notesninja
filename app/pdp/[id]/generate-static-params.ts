import prisma from "@/lib/prisma-optimized";

// Generate static params for top 50 products to pre-build them
export async function generateStaticParams() {
  try {
    // Fetch top 50 most popular products for static generation
    const popularProducts = await prisma.post.findMany({
      select: {
        id: true,
      },
      orderBy: [
        { createdAt: 'desc' }, // Most recent
        { price: 'desc' },    // Higher priced (often more popular)
      ],
      take: 50,
    });

    return popularProducts.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback to empty array if there's an error
    return [];
  }
}
