import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { Metadata } from "next";
import settings from "@/lib/settings";

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
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
export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  
  // Extract the last segment as the course/page name (e.g., "bca" from "notes-and-mockpaper/bca")
  const segments = subcategory.split('/');
  const courseName = segments[segments.length - 1]; // Get last segment
  const courseTitle = slugToTitle(courseName).toUpperCase(); // BCA, MBA, etc.
  
  const title = `${courseTitle} | Notes & Mock Papers | ${settings.site.name}`;
  const description = `Comprehensive study materials and resources for ${courseTitle}. Download premium notes, mock papers, and exam preparation materials.`;
  
  return {
    title,
    description,
    keywords: `${courseTitle}, study materials, notes, mock papers, exam preparation, ${settings.site.name}`,
    openGraph: {
      title,
      description,
      url: `${settings.site.url}/${category}/${subcategory}`,
      siteName: settings.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${category}/${subcategory}`,
    },
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  // Combine category and subcategory to create the full nested path
  const fullPath = `${category}/${subcategory}`;
  return (
    <ProfessionalCategoryPage categoryName={fullPath} />
  );
}
