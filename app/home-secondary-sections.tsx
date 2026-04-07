"use client";

type HomeSecondarySectionsProps = {
  onOpenRegistration: () => void;
};

export default function HomeSecondarySections({
  onOpenRegistration,
}: HomeSecondarySectionsProps) {
  return (
    <>
      <section id="what-we-build" className="imdm-section perf-contained">
        <div className="imdm-section__intro">
          <p className="imdm-eyebrow">What We Build</p>
          <h2>Designed to feel sharp, immersive, and worth staying on.</h2>
        </div>
        <div className="imdm-card-grid">
          <article className="imdm-info-card blur-heavy" data-heavy="true">
            <p className="imdm-info-card__title">Brand Homepages</p>
            <p>
              Landing pages that feel cinematic instead of generic, with stronger
              visual identity and cleaner message flow.
            </p>
          </article>
          <article className="imdm-info-card blur-heavy" data-heavy="true">
            <p className="imdm-info-card__title">Digital Identity</p>
            <p>
              Bold presentation, focused typography, and layouts that make a brand
              feel bigger the moment someone lands.
            </p>
          </article>
          <article className="imdm-info-card blur-heavy" data-heavy="true">
            <p className="imdm-info-card__title">Interactive Foundations</p>
            <p>
              Clean UI structure now, with room to grow into accounts, AI, shop
              systems, and more once the core feels right.
            </p>
          </article>
        </div>
      </section>

      <section id="signature" className="imdm-section imdm-section--split perf-contained">
        <div className="imdm-section__intro">
          <p className="imdm-eyebrow">Signature Style</p>
          <h2>
            A cleaner rebuild starts with one strong homepage, not a messy
            everything-app.
          </h2>
          <p>
            This version keeps the experience simple on purpose: one polished home,
            one profile flow, and a foundation that can scale later without
            collapsing into clutter.
          </p>
        </div>

        <div className="imdm-quote-card blur-heavy" data-heavy="true">
          <p>
            The best rebuild is the one that feels intentional from the first
            screen.
          </p>
          <span>Immersive Dimensions</span>
        </div>
      </section>

      <section id="start" className="imdm-section imdm-section--cta blur-heavy perf-contained" data-heavy="true">
        <p className="imdm-eyebrow">Start Here</p>
        <h2>Register once, shape the profile look you want, and build from there.</h2>
        <p>
          The site now starts with the homepage and a simple account entry flow.
          We can layer in more pages later once this foundation feels right.
        </p>
        <button
          type="button"
          className="imdm-button imdm-button--solid"
          onClick={onOpenRegistration}
        >
          Open Registration
        </button>
      </section>
    </>
  );
}
