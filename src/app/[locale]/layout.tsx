import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { AuthProvider } from "@/presentation/providers/auth-provider";
import { BanjarEventsProvider } from "@/presentation/providers/banjar-events-provider";
import { EventsProvider } from "@/presentation/providers/events-provider";
import { TranslationProvider } from "@/presentation/i18n/translation-provider";
import { getDictionary } from "@/presentation/i18n/dictionary";
import { LOCALES, isLocale, type Locale } from "@/presentation/i18n/locale";
import icon from "@/presentation/assets/icon.png";

export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const t = getDictionary(value);
  return { title: t.meta.title, description: t.meta.description, icons: { icon: icon.src } };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  return <html lang={locale} suppressHydrationWarning><body suppressHydrationWarning><TranslationProvider locale={locale} t={getDictionary(locale)}><AuthProvider><EventsProvider><BanjarEventsProvider>{children}</BanjarEventsProvider></EventsProvider></AuthProvider></TranslationProvider></body></html>;
}
