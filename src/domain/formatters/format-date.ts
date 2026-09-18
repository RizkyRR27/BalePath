export function formatDate(date: string, locale: "id" | "en" = "id") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { dateStyle: "long", timeZone: "Asia/Makassar" }).format(new Date(`${date}T12:00:00+08:00`));
}
