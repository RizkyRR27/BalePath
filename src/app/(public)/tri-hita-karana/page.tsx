"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Ambulance, BadgeCheck, Calculator, Flower2, Handshake, Info, Leaf, Map, Phone, ShieldCheck, Sprout, Sun, TimerOff, Users } from "lucide-react";
import "./impact.css";

const vehicles = [
  { id: "motor", label: "Sepeda Motor", rate: 0.08 },
  { id: "mobil_kecil", label: "Mobil LCGC", rate: 0.19 },
  { id: "suv_van", label: "Van / SUV", rate: 0.28 },
];

const pillars = [
  { name: "Parahyangan", label: "01 • Ketuhanan", icon: Flower2, detailIcon: BadgeCheck, tone: "gold", description: "Harmoni vertikal ke hadapan Ida Sang Hyang Widhi Wasa. Yadnya di perempatan agung (Catus Pata) memurnikan ruang kosmis banjar, mengajak pengendara mengikhlaskan jeda waktu demi kesucian jagat.", detail: "Penyucian Rute Melasti & Ogoh-ogoh" },
  { name: "Pawongan", label: "02 • Kemanusiaan", icon: Users, detailIcon: Handshake, tone: "coral", description: "Saling asah, asih, dan asuh antara krama adat yang berupacara dengan masyarakat komuter, kurir logistik, dan wisatawan. Sapaan ramah pecalang mengubah jeda perjalanan menjadi persaudaraan.", detail: "Panduan Sopan Santun Pecalang Siaga" },
  { name: "Palemahan", label: "03 • Lingkungan", icon: Leaf, detailIcon: Sprout, tone: "green", description: "Penjagaan tanah dewata dari akumulasi jelaga dan karbon knalpot. Perencanaan perjalanan dan pemilihan rute alternatif dapat membantu mengurangi waktu mesin menyala saat menunggu di sekitar ruang sakral.", detail: "Langkah Kecil Menjaga Udara Bersama" },
];

