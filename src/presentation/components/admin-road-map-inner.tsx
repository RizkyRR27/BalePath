"use client";

import { useCallback, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MousePointerClick, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  BALI_FOCUS,
  SEGMENT_META,
  type RoadSegment,
  type RoadSegmentStatus,
} from "@/domain/entities/road-segment";
import "@/presentation/styles/admin-road-map.css";

export type AdminRoadMapInnerProps = {
  segments: RoadSegment[];
  onSegmentsChange: (segments: RoadSegment[]) => void;
};

type LatLng = [number, number];

function ClickHandler({ onPick }: { onPick: (point: LatLng) => void }) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

async function fetchSnappedRoute(from: LatLng, to: LatLng) {
  // OSRM publik: format lng,lat. Response geometry GeoJSON [lng,lat] -> balik ke [lat,lng].
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OSRM ${response.status}`);
  const json = await response.json();
  const route = json?.routes?.[0];
  if (!route?.geometry?.coordinates?.length) throw new Error("Rute tidak ditemukan");
  const coordinates: LatLng[] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng] as LatLng,
  );
  return { coordinates, distanceMeters: Math.round(route.distance ?? 0) };
}

const STATUS_ORDER: RoadSegmentStatus[] = [
  "TUTUP_TOTAL",
  "BUKA_TUTUP",
  "HANYA_MOTOR",
  "JALUR_ALTERNATIF",
];

export function AdminRoadMapInner({ segments, onSegmentsChange }: AdminRoadMapInnerProps) {
  const [status, setStatus] = useState<RoadSegmentStatus>("TUTUP_TOTAL");
  const [pointA, setPointA] = useState<LatLng | null>(null);
  const [pointB, setPointB] = useState<LatLng | null>(null);
  const [preview, setPreview] = useState<{ coordinates: LatLng[]; distanceMeters: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = useCallback(
    async (point: LatLng) => {
      setError("");
      if (!pointA) {
        setPointA(point);
        return;
      }
      if (!pointB) {
        setPointB(point);
        setLoading(true);
        setPreview(null);
        try {
          const snapped = await fetchSnappedRoute(pointA, point);
          setPreview(snapped);
        } catch {
          // Fallback: garis lurus A->B agar admin tetap bisa menyimpan segmen.
          setPreview({ coordinates: [pointA, point], distanceMeters: 0 });
          setError("OSRM tidak dapat menemukan rute jalan, memakai garis lurus sebagai fallback.");
        } finally {
          setLoading(false);
        }
        return;
      }
      // Klik ketiga: mulai ulang pasangan titik.
      setPointA(point);
      setPointB(null);
      setPreview(null);
    },
    [pointA, pointB],
  );

  function resetPoints() {
    setPointA(null);
    setPointB(null);
    setPreview(null);
    setError("");
  }

  function saveSegment() {
    if (!preview) return;
    const segment: RoadSegment = {
      id: crypto.randomUUID(),
      status,
      coordinates: preview.coordinates,
      distanceMeters: preview.distanceMeters,
      createdAt: new Date().toISOString(),
    };
    onSegmentsChange([...segments, segment]);
    resetPoints();
  }

  function removeSegment(id: string) {
    onSegmentsChange(segments.filter((segment) => segment.id !== id));
  }

  const previewStyle = SEGMENT_META[status];

  return (
    <div className="admin-road-map" data-testid="admin-road-map">
      <div className="admin-road-status" role="radiogroup" aria-label="Status ruas jalan">
        {STATUS_ORDER.map((value) => {
          const meta = SEGMENT_META[value];
          const active = status === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setStatus(value)}
              className={`admin-road-status-button${active ? " active" : ""}`}
              style={active ? { borderColor: meta.color } : undefined}
            >
              <span
                className="admin-road-status-dot"
                style={{
                  backgroundColor: meta.color,
                  borderTop: meta.dashArray ? `3px dashed ${meta.color}` : undefined,
                }}
              />
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="admin-road-map-frame">
        <MapContainer
          center={BALI_FOCUS}
          zoom={15}
          scrollWheelZoom
          className="admin-road-map-leaflet"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={pick} />
          {pointA && (
            <CircleMarker center={pointA} radius={8} pathOptions={{ color: "#ffc665", weight: 3 }}>
              <Tooltip direction="top" offset={[0, -8]} permanent>
                Titik A
              </Tooltip>
            </CircleMarker>
          )}
          {pointB && (
            <CircleMarker center={pointB} radius={8} pathOptions={{ color: "#ffc665", weight: 3 }}>
              <Tooltip direction="top" offset={[0, -8]} permanent>
                Titik B
              </Tooltip>
            </CircleMarker>
          )}
          {preview && (
            <Polyline
              positions={preview.coordinates}
              pathOptions={{
                color: previewStyle.color,
                weight: previewStyle.weight,
                dashArray: previewStyle.dashArray,
              }}
            />
          )}
          {segments.map((segment) => {
            const meta = SEGMENT_META[segment.status];
            return (
              <Polyline
                key={segment.id}
                positions={segment.coordinates}
                pathOptions={{
                  color: meta.color,
                  weight: meta.weight,
                  dashArray: meta.dashArray,
                }}
              >
                <Tooltip sticky>{meta.label}</Tooltip>
              </Polyline>
            );
          })}
        </MapContainer>
        <p className="admin-road-hint">
          <MousePointerClick size={14} aria-hidden="true" />
          {pointA == null
            ? "Klik peta untuk Titik A (awal ruas)."
            : pointB == null
              ? "Titik A terkunci. Klik lagi untuk Titik B — garis jalan otomatis mengikuti lekukan via OSRM."
              : loading
                ? "Menarik garis mengikuti jalan via OSRM…"
                : "Pratinjau siap. Simpan ruas atau reset bila salah klik."}
        </p>
      </div>

      {error && (
        <p role="alert" className="admin-road-error">
          {error}
        </p>
      )}

      <div className="admin-road-actions">
        <button type="button" className="button secondary" onClick={resetPoints} disabled={!pointA && !pointB}>
          <RotateCcw size={15} /> Reset Titik Aktif
        </button>
        <button
          type="button"
          className="button primary"
          onClick={saveSegment}
          disabled={!preview || loading}
        >
          <Plus size={15} /> Simpan Ruas ({SEGMENT_META[status].label})
        </button>
      </div>

      <div className="admin-road-list" aria-live="polite">
        <p className="eyebrow">Segmen aktif · {segments.length}</p>
        {segments.length === 0 ? (
          <p className="muted small">Belum ada segmen. Contoh: tandai Jl. Raya Ubud Tutup Total, lalu gang sebelahnya sebagai Jalur Alternatif.</p>
        ) : (
          <ul>
            {segments.map((segment, index) => {
              const meta = SEGMENT_META[segment.status];
              return (
                <li key={segment.id} className="admin-road-item">
                  <span className="admin-road-badge" style={{ backgroundColor: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="admin-road-item-text">
                    <strong>Segmen {index + 1}</strong>
                    <small>
                      {segment.coordinates.length} titik
                      {typeof segment.distanceMeters === "number" && segment.distanceMeters > 0
                        ? ` · ±${(segment.distanceMeters / 1000).toFixed(2)} km`
                        : ""}
                    </small>
                  </span>
                  <button
                    type="button"
                    className="icon-button danger"
                    aria-label={`Hapus segmen ${index + 1} ${meta.label}`}
                    onClick={() => removeSegment(segment.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminRoadMapInner;
