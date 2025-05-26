"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Portfolio, Asset } from "../types/trading"

interface DebugPanelProps {
  portfolio: Portfolio
  selectedAsset: Asset | null
  onTrade: (type: "buy" | "sell", quantity: number, price: number) => void
}

export function DebugPanel({ portfolio, selectedAsset, onTrade }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleQuickTrade = (type: "buy" | "sell") => {
    if (!selectedAsset) {
      alert("No asset selected")
      return
    }

    try {
      onTrade(type, 1, selectedAsset.price)
      alert(`Quick ${type} executed!`)
    } catch (error) {
      alert(`Trade failed: ${error}`)
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-yellow-100 border-yellow-300"
        >
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-80">
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            Debug Panel
            <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-xs font-semibold mb-1">Portfolio Status:</div>
            <div className="text-xs">Balance: ${portfolio.balance.toLocaleString()}</div>
            <div className="text-xs">Positions: {portfolio.positions.length}</div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-1">Selected Asset:</div>
            {selectedAsset ? (
              <div className="text-xs">
                <div>
                  {selectedAsset.symbol} - ${selectedAsset.price}
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedAsset.type}
                </Badge>
              </div>
            ) : (
              <div className="text-xs text-red-600">No asset selected</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold">Quick Test Trades:</div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleQuickTrade("buy")}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs"
                disabled={!selectedAsset}
              >
                Buy 1
              </Button>
              <Button
                onClick={() => handleQuickTrade("sell")}
                size="sm"
                variant="destructive"
                className="text-xs"
                disabled={!selectedAsset}
              >
                Sell 1
              </Button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-1">Recent Positions:</div>
            {portfolio.positions.length > 0 ? (
              <div className="space-y-1">
                {portfolio.positions.slice(0, 3).map((pos) => (
                  <div key={pos.symbol} className="text-xs">
                    {pos.symbol}: {pos.quantity} @ ${pos.avgPrice.toFixed(2)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No positions</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
