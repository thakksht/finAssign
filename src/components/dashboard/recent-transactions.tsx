'use client'

import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Category = {
  id: string
  name: string
  color: string
}

type Transaction = {
  id: string
  amount: number
  description: string
  date: Date
  createdAt: Date
  updatedAt: Date
  categoryId?: string | null
  category?: Category | null
}

type RecentTransactionsProps = {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500 mb-4">No transactions found</p>
          <Link 
            href="/transactions/new" 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Add Your First Transaction
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>Recent Transactions</span>
          <Link 
            href="/transactions" 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View All &rarr;
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    <Link href={`/transactions/${transaction.id}/edit`} className="hover:underline">
                      {transaction.description}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {transaction.category ? (
                      <span className="inline-flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: transaction.category.color }}
                        ></span>
                        {transaction.category.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
                    <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
