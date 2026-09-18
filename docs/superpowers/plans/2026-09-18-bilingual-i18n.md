# BalePath Bilingual (id/en) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seluruh UI BalePath tersedia dalam bahasa Indonesia dan English melalui URL prefix `/id/...` dan `/en/...`, dengan redirect dari URL lama.

**Architecture:** Dynamic segment `[locale]` di App Router; middleware redirect URL tanpa prefix ke `/id`; kamus TypeScript statis di `src/data/i18n/`; `TranslationProvider` + `useTranslation()` untuk client components; helper `localePath()` untuk semua link internal.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Playwright. Tanpa dependency baru.

**Spec:** `docs/superpowers/specs/2026-09-18-bilingual-i18n-design.md`

## Global Constraints

- Tanpa dependency npm baru.
- Jangan commit atau push.
- Route demo tetap: sessionStorage, akun `admin@banjarkaja.id` / `admin123`, TTL 8 jam.
- Domain entity tidak berubah: `Closure = "Tutup Total" | "Buka-Tutup"` tetap nilai Indonesia; terjemahan hanya pada display label.
- `html lang` harus mengikuti locale.
- Semua link internal memakai `localePath(path, locale)` — dilarang hardcode `href="/kalender"`.
- Verifikasi tiap task: `npm run typecheck && npm run lint`.

---

### Task 1: Locale primitives + kamus + provider

**Files:**
- Create: `src/presentation/i18n/locale.ts`
- Create: `src/presentation/i18n/dictionary.ts`
- Create: `src/data/i18n/id.ts`
- Create: `src/data/i18n/en.ts`
- Create: `src/presentation/i18n/translation-provider.tsx`
- Create: `src/presentation/components/language-switcher.tsx`
- Test: verifikasi via `npx tsc --noEmit` (type-level) — unit test runtime tidak wajib untuk konstanta murni.

**Interfaces:**
- Consumes: tidak ada (fondasi).
- Produces:
  - `type Locale = "id" | "en"`; `function isLocale(value: string): value is Locale`; `const LOCALES: Locale[]`; `function localePath(path: string, locale: Locale): string`.
  - `type Dictionary = typeof id` (dari `src/data/i18n/id.ts`); `function getDictionary(locale: Locale): Dictionary`.
  - `TranslationProvider({ locale, children })`; `function useTranslation(): { t: Dictionary; locale: Locale }`.
  - `LanguageSwitcher({ locale })` — client component; membaca `usePathname()`, menukar segment pertama.

- [ ] **Step 1: Buat `src/presentation/i18n/locale.ts`**

```ts
export type Locale = "id" | "en";

export const LOCALES: Locale[] = ["id", "en"];
export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/** /kalender + en → /en/kalender. Root "/" → /en (tanpa double slash). */
export function localePath(path: string, locale: Locale) {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}
```

- [ ] **Step 2: Buat kamus `src/data/i18n/id.ts`**

Struktur flat-by-section, key dipakai lintas halaman. Isi SEMUA string UI yang sekarang hardcoded (lihat Task 3–7). Kerangka:

```ts
export const id = {
  meta: { title: "BalePath — Ruang adat, langkah selaras", description: "Demo portal kegiatan banjar dan informasi penutupan jalan Bali." },
  common: {
    skipToContent: "Langsung ke konten",
    demoDate: "Tanggal demo",
    wita: "WITA",
    close: "Tutup",
    loading: "Memuat…",
  },
  nav: {
    ariaLabel: "Navigasi publik",
    map: "Peta Adat",
    calendar: "Kalender Yadnya",
    impact: "Tri Hita Karana",
    adminPortal: "Portal Prajuru",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    brandTagline: "RUANG ADAT · LANGKAH SELARAS",
    switchTo: "EN",           // label switcher saat tampil di UI id
    switchAria: "Ganti ke Bahasa Inggris",
  },
  map: { /* semua teks public-map-page: hero, filter, detail card, agenda, harmony, dsb. */ },
  calendar: { /* semua teks calendar-page */ },
  impact: { /* teks nav Tri Hita Karana sudah di nav; halaman impact punya sedikit teks yang perlu (contact dsb.) */ },
  login: { /* semua teks login-page termasuk pesan error "Email atau password tidak sesuai. Silakan coba kembali." */ },
  dashboard: { /* semua teks dashboard-page termasuk pesan validasi & sukses */ },
  adminShell: { /* teks protected-layout */ },
  closure: { "Tutup Total": "Tutup Total", "Buka-Tutup": "Buka-Tutup" },
  roadMap: { /* teks road-map.tsx: legend, kontrol, aria */ },
} as const;

export default id;
```

