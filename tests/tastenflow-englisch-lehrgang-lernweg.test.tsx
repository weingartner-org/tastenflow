/**
 * ★★★ DEUTSCH-FÄNGER FÜR DEN ENGLISCHEN LEHRGANG (Nachtlauf 24.09.2026,
 * Etappe „Vollständigkeit").
 *
 * Anlass: Der Lernweg „en" (E1-E10, `BAUPLAN-2026-09-24-ENGLISCHER-
 * LEHRGANG.md`) legt eigene, englische Prüfungstexte und Serien an - aber die
 * Bauteile, die einen TITEL oder eine QUELLENANGABE anzeigen, gingen bis dahin
 * davon aus, dass aller Prüfungsinhalt IMMER deutsch ist (Glossar §4 galt vor
 * E1 uneingeschränkt). Drei echte Funde dieser Nacht:
 *
 *  1. `SchreibprobeErgebnis.tsx` markierte JEDEN Textnamen in der englischen
 *     Bedienung als `lang="de"` - auch den einer Tippchallenge des Lernwegs
 *     „en", deren Titel wirklich englisch ist. Eine Sprachausgabe hätte ihn
 *     mit deutscher Aussprache gelesen.
 *  2. `SchreibprobenListe.tsx` (die Liste vergangener Tippchallenges) hatte
 *     denselben Fehler in der aufgeklappten Zeile.
 *  3. `SerienTrainer.tsx` zeigte die Selbst-Angabe eigener ENGLISCHER Serien/
 *     Korpora („Sensorik" / „Eigenes Werk (selbst verfasst)") in der
 *     englischen Bedienung wörtlich deutsch, weil ihnen ein `en`-Feld fehlte -
 *     jetzt ergänzt (siehe die `EIGEN`-Konstanten in `corpusEn*.ts` /
 *     `serienEn*.ts`).
 *
 * Alle drei sind hier mit einer echten Lernweg-„en"-Tippchallenge belegt,
 * mit GEGENPROBE für Lernweg „de" (dort bleibt die Markierung/Angabe wie
 * gehabt deutsch). `useBedienSprache()` liefert OHNE Provider immer „de" -
 * darum hängt jeder Aufbau hier unter `BedienSpracheProvider`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { SchreibprobeErgebnis } from "@/components/typing/SchreibprobeErgebnis";
import { SchreibprobenListe } from "@/components/typing/SchreibprobenListe";
import { SerienTrainer } from "@/components/typing/SerienTrainer";
import { BedienSpracheProvider } from "@/lib/bedienSprache";
import {
  emptyProgress,
  speichereProbenergebnis,
  werteAus,
  type AuswertungEingang,
  type Probenergebnis,
} from "@/lib/typing";
import { findeDeutsch } from "./helfer/deutschFaenger";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const BEGINN = new Date(2026, 8, 24, 10, 0).getTime();

function eingang(o: Partial<AuswertungEingang> & { probeId: string }): AuswertungEingang {
  return {
    niveau: "buchstaben",
    textNr: 0,
    textTitel: "A Kite in the Wind",
    beginnMs: BEGINN,
    endeMs: BEGINN + 300_000,
    zeitMs: 300_000,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen: 400,
    fehler: 5,
    zeilen: 20,
    schreibMs: 300_000,
    anschlaege: [],
    layout: "us",
    textZuEnde: false,
    frueherAbgegeben: false,
    ...o,
  };
}

/** Eine Tippchallenge des Lernwegs „en" - echter englischer Titel. */
function probeEn(probeId = "sp-en"): Probenergebnis {
  return werteAus(eingang({ probeId, lernweg: "en" }));
}

/** Dieselbe Challenge, aber Lernweg „de" (Glossar §4 gilt hier weiter). */
function probeDe(probeId = "sp-de"): Probenergebnis {
  return werteAus(eingang({ probeId, textTitel: "Der Igel", lernweg: undefined }));
}

