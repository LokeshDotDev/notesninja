export interface PricingInfo {
  price: number;
  compareAtPrice?: number | null;
  discountPercentage?: number;
  hasDiscount: boolean;
}

export function calculateDiscount(price: number, compareAtPrice?: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) {
    return 0;
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function getPricingInfo(price: number, compareAtPrice?: number | null): PricingInfo {
  // Auto-calculate compareAtPrice if missing (1.5x price, rounded to nearest 100)
  if (price && !compareAtPrice) {
    compareAtPrice = Math.round((price * 1.5) / 100) * 100;
  }
  
  const discountPercentage = calculateDiscount(price, compareAtPrice);
  const hasDiscount = discountPercentage > 0;

  return {
    price,
    compareAtPrice,
    discountPercentage,
    hasDiscount
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDiscount(discountPercentage: number): string {
  return `-${discountPercentage}%`;
}
