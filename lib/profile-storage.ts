export type ProfileTone = "solar" | "glacier" | "ember" | "violet";

export type ProfileRecord = {
  name: string;
  email: string;
  password: string;
  tone: ProfileTone;
  avatarUrl?: string | null;
};

export const PROFILE_STORAGE_KEY = "imdm-profile";
export const PROFILE_UPDATED_EVENT = "imdm-profile-updated";

export function loadStoredProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProfileRecord) : null;
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: ProfileRecord) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}
