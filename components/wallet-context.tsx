"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface WalletContextType {
  balance: number
  updateBalance: (newBalance: number) => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0)

  const refreshBalance = useCallback(async () => {
    try {
      // Only access localStorage on client side
      if (typeof window === "undefined") return
      
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`${API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const newBalance = typeof data.balance === 'number' ? data.balance : (parseFloat(data.balance) || 0)
        setBalance(newBalance)
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
    }
  }, [])

  const updateBalance = useCallback((newBalance: number) => {
    if (typeof newBalance === 'number' && !isNaN(newBalance)) {
      setBalance(newBalance)
    }
  }, [])

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return
    
    // Initial fetch after a delay to allow auto-login
    const timer = setTimeout(() => {
      refreshBalance()
    }, 1000)

    // Refresh balance periodically
    const interval = setInterval(() => {
      refreshBalance()
    }, 30000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [refreshBalance])


  return (
    <WalletContext.Provider value={{ balance, updateBalance, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
