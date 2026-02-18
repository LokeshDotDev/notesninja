'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const accordionItems = [
  {
    title: "What's Included",
    content: [
      'Comprehensive study notes covering all topics',
      '5 years of previous year questions with solutions',
      '2 full-length mock tests with detailed analysis',
      '3-day accelerated study plan',
      'Important formula sheets and quick references',
      'Access to exclusive doubt-solving sessions'
    ]
  },
  {
    title: 'How It Works',
    content: [
      '1. Purchase your chosen semester kit',
      '2. Get instant access to the digital dashboard',
      '3. Follow the structured study plan',
      '4. Practice with PYQs and mock tests',
      '5. Track your progress and improve weak areas',
      '6. Ace your exams with confidence'
    ]
  },
  {
    title: 'Who Is This For',
    content: [
      'MUJ students looking for structured exam preparation',
      'Students who want to improve their scores significantly',
      'Those who prefer digital learning over traditional methods',
      'Students seeking time-efficient study solutions',
      'Anyone wanting comprehensive coverage of syllabus'
    ]
  },
  {
    title: 'Refund Policy',
    content: [
      '7-day no-questions-asked refund policy',
      'Full refund if you\'re not satisfied with the content',
      'Process refund request through email or support chat',
      'Refund processed within 5-7 business days',
      'Access remains active during refund processing'
    ]
  },
  {
    title: 'FAQs',
    content: [
      'Q: How long do I have access to the content?',
      'A: Lifetime access with all future updates included.',
      '',
      'Q: Can I use this on multiple devices?',
      'A: Yes, access on up to 3 devices simultaneously.',
      '',
      'Q: Are the mock tests timed?',
      'A: Yes, they simulate actual exam conditions.',
      '',
      'Q: Is the content updated regularly?',
      'A: Content is updated every semester based on latest patterns.'
    ]
  }
]

export function AccordionSection() {
  const [openItems, setOpenItems] = useState<number[]>([0])

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Everything You Need to Know
      </h2>
      
      {accordionItems.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-left"
          >
            <span className="font-semibold text-gray-900">{item.title}</span>
            {openItems.includes(index) ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {openItems.includes(index) && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2">
                {item.content.map((line, lineIndex) => (
                  <p key={lineIndex} className="text-gray-700">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
