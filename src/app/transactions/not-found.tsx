import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TransactionNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6 text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Transaction Not Found</h1>
        <p className="text-gray-600 mb-8">
          The transaction you're looking for doesn't exist or has been deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/transactions">
            <Button>Back to Transactions</Button>
          </Link>
          <Link href="/transactions/new">
            <Button variant="outline">Add New Transaction</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
