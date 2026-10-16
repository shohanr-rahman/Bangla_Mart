"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
ArrowLeft,
ArrowRight,
Clock,
Package,
ShoppingBag,
Truck,
XCircle,
RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import { formatPrice } from "@/lib/format";
import OrderProgress from "@/components/OrderProgress";

type OrderItem = {
name: string;
slug: string;
image: string;
price: number;
quantity: number;
};

type Order = {
id: string;
orderNumber: string;
items: OrderItem[];
subtotal: number;
deliveryCharge: number;
total: number;
paymentMethod: string;
paymentStatus: string;
orderStatus: string;
createdAt: string;
};

const statusStyles: Record<string, string> = {
pending: "bg-amber-50 text-amber-700",
confirmed: "bg-blue-50 text-blue-700",
processing: "bg-indigo-50 text-indigo-700",
shipped: "bg-purple-50 text-purple-700",
delivered: "bg-green-50 text-green-700",
cancelled: "bg-red-50 text-red-700",
};

const statusLabels: Record<string, string> = {
pending: "Pending",
confirmed: "Confirmed",
processing: "Processing",
shipped: "Shipped",
delivered: "Delivered",
cancelled: "Cancelled",
};

export default function MyOrdersPage() {
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [cancellingId, setCancellingId] = useState<string | null>(null);

const loadOrders = useCallback(async (signal?: AbortSignal) => {
try {
setError("");


  const response = await fetch("/api/orders", {
    method: "GET",
    cache: "no-store",
    signal,
  });

  const data = await response.json();

  if (response.status === 401) {
    window.location.href = "/signin";
    return;
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load orders.");
  }

  setOrders(data.orders ?? []);
} catch (err) {
  if (err instanceof Error && err.name === "AbortError") {
    return;
  }

  setError(
    err instanceof Error
      ? err.message
      : "Something went wrong. Please try again.",
  );
} finally {
  if (!signal?.aborted) {
    setLoading(false);
  }
}


}, []);

useEffect(() => {
const controller = new AbortController();


void loadOrders(controller.signal);

return () => controller.abort();


}, [loadOrders]);

async function cancelOrder(order: Order) {
const confirmed = window.confirm(
`Are you sure you want to cancel order ${order.orderNumber}?`,
);


if (!confirmed) return;

setCancellingId(order.id);

try {
  const response = await fetch(`/api/orders/${order.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "cancel" }),
  });

  const data = await response.json();

  if (response.status === 401) {
    window.location.href = "/signin";
    return;
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not cancel this order.");
  }

  setOrders((currentOrders) =>
    currentOrders.map((item) =>
      item.id === order.id
        ? { ...item, orderStatus: "cancelled" }
        : item,
    ),
  );

  toast.success("Order cancelled successfully.");
} catch (err) {
  toast.error(
    err instanceof Error
      ? err.message
      : "Something went wrong while cancelling the order.",
  );
} finally {
  setCancellingId(null);
}


}

return ( <main className="min-h-screen bg-paper px-4 py-10 sm:py-14"> <div className="mx-auto max-w-5xl"> <div className="mb-8"> <Link
         href="/dashboard"
         className="mb-5 inline-flex items-center gap-2 text-sm text-brand transition hover:opacity-70"
       > <ArrowLeft size={16} />
Back to Dashboard </Link>


      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
        Your purchases
      </p>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        My Orders
      </h1>

      <p className="mt-2 text-sm text-ink/60">
        Track your orders and review your purchase history.
      </p>
    </div>

    {loading && (
      <div className="rounded-3xl border border-black/5 bg-white px-5 py-16 text-center shadow-sm">
        <span className="loading loading-spinner loading-lg text-brand" />
        <p className="mt-4 text-sm text-ink/60">
          Loading your orders...
        </p>
      </div>
    )}

    {!loading && error && (
      <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <p className="font-semibold text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadOrders();
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    )}

    {!loading && !error && orders.length === 0 && (
      <div className="rounded-3xl border border-black/5 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
          <ShoppingBag size={36} />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-ink">
          No orders yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
          You haven&apos;t placed any orders yet. Explore our products
          and find something you love.
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          <ShoppingBag size={18} />
          Explore Products
        </Link>
      </div>
    )}

    {!loading && !error && orders.length > 0 && (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/60">
            You have{" "}
            <span className="font-bold text-ink">{orders.length}</span>{" "}
            {orders.length === 1 ? "order" : "orders"}
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:opacity-70"
          >
            Shop More
            <ArrowRight size={16} />
          </Link>
        </div>

        {orders.map((order) => (
          <article
            key={order.id}
            className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-ink/50">
                  Order Number
                </p>

                <p className="mt-1 break-all font-bold text-brand">
                  {order.orderNumber}
                </p>

                <p className="mt-2 text-xs text-ink/50">
                  {new Intl.DateTimeFormat("en-BD", {
                    dateStyle: "medium",
                    timeZone: "Asia/Dhaka",
                  }).format(new Date(order.createdAt))}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    statusStyles[order.orderStatus] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Truck size={14} />
                  {statusLabels[order.orderStatus] ??
                    order.orderStatus}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs font-medium capitalize text-ink/70">
                  <Clock size={14} />
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <OrderProgress status={order.orderStatus} />

              <h3 className="mb-4 mt-6 text-sm font-bold text-ink">
                Ordered Products
              </h3>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${order.id}-${item.slug}-${index}`}
                    className="flex items-center gap-4"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sand"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-7 w-7 text-brand/40" />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="line-clamp-2 text-sm font-semibold text-ink transition hover:text-brand"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-xs text-ink/50">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-black/5 bg-sand/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xs text-ink/50">
                  Payment:{" "}
                  <span className="font-medium capitalize text-ink/70">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </p>

                <p className="mt-2 text-sm text-ink/60">
                  Total Amount
                </p>

                <p className="text-xl font-bold text-brand">
                  {formatPrice(order.total)}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <Link
                  href={`/order-confirmation?order=${encodeURIComponent(
                    order.orderNumber,
                  )}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  View Order
                  <ArrowRight size={16} />
                </Link>

                {order.orderStatus === "pending" && (
                  <button
                    type="button"
                    disabled={cancellingId === order.id}
                    onClick={() => void cancelOrder(order)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancellingId === order.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {cancellingId === order.id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</main>


);
}
