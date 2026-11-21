/**
 * ★★★ DIE RÜCKMELDUNG NACH DER RUNDE WECHSELT (29.10.2026).
 *
 * Wunsch einer Lehrerin: „Die Rückmeldung nach einer Trainingseinheit ist
 * immer die gleiche (auch bei drei Sternen), kann diese variiert werden und
 * etwas motivierender sein?"
 *
 * Geprüft:
 *  1. Mehrere Runden mit drei Sternen ⇒ mindestens drei verschiedene Titel,
 *     nie derselbe zweimal hintereinander - auch wenn dazwischen Runden mit
 *     anderer Sternzahl liegen und auch über den Überlauf des Zählers hinweg.
 *  2. Bei drei Sternen sagt der Rat weder „nah dran" noch „ruhiger".
 *  3. Die Sätze sind kurz (Braillezeile 40 Zellen), ohne „schade"/„leider",
 *     ohne lange Striche; Jugend und Erwachsene ohne „!" und ohne „Super".
 *  4. Auf der echten Abschluss-Karte wechselt der Titel von Runde zu Runde.
 *  5. Alles Bisherige bleibt: ohne Nummer der bekannte Wortlaut; Sprachen ohne
 *     eigene Sätze behalten ihren Titel, und ihr Rat entfällt bei drei Sternen
 *     lieber, als der Karte zu widersprechen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/typing/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/typing/sound")>()),
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

import { TypingSession } from "@/components/typing/TypingSession";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { UI_COPY, bedienCopy, copyFor, starsSpokenFor } from "@/lib/typing/skin";
import { rueckmeldungFuer } from "@/lib/typing/rueckmeldung";
import {
  RUNDEN_ZAEHLER_KEY,
  naechsteVariante,
  sterneStufe,
  waehle,
} from "@/lib/typing/rundenAbwechslung";
import * as S from "@/lib/typing/rundenSaetze";
import { masteryForLevel } from "@/lib/typing/letters";
import type { LetterStat } from "@/lib/typing/progress";

beforeEach(() => {
  localStorage.clear();
  useTypingAuth.setState({ account: null });
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

const ALLE_LISTEN: Array<[string, S.Stufenliste, "kind" | "klein"]> = [
  ["KIND_TITEL_DE", S.KIND_TITEL_DE, "kind"],
  ["KIND_GESPROCHEN_DE", S.KIND_GESPROCHEN_DE, "kind"],
  ["KIND_TITEL_EN", S.KIND_TITEL_EN, "kind"],
  ["KIND_GESPROCHEN_EN", S.KIND_GESPROCHEN_EN, "kind"],
  ["JUGEND_TITEL_DE", S.JUGEND_TITEL_DE, "klein"],
  ["JUGEND_BEMERKUNG_DE", S.JUGEND_BEMERKUNG_DE, "klein"],
  ["JUGEND_GESPROCHEN_DE", S.JUGEND_GESPROCHEN_DE, "klein"],
  ["ERWACHSEN_TITEL_DE", S.ERWACHSEN_TITEL_DE, "klein"],
  ["ERWACHSEN_GESPROCHEN_DE", S.ERWACHSEN_GESPROCHEN_DE, "klein"],
  ["JUGEND_TITEL_EN", S.JUGEND_TITEL_EN, "klein"],
  ["JUGEND_BEMERKUNG_EN", S.JUGEND_BEMERKUNG_EN, "klein"],
  ["JUGEND_GESPROCHEN_EN", S.JUGEND_GESPROCHEN_EN, "klein"],
  ["ERWACHSEN_TITEL_EN", S.ERWACHSEN_TITEL_EN, "klein"],
  ["ERWACHSEN_BEMERKUNG_EN", S.ERWACHSEN_BEMERKUNG_EN, "klein"],
  ["ERWACHSEN_GESPROCHEN_EN", S.ERWACHSEN_GESPROCHEN_EN, "klein"],
  ["erwachsenBemerkungDe(du)", S.erwachsenBemerkungDe(false), "klein"],
  ["erwachsenBemerkungDe(Sie)", S.erwachsenBemerkungDe(true), "klein"],
];

describe("1 · Der Zähler wechselt - nie zweimal derselbe Satz hintereinander", () => {
  it("12 Runden mit drei Sternen ⇒ mindestens drei verschiedene Titel, nie zweimal gleich hintereinander", () => {
    const titel: string[] = [];
    for (let i = 0; i < 12; i++) titel.push(UI_COPY.kind.summaryTitle(3, naechsteVariante("karte", 3)));
    expect(new Set(titel).size).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < titel.length; i++) expect(titel[i], `Runde ${i}`).not.toBe(titel[i - 1]);
  });

  it("alle Listen: aufeinanderfolgende Nummern geben verschiedene Sätze - auch über den Überlauf (60) hinweg", () => {
    for (const [name, liste] of ALLE_LISTEN)
      for (const stufe of [1, 2, 3] as const) {
        const l = liste[stufe];
        expect(l.length, `${name}[${stufe}]`).toBeGreaterThanOrEqual(3);
        // Eine ganze Umdrehung des Zählers (0..59) und der Anschluss an 0.
        for (let v = 0; v < 61; v++)
          expect(waehle(l, v), `${name}[${stufe}] ${v}`).not.toBe(waehle(l, (v + 1) % 60));
      }
  });

  it("der Zähler läuft je Sternzahl getrennt und überlebt einen Neustart (Gerätespeicher)", () => {
    expect(naechsteVariante("karte", 3)).toBe(0);
    expect(naechsteVariante("karte", 3)).toBe(1);
    expect(naechsteVariante("karte", 2)).toBe(0); // andere Sternzahl, eigener Zähler
    expect(naechsteVariante("bemerkung", 3)).toBe(0); // andere Art, eigener Zähler
    expect(JSON.parse(localStorage.getItem(RUNDEN_ZAEHLER_KEY)!)).toMatchObject({ karte3: 2, karte2: 1 });
    expect(naechsteVariante("karte", 3)).toBe(2);
  });

  it("zwei Runden mit drei Sternen, dazwischen eine mit zwei, dazwischen Titel gleich? - nie hintereinander", () => {
    const folge = [3, 2, 3, 3, 1, 3, 2, 3, 3, 3];
    const letzterJeStufe: Record<number, string> = {};
    for (const s of folge) {
      const t = UI_COPY.kind.summaryTitle(s, naechsteVariante("karte", s));
      expect(t, `Stufe ${s}`).not.toBe(letzterJeStufe[sterneStufe(s)]);
      letzterJeStufe[sterneStufe(s)] = t;
    }
  });

  it("ohne Speicher (kaputter Eintrag) zählt es trotzdem sauber weiter", () => {
    localStorage.setItem(RUNDEN_ZAEHLER_KEY, "{kaputt");
    const a = naechsteVariante("karte", 3);
    const b = naechsteVariante("karte", 3);
    expect(b).not.toBe(a);
  });
});

describe("2 · Die Sätze: kurz, warm, nie gegen die Person", () => {
  it("Kinder-Titel: 6 je Sternzahl, höchstens 40 Zeichen (Braillezeile)", () => {
    for (const liste of [S.KIND_TITEL_DE, S.KIND_TITEL_EN])
      for (const stufe of [1, 2, 3] as const) {
        expect(liste[stufe].length).toBe(6);
        for (const t of liste[stufe]) expect(t.length, t).toBeLessThanOrEqual(40);
      }
  });

  it("jeder Satz höchstens 60 Zeichen, ohne langen Strich, ohne „schade“/„leider“/„nur“", () => {
    const rat = [...(S.RAT_DREI_STERNE.de ?? []), ...(S.RAT_DREI_STERNE.en ?? [])];
    const alle = [
      ...ALLE_LISTEN.flatMap(([, l]) => [...l[1], ...l[2], ...l[3]]),
      ...rat,
    ];
    expect(alle.length).toBeGreaterThan(150);
    for (const t of alle) {
      expect(t.length, t).toBeLessThanOrEqual(60);
      expect(t, t).not.toMatch(/[–—]/);
      expect(t.toLowerCase(), t).not.toMatch(/\b(schade|leider|nur|pity|sadly|unfortunately|only)\b/);
    }
  });

  it("Kinder: bei jeder Sternzahl 5 oder mehr Sätze (Titel, gesprochen) - und weiter keine Bemerkung", () => {
    for (const liste of [
      S.KIND_TITEL_DE, S.KIND_GESPROCHEN_DE,
      S.KIND_TITEL_EN, S.KIND_GESPROCHEN_EN,
    ])
      for (const stufe of [1, 2, 3] as const) expect(liste[stufe].length).toBeGreaterThanOrEqual(5);
    for (const stufe of [0, 1, 2, 3]) {
      expect(UI_COPY.kind.summaryRemark(stufe, 2)).toBe("");
      expect(bedienCopy("kids", "en").summaryRemark(stufe, 2)).toBe("");
    }
  });

  it("Jugend und Erwachsene: 3 oder mehr, ohne „!“ und ohne „Super“", () => {
    for (const [name, liste, art] of ALLE_LISTEN) {
      if (art !== "klein") continue;
      for (const stufe of [1, 2, 3] as const)
        for (const t of liste[stufe]) {
          expect(t, `${name}: ${t}`).not.toContain("!");
          expect(t.toLowerCase(), `${name}: ${t}`).not.toMatch(/\bsuper\b/);
        }
    }
  });

  it("Du- und Sie-Fassung der Erwachsenen: keine Anrede in der falschen Form", () => {
    const du = S.erwachsenBemerkungDe(false);
    const sie = S.erwachsenBemerkungDe(true);
    for (const stufe of [1, 2, 3] as const) {
      for (const t of du[stufe]) expect(t).not.toMatch(/\b(Ihre|Ihr|Ihnen|Sie)\b/);
      for (const t of sie[stufe]) expect(t).not.toMatch(/\b(Deine|Dein|dir|dich|du)\b/i);
    }
    expect(copyFor("erwachsen", "Sie").summaryRemark(3, 0)).toBe("Ihre Finger wissen, was sie tun.");
    expect(copyFor("erwachsen", "du").summaryRemark(3, 0)).toBe("Deine Finger wissen, was sie tun.");
  });

  it("Kinder-Karte: Titel und gesprochener Satz wechseln mit der Nummer - in Deutsch UND Englisch", () => {
    const k = UI_COPY.kind;
    const e = bedienCopy("kids", "en");
    for (const stufe of [1, 2, 3]) {
      expect(new Set([0, 1, 2, 3, 4, 5].map((v) => k.summaryTitle(stufe, v))).size).toBe(6);
      expect(new Set([0, 1, 2, 3, 4, 5].map((v) => e.summaryTitle(stufe, v))).size).toBe(6);
      expect(new Set([0, 1, 2, 3, 4, 5].map((v) => starsSpokenFor(k, stufe, "en", v))).size).toBe(6);
      expect(new Set([0, 1, 2, 3, 4, 5].map((v) => starsSpokenFor(k, stufe, "de", v))).size).toBe(6);
    }
  });

  it("gesprochen trägt jeder deutsche Kindersatz die Sternzahl", () => {
    for (const stufe of [1, 2, 3] as const)
      for (const t of S.KIND_GESPROCHEN_DE[stufe]) expect(t, t).toMatch(new RegExp(`${stufe}|Alle 3`));
  });
});

describe("3 · Bisheriges bleibt", () => {
  it("ohne Nummer der bekannte Wortlaut (Jugend, Erwachsene, gesprochene Kinder-Sätze)", () => {
    expect(UI_COPY.jugend.summaryTitle(3)).toBe("Sauber getippt.");
    expect(UI_COPY.jugend.summaryRemark(1)).toBe("Zählt trotzdem. Beim nächsten Mal etwas ruhiger.");
    expect(UI_COPY.erwachsen.summaryTitle(1)).toBe("Abschnitt geschafft.");
    expect(UI_COPY.kind.starsSpoken(3)).toBe("Super! 3 Sterne erreicht!");
    expect(UI_COPY.kind.starsSpokenEn(2)).toBe("Strong! 2 stars!");
    expect(UI_COPY.kind.summaryTitle(1)).toBe("Runde geschafft!");
  });

  it("Französisch & Co. behalten ihren Titel - die Nummer wird ignoriert", () => {
    const fr = bedienCopy("kids", "fr");
    expect(fr.summaryTitle(3, 0)).toBe("Série réussie !");
    expect(fr.summaryTitle(3, 4)).toBe("Série réussie !");
    expect(starsSpokenFor(UI_COPY.kind, 3, "fr", 4)).toBe(UI_COPY.kind.starsSpokenFr(3));
  });
});

// ── 4 · Der Rat bei drei Sternen ────────────────────────────────────────────

const m = masteryForLevel(5, false);
const INTRO = ["f", "j", "d", "k", "s", "l", "a", "ö", "e", "i"];
const gut = (): LetterStat => ({ hits: 40, misses: 0, sumMs: 40 * 250, timed: 40, recent: Array(20).fill(250) });
/** „i" wackelt noch (zu viele Fehlgriffe) - ein offener Baustein trotz guter Runde. */
const mitWackler = (): Record<string, LetterStat> => ({
  ...Object.fromEntries(INTRO.map((c) => [c, gut()])),
  i: { hits: 30, misses: 10, sumMs: 30 * 250, timed: 30, recent: [-1, -1, -1, ...Array(10).fill(250)] },
});
const rat = (extra: Partial<Parameters<typeof rueckmeldungFuer>[0]>) =>
  rueckmeldungFuer({
    introduced: INTRO, letters: mitWackler(), lernweg: "de", m, rundenOhneTaste: 5, ...extra,
  });

