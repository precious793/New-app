"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Globe, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface WebScrapingStatusProps {
  isConnected: boolean
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  scrapingProgress: { current: number; total: number }
  onManualRefresh: () => void
  retryCount: number
  maxRetries: number
  assetsCount: number
}

export function WebScrapingStatus({
  isConnected,
  loading,
  error,
  lastUpdate,
  scrapingProgress,
  onManualRefresh,
  retryCount,
  maxRetries,
  assetsCount,
}: WebScrapingStatusProps) {
  const progressPercent = scrapingProgress.total > 0 ? (scrapingProgress.current / scrapingProgress.total) * 100 : 0

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Web Data Scraping</span>
            <Badge variant={isConnected ? "default" : error ? "destructive" : "secondary"}>
              {loading ? "Scraping..." : isConnected ? "Connected" : error ? "Error" : "Offline"}
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
        {/* Progress Bar */}
        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Scraping financial websites...</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

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
            {isConnected ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <div>
              <div className="font-medium">{isConnected ? "Online" : "Offline"}</div>
              <div className="text-gray-500">Connection</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-purple-500" />
            <div>
              <div className="font-medium">
                {retryCount}/{maxRetries}
              </div>
              <div className="text-gray-500">Retries</div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Data Sources:</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Yahoo Finance
            </Badge>
            <Badge variant="outline" className="text-xs">
              CoinGecko API
            </Badge>
            <Badge variant="outline" className="text-xs">
              Google Finance
            </Badge>
            <Badge variant="outline" className="text-xs">
              MarketWatch
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <div className="font-medium">Scraping Error:</div>
                <div>{error}</div>
                {retryCount < maxRetries && (
                  <div className="mt-1 text-xs">
                    Will retry automatically... ({retryCount}/{maxRetries} attempts)
                  </div>
                )}
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
                Successfully connected to financial data sources. Real-time data is being scraped from multiple
                websites.
              </div>
            </div>
          </div>
        )}

        {/* Rate Limiting Info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="font-medium mb-1">Rate Limiting:</div>
          <div>• Yahoo Finance: 1 request/second</div>
          <div>• CoinGecko: 1 request/second (free tier)</div>
          <div>• Other sources: 1.5-2 seconds between requests</div>
        </div>
      </CardContent>
    </Card>
  )
}
