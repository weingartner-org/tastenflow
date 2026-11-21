/**
 * ★★★ WÄCHTER: „Korzenie i zapożyczenia" - die polnische Übungsvorlage (PL-W, 09.10.2026). Modell:
 * `tests/tastenflow-vorlage-radici-it.test.ts` (Italienisch).
 *
 * Gemessen wird:
 *  1. Fünf Themen, in allen Stufen dieselben; jedes Thema VOLL (20/15/15/15/15 = 80 je Stufe, 240 zusammen).
 *  2. Jede Zeile `wskazówka - słowo` höchstens 40 Zeichen, genau ein Trenner, nur Zeichen, die `pl` tippt; die Regeln
 *     für JEDE polnische Textzeile (`zeilenFehler`: nur gerade Anführung, nur Bindestrich, Sperrstämme).
 *  3. Einträge eindeutig - kein Wort zweimal, weder in einer Stufe noch über die Stufen hinweg.
 *  4. Kein Wort der Sperrliste `gesperrtPl` (Kern UND Wortbasis) - mit Gegenprobe.
 *  5. Jedes Paar trägt Herkunft und Prüfseite (pl.wiktionary); Bezug zu Land und Sprache.
 *  6. Verdrahtung: nur Weg „pl" mit Übungssprache „pl" bekommt die Vorlage.
 */
import { describe, expect, it } from "vitest";
import {
  KORZENIE,
  KORZENIE_ALFABETYCZNIE,
  KORZENIE_TEMATY,
  korzenZeile,
  type KorzenPaar,
  type KorzenStufe,
} from "@/lib/typing/vorlagenDaten/korzeniePl";
import { KORZENIE_CHALLENGE_DATEIEN, vorlageTitel, vorlageVorschau, vorlagenFuer } from "@/lib/typing/vorlagen";
import { gesperrtPl } from "@/lib/typing/sperrlistePl";
import { layoutById, layoutIndex, type KeyboardLayout } from "@/lib/typing/layouts";
import { zeilenFehler } from "./helfer/plTextRegeln";

const STUFEN: KorzenStufe[] = ["kids", "teens", "erwachsen"];
const GROESSE: Readonly<Record<string, number>> = { "greka-lacina": 20, niemiecki: 15, francuski: 15, dalekie: 15, slowotworstwo: 15 };
const ALLE = STUFEN.flatMap((s) => KORZENIE[s].flatMap((t) => t.paare));

/** Hat diese Tastatur einen Weg zu diesem Zeichen (eigene Taste oder Umschalt/AltGr)? Grossbuchstaben über Umschalt. */
function tippbarAuf(layout: KeyboardLayout, c: string): boolean {
  if (c === " ") return true;
  const k = c.toLowerCase() !== c ? c.toLowerCase() : c;
  if (layoutIndex(layout).missing.has(k)) return false;
  return layout.rows.some((r) => r.keys.includes(k)) || k in layout.access;
}
function untippbar(zeile: string, layout: KeyboardLayout): string[] {
  return [...zeile].filter((c) => !tippbarAuf(layout, c));
}

