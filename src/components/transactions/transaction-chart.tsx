'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

type Transaction = {
  id: string
  amount: number
  description: string
  date: Date
}

type TransactionChartProps = {
  transactions: Transaction[]
}

export function TransactionChart({ transactions }: TransactionChartProps) {
  const monthlyData = useMemo(() => {
    const data: Record<string, { month: string, expenses: number, income: number }> = {}
    
    // Define all months to ensure they all appear in the chart
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    
    months.forEach((month, index) => {
      data[month] = { month, expenses: 0, income: 0 }
    })
    
    // Aggregate transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthName = date.toLocaleString('default', { month: 'short' })
      
      if (data[monthName]) {
        if (transaction.amount < 0) {
          data[monthName].expenses += Math.abs(transaction.amount)
        } else {
          data[monthName].income += transaction.amount
        }
      }
    })
    
    // Convert to array for Recharts and sort by month order
    return Object.values(data)
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('$', '')}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}