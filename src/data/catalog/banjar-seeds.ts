import type { BanjarEvent } from "@/domain/entities/banjar-event";
import type { RoadSegment, RoadSegmentStatus } from "@/domain/entities/road-segment";
import { DEMO_DATE } from "@/data/catalog/demo-data";

/**
 * Data inisial secukupnya untuk shared store BanjarEvent.
 * Dipakai hanya saat localStorage masih kosong — BUKAN hardcoded di komponen peta.
 * Koordinat di kawasan Ubud, Gianyar (sejalan dengan peta publik).
 * Jumlah > PAGE_SIZE dashboard (10) agar pagination halaman 2+ langsung terlihat.
 */

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/** Koordinat deterministik per baris agar tiap event punya garis ruas berbeda. */
function seedCoords(row: number, variant: number): [number, number][] {
  const lat = -8.498 - ((row * 3 + variant) % 9) * 0.0018;
  const lng = 115.2555 + ((row * 5 + variant * 2) % 8) * 0.0016;
  return [
    [round4(lat), round4(lng)],
    [round4(lat - 0.0016), round4(lng + 0.0018)],
    [round4(lat - 0.0032), round4(lng + 0.0032)],
  ];
}

type ExtraSeedRow = [
  title: string,
  banjarName: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  description: string,
  statuses: RoadSegmentStatus[],
];

