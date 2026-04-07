"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import LazySectionMount from "@/components/LazySectionMount";
import {
  loadStoredProfile,
  PROFILE_UPDATED_EVENT,
  saveStoredProfile,
  type ProfileRecord,
  type ProfileTone,
} from "@/lib/profile-storage";

const HomeSecondarySections = dynamic(() => import("./home-secondary-sections"), {
  ssr: false,
  loading: () => (
    <div className="imdm-lazy-fallback perf-contained" data-heavy="true">
      <div className="imdm-lazy-fallback__card blur-heavy" />
      <div className="imdm-lazy-fallback__card blur-heavy" />
      <div className="imdm-lazy-fallback__card blur-heavy" />
    </div>
  ),
});

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

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
      <div className="imdm-background-orb imdm-background-orb-one blur-heavy" data-heavy="true" />
      <div className="imdm-background-orb imdm-background-orb-two blur-heavy" data-heavy="true" />
      <div className="imdm-background-orb imdm-background-orb-three blur-heavy" data-heavy="true" />

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
        <aside className="imdm-profile-card glass-heavy" data-heavy="true">
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

      <div className="relative z-[1]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070611]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <a href="#home" className="text-lg font-semibold tracking-wide text-white">
              ImmersiveDimensions
            </a>

            <nav className="hidden items-center gap-6 md:flex" aria-label="Homepage sections">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => {
                setForm(profile ?? form);
                setFormError("");
                setIsRegisterOpen(true);
              }}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 shadow-lg transition hover:scale-[1.02]"
            >
              Get Started
            </button>
          </div>
        </header>

        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.28),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.2),transparent_32%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                Dependable website foundation
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                A strong layout that feels premium and stays easy to manage.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                This homepage structure gives you a reliable foundation for a
                modern Vercel site with clear sections, better flow, and room to
                grow.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#showcase"
                  className="rounded-2xl bg-white px-6 py-3 text-center font-medium text-neutral-950 shadow-xl transition hover:scale-[1.02]"
                >
                  View Showcase
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setForm(profile ?? form);
                    setFormError("");
                    setIsRegisterOpen(true);
                  }}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
                >
                  Register Your Profile
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl" data-heavy="true">
                <p className="text-sm text-white/50">Hero card</p>
                <h3 className="mt-3 text-xl font-semibold">Clear messaging</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Put your offer, value, or headline here with a short supporting
                  explanation.
                </p>
              </div>
              <div className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:translate-y-10" data-heavy="true">
                <p className="text-sm text-white/50">Trust block</p>
                <h3 className="mt-3 text-xl font-semibold">Simple credibility</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Add logos, metrics, testimonials, or a quick statement that
                  builds trust fast.
                </p>
              </div>
              <div className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl" data-heavy="true">
                <p className="text-sm text-white/50">Visual area</p>
                <h3 className="mt-3 text-xl font-semibold">Media-friendly</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Swap this card for product previews, rendered scenes, or
                  immersive snapshots.
                </p>
              </div>
              <div className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:translate-y-10" data-heavy="true">
                <p className="text-sm text-white/50">Conversion</p>
                <h3 className="mt-3 text-xl font-semibold">Action-oriented</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Every section naturally leads visitors toward reaching out,
                  buying, or booking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <LazySectionMount
        className="perf-contained"
        fallback={
          <div className="imdm-lazy-fallback perf-contained" data-heavy="true">
            <div className="imdm-lazy-fallback__card blur-heavy" />
            <div className="imdm-lazy-fallback__card blur-heavy" />
            <div className="imdm-lazy-fallback__card blur-heavy" />
          </div>
        }
      >
        <HomeSecondarySections
          onOpenRegistration={() => {
            setForm(profile ?? form);
            setFormError("");
            setIsRegisterOpen(true);
          }}
        />
      </LazySectionMount>

      {isRegisterOpen ? (
        <div className="imdm-modal">
          <div className="imdm-modal__card glass-heavy" data-heavy="true">
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
