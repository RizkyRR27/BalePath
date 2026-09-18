# Dokumentasi BalePath

## 1. Ringkasan

BalePath adalah aplikasi web Next.js untuk:

- portal publik informasi kegiatan adat;
- kalender kegiatan/upacara;
- peta skematis penutupan jalan;
- halaman edukasi Tri Hita Karana;
- portal admin banjar untuk mengelola jadwal.

Aplikasi berjalan sebagai demo lokal. Data belum memakai backend atau database. Data kegiatan dan sesi login disimpan melalui `sessionStorage` browser.

## 2. Teknologi

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- `lucide-react` untuk ikon
- Playwright untuk E2E test
- CSS biasa untuk styling
- Alias TypeScript: `@/*` mengarah ke `src/*`

Versi Node yang diperlukan:

```text
Node.js >= 20.9.0
```

Versi yang disarankan: Node.js 22 LTS.

## 3. Struktur Clean Architecture

```text
src/
├── app/                         # Entry point route Next.js
├── application/                # Use case dan orchestration aplikasi
│   └── use-cases/
├── data/                       # Data seed/demo statis
│   └── catalog/
├── domain/                     # Aturan dan kontrak bisnis murni
│   ├── entities/
│   ├── formatters/
│   ├── repositories/
│   └── rules/
├── infrastructure/             # Adapter teknis
│   └── storage/
└── presentation/               # UI, controller React, layout, asset
    ├── assets/
    ├── components/
    ├── docs/
    ├── layouts/
    ├── pages/
    ├── providers/
    ├── screens/
    └── styles/
```

### 3.1 `src/app`

Berisi route entrypoint tipis. File route hanya meneruskan halaman ke presentation.

Contoh:

```tsx
export { default } from "@/presentation/pages/calendar-page";
```

Route yang dipertahankan:

```text
/                    Portal publik
/kalender            Kalender kegiatan
/tri-hita-karana     Halaman Tri Hita Karana
/admin/login         Login admin
/admin                Dashboard admin
```

### 3.2 `src/domain`

Tidak mengimpor React, Next.js, atau `sessionStorage`.

Entity:

- `admin.ts`
- `ceremony-event.ts`
- `road.ts`

Repository contract:

- `event-repository.ts`
- `session-repository.ts`

Business rule:

- `is-ceremony-event.ts`

Formatter:

- `format-date.ts`

### 3.3 `src/data`

`demo-data.ts` berisi seed data saja:

- `DEMO_DATE`
- `dummyAdmin`
- `roads`
- `initialEvents`

Data bisnis tidak lagi bercampur dengan halaman atau storage.

### 3.4 `src/application`

Berisi validasi/use case aplikasi.

- `event-validation.ts` memvalidasi satu event dan daftar event menggunakan domain rule serta data jalan.

### 3.5 `src/infrastructure`

`session-storage.ts` adalah satu-satunya adapter yang membaca/menulis `sessionStorage`.

Repository yang tersedia:

- repository event: `balepath.demo.events.v1`
- repository sesi: `balepath.demo.session.v1`

Jika nanti storage diganti API atau database, perubahan utama berada di infrastructure dan contract repository, bukan di screen.

### 3.6 `src/presentation`

Berisi semua hal yang berkaitan dengan tampilan dan interaksi React.

Pages:

- `public-map-page.tsx`
- `calendar-page.tsx`
- `tri-hita-karana-page.tsx`
- `login-page.tsx`
- `dashboard-page.tsx`

Providers/controller bridge:

- `auth-provider.tsx`
- `events-provider.tsx`

Components:

- `brand-icon.tsx`
- `public-shell.tsx`
- `road-map.tsx`

Assets:

- `src/presentation/assets/icon.png`
- `src/presentation/assets/icon.html`
- `src/presentation/assets/screens/`

Static image digunakan melalui import asset Next.js, bukan file root atau `public` yang tidak dibutuhkan.

## 4. Alur Data

