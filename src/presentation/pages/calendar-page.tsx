"use client";

// Foto referensi desain: src/presentation/assets/screens/kalender-yadnya.png
// (+ mockup HTML: src/presentation/screens/kalender/kalender-yadnya.html) → rute "/kalender" halaman ini.

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Flower2, Info, MapPin, Search } from "lucide-react";
import { useBanjarEvents } from "@/presentation/providers/banjar-events-provider";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { SEGMENT_META, type RoadSegmentStatus } from "@/domain/entities/road-segment";
import { formatDate, todayKey } from "@/domain/formatters/format-date";
import { coversDate } from "@/presentation/components/public-event-map-section";
import { localePath } from "@/presentation/i18n/locale";
import { useTranslation } from "@/presentation/i18n/translation-provider";

type StatusFilter = "all" | RoadSegmentStatus;

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function validDate(value: string | null) {
  // Tanpa ?date= (atau tanggal tak valid): selalu buka pada hari ini.
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return todayKey();
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && dateKey(date) === value ? value : todayKey();
}

function dateRangeLabel(event: BanjarEvent, locale: "id" | "en"): string {
  return event.startDate === event.endDate
    ? formatDate(event.startDate, locale)
    : `${formatDate(event.startDate, locale)} – ${formatDate(event.endDate, locale)}`;
}

