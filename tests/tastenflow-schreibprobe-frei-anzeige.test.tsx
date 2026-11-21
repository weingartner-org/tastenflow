/**
 * ★★★ WÄCHTER: Anzeige „Freies Schreiben" (E6, 23.09.2026) -
 * `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §7.
 *
 * Drei Orte:
 *  1. Die Ergebnis-Karte (`SchreibprobeErgebnis.tsx`) - Kind UND Lehrkraft.
 *  2. Die Rangliste der Lehrkraft (`SchreibprobeKasten.tsx`), Spalte
 *     „Korrekturen" nur bei freiem Plan.
 *  3. Die Tabelle „Tippchallenges" eines Kindes (`SchreibprobenTabelle.tsx`),
 *     kurzer Vermerk „frei"/„free typing" in der Niveau-Zelle.
 *
 * ★ Gegenprobe im strengen Modus: Die Karte bleibt dort UNVERÄNDERT (Auftrag
 * wörtlich: „Strenger Modus: Karte UNVERÄNDERT").
 *
 * Alle Ergebnisse laufen durch das echte Rechenwerk (`werteAus`) - keine
 * erfundenen Zahlen, damit ein Wächter hier denselben Fehler sehen könnte wie
 * die App.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { SchreibprobeErgebnis } from "@/components/typing/SchreibprobeErgebnis";
import { SchreibprobenTabelle } from "@/components/typing/SchreibprobenTabelle";
import { SchreibprobeKasten } from "@/components/lernwerkstatt/klasse/SchreibprobeKasten";
import {
  HINWEIS_CHALLENGE as H,
  HINWEIS_CHALLENGE_EN as H_EN,
  werteAus,
  type AuswertungEingang,
  type Probenergebnis,
  type TypingAccount,
  type TypingClass,
} from "@/lib/typing";
import { BedienSpracheProvider } from "@/lib/bedienSprache";

afterEach(() => {
  cleanup();
  localStorage.removeItem("tastenflow-bedienung");
});

const BEGINN = new Date(2026, 8, 23, 10, 0).getTime();

/** Die Grunddaten einer Probe - je Test nur das Nötige überschrieben. */
function eingang(o: Partial<AuswertungEingang> & { probeId: string }): AuswertungEingang {
  return {
    niveau: "buchstaben",
    textNr: 0,
    textTitel: "Der Igel",
    beginnMs: BEGINN,
    endeMs: BEGINN + 600_000,
    zeitMs: 600_000,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen: 1000,
    fehler: 5,
    zeilen: 20,
    schreibMs: 600_000,
    anschlaege: [],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
    ...o,
  };
}

/** Streng (Vorgabe) - fünf Fehlgriffe, kein `modus`. */
function probeStreng(probeId = "sp-streng"): Probenergebnis {
  return werteAus(eingang({ probeId }));
}

/** Frei - dieselben Zahlen, dazu Korrekturen, Fehlerarten und Fehlerstellen. */
function probeFrei(probeId = "sp-frei"): Probenergebnis {
  return werteAus(
    eingang({
      probeId,
      modus: "frei",
      korrekturen: 13,
      fehlerArten: { falsch: 2, fehlend: 1, ueberzaehlig: 1, leerzeichen: 1 },
      fehlerStellen: [
        { zeile: 2, soll: "Haus", ist: "Hasu", art: "falsch" },
        { zeile: 3, soll: "Baum", ist: "Baun", art: "falsch" },
        { zeile: 4, soll: "Sie,", ist: "", art: "fehlend" },
        { zeile: 4, soll: "", ist: "und", art: "ueberzaehlig" },
        { zeile: 6, soll: "nötig, eine", ist: "nötig,eine", art: "leerzeichen" },
      ],
    }),
  );
}

/** Frei, aber ohne stehende Fehlerstellen (z. B. schon wieder ausgebessert). */
function probeFreiOhneStellen(probeId = "sp-frei-leer"): Probenergebnis {
  return werteAus(eingang({ probeId, fehler: 0, modus: "frei", korrekturen: 0 }));
}

/** Die Wert-Zelle einer `<Zeile>` - über die eindeutige Beschriftung gefunden. */
function zeileWert(beschriftung: string): string {
  const dt = screen.getByText(beschriftung);
  const zeile = dt.closest("div")!;
  return zeile.querySelector("dd")!.textContent ?? "";
}

// ─────────────────────────────────────────────────────────────────────────
// 1 · Die Ergebnis-Karte
// ─────────────────────────────────────────────────────────────────────────

