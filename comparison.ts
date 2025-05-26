export interface AssetComparison {
  assets: string[] // Array of asset symbols
  timeframe: "1D" | "1W" | "1M" | "3M" | "1Y"
  chartType: "line" | "candlestick"
  showVolume: boolean
  normalizeData: boolean // Normalize to percentage change
}

export interface ComparisonData {
  symbol: string
  data: {
    time: string
    price: number
    volume: number
    change: number
    changePercent: number
    open?: number
    high?: number
    low?: number
    close?: number
  }[]
  color: string
}
