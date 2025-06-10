import { TransactionForm } from '@/components/transactions/transaction-form'
import { getTransaction, getCategories } from '@/lib/actions/transaction-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditTransactionPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const transactionId = resolvedParams.id
    try {
    const transaction = await getTransaction(transactionId)
    const categories = await getCategories()
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/transactions" className="text-blue-600 hover:underline inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Transactions
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Edit Transaction</h1>
          <p className="text-gray-600 mt-2">Update the details of your transaction</p>
        </div>        <TransactionForm 
          mode="edit"
          initialData={{
            id: transaction.id,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date,
            categoryId: transaction.categoryId
          }}
          categories={categories}
        />
      </div>
    )
  } catch (error) {
    notFound()
  }
}