"use client";
import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { use } from "react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  return <ProfessionalCategoryPage categoryName={category} />;
}
