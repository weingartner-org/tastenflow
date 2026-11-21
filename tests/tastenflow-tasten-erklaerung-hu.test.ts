/**
 * ★ O-HU (29.10.2026): Wächter über „Billentyűk felfedezése" / „Billentyűk keresése" auf Ungarisch
 * (`src/lib/typing/tastenErklaerungHu.ts`, über den Verteiler `tastenErklaerung.ts` mit Sprache "hu").
 *
 * Geprüft wird, was für JEDE Taste gelten muss: ein eigener ungarischer Satz (nicht der englische Rückfall), nur Bindestrich,
 * kein deutsches und kein englisches Wort, keine Maus-Wörter, keine Zahl mit Punkt am Satzende (Glossar §4 Falle 4), kein
 * Tastenname mit Endung. Der Inhalt jedes Satzes ist Abnahme von Hand (Glossar [G]: Erstsprachler fehlt noch).
 * Die Gegenproben stehen daneben - ein Wächter, der beim ersten Lauf grün ist, beweist nichts.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { suchbareTasten, tastenFuer, type TastenName } from "../src/lib/computer/tastenNamen";
import { DIGIT_ORDER, PUNCT_ORDER, SHIFT_UNIT, SYMBOL_ORDER, unitLabelEn } from "../src/lib/typing/letters";
import type { LayoutId } from "../src/lib/typing/layouts";
import { alleZeichen, erklaerungFuerSprache, erkundeTaste } from "../src/lib/typing/tastenErklaerung";
import { suchSatzEn } from "../src/lib/typing/tastenErklaerungEn";
import {
  AKZENTE_HU,
  EIGENE_KOMBINATIONEN_HU,
  ORT_HU,
  TASTEN_SATZ_HU,
  TASTE_KURZ_HU,
  ZEICHEN_HU,
  aufzaehlungHu,
  suchSatzHu,
  unitLabelHu,
  wirkungHu,
  zeichenNameHu,
} from "../src/lib/typing/tastenErklaerungHu";

const PLATTFORMEN: Plattform[] = ["windows", "macos"];
const LAYOUTS: LayoutId[] = ["hu", "hu-101", "de"];
const ARTEN = ["daneben", "gefunden", "weiter", "fertig"] as const;

const ev = (key: string, code?: string, extra: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...extra,
});

/** Alle Kennungen der Wirkungen, die der englische Katalog kennt (dieselbe Liste wie `WIRKUNG_EN`). */
const WIRKUNG_IDS = [
  "kopieren", "einfuegen", "ausschneiden", "rueckgaengig", "wiederherstellen", "alles-markieren", "markieren-zeichen",
  "markieren-wort", "spalte-markieren", "zeile-markieren", "oeffnen", "umbenennen", "neuer-ordner", "papierkorb",
  "duplizieren", "ebene-hoeher", "adressleiste", "eigenschaften", "uebersicht", "bewegen", "ansicht-details", "speichern",
  "speichern-unter", "fett", "kursiv", "unterstreichen", "ueberschrift1", "ueberschrift2", "standard-format", "links",
  "zentriert", "zeilenumbruch", "rechtschreibung", "fensterbereiche", "suchen", "ersetzen", "gehe-zu-zelle",
  "zelle-bearbeiten", "zelle-formatieren", "zum-rand", "autosumme", "ausfuellen-unten", "ausfuellen-rechts",
  "absoluter-bezug", "datum", "uhrzeit", "kommentar", "autofilter", "blattwechsel", "neues-blatt", "neu-laden",
  "lesezeichen", "verlauf", "senden", "nachricht-loeschen", "sr-stopp",
];

