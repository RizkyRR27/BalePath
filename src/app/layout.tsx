import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { EventsProvider } from "@/context/events-context";

export const metadata: Metadata = {
  title: "BalePath — Ruang adat, langkah selaras",
  description: "Demo portal kegiatan banjar dan informasi penutupan jalan Bali.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><body suppressHydrationWarning><AuthProvider><EventsProvider>{children}</EventsProvider></AuthProvider></body></html>;
}
