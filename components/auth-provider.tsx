// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// interface User {
//   id: number
//   username: string
//   email: string
//   avatar: string
// }

// interface AuthContextType {
//   user: User | null
//   login: (username: string, password: string) => Promise<boolean>
//   register: (username: string, email: string, password: string) => Promise<boolean>
//   logout: () => void
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       // Verify token and get user data
//       fetchUserData(token)
//     } else {
//       setIsLoading(false)
//     }
//   }, [])

//   const fetchUserData = async (token: string) => {
//     try {
//       const response = await fetch("/api/auth/verify", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.ok) {
//         const userData = await response.json()
//         setUser(userData.user)
//       } else {
//         localStorage.removeItem("token")
//       }
//     } catch (error) {
//       console.error("Error verifying token:", error)
//       localStorage.removeItem("token")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const login = async (username: string, password: string): Promise<boolean> => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         localStorage.setItem("token", data.token)
//         setUser(data.user)
//         return true
//       }
//       return false
//     } catch (error) {
//       console.error("Login error:", error)
//       return false
//     }
//   }

//   const register = async (username: string, email: string, password: string): Promise<boolean> => {
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, email, password }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         localStorage.setItem("token", data.token)
//         setUser(data.user)
//         return true
//       }
//       return false
//     } catch (error) {
//       console.error("Registration error:", error)
//       return false
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("token")
//     setUser(null)
//   }

//   return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔐 Initializing authentication...")
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No token found, auto-logging in...")
        // Auto-login with default user if no token exists
        await autoLoginDefaultUser()
      } else {
        console.log("Token found, verifying...")
        await verifyToken(token)
      }
    }
    initializeAuth()
  }, []) // Only run once on mount

  const autoLoginDefaultUser = async () => {
    try {
      setIsLoading(true)
      console.log("Attempting auto-login with default user (ProShooter99)...")
      
      // Try to login with default user first
      const loginSuccess = await loginDirectly("ProShooter99", "password123")
      if (loginSuccess) {
        console.log("Auto-login successful!")
        setIsLoading(false)
        return
      }
      
      // If login fails, try to register a default user
      console.log("Default login failed, attempting to register...")
      const registerSuccess = await registerDirectly("ProShooter99", "proshooter@example.com", "password123")
      if (registerSuccess) {
        console.log("Auto-register successful!")
        setIsLoading(false)
        return
      }
      
      console.log("Auto-login/register failed. Backend might not be running.")
    } catch (error: any) {
      console.error("Auto-login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loginDirectly = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      localStorage.setItem("token", data.token)
      setUser(data.user)
      return true
    } catch {
      return false
    }
  }

  const registerDirectly = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      localStorage.setItem("token", data.token)
      setUser(data.user)
      return true
    } catch {
      return false
    }
  }

  const verifyToken = async (token: string) => {
    try {
      console.log("Verifying token...")
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        console.log("Token verification failed, will try auto-login")
        throw new Error("Invalid token")
      }

      const data = await res.json()
      console.log("Token verified, user:", data.user?.username)
      setUser(data.user)
    } catch (error: any) {
      console.error("Token verification error:", error)
      localStorage.removeItem("token")
      setUser(null)
      // Don't call autoLoginDefaultUser here to avoid circular dependency
      // It will be called by the useEffect that watches for no user
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      console.log(`Attempting login for user: ${username} to ${API_URL}`)
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Login failed" }))
        console.error("Login failed:", errorData)
        return false
      }

      const data = await res.json()
      console.log("Login successful, token received:", data.token ? "Yes" : "No")
      localStorage.setItem("token", data.token)
      setUser(data.user)
      return true
    } catch (error: any) {
      console.error("Login exception:", error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      localStorage.setItem("token", data.token)
      setUser(data.user)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    console.log("Logging out user...")
    localStorage.removeItem("token")
    setUser(null)
    // Optionally redirect to login page
  }

  // Auto-login only once on mount if no user
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token && !user && !isLoading) {
      // Only auto-login once, don't watch user to avoid loops
      console.log("No user found, attempting auto-login...")
      autoLoginDefaultUser()
    }
  }, []) // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
