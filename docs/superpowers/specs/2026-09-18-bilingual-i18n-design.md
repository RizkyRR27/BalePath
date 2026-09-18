# BalePath Bilingual (id/en) Design

Status: disetujui user di chat (2026-09-18).

## Keputusan

- **URL prefix locale**: `/id/...` dan `/en/...`. Locale adalah dynamic segment `[locale]`.
- **Default bahasa**: Indonesia. Semua URL tanpa prefix di-redirect middleware ke `/id/...`
  (`/` → `/id`, `/kalender` → `/id/kalender`, `/admin/login` → `/id/admin/login`).
- **Kamus manual, tanpa dependency baru**: file `src/data/i18n/id.ts` + `en.ts`,
  diambil lewat `getDictionary(locale)`. Tanpa next-intl/react-i18next.
- **Cakupan**: semua halaman (publik + admin login + dashboard), termasuk pesan validasi.
- **Language switcher**: menukar segment pertama pathname (`/id/kalender` ↔ `/en/kalender`),
  tersedia di nav publik dan area admin.
- **Verifikasi**: typecheck, lint, build, E2E lama diperbarui + test baru (locale en,
  switcher, redirect).

## Arsitektur

```text
src/middleware.ts                     # redirect URL lama → /id/...
src/app/[locale]/layout.tsx           # root layout: <html lang>, providers, globals.css
src/app/[locale]/(public)/...         # /, /kalender, /tri-hita-karana
src/app/[locale]/admin/...            # /admin/login, /admin
src/data/i18n/{id,en}.ts              # kamus UI per bahasa
src/presentation/i18n/locale.ts       # Locale type, isLocale, localePath
src/presentation/i18n/dictionary.ts   # Dictionary type + getDictionary
src/presentation/i18n/translation-provider.tsx  # context + useTranslation()
src/presentation/components/language-switcher.tsx
```

## Aturan

- Domain entity (`CeremonyEvent.closure`, nama jalan, nama upacara, `meaning`)
  **tidak diterjemahkan**; label diterjemahkan saat display via kamus
  (`closure["Tutup Total"] → "Full Closure"`).
- `formatDate(date, locale)` memakai tag `id-ID` / `en-GB`.
- State filter memakai nilai domain (`Tutup Total`), label dari kamus.
- `app/layout.tsx` lama dihapus; `[locale]/layout.tsx` menjadi root layout
  (pola resmi i18n Next.js App Router). Locale divalidasi di layout (trust boundary).
- Tidak ada dependency baru. Tidak mengubah behavior demo (sessionStorage, akun demo,
  TTL 8 jam).

## Batasan yang diketahui

- Konten data demo (nama upacara, makna upacara, banjar) tetap bahasa Indonesia —
  bukan bagian UI chrome.
- Switcher tidak mempertahankan query string (`?date=...`) — reset ke default.
