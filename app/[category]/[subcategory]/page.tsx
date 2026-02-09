"use client";
import { DynamicSubcategoryPage } from "@/components/ui/dynamic-subcategory-page";
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
    <DynamicSubcategoryPage 
      categoryName={category} 
      subcategoryName={subcategory} 
    />
  );
}
