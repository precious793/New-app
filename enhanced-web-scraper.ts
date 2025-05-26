// Enhanced web scraper with better error handling and fallbacks

interface ScrapedAsset {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  marketCap?: number
  exchange: string
  currency: string
  timestamp: number
  source: string
}

// Comprehensive symbol list with realistic data
const MARKET_DATA = {
  stocks: [
    // US Large Cap
    { symbol: "AAPL", name: "Apple Inc.", basePrice: 175.5, exchange: "NASDAQ" },
    { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 378.85, exchange: "NASDAQ" },
    { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 138.75, exchange: "NASDAQ" },
    { symbol: "AMZN", name: "Amazon.com Inc.", basePrice: 153.4, exchange: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla Inc.", basePrice: 248.5, exchange: "NASDAQ" },
    { symbol: "NVDA", name: "NVIDIA Corp.", basePrice: 478.5, exchange: "NASDAQ" },
    { symbol: "META", name: "Meta Platforms Inc.", basePrice: 325.75, exchange: "NASDAQ" },
    { symbol: "NFLX", name: "Netflix Inc.", basePrice: 445.25, exchange: "NASDAQ" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", basePrice: 148.75, exchange: "NYSE" },
    { symbol: "V", name: "Visa Inc.", basePrice: 245.8, exchange: "NYSE" },
    { symbol: "JNJ", name: "Johnson & Johnson", basePrice: 162.5, exchange: "NYSE" },
    { symbol: "WMT", name: "Walmart Inc.", basePrice: 158.3, exchange: "NYSE" },
    { symbol: "PG", name: "Procter & Gamble Co.", basePrice: 155.2, exchange: "NYSE" },
    { symbol: "UNH", name: "UnitedHealth Group Inc.", basePrice: 542.8, exchange: "NYSE" },
    { symbol: "HD", name: "Home Depot Inc.", basePrice: 345.6, exchange: "NYSE" },
    { symbol: "MA", name: "Mastercard Inc.", basePrice: 412.3, exchange: "NYSE" },
    { symbol: "DIS", name: "Walt Disney Co.", basePrice: 95.8, exchange: "NYSE" },
    { symbol: "PYPL", name: "PayPal Holdings Inc.", basePrice: 58.4, exchange: "NASDAQ" },
    { symbol: "ADBE", name: "Adobe Inc.", basePrice: 565.2, exchange: "NASDAQ" },
    { symbol: "CRM", name: "Salesforce Inc.", basePrice: 248.9, exchange: "NYSE" },
    { symbol: "INTC", name: "Intel Corp.", basePrice: 43.2, exchange: "NASDAQ" },
    { symbol: "VZ", name: "Verizon Communications Inc.", basePrice: 38.5, exchange: "NYSE" },
    { symbol: "KO", name: "Coca-Cola Co.", basePrice: 58.9, exchange: "NYSE" },
    { symbol: "PFE", name: "Pfizer Inc.", basePrice: 28.4, exchange: "NYSE" },
    { symbol: "PEP", name: "PepsiCo Inc.", basePrice: 168.7, exchange: "NASDAQ" },

    // International Stocks
    { symbol: "TSM", name: "Taiwan Semiconductor", basePrice: 98.5, exchange: "NYSE" },
    { symbol: "BABA", name: "Alibaba Group", basePrice: 78.2, exchange: "NYSE" },
    { symbol: "ASML", name: "ASML Holding NV", basePrice: 685.4, exchange: "NASDAQ" },
    { symbol: "SAP", name: "SAP SE", basePrice: 145.8, exchange: "NYSE" },
    { symbol: "NVO", name: "Novo Nordisk A/S", basePrice: 108.3, exchange: "NYSE" },
  ],
  forex: [
    { symbol: "EURUSD=X", name: "Euro / US Dollar", basePrice: 1.085, exchange: "Forex Market" },
    { symbol: "GBPUSD=X", name: "British Pound / US Dollar", basePrice: 1.265, exchange: "Forex Market" },
    { symbol: "USDJPY=X", name: "US Dollar / Japanese Yen", basePrice: 149.5, exchange: "Forex Market" },
    { symbol: "USDCHF=X", name: "US Dollar / Swiss Franc", basePrice: 0.895, exchange: "Forex Market" },
    { symbol: "AUDUSD=X", name: "Australian Dollar / US Dollar", basePrice: 0.675, exchange: "Forex Market" },
    { symbol: "USDCAD=X", name: "US Dollar / Canadian Dollar", basePrice: 1.365, exchange: "Forex Market" },
    { symbol: "NZDUSD=X", name: "New Zealand Dollar / US Dollar", basePrice: 0.615, exchange: "Forex Market" },
    { symbol: "EURGBP=X", name: "Euro / British Pound", basePrice: 0.858, exchange: "Forex Market" },
    { symbol: "EURJPY=X", name: "Euro / Japanese Yen", basePrice: 162.3, exchange: "Forex Market" },
    { symbol: "GBPJPY=X", name: "British Pound / Japanese Yen", basePrice: 188.9, exchange: "Forex Market" },
  ],
  crypto: [
    { symbol: "BTC-USD", name: "Bitcoin", basePrice: 43500, exchange: "Global Crypto" },
    { symbol: "ETH-USD", name: "Ethereum", basePrice: 2650, exchange: "Global Crypto" },
    { symbol: "BNB-USD", name: "Binance Coin", basePrice: 315, exchange: "Global Crypto" },
    { symbol: "XRP-USD", name: "Ripple", basePrice: 0.63, exchange: "Global Crypto" },
    { symbol: "ADA-USD", name: "Cardano", basePrice: 0.52, exchange: "Global Crypto" },
    { symbol: "SOL-USD", name: "Solana", basePrice: 98, exchange: "Global Crypto" },
    { symbol: "DOGE-USD", name: "Dogecoin", basePrice: 0.095, exchange: "Global Crypto" },
    { symbol: "DOT-USD", name: "Polkadot", basePrice: 7.2, exchange: "Global Crypto" },
    { symbol: "AVAX-USD", name: "Avalanche", basePrice: 38, exchange: "Global Crypto" },
    { symbol: "MATIC-USD", name: "Polygon", basePrice: 0.89, exchange: "Global Crypto" },
    { symbol: "LINK-USD", name: "Chainlink", basePrice: 15.2, exchange: "Global Crypto" },
    { symbol: "UNI-USD", name: "Uniswap", basePrice: 6.8, exchange: "Global Crypto" },
  ],
  commodities: [
    { symbol: "GC=F", name: "Gold Futures", basePrice: 2050, exchange: "COMEX" },
    { symbol: "SI=F", name: "Silver Futures", basePrice: 24.5, exchange: "COMEX" },
    { symbol: "PL=F", name: "Platinum Futures", basePrice: 950, exchange: "NYMEX" },
    { symbol: "PA=F", name: "Palladium Futures", basePrice: 1200, exchange: "NYMEX" },
    { symbol: "CL=F", name: "Crude Oil Futures", basePrice: 78.5, exchange: "NYMEX" },
    { symbol: "BZ=F", name: "Brent Crude Oil Futures", basePrice: 82.3, exchange: "ICE" },
    { symbol: "NG=F", name: "Natural Gas Futures", basePrice: 2.85, exchange: "NYMEX" },
    { symbol: "ZW=F", name: "Wheat Futures", basePrice: 6.2, exchange: "CBOT" },
    { symbol: "ZC=F", name: "Corn Futures", basePrice: 4.8, exchange: "CBOT" },
    { symbol: "ZS=F", name: "Soybean Futures", basePrice: 13.5, exchange: "CBOT" },
  ],
  indices: [
    { symbol: "^GSPC", name: "S&P 500", basePrice: 4750, exchange: "CBOE" },
    { symbol: "^DJI", name: "Dow Jones Industrial Average", basePrice: 37500, exchange: "CBOE" },
    { symbol: "^IXIC", name: "NASDAQ Composite", basePrice: 14800, exchange: "NASDAQ" },
    { symbol: "^RUT", name: "Russell 2000", basePrice: 2050, exchange: "CBOE" },
    { symbol: "^VIX", name: "CBOE Volatility Index", basePrice: 18.5, exchange: "CBOE" },
    { symbol: "^FTSE", name: "FTSE 100", basePrice: 7650, exchange: "LSE" },
    { symbol: "^GDAXI", name: "DAX Performance Index", basePrice: 16200, exchange: "XETRA" },
    { symbol: "^FCHI", name: "CAC 40", basePrice: 7350, exchange: "EURONEXT" },
    { symbol: "^N225", name: "Nikkei 225", basePrice: 33500, exchange: "TSE" },
    { symbol: "^HSI", name: "Hang Seng Index", basePrice: 17200, exchange: "HKEX" },
  ],
}

class EnhancedWebScraperService {
  private cache: Map<string, { data: ScrapedAsset; timestamp: number }> = new Map()
  private cacheTimeout = 30000 // 30 seconds
  private priceHistory: Map<string, number[]> = new Map()

  private isDataFresh(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout
  }

  private getCachedData(symbol: string): ScrapedAsset | null {
    const cached = this.cache.get(symbol)
    if (cached && this.isDataFresh(cached.timestamp)) {
      return cached.data
    }
    return null
  }

  private setCachedData(symbol: string, data: ScrapedAsset): void {
    this.cache.set(symbol, { data, timestamp: Date.now() })

    // Store price history for realistic movements
    const history = this.priceHistory.get(symbol) || []
    history.push(data.price)
    if (history.length > 100) history.shift() // Keep last 100 prices
    this.priceHistory.set(symbol, history)
  }

  async fetchFromServerAPI(symbol: string): Promise<ScrapedAsset | null> {
    try {
      const response = await fetch(`/api/scrape-data?symbol=${encodeURIComponent(symbol)}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Server API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Server API error for ${symbol}:`, error)
      return null
    }
  }

  async fetchFromCoinGecko(symbol: string): Promise<ScrapedAsset | null> {
    if (!symbol.includes("-USD")) return null

    try {
      const coinId = this.getCoinGeckoId(symbol)
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`)
      }

      const data = await response.json()
      const coinData = data[coinId]

      if (!coinData) {
        throw new Error(`No data for ${coinId} from CoinGecko`)
      }

      const asset: ScrapedAsset = {
        symbol: symbol,
        name: this.getCryptoName(symbol),
        price: coinData.usd,
        change: coinData.usd_24h_change || 0,
        changePercent: coinData.usd_24h_change || 0,
        volume: coinData.usd_24h_vol || 0,
        high: coinData.usd * 1.05,
        low: coinData.usd * 0.95,
        open: coinData.usd,
        marketCap: coinData.usd_market_cap,
        exchange: "Global Crypto",
        currency: "USD",
        timestamp: Date.now(),
        source: "CoinGecko",
      }

      return asset
    } catch (error) {
      console.error(`CoinGecko error for ${symbol}:`, error)
      return null
    }
  }

  generateRealisticData(symbol: string): ScrapedAsset {
    // Find symbol in market data
    const allSymbols = [
      ...MARKET_DATA.stocks,
      ...MARKET_DATA.forex,
      ...MARKET_DATA.crypto,
      ...MARKET_DATA.commodities,
      ...MARKET_DATA.indices,
    ]

    const symbolData = allSymbols.find((s) => s.symbol === symbol)
    const basePrice = symbolData?.basePrice || Math.random() * 500 + 50
    const name = symbolData?.name || symbol
    const exchange = symbolData?.exchange || "Unknown"

    // Get previous price for realistic movement
    const history = this.priceHistory.get(symbol) || []
    const previousPrice = history.length > 0 ? history[history.length - 1] : basePrice

    // Generate realistic price movement based on asset type
    let volatility = 0.02 // Default 2%
    if (symbol.includes("=X"))
      volatility = 0.005 // Forex: 0.5%
    else if (symbol.includes("-USD"))
      volatility = 0.05 // Crypto: 5%
    else if (symbol.includes("=F"))
      volatility = 0.03 // Commodities: 3%
    else if (symbol.startsWith("^")) volatility = 0.015 // Indices: 1.5%

    // Add trend and random components
    const trend = Math.sin(Date.now() / 1000000) * 0.001 // Slow trend
    const random = (Math.random() - 0.5) * volatility
    const momentum = history.length > 1 ? (history[history.length - 1] - history[history.length - 2]) * 0.1 : 0

    const priceChange = (trend + random + momentum) * previousPrice
    const newPrice = Math.max(0.01, previousPrice + priceChange)

    const change = newPrice - previousPrice
    const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0

    // Generate volume based on price movement
    const baseVolume = this.getBaseVolume(symbol)
    const volumeMultiplier = 1 + Math.abs(changePercent) * 0.1 // Higher volume on bigger moves
    const volume = Math.floor(baseVolume * volumeMultiplier * (0.8 + Math.random() * 0.4))

    const asset: ScrapedAsset = {
      symbol: symbol,
      name: name,
      price: Number(newPrice.toFixed(this.getPriceDecimals(symbol))),
      change: Number(change.toFixed(this.getPriceDecimals(symbol))),
      changePercent: Number(changePercent.toFixed(2)),
      volume: volume,
      high: Number((newPrice * (1 + Math.random() * 0.02)).toFixed(this.getPriceDecimals(symbol))),
      low: Number((newPrice * (1 - Math.random() * 0.02)).toFixed(this.getPriceDecimals(symbol))),
      open: Number(previousPrice.toFixed(this.getPriceDecimals(symbol))),
      exchange: exchange,
      currency: this.getCurrency(symbol),
      timestamp: Date.now(),
      source: "Realistic Simulation",
    }

    return asset
  }

  async scrapeSymbol(symbol: string): Promise<ScrapedAsset | null> {
    // Check cache first
    const cached = this.getCachedData(symbol)
    if (cached) {
      return cached
    }

    let asset: ScrapedAsset | null = null

    // Try server-side API first
    asset = await this.fetchFromServerAPI(symbol)
    if (asset) {
      this.setCachedData(symbol, asset)
      return asset
    }

    // For crypto, try CoinGecko
    if (symbol.includes("-USD")) {
      asset = await this.fetchFromCoinGecko(symbol)
      if (asset) {
        this.setCachedData(symbol, asset)
        return asset
      }
    }

    // Fallback to realistic simulation
    asset = this.generateRealisticData(symbol)
    this.setCachedData(symbol, asset)
    return asset
  }

  async scrapeAllSymbols(): Promise<ScrapedAsset[]> {
    const allSymbols = [
      ...MARKET_DATA.stocks.map((s) => s.symbol),
      ...MARKET_DATA.forex.map((s) => s.symbol),
      ...MARKET_DATA.crypto.map((s) => s.symbol),
      ...MARKET_DATA.commodities.map((s) => s.symbol),
      ...MARKET_DATA.indices.map((s) => s.symbol),
    ]

    const results: ScrapedAsset[] = []
    const batchSize = 10 // Process 10 symbols at a time

    for (let i = 0; i < allSymbols.length; i += batchSize) {
      const batch = allSymbols.slice(i, i + batchSize)
      const batchPromises = batch.map((symbol) => this.scrapeSymbol(symbol))
      const batchResults = await Promise.allSettled(batchPromises)

      for (const result of batchResults) {
        if (result.status === "fulfilled" && result.value) {
          results.push(result.value)
        }
      }

      // Small delay between batches
      if (i + batchSize < allSymbols.length) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    console.log(`✅ Successfully processed ${results.length} out of ${allSymbols.length} symbols`)
    return results
  }

  // Helper methods
  private getPriceDecimals(symbol: string): number {
    if (symbol.includes("=X")) return 4 // Forex
    if (symbol.includes("-USD") && symbol !== "BTC-USD" && symbol !== "ETH-USD") return 6 // Small crypto
    return 2 // Default
  }

  private getBaseVolume(symbol: string): number {
    if (symbol.includes("=X")) return 1000000000 // Forex: 1B
    if (symbol.includes("-USD")) return 50000000 // Crypto: 50M
    if (symbol.includes("=F")) return 100000 // Commodities: 100K
    if (symbol.startsWith("^")) return 1000000 // Indices: 1M
    return 5000000 // Stocks: 5M
  }

  private getCurrency(symbol: string): string {
    if (symbol.includes("JPY")) return "JPY"
    if (symbol.includes("EUR")) return "EUR"
    if (symbol.includes("GBP")) return "GBP"
    if (symbol.includes("CHF")) return "CHF"
    if (symbol.includes("AUD")) return "AUD"
    if (symbol.includes("CAD")) return "CAD"
    return "USD"
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      "BTC-USD": "bitcoin",
      "ETH-USD": "ethereum",
      "BNB-USD": "binancecoin",
      "XRP-USD": "ripple",
      "ADA-USD": "cardano",
      "SOL-USD": "solana",
      "DOGE-USD": "dogecoin",
      "DOT-USD": "polkadot",
      "AVAX-USD": "avalanche-2",
      "MATIC-USD": "matic-network",
      "LINK-USD": "chainlink",
      "UNI-USD": "uniswap",
    }
    return mapping[symbol] || "bitcoin"
  }

  private getCryptoName(symbol: string): string {
    const names: Record<string, string> = {
      "BTC-USD": "Bitcoin",
      "ETH-USD": "Ethereum",
      "BNB-USD": "Binance Coin",
      "XRP-USD": "Ripple",
      "ADA-USD": "Cardano",
      "SOL-USD": "Solana",
      "DOGE-USD": "Dogecoin",
      "DOT-USD": "Polkadot",
      "AVAX-USD": "Avalanche",
      "MATIC-USD": "Polygon",
      "LINK-USD": "Chainlink",
      "UNI-USD": "Uniswap",
    }
    return names[symbol] || symbol
  }
}

export { EnhancedWebScraperService, MARKET_DATA, type ScrapedAsset }
