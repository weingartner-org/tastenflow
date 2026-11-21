/**
 * ★★★★★ WÄCHTER: DIE WÖRTER EINES EIGENEN TEXTES WERDEN NICHT BUCHSTABIERT
 * (21.09.2026, Sarah, Schülerin mit Blindheit).
 *
 * Johannes: *„die Fremdwörter sind toll, aber eine blinde Schülerin (Sarah) sagt
 * mir, dass viele davon nur mit einzelnen Buchstaben angesagt werden, obwohl
 * Buchstabieren ausgeschaltet wurde. So kann man nicht schreiben."* Und auf
 * Nachfrage: ob ich es im PROTOKOLL nachvollziehen könne.
 *
 * ── Das Protokoll (gemessen 21.09.2026, vor der Behebung) ────────────────────
 * Einstellung wie Sarah: Vorlesen an · Wörter an · Sätze an · Buchstabieren AUS.
 * Von 240 Fremdwörter-Zeilen bekamen 218 (91 %) Einzelbuchstaben-Ansagen; von
 * 4816 Buchstaben-Anschlägen waren 2974 (62 %) nur der Buchstabe; 347 Wörter
 * kannte das Lexikon nicht. Beispiel „Vermutung - Hypothese": jeder Anschlag
 * `["V"]`, `["e"]`, `["r"]` … - kein einziges ganzes Wort.
 *
 * ── Warum ───────────────────────────────────────────────────────────────────
 * `readPlanAt` buchstabiert jedes Wort, das das Lexikon nicht kennt - auch bei
 * „Buchstabieren aus". Das Lexikon kennt nur, was im Übungs-Korpus vorkam.
 * ⇒ Bei eigenem Text zählen dessen Wörter selbst als Wörter
 * (`lib/typing/eigeneWoerter.ts`); Quelltext ausgenommen; die Grundreihe
 * (Übungssilben) behält ihr Buchstabieren.
 *
 * Jede Prüfung hat ihre GEGENPROBE ohne die Behebung - sonst bliebe unbewiesen,
 * dass der Test den Fehler überhaupt sehen kann.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return {
    ...echt,
    speakSequence: vi.fn(),
    speakChar: vi.fn(),
    speakUi: vi.fn(),
    sprachausgabeBeschaeftigt: () => false,
  };
});

import { TypingSession } from "@/components/typing/TypingSession";
import { readPlanAt, speakSequence } from "@/lib/typing/voice";
import { isRealWord } from "@/lib/typing/lexicon";
import { useTypingA11y } from "@/lib/typing/a11y";
import { textSiehtAusWieCode, woerterAusEigenemText } from "@/lib/typing/eigeneWoerter";
import { FREMDWOERTER } from "@/lib/typing/vorlagenDaten/fremdwoerter";
import { CODE_VORLAGEN } from "@/lib/typing/vorlagenDaten/programmcode";
import { fremdChallengePaare, fremdZeile } from "@/lib/typing/vorlagen";

const WURZEL = resolve(__dirname, "..");

/** Sarahs Einstellung: Wörter + Sätze an, Buchstabieren AUS (`letters: false`). */
const SARAH = { letters: false, words: true, sentences: true, shiftLearned: true, lang: "de" as const };
const nurLexikon = (t: string) => isRealWord(t, "de");

/** Jeder Anschlag der Zeile, so wie ihn `TypingSession` an `readPlanAt` gibt. */
function protokoll(zeile: string, istWort: (t: string) => boolean): { i: number; zeichen: string; plan: string[] }[] {
  return [...zeile].map((zeichen, i) => ({ i, zeichen, plan: readPlanAt(zeile, i, SARAH, istWort) }));
}

/** Der Name eines einzelnen Buchstabens, wie ihn `spokenLabel` sagt: „e", „großes V", „a Umlaut". */
const BUCHSTABENNAME = /^(großes )?[a-zäöüß]( Umlaut)?$/i;

/** Ein Anschlag auf einen Buchstaben, dessen Ansage nur dieser eine Buchstabe ist. */
function einzelBuchstabe(p: { zeichen: string; plan: string[] }): boolean {
  return /[A-Za-zÄÖÜäöüß]/.test(p.zeichen) && p.plan.length === 1 && BUCHSTABENNAME.test(p.plan[0]);
}

