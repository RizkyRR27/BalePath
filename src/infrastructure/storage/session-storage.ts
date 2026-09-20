import type { EventRepository } from "@/domain/repositories/event-repository";
import type { Session, SessionRepository } from "@/domain/repositories/session-repository";
import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import type { RoadRepository } from "@/domain/repositories/road-repository";
import type { BanjarProfileRepository } from "@/domain/repositories/banjar-profile-repository";
import type { EmergencyContactRepository } from "@/domain/repositories/emergency-contact-repository";
import type { Road } from "@/domain/entities/road";
import type { BanjarProfile } from "@/domain/entities/banjar-profile";
import type { EmergencyContact } from "@/domain/entities/emergency-contact";

export function createSessionStorageRepository<T>(key: string, fallback: T, validate: (value: unknown) => value is T) {
  return {
    load(): T {
      try { const value: unknown = JSON.parse(sessionStorage.getItem(key) ?? "null"); return validate(value) ? value : fallback; } catch { return fallback; }
    },
    save(value: T) { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } },
    clear() { try { sessionStorage.removeItem(key); } catch { /* storage unavailable */ } },
  };
}

export function createEventRepository(fallback: CeremonyEvent[], validate: (value: unknown) => value is CeremonyEvent[]): EventRepository {
  return createSessionStorageRepository("balepath.demo.events.v1", fallback, validate);
}

export function createSessionRepository(): SessionRepository {
  return createSessionStorageRepository<Session | null>("balepath.demo.session.v1", null, (value): value is Session | null => value === null || (!!value && typeof value === "object" && typeof (value as Session).id === "string" && typeof (value as Session).expires === "number"));
}

export function createRoadRepository(fallback: Road[], validate: (value: unknown) => value is Road[]): RoadRepository {
  return createSessionStorageRepository("balepath.demo.roads.v1", fallback, validate);
}

export function createBanjarProfileRepository(fallback: BanjarProfile[], validate: (value: unknown) => value is BanjarProfile[]): BanjarProfileRepository {
  return createSessionStorageRepository("balepath.demo.banjar-profiles.v1", fallback, validate);
}

export function createEmergencyContactRepository(fallback: EmergencyContact[], validate: (value: unknown) => value is EmergencyContact[]): EmergencyContactRepository {
  return createSessionStorageRepository("balepath.demo.emergency-contacts.v1", fallback, validate);
}
