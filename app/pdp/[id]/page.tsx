import { notFound } from 'next/navigation';
import { generateStaticParams } from './generate-static-params';
import ProductDetailClient from './ProductDetailClient';

// Generate static params for top 50 products
export { generateStaticParams };

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Pre-validate the product ID on the server
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: 'force-cache', // Use static cache
    });
    
    if (!response.ok) {
      return notFound();
    }
    
    const product = await response.json();
    
    return <ProductDetailClient initialProduct={product} />;
  } catch (error) {
    console.error("Error loading product:", error);
    return notFound();
  }
}
