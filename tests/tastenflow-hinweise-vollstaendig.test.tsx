/**
 * ★★★★★ WÄCHTER K2: MOUSEOVER-HINWEIS AUF JEDEM SCHALTER (19.09.2026).
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Johannes hat E12 geprüft ("Hinweise überall") und trotzdem Lücken gefunden -
 * zuletzt namentlich „eigene Übungen". Dieser Wächter prüft darum nicht mehr
 * NUR die schon bekannten E12-Bereiche (das tut weiterhin
 * `tests/tastenflow-seite-schlank.test.tsx`), sondern zählt in den PANELS, die
 * K2 angefasst hat, JEDES `button`/`input`/`select` durch und verlangt für
 * jedes einen `aria-describedby`, der auf ein `role="tooltip"`-Element zeigt
 * (den Kasten hinter `Tipp`/`Erklaert`, siehe `src/components/Tipp.tsx`).
 *
 * ⚠️ jsdom rechnet kein Layout - dieser Wächter prüft darum die VERDRAHTUNG
 * (das Attribut, das Ziel-Element mit `role="tooltip"`), nicht das Aussehen.
 * Ob der Kasten beim Überfahren wirklich sichtbar, gross und schnell
 * erscheint, misst `scripts/hinweis-luecken.mjs` im echten Browser
 * (`npm run dev -- --mode mockaudit`, siehe Kopf-Kommentar dort).
 *
 * Ausnahmen (sichtbare Beschriftung ist schon die vollständige Auskunft,
 * oder ein `<summary>` - der laut `Tipp.tsx`-Vorgabe NIE einen `Tipp`
 * bekommt): siehe `AUSNAHMEN` unten, mit Begründung in der Übergabe des Tages.
 */
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { ClassTeachers } from "@/components/lernwerkstatt/klasse/ClassTeachers";
import {
  EigenerTextQuelle,
  type EigenerTextQuelleProps,
} from "@/components/lernwerkstatt/klasse/EigenerTextQuelle";
import { useEigenerTextUpload } from "@/lib/typing/useEigenerTextUpload";
import { WeekMultiSelect } from "@/components/typing/WeekMultiSelect";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
  speichereMeinenText,
} from "@/lib/typing/account";

/**
 * ★ Beschriftungen, deren sichtbarer Inhalt bereits die vollständige Auskunft
 * ist (Brief-Vorgabe: "controls whose visible label IS the complete
 * explanation and that are standard"), oder die laut `Tipp.tsx` nie einen
 * `Tipp` bekommen (`<summary>`). Jede Zeile mit Begründung.
 */
const AUSNAHMEN: RegExp[] = [
  /^Klasse wechseln$/, // eigener Name + Beschriftung "Klasse" sagen schon alles (MeineKlassePage.tsx, gemessen 11.09.)
  /^Datenschutz$/,
  /^Impressum$/,
  /^Barrierefreiheit$/,
  /^Unterstützen$/, // Rechtliches-Fusszeile, steht auf jeder Seite
  /^Abbrechen$/,
  /^✕?\s*(Dialog|Statistik|Hilfe)\s*schließen$/, // Modal.tsx (gemeinsam) bzw. reine Schliess-Knöpfe
  /^Klassenname$/, // Feldname + Platzhalter-Beispiel sagen schon alles, keine Regel zu erklären
  /^Passwort$/, // Platzhalter "mind. 4 Zeichen" nennt die einzige Regel; "Zufällig" daneben hat eigenen Hinweis
];

function istAusnahme(name: string): boolean {
  return AUSNAHMEN.some((r) => r.test(name.trim()));
}

/** Der Name eines Elements, wie eine Sprachausgabe ihn vorläse. */
function zugänglicherName(el: HTMLElement): string {
  return (
    el.getAttribute("aria-label") ||
    (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) ||
    el.closest("label")?.textContent ||
    el.textContent ||
    el.getAttribute("placeholder") ||
    ""
  ).trim();
}

