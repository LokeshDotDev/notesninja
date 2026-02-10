"use client";
import { ProfessionalCategoryPage } from "@/components/ui/ProfessionalCategoryPage";
import { use } from "react";

interface NestedCategoryPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default function NestedCategoryPage({ params }: NestedCategoryPageProps) {
  const { slug } = use(params);
  
  // Join all slug segments to get the full path
  const fullPath = slug.join('/');
  
  return <ProfessionalCategoryPage categoryName={fullPath} />;
}
