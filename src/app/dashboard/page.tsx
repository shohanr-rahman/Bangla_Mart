
import { redirect } from "next/navigation";
import Link from "next/link";

import { getRole, requireRole } from "@/lib/session";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requireRole(
    ["buyer", "seller", "admin"],
    "/dashboard"
  );

  const role = getRole(session.user);

  if (role === "seller") redirect("/seller");
  if (role === "admin") redirect("/admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">
        Hello, {session.user.name}
      </h1>

      <p className="mt-2 opacity-70">
        You are signed in as a{" "}
        <span className="font-semibold">buyer</span>. Your orders will
        appear here.
      </p>

      <div className="mt-6">
        <Link
          href="/my-orders"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          My Orders
        </Link>
      </div>
    </div>
  );
}
