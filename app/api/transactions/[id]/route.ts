import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("Transaction ID is required", { status: 400 });
    }

    const transaction = await db.transaction.findUnique({
      where: {
        id,
      },
    });

    if (!transaction) {
      return new NextResponse("Transaction not found", { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { amount, date, description } = body;

    if (!id) {
      return new NextResponse("Transaction ID is required", { status: 400 });
    }

    if (!amount && !date && !description) {
      return new NextResponse("At least one field must be provided", { status: 400 });
    }

    const transaction = await db.transaction.update({
      where: {
        id,
      },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description }),
      },
    });

    // Invalidate cache
    await redis.del("all_transactions");
    await redis.del("monthly_chart_data");

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("Transaction ID is required", { status: 400 });
    }

    await db.transaction.delete({
      where: {
        id,
      },
    });

    // Invalidate cache
    await redis.del("all_transactions");
    await redis.del("monthly_chart_data");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TRANSACTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