/** Zeigt `aria-describedby` (irgendeine der ids) auf ein `role="tooltip"`-Element? */
function hatTooltipHinweis(el: HTMLElement): boolean {
  const roh = el.getAttribute("aria-describedby");
  if (!roh) return false;
  return roh
    .trim()
    .split(/\s+/)
    .some((id) => document.getElementById(id)?.getAttribute("role") === "tooltip");
}

/**
 * Prüft JEDES `button`/`input`/`select`/`textarea` unterhalb von `ausschnitt`:
 * entweder ein Mouseover-Hinweis (`aria-describedby` → `role="tooltip"`) ist
 * verdrahtet, oder die Beschriftung steht in `AUSNAHMEN`. Ein `<summary>`
 * zählt nie mit (`Tipp` darf laut Vorgabe nicht darauf liegen).
 */
function pruefeVollstaendigkeit(ausschnitt: HTMLElement) {
  const kontrollen = ausschnitt.querySelectorAll<HTMLElement>("button, input, select, textarea");
  const luecken: string[] = [];
  for (const el of kontrollen) {
    if (el.closest("summary")) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    const name = zugänglicherName(el) || `(${el.tagName.toLowerCase()} ohne Namen)`;
    if (istAusnahme(name)) continue;
    if (!hatTooltipHinweis(el)) luecken.push(`${el.tagName.toLowerCase()} „${name}"`);
  }
  expect(luecken, `Ohne Hinweis: ${luecken.join(", ")}`).toEqual([]);
}

function baueKlasse(): { cls: TypingClass; teacherId: string; kinder: TypingAccount[] } {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return { cls: getClass(c.value.code)!, teacherId: t.value.id, kinder: listPupils(c.value.code) };
}

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe("★★★ Die vier Aufgaben-Schalter (Tippchallenge/Eigene Übung/Wochenziel/Einstellungen)", () => {
  it("tragen alle vier einen Hinweis, der auf einen Hinweiskasten zeigt", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });

    // ★ Über `aria-controls`, nicht über den sichtbaren Namen: „Tippchallenge"
    // ist AUCH eine Spaltenüberschrift der Tabelle (Gruppe „Prüfung"), ein
    // Namensmuster träfe zwei Elemente.
    for (const panelId of [
      "mk-tf-panel-tippchallenge",
      "mk-tf-panel-eigene-uebung",
      "mk-tf-panel-wochenziel",
      "mk-tf-panel-einstellungen-klasse",
    ]) {
      const knopf = document.querySelector(`[aria-controls="${panelId}"]`);
      expect(knopf, `Kein Schalter für „${panelId}"`).toBeTruthy();
      expect(hatTooltipHinweis(knopf as HTMLElement), `„${knopf!.textContent}“ ohne Hinweis`).toBe(true);
    }
  });

  it("die Spaltenüberschrift „Name“ trägt (wie ihre Nachbarn) einen Hinweis", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    const kopf = screen.getByRole("columnheader", { name: /^Name/ });
    const id = kopf.getAttribute("aria-describedby");
    expect(id, "„Name“ hat keine Beschreibung").toBeTruthy();
    expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
  });

  it("„Woche“ und „Schuljahr“ im Tabellenkopf tragen (wie „Monat“ und „Gesamt“) einen Hinweis", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ Nicht `/^Woche/` bzw. `/^Schuljahr/` allein: „Wochenziel" beginnt
    // ebenso mit „Woche", und der Umschalter im Klassenüberblick trägt
    // `aria-label="Schuljahr im Klassenüberblick"` - beide träfen sonst
    // ebenfalls zu und machten den Namen mehrdeutig.
    const woche = screen.getByRole("button", { name: /^Woche(?:$|\s\d)/ });
    const schuljahr = screen.getByRole("button", { name: /^Schuljahr\s\d/ });
    expect(hatTooltipHinweis(woche), "„Woche“ ohne Hinweis").toBe(true);
    expect(hatTooltipHinweis(schuljahr), "„Schuljahr“ ohne Hinweis").toBe(true);
  });
});

