/**
 * ★ G4-NAHT (25.10.2026, Befund G3b §5): die Zusatztaste `IntlRo` der brasilianischen ABNT2-Tastatur (`/` `?`).
 * `stelleFuerCode` kennt sie (zwölfte Taste der unteren Reihe); jede andere Tastatur rechnet wie vorher.
 */
import { afterEach, describe, expect, it } from "vitest";
import { REIHEN_CODES, stelleFuerCode, tasteFuerCode } from "../src/lib/typing/anschlagDeuten";
import { LAYOUTS, layoutById, setLayout } from "../src/lib/typing/layouts";
import { fingerForChar, charAccess, needsShift } from "../src/lib/typing/fingers";
import { tastenOrtFuer } from "../src/lib/typing/grundstellung";

afterEach(() => setLayout("de"));

/** Die Rechnung VOR G4 (Kopie). */
function alteStelle(layout: (typeof LAYOUTS)[number], code: string) {
  for (let r = 0; r < REIHEN_CODES.length; r++) {
    const { codes, zaehltVon } = REIHEN_CODES[r];
    const i = codes.indexOf(code);
    if (i < 0) continue;
    const anzahl = layout.rows[r]?.keys.length ?? 0;
    const spalte = zaehltVon === "links" ? i : i - (codes.length - anzahl);
    if (spalte >= 0 && spalte < anzahl) return { reihe: r, spalte };
  }
  return null;
}

describe("G4-NAHT: IntlRo", () => {
  it("br-abnt2: IntlRo ist `/`, Slash ist `;`, IntlBackslash `\`", () => {
    const br = layoutById("br-abnt2");
    expect(tasteFuerCode(br, "IntlRo")).toBe("/");
    expect(tasteFuerCode(br, "Slash")).toBe(";");
    expect(tasteFuerCode(br, "IntlBackslash")).toBe("\\");
    expect(tasteFuerCode(br, "KeyZ")).toBe("z");
    expect(stelleFuerCode(br, "IntlRo")).toEqual({ reihe: 3, spalte: 11 });
    expect(tastenOrtFuer({ code: "IntlRo", key: "/" }, br)).toEqual({ reihe: 3, spalte: 11, zeichen: "/" });
  });

  it("br-abnt2: / und ? werden auf der Zusatztaste gelehrt (rechter kleiner Finger, ? mit Umschalt)", () => {
    setLayout("br-abnt2");
    expect(charAccess("/")).toBeUndefined();
    expect(charAccess("?")).toEqual({ base: "/", mod: "shift" });
    expect(needsShift("?")).toBe(true);
    expect(fingerForChar("/")?.id).toBe("kleiner-rechts");
    expect(fingerForChar("?")?.id).toBe("kleiner-rechts");
  });

  it("nur br-abnt2 hat zwölf Tasten unten; jede andere Tastatur: jeder Code wie vorher, IntlRo trifft nichts", () => {
    expect(LAYOUTS.filter((l) => l.rows[3].keys.length === 12).map((l) => l.id)).toEqual(["br-abnt2"]);
    for (const l of LAYOUTS.filter((x) => x.id !== "br-abnt2")) {
      for (const r of REIHEN_CODES) for (const c of r.codes) expect(stelleFuerCode(l, c), `${l.id} ${c}`).toEqual(alteStelle(l, c));
      expect(stelleFuerCode(l, "IntlRo"), l.id).toBeNull();
    }
  });
});