- [ ] **Step 3: Buat `src/data/i18n/en.ts` dengan shape identik**

```ts
import type { Dictionary } from "@/presentation/i18n/dictionary";

export const en: Dictionary = {
  // translasi natural; label closure: "Full Closure" / "Open-Close"
} as const;

export default en;
```

- [ ] **Step 4: Buat `src/presentation/i18n/dictionary.ts`**

```ts
import type { en } from "@/data/i18n/en";
import type { id } from "@/data/i18n/id";
import type { Locale } from "./locale";

// id adalah sumber kebenaran shape; en wajib punya key yang sama (compile error jika tidak).
export type Dictionary = typeof id;

const dictionaries = { id, en } as const;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
```

Catatan circular import tipe: `en.ts` meng-import type dari `dictionary.ts`, dan `dictionary.ts` meng-import type `en`. Type-only import tidak masalah runtime; jika TS komplain, ganti `Dictionary` di `en.ts` dengan `typeof id` via import type dari `id.ts`.

- [ ] **Step 5: Buat `src/presentation/i18n/translation-provider.tsx`**

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "./dictionary";
import type { Locale } from "./locale";

type TranslationState = { t: Dictionary; locale: Locale };
const TranslationContext = createContext<TranslationState | null>(null);

export function TranslationProvider({ locale, t, children }: { locale: Locale; t: Dictionary; children: ReactNode }) {
  return <TranslationContext.Provider value={{ locale, t }}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("TranslationProvider belum terpasang");
  return context;
}
```

- [ ] **Step 6: Buat `src/presentation/components/language-switcher.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { localePath, type Locale } from "@/presentation/i18n/locale";

export function LanguageSwitcher({ locale, otherLabel, ariaLabel }: { locale: Locale; otherLabel: string; ariaLabel: string }) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/");
  segments[1] = locale === "id" ? "en" : "id";
  return (
    <Link className="public-lang" href={segments.join("/")} aria-label={ariaLabel}>
      <Languages size={16} aria-hidden="true" />
      {otherLabel}
    </Link>
  );
}
```

- [ ] **Step 7: Verifikasi**

Run: `npm run typecheck && npm run lint`
Expected: PASS (file baru belum dipakai; en.ts harus lengkap agar type Dictionary cocok — jika belum lengkap, isi semua key sekarang, JANGAN lanjut).

- [ ] **Step 8: Commit** — SKIPPED per batasan (jangan commit).

### Task 2: Struktur route `[locale]` + middleware redirect

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/(public)/layout.tsx`
- Create: `src/app/[locale]/(public)/page.tsx`
- Create: `src/app/[presentation pages unchanged]/…` — tidak ada; pages dipakai ulang.
- Create: `src/app/[locale]/(public)/kalender/page.tsx`
- Create: `src/app/[locale]/(public)/tri-hita-karana/page.tsx`
- Create: `src/app/[locale]/admin/login/page.tsx`
- Create: `src/app/[locale]/admin/(protected)/layout.tsx`
- Create: `src/app/[locale]/admin/(protected)/page.tsx`
- Delete: `src/app/(public)/` (semua), `src/app/admin/` (semua), `src/app/layout.tsx`, `src/app/page.tsx` jika ada.

