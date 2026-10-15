"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type AccountType = "buyer" | "seller";

const OPTIONS: { value: AccountType; title: string; text: string }[] = [
  { value: "buyer", title: "Buyer", text: "Browse and buy products" },
  { value: "seller", title: "Seller", text: "Open a shop and sell products" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccountType>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fail(msg: string) {
    setError(msg);
    toast.error(msg);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) return fail("Fill in all fields");
    if (password.length < 8) return fail("Password must be at least 8 characters");

    setLoading(true);
    const { error: authError } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });
    setLoading(false);

    if (authError) {
      const exists = /exist/i.test(authError.message ?? "");
      return fail(
        exists
          ? "An account with this email already exists"
          : "Could not create the account, please try again"
      );
    }

    toast.success("Account created, please sign in");
    router.push("/signin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm opacity-70">Join Bangla Mart as a buyer or a seller</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {OPTIONS.map((o) => (
              <label
                key={o.value}
                className="cursor-pointer rounded-xl border border-base-300 p-3 transition has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="role"
                  value={o.value}
                  checked={role === o.value}
                  onChange={() => setRole(o.value)}
                  className="sr-only"
                />
                <span className="block font-semibold">{o.title}</span>
                <span className="block text-xs opacity-70">{o.text}</span>
              </label>
            ))}
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="input w-full"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input w-full"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="input w-full"
              autoComplete="new-password"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}