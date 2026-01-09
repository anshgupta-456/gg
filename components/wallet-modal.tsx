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
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to view wallet",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const balanceValue = parseFloat(data.balance) || data.balance || 0
        setBalance(balanceValue)
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
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to add money",
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

      const responseData = await response.json()
      console.log("Wallet add response data:", responseData)

      if (response.ok && responseData.balance !== undefined) {
        const newBalance = parseFloat(responseData.balance) || 0
        setBalance(newBalance)
        if (onBalanceUpdate) {
          onBalanceUpdate(newBalance)
        }
        setAddAmount("")
        setPendingAmount(0)
        setPaymentMethod(null)
        setShowPaymentMethod(false)
        toast({
          title: "Payment Successful!",
          description: `$${amountToAdd.toFixed(2)} has been added to your wallet via ${method === "card" ? "Credit/Debit Card" : "UPI"}`,
        })
        // Refresh balance after a short delay
        setTimeout(() => {
          fetchBalance()
        }, 500)
      } else {
        console.error("Wallet add error:", responseData)
        toast({
          title: "Payment Failed",
          description: responseData.message || "Failed to process payment. Please try again.",
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
              <span className="text-4xl font-bold text-white">{balance.toFixed(2)}</span>
            </div>
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
                You will be asked to select a payment method
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
