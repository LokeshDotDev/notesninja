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
      className="relative w-[200px] md:w-[240px] h-[360px] md:h-[420px] rounded-2xl overflow-hidden bg-black cursor-pointer hover:scale-105 transition-transform duration-300 flex-shrink-0"
      onClick={() => onClick(video)}
    >
      {/* Poster image as background */}
      <img
        src={video.poster}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Video overlay - cropped to center */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
        style={{ opacity: isLoaded ? 1 : 0 }}
        poster={video.poster}
        muted
        autoPlay
        loop
        playsInline
        onLoadedData={() => setIsLoaded(true)}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-black ml-1"
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
