import { requireRole } from "@/lib/session";

export const metadata = { title: "Seller dashboard" };

export default async function SellerPage() {
  const session = await requireRole(["seller"], "/seller");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Seller dashboard</h1>
      <p className="mt-2 opacity-70">
        Welcome, {session.user.name}. Your products and orders will appear here.
      </p>
    </div>
  );
}