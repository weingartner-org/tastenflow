/**
 * ★★★★ WÄCHTER (09.10.2026): Testerin Behebungen vom 02.10. (Klasse CSS6) gelten in ALLEN acht
 * Oberflächensprachen und in allen Sprachwegen - Auftrag Johannes 03.10.: *„nicht nur in den
 * live-Sprachen"*.
 *
 * Teil A - die TEXTE (kein Eintrag fehlt, kein Rückfall auf Deutsch):
 *  · Klassenmatch: Rückfrage „N Kinder haben sich noch nicht entschieden. Trotzdem starten?"
 *    (`LOBBY_TEXTE`), Wahl „lädt gerade ein" (`WAHL_TEXTE`), Einladung (`EINLADUNG_TEXTE`),
 *    neue Taste erst im Training (`ERGEBNIS_TEXTE.neueTaste`);
 *  · Polarstation: „K hast du schon. Weiter mit dem nächsten Buchstaben." (`SPIEL_TEXTE`);
 *  · Servermeldungen „ein Kind, ein Match" (`serverMeldung`), die das KIND liest.
 *  `texte()` verlangt jeden Schlüssel schon über den Typ; dieser Wächter liest die WERTE: Jede
 *  Fassung ist eine andere als die deutsche, und der Deutsch-Fänger findet nichts.
 *
 * Teil B - die SPIELE mit den Buchstaben der neuen Sprachen (pl ą ę ó ł, tr ç ğ ı ö ş ü,
 * cs ě š č ř ž ů, it è ò):
 *  · ★★★ GEFUNDEN beim Bau dieses Wächters: Polarstation (`handleStationKey`) und Pinguin,
 *    Eisscholle und Rutsche (`floeKeyIgnored`) warfen JEDEN Anschlag mit `altKey` hinaus. Am Mac
 *    „Polish - Pro" sind `ą ć ę ł ń ó ś ź ż` Option + Grundbuchstabe - sie gingen dort still
 *    verloren (kein Ton, kein Herz, keine Antwort; „ein Tastendruck ohne Antwort ist eine
 *    kaputte Tastatur"). Jetzt `istKuerzel` wie überall sonst.
 *  · Türkisch: „I" (mit Umschalt) ist die Grossform von „ı", „İ" die von „i" - die Station
 *    zählt beides richtig, und „schon da" sagt „noktalı i" (mit Punkt), nicht „noktasız ı".
 *  · Polnisch: „schon da" nennt den Buchstaben beim Namen („A z ogonkiem już masz.").
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

const zustand = vi.hoisted(() => ({ sprache: "de" as string }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: zustand.sprache,
      spracheGewaehlt: zustand.sprache,
      setzeSprache: () => {},
      bereichAktiv: false,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

import { deutscheWoerter as deutscheWoerterRoh } from "./helfer/deutschFaenger";
import { LOBBY_TEXTE } from "../src/components/typing/KlassenmatchLobby";
import { WAHL_TEXTE } from "../src/components/typing/KlassenmatchWahl";
import { EINLADUNG_TEXTE } from "../src/components/typing/KlassenmatchEinladung";
import { ERGEBNIS_TEXTE } from "../src/components/typing/KlassenmatchErgebnis";
import { SPIEL_TEXTE, caveAnnouncement } from "../src/components/typing/expedition/useExpedition";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import { serverMeldung } from "../src/lib/typing/serverMeldungen";
import { floeKeyIgnored, masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import type { BedienSprache } from "../src/lib/bedienSprache/sprache";
import type { Lernweg } from "../src/lib/typing/lernweg";

afterEach(() => {
  cleanup();
  zustand.sprache = "de";
  setzeLayoutPlattform(null);
  setLayout("de");
});

/**
 * Türkische Wörter, die der Deutsch-Fänger wegen ü/ö für deutsch hält - gemessen an genau diesen
 * Texten (09.10.2026): „henüz" (noch), „götürür" (bringt), „sürene" (deiner Zeit).
 */
