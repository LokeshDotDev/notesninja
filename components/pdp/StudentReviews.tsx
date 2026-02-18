import { Star, TrendingUp } from 'lucide-react'
import Image from 'next/image'

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    course: 'BBA Sem 2',
    avatar: '/assets/student-1.jpg',
    scoreImprovement: '+23%',
    testimonial: 'NotesNinja helped me score 78% in my semester exams. The structured approach and mock tests were game-changers!',
    rating: 5
  },
  {
    id: 2,
    name: 'Rahul Verma',
    course: 'BCA Sem 1',
    avatar: '/assets/student-2.jpg',
    scoreImprovement: '+31%',
    testimonial: 'The 5-year PYQ analysis gave me clear insights into exam patterns. Worth every penny!',
    rating: 5
  },
  {
    id: 3,
    name: 'Anjali Patel',
    course: 'MBA Sem 3',
    avatar: '/assets/student-3.jpg',
    scoreImprovement: '+18%',
    testimonial: 'As a working professional, the 3-day study plan was perfect. Flexible and comprehensive.',
    rating: 4
  },
  {
    id: 4,
    name: 'Karan Mehta',
    course: 'BBA Sem 1',
    avatar: '/assets/student-4.jpg',
    scoreImprovement: '+27%',
    testimonial: 'The instant access feature saved me during last-minute prep. Excellent quality content!',
    rating: 5
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    course: 'BCA Sem 2',
    avatar: '/assets/student-5.jpg',
    scoreImprovement: '+22%',
    testimonial: 'Mock tests were exactly like the real exam. Felt confident walking into the hall.',
    rating: 5
  },
  {
    id: 6,
    name: 'Amit Kumar',
    course: 'MBA Sem 1',
    avatar: '/assets/student-6.jpg',
    scoreImprovement: '+19%',
    testimonial: 'The lifetime access is amazing. I can refer back anytime. Best investment for my studies.',
    rating: 4
  }
]

export function StudentReviews() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Student Success Stories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join 2,847+ MUJ students who improved their scores with NotesNinja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {review.scoreImprovement}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.course}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              "{review.testimonial}"
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-6 bg-emerald-50 rounded-xl p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">2,847+</div>
            <div className="text-sm text-gray-600">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">23%</div>
            <div className="text-sm text-gray-600">Avg. Score Boost</div>
          </div>
        </div>
      </div>
    </div>
  )
}
