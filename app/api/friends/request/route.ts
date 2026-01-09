import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { targetUserId } = await request.json()
  return NextResponse.json({ success: true, userId: targetUserId })
} 