const TUERKISCHE_HOMOGRAPHE = new Set(["henüz", "götürür", "sürene"]);
const deutscheWoerter = (satz: string) => deutscheWoerterRoh(satz).filter((w) => !TUERKISCHE_HOMOGRAPHE.has(w));

const ALLE: readonly BedienSprache[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs"];
const FREMD = ALLE.filter((s) => s !== "de");

/** Jeden Wert einer Texttabelle lesen - Funktionen mit vielen Beispielwerten (Mehrzahl!). */
function lies(wert: unknown): string[] {
  if (typeof wert === "string") return [wert];
  if (typeof wert !== "function") return [];
  const aus: string[] = [];
  for (const arg of [0, 1, 2, 3, 5, 12, 22, 25]) {
    const r = (wert as (...a: unknown[]) => unknown)(arg, String(arg));
    aus.push(Array.isArray(r) ? r.join("") : String(r));
  }
  // Namen nur für Funktionen, die einen Namen nehmen (an der Zahl erkannt: eine Funktion über
  // eine Zahl macht aus „Ali" ein „NaN").
  for (const arg of ["Ali", "Zoë"]) {
    const r = (wert as (...a: unknown[]) => unknown)(arg, "3 min");
    const satz = Array.isArray(r) ? r.join("") : String(r);
    if (!satz.includes("NaN")) aus.push(satz);
  }
  return aus;
}

const TABELLEN = {
  LOBBY_TEXTE: { tabelle: LOBBY_TEXTE, schluessel: ["unentschieden", "alleEntschieden", "trotzdemStarten", "warten"] },
  WAHL_TEXTE: { tabelle: WAHL_TEXTE, schluessel: ["titel", "frage", "mitmachen", "selbst", "escape", "anderesKind"] },
  EINLADUNG_TEXTE: { tabelle: EINLADUNG_TEXTE, schluessel: null },
  ERGEBNIS_TEXTE: { tabelle: ERGEBNIS_TEXTE, schluessel: ["neueTaste"] },
} as const;

describe("Teil A - Testerin Texte in allen acht Oberflächensprachen", () => {
  for (const [name, { tabelle, schluessel }] of Object.entries(TABELLEN)) {
    const t = tabelle as unknown as Record<string, Record<string, unknown>>;
    const keys = schluessel ?? Object.keys(t.de);
    for (const sprache of FREMD) {
      it(`${name} · ${sprache}: jeder Eintrag da, keiner deutsch, keiner gleich dem deutschen`, () => {
        for (const k of keys) {
          const ist = lies(t[sprache]?.[k]);
          const de = lies(t.de[k]);
          expect(ist.length, `${name}.${sprache}.${k} fehlt`).toBeGreaterThan(0);
          ist.forEach((satz, i) => {
            expect(satz.trim(), `${name}.${sprache}.${k} leer`).not.toBe("");
            expect(satz, `${name}.${sprache}.${k} ist die deutsche Fassung`).not.toBe(de[i]);
            expect(satz).not.toMatch(/undefined|NaN|[–—]/);
            expect(deutscheWoerter(satz), `${name}.${sprache}.${k}: „${satz}"`).toEqual([]);
          });
        }
      });
    }
  }

  it("GEGENPROBE: der Deutsch-Fänger findet in der deutschen Rückfrage deutsche Wörter", () => {
    expect(deutscheWoerter(LOBBY_TEXTE.de.unentschieden(3)).length).toBeGreaterThan(0);
  });

  for (const sprache of ALLE) {
    it(`Polarstation „schon da" · ${sprache}: Kind- und Erwachsenenfassung, Stand-Satz`, () => {
      const S = SPIEL_TEXTE[sprache];
      const D = SPIEL_TEXTE.de;
      for (const satz of [S.schonDa(false, "K"), S.schonDa(true, "K")]) {
        expect(satz).toContain("K");
        expect(satz).not.toMatch(/[–—]/);
        expect(satz.toLowerCase()).not.toMatch(/falsch|fehler|wrong|faux|incorrect|błęd|hata|chyb|sbagli/);
        if (sprache !== "de") expect(deutscheWoerter(satz), `${sprache}: „${satz}"`).toEqual([]);
      }
      expect(S.schonDa(false, "K")).not.toBe(S.schonDa(true, "K"));
      expect(S.schonDaStand("K, A")).toContain("K, A");
      if (sprache !== "de") {
        expect(S.schonDa(false, "K")).not.toBe(D.schonDa(false, "K"));
        expect(S.schonDaStand("K")).not.toBe(D.schonDaStand("K"));
      }
    });
  }

  const SERVER = [
    "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.",
    "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.",
    "Dieses Klassenmatch ist schon vorbei.",
    "Dieses Klassenmatch gibt es nicht (mehr).",
  ];
  for (const sprache of FREMD) {
    it(`Servermeldungen „ein Kind, ein Match" · ${sprache}: übersetzt, nicht deutsch zurückgegeben`, () => {
      for (const satz of SERVER) {
        const r = serverMeldung(satz, sprache);
        expect(r.lang, `${sprache}: „${satz}" fällt auf Deutsch zurück`).toBeUndefined();
        expect(r.text).not.toBe(satz);
        expect(deutscheWoerter(r.text), `${sprache}: „${r.text}"`).toEqual([]);
      }
    });
  }
});

// ── Teil B: die Spiele mit den Buchstaben der neuen Sprachen ───────────────────────────────

masteryFor("normal");
const noStats: Record<string, LetterStat> = {};

function renderStation(unit: string, lernweg: Lernweg, sprache: BedienSprache) {
  zustand.sprache = sprache;
  const course: FloeCourse = { stages: [{ kind: "station", units: [unit] }] };
  render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={course}
      free
      isAdult={false}
      noTimePressure={false}
      letters={noStats}
      onWin={vi.fn()}
      onFinished={vi.fn()}
      lernweg={lernweg}
    />,
  );
  return screen.getByRole("application");
}

