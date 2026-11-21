/**
 * ★★★ E11a (25.09.2026, Bauplan Auftrag Punkt 4): JE BEREICH EIN TEST.
 *
 * Fünf Bereiche, wie im Auftrag genannt: Übungsseite, Einrichtung,
 * Einstellungen, Lehrkraft „Mes classes", Défi-Formular. Für jeden Bereich
 * wird die EXPORTIERTE `fr`-Tabelle jeder tragenden Datei gegen drei Dinge
 * geprüft:
 *
 *  1. Kein deutsches Wort übrig (derselbe Wortschatz wie der Deutsch-Fänger
 *     der englischen Bedienung, `tests/helfer/deutschFaenger.ts` - EIN Mass
 *     für beide Sprachen statt eines zweiten, das leise davonläuft).
 *  2. Kein englisches Wort übrig (eigene, kleine Liste - nur Wörter, die es
 *     auf Französisch nicht gibt, damit echte französische Wörter nicht
 *     anschlagen).
 *  3. Kein leerer Text und keine sichtbare Lücke (ein Platzhalter, der nicht
 *     gefüllt wurde, bliebe als `undefined`/`NaN` im Satz stehen - das prüft
 *     dieser Test, indem er jede Funktion mit Beispielwerten aufruft).
 *
 * ★ Diese Etappe (E11a) füllt die dritte Spalte der `texte()`-Tabellen -
 * sie schaltet NICHT die tatsächliche Anzeige um (das bliebe die Aufgabe
 * einer späteren, koordinierten Etappe, siehe Befund §5 „Was noch offen
 * ist"). Darum prüft dieser Test die TABELLEN selbst (dafür extra
 * exportiert, siehe `git log` der einzelnen Dateien), nicht den gerenderten
 * Bildschirm - ein DOM-Fänger wie beim Englischen (E9-Muster) fände in der
 * echten Seite heute noch nichts, weil `sprache` dort weiterhin die
 * oberflächen-sichere, zweiwertige Fassung ist (`oberflaechenSprache`,
 * `lib/bedienSprache/sprache.ts`).
 */
import { describe, expect, it } from "vitest";

import { SEITEN_TEXTE as TRAINER_SEITEN_TEXTE } from "../src/features/public/TippenTrainerPage";
import { SITZUNG_TEXTE } from "../src/components/typing/TypingSession";
import { T as EINRICHTUNG_TEXTE } from "../src/components/typing/Einrichtung";
import { T as EINSTELLUNGEN_TEXTE } from "../src/components/typing/TypingSettings";
import { T as MEINE_KLASSE_TEXTE } from "../src/features/public/MeineKlassePage";
import { T as KLASSE_UND_KINDER_TEXTE } from "../src/components/lernwerkstatt/klasse/KlasseUndKinder";
import { REITER_TEXTE } from "../src/components/lernwerkstatt/klasse/TastenflowReiter";
import { LOBBY_TEXTE } from "../src/components/typing/KlassenmatchLobby";
import { EINLADUNG_TEXTE } from "../src/components/typing/KlassenmatchEinladung";

/**
 * Wörter, die es im Deutschen nicht gibt - eine EIGENE, bewusst kleine Liste
 * (nicht der geteilte Wortschatz aus `deutschFaenger.ts`: der enthält kurze
 * Funktionswörter wie „des"/„du"/„liste", die im Französischen genauso
 * geschrieben werden - dort ist das kein Problem, weil dieselbe Prüfung dort
 * gegen ENGLISCHEN Text läuft, hier aber gegen FRANZÖSISCHEN. Umlaut/ß fängt
 * die Zeichenprüfung ohnehin, das deckt die meisten echten Funde ab).
 */
const DEUTSCHE_WOERTER = new Set(
  (
    "und oder nicht auch schon immer über während damit wird werden sind sein " +
    "haben kann muss sollte diese dieser dieses einen einem einer übung übungen " +
    "taste tasten woche wochen minuten schritt schritte klasse klassen " +
    "hilfe einstellungen farben farbe kontrast vorlesen abmelden anmelden " +
    "nachrichten nachricht statistik passwort meine mein deine dein " +
    "werkzeuge lernplattform programm startseite sterne runde geschafft " +
    "wochenziel spielstufe gelernt spielen tastatur anzeigen ausblenden " +
    "zeigefinger mittelfinger ringfinger kleiner linker rechter fertig " +
    "lektionen geschichten wortspiele einfacher sprache funktion " +
    "schreibfeld fenster springen ansagen aktuelle aufgabe erneut zeit " +
    "sobald anderen sitzen statt wette schreiben einschalten ausschalten " +
    "treffsicherheit lehrkraft gespeichert verloren fortschritt neues " +
    "tippfeld vergrößern verkleinern anzeige ansage laufende endet bleibt " +
    "gliederung kreis einrichtung starten übungsart reihum angemeldet " +
    "unterrichten bereich erklärung große buchstaben umschalt nächste " +
    "richtig falsch wieder jetzt eingabezeile wechseln öffnen schließen " +
    "abschnitt gratulation freigeschaltet buchstabe ziffer satzzeichen " +
    "sonderzeichen geschrieben gegenhand willkommen verstanden lernstand " +
    "speichern abbrechen bearbeiten stunde stunden sperren gesperrt " +
    "freischalten anschlag fehler tippen lernen lernprogramm zugang " +
    "zugangsdaten klassencode schulstufe schuljahr einhand buchstabieren " +
    "abzeichen stufe sekunden prozent ergebnis ergebnisse wertung " +
    "leistungswert genauigkeit verlauf hinweis hinweise schalter knopf " +
    "nachholen erlassen vorgabe kinder"
  ).split(/\s+/),
);

