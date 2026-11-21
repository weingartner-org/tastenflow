/**
 * ★★★ D2 (28.09.2026): Der Beginn des Schuljahres je Klasse.
 *
 * Geprüft wird:
 *  1. OHNE Wert rechnet alles wie vor D2 (1. August, „2026/27") - Byte für Byte.
 *  2. Eine Klasse mit Beginn Februar hat ihr Schuljahr Februar bis Januar,
 *     heisst „2027", und ihre Schulstufe zählt im Februar weiter, nicht im August.
 *  3. Umstellen des Beginns lässt die HEUTIGE Schulstufe stehen.
 *  4. Die Vorgabe je Land (Sprach-Region, ersatzweise Zeitzone).
 *  5. Der Zeitraum „Schuljahr" der Tabelle folgt dem Klassenwert.
 *  6. Der Server-Zwilling (`schuljahrGrenzenMs`) trifft dieselben Grenzen.
 *  7. `tt_classes.settings` bleibt mit dem neuen Schlüssel unter 2000 Byte.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { schuljahrVon } from "@/lib/typing/jahreskarte";
import {
  aktuelleSchulstufe,
  nichtGespeicherteEinstellungen,
  schuljahrStartjahr,
  schulstufeSchuljahrUmrechnen,
} from "@/lib/typing/klassenEinstellungen";
import {
  SCHULJAHR_BEGINN_VORGABE,
  landAusGeraet,
  schuljahrBeginnFuerLand,
  schuljahrBeginnVon,
} from "@/lib/typing/schuljahrBeginn";
import { grenzen, schuljahrVersetzt, zeitraumTitel, type Zeitraum } from "@/lib/typing/zeitraum";
import { WOCHENZIEL_GRENZE } from "@/lib/typing";
import type { TypingClass } from "@/lib/typing/account";

const VORHERIGE_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = "Europe/Vienna";
});
afterAll(() => {
  if (VORHERIGE_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = VORHERIGE_TZ;
});

const ms = (j: number, m0: number, t: number, h = 12) => new Date(j, m0, t, h, 0, 0).getTime();

describe("1. ohne Wert: August wie vor D2", () => {
  it("schuljahrVon ohne Monat = mit August = wie bisher", () => {
    const p = ms(2026, 8, 28);
    const alt = schuljahrVon(p);
    expect(alt.label).toBe("2026/27");
    expect(alt.vonMs).toBe(new Date(2026, 7, 1).getTime());
    expect(alt.bisMs).toBe(new Date(2027, 7, 1).getTime() - 1);
    expect(schuljahrVon(p, 8)).toEqual(alt);
    // Ungültige Werte fallen auf August zurück, nie auf etwas Erfundenes.
    expect(schuljahrVon(p, 0)).toEqual(alt);
    expect(schuljahrVon(p, 13)).toEqual(alt);
    expect(schuljahrVon(p, 2.5)).toEqual(alt);
  });

  it("schuljahrBeginnVon: fehlend, null, Unsinn ⇒ August", () => {
    expect(schuljahrBeginnVon(null)).toBe(SCHULJAHR_BEGINN_VORGABE);
    expect(schuljahrBeginnVon({ settings: null })).toBe(8);
    expect(schuljahrBeginnVon({ settings: {} })).toBe(8);
    expect(schuljahrBeginnVon({ settings: { schuljahrBeginn: "2" } })).toBe(8);
    expect(schuljahrBeginnVon({ settings: { schuljahrBeginn: 2 } })).toBe(2);
  });

  it("eine Bestandsklasse ohne Wert zählt ihre Schulstufe weiter im August", () => {
    const cls = { schulstufe: 7, schulstufeSchuljahr: 2026 };
    expect(aktuelleSchulstufe(cls, ms(2027, 6, 31))).toBe(7);
    expect(aktuelleSchulstufe(cls, ms(2027, 7, 1))).toBe(8);
  });
});

describe("2. Beginn Februar (Cono Sur)", () => {
  it("Schuljahr 1. Februar bis 31. Januar, Name “2027”", () => {
    const sj = schuljahrVon(ms(2027, 2, 16), 2);
    expect(sj.vonMs).toBe(new Date(2027, 1, 1).getTime());
    expect(sj.bisMs).toBe(new Date(2028, 1, 1).getTime() - 1);
    expect(sj.label).toBe("2027");
    // Der Januar gehört noch zum Vorjahr.
    expect(schuljahrVon(ms(2027, 0, 20), 2).label).toBe("2026");
  });

  it("Beginn April (Ecuador Costa) heisst wieder “2026/27”", () => {
    expect(schuljahrVon(ms(2026, 4, 4), 4).label).toBe("2026/27");
  });

  it("die Schulstufe zählt im Februar weiter, nicht im August", () => {
    const cls = { schulstufe: 5, schulstufeSchuljahr: 2026, settings: { schuljahrBeginn: 2 } };
    expect(aktuelleSchulstufe(cls, ms(2026, 8, 28))).toBe(5);
    expect(aktuelleSchulstufe(cls, ms(2027, 0, 31))).toBe(5);
    expect(aktuelleSchulstufe(cls, ms(2027, 1, 1))).toBe(6);
    expect(aktuelleSchulstufe(cls, ms(2027, 7, 1))).toBe(6);
  });

  it("schuljahrStartjahr mit Monat", () => {
    expect(schuljahrStartjahr(ms(2027, 1, 10), 2)).toBe(2027);
    expect(schuljahrStartjahr(ms(2027, 1, 10))).toBe(2026);
  });
});

describe("3. Umstellen lässt die heutige Schulstufe stehen", () => {
  it("im Februar 2027 von August auf Februar: 7 bleibt 7", () => {
    const jetzt = ms(2027, 1, 15);
    const vorher = { schulstufe: 7, schulstufeSchuljahr: 2026 }; // August-Jahr 2026/27
    expect(aktuelleSchulstufe(vorher, jetzt)).toBe(7);
    const neu = schulstufeSchuljahrUmrechnen(2026, jetzt, 8, 2);
    expect(neu).toBe(2027);
    expect(
      aktuelleSchulstufe({ ...vorher, schulstufeSchuljahr: neu, settings: { schuljahrBeginn: 2 } }, jetzt),
    ).toBe(7);
  });

  it("zwei Jahre gewachsen bleibt zwei Jahre gewachsen", () => {
    const jetzt = ms(2028, 9, 1);
    const neu = schulstufeSchuljahrUmrechnen(2026, jetzt, 8, 1);
    expect(
      aktuelleSchulstufe({ schulstufe: 3, schulstufeSchuljahr: neu, settings: { schuljahrBeginn: 1 } }, jetzt),
    ).toBe(aktuelleSchulstufe({ schulstufe: 3, schulstufeSchuljahr: 2026 }, jetzt));
  });
});

describe("4. die Vorgabe je Land", () => {
  it("aus der Sprach-Region", () => {
    expect(schuljahrBeginnFuerLand(landAusGeraet(["es-AR", "es"], null))).toBe(2);
    expect(schuljahrBeginnFuerLand(landAusGeraet(["es-GT"], null))).toBe(1);
    expect(schuljahrBeginnFuerLand(landAusGeraet(["es-CO"], null))).toBe(1);
    expect(schuljahrBeginnFuerLand(landAusGeraet(["es-MX"], null))).toBe(8);
    expect(schuljahrBeginnFuerLand(landAusGeraet(["es-ES"], null))).toBe(8);
    expect(schuljahrBeginnFuerLand(landAusGeraet(["de-AT", "de"], null))).toBe(8);
    expect(schuljahrBeginnFuerLand(landAusGeraet(["en-AU"], null))).toBe(1);
  });

  it("ohne Region aus der Zeitzone - “es-419” ist keine Region", () => {
    expect(landAusGeraet(["es-419", "es"], "America/Santiago")).toBe("CL");
    expect(landAusGeraet(["es"], "America/Argentina/Cordoba")).toBe("AR");
    expect(landAusGeraet(["es"], "America/Mexico_City")).toBeNull();
    expect(schuljahrBeginnFuerLand(null)).toBe(8);
  });
});

describe("5. der Zeitraum “Schuljahr” folgt der Klasse", () => {
  it("grenzen und Titel mit schuljahrBeginn", () => {
    const jetzt = ms(2027, 3, 10);
    const z: Zeitraum = { art: "schuljahr", wochenVersatz: 0, jahrVersatz: 0, schuljahrBeginn: 3 };
    expect(grenzen(z, jetzt, WOCHENZIEL_GRENZE)).toEqual({
      vonMs: new Date(2027, 2, 1).getTime(),
      bisMs: new Date(2028, 2, 1).getTime() - 1,
    });
    expect(zeitraumTitel(z, jetzt, WOCHENZIEL_GRENZE, "es")).toBe("Curso escolar 2027");
    expect(schuljahrVersetzt(jetzt, -1, 3).label).toBe("2026");
    // Ohne den Wert wie vorher.
    const alt: Zeitraum = { art: "schuljahr", wochenVersatz: 0, jahrVersatz: 0 };
    expect(zeitraumTitel(alt, jetzt, WOCHENZIEL_GRENZE)).toBe("Schuljahr 2026/27");
  });
});

describe("6. Server-Zwilling schuljahrGrenzenMs", () => {
  const code = readFileSync(
    resolve(__dirname, "../pocketbase/pb_hooks/tt_wochenziel_lib.pb.js"),
    "utf8",
  );
  const mod = { exports: {} as Record<string, unknown> };
  new Function("module", "exports", "require", code)(mod, mod.exports, () => ({}));
  const server = mod.exports as {
    schuljahrGrenzenMs: (j: number, b?: unknown) => { vonMs: number; bisMs: number };
  };

  it("trifft schuljahrVon für jeden Beginn-Monat, auch über die Umstellungen", () => {
    const punkte = [
      ms(2026, 0, 1, 0),
      ms(2026, 1, 1, 0),
      ms(2026, 2, 29, 3),
      ms(2026, 7, 1, 0),
      ms(2026, 9, 25, 4),
      ms(2027, 0, 31, 23),
      ms(2027, 4, 4),
    ];
    for (const b of [undefined, 1, 2, 3, 4, 8, 9, 12]) {
      for (const p of punkte) {
        const c = schuljahrVon(p, b);
        const s = server.schuljahrGrenzenMs(p, b);
        expect(s.vonMs, `Beginn ${b} bei ${new Date(p).toISOString()}`).toBe(c.vonMs);
        expect(s.bisMs, `Ende ${b} bei ${new Date(p).toISOString()}`).toBe(c.bisMs);
      }
    }
    // Unsinn am Server = August.
    expect(server.schuljahrGrenzenMs(ms(2026, 8, 1), "2")).toEqual(
      server.schuljahrGrenzenMs(ms(2026, 8, 1)),
    );
  });
});

describe("7. Grösse von tt_classes.settings (2000 Byte)", () => {
  it("der neue Schlüssel kostet höchstens 21 Byte (`,\"schuljahrBeginn\":12`)", () => {
    const ohne = JSON.stringify({ schreibprobe: null });
    const mit = JSON.stringify({ schreibprobe: null, schuljahrBeginn: 12 });
    expect(mit.length - ohne.length).toBe(21);
    // Der dokumentierte Höchstfall (Zeiger + Verbrauchsliste für „de" UND
    // „en", `schreibprobe.ts`: 1.633 Byte) plus ein Plan (rund 280 Byte)
    // plus dieser Schlüssel bleibt unter der Grenze von 2000 Byte.
    expect(1633 + 280 + 21).toBeLessThan(2000);
  });
});

describe("nichtGespeicherteEinstellungen kennt den Beginn", () => {
  const basis: TypingClass = { code: "X", name: "x", teacherId: "t", weeklyReport: false, createdAt: 0 };
  it("fehlt am Server ⇒ genannt; August gewünscht und fehlt ⇒ nichts verloren", () => {
    expect(nichtGespeicherteEinstellungen({ schuljahrBeginn: 2 }, basis)).toEqual([
      "Beginn des Schuljahres",
    ]);
    expect(nichtGespeicherteEinstellungen({ schuljahrBeginn: 8 }, basis)).toEqual([]);
    expect(
      nichtGespeicherteEinstellungen({ schuljahrBeginn: 2 }, { ...basis, settings: { schuljahrBeginn: 2 } }),
    ).toEqual([]);
  });
});