const hearts = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
const statusText = () => document.body.querySelector(".px-status")?.textContent ?? "";
const slotLetters = () =>
  [...document.body.querySelectorAll(".px-station-slots text")].map((t) => t.textContent ?? "").join("");

/** Mac „Polish - Pro": Option + Grundbuchstabe, nur `altKey`, `code` der Grundtaste. */
function macOption(field: Element, key: string, code: string, shift = false) {
  act(() => void fireEvent.keyDown(field, { key, code, altKey: true, shiftKey: shift }));
}
function taste(field: Element, key: string, code?: string, shift = false) {
  act(() => void fireEvent.keyDown(field, { key, code, shiftKey: shift }));
}

describe("Teil B - AltGr-Buchstaben sind Zeichen, auch in den Spielen", () => {
  const ereignis = (key: string, code: string, mod: { alt?: boolean; ctrl?: boolean; altGraph?: boolean }) => ({
    key,
    code,
    altKey: !!mod.alt,
    ctrlKey: !!mod.ctrl,
    metaKey: false,
    getModifierState: (t: string) => t === "AltGraph" && !!mod.altGraph,
  });

  it.each([
    ["Mac Option (nur altKey)", { alt: true }],
    ["Windows Chrome/Edge (Strg + Alt + AltGraph)", { alt: true, ctrl: true, altGraph: true }],
    ["Windows Firefox (nur AltGraph)", { altGraph: true }],
  ])("Pinguin/Eisscholle/Rutsche · pl · %s: ą wird nicht überhört", (_n, mod) => {
    setLayout("pl");
    expect(floeKeyIgnored(ereignis("ą", "KeyA", mod))).toBe(false);
    expect(floeKeyIgnored(ereignis("Ż", "KeyZ", mod))).toBe(false);
  });

  it("GEGENPROBE: das Alt-Kürzel der Seite (Alt + H) bleibt ein Kürzel, auch auf pl", () => {
    setLayout("pl");
    expect(floeKeyIgnored(ereignis("h", "KeyH", { alt: true }))).toBe(true);
    setLayout("de");
    expect(floeKeyIgnored(ereignis("h", "KeyH", { alt: true }))).toBe(true);
  });

  it("Polarstation · pl am Mac: „łąka“ mit Option + L und Option + A ganz getippt, kein Herz weg", () => {
    setLayout("pl");
    setzeLayoutPlattform("mac");
    const field = renderStation("łąka", "pl", "pl");
    macOption(field, "ł", "KeyL");
    macOption(field, "ą", "KeyA");
    expect(slotLetters()).toBe("łą"); // vorher: "" - beide Anschläge still verworfen
    expect(hearts()).toBe(2);
  });

  it("Polarstation · pl: ein schon gesetztes „ą“ (Option + A) ist „schon da“, nicht ein Herz", () => {
    setLayout("pl");
    setzeLayoutPlattform("mac");
    const field = renderStation("ząb", "pl", "pl");
    taste(field, "z", "KeyZ");
    macOption(field, "ą", "KeyA");
    macOption(field, "ą", "KeyA");
    expect(hearts()).toBe(2);
    expect(slotLetters()).toBe("zą");
    // Der Buchstabe mit seinem polnischen Namen, Satzanfang gross: „A z ogonkiem już masz."
    expect(statusText()).toMatch(/^A z ogonkiem już masz\./);
  });
});