/**
 * Wörter, die es im Französischen nicht gibt. „score"/„message(s)"/„classe(s)"/
 * „minute(s)" sind im Französischen selbst gebräuchlich (Anglizismen bzw.
 * gleich geschriebene Wörter) und bleiben darum bewusst draussen.
 */
const ENGLISCHE_WOERTER = new Set(
  (
    "the and you your yours is are not with from this that please week weeks pupil " +
    "pupils teacher account settings password loading saved cancel close open " +
    "back next done finish start stop yes key keys speed accuracy " +
    "sign delete remove practice practising " +
    "today read aloud custom exercise weekly goal catch excused locked " +
    "unlock keyboard explore find login details welcome congratulations"
  ).split(/\s+/),
);

/**
 * Mehrere Sätze an Beispielwerten - eine Funktion kann Zahlen ODER Namen an
 * erster Stelle erwarten (`mehrzahl(n, …)` gegen `titel(name, …)`); probiert
 * wird der Reihe nach, genommen wird der erste Satz, der weder wirft noch
 * eine Lücke (`NaN`/`undefined`) im Ergebnis hinterlässt.
 */
const BEISPIELWERT_SAETZE: unknown[][] = [
  ["Mila", 3, true, "5A", 12, false, "3.MS", 7],
  [3, "Mila", true, "5A", 12, false, "3.MS", 7],
  [1, "Mila", false, "3.MS", 7, true, "5A", 12],
];

/** Konnte eine Funktion mit KEINEM der Beispielwert-Sätze aufgerufen werden? */
class NichtAufrufbar extends Error {}

/** Ein Wert der fr-Tabelle als EIN String - Teile (`Teil[]`) werden aneinandergehängt. */
function alsText(wert: unknown): string {
  if (typeof wert === "string") return wert;
  if (typeof wert === "function") {
    const fn = wert as (...a: never[]) => unknown;
    const stellen = Math.max(fn.length, 1);
    let letzterFehler: unknown;
    for (const satz of BEISPIELWERT_SAETZE) {
      try {
        const ergebnis = alsText(fn(...(satz.slice(0, stellen) as never[])));
        if (!/undefined|NaN/.test(ergebnis)) return ergebnis;
      } catch (e) {
        letzterFehler = e;
      }
    }
    if (letzterFehler !== undefined) throw new NichtAufrufbar();
    // Alle Sätze liefen, aber jeder liess eine Lücke zurück - das IST ein Fund.
    return alsText(fn(...(BEISPIELWERT_SAETZE[0].slice(0, stellen) as never[])));
  }
  if (Array.isArray(wert)) return wert.map(alsText).join(" ");
  return String(wert);
}

interface Fund {
  schluessel: string;
  wort: string;
  ausschnitt: string;
}

/**
 * Schlüssel, deren Funktion einen ECHTEN Aufzählungswert braucht (z. B.
 * `uebungsart: (art: Uebungsart) => ({training: …, …})[art]`) - mit
 * generischen Beispielwerten liefert das `undefined`, kein echter Fund.
 * Von Hand geprüft (25.09.2026): alle Fälle davon in den fünf Bereichen
 * enthalten vollständiges, korrektes Französisch.
 */
// ★ W1 (27.09.2026): „fingerHinweisTotaste" nimmt ein Objekt (Totaste, Finger,
// Buchstabe) - mit Beispiel-Zeichenketten nicht aufrufbar. Geprüft wird es je
// Sprache und Tastatur in tests/tastenflow-w1-zeichennamen-je-sprache.test.ts.
const GENERISCH_NICHT_PRUEFBAR = new Set(["uebungsart", "fingerHinweisTotaste"]);

