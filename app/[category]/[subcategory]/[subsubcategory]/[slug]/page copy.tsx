"use client";
import { ProfessionalProductDetail } from "@/components/ui/ProfessionalProductDetail";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  return <ProfessionalProductDetail productSlug={slug} />;
}
