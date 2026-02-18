'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Image from 'next/image'

const mediaItems = [
  {
    id: 1,
    type: 'image',
    url: '/assets/mockup-main.png',
    thumbnail: '/assets/mockup-thumb-1.png',
    alt: 'NotesNinja Smart Revision Kit Main View'
  },
  {
    id: 2,
    type: 'video',
    url: '/assets/demo-video.mp4',
    thumbnail: '/assets/video-thumb.png',
    alt: 'Product Demo Video'
  },
  {
    id: 3,
    type: 'image',
    url: '/assets/mockup-features.png',
    thumbnail: '/assets/mockup-thumb-2.png',
    alt: 'Features Overview'
  },
  {
    id: 4,
    type: 'image',
    url: '/assets/mockup-samples.png',
    thumbnail: '/assets/mockup-thumb-3.png',
    alt: 'Sample Content'
  }
]

export function MediaGallery() {
  const [selectedItem, setSelectedItem] = useState(mediaItems[0])
  const [isZoomed, setIsZoomed] = useState(false)

  const handlePrevious = () => {
    const currentIndex = mediaItems.findIndex(item => item.id === selectedItem.id)
    const previousIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1
    setSelectedItem(mediaItems[previousIndex])
  }

  const handleNext = () => {
    const currentIndex = mediaItems.findIndex(item => item.id === selectedItem.id)
    const nextIndex = currentIndex === mediaItems.length - 1 ? 0 : currentIndex + 1
    setSelectedItem(mediaItems[nextIndex])
  }

  return (
    <div className="flex gap-4">
      {/* Vertical Thumbnail Strip */}
      <div className="flex flex-col gap-2">
        {mediaItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              selectedItem.id === item.id
                ? 'border-emerald-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {item.type === 'video' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <Play className="w-4 h-4 text-white" />
              </div>
            )}
            <Image
              src={item.thumbnail}
              alt={item.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Media Display */}
      <div className="flex-1">
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
          {selectedItem.type === 'video' ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 cursor-pointer hover:bg-white transition-colors">
                  <Play className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <Image
                src={selectedItem.thumbnail}
                alt={selectedItem.alt}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={`relative w-full h-full cursor-zoom-in transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                src={selectedItem.url}
                alt={selectedItem.alt}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
