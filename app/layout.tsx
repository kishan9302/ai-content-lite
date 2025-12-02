// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AI Content Lite - Create Engaging Social Media Posts Instantly',
  description:
    'Generate AI-powered social media content with custom tones, platforms, and variants. Fast, futuristic, and free.',
  keywords: ['AI content', 'social media', 'content generation', 'marketing'],
  authors: [{ name: 'AI Content Lite' }],
  creator: 'AI Content Lite',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-content-lite.vercel.app',
    title: 'AI Content Lite - Create Engaging Social Media Posts',
    description:
      'Generate AI-powered social media content with custom tones, platforms, and variants.',
    siteName: 'AI Content Lite',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Lite - Create Engaging Social Media Posts',
    description:
      'Generate AI-powered social media content with custom tones, platforms, and variants.',
  },
  // ❌ Removed themeColor and viewport — these were causing the 500 stringify issue
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
