import { Suspense } from "react";
import SignInForm from "@/components/SignInForm";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-10">
          <div className="skeleton h-96 w-full" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}