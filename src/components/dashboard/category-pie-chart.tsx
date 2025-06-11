'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

type CategoryData = {
  name: string
  value: number
  percentage: number
  color: string
}

type CategoryPieChartProps = {
  data: CategoryData[]
  total: number
  title: string
  emptyMessage?: string
}

export function CategoryPieChart({ data, total, title, emptyMessage = "No data available" }: CategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  if (!data.length) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[250px] text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{emptyMessage}</p>
          <p className="text-xs text-gray-400 mt-2">Add transactions with categories to see a breakdown</p>
          <a href="/transactions/new" className="mt-4 text-sm text-primary hover:underline">
            Add new transaction
          </a>
        </CardContent>
      </Card>
    );
  }
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-lg border">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            ></span>
            <p className="font-medium">{data.name}</p>
          </div>
          <p className="text-gray-700 font-semibold">{formatCurrency(data.value)}</p>
          <p className="text-gray-500 text-sm">{data.percentage.toFixed(1)}% of total</p>
          {data.count && (
            <p className="text-gray-500 text-xs mt-1">{data.count} transaction{data.count !== 1 ? 's' : ''}</p>
          )}
        </div>
      );
    }
    
    return null;
  };
    return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <span className="text-lg font-bold">
            {formatCurrency(total)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={85}
                innerRadius={55}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                animationBegin={200}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    strokeWidth={activeIndex === index ? 3 : 0}
                    stroke="#fff"
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconSize={10}
                iconType="circle"
                formatter={(value, entry: any) => {
                  // Truncate long category names
                  const displayName = value.length > 12 ? `${value.substring(0, 10)}...` : value;
                  return (
                    <span className="text-sm font-medium">
                      {displayName} <span className="text-xs text-gray-500 font-normal">
                        ({entry.payload.percentage.toFixed(1)}%)
                      </span>
                    </span>
                  );
                }}
                wrapperStyle={{ paddingLeft: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {data.length > 0 && (
            <div className="absolute top-1/2 left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="font-medium text-sm text-gray-600">Total</p>
              <p className="font-semibold">{formatCurrency(total)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
