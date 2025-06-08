"use client";

import { ChartData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyExpenseChartProps {
  data: ChartData[];
}

export const MonthlyExpenseChart = ({ data }: MonthlyExpenseChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), "Amount"]}
              />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
