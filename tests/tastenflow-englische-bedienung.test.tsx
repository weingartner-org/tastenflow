/**
 * ★★★ DER DEUTSCH-FÄNGER - Probestück „englische Bedienung" (Bauplan 12.09.2026,
 * §5 Nr 3 und 4; `BAUPLAN-2026-09-12-ENGLISCHE-BEDIENUNG-PROBESTUECK.md`).
 *
 * Der Fänger selbst - was er liest, woran er Deutsch erkennt, was er ausnimmt -
 * steht seit EN0 (18.09.2026) in `tests/helfer/deutschFaenger.ts`, damit jede
 * folgende Etappe dasselbe Mass benutzt. Hier bleibt, was nur diese Seite
 * betrifft: die Zustände aus §3.4, die gesprochenen Ansagen (nur dieser Test
 * ersetzt `speakUi`) und die Ausnahme für die Abzeichen-Namen.
 *
 * ★ Seit EN0 hängt die Bedienungssprache nicht mehr in `TippenTrainerPage`,
 * sondern EINMAL in `Root` (`TastenflowSprachBereich`). Die Seite wird darum
 * mit ihm und unter ihrer echten Adresse `/programme/tastenflow` gezeigt - unter
 * einer fremden Adresse bliebe sie deutsch, und genau das soll sie auch.
 *
 * ── Was er ausnimmt ─────────────────────────────────────────────────────────
 *  · Inhalte in `lang="de"` und den Sprachschalter „DE - Deutsch" (Helfer).
 *  · Die Bildschirm-Tastatur ist in dieser Datei AUS (`ohneBildschirmTastatur`):
 *    Ihre Tastenkappen bleiben im Probestück, wie sie sind (Auftrag), und sie
 *    kostet in jsdom den Löwenanteil jeder Tipp-Runde (`_typing-probelauf.ts`).
 *
 * ★★★ DIE GEGENPROBE: Derselbe Fänger über die DEUTSCHE Bedienung muss in jedem
 * Zustand Funde melden. Ein Wächter, der beim ersten Lauf grün ist, beweist
 * nichts - er könnte schlicht nichts lesen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { AnnounceProvider } from "../src/lib/a11y";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { BADGES, speakUi, speakUiAlways, typingBackend, useVoice } from "../src/lib/typing";
import { useContrast } from "../src/lib/contrast";
import {
  abschlussKarte,
  naechsteZeile,
  ohneBildschirmTastatur,
  tippfeld,
  tippfeldPflicht,
  zeilenMarke,
} from "./_typing-probelauf";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";
import {
  findeSprachwahlKnopf,
  fokusZurueckAufDemKnopf,
  nurDeutschUndEnglisch,
  nurGeruestAus,
  nurNeueAus,
  sprachwahlEintraege,
  sprachwahlKnopf,
  sprachwahlKuerzel,
  sprachwahlOeffnen,
  waehleSprache,
} from "./helfer/sprachwahl";

/** Ein Kind einer Klasse - Übungssprache Deutsch (kein `lang` am Konto). */
const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

// ---------------------------------------------------------------------------
// Der Fänger
// ---------------------------------------------------------------------------

/**
 * ⚠️ DIE EINE AUSNAHME IM GESPROCHENEN: die Namen aus dem Abzeichen-Katalog.
 *
 * Der Katalog (117 Abzeichen, `lib/typing/badges.ts`) gehört nicht zum
 * Probestück (Bauplan §3.5, „Abzeichen-Regal"). Auf der Abschluss-Karte
 * stehen seine Namen darum in `lang="de"` (und fallen dort unter die
 * lang-Ausnahme), in der Ansage „New badges: …" aber mitten im englischen
 * Satz. Herausgenommen werden NUR die wörtlichen Katalognamen - jedes andere
 * deutsche Wort im selben Satz zählt weiter.
 */
const ABZEICHEN_NAMEN = [
  ...new Set(BADGES.flatMap((b) => [b.name, b.nameNeutral].filter((n): n is string => !!n))),
].sort((a, b) => b.length - a.length);

