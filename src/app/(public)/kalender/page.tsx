"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Flower2, Info, MapPin, Search } from "lucide-react";
import { useEvents } from "@/context/events-context";
import { DEMO_DATE, formatDate, roads, type CeremonyEvent } from "@/lib/data";

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function validDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return DEMO_DATE;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && dateKey(date) === value ? value : DEMO_DATE;
}

function CalendarContent() {
  const { events, ready } = useEvents();
  const params = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => validDate(params.get("date")));
  const [month, setMonth] = useState(() => new Date(`${validDate(params.get("date")).slice(0, 7)}-01T12:00:00Z`));
  const [query, setQuery] = useState("");
  const [closure, setClosure] = useState("Semua");
  const published: CeremonyEvent[] = ready ? events.filter((event: CeremonyEvent) => event.published) : [];
  const filtered = published.filter((event) => (closure === "Semua" || event.closure === closure) && `${event.name} ${event.banjar} ${roads.find((road) => road.id === event.roadId)?.name ?? ""}`.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")));
  const monthKey = dateKey(month).slice(0, 7);
  const monthEvents = filtered.filter((event) => event.date.startsWith(monthKey));
  const dayEvents = filtered.filter((event) => event.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const firstDay = month.getUTCDay();
  const daysInMonth = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const monthLabel = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(month);
  function changeMonth(amount: number) {
    const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + amount, 1, 12));
    setMonth(next);
    setSelectedDate(dateKey(next));
  }
  function resetDate() {
    setMonth(new Date(`${DEMO_DATE.slice(0, 7)}-01T12:00:00Z`));
    setSelectedDate(DEMO_DATE);
  }

  return (
    <div className="public-container">
      <section className="public-intro public-calendar-intro"><div><p className="public-eyebrow"><span className="public-tiny-diamond" /> WAKTU SAKRAL, LANGKAH SELARAS</p><h1>Kalender <em>Yadnya.</em></h1><p className="public-lead">Kenali waktu upacara. Rencanakan perjalanan dengan penuh penghormatan.</p></div><div className="public-location"><CalendarDays size={23} strokeWidth={1.5} aria-hidden="true" /><div><strong>Agenda adat Ubud</strong><span>Jadwal demo · Waktu Indonesia Tengah</span></div></div></section>
      <div className="public-calendar-toolbar"><label className="public-search"><Search size={18} aria-hidden="true" /><span className="public-sr-only">Cari agenda kalender</span><input type="search" placeholder="Cari upacara atau banjar…" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="public-filter-group" aria-label="Filter status kalender">{["Semua", "Tutup Total", "Buka-Tutup"].map((value) => <button type="button" key={value} aria-pressed={closure === value} onClick={() => setClosure(value)}>{value}</button>)}</div></div>
      <div className="public-calendar-layout">
        <section className="public-calendar-panel" aria-labelledby="month-title">
          <div className="public-calendar-heading"><div><p className="public-eyebrow">KALENDER BULANAN</p><h2 id="month-title" aria-live="polite">{monthLabel}</h2></div><div className="public-month-actions"><button type="button" className="public-action public-demo-reset" onClick={resetDate}>Tanggal demo</button><button type="button" className="public-icon-button" onClick={() => changeMonth(-1)} aria-label="Bulan sebelumnya"><ChevronLeft size={20} /></button><button type="button" className="public-icon-button" onClick={() => changeMonth(1)} aria-label="Bulan berikutnya"><ChevronRight size={20} /></button></div></div>
          <div className="public-calendar-legend"><span><i className="public-dot public-dot-full" /> Tutup Total</span><span><i className="public-dot public-dot-partial" /> Buka-Tutup</span><span className="public-calendar-total">{monthEvents.length} agenda bulan ini</span></div>
          <div className="public-weekdays" aria-hidden="true">{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="public-days" aria-label={`Pilih tanggal di ${monthLabel}`}>
            {Array.from({ length: cells }, (_, index) => {
              const day = index - firstDay + 1;
              if (day < 1 || day > daysInMonth) return <div key={`empty-${index}`} className="public-day-empty" aria-hidden="true" />;
              const key = `${monthKey}-${String(day).padStart(2, "0")}`;
              const scheduled = monthEvents.filter((event) => event.date === key);
              const full = scheduled.some((event) => event.closure === "Tutup Total");
              const partial = scheduled.some((event) => event.closure === "Buka-Tutup");
              return <button type="button" key={key} className={`public-day ${selectedDate === key ? "public-day-selected" : ""} ${key === DEMO_DATE ? "public-day-demo" : ""}`} onClick={() => setSelectedDate(key)} aria-pressed={selectedDate === key} aria-label={`${formatDate(key)}, ${scheduled.length} agenda${full ? ", Tutup Total" : ""}${partial ? ", Buka-Tutup" : ""}${key === DEMO_DATE ? ", tanggal demo" : ""}`}><span className="public-day-number">{day}</span><span className="public-day-indicators" aria-hidden="true">{full && <i className="public-dot public-dot-full" />}{partial && <i className="public-dot public-dot-partial" />}</span>{scheduled.length > 0 && <span className="public-day-event" aria-hidden="true">{scheduled[0].name}{scheduled.length > 1 ? ` +${scheduled.length - 1}` : ""}</span>}</button>;
            })}
          </div>
          <div className="public-calendar-caption"><Info size={16} aria-hidden="true" /><p>Pilih tanggal untuk melihat rincian. Tanggal tanpa agenda bukan jaminan jalan terbuka.</p></div>
          <div className="public-calendar-stats"><div><strong>{monthEvents.length.toString().padStart(2, "0")}</strong><span>Agenda terpublikasi</span></div><div><strong>{new Set(monthEvents.map((event) => event.banjarId)).size.toString().padStart(2, "0")}</strong><span>Banjar berpartisipasi</span></div><div><strong>{new Set(monthEvents.map((event) => event.roadId)).size.toString().padStart(2, "0")}</strong><span>Ruas terjadwal</span></div></div>
        </section>
        <section className="public-day-agenda" aria-labelledby="day-title" aria-live="polite">
          <div className="public-section-bar"><div><p className="public-eyebrow">AGENDA TANGGAL PILIHAN</p><h2 id="day-title" className="public-serif-title">{formatDate(selectedDate)}</h2></div><span className="public-count">{dayEvents.length}</span></div>
          {!ready ? <div className="public-empty" role="status">Menyiapkan kalender…</div> : dayEvents.length === 0 ? <div className="public-empty public-calendar-empty"><CalendarDays size={36} strokeWidth={1} aria-hidden="true" /><h3>Ruang untuk jeda.</h3><p>Belum ada agenda terpublikasi yang sesuai pada tanggal ini. Pilih tanggal lain atau ubah filter.</p>{(query || closure !== "Semua") && <button type="button" className="public-action" onClick={() => { setQuery(""); setClosure("Semua"); }}>Hapus filter</button>}</div> : dayEvents.map((event) => <article key={event.id} className="public-calendar-event"><div className="public-between"><span className={`public-status ${event.closure === "Tutup Total" ? "public-full" : "public-partial"}`}>{event.closure}</span><Flower2 size={21} className="public-gold" strokeWidth={1.5} aria-hidden="true" /></div><h3>{event.name}</h3><p className="public-icon-line"><MapPin size={15} aria-hidden="true" />{event.banjar}</p><div className="public-calendar-event-time"><Clock3 size={17} aria-hidden="true" /><strong>{event.startTime} – {event.endTime} WITA</strong></div><p className="public-event-road">{roads.find((road) => road.id === event.roadId)?.name ?? "Ruas belum tersedia"}</p><details className="public-culture-details"><summary>Makna upacara & etika perjalanan</summary><p>{event.meaning || "Makna upacara belum ditambahkan."}</p><p>Hormati prosesi dan ikuti arahan pecalang setempat.</p></details><Link href="/" className="public-text-link">Jelajahi peta adat <ArrowRight size={15} aria-hidden="true" /></Link></article>)}
          <div className="public-calendar-reminder"><span className="public-poleng" aria-hidden="true" /><div><strong>Jadwal adalah panduan, bukan kepastian.</strong><p>Ini adalah data simulasi. Konfirmasikan perubahan jadwal kepada banjar sebelum bepergian.</p></div></div>
        </section>
      </div>
      <section className="public-harmony"><Flower2 size={30} strokeWidth={1} aria-hidden="true" /><div><h2>Setiap upacara punya makna.</h2><p>Dengan memahami waktunya, kita ikut menjaga keharmonisan ruang bersama.</p></div><span className="public-small-label">TRI HITA KARANA</span></section>
    </div>
  );
}

export default function CalendarPage() {
  return <Suspense fallback={<div className="public-container public-empty" role="status">Menyiapkan kalender adat…</div>}><CalendarContent /></Suspense>;
}
