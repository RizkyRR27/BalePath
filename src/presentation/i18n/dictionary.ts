import en from "@/data/i18n/en";
import id from "@/data/i18n/id";
import type { Locale } from "./locale";

export type Dictionary = typeof id;

const dictionaries = { id, en } satisfies Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