function ohneAbzeichenNamen(text: string): string {
  let t = text;
  for (const name of ABZEICHEN_NAMEN) t = t.split(name).join("·");
  return t;
}

/**
 * Alles, was der Fänger in diesem Augenblick findet - je Fundstelle eine Zeile:
 * der ganze `<body>` (Fenster hängen als Portal dort) über den Helfer, dazu
 * alles, was die App über `speakUi`/`speakUiAlways` angesagt hat.
 */
function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  const gesagt = [...vi.mocked(speakUi).mock.calls, ...vi.mocked(speakUiAlways).mock.calls];
  for (const aufruf of gesagt) {
    const f = pruefeText("gesprochen", ohneAbzeichenNamen(String(aufruf[0])));
    if (f) funde.add(f);
  }
  return [...funde];
}

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

function stelleBedienung(sprache: "de" | "en") {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeigeSeite(account: typeof JANO | null = null, mitAnsagen = false) {
  useTypingAuth.setState({ account });
  const seite = (
    <MemoryRouter initialEntries={["/programme/tastenflow"]}>
      <TastenflowSprachBereich>
        <TippenTrainerPage />
      </TastenflowSprachBereich>
    </MemoryRouter>
  );
  render(mitAnsagen ? <AnnounceProvider>{seite}</AnnounceProvider> : seite);
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("lang", "de");
  einrichtungFertigMerken();
  ohneBildschirmTastatur();
  useTypingAuth.setState({ account: null });
  useContrast.getState().setMode("hell");
  useVoice.getState().setEnabled(false);
  vi.mocked(speakUi).mockClear();
  vi.mocked(speakUiAlways).mockClear();
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Eine ganze Zeile fehlerfrei tippen und auf die nächste (oder die Karte) warten. */
async function tippeZeile(): Promise<boolean> {
  const feld = tippfeldPflicht("tippeZeile");
  const marke = zeilenMarke();
  for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
  return naechsteZeile(marke, 8000);
}

// ---------------------------------------------------------------------------
// Die Zustände aus §3.4
// ---------------------------------------------------------------------------

type Zustand = { name: string; lauf: () => Promise<string[]>; frist?: number };

const ZUSTAENDE: Zustand[] = [
  {
    // ★ 17.10.2026: Der Lautsprecher öffnet das Akustik-Menü (statt Vorlesen
    // sofort umzuschalten) - der Fänger liest also das OFFENE Menü.
    name: "Gast · Mein Training im Normalzustand, Lautsprecher-Menü offen",
    lauf: async () => {
      zeigeSeite(null);
      await waitFor(() => tippfeldPflicht());
      const werkzeuge = screen.getByRole("navigation");
      const lautsprecher = within(werkzeuge).getByRole("button", {
        expanded: false,
        name: /^(Klang und Vorlesen|Sound and reading aloud)$/,
      });
      fireEvent.click(lautsprecher);
      return fange();
    },
  },
  {
    name: "Gast · Farbmenü (Alt + K) offen, eine Farbe gewählt",
    lauf: async () => {
      zeigeSeite(null);
      await waitFor(() => tippfeldPflicht());
      fireEvent.keyDown(document, { code: "KeyK", altKey: true });
      const knopf = await waitFor(() => {
        const k = document.querySelector<HTMLButtonElement>('button[aria-keyshortcuts="Alt+K"]');
        expect(k?.getAttribute("aria-expanded")).toBe("true");
        return k!;
      });
      const liste = document.getElementById(knopf.getAttribute("aria-controls")!)!;
      const funde = fange();
      fireEvent.click(within(liste).getAllByRole("button")[6]);
      return [...new Set([...funde, ...fange()])];
    },
  },
  {
    name: "Gast · Kurztasten-Liste (Alt + T) offen",
    lauf: async () => {
      zeigeSeite(null);
      await waitFor(() => tippfeldPflicht());
      fireEvent.keyDown(document, { code: "KeyT", altKey: true });
      await screen.findByRole("dialog");
      return fange();
    },
  },
  {
    name: "Gast · eine Zeile getippt",
    lauf: async () => {
      zeigeSeite(null);
      await waitFor(() => tippfeldPflicht());
      await tippeZeile();
      return fange();
    },
    frist: 60000,
  },
  {
    name: "Gast · Abschluss-Karte",
    lauf: async () => {
      // Ein langsames Tempo im Spielstand kürzt die Runde auf das Minimum
      // (`zeilenJeRunde`) - der Zustand ist derselbe, der Test viermal schneller.
      localStorage.setItem("tippen-trainer:v1", JSON.stringify({ xp: 0, lessons: {}, speedEma: 20 }));
      zeigeSeite(null);
      await waitFor(() => tippfeldPflicht());
      for (let i = 0; i < 14 && !abschlussKarte(); i++) {
        if (!(await tippeZeile())) break;
      }
      await waitFor(() => expect(abschlussKarte()).not.toBeNull());
      return fange();
    },
    frist: 120000,
  },
  {
    name: "Kind einer Klasse · Normalzustand und Konto-Menü offen, Abmelden",
    lauf: async () => {
      zeigeSeite(JANO);
      await waitFor(() => tippfeldPflicht());
      const konto = document.querySelector<HTMLButtonElement>('button[aria-keyshortcuts="Alt+J"]')!;
      fireEvent.click(konto);
      await waitFor(() => expect(konto.getAttribute("aria-expanded")).toBe("true"));
      const funde = fange();
      const liste = document.getElementById(konto.getAttribute("aria-controls")!)!;
      const knoepfe = within(liste).getAllByRole("button");
      // Der letzte Eintrag ist Abmelden - er sagt „Abgemeldet." an.
      act(() => fireEvent.click(knoepfe[knoepfe.length - 1]));
      return [...new Set([...funde, ...fange()])];
    },
  },
  {
    name: "Kind einer Klasse · Zeile getippt, Speichern schlägt fehl (Streifen)",
    lauf: async () => {
      vi.spyOn(typingBackend(), "saveProgress").mockRejectedValue(new Error("offline"));
      zeigeSeite(JANO);
      await waitFor(() => tippfeldPflicht());
      await tippeZeile();
      await screen.findByRole("alert");
      return fange();
    },
    frist: 60000,
  },
];

/** Zahlen für den Bericht - landen in der Ausgabe von vitest. */
function melde(sprache: string, zustand: string, funde: string[]) {
  console.info(`[Deutsch-Fänger] ${sprache} · ${zustand}: ${funde.length} Funde`);
}

describe("★★★ Deutsch-Fänger: englische Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`EN · ${z.name}: kein deutsches Wort`, async () => {
      stelleBedienung("en");
      const funde = await z.lauf();
      melde("EN", z.name, funde);
      expect(document.documentElement.getAttribute("lang")).toBe("en");
      // ★ Gegenprobe im selben Lauf: Der Fänger hat wirklich eine Seite gelesen,
      // und zwar eine englische - eine leere Seite wäre auch „ohne Deutsch".
      const englisch = (document.body.textContent ?? "").match(
        /\b(Settings|Help|Account|keyboard shortcuts|Colours and contrast|Read aloud|Next key|Today|Sign out|My account|Shortcut)\b/g,
      );
      expect(englisch?.length ?? 0, "keine englische Bedienung im Dokument").toBeGreaterThanOrEqual(3);
      expect(funde, `Deutsch in der englischen Bedienung:\n${funde.join("\n")}`).toEqual([]);
    }, z.frist ?? 30000);
  }
});

