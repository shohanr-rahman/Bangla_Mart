import { requireRole } from "@/lib/session";

export const metadata = { title: "Admin dashboard" };

export default async function AdminPage() {
  const session = await requireRole(["admin"], "/admin");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <p className="mt-2 opacity-70">
        Welcome, {session.user.name}. Sellers, orders and analytics will appear here.
      </p>
    </div>
  );
}