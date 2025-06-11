import { Suspense } from 'react'
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart'
import { CategoryDetails } from '@/components/dashboard/category-details'
import { MonthlySummary } from '@/components/dashboard/monthly-summary'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { BudgetComparison } from '@/components/dashboard/budget-comparison'
import { SpendingInsights } from '@/components/dashboard/spending-insights'
import { UncategorizedAlert } from '@/components/dashboard/uncategorized-alert'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { Card, CardContent } from '@/components/ui/card'
import { 
  getCategoryTotals, 
  getMonthlyTransactionTotals, 
  getRecentTransactions 
} from '@/lib/actions/transaction-actions'
import {
  getBudgetComparison,
  getSpendingInsights
} from '@/lib/actions/budget-actions'
import { ErrorBoundary } from '@/components/error-boundary'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { period?: string; categoryType?: string }
}) {
  const period = (searchParams.period || 'current-month') as 'current-month' | 'last-month' | 'year-to-date'
  const categoryType = (searchParams.categoryType || 'expenses') as 'income' | 'expenses'
  
  // Fetch all data for dashboard
  const categoryData = await getCategoryTotals(period)
  const monthlyData = await getMonthlyTransactionTotals()
  const recentTransactions = await getRecentTransactions(5)
  const budgetData = await getBudgetComparison()
  const insights = await getSpendingInsights()
  
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
              <div className="grid grid-cols-1 gap-6">                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Category Breakdown</h2>
                  <CategorySelector currentType={categoryType} period={period} />
                </div>
                
                {/* Uncategorized alert */}
                <UncategorizedAlert 
                  count={categoryData[categoryType].uncategorized.count}
                  amount={categoryData[categoryType].uncategorized.amount}
                  type={categoryType}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategoryPieChart 
                    data={categoryData[categoryType].byCategory} 
                    total={categoryData[categoryType].total}
                    title={`${categoryType === 'income' ? 'Income' : 'Expenses'} by Category (${periodName})`}
                    emptyMessage={`No ${categoryType} in this period`}
                  />
                  <CategoryDetails 
                    data={categoryData[categoryType].byCategory} 
                    title={`Top ${categoryType === 'income' ? 'Income' : 'Expense'} Categories`}
                    emptyMessage={`No ${categoryType} categories to show`}
                  />
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Budget and Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ErrorBoundary fallback={<p className="text-red-500">Error loading budget data</p>}>
            <Suspense fallback={<LoadingIndicator message="Loading budget data..." />}>
              <BudgetComparison data={budgetData} />
            </Suspense>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<p className="text-red-500">Error loading insights</p>}>
            <Suspense fallback={<LoadingIndicator message="Generating insights..." />}>
              <SpendingInsights insights={insights} />
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
    <div className="flex items-center">
      <div className="bg-muted inline-flex rounded-md p-1 shadow-sm">
        <a 
          href={`/dashboard?period=${period}&categoryType=expenses`} 
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentType === 'expenses' 
              ? 'bg-background shadow-sm text-red-600' 
              : 'text-muted-foreground hover:text-gray-700'
          }`}
        >
          Expenses
        </a>
        <a 
          href={`/dashboard?period=${period}&categoryType=income`} 
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentType === 'income' 
              ? 'bg-background shadow-sm text-green-600' 
              : 'text-muted-foreground hover:text-gray-700'
          }`}
        >
          Income
        </a>
      </div>
    </div>
  );
}
