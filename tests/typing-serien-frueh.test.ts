/**
 * Die FRÜHE Bücherei-Treppe (29.07.2026) + Nachschub für Erwachsene.
 *
 * Diese Tests prüfen bewusst gegen REGELN statt gegen eine Hand-Liste
 * (Lehre aus der Nachprüfung vom 28.07.): Eine Charge, die eine Gruppe von
 * Befunden nur teilweise behebt, sieht sonst wie ein Erfolg aus. Der wichtigste
 * Test ist deshalb nicht »sind die sieben Serien da«, sondern »geht die Bücherei
 * für JEDE Altersstufe früh auf« — der bleibt auch dann gültig, wenn später
 * andere Serien dazukommen.
 *
 * Jeder Test gibt seine Grundmenge über den Titel oder eine Zusicherung preis,
 * damit ein leerer Treffer nicht wie ein bestandener Test aussieht.
 */
import { describe, expect, it } from "vitest";
import {
  SERIEN,
  allowedFromIntroduced,
  serieTypeable,
  serienForStufe,
  validateHerkunft,
} from "../src/lib/typing/serien";
import { SERIEN_FRUEH } from "../src/lib/typing/serienFrueh";
import { SERIEN_ERWACHSEN } from "../src/lib/typing/serienErwachsen";
import { SERIEN_MITTEL } from "../src/lib/typing/serienMittel";
import { SERIEN_TEENS_FRUEH } from "../src/lib/typing/serienTeensFrueh";
import { SERIEN_ERWACHSEN_FRUEH } from "../src/lib/typing/serienErwachsenFrueh";
import { SERIEN_KIDS_ZWEITE_RUNDE } from "../src/lib/typing/serienKidsZweiteRunde";
import { SERIEN_ERWACHSEN_RUNDE2 } from "../src/lib/typing/serienErwachsenRunde2";
import {
  computeSerieMinTier,
  serieEtappeCount,
  serieLineCount,
  serieLines,
  validateSerie,
} from "../src/lib/typing/serie";
import { INTRO_ORDER } from "../src/lib/typing/letters";
import type { Stufe } from "../src/lib/typing/account";

/** Die Charge vom 29.07. — Grundmenge der Struktur- und Rechte-Tests. */
const NEU = [...SERIEN_FRUEH, ...SERIEN_ERWACHSEN];
/**
 * Alles, was seit dem Ausgangsbefund dazukam — NUR für den Beleg-Test
 * unten. Am 30.07. kam die eigene Treppe für 10–12 hinzu (`serienMittel.ts`);
 * sie öffnet ebenfalls bei 13 Einheiten und muss deshalb aus dem
 * »Ausgangszustand« herausgerechnet werden. Bewusst NICHT in `NEU`: sonst
 * zählte der Struktur-Test der 29.07.-Charge plötzlich 13 statt 9 Serien.
 * Am 16.08. kam aus demselben Grund `serienTeensFrueh.ts` dazu (Charge I1,
 * sechs eigene teens-Serien, zwei davon ebenfalls bei 13 Einheiten offen) und
 * danach `serienErwachsenFrueh.ts` (Charge I1c, sechs eigene
 * Erwachsenen-Serien, eine davon - »Der Laden« - ebenfalls bei 13 Einheiten).
 * Am 22.08. kam `serienKidsZweiteRunde.ts` dazu (Charge K2, zwoelf eigene
 * kids-Serien, zwei davon - »Die Kreide an der Tafel« und »Das Fest an der
 * Linde« - ebenfalls bei 13 Einheiten offen). Ebenfalls am 22.08. kam
 * `serienErwachsenRunde2.ts` dazu (Charge E2-DE, die zweite Runde fuer die
 * Stufe erwachsen; »Der Kai« und »Die Ernte« oeffnen ebenfalls bei 13
 * Einheiten).
 */
const SPAETER = [
  ...NEU,
  ...SERIEN_MITTEL,
  ...SERIEN_TEENS_FRUEH,
  ...SERIEN_ERWACHSEN_FRUEH,
  ...SERIEN_KIDS_ZWEITE_RUNDE,
  ...SERIEN_ERWACHSEN_RUNDE2,
];
const STUFEN: Stufe[] = ["kids", "teens", "erwachsen"];

