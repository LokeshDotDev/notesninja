"use client";
import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { use } from "react";

interface SubsubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    subsubcategory: string;
  }>;
}

export default function SubsubcategoryPage({ params }: SubsubcategoryPageProps) {
  const { category, subcategory, subsubcategory } = use(params);
  // Combine all segments to create the full nested path
  const fullPath = `${category}/${subcategory}/${subsubcategory}`;
  return (
    <ProfessionalCategoryPage categoryName={fullPath} />
  );
}
