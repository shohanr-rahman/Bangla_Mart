"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 opacity-70">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}