"use client"

import { Search, MessageCircle, Bell, User, Menu, Settings, Wallet, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { WalletModal } from "@/components/wallet-modal"
import { useAuth } from "@/components/auth-provider"
import { useWallet } from "@/components/wallet-context"
import { useRouter } from "next/navigation"

export function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const isMobile = useIsMobile()
  const { user, logout } = useAuth()
  const router = useRouter()
  const { balance: walletBalance, updateBalance, refreshBalance } = useWallet()

  // Handle balance update from wallet modal
  const handleBalanceUpdate = (newBalance: number) => {
    updateBalance(newBalance)
  }

  // Handle wallet modal close
  const handleWalletClose = (open: boolean) => {
    setWalletOpen(open)
    if (!open) {
      // Refresh balance when modal closes
      refreshBalance()
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/placeholder-logo.svg" alt="GG Nexus" className="w-8 h-8 rounded" />
            <span className="text-white font-semibold text-lg hidden sm:block">GG Nexus</span>
          </Link>
        </div>

        {/* Desktop Search */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Everything"
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Mobile Search */}
        {isMobile && showSearch && (
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Everything"
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search Toggle */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Wallet Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-gray-700 flex items-center space-x-2"
            onClick={() => setWalletOpen(true)}
          >
            <Wallet className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">
              ${(typeof walletBalance === 'number' && !isNaN(walletBalance) ? walletBalance : 0).toFixed(2)}
            </span>
          </Button>

          <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <a href="/chat"><MessageCircle className="w-5 h-5" /></a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
            <a href="/notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <a href="/profile"><User className="w-5 h-5" /></a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <a href="/settings"><Settings className="w-5 h-5" /></a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={() => {
              logout()
              router.push("/login")
            }}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <WalletModal 
        open={walletOpen} 
        onOpenChange={handleWalletClose}
        onBalanceUpdate={handleBalanceUpdate}
      />
    </header>
  )
}
