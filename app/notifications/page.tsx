import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Bell } from "lucide-react"

const notifications = [
  { id: 1, message: "You have a new friend request from StrategyMaster.", time: "2m ago" },
  { id: 2, message: "Your match with TeamPlayer2024 is now active!", time: "10m ago" },
  { id: 3, message: "Tournament registration closes in 1 hour.", time: "1h ago" },
]

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0 p-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center"><Bell className="w-7 h-7 mr-2 text-purple-400" />Notifications</h1>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card key={notif.id} className="bg-gray-800 border-gray-700 p-4 flex items-center justify-between">
                <span>{notif.message}</span>
                <span className="text-xs text-gray-400">{notif.time}</span>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
} 