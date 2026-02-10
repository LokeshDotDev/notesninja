import { Metadata } from "next";
import settings from "@/lib/settings";

export const metadata: Metadata = {
  title: `Refund & Cancellation Policy | ${settings.site.name}`,
  description: "Refund and cancellation policy for NotesNinja digital educational products.",
};

export default function RefundCancellation() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8">
            Refund & Cancellation Policy
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Digital Product Policy
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                NotesNinja provides digital educational materials that are available for instant download. 
                Due to the nature of digital products, our refund policy is more restrictive than for physical goods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                No Refund Policy
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Generally, all sales of digital products are final and no refunds will be issued. This is because:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Digital products cannot be returned or physically retrieved</li>
                <li>Once downloaded, the content remains in your possession</li>
                <li>We cannot verify that downloaded content has been deleted</li>
                <li>Digital products can be easily copied and distributed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Exceptions for Refunds
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Refunds may be considered in the following limited circumstances:
              </p>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    1. Technical Issues
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    If you experience technical problems preventing download or access, and our support team 
                    cannot resolve the issue within 48 hours.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    2. Product Misrepresentation
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    If the product content significantly differs from its description and we cannot provide 
                    a suitable replacement.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    3. Accidental Duplicate Purchase
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    If you accidentally purchase the same product twice within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Refund Request Process
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                To request a refund under the eligible circumstances:
              </p>
              <ol className="list-decimal pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Contact our support team within 7 days of purchase</li>
                <li>Provide your order number and purchase details</li>
                <li>Explain the reason for your refund request</li>
                <li>Include any relevant screenshots or evidence</li>
                <li>Allow 3-5 business days for review and response</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Refund Method
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Approved refunds will be processed using the original payment method and may take 
                5-10 business days to appear in your account, depending on your payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Cancellation Policy
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Since our products are digital and delivered instantly:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Orders cannot be cancelled once payment is processed</li>
                <li>Digital download links are sent immediately after purchase</li>
                <li>No cancellation fees apply as orders cannot be cancelled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Product Previews
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                We encourage customers to review product descriptions, sample materials, and previews 
                before making a purchase to ensure the content meets your educational needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Customer Support
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Our support team is available to help with:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Download and access issues</li>
                <li>Product questions and clarifications</li>
                <li>Technical troubleshooting</li>
                <li>Refund eligibility assessment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                For refund requests or support inquiries:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mt-4">
                <p className="text-neutral-700 dark:text-neutral-300">
                  Email: support@notesninja.com
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  WhatsApp: {settings.whatsapp.number}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Response time: Within 24 hours
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Policy Changes
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                NotesNinja reserves the right to modify this refund and cancellation policy at any time. 
                Changes will be effective immediately upon posting on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
