/**
 * ★★ WÄCHTER: DIE VORLAGEN-AUSWAHL BIETET DAS RICHTIGE AN (21.09.2026).
 *
 * `typing-vorlagen-neu.test.ts` misst die Daten; hier wird die BEDIENUNG
 * gemessen - was eine Lehrkraft im Wähler „Vorlagen" wirklich vor sich hat,
 * je nachdem, ob sie „Eigene Übung" oder die Tippchallenge mit eigener Datei
 * einrichtet, und in welcher Sprache sie das tut:
 *  · „Eigene Übung": Themen-Dateien der Fremdwörter + Programmcode.
 *  · Tippchallenge: dieselben Wörter, alphabetisch in anderen Dateien - und
 *    KEIN Programmcode (dafür hat sie ihr eigenes Niveau).
 *  · Englische Bedienung: englische Namen.
 * Ein Klick auf eine Vorlage füllt die Vorschau (erste Zeile wird gelesen).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EigenerTextQuelle } from "@/components/lernwerkstatt/klasse/EigenerTextQuelle";
import { useEigenerTextUpload } from "@/lib/typing/useEigenerTextUpload";
import { BedienSpracheProvider } from "@/lib/bedienSprache";
import { FREMDWOERTER } from "@/lib/typing/vorlagenDaten/fremdwoerter";
import { CODE_VORLAGEN } from "@/lib/typing/vorlagenDaten/programmcode";
import { fremdChallengePaare, fremdZeile } from "@/lib/typing/vorlagen";
import { WORD_ROOTS, wordRootZeile } from "@/lib/typing/vorlagenDaten/wordRoots";
import type { Lang, Stufe } from "@/lib/typing/account";
import type { Lernweg } from "@/lib/typing/lernweg";

function Waehler({
  fuer,
  lang,
  stufe = "teens",
  lernweg,
}: {
  fuer: "uebung" | "challenge";
  lang: Lang;
  stufe?: Stufe;
  lernweg?: Lernweg;
}) {
  const upload = useEigenerTextUpload(fuer === "challenge");
  return (
    <>
      <EigenerTextQuelle
        teacherId="t1"
        stufe={stufe}
        lang={lang}
        lernweg={lernweg}
        verbietenSs={fuer === "challenge"}
        fuer={fuer}
        upload={upload}
        inPoolSpeichern={false}
        onInPoolSpeichernChange={() => {}}
      />
      <output data-testid="vorschau">{upload.vorschau?.zeilen.join("\n") ?? ""}</output>
      <output data-testid="name">{upload.dateiname}</output>
    </>
  );
}

function zeige(fuer: "uebung" | "challenge", lang: Lang, stufe?: Stufe, lernweg?: Lernweg) {
  return render(
    <BedienSpracheProvider>
      <Waehler fuer={fuer} lang={lang} stufe={stufe} lernweg={lernweg} />
    </BedienSpracheProvider>,
  );
}

async function oeffneVorlagen(user: ReturnType<typeof userEvent.setup>, name = "Vorlagen") {
  await user.click(screen.getByRole("button", { name }));
}

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("★ Vorlagen-Wähler", () => {
  it("Eigene Übung (deutsch): Fremdwörter nach Themen und zehn Programmcode-Sprachen, keine alphabetischen Dateien", async () => {
    const user = userEvent.setup();
    zeige("uebung", "de");
    await oeffneVorlagen(user);
    for (const t of ["Schule und Lernen", "Alltag und Freizeit", "Natur und Technik", "Miteinander und Gesellschaft"]) {
      expect(screen.getByRole("button", { name: `Fremdwörterkunde: ${t}` })).toBeTruthy();
    }
    for (const c of CODE_VORLAGEN) expect(screen.getByRole("button", { name: `Programmcode: ${c.sprache}` })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /alphabetisch/ })).toBeNull();
  });

  it("Tippchallenge (deutsch): drei alphabetische Dateien, KEIN Programmcode, KEINE Themen-Dateien", async () => {
    const user = userEvent.setup();
    zeige("challenge", "de");
    await oeffneVorlagen(user);
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByRole("button", { name: `Fremdwörterkunde, alphabetisch: Datei ${i} von 3` })).toBeTruthy();
    }
    expect(screen.queryByRole("button", { name: /^Programmcode/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Fremdwörterkunde: / })).toBeNull();
    // Die sechs Lektions-Vorlagen bleiben in beiden Kästen.
    expect(screen.getByRole("button", { name: "Texte: Witze zum Mitschreiben" })).toBeTruthy();
  });

  it("englische Klasse: nur Programmcode und Lektionen - keine Fremdwörter", async () => {
    const user = userEvent.setup();
    zeige("uebung", "en");
    await oeffneVorlagen(user, "Vorlagen");
    expect(screen.getByRole("button", { name: "Programmcode: Java" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Fremdwörterkunde|Foreign words/ })).toBeNull();
  });

  it("Themen-Datei wählen: die Vorschau trägt die Paare der Stufe, der Name ist der Titel", async () => {
    const user = userEvent.setup();
    zeige("uebung", "de", "kids");
    await oeffneVorlagen(user);
    await user.click(screen.getByRole("button", { name: "Fremdwörterkunde: Schule und Lernen" }));
    const erwartet = FREMDWOERTER.kids.find((t) => t.id === "schule")!.paare.map(fremdZeile);
    expect(screen.getByTestId("vorschau").textContent).toBe(erwartet.join("\n"));
    expect(screen.getByTestId("name").textContent).toBe("Fremdwörterkunde: Schule und Lernen");
  });

  it("Challenge-Datei wählen: dieselben Wörter, aber alphabetisch geordnet", async () => {
    const user = userEvent.setup();
    zeige("challenge", "de", "erwachsen");
    await oeffneVorlagen(user);
    await user.click(screen.getByRole("button", { name: "Fremdwörterkunde, alphabetisch: Datei 2 von 3" }));
    expect(screen.getByTestId("vorschau").textContent).toBe(fremdChallengePaare("erwachsen", 1).map(fremdZeile).join("\n"));
  });

  it("Programmcode wählen: die Einleitungszeile steht vorn, die Einrückung bleibt", async () => {
    const user = userEvent.setup();
    zeige("uebung", "de");
    await oeffneVorlagen(user);
    await user.click(screen.getByRole("button", { name: "Programmcode: Python" }));
    const python = CODE_VORLAGEN.find((c) => c.sprache === "Python")!;
    const zeilen = screen.getByTestId("vorschau").textContent!.split("\n");
    expect(zeilen[0]).toBe(python.introDe);
    expect(zeilen).toEqual([python.introDe, ...python.zeilen]);
  });
});

describe("★ Englische Bedienung: die Namen sind englisch", () => {
  it("Wähler in englischer Bedienung nennt „Templates“, „Foreign words: …“ und „Program code: …“", async () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    const user = userEvent.setup();
    zeige("uebung", "de");
    await user.click(screen.getByRole("button", { name: "Templates" }));
    // Die drei Gruppen tragen englische Namen.
    const fremd = screen.getByRole("group", { name: "Foreign words" });
    const code = screen.getByRole("group", { name: "Program code" });
    expect(screen.getByRole("group", { name: "From the course" })).toBeTruthy();
    expect(within(fremd).getByRole("button", { name: "Foreign words: School and learning" })).toBeTruthy();
    expect(within(code).getByRole("button", { name: "Program code: Rust" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Fremdwörterkunde|Programmcode/ })).toBeNull();
  });
});

/*
 * ★ E8 (24.09.2026): „Word roots" - das englische Gegenstück zu Fremdwörter-
 * kunde, nur für eine Klasse auf dem englischen Lehrgang (Weg „en").
 */
