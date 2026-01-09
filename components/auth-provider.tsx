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
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoading(false)
      return
    }
    verifyToken(token)
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Invalid token")

      const data = await res.json()
      setUser(data.user)
    } catch {
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
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
    localStorage.removeItem("token")
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
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
