import { Metadata } from 'next';
import settings from '@/lib/settings';
import { ProductPageClient } from '@/components/pdp/ProductPageClient';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Metadata generation - simplified to avoid build-time fetch errors
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Use generic but SEO-friendly metadata since fetching during build causes issues
  const title = `Premium Study Material | Notes & Mock Papers | ${settings.site.name}`;
  const description = `Download comprehensive study materials, notes, and mock papers. Exam-focused content trusted by students for academic success.`;
  
  return {
    title,
    description,
    keywords: `study materials, notes, mock papers, exam preparation, digital notes, ${settings.site.name}`,
    openGraph: {
      title,
      description,
      url: `${settings.site.url}/product/${id}`,
      siteName: settings.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/product/${id}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductPageClient productId={id} />;
}
