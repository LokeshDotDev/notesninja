/**
 * Calculate discount percentage based on actual price and MRP (compareAtPrice)
 * @param price - Actual selling price
 * @param compareAtPrice - MRP or original price
 * @returns Discount percentage (0-100) or null if no discount
 */
export function calculateDiscountPercentage(price: number | null, compareAtPrice: number | null): number | null {
  // If either price is null, zero, or compareAtPrice is less than or equal to price, no discount
  if (!price || !compareAtPrice || compareAtPrice <= price || price <= 0 || compareAtPrice <= 0) {
    return null;
  }
  
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  
  // Round to 1 decimal place and ensure it's within valid range
  const roundedDiscount = Math.round(discount * 10) / 10;
  
  return roundedDiscount > 0 ? Math.min(roundedDiscount, 99.9) : null;
}

/**
 * Format price with currency symbol
 * @param price - Price to format
 * @param currency - Currency symbol (default: $)
 * @returns Formatted price string
 */
export function formatPrice(price: number | null, currency: string = '$'): string {
  if (!price) return `${currency}0.00`;
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format discount percentage for display
 * @param percentage - Discount percentage
 * @returns Formatted discount string (e.g., "25% OFF")
 */
export function formatDiscount(percentage: number | null): string {
  if (!percentage) return '';
  return `${Math.round(percentage)}% OFF`;
}
