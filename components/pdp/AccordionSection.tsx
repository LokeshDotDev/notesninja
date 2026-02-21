"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, BookOpen, Download, CreditCard, Shield } from 'lucide-react';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function AccordionSection() {
  const [openItem, setOpenItem] = useState<string | null>('faq1');

  const faqItems: AccordionItem[] = [
    {
      id: 'faq1',
      question: "What formats are the study materials available in?",
      answer: "Our study materials are available in digital formats including PDF, PPT, and sometimes video lectures. You can download them instantly after purchase and access them on any device.",
      icon: Download
    },
    {
      id: 'faq2',
      question: "How do I access my purchased materials?",
      answer: "Once you complete your purchase, you&apos;ll receive instant access to download your materials. You&apos;ll also receive an email with download links that you can use anytime. All purchases are stored in your account for future access.",
      icon: BookOpen
    },
    {
      id: 'faq3',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets. All transactions are secure and processed through trusted payment gateways.",
      icon: CreditCard
    },
    {
      id: 'faq4',
      question: "Is there a money-back guarantee?",
      answer: "Yes! We offer a 7-day money-back guarantee if you&apos;re not satisfied with the quality of our study materials. Contact our support team and we&apos;ll process your refund within 24 hours.",
      icon: Shield
    },
    {
      id: 'faq5',
      question: "Are the materials updated regularly?",
      answer: "Absolutely! Our team of experts regularly updates all study materials to reflect the latest curriculum changes and exam patterns. You&apos;ll get free updates for 1 year from your purchase date.",
      icon: HelpCircle
    },
    {
      id: 'faq6',
      question: "Can I share the materials with my friends?",
      answer: "Our study materials are licensed for individual use only. Sharing or distributing the materials violates our terms of service. However, we do offer group discounts for multiple purchases.",
      icon: HelpCircle
    }
  ];

  const toggleItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          Got questions? We&apos;ve got answers. Find everything you need to know about our study materials.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-green-600" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {item.question}
                </h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-300 ${
                  openItem === item.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <AnimatePresence>
              {openItem === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed pl-11">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Contact Support */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8"
      >
        <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          Still have questions?
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
          Our support team is here to help you 24/7. Get in touch with us and we&apos;ll be happy to assist you.
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
          Contact Support
        </button>
      </motion.div> */}
    </motion.div>
  );
}
