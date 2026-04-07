import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const requestHeaders = await headers();
  const country = requestHeaders.get("x-vercel-ip-country") || "UNKNOWN";
  const region = requestHeaders.get("x-vercel-ip-country-region") || "UNKNOWN";
  const city = requestHeaders.get("x-vercel-ip-city") || "";

  return NextResponse.json({
    country,
    region,
    city,
    regionKey: city ? `${country}-${region}-${city}` : `${country}-${region}`,
  });
}
