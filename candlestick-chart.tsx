"use client"

import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { CandlestickData } from "../types/trading"

interface CandlestickChartProps {
  data: CandlestickData[]
  height?: number
  showVolume?: boolean
}

// Custom Candlestick Shape Component
const CandlestickShape = (props: any) => {
  const { payload, x, y, width, height, index } = props

  if (!payload || !payload.open || !payload.high || !payload.low || !payload.close) {
    return null
  }

  const { open, high, low, close } = payload
  const isPositive = close >= open
  const color = isPositive ? "#10B981" : "#EF4444"

  // Calculate dimensions
  const candleWidth = Math.max(width * 0.8, 3)
  const wickWidth = 1
  const centerX = x + width / 2
  const candleX = centerX - candleWidth / 2

  // Find the Y scale from the chart (approximate)
  const dataRange = Math.max(high, open, close) - Math.min(low, open, close)
  const pixelRange = height
  const scale = pixelRange / (dataRange || 1)

  // Calculate Y positions (inverted because SVG Y increases downward)
  const highY = y - (high - Math.max(open, close)) * scale
  const lowY = y + (Math.min(open, close) - low) * scale
  const openY = y - (open - Math.max(open, close)) * scale
  const closeY = y - (close - Math.max(open, close)) * scale

  const bodyTop = Math.min(openY, closeY)
  const bodyHeight = Math.abs(closeY - openY)

  return (
    <g key={`candle-${index}`}>
      {/* High-Low Wick */}
      <line x1={centerX} y1={highY} x2={centerX} y2={lowY} stroke={color} strokeWidth={wickWidth} />

      {/* Open-Close Body */}
      <rect
        x={candleX}
        y={bodyTop}
        width={candleWidth}
        height={Math.max(bodyHeight, 1)}
        fill={isPositive ? "transparent" : color}
        stroke={color}
        strokeWidth={1}
        fillOpacity={isPositive ? 0 : 1}
      />
    </g>
  )
}

export function CandlestickChart({ data, height = 300, showVolume = false }: CandlestickChartProps) {
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      return timeStr
    }
  }

  const formatPrice = (value: number) => `$${value.toFixed(2)}`
  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  // Calculate price range for better Y-axis scaling
  const priceValues = data.flatMap((d) => [d.open, d.high, d.low, d.close])
  const minPrice = Math.min(...priceValues)
  const maxPrice = Math.max(...priceValues)
  const padding = (maxPrice - minPrice) * 0.05

  const chartHeight = showVolume ? height * 0.7 : height
  const volumeHeight = showVolume ? height * 0.25 : 0

  // Transform data for the chart - use close price for the bar chart
  const chartData = data.map((d) => ({
    ...d,
    priceForBar: d.close, // Use close price for positioning
  }))

  return (
    <div className="w-full" style={{ height }}>
      {/* Price Chart with Candlesticks */}
      <ChartContainer
        config={{
          price: { label: "Price", color: "hsl(var(--chart-1))" },
        }}
        className="w-full"
        style={{ height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              tickFormatter={formatPrice}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={70}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload[0]) return null

                const data = payload[0].payload
                const isPositive = data.close >= data.open
                const change = data.close - data.open
                const changePercent = (change / data.open) * 100

                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{formatTime(label)}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span>Open:</span>
                        <span className="font-medium">{formatPrice(data.open)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>High:</span>
                        <span className="font-medium text-green-600">{formatPrice(data.high)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Low:</span>
                        <span className="font-medium text-red-600">{formatPrice(data.low)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Close:</span>
                        <span className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {formatPrice(data.close)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Volume:</span>
                        <span className="font-medium">{formatVolume(data.volume)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Change:</span>
                        <span className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {isPositive ? "+" : ""}
                          {changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />

            {/* Invisible bars for positioning, with custom candlestick shapes */}
            <Bar dataKey="priceForBar" fill="transparent" shape={<CandlestickShape />} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Volume Chart */}
      {showVolume && (
        <ChartContainer
          config={{
            volume: { label: "Volume", color: "hsl(var(--chart-2))" },
          }}
          className="w-full mt-2"
          style={{ height: volumeHeight }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 0, right: 10, left: 10, bottom: 10 }}>
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickFormatter={formatVolume}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                width={70}
              />
              <Bar dataKey="volume" fill="#6B7280" opacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
