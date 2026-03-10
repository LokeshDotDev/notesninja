import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import settings from '@/lib/settings';
import { Suspense } from 'react';
import ProductPageClient from '@/components/pdp/ProductPageClient';
import prisma from '@/lib/prisma-optimized';
import { unstable_cache } from 'next/cache';
import { AnnouncementBar } from '@/components/pdp/AnnouncementBar';
import SeeInActionSection from '@/components/pdp/SeeInActionSection';
import { ProductHighlights } from '@/components/pdp/ProductHighlights';
import { RatingsAndReviews } from '@/components/pdp/RatingsAndReviews';
import { TrustScreenshots } from '@/components/pdp/TrustScreenshots';
import { AccordionSection } from '@/components/pdp/AccordionSection';

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

const ugcVideos = [
  {
    id: "1",
    thumbnail: "/assets/reviews-thumbnails/student2.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73e8",
    aspectRatio: "9/16",
    title: "Student Success Story - Interview Experience",
  },
  {
    id: "2",
    thumbnail: "/assets/reviews-thumbnails/student3.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d98dac99517915c0a",
    aspectRatio: "9/16",
    title: "Academic Achievement Journey",
  },
  {
    id: "3",
    thumbnail: "/assets/reviews-thumbnails/student7.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73ea",
    aspectRatio: "9/16",
    title: "Study Techniques That Work",
  },
  {
    id: "4",
    thumbnail: "/assets/reviews-thumbnails/student6.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73e6",
    aspectRatio: "9/16",
    title: "Exam Preparation Success",
  },
  {
    id: "5",
    thumbnail: "/assets/reviews-thumbnails/student1.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6de9610ba04ec142aa",
    aspectRatio: "9/16",
    title: "Real Results from Real Students",
  },
  {
    id: "6",
    thumbnail: "/assets/reviews-thumbnails/student5.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d825d3351d56a73df",
    aspectRatio: "9/16",
    title: "Student Achievement Showcase",
  },
  {
    id: "7",
    thumbnail: "/assets/reviews-thumbnails/student8.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6de9610ba04ec142b1",
    aspectRatio: "9/16",
    title: "Learning Success Stories",
  },
  {
    id: "8",
    thumbnail: "/assets/reviews-thumbnails/student4.webp",
    embedSrc: "https://play.gumlet.io/embed/69a41a6d98dac99517915c0d",
    aspectRatio: "9/16",
    title: "Academic Excellence Journey",
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product on server with caching
  const product = await getCachedProduct(slug);

  if (!product) {
    return notFound();
  }

  return (
    <>
      <AnnouncementBar />

      <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
        <ProductPageClient product={product} />
      </Suspense>

      {/* See It In Action - UGC Video Reels */}
      <SeeInActionSection videos={ugcVideos} />

      {/* Product Highlights */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductHighlights />
        </div>
      </section>

      {/* Ratings and Reviews */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RatingsAndReviews />
        </div>
      </section>

      {/* Trust Screenshots - Student Success Stories */}
      <TrustScreenshots />

      {/* FAQ Accordion */}
      <section className="py-12 pb-24 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccordionSection />
        </div>
      </section>
    </>
  );
}

