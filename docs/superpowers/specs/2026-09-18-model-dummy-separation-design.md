# Pemisahan Model, Repository, dan Dummy Data — Desain

**Status:** disetujui untuk lanjut ke implementation plan
**Tanggal:** 2026-09-18

## 1. Tujuan

Screen (user maupun admin) hanya bergantung pada tipe domain (model) dan
provider — tidak pernah mengimpor data dummy secara langsung. Data dummy
dipindahkan ke lokasi terpisah di belakang repository interface. Saat backend
API tersedia, hanya implementasi repository yang diganti
(`DummyXRepository` → `ApiXRepository`); screen dan provider tidak disentuh.

Permintaan eksplisit yang mendasari desain ini: *"screen sesuaikan dengan
modelnya, dummy-nya dipisah ke tempat lain, seperti sudah implementasi API
tapi masih dummy, nanti BE siap tinggal hapus dummy tanpa mengubah screen."*

## 2. Masalah saat ini

Beberapa data operasional yang tampil di halaman publik masih hardcoded
langsung di file screen atau di `src/data/catalog/demo-data.ts` tanpa
repository/provider, sehingga:

- Admin tidak bisa mengubahnya.
- Mengganti dummy → API nanti berarti mengedit file screen/JSX.

| Data | Lokasi sekarang | Status |
|---|---|---|
| `CeremonyEvent[]` | `EventsProvider` + `sessionStorage` | Sudah benar (model → repository → provider → screen) |
| `Road[]` | Import statis dari `demo-data.ts` di `public-map-page.tsx` & `dashboard-page.tsx` | **Tidak ada repository/provider** |
| Kontak darurat posko | Hardcode teks di `tri-hita-karana-page.tsx` (`noNumber`, `noWhatsapp`, dst di dictionary) | **Tidak ada model** |
| Daftar kendaraan kalkulator | Array `vehicles` hardcode di `tri-hita-karana-page.tsx` | **Tidak ada model** |
| Angka metrik dampak (1.420 kg, 28.4%, 34) | Hardcode JSX di `tri-hita-karana-page.tsx` | **Tidak ada model** |
| Profil banjar (nama, lokasi, deskripsi) | Tersebar di `dummyAdmin` + teks dictionary | **Tidak ada model** |

## 3. Cakupan

### 3.1 Masuk cakupan (dapat CRUD admin penuh)

Model → repository interface → dummy repository → provider → **menu admin baru**:

- **Road** — ruas jalan (entity sudah ada, tinggal ditambah repository/provider/admin screen).
- **BanjarProfile** — profil banjar yang login (baru).
- **EmergencyContact** — kontak posko/pecalang per banjar (baru).

### 3.2 Masuk cakupan (model + dummy saja, tanpa CRUD admin)

Data ini tetap dipindah ke model + file dummy terpisah supaya screen tidak
memegang literal, tapi **tidak** mendapat form admin di iterasi ini — ini
konfigurasi umum, bukan input harian per-banjar:

- **Vehicle** — daftar kendaraan kalkulator (id, label, tarif BBM/km).
- **ImpactStat** — angka ilustratif dampak (emisi, idling, jumlah upacara).

> `ponytail:` tanpa CRUD admin untuk Vehicle/ImpactStat. Upgrade: kalau nanti
> perlu admin mengubah tarif BBM atau angka simulasi, tinggal tambah
> repository+provider+form seperti Road — tipe di screen sudah siap, tidak
> perlu ubah JSX.

### 3.3 Tidak masuk cakupan

- **Konten edukasi Tri Hita Karana** (pillars, 4 cerita upacara, etiket) tetap
  di `id.ts`/`en.ts`. Ini teks dwibahasa yang diterjemahkan manual; menjadikannya
  data admin butuh alur autoring dwibahasa yang tidak diminta sekarang (YAGNI).
- **CeremonyEvent** — sudah sinkron, tidak diubah.
- Autentikasi/session tidak diubah.

## 4. Arsitektur

```text
Screen (user / admin)
        │  hanya import tipe domain + hook provider
        ▼
Provider (React context, "use client")
        │  hanya panggil repository interface
        ▼
Repository interface (domain/repositories/*.ts)
        │  diimplementasikan oleh:
        ▼
Dummy repository (infrastructure/repositories/dummy-*.ts)
        │  baca/tulis dari:
        ▼
Dummy data file (infrastructure/dummy/*.ts)  +  sessionStorage (persist)
```

Saat backend siap: tambah `infrastructure/repositories/api-*.ts` yang
mengimplementasikan interface yang sama, ganti satu baris wiring di provider
(`createDummyRoadRepository()` → `createApiRoadRepository()`). Tidak ada
perubahan di `domain/`, `presentation/pages/*`, atau komponen.

## 5. Model baru

```ts
// src/domain/entities/road.ts (SUDAH ADA — tidak berubah)
export type Road = { id: string; name: string; coordinates: [number, number][] };
```