describe("★★★ GEGENPROBE: derselbe Fänger über die deutsche Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`DE · ${z.name}: der Fänger findet Deutsch`, async () => {
      stelleBedienung("de");
      const funde = await z.lauf();
      melde("DE", z.name, funde);
      expect(funde.length, "Der Fänger liest nichts - dann misst er auch nichts").toBeGreaterThanOrEqual(5);
    }, z.frist ?? 30000);
  }
});

// ---------------------------------------------------------------------------
// §5.4 Ein Gerät, das Tastenflow kennt, bleibt deutsch (seit 19.09.2026)
// ---------------------------------------------------------------------------

describe("§5.4 Bekanntes Gerät mit englischem Browser: deutsch, mit Schalter", () => {
  it("★★★ Schalter „EN - English\", <html lang=\"de\">, das Feld in lang=\"de\" - und die Wahl gemerkt", async () => {
    // `beforeEach` hat die Einrichtung als erledigt gemerkt - das Gerät kennt
    // Tastenflow. Ein englischer Browser darf es nicht umkippen.
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-US"]);
    zeigeSeite(null);
    const feld = await waitFor(() => tippfeldPflicht());
    // ★ 28.09.2026 (Freigabe fr/es): statt „EN - English" der Sprachwähler -
    // aktiv ist Deutsch, Englisch steht zur Wahl, in lang="en".
    const knopf = await findeSprachwahlKnopf();
    expect(sprachwahlKuerzel(knopf)).toBe("DE");
    expect(screen.queryByRole("button", { name: "DE - Deutsch" })).toBeNull();
    expect(document.documentElement.getAttribute("lang")).toBe("de");
    expect(feld).toHaveAttribute("lang", "de");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Mein Training");
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("de");
    expect(sprachwahlEintraege(await sprachwahlOeffnen(knopf))).toEqual([
      { name: "Deutsch", lang: "de", gewaehlt: true },
      { name: "English", lang: "en", gewaehlt: false },
      { name: "Français", lang: "fr", gewaehlt: false },
      { name: "Español", lang: "es", gewaehlt: false },
      // ★ 10.10.2026 (Freigabe it/pl/tr/cs): vier weitere Sprachen, je in ihrem Namen.
      { name: "Italiano", lang: "it", gewaehlt: false },
      { name: "Polski", lang: "pl", gewaehlt: false },
      { name: "Türkçe", lang: "tr", gewaehlt: false },
      { name: "Čeština", lang: "cs", gewaehlt: false },
      // ★ 06.11.2026 (Freigabe der neun): jede Sprache nennt sich selbst; Brasilien trägt `pt-BR` (nie `br` = Bretonisch).
      { name: "Български", lang: "bg", gewaehlt: false },
      { name: "Ελληνικά", lang: "el", gewaehlt: false },
      { name: "Magyar", lang: "hu", gewaehlt: false },
      { name: "Nederlands", lang: "nl", gewaehlt: false },
      { name: "Português (Portugal)", lang: "pt", gewaehlt: false },
      { name: "Português (Brasil)", lang: "pt-BR", gewaehlt: false },
      { name: "Română", lang: "ro", gewaehlt: false },
      { name: "Svenska", lang: "sv", gewaehlt: false },
      { name: "Українська", lang: "uk", gewaehlt: false },
    ]);
  });
});

