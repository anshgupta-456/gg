"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Play,
  Upload,
  Search,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share,
  Clock,
  Calendar,
  MoreVertical,
  Edit,
} from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const myVideos = [
  {
    id: 1,
    title: "Epic Clutch in Ranked Match - 1v5 Ace",
    game: "Call of Duty",
    views: 15420,
    likes: 892,
    comments: 156,
    duration: "3:45",
    uploadDate: "2024-01-10",
    thumbnail: "/placeholder.jpg",
    status: "Published",
    visibility: "Public",
  },
  {
    id: 2,
    title: "Perfect Team Coordination - League of Legends",
    game: "League of Legends",
    views: 8930,
    likes: 445,
    comments: 89,
    duration: "7:22",
    uploadDate: "2024-01-08",
    thumbnail: "/placeholder.jpg",
    status: "Published",
    visibility: "Public",
  },
  {
    id: 3,
    title: "Insane Headshot Compilation",
    game: "Counter-Strike",
    views: 23150,
    likes: 1205,
    comments: 234,
    duration: "5:18",
    uploadDate: "2024-01-05",
    thumbnail: "/placeholder.jpg",
    status: "Published",
    visibility: "Public",
  },
  {
    id: 4,
    title: "New Strategy Guide - Valorant",
    game: "Valorant",
    views: 5670,
    likes: 298,
    comments: 67,
    duration: "12:34",
    uploadDate: "2024-01-03",
    thumbnail: "/placeholder.jpg",
    status: "Processing",
    visibility: "Unlisted",
  },
]

const trendingVideos = [
  {
    id: 5,
    title: "World Championship Highlights",
    creator: "ProGamer123",
    game: "League of Legends",
    views: 156000,
    likes: 8920,
    comments: 1456,
    duration: "15:30",
    uploadDate: "2024-01-12",
    thumbnail: "/placeholder.jpg",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 6,
    title: "Best Plays of the Week",
    creator: "EliteShooter",
    game: "Call of Duty",
    views: 89300,
    likes: 4560,
    comments: 789,
    duration: "8:45",
    uploadDate: "2024-01-11",
    thumbnail: "/placeholder.jpg",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 7,
    title: "Beginner's Guide to Competitive Gaming",
    creator: "GameMaster",
    game: "Various",
    views: 45600,
    likes: 2340,
    comments: 456,
    duration: "20:15",
    uploadDate: "2024-01-09",
    thumbnail: "/placeholder.jpg",
    avatar: "/placeholder-user.jpg",
  },
]

