"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
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

interface TradingChartProps {
  asset: Asset | null
  assets: Asset[]
}

export function TradingChart({ asset, assets }: TradingChartProps) {
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

  useEffect(() => {
    if (!asset) return

    // Generate more realistic historical data with significant movements
    const data = []
    let price = asset.price * (0.9 + Math.random() * 0.2) // Start with ±10% variation
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60 * 1000) // 5-minute intervals

      // Create more significant price movements
      const volatility = asset.type === "forex" ? 0.005 : asset.type === "bond" ? 0.01 : 0.03
      const trend = Math.sin(i / 5) * 0.002 // Add trend component
      const randomChange = (Math.random() - 0.5) * volatility

      const priceChange = (trend + randomChange) * price
      price = Math.max(0.01, price + priceChange)

      data.push({
        time: time.toLocaleTimeString(),
        price: Number(price.toFixed(asset.type === "forex" ? 4 : 2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
      })
    }

    // Make the last few points converge to current price
    if (data.length > 0) {
      const lastPrice = data[data.length - 1].price
      const priceDiff = asset.price - lastPrice

      for (let i = Math.max(0, data.length - 5); i < data.length; i++) {
        const factor = (i - (data.length - 5)) / 5
        data[i].price += priceDiff * factor
      }

      data[data.length - 1].price = asset.price
    }

    if (!isComparisonMode) {
      setChartData(data)
    }
  }, [asset, isComparisonMode])

  useEffect(() => {
    if (!asset || isComparisonMode) return

    // Update chart with new price every 5 seconds
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
          time: now.toLocaleTimeString(),
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
          const timeStr = new Date(assetData.data[i].time).toLocaleTimeString()
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
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-center text-gray-500">Select an asset to view chart</div>
        </CardContent>
      </Card>
    )
  }

  const currentChartData = isComparisonMode ? comparisonChartData : chartData

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {!isComparisonMode ? (
            <>
              <span>
                {asset.symbol} - {asset.name}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold">${asset.price.toLocaleString()}</span>
                <span className={`text-lg ${asset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {asset.change >= 0 ? "+" : ""}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </>
          ) : (
            <span>Asset Comparison ({selectedAssets.length})</span>
          )}
        </CardTitle>
        <div className="flex items-center justify-between mt-2">
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
          <div className="flex items-center space-x-2">
            {!isComparisonMode && (
              <>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={chartType === "line" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("line")}
                    className="rounded-none px-3 py-1"
                  >
                    <LineChartIcon className="w-4 h-4 mr-1" />
                    Line
                  </Button>
                  <Button
                    variant={chartType === "candlestick" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChartType("candlestick")}
                    className="rounded-none px-3 py-1"
                  >
                    <BarChart2 className="w-4 h-4 mr-1" />
                    Candles
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddCurrentAsset}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Compare
                </Button>
              </>
            )}
          </div>
        </div>

        {isComparisonMode && (
          <div className="mt-4 space-y-3">
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
                      className="flex items-center space-x-2 px-3 py-1"
                      style={{ borderColor: compData?.color, color: compData?.color }}
                    >
                      <span className="font-semibold">{symbol}</span>
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
            <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Label htmlFor="timeframe" className="text-sm">
                  Timeframe:
                </Label>
                <Select
                  value={comparisonSettings.timeframe}
                  onValueChange={(value) => updateSettings({ timeframe: value as any })}
                >
                  <SelectTrigger className="w-20">
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
                <Label htmlFor="normalize" className="text-sm">
                  Normalize (%)
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Chart Type and Volume Controls for Single Asset */}
        {!isComparisonMode && chartType === "candlestick" && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="volume"
                  checked={comparisonSettings.showVolume}
                  onCheckedChange={(checked) => updateSettings({ showVolume: checked })}
                />
                <Label htmlFor="volume" className="text-sm">
                  Show Volume
                </Label>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!isComparisonMode && chartType === "candlestick" && candlestickData.length > 0 ? (
          <CandlestickChart data={candlestickData} height={400} showVolume={comparisonSettings.showVolume} />
        ) : currentChartData.length > 0 ? (
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={formatTime} />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
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
                {isComparisonMode && <Legend />}
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
                  <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              Loading chart data...
            </div>
          </div>
        )}

        {/* Comparison Performance Summary */}
        {isComparisonMode && selectedAssets.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Performance Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div key={symbol} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ color: compData.color }}>
                        {symbol}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {assetInfo.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold">
                        ${assetInfo.type === "forex" ? assetInfo.price.toFixed(4) : assetInfo.price.toLocaleString()}
                      </div>
                      <div
                        className={`text-sm flex items-center ${totalChange >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {totalChange >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {comparisonSettings.normalizeData
                          ? `${totalChangePercent.toFixed(2)}%`
                          : `${totalChange >= 0 ? "+" : ""}${totalChange.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
