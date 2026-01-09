import { NextResponse } from 'next/server'
import { users } from '@/lib/users'

export async function POST(request: Request) {
  // Simulate a quick match by returning a random user
  const match = users[Math.floor(Math.random() * users.length)]
  return NextResponse.json({ match })
} 