const ceremonies = [
  {
    title: "Pawai Ogoh-ogoh & Netralisasi Catus Pata",
    label: "Bhuta Yadnya • Tawur Agung Kesanga",
    tone: "coral",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE2PptZTnNVbFEzYHA5S7MauW5VEnsygp_PA_G7jufpyj0f9w2VWJ6F7sen0nBKtak7FQuZfXkh6uFJKvYqhvSCVFZtlwFxK74c38H3zZ6LYZhSViIX2Kel4lPLQHwRHqXV_gng_x_mw3haShRz7Tv9XFWNHfkOgDmkUGJlFMxPIiasdjFC3IdNyW9LNseJQOJ0Sm-PHbr5rk7g6QVzdWHaS9IHKMg1qWlMxb1XcEqTLNeodNSVaxt",
    alt: "Ilustrasi pawai Ogoh-ogoh pada malam hari, dengan cahaya obor dan warga berkumpul di perempatan.",
    description: "Di malam Pengrupukan, perempatan agung menjadi ruang prosesi ogoh-ogoh. Perputaran arak-arakan di Catus Pata melambangkan penetralan energi alam semesta sebelum memasuki keheningan Nyepi. Tata prosesi mengikuti tradisi setempat.",
    etiquette: "Matikan mesin saat berhenti aman menunggu iringan obor dan gamelan baleganjur; jangan menerobos barisan pecalang berseragam poleng.",
  },
  {
    title: "Iring-iringan Melasti Menuju Segara / Beji",
    label: "Dewa Yadnya • Tirtha Amretha",
    tone: "gold",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-pl2sjlwY5YE4Y-B_A0EzWco6LzPbc0V4mpOU6a2sGd3KgxIN4dke0Qf39R9JMimRbvWGVv2y_--5GyH7iY_PCcOg7imtKC7E9kTvRjX2HmAID2Xlb5KYOK3b1_p7qBeYIPzyUKAEFq7jZolBD3eUdgCgJIU1zRThhKF0VWiqOeQrL0D3TpZn5nWFwtlIYLYd1_zlXwAh7Wdm4w8V40E3HkykMOv0VMyOTsETip0zIgC64SWZqdFK",
    alt: "Ilustrasi iring-iringan Melasti membawa payung tedung dan persembahan menuju pesisir.",
    description: "Krama membawa pratima dan benda sakral menuju laut atau sumber air untuk penyucian. Pengalihan atau penutupan sebagian jalan memberi ruang bagi pejalan kaki dan para pemangku yang mengusung benda suci.",
    etiquette: "Hindari membunyikan klakson keras dan jangan memotong jalan di antara barisan pembawa umbul-umbul dan tedung.",
  },
  {
    title: "Arak-arakan Bade & Lembu Ngaben",
    label: "Pitra Yadnya • Pengembalian Panca Maha Bhuta",
    tone: "stone",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWR-AgYMcR3e28oaB1ezM2pgKs0CWG9rEoo5WbsmbqK9G51YM3n1_MrrvL0boLpDhiHCjvzhEjmCJA3MAby5Poa5n5diKzVosGishaEvDfmtmHbN7Y2sbNJT2JZd3jI7FDqxdr2XX4VWCfDV_ve-rL1Df83s_u0IjLEZQAJaKW7xfmWjSKQCbDUD8YQjQX07MRM3cKl1XYjJz_EMn5nSidTCvU1acMsGxg2-xpn5mKGZoW2McLnYcq",
    alt: "Ilustrasi menara Bade dan lembu dalam arak-arakan Ngaben di tengah warga banjar.",
    description: "Pengusungan menara Bade menuju setra (pemakaman adat) membutuhkan ruang yang lapang. Lintasan dipersiapkan oleh petugas agar iringan dapat bergerak dengan aman, sebagai penghormatan kepada mereka yang berpulang.",
    etiquette: "Berhenti di tempat aman sesuai arahan pecalang. Beri ruang bagi pengusung dan jaga sikap tenang selama prosesi melintas.",
  },
  {
    title: "Piodalan & Kirab Iringan Gebogan",
    label: "Dewa Yadnya • Peringatan Pura",
    tone: "green",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLLM_lZS6lLg1EGfVSNbEU7PdOpSV3LP4vfENJ6jXNbhMN3Om8diu_0HhpLfKb1LuI35GIlJaY2uqU7HCayT6merM0jQma7yJn5TWdJtNB9Zbz3pTellrzmfTuI_uIxCpWja2U3XRhIvLZ9OeG1Eml9NZUcbtEIQpgcBM6zzUlXaTSFVpexVkhLsdMX6q1-8LI0gEU8vuTmmCvqyHeASH1uae0YT66T6vusuhkBe03pteehDwOhmTr",
    alt: "Ilustrasi perempuan membawa gebogan saat piodalan, di antara penjor dan gerbang pura yang diterangi cahaya hangat.",
    description: "Peringatan hari suci pura, yang banyak dirayakan setiap 210 hari menurut kalender pawukon. Jalan sekitar pura dapat dipersiapkan untuk pejalan kaki pembawa gebogan buah dan persembahan canang sari.",
    etiquette: "Gunakan rute alternatif yang diarahkan pecalang; hindari parkir di bahu jalan sempit dan akses masuk pura.",
  },
];

const etiquette = [
  { title: "Patuhi Isyarat Pecalang", description: "Pecalang memandu arus demi keselamatan iringan upacara dan pengguna jalan. Ikuti arah rambu alternatif dengan tenang." },
  { title: "Pakaian Sopan & Tertib", description: "Jika perlu turun di sekitar pura, kenakan pakaian sopan penutup bahu dan lutut. Mintalah izin sebelum memasuki area suci." },
  { title: "Jangan Melangkahi Canang", description: "Perhatikan sesaji canang sari di jalan. Jaga langkah dan arah roda kendaraan agar tidak menginjak atau melindas persembahan." },
  { title: "Koridor Darurat Medis", description: "Beri jalan bagi ambulans. Dalam keadaan darurat, hubungi 119 dan sampaikan kondisi kepada petugas; jangan menganggap akses otomatis terbuka." },
];

