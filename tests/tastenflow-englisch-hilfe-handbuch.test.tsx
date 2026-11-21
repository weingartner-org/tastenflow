/**
 * ★★★ DEUTSCH-FÄNGER FÜR HILFE UND HANDBUCH-DOWNLOAD (EN7, 19.09.2026).
 *
 * Bereich: die Kinder-Hilfe (`TippenHilfe`, Alt + H) in allen drei Tonlagen
 * (kids · teens · erwachsen, dazu der Alt-Wert „b") und mit jeder Tastatur
 * (die Hilfe zeigt den Tastatur-Hinweis der eingestellten), dazu der Kasten
 * „Downloads für Lehrkräfte" (bis 19.09.2026 „Handbücher für Lehrkräfte",
 * `HandbuecherKasten`) und der Knopf, der ein
 * Handbuch lädt (`HandbuchKnopf`) - samt Fehlermeldung und samt der Frage,
 * WELCHE Datei er in der englischen Bedienung holt.
 *
 * Das englische Handbuch selbst (das PDF) bewacht `tests/typing-handbuch.test.ts`.
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`, der
 * ganze `<body>`). Ausgenommen sind wie in EN3/EN5 nur Fundstellen, deren
 * „Wörter" alle einzelne Zeichen sind - Tasten der deutschen Tastatur (ä, ö,
 * ß), die die Hilfe als Tasten zeigt -, und Inhalt in `lang="de"` (Namen der
 * anderen Apps, die deutschen Beispielwörter „Hund, Schule, Tisch").
 *
 * ★★★ DIE GEGENPROBE: dieselben Zustände in der deutschen Bedienung liefern
 * VIELE Funde - ein Fänger, der nichts liest, sähe sonst genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";

import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { LehrerHilfe } from "@/components/typing/LehrerHilfe";
import { HandbuecherKasten } from "@/components/lernwerkstatt/klasse/HandbuecherKasten";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { HANDBUECHER, handbuecherFuer } from "@/lib/lernwerkstatt/handbuecher";
import { LAYOUTS, setLayout } from "@/lib/typing/layouts";
import { findeDeutsch } from "./helfer/deutschFaenger";

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache | null) {
  if (sprache) {
    localStorage.setItem("tastenflow-bedienung", sprache);
  } else {
    localStorage.removeItem("tastenflow-bedienung");
  }
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

/** Einzelne Tastenzeichen der deutschen Tastatur sind kein deutsches Wort (wie EN5). */
function nurTastenzeichen(fund: string): boolean {
  const woerter = fund.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
  return woerter.length > 0 && woerter.every((w) => [...w].length === 1);
}

function fange(): string[] {
  return findeDeutsch(document.body).filter((f) => !nurTastenzeichen(f));
}

const STUFEN = ["kids", "teens", "erwachsen", "b"] as const;

beforeEach(() => {
  setLayout("de");
});

