interface Category {
  id: string;
  name: string;
  slug: string;
  path?: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
    path?: string;
  };
}

interface Post {
  id: string;
  category?: Category | null;
  subcategory?: {
    id: string;
    name: string;
  } | null;
}

export function generateProductUrl(product: Post): string {
  if (!product.category) {
    return `/product/${product.id}`;
  }

  // Use the category path if available
  if (product.category.path) {
    const pathParts = product.category.path.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      // Format: /university/category/product-id or /university/category/subcategory/product-id
      if (product.subcategory && pathParts.length >= 3) {
        return `/${pathParts.slice(0, 3).join('/')}/${product.id}`;
      } else {
        return `/${pathParts.slice(0, 2).join('/')}/${product.id}`;
      }
    } else if (pathParts.length === 1) {
      // Format: /university/product-id
      return `/${pathParts[0]}/${product.id}`;
    }
  }

  // Fallback to category slug
  return `/${product.category.slug}/${product.id}`;
}

export function generateCategoryUrl(category: Category): string {
  if (category.path) {
    return `/${category.path}`;
  }
  return `/${category.slug}`;
}
