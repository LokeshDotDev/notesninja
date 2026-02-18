import { AnnouncementBar } from '@/components/pdp/AnnouncementBar'
import { MediaGallery } from '@/components/pdp/MediaGallery'
import { ProductInfo } from '@/components/pdp/ProductInfo'
import { ProductHighlights } from '@/components/pdp/ProductHighlights'
import { TrustSignals } from '@/components/pdp/TrustSignals'
import { AccordionSection } from '@/components/pdp/AccordionSection'
import { ProductDemo } from '@/components/pdp/ProductDemo'
import { StudentReviews } from '@/components/pdp/StudentReviews'

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Media Gallery */}
          <div className="space-y-4">
            <MediaGallery />
          </div>
          
          {/* Right Side - Product Info */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-6">
              <ProductInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Product Highlights */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductHighlights />
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustSignals />
        </div>
      </section>

      {/* Product Demo */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDemo />
        </div>
      </section>

      {/* Student Reviews */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StudentReviews />
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AccordionSection />
        </div>
      </section>
    </div>
  )
}
