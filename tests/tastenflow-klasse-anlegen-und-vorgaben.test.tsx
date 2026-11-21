/**
 * ★★★★ WÄCHTER: Eine Klasse vollständig anlegen · Startniveau als Vorgabe der
 * Klasse · Schulstufe „Erwachsen" (11.09.2026, Nacht).
 *
 * Johannes, wörtlich:
 *  · *„Alles was im Bereich ‚Einstellungen der Klasse' vorkommt muss beim
 *    Erstellen einer neuen Klasse abgefragt werden … Lass uns den Bereich neue
 *    Klasse anlegen zum Ausklappen machen und erst wenn alles ausgefüllt ist
 *    kann man Klasse erstellen."*
 *  · Auf die Frage, ob das Startniveau als Vorgabe an der Klasse gespeichert
 *    wird: *„Ja 1 aber auch die schulstufe soll der server für alle kinder
 *    vorab dort speichern (und es soll eine Schulstufe "Erwachsen" geben)"*.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · „Erwachsen" zählt wieder mit, oder eine 13 wird zu „Erwachsen" - rot.
 *  · Die Vorgabe der Klasse stuft ein Kind zurück, oder ein eigener neuerer
 *    Beschluss des Kindes wird von ihr überstimmt - rot.
 *  · Ein Kind, das SPÄTER beitritt, bekommt Schulstufe oder Startniveau nicht -
 *    rot (Punkt C des Auftrags: nachgeprüft, nicht angenommen).
 *  · „Klasse anlegen" wird `disabled`, legt mit fehlender Angabe an, oder
 *    schickt eine Einstellung nicht mit - rot.
 *  · Der Server lässt ein Feld still fallen und niemand sagt es - rot
 *    (nachgestellt mit einer Antwort ohne die Felder).
 *  · Die Nachricht an die Klasse bekommt die Kinder einer ANDEREN Klasse - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import {
  klasseFuer,
  useTypingAuth,
  vergissGeladeneKlasse,
} from "@/components/typing/useTypingAuth";
import { startPoints, type TypingAccount, type TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
  setStartUnits,
} from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";
import {
  SCHULSTUFE_ERWACHSEN,
  SCHULSTUFE_MAX,
  aktuelleSchulstufe,
  klassenAlter,
  klassenStufe,
  nichtGespeicherteEinstellungen,
  schuljahrStartjahr,
  schulstufeText,
  startpunktMitKlasse,
  type StartpunktWerte,
} from "@/lib/typing/klassenEinstellungen";
import { startpunktEinheiten, startpunktAnwenden } from "@/lib/typing/letters";

const V = startPoints("de", "de");
/** 15. September - sicher im Schuljahr, das in diesem Jahr beginnt. */
const september = (jahr: number) => new Date(jahr, 8, 15, 12, 0, 0).getTime();

