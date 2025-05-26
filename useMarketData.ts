"use client"

import { useState, useEffect, useCallback } from "react"
import { useRealTimeDataContext } from "../components/real-time-data-provider"
import type { Asset } from "../types/trading"

// Fallback data for when real-time APIs are not available
const FALLBACK_SYMBOLS = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock" as const },
  { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock" as const },
  { symbol: "MSFT", name: "Microsoft Corp.", type: "stock" as const },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock" as const },
  { symbol: "NVDA", name: "NVIDIA Corp.", type: "stock" as const },
  { symbol: "AMZN", name: "Amazon.com Inc.", type: "stock" as const },
  { symbol: "META", name: "Meta Platforms Inc.", type: "stock" as const },
  { symbol: "EURUSD", name: "Euro / US Dollar", type: "forex" as const },
  { symbol: "GBPUSD", name: "British Pound / US Dollar", type: "forex" as const },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", type: "forex" as const },
]

const generateFallbackAsset = (symbolInfo: (typeof FALLBACK_SYMBOLS)[0]): Asset => {
  const basePrice = symbolInfo.type === "forex" ? 1 + Math.random() : 100 + Math.random() * 500
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100

  return {
    symbol: symbolInfo.symbol,
    name: symbolInfo.name,
    type: symbolInfo.type,
    price: Number(basePrice.toFixed(symbolInfo.type === "forex" ? 4 : 2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000),
    high24h: Number((basePrice * 1.05).toFixed(2)),
    low24h: Number((basePrice * 0.95).toFixed(2)),
  }
}

export function useMarketData() {
  const realTimeData = useRealTimeDataContext()
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use real-time data if available, otherwise generate fallback data
  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    if (realTimeData && realTimeData.assets.length > 0) {
      // Use real-time data
      setAssets(realTimeData.assets)
      setError(realTimeData.error)
      setLoading(false)

      if (!selectedAsset && realTimeData.assets.length > 0) {
        setSelectedAsset(realTimeData.assets[0])
      }
    } else {
      // Use fallback data
      const fallbackAssets = FALLBACK_SYMBOLS.map(generateFallbackAsset)
      setAssets(fallbackAssets)
      setLoading(false)

      if (!selectedAsset) {
        setSelectedAsset(fallbackAssets[0])
      }
    }
  }, [realTimeData, selectedAsset])

  // Update fallback data periodically if not using real-time data
  useEffect(() => {
    if (realTimeData?.isConnected) return // Don't update if real-time data is working

    const interval = setInterval(() => {
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const volatility = asset.type === "forex" ? 0.001 : asset.type === "bond" ? 0.01 : 0.02
          const priceChange = (Math.random() - 0.5) * volatility * asset.price
          const newPrice = Math.max(0.01, asset.price + priceChange)
          const change = newPrice - asset.price
          const changePercent = (change / asset.price) * 100

          return {
            ...asset,
            price: Number(newPrice.toFixed(asset.type === "forex" ? 4 : 2)),
            change: Number(change.toFixed(asset.type === "forex" ? 4 : 2)),
            changePercent: Number(changePercent.toFixed(2)),
            volume: asset.volume + Math.floor(Math.random() * 10000),
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [realTimeData?.isConnected])

  // Update selected asset when assets change
  useEffect(() => {
    if (selectedAsset && assets.length > 0) {
      const updated = assets.find((a) => a.symbol === selectedAsset.symbol)
      if (updated) {
        setSelectedAsset(updated)
      }
    }
  }, [assets, selectedAsset])

  const handleSetSelectedAsset = useCallback((asset: Asset) => {
    setSelectedAsset(asset)
  }, [])

  return {
    assets,
    selectedAsset: selectedAsset || (assets.length > 0 ? assets[0] : null),
    setSelectedAsset: handleSetSelectedAsset,
    loading,
    error: error || realTimeData?.error,
    isRealTime: realTimeData?.isConnected || false,
    lastUpdate: realTimeData?.lastUpdate,
  }
}
