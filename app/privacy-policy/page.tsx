import { Metadata } from "next";
import settings from "@/lib/settings";

export const metadata: Metadata = {
  title: `Privacy Policy | ${settings.site.name}`,
  description: "Privacy policy for NotesNinja - How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Introduction
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Welcome to NotesNinja. We respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
                educational digital products and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                    Personal Information
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    When you register or make a purchase, we may collect:
                  </p>
                  <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400">
                    <li>Name and email address</li>
                    <li>Payment information (processed securely)</li>
                    <li>Academic institution (optional)</li>
                    <li>Study preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                    Usage Data
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    We automatically collect information about how you use our services:
                  </p>
                  <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400">
                    <li>Pages visited and time spent</li>
                    <li>Download history</li>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Provide and maintain our educational services</li>
                <li>Process transactions and send purchase confirmations</li>
                <li>Send important updates about your study materials</li>
                <li>Improve our products and user experience</li>
                <li>Respond to your questions and support requests</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Data Protection
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>SSL encryption for all data transmissions</li>
                <li>Secure payment processing through trusted providers</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                If you have questions about this Privacy Policy or how we handle your data, 
                please contact us at:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mt-4">
                <p className="text-neutral-700 dark:text-neutral-300">
                  Email: privacy@notesninja.com
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  WhatsApp: {settings.whatsapp.number}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
