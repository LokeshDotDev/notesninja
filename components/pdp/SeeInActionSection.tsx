'use client'

import React, { useState } from 'react'
import VideoCard from './VideoCard'
import VideoModal from './VideoModal'

interface Video {
  id: string
  src: string
  thumbnail: string
  poster: string
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

  // Triple videos for smoother infinite scroll (needs enough content to fill screen + buffer)
  const duplicatedVideos = [...videos, ...videos, ...videos]

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
              Real students. Real results.
            </p>
          </div>

          {/* Horizontal Auto-Scrolling Video Row */}
          <div className="overflow-hidden relative group w-full">
            <div className="flex gap-4 sm:gap-6 animate-scroll group-hover:[animation-play-state:paused] will-change-transform">
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
