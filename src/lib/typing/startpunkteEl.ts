/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN GRIECHISCH - gefüllt.
 * ★ O-INHALT-EL (29.10.2026): Namen nach dem Glossar `recherche-griechisch-2026-10-25/GLOSSAR-el.md` §2.13 („Από την αρχή: μόνο Φ και
 * Ξ", „Βασική θέση", „Πρώτα γράμματα και κεφαλαία" …). Kein Personenwort („Αρχάριος", Regel 2), kein „+" (die Stimme liest „συν") -
 * darum „και σημεία στίξης". Die zwei ersten Tasten aus der Grundreihe DES WEGES (griechisch Φ und Ξ), nie fest „F και J".
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-el-reihenfolge.test.ts` §8 (Vorbild cs: Zählung je Landmarke).
 *
 * Ein unbekannter Schlüssel gibt `null` ⇒ der ENGLISCHE Name (wie im Gerüst), nie Deutsch.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die zwei ersten Tasten der Grundreihe, gross wie auf der Kappe (griechisch „Φ και Ξ", auf Weg „de" „F και J"). */
function ersteZwei(reihe: string): string {
  const [a, b] = reihe.split(" ").filter(Boolean);
  // Gross mit `toUpperCase` (ohne Sprache): `toLocaleUpperCase("el")` nähme einen Tonos weg (Glossar Regel 7).
  return a && b ? `${a.toUpperCase()} και ${b.toUpperCase()}` : "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameEl(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger": {
      const zwei = ersteZwei(reihe);
      return zwei ? `Από την αρχή: μόνο ${zwei}` : "Από την αρχή";
    }
    case "start":
      return `Βασική θέση (όλη η βασική σειρά: ${reihe})`;
    case "gross":
      return "Πρώτα γράμματα και κεφαλαία";
    case "buchstaben":
      return "Όλα τα γράμματα (με κεφαλαία)";
    case "satz":
      return "και σημεία στίξης";
    case "zahlen":
      return "και αριθμοί";
    case "alles":
      return "Όλα (και τα σύμβολα)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Griechisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsEl(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameEl(p.key, reihe) ?? p.label }));
}
