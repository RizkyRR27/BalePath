# Riwayat Pekerjaan: Bilingual i18n BalePath (ID/EN)

> Dokumentasi lengkap proses kerja sesi 18 September 2026 — dari pertanyaan/instruksi user hingga jawaban dan implementasi Claude.

## 1. Konteks

Proyek BalePath (portal informasi upacara adat Bali + penutupan jalan untuk banjar) awalnya satu bahasa (Indonesia). User meminta aplikasi menjadi bilingual: Indonesia sebagai default (`/id`) dan Inggris (`/en`), dengan URL ber-prefix locale.

**Constraints yang berlaku sepanjang sesi (dari user):**

- Jangan commit atau push tanpa instruksi eksplisit.
- Jangan menambah dependency npm baru (tanpa `next-intl`, `react-i18next`, dll).
- Jangan pakai git worktree.
- Implementasi harus lean — tidak berlebihan dalam abstraksi.

---

## 2. Alur Percakapan & Pekerjaan

### 2.1 — User: "Eksekusi plan bilingual i18n"

Claude mengeksekusi plan di `docs/superpowers/plans/2026-09-18-bilingual-i18n.md`. Pekerjaan:

1. **Setup locale infrastructure** (`src/presentation/i18n/`)
   - `locale.ts` — type `Locale = "id" | "en"`, `LOCALES`, `DEFAULT_LOCALE = "id"`, `isLocale()`, helper `localePath(path, locale)` untuk menyisipkan prefix locale di semua link internal.
   - `translation-provider.tsx` — React context `TranslationProvider` + hook `useTranslation()` yang menyediakan `{ locale, t }`.
   - `dictionary.ts` — registry yang memetakan locale → kamus.

2. **Kamus terjemahan** (`src/data/i18n/`)
   - `id.ts` — kamus dasar, seluruh string UI dalam bahasa Indonesia. Sengaja TIDAK pakai `as const` agar typecheck spread di `en.ts` tidak error.
   - `en.ts` — pola `{ ...id, ...override }` per section; semua string di-override ke bahasa Inggris.
   - Section kamus: `meta`, `common`, `nav`, `map`, `calendar`, `roadMap`, `login`, `adminShell`, `closure`, `dashboard`, `impact`.

3. **Middleware redirect** (`src/middleware.ts`)
   - URL lama tanpa locale (`/`, `/kalender`, `/tri-hita-karana`, `/admin`, `/admin/login`) di-redirect otomatis ke padanan `/id/...` (karena `DEFAULT_LOCALE = "id"`).

4. **Struktur routing** (`src/app/[locale]/...`)
   - Semua page dipindah ke bawah dynamic segment `[locale]`, dengan route group `(public)` dan `(protected)` tetap dipertahankan.
   - `<html lang>` mengikuti locale aktif (`lang="id"` atau `lang="en"`).

5. **Konsumsi terjemahan di semua screen**
   - `public-map-page`, `calendar-page`, `tri-hita-karana-page`, `login-page`, `dashboard-page`, `public-shell`, `road-map`, `language-switcher`, protected layout — semuanya membaca teks dari `t.*`, bukan hardcode.
   - Data domain TIDAK diterjemahkan (nama upacara, banjar, jalan, nilai raw closure `"Tutup Total"` / `"Buka-Tutup"` tetap Indonesia). Nilai closure hanya diterjemahkan saat render via `t.closure[...]`.
   - `formatDate` menerima parameter `"id" | "en"` langsung (bukan type dari presentation) agar domain tetap tidak bergantung presentation.

6. **Language switcher** — komponen kecil di header publik, awalnya toggle langsung ID ↔ EN dengan menukar segmen pertama URL.

7. **Update E2E tests** (`tests/balepath.spec.ts`)
   - Semua path existing diberi prefix `/id`.
   - Tes baru: redirect legacy → `/id`, language switcher, render halaman English.
   - Test overflow 7 viewport memakai path ber-prefix.

8. **Verifikasi penuh**
   - `npm run typecheck` ✅
   - `npm run lint` ✅
   - `npm run build` ✅ — 10 route locale ter-generate (`/id`, `/en`, `/id/admin`, `/en/admin`, `/id/admin/login`, `/en/admin/login`, `/id/kalender`, `/en/kalender`, `/id/tri-hita-karana`, `/en/tri-hita-karana`).
   - `npm test` (Playwright) ✅ — **20/20 passed (58.6s)**.

### 2.2 — User: "masih lama kah ini?"

Claude menjawab singkat: status verifikasi — typecheck ✅, lint ✅, sisa build + Playwright. Setelah selesai, dilaporkan hasil akhir: semua hijau, tanpa commit/push.

### 2.3 — User: "Berarti semua translation sudah anda buatkan id.json dan en.json nya?"

Claude menjawab: ya, sudah — tapi formatnya **`.ts`, bukan `.json`** (karena constraint no-new-dependency dan pendekatan dictionary TypeScript manual):

- `src/data/i18n/id.ts`
- `src/data/i18n/en.ts`

Data domain tetap Indonesia; hanya display text diterjemahkan.

### 2.4 — User: "Terus yang en-nya mana? Kodenya dirapikan ke bawah kalau terlalu panjang ke kanan"

User menanyakan file `en` dan meminta `id.ts` yang formatnya menumpuk ke kanan dirapikan menjadi satu key per baris.

Claude:
- Me-rewrite `id.ts` — seluruh isi tetap sama, hanya format: satu properti per baris, nested object di-indent.
- Menjawab bahwa `en.ts` ada di `src/data/i18n/en.ts` dan masih format lama (karena permintaan spesifik menyebut `id.ts`).
- Typecheck ✅.

