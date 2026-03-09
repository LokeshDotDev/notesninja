"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SampleDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  onFormSubmit: (formData: SampleFormData) => Promise<void>;
}

interface SampleFormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function SampleDownloadModal({ 
  isOpen, 
  onClose, 
  productTitle,
  onFormSubmit 
}: SampleDownloadModalProps) {
  const [formData, setFormData] = useState<SampleFormData>({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onFormSubmit(formData);
      setIsSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' });
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit form:', error);
      // You could show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 1, y: "100%" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1, y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md sm:max-w-lg bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 z-10 border-b border-neutral-200 dark:border-neutral-800 shrink-0 rounded-t-3xl sm:rounded-t-2xl">
              <div className="flex items-start justify-between p-4 sm:p-6">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                      Preview Free Sample
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">
                      {productTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Enter your details to get instant access to sample notes.<br className="hidden sm:block"/>
                    <span className="block sm:inline"> No spam. Only study material.</span>
                  </p>

                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.name ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className={`w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your 10-digit phone number"
                        maxLength={10}
                        className={`w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-3.5 rounded-lg font-medium text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Get Free Sample Now</span>
                      </div>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 text-center">
                    Your details are safe and will only be used to send the sample notes.
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 text-center">
                    Includes preview pages from <br /> actual notes • Instant download • No payment required
                  </p>
                </form>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    Download Started!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    Your sample download should begin automatically. If not, check your downloads folder.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
