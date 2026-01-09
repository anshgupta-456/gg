import { NextResponse } from 'next/server'
import { users } from '@/lib/users'

export async function POST(request: Request) {
  // Simulate a matchmaking search and return all users as matches
  return NextResponse.json({ matches: users })
} 