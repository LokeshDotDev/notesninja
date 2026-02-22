'use client'

import React, { useRef, useEffect, useState } from 'react'

interface Video {
  id: string
  src: string
  thumbnail: string
  poster: string
  title: string
}

interface VideoCardProps {
  video: Video
  onClick: (video: Video) => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked, that's ok
      })
    }
  }, [])

  return (
    <div
      className="relative w-[160px] sm:w-[200px] md:w-[240px] h-[280px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:scale-105 transition-transform duration-300 flex-shrink-0"
      onClick={() => onClick(video)}
    >
      {/* Video - autoplay and loop */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setIsLoaded(true)}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-black ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
