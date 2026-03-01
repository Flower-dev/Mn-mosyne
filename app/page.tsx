"use client"

import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export default function Home() {
  const handleGithubRedirect = () => {
    window.open('https://github.com/Flower-dev/bun-app', '_blank')
  }

  return (
    <main>
      <section>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          {/* Hero Section */}
          <h1 className="text-8xl text-center font-extrabold mb-6 bg-gradient-to-r from-amber-600 to-purple-900 text-transparent bg-clip-text animate-fade-in">
            Your Content. Your Flow.
          </h1>
          <p className="text-gray-700 text-xl max-w-2xl mx-auto leading-relaxed text-center">
            Centralize all your RSS feeds in one place. A modern and
            intuitive experience to follow your favorite sources.
          </p>
          <div className="flex gap-6 justify-center mt-10">
            <Button onClick={handleGithubRedirect}>
              <Github className="mr-2" size={18} />
              View on GitHub
            </Button>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-gray-500 text-sm">
            <p>Made with ♥️ by Flower Dev</p>
          </footer>
        </div>
      </section>
      <section>{/* Form */}</section>
    </main>
  )
}