```ts
// src/domain/entities/banjar-profile.ts (baru)
export type BanjarProfile = {
  banjarId: string;
  name: string;
  location: string;
  description: string;
  contactName: string;
  contactPhone: string;
};
```

```ts
// src/domain/entities/emergency-contact.ts (baru)
export type EmergencyContact = {
  id: string;
  banjarId: string;
  postName: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
};
```

```ts
// src/domain/entities/vehicle.ts (baru)
export type Vehicle = { id: string; label: string; fuelRatePerKm: number };
```

```ts
// src/domain/entities/impact-stat.ts (baru)
export type ImpactStat = {
  emissionKg: number;
  idlingPercent: number;
  idlingTargetPercent: number;
  ceremonyCount: number;
};
```

**Keputusan desain — kepemilikan Road:** `Road` TIDAK diberi `banjarId`. Ruas
jalan adalah infrastruktur bersama yang dipakai lintas banjar (contoh: Jl.
Raya Ubud dipakai event banjar Ubud Kaja). Semua admin yang login dapat
mengelola katalog ruas bersama ini — berbeda dari `CeremonyEvent` yang
di-scope per `banjarId`. Ini konsisten dengan perilaku sekarang (dropdown
ruas di dashboard memakai daftar global yang sama untuk semua admin).

**Keputusan desain — kontak publik di halaman Tri Hita Karana:** halaman
publik tidak punya sesi login, jadi ia menampilkan `EmergencyContact`/
`BanjarProfile` milik `dummyAdmin.banjarId` ("ubud-kaja") — sesuai teks
existing yang memang menyebut "Banjar Adat Ubud Kaja" secara eksplisit.

## 6. Repository interface

```ts
// src/domain/repositories/road-repository.ts
import type { Road } from "@/domain/entities/road";
export interface RoadRepository { load(): Road[]; save(roads: Road[]): void; }
```

```ts
// src/domain/repositories/banjar-profile-repository.ts
import type { BanjarProfile } from "@/domain/entities/banjar-profile";
export interface BanjarProfileRepository { load(): BanjarProfile[]; save(profiles: BanjarProfile[]): void; }
```

```ts
// src/domain/repositories/emergency-contact-repository.ts
import type { EmergencyContact } from "@/domain/entities/emergency-contact";
export interface EmergencyContactRepository { load(): EmergencyContact[]; save(contacts: EmergencyContact[]): void; }
```

Bentuknya sengaja identik dengan `EventRepository` yang sudah ada — pola
`load()/save(list)` dipertahankan supaya `createSessionStorageRepository<T>`
generik yang sudah ada bisa dipakai ulang tanpa perubahan.

## 7. Validasi (domain/rules + application/use-cases)

Mengikuti pola `is-ceremony-event.ts` + `event-validation.ts`:

- `src/domain/rules/is-road.ts` — validasi `id`, `name` non-kosong, `coordinates` minimal 2 titik `[lat, lng]` numerik.
- `src/domain/rules/is-banjar-profile.ts` — validasi field string wajib non-kosong.
- `src/domain/rules/is-emergency-contact.ts` — validasi `id`, `banjarId`, `postName` non-kosong, `verified` boolean.
- `src/application/use-cases/road-validation.ts`, `banjar-profile-validation.ts`, `emergency-contact-validation.ts` — masing-masing expose `isValidX`/`isValidXList`, dipakai sebagai `validate` param ke `createSessionStorageRepository`.

**Perubahan pada file yang ada:** `event-validation.ts` saat ini meng-import
`roads` statis dari `demo-data.ts` untuk validasi `roadId`. Karena `Road`
sekarang dinamis (bisa ditambah admin), `isValidEvent`/`isValidEventList`
diubah menerima `roads: Road[]` sebagai parameter, bukan import statis.
Pemanggilnya (`EventsProvider`) mengambil roads dari `useRoads()` dan
mengopernya saat validasi `saveEvent`.

## 8. Dummy data layer

```text
src/infrastructure/dummy/
├── dummy-roads.ts            (isi: 4 road existing dipindah dari demo-data.ts)
├── dummy-banjar-profiles.ts  (baru, 1 profil untuk "ubud-kaja")
├── dummy-emergency-contacts.ts (baru, 1 kontak belum-terverifikasi untuk "ubud-kaja")
├── dummy-vehicles.ts         (isi: array vehicles dipindah dari tri-hita-karana-page.tsx)
└── dummy-impact-stats.ts     (isi: angka 1420/28.4/30/34 dipindah dari tri-hita-karana-page.tsx)
```

```text
src/infrastructure/repositories/
├── dummy-road-repository.ts
├── dummy-banjar-profile-repository.ts
└── dummy-emergency-contact-repository.ts
```

Ketiganya thin wrapper di atas `createSessionStorageRepository` (persis pola
`createEventRepository` di `session-storage.ts`), masing-masing session key
sendiri: `balepath.demo.roads.v1`, `balepath.demo.banjar-profiles.v1`,
`balepath.demo.emergency-contacts.v1`.