/** Alle Fremdwörter-Zeilen mit den Wörtern ihrer Datei - so, wie sie im Lauf ankommen. */
function alleDateien(): { name: string; zeilen: string[] }[] {
  const dateien: { name: string; zeilen: string[] }[] = [];
  for (const stufe of ["kids", "teens", "erwachsen"] as const) {
    for (const t of FREMDWOERTER[stufe]) dateien.push({ name: `${stufe}/${t.id}`, zeilen: t.paare.map(fremdZeile) });
    for (let i = 0; i < 3; i++) dateien.push({ name: `${stufe}/challenge-${i + 1}`, zeilen: fremdChallengePaare(stufe, i).map(fremdZeile) });
  }
  return dateien;
}

describe("★★★★★ Das Protokoll: Sarahs Einstellung, alle Fremdwörter-Dateien", () => {
  it("Gegenprobe: NUR mit dem Lexikon (vor der Behebung) buchstabiert die App den Großteil - so wie Sarah es hörte", () => {
    let zeilen = 0;
    let mitBuchstaben = 0;
    for (const d of alleDateien().filter((x) => !x.name.includes("challenge"))) {
      for (const z of d.zeilen) {
        zeilen++;
        if (protokoll(z, nurLexikon).some(einzelBuchstabe)) mitBuchstaben++;
      }
    }
    expect(zeilen).toBe(240);
    // Gemessen am 21.09.2026: 218 von 240 (91 %).
    expect(mitBuchstaben).toBeGreaterThan(200);
  });

  it("MIT den Wörtern des Textes: in KEINER Zeile eine Einzelbuchstaben-Ansage - jedes Wort kommt ganz", () => {
    for (const d of alleDateien()) {
      const woerter = woerterAusEigenemText(d.zeilen);
      const istWort = (t: string) => nurLexikon(t) || woerter.has(t.toLowerCase().replace(/[^a-zäöüß]/g, ""));
      for (const z of d.zeilen) {
        const gefunden = protokoll(z, istWort).filter(einzelBuchstabe);
        expect(gefunden, `${d.name}: „${z}"`).toEqual([]);
        // Und die Zeile beginnt mit dem GANZEN Satz - alle Wörter sind bekannt.
        expect(readPlanAt(z, 0, SARAH, istWort)[0], `${d.name}: „${z}"`).toBe(z);
      }
    }
  });

  it("jedes Wort wird an seinem Anfang GANZ gesagt, mitten im Wort schweigt die Stimme (Buchstabieren aus)", () => {
    const zeilen = FREMDWOERTER.teens[0].paare.map(fremdZeile);
    const woerter = woerterAusEigenemText(zeilen);
    const istWort = (t: string) => nurLexikon(t) || woerter.has(t.toLowerCase().replace(/[^a-zäöüß]/g, ""));
    const z = "Vermutung - Hypothese";
    const p = protokoll(z, istWort);
    // Wortanfang „H" (Index 12): das ganze Wort, nicht „großes H".
    expect(p[12].plan).toEqual(["Hypothese"]);
    // Mitten im Wort: nichts - Buchstabieren ist aus.
    expect(p[13].plan).toEqual([]);
    expect(p[20].plan).toEqual([]);
    // Die Leertaste und der Bindestrich werden weiter benannt.
    expect(p[9].plan).toEqual(["Leertaste"]);
    expect(p[10].plan).toEqual(["Bindestrich"]);
  });
});

