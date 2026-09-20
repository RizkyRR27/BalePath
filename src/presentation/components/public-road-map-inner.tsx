"use client";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { BALI_FOCUS, SEGMENT_META } from "@/domain/entities/road-segment";
import { formatDate } from "@/domain/formatters/format-date";
import type { Locale } from "@/presentation/i18n/locale";
import "@/presentation/styles/public-road-map.css";

export type PublicRoadMapInnerProps = {
  events: BanjarEvent[];
  selectedId?: string;
  onSelect: (id: string) => void;
  locale: Locale;
};

function midpointOf(event: BanjarEvent): [number, number] {
  const longest = [...event.roadSegments].sort((a, b) => b.coordinates.length - a.coordinates.length)[0];
  const points = longest?.coordinates ?? [BALI_FOCUS];
  return points[Math.floor(points.length / 2)];
}

function scheduleOf(event: BanjarEvent, locale: Locale) {
  const range =
    event.startDate === event.endDate
      ? formatDate(event.startDate, locale)
      : `${formatDate(event.startDate, locale)} – ${formatDate(event.endDate, locale)}`;
  return `${range} · ${event.startTime}–${event.endTime} WITA`;
}

function FitToEvents({ events }: { events: BanjarEvent[] }) {
  const map = useMap();
  useEffect(() => {
    const points = events.flatMap((event) => event.roadSegments.flatMap((segment) => segment.coordinates));
    if (points.length === 0) return;
    map.fitBounds(latLngBounds(points).pad(0.2));
  }, [events, map]);
  return null;
}

export function PublicRoadMapInner({ events, selectedId, onSelect, locale }: PublicRoadMapInnerProps) {
  return (
    <div className="public-interactive-map" data-testid="public-road-map">
      <MapContainer center={BALI_FOCUS} zoom={14} scrollWheelZoom className="public-interactive-leaflet">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToEvents events={events} />
        {events.flatMap((event) => {
          const selected = event.id === selectedId;
          return event.roadSegments.map((segment) => {
            const meta = SEGMENT_META[segment.status];
            return (
              <Polyline
                key={segment.id}
                positions={segment.coordinates}
                eventHandlers={{ click: () => onSelect(event.id) }}
                pathOptions={{
                  color: meta.color,
                  weight: selected ? meta.weight + 2 : meta.weight,
                  dashArray: meta.dashArray,
                  opacity: selected || !selectedId ? 1 : 0.55,
                }}
              >
                <Popup className="public-map-popup" maxWidth={280}>
                  <strong>{event.title}</strong>
                  <br />
                  <span>
                    {event.banjarName} · {scheduleOf(event, locale)}
                  </span>
                  <br />
                  <span className="admin-road-badge" style={{ backgroundColor: meta.color }}>
                    {meta.label}
                  </span>
                  {event.description && (
                    <>
                      <br />
                      <span>{event.description}</span>
                    </>
                  )}
                </Popup>
              </Polyline>
            );
          });
        })}
        {events.map((event) => (
          <CircleMarker
            key={`marker-${event.id}`}
            center={midpointOf(event)}
            radius={event.id === selectedId ? 11 : 8}
            eventHandlers={{ click: () => onSelect(event.id) }}
            pathOptions={{ color: "#ffc665", weight: 3, fillColor: "#1c1b1a", fillOpacity: 1 }}
          >
            <Tooltip direction="top" offset={[0, -10]} sticky>
              {event.title} · {event.banjarName}
            </Tooltip>
            <Popup className="public-map-popup" maxWidth={280}>
              <strong>{event.title}</strong>
              <br />
              <span>
                {event.banjarName} · {scheduleOf(event, locale)}
              </span>
              <br />
              {[...new Set(event.roadSegments.map((segment) => segment.status))].map((status) => (
                <span
                  key={status}
                  className="admin-road-badge"
                  style={{ backgroundColor: SEGMENT_META[status].color, marginRight: 4 }}
                >
                  {SEGMENT_META[status].label}
                </span>
              ))}
              {event.description && (
                <>
                  <br />
                  <span>{event.description}</span>
                </>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PublicRoadMapInner;
