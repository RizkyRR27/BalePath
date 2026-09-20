import type { BanjarProfileRepository } from "@/domain/repositories/banjar-profile-repository";
import { isValidBanjarProfileList } from "@/application/use-cases/banjar-profile-validation";
import { initialBanjarProfiles } from "@/infrastructure/dummy/dummy-banjar-profiles";
import { createBanjarProfileRepository } from "@/infrastructure/storage/session-storage";

export function createDummyBanjarProfileRepository(): BanjarProfileRepository {
  return createBanjarProfileRepository(initialBanjarProfiles, isValidBanjarProfileList);
}
