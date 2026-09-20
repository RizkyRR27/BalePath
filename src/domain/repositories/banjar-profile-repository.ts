import type { BanjarProfile } from "@/domain/entities/banjar-profile";

export interface BanjarProfileRepository {
  load(): BanjarProfile[];
  save(profiles: BanjarProfile[]): void;
}
