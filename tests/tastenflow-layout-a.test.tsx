/**
 * ★★ WÄCHTER: EINE Tabelle - Layout A, zweiter Durchgang (01.09.2026).
 *
 * Johannes wörtlich, nachdem er die gebaute Fassung gesehen hat:
 *   *„ich möchte nicht zwei tabellen sondern eine, die zeilen sollen leicht
 *   unterschiedlich gefärbt sein damit man nicht die zeile verliert"*
 *   *„beim nach links scrollen soll der nahme (erste spalte) stehen bleiben"*
 *   *„die spalten der einzigen tabelle sind Einstellungen (ohne das Wort
 *   „Einstellungen" nur ein dicker Runder schalter mit einem Pfeil); name;
 *   leistungsstufe; Übezeit; Wochenziehl (nur anzeigen wenn gesetzt)
 *   Treffsicherheit; Anschl/Min"*
 *
 * Gepinnt werden daraus sechs Bedingungen:
 *
 *  1. Es gibt GENAU EINE Tabelle auf der Seite.
 *  2. Ihre Spalten sind die benannten - in der benannten Reihenfolge.
 *  3. Die Spalte „Wochenziel" steht nur da, wenn eines gesetzt ist.
 *  4. Der Einstellungen-Knopf trägt kein sichtbares Wort mehr, behält aber
 *     seinen Namen für die Sprachausgabe und seine 44 × 44 Punkte.
 *  5. Der Fokus bleibt beim Auf- und Zuklappen AUF DEM KNOPF (unverändert
 *     aus N3 - das war nie zur Debatte).
 *  6. Knopf- und Namensspalte kleben beim seitlichen Schieben am Rand.
 *
 * ── ⚠️ Warum Punkt 4 zwei Zusicherungen braucht ────────────────────────────
 * „Kein sichtbares Wort" allein wäre ein Rückschritt: Genau so sah der Knopf
 * vor dem 31.08. aus, und genau deshalb wurde er damals umgebaut. Der
 * Unterschied liegt im `aria-label` und im Hinweis (`Tipp`) - fällt eines von
 * beiden weg, ist der Knopf wieder stumm. Darum stehen beide hier.
 *
 * ── ⚠️ Der Hinweis eines Spaltenkopfes steht IM `th` ───────────────────────
 * Er ist nur unsichtbar geschaltet (`visibility`), damit `aria-describedby`
 * immer auf ein vorhandenes Element zeigt. jsdom rechnet kein CSS - sein Text
 * zählt hier also zum `textContent` und wird vor dem Vergleich weggenommen.
 * Sonst prüfte man den Erklärungssatz statt der Überschrift.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { typingBackend } from "@/lib/typing";
import type { TypingAccount } from "@/lib/typing";
import { addPupil, createClass, listPupils, registerTeacher } from "@/lib/typing/account";

function baueKinder(): TypingAccount[] {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Mia", "Noah"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return listPupils(c.value.code);
}

let kinder: TypingAccount[] = [];

beforeEach(() => {
  localStorage.clear();
  kinder = baueKinder();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const AUFKLAPPEN = "Einstellungen und Auswertung von Mia ausklappen";
const EINKLAPPEN = "Einstellungen und Auswertung von Mia einklappen";

async function zeige() {
  render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
  return await screen.findByRole("table", { name: /Lernende der Klasse/ });
}

/** Die Überschriften einer Tabelle - ohne den Hinweistext im Kopf. */
/**
 * Die Köpfe der SPALTEN-Zeile.
 *
 * ⚠️ Seit B2 (11.09.2026) hat der Kopf ZWEI Zeilen: darüber die Gruppen
 * („Üben", „Prüfung", `scope="colgroup"`). Deren Zellen sind ebenfalls
 * `columnheader` - über die ganze Tabelle gesucht kämen sie mit. Genommen wird
 * darum die LETZTE Kopfzeile; die Gruppenzeile prüft ein eigener Wächter
 * (`tests/tastenflow-score-spalte.test.tsx`).
 */
function spaltenKoepfe(tisch: HTMLElement): string[] {
  const letzte = [...tisch.querySelectorAll("thead tr")].pop() as HTMLElement;
  return within(letzte)
    .getAllByRole("columnheader")
    .map((k) => {
      const kopie = k.cloneNode(true) as HTMLElement;
      kopie.querySelectorAll('[role="tooltip"]').forEach((e) => e.remove());
      return (kopie.textContent || "").trim();
    });
}

