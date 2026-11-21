/**
 * ★★★ O-HILFE-NL (25.10.2026): Wächter über die sechs niederländischen Seiten der Etappe O -
 * die drei Hilfen (`TippenHilfe.nl.tsx`, `LehrerHilfe.nl.tsx`, `MeineKlasseHilfe.nl.tsx`) und die
 * drei Rechtstexte (`Impressum.nl.tsx`, `Datenschutz.nl.tsx`, `Barrierefreiheit.nl.tsx`).
 *
 * Vorbild: die Abschnitte für Hilfen/Rechtliches in `tastenflow-tschechisch-alles.test.tsx`. Die
 * niederländische Bedienung ist noch nicht eingeschaltet; die Sprache kommt über einen ersetzten
 * `useBedienSprache` (wie dort). Gerendert wird über die HUBS (`TippenHilfe`, `Impressum` …) - so
 * prüft der Test auch die Tabellenzeile `nl:`.
 *
 * Je Seite:
 *  - Probe: die Seite ist wirklich niederländisch (Titel + häufige niederländische Wörter);
 *  - Fänger: keine Überschrift und kein Satz aus der deutschen oder englischen Grundfassung. Bewusst
 *    eine Liste aus DEN SECHS DATEIEN, nicht ein allgemeiner Englisch-Fänger: gemeinsame Bauteile in
 *    diesen Seiten (`WeitereTasten`, `TastenflowZahlenHilfe`, `DidaktikInhalt`, Rundgang-Knöpfe,
 *    `HandbuchKnopf`, `StatistikSchalter`) zeigen für „nl" bis zu ihrer eigenen Etappe den
 *    englischen Rückfall aus G2 - das ist nicht Sache dieser Etappe (Befund §3);
 *  - Hausregeln: kein Gedankenstrich (– —), keine Maus-Wörter, kein „u/uw" (Glossar Regel 1),
 *    kein „blind typen" (Regel 4);
 *  - dieselben Kürzel (Alt + …) wie die deutsche Fassung derselben Seite.
 * Jede Regel mit Gegenprobe (die deutsche Seite fängt sich im Deutsch-Fänger; die Regeln schlagen
 * an ihren Gegenbeispielen an).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

const bedien = vi.hoisted(() => ({ sprache: "nl" as string }));

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
      spracheOptionen: ["de", "en", "nl"],
    }),
  };
});

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { HINWEIS_DEUTSCH_VERBINDLICH_NL } from "../src/features/legal/LegalShell";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { LehrerHilfe } from "../src/components/typing/LehrerHilfe";
import { MeineKlasseHilfe } from "../src/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { AnnounceProvider } from "../src/lib/a11y";

afterEach(() => {
  cleanup();
  bedien.sprache = "nl";
});

async function lies(knoten: ReactNode, adresse = "/programme/tastenflow"): Promise<string> {
  window.history.replaceState(null, "", adresse);
  render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={[adresse]}>{knoten}</MemoryRouter>
    </AnnounceProvider>,
  );
  await act(() => new Promise<void>((r) => window.setTimeout(r, 10)));
  return getrennterText(document.body);
}

/**
 * Text mit Leerzeichen zwischen Blöcken (Muster aus o-hilfe-br). `textContent` klebt
 * Absätze aneinander („…weingartner.orgKlik"), dann fehlt die Wortgrenze für die Fänger.
 */
function getrennterText(el: HTMLElement): string {
  const kopie = el.cloneNode(true) as HTMLElement;
  kopie.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6, div, td, th, dd, dt, br, section, address, summary").forEach((b) =>
    b.after(document.createTextNode(" ")),
  );
  return (kopie.textContent ?? "").replace(/\s+/g, " ");
}

/**
 * Ganzes Wort / Wortanfang. `\b` kennt in JavaScript nur ASCII-Buchstaben (auch mit `u`):
 * „éénklik" oder „tik opé" sah es als Wortgrenze. Darum `(?<!\p{L})…(?!\p{L})` mit `u` (O2-WAECHTER 29.10.).
 */
function ganz(muster: string, schalter = "iu"): RegExp {
  return new RegExp(`(?<!\\p{L})${muster}(?!\\p{L})`, schalter);
}
function wort(muster: string, schalter = "iu"): RegExp {
  return new RegExp(`(?<!\\p{L})${muster}`, schalter);
}

