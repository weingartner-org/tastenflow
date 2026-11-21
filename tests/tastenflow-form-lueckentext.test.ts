/**
 * Übungsform „Lückentext-Rätsel" (`src/lib/typing/uebungsformen/lueckentext.ts`).
 *
 * Die Form lebt davon, dass die Lösung NIRGENDS vorab steht - weder im Satz
 * noch in der Ansage. Die Tests prüfen deshalb vor allem: dass kein Rätsel
 * seine eigene Lösung verrät, dass nur mit dem aktuellen Tastenstand
 * tippbare Rätsel ausgewählt werden (über mehrere Tastenstände hinweg, auch
 * nur die Grundreihe), dass eine Runde sich nicht wiederholt und dass die
 * Auswahl mit festem Zufall reproduzierbar ist.
 */
import { describe, it, expect } from "vitest";
import {
  lueckentext,
  lueckentextAufgaben,
  lueckentextKandidaten,
  RAETSEL_DE,
  RAETSEL_EN,
  type Raetsel,
} from "../src/lib/typing/uebungsformen/lueckentext";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { fitText } from "../src/lib/typing/corpus";
import { isRealWord } from "../src/lib/typing/lexicon";
import type { Lang, Stufe } from "../src/lib/typing/account";

/** Seed-fähiger Zufallsgenerator (mulberry32) - reproduzierbar über den Seed. */
function seedZufall(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyzäöüß".split("");

/** Verschiedene Tastenstände, vom kargsten bis zum vollen Alphabet. */
const GRUNDREIHE = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö"];
const STAND_A_BIS_N = [...ALPHABET.slice(0, 14), "⇧"]; // 14 Buchstaben - seit 02.09.2026 über der Schwelle
const STAND_A_BIS_P = [...ALPHABET.slice(0, 16), "⇧"]; // 16 Buchstaben - über der Taugt-Schwelle
const VOLL_FREIGESCHALTET = [...ALPHABET, "⇧", ".", ",", "?", "!"];

function baueKontext(overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "de",
    introduced: VOLL_FREIGESCHALTET,
    shift: true,
    oneHand: false,
    stufe: "kids" as Stufe,
    lang: "de" as Lang,
    count: 10,
    zufall: seedZufall(42),
    ...overrides,
  };
}

/**
 * Die Wörter eines Rätsel-Satzes als lose Tokens (Lücke ausgenommen), klein
 * geschrieben - für den „Lösung steht schon im Satz"-Vergleich. Bewusst per
 * Wort statt per Substring: „Handschuh" enthält „Hand" als Zeichenkette,
 * verrät als Wort aber nichts über eine Lösung „Hand".
 */
function satzTokens(satz: string): Set<string> {
  return new Set(
    satz
      .replace("...", " ")
      .toLowerCase()
      .split(/[^a-zäöüß]+/)
      .filter(Boolean),
  );
}

/**
 * Wörter, die es wirklich gibt, aber im kuratierten App-Lexikon (`WORDS` +
 * Korpus-/Serien-Texte, kein Vollwörterbuch) zufällig fehlen - z. B. weil sie
 * nur als Fach-/Komposit-Begriff vorkommen, den kein Übungssatz bisher
 * gebraucht hat. Geprüft am 01.09.2026 mit `isRealWord`; jedes einzelne ist
 * ein gewöhnliches, korrekt geschriebenes deutsches Wort - keine Kunstsilbe.
 * Diese Liste ist die Ausnahme aus dem Auftrag („... oder du begründest die
 * Ausnahme im Test"), keine Generalfreigabe: Jedes neue Rätsel muss zuerst
 * gegen `isRealWord` geprüft werden, bevor es hier landet.
 */
