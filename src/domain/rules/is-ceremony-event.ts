import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import type { Road } from "@/domain/entities/road";

/** Business rule: what makes a value a valid CeremonyEvent. Takes `roads` in
 * (instead of importing the catalog) so the domain stays free of data concerns. */
export function isCeremonyEvent(value: unknown, roads: Road[]): value is CeremonyEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as CeremonyEvent;
  return [event.id, event.name, event.banjarId, event.banjar, event.meaning].every((v) => typeof v === "string")
    && typeof event.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.date)
    && [event.startTime, event.endTime].every((v) => typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v))
    && event.startTime < event.endTime
    && ["Tutup Total", "Buka-Tutup"].includes(event.closure)
    && roads.some((road) => road.id === event.roadId) && typeof event.published === "boolean";
}
