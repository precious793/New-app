"use client"

import { TrendingUp, BarChart3, Briefcase } from "lucide-react"

interface MobileNavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function MobileNavigation({ currentPage, onNavigate }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
      <div className="grid grid-cols-3 h-16">
        <button
          onClick={() => onNavigate("markets")}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentPage === "markets"
              ? "bg-blue-50 text-blue-600 border-t-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <div className="text-xs">Markets</div>
        </button>

        <button
          onClick={() => onNavigate("chart")}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentPage === "chart"
              ? "bg-blue-50 text-blue-600 border-t-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <div className="text-xs">Chart</div>
        </button>

        <button
          onClick={() => onNavigate("portfolio")}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentPage === "portfolio"
              ? "bg-blue-50 text-blue-600 border-t-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <div className="text-xs">Portfolio</div>
        </button>
      </div>
    </div>
  )
}
