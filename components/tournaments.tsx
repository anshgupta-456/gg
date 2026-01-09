"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Star,
  Plus,
  Filter,
  Medal,
  Crown,
  Award,
  Gamepad2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useWallet } from "@/components/wallet-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Tournament {
  id: number
  name: string
  game: string
  prizePool: string
  entryFee: number
  participants: string
  startDate: string
  endDate?: string
  status: string
  organizer: string
  format: string
  thumbnail?: string
}

// Sample tournaments - will be replaced by API data

const myTournaments = [
  {
    id: 1,
    name: "Winter Championship 2024",
    game: "League of Legends",
    status: "Registered",
    placement: null,
    earnings: null,
    nextMatch: "2024-01-20 14:00",
    thumbnail: "/news_feed/leagueoflegends.jpg",
  },
  {
    id: 2,
    name: "Autumn Cup 2023",
    game: "Call of Duty",
    status: "Completed",
    placement: "3rd Place",
    earnings: "$2,500",
    nextMatch: null,
    thumbnail: "/news_feed/callofduty.jpg",
  },
  {
    id: 3,
    name: "Summer Showdown",
    game: "Valorant",
    status: "Completed",
    placement: "1st Place",
    earnings: "$5,000",
    nextMatch: null,
    thumbnail: "/news_feed/fortnite.webp",
  },
]

const leaderboard = [
  { rank: 1, player: "ProGamer123", points: 2450, earnings: "$15,000", avatar: "/placeholder-user.jpg" },
  { rank: 2, player: "EliteShooter", points: 2380, earnings: "$12,500", avatar: "/placeholder-user.jpg" },
  {
    rank: 3,
    player: "StrategyMaster",
    points: 2290,
    earnings: "$10,000",
    avatar: "/placeholder-user.jpg",
  },
  {
    rank: 4,
    player: "Gabriel Erickson",
    points: 2150,
    earnings: "$8,750",
    avatar: "/placeholder-user.jpg",
  },
  { rank: 5, player: "TeamPlayer99", points: 2080, earnings: "$7,200", avatar: "/placeholder-user.jpg" },
]

const recentResults = [
  {
    tournament: "Winter Championship 2024",
    winner: "Team Phoenix",
    prize: "$20,000",
    game: "League of Legends",
    date: "2024-01-15",
  },
  {
    tournament: "FPS Masters Cup",
    winner: "Shadow Wolves",
    prize: "$10,000",
    game: "Call of Duty",
    date: "2024-01-12",
  },
  {
    tournament: "Valorant Pro Series",
    winner: "Cyber Knights",
    prize: "$30,000",
    game: "Valorant",
    date: "2024-01-10",
  },
]

interface MyTournament {
  id: number
  registration_id?: number
  name: string
  game: string
  status: string
  placement?: string | null
  earnings?: string | null
  nextMatch?: string | null
  thumbnail?: string
  prize_pool?: string
  start_date?: string
  end_date?: string
}

