/**
 * ★★★ E11a-5 (26.09.2026): DIE BEDIENUNG DER WORTSPIELE AUF FRANZÖSISCH.
 *
 * Johannes: Wer Französisch als Bedienungssprache wählt, bekommt ALLES auf
 * Französisch. In den Übungsformen (`src/lib/typing/uebungsformen/`) ist die
 * Bedienung das, was eine Form über `bedienSpracheVon(ctx)` wählt: die
 * Ankündigung, der Rahmen einer Frage („Première ligne : … Quel mot
 * manque ?"), die Auflösung - dazu Namen und Hinweise der Formen, die
 * Fehlerstellen-Ansage (`fehlerstelle.ts`) und die Totasten-Ansage
 * (`totastenTexte.ts`).
 *
 * Bis E11a-5 hatte keine dieser Tabellen ein `fr`: `texte()` fiel für „fr"
 * auf ENGLISCH zurück, und `fehlerstelle.ts` fiel mit `lang === "en" ? … :`
 * sogar still auf DEUTSCH (Leitfaden neue Sprache, Falle 30).
 *
 * Geprüft wird hier OHNE Browser, an dem, was die Formen wirklich liefern -
 * nicht an den Tabellen (die sind nicht alle exportiert, und eine Tabelle
 * sagt nicht, ob die Form sie auch benutzt):
 *
 *  1. kein deutsches Wort (Deutsch-Fänger `tests/helfer/deutschFaenger.ts`,
 *     ohne die Wörter, die auf Französisch genauso geschrieben werden),
 *  2. kein englisches Wort (eigene kleine Liste, ohne Homografen),
 *  3. verschieden von der englischen Fassung (sonst wäre es der Rückfall).
 *
 * Nur die BEDIENUNGS-Teile werden geprüft: Der Inhalt (das Wort, der Satz,
 * das Zahlwort) folgt der Übungssprache und ist hier absichtlich deutsch
 * oder englisch - `frageTeile`/`aufloesungTeile` markieren ihn mit `inhalt`.
 *
 * ★★★ GEGENPROBE: Dieselbe Sammlung mit Bedienung „de" muss deutsche Wörter
 * finden, mit „en" englische - sonst läse der Wächter nichts.
 */
import { describe, expect, it } from "vitest";
import {
  UEBUNGSFORMEN,
  FORM_NAMEN,
  formHinweis,
  formName,
  formNameZuTitel,
  type FormKontext,
  type TextTeil,
  type UebungsformId,
} from "@/lib/typing/uebungsformen";
import { lernwegDef, type Lernweg } from "@/lib/typing/lernweg";
import type { BedienSprache } from "@/lib/bedienSprache/sprache";
import { fehlerAnsage, fehlerSatz, findeFehlerstelle, stellenName } from "@/lib/typing/fehlerstelle";
import { feststelltasteHinweisText, totasteAnsage } from "@/lib/typing/totastenTexte";
import { deutscheWoerter } from "./helfer/deutschFaenger";

/**
 * Wörter aus dem Deutsch-Fänger, die im Französischen genauso geschrieben
 * werden („des mots", „du texte", „une liste"). Sie in einem französischen
 * Satz als Deutsch zu melden, wäre falscher Alarm - dieselbe Begründung wie
 * in `tests/tastenflow-franzoesisch-bereiche.test.ts`.
 */
const AUCH_FRANZOESISCH: ReadonlySet<string> = new Set(["des", "du", "liste"]);

/** Deutsche Wörter in einem französischen Text - ohne die Homografen. */
function deutschIn(text: string): string[] {
  return deutscheWoerter(text).filter((w) => !AUCH_FRANZOESISCH.has(w.toLowerCase()));
}

/**
 * Wörter, die es im Französischen NICHT gibt - aus dem Wortschatz der
 * englischen Fassungen dieser Formen. Bewusst draussen: „on", „a", „long", „grave", „as", „second",
 * „type", „alphabet", „focus", „pause", „phrase", „main", „ligne" … (auch
 * französische Wörter).
 */
const ENGLISCHE_WOERTER: ReadonlySet<string> = new Set(
  (
    "the and you your now for some word words letter letters line lines sentence " +
    "missing left right key keys shift first then same again backwards number " +
    "digits wrong should only hear finger fingers jumble twin moves movement " +
    "pyramid pyramids capital wanders opposite puzzles puzzle proofreading " +
    "dictation runs piece each adds several one two three is it its what which " +
    "ends before that circumflex diaeresis cedilla caps lock real " +
    "own round gap fill hand hands in with of to be can from use make many new " +
    "third fourth fifth"
  ).split(/\s+/),
);

function englischIn(text: string): string[] {
  return (text.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => ENGLISCHE_WOERTER.has(w));
}

/** Ein fester Zufall - sonst prüft der Wächter jedes Mal etwas anderes. */
function festerZufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}

