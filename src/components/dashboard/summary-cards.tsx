'use client'

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from "lucide-react"

type SummaryCardsProps = {
  income: number
  expenses: number
  net: number
}

export function SummaryCards({ income, expenses, net }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-500">Income</p>
              <h2 className="text-2xl font-bold text-green-600">{formatCurrency(income)}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          {/*<div className="mt-2 text-xs text-gray-500">
            <span className="text-green-600 font-medium">+12%</span> from last month
          </div>*/}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-500">Expenses</p>
              <h2 className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          {/*<div className="mt-2 text-xs text-gray-500">
            <span className="text-red-600 font-medium">+8%</span> from last month
          </div>*/}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-500">Net Balance</p>
              <h2 className={`text-2xl font-bold ${net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(net)}
              </h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowRightIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {/*<div className="mt-2 text-xs text-gray-500">
            <span className={net >= 0 ? 'text-blue-600 font-medium' : 'text-red-600 font-medium'}>
              {net >= 0 ? '+' : ''}5%
            </span> from last month
          </div>*/}
        </CardContent>
      </Card>
    </div>
  )
}
