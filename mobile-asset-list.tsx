"use client"

import type { Asset } from "../types/trading"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MobileAssetListProps {
  assets: Asset[]
  selectedAsset: Asset | null
  onSelectAsset: (asset: Asset) => void
  onNavigateToChart: () => void
  searchQuery: string
}

export function MobileAssetList({
  assets,
  selectedAsset,
  onSelectAsset,
  onNavigateToChart,
  searchQuery,
}: MobileAssetListProps) {
  const filteredAssets = assets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-500"
      case "forex":
        return "bg-green-500"
      case "bond":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  if (assets.length === 0) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
              Loading markets...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      {filteredAssets.map((asset) => (
        <Card
          key={asset.symbol}
          className={`cursor-pointer transition-all duration-200 ${
            selectedAsset?.symbol === asset.symbol
              ? "bg-blue-50 border-blue-200 shadow-md"
              : "hover:bg-gray-50 active:bg-gray-100"
          }`}
          onClick={() => {
            onSelectAsset(asset)
            onNavigateToChart()
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Badge className={`${getTypeColor(asset.type)} text-white text-xs px-2 py-1`}>
                  {asset.type.toUpperCase()}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-lg">{asset.symbol}</div>
                  <div className="text-sm text-gray-500 truncate">{asset.name}</div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-2">
                <div className="font-bold text-lg">
                  ${asset.type === "forex" ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                </div>
                <div
                  className={`text-sm flex items-center justify-end ${
                    asset.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {asset.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {asset.change >= 0 ? "+" : ""}
                  {asset.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
