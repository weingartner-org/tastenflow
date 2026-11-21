/**
 * ★★★ WÄCHTER: „Radici e prestiti" - die italienische Übungsvorlage (IT-S, 03.10.2026). Modell:
 * `tests/tastenflow-vorlage-raices.test.ts` (Spanisch).
 *
 * Gemessen wird:
 *  1. Fünf Themen, in allen Stufen dieselben; jedes Thema VOLL (20/15/15/15/15 = 80 je Stufe, 240
 *     zusammen).
 *  2. Jede Zeile `indizio - parola` höchstens 40 Zeichen, genau ein Trenner, nur Zeichen, die `it` UND
 *     `it-qzerty` tippen; kein grosser Akzentbuchstabe (Windows hat keinen).
 *  3. Einträge eindeutig - kein Wort zweimal, weder in einer Stufe noch über die Stufen hinweg.
 *  4. Kein Wort der Sperrliste `gesperrtIt` (Kern UND Wortbasis) - mit Gegenprobe.
 *  5. Jedes Paar trägt Herkunft und Beleg (it.wiktionary); Bezug zu Land und Sprache.
 *  6. Verdrahtung: nur Weg „it" mit Übungssprache „it" bekommt die Vorlage.
 */
import { describe, expect, it } from "vitest";
import {
  RADICI,
  RADICI_ALFABETICO,
  RADICI_TEMI,
  radiceZeile,
  type RadicePaar,
  type RadiceStufe,
} from "@/lib/typing/vorlagenDaten/radiciIt";
import { RADICI_CHALLENGE_DATEIEN, vorlageTitel, vorlageVorschau, vorlagenFuer } from "@/lib/typing/vorlagen";
import { gesperrtIt } from "@/lib/typing/sperrlisteIt";
import { layoutById, layoutIndex, type KeyboardLayout } from "@/lib/typing/layouts";

const STUFEN: RadiceStufe[] = ["kids", "teens", "erwachsen"];
const GROESSE: Readonly<Record<string, number>> = { "greco-latino": 20, arabo: 15, germanico: 15, lontano: 15, italia: 15 };
const ALLE = STUFEN.flatMap((s) => RADICI[s].flatMap((t) => t.paare));

/** Hat diese Tastatur einen Weg zu diesem Zeichen (eigene Taste oder Umschalt/Alt Gr)? Grossbuchstaben a-z über Maiusc. */
function tippbarAuf(layout: KeyboardLayout, c: string): boolean {
  if (c === " ") return true;
  const k = /^[A-Z]$/.test(c) ? c.toLowerCase() : c;
  if (layoutIndex(layout).missing.has(k)) return false;
  return layout.rows.some((r) => r.keys.includes(k)) || k in layout.access;
}
function untippbar(zeile: string, layout: KeyboardLayout): string[] {
  return [...zeile].filter((c) => !tippbarAuf(layout, c));
}

