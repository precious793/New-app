// Comprehensive global market data service

interface MarketCategory {
  id: string
  name: string
  description: string
  tradingHours: string
  timezone: string
}

interface TradingPair {
  base: string
  quote: string
  symbol: string
  exchange: string
}

interface GlobalAsset {
  symbol: string
  name: string
  category: string
  type: "stock" | "forex" | "crypto" | "commodity" | "index" | "bond" | "etf"
  price: number
  change: number
  changePercent: number
  volume: number
  high24h: number
  low24h: number
  marketCap?: number
  tradingPair?: TradingPair
  exchange: string
  country: string
  currency: string
  lastUpdate: number
  isActive: boolean
}

const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: "stocks",
    name: "Global Stocks",
    description: "Equities from major exchanges worldwide",
    tradingHours: "Market dependent",
    timezone: "Various",
  },
  {
    id: "forex",
    name: "Foreign Exchange",
    description: "Currency pairs from global forex markets",
    tradingHours: "24/5",
    timezone: "UTC",
  },
  {
    id: "crypto",
    name: "Cryptocurrencies",
    description: "Digital assets and tokens",
    tradingHours: "24/7",
    timezone: "UTC",
  },
  {
    id: "commodities",
    name: "Commodities",
    description: "Raw materials and agricultural products",
    tradingHours: "Market dependent",
    timezone: "Various",
  },
  {
    id: "indices",
    name: "Market Indices",
    description: "Stock market indices worldwide",
    tradingHours: "Market dependent",
    timezone: "Various",
  },
  {
    id: "bonds",
    name: "Government Bonds",
    description: "Government and corporate bonds",
    tradingHours: "Market dependent",
    timezone: "Various",
  },
]

