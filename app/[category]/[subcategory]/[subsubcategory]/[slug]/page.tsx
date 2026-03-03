import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import settings from '@/lib/settings';
import { Suspense } from 'react';
import ProductPageClient from '@/components/pdp/ProductPageClient';
import prisma from '@/lib/prisma-optimized';
import { unstable_cache } from 'next/cache';

interface ProductPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    subsubcategory: string;
    slug: string;
  }>;
}

// Optimized product fetch with caching
const getCachedProduct = unstable_cache(
  async (slug: string) => {
    return prisma.post.findFirst({
      where: { 
        OR: [{ id: slug }, { slug: slug }] 
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        imageUrl: true,
        publicId: true,
        price: true,
        compareAtPrice: true,
        isDigital: true,
        categoryId: true,
        subcategoryId: true,
        productTypeId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          },
        },
        productType: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            publicId: true,
            order: true,
            isCover: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    }).then(product => {
      if (product) {
        return product;
      }
      return null;
    });
  },
  ['product-detail'],
  { revalidate: 1800, tags: ['products'] }
);

// Metadata generation with server-side data
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await getCachedProduct(slug);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const title = `${product.title} | ${settings.site.name}`;
    const description = product.description 
      ? `${product.description.substring(0, 160)}... | Download comprehensive study materials`
      : `Download ${product.title} and other comprehensive study materials, notes, and mock papers.`;
    
    return {
      title,
      description,
      keywords: `${product.title}, study materials, notes, mock papers, exam preparation, ${settings.site.name}`,
      openGraph: {
        title,
        description,
        images: product.imageUrl ? [product.imageUrl] : [],
        url: `${settings.site.url}/${slug}`,
        siteName: settings.site.name,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
      alternates: {
        canonical: `/${slug}`,
      },
    };
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Fallback metadata if fetch fails
    return {
      title: `Premium Study Material | Notes & Mock Papers | ${settings.site.name}`,
      description: `Download comprehensive study materials, notes, and mock papers. Exam-focused content trusted by students for academic success.`,
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch product on server with caching
  const product = await getCachedProduct(slug);
  
  if (!product) {
    return notFound();
  }
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <ProductPageClient 
        initialProduct={product}
        productId={slug}
      />
    </Suspense>
  );
}
