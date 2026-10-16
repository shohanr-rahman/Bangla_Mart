
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/lib/format";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  sellerName: string;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

const statusClasses: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(data.orders ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-brand hover:opacity-70"
        >
          <ArrowLeft size={16} />
          Back to Admin Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Order Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
              All Orders
            </h1>

            <p className="mt-2 text-sm text-ink/60">
              Review customer orders and their current status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-brand hover:bg-brand/5 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {!loading && !error && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <p className="text-sm text-ink/60">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-brand">
                {orders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <p className="text-sm text-ink/60">Pending Orders</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {orders.filter((order) => order.orderStatus === "pending").length}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <span className="loading loading-spinner loading-lg text-brand" />
            <p className="mt-4 text-sm text-ink/60">Loading orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-6">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void loadOrders()}
              className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-black/5 bg-white px-5 py-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-brand/50" />
            <h2 className="mt-4 text-xl font-bold text-ink">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Customer orders will appear here.
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink/50">
                      Order Number
                    </p>
                    <h2 className="mt-1 font-bold text-brand">
                      {order.orderNumber}
                    </h2>
                    <p className="mt-2 text-xs text-ink/50">
                      {new Date(order.createdAt).toLocaleString("en-BD", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Dhaka",
                      })}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      statusClasses[order.orderStatus] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_300px]">
                  <div>
                    <h3 className="font-bold text-ink">
                      Customer Information
                    </h3>

                    <div className="mt-3 space-y-1 text-sm text-ink/70">
                      <p>
                        <span className="font-medium text-ink">Name:</span>{" "}
                        {order.customerName}
                      </p>
                      <p>
                        <span className="font-medium text-ink">Phone:</span>{" "}
                        {order.phone}
                      </p>
                      <p>
                        <span className="font-medium text-ink">Address:</span>{" "}
                        {order.address}, {order.city}
                      </p>
                    </div>

                    <h3 className="mt-6 font-bold text-ink">
                      Ordered Products
                    </h3>

                    <div className="mt-3 space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={`${order.id}-${index}`}
                          className="flex items-start gap-3 rounded-xl bg-sand/60 p-3"
                        >
                          <Package className="mt-1 h-5 w-5 shrink-0 text-brand" />

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-ink">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-ink/60">
                              Seller: {item.sellerName} · Qty: {item.quantity}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-brand">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside className="h-fit rounded-2xl bg-sand/50 p-4">
                    <h3 className="font-bold text-ink">Payment Summary</h3>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-ink/60">Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-ink/60">Delivery</span>
                        <span>
                          {order.deliveryCharge === 0
                            ? "Free"
                            : formatPrice(order.deliveryCharge)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 border-t border-black/10 pt-3">
                        <span className="font-bold text-ink">Total</span>
                        <span className="text-lg font-bold text-brand">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-white p-3 text-sm">
                      <p>
                        <span className="text-ink/60">Payment:</span>{" "}
                        <span className="font-medium capitalize">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </span>
                      </p>

                      <p className="mt-2">
                        <span className="text-ink/60">Payment Status:</span>{" "}
                        <span className="font-medium capitalize">
                          {order.paymentStatus}
                        </span>
                      </p>
                    </div>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
