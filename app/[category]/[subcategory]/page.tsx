"use client";
import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { use } from "react";

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = use(params);
  // Combine category and subcategory to create the full nested path
  const fullPath = `${category}/${subcategory}`;
  return (
    <ProfessionalCategoryPage categoryName={fullPath} />
  );
}
