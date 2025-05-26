"use client"

import { useState, useCallback } from "react"
import type { Portfolio, Trade } from "../types/trading"

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    balance: 100000,
    positions: [],
  })
  const [trades, setTrades] = useState<Trade[]>([])

  const executeTrade = useCallback(
    (symbol: string, type: "buy" | "sell", quantity: number, price: number) => {
      const total = quantity * price

      if (type === "buy" && total > portfolio.balance) {
        throw new Error("Insufficient balance")
      }

      // Check if selling more than owned
      if (type === "sell") {
        const existingPosition = portfolio.positions.find((p) => p.symbol === symbol)
        if (!existingPosition || existingPosition.quantity < quantity) {
          throw new Error("Insufficient shares to sell")
        }
      }

      const trade: Trade = {
        id: Date.now().toString(),
        symbol,
        type,
        quantity,
        price,
        timestamp: new Date(),
        status: "filled",
      }

      setTrades((prev) => [trade, ...prev])

      setPortfolio((prev) => {
        const newBalance = type === "buy" ? prev.balance - total : prev.balance + total
        const existingPosition = prev.positions.find((p) => p.symbol === symbol)

        let newPositions = [...prev.positions]

        if (existingPosition) {
          if (type === "buy") {
            const totalQuantity = existingPosition.quantity + quantity
            const avgPrice = (existingPosition.avgPrice * existingPosition.quantity + total) / totalQuantity
            const updatedPosition = {
              ...existingPosition,
              quantity: totalQuantity,
              avgPrice: avgPrice,
            }
            newPositions = newPositions.map((p) => (p.symbol === symbol ? updatedPosition : p))
          } else {
            const updatedQuantity = existingPosition.quantity - quantity
            if (updatedQuantity <= 0) {
              newPositions = newPositions.filter((p) => p.symbol !== symbol)
            } else {
              const updatedPosition = {
                ...existingPosition,
                quantity: updatedQuantity,
              }
              newPositions = newPositions.map((p) => (p.symbol === symbol ? updatedPosition : p))
            }
          }
        } else if (type === "buy") {
          newPositions.push({
            symbol,
            quantity,
            avgPrice: price,
            currentPrice: price,
            pnl: 0,
            pnlPercent: 0,
          })
        }

        return {
          balance: newBalance,
          positions: newPositions,
        }
      })

      console.log(`Trade executed: ${type.toUpperCase()} ${quantity} ${symbol} @ $${price}`)
    },
    [portfolio.balance, portfolio.positions],
  )

  const updatePositionPrices = useCallback((assets: any[]) => {
    setPortfolio((prev) => ({
      ...prev,
      positions: prev.positions.map((position) => {
        const asset = assets.find((a) => a.symbol === position.symbol)
        if (asset) {
          const pnl = (asset.price - position.avgPrice) * position.quantity
          const pnlPercent = ((asset.price - position.avgPrice) / position.avgPrice) * 100
          return {
            ...position,
            currentPrice: asset.price,
            pnl,
            pnlPercent,
          }
        }
        return position
      }),
    }))
  }, [])

  return { portfolio, trades, executeTrade, updatePositionPrices }
}
