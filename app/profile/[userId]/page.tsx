import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"

interface ProfilePageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0">
          <UserProfile userId={userId} />
        </main>
      </div>
    </div>
  )
} 