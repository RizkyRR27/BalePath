import type { BanjarEvent } from "@/domain/entities/banjar-event";
import type { RoadSegment, RoadSegmentStatus } from "@/domain/entities/road-segment";

const STATUSES: RoadSegmentStatus[] = ["TUTUP_TOTAL", "BUKA_TUTUP", "HANYA_MOTOR", "JALUR_ALTERNATIF"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidSegment(value: unknown): value is RoadSegment {
  if (!value || typeof value !== "object") return false;
  const segment = value as RoadSegment;
  return (
    typeof segment.id === "string" &&
    STATUSES.includes(segment.status) &&
    Array.isArray(segment.coordinates) &&
    segment.coordinates.length >= 2 &&
    segment.coordinates.every(
      (point) =>
        Array.isArray(point) &&
        point.length === 2 &&
        point.every((n) => typeof n === "number" && Number.isFinite(n)) &&
        Math.abs(point[0]) <= 90 &&
        Math.abs(point[1]) <= 180,
    )
  );
}

/** Business rule: BanjarEvent utuh — detail teks terisi + minimal 1 segmen valid. */
export function isBanjarEvent(value: unknown): value is BanjarEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as BanjarEvent;
  return (
    typeof event.id === "string" &&
    typeof event.banjarId === "string" &&
    event.banjarId.trim().length > 0 &&
    typeof event.title === "string" &&
    event.title.trim().length > 0 &&
    typeof event.banjarName === "string" &&
    event.banjarName.trim().length > 0 &&
    DATE.test(event.startDate) &&
    DATE.test(event.endDate) &&
    event.endDate >= event.startDate &&
    TIME.test(event.startTime) &&
    TIME.test(event.endTime) &&
    (event.startDate !== event.endDate || event.startTime < event.endTime) &&
    (event.description === undefined || typeof event.description === "string") &&
    Array.isArray(event.roadSegments) &&
    event.roadSegments.length >= 1 &&
    event.roadSegments.every(isValidSegment) &&
    typeof event.createdAt === "string"
  );
}

export function isBanjarEventList(value: unknown): value is BanjarEvent[] {
  return Array.isArray(value) && value.every(isBanjarEvent);
}