`demo-data.ts` menyusut: `roads` dan seluruh literal pindah ke
`infrastructure/dummy/`; yang tersisa hanya `DEMO_DATE`, `dummyAdmin`,
`initialEvents` (tidak diubah scope-nya di spec ini).

## 9. Provider baru

```text
src/presentation/providers/
├── roads-provider.tsx            → useRoads() : { roads, ready, saveRoad, deleteRoad }
├── banjar-profile-provider.tsx   → useBanjarProfile() : { profile, ready, saveProfile }
└── emergency-contact-provider.tsx→ useEmergencyContacts() : { contacts, ready, saveContact, deleteContact }
```

Pola sama seperti `EventsProvider`: `useState` + `useEffect(setTimeout(...,0))`
untuk load dari repository setelah mount, `useEffect` untuk auto-save saat
`events`/`roads`/dst berubah. `BanjarProfileProvider` dan
`EmergencyContactProvider` filter/scope ke `user.banjarId` (butuh `useAuth()`,
sama seperti `EventsProvider` sekarang).

**Urutan provider di `src/app/[locale]/layout.tsx`** berubah jadi:

```text
TranslationProvider
  AuthProvider
    RoadsProvider              ← baru, harus di atas EventsProvider (event validation butuh roads)
      EventsProvider
        BanjarProfileProvider  ← baru
          EmergencyContactProvider ← baru
            {children}
```

## 10. Perubahan screen

| File | Perubahan |
|---|---|
| `public-map-page.tsx` | `import { roads } from "@/data/catalog/demo-data"` → `const { roads } = useRoads()` |
| `dashboard-page.tsx` | sama: `roads` dari `useRoads()`, bukan import statis |
| `tri-hita-karana-page.tsx` | `vehicles` (array lokal) → `import { vehicles } from "@/infrastructure/dummy/dummy-vehicles"` (tipe `Vehicle[]`); angka metrik (1420/28.4/30/34) → `import { impactStat } from "@/infrastructure/dummy/dummy-impact-stats"`; blok kontak posko → `useEmergencyContacts()` + `useBanjarProfile()`, tombol `noNumber`/`noWhatsapp`/`emergencyCall` dirender kondisional dari `contact.verified` |
| **Baru:** `src/app/[locale]/admin/(protected)/jalan/page.tsx` | menu admin "Kelola Ruas Jalan" — list + form tambah/edit/hapus `Road` |
| **Baru:** `src/app/[locale]/admin/(protected)/profil-banjar/page.tsx` | form edit `BanjarProfile` milik admin yang login |
| **Baru:** `src/app/[locale]/admin/(protected)/kontak-darurat/page.tsx` | list + form tambah/edit/hapus `EmergencyContact`, toggle `verified` |

Form ruas jalan (MVP, konsisten dengan copy existing "Geometri dummy untuk
demonstrasi"): nama ruas + textarea koordinat format `lat,lng` per baris,
di-parse jadi `[number, number][]`, divalidasi minimal 2 baris valid.

Menu navigasi admin (`adminShell` di dictionary) ditambah 3 entri baru:
"Ruas Jalan", "Profil Banjar", "Kontak Darurat".

## 11. Alur migrasi ke backend nyata (kenapa desain ini memenuhi permintaan)

Saat BE siap, per entity:

1. Tulis `ApiRoadRepository implements RoadRepository` (fetch ke endpoint asli).
2. Ganti satu baris di provider: `createDummyRoadRepository()` → `createApiRoadRepository()`.
3. Hapus file di `infrastructure/dummy/dummy-roads.ts`.

Tidak ada perubahan di `domain/`, `presentation/pages/*`, atau komponen —
karena keduanya sudah hanya bicara lewat tipe model + provider, persis
seperti yang diminta.

## 12. Testing

- Unit: `is-road.ts`, `is-banjar-profile.ts`, `is-emergency-contact.ts` (kasus valid/invalid).
- Build-time guard: tidak ada `import` dari `@/infrastructure/dummy/*` di dalam `src/presentation/pages/**` kecuali lewat provider (dicek manual saat review, bukan lint rule baru — YAGNI, tidak menambah tooling).
- `npm run typecheck`, `npm run lint`, `npm run build` setelah setiap task.
- Playwright: tambah 1 skenario admin per menu baru (create → muncul di halaman publik terkait) mengikuti pola test existing di `tests/balepath.spec.ts`.

## 13. Risiko / keputusan yang sudah diambil (bukan open question)

- Road bersifat katalog bersama (bukan per-banjar) — lihat §5.
- Kontak publik di halaman Tri Hita Karana = kontak milik `dummyAdmin.banjarId` — lihat §5.
- Vehicle & ImpactStat tidak dapat CRUD admin di iterasi ini — lihat §3.2.
- Konten edukasi dwibahasa (pillars/ceremonies/etiquette) tetap statis di dictionary — lihat §3.3.
