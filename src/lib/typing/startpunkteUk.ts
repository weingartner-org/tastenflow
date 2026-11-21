/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN UKRAINISCH - gefüllt.
 * ★ O-INHALT-UK (29.10.2026): Namen nach dem Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md` §2.13 („Перші кроки: лише А і О",
 * „Основне положення", „Перші літери і великі літери" …). Kein Personenwort („Початківець", Regel 2), kein Russismus („Самий початок").
 * Die zwei ersten Tasten aus der Grundreihe DES WEGES (ukrainisch А und О - die Noppen-Tasten), nie fest „F і J".
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-uk-reihenfolge.test.ts` §8 (Vorbild cs: Zählung je Landmarke).
 *
 * Ein unbekannter Schlüssel gibt `null` ⇒ der ENGLISCHE Name (wie im Gerüst), nie Deutsch.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die zwei ersten Tasten der Grundreihe, gross (ukrainisch „А і О", auf Weg „de" „F і J"). */
function ersteZwei(reihe: string): string {
  const [a, b] = reihe.split(" ").filter(Boolean);
  return a && b ? `${a.toLocaleUpperCase("uk-UA")} і ${b.toLocaleUpperCase("uk-UA")}` : "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameUk(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger": {
      const zwei = ersteZwei(reihe);
      return zwei ? `Перші кроки: лише ${zwei}` : "Перші кроки";
    }
    case "start":
      return `Основне положення (увесь основний ряд: ${reihe})`;
    case "gross":
      return "Перші літери і великі літери";
    case "buchstaben":
      return "Усі літери (з великими)";
    case "satz":
      return "+ розділові знаки";
    case "zahlen":
      return "+ цифри";
    case "alles":
      return "Усе (також символи)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Ukrainisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsUk(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameUk(p.key, reihe) ?? p.label }));
}
