'use client'

import React from 'react'
import SeeInActionSection from './SeeInActionSection'

// Example video data - replace with your actual video URLs
const exampleVideos = [
  {
    id: '1',
    src: '/videos/ugc-reel-1.mp4',
    thumbnail: '/videos/thumbnails/ugc-reel-1.jpg',
    poster: '/videos/posters/ugc-reel-1.jpg',
    title: 'Sarah loves her new setup!'
  },
  {
    id: '2',
    src: '/videos/ugc-reel-2.mp4',
    thumbnail: '/videos/thumbnails/ugc-reel-2.jpg',
    poster: '/videos/posters/ugc-reel-2.jpg',
    title: 'Mike\'s productivity boost'
  },
  {
    id: '3',
    src: '/videos/ugc-reel-3.mp4',
    thumbnail: '/videos/thumbnails/ugc-reel-3.jpg',
    poster: '/videos/posters/ugc-reel-3.jpg',
    title: 'Emma\'s workspace transformation'
  },
  {
    id: '4',
    src: '/videos/ugc-reel-4.mp4',
    thumbnail: '/videos/thumbnails/ugc-reel-4.jpg',
    poster: '/videos/posters/ugc-reel-4.jpg',
    title: 'John\'s gaming setup upgrade'
  },
  {
    id: '5',
    src: '/videos/ugc-reel-5.mp4',
    thumbnail: '/videos/thumbnails/ugc-reel-5.jpg',
    poster: '/videos/posters/ugc-reel-5.jpg',
    title: 'Lisa\'s home office makeover'
  },
  {
    id: '6',
    src: '/videos/ugc-reel-6.mp4',
    thumbnail: '/videos/thumbnails/ugc-reel-6.jpg',
    poster: '/videos/posters/ugc-reel-6.jpg',
    title: 'Tom\'s study routine improvement'
  }
]

export default function SeeInActionExample() {
  return (
    <SeeInActionSection videos={exampleVideos} />
  )
}
