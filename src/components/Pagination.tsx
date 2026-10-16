import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function href(target: number) {
    const sp = new URLSearchParams(params);
    if (target > 1) sp.set("page", String(target));
    else sp.delete("page");
    const qs = sp.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const items: (number | "gap")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("gap");
    items.push(p);
  });

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1">
      {page > 1 ? (
        <Link href={href(page - 1)} className="btn btn-sm">
          Prev
        </Link>
      ) : (
        <span className="btn btn-sm btn-disabled">Prev</span>
      )}

      {items.map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-2 opacity-60">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={`btn btn-sm ${item === page ? "btn-primary" : ""}`}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className="btn btn-sm">
          Next
        </Link>
      ) : (
        <span className="btn btn-sm btn-disabled">Next</span>
      )}
    </nav>
  );
}