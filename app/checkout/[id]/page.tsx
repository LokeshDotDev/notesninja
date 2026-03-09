"use client";
import { ProfessionalCheckout } from "@/components/ui/ProfessionalCheckout";
import { use } from "react";
import { useSearchParams } from "next/navigation";

interface CheckoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const subjects = searchParams.get('subjects'); // Now can be comma-separated
  const price = searchParams.get('price');
  
  console.log('Checkout page received:', { id, subjects, price });
  
  return <ProfessionalCheckout productId={id} subjects={subjects} customPrice={price} />;
}
