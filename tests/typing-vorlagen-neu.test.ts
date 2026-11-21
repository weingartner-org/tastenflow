/**
 * ★★★ WÄCHTER: DIE NEUEN VORLAGEN - Fremdwörterkunde und Programmcode
 * (Auftrag Johannes, 21.09.2026).
 *
 * Johannes: *„Fremdwörterkunde als Vorlage für eigene Übungen - zuerst das
 * deutsche Wort (oder die Beschreibung), dann das Fremdwort, nur abtippen
 * … drei Altersstufen, die häufigsten Fremdwörter, auch für die Tippchallenge,
 * aber dann andere Dateien, anders geordnet - die Wörter bleiben die
 * gleichen"* und *„Programmcode … als Vorlage für die eigene Übung (andere
 * Codes als bei der Tippchallenge)"*.
 *
 * Was hier gemessen wird (nicht behauptet):
 *  1. Die Wörter: je Stufe vier Themen zu 20 Paaren, jede Zeile höchstens 40
 *     Zeichen, nur tippbare Zeichen, kein ß (die Tippchallenge verbietet es),
 *     kein Fremdwort in zwei Stufen.
 *  2. Die Challenge-Dateien tragen GENAU dieselben Wörter wie die Themen-
 *     Dateien - aber in anderen Dateien und in anderer Reihenfolge.
 *  3. Wer bekommt was: die Tippchallenge nie Programmcode, „Eigene Übung"
 *     nie die alphabetischen Dateien, englische Klassen keine Fremdwörter.
 *  4. Der Programmcode behält seine EINRÜCKUNG (`verarbeiteEigenenText` würde
 *     sie zerstören - die Gegenprobe steht dabei) und teilt keine Zeilen mit
 *     den Prüfungstexten der Tippchallenge.
 */
import { describe, expect, it } from "vitest";
import { FREMD_THEMEN, FREMDWOERTER } from "@/lib/typing/vorlagenDaten/fremdwoerter";
import { CODE_VORLAGEN } from "@/lib/typing/vorlagenDaten/programmcode";
import {
  FREMD_CHALLENGE_DATEIEN,
  fremdChallengePaare,
  fremdZeile,
  vorlageVorschau,
  vorlagenFuer,
  vorlageTitel,
} from "@/lib/typing/vorlagen";
import { verarbeiteEigenenText, verarbeiteFesteZeilen } from "@/lib/typing/eigenerText";
import { TEXTE as CODE_TEXTE } from "@/lib/typing/schreibproben/texteCode";

