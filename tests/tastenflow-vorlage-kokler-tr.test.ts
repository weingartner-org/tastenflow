/**
 * ★★★ WÄCHTER: „Kökler ve alıntılar" - die türkische Übungsvorlage (TR-S, 09.10.2026). Modell:
 * `tests/tastenflow-vorlage-radici-it.test.ts` (Italienisch).
 *
 * Gemessen wird:
 *  1. Fünf Themen, in allen Stufen dieselben; jedes Thema VOLL (20/15/15/15/15 = 80 je Stufe, 240 zusammen).
 *  2. Jede Zeile `ipucu - kelime` höchstens 40 Zeichen, genau ein Trenner, nur Zeichen, die `tr-q` tippt, kein
 *     Zirkumflex (Totaste), die Regeln jeder türkischen Zeile (`zeilenFehler`).
 *  3. Einträge eindeutig - kein Wort zweimal, weder in einer Stufe noch über die Stufen hinweg.
 *  4. Kein Wort der Wortlisten-Sperre (Kern, Wortbasis, gefaltet, unerwünscht) - mit Gegenprobe.
 *  5. Jedes Paar trägt Herkunft und Nachschlage-Adresse; Wörter wachsen mit den Stufen (Wortfamilie braucht Suffixe).
 *  6. Verdrahtung: nur Weg „tr" mit Übungssprache „tr" bekommt die Vorlage.
 */
import { describe, expect, it } from "vitest";
import {
  KOKLER,
  KOKLER_ALFABETIK,
  KOKLER_TEMALAR,
  kokZeile,
  type KokPaar,
  type KokStufe,
} from "@/lib/typing/vorlagenDaten/kokler";
import { KOKLER_CHALLENGE_DATEIEN, vorlageTitel, vorlageVorschau, vorlagenFuer } from "@/lib/typing/vorlagen";
import { fuerWortlisteUngeeignetTr, gesperrtTr } from "@/lib/typing/sperrlisteTr";
import { layoutById, layoutIndex, type KeyboardLayout } from "@/lib/typing/layouts";
import { zeilenFehler } from "./helfer/trTextRegeln";

const STUFEN: KokStufe[] = ["kids", "teens", "erwachsen"];
const GROESSE: Readonly<Record<string, number>> = { "yunanca-latince": 20, arapca: 15, farsca: 15, bati: 15, aile: 15 };
const ALLE = STUFEN.flatMap((s) => KOKLER[s].flatMap((t) => t.paare));

/** Hat diese Tastatur einen Weg zu diesem Zeichen? (Kleinbuchstaben und Satzzeichen; die Regeln der Wortlisten gelten klein.) */
function tippbarAuf(layout: KeyboardLayout, c: string): boolean {
  if (c === " ") return true;
  const k = c === "İ" ? "i" : c.toLocaleLowerCase("tr");
  if (layoutIndex(layout).missing.has(k)) return false;
  return layout.rows.some((r) => r.keys.includes(k)) || k in layout.access;
}
function untippbar(zeile: string, layout: KeyboardLayout): string[] {
  return [...zeile].filter((c) => !tippbarAuf(layout, c));
}

