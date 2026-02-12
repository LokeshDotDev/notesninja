"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Star, 
  ArrowRight, 
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import { PremiumLoader, PremiumPageLoader } from "@/components/ui/premium-loader";
import Link from "next/link";
import Image from "next/image";

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
  productId: string;
}

export function ProfessionalProductDetail({ productId }: ProfessionalProductDetailProps) {
  const [product, setProduct] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${productId}`);
        
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
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      // Add to cart logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Added to cart:", product.id, quantity);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePurchase = async () => {
    if (!product) return;
    
    // Redirect to checkout page
    window.location.href = `/checkout/${product.id}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
              The study material you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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

  const images = product.images && product.images.length > 0 
    ? product.images.sort((a, b) => a.order - b.order)
    : product.imageUrl 
      ? [{ id: 'main', imageUrl: product.imageUrl, publicId: '', order: 0 }]
      : [];

  const currentImage = images[currentImageIndex] || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          
          {/* Use the category path from API if available */}
          {product.category && (
            <>
              {product.category.path ? (
                // Use full path for nested categories
                product.category.path.split('/').filter(Boolean).map((part, index, parts) => (
                  <React.Fragment key={part}>
                    <Link 
                      href={`/${parts.slice(0, index + 1).join('/')}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Link>
                    {index < parts.length - 1 && <span>/</span>}
                  </React.Fragment>
                ))
              ) : (
                // Fallback for old data without path
                <>
                  <Link href={`/${product.category.slug}`} className="hover:text-blue-600 transition-colors">
                    {product.category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span>/</span>
            </>
          )}
          <span className="text-blue-600 font-medium truncate max-w-xs">
            {product.title}
          </span>
        </motion.nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-24 h-24 text-neutral-300 dark:text-neutral-600" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isDigital && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300">
                    <Download className="w-3 h-3 mr-1" />
                    Digital Product
                  </Badge>
                )}
                {product.compareAtPrice && product.price && product.compareAtPrice > product.price && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Sale
                  </Badge>
                )}
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-blue-500 scale-105'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-cover"
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
            {/* Title and Category */}
            <div>
              {product.category && (
                <Link
                  href={`/${product.category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors mb-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                {product.title}
              </h1>
              {product.subcategory && (
                <p className="text-neutral-600 dark:text-neutral-400">
                  {product.subcategory.name}
                </p>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 dark:text-neutral-600'}`} />
                ))}
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white">4.8</span>
              <span className="text-neutral-600 dark:text-neutral-400">(127 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {product.price && (
                <>
                  <div className="flex items-center gap-2">
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-2xl text-neutral-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {product.compareAtPrice && product.price && product.compareAtPrice > product.price && (
                    <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                    </Badge>
                  )}
                </>
              )}
              {product.isDigital && (
                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300">
                  <Download className="w-3 h-3 mr-1" />
                  Instant Download
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Digital File Info */}
            {product.isDigital && product.digitalFiles && product.digitalFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                  Digital Files
                </h3>
                <div className="space-y-2">
                  {product.digitalFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {file.fileName}
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {file.fileType.toUpperCase()} • {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                      </div>
                      <Download className="w-5 h-5 text-neutral-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                Why Choose This Material?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700 dark:text-neutral-300">Expert Verified Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700 dark:text-neutral-300">Latest Curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700 dark:text-neutral-300">Exam Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-neutral-700 dark:text-neutral-300">24/7 Access</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Quantity Selector (for non-digital products) */}
              {!product.isDigital && (
                <div className="flex items-center gap-4">
                  <span className="font-medium text-neutral-900 dark:text-white">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-neutral-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Main CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {product.isDigital ? (
                  <Button
                    onClick={handlePurchase}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Get Instant Access
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {isAddingToCart ? (
                      <PremiumLoader variant="apple" size="small" className="text-white" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-600 dark:text-neutral-400'}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="p-4 rounded-full border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Zap className="w-4 h-4" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Headphones className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Product Details */}
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    Product Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Format</span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {product.isDigital ? 'Digital Download' : 'Physical Product'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Language</span>
                      <span className="font-medium text-neutral-900 dark:text-white">English</span>
                    </div>
                    {product.productType && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600 dark:text-neutral-400">Type</span>
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {product.productType.name}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Last Updated</span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Comprehensive coverage of the topic
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Easy to understand explanations
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Practice problems included
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Exam preparation focused
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    Support & Guarantee
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">24/7 Support</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Get help whenever you need it
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">Quality Guarantee</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Expert verified content
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
