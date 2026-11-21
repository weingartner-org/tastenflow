/**
 * WÄCHTER: Jeder Bildschirm führt zu Impressum und Datenschutz.
 * ===========================================================================
 * Am 02.09.2026 fiel auf, dass die Lehreransicht keinen Weg dorthin hat. Beim
 * Nachsehen war das kein Einzelfall: Auf der ganzen Plattform gab es GENAU
 * ZWEI Fußzeilen - die in `Layout.tsx` (gilt nur für Seiten INNERHALB des
 * Layouts) und eine abgeschriebene in `TippenTrainerPage`. Fünfzehn weitere
 * öffentlich erreichbare Seiten hatten keine.
 *
 * ★★★★★ WARUM DIESER WÄCHTER SEIT DEM ERSTEN LAUF NEU GESCHRIEBEN IST.
 * Er prüfte zuerst nur, ob die DATEI den Baustein erwähnt. Das war grün - und
 * hat trotzdem nichts bewiesen: `MathecoachPage` gibt VIER verschiedene
 * Bildschirme zurück (Ladezustand, Anmeldefenster, Kind-Bereich,
 * Lehrer-Bereich), und die Fußzeile hing an genau einem davon. Am Live-Server
 * gemessen: Wer `/programme/mathecoach` aufrief, sah ein Anmeldefenster, das
 * Klassencode, Name und Passwort erfragt - **ohne jeden Weg zu den
 * Rechtstexten**. Eine Datei kann den Baustein einbinden und die Pflicht
 * trotzdem an drei von vier Stellen verfehlen.
 *
 * ⇒ Gezählt wird deshalb nicht die Datei, sondern der BILDSCHIRM. In dieser
 * Anwendung ist ein Bildschirm daran erkennbar, dass seine Wurzel
 * `min-h-screen` trägt - das ist die Klasse, mit der eine Seite die volle
 * Fensterhöhe für sich nimmt. Ein Bildschirm ohne Fußzeile ist ein Befund.
 * (Gezählt wird je ZEILE, siehe `zaehleZeilen` - eine Verzweigung zwischen
 * zwei `min-h-screen`-Varianten ist EIN Bildschirm, nicht zwei.)
 *
 * ★★★ Der Wächter hält die REGEL fest, nicht die Liste von heute: Wer eine
 * neue Seite oder einen neuen Rückgabe-Zweig anlegt, wird rot - nicht erst,
 * wenn es jemandem auffällt.
 *
 * Rechtsgrundlage: § 25 MedienG, § 5 ECG, Art. 13 DSGVO - beide Texte müssen
 * von jeder Seite aus unmittelbar erreichbar sein. Bei einem Anmeldefenster
 * wiegt es am schwersten: Art. 13 verlangt die Information **vor** der
 * Erhebung, nicht danach.
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ORDNER = join(process.cwd(), "src/features/public");

/**
 * Bildschirme, die bewusst KEINE Fußzeile tragen - jeder mit seinem Grund.
 * `wenigerAls` sagt, um wie viele Bildschirme die Datei hinter der Zahl ihrer
 * `min-h-screen`-Wurzeln zurückbleiben darf. Wer hier etwas einträgt, schreibt
 * den Grund dazu; ein Eintrag ohne Begründung fällt selbst durch.
 */
const AUSNAHMEN: Record<string, { wenigerAls: number; grund: string }> = {
  "LtiEinstiegPage.tsx": {
    wenigerAls: 1,
    grund:
      "Durchgangsseite: löst das Moodle-Token ein und leitet sofort weiter. " +
      "Sie steht nie still vor jemandem - das Ziel der Weiterleitung trägt die Fußzeile.",
  },
  "MathecoachMusterPage.tsx": {
    wenigerAls: 1,
    grund:
      "Nur auf dem Entwicklungsrechner. `import.meta.env.DEV` ist beim Bauen " +
      "eine Konstante; die Seite fällt aus dem ausgelieferten Bündel heraus.",
  },
  "MathecoachPage.tsx": {
    wenigerAls: 2,
    grund:
      `(1) Der Ladezustand („Einen Augenblick.“) steht Sekundenbruchteile, solange ` +
      "der Server die Freischaltung prüft, und trägt bewusst nichts ausser " +
      "diesem einen Satz. " +
      "(2) Seit dem 06.09.2026 die Kind-VORSCHAU der Lehrkraft: Sie zeigt " +
      "`KindBereich`, und dessen Fußzeile steht schon da - EINE Fußzeile bedient " +
      "hier zwei `min-h-screen`-Wurzeln, und mehr kann diese Prüfung nicht " +
      "sehen, weil sie Zeilen zählt und keinen Baum liest. " +
      "⚠️ Nachgemessen, nicht angenommen: Die Vorschau rendert dieselbe " +
      "Komponente wie der Kind-Bereich, also auch dieselbe Fußzeile. " +
      "Die vier Bildschirme, die jemand wirklich liest - Anmeldefenster, " +
      "Kind-Bereich, Vorschau, Lehrer-Bereich - tragen sie alle.",
  },
  "PunktgenauPage.tsx": {
    wenigerAls: 1,
    grund:
      "Der Einbettungs-Modus (`?level=…&bare=1`) steckt in einem Arbeitsheft, " +
      "das seine eigene Fußzeile hat - dort wäre sie eine zweite, verwirrende. " +
      "Der eigenständige Bildschirm derselben Datei trägt sie.",
  },
};

