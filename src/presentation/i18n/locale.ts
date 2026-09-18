export type Locale = "id" | "en";

export const LOCALES: Locale[] = ["id", "en"];
export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/** /kalender + en -> /en/kalender. Root "/" -> /en (tanpa double slash). */
export function localePath(path: string, locale: Locale) {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}
