import { z } from "zod";

export const transactionFormSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .refine((val) => !isNaN(val), {
      message: "Amount must be a valid number",
    }),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Date is required",
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description cannot exceed 255 characters"),
});
