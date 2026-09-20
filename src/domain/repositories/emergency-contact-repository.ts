import type { EmergencyContact } from "@/domain/entities/emergency-contact";

export interface EmergencyContactRepository {
  load(): EmergencyContact[];
  save(contacts: EmergencyContact[]): void;
}