describe("★★★ 1 - es gibt genau EINE Tabelle", () => {
  it("keine zweite mit einer zweiten Namensspalte", async () => {
    await zeige();
    /*
      ⚠️ Bis zum 01.09.2026 standen hier zwei: der Wochenstreifen und die
      Lernenden-Tabelle, jede mit einer Spalte „Name". Wer eine Person suchte,
      fand sie zweimal mit verschiedenen Zahlen. Diese Zusicherung ist der
      ganze Punkt des Umbaus - sie darf nicht wieder aufweichen.
    */
    expect(screen.getAllByRole("table")).toHaveLength(1);
  });

  it("und keine Karten-Fassung daneben, die dasselbe ein zweites Mal sagt", async () => {
    await zeige();
    expect(screen.queryByRole("list", { name: /Lernende der Klasse/i })).toBeNull();
  });
});

describe("★★★ 2+3 - die Spalten sind die benannten", () => {
  it("ohne gesetztes Wochenziel: die benannten Spalten, ohne „Wochenziel“", async () => {
    /*
      Frisch angelegte Konten haben `goalUnits = 0`. Johannes: „Wochenziehl
      (nur anzeigen wenn gesetzt)" - eine Spalte voller Striche ist keine
      Auskunft.

      ⚠️ FORTGESCHRIEBEN am 01.09.2026 (nachmittags): „Tasten" ist dazugekommen.
      Johannes: *„die Tasten zB 12/31 gehören noch in die tabelle rechts neben
      leistungsstufe."* Die REIHENFOLGE ist der Gegenstand dieses Wächters, nicht
      die Anzahl - darum steht sie hier ausgeschrieben und wird beim nächsten
      Umbau wieder auffallen.
    */
    const tisch = await zeige();
    expect(spaltenKoepfe(tisch)).toEqual([
      // Der Knopf-Kopf trägt sein Wort nur für die Sprachausgabe.
      "Einstellungen",
      "Name",
      "Leistungsstufe",
      "Tasten",
      // ★ 25.09.2026 (Testerin, Entscheidung Johannes): die nächsten zwei Tasten.
      "Nächste Tasten",
      "Übezeit",
      // ★ 13.11.2026 (Gezielt üben): letzte Spalte der Gruppe „Stand und Übezeit".
      "Gezielt",
      "Treffsicherheit",
      "Anschl./Min",
      // ★ 11.09.2026 (B2), Johannes: „Übungsscore und Prüfungsscore jeweils
      // eine Spalte, Prüfungsscore ganz rechts."
      "Score",
      // ★ 10.09.2026, Johannes: „es braucht eine neue spalte … »Tippchallenge« 3 / 82".
      "Tippchallenge",
      // ★ 21.09.2026, Johannes: „Die Klassenmatch gehören als Zahl auch in die
      // Statistik" - ganz rechts.
      "Klassenmatch",
    ]);
  });

  it("mit gesetztem Wochenziel steht die Spalte an siebter Stelle", async () => {
    const backend = typingBackend();
    await backend.setWochenziel(kinder[0].id, { minuten: 45, wochen: [], nachholen: false });
    kinder = listPupils(kinder[0].classCode ?? "");
    const tisch = await zeige();
    // ★ 18.09.2026: die Tabelle startet auf „Schuljahr" (dort heisst die
    // Spalte „Wochenziele") - für „Wochenziel" erst auf „Woche" umschalten.
    fireEvent.click(screen.getByRole("button", { name: "Woche" }));
    expect(spaltenKoepfe(tisch)).toEqual([
      "Einstellungen",
      "Name",
      "Leistungsstufe",
      "Tasten",
      "Nächste Tasten",
      "Übezeit",
      "Wochenziel",
      "Gezielt",
      "Treffsicherheit",
      "Anschl./Min",
      "Score",
      "Tippchallenge",
      "Klassenmatch",
    ]);
  });

  it("★ jeder erklärte Kopf trägt seine Erklärung SELBST - nicht die Seite darüber", async () => {
    /*
      Johannes: „nur mouse over bei der spaltenüberschrift." Gemessen wird,
      dass die Erklärung am Kopf hängt (`aria-describedby` auf ein vorhandenes
      Element) - und nicht als Absatz über der Tabelle steht.
    */
    const tisch = await zeige();
    const stufe = within(tisch)
      .getAllByRole("columnheader")
      .find((k) => (k.textContent || "").startsWith("Leistungsstufe"))!;
    const id = stufe.getAttribute("aria-describedby");
    expect(id, "der Kopf Leistungsstufe hat keine Erklärung").toBeTruthy();
    const hinweis = document.getElementById(id!);
    expect(hinweis, "die Erklärung zeigt ins Leere").toBeTruthy();
    expect(hinweis!.getAttribute("role")).toBe("tooltip");
    expect(hinweis!.textContent).toMatch(/1 bis 50/);
  });
});

