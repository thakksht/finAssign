import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// For now we'll use a hardcoded user ID since we haven't implemented authentication yet
const DEFAULT_USER_ID = 'user123'

export async function GET() {
  try {
    // First ensure default user exists
    await ensureUserExists()
    
    // Get all transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: DEFAULT_USER_ID
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.amount || !body.description || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Ensure default user exists
    await ensureUserExists()
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: Number(body.amount),
        description: body.description,
        date: new Date(body.date),
        userId: DEFAULT_USER_ID
      }
    })
    
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Failed to create transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

// Helper function to ensure a default user exists in development environment
async function ensureUserExists() {
  const existingUser = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID }
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        email: 'user@example.com',
        name: 'Test User'
      }
    })
  }
}
