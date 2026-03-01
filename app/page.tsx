"use client"

import { Home } from "@/components/home/home"
import { Auth } from "./auth/auth"

export default function HomePage() {

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Layered background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-amber-600/[.07] via-background to-purple-900/[.08]" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="animate-float absolute left-[12%] top-16 h-80 w-80 rounded-full bg-chart-3/20 blur-[100px]" />
        <div className="animate-float-delayed absolute right-[15%] top-[30%] h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
        <div className="animate-float-slow absolute bottom-20 left-[30%] h-72 w-72 rounded-full bg-chart-5/15 blur-[100px]" />
        <div className="animate-float-delayed absolute right-[40%] bottom-[15%] h-56 w-56 rounded-full bg-chart-2/15 blur-[80px]" />
      </div>

      {/* Content */}
      <div className="mx-auto flex min-h-screen w-full max-w-400 flex-col items-center justify-center gap-12 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10 lg:py-0">
        <Home />
        <Auth />
      </div>
    </main>
  )
}
