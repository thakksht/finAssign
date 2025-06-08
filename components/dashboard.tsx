"use client";

import { Transaction, ChartData } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { TransactionList } from "@/components/transaction-list";
import { MonthlyExpenseChart } from "@/components/monthly-expense-chart";
import { NewTransactionDialog } from "@/components/new-transaction-dialog";

export const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch transactions
      const transactionsResponse = await axios.get("/api/transactions");
      setTransactions(transactionsResponse.data);
      
      // Fetch chart data
      const chartResponse = await axios.get("/api/transactions/chart");
      setChartData(chartResponse.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">FinSight Dashboard</h1>
        <NewTransactionDialog />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          Loading...
        </div>
      ) : (
        <>
          <MonthlyExpenseChart data={chartData} />
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <TransactionList transactions={transactions} />
          </div>
        </>
      )}
    </div>
  );
};
