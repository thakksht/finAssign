import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET() {
  try {
    // Check Redis cache first
    const cachedChartData = await redis.get("monthly_chart_data");
    
    if (cachedChartData) {
      return NextResponse.json(JSON.parse(cachedChartData));
    }
    
    // If not cached, get from database
    const transactions = await db.transaction.findMany({
      orderBy: {
        date: "asc",
      },
    });
    
    // Process data to get monthly totals
    const monthlyData = transactions.reduce((acc: Record<string, number>, transaction) => {
      const month = format(new Date(transaction.date), 'MMM yyyy');
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      
      acc[month] += transaction.amount;
      return acc;
    }, {});
    
    // Convert to chart format
    const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount,
    }));
    
    // Cache the results
    await redis.set("monthly_chart_data", JSON.stringify(chartData), "EX", 60 * 5); // Cache for 5 minutes
    
    return NextResponse.json(chartData);
  } catch (error) {
    console.error("[CHART_DATA_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
