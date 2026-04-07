"use client";

type HomeSecondarySectionsProps = {
  onOpenRegistration: () => void;
};

const features = [
  {
    title: "Fast first impression",
    body: "A clean hero section with clear calls to action and room for your strongest message.",
  },
  {
    title: "Dependable structure",
    body: "A simple section flow that is easy to maintain, expand, and adapt as your site grows.",
  },
  {
    title: "Mobile-ready",
    body: "Responsive spacing, readable typography, and stacked content blocks that hold up on smaller screens.",
  },
];

const showcase = [
  "Immersive product demos",
  "Interactive environments",
  "Client project highlights",
];

const pricing = [
  {
    name: "Starter",
    price: "$49",
    description: "Great for a simple launch page or creator profile.",
    items: ["Core sections", "Responsive layout", "Email CTA"],
  },
  {
    name: "Pro",
    price: "$149",
    description: "Ideal for a polished business site with trust-building sections.",
    items: ["Everything in Starter", "Showcase grid", "Testimonials", "FAQ"],
  },
  {
    name: "Studio",
    price: "Custom",
    description: "For immersive brand experiences, advanced interaction, and custom sections.",
    items: ["Custom layout", "Premium motion", "Advanced media blocks"],
  },
];

export default function HomeSecondarySections({
  onOpenRegistration,
}: HomeSecondarySectionsProps) {
  return (
    <>
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Built to be stable, clear, and scalable.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="blur-heavy rounded-3xl border border-white/10 bg-white/5 p-6"
              data-heavy="true"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="showcase" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                Showcase
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Flexible space for your strongest work.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/65">
              Use this section for standout projects, immersive demos, rendered
              scenes, or the clearest examples of what makes your work worth
              remembering.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {showcase.map((item, index) => (
              <article
                key={item}
                className="blur-heavy rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] p-6"
                data-heavy="true"
              >
                <p className="text-sm text-white/45">0{index + 1}</p>
                <h3 className="mt-4 text-2xl font-semibold">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  Replace this with images, motion blocks, or interactive previews
                  that help visitors instantly understand your style.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Simple tiers you can customize later.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <article
              key={tier.name}
              className="blur-heavy rounded-[2rem] border border-white/10 bg-white/5 p-7"
              data-heavy="true"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-semibold">{tier.name}</h3>
                <span className="text-lg font-medium text-white/72">
                  {tier.price}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/68">
                {tier.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/76">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-white/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div
          className="blur-heavy rounded-[2.25rem] border border-white/10 bg-white/6 px-8 py-10"
          data-heavy="true"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            Contact
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">
            Ready to shape something stronger than a generic template?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Start with the profile flow, then build into a bigger site from a
            foundation that stays clean, responsive, and easier to manage.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onOpenRegistration}
              className="rounded-2xl bg-white px-6 py-3 font-medium text-neutral-950 transition hover:scale-[1.02]"
            >
              Open Registration
            </button>
            <a
              href="mailto:immersivedimensionsofficial@gmail.com"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
            >
              Email Immersive Dimensions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
