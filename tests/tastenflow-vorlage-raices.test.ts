/**
 * ★★★ WÄCHTER: „Raíces y préstamos" - die spanische Übungsvorlage (ES-S,
 * 27.09.2026, Bauplan spanischer Lehrgang §5.1). Modell:
 * `tests/tastenflow-vorlage-racines.test.ts` und `…-racines-wiring.test.ts`.
 *
 * Gemessen wird:
 *  1. Vier Themen, in allen Stufen dieselben; jedes Thema VOLL (25/15/25/15 =
 *     80 je Stufe, 240 zusammen).
 *  2. Jede Zeile `indicio - palabra` höchstens 40 Zeichen, genau ein Trenner,
 *     nur Zeichen mit einer Taste (oder Totaste + Vokal) auf ES UND LatAm.
 *  3. Einträge eindeutig - kein Wort zweimal, weder in einer Stufe noch über
 *     die Stufen hinweg.
 *  4. Kein Sperrwort (Liste aus `scripts/messe-worthaeufigkeit-es.py`), kein
 *     vosotros, keine alte RAE-Form - mit Gegenprobe.
 *  5. Jedes Paar trägt Herkunft und Beleg (es.wiktionary).
 *  6. Verdrahtung: nur Weg „es" mit Übungssprache „es" bekommt die Vorlage.
 */
import { describe, expect, it } from "vitest";
import {
  RAICES,
  RAICES_ALPHABETISCH,
  RAICES_THEMEN,
  raizZeile,
  type RaizStufe,
} from "@/lib/typing/vorlagenDaten/raices";
import { RAICES_CHALLENGE_DATEIEN, vorlageTitel, vorlageVorschau, vorlagenFuer } from "@/lib/typing/vorlagen";

const STUFEN: RaizStufe[] = ["kids", "teens", "erwachsen"];
const GROESSE: Readonly<Record<string, number>> = { "griego-latin": 25, arabe: 15, america: 25, prestamos: 15 };
const ALLE = STUFEN.flatMap((s) => RAICES[s].flatMap((t) => t.paare));

/** Buchstaben des Spanischen (á é í ó ú über die Totaste ´, ü über ¨), Leerzeichen, Komma, Trenner. */
const ERLAUBT = /^[a-zñáéíóúüA-ZÑÁÉÍÓÚÜ ,-]+$/;

/** Sperrliste wie `scripts/messe-worthaeufigkeit-es.py` (Stämme + genaue Wörter). */
const SPERR_STAEMME = [
  "coj", "cog", "concha", "poll", "papay", "pico", "paja", "chaquet", "bich", "cach", "pendej", "culo",
  "verga", "jod", "coñ", "cabron", "cabrón", "pinche", "ching", "huevon", "huevón", "bolud", "mamad", "cipote",
];
const SPERR_WOERTER = new Set([
  "sólo", "éste", "ésta", "éstos", "éstas", "ése", "ésa", "aquél", "guión", "os", "vosotros", "vosotras",
  "vuestro", "vuestra", "sois", "coche", "coches", "patinete", "ordenador", "móvil", "zumo", "gafas", "vale",
  "tío", "tía", "tíos", "guay", "chulo", "mola", "currar", "tonto", "tonta", "tontos", "feo", "fea", "gordo",
  "gorda", "idiota", "estúpido",
]);
function gesperrt(zeile: string): string[] {
  return zeile
    .toLowerCase()
    .split(/[^a-zñáéíóúü]+/)
    .filter((w) => w && (SPERR_WOERTER.has(w) || SPERR_STAEMME.some((s) => w.includes(s)) || /(áis|éis)$/.test(w)));
}

