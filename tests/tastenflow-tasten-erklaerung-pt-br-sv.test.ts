/**
 * ★ WÄCHTER O-INHALT-PT/BR/SV (29.10.2026): „Tasten erkunden" und die Tastennamen in Portugiesisch (Portugal), Portugiesisch
 * (Brasilien) und Schwedisch sind EIGENE Fassungen - kein Feld von `TASTEN_SATZ_<XX>` reicht mehr das Englische weiter, jede Tabelle
 * trägt jeden Schlüssel der tschechischen Fassung (Vorbild `tastenErklaerungCs.ts`), und jede Sondertaste, jede Taste nach
 * `KeyboardEvent.key` und jede Wirkung, die das Tschechische erklärt, erklärt auch die Sprache. Dazu die Hausregeln an jedem Satz:
 * nur Bindestrich, höchstens ein „!", keine Maus-Wörter, kein englischer Satz.
 */
import { describe, expect, it } from "vitest";
import type { Plattform } from "../src/lib/computer/model";
import * as CS from "../src/lib/typing/tastenErklaerungCs";
import * as EN from "../src/lib/typing/tastenErklaerungEn";
import { unitLabelEn } from "../src/lib/typing/letters";
import * as PT from "../src/lib/typing/tastenErklaerungPt";
import * as BR from "../src/lib/typing/tastenErklaerungBr";
import * as SV from "../src/lib/typing/tastenErklaerungSv";
import type { TastenErklaerungSatz } from "../src/lib/typing/tastenErklaerungSatz";
import type { LayoutId } from "../src/lib/typing/layouts";

const PLATTFORMEN: Plattform[] = ["windows", "macos"];

const SPRACHEN: readonly (readonly [
  string,
  TastenErklaerungSatz,
  (unit: string) => string,
  typeof EN.suchSatzEn,
  LayoutId,
  RegExp,
])[] = [
  ["pt", PT.TASTEN_SATZ_PT, PT.unitLabelPt, PT.suchSatzPt, "pt", /\b(clica|clique|clicar|arrasta|arrastar|rato)\b|\bvocê\b|\b(tela|arquivo|aba)\b/i],
  ["br", BR.TASTEN_SATZ_BR, BR.unitLabelBr, BR.suchSatzBr, "br-abnt2", /\b(clica|clique|clicar|arraste|arrastar|mouse)\b|\b(ecrã|ficheiro|separador)\b/i],
  ["sv", SV.TASTEN_SATZ_SV, SV.unitLabelSv, SV.suchSatzSv, "sv", /\b(klicka|klickar|klick|dra|musen)\b/i],
];

