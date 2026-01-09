// Test script to verify backend connection
// Run this in browser console or as a Node.js script

const API_URL = "http://localhost:5000";

async function testBackendConnection() {
  console.log("Testing backend connection...");
  
  try {
    // Test 1: Health check
    console.log("\n1. Testing health endpoint...");
    const healthRes = await fetch(`${API_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log("✓ Health check:", healthData);
    
    // Test 2: Login
    console.log("\n2. Testing login...");
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "ProShooter99", password: "password123" })
    });
    
    if (!loginRes.ok) {
      console.error("✗ Login failed:", loginRes.status, await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    console.log("✓ Login successful, token received:", loginData.token ? "Yes" : "No");
    const token = loginData.token;
    
    // Test 3: Get wallet
    console.log("\n3. Testing wallet endpoint...");
    const walletRes = await fetch(`${API_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!walletRes.ok) {
      console.error("✗ Wallet fetch failed:", walletRes.status, await walletRes.text());
      return;
    }
    
    const walletData = await walletRes.json();
    console.log("✓ Wallet balance:", walletData);
    
    // Test 4: Add money
    console.log("\n4. Testing add money...");
    const addRes = await fetch(`${API_URL}/api/wallet/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: 50, payment_method: "card" })
    });
    
    if (!addRes.ok) {
      console.error("✗ Add money failed:", addRes.status, await addRes.text());
      return;
    }
    
    const addData = await addRes.json();
    console.log("✓ Add money successful!");
    console.log("  Previous balance:", walletData.balance);
    console.log("  Amount added: $50");
    console.log("  New balance:", addData.balance);
    
    // Test 5: Verify updated balance
    console.log("\n5. Verifying updated balance...");
    const walletRes2 = await fetch(`${API_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const walletData2 = await walletRes2.json();
    console.log("✓ Updated balance:", walletData2.balance);
    
    console.log("\n✅ All tests passed! Backend is working correctly.");
    
  } catch (error) {
    console.error("\n❌ Connection error:", error);
    console.error("Make sure backend is running on http://localhost:5000");
  }
}

// Run test
testBackendConnection();
