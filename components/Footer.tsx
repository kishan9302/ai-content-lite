import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold neon-text mb-4">AI Content Lite</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create engaging social media content powered by AI. Fast, free, and futuristic.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  Create Post
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Connect</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with Next.js, Tailwind CSS, and Framer Motion.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} AI Content Lite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
