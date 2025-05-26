"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { GlobalMarketDataService, type GlobalAsset, type MarketCategory } from "../lib/global-market-data"

interface GlobalMarketDataConfig {
  apiKeys: Record<string, string>
  updateInterval: number
  categories: string[]
  enabled: boolean
}

export function useGlobalMarketData(config: GlobalMarketDataConfig) {
  const [assets, setAssets] = useState<GlobalAsset[]>([])
  const [categories, setCategories] = useState<MarketCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const serviceRef = useRef<GlobalMarketDataService | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize service
  useEffect(() => {
    serviceRef.current = new GlobalMarketDataService(config.apiKeys)
    setCategories(serviceRef.current.getMarketCategories())
  }, [config.apiKeys])

  const fetchAllData = useCallback(async () => {
    if (!serviceRef.current) return

    try {
      setError(null)
      setLoading(true)

      const allAssets = await serviceRef.current.fetchAllMarketData()

      if (allAssets.length > 0) {
        setAssets(allAssets)
        setLastUpdate(new Date())
        setIsConnected(true)
        console.log(`Loaded ${allAssets.length} global market assets`)
      } else {
        setError("No market data received")
        setIsConnected(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch market data")
      setIsConnected(false)
      console.error("Global market data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Start/stop real-time updates
  useEffect(() => {
    if (!config.enabled || !serviceRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsConnected(false)
      return
    }

    // Initial fetch
    fetchAllData()

    // Set up interval for updates
    intervalRef.current = setInterval(fetchAllData, config.updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [config.enabled, config.updateInterval, fetchAllData])

  // Filter assets by category
  const filteredAssets = assets.filter((asset) => {
    if (selectedCategory === "all") return true
    return asset.category === selectedCategory
  })

  // Get assets by category
  const getAssetsByCategory = useCallback(
    (category: string): GlobalAsset[] => {
      return assets.filter((asset) => asset.category === category)
    },
    [assets],
  )

  // Search assets
  const searchAssets = useCallback(
    (query: string): GlobalAsset[] => {
      if (!query.trim()) return filteredAssets

      const searchTerm = query.toLowerCase()
      return filteredAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchTerm) ||
          asset.name.toLowerCase().includes(searchTerm) ||
          asset.exchange.toLowerCase().includes(searchTerm) ||
          asset.country.toLowerCase().includes(searchTerm),
      )
    },
    [filteredAssets],
  )

  // Get market statistics
  const getMarketStats = useCallback(() => {
    const stats = {
      totalAssets: assets.length,
      gainers: assets.filter((a) => a.changePercent > 0).length,
      losers: assets.filter((a) => a.changePercent < 0).length,
      unchanged: assets.filter((a) => a.changePercent === 0).length,
      topGainer: assets.reduce(
        (max, asset) => (asset.changePercent > (max?.changePercent || Number.NEGATIVE_INFINITY) ? asset : max),
        null as GlobalAsset | null,
      ),
      topLoser: assets.reduce(
        (min, asset) => (asset.changePercent < (min?.changePercent || Number.POSITIVE_INFINITY) ? asset : min),
        null as GlobalAsset | null,
      ),
      totalVolume: assets.reduce((sum, asset) => sum + asset.volume, 0),
      categoryCounts: categories.reduce(
        (counts, category) => {
          counts[category.id] = assets.filter((a) => a.category === category.id).length
          return counts
        },
        {} as Record<string, number>,
      ),
    }
    return stats
  }, [assets, categories])

  return {
    assets: filteredAssets,
    allAssets: assets,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    lastUpdate,
    isConnected,
    fetchAllData,
    getAssetsByCategory,
    searchAssets,
    getMarketStats,
  }
}
