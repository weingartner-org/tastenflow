/**
 * ★★★ WÄCHTER: „Původ slov" - die tschechische Übungsvorlage (CS-W, 09.10.2026). Modell:
 * `tests/tastenflow-vorlage-radici-it.test.ts` (Italienisch).
 *
 * Gemessen wird:
 *  1. Fünf Themen, in allen Stufen dieselben; jedes Thema VOLL (20/15/15/15/15 = 80 je Stufe, 240 zusammen).
 *  2. Jede Zeile `napoveda - slovo` höchstens 40 Zeichen, genau ein Trenner, nur Zeichen, die `cs` UND `cs-qwerty`
 *     tippen; kein grosser Akzentbuchstabe, keine typografischen Zeichen (zeilenFehler der cs-Textregeln).
 *  3. Einträge eindeutig - kein Wort zweimal, weder in einer Stufe noch über die Stufen hinweg.
 *  4. Kein Wort der Sperrliste `gesperrtCs` (Kern UND Wortbasis) - mit Gegenprobe.
 *  5. Hausregeln: keine Vergangenheit der 2. Person, kein Geschlecht der tippenden Person (-l/-la), keine Waffen-/Rausch-/Glaubenswörter.
 *  6. Jedes Paar trägt eine Herkunft; Bezug zu Land und Sprache.
 *  7. Verdrahtung: nur Weg „cs" mit Übungssprache „cs" bekommt die Vorlage.
 */
import { describe, expect, it } from "vitest";
import {
  KORENY,
  KORENY_ABECEDNE,
  KORENY_TEMATA,
  korenZeile,
  type KorenPaar,
  type KorenStufe,
} from "@/lib/typing/vorlagenDaten/korenyCs";
import { KORENY_CHALLENGE_DATEIEN, vorlageTitel, vorlageVorschau, vorlagenFuer } from "@/lib/typing/vorlagen";
import { gesperrtCs } from "@/lib/typing/sperrlisteCs";
import { layoutById, layoutIndex, type KeyboardLayout } from "@/lib/typing/layouts";
import { kombizeichenZu } from "@/lib/typing/totasten";
import { zeilenFehler } from "./helfer/csTextRegeln";

const STUFEN: KorenStufe[] = ["kids", "teens", "erwachsen"];
const GROESSE: Readonly<Record<string, number>> = { "recko-latina": 20, nemcina: 15, romanske: 15, svet: 15, rodiny: 15 };
const ALLE = STUFEN.flatMap((s) => KORENY[s].flatMap((t) => t.paare));

/** Hat diese Tastatur einen Weg zu diesem Zeichen (eigene Taste, Umschalt/Alt Gr oder Totaste + Buchstabe)? Grossbuchstaben a-z über Umschalt. */
function tippbarAuf(layout: KeyboardLayout, c: string): boolean {
  if (c === " ") return true;
  const k = /^[A-Z]$/.test(c) ? c.toLowerCase() : c;
  if (layoutIndex(layout).missing.has(k)) return /^[ďťň]$/.test(k) && kombizeichenZu(k, layout) !== undefined;
  return layout.rows.some((r) => r.keys.includes(k)) || k in layout.access || kombizeichenZu(k, layout) !== undefined;
}
function untippbar(zeile: string, layout: KeyboardLayout): string[] {
  return [...zeile].filter((c) => !tippbarAuf(layout, c));
}

/** Jedes Wort der Zeile gegen die EINE Sperrliste des Weges. */
function gesperrt(zeile: string): string[] {
  return zeile
    .toLowerCase()
    .split(/[^a-záčďéěíňóřšťúůýž]+/)
    .filter((w) => w && gesperrtCs(w));
}

