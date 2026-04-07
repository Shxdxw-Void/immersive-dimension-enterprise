"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AvatarUploader from "@/components/AvatarUploader";
import { loadStoredProfile, saveStoredProfile, type ProfileRecord } from "@/lib/profile-storage";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Avatar read failed"));
    };

    reader.onerror = () => reject(new Error("Avatar read failed"));
    reader.readAsDataURL(file);
  });
}

export default function AccountPage() {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setProfile(loadStoredProfile());
  }, []);

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
                  const avatarUrl = await fileToDataUrl(file);
                  const nextProfile = {
                    ...profile,
                    avatarUrl,
                  };

                  saveStoredProfile(nextProfile);
                  setProfile(nextProfile);
                  setSaveError("");
                  return avatarUrl;
                } catch {
                  setSaveError("The avatar could not be saved. Please try again.");
                  throw new Error("Avatar save failed");
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
