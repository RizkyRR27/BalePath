export function formatDate(date: string, locale: "id" | "en" = "id") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { dateStyle: "long", timeZone: "Asia/Makassar" }).format(new Date(`${date}T12:00:00+08:00`));
}

// Kunci tanggal hari ini (zona waktu perangkat) — format YYYY-MM-DD.
// Dipakai sebagai tanggal awal agar user & admin selalu membuka pada hari ini;
// pilihan manual / deep-link ?date= tetap dihormati.
export function todayKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
