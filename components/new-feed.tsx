"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Eye, Users } from "lucide-react"
import type React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const liveChannels = [
  {
    id: 1,
    title: "2020 World Champs Gaming Warzone",
    streamer: "Tom Tran",
    game: "Call of Duty",
    viewers: "2.1k",
    thumbnail: "/news_feed/tomtran.jpg",
  },
  {
    id: 2,
    title: "Team Flash vs Saigon Phantom",
    streamer: "Dash Uill",
    game: "League of Legends",
    viewers: "4.7k",
    thumbnail: "/news_feed/dashuil.webp",
  },
  {
    id: 3,
    title: "2020 World Champs Gaming Warzone",
    streamer: "UB Gaming",
    game: "Call of Duty",
    viewers: "3.2k",
    thumbnail: "/news_feed/ubgaming.webp",
  },
  {
    id: 4,
    title: "2020 World Champs Gaming Warzone",
    streamer: "Gabriel Erickson",
    game: "Garena Free Fire",
    viewers: "4.2k",
    thumbnail: "/news_feed/gareena.jpg",
  },
]

const followedChannels = [
  { name: "Gabriel Erickson", time: "1 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "4 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "11 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "14 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "14 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "4 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "14 min ago", avatar: "/news_feed/gabrieler.webp" },
]

const popularCategories = [
  {
    name: "League of Legends",
    viewers: "4.3K Viewers",
    thumbnail: "/news_feed/leagueoflegends.jpg",
    tags: ["MOBA", "Esport"],
  },
  {
    name: "Fortnite",
    viewers: "4.3K Viewers",
    thumbnail: "/news_feed/fortnite.webp",
  },
  {
    name: "Call of Duty",
    viewers: "4.3K Viewers",
    thumbnail: "/news_feed/callofduty.jpg",
  },
]

export function NewFeed() {
  const router = useRouter()
  const [liveSort, setLiveSort] = useState<"Popular" | "Recent" | "Viewers">("Popular")
  const [recSort, setRecSort] = useState<"Most Recent" | "Most Popular" | "Most Viewed">("Most Recent")

  const parseViewers = (v: string) => {
    const lower = v.toLowerCase().replace(/[^0-9.km]/g, "")
    if (lower.endsWith("m")) return parseFloat(lower) * 1_000_000
    if (lower.endsWith("k")) return parseFloat(lower) * 1_000
    return parseFloat(lower)
  }

  const sortedLiveChannels = useMemo(() => {
    const list = [...liveChannels]
    if (liveSort === "Popular" || liveSort === "Viewers") {
      list.sort((a, b) => parseViewers(b.viewers) - parseViewers(a.viewers))
    } else if (liveSort === "Recent") {
      list.sort((a, b) => b.id - a.id)
    }
    return list
  }, [liveSort])

  const sortedRecommended = useMemo(() => {
    const list = [...liveChannels]
    if (recSort === "Most Viewed" || recSort === "Most Popular") {
      list.sort((a, b) => parseViewers(b.viewers) - parseViewers(a.viewers))
    } else if (recSort === "Most Recent") {
      list.sort((a, b) => b.id - a.id)
    }
    return list
  }, [recSort])

  const goToVideos = () => router.push("/videos")

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
      {/* Featured Stream */}
      <div className="relative">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
          <img
            src="/news_feed/leagueoflegends.jpg"
            alt="Featured Stream"
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6">
            <Badge className="bg-red-500 text-white mb-2">LIVE</Badge>
            <h1 className="text-xl lg:text-3xl font-bold text-white mb-2">
              Renegades vs Chiefs - ESL Pro League Season 16 - Playoffs
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 text-white/80 mb-4">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>League of Legends</span>
              </span>
              <span>English</span>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={goToVideos}>
              <Play className="w-4 h-4 mr-2" />
              Watch
            </Button>
          </div>
        </div>
        
      </div>

      {/* Live Channels */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-2 lg:space-y-0">
          <h2 className="text-lg lg:text-xl font-semibold text-white">Live channels</h2>
          <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white w-full lg:w-auto" value={liveSort} onChange={(e) => setLiveSort(e.target.value as any)}>
            <option value="Popular">Popular</option>
            <option value="Recent">Recent</option>
            <option value="Viewers">Viewers</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedLiveChannels.map((channel) => (
            <Card key={channel.id} className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer" onClick={goToVideos}>
              <div className="relative">
                <img
                  src={channel.thumbnail || "/news_feed/gabrieler.webp"}
                  alt={channel.title}
                  className="w-full h-32 object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
                />
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">LIVE</Badge>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {channel.viewers} watching
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">{channel.title}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src="/news_feed/gabrieler.webp"
                    alt={channel.streamer}
                    className="w-5 h-5 rounded-full"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder-user.jpg" }}
                  />
                  <span className="text-xs text-gray-400">{channel.streamer}</span>
                </div>
                <span className="text-xs text-gray-500">{channel.game}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* From Channels You Follow */}
      <section>
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-6">From Channels You Follow</h2>
        <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
          <Button className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12 flex-shrink-0">+</Button>
          {followedChannels.map((channel, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 flex-shrink-0">
              <div className="relative">
                <img src={channel.avatar || "/news_feed/gabrieler.webp"} alt={channel.name} className="w-12 h-12 rounded-full" onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder-user.jpg" }} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">+</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 text-center">{channel.name}</span>
              <span className="text-xs text-gray-500">{channel.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-6">Popular Categories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative">
                <img
                  src={popularCategories[0].thumbnail || "/news_feed/gabrieler.webp"}
                  alt={popularCategories[0].name}
                  className="w-full h-48 lg:h-64 object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
                />
                <div className="absolute bottom-4 left-4">
                  <div className="flex space-x-2 mb-2">
                    {popularCategories[0].tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-600 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-1">{popularCategories[0].name}</h3>
                  <p className="text-gray-300 text-sm">{popularCategories[0].viewers}</p>
                  <Button className="mt-2 bg-purple-600 hover:bg-purple-700">Follow</Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-4">
            {popularCategories.slice(1).map((category, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img
                    src={category.thumbnail || "/news_feed/gabrieler.webp"}
                    alt={category.name}
                    className="w-full h-32 object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-blue-600 text-white mb-1">
                      Shooter
                    </Badge>
                    <h4 className="font-semibold text-white text-sm">{category.name}</h4>
                    <p className="text-xs text-gray-300">{category.viewers}</p>
                  </div>
                  <Button size="sm" className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700">
                    Follow
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Videos */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-2 lg:space-y-0">
          <h2 className="text-lg lg:text-xl font-semibold text-white">Recommended Videos</h2>
          <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white w-full lg:w-auto" value={recSort} onChange={(e) => setRecSort(e.target.value as any)}>
            <option value="Most Recent">Most Recent</option>
            <option value="Most Popular">Most Popular</option>
            <option value="Most Viewed">Most Viewed</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedRecommended.map((video) => (
            <Card key={video.id} className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer" onClick={goToVideos}>
              <div className="relative">
                <img
                  src={video.thumbnail || "/news_feed/gabrieler.webp"}
                  alt={video.title}
                  className="w-full h-32 object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder.jpg" }}
                />
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">LIVE</Badge>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {video.viewers} watching
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src="/news_feed/gabrieler.webp"
                    alt={video.streamer}
                    className="w-5 h-5 rounded-full"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = "/placeholder-user.jpg" }}
                  />
                  <span className="text-xs text-gray-400">{video.streamer}</span>
                </div>
                <span className="text-xs text-gray-500">{video.game}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