describe("SchreibprobeErgebnis - Freies Schreiben (E6)", () => {
  it(`„Stehengebliebene Fehler", „Korrekturen (Rücktaste)", Fehlerarten und das Gewicht 50`, () => {
    render(<SchreibprobeErgebnis ergebnis={probeFrei()} />);
    expect(zeileWert("Stehengebliebene Fehler")).toBe("5");
    expect(zeileWert("Korrekturen (Rücktaste)")).toBe("13");
    expect(zeileWert("Fehlerarten")).toBe("2 Wörter falsch, 1 fehlt, 1 zu viel, 1 Leerzeichen");
    const t = document.body.textContent ?? "";
    expect(t).toContain("wie 50 Zeichen.");
    expect(t).not.toContain("wie 5 Zeichen.");
    // Die Hinweise stammen aus `schreibprobeHinweise.ts`, nicht abgeschrieben.
    expect(document.body.textContent).toBeTruthy();
    const hinweise = [...document.querySelectorAll('[role="tooltip"]')].map((h) => h.textContent ?? "");
    expect(hinweise).toContain(H.fehlerFrei);
    expect(hinweise).toContain(H.korrekturen);
  });

  it("die Fehlerstellen als geordnete Liste - je Stelle EIN Satz, 1-basiert", () => {
    render(<SchreibprobeErgebnis ergebnis={probeFrei()} />);
    const summary = screen.getByText("Fehlerstellen ansehen (5)");
    const liste = within(summary.closest("details")!)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(liste).toEqual([
      `Zeile 3: „Hasu" statt „Haus"`,
      `Zeile 4: „Baun" statt „Baum"`,
      `Zeile 5: „Sie," fehlt`,
      `Zeile 5: „und" zu viel`,
      `Zeile 7: Leerzeichen - „nötig,eine" statt „nötig, eine"`,
    ]);
  });

  it("ohne Fehlerstellen zeigt die Karte keinen Aufklapper", () => {
    render(<SchreibprobeErgebnis ergebnis={probeFreiOhneStellen()} />);
    expect(screen.queryByText(/Fehlerstellen ansehen/)).toBeNull();
  });

  it(`englisch: „Mistakes left", „Corrections (Backspace)", die Fehlerarten und die Fehlerstellen-Sätze`, () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    render(
      <BedienSpracheProvider>
        <SchreibprobeErgebnis ergebnis={probeFrei()} />
      </BedienSpracheProvider>,
    );
    expect(zeileWert("Mistakes left")).toBe("5");
    expect(zeileWert("Corrections (Backspace)")).toBe("13");
    expect(zeileWert("Kinds of mistake")).toBe("2 words wrong, 1 missing, 1 extra, 1 space");
    const hinweise = [...document.querySelectorAll('[role="tooltip"]')].map((h) => h.textContent ?? "");
    expect(hinweise).toContain(H_EN.fehlerFrei);
    expect(hinweise).toContain(H_EN.korrekturen);
    const summary = screen.getByText("Show the mistakes (5)");
    const liste = within(summary.closest("details")!)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(liste).toEqual([
      `Line 3: "Hasu" instead of "Haus"`,
      `Line 4: "Baun" instead of "Baum"`,
      `Line 5: "Sie," missing`,
      `Line 5: "und" extra`,
      `Line 7: space - "nötig,eine" instead of "nötig, eine"`,
    ]);
  });
});

