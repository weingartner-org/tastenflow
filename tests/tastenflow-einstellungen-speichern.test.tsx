/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ WIRD JEDE EINSTELLUNG WIRKLICH GESPEICHERT? - die Messung
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 01.09.2026: *„hast du die Frage der Speicherung schon beantwortet?
 * Es gibt keinen Speichern-Schalter. Ich brauch auch keinen, aber bin unsicher,
 * ob wirklich jede Eingabe zuverlässig übernommen wird."*
 *
 * Auf diese Frage ist eine Antwort in Prosa nichts wert - „ja, das speichert
 * sofort" ist genau die Sorte Zusicherung, die man nicht nachprüfen kann
 * ([[feedback_zusammenfassung_ist_kein_beleg]]). Also wird sie GEMESSEN: Jede
 * einzelne Einstellung der aufgeklappten Zeile wird hier verstellt, und danach
 * wird der SPEICHER gelesen - nicht die Anzeige.
 *
 * ── Warum der Speicher und nicht die Anzeige ───────────────────────────────
 * Die Zeile zieht den geänderten Wert selbst nach („eine Einstellung tauscht
 * nie den Reiter aus"). Ein Feld, das den neuen Wert ANZEIGT, beweist deshalb
 * gar nichts - es könnte ihn nur im Bild halten, während der Server nie etwas
 * erfahren hat. Gelesen wird darum über `getAccount` aus dem Speicher, also von
 * genau der Stelle, aus der nach einem Neuladen wieder gelesen wird.
 *
 * ── ⚠️ Was dieser Wächter NICHT beweisen kann ─────────────────────────────
 * Er misst den Weg bis in den Speicher, nicht den Weg über das Netz zum
 * Server. Bricht die Verbindung, während eine Einstellung unterwegs ist, geht
 * sie verloren, und im Bild steht trotzdem der neue Wert - dieser Befund steht
 * in der Übergabe und ist offen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { startPoints, typingBackend } from "@/lib/typing";
import type { TypingAccount } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";
import { naechsteWocheKey } from "@/lib/typing/wochenziel";

/**
 * Eine Stufe aus `startPoints()`, die NICHT die erste ist - „Anfänger" ist die
 * Vorgabe, damit liesse sich kein Wechsel messen. Aus der Liste gelesen statt
 * fest hingeschrieben: Kommt eine Stufe dazu, bleibt der Fall gültig.
 */
const starts = () => startPoints("de", "de")[3].units;

let kinder: TypingAccount[];

beforeEach(() => {
  localStorage.clear();
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  kinder = listPupils(c.value.code);
});
afterEach(() => {
  cleanup();
  // ⚠️ Auch wenn ein Fall MITTENDRIN scheitert: Ein hängengebliebener
  // `confirm`-Ersatz beantwortet die Rückfragen der folgenden Fälle mit Nein -
  // die scheitern dann scheinbar aus eigenem Grund (gemessen 04.09.2026).
  vi.restoreAllMocks();
});

/**
 * Die Seite zeigen und die Zeile von Mia aufklappen.
 *
 * ★ E4 (18.09.2026): „Womit anfangen?", die Häkchen und das Wochenziel liegen
 * seither ZUSÄTZLICH hinter der eigenen Zeile „Einstellungen für Mia" (einem
 * `<details>`, zu bis geöffnet) - eine Ebene tiefer als vorher. Diese Funktion
 * klappt darum BEIDE auf. Der `<summary>` bekommt in jsdom keine eigene Rolle
 * („button" fehlt), darum über den sichtbaren Text geklickt.
 */
async function klappeAuf() {
  render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
  await screen.findByRole("table", { name: /Lernende der Klasse/ });
  const knopf = screen.getByRole("button", { name: /Einstellungen und Auswertung von Mia/i });
  await act(async () => {
    fireEvent.click(knopf);
  });
  fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));
}

/** Der Stand DIESES Kindes, frisch aus dem Speicher gelesen. */
function ausDemSpeicher() {
  const p = getAccount(kinder[0].id);
  if (!p) throw new Error("Konto nicht mehr im Speicher");
  return p;
}

/** Ein Auswahlfeld der aufgeklappten Zeile setzen und warten. */
async function waehle(beschriftung: RegExp, wert: string) {
  const feld = screen.getByLabelText(beschriftung);
  await act(async () => {
    fireEvent.change(feld, { target: { value: wert } });
  });
  return feld as HTMLSelectElement;
}