/** Jedes Wort der Zeile gegen die Wortlisten-Sperre (Kern, Wortbasis, gefaltet, unerwünscht). */
function gesperrt(zeile: string): string[] {
  return zeile
    .split(/[^\p{L}']+/u)
    .filter((w) => w && fuerWortlisteUngeeignetTr(w));
}

describe("★ Kökler ve alıntılar: Themen voll, Zeilen sauber", () => {
  it("fünf Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(KOKLER_TEMALAR).toHaveLength(5);
    for (const s of STUFEN) expect(KOKLER[s].map((t) => [t.id, t.titel]), s).toEqual(KOKLER_TEMALAR.map((t) => [t.id, t.titel]));
  });

  it.each(STUFEN)("%s: jedes Thema hat seine volle Grösse, zusammen 80", (s) => {
    for (const t of KOKLER[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(GROESSE[t.id]);
    expect(KOKLER[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => expect(ALLE).toHaveLength(240));

  it("jede Zeile: höchstens 40 Zeichen, genau ein Trenner, Wort klein und nicht im Hinweis", () => {
    const fehler: string[] = [];
    for (const p of ALLE) {
      const z = kokZeile(p);
      if (z.length > 40) fehler.push(`zu lang (${z.length}): ${z}`);
      if (/ {2}|^ | $/.test(z)) fehler.push(`Leerzeichen: ${z}`);
      if (z.split(" - ").length !== 2 || /[ -]/.test(p.kelime)) fehler.push(`Trenner: ${z}`);
      if (p.kelime !== p.kelime.toLocaleLowerCase("tr")) fehler.push(`gross: ${z}`);
      if (p.ipucu.toLocaleLowerCase("tr").includes(p.kelime)) fehler.push(`Wort im Hinweis: ${z}`);
    }
    expect(fehler).toEqual([]);
  });

  it("jede Zeile besteht die Regeln jeder türkischen Zeile (Zeichen, Strich, ASCII-Ersatz, Staatssymbole)", () => {
    expect(ALLE.flatMap((p) => zeilenFehler(kokZeile(p)).map((f) => `${kokZeile(p)}: ${f}`))).toEqual([]);
  });

  it("jede Zeile ist auf `tr-q` tippbar, ohne Zirkumflex und ohne typografischen Apostroph", () => {
    const l = layoutById("tr-q");
    const fehler: string[] = [];
    for (const p of ALLE) {
      const z = kokZeile(p);
      const nicht = untippbar(z, l);
      if (nicht.length) fehler.push(`${z} (${nicht.join("")})`);
      if (/[âîûÂÎÛ’‘“”–—]/.test(z)) fehler.push(`Zeichen: ${z}`);
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe Tippbarkeit: ä, ñ und ’ fallen auf, ç ğ ı ö ş ü nicht", () => {
    const l = layoutById("tr-q");
    expect(untippbar("kärt", l)).toEqual(["ä"]);
    expect(untippbar("año", l)).toEqual(["ñ"]);
    expect(untippbar("Ali’nin", l)).toEqual(["’"]);
    expect(untippbar("çoğu ışık öşü", l)).toEqual([]);
  });

  it("Einträge eindeutig: kein Wort doppelt, auch nicht über die Stufen hinweg", () => {
    const woerter = ALLE.map((p) => p.kelime);
    expect(woerter.filter((w, i) => woerter.indexOf(w) !== i)).toEqual([]);
  });

  it("jedes Paar trägt Herkunft und Nachschlage-Adresse an tr.wiktionary", () => {
    for (const p of ALLE) {
      expect(p.origine, p.kelime).toBeTruthy();
      expect(p.beleg, p.kelime).toBe(`https://tr.wiktionary.org/wiki/${p.kelime}`);
    }
  });

  it("Bezug zu Sprache und Land: Lehnwörter aus Arabisch, Persisch, Französisch, Italienisch, Englisch; Wortfamilien mit Suffixen", () => {
    const h = new Set(ALLE.map((p) => p.origine));
    for (const l of ["yunanca", "latince", "arapca", "farsca", "fransizca", "italyanca", "ingilizce", "turkce-ek"] as const)
      expect(h.has(l), l).toBe(true);
    // die Wortfamilien-Themen tragen NUR türkische Suffixe, die anderen nie
    for (const s of STUFEN)
      for (const t of KOKLER[s])
        for (const p of t.paare) expect(p.origine === "turkce-ek", `${s}/${t.id}/${p.kelime}`).toBe(t.id === "aile");
    // die Familien um göz und kitap zeigen die Kette Stamm → Suffix → zweites Suffix
    const kids = KOKLER.kids.find((t) => t.id === "aile")!.paare.map((p) => p.kelime);
    for (const w of ["gözlük", "gözlükçü", "kitaplık", "kitapçı", "ayakkabı", "ayakkabıcı"]) expect(kids, w).toContain(w);
  });

  it("Gegenprobe: ein Paar mit dem Wort im Hinweis, zu lang oder doppelt fiele auf", () => {
    const falsch: KokPaar = { ipucu: "evde telefon kullanırsın", kelime: "telefon", origine: "yunanca", beleg: "x" };
    expect(falsch.ipucu.includes(falsch.kelime)).toBe(true);
    expect(kokZeile({ ...falsch, ipucu: "çok ama çok uzun bir ipucu cümlesi burada" }).length).toBeGreaterThan(40);
    const mitDoppel = [...ALLE.map((p) => p.kelime), "telefon"];
    expect(mitDoppel.filter((w, i) => mitDoppel.indexOf(w) !== i)).toEqual(["telefon"]);
  });
});

describe("★★ Keine Sperrwörter (Kern, Wortbasis, gefaltet, unerwünscht)", () => {
  it("keine Zeile trägt ein gesperrtes Wort", () => {
    expect(ALLE.flatMap((p) => gesperrt(kokZeile(p)).map((w) => `${kokZeile(p)}: ${w}`))).toEqual([]);
  });
  it("Gegenprobe: Kern, Wortbasis und unerwünschtes Wort werden gefunden", () => {
    expect(gesperrt("kuş ve sik - x")).toContain("sik");
    expect(gesperrt("ruh ve zihin")).toEqual(["ruh"]);
    expect(gesperrtTr("ordu")).toBe(false);
    expect(gesperrt("ordu - bölük")).toEqual(["ordu"]);
    expect(gesperrt("çiçekler açtı - bahar")).toEqual([]);
  });
});

describe("★★ Die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: eine Umordnung, türkisch sortiert, nicht die Themenfolge", (s) => {
    const temalar = KOKLER[s].flatMap((t) => t.paare).map(kokZeile);
    expect([...KOKLER_ALFABETIK[s]].sort()).toEqual([...temalar].sort());
    const ind = KOKLER_ALFABETIK[s].map((z) => z.split(" - ")[0]);
    expect(ind).toEqual([...ind].sort((a, b) => a.localeCompare(b, "tr")));
    expect(KOKLER_ALFABETIK[s]).not.toEqual(temalar);
  });
});

describe("★★★ Verdrahtung: nur der türkische Lehrgang (Weg „tr“, Übungssprache „tr“)", () => {
  it("Eigene Übung: fünf Themen-Vorlagen; Tippchallenge: drei alphabetische Dateien", () => {
    expect(vorlagenFuer({ fuer: "uebung", lang: "tr" }).filter((v) => v.art === "kokler").map((v) => v.id)).toEqual(
      KOKLER_TEMALAR.map((t) => `kokler-${t.id}`),
    );
    expect(vorlagenFuer({ fuer: "challenge", lang: "tr" }).filter((v) => v.art === "kokler")).toHaveLength(KOKLER_CHALLENGE_DATEIEN);
  });

  it("Gegenprobe: de, en, fr, es, it, pl, cs sehen nie „Kökler ve alıntılar“; Weg „tr“ sieht weder radici noch raices noch racines", () => {
    for (const lang of ["de", "en", "fr", "es", "it", "pl", "cs"] as const)
      for (const fuer of ["uebung", "challenge"] as const)
        expect(vorlagenFuer({ fuer, lang }).filter((v) => v.art === "kokler"), `${lang}/${fuer}`).toEqual([]);
    for (const fuer of ["uebung", "challenge"] as const)
      expect(vorlagenFuer({ fuer, lang: "tr" }).filter((v) => v.art === "radici" || v.art === "raices" || v.art === "racines")).toEqual([]);
  });

  it.each(STUFEN)("%s: die Vorschau gibt die Paare unverändert; die Challenge-Dateien zusammen die ganze Liste", (s) => {
    for (const t of KOKLER[s]) {
      const v = vorlageVorschau(`kokler-${t.id}`, { stufe: s, lang: "tr", verbietenSs: false, lernweg: "tr" });
      expect(v?.zeilen, `${s}/${t.id}`).toEqual(t.paare.map(kokZeile));
    }
    const zusammen: string[] = [];
    for (let i = 1; i <= KOKLER_CHALLENGE_DATEIEN; i++)
      zusammen.push(...(vorlageVorschau(`kokc-${i}`, { stufe: s, lang: "tr", verbietenSs: false, lernweg: "tr" })?.zeilen ?? []));
    expect(zusammen).toEqual(KOKLER_ALFABETIK[s]);
  });

  it("Gegenprobe: falscher Weg oder falsche Übungssprache gibt null, unbekannte Datei auch", () => {
    expect(vorlageVorschau("kokler-arapca", { stufe: "kids", lang: "tr", verbietenSs: false, lernweg: "it" })).toBeNull();
    expect(vorlageVorschau("kokler-arapca", { stufe: "kids", lang: "en", verbietenSs: false, lernweg: "tr" })).toBeNull();
    expect(vorlageVorschau("kokc-9", { stufe: "kids", lang: "tr", verbietenSs: false, lernweg: "tr" })).toBeNull();
    expect(vorlageVorschau("kokler-gibtsnicht", { stufe: "kids", lang: "tr", verbietenSs: false, lernweg: "tr" })).toBeNull();
  });

  it("jede Vorlage hat Namen in allen acht Bedienungssprachen, türkisch = Titel der Daten", () => {
    for (const v of [...vorlagenFuer({ fuer: "uebung", lang: "tr" }), ...vorlagenFuer({ fuer: "challenge", lang: "tr" })].filter((x) => x.art === "kokler")) {
      for (const b of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const) expect(vorlageTitel(v, b), `${v.id}/${b}`).toBeTruthy();
      if (v.id.startsWith("kokler-")) expect(vorlageTitel(v, "tr")).toBe(KOKLER_TEMALAR.find((t) => `kokler-${t.id}` === v.id)?.titel);
    }
  });
});
