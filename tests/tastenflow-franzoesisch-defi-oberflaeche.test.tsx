/**
 * ★★★ E11a-5 (26.09.2026): DER DÉFI AUF FRANZÖSISCH - GERENDERT.
 *
 * Der Kasten der Lehrkraft (`SchreibprobeKasten`), die Ergebnis-Karte des
 * Kindes (`SchreibprobeErgebnis`), die Liste und die Tabelle der Défis in
 * „Mes progrès" (`SchreibprobenListe`, `SchreibprobenTabelle`) werden mit
 * Bedienung „fr" wirklich gerendert und mit dem Deutsch-Fänger gelesen - dazu
 * eine kleine Liste englischer Wörter, denn bis E11a-5 fiel der Kasten für
 * „fr" still auf ENGLISCH (seine Tabelle heisst `textTabelle`, der
 * fr-Lücken-Zähler sah sie nie) und fünf Hilfsfunktionen still auf DEUTSCH
 * (`sprache === "en" ? … : Deutsch`, Leitfaden Falle 30).
 *
 * ⚠️ Die Bauteile lesen `useBedienSprache().sprache` - die oberflächen-sichere
 * Fassung, die bis zum Einschalten (E11a-5, Chat) „fr" auf „en" abbildet. Der
 * Test ersetzt darum `oberflaechenSprache` durch die Identität: genau der
 * Zustand nach dem Einschalten, und er gilt vorher wie nachher.
 *
 * ★★★ GEGENPROBE: dieselben Zustände deutsch liefern viele deutsche Funde,
 * englisch viele englische - ein Fänger, der nichts liest, sähe sonst
 * genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speakSequence: vi.fn() };
});

// Der Zustand nach dem Einschalten: „fr" kommt als „fr" bei den Bauteilen an.
vi.mock("../src/lib/bedienSprache/sprache", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/bedienSprache/sprache")>();
  return { ...echt, oberflaechenSprache: (bs: "de" | "en" | "fr") => bs };
});

const JETZT = Date.UTC(2026, 8, 20, 8, 5, 0);
let klassenProben: Record<string, unknown[]> = {};
let eigene: unknown[] = [];

vi.mock("@/lib/typing/backend", () => ({
  typingBackend: () => ({
    setzeSchreibprobe: async (c: string, t: string) => ({ code: c, name: "4a", teacherId: t, createdAt: 0 }),
    leseKlassenProben: async () => klassenProben,
    beobachteKinder: () => () => {},
    listPupils: async () => [],
    listeMeineTexte: async () => [],
    leseMeinenText: async () => null,
    leseProbenergebnisse: async () => eigene,
  }),
}));

import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { SchreibprobeKasten } from "@/components/lernwerkstatt/klasse/SchreibprobeKasten";
import { SchreibprobeErgebnis } from "@/components/typing/SchreibprobeErgebnis";
import { SchreibprobenListe } from "@/components/typing/SchreibprobenListe";
import { SchreibprobenKennzahl, SchreibprobenTabelle } from "@/components/typing/SchreibprobenTabelle";
import { werteAus, type Probenergebnis } from "@/lib/typing/schreibprobeAuswertung";
import { SHIFT_UNIT } from "@/lib/typing/letters";
import type { TypingAccount, TypingClass } from "@/lib/typing/account";
import { findeDeutsch } from "./helfer/deutschFaenger";

// ---------------------------------------------------------------------------
// Die Fänger
// ---------------------------------------------------------------------------

/** Französische Wörter, die der Deutsch-Fänger kennt („des mots", „du texte"). */
const HOMOGRAFE = new Set(["des", "du", "liste"]);

/**
 * Was der Deutsch-Fänger findet - ohne Homografen und ohne Fundstellen, deren
 * sämtliche „Wörter" einzelne Zeichen sind (eine Taste wie „ö" ist eine Taste
 * der deutschen Tastatur, kein deutsches Wort; so auch im englischen Wächter
 * `tastenflow-englisch-challenge-match`).
 */
function deutschFunde(): string[] {
  return findeDeutsch(ohneZitate()).filter((f) => {
    const woerter = f.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
    return woerter.some((w) => [...w].length > 1 && !HOMOGRAFE.has(w.toLowerCase()));
  });
}

