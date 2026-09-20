import { isRoad } from "@/domain/rules/is-road";
import type { Road } from "@/domain/entities/road";

export function isValidRoad(value: unknown): value is Road { return isRoad(value); }
export function isValidRoadList(value: unknown): value is Road[] { return Array.isArray(value) && value.every(isValidRoad); }
