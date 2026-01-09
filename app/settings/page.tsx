import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0 p-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="ProShooter99" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="proshooter99@email.com" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 mt-2">Save Changes</Button>
              </div>
            </Card>
            {/* Notification Settings */}
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <Input id="email-notif" type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notif">Push Notifications</Label>
                  <Input id="push-notif" type="checkbox" className="w-5 h-5" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 mt-2">Save Changes</Button>
              </div>
            </Card>
            {/* Privacy Settings */}
            <Card className="bg-gray-800 border-gray-700 p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Privacy</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-profile">Show my profile publicly</Label>
                  <Input id="show-profile" type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="searchable">Allow my profile to be searchable</Label>
                  <Input id="searchable" type="checkbox" className="w-5 h-5" defaultChecked />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 mt-2">Save Changes</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
} 