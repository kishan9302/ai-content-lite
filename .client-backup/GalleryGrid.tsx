'use client';
'use client'

import { useState, useEffect } from 'react'
import { ImageCard } from './ImageCard'
import samplePosts from '@/data/samplePosts.json'
import { motion } from 'framer-motion'

interface Post {
  id: string
  topic: string
  tone: string
  platform: string
  main_post: string
  variants: string[]
  hashtags: string[]
  imagePrompt: string
  imageUrl: string
  createdAt: string
}

export function GalleryGrid() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    // Simulate loading delay for lazy loading effect
    const timer = setTimeout(() => {
      setPosts(samplePosts as Post[])
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <ImageCard
              imageUrl={post.imageUrl}
              title={post.topic}
              description={post.main_post}
              tags={post.hashtags}
              onClick={() => setSelectedPost(post)}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
              <h2 className="text-2xl font-bold neon-text">{selectedPost.topic}</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-glass-light"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Platform: {selectedPost.platform} | Tone: {selectedPost.tone}
                </p>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-gray-900 dark:text-gray-50">{selectedPost.main_post}</p>
                </div>
              </div>

              {selectedPost.variants.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Variants:</h3>
                  <div className="space-y-2">
                    {selectedPost.variants.map((variant, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{variant}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPost.hashtags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Hashtags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

