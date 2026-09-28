import type { CustomerUser } from "@/context/StoreContext";

const USER_PROFILES_KEY = "enviaar_user_profiles_db";

export function getAllSavedUserProfiles(): Record<string, CustomerUser> {
  try {
    const raw = localStorage.getItem(USER_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Error reading user profiles from localStorage", err);
    return {};
  }
}

export function getSavedUserProfile(email?: string): CustomerUser | null {
  if (!email) return null;
  const profiles = getAllSavedUserProfiles();
  return profiles[email.toLowerCase().trim()] || null;
}

export function saveUserProfile(profile: CustomerUser): CustomerUser {
  if (!profile.email) return profile;
  const emailKey = profile.email.toLowerCase().trim();
  const profiles = getAllSavedUserProfiles();
  const existing = profiles[emailKey] || {};
  const updated = { ...existing, ...profile };
  profiles[emailKey] = updated;
  try {
    localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error("Error saving user profile to localStorage", err);
  }
  return updated;
}
