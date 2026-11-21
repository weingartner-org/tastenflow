/**
 * ★★★ WÄCHTER O-HU (29.10.2026): DIE FREISCHALT-FEIER IN DER UNGARISCHEN BEDIENUNG (`freischaltungHu.ts`).
 *
 * Vorbild `tastenflow-k3-feier-jede-bedienung-jeder-weg.test.tsx` und `tastenflow-es-m2-freischalt-feier-alle.test.tsx`.
 * Geprüft über die FEHLERKLASSE: JEDE Einheit der Reihenfolge des Weges „hu" (`introOrder("hu")`) auf JEDER Tastatur des
 * Weges (`hu`, `hu-101`) - und dazu die Wege „de" und „en" auf ihren Tastaturen (eine ungarische Bedienung kann auf jedem
 * Weg stehen) - Karte, Braillezeile und Ansage (Kind und ab 11):
 *  · ungarisch: kein englisches oder deutsches Wort (finger, row, key, press, letter, Taste, Finger, Reihe …), die
 *    ungarischen Gattungswörter und Fingernamen stehen da;
 *  · kein – oder —, kein Satz endet mit einer Ziffer und einem Punkt (Glossar §4 Falle 4), höchstens ein „!";
 *  · „sor" nie allein (Falle 3) - nur alapsor / felső sor / alsó sor / számsor;
 *  · mehrere Einheiten in einer Ansage: jede ist genannt (Klammerpaar), auch in der gerenderten Feier;
 *  · GEGENPROBE: die alte englische Feier fällt durch.
 *
 * ⚠️ `\b` kennt keine Buchstaben mit Akzent - darum `(?<!\p{L})…(?!\p{L})`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "hu" as string }));

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
import { advanceIntroduced, introOrder, neuFreigeschaltet, unlockBrailleLabelEn, unlockInfoEn, unlockSpeechAlle } from "@/lib/typing/letters";
import { setLayout, UNGARISCHE_LAYOUT_IDS, type LayoutId } from "@/lib/typing/layouts";
import type { Lernweg } from "@/lib/typing/lernweg";
import { unlockBrailleLabelHu, unlockInfoHu, unlockSpeechAlleHu } from "@/lib/typing/freischaltungHu";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
  bedien.sprache = "hu";
});

/** Ganzes Wort, auch bei Buchstaben mit Akzent. */
const wort = (w: string) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu");

/** Englische und deutsche Wörter, die in der ungarischen Feier nichts verloren haben. */
const FREMDWOERTER = [
  "finger", "row", "key", "keys", "press", "hold", "letter", "digit", "number", "symbol", "punctuation", "mark", "then",
  "first", "the", "and", "with", "unlocked", "new", "well", "done", "great", "home", "left", "right", "index", "middle",
  "ring", "little", "thumb", "space", "bar", "capital",
  "Taste", "Tasten", "Finger", "Reihe", "Grundreihe", "drücke", "Buchstabe", "Ziffer", "Zeichen", "Satzzeichen", "links",
  "rechts", "Zeigefinger", "Leertaste", "Umschalttaste", "freigeschaltet", "und", "dann", "zuerst", "neu", "neue",
];

/** Die Wege und Tastaturen, auf denen eine ungarische Bedienung geprüft wird. */
const FAELLE: ReadonlyArray<{ weg: Lernweg; layouts: readonly LayoutId[] }> = [
  { weg: "hu", layouts: [...UNGARISCHE_LAYOUT_IDS] },
  { weg: "de", layouts: ["de"] },
  { weg: "en", layouts: ["us"] },
];

/** Die Fehler eines Textes nach den Hausregeln (leer = in Ordnung). `satz` = gesprochen/Karte (mit Satzende). */
function regelFehler(t: string, satz: boolean): string[] {
  const f: string[] = [];
  if (/[–—]/.test(t)) f.push("Gedankenstrich");
  for (const w of FREMDWOERTER) if (wort(w).test(t)) f.push(`Fremdwort „${w}“`);
  // ★ Falle 4: eine Ziffer mit Punkt am Satzende (Satzende = Textende oder Punkt + Leerzeichen + Grossbuchstabe).
  if (satz && (/\d\.$/.test(t.trim()) || /\d\.\s+\p{Lu}/u.test(t))) f.push("Zahl mit Punkt am Satzende");
  if ((t.match(/!/g) ?? []).length > 1) f.push("mehr als ein „!“");
  // ★ Falle 3: „sor" nur mit Eigenschaftswort.
  if (/(?<!\p{L})sor(?!\p{L})/u.test(t.replace(/(felső|alsó) sor/gu, ""))) f.push("„sor“ ohne Eigenschaftswort");
  return f;
}

