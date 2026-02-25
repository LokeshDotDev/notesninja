'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

interface Video {
  id: string
  src?: string
  thumbnail?: string
  poster?: string
  embedSrc?: string
  aspectRatio?: string
  title: string
}

interface VideoCardProps {
  video: Video
  onClick: (video: Video) => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const isEmbed = Boolean(video.embedSrc)

  // Lazy load video when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      {
        rootMargin: '50px', // Start loading slightly before entering viewport
        threshold: 0.1
      }
    )

    const currentContainer = containerRef.current

    if (currentContainer) {
      observer.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-[160px] sm:w-[200px] md:w-[240px] h-[280px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:scale-105 transition-transform duration-300 flex-shrink-0"
      onClick={() => onClick(video)}
    >
      {/* Video - paused by default, lazy loaded */}
      {isInView && isEmbed && (
        <div className="absolute inset-0">
          <div
            className="relative w-full h-full"
            style={{ aspectRatio: video.aspectRatio || '9/16' }}
          >
            <iframe
              loading="lazy"
              title={video.title}
              src={video.embedSrc}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ border: 'none', transform: 'scale(1.06)', transformOrigin: 'center'  }}
              referrerPolicy="origin"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            />
          </div>
        </div>
      )}

      {isInView && !isEmbed && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster || video.thumbnail}
          onLoadedData={() => setIsLoaded(true)}
        >
          {video.src && <source src={video.src} type="video/mp4" />}
        </video>
      )}
      
      {/* Poster/Thumbnail when not loaded */}
      {!isInView && !isEmbed && video.poster && (
        <Image
          src={video.poster}
          alt={video.title}
          fill
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Loading state */}
      {isInView && !isEmbed && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
    </div>
  )
}
