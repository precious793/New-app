"use client"

import { Search, User, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AssetSwitcher } from "./asset-switcher"
import type { Portfolio, Asset } from "../types/trading"

interface TradingHeaderProps {
  portfolio: Portfolio
  assets: Asset[]
  selectedAsset: Asset | null
  onSelectAsset: (asset: Asset) => void
  onSearch: (query: string) => void
  isConnected?: boolean
  loading?: boolean
}

export function TradingHeader({
  portfolio,
  assets,
  selectedAsset,
  onSelectAsset,
  onSearch,
  isConnected,
  loading,
}: TradingHeaderProps) {
  const totalValue =
    portfolio.balance + portfolio.positions.reduce((sum, pos) => sum + pos.currentPrice * pos.quantity, 0)
  const totalPnL = portfolio.positions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-yellow-400">TradingEngine</h1>

        {/* Asset Switcher */}
        <AssetSwitcher assets={assets} selectedAsset={selectedAsset} onSelectAsset={onSelectAsset} />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search assets..."
            className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
          <span className="text-sm text-gray-400">{loading ? "Loading..." : isConnected ? "Live" : "Offline"}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Balance</div>
          <div className="text-lg font-semibold">${totalValue.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">P&L</div>
          <div className={`text-lg font-semibold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${totalPnL.toLocaleString()}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
