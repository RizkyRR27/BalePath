"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Flower2, Info, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useBanjarEvents } from "@/presentation/providers/banjar-events-provider";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { SEGMENT_META, type RoadSegmentStatus } from "@/domain/entities/road-segment";
import { formatDate } from "@/domain/formatters/format-date";
import { PublicRoadMap } from "@/presentation/components/public-road-map";
import { coversDate, todayIso } from "@/presentation/components/public-event-map-section";
import { localePath } from "@/presentation/i18n/locale";
import { useTranslation } from "@/presentation/i18n/translation-provider";

type StatusFilter = "all" | RoadSegmentStatus;

const STATUS_OPTIONS: StatusFilter[] = ["all", "TUTUP_TOTAL", "BUKA_TUTUP", "HANYA_MOTOR", "JALUR_ALTERNATIF"];

function matchesQuery(event: BanjarEvent, query: string, locale: string): boolean {
  const needle = query.trim().toLocaleLowerCase(locale);
  if (!needle) return true;
  return `${event.title} ${event.banjarName} ${event.description ?? ""}`
    .toLocaleLowerCase(locale)
    .includes(needle);
}

function dateRangeLabel(event: BanjarEvent, locale: "id" | "en"): string {
  return event.startDate === event.endDate
    ? formatDate(event.startDate, locale)
    : `${formatDate(event.startDate, locale)} – ${formatDate(event.endDate, locale)}`;
}

