export type ProfileTone = "solar" | "glacier" | "ember" | "violet";

export type ProfileRecord = {
  name: string;
  email: string;
  password: string;
  tone: ProfileTone;
  avatarUrl?: string | null;
  trustedRegion?: string | null;
};

export const PROFILE_STORAGE_KEY = "imdm-profile";
export const PROFILE_UPDATED_EVENT = "imdm-profile-updated";
export const SESSION_STORAGE_KEY = "imdm-session";
export const SESSION_UPDATED_EVENT = "imdm-session-updated";

export type SessionRecord = {
  email: string;
  signedInAt: string;
};

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

export function loadStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord) : null;
  } catch {
    return null;
  }
}

export function saveStoredSession(session: SessionRecord) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  const hadSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY) !== null;
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);

  if (hadSession) {
    window.dispatchEvent(new Event(SESSION_UPDATED_EVENT));
  }
}

export function getProfileInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  return name.trim().slice(0, 2).toUpperCase() || "ID";
}

export function getLegalNameError(name: string) {
  const trimmedName = name.trim();
  const legalNamePattern = /^[\p{L}]+(?:['-][\p{L}]+)*$/u;
  const blockedWords =
    /\b(test|tester|admin|user|anonymous|fake|void|immersive|dimensions|null|none|unknown|guest)\b/i;

  if (!trimmedName) {
    return "This name is unnaceptable please make sure you put your legal first and last name to continue";
  }

  const parts = trimmedName.split(/\s+/).filter(Boolean);

  if (
    parts.length < 2 ||
    blockedWords.test(trimmedName) ||
    parts.some((part) => part.length < 2 || !legalNamePattern.test(part))
  ) {
    return "This name is unnaceptable please make sure you put your legal first and last name to continue";
  }

  return "";
}
