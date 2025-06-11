import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent } from '@/components/ui/card'

export default function TransactionsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-36 mt-4 md:mt-0 animate-pulse"></div>
      </div>
      
      <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
      
      <div className="mt-8">
        <div className="h-7 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-3">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}