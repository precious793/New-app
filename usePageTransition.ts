"use client"

import { useState, useCallback } from "react"

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentPage, setCurrentPage] = useState("markets")

  const navigateToPage = useCallback((page: string, delay = 300) => {
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentPage(page)
      setIsTransitioning(false)
    }, delay)
  }, [])

  return {
    isTransitioning,
    currentPage,
    navigateToPage,
    setCurrentPage,
  }
}
