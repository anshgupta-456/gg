import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Users } from "lucide-react"

const followedChannels = [
  { name: "Gabriel Erickson", time: "1 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "4 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "11 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "14 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "14 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "4 min ago", avatar: "/news_feed/gabrieler.webp" },
  { name: "Gabriel Erickson", time: "14 min ago", avatar: "/news_feed/gabrieler.webp" },
]

const recentGames = [
  { name: "Call of Duty®", viewers: "2.3K viewers", thumbnail: "/news_feed/callofduty.jpg" },
  { name: "The Dota 2", viewers: "2.5K viewers", thumbnail: "/news_feed/ubgaming.webp" },
  { name: "League of Legends®", viewers: "2.5K viewers", thumbnail: "/news_feed/leagueoflegends.jpg" },
  { name: "Fortnite®", viewers: "2.5K viewers", thumbnail: "/news_feed/fortnite.webp" },
]

const todayVideos = [
  {
    id: 1,
    title: "2020 World Champs Gaming Warzone",
    streamer: "Tom Tran",
    game: "Call of Duty",
    viewers: "4.2k",
    thumbnail: "/news_feed/callofduty.jpg",
  },
  {
    id: 2,
    title: "Team Flash vs Saigon Phantom",
    streamer: "Dash Uill",
    game: "League of Legends",
    viewers: "4.1k",
    thumbnail: "/news_feed/ubgaming.webp",
  },
  {
    id: 3,
    title: "2020 World Champs Gaming Warzone",
    streamer: "UB Gaming",
    game: "Call of Duty",
    viewers: "4.2k",
    thumbnail: "/news_feed/tomtran.jpg",
  },
  {
    id: 4,
    title: "2020 World Champs Gaming Warzone",
    streamer: "Gabriel Erickson",
    game: "Garena Free Fire",
    viewers: "6.5k",
    thumbnail: "/news_feed/gareena.jpg",
  },
]

const popularCategories = [
  {
    name: "League of Legends",
    viewers: "4.3K Viewers",
    thumbnail: "./news_feed/leagueoflegends.jpg?height=300&width=400",
    tags: ["MOBA", "Esport"],
  },
  {
    name: "Fortnite",
    viewers: "4.3K Viewers",
    thumbnail: "./news_feed/fortnite.webp?height=150&width=200",
  },
  {
    name: "Call of Duty",
    viewers: "4.3K Viewers",
    thumbnail: "./news_feed/callofduty.jpg?height=150&width=200",
  },
]

export function FollowingFeed() {
  return (
    <div className="p-6 space-y-8">
      {/* From Channels You Follow */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-6">From Channels You Follow</h2>
        <div className="flex items-center space-x-4 mb-6">
          <Button className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12">+</Button>
          {followedChannels.map((channel, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className="relative">
                <img src={channel.avatar || "./news_feed/gabrieler.webp"} alt={channel.name} className="w-12 h-12 rounded-full" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">+</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 text-center">{channel.name}</span>
              <span className="text-xs text-gray-500">{channel.time}</span>
            </div>
          ))}
        </div>

        {/* Recent Games */}
        <div className="flex space-x-4 mb-8">
          {recentGames.map((game, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
              <img
                src={game.thumbnail || "./news_feed/fortnite.webp"}
                alt={game.name}
                className="w-12 h-9 rounded object-cover"
              />
              <div>
                <h4 className="text-white text-sm font-medium">{game.name}</h4>
                <p className="text-gray-400 text-xs">{game.viewers}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Matches */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-6">Live Matches</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
              <img
                src="./news_feed/fortnite.webp?height=400&width=700"
                alt="Live Match"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-gray-700 text-white">24K Watching</Badge>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <Badge className="bg-red-500 text-white mb-2">LIVE</Badge>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Renegades vs Chiefs - ESL Pro League Season 16 - Playoffs
                </h1>
                <div className="flex items-center space-x-4 text-white/80 mb-4">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>League of Legends</span>
                  </span>
                  <span>English</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Today Videos */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Today Videos</h2>
          <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white">
            <option>Sort by: Trending</option>
            <option>Sort by: Recent</option>
            <option>Sort by: Most Viewed</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayVideos.map((video) => (
            <Card key={video.id} className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative">
                <img
                  src={video.thumbnail || "./news_feed/fortnite.webp"}
                  alt={video.title}
                  className="w-full h-32 object-cover"
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
                    src="./news_feed/gabrieler.webp?height=20&width=20"
                    alt={video.streamer}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-gray-400">{video.streamer}</span>
                </div>
                <span className="text-xs text-gray-500">{video.game}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-xl">🔥</span>
          <h2 className="text-xl font-semibold text-white">Popular Categories</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="relative">
                <img
                  src={popularCategories[0].thumbnail || "./news_feed/fortnite.webp"}
                  alt={popularCategories[0].name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <div className="flex space-x-2 mb-2">
                    {popularCategories[0].tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-600 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{popularCategories[0].name}</h3>
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
                    src={category.thumbnail || "./news_feed/gabrieler.webp"}
                    alt={category.name}
                    className="w-full h-32 object-cover"
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
    </div>
  )
}
