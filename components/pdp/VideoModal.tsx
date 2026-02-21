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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video container */}
        <div className="relative aspect-[9/16] max-h-[90vh] rounded-2xl overflow-hidden bg-black">
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

        {/* Navigation arrows */}
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-white"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Video title */}
        <div className="mt-4 text-center">
          <h3 className="text-white text-lg font-medium">{video.title}</h3>
        </div>
      </div>
    </div>
  )
}