export default function TriHitaKaranaPage() {
  const [vehicleId, setVehicleId] = useState("motor");
  const [frequency, setFrequency] = useState(8);
  const vehicle = vehicles.find((item) => item.id === vehicleId) ?? vehicles[0];
  const fuel = vehicle.rate * 3.8 * frequency;
  const co2 = fuel * 2.3;

  return (
    <div className="impact-page">
      <section className="impact-section impact-hero" aria-labelledby="impact-title">
        <div className="impact-container">
          <div className="impact-hero-heading">
            <div className="impact-hero-copy">
              <div className="impact-kicker"><span className="impact-badge">Krama & Spasial Adat</span><span aria-hidden="true">·</span><span>Edukasi Ekologi Sakral</span></div>
              <h1 id="impact-title">Tri Hita Karana & Tata Hijau Mobilitas Adat</h1>
              <p>Menyelaraskan yadnya sakral leluhur dengan sirkulasi komuter kontemporer. Ruang suci Bali dijaga bukan dengan membatasi, melainkan dengan memuliakan waktu dan aliran energi bumi tanpa friksi.</p>
            </div>
            <a className="impact-hotline" href="#kontak-darurat"><ShieldCheck size={26} aria-hidden="true" /><span><small>Siaga Adat</small><strong>Hotline & Kontak Darurat</strong><span>Kontak pecalang belum diverifikasi</span></span></a>
          </div>
          <div className="impact-pillars">
            {pillars.map(({ name, label, icon: Icon, detailIcon: DetailIcon, tone, description, detail }) => (
              <article className={`impact-pillar impact-tone-${tone}`} key={name}>
                <div className="impact-pillar-top"><span className="impact-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span><span className="impact-label">{label}</span></div>
                <h2>{name}</h2><p>{description}</p>
                <div className="impact-pillar-detail"><DetailIcon size={16} aria-hidden="true" /><span>{detail}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-section impact-dark" aria-labelledby="impact-metrics-title">
        <div className="impact-container">
          <div className="impact-section-heading impact-heading-split"><div><p className="impact-eyebrow">Contoh Simulasi Dampak • Bukan Data Langsung</p><h2 id="impact-metrics-title">Dampak Ekologis Rerouting Adat</h2></div><p>Angka berikut adalah contoh ilustratif, bukan hasil pengukuran Banjar Ubud Kaja. Pengalihan rute tidak selalu mengurangi jarak atau emisi.</p></div>
          <div className="impact-metrics">
            <article className="impact-metric impact-tone-green">
              <div className="impact-metric-top"><div><h3>Contoh Reduksi Emisi</h3><strong className="impact-metric-value">1,420</strong><p>kg CO₂e terhindar · simulasi</p></div><span className="impact-icon"><Leaf size={24} aria-hidden="true" /></span></div>
              <div className="impact-metric-bottom"><svg className="impact-sparkline" viewBox="0 0 280 40" fill="none" aria-hidden="true"><path d="M0 35 L35 32 L70 28 L105 30 L140 20 L175 22 L210 12 L245 15 L280 4 L280 40 L0 40 Z" fill="currentColor" fillOpacity=".12" /><path d="M0 35 L35 32 L70 28 L105 30 L140 20 L175 22 L210 12 L245 15 L280 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><p><span className="impact-accent">↑ 18.2%</span> contoh tren, bukan perbandingan aktual</p></div>
            </article>
            <article className="impact-metric impact-tone-gold">
              <div className="impact-metric-top"><div><h3>Efisiensi Waktu Diam (Idling)</h3><strong className="impact-metric-value">28.4%</strong><p>Contoh target: 25% – 30%</p></div><span className="impact-icon"><TimerOff size={24} aria-hidden="true" /></span></div>
              <div className="impact-metric-bottom"><progress className="impact-progress" value={28.4} max={30} aria-label="Contoh efisiensi waktu diam: 28.4 persen dari target 30 persen" /><div className="impact-progress-labels"><span>Min. 25%</span><span className="impact-accent">Simulasi 28.4%</span><span>Target 30%</span></div></div>
            </article>
            <article className="impact-metric impact-tone-gold">
              <div className="impact-metric-top"><div><h3>Harmonisasi Yadnya</h3><strong className="impact-metric-value">34</strong><p>Upacara terfasilitasi · contoh</p></div><span className="impact-icon"><Sun size={24} aria-hidden="true" /></span></div>
              <div className="impact-metric-bottom impact-ceremony-count"><div className="impact-tokens" aria-hidden="true"><span>OG</span><span>ML</span><span>NG</span></div><p>Ilustrasi kegiatan adat</p><span className="impact-example">Data contoh</span></div>
            </article>
          </div>

          <div className="impact-calculator" aria-labelledby="impact-calculator-title">
            <div className="impact-calculator-controls">
              <p className="impact-eyebrow"><Calculator size={20} aria-hidden="true" />Kalkulator Jejak Komuter Rerouting</p>
              <h3 id="impact-calculator-title">Hitung Penghematan BBM & Emisi Pribadi</h3>
              <p>Pilih jenis kendaraan dan frekuensi perjalanan untuk memperkirakan potensi penghematan dalam skenario rute alternatif.</p>
              <fieldset className="impact-vehicle-field"><legend>Jenis kendaraan</legend><div className="impact-vehicle-options">{vehicles.map((item) => <button type="button" key={item.id} aria-pressed={vehicleId === item.id} onClick={() => setVehicleId(item.id)}>{item.label}</button>)}</div></fieldset>
              <div className="impact-frequency"><div className="impact-frequency-heading"><label htmlFor="detour-range">Frekuensi penerapan detour / bulan</label><span id="slider-val">{frequency} Kali Rerouting</span></div><input id="detour-range" type="range" min="1" max="25" step="1" value={frequency} aria-valuetext={`${frequency} kali rerouting per bulan`} aria-describedby="impact-assumptions" onChange={(event) => setFrequency(Number(event.target.value))} /><div className="impact-range-labels"><span>1 Perjalanan</span><span>25 Perjalanan</span></div></div>
            </div>
            <div className="impact-result">
              <div className="impact-result-heading"><span>Simulasi Manfaat Palemahan</span><span className="impact-poleng" aria-hidden="true"><i /><i /><i /></span></div>
              <div className="impact-result-values" role="status" aria-live="polite" aria-atomic="true">
                <div><label htmlFor="calc-fuel">Estimasi BBM dihemat</label><output id="calc-fuel" htmlFor="detour-range">{fuel.toFixed(1)} Liter</output><span>Potensi per bulan</span></div>
                <div><label htmlFor="calc-co2">Estimasi emisi CO₂ dihindari</label><output id="calc-co2" htmlFor="detour-range">{co2.toFixed(1)} kg</output><span>Potensi per bulan</span></div>
              </div>
              <div className="impact-result-note"><Sprout size={24} aria-hidden="true" /><p>Memberi ruang bagi prosesi, sekaligus mempertimbangkan jejak perjalanan. Hasil ini estimasi, bukan jaminan penghematan.</p></div>
              <p id="impact-assumptions" className="impact-assumptions">Asumsi simulasi: 3.8 km perjalanan stop-and-go dihindari per detour × frekuensi × konsumsi BBM (motor 0.08, LCGC 0.19, Van / SUV 0.28 liter/km). CO₂ = BBM sebelum pembulatan × 2.3 kg/liter. Tampilan dibulatkan satu desimal. Belum memperhitungkan tambahan jarak detour, kondisi lalu lintas, atau variasi kendaraan.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section impact-editorial" aria-labelledby="impact-ceremonies-title">
        <div className="impact-container">
          <div className="impact-section-heading impact-editorial-heading"><p className="impact-eyebrow">Ensiklopedia Panca Yadnya</p><h2 id="impact-ceremonies-title">Mengapa Rute Jalan Sakral Ditutup?</h2><p>Pengalihan jalan dalam yadnya memberi ruang bagi penyelarasan makrokosmos (<em>Bhuana Agung</em>) dan mikrokosmos (<em>Bhuana Alit</em>). Kenali empat contoh prosesi berikut; pelaksanaan dapat berbeda antarbanjar. Gambar merupakan ilustrasi.</p></div>
          <div className="impact-ceremonies">
            {ceremonies.map((ceremony) => <article className="impact-ceremony" key={ceremony.title}><div className="impact-ceremony-image"><Image src={ceremony.image} alt={ceremony.alt} fill unoptimized sizes="(max-width: 700px) 100vw, (max-width: 1439px) 50vw, 800px" /><span className={`impact-image-label impact-image-label-${ceremony.tone}`}>{ceremony.label}</span></div><div className="impact-ceremony-body"><h3>{ceremony.title}</h3><p>{ceremony.description}</p><div className="impact-ceremony-etiquette"><Info size={16} aria-hidden="true" /><p><strong>Etika Pengendara:</strong> {ceremony.etiquette}</p></div></div></article>)}
          </div>
          <section className="impact-etiquette" aria-labelledby="impact-etiquette-title"><div className="impact-etiquette-heading"><div><p className="impact-eyebrow">Panduan Etika Krama & Wisatawan</p><h3 id="impact-etiquette-title">Tata Cara Melintasi Titik Penutupan Jalur Sakral</h3></div><span className="impact-guidance-badge">Panduan umum · Ikuti arahan adat setempat</span></div><div className="impact-etiquette-grid">{etiquette.map((item, index) => <article className="impact-etiquette-card" key={item.title}><span className="impact-step" aria-hidden="true">0{index + 1}</span><h4>{item.title}</h4><p>{item.description}</p></article>)}</div></section>
        </div>
      </section>

      <section className="impact-section impact-dark impact-contact" id="kontak-darurat" aria-labelledby="impact-contact-title" tabIndex={-1}>
        <div className="impact-container">
          <div className="impact-section-heading impact-contact-heading"><p className="impact-eyebrow">Kolaborasi & Tanggap Cepat</p><h2 id="impact-contact-title">Saluran Siaga Banjar Adat Ubud Kaja</h2><p>Informasi kontak untuk membantu perjalanan yang tertib. Halaman ini tidak terhubung ke posko pecalang, WhatsApp, rumah sakit, atau sistem pengiriman ambulans.</p></div>
          <div className="impact-contacts">
            <article className="impact-contact-card"><div className="impact-contact-card-heading"><span className="impact-icon"><ShieldCheck size={30} aria-hidden="true" /></span><div><p className="impact-eyebrow">Posko Terpadu Pecalang</p><h3>Pecalang Siaga Rekayasa Jalan</h3><p>Konfirmasikan kontak kepada banjar setempat.</p></div><span className="impact-contact-status">Belum diverifikasi</span></div><p>Nomor pecalang pada desain belum diverifikasi, sehingga tidak ditampilkan sebagai nomor yang dapat dihubungi. Jam siaga dan saluran komunikasi belum dikonfirmasi.</p><div className="impact-contact-actions"><span className="impact-contact-placeholder"><Phone size={16} aria-hidden="true" />Nomor posko belum tersedia</span><span className="impact-unavailable">WhatsApp belum tersedia</span></div></article>

          </div>
        </div>
      </section>
    </div>
  );
}
