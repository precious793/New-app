"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderBookEntry } from "../types/trading"
import { useEffect, useState } from "react"

interface OrderBookProps {
  symbol: string
  currentPrice: number
}

export function OrderBook({ symbol, currentPrice }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([])
  const [asks, setAsks] = useState<OrderBookEntry[]>([])

  useEffect(() => {
    // Generate mock order book data
    const generateOrders = (basePrice: number, isBid: boolean): OrderBookEntry[] => {
      const orders: OrderBookEntry[] = []
      for (let i = 0; i < 10; i++) {
        const priceOffset = (i + 1) * 0.01 * basePrice
        const price = isBid ? basePrice - priceOffset : basePrice + priceOffset
        const quantity = Math.floor(Math.random() * 1000) + 100
        orders.push({
          price: Number(price.toFixed(2)),
          quantity,
          total: Number((price * quantity).toFixed(2)),
        })
      }
      return orders
    }

    setBids(generateOrders(currentPrice, true))
    setAsks(generateOrders(currentPrice, false))
  }, [currentPrice, symbol])

  useEffect(() => {
    // Update order book every 5 seconds
    const interval = setInterval(() => {
      setBids((prev) =>
        prev.map((order) => ({
          ...order,
          quantity: Math.floor(Math.random() * 1000) + 100,
        })),
      )
      setAsks((prev) =>
        prev.map((order) => ({
          ...order,
          quantity: Math.floor(Math.random() * 1000) + 100,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 gap-2 p-3 text-xs font-semibold text-gray-500 border-b">
          <div>Price</div>
          <div className="text-right">Quantity</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="max-h-48 overflow-y-auto">
          {asks
            .slice()
            .reverse()
            .map((ask, index) => (
              <div key={`ask-${index}`} className="grid grid-cols-3 gap-2 p-2 text-sm hover:bg-red-50">
                <div className="text-red-600 font-mono">{ask.price}</div>
                <div className="text-right font-mono">{ask.quantity}</div>
                <div className="text-right font-mono">{ask.total.toLocaleString()}</div>
              </div>
            ))}
        </div>

        {/* Current Price */}
        <div className="p-3 bg-gray-100 text-center font-bold">${currentPrice.toLocaleString()}</div>

        {/* Bids (Buy Orders) */}
        <div className="max-h-48 overflow-y-auto">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 gap-2 p-2 text-sm hover:bg-green-50">
              <div className="text-green-600 font-mono">{bid.price}</div>
              <div className="text-right font-mono">{bid.quantity}</div>
              <div className="text-right font-mono">{bid.total.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
