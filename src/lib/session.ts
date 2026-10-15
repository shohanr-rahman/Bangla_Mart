import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export type Role = "buyer" | "seller" | "admin";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function getRole(user: unknown): Role {
  const role = (user as { role?: string }).role;
  return role === "seller" || role === "admin" ? role : "buyer";
}

// login না থাকলে Sign In-এ, role না মিললে Forbidden পাতায় পাঠায়
export async function requireRole(roles: Role[], nextPath: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/signin?auth=required&next=${encodeURIComponent(nextPath)}`);
  }
  if (!roles.includes(getRole(session.user))) {
    redirect("/forbidden");
  }
  return session;
}