function stelleBedienung(sprache: "de" | "en") {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeigeMit(sprache: "de" | "en", kind: React.ReactNode) {
  stelleBedienung(sprache);
  return render(<BedienSpracheProvider>{kind}</BedienSpracheProvider>);
}

/** Steht der Titel als eigenes `[lang="de"]`-Element im Baum? */
function titelInLangDe(container: HTMLElement, titel: string): boolean {
  return [...container.querySelectorAll('[lang="de"]')].some((el) => el.textContent === titel);
}

describe("SchreibprobeErgebnis - Titel des Lernwegs en bekommt kein lang=de", () => {
  it(`Lernweg "en", englische Bedienung: der Titel steht ohne eigenes lang="de" da`, () => {
    const { container } = zeigeMit("en", <SchreibprobeErgebnis ergebnis={probeEn()} />);
    expect(container.textContent).toContain("A Kite in the Wind");
    expect(titelInLangDe(container, "A Kite in the Wind")).toBe(false);
  });

  it(`GEGENPROBE Lernweg "de", englische Bedienung: der Titel bleibt in lang="de"`, () => {
    const { container } = zeigeMit("en", <SchreibprobeErgebnis ergebnis={probeDe()} />);
    expect(container.textContent).toContain("Der Igel");
    expect(titelInLangDe(container, "Der Igel")).toBe(true);
  });

  it("deutsche Bedienung: kein Element traegt je ein eigenes lang=de (nichts zu uebersetzen)", () => {
    const { container: cEn } = zeigeMit("de", <SchreibprobeErgebnis ergebnis={probeEn()} />);
    expect(cEn.querySelector("[lang='de']")).toBeNull();
    cleanup();
    const { container: cDe } = zeigeMit("de", <SchreibprobeErgebnis ergebnis={probeDe()} />);
    expect(cDe.querySelector("[lang='de']")).toBeNull();
  });
});

describe("SchreibprobenListe - dieselbe Regel in der aufgeklappten Zeile", () => {
  it(`Lernweg "en", englische Bedienung: der Titel in der Liste ohne eigenes lang="de"`, async () => {
    const e = probeEn("sp-list-en");
    speichereProbenergebnis("kind-en", e.probeId, e);
    const { container } = zeigeMit("en", <SchreibprobenListe accountId="kind-en" />);
    await waitFor(() => expect(container.textContent).toContain("A Kite in the Wind"));
    expect(titelInLangDe(container, "A Kite in the Wind")).toBe(false);
  });

  it(`GEGENPROBE Lernweg "de", englische Bedienung: der Titel bleibt in lang="de"`, async () => {
    const e = probeDe("sp-list-de");
    speichereProbenergebnis("kind-de", e.probeId, e);
    const { container } = zeigeMit("en", <SchreibprobenListe accountId="kind-de" />);
    await waitFor(() => expect(container.textContent).toContain("Der Igel"));
    expect(titelInLangDe(container, "Der Igel")).toBe(true);
  });
});

describe("SerienTrainer - Quellen & Dank: die eigene Angabe englischer Serien/Korpora", () => {
  function zeige(sprache: "de" | "en") {
    return zeigeMit(
      sprache,
      <SerienTrainer
        loadFn={() => Promise.resolve(emptyProgress())}
        saveFn={() => undefined}
        stufe="kids"
        lang="en"
      />,
    );
  }

  it("englische Bedienung: die Eigenangabe Sensorik/Own work steht englisch da, kein deutsches Wort", async () => {
    zeige("en");
    await waitFor(() => expect(document.getElementById("buecherei-titel")).not.toBeNull());
    const oeffner = screen.getByText("Sources & thanks");
    fireEvent.click(oeffner);
    const liste = oeffner.closest("details")!.querySelector("ul") as HTMLElement;
    expect(liste).toBeTruthy();
    // Mindestens EIN Eintrag zeigt "Own work" statt "Eigenes Werk" - und traegt
    // dabei auch auf Englisch den KI-Hinweis (Symmetrie zur deutschen Zeile).
    expect(liste.textContent).toMatch(/Own work/);
    expect(liste.textContent).toMatch(/with AI assistance, editorially reviewed/);
    // Kein Eintrag mit .en steht unter lang="de".
    for (const li of [...liste.children]) {
      if (/Own work/.test(li.textContent ?? "")) expect(li.getAttribute("lang")).toBe("en");
    }
    expect(findeDeutsch(liste)).toEqual([]);
  });

  it("GEGENPROBE deutsche Bedienung: dieselbe Angabe steht deutsch da, mit KI-Hinweis", async () => {
    zeige("de");
    await waitFor(() => expect(document.getElementById("buecherei-titel")).not.toBeNull());
    const oeffner = screen.getByText("Quellen & Dank");
    fireEvent.click(oeffner);
    const liste = oeffner.closest("details")!.querySelector("ul") as HTMLElement;
    expect(liste.textContent).toMatch(/Eigenes Werk/);
    expect(liste.textContent).toMatch(/mit KI-Unterstützung, redaktionell geprüft/);
  });
});
