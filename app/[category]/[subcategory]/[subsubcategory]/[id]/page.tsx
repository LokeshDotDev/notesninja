"use client";
import { ProfessionalProductDetail } from "@/components/ui/ProfessionalProductDetail";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  return <ProfessionalProductDetail productId={id} />;
}
