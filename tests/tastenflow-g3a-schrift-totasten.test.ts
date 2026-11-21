/**
 * ★★★ G3a-SCHRIFT (25.10.2026, Leitfaden Falle 50/55/69): Totasten als EIGENSCHAFT je Sprache und die Zerlegung (NFD)
 * nur dort, wo ein Zeichen wirklich aus Totaste + Grundbuchstabe entsteht.
 *  · Jede bestehende Tastatur liefert dieselbe Kombizeichen-Liste wie vorher.
 *  · Griechisch: Tonos `΄`, Dialytika `¨`, Dialytika mit Tonos `΅` (ΐ ΰ - zwei Zeichen daran) sind kein Fehlgriff.
 *  · й, ї, ő, ă, ș, ț, å, ç sind in ihrer Sprache EIN Buchstabe; ά, ΐ, ã, õ, ё zerfallen.
 */
import { describe, expect, it } from "vitest";
import {
  KOMBIZEICHEN,
  KOMBIZEICHEN_CS,
  KOMBIZEICHEN_EL,
  istTotasteDerListen,
  kombizeichenDerSprache,
  kombizeichenFuerLayout,
  kombizeichenZu,
  type Kombizeichen,
} from "../src/lib/typing/totasten";
import { LAYOUTS, layoutSprache, zugangFuer, type KeyboardLayout } from "../src/lib/typing/layouts";
import { deuteAnschlag } from "../src/lib/typing/anschlagDeuten";
import { ALLE_SPRACHEN, GERUEST_SPRACHEN, eigenerBuchstabe, zerlegeZeichen } from "../src/lib/typing/sprachRegister";
import { totasteName, umschaltVorTilde } from "../src/lib/typing/totastenTexte";
import { LERNWEGE_LISTE, lernwegDef } from "../src/lib/typing/lernweg";
import type { Lang } from "../src/lib/typing/account";

const ALTE: readonly Lang[] = ALLE_SPRACHEN.filter((s) => !(GERUEST_SPRACHEN as readonly Lang[]).includes(s));

/** Die Liste, wie `kombizeichenListe` sie VOR G3a rechnete (Kopie). */
function alteListe(layout: KeyboardLayout): readonly Kombizeichen[] {
  return layoutSprache(layout) === "cs" ? [...KOMBIZEICHEN, ...KOMBIZEICHEN_CS] : KOMBIZEICHEN;
}
/** `hatEigeneTaste` aus totasten.ts (Kopie). */
function hatEigeneTaste(layout: KeyboardLayout, zeichen: string): boolean {
  if (layout.rows.some((r) => r.keys.includes(zeichen))) return true;
  const a = layout.access[zeichen];
  return a !== undefined && a.dead !== true;
}

describe("die acht Sprachen vor dem 25.10.2026: Kombizeichen wie vorher", () => {
  it("jede bestehende Tastatur liefert dieselbe Liste wie vorher", () => {
    expect(LAYOUTS.length).toBeGreaterThan(15);
    // ★ G4-NAHT (25.10.2026): seit dem Zusammenführen mit G3b gibt es die Tastaturen der neun Wege - sie haben ihre neuen
    // Listen (Wächter `tastenflow-g4-naht-totasten`). „Bestehend" heisst: eine Tastatur der acht Sprachen davor.
    for (const l of LAYOUTS.filter((x) => (ALTE as readonly Lang[]).includes(layoutSprache(x)))) {
      const vorher = alteListe(l).filter((k) => zugangFuer(l, k.tot)?.dead === true && !hatEigeneTaste(l, k.zeichen));
      expect(kombizeichenFuerLayout(l), l.id).toEqual(vorher);
    }
  });

  it("je Sprache: dieselbe Liste wie vorher (cs mit Háček, alle anderen die gemeinsame)", () => {
    for (const s of ALTE) {
      expect(kombizeichenDerSprache(s), s).toEqual(s === "cs" ? [...KOMBIZEICHEN, ...KOMBIZEICHEN_CS] : KOMBIZEICHEN);
    }
  });

  it("`istTotasteDerListen` mit Weg sagt für jede Einheit jedes Weges dasselbe wie ohne (alte Wege)", () => {
    for (const w of LERNWEGE_LISTE.filter((x) => (ALTE as readonly string[]).includes(x))) {
      const d = lernwegDef(w);
      for (const u of [...d.letterOrder, ...d.punctOrder, ...d.symbolOrder]) {
        expect(istTotasteDerListen(u, w), `${w} ${u}`).toBe(istTotasteDerListen(u));
      }
    }
  });

  it("Gegenprobe: der Tonos ist nur mit der Sprache el eine Totaste der Listen", () => {
    expect(istTotasteDerListen("΄")).toBe(false);
    expect(istTotasteDerListen("΄", "el")).toBe(true);
    expect(istTotasteDerListen("΅", "el")).toBe(true);
    expect(istTotasteDerListen("'", "nl")).toBe(true);
    expect(istTotasteDerListen("'", "en")).toBe(false);
  });
});

