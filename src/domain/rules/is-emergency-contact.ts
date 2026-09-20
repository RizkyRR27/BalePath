import type { EmergencyContact } from "@/domain/entities/emergency-contact";

/** Business rule: what makes a value a valid EmergencyContact. */
export function isEmergencyContact(value: unknown): value is EmergencyContact {
  if (!value || typeof value !== "object") return false;
  const contact = value as EmergencyContact;
  return [contact.id, contact.banjarId, contact.postName].every((field) => typeof field === "string" && field.trim().length > 0)
    && typeof contact.phone === "string" && typeof contact.whatsapp === "string"
    && typeof contact.verified === "boolean";
}
