/**
 * ★★★ E2b (25.09.2026, Bauplan Auftrag Punkt 3): DER FR-LÜCKEN-WÄCHTER.
 *
 * `texte()` (`src/lib/bedienSprache/texte.ts`) kennt seit E2b eine OPTIONALE
 * dritte Tabelle `fr` - fehlt sie, fällt die Oberfläche auf Englisch zurück,
 * nie auf `undefined` (der eigentliche Sicherheits-Wächter dafür steht in
 * `tests/tastenflow-sprachwahl-erkennung.test.ts` und
 * `tests/bedien-sprache-erkennung.test.ts`).
 *
 * DIESER Wächter zählt, WIE VIELE der wirklichen `texte({de, en, …})`-Aufrufe
 * im Quelltext noch KEIN `fr` haben - genau wie der Weichen-Zähler
 * (`tests/tastenflow-sprach-weichen.test.ts`) eine FESTE Obergrenze, die nur
 * SINKEN darf. E11 füllt sie nach und nach (Tabelle für Tabelle); bis dahin
 * ist der volle Stand die Obergrenze: HEUTE haben alle Tabellen kein `fr`.
 *
 * ★ Nur ECHTE Aufrufe der Funktion `texte` aus `bedienSprache/texte.ts`
 * zählen (Dateien, die sie auch importieren) - ein Treffer für das blosse
 * Wort „texte(" ohne diesen Import wäre kein Beleg (Lehre „Was beweist ein
 * grüner Wächter?").
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { describe, expect, it } from "vitest";

const WURZEL = resolve(__dirname, "..");
const ORDNER = ["src"];
const ENDUNGEN = [".ts", ".tsx"];

function sammleDateien(pfad: string): string[] {
  const out: string[] = [];
  for (const eintrag of readdirSync(pfad)) {
    if (eintrag === "node_modules" || eintrag === "dist") continue;
    const voll = join(pfad, eintrag);
    const st = statSync(voll);
    if (st.isDirectory()) out.push(...sammleDateien(voll));
    else if (ENDUNGEN.some((e) => voll.endsWith(e))) out.push(voll);
  }
  return out;
}

/** Importiert die Datei `texte` aus `bedienSprache` (egal über welchen Pfad)? */
function importiertTexte(inhalt: string): boolean {
  const re = /import\s*\{[^}]*\btexte\b[^}]*\}\s*from\s*["'][^"']*bedienSprache[^"']*["']/;
  return re.test(inhalt);
}

