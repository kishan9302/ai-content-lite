'use client';
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from './Card'

interface ImageCardProps {
  imageUrl: string
  title: string
  description?: string
  tags?: string[]
  onClick?: () => void
}

// Generate a low-quality placeholder (1x1 pixel)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function ImageCard({ imageUrl, title, description, tags, onClick }: ImageCardProps) {
  const [imageError, setImageError] = useState(false)
  const isSvg = imageUrl.endsWith('.svg')

  // For SVG files, use regular img tag as Next.js Image doesn't optimize SVGs
  // For other images, use Next.js Image with blur placeholder
  const placeholderBlur = `data:image/svg+xml;base64,${toBase64(shimmer(800, 600))}`

  return (
    <Card hover onClick={onClick} className="overflow-hidden">
      <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-t-xl">
        {isSvg || imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-opacity duration-300"
            placeholder="blur"
            blurDataURL={placeholderBlur}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

