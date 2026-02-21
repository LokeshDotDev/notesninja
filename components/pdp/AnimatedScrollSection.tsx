'use client'

import React, { ReactNode } from 'react'

interface AnimatedScrollSectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  bgColor?: string
  cardWidth?: string
  cardHeight?: string
  gap?: string
  scrollDuration?: number
  pauseOnHover?: boolean
}

export default function AnimatedScrollSection({
  children,
  title,
  subtitle,
  bgColor = 'bg-gray-50',
  cardWidth = 'w-[280px] md:w-[320px]',
  cardHeight = 'h-[380px] md:h-[420px]',
  gap = 'gap-6',
  scrollDuration = 40,
  pauseOnHover = true
}: AnimatedScrollSectionProps) {
  // Clone children and wrap each in a scroll card
  const items = React.Children.toArray(children)
  
  // Triple the items for infinite scroll effect
  const tripleItems = [...items, ...items, ...items]
  
  return (
    <section className={`w-full ${bgColor} py-16 md:py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base md:text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Horizontal Auto-Scrolling Container */}
        <div className="overflow-hidden relative group w-full">
          <div 
            className={`flex ${gap} ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''} will-change-transform`}
            style={{
              animation: `scroll ${scrollDuration}s linear infinite`,
            }}
          >
            {tripleItems.map((child, index) => (
              <div 
                key={index}
                className={`${cardWidth} ${cardHeight} flex-shrink-0`}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
