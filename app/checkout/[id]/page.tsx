"use client";
import { ProfessionalCheckout } from "@/components/ui/ProfessionalCheckout";
import { use } from "react";

interface CheckoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = use(params);
  return <ProfessionalCheckout productId={id} />;
}
