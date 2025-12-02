'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import samplePosts from '@/data/samplePosts.json'

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

export default function DashboardPage() {
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const posts = samplePosts as Post[]

  const stats = {
    totalPosts: posts.length,
    platforms: Array.from(new Set(posts.map((p) => p.platform))).length,
    totalVariants: posts.reduce((acc, p) => acc + p.variants.length, 0),
    lastGenerated: posts[0]?.createdAt || 'N/A',
  }

  const selectedPostData = posts.find((p) => p.id === selectedPost)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Manage your generated content and track your stats.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold neon-text mb-2">{stats.totalPosts}</div>
                  <div className="text-gray-600 dark:text-gray-400">Total Posts</div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold neon-text mb-2">{stats.platforms}</div>
                  <div className="text-gray-600 dark:text-gray-400">Platforms</div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <div className="text-center">
                  <div className="text-4xl font-bold neon-text mb-2">{stats.totalVariants}</div>
                  <div className="text-gray-600 dark:text-gray-400">Total Variants</div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold neon-text mb-2">
                    {new Date(stats.lastGenerated).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Last Generated</div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Posts List */}
          <Card>
            <h2 className="text-2xl font-bold mb-6">Generated Posts</h2>
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      selectedPost === post.id
                        ? 'bg-neon-cyan/10 border-2 border-neon-cyan'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                          {post.topic}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{post.platform}</span>
                          <span>•</span>
                          <span>{post.tone}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedPost === post.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {selectedPost === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Main Post:
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {post.main_post}
                            </p>
                          </div>
                          {post.hashtags.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Hashtags:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {post.hashtags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-1">
          {selectedPostData ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={selectedPostData.id}
            >
              <Card>
                <h2 className="text-2xl font-bold mb-6">Post Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Topic
                    </p>
                    <p className="text-gray-900 dark:text-gray-50">{selectedPostData.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Platform
                    </p>
                    <p className="text-gray-900 dark:text-gray-50">{selectedPostData.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tone
                    </p>
                    <p className="text-gray-900 dark:text-gray-50">{selectedPostData.tone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created
                    </p>
                    <p className="text-gray-900 dark:text-gray-50">
                      {new Date(selectedPostData.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Variants
                    </p>
                    <p className="text-gray-900 dark:text-gray-50">
                      {selectedPostData.variants.length} variants generated
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPostData.main_post)
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-colors"
                  >
                    Copy Main Post
                  </button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a post from the list to view details.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