// ---------------------------------------------------------------------------
// Die Regeln
// ---------------------------------------------------------------------------

/** Maus-Wörter des Niederländischen (Glossar Regel 9). „Zonder muis" ist erlaubt (Barrierefreiheit). */
const MAUS = [
  ganz("klik(t|ken|ken)?"),
  wort("aanklik"),
  wort("dubbelklik"),
  ganz("tik(t|ken)? (op|aan)"),
  ganz("slee?p(en|t)?"),
  ganz("met de muis"),
  wort("muisknop"),
  wort("muisaanwijzer"),
  wort("scroll"),
];
/** Anrede: nie „u/uw", nie „gij/ge" (Regel 1); nie „blind typen" (Regel 4). */
const ANREDE_UND_WORTE = [ganz("uw?", "u"), ganz("gij"), ganz("blind (leren )?typen")];
const GEDANKENSTRICH = /[–—]/;

function verstoesse(text: string): string[] {
  const funde: string[] = [];
  for (const r of [...MAUS, ...ANREDE_UND_WORTE]) {
    const m = text.match(r);
    if (m) funde.push(`${r}: „${text.slice(Math.max(0, (m.index ?? 0) - 30), (m.index ?? 0) + 30)}"`);
  }
  if (GEDANKENSTRICH.test(text)) funde.push("Gedankenstrich");
  return funde;
}

/** Die Kürzel „Alt + …" einer Seite, als sortierte Menge. */
function kuerzel(text: string): string[] {
  return [...new Set([...text.matchAll(/Alt \+ ([A-Za-z0-9+])/g)].map((m) => m[1].toUpperCase()))].sort();
}

/** Häufige niederländische Funktionswörter - die Probe „wirklich niederländisch". */
function nlWoerter(text: string): number {
  return (text.match(ganz("(het|een|niet|voor|wordt|zijn|ook|naar|bij|alleen|je)", "gu")) ?? []).length;
}

// ---------------------------------------------------------------------------
// Die sechs Seiten
// ---------------------------------------------------------------------------

interface Seite {
  name: string;
  zeige: () => Promise<string>;
  titel: string;
  /** Überschriften und Sätze der deutschen Grundfassung (aus der Datei gelesen). */
  deutsch: string[];
  /** Überschriften und Sätze der englischen Fassung. */
  englisch: string[];
}

const SEITEN: Seite[] = [
  {
    name: "Hilfe für Lernende (Kinder)",
    zeige: () => lies(<TippenHilfe open onClose={() => {}} stufe="kids" />),
    titel: "Help - zo werkt Tastenflow",
    deutsch: ["Einfach losschreiben", "Sterne sammeln", "Wichtige Tasten", "Die wichtigste Taste", "Ins Schreibfeld springen", "Was bedeutet der Ring"],
    englisch: ["Just start typing", "Collecting stars", "Symbols in the text", "The Ice Floe game", "What does the ring with the number mean?"],
  },
  {
    name: "Hilfe für Lernende (Erwachsene)",
    zeige: () => lies(<TippenHilfe open onClose={() => {}} stufe="erwachsen" />),
    titel: "Help - zo werkt Tastenflow",
    deutsch: ["Einfach losschreiben", "Abzeichen sammeln", "Die Zeile unter dem Übungsfeld", "Ohne Klasse üben", "Ein Plakat zum Aufhängen"],
    englisch: ["Just start typing", "Collecting badges", "Settings ⚙ in the header"],
  },
  {
    name: "Hilfe für Lehrkräfte",
    zeige: () => lies(<LehrerHilfe open onClose={() => {}} />),
    titel: "Help voor leerkrachten",
    deutsch: ["Klassen & Konten anlegen", "Die Leistungsstufe (1-50)", "Sinnvolle Texte von Anfang an", "Wochenziel", "Löschen", "Downloads: Handbuch und Plakat"],
    // „Weekly goal" nicht: steht im gemeinsamen `DreiWerteHilfe` (englischer Rückfall, nicht diese Etappe).
    englisch: ["Creating classes and accounts", "Class settings and settings for each pupil", "Meaningful texts from the start"],
  },
  {
    name: "Hilfe zu Mijn klassen",
    zeige: () => lies(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />),
    titel: 'Help bij "Mijn klassen"',
    deutsch: ["So ist die Seite aufgebaut", "Der Klassencode", "Ein Kind in eine andere Klasse verschieben", "Tastenwege in diesem Bereich", "Noch ausführlicher"],
    englisch: ["How the page is laid out", "The class code", "Moving a pupil to another class", "Keyboard shortcuts in this area"],
  },
];

