"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { WebScraperService, type ScrapedAsset } from "../lib/web-scraper-service"
import type { GlobalAsset } from "../lib/global-market-data"

interface WebScrapedDataConfig {
  updateInterval: number
  enabled: boolean
  maxRetries: number
}

export function useWebScrapedData(config: WebScrapedDataConfig) {
  const [assets, setAssets] = useState<GlobalAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [scrapingProgress, setScrapingProgress] = useState({ current: 0, total: 0 })

  const serviceRef = useRef<WebScraperService | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)

  // Initialize service
  useEffect(() => {
    serviceRef.current = new WebScraperService()
  }, [])

  const convertScrapedToGlobal = useCallback((scraped: ScrapedAsset): GlobalAsset => {
    // Determine asset type and category
    let type: GlobalAsset["type"] = "stock"
    let category = "stocks"

    if (scraped.symbol.includes("=X")) {
      type = "forex"
      category = "forex"
    } else if (scraped.symbol.includes("-USD")) {
      type = "crypto"
      category = "crypto"
    } else if (scraped.symbol.includes("=F")) {
      type = "commodity"
      category = "commodities"
    } else if (scraped.symbol.startsWith("^")) {
      type = "index"
      category = "indices"
    }

    // Extract trading pair for forex and crypto
    let tradingPair = undefined
    if (type === "forex" && scraped.symbol.includes("=X")) {
      const pair = scraped.symbol.replace("=X", "")
      if (pair.length === 6) {
        tradingPair = {
          base: pair.substring(0, 3),
          quote: pair.substring(3, 6),
          symbol: scraped.symbol,
          exchange: scraped.exchange,
        }
      }
    } else if (type === "crypto" && scraped.symbol.includes("-USD")) {
      const base = scraped.symbol.replace("-USD", "")
      tradingPair = {
        base: base,
        quote: "USD",
        symbol: scraped.symbol,
        exchange: scraped.exchange,
      }
    }

    return {
      symbol: scraped.symbol,
      name: scraped.name,
      category,
      type,
      price: scraped.price,
      change: scraped.change,
      changePercent: scraped.changePercent,
      volume: scraped.volume,
      high24h: scraped.high,
      low24h: scraped.low,
      marketCap: scraped.marketCap,
      tradingPair,
      exchange: scraped.exchange,
      country: getCountryFromExchange(scraped.exchange),
      currency: scraped.currency,
      lastUpdate: scraped.timestamp,
      isActive: true,
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    if (!serviceRef.current) return

    try {
      setError(null)
      setLoading(true)
      setScrapingProgress({ current: 0, total: 100 })

      console.log("🌐 Starting web scraping of global financial data...")

      const scrapedAssets = await serviceRef.current.scrapeAllSymbols()

      if (scrapedAssets.length > 0) {
        const globalAssets = scrapedAssets.map(convertScrapedToGlobal)
        setAssets(globalAssets)
        setLastUpdate(new Date())
        setIsConnected(true)
        retryCountRef.current = 0

        console.log(`✅ Successfully scraped ${globalAssets.length} assets from the web`)

        // Log breakdown by category
        const breakdown = globalAssets.reduce(
          (acc, asset) => {
            acc[asset.category] = (acc[asset.category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        console.log("📊 Asset breakdown:", breakdown)
      } else {
        setError("No data could be scraped from financial websites")
        setIsConnected(false)
        retryCountRef.current++
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Web scraping failed"
      setError(errorMessage)
      setIsConnected(false)
      retryCountRef.current++

      console.error("🚫 Web scraping error:", err)
    } finally {
      setLoading(false)
      setScrapingProgress({ current: 100, total: 100 })
    }
  }, [convertScrapedToGlobal])

  // Start/stop scraping
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
    intervalRef.current = setInterval(() => {
      // Only retry if we haven't exceeded max retries
      if (retryCountRef.current < config.maxRetries) {
        fetchAllData()
      } else {
        console.warn(`⚠️ Max retries (${config.maxRetries}) exceeded, stopping automatic updates`)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }, config.updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [config.enabled, config.updateInterval, config.maxRetries, fetchAllData])

  const manualRefresh = useCallback(() => {
    retryCountRef.current = 0 // Reset retry count on manual refresh
    fetchAllData()
  }, [fetchAllData])

  return {
    assets,
    loading,
    error,
    lastUpdate,
    isConnected,
    scrapingProgress,
    manualRefresh,
    retryCount: retryCountRef.current,
    maxRetries: config.maxRetries,
  }
}

function getCountryFromExchange(exchange: string): string {
  const exchangeCountryMap: Record<string, string> = {
    NASDAQ: "US",
    NYSE: "US",
    CBOE: "US",
    LSE: "GB",
    XETRA: "DE",
    EURONEXT: "EU",
    TSE: "JP",
    HKEX: "HK",
    SSE: "CN",
    BSE: "IN",
    NSE: "IN",
    SIX: "CH",
    "Forex Market": "Global",
    "Global Crypto": "Global",
    "Futures Market": "Global",
    "Index Market": "Global",
  }

  return exchangeCountryMap[exchange] || "Unknown"
}
