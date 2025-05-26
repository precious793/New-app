"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import type { Asset } from "../types/trading"
import type { AssetComparison, ComparisonData } from "../types/comparison"

const COMPARISON_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
]

// Global state for comparison
const globalComparisonState = {
  selectedAssets: [] as string[],
  isComparisonMode: false,
  settings: {
    assets: [],
    timeframe: "1D" as const,
    chartType: "line" as const,
    showVolume: false,
    normalizeData: true,
  } as AssetComparison,
}

export function useAssetComparison() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(globalComparisonState.selectedAssets)
  const [isComparisonMode, setIsComparisonMode] = useState(globalComparisonState.isComparisonMode)
  const [comparisonSettings, setComparisonSettings] = useState<AssetComparison>(globalComparisonState.settings)

  // Sync with global state
  useEffect(() => {
    globalComparisonState.selectedAssets = selectedAssets
    globalComparisonState.isComparisonMode = isComparisonMode
    globalComparisonState.settings = comparisonSettings
  }, [selectedAssets, isComparisonMode, comparisonSettings])

  const addAsset = useCallback((symbol: string) => {
    setSelectedAssets((prev) => {
      if (prev.includes(symbol)) return prev
      if (prev.length >= 8) return prev // Max 8 assets for comparison
      const newAssets = [...prev, symbol]
      return newAssets
    })
  }, [])

  const removeAsset = useCallback((symbol: string) => {
    setSelectedAssets((prev) => {
      const newAssets = prev.filter((s) => s !== symbol)
      if (newAssets.length === 0) {
        setIsComparisonMode(false)
      }
      return newAssets
    })
  }, [])

  const clearAssets = useCallback(() => {
    setSelectedAssets([])
    setIsComparisonMode(false)
  }, [])

  const enableComparisonMode = useCallback((enable: boolean) => {
    setIsComparisonMode(enable)
  }, [])

  const updateSettings = useCallback((settings: Partial<AssetComparison>) => {
    setComparisonSettings((prev) => ({ ...prev, ...settings }))
  }, [])

  const generateComparisonData = useCallback(
    (assets: Asset[]): ComparisonData[] => {
      return selectedAssets
        .map((symbol, index) => {
          const asset = assets.find((a) => a.symbol === symbol)
          if (!asset) return null

          // Generate more realistic historical data for comparison
          const data = []
          const now = new Date()

          // Get data points and time interval based on timeframe
          const getTimeframeConfig = () => {
            switch (comparisonSettings.timeframe) {
              case "1D":
                return { points: 48, interval: 30 * 60 * 1000 } // 30-minute intervals
              case "1W":
                return { points: 168, interval: 60 * 60 * 1000 } // 1-hour intervals
              case "1M":
                return { points: 30, interval: 24 * 60 * 60 * 1000 } // 1-day intervals
              case "3M":
                return { points: 90, interval: 24 * 60 * 60 * 1000 } // 1-day intervals
              case "1Y":
                return { points: 52, interval: 7 * 24 * 60 * 60 * 1000 } // 1-week intervals
              default:
                return { points: 48, interval: 30 * 60 * 1000 }
            }
          }

          const { points, interval } = getTimeframeConfig()

          // Start with a base price that's different from current price to show movement
          let basePrice = asset.price * (0.95 + Math.random() * 0.1) // ±5% from current price

          // Generate realistic price movements
          for (let i = points; i >= 0; i--) {
            const time = new Date(now.getTime() - i * interval)

            // Create more realistic price movements with trends
            const volatility = asset.type === "forex" ? 0.002 : asset.type === "bond" ? 0.01 : 0.03
            const trendFactor = Math.sin((i / points) * Math.PI * 2) * 0.001 // Add some trend
            const randomFactor = (Math.random() - 0.5) * volatility

            const priceChange = (trendFactor + randomFactor) * basePrice
            basePrice = Math.max(0.01, basePrice + priceChange)

            // Calculate change from current price for realistic data
            const change = basePrice - asset.price
            const changePercent = (change / asset.price) * 100

            data.push({
              time: time.toISOString(),
              price: Number(basePrice.toFixed(asset.type === "forex" ? 4 : 2)),
              volume: Math.floor(Math.random() * 1000000) + 100000,
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
            })
          }

          // Ensure the last data point is close to the current price
          const lastPoint = data[data.length - 1]
          if (lastPoint) {
            lastPoint.price = asset.price
            lastPoint.change = 0
            lastPoint.changePercent = 0
          }

          return {
            symbol,
            data: data,
            color: COMPARISON_COLORS[index % COMPARISON_COLORS.length],
          }
        })
        .filter(Boolean) as ComparisonData[]
    },
    [selectedAssets, comparisonSettings],
  )

  const normalizedData = useMemo(() => {
    return (data: ComparisonData[]) => {
      if (!comparisonSettings.normalizeData) return data

      return data.map((assetData) => ({
        ...assetData,
        data: assetData.data.map((point, index) => {
          if (index === 0) {
            return { ...point, price: 0 } // Start at 0%
          }
          const initialPrice = assetData.data[0].price
          const changePercent = ((point.price - initialPrice) / initialPrice) * 100
          return { ...point, price: Number(changePercent.toFixed(2)) }
        }),
      }))
    }
  }, [comparisonSettings.normalizeData])

  return {
    selectedAssets,
    isComparisonMode,
    comparisonSettings,
    addAsset,
    removeAsset,
    clearAssets,
    enableComparisonMode,
    updateSettings,
    generateComparisonData,
    normalizedData,
    maxAssets: 8,
  }
}
