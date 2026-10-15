"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const ROLE_LABEL: Record<string, string> = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
};

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  function closeMenu() {
    (document.activeElement as HTMLElement | null)?.blur();
  }

  async function handleSignOut() {
    closeMenu();
    await authClient.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  if (isPending) return <div className="skeleton h-10 w-32" />;

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/signin" className="btn btn-ghost btn-sm sm:btn-md">
          Sign in
        </Link>
        <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">
          Sign up
        </Link>
      </div>
    );
  }

  const user = session.user;
  const role = (user as { role?: string }).role ?? "buyer";
  const dashboard =
    role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/dashboard";
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-primary btn-sm text-base sm:btn-md"
        aria-label="Account menu"
      >
        {initial}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-2 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        <li className="pointer-events-none px-3 py-2">
          <span className="block font-semibold">{user.name}</span>
          <span className="block break-all text-xs opacity-60">{user.email}</span>
          <span className="badge badge-primary badge-outline mt-1">
            {ROLE_LABEL[role] ?? role}
          </span>
        </li>
        <li>
          <Link href={dashboard} onClick={closeMenu}>
            Dashboard
          </Link>
        </li>
        <li>
          <button type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}