const RECHTSSEITEN = new Set(["Colofon", "Privacyverklaring", "Toegankelijkheidsverklaring"]);

describe("★★★ O-HILFE-NL: die sechs Seiten auf Niederländisch", () => {
  it.each(SEITEN.map((s) => [s.name, s] as const))("%s: wirklich niederländisch", async (_n, seite) => {
    const text = await seite.zeige();
    expect(text).toContain(seite.titel);
    expect(nlWoerter(text)).toBeGreaterThan(30);
    if (RECHTSSEITEN.has(seite.name)) expect(text).toContain(HINWEIS_DEUTSCH_VERBINDLICH_NL);
  });

  it.each(SEITEN.map((s) => [s.name, s] as const))("%s: kein Satz der deutschen oder englischen Grundfassung", async (_n, seite) => {
    const text = await seite.zeige();
    const funde = [...seite.deutsch, ...seite.englisch].filter((satz) => text.includes(satz));
    expect(funde).toEqual([]);
  });

  it.each(SEITEN.map((s) => [s.name, s] as const))("%s: Hausregeln (Gedankenstrich, Maus, u/uw, blind typen)", async (_n, seite) => {
    const text = await seite.zeige();
    expect(verstoesse(text)).toEqual([]);
  });

  it.each(SEITEN.map((s) => [s.name, s] as const))("%s: dieselben Kürzel wie die deutsche Fassung", async (_n, seite) => {
    const nl = kuerzel(await seite.zeige());
    cleanup();
    bedien.sprache = "de";
    const de = kuerzel(await seite.zeige());
    expect(nl).toEqual(de);
  });
});

describe("★★★ GEGENPROBE: Fänger und Regeln schlagen an", () => {
  it.each(SEITEN.map((s) => [s.name, s] as const))("%s: die deutsche Seite trägt die Sätze des Deutsch-Fängers", async (_n, seite) => {
    bedien.sprache = "de";
    const text = await seite.zeige();
    // Mindestens die Hälfte der Liste steht wirklich auf der deutschen Seite - sonst fängt der Fänger nichts.
    const treffer = seite.deutsch.filter((satz) => text.includes(satz)).length;
    expect(treffer).toBeGreaterThanOrEqual(Math.ceil(seite.deutsch.length / 2));
    expect(text).not.toContain(seite.titel === "Colofon" ? "Colofon" : seite.titel);
  });

  it("die Regeln finden ihre Gegenbeispiele - und lassen erlaubte Sätze stehen", () => {
    expect(verstoesse("Klik op de knop.")).not.toEqual([]);
    expect(verstoesse("Tik op Beginnen.")).not.toEqual([]);
    expect(verstoesse("Sleep het bestand hierheen.")).not.toEqual([]);
    expect(verstoesse("Kunt u dat herhalen?")).not.toEqual([]);
    expect(verstoesse("Leer blind typen.")).not.toEqual([]);
    expect(verstoesse("Basisrij – nu")).not.toEqual([]);
    expect(verstoesse("Alle functies zijn zonder muis te bedienen. Druk op Enter om 8.00 uur.")).toEqual([]);
    // O2-WAECHTER: Wortgrenzen an Akzent-Buchstaben und an Absatzwechseln.
    expect(verstoesse("Druk op één toets.Klik dan verder.")).not.toEqual([]);
    expect(verstoesse("Kies je idéé uit de lijst.")).toEqual([]);
    expect(verstoesse("Het café uw")).not.toEqual([]);
    expect(verstoesse("Het caféuw")).toEqual([]);
    expect(nlWoerter("één het")).toBe(1);
  });

  it("die Kürzel-Liste liest Alt + + und Ziffern", () => {
    expect(kuerzel("Alt + E en Alt + + / - en Alt + 3 en Alt + e")).toEqual(["+", "3", "E"]);
  });
});
