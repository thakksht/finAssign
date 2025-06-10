import { Suspense } from 'react'
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart'
import { MonthlySummary } from '@/components/dashboard/monthly-summary'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { Card, CardContent } from '@/components/ui/card'
import { 
  getCategoryTotals, 
  getMonthlyTransactionTotals, 
  getRecentTransactions 
} from '@/lib/actions/transaction-actions'
import { ErrorBoundary } from '@/components/error-boundary'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string; categoryType?: string }>
}) {
  // Await the searchParams Promise in Next.js 15
  const params = await searchParams
  const period = (params.period || 'current-month') as 'current-month' | 'last-month' | 'year-to-date'
  const categoryType = (params.categoryType || 'expenses') as 'income' | 'expenses'
    // Fetch all data for dashboard
  const categoryData = await getCategoryTotals(period)
  
  // Define the MonthlyData type
  interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
    net: number;
  }
  
  const monthlyData = await getMonthlyTransactionTotals() as MonthlyData[]
  const recentTransactions = await getRecentTransactions(5)
  
  // Calculate net income/expense
  const income = categoryData.income.total
  const expenses = categoryData.expenses.total
  const net = income - expenses
  
  // Get period name for display
  const periodName = {
    'current-month': 'This Month',
    'last-month': 'Last Month',
    'year-to-date': 'Year to Date'
  }[period]
  
  return (
    <DashboardClient>
      <div className="space-y-6">
        <ErrorBoundary fallback={<p className="text-red-500">Error loading summary data</p>}>
          <Suspense fallback={<LoadingIndicator message="Loading summary..." />}>
            {/* Summary Cards - Income, Expenses, Balance */}
            <SummaryCards
              income={income}
              expenses={expenses}
              net={net}
            />
          </Suspense>
        </ErrorBoundary>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorBoundary fallback={<p className="text-red-500">Error loading monthly summary</p>}>
            <Suspense fallback={<LoadingIndicator message="Loading monthly data..." />}>
              <div>
                <MonthlySummary data={monthlyData} />
              </div>
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<p className="text-red-500">Error loading category data</p>}>
            <Suspense fallback={<LoadingIndicator message="Loading categories..." />}>
              <div className="grid grid-cols-1 gap-6">
                <CategorySelector currentType={categoryType} period={period} />
                <CategoryPieChart 
                  data={categoryData[categoryType].byCategory} 
                  total={categoryData[categoryType].total}
                  title={`${categoryType === 'income' ? 'Income' : 'Expenses'} by Category (${periodName})`}
                  emptyMessage={`No ${categoryType} in this period`}
                />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Recent Transactions */}
        <ErrorBoundary fallback={<p className="text-red-500">Error loading transactions</p>}>
          <Suspense fallback={<LoadingIndicator message="Loading transactions..." />}>
            <RecentTransactions transactions={recentTransactions} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardClient>
  )
}

// Loading indicator component
function LoadingIndicator({ message }: { message: string }) {
  return (
    <Card className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
}

// Category type selector component
function CategorySelector({ currentType, period }: { currentType: string, period: string }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-muted inline-flex rounded-md p-1">
        <a 
          href={`/dashboard?period=${period}&categoryType=expenses`} 
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentType === 'expenses' ? 'bg-background shadow-sm' : 'text-muted-foreground'
          }`}
        >
          Expenses
        </a>
        <a 
          href={`/dashboard?period=${period}&categoryType=income`} 
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentType === 'income' ? 'bg-background shadow-sm' : 'text-muted-foreground'
          }`}
        >
          Income
        </a>
      </div>
    </div>
  );
}
