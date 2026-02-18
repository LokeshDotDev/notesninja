"use client";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is this updated for MUJ current semester?",
    answer: "Yes! All our Smart Revision Kits are specifically updated for the current MUJ semester syllabus and exam patterns. We continuously update content based on the latest faculty guidelines and previous semester trends."
  },
  {
    question: "Is this enough to pass my exams?",
    answer: "Our Smart Revision Kits cover 70%+ of expected questions and provide comprehensive preparation. While we can't guarantee specific scores, thousands of MUJ students have improved their grades significantly using our materials. We recommend combining our kits with regular study for best results."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes! We offer a 7-day 100% money-back guarantee. If you're not satisfied with the Smart Revision Kit for any reason, simply contact us within 7 days of purchase for a full refund, no questions asked."
  },
  {
    question: "When should I start preparing?",
    answer: "The ideal time is 3-4 weeks before your exams. Our 3-Day Study Plan is designed for final revision, but you'll get maximum benefit by starting early with the Expected Questions and PYQ Analysis sections."
  },
  {
    question: "How do I access the materials after purchase?",
    answer: "Instant access! After payment, you'll receive a download link via email with all 4 modules in PDF format. You can download them on any device and study offline. No subscriptions or recurring payments."
  },
  {
    question: "Are these materials specific to my branch/subject?",
    answer: "We offer branch-specific Smart Revision Kits for all major MUJ programs including CSE, ECE, ME, CE, and more. Make sure to select your specific branch during checkout for the most relevant content."
  },
  {
    question: "What makes this different from free study materials?",
    answer: "Our materials are professionally researched, structured, and updated specifically for MUJ patterns. We invest 500+ hours per semester analyzing patterns, consulting faculty, and ensuring quality. Free materials are often outdated, unstructured, and not tailored to MUJ's specific evaluation patterns."
  },
  {
    question: "Can I share the materials with my friends?",
    answer: "Each purchase is for individual use only. The materials are copyrighted and sharing them violates our terms of service. We keep prices affordable so every student can afford their own copy and support our continued research efforts."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers. Here's what most MUJ students want to know.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              We're here to help you succeed in your MUJ exams
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
