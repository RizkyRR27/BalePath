"use client";

import { useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, FilePenLine, MapPin, Plus, Radio, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useEvents } from "@/context/events-context";
import { DEMO_DATE, formatDate, roads, type CeremonyEvent, type Closure } from "@/lib/data";
import { RoadMap } from "@/components/road-map";

export default function DashboardPage() {
  const { user } = useAuth();
  const { events, ready, saveEvent, togglePublished, deleteEvent } = useEvents();
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState(DEMO_DATE);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("15:00");
  const [closure, setClosure] = useState<Closure>("Tutup Total");
  const [roadId, setRoadId] = useState(roads[0].id);
  const [meaning, setMeaning] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [deleting, setDeleting] = useState<string | null>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const owned = events.filter((event) => event.banjarId === user?.banjarId);
  const visible = owned.filter((event) => filter === "Semua" || (filter === "Terpublikasi" ? event.published : !event.published));
  const selectedRoad = roads.find((road) => road.id === roadId)!;
  function reset() {
    setEditing(null); setName(""); setDate(DEMO_DATE); setStart("10:00"); setEnd("15:00"); setClosure("Tutup Total"); setRoadId(roads[0].id); setMeaning(""); setError("");
  }
  function edit(event: CeremonyEvent) {
    setEditing(event.id); setName(event.name); setDate(event.date); setStart(event.startTime); setEnd(event.endTime); setClosure(event.closure); setRoadId(event.roadId); setMeaning(event.meaning); setError(""); setMessage("");
    nameInput.current?.focus();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage("");
    if (!user) return;
    if (!name.trim()) { setError("Nama upacara wajib diisi."); return; }
    if (start >= end) { setError("Jam selesai harus setelah jam mulai pada hari yang sama."); return; }
    const existing = owned.find((item) => item.id === editing);
    const saved = saveEvent({ id: editing ?? crypto.randomUUID(), name: name.trim(), date, startTime: start, endTime: end, closure, roadId, meaning: meaning.trim(), banjarId: user.banjarId, banjar: user.banjar, published: existing?.published ?? false });
    if (saved) { setMessage(editing ? "Perubahan agenda berhasil disimpan." : "Agenda tersimpan sebagai draf. Publikasikan agar terlihat di portal publik."); reset(); }
    else setError("Agenda belum dapat disimpan. Periksa semua isian.");
  }
  if (!ready) return <div className="loading-screen" role="status">Memuat agenda banjar…</div>;
  return <>
    <div className="breadcrumb">Portal Prajuru <ChevronRight size={14} /> Dasbor Banjar</div>
    <section className="admin-welcome"><div><p className="eyebrow"><span className="poleng" /> {user?.banjar}</p><h1>Rahajeng semeng,<br /><em>Prajuru Banjar.</em></h1><p className="muted">Menata agenda yadnya, menjaga ruang bersama.<br />Kelola kegiatan dan informasi penutupan jalan dari satu tempat.</p></div><div className="welcome-aside"><span className="badge demo-badge"><ShieldCheck size={14} /> MODE DEMONSTRASI</span><p><CalendarDays size={16} /> {formatDate(DEMO_DATE)}</p><small>Seluruh jadwal dan ruas jalan adalah data dummy.</small></div></section>
    <section className="stats-grid" aria-label="Ringkasan agenda"><div className="stat-card"><span className="stat-icon"><CalendarDays size={22} /></span><div><span className="muted">Total agenda banjar</span><strong>{owned.length.toString().padStart(2, "0")}</strong></div><small>Seluruh jadwal simulasi</small></div><div className="stat-card"><span className="stat-icon green"><Radio size={22} /></span><div><span className="muted">Terpublikasi</span><strong>{owned.filter((event) => event.published).length.toString().padStart(2, "0")}</strong></div><small>Terlihat di portal publik</small></div><div className="stat-card"><span className="stat-icon clay"><FilePenLine size={22} /></span><div><span className="muted">Draf kegiatan</span><strong>{owned.filter((event) => !event.published).length.toString().padStart(2, "0")}</strong></div><small>Menunggu publikasi admin</small></div></section>
    <div className="section-title"><div><p className="eyebrow">RUANG KERJA BANJAR</p><h2>Rencanakan kegiatan adat</h2></div><span className="muted small">01 Isi agenda <ChevronRight size={13} /> 02 Pilih ruas <ChevronRight size={13} /> 03 Publikasi</span></div>
    <div className="admin-workspace"><section className="panel event-editor"><div className="section-title"><h3><FilePenLine size={20} /> {editing ? "Sunting agenda" : "Agenda baru"}</h3>{editing && <button className="text-button" onClick={reset}>Batal sunting</button>}</div><p className="muted small">Informasi yang jelas membantu perjalanan masyarakat.</p><form className="stack" onSubmit={submit}><label>Nama upacara<input ref={nameInput} required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Piodalan Pura Desa" /></label><label>Tanggal kegiatan<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label><div className="form-grid"><label>Jam mulai · WITA<input type="time" required value={start} onChange={(e) => setStart(e.target.value)} /></label><label>Jam selesai · WITA<input type="time" required value={end} onChange={(e) => setEnd(e.target.value)} /></label></div><fieldset><legend>Status penutupan</legend><div className="closure-options">{(["Tutup Total", "Buka-Tutup"] as Closure[]).map((value) => <label key={value} className={closure === value ? "chosen" : ""}><input type="radio" name="closure" value={value} checked={closure === value} onChange={() => setClosure(value)} /><span className={`dot ${value === "Tutup Total" ? "red" : "gold"}`} />{value}</label>)}</div></fieldset><label>Ruas jalan<select value={roadId} onChange={(e) => setRoadId(e.target.value)}>{roads.map((road) => <option key={road.id} value={road.id}>{road.name}</option>)}</select></label><label>Makna upacara <span className="muted">(opsional)</span><textarea rows={3} maxLength={600} value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Ceritakan makna upacara kepada pengguna jalan…" /></label>{error && <p role="alert" className="error-message">{error}</p>}<button type="submit" className="button primary"><Save size={17} />{editing ? "Simpan perubahan" : "Simpan sebagai draf"}</button><p className="muted small">{editing ? "Status publikasi sebelumnya tetap dipertahankan." : "Draf belum akan tampil di peta publik."}</p></form></section>
    <section className="panel spatial-editor"><div className="section-title"><div><h3><MapPin size={20} /> Penandaan ruas jalan</h3><p className="eyebrow">PILIH SEGMEN PADA PETA SIMULASI</p></div><span className={`badge ${closure === "Tutup Total" ? "full" : "partial"}`}>{closure}</span></div><RoadMap events={[{ id: "preview", name, date, startTime: start, endTime: end, closure, roadId, banjarId: user!.banjarId, banjar: user!.banjar, published: false, meaning }]} selectedRoadId={roadId} onSelectRoad={setRoadId} /><div className="selected-road"><span className="stat-icon"><MapPin size={20} /></span><div><small className="eyebrow">SEGMEN TERPILIH</small><strong>{selectedRoad.name}</strong><span className="muted small">{selectedRoad.coordinates.map((point) => point.map((n) => n.toFixed(4)).join(", ")).join(" → ")}</span></div><Check size={20} /></div><div className="notice"><ShieldCheck size={19} /><p>Geometri dummy untuk demonstrasi pemilihan segmen. Tidak terhubung ke GIS atau kondisi jalan nyata.</p></div></section></div>
    <section className="agenda-managed"><div className="section-title"><div><p className="eyebrow">KOORDINASI & PUBLIKASI</p><h2>Agenda banjar terkelola</h2><p className="muted small">Hanya agenda {user?.banjar} yang dapat Anda kelola.</p></div><label className="filter-label"><span className="sr-only">Filter publikasi</span><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>Semua</option><option>Terpublikasi</option><option>Draf</option></select></label></div>{message && <p className="success-message" role="status"><Check size={18} />{message}</p>}<div className="managed-list">{visible.length === 0 ? <div className="panel empty-state"><CalendarDays size={32} /><h3>Belum ada agenda di kategori ini</h3><button className="button secondary" onClick={() => { reset(); nameInput.current?.focus(); }}><Plus size={16} /> Buat agenda</button></div> : visible.map((event) => <article className="managed-event" key={event.id}><div><span className={`badge ${event.closure === "Tutup Total" ? "full" : "partial"}`}>{event.closure}</span><h3>{event.name}</h3><p className="muted small"><MapPin size={14} />{roads.find((road) => road.id === event.roadId)?.name}</p></div><div className="event-schedule"><strong>{formatDate(event.date)}</strong><span><Clock3 size={14} /> {event.startTime} – {event.endTime} WITA</span><span className={`publication-status ${event.published ? "published" : ""}`}>{event.published ? "Terpublikasi" : "Draf · belum dipublikasikan"}</span></div><div className="event-actions"><button className={`button ${event.published ? "secondary" : "primary"}`} onClick={() => { togglePublished(event.id); setMessage(event.published ? "Agenda ditarik dari portal publik." : "Agenda berhasil dipublikasikan ke portal publik."); }}><Radio size={16} />{event.published ? "Tarik publikasi" : "Publikasikan"}</button><div className="row"><button className="button secondary" aria-label={`Sunting ${event.name}`} onClick={() => edit(event)}><FilePenLine size={15} /> Sunting</button><button className="icon-button danger" aria-label={`Hapus ${event.name}`} onClick={() => setDeleting(event.id)}><Trash2 size={16} /></button></div>{deleting === event.id && <div className="delete-confirm" role="group" aria-label="Konfirmasi hapus"><p>Hapus agenda ini?</p><button className="button secondary" onClick={() => setDeleting(null)}>Batal</button><button className="button danger" onClick={() => { deleteEvent(event.id); if (editing === event.id) reset(); setDeleting(null); setMessage("Agenda berhasil dihapus."); }}>Ya, hapus</button></div>}</div></article>)}</div></section>
  </>;
}
