"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, Minus, DollarSign, CreditCard, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBalanceUpdate?: (balance: number) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export function WalletModal({ open, onOpenChange, onBalanceUpdate }: WalletModalProps) {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [addAmount, setAddAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [showPaymentMethod, setShowPaymentMethod] = useState(false)
  const [pendingAmount, setPendingAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const { toast } = useToast()

  const fetchBalance = async () => {
    try {
      let token: string | null = localStorage.getItem("token")
      if (!token) {
        console.log("No token found, attempting auto-login...")
        // Try to get token by attempting login
        try {
          const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "ProShooter99", password: "password123" }),
          })
          if (loginRes.ok) {
            const loginData = await loginRes.json()
            token = loginData.token || null
            if (token) {
              localStorage.setItem("token", token)
              console.log("Auto-login successful for wallet operation")
            } else {
              console.error("No token received from login")
              return
            }
          } else {
            console.error("Auto-login failed for wallet")
            return
          }
        } catch (error) {
          console.error("Auto-login error:", error)
          return
        }
      }
      
      if (!token) {
        console.error("No token available")
        return
      }
      
      console.log("Fetching wallet balance with token:", token.substring(0, 20) + "...")

      console.log("Calling wallet API:", `${API_URL}/api/wallet`)
      const response = await fetch(`${API_URL}/api/wallet`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      console.log("Wallet API response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        const balanceValue = typeof data.balance === 'number' ? data.balance : (parseFloat(data.balance) || 0)
        console.log("Fetched balance from server:", balanceValue)
        setBalance(balanceValue)
        // Also update parent component if callback exists
        if (onBalanceUpdate) {
          onBalanceUpdate(balanceValue)
        }
      } else {
        console.error("Failed to fetch wallet balance:", response.status)
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Please login again",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error("Error fetching wallet:", error)
      // Don't show error toast on initial load if user is not logged in
    }
  }

  useEffect(() => {
    if (open) {
      fetchBalance()
    }
  }, [open])


  const handleAddMoney = () => {
    const amount = parseFloat(addAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      })
      return
    }

    // Show payment method selection popup
    setPendingAmount(amount)
    setShowPaymentMethod(true)
  }

  const handlePaymentMethodSelected = async (method: "card" | "upi") => {
    if (processingPayment) return
    
    setPaymentMethod(method)
    setLoading(true)
    setProcessingPayment(true)
    
    try {
      let token: string | null = localStorage.getItem("token")
      if (!token) {
        console.log("No token for payment, attempting auto-login...")
        // Try auto-login
        try {
          const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "ProShooter99", password: "password123" }),
          })
              if (loginRes.ok) {
            const loginData = await loginRes.json()
            token = loginData.token || null
            if (token) {
              localStorage.setItem("token", token)
              console.log("Auto-login successful for payment, token stored")
            } else {
              throw new Error("No token received from login")
            }
          } else {
            const errorText = await loginRes.text()
            let errorData
            try {
              errorData = JSON.parse(errorText)
            } catch {
              errorData = { message: errorText || "Login failed" }
            }
            throw new Error(errorData.message || `Login failed with status ${loginRes.status}`)
          }
        } catch (error: any) {
          toast({
            title: "Authentication Error",
            description: `Cannot connect to backend at ${API_URL}. Error: ${error.message || 'Unknown error'}. Please ensure backend is running.`,
            variant: "destructive"
          })
          setLoading(false)
          setProcessingPayment(false)
          setShowPaymentMethod(false)
          return
        }
      }
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token available",
          variant: "destructive"
        })
        setLoading(false)
        setProcessingPayment(false)
        setShowPaymentMethod(false)
        return
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      const amountToAdd = pendingAmount
      
      console.log("Sending wallet add request:", { amount: amountToAdd, payment_method: method })

      const response = await fetch(`${API_URL}/api/wallet/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: amountToAdd,
          payment_method: method
        }),
      })

      console.log("Wallet add response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }))
        console.error("Wallet add error:", errorData)
        toast({
          title: "Payment Failed",
          description: errorData.message || "Failed to process payment. Please try again.",
          variant: "destructive"
        })
        setLoading(false)
        setProcessingPayment(false)
        return
      }

      const responseData = await response.json()
      console.log("Full response data:", responseData)
      
      // Try multiple possible response formats
      let newBalance = 0
      if (responseData.balance !== undefined && responseData.balance !== null) {
        newBalance = typeof responseData.balance === 'number' ? responseData.balance : parseFloat(responseData.balance)
      } else if (responseData.new_balance !== undefined) {
        newBalance = typeof responseData.new_balance === 'number' ? responseData.new_balance : parseFloat(responseData.new_balance)
      } else if (responseData.data?.balance !== undefined) {
        newBalance = typeof responseData.data.balance === 'number' ? responseData.data.balance : parseFloat(responseData.data.balance)
      }
      
      // Validate balance
      if (isNaN(newBalance)) {
        newBalance = 0
      }
      
      console.log("Parsed new balance:", newBalance, "from response:", responseData)
      
      if (newBalance >= 0) {
        console.log("Payment successful! Setting balance from", balance, "to", newBalance)
        
        // Force state update immediately
        setBalance(newBalance)
        
        // Update parent component (header) immediately - this is critical!
        if (onBalanceUpdate) {
          console.log("Calling onBalanceUpdate callback with balance:", newBalance)
          onBalanceUpdate(newBalance)
        }
        
        // Clear form fields
        setAddAmount("")
        setPendingAmount(0)
        setPaymentMethod(null)
        setShowPaymentMethod(false)
        
        toast({
          title: "Payment Successful! ✅",
          description: `$${amountToAdd.toFixed(2)} has been added to your wallet via ${method === "card" ? "Credit/Debit Card" : "UPI"}. Your new balance is $${newBalance.toFixed(2)}`,
        })
        
        // Verify by refreshing from server after a brief delay
        setTimeout(async () => {
          await fetchBalance()
        }, 500)
      } else {
        console.error("Invalid balance in response:", responseData)
        toast({
          title: "Payment Failed",
          description: "Received invalid balance from server. Please refresh and try again.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error("Wallet add exception:", error)
      toast({
        title: "Connection Error",
        description: `Failed to connect to server. Please check if backend is running at ${API_URL}. Error: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setProcessingPayment(false)
    }
  }

  const handleWithdrawMoney = async () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      })
      return
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to withdraw this amount",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to withdraw money",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${API_URL}/api/wallet/withdraw`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (response.ok) {
        const data = await response.json()
        const newBalance = parseFloat(data.balance) || data.balance
        setBalance(newBalance)
        if (onBalanceUpdate) {
          onBalanceUpdate(newBalance)
        }
        setWithdrawAmount("")
        toast({
          title: "Success",
          description: `$${amount.toFixed(2)} withdrawn from your wallet`,
        })
        // Refresh balance
        fetchBalance()
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error occurred" }))
        console.error("Wallet withdraw error:", errorData)
        toast({
          title: "Withdrawal Failed",
          description: errorData.message || "Failed to withdraw money",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Wallet withdraw exception:", error)
      toast({
        title: "Connection Error",
        description: `Failed to connect to server. Please check if backend is running at ${API_URL}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Wallet className="w-5 h-5" />
            <span>Wallet</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your wallet balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Balance Display */}
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Current Balance</p>
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-4xl font-bold text-white" key={`balance-${balance}-${Date.now()}`}>
                ${balance.toFixed(2)}
              </span>
            </div>
            {(loading || processingPayment) && (
              <p className="text-xs text-gray-500 mt-2 animate-pulse">Updating balance...</p>
            )}
          </div>

          {/* Tabs for Add/Withdraw */}
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="add" className="data-[state=active]:bg-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-purple-600">
                <Minus className="w-4 h-4 mr-2" />
                Withdraw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Amount to Add</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                onClick={handleAddMoney}
                disabled={loading || !addAmount}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? "Processing..." : "Add Money"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Click "Add Money" to select a payment method (Card/UPI)
              </p>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Amount to Withdraw</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="0"
                  step="0.01"
                  max={balance}
                />
              </div>
              <Button
                onClick={handleWithdrawMoney}
                disabled={loading || !withdrawAmount}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? "Processing..." : "Withdraw Money"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Available balance: ${balance.toFixed(2)}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Payment Method Selection Dialog */}
      <Dialog open={showPaymentMethod} onOpenChange={setShowPaymentMethod}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Select Payment Method</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose how you want to pay ${pendingAmount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Button
              onClick={() => handlePaymentMethodSelected("card")}
              disabled={loading || processingPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 h-auto py-4 flex items-center justify-start space-x-4 disabled:opacity-50"
            >
              <CreditCard className="w-8 h-8" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">Credit/Debit Card</span>
                <span className="text-xs text-gray-300">Pay using your card</span>
              </div>
            </Button>

            <Button
              onClick={() => handlePaymentMethodSelected("upi")}
              disabled={loading || processingPayment}
              className="w-full bg-purple-600 hover:bg-purple-700 h-auto py-4 flex items-center justify-start space-x-4 disabled:opacity-50"
            >
              <Smartphone className="w-8 h-8" />
              <div className="flex flex-col items-start">
                <span className="font-semibold">UPI</span>
                <span className="text-xs text-gray-300">Pay using UPI ID or QR code</span>
              </div>
            </Button>

            {(loading || processingPayment) && (
              <div className="text-center text-gray-400 py-2">
                Processing payment... Please wait
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => {
                setShowPaymentMethod(false)
                setPendingAmount(0)
              }}
              disabled={loading}
              className="w-full text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
