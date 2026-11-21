/**
 * ★★★ WÄCHTER O-RO (29.10.2026): DIE FREISCHALT-FEIER IN DER RUMÄNISCHEN BEDIENUNG.
 *
 * `freischaltungRo.ts` reichte bis hierher die ENGLISCHE Feier weiter. Geprüft über die FEHLERKLASSE, wie
 * `tastenflow-k3-feier-jede-bedienung-jeder-weg` und `tastenflow-es-m2-freischalt-feier-alle`:
 *  1. JEDE Einheit der Reihenfolge des Weges „ro" auf JEDER seiner Tastaturen (`ro`, `ro-prog`): Karte, Braillezeile
 *     und Ansage (nüchtern und mit Lob) sind rumänisch - kein englisches oder deutsches Wort (finger, row, key, press,
 *     Taste …), kein – —, kein ş ţ (Cedille), keine Ziffer mit Punkt am Satzende, höchstens ein „!".
 *  2. Finger und Reihe stehen rumänisch da (die Tabelle in `freischaltungRo.ts`, weil `fingers.ts` für „ro" noch
 *     englisch ist) - und nie „rând" für die Tastenreihe (Glossar Falle 3).
 *  3. Jede Sprosse mit mehreren neuen Einheiten: die Ansage nennt ALLE, mit je ihrem Griff - in der Funktion und in der
 *     gerenderten Feier (Braillezeile und Sprachausgabe).
 *  4. Die erwarteten Sätze an Beispielen (ș auf beiden Tastaturen, eine Ziffer, ein Zeichen mit Shift, Shift).
 * Gegenprobe: die englische Feier (der alte Rückfall) macht den Wächter rot.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "ro" as const }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: bedien.sprache,
      spracheGewaehlt: bedien.sprache,
      setzeSprache: () => {},
      bereichAktiv: true,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return { ...echt, speak: vi.fn(), speakUi: vi.fn(), playUnlockFanfare: vi.fn() };
});

import { UnlockCelebration } from "@/components/typing/UnlockCelebration";
import { speakUi } from "@/lib/typing/voice";
import { advanceIntroduced, introOrder, neuFreigeschaltet, unlockSpeechAlle } from "@/lib/typing";
import { fingerForChar } from "@/lib/typing/fingers";
import { RUMAENISCHE_LAYOUT_IDS, setLayout } from "@/lib/typing/layouts";
import { SHIFT_UNIT } from "@/lib/typing/letters";
import {
  FINGER_RO,
  ROW_NAMES_RO,
  unlockBrailleLabelRo,
  unlockInfoRo,
  unlockSpeechAlleRo,
} from "@/lib/typing/freischaltungRo";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
});

const TASTATUREN = [...RUMAENISCHE_LAYOUT_IDS];

const ENGLISCH = /\b(finger|row|key|keys|press|hold|then|letter|unlocked|the|and|number|digit|space ?bar|punctuation|well done|new)\b/i;
const DEUTSCH = /\b(Taste|Tasten|Finger|Reihe|drücke|halte|Buchstabe|Ziffer|Satzzeichen|Sonderzeichen|Leertaste|Zeigefinger|Grundreihe|Gratulation|freigeschaltet|dann)\b/;
const GATTUNG = ["litera", "cifra", "semnul de punctuație", "simbolul", "tasta", "tasta moartă"];
const KOEPFE = /^(Literă nouă|Cifră nouă|Semn de punctuație nou|Simbol nou|Tastă nouă|Tastă moartă nouă): /;

/** Fehler eines rumänischen Textes (leer = in Ordnung). */
function textFehler(t: string, wo: string, gesprochen: boolean): string[] {
  const f: string[] = [];
  if (!t.trim()) f.push("leer");
  if (ENGLISCH.test(t)) f.push(`englisches Wort (${t.match(ENGLISCH)?.[0]})`);
  if (DEUTSCH.test(t)) f.push(`deutsches Wort (${t.match(DEUTSCH)?.[0]})`);
  if (/[–—]/.test(t)) f.push("langer Strich");
  if (/[ŞşŢţ]/.test(t)) f.push("Cedille");
  if (/\brând/.test(t)) f.push("„rând“ für die Tastenreihe");
  if ((t.match(/!/g) ?? []).length > 1) f.push("mehr als ein Ausrufezeichen");
  if (gesprochen && /\d\.(\s|$)/.test(t)) f.push("Ziffer mit Punkt am Satzende");
  return f.map((x) => `${wo}: ${x} - „${t}“`);
}

