"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
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
  FileText,
  Mail,
  User,
  ChevronRight,
  Eye,
  Check
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { 
  trackViewItem, 
  trackBeginCheckout, 
  trackPurchase, 
  trackCheckoutPageView, 
  trackError,
  trackCustomEvent
} from "@/lib/analytics";
declare global {
  interface Window {
    Razorpay: {
      (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    handleback?: boolean;
  };
}

interface RazorpayInstance {
  open(): void;
  close(): void;
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
  const { data: session } = useSession();
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
        
        // Track product view when loaded
        trackViewItem({
          id: productData.id,
          title: productData.title,
          price: productData.price,
          category: productData.category?.name,
          subcategory: productData.subcategory?.name,
          imageUrl: productData.imageUrl
        });
        trackCheckoutPageView('details', {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          category: productData.category?.name,
          subcategory: productData.subcategory?.name,
          imageUrl: productData.imageUrl
        });
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // Pre-fill form data for authenticated users
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || ['', ''];
      setFormData(prev => ({
        ...prev,
        email: session.user?.email || '',
        firstName: nameParts[0] || '',
        lastName: nameParts[1] || '',
      }));
    }
  }, [session]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Add haptic feedback simulation
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const validateForm = () => {
    return (
      formData.email &&
      formData.firstName &&
      formData.lastName
    );
  };


  const handlePayment = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      trackError('Form validation failed', 'checkout');
      return;
    }

    if (!product) {
      setError("Product not available");
      trackError('Product not available', 'checkout');
      return;
    }

    // Track begin checkout event
    trackBeginCheckout({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      imageUrl: product.imageUrl
    });
    trackCheckoutPageView('payment', {
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category?.name,
      subcategory: product.subcategory?.name,
      imageUrl: product.imageUrl
    });

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          currency: 'INR',
          receipt: `receipt_${productId}`,
          notes: {
            productId,
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`
          }
        })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Notes Ninja',
        description: product.title,
        order_id: orderData.order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId,
              customerEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`,
              userId: session?.user?.id || null
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            // Track successful purchase
            trackPurchase({
              transactionId: response.razorpay_payment_id,
              value: product.price || 0,
              currency: 'INR',
              products: [{
                id: product.id,
                title: product.title,
                price: product.price,
                category: product.category?.name,
                subcategory: product.subcategory?.name,
                imageUrl: product.imageUrl
              }],
              customerEmail: formData.email,
              customerName: `${formData.firstName} ${formData.lastName}`
            });

            // Track custom event for digital product purchase
            trackCustomEvent('digital_product_purchase', {
              product_id: product.id,
              product_name: product.title,
              category: product.category?.name,
              price: product.price,
              payment_method: 'razorpay',
              customer_email: formData.email
            });

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
          } else {
            throw new Error(verifyData.error || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            // Track payment modal dismissal
            trackCustomEvent('checkout_modal_dismissed', {
              product_id: product.id,
              product_name: product.title,
              step: 'payment'
            });
            // Redirect to specified page when user closes payment modal
            window.location.href = '/online-manipal-university/notes-and-mockpaper';
          },
          escape: true,
          backdropclose: true,
          handleback: true
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#000000'
        }
      };

      const razorpay = new (window.Razorpay as unknown as new (options: RazorpayOptions) => RazorpayInstance)(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStep("error");
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.");
      
      // Track payment failure
      trackError(error instanceof Error ? error.message : "Payment failed", 'payment');
      trackCustomEvent('payment_failed', {
        product_id: product?.id,
        product_name: product?.title,
        error_message: error instanceof Error ? error.message : "Unknown error"
      });
      
      // Redirect to specified page on payment failure
      setTimeout(() => {
        window.location.href = '/online-manipal-university/notes-and-mockpaper';
      }, 2000);
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

  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  const handleDownload = async (fileId: string, fileName: string, purchaseId?: string) => {
    try {
      console.log('Starting secure download for:', { fileId, fileName, purchaseId });
      
      // Add to downloading set to show loading state
      setDownloadingFiles(prev => new Set(prev).add(fileId));
      
      // Construct secure download URL
      const downloadUrl = purchaseId 
        ? `/api/download?fileId=${fileId}&fileName=${encodeURIComponent(fileName)}&purchaseId=${purchaseId}&userEmail=${encodeURIComponent(formData.email)}`
        : `/api/download?fileUrl=${encodeURIComponent(product?.digitalFiles?.find(f => f.id === fileId)?.fileUrl || '')}&fileName=${encodeURIComponent(fileName)}`;
      
      console.log('Secure download URL:', downloadUrl);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Secure download triggered successfully');
      
      // Remove from downloading set after a short delay
      setTimeout(() => {
        setDownloadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }, 2000);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Remove from downloading set on error
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      
      // Show user-friendly error message
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Apple-style subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100/50 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="relative mb-12">
              {/* Apple-style loading icon */}
              <motion.div 
                className="w-16 h-16 mx-auto relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gray-900 rounded-full opacity-10"></div>
                <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-gray-400" />
                </div>
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Preparing Your Experience
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Setting up your secure checkout...
            </motion.p>
            
            {/* Apple-style loading dots */}
            <motion.div 
              className="flex justify-center gap-2 mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-300 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          </motion.div>
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
              <Link href="/online-manipal-university/notes-and-mockpaper">
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to notes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === "success" && orderComplete) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Apple-style subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100/30 via-transparent to-transparent"></div>
        
        {/* Success Content - Apple Style */}
        <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="text-center"
          >
            {/* Success Icon - Apple Style */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", damping: 12, stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Payment Successful!
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Congratulations! Your order has been confirmed successfully. 
                Download links have been sent to your email address.
              </p>
            </motion.div>

            {/* Order Details Card - Apple Style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden max-w-2xl mx-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Order Details</h3>
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Confirmed</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Product</p>
                        <p className="text-gray-900 font-semibold text-lg">{product.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Email</p>
                        <p className="text-gray-900 font-medium">{formData.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Amount Paid</p>
                        <p className="text-green-600 font-bold text-2xl">
                          {formatPrice(product.price || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Order ID</p>
                        <p className="text-gray-900 font-mono text-sm">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Downloads Section - Apple Style */}
            {product.digitalFiles && product.digitalFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-12"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-8">Your Downloads</h3>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {product.digitalFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.15, duration: 0.6 }}
                      className="group"
                    >
                      <div className="bg-white rounded-2xl border border-gray-200/60 p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg mb-1">{file.fileName}</p>
                              <div className="flex items-center gap-4 text-gray-600 text-sm">
                                <span>{file.fileType.toUpperCase()}</span>
                                <span>•</span>
                                <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDownload(file.id, file.fileName)}
                            disabled={downloadingFiles.has(file.id)}
                            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {downloadingFiles.has(file.id) ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons - Apple Style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Link href={`/product/${productId}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Product Details
                </Link>
              </Button>
              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <Link href="/">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators - Apple Style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 pt-8 border-t border-gray-200/60"
            >
              <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Instant Download</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Email Confirmation</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Apple-style subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100/50 via-transparent to-transparent"></div>
      
      {/* Apple-style Content Layout */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Summary - Apple Style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-1"
          >
            <motion.div 
              className="sticky top-8"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Apple-style Card */}
              <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                {/* Product Header */}
                <div className="p-6 border-b border-gray-200/60">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Product Info */}
                  <div className="flex gap-4">
                    {product.imageUrl ? (
                      <motion.div 
                        className="relative flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-xl"></div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <FileText className="w-8 h-8 text-gray-400" />
                      </motion.div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 leading-tight">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          Digital
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          Instant Access
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Price Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(product.price || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Processing</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600">FREE</span>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200/60">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-semibold text-gray-900">
                        {formatPrice(product.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="px-6 pb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Instant download after purchase</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* User Info Section */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {session ? "Account Information" : "Contact Information"}
                  </h3>
                  {session && (
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Signed In</span>
                    </div>
                  )}
                </div>
                
                {session ? (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-sm text-gray-600">{session.user?.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Your purchase will be linked to your account for easy access in your dashboard.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-3">
                    You can purchase as a guest or create an account to track your orders.
                  </p>
                )}
              </div>
            </div>

            {/* Payment Form - Apple Style */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-2"
          >
            {/* Apple-style Card */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
              {/* Progress Steps - Apple Style */}
              <div className="px-8 py-6 border-b border-gray-200/60">
                <div className="flex items-center justify-center space-x-8">
                  {[
                    { step: "details", label: "Details", completed: paymentStep !== "details" },
                    { step: "payment", label: "Payment", completed: paymentStep === "success" },
                    { step: "success", label: "Complete", completed: false }
                  ].map((item, index) => (
                    <React.Fragment key={item.step}>
                      <div className="flex flex-col items-center">
                        <motion.div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                            item.completed
                              ? 'bg-green-600 text-white'
                              : paymentStep === item.step
                              ? 'bg-black text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </motion.div>
                        <span className={`mt-2 text-sm font-medium transition-colors duration-500 ${
                          item.completed
                            ? 'text-green-600'
                            : paymentStep === item.step
                            ? 'text-black'
                            : 'text-gray-500'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <motion.div
                          className={`w-16 h-0.5 transition-colors duration-500 ${
                            item.completed ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: item.completed ? 1 : 0.3 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-8">
                {paymentStep === "details" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-3xl font-semibold text-gray-900 mb-2">Customer Information</h2>
                      <p className="text-gray-600">Enter your details for a seamless checkout experience</p>
                    </div>
                    
                    <div className="space-y-6">
                      {!session && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                              </Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  id="firstName"
                                  type="text"
                                  value={formData.firstName}
                                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                                  onFocus={() => handleFieldFocus("firstName")}
                                  onBlur={handleFieldBlur}
                                  className={`pl-10 h-12 rounded-xl border transition-all duration-200 ${
                                    focusedField === "firstName"
                                      ? 'border-black bg-gray-50'
                                      : 'border-gray-300 bg-white'
                                  }`}
                                  placeholder="John"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                              </Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  id="lastName"
                                  type="text"
                                  value={formData.lastName}
                                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                                  onFocus={() => handleFieldFocus("lastName")}
                                  onBlur={handleFieldBlur}
                                  className={`pl-10 h-12 rounded-xl border transition-all duration-200 ${
                                    focusedField === "lastName"
                                      ? 'border-black bg-gray-50'
                                      : 'border-gray-300 bg-white'
                                  }`}
                                  placeholder="Doe"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            onFocus={() => handleFieldFocus("email")}
                            onBlur={handleFieldBlur}
                            disabled={!!session}
                            className={`pl-10 h-12 rounded-xl border transition-all duration-200 ${
                              focusedField === "email"
                                ? 'border-black bg-gray-50'
                                : 'border-gray-300 bg-white'
                            } ${session ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        {session && (
                          <p className="text-xs text-gray-500 mt-1">Email is pre-filled from your account</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number (Optional)
                        </Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            onFocus={() => handleFieldFocus("phone")}
                            onBlur={handleFieldBlur}
                            className={`pl-10 h-12 rounded-xl border transition-all duration-200 ${
                              focusedField === "phone"
                                ? 'border-black bg-gray-50'
                                : 'border-gray-300 bg-white'
                            }`}
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="mt-8 flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={() => setPaymentStep("payment")}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                      >
                        Continue to Payment
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
                {paymentStep === "payment" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-3xl font-semibold text-gray-900 mb-2">Payment Details</h2>
                      <p className="text-gray-600">Review your information and complete your purchase</p>
                    </div>
                    
                    {/* Customer Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                      <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium text-gray-900">{formData.email}</span>
                        </div>
                        {formData.phone && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Phone</span>
                            <span className="font-medium text-gray-900">{formData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <motion.div 
                      className="flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay with Razorpay
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
                
                {paymentStep === "processing" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Your Order</h2>
                    <p className="text-gray-600">Please wait while we secure your purchase...</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
