import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Shop local. <span className="text-primary">Sell smart.</span>
      </h1>
      <p className="max-w-xl opacity-70">
        Bangla Mart connects local sellers with buyers across the country.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/signup" className="btn btn-primary">
          Get started
        </Link>
        <Link href="/signin" className="btn btn-outline">
          Sign in
        </Link>
      </div>
    </section>
  );
}