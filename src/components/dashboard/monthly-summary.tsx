'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts"
import { useState } from "react"

type MonthlyData = {
  month: string
  income: number
  expenses: number
  net: number
}

type MonthlySummaryProps = {
  data: MonthlyData[]
}

export function MonthlySummary({ data }: MonthlySummaryProps) {
  const [activeType, setActiveType] = useState<'all' | 'income' | 'expense' | 'net'>('all')
  
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No transaction data available</p>
        </CardContent>
      </Card>
    )
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <h6 className="font-semibold mb-2">{label}</h6>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span className="font-medium">{entry.name}:</span>
              <span>{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Generate chart data based on the active type
  const getChartData = () => {
    switch (activeType) {
      case 'income':
        return data.map(month => ({
          month: month.month,
          Income: month.income
        }));
      case 'expense':
        return data.map(month => ({
          month: month.month,
          Expenses: month.expenses
        }));
      case 'net':
        return data.map(month => ({
          month: month.month,
          Net: month.net
        }));
      case 'all':
      default:
        return data.map(month => ({
          month: month.month,
          Income: month.income,
          Expenses: month.expenses,
          Net: month.net
        }));
    }
  };
  
  const chartData = getChartData();
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Monthly Summary</CardTitle>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveType('all')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeType === 'all' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveType('income')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeType === 'income' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setActiveType('expense')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeType === 'expense' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveType('net')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeType === 'net' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Net
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              {activeType === 'all' || activeType === 'income' ? (
                <Bar 
                  dataKey="Income" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  name="Income" 
                />
              ) : null}
              {activeType === 'all' || activeType === 'expense' ? (
                <Bar 
                  dataKey="Expenses" 
                  fill="#EF4444" 
                  radius={[4, 4, 0, 0]} 
                  name="Expenses"
                />
              ) : null}
              {activeType === 'all' || activeType === 'net' ? (
                <Bar 
                  dataKey="Net" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]} 
                  name="Net"
                />
              ) : null}
              <Legend 
                wrapperStyle={{ paddingTop: 15 }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
