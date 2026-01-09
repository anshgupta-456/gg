import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))

    // In a real application, you would update the database to mark messages as read
    const userIdNum = parseInt(userId)

    return NextResponse.json({ success: true, userId: userIdNum })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 })
  }
} 