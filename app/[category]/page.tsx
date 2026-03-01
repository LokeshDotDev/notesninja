"use client";
import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { use } from "react";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  
  // Exclude HTML verification file and admin routes from being treated as a category
  if (category === "udfqcfua9mzrfa6zp5jath0qx5skal.html" || 
      category === "admin" || 
      category === "admin/logs" ||
      category.startsWith("admin/")) {
    notFound();
  }
  
  return <ProfessionalCategoryPage categoryName={category} />;
}