const EXTRA_SEED_ROWS: ExtraSeedRow[] = [
  ["Prosesi Melasti ke Beji", "Banjar Padangtegal", "2026-09-23", "2026-09-23", "06:00", "10:00", "Melasti menyucikan pratima ke sumber air suci. Jangan memotong barisan iring-iringan.", ["TUTUP_TOTAL"]],
  ["Pawiwahan Krama Banjar", "Banjar Pengosekan", "2026-09-21", "2026-09-21", "08:00", "13:00", "Upacara pernikahan adat. Berkendaralah perlahan dan hormati tamu yang hadir.", ["BUKA_TUTUP"]],
  ["Pujawali Pura Dalem", "Banjar Nyuh Kuning", "2026-09-24", "2026-09-26", "15:00", "22:00", "Peringatan hari suci Pura Dalem selama tiga hari. Ikuti kantong parkir dan arahan pecalang.", ["TUTUP_TOTAL", "JALUR_ALTERNATIF"]],
  ["Mecaru Rsi Gana", "Banjar Peliatan", "2026-09-27", "2026-09-27", "10:00", "14:00", "Caru untuk keseimbangan alam semesta. Kurangi kecepatan di sekitar lokasi upacara.", ["BUKA_TUTUP"]],
  ["Ngaben Alit Keluarga", "Banjar Mas", "2026-09-28", "2026-09-28", "09:00", "15:00", "Ngaben keluarga dengan iringan bade kecil. Beri ruang bagi pengusung dan jaga ketenangan.", ["TUTUP_TOTAL", "HANYA_MOTOR"]],
  ["Piodalan Pura Puseh", "Banjar Lodtunduh", "2026-10-01", "2026-10-01", "13:00", "20:00", "Piodalan Pura Puseh desa. Hindari klakson di sekitar pura dan pejalan kaki bersembahyang.", ["BUKA_TUTUP"]],
  ["Karya Ngusaba Desa", "Banjar Singakerta", "2026-10-03", "2026-10-04", "07:00", "17:00", "Ngusaba desa dua hari dengan pawai hasil bumi. Gunakan jalur alternatif yang ditandai hijau.", ["TUTUP_TOTAL", "JALUR_ALTERNATIF"]],
  ["Tumpek Uduh", "Banjar Kedewatan", "2026-10-05", "2026-10-05", "08:00", "12:00", "Penghormatan pada tumbuh-tumbuhan. Ruas sempit hanya dapat dilalui sepeda motor.", ["HANYA_MOTOR"]],
  ["Saraswati & Banyu Pinaruh", "Banjar Ubud Kelod", "2026-10-08", "2026-10-08", "06:00", "11:00", "Hari ilmu pengetahuan dan pembersihan pagi. Pejalan kaki siswa memadati gang sekitar sekolah.", ["BUKA_TUTUP"]],
  ["Pagerwesi", "Banjar Ubud Kaja", "2026-10-12", "2026-10-12", "09:00", "16:00", "Pagerwesi menguatkan keteguhan iman. Jalan depan pura ditutup total selama persembahyangan.", ["TUTUP_TOTAL"]],
  ["Purnama Kapat", "Banjar Pengosekan", "2026-10-15", "2026-10-15", "17:00", "21:00", "Persembahyangan bulan purnama. Ruas utama padat, motor diarahkan ke gang alternatif.", ["HANYA_MOTOR", "JALUR_ALTERNATIF"]],
  ["Ngaben Massal", "Banjar Padangtegal", "2026-10-18", "2026-10-18", "08:00", "17:00", "Ngaben massal dengan beberapa bade. Rekayasa arus besar, ikuti rambu dan petugas.", ["TUTUP_TOTAL", "BUKA_TUTUP"]],
  ["Piodalan Pura Taman", "Banjar Nyuh Kuning", "2026-10-22", "2026-10-22", "14:00", "21:00", "Piodalan pura taman keluarga. Sistem buka-tutup diberlakukan bergantian oleh pecalang.", ["BUKA_TUTUP"]],
  ["Siwaratri", "Banjar Peliatan", "2026-10-25", "2026-10-25", "18:00", "23:00", "Malam perenungan Siwaratri. Lalu lintas malam dialihkan, hanya motor yang melintas.", ["HANYA_MOTOR"]],
  ["Galungan · Penyambutan Penjor", "Banjar Mas", "2026-11-02", "2026-11-02", "07:00", "12:00", "Pemasangan penjor di sepanjang jalan. Bahu jalan menyempit, gunakan jalur alternatif.", ["BUKA_TUTUP", "JALUR_ALTERNATIF"]],
  ["Kuningan", "Banjar Lodtunduh", "2026-11-12", "2026-11-12", "08:00", "15:00", "Puncak perayaan Galungan-Kuningan. Jalan prosesi ditutup total hingga upacara selesai.", ["TUTUP_TOTAL"]],
  ["Pawai Ogoh-ogoh Mini", "Banjar Singakerta", "2026-11-15", "2026-11-15", "16:00", "22:00", "Pawai ogoh-ogoh sekaa teruna keliling desa. Jangan menerobos barisan arak-arakan.", ["TUTUP_TOTAL", "JALUR_ALTERNATIF"]],
  ["Tilem · Sembahyang Bersama", "Banjar Kedewatan", "2026-11-18", "2026-11-18", "17:00", "20:00", "Persembahyangan bulan mati. Gang pura hanya untuk motor dan pejalan kaki.", ["HANYA_MOTOR"]],
  ["Karya Padudusan Alit", "Banjar Ubud Kelod", "2026-11-21", "2026-11-22", "09:00", "16:00", "Penyucian dua hari di pura keluarga besar. Buka-tutup bergantian di kedua ruas.", ["BUKA_TUTUP", "BUKA_TUTUP"]],
];