describe("★★★ „Eigene Übung“ - die Quellen-Wahl (EigenerTextQuelle.tsx)", () => {
  /** Trägt Stand/Handler selbst - EigenerTextQuelle bekommt `upload` von aussen. */
  function Harness(props: Partial<EigenerTextQuelleProps> & Pick<EigenerTextQuelleProps, "teacherId">) {
    const upload = useEigenerTextUpload(props.verbietenSs ?? false);
    const [inPool, setInPool] = useState(false);
    return (
      <EigenerTextQuelle
        teacherId={props.teacherId}
        stufe={props.stufe ?? "kids"}
        lang={props.lang ?? "de"}
        verbietenSs={props.verbietenSs ?? false}
        upload={upload}
        inPoolSpeichern={inPool}
        onInPoolSpeichernChange={setInPool}
      />
    );
  }

  it("die Datei-Auswahl trägt einen Hinweis, getrennt vom `<label>` (Fussnote in der Datei)", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    render(<Harness teacherId={t.value.id} />);
    const datei = screen.getByLabelText(/Eigene Datei hochladen/);
    expect(hatTooltipHinweis(datei), "Datei-Feld ohne Hinweis").toBe(true);
    // ★ Die Regel aus der Datei bleibt bestehen: der Tipp darf nicht IM
    // `<label>` verschachtelt sein, sonst bräche `getByLabelText` - dieser
    // Aufruf selbst ist der Beweis, dass die Regel noch gilt.
  });

  it("ein Eintrag in „Meine Texte“ trägt an ALLEN Knöpfen einen Hinweis (Auswählen, Ansehen, Löschen)", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    speichereMeinenText(t.value.id, "gedicht.txt", ["Zeile eins.", "Zeile zwei."]);
    const user = userEvent.setup();
    render(<Harness teacherId={t.value.id} />);
    await user.click(screen.getByRole("button", { name: "Meine Texte" }));
    const auswaehlen = await screen.findByRole("button", { name: /^gedicht\.txt/ });
    const ansehen = screen.getByRole("button", { name: "Ansehen: gedicht.txt" });
    const loeschen = screen.getByRole("button", { name: "Löschen" });
    expect(hatTooltipHinweis(auswaehlen), "Textauswahl ohne Hinweis").toBe(true);
    expect(hatTooltipHinweis(ansehen), "„Ansehen“ ohne Hinweis").toBe(true);
    expect(hatTooltipHinweis(loeschen), "„Löschen“ ohne Hinweis").toBe(true);
  });

  it("jede Vorlage im Regal trägt einen Hinweis", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const user = userEvent.setup();
    render(<Harness teacherId={t.value.id} />);
    await user.click(screen.getByRole("button", { name: "Vorlagen" }));
    const liste = await screen.findAllByRole("listitem");
    expect(liste.length).toBeGreaterThan(0);
    for (const eintrag of liste) {
      const knopf = within(eintrag).getByRole("button");
      expect(hatTooltipHinweis(knopf), `„${knopf.textContent}“ ohne Hinweis`).toBe(true);
    }
  });
});

