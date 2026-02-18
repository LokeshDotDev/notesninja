'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="sticky top-0 z-50 bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center relative">
          <p className="text-sm font-medium text-center">
            MUJ Semester Exam Prep Live Now
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 p-1 hover:bg-emerald-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