/** Die Textstellen `texte({ … })` - balanciert über die geschweiften Klammern gesucht. */
function findeTexteAufrufe(inhalt: string): string[] {
  const aufrufe: string[] = [];
  const oeffner = /\btexte\s*\(\s*\{/g;
  let treffer: RegExpExecArray | null;
  while ((treffer = oeffner.exec(inhalt))) {
    const start = treffer.index + treffer[0].lastIndexOf("{");
    let tiefe = 0;
    let i = start;
    for (; i < inhalt.length; i++) {
      if (inhalt[i] === "{") tiefe++;
      else if (inhalt[i] === "}") {
        tiefe--;
        if (tiefe === 0) {
          i++;
          break;
        }
      }
    }
    aufrufe.push(inhalt.slice(start, i));
  }
  return aufrufe;
}

/** Die Klammertiefe an einer Stelle innerhalb eines `{ … }`-Textes (Wurzel = 0). */
function tiefeAn(text: string, index: number): number {
  let tiefe = 0;
  for (let i = 0; i < index; i++) {
    if (text[i] === "{") tiefe++;
    else if (text[i] === "}") tiefe--;
  }
  return tiefe;
}

/** Trägt `objektText` (die ganze `texte({ … })`-Klammer) den Schlüssel EINE Ebene tief? */
function hatObersteSchluessel(objektText: string, schluessel: string): boolean {
  const re = new RegExp(`(^|[,{\\s])${schluessel}\\s*:`, "g");
  let treffer: RegExpExecArray | null;
  while ((treffer = re.exec(objektText))) {
    const pos = treffer.index + treffer[0].indexOf(schluessel);
    // Tiefe 1: direkt hinter der öffnenden Klammer von `texte({`.
    if (tiefeAn(objektText, pos) === 1) return true;
  }
  return false;
}

interface Befund {
  datei: string;
  mitFr: number;
  ohneFr: number;
}

function pruefeAlle(): Befund[] {
  const befunde: Befund[] = [];
  for (const ordner of ORDNER) {
    for (const datei of sammleDateien(resolve(WURZEL, ordner))) {
      const inhalt = readFileSync(datei, "utf8");
      if (!importiertTexte(inhalt)) continue;
      const aufrufe = findeTexteAufrufe(inhalt).filter((a) => hatObersteSchluessel(a, "de"));
      if (aufrufe.length === 0) continue;
      let mitFr = 0;
      let ohneFr = 0;
      for (const a of aufrufe) (hatObersteSchluessel(a, "fr") ? mitFr++ : ohneFr++);
      befunde.push({ datei: datei.slice(WURZEL.length + 1), mitFr, ohneFr });
    }
  }
  return befunde;
}

/**
 * ★★★ DIE OBERGRENZE - am 25.09.2026 (E2b) gemessen: JEDE gefundene Tabelle
 * hatte noch kein `fr` (die dritte Tabelle ist ganz neu): 105. Darf künftig
 * NUR SINKEN - E11 füllt Tabelle für Tabelle.
 *
 * ★★★★★ E11a (25.09.2026): auf 16 gesenkt - ALLE Tabellen ausser denen der
 * beiden Parallel-Etappen haben jetzt ein fr. Die verbleibenden 16 gehören
 * den 14 Dateien in `src/lib/typing/uebungsformen/` (E10a, zwei davon mit
 * je zwei Aufrufen) und `src/components/typing/expedition/useExpedition.ts`
 * (E4) - beide Etappen liefen parallel an denselben Dateien, siehe Befund
 * `BEFUND-2026-09-25-E11A-OBERFLAECHE.md` für die vollständige Liste mit
 * Begründung je Datei.
 *
 * ★★★★★ E11a-5 (26.09.2026, Einschalten): auf 2 gesenkt, gemessen. JEDE echte
 * Tabelle hat jetzt ein `fr` (die 15 der Übungsformen und `SPIEL_TEXTE` der
 * Expedition kamen in dieser Etappe dazu). Die 2 verbliebenen Treffer sind
 * KEINE Tabellen, sondern Kommentare, die die Bauart `texte({de,en,fr})`
 * zitieren (`LegalShell.tsx`, `totastenTexte.ts`) - der Zähler liest den
 * Quelltext, nicht den Syntaxbaum. Darf weiter nur sinken.
 */
const OBERGRENZE = 2;

describe("Fr-Lücken-Wächter: wie viele texte()-Tabellen haben noch kein fr", () => {
  it(`nicht mehr als ${OBERGRENZE} Tabellen ohne fr`, () => {
    const befunde = pruefeAlle();
    const ohneFrGesamt = befunde.reduce((s, b) => s + b.ohneFr, 0);
    expect(ohneFrGesamt).toBeLessThanOrEqual(OBERGRENZE);
  });

  it("die Zählung selbst funktioniert (Gegenprobe: die Kopfzeilen-Tabelle hat seit E11a ein fr)", () => {
    const inhalt = readFileSync(resolve(WURZEL, "src/components/AppKopfzeile.tsx"), "utf8");
    expect(importiertTexte(inhalt)).toBe(true);
    const aufrufe = findeTexteAufrufe(inhalt).filter((a) => hatObersteSchluessel(a, "de"));
    expect(aufrufe.length).toBeGreaterThan(0);
    expect(hatObersteSchluessel(aufrufe[0], "fr")).toBe(true);
  });

  /**
   * ★ E11a (25.09.2026): zweite Gegenprobe gegen einen leeren/kaputten
   * Wächter. Bis E11a-5 stand hier eine echte Tabelle ohne `fr`
   * (`zahlendiktat.ts`) - seit E11a-5 gibt es keine mehr. Die Gegenprobe läuft
   * darum an einem Beispiel im selben Format: Findet der Zähler hier kein
   * fehlendes `fr`, liest er nichts.
   */
  it("die Zählung selbst funktioniert (Gegenprobe: eine Tabelle ohne fr wird erkannt)", () => {
    const beispiel = `texte({ de: { a: "Hallo" }, en: { a: "Hello" } })`;
    const aufrufe = findeTexteAufrufe(beispiel).filter((a) => hatObersteSchluessel(a, "de"));
    expect(aufrufe.length).toBe(1);
    expect(hatObersteSchluessel(aufrufe[0], "fr")).toBe(false);
  });

  it("erkennt ein `fr` auf oberster Ebene (Gegenprobe gegen einen leeren Wächter)", () => {
    const beispiel = `texte({ de: { a: "x" }, en: { a: "x" }, fr: { a: "x" } })`;
    const aufrufe = findeTexteAufrufe(beispiel);
    expect(aufrufe).toHaveLength(1);
    expect(hatObersteSchluessel(aufrufe[0], "fr")).toBe(true);
  });

  it("verwechselt ein `fr` INNERHALB einer Tabelle (tiefer als Ebene 1) nicht mit einem echten", () => {
    const beispiel = `texte({ de: { fr: "kein echter Schlüssel" }, en: { fr: "auch nicht" } })`;
    const aufrufe = findeTexteAufrufe(beispiel);
    expect(aufrufe).toHaveLength(1);
    expect(hatObersteSchluessel(aufrufe[0], "fr")).toBe(false);
  });
});
