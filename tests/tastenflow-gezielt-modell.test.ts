import { describe, expect, it } from "vitest";
import { GEZIELT_MAX, datumLokal, gezieltAus, gezieltFuerKind, gezieltWirksam, type Gezielt } from "../src/lib/typing/gezielt";

const heute = new Date(2026, 10, 13, 15, 30); // 13.11.2026, lokal
const g = (zeichen: string[], bis: string | null = null, anteil: Gezielt["anteil"] = "viel"): Gezielt => ({ zeichen, anteil, bis });

describe("gezieltAus: säubern", () => {
  it("behält einzelne, eindeutige Zeichen", () => {
    expect(gezieltAus({ zeichen: ["ö", "ä", "ö", "ß"], anteil: "wenig", bis: null })).toEqual(g(["ö", "ä", "ß"], null, "wenig"));
  });
  it("wirft Mehrfach-Zeichen, Leerzeichen, Leeres und Nicht-Texte hinaus", () => {
    const r = gezieltAus({ zeichen: ["ab", " ", "", 5, "\t", "k", null], anteil: "nur" });
    expect(r?.zeichen).toEqual(["k"]);
  });
  it("zählt ein Unicode-Zeichen jenseits der Grundebene als EIN Zeichen", () => {
    expect(gezieltAus({ zeichen: ["😀", "x"], anteil: "viel" })?.zeichen).toEqual(["😀", "x"]);
  });
  it(`höchstens ${GEZIELT_MAX}`, () => {
    const r = gezieltAus({ zeichen: [..."abcdefghijkl"], anteil: "viel" });
    expect(r?.zeichen).toEqual([..."abcdefgh"]);
  });
  it("unbekannter Anteil wird „viel“, ungültiges Datum wird null", () => {
    expect(gezieltAus({ zeichen: ["a"], anteil: "maximal", bis: "morgen" })).toEqual(g(["a"], null, "viel"));
  });
  it("Unsinn wird null; ein JSON-Text wird gelesen", () => {
    for (const roh of [null, undefined, 3, "x", [], { anteil: "viel" }, { zeichen: "ab" }]) expect(gezieltAus(roh)).toBeNull();
    expect(gezieltAus('{"zeichen":["ö"],"anteil":"viel","bis":"2026-12-01"}')).toEqual(g(["ö"], "2026-12-01"));
  });
});

describe("gezieltWirksam: Ablauf", () => {
  it("null, leer und abgelaufen sind aus", () => {
    expect(gezieltWirksam(null, heute)).toBeNull();
    expect(gezieltWirksam(g([]), heute)).toBeNull();
    expect(gezieltWirksam(g(["ö"], "2026-11-12"), heute)).toBeNull();
  });
  it("gilt bis Tagesende - heute ist noch drin, morgen nicht mehr", () => {
    const abend = new Date(2026, 10, 13, 23, 59);
    expect(gezieltWirksam(g(["ö"], "2026-11-13"), abend)).not.toBeNull();
    expect(gezieltWirksam(g(["ö"], "2026-11-13"), new Date(2026, 10, 14, 0, 1))).toBeNull();
  });
  it("ohne Datum gilt es unbefristet", () => {
    expect(gezieltWirksam(g(["ö"]), new Date(2030, 0, 1))).not.toBeNull();
  });
  it("datumLokal füllt auf", () => {
    expect(datumLokal(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("gezieltFuerKind: Vorrang Kind vor Klasse", () => {
  const klasse = g(["ß"], null, "wenig");
  const kind = g(["ö"], null, "nur");
  it("Kind gesetzt: das Kind", () => expect(gezieltFuerKind(kind, klasse, heute)).toEqual(kind));
  it("Kind null oder undefined: die Klasse", () => {
    expect(gezieltFuerKind(null, klasse, heute)).toEqual(klasse);
    expect(gezieltFuerKind(undefined, klasse, heute)).toEqual(klasse);
  });
  it("Kind {zeichen: []} heisst: aus für dieses Kind, auch wenn die Klasse etwas will", () => {
    expect(gezieltFuerKind(g([]), klasse, heute)).toBeNull();
  });
  it("ein abgelaufenes Kind-Feld: danach gilt wieder die Klasse", () => {
    expect(gezieltFuerKind(g(["ö"], "2026-11-01"), klasse, heute)).toEqual(klasse);
  });
  it("beides leer: null; abgelaufene Klasse: null", () => {
    expect(gezieltFuerKind(null, null, heute)).toBeNull();
    expect(gezieltFuerKind(null, g(["ß"], "2026-11-01"), heute)).toBeNull();
  });
});
