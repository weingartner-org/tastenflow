/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN BULGARISCH.
 * ★ O-INHALT-BG (29.10.2026): gefüllt - Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md` §2.1/§2.2 („изходна позиция",
 * „основен ред", „главни букви", „препинателни знаци", „цифри", „символи"). „Anfänger" wäre ein Personenwort („начинаещ",
 * Regel 2) - darum „Съвсем отначало". Die zwei ersten Tasten kommen aus der Grundreihe DES WEGES (auf BDS „О и Т"), nie fest „F и J".
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-bg-reihenfolge.test.ts` §8 (Vorbild cs: Zählung je Landmarke).
 *
 * Ein unbekannter Schlüssel gibt `null` ⇒ der ENGLISCHE Name (wie im Gerüst, `mitRueckfallEn` in `letters.ts`), nie Deutsch.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die zwei ersten Tasten der Grundreihe, gross (auf BDS „О и Т", auf Weg „de" „F и J"). */
function ersteZwei(reihe: string): string {
  const [a, b] = reihe.split(" ").filter(Boolean);
  return a && b ? `${a.toLocaleUpperCase("bg-BG")} и ${b.toLocaleUpperCase("bg-BG")}` : "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameBg(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger": {
      const zwei = ersteZwei(reihe);
      return zwei ? `Съвсем отначало: само ${zwei}` : "Съвсем отначало";
    }
    case "start":
      return `Изходна позиция (целият основен ред: ${reihe})`;
    case "gross":
      return "Първи букви + главни букви";
    case "buchstaben":
      return "Всички букви (и главни)";
    case "satz":
      return "+ препинателни знаци";
    case "zahlen":
      return "+ цифри";
    case "alles":
      return "Всичко (и символите)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Bulgarisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsBg(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameBg(p.key, reihe) ?? p.label }));
}
