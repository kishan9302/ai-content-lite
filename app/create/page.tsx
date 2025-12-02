'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { safeGetJSON, safeSetJSON } from '@/lib/localStorage'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { Skeleton } from '@/components/Skeleton'

interface GeneratedContent {
  main_post: string
  variants: string[]
  hashtags: string[]
  imagePrompt: string
  platform: string
  tone: string
  topic: string
  generatedAt: string
}

export default function CreatePage() {
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'Professional',
    platform: 'LinkedIn',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const router = useRouter()

  const tones = ['Professional', 'Casual', 'Inspirational', 'Educational', 'Friendly']
  const platforms = ['LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'Pinterest']

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required'
    } else if (formData.topic.trim().length < 3) {
      newErrors.topic = 'Topic must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        window.alert('Generation failed: ' + (err.error || response.statusText))
        setIsGenerating(false)
        return
      }

      const result = await response.json()

      // Build a GeneratedContent shape for local use
      const pkg: GeneratedContent = {
        main_post: result.main_post || '',
        variants: result.variants || [],
        hashtags: result.hashtags || [],
        imagePrompt: result.imagePrompt || '',
        platform: formData.platform,
        tone: formData.tone,
        topic: formData.topic,
        generatedAt: new Date().toISOString(),
      }

      setGeneratedContent(pkg)
      if (result.fallback) {
        // Inform user that server returned fallback mock
        window.alert('Using fallback content (no API key or generation error).')
      }
    } catch (error) {
      console.error(error)
      window.alert('An unexpected error occurred while generating content.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleAddToGallery = () => {
    if (!generatedContent) return

    try {
      const existing = safeGetJSON<any[]>('ai_content_packages') || []
      const item = {
        id: `ai-${Date.now()}`,
        topic: generatedContent.topic,
        tone: generatedContent.tone,
        platform: generatedContent.platform,
        main_post: generatedContent.main_post,
        variants: generatedContent.variants,
        hashtags: generatedContent.hashtags,
        imagePrompt: generatedContent.imagePrompt,
        imageUrl: '',
        createdAt: generatedContent.generatedAt,
      }
      existing.unshift(item)
      safeSetJSON('ai_content_packages', existing)
      // Navigate to gallery
      router.push('/gallery')
    } catch (err) {
      console.error('Failed to add to gallery', err)
      window.alert('Failed to add to gallery. See console for details.')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text text-center">
          Create AI-Powered Post
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
          Fill in the details and let AI generate engaging content for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Topic"
                placeholder="e.g., Future of AI in Creative Industries"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                error={errors.topic}
                required
                aria-label="Enter post topic"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg glass border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300 text-gray-900 dark:text-gray-50"
                  aria-label="Select tone"
                >
                  {tones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg glass border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all duration-300 text-gray-900 dark:text-gray-50"
                  aria-label="Select platform"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              {errors.submit && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
                  {errors.submit}
                </div>
              )}

              <Button type="submit" isLoading={isGenerating} className="w-full" size="lg">
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold mb-6">Generating Content...</h2>
                  <div className="space-y-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-12" />
                  </div>
                </Card>
              </motion.div>
            ) : generatedContent ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold neon-text">Generated Content</h2>
                    <Button onClick={handleAddToGallery} size="sm">
                      Add to Gallery
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Main Post */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Main Post</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedContent.main_post)}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-gray-50 whitespace-pre-wrap">
                          {generatedContent.main_post}
                        </p>
                      </div>
                    </div>

                    {/* Variants */}
                    {generatedContent.variants.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Variants</h3>
                        <div className="space-y-4">
                          {generatedContent.variants.map((variant, index) => (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Variant {index + 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(variant)}
                                >
                                  Copy
                                </Button>
                              </div>
                              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-900 dark:text-gray-50 whitespace-pre-wrap">
                                  {variant}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {generatedContent.hashtags.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">Hashtags</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(generatedContent.hashtags.join(' '))}
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.hashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Prompt */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Image Prompt</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedContent.imagePrompt)}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {generatedContent.imagePrompt}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fill out the form and click &quot;Generate Content&quot; to get started.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
