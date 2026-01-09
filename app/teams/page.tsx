import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TeamSpaces } from "@/components/team-spaces"

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0">
          <TeamSpaces />
        </main>
      </div>
    </div>
  )
}
