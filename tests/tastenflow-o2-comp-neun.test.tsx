/**
 * ★★★ O2-COMP (30.10.2026): die Bauteile unter `src/components/typing/` in den neun Sprachen des Gerüsts, GERENDERT.
 *
 * Ein `texte({...})` mit allen Schlüsseln sagt noch nicht, dass ein Kind die Fassung auch bekommt: eine Weiche, ein
 * vergessener Eintrag in einer Kette oder eine Tabelle mit `.en` liefert still Englisch oder Deutsch. Darum wird hier
 * wirklich gerendert, mit dem Schalter der Sprache, und der ganze `<body>` gelesen:
 *  · kein englischer Grundsatz (Wörter der Oberfläche; bg, el, uk: gar kein lateinisches Wort ausser Eigennamen/Tasten);
 *  · kein deutscher Grundsatz (Wörter des Deutsch-Fängers, ohne echte Wörter der Sprache);
 *  · Hausregeln: nur `-`, ro mit Komma, keine Maus-Wörter;
 *  · dieselben Tastenkürzel wie Deutsch;
 *  · Datumsformen und Dauer nach der Sprache.
 *
 * ★★★ GEGENPROBE: dieselben Bildschirme auf Englisch und Deutsch müssen anschlagen - ein Fänger, der nichts liest,
 * wäre sonst genauso grün.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { TypingSettings } from "../src/components/typing/TypingSettings";
import { VoiceInstallHelp } from "../src/components/typing/VoiceInstallHelp";
import { WeeklyGoalStats } from "../src/components/typing/WeeklyGoalStats";
import { Punktleiste } from "../src/components/typing/Punktleiste";
import { DreiWerteHilfe, LeistungsstufeHilfe, SpaltenHilfe } from "../src/components/typing/TastenflowZahlenHilfe";
import { KlassenmatchWahl } from "../src/components/typing/KlassenmatchWahl";
import { FeststelltasteFenster } from "../src/components/typing/FeststelltasteWarnung";
import { BadgeZoomDialog } from "../src/components/typing/BadgeZoomDialog";
import { medaillenBeschreibung } from "../src/components/typing/BadgeMedal";
import { fmtDauer } from "../src/components/typing/PupilStatsPanel";
import { PlayerLevelRing } from "../src/components/typing/PlayerLevelRing";
import { farbenGesperrt } from "../src/components/typing/KeyboardPanel";
import { EigeneUebungAnkuendigung } from "../src/components/typing/EigeneUebungAnkuendigung";
import { WeitereTasten } from "../src/components/typing/TippenHilfeTasten";
import { POSES } from "../src/components/typing/expedition/ExpeditionStage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { AnnounceProvider } from "../src/lib/a11y";
import { BADGES } from "../src/lib/typing/badges";
import { isoWeekKey } from "../src/lib/typing/goals";
import { GERUEST_SPRACHEN } from "../src/lib/typing/sprachRegister";
import { DEUTSCHE_WOERTER } from "./helfer/deutschFaenger";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

const NEUN_AN = Object.fromEntries(GERUEST_SPRACHEN.map((s) => [s, true]));

function zeige(sprache: BedienSprache, knoten: ReactNode) {
  localStorage.setItem("tastenflow-bedienung", sprache);
  window.history.replaceState(null, "", "/programme/tastenflow");
  return render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={["/programme/tastenflow"]}>
        <BedienSpracheProvider neueAn={NEUN_AN}>{knoten}</BedienSpracheProvider>
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

const warte = (ms: number) => act(() => new Promise<void>((r) => window.setTimeout(r, ms)));

const MONTAG = new Date(2026, 8, 14, 8, 0, 0).getTime();
const WOCHE_MS = 7 * 86_400_000;
const nichts = () => {};

/** Eine feste Woche, ein Ziel, eine anstehende Änderung, eine Übung: so steht auch jedes Datum im Bild. */
const ZIEL = {
  wochenzielVerlauf: [
    { ab: isoWeekKey(MONTAG), minuten: 30 },
    { ab: isoWeekKey(MONTAG + WOCHE_MS), minuten: 60 },
  ],
};
const UEBUNG = [{ ts: MONTAG + 3_600_000, lesson: "x", chars: 10, errors: 0, ms: 1_800_000, activeMs: 1_800_000 }];