// ★ 10.10.2026 (Freigabe it/pl/tr/cs): der Sprachwähler folgt dem Not-Aus JEDER der vier Sprachen.
describe("§5.5 Sprachwähler und die vier neuen Sprachen (Not-Aus je Sprache)", () => {
  const NAMEN = { it: "Italiano", pl: "Polski", tr: "Türkçe", cs: "Čeština" } as const;
  const MERKER = {
    it: "tastenflow-italienisch-lehrgang",
    pl: "tastenflow-polnisch-lehrgang",
    tr: "tastenflow-tuerkisch-lehrgang",
    cs: "tastenflow-tschechisch-lehrgang",
  } as const;

  it("alle vier im Not-Aus: nur Deutsch, English, Français, Español - Name ohne die neuen Wörter", async () => {
    nurNeueAus();
    zeigeSeite(null);
    const knopf = await findeSprachwahlKnopf();
    expect(knopf.getAttribute("aria-label")).toBe("Sprache - Language - Langue - Idioma");
    expect(sprachwahlEintraege(await sprachwahlOeffnen(knopf)).map((e) => e.name)).toEqual([
      "Deutsch",
      "English",
      "Français",
      "Español",
    ]);
  });

  // Die Tastatur-Rückfrage (W2b) beantwortet "Ja" in der Sprache der Frage.
  const JA = { it: "Sì", pl: "Tak", tr: "Evet", cs: "Ano" } as const;

  for (const k of ["it", "pl", "tr", "cs"] as const) {
    it(`${k}: nur diese Sprache im Not-Aus - sie fehlt in der Liste, die anderen drei bleiben`, async () => {
      nurGeruestAus(); // die neun des Gerüsts im Not-Aus - hier zählen nur die vier
      localStorage.setItem(MERKER[k], "0");
      zeigeSeite(null);
      const knopf = await findeSprachwahlKnopf();
      const namen = sprachwahlEintraege(await sprachwahlOeffnen(knopf)).map((e) => e.name);
      expect(namen).not.toContain(NAMEN[k]);
      expect(namen).toHaveLength(7);
      for (const andere of (["it", "pl", "tr", "cs"] as const).filter((x) => x !== k)) {
        expect(namen).toContain(NAMEN[andere]);
      }
    });

    it(`${k}: im Standard in der Liste; die Wahl schaltet die Bedienung (lang=${k}) und wird gemerkt`, async () => {
      zeigeSeite(null);
      const knopf = await findeSprachwahlKnopf();
      expect(sprachwahlEintraege(await sprachwahlOeffnen(knopf)).map((e) => e.name)).toContain(NAMEN[k]);
      await waehleSprache(NAMEN[k], knopf);
      // Die Tastatur der Sprache weicht von der eingestellten ab: erst die Rückfrage, "Ja" wechselt.
      fireEvent.click(await screen.findByRole("button", { name: JA[k] }));
      await waitFor(() => expect(document.documentElement.getAttribute("lang")).toBe(k));
      expect(sprachwahlKuerzel(knopf)).toBe(k.toUpperCase());
      expect(localStorage.getItem("tastenflow-bedienung")).toBe(k);
    });

    it(`${k}: ein gemerktes "${k}" bei Not-Aus der Sprache bleibt nicht stehen (Bedienung nicht ${k})`, async () => {
      localStorage.setItem("tastenflow-bedienung", k);
      localStorage.setItem(MERKER[k], "0");
      zeigeSeite(null);
      const knopf = await findeSprachwahlKnopf();
      expect(sprachwahlKuerzel(knopf)).not.toBe(k.toUpperCase());
      expect(document.documentElement.getAttribute("lang")).not.toBe(k);
    });
  }
});

