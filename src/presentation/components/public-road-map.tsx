"use client";

import dynamic from "next/dynamic";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import type { Locale } from "@/presentation/i18n/locale";

// Leaflet memakai window/document — wajib client-side only (tanpa SSR).
const InnerMap = dynamic(() => import("./public-road-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="public-interactive-loading" role="status">
      Memuat peta interaktif…
    </div>
  ),
});

export type PublicRoadMapProps = {
  events: BanjarEvent[];
  selectedId?: string;
  onSelect: (id: string) => void;
  locale: Locale;
};

export function PublicRoadMap({ events, selectedId, onSelect, locale }: PublicRoadMapProps) {
  return <InnerMap events={events} selectedId={selectedId} onSelect={onSelect} locale={locale} />;
}

export default PublicRoadMap;