describe("Teil B - direkte Sonderbuchstaben in tr, cs, it", () => {
  it("tr: „I“ mit Umschalt ist das grosse „ı“ - „ılık“ geht, auch mit Grossbuchstaben", () => {
    setLayout("tr-q");
    const field = renderStation("ılık", "tr", "tr");
    taste(field, "I", "KeyI", true); // Umschalt + ı-Taste
    taste(field, "l", "KeyL");
    taste(field, "ı", "KeyI");
    expect(slotLetters()).toBe("ılı");
    expect(hearts()).toBe(2);
  });

  it("tr: ein zweites „i“ in „kitap“ ist „schon da“ (kein Herz), der Satz nennt das „i“ mit Punkt", () => {
    setLayout("tr-q");
    const field = renderStation("kitap", "tr", "tr");
    taste(field, "k", "KeyK");
    taste(field, "i", "Quote");
    taste(field, "i", "Quote");
    expect(hearts()).toBe(2);
    // Der Name sagt, welches i: „noktalı i" (mit Punkt) - nicht „noktasız ı".
    expect(statusText()).toMatch(/^Bu harf sende zaten var: noktalı i\./u);
  });

  it.each([
    ["cs", "cs", "řeč", ["ř", "e", "č"]],
    ["cs", "cs", "důl", ["d", "ů", "l"]],
    ["it", "it", "però", ["p", "e", "r", "ò"]],
    ["tr", "tr-q", "güç", ["g", "ü", "ç"]],
    ["pl", "pl", "sól", ["s", "ó", "l"]],
  ] as const)("%s (%s): „%s“ Buchstabe für Buchstabe, kein Herz weg", (weg, layout, wort, tasten) => {
    setLayout(layout);
    const field = renderStation(wort, weg as Lernweg, weg as BedienSprache);
    for (const t of tasten.slice(0, -1)) taste(field, t);
    expect(slotLetters()).toBe(tasten.slice(0, -1).join(""));
    expect(hearts()).toBe(2);
  });
});

describe("Höhle: auf it, pl, tr, cs gibt es KEIN Höhlenwesen - Ton plus Name in der Sprache des Weges", () => {
  // Darum betrifft die Höhlenwesen-Hörprobe (Johannes, offen) die vier neuen Sprachen nicht:
  // die verschobenen Vokale beim Abspielen mit 0,82 gibt es dort gar nicht (BEFUND-2026-10-09 §3).
  it.each([
    ["it", "è"],
    ["pl", "ą"],
    ["tr", "ı"],
    ["cs", "ů"],
  ] as const)("%s: „%s“ kommt als Ton, der Name steht in der Sprache des Weges", (weg, zeichen) => {
    const a = caveAnnouncement(zeichen, weg);
    expect(a.tone).toBe(true);
    expect(a.text.length).toBeGreaterThan(2);
    expect(deutscheWoerter(a.text)).toEqual([]);
    expect(a.text).not.toBe(caveAnnouncement(zeichen, "de").text);
  });
});
