"use client";
import { ProfessionalSubcategoryPage } from "@/components/ui/ProfessionalSubcategoryPage";
import { use } from "react";

interface SubcategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = use(params);
  return (
    <ProfessionalSubcategoryPage 
      categoryName={category} 
      subcategoryName={subcategory} 
    />
  );
}
