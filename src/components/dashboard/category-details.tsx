'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

type CategoryDetailItem = {
  name: string
  value: number
  percentage: number
  color: string
  count?: number
}

type CategoryDetailsProps = {
  data: CategoryDetailItem[]
  title: string
  emptyMessage?: string
}

export function CategoryDetails({ data, title, emptyMessage = "No data available" }: CategoryDetailsProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px] text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{emptyMessage}</p>
          <p className="text-xs text-gray-400 mt-2">Categories will appear here when you add transactions</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span 
                    className="w-3.5 h-3.5 rounded-full mr-2 flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-sm truncate max-w-[150px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-in-out" 
                  style={{ 
                    width: `${Math.max(item.percentage, 3)}%`, // Minimum 3% width for visibility
                    backgroundColor: item.color
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">{item.percentage.toFixed(1)}% of total</span>
                {item.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {index < data.length - 1 && <hr className="border-gray-100 mt-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
