'use server'

import { prisma } from '@/lib/db'
import { getCategoryTotals } from './transaction-actions'
import { revalidatePath } from 'next/cache'

// For now we'll use a hardcoded user ID since we haven't implemented authentication yet
const DEFAULT_USER_ID = 'user123'

type InsightType = 'success' | 'warning' | 'info' | 'alert' | 'error'

type Insight = {
  type: InsightType
  message: string
}

// Define budget limits for major expense categories
// In a real app, these would be user-configurable and stored in the database
const DEFAULT_BUDGET_LIMITS = {
  'Food': 500,
  'Rent': 1500,
  'Utilities': 300,
  'Transportation': 250,
  'Entertainment': 200,
  'Shopping': 300,
  'Healthcare': 200,
  'Travel': 500,
  'Education': 400,
  'Other Expenses': 300
}

/**
 * Get budget vs actual spending for the current month
 */
export async function getBudgetComparison() {
  try {
    // Get actual spending by category for current month
    const categoryData = await getCategoryTotals('current-month')
    const expenses = categoryData.expenses.byCategory
      // Compare with budget limits
    const budgetComparison = Object.entries(DEFAULT_BUDGET_LIMITS).map(([category, budgetLimit]) => {
      // Find actual spending for this category
      const actualSpending = expenses.find(item => item.name === category)?.value || 0
      const percentUsed = ((actualSpending / budgetLimit) * 100)
      
      return {
        category,
        budgeted: budgetLimit,
        actual: actualSpending,
        variance: budgetLimit - actualSpending,
        percentUsed: percentUsed,
        percentUsedFormatted: percentUsed.toFixed(1)
      }
    })
      // Filter to only include categories with actual spending
    const activeCategories = budgetComparison
      .filter(item => item.actual > 0)
      .sort((a, b) => b.actual - a.actual)
    
    // Calculate totals
    const totalBudgeted = Object.values(DEFAULT_BUDGET_LIMITS).reduce((sum, val) => sum + val, 0)
    const totalSpent = expenses.reduce((sum, category) => sum + category.value, 0)
    const percentUsed = ((totalSpent / totalBudgeted) * 100)
    
    return {
      categories: activeCategories,
      totalBudgeted,
      totalSpent,
      totalRemaining: totalBudgeted - totalSpent,
      percentUsed: percentUsed,
      percentUsedFormatted: percentUsed.toFixed(1)
    }
  } catch (error) {
    console.error('Failed to fetch budget comparison:', error)
    throw new Error('Failed to fetch budget comparison')
  }
}

/**
 * Generate basic spending insights based on transaction patterns
 */
export async function getSpendingInsights() {
  try {
    // Get current month spending
    const currentMonth = await getCategoryTotals('current-month')
    
    // Get last month spending for comparison
    const lastMonth = await getCategoryTotals('last-month')
    
    const insights = []
    
    // Compare total spending
    const currentMonthTotal = currentMonth.expenses.total
    const lastMonthTotal = lastMonth.expenses.total
      if (currentMonthTotal > lastMonthTotal && lastMonthTotal > 0) {
      const increasePercent = (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
      insights.push({
        type: 'warning' as const,
        message: `Your spending is up ${increasePercent}% compared to last month.`
      })
    } else if (lastMonthTotal > currentMonthTotal && currentMonthTotal > 0) {
      const decreasePercent = (((lastMonthTotal - currentMonthTotal) / lastMonthTotal) * 100).toFixed(1)
      insights.push({
        type: 'success' as const,
        message: `Your spending is down ${decreasePercent}% compared to last month. Great job!`
      })
    }
    
    // Check for categories with significant increases
    const categories = currentMonth.expenses.byCategory.map(cat => {
      const lastMonthCategory = lastMonth.expenses.byCategory.find(c => c.name === cat.name)
      const lastMonthAmount = lastMonthCategory?.value || 0
      
      const change = lastMonthAmount > 0 
        ? ((cat.value - lastMonthAmount) / lastMonthAmount * 100)
        : 0
        
      return {
        name: cat.name,
        current: cat.value,
        previous: lastMonthAmount,
        percentChange: change,
        amount: cat.value
      }
    })
    
    // Find largest increase
    const increasedCategories = categories
      .filter(cat => cat.percentChange > 20 && cat.previous > 0)
      .sort((a, b) => b.percentChange - a.percentChange)
      if (increasedCategories.length > 0) {
      const largest = increasedCategories[0]
      insights.push({
        type: 'warning' as const,
        message: `${largest.name} spending increased by ${largest.percentChange.toFixed(1)}% from last month.`
      })
    }
      // Find category with highest spending
    const highestCategory = categories
      .sort((a, b) => b.amount - a.amount)[0]
    
    if (highestCategory) {
      insights.push({
        type: 'info' as const,
        message: `Your highest spending category is ${highestCategory.name}.`
      })
    }
      // Check budget thresholds
    const budgetComparison = await getBudgetComparison()
    const overBudgetCategories = budgetComparison.categories
      .filter(cat => cat.percentUsed > 90)
      .sort((a, b) => b.percentUsed - a.percentUsed)
    
    if (overBudgetCategories.length > 0) {
      const cat = overBudgetCategories[0]
      insights.push({
        type: 'alert' as const,
        message: `You've used ${cat.percentUsedFormatted}% of your ${cat.category} budget.`
      })
    }
    
    return insights  } catch (error) {
    console.error('Failed to generate spending insights:', error)
    return [{ type: 'error' as const, message: 'Unable to generate spending insights.' }]
  }
}
