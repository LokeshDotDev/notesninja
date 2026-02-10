import { Metadata } from "next";
import settings from "@/lib/settings";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${settings.site.name}`,
  description: "Terms and conditions for using NotesNinja educational digital products and services.",
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8">
            Terms & Conditions
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Agreement to Terms
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                By accessing and using NotesNinja, you agree to be bound by these Terms & Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Description of Service
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                NotesNinja provides digital educational materials including study notes, guides, 
                and academic resources for students and educators. Our materials are available for 
                instant download after purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                User Responsibilities
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                As a user of NotesNinja, you agree to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Use study materials for personal educational purposes only</li>
                <li>Not share, redistribute, or resell our digital products</li>
                <li>Respect intellectual property rights</li>
                <li>Not attempt to reverse engineer or copy our content</li>
                <li>Maintain the security of your account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Payment Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                    Pricing
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    All prices are listed in USD and are subject to change without notice. 
                    Prices are confirmed at the time of purchase.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-2">
                    Payment Methods
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    We accept secure online payments through our trusted payment processors. 
                    All payment information is encrypted and processed securely.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Digital Product License
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                When you purchase digital materials from NotesNinja, you receive:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Personal, non-commercial use license</li>
                <li>Lifetime access to downloaded materials</li>
                <li>Right to use for educational purposes</li>
                <li>No right to redistribute or resell</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Intellectual Property
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                All content on NotesNinja, including study materials, guides, and educational resources, 
                is protected by copyright and other intellectual property laws. You may not use, copy, 
                reproduce, or distribute our content without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Prohibited Activities
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                You may not:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>Share account credentials with others</li>
                <li>Distribute purchased materials to third parties</li>
                <li>Use automated tools to access our platform</li>
                <li>Attempt to interfere with website functionality</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Disclaimer of Warranties
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Our educational materials are provided "as is" without warranties of any kind. 
                While we strive for accuracy, we cannot guarantee that all content is error-free 
                or suitable for your specific educational needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                NotesNinja shall not be liable for any indirect, incidental, or consequential damages 
                arising from your use of our educational materials or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Termination
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                We reserve the right to terminate or suspend access to our services for users who 
                violate these terms. Upon termination, your right to use our services ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Changes to Terms
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                We may update these terms from time to time. Changes will be effective immediately 
                upon posting. Your continued use of our services constitutes acceptance of any 
                modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                If you have questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg mt-4">
                <p className="text-neutral-700 dark:text-neutral-300">
                  Email: legal@notesninja.com
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
