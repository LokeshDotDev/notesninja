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
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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
      formData.lastName &&
      formData.cardNumber &&
      formData.expiryDate &&
      formData.cvv &&
      formData.nameOnCard
    );
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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
          // Continue with success but note email issue
        } else {
          console.log('Email sent successfully:', emailResult);
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Continue with success even if email fails
      }
      
      // Simulate successful payment
      setOrderComplete(true);
      setPaymentStep("success");
      
    } catch (error) {
      setPaymentStep("error");
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Call server-side API to generate accessible URL
      const response = await fetch('/api/generate-accessible-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl,
          fileName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate accessible URL');
      }

      const { accessibleUrl } = await response.json();
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = accessibleUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab if download fails
      window.open(fileUrl, '_blank');
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-neutral-800">
        <div className="flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Your order has been confirmed. Download links have been sent to your email.
            </p>
            
            {/* Download Links */}
            <Card className="mb-8 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Your Downloads
                </h3>
                {product.digitalFiles && product.digitalFiles.length > 0 && (
                  <div className="space-y-3">
                    {product.digitalFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">
                              {file.fileName}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {file.fileType.toUpperCase()} • {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleDownload(file.fileUrl, file.fileName)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href={`/product/${productId}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Product
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
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
                      Payment Information
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Card Information */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                            Card Number *
                          </Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
                            <Input
                              id="cardNumber"
                              type="text"
                              value={formData.cardNumber}
                              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                              className="w-full pl-12 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="nameOnCard" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                            Name on Card *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <Input
                              id="nameOnCard"
                              type="text"
                              value={formData.nameOnCard}
                              onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                              className="w-full pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                              Expiry Date *
                            </Label>
                            <Input
                              id="expiryDate"
                              type="text"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                              className="w-full h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cvv" className="text-neutral-700 dark:text-neutral-300 font-medium mb-2 block">
                              CVV *
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                              <Input
                                id="cvv"
                                type="text"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange("cvv", e.target.value)}
                                className="w-full pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                                placeholder="123"
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security Badges */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Secure Payment</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Your payment information is encrypted and secure. We never store your card details.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Button */}
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Complete Payment • {formatPrice(product?.price || 0)}
                          </>
                        )}
                      </Button>
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
