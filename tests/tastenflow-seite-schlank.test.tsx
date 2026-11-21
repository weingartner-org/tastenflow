/**
 * ★★★★★ WÄCHTER E12: DIE SEITE BLEIBT SCHLANK - Mouseover statt Dauertext.
 *
 * Johannes, 19.09.2026 (wörtlich, schon bei ZeitraumKopf zitiert):
 * *„denk daran, in unserer neuen Oberfläche alle möglichen Bereiche mit
 * Mouseover zu erklären! und immer mit dem großen schnellen"* - und:
 * *„halte die Seite jetzt extrem schlank und mach keine dauerhaften
 * Erklärungen unter den Schaltern, das geht mit Mouseover."*
 *
 * Dieser Wächter prüft die Bereiche, die E12 umgebaut hat - die aufgeklappte
 * Kind-Zeile (`PupilEinstellungen`), „Einstellungen der Klasse"
 * (`KlassenEinstellungsFelder.tsx`), „Eigene Übung" (`EigeneUebungKasten.tsx`)
 * und „Kinder und Zugänge" (`KlasseUndKinder.tsx`, `ClassTeachers.tsx`) - auf
 * zwei Dinge:
 *
 *  1. Kein natives `title` irgendwo (der native Hinweis ist für die Tastatur
 *     taub, siehe `Tipp.tsx`).
 *  2. Ein Satz, der bis E12 als DAUERHAFTER Absatz unter einem Schalter stand,
 *     ist jetzt NUR NOCH über die Beschreibung einer Kontrolle erreichbar -
 *     als Inhalt eines `role="tooltip"`-Kastens (der `Hinweiskasten` hinter
 *     `Tipp`/`Erklaert`), nicht mehr als eigenständiger, immer sichtbarer
 *     Text daneben.
 *
 * ⚠️ jsdom rechnet kein CSS: Ein `Tipp`-Hinweis steht als `visibility:hidden`
 * IMMER im Baum (das ist Absicht, siehe `Tipp.tsx`) - `getByText` findet ihn
 * darum unabhängig davon, ob er gerade "offen" ist. Das ist hier erwünscht:
 * Es geht nicht darum, ob der Kasten sichtbar ist, sondern WO der Satz im
 * Baum hängt - direkt als Geschwister-Absatz (schlecht, E12 sollte das
 * abgeschafft haben) oder nur innerhalb eines `[role="tooltip"]` (richtig).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";

/**
 * Ein Satz, der NUR über eine Beschreibung erreichbar sein darf: jedes
 * Textblatt, das ihn (als eigenen, alleinstehenden Text) trägt, muss
 * innerhalb eines `[role="tooltip"]`-Kastens liegen - nie als eigener,
 * immer sichtbarer Absatz daneben.
 */
function nurAlsBeschreibungErreichbar(satz: string) {
  const treffer = [...document.querySelectorAll("body *")].filter(
    (el) => el.children.length === 0 && (el.textContent ?? "").includes(satz),
  );
  expect(treffer.length, `„${satz}“ steht nirgends im Baum`).toBeGreaterThan(0);
  for (const el of treffer) {
    expect(
      el.closest('[role="tooltip"]'),
      `„${satz}“ steht ausserhalb eines Hinweiskastens: ${el.outerHTML}`,
    ).not.toBeNull();
  }
}

/**
 * ★ Gilt für einen AUSSCHNITT, nicht immer für die ganze Seite: Die
 * aufgeklappte Zeile trägt auch `BadgeShelf` (Abzeichen) - ein Bauteil aus dem
 * Revier der Kind-Statistik (parallele Übersetzungs-Charge, nicht Teil von
 * E12) mit eigenen, bereits bestehenden `title`-Attributen an den
 * Abzeichen-Medaillen. Die E12-Messung „[title] = 0" gilt für die BEREICHE,
 * die dieser Auftrag umgebaut hat - hier über einen `HTMLElement`-Ausschnitt
 * geprüft, nicht `document`.
 */
