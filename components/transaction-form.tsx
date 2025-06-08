"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types";
import { transactionFormSchema } from "@/lib/validations/transaction";
import { useRouter } from "next/navigation";

interface TransactionFormProps {
  initialData?: Transaction;
  onSuccess?: () => void;
}

type FormData = z.infer<typeof transactionFormSchema>;

export const TransactionForm = ({ initialData, onSuccess }: TransactionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData;

  const form = useForm<FormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialData ? {
      amount: initialData.amount,
      date: new Date(initialData.date),
      description: initialData.description,
    } : {
      amount: undefined,
      date: new Date(),
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      if (isEditing) {
        await axios.patch(`/api/transactions/${initialData.id}`, data);
        toast.success("Transaction updated!");
      } else {
        await axios.post("/api/transactions", data);
        toast.success("Transaction added!");
        form.reset();
      }
      
      router.refresh();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  disabled={isLoading}
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={isLoading}
                  value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                  onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter description"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isEditing ? "Update Transaction" : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
};