describe("★★★ „Kinder und Zugänge“ - Namensfeld und Co-Lehrkraft-E-Mail", () => {
  it("„Zur Klasse hinzufügen“ (Name) trägt einen Hinweis", () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    render(
      <KlasseUndKinder
        teacher={t.value}
        classes={[getClass(c.value.code)!]}
        cls={getClass(c.value.code)!}
        pupils={listPupils(c.value.code)}
        offeneProgramme={[]}
        einstiegsProgramm="tippen"
        onSelectClass={() => {}}
        onChanged={() => {}}
      />,
    );
    const feld = screen.getByLabelText("Zur Klasse hinzufügen");
    expect(hatTooltipHinweis(feld), "Namensfeld ohne Hinweis").toBe(true);
  });

  it("„Weitere Lehrkraft (E-Mail)“ trägt einen Hinweis (kurz, der Knopf „Hinzufügen“ trägt die volle Erklärung)", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    render(<ClassTeachers classCode={c.value.code} meId={t.value.id} />);
    fireEvent.click(screen.getByRole("button", { name: /Lehrkräfte dieser Klasse/ }));
    const feld = await screen.findByLabelText("Weitere Lehrkraft (E-Mail)");
    expect(hatTooltipHinweis(feld), "E-Mail-Feld ohne Hinweis").toBe(true);
    const hinzufuegen = screen.getByRole("button", { name: "Hinzufügen" });
    expect(hatTooltipHinweis(hinzufuegen), "„Hinzufügen“ ohne Hinweis").toBe(true);
  });
});

describe("★★★ Der Kalenderwochen-Umschalter (WeekMultiSelect.tsx)", () => {
  it("der Auslöser-Knopf trägt einen Hinweis - an BEIDEN Einbau-Stellen (Kind und Klasse)", () => {
    render(<WeekMultiSelect value={[]} onChange={() => {}} nowMs={Date.now()} />);
    const knopf = screen.getByRole("button", { name: /Ziel-Kalenderwochen/ });
    expect(hatTooltipHinweis(knopf), "Kalenderwochen-Knopf ohne Hinweis").toBe(true);
  });
});

describe("★★★ Rundumschlag: keine der vier Panels lässt einen Schalter ohne Hinweis stehen", () => {
  /**
   * ★ Nicht über `getByRole("button", { name })`: „Tippchallenge" ist AUCH
   * eine Spaltenüberschrift der Tabelle (Gruppe „Prüfung") - ein Namensmuster
   * träfe zwei Elemente. `aria-controls` ist eindeutig, sie gehört nur dem
   * Schalter, der das Panel aufklappt.
   */
  function schalterFuerPanel(panelId: string): HTMLElement {
    const el = document.querySelector(`[aria-controls="${panelId}"]`);
    if (!el) throw new Error(`Kein Schalter mit aria-controls="${panelId}" gefunden.`);
    return el as HTMLElement;
  }

  it("Tippchallenge-, Eigene-Übung-, Wochenziel- und Einstellungen-Panel, alle vier aufgeklappt", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const { container } = render(
      <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });

    // Eigene Übung: Datei hochladen ist die Vorgabe - reicht für die Kontrolle
    // der Reihe selbst; „Meine Texte“/„Vorlagen“ sind oben einzeln geprüft.
    fireEvent.click(schalterFuerPanel("mk-tf-panel-eigene-uebung"));
    await waitFor(() => screen.getByLabelText(/Eigene Datei hochladen/));
    pruefeVollstaendigkeit(document.getElementById("mk-tf-panel-eigene-uebung")!);

    fireEvent.click(schalterFuerPanel("mk-tf-panel-wochenziel"));
    pruefeVollstaendigkeit(document.getElementById("mk-tf-panel-wochenziel")!);

    fireEvent.click(schalterFuerPanel("mk-tf-panel-einstellungen-klasse"));
    await screen.findByLabelText(/Schulstufe der Klasse/);
    pruefeVollstaendigkeit(document.getElementById("mk-tf-panel-einstellungen-klasse")!);

    fireEvent.click(schalterFuerPanel("mk-tf-panel-tippchallenge"));
    pruefeVollstaendigkeit(document.getElementById("mk-tf-panel-tippchallenge")!);

    // Die Schalter-Reihe selbst (ausserhalb der Panels).
    pruefeVollstaendigkeit(
      container.querySelector('[role="group"][aria-label="Aufgaben für die Klasse"]') as HTMLElement,
    );
  });
});
