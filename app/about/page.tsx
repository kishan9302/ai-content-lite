'use client';
import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default function AboutPage() {
  const features = [
    {
      title: 'Fast & Efficient',
      description:
        'Generate professional social media content in seconds, not hours. Save time and focus on what matters.',
    },
    {
      title: 'AI-Powered',
      description:
        'Leverage cutting-edge AI technology to create engaging, platform-optimized content that resonates with your audience.',
    },
    {
      title: 'Customizable',
      description:
        'Choose from multiple tones, platforms, and get multiple variants to find the perfect message for your brand.',
    },
    {
      title: 'Free to Use',
      description:
        'No subscriptions, no hidden fees. Create unlimited content with our free tierâ€”built for creators, by creators.',
    },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 neon-text">About AI Content Lite</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Empowering creators to generate engaging social media content effortlessly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <Card>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            AI Content Lite was born from a simple idea: content creation should be fast, accessible,
            and enjoyable. We believe that everyoneâ€”from solo creators to marketing teamsâ€”deserves
            tools that help them express their ideas clearly and effectively.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our platform combines the power of artificial intelligence with an intuitive,
            futuristic interface, making it easier than ever to create compelling social media
            content that stands out in today&apos;s crowded digital landscape.
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card hover className="h-full">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-12"
      >
        <Card>
          <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Built with modern web technologies for performance and reliability:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Next.js 14</strong> - Server-side rendering and optimal performance
            </li>
            <li>
              <strong>React 18</strong> - Interactive user interfaces with server components
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe development and better code quality
            </li>
            <li>
              <strong>Tailwind CSS</strong> - Utility-first styling with dark mode support
            </li>
            <li>
              <strong>Framer Motion</strong> - Smooth animations and micro-interactions
            </li>
          </ul>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="text-center"
      >
        <Card>
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Ready to transform your content creation workflow? Start generating AI-powered posts
            right nowâ€”no signup required.
          </p>
          <Link href="/create">
            <Button size="lg" className="text-lg px-8 py-4">
              Create Your First Post
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  )
}

