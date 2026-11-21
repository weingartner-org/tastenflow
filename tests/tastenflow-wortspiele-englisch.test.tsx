/**
 * ★★★ DEUTSCH-FÄNGER FÜR DIE WORTSPIELE (EN4, 18.09.2026).
 *
 * Bereich: das Regal „Wortspiele", die Ankündigung auf der Abschluss-Karte
 * (`UebungsformAngebot`), der Rätsel-Bildschirm (Fingerdiktat, Lückentext,
 * Zahlendiktat, Was fehlt hier?, Korrekturlesen), der Buchstabensalat und die
 * Pyramiden-Zeile - jeweils in den Zuständen, die ein Kind sieht und hört.
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`) und an
 * allem, was über `speakUi` gesprochen wird.
 *
 * ★★ ZWEI ÜBUNGSSPRACHEN in der englischen Bedienung:
 *  · Englisch - dann darf nirgends ein deutsches Wort stehen oder klingen.
 *  · DEUTSCH - der Fall, für den EN4 die Teile gebaut hat: Die Wörter und
 *    Sätze sind deutsch und müssen in `lang="de"` stehen (der Fänger nimmt
 *    sie dann aus) und mit der deutschen Stimme gesprochen werden
 *    (`speakUi(…, "de")`). Alles andere - Rahmen, Knöpfe, Rückmeldungen -
 *    ist englisch.
 *
 * ★★★ DIE GEGENPROBE: dieselben Zustände in der deutschen Bedienung müssen
 * VIELE Funde liefern - ein Fänger, der nichts findet, weil er nichts liest,
 * sähe sonst genauso grün aus.
 *
 * Dazu: Ohne aktiven Sprachbereich (andere Apps, kein Provider) bleibt
 * alles, wie es war (Wortspiele in englischer Übungssprache: englische Sätze,
 * deutsche Namen), und die
 * deutschen Sätze der drei zusammengesetzten Formen sind Zeichen für Zeichen
 * die von vorher.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import { speakUi, useVoice, type Lang, type TypingProgress } from "../src/lib/typing";
import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import {
  FORM_NAMEN,
  UEBUNGSFORMEN,
  ausTeilen,
  formFuer,
  formNameZuTitel,
  inTeile,
  inhalt,
  type FormKontext,
  type UebungsformId,
} from "../src/lib/typing/uebungsformen";
import {
  pruefeSalatwort,
  salatVorrat,
  salatBuchstaben,
  waehleSalatwort,
} from "../src/lib/typing/uebungsformen/buchstabensalat";
import { Wortspiele } from "../src/components/typing/Wortspiele";
import { RaetselLauf } from "../src/components/typing/RaetselLauf";
import { BuchstabensalatLauf } from "../src/components/typing/BuchstabensalatLauf";
import { PyramidenSchmuck } from "../src/components/typing/PyramidenSchmuck";
import { UebungsformAngebot } from "../src/components/typing/UebungsformAngebot";
import { useUebungsform } from "../src/components/typing/useUebungsform";
import { zusammenfassen } from "../src/components/typing/wortspielSprache";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

/** Alles frei - Buchstaben, Umschalttaste, Ziffern, Satzzeichen. */
const VOLL = [
  ..."abcdefghijklmnopqrstuvwxyzäöüß".split(""),
  "⇧",
  ..."0123456789".split(""),
  ".",
  ",",
  "?",
  "!",
  "-",
];

function festerZufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}

