import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getTransactions } from '@/lib/actions/transaction-actions'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionChart } from '@/components/transactions/transaction-chart'

export default async function TransactionsPage() {
  const transactions = await getTransactions()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Link href="/transactions/new" className="mt-4 md:mt-0">
          <Button>Add New Transaction</Button>
        </Link>
      </div>
      <TransactionChart transactions={transactions} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  )
}