describe("SchreibprobeErgebnis - strenger Modus bleibt UNVERÄNDERT", () => {
  it(`zeigt „Fehler" wie bisher, kein Korrekturen/Fehlerarten/Fehlerstellen, Gewicht 5`, () => {
    render(<SchreibprobeErgebnis ergebnis={probeStreng()} />);
    expect(zeileWert("Fehler")).toBe("5");
    expect(screen.queryByText("Stehengebliebene Fehler")).toBeNull();
    expect(screen.queryByText("Korrekturen (Rücktaste)")).toBeNull();
    expect(screen.queryByText("Fehlerarten")).toBeNull();
    expect(screen.queryByText(/Fehlerstellen ansehen/)).toBeNull();
    expect(document.body.textContent ?? "").toContain("wie 5 Zeichen.");
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 2 · Die Rangliste der Lehrkraft
// ─────────────────────────────────────────────────────────────────────────

let klassenProben: Record<string, Probenergebnis[]> = {};

vi.mock("@/lib/typing/backend", () => ({
  typingBackend: () => ({
    setzeSchreibprobe: async () => null,
    leseKlassenProben: async () => klassenProben,
    beobachteKinder: () => () => {},
    listPupils: async () => [],
    speichereEigenenText: async () => null,
    listeMeineTexte: async () => [],
    speichereMeinenText: async () => null,
    leseMeinenText: async () => null,
    loescheMeinenText: async () => false,
  }),
}));

const KINDER = [{ id: "k1", role: "schueler", name: "Ferdi", createdAt: 0 }] as TypingAccount[];

function klasse(settings?: unknown): TypingClass {
  return { code: "4a", name: "4a", teacherId: "t1", createdAt: 0, settings } as TypingClass;
}

function zeigeKasten(cls: TypingClass) {
  render(<SchreibprobeKasten cls={cls} pupils={KINDER} onClassChange={() => {}} />);
}

/** Die eine, eben beendete Runde öffnen (Formular + „Vergangene …" darunter). */
async function oeffneVergangeneRunde() {
  await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
  fireEvent.click(screen.getByRole("button", { name: "Tippchallenge" }));
  const runde = screen
    .getAllByRole("button")
    .find((b) => b.closest("li") && b.getAttribute("aria-expanded") === "false")!;
  fireEvent.click(runde);
}

describe(`SchreibprobeKasten - Rangliste: Spalte „Korrekturen" nur bei freiem Plan`, () => {
  it("frei: Spaltenkopf, Hinweis und Wert stehen da", async () => {
    const plan = {
      id: "sp-frei-k",
      niveau: "start",
      startMs: Date.now() - 3 * 24 * 3600_000,
      dauerMin: 10,
      textNr: 0,
      zuschlagProzent: 0,
      angelegtMs: 0,
      modus: "frei",
    };
    klassenProben = {
      k1: [
        werteAus(
          eingang({
            probeId: plan.id,
            beginnMs: plan.startMs,
            endeMs: plan.startMs + 600_000,
            zeichen: 900,
            fehler: 6,
            zeilen: 30,
            modus: "frei",
            korrekturen: 13,
          }),
        ),
      ],
    };
    zeigeKasten(klasse({ schreibprobe: plan }));
    await oeffneVergangeneRunde();
    const koepfe = screen.getAllByRole("columnheader").map((k) => k.textContent ?? "");
    expect(koepfe.some((k) => k.startsWith("Korrekturen"))).toBe(true);
    const zeile = screen.getByText("Ferdi").closest("tr")!;
    expect(within(zeile).getByRole("cell", { name: "13" })).toBeTruthy();
    // ★ Der Hinweis am Kopf „Fehler" nennt im freien Modus die freie Fassung.
    const hinweise = [...document.querySelectorAll('[role="tooltip"]')].map((h) => h.textContent ?? "");
    expect(hinweise).toContain(H.fehlerFrei);
    expect(hinweise).toContain(H.korrekturen);
    expect(hinweise).not.toContain(H.fehler);
  });

  it(`streng: keine Spalte „Korrekturen", der Hinweis an „Fehler" bleibt der alte`, async () => {
    const plan = {
      id: "sp-streng-k",
      niveau: "start",
      startMs: Date.now() - 3 * 24 * 3600_000,
      dauerMin: 10,
      textNr: 0,
      zuschlagProzent: 0,
      angelegtMs: 0,
    };
    klassenProben = {
      k1: [
        werteAus(
          eingang({
            probeId: plan.id,
            beginnMs: plan.startMs,
            endeMs: plan.startMs + 600_000,
            zeichen: 900,
            fehler: 6,
            zeilen: 30,
          }),
        ),
      ],
    };
    zeigeKasten(klasse({ schreibprobe: plan }));
    await oeffneVergangeneRunde();
    const koepfe = screen.getAllByRole("columnheader").map((k) => k.textContent ?? "");
    expect(koepfe.some((k) => k.startsWith("Korrekturen"))).toBe(false);
    const hinweise = [...document.querySelectorAll('[role="tooltip"]')].map((h) => h.textContent ?? "");
    expect(hinweise).toContain(H.fehler);
    expect(hinweise).not.toContain(H.fehlerFrei);
    expect(hinweise).not.toContain(H.korrekturen);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// 3 · Die Tabelle „Tippchallenges" eines Kindes: Vermerk „frei"
// ─────────────────────────────────────────────────────────────────────────

describe(`SchreibprobenTabelle - Vermerk „frei"/„free typing" in der Niveau-Zelle (E6)`, () => {
  it(`deutsch: „frei" nur bei der freien Zeile`, () => {
    const frei = probeFrei("sp-t1");
    const streng = werteAus(eingang({ probeId: "sp-t2", beginnMs: BEGINN - 3600_000, endeMs: BEGINN }));
    render(<SchreibprobenTabelle ergebnisse={[frei, streng]} beschriftung="Test" anrede="Sie" />);
    const zeilen = screen.getAllByRole("row").slice(1); // Kopfzeile weg
    expect(zeilen).toHaveLength(2);
    // Jüngste zuerst (Dateikopf `SchreibprobenTabelle.tsx`) - „frei" ist die jüngere.
    expect(zeilen[0].textContent).toContain("frei");
    expect(zeilen[1].textContent).not.toContain("frei");
  });

  it(`englisch: „free typing"`, () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    const frei = probeFrei("sp-t3");
    render(
      <BedienSpracheProvider>
        <SchreibprobenTabelle ergebnisse={[frei]} beschriftung="Test" anrede="Sie" />
      </BedienSpracheProvider>,
    );
    const zeile = screen.getAllByRole("row")[1];
    expect(zeile.textContent).toContain("free typing");
  });
});
