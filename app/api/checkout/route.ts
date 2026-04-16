import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";

function getBaseUrl(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY before using checkout.",
      },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey);
  const formData = await request.formData();
  const productId = formData.get("productId");
  const product = getProductById(
    typeof productId === "string" ? productId : null,
  );

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const baseUrl = getBaseUrl(request);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.priceInCents,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      },
    ],
    metadata: {
      productId: product.id,
      downloadPath: product.downloadPath,
    },
    success_url: `${baseUrl}/success?product=${product.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/products`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe checkout session could not be created." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(session.url, 303);
}