describe("★ Raíces y préstamos: Themen voll, Zeilen sauber", () => {
  it("vier Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(RAICES_THEMEN).toHaveLength(4);
    for (const s of STUFEN) expect(RAICES[s].map((t) => [t.id, t.titel]), s).toEqual(RAICES_THEMEN.map((t) => [t.id, t.titel]));
  });

  it.each(STUFEN)("%s: jedes Thema hat seine volle Grösse, zusammen 80", (s) => {
    for (const t of RAICES[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(GROESSE[t.id]);
    expect(RAICES[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => expect(ALLE).toHaveLength(240));

  it("jede Zeile: höchstens 40 Zeichen, tippbare Zeichen, genau ein Trenner, Wort nicht im Hinweis", () => {
    const fehler: string[] = [];
    for (const p of ALLE) {
      const z = raizZeile(p);
      if (z.length > 40) fehler.push(`zu lang: ${z}`);
      if (!ERLAUBT.test(z) || / {2}|^ | $/.test(z)) fehler.push(`Zeichen: ${z}`);
      if (z.split(" - ").length !== 2 || /[ -]/.test(p.palabra)) fehler.push(`Trenner: ${z}`);
      if (p.indicio.toLowerCase().includes(p.palabra.toLowerCase())) fehler.push(`Wort im Hinweis: ${z}`);
    }
    expect(fehler).toEqual([]);
  });

  it("Einträge eindeutig: kein Wort doppelt, auch nicht über die Stufen hinweg", () => {
    const woerter = ALLE.map((p) => p.palabra.toLowerCase());
    expect(woerter.filter((w, i) => woerter.indexOf(w) !== i)).toEqual([]);
  });

  it("jedes Paar trägt Herkunft und Beleg an es.wiktionary", () => {
    for (const p of ALLE) {
      expect(p.herkunft, p.palabra).toBeTruthy();
      expect(p.beleg, p.palabra).toBe(`https://es.wiktionary.org/wiki/${p.palabra}`);
    }
  });

  it("Bezug zu Land und Sprache: jede Sprache Amerikas aus dem Bauplan ist vertreten", () => {
    const h = new Set(ALLE.map((p) => p.herkunft));
    for (const l of ["nahuatl", "quechua", "aimara", "taino", "guarani", "mapudungun", "arabe", "vasco"] as const) expect(h.has(l), l).toBe(true);
  });
});

describe("★★ Keine Sperrwörter, kein vosotros, RAE 2010", () => {
  it("keine Zeile trägt ein Wort der Sperrliste - auch nicht als Teil eines Wortes", () => {
    expect(ALLE.flatMap((p) => gesperrt(raizZeile(p)).map((w) => `${raizZeile(p)}: ${w}`))).toEqual([]);
  });
  it("Gegenprobe: ein Sperrwort, ein Stamm in einem Wort und eine vosotros-Form werden gefunden", () => {
    expect(gesperrt("raíz que se come - tubérculo")).toEqual(["tubérculo"]);
    expect(gesperrt("aquí sólo coche")).toEqual(["sólo", "coche"]);
    expect(gesperrt("vosotros cantáis")).toEqual(["vosotros", "cantáis"]);
  });
});

describe("★★ Die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: eine Umordnung, spanisch sortiert (ñ nach n), nicht die Themenfolge", (s) => {
    const themen = RAICES[s].flatMap((t) => t.paare).map(raizZeile);
    expect([...RAICES_ALPHABETISCH[s]].sort()).toEqual([...themen].sort());
    const ind = RAICES_ALPHABETISCH[s].map((z) => z.split(" - ")[0]);
    expect(ind).toEqual([...ind].sort((a, b) => a.localeCompare(b, "es")));
    expect(RAICES_ALPHABETISCH[s]).not.toEqual(themen);
  });
});

describe("★★★ Verdrahtung: nur der spanische Lehrgang (Weg „es“, Übungssprache „es“)", () => {
  it("Eigene Übung: vier Themen-Vorlagen; Reto: drei alphabetische Dateien", () => {
    expect(vorlagenFuer({ fuer: "uebung", lang: "es" }).filter((v) => v.art === "raices").map((v) => v.id)).toEqual(
      RAICES_THEMEN.map((t) => `palabras-${t.id}`),
    );
    expect(vorlagenFuer({ fuer: "challenge", lang: "es" }).filter((v) => v.art === "raices")).toHaveLength(RAICES_CHALLENGE_DATEIEN);
  });

  it("Gegenprobe: de, en und fr sehen nie „Raíces y préstamos“; Weg „es“ sieht keine racines", () => {
    for (const lang of ["de", "en", "fr"] as const)
      for (const fuer of ["uebung", "challenge"] as const)
        expect(vorlagenFuer({ fuer, lang }).filter((v) => v.art === "raices"), `${lang}/${fuer}`).toEqual([]);
    expect(vorlagenFuer({ fuer: "uebung", lang: "es" }).filter((v) => v.art === "racines")).toEqual([]);
  });

  it.each(STUFEN)("%s: die Vorschau gibt die Paare unverändert; die Reto-Dateien zusammen die ganze Liste", (s) => {
    for (const t of RAICES[s]) {
      const v = vorlageVorschau(`palabras-${t.id}`, { stufe: s, lang: "es", verbietenSs: false, lernweg: "es" });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(raizZeile));
    }
    const zusammen: string[] = [];
    for (let i = 1; i <= RAICES_CHALLENGE_DATEIEN; i++)
      zusammen.push(...(vorlageVorschau(`palabrasc-${i}`, { stufe: s, lang: "es", verbietenSs: false, lernweg: "es" })?.zeilen ?? []));
    expect(zusammen).toEqual(RAICES_ALPHABETISCH[s]);
  });

  it("Gegenprobe: falscher Weg oder falsche Übungssprache gibt null, unbekannte Datei auch", () => {
    expect(vorlageVorschau("palabras-arabe", { stufe: "kids", lang: "es", verbietenSs: false, lernweg: "fr" })).toBeNull();
    expect(vorlageVorschau("palabras-arabe", { stufe: "kids", lang: "fr", verbietenSs: false, lernweg: "es" })).toBeNull();
    expect(vorlageVorschau("palabrasc-9", { stufe: "kids", lang: "es", verbietenSs: false, lernweg: "es" })).toBeNull();
  });

  it("jede Vorlage hat Namen in allen vier Bedienungssprachen, spanisch = Titel der Daten", () => {
    for (const v of vorlagenFuer({ fuer: "uebung", lang: "es" }).filter((x) => x.art === "raices")) {
      for (const b of ["de", "en", "fr", "es"] as const) expect(vorlageTitel(v, b), `${v.id}/${b}`).toBeTruthy();
      expect(vorlageTitel(v, "es")).toBe(RAICES_THEMEN.find((t) => `palabras-${t.id}` === v.id)?.titel);
    }
  });
});
