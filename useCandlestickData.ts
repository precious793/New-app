"use client"

import { useState, useEffect, useCallback } from "react"
import type { Asset, CandlestickData } from "../types/trading"

export function useCandlestickData(asset: Asset | null, timeframe = "1D") {
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([])

  const generateCandlestickData = useCallback((asset: Asset, timeframe: string): CandlestickData[] => {
    const data: CandlestickData[] = []
    const now = new Date()

    // Get configuration based on timeframe
    const getTimeframeConfig = () => {
      switch (timeframe) {
        case "1D":
          return { points: 24, interval: 60 * 60 * 1000 } // 1-hour candles
        case "1W":
          return { points: 7, interval: 24 * 60 * 60 * 1000 } // Daily candles
        case "1M":
          return { points: 30, interval: 24 * 60 * 60 * 1000 } // Daily candles
        case "3M":
          return { points: 90, interval: 24 * 60 * 60 * 1000 } // Daily candles
        case "1Y":
          return { points: 52, interval: 7 * 24 * 60 * 60 * 1000 } // Weekly candles
        default:
          return { points: 24, interval: 60 * 60 * 1000 }
      }
    }

    const { points, interval } = getTimeframeConfig()

    // Start with a base price that creates visible movement
    let basePrice = asset.price * (0.85 + Math.random() * 0.3) // ±15% variation from current

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval)

      // Create significant price movements
      const volatility = asset.type === "forex" ? 0.01 : asset.type === "bond" ? 0.02 : 0.05

      // Add trend component
      const trendDirection = Math.sin((i / points) * Math.PI * 4) // Multiple cycles
      const trendStrength = 0.02

      // Random walk component
      const randomWalk = (Math.random() - 0.5) * volatility

      // Calculate price change
      const priceChange = (trendDirection * trendStrength + randomWalk) * basePrice

      // Open price (previous close or adjusted)
      const open = basePrice

      // Generate intraday range
      const intraDayVolatility = volatility * 0.5
      const highMove = Math.random() * intraDayVolatility * basePrice
      const lowMove = Math.random() * intraDayVolatility * basePrice

      // Calculate high and low
      const high = open + highMove + Math.abs(priceChange) * 0.5
      const low = open - lowMove - Math.abs(priceChange) * 0.5

      // Close price with trend
      let close = open + priceChange

      // Ensure OHLC relationships are valid
      const finalHigh = Math.max(open, close, high)
      const finalLow = Math.min(open, close, low)

      // Ensure close is within high/low bounds
      close = Math.max(finalLow, Math.min(finalHigh, close))

      // Generate volume with correlation to price movement
      const priceMovement = Math.abs(close - open) / open
      const baseVolume = 50000 + Math.random() * 200000
      const volumeMultiplier = 1 + priceMovement * 3 // Higher volume on bigger moves
      const volume = Math.floor(baseVolume * volumeMultiplier)

      data.push({
        time: time.toISOString(),
        open: Number(open.toFixed(asset.type === "forex" ? 4 : 2)),
        high: Number(finalHigh.toFixed(asset.type === "forex" ? 4 : 2)),
        low: Number(finalLow.toFixed(asset.type === "forex" ? 4 : 2)),
        close: Number(close.toFixed(asset.type === "forex" ? 4 : 2)),
        volume: volume,
      })

      // Update base price for next candle (close becomes next open)
      basePrice = close
    }

    // Ensure the last candle ends near the current asset price
    if (data.length > 0) {
      const lastCandle = data[data.length - 1]
      const priceDiff = asset.price - lastCandle.close

      // Adjust the last few candles to converge to current price
      for (let i = Math.max(0, data.length - 3); i < data.length; i++) {
        const factor = (i - (data.length - 3)) / 3
        const adjustment = priceDiff * factor

        data[i].close += adjustment
        data[i].high = Math.max(data[i].high, data[i].close)
        data[i].low = Math.min(data[i].low, data[i].close)
      }

      // Set final price exactly
      data[data.length - 1].close = asset.price
      data[data.length - 1].high = Math.max(data[data.length - 1].high, asset.price)
      data[data.length - 1].low = Math.min(data[data.length - 1].low, asset.price)
    }

    return data
  }, [])

  useEffect(() => {
    if (!asset) {
      setCandlestickData([])
      return
    }

    const data = generateCandlestickData(asset, timeframe)
    setCandlestickData(data)
  }, [asset, timeframe, generateCandlestickData])

  // Update the last candle periodically with new data
  useEffect(() => {
    if (!asset || candlestickData.length === 0) return

    const interval = setInterval(() => {
      setCandlestickData((prev) => {
        if (prev.length === 0) return prev

        const newData = [...prev]
        const lastCandle = { ...newData[newData.length - 1] }

        // Update the last candle with realistic price movement
        const volatility = asset.type === "forex" ? 0.002 : asset.type === "bond" ? 0.005 : 0.01
        const priceChange = (Math.random() - 0.5) * volatility * lastCandle.close
        const newClose = Math.max(0.01, lastCandle.close + priceChange)

        lastCandle.close = Number(newClose.toFixed(asset.type === "forex" ? 4 : 2))
        lastCandle.high = Math.max(lastCandle.high, lastCandle.close)
        lastCandle.low = Math.min(lastCandle.low, lastCandle.close)
        lastCandle.volume += Math.floor(Math.random() * 5000)

        newData[newData.length - 1] = lastCandle
        return newData
      })
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [asset, candlestickData.length])

  return { candlestickData }
}
