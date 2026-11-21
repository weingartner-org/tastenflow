/**
 * ★★★ WÄCHTER: „D'où viennent les mots ?" - die französische Übungsvorlage
 * (E10a, 25.09.2026, Bauplan §6.6). Modell: `tests/tastenflow-vorlage-word-roots.test.ts`
 * (Word roots), selbst nach `tests/typing-vorlagen-neu.test.ts` (Fremdwörterkunde) modelliert.
 *
 * Was hier gemessen wird (nicht behauptet):
 *  1. Vier Themen, in allen drei Stufen mit derselben Kennung und demselben
 *     Titel; die Grössen sind NICHT gleich (25/25/20/10, siehe Kopfkommentar
 *     von `racines.ts`) - macht 80 je Stufe und 240 insgesamt.
 *  2. Jede Zeile (`indice - mot`) höchstens 40 Zeichen (Braillezeile), nur
 *     Buchstaben (inkl. französischer Akzente), Ziffern, Leerzeichen, der
 *     gerade Apostroph und der echte Bindestrich als Trenner - kein
 *     Gedankenstrich, keine geschwungenen Anführungszeichen.
 *  3. `mot` ist ein Einzelwort ohne Bindestrich/Leerzeichen; `indice` enthält
 *     das Wort nicht.
 *  4. Kein Wort kommt zweimal vor - weder in einer Stufe noch stufenübergreifend.
 *  5. Jedes Paar trägt `herkunft` UND einen `beleg` (Wiktionnaire-Adresse).
 *  6. `RACINES_ALPHABETISCH` trägt je Stufe GENAU dieselben 80 Zeilen wie
 *     `RACINES`, nur alphabetisch nach `indice` geordnet.
 */
import { describe, expect, it } from "vitest";
import {
  RACINES,
  RACINES_ALPHABETISCH,
  RACINES_THEMEN,
  racineZeile,
  type RacineStufe,
} from "@/lib/typing/vorlagenDaten/racines";

const STUFEN: RacineStufe[] = ["kids", "teens", "erwachsen"];

/** Grösse je Thema - siehe Kopfkommentar von `racines.ts` (25/25/20/10 = 80). */
const THEMA_GROESSE: Readonly<Record<string, number>> = {
  "racines-1": 25,
  "racines-2": 25,
  ailleurs: 20,
  "chez-nous": 10,
};

// Buchstaben inkl. der französischen Akzente/Ligaturen, Ziffern, Leerzeichen,
// der gerade Apostroph und der echte Bindestrich (nur als Trenner geprüft,
// siehe unten). Kein Gedankenstrich, keine geschwungenen Anführungszeichen,
// kein Auslassungspunkt - die kommen in keinem der 240 Wörter/Hinweise vor.
const ERLAUBT = /^[A-Za-zÀ-ÖØ-öø-ÿŒœ0-9 '-]+$/;

describe("★ D'où viennent les mots ?: die Wörter", () => {
  it("vier Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(RACINES_THEMEN).toHaveLength(4);
    for (const s of STUFEN) {
      expect(RACINES[s].map((t) => [t.id, t.titel]), s).toEqual(
        RACINES_THEMEN.map((t) => [t.id, t.titel]),
      );
    }
  });

  it.each(STUFEN)("%s: jedes Thema hat seine feste Grösse, zusammen 80", (s) => {
    for (const t of RACINES[s]) {
      expect(t.paare, `${s}/${t.id}`).toHaveLength(THEMA_GROESSE[t.id]);
    }
    expect(RACINES[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => {
    expect(STUFEN.flatMap((s) => RACINES[s].flatMap((t) => t.paare))).toHaveLength(240);
  });

  it.each(STUFEN)("%s: jede Zeile höchstens 40 Zeichen, nur tippbare Zeichen, sauberer Trenner", (s) => {
    for (const p of RACINES[s].flatMap((t) => t.paare)) {
      const zeile = racineZeile(p);
      expect(zeile.length, zeile).toBeLessThanOrEqual(40);
      expect(zeile, zeile).toMatch(ERLAUBT);
      expect(zeile, zeile).not.toMatch(/ {2}|^ | $/);
      // Genau EIN Trenner - sonst ist nicht zu sehen, wo das Wort beginnt.
      expect(zeile.split(" - "), zeile).toHaveLength(2);
      expect(p.mot, zeile).not.toMatch(/[ -]/);
      expect(p.indice.toLowerCase(), zeile).not.toContain(p.mot.toLowerCase());
    }
  });

  it("kein Wort doppelt - weder in einer Stufe noch über die Stufen hinweg", () => {
    const gesehen = new Map<string, string>();
    for (const s of STUFEN) {
      for (const p of RACINES[s].flatMap((t) => t.paare)) {
        const schluessel = p.mot.toLowerCase();
        expect(gesehen.has(schluessel), `${p.mot} steht in ${gesehen.get(schluessel)} und in ${s}`).toBe(
          false,
        );
        gesehen.set(schluessel, s);
      }
    }
  });

  it.each(STUFEN)("%s: jedes Paar trägt eine Herkunft UND einen geprüften Beleg", (s) => {
    for (const p of RACINES[s].flatMap((t) => t.paare)) {
      expect(p.herkunft, racineZeile(p)).toBeTruthy();
      expect(p.beleg, racineZeile(p)).toMatch(/^https:\/\/fr\.wiktionary\.org\/wiki\//);
    }
  });
});

describe("★★ D'où viennent les mots ?: die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: RACINES_ALPHABETISCH ist eine Umordnung von RACINES, keine andere Menge", (s) => {
    const themen = RACINES[s].flatMap((t) => t.paare).map(racineZeile).sort();
    const alphabetisch = [...RACINES_ALPHABETISCH[s]].sort();
    expect(alphabetisch).toEqual(themen);
  });

  it.each(STUFEN)("%s: RACINES_ALPHABETISCH ist wirklich alphabetisch (nach indice) geordnet", (s) => {
    const zeilen = RACINES_ALPHABETISCH[s];
    const indices = zeilen.map((z) => z.split(" - ")[0]);
    expect(indices).toEqual([...indices].sort((a, b) => a.localeCompare(b, "fr")));
  });

  it.each(STUFEN)("%s: die alphabetische Liste ist eine andere Reihenfolge als die Themen-Liste", (s) => {
    const themenReihenfolge = RACINES[s].flatMap((t) => t.paare).map(racineZeile);
    expect(RACINES_ALPHABETISCH[s]).not.toEqual(themenReihenfolge);
  });
});
