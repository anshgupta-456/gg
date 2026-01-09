"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Eye, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"

const featuredStreams = [
  {
    title: "Renegades vs Chiefs - ESL Pro League Season 16 - Playoffs",
    game: "League of Legends",
    language: "English",
    thumbnail: "/news_feed/leagueoflegends.jpg",
  },
  {
    title: "Call of Duty Finals - Highlights",
    game: "Call of Duty",
    language: "English",
    thumbnail: "/trending/call.webp",
  },
]

const trendingNow = [
  {
    id: 1,
    title: "Spectating the Pros - Fly Santorin, Powerofsevil - New Cops vs PoE",
    streamer: "Gabriel Erickson",
    game: "Call of Duty",
    viewers: "3.2k",
    timeAgo: "1 week ago",
    thumbnail: "/news_feed/tomtran.jpg",
    category: "Shooter",
  },
  {
    id: 2,
    title: "Spectating the Pros - Fly Santorin, Powerofsevil - New Cops vs PoE",
    streamer: "Gabriel Erickson",
    game: "Call of Duty",
    viewers: "3.2k",
    timeAgo: "1 week ago",
    thumbnail: "/news_feed/ubgaming.webp",
    category: "Shooter",
  },
  {
    id: 3,
    title: "New Sub Emotes And Badges! Lets Goooo",
    streamer: "Gabriel Erickson",
    game: "Call of Duty",
    viewers: "3.2k",
    timeAgo: "1 week ago",
    thumbnail: "/news_feed/fortnite.webp",
    category: "New",
  },
  {
    id: 4,
    title: "Spectating the Pros - Fly Santorin, Powerofsevil - New Cops vs PoE",
    streamer: "Gabriel Erickson",
    game: "Call of Duty",
    viewers: "3.2k",
    timeAgo: "1 week ago",
    thumbnail: "/news_feed/gareena.jpg",
    category: "Shooter",
  },
  {
    id: 5,
    title: "New Sub Emotes And Badges! Lets Goooo",
    streamer: "Gabriel Erickson",
    game: "Call of Duty",
    viewers: "3.2k",
    timeAgo: "1 week ago",
    thumbnail: "/news_feed/callofduty.jpg",
    category: "Shooter",
  },
  {
    id: 6,
    title: "Spectating the Pros - Fly Santorin, Powerofsevil - New Cops vs PoE",
    streamer: "Gabriel Erickson",
    game: "Call of Duty",
    viewers: "3.2k",
    timeAgo: "1 week ago",
    thumbnail: "/news_feed/leagueoflegends.jpg",
    category: "Shooter",
  },
]

const trendingStreamers = [
  {
    name: "GG Nexus",
    game: "Call of Duty",
    viewers: "7.3K viewers",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Daniel Brothers",
    game: "Call of Duty",
    viewers: "6.8K viewers",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Amazing Channel",
    game: "Call of Duty",
    viewers: "7.3K viewers",
    avatar: "/placeholder-user.jpg",
  },
  { name: "Dash UB", game: "Call of Duty", viewers: "7.3K viewers", avatar: "/placeholder-user.jpg" },
  {
    name: "Tran Mau Tri Tam",
    game: "Call of Duty",
    viewers: "7.3K viewers",
    avatar: "/placeholder-user.jpg",
  },
]

const trendingGames = [
  {
    name: "Call of Duty®",
    description: "The massive free-to-play combat arena from the world of Modern Warfare®.",
    image: "/news_feed/callofduty.jpg",
  },
  {
    name: "Counter-Strike®",
    description: "Counter-Strike is a series of multiplayer first-person shooter video games.",
    image: "/news_feed/ubgaming.webp",
  },
  {
    name: "Fortnite®",
    description: "Join forces, watch, create and play players all in one place.",
    image: "/news_feed/fortnite.webp",
  },
  {
    name: "League of Legends®",
    description: "League of Legends is a team-based game with over 140 champions to make epic plays with.",
    image: "/news_feed/leagueoflegends.jpg",
  },
]

