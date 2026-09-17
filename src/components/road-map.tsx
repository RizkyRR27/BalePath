"use client";

import { useId, useState } from "react";
import { Compass, Layers, Minus, Plus, RotateCcw } from "lucide-react";
import { roads, type CeremonyEvent } from "@/lib/data";
import "./road-map.css";

export type RoadMapProps = {
  events: CeremonyEvent[];
  selectedRoadId?: string;
  onSelectRoad?: (id: string) => void;
};

const coordinates = roads.flatMap((road) => road.coordinates);
const latitudes = coordinates.map((point) => point[0]);
const longitudes = coordinates.map((point) => point[1]);
const minLat = Math.min(...latitudes);
const maxLat = Math.max(...latitudes);
const minLng = Math.min(...longitudes);
const maxLng = Math.max(...longitudes);
const scale = Math.min(640 / Math.max(maxLng - minLng, 0.001), 400 / Math.max(maxLat - minLat, 0.001));

function project([lat, lng]: [number, number]) {
  return [450 + (lng - (minLng + maxLng) / 2) * scale, 310 - (lat - (minLat + maxLat) / 2) * scale];
}

export function RoadMap({ events, selectedRoadId, onSelectRoad }: RoadMapProps) {
  const [zoom, setZoom] = useState(1);
  const [localRoadId, setLocalRoadId] = useState<string>();
  const id = useId().replace(/:/g, "");
  const selected = selectedRoadId ?? localRoadId;
  const mapped = roads.map((road) => {
    const points = road.coordinates.map(project);
    const related = events.filter((event) => event.roadId === road.id);
    const full = related.some((event) => event.closure === "Tutup Total");
    return {
      ...road,
      points,
      path: points.map((point, index) => `${index ? "L" : "M"}${point[0]},${point[1]}`).join(" "),
      color: full ? "#ec7966" : related.length ? "#f3c35c" : "#89877b",
      status: full ? "Tutup Total" : related.length ? "Buka-Tutup" : "Tidak ada jadwal pada filter ini",
      related,
    };
  });
  const focused = mapped.find((road) => road.id === selected);
  const center = focused?.points[Math.floor(focused.points.length / 2)] ?? [450, 310];
  const viewWidth = 900 / zoom;
  const viewHeight = 620 / zoom;
  const cx = zoom === 1 ? 450 : center[0];
  const cy = zoom === 1 ? 310 : center[1];

  function selectRoad(roadId: string) {
    setLocalRoadId(roadId);
    onSelectRoad?.(roadId);
  }

  return (
    <section className="public-road-map" aria-label="Peta skematis ruas jalan Ubud">
      <div className="public-road-map-canvas">
        <div className="public-road-map-label"><Layers size={13} aria-hidden="true" /> PETA SKEMATIS · UBUD</div>
        <svg viewBox={`${cx - viewWidth / 2} ${cy - viewHeight / 2} ${viewWidth} ${viewHeight}`} aria-labelledby={`${id}-title ${id}-description`} role="img">
          <title id={`${id}-title`}>Simulasi ruas jalan Ubud</title>
          <desc id={`${id}-description`}>Klik ruas atau gunakan tombol nama jalan di bawah peta. Warna menunjukkan jadwal pada filter, bukan kondisi lalu lintas langsung.</desc>
          <defs>
            <pattern id={`${id}-grid`} width="52" height="52" patternUnits="userSpaceOnUse"><path d="M52 0H0V52" fill="none" stroke="#77795b" strokeOpacity=".09" /></pattern>
            <pattern id={`${id}-blocks`} width="146" height="118" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><rect x="12" y="12" width="47" height="34" rx="3" fill="#23251e" /><rect x="70" y="18" width="59" height="68" rx="3" fill="#20231c" /><rect x="16" y="60" width="42" height="42" rx="3" fill="#1e211a" /><path d="M0 110H146M138 0V118" stroke="#36372a" strokeWidth="2" fill="none" /></pattern>
            <radialGradient id={`${id}-aura`}><stop stopColor="#89713e" stopOpacity=".18" /><stop offset="1" stopColor="#89713e" stopOpacity="0" /></radialGradient>
          </defs>
          <rect x="-1500" y="-1500" width="4000" height="4000" fill={`url(#${id}-grid)`} />
          <rect x="-400" y="-400" width="1800" height="1400" fill={`url(#${id}-blocks)`} />
          <path d="M95 -200C330 30 45 230 155 390S90 720 40 880" stroke="#233c30" strokeWidth="58" fill="none" opacity=".5" />
          <path d="M95 -200C330 30 45 230 155 390S90 720 40 880" stroke="#355342" strokeWidth="3" fill="none" opacity=".6" />
          <path d="M815 -140C650 150 885 340 770 500S740 850 820 910" stroke="#2b3c28" strokeWidth="80" fill="none" opacity=".4" />
          <ellipse cx="465" cy="310" rx="340" ry="290" fill={`url(#${id}-aura)`} />
          <text x="450" y="60" fill="#b0af93" fontSize="22" letterSpacing="12" textAnchor="middle">UBUD</text>
          <text x="450" y="84" fill="#91927a" fontSize="11" letterSpacing="4" textAnchor="middle">GIANYAR · BALI</text>
          {mapped.map((road, index) => {
            const midpoint = road.points[Math.floor(road.points.length / 2)];
            if (!midpoint) return null;
            return (
              <g key={road.id} className="public-road-map-segment" onClick={() => selectRoad(road.id)}>
                {road.id === selected && <path d={road.path} fill="none" stroke="#f3c35c" strokeWidth="24" strokeOpacity=".17" strokeLinecap="round" strokeLinejoin="round" />}
                <path d={road.path} fill="none" stroke="#11130f" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
                <path d={road.path} fill="none" stroke={road.color} strokeWidth={road.related.length ? 7 : 4} strokeLinecap="round" strokeLinejoin="round" />
                {road.related.length > 0 && <path d={road.path} fill="none" stroke="#1a1b15" strokeWidth="2" strokeDasharray={road.status === "Tutup Total" ? "3 9" : "12 8"} />}
                <path d={road.path} fill="none" stroke="transparent" strokeWidth="44" vectorEffect="non-scaling-stroke" />
                <circle cx={midpoint[0]} cy={midpoint[1]} r="16" fill="#1b1c17" stroke={road.id === selected ? "#f8e1a4" : road.color} strokeWidth="2" />
                <text x={midpoint[0]} y={midpoint[1] + 5} fill="#f7edda" textAnchor="middle" fontSize="14" fontWeight="700">{index + 1}</text>
                <text x={midpoint[0] + 23} y={midpoint[1] - 20} fill="#ded7c5" fontSize="15" paintOrder="stroke" stroke="#151714" strokeWidth="5" strokeLinejoin="round">{road.name}</text>
              </g>
            );
          })}
        </svg>
        <div className="public-road-map-controls" role="group" aria-label="Kontrol pembesaran peta">
          <button type="button" disabled={zoom >= 2.5} onClick={() => setZoom((value) => Math.min(2.5, value + .5))} aria-label="Perbesar peta"><Plus size={19} aria-hidden="true" /></button>
          <button type="button" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - .5))} aria-label="Perkecil peta"><Minus size={19} aria-hidden="true" /></button>
          <button type="button" onClick={() => setZoom(1)} aria-label="Reset tampilan peta"><RotateCcw size={17} aria-hidden="true" /></button>
        </div>
        <div className="public-road-map-compass"><Compass size={29} strokeWidth={1} aria-hidden="true" /><span>UTARA<small>SKEMA TANPA SKALA</small></span></div>
        <span className="public-road-map-zoom" role="status" aria-live="polite">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="public-road-map-footer">
        <div className="public-road-map-legend"><span><i className="public-road-map-full" />Tutup Total</span><span><i className="public-road-map-partial" />Buka-Tutup</span><span><i className="public-road-map-neutral" />Tanpa jadwal pada filter</span></div>
        <div className="public-road-map-roads" role="group" aria-label="Pilih ruas jalan">
          {mapped.map((road, index) => <button key={road.id} type="button" onClick={() => selectRoad(road.id)} aria-pressed={selected === road.id} aria-label={`${road.name}: ${road.related.length ? road.status : "Tidak ada jadwal pada filter ini"}`}><span style={{ color: road.color }}>{String(index + 1).padStart(2, "0")}</span>{road.name}</button>)}
        </div>
        <p>Simulasi, bukan navigasi. Warna merangkum jadwal yang ditampilkan, bukan kondisi lalu lintas langsung.</p>
      </div>
    </section>
  );
}

export default RoadMap;
