'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { addTransaction, updateTransaction } from "@/lib/actions/transaction-actions"
import { useRouter } from "next/navigation"
import { TransactionFormData, ValidationError, validateField, validateTransactionForm } from "@/lib/validation"

type Category = {
  id: string;
  name: string;
  color: string;
};

type TransactionFormProps = {
  initialData?: {
    id?: string
    amount: number
    description: string
    date: Date
    categoryId?: string | null
  }
  categories: Category[]
  mode: 'create' | 'edit'
}

export function TransactionForm({ initialData, categories, mode = 'create' }: TransactionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationError>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState({
    amount: initialData?.amount ? initialData.amount.toString() : '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    categoryId: initialData?.categoryId || ''
  })
  const autoCategorize = (description: string, isIncome: boolean) => {
    const desc = description.toLowerCase();
    
    const expenseKeywords: Record<string, string[]> = {
      'Food': ['grocery', 'groceries', 'restaurant', 'dinner', 'lunch', 'breakfast', 'food', 'takeout', 'meal', 'cafe', 'coffee'],
      'Rent': ['rent', 'housing', 'mortgage', 'apartment'],
      'Utilities': ['utility', 'utilities', 'electric', 'electricity', 'gas', 'water', 'internet', 'wifi', 'phone', 'bill', 'cable'],
      'Transportation': ['transport', 'transportation', 'train', 'bus', 'subway', 'taxi', 'uber', 'lyft', 'gas', 'fuel', 'car'],
      'Entertainment': ['movie', 'entertainment', 'theatre', 'concert', 'subscription', 'streaming', 'netflix', 'disney', 'game', 'show'],
      'Healthcare': ['doctor', 'medical', 'hospital', 'health', 'dentist', 'therapy', 'medicine', 'prescription', 'pharmacy'],
      'Shopping': ['shopping', 'clothes', 'store', 'amazon', 'online', 'retail', 'purchase', 'mall', 'shoe'],
      'Travel': ['travel', 'vacation', 'hotel', 'flight', 'airbnb', 'booking', 'trip']
    };

    const incomeKeywords: Record<string, string[]> = {
      'Salary': ['salary', 'wage', 'paycheck', 'payment', 'direct deposit', 'work', 'job'],
      'Freelance': ['freelance', 'client', 'project', 'consulting', 'gig', 'contract'],
      'Gifts': ['gift', 'present', 'birthday', 'holiday'],
      'Investments': ['dividend', 'interest', 'investment', 'stocks', 'bonds', 'crypto', 'stock'],
      'Refunds': ['refund', 'reimbursement', 'return', 'cashback']
    };

    const keywordMap = isIncome ? incomeKeywords : expenseKeywords;
    
    for (const [category, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        const matchedCategory = categories.find(c => c.name === category);
        if (matchedCategory) {
          return matchedCategory.id;
        }
      }
    }
    
    return null;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const fieldError = validateField(name as keyof TransactionFormData, formData[name as keyof TransactionFormData])
    setErrors(prev => ({ ...prev, [name]: fieldError }))
    
    if (name === 'description' && formData.amount && !formData.categoryId) {
      const isIncome = Number(formData.amount) > 0;
      const suggestedCategoryId = autoCategorize(e.target.value, isIncome);
      
      if (suggestedCategoryId) {
        setFormData(prev => ({
          ...prev,
          categoryId: suggestedCategoryId
        }));
      }
    }
  }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      const fieldError = validateField(name as keyof TransactionFormData, value)
      setErrors(prev => ({ ...prev, [name]: fieldError }))
    }
    
    if (name === 'description') {
      handleDescriptionChange(value);
    }
    
    if (error) {
      setError(null)
    }
  }
  
  const validateForm = (): boolean => {
    setTouched({
      amount: true,
      description: true,
      date: true
    })
  
    const validationErrors = validateTransactionForm(formData)
    setErrors(validationErrors)
    
    const isValid = Object.keys(validationErrors).length === 0
    
    if (!isValid) {
      setError('Please fix the errors in the form before submitting.')
    }
    
    return isValid
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const transactionData = {
        amount: Number(formData.amount),
        description: formData.description.trim(),
        date: new Date(formData.date),
        categoryId: formData.categoryId || null,
      };

      if (isNaN(transactionData.amount)) {
        throw new Error('Invalid amount value');
      }
      
      if (mode === 'create') {
        await addTransaction(transactionData);
      } else if (mode === 'edit' && initialData?.id) {
        await updateTransaction(initialData.id, transactionData);
      } else {
        throw new Error('Invalid form mode or missing transaction ID');
      }

      router.refresh()
      router.push('/transactions')
    } catch (err) {
      console.error('Transaction submission error:', err)
      
      if (err instanceof Error) {
        if (err.message.includes('Prisma')) {
          setError('Database error occurred. Please try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const validationErrors = validateTransactionForm(formData);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        setTouched({ amount: true, description: true, date: true });
      }
    }
  }, [mode, initialData, formData]);
  const expenseKeywords = ['food', 'rent', 'bills', 'utilities', 'transportation', 'entertainment', 
                          'healthcare', 'shopping', 'travel', 'education', 'expense', 'other expense'];
                           
  const incomeKeywords = ['salary', 'freelance', 'gift', 'investment', 'refund', 'income', 'other income'];
  
  const expenseCategories = categories.filter(cat => {
    const lowerCaseName = cat.name.toLowerCase();
    return expenseKeywords.some(keyword => lowerCaseName.includes(keyword));
  });
  
  const incomeCategories = categories.filter(cat => {
    const lowerCaseName = cat.name.toLowerCase();
    return incomeKeywords.some(keyword => lowerCaseName.includes(keyword));
  });
  
  if (expenseCategories.length === 0 && incomeCategories.length === 0) {
    categories.forEach((cat, index) => {
      if (index % 2 === 0) {
        expenseCategories.push(cat);
      } else {
        incomeCategories.push(cat);
      }
    });
  }
  
  useEffect(() => {
    if (formData.amount && !formData.categoryId && categories.length > 0) {
      const isIncome = Number(formData.amount) > 0;
      
      const relevantCategories = isIncome ? incomeCategories : expenseCategories;
      
      if (relevantCategories.length > 0) {
        setFormData(prev => ({
          ...prev,
          categoryId: relevantCategories[0].id
        }));
      }
    }
  }, [formData.amount]);
  const isIncome = formData.amount && Number(formData.amount) > 0;
  
  const handleDescriptionChange = (description: string) => {
    if (!formData.categoryId && description.length > 3) {
      const desc = description.toLowerCase();
      
      let suggestedCategory = null;
      
      if (isIncome) {
        suggestedCategory = incomeCategories.find(cat => 
          cat.name.toLowerCase().includes(desc) || desc.includes(cat.name.toLowerCase())
        );
      } else {
        suggestedCategory = expenseCategories.find(cat => 
          cat.name.toLowerCase().includes(desc) || desc.includes(cat.name.toLowerCase())
        );
      }
      
      if (suggestedCategory) {
        setFormData(prev => ({
          ...prev,
          categoryId: suggestedCategory.id
        }));
      }
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Transaction' : 'Edit Transaction'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {Object.keys(errors).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg mb-2 text-sm">
              <p className="font-medium">Please fix the following issues:</p>
              <ul className="list-disc pl-5 mt-1">
                {errors.amount && <li>{errors.amount}</li>}
                {errors.description && <li>{errors.description}</li>}
                {errors.date && <li>{errors.date}</li>}
              </ul>
            </div>
          )}
            <div className="space-y-2">            <label htmlFor="amount" className="text-sm font-medium flex items-center justify-between">
              <span>Amount</span>
              {touched.amount && !errors.amount && (
                <span className="text-green-500 text-xs">✓ Valid</span>
              )}
            </label>
            <Input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
              required
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              className={`transition-all duration-200 ${
                errors.amount 
                  ? "border-red-500 bg-red-50" 
                  : touched.amount 
                    ? "border-green-500 bg-green-50" 
                    : ""
              }`}
            />
            {errors.amount && (
              <p id="amount-error" className="text-sm text-red-600 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.amount}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Use negative values for expenses (e.g., -50.00) and positive for income
            </p>
          </div>
          
          <div className="space-y-2">            <label htmlFor="description" className="text-sm font-medium flex items-center justify-between">
              <span>Description</span>
              {touched.description && !errors.description && (
                <span className="text-green-500 text-xs">✓ Valid</span>
              )}
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Groceries"
              required
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
              className={`transition-all duration-200 ${
                errors.description 
                  ? "border-red-500 bg-red-50" 
                  : touched.description 
                    ? "border-green-500 bg-green-50" 
                    : ""
              }`}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-red-600 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.description}
              </p>
            )}
          </div>
            <div className="space-y-2">            <label htmlFor="date" className="text-sm font-medium flex items-center justify-between">
              <span>Date</span>
              {touched.date && !errors.date && (
                <span className="text-green-500 text-xs">✓ Valid</span>
              )}
            </label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "date-error" : undefined}
              className={`transition-all duration-200 ${
                errors.date 
                  ? "border-red-500 bg-red-50" 
                  : touched.date 
                    ? "border-green-500 bg-green-50" 
                    : ""
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p id="date-error" className="text-sm text-red-600 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.date}
              </p>
            )}
          </div>
            <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium flex items-center justify-between">
              <span>Category</span>
              {touched.categoryId && !errors.categoryId && (
                <span className="text-green-500 text-xs">✓ Valid</span>
              )}
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.categoryId 
                  ? "border-red-500 bg-red-50 focus:ring-red-200" 
                  : touched.categoryId 
                    ? "border-green-500 bg-green-50 focus:ring-green-200" 
                    : "border-gray-300 focus:ring-blue-200"
              }`}
            >
              <option value="">-- Select Category --</option>
              
              {isIncome ? (
                <>
                  <optgroup label="Income Categories">
                    {incomeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                  {expenseCategories.length > 0 && (
                    <optgroup label="Expense Categories">
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </>
              ) : (
                <>
                  <optgroup label="Expense Categories">
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                  {incomeCategories.length > 0 && (
                    <optgroup label="Income Categories">
                      {incomeCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </>
              )}
            </select>
            {errors.categoryId && (
              <p id="category-error" className="text-sm text-red-600 mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.categoryId}
              </p>
            )}
          </div>
        </CardContent>
        
        <div className="px-6 pb-2">
          {Object.keys(touched).length > 0 && Object.keys(errors).length === 0 && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>All fields look good! You can submit the form.</span>
            </div>
          )}
        </div>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'create' ? 'Adding...' : 'Updating...'}
              </>
            ) : (
              mode === 'create' ? 'Add Transaction' : 'Update Transaction'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}