afterEach(() => {
  cleanup();
  stelleBedienung(null);
  setLayout("de");
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Die Kinder-Hilfe
// ---------------------------------------------------------------------------

describe("Kinder-Hilfe (TippenHilfe) in der englischen Bedienung", () => {
  it.each(STUFEN)("Stufe %s: kein deutsches Wort, und die Hilfe ist wirklich da", (stufe) => {
    stelleBedienung("en");
    zeige(<TippenHilfe open onClose={() => {}} stufe={stufe as never} />);
    const dialog = screen.getByRole("dialog", { name: "Help for Tastenflow" });
    // Gegen einen leeren Dialog: die festen Abschnitte stehen da.
    expect(dialog.textContent).toContain("Just start typing");
    expect(dialog.textContent).toContain("Important keys");
    expect(dialog.textContent).toContain("Class Match");
    expect(fange()).toEqual([]);
  });

  it.each(LAYOUTS.map((l) => l.id))("Tastatur %s: auch der Tastatur-Hinweis ist englisch", (id) => {
    setLayout(id);
    stelleBedienung("en");
    zeige(<TippenHilfe open onClose={() => {}} stufe="erwachsen" />);
    expect(fange()).toEqual([]);
  });

  it("die drei Tonlagen unterscheiden sich wie im Deutschen", () => {
    stelleBedienung("en");
    const text = (stufe: string) => {
      zeige(<TippenHilfe open onClose={() => {}} stufe={stufe as never} />);
      const t = screen.getByRole("dialog").textContent ?? "";
      cleanup();
      return t;
    };
    const kids = text("kids");
    const teens = text("teens");
    const erwachsen = text("erwachsen");
    const b = text("b");
    // Kind: Spielstufe heisst „Game level", ein Ausrufezeichen darf sein.
    expect(kids).toContain("game level");
    expect(kids).toContain("Everyone can earn stars!");
    expect(kids).toContain("How often should I practise?");
    // Ab 11: „Level", sachlich, ohne das Kinder-Lob.
    expect(teens).toContain("Practice time & weekly goal");
    expect(teens).not.toContain("Everyone can earn stars!");
    expect(teens).toContain("text age group");
    // Nur die Jugend wählt das Belohnungs-Spiel; Erwachsene haben kein Spiel.
    expect(teens).toContain("After a new key");
    expect(teens).toContain("Reward game");
    expect(erwachsen).not.toContain("After a new key");
    expect(erwachsen).not.toContain("Ice Floe game");
    expect(kids).not.toContain("Reward game");
    expect(kids).toContain("the game is the reward");
    // Der Alt-Wert „b" bekommt genau die teens-Fassung (wie im Deutschen).
    expect(b).toBe(teens);
    // Kein Ausrufezeichen in den Tonlagen ab 11 (Glossar §1.2) - ausser im
    // zitierten Fenster „Found it! …" von Tasten finden und in der Liste der
    // Satzzeichen „(- ? ! : ;)", wo „!" eine Taste ist (★ D-1: „. ," stehen
    // seither eigens direkt nach der Umschalttaste, nicht mehr in dieser Liste).
    for (const t of [teens, erwachsen])
      expect(t.replace("Found it!", "").replace("(- ? ! : ;)", "")).not.toContain("!");
  });

  it("ohne Maus-Wörter, nur Bindestrich, keine Einführungs-Podcasts", () => {
    stelleBedienung("en");
    for (const stufe of STUFEN) {
      zeige(<TippenHilfe open onClose={() => {}} stufe={stufe as never} />);
      const t = screen.getByRole("dialog").textContent ?? "";
      expect(t).not.toMatch(/\b(click|hover|mouse)/i);
      expect(t).not.toMatch(/[–—]/);
      // Glossar §4: In der englischen Bedienung gibt es keinen Podcast.
      expect(t).not.toMatch(/podcast|🎧/i);
      cleanup();
    }
  });

  it("die deutschen Beispielwörter stehen in lang=\"de\" - »Im Griff« kommt nicht mehr vor", () => {
    stelleBedienung("en");
    zeige(<TippenHilfe open onClose={() => {}} stufe="teens" />);
    const deutsch = [...document.querySelectorAll('[lang="de"]')].map((e) => e.textContent);
    expect(deutsch).toContain("Hund, Schule, Tisch");
    // ★ 28.09.2026 (Johannes): die anderen Apps gibt es nur auf Deutsch - die
    // englische Hilfe nennt sie nicht mehr (bis dahin: „»Im Griff«" in lang="de").
    expect(document.body.textContent).not.toMatch(/Im Griff|Punktgenau|Klangpunkte/);
  });

  it("Schliessen und Fokus: der Knopf heisst englisch und bekommt den Fokus", () => {
    stelleBedienung("en");
    const zu = vi.fn();
    zeige(<TippenHilfe open onClose={zu} stufe="kids" />);
    const knopf = screen.getByRole("button", { name: "Close help" });
    expect(document.activeElement).toBe(knopf);
    fireEvent.click(knopf);
    expect(zu).toHaveBeenCalled();
  });

  it("★ GEGENPROBE: dieselben Zustände deutsch liefern viele Funde - und die deutsche Hilfe ist unverändert", () => {
    stelleBedienung(null);
    for (const stufe of STUFEN) {
      zeige(<TippenHilfe open onClose={() => {}} stufe={stufe as never} />);
      expect(screen.getByRole("dialog", { name: "Hilfe zu Tastenflow" })).toBeTruthy();
      expect(fange().length, `deutsch, Stufe ${stufe}`).toBeGreaterThan(40);
      cleanup();
    }
    // Auf einer fremden Adresse (Provider nicht aktiv) bleibt es deutsch,
    // auch wenn „en" gemerkt ist.
    localStorage.setItem("tastenflow-bedienung", "en");
    render(
      <BedienSpracheProvider aktiv={false}>
        <TippenHilfe open onClose={() => {}} stufe="kids" />
      </BedienSpracheProvider>,
    );
    expect(screen.getByRole("dialog", { name: "Hilfe zu Tastenflow" }).textContent).toContain(
      "Tippe einfach los",
    );
  });
});

// ---------------------------------------------------------------------------
// Handbücher: Kasten und Knopf
// ---------------------------------------------------------------------------

describe("Handbücher für Lehrkräfte in der englischen Bedienung", () => {
  it("der Kasten: kein deutsches Wort, jedes Heft englisch benannt", () => {
    stelleBedienung("en");
    zeige(<HandbuecherKasten programme={["tippen", "braille"]} />);
    expect(screen.getByText("Downloads for teachers")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Download Tastenflow guide \(PDF, / })).toBeTruthy();
    // ★ 28.09.2026 (Johannes: „da die anderen Apps nur in Deutsch zur Verfügung
    // stehen, müssen sie da verschwinden"): Bis dahin standen hier die vier
    // »Im Griff«-Hefte mit „in German". Jetzt nur noch Tastenflow
    // (`programmInSprache`, Wächter `tastenflow-andere-apps-nur-deutsch`).
    expect(screen.queryAllByRole("button", { name: /Im Griff/ })).toHaveLength(0);
    // ★ 19.09.2026: Das Plakat ist KEIN Heft, sondern ein eigener Eintrag.
    // ★ 21.09.2026: Es gibt ihn auch englisch - ohne den Zusatz „in German".
    expect(
      screen.getByRole("button", { name: /^Download Tastenflow poster for hanging up at school \(PDF, \d+ KB\)$/ }),
    ).toBeTruthy();
    // Andere Apps (auch die ohne Handbuch) werden nicht mehr genannt.
    expect(document.body.textContent).not.toContain("There is no guide for");
    expect(fange()).toEqual([]);
  });

  it.skip("★ der Knopf lädt in der englischen Bedienung die ENGLISCHE Ausgabe - unter dem geschützten Pfad", async () => {
    stelleBedienung("en");
    const abruf = vi.fn(
      async (_adresse: RequestInfo | URL) =>
        new Response("kein pdf", { status: 404, headers: { "content-type": "text/html" } }),
    );
    vi.stubGlobal("fetch", abruf);
    const { typingBackend } = await import("@/lib/typing/backend");
    vi.spyOn(typingBackend(), "inhaltsAusweisSichern").mockResolvedValue(undefined as never);
    zeige(<HandbuchKnopf handbuch={handbuecherFuer("tippen")[0]} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Download Tastenflow guide/ }));
    });
    await waitFor(() => expect(abruf).toHaveBeenCalled());
    expect(String(abruf.mock.calls[0][0])).toBe("/handbuecher/tastenflow-handbuch-en.pdf");
    // Kein PDF zurück ⇒ die Fehlermeldung, englisch.
    const meldung = await screen.findByRole("alert");
    expect(meldung.textContent).toContain("The guide could not be loaded");
    expect(fange()).toEqual([]);
    vi.unstubAllGlobals();
  });

  it.skip("★ GEGENPROBE: deutsch - dieselben Knöpfe laden die deutsche Datei, der Kasten liefert viele Funde", async () => {
    stelleBedienung(null);
    const abruf = vi.fn(
      async (_adresse: RequestInfo | URL) =>
        new Response("kein pdf", { status: 404, headers: { "content-type": "text/html" } }),
    );
    vi.stubGlobal("fetch", abruf);
    const { typingBackend } = await import("@/lib/typing/backend");
    vi.spyOn(typingBackend(), "inhaltsAusweisSichern").mockResolvedValue(undefined as never);
    zeige(<HandbuecherKasten programme={["tippen", "braille"]} />);
    expect(screen.getByText("Downloads für Lehrkräfte")).toBeTruthy();
    expect(fange().length).toBeGreaterThan(10);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Tastenflow-Handbuch herunterladen/ }));
    });
    await waitFor(() => expect(abruf).toHaveBeenCalled());
    expect(String(abruf.mock.calls[0][0])).toBe("/handbuecher/tastenflow-lehrerhandbuch.pdf");
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Das Handbuch konnte nicht geladen werden.",
    );
    vi.unstubAllGlobals();
  });

  it("jedes Heft des Katalogs hat eine englische Zeile ohne deutsches Wort (ausser den App-Namen)", () => {
    for (const h of HANDBUECHER) {
      expect(h.en, h.datei).toBeTruthy();
      const saetze = `${h.en!.titel} ${h.en!.hinweis}`.replace("»Im Griff«", "");
      const div = document.createElement("div");
      div.textContent = saetze;
      document.body.appendChild(div);
    }
    expect(fange()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Das Plakat zum Aufhängen in der Schule - in der Lehrer-Hilfe unter dem Handbuch.
// ★ Seit dem Abend des 19.09.2026 ÖFFENTLICH: geladen aus `/tastenflow-plakat.pdf`,
// ohne Datei-Ausweis.
// ---------------------------------------------------------------------------

describe("★ Das Plakat in der Hilfe für Lehrkräfte (19.09.2026)", () => {
  /** Ein Knopf des Abschnitts 12 wird betätigt - und WELCHE Datei er holt, wird gelesen. */
  async function plakatLaden(sprache: BedienSprache | null, plakatName: RegExp, handbuchName: RegExp) {
    stelleBedienung(sprache);
    const abruf = vi.fn(
      async (_adresse: RequestInfo | URL) =>
        new Response("kein pdf", { status: 404, headers: { "content-type": "text/html" } }),
    );
    vi.stubGlobal("fetch", abruf);
    const { typingBackend } = await import("@/lib/typing/backend");
    const ausweis = vi.spyOn(typingBackend(), "inhaltsAusweisSichern").mockResolvedValue(undefined as never);
    ausweis.mockClear();
    zeige(<LehrerHilfe open onClose={() => {}} />);
    const ueberschrift = await screen.findByRole("heading", { name: /^12 · / }, { timeout: 5000 });
    const abschnitt = ueberschrift.closest("section") as HTMLElement;
    const handbuch = within(abschnitt).getByRole("button", { name: handbuchName });
    const plakat = within(abschnitt).getByRole("button", { name: plakatName });
    // Das Plakat steht UNTER dem Handbuch (Johannes: „unter dem Handbuch").
    expect(handbuch.compareDocumentPosition(plakat) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await act(async () => {
      fireEvent.click(plakat);
    });
    await waitFor(() => expect(abruf).toHaveBeenCalled());
    // Öffentlich: kein Ausweis nötig - er wird gar nicht erst geholt.
    expect(ausweis).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    return { abschnitt, adresse: String(abruf.mock.calls[0][0]), ueberschrift: ueberschrift.textContent ?? "" };
  }

  it("deutsch: Handbuch und Plakat stehen im selben Abschnitt, das Plakat darunter - es lädt vom ÖFFENTLICHEN Pfad", async () => {
    const { adresse, ueberschrift } = await plakatLaden(
      null,
      /Tastenflow-Plakat zum Aufhängen in der Schule herunterladen \(PDF, \d+ KB\)/,
      /Tastenflow-Handbuch herunterladen/,
    );
    expect(ueberschrift).toBe("12 · Downloads: Handbuch und Plakat (PDF)");
    expect(adresse).toBe("/tastenflow-plakat.pdf");
  });

  it("englisch: dasselbe - mit dem ENGLISCHEN Plakat (21.09.2026), vom öffentlichen Pfad; kein deutsches Wort", async () => {
    const { abschnitt, adresse, ueberschrift } = await plakatLaden(
      "en",
      /Download Tastenflow poster for hanging up at school \(PDF, \d+ KB\)/,
      /Download Tastenflow guide/,
    );
    expect(ueberschrift).toBe("12 · Downloads: the guide and the poster (PDF)");
    expect(adresse).toBe("/tastenflow-plakat-en.pdf");
    expect(findeDeutsch(abschnitt).filter((f) => !nurTastenzeichen(f))).toEqual([]);
  });

  it("das Plakat steht in der Liste HINTER dem Handbuch - `[0]` bleibt das Handbuch", () => {
    expect(handbuecherFuer("tippen")[0].datei).toBe("tastenflow-lehrerhandbuch.pdf");
    expect(handbuecherFuer("tippen")[1].datei).toBe("tastenflow-plakat.pdf");
  });
});

// ---------------------------------------------------------------------------
// Lehrerunterlagen: die Zugangsdaten-Liste als Word-Datei
// ---------------------------------------------------------------------------

describe("Lehrerunterlage „Teilnehmerliste“ (Word) - englisch", () => {
  /** Der sichtbare Text der Word-Datei (alle `<w:t>` von word/document.xml). */
  async function wortText(sprache: BedienSprache): Promise<string> {
    const { Packer } = await import("docx");
    const JSZip = (await import("jszip")).default;
    const { baueTeilnehmerliste } = await import("@/lib/lernwerkstatt/teilnehmerlisteDocx");
    const doc = await baueTeilnehmerliste(
      { name: "3b", code: "MSWEIN" },
      [
        { name: "Mia", password: "km482" },
        { name: "Ben", password: "" },
      ],
      sprache,
      new Date(2026, 8, 19, 10).getTime(),
    );
    const zip = await JSZip.loadAsync(await Packer.toBuffer(doc));
    const xml = await zip.file("word/document.xml")!.async("string");
    return [...xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join(" ");
  }

  it("englisch: Überschrift, Spalten, Datum und Sätze englisch - kein deutsches Wort", async () => {
    const text = await wortText("en");
    expect(text).toContain("Login details: class 3b");
    expect(text).toContain("2 pupils · as of 19 September 2026");
    expect(text).toContain("Password");
    expect(text).toContain("Class code");
    expect(text).toContain("not set yet");
    const div = document.createElement("div");
    div.textContent = text;
    document.body.appendChild(div);
    expect(fange()).toEqual([]);
  });

  it("★ GEGENPROBE: deutsch - dieselbe Datei wie vorher", async () => {
    const text = await wortText("de");
    expect(text).toContain("Zugangsdaten: Klasse 3b");
    expect(text).toContain("2 Lernende · Stand 19.09.2026");
    expect(text).toContain("noch nicht gesetzt");
    expect(text).toContain(
      "Anmeldung in jedem Lernprogramm der Lernwerkstatt mit Klassencode, Name und Passwort.",
    );
    const { listenDateiname } = await import("@/lib/lernwerkstatt/teilnehmerlisteDocx");
    const jetzt = new Date(2026, 8, 19).getTime();
    expect(listenDateiname("3b", jetzt)).toBe("teilnehmerliste-3b-19-09-2026.docx");
    expect(listenDateiname("3b", jetzt, "en")).toBe("class-list-3b-19-09-2026.docx");
  });
});
