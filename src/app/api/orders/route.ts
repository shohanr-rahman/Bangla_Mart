
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export const runtime = "nodejs";

type RequestedItem = {
  productId: string;
  quantity: number;
};

type CheckoutBody = {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: RequestedItem[];
};

function isValidText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "অর্ডার করতে প্রথমে সাইন ইন করুন।" },
      { status: 401 }
    );
  }

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json(
      { message: "অনুরোধের তথ্য সঠিক নয়।" },
      { status: 400 }
    );
  }

  if (
    !isValidText(body.customerName, 100) ||
    !isValidText(body.phone, 20) ||
    !isValidText(body.address, 500) ||
    !isValidText(body.city, 100)
  ) {
    return NextResponse.json(
      { message: "নাম, ফোন নম্বর, ঠিকানা ও শহরের সঠিক তথ্য দিন।" },
      { status: 400 }
    );
  }

  if (
    !Array.isArray(body.items) ||
    body.items.length === 0 ||
    body.items.length > 50
  ) {
    return NextResponse.json(
      { message: "আপনার কার্টে কোনো পণ্য নেই অথবা পণ্যের সংখ্যা সঠিক নয়।" },
      { status: 400 }
    );
  }

  const quantities = new Map<string, number>();

  for (const item of body.items) {
    if (
      !item ||
      typeof item.productId !== "string" ||
      !mongoose.isValidObjectId(item.productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      return NextResponse.json(
        { message: "কার্টে পণ্যের তথ্য সঠিক নয়।" },
        { status: 400 }
      );
    }

    const id = item.productId;

    quantities.set(id, (quantities.get(id) ?? 0) + item.quantity);
  }

  for (const quantity of quantities.values()) {
    if (quantity > 100) {
      return NextResponse.json(
        { message: "একটি পণ্যের সর্বোচ্চ অর্ডার পরিমাণ ১০০টি।" },
        { status: 400 }
      );
    }
  }

  let mongoSession: mongoose.ClientSession | undefined;

  try {
    await connectDB();

    mongoSession = await mongoose.startSession();

    let createdOrder:
      | {
          id: string;
          orderNumber: string;
          total: number;
          orderStatus: string;
        }
      | undefined;

    await mongoSession.withTransaction(async () => {
      const orderItems: {
        productId: string;
        name: string;
        slug: string;
        image: string;
        price: number;
        quantity: number;
        sellerId: string;
        sellerName: string;
      }[] = [];

      let subtotal = 0;

      for (const [productId, quantity] of quantities.entries()) {
        const product = await Product.findOneAndUpdate(
          {
            _id: productId,
            status: "active",
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          {
            new: true,
            session: mongoSession,
          }
        );

        if (!product) {
          throw new Error(`STOCK_UNAVAILABLE:${productId}`);
        }

        subtotal += product.price * quantity;

        orderItems.push({
          productId: String(product._id),
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] ?? "",
          price: product.price,
          quantity,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
        });
      }

      // আপাতত ডেলিভারি চার্জ ০ টাকা।
      // পরে নির্ধারিত ডেলিভারি চার্জ এখানে যুক্ত করা যাবে।
      const deliveryCharge = 0;
      const total = subtotal + deliveryCharge;

      const orderNumber = `BM-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

      const [order] = await Order.create(
        [
          {
            orderNumber,
            buyerId: session.user.id,
            customerName: body.customerName.trim(),
            phone: body.phone.trim(),
            address: body.address.trim(),
            city: body.city.trim(),
            items: orderItems,
            subtotal,
            deliveryCharge,
            total,
            paymentMethod: "cod",
            paymentStatus: "pending",
            orderStatus: "pending",
          },
        ],
        { session: mongoSession }
      );

      createdOrder = {
        id: String(order._id),
        orderNumber: order.orderNumber,
        total: order.total,
        orderStatus: order.orderStatus,
      };
    });

    if (!createdOrder) {
      throw new Error("ORDER_CREATION_FAILED");
    }

    return NextResponse.json(
      {
        message: "আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে।",
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("STOCK_UNAVAILABLE:")
    ) {
      return NextResponse.json(
        {
          message:
            "একটি বা একাধিক পণ্যের স্টক পর্যাপ্ত নেই, অথবা পণ্যটি আর উপলভ্য নয়। কার্ট আপডেট করে আবার চেষ্টা করুন।",
        },
        { status: 409 }
      );
    }

    console.error("Order creation failed:", error);

    return NextResponse.json(
      {
        message: "অর্ডার তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  } finally {
    if (mongoSession) {
      await mongoSession.endSession();
    }
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please sign in to view your orders." },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      buyerId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    const formattedOrders = orders.map((order) => ({
      id: String(order._id),
      orderNumber: order.orderNumber,
      items: order.items.map((item) => ({
        name: item.name,
        slug: item.slug,
        image: item.image ?? "",
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
      deliveryCharge: order.deliveryCharge,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      { message: "Failed to load orders." },
      { status: 500 }
    );
  }
}
