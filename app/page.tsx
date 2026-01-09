import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { NewFeed } from "@/components/new-feed"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0">
          <NewFeed />
        </main>
      </div>
    </div>
  )
}
