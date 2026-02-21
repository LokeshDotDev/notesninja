"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  ShoppingCart,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  ClipboardCheck,
  Users,
  MessageCircle
} from 'lucide-react';
import { calculateDiscountPercentage } from '@/lib/pricing-utils';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import settings from '@/lib/settings';

interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  compareAtPrice?: number;
  discountPercentage?: number | null;
  isDigital?: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductInfoProps {
  product: Product;
  onPurchase?: () => void;
  onAddToCart?: () => void;
  isPurchasing?: boolean;
  isAddingToCart?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-neutral-800 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="font-semibold text-neutral-900 dark:text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-neutral-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        )}
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-4 py-3 bg-white dark:bg-neutral-900">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function ProductInfo({ 
  product, 
  onPurchase, 
  onAddToCart,
  isPurchasing = false,
  isAddingToCart = false 
}: ProductInfoProps) {
  const [quantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePurchase = async () => {
    if (onPurchase) {
      await onPurchase();
    } else {
      // Default behavior - redirect to checkout
      window.location.href = `/checkout/${product.id}`;
    }
  };

  const handleAddToCart = async () => {
    if (onAddToCart) {
      await onAddToCart();
    } else {
      // Default add to cart logic
      console.log("Added to cart:", product.id, quantity);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Access",
      subtitle: "30 seconds"
    },
    {
      icon: ClipboardCheck,
      title: "Full Coverage",
      subtitle: "100% syllabus"
    },
    {
      icon: Users,
      title: "Trusted By",
      subtitle: "2,000+ students"
    }
  ];

  
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="space-y-2"
    >
      {/* Category Breadcrumb */}
      <div>
        {product.category && (
          <Link
            href={`/${product.category.slug}`}
            className="inline-flex items-center text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {product.category.name}
          </Link>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold">4.9</span>
        <span className="text-neutral-500">(610 reviews)</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-tight">
        {product.title}
      </h1>
      
      {/* notes ninja choice */}
      <span
       className="text-sm sm:text-sm font-bold text-white bg-black px-2 py-1 rounded-md dark:text-white leading-tight">
        NotesNinja&apos;s Choice
      </span>

          <hr />
          
      {/* Price Section */}
      <div className="space-y-3">
        {product.price && (
          <div className="flex items-baseline gap-3 mt-6">
            {/* Use API-calculated discount percentage if available, otherwise calculate locally */}
            {(() => {
              const discount = product.discountPercentage ?? calculateDiscountPercentage(product.price || null, product.compareAtPrice || null);
              return discount && (
                <span className="text-red-600 text-2xl font-bold">
                  {Math.round(discount)}% OFF
                </span>
              );
            })()}
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
        )}
        {product.compareAtPrice && product.compareAtPrice > (product.price || 0) && (
          <span className="text-md text-neutral-500 line-through">
            MRP: {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {!product.compareAtPrice && (
          <span className="text-md text-neutral-500">
            MRP: {formatPrice(product.price || 0)}
          </span>
        )}
        
      </div>

      {/* Product Features - 3 Column Layout - Apple Style */}
      <div className="grid grid-cols-3 gap-4 py-6">
        {features.map((feature) => (
          <div key={feature.title} className="text-center group">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <feature.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" strokeWidth={1.5} />
            </div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">
              {feature.title}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {feature.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col gap-3">
          {product.isDigital ? (
            <Button
              onClick={handlePurchase}
              disabled={isPurchasing}
              size="lg"
              className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 py-4 rounded-xl font-medium text-base transition-all duration-200 border-0"
            >
              {isPurchasing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              {isPurchasing ? 'Processing...' : 'Buy Now'}
            </Button>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              size="lg"
              className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 py-4 rounded-xl font-medium text-base transition-all duration-200 border-0"
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5 mr-2" />
              )}
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          )}
          
          {/* WhatsApp Button */}
          <a
            href={settings.whatsapp.url()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-medium text-base transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contact us for more enquiry</span>
          </a>
        </div>

        {/* Product Specifications Table */}
        <div className="mt-6">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr className="flex justify-between py-2">
                <td className="text-neutral-500 dark:text-neutral-400">University</td>
                <td className="font-medium text-neutral-900 dark:text-white">Manipal University</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-neutral-500 dark:text-neutral-400">Format</td>
                <td className="font-medium text-neutral-900 dark:text-white">Digital PDF</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-neutral-500 dark:text-neutral-400">Compatible Devices</td>
                <td className="font-medium text-neutral-900 dark:text-white">All Devices</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-neutral-500 dark:text-neutral-400">Access Type</td>
                <td className="font-medium text-neutral-900 dark:text-white">Instant Download</td>
              </tr>
              <tr className="flex justify-between py-2">
                <td className="text-neutral-500 dark:text-neutral-400">Validity</td>
                <td className="font-medium text-neutral-900 dark:text-white">Lifetime Access</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 pt-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Secure Transaction</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="mt-8 space-y-4">
        <CollapsibleSection title="Description" defaultOpen={true}>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {product.description}
          </p>
        </CollapsibleSection>
        
        <CollapsibleSection title="Product Details">
          <div className="space-y-0 text-neutral-700 dark:text-neutral-300">
            <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400">Category</span>
              <span className="font-medium text-neutral-900 dark:text-white">{product.category?.name || 'Study Material'}</span>
            </div>
            {product.subcategory && (
              <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500 dark:text-neutral-400">Subcategory</span>
                <span className="font-medium text-neutral-900 dark:text-white">{product.subcategory.name}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400">Type</span>
              <span className="font-medium text-neutral-900 dark:text-white">{product.isDigital ? 'Digital Product' : 'Physical Product'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400">Format</span>
              <span className="font-medium text-neutral-900 dark:text-white">PDF Document</span>
            </div>
            <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400">Access</span>
              <span className="font-medium text-neutral-900 dark:text-white">Instant Download</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-neutral-500 dark:text-neutral-400">Validity</span>
              <span className="font-medium text-neutral-900 dark:text-white">Lifetime Access</span>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </motion.div>
  );
}