function CalendarContent() {
  // Kalender membaca shared store yang sama dengan form admin & peta publik.
  const { events, ready } = useBanjarEvents();
  const { locale, t } = useTranslation();
  const params = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => validDate(params.get("date")));
  const [month, setMonth] = useState(() => new Date(`${validDate(params.get("date")).slice(0, 7)}-01T12:00:00Z`));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  // Penanda sel "hari ini" di grid bulan (garis bawah emas).
  const today = todayKey();
  const filters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: t.map.filterAll },
    { value: "TUTUP_TOTAL", label: SEGMENT_META.TUTUP_TOTAL.label },
    { value: "BUKA_TUTUP", label: SEGMENT_META.BUKA_TUTUP.label },
    { value: "HANYA_MOTOR", label: SEGMENT_META.HANYA_MOTOR.label },
    { value: "JALUR_ALTERNATIF", label: SEGMENT_META.JALUR_ALTERNATIF.label },
  ];

  const filtered = useMemo(
    () =>
      events
        .filter((event) => status === "all" || event.roadSegments.some((segment) => segment.status === status))
        .filter((event) =>
          `${event.title} ${event.banjarName} ${event.description ?? ""}`
            .toLocaleLowerCase(locale)
            .includes(query.trim().toLocaleLowerCase(locale)),
        ),
    [events, status, query, locale],
  );

  const monthKey = dateKey(month).slice(0, 7);
  // Event multi-hari ikut terhitung bila rentangnya menyentuh bulan/tanggal aktif.
  const monthEvents = filtered.filter(
    (event) => event.startDate.slice(0, 7) <= monthKey && monthKey <= event.endDate.slice(0, 7),
  );
  const dayEvents = filtered
    .filter((event) => coversDate(event, selectedDate))
    .sort((a, b) => `${a.startDate}${a.startTime}`.localeCompare(`${b.startDate}${b.startTime}`));
  const firstDay = month.getUTCDay();
  const daysInMonth = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const monthLabel = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(month);
  function changeMonth(amount: number) {
    const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + amount, 1, 12));
    setMonth(next);
    setSelectedDate(dateKey(next));
  }
  function resetDate() {
    // Kembali ke bulan & tanggal hari ini.
    const now = todayKey();
    setMonth(new Date(`${now.slice(0, 7)}-01T12:00:00Z`));
    setSelectedDate(now);
  }

  return (
    <div className="public-container">
      <section className="public-intro public-calendar-intro"><div><p className="public-eyebrow"><span className="public-tiny-diamond" /> {t.calendar.eyebrow}</p><h1>{t.calendar.title} <em>{t.calendar.titleEmphasis}</em></h1><p className="public-lead">{t.calendar.lead}</p></div><div className="public-location"><CalendarDays size={23} strokeWidth={1.5} aria-hidden="true" /><div><strong>{t.calendar.agendaLocation}</strong><span>{t.calendar.demoSchedule}</span></div></div></section>
      <div className="public-calendar-toolbar"><label className="public-search"><Search size={18} aria-hidden="true" /><span className="public-sr-only">{t.calendar.searchLabel}</span><input type="search" placeholder={t.calendar.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="public-filter-group" aria-label={t.calendar.filterLabel}>{filters.map(({ value, label }) => <button type="button" key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}</div></div>
      <div className="public-calendar-layout">
        <section className="public-calendar-panel" aria-labelledby="month-title">
          <div className="public-calendar-heading"><div><p className="public-eyebrow">{t.calendar.monthly}</p><h2 id="month-title" aria-live="polite">{monthLabel}</h2></div><div className="public-month-actions"><button type="button" className="public-action public-demo-reset" onClick={resetDate}>{t.common.demoDate}</button><button type="button" className="public-icon-button" onClick={() => changeMonth(-1)} aria-label={t.calendar.previousMonth}><ChevronLeft size={20} /></button><button type="button" className="public-icon-button" onClick={() => changeMonth(1)} aria-label={t.calendar.nextMonth}><ChevronRight size={20} /></button></div></div>
          <div className="public-calendar-legend"><span><i className="public-dot public-dot-full" /> {SEGMENT_META.TUTUP_TOTAL.label}</span><span><i className="public-dot public-dot-partial" /> {SEGMENT_META.BUKA_TUTUP.label}</span><span className="public-calendar-total">{monthEvents.length} {t.calendar.monthAgenda}</span></div>
          <div className="public-weekdays" aria-hidden="true">{t.calendar.weekdays.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="public-days" aria-label={`${t.calendar.chooseDate} ${monthLabel}`}>
            {Array.from({ length: cells }, (_, index) => {
              const day = index - firstDay + 1;
              if (day < 1 || day > daysInMonth) return <div key={`empty-${index}`} className="public-day-empty" aria-hidden="true" />;
              const key = `${monthKey}-${String(day).padStart(2, "0")}`;
              const scheduled = monthEvents.filter((event) => coversDate(event, key));
              const full = scheduled.some((event) => event.roadSegments.some((segment) => segment.status === "TUTUP_TOTAL"));
              const partial = scheduled.some((event) => event.roadSegments.some((segment) => segment.status !== "TUTUP_TOTAL"));
              return <button type="button" key={key} className={`public-day ${selectedDate === key ? "public-day-selected" : ""} ${key === today ? "public-day-demo" : ""}`} onClick={() => setSelectedDate(key)} aria-pressed={selectedDate === key} aria-label={`${formatDate(key, locale)}, ${scheduled.length} ${t.calendar.agendaUnit}${full ? `, ${SEGMENT_META.TUTUP_TOTAL.label}` : ""}${partial ? `, ${SEGMENT_META.BUKA_TUTUP.label}` : ""}${key === today ? `, ${t.calendar.demoShort}` : ""}`}><span className="public-day-number">{day}</span><span className="public-day-indicators" aria-hidden="true">{full && <i className="public-dot public-dot-full" />}{partial && <i className="public-dot public-dot-partial" />}</span>{scheduled.length > 0 && <span className="public-day-event" aria-hidden="true">{scheduled[0].title}{scheduled.length > 1 ? ` +${scheduled.length - 1}` : ""}</span>}</button>;
            })}
          </div>
          <div className="public-calendar-caption"><Info size={16} aria-hidden="true" /><p>{t.calendar.selectDate}</p></div>
          <div className="public-calendar-stats"><div><strong>{monthEvents.length.toString().padStart(2, "0")}</strong><span>{t.calendar.published}</span></div><div><strong>{new Set(monthEvents.map((event) => event.banjarName)).size.toString().padStart(2, "0")}</strong><span>{t.calendar.participating}</span></div><div><strong>{monthEvents.reduce((sum, event) => sum + event.roadSegments.length, 0).toString().padStart(2, "0")}</strong><span>{t.calendar.scheduledRoads}</span></div></div>
        </section>
        <section className="public-day-agenda" aria-labelledby="day-title" aria-live="polite">
          <div className="public-section-bar"><div><p className="public-eyebrow">{t.calendar.dateAgenda}</p><h2 id="day-title" className="public-serif-title">{formatDate(selectedDate, locale)}</h2></div><span className="public-count">{dayEvents.length}</span></div>
          {!ready ? <div className="public-empty" role="status">{t.calendar.preparing}</div> : dayEvents.length === 0 ? <div className="public-empty public-calendar-empty"><CalendarDays size={36} strokeWidth={1} aria-hidden="true" /><h3>{t.calendar.emptyTitle}</h3><p>{t.calendar.emptyText}</p>{(query || status !== "all") && <button type="button" className="public-action" onClick={() => { setQuery(""); setStatus("all"); }}>{t.calendar.clearFilter}</button>}</div> : dayEvents.map((event) => <article key={event.id} className="public-calendar-event"><div className="public-between"><span className="public-interactive-chips">{[...new Set(event.roadSegments.map((segment) => segment.status))].map((item) => <span key={item} className="admin-road-badge" style={{ backgroundColor: SEGMENT_META[item].color }}>{SEGMENT_META[item].label}</span>)}</span><Flower2 size={21} className="public-gold" strokeWidth={1.5} aria-hidden="true" /></div><h3>{event.title}</h3><p className="public-icon-line"><MapPin size={15} aria-hidden="true" />{event.banjarName}</p><div className="public-calendar-event-time"><Clock3 size={17} aria-hidden="true" /><strong>{event.startTime} – {event.endTime} WITA</strong></div><p className="public-event-road">{dateRangeLabel(event, locale)} · {event.roadSegments.length} {t.dashboard.segUnit}</p><details className="public-culture-details"><summary>{t.calendar.cultureDetails}</summary><p>{event.description || t.calendar.meaningMissing}</p><p>{t.calendar.etiquette}</p></details><Link href={localePath("/", locale)} className="public-text-link">{t.calendar.exploreMap} <ArrowRight size={15} aria-hidden="true" /></Link></article>)}
          <div className="public-calendar-reminder"><span className="public-poleng" aria-hidden="true" /><div><strong>{t.calendar.reminderTitle}</strong><p>{t.calendar.reminderText}</p></div></div>
        </section>
      </div>
      <section className="public-harmony"><Flower2 size={30} aria-hidden="true" /><div><h2>{t.calendar.harmonyTitle}</h2><p>{t.calendar.harmonyText}</p></div><span className="public-small-label">{t.map.harmonyLabel}</span></section>
    </div>
  );
}

export default function CalendarPage() {
  return <Suspense fallback={<div className="public-container public-empty" role="status">Preparing…</div>}><CalendarContent /></Suspense>;
}