describe("die neun Sprachen: Listen", () => {
  it("jede Sprache hat einen Eintrag, jedes Kombizeichen besteht aus Totaste + Grundbuchstabe (NFC = NFD-Teile)", () => {
    for (const s of GERUEST_SPRACHEN) {
      for (const k of kombizeichenDerSprache(s)) {
        expect([...k.zeichen].length, `${s} ${k.zeichen}`).toBe(1);
        expect(zerlegeZeichen(k.zeichen)[0], `${s} ${k.zeichen}`).toBe(k.dann);
      }
    }
  });
  it("bg, uk, hu, ro: keine Kombizeichen; el NUR die griechischen; pt/br mit Tilde; nl mit ' und \"", () => {
    for (const s of ["bg", "uk", "hu", "ro"] as const) expect(kombizeichenDerSprache(s), s).toEqual([]);
    expect(kombizeichenDerSprache("el")).toEqual(KOMBIZEICHEN_EL);
    expect(kombizeichenDerSprache("pt").map((k) => k.zeichen)).toEqual(expect.arrayContaining(["ã", "õ", "á", "ê", "à"]));
    expect(kombizeichenDerSprache("br")).toEqual(kombizeichenDerSprache("pt"));
    const nl = kombizeichenDerSprache("nl");
    expect(nl.find((k) => k.zeichen === "é" && k.tot === "'")).toBeDefined();
    expect(nl.find((k) => k.zeichen === "ë" && k.tot === "\"")).toBeDefined();
    expect(kombizeichenDerSprache("sv").find((k) => k.zeichen === "é")?.tot).toBe("´");
  });
});