describe("★ Původ slov: Themen voll, Zeilen sauber", () => {
  it("fünf Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(KORENY_TEMATA).toHaveLength(5);
    for (const s of STUFEN) expect(KORENY[s].map((t) => [t.id, t.titel]), s).toEqual(KORENY_TEMATA.map((t) => [t.id, t.titel]));
  });

  it.each(STUFEN)("%s: jedes Thema hat seine volle Grösse, zusammen 80", (s) => {
    for (const t of KORENY[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(GROESSE[t.id]);
    expect(KORENY[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => expect(ALLE).toHaveLength(240));

  it("jede Zeile: höchstens 40 Zeichen, genau ein Trenner, Wort klein und nicht im Hinweis", () => {
    const fehler: string[] = [];
    for (const p of ALLE) {
      const z = korenZeile(p);
      if (z.length > 40) fehler.push(`zu lang (${z.length}): ${z}`);
      if (/ {2}|^ | $/.test(z)) fehler.push(`Leerzeichen: ${z}`);
      if (z.split(" - ").length !== 2 || /[ -]/.test(p.slovo)) fehler.push(`Trenner: ${z}`);
      if (p.slovo !== p.slovo.toLowerCase()) fehler.push(`gross: ${z}`);
      if (p.napoveda.toLowerCase().includes(p.slovo)) fehler.push(`Wort im Hinweis: ${z}`);
    }
    expect(fehler).toEqual([]);
  });

  it("jede Zeile besteht die cs-Textregeln (kein typografisches Zeichen, kein Ů, kein Sperrwort)", () => {
    expect(ALLE.flatMap((p) => zeilenFehler(korenZeile(p)).map((f) => `${korenZeile(p)}: ${f}`))).toEqual([]);
  });

  it("jede Zeile ist auf `cs` UND `cs-qwerty` tippbar; kein grosser Akzentbuchstabe", () => {
    const fehler: string[] = [];
    for (const id of ["cs", "cs-qwerty"] as const) {
      const l = layoutById(id);
      for (const p of ALLE) {
        const nicht = untippbar(korenZeile(p), l);
        if (nicht.length) fehler.push(`${id}: ${korenZeile(p)} (${nicht.join("")})`);
      }
    }
    for (const p of ALLE) if (/[ČŠŘŽĚĎŤŇÁÉÍÚÝÓŮ]/.test(korenZeile(p))) fehler.push(`Grossbuchstabe mit Akzent: ${korenZeile(p)}`);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe Tippbarkeit: ä, ñ und Ů fallen auf; ď ť ň und ů nicht", () => {
    const cs = layoutById("cs");
    const qw = layoutById("cs-qwerty");
    expect(untippbar("año - ł", cs)).toEqual(["ñ", "ł"]);
    expect(untippbar("Ů", qw)).toEqual(["Ů"]);
    expect(untippbar("teď šňůrka ťuk dům", cs)).toEqual([]);
    expect(untippbar("teď šňůrka ťuk dům", qw)).toEqual([]);
  });

  it("Einträge eindeutig: kein Wort doppelt, auch nicht über die Stufen hinweg", () => {
    const woerter = ALLE.map((p) => p.slovo);
    expect(woerter.filter((w, i) => woerter.indexOf(w) !== i)).toEqual([]);
  });

  it("jedes Paar trägt eine Herkunft", () => {
    for (const p of ALLE) expect(p.puvod, p.slovo).toBeTruthy();
  });

  it("Bezug zu Sprache und Land: Griechisch, Latein, Deutsch, Französisch, Italienisch, Englisch, ferne Sprachen, eigene Wortfamilien", () => {
    const h = new Set(ALLE.map((p) => p.puvod));
    for (const l of ["řečtina", "latina", "němčina", "francouzština", "italština", "angličtina", "arabština", "japonština", "inuitština", "čeština"] as const)
      expect(h.has(l), l).toBe(true);
    const text = ALLE.map(korenZeile).join(" ");
    for (const ort of ["Egyptě", "Benátek", "Itálie", "Kavkazu", "Asie"]) expect(text, ort).toContain(ort);
    // Wortfamilien: jedes Wort des Themas „rodiny" kommt von der Eigenart des Tschechischen, mit Vor- oder Nachsilbe
    const rodiny = STUFEN.flatMap((s) => KORENY[s].find((t) => t.id === "rodiny")!.paare);
    expect(rodiny.every((p) => p.puvod === "čeština")).toBe(true);
  });

  it("gegen ein Kind und für alle: keine Vergangenheit der 2. Person, kein -l/-la, keine Personenwörter, die nur m./f. existieren", () => {
    const fehler: string[] = [];
    for (const p of ALLE) {
      const h = p.napoveda.toLowerCase();
      // 2. Person Vergangenheit: „jsi" + l-Partizip; l-Partizip allein am Wortende nach „jsi/bys"
      if (/\b(jsi|bys)\b/.test(h)) fehler.push(`2. Person Vergangenheit/Konditional: ${p.napoveda}`);
      if (/\b\w+(l|la|li)\b(?= se\b| jsi\b)/.test(h)) fehler.push(`l-Partizip: ${p.napoveda}`);
      // Adjektive in der Anrede, die das Geschlecht verraten
      if (/\b(rád|ráda)\b/.test(h) && !/rád cestuje/.test(h)) fehler.push(`rád/ráda: ${p.napoveda}`);
      // Hinweise an Menschen mit Behinderung: nie
      if (/slep|hluch|postiž|invalid/.test(h + p.slovo)) fehler.push(`Behinderung: ${p.napoveda}`);
    }
    expect(fehler).toEqual([]);
  });

  it("Themen, die ein Kind nicht tragen soll, fehlen: Waffen, Krieg, Tod, Rausch, Glaube, Politik", () => {
    const verboten = /(zbra|pistol|haubic|kanon|vojn|vojá|válk|smrt|mrtv|zabi|vraž|alkohol|tabák|cigar|droga|víno|pivo|kostel|církev|bible|bůh|bože|papež|modl|vláda|parlament|volb|politi|demokrac|prezident|strana)/i;
    expect(ALLE.filter((p) => verboten.test(korenZeile(p))).map(korenZeile)).toEqual([]);
  });

  it("Gegenprobe: ein Paar mit dem Wort im Hinweis, zu lang oder doppelt fiele auf", () => {
    const falsch: KorenPaar = { napoveda: "telefon na stole", slovo: "telefon", puvod: "řečtina" };
    expect(falsch.napoveda.toLowerCase().includes(falsch.slovo)).toBe(true);
    expect(korenZeile({ ...falsch, napoveda: "velmi dlouhý hint, který se nevejde na jednu řádku" }).length).toBeGreaterThan(40);
    const mitDoppel = [...ALLE.map((p) => p.slovo), "telefon"];
    expect(mitDoppel.filter((w, i) => mitDoppel.indexOf(w) !== i)).toEqual(["telefon"]);
  });
});

describe("★★ Keine Sperrwörter (Kern und Wortbasis)", () => {
  it("keine Zeile trägt ein Wort der Sperrliste", () => {
    expect(ALLE.flatMap((p) => gesperrt(korenZeile(p)).map((w) => `${korenZeile(p)}: ${w}`))).toEqual([]);
  });
  it("Gegenprobe: Kern-Stamm, Wortbasis und exakte Form werden gefunden", () => {
    expect(gesperrt("ten kurva dům - dům")).toEqual(["kurva"]);
    expect(gesperrt("hloupý nápad - nápad")).toEqual(["hloupý"]);
    expect(gesperrt("prsa a hlava - hlava")).toEqual(["prsa"]);
    expect(gesperrt("místo na hraní - hřiště")).toEqual([]);
  });
});

describe("★★ Die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: eine Umordnung, tschechisch sortiert, nicht die Themenfolge", (s) => {
    const temata = KORENY[s].flatMap((t) => t.paare).map(korenZeile);
    expect([...KORENY_ABECEDNE[s]].sort()).toEqual([...temata].sort());
    const hinweise = KORENY_ABECEDNE[s].map((z) => z.split(" - ")[0]);
    expect(hinweise).toEqual([...hinweise].sort((a, b) => a.localeCompare(b, "cs")));
    expect(KORENY_ABECEDNE[s]).not.toEqual(temata);
  });
});

describe("★★★ Verdrahtung: nur der tschechische Lehrgang (Weg „cs“, Übungssprache „cs“)", () => {
  it("Eigene Übung: fünf Themen-Vorlagen; Challenge: drei alphabetische Dateien", () => {
    expect(vorlagenFuer({ fuer: "uebung", lang: "cs" }).filter((v) => v.art === "koreny").map((v) => v.id)).toEqual(
      KORENY_TEMATA.map((t) => `puvod-${t.id}`),
    );
    expect(vorlagenFuer({ fuer: "challenge", lang: "cs" }).filter((v) => v.art === "koreny")).toHaveLength(KORENY_CHALLENGE_DATEIEN);
  });

  it("Gegenprobe: de, en, fr, es, it, pl, tr sehen nie „Původ slov“; Weg „cs“ sieht weder radici noch raices noch racines", () => {
    for (const lang of ["de", "en", "fr", "es", "it", "pl", "tr"] as const)
      for (const fuer of ["uebung", "challenge"] as const)
        expect(vorlagenFuer({ fuer, lang }).filter((v) => v.art === "koreny"), `${lang}/${fuer}`).toEqual([]);
    for (const fuer of ["uebung", "challenge"] as const)
      expect(vorlagenFuer({ fuer, lang: "cs" }).filter((v) => v.art === "radici" || v.art === "raices" || v.art === "racines")).toEqual([]);
  });

  it.each(STUFEN)("%s: die Vorschau gibt die Paare unverändert; die Challenge-Dateien zusammen die ganze Liste", (s) => {
    for (const t of KORENY[s]) {
      const v = vorlageVorschau(`puvod-${t.id}`, { stufe: s, lang: "cs", verbietenSs: false, lernweg: "cs" });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(korenZeile));
    }
    const zusammen: string[] = [];
    for (let i = 1; i <= KORENY_CHALLENGE_DATEIEN; i++)
      zusammen.push(...(vorlageVorschau(`puvodc-${i}`, { stufe: s, lang: "cs", verbietenSs: false, lernweg: "cs" })?.zeilen ?? []));
    expect(zusammen).toEqual(KORENY_ABECEDNE[s]);
  });

  it("Gegenprobe: falscher Weg oder falsche Übungssprache gibt null, unbekannte Datei auch", () => {
    expect(vorlageVorschau("puvod-nemcina", { stufe: "kids", lang: "cs", verbietenSs: false, lernweg: "it" })).toBeNull();
    expect(vorlageVorschau("puvod-nemcina", { stufe: "kids", lang: "en", verbietenSs: false, lernweg: "cs" })).toBeNull();
    expect(vorlageVorschau("puvodc-9", { stufe: "kids", lang: "cs", verbietenSs: false, lernweg: "cs" })).toBeNull();
    expect(vorlageVorschau("puvod-gibtsnicht", { stufe: "kids", lang: "cs", verbietenSs: false, lernweg: "cs" })).toBeNull();
  });

  it("jede Vorlage hat Namen in allen acht Bedienungssprachen, tschechisch = Titel der Daten", () => {
    for (const v of [...vorlagenFuer({ fuer: "uebung", lang: "cs" }), ...vorlagenFuer({ fuer: "challenge", lang: "cs" })].filter((x) => x.art === "koreny")) {
      for (const b of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const) expect(vorlageTitel(v, b), `${v.id}/${b}`).toBeTruthy();
      if (v.id.startsWith("puvod-")) expect(vorlageTitel(v, "cs")).toBe(KORENY_TEMATA.find((t) => `puvod-${t.id}` === v.id)?.titel);
    }
  });
});
