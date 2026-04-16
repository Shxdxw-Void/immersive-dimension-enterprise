import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, storeProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "IMDM Products Store",
  description:
    "Browse IMDM digital products, secure Stripe checkout, and instant download delivery.",
};

export default function HomePage() {
  const featuredProducts = storeProducts.slice(0, 2);

  return (
    <main className="min-h-screen bg-[#05050b] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.2),transparent_32%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-24 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              IMDM Products
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Digital products built for faster immersive development.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Launch with clean assets, faster workflow packs, and secure Stripe
              checkout. Buy once, download immediately, and get back to building.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-85"
              >
                Browse Products
              </Link>
              <Link
                href="/explore"
                className="rounded-2xl border border-white/14 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Back To Main Experience
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  {product.category}
                </p>
                <h2 className="mt-4 text-2xl font-semibold">{product.name}</h2>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {product.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-lg font-semibold text-cyan-200">
                    {formatPrice(product.priceInCents, product.currency)}
                  </span>
                  <Link
                    href="/products"
                    className="rounded-full border border-white/14 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Secure checkout</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Stripe Checkout handles payment collection with a Vercel-friendly
              server route and a clean redirect flow.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Instant downloads</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">
              After checkout, customers land on the success page and can grab
              the files right away.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Simple to expand</h2>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Products are powered by one shared catalog, so adding more items
              later stays clean and predictable.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
