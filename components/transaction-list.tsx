"use client";

import { Transaction } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transaction-form";
import { useRouter } from "next/navigation";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Transaction | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await axios.delete(`/api/transactions/${id}`);
      toast.success("Transaction deleted!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(null);
    }
  };

  const onEditSuccess = () => {
    setIsEditing(null);
    router.refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {format(new Date(transaction.date), "PPP")}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>              <TableCell className="text-right">
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsEditing(transaction)}
                    size="icon"
                    variant="ghost"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(transaction.id)}
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting === transaction.id}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!isEditing} onOpenChange={() => setIsEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {isEditing && (
            <TransactionForm
              initialData={isEditing}
              onSuccess={onEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