describe("★★ 4+5 - der runde Knopf ohne Wort", () => {
  it("trägt kein sichtbares Wort mehr, aber weiter seinen Namen", async () => {
    await zeige();
    const knopf = screen.getByRole("button", { name: AUFKLAPPEN });
    expect(knopf.tagName).toBe("BUTTON");
    /*
      ★ A4 (11.09.2026): Kein Text-Zeichen mehr - der Pfeil ist seither ein
      Inline-SVG-Chevron (`stroke-linejoin="round"`, `aria-hidden`,
      `currentColor`), damit er den 44-px-Kreis fast ausfüllt, OHNE `text-*`
      die Zeilenhöhe der Tabelle mitziehen zu lassen (siehe `RaetselLauf`
      betrifft das nicht - hier: `TastenflowReiter.tsx`, `EinstellungenKnopf`).
      Der Knopf trägt also kein Text-Zeichen mehr, aber weiter ein SVG.
    */
    expect((knopf.textContent || "").trim()).toBe("");
    const pfeil = knopf.querySelector("svg");
    expect(pfeil, "der Pfeil fehlt als Inline-SVG").toBeTruthy();
    expect(pfeil!.getAttribute("aria-hidden")).toBe("true");
    // ⚠️ … aber NICHT stumm: Name für die Sprachausgabe, Hinweis für die Maus.
    expect(knopf.getAttribute("aria-label")).toBe(AUFKLAPPEN);
    const hinweisId = knopf.getAttribute("aria-describedby");
    expect(hinweisId, "ohne Hinweis wäre der Knopf für Sehreste stumm").toBeTruthy();
    expect(document.getElementById(hinweisId!)!.textContent).toMatch(/Einstellungen/);
    /*
      Rund und 36 × 36 - jsdom rechnet kein Layout, darum an der Klasse
      gemessen. ★ Bis 11.09.2026 abends stand hier 44 × 44 (A4). Geändert mit
      dem Bauplan „Klassenseite einheitlich" (R1: EINE Bedienhöhe 36 px auf
      „Meine Klassen", Johannes: *„schaue dir die schalterhöhen an … bitte
      gestalte diese wichtige seite richtig ansprechend übersichtlich und
      schlank"*). Der Pfeil bleibt gross, nur der Kreis wird kleiner - im
      Browser gemessen: 36,0 px.
    */
    expect(knopf.className).toMatch(/rounded-full/);
    expect(knopf.className).toMatch(/\bh-9\b/);
    expect(knopf.className).toMatch(/\bw-9\b/);
  });

  it("★ der Fokus bleibt beim Auf- UND Zuklappen auf dem Knopf", async () => {
    await zeige();
    const knopf = screen.getByRole("button", { name: AUFKLAPPEN });
    knopf.focus();

    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(document.activeElement).toBe(knopf);
    expect(knopf.getAttribute("aria-expanded")).toBe("true");
    // DASSELBE Element - nicht ein gleich aussehendes neues.
    expect(screen.getByRole("button", { name: EINKLAPPEN })).toBe(knopf);

    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(document.activeElement).toBe(knopf);
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
  });

  it("zugeklappt ist KEINE Einstellung sichtbar, aufgeklappt stehen alle da", async () => {
    /*
      ★★★ B10 (11.09.2026): „ALLE" sind seither DREI, nicht sechs. Textstufe,
      Geburtsjahr und Sprache samt Sperre gelten für die ganze KLASSE (Kasten
      „Einstellungen der Klasse"); je Kind bleibt, was wirklich an der Person
      hängt. Der Wächter prüft beides: dass die drei da sind UND dass die
      anderen weg sind - sonst stünde dieselbe Einstellung an zwei Stellen.

      ★ E4 (18.09.2026): „aufgeklappt" ist seither ZWEI Schritte - erst die
      Zeile der Person, dann ihre eigene Zeile „Einstellungen für Mia" (ein
      `<details>`, zu bis geöffnet). Der Wächter bleibt derselbe, er öffnet nur
      beide.
    */
    await zeige();
    expect(screen.queryByRole("combobox", { name: "Womit Mia anfängt" })).toBeNull();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: AUFKLAPPEN }));
    });
    // Der `<summary>` hat in jsdom keine eigene Rolle - über den sichtbaren
    // Text geklickt.
    await act(async () => {
      fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));
    });
    expect(screen.getByRole("combobox", { name: "Womit Mia anfängt" })).toBeTruthy();
    expect(
      screen.getByRole("checkbox", {
        name: "Einhand schreiben für Mia: Umschalt-Gegenhand-Regel aus",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("checkbox", {
        name: "Tempo zählt nicht für Mia: Geschwindigkeit wird nirgends bewertet",
      }),
    ).toBeTruthy();

    // Und die vier, die zur Klasse gewandert sind, stehen hier NICHT mehr.
    expect(screen.queryByRole("combobox", { name: "Textstufe von Mia" })).toBeNull();
    expect(screen.queryByRole("combobox", { name: "Sprache von Mia" })).toBeNull();
    expect(screen.queryByLabelText(/Geburtsjahr von Mia/i)).toBeNull();
    expect(
      screen.queryByRole("button", { name: /Diese Einstellungen für alle übernehmen/ }),
    ).toBeNull();
  });
});

