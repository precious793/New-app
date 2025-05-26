export interface Asset {
  symbol: string
  name: string
  type: "stock" | "bond" | "forex"
  price: number
  change: number
  changePercent: number
  volume: number
  high24h: number
  low24h: number
  marketCap?: number
  yield?: number
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}

export interface Trade {
  id: string
  symbol: string
  type: "buy" | "sell"
  quantity: number
  price: number
  timestamp: Date
  status: "filled" | "pending" | "cancelled"
}

export interface Portfolio {
  balance: number
  positions: Position[]
}

export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

export interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartData {
  time: string
  price: number
  volume: number
  open?: number
  high?: number
  low?: number
  close?: number
}
