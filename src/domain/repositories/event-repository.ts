import type { CeremonyEvent } from "@/domain/entities/ceremony-event";

export interface EventRepository {
  load(): CeremonyEvent[];
  save(events: CeremonyEvent[]): void;
}