/** Fehler der Feier EINER Einheit. */
function fehlerEinheit(u: string, weg: Lernweg, layout: LayoutId): string[] {
  const info = unlockInfoHu(u, weg);
  const braille = unlockBrailleLabelHu(u, weg);
  const kind = unlockSpeechAlleHu([u], false, weg);
  const ab11 = unlockSpeechAlleHu([u], true, weg);
  const out: string[] = [];
  // Die Karte zeigt Kopf („számjegy 5") und Weg getrennt - der Kopf ist kein Satz, der Weg einer.
  for (const [was, t, satz] of [
    ["Karte (Kopf)", `${info.noun} ${info.name}`, false],
    ["Karte (Weg)", info.howTo, true],
    ["Braille", braille, false],
    ["Ansage", kind, true],
    ["Ansage ab 11", ab11, true],
  ] as const) {
    for (const f of regelFehler(t, satz)) out.push(`${was}: ${f} - ${t}`);
  }
  if (info.article !== "") out.push(`Artikel „${info.article}“`);
  if (!/^(betű|számjegy|írásjel|szimbólum|billentyű|holtbillentyű)$/.test(info.noun)) out.push(`Gattungswort „${info.noun}“`);
  if (!braille.startsWith(`Új ${info.noun}: `)) out.push(`Braille ohne „Új …:“ - ${braille}`);
  if (!kind.startsWith(`Nagyszerű! Új ${info.noun}: `)) out.push(`Ansage ohne „Nagyszerű! Új …:“ - ${kind}`);
  if (!ab11.startsWith("Újdonság neked: ")) out.push(`Ansage ab 11 ohne „Újdonság neked:“ - ${ab11}`);
  if (ab11.includes("!")) out.push(`Ansage ab 11 mit „!“ - ${ab11}`);
  // Gewöhnliche Taste: Finger und Reihe auf Ungarisch.
  if (info.howTo.startsWith("Billentyű: ") && !info.howTo.includes("együtt") && info.howTo.split(",").length >= 2) {
    if (!/(kisujj|gyűrűsujj|középső ujj|mutatóujj|hüvelykujj)/.test(info.howTo)) out.push(`kein ungarischer Finger - ${info.howTo}`);
  }
  return out.map((f) => `${weg}/${layout} ${u}: ${f}`);
}

/** Alle Sprossen, an denen mehr als eine Einheit zugleich wächst. */
function mehrfachSprossen(weg: Lernweg): string[][] {
  const o = introOrder(weg);
  const out: string[][] = [];
  for (let i = 1; i < o.length; i++) {
    const vorher = o.slice(0, i);
    const neu = neuFreigeschaltet(vorher, advanceIntroduced(vorher, {}, weg, undefined, 99));
    if (neu.length > 1) out.push(neu);
  }
  return out;
}

describe("★★★ O-HU: jede Einheit, jede Tastatur - Karte, Braille und Ansage ungarisch", () => {
  for (const { weg, layouts } of FAELLE)
    for (const layout of layouts)
      it(`Weg ${weg}, Tastatur ${layout}`, () => {
        setLayout(layout);
        const reihe = introOrder(weg);
        expect(reihe.length).toBeGreaterThan(40);
        const fehler = reihe.flatMap((u) => fehlerEinheit(u, weg, layout));
        expect(fehler).toEqual([]);
      });

  it("Beispiele: hosszú ő, Shift, Ziffer als Wort, ű „a jobb szélen“, 0 auf hu-101 über AltGr", () => {
    setLayout("hu");
    expect(unlockSpeechAlleHu(["ő"], false, "hu")).toBe("Nagyszerű! Új betű: hosszú ő. Billentyű: hosszú ő, jobb kisujj, felső sor.");
    expect(unlockBrailleLabelHu("ő", "hu")).toBe("Új betű: Ő");
    expect(unlockSpeechAlleHu(["⇧"], false, "hu")).toBe(
      "Nagyszerű! Új billentyű: Shift. Nagybetűt úgy írsz, hogy a másik kezeddel lenyomva tartod a Shift billentyűt.",
    );
    expect(unlockBrailleLabelHu("⇧", "hu")).toBe("Új billentyű: Shift");
    expect(unlockSpeechAlleHu(["5"], false, "hu")).toMatch(/^Nagyszerű! Új számjegy: öt\. Billentyű: 5, /);
    expect(unlockSpeechAlleHu(["5"], true, "hu")).toMatch(/^Újdonság neked: ötös számjegy\. /);
    expect(unlockInfoHu("ű", "hu").howTo).toBe("Billentyű: hosszú ű, jobb kisujj, a jobb szélen.");
    expect(unlockInfoHu("f", "hu").howTo).toBe("Billentyű: F, bal mutatóujj, alapsor.");
    expect(unlockInfoHu("?", "hu").howTo).toBe("Billentyű: vessző, a Shift billentyűvel együtt.");
    expect(unlockBrailleLabelHu("%", "hu")).toBe("Új szimbólum: százalékjel %");
    setLayout("hu-101");
    expect(unlockInfoHu("0", "hu").howTo).toBe("Billentyű: hosszú í, az AltGr billentyűvel együtt.");
    expect(unlockInfoHu("í", "hu").howTo).toMatch(/számsor\.$/);
  });
});