```text
Route Next.js
  → Presentation page/layout
    → Provider React
      → Application validation/use case
        → Domain entity/rule/repository contract
          → Infrastructure storage adapter
```

Aturan dependency:

- `app` boleh mengarah ke `presentation`.
- `presentation` boleh memakai `application`, `domain`, `data`, dan adapter yang diperlukan.
- `application` mengarah ke `domain`.
- `infrastructure` mengimplementasikan contract `domain`.
- `domain` tidak mengarah ke UI atau browser API.
- Screen tidak boleh membaca `sessionStorage` langsung.

## 5. Perilaku Aplikasi

### Portal publik

- Menampilkan jadwal kegiatan yang dipublikasikan.
- Menyaring jadwal berdasarkan tanggal.
- Menampilkan detail event.
- Menampilkan peta skematis jalan.
- Menyediakan navigasi desktop dan mobile.

### Kalender

- Menampilkan kalender dan event pada tanggal terpilih.
- Mendukung detail event melalui parameter pencarian URL.
- Menggunakan formatter tanggal domain.

### Admin

Login demo:

```text
Email:    admin@banjarkaja.id
Password: admin123
```

Sesi login:

- disimpan di `sessionStorage`;
- masa berlaku 8 jam;
- dashboard dilindungi layout admin;
- logout menghapus sesi;
- event hanya dapat dikelola oleh banjar admin yang sedang login.

Dashboard mendukung:

- membuat/mengubah event;
- publish/unpublish event;
- menghapus event;
- validasi event sebelum disimpan.

## 6. Cara Menjalankan Project

### Instalasi pertama

Buka PowerShell:

```powershell
cd C:\Timedoor\Projek\BalePath
node --version
npm install
```

Pastikan Node minimal:

```text
v20.9.0
```

Disarankan:

```text
v22.x.x
```

### Menjalankan development server

```powershell
npm run dev
```

Buka browser:

```text
http://127.0.0.1:3000
```

Hentikan server:

```text
Ctrl+C
```

### Perintah verifikasi

```powershell
npm run typecheck
npm run lint
npm run build
```

### Menjalankan E2E test

Install browser Playwright satu kali:

```powershell
npx playwright install chromium
```

Lalu jalankan:

```powershell
npm test
```

## 7. Status Verifikasi

Status terakhir selama restrukturisasi:

- `npm install`: berhasil.
- `npm run typecheck`: berhasil, 0 error.
- `npm run lint`: tidak ada error; masih ada 3 warning unused import di `tri-hita-karana-page.tsx`.
- `npm run dev`: sudah dapat dijalankan setelah Node diperbarui.
- `npm test`: perlu Chromium Playwright ter-install sebelum hasil test dapat dinilai.
- `npm run build`: harus dijalankan dengan Node >=20.9.0.

Warning lint yang tersisa:

- `Link` tidak digunakan.
- `Ambulance` tidak digunakan.
- `Map` tidak digunakan.

File terkait:

```text
src/presentation/pages/tri-hita-karana-page.tsx
```

## 8. Dokumentasi Cara Menulis Prompt

### Prompt perbaikan bug

Gunakan format:

```text
Perbaiki error berikut tanpa mengubah UI, route, atau behavior:

[file dan line]
[error lengkap]

Jalankan typecheck setelah perbaikan. Jangan commit atau push.
```

Contoh:

```text
Perbaiki error TypeScript ini:

src/presentation/pages/calendar-page.tsx:6
Cannot find module 'lucide-react'

Cari root cause, ubah file yang diperlukan saja, lalu jalankan:
npm run typecheck
npm run lint
Jangan commit atau push.
```

### Prompt fitur baru

```text
Tambahkan fitur [nama fitur].

Pertahankan:
- route yang ada;
- UI/UX yang ada;
- sessionStorage demo;
- struktur Clean Architecture.

Tempatkan kode pada layer yang tepat. Jalankan typecheck, lint, dan test relevan. Jangan commit atau push.
```

### Prompt perubahan UI

