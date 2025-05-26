"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Asset } from "../types/trading"

interface TradingPanelProps {
  asset: Asset | null
  balance: number
  onTrade: (type: "buy" | "sell", quantity: number, price: number) => void
}

export function TradingPanel({ asset, balance, onTrade }: TradingPanelProps) {
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")

  // Update price when asset changes
  useEffect(() => {
    if (asset) {
      setPrice(asset.price.toString())
    }
  }, [asset])

  if (!asset) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">Select an asset to trade</div>
        </CardContent>
      </Card>
    )
  }

  const handleTrade = (type: "buy" | "sell") => {
    const qty = Number.parseFloat(quantity)
    const prc = orderType === "market" ? asset.price : Number.parseFloat(price)

    if (qty > 0 && prc > 0) {
      try {
        onTrade(type, qty, prc)
        setQuantity("")
      } catch (error) {
        alert(error)
      }
    }
  }

  const maxQuantity = Math.floor(balance / asset.price)
  const total =
    Number.parseFloat(quantity || "0") * (orderType === "market" ? asset.price : Number.parseFloat(price || "0"))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade {asset.symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={orderType} onValueChange={(value) => setOrderType(value as "market" | "limit")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-4">
            <div>
              <Label>Quantity</Label>
              <Input type="number" placeholder="0.00" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <div className="text-xs text-gray-500 mt-1">Max: {maxQuantity} shares</div>
            </div>

            <div>
              <Label>Market Price</Label>
              <Input value={`$${asset.price.toLocaleString()}`} disabled />
            </div>
          </TabsContent>

          <TabsContent value="limit" className="space-y-4">
            <div>
              <Label>Quantity</Label>
              <Input type="number" placeholder="0.00" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>

            <div>
              <Label>Limit Price</Label>
              <Input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-3 bg-gray-50 rounded">
          <div className="flex justify-between text-sm">
            <span>Total:</span>
            <span className="font-semibold">${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Available:</span>
            <span>${balance.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleTrade("buy")}
            className="bg-green-600 hover:bg-green-700"
            disabled={!quantity || total > balance}
          >
            Buy
          </Button>
          <Button onClick={() => handleTrade("sell")} variant="destructive" disabled={!quantity}>
            Sell
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
