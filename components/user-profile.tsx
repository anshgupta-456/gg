"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Trophy, Users, Video, Star, MapPin, Calendar, Globe, Gamepad2, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface UserProfileProps {
  userId: string
}

const userStats = [
  { label: "Followers", value: "12.5K" },
  { label: "Following", value: "234" },
  { label: "Videos", value: "89" },
  { label: "Hours Streamed", value: "1,240" },
]

const achievements = [
  { name: "First Victory", description: "Won your first match", icon: Trophy, earned: true },
  { name: "Team Player", description: "Played 100 team matches", icon: Users, earned: true },
  { name: "Content Creator", description: "Uploaded 50 videos", icon: Video, earned: true },
  { name: "Rising Star", description: "Reached 10K followers", icon: Star, earned: false },
]

const recentHighlights = [
  {
    id: 1,
    title: "Epic Clutch in Ranked Match",
    game: "Call of Duty",
    views: "2.3K",
    thumbnail: "/placeholder.jpg",
  },
  {
    id: 2,
    title: "Perfect Team Coordination",
    game: "League of Legends",
    views: "1.8K",
    thumbnail: "/placeholder.jpg",
  },
  {
    id: 3,
    title: "Insane Headshot Compilation",
    game: "Counter-Strike",
    views: "3.1K",
    thumbnail: "/placeholder.jpg",
  },
]

const skillRatings = [
  { skill: "Aim", rating: 85 },
  { skill: "Strategy", rating: 92 },
  { skill: "Teamwork", rating: 88 },
  { skill: "Communication", rating: 90 },
]

