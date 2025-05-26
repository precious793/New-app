import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Portfolio, Trade } from "../types/trading"

interface PortfolioViewProps {
  portfolio: Portfolio
  trades: Trade[]
}

export function PortfolioView({ portfolio, trades }: PortfolioViewProps) {
  const totalValue =
    portfolio.balance + portfolio.positions.reduce((sum, pos) => sum + pos.currentPrice * pos.quantity, 0)
  const totalPnL = portfolio.positions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Cash Balance</div>
              <div className="text-xl font-bold">${portfolio.balance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Value</div>
              <div className="text-xl font-bold">${totalValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total P&L</div>
              <div className={`text-xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${totalPnL.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.positions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No positions</div>
          ) : (
            <div className="space-y-2">
              {portfolio.positions.map((position) => (
                <div key={position.symbol} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-semibold">{position.symbol}</div>
                    <div className="text-sm text-gray-500">
                      {position.quantity} shares @ ${position.avgPrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${(position.currentPrice * position.quantity).toLocaleString()}</div>
                    <div className={`text-sm ${position.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {position.pnl >= 0 ? "+" : ""}${position.pnl.toLocaleString()} ({position.pnlPercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No trades</div>
          ) : (
            <div className="space-y-2">
              {trades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-semibold">{trade.symbol}</div>
                    <div className="text-sm text-gray-500">{trade.timestamp.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${trade.type === "buy" ? "text-green-600" : "text-red-600"}`}>
                      {trade.type.toUpperCase()} {trade.quantity}
                    </div>
                    <div className="text-sm text-gray-500">@ ${trade.price}</div>
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
