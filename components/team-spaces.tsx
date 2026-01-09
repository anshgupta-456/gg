"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, MessageCircle, Calendar, Trophy, Settings, Search, Crown, Shield, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const myTeams = [
  {
    id: 1,
    name: "Phoenix Esports",
    game: "League of Legends",
    members: 12,
    role: "Captain",
    avatar: "/placeholder-user.jpg",
    status: "Active",
    nextMatch: "2024-01-15",
  },
  {
    id: 2,
    name: "Shadow Wolves",
    game: "Call of Duty",
    members: 8,
    role: "Player",
    avatar: "/placeholder-user.jpg",
    status: "Active",
    nextMatch: "2024-01-18",
  },
  {
    id: 3,
    name: "Cyber Knights",
    game: "Counter-Strike",
    members: 6,
    role: "Sub",
    avatar: "/placeholder-user.jpg",
    status: "Inactive",
    nextMatch: null,
  },
]

const availableTeams = [
  {
    id: 4,
    name: "Thunder Gaming",
    game: "Valorant",
    members: 4,
    lookingFor: "Support Player",
    skillLevel: "Diamond+",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    name: "Elite Squad",
    game: "Apex Legends",
    members: 2,
    lookingFor: "Any Role",
    skillLevel: "Platinum+",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 6,
    name: "Pro Gamers United",
    game: "Overwatch",
    members: 5,
    lookingFor: "Tank Player",
    skillLevel: "Master+",
    avatar: "/placeholder-user.jpg",
  },
]

const teamMembers = [
  {
    name: "Gabriel Erickson",
    role: "Captain",
    rank: "Diamond",
    status: "online",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Alex Chen",
    role: "Player",
    rank: "Diamond",
    status: "online",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Sarah Johnson",
    role: "Player",
    rank: "Platinum",
    status: "offline",
    avatar: "/placeholder-user.jpg",
  },
  { name: "Mike Rodriguez", role: "Sub", rank: "Gold", status: "away", avatar: "/placeholder-user.jpg" },
  {
    name: "Emma Wilson",
    role: "Coach",
    rank: "Master",
    status: "online",
    avatar: "/placeholder-user.jpg",
  },
]

const upcomingEvents = [
  { title: "Team Practice", date: "2024-01-12", time: "7:00 PM", type: "practice" },
  { title: "Scrim vs Thunder Gaming", date: "2024-01-14", time: "8:00 PM", type: "scrim" },
  { title: "Tournament Match", date: "2024-01-15", time: "6:00 PM", type: "tournament" },
]

export function TeamSpaces() {
  const { toast } = useToast()
  const [joinedTeams, setJoinedTeams] = useState<number[]>(myTeams.map(t => t.id))

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Collaboration</h1>
          <p className="text-gray-400">Manage your teams and find new opportunities</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => toast({ title: "Feature Coming Soon!", description: "Team creation will be available in a future update." })}>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <Tabs defaultValue="my-teams" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          <TabsTrigger value="find-teams">Find Teams</TabsTrigger>
          <TabsTrigger value="team-details">Team Details</TabsTrigger>
        </TabsList>

        <TabsContent value="my-teams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map((team) => (
              <Card key={team.id} className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={team.avatar || "/placeholder-user.jpg"} alt={team.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-gray-400 text-sm">{team.game}</p>
                  </div>
                  <Badge className={`ml-auto ${team.status === "Active" ? "bg-green-600" : "bg-gray-600"}`}>
                    {team.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Members:</span>
                    <span className="text-white">{team.members}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Your Role:</span>
                    <div className="flex items-center space-x-1">
                      {team.role === "Captain" && <Crown className="w-3 h-3 text-yellow-500" />}
                      {team.role === "Player" && <Shield className="w-3 h-3 text-blue-500" />}
                      {team.role === "Sub" && <User className="w-3 h-3 text-gray-500" />}
                      <span className="text-white">{team.role}</span>
                    </div>
                  </div>
                  {team.nextMatch && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Next Match:</span>
                      <span className="text-white">{team.nextMatch}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => toast({ title: "Team Chat!", description: "Team chat feature coming soon." })}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="find-teams" className="space-y-6">
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teams by name or game..."
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Games</option>
              <option>League of Legends</option>
              <option>Call of Duty</option>
              <option>Valorant</option>
              <option>Counter-Strike</option>
            </select>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Skill Levels</option>
              <option>Bronze+</option>
              <option>Silver+</option>
              <option>Gold+</option>
              <option>Platinum+</option>
              <option>Diamond+</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTeams.map((team) => (
              <Card key={team.id} className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={team.avatar || "/placeholder-user.jpg"} alt={team.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-gray-400 text-sm">{team.game}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Members:</span>
                    <span className="text-white">{team.members}/6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Looking for:</span>
                    <span className="text-white">{team.lookingFor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Skill Level:</span>
                    <Badge className="bg-blue-600">{team.skillLevel}</Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 flex-1"
                    disabled={joinedTeams.includes(team.id)}
                    onClick={() => {
                      setJoinedTeams((prev) => [...prev, team.id])
                      toast({ title: "Joined Team!", description: `You joined ${team.name}.` })
                    }}
                  >
                    Join
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team-details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Team Overview */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="/placeholder-user.jpg"
                    alt="Phoenix Esports"
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Phoenix Esports</h2>
                    <p className="text-gray-400">League of Legends • Competitive Team</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className="bg-green-600">Active</Badge>
                      <span className="text-gray-400 text-sm">Founded: March 2023</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  A competitive League of Legends team focused on climbing the ranked ladder and participating in
                  tournaments. We value teamwork, communication, and continuous improvement.
                </p>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-gray-400 text-sm">Matches Won</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">8</div>
                    <div className="text-gray-400 text-sm">Matches Lost</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">75%</div>
                    <div className="text-gray-400 text-sm">Win Rate</div>
                  </div>
                </div>
              </Card>

              {/* Team Members */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
                <div className="space-y-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={member.avatar || "/placeholder-user.jpg"}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                              member.status === "online"
                                ? "bg-green-500"
                                : member.status === "away"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{member.name}</span>
                            {member.role === "Captain" && <Crown className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>{member.role}</span>
                            <span>•</span>
                            <span>{member.rank}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border-l-2 border-purple-600 pl-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium text-sm">{event.title}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {event.date} at {event.time}
                      </div>
                      <Badge
                        size="sm"
                        className={`mt-1 ${
                          event.type === "tournament"
                            ? "bg-red-600"
                            : event.type === "scrim"
                              ? "bg-blue-600"
                              : "bg-green-600"
                        }`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button size="sm" className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Team Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 bg-transparent"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Practice
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 bg-transparent"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Stats
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-gray-300 bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Team Settings
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
