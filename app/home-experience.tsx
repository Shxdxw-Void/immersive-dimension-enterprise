"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Image
            src={profile.avatarUrl}
            alt={`${profile.name} profile`}
            className="imdm-profile-trigger__image avatar"
            fill
            sizes="54px"
            unoptimized
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
                <Image
                  src={profile.avatarUrl}
                  alt={`${profile.name} profile`}
                  className="imdm-profile-card__image avatar"
                  fill
                  sizes="54px"
                  unoptimized
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

      <section className="imdm-hero perf-contained">
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

          <aside className="imdm-feature-card glass-heavy" data-heavy="true">
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
