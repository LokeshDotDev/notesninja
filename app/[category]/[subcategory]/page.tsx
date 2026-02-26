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
  
  const title = `${courseTitle} Study Materials | Notes & Mock Papers | ${settings.site.name}`;
  const description = `Download comprehensive ${courseTitle} study materials including premium notes, mock papers, question banks, and exam preparation resources. Expert-curated content for ${courseTitle} students.`;
  
  return {
    title,
    description,
    keywords: `${courseTitle}, ${courseTitle} notes, ${courseTitle} mock papers, ${courseTitle} study materials, ${courseTitle} exam preparation, university notes, ${settings.site.name}`,
    openGraph: {
      title,
      description,
      url: `${settings.site.url}/${category}/${subcategory}`,
      siteName: settings.site.name,
      type: 'website',
      images: [{
        url: `${settings.site.url}/assets/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${courseTitle} Study Materials`,
      }],
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