/**
 * Der Seiteninhalt ohne das, was in geraden Anführungszeichen steht.
 *
 * ⚠️ Warum: Die Fehlerstellen des freien Modus zitieren die Wörter des TEXTES
 * („Ligne 2 : "und" manque") - das ist INHALT in der Übungssprache (hier ein
 * deutscher Text), nicht Bedienung. Er steht heute in derselben Zeichenkette
 * wie der französische Rahmen, ohne eigenes `lang`; das ist im Englischen
 * genauso und bleibt dort unverändert (siehe Befund, offener Punkt). Geprüft
 * wird darum der Rahmen, nicht das Zitat.
 */
function ohneZitate(): HTMLElement {
  const klon = document.body.cloneNode(true) as HTMLElement;
  const gang = document.createTreeWalker(klon, NodeFilter.SHOW_TEXT);
  for (let n = gang.nextNode(); n; n = gang.nextNode())
    n.textContent = (n.textContent ?? "").replace(/"[^"]*"/g, '""');
  return klon;
}

/**
 * Englische Wörter, die es im Französischen nicht gibt - aus dem Wortschatz der
 * englischen Fassungen dieser Bauteile. Bewusst draussen: „score", „place",
 * „file", „challenge", „type", „text", „minute(s)", „corrections", „extra", „a",
 * „on" (auch französisch).
 */
const ENGLISCHE_WOERTER = new Set(
  (
    "the and you your with from this that please pupil pupils teacher ready handed " +
    "typing keystrokes accuracy mistakes wobbly started time limit none average " +
    "results result read aloud yes key keys range custom progress call off now " +
    "not yet of in is it no was were been left spaces space missing instead " +
    "line lines characters backspace keep practising practice whole " +
    "window starting closes counting until"
  ).split(/\s+/),
);

/** Sichtbarer Text und die vorgelesenen Attribute - ohne `lang="de"`/`lang="en"`-Inhalte. */
function lesbarerText(): string {
  const klon = ohneZitate();
  for (const el of klon.querySelectorAll('[lang="de"], [lang="en"]')) el.remove();
  const attr = [...klon.querySelectorAll("[aria-label],[title],[placeholder]")]
    .map((e) => ["aria-label", "title", "placeholder"].map((a) => e.getAttribute(a) ?? "").join(" "))
    .join(" ");
  return `${klon.textContent ?? ""} ${attr}`;
}

function englischFunde(): string[] {
  const woerter = lesbarerText().toLowerCase().match(/\p{L}+/gu) ?? [];
  return [...new Set(woerter.filter((w) => ENGLISCHE_WOERTER.has(w)))];
}

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