describe("★★★★★ Jede Einstellung landet SOFORT im Speicher - ohne Speichern-Knopf", () => {
  it("★★★★ GENAU EINE Stelle hat einen Speichern-Knopf - und das ist das Wochenziel", async () => {
    /*
      ════════════════════════════════════════════════════════════════════════
      DIE ANTWORT AUF JOHANNES' FRAGE, GEMESSEN
      ════════════════════════════════════════════════════════════════════════
      Die drei Einstellungen der Zeile („Womit anfangen?", Einhand, „Tempo
      zählt nicht") speichern SOFORT - das messen die Fälle darunter, einzeln,
      gegen den Speicher. ⚠️ Es waren bis zum 11.09.2026 sechs; Textstufe,
      Geburtsjahr und Sprache gelten seither der ganzen Klasse (B10).

      Das Wochenziel dieses einen Kindes ist die Ausnahme: Es hat einen Knopf
      „Speichern" (★ W3b, 18.09.2026: vorher „Ziel speichern" - der Text ist
      kürzer geworden, die Regel nicht), und vorher ist nichts gespeichert.
      Das ist kein Versehen, sondern liegt an der Sache - Minuten, die
      gewählten Kalenderwochen und „nachholen" gehören ZUSAMMEN, und die
      Änderung braucht ausserdem erst die Rückfrage im `Modal` („Übernehmen"/
      „Abbrechen"), bevor sie wirklich geschrieben wird.

      ⚠️ Dieser Fall hält beides fest: dass es SONST keinen solchen Knopf gibt,
      und dass es diesen einen gibt. Verschwindet er, ohne dass das Wochenziel
      von selbst speichert, fällt es hier auf.
    */
    await klappeAuf();
    const speichern = screen
      .queryAllByRole("button")
      .map((b) => (b.textContent || "").trim())
      .filter((t) => /speichern/i.test(t));
    expect(speichern).toEqual(["Speichern"]);
  });

  /*
    ★★★ B10 (11.09.2026): „Sprache", „Textstufe" und „Geburtsjahr" gibt es je
    KIND nicht mehr - sie gelten für die ganze Klasse („Einstellungen der
    Klasse", Wächter `tests/tastenflow-startniveau-klasse.test.tsx`). Was hier
    bleibt, ist die Frage von Johannes für die Einstellungen, die WIRKLICH je
    Kind gelten: Landen sie sofort im Speicher?
  */
  it("die drei Klassen-Einstellungen stehen nicht mehr je Kind", async () => {
    await klappeAuf();
    expect(screen.queryByLabelText(/^Sprache von Mia$/)).toBeNull();
    expect(screen.queryByLabelText(/Textstufe/i)).toBeNull();
    expect(screen.queryByLabelText(/Geburtsjahr/i)).toBeNull();
  });

  it(`★★ Vorkenntnisse - „Womit anfangen?"`, async () => {
    /*
      An dieser Stelle stand bis zum 01.09.2026 das TEMPO („Start-Niveau"). Es
      setzte gemessen nur noch die Anfangs-Leistungsstufe eines fabrikneuen
      Kontos und war nach sechs kalibrierten Runden wirkungslos - während das,
      was Lehrkräfte wirklich brauchten, gar nicht einstellbar war (Testerin:
      „Schüler können die Buchstaben, aber nicht die Ziffern").

      ⚠️ Gemessen wird gegen `startUnits` AM KONTO - nicht gegen den
      Fortschritt. Das ist der springende Punkt der Bauart: Die Lehrkraft darf
      den Lernstand nicht schreiben (Server-Regel `lw_progress.update`), sie
      trägt den Wunsch am Konto ein. Angewandt wird er beim nächsten Laden
      durch das Kind, und nur dazunehmend.
    */
    await klappeAuf();
    const feld = screen.getByLabelText(/^Womit Mia anfängt$/) as HTMLSelectElement;
    const zahlen = starts();
    await waehle(/^Womit Mia anfängt$/, String(zahlen));
    expect(ausDemSpeicher().startUnits).toBe(zahlen);
    expect(feld).toBeTruthy();
  });

  it("★★★★★ ZURÜCKSTUFEN: es wird gefragt - und erst nach dem Ja geschrieben", async () => {
    /*
      ════════════════════════════════════════════════════════════════════════
      Johannes, 04.09.2026: *„Lehrer dürfen ihre Schüler auch downgraden …
      hatten gerade das Problem mit dem Schüler Said, das Startlevel war zu
      hoch eingestellt."*
      ════════════════════════════════════════════════════════════════════════
      Bis dahin ging dieses Feld nur nach OBEN - ein zu hoch eingetragener
      Startpunkt war unumkehrbar. Der Grund für die alte Sperre besteht aber
      weiter: Ein Fehlgriff nähme einem Kind seinen Übungsstoff. Die Antwort
      darauf ist seither nicht mehr „geht nicht", sondern „nicht aus Versehen".

      ⚠️ Gemessen wird beides - dass gefragt wird UND dass ein Nein wirklich
         nichts schreibt. Eine Rückfrage, deren Antwort niemand auswertet, ist
         schlimmer als keine: Sie sieht nach Schutz aus.
    */
    await klappeAuf();
    const hoch = startPoints("de", "de")[3].units; // „Alle Buchstaben"
    const runter = startPoints("de", "de")[1].units; // „Grundstellung"
    await waehle(/^Womit Mia anfängt$/, String(hoch));
    expect(ausDemSpeicher().startUnits).toBe(hoch);

    const frage = vi.spyOn(window, "confirm").mockReturnValue(false);
    await waehle(/^Womit Mia anfängt$/, String(runter));
    expect(frage).toHaveBeenCalled();
    expect(ausDemSpeicher().startUnits).toBe(hoch); // Nein heisst nein

    frage.mockReturnValue(true);
    await waehle(/^Womit Mia anfängt$/, String(runter));
    expect(ausDemSpeicher().startUnits).toBe(runter);
    // Der Zeitstempel macht daraus den BESCHLUSS, den das Kind beim nächsten
    // Öffnen anwendet (`letters.startpunktAnwenden`). Ohne ihn bliebe es beim
    // alten „nur dazunehmen" - das Zurückstufen wäre still wieder ausgebaut.
    expect(ausDemSpeicher().startUnitsAt ?? 0).toBeGreaterThan(0);
    frage.mockRestore();
  });

  it("nach OBEN wird nicht gefragt - Vorkenntnisse sind keine Zumutung", async () => {
    await klappeAuf();
    const frage = vi.spyOn(window, "confirm").mockReturnValue(false);
    const hoch = startPoints("de", "de")[3].units;
    await waehle(/^Womit Mia anfängt$/, String(hoch));
    expect(frage).not.toHaveBeenCalled();
    expect(ausDemSpeicher().startUnits).toBe(hoch);
    frage.mockRestore();
  });

  it("Einhand schreiben (Häkchen)", async () => {
    await klappeAuf();
    const haken = screen.getByLabelText(/Einhand/i);
    await act(async () => {
      fireEvent.click(haken);
    });
    expect(ausDemSpeicher().oneHand).toBe(true);
  });

  it("Tempo zählt nicht (Häkchen)", async () => {
    await klappeAuf();
    const haken = screen.getByLabelText(/Tempo zählt nicht/i);
    await act(async () => {
      fireEvent.click(haken);
    });
    expect(ausDemSpeicher().noTimePressure).toBe(true);
  });

  /**
   * ★★★ E11 (18./19.09.2026): „Zeichenabstand groß (CVI)" - vier Werte, darum
   * ein Auswahlfeld statt eines Häkchens wie bei den Nachbarn oben.
   */
  it("Zeichenabstand groß (CVI) (Auswahlfeld)", async () => {
    await klappeAuf();
    await waehle(/^Zeichenabstand groß \(CVI\) für Mia$/, "3");
    expect(ausDemSpeicher().zeichenabstand).toBe(3);
  });

  /**
   * ★★★★★ Punkt 3 (Johannes 16.09.2026): „ich brauch als Lehrer die
   * Möglichkeit nicht erledigte Wochenziele zu löschen wenn jemand krank
   * war." Wie „Überfällige zurücksetzen" speichert das SOFORT, ohne eigenen
   * Knopf - ein Häkchen in der Wochenauswahl genügt.
   */
  it("Wochenziel erlassen - ein Häkchen speichert sofort, ein zweites nimmt es zurück", async () => {
    await klappeAuf();
    const knopf = screen.getByRole("button", { name: /Erlassene Wochen/i });
    await act(async () => {
      fireEvent.click(knopf);
    });
    const popup = screen.getByRole("group", { name: "Erlassene Wochen" });
    const [ersteWoche] = within(popup).getAllByRole("checkbox");
    await act(async () => {
      fireEvent.click(ersteWoche);
    });
    expect(ausDemSpeicher().goalExcusedWeeks).toHaveLength(1);

    await act(async () => {
      fireEvent.click(ersteWoche);
    });
    expect(ausDemSpeicher().goalExcusedWeeks).toHaveLength(0);
  });

  it("★★★ und alle zusammen überleben ein NEULADEN der Seite", async () => {
    /*
      Der eigentliche Beweis: Nach allen Einstellungen wird die Ansicht
      weggeworfen und neu aufgebaut - genau das, was beim Schliessen und
      Wiederöffnen des Browsers passiert. Was jetzt noch dasteht, ist
      gespeichert; was nur im Bild stand, ist weg.
    */
    await klappeAuf();
    await waehle(/^Womit Mia anfängt$/, String(starts()));
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Einhand/i));
    });

    cleanup();
    const frisch = listPupils(kinder[0].classCode ?? "");
    render(<TastenflowReiter pupils={frisch} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Einstellungen und Auswertung von Mia/i }));
    });
    fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));

    expect(
      (screen.getByLabelText(/^Womit Mia anfängt$/) as HTMLSelectElement).value,
    ).toBe(String(starts()));
    expect((screen.getByLabelText(/Einhand/i) as HTMLInputElement).checked).toBe(true);
  });
});

