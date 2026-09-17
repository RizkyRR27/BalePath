# PRD: BalePath (Platform Manajemen Kegiatan & Penutupan Jalan Banjar)

**Tema Kompetisi:** Shaping Tomorrow: Digital Technology, Artificial Intelligence, and Sustainable Communities  
**Pilar Utama:** Sustainable Communities  
**Versi Dokumen:** 1.0 (MVP Phase)  

---

## 1. Executive Summary & Latar Belakang Masalah

Di Bali, upacara adat (*Panca Yadnya*) dan kegiatan komunal banjar merupakan pilar luhur kehidupan sosial-budaya. Dalam pelaksanaannya, penutupan ruas jalan desa atau rekayasa arus lalu lintas sering kali menjadi kebutuhan yang tak terhindarkan untuk menjaga kesucian dan kelancaran prosesi ritual.

Namun, hingga saat ini distribusi informasi penutupan jalan masih bersifat manual, terfragmentasi di lingkup warga lokal, dan jarang diketahui publik lebih luas sebelum acara berlangsung.

### Masalah Nyata di Lapangan (*Pain Points*):
1. **Kemacetan Mendadak & Kebingungan Komuter:** Pengguna jalan (pekerja harian, pengemudi logistik/ojol, dan wisatawan) sering terjebak macet di gang sempit atau harus putar balik tanpa panduan rute alternatif.
2. **Pemborosan Energi & Polusi Udara:** Kendaraan yang terjebak atau berjalan lambat (*idling*) menghasilkan emisi karbon tinggi dan pemborosan BBM di area pemukiman warga.
3. **Potensi Friksi Sosial:** Munculnya ketegangan antara pengguna jalan yang terburu-buru dengan krama adat/pecalang yang bertugas mengamankan area.

**Solusi:**  
**BalePath** — platform berbasis web responsif yang mendigitalkan agenda kegiatan banjar serta penandaan penutupan jalan secara spasial (*interactive map*). Sistem ini menghubungkan pengurus banjar (admin) dengan masyarakat umum secara transparan untuk mewujudkan mobilitas berkelanjutan yang menghormati tradisi lokal.

---

## 2. Penyelarasan dengan Tema Kompetisi

| Pilar Tema | Peran dalam Sistem | Fitur / Implementasi | Nilai Jual untuk Juri |
| :--- | :--- | :--- | :--- |
| **Sustainable Communities** *(Pilar Utama)* | **Tujuan Akhir (Impact Goal)** | • Edukasi makna upacara pada setiap titik blokade.<br>• Harmonisasi mobilitas perkotaan dengan kearifan lokal.<br>• Koordinasi koridor darurat (ambulans/damkar bersama pecalang). | Menjaga kesucian tradisi adat Bali tanpa mengorbankan kenyamanan publik dan kebersihan lingkungan. |
| **Digital Technology** *(Pilar Fondasi)* | **Sarana Eksekusi (Engine)** | • WebGIS Interaktif (Leaflet / PostGIS).<br>• Kalender multi-peran (Admin vs Publik).<br>• Editor segmen jalan (garis & poligon). | Digitalisasi tata kelola banjar berbasis web ringan yang bisa diakses siapa saja tanpa harus unduh aplikasi berat. |
| **Artificial Intelligence** *(Pilar Akselerator)* | **Kecerdasan Sistem (Smart Feature)** | • *Smart Event Parser* (NLP teks pesan izin acara).<br>• *Smart Detour & Traffic Impact Engine*.<br>• Kalkulator estimasi emisi karbon yang berhasil dihindari. | Memudahkan prajuru banjar menginput data cukup lewat ketikan pesan bebas, serta memandu komuter dengan rute pengalihan teraman. |

---

## 3. Alur Pengguna (User Flow)

### 3.1 Alur A: Kegiatan Adat Mandiri Warga (Krama)
```
[Warga Mengadakan Acara]
          │
          ▼
[Datang & Melapor ke Banjar / Kelian]
          │
          ▼
[Kelian / Admin Banjar Login ke Web BalePath]
          │
          ▼
[Input Data Acara: Nama Upacara, Rentang Tanggal & Jam]
          │
          ▼
[Tandai Ruas Jalan di Peta Spasial (Tutup Total / Buka-Tutup)]
          │
          ▼
[Publish Jadwal] ───► [Otomatis Tampil di Peta & Kalender Publik]
```