const LEXIKON_AUSNAHMEN_DE = new Set([
  "Zahnbürste", // Kompositum, im Lexikon fehlt nur die Zusammensetzung
  "Zehen", // gewöhnliches Körperteil-Wort, im Korpus bisher nicht gebraucht
  "Rektor", // Amtsbezeichnung, in keinem Kindertext bisher vorgekommen
  "Schulleiter", // dito, Kompositum
  "Schulwoche", // Kompositum aus zwei bekannten Wörtern
  "Fragezeichen", // Satzzeichen-Name, nie als FLIESSTEXT-Wort gebraucht
  "Ausrufezeichen", // dito
  // ── Charge 2, 02.09.2026 ────────────────────────────────────────────
  "Leerzeichen", // Satzzeichen-Name wie die beiden darüber
  "Panzer", // der harte Rückenschild der Schildkröte - gewöhnliches Wort
  "Nadelbaum", // Kompositum aus zwei bekannten Wörtern
  "Pfütze", // gewöhnliches Wort, im Korpus bisher nicht gebraucht
  "körnig", // Tasteigenschaft von Sand - genau die Sorte Wort, die diese
  //          Plattform braucht: eine Eigenschaft, die man FÜHLT, nicht sieht
  "Jänner", // österreichischer Monatsname (die Alternative „Januar" zählt auch)
  "Leertaste", // die App-eigene Tastatur-Sprache …
  "Umschalttaste", // … dieselbe Sprache wie in der Bildschirm-Tastatur …
  "Grundreihe", // … und wie im Lehrgang selbst
]);

/**
 * Dasselbe für Englisch.
 *
 * ★ Angelegt am 02.09.2026. Bis dahin gab es diese Liste nicht - nicht weil
 * die englische Prüfung strenger gemeint war, sondern weil die dreissig
 * damaligen Rätsel zufällig nur Wörter aus dem Korpus benutzten. Mit 154
 * Rätseln trägt der Zufall nicht mehr. Die Regel ist dieselbe wie oben: erst
 * `isRealWord`, und nur was daran scheitert, kommt hierher - mit Begründung,
 * einzeln, nie als Muster.
 */
const LEXIKON_AUSNAHMEN_EN = new Set([
  "envelope", // gewöhnliches Alltagswort, im Korpus nicht gebraucht
  "towel", // dito
  "fridge", // dito (Kurzform von refrigerator)
  "peel", // die Schale einer Banane
  "Sunday", // Wochentag - die anderen stehen im Korpus, dieser nicht
  "noun", // Fachwort des Sprachunterrichts
  "choir", // gewöhnliches Wort, unregelmässig geschrieben
  "backspace", // Tastatur-Sprache, wie „Leertaste" auf Deutsch
  "enter", // dito
]);

