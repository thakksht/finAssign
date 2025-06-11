'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

type BudgetCategory = {
  category: string
  budgeted: number
  actual: number
  variance: number
  percentUsed: number
  percentUsedFormatted: string
}

type BudgetComparisonProps = {
  data: {
    categories: BudgetCategory[]
    totalBudgeted: number
    totalSpent: number
    totalRemaining: number
    percentUsed: number
    percentUsedFormatted: string
  }
}

export function BudgetComparison({ data }: BudgetComparisonProps) {
  // If no data, show empty state
  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Budget vs. Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-gray-500">No budget data available</p>
        </CardContent>
      </Card>
    )
  }
    // Function to get color based on budget usage percentage
  const getBudgetColor = (percentUsed: number) => {
    if (percentUsed > 100) return 'bg-red-500'
    if (percentUsed > 85) return 'bg-amber-500'
    if (percentUsed > 70) return 'bg-yellow-400'
    return 'bg-green-500'
  }
  
  return (
    <Card className="w-full">      <CardHeader className="pb-2">      <CardTitle className="text-lg">
        <div className="flex items-center justify-between">
          <span>Monthly Budget</span>
          <span className="text-sm font-normal">
            {formatCurrency(data.totalSpent)} of {formatCurrency(data.totalBudgeted)} ({data.percentUsedFormatted}%)
          </span>
        </div>
      </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getBudgetColor(data.percentUsed)}`}
              style={{ width: `${Math.min(data.percentUsed, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {data.categories.slice(0, 5).map((item) => (
            <div key={item.category} className="space-y-1">              <div className="flex items-center justify-between text-sm">
                <span>{item.category}</span>
                <span className="font-medium">
                  {formatCurrency(item.actual)} of {formatCurrency(item.budgeted)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBudgetColor(item.percentUsed)}`}
                  style={{ width: `${Math.min(item.percentUsed, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium">Remaining budget</span>
          <span className={`font-medium ${data.totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.totalRemaining)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
