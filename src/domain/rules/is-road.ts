import type { Road } from "@/domain/entities/road";

/** Business rule: what makes a value a valid Road. */
export function isRoad(value: unknown): value is Road {
  if (!value || typeof value !== "object") return false;
  const road = value as Road;
  return typeof road.id === "string" && road.id.trim().length > 0
    && typeof road.name === "string" && road.name.trim().length > 0
    && Array.isArray(road.coordinates) && road.coordinates.length >= 2
    && road.coordinates.every((point) => Array.isArray(point) && point.length === 2
      && typeof point[0] === "number" && Number.isFinite(point[0])
      && typeof point[1] === "number" && Number.isFinite(point[1]));
}
