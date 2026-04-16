import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, getProductById, storeProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Success | IMDM Store",
  description:
    "Download your IMDM purchase after completing checkout.",
};

type SuccessPageProps = {
  searchParams: Promise<{
    product?: string;
    session_id?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const purchasedProduct = getProductById(params.product);
  const downloadProducts = purchasedProduct ? [purchasedProduct] : storeProducts;

  return (
    <main className="min-h-screen bg-[#05050b] text-white">
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/8 p-8 shadow-[0_24px_60px_rgba(16,185,129,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/70">
            Payment Complete
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Your IMDM download is ready.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">
            Thanks for your purchase. Use the download buttons below to grab your
            files. Keep the package stored somewhere safe so you can use it in
            your project workflow right away.
          </p>
          {params.session_id ? (
            <p className="mt-4 text-sm text-white/45">
              Stripe session: {params.session_id}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6">
          {downloadProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    {product.category}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">{product.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {product.description}
                  </p>
                </div>
                <span className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">
                  {formatPrice(product.priceInCents, product.currency)}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={product.downloadPath}
                  download
                  className="rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:opacity-85"
                >
                  Download {product.name}
                </a>
                <Link
                  href="/products"
                  className="rounded-2xl border border-white/14 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Back To Products
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