function lehrkraft(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  vergissGeladeneKlasse();
  window.history.replaceState(null, "", "/");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ B · Schulstufe „Erwachsen\"", () => {
  it("ergibt die vorhandene Textstufe `erwachsen` und wächst NICHT mit", () => {
    const cls = { schulstufe: SCHULSTUFE_ERWACHSEN, schulstufeSchuljahr: 2026 };
    for (const jahr of [2026, 2027, 2031, 2040]) {
      expect(aktuelleSchulstufe(cls, september(jahr))).toBe(SCHULSTUFE_ERWACHSEN);
      expect(klassenStufe(cls, september(jahr))).toBe("erwachsen");
      // Kein erfundenes Alter im Satz neben dem Feld.
      expect(klassenAlter(cls, september(jahr))).toBeNull();
    }
    // Ohne Eintragsjahr genauso.
    expect(aktuelleSchulstufe({ schulstufe: SCHULSTUFE_ERWACHSEN }, september(2030))).toBe(
      SCHULSTUFE_ERWACHSEN,
    );
  });

  it("eine 13. Schulstufe zählt NIE zu „Erwachsen\" hoch - „Erwachsen\" wird nie zu einer Zahl", () => {
    const dreizehn = { schulstufe: 13, schulstufeSchuljahr: 2026 };
    const zwoelf = { schulstufe: 12, schulstufeSchuljahr: 2026 };
    for (const jahr of [2027, 2030, 2099]) {
      expect(aktuelleSchulstufe(dreizehn, september(jahr))).toBe(SCHULSTUFE_MAX);
      expect(aktuelleSchulstufe(zwoelf, september(jahr))).toBe(SCHULSTUFE_MAX);
    }
    // Die Textstufe einer 13. Schulstufe ist ohnehin schon erwachsen (19 Jahre).
    expect(klassenStufe(dreizehn, september(2026))).toBe("erwachsen");
    expect(schulstufeText(SCHULSTUFE_ERWACHSEN)).toBe("Erwachsen");
    expect(schulstufeText(13)).toBe("13. Schulstufe");
    expect(schulstufeText(null)).toBe("Schulstufe nicht gesetzt");
  });

  it("der Server-Weg liest 100 als „Erwachsen\" und nicht als „nicht gesetzt\"", async () => {
    const be = new PocketBaseTypingBackend();
    (be as unknown as { pb: unknown }).pb = {
      filter: (s: string) => s,
      collection: () => ({
        getFirstListItem: async () => ({
          id: "r1",
          code: "ERW",
          name: "Abendkurs",
          teacherUid: "t1",
          schulstufe: 100,
          startUnits: V[2].units,
          startUnitsAt: 1234,
        }),
      }),
    };
    const cls = await be.getClass("ERW");
    expect(cls?.schulstufe).toBe(SCHULSTUFE_ERWACHSEN);
    expect(cls?.startUnits).toBe(V[2].units);
    expect(cls?.startUnitsAt).toBe(1234);
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★★★ A · Das Startniveau der Klasse als Vorgabe", () => {
  it("ohne Vorgabe bleibt das Konto, wie es ist", () => {
    const konto = { startUnits: V[1].units };
    expect(startpunktMitKlasse(konto, null)).toBe(konto);
    expect(startpunktMitKlasse(konto, {})).toBe(konto);
  });

  it("ein Kind ohne eigenen Beschluss bekommt die Vorgabe - ohne einen Zeitstempel geschenkt zu bekommen", () => {
    const kind: StartpunktWerte = { startUnits: V[0].units };
    const k = startpunktMitKlasse(kind, { startUnits: V[3].units, startUnitsAt: 1000 });
    expect(k.startUnits).toBe(V[3].units);
    // ⚠️ Der Zeitstempel bleibt der des Kindes: Die Vorgabe darf dort nur als
    // Automatik ankommen, nie als Beschluss, der zurückstuft.
    expect(k.startUnitsAt).toBeUndefined();
  });

  it("ein Kind, das schon weiter steht, verliert nichts", () => {
    const k = startpunktMitKlasse(
      { startUnits: V[5].units, startUnitsAt: 500 },
      { startUnits: V[3].units, startUnitsAt: 1000 },
    );
    expect(k.startUnits).toBe(V[5].units);
  });

  it("ein eigener NEUERER Beschluss gilt - auch wenn er niedriger ist (so stuft „Alle einstufen\" zurück)", () => {
    expect(
      startpunktMitKlasse(
        { startUnits: V[0].units, startUnitsAt: 2000 },
        { startUnits: V[3].units, startUnitsAt: 1000 },
      ).startUnits,
    ).toBe(V[0].units);
    // Dieselbe Millisekunde: Die Kinder werden NACH der Klasse geschrieben.
    expect(
      startpunktMitKlasse(
        { startUnits: V[0].units, startUnitsAt: 1000 },
        { startUnits: V[3].units, startUnitsAt: 1000 },
      ).startUnits,
    ).toBe(V[0].units);
    // Ein ÄLTERER eigener Beschluss dagegen wird von der Vorgabe angehoben.
    expect(
      startpunktMitKlasse(
        { startUnits: V[0].units, startUnitsAt: 500 },
        { startUnits: V[3].units, startUnitsAt: 1000 },
      ).startUnits,
    ).toBe(V[3].units);
  });

  it("beim Kind kommt die Vorgabe als Automatik an: sie nimmt dazu und stuft nie zurück", () => {
    const kind: StartpunktWerte = { startUnits: V[0].units };
    const konto = startpunktMitKlasse(kind, { startUnits: V[2].units, startUnitsAt: 1000 });
    // Ein Kind bei „Anfänger" bekommt die Tasten der Vorgabe …
    const neu = startpunktAnwenden(startpunktEinheiten(V[0].units, "de"), konto.startUnits, konto.startUnitsAt, undefined, "de");
    expect(neu?.introduced).toEqual(expect.arrayContaining(startpunktEinheiten(V[2].units, "de")));
    // … ein Kind, das sich weit geübt hat, behält alles.
    const weit = startpunktAnwenden(startpunktEinheiten(V[5].units, "de"), konto.startUnits, konto.startUnitsAt, undefined, "de");
    expect(weit?.introduced ?? null).toBeNull();
  });

  it("„Einstellungen der Klasse\": die Wahl speichert die Vorgabe - und der Satz „nicht dauerhaft gespeichert\" ist weg", async () => {
    const t = lehrkraft();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    for (const name of ["Anna", "Ben"]) addPupil("3B", name, "pw1234");
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ E3 (18.09.2026): der Kasten steht hinter dem Schalter „Einstellungen
    // der Klasse" der Aufgaben-Zeile - erst öffnen.
    await userEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
    expect(screen.queryByText(/nicht dauerhaft gespeichert/)).toBeNull();
    expect(
      screen.getByText(/gilt für alle Kinder dieser Klasse, auch für die, die später beitreten/),
    ).toBeTruthy();

    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(V[2].units),
    );
    await waitFor(() => expect(getClass("3B")?.startUnits).toBe(V[2].units));
    expect(getClass("3B")?.startUnitsAt ?? 0).toBeGreaterThan(0);
    // Die vorhandenen Kinder bekommen ihren Beschluss wie bisher - NACH der Klasse.
    for (const k of listPupils("3B")) {
      expect(k.startUnits).toBe(V[2].units);
      expect(k.startUnitsAt ?? 0).toBeGreaterThanOrEqual(getClass("3B")!.startUnitsAt!);
    }
    // ★ Abnahme E3 (18.09.2026): Am Schalter stehen nur noch Schulstufe und
    // Sprache (die volle Zeile machte die Schalterreihe zweizeilig). Die
    // gespeicherte Vorgabe zeigt der geöffnete Kasten selbst - im Auswahlfeld.
    await waitFor(() =>
      expect(
        (screen.getByLabelText(/Startniveau für alle Kinder der Klasse/) as HTMLSelectElement)
          .textContent,
      ).toContain(`Vorgabe der Klasse: „${V[2].label}"`),
    );
  });

  it("„Nur die, die noch nicht so weit sind\": das weitere Kind behält seinen Stand, auch MIT der Vorgabe", async () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    const anna = addPupil("3B", "Anna", "pw1234");
    addPupil("3B", "Ben", "pw1234");
    if (!anna.ok) throw new Error(anna.error);
    setStartUnits(anna.value.id, V[5].units);
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(V[1].units),
    );
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Nur die, die noch nicht so weit sind" }));
    await waitFor(() => expect(getClass("3B")?.startUnits).toBe(V[1].units));
    const annaJetzt = getAccount(anna.value.id)!;
    expect(annaJetzt.startUnits).toBe(V[5].units);
    // ⚠️ Der eigentliche Prüfstein: auch nach der Regel der Klasse bleibt es dabei.
    expect(startpunktMitKlasse(annaJetzt, getClass("3B")).startUnits).toBe(V[5].units);
  });

  it("die Wahl „Erwachsen\" steht in den Einstellungen der Klasse und wird gespeichert", async () => {
    const t = lehrkraft();
    createClass(t.id, "Abendkurs", "ABEND");
    addPupil("ABEND", "Eva", "pw1234");
    render(
      <TastenflowReiter pupils={listPupils("ABEND")} onChanged={() => {}} cls={getClass("ABEND")} teacherId={t.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
    await userEvent.selectOptions(screen.getByLabelText("Schulstufe der Klasse Abendkurs"), "Erwachsen");
    await waitFor(() => expect(getClass("ABEND")?.schulstufe).toBe(SCHULSTUFE_ERWACHSEN));
    const knopf = screen.getByRole("button", { name: /^Einstellungen der Klasse/ });
    await waitFor(() => expect(knopf.textContent).toContain("Erwachsen"));
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ C · Schulstufe und Startniveau gelten auch für Kinder, die SPÄTER beitreten", () => {
  it("ein Kind, das nach dem Einrichten dazukommt, bekommt beim Anmelden die Werte der Klasse - im Kind steht nichts davon", async () => {
    const t = lehrkraft();
    const c = createClass(t.id, "Abendkurs", "ABEND", {
      schulstufe: SCHULSTUFE_ERWACHSEN,
      schulstufeSchuljahr: schuljahrStartjahr(),
      lang: "en",
      langLocked: true,
      startUnits: V[3].units,
    });
    if (!c.ok) throw new Error(c.error);
    // Beitritt NACH dem Einrichten, mit den Vorgaben des Kinder-Formulars.
    const spaet = addPupil("ABEND", "Spät", "pw1234");
    if (!spaet.ok) throw new Error(spaet.error);
    expect(spaet.value.startUnits).toBe(V[0].units);

    useTypingAuth.getState().login(spaet.value);
    await vi.waitFor(() => expect(useTypingAuth.getState().account?.stufe).toBe("erwachsen"));
    const acc = useTypingAuth.getState().account!;
    expect(acc.startUnits).toBe(V[3].units);
    expect(acc.lang).toBe("en");
    expect(acc.langLocked).toBe(true);
    // Gerechnet, nicht kopiert.
    expect(getAccount(spaet.value.id)?.startUnits).toBe(V[0].units);
    expect(getAccount(spaet.value.id)?.stufe).not.toBe("erwachsen");
  });

  it("`klasseFuer` holt die Klasse auch dann, wenn der Speicher sie noch nicht hat (das Rennen beim Laden des Fortschritts)", async () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B", { startUnits: V[2].units });
    const kind = addPupil("3B", "Mia", "pw1234");
    if (!kind.ok) throw new Error(kind.error);
    vergissGeladeneKlasse();
    const cls = await klasseFuer(kind.value);
    expect(cls?.startUnits).toBe(V[2].units);
    // Ein Konto ohne Klasse fragt gar nicht erst.
    expect(await klasseFuer(t)).toBeNull();
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★★ Punkt 3 · „Neue Klasse anlegen\" - zuklappbar, vollständig, nie `disabled`", () => {
  function zeige(classes: TypingClass[], teacher: TypingAccount) {
    const onSelectClass = vi.fn();
    render(
      <KlasseUndKinder
        teacher={teacher}
        classes={classes}
        cls={classes[0] ?? null}
        pupils={[]}
        offeneProgramme={[]}
        einstiegsProgramm="tippen"
        onSelectClass={onSelectClass}
        onChanged={() => {}}
      />,
    );
    return { onSelectClass };
  }
  const abschnitt = () =>
    screen.getByRole("heading", { name: "Neue Klasse anlegen" }).closest("details") as HTMLDetailsElement;

  it("ohne jede Klasse steht der Abschnitt offen - mit einer Klasse ist er beim Laden zu", () => {
    const t = lehrkraft();
    zeige([], t);
    expect(abschnitt().open).toBe(true);
    cleanup();
    const c = createClass(t.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    zeige([c.value], t);
    expect(abschnitt().open).toBe(false);
    // Die Zeile nennt, was darin steht.
    expect(abschnitt().querySelector("summary")?.textContent).toMatch(
      /Name, Klassencode, Programme/,
    );
  });

  it("★★ „Klasse anlegen\" bleibt Tabstopp; ein Satz nennt ALLES, was fehlt, der Fokus geht ins erste Fehlende - erst vollständig wird angelegt, mit ALLEN Einstellungen", async () => {
    const t = lehrkraft();
    const { onSelectClass } = zeige([], t);
    const knopf = screen.getByRole("button", { name: "Klasse anlegen" });
    expect(knopf.hasAttribute("disabled")).toBe(false);
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    // Die Angaben mit Vorgabe stehen sichtbar da.
    expect((screen.getByLabelText("Sprache der neuen Klasse") as HTMLSelectElement).value).toBe("de");
    expect((screen.getByLabelText("Klassenmatch erlauben") as HTMLInputElement).checked).toBe(true);
    // Pflicht: kein „nicht gesetzt" beim Anlegen.
    const schulstufe = screen.getByLabelText("Schulstufe der neuen Klasse") as HTMLSelectElement;
    expect([...schulstufe.options].map((o) => o.textContent)).not.toContain("nicht gesetzt");
    expect([...schulstufe.options].map((o) => o.textContent)).toContain("Erwachsen");

    fireEvent.change(screen.getByLabelText("Klassenname"), { target: { value: "3c" } });
    fireEvent.click(knopf);
    await waitFor(() => expect(document.activeElement).toBe(schulstufe));
    expect(document.body.textContent).toContain("Zum Anlegen fehlt noch: die Schulstufe und das Startniveau.");
    expect(getClass("3C")).toBeFalsy();

    fireEvent.change(schulstufe, { target: { value: "5" } });
    fireEvent.click(knopf);
    const start = screen.getByLabelText("Startniveau für alle Kinder der neuen Klasse");
    await waitFor(() => expect(document.activeElement).toBe(start));
    expect(document.body.textContent).toContain("Zum Anlegen fehlt noch: das Startniveau.");

    fireEvent.change(start, { target: { value: String(V[2].units) } });
    fireEvent.change(screen.getByLabelText("Sprache der neuen Klasse"), { target: { value: "en" } });
    fireEvent.click(screen.getByRole("button", { name: "Sprache der neuen Klasse sperren" }));
    fireEvent.click(screen.getByLabelText("Klassenmatch erlauben"));
    expect(knopf.getAttribute("aria-disabled")).toBe("false");
    fireEvent.click(knopf);

    await waitFor(() => expect(getClass("3C")).toBeTruthy());
    const neu = getClass("3C")!;
    expect(neu.schulstufe).toBe(5);
    expect(neu.schulstufeSchuljahr).toBe(schuljahrStartjahr());
    expect(neu.lang).toBe("en");
    expect(neu.langLocked).toBe(true);
    expect(neu.klassenmatchAus).toBe(true);
    expect(neu.startUnits).toBe(V[2].units);
    expect(neu.startUnitsAt ?? 0).toBeGreaterThan(0);
    expect(onSelectClass).toHaveBeenCalledWith("3C");
  });

  it("★★ lässt der Server Einstellungen still fallen, sagt ein sichtbarer Satz WAS - keine halb eingerichtete Klasse im Stillen", async () => {
    const t = lehrkraft();
    vi.spyOn(typingBackend(), "createClass").mockResolvedValue({
      ok: true,
      // Nachgestellt: ein Server, dessen Schema die neuen Felder nicht kennt.
      value: { code: "3C", name: "3c", teacherId: t.id, weeklyReport: false, createdAt: 1 },
    });
    zeige([], t);
    fireEvent.change(screen.getByLabelText("Klassenname"), { target: { value: "3c" } });
    fireEvent.change(screen.getByLabelText("Schulstufe der neuen Klasse"), { target: { value: "7" } });
    fireEvent.change(screen.getByLabelText("Startniveau für alle Kinder der neuen Klasse"), {
      target: { value: String(V[1].units) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Klasse anlegen" }));
    const meldung = await screen.findByRole("alert");
    expect(meldung.textContent).toContain("nicht gespeichert wurde: Schulstufe und Startniveau");
  });

  it("`nichtGespeicherteEinstellungen` vergleicht den WIRKSAMEN Wert", () => {
    const ohne: TypingClass = { code: "X", name: "x", teacherId: "t", createdAt: 0 };
    const gew = {
      schulstufe: 7,
      schulstufeSchuljahr: 2026,
      lang: "de" as const,
      langLocked: false,
      klassenmatchAus: false,
      startUnits: V[2].units,
    };
    // Deutsch, frei und erlaubt sind ohnehin die Vorgaben - dort ist nichts verloren.
    expect(nichtGespeicherteEinstellungen(gew, ohne)).toEqual(["Schulstufe", "Startniveau"]);
    expect(
      nichtGespeicherteEinstellungen({ ...gew, lang: "en", langLocked: true, klassenmatchAus: true }, ohne),
    ).toEqual(["Schulstufe", "Sprache", "Sprach-Sperre", "Startniveau", "Klassenmatch"]);
    expect(
      nichtGespeicherteEinstellungen(gew, { ...ohne, schulstufe: 7, startUnits: V[2].units }),
    ).toEqual([]);
  });

  it("der Server-Weg schickt alle Einstellungen IM SELBEN Aufruf wie das Anlegen", async () => {
    const be = new PocketBaseTypingBackend();
    const create = vi.fn(async (body: Record<string, unknown>) => ({ id: "r1", ...body }));
    (be as unknown as { pb: unknown }).pb = { collection: () => ({ create }) };
    const r = await be.createClass("t1", "3c", "3c", {
      schulstufe: SCHULSTUFE_ERWACHSEN,
      schulstufeSchuljahr: 2026,
      lang: "en",
      langLocked: true,
      klassenmatchAus: true,
      startUnits: V[2].units,
    });
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0]).toMatchObject({
      code: "3C",
      teacherUid: "t1",
      schulstufe: SCHULSTUFE_ERWACHSEN,
      schulstufeSchuljahr: 2026,
      lang: "en",
      langLocked: true,
      klassenmatchAus: true,
      startUnits: V[2].units,
    });
    expect(create.mock.calls[0][0].startUnitsAt).toEqual(expect.any(Number));
    expect(r.ok && r.value.startUnits).toBe(V[2].units);
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★ Punkt 2 · „Nachricht an die Klasse\" bekommt nie die Kinder einer ANDEREN Klasse", () => {
  it("passt die Kinderliste nicht zur gezeigten Klasse, ist die Liste leer - passt sie, ist der Knopf bereit", async () => {
    const t = lehrkraft();
    createClass(t.id, "3b", "3B");
    createClass(t.id, "4a", "4A");
    addPupil("3B", "Mia", "pw1234");
    // Nachgestellt: die Kinder von 3b, gezeigt wird aber 4a.
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("4A")} teacherId={t.id} />,
    );
    const falsch = await screen.findByRole("button", { name: "Nachricht an die Klasse" });
    expect(falsch.getAttribute("aria-disabled")).toBe("true");
    cleanup();

    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.id} />,
    );
    // ★ K3 (19.09.2026): die Kopfzeile des Klassenüberblicks.
    const karte = await screen.findByRole("heading", { level: 3, name: "Klassenüberblick" });
    const richtig = within(karte.parentElement as HTMLElement).getByRole("button", {
      name: "Nachricht an die Klasse",
    });
    expect(richtig.getAttribute("aria-disabled")).toBe("false");
  });
});
