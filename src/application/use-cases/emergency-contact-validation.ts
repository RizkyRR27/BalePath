import { isEmergencyContact } from "@/domain/rules/is-emergency-contact";
import type { EmergencyContact } from "@/domain/entities/emergency-contact";

export function isValidEmergencyContact(value: unknown): value is EmergencyContact { return isEmergencyContact(value); }
export function isValidEmergencyContactList(value: unknown): value is EmergencyContact[] { return Array.isArray(value) && value.every(isValidEmergencyContact); }
