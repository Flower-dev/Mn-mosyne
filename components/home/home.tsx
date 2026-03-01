
"use client"

import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'


const Home = () => {
    const handleGithubRedirect = () => {
        window.open('https://github.com/Flower-dev/Mn-mosyne', '_blank')
    }

    return (
      <section className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[.08] px-3.5 py-1.5 text-xs font-medium text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Nouvelle expérience de lecture
        </div>

        {/* Title */}
        <h1 className="bg-linear-to-br from-foreground via-foreground/80 to-amber-600/70 bg-clip-text text-5xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-6xl lg:text-7xl">
          Your Content.
          <br />
          <span className="bg-linear-to-r from-amber-600 to-purple-900 bg-clip-text">Your Flow.</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          Centralisez vos flux RSS en un seul endroit. Une interface moderne et épurée pour suivre vos sources favorites.
        </p>

        {/* Feature pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
          {["RSS Feeds", "Temps réel", "Open Source"].map((tag) => (
            <span key={tag} className="rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Button onClick={handleGithubRedirect} size="lg" className="w-full bg-linear-to-r from-amber-600 to-purple-900 text-white shadow-md shadow-amber-600/25 transition-shadow hover:shadow-lg hover:shadow-purple-900/30 sm:w-auto">
            <Github className="mr-2 size-4" />
            View on GitHub
          </Button>
          <span className="text-xs text-muted-foreground">Built with Next.js 16</span>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-xs text-muted-foreground/60">
          <p>Made with ♥ by Flower Dev</p>
        </footer>
      </section>
    );
}

export { Home }