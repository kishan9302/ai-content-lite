import { Suspense } from 'react'
import { GalleryGrid } from '@/components/GalleryGrid'
import { Skeleton } from '@/components/Skeleton'
import { Card } from '@/components/Card'

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
          Content Gallery
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse through AI-generated posts and get inspiration for your next content creation.
        </p>
      </div>

      <Suspense fallback={<GallerySkeleton />}>
        <GalleryGrid />
      </Suspense>
    </div>
  )
}