function stelleBedienung(sprache: BedienSprache) {
  localStorage.clear();
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(k: ReactNode) {
  return render(<BedienSpracheProvider>{k}</BedienSpracheProvider>);
}

function ergebnis(probeId: string, beginn: number, over: Record<string, unknown> = {}): Probenergebnis {
  const mal = (char: string, richtig: number, falsch: number) => [
    ...Array.from({ length: richtig }, () => ({ char, correct: true, ms: 200 })),
    ...Array.from({ length: falsch }, () => ({ char, correct: false })),
  ];
  return werteAus({
    probeId,
    niveau: "satz",
    textNr: 3,
    textTitel: "Der Fuchs und die Trauben",
    startZeile: 12,
    beginnMs: beginn,
    endeMs: beginn + 600_000,
    zeitMs: 600_000,
    zuschlagProzent: 0,
    wartezeitMs: 42_000,
    zeichen: 1400,
    fehler: 23,
    zeilen: 41,
    schreibMs: 520_000,
    anschlaege: [...mal(SHIFT_UNIT, 5, 3), ...mal(" ", 20, 4), ...mal("ö", 3, 2), ...mal("k", 6, 2)],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: true,
    ...over,
  } as never);
}

/** Dasselbe Ergebnis im freien Modus - mit Fehlerarten und Fehlerstellen. */
function frei(e: Probenergebnis): Probenergebnis {
  return {
    ...e,
    modus: "frei",
    korrekturen: 7,
    fehlerArten: { falsch: 2, fehlend: 1, ueberzaehlig: 1, leerzeichen: 1 },
    fehlerStellen: [
      { zeile: 0, soll: "Haus", ist: "Huas", art: "falsch" },
      { zeile: 1, soll: "und", ist: "", art: "fehlend" },
      { zeile: 2, soll: "", ist: "der", art: "ueberzaehlig" },
      { zeile: 3, soll: "im Haus", ist: "imHaus", art: "leerzeichen" },
    ],
  } as Probenergebnis;
}

const KINDER = [
  { id: "k1", role: "schueler", name: "Ferdi", createdAt: 0 },
  { id: "k2", role: "schueler", name: "Runa", createdAt: 0 },
  { id: "k3", role: "schueler", name: "Said", createdAt: 0 },
] as TypingAccount[];

const LAEUFT = {
  id: "sp-l",
  niveau: "satz",
  startMs: JETZT - 60_000,
  dauerMin: 10,
  textNr: 2,
  startZeile: 0,
  zuschlagProzent: 0,
  angelegtMs: JETZT - 70_000,
};

/** Den Kasten zeigen und alles aufklappen, was sich aufklappen lässt. */
async function kasten(settings: unknown) {
  const cls = { code: "4a", name: "4a", teacherId: "t1", createdAt: 0, settings } as TypingClass;
  zeige(<SchreibprobeKasten cls={cls} pupils={KINDER} onClassChange={vi.fn()} />);
  await waitFor(() => {
    if (!document.querySelector("[aria-expanded]")) throw new Error("noch nicht");
  });
  for (let runde = 0; runde < 3; runde++) {
    for (const b of document.querySelectorAll('[aria-expanded="false"]')) fireEvent.click(b as HTMLElement);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
  }
}

type Zustand = { name: string; aufbau: () => Promise<void> };

const ZUSTAENDE: Zustand[] = [
  {
    name: "Kasten · Formular",
    aufbau: async () => {
      klassenProben = {};
      await kasten(undefined);
    },
  },
  {
    name: "Kasten · Défi läuft",
    aufbau: async () => {
      klassenProben = {
        k1: [ergebnis("sp-l", JETZT - 50_000)],
        k2: [frei(ergebnis("sp-l", JETZT - 40_000, { zeichen: 100 }))],
      };
      await kasten({ schreibprobe: LAEUFT });
    },
  },
  {
    name: "Kasten · vergangener Défi mit Ergebnistabelle",
    aufbau: async () => {
      const alt = { ...LAEUFT, id: "sp-a", startMs: JETZT - 3 * 86400_000, modus: "frei" };
      klassenProben = {
        k1: [frei(ergebnis("sp-a", JETZT - 3 * 86400_000))],
        k2: [frei(ergebnis("sp-a", JETZT - 3 * 86400_000 + 1000, { fehler: 3 }))],
      };
      await kasten({ schreibprobe: alt });
    },
  },
  {
    name: "Ergebnis-Karte · streng",
    aufbau: async () => {
      zeige(<SchreibprobeErgebnis ergebnis={ergebnis("x", JETZT - 700_000)} onWeiter={vi.fn()} />);
    },
  },
  {
    name: "Ergebnis-Karte · Écriture libre, Fehlerstellen offen",
    aufbau: async () => {
      zeige(<SchreibprobeErgebnis ergebnis={frei(ergebnis("x", JETZT - 700_000))} onWeiter={vi.fn()} />);
      for (const d of document.querySelectorAll("details")) (d as HTMLDetailsElement).open = true;
    },
  },
  {
    name: "Ergebnis-Karte · zu kurz",
    aufbau: async () => {
      zeige(<SchreibprobeErgebnis ergebnis={ergebnis("x", JETZT - 700_000, { zeichen: 50 })} onWeiter={vi.fn()} />);
    },
  },
  {
    name: "Mes progrès · Liste der Défis",
    aufbau: async () => {
      eigene = [
        ergebnis("a", JETZT - 86400_000, { fehler: 5 }),
        ergebnis("b", JETZT - 2 * 86400_000),
        ergebnis("c", JETZT - 3 * 86400_000, { fehler: 60 }),
      ];
      zeige(<SchreibprobenListe accountId="k1" />);
      await waitFor(() => {
        if (!document.querySelector("details")) throw new Error("noch nicht");
      });
      for (const d of document.querySelectorAll("details")) (d as HTMLDetailsElement).open = true;
    },
  },
  {
    name: "Tabelle der Défis · Kind und Lehrkraft",
    aufbau: async () => {
      const liste = [ergebnis("a", JETZT - 86400_000, { fehler: 5 }), ergebnis("b", JETZT - 2 * 86400_000)];
      zeige(
        <>
          <SchreibprobenKennzahl ergebnisse={liste} />
          <SchreibprobenKennzahl ergebnisse={[]} />
          <SchreibprobenTabelle ergebnisse={liste} beschriftung="Défis" titel="Défis" anrede="du" />
          <SchreibprobenTabelle ergebnisse={liste} beschriftung="Défis" titel="Défis" anrede="Sie" />
        </>,
      );
    },
  },
];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(JETZT);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Die Prüfungen
// ---------------------------------------------------------------------------

describe("E11a-5: der Défi spricht Französisch - gerendert", () => {
  for (const z of ZUSTAENDE) {
    it(`${z.name}: kein deutsches, kein englisches Wort`, async () => {
      stelleBedienung("fr");
      await z.aufbau();
      expect((document.body.textContent ?? "").length).toBeGreaterThan(20);
      expect(deutschFunde()).toEqual([]);
      expect(englischFunde()).toEqual([]);
    });
  }

  it("Stichproben: die Wörter des Glossars und die französischen Formate", async () => {
    stelleBedienung("fr");
    klassenProben = { k1: [ergebnis("sp-l", JETZT - 50_000)], k2: [] };
    await kasten({ schreibprobe: LAEUFT });
    const t = document.body.textContent ?? "";
    expect(t).toContain("Défi");
    expect(t).toContain("Rendus : 1 sur 3");
    expect(t).toContain("Annuler le Défi");
    // „10 h 14" - die Uhrzeit von Hand, nie „10:14" (Bauplan §9.1).
    expect(t).toMatch(/Commencer avant \d{1,2} h \d{2}/);
    expect(t).toMatch(/Lancé[^]*\d{2}\/\d{2}\/2026, \d{1,2} h \d{2}/);
    cleanup();

    zeige(<SchreibprobeErgebnis ergebnis={frei(ergebnis("x", JETZT - 700_000))} onWeiter={vi.fn()} />);
    for (const d of document.querySelectorAll("details")) (d as HTMLDetailsElement).open = true;
    const e = document.body.textContent ?? "";
    expect(e).toContain("Précision");
    expect(e).toContain("2 mots faux, 1 mot manquant, 1 mot en trop, 1 espace");
    expect(e).toContain('Ligne 1 : "Huas" au lieu de "Haus"');
    expect(e).toContain("Corrections (Retour arrière)");
  });

  it("der deutsche Titel eines Textes vom Weg „de“ steht in lang=de, nicht als Französisch", async () => {
    stelleBedienung("fr");
    zeige(<SchreibprobeErgebnis ergebnis={ergebnis("x", JETZT - 700_000)} onWeiter={vi.fn()} />);
    const titel = [...document.querySelectorAll('[lang="de"]')].map((e) => e.textContent);
    expect(titel).toContain("Der Fuchs und die Trauben");
  });
});

describe("GEGENPROBE: dieselben Zustände deutsch und englisch", () => {
  it("deutsch: in jedem Zustand deutsche Funde", async () => {
    for (const z of ZUSTAENDE) {
      stelleBedienung("de");
      await z.aufbau();
      expect(deutschFunde().length, z.name).toBeGreaterThan(2);
      cleanup();
    }
  });

  it("englisch: in jedem Zustand englische Funde", async () => {
    for (const z of ZUSTAENDE) {
      stelleBedienung("en");
      await z.aufbau();
      expect(englischFunde().length, z.name).toBeGreaterThan(2);
      cleanup();
    }
  });
});
