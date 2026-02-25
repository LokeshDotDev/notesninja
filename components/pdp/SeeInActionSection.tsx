'use client'

import React, { useState } from 'react'
import VideoCard from './VideoCard'
import VideoModal from './VideoModal'

interface Video {
  id: string
  src?: string
  thumbnail?: string
  poster?: string
  embedSrc?: string
  aspectRatio?: string
  title: string
}

interface SeeInActionSectionProps {
  videos: Video[]
}

export default function SeeInActionSection({ videos }: SeeInActionSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    const index = videos.findIndex(v => v.id === video.id)
    setCurrentIndex(index)
  }

  const handleCloseModal = () => {
    setSelectedVideo(null)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % videos.length
    setCurrentIndex(nextIndex)
    setSelectedVideo(videos[nextIndex])
  }

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setSelectedVideo(videos[prevIndex])
  }

  // Double videos for smooth infinite scroll effect
  const duplicatedVideos = [...videos, ...videos]

  return (
    <>
      <section className="w-full bg-[#f8f8f8] py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Student Trust
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Verified Student Reviews
            </p>
          </div>

          {/* Horizontal Auto-Scrolling Video Row - Smooth Infinite Scroll */}
          <div className="overflow-hidden relative group w-full">
            <style jsx>{`
              @keyframes smoothVideoScroll {
                0% {
                  transform: translate3d(0, 0, 0);
                }
                100% {
                  transform: translate3d(calc(-50% - var(--gap)), 0, 0);
                }
              }
              .video-scroll-animate {
                --gap: 16px;
                gap: var(--gap);
                animation: smoothVideoScroll 10s linear infinite;
              }
              .video-scroll-animate:hover {
                animation-play-state: paused;
              }
              @media (min-width: 640px) {
                .video-scroll-animate {
                  --gap: 24px;
                  gap: var(--gap);
                  animation-duration: 16s;
                }
              }
            `}</style>
            
            {/* Left/Right fade overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#f8f8f8] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#f8f8f8] to-transparent z-10" />
            <div className="flex flex-nowrap will-change-transform video-scroll-animate">
              {duplicatedVideos.map((video, index) => (
                <VideoCard
                  key={`${video.id}-${index}`}
                  video={video}
                  onClick={handleVideoClick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        onClose={handleCloseModal}
        onNext={videos.length > 1 ? handleNext : undefined}
        onPrevious={videos.length > 1 ? handlePrevious : undefined}
      />
    </>
  )
}
