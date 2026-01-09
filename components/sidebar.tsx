"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  TrendingUp,
  Users,
  Video,
  List,
  MessageCircle,
  Settings,
  User,
  Briefcase,
  Trophy,
  UserPlus,
  Target,
  X,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const navigation = [
  { name: "New Feed", href: "/", icon: Home },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Following", href: "/following", icon: Users },
  { name: "Your Videos", href: "/videos", icon: Video },
  { name: "Playlist", href: "/playlist", icon: List },
]

const followingUsers = [
  { id: 1, name: "Dylan Hodges", avatar: "./news_feed/gabrieler.webp", online: true },
  { id: 2, name: "Vincent Parks", avatar: "./news_feed/gabrieler.webp", online: true },
  { id: 3, name: "Richard Bowers", avatar: "./news_feed/gabrieler.webp", online: false },
  { id: 4, name: "Isaac Lambert", avatar: "./news_feed/gabrieler.webp", online: false },
  { id: 5, name: "Lillie Nash", avatar: "./news_feed/gabrieler.webp", online: true },
  { id: 6, name: "Edith Cain", avatar: "./news_feed/gabrieler.webp", online: false },
  { id: 7, name: "Jerry Sherman", avatar: "./news_feed/gabrieler.webp", online: true },
]

const additionalFeatures = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Teams", href: "/teams", icon: UserPlus },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Tournaments", href: "/tournaments", icon: Trophy },
  { name: "Matchmaking", href: "/matchmaking", icon: Target },
  { name: "Chat", href: "/chat", icon: MessageCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-16 bottom-0 bg-gray-800 border-r border-gray-700 overflow-y-auto z-50 transition-transform duration-300",
        isMobile 
          ? `w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'w-64 translate-x-0'
      )}>
        <div className="p-4">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Additional Features</h3>
            <div className="space-y-1">
              {additionalFeatures.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Following</h3>
            <div className="space-y-2">
              {followingUsers.slice(0, showMore ? followingUsers.length : 5).map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <img src={user.avatar || "/placeholder-user.jpg"} alt={user.name} className="w-8 h-8 rounded-full" />
                    {user.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-300">{user.name}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMore(!showMore)}
                className="text-gray-400 hover:text-white text-xs"
              >
                {showMore ? "Show less" : "Load more"}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="space-y-1">
              <Link
                href="/chat"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
                <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
              </Link>
              <Link
                href="/settings"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-20 left-4 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="bg-gray-800 text-white border border-gray-700"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}
    </>
  )
}
