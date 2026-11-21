/**
 * ★ O-PL (02.10.2026): DIE NAMEN DER STARTPUNKTE POLNISCH.
 *
 * Bauart wie `startpunkteIt.ts`: `startPoints(sprache, lernweg)` in `letters.ts`
 * rechnet die sieben Landmarken und beschriftet sie - für „pl" bis hierher
 * englisch (`mitRueckfallEn`). `letters.ts` bleibt in Etappe O unberührt;
 * darum stehen die polnischen Namen HIER: dieselben Einheiten (`units`, `key`)
 * wie `startPoints`, nur die Beschriftung polnisch.
 *
 * Namen nach dem Glossar (`recherche-polnisch-2026-10-02/GLOSSAR-pl.md` §2.11
 * „Startpunkte"): *pozycja podstawowa*, *rząd podstawowy*, *wielkie litery*,
 * *interpunkcja*, *cyfry*, *symbole*. „Anfänger" ist ein Personen-Nomen
 * (początkujący/początkująca) - darum „Od początku" (Glossar Regel 2).
 * ⚠️ „+ polskie litery" gibt es NICHT, solange der Lernweg sie nicht als
 * eigene Landmarke kennt (`startPoints` hat dieselben sieben wie it).
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k …)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`). */
function namePl(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Od początku: tylko F i J";
    case "start":
      return `Pozycja podstawowa (cały rząd podstawowy ${reihe})`;
    case "gross":
      return "Pierwsze litery + wielkie litery";
    case "buchstaben":
      return "Wszystkie litery (z wielkimi)";
    case "satz":
      return "+ interpunkcja";
    case "zahlen":
      return "+ cyfry";
    case "alles":
      return "Wszystko (także symbole)";
    default:
      return null;
  }
}

/** Die Startpunkte mit polnischen Namen - dieselben Einheiten wie {@link startPoints}. */
export function startPointsPl(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: namePl(p.key, reihe) ?? p.label }));
}