/** Nur die Bedienungs-Teile, aneinandergehängt. */
function bedienTeile(teile: readonly TextTeil[] | undefined): string {
  return (teile ?? [])
    .filter((t) => !t.inhalt)
    .map((t) => t.text)
    .join(" ");
}

interface Probe {
  quelle: string;
  form: UebungsformId;
  art: "ankuendigung" | "frage" | "aufloesung";
  text: string;
  /** Kennung für den Vergleich mit einer anderen Bedienungssprache. */
  schluessel: string;
}

/**
 * Sammelt alle Bedienungs-Texte, die die Formen mit dieser Bedienungssprache
 * liefern - über drei Übungssprachen (de, en, fr) und mehrere Tastenstände.
 */
function sammle(sprache: BedienSprache): Probe[] {
  const proben: Probe[] = [];
  for (const weg of ["de", "en", "fr"] as const satisfies readonly Lernweg[]) {
    const intro = lernwegDef(weg).introOrder as readonly string[];
    for (const n of [14, 26, 40, intro.length]) {
      const introduced = intro.slice(0, n);
      for (const saat of [1, 7, 42]) {
        const ctx = (): FormKontext => ({
          lernweg: weg,
          introduced: [...introduced],
          shift: introduced.includes("⇧"),
          oneHand: false,
          stufe: "kids",
          lang: weg,
          sprache,
          count: 12,
          zufall: festerZufall(saat),
        });
        for (const form of UEBUNGSFORMEN) {
          if (!form.taugt(ctx())) continue;
          const k = `${weg}|${n}|${saat}|${form.id}`;
          const quelle = `${form.id} (Übungssprache ${weg}, ${n} Tasten, Saat ${saat})`;
          proben.push({
            quelle,
            form: form.id,
            art: "ankuendigung",
            text: form.ankuendigung(ctx()),
            schluessel: `${k}|ank`,
          });
          if (!form.fragen) continue;
          form.fragen(ctx()).forEach((a, i) => {
            const frage = a.frageTeile ? bedienTeile(a.frageTeile) : a.frage;
            if (frage.trim())
              proben.push({ quelle, form: form.id, art: "frage", text: frage, schluessel: `${k}|f${i}` });
            const aufl = a.aufloesungTeile ? bedienTeile(a.aufloesungTeile) : (a.aufloesung ?? "");
            if (aufl.trim())
              proben.push({ quelle, form: form.id, art: "aufloesung", text: aufl, schluessel: `${k}|a${i}` });
          });
        }
      }
    }
  }
  return proben;
}

/** Namen, Hinweise, Fehlerstellen- und Totasten-Ansage - ohne Kontext erreichbar. */
function feste(sprache: BedienSprache): { quelle: string; text: string }[] {
  const out: { quelle: string; text: string }[] = [];
  for (const id of Object.keys(FORM_NAMEN.de) as UebungsformId[]) {
    out.push({ quelle: `Name ${id}`, text: formName(id, sprache) });
    out.push({ quelle: `Hinweis ${id}`, text: formHinweis(id, sprache) });
    out.push({ quelle: `Titel ${id}`, text: formNameZuTitel(FORM_NAMEN.de[id], sprache) });
  }
  const faelle: [string, string][] = [
    ["Huas", "Haus"], // Vertauschung
    ["Hau", "Haus"], // Buchstabe fehlt
    ["Hausx", "Haus"], // Wort schon zu Ende
    ["abcdefghijkx", "abcdefghijkl"], // ab elf gezählt
    ["abcdefghijk", "abcdefghijkl"],
  ];
  for (const [eingabe, richtig] of faelle) {
    const f = findeFehlerstelle(eingabe, richtig)!;
    // Die Stücke mit eigener Tonhöhe sind der Buchstabe selbst - Inhalt.
    const bedien = fehlerAnsage(f, sprache)
      .filter((s) => s.pitch === undefined)
      .map((s) => s.text)
      .join(" ");
    out.push({ quelle: `Fehlerstelle ${eingabe}/${richtig}`, text: bedien });
    out.push({ quelle: `Fehlersatz ${eingabe}/${richtig}`, text: fehlerSatz(f, sprache).replace(/\b[a-z]\b/g, "") });
  }
  for (let n = 1; n <= 12; n++) out.push({ quelle: `Stelle ${n}`, text: stellenName(n, sprache) });
  out.push({ quelle: "Feststelltaste", text: feststelltasteHinweisText(sprache) });
  for (const tot of ["^", "¨", "`", "¸"])
    out.push({ quelle: `Totaste ${tot}`, text: totasteAnsage({ tot, dann: "e", zeichen: "ê" } as never, sprache) });
  return out;
}

