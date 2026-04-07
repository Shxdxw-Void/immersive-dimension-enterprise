"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AvatarUploader from "@/components/AvatarUploader";
import { loadStoredProfile, saveStoredProfile, type ProfileRecord } from "@/lib/profile-storage";

export default function AccountPage() {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setProfile(loadStoredProfile());
  }, []);

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = (await res.json()) as { url?: string };

    if (data.url && profile) {
      const nextProfile = {
        ...profile,
        avatarUrl: data.url,
      };

      saveStoredProfile(nextProfile);
      setProfile(nextProfile);
      setSaveError("");
      return data.url;
    }

    return data.url;
  };

  return (
    <main className="imdm-account-shell">
      <div className="imdm-account-shell__backdrop" />
      <div className="imdm-account-shell__content">
        <div className="imdm-account-shell__header">
          <div>
            <p className="imdm-eyebrow">Account</p>
            <h1>Customize your profile picture.</h1>
            <p>
              Upload the image you want tied to your account circle on the home
              page.
            </p>
          </div>
          <Link href="/" className="imdm-button imdm-button--ghost">
            Back Home
          </Link>
        </div>

        {profile ? (
          <>
            <div className="imdm-account-shell__summary">
              <p className="imdm-account-shell__name">{profile.name}</p>
              <p className="imdm-account-shell__email">{profile.email}</p>
            </div>

            <AvatarUploader
              initialImageUrl={profile.avatarUrl ?? undefined}
              onSave={async (file) => {
                try {
                  return await uploadAvatar(file);
                } catch {
                  setSaveError("The avatar upload did not finish. Please try again.");
                  throw new Error("Upload failed");
                }
              }}
              onRemove={() => {
                const nextProfile = {
                  ...profile,
                  avatarUrl: null,
                };

                saveStoredProfile(nextProfile);
                setProfile(nextProfile);
                setSaveError("");
              }}
              displaySize={160}
            />
          </>
        ) : (
          <section className="imdm-account-shell__empty">
            <p className="imdm-eyebrow">Profile Missing</p>
            <h2>Create your homepage profile first.</h2>
            <p>
              The avatar uploader attaches to the account you create from the home
              page circle.
            </p>
            <Link href="/" className="imdm-button imdm-button--solid">
              Go Create Profile
            </Link>
          </section>
        )}

        {saveError ? <p className="imdm-form-error">{saveError}</p> : null}
      </div>
    </main>
  );
}
