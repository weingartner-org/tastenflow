/**
 * ★ O-CS (03.10.2026): DIE NAMEN DER STARTPUNKTE TSCHECHISCH.
 *
 * Bauart wie `startpunktePl.ts`: `startPoints(sprache, lernweg)` in `letters.ts`
 * rechnet die sieben Landmarken und beschriftet sie - für „cs" bis hierher
 * englisch (`mitRueckfallEn`). `letters.ts` bleibt in Etappe O unberührt;
 * darum stehen die tschechischen Namen HIER: dieselben Einheiten (`units`,
 * `key`) wie `startPoints`, nur die Beschriftung tschechisch. Die Einheiten
 * kommen aus dem Weg des Kindes - auf Weg „cs" aus der eigenen Reihenfolge
 * (F4-cs).
 *
 * Namen nach dem Glossar (`recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`
 * §2.1/§2.2): *základní postavení*, *základní řada*, *velká písmena*,
 * *interpunkce*, *číslice*, *speciální znaky*. „Anfänger" wäre ein
 * Personenwort (začátečník/začátečnice) - darum „Úplný začátek" (Glossar
 * Regel 2). Die Grundreihe steht nach einem Doppelpunkt.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`). */
function nameCs(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Úplný začátek: jen F a J";
    case "start":
      return `Základní postavení (celá základní řada: ${reihe})`;
    case "gross":
      return "První písmena + velká písmena";
    case "buchstaben":
      return "Všechna písmena (i velká)";
    case "satz":
      return "+ interpunkce";
    case "zahlen":
      return "+ číslice";
    case "alles":
      return "Všechno (i speciální znaky)";
    default:
      return null;
  }
}

/** Die Startpunkte mit tschechischen Namen - dieselben Einheiten wie {@link startPoints}. */
export function startPointsCs(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameCs(p.key, reihe) ?? p.label }));
}
