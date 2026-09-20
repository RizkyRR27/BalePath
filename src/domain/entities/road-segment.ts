export type RoadSegmentStatus =
  | "TUTUP_TOTAL"
  | "BUKA_TUTUP"
  | "HANYA_MOTOR"
  | "JALUR_ALTERNATIF";

/**
 * Alias sesuai kontrak antarmuka bersama (spesifikasi fitur):
 * `RoadStatus` dipakai di `RoadSegment.status` dan dibaca modul admin & publik.
 * Nilai literal dipertahankan dalam Bahasa Indonesia agar konsisten dengan
 * SEGMENT_META, seeds, validasi, dan kamus i18n yang sudah ada.
 */
export type RoadStatus = RoadSegmentStatus;

export type RoadSegment = {
  id: string;
  status: RoadSegmentStatus;
  /** Koordinat Leaflet: [lat, lng] — siap disimpan sebagai dummy / dikirim ke PostGIS. */
  coordinates: [number, number][];
  distanceMeters?: number;
  createdAt: string;
};

export const SEGMENT_META: Record<
  RoadSegmentStatus,
  { label: string; color: string; dashArray?: string; weight: number }
> = {
  TUTUP_TOTAL: {
    label: "TUTUP TOTAL",
    color: "#dc2626",
    dashArray: "8 8",
    weight: 6,
  },
  BUKA_TUTUP: {
    label: "BUKA-TUTUP",
    color: "#f59e0b",
    weight: 7,
  },
  HANYA_MOTOR: {
    label: "HANYA MOTOR",
    color: "#2563eb",
    weight: 5,
  },
  JALUR_ALTERNATIF: {
    label: "JALUR ALTERNATIF",
    color: "#16a34a",
    weight: 5,
  },
};

/** Titik awal fokus peta: Ubud, Bali. */
export const BALI_FOCUS: [number, number] = [-8.5069, 115.262];
