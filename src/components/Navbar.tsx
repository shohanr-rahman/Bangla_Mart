
"use client";

import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const router = useRouter();

  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      router.push("/products");
      setMobileMenuOpen(false);
      return;
    }

    router.push(`/products?search=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            aria-label="Bangla Mart home"
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={2.2} />
            </span>

            <span className="flex flex-col">
              <span className="text-[21px] font-extrabold leading-tight tracking-[-0.8px] text-base-content">
                Bangla<span className="text-primary">Mart</span>
              </span>

              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[1.7px] text-base-content/50">
                Shop local. Live better.
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            <Link
              href="/"
              className="text-sm font-semibold text-base-content/75 transition-colors hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-semibold text-base-content/75 transition-colors hover:text-primary"
            >
              All Products
            </Link>

            <Link
              href="/products?sort=popular"
              className="group flex items-center gap-1.5 text-sm font-semibold text-base-content/75 transition-colors hover:text-primary"
            >
              Popular
              <span className="rounded-md bg-secondary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-base-content">
                Hot
              </span>
            </Link>
          </nav>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden min-w-0 max-w-[390px] flex-1 xl:flex"
          >
            <label htmlFor="desktop-product-search" className="sr-only">
              Search products
            </label>

            <div className="group flex h-11 w-full items-center gap-3 rounded-xl border border-base-300 bg-base-200/60 px-3.5 transition-all duration-200 focus-within:border-primary/50 focus-within:bg-base-100 focus-within:ring-4 focus-within:ring-primary/10">
              <Search className="h-[18px] w-[18px] shrink-0 text-base-content/45 transition-colors group-focus-within:text-primary" />

              <input
                id="desktop-product-search"
                type="search"
                name="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products..."
                className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/45"
              />

              <button
                type="submit"
                aria-label="Search products"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base-content/55 transition-colors hover:bg-primary hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right-side actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Desktop Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? "item" : "items"}`}
              title="Wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-base-content/70 transition-colors hover:bg-primary/10 hover:text-primary sm:flex"
            >
              <Heart className="h-[21px] w-[21px]" strokeWidth={1.8} />

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-base-100">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Desktop Shopping Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              title="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-base-content/70 transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <ShoppingCart
                className="h-[21px] w-[21px]"
                strokeWidth={1.8}
              />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-extrabold leading-none text-secondary-content ring-2 ring-base-100">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <div className="ml-1 hidden h-8 w-px bg-base-300 sm:block" />

            <UserMenu />

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 text-base-content transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="pb-3 xl:hidden"
        >
          <label htmlFor="mobile-product-search" className="sr-only">
            Search products
          </label>

          <div className="flex h-11 items-center gap-3 rounded-xl border border-base-300 bg-base-200/60 px-3.5 transition-colors focus-within:border-primary/50 focus-within:bg-base-100">
            <Search className="h-[18px] w-[18px] shrink-0 text-base-content/45" />

            <input
              id="mobile-product-search"
              type="search"
              name="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, brands..."
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-base-content/45"
            />

            <button
              type="submit"
              aria-label="Search products"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content transition-colors hover:bg-primary/90"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-base-300/70 py-3 lg:hidden"
          >
            <div className="grid gap-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-primary/5 hover:text-primary"
              >
                Home
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>

              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-primary/5 hover:text-primary"
              >
                All Products
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>

              <Link
                href="/products?sort=popular"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-primary/5 hover:text-primary"
              >
                Popular Products

                <span className="rounded-md bg-secondary/15 px-2 py-1 text-[10px] font-bold text-base-content">
                  HOT
                </span>
              </Link>

              {/* Mobile Wishlist with live count */}
              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex items-center gap-3">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </span>

                {wishlistCount > 0 ? (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                ) : (
                  <ArrowRight className="h-4 w-4 opacity-40" />
                )}
              </Link>

              {/* Mobile Cart with live count */}
              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" />
                  Shopping Cart
                </span>

                {cartCount > 0 ? (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-bold text-secondary-content">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : (
                  <ArrowRight className="h-4 w-4 opacity-40" />
                )}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

