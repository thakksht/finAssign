'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { deleteTransaction } from '@/lib/actions/transaction-actions'

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

type TransactionListProps = {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(id)
      setError(null)
      
      try {
        await deleteTransaction(id)
      } catch (err) {
        console.error(err)
        setError('Failed to delete transaction')
      } finally {
        setIsDeleting(null)
      }
    }
  }

  if (transactions.length === 0) {
    return (
      <Card className="text-center p-8 bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-gray-500">No transactions found.</p>
          <Link href="/transactions/new" className="inline-block mt-4">
            <Button>Add Your First Transaction</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link href={`/transactions/${transaction.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      disabled={isDeleting === transaction.id}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      {isDeleting === transaction.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}