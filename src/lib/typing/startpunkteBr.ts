/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN PORTUGIESISCH (BRASILIEN) (Einhängepunkt; Namen seit F4-PT-BR-SV, 25.10.2026).
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-br-reihenfolge.test.ts` §8 (Vorbild cs: Zählung je Landmarke).
 *
 * ★ F4-PT-BR-SV (25.10.2026): die Namen nach `GLOSSAR-pt-BR.md` (Zeile „Startpunkte": Começo: só F e J · Posição inicial (toda a
 * fileira central) · Primeiras letras + maiúsculas · Todas as letras (com maiúsculas) · + pontuação · + números · Tudo (também os
 * símbolos)). Die Einheiten kommen aus der eigenen Reihenfolge des Weges (F4).
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameBr(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Começo: só F e J";
    case "start":
      return `Posição inicial (toda a fileira central: ${reihe})`;
    case "gross":
      return "Primeiras letras + maiúsculas";
    case "buchstaben":
      return "Todas as letras (com maiúsculas)";
    case "satz":
      return "+ pontuação";
    case "zahlen":
      return "+ números";
    case "alles":
      return "Tudo (também os símbolos)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Portugiesisch (Brasilien) - dieselben Einheiten wie {@link startPoints}. */
export function startPointsBr(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameBr(p.key, reihe) ?? p.label }));
}
