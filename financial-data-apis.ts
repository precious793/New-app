// Legitimate financial data APIs that provide real-time data

interface FinancialDataProvider {
  name: string
  baseUrl: string
  apiKey?: string
  rateLimit: number // requests per minute
  supportedSymbols: string[]
}

// Real-time financial data APIs (these are legitimate and allowed)
const DATA_PROVIDERS: FinancialDataProvider[] = [
  {
    name: "Alpha Vantage",
    baseUrl: "https://www.alphavantage.co/query",
    rateLimit: 5, // 5 requests per minute for free tier
    supportedSymbols: ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META"],
  },
  {
    name: "Finnhub",
    baseUrl: "https://finnhub.io/api/v1",
    rateLimit: 60, // 60 requests per minute for free tier
    supportedSymbols: ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META"],
  },
  {
    name: "IEX Cloud",
    baseUrl: "https://cloud.iexapis.com/stable",
    rateLimit: 100, // 100 requests per minute for free tier
    supportedSymbols: ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META"],
  },
  {
    name: "Polygon.io",
    baseUrl: "https://api.polygon.io/v2",
    rateLimit: 5, // 5 requests per minute for free tier
    supportedSymbols: ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META"],
  },
]

interface RealTimeQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  timestamp: number
  source: string
}

class FinancialDataService {
  private apiKeys: Record<string, string> = {}
  private rateLimiters: Record<string, { requests: number; resetTime: number }> = {}

  constructor(apiKeys: Record<string, string>) {
    this.apiKeys = apiKeys
  }

  private checkRateLimit(provider: string, limit: number): boolean {
    const now = Date.now()
    const limiter = this.rateLimiters[provider]

    if (!limiter || now > limiter.resetTime) {
      this.rateLimiters[provider] = {
        requests: 1,
        resetTime: now + 60000, // Reset after 1 minute
      }
      return true
    }

    if (limiter.requests >= limit) {
      return false
    }

    limiter.requests++
    return true
  }

  async fetchFromAlphaVantage(symbol: string): Promise<RealTimeQuote | null> {
    if (!this.checkRateLimit("alphavantage", 5)) {
      throw new Error("Alpha Vantage rate limit exceeded")
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKeys.alphavantage}`,
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
          open: Number.parseFloat(quote["02. open"]),
          timestamp: Date.now(),
          source: "Alpha Vantage",
        }
      }
      return null
    } catch (error) {
      console.error("Alpha Vantage error:", error)
      return null
    }
  }

  async fetchFromFinnhub(symbol: string): Promise<RealTimeQuote | null> {
    if (!this.checkRateLimit("finnhub", 60)) {
      throw new Error("Finnhub rate limit exceeded")
    }

    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKeys.finnhub}`)
      const data = await response.json()

      if (data.c) {
        return {
          symbol,
          price: data.c, // current price
          change: data.d, // change
          changePercent: data.dp, // change percent
          volume: 0, // Not provided in this endpoint
          high: data.h, // high
          low: data.l, // low
          open: data.o, // open
          timestamp: data.t * 1000, // convert to milliseconds
          source: "Finnhub",
        }
      }
      return null
    } catch (error) {
      console.error("Finnhub error:", error)
      return null
    }
  }

  async fetchFromIEX(symbol: string): Promise<RealTimeQuote | null> {
    if (!this.checkRateLimit("iex", 100)) {
      throw new Error("IEX Cloud rate limit exceeded")
    }

    try {
      const response = await fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${this.apiKeys.iex}`)
      const data = await response.json()

      return {
        symbol,
        price: data.latestPrice,
        change: data.change,
        changePercent: data.changePercent * 100,
        volume: data.volume,
        high: data.high,
        low: data.low,
        open: data.open,
        timestamp: data.latestUpdate,
        source: "IEX Cloud",
      }
    } catch (error) {
      console.error("IEX Cloud error:", error)
      return null
    }
  }

  async fetchFromPolygon(symbol: string): Promise<RealTimeQuote | null> {
    if (!this.checkRateLimit("polygon", 5)) {
      throw new Error("Polygon.io rate limit exceeded")
    }

    try {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${this.apiKeys.polygon}`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          symbol,
          price: result.c, // close
          change: result.c - result.o, // close - open
          changePercent: ((result.c - result.o) / result.o) * 100,
          volume: result.v,
          high: result.h,
          low: result.l,
          open: result.o,
          timestamp: result.t,
          source: "Polygon.io",
        }
      }
      return null
    } catch (error) {
      console.error("Polygon.io error:", error)
      return null
    }
  }

  async fetchRealTimeData(symbols: string[]): Promise<RealTimeQuote[]> {
    const results: RealTimeQuote[] = []

    for (const symbol of symbols) {
      try {
        // Try multiple providers in order of preference
        let quote: RealTimeQuote | null = null

        if (this.apiKeys.finnhub) {
          quote = await this.fetchFromFinnhub(symbol)
        }

        if (!quote && this.apiKeys.iex) {
          quote = await this.fetchFromIEX(symbol)
        }

        if (!quote && this.apiKeys.alphavantage) {
          quote = await this.fetchFromAlphaVantage(symbol)
        }

        if (!quote && this.apiKeys.polygon) {
          quote = await this.fetchFromPolygon(symbol)
        }

        if (quote) {
          results.push(quote)
        }
      } catch (error) {
        console.error(`Failed to fetch data for ${symbol}:`, error)
      }
    }

    return results
  }
}

export { FinancialDataService, DATA_PROVIDERS, type RealTimeQuote, type FinancialDataProvider }
