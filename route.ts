import { type NextRequest, NextResponse } from "next/server"

// Server-side API endpoints
const API_ENDPOINTS = {
  ALPHA_VANTAGE: "https://www.alphavantage.co/query",
  FMP: "https://financialmodelingprep.com/api/v3",
  YAHOO: "https://query1.finance.yahoo.com/v8/finance/chart",
  FOREX: "https://api.exchangerate-api.com/v4/latest",
  TWELVE_DATA: "https://api.twelvedata.com",
}

const API_KEYS = {
  ALPHA_VANTAGE: process.env.ALPHA_VANTAGE_KEY || "demo",
  FMP: process.env.FMP_KEY || "demo",
  TWELVE_DATA: process.env.TWELVE_DATA_KEY || "demo",
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const type = searchParams.get("type")

  if (!symbol || !type) {
    return NextResponse.json({ error: "Symbol and type are required" }, { status: 400 })
  }

  try {
    let data = null

    switch (type) {
      case "stock":
        data = await fetchStockData(symbol)
        break
      case "forex":
        data = await fetchForexData(symbol)
        break
      case "bond":
        data = await fetchBondData(symbol)
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    if (data) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: "No data found" }, { status: 404 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function fetchStockData(symbol: string) {
  // Try Alpha Vantage first
  try {
    const response = await fetch(
      `${API_ENDPOINTS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`,
      { next: { revalidate: 60 } },
    )
    const data = await response.json()

    if (data["Global Quote"]) {
      const quote = data["Global Quote"]
      return {
        symbol,
        price: Number.parseFloat(quote["05. price"]),
        change: Number.parseFloat(quote["09. change"]),
        changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
        volume: Number.parseInt(quote["06. volume"]),
        high: Number.parseFloat(quote["03. high"]),
        low: Number.parseFloat(quote["04. low"]),
        source: "Alpha Vantage",
      }
    }
  } catch (error) {
    console.error("Alpha Vantage error:", error)
  }

  // Fallback to FMP
  try {
    const response = await fetch(`${API_ENDPOINTS.FMP}/quote/${symbol}?apikey=${API_KEYS.FMP}`, {
      next: { revalidate: 60 },
    })
    const data = await response.json()

    if (data && data.length > 0) {
      const quote = data[0]
      return {
        symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changesPercentage,
        volume: quote.volume,
        high: quote.dayHigh,
        low: quote.dayLow,
        marketCap: quote.marketCap,
        source: "FMP",
      }
    }
  } catch (error) {
    console.error("FMP error:", error)
  }

  return null
}

async function fetchForexData(pair: string) {
  try {
    const baseCurrency = pair.substring(0, 3)
    const targetCurrency = pair.substring(3, 6)

    const response = await fetch(`${API_ENDPOINTS.FOREX}/${baseCurrency}`, { next: { revalidate: 300 } })
    const data = await response.json()

    if (data.rates && data.rates[targetCurrency]) {
      const rate = data.rates[targetCurrency]
      return {
        symbol: pair,
        price: rate,
        change: 0, // Would need historical data for real change
        changePercent: 0,
        volume: 0,
        source: "Exchange Rate API",
      }
    }
  } catch (error) {
    console.error("Forex API error:", error)
  }

  return null
}

async function fetchBondData(symbol: string) {
  // For bonds, we'll use Twelve Data or similar
  try {
    const response = await fetch(`${API_ENDPOINTS.TWELVE_DATA}/price?symbol=${symbol}&apikey=${API_KEYS.TWELVE_DATA}`, {
      next: { revalidate: 300 },
    })
    const data = await response.json()

    if (data.price) {
      return {
        symbol,
        price: Number.parseFloat(data.price),
        change: 0,
        changePercent: 0,
        yield: Number.parseFloat(data.price),
        source: "Twelve Data",
      }
    }
  } catch (error) {
    console.error("Twelve Data error:", error)
  }

  return null
}