export default function PublicMapPage() {
  // Sumber tunggal kebenaran: shared store admin <-> publik (localStorage).
  // Tidak ada lagi koordinat dummy / CeremonyEvent statis di halaman ini.
  const { events, ready } = useBanjarEvents();
  const { locale, t } = useTranslation();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<string>(() => todayIso());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string>();

  // Peta HANYA merender ruas yang jadwalnya mencakup tanggal pilihan:
  // selectedDate >= startDate && selectedDate <= endDate.
  const filtered = useMemo(
    () =>
      events
        .filter((event) => coversDate(event, date))
        .filter((event) => status === "all" || event.roadSegments.some((segment) => segment.status === status))
        .filter((event) => matchesQuery(event, query, locale))
        .sort((a, b) => `${a.startDate}${a.startTime}`.localeCompare(`${b.startDate}${b.startTime}`)),
    [events, date, status, query, locale],
  );

  // Seleksi derivatif: id basi otomatis jatuh ke event pertama hasil filter.
  const selected = filtered.find((event) => event.id === selectedId) ?? filtered[0];
  const selectedStatuses = selected
    ? [...new Set(selected.roadSegments.map((segment) => segment.status))]
    : [];

  function resetFilters() {
    setQuery("");
    setDate(todayIso());
    setStatus("all");
    setSelectedId(undefined);
  }

  return <div className="public-container">
    <section className="public-intro"><div><p className="public-eyebrow"><span className="public-tiny-diamond" /> {t.map.eyebrow}</p><h1>{t.map.heroTitle}<br className="public-mobile-break" /> <em>{t.map.heroTitleEmphasis}</em></h1><p className="public-lead">{t.map.lead}</p></div><div className="public-location"><MapPin size={19} aria-hidden="true" /><div><strong>{t.map.locationCity}</strong><span>{t.map.locationCountry}</span></div></div></section>

    <div className="public-map-toolbar">
      <label className="public-search"><Search size={18} aria-hidden="true" /><span className="public-sr-only">{t.map.searchLabel}</span><input type="search" placeholder={t.map.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      <label className="public-date-field"><CalendarDays size={17} aria-hidden="true" /><span className="public-sr-only">{t.map.pickDate}</span><input aria-label={t.map.pickDate} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <div className="public-filter-group" aria-label={t.map.statusFilter}><SlidersHorizontal size={16} aria-hidden="true" />{STATUS_OPTIONS.map((value) => <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>{value === "all" ? t.map.filterAll : SEGMENT_META[value].label}</button>)}</div>
    </div>

    <div className="public-workspace">
      <div className="public-map-column">
        <div className="public-section-bar"><h2><span className="public-gold">01</span> {t.map.mapTitle}</h2><span className="public-demo-label">{t.map.demoMode}</span></div>
        {!ready ? (
          <p role="status" className="public-empty">{t.map.preparing}</p>
        ) : filtered.length === 0 ? (
          <div className="public-empty">
            <CalendarDays size={32} aria-hidden="true" />
            <span className="public-empty-badge">{t.map.noClosureOnDate}</span>
            <p>{t.map.noClosureOnDateText}</p>
            <button type="button" className="public-action" onClick={resetFilters}>{t.map.resetFilter}</button>
          </div>
        ) : (
          <PublicRoadMap events={filtered} selectedId={selected?.id} onSelect={setSelectedId} locale={locale} />
        )}
        <div className="public-map-note"><Info size={17} aria-hidden="true" /><p>{t.map.scheduleNote} <strong>{date ? formatDate(date, locale) : t.map.allDates}</strong>. {t.map.followInfo}</p></div>
      </div>

      <aside className="public-side" aria-label={t.map.detailTitle}>
        <div className="public-section-bar"><h2><span className="public-gold">02</span> {t.map.detailTitle}</h2><Flower2 size={17} className="public-gold" aria-hidden="true" /></div>
        <div className="public-detail-card" aria-live="polite"><div className="public-poleng-trim" />
          {!ready ? <div className="public-empty" role="status">{t.map.preparing}</div> : selected ? <div className="public-detail-body">
            <div className="public-between">
              <span className="public-interactive-chips">{selectedStatuses.map((item) => <span key={item} className="admin-road-badge" style={{ backgroundColor: SEGMENT_META[item].color }}>{SEGMENT_META[item].label}</span>)}</span>
              <span className="public-small-label">{t.map.scheduleLabel}</span>
            </div>
            <h3>{selected.title}</h3>
            <p className="public-icon-line"><MapPin size={16} aria-hidden="true" />{selected.banjarName}</p>
            <div className="public-detail-time"><Clock3 size={20} aria-hidden="true" /><div><strong>{selected.startTime} – {selected.endTime} <small>WITA</small></strong><span>{dateRangeLabel(selected, locale)}</span></div></div>
            <div className="public-road-detail"><span className="public-small-label">{t.map.affectedRoad}</span><strong>{selected.roadSegments.length} {t.dashboard.segUnit}</strong></div>
            <ul className="public-interactive-segments">
              {selected.roadSegments.map((segment, index) => (
                <li key={segment.id}>
                  <i aria-hidden="true" style={{ borderTop: `4px ${SEGMENT_META[segment.status].dashArray ? "dashed" : "solid"} ${SEGMENT_META[segment.status].color}` }} />
                  {SEGMENT_META[segment.status].label} · {t.dashboard.segUnit} {index + 1}
                </li>
              ))}
            </ul>
            <div className="public-meaning"><h4><Flower2 size={18} aria-hidden="true" /> {t.map.meaningTitle}</h4><p>{selected.description || t.map.meaningMissing}</p></div>
            <p className="public-etiquette">{t.map.etiquette}</p>
            <Link href={`${localePath("/kalender", locale)}?date=${selected.startDate}`} className="public-action public-action-gold">{t.map.calendarLink} <ArrowRight size={17} aria-hidden="true" /></Link>
          </div> : <div className="public-empty"><Flower2 size={32} aria-hidden="true" /><span className="public-empty-badge">{t.map.noClosureOnDate}</span><p>{t.map.noMatch}</p><button type="button" className="public-action" onClick={resetFilters}>{t.map.reset}</button></div>}
        </div>
        <div className="public-small-note"><span className="public-tiny-diamond" /><p>{t.map.journeyNote}</p></div>
      </aside>
    </div>

    <section className="public-agenda-section" aria-labelledby="agenda-title"><div className="public-section-bar"><div><p className="public-eyebrow">{t.map.agendaEyebrow}</p><h2 id="agenda-title" className="public-serif-title">{formatDate(date, locale)} <span className="public-count">{filtered.length}</span></h2></div><Link href={localePath("/kalender", locale)} className="public-text-link">{t.map.fullCalendar} <ArrowRight size={16} aria-hidden="true" /></Link></div>{!ready ? <p role="status" className="public-empty">{t.map.loadingAgenda}</p> : !filtered.length ? <div className="public-no-results"><Search size={22} aria-hidden="true" /><p>{t.map.noResults}</p><button type="button" onClick={resetFilters} className="public-action"><X size={16} aria-hidden="true" /> {t.map.resetFilter}</button></div> : <div className="public-agenda-grid">{filtered.map((event) => <button type="button" key={event.id} className="public-agenda-card" aria-pressed={selected?.id === event.id} onClick={() => setSelectedId(event.id)}><span className="public-between"><span className="public-interactive-chips">{[...new Set(event.roadSegments.map((segment) => segment.status))].map((item) => <span key={item} className="admin-road-badge" style={{ backgroundColor: SEGMENT_META[item].color }}>{SEGMENT_META[item].label}</span>)}</span><ArrowRight size={17} aria-hidden="true" /></span><strong className="public-agenda-name">{event.title}</strong><span className="public-icon-line"><MapPin size={14} aria-hidden="true" />{event.banjarName}</span><span className="public-agenda-bottom"><span>{dateRangeLabel(event, locale)}</span><span>{event.startTime} – {event.endTime} WITA</span></span></button>)}</div>}</section>

    <section className="public-harmony"><Flower2 size={30} strokeWidth={1} aria-hidden="true" /><div><h2>{t.map.harmonyTitle}</h2><p>{t.map.harmonyText}</p></div><span className="public-small-label">{t.map.harmonyLabel}</span></section>
  </div>;
}