### 3.2 Alur B: Kegiatan Internal Banjar
```
[Prajuru Merencanakan Upacara / Rapat Komunal Banjar]
          │
          ▼
[Admin Langsung Input via Web Dashboard]
          │
          ▼
[Tentukan Jam & Segmen Jalan Ditutup] ───► [Publish ke Peta Publik]
```

### 3.3 Alur C: Akses Masyarakat Umum & Pengendara
```
[User Buka Web via Browser HP / Laptop]
          │
          ▼
[Peta Spasial Real-Time Muncul Berdasarkan Lokasi Pengguna]
  ├── Garis Merah: Jalan Ditutup Total
  └── Garis Kuning: Padat / Sistem Buka-Tutup
          │
          ▼
[Klik Titik / Kalender: Lihat Detail Acara & Ambil Rute Pengalihan]
```

---

## 4. Kebutuhan Fungsional (Feature Requirements)

### 4.1 Modul Admin Banjar (Prajuru / Kelian)
* **Autentikasi Aman:** Sistem otentikasi akun khusus perangkat banjar per desa adat.
* **Kalender Jadwal Terpadu:** Manajemen agenda bulanan, mingguan, dan harian untuk memantau kepadatan jadwal banjar.
* **Spatial Road Closure Editor:** Fitur memilih segmen jalan atau menggambar garis/poligon ruas jalan yang ditutup langsung di atas peta interaktif.
* **Tipe Penutupan:** Opsi penandaan *Tutup Total (Full Closure)* atau *Buka-Tutup (Partial/Slowdown)* serta penetapan kantong parkir resmi.
* **AI Smart Event Parser (NLP):** Admin cukup menempelkan pesan teks WhatsApp/surat dari warga (contoh: *"Ngaben di Banjar X tanggal 18 besok jam 12-16 jalan depan ditutup"*), sistem otomatis mengekstrak tanggal, jam, dan nama upacara ke dalam draf form.

### 4.2 Modul Pengguna Publik (Komuter, Warga, Wisatawan)
* **Peta Interaktif Responsif (WebGIS):** Menampilkan status jalan terkini dengan kode warna yang jelas, ringan diakses via ponsel pintar.
* **Kalender Kegiatan Publik:** Fitur cek jadwal penutupan jalan 1–7 hari ke depan untuk membantu perencanaan perjalanan akhir pekan.
* **Kartu Edukasi Budaya:** Ketika ruas jalan diklik, muncul informasi singkat nama upacara dan makna filosofisnya, mengubah kejengkelan macet menjadi apresiasi budaya.
* **Rekomendasi Jalur Pengalihan (Detour):** Panduan visual rute alternatif yang aman dilewati kendaraan roda 2 maupun roda 4.

---

## 5. Rekomendasi Arsitektur Teknologi (Tech Stack)

* **Frontend:** Next.js (React) + Tailwind CSS (Cepat, responsif, SEO-friendly, ramah perangkat seluler).
* **GIS / Pemetaan:** Leaflet.js / Mapbox GL JS + OpenStreetMap (Ringan, fleksibel, mudah menggambar poligon jalan).
* **Backend & API:** Next.js API Routes atau Laravel REST API.
* **Database Spasial:** PostgreSQL dengan ekstensi **PostGIS** (Standar industri untuk query koordinat garis dan poligon jalan).
* **Komponen AI:** Open-source LLM API (ekstraksi teks kegiatan) + algoritma rute OSRM/GraphHopper.

---

## 6. Target Keberlanjutan & Indikator Keberhasilan (KPI)

1. **Efisiensi Waktu Input Admin:** Prajuru banjar dapat menyelesaikan input jadwal dan penandaan jalan dalam waktu $< 90$ detik.
2. **Reduksi Kemacetan & Polusi:** Mengurangi durasi mesin menyala statis (*idling time*) di gang pemukiman warga hingga 25–30%.
3. **Akurasi Spasial:** Informasi penutupan jalan tepat sasaran dan terverifikasi langsung oleh pihak berwenang di banjar.
4. **Keharmonisan Sosial:** Menurunkan komplain pengguna jalan dan memperkuat koordinasi antara pecalang, dinas perhubungan, dan publik.
