/**
 * ★ O2-LIB Fortsetzung (30.10.2026): die übrigen Oberflächentexte aus `src/lib/typing/` in den neun Sprachen des Gerüsts.
 * Zwei Hälften: (1) echte Aufrufe je Sprache - weder englisch noch deutsch, Hausregeln; (2) im Quelltext der Dateien
 * keine Rückfall-Marke und kein `geruestAufEn` mehr, ausser den benannten echten Werten.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { GERUEST_SPRACHEN } from "../src/lib/typing/sprachRegister";
import type { Lang } from "../src/lib/typing/account";
import { copyFor, starsSpokenFor } from "../src/lib/typing/skin";
import { EXPEDITION_ZONES, zoneName, zoneTrains } from "../src/lib/typing/expedition/course";
import { diaryText } from "../src/lib/typing/expedition/texts";
import { VORLAGEN, vorlageTitel } from "../src/lib/typing/vorlagen";
import { topfLabel } from "../src/lib/typing/jahreskarte";
import { schulstufeText } from "../src/lib/typing/klassenEinstellungen";
import { fmtTagMonat, fmtTagMonatJahr } from "../src/lib/typing/datum";
import { serverMeldung } from "../src/lib/typing/serverMeldungen";
import { kuerzelZeilen } from "../src/lib/typing/kuerzelListe";
import { stellenName } from "../src/lib/typing/fehlerstelle";
import { WAHLTASTE_SATZ } from "../src/lib/typing/wahltaste";
import { formatPracticeSpoken } from "../src/lib/typing/practiceClock";
import {
  einladungSatz,
  matchHinweisLaeuft,
  matchHinweisSatz,
  platzSatz,
} from "../src/lib/typing/klassenmatch";
import { RUNDGANG_TEXTE } from "../src/lib/typing/rundgangTexte";
import { didaktikHinweise } from "../src/lib/typing/didaktikHinweise";

const TAG = new Date(2026, 8, 21).getTime();
/** Eine Meldung, die der Server wirklich schickt (Schlüssel aus SERVER_MELDUNGEN_EN). */
const quelle = readFileSync(resolve(__dirname, "../src/lib/typing/serverMeldungen.ts"), "utf8");
const SERVER_TEXT = /SERVER_MELDUNGEN_EN[^=]*= \{\s*(?:\/\/[^\n]*\s*)*"([^"]+)":/.exec(quelle)?.[1] ?? "";

/** Funktionen als Quelltext: `JSON.stringify` liesse sie sonst still weg, und zwei leere Objekte wären „gleich". */
const flach = (x: unknown): string =>
  JSON.stringify(x, (_k, v) => (typeof v === "function" ? String(v) : v));

const PROBEN: Record<string, (s: Lang) => unknown> = {
  zoneName: (s) => EXPEDITION_ZONES.map((z) => zoneName(z, s)),
  zoneTrains: (s) => EXPEDITION_ZONES.map((z) => zoneTrains(z, s)),
  diaryText: (s) => [diaryText("water", false, s, s), diaryText("cave", false, s, s), diaryText("cave", true, s, "de")],
  sterne: (s) => [1, 2, 3].map((n) => starsSpokenFor(copyFor("kids"), n, s)),
  vorlageTitel: (s) => VORLAGEN.map((v) => vorlageTitel(v, s)),
  topfLabel: (s) => [0, 1, 2, 3].map((i) => topfLabel(i, s)),
  schulstufeText: (s) => [schulstufeText(null, s), schulstufeText(5, s)],
  serverMeldung: (s) => serverMeldung(SERVER_TEXT, s),
  kuerzelZeilen: (s) => kuerzelZeilen(s, "X"),
  stellenName: (s) => [1, 2, 3].map((n) => stellenName(n, s)),
  wahltasteSatz: (s) => WAHLTASTE_SATZ[s],
  uhr: (s) => formatPracticeSpoken(125_000, s),
  matchHinweis: (s) => matchHinweisLaeuft(s),
  matchSatz: (s) => matchHinweisSatz(matchHinweisLaeuft(s)),
  einladung: (s) => einladungSatz("Mia", s),
  platz: (s) => platzSatz(2, 6, s),
  rundgang: (s) => RUNDGANG_TEXTE[s],
  didaktik: (s) => didaktikHinweise(s).punkte,
};

describe.each(GERUEST_SPRACHEN.map((s) => [s]))("O2-LIB Rest: %s", (s) => {
  for (const [name, probe] of Object.entries(PROBEN)) {
    it(name, () => {
      const ist = flach(probe(s));
      expect(ist, `${name} · ${s}: englisch`).not.toBe(flach(probe("en")));
      expect(ist, `${name} · ${s}: deutsch`).not.toBe(flach(probe("de")));
      expect(ist, `${name} · ${s}: Gedankenstrich`).not.toMatch(/[–—]/);
      expect(ist, `${name} · ${s}: Marke`).not.toMatch(/RÜCKFALL-EN/);
      if (s === "ro") expect(ist, "ro: Cedille statt Komma").not.toMatch(/[şţŞŢ]/);
    });
  }

  it("die Serverprobe ist echt und wird übersetzt, nicht deutsch durchgereicht", () => {
    expect(SERVER_TEXT.length).toBeGreaterThan(3);
    expect(serverMeldung(SERVER_TEXT, s).lang).toBeUndefined();
  });

  it("Datum: nicht die deutsche Form", () => {
    expect(fmtTagMonat(TAG, s)).not.toBe(fmtTagMonat(TAG, "de"));
    expect(fmtTagMonatJahr(TAG, s)).not.toBe(fmtTagMonatJahr(TAG, "de"));
    expect(fmtTagMonatJahr(TAG, s)).toMatch(/2026/);
  });

  it("didaktik: Quellen sind die englischen, keine erfundenen", () => {
    expect(didaktikHinweise(s).quellen).toEqual(didaktikHinweise("en").quellen);
  });
});

describe("O2-LIB Rest: im Quelltext keine Rückfall-Marke mehr", () => {
  it("badges: nextGoalUnit liest je Sprache das eigene Feld", () => {
    const t = readFileSync(resolve(__dirname, "../src/lib/typing/badges.ts"), "utf8");
    expect(t).not.toMatch(/\b(bg|el|hu|nl|pt|br|ro|sv|uk): "unitEn"/);
    expect(t).toMatch(/uk: "unitUk"/);
  });

  const DATEIEN = [
    "merkfensterTexte", "expedition/texts", "expedition/course", "skin", "klassenmatch", "useKlassenmatch",
    "useEigenerTextUpload", "belohnungsspiel", "schreibprobenUebersicht", "schreibprobeAuswertung", "uebungsformen/pyramide",
    "rundgangTexte", "schreibprobeHinweise", "didaktikHinweise", "serverMeldungen", "grundstellung", "kuerzelListe",
    "leistungSpaltenTexte", "fehlerstelle", "practiceClock", "rueckmeldung", "einrichtung", "zeichenabstand", "wacklig",
    "wahltaste", "schuljahrBeginn", "vorlagen", "jahreskarte", "klassenEinstellungen",
  ];
  it.each(DATEIEN)("%s", (d) => {
    const t = readFileSync(resolve(__dirname, `../src/lib/typing/${d}.ts`), "utf8");
    expect(t).not.toMatch(/RÜCKFALL-EN \(G2-NEUN\)/);
    expect(t).not.toMatch(/\bgeruestAufEn\(/);
    expect(t).not.toMatch(/\bmitRueckfallEn\(/);
  });
});