describe("★★★ Das Wochenziel der ganzen Klasse landet ebenfalls im Speicher", () => {
  /**
   * ★ W3b (18.09.2026): „Für alle übernehmen" heisst jetzt „Für die Klasse
   * übernehmen" und schreibt nur noch MINUTEN (keine Einheiten mehr) - über
   * `setKlassenWochenziel`, erst nach der Rückfrage im `Modal`
   * (`tests/tastenflow-wochenziel-einstellen.test.tsx` prüft deren genauen
   * Text; hier bleibt nur die Frage „landet es wirklich im Speicher?").
   */
  it(`„Für die Klasse übernehmen" schreibt Minuten an jedes Konto`, async () => {
    const cls = getClass(kinder[0].classCode ?? "")!;
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={cls.teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    // ★ E3 (18.09.2026): Der Bereich steht hinter dem Schalter „Wochenziel"
    // der Aufgaben-Zeile (vorher: hinter der eigenen `<summary>`) - erst
    // aufmachen.
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    });
    fireEvent.change(screen.getByLabelText("Minuten pro Woche"), {
      target: { value: "20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Für die Klasse übernehmen" }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });
    const p = ausDemSpeicher();
    expect(p.wochenzielVerlauf).toEqual([
      { ab: naechsteWocheKey(Date.now()), minuten: 20 },
    ]);
  });

  /**
   * ★★★★★ Befund 16.09.2026 (Johannes: „der Schalter Wochenziele für alle
   * übernehmen bewirkt nicht dass bei den Schülern die Wochenziele stehen").
   *
   * Das Formular steht beim Öffnen IMMER leer (nie aus einem Kind
   * vorbefüllt, solange die Klasse noch keine eigene Vorgabe hat) - ein Klick
   * ohne vorheriges Ausfüllen darf nichts schreiben. ★ W3b: 0 selbst ist ein
   * gültiger Wert („kein Wochenziel") - gesperrt ist der Knopf darum nur bei
   * einem LEEREN oder ungültigen Feld, nicht bei 0.
   */
  it(`„Für die Klasse übernehmen" ist gesperrt, solange kein gültiger Minutenwert eingetragen ist`, async () => {
    const cls = getClass(kinder[0].classCode ?? "")!;
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={cls.teacherId} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    });
    const knopf = screen.getByRole("button", { name: "Für die Klasse übernehmen" });
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    // Ein Klick auf den gesperrten Knopf darf NICHTS öffnen - auch keine
    // Rückfrage, sonst könnte ein „Übernehmen" versehentlich doch schreiben.
    fireEvent.click(knopf);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(ausDemSpeicher().wochenzielVerlauf ?? []).toEqual([]);

    // Erst NACH dem Ausfüllen ist er bedienbar.
    fireEvent.change(screen.getByLabelText("Minuten pro Woche"), {
      target: { value: "15" },
    });
    expect(
      screen.getByRole("button", { name: "Für die Klasse übernehmen" }).getAttribute("aria-disabled"),
    ).toBe("false");
  });

  /**
   * ★ Punkt 6 (Johannes 16.09.2026): „verschiebe die Ausklappleiste hinauf,
   * unterhalb der Tippchallenge." Vorher stand der Kasten erst NACH der
   * Jahreskarte der Klasse (`ClassOverview`, erkennbar an ihrem eigenen
   * Hilfetext „… das laufende Schuljahr, Gesamt und diese Woche …") - jetzt
   * davor. `SchreibprobeKasten` selbst braucht eine geladene Klasse (`cls`)
   * und rendert in diesem einfachen Testaufbau nicht - die Reihenfolge
   * gegenüber der Jahreskarte ist trotzdem genau das, was sich geändert hat.
   */
  it("steht vor der Jahreskarte der Klasse (vorher stand sie danach)", async () => {
    const { container } = render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    const text = container.textContent ?? "";
    const iWochenziel = text.indexOf("Wochenziel - Aufgabe");
    const iJahreskarte = text.indexOf("Schuljahr");
    expect(iWochenziel).toBeGreaterThanOrEqual(0);
    expect(iJahreskarte).toBeGreaterThan(iWochenziel);
  });
});

