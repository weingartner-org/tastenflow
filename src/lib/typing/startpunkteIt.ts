/**
 * ★ O-IT (02.10.2026): DIE NAMEN DER STARTPUNKTE ITALIENISCH.
 *
 * `startPoints(sprache, lernweg)` in `letters.ts` rechnet die sieben
 * Landmarken („Anfänger: nur F und J" … „Alles") und beschriftet sie - für
 * „it" bis hierher englisch (`mitRueckfallEn`). `letters.ts` bleibt in Etappe O
 * unberührt (Reihenfolge und Stufen gehören zu F4); darum stehen die
 * italienischen Namen HIER, und {@link startPunkte} ist der eine Weg, den die
 * Oberfläche geht: dieselben Einheiten (`units`, `key`) wie `startPoints`, nur
 * die Beschriftung italienisch. Für de/en/fr/es reicht sie `startPoints`
 * unverändert durch.
 *
 * Wörter nach dem Glossar (`recherche-italienisch-2026-10-02/GLOSSAR-it.md`
 * §2.1/§2.3): *posizione base*, *riga di base*, *maiuscole*, *punteggiatura*.
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";
import { startPointsPl } from "./startpunktePl";
// ★ O-TR (02.10.2026): die türkischen Namen.
import { startPointsTr } from "./startpunkteTr";
// ★ O-CS (03.10.2026): die tschechischen Namen.
import { startPointsCs } from "./startpunkteCs";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege (`startpunkte<Xx>.ts`, heute englische Namen).
import { startPointsBg } from "./startpunkteBg";
import { startPointsEl } from "./startpunkteEl";
import { startPointsHu } from "./startpunkteHu";
import { startPointsNl } from "./startpunkteNl";
import { startPointsPt } from "./startpunktePt";
import { startPointsBr } from "./startpunkteBr";
import { startPointsRo } from "./startpunkteRo";
import { startPointsSv } from "./startpunkteSv";
import { startPointsUk } from "./startpunkteUk";
import { istGeruestSprache, type GeruestSprache } from "./sprachRegister";

/** ★ G3c-VERTEILER (25.10.2026): die Startpunkte je Gerüst-Sprache. */
const STARTPUNKTE_GERUEST: Readonly<Record<GeruestSprache, (lernweg: Lernweg) => StartPoint[]>> = {
  bg: startPointsBg,
  el: startPointsEl,
  hu: startPointsHu,
  nl: startPointsNl,
  pt: startPointsPt,
  br: startPointsBr,
  ro: startPointsRo,
  sv: startPointsSv,
  uk: startPointsUk,
};

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k …)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`). */
function nameIt(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Principiante: solo F e J";
    case "start":
      return `Posizione base (tutta la riga di base ${reihe})`;
    case "gross":
      return "Prime lettere + maiuscole";
    case "buchstaben":
      return "Tutte le lettere (con maiuscole)";
    case "satz":
      return "+ punteggiatura";
    case "zahlen":
      return "+ numeri";
    case "alles":
      return "Tutto (anche i caratteri speciali)";
    default:
      return null;
  }
}

/** Die Startpunkte mit italienischen Namen - dieselben Einheiten wie {@link startPoints}. */
export function startPointsIt(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameIt(p.key, reihe) ?? p.label }));
}

/**
 * Die Startpunkte in der Bedienungssprache - Italienisch von hier, Polnisch aus
 * `startpunktePl.ts` (★ O-PL, 02.10.2026), alles andere wie bisher.
 */
export function startPunkte(sprache: BedienSprache, lernweg: Lernweg): StartPoint[] {
  if (sprache === "it") return startPointsIt(lernweg);
  if (sprache === "pl") return startPointsPl(lernweg);
  // ★ O-TR (02.10.2026): Türkisch aus `startpunkteTr.ts`.
  if (sprache === "tr") return startPointsTr(lernweg);
  // ★ O-CS (03.10.2026): Tschechisch aus `startpunkteCs.ts`.
  if (sprache === "cs") return startPointsCs(lernweg);
  // ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Sprachen aus ihrer eigenen Datei (heute dieselben englischen Namen wie vorher).
  if (istGeruestSprache(sprache)) return STARTPUNKTE_GERUEST[sprache](lernweg);
  return startPoints(sprache, lernweg);
}
