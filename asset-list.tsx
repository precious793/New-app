"use client"

import type { Asset } from "../types/trading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AssetListProps {
  assets: Asset[]
  selectedAsset: Asset | null
  onSelectAsset: (asset: Asset) => void
  onNavigateToChart: () => void
  searchQuery: string
}

export function AssetList({ assets, selectedAsset, onSelectAsset, onNavigateToChart, searchQuery }: AssetListProps) {
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
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Markets</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            Loading markets...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Markets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredAssets.map((asset) => (
            <div
              key={asset.symbol}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                selectedAsset?.symbol === asset.symbol ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => {
                onSelectAsset(asset)
                onNavigateToChart()
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={`${getTypeColor(asset.type)} text-white`}>{asset.type.toUpperCase()}</Badge>
                  <div>
                    <div className="font-semibold">{asset.symbol}</div>
                    <div className="text-sm text-gray-500">{asset.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${asset.price.toLocaleString()}</div>
                  <div className={`text-sm ${asset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {asset.change >= 0 ? "+" : ""}
                    {asset.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