/** Jedes Wort der Zeile (Elisionen ganz) gegen die EINE Sperrliste des Weges. */
function gesperrt(zeile: string): string[] {
  return zeile
    .toLowerCase()
    .split(/[^a-zàèéìòù']+/)
    .filter((w) => w && gesperrtIt(w));
}

describe("★ Radici e prestiti: Themen voll, Zeilen sauber", () => {
  it("fünf Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(RADICI_TEMI).toHaveLength(5);
    for (const s of STUFEN) expect(RADICI[s].map((t) => [t.id, t.titel]), s).toEqual(RADICI_TEMI.map((t) => [t.id, t.titel]));
  });

  it.each(STUFEN)("%s: jedes Thema hat seine volle Grösse, zusammen 80", (s) => {
    for (const t of RADICI[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(GROESSE[t.id]);
    expect(RADICI[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => expect(ALLE).toHaveLength(240));

  it("jede Zeile: höchstens 40 Zeichen, genau ein Trenner, Wort klein und nicht im Hinweis", () => {
    const fehler: string[] = [];
    for (const p of ALLE) {
      const z = radiceZeile(p);
      if (z.length > 40) fehler.push(`zu lang: ${z}`);
      if (/ {2}|^ | $/.test(z)) fehler.push(`Leerzeichen: ${z}`);
      if (z.split(" - ").length !== 2 || /[ -]/.test(p.parola)) fehler.push(`Trenner: ${z}`);
      if (p.parola !== p.parola.toLowerCase()) fehler.push(`gross: ${z}`);
      if (p.indizio.toLowerCase().includes(p.parola)) fehler.push(`Wort im Hinweis: ${z}`);
    }
    expect(fehler).toEqual([]);
  });

  it("jede Zeile ist auf `it` UND `it-qzerty` tippbar; kein grosser Akzentbuchstabe, kein typografischer Apostroph", () => {
    const fehler: string[] = [];
    for (const id of ["it", "it-qzerty"] as const) {
      const l = layoutById(id);
      for (const p of ALLE) {
        const z = radiceZeile(p);
        const nicht = untippbar(z, l);
        if (nicht.length) fehler.push(`${id}: ${z} (${nicht.join("")})`);
      }
    }
    for (const p of ALLE) if (/[ÀÈÉÌÒÙ’‘“”–—]/.test(radiceZeile(p))) fehler.push(`Zeichen: ${radiceZeile(p)}`);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe Tippbarkeit: È, ñ und ’ fallen auf; { fehlt auf `it`, [ auf der QZERTY", () => {
    const it = layoutById("it");
    const qz = layoutById("it-qzerty");
    expect(untippbar("È così - perché", it)).toEqual(["È"]);
    expect(untippbar("año", it)).toEqual(["ñ"]);
    expect(untippbar("l’amico", qz)).toEqual(["’"]);
    expect(untippbar("{", it)).toEqual(["{"]);
    expect(untippbar("[", qz)).toEqual(["["]);
    expect(untippbar("città, perché, po'", it)).toEqual([]);
  });

  it("Einträge eindeutig: kein Wort doppelt, auch nicht über die Stufen hinweg", () => {
    const woerter = ALLE.map((p) => p.parola);
    expect(woerter.filter((w, i) => woerter.indexOf(w) !== i)).toEqual([]);
  });

  it("jedes Paar trägt Herkunft und Beleg an it.wiktionary", () => {
    for (const p of ALLE) {
      expect(p.origine, p.parola).toBeTruthy();
      expect(p.beleg, p.parola).toBe(`https://it.wiktionary.org/wiki/${p.parola}`);
    }
  });

  it("Bezug zu Land und Sprache: Dialekte von Nord bis Süd und Inseln, Alpen, Schweiz, Sprachen Amerikas", () => {
    const h = new Set(ALLE.map((p) => p.origine));
    for (const l of ["greco", "latino", "arabo", "longobardo", "gotico", "tedesco", "nahuatl", "quechua",
      "veneziano", "napoletano", "siciliano", "sardo", "ligure", "piemontese", "romancio"] as const)
      expect(h.has(l), l).toBe(true);
    const text = ALLE.map(radiceZeile).join(" ");
    for (const ort of ["Sicilia", "Sardegna", "Puglia", "Napoli", "Calabria", "Pantelleria", "Venezia", "Ticino", "Dolomiti", "Alto Adige", "Alpi"])
      expect(text, ort).toContain(ort);
  });

  it("Gegenprobe: ein Paar mit dem Wort im Hinweis, zu lang oder doppelt fiele auf", () => {
    const falsch: RadicePaar = { indizio: "il telefono di casa", parola: "telefono", origine: "greco", beleg: "x" };
    expect(falsch.indizio.toLowerCase().includes(falsch.parola)).toBe(true);
    expect(radiceZeile({ ...falsch, indizio: "un hinweis davvero troppo lungo per la riga" }).length).toBeGreaterThan(40);
    const mitDoppel = [...ALLE.map((p) => p.parola), "telefono"];
    expect(mitDoppel.filter((w, i) => mitDoppel.indexOf(w) !== i)).toEqual(["telefono"]);
  });
});

describe("★★ Keine Sperrwörter (Kern und Wortbasis)", () => {
  it("keine Zeile trägt ein Wort der Sperrliste - auch nicht in einer Elision", () => {
    expect(ALLE.flatMap((p) => gesperrt(radiceZeile(p)).map((w) => `${radiceZeile(p)}: ${w}`))).toEqual([]);
  });
  it("Gegenprobe: Kern-Stamm, Wortbasis und eine Elision werden gefunden", () => {
    expect(gesperrt("pallina di pasta e patate - gnocco")).toEqual(["patate"]);
    expect(gesperrt("una incazzatura - rabbia")).toEqual(["incazzatura"]);
    expect(gesperrt("dell'uccello - nido")).toEqual(["dell'uccello"]);
    expect(gesperrt("fiore bianco dell'arancio - zagara")).toEqual([]);
  });
});

describe("★★ Die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: eine Umordnung, italienisch sortiert, nicht die Themenfolge", (s) => {
    const temi = RADICI[s].flatMap((t) => t.paare).map(radiceZeile);
    expect([...RADICI_ALFABETICO[s]].sort()).toEqual([...temi].sort());
    const ind = RADICI_ALFABETICO[s].map((z) => z.split(" - ")[0]);
    expect(ind).toEqual([...ind].sort((a, b) => a.localeCompare(b, "it")));
    expect(RADICI_ALFABETICO[s]).not.toEqual(temi);
  });
});

describe("★★★ Verdrahtung: nur der italienische Lehrgang (Weg „it“, Übungssprache „it“)", () => {
  it("Eigene Übung: fünf Themen-Vorlagen; Sfida: drei alphabetische Dateien", () => {
    expect(vorlagenFuer({ fuer: "uebung", lang: "it" }).filter((v) => v.art === "radici").map((v) => v.id)).toEqual(
      RADICI_TEMI.map((t) => `parole-${t.id}`),
    );
    expect(vorlagenFuer({ fuer: "challenge", lang: "it" }).filter((v) => v.art === "radici")).toHaveLength(RADICI_CHALLENGE_DATEIEN);
  });

  it("Gegenprobe: de, en, fr, es sehen nie „Radici e prestiti“; Weg „it“ sieht weder raices noch racines", () => {
    for (const lang of ["de", "en", "fr", "es", "pl", "tr", "cs"] as const)
      for (const fuer of ["uebung", "challenge"] as const)
        expect(vorlagenFuer({ fuer, lang }).filter((v) => v.art === "radici"), `${lang}/${fuer}`).toEqual([]);
    for (const fuer of ["uebung", "challenge"] as const)
      expect(vorlagenFuer({ fuer, lang: "it" }).filter((v) => v.art === "raices" || v.art === "racines")).toEqual([]);
  });

  it.each(STUFEN)("%s: die Vorschau gibt die Paare unverändert; die Sfida-Dateien zusammen die ganze Liste", (s) => {
    for (const t of RADICI[s]) {
      const v = vorlageVorschau(`parole-${t.id}`, { stufe: s, lang: "it", verbietenSs: false, lernweg: "it" });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(radiceZeile));
    }
    const zusammen: string[] = [];
    for (let i = 1; i <= RADICI_CHALLENGE_DATEIEN; i++)
      zusammen.push(...(vorlageVorschau(`parolec-${i}`, { stufe: s, lang: "it", verbietenSs: false, lernweg: "it" })?.zeilen ?? []));
    expect(zusammen).toEqual(RADICI_ALFABETICO[s]);
  });

  it("Gegenprobe: falscher Weg oder falsche Übungssprache gibt null, unbekannte Datei auch", () => {
    expect(vorlageVorschau("parole-arabo", { stufe: "kids", lang: "it", verbietenSs: false, lernweg: "es" })).toBeNull();
    expect(vorlageVorschau("parole-arabo", { stufe: "kids", lang: "en", verbietenSs: false, lernweg: "it" })).toBeNull();
    expect(vorlageVorschau("parolec-9", { stufe: "kids", lang: "it", verbietenSs: false, lernweg: "it" })).toBeNull();
    expect(vorlageVorschau("parole-gibtsnicht", { stufe: "kids", lang: "it", verbietenSs: false, lernweg: "it" })).toBeNull();
  });

  it("jede Vorlage hat Namen in allen acht Bedienungssprachen, italienisch = Titel der Daten", () => {
    for (const v of [...vorlagenFuer({ fuer: "uebung", lang: "it" }), ...vorlagenFuer({ fuer: "challenge", lang: "it" })].filter((x) => x.art === "radici")) {
      for (const b of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const) expect(vorlageTitel(v, b), `${v.id}/${b}`).toBeTruthy();
      if (v.id.startsWith("parole-")) expect(vorlageTitel(v, "it")).toBe(RADICI_TEMI.find((t) => `parole-${t.id}` === v.id)?.titel);
    }
  });
});
