import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Search,
  ShoppingBag,
} from "lucide-react";

export const metadata = {
  title: "Page Not Found | Bangla Mart",
  description:
    "The page you are looking for could not be found. Explore Bangla Mart and discover something you love.",
};

const popularLinks = [
  {
    title: "Home",
    description: "Explore our marketplace",
    href: "/",
    icon: Home,
  },
  {
    title: "Products",
    description: "Discover our collection",
    href: "/products",
    icon: ShoppingBag,
  },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-base-100 px-5 py-16">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="rounded-[2rem] border border-base-300/70 bg-base-100/80 p-7 text-center shadow-xl shadow-base-300/20 backdrop-blur-xl sm:p-12 md:p-16">
          {/* Brand badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Bangla Mart
            </span>
          </div>

          {/* Error illustration */}
          <div className="relative mx-auto mb-8 flex h-36 w-52 items-center justify-center sm:h-44 sm:w-64">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-primary/5 blur-2xl"
            />

            <span className="relative select-none text-[7rem] font-black leading-none tracking-tighter text-primary/10 sm:text-[9rem]">
              404
            </span>

            <div className="absolute flex h-16 w-16 -rotate-12 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-lg sm:h-20 sm:w-20">
              <Compass
                className="h-9 w-9 text-primary sm:h-11 sm:w-11"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Heading */}
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Lost in the marketplace?
          </p>

          <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl md:text-5xl">
            This page is{" "}
            <span className="text-primary">nowhere to be found.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-base-content/65 sm:text-base">
            Looks like this page has gone on a little shopping trip of its
            own. The link may be incorrect, or the page may have moved.
            Let&apos;s get you back on track.
          </p>

          {/* Primary actions */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="group btn btn-primary h-12 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Home className="h-4 w-4" />
              Back to Home
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/products"
              className="btn h-12 rounded-xl border border-base-300 bg-base-100 px-6 text-sm font-semibold text-base-content transition-all duration-300 hover:border-primary/40 hover:bg-base-200"
            >
              <Search className="h-4 w-4" />
              Explore Products
            </Link>
          </div>

          {/* Divider */}
          <div className="my-9 h-px w-full bg-base-300/70" />

          {/* Quick navigation */}
          <div className="text-left">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-base-content/45">
              Or explore these pages
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {popularLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-4 rounded-2xl border border-base-300/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-200 transition-colors duration-300 group-hover:bg-primary/10">
                      <Icon className="h-5 w-5 text-base-content/70 transition-colors group-hover:text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-base-content">
                        {item.title}
                      </h2>

                      <p className="mt-1 text-xs text-base-content/55">
                        {item.description}
                      </p>
                    </div>

                    <ArrowLeft className="h-4 w-4 rotate-180 text-base-content/35 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-base-content/45">
          Made for a better shopping experience.
          <span className="mx-2">·</span>
          <span className="font-semibold">Bangla Mart</span>
        </p>
      </div>
    </main>
  );
}