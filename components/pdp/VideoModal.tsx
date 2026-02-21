'use client'

import React, { useEffect, useRef } from 'react'

interface Video {
  id: string
  src: string
  thumbnail: string
  poster: string
  title: string
}

interface VideoModalProps {
  video: Video | null
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function VideoModal({ video, onClose, onNext, onPrevious }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play()
    }
  }, [video])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!video) return null

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video container */}
        <div className="relative aspect-[9/16] max-h-[80vh] sm:max-h-[85vh] rounded-2xl overflow-hidden bg-black">
          <video
            key={video.id}
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            playsInline
            poster={video.poster}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </div>

        {/* Navigation arrows - Always visible on mobile, visible on hover on desktop */}
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-12 w-10 h-10 bg-white/90 sm:bg-white/10 hover:bg-white/20 sm:hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg sm:shadow-none"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 sm:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-12 w-10 h-10 bg-white/90 sm:bg-white/10 hover:bg-white/20 sm:hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg sm:shadow-none"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 sm:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