/** Jedes Wort der Zeile gegen die EINE Sperrliste des Weges. */
function gesperrt(zeile: string): string[] {
  return zeile
    .toLowerCase()
    .split(/[^a-ząćęłńóśźż']+/)
    .filter((w) => w && gesperrtPl(w));
}

describe("★ Korzenie i zapożyczenia: Themen voll, Zeilen sauber", () => {
  it("fünf Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(KORZENIE_TEMATY).toHaveLength(5);
    for (const s of STUFEN)
      expect(KORZENIE[s].map((t) => [t.id, t.titel]), s).toEqual(KORZENIE_TEMATY.map((t) => [t.id, t.titel]));
  });

  it.each(STUFEN)("%s: jedes Thema hat seine volle Grösse, zusammen 80", (s) => {
    for (const t of KORZENIE[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(GROESSE[t.id]);
    expect(KORZENIE[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => expect(ALLE).toHaveLength(240));

  it("jede Zeile: höchstens 40 Zeichen, genau ein Trenner, Wort klein und nicht im Hinweis", () => {
    const fehler: string[] = [];
    for (const p of ALLE) {
      const z = korzenZeile(p);
      if (z.length > 40) fehler.push(`zu lang: ${z}`);
      if (/ {2}|^ | $/.test(z)) fehler.push(`Leerzeichen: ${z}`);
      if (z.split(" - ").length !== 2 || /[ -]/.test(p.slowo)) fehler.push(`Trenner: ${z}`);
      if (p.slowo !== p.slowo.toLowerCase()) fehler.push(`gross: ${z}`);
      if (p.wskazowka.toLowerCase().includes(p.slowo)) fehler.push(`Wort im Hinweis: ${z}`);
    }
    expect(fehler).toEqual([]);
  });

  it("jede Zeile besteht die Regeln für polnische Textzeilen (gerade Anführung, nur Bindestrich, keine Sperrstämme)", () => {
    expect(ALLE.flatMap((p) => zeilenFehler(korzenZeile(p)).map((f) => `${korzenZeile(p)}: ${f}`))).toEqual([]);
  });

  it("jede Zeile ist auf der Tastatur `pl` tippbar - die neun polnischen Buchstaben über AltGr", () => {
    const l = layoutById("pl");
    const fehler: string[] = [];
    for (const p of ALLE) {
      const nicht = untippbar(korzenZeile(p), l);
      if (nicht.length) fehler.push(`${korzenZeile(p)} (${nicht.join("")})`);
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe Tippbarkeit: ä, é und ’ fallen auf; die polnischen Buchstaben nicht", () => {
    const l = layoutById("pl");
    expect(untippbar("Käse - ser", l)).toEqual(["ä"]);
    expect(untippbar("café - kawa", l)).toEqual(["é"]);
    expect(untippbar("Braille’a", l)).toEqual(["’"]);
    expect(untippbar("zażółć gęślą jaźń", l)).toEqual([]);
  });

  it("Einträge eindeutig: kein Wort doppelt, auch nicht über die Stufen hinweg", () => {
    const woerter = ALLE.map((p) => p.slowo);
    expect(woerter.filter((w, i) => woerter.indexOf(w) !== i)).toEqual([]);
  });

  it("jedes Paar trägt Herkunft und Prüfseite an pl.wiktionary", () => {
    for (const p of ALLE) {
      expect(p.origine, p.slowo).toBeTruthy();
      expect(p.beleg, p.slowo).toBe(`https://pl.wiktionary.org/wiki/${p.slowo}`);
    }
  });

  it("Bezug zu Land und Sprache: Sprachen der Nachbarn und Fernen, Wortbildung, Orte Polens in den Hinweisen", () => {
    const h = new Set(ALLE.map((p) => p.origine));
    for (const l of ["greka", "łacina", "niemiecki", "francuski", "angielski", "turecki", "węgierski", "czeski", "japoński",
      "keczua", "zdrobnienie", "złożenie", "pochodne"] as const)
      expect(h.has(l), l).toBe(true);
    const text = ALLE.map(korzenZeile).join(" ");
    for (const ort of ["Krak", "Bałtyk", "Krutyn", "Tatr", "Węgier"]) expect(text, ort).toContain(ort);
  });

  it("Hausregeln: keine Anrede Pan/Pani, kein Geschlecht der tippenden Person (keine Vergangenheitsform auf -łeś/-łaś)", () => {
    const text = ALLE.map(korzenZeile).join("\n");
    expect(text).not.toMatch(/\bPan(i|ie)?\b/);
    expect(text).not.toMatch(/\b\p{L}+(łeś|łaś|liście|łyście)\b/u);
  });

  it("Gegenprobe: ein Paar mit dem Wort im Hinweis, zu lang oder doppelt fiele auf", () => {
    const falsch: KorzenPaar = { wskazowka: "telefon w domu", slowo: "telefon", origine: "greka", beleg: "x" };
    expect(falsch.wskazowka.toLowerCase().includes(falsch.slowo)).toBe(true);
    expect(korzenZeile({ ...falsch, wskazowka: "bardzo długi hinweis, który nie zmieści się w wierszu" }).length).toBeGreaterThan(40);
    const mitDoppel = [...ALLE.map((p) => p.slowo), "telefon"];
    expect(mitDoppel.filter((w, i) => mitDoppel.indexOf(w) !== i)).toEqual(["telefon"]);
  });
});

describe("★★ Keine Sperrwörter (Kern und Wortbasis)", () => {
  it("keine Zeile trägt ein Wort der Sperrliste", () => {
    expect(ALLE.flatMap((p) => gesperrt(korzenZeile(p)).map((w) => `${korzenZeile(p)}: ${w}`))).toEqual([]);
  });
  it("Gegenprobe: Kern-Wort, Wortbasis und die Schreibung ohne Ogonki werden gefunden", () => {
    expect(gesperrt("ale kurwa - dzień")).toEqual(["kurwa"]);
    expect(gesperrt("diabeł w bajce - czart")).toEqual(["diabeł"]);
    expect(gesperrt("ten gowno - x")).toEqual(["gowno"]);
    expect(gesperrt("złoto znad Bałtyku - bursztyn")).toEqual([]);
  });
});

describe("★★ Die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: eine Umordnung, polnisch sortiert, nicht die Themenfolge", (s) => {
    const temy = KORZENIE[s].flatMap((t) => t.paare).map(korzenZeile);
    expect([...KORZENIE_ALFABETYCZNIE[s]].sort()).toEqual([...temy].sort());
    const ind = KORZENIE_ALFABETYCZNIE[s].map((z) => z.split(" - ")[0]);
    expect(ind).toEqual([...ind].sort((a, b) => a.localeCompare(b, "pl")));
    expect(KORZENIE_ALFABETYCZNIE[s]).not.toEqual(temy);
  });
});

describe("★★★ Verdrahtung: nur der polnische Lehrgang (Weg „pl“, Übungssprache „pl“)", () => {
  it("Eigene Übung: fünf Themen-Vorlagen; Wyzwanie: drei alphabetische Dateien", () => {
    expect(vorlagenFuer({ fuer: "uebung", lang: "pl" }).filter((v) => v.art === "korzenie").map((v) => v.id)).toEqual(
      KORZENIE_TEMATY.map((t) => `slowa-${t.id}`),
    );
    expect(vorlagenFuer({ fuer: "challenge", lang: "pl" }).filter((v) => v.art === "korzenie")).toHaveLength(
      KORZENIE_CHALLENGE_DATEIEN,
    );
  });

  it("Gegenprobe: de, en, fr, es, it, tr, cs sehen nie „Korzenie“; Weg „pl“ sieht weder radici noch raices noch racines", () => {
    for (const lang of ["de", "en", "fr", "es", "it", "tr", "cs"] as const)
      for (const fuer of ["uebung", "challenge"] as const)
        expect(vorlagenFuer({ fuer, lang }).filter((v) => v.art === "korzenie"), `${lang}/${fuer}`).toEqual([]);
    for (const fuer of ["uebung", "challenge"] as const)
      expect(vorlagenFuer({ fuer, lang: "pl" }).filter((v) => ["radici", "raices", "racines"].includes(v.art))).toEqual([]);
  });

  it.each(STUFEN)("%s: die Vorschau gibt die Paare unverändert; die Wyzwanie-Dateien zusammen die ganze Liste", (s) => {
    for (const t of KORZENIE[s]) {
      const v = vorlageVorschau(`slowa-${t.id}`, { stufe: s, lang: "pl", verbietenSs: false, lernweg: "pl" });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(korzenZeile));
    }
    const zusammen: string[] = [];
    for (let i = 1; i <= KORZENIE_CHALLENGE_DATEIEN; i++)
      zusammen.push(...(vorlageVorschau(`slowac-${i}`, { stufe: s, lang: "pl", verbietenSs: false, lernweg: "pl" })?.zeilen ?? []));
    expect(zusammen).toEqual(KORZENIE_ALFABETYCZNIE[s]);
  });

  it("Gegenprobe: falscher Weg oder falsche Übungssprache gibt null, unbekannte Datei auch", () => {
    expect(vorlageVorschau("slowa-niemiecki", { stufe: "kids", lang: "pl", verbietenSs: false, lernweg: "es" })).toBeNull();
    expect(vorlageVorschau("slowa-niemiecki", { stufe: "kids", lang: "en", verbietenSs: false, lernweg: "pl" })).toBeNull();
    expect(vorlageVorschau("slowac-9", { stufe: "kids", lang: "pl", verbietenSs: false, lernweg: "pl" })).toBeNull();
    expect(vorlageVorschau("slowa-gibtsnicht", { stufe: "kids", lang: "pl", verbietenSs: false, lernweg: "pl" })).toBeNull();
  });

  it("jede Vorlage hat Namen in allen acht Bedienungssprachen, polnisch = Titel der Daten", () => {
    for (const v of [...vorlagenFuer({ fuer: "uebung", lang: "pl" }), ...vorlagenFuer({ fuer: "challenge", lang: "pl" })].filter(
      (x) => x.art === "korzenie",
    )) {
      for (const b of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const) expect(vorlageTitel(v, b), `${v.id}/${b}`).toBeTruthy();
      if (v.id.startsWith("slowa-")) expect(vorlageTitel(v, "pl")).toBe(KORZENIE_TEMATY.find((t) => `slowa-${t.id}` === v.id)?.titel);
    }
  });
});