### 2.5 — User: "rapikan juga en nya"

Claude me-rewrite `en.ts` dengan format sama (satu key per baris), mempertahankan pola spread `...id.<section>` + override. Typecheck ✅, lint ✅.

Catatan teknis: command `Tee-Object -FilePath build.log` saat lint menimpa `build.log` dengan output lint — log build lama hilang; Claude menginfokan bahwa `npm run build` perlu dijalankan ulang jika log-nya masih dibutuhkan.

### 2.6 — User: "Apakah di screen juga sudah diganti translationnya?"

Claude mengaudit semua file di `src/presentation/`:

- Konfirmasi semua screen sudah konsumsi `useTranslation()`.
- Menemukan **2 string yang masih hardcode Indonesia** di `tri-hita-karana-page.tsx`: `"Hubungi 119"` dan `"Lihat peta adat"`.
- Perbaikan:
  - Tambah key baru di `id.ts`: `impact.emergencyCall: "Hubungi 119"`, `impact.viewMap: "Lihat peta adat"`.
  - Override di `en.ts`: `emergencyCall: "Call 119"`, `viewMap: "View sacred map"`.
  - Ganti JSX hardcoded dengan `{impact.emergencyCall}` dan `{impact.viewMap}`.
- Typecheck ✅, lint ✅.
- Playwright belum dijalankan ulang setelah perbaikan ini (menunggu konfirmasi user).

### 2.7 — User: "Tampilan kecil di pojok kiri bawah itu gunanya buat apa?"

Claude menjelaskan: itu **Next.js Development Indicator** — fitur bawaan Next.js saat `next dev`:

- Menandai aplikasi sedang berjalan dalam mode development.
- Menampilkan status kompilasi/reload, bisa diklik untuk dev tools.
- **Tidak muncul** di production build (`npm run build` + `npm start` / deploy).
- Bukan bagian desain BalePath.

### 2.8 — User: "Kotak EN/ID ketika diklik memunculkan toolbar pilihan, jangan langsung berubah"

Sebelumnya language switcher toggle langsung ID ↔ EN. User ingin ada langkah memilih.

Claude me-rewrite `src/presentation/components/language-switcher.tsx`:

- Tombol `EN`/`ID` tidak lagi langsung navigate.
- Klik membuka dropdown menu (`role="menu"`) berisi dua pilihan: `Bahasa Indonesia` dan `English`.
- Pilihan locale aktif ditandai `aria-current="true"`.
- Klik di luar menu → tutup (`mousedown` listener di luar `rootRef`).
- Tekan `Escape` → tutup.
- Path halaman saat ini dipertahankan; hanya segmen locale yang diganti (`localePath`).
- `aria-haspopup="menu"` + `aria-expanded` untuk aksesibilitas.

CSS baru di `src/presentation/styles/public.css`:

- `.public-lang-wrap` (position relative), styling `.public-lang` (border, gold accent), `.public-lang-menu` (dropdown gelap, shadow), hover + `aria-current` state.
- Sebelumnya `.public-lang` belum punya styling sama sekali — sekalian terisi.

Typecheck ✅, lint ✅.

---

## 3. Arsitektur Akhir

```
src/
├── middleware.ts                      # redirect URL tanpa locale → /id/...
├── app/[locale]/                      # semua route di bawah prefix locale
│   ├── layout.tsx                     # <html lang> sesuai locale, TranslationProvider
│   ├── page.tsx                       # peta publik
│   ├── kalender/page.tsx
│   ├── tri-hita-karana/page.tsx
│   └── admin/
│       ├── login/page.tsx
│       └── (protected)/page.tsx
├── data/i18n/
│   ├── id.ts                          # kamus dasar Indonesia
│   └── en.ts                          # { ...id, override } bahasa Inggris
├── presentation/
│   ├── i18n/
│   │   ├── locale.ts                  # Locale, LOCALES, isLocale, localePath
│   │   ├── dictionary.ts              # registry locale → kamus
│   │   └── translation-provider.tsx   # context + useTranslation()
│   ├── components/language-switcher.tsx  # dropdown pilih bahasa
│   └── pages/…                        # semua screen konsumsi t.*
└── domain/formatters/format-date.ts   # menerima "id" | "en" langsung
```

**Prinsip yang dipertahankan:**

- Domain tidak mengimpor apa pun dari presentation.
- Data domain (upacara, banjar, jalan, nilai closure mentah) tetap bahasa Indonesia.
- Closure diterjemahkan hanya di layer tampilan via `t.closure[...]`.
- Demo auth `sessionStorage`, TTL 8 jam, akun `admin@banjarkaja.id` / `admin123` — tidak berubah.

---

## 4. Hasil Verifikasi Terakhir

| Langkah | Hasil |
|---|---|
| `npm run typecheck` | ✅ pass |
| `npm run lint` | ✅ pass |
| `npm run build` | ✅ pass (10 route locale, SSG) |
| `npm test` (Playwright) | ✅ 20/20 passed — *dijalankan sebelum 2 perbaikan terakhir (hardcode string + dropdown switcher); typecheck+lint sudah diulang setelahnya, Playwright belum* |

**Catatan:** Playwright disarankan dijalankan ulang (`npm test`) untuk memverifikasi perubahan language switcher (test "language switcher swaps locale segment" masih mengasumsikan toggle langsung — perlu update test untuk dropdown).

## 5. Status Commit

Sesuai instruksi: **tidak ada commit dan push yang dilakukan.** Semua perubahan berada di working tree branch `feat/syahrul`.