function keinTitleAttribut(ausschnitt: ParentNode = document) {
  expect(ausschnitt.querySelectorAll("[title]").length).toBe(0);
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

describe("★★★ Die aufgeklappte Kind-Zeile (PupilEinstellungen)", () => {
  async function oeffneMia() {
    const { cls, teacherId, kinder } = baueKlasse();
    render(
      <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    fireEvent.click(screen.getByRole("button", { name: /Einstellungen und Auswertung von Mia/i }));
    fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));
  }

  /** Nur der Unterbereich „Einstellungen" - nicht die ganze Zeile (siehe `keinTitleAttribut`). */
  function einstellungenBereich(): HTMLElement {
    return screen.getByRole("heading", { name: "Einstellungen", level: 3 }).closest("div")!;
  }

  it("kein natives [title] im Unterbereich Einstellungen", async () => {
    await oeffneMia();
    keinTitleAttribut(einstellungenBereich());
  });

  it("„Einhand schreiben“, „Tempo zählt nicht“ und „Zeichenabstand“ erklären sich nur noch über die Beschreibung ihres Kästchens/Feldes - kein Absatz mehr daneben", async () => {
    await oeffneMia();
    // ★ Die drei Sätze standen bis E12 als eigene <p> UNTER den drei Feldern.
    nurAlsBeschreibungErreichbar(
      "die Umschalt-Gegenhand-Regel ist für dieses Kind aus",
    );
    nurAlsBeschreibungErreichbar(
      "kein Zeitfenster im Spiel, kein Tempo-Ziel bei den Sternen",
    );
    nurAlsBeschreibungErreichbar(
      `vierfach" die vierfache Laufweite je Zeichen`,
    );
    // Und jedes der drei Bedienelemente verweist wirklich auf seinen Kasten.
    const einhand = screen.getByRole("checkbox", { name: /Einhand schreiben für Mia/ });
    const tempo = screen.getByRole("checkbox", { name: /Tempo zählt nicht für Mia/ });
    const laufweite = screen.getByRole("combobox", { name: /Zeichenabstand groß \(CVI\) für Mia/ });
    for (const feld of [einhand, tempo, laufweite]) {
      const id = feld.getAttribute("aria-describedby");
      expect(id, `${feld.getAttribute("aria-label")} hat keine Beschreibung`).toBeTruthy();
      expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
    }
  });

  it("„Womit anfangen?“ trägt seinen Hinweis am Feld, nicht mehr über `Feld`s alte `hinweis`-Eigenschaft", async () => {
    await oeffneMia();
    const feld = screen.getByRole("combobox", { name: /Womit Mia anfängt/ });
    const id = feld.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    // Kann zwei Ids tragen (allgemeiner Hinweis + „wird wirksam …“) -
    // mindestens eine davon ist ein echter Hinweiskasten.
    const ids = id!.split(/\s+/);
    const rollen = ids.map((i) => document.getElementById(i)?.getAttribute("role"));
    expect(rollen).toContain("tooltip");
  });
});

