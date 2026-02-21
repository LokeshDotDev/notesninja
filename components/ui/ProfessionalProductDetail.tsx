"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Download,
  ArrowRight,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { PremiumPageLoader } from "@/components/ui/premium-loader";
import { getPricingInfo, formatDiscount } from "@/lib/pricing";
import Link from "next/link";
import Image from "next/image";
import {
  trackViewItem,
  trackCustomEvent,
  trackBeginCheckout,
} from "@/lib/analytics";

interface PostImage {
  id: string;
  imageUrl: string;
  publicId: string;
  order: number;
}

interface DigitalFile {
  id: string;
  fileName: string;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  compareAtPrice?: number;
  isDigital?: boolean;
  categoryId: string;
  subcategoryId?: string;
  productTypeId?: string;
  images?: PostImage[];
  digitalFiles?: DigitalFile[];
  category?: {
    id: string;
    name: string;
    slug: string;
    path: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
      path: string;
    };
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    path: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
      path: string;
    };
  };
  productType?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ProfessionalProductDetailProps {
  productSlug: string;
}

export function ProfessionalProductDetail({
  productSlug,
}: ProfessionalProductDetailProps) {
  const [product, setProduct] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("highlights");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/posts/${encodeURIComponent(productSlug)}`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found");
          } else {
            setError("Failed to load product");
          }
          return;
        }

        const productData = await response.json();
        setProduct(productData);

        // Track product view when loaded
        trackViewItem({
          id: productData.id,
          title: productData.title,
          price: productData.price,
          category: productData.category?.name,
          subcategory: productData.subcategory?.name,
          imageUrl: productData.imageUrl,
        });
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productSlug]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      // Add to cart logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Added to cart:", product.id, quantity);

      // Track add to cart event
      trackBeginCheckout({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category?.name,
        subcategory: product.subcategory?.name,
        imageUrl: product.imageUrl,
      });

      // Track custom event
      trackCustomEvent("add_to_cart", {
        product_id: product.id,
        product_name: product.title,
        category: product.category?.name,
        price: product.price,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePurchase = async () => {
    if (!product) return;

    setIsPurchasing(true);
    try {
      // Simulate processing time before redirect
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Redirect to checkout page
      window.location.href = `/checkout/${product.id}`;
    } catch (error) {
      console.error("Failed to process purchase:", error);
      setIsPurchasing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <PremiumPageLoader
        isLoading={true}
        text="Loading product details..."
        subtext="Preparing your study material"
      />
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              {error || "Product Not Found"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The study material you&apos;re looking for doesn&apos;t exist or
              has been moved.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images.sort((a, b) => a.order - b.order)
      : product.imageUrl
        ? [{ id: "main", imageUrl: product.imageUrl, publicId: "", order: 0 }]
        : [];

  const currentImage = images[currentImageIndex] || null;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400"
        >
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <span>/</span>

          {/* Use the category path from API if available */}
          {product.category && (
            <>
              {product.category.path ? (
                // Use full path for nested categories
                product.category.path
                  .split("/")
                  .filter(Boolean)
                  .map((part, index, parts) => (
                    <React.Fragment key={part}>
                      <Link
                        href={`/${parts.slice(0, index + 1).join("/")}`}
                        className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        {part
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </Link>
                      {index < parts.length - 1 && <span>/</span>}
                    </React.Fragment>
                  ))
              ) : (
                // Fallback for old data without path
                <>
                  <Link
                    href={`/${product.category.slug}`}
                    className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {product.category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span>/</span>
            </>
          )}
          <span className="text-neutral-900 dark:text-white font-medium truncate max-w-xs">
            {product.title}
          </span>
        </motion.nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image with Zoom */}
            <div className="relative bg-neutral-50 dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl group cursor-zoom-in">
              {currentImage ? (
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <Image
                    src={currentImage.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={100}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl rounded-full p-2 shadow-lg">
                      <Search className="w-5 h-5 text-neutral-900 dark:text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center">
                  <FileText className="w-32 h-32 text-neutral-300 dark:text-neutral-600" />
                </div>
              )}

              {/* Stock & Delivery Info - REMOVED */}

              {/* Premium Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ChevronRight className="w-6 h-6 text-neutral-900 dark:text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Premium Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900 ${
                      index === currentImageIndex
                        ? "border-neutral-900 dark:border-white scale-105 shadow-lg"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500"
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      quality={95}
                      sizes="96px"
                      style={{ objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Premium Title Section */}
            <div className="space-y-8">
              <div>
                {product.category && (
                  <Link
                    href={`/${product.category.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="inline-flex items-center text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-4"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {product.category.name}
                  </Link>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-neutral-900 dark:text-white mb-4 leading-tight">
                  {product.title}
                </h1>
                {product.subcategory && (
                  <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    {product.subcategory.name}
                  </p>
                )}
              </div>

              {/* Amazon-style Price Section */}
              <div className="space-y-4">
                {product.price && (
                  <div className="flex flex-col items-start gap-3">
                    {(() => {
                      const pricingInfo = getPricingInfo(
                        product.price || 0,
                        product.compareAtPrice,
                      );
                      return (
                        pricingInfo.hasDiscount && (
                          <div className="flex items-baseline gap-3 mb-2">
                            <span className="bg-red-600 text-white px-3 py-2 rounded text-sm font-bold">
                              Limited Time Deal
                            </span>
                            <span className="text-lg font-bold text-red-600">
                              {formatDiscount(pricingInfo.discountPercentage!)}
                            </span>
                          </div>
                        )
                      );
                    })()}
                    {(() => {
                      const pricingInfo = getPricingInfo(
                        product.price || 0,
                        product.compareAtPrice,
                      );
                      return (
                        <>
                          <div className="flex items-baseline gap-2">
                            {pricingInfo.hasDiscount && (
                              <span className="text-3xl sm:text-4xl font-bold text-red-600">
                                {formatDiscount(
                                  pricingInfo.discountPercentage!,
                                )}
                              </span>
                            )}
                            <span className="text-xl sm:text-2xl font-normal text-black dark:text-white">
                              {formatPrice(pricingInfo.price)}
                            </span>
                          </div>
                          {pricingInfo.hasDiscount && (
                            <div className="flex items-baseline">
                              <span className="text-xl text-neutral-500 dark:text-neutral-400">
                                M.R.P.:{" "}
                                <span className="line-through">
                                  {formatPrice(pricingInfo.compareAtPrice!)}
                                </span>
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
                {product.isDigital && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Instant Download</span>
                  </div>
                )}
              </div>

              {/* Premium Description
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Description
              </h3>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed text-justify">
                  {product.description}
                </p>
              </div>
            </div> */}

              {/* Amazon-style Product Highlights */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
                  <button
                    onClick={() => setSelectedTab("highlights")}
                    className={`pb-3 px-1 font-semibold text-lg transition-all duration-200 border-b-2 ${
                      selectedTab === "highlights"
                        ? "text-green-500 border-green-500"
                        : "text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Highlights
                  </button>
                  <button
                    onClick={() => setSelectedTab("description")}
                    className={`pb-3 px-1 font-semibold text-lg transition-all duration-200 border-b-2 ${
                      selectedTab === "description"
                        ? "text-green-500 border-green-500"
                        : "text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Description
                  </button>
                </div>

                {selectedTab === "highlights" && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          Comprehensive study material covering all essential
                          topics
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          Expert verified content with latest curriculum updates
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          Practice questions and exam-focused preparation
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          Instant download access for digital products
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          24/7 customer support and quality guarantee
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "description" && (
                  <div className="py-4">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Premium Action Buttons */}
              <div className="space-y-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                {/* Quantity Selector (for non-digital products) */}
                {!product.isDigital && (
                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-neutral-900 dark:text-white text-lg">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-16 text-center font-semibold text-neutral-900 dark:text-white text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Green CTA Button */}
                <div className="space-y-4">
                  {product.isDigital ? (
                    <Button
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
                    >
                      {isPurchasing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Download className="w-5 h-5 mr-2" />
                      )}
                      {isPurchasing ? "Processing..." : "Buy Now"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0"
                    >
                      {isAddingToCart ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5 mr-2" />
                      )}
                      {isAddingToCart
                        ? "Adding..."
                        : `Add to Cart - ${formatPrice(product.price || 0)}`}
                    </Button>
                  )}
                </div>

                {/* Trust Indicators - Simplified */}
                <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Secure Transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          {/* <div className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
              Description
            </h3>
            <div className="prose prose-xl dark:prose-invert max-w-none">
              <p className="text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed text-justify">
                {product.description}
              </p>
            </div>
          </div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24"
        >
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Product Details */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Product Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Format
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {product.isDigital
                        ? "Digital Download"
                        : "Physical Product"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Language
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      English
                    </span>
                  </div>
                  {product.productType && (
                    <div className="flex justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Type
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {product.productType.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-3">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Last Updated
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {product.updatedAt
                        ? new Date(product.updatedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Key Features
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Comprehensive coverage of the topic
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Easy to understand explanations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Practice problems included
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Exam preparation focused
                    </span>
                  </li>
                </ul>
              </div>

              {/* Premium Support */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Support & Guarantee
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-lg">
                        24/7 Support
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                        Get help whenever you need it
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white text-lg">
                        Quality Guarantee
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                        Expert verified content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