export function TrendingFeed() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<"All" | "Esport" | "Game Online">("All")
  const [sortOption, setSortOption] = useState<"New" | "Popular" | "Most Viewed">("New")

  const parseViewers = (v: string) => {
    const lower = v.toLowerCase().replace(/[^0-9.km]/g, "")
    if (lower.endsWith("m")) return parseFloat(lower) * 1_000_000
    if (lower.endsWith("k")) return parseFloat(lower) * 1_000
    return parseFloat(lower)
  }

  const filteredTrending = useMemo(() => {
    let list = [...trendingNow]
    if (activeFilter === "Esport") {
      list = list.filter((i) => i.category === "Shooter")
    } else if (activeFilter === "Game Online") {
      list = list.filter((i) => i.category === "New")
    }
    if (sortOption === "Most Viewed") {
      list.sort((a, b) => parseViewers(b.viewers) - parseViewers(a.viewers))
    }
    return list
  }, [activeFilter, sortOption])

  const goToVideos = () => router.push("/videos")

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">GG Nexus</h1>
        <h2 className="text-4xl font-bold text-white">Trending</h2>
      </div>

      {/* Featured Carousel */}
      <div className="relative">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
          <img
            src={featuredStreams[0].thumbnail || "/placeholder.jpg"}
            alt="Featured Stream"
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge className="bg-red-500 text-white mb-2">LIVE</Badge>
            <h1 className="text-3xl font-bold text-white mb-2">{featuredStreams[0].title}</h1>
            <div className="flex items-center space-x-4 text-white/80 mb-4">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{featuredStreams[0].game}</span>
              </span>
              <span>{featuredStreams[0].language}</span>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={goToVideos}>
              <Play className="w-4 h-4 mr-2" />
              Watch
            </Button>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <Button variant="ghost" size="icon" className="bg-black bg-opacity-50 text-white hover:bg-opacity-70">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <Button variant="ghost" size="icon" className="bg-black bg-opacity-50 text-white hover:bg-opacity-70">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
        <span className="absolute bottom-4 right-4 text-white text-sm">Showing 2 / 8</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4">
        <Button className={`hover:bg-purple-700 ${activeFilter === "All" ? "bg-purple-600" : "bg-gray-700"}`} onClick={() => setActiveFilter("All")}>All</Button>
        <Button variant="ghost" className={`hover:text-white ${activeFilter === "Esport" ? "text-white" : "text-gray-400"}`} onClick={() => setActiveFilter("Esport")}>Esport</Button>
        <Button variant="ghost" className={`hover:text-white ${activeFilter === "Game Online" ? "text-white" : "text-gray-400"}`} onClick={() => setActiveFilter("Game Online")}>Game Online</Button>
        <div className="ml-auto">
          <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value={sortOption} onChange={(e) => setSortOption(e.target.value as any)}>
            <option value="New">New</option>
            <option value="Popular">Popular</option>
            <option value="Most Viewed">Most Viewed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Trending Now */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6">Top Trending Now</h2>
          <div className="space-y-4">
            {filteredTrending.map((item, index) => (
              <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer" onClick={goToVideos}>
                <div className="flex">
                  <div className="relative w-48 h-28">
                    <img
                      src={item.thumbnail || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">LIVE</Badge>
                    <Badge className="absolute top-2 right-2 bg-blue-600 text-white">{item.category}</Badge>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.viewers} watching
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="text-purple-400 text-sm font-medium">{index + 1}</span>
                        <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <img
                            src="/placeholder-user.jpg"
                            alt={item.streamer}
                            className="w-5 h-5 rounded-full"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder-user.jpg" }}
                          />
                          <span className="text-xs text-gray-400">{item.streamer}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{item.game}</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-6 text-gray-400 hover:text-white" onClick={goToVideos}>
            Load More
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Trending Streamers */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Trending Streamers</h3>
            <div className="space-y-3">
              {trendingStreamers.map((streamer, index) => (
                <div key={index} className="flex items-center space-x-3 cursor-pointer" onClick={goToVideos}>
                  <img
                    src={streamer.avatar || "/placeholder-user.jpg"}
                    alt={streamer.name}
                    className="w-10 h-10 rounded-full"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder-user.jpg" }}
                  />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">{streamer.name}</h4>
                    <p className="text-gray-400 text-xs">{streamer.game}</p>
                    <p className="text-gray-500 text-xs">{streamer.viewers}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-purple-400 hover:text-purple-300" onClick={goToVideos}>
                Discover More
              </Button>
            </div>
          </div>

          {/* Trending Games */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Trending Games</h3>
            <div className="space-y-4">
              {trendingGames.map((game, index) => (
                <div key={index} className="flex items-start space-x-3 cursor-pointer" onClick={goToVideos}>
                  <img src={game.image || "/placeholder.jpg"} alt={game.name} className="w-12 h-12 rounded" onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }} />
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium mb-1">{game.name}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{game.description}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-purple-400 hover:text-purple-300" onClick={goToVideos}>
                Discover More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