/** Alle Sprossen, an denen mehr als eine Einheit zugleich wächst (wie es-m2). */
function mehrfachSprossen(): string[][] {
  const o = introOrder("ro");
  const out: string[][] = [];
  for (let i = 1; i < o.length; i++) {
    const vorher = o.slice(0, i);
    const neu = neuFreigeschaltet(vorher, advanceIntroduced(vorher, {}, "ro", undefined, 99));
    if (neu.length > 1) out.push(neu);
  }
  return out;
}

describe("O-RO Feier: jede Einheit des Weges ro auf jeder seiner Tastaturen", () => {
  for (const lay of TASTATUREN)
    it(`Tastatur ${lay}: Karte, Braillezeile und Ansage rumänisch`, () => {
      setLayout(lay);
      const fehler: string[] = [];
      let geprueft = 0;
      for (const u of introOrder("ro")) {
        geprueft++;
        const info = unlockInfoRo(u, "ro");
        const braille = unlockBrailleLabelRo(u, "ro");
        const nuechtern = unlockSpeechAlleRo([u], true, "ro");
        const lob = unlockSpeechAlleRo([u], false, "ro");
        const wo = `${lay} ${u}`;
        fehler.push(...textFehler(`${info.noun} ${info.name}`, `${wo} Karte`, false));
        fehler.push(...textFehler(info.howTo, `${wo} Griff`, true));
        fehler.push(...textFehler(braille, `${wo} Braille`, false));
        fehler.push(...textFehler(nuechtern, `${wo} Ansage nüchtern`, true));
        fehler.push(...textFehler(lob, `${wo} Ansage mit Lob`, true));
        if (!GATTUNG.includes(info.noun)) fehler.push(`${wo}: Gattungswort „${info.noun}“`);
        if (!KOEPFE.test(braille)) fehler.push(`${wo}: Braille-Kopf „${braille}“`);
        if (!lob.startsWith("Foarte bine! ")) fehler.push(`${wo}: Lob „${lob}“`);
        if (!nuechtern.startsWith("Noutate pentru tine: ")) fehler.push(`${wo}: nüchtern „${nuechtern}“`);
        if (!lob.endsWith(info.howTo)) fehler.push(`${wo}: Griff fehlt in der Ansage`);
        // Wo der Griff über einen Finger geht, steht der rumänische Fingername da.
        const f = fingerForChar(u, "ro");
        if (u !== SHIFT_UNIT && info.howTo.startsWith("Se află pe tasta") && info.howTo.includes(":")) {
          if (!f || !info.howTo.includes(FINGER_RO[f.id])) fehler.push(`${wo}: Finger fehlt „${info.howTo}“`);
          if (!ROW_NAMES_RO.some((r) => info.howTo.includes(r))) fehler.push(`${wo}: Reihe fehlt „${info.howTo}“`);
        }
      }
      expect(geprueft).toBeGreaterThan(60);
      expect(fehler.slice(0, 15), `${fehler.length} Funde`).toEqual([]);
    });

  it("jede FingerInfo-id hat einen rumänischen Namen", () => {
    const ids = new Set<string>();
    for (const lay of TASTATUREN) {
      setLayout(lay);
      for (const u of introOrder("ro")) {
        const f = fingerForChar(u, "ro");
        if (f) ids.add(f.id);
      }
    }
    expect(ids.size).toBeGreaterThanOrEqual(8);
    expect([...ids].filter((id) => !FINGER_RO[id])).toEqual([]);
  });
});

