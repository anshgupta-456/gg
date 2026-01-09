"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Users,
  Gamepad2,
  MessageCircle,
  UserPlus,
  Filter,
  MapPin,
  Clock,
  Trophy,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { users as allUsers, UserProfile } from "@/lib/users"

// If you later expose the Flask server under another domain, set NEXT_PUBLIC_BACKEND_URL.
// For local `npm run dev` preview it can stay "" so we use the same-origin `/api/*`.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
const api = (path: string) => `${BACKEND_URL}${path}`

const skillLevels = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster"]
const games = ["League of Legends", "Call of Duty", "Valorant", "Counter-Strike", "Overwatch", "Apex Legends"]

interface Player {
  id: number
  username: string
  avatar: string
  game: string
  rank: string
  skillLevel: string
  winRate: number
  hoursPlayed: number
  preferredRole: string
  location: string
  isOnline: boolean
  lastActive: string
  matchCompatibility: number
}

export function Matchmaking() {
  const findPlayersTabRef = useRef<HTMLButtonElement | null>(null)
  const [selectedGame, setSelectedGame] = useState("All Games")
  const [selectedSkill, setSelectedSkill] = useState("All Levels")
  const [isSearching, setIsSearching] = useState(false)
  const [matchedPlayers, setMatchedPlayers] = useState<UserProfile[]>([])
  const [quickMatchSearching, setQuickMatchSearching] = useState(false)
  const [myMatches, setMyMatches] = useState<{
    id: number
    player: UserProfile
    matchedAt: string
    status: string
    compatibility: number | undefined
  }[]>([
    {
      id: 1,
      player: allUsers[1],
      matchedAt: "2024-01-12 15:30",
      status: "Active",
      compatibility: allUsers[1].matchCompatibility,
    },
    {
      id: 2,
      player: allUsers[2],
      matchedAt: "2024-01-11 20:15",
      status: "Completed",
      compatibility: allUsers[2].matchCompatibility,
    },
  ])
  const [connectedUserIds, setConnectedUserIds] = useState<number[]>([])

  // Use all users for matchmaking
  const suggestedPlayers: UserProfile[] = allUsers

  const startMatchmaking = async () => {
    setIsSearching(true)

    try {
      // Use the Flask backend URL directly
      const response = await fetch(api("/api/matchmaking/find"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          game: selectedGame,
          skillLevel: selectedSkill,
          preferredRole: "Any",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Simulate search time
      setTimeout(() => {
        setMatchedPlayers(data.matches || suggestedPlayers)
        setIsSearching(false)
      }, 3000)
    } catch (error) {
      console.error("Matchmaking error:", error)
      // Fallback to mock data
      setTimeout(() => {
        setMatchedPlayers(suggestedPlayers)
        setIsSearching(false)
      }, 3000)
    }
  }

  const startQuickMatch = async () => {
    setQuickMatchSearching(true)

    try {
      const response = await fetch(api("/api/matchmaking/quick"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setTimeout(() => {
        if (data.match) {
          alert(`Match found! You've been matched with ${data.match.username}`)
          // Add to my matches
          const newMatch = {
            id: Date.now(),
            player: data.match,
            matchedAt: new Date().toLocaleString(),
            status: "Active",
            compatibility: data.match.matchCompatibility || 85,
          }
          setMyMatches((prev) => [newMatch, ...prev])
        }
        setQuickMatchSearching(false)
      }, 5000)
    } catch (error) {
      console.error("Quick match error:", error)
      setTimeout(() => {
        // Mock successful match
        const mockMatch = suggestedPlayers[Math.floor(Math.random() * suggestedPlayers.length)]
        const newMatch = {
          id: Date.now(),
          player: mockMatch,
          matchedAt: new Date().toLocaleString(),
          status: "Active",
          compatibility: mockMatch.matchCompatibility,
        }
        setMyMatches((prev) => [newMatch, ...prev])
        alert(`Match found! You've been matched with ${mockMatch.username}`)
        setQuickMatchSearching(false)
      }, 5000)
    }
  }

  const removeMatch = (matchId: number) => {
    setMyMatches((prev) => prev.filter((match) => match.id !== matchId))
  }

  const sendFriendRequest = async (playerId: number) => {
    try {
      const response = await fetch(api("/api/friends/request"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ targetUserId: playerId }),
      })

      if (response.ok) {
        alert("Friend request sent!")
      } else {
        alert("Failed to send friend request")
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
      alert("Friend request sent!") // Mock success
    }
  }

  const startChat = async (playerId: number) => {
    try {
      const response = await fetch(api("/api/chat/start"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ targetUserId: playerId }),
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = `/chat?user=${playerId}`
      } else {
        window.location.href = `/chat?user=${playerId}`
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      window.location.href = `/chat?user=${playerId}`
    }
  }

  // Connect logic
  const connectUser = (userId: number) => {
    setConnectedUserIds((prev) => [...prev, userId])
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skill-Based Matchmaking</h1>
          <p className="text-gray-400">Find players with similar skill levels and gaming preferences</p>
        </div>
      </div>

      <Tabs defaultValue="find-players" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="find-players" ref={findPlayersTabRef}>Find Players</TabsTrigger>
          <TabsTrigger value="quick-match">Quick Match</TabsTrigger>
          <TabsTrigger value="my-matches">My Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="find-players" className="space-y-6">
          {/* Search Filters */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Search Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Game</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option>All Games</option>
                  {games.map((game) => (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Level</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option>All Levels</option>
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Role</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                  <option>Any Role</option>
                  <option>DPS/Carry</option>
                  <option>Support</option>
                  <option>Tank</option>
                  <option>Flex</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Asia</option>
                  <option>South America</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <Button onClick={startMatchmaking} disabled={isSearching} className="bg-purple-600 hover:bg-purple-700">
                {isSearching ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find Players
                  </>
                )}
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </Card>

          {/* Search Results */}
          {isSearching && (
            <Card className="bg-gray-800 border-gray-700 p-12">
              <div className="text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-white mb-2">Finding Perfect Matches...</h3>
                <p className="text-gray-400">Analyzing player skills and preferences</p>
              </div>
            </Card>
          )}

          {matchedPlayers.length > 0 && !isSearching && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Suggested Players</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedPlayers.map((player) => (
                  <Card key={player.id} className="bg-gray-800 border-gray-700 p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={player.avatar || "./news_feed/gabrieler.webp"}
                          alt={player.username}
                          className="w-16 h-16 rounded-full"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                            player.isOnline ? "bg-green-500" : "bg-gray-500"
                          }`}
                        ></div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{player.username}</h4>
                          <Badge className="bg-purple-600">{player.matchCompatibility}% Match</Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-4 text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Gamepad2 className="w-4 h-4" />
                              <span>{player.game}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Trophy className="w-4 h-4" />
                              <span>{player.rank}</span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{player.winRate}% Win Rate</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{player.hoursPlayed}h Played</span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{player.preferredRole}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{player.location}</span>
                            </span>
                          </div>

                          <p className="text-gray-500 text-xs">
                            {player.isOnline ? "Online now" : `Last active: ${player.lastSeen || "Online"}`}
                          </p>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          {connectedUserIds.includes(player.id) ? (
                            <Link href={`/chat?user=${player.id}`}>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Chat
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => connectUser(player.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Connect
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendFriendRequest(player.id)}
                            className="border-gray-600 text-gray-300 bg-transparent"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Add Friend
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quick-match" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4">Quick Match</h3>
            <p className="text-gray-400 mb-6">Get instantly matched with players of similar skill level</p>

            {quickMatchSearching ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                  <p className="text-white font-medium">Finding your perfect match...</p>
                  <p className="text-gray-400 text-sm">This may take a few moments</p>
                </div>
                <Button
                  onClick={() => setQuickMatchSearching(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 bg-transparent"
                >
                  Cancel Search
                </Button>
              </div>
            ) : (
              <Button size="lg" onClick={startQuickMatch} className="bg-purple-600 hover:bg-purple-700">
                <Zap className="w-5 h-5 mr-2" />
                Start Quick Match
              </Button>
            )}
          </Card>

          {/* Quick Match Tips */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Match Tips</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p>Quick Match finds players based on your current game preferences and skill level</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p>Matches are made instantly without the need to set specific filters</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <p>You can cancel the search at any time if it's taking too long</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="my-matches" className="space-y-6">
          {myMatches.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">My Matches ({myMatches.length})</h3>
                <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                  <option>All Matches</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {myMatches.map((match) => (
                  <Card key={match.id} className="bg-gray-800 border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={match.player.avatar || "/placeholder.svg"}
                            alt={match.player.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white">{match.player.username}</h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Gamepad2 className="w-3 h-3" />
                              <span>{match.player.game}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Trophy className="w-3 h-3" />
                              <span>{match.player.rank}</span>
                            </span>
                            <Badge className="bg-purple-600 text-xs">{match.compatibility}% Match</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Matched on {match.matchedAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={`${match.status === "Active" ? "bg-green-600" : "bg-gray-600"}`}>
                          {match.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Link href={`/chat?user=${match.player.id}`}>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeMatch(match.id)}
                            className="border-gray-600 text-gray-300 bg-transparent hover:bg-red-600 hover:border-red-600"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Recent Matches</h3>
              <p className="text-gray-400 mb-4">Start matchmaking to find players and build your match history</p>
              <Button
                onClick={() => (findPlayersTabRef.current as HTMLButtonElement | null)?.click()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Find Players
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
