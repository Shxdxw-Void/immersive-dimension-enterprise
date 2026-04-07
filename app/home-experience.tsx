"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  loadStoredProfile,
  PROFILE_UPDATED_EVENT,
  saveStoredProfile,
  type ProfileRecord,
  type ProfileTone,
} from "@/lib/profile-storage";

const PROFILE_TONES: Array<{
  id: ProfileTone;
  label: string;
  swatch: string;
  highlight: string;
}> = [
  {
    id: "solar",
    label: "Solar Gold",
    swatch: "linear-gradient(135deg, #facc15 0%, #fb7185 100%)",
    highlight: "#fde68a",
  },
  {
    id: "glacier",
    label: "Glacier Blue",
    swatch: "linear-gradient(135deg, #67e8f9 0%, #60a5fa 100%)",
    highlight: "#bae6fd",
  },
  {
    id: "ember",
    label: "Ember Red",
    swatch: "linear-gradient(135deg, #fb7185 0%, #f97316 100%)",
    highlight: "#fecaca",
  },
  {
    id: "violet",
    label: "Violet Mist",
    swatch: "linear-gradient(135deg, #c084fc 0%, #818cf8 100%)",
    highlight: "#ddd6fe",
  },
];

export default function HomeExperience() {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<ProfileRecord>({
    name: "",
    email: "",
    password: "",
    tone: "violet",
    avatarUrl: null,
  });

  useEffect(() => {
    const syncProfile = () => {
      const existingProfile = loadStoredProfile();

      if (existingProfile) {
        setProfile(existingProfile);
        setForm(existingProfile);
        return;
      }

      setIsRegisterOpen(true);
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncProfile);
    };
  }, []);

  const activeTone = useMemo(
    () =>
      PROFILE_TONES.find(
        (tone) => tone.id === (isRegisterOpen ? form.tone : (profile?.tone ?? form.tone)),
      ) ??
      PROFILE_TONES[0],
    [form.tone, isRegisterOpen, profile?.tone],
  );

  function updateField<Key extends keyof ProfileRecord>(
    key: Key,
    value: ProfileRecord[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function submitProfile() {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      setFormError("Please enter a name for the profile.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (form.password.trim().length < 6) {
      setFormError("Please choose a password with at least 6 characters.");
      return;
    }

    const nextProfile = {
      ...form,
      name: trimmedName,
      email: trimmedEmail,
    };

    saveStoredProfile(nextProfile);
    setProfile(nextProfile);
    setForm(nextProfile);
    setFormError("");
    setIsRegisterOpen(false);
    setIsProfileOpen(false);
  }

  return (
    <main className="imdm-shell">
      <div className="imdm-background-grid" />
      <div className="imdm-background-orb imdm-background-orb-one" />
      <div className="imdm-background-orb imdm-background-orb-two" />
      <div className="imdm-background-orb imdm-background-orb-three" />

      <button
        type="button"
        aria-label="Open profile"
        onClick={() => {
          setForm(profile ?? form);
          setFormError("");
          setIsProfileOpen((current) => !current);
        }}
        className="imdm-profile-trigger"
        style={{ backgroundImage: activeTone.swatch }}
      >
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={`${profile.name} profile`}
            className="imdm-profile-trigger__image avatar"
          />
        ) : (
          <span>{(profile?.name ?? form.name ?? "ID").slice(0, 2).toUpperCase()}</span>
        )}
      </button>

      {isProfileOpen ? (
        <aside className="imdm-profile-card">
          <p className="imdm-eyebrow">Your Profile</p>
          <div className="imdm-profile-card__identity">
            <div
              className="imdm-profile-card__avatar"
              style={{ backgroundImage: activeTone.swatch }}
            >
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name} profile`}
                  className="imdm-profile-card__image avatar"
                />
              ) : (
                (profile?.name ?? form.name ?? "ID").slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="imdm-profile-card__copy">
              <p className="imdm-profile-card__name">
                {profile?.name || "Create Your Profile"}
              </p>
              <p className="imdm-profile-card__email">
                {profile?.email || "Choose a name, email, and profile look."}
              </p>
            </div>
          </div>
          <div className="imdm-profile-card__actions">
            <button
              type="button"
              onClick={() => {
                setForm(profile ?? form);
                setFormError("");
                setIsRegisterOpen(true);
                setIsProfileOpen(false);
              }}
              className="imdm-profile-card__button"
            >
              {profile ? "Customize Profile" : "Create Profile"}
            </button>
            <Link href="/account" className="imdm-profile-card__link">
              Manage Photo
            </Link>
          </div>
        </aside>
      ) : null}

      <section className="imdm-hero">
        <header className="imdm-header">
          <div>
            <p className="imdm-brand">Immersive Dimensions</p>
            <p className="imdm-subbrand">
              Cinematic digital worlds, brand systems, and experiences that feel
              like they belong to the future.
            </p>
          </div>
          <nav className="imdm-nav" aria-label="Homepage sections">
            <a href="#what-we-build">What We Build</a>
            <a href="#signature">Signature Style</a>
            <a href="#start">Start Here</a>
          </nav>
        </header>

        <div className="imdm-hero__grid">
          <section>
            <p className="imdm-eyebrow">Immersive Website Studio</p>
            <h1 className="imdm-headline">
              We make digital spaces feel alive, premium, and impossible to ignore.
            </h1>
            <p className="imdm-lead">
              Immersive Dimensions is built for brands, creators, and projects that
              want a website people actually remember after they leave it.
            </p>

            <div className="imdm-actions">
              <a href="#start" className="imdm-button imdm-button--solid">
                Build The Homepage Right
              </a>
              <button
                type="button"
                className="imdm-button imdm-button--ghost"
                onClick={() => {
                  setForm(profile ?? form);
                  setFormError("");
                  setIsRegisterOpen(true);
                }}
              >
                Register Your Profile
              </button>
            </div>

            <dl className="imdm-stat-grid">
              <div className="imdm-stat-card">
                <dt>Feeling</dt>
                <dd>High-end</dd>
              </div>
              <div className="imdm-stat-card">
                <dt>Direction</dt>
                <dd>Modern</dd>
              </div>
              <div className="imdm-stat-card">
                <dt>Focus</dt>
                <dd>Memorable</dd>
              </div>
            </dl>
          </section>

          <aside className="imdm-feature-card">
            <p className="imdm-eyebrow">First Impression</p>
            <h2>Start with a profile that feels like yours.</h2>
            <p>
              The first version of the site keeps registration simple. You can
              enter a name, email, password, choose the profile look that fits
              your vibe, and add a custom picture from the profile area once your
              account is created.
            </p>
            <div className="imdm-tone-preview">
              {PROFILE_TONES.map((tone) => (
                <div key={tone.id} className="imdm-tone-preview__item">
                  <span
                    className="imdm-tone-preview__swatch"
                    style={{ backgroundImage: tone.swatch }}
                  />
                  <span>{tone.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="what-we-build" className="imdm-section">
        <div className="imdm-section__intro">
          <p className="imdm-eyebrow">What We Build</p>
          <h2>Designed to feel sharp, immersive, and worth staying on.</h2>
        </div>
        <div className="imdm-card-grid">
          <article className="imdm-info-card">
            <p className="imdm-info-card__title">Brand Homepages</p>
            <p>
              Landing pages that feel cinematic instead of generic, with stronger
              visual identity and cleaner message flow.
            </p>
          </article>
          <article className="imdm-info-card">
            <p className="imdm-info-card__title">Digital Identity</p>
            <p>
              Bold presentation, focused typography, and layouts that make a brand
              feel bigger the moment someone lands.
            </p>
          </article>
          <article className="imdm-info-card">
            <p className="imdm-info-card__title">Interactive Foundations</p>
            <p>
              Clean UI structure now, with room to grow into accounts, AI, shop
              systems, and more once the core feels right.
            </p>
          </article>
        </div>
      </section>

      <section id="signature" className="imdm-section imdm-section--split">
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

        <div className="imdm-quote-card">
          <p>
            The best rebuild is the one that feels intentional from the first
            screen.
          </p>
          <span>Immersive Dimensions</span>
        </div>
      </section>

      <section id="start" className="imdm-section imdm-section--cta">
        <p className="imdm-eyebrow">Start Here</p>
        <h2>Register once, shape the profile look you want, and build from there.</h2>
        <p>
          The site now starts with the homepage and a simple account entry flow.
          We can layer in more pages later once this foundation feels right.
        </p>
        <button
          type="button"
          className="imdm-button imdm-button--solid"
          onClick={() => {
            setForm(profile ?? form);
            setFormError("");
            setIsRegisterOpen(true);
          }}
        >
          Open Registration
        </button>
      </section>

      {isRegisterOpen ? (
        <div className="imdm-modal">
          <div className="imdm-modal__card">
            <div className="imdm-modal__header">
              <div>
                <p className="imdm-eyebrow">Register Account</p>
                <h2>Create your profile before you keep building the site.</h2>
              </div>
              {profile ? (
                <button
                  type="button"
                  className="imdm-modal__close"
                  onClick={() => {
                    setForm(profile);
                    setFormError("");
                    setIsRegisterOpen(false);
                  }}
                >
                  Close
                </button>
              ) : null}
            </div>

            <div className="imdm-form-grid">
              <label className="imdm-field">
                <span>Profile Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Immersive User"
                />
              </label>

              <label className="imdm-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="name@example.com"
                />
              </label>

              <label className="imdm-field">
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="At least 6 characters"
                />
              </label>
            </div>

            <div className="imdm-tone-picker">
              <p>Choose your profile look</p>
              <div className="imdm-tone-picker__grid">
                {PROFILE_TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    className={`imdm-tone-option ${
                      form.tone === tone.id ? "is-active" : ""
                    }`}
                    onClick={() => updateField("tone", tone.id)}
                  >
                    <span
                      className="imdm-tone-option__swatch"
                      style={{ backgroundImage: tone.swatch }}
                    />
                    <span>{tone.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {profile ? (
              <div className="imdm-modal__photo-cta">
                <p className="imdm-eyebrow">Profile Picture</p>
                <p>
                  Want your own image in the circle? Upload and crop it from the
                  account page.
                </p>
                <Link href="/account" className="imdm-profile-card__link">
                  Open Photo Uploader
                </Link>
              </div>
            ) : null}

            {formError ? <p className="imdm-form-error">{formError}</p> : null}

            <div className="imdm-modal__actions">
              <button
                type="button"
                className="imdm-button imdm-button--solid"
                onClick={submitProfile}
              >
                {profile ? "Save Profile" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