const BILDSCHIRME: { name: string; bau: (s: BedienSprache) => ReactNode }[] = [
  {
    name: "Einstellungen",
    bau: (s) => <TypingSettings stufe="teens" lang={s as never} onLangChange={nichts} lernweg={s as never} />,
  },
  { name: "Stimme installieren", bau: () => <VoiceInstallHelp open onClose={nichts} /> },
  { name: "Wochenziele", bau: () => <WeeklyGoalStats events={UEBUNG} pupil={ZIEL} /> },
  { name: "Wochenziele ohne Ziel", bau: () => <WeeklyGoalStats events={[]} pupil={{}} /> },
  { name: "Klassenmatch-Einladung", bau: () => <KlassenmatchWahl hostName="" onMitmachen={nichts} onSelbst={nichts} onSchliessen={nichts} /> },
  { name: "Feststelltaste", bau: (s) => <FeststelltasteFenster sprache={s} onSchliessen={nichts} /> },
  { name: "Leistungsstufe erklärt", bau: () => <LeistungsstufeHilfe /> },
  { name: "Drei Werte erklärt", bau: () => <DreiWerteHilfe /> },
  { name: "Spalten erklärt", bau: () => <SpaltenHilfe /> },
  { name: "Weitere Tasten", bau: () => <WeitereTasten /> },
  {
    name: "Abzeichen gross",
    bau: () => <BadgeZoomDialog zoom={{ def: BADGES[0], earned: true, ts: MONTAG, secretHidden: false }} onClose={nichts} />,
  },
];

/** Wörter, die keine Reste sind: Eigennamen, Tasten wie auf der Kappe, Abkürzungen. */
const ERLAUBT_LATEIN = new Set(
  "tastenflow punktgenau klangpunkte xp cvi pdf alt altgr ctrl shift enter esc tab backspace caps lock capslock windows win option cmd command macos mac mb nvda jaws voiceover chrome edge safari firefox excel word google microsoft insert home page down end hyperlegible atkinson braille".split(" "),
);

/**
 * Englische Wörter aus Dateien AUSSERHALB von `src/components/typing/`. ★ O4 (30.10.2026): gemessen leer - skin.ts,
 * belohnungsspiel.ts und die Tastaturnamen sind inzwischen eigen. Die Liste bleibt für den nächsten Fund, sie soll leer bleiben.
 */
const BEKANNT_FREMD = new Set<string>([]);

/** Englische Wörter der Oberfläche. */
const ENGLISCH = [
  "the", "and", "you", "your", "with", "please", "weeks", "pupil", "pupils", "teacher", "settings", "password",
  "loading", "saved", "cancel", "close", "back", "next", "done", "finish", "yes", "keys", "speed", "accuracy",
  "week", "delete", "remove", "practice", "practise", "today", "aloud", "custom", "exercise", "weekly", "goal", "keyboard",
  "explore", "find", "welcome", "account", "download", "continue", "challenge", "install", "voice", "language",
];

/** Echte Wörter der Sprache, die auch in den Fängerlisten stehen. */
const HOMOGRAFE: Record<string, readonly string[]> = {
  nl: ["de", "der", "des", "in", "is", "op", "aan", "was", "alle", "bij", "dan", "of", "te", "van", "een", "zo", "wie", "tot", "ook", "bis", "kleiner", "springen", "minuten", "alles", "download", "account", "week"],
  sv: ["in", "och", "alla", "av", "bis", "dem", "den", "der", "ein", "för", "man", "med", "mit", "om", "på", "till", "vid", "wie", "du", "klassen", "statistik", "konto"],
  hu: ["a", "az", "is", "de", "es", "ha", "mit", "ki", "be", "fel", "le", "meg", "alle", "bis", "ein", "im", "am", "auf", "aus", "wie", "van", "egy"],
  pt: ["de", "do", "da", "as", "os", "um", "uma", "no", "na", "se", "em", "ao", "mit", "bis", "des", "alle", "die", "das"],
  br: ["de", "do", "da", "as", "os", "um", "uma", "no", "na", "se", "em", "ao", "mit", "bis", "des", "alle", "die", "das"],
  ro: ["de", "la", "un", "o", "in", "din", "cu", "mit", "bis", "aus", "am", "ale", "alle", "der", "des", "dem", "die", "den", "im", "zu", "runde", "taste"],
};

/** Die Textknoten mit Leerraum dazwischen (`textContent` klebte Absatzende und nächsten Anfang zusammen). */
function textKnoten(wurzel: HTMLElement): string {
  const gang = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
  const teile: string[] = [];
  while (gang.nextNode()) teile.push(gang.currentNode.textContent ?? "");
  return teile.join(" ");
}