function buildExtraSeeds(): BanjarEvent[] {
  return EXTRA_SEED_ROWS.map((row, index) => {
    const [title, , startDate, endDate, startTime, endTime, description, statuses] = row;
    // Bagi rata ke 2 banjar demo agar tiap akun melihat ±11 event (2 halaman):
    // indeks genap → Padangtegal, ganjil → Ubud Kaja.
    const owner =
      index % 2 === 0
        ? { banjarId: "padangtegal", banjarName: "Banjar Padangtegal" }
        : { banjarId: "ubud-kaja", banjarName: "Banjar Ubud Kaja" };
    const id = `BE-${String(index + 4).padStart(3, "0")}`;
    const roadSegments: RoadSegment[] = statuses.map((status, segIndex) => ({
      id: `${id}-seg-${segIndex + 1}`,
      status,
      coordinates: seedCoords(index, segIndex),
      createdAt: `2026-09-17T07:${String(10 + index * 2).padStart(2, "0")}:00.000Z`,
    }));
    return {
      id,
      ...owner,
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
      roadSegments,
      createdAt: `2026-09-17T07:${String(10 + index * 2).padStart(2, "0")}:00.000Z`,
    };
  });
}
export const banjarEventSeeds: BanjarEvent[] = [
  {
    id: "BE-001",
    banjarId: "ubud-kaja",
    title: "Pitra Yadnya · Ngaben Ageng",
    banjarName: "Banjar Ubud Kaja",
    startDate: DEMO_DATE,
    endDate: DEMO_DATE,
    startTime: "11:00",
    endTime: "16:30",
    description:
      "Ngaben adalah upacara penghormatan kepada yang telah berpulang, mengembalikan unsur tubuh kepada alam. Hormati prosesi dan ikuti arahan pecalang.",
    roadSegments: [
      {
        id: "BE-001-seg-1",
        status: "TUTUP_TOTAL",
        coordinates: [
          [-8.5069, 115.257],
          [-8.5068, 115.262],
          [-8.5067, 115.267],
        ],
        createdAt: "2026-09-17T04:00:00.000Z",
      },
      {
        id: "BE-001-seg-2",
        status: "JALUR_ALTERNATIF",
        coordinates: [
          [-8.501, 115.262],
          [-8.504, 115.262],
          [-8.5068, 115.262],
        ],
        createdAt: "2026-09-17T04:05:00.000Z",
      },
    ],
    createdAt: "2026-09-17T04:00:00.000Z",
  },
  {
    id: "BE-002",
    banjarId: "ubud-kaja",
    title: "Piodalan Pura Desa & Puseh",
    banjarName: "Banjar Ubud Kaja",
    startDate: "2026-09-19",
    endDate: "2026-09-19",
    startTime: "14:00",
    endTime: "21:00",
    description:
      "Piodalan merupakan peringatan hari suci sebuah pura. Berikan ruang kepada umat yang bersembahyang dan hindari membunyikan klakson di sekitar prosesi.",
    roadSegments: [
      {
        id: "BE-002-seg-1",
        status: "BUKA_TUTUP",
        coordinates: [
          [-8.5069, 115.257],
          [-8.51, 115.2575],
          [-8.514, 115.259],
        ],
        createdAt: "2026-09-17T05:00:00.000Z",
      },
      {
        id: "BE-002-seg-2",
        status: "HANYA_MOTOR",
        coordinates: [
          [-8.5067, 115.267],
          [-8.51, 115.2675],
          [-8.514, 115.268],
        ],
        createdAt: "2026-09-17T05:05:00.000Z",
      },
    ],
    createdAt: "2026-09-17T05:00:00.000Z",
  },
  {
    id: "BE-003",
    banjarId: "padangtegal",
    title: "Karya Agung & Pawai Gebogan",
    banjarName: "Banjar Padangtegal",
    startDate: "2026-09-19",
    endDate: "2026-09-21",
    startTime: "08:00",
    endTime: "18:00",
    description:
      "Rangkaian karya selama tiga hari dengan pawai gebogan di sekitar pura. Contoh kegiatan multi-hari untuk menguji filter rentang tanggal (muncul pada 19, 20, maupun 21 September).",
    roadSegments: [
      {
        id: "BE-003-seg-1",
        status: "HANYA_MOTOR",
        coordinates: [
          [-8.5085, 115.259],
          [-8.51, 115.261],
          [-8.5115, 115.2635],
        ],
        createdAt: "2026-09-17T06:00:00.000Z",
      },
      {
        id: "BE-003-seg-2",
        status: "JALUR_ALTERNATIF",
        coordinates: [
          [-8.505, 115.264],
          [-8.507, 115.2655],
          [-8.509, 115.267],
        ],
        createdAt: "2026-09-17T06:05:00.000Z",
      },
    ],
    createdAt: "2026-09-17T06:00:00.000Z",
  },
  ...buildExtraSeeds(),
];
