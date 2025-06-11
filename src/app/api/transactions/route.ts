import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEFAULT_USER_ID = 'user123'

export async function GET() {
  try {
    await ensureUserExists()
    
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
    
    if (!body.amount || !body.description || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await ensureUserExists()
    
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