const NACH_KEY = [
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`), "Home", "End", "PageUp", "PageDown", "Insert", "NumLock", "Clear",
  "ContextMenu", "PrintScreen", "ScrollLock", "Pause", "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute", "Fn", "Dead",
];

/** JEDER Text, den die Datei je liefert - alle Felder, alle Funktionen für alle Tasten, Plattformen und Tastaturen. */
function alleTexte(): string[] {
  const t: string[] = [];
  const s = TASTEN_SATZ_HU;
  for (const p of PLATTFORMEN) {
    for (const l of LAYOUTS) {
      for (const k of tastenFuer(p)) {
        const e = s.sondertaste(k.id, p, l);
        if (e) t.push(e.name, e.kurz ?? "", ...e.was);
      }
      for (const key of NACH_KEY) {
        const e = s.nachKey(key, p, l);
        if (e) t.push(e.name, e.kurz ?? "", ...e.was);
      }
    }
    for (const id of WIRKUNG_IDS) t.push(s.wirkung(id, p) ?? "");
    for (const k of s.eigeneKombinationen[p]) t.push(k.was);
    const such = suchbareTasten(p);
    for (const art of ARTEN) for (let i = 0; i < such.length - 1; i++) t.push(...suchSaetze(art, such, i, p));
  }
  t.push(...Object.values(s.tasteKurz), ...Object.values(s.ort));
  for (const [ch, z] of Object.entries(s.zeichen)) t.push(z.name ?? "", ...z.was, s.zeichenName(ch));
  for (const a of Object.values(s.akzente)) t.push(a.name, ...a.was);
  const w = s.erkundenWoerter;
  t.push(w.kombination, w.kombiUnbekannt, w.mit, w.akzentTaste, w.unbekannt, w.taste("F13"));
  t.push(s.aufzaehlung(["a", "b", "c"]));
  for (const u of [SHIFT_UNIT, ...DIGIT_ORDER, ...PUNCT_ORDER, ...SYMBOL_ORDER, ..."abcxyzáéíóöőúüű"]) t.push(unitLabelHu(u));
  return t.filter((x) => x !== "");
}

/** Die Suchsätze eines Schritts - mit gedrückter Taste und ohne (unbekannte Taste). */
function suchSaetze(art: (typeof ARTEN)[number], such: readonly TastenName[], i: number, p: Plattform): string[] {
  const andere = such[(i + 1) % such.length]!;
  return [suchSatzHu(art, andere, such, i, p), suchSatzHu(art, null, such, i, p)];
}

/** Was an einem ungarischen Text nicht stimmt - leer heisst: in Ordnung. */
function fehler(text: string): string[] {
  const f: string[] = [];
  if (/[–—]/.test(text)) f.push("Gedankenstrich");
  // Deutsche Wörter (Tastennamen der deutschen Kappe nur im Satz „A német billentyűzeten … a felirata.").
  const ohneDeutscheKappe = text.replace(/A német billentyűzeten .+? a felirata\./, "");
  // („Tastenflow" ist der Name des Programms; „mit" ist auch ungarisch: „was".)
  if (/Taste(?!nflow)|drücken|drück|Leertaste|Umschalt|Zeichen|springt|Eingabe|Strg|Entf|Pos 1|Bild ↑|\bund\b/.test(ohneDeutscheKappe)) {
    f.push("deutsches Wort");
  }
  // Englische Wörter (Kappen wie Shift, Enter, Caps Lock sind erlaubt).
  if (/\b(key|press|the|with|and|moves|letter|capital|digit|arrow|space bar|Found|Got it|Find)\b/i.test(text)) {
    f.push("englisches Wort");
  }
  // Keine Maus-Wörter (Glossar Regel 8).
  if (/kattint|koppint|egér|húzd|klick|click/i.test(text)) f.push("Maus-Wort");
  // Keine Zahl mit Punkt am Satzende (Falle 4) - auch nicht mitten im Text vor dem nächsten Satz.
  if (/\d\.(\s|$)/.test(text)) f.push("Zahl mit Punkt");
  // Falsche Zeichen (Latin-1-Falle H5).
  if (/[õû]/.test(text) && !/hullámvonallal|kalappal/.test(text)) f.push("õ/û statt ő/ű");
  // Tastenname mit Endung („Shifttel", „Enterrel", „Backspace-szel").
  if (/\b(Shift|Enter|Tab|Ctrl|Alt|AltGr|Esc|Delete|Backspace|Insert|Home|End)(-?[a-záéíóöőúüű]{2,})/.test(text)) {
    f.push("Tastenname mit Endung");
  }
  return f;
}

describe("★ O-HU: jede Wörterbuch-Taste hat einen UNGARISCHEN Satz", () => {
  for (const p of PLATTFORMEN) {
    for (const l of LAYOUTS) {
      it(`${p} · ${l}`, () => {
        const fehlt: string[] = [];
        const englisch: string[] = [];
        for (const t of tastenFuer(p)) {
          const hu = erklaerungFuerSprache(t.id, p, l, "hu");
          if (!hu) {
            fehlt.push(t.id);
            continue;
          }
          const en = erklaerungFuerSprache(t.id, p, l, "en");
          if (JSON.stringify(hu) === JSON.stringify(en)) englisch.push(t.id);
        }
        expect(fehlt).toEqual([]);
        expect(englisch).toEqual([]);
      });
    }
  }

  it("jede Taste ist billentyű im Namen (Regel 11), jeder Satz endet mit Punkt", () => {
    for (const p of PLATTFORMEN) {
      for (const t of tastenFuer(p)) {
        const e = TASTEN_SATZ_HU.sondertaste(t.id, p, "hu")!;
        expect(e.name, t.id).toMatch(/billentyű$/);
        for (const s of e.was) expect(s.trim(), `${t.id}: ${s}`).toMatch(/[.?]$/);
        expect(TASTE_KURZ_HU[t.id], t.id).toBeTruthy();
      }
    }
  });
});

describe("★ O-HU: im ganzen Objekt kein – —, kein Deutsch, kein Englisch, keine Maus", () => {
  it("alle Texte sind sauber", () => {
    const texte = alleTexte();
    expect(texte.length).toBeGreaterThan(500);
    const schlecht = texte.map((t) => [t, fehler(t)] as const).filter(([, f]) => f.length > 0);
    expect(schlecht).toEqual([]);
  });

  it("Gegenprobe: die Prüfung schlägt an", () => {
    expect(fehler("a – b")).toContain("Gedankenstrich");
    expect(fehler("Drücke die Taste.")).toContain("deutsches Wort");
    expect(fehler("Press the Tab key.")).toContain("englisches Wort");
    expect(fehler("Kattints a gombra.")).toContain("Maus-Wort");
    expect(fehler("Sor: 3/12.")).toContain("Zahl mit Punkt");
    expect(fehler("Nyomd meg a Shifttel.")).toContain("Tastenname mit Endung");
    expect(fehler("A német billentyűzeten Strg a felirata.")).toEqual([]);
  });
});

describe("★ O-HU: über den Verteiler (Tasten erkunden mit Sprache hu)", () => {
  const opt = { sprache: "hu" as const, layout: "hu" as LayoutId };

  it("Tab: ungarischer Satz, nicht der englische", () => {
    const hu = erkundeTaste(ev("Tab", "Tab"), "windows", opt);
    const en = erkundeTaste(ev("Tab", "Tab"), "windows", { ...opt, sprache: "en" });
    expect(hu.ansage).not.toBe(en.ansage);
    expect(hu.zeile).toBe(
      "Tab billentyű - a következő elemre lép, például egy hivatkozásra, egy szövegmezőre vagy egy gombra. " +
        "A Shift billentyűvel együtt visszalép.",
    );
  });

  it("jedes Zeichen der deutschen Tabelle und jeder ungarische Buchstabe: ungarisch, ohne Fehler", () => {
    const zeichen = [...alleZeichen(), ..."0123456789áéíóöőúüűÁÉÍÓÖŐÚÜŰaAzZ"];
    const schlecht: string[] = [];
    for (const ch of zeichen) {
      const aus = erkundeTaste(ev(ch), "windows", opt);
      const f = [...fehler(aus.zeile), ...fehler(aus.ansage)];
      if (f.length) schlecht.push(`${ch}: ${f.join(", ")} - ${aus.ansage}`);
    }
    expect(schlecht).toEqual([]);
  });

  it("jedes Zeichen der deutschen Tabelle hat einen eigenen ungarischen Eintrag", () => {
    expect(alleZeichen().filter((ch) => !ZEICHEN_HU[ch])).toEqual([]);
  });

  it("Buchstabennamen nach Glossar §2.8", () => {
    expect(zeichenNameHu("ő")).toBe("hosszú ő");
    expect(zeichenNameHu("Ő")).toBe("nagy hosszú Ő");
    expect(zeichenNameHu("Ö")).toBe("nagy Ö");
    expect(zeichenNameHu("A")).toBe("nagy A");
    expect(zeichenNameHu("5")).toBe("öt");
    expect(TASTEN_SATZ_HU.aufdruckGross("ű")).toBe("Ű");
  });

  it("Akzente, Orte, eigene Kombinationen, Wirkungen sind ungarisch", () => {
    expect(Object.keys(AKZENTE_HU).sort()).toEqual(["akut", "gravis", "trema", "zirkumflex"]);
    expect(Object.keys(ORT_HU).length).toBeGreaterThanOrEqual(9);
    expect(EIGENE_KOMBINATIONEN_HU.windows.length).toBe(2);
    expect(WIRKUNG_IDS.filter((id) => wirkungHu(id, "windows") === null)).toEqual([]);
    expect(aufzaehlungHu(["a Word programban", "az Excel programban", "a böngészőben"])).toBe(
      "a Word programban, az Excel programban és a böngészőben",
    );
  });
});

describe("★ O-HU: unitLabelHu", () => {
  it("Buchstaben, Ziffern, Satz- und Sonderzeichen und Shift: ungarisch", () => {
    expect(unitLabelHu(SHIFT_UNIT)).toBe("nagybetűk");
    expect(unitLabelHu("r")).toBe("R");
    expect(unitLabelHu("ő")).toBe("Ő");
    expect(unitLabelHu("5")).toBe("számjegy: 5");
    expect(unitLabelHu(".")).toBe("pont");
    expect(unitLabelHu("@")).toBe("kukac");
    // Satz- und Sonderzeichen: ein eigener Name, nicht der englische, nicht das nackte Zeichen.
    const gleich = [...PUNCT_ORDER, ...SYMBOL_ORDER].filter((u) => unitLabelHu(u) === unitLabelEn(u) || unitLabelHu(u) === u);
    expect(gleich).toEqual([]);
  });
});

describe("★ O-HU: suchSatzHu für alle vier Arten", () => {
  const such = suchbareTasten("windows");
  const tab = such.find((t) => t.id === "tabulator")!;
  const shift = such.find((t) => t.id === "umschalt")!;
  const caps = such.find((t) => t.id === "feststell")!;

  it("daneben · gefunden · weiter · fertig", () => {
    expect(suchSatzHu("daneben", shift, [tab, shift], 0, "windows")).toBe(
      "Ez a Shift billentyű. Keresd meg a Tab billentyűt. Bal kisujj: egy billentyűsorral feljebb, a szélen.",
    );
    expect(suchSatzHu("daneben", null, [tab, shift], 0, "windows")).toBe(
      "Ezt a billentyűt itt nem gyakoroljuk. Keresd meg a Tab billentyűt.",
    );
    expect(suchSatzHu("gefunden", tab, [tab, shift], 0, "windows")).toBe(
      "Megvan! Nyomj meg egy másik billentyűt, aztán újra a Tab billentyűt.",
    );
    expect(suchSatzHu("weiter", tab, [tab, shift], 0, "windows")).toBe(
      "Sikerült! Keresd meg a Shift billentyűt. Kettő van: az alsó sor bal és jobb szélén.",
    );
    expect(suchSatzHu("fertig", shift, [tab, shift], 1, "windows")).toBe(
      "Sikerült! Megtalált billentyűk: 2/2, szép munka.",
    );
    expect(suchSatzHu("weiter", caps, [caps, tab], 0, "windows")).toMatch(/^Sikerült! Most csak nagybetűk jönnek\?/);
  });

  it("jede suchbare Taste, jede Art, beide Plattformen: anders als Englisch, höchstens ein Ausrufezeichen", () => {
    const schlecht: string[] = [];
    for (const p of PLATTFORMEN) {
      for (const art of ARTEN) {
        const s = suchbareTasten(p);
        for (let i = 0; i < s.length - 1; i++) {
          const hu = suchSatzHu(art, s[i + 1]!, s, i, p);
          if (hu === suchSatzEn(art, s[i + 1]!, s, i, p)) schlecht.push(`${p} ${art} ${s[i]!.id}: englisch`);
          if ((hu.match(/!/g) ?? []).length > 1) schlecht.push(`${p} ${art} ${s[i]!.id}: zwei Ausrufezeichen`);
          if (/billentyű: /.test(hu)) schlecht.push(`${p} ${art} ${s[i]!.id}: Sicherheitsnetz statt Eintrag`);
        }
      }
    }
    expect(schlecht).toEqual([]);
  });
});
