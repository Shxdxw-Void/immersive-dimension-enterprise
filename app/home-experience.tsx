"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import LazySectionMount from "@/components/LazySectionMount";
import {
  clearStoredSession,
  getLegalNameError,
  getProfileInitials,
  loadStoredProfile,
  loadStoredSession,
  PROFILE_UPDATED_EVENT,
  saveStoredProfile,
  saveStoredSession,
  SESSION_UPDATED_EVENT,
  type ProfileRecord,
  type ProfileTone,
  type SessionRecord,
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
}> = [
  {
    id: "solar",
    label: "Solar Gold",
    swatch: "linear-gradient(135deg, #facc15 0%, #fb7185 100%)",
  },
  {
    id: "glacier",
    label: "Glacier Blue",
    swatch: "linear-gradient(135deg, #67e8f9 0%, #60a5fa 100%)",
  },
  {
    id: "ember",
    label: "Ember Red",
    swatch: "linear-gradient(135deg, #fb7185 0%, #f97316 100%)",
  },
  {
    id: "violet",
    label: "Violet Mist",
    swatch: "linear-gradient(135deg, #c084fc 0%, #818cf8 100%)",
  },
];

type SignInForm = {
  email: string;
  password: string;
};

type PendingRegionVerification = {
  code: string;
  email: string;
  regionKey: string;
};

