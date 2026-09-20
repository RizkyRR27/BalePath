import type { EmergencyContactRepository } from "@/domain/repositories/emergency-contact-repository";
import { isValidEmergencyContactList } from "@/application/use-cases/emergency-contact-validation";
import { initialEmergencyContacts } from "@/infrastructure/dummy/dummy-emergency-contacts";
import { createEmergencyContactRepository } from "@/infrastructure/storage/session-storage";

export function createDummyEmergencyContactRepository(): EmergencyContactRepository {
  return createEmergencyContactRepository(initialEmergencyContacts, isValidEmergencyContactList);
}
