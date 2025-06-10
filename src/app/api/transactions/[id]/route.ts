import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// For now we'll use a hardcoded user ID since we haven't implemented authentication yet
const DEFAULT_USER_ID = 'user123'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get the id from params
    const params = await context.params
    const id = params.id

    // First ensure default user exists
    await ensureUserExists()
    
    // Get transaction by ID
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: id,
        userId: DEFAULT_USER_ID
      }
    })
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Failed to fetch transaction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get the id from params
    const params = await context.params
    const id = params.id
    
    const body = await request.json()
    
    // Validate request body
    if (!body.amount || !body.description || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    })
    
    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: Number(body.amount),
        description: body.description,
        date: new Date(body.date),
        categoryId: body.categoryId || null
      }
    })
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Failed to update transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get the id from params
    const params = await context.params
    const id = params.id
    
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    })
    
    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    // Delete transaction
    await prisma.transaction.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
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