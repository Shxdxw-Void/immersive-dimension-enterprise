import type { Metadata } from "next";
import Link from "next/link";
import { categories, formatPrice, storeProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products | IMDM Store",
  description:
    "Browse IMDM product categories, compare packages, and buy with Stripe.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#05050b] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_26%),radial-gradient(circle_at_right,rgba(96,165,250,0.12),transparent_22%)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
            Product Catalog
          </p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Browse IMDM products by category.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
                Choose what fits your workflow, then go straight to Stripe
                checkout. Every purchase redirects to a dedicated success page
                with product downloads.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-2xl border border-white/14 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Back To Store Home
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              {category}
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-14">
          {categories.map((category) => {
            const products = storeProducts.filter(
              (product) => product.category === category,
            );

            return (
              <section
                key={category}
                id={category.toLowerCase().replace(/\s+/g, "-")}
                className="space-y-6"
              >
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    Category
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">{category}</h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {products.map((product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
                    >
                      <div
                        className={`h-2 w-full bg-gradient-to-r ${product.accent}`}
                      />
                      <div className="p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                              {product.badge}
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold">
                              {product.name}
                            </h3>
                          </div>
                          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                            {formatPrice(product.priceInCents, product.currency)}
                          </span>
                        </div>

                        <p className="mt-5 text-sm leading-7 text-white/70">
                          {product.description}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                          <form action="/api/checkout" method="POST">
                            <input type="hidden" name="productId" value={product.id} />
                            <button
                              type="submit"
                              className="rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-85"
                            >
                              Buy With Stripe
                            </button>
                          </form>
                          <Link
                            href={`/success?product=${product.id}`}
                            className="rounded-2xl border border-white/14 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                          >
                            Preview Download Page
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
