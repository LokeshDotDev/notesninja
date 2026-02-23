"use client";

import React from 'react';
import { parseDescription } from '@/lib/description-parser';

interface DescriptionRendererProps {
  description: string;
  className?: string;
}

export function DescriptionRenderer({ description, className = '' }: DescriptionRendererProps) {
  const blocks = parseDescription(description);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-neutral-900 dark:text-white">
              {block.content}
            </h3>
          );
        }

        if (block.type === 'bullet' && block.emoji) {
          return (
            <div key={index} className="flex items-start gap-3 mb-2">
              <span className="text-xl flex-shrink-0">{block.emoji}</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                {block.content}
              </span>
            </div>
          );
        }

        if (block.type === 'bullet') {
          return (
            <div key={index} className="flex items-start gap-3 mb-2">
              <span className="text-neutral-600 dark:text-neutral-400 font-bold flex-shrink-0">•</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                {block.content}
              </span>
            </div>
          );
        }

        if (block.type === 'text') {
          return (
            <p key={index} className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {block.content}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
