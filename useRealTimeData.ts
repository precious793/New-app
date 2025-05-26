"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { FinancialDataService, type RealTimeQuote } from "../lib/financial-data-apis"
import type { Asset } from "../types/trading"

interface RealTimeDataConfig {
  symbols: string[]
  interval: number // milliseconds
  apiKeys: Record<string, string>
  enabled: boolean
}

export function useRealTimeData(config: RealTimeDataConfig) {
  const [data, setData] = useState<RealTimeQuote[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const serviceRef = useRef<FinancialDataService | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize service
  useEffect(() => {
    if (Object.keys(config.apiKeys).length > 0) {
      serviceRef.current = new FinancialDataService(config.apiKeys)
    }
  }, [config.apiKeys])

  const fetchData = useCallback(async () => {
    if (!serviceRef.current || config.symbols.length === 0) return

    try {
      setError(null)
      const quotes = await serviceRef.current.fetchRealTimeData(config.symbols)

      if (quotes.length > 0) {
        setData(quotes)
        setLastUpdate(new Date())
        setIsConnected(true)
      } else {
        setError("No data received from any provider")
        setIsConnected(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setIsConnected(false)
    }
  }, [config.symbols])

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
    fetchData()

    // Set up interval
    intervalRef.current = setInterval(fetchData, config.interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [config.enabled, config.interval, fetchData])

  // Convert quotes to Asset format
  const assets: Asset[] = data.map((quote) => ({
    symbol: quote.symbol,
    name: getAssetName(quote.symbol),
    type: getAssetType(quote.symbol),
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    volume: quote.volume,
    high24h: quote.high,
    low24h: quote.low,
  }))

  return {
    assets,
    rawData: data,
    isConnected,
    error,
    lastUpdate,
    fetchData,
  }
}

function getAssetName(symbol: string): string {
  const names: Record<string, string> = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corp.",
    TSLA: "Tesla Inc.",
    NVDA: "NVIDIA Corp.",
    AMZN: "Amazon.com Inc.",
    META: "Meta Platforms Inc.",
  }
  return names[symbol] || symbol
}

function getAssetType(symbol: string): "stock" | "bond" | "forex" {
  // Simple logic - in real app, you'd have a proper mapping
  if (symbol.includes("USD") || symbol.length === 6) return "forex"
  if (symbol.startsWith("^")) return "bond"
  return "stock"
}
