"use client"

import type { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  isTransitioning: boolean
  className?: string
}

export function PageTransition({ children, isTransitioning, className = "" }: PageTransitionProps) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}