export function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const handleVideoClick = async (videoId: number) => {
    try {
      const response = await fetch(`/api/videos/${videoId}`)
      const videoData = await response.json()
      setSelectedVideo(videoData)
    } catch (error) {
      console.error("Error fetching video:", error)
    }
  }

  const handleUpload = () => {
    // Trigger file upload
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "video/*"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append("video", file)

        try {
          setUploading(true)
          setUploadProgress(10)
          const response = await fetch("/api/videos/upload", {
            method: "POST",
            body: formData,
          })
          setUploadProgress(80)
          const result = await response.json()
          console.log("Upload successful:", result)
          // Refresh video list
          setUploadProgress(100)
        } catch (error) {
          console.error("Upload failed:", error)
        }
        setTimeout(() => {
          setUploading(false)
          setUploadProgress(0)
        }, 600)
      }
    }
    input.click()
  }

  const onUploadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    const url = URL.createObjectURL(file)
    setUploadPreviewUrl(url)
  }

  const submitUpload = async () => {
    if (!uploadFile) return
    const formData = new FormData()
    formData.append("video", uploadFile)
    try {
      setUploading(true)
      setUploadProgress(10)
      const response = await fetch("/api/videos/upload", { method: "POST", body: formData })
      setUploadProgress(80)
      await response.json()
      setUploadProgress(100)
    } catch (e) {
      console.error("Upload failed:", e)
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        setUploadFile(null)
        if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl)
        setUploadPreviewUrl(null)
      }, 600)
    }
  }

  const analyticsData = [
    { day: "Mon", views: 1200, likes: 80 },
    { day: "Tue", views: 2100, likes: 120 },
    { day: "Wed", views: 1800, likes: 95 },
    { day: "Thu", views: 2600, likes: 140 },
    { day: "Fri", views: 3000, likes: 160 },
    { day: "Sat", views: 4200, likes: 240 },
    { day: "Sun", views: 3700, likes: 190 },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Videos</h1>
          <p className="text-gray-400">Manage and share your gaming highlights</p>
        </div>
        <Button onClick={handleUpload} className="bg-purple-600 hover:bg-purple-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      <Tabs defaultValue="my-videos" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="my-videos">My Videos</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="my-videos" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Games</option>
              <option>Call of Duty</option>
              <option>League of Legends</option>
              <option>Counter-Strike</option>
              <option>Valorant</option>
            </select>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Status</option>
              <option>Published</option>
              <option>Processing</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myVideos
              .filter(
                (video) =>
                  video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  video.game.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((video) => (
                <Card key={video.id} className="bg-gray-800 border-gray-700 overflow-hidden group">
                  <div className="relative cursor-pointer" onClick={() => handleVideoClick(video.id)}>
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs text-white">
                      {video.duration}
                    </div>
                    <Badge
                      className={`absolute top-2 left-2 ${
                        video.status === "Published"
                          ? "bg-green-600"
                          : video.status === "Processing"
                            ? "bg-yellow-600"
                            : "bg-gray-600"
                      }`}
                    >
                      {video.status}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-400 text-xs mb-3">{video.game}</p>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{video.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{video.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{video.comments}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {video.uploadDate}
                      </span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                          <Share className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <Card key={video.id} className="bg-gray-800 border-gray-700 overflow-hidden group">
                <div className="relative cursor-pointer" onClick={() => handleVideoClick(video.id)}>
                  <img
                    src={video.thumbnail || "/placeholder.jpg"}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">{video.title}</h3>

                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={video.avatar || "/placeholder-user.jpg"}
                      alt={video.creator}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-gray-400 text-xs">{video.creator}</span>
                  </div>

                  <p className="text-gray-400 text-xs mb-3">{video.game}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{video.likes}</span>
                      </span>
                    </div>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {video.uploadDate}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-white">53,170</p>
                </div>
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Likes</p>
                  <p className="text-2xl font-bold text-white">2,840</p>
                </div>
                <ThumbsUp className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Comments</p>
                  <p className="text-2xl font-bold text-white">546</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Watch Time</p>
                  <p className="text-2xl font-bold text-white">127h</p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
            <ChartContainer
              config={{
                views: { label: "Views", color: "hsl(259, 94%, 51%)" },
                likes: { label: "Likes", color: "hsl(142, 76%, 36%)" },
              }}
              className="h-64"
            >
              <LineChart data={analyticsData} margin={{ left: 12, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#9ca3af" tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload a Video</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                  <input type="file" accept="video/*" onChange={onUploadInputChange} className="block w-full text-sm text-gray-300" />
                  {uploadPreviewUrl ? (
                    <video src={uploadPreviewUrl} controls className="mt-4 w-full h-64 object-cover rounded" />
                  ) : (
                    <div className="mt-4 h-64 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                      Select a video to preview
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <Button onClick={submitUpload} disabled={!uploadFile || uploading} className="w-full bg-purple-600 hover:bg-purple-700">
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                {uploading && (
                  <div className="w-full h-2 bg-gray-700 rounded">
                    <div className="h-2 bg-purple-600 rounded" style={{ width: `${uploadProgress}%` }} />
                  </div>
                )}
                <Button variant="outline" onClick={handleUpload} className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Or choose file via dialog
                </Button>
                <p className="text-xs text-gray-500">Supported formats: mp4, mov, webm. Max 2GB.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
