"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Asset } from "../types/trading"
import { ShoppingCart } from "lucide-react"

interface MobileTradingPanelProps {
  asset: Asset | null
  balance: number
  onTrade: (type: "buy" | "sell", quantity: number, price: number) => void
}

export function MobileTradingPanel({ asset, balance, onTrade }: MobileTradingPanelProps) {
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (asset) {
      setPrice(asset.price.toString())
    }
  }, [asset])

  if (!asset) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button disabled className="w-full h-12 text-lg">
          Select an asset to trade
        </Button>
      </div>
    )
  }

  const handleTrade = (type: "buy" | "sell") => {
    const qty = Number.parseFloat(quantity)
    const prc = orderType === "market" ? asset.price : Number.parseFloat(price)

    // Validation
    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity")
      return
    }

    if (!prc || prc <= 0) {
      alert("Please enter a valid price")
      return
    }

    if (type === "buy" && qty * prc > balance) {
      alert("Insufficient balance for this trade")
      return
    }

    try {
      onTrade(type, qty, prc)
      setQuantity("")
      setIsOpen(false)

      // Show success message
      alert(`Successfully ${type === "buy" ? "bought" : "sold"} ${qty} shares of ${asset.symbol}`)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Trade failed")
    }
  }

  const maxQuantity = Math.floor(balance / asset.price)
  const total =
    Number.parseFloat(quantity || "0") * (orderType === "market" ? asset.price : Number.parseFloat(price || "0"))

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle className="text-left">Trade {asset.symbol}</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Asset Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">{asset.symbol}</div>
                    <div className="text-sm text-gray-500">{asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">
                      ${asset.type === "forex" ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${asset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {asset.change >= 0 ? "+" : ""}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Type Tabs */}
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as "market" | "limit")}>
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="market" className="text-base">
                    Market
                  </TabsTrigger>
                  <TabsTrigger value="limit" className="text-base">
                    Limit
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="market" className="space-y-4 mt-6">
                  <div>
                    <Label className="text-base">Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-12 text-lg mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">Max: {maxQuantity} shares</div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity("1")} className="flex-1">
                      1
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity("10")} className="flex-1">
                      10
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity("100")} className="flex-1">
                      100
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.floor(balance / asset.price).toString())}
                      className="flex-1"
                    >
                      Max
                    </Button>
                  </div>

                  <div>
                    <Label className="text-base">Market Price</Label>
                    <Input value={`$${asset.price.toLocaleString()}`} disabled className="h-12 text-lg mt-2" />
                  </div>
                </TabsContent>

                <TabsContent value="limit" className="space-y-4 mt-6">
                  <div>
                    <Label className="text-base">Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-12 text-lg mt-2"
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setQuantity("1")} className="flex-1">
                      1
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity("10")} className="flex-1">
                      10
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setQuantity("100")} className="flex-1">
                      100
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.floor(balance / asset.price).toString())}
                      className="flex-1"
                    >
                      Max
                    </Button>
                  </div>

                  <div>
                    <Label className="text-base">Limit Price</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="h-12 text-lg mt-2"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Order Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-base mb-2">
                  <span>Total:</span>
                  <span className="font-semibold">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Available:</span>
                  <span>${balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleTrade("buy")}
                  className="bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold"
                  disabled={!quantity || total > balance}
                >
                  Buy
                </Button>
                <Button
                  onClick={() => handleTrade("sell")}
                  variant="destructive"
                  className="h-14 text-lg font-semibold"
                  disabled={!quantity}
                >
                  Sell
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="flex justify-center">
          <div className="text-center">
            <div className="text-xs text-gray-500">Available Balance</div>
            <div className="font-semibold">${balance.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </>
  )
}
