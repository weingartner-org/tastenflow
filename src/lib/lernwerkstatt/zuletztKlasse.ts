/**
 * „Meine Klassen" öffnet die Klasse, die die Lehrkraft zuletzt offen hatte
 * (Johannes, 21.09.2026: *„wenn ich als Lehrer die Seite »Meine Klassen« öffne,
 * soll ich immer auf der stehen, die ich als letzte offen hatte, nicht die
 * oberste in der Liste"*).
 *
 * Gemerkt wird je Lehrkraft (Konto-Kennung) im Browser dieses Geräts - eine
 * Bequemlichkeit, keine Einstellung: Fehlt der Eintrag, ist er kaputt oder
 * verweist er auf eine Klasse, die es nicht mehr gibt, gilt wie bisher die
 * erste Klasse der Liste. Nichts davon geht an den Server.
 */

const SCHLUESSEL = "lw.meineKlassen.zuletzt.";

/** Die zuletzt geöffnete Klasse dieser Lehrkraft, oder `null`. */
export function liesZuletztKlasse(accountId: string | null | undefined): string | null {
  if (!accountId) return null;
  try {
    const code = window.localStorage.getItem(SCHLUESSEL + accountId);
    return code && code.trim() ? code : null;
  } catch {
    return null; // gesperrter Speicher, privates Fenster
  }
}

/** Merkt sich die Klasse, die gerade offen ist. Scheitert still. */
export function merkeZuletztKlasse(accountId: string | null | undefined, code: string): void {
  if (!accountId || !code) return;
  try {
    window.localStorage.setItem(SCHLUESSEL + accountId, code);
  } catch {
    /* gesperrter Speicher - dann bleibt es bei der ersten Klasse */
  }
}

/**
 * Welche Klasse offen ist: ausdrücklich gewählt (Adresse oder Klick) vor
 * zuletzt geöffnet vor der ersten der Liste. Ein Code, den es in der Liste
 * nicht gibt, wird übersprungen.
 */
export function waehleKlasse<T extends { code: string }>(
  klassen: readonly T[],
  gewaehlt: string | null,
  zuletzt: string | null,
): T | null {
  return (
    klassen.find((c) => gewaehlt !== null && c.code === gewaehlt) ??
    klassen.find((c) => zuletzt !== null && c.code === zuletzt) ??
    klassen[0] ??
    null
  );
}