describe("E11a-5: die Bedienung der Übungsformen spricht Französisch", () => {
  const fr = sammle("fr");
  const en = sammle("en");
  const enNach = new Map(en.map((p) => [p.schluessel, p.text]));

  it("erreicht jede der 13 Formen (sonst prüft der Wächter eine Form nicht)", () => {
    const erreicht = new Set(fr.filter((p) => p.art === "ankuendigung").map((p) => p.form));
    expect([...erreicht].sort()).toEqual(UEBUNGSFORMEN.map((f) => f.id).sort());
    // Die Frage-Rahmen der Formen, die einen haben:
    const mitRahmen = new Set(fr.filter((p) => p.art !== "ankuendigung").map((p) => p.form));
    for (const id of ["korrekturlesen", "wasfehlt", "zahlendiktat"] as const)
      expect(mitRahmen.has(id), id).toBe(true);
    expect(fr.length).toBeGreaterThan(200);
  });

  it("kein deutsches Wort in Ankündigung, Frage-Rahmen und Auflösung", () => {
    const funde = fr
      .map((p) => ({ p, w: deutschIn(p.text) }))
      .filter((x) => x.w.length > 0)
      .map((x) => `${x.p.quelle} [${x.p.art}]: „${x.p.text}" [${x.w.join(", ")}]`);
    expect([...new Set(funde)]).toEqual([]);
  });

  it("kein englisches Wort in Ankündigung, Frage-Rahmen und Auflösung", () => {
    const funde = fr
      .map((p) => ({ p, w: englischIn(p.text) }))
      .filter((x) => x.w.length > 0)
      .map((x) => `${x.p.quelle} [${x.p.art}]: „${x.p.text}" [${x.w.join(", ")}]`);
    expect([...new Set(funde)]).toEqual([]);
  });

  it("jede französische Fassung unterscheidet sich von der englischen (kein Rückfall)", () => {
    let verglichen = 0;
    const gleich: string[] = [];
    for (const p of fr) {
      const e = enNach.get(p.schluessel);
      if (e === undefined) continue;
      verglichen += 1;
      if (e === p.text) gleich.push(`${p.quelle} [${p.art}]: „${p.text}"`);
    }
    expect(verglichen).toBeGreaterThan(200);
    expect([...new Set(gleich)]).toEqual([]);
  });

  it("Namen, Hinweise, Fehlerstelle und Totasten: französisch, weder deutsch noch englisch", () => {
    const frFest = feste("fr");
    const enFest = feste("en");
    const funde: string[] = [];
    frFest.forEach((x, i) => {
      const d = deutschIn(x.text);
      const e = englischIn(x.text);
      if (d.length || e.length) funde.push(`${x.quelle}: „${x.text}" [${[...d, ...e].join(", ")}]`);
      if (!x.text.trim()) funde.push(`${x.quelle}: leer`);
      if (x.text === enFest[i].text) funde.push(`${x.quelle}: gleich wie Englisch („${x.text}")`);
    });
    expect(funde).toEqual([]);
  });

  it("Stichproben: die Sätze, wie ein Kind sie hört", () => {
    const f = findeFehlerstelle("Hau", "Haus")!;
    expect(fehlerSatz(f, "fr")).toBe("Il manque la quatrième lettre. Ici, il faut s");
    expect(fehlerSatz(findeFehlerstelle("Huas", "Haus")!, "fr")).toBe("Deuxième lettre : u Ici, il faut a");
    expect(stellenName(12, "fr")).toBe("Lettre 12");
    expect(formName("buchstabensalat", "fr")).toBe("Lettres mélangées");
    expect(formName("lueckentext", "fr")).toBe("Texte à trous");
    expect(totasteAnsage({ tot: "^", dann: "e", zeichen: "ê" } as never, "fr")).toBe(
      "accent circonflexe, puis e",
    );
  });
});

describe("GEGENPROBE: derselbe Wächter liest wirklich", () => {
  it("mit Bedienung de findet er deutsche Wörter - in fast jeder Probe", () => {
    const de = sammle("de");
    const mitDeutsch = de.filter((p) => deutschIn(p.text).length > 0);
    expect(de.length).toBeGreaterThan(200);
    // Nicht jede Probe (ein Frage-Rahmen kann kurz sein), aber die grosse Mehrheit.
    // ★ 26.09.2026: gemessen 0,79 nach dem Zusammenführen von E10b-2 (mehr
    // kurze Rahmen) - die Schwelle 0,75 beweist weiter, dass der Wächter liest.
    expect(mitDeutsch.length / de.length).toBeGreaterThan(0.75);
    const fest = feste("de").filter((x) => deutschIn(x.text).length > 0);
    expect(fest.length).toBeGreaterThan(20);
  });

  it("mit Bedienung en findet er englische Wörter - in fast jeder Probe", () => {
    const en = sammle("en");
    const mitEnglisch = en.filter((p) => englischIn(p.text).length > 0);
    expect(mitEnglisch.length / en.length).toBeGreaterThan(0.8);
    const fest = feste("en").filter((x) => englischIn(x.text).length > 0);
    expect(fest.length).toBeGreaterThan(20);
  });
});
