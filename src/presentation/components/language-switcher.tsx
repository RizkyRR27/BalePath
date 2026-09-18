"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isLocale, localePath, type Locale } from "@/presentation/i18n/locale";
import { useTranslation } from "@/presentation/i18n/translation-provider";

const LOCALE_LABELS: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English" };

export function LanguageSwitcher({ className = "public-lang" }: { className?: string }) {
  const pathname = usePathname();
  const { locale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const segment = pathname.split("/")[1];
  const path = isLocale(segment) ? `/${pathname.split("/").slice(2).join("/")}` || "/" : pathname;

  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`${className}-wrap`} ref={rootRef}>
      <button type="button" className={className} aria-haspopup="menu" aria-expanded={open} aria-label={t.nav.switchAria} onClick={() => setOpen(!open)}>
        {locale === "id" ? "ID" : "EN"}
      </button>
      {open && (
        <div className={`${className}-menu`} role="menu">
          {(["id", "en"] as Locale[]).map((item) => (
            <Link key={item} role="menuitem" href={localePath(path, item)} aria-current={item === locale ? "true" : undefined} onClick={() => setOpen(false)}>
              {LOCALE_LABELS[item]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