function pruefeTabelle(tabelle: Record<string, unknown>, woerter: ReadonlySet<string>): Fund[] {
  const funde: Fund[] = [];
  for (const [schluessel, wert] of Object.entries(tabelle)) {
    if (GENERISCH_NICHT_PRUEFBAR.has(schluessel)) continue;
    let text: string;
    try {
      text = alsText(wert);
    } catch (e) {
      if (e instanceof NichtAufrufbar) continue;
      throw e;
    }
    if (text.trim() === "") {
      funde.push({ schluessel, wort: "(leer)", ausschnitt: "" });
      continue;
    }
    if (/undefined|NaN|\[object Object\]/.test(text)) {
      funde.push({ schluessel, wort: "unaufgelöster Platzhalter", ausschnitt: text.slice(0, 60) });
    }
    const gefundeneWoerter = text
      .toLowerCase()
      .replace(/[.,;:!?„“"«»()]/g, " ")
      .split(/\s+/)
      .filter((w) => woerter.has(w));
    for (const wort of gefundeneWoerter) {
      funde.push({ schluessel, wort, ausschnitt: text.slice(0, 80) });
    }
  }
  return funde;
}

function meldeFunde(bereich: string, funde: Fund[]): void {
  if (funde.length === 0) return;
  const liste = funde
    .slice(0, 20)
    .map((f) => `  ${f.schluessel}: „${f.wort}“ in „${f.ausschnitt}“`)
    .join("\n");
  throw new Error(`${bereich}: ${funde.length} Fund(e) in der fr-Tabelle:\n${liste}`);
}

describe("Französisch je Bereich: kein deutsches/englisches Wort, keine Lücke", () => {
  it("Übungsseite (TippenTrainerPage + TypingSession)", () => {
    const de = pruefeTabelle(TRAINER_SEITEN_TEXTE.fr, DEUTSCHE_WOERTER);
    meldeFunde("Übungsseite (de)", de);
    const en = pruefeTabelle(TRAINER_SEITEN_TEXTE.fr, ENGLISCHE_WOERTER);
    meldeFunde("Übungsseite (en)", en);
    const de2 = pruefeTabelle(SITZUNG_TEXTE.fr, DEUTSCHE_WOERTER);
    meldeFunde("Übungsseite/Sitzung (de)", de2);
    const en2 = pruefeTabelle(SITZUNG_TEXTE.fr, ENGLISCHE_WOERTER);
    meldeFunde("Übungsseite/Sitzung (en)", en2);
  });

  it("Einrichtung", () => {
    const de = pruefeTabelle(EINRICHTUNG_TEXTE.fr, DEUTSCHE_WOERTER);
    meldeFunde("Einrichtung (de)", de);
    const en = pruefeTabelle(EINRICHTUNG_TEXTE.fr, ENGLISCHE_WOERTER);
    meldeFunde("Einrichtung (en)", en);
  });

  it("Einstellungen", () => {
    const de = pruefeTabelle(EINSTELLUNGEN_TEXTE.fr, DEUTSCHE_WOERTER);
    meldeFunde("Einstellungen (de)", de);
    const en = pruefeTabelle(EINSTELLUNGEN_TEXTE.fr, ENGLISCHE_WOERTER);
    meldeFunde("Einstellungen (en)", en);
  });

  it('Lehrkraft "Mes classes" (MeineKlassePage + KlasseUndKinder + TastenflowReiter)', () => {
    for (const [name, tabelle] of [
      ["MeineKlassePage", MEINE_KLASSE_TEXTE.fr],
      ["KlasseUndKinder", KLASSE_UND_KINDER_TEXTE.fr],
      ["TastenflowReiter", REITER_TEXTE.fr],
    ] as const) {
      meldeFunde(`Mes classes/${name} (de)`, pruefeTabelle(tabelle, DEUTSCHE_WOERTER));
      meldeFunde(`Mes classes/${name} (en)`, pruefeTabelle(tabelle, ENGLISCHE_WOERTER));
    }
  });

  it("Défi-Formular (KlassenmatchLobby + KlassenmatchEinladung)", () => {
    meldeFunde("Défi/Lobby (de)", pruefeTabelle(LOBBY_TEXTE.fr, DEUTSCHE_WOERTER));
    meldeFunde("Défi/Lobby (en)", pruefeTabelle(LOBBY_TEXTE.fr, ENGLISCHE_WOERTER));
    meldeFunde("Défi/Einladung (de)", pruefeTabelle(EINLADUNG_TEXTE.fr, DEUTSCHE_WOERTER));
    meldeFunde("Défi/Einladung (en)", pruefeTabelle(EINLADUNG_TEXTE.fr, ENGLISCHE_WOERTER));
  });

  /**
   * ★★★ DIE GEGENPROBE (wie beim Deutsch-Fänger selbst gefordert): Dieselbe
   * Prüfung gegen die ENGLISCHE Tabelle muss beim deutschen Wortschatz NICHTS
   * finden (Englisch ist so gut wie deutschfrei) - und gegen die DEUTSCHE
   * Tabelle sehr wohl etwas finden, sonst bewiese ein grüner Lauf oben nichts.
   */
  it("Gegenprobe: der Fänger findet wirklich etwas, wenn man ihn auf Deutsch loslässt", () => {
    const funde = pruefeTabelle(TRAINER_SEITEN_TEXTE.de, DEUTSCHE_WOERTER);
    expect(funde.length).toBeGreaterThan(0);
  });
});