async function getCurrentRegionKey() {
  try {
    const response = await fetch("/api/auth/location", {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { regionKey?: string };
    return data.regionKey ?? null;
  } catch {
    return null;
  }
}

async function sendRegionVerificationEmail(
  email: string,
  code: string,
  regionKey: string,
  previousRegion: string | null | undefined,
) {
  const response = await fetch("/api/auth/send-region-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      code,
      region: regionKey,
      previousRegion: previousRegion ?? "Unknown",
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "Verification email could not be sent.");
  }
}

export default function HomeExperience() {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isRegionVerifyOpen, setIsRegionVerifyOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [nameFieldError, setNameFieldError] = useState("");
  const [signInError, setSignInError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingRegionVerification, setPendingRegionVerification] =
    useState<PendingRegionVerification | null>(null);
  const [form, setForm] = useState<ProfileRecord>({
    name: "",
    email: "",
    password: "",
    tone: "violet",
    avatarUrl: null,
    trustedRegion: null,
  });
  const [signInForm, setSignInForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const syncProfileAndSession = () => {
      const existingProfile = loadStoredProfile();
      const existingSession = loadStoredSession();

      setProfile(existingProfile);

      if (existingProfile) {
        setForm(existingProfile);
      } else {
        clearStoredSession();
        setSession(null);
        setIsProfileOpen(false);
        setIsSignInOpen(false);
        setIsRegisterOpen(true);
        return;
      }

      if (existingSession && existingSession.email === existingProfile.email) {
        setSession(existingSession);
      } else {
        clearStoredSession();
        setSession(null);
        setIsProfileOpen(false);
        setIsRegisterOpen(false);
        setIsSignInOpen(true);
      }
    };

    syncProfileAndSession();
    window.addEventListener("storage", syncProfileAndSession);
    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfileAndSession);
    window.addEventListener(SESSION_UPDATED_EVENT, syncProfileAndSession);

    return () => {
      window.removeEventListener("storage", syncProfileAndSession);
      window.removeEventListener(PROFILE_UPDATED_EVENT, syncProfileAndSession);
      window.removeEventListener(SESSION_UPDATED_EVENT, syncProfileAndSession);
    };
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const handleExit = () => {
      clearStoredSession();
    };

    window.addEventListener("beforeunload", handleExit);
    window.addEventListener("pagehide", handleExit);

    return () => {
      window.removeEventListener("beforeunload", handleExit);
      window.removeEventListener("pagehide", handleExit);
    };
  }, [session]);

  useEffect(() => {
    const shouldLockScroll = isRegisterOpen || isSignInOpen || isRegionVerifyOpen;

    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isRegisterOpen, isSignInOpen, isRegionVerifyOpen]);

  const activeTone = useMemo(
    () =>
      PROFILE_TONES.find(
        (tone) => tone.id === (isRegisterOpen ? form.tone : (profile?.tone ?? form.tone)),
      ) ?? PROFILE_TONES[0],
    [form.tone, isRegisterOpen, profile?.tone],
  );

  const profileInitials = getProfileInitials(profile?.name ?? form.name ?? "ID");

  function updateField<Key extends keyof ProfileRecord>(
    key: Key,
    value: ProfileRecord[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (key === "name") {
      setNameFieldError(getLegalNameError(String(value)));
    }
  }

  function openRegister() {
    setForm(profile ?? form);
    setFormError("");
    setNameFieldError("");
    setIsSignInOpen(false);
    setIsRegionVerifyOpen(false);
    setIsRegisterOpen(true);
  }

  function openSignIn() {
    setSignInForm({
      email: profile?.email ?? "",
      password: "",
    });
    setSignInError("");
    setVerificationError("");
    setIsProfileOpen(false);
    setIsRegisterOpen(false);
    setIsSignInOpen(true);
  }

  async function completeSignIn(nextProfile: ProfileRecord) {
    const nextSession = {
      email: nextProfile.email,
      signedInAt: new Date().toISOString(),
    };

    saveStoredProfile(nextProfile);
    saveStoredSession(nextSession);
    setProfile(nextProfile);
    setForm(nextProfile);
    setSession(nextSession);
    setSignInError("");
    setVerificationError("");
    setIsSignInOpen(false);
    setIsRegionVerifyOpen(false);
    setPendingRegionVerification(null);
    setVerificationCode("");
  }

  async function submitProfile() {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const legalNameError = getLegalNameError(trimmedName);

    setNameFieldError(legalNameError);

    if (legalNameError) {
      setFormError("Please fix the legal name field before continuing.");
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

    const regionKey = await getCurrentRegionKey();
    const nextProfile = {
      ...form,
      name: trimmedName,
      email: trimmedEmail,
      trustedRegion: regionKey ?? form.trustedRegion ?? null,
    };

    await completeSignIn(nextProfile);
    setFormError("");
    setNameFieldError("");
    setIsRegisterOpen(false);
    setIsProfileOpen(false);
  }

  async function submitSignIn() {
    if (!profile) {
      setSignInError("No account was found on this device yet.");
      return;
    }

    const email = signInForm.email.trim().toLowerCase();
    const password = signInForm.password;

    if (email !== profile.email.toLowerCase() || password !== profile.password) {
      setSignInError("That email and password do not match this account.");
      return;
    }

    const regionKey = await getCurrentRegionKey();

    if (profile.trustedRegion && regionKey && profile.trustedRegion !== regionKey) {
      try {
        const code = `${Math.floor(100000 + Math.random() * 900000)}`;
        await sendRegionVerificationEmail(email, code, regionKey, profile.trustedRegion);
        setPendingRegionVerification({
          code,
          email,
          regionKey,
        });
        setVerificationCode("");
        setVerificationError("");
        setIsSignInOpen(false);
        setIsRegionVerifyOpen(true);
        setSignInError("");
        return;
      } catch (error) {
        setSignInError(
          error instanceof Error
            ? error.message
            : "The verification email could not be sent.",
        );
        return;
      }
    }

    await completeSignIn({
      ...profile,
      trustedRegion: regionKey ?? profile.trustedRegion ?? null,
    });
  }

  async function submitRegionVerification() {
    if (!profile || !pendingRegionVerification) {
      setVerificationError("There is no verification request to complete.");
      return;
    }

    if (verificationCode.trim() !== pendingRegionVerification.code) {
      setVerificationError("That code does not match the verification email.");
      return;
    }

    await completeSignIn({
      ...profile,
      trustedRegion: pendingRegionVerification.regionKey,
    });
  }

  return (
    <main className="imdm-shell">
      <div className="imdm-background-grid" />
      <div
        className="imdm-background-orb imdm-background-orb-one blur-heavy"
        data-heavy="true"
      />
      <div
        className="imdm-background-orb imdm-background-orb-two blur-heavy"
        data-heavy="true"
      />
      <div
        className="imdm-background-orb imdm-background-orb-three blur-heavy"
        data-heavy="true"
      />

      <div className="relative z-[1]">
        <header className="border-b border-white/10 bg-[#070611]/92">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <div className="imdm-header__left">
              {profile && session ? (
                <div className="imdm-profile-anchor">
                  <button
                    type="button"
                    aria-label="Open profile"
                    onClick={() => {
                      setForm(profile);
                      setFormError("");
                      setNameFieldError("");
                      setIsProfileOpen((current) => !current);
                    }}
                    className="imdm-profile-trigger"
                    style={{ backgroundImage: activeTone.swatch }}
                  >
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={`${profile.name} profile`}
                        className="imdm-profile-trigger__image avatar"
                      />
                    ) : (
                      <span>{profileInitials}</span>
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
                          {profile.avatarUrl ? (
                            <img
                              src={profile.avatarUrl}
                              alt={`${profile.name} profile`}
                              className="imdm-profile-card__image avatar"
                            />
                          ) : (
                            profileInitials
                          )}
                        </div>
                        <div className="imdm-profile-card__copy">
                          <p className="imdm-profile-card__name">{profile.name}</p>
                          <p className="imdm-profile-card__email">{profile.email}</p>
                        </div>
                      </div>
                      <div className="imdm-profile-card__actions">
                        {session ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setForm(profile);
                                setFormError("");
                                setNameFieldError("");
                                setIsRegisterOpen(true);
                                setIsProfileOpen(false);
                              }}
                              className="imdm-profile-card__button"
                            >
                              Customize Profile
                            </button>
                            <Link href="/account" className="imdm-profile-card__link">
                              Manage Photo
                            </Link>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={openSignIn}
                            className="imdm-profile-card__button"
                          >
                            Sign In To Continue
                          </button>
                        )}
                      </div>
                    </aside>
                  ) : null}
                </div>
              ) : null}

              <a href="#home" className="text-lg font-semibold tracking-wide text-white">
                ImmersiveDimensions
              </a>
            </div>

            <nav
              className="hidden items-center gap-6 md:flex"
              aria-label="Homepage sections"
            >
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

            <div />
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
                  onClick={profile ? (session ? () => {} : openSignIn) : openRegister}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
                >
                  {profile ? (session ? "Signed In" : "Sign In") : "Register Your Profile"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div
                className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
                data-heavy="true"
              >
                <p className="text-sm text-white/50">Hero card</p>
                <h3 className="mt-3 text-xl font-semibold">Clear messaging</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Put your offer, value, or headline here with a short supporting
                  explanation.
                </p>
              </div>
              <div
                className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:translate-y-10"
                data-heavy="true"
              >
                <p className="text-sm text-white/50">Trust block</p>
                <h3 className="mt-3 text-xl font-semibold">Simple credibility</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Add logos, metrics, testimonials, or a quick statement that
                  builds trust fast.
                </p>
              </div>
              <div
                className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
                data-heavy="true"
              >
                <p className="text-sm text-white/50">Visual area</p>
                <h3 className="mt-3 text-xl font-semibold">Media-friendly</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Swap this card for product previews, rendered scenes, or
                  immersive snapshots.
                </p>
              </div>
              <div
                className="glass-heavy rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:translate-y-10"
                data-heavy="true"
              >
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
          onOpenRegistration={profile ? (session ? () => {} : openSignIn) : openRegister}
        />
      </LazySectionMount>

      {isRegisterOpen ? (
        <div className="imdm-modal">
          <div className="imdm-modal__card glass-heavy" data-heavy="true">
            <div className="imdm-modal__header">
              <div>
                <p className="imdm-eyebrow">Register Account</p>
                <h2>Create your profile before you keep building the site.</h2>
                {!session ? (
                  <p className="imdm-verify-copy">
                    You must register and create an account before you can use the
                    website.
                  </p>
                ) : null}
              </div>
              {profile && session ? (
                <button
                  type="button"
                  className="imdm-modal__close"
                  onClick={() => {
                    setForm(profile);
                    setFormError("");
                    setNameFieldError("");
                    setIsRegisterOpen(false);
                  }}
                >
                  Close
                </button>
              ) : null}
            </div>

            <div className="imdm-form-grid">
              <label className="imdm-field">
                <span>*Legal First and Last Name Required*</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Legal first and last name"
                />
                {nameFieldError ? (
                  <small className="imdm-field__error">{nameFieldError}</small>
                ) : null}
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

            {profile && session ? (
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

      {isSignInOpen ? (
        <div className="imdm-modal">
          <div className="imdm-modal__card glass-heavy" data-heavy="true">
            <div className="imdm-modal__header">
              <div>
                <p className="imdm-eyebrow">Sign In</p>
                <h2>Sign in with your email and password.</h2>
                {!session ? (
                  <p className="imdm-verify-copy">
                    You already have an account on this device, so you must sign
                    in to continue.
                  </p>
                ) : null}
              </div>
              {session ? (
                <button
                  type="button"
                  className="imdm-modal__close"
                  onClick={() => {
                    setSignInError("");
                    setIsSignInOpen(false);
                  }}
                >
                  Close
                </button>
              ) : null}
            </div>

            <div className="imdm-form-grid imdm-form-grid--stacked">
              <label className="imdm-field">
                <span>Email</span>
                <input
                  type="email"
                  value={signInForm.email}
                  onChange={(event) =>
                    setSignInForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="name@example.com"
                />
              </label>

              <label className="imdm-field">
                <span>Password</span>
                <input
                  type="password"
                  value={signInForm.password}
                  onChange={(event) =>
                    setSignInForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                />
              </label>
            </div>

            {signInError ? <p className="imdm-form-error">{signInError}</p> : null}

            <div className="imdm-modal__actions">
              <button
                type="button"
                className="imdm-button imdm-button--solid"
                onClick={submitSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isRegionVerifyOpen ? (
        <div className="imdm-modal">
          <div className="imdm-modal__card glass-heavy" data-heavy="true">
            <div className="imdm-modal__header">
              <div>
                <p className="imdm-eyebrow">Verify Region</p>
                <h2>Check your email to finish signing in.</h2>
              </div>
            </div>

            <div className="imdm-form-grid imdm-form-grid--stacked">
              <p className="imdm-verify-copy">
                A verification email was sent to{" "}
                <strong>{pendingRegionVerification?.email || profile?.email}</strong>
                {" "}because this sign-in appears to be from a new region or state.
              </p>

              <label className="imdm-field">
                <span>Verification Code</span>
                <input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="Enter the 6-digit code"
                />
              </label>
            </div>

            {verificationError ? (
              <p className="imdm-form-error">{verificationError}</p>
            ) : null}

            <div className="imdm-modal__actions">
              <button
                type="button"
                className="imdm-button imdm-button--solid"
                onClick={submitRegionVerification}
              >
                Verify And Sign In
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
