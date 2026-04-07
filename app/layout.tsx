import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import PerformanceGuard from "@/components/PerformanceGuard";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immersive Dimensions",
  description:
    "Immersive Dimensions creates premium digital spaces, cinematic brand presentations, and immersive website experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <PerformanceGuard />
        {children}
      </body>
    </html>
  );
}