/** Zeichensatz nach n Einheiten aus INTRO_ORDER — genau wie in der App. */
function allowedAfter(n: number): Set<string> {
  return allowedFromIntroduced(INTRO_ORDER.slice(0, n), "de");
}

/** Ab wie vielen Einheiten geht die Serie auf? (= das Maximum über alle Zeilen) */
function opensAt(lines: readonly string[]): number {
  for (let n = 1; n <= INTRO_ORDER.length; n++) {
    const allowed = allowedAfter(n);
    if (lines.every((l) => serieTypeable({ etappen: [{ lines: [l] }] } as never, allowed))) return n;
  }
  return Number.POSITIVE_INFINITY;
}

describe("Frühe Treppe — Form und Rechte", () => {
  it("neun neue Serien, alle strukturell gültig und tier-ehrlich deklariert", () => {
    expect(NEU).toHaveLength(9);
    for (const s of NEU) {
      expect(validateSerie(s, "de").problems, s.slug).toEqual([]);
      expect(computeSerieMinTier(s, "de"), s.slug).toBe(s.minTier);
    }
  });

  it("je vier Etappen mit exakt zwölf Zeilen, Zeilen höchstens 85 Zeichen", () => {
    for (const s of NEU) {
      expect(serieEtappeCount(s), s.slug).toBe(4);
      for (const e of s.etappen) {
        expect(e.lines, s.slug).toHaveLength(12);
        for (const l of e.lines) expect(l.length, `${s.slug}: ${l}`).toBeLessThanOrEqual(85);
      }
    }
    expect(NEU.reduce((a, s) => a + serieLineCount(s), 0)).toBe(432);
  });

  it("Herkunft vollständig und rechtlich sauber", () => {
    for (const s of NEU) {
      expect(s.herkunft, s.slug).toBeDefined();
      expect(validateHerkunft(s.herkunft!), s.slug).toEqual([]);
    }
  });

  it("Zeichensatz des Bestands: keine Anführungszeichen, keine Ziffern", () => {
    for (const s of NEU)
      for (const l of serieLines(s)) {
        expect(l, `${s.slug}: ${l}`).not.toMatch(/[„“”"«»…–—0-9]/);
      }
  });

  it("kein ss, wo im Deutschen ein ß steht (die heisst-Falle beim Tier-Schreiben)", () => {
    // Beim Texten unter Tier 3 fehlt das ß — die Versuchung ist dann, »heisst«
    // oder »Strasse« zu schreiben. Das ist auf einer deutschen Tastatur schlicht
    // falsch; richtig ist, das Wort zu vermeiden.
    const FALSCH = /\b\w*(heisst|heissen|strasse|gross|grösse|fuss|weiss|schliesst|draussen)\w*\b/i;
    for (const s of SERIEN.filter((x) => (x.lang ?? "de") === "de"))
      for (const l of serieLines(s)) {
        expect(l, `${s.slug}: ${l}`).not.toMatch(FALSCH);
      }
  });
});

describe("Frühe Treppe — die Öffnung der Bücherei (der eigentliche Zweck)", () => {
  it("JEDE Altersstufe hat spätestens nach 13 Einheiten eine Geschichte", () => {
    const allowed = allowedAfter(13);
    for (const stufe of STUFEN) {
      const offen = serienForStufe(stufe, "de", "de").filter((s) => serieTypeable(s, allowed));
      expect(offen.length, `Stufe ${stufe} bei 13 Einheiten`).toBeGreaterThanOrEqual(1);
    }
  });

  it("vor dieser Charge war bei 13 Einheiten NICHTS offen (der Beleg dafür)", () => {
    const allowed = allowedAfter(13);
    const alt = SERIEN.filter(
      (s) => (s.lang ?? "de") === "de" && !SPAETER.some((n) => n.slug === s.slug),
    );
    expect(alt.filter((s) => serieTypeable(s, allowed))).toEqual([]);
    // …und die Grundmenge ist nicht leer, sonst prüfte der Test nichts:
    expect(alt.length).toBeGreaterThanOrEqual(26);
  });

  it("die Treppe steht: jede Stufe geht genau dort auf, wo sie dokumentiert ist", () => {
    // Stand NACH Charge O1 (21.08.2026): das `o` steht in `LETTER_ORDER` jetzt
    // direkt hinter dem `h`, das `c` rutscht dadurch von Einheit 17 auf 18.
    // Drei Serien dieser Datei öffnen darum eine Sprosse später (in Klammern
    // der Stand davor); die T2-MENGE bleibt gleich, also bleibt jedes `minTier`
    // unberührt. Begründung: `src/lib/typing/letters.ts` und
    // `src/lib/typing/serienOFolge.ts`.
    // ★ D-1 (28.09.2026): Punkt und Komma stehen jetzt direkt nach ⇧ (Einheit
    // 14) - jede Serie, die NACH ⇧ öffnet, öffnet zwei Einheiten später (in
    // Klammern der Stand vor D-1). Dieselben Buchstaben, dieselbe Menge.
    const ZIEL: Record<string, number> = {
      "das-nest-in-der-tanne": 13,
      "die-terrasse": 13,
      "der-hund-an-der-tankstelle": 19, // vor D-1: 17, vor O1: 16
      "die-nachtschicht": 20, // vor D-1: 18, vor O1: 17
      "der-igel-in-der-nacht": 21, // vor D-1: 19, vor O1: 18
      "der-garten-hinter-dem-haus": 22, // vor D-1: 20
      "nuri-hoert-mehr": 24, // vor D-1: 22
    };
    for (const s of SERIEN_FRUEH) {
      expect(opensAt(serieLines(s)), `${s.slug} öffnet zu spät oder zu früh`).toBe(ZIEL[s.slug]);
    }
    expect(Object.keys(ZIEL)).toHaveLength(SERIEN_FRUEH.length);
  });

  it("die Bücherei wächst danach schrittweise statt in einem Sprung", () => {
    // Vorher: 0 Serien bis n=21, dann ein Sprung. Jetzt muss der Bestand für
    // Kinder (b) an mindestens vier verschiedenen Stellen wachsen.
    const stufen = new Set<number>();
    let vorher = -1;
    for (let n = 2; n <= 31; n++) {
      const c = serienForStufe("teens", "de", "de").filter((s) => serieTypeable(s, allowedAfter(n))).length;
      if (c !== vorher) stufen.add(n);
      vorher = c;
    }
    expect(stufen.size, `Wachstumsstufen: ${[...stufen].join(",")}`).toBeGreaterThanOrEqual(5);
  });
});

describe("Bestand nach der Charge", () => {
  it("Erwachsene haben deutlich mehr Lesestoff als die zwölf Etappen von vorher", () => {
    const erw = serienForStufe("erwachsen", "de", "de");
    const etappen = erw.reduce((a, s) => a + serieEtappeCount(s), 0);
    expect(erw.length).toBeGreaterThanOrEqual(8);
    expect(etappen, `Etappen für Erwachsene: ${etappen}`).toBeGreaterThanOrEqual(32);
  });

  it("13–15 erbt nicht mehr nur von 10–12 (c ∩ erwachsen war 0)", () => {
    const de = SERIEN.filter((s) => (s.lang ?? "de") === "de");
    const geteilt = de.filter((s) => s.stufen.includes("teens") && s.stufen.includes("erwachsen"));
    expect(geteilt.length, geteilt.map((s) => s.slug).join(", ")).toBeGreaterThanOrEqual(5);
  });

  it("keine doppelten Slugs und keine doppelte Zeile in der ganzen Bücherei", () => {
    const slugs = SERIEN.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    const gesehen = new Map<string, string>();
    const dubletten: string[] = [];
    for (const s of SERIEN)
      for (const l of serieLines(s)) {
        // ★ W3 (30.10.2026): jede Schrift zählt - mit a-z wurde eine kyrillische oder griechische Zeile zur leeren Zeile und damit „doppelt".
        const k = l.toLowerCase().replace(/[^\p{L}0-9]+/gu, " ").trim();
        const vor = gesehen.get(k);
        if (vor) dubletten.push(`"${l}" (${s.slug} == ${vor})`);
        else gesehen.set(k, s.slug);
      }
    expect(dubletten).toEqual([]);
    expect(gesehen.size, "Grundmenge der geprüften Zeilen").toBeGreaterThan(2000);
  });
});
