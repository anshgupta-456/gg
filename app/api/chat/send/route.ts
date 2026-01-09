import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipientId, content, type } = body

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // In a real application, you would save the message to a database
    const message = {
      id: Date.now(),
      recipientId,
      content,
      type,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, message })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
} 