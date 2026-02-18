'use client'

import { useState } from 'react'
import { Star, Check, Shield, Zap, BookOpen } from 'lucide-react'

export function ProductInfo() {
  const [selectedCourse, setSelectedCourse] = useState('BBA')
  const [selectedSemester, setSelectedSemester] = useState('Sem 1')
  const [selectedBundle, setSelectedBundle] = useState('single')

  const courses = ['BBA', 'BCA', 'MBA']
  const semesters = ['Sem 1', 'Sem 2', 'Sem 3']

  const benefits = [
    { icon: Check, text: '70%+ Expected Coverage' },
    { icon: BookOpen, text: '5-Year PYQ Analysis' },
    { icon: Check, text: '2 Mock Tests Included' },
    { icon: Zap, text: '3-Day Study Plan' }
  ]

  return (
    <div className="space-y-8">
      {/* Badge and Rating */}
      <div className="flex items-center gap-4">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          Best Seller
        </span>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">4.8 (2,847)</span>
        </div>
      </div>

      {/* Product Title */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          NotesNinja Digital Exam Smart Revision Kit
        </h1>
        <p className="text-xl text-gray-600">
          Ace your MUJ semester exams with smart revision tools
        </p>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-bold text-gray-900">₹349</span>
          <span className="text-2xl text-gray-500 line-through">₹999</span>
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-lg">
            Save 65%
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-medium">
            Digital Instant Access
          </div>
          <span>•</span>
          <span>No Shipping</span>
          <span>•</span>
          <span>Lifetime Access</span>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
              <benefit.icon className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-gray-700 font-medium">{benefit.text}</span>
          </div>
        ))}
      </div>

      {/* Course Selector */}
      <div className="space-y-4">
        <div>
          <label className="text-base font-semibold text-gray-900 mb-3 block">Choose Course</label>
          <div className="flex gap-3">
            {courses.map((course) => (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
                  selectedCourse === course
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-base font-semibold text-gray-900 mb-3 block">Choose Semester</label>
          <div className="flex gap-3">
            {semesters.map((semester) => (
              <button
                key={semester}
                onClick={() => setSelectedSemester(semester)}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
                  selectedSemester === semester
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {semester}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bundle Offers */}
      <div className="space-y-4">
        <label className="text-base font-semibold text-gray-900">Select Package</label>
        
        <div
          onClick={() => setSelectedBundle('single')}
          className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
            selectedBundle === 'single'
              ? 'border-emerald-600 bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Single Semester Kit</h3>
              <p className="text-gray-600">Perfect for targeted preparation</p>
            </div>
            <span className="text-2xl font-bold text-gray-900">₹349</span>
          </div>
        </div>

        <div
          onClick={() => setSelectedBundle('bundle')}
          className={`border-2 rounded-xl p-5 cursor-pointer transition-all relative ${
            selectedBundle === 'bundle'
              ? 'border-emerald-600 bg-emerald-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
            BEST VALUE
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Full Year Bundle</h3>
              <p className="text-gray-600">All 3 semesters + bonus content</p>
              <p className="text-green-600 font-semibold mt-2">Save ₹398</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">₹899</span>
              <span className="text-gray-500 line-through block">₹1,297</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-emerald-600 text-white py-5 px-6 rounded-xl font-bold text-xl hover:bg-emerald-700 transition-colors shadow-lg">
        Get Instant Access
      </button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Secure Checkout</span>
        </div>
        <span>•</span>
        <span>UPI</span>
        <span>•</span>
        <span>Razorpay</span>
      </div>
    </div>
  )
}
