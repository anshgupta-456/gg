import { NextRequest, NextResponse } from 'next/server'
import { users } from '@/lib/users'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    await new Promise(resolve => setTimeout(resolve, 500))
    const user = users.find(u => u.id === parseInt(userId))
    const username = user?.username || 'User'
    const avatar = user?.avatar || '/placeholder.svg?height=40&width=40'
    // Always return a welcome message for new chats
    const messages = [
      {
        id: 1,
        senderId: parseInt(userId),
        senderName: username,
        senderAvatar: avatar,
        content: `Hey! This is the start of your chat with ${username}.`,
        timestamp: new Date().toLocaleString(),
        type: 'text',
      },
    ]
    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load chat history' }, { status: 500 })
  }
} 