describe("★★★ O-HU: mehrere Einheiten in einer Ansage - jede ist genannt", () => {
  it("es gibt solche Sprossen auf Weg „hu“ (sonst misst der Wächter nichts)", () => {
    expect(mehrfachSprossen("hu")).toEqual([
      ["(", ")"],
      ["[", "]"],
      ["{", "}"],
    ]);
  });

  for (const layout of [...UNGARISCHE_LAYOUT_IDS])
    it(`Tastatur ${layout}: die Ansage nennt jede neue Einheit, Braille und Karte auch (gerendert)`, () => {
      setLayout(layout);
      for (const neu of mehrfachSprossen("hu")) {
        const kind = unlockSpeechAlleHu(neu, false, "hu");
        const ab11 = unlockSpeechAlleHu(neu, true, "hu");
        expect(kind).toMatch(/^Nagyszerű! Feloldva: /);
        expect(ab11).toMatch(/^Újdonság neked: /);
        for (const t of [kind, ab11]) expect(regelFehler(t, true), t).toEqual([]);
        for (const u of neu) {
          const name = unlockInfoHu(u, "hu").name;
          expect(kind, u).toContain(name);
          expect(ab11, u).toContain(name);
        }
        // Gerendert: die Feier mit bedien „hu".
        vi.useFakeTimers();
        vi.mocked(speakUi).mockClear();
        const { container } = render(<UnlockCelebration unit={neu[0]} mit={neu.slice(1)} lernweg="hu" skin="kind" onClose={() => {}} />);
        vi.advanceTimersByTime(1000);
        const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
        const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
        const karte = container.querySelector(".tt-celebrate-card")?.textContent ?? "";
        cleanup();
        vi.useRealTimers();
        for (const u of neu) {
          const name = unlockInfoHu(u, "hu").name;
          expect(gesprochen, `${layout} ${u}`).toContain(name);
          expect(alarm, `${layout} ${u}`).toContain(u);
          expect(karte, `${layout} ${u}`).toContain(name);
        }
        expect(gesprochen).toContain("Nagyszerű! Feloldva:");
        for (const w of ["finger", "key", "unlocked", "Taste"]) expect(gesprochen).not.toMatch(wort(w));
      }
    });

  it("zwei Buchstaben zugleich: beide genannt, Aufzählung mit „és“, je Einheit ihr Weg", () => {
    setLayout("hu");
    expect(unlockSpeechAlleHu(["ö", "ó"], false, "hu")).toBe(
      "Nagyszerű! Feloldva: ö betű és hosszú ó betű. Ö betű. Billentyű: ö, jobb kisujj, számsor. " +
        "Hosszú ó betű. Billentyű: hosszú ó, jobb kisujj, számsor.",
    );
  });
});

describe("GEGENPROBE", () => {
  it("die alte englische Feier fällt durch die Regeln", () => {
    setLayout("hu");
    const fehler: string[] = [];
    for (const u of ["f", "⇧", "5", "?", "("]) {
      const info = unlockInfoEn(u, "hu");
      fehler.push(...regelFehler(`${info.noun} ${info.name}. ${info.howTo}`, true));
      fehler.push(...regelFehler(unlockBrailleLabelEn(u, "hu"), false));
      fehler.push(...regelFehler(unlockSpeechAlle([u], false, "en", "hu"), true));
    }
    expect(fehler.length).toBeGreaterThan(5);
  });

  it("jede Regel findet ihr Gegenbeispiel", () => {
    expect(regelFehler("Billentyű: F – bal mutatóujj.", true)).toContain("Gedankenstrich");
    expect(regelFehler("Új számjegy: 5.", true)).toContain("Zahl mit Punkt am Satzende");
    expect(regelFehler("Billentyű: 5. Bal kisujj.", true)).toContain("Zahl mit Punkt am Satzende");
    expect(regelFehler("Nagyszerű! Szuper!", true)).toContain("mehr als ein „!“");
    expect(regelFehler("Billentyű: F, left index finger.", true)).toContain("Fremdwort „finger“");
    expect(regelFehler("Billentyű: F, linker Zeigefinger.", true)).toContain("Fremdwort „Zeigefinger“");
    expect(regelFehler("Billentyű: F, bal mutatóujj, sor.", true).length).toBeGreaterThan(0);
    expect(regelFehler("Billentyű: F, bal mutatóujj, alapsor.", true)).toEqual([]);
    expect(regelFehler("Billentyű: Q, bal kisujj, felső sor.", true)).toEqual([]);
  });
});