// Mock user data based on userId
const getUserData = (userId: string) => {
  const users = {
    "1": {
      id: 1,
      name: "Dylan Hodges",
      username: "@dylan_gaming",
      avatar: "/placeholder-user.jpg",
      location: "New York, NY",
      joinedDate: "January 2023",
      twitchUrl: "twitch.tv/dylan_gaming",
      bio: "Professional FPS player and content creator. Specializing in Call of Duty and Valorant. Always pushing the limits of what's possible in gaming.",
      tags: ["FPS Expert", "Team Captain", "Content Creator"],
      isOnline: true,
      stats: { followers: "8.2K", following: "156", videos: "67", hoursStreamed: "890" },
      skillRatings: [
        { skill: "Aim", rating: 92 },
        { skill: "Strategy", rating: 85 },
        { skill: "Teamwork", rating: 90 },
        { skill: "Communication", rating: 88 },
      ],
      favoriteGames: ["Call of Duty", "Valorant", "Counter-Strike", "Apex Legends"]
    },
    "2": {
      id: 2,
      name: "Vincent Parks",
      username: "@vincent_pro",
      avatar: "/placeholder-user.jpg",
      location: "Los Angeles, CA",
      joinedDate: "March 2022",
      twitchUrl: "twitch.tv/vincent_pro",
      bio: "MOBA specialist and team leader. Competing at the highest level in League of Legends and Dota 2. Building the next generation of esports talent.",
      tags: ["MOBA Expert", "Team Leader", "Coach"],
      isOnline: true,
      stats: { followers: "15.3K", following: "89", videos: "124", hoursStreamed: "2,100" },
      skillRatings: [
        { skill: "Aim", rating: 78 },
        { skill: "Strategy", rating: 95 },
        { skill: "Teamwork", rating: 92 },
        { skill: "Communication", rating: 94 },
      ],
      favoriteGames: ["League of Legends", "Dota 2", "Heroes of the Storm", "Arena of Valor"]
    },
    "3": {
      id: 3,
      name: "Richard Bowers",
      username: "@richard_bow",
      avatar: "/placeholder-user.jpg",
      location: "Chicago, IL",
      joinedDate: "November 2021",
      twitchUrl: "twitch.tv/richard_bow",
      bio: "Battle Royale specialist and tournament organizer. Creating amazing content and helping others improve their game.",
      tags: ["Battle Royale", "Tournament Organizer", "Community Builder"],
      isOnline: false,
      stats: { followers: "6.7K", following: "203", videos: "45", hoursStreamed: "1,560" },
      skillRatings: [
        { skill: "Aim", rating: 88 },
        { skill: "Strategy", rating: 82 },
        { skill: "Teamwork", rating: 85 },
        { skill: "Communication", rating: 87 },
      ],
      favoriteGames: ["Fortnite", "PUBG", "Apex Legends", "Warzone"]
    },
    "4": {
      id: 4,
      name: "Isaac Lambert",
      username: "@isaac_lambert",
      avatar: "/placeholder-user.jpg",
      location: "Miami, FL",
      joinedDate: "June 2022",
      twitchUrl: "twitch.tv/isaac_lambert",
      bio: "Fighting game enthusiast and combo master. Sharing advanced techniques and helping the FGC grow.",
      tags: ["Fighting Games", "Combo Master", "FGC"],
      isOnline: false,
      stats: { followers: "4.1K", following: "178", videos: "32", hoursStreamed: "720" },
      skillRatings: [
        { skill: "Aim", rating: 95 },
        { skill: "Strategy", rating: 88 },
        { skill: "Teamwork", rating: 75 },
        { skill: "Communication", rating: 82 },
      ],
      favoriteGames: ["Street Fighter", "Mortal Kombat", "Tekken", "Guilty Gear"]
    },
    "5": {
      id: 5,
      name: "Lillie Nash",
      username: "@lillie_nash",
      avatar: "/placeholder-user.jpg",
      location: "Seattle, WA",
      joinedDate: "September 2022",
      twitchUrl: "twitch.tv/lillie_nash",
      bio: "RPG and adventure game streamer. Creating immersive experiences and building a supportive community.",
      tags: ["RPG Expert", "Adventure Games", "Community Builder"],
      isOnline: true,
      stats: { followers: "9.8K", following: "145", videos: "78", hoursStreamed: "1,890" },
      skillRatings: [
        { skill: "Aim", rating: 72 },
        { skill: "Strategy", rating: 90 },
        { skill: "Teamwork", rating: 88 },
        { skill: "Communication", rating: 91 },
      ],
      favoriteGames: ["Final Fantasy", "Elder Scrolls", "Witcher", "Dragon Age"]
    },
    "6": {
      id: 6,
      name: "Edith Cain",
      username: "@edith_cain",
      avatar: "/placeholder-user.jpg",
      location: "Austin, TX",
      joinedDate: "April 2023",
      twitchUrl: "twitch.tv/edith_cain",
      bio: "Indie game enthusiast and speedrunner. Discovering hidden gems and pushing the limits of what's possible.",
      tags: ["Indie Games", "Speedrunner", "Game Discovery"],
      isOnline: false,
      stats: { followers: "3.2K", following: "267", videos: "56", hoursStreamed: "980" },
      skillRatings: [
        { skill: "Aim", rating: 85 },
        { skill: "Strategy", rating: 92 },
        { skill: "Teamwork", rating: 70 },
        { skill: "Communication", rating: 85 },
      ],
      favoriteGames: ["Hollow Knight", "Celeste", "Dead Cells", "Ori"]
    },
    "7": {
      id: 7,
      name: "Jerry Sherman",
      username: "@jerry_sherman",
      avatar: "/placeholder-user.jpg",
      location: "Denver, CO",
      joinedDate: "December 2021",
      twitchUrl: "twitch.tv/jerry_sherman",
      bio: "Retro gaming specialist and hardware enthusiast. Building custom setups and preserving gaming history.",
      tags: ["Retro Gaming", "Hardware Expert", "Gaming History"],
      isOnline: true,
      stats: { followers: "7.5K", following: "189", videos: "92", hoursStreamed: "1,340" },
      skillRatings: [
        { skill: "Aim", rating: 80 },
        { skill: "Strategy", rating: 85 },
        { skill: "Teamwork", rating: 82 },
        { skill: "Communication", rating: 89 },
      ],
      favoriteGames: ["Super Mario", "Zelda", "Metroid", "Sonic"]
    }
  }
  
  return users[userId as keyof typeof users] || users["1"]
}

