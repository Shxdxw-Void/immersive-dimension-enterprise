import { NextResponse } from "next/server";

type VerificationRequest = {
  code?: string;
  previousRegion?: string;
  region?: string;
  to?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as VerificationRequest;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress =
      process.env.IMDM_FROM_EMAIL || "Immersive Dimensions <onboarding@resend.dev>";

    if (!resendApiKey) {
      return NextResponse.json(
        {
          error:
            "Email sending is not configured yet. Add RESEND_API_KEY to enable region verification emails.",
        },
        { status: 500 },
      );
    }

    if (!body.to || !body.code || !body.region) {
      return NextResponse.json(
        { error: "Missing email verification details." },
        { status: 400 },
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [body.to],
        subject: "Verify your Immersive Dimensions sign-in",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0920;color:#f7f5ff;padding:24px">
            <h1 style="margin:0 0 16px;font-size:24px">Immersive Dimensions sign-in verification</h1>
            <p style="line-height:1.7;margin:0 0 12px">
              We noticed a sign-in attempt from a new region.
            </p>
            <p style="line-height:1.7;margin:0 0 12px">
              Previous region: <strong>${body.previousRegion || "Unknown"}</strong><br />
              New region: <strong>${body.region}</strong>
            </p>
            <p style="line-height:1.7;margin:0 0 8px">
              Enter this code to finish signing in:
            </p>
            <p style="font-size:32px;font-weight:700;letter-spacing:0.32em;margin:12px 0 20px">
              ${body.code}
            </p>
            <p style="line-height:1.7;margin:0;color:rgba(247,245,255,0.76)">
              If this was not you, do not enter the code.
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return NextResponse.json(
        { error: `Verification email failed: ${errorText}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not send the verification email." },
      { status: 500 },
    );
  }
}