const STUFEN = ["kids", "teens", "erwachsen"] as const;
const ERLAUBT_FREMD = /^[A-Za-zÄÖÜäöü0-9 .,;:!?()'"-]+$/;

describe("★ Fremdwörterkunde: die Wörter", () => {
  it("vier Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(FREMD_THEMEN).toHaveLength(4);
    for (const s of STUFEN) {
      expect(FREMDWOERTER[s].map((t) => [t.id, t.titel]), s).toEqual(FREMD_THEMEN.map((t) => [t.id, t.titel]));
    }
  });

  it.each(STUFEN)("%s: je Thema genau 20 Paare, zusammen 80", (s) => {
    for (const t of FREMDWOERTER[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(20);
    expect(FREMDWOERTER[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it.each(STUFEN)("%s: jede Zeile höchstens 40 Zeichen, nur tippbare Zeichen, kein ß, sauberer Trenner", (s) => {
    for (const p of FREMDWOERTER[s].flatMap((t) => t.paare)) {
      const zeile = fremdZeile(p);
      expect(zeile.length, zeile).toBeLessThanOrEqual(40);
      expect(zeile, zeile).toMatch(ERLAUBT_FREMD);
      expect(zeile, zeile).not.toContain("ß");
      expect(zeile, zeile).not.toMatch(/ {2}|^ | $/);
      // Genau EIN Trenner - sonst ist nicht zu sehen, wo das Fremdwort beginnt.
      expect(zeile.split(" - "), zeile).toHaveLength(2);
      expect(p.fremd, zeile).not.toMatch(/[ -]/);
      expect(p.de.toLowerCase(), zeile).not.toContain(p.fremd.toLowerCase());
    }
  });

  it("kein Fremdwort doppelt - weder in einer Stufe noch über die Stufen hinweg", () => {
    const gesehen = new Map<string, string>();
    for (const s of STUFEN) {
      for (const p of FREMDWOERTER[s].flatMap((t) => t.paare)) {
        const schluessel = p.fremd.toLowerCase();
        expect(gesehen.has(schluessel), `${p.fremd} steht in ${gesehen.get(schluessel)} und in ${s}`).toBe(false);
        gesehen.set(schluessel, s);
      }
    }
  });
});

describe("★★ Fremdwörterkunde: Challenge-Dateien = dieselben Wörter, andere Dateien, andere Ordnung", () => {
  it.each(STUFEN)("%s: die drei Dateien tragen genau die 80 Wörter der vier Themen", (s) => {
    const themen = FREMDWOERTER[s].flatMap((t) => t.paare).map(fremdZeile).sort();
    const challenge = Array.from({ length: FREMD_CHALLENGE_DATEIEN }, (_, i) => fremdChallengePaare(s, i))
      .flat()
      .map(fremdZeile)
      .sort();
    expect(challenge).toEqual(themen);
  });

  it.each(STUFEN)("%s: die Dateien sind gleichmässig geteilt und in sich alphabetisch", (s) => {
    const dateien = Array.from({ length: FREMD_CHALLENGE_DATEIEN }, (_, i) => fremdChallengePaare(s, i));
    const groessen = dateien.map((d) => d.length);
    expect(Math.max(...groessen) - Math.min(...groessen)).toBeLessThanOrEqual(1);
    const alle = dateien.flat().map((p) => p.de);
    expect(alle).toEqual([...alle].sort((a, b) => a.localeCompare(b, "de")));
  });

  it.each(STUFEN)("%s: keine Challenge-Datei ist eine Themen-Datei, und die Reihenfolge ist eine andere", (s) => {
    const themen = FREMDWOERTER[s].map((t) => t.paare.map(fremdZeile).join("\n"));
    const themenReihenfolge = FREMDWOERTER[s].flatMap((t) => t.paare).map(fremdZeile);
    const challengeReihenfolge = Array.from({ length: FREMD_CHALLENGE_DATEIEN }, (_, i) => fremdChallengePaare(s, i))
      .flat()
      .map(fremdZeile);
    for (let i = 0; i < FREMD_CHALLENGE_DATEIEN; i++) {
      expect(themen).not.toContain(fremdChallengePaare(s, i).map(fremdZeile).join("\n"));
    }
    expect(challengeReihenfolge).not.toEqual(themenReihenfolge);
  });
});

describe("★ Wer bekommt was: Vorlagen nach Zweck und Sprache", () => {
  it("Tippchallenge: Lektionen + alphabetische Fremdwörter-Dateien - KEIN Programmcode, KEINE Themen-Dateien", () => {
    const ids = vorlagenFuer({ fuer: "challenge", lang: "de" }).map((v) => v.id);
    expect(ids.filter((i) => i.startsWith("fremdc-"))).toEqual(["fremdc-1", "fremdc-2", "fremdc-3"]);
    expect(ids.filter((i) => i.startsWith("code-"))).toEqual([]);
    expect(ids.filter((i) => i.startsWith("fremd-"))).toEqual([]);
    expect(ids.length).toBe(6 + FREMD_CHALLENGE_DATEIEN);
  });

  it("Eigene Übung: Lektionen + Themen-Dateien + zehn Programmcode-Vorlagen - KEINE alphabetischen Dateien", () => {
    const ids = vorlagenFuer({ fuer: "uebung", lang: "de" }).map((v) => v.id);
    expect(ids.filter((i) => i.startsWith("fremd-"))).toEqual(FREMD_THEMEN.map((t) => `fremd-${t.id}`));
    expect(ids.filter((i) => i.startsWith("code-"))).toHaveLength(10);
    expect(ids.filter((i) => i.startsWith("fremdc-"))).toEqual([]);
  });

  it("englische Klasse: keine Fremdwörterkunde (die Wörter sind deutsch), Programmcode und Lektionen bleiben", () => {
    const ids = vorlagenFuer({ fuer: "uebung", lang: "en" }).map((v) => v.id);
    expect(ids.some((i) => i.startsWith("fremd"))).toBe(false);
    expect(ids.filter((i) => i.startsWith("code-"))).toHaveLength(10);
    expect(vorlagenFuer({ fuer: "challenge", lang: "en" }).some((v) => v.id.startsWith("fremd"))).toBe(false);
  });

  it("jede Vorlage hat einen deutschen und einen englischen Namen", () => {
    for (const v of [...vorlagenFuer({ fuer: "uebung", lang: "de" }), ...vorlagenFuer({ fuer: "challenge", lang: "de" })]) {
      expect(vorlageTitel(v, "de").length, v.id).toBeGreaterThan(3);
      expect(vorlageTitel(v, "en").length, v.id).toBeGreaterThan(3);
    }
    const fremd = vorlagenFuer({ fuer: "uebung", lang: "de" }).find((v) => v.id === "fremd-schule")!;
    expect(vorlageTitel(fremd, "de")).toBe("Fremdwörterkunde: Schule und Lernen");
    expect(vorlageTitel(fremd, "en")).toBe("Foreign words: School and learning");
  });
});

describe("★ Die Vorschau der Fremdwörter: ein Paar = eine Zeile, nichts wird mitten im Paar umgebrochen", () => {
  it.each(STUFEN)("%s: Themen-Datei und Challenge-Datei geben ihre Paare unverändert als Zeilen", (s) => {
    for (const t of FREMDWOERTER[s]) {
      const v = vorlageVorschau(`fremd-${t.id}`, { stufe: s, lang: "de", verbietenSs: false });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(fremdZeile));
    }
    for (let i = 0; i < FREMD_CHALLENGE_DATEIEN; i++) {
      // Die Challenge verbietet ß - die Vorschau muss trotzdem sauber sein.
      const v = vorlageVorschau(`fremdc-${i + 1}`, { stufe: s, lang: "de", verbietenSs: true });
      expect(v?.zeilen).toEqual(fremdChallengePaare(s, i).map(fremdZeile));
      expect(v?.unbekannt).toEqual([]);
    }
  });

  it("ein altes Stufen-Etikett (a/b/c) wird wie im Konto übersetzt; englische Klasse bekommt nichts", () => {
    const alt = vorlageVorschau("fremd-schule", { stufe: "a", lang: "de", verbietenSs: false });
    const neu = vorlageVorschau("fremd-schule", { stufe: "kids", lang: "de", verbietenSs: false });
    expect(alt?.zeilen).toEqual(neu?.zeilen);
    expect(vorlageVorschau("fremd-schule", { stufe: "kids", lang: "en", verbietenSs: false })).toBeNull();
  });

  it("die Stufen unterscheiden sich wirklich", () => {
    const a = vorlageVorschau("fremd-schule", { stufe: "kids", lang: "de", verbietenSs: false })!.zeilen;
    const b = vorlageVorschau("fremd-schule", { stufe: "erwachsen", lang: "de", verbietenSs: false })!.zeilen;
    expect(a).not.toEqual(b);
  });
});

describe("★★ Programmcode-Vorlagen", () => {
  const SPRACHEN = ["Python", "JavaScript", "Java", "C", "C++", "C#", "TypeScript", "SQL", "Go", "Rust"];

  it("zehn Ausschnitte in der Reihenfolge der Tippchallenge-Texte, je mit Herkunft und Lizenz", () => {
    expect(CODE_VORLAGEN.map((c) => c.sprache)).toEqual(SPRACHEN);
    for (const c of CODE_VORLAGEN) {
      expect(c.id, c.sprache).toMatch(/^code-[a-z]+$/);
      expect(c.introDe, c.sprache).toContain(c.sprache);
      expect(c.introEn, c.sprache).toContain(c.sprache);
      for (const feld of ["projekt", "pfad", "zeilen", "lizenz", "url"] as const) {
        expect(c.quelle[feld].length, `${c.sprache}.${feld}`).toBeGreaterThan(0);
      }
      // Tastenflow-Code hat kein Remote: dort steht `git:<Commit>:<Pfad>`.
      expect(c.quelle.url, c.sprache).toMatch(/^(https:\/\/|git:[0-9a-f]{40}:)/);
    }
  });

  it("jede Zeile höchstens 40 Zeichen, tippbar, ohne Tabulator, Backslash, Backtick und Leerzeile", () => {
    for (const c of CODE_VORLAGEN) {
      expect(c.zeilen.length, c.sprache).toBeGreaterThanOrEqual(24);
      expect(c.zeilen.length, c.sprache).toBeLessThanOrEqual(34);
      for (const z of [c.introDe, c.introEn, ...c.zeilen]) {
        expect(z.length, `${c.sprache}: ${z}`).toBeLessThanOrEqual(40);
        expect(z, `${c.sprache}: ${z}`).toMatch(/^[\x20-\x7E]+$/);
        expect(z, `${c.sprache}: ${z}`).not.toMatch(/[\t\\`]/);
        expect(z.trim().length, `${c.sprache}: Leerzeile`).toBeGreaterThan(0);
        // Zwei Leerzeichen hintereinander sind nur als Einrückung erlaubt.
        expect(z.trimStart(), `${c.sprache}: ${z}`).not.toMatch(/ {2}/);
      }
    }
  });

  it("★ die Einrückung bleibt in der Vorschau - der Gegenbeweis: die Upload-Kette würde sie zerstören", () => {
    const python = CODE_VORLAGEN.find((c) => c.sprache === "Python")!;
    expect(python.zeilen.some((z) => z.startsWith("    ")), "Python ohne Einrückung?").toBe(true);
    const v = vorlageVorschau(python.id, { stufe: "teens", lang: "de", verbietenSs: false })!;
    expect(v.zeilen).toEqual([python.introDe, ...python.zeilen]);
    expect(v.unbekannt).toEqual([]);
    // Gegenprobe: derselbe Text durch die Upload-Kette verliert die Einrückung.
    const zerstoert = verarbeiteEigenenText([python.introDe, ...python.zeilen].join("\n"), { verbietenSs: false });
    expect(zerstoert.zeilen.some((z) => z.startsWith(" "))).toBe(false);
  });

  it("★ alle zehn Vorlagen sind vollständig tippbar - auch der Unterstrich (er steckt in fast jedem Bezeichner)", () => {
    // Gefunden am 21.09.2026 vom ersten Lauf dieses Wächters: `untippbareZeichen`
    // kannte `_` nicht (er steht nur im Niveau „Programmcode"), und wer trotz
    // der Warnung startet, bekäme jeden Bezeichner ohne Unterstrich.
    for (const c of CODE_VORLAGEN) {
      const v = vorlageVorschau(c.id, { stufe: "teens", lang: "de", verbietenSs: false })!;
      expect(v.unbekannt, c.sprache).toEqual([]);
      const v2 = vorlageVorschau(c.id, { stufe: "teens", lang: "en", verbietenSs: true })!;
      expect(v2.unbekannt, `${c.sprache} (englisch, Challenge-Regeln)`).toEqual([]);
    }
    expect(CODE_VORLAGEN.some((c) => c.zeilen.some((z) => z.includes("_"))), "kein Ausschnitt mit Unterstrich - der Wächter prüft dann nichts").toBe(true);
  });

  it("englische Klasse: die Einleitungszeile ist englisch", () => {
    const java = CODE_VORLAGEN.find((c) => c.sprache === "Java")!;
    const v = vorlageVorschau(java.id, { stufe: "teens", lang: "en", verbietenSs: false })!;
    expect(v.zeilen[0]).toBe(java.introEn);
  });

  it("★ kein Ausschnitt teilt mehr als zwei nennenswerte Zeilen mit einem Prüfungstext der Tippchallenge", () => {
    const pruefung = new Set(CODE_TEXTE.flatMap((t) => t.zeilen.map((z) => z.trim())).filter((z) => z.length >= 20));
    for (const c of CODE_VORLAGEN) {
      // Zeilen unter 20 Zeichen (`return true;`, `}`) kommen in jedem Quelltext vor - sie zählen nicht.
      const gleich = c.zeilen.map((z) => z.trim()).filter((z) => z.length >= 20 && pruefung.has(z));
      expect(gleich.length, `${c.sprache} teilt Zeilen mit der Tippchallenge: ${gleich.join(" | ")}`).toBeLessThanOrEqual(2);
    }
  });
});

describe("verarbeiteFesteZeilen", () => {
  it("behält Einrückung, bricht nichts um, überspringt Leerzeilen und meldet ß nur auf Wunsch", () => {
    const r = verarbeiteFesteZeilen(["def f(x):", "    return x", "", "        # Fuß"], { verbietenSs: true });
    expect(r.zeilen).toEqual(["def f(x):", "    return x", "        # Fuß"]);
    expect(r.unbekannt).toEqual(["ß"]);
    expect(verarbeiteFesteZeilen(["Fuß"], { verbietenSs: false }).unbekannt).toEqual([]);
    expect(r.zeichenGesamt).toBe("def f(x):".length + "    return x".length + "        # Fuß".length + 2);
  });
});
