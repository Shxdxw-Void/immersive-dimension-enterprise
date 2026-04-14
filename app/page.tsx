import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Immersive Dimensions",
  description: "Explore immersive virtual worlds and interactive experiences.",
};

type FeatureCardProps = {
  title: string;
  description: string;
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 px-6 py-32 text-center">
        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          Immersive Dimensions
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
          Step into fully interactive worlds where creativity, exploration, and
          connection come to life.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/explore"
            className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-80"
          >
            Start Exploring
          </Link>
          <button className="rounded-2xl border border-white px-6 py-3 transition hover:bg-white hover:text-black">
            Join Community
          </button>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold">What We Offer</h2>

        <div className="grid gap-10 md:grid-cols-2">
          <FeatureCard
            title="Limitless Worlds"
            description="Explore immersive environments designed for creativity and interaction."
          />
          <FeatureCard
            title="Smart Interaction"
            description="Realistic movement, physics, and responsive gameplay systems."
          />
          <FeatureCard
            title="Multiplayer"
            description="Connect and interact with others in real-time experiences."
          />
          <FeatureCard
            title="Creator Tools"
            description="Build and customize your own worlds with flexible tools."
          />
        </div>
      </section>

      <section id="vision" className="bg-gray-900 px-6 py-24 text-center">
        <h2 className="mb-6 text-4xl font-bold">The Vision</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-300">
          We&apos;re building a digital universe where imagination has no
          limits. Immersive Dimensions evolves constantly with new systems,
          environments, and features.
        </p>
      </section>

      <section id="contact" className="px-6 py-24 text-center">
        <h2 className="mb-6 text-4xl font-bold">Get Involved</h2>
        <p className="mb-8 text-gray-300">
          Join the journey and help shape the future of immersive experiences.
        </p>
        <button className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:opacity-80">
          Start Now
        </button>
      </section>

      <footer className="border-t border-gray-800 py-10 text-center text-gray-500">
        © {new Date().getFullYear()} Immersive Dimensions
      </footer>
    </main>
  );
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-gray-800 p-6 shadow-lg transition hover:scale-105">
      <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
