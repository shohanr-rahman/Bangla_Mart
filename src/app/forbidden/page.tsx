import Link from "next/link";

export const metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-error">403</p>
      <h1 className="mt-4 text-2xl font-bold">Access denied</h1>
      <p className="mt-2 opacity-70">You don&apos;t have permission to view this page.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}