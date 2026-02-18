import { BookOpen, Target, TrendingUp, Clock, Award, Users } from 'lucide-react'
import Image from 'next/image'

const highlights = [
  {
    icon: BookOpen,
    title: 'Comprehensive Study Notes',
    description: 'Detailed notes covering every topic in your MUJ syllabus with visual explanations and examples.',
    image: '/assets/highlight-notes.jpg',
    features: ['Chapter-wise notes', 'Visual diagrams', 'Real examples', 'Easy to understand']
  },
  {
    icon: Target,
    title: 'Previous Year Questions',
    description: '5 years of solved PYQs with detailed explanations and marking schemes.',
    image: '/assets/highlight-pyq.jpg',
    features: ['5-year analysis', 'Detailed solutions', 'Marking scheme', 'Answer patterns']
  },
  {
    icon: TrendingUp,
    title: 'Mock Tests & Analysis',
    description: 'Full-length mock tests with instant results and performance analysis.',
    image: '/assets/highlight-mock.jpg',
    features: ['2 full tests', 'Instant results', 'Performance analysis', 'Weakness identification']
  },
  {
    icon: Clock,
    title: '3-Day Study Plan',
    description: 'Optimized study schedule to cover everything in just 3 days.',
    image: '/assets/highlight-plan.jpg',
    features: ['Day-wise schedule', 'Time allocation', 'Priority topics', 'Revision tips']
  },
  {
    icon: Award,
    title: 'Formula Sheets',
    description: 'Quick reference guides with all important formulas and concepts.',
    image: '/assets/highlight-formula.jpg',
    features: ['All formulas', 'Quick reference', 'Printable PDF', 'Mobile friendly']
  },
  {
    icon: Users,
    title: 'Doubt Support',
    description: 'Get your doubts cleared by experts within 24 hours.',
    image: '/assets/highlight-support.jpg',
    features: ['Expert support', '24-hour response', 'Chat facility', 'Video calls']
  }
]

export function ProductHighlights() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our Smart Revision Kit includes comprehensive tools designed specifically for MUJ students
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className={`flex gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="flex-1">
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                    <highlight.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {highlight.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {highlight.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {highlight.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-emerald-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Boost Your Scores?
          </h3>
          <p className="text-gray-600 mb-6">
            Join 2,847+ MUJ students who improved their grades with NotesNinja
          </p>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  )
}
