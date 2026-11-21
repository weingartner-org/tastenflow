/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN NIEDERLÄNDISCH (Einhängepunkt, seit F4 gefüllt).
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-nl-reihenfolge.test.ts` §6 (Zählung je Landmarke und die Namen).
 *
 * ★★★ F4-NL (25.10.2026): die sieben Namen stehen. Namen nach dem Glossar (`glossar/GLOSSAR-nl.md` Zeile „Startpunkte", §2.1: *basishouding*, *basisrij*, *hoofdletters*, *leestekens*, *cijfers*, *speciale tekens*); „Beginner" ist geschlechtsneutral und dort so festgelegt.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameNl(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Beginner: alleen F en J";
    case "start":
      return `Basishouding (de hele basisrij: ${reihe})`;
    case "gross":
      return "Eerste letters + hoofdletters";
    case "buchstaben":
      return "Alle letters (met hoofdletters)";
    case "satz":
      return "+ leestekens";
    case "zahlen":
      return "+ cijfers";
    case "alles":
      return "Alles (ook speciale tekens)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Niederländisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsNl(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameNl(p.key, reihe) ?? p.label }));
}
