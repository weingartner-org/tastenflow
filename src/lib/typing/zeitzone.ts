/**
 * ★ D2 (28.09.2026): Die Zeitzone des Geräts - für die Uhrzeiten in den Mails.
 *
 * Die Mails an Lehrkräfte und Selbstlernende (Wochenbericht, Tippchallenge)
 * nannten Uhrzeiten bis D2 in Wiener Zeit; in Mexiko-Stadt stand dort „8:00",
 * gemeint war 0:00 Ortszeit. Das Gerät kennt seine Zone
 * (`Intl.DateTimeFormat().resolvedOptions().timeZone`); `pbBackend` merkt sie
 * bei jeder Anmeldung am Konto (`zeitzone`), die Server-Seite rechnet mit ihr
 * (`pocketbase/pb_hooks/tt_zeitzone_lib.pb.js`).
 */

/**
 * Sieht `zone` aus wie ein IANA-Name („Europe/Vienna", „America/Argentina/
 * Buenos_Aires", „UTC")? Dieselbe Prüfung macht der Server
 * (`tt_pupils_field_guard.pb.js`) - alles andere wird nie geschrieben.
 */
export function istZeitzonenName(zone: unknown): zone is string {
  return (
    typeof zone === "string" &&
    zone.length > 0 &&
    zone.length <= 64 &&
    /^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){0,2}$/.test(zone)
  );
}

/** Die Zeitzone dieses Geräts - `""`, wenn der Browser keine nennt. */
export function geraeteZeitzone(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return istZeitzonenName(zone) ? zone : "";
  } catch {
    return "";
  }
}
