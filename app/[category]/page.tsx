"use client";
import { DynamicCategoryPage } from "@/components/ui/dynamic-category-page";
import { use } from "react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  return <DynamicCategoryPage categoryName={category} />;
}