describe(`★ Word roots (Weg „en"): dieselbe Bedienung wie Fremdwörterkunde`, () => {
  // ★ Die TITEL folgen der BEDIENUNGSSPRACHE (`vorlageTitel`), nicht der
  // Übungssprache der Klasse - eine englische Bedienung ist darum nötig,
  // damit die Knöpfe „Word roots: …" statt „Wortstämme: …" heissen.
  beforeEach(() => localStorage.setItem("tastenflow-bedienung", "en"));

  it(`Eigene Übung, Weg „en": vier Word-roots-Themen stehen als Vorlage, keine Fremdwörterkunde`, async () => {
    const user = userEvent.setup();
    zeige("uebung", "en", "teens", "en");
    await oeffneVorlagen(user, "Templates");
    expect(screen.getByRole("button", { name: "Word roots: Numbers and size" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Fremdwörterkunde|Foreign words/ })).toBeNull();
  });

  it(`ohne den Weg „en" (Vorgabe) bleibt der Knopf unwirksam - keine Vorschau, kein Absturz`, async () => {
    // ★ Anzahlen-/Wege-Falle (Bauplan §11): lang „en" allein reicht nicht -
    // eine Klasse auf dem BISHERIGEN Weg (kein `lernweg`-Prop, Vorgabe „de")
    // bekommt beim Klick keine Vorschau (`vorlageVorschau` liefert `null`).
    const user = userEvent.setup();
    zeige("uebung", "en");
    await oeffneVorlagen(user, "Templates");
    await user.click(screen.getByRole("button", { name: "Word roots: Numbers and size" }));
    expect(screen.getByTestId("vorschau").textContent).toBe("");
  });

  it("Word-roots-Themen-Datei wählen: die Vorschau trägt die Paare der Stufe", async () => {
    const user = userEvent.setup();
    zeige("uebung", "en", "kids", "en");
    await oeffneVorlagen(user, "Templates");
    await user.click(screen.getByRole("button", { name: "Word roots: Numbers and size" }));
    const erwartet = WORD_ROOTS.kids.find((t) => t.id === "numbers")!.paare.map(wordRootZeile);
    expect(screen.getByTestId("vorschau").textContent).toBe(erwartet.join("\n"));
    expect(screen.getByTestId("name").textContent).toBe("Word roots: Numbers and size");
  });

  it(`Tippchallenge, Weg „en": alphabetische Dateien, KEIN Programmcode, KEINE Themen-Dateien`, async () => {
    const user = userEvent.setup();
    zeige("challenge", "en", "teens", "en");
    await oeffneVorlagen(user, "Templates");
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByRole("button", { name: `Word roots, alphabetical: file ${i} of 3` })).toBeTruthy();
    }
    expect(screen.queryByRole("button", { name: /^Program code/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Word roots: / })).toBeNull();
  });
});
