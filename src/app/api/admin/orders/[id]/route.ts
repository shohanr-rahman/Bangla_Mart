
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  let mongoSession: mongoose.ClientSession | undefined;

  try {
    await requireRole(["admin"], "/admin");

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid order ID." },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("orderStatus" in body) ||
      typeof body.orderStatus !== "string" ||
      !allowedStatuses.includes(body.orderStatus as AllowedStatus)
    ) {
      return NextResponse.json(
        { message: "Invalid order status." },
        { status: 400 },
      );
    }

    const newStatus = body.orderStatus as AllowedStatus;

    await connectDB();

    mongoSession = await mongoose.startSession();

    let updatedOrder:
      | {
          id: string;
          orderNumber: string;
          orderStatus: string;
        }
      | undefined;

    let failureMessage = "";

    await mongoSession.withTransaction(async () => {
      const order = await Order.findById(id).session(mongoSession!);

      if (!order) {
        failureMessage = "Order not found.";
        return;
      }

      if (order.orderStatus === newStatus) {
        updatedOrder = {
          id: String(order._id),
          orderNumber: order.orderNumber,
          orderStatus: order.orderStatus,
        };
        return;
      }

      if (
        order.orderStatus === "cancelled" ||
        order.orderStatus === "delivered"
      ) {
        failureMessage = `A ${order.orderStatus} order cannot be changed.`;
        return;
      }

      if (
        newStatus === "processing" &&
        order.orderStatus !== "confirmed"
      ) {
        failureMessage = "Confirm the order before processing it.";
        return;
      }

      if (
        newStatus === "shipped" &&
        order.orderStatus !== "processing"
      ) {
        failureMessage = "Process the order before shipping it.";
        return;
      }

      if (
        newStatus === "delivered" &&
        order.orderStatus !== "shipped"
      ) {
        failureMessage = "Ship the order before marking it delivered.";
        return;
      }

      if (newStatus === "cancelled") {
        for (const item of order.items) {
          if (!mongoose.isValidObjectId(item.productId)) {
            throw new Error(
              `Invalid product ID in order ${order.orderNumber}.`,
            );
          }

          const restoredProduct = await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } },
            { session: mongoSession! },
          );

          if (!restoredProduct) {
            throw new Error(
              `Product ${item.name} was not found while restoring stock.`,
            );
          }
        }
      }

      order.orderStatus = newStatus;
      await order.save({ session: mongoSession! });

      updatedOrder = {
        id: String(order._id),
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
      };
    });

    if (failureMessage) {
      const status = failureMessage === "Order not found." ? 404 : 409;

      return NextResponse.json(
        { message: failureMessage },
        { status },
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order could not be updated." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to update order status." },
      { status: 500 },
    );
  } finally {
    await mongoSession?.endSession();
  }
}

