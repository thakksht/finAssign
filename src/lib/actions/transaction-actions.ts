'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns'

// For now we'll use a hardcoded user ID since we haven't implemented authentication yet
const DEFAULT_USER_ID = 'user123'

export async function getTransactions() {
  try {
    // Ensure user exists (development environment only)
    await ensureUserExists()
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: DEFAULT_USER_ID
      },
      include: {
        category: true
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return transactions
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    throw new Error('Failed to fetch transactions')
  }
}

export async function getTransaction(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true
      }
    })
    
    if (!transaction) {
      throw new Error('Transaction not found')
    }
    
    return transaction
  } catch (error) {
    console.error('Failed to fetch transaction:', error)
    throw new Error('Failed to fetch transaction')
  }
}

export async function addTransaction({
  amount,
  description,
  date,
  categoryId
}: {
  amount: number
  description: string
  date: Date
  categoryId?: string | null
}) {
  try {
    // Validate the inputs server-side
    if (isNaN(amount)) {
      throw new Error('Invalid amount value');
    }
    
    if (!description || description.trim().length < 3) {
      throw new Error('Description must be at least 3 characters long');
    }
    
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Check if date is in the future
    if (date > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }
    
    // Ensure user exists (development environment only)
    await ensureUserExists()
    
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description: description.trim(), // Trim whitespace
        date,
        userId: DEFAULT_USER_ID,
        categoryId: categoryId || null
      }
    })
    
    revalidatePath('/transactions')
    return transaction
  } catch (error) {
    console.error('Failed to create transaction:', error)
    if (error instanceof Error) {
      throw error;  // Pass the original error message through
    }
    throw new Error('Failed to create transaction')
  }
}

export async function updateTransaction(
  id: string,
  {
    amount,
    description,
    date,
    categoryId
  }: {
    amount: number
    description: string
    date: Date
    categoryId?: string | null
  }
) {
  try {
    // First check if the transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });
    
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }
    
    // Validate the inputs server-side
    if (isNaN(amount)) {
      throw new Error('Invalid amount value');
    }
    
    if (!description || description.trim().length < 3) {
      throw new Error('Description must be at least 3 characters long');
    }
    
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Check if date is in the future
    if (date > new Date()) {
      throw new Error('Transaction date cannot be in the future');
    }
    
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        description: description.trim(), // Trim whitespace
        date,
        categoryId: categoryId || null
      }
    })
    
    revalidatePath('/transactions')
    return transaction  } catch (error) {
    console.error('Failed to update transaction:', error)
    if (error instanceof Error) {
      throw error;  // Pass the original error message through
    }
    throw new Error('Failed to update transaction')
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id }
    })
    
    revalidatePath('/transactions')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    throw new Error('Failed to delete transaction')
  }
}

export async function getCategories() {
  try {
    // Ensure user exists (development environment only)
    await ensureUserExists()
    
    const categories = await prisma.category.findMany({
      where: {
        userId: DEFAULT_USER_ID
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

/**
 * Get monthly transaction totals for dashboard display
 */
export async function getMonthlyTransactionTotals() {
  try {
    await ensureUserExists()
    
    const currentDate = new Date()
    const startDate = startOfMonth(subMonths(currentDate, 5)) // Last 6 months
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        date: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        date: true,
      },
    })
    
    // Group transactions by month and calculate totals
    const monthlyTotals = transactions.reduce((acc, transaction) => {
      const month = format(transaction.date, 'MMM yyyy')
      
      if (!acc[month]) {
        acc[month] = {
          month,
          income: 0,
          expenses: 0,
          net: 0,
        }
      }
      
      if (transaction.amount > 0) {
        acc[month].income += transaction.amount
      } else {
        acc[month].expenses += Math.abs(transaction.amount)
      }
      
      acc[month].net += transaction.amount
      
      return acc
    }, {} as Record<string, {month: string, income: number, expenses: number, net: number}>)
    
    // Convert to array sorted by date
    const months = Object.values(monthlyTotals).sort((a, b) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime()
    })
    
    return months
  } catch (error) {
    console.error('Failed to fetch monthly totals:', error)
    throw new Error('Failed to fetch monthly transaction totals')
  }
}

/**
 * Get category-wise transaction totals for the current month
 */
export async function getCategoryTotals(period: 'current-month' | 'last-month' | 'year-to-date' = 'current-month') {
  try {
    await ensureUserExists()
    
    const currentDate = new Date()
    let startDate: Date
    let endDate: Date = endOfMonth(currentDate)
    
    switch(period) {
      case 'current-month':
        startDate = startOfMonth(currentDate)
        endDate = endOfMonth(currentDate)
        break
      case 'last-month':
        startDate = startOfMonth(subMonths(currentDate, 1))
        endDate = endOfMonth(subMonths(currentDate, 1))
        break
      case 'year-to-date':
        startDate = new Date(currentDate.getFullYear(), 0, 1) // January 1st of current year
        break
    }
    
    // First get all transactions with their categories
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: DEFAULT_USER_ID,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    })
    
    // Initialize our totals
    const incomeByCategory: Record<string, number> = {}
    const expensesByCategory: Record<string, number> = {}
    let totalIncome = 0
    let totalExpenses = 0
    
    // Process all transactions
    transactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Uncategorized'
      const amount = Math.abs(transaction.amount)
      
      if (transaction.amount > 0) {
        // Income
        incomeByCategory[categoryName] = (incomeByCategory[categoryName] || 0) + amount
        totalIncome += amount
      } else {
        // Expense
        expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + amount
        totalExpenses += amount
      }
    })
    
    // Format the category data for charts
    const incomeCategoryData = Object.entries(incomeByCategory).map(([name, value]) => {
      const category = transactions.find(t => 
        t.category?.name === name && t.amount > 0
      )?.category
      
      return {
        name,
        value,
        percentage: (value / totalIncome) * 100,
        color: category?.color || '#6366F1'
      }
    }).sort((a, b) => b.value - a.value)
    
    const expenseCategoryData = Object.entries(expensesByCategory).map(([name, value]) => {
      const category = transactions.find(t => 
        t.category?.name === name && t.amount < 0
      )?.category
      
      return {
        name,
        value,
        percentage: (value / totalExpenses) * 100,
        color: category?.color || '#6366F1'
      }
    }).sort((a, b) => b.value - a.value)
    
    return {
      income: {
        total: totalIncome,
        byCategory: incomeCategoryData
      },
      expenses: {
        total: totalExpenses,
        byCategory: expenseCategoryData
      },
      period
    }
  } catch (error) {
    console.error('Failed to fetch category totals:', error)
    throw new Error('Failed to fetch category totals')
  }
}

/**
 * Get recent transactions for the dashboard
 */
export async function getRecentTransactions(limit = 5) {
  try {
    await ensureUserExists()
    
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: DEFAULT_USER_ID
      },
      include: {
        category: true
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    })
    
    return transactions
  } catch (error) {
    console.error('Failed to fetch recent transactions:', error)
    throw new Error('Failed to fetch recent transactions')
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