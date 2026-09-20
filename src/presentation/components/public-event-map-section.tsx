"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Flower2, MapPin } from "lucide-react";
import { useBanjarEvents } from "@/presentation/providers/banjar-events-provider";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { SEGMENT_META } from "@/domain/entities/road-segment";
import { formatDate } from "@/domain/formatters/format-date";
import { useTranslation } from "@/presentation/i18n/translation-provider";
import { PublicRoadMap } from "@/presentation/components/public-road-map";

/** Tanggal hari ini (waktu lokal perangkat) dalam format YYYY-MM-DD. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Event mencakup tanggal pilihan bila selectedDate berada dalam [startDate, endDate]. */
export function coversDate(event: BanjarEvent, selectedDate: string): boolean {
  return event.startDate <= selectedDate && selectedDate <= event.endDate;
}

export function PublicEventMapSection() {
  const { events, ready } = useBanjarEvents();
  const { locale, t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(() => todayIso());
  const [selectedId, setSelectedId] = useState<string>();

  // Peta TIDAK memunculkan semua penutupan sekaligus — hanya event yang
  // rentang jadwalnya mencakup tanggal yang dipilih user.
  const filtered = useMemo(
    () => events.filter((event) => coversDate(event, selectedDate)),
    [events, selectedDate],
  );

  // Seleksi derivatif: bila id tersimpan tak lagi ada di hasil filter tanggal,
  // otomatis jatuh ke event pertama — tanpa effect/setState berantai.
  const selected = filtered.find((event) => event.id === selectedId) ?? filtered[0];
  const selectedStatuses = selected
    ? [...new Set(selected.roadSegments.map((segment) => segment.status))]
    : [];

  return (
    <section className="public-interactive" aria-labelledby="interactive-title">
      <div className="public-section-bar">
        <div>
          <p className="public-eyebrow">{t.map.interactiveEyebrow}</p>
          <h2 id="interactive-title" className="public-serif-title">
            {t.map.interactiveTitle} <span className="public-count">{ready ? filtered.length : 0}</span>
          </h2>
        </div>
      </div>
      <p className="public-interactive-lead">{t.map.interactiveLead}</p>

      <div className="public-date-filter">
        <label>
          <CalendarDays size={17} aria-hidden="true" />
          <span className="public-sr-only">{t.map.pickDate}</span>
          <input
            aria-label={t.map.pickDate}
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </label>
        <button type="button" className="public-action public-demo-reset" onClick={() => setSelectedDate(todayIso())}>
          {t.map.todayLabel}
        </button>
        <span className="public-filter-hint" aria-live="polite">
          {t.map.scheduleNote} {formatDate(selectedDate, locale)}
        </span>
      </div>

      {!ready ? (
        <p role="status" className="public-empty">
          {t.map.preparing}
        </p>
      ) : filtered.length === 0 ? (
        <div className="public-empty">
          <CalendarDays size={32} aria-hidden="true" />
          <span className="public-empty-badge">{t.map.noClosureOnDate}</span>
          <p>{t.map.noClosureOnDateText}</p>
          <button type="button" className="public-action" onClick={() => setSelectedDate(todayIso())}>
            {t.map.todayLabel}
          </button>
        </div>
      ) : (
        <>
          <PublicRoadMap
            events={filtered}
            selectedId={selected?.id}
            onSelect={setSelectedId}
            locale={locale}
          />
          <p className="public-interactive-hint">
            <MapPin size={14} aria-hidden="true" /> {t.map.tapHint}
          </p>

          <div className="public-interactive-list" role="group" aria-label={t.map.interactiveTitle}>
            {filtered.map((event) => (
              <button
                key={event.id}
                type="button"
                className="public-action"
                aria-pressed={event.id === selected?.id}
                onClick={() => setSelectedId(event.id)}
              >
                {event.title}
              </button>
            ))}
          </div>

          {selected && (
            <div className="public-detail-card" aria-live="polite">
              <div className="public-poleng-trim" />
              <div className="public-interactive-detail">
                <div className="public-between">
                  <span className="public-interactive-chips">
                    {selectedStatuses.map((status) => (
                      <span
                        key={status}
                        className="admin-road-badge"
                        style={{ backgroundColor: SEGMENT_META[status].color }}
                      >
                        {SEGMENT_META[status].label}
                      </span>
                    ))}
                  </span>
                  <span className="public-small-label">{t.map.scheduleLabel}</span>
                </div>
                <h3>{selected.title}</h3>
                <p className="public-icon-line">
                  <MapPin size={16} aria-hidden="true" />
                  {selected.banjarName}
                </p>
                <p className="public-icon-line">
                  <Clock3 size={16} aria-hidden="true" />
                  {selected.startDate === selected.endDate
                    ? formatDate(selected.startDate, locale)
                    : `${formatDate(selected.startDate, locale)} – ${formatDate(selected.endDate, locale)}`}
                  {" · "}
                  {selected.startTime} – {selected.endTime} WITA
                </p>
                <p className="public-small-label">{t.map.detailSegments}</p>
                <ul className="public-interactive-segments">
                  {selected.roadSegments.map((segment, index) => (
                    <li key={segment.id}>
                      <i
                        aria-hidden="true"
                        style={{
                          borderTop: `4px ${SEGMENT_META[segment.status].dashArray ? "dashed" : "solid"} ${SEGMENT_META[segment.status].color}`,
                        }}
                      />
                      {SEGMENT_META[segment.status].label} · {t.dashboard.segUnit} {index + 1}
                    </li>
                  ))}
                </ul>
                <div className="public-meaning">
                  <h4>
                    <Flower2 size={18} aria-hidden="true" /> {t.map.eduTitle}
                  </h4>
                  <p>{selected.description || t.map.meaningMissing}</p>
                </div>
                <p className="public-etiquette">{t.map.etiquette}</p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default PublicEventMapSection;