describe("RAETSEL_DE / RAETSEL_EN - Inhalt", () => {
  it("liefert mindestens 60 deutsche und 25 englische Rätsel", () => {
    expect(RAETSEL_DE.length).toBeGreaterThanOrEqual(60);
    expect(RAETSEL_EN.length).toBeGreaterThanOrEqual(25);
  });

  it("jedes Rätsel enthält die Lücke `...` genau einmal", () => {
    for (const r of [...RAETSEL_DE, ...RAETSEL_EN]) {
      const treffer = r.satz.match(/\.\.\./g) ?? [];
      expect(treffer.length, `Satz: "${r.satz}"`).toBe(1);
      // Kein Auslassungszeichen „…" (ein Unicode-Zeichen) statt dreier Punkte.
      expect(r.satz.includes("…"), `Satz: "${r.satz}"`).toBe(false);
    }
  });

  it("jedes Rätsel hat mindestens eine Lösung und mindestens eine Stufe", () => {
    for (const r of [...RAETSEL_DE, ...RAETSEL_EN]) {
      expect(r.loesungen.length, `Satz: "${r.satz}"`).toBeGreaterThan(0);
      expect(r.stufen.length, `Satz: "${r.satz}"`).toBeGreaterThan(0);
    }
  });

  it("keine Lösung kommt im Satz selbst schon vor (sonst stünde die Antwort da)", () => {
    for (const r of [...RAETSEL_DE, ...RAETSEL_EN]) {
      const tokens = satzTokens(r.satz);
      for (const loesung of r.loesungen) {
        for (const teil of loesung.toLowerCase().split(/[^a-zäöüß]+/).filter(Boolean)) {
          expect(
            tokens.has(teil),
            `Lösung "${loesung}" (Wort "${teil}") steckt schon im Satz "${r.satz}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("jede deutsche Lösung ist ein echtes Wort oder eine dokumentierte Ausnahme", () => {
    for (const r of RAETSEL_DE) {
      for (const loesung of r.loesungen) {
        const ok = isRealWord(loesung, "de") || LEXIKON_AUSNAHMEN_DE.has(loesung);
        expect(ok, `"${loesung}" (Satz: "${r.satz}") ist weder im Lexikon noch dokumentierte Ausnahme`).toBe(
          true,
        );
      }
    }
  });

  it("jede englische Lösung ist ein echtes Wort", () => {
    for (const r of RAETSEL_EN) {
      for (const loesung of r.loesungen) {
        const ok = isRealWord(loesung, "en") || LEXIKON_AUSNAHMEN_EN.has(loesung);
        expect(ok, `"${loesung}" (Satz: "${r.satz}") ist weder im Lexikon noch dokumentierte Ausnahme`).toBe(
          true,
        );
      }
    }
  });

  it("jede Lösung ist mit dem VOLLEN Alphabet tatsächlich tippbar (fitText ändert nichts)", () => {
    const allowed = new Set(VOLL_FREIGESCHALTET);
    for (const r of [...RAETSEL_DE, ...RAETSEL_EN]) {
      for (const loesung of r.loesungen) {
        expect(fitText(loesung, allowed), `Lösung "${loesung}" (Satz: "${r.satz}")`).toBe(loesung);
      }
    }
  });
});

describe("lueckentextKandidaten - Auswahl nach Tastenstand", () => {
  it("mit nur der Grundreihe gibt es kaum tippbare Rätsel - taugt ist falsch", () => {
    const ctx = baueKontext({ introduced: GRUNDREIHE });
    const kandidaten = lueckentextKandidaten(ctx);
    expect(kandidaten.length).toBeLessThan(5);
    expect(lueckentext.taugt(ctx)).toBe(false);
    // Was übrig bleibt, muss wirklich tippbar sein.
    for (const k of kandidaten) {
      for (const a of k.antworten) expect(fitText(a, new Set(GRUNDREIHE))).toBe(a);
    }
  });

  /*
   * ★★★ UMGEDREHT am 02.09.2026, nicht geloescht.
   *
   * Hier stand: "knapp unter der Taugt-Schwelle (a-n, 14 Buchstaben)" - mit
   * a-n gab es weniger als fuenf Kandidaten, die Form taugte also noch nicht.
   * Das war eine Aussage ueber die GROESSE des damaligen Vorrats (77 Raetsel),
   * nicht ueber eine Entscheidung. Seit der Verdopplung auf 154 liefert a-n
   * acht Kandidaten - der Lueckentext steht einem Kind jetzt FRUEHER offen,
   * und das ist ein Gewinn, kein Fehler.
   *
   * Was der Waechter wirklich sichern soll, ist die REGEL dahinter: unter
   * fuenf Kandidaten wird die Form nicht angeboten, ab fuenf schon. Genau die
   * steht jetzt hier - und zwar ueber mehrere Tastenstaende hinweg, damit sie
   * beim naechsten Vorrats-Zuwachs nicht wieder umkippt.
   */
  it("★★★ die Regel gilt an JEDEM Tastenstand: unter fuenf Kandidaten kein Angebot", () => {
    const staende = [GRUNDREIHE, STAND_A_BIS_N, STAND_A_BIS_P, VOLL_FREIGESCHALTET];
    for (const stand of staende) {
      const ctx = baueKontext({ introduced: stand });
      const anzahl = lueckentextKandidaten(ctx).length;
      expect(lueckentext.taugt(ctx), `${anzahl} Kandidaten bei ${stand.length} Buchstaben`).toBe(
        anzahl >= 5,
      );
    }
  });

  it("a-n reicht seit der Verdopplung - der Lueckentext kommt frueher", () => {
    const ctx = baueKontext({ introduced: STAND_A_BIS_N });
    expect(lueckentextKandidaten(ctx).length).toBeGreaterThanOrEqual(5);
    expect(lueckentext.taugt(ctx)).toBe(true);
  });

  it("knapp über der Taugt-Schwelle (a-p, 16 Buchstaben)", () => {
    const ctx = baueKontext({ introduced: STAND_A_BIS_P });
    const kandidaten = lueckentextKandidaten(ctx);
    expect(kandidaten.length).toBeGreaterThanOrEqual(5);
    expect(lueckentext.taugt(ctx)).toBe(true);
  });

  it("mit dem vollen Alphabet taugt die Form", () => {
    const ctx = baueKontext();
    expect(lueckentext.taugt(ctx)).toBe(true);
    expect(lueckentextKandidaten(ctx).length).toBeGreaterThanOrEqual(60);
  });

  it("jede gelieferte Antwort ist wirklich mit ctx.introduced tippbar - über mehrere Tastenstände", () => {
    for (const introduced of [GRUNDREIHE, STAND_A_BIS_N, STAND_A_BIS_P, VOLL_FREIGESCHALTET]) {
      const allowed = new Set(introduced);
      const ctx = baueKontext({ introduced, count: 200 });
      for (const { antworten } of lueckentextKandidaten(ctx)) {
        expect(antworten.length).toBeGreaterThan(0);
        for (const a of antworten) expect(fitText(a, allowed)).toBe(a);
      }
    }
  });

  it("filtert nach Stufe - ein teens/erwachsen-Rätsel erscheint nicht für kids", () => {
    const teensOnlySatz = RAETSEL_DE.find(
      (r) => !r.stufen.includes("kids") && r.loesungen.some((l) => fitText(l, new Set(VOLL_FREIGESCHALTET)) !== null),
    );
    expect(teensOnlySatz).toBeDefined();
    const ctxKids = baueKontext({ stufe: "kids", count: 200 });
    const ctxErwachsen = baueKontext({ stufe: "erwachsen", count: 200 });
    const saetzeKids = lueckentextKandidaten(ctxKids).map((k) => k.raetsel.satz);
    const saetzeErwachsen = lueckentextKandidaten(ctxErwachsen).map((k) => k.raetsel.satz);
    expect(saetzeKids).not.toContain(teensOnlySatz!.satz);
    expect(saetzeErwachsen).toContain(teensOnlySatz!.satz);
  });
});

describe("lueckentextAufgaben - eine Runde", () => {
  it("liefert ungefähr ctx.count Aufgaben bei genug tippbaren Rätseln", () => {
    const ctx = baueKontext({ count: 12 });
    expect(lueckentextAufgaben(ctx).length).toBe(12);
  });

  it("liefert nie mehr Aufgaben, als tippbare Rätsel vorhanden sind", () => {
    const ctx = baueKontext({ introduced: STAND_A_BIS_P, count: 500 });
    const anzahlKandidaten = lueckentextKandidaten(ctx).length;
    expect(lueckentextAufgaben(ctx).length).toBe(anzahlKandidaten);
  });

  it("keine Wiederholung innerhalb einer Runde", () => {
    for (const seed of [1, 2, 3, 4, 99, 4242]) {
      const ctx = baueKontext({ count: 40, zufall: seedZufall(seed) });
      const aufgaben = lueckentextAufgaben(ctx);
      const gesehen = new Set<string>();
      for (const a of aufgaben) {
        expect(gesehen.has(a.frage), `Aufgabe "${a.frage}" doppelt (seed ${seed})`).toBe(false);
        gesehen.add(a.frage);
      }
    }
  });

  it("`frage` zeigt nie die Lösung - die Lücke bleibt offen", () => {
    // Wortweiser Vergleich, kein roher Substring-Test: „Telefonieren" enthält
    // die Zeichenkette „Telefon", ist aber ein anderes WORT und verrät die
    // Lösung nicht - genau das prüft schon `satzTokens` weiter oben.
    const ctx = baueKontext({ count: 200 });
    for (const a of lueckentextAufgaben(ctx)) {
      expect(a.frage).toContain("...");
      const tokens = satzTokens(a.frage);
      for (const antwort of a.antworten) {
        for (const teil of antwort.toLowerCase().split(/[^a-zäöüß]+/).filter(Boolean)) {
          expect(tokens.has(teil), `Antwort "${antwort}" steckt als Wort in "${a.frage}"`).toBe(false);
        }
      }
    }
  });

  it("`aufloesung` enthält die Lösung und keine Lücken-Punkte mehr", () => {
    const ctx = baueKontext({ count: 200 });
    for (const a of lueckentextAufgaben(ctx)) {
      expect(a.aufloesung).toBeDefined();
      expect(a.aufloesung!).toContain(a.antworten[0]);
      expect(a.aufloesung!.includes("...")).toBe(false);
    }
  });

  it("`aufloesung` ist ein vollständiger, satzschluss-endender Satz", () => {
    const ctx = baueKontext({ count: 200 });
    for (const a of lueckentextAufgaben(ctx)) {
      expect(a.aufloesung!).toMatch(/[.!?]$/);
    }
  });

  it("ist mit festem zufall reproduzierbar", () => {
    const ctx1 = baueKontext({ count: 25, zufall: seedZufall(777) });
    const ctx2 = baueKontext({ count: 25, zufall: seedZufall(777) });
    expect(lueckentextAufgaben(ctx1)).toEqual(lueckentextAufgaben(ctx2));
  });

  it("verschiedene Seeds ergeben (bei genug Auswahl) verschiedene Reihenfolgen", () => {
    const a = lueckentextAufgaben(baueKontext({ count: 15, zufall: seedZufall(1) }));
    const b = lueckentextAufgaben(baueKontext({ count: 15, zufall: seedZufall(2) }));
    expect(a.map((x) => x.frage)).not.toEqual(b.map((x) => x.frage));
  });

  it("liefert eine leere Liste statt eines Absturzes, wenn nichts tippbar ist", () => {
    const ctx = baueKontext({ introduced: ["a", "s"], count: 10 });
    expect(lueckentextAufgaben(ctx)).toEqual([]);
  });

  it("englischsprachige Runde liefert englische Sätze aus RAETSEL_EN", () => {
    const ctx = baueKontext({ lang: "en", count: 200 });
    const aufgaben = lueckentextAufgaben(ctx);
    expect(aufgaben.length).toBeGreaterThan(0);
    const enSaetze = new Set(RAETSEL_EN.map((r) => r.satz));
    for (const a of aufgaben) expect(enSaetze.has(a.frage)).toBe(true);
  });
});

describe("Uebungsform `lueckentext` - der Vertrag aus typen.ts", () => {
  it("hat die richtige Kennung, keinen eigenen `baue`, aber `fragen`", () => {
    expect(lueckentext.id).toBe("lueckentext");
    expect(lueckentext.eigenerBildschirm).toBe("raetsel");
    expect(lueckentext.baue).toBeUndefined();
    expect(typeof lueckentext.fragen).toBe("function");
    expect(lueckentext.name.length).toBeGreaterThan(0);
  });

  it("liefert eine ganze Ankündigung in Deutsch und Englisch", () => {
    const de = lueckentext.ankuendigung(baueKontext({ lang: "de" }));
    const en = lueckentext.ankuendigung(baueKontext({ lang: "en" }));
    expect(de.endsWith(".")).toBe(true);
    expect(en.endsWith(".")).toBe(true);
    expect(de.toLowerCase()).toContain("rätsel");
    // EN4 (18.09.2026): Glossar §3.6 - „Lückentext-Rätsel" heisst „gap-fill
    // puzzle" (britisches Schulwort); vorher stand hier „riddle".
    expect(en.toLowerCase()).toContain("gap-fill");
    // Die Lösung darf niemals in der Ankündigung selbst stecken.
    expect(de).not.toMatch(/[a-zäöü]{4,}\?$/);
  });

  it("`taugt` und `fragen` stimmen überein - taugt ist wahr genau dann, wenn fragen etwas liefert", () => {
    for (const introduced of [GRUNDREIHE, STAND_A_BIS_N, STAND_A_BIS_P, VOLL_FREIGESCHALTET]) {
      const ctx = baueKontext({ introduced, count: 10 });
      const taugt = lueckentext.taugt(ctx);
      const aufgaben = lueckentext.fragen!(ctx);
      if (taugt) expect(aufgaben.length).toBeGreaterThan(0);
    }
  });
});

// Nur damit `Raetsel` (der Inhalts-Typ) auch wirklich importierbar bleibt -
// ein reiner Typ-Test, der bei einer kaputten Exportstruktur nicht kompiliert.
function _typCheck(r: Raetsel): string {
  return r.satz;
}
void _typCheck;

/* ═══════════════════════════════════════════════════════════════════════
   02.09.2026 - Charge 2 verdoppelt den Vorrat. Was dabei schiefgehen kann.
   ═══════════════════════════════════════════════════════════════════════ */

describe(`★★★ Der Vorrat waechst - die Regeln duerfen dabei nicht kippen`, () => {
  /*
   * Beim Verdoppeln am 02.09.2026 sind mir SECHS Fehler unterlaufen, die
   * genau diese drei Pruefungen gefunden haben: vier Saetze, die es schon
   * gab, und zwei, die ihre Loesung selbst nannten ("Zum Telefonieren
   * braucht man ein ..." mit der Loesung "Telefon" - einer davon stand schon
   * seit der ersten Charge da). Von Hand faellt so etwas in 154 Zeilen
   * niemandem auf.
   */
  const alle: Array<[readonly Raetsel[], string]> = [
    [RAETSEL_DE, "DE"],
    [RAETSEL_EN, "EN"],
  ];

  it(`kein Satz kommt zweimal vor`, () => {
    for (const [liste, name] of alle) {
      const gesehen = new Set<string>();
      const doppelt: string[] = [];
      for (const r of liste) {
        if (gesehen.has(r.satz)) doppelt.push(r.satz);
        gesehen.add(r.satz);
      }
      expect(doppelt, `${name}: ${doppelt.join(" | ")}`).toEqual([]);
    }
  });

  it(`★★★ kein Satz enthaelt seine eigene Loesung`, () => {
    for (const [liste, name] of alle)
      for (const r of liste)
        for (const l of r.loesungen)
          expect(
            r.satz.toLowerCase().includes(l.toLowerCase()),
            `${name}: "${l}" steckt in "${r.satz}"`,
          ).toBe(false);
  });

  it(`jeder Satz hat genau eine Luecke und mindestens eine Loesung`, () => {
    for (const [liste, name] of alle)
      for (const r of liste) {
        expect(r.satz.includes("..."), `${name}: ${r.satz}`).toBe(true);
        expect(r.loesungen.length, `${name}: ${r.satz}`).toBeGreaterThan(0);
        for (const l of r.loesungen) expect(l.trim()).toBe(l);
      }
  });

  it(`beide Sprachen tragen gleich viel - Englisch ist nicht mehr die Haelfte`, () => {
    // Johannes am 02.09.2026: Englisch soll auf das deutsche Niveau.
    expect(RAETSEL_EN.length).toBe(RAETSEL_DE.length);
  });
});
