import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Redis cache first
    const cachedTransactions = await redis.get("all_transactions");
    
    if (cachedTransactions) {
      return NextResponse.json(JSON.parse(cachedTransactions));
    }
    
    // If not cached, get from database
    const transactions = await db.transaction.findMany({
      orderBy: {
        date: "desc",
      },
    });
    
    // Cache the results
    await redis.set("all_transactions", JSON.stringify(transactions), "EX", 60 * 5); // Cache for 5 minutes
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, date, description } = body;
    
    if (!amount || !date || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    const transaction = await db.transaction.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        description,
      },
    });
    
    // Invalidate cache
    await redis.del("all_transactions");
    await redis.del("monthly_chart_data");
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