/** Der Text unter `body` ohne Elemente, die bewusst eine andere Sprache ausweisen. */
function bodyText(sprache: string): string {
  const klon = document.body.cloneNode(true) as HTMLElement;
  klon.querySelectorAll("[lang]").forEach((el) => {
    const l = el.getAttribute("lang") ?? "";
    if (!l.toLowerCase().startsWith(sprache === "br" ? "pt" : sprache)) el.remove();
  });
  // Unsichtbar für alle (Zeichen-Schrift des Kreuzes u. ä.); der Schliessen-Knopf von `Modal.tsx` ist gemeinsam (Befund).
  klon.querySelectorAll('script,style,[aria-hidden="true"],button[aria-label="Close window"]').forEach((el) => el.remove());
  return Array.from(klon.querySelectorAll<HTMLElement>("*"))
    .flatMap((el) => ["aria-label", "title", "placeholder"].map((a) => el.getAttribute(a) ?? ""))
    .concat(textKnoten(klon))
    .join(" ");
}

function woerter(text: string): string[] {
  return text.match(/\p{L}+/gu) ?? [];
}

function englischeReste(text: string, sprache: string): string[] {
  const liste = new Set(woerter(text).map((w) => w.toLowerCase()));
  const funde = ENGLISCH.filter((w) => liste.has(w) && !(HOMOGRAFE[sprache] ?? []).includes(w));
  if (["bg", "el", "uk"].includes(sprache)) {
    funde.push(
      ...woerter(text).filter(
        (w) => /^[a-zA-Z]{3,}$/.test(w) && !ERLAUBT_LATEIN.has(w.toLowerCase()) && !BEKANNT_FREMD.has(w.toLowerCase()),
      ),
    );
  }
  return [...new Set(funde)];
}

function deutscheReste(text: string, sprache: string): string[] {
  const erlaubt = new Set(HOMOGRAFE[sprache] ?? []);
  return [...new Set(woerter(text).map((w) => w.toLowerCase()))].filter(
    (w) => DEUTSCHE_WOERTER.has(w) && !erlaubt.has(w) && !ERLAUBT_LATEIN.has(w),
  );
}

/** Mit Maus oder Finger gemeinte Wörter je Sprache (ein Klick-TON der Einstellungen ist kein Maus-Wort). */
const MAUS = /(кликн|щракн|клікн|натисн\S* миш|мишк|κλικ|ποντίκι|kattint|egér|klik op|klik met|\bmuis\b|clique em|clique no|clique na|clica em|\brato\b|\bmouse\b|dă clic|faceți clic|klicka på|musen)/iu;

function kuerzel(text: string): string[] {
  return [...new Set(text.match(/Alt \+ \S(?!\p{L})/gu) ?? [])].sort();
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("lang", "de");
  ohneBildschirmTastatur();
  useTypingAuth.setState({ account: null });
  Element.prototype.scrollIntoView = () => {};
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(MONTAG + 86_400_000);
});
afterEach(() => {
  vi.useRealTimers();
  cleanup();
  vi.restoreAllMocks();
});

async function lies(sprache: BedienSprache, b: (typeof BILDSCHIRME)[number]): Promise<string> {
  zeige(sprache, b.bau(sprache));
  await warte(5);
  const text = bodyText(sprache);
  cleanup();
  return text;
}

describe.each(GERUEST_SPRACHEN.map((s) => [s] as const))("O2-COMP gerendert: %s", (s) => {
  it.each(BILDSCHIRME.map((b) => [b.name, b] as const))("%s", async (_name, b) => {
    const text = await lies(s, b);
    expect(text.trim().length, "liest etwas").toBeGreaterThan(5);
    expect(englischeReste(text, s), "englischer Rest").toEqual([]);
    expect(deutscheReste(text, s), "deutscher Rest").toEqual([]);
    expect(text, "Gedankenstrich").not.toMatch(/[–—―]/);
    expect(text, "Maus-Wort").not.toMatch(MAUS);
    if (s === "ro") expect(text, "Cedille statt Komma").not.toMatch(/[şţŞŢ]/);
    if (s === "uk" || s === "bg") {
      expect(text, "lateinischer Doppelgänger").not.toMatch(/\p{Script=Cyrillic}[aceopxiy]|[aceopxiy]\p{Script=Cyrillic}/u);
    }
    expect(kuerzel(text), "Tastenkürzel wie Deutsch").toEqual(kuerzel(await lies("de", b)));
  });

  it("Dauer, Medaille, Posen und Farbhinweis eigen", () => {
    expect(fmtDauer(5_000, s)).not.toBe(fmtDauer(5_000, "en"));
    expect(medaillenBeschreibung(BADGES[0], false, s)).not.toBe(medaillenBeschreibung(BADGES[0], false, "en"));
    expect(medaillenBeschreibung(BADGES[0], true, s)).not.toBe(medaillenBeschreibung(BADGES[0], true, "en"));
    expect(farbenGesperrt(s)).not.toBe(farbenGesperrt("en"));
    for (const p of POSES) {
      expect(p.label[s]).not.toBe(p.label.en);
      if (!(s === "nl" && p.p === "jump")) expect(p.label[s]).not.toBe(p.label.de); // nl „Springen" heisst wirklich so
    }
  });

  it("Eigene Übung: der Knopf ist eigen", () => {
    zeige(s, <EigeneUebungAnkuendigung skin="kind" onWeiter={nichts} />);
    expect(document.querySelector(".btn-primary")?.textContent).not.toBe("Continue");
  });

  it("der Bereich trägt einen gültigen Sprach-Tag (br ist Bretonisch, pt-BR ist richtig)", () => {
    zeige(s, <KlassenmatchWahl hostName="" onMitmachen={nichts} onSelbst={nichts} onSchliessen={nichts} />);
    expect(document.body.querySelector("[lang]")?.getAttribute("lang")).toBe(s === "br" ? "pt-BR" : s);
  });

  it("PlayerLevelRing spricht die Sprache", () => {
    zeige(s, <PlayerLevelRing level={3} into={40} need={100} label="x" xpUnit="XP" />);
    const name = document.querySelector('[role="img"]')?.getAttribute("aria-label") ?? "";
    expect(name.length).toBeGreaterThan(0);
    expect(englischeReste(name, s)).toEqual([]);
    expect(deutscheReste(name, s)).toEqual([]);
  });
});

