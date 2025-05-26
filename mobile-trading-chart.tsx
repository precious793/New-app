"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, X, BarChart3, Plus, BarChart2, LineChartIcon } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { useAssetComparison } from "../hooks/useAssetComparison"
import { useCandlestickData } from "../hooks/useCandlestickData"
import { CandlestickChart } from "./candlestick-chart"
import type { Asset } from "../types/trading"

interface MobileTradingChartProps {
  asset: Asset | null
  assets: Asset[]
  onAddAssetToComparison?: () => void
}

export function MobileTradingChart({ asset, assets, onAddAssetToComparison }: MobileTradingChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<"line" | "candlestick">("line")

  const {
    selectedAssets,
    isComparisonMode,
    comparisonSettings,
    addAsset,
    removeAsset,
    clearAssets,
    enableComparisonMode,
    updateSettings,
    generateComparisonData,
    normalizedData,
  } = useAssetComparison()

  const { candlestickData } = useCandlestickData(asset, comparisonSettings.timeframe)

  // Generate initial chart data when asset changes
  const initialChartData = useMemo(() => {
    if (!asset) return []

    const data = []
    // Start with a price that's different from current to show movement
    let price = asset.price * (0.9 + Math.random() * 0.2) // ±10% variation
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60 * 1000)

      // Create more significant price movements
      const volatility = asset.type === "forex" ? 0.005 : asset.type === "bond" ? 0.01 : 0.03

      // Add trend and random components
      const trend = Math.sin(i / 5) * 0.002 // Trend component
      const random = (Math.random() - 0.5) * volatility // Random component

      const priceChange = (trend + random) * price
      price = Math.max(0.01, price + priceChange)

      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        price: Number(price.toFixed(asset.type === "forex" ? 4 : 2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
      })
    }

    // Make the last few points converge to current price
    if (data.length > 0) {
      const lastPrice = data[data.length - 1].price
      const priceDiff = asset.price - lastPrice

      // Gradually adjust last 5 points to reach current price
      for (let i = Math.max(0, data.length - 5); i < data.length; i++) {
        const factor = (i - (data.length - 5)) / 5
        data[i].price += priceDiff * factor
      }

      // Set final price exactly
      data[data.length - 1].price = asset.price
    }

    return data
  }, [asset])

  useEffect(() => {
    if (!isComparisonMode) {
      setChartData(initialChartData)
    }
  }, [initialChartData, isComparisonMode])

  useEffect(() => {
    if (!asset || isComparisonMode) return

    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev

        const newData = [...prev.slice(1)]
        const now = new Date()

        // Add some realistic price movement
        const lastPrice = prev[prev.length - 1]?.price || asset.price
        const volatility = asset.type === "forex" ? 0.0005 : asset.type === "bond" ? 0.002 : 0.01
        const priceChange = (Math.random() - 0.5) * volatility * lastPrice
        const newPrice = Math.max(0.01, lastPrice + priceChange)

        newData.push({
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          price: Number(newPrice.toFixed(asset.type === "forex" ? 4 : 2)),
          volume: Math.floor(Math.random() * 1000000) + 100000,
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [asset, isComparisonMode])

  // Comparison data
  const comparisonData = useMemo(() => {
    if (!isComparisonMode || selectedAssets.length === 0) return []
    const data = generateComparisonData(assets)
    return comparisonSettings.normalizeData ? normalizedData(data) : data
  }, [isComparisonMode, selectedAssets, generateComparisonData, assets, normalizedData, comparisonSettings])

  // Transform comparison data for recharts
  const comparisonChartData = useMemo(() => {
    if (!isComparisonMode || comparisonData.length === 0) return []

    const maxLength = Math.max(...comparisonData.map((d) => d.data.length))
    const result = []

    for (let i = 0; i < maxLength; i++) {
      const point: any = { time: "" }
      let hasData = false

      comparisonData.forEach((assetData) => {
        if (assetData.data[i]) {
          const timeStr = new Date(assetData.data[i].time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          point.time = timeStr
          point[assetData.symbol] = assetData.data[i].price
          hasData = true
        }
      })

      if (hasData) result.push(point)
    }

    return result
  }, [isComparisonMode, comparisonData])

  const handleToggleComparison = () => {
    if (!isComparisonMode && asset && selectedAssets.length === 0) {
      addAsset(asset.symbol)
    }
    enableComparisonMode(!isComparisonMode)
  }

  const handleAddCurrentAsset = () => {
    if (asset && !selectedAssets.includes(asset.symbol)) {
      addAsset(asset.symbol)
      enableComparisonMode(true)
    }
  }

  const formatTime = (timeStr: string) => {
    if (!isComparisonMode) return timeStr

    // For comparison mode, format based on timeframe
    try {
      const date = new Date(timeStr)
      switch (comparisonSettings.timeframe) {
        case "1D":
          return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        case "1W":
        case "1M":
          return date.toLocaleDateString([], { month: "short", day: "numeric" })
        case "3M":
        case "1Y":
          return date.toLocaleDateString([], { month: "short", year: "2-digit" })
        default:
          return timeStr
      }
    } catch {
      return timeStr
    }
  }

  const getAssetInfo = (symbol: string) => {
    return assets.find((a) => a.symbol === symbol)
  }

  if (!asset) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">Select an asset to view chart</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentChartData = isComparisonMode ? comparisonChartData : chartData

  return (
    <div className="p-4 space-y-4">
      {/* Chart Controls */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={isComparisonMode ? "default" : "outline"}
                size="sm"
                onClick={handleToggleComparison}
                className="flex items-center space-x-1"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Compare</span>
                {selectedAssets.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {selectedAssets.length}
                  </Badge>
                )}
              </Button>
              {isComparisonMode && selectedAssets.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAssets}>
                  Clear All
                </Button>
              )}
            </div>
            {!isComparisonMode && (
              <Button variant="outline" size="sm" onClick={handleAddCurrentAsset}>
                <Plus className="w-4 h-4 mr-1" />
                Add to Compare
              </Button>
            )}
          </div>
        </CardHeader>

        {isComparisonMode && (
          <CardContent className="pt-0 space-y-3">
            {/* Selected Assets */}
            {selectedAssets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedAssets.map((symbol) => {
                  const assetInfo = getAssetInfo(symbol)
                  const compData = comparisonData.find((d) => d.symbol === symbol)
                  return (
                    <Badge
                      key={symbol}
                      variant="outline"
                      className="flex items-center space-x-2 px-2 py-1"
                      style={{ borderColor: compData?.color, color: compData?.color }}
                    >
                      <span className="font-semibold text-xs">{symbol}</span>
                      {assetInfo && (
                        <span className="text-xs">
                          ${assetInfo.type === "forex" ? assetInfo.price.toFixed(4) : assetInfo.price.toLocaleString()}
                        </span>
                      )}
                      <button onClick={() => removeAsset(symbol)} className="ml-1 hover:bg-gray-100 rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Comparison Controls */}
            <div className="flex flex-wrap items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Label htmlFor="timeframe" className="text-xs">
                  Period:
                </Label>
                <Select
                  value={comparisonSettings.timeframe}
                  onValueChange={(value) => updateSettings({ timeframe: value as any })}
                >
                  <SelectTrigger className="w-16 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1D">1D</SelectItem>
                    <SelectItem value="1W">1W</SelectItem>
                    <SelectItem value="1M">1M</SelectItem>
                    <SelectItem value="3M">3M</SelectItem>
                    <SelectItem value="1Y">1Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="normalize"
                  checked={comparisonSettings.normalizeData}
                  onCheckedChange={(checked) => updateSettings({ normalizeData: checked })}
                />
                <Label htmlFor="normalize" className="text-xs">
                  Normalize (%)
                </Label>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Chart Type and Volume Controls */}
      {!isComparisonMode && (
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Label className="text-xs">Chart Type:</Label>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={chartType === "line" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("line")}
                    className="rounded-none px-3 py-1 h-8"
                  >
                    <LineChartIcon className="w-3 h-3 mr-1" />
                    <span className="text-xs">Line</span>
                  </Button>
                  <Button
                    variant={chartType === "candlestick" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("candlestick")}
                    className="rounded-none px-3 py-1 h-8"
                  >
                    <BarChart2 className="w-3 h-3 mr-1" />
                    <span className="text-xs">Candles</span>
                  </Button>
                </div>
              </div>

              {chartType === "candlestick" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="volume"
                    checked={comparisonSettings.showVolume}
                    onCheckedChange={(checked) => updateSettings({ showVolume: checked })}
                  />
                  <Label htmlFor="volume" className="text-xs">
                    Show Volume
                  </Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-col space-y-2">
            {!isComparisonMode ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{asset.symbol}</span>
                  <div className={`flex items-center ${asset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {asset.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {asset.change >= 0 ? "+" : ""}
                      {asset.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 truncate">{asset.name}</span>
                  <span className="text-xl font-bold">
                    ${asset.type === "forex" ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Asset Comparison ({selectedAssets.length})</span>
                <span className="text-sm text-gray-500">
                  {comparisonSettings.normalizeData ? "Normalized %" : "Price"}
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!isComparisonMode && chartType === "candlestick" && candlestickData.length > 0 ? (
            <CandlestickChart data={candlestickData} height={280} showVolume={comparisonSettings.showVolume} />
          ) : currentChartData.length > 0 ? (
            <ChartContainer
              config={{
                price: {
                  label: "Price",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentChartData}>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                    tickFormatter={formatTime}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    width={60}
                    tickFormatter={(value) =>
                      isComparisonMode && comparisonSettings.normalizeData
                        ? `${value.toFixed(1)}%`
                        : `$${value.toFixed(0)}`
                    }
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => formatTime(value as string)}
                    formatter={(value: any, name: string) => [
                      isComparisonMode && comparisonSettings.normalizeData
                        ? `${value.toFixed(2)}%`
                        : `$${value.toFixed(2)}`,
                      name,
                    ]}
                  />
                  {isComparisonMode ? (
                    comparisonData.map((assetData) => (
                      <Line
                        key={assetData.symbol}
                        type="monotone"
                        dataKey={assetData.symbol}
                        stroke={assetData.color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    ))
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-price)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                Loading chart data...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Performance Summary */}
      {isComparisonMode && selectedAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {selectedAssets.map((symbol) => {
                const assetInfo = getAssetInfo(symbol)
                const compData = comparisonData.find((d) => d.symbol === symbol)
                if (!assetInfo || !compData) return null

                const latestData = compData.data[compData.data.length - 1]
                const firstData = compData.data[0]
                const totalChange = latestData && firstData ? latestData.price - firstData.price : 0
                const totalChangePercent =
                  firstData && firstData.price !== 0 ? (totalChange / firstData.price) * 100 : 0

                return (
                  <div key={symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compData.color }}></div>
                      <div>
                        <div className="font-semibold">{symbol}</div>
                        <div className="text-sm text-gray-500">
                          ${assetInfo.type === "forex" ? assetInfo.price.toFixed(4) : assetInfo.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${totalChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {comparisonSettings.normalizeData
                          ? `${totalChangePercent.toFixed(2)}%`
                          : `${totalChange >= 0 ? "+" : ""}$${totalChange.toFixed(2)}`}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assetInfo.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
