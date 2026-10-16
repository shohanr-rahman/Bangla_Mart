import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getLatestProducts } from "@/lib/products";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Headphones,
  Shirt,
  House,
  ShoppingBasket,
  Sparkles,
  BookOpen,
  Dumbbell,
  Baby,
  ShieldCheck,
  Store,
  Truck,
  Wallet,
} from "lucide-react";

export const dynamic = "force-dynamic";

const categories = [
  { name: "Electronics", slug: "electronics", description: "Phones, audio, gadgets", icon: Headphones, tint: "bg-[#e3ecf5]" },
  { name: "Fashion", slug: "fashion", description: "Clothing and accessories", icon: Shirt, tint: "bg-[#f6e4e0]" },
  { name: "Home & Living", slug: "home-living", description: "Furniture and decor", icon: House, tint: "bg-[#efe8d8]" },
  { name: "Groceries", slug: "groceries", description: "Daily essentials", icon: ShoppingBasket, tint: "bg-[#e1efdf]" },
  { name: "Beauty & Care", slug: "beauty", description: "Skin, hair, wellness", icon: Sparkles, tint: "bg-[#f3e1ee]" },
  { name: "Books & Stationery", slug: "books", description: "Read, write, study", icon: BookOpen, tint: "bg-[#f4ecd0]" },
  { name: "Sports & Fitness", slug: "sports", description: "Gear for every pace", icon: Dumbbell, tint: "bg-[#dcefee]" },
  { name: "Toys & Kids", slug: "toys", description: "For little ones", icon: Baby, tint: "bg-[#f7e6d3]" },
];

const quickLinks = categories.slice(0, 5);

const benefits = [
  { icon: ShieldCheck, title: "Shop with confidence", text: "Verified sellers, clear product details" },
  { icon: Truck, title: "Delivered to you", text: "Order from anywhere in Bangladesh" },
  { icon: Wallet, title: "Fair local prices", text: "Buy directly from the people who make and sell" },
  { icon: Store, title: "Support local sellers", text: "Every order helps a local business grow" },
];

export default async function HomePage() {
  const products = await getLatestProducts(8);

  return (
    <div className="overflow-hidden bg-paper text-ink">
      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
        <div className="relative grid overflow-hidden rounded-[2rem] bg-brand text-white lg:grid-cols-[1.15fr_1fr]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <h1 className="font-display max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Everything local,
              <br />
              in one place.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-white/75">
              Shop from sellers across Bangladesh. Find what you need, or
              discover something you didn&apos;t know you wanted.
            </p>

            <form
              action="/products"
              method="get"
              role="search"
              className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-xl shadow-black/20"
            >
              <Search size={20} className="ml-4 shrink-0 text-neutral-400" />
              <input
                type="search"
                name="q"
                placeholder="Search products, brands, categories"
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-ink outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center rounded-full bg-saffron px-6 text-sm font-semibold text-ink transition hover:brightness-95"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-white/60">Popular:</span>
              {quickLinks.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-white/90 transition hover:bg-white hover:text-brand"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Visual: category collage */}
          <div className="relative hidden min-h-[460px] p-8 lg:block">
            <div className="grid h-full grid-cols-2 grid-rows-[1.2fr_1fr] gap-4">
              <Link
                href="/products?category=electronics"
                className="group relative row-span-2 flex flex-col justify-between rounded-3xl bg-[#e3ecf5] p-6 text-ink"
              >
                <Headphones size={72} strokeWidth={1} className="transition group-hover:scale-105" />
                <div>
                  <p className="font-display text-xl font-semibold">Electronics</p>
                  <p className="text-sm text-neutral-600">Everyday technology</p>
                </div>
              </Link>

              <Link
                href="/products?category=fashion"
                className="group flex flex-col justify-between rounded-3xl bg-saffron p-5 text-ink"
              >
                <Shirt size={40} strokeWidth={1.25} />
                <p className="font-display text-lg font-semibold">Fashion</p>
              </Link>

              <Link
                href="/products?category=groceries"
                className="group flex flex-col justify-between rounded-3xl bg-[#e1efdf] p-5 text-ink"
              >
                <ShoppingBasket size={40} strokeWidth={1.25} />
                <p className="font-display text-lg font-semibold">Groceries</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto grid max-w-[1440px] gap-5 px-5 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Icon size={22} strokeWidth={1.6} />
            </span>
            <div>
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="mt-0.5 text-xs leading-5 text-neutral-600">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop by category
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Find something for every part of your life.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className={`group relative flex min-h-[150px] flex-col justify-between rounded-3xl p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 sm:min-h-[180px] ${category.tint}`}
              >
                <Icon size={38} strokeWidth={1.25} className="text-ink" />
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">{category.name}</h3>
                  <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">
                    {category.description}
                  </p>
                </div>
                <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-ink transition group-hover:bg-ink group-hover:text-white">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LATEST PRODUCTS */}
      <section className="bg-sand">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 sm:py-20 lg:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Just arrived
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
                The newest products from sellers on Bangla Mart.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              Shop all products
              <ArrowRight size={16} />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white px-5 py-16 text-center sm:py-20">
              <ShoppingBasket size={40} strokeWidth={1.25} className="mx-auto text-brand" />
              <h3 className="mt-5 text-xl font-semibold">No products yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">
                New products show up here as soon as sellers add them.
              </p>
              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Become a seller
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SELLER CTA */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-saffron px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
          <Store
            aria-hidden="true"
            strokeWidth={0.8}
            className="pointer-events-none absolute -bottom-10 -right-6 h-72 w-72 text-ink/10 sm:h-96 sm:w-96"
          />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Sell your products on Bangla Mart
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/75">
              Create a shop, list your products, and reach customers across
              the country.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand"
            >
              Start selling
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