// Global stock symbols from major exchanges
const GLOBAL_STOCKS = [
  // US Stocks (NASDAQ/NYSE)
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", country: "US" },
  { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", country: "US" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", country: "US" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", country: "US" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", country: "US" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", country: "US" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", country: "US" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", country: "US" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", country: "US" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", country: "US" },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", country: "US" },
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", country: "US" },
  { symbol: "PG", name: "Procter & Gamble Co.", exchange: "NYSE", country: "US" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", exchange: "NYSE", country: "US" },
  { symbol: "HD", name: "Home Depot Inc.", exchange: "NYSE", country: "US" },

  // European Stocks
  { symbol: "ASML", name: "ASML Holding NV", exchange: "EURONEXT", country: "NL" },
  { symbol: "SAP", name: "SAP SE", exchange: "XETRA", country: "DE" },
  { symbol: "NESN.SW", name: "Nestlé SA", exchange: "SIX", country: "CH" },
  { symbol: "ROCHE.SW", name: "Roche Holding AG", exchange: "SIX", country: "CH" },
  { symbol: "LVMH.PA", name: "LVMH Moët Hennessy", exchange: "EURONEXT", country: "FR" },
  { symbol: "MC.PA", name: "LVMH", exchange: "EURONEXT", country: "FR" },
  { symbol: "OR.PA", name: "L'Oréal SA", exchange: "EURONEXT", country: "FR" },
  { symbol: "SHEL.L", name: "Shell plc", exchange: "LSE", country: "GB" },
  { symbol: "AZN.L", name: "AstraZeneca PLC", exchange: "LSE", country: "GB" },
  { symbol: "ULVR.L", name: "Unilever PLC", exchange: "LSE", country: "GB" },

  // Asian Stocks
  { symbol: "TSM", name: "Taiwan Semiconductor", exchange: "NYSE", country: "TW" },
  { symbol: "BABA", name: "Alibaba Group", exchange: "NYSE", country: "CN" },
  { symbol: "7203.T", name: "Toyota Motor Corp", exchange: "TSE", country: "JP" },
  { symbol: "6758.T", name: "Sony Group Corp", exchange: "TSE", country: "JP" },
  { symbol: "005930.KS", name: "Samsung Electronics", exchange: "KRX", country: "KR" },
  { symbol: "000858.SZ", name: "Wuliangye Yibin", exchange: "SZSE", country: "CN" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries", exchange: "NSE", country: "IN" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", exchange: "NSE", country: "IN" },
]

// Major forex pairs
const FOREX_PAIRS = [
  { base: "EUR", quote: "USD", symbol: "EURUSD", name: "Euro / US Dollar" },
  { base: "GBP", quote: "USD", symbol: "GBPUSD", name: "British Pound / US Dollar" },
  { base: "USD", quote: "JPY", symbol: "USDJPY", name: "US Dollar / Japanese Yen" },
  { base: "USD", quote: "CHF", symbol: "USDCHF", name: "US Dollar / Swiss Franc" },
  { base: "AUD", quote: "USD", symbol: "AUDUSD", name: "Australian Dollar / US Dollar" },
  { base: "USD", quote: "CAD", symbol: "USDCAD", name: "US Dollar / Canadian Dollar" },
  { base: "NZD", quote: "USD", symbol: "NZDUSD", name: "New Zealand Dollar / US Dollar" },
  { base: "EUR", quote: "GBP", symbol: "EURGBP", name: "Euro / British Pound" },
  { base: "EUR", quote: "JPY", symbol: "EURJPY", name: "Euro / Japanese Yen" },
  { base: "GBP", quote: "JPY", symbol: "GBPJPY", name: "British Pound / Japanese Yen" },
  { base: "CHF", quote: "JPY", symbol: "CHFJPY", name: "Swiss Franc / Japanese Yen" },
  { base: "EUR", quote: "CHF", symbol: "EURCHF", name: "Euro / Swiss Franc" },
  { base: "AUD", quote: "JPY", symbol: "AUDJPY", name: "Australian Dollar / Japanese Yen" },
  { base: "CAD", quote: "JPY", symbol: "CADJPY", name: "Canadian Dollar / Japanese Yen" },
  { base: "NZD", quote: "JPY", symbol: "NZDJPY", name: "New Zealand Dollar / Japanese Yen" },
]

// Major cryptocurrencies
const CRYPTO_ASSETS = [
  { symbol: "BTCUSD", name: "Bitcoin", base: "BTC", quote: "USD" },
  { symbol: "ETHUSD", name: "Ethereum", base: "ETH", quote: "USD" },
  { symbol: "BNBUSD", name: "Binance Coin", base: "BNB", quote: "USD" },
  { symbol: "ADAUSD", name: "Cardano", base: "ADA", quote: "USD" },
  { symbol: "SOLUSD", name: "Solana", base: "SOL", quote: "USD" },
  { symbol: "XRPUSD", name: "Ripple", base: "XRP", quote: "USD" },
  { symbol: "DOTUSD", name: "Polkadot", base: "DOT", quote: "USD" },
  { symbol: "DOGEUSD", name: "Dogecoin", base: "DOGE", quote: "USD" },
  { symbol: "AVAXUSD", name: "Avalanche", base: "AVAX", quote: "USD" },
  { symbol: "MATICUSD", name: "Polygon", base: "MATIC", quote: "USD" },
  { symbol: "LINKUSD", name: "Chainlink", base: "LINK", quote: "USD" },
  { symbol: "UNIUSD", name: "Uniswap", base: "UNI", quote: "USD" },
]

// Commodities
const COMMODITIES = [
  { symbol: "XAUUSD", name: "Gold", base: "XAU", quote: "USD" },
  { symbol: "XAGUSD", name: "Silver", base: "XAG", quote: "USD" },
  { symbol: "XPTUSD", name: "Platinum", base: "XPT", quote: "USD" },
  { symbol: "XPDUSD", name: "Palladium", base: "XPD", quote: "USD" },
  { symbol: "WTIUSD", name: "WTI Crude Oil", base: "WTI", quote: "USD" },
  { symbol: "BRENTUSD", name: "Brent Crude Oil", base: "BRENT", quote: "USD" },
  { symbol: "NATGASUSD", name: "Natural Gas", base: "NATGAS", quote: "USD" },
  { symbol: "WHEATUSD", name: "Wheat", base: "WHEAT", quote: "USD" },
  { symbol: "CORNUSD", name: "Corn", base: "CORN", quote: "USD" },
  { symbol: "SOYUSD", name: "Soybeans", base: "SOY", quote: "USD" },
]

// Major indices
const MARKET_INDICES = [
  { symbol: "SPX", name: "S&P 500", exchange: "CBOE", country: "US" },
  { symbol: "DJI", name: "Dow Jones Industrial Average", exchange: "CBOE", country: "US" },
  { symbol: "IXIC", name: "NASDAQ Composite", exchange: "NASDAQ", country: "US" },
  { symbol: "RUT", name: "Russell 2000", exchange: "CBOE", country: "US" },
  { symbol: "VIX", name: "CBOE Volatility Index", exchange: "CBOE", country: "US" },
  { symbol: "UKX", name: "FTSE 100", exchange: "LSE", country: "GB" },
  { symbol: "DAX", name: "DAX Performance Index", exchange: "XETRA", country: "DE" },
  { symbol: "CAC", name: "CAC 40", exchange: "EURONEXT", country: "FR" },
  { symbol: "NKY", name: "Nikkei 225", exchange: "TSE", country: "JP" },
  { symbol: "HSI", name: "Hang Seng Index", exchange: "HKEX", country: "HK" },
  { symbol: "SHCOMP", name: "Shanghai Composite", exchange: "SSE", country: "CN" },
  { symbol: "SENSEX", name: "BSE Sensex", exchange: "BSE", country: "IN" },
]

class GlobalMarketDataService {
  private apiKeys: Record<string, string>
  private cache: Map<string, { data: GlobalAsset; timestamp: number }> = new Map()
  private cacheTimeout = 30000 // 30 seconds

  constructor(apiKeys: Record<string, string>) {
    this.apiKeys = apiKeys
  }

  private isDataFresh(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout
  }

  private getCachedData(symbol: string): GlobalAsset | null {
    const cached = this.cache.get(symbol)
    if (cached && this.isDataFresh(cached.timestamp)) {
      return cached.data
    }
    return null
  }

  private setCachedData(symbol: string, data: GlobalAsset): void {
    this.cache.set(symbol, { data, timestamp: Date.now() })
  }

  async fetchStockData(symbols: string[]): Promise<GlobalAsset[]> {
    const results: GlobalAsset[] = []

    for (const symbol of symbols) {
      const cached = this.getCachedData(symbol)
      if (cached) {
        results.push(cached)
        continue
      }

      try {
        // Try Finnhub first
        if (this.apiKeys.finnhub) {
          const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.apiKeys.finnhub}`)
          const data = await response.json()

          if (data.c && data.c > 0) {
            const stockInfo = GLOBAL_STOCKS.find((s) => s.symbol === symbol)
            const asset: GlobalAsset = {
              symbol,
              name: stockInfo?.name || symbol,
              category: "stocks",
              type: "stock",
              price: data.c,
              change: data.d || 0,
              changePercent: data.dp || 0,
              volume: 0,
              high24h: data.h || data.c,
              low24h: data.l || data.c,
              exchange: stockInfo?.exchange || "Unknown",
              country: stockInfo?.country || "Unknown",
              currency: "USD",
              lastUpdate: Date.now(),
              isActive: true,
            }
            this.setCachedData(symbol, asset)
            results.push(asset)
            continue
          }
        }

        // Fallback to Alpha Vantage
        if (this.apiKeys.alphavantage) {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKeys.alphavantage}`,
          )
          const data = await response.json()

          if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
            const quote = data["Global Quote"]
            const stockInfo = GLOBAL_STOCKS.find((s) => s.symbol === symbol)
            const asset: GlobalAsset = {
              symbol,
              name: stockInfo?.name || symbol,
              category: "stocks",
              type: "stock",
              price: Number.parseFloat(quote["05. price"]),
              change: Number.parseFloat(quote["09. change"]),
              changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
              volume: Number.parseInt(quote["06. volume"]),
              high24h: Number.parseFloat(quote["03. high"]),
              low24h: Number.parseFloat(quote["04. low"]),
              exchange: stockInfo?.exchange || "Unknown",
              country: stockInfo?.country || "Unknown",
              currency: "USD",
              lastUpdate: Date.now(),
              isActive: true,
            }
            this.setCachedData(symbol, asset)
            results.push(asset)
          }
        }
      } catch (error) {
        console.error(`Failed to fetch stock data for ${symbol}:`, error)
      }
    }

    return results
  }

  async fetchForexData(): Promise<GlobalAsset[]> {
    const results: GlobalAsset[] = []

    try {
      // Use Fixer.io or similar for forex data
      if (this.apiKeys.fixer) {
        const response = await fetch(
          `https://api.fixer.io/latest?access_key=${this.apiKeys.fixer}&base=USD&symbols=EUR,GBP,JPY,CHF,AUD,CAD,NZD`,
        )
        const data = await response.json()

        if (data.rates) {
          for (const pair of FOREX_PAIRS) {
            const rate = data.rates[pair.quote] || 1 / (data.rates[pair.base] || 1)
            const change = (Math.random() - 0.5) * 0.01 * rate
            const changePercent = (change / rate) * 100

            const asset: GlobalAsset = {
              symbol: pair.symbol,
              name: pair.name,
              category: "forex",
              type: "forex",
              price: rate,
              change,
              changePercent,
              volume: Math.floor(Math.random() * 1000000000),
              high24h: rate * 1.002,
              low24h: rate * 0.998,
              tradingPair: {
                base: pair.base,
                quote: pair.quote,
                symbol: pair.symbol,
                exchange: "Forex",
              },
              exchange: "Forex Market",
              country: "Global",
              currency: pair.quote,
              lastUpdate: Date.now(),
              isActive: true,
            }
            results.push(asset)
          }
        }
      } else {
        // Generate realistic forex data
        for (const pair of FOREX_PAIRS) {
          const baseRate = this.getBaseForexRate(pair.base, pair.quote)
          const change = (Math.random() - 0.5) * 0.01 * baseRate
          const changePercent = (change / baseRate) * 100

          const asset: GlobalAsset = {
            symbol: pair.symbol,
            name: pair.name,
            category: "forex",
            type: "forex",
            price: baseRate + change,
            change,
            changePercent,
            volume: Math.floor(Math.random() * 1000000000),
            high24h: baseRate * 1.002,
            low24h: baseRate * 0.998,
            tradingPair: {
              base: pair.base,
              quote: pair.quote,
              symbol: pair.symbol,
              exchange: "Forex",
            },
            exchange: "Forex Market",
            country: "Global",
            currency: pair.quote,
            lastUpdate: Date.now(),
            isActive: true,
          }
          results.push(asset)
        }
      }
    } catch (error) {
      console.error("Failed to fetch forex data:", error)
    }

    return results
  }

  async fetchCryptoData(): Promise<GlobalAsset[]> {
    const results: GlobalAsset[] = []

    try {
      // Use CoinGecko API (free tier available)
      const symbols = CRYPTO_ASSETS.map((c) => c.symbol.replace("USD", "").toLowerCase()).join(",")
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      )
      const data = await response.json()

      for (const crypto of CRYPTO_ASSETS) {
        const coinId = crypto.symbol.replace("USD", "").toLowerCase()
        const coinData = data[coinId]

        if (coinData) {
          const asset: GlobalAsset = {
            symbol: crypto.symbol,
            name: crypto.name,
            category: "crypto",
            type: "crypto",
            price: coinData.usd,
            change: coinData.usd_24h_change || 0,
            changePercent: coinData.usd_24h_change || 0,
            volume: coinData.usd_24h_vol || 0,
            high24h: coinData.usd * 1.05,
            low24h: coinData.usd * 0.95,
            tradingPair: {
              base: crypto.base,
              quote: crypto.quote,
              symbol: crypto.symbol,
              exchange: "Crypto",
            },
            exchange: "Global Crypto",
            country: "Global",
            currency: "USD",
            lastUpdate: Date.now(),
            isActive: true,
          }
          results.push(asset)
        }
      }
    } catch (error) {
      console.error("Failed to fetch crypto data:", error)

      // Generate fallback crypto data
      for (const crypto of CRYPTO_ASSETS) {
        const basePrice = this.getBaseCryptoPrice(crypto.base)
        const change = (Math.random() - 0.5) * 0.1 * basePrice
        const changePercent = (change / basePrice) * 100

        const asset: GlobalAsset = {
          symbol: crypto.symbol,
          name: crypto.name,
          category: "crypto",
          type: "crypto",
          price: basePrice + change,
          change,
          changePercent,
          volume: Math.floor(Math.random() * 1000000000),
          high24h: basePrice * 1.05,
          low24h: basePrice * 0.95,
          tradingPair: {
            base: crypto.base,
            quote: crypto.quote,
            symbol: crypto.symbol,
            exchange: "Crypto",
          },
          exchange: "Global Crypto",
          country: "Global",
          currency: "USD",
          lastUpdate: Date.now(),
          isActive: true,
        }
        results.push(asset)
      }
    }

    return results
  }

  async fetchCommodityData(): Promise<GlobalAsset[]> {
    const results: GlobalAsset[] = []

    // Generate realistic commodity data
    for (const commodity of COMMODITIES) {
      const basePrice = this.getBaseCommodityPrice(commodity.base)
      const change = (Math.random() - 0.5) * 0.05 * basePrice
      const changePercent = (change / basePrice) * 100

      const asset: GlobalAsset = {
        symbol: commodity.symbol,
        name: commodity.name,
        category: "commodities",
        type: "commodity",
        price: basePrice + change,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 100000),
        high24h: basePrice * 1.02,
        low24h: basePrice * 0.98,
        tradingPair: {
          base: commodity.base,
          quote: commodity.quote,
          symbol: commodity.symbol,
          exchange: "Commodities",
        },
        exchange: "Commodities Market",
        country: "Global",
        currency: "USD",
        lastUpdate: Date.now(),
        isActive: true,
      }
      results.push(asset)
    }

    return results
  }

  async fetchIndexData(): Promise<GlobalAsset[]> {
    const results: GlobalAsset[] = []

    // Generate realistic index data
    for (const index of MARKET_INDICES) {
      const basePrice = this.getBaseIndexPrice(index.symbol)
      const change = (Math.random() - 0.5) * 0.03 * basePrice
      const changePercent = (change / basePrice) * 100

      const asset: GlobalAsset = {
        symbol: index.symbol,
        name: index.name,
        category: "indices",
        type: "index",
        price: basePrice + change,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 1000000),
        high24h: basePrice * 1.015,
        low24h: basePrice * 0.985,
        exchange: index.exchange,
        country: index.country,
        currency: "USD",
        lastUpdate: Date.now(),
        isActive: true,
      }
      results.push(asset)
    }

    return results
  }

  async fetchAllMarketData(): Promise<GlobalAsset[]> {
    const [stocks, forex, crypto, commodities, indices] = await Promise.all([
      this.fetchStockData(GLOBAL_STOCKS.map((s) => s.symbol)),
      this.fetchForexData(),
      this.fetchCryptoData(),
      this.fetchCommodityData(),
      this.fetchIndexData(),
    ])

    return [...stocks, ...forex, ...crypto, ...commodities, ...indices]
  }

  // Helper methods for realistic base prices
  private getBaseForexRate(base: string, quote: string): number {
    const rates: Record<string, number> = {
      EURUSD: 1.085,
      GBPUSD: 1.265,
      USDJPY: 149.5,
      USDCHF: 0.895,
      AUDUSD: 0.675,
      USDCAD: 1.365,
      NZDUSD: 0.615,
      EURGBP: 0.858,
      EURJPY: 162.3,
      GBPJPY: 188.9,
    }
    return rates[`${base}${quote}`] || 1.0
  }

  private getBaseCryptoPrice(symbol: string): number {
    const prices: Record<string, number> = {
      BTC: 43500,
      ETH: 2650,
      BNB: 315,
      ADA: 0.52,
      SOL: 98,
      XRP: 0.63,
      DOT: 7.2,
      DOGE: 0.095,
      AVAX: 38,
      MATIC: 0.89,
      LINK: 15.2,
      UNI: 6.8,
    }
    return prices[symbol] || 100
  }

  private getBaseCommodityPrice(symbol: string): number {
    const prices: Record<string, number> = {
      XAU: 2050,
      XAG: 24.5,
      XPT: 950,
      XPD: 1200,
      WTI: 78.5,
      BRENT: 82.3,
      NATGAS: 2.85,
      WHEAT: 6.2,
      CORN: 4.8,
      SOY: 13.5,
    }
    return prices[symbol] || 100
  }

  private getBaseIndexPrice(symbol: string): number {
    const prices: Record<string, number> = {
      SPX: 4750,
      DJI: 37500,
      IXIC: 14800,
      RUT: 2050,
      VIX: 18.5,
      UKX: 7650,
      DAX: 16200,
      CAC: 7350,
      NKY: 33500,
      HSI: 17200,
      SHCOMP: 3050,
      SENSEX: 67500,
    }
    return prices[symbol] || 1000
  }

  getMarketCategories(): MarketCategory[] {
    return MARKET_CATEGORIES
  }
}

export {
  GlobalMarketDataService,
  MARKET_CATEGORIES,
  GLOBAL_STOCKS,
  FOREX_PAIRS,
  CRYPTO_ASSETS,
  COMMODITIES,
  MARKET_INDICES,
  type GlobalAsset,
  type MarketCategory,
  type TradingPair,
}