export function Tournaments() {
  const { toast } = useToast()
  const { balance: walletBalance, updateBalance, refreshBalance } = useWallet()
  const [registeredTournaments, setRegisteredTournaments] = useState<number[]>([])
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([])
  const [myTournamentsList, setMyTournamentsList] = useState<MyTournament[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchTournaments()
    fetchMyTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/tournaments`)
      if (response.ok) {
        const data = await response.json()
        setUpcomingTournaments(data.tournaments || [])
      } else {
        // Fallback to sample data if API fails
        setUpcomingTournaments([
          {
            id: 1,
            name: "Winter Championship 2024",
            game: "League of Legends",
            prizePool: "$50,000",
            entryFee: 10.0,
            participants: "128/128",
            startDate: "2024-01-20",
            endDate: "2024-01-22",
            status: "Registration Closed",
            organizer: "ESL Gaming",
            format: "Single Elimination",
            thumbnail: "/news_feed/leagueoflegends.jpg",
          },
          {
            id: 2,
            name: "FPS Masters Cup",
            game: "Call of Duty",
            prizePool: "$25,000",
            entryFee: 5.0,
            participants: "64/128",
            startDate: "2024-01-25",
            endDate: "2024-01-27",
            status: "Open Registration",
            organizer: "GameBattles",
            format: "Double Elimination",
            thumbnail: "/news_feed/callofduty.jpg",
          },
          {
            id: 3,
            name: "Valorant Pro Series",
            game: "Valorant",
            prizePool: "$75,000",
            entryFee: 15.0,
            participants: "32/64",
            startDate: "2024-02-01",
            endDate: "2024-02-03",
            status: "Open Registration",
            organizer: "Riot Games",
            format: "Swiss System",
            thumbnail: "/news_feed/fortnite.webp",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error)
    } finally {
      setLoading(false)
    }
  }


  const fetchMyTournaments = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setMyTournamentsList([])
        return
      }

      const response = await fetch(`${API_URL}/api/tournaments/my-tournaments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMyTournamentsList(data.tournaments || [])
        // Update registered tournaments list
        const regIds = (data.tournaments || []).map((t: MyTournament) => t.id)
        setRegisteredTournaments(regIds)
      } else {
        setMyTournamentsList([])
      }
    } catch (error) {
      console.error("Error fetching my tournaments:", error)
      setMyTournamentsList([])
    }
  }

  const handleRegister = async (tournament: Tournament) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to register for tournaments",
        variant: "destructive"
      })
      return
    }

    if (walletBalance < tournament.entryFee) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${tournament.entryFee.toFixed(2)} to register. Current balance: $${walletBalance.toFixed(2)}`,
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/tournaments/${tournament.id}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        const newBalance = data.balance || walletBalance
        setRegisteredTournaments((prev) => [...prev, tournament.id])
        
        // Update wallet balance immediately via context
        updateBalance(newBalance)
        
        toast({
          title: "Registered Successfully! ✅",
          description: `You've been registered for ${tournament.name}. Entry fee of $${tournament.entryFee.toFixed(2)} deducted. New balance: $${newBalance.toFixed(2)}`,
        })
        
        // Refresh tournaments to update participant count
        fetchTournaments()
        // Refresh my tournaments to show newly registered tournament
        fetchMyTournaments()
        // Refresh wallet balance from server to confirm
        refreshBalance()
      } else {
        const error = await response.json()
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to register for tournament",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for tournament. Please try again.",
        variant: "destructive"
      })
    }
  }
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournaments & Challenges</h1>
          <p className="text-gray-400">Compete in tournaments and climb the leaderboards</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => toast({ title: "Feature Coming Soon!", description: "Tournament creation will be available in a future update." })}>
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="browse">Browse Tournaments</TabsTrigger>
          <TabsTrigger value="my-tournaments">My Tournaments</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <div className="flex space-x-4">
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Games</option>
              <option>League of Legends</option>
              <option>Call of Duty</option>
              <option>Valorant</option>
              <option>Counter-Strike</option>
            </select>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Prize Pools</option>
              <option>$1,000+</option>
              <option>$5,000+</option>
              <option>$10,000+</option>
              <option>$25,000+</option>
            </select>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Status</option>
              <option>Open Registration</option>
              <option>Registration Closed</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Tournament Grid */}
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading tournaments...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img
                    src={tournament.thumbnail || "/placeholder.svg"}
                    alt={tournament.name}
                    className="w-full h-40 object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      tournament.status === "Open Registration"
                        ? "bg-green-600"
                        : tournament.status === "Registration Closed"
                          ? "bg-red-600"
                          : "bg-gray-600"
                    }`}
                  >
                    {tournament.status}
                  </Badge>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded">
                    <span className="text-white text-sm font-medium">{tournament.game}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-white text-lg">{tournament.name}</h3>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Trophy className="w-4 h-4" />
                      <span>{tournament.prizePool}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{tournament.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{tournament.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{tournament.format}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    Organized by <span className="text-purple-400">{tournament.organizer}</span>
                  </div>

                  {tournament.entryFee > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-yellow-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Entry Fee: ${tournament.entryFee.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 flex-1"
                      disabled={registeredTournaments.includes(tournament.id) || tournament.status !== 'Open Registration'}
                      onClick={() => handleRegister(tournament)}
                    >
                      {tournament.status === "Registration Closed" ? "Full" : registeredTournaments.includes(tournament.id) ? "Registered" : `Register ($${tournament.entryFee.toFixed(2)})`}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 flex-1" 
                      onClick={() => {
                        setSelectedTournament(tournament)
                        setDetailsOpen(true)
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-tournaments" className="space-y-6">
          {myTournamentsList.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tournaments Yet</h3>
              <p className="text-gray-500">Register for tournaments to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTournamentsList.map((tournament) => (
              <Card key={tournament.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="relative">
                  <img
                    src={tournament.thumbnail || "/placeholder.svg"}
                    alt={tournament.name}
                    className="w-full h-32 object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      tournament.status === "Registered"
                        ? "bg-blue-600"
                        : tournament.status === "Completed"
                          ? "bg-gray-600"
                          : "bg-green-600"
                    }`}
                  >
                    {tournament.status}
                  </Badge>
                  {tournament.placement && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded flex items-center space-x-1">
                      {tournament.placement === "1st Place" && <Crown className="w-4 h-4 text-yellow-500" />}
                      {tournament.placement === "2nd Place" && <Medal className="w-4 h-4 text-gray-400" />}
                      {tournament.placement === "3rd Place" && <Award className="w-4 h-4 text-orange-500" />}
                      <span className="text-white text-sm">{tournament.placement}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-white">{tournament.name}</h3>
                  <p className="text-gray-400 text-sm">{tournament.game}</p>
                  
                  {tournament.prize_pool && (
                    <div className="flex items-center space-x-1 text-purple-400 text-sm">
                      <Trophy className="w-4 h-4" />
                      <span>{tournament.prize_pool}</span>
                    </div>
                  )}

                  {tournament.earnings && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">{tournament.earnings}</span>
                    </div>
                  )}

                  {tournament.placement && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Medal className="w-4 h-4" />
                      <span className="text-sm font-medium">{tournament.placement}</span>
                    </div>
                  )}

                  {tournament.nextMatch && (
                    <div className="flex items-center space-x-1 text-blue-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Next: {tournament.nextMatch}</span>
                    </div>
                  )}

                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    {tournament.status === "Registered" ? "View Bracket" : tournament.status === "Completed" ? "View Results" : "View Details"}
                  </Button>
                </div>
              </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Global Leaderboard</h3>
                  <p className="text-gray-400 text-sm">Top players across all tournaments</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {leaderboard.map((player) => (
                      <div key={player.rank} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              player.rank === 1
                                ? "bg-yellow-600 text-white"
                                : player.rank === 2
                                  ? "bg-gray-400 text-white"
                                  : player.rank === 3
                                    ? "bg-orange-600 text-white"
                                    : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {player.rank}
                          </div>
                          <img
                            src={player.avatar || "/placeholder.svg"}
                            alt={player.player}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="text-white font-medium">{player.player}</div>
                            <div className="text-gray-400 text-sm">{player.points} points</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-medium">{player.earnings}</div>
                          <div className="text-gray-400 text-sm">Total Earnings</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">4th</div>
                    <div className="text-gray-400 text-sm">Global Rank</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">2,150</div>
                      <div className="text-gray-400 text-xs">Points</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">$8,750</div>
                      <div className="text-gray-400 text-xs">Earnings</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">12</div>
                      <div className="text-gray-400 text-xs">Tournaments</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">75%</div>
                      <div className="text-gray-400 text-xs">Win Rate</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <div>
                      <div className="text-white font-medium">Tournament Winner</div>
                      <div className="text-gray-400 text-sm">Won 3 tournaments</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6 text-purple-500" />
                    <div>
                      <div className="text-white font-medium">Rising Star</div>
                      <div className="text-gray-400 text-sm">Top 10 global ranking</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-blue-500" />
                    <div>
                      <div className="text-white font-medium">Competitor</div>
                      <div className="text-gray-400 text-sm">Joined 10+ tournaments</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Recent Tournament Results</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-b-0"
                  >
                    <div>
                      <h4 className="text-white font-medium">{result.tournament}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>{result.game}</span>
                        <span>•</span>
                        <span>{result.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{result.winner}</div>
                      <div className="text-green-400 text-sm">{result.prize}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tournament Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTournament?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete tournament information and requirements
            </DialogDescription>
          </DialogHeader>
          
          {selectedTournament && (
            <div className="space-y-6 mt-4">
              {/* Tournament Image */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={selectedTournament.thumbnail || "/placeholder.svg"}
                  alt={selectedTournament.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    selectedTournament.status === "Open Registration"
                      ? "bg-green-600"
                      : selectedTournament.status === "Registration Closed"
                        ? "bg-red-600"
                        : "bg-gray-600"
                  }`}
                >
                  {selectedTournament.status}
                </Badge>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Gamepad2 className="w-4 h-4" />
                    <span className="text-sm">Game</span>
                  </div>
                  <p className="text-white font-medium">{selectedTournament.game}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">Prize Pool</span>
                  </div>
                  <p className="text-white font-medium">{selectedTournament.prizePool}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Entry Fee</span>
                  </div>
                  <p className="text-white font-medium">${selectedTournament.entryFee.toFixed(2)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <p className="text-white font-medium">{selectedTournament.participants}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Start Date</span>
                  </div>
                  <p className="text-white font-medium">{selectedTournament.startDate}</p>
                </div>
                
                {selectedTournament.endDate && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">End Date</span>
                    </div>
                    <p className="text-white font-medium">{selectedTournament.endDate}</p>
                  </div>
                )}
              </div>

              {/* Tournament Details */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Tournament Format</h4>
                  <p className="text-gray-300">{selectedTournament.format}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Organizer</h4>
                  <p className="text-purple-400">{selectedTournament.organizer}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Rules & Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Must be 18 years or older to participate</li>
                    <li>Entry fee is non-refundable after registration closes</li>
                    <li>All participants must follow the code of conduct</li>
                    <li>Matches will be scheduled and communicated via email</li>
                    <li>Prizes will be distributed within 30 days of tournament completion</li>
                  </ul>
                </div>

                {selectedTournament.entryFee > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">Entry Fee Required</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      ${selectedTournament.entryFee.toFixed(2)} will be deducted from your wallet upon registration.
                      {walletBalance < selectedTournament.entryFee && (
                        <span className="block mt-1 text-red-400">
                          Your current balance (${walletBalance.toFixed(2)}) is insufficient. Please add money to your wallet.
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 flex-1"
                  disabled={registeredTournaments.includes(selectedTournament.id) || selectedTournament.status !== 'Open Registration'}
                  onClick={() => {
                    setDetailsOpen(false)
                    handleRegister(selectedTournament)
                  }}
                >
                  {selectedTournament.status === "Registration Closed" 
                    ? "Registration Closed" 
                    : registeredTournaments.includes(selectedTournament.id) 
                      ? "Already Registered" 
                      : `Register ($${selectedTournament.entryFee.toFixed(2)})`}
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 flex-1"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
