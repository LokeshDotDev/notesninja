import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import settings from "@/lib/settings";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Helper function to convert slug to title
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  // Exclude HTML verification file
  if (category === "udfqcfua9mzrfa6zp5jath0qx5skal.html") {
    return {};
  }
  
  const categoryTitle = slugToTitle(category);
  const title = `${categoryTitle} | Study Materials & Resources | ${settings.site.name}`;
  const description = `Explore comprehensive ${categoryTitle} study materials including premium notes, mock papers, and exam preparation resources. Download quality content for students.`;
  
  return {
    title,
    description,
    keywords: `${categoryTitle}, study materials, notes, mock papers, exam preparation, university resources, ${settings.site.name}`,
    openGraph: {
      title,
      description,
      url: `${settings.site.url}/${category}`,
      siteName: settings.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  
  // Exclude HTML verification file from being treated as a category
  if (category === "udfqcfua9mzrfa6zp5jath0qx5skal.html") {
    notFound();
  }
  
  return <ProfessionalCategoryPage categoryName={category} />;
}
