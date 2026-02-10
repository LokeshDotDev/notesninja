"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Clock,
  FileText,
  Lock,
  Mail,
  User,
  ChevronRight,
  Truck,
  Eye,
  Heart
} from "lucide-react";
import Link from "next/link";
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  price?: number;
  compareAtPrice?: number;
  isDigital?: boolean;
  digitalFiles?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    publicId: string;
    fileSize: number;
    fileType: string;
  }>;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}

interface ProfessionalCheckoutProps {
  productId: string;
}

export function ProfessionalCheckout({ productId }: ProfessionalCheckoutProps) {
  const [product, setProduct] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "processing" | "success" | "error">("details");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${productId}`);
        
        if (!response.ok) {
          setError("Product not found");
          return;
        }

        const productData = await response.json();
        console.log('Fetched product data:', productData);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return (
      formData.email &&
      formData.firstName &&
      formData.lastName
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product?.price || 0,
          currency: 'INR',
          receipt: `rcpt_${productId.slice(-8)}_${Date.now().toString().slice(-6)}`,
          notes: {
            productId,
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!product) {
      setError("Product not available");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Skip Razorpay payment for testing - go directly to success
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send confirmation email
      try {
        console.log('Product data:', product);
        console.log('Digital files:', product.digitalFiles);
        
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            productName: product.title,
            downloadLinks: product.digitalFiles || []
          })
        });

        const emailResult = await emailResponse.json();
        
        if (!emailResponse.ok) {
          console.error('Failed to send email:', emailResult.error);
        } else {
          console.log('Email sent successfully:', emailResult);
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
      
      setOrderComplete(true);
      setPaymentStep("success");
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep("error");
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleDownload = async (fileId: string, fileName: string, purchaseId?: string) => {
    try {
      console.log('Starting secure download for:', { fileId, fileName, purchaseId });
      
      // Construct secure download URL
      const downloadUrl = purchaseId 
        ? `/api/download?fileId=${fileId}&fileName=${encodeURIComponent(fileName)}&purchaseId=${purchaseId}&userEmail=${encodeURIComponent(formData.email)}`
        : `/api/download?fileUrl=${encodeURIComponent(product?.digitalFiles?.find(f => f.id === fileId)?.fileUrl || '')}&fileName=${encodeURIComponent(fileName)}`;
      
      console.log('Secure download URL:', downloadUrl);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Secure download triggered successfully');
    } catch (error) {
      console.error('Download failed:', error);
      
      // Show user-friendly error message
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-neutral-700 dark:text-neutral-300">
              Setting up secure checkout...
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Preparing your order
            </p>
          </div>
        </div>
      </div>
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
              Unable to load product for checkout.
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

  if (paymentStep === "success" && orderComplete) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          {/* Floating orbs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Success Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-4xl"
          >
            {/* Premium Card */}
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-emerald-600/10 opacity-50"></div>
              
              <div className="relative p-8 md:p-16">
                {/* Success Icon Section */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring", damping: 12, stiffness: 200 }}
                  className="flex justify-center mb-12"
                >
                  <div className="relative">
                    {/* Outer glow ring */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ delay: 0.5, duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-xl"
                    />
                    {/* Success icon container */}
                    <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                      <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" />
                      {/* Inner shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                    <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Payment
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                      Successful!
                    </span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto font-light">
                    Congratulations! Your order has been confirmed successfully. 
                    Download links have been sent to your email address.
                  </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mb-12"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">Order Details</h3>
                      <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-400 font-medium">Confirmed</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Product</p>
                          <p className="text-white font-semibold text-lg">{product.title}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Email</p>
                          <p className="text-white font-medium">{formData.email}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Amount Paid</p>
                          <p className="text-emerald-400 font-bold text-2xl">
                            {formatPrice(product.price || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Order ID</p>
                          <p className="text-white font-mono">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Downloads Section */}
                {product.digitalFiles && product.digitalFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mb-12"
                  >
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Your Downloads</h3>
                    <div className="space-y-4">
                      {product.digitalFiles.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.15, duration: 0.6 }}
                          className="group"
                        >
                          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <p className="text-white font-bold text-lg mb-2">{file.fileName}</p>
                                  <div className="flex items-center gap-4 text-white/60">
                                    <span className="flex items-center gap-2">
                                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                      {file.fileType.toUpperCase()}
                                    </span>
                                    <span>•</span>
                                    <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="lg"
                                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 rounded-xl font-bold text-lg group"
                                onClick={() => handleDownload(file.id, file.fileName)}
                              >
                                <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <Button
                    asChild
                    className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg py-4 rounded-2xl font-bold"
                  >
                    <Link href={`/product/${productId}`}>
                      <Eye className="w-6 h-6 mr-3" />
                      View Product Details
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg py-4 rounded-2xl font-bold"
                  >
                    <Link href="/">
                      <ArrowRight className="w-6 h-6 mr-3" />
                      Continue Shopping
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="mt-16 pt-8 border-t border-white/10"
                >
                  <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium">Instant Download</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium">Email Confirmation</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                NotesNinja
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                
                {/* Product Info */}
                <div className="flex gap-4 mb-6">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Digital Download • Instant Access
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatPrice(product.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Processing Fee</span>
                    <span className="font-medium text-neutral-900 dark:text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <span>Total</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatPrice(product.price || 0)}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 mt-6">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Instant Download After Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Secure Payment Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>24/7 Customer Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-10">
                  <div className="flex items-center space-x-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                      paymentStep === "details" || paymentStep === "payment" || paymentStep === "success"
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                        : 'bg-green-600 text-white shadow-lg'
                    }`}>
                      {paymentStep === "success" ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`w-20 h-1 transition-all duration-500 ${
                      paymentStep === "details" || paymentStep === "payment" || paymentStep === "success"
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                        : 'bg-neutral-300'
                    }`}></div>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                      paymentStep === "payment"
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                        : paymentStep === "success"
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-neutral-300 text-neutral-600'
                    }`}>
                      {paymentStep === "success" ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <CreditCard className="w-5 h-5" />
                      )}
                    </div>
                    <div className={`w-20 h-1 transition-all duration-500 ${
                      paymentStep === "success"
                        ? 'bg-gradient-to-r from-green-600 to-green-500' 
                        : 'bg-neutral-300'
                    }`}></div>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                      paymentStep === "success"
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg scale-110' 
                        : 'bg-neutral-300 text-neutral-600'
                    }`}>
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Step Labels */}
                <div className="flex justify-between mb-8 px-4">
                  <div className={`text-center transition-all duration-500 ${
                    paymentStep === "details" || paymentStep === "payment" || paymentStep === "success"
                      ? 'text-blue-600 font-semibold'
                      : 'text-neutral-400'
                  }`}>
                    <div className="text-xs uppercase tracking-wide">Step 1</div>
                    <div className="text-sm">Details</div>
                  </div>
                  <div className={`text-center transition-all duration-500 ${
                    paymentStep === "payment" || paymentStep === "success"
                      ? 'text-blue-600 font-semibold'
                      : 'text-neutral-400'
                  }`}>
                    <div className="text-xs uppercase tracking-wide">Step 2</div>
                    <div className="text-sm">Payment</div>
                  </div>
                  <div className={`text-center transition-all duration-500 ${
                    paymentStep === "success"
                      ? 'text-green-600 font-semibold'
                      : 'text-neutral-400'
                  }`}>
                    <div className="text-xs uppercase tracking-wide">Step 3</div>
                    <div className="text-sm">Complete</div>
                  </div>
                </div>

                {paymentStep === "details" && (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
                      Customer Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="firstName" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                            First Name *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                              id="firstName"
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              className="w-full pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="John"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                            Email Address *
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="w-full pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="lastName" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                            Last Name *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                              id="lastName"
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              className="w-full pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="w-full pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => setPaymentStep("payment")}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </>
                )}

                {paymentStep === "payment" && (
                  <>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
                      Test Mode - Payment Skipped
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Test Mode Information */}
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                              Payment Gateway Disabled
                            </h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Razorpay integration is temporarily disabled for testing post-payment flow
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-lg p-4 mt-4">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Test Mode:</strong> Clicking "Complete Order" will simulate a successful payment and take you directly to the download page.
                          </p>
                        </div>
                      </div>

                      {/* Customer Information Summary */}
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                        <h4 className="font-medium text-neutral-900 dark:text-white mb-3">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Name:</span>
                            <span className="text-neutral-900 dark:text-white">{formData.firstName} {formData.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Email:</span>
                            <span className="text-neutral-900 dark:text-white">{formData.email}</span>
                          </div>
                          {formData.phone && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Phone:</span>
                              <span className="text-neutral-900 dark:text-white">{formData.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          size="lg"
                          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Complete Order (Test Mode)
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {paymentStep === "processing" && (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                      Processing Your Payment
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Please wait while we secure your order...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  SSL Secured Payment
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