**Interfaces:**
- Consumes: `isLocale`, `DEFAULT_LOCALE`, `getDictionary`, `TranslationProvider`, `LOCALES` (Task 1).
- Produces: URL `/id/...` dan `/en/...` render seluruh halaman lama; `/`, `/kalender`, dst. redirect ke `/id/...`.

- [ ] **Step 1: Buat `src/middleware.ts`**

```ts
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/presentation/i18n/locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [first] = pathname.split("/").filter(Boolean);
  if (LOCALES.includes(first as never)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
```

- [ ] **Step 2: Buat `src/app/[locale]/layout.tsx` (root layout baru)**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { AuthProvider } from "@/presentation/providers/auth-provider";
import { EventsProvider } from "@/presentation/providers/events-provider";
import { TranslationProvider } from "@/presentation/i18n/translation-provider";
import { getDictionary } from "@/presentation/i18n/dictionary";
import { isLocale, LOCALES } from "@/presentation/i18n/locale";
import icon from "@/presentation/assets/icon.png";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "id");
  return { title: t.meta.title, description: t.meta.description, icons: { icon: icon.src } };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <EventsProvider>
            <TranslationProvider locale={locale} t={getDictionary(locale)}>
              {children}
            </TranslationProvider>
          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

Perhatikan path CSS: dari `[locale]/layout.tsx` jadi `"../globals.css"`.

- [ ] **Step 3: Pindahkan route files**

`src/app/[locale]/(public)/layout.tsx`:
```tsx
export { default } from "@/presentation/layouts/public-layout";
```

`src/app/[locale]/(public)/page.tsx`, `kalender/page.tsx`, `tri-hita-karana/page.tsx`,
`admin/login/page.tsx`, `admin/(protected)/layout.tsx`, `admin/(protected)/page.tsx`:
sama seperti lama (re-export presentation page), hanya lokasi berpindah ke dalam `[locale]/`.

- [ ] **Step 4: Hapus route lama**

Hapus `src/app/(public)/`, `src/app/admin/`, dan `src/app/layout.tsx`.

- [ ] **Step 5: Verifikasi manual**

Run: `npm run typecheck && npm run lint && npm run build && npm run start` lalu cek:
- `http://127.0.0.1:3000/` → redirect `/id`
- `/id/kalender`, `/en/kalender` render
- `/kalender` → redirect `/id/kalender`
- `/xx/` → 404
Expected: semua sesuai.

- [ ] **Step 6: Commit** — SKIPPED per batasan.

### Task 3: Terjemahkan presentation pages (publik)

**Files:**
- Modify: `src/presentation/pages/public-map-page.tsx`
- Modify: `src/presentation/pages/calendar-page.tsx`
- Modify: `src/presentation/pages/tri-hita-karana-page.tsx` (hanya teks nav yang sudah di shell — halaman ini sendiri mostly statis; cukup tambah switcher tidak perlu di sini)
- Modify: `src/presentation/components/public-shell.tsx`
- Modify: `src/presentation/components/road-map.tsx`
- Modify: `src/domain/formatters/format-date.ts`

**Interfaces:**
- Consumes: `useTranslation()` → `{ t, locale }` (Task 1).
- Produces: halaman publik render sesuai locale; `formatDate(date: string, locale: Locale = "id")`.

- [ ] **Step 1: Update `formatDate`**

```ts
import type { Locale } from "@/presentation/i18n/locale";

const TAGS: Record<Locale, string> = { id: "id-ID", en: "en-GB" };

export function formatDate(date: string, locale: Locale = "id") {
  return new Intl.DateTimeFormat(TAGS[locale], { dateStyle: "long", timeZone: "Asia/Makassar" }).format(new Date(`${date}T12:00:00+08:00`));
}
```

Catatan: domain/formatters meng-import type dari presentation — melanggar arah dependency Clean Architecture. Karena `Locale` adalah primitive UI, solusi bersih: pindahkan `locale.ts` ke `src/domain/` ATAU definisikan union literal langsung. **Keputusan: `formatDate` menerima `"id" | "en"` inline tanpa import:**