function ctxFuer(lang: Lang, sprache: BedienSprache | undefined, saat = 7): FormKontext {
  return {
    lernweg: "de",
    introduced: VOLL,
    shift: true,
    oneHand: false,
    stufe: "kids",
    lang,
    sprache,
    count: 6,
    zufall: festerZufall(saat),
  };
}

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache | null) {
  localStorage.clear();
  if (!sprache) return;
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

function stand(introduced: string[]): () => Promise<TypingProgress> {
  return async () => ({ xp: 0, lessons: {}, letters: {}, introduced });
}

/** Alles Gesprochene: `[text, sprache der Stimme]`. */
function gesprochen(): [string, string | undefined][] {
  return vi.mocked(speakUi).mock.calls.map((c) => [String(c[0]), c[3] as string | undefined]);
}

/**
 * Was der Fänger findet: der ganze `<body>`, dazu jede Ansage, die NICHT mit
 * der deutschen Stimme gesprochen wurde (die deutsche Stimme spricht den
 * deutschen INHALT - das ist Absicht).
 */
function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  for (const [text, stimme] of gesprochen()) {
    if (stimme === "de") continue;
    const f = pruefeText("gesprochen", text);
    if (f) funde.add(f);
  }
  return [...funde];
}

function antworte(text: string) {
  const feld = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(feld, { target: { value: text } });
  fireEvent.keyDown(feld, { key: "Enter" });
}

/**
 * Zeit laufen lassen, damit die Ansagen in Stücken nachkommen. In Schritten:
 * React zeichnet erst am Ende eines `act` neu, und erst danach startet eine
 * neue Aufgabe ihre Ansage - deren nächstes Stück braucht wieder Zeit.
 */
async function warte(ms: number) {
  for (let t = 0; t < ms; t += 250)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });
}

const RAETSEL_FORMEN: UebungsformId[] = [
  "fingerdiktat",
  "lueckentext",
  "zahlendiktat",
  "wasfehlt",
  "korrekturlesen",
];

/**
 * ★ Alle Zustände des Bereichs nacheinander - je Zustand ein frischer Aufbau,
 * die Funde werden gesammelt. Übungssprache `lang`, Bedienung aus dem Speicher.
 */
