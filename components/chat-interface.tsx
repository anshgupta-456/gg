"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Search, MoreVertical, Phone, Video, Info, Smile, Paperclip, Mic, ImageIcon, ArrowLeft, Menu } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter, useSearchParams } from "next/navigation"
import { users as allUsers } from "@/lib/users"

interface ChatMessage {
  id: number
  senderId: number
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
}

interface ChatUser {
  id: number
  username: string
  avatar: string
  isOnline: boolean
  lastSeen: string
  game?: string
  status?: string
  unreadCount?: number
}

const getInitialChatUsers = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("chatUsers")
    if (stored) return JSON.parse(stored)
  }
  // Default to first 4 users
  return allUsers.slice(0, 4)
}

export function ChatInterface() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSidebar, setShowSidebar] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const searchParams = useSearchParams()
  const [chatUsers, setChatUsers] = useState<ChatUser[]>(getInitialChatUsers())
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Add a new chat user if not already present
  const addChatUser = (userId: number) => {
    if (!chatUsers.some(u => u.id === userId)) {
      const user = allUsers.find(u => u.id === userId)
      if (user) {
        const newList = [...chatUsers, user]
        setChatUsers(newList)
        if (typeof window !== "undefined") {
          localStorage.setItem("chatUsers", JSON.stringify(newList))
        }
      }
    }
  }

  // On mount, check for ?user=ID in URL and auto-select/add that user
  useEffect(() => {
    const userIdParam = searchParams.get("user")
    if (userIdParam) {
      const userId = Number(userIdParam)
      addChatUser(userId)
      const user = allUsers.find(u => u.id === userId)
      if (user) setSelectedUser(user)
    }
  }, [])

  useEffect(() => {
    if (selectedUser) {
      loadChatHistory(selectedUser.id)
      // Mark messages as read
      markMessagesAsRead(selectedUser.id)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Auto-hide sidebar on mobile when user is selected
    if (selectedUser && isMobile) {
      setShowSidebar(false)
    }
  }, [selectedUser, isMobile])

  const loadChatHistory = async (userId: number) => {
    try {
      const response = await fetch(`/api/chat/history/${userId}`)
      const data = await response.json()
      setMessages(
        data.messages || [
          {
            id: 1,
            senderId: userId,
            senderName: selectedUser?.username || "",
            senderAvatar: selectedUser?.avatar || "",
            content: "Hey! Want to team up for some ranked matches?",
            timestamp: "2024-01-12 14:30",
            type: "text",
          },
          {
            id: 2,
            senderId: 0, // Current user
            senderName: "You",
            senderAvatar: "/placeholder-user.jpg",
            content: "I'm looking to climb the ladder. What's your current rank?",
            timestamp: "2024-01-12 14:32",
            type: "text",
          },
          {
            id: 3,
            senderId: userId,
            senderName: selectedUser?.username || "",
            senderAvatar: selectedUser?.avatar || "",
            content: "I'm Diamond 2 right now. Been stuck here for a while 😅",
            timestamp: "2024-01-12 14:33",
            type: "text",
          },
        ],
      )
    } catch (error) {
      console.error("Error loading chat history:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    const message: ChatMessage = {
      id: Date.now(),
      senderId: 0, // Current user
      senderName: "You",
      senderAvatar: "/placeholder-user.jpg",
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate response
      const response: ChatMessage = {
        id: Date.now() + 1,
        senderId: selectedUser.id,
        senderName: selectedUser.username,
        senderAvatar: selectedUser.avatar,
        content: "Thanks for the message! I'll get back to you soon.",
        timestamp: new Date().toLocaleString(),
        type: "text",
      }
      setMessages((prev) => [...prev, response])
    }, 2000)

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          content: newMessage,
          type: "text",
        }),
      })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const markMessagesAsRead = async (userId: number) => {
    try {
      await fetch(`/api/chat/mark-read/${userId}`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // When selecting a user from the sidebar, ensure they're in the chat list
  const handleSelectUser = (user: ChatUser) => {
    addChatUser(user.id)
    setSelectedUser(user)
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Send image message
  const sendImage = async () => {
    if (!selectedUser || !imageFile || !imagePreview) return
    const message: ChatMessage = {
      id: Date.now(),
      senderId: 0,
      senderName: "You",
      senderAvatar: "/placeholder-user.jpg",
      content: imagePreview,
      timestamp: new Date().toLocaleString(),
      type: "image",
    }
    setMessages((prev) => [...prev, message])
    setImageFile(null)
    setImagePreview(null)
    // Simulate response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: ChatMessage = {
        id: Date.now() + 1,
        senderId: selectedUser.id,
        senderName: selectedUser.username,
        senderAvatar: selectedUser.avatar,
        content: "Nice picture!",
        timestamp: new Date().toLocaleString(),
        type: "text",
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  // Use chatUsers for sidebar and filtering
  const filteredUsers = chatUsers.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-20 left-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-gray-800 text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Chat Sidebar */}
      <div className={`${isMobile ? 'fixed inset-0 z-30' : 'w-80'} ${showSidebar ? 'block' : isMobile ? 'hidden' : 'block'}`}>
        <div className={`${isMobile ? 'w-full h-full' : 'w-80'} bg-gray-800 border-r border-gray-700 flex flex-col`}>
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h1 className="text-xl font-bold text-white">Messages</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(false)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-purple-600 border-purple-500"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatar || "/placeholder-user.jpg"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        user.isOnline ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white truncate">{user.username}</h3>
                      <span className="text-xs text-gray-400">2:30 PM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-400 truncate">{user.status || `Playing ${user.game}`}</p>
                      {user.status === "In Game" && <Badge className="bg-green-600 text-xs">Live</Badge>}
                      {user.unreadCount && user.unreadCount > 0 && (
                        <Badge className="bg-red-600 text-xs">{user.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${isMobile && !selectedUser ? 'hidden' : 'block'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSidebar(true)}
                      className="text-gray-400 hover:text-white mr-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  )}
                  <div className="relative">
                    <img
                      src={selectedUser.avatar || "/placeholder-user.jpg"}
                      alt={selectedUser.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        selectedUser.isOnline ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{selectedUser.username}</h3>
                    <p className="text-sm text-gray-400">
                      {selectedUser.isOnline ? "Online" : `Last seen ${selectedUser.lastSeen}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Messages */}
            <Card className="flex-1 bg-gray-800 border-gray-700 p-4 overflow-hidden">
              <div className="h-full overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 0 ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.senderId === 0 ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <img
                        src={message.senderAvatar || "/placeholder-user.jpg"}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div
                        className={`rounded-lg p-3 ${
                          message.senderId === 0 ? "bg-purple-600 text-white" : "bg-gray-700 text-white"
                        }`}
                      >
                        {message.type === "image" ? (
                          <img src={message.content} alt="Sent" className="max-w-[200px] max-h-[200px] rounded mb-2" />
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <img
                        src={selectedUser.avatar || "/placeholder-user.jpg"}
                        alt={selectedUser.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </Card>

            {/* Message Input */}
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-gray-700 border-gray-600 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-6 w-6 p-0">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white h-6 w-6 p-0">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={imagePreview ? sendImage : sendMessage}
                  disabled={(!newMessage.trim() && !imagePreview) || !selectedUser}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <Card className="flex-1 bg-gray-800 border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a user from the sidebar to start chatting</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
