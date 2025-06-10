'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { DatePeriodSelector } from '@/components/dashboard/date-period-selector'

type DashboardClientProps = {
  children: React.ReactNode
}

export function DashboardClient({ children }: DashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const period = searchParams.get('period') as 'current-month' | 'last-month' | 'year-to-date' || 'current-month'
  
  const handlePeriodChange = (newPeriod: 'current-month' | 'last-month' | 'year-to-date') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', newPeriod)
    router.push(`/dashboard?${params.toString()}`)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <DatePeriodSelector 
          period={period} 
          onChange={handlePeriodChange} 
        />
      </div>
      
      {children}
    </div>
  )
}