describe("★★★ „Einstellungen der Klasse“ (KlassenEinstellungsFelder.tsx)", () => {
  async function oeffneEinstellungen() {
    const { cls, teacherId, kinder } = baueKlasse();
    render(
      <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ Der Schalter trägt seit E3 immer einen Stand-Zusatz („· Schulstufe
    // nicht gesetzt · Deutsch") - darum ein Regex, kein exakter Name.
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
    await screen.findByLabelText(/Schulstufe der Klasse/);
  }

  /** Nur das Panel selbst - siehe `keinTitleAttribut`. */
  function panel(): HTMLElement {
    return document.getElementById("mk-tf-panel-einstellungen-klasse") as HTMLElement;
  }

  it("kein natives [title] im Panel", async () => {
    await oeffneEinstellungen();
    keinTitleAttribut(panel());
  });

  it("„Klassenmatch erlauben“ erklärt sich nur noch über die Beschreibung des Kästchens - kein Absatz mehr daneben", async () => {
    await oeffneEinstellungen();
    nurAlsBeschreibungErreichbar(
      "Die Kinder können einander zu einem 5-Minuten-Match einladen",
    );
    const haken = screen.getByLabelText("Klassenmatch erlauben") as HTMLInputElement;
    const id = haken.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
  });

  it("Schulstufe und Startniveau tragen ihren Hinweis am Feld, nicht mehr als Absatz darunter", async () => {
    await oeffneEinstellungen();
    const schulstufe = screen.getByLabelText(/Schulstufe der Klasse/) as HTMLSelectElement;
    const startniveau = screen.getByLabelText(/Startniveau für alle Kinder der Klasse/) as HTMLSelectElement;
    for (const feld of [schulstufe, startniveau]) {
      const id = feld.getAttribute("aria-describedby");
      expect(id).toBeTruthy();
      expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
    }
  });
});

describe("★★★ „Eigene Übung“ (EigeneUebungKasten.tsx)", () => {
  it("„Eigene Übung starten“ trägt die Erklärung, wie die Übung läuft, nur noch als Beschreibung - kein Absatz mehr daneben", async () => {
    const user = userEvent.setup();
    const { cls, teacherId, kinder } = baueKlasse();
    render(
      <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ Trägt immer einen Stand-Zusatz („· nicht zugewiesen") - Regex statt Name.
    fireEvent.click(screen.getByRole("button", { name: /^Eigene Übung/ }));

    const datei = new File(["Erste Zeile"], "text.txt", { type: "text/plain" });
    await user.upload(screen.getByLabelText(/Eigene Datei hochladen/), datei);
    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());

    keinTitleAttribut(document.getElementById("mk-tf-panel-eigene-uebung")!);
    nurAlsBeschreibungErreichbar(
      "wer ihn einmal ganz durchgeschrieben hat, kehrt automatisch ins normale Training zurück",
    );
    const knopf = screen.getByRole("button", { name: "Eigene Übung starten" });
    const id = knopf.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
  });
});

describe("★★★ „Kinder und Zugänge“ (KlasseUndKinder.tsx, ClassTeachers.tsx)", () => {
  function zeige(cls: TypingClass | null, teacher: TypingAccount, pupils: TypingAccount[]) {
    render(
      <KlasseUndKinder
        teacher={teacher}
        classes={cls ? [cls] : []}
        cls={cls}
        pupils={pupils}
        offeneProgramme={[]}
        einstiegsProgramm="tippen"
        onSelectClass={() => {}}
        onChanged={() => {}}
      />,
    );
  }

  it("kein natives [title], „Neue Klasse anlegen“ und „Lehrkräfte dieser Klasse“ aufgeklappt", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    zeige(getClass(c.value.code)!, t.value, listPupils(c.value.code));

    // „Neue Klasse anlegen" öffnen - ein `<summary>` hat in jsdom keine
    // eigene Rolle (kein „button"), darum über den sichtbaren Text geklickt
    // (dieselbe Bauart wie in `tastenflow-klasse-anlegen-und-vorgaben.test.tsx`).
    fireEvent.click(screen.getByText(/^Neue Klasse anlegen\b/));
    // „Lehrkräfte dieser Klasse" öffnen.
    fireEvent.click(screen.getByRole("button", { name: /Lehrkräfte dieser Klasse/ }));
    await screen.findByLabelText("Weitere Lehrkraft (E-Mail)");

    keinTitleAttribut();
  });

  it("„Für Tastenflow“ und die Klassencode-Erklärung tragen ihren Satz nur noch am Feld - kein Absatz mehr daneben", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    zeige(null, t.value, []); // ohne Klasse: „Neue Klasse anlegen" steht offen
    nurAlsBeschreibungErreichbar(
      "Diese Angaben gelten nur im 10-Finger-Schreiben (Tastenflow)",
    );
    nurAlsBeschreibungErreichbar("Mit diesem Code melden sich die Kinder an");
  });

  it("„Hinzufügen“ (Lehrkräfte) trägt den Satz zu den vollen Rechten nur noch als Beschreibung", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    zeige(getClass(c.value.code)!, t.value, listPupils(c.value.code));
    const lehrkraefteKnopf = screen.getByRole("button", { name: /Lehrkräfte dieser Klasse/ });
    fireEvent.click(lehrkraefteKnopf);
    await screen.findByLabelText("Weitere Lehrkraft (E-Mail)");

    nurAlsBeschreibungErreichbar(
      "volle Rechte auf diese Klasse (Konten anlegen und verwalten, Fortschritt, Passwörter)",
    );
    // ★ „Hinzufügen“ gibt es zweimal auf der Seite (auch beim Kind anlegen) -
    // gesucht wird darum NUR im aufgeklappten Lehrkräfte-Bereich.
    // ★ 17.11.2026: Knopf und „Film ansehen" stehen in einer Zeile (`div`) im Bereich.
    const lehrkraefteBereich = lehrkraefteKnopf.closest("div")!.parentElement as HTMLElement;
    const knopf = within(lehrkraefteBereich).getByRole("button", { name: "Hinzufügen" });
    const id = knopf.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
  });
});
