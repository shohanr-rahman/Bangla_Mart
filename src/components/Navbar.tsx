import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <ShoppingBag className="h-6 w-6" />
          Bangla Mart
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}