describe("★★ 6 - die erste Spalte bleibt beim seitlichen Schieben stehen", () => {
  it("★★ die Tabelle steht auf border-separate - sonst klebt in Chrome nichts", async () => {
    /*
      ⚠️⚠️ DER FEHLER, DEN DIESER TEST FESTHÄLT, WAR SCHON GEBAUT.
      Tailwind setzt Tabellen von sich aus auf `border-collapse: collapse`, und
      damit ist `position: sticky` an einer Tabellenzelle in Chrome und Safari
      WIRKUNGSLOS. Die klebende Spalte wäre in genau den Browsern tot gewesen,
      in denen die Schulen arbeiten - und jeder andere Test hier wäre grün
      geblieben, weil jsdom kein Layout rechnet und die Klasse ja dasteht.
    */
    const tisch = await zeige();
    expect(tisch.className).toMatch(/border-separate/);
    // Und die Trennlinien hängen dann an den ZELLEN - an einem <tr> zeichnet
    // mit `border-separate` kein Browser einen Rahmen.
    // ★ T1 (19.09.2026): mit `>` (nur die Zellen DIESER Tabelle) und unten
    // statt oben - die Linie unter dem klebenden Kopf hängt an dessen Zellen.
    const koerper = tisch.querySelector("tbody")!;
    expect(koerper.className).toMatch(/\[&>tr>td\]:border-b/);
    expect(koerper.className).not.toMatch(/\[&_tr\]:border-[tb]/);
  });

  it("Knopf- und Namenszelle kleben, und zwar mit deckendem Grund", async () => {
    const tisch = await zeige();
    const zeile = within(tisch).getByRole("row", { name: /Mia/ });
    const zellen = Array.from(zeile.querySelectorAll("th,td")) as HTMLElement[];

    // Erste Zelle: der Knopf. Zweite: der Name.
    expect(zellen[0].className, "Knopfspalte klebt nicht").toMatch(/sticky left-0/);
    expect(zellen[1].className, "Namensspalte klebt nicht").toMatch(/sticky left-14/);
    /*
      ⚠️ Ohne DECKENDE Farbe wandern die Zahlen beim Schieben sichtbar unter
      dem Namen durch. `bg-surface-*` ohne Durchsicht-Anteil ist Pflicht -
      `/60` und Ähnliches wäre genau der Fehler.
    */
    for (const zelle of [zellen[0], zellen[1]]) {
      expect(zelle.className).toMatch(/bg-surface-(raised|sunken)(?!\/)/);
    }
  });

  it("★★ und zwar in JEDER Zeile - auch in den abgesetzten", async () => {
    /*
      ⚠️⚠️ GEMESSEN AM 01.09.2026 IM BROWSER, nachdem der Test darüber grün war.
      Der Zebra-Ton der zweiten Zeile war `bg-surface-sunken/60` - zu 40 %
      durchsichtig. Weil derselbe Ton auch die klebenden Zellen trägt, wanderten
      dort die Zahlen sichtbar unter dem Namen durch. Der Test darüber sah es
      nicht: Er prüfte nur die ERSTE Zeile, und die ist die deckende.
      ⇒ Jede Zeile, nicht eine.
    */
    const tisch = await zeige();
    for (const zeile of within(tisch).getAllByRole("row").slice(1)) {
      for (const zelle of Array.from(zeile.querySelectorAll("th,td")).slice(0, 2)) {
        expect(
          (zelle as HTMLElement).className,
          `durchscheinender Grund in einer klebenden Zelle: ${(zelle as HTMLElement).className}`,
        ).not.toMatch(/bg-surface-\w+\/\d+/);
      }
    }
  });

  it("★ jede zweite Zeile ist abgesetzt, damit man sie nicht verliert", async () => {
    const tisch = await zeige();
    const mia = within(tisch).getByRole("row", { name: /Mia/ });
    const noah = within(tisch).getByRole("row", { name: /Noah/ });
    expect(mia.className).not.toBe(noah.className);
    /*
      ⚠️ Der Wechsel hängt am INDEX der Person, nicht an `nth-child`: Zwischen
      zwei Personen kann eine aufgeklappte Zeile stehen. Genau das wird hier
      gemessen - nach dem Aufklappen von Mia muss Noah seinen Ton BEHALTEN.
    */
    const noahVorher = noah.className;
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: AUFKLAPPEN }));
    });
    expect(
      within(tisch).getByRole("row", { name: /Noah/ }).className,
      "der Zebra-Ton ist beim Aufklappen umgesprungen",
    ).toBe(noahVorher);
  });
});
