"use client"

import { Search, Menu, Bell, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AssetSwitcher } from "./asset-switcher"
import type { Portfolio, Asset } from "../types/trading"

interface MobileHeaderProps {
  portfolio: Portfolio
  assets: Asset[]
  selectedAsset: Asset | null
  onSelectAsset: (asset: Asset) => void
  onNavigateToChart?: () => void
  onSearch: (query: string) => void
  isConnected?: boolean
  loading?: boolean
}

export function MobileHeader({
  portfolio,
  assets,
  selectedAsset,
  onSelectAsset,
  onNavigateToChart,
  onSearch,
  isConnected,
  loading,
}: MobileHeaderProps) {
  const totalValue =
    portfolio.balance + portfolio.positions.reduce((sum, pos) => sum + pos.currentPrice * pos.quantity, 0)
  const totalPnL = portfolio.positions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50">
      {/* Top row with menu and notifications */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-gray-900 text-white border-gray-700">
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Portfolio</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cash Balance</span>
                      <span>${portfolio.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value</span>
                      <span>${totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">P&L</span>
                      <span className={totalPnL >= 0 ? "text-green-400" : "text-red-400"}>
                        ${totalPnL.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Settings</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-white">
                      Account Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white">
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white">
                      Help & Support
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-yellow-400">TradingEngine</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Asset Switcher */}
      <div className="mb-3">
        <AssetSwitcher
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
          onNavigateToChart={onNavigateToChart}
          showComparison={true}
          className="w-full"
        />
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search assets..."
          className="pl-10 bg-gray-800 border-gray-700 text-white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Balance summary - compact for mobile */}
      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="text-gray-400">Balance: </span>
          <span className="font-semibold">${totalValue.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-400">P&L: </span>
          <span className={`font-semibold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${totalPnL.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  )
}