/** Eine Wegwerf-Tastatur „Griechisch" nach der Windows-Tabelle (nur die Grundreihe und die drei Totasten). */
function griechischeTestTastatur(): KeyboardLayout {
  const us = LAYOUTS.find((l) => l.id === "us")!;
  return {
    ...us,
    id: "us",
    sprache: "el",
    rows: [
      us.rows[0],
      { ...us.rows[1], keys: [";", "ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "[", "]"] },
      { ...us.rows[2], keys: ["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ", "΄", "'"] },
      { ...us.rows[3], keys: ["ζ", "χ", "ψ", "ω", "β", "ν", "μ", ",", ".", "/"] },
    ],
    access: {
      "΄": { base: "΄", dead: true },
      "¨": { base: "΄", mod: "shift", dead: true },
      "΅": { base: "΄", mod: "altgr", dead: true },
    },
    missing: [],
    ersatz: {},
    capsUpper: [],
  } as KeyboardLayout;
}

describe("Griechisch: Tonos ist kein Fehler (Falle 55)", () => {
  const el = griechischeTestTastatur();
  it("Totaste Tonos, dann α ⇒ „ά“ ist ein Zeichen, kein Fehlgriff", () => {
    const tot = deuteAnschlag({ key: "Dead", code: "Semicolon" }, null, el);
    expect(tot.deutung).toEqual({ art: "totaste", tot: "΄" });
    expect(deuteAnschlag({ key: "ά", code: "KeyA" }, tot.offen, el).deutung).toEqual({ art: "zeichen", zeichen: "ά" });
    expect(deuteAnschlag({ key: "Ώ", code: "KeyV", shiftKey: true }, tot.offen, el).deutung.art).toBe("zeichen");
  });
  it("Dialytika mit Tonos ⇒ „ΐ“ (zwei Zeichen daran) ist ein Zeichen; Dialytika ⇒ „ϊ“", () => {
    expect(deuteAnschlag({ key: "ΐ" }, { tot: "΅" }, el).deutung).toEqual({ art: "zeichen", zeichen: "ΐ" });
    expect(deuteAnschlag({ key: "ϊ" }, { tot: "¨" }, el).deutung).toEqual({ art: "zeichen", zeichen: "ϊ" });
  });
  it("Gegenprobe: Tonos, dann π ⇒ Fehlgriff; Tonos, dann ΐ ⇒ Fehlgriff (falsche Totaste)", () => {
    expect(deuteAnschlag({ key: "π" }, { tot: "΄" }, el).deutung.art).toBe("fehlgriff");
    expect(deuteAnschlag({ key: "ΐ" }, { tot: "΄" }, el).deutung.art).toBe("fehlgriff");
  });
  it("Totaste, dann Leertaste ⇒ der Tonos allein", () => {
    expect(deuteAnschlag({ key: "΄" }, { tot: "΄" }, el).deutung).toEqual({ art: "zeichen", zeichen: "΄" });
  });
  it("kombizeichenZu: ά, Ά (Totaste, dann Umschalt + Α), ΐ", () => {
    expect(kombizeichenZu("ά", el)).toMatchObject({ tot: "΄", dann: "α" });
    expect(kombizeichenZu("Ά", el)).toMatchObject({ zeichen: "Ά", tot: "΄", dann: "Α" });
    expect(kombizeichenZu("ΐ", el)).toMatchObject({ tot: "΅", dann: "ι" });
    expect(kombizeichenZu("φ", el)).toBeUndefined();
  });
});

describe("weitere neue Totasten (anschlagDeuten `KOMBINIEREND_NEU`)", () => {
  const us = LAYOUTS.find((l) => l.id === "us")!;
  it.each([
    ["'", "é"], ["'", "ç"], ["\"", "ë"], ["˝", "ő"], ["˝", "Ű"], ["˘", "ă"], ["˛", "ą"], ["˙", "ż"],
  ])("Totaste %s, dann „%s“ ⇒ Zeichen", (tot, key) => {
    expect(deuteAnschlag({ key }, { tot }, us).deutung).toEqual({ art: "zeichen", zeichen: key });
  });
  it("Gegenprobe: Totaste ' dann p ⇒ Fehlgriff; ˝ dann ö ⇒ Fehlgriff", () => {
    expect(deuteAnschlag({ key: "p" }, { tot: "'" }, us).deutung.art).toBe("fehlgriff");
    expect(deuteAnschlag({ key: "ö" }, { tot: "˝" }, us).deutung.art).toBe("fehlgriff");
  });
  it("unverändert (bewusst, Befund §6): Kroužek ° dann ů bleibt wie vorher ein Fehlgriff", () => {
    expect(deuteAnschlag({ key: "ů" }, { tot: "°" }, us).deutung.art).toBe("fehlgriff");
  });
});

describe("NFD nur, wo das Zeichen wirklich zusammengesetzt entsteht", () => {
  it.each([
    ["bg", "й"], ["bg", "Й"], ["uk", "й"], ["uk", "ї"], ["uk", "Ї"], ["hu", "ő"], ["hu", "ű"], ["hu", "á"],
    ["ro", "ș"], ["ro", "ț"], ["ro", "ă"], ["sv", "å"], ["sv", "ä"], ["pt", "ç"], ["br", "ç"],
  ] as const)("%s: „%s“ ist EIN Buchstabe - bleibt ganz", (s, z) => {
    expect(eigenerBuchstabe(z, s)).toBe(true);
    expect(zerlegeZeichen(z, s)).toEqual([z]);
    expect(zerlegeZeichen(z).length).toBeGreaterThan(1); // Gegenprobe: ohne Sprache zerfällt es
  });
  it.each([
    ["el", "ά", 2], ["el", "ΐ", 3], ["pt", "ã", 2], ["pt", "õ", 2], ["uk", "ё", 2], ["sv", "é", 2], ["nl", "ë", 2],
  ] as const)("%s: „%s“ zerfällt in %i Teile (Totaste + Grundbuchstabe)", (s, z, n) => {
    expect(eigenerBuchstabe(z, s)).toBe(false);
    expect(zerlegeZeichen(z, s).length).toBe(n);
  });
  it("die acht Sprachen davor: keine eigenen Buchstaben - die Zerlegung bleibt", () => {
    for (const s of ALTE) for (const z of "äöüéèñçčěůőй") expect(eigenerBuchstabe(z, s), `${s} ${z}`).toBe(false);
  });
  it("Hinweis „Umschalt vor der Tilde-Taste“ nie für einen eigenen Buchstaben (ungarisch á)", () => {
    expect(umschaltVorTilde("á", "ä")).toBe(true);
    expect(umschaltVorTilde("á", "ä", "es")).toBe(true);
    expect(umschaltVorTilde("á", "ä", "hu")).toBe(false);
  });
});

describe("Namen der neuen Totasten", () => {
  it("de/en tragen Namen, die anderen Bedienungen fallen auf Englisch", () => {
    expect(totasteName("΄", "de")).toBe("Tonos");
    expect(totasteName("΄", "en")).toBe("tonos");
    expect(totasteName("΅", "de")).toBe("Dialytika mit Tonos");
    expect(totasteName("˝", "de")).toBe("Doppelakut");
    expect(totasteName("΄", "fr")).toBe("tonos");
  });
  it("die bisherigen Namen bleiben (´ und ~ ohne Namen in de, ^ Zirkumflex)", () => {
    expect(totasteName("^", "de")).toBe("Zirkumflex");
    expect(totasteName("´", "de")).toBeNull();
    expect(totasteName("~", "de")).toBeNull();
    expect(totasteName("´", "es")).toBe("tilde");
  });
});
