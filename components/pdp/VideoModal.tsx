'use client'

import React, { useEffect, useRef } from 'react'

interface Video {
  id: string
  src?: string
  thumbnail?: string
  poster?: string
  embedSrc?: string
  aspectRatio?: string
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
  const isEmbed = Boolean(video?.embedSrc)

  useEffect(() => {
    if (video && videoRef.current && !isEmbed) {
      videoRef.current.play()
    }
  }, [video, isEmbed])

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
        className="relative w-full max-w-2xl mx-auto"
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
        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: video.aspectRatio || "9/16", maxHeight: "90vh" }}>
          {isEmbed ? (
            <iframe
              key={video.id}
              loading="lazy"
              title={video.title}
              src={video.embedSrc}
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
              referrerPolicy="origin"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            />
          ) : (
            <video
              key={video.id}
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              playsInline
              poster={video.poster}
            >
              {video.src && <source src={video.src} type="video/mp4" />}
            </video>
          )}
        </div>

        {/* Navigation arrows - Always visible on mobile, visible on hover on desktop */}
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-16 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
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
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-16 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
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
      </div>
    </div>
  )
}