describe("★★ Die Wörter eines eigenen Textes", () => {
  it("klein, nur Buchstaben, mindestens zwei - Satzzeichen und Einzelbuchstaben zählen nicht", () => {
    const w = woerterAusEigenemText(["Das Nachschlagewerk steht im Regal, a b.", "Ein (Test) - fertig!"]);
    expect([...w].sort()).toEqual(["das", "ein", "fertig", "im", "nachschlagewerk", "regal", "steht", "test"]);
  });

  it("Text mit einer Klammer bleibt Text; Prosa mit Doppelpunkt auch", () => {
    expect(textSiehtAusWieCode(["Ein Ort (mit Büchern).", "Merke: zuerst lesen.", "Dann schreiben wir."])).toBe(false);
  });

  it("★ Quelltext bekommt KEINE Wörter - alle zehn Programmcode-Vorlagen werden als Code erkannt", () => {
    for (const c of CODE_VORLAGEN) {
      const zeilen = [c.introDe, ...c.zeilen];
      expect(textSiehtAusWieCode(zeilen), c.sprache).toBe(true);
      expect(woerterAusEigenemText(zeilen).size, c.sprache).toBe(0);
    }
  });

  it("Gegenprobe zu Code: ein Bezeichner wird dort weiter buchstabiert (wie bisher)", () => {
    const python = CODE_VORLAGEN.find((c) => c.sprache === "Python")!;
    const zeile = python.zeilen.find((z) => z.includes("ValueError"))!;
    const woerter = woerterAusEigenemText([python.introDe, ...python.zeilen]);
    const istWort = (t: string) => nurLexikon(t) || woerter.has(t.toLowerCase().replace(/[^a-zäöüß]/g, ""));
    const i = zeile.indexOf("ValueError");
    // Kein ganzes Wort „ValueError" - der Buchstabe.
    expect(readPlanAt(zeile, i, SARAH, istWort)).not.toContain("ValueError(");
    expect(readPlanAt(zeile, i, SARAH, istWort)).toEqual(["großes V"]);
  });

  it("Übungssilben der Grundreihe bleiben buchstabiert - sie kommen nicht aus einem eigenen Text", () => {
    // Die Grundreihe reicht keine Wörter herein: `zusatzWoerter` fehlt.
    expect(readPlanAt("flass salö", 0, SARAH, nurLexikon)).toEqual(["f"]);
  });
});

describe("★★★ Im laufenden Übungsfeld (TypingSession mit den Wörtern des Textes)", () => {
  const ZEILE = "herunterladen - downloaden";

  beforeEach(() => {
    vi.mocked(speakSequence).mockClear();
    useTypingA11y.setState({ tastenAnsage: "aus" });
  });
  afterEach(cleanup);

  function aufbauen(mitWoertern: boolean): HTMLElement {
    const r = render(
      <TypingSession
        items={[ZEILE]}
        contextId="test-eigener-text-woerter"
        unlocked={new Set([...ZEILE])}
        shiftLearned
        stufe={1 as never}
        voiceEnabled
        zusatzWoerter={mitWoertern ? woerterAusEigenemText([ZEILE]) : undefined}
        onRetry={() => {}}
      />,
    );
    const feld = r.container.querySelector<HTMLElement>('[data-feld="tippen"]');
    if (!feld) throw new Error("Übungsfeld nicht gefunden");
    return feld;
  }

  async function tippe(feld: HTMLElement, tasten: string): Promise<void> {
    for (const taste of tasten) {
      await act(async () => {
        fireEvent.keyDown(feld, { key: taste });
        await new Promise((f) => setTimeout(f, 20));
      });
    }
  }

  const alleAnsagen = () => vi.mocked(speakSequence).mock.calls.flatMap(([teile]) => teile);
  const einzelne = () => alleAnsagen().filter((a) => a.length === 1);

  it("Gegenprobe: OHNE die Wörter des Textes sagt die Stimme Einzelbuchstaben an", async () => {
    const feld = aufbauen(false);
    await tippe(feld, "herunterladen ");
    expect(einzelne().length).toBeGreaterThan(3);
    expect(alleAnsagen()).not.toContain(ZEILE);
  });

  it("MIT den Wörtern: die ganze Zeile am Anfang, danach jedes Wort ganz - kein Einzelbuchstabe", async () => {
    const feld = aufbauen(true);
    // Zeilenanfang: der ganze Satz.
    expect(vi.mocked(speakSequence).mock.calls[0]?.[0]).toContain(ZEILE);
    await tippe(feld, "herunterladen - ");
    expect(einzelne()).toEqual([]);
    // Nach dem ersten Wort und der Leertaste kommt das zweite Wort GANZ.
    expect(alleAnsagen()).toContain("downloaden");
  });
});

describe("★ Verdrahtung: beide Läufe reichen die Wörter des eigenen Textes durch", () => {
  it("Eigene Übung und Tippchallenge mit eigener Datei benutzen `woerterAusEigenemText`", () => {
    const eigene = readFileSync(resolve(WURZEL, "src/components/typing/EigeneUebungLauf.tsx"), "utf8");
    expect(eigene).toContain("woerterAusEigenemText(text?.zeilen");
    expect(eigene).toContain("zusatzWoerter={textWoerter}");
    const challenge = readFileSync(resolve(WURZEL, "src/components/typing/SchreibprobeLauf.tsx"), "utf8");
    expect(challenge).toContain("setWoerter(woerterAusEigenemText(zeilen))");
  });
});