describe("★★ Der zugeklappte Wochenziel-Bereich verschweigt seinen Stand nicht", () => {
  it("die Zusammenfassung nennt das gesetzte Ziel, ohne dass man aufklappt", async () => {
    /*
      ★ E3 (18.09.2026): „Wochenziel" ist seither ein Schalter der
      Aufgaben-Zeile statt einer eigenen `<summary>` - der Stand steht seither
      DARIN, nicht mehr in einer Zusammenfassungs-Zeile daneben. Ein Schalter,
      der nur „Wochenziel" sagt, wäre eine versteckte Einstellung - man sucht
      sie nicht, weil man nicht weiss, dass es sie gibt.
    */
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    const schalter = screen.getByRole("button", { name: /^Wochenziel/ });
    expect(schalter.textContent).toMatch(/Min\.|kein Ziel/);
    // Und er ist wirklich zu.
    expect(schalter.getAttribute("aria-expanded")).toBe("false");
  });
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ GESPEICHERT WIRD AM SERVER - nicht im Browser
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 01.09.2026: *„gespeichert muss ja direkt am Server werden, nicht im
 * Browser! Und das jedesmal sofort."*
 *
 * ⚠️ Die Fälle weiter oben messen gegen den lokalen Speicher - in der
 * Testumgebung steht dort die Geräte-Fassung des Speichers. Das beweist, DASS
 * geschrieben wird, aber nicht, WOHIN. Diese Frage lässt sich nicht am
 * Speicherziel beantworten, sondern nur an der SCHNITTSTELLE:
 *
 *   Die Zeile ruft `typingBackend().setX(...)` - und `typingBackend()` liefert
 *   am Server-Betrieb die PocketBase-Fassung (`pbBackend.ts`), im Testlauf und
 *   ohne Anmeldung die Geräte-Fassung. Wird der Aufruf bei JEDER Änderung
 *   ausgelöst, geht die Einstellung im Betrieb also unmittelbar zum Server.
 *
 * ⇒ Gemessen wird hier der AUFRUF, nicht sein Ergebnis. Genau das ist die
 *   Zusicherung, die für beide Betriebsarten gilt.
 */
describe("★★★★★ Jede Änderung geht SOFORT an die Speicher-Schnittstelle", () => {
  it(`Vorkenntnisse, Einhand und „Tempo zählt nicht" rufen je einmal - ohne Zutun`, async () => {
    const backend = typingBackend();
    const setStartUnits = vi.spyOn(backend, "setStartUnits");
    const setOneHand = vi.spyOn(backend, "setOneHand");
    const setNoTime = vi.spyOn(backend, "setNoTimePressure");
    const setZeichenabstand = vi.spyOn(backend, "setZeichenabstand");

    await klappeAuf();
    await waehle(/^Womit Mia anfängt$/, String(starts()));
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Einhand/i));
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Tempo zählt nicht/i));
    });
    await waehle(/^Zeichenabstand groß \(CVI\) für Mia$/, "2");

    expect(setStartUnits).toHaveBeenCalledWith(kinder[0].id, starts());
    expect(setOneHand).toHaveBeenCalledWith(kinder[0].id, true);
    expect(setNoTime).toHaveBeenCalledWith(kinder[0].id, true);
    expect(setZeichenabstand).toHaveBeenCalledWith(kinder[0].id, 2);
    // ⚠️ Je EINMAL - nicht bei jedem Tastendruck und nicht zweimal.
    expect(setStartUnits).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });

  /*
    ★ B10 (11.09.2026): Der Fall „das Geburtsjahr geht beim Verlassen des
    Feldes hinaus" ist weg - das Feld gibt es je Kind nicht mehr. Der
    Backend-Weg `setGeburtsjahr` bleibt (selbstlernende Konten im Zahnrad);
    geprüft wird er dort, wo es ihn noch gibt.
  */
});
