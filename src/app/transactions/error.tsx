'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TransactionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-red-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'There was an error loading the transactions data.'}
          </p>
          <div className="flex space-x-4">
            <Button onClick={() => reset()}>Try again</Button>
            <Link href="/transactions">
              <Button variant="outline">Return to Transactions</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}