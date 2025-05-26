"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Portfolio, Trade } from "../types/trading"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"

interface MobilePortfolioViewProps {
  portfolio: Portfolio
  trades: Trade[]
}

export function MobilePortfolioView({ portfolio, trades }: MobilePortfolioViewProps) {
  const totalValue =
    portfolio.balance + portfolio.positions.reduce((sum, pos) => sum + pos.currentPrice * pos.quantity, 0)
  const totalPnL = portfolio.positions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Cash Balance</span>
              <span className="text-xl font-bold">${portfolio.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Total Value</span>
              <span className="text-xl font-bold text-blue-600">${totalValue.toLocaleString()}</span>
            </div>
            <div
              className={`flex justify-between items-center p-3 rounded-lg ${
                totalPnL >= 0 ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <span className="text-gray-600">Total P&L</span>
              <div className="flex items-center">
                {totalPnL >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600 mr-1" />
                )}
                <span className={`text-xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${totalPnL.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.positions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📊</div>
              <div>No positions yet</div>
              <div className="text-sm">Start trading to see your positions here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolio.positions.map((position) => (
                <div key={position.symbol} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-lg">{position.symbol}</div>
                      <div className="text-sm text-gray-500">
                        {position.quantity} shares @ ${position.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        ${(position.currentPrice * position.quantity).toLocaleString()}
                      </div>
                      <div
                        className={`text-sm flex items-center ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {position.pnl >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {position.pnl >= 0 ? "+" : ""}${position.pnl.toLocaleString()}({position.pnlPercent.toFixed(2)}
                        %)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📈</div>
              <div>No trades yet</div>
              <div className="text-sm">Your trading history will appear here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {trades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${trade.type === "buy" ? "bg-green-500" : "bg-red-500"} text-white`}>
                        {trade.type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-semibold">{trade.symbol}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {trade.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{trade.quantity} shares</div>
                      <div className="text-sm text-gray-500">@ ${trade.price.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
