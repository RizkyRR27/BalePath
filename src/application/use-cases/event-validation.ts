import { isCeremonyEvent } from "@/domain/rules/is-ceremony-event";
import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import { roads } from "@/data/catalog/demo-data";

export function isValidEvent(value: unknown): value is CeremonyEvent { return isCeremonyEvent(value, roads); }
export function isValidEventList(value: unknown): value is CeremonyEvent[] { return Array.isArray(value) && value.every(isValidEvent); }
