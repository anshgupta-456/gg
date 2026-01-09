import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Trash2 } from "lucide-react"

const playlistVideos = [
  {
    id: 1,
    title: "Epic Clutch in Ranked Match",
    game: "Call of Duty",
    thumbnail: "/placeholder.svg?height=120&width=200",
    views: "2.3K",
    added: "2 days ago",
  },
  {
    id: 2,
    title: "Perfect Team Coordination",
    game: "League of Legends",
    thumbnail: "/placeholder.svg?height=120&width=200",
    views: "1.8K",
    added: "5 days ago",
  },
  {
    id: 3,
    title: "Insane Headshot Compilation",
    game: "Valorant",
    thumbnail: "/placeholder.svg?height=120&width=200",
    views: "3.1K",
    added: "1 week ago",
  },
]

export default function PlaylistPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0 p-8">
          <h1 className="text-3xl font-bold mb-6">My Playlist</h1>
          {playlistVideos.length === 0 ? (
            <div className="text-center text-gray-400 mt-24">
              <p className="text-lg">Your playlist is empty. Add videos to see them here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistVideos.map((video) => (
                <Card key={video.id} className="bg-gray-800 border-gray-700 p-4 flex flex-col">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">{video.title}</h2>
                    <p className="text-sm text-gray-400 mb-2">{video.game}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <span className="mr-4">{video.views} views</span>
                      <span>Added {video.added}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-auto">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 flex-1">
                      <Play className="w-4 h-4 mr-1" /> Play
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 flex-1">
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 