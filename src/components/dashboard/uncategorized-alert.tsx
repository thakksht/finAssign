'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { X } from "lucide-react"

type UncategorizedAlertProps = {
  count: number
  amount: number
  type: 'income' | 'expenses'
}

export function UncategorizedAlert({ count, amount, type }: UncategorizedAlertProps) {
  const [dismissed, setDismissed] = useState(false)
  
  if (count === 0 || dismissed) {
    return null
  }

  if (count <= 2 && amount < 100) {
    return null
  }
  
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="mr-3 bg-amber-100 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-sm">Uncategorized {type}</h4>
            <p className="text-xs text-amber-700">
              {count} {type} ({formatCurrency(amount)}) don't have categories assigned
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 bg-amber-100 border-amber-200 hover:bg-amber-200"
            onClick={() => window.location.href = "/transactions"}
          >
            Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
