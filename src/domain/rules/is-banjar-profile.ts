import type { BanjarProfile } from "@/domain/entities/banjar-profile";

/** Business rule: what makes a value a valid BanjarProfile. */
export function isBanjarProfile(value: unknown): value is BanjarProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as BanjarProfile;
  return [profile.banjarId, profile.name, profile.location, profile.description, profile.contactName, profile.contactPhone]
    .every((field) => typeof field === "string" && field.trim().length > 0);
}