/** Alle Seiten-Dateien - auch die in Unterordnern (z. B. `ausgleich/`). */
function seitenDateien(ordner: string, praefix = ""): string[] {
  const raus: string[] = [];
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    const name = praefix + eintrag.name;
    if (eintrag.isDirectory()) {
      raus.push(...seitenDateien(join(ordner, eintrag.name), name + "/"));
    } else if (eintrag.name.endsWith("Page.tsx")) {
      raus.push(name);
    }
  }
  return raus;
}

/**
 * Bildschirme zählen heißt ZEILEN zählen, nicht Vorkommen.
 * ⚠️ Vier Demo-Seiten schreiben ihre Wurzel als Verzweigung:
 *   `className={bare ? "min-h-screen p-3" : "min-h-screen px-4 py-10"}`
 * Das sind ZWEI Vorkommen und EIN Bildschirm - zur Laufzeit greift genau eine
 * Hälfte. Nach Zeilen gezählt stimmt es; nach Vorkommen meldete der Wächter
 * beim ersten Lauf vier Seiten falsch an.
 */
function zaehleZeilen(text: string, muster: RegExp): number {
  return text.split("\n").filter((z) => muster.test(z)).length;
}

describe("Impressum und Datenschutz auf jedem Bildschirm", () => {
  it("★★★★★ jeder min-h-screen-Bildschirm trägt eine Fußzeile", () => {
    const befunde: string[] = [];
    for (const datei of seitenDateien(ORDNER)) {
      const text = readFileSync(join(ORDNER, datei), "utf8");
      const bildschirme = zaehleZeilen(text, /min-h-screen/);
      const fusszeilen = zaehleZeilen(text, /<RechtlichesFusszeile/);
      const erlaubt = AUSNAHMEN[datei.split("/").pop()!]?.wenigerAls ?? 0;
      if (bildschirme - fusszeilen > erlaubt) {
        befunde.push(
          `${datei}: ${bildschirme} Bildschirm(e), aber nur ${fusszeilen} ` +
            `Fußzeile(n)` +
            (erlaubt ? ` (erlaubt wären ${erlaubt} weniger)` : ""),
        );
      }
    }
    expect(
      befunde,
      "Diese Bildschirme haben keinen Weg zu Impressum und Datenschutz " +
        "(§ 25 MedienG, § 5 ECG, Art. 13 DSGVO).\n" +
        "⚠️ Achte auf Dateien mit MEHREREN Rückgaben - eine Datei kann den " +
        "Baustein einbinden und die Pflicht trotzdem an drei von vier Stellen " +
        "verfehlen. Genau so ist es am 02.09.2026 passiert.\n" +
        "Entweder `<RechtlichesFusszeile />` in den fehlenden Zweig - oder, " +
        "mit Begründung, in AUSNAHMEN eintragen:\n  " + befunde.join("\n  "),
    ).toEqual([]);
  });

  it("★ die Fußzeile lebt an EINER Stelle, nicht als Abschrift je Seite", () => {
    const abschriften: string[] = [];
    for (const datei of seitenDateien(ORDNER)) {
      const text = readFileSync(join(ORDNER, datei), "utf8");
      // Ein eigenes <footer> mit den Rechtstexten wäre die Rückkehr der
      // Doppelung, die am 02.09. aufgelöst wurde.
      if (/<footer[^>]*>/.test(text) && text.includes("/impressum")) {
        abschriften.push(datei);
      }
    }
    expect(
      abschriften,
      "Diese Seiten schreiben die Fußzeile selbst statt " +
        "`RechtlichesFusszeile` zu benutzen. Zwei Stellen, die dieselbe Frage " +
        "getrennt beantworten, laufen auseinander:\n  " + abschriften.join("\n  "),
    ).toEqual([]);
  });

  it("★ jede benannte Ausnahme hat einen Grund", () => {
    for (const [datei, { grund }] of Object.entries(AUSNAHMEN)) {
      expect(grund.length, `${datei} ohne Begründung`).toBeGreaterThan(40);
    }
  });
});