describe("O-RO Feier: mehrere Einheiten in einer Ansage", () => {
  it("es gibt solche Sprossen (sonst misst der Wächter nichts)", () => {
    setLayout("ro");
    const s = mehrfachSprossen();
    expect(s.length).toBeGreaterThan(0);
    expect(s).toContainEqual(["„", "”"]);
  });

  for (const lay of TASTATUREN)
    it(`Tastatur ${lay}: jede neue Einheit wird genannt, jede mit ihrem Griff`, () => {
      setLayout(lay);
      const fehler: string[] = [];
      for (const neu of mehrfachSprossen()) {
        for (const sober of [true, false]) {
          const satz = unlockSpeechAlleRo(neu, sober, "ro");
          fehler.push(...textFehler(satz, `${lay} ${neu.join(" ")}`, true));
          for (const u of neu) {
            const einzeln = unlockSpeechAlleRo([u], true, "ro").replace(/^Noutate pentru tine: /, "");
            const kopf = einzeln.slice(0, einzeln.indexOf(". "));
            if (!satz.includes(kopf)) fehler.push(`${lay} ${u}: nicht genannt in „${satz}“`);
            if (!satz.includes(unlockInfoRo(u, "ro").howTo)) fehler.push(`${lay} ${u}: Griff fehlt in „${satz}“`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });

  it("die gerenderte Feier: Braillezeile und Sprachausgabe nennen beide Anführungszeichen", () => {
    setLayout("ro");
    vi.useFakeTimers();
    vi.mocked(speakUi).mockClear();
    const { container } = render(
      <UnlockCelebration unit="„" mit={["”"]} lernweg="ro" skin="kind" onClose={() => {}} />,
    );
    vi.advanceTimersByTime(1000);
    const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
    const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
    const karte = container.querySelector(".tt-celebrate-card")?.textContent ?? "";
    expect(alarm).toContain("Semn de punctuație nou: ghilimele deschise „");
    expect(alarm).toContain("Semn de punctuație nou: ghilimele închise ”");
    expect(gesprochen).toContain("Ai deblocat semnul de punctuație ghilimele deschise și semnul de punctuație ghilimele închise.");
    expect(karte).toContain("semnul de punctuație");
    expect(karte).toContain("ghilimele închise");
    for (const t of [gesprochen, alarm]) expect(textFehler(t, "gerendert", false)).toEqual([]);
  });
});

describe("O-RO Feier: die Sätze an Beispielen", () => {
  it("ș auf der Standard-Tastatur: eigene Taste, kleiner Finger rechts, șirul de bază", () => {
    setLayout("ro");
    expect(unlockSpeechAlleRo(["ș"], false, "ro")).toBe(
      "Foarte bine! Literă nouă: s cu virgulă. Se află pe tasta s cu virgulă: degetul mic drept, șirul de bază.",
    );
    expect(unlockBrailleLabelRo("ș", "ro")).toBe("Literă nouă: Ș");
  });

  it("ș auf der Programmers-Tastatur: Alt Gr + S", () => {
    setLayout("ro-prog");
    expect(unlockInfoRo("ș", "ro").howTo).toBe("Ține apăsată tasta Alt Gr și apasă tasta S.");
  });

  it("eine Ziffer heisst in der Ansage beim Wort, ein Zeichen mit Shift endet nicht auf der Ziffer", () => {
    setLayout("ro");
    expect(unlockSpeechAlleRo(["5"], false, "ro")).toMatch(/^Foarte bine! Cifră nouă: cinci\. Se află pe tasta 5: \S/);
    expect(unlockInfoRo("%", "ro").howTo).toBe("Ține apăsată tasta Shift și apasă tasta 5 de pe șirul de cifre.");
    expect(unlockBrailleLabelRo("%", "ro")).toBe("Simbol nou: procent %");
  });

  it("Shift: Tastă nouă, mit der anderen Hand", () => {
    setLayout("ro");
    expect(unlockBrailleLabelRo(SHIFT_UNIT, "ro")).toBe("Tastă nouă: Shift");
    expect(unlockSpeechAlleRo([SHIFT_UNIT], true, "ro")).toBe(
      "Noutate pentru tine: tasta Shift. Pentru o literă mare, ține apăsată tasta Shift cu cealaltă mână și apasă litera.",
    );
  });

  it("GEGENPROBE: die englische Feier (der alte Rückfall) fällt durch", () => {
    setLayout("ro");
    const alt = unlockSpeechAlle(["k"], false, "en", "ro");
    expect(textFehler(alt, "alt", true).join(" ")).toMatch(/englisches Wort/);
  });
});
