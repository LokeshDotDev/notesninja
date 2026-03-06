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

  const categoryTitle = slugToTitle(category).toUpperCase();

  const title = `${categoryTitle} | Notes & Mock Papers | ${settings.site.name}`;
  const description = `Comprehensive study materials and resources for ${categoryTitle}. Download premium notes, mock papers, and exam preparation materials.`;

  return {
    title,
    description,
    keywords: `${categoryTitle}, study materials, notes, mock papers, exam preparation, ${settings.site.name}`,
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

  // Exclude HTML verification file and admin routes from being treated as a category
  if (category === "udfqcfua9mzrfa6zp5jath0qx5skal.html" ||
    category === "admin" ||
    category === "admin/logs" ||
    category.startsWith("admin/")) {
    notFound();
  }

  return <ProfessionalCategoryPage categoryName={category} />;
}
