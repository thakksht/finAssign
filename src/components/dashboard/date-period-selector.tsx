'use client'

type DatePeriod = 'current-month' | 'last-month' | 'year-to-date'

type DatePeriodSelectorProps = {
  period: DatePeriod
  onChange: (period: DatePeriod) => void
}

export function DatePeriodSelector({ period, onChange }: DatePeriodSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onChange('current-month')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          period === 'current-month' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        This Month
      </button>
      <button
        onClick={() => onChange('last-month')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          period === 'last-month' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Last Month
      </button>
      <button
        onClick={() => onChange('year-to-date')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          period === 'year-to-date' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Year to Date
      </button>
    </div>
  )
}
