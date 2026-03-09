"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { trackBeginCheckout } from "@/lib/analytics";
import {
  Download,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  ClipboardCheck,
  Users,
  MessageCircle,
  ChevronLeft
} from 'lucide-react';
import { calculateDiscountPercentage } from '@/lib/pricing-utils';
import Link from 'next/link';
import settings from '@/lib/settings';
import { DescriptionRenderer } from '@/components/ui/DescriptionRenderer';
import { SampleDownloadModal } from './SampleDownloadModal';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  discountPercentage?: number | null;
  isDigital?: boolean | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subcategory?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
}

interface ProductInfoProps {
  product: Product;
  onPurchase?: () => void;
  isPurchasing?: boolean;
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
  isPurchasing: externalIsPurchasing = false
}: ProductInfoProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['full_bundle']);
  const [internalIsPurchasing, setInternalIsPurchasing] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  
  // Use external isPurchasing if provided, otherwise use internal state
  const isPurchasing = externalIsPurchasing || internalIsPurchasing;
  
  // Check if URL parameters are passed (for direct checkout access)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const subjectsParam = urlParams.get('subjects');
      const priceParam = urlParams.get('price');
      
      if (subjectsParam && priceParam) {
        console.log('Found URL params:', { subjectsParam, priceParam });
        setSelectedSubjects(subjectsParam.split(','));
      }
    }
  }, []);

  // Add debugging for purchase click
  useEffect(() => {
    console.log('Current selectedSubjects state:', selectedSubjects);
  }, [selectedSubjects]);
  
  // MBA Sem 1 subject pricing configuration
  const mbaSem1Subjects = [
    { id: 'full_bundle', name: 'Complete Bundle (All Subjects)', price: 3999, isBundle: true },
    { id: 'business_communication', name: 'Business Communication', price: 999, isBundle: false },
    { id: 'financial_accounting', name: 'Financial and Management Accounting', price: 999, isBundle: false },
    { id: 'human_resource', name: 'Human Resource Management', price: 999, isBundle: false },
    { id: 'management_process', name: 'Management Process and Organisational Behaviour', price: 999, isBundle: false },
    { id: 'managerial_economics', name: 'Managerial Economics', price: 999, isBundle: false },
    { id: 'statistics', name: 'Statistics for Management', price: 999, isBundle: false }
  ];

  // Check if this is an MBA Sem 1 product (check both title and ID/slug)
  const isMbaSem1Product = (product.title.toLowerCase().includes('mba') && 
                          product.title.toLowerCase().includes('sem 1')) ||
                          product.id.toLowerCase().includes('mba-sem-1');
  
  console.log('Product title:', product.title);
  console.log('Product ID:', product.id);
  console.log('Is MBA Sem 1 Product:', isMbaSem1Product);

  // Get current pricing based on selection
  const getCurrentPricing = () => {
    if (!isMbaSem1Product) {
      return {
        price: product.price || 0,
        compareAtPrice: product.compareAtPrice
      };
    }

    // If full bundle is selected, show bundle price
    if (selectedSubjects.includes('full_bundle')) {
      return {
        price: 3999,
        compareAtPrice: product.compareAtPrice
      };
    }

    // Calculate total price for selected individual subjects
    const totalPrice = selectedSubjects.reduce((sum, subjectId) => {
      const subject = mbaSem1Subjects.find(s => s.id === subjectId);
      return sum + (subject?.price || 0);
    }, 0);
    
    // If subjects selected, show calculated price vs bundle price for comparison
    if (selectedSubjects.length > 0) {
      return {
        price: totalPrice,
        compareAtPrice: 3999 // Show bundle price as comparison
      };
    }
    
    // Default fallback
    return {
      price: product.price || 0,
      compareAtPrice: product.compareAtPrice
    };
  };

  const currentPricing = getCurrentPricing();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePurchase = async () => {
    const pricingAtClick = getCurrentPricing();
    console.log('=== PURCHASE CLICKED ===');
    console.log('Selected subjects at click:', selectedSubjects);
    console.log('Current pricing at click:', pricingAtClick);
    console.log('Is MBA Sem 1 Product:', isMbaSem1Product);
    
    trackBeginCheckout({
      id: product.id,
      title: product.title,
      price: product.price ?? undefined,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      imageUrl: product.imageUrl ?? undefined,
    });
    
    if (onPurchase) {
      await onPurchase();
    } else {
      // Set internal loading state
      setInternalIsPurchasing(true);
      try {
        // Simulate processing time before redirect
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Pass selected subjects info to checkout for MBA Sem 1 products
        const checkoutUrl = isMbaSem1Product 
          ? `/checkout/${product.id}?subjects=${selectedSubjects.join(',')}&price=${pricingAtClick.price}`
          : `/checkout/${product.id}`;
        console.log('Final checkout URL:', checkoutUrl);
        window.location.href = checkoutUrl;
      } catch (error) {
        console.error("Failed to process purchase:", error);
        setInternalIsPurchasing(false);
      }
    }
  };

  const handleSampleDownload = async (formData: { name: string; email: string; phone: string }) => {
    try {
      const response = await fetch('/api/sample-downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          productId: product.id,
        }),
      });

      const result = await response.json();

      // Check if sample file is not available (404)
      if (!response.ok) {
        if (response.status === 404) {
          alert('Sample is not available for this product.');
          return;
        }
        throw new Error(result.error || 'Failed to process download request');
      }
      
      // Trigger file download
      if (result.downloadUrl) {
        // Create a temporary link and force download
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.fileName || 'sample.pdf';
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        
        // Small delay before cleanup to ensure download starts
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
        
        // Show success message
        alert('Sample file download started! Check your downloads folder.');
      }
    } catch (error) {
      console.error('Sample download error:', error);
      throw error;
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
          <svg className="w-0 h-0 absolute">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
          </svg>
          {[...Array(5)].map((_, i) => {
            const rating = 4.5;
            const filled = i < Math.floor(rating);
            const half = !filled && i < rating;
            
            if (half) {
              return (
                <svg
                  key={i}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="url(#halfStarGradient)"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              );
            }
            
            return (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            );
          })}
        </div>
        <span className="text-lg font-semibold">4.4</span>
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
              const discount = product.discountPercentage ?? calculateDiscountPercentage(currentPricing.price || null, currentPricing.compareAtPrice || null);
              return discount && (
                <span className="text-red-600 text-2xl font-bold">
                  {Math.round(discount)}% OFF
                </span>
              );
            })()}
            <span className="text-2xl font-bold text-neutral-900 dark:text-white">
              {formatPrice(currentPricing.price)}
            </span>
          </div>
        )}
        {currentPricing.compareAtPrice && currentPricing.compareAtPrice > currentPricing.price && (
          <span className="text-md text-neutral-500 line-through">
            MRP: {formatPrice(currentPricing.compareAtPrice)}
          </span>
        )}
        {!currentPricing.compareAtPrice && (
          <span className="text-md text-neutral-500">
            MRP: {formatPrice(currentPricing.price || 0)}
          </span>
        )}

        {/* Premium Apple-Style Subject Selection for MBA Sem 1 */}
        {isMbaSem1Product && (
          <div className="mt-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Choose your subjects
              </h3>
              {selectedSubjects.length > 0 && !selectedSubjects.includes('full_bundle') && (
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {selectedSubjects.length} selected
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {/* Full Bundle Option - Premium Card */}
              {mbaSem1Subjects.filter(s => s.isBundle).map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id);
                const hasIndividualSubjects = selectedSubjects.some(id => id !== 'full_bundle');
                const isDisabled = hasIndividualSubjects;
                
                return (
                  <motion.div
                    key={subject.id}
                    whileHover={!isDisabled ? { scale: 1.01 } : {}}
                    whileTap={!isDisabled ? { scale: 0.99 } : {}}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25'
                        : isDisabled
                        ? 'bg-neutral-100 dark:bg-neutral-800 opacity-60 cursor-not-allowed'
                        : 'bg-gradient-to-r from-neutral-900 to-neutral-800 hover:shadow-lg cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedSubjects(isSelected ? [] : ['full_bundle']);
                      }
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${
                              isSelected ? 'text-white' : isDisabled ? 'text-neutral-500' : 'text-white'
                            }`}>
                              {subject.name}
                            </span>
                            {isSelected && (
                              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                Best Value
                              </span>
                            )}
                          </div>
                          <p className={`text-xs ${
                            isSelected ? 'text-white/80' : isDisabled ? 'text-neutral-500' : 'text-white/70'
                          }`}>
                            All 6 subjects included
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${
                            isSelected ? 'text-white' : isDisabled ? 'text-neutral-500' : 'text-white'
                          }`}>
                            {formatPrice(subject.price)}
                          </div>
                          <div className={`text-xs line-through ${
                            isSelected ? 'text-white/60' : isDisabled ? 'text-neutral-500' : 'text-white/50'
                          }`}>
                            ₹5,994
                          </div>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-3 right-3"
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Divider with OR */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-neutral-900 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    OR SELECT INDIVIDUAL SUBJECTS
                  </span>
                </div>
              </div>
              
              {/* Individual Subjects - Premium Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mbaSem1Subjects.filter(s => !s.isBundle).map((subject) => {
                  const isSelected = selectedSubjects.includes(subject.id);
                  const isFullBundleSelected = selectedSubjects.includes('full_bundle');
                  const isDisabled = isFullBundleSelected;
                  
                  return (
                    <motion.div
                      key={subject.id}
                      whileHover={!isDisabled ? { y: -2 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      className={`relative rounded-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 shadow-sm'
                          : isDisabled
                          ? 'bg-neutral-50 dark:bg-neutral-800 opacity-50 cursor-not-allowed'
                          : 'bg-white dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-neutral-300 dark:hover:ring-neutral-600 hover:shadow-md cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          console.log('Card clicked:', subject.id, !isSelected);
                          
                          if (isSelected) {
                            setSelectedSubjects(prev => prev.filter(id => id !== subject.id));
                          } else {
                            setSelectedSubjects(prev => 
                              prev.filter(id => id !== 'full_bundle').concat(subject.id)
                            );
                          }
                        }
                      }}
                    >
                      <div className="p-3.5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className={`text-sm font-medium leading-snug flex-1 ${
                            isSelected 
                              ? 'text-neutral-900 dark:text-white' 
                              : isDisabled
                              ? 'text-neutral-400 dark:text-neutral-600'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {subject.name}
                          </h4>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="flex-shrink-0"
                            >
                              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-lg font-bold ${
                            isSelected 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : isDisabled
                              ? 'text-neutral-400 dark:text-neutral-600'
                              : 'text-neutral-900 dark:text-white'
                          }`}>
                            {formatPrice(subject.price)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Selection Summary */}
            {selectedSubjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Please select at least one option to continue</span>
              </motion.div>
            )}
            
            {selectedSubjects.length > 0 && !selectedSubjects.includes('full_bundle') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      {selectedSubjects.length} Subject{selectedSubjects.length > 1 ? 's' : ''} Selected
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                     Payment is based on your selection.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
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
          {/* Download Sample Button */}
          <Button
            onClick={() => setIsSampleModalOpen(true)}
            variant="outline"
            size="lg"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400 py-3 rounded-xl font-medium text-base transition-all duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Free Sample
          </Button>
          
          <Button
            onClick={handlePurchase}
            disabled={isPurchasing || (isMbaSem1Product && selectedSubjects.length === 0)}
            size="lg"
            className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 py-4 rounded-xl font-medium text-base transition-all duration-200 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPurchasing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            {isPurchasing ? 'Processing...' : 'Buy Now'}
          </Button>
          
          {/* WhatsApp Button */}
          <a
            href={settings.whatsapp.url()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 w-full px-6 py-3 bg-green-500 dark:bg-neutral-800 hover:bg-green-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-medium text-white transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Ask Questions on WhatsApp</span>
          </a>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Instant reply • No waiting • Study experts available
          </p>
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
          <DescriptionRenderer description={product.description} />
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

      {/* Mobile Sticky Footer - Only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 z-50 lg:hidden">
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing || (isMbaSem1Product && selectedSubjects.length === 0)}
          size="lg"
          className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 py-4 rounded-xl font-medium text-base transition-all duration-200 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPurchasing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isPurchasing ? 'Processing...' : `Buy Now - ${formatPrice(currentPricing.price)}`}
        </Button>
      </div>

      {/* Sample Download Modal */}
      <SampleDownloadModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        productTitle={product.title}
        onFormSubmit={handleSampleDownload}
      />
    </motion.div>
  );
}
