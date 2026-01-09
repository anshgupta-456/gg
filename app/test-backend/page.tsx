"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function TestBackendPage() {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
    console.log(message)
  }

  const testBackend = async () => {
    setResults([])
    addResult("Starting backend connection test...")

    try {
      // Test 1: Health check
      addResult("\n1. Testing health endpoint...")
      const healthRes = await fetch(`${API_URL}/api/health`)
      if (healthRes.ok) {
        const healthData = await healthRes.json()
        addResult(`✓ Health check: ${JSON.stringify(healthData)}`)
      } else {
        addResult(`✗ Health check failed: ${healthRes.status}`)
        return
      }

      // Test 2: Login
      addResult("\n2. Testing login...")
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "ProShooter99", password: "password123" }),
      })

      if (!loginRes.ok) {
        addResult(`✗ Login failed: ${loginRes.status}`)
        return
      }

      const loginData = await loginRes.json()
      const token = loginData.token
      addResult(`✓ Login successful, token: ${token ? token.substring(0, 20) + "..." : "none"}`)

      // Test 3: Get wallet
      addResult("\n3. Testing wallet endpoint...")
      const walletRes = await fetch(`${API_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!walletRes.ok) {
        addResult(`✗ Wallet fetch failed: ${walletRes.status}`)
        return
      }

      const walletData = await walletRes.json()
      addResult(`✓ Wallet balance: $${walletData.balance}`)

      // Test 4: Add money
      addResult("\n4. Testing add money...")
      const addRes = await fetch(`${API_URL}/api/wallet/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 50, payment_method: "card" }),
      })

      if (!addRes.ok) {
        const errorData = await addRes.json().catch(() => ({}))
        addResult(`✗ Add money failed: ${addRes.status} - ${errorData.message || "Unknown error"}`)
        return
      }

      const addData = await addRes.json()
      addResult(`✓ Add money successful!`)
      addResult(`  Previous: $${walletData.balance}`)
      addResult(`  Added: $50`)
      addResult(`  New balance: $${addData.balance}`)

      // Test 5: Verify updated balance
      addResult("\n5. Verifying updated balance...")
      const walletRes2 = await fetch(`${API_URL}/api/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const walletData2 = await walletRes2.json()
      addResult(`✓ Updated balance: $${walletData2.balance}`)

      addResult("\n✅ All tests passed! Backend is working correctly.")
    } catch (error: any) {
      addResult(`\n❌ Connection error: ${error.message}`)
      addResult(`Make sure backend is running on ${API_URL}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Card className="bg-gray-800 border-gray-700 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
        <Button onClick={testBackend} className="mb-4 bg-purple-600 hover:bg-purple-700">
          Run Tests
        </Button>
        <div className="bg-gray-900 p-4 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-auto">
          {results.length === 0 ? "Click 'Run Tests' to test backend connection..." : results.join("\n")}
        </div>
      </Card>
    </div>
  )
}