async function alleZustaende(lang: Lang, bedienung: BedienSprache): Promise<string[]> {
  const funde = new Set<string>();
  const sammle = () => {
    for (const f of fange()) funde.add(f);
    cleanup();
    vi.mocked(speakUi).mockClear();
  };
  // Die Formen bekommen die Bedienung über den Kontext - genau wie aus
  // `useUebungsform` in Tastenflow.
  const ctx = (saat = 7) => ctxFuer(lang, bedienung, saat);

  // 1 · Das Regal: lädt, voll, noch leer.
  zeige(<Wortspiele loadFn={() => new Promise(() => {})} stufe="kids" lang={lang} onWaehlen={() => {}} />);
  sammle();
  zeige(<Wortspiele loadFn={stand(VOLL)} stufe="kids" lang={lang} onWaehlen={() => {}} />);
  await warte(10);
  // ★ D-8 (28.09.2026): dazu der erste Platz „Grundstellung prüfen".
  expect(screen.getAllByRole("button").length).toBe(UEBUNGSFORMEN.length + 1);
  sammle();
  zeige(<Wortspiele loadFn={stand(["f", "j"])} stufe="kids" lang={lang} onWaehlen={() => {}} />);
  await warte(10);
  sammle();

  // 2 · Die Ankündigung jeder Form auf der Abschluss-Karte.
  for (const f of UEBUNGSFORMEN) {
    zeige(<UebungsformAngebot ankuendigung={f.ankuendigung(ctx())} onStart={() => {}} />);
    sammle();
  }

  // 3 · Der Rätsel-Bildschirm - Aufbau, zwei Fehlversuche, Auflösung,
  //     die Stelle eines Vertippers, Grossschreibung, dann richtig.
  for (const id of RAETSEL_FORMEN) {
    const f = formFuer(id)!;
    const aufgaben = f.fragen!(ctx());
    expect(aufgaben.length, id).toBeGreaterThan(1);
    const baue = () =>
      zeige(
        <RaetselLauf
          titel={f.name}
          ankuendigung={f.ankuendigung(ctx())}
          aufgaben={aufgaben}
          grossKleinZaehlt={f.grossKleinZaehlt}
          eingabeAnsagen={f.eingabeAnsagen}
          contextId={`form:${id}`}
          lang={lang}
          onFertig={() => {}}
          onAbbruch={() => {}}
        />,
      );
    // Aufbau + „noch nicht" + „die Antwort ist …"
    baue();
    await warte(2000);
    antworte("qqqqqqqq");
    await warte(2000);
    antworte("qqqqqqqq");
    await warte(2000);
    sammle();
    // Richtig - mit Auflösung, wo die Form eine hat.
    baue();
    antworte(aufgaben[0].antworten[0]);
    await warte(2000);
    sammle();
    // Ein Vertipper am Ende - die Ansage nennt die Stelle.
    const loesung = aufgaben[0].antworten[0];
    if (loesung.length >= 3) {
      baue();
      antworte(loesung.slice(0, -1) + (loesung.endsWith("x") ? "y" : "x"));
      await warte(2000);
      sammle();
    }
    // Nur die Grossschreibung fehlt (wo sie zählt).
    const gross = aufgaben.find((a) => /^[A-ZÄÖÜ]/.test(a.antworten[0]));
    if (f.grossKleinZaehlt && gross) {
      zeige(
        <RaetselLauf
          titel={f.name}
          ankuendigung={f.ankuendigung(ctx())}
          aufgaben={[gross]}
          grossKleinZaehlt
          contextId={`form:${id}`}
          lang={lang}
          onFertig={() => {}}
          onAbbruch={() => {}}
        />,
      );
      antworte(gross.antworten[0].toLowerCase());
      await warte(2000);
      sammle();
      // Und die Umschalttaste der falschen Hand.
      zeige(
        <RaetselLauf
          titel={f.name}
          ankuendigung={f.ankuendigung(ctx())}
          aufgaben={[gross]}
          grossKleinZaehlt
          contextId={`form:${id}`}
          lang={lang}
          onFertig={() => {}}
          onAbbruch={() => {}}
        />,
      );
      const feld = screen.getByRole("textbox") as HTMLInputElement;
      const erstes = gross.antworten[0][0];
      fireEvent.keyDown(feld, { key: erstes, shiftKey: true, location: 1 });
      fireEvent.keyDown(feld, { key: erstes, shiftKey: true, location: 2 });
      fireEvent.change(feld, { target: { value: gross.antworten[0] } });
      fireEvent.keyDown(feld, { key: "Enter" });
      await warte(2000);
      sammle();
    }
  }

  // 4 · Der Buchstabensalat - Aufbau und jede Rückmeldung.
  const quellwort = waehleSalatwort(ctx())!;
  expect(quellwort).toBeTruthy();
  const gutesWort = salatVorrat(quellwort, lang)[0];
  const buchstaben = [...quellwort.toLowerCase()];
  let keinWort = "";
  for (let a = 0; a < buchstaben.length && !keinWort; a++)
    for (let b = 0; b < buchstaben.length && !keinWort; b++)
      for (let c = 0; c < buchstaben.length && !keinWort; c++) {
        if (new Set([a, b, c]).size < 3) continue;
        const w = buchstaben[a] + buchstaben[b] + buchstaben[c];
        const u = pruefeSalatwort(w, quellwort, [], lang);
        if (!u.ok && u.grund === "kein-wort") keinWort = w;
      }
  expect(keinWort).toBeTruthy();
  zeige(
    <BuchstabensalatLauf
      quellwort={quellwort}
      ankuendigung={formFuer("buchstabensalat")!.ankuendigung(ctx())}
      contextId="form:buchstabensalat"
      lang={lang}
      onFertig={() => {}}
      onAbbruch={() => {}}
    />,
  );
  await warte(2000);
  for (const eingabe of ["ab", "qqqq", quellwort, gutesWort, gutesWort, keinWort]) {
    antworte(eingabe);
    await warte(2000);
    for (const f of fange()) funde.add(f);
  }
  sammle();

  // 5 · Die Pyramiden-Zeile über der Tippzeile.
  zeige(<PyramidenSchmuck pyramiden={[["K", "Ka", "Kas"]]} zeile={1} lang={lang} />);
  sammle();

  return [...funde];
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  localStorage.clear();
  document.documentElement.setAttribute("lang", "de");
  useVoice.setState({ enabled: true });
  vi.mocked(speakUi).mockClear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  useVoice.setState({ enabled: false });
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// 1 · Der Fänger mit Gegenprobe
// ---------------------------------------------------------------------------

describe("★★★ Wortspiele in der englischen Bedienung - kein deutsches Wort", () => {
  it("englische Übungssprache: nirgends Deutsch, weder zu lesen noch zu hören", async () => {
    stelleBedienung("en");
    expect(await alleZustaende("en", "en")).toEqual([]);
  }, 60_000);

  it("DEUTSCHE Übungssprache: nur der Inhalt ist deutsch - in lang=\"de\", mit deutscher Stimme", async () => {
    stelleBedienung("en");
    expect(await alleZustaende("de", "en")).toEqual([]);
  }, 60_000);

  it("★ GEGENPROBE: dieselben Zustände in der deutschen Bedienung liefern viele Funde", async () => {
    stelleBedienung("de");
    const funde = await alleZustaende("de", "de");
    expect(funde.length).toBeGreaterThan(40);
    const alles = funde.join("\n");
    for (const satz of [
      "Wortspiele",
      "Jetzt kommen Alphabet-Reihen.",
      "Deine Antwort",
      "Prüfen",
      "Zurück zum Üben",
      "Die Antwort ist",
      "Buchstabensalat",
      "Das hattest du schon.",
      "Pyramide: Stufe 2 von 3",
    ])
      expect(alles, satz).toContain(satz);
  }, 60_000);
});

// ---------------------------------------------------------------------------
// 2 · Gemischt: Inhalt in lang="de", Rahmen englisch, zwei Stimmen
// ---------------------------------------------------------------------------

describe("★★ Englische Bedienung, deutsche Wörter", () => {
  it("die Frage von „What's missing?\" zeigt die Zeilen in lang=\"de\" und spricht sie deutsch", async () => {
    stelleBedienung("en");
    const f = formFuer("wasfehlt")!;
    const aufgaben = f.fragen!(ctxFuer("de", "en"));
    zeige(
      <RaetselLauf
        titel={f.name}
        ankuendigung={f.ankuendigung(ctxFuer("de", "en"))}
        aufgaben={aufgaben}
        grossKleinZaehlt
        contextId="form:wasfehlt"
        lang="de"
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    expect(screen.getByRole("heading").textContent).toBe("What's missing?");
    const frage = document.querySelector("p.text-2xl")!;
    expect(frage.textContent).toMatch(/^Line one: .+ Line two: .+ Which word is missing\?$/);
    const deutsch = [...frage.querySelectorAll('span[lang="de"]')].map((s) => s.textContent);
    expect(deutsch).toHaveLength(2);
    expect(deutsch[1]).toContain("...");
    // Das Antwortfeld nimmt Deutsch entgegen.
    expect(screen.getByRole("textbox").getAttribute("lang")).toBe("de");

    await warte(1000);
    const [erste, ...rest] = gesprochen();
    // Zuerst Ankündigung + Stand mit englischer Stimme, dann die Zeilen deutsch.
    expect(erste[1]).toBe("en");
    expect(erste[0]).toMatch(/^Now for two lines/);
    expect(rest.some(([t, s]) => s === "de" && t === deutsch[0])).toBe(true);
    expect(rest.some(([t, s]) => s === "en" && /Which word is missing\?/.test(t))).toBe(true);
  });

  it("die Auflösung nennt das deutsche Wort in lang=\"de\"", async () => {
    stelleBedienung("en");
    const f = formFuer("korrekturlesen")!;
    const [aufgabe] = f.fragen!(ctxFuer("de", "en"));
    zeige(
      <RaetselLauf
        titel={f.name}
        ankuendigung={f.ankuendigung(ctxFuer("de", "en"))}
        aufgaben={[aufgabe]}
        grossKleinZaehlt
        contextId="form:korrekturlesen"
        lang="de"
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    antworte(aufgabe.antworten[0]);
    const live = document.querySelector('[aria-live="polite"]')!;
    expect(live.textContent).toMatch(/^That's right\. Not “.+” but “.+”\.$/);
    expect([...live.querySelectorAll('span[lang="de"]')].map((s) => s.textContent)).toContain(
      aufgabe.antworten[0],
    );
  });

  it("Buchstabensalat: Quellwort, Vorrat und Funde stehen in lang=\"de\"", async () => {
    stelleBedienung("en");
    const quellwort = waehleSalatwort(ctxFuer("de", "en"))!;
    zeige(
      <BuchstabensalatLauf
        quellwort={quellwort}
        ankuendigung={formFuer("buchstabensalat")!.ankuendigung(ctxFuer("de", "en"))}
        contextId="form:buchstabensalat"
        lang="de"
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Letter jumble");
    expect(screen.getByText(quellwort).getAttribute("lang")).toBe("de");
    expect(document.querySelector("label")!.getAttribute("lang")).toBe("de");
    await warte(1000);
    // ★ 25.09.2026 (Testerin): erst das Wort, dann die Buchstaben (nach dem Abc).
    // Die Überleitungen sind Bedienung, Wort und Buchstaben Inhalt.
    expect(gesprochen()).toEqual([
      [`${formFuer("buchstabensalat")!.ankuendigung(ctxFuer("de", "en"))} The word is:`, "en"],
      [`${quellwort}.`, "de"],
      ["The letters:", "en"],
      [`${[...salatBuchstaben(quellwort)].join(", ")}.`, "de"],
    ]);
  });
});

// ---------------------------------------------------------------------------
// 3 · Ohne aktiven Sprachbereich: alles wie vorher
// ---------------------------------------------------------------------------

/** Der Provider einer fremden Adresse (`aktiv={false}`) - wie ohne Provider. */
function zeigeOhneBereich(knoten: ReactNode) {
  return render(<BedienSpracheProvider aktiv={false}>{knoten}</BedienSpracheProvider>);
}

describe("Ohne aktiven Sprachbereich bleibt alles, wie es war", () => {
  it("Regal mit englischer Übungssprache: Sätze englisch, Namen deutsch (wie vor EN4)", async () => {
    stelleBedienung("en");
    zeigeOhneBereich(<Wortspiele loadFn={stand(VOLL)} stufe="kids" lang="en" onWaehlen={() => {}} />);
    await warte(10);
    expect(screen.getByRole("heading").textContent).toBe("Word games");
    expect(screen.getByRole("button", { name: "Alphabet-Reihen" })).toBeTruthy();
  });

  it("Rätsel-Bildschirm mit deutscher Übungssprache: deutsch, kein lang-Attribut, EIN Textknoten", () => {
    stelleBedienung("en");
    const f = formFuer("wasfehlt")!;
    const aufgaben = f.fragen!(ctxFuer("de", undefined));
    zeigeOhneBereich(
      <RaetselLauf
        titel={f.name}
        ankuendigung={f.ankuendigung(ctxFuer("de", undefined))}
        aufgaben={aufgaben}
        contextId="form:wasfehlt"
        lang="de"
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    expect(screen.getByRole("heading").textContent).toBe("Was fehlt hier?");
    expect(screen.getByRole("textbox").hasAttribute("lang")).toBe(false);
    expect(document.body.querySelectorAll("[lang]").length).toBe(0);
    const frage = document.querySelector("p.text-2xl")!;
    expect(frage.childNodes).toHaveLength(1);
    expect(frage.textContent).toBe(aufgaben[0].frage);
    // Gesprochen wie vorher: EIN Aufruf, ohne Sprachangabe.
    expect(vi.mocked(speakUi).mock.calls).toHaveLength(1);
    expect(vi.mocked(speakUi).mock.calls[0]).toHaveLength(1);
  });

  it("useUebungsform setzt die Bedienung nur bei aktivem Sprachbereich in den Kontext", () => {
    const hook = () =>
      useUebungsform({
        progress: { xp: 0, lessons: {}, letters: {}, introduced: VOLL },
        stufe: "kids",
        lang: "de",
        oneHand: false,
        round: 0,
        storyOffen: false,
      });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <BedienSpracheProvider>{children}</BedienSpracheProvider>
    );
    const fremd = ({ children }: { children: ReactNode }) => (
      <BedienSpracheProvider aktiv={false}>{children}</BedienSpracheProvider>
    );
    stelleBedienung("en");
    const ohne = renderHook(hook, { wrapper: fremd });
    expect(ohne.result.current.ctx.sprache).toBeUndefined();
    ohne.unmount();
    stelleBedienung("en");
    const mit = renderHook(hook, { wrapper });
    expect(mit.result.current.ctx.sprache).toBe("en");
    expect(formFuer("alphabetreihen")!.ankuendigung(mit.result.current.ctx)).toBe(
      "Now for some alphabet runs.",
    );
  });
});

// ---------------------------------------------------------------------------
// 4 · Die Bausteine
// ---------------------------------------------------------------------------

describe("Bausteine", () => {
  it("die deutschen Sätze der drei zusammengesetzten Formen sind die von vorher", () => {
    for (const saat of [1, 2, 3, 4, 5]) {
      const ctx = ctxFuer("de", undefined, saat);
      for (const a of formFuer("wasfehlt")!.fragen!(ctx)) {
        expect(a.frage).toMatch(/^Zeile eins: .+ Zeile zwei: .+ Welches Wort fehlt\?$/);
        expect(a.aufloesung).toBe(`Es fehlt: ${a.antworten[0]}.`);
        expect(ausTeilen(a.frageTeile!)).toBe(a.frage);
      }
      for (const a of formFuer("korrekturlesen")!.fragen!(ctxFuer("de", undefined, saat))) {
        expect(a.frage).toMatch(/^Hier stimmt ein Wort nicht: .+ Wie heißt es richtig\?$/);
        expect(a.aufloesung).toMatch(/^Nicht „.+", sondern „.+"\.$/);
        expect(ausTeilen(a.aufloesungTeile!)).toBe(a.aufloesung);
      }
      for (const a of formFuer("zahlendiktat")!.fragen!(ctxFuer("de", undefined, saat))) {
        expect(a.frage).toMatch(/^Schreib (die Zahl|das Zahlwort): .+\.$/);
        if (a.aufloesung) expect(a.aufloesung).toMatch(/^\d+ heißt .+\.$/);
      }
    }
  });

  it("jede Form hat einen englischen Namen aus dem Glossar, und der Titel findet ihn", () => {
    for (const f of UEBUNGSFORMEN) {
      expect(f.name).toBe(FORM_NAMEN.de[f.id]);
      expect(FORM_NAMEN.en[f.id]).not.toBe(f.name);
      expect(formNameZuTitel(f.name, "en")).toBe(FORM_NAMEN.en[f.id]);
      expect(formNameZuTitel(f.name, "de")).toBe(f.name);
    }
    expect(formNameZuTitel("Probe", "en")).toBe("Probe");
  });

  it("inhalt/inTeile trennen Rahmen und Inhalt, auch mehrere Inhalte", () => {
    expect(inTeile(`A ${inhalt("x")} B ${inhalt(3)}.`)).toEqual([
      { text: "A " },
      { text: "x", inhalt: true },
      { text: " B " },
      { text: "3", inhalt: true },
      { text: "." },
    ]);
  });

  it("zusammenfassen legt Nachbarn mit derselben Stimme zusammen und lässt Leeres weg", () => {
    expect(
      zusammenfassen([
        { text: "That's right. ", lang: "en" },
        { text: " ", lang: "en" },
        { text: "Hals", lang: "de" },
        { text: ".", lang: "de" },
      ]),
    ).toEqual([
      { text: "That's right.", lang: "en" },
      { text: "Hals.", lang: "de" },
    ]);
  });
});
