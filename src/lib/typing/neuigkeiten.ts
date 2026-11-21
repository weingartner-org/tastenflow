/**
 * ★★★ „WAS GIBT'S NEUES" - EINMAL JE BESTEHENDER LEHRKRAFT (Z3, 19.09.2026).
 * ============================================================================
 *
 * Johannes, 19.09.2026, wörtlich: *„bestehende Lehrer bekommen beim nächsten
 * Mal Anmelden ein Popup mit ‚Was gibt's Neues:', in dem du die neue
 * Benutzeroberfläche erklärst, die neuen Wochenaufgaben, die eigene Übungen
 * (auch in der Tippchallenge), der Übungspool"*.
 *
 * Diese Datei ist die REGEL, ohne Oberfläche - das Fenster selbst steht in
 * `components/typing/NeuigkeitenFenster.tsx`.
 *
 * ── WER ES SIEHT ──────────────────────────────────────────────────────────
 *  · nur ein LEHRKRAFT-Konto - nie ein Kind, nie ein selbstlernendes Konto;
 *  · nur ein Konto, das es VOR dem Stichtag schon gab (`createdAt`). Wer sich
 *    nach dem Stichtag anmeldet, kennt nichts Altes, dem etwas „neu" wäre -
 *    für diese Menschen ist die Einführung beim ersten Betreten da (Z4);
 *  · ein Konto ohne bekanntes Anlegedatum (0 - `createdAtMs` fehlte bei
 *    einigen alten Wegen) gilt als bestehend: Lieber einmal zu viel erklärt
 *    als einer Lehrkraft die neue Seite unerklärt vorgesetzt.
 *
 * ── WIE OFT ───────────────────────────────────────────────────────────────
 * EINMAL JE KONTO, nicht je Gerät: gemerkt am Server (`tt_teachers.
 * neuigkeitenGesehen`, die gesehene Fassung). Dieselbe Lehre wie beim
 * Spendenbanner und bei der Eigenen Übung (Z1/Z2, 19.09.): Ein Merker nur im
 * Browser gilt je GERÄT - am Schul- und am Heimrechner käme das Fenster zweimal.
 *
 * Zusätzlich merkt sich das GERÄT die Fassung (`localStorage`), und zwar
 * schon beim Schliessen, vor dem Schreiben zum Server. Scheitert das Schreiben
 * (offline, Server kurz weg, Feld am Server noch nicht angelegt), kommt das
 * Fenster auf diesem Gerät trotzdem nicht wieder - und beim nächsten Öffnen
 * wird das Schreiben still nachgeholt (`"nachtragen"`).
 *
 * ── EINE NEUE FASSUNG ──────────────────────────────────────────────────────
 * Wer später wieder etwas Neues ankündigen will, ändert {@link
 * NEUIGKEITEN_FASSUNG} (und den Stichtag) - dann sieht jede bestehende
 * Lehrkraft das Fenster genau einmal wieder, ohne Datenumbau.
 */

/** Die Fassung der Neuigkeiten - wird bei „Verstanden" am Konto gespeichert. */
export const NEUIGKEITEN_FASSUNG = "2026-09-19";

/**
 * Ab wann ein Konto als NEU gilt: 19.09.2026, 00:00 Uhr Wiener Zeit. Die neue
 * Seite ging in der Nacht davor live; wer sich seither angemeldet hat, hat nie
 * eine andere gesehen.
 */
export const NEUIGKEITEN_STICHTAG_MS = Date.parse("2026-09-19T00:00:00+02:00");

/**
 * ★ Gilt dieses Konto als NEU (angelegt am oder nach dem Stichtag)?
 *
 * Die EINE Stelle für diese Frage - „Was gibt's Neues" (hier) und der
 * Rundgang für neue Lehrkräfte (Z4, `lib/typing/rundgang.ts`) fragen beide
 * hier, damit „neu" und „bestehend" nie auseinanderlaufen: Wer das Fenster
 * nicht bekommt, bekommt den Rundgang, und umgekehrt.
 * Ein unbekanntes Anlegedatum (0) gilt als BESTEHEND (siehe Dateikopf).
 */
export function kontoNachStichtag(
  erstelltMs: number | null | undefined,
  stichtagMs: number = NEUIGKEITEN_STICHTAG_MS,
): boolean {
  return !!erstelltMs && erstelltMs > 0 && erstelltMs >= stichtagMs;
}

/** Was beim Öffnen zu tun ist. */
export type NeuigkeitenEntscheid =
  /** Das Fenster zeigen. */
  | "zeigen"
  /** Nicht zeigen - aber das Gerät hat „gesehen" gemerkt, der Server noch nicht: nachschreiben. */
  | "nachtragen"
  /** Nichts tun. */
  | "nichts";

/**
 * ★ Die ganze Regel an EINER Stelle.
 *
 * @param rolle         Rolle des angemeldeten Kontos.
 * @param erstelltMs    Anlegedatum des Kontos (0 = unbekannt ⇒ bestehend).
 * @param serverGesehen die am Konto gespeicherte Fassung - `""` = noch keine,
 *                      `null` = das Lesen ist gescheitert (dann wird nichts
 *                      gezeigt: Ob die Lehrkraft es auf einem anderen Gerät
 *                      schon quittiert hat, ist dann nicht zu wissen, und beim
 *                      nächsten Öffnen wird ohnehin wieder gefragt).
 * @param lokalGesehen  die auf DIESEM Gerät gemerkte Fassung (oder `null`).
 */
export function neuigkeitenEntscheiden({
  rolle,
  erstelltMs,
  serverGesehen,
  lokalGesehen,
  fassung = NEUIGKEITEN_FASSUNG,
  stichtagMs = NEUIGKEITEN_STICHTAG_MS,
}: {
  rolle: string | null | undefined;
  erstelltMs: number | null | undefined;
  serverGesehen: string | null;
  lokalGesehen: string | null;
  fassung?: string;
  stichtagMs?: number;
}): NeuigkeitenEntscheid {
  if (rolle !== "lehrkraft") return "nichts";
  if (kontoNachStichtag(erstelltMs, stichtagMs)) return "nichts";
  if (serverGesehen === fassung) return "nichts";
  if (lokalGesehen === fassung) return "nachtragen";
  if (serverGesehen === null) return "nichts";
  return "zeigen";
}

/** Schlüssel im `localStorage` - je KONTO, damit ein geteilter Rechner nichts verwechselt. */
export function neuigkeitenLokalSchluessel(kontoId: string): string {
  return `tastenflow-neuigkeiten-gesehen:${kontoId}`;
}

/** Die auf diesem Gerät gemerkte Fassung - `null`, wenn keine (oder kein Speicher). */
export function neuigkeitenLokalLesen(kontoId: string): string | null {
  try {
    return localStorage.getItem(neuigkeitenLokalSchluessel(kontoId));
  } catch {
    return null;
  }
}

/** Die Fassung auf diesem Gerät merken (still, falls der Speicher gesperrt ist). */
export function neuigkeitenLokalMerken(kontoId: string, fassung: string = NEUIGKEITEN_FASSUNG): void {
  try {
    localStorage.setItem(neuigkeitenLokalSchluessel(kontoId), fassung);
  } catch {
    // Privater Modus o. Ä. - dann bleibt nur der Server.
  }
}