/** Der Monat, wie Intl ihn nach einem Tag schreibt (el, uk im Genitiv). */
const MONAT_SEPTEMBER: Record<string, string> = {
  bg: "септември", el: "Σεπτεμβρίου", hu: "szeptember", nl: "september", pt: "setembro", br: "setembro",
  ro: "septembrie", sv: "september", uk: "вересня",
};

describe.each(GERUEST_SPRACHEN.map((s) => [s] as const))("O2-COMP Datumsformen: %s", (s) => {
  it("Abzeichen: Monat ausgeschrieben, nicht die deutsche Form", async () => {
    const text = await lies(s, BILDSCHIRME.find((b) => b.name === "Abzeichen gross")!);
    expect(text).toContain(MONAT_SEPTEMBER[s]);
    expect(text).not.toMatch(/14\.09\.2026/);
  });

  it("Wochenziele: anstehende Änderung mit Monat, keine deutsche Datumsform, 24 Stunden", async () => {
    const text = await lies(s, BILDSCHIRME.find((b) => b.name === "Wochenziele")!);
    expect(text).toContain(MONAT_SEPTEMBER[s]);
    expect(text).toMatch(/21/);
    expect(text).not.toMatch(/21\.09\./);
    expect(text, "24 Stunden").not.toMatch(/π\.μ\.|μ\.μ\.|\bAM\b|\bPM\b/);
  });
});

describe("O2-COMP Punktleiste: Namen nach dem Alphabet der Sprache", () => {
  const namenReihe = async (s: BedienSprache, namen: string[]) => {
    zeige(
      s,
      <Punktleiste titel="x" personen={namen.map((name) => ({ name, wert: 50 }))} einheit="%" einheitGesprochen="%" />,
    );
    const leiste = document.querySelector('[role="group"]')!;
    const reihe: string[] = [];
    fireEvent.focus(leiste);
    for (let i = 0; i < namen.length; i++) {
      const einblendung = document.querySelector("div.pointer-events-none")?.textContent ?? "";
      reihe.push(namen.find((n) => einblendung.includes(n)) ?? "?");
      fireEvent.keyDown(leiste, { key: "ArrowRight" });
    }
    cleanup();
    return reihe;
  };

  it("sv: Ä nach Z, Deutsch dazwischen", async () => {
    expect(await namenReihe("sv", ["Zara", "Ärla", "Anna"])).toEqual(["Anna", "Zara", "Ärla"]);
    expect(await namenReihe("de", ["Zara", "Ärla", "Anna"])).toEqual(["Anna", "Ärla", "Zara"]);
  });
});

describe("★★★ GEGENPROBE: die Fänger lesen wirklich", () => {
  it("Englisch und Deutsch schlagen an - dieselben Bildschirme", async () => {
    let en = 0;
    let de = 0;
    for (const b of BILDSCHIRME) {
      en += englischeReste(await lies("en", b), "en").length;
      de += deutscheReste(await lies("de", b), "de").length;
    }
    expect(en).toBeGreaterThan(20);
    expect(de).toBeGreaterThan(20);
  });

  it("ein Maus-Wort und ein englisches Wort in bg fallen auf, Tasten und Eigennamen nicht", () => {
    expect("Кликнете тук").toMatch(MAUS);
    expect(englischeReste("Натисни Enter и settings", "bg")).toEqual(["settings"]);
    expect(englischeReste("Натисни Shift, Enter и Tastenflow", "bg")).toEqual([]);
  });
});
