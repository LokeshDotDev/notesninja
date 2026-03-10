import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { Metadata } from "next";
import settings from "@/lib/settings";

interface SubsubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    subsubcategory: string;
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
export async function generateMetadata({ params }: SubsubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory, subsubcategory } = await params;

  const courseTitle = slugToTitle(subsubcategory).toUpperCase();

  const title = `${courseTitle} | Notes & Mock Papers | ${settings.site.name}`;
  const description = `Comprehensive study materials and resources for ${courseTitle}. Download premium notes, mock papers, and exam preparation materials.`;

  return {
    title,
    description,
    keywords: `${courseTitle}, study materials, notes, mock papers, exam preparation, ${settings.site.name}`,
    openGraph: {
      title,
      description,
      url: `${settings.site.url}/${category}/${subcategory}/${subsubcategory}`,
      siteName: settings.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${category}/${subcategory}/${subsubcategory}`,
    },
  };
}

export default async function SubsubcategoryPage({ params }: SubsubcategoryPageProps) {
  const { category, subcategory, subsubcategory } = await params;
  // Combine all segments to create the full nested path
  const fullPath = `${category}/${subcategory}/${subsubcategory}`;
  return (
    <ProfessionalCategoryPage categoryName={fullPath} />
  );
}
