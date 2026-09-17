"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Flower2, Info, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useEvents } from "@/context/events-context";
import { DEMO_DATE, formatDate, roads } from "@/lib/data";
import { RoadMap } from "@/components/road-map";

export default function PublicMapPage() {
  const { events, ready } = useEvents();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(DEMO_DATE);
  const [closure, setClosure] = useState("Semua");
  const [selectedId, setSelectedId] = useState<string>();
  const [roadId, setRoadId] = useState<string>();
  const published = ready ? events.filter((event) => event.published) : [];
  const filtered = published.filter((event) => {
    const road = roads.find((item) => item.id === event.roadId);
    return (!date || event.date === date) && (closure === "Semua" || event.closure === closure) && `${event.name} ${event.banjar} ${road?.name ?? ""}`.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id"));
  }).sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  const selected = filtered.find((event) => event.id === selectedId && (!roadId || event.roadId === roadId)) ?? filtered.find((event) => !roadId || event.roadId === roadId);
  const selectedRoad = roads.find((road) => road.id === (roadId ?? selected?.roadId));
  function resetFilters() {
    setQuery("");
    setDate(DEMO_DATE);
    setClosure("Semua");
    setRoadId(undefined);
    setSelectedId(undefined);
  }

  return (
    <div className="public-container">
      <section className="public-intro">
        <div><p className="public-eyebrow"><span className="public-tiny-diamond" /> MOBILITAS DALAM HARMONI</p><h1>Ruang untuk tradisi.<br className="public-mobile-break" /> <em>Jalan untuk bersama.</em></h1><p className="public-lead">Kenali jadwal upacara dan penataan jalan adat sebelum melangkah.</p></div>
        <div className="public-location"><MapPin size={19} aria-hidden="true" /><div><strong>Ubud, Gianyar</strong><span>Bali, Indonesia · WITA</span></div></div>
      </section>
      <div className="public-map-toolbar">
        <label className="public-search"><Search size={18} aria-hidden="true" /><span className="public-sr-only">Cari upacara, banjar, atau jalan</span><input type="search" placeholder="Cari upacara, banjar, atau jalan…" value={query} onChange={(event) => { setQuery(event.target.value); setRoadId(undefined); }} /></label>
        <label className="public-date-field"><CalendarDays size={17} aria-hidden="true" /><span className="public-sr-only">Tanggal jadwal</span><input aria-label="Tanggal jadwal" type="date" value={date} onChange={(event) => { setDate(event.target.value); setRoadId(undefined); }} /></label>
        <div className="public-filter-group" aria-label="Filter penutupan"><SlidersHorizontal size={16} aria-hidden="true" />{["Semua", "Tutup Total", "Buka-Tutup"].map((value) => <button key={value} type="button" aria-pressed={closure === value} onClick={() => { setClosure(value); setRoadId(undefined); }}>{value}</button>)}</div>
      </div>
      <div className="public-workspace">
        <div className="public-map-column">
          <div className="public-section-bar"><h2><span className="public-gold">01</span> Peta ruang adat</h2><span className="public-demo-label">MODE DEMO</span></div>
          <RoadMap events={filtered} selectedRoadId={roadId ?? selected?.roadId} onSelectRoad={(id) => { setRoadId(id); setSelectedId(undefined); }} />
          <div className="public-map-note"><Info size={17} aria-hidden="true" /><p>Jadwal untuk <strong>{date ? formatDate(date) : "semua tanggal"}</strong>. Ikuti informasi banjar dan arahan petugas di lapangan.</p></div>
        </div>
        <aside className="public-side" aria-label="Detail upacara">
          <div className="public-section-bar"><h2><span className="public-gold">02</span> Di balik perjalanan</h2><Flower2 size={17} className="public-gold" aria-hidden="true" /></div>
          <div className="public-detail-card" aria-live="polite">
            <div className="public-poleng-trim" />
            {!ready ? <div className="public-empty" role="status">Menyiapkan jadwal adat…</div> : selected ? <div className="public-detail-body">
              <div className="public-between"><span className={`public-status ${selected.closure === "Tutup Total" ? "public-full" : "public-partial"}`}>{selected.closure}</span><span className="public-small-label">JADWAL ADAT</span></div>
              <h3>{selected.name}</h3>
              <p className="public-icon-line"><MapPin size={16} aria-hidden="true" />{selected.banjar}</p>
              <div className="public-detail-time"><Clock3 size={20} aria-hidden="true" /><div><strong>{selected.startTime} – {selected.endTime} <small>WITA</small></strong><span>{formatDate(selected.date)}</span></div></div>
              <div className="public-road-detail"><span className="public-small-label">RUAS TERDAMPAK</span><strong>{roads.find((road) => road.id === selected.roadId)?.name ?? "Ruas belum tersedia"}</strong></div>
              <div className="public-meaning"><h4><Flower2 size={18} aria-hidden="true" /> Makna upacara</h4><p>{selected.meaning || "Informasi makna upacara belum ditambahkan oleh banjar."}</p></div>
              <p className="public-etiquette">Beri ruang bagi prosesi. Kurangi suara klakson dan hormati arahan pecalang.</p>
              <Link href={`/kalender?date=${selected.date}`} className="public-action public-action-gold">Lihat di kalender <ArrowRight size={17} aria-hidden="true" /></Link>
            </div> : <div className="public-empty"><Flower2 size={32} aria-hidden="true" /><h3>{selectedRoad ? selectedRoad.name : "Belum ada jadwal"}</h3><p>Tidak ada upacara yang cocok dengan pilihan ini. Ini bukan jaminan jalan terbuka.</p><button type="button" className="public-action" onClick={resetFilters}>Reset pilihan</button></div>}
          </div>
          <div className="public-small-note"><span className="public-tiny-diamond" /><p>Perjalanan yang baik dimulai dengan saling memahami.</p></div>
        </aside>
      </div>
      <section className="public-agenda-section" aria-labelledby="agenda-title">
        <div className="public-section-bar"><div><p className="public-eyebrow">RENCANAKAN LANGKAH ANDA</p><h2 id="agenda-title" className="public-serif-title">Agenda {date === DEMO_DATE ? "hari demo" : "pilihan"} <span className="public-count">{filtered.length}</span></h2></div><Link href="/kalender" className="public-text-link">Kalender lengkap <ArrowRight size={16} aria-hidden="true" /></Link></div>
        {!ready ? <p role="status" className="public-empty">Memuat agenda…</p> : !filtered.length ? <div className="public-no-results"><Search size={22} aria-hidden="true" /><p>Tidak ada jadwal yang sesuai. Coba tanggal atau kata kunci lain.</p><button type="button" onClick={resetFilters} className="public-action"><X size={16} aria-hidden="true" /> Reset filter</button></div> : <div className="public-agenda-grid">{filtered.map((event) => <button type="button" key={event.id} className="public-agenda-card" aria-pressed={selected?.id === event.id} onClick={() => { setSelectedId(event.id); setRoadId(event.roadId); }}><span className="public-between"><span className={`public-status ${event.closure === "Tutup Total" ? "public-full" : "public-partial"}`}>{event.closure}</span><ArrowRight size={17} aria-hidden="true" /></span><strong className="public-agenda-name">{event.name}</strong><span className="public-icon-line"><MapPin size={14} aria-hidden="true" />{event.banjar}</span><span className="public-agenda-bottom"><span>{formatDate(event.date)}</span><span>{event.startTime} – {event.endTime} WITA</span></span></button>)}</div>}
      </section>
      <section className="public-harmony"><Flower2 size={30} strokeWidth={1} aria-hidden="true" /><div><h2>Adat terjaga, perjalanan tertata.</h2><p>Satu ruang untuk tradisi, masyarakat, dan lingkungan yang saling menghidupi.</p></div><span className="public-small-label">TRI HITA KARANA</span></section>
    </div>
  );
}
