"use client";

import dynamic from "next/dynamic";
import type { RoadSegment } from "@/domain/entities/road-segment";

// Wajib client-side only agar Leaflet (window/document) tidak memicu SSR error.
const InnerMap = dynamic(() => import("./admin-road-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="admin-road-loading" role="status">
      Memuat peta interaktif Ubud, Bali…
    </div>
  ),
});

export type AdminRoadPickerProps = {
  segments: RoadSegment[];
  onSegmentsChange: (segments: RoadSegment[]) => void;
};

export function AdminRoadPicker({ segments, onSegmentsChange }: AdminRoadPickerProps) {
  return <InnerMap segments={segments} onSegmentsChange={onSegmentsChange} />;
}

export default AdminRoadPicker;
