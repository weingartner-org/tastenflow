import { afterEach, describe, expect, it } from "vitest";
import { adaptiveRound } from "../src/lib/typing/generator";
import { gezieltFuerRunde } from "../src/lib/typing/gezieltRunde";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { setLayout } from "../src/lib/typing/layouts";

const WEG = "de" as const;
const COUNT = 12;
const RUNDEN = 20;
const ALLE = introOrder(WEG);
// Mitte des Lehrgangs: Buchstaben, ⇧, ein paar Satzzeichen - aber (noch) nicht alles.
const INTRO = ALLE.slice(0, 24);

afterEach(() => setLayout("de"));

function runde(zeichen: string[], anteil: "wenig" | "viel" | "nur", intro = INTRO, count = COUNT) {
  const gz = gezieltFuerRunde({ zeichen, anteil, bis: null }, intro, WEG);
  expect(gz, `Zeichen ${zeichen.join("")} erreichbar`).not.toBeNull();
  return { gz: gz!, zeilen: adaptiveRound({ introduced: gz!.introFuerRunde, gezielt: gz!.gezielt, lernweg: WEG, lang: "de", count }) };
}
const mit = (t: string, z: string[]) => [...t.toLowerCase()].some((c) => z.includes(c));

describe("gezielte Runde (Weg de, Mitte des Lehrgangs)", () => {
  it("die Mitte hat ein gelerntes Zeichen, das wir wählen können", () => {
    expect(INTRO).toContain("k");
  });

  it("wenig: mindestens ein Drittel (aufgerundet) der Zeilen trägt ein gewähltes Zeichen, immer volle Runden", () => {
    for (let r = 0; r < RUNDEN; r++) {
      const { zeilen } = runde(["k", "m"], "wenig");
      expect(zeilen).toHaveLength(COUNT);
      expect(zeilen.filter((l) => mit(l.text, ["k", "m"])).length).toBeGreaterThanOrEqual(Math.ceil(COUNT / 3));
    }
  });

  it("viel: jede Zeile trägt ein gewähltes Zeichen", () => {
    for (let r = 0; r < RUNDEN; r++) {
      const { zeilen } = runde(["k", "m"], "viel");
      expect(zeilen).toHaveLength(COUNT);
      for (const l of zeilen) expect(mit(l.text, ["k", "m"]), l.text).toBe(true);
    }
  });

  it("nur: jede Zeile besteht NUR aus den gewählten Zeichen und Leerzeichen", () => {
    for (let r = 0; r < RUNDEN; r++) {
      const { zeilen } = runde(["k", "m"], "nur");
      expect(zeilen).toHaveLength(COUNT);
      for (const l of zeilen) {
        expect(l.text.trim().length).toBeGreaterThan(0);
        expect([...l.text].every((c) => c === " " || c === "k" || c === "m"), l.text).toBe(true);
        expect(l.source).toBeNull();
      }
    }
  });

  it("nur mit einem einzigen Zeichen: Zeilen aus diesem Zeichen", () => {
    const { zeilen } = runde(["k"], "nur");
    for (const l of zeilen) expect([...l.text].every((c) => c === " " || c === "k"), l.text).toBe(true);
  });

  it("ein Zeichen, das im Korpus kaum steht (§): volle Runden, jede Zeile trägt es", () => {
    for (let r = 0; r < RUNDEN; r++) {
      const { gz, zeilen } = runde(["§"], "viel");
      expect(gz.gezielt.zeichen).toEqual(["§"]);
      expect(zeilen).toHaveLength(COUNT);
      for (const l of zeilen) expect(l.text, l.text).toContain("§");
    }
  });

  it("§ mit „wenig“: auch dann mindestens ein Drittel", () => {
    for (let r = 0; r < RUNDEN; r++) {
      const { zeilen } = runde(["§"], "wenig");
      expect(zeilen).toHaveLength(COUNT);
      expect(zeilen.filter((l) => l.text.includes("§")).length).toBeGreaterThanOrEqual(Math.ceil(COUNT / 3));
    }
  });

  it("ein noch nicht gelernter Buchstabe wird vorgezogen und kommt vor - ohne dass intro verändert wird", () => {
    const nochNicht = ALLE.slice(24).find((u) => /^[a-zäöüß]$/.test(u) && u !== "y" && u !== "x" && u !== "q")!;
    expect(nochNicht, "es gibt einen noch nicht gelernten Buchstaben").toBeTruthy();
    expect(INTRO).not.toContain(nochNicht);
    const kopie = [...INTRO];
    for (let r = 0; r < 8; r++) {
      const { gz, zeilen } = runde([nochNicht], "viel", kopie);
      expect(gz.vorgezogen).toEqual([nochNicht]);
      expect(gz.introFuerRunde).toContain(nochNicht);
      expect(zeilen).toHaveLength(COUNT);
      for (const l of zeilen) expect(l.text.toLowerCase(), l.text).toContain(nochNicht);
    }
    expect(kopie).toEqual(INTRO); // nichts wurde in die Einheiten geschrieben
  });

  it("ein auf der Tastatur nicht erreichbares Zeichen fällt still heraus; sonst null", () => {
    expect(gezieltFuerRunde({ zeichen: ["😀"], anteil: "viel", bis: null }, INTRO, WEG)).toBeNull();
    const gz = gezieltFuerRunde({ zeichen: ["😀", "k"], anteil: "viel", bis: null }, INTRO, WEG);
    expect(gz?.gezielt.zeichen).toEqual(["k"]);
    expect(gezieltFuerRunde(null, INTRO, WEG)).toBeNull();
  });

  it("OHNE die Option ist die Runde dieselbe wie ohne den Schlüssel (leere Liste zählt als fehlend)", () => {
    const opts = { introduced: INTRO, lernweg: WEG, lang: "de" as const, count: COUNT };
    // Gleicher Zufall je Aufruf: dreimal dieselbe Zahlenfolge.
    const einzeln = (extra: object) => {
      let s = 777;
      const orig = Math.random;
      Math.random = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
      try {
        return adaptiveRound({ ...opts, ...extra }).map((l) => l.text);
      } finally {
        Math.random = orig;
      }
    };
    const a = einzeln({});
    expect(einzeln({ gezielt: undefined })).toEqual(a);
    expect(einzeln({ gezielt: { zeichen: [], anteil: "viel" } })).toEqual(a);
  });

  it("Umschalttaste im Stand: Runde bleibt voll", () => {
    const { zeilen } = runde(["k"], "wenig", [...INTRO, SHIFT_UNIT]);
    expect(zeilen).toHaveLength(COUNT);
  });
});

describe("Verteilung auf mehrere gewählte Zeichen (ö, ß, ?)", () => {
  const INTRO_FRUEH = [..."fjdkslaeinrthu"];
  const DREI = ["ö", "ß", "?"];
  for (const anteil of ["wenig", "viel"] as const) {
    it(`${anteil}: jedes Zeichen kommt in mindestens einer Zeile vor`, () => {
      for (let r = 0; r < RUNDEN; r++) {
        const { zeilen } = runde(DREI, anteil, INTRO_FRUEH, 8);
        expect(zeilen).toHaveLength(8);
        for (const z of DREI) expect(zeilen.some((l) => l.text.toLowerCase().includes(z)), `${z} in ${JSON.stringify(zeilen.map((l) => l.text))}`).toBe(true);
      }
    });
  }
  it("wenig: höchstens ceil(n/3)+1 Zeilen tragen überhaupt ein gewähltes Zeichen", () => {
    for (let r = 0; r < RUNDEN; r++) {
      const { zeilen } = runde(DREI, "wenig", INTRO_FRUEH, 8);
      expect(zeilen.filter((l) => mit(l.text, DREI)).length).toBeLessThanOrEqual(Math.ceil(8 / 3) + 1);
    }
  });
});
