import { z } from 'zod';

export const TransactionSchema = z.object({
  amount: z
    .string()
    .refine((val) => val.trim() !== '', { message: 'Amount is required' })
    .refine((val) => !isNaN(Number(val)), { message: 'Amount must be a number' })
    .refine((val) => Number(val) !== 0, { message: 'Amount cannot be zero' }),
  description: z
    .string()
    .trim()
    .min(1, { message: 'Description is required' })
    .min(3, { message: 'Description must be at least 3 characters' })
    .max(100, { message: 'Description must be less than 100 characters' }),
  date: z
    .string()
    .refine((val) => val.trim() !== '', { message: 'Date is required' })
    .refine((val) => {
      const selectedDate = new Date(val);
      const now = new Date();
      return selectedDate <= now;
    }, { message: 'Date cannot be in the future' }),
  categoryId: z
    .string()
    .optional()
});

export type TransactionFormData = z.infer<typeof TransactionSchema>;

export type ValidationError = {
  [K in keyof TransactionFormData]?: string;
};

export const validateTransactionForm = (data: Partial<TransactionFormData>): ValidationError => {
  try {
    TransactionSchema.parse(data);
    return {}; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: ValidationError = {};
      
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof TransactionFormData;
        if (path) {
          fieldErrors[path] = err.message;
        }
      });
      
      return fieldErrors;
    }
    return { description: 'Validation failed' };
  }
};

/**
 * @param field 
 * @param value 
 * @returns
 */
export const validateField = (
  field: keyof TransactionFormData, 
  value: string
): string | undefined => {
  try {
    const schema = TransactionSchema.shape[field];
    schema.parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError && error.errors.length > 0) {
      return error.errors[0].message;
    }
    return undefined;
  }
};
