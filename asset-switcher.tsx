"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { useAssetComparison } from "../hooks/useAssetComparison"
import type { Asset } from "../types/trading"

interface AssetSwitcherProps {
  assets: Asset[]
  selectedAsset: Asset | null
  onSelectAsset: (asset: Asset) => void
  onNavigateToChart?: () => void
  className?: string
  showComparison?: boolean
}

export function AssetSwitcher({
  assets,
  selectedAsset,
  onSelectAsset,
  onNavigateToChart,
  className = "",
  showComparison = false,
}: AssetSwitcherProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)

  const { selectedAssets, addAsset, removeAsset, maxAssets } = useAssetComparison()

  const filteredAssets = assets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAssetSelect = useCallback(
    (asset: Asset) => {
      if (comparisonMode) {
        if (selectedAssets.includes(asset.symbol)) {
          removeAsset(asset.symbol)
        } else {
          addAsset(asset.symbol)
        }
      } else {
        onSelectAsset(asset)
        setIsOpen(false)
        setSearchQuery("")
        if (onNavigateToChart) {
          onNavigateToChart()
        }
      }
    },
    [comparisonMode, selectedAssets, addAsset, removeAsset, onSelectAsset, onNavigateToChart],
  )

  const handleComparisonToggle = useCallback(() => {
    const newComparisonMode = !comparisonMode
    setComparisonMode(newComparisonMode)

    if (newComparisonMode && selectedAssets.length === 0 && selectedAsset) {
      addAsset(selectedAsset.symbol)
    }

    // Navigate to chart page when enabling comparison mode
    if (newComparisonMode && onNavigateToChart) {
      onNavigateToChart()
    }
  }, [comparisonMode, selectedAssets.length, selectedAsset, addAsset, onNavigateToChart])

  const handleViewComparison = useCallback(() => {
    setIsOpen(false)
    setComparisonMode(false)
    if (onNavigateToChart) {
      onNavigateToChart()
    }
  }, [onNavigateToChart])

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

  if (!selectedAsset) {
    return (
      <div className={`${className}`}>
        <Button variant="outline" disabled>
          Select Asset
        </Button>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between min-w-[200px]">
            <div className="flex items-center space-x-2">
              <Badge className={`${getTypeColor(selectedAsset.type)} text-white text-xs`}>
                {selectedAsset.type.toUpperCase()}
              </Badge>
              <span className="font-semibold">{selectedAsset.symbol}</span>
              <span className="text-sm text-gray-500 hidden sm:inline">
                $
                {selectedAsset.type === "forex" ? selectedAsset.price.toFixed(4) : selectedAsset.price.toLocaleString()}
              </span>
              {selectedAssets.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedAssets.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 p-0" align="start">
          {/* Search Header */}
          <div className="p-3 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            {showComparison && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="comparison-mode" checked={comparisonMode} onCheckedChange={handleComparisonToggle} />
                  <label htmlFor="comparison-mode" className="text-sm font-medium">
                    Comparison Mode
                  </label>
                </div>
                {selectedAssets.length > 0 && (
                  <Button size="sm" variant="outline" onClick={handleViewComparison}>
                    <BarChart3 className="w-4 h-4 mr-1" />
                    View ({selectedAssets.length})
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Asset List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">No assets found</div>
                <div className="text-xs">Try adjusting your search</div>
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isSelected = selectedAssets.includes(asset.symbol)
                const isDisabled = comparisonMode && selectedAssets.length >= maxAssets && !isSelected

                return (
                  <DropdownMenuItem
                    key={asset.symbol}
                    className="p-0 focus:bg-gray-50"
                    onSelect={() => !isDisabled && handleAssetSelect(asset)}
                    disabled={isDisabled}
                  >
                    <div className={`w-full p-3 cursor-pointer hover:bg-gray-50 ${isDisabled ? "opacity-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {comparisonMode && (
                            <Checkbox checked={isSelected} disabled={isDisabled} className="flex-shrink-0" />
                          )}
                          <Badge className={`${getTypeColor(asset.type)} text-white text-xs px-2 py-1 flex-shrink-0`}>
                            {asset.type.toUpperCase()}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm">{asset.symbol}</div>
                            <div className="text-xs text-gray-500 truncate">{asset.name}</div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-semibold text-sm">
                            ${asset.type === "forex" ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                          </div>
                          <div
                            className={`text-xs flex items-center justify-end ${
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
                    </div>
                  </DropdownMenuItem>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              {comparisonMode
                ? `${selectedAssets.length}/${maxAssets} assets selected`
                : `${filteredAssets.length} of ${assets.length} assets`}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
