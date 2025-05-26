"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Globe, Clock, Volume2, ArrowUpDown } from "lucide-react"
import type { GlobalAsset, MarketCategory } from "../lib/global-market-data"

interface GlobalMarketListProps {
  assets: GlobalAsset[]
  categories: MarketCategory[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onAssetSelect: (asset: GlobalAsset) => void
  selectedAsset: GlobalAsset | null
  onNavigateToChart?: () => void
  isConnected: boolean
  lastUpdate: Date | null
}

type SortField = "symbol" | "price" | "change" | "changePercent" | "volume" | "marketCap"
type SortDirection = "asc" | "desc"

export function GlobalMarketList({
  assets,
  categories,
  selectedCategory,
  onCategoryChange,
  onAssetSelect,
  selectedAsset,
  onNavigateToChart,
  isConnected,
  lastUpdate,
}: GlobalMarketListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("changePercent")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedExchange, setSelectedExchange] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")

  // Filter and search assets
  const filteredAssets = useMemo(() => {
    let filtered = assets

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query) ||
          asset.exchange.toLowerCase().includes(query) ||
          asset.country.toLowerCase().includes(query) ||
          (asset.tradingPair &&
            (asset.tradingPair.base.toLowerCase().includes(query) ||
              asset.tradingPair.quote.toLowerCase().includes(query))),
      )
    }

    // Exchange filter
    if (selectedExchange !== "all") {
      filtered = filtered.filter((asset) => asset.exchange === selectedExchange)
    }

    // Country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter((asset) => asset.country === selectedCountry)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number | string = a[sortField] || 0
      let bValue: number | string = b[sortField] || 0

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [assets, searchQuery, sortField, sortDirection, selectedExchange, selectedCountry])

  // Get unique exchanges and countries
  const exchanges = useMemo(() => {
    const uniqueExchanges = [...new Set(assets.map((asset) => asset.exchange))]
    return uniqueExchanges.sort()
  }, [assets])

  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(assets.map((asset) => asset.country))]
    return uniqueCountries.sort()
  }, [assets])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stock":
        return "bg-blue-500"
      case "forex":
        return "bg-green-500"
      case "crypto":
        return "bg-purple-500"
      case "commodity":
        return "bg-yellow-500"
      case "index":
        return "bg-red-500"
      case "bond":
        return "bg-gray-500"
      case "etf":
        return "bg-indigo-500"
      default:
        return "bg-gray-400"
    }
  }

  const formatPrice = (price: number, type: string) => {
    if (type === "forex") return price.toFixed(4)
    if (type === "crypto" && price < 1) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`
    return volume.toString()
  }

  return (
    <div className="space-y-4">
      {/* Header with connection status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Global Markets</span>
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? "Live" : "Offline"}
              </Badge>
            </CardTitle>
            {lastUpdate && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search symbols, names, exchanges, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedExchange} onValueChange={setSelectedExchange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exchanges</SelectItem>
                {exchanges.map((exchange) => (
                  <SelectItem key={exchange} value={exchange}>
                    {exchange}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>
                Showing {filteredAssets.length} of {assets.length} assets
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {selectedCategory === "all"
                    ? "All Markets"
                    : categories.find((c) => c.id === selectedCategory)?.name || "Markets"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("changePercent")}
                    className="flex items-center space-x-1"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>% Change</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort("volume")}
                    className="flex items-center space-x-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Volume</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg mb-2">No assets found</div>
                  <div className="text-sm">Try adjusting your search or filters</div>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedAsset?.symbol === asset.symbol ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => {
                        onAssetSelect(asset)
                        if (onNavigateToChart) {
                          onNavigateToChart()
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Badge className={`${getTypeColor(asset.type)} text-white text-xs px-2 py-1 flex-shrink-0`}>
                            {asset.type.toUpperCase()}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm">{asset.symbol}</span>
                              {asset.tradingPair && (
                                <span className="text-xs text-gray-500">
                                  {asset.tradingPair.base}/{asset.tradingPair.quote}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{asset.name}</div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span>{asset.exchange}</span>
                              <span>•</span>
                              <span>{asset.country}</span>
                              {asset.volume > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Vol: {formatVolume(asset.volume)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="font-semibold text-sm">${formatPrice(asset.price, asset.type)}</div>
                          <div
                            className={`text-xs flex items-center justify-end ${
                              asset.changePercent >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {asset.changePercent >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            <span>
                              {asset.changePercent >= 0 ? "+" : ""}
                              {asset.changePercent.toFixed(2)}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {asset.changePercent >= 0 ? "+" : ""}
                            {asset.change.toFixed(asset.type === "forex" ? 4 : 2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