export function UserProfile({ userId }: UserProfileProps) {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        const data = getUserData(userId)
        setUserData(data)
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [userId])

  const startChat = async (userId: number) => {
    try {
      // Navigate to chat with this user
      window.location.href = `/chat`
    } catch (error) {
      console.error("Error starting chat:", error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-800 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User Not Found</h2>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-0 sm:p-6 space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-40 sm:h-48 bg-gradient-to-r from-purple-600 to-blue-600 rounded-b-2xl sm:rounded-lg"></div>
        {/* Avatar and Info */}
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 -bottom-16 sm:bottom-auto sm:top-24 flex flex-col sm:flex-row items-center sm:items-end space-y-2 sm:space-y-0 sm:space-x-6 w-full z-10">
          <div className="relative">
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-gray-900 shadow-lg bg-gray-900 object-cover"
            />
            <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-gray-900 ${userData.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          </div>
          <div className="pb-2 sm:pb-4 text-center sm:text-left sm:ml-8 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{userData.name}</h1>
            <p className="text-gray-300 mb-1">{userData.username}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-400 gap-1 sm:gap-0">
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{userData.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {userData.joinedDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{userData.twitchUrl}</span>
              </span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2 z-20">
          <Link href={`/chat?user=${userData.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </Link>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Edit className="w-4 h-4 mr-2" />
            Follow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 sm:mt-16 px-2 sm:px-0">
        <Card className="bg-gray-800 border-gray-700 p-4 sm:p-6 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">{userData.stats.followers}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Followers</div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-4 sm:p-6 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">{userData.stats.following}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Following</div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-4 sm:p-6 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">{userData.stats.videos}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Videos</div>
        </Card>
        <Card className="bg-gray-800 border-gray-700 p-4 sm:p-6 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">{userData.stats.hoursStreamed}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Hours Streamed</div>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                <p className="text-gray-300 leading-relaxed">
                  {userData.bio}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {userData.tags.map((tag: string, index: number) => (
                    <Badge key={index} className="bg-purple-600">{tag}</Badge>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Won a ranked match in {userData.favoriteGames[0]}</span>
                    <span className="text-gray-500 text-xs ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Uploaded new highlight reel</span>
                    <span className="text-gray-500 text-xs ml-auto">5 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Joined team practice session</span>
                    <span className="text-gray-500 text-xs ml-auto">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Reached Diamond rank in {userData.favoriteGames[1]}</span>
                    <span className="text-gray-500 text-xs ml-auto">2 days ago</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skill Ratings */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Skill Ratings</h3>
                <div className="space-y-4">
                  {userData.skillRatings.map((skill: any) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{skill.skill}</span>
                        <span className="text-white font-medium">{skill.rating}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${skill.rating}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Favorite Games */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Favorite Games</h3>
                <div className="space-y-3">
                  {userData.favoriteGames.map((game: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Gamepad2 className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">{game}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="highlights" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Gaming Highlights</h3>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Video className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentHighlights.map((highlight) => (
              <Card key={highlight.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img
                    src={highlight.thumbnail || "/placeholder.jpg"}
                    alt={highlight.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Video className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-white text-sm mb-2">{highlight.title}</h4>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{highlight.game}</span>
                    <span>{highlight.views} views</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Achievements & Badges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <Card
                  key={achievement.name}
                  className={`p-6 border ${
                    achievement.earned ? "bg-gray-800 border-gray-700" : "bg-gray-900 border-gray-800 opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${achievement.earned ? "bg-purple-600" : "bg-gray-700"}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                      {achievement.earned && <Badge className="mt-2 bg-green-600">Earned</Badge>}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Personal Information</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-gray-300">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    defaultValue="Gabriel Erickson"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-gray-300">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="gabriel_gaming"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    defaultValue="Professional gamer and content creator..."
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Location
                  </Label>
                  <Input
                    id="location"
                    defaultValue="Los Angeles, CA"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Privacy Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">Profile Visibility</h5>
                    <p className="text-gray-400 text-sm">Who can see your profile</p>
                  </div>
                  <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white">
                    <option>Public</option>
                    <option>Friends Only</option>
                    <option>Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">Show Online Status</h5>
                    <p className="text-gray-400 text-sm">Display when you're online</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium">Allow Messages</h5>
                    <p className="text-gray-400 text-sm">Who can send you messages</p>
                  </div>
                  <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white">
                    <option>Everyone</option>
                    <option>Friends Only</option>
                    <option>No One</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
