// import type React from "react"
// import type { Metadata, Viewport } from "next"
// import { Inter } from "next/font/google"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "GG Nexus - Gaming Community Platform",
//   description: "Connect with gamers, share content, and compete in tournaments",
//   generator: 'v0.dev',
// }

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

import { AuthProvider } from "@/components/auth-provider"
import { WalletProvider } from "@/components/wallet-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

