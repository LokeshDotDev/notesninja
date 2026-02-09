"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

interface ProductType {
  id: string;
  name: string;
  _count?: { posts: number; featured: number };
}

interface ProductTypeFilterProps {
  productTypes: ProductType[];
  selectedProductType: string | null;
  onProductTypeChange: (productTypeId: string | null) => void;
  className?: string;
}

export default function ProductTypeFilter({
  productTypes,
  selectedProductType,
  onProductTypeChange,
  className = "",
}: ProductTypeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleProductTypeClick = (productTypeId: string | null) => {
    onProductTypeChange(productTypeId);
    setIsExpanded(false);
  };

  const clearFilter = () => {
    onProductTypeChange(null);
  };

  const selectedProductTypeName = selectedProductType
    ? productTypes.find((pt) => pt.id === selectedProductType)?.name
    : null;

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">
          {selectedProductTypeName ? `Product Type: ${selectedProductTypeName}` : "Filter by Product Type"}
        </span>
        {selectedProductType && (
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              clearFilter();
            }}
          />
        )}
      </Button>

      {/* Filter Dropdown */}
      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-medium text-sm mb-3 text-gray-900 dark:text-gray-100">
              Filter by Product Type
            </h3>
            
            {/* All Products Option */}
            <button
              onClick={() => handleProductTypeClick(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors ${
                !selectedProductType
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              All Product Types
            </button>

            {/* Product Type Options */}
            {productTypes.map((productType) => (
              <button
                key={productType.id}
                onClick={() => handleProductTypeClick(productType.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 transition-colors flex items-center justify-between ${
                  selectedProductType === productType.id
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>{productType.name}</span>
                {productType._count && (
                  <Badge variant="secondary" className="text-xs">
                    {productType._count.posts + productType._count.featured}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
