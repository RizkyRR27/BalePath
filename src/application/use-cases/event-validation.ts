import { isCeremonyEvent } from "@/domain/rules/is-ceremony-event";
import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import type { Road } from "@/domain/entities/road";

/** Roads come in as a parameter because the catalog is dynamic (admin-managed). */
export function isValidEvent(value: unknown, roads: Road[]): value is CeremonyEvent { return isCeremonyEvent(value, roads); }
export function isValidEventList(value: unknown, roads: Road[]): value is CeremonyEvent[] { return Array.isArray(value) && value.every((event) => isValidEvent(event, roads)); }