describe("4 · Der Rat passt zu den Sternen", () => {
  it("Gegenprobe: ohne Sterne gilt der alte Rat (Fehler-Fall: „ruhiger“)", () => {
    const r = rat({ rundeAcc: 0.9 });
    expect(r.satz).toMatch(/ruhiger|Zeit|nah dran/);
  });

  it("★ bei drei Sternen nie „nah dran“, nie „ruhiger“ - in allen sechs Fassungen", () => {
    const gesehen = new Set<string>();
    for (let v = 0; v < 6; v++) {
      const r = rat({ rundeAcc: 0.9, sterne: 3, variante: v });
      expect(r.satz, `Variante ${v}`).toBeTruthy();
      expect(r.satz).not.toMatch(/nah dran|ruhiger|Fehler|Zeit lassen|schneller/i);
      gesehen.add(r.satz!);
    }
    expect(gesehen.size).toBe(6);
  });

  it("★ englisch genauso", () => {
    for (let v = 0; v < 6; v++) {
      const r = rat({ rundeAcc: 0.9, sterne: 3, variante: v, lang: "en" });
      expect(r.satz).toBeTruthy();
      expect(r.satz).not.toMatch(/you are close|calmly|mistakes|take your time/i);
    }
  });

  it("★ der Rat wechselt von Runde zu Runde (nie derselbe zweimal hintereinander)", () => {
    const folge: string[] = [];
    for (let i = 0; i < 12; i++)
      folge.push(rat({ sterne: 3, variante: naechsteVariante("rat", 3) }).satz!);
    for (let i = 1; i < folge.length; i++) expect(folge[i]).not.toBe(folge[i - 1]);
    expect(new Set(folge).size).toBeGreaterThanOrEqual(3);
  });

  it("bei drei Sternen und freigeschalteter Taste (oder nichts Offenem) bleibt es bei KEINEM Satz", () => {
    expect(rat({ sterne: 3, freigeschaltet: true }).satz).toBeNull();
    const alleSauber = rueckmeldungFuer({
      introduced: INTRO,
      letters: Object.fromEntries(INTRO.map((c) => [c, gut()])),
      lernweg: "de", m, rundenOhneTaste: 5, sterne: 3,
    });
    expect(alleSauber.satz).toBeNull();
  });

  it("zwei Sterne: der bisherige Rat bleibt", () => {
    const r = rat({ rundeAcc: 0.9, sterne: 2 });
    expect(r.satz).toMatch(/ruhiger|Zeit|nah dran/);
  });

  it("andere Sprachen: bei drei Sternen KEIN Satz (statt eines, der der Karte widerspricht) - sonst unverändert", () => {
    expect(rat({ sterne: 3, lang: "fr" }).satz).toBeNull();
    expect(rat({ rundeAcc: 0.9, sterne: 2, lang: "fr" }).satz).toBeTruthy();
    expect(rat({ rundeAcc: 0.9, lang: "fr" }).satz).toBeTruthy();
  });
});

