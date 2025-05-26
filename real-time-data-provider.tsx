"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRealTimeData } from "../hooks/useRealTimeData"
import type { Asset } from "../types/trading"

interface RealTimeDataContextType {
  assets: Asset[]
  isConnected: boolean
  error: string | null
  lastUpdate: Date | null
  fetchData: () => void
}

const RealTimeDataContext = createContext<RealTimeDataContextType | null>(null)

interface RealTimeDataProviderProps {
  children: ReactNode
  symbols: string[]
  interval?: number
  apiKeys: Record<string, string>
  enabled?: boolean
}

export function RealTimeDataProvider({
  children,
  symbols,
  interval = 5000, // 5 seconds
  apiKeys,
  enabled = true,
}: RealTimeDataProviderProps) {
  const realTimeData = useRealTimeData({
    symbols,
    interval,
    apiKeys,
    enabled,
  })

  return <RealTimeDataContext.Provider value={realTimeData}>{children}</RealTimeDataContext.Provider>
}

export function useRealTimeDataContext() {
  const context = useContext(RealTimeDataContext)
  if (!context) {
    throw new Error("useRealTimeDataContext must be used within RealTimeDataProvider")
  }
  return context
}