const STRICH = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`);

/** Alle Kennungen, die die Sprachen erklären müssen. */
const IDS = Object.keys(CS.TASTE_KURZ_CS);
const KEYS = ["F1", "F5", "F11", "F13", "Home", "End", "PageUp", "PageDown", "Insert", "NumLock", "Clear", "ContextMenu",
  "PrintScreen", "ScrollLock", "Pause", "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute", "Fn", "Dead", "x"];
const WIRKUNGEN = ["kopieren", "einfuegen", "ausschneiden", "rueckgaengig", "wiederherstellen", "alles-markieren", "markieren-zeichen",
  "markieren-wort", "spalte-markieren", "zeile-markieren", "oeffnen", "umbenennen", "neuer-ordner", "papierkorb", "duplizieren",
  "ebene-hoeher", "adressleiste", "eigenschaften", "uebersicht", "bewegen", "ansicht-details", "speichern", "speichern-unter", "fett",
  "kursiv", "unterstreichen", "ueberschrift1", "ueberschrift2", "standard-format", "links", "zentriert", "zeilenumbruch",
  "rechtschreibung", "fensterbereiche", "suchen", "ersetzen", "gehe-zu-zelle", "zelle-bearbeiten", "zelle-formatieren", "zum-rand",
  "autosumme", "ausfuellen-unten", "ausfuellen-rechts", "absoluter-bezug", "datum", "uhrzeit", "kommentar", "autofilter",
  "blattwechsel", "neues-blatt", "neu-laden", "lesezeichen", "verlauf", "senden", "nachricht-loeschen", "sr-stopp", "gibt-es-nicht"];

function texteVon(o: unknown, aus: string[] = []): string[] {
  if (typeof o === "string") aus.push(o);
  else if (o && typeof o === "object") for (const v of Object.values(o)) texteVon(v, aus);
  return aus;
}

describe.each(SPRACHEN)("Tasten erkunden %s", (sprache, satz, unitLabel, suchSatz, layout, verboten) => {
  it("kein Feld reicht das Englische weiter", () => {
    expect(satz.sondertaste).not.toBe(EN.sondertasteEn);
    expect(satz.nachKey).not.toBe(EN.nachKeyEn);
    expect(satz.tasteKurz).not.toBe(EN.TASTE_KURZ_EN);
    expect(satz.zeichen).not.toBe(EN.ZEICHEN_EN);
    expect(satz.zeichenName).not.toBe(EN.zeichenNameEn);
    expect(satz.akzente).not.toBe(EN.AKZENTE_EN);
    expect(satz.erkundenWoerter).not.toBe(EN.ERKUNDEN_WOERTER_EN);
    expect(satz.eigeneKombinationen).not.toBe(EN.EIGENE_KOMBINATIONEN_EN);
    expect(satz.wirkung).not.toBe(EN.wirkungEn);
    expect(satz.ort).not.toBe(EN.ORT_EN);
    expect(satz.aufzaehlung).not.toBe(EN.aufzaehlungEn);
    expect(unitLabel).not.toBe(unitLabelEn);
    expect(suchSatz).not.toBe(EN.suchSatzEn);
  });

  it("jede Tabelle trägt jeden Schlüssel der tschechischen Fassung", () => {
    const paare: [string, object, object][] = [
      ["tasteKurz", CS.TASTE_KURZ_CS, satz.tasteKurz],
      ["zeichen", CS.ZEICHEN_CS, satz.zeichen],
      ["ort", CS.ORT_CS, satz.ort],
      ["akzente", CS.AKZENTE_CS, satz.akzente],
      ["erkundenWoerter", CS.ERKUNDEN_WOERTER_CS, satz.erkundenWoerter],
    ];
    for (const [name, cs, eigen] of paare) {
      const fehlt = Object.keys(cs).filter((k) => !(k in eigen));
      expect(fehlt, `${name}: ${fehlt.join(" ")}`).toEqual([]);
    }
    for (const p of PLATTFORMEN) {
      expect(satz.eigeneKombinationen[p].length, p).toBe(CS.EIGENE_KOMBINATIONEN_CS[p].length);
    }
  });

  it("wo das Tschechische eine Taste oder Wirkung erklärt, erklärt sie auch diese Sprache", () => {
    const fehl: string[] = [];
    for (const p of PLATTFORMEN) {
      for (const l of [layout, "de", "us"] as LayoutId[]) {
        for (const id of IDS) if (CS.sondertasteCs(id, p, l) !== null && satz.sondertaste(id, p, l) === null) fehl.push(`sondertaste ${id} ${p} ${l}`);
        for (const k of KEYS) if (CS.nachKeyCs(k, p, l) !== null && satz.nachKey(k, p, l) === null) fehl.push(`nachKey ${k} ${p} ${l}`);
      }
      for (const w of WIRKUNGEN) if (CS.wirkungCs(w, p) !== null && satz.wirkung(w, p) === null) fehl.push(`wirkung ${w} ${p}`);
    }
    expect(fehl).toEqual([]);
  });

  it("Hausregeln an jedem Satz: nur Bindestrich, höchstens ein Ausrufezeichen, keine Maus-Wörter, kein englischer Satz", () => {
    const texte: string[] = [];
    const englisch = new Set<string>();
    for (const p of PLATTFORMEN) {
      for (const id of IDS) {
        texteVon(satz.sondertaste(id, p, layout), texte);
        texteVon(EN.sondertasteEn(id, p, "us"), []).forEach((t) => englisch.add(t));
      }
      for (const k of KEYS) texteVon(satz.nachKey(k, p, layout), texte);
      for (const w of WIRKUNGEN) {
        const t = satz.wirkung(w, p);
        if (t) texte.push(t);
      }
    }
    texteVon(satz.zeichen, texte);
    texteVon(satz.akzente, texte);
    texteVon(satz.erkundenWoerter, texte);
    texteVon(satz.eigeneKombinationen, texte);
    texteVon(satz.ort, texte);
    const fehl: string[] = [];
    for (const t of texte) {
      if (STRICH.test(t)) fehl.push(`Strich: ${t}`);
      if ((t.match(/!/g) ?? []).length > 1) fehl.push(`!!: ${t}`);
      if (verboten.test(t)) fehl.push(`Wort: ${t}`);
      if (t.split(" ").length >= 4 && englisch.has(t)) fehl.push(`englisch: ${t}`);
    }
    expect(fehl).toEqual([]);
  });

  it("die Aufzählung, die Namen der Einheiten und die Suchrunde sind in der Sprache", () => {
    const und = sprache === "sv" ? "och" : "e";
    expect(satz.aufzaehlung(["a", "b", "c"])).toBe(`a, b ${und} c`);
    expect(unitLabel(".")).not.toBe(unitLabelEn("."));
    expect(unitLabel("@")).not.toBe(unitLabelEn("@"));
    expect(satz.zeichenName(".")).not.toBe(EN.zeichenNameEn("."));
    expect(satz.aufdruckGross("a")).toBe("A");
  });
});