```text
Ubah tampilan [komponen/halaman] menjadi [hasil yang diinginkan].

Jangan mengubah:
- data;
- behavior;
- route;
- kontrak provider/repository.

Verifikasi tidak ada error TypeScript dan tidak ada overflow mobile.
```

### Prompt perubahan data

```text
Ubah data demo [event/jalan/admin].

Data harus tetap berada di `src/data/catalog/demo-data.ts`.
Jangan menaruh data seed di page atau component. Jalankan typecheck.
```

### Prompt perubahan storage

```text
Ganti adapter storage menjadi [target].

Pertahankan contract repository pada `src/domain/repositories`.
Jangan membaca storage langsung dari presentation page.
Verifikasi behavior login/event tetap sama.
```

### Prompt pemeriksaan arsitektur

```text
Audit dependency direction Clean Architecture.
Cari import yang melanggar batas layer, akses storage dari screen, data yang tercampur dengan UI, dan route yang berisi implementasi.
Laporkan temuan berdasarkan file dan line. Jangan mengubah kode sebelum temuan dijelaskan.
```

### Prompt verifikasi akhir

```text
Verifikasi project secara lengkap:
- npm run typecheck
- npm run lint
- npm run build
- npm test

Laporkan setiap command, status, error lengkap, dan tindakan berikutnya. Jangan menyatakan selesai jika ada command gagal.
Jangan commit atau push.
```

## 9. Cara Respons yang Diharapkan

Respons teknis sebaiknya selalu berisi:

1. Root cause, bukan hanya gejala.
2. File yang diubah.
3. Alasan perubahan.
4. Command verifikasi.
5. Hasil aktual command.
6. Sisa error/warning yang belum diperbaiki.
7. Pernyataan jelas jika build atau test belum dijalankan.

Contoh respons baik:

```text
Root cause: `icon.png` berada di root project, sedangkan import asset Next.js mengharuskan file berada pada path yang di-resolve bundler.

Perubahan:
- pindahkan ke `src/presentation/assets/icon.png`;
- ubah `BrandIcon` ke static import;
- gunakan asset yang sama untuk favicon.

Verifikasi:
- `npm run typecheck` ✅
- `npm run lint` ✅, 3 warning lama

Belum dilakukan: E2E test.
```

Respons tidak boleh menyatakan test lulus jika test gagal atau belum dijalankan.

## 10. Batasan dan Aturan Kerja

- Jangan commit tanpa instruksi eksplisit.
- Jangan push tanpa instruksi eksplisit.
- Jangan membuat worktree jika pengguna meminta bekerja langsung di folder project.
- Jangan menambah dependency jika library yang ada sudah cukup.
- Jangan memindahkan business rule ke component.
- Jangan membuat akses `sessionStorage` tersebar.
- Jangan menambah database/API jika belum diminta.
- Jangan mengubah route tanpa persetujuan.
- Jangan menyatakan selesai berdasarkan asumsi.
- Selalu jalankan verifikasi setelah perubahan yang memengaruhi kode.

## 11. Checklist Maintenance

Sebelum menambah kode baru, cek:

- Apakah kode ini benar-benar perlu?
- Apakah sudah ada helper/provider/repository yang dapat dipakai?
- Apakah kode termasuk domain, application, data, infrastructure, atau presentation?
- Apakah import direction masih benar?
- Apakah asset berada di `src/presentation/assets`?
- Apakah screen tetap bebas dari akses storage?
- Apakah TypeScript, lint, build, dan test relevan sudah dijalankan?

## 12. Perubahan yang Belum Selesai

Prioritas berikutnya:

1. Hapus tiga unused import pada `tri-hita-karana-page.tsx`.
2. Jalankan `npx playwright install chromium`.
3. Jalankan `npm test` dan perbaiki test yang benar-benar gagal.
4. Jalankan `npm run build` pada Node yang sesuai.
5. Review perubahan git sebelum commit.

Tidak ada commit atau push yang dilakukan oleh dokumentasi ini.
