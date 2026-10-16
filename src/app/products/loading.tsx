export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="skeleton mb-2 h-9 w-48" />
      <div className="skeleton mb-5 h-4 w-32" />
      <div className="skeleton h-28 w-full" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-base-300 bg-base-100 p-3">
            <div className="skeleton aspect-square w-full" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-5 w-4/5" />
            <div className="skeleton h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}