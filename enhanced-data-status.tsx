"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, AlertTriangle, CheckCircle, Clock, TrendingUp, Database, Wifi } from "lucide-react"

interface EnhancedDataStatusProps {
  isConnected: boolean
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  dataSource: string
  onManualRefresh: () => void
  retryCount: number
  maxRetries: number
  assetsCount: number
}

export function EnhancedDataStatus({
  isConnected,
  loading,
  error,
  lastUpdate,
  dataSource,
  onManualRefresh,
  retryCount,
  maxRetries,
  assetsCount,
}: EnhancedDataStatusProps) {
  const getSourceIcon = (source: string) => {
    if (source.includes("Yahoo")) return "🟡"
    if (source.includes("CoinGecko")) return "🟢"
    if (source.includes("Simulation")) return "🔵"
    return "📊"
  }

  const getSourceDescription = (source: string) => {
    if (source.includes("Yahoo")) return "Real-time data from Yahoo Finance"
    if (source.includes("CoinGecko")) return "Live cryptocurrency data from CoinGecko"
    if (source.includes("Simulation")) return "High-quality simulated market data with realistic movements"
    return "Mixed data sources"
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Market Data Engine</span>
            <Badge variant={isConnected ? "default" : error ? "destructive" : "secondary"}>
              {loading ? "Loading..." : isConnected ? "Active" : error ? "Error" : "Offline"}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onManualRefresh}
            disabled={loading}
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium">{assetsCount}</div>
              <div className="text-gray-500">Assets Loaded</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-medium">{lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}</div>
              <div className="text-gray-500">Last Update</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-purple-500" />
            <div>
              <div className="font-medium">
                {getSourceIcon(dataSource)} {dataSource}
              </div>
              <div className="text-gray-500">Data Source</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-orange-500" />
            <div>
              <div className="font-medium">
                {retryCount}/{maxRetries}
              </div>
              <div className="text-gray-500">Retries</div>
            </div>
          </div>
        </div>

        {/* Data Source Information */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Database className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <div className="font-medium">Primary Data Source: {dataSource}</div>
              <div>{getSourceDescription(dataSource)}</div>
            </div>
          </div>
        </div>

        {/* Available Data Sources */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Available Data Sources:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span>🟡</span>
              <span>Yahoo Finance API</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🟢</span>
              <span>CoinGecko API</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔵</span>
              <span>Realistic Simulation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Server-side Proxy</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <div className="font-medium">Fallback Mode Active:</div>
                <div>{error}</div>
                <div className="mt-1">Using high-quality simulated data with realistic market movements.</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isConnected && !loading && !error && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div className="text-sm text-green-700">
                Successfully connected to financial data sources. Real-time market data is being updated every 30
                seconds.
              </div>
            </div>
          </div>
        )}

        {/* Market Coverage */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="font-medium mb-1">Market Coverage:</div>
          <div className="grid grid-cols-2 gap-1">
            <div>• 30+ Global Stocks</div>
            <div>• 10 Forex Pairs</div>
            <div>• 12 Cryptocurrencies</div>
            <div>• 10 Commodities</div>
            <div>• 10 Market Indices</div>
            <div>• Real-time Updates</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