```ts
export function formatDate(date: string, locale: "id" | "en" = "id") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { dateStyle: "long", timeZone: "Asia/Makassar" }).format(new Date(`${date}T12:00:00+08:00`));
}
```

- [ ] **Step 2: `public-shell.tsx`**

Tambah `const { t, locale } = useTranslation();`. Ganti semua hardcoded string dengan `t.nav.*`, label closure dari `t.closure`. Link memakai `localePath("/", locale)` dst. Tambah `<LanguageSwitcher locale={locale} otherLabel={t.nav.switchTo} ariaLabel={t.nav.switchAria} />` di `public-header-actions` dan di mobile nav. Class CSS `public-lang` baru perlu styling minimal di `public.css` (Task 6 menyatukan).

- [ ] **Step 3: `public-map-page.tsx`**

`const { t, locale } = useTranslation();`. Semua teks → `t.map.*`. Filter `["Semua", "Tutup Total", "Buka-Tutup"]` → iterate domain values `(["Semua", "Tutup Total", "Buka-Tutup"] as const)` tapi label dari `t.closure[value]` (untuk "Semua" pakai `t.map.filterAll`). State `closure` tetap nilai domain. `formatDate(date, locale)`. `Link href={localePath("/kalender", locale)}`. Event data (name, banjar, meaning) tetap apa adanya (data demo Indonesia).

- [ ] **Step 4: `calendar-page.tsx`**

Sama seperti Step 3 dengan `t.calendar.*`. `monthLabel` memakai `Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", ...)`. Weekdays: `locale === "en" ? ["Sun","Mon",...] : ["Min","Sen",...]` — taruh array di kamus (`t.calendar.weekdays`). `Link href={localePath("/", locale)}`.

- [ ] **Step 5: `road-map.tsx`**

`const { t } = useTranslation();`. Legend/status/aria-label dari `t.roadMap.*`; status `Tutup Total` display via `t.closure`. Aria label gabungan `${road.name}: ...` tetap template.

- [ ] **Step 6: Verifikasi**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 7: Commit** — SKIPPED per batasan.

### Task 4: Terjemahkan admin (login, dashboard, protected layout)

**Files:**
- Modify: `src/presentation/pages/login-page.tsx`
- Modify: `src/presentation/pages/dashboard-page.tsx`
- Modify: `src/presentation/layouts/protected-layout.tsx`

**Interfaces:**
- Consumes: `useTranslation()`, `localePath` (Task 1).
- Produces: admin UI bilingual; pesan error/validasi dari kamus.

- [ ] **Step 1: `login-page.tsx`**

Semua teks → `t.login.*`. Error message: `t.login.errorInvalid`. Redirect: `router.replace(localePath("/admin", locale))`. Link balik: `localePath("/", locale)`. Tambah `LanguageSwitcher` pada `login-form-section` (posisi atas card).

- [ ] **Step 2: `dashboard-page.tsx`**

Semua teks/label/aria/pesan → `t.dashboard.*`. Filter value `"Semua"` jadi state domain? — **Bukan**: filter adalah UI state, boleh langsung pakai key kamus (`filter === "all" | "published" | "draft"`, label `t.dashboard.filter[key]`). Closure radio tetap domain value, label `t.closure[value]`. `formatDate(..., locale)`.

- [ ] **Step 3: `protected-layout.tsx`**

Teks sidebar/topbar/footer → `t.adminShell.*`. `router.replace(localePath("/admin/login", locale))`. Tambah `LanguageSwitcher` di sidebar bawah identity.

- [ ] **Step 4: `public-map-page` dkk. sudah di Task 3; tri-hita-karana-page konten edukasi statis bilingual?**