// ── 5 · Auf der echten Karte ───────────────────────────────────────────────

function eineRunde(stufe: "kids" | "teens") {
  render(
    <TypingSession
      items={["ab"]}
      contextId="abwechslung"
      unlocked={new Set(["a", "b", "c", "d"])}
      shiftLearned={false}
      stufe={stufe}
      voiceEnabled={false}
      onRetry={vi.fn()}
      zeilenPauseMs={50}
    />,
  );
  const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
  for (const key of "ab") fireEvent.keyDown(feld, { key });
}

async function titelDerKarte(): Promise<string> {
  const h = await screen.findByRole("heading", { level: 3 }, { timeout: 3000 });
  return h.textContent ?? "";
}

describe("5 · Auf der echten Abschluss-Karte wechselt der Titel", () => {
  it("★ fünf fehlerfreie Runden hintereinander (Kinder): mindestens drei verschiedene Titel, nie zweimal derselbe", async () => {
    const titel: string[] = [];
    for (let i = 0; i < 5; i++) {
      eineRunde("kids");
      titel.push(await titelDerKarte());
      cleanup();
    }
    for (const t of titel) expect(S.KIND_TITEL_DE[3], t).toContain(t);
    expect(new Set(titel).size).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < titel.length; i++) expect(titel[i], `Runde ${i + 1}`).not.toBe(titel[i - 1]);
  });

  it("★ Jugend: die Karte wechselt ebenfalls, und die Bemerkung darunter mit", async () => {
    const paare: string[] = [];
    for (let i = 0; i < 3; i++) {
      eineRunde("teens");
      const t = await titelDerKarte();
      paare.push(t + " | " + (screen.getByText(S.JUGEND_BEMERKUNG_DE[3].find((b) => screen.queryByText(b))!).textContent ?? ""));
      cleanup();
    }
    expect(new Set(paare).size).toBe(3);
    expect(paare[0]).toContain("Sauber getippt.");
  });
});