// ---------------------------------------------------------------------------
// Der Schalter, die Übungssprache und das Übungsfeld (§3.3, §3.4)
// ---------------------------------------------------------------------------

describe("§3.3 Der Sprachschalter in der Kopfzeile", () => {
  // ★ 28.09.2026 (Freigabe fr/es): der ZWEIER-Fall - fr/es im Not-Aus. Den
  // gleichen Fall mit dem Sprachwähler prüft der Test darunter.
  it("★★ zeigt die ANDERE Sprache, Fokus bleibt auf dem Knopf, Ansage in der neuen Sprache (Zweier-Knopf, fr/es im Not-Aus)", async () => {
    nurDeutschUndEnglisch();
    stelleBedienung("de");
    useVoice.getState().setEnabled(true);
    zeigeSeite(null, true);
    await waitFor(() => tippfeldPflicht());
    const knopf = screen.getByRole("button", { name: "EN - English" });
    expect(knopf).toHaveAttribute("lang", "en");
    expect(knopf).not.toHaveAttribute("aria-pressed");
    expect(knopf.textContent).toBe("EN");
    const hinweis = document.getElementById(knopf.getAttribute("aria-describedby")!)!;
    expect(hinweis.textContent).toBe("English - Bedienung auf Englisch");

    knopf.focus();
    fireEvent.click(knopf);

    await waitFor(() => expect(document.documentElement.getAttribute("lang")).toBe("en"));
    const nachher = screen.getByRole("button", { name: "DE - Deutsch" });
    expect(nachher).toBe(knopf); // derselbe Knopf - ein zweiter Druck macht es rückgängig
    expect(document.activeElement).toBe(knopf);
    expect(nachher).toHaveAttribute("lang", "de");
    expect(document.getElementById(nachher.getAttribute("aria-describedby")!)!.textContent).toBe(
      "Deutsch - switch to German",
    );
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("en");
    const gesagt = vi.mocked(speakUi).mock.calls.map((c) => c);
    const ansage = gesagt.find((c) => /English/.test(String(c[0])));
    expect(ansage, JSON.stringify(gesagt)).toBeTruthy();
    expect(ansage![3]).toBe("en"); // die englische Stimme, nicht die der Übungssprache
    await waitFor(() =>
      expect(document.querySelector('[role="status"][aria-live="polite"]')!.textContent).toMatch(/English/),
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("My training");

    fireEvent.click(nachher);
    await waitFor(() => expect(document.documentElement.getAttribute("lang")).toBe("de"));
    expect(screen.getByRole("button", { name: "EN - English" })).toBe(knopf);
  });

  // ★ 28.09.2026 (Freigabe fr/es): derselbe Fall mit dem SPRACHWÄHLER - der
  // Knopf zeigt die AKTIVE Sprache, der Fokus kehrt nach der Wahl auf ihn
  // zurück, die Ansage kommt in der neuen Sprache.
  it("★★ Sprachwähler: zeigt die AKTIVE Sprache, Fokus zurück auf den Knopf, Ansage in der neuen Sprache", async () => {
    stelleBedienung("de");
    useVoice.getState().setEnabled(true);
    zeigeSeite(null, true);
    await waitFor(() => tippfeldPflicht());
    const knopf = await findeSprachwahlKnopf();
    expect(knopf).toHaveAttribute("aria-haspopup", "listbox");
    expect(knopf).not.toHaveAttribute("aria-pressed");
    expect(sprachwahlKuerzel(knopf)).toBe("DE");
    const hinweis = document.getElementById(knopf.getAttribute("aria-describedby")!)!;
    expect(hinweis.textContent).toBe("Sprache - Language - Langue - Idioma - Lingua - Język - Dil - Jazyk - Език - Γλώσσα - Nyelv - Taal - Limbă - Språk - Мова");

    knopf.focus();
    await waehleSprache("English", knopf);

    await waitFor(() => expect(document.documentElement.getAttribute("lang")).toBe("en"));
    expect(sprachwahlKnopf()).toBe(knopf); // derselbe Knopf
    await fokusZurueckAufDemKnopf(knopf);
    expect(sprachwahlKuerzel(knopf)).toBe("EN");
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("en");
    const gesagt = vi.mocked(speakUi).mock.calls.map((c) => c);
    const ansage = gesagt.find((c) => /English/.test(String(c[0])));
    expect(ansage, JSON.stringify(gesagt)).toBeTruthy();
    expect(ansage![3]).toBe("en"); // die englische Stimme, nicht die der Übungssprache
    await waitFor(() =>
      expect(document.querySelector('[role="status"][aria-live="polite"]')!.textContent).toMatch(/English/),
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("My training");

    await waehleSprache("Deutsch", knopf);
    await waitFor(() => expect(document.documentElement.getAttribute("lang")).toBe("de"));
    expect(sprachwahlKnopf()).toBe(knopf);
    expect(sprachwahlKuerzel(knopf)).toBe("DE");
  });

  it("die Übungssprache eines Gastes folgt beim ersten Laden der Bedienung, das Feld trägt sie als lang", async () => {
    stelleBedienung("en");
    zeigeSeite(null);
    const feld = await waitFor(() => tippfeldPflicht());
    expect(feld).toHaveAttribute("lang", "en");
    expect(document.querySelector("[data-angabe]")).toHaveAttribute("lang", "en");
  });

  it("ein Konto behält seine Übungssprache - die deutsche Zeile steht in lang=\"de\"", async () => {
    stelleBedienung("en");
    zeigeSeite(JANO);
    const feld = await waitFor(() => tippfeldPflicht());
    expect(feld).toHaveAttribute("lang", "de");
    expect(tippfeld()).toBe(feld);
  });
});