Keputusan: halaman impact kontennya panjang (pillars, ceremonies, etiquette arrays). Diterjemahkan penuh: pindahkan array konten ke kamus per bahasa (`t.impact.pillars`, `t.impact.ceremonies`, `t.impact.etiquette`, `t.impact.contact`) sehingga `tri-hita-karana-page.tsx` render dari `t`. (File Task 3 Step 3 sebelumnya bilang "mostly statis" — DIABAIKAN; halaman ini diterjemahkan penuh di sini.) Struktur data tetap sama; gambar `image`/`alt` ikut kamus.

- [ ] **Step 5: Verifikasi**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit** — SKIPPED per batasan.

### Task 5: E2E update + test baru

**Files:**
- Modify: `tests/balepath.spec.ts`

**Interfaces:**
- Consumes: URL `/id/...`, `/en/...`, redirect middleware (Task 2).
- Produces: suite Playwright lulus.

- [ ] **Step 1: Update helper + path**

`loginAdmin`: `goto("/id/admin/login")`, asersi URL `/\/id\/admin$/`. Semua `page.goto("/...")` → prefix `/id`. `loginAdmin` tambah param `{ lang = "id" }`.

- [ ] **Step 2: Update selector berbasis teks**

Label button login di en beda — karena mayoritas test pakai bahasa id, cukup pastikan selector menunjuk teks id. Selector `getByRole("link", { name: "Tri Hita Karana" })` tetap valid di id (nama proper). Heading assertions pakai teks id di `/id/...`.

- [ ] **Step 3: Test baru — locale & switcher & redirect**

```ts
test("legacy URLs redirect to /id", async ({ page }) => {
  await page.goto("/kalender");
  await expect(page).toHaveURL(/\/id\/kalender$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/id$/);
});

test("language switcher swaps locale segment", async ({ page }) => {
  await page.goto("/id/kalender");
  await page.locator(".public-lang").click();
  await expect(page).toHaveURL(/\/en\/kalender$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Calendar|Yadnya/);
});

test("english locale renders english chrome", async ({ page }) => {
  await page.goto("/en/kalender");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("contentinfo").or(page.locator(".public-harmony")).first()).toBeVisible();
  await page.goto("/en/admin/login");
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
});
```

(Selector en disesuaikan dengan kamus final saat implementasi.)

- [ ] **Step 4: Verifikasi**

Run: `npm run build && npm test`
Expected: PASS semua. Jika browser Playwright belum ter-install: `npx playwright install chromium` dulu.

- [ ] **Step 5: Commit** — SKIPPED per batasan.

### Task 6: CSS switcher + docs update

**Files:**
- Modify: `src/presentation/styles/public.css` (class `public-lang`)
- Modify: `src/app/globals.css` (class `admin-lang` jika dipakai di sidebar admin)
- Modify: `DOKUMENTASI.md` (bagian struktur + cara pakai bilingual)

**Interfaces:**
- Consumes: class dipakai di `language-switcher.tsx` (`public-lang`).
- Produces: switcher terlihat konsisten di header publik + login + sidebar admin.

- [ ] **Step 1: Styling switcher**

`public.css`:
```css
.public-lang {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 13px; border-radius: 999px;
  border: 1px solid var(--public-line, #39352e);
  color: var(--public-muted, #b4aa99);
  font-size: 13px; font-weight: 600; letter-spacing: .04em;
  transition: color .2s, border-color .2s;
}
.public-lang:hover { color: var(--public-gold, #f3c35c); border-color: currentColor; }
```

Admin: reuse `.text-button` atau styling setara; jangan buat class baru jika ada yang cocok.

- [ ] **Step 2: Update DOKUMENTASI.md**

Tambah sub-bagian "Bilingual (id/en)": struktur URL, cara tambah key kamus, cara tambah bahasa baru (buat file di `src/data/i18n/`, daftar di `LOCALES`, tambah di `dictionaries`).

- [ ] **Step 3: Verifikasi akhir**

Run: `npm run typecheck && npm run lint && npm run build && npm test`
Expected: PASS semua.

- [ ] **Step 4: Commit** — SKIPPED per batasan.
