// import { Sidebar } from "@/components/sidebar"
// import { Header } from "@/components/header"
// import { ChatInterface } from "@/components/chat-interface"

// export default function ChatPage() {
//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <Header />
//       <div className="flex pt-16">
//         <Sidebar />
//         <main className="flex-1 ml-64 lg:ml-64 md:ml-0">
//           <ChatInterface />
//         </main>
//       </div>
//     </div>
//   )
// }
import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64 md:ml-0">
          <Suspense fallback={<div className="p-4">Loading chat...</div>}>
            <ChatInterface />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
