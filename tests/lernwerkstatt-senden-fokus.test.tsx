/**
 * ★★★ WELLE 2 der Fokusziele: der Senden-Knopf und die Knöpfe in „Meine Klasse".
 *
 * Quelle: `Sensorik/FOKUSZIELE-TASTENFLOW.md`, Nachtrag §0.5 (Johannes,
 * 22.08.2026, 20:30). Dort steht wörtlich, was der Knopf „Senden" im
 * Nachrichten-Gespräch können muss - und dass die Grundmenge des
 * Disabled-Wächters um `src/components/lernwerkstatt/**` wächst. Diese Datei
 * ist der Gegenpart zu beidem.
 *
 * ── Warum gerade diese Flächen ─────────────────────────────────────────────
 * „Die Nachrichten und ‚Meine Klasse' sind für ein Kind mit Blindheit dieselbe
 * Fläche wie das Üben." Ein Knopf, der sich im Augenblick seiner Betätigung
 * selbst auf `disabled` setzt, wirft den Fokus auf `body`; die Braillezeile
 * steht im Nichts, ausgerechnet während auf den Server gewartet wird. Und ein
 * Knopf, der von Anfang an `disabled` ist, weil ein Feld noch leer ist, taucht
 * im Tab-Weg gar nicht erst auf: Wer den Bildschirm nicht sieht, sucht ihn und
 * hält das Fenster für kaputt.
 *
 * ── Wie hier gemessen wird ─────────────────────────────────────────────────
 * Geprüft wird, wo `document.activeElement` NACH der Betätigung wirklich
 * steht - nicht, ob im Quelltext irgendwo ein Fokus-Aufruf vorkommt. Fokus
 * wird im Haus grundsätzlich im nächsten Takt gesetzt (`setTimeout(0)`, nie
 * `requestAnimationFrame`, [[feedback_fokus_pflicht_alle_apps]]); darum wartet
 * jeder Test mit `waitFor`.
 *
 * Die Ansagen der gemeinsamen Bausteine laufen NICHT über `speakUi`, sondern
 * über eine höfliche Live-Region (`role="status"`) - die Begründung steht im
 * Kopf von `LwMessageThread.tsx`: Der Baustein gehört allen vier Programmen,
 * und nur Tastenflow bringt eine eigene Stimme mit. Darum wird hier auch keine
 * Sprachausgabe ersetzt, sondern der Text der Live-Region gelesen.
 *
 * ── Anrede ─────────────────────────────────────────────────────────────────
 * Das Nachrichten-Fenster benutzen beide Seiten; seine Ansagen sind darum
 * anrede-frei. Alles unter `klasse/**` sieht nur die Lehrkraft - dort gilt
 * „Sie" (K21).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { LwMessageThread } from "../src/components/lernwerkstatt/LwMessageThread";
import { LwClassMessageButton } from "../src/components/lernwerkstatt/LwTeacherCompose";
import { lwMessages } from "../src/lib/lernwerkstatt/messages";

const KLASSE = "5A3";

/** Die Spione dieser Datei - einzeln zurückgenommen, in `afterEach`. */
const spione: { mockRestore: () => void }[] = [];

/**
 * Das Nachrichten-Backend so verstellen, dass nichts an einen Server geht.
 * `senden` entscheidet, ob der Versand gelingt; wird eine Zusage (Promise)
 * übergeben, hängt der Versand so lange, wie der Test es will.
 */
function verstelleBackend(opts: {
  rolle: "teacher" | "pupil";
  senden: () => Promise<boolean>;
}) {
  const api = lwMessages();
  spione.push(
    vi.spyOn(api, "identity").mockReturnValue({
      id: opts.rolle === "teacher" ? "t1" : "p1",
      role: opts.rolle,
      name: opts.rolle === "teacher" ? "Frau Berger" : "Anna",
      classCode: KLASSE,
      teacherUid: "t1",
    }),
    vi.spyOn(api, "listForPupil").mockResolvedValue([]),
    vi.spyOn(api, "markRead").mockResolvedValue(undefined),
    vi.spyOn(api, "sendFromTeacher").mockImplementation(opts.senden),
    vi.spyOn(api, "sendFromPupil").mockImplementation(opts.senden),
  );
  return api;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  while (spione.length) spione.pop()!.mockRestore();
});

/** Das Gespräch aufbauen und warten, bis es geladen ist. */
async function zeigeGespraech(senden: () => Promise<boolean>, rolle: "teacher" | "pupil" = "pupil") {
  verstelleBackend({ rolle, senden });
  render(
    <LwMessageThread pupilUid="p1" pupilName="Anna" classCode={KLASSE} />,
  );
  const feld = (await screen.findByLabelText(
    "Nachricht schreiben",
  )) as HTMLTextAreaElement;
  const knopf = screen.getByRole("button", { name: "Senden" });
  return { feld, knopf };
}

describe("Nachrichten-Gespräch · »Senden« ist nie gesperrt (§0.5, R5)", () => {
  it("★ der Knopf ist zu KEINEM Zeitpunkt `disabled` - er bleibt im Tab-Weg", async () => {
    let freigeben: ((ok: boolean) => void) | null = null;
    const { feld, knopf } = await zeigeGespraech(
      () => new Promise<boolean>((auf) => (freigeben = auf)),
    );

    // 1. bei leerem Feld
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    // 2. mit Text im Feld
    fireEvent.change(feld, { target: { value: "Hallo" } });
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("false");

    // 3. WÄHREND gesendet wird - der heikelste Augenblick: Hier sperrte sich
    //    der Knopf früher selbst, und der Fokus fiel auf `body`.
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(knopf).not.toBeDisabled();
    expect(document.activeElement).toBe(knopf);
    expect(screen.getByRole("status").textContent).toBe("Wird gesendet …");

    await act(async () => {
      freigeben?.(true);
    });
  });

  it("★ leeres Feld: Ansage plus Fokus ins Antwortfeld - und nichts geht raus", async () => {
    const senden = vi.fn(async () => true);
    const { knopf } = await zeigeGespraech(senden);

    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(screen.getByRole("status").textContent).toBe(
      "Bitte erst eine Nachricht schreiben.",
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByLabelText("Nachricht schreiben"),
      ),
    );
    expect(senden).not.toHaveBeenCalled();
  });

  it("★ Erfolg: Feld leer, Fokus im Feld, Ansage »Gesendet.«", async () => {
    const { feld, knopf } = await zeigeGespraech(async () => true);

    fireEvent.change(feld, { target: { value: "Ich habe geübt." } });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(feld.value).toBe("");
    expect(screen.getByRole("status").textContent).toBe("Gesendet.");
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByLabelText("Nachricht schreiben"),
      ),
    );
    // Nach dem Senden ist das Feld wieder leer - der Knopf sagt das an, ohne
    // aus dem Tab-Weg zu fallen.
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");
  });

  it("★★ Fehlschlag: der Fokus bleibt auf dem Knopf, und der Fehler wird gemeldet", async () => {
    // ★ Vor dem 28.08.2026 tat dieser Zweig gar nichts: Der Versand scheiterte
    // still. Wer den Bildschirm nicht sieht, hielt die Nachricht für abgeschickt.
    const { feld, knopf } = await zeigeGespraech(async () => false);

    fireEvent.change(feld, { target: { value: "Ich habe geübt." } });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(document.activeElement).toBe(knopf);
    const meldung = screen.getByRole("alert");
    expect(meldung.textContent).toMatch(/nicht gesendet/);
    // Der Text bleibt stehen, sonst wäre er verloren.
    expect(feld.value).toBe("Ich habe geübt.");
    expect(knopf).not.toBeDisabled();
  });

  it("die Lehrkraft-Seite verhält sich genauso (derselbe Baustein)", async () => {
    const { feld, knopf } = await zeigeGespraech(async () => true, "teacher");
    fireEvent.change(feld, { target: { value: "Gut gemacht!" } });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(screen.getByRole("status").textContent).toBe("Gesendet.");
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByLabelText("Nachricht schreiben"),
      ),
    );
  });
});

describe("»Nachricht an die Klasse« · auch ohne Kinder auffindbar", () => {
  it("★ der Öffner ist bei leerer Klasse nicht gesperrt, sondern erklärt sich", async () => {
    render(<LwClassMessageButton classCode={KLASSE} pupils={[]} />);
    const knopf = screen.getByRole("button", { name: /Nachricht an die Klasse/ });
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    knopf.focus();
    fireEvent.click(knopf);

    expect(document.activeElement).toBe(knopf);
    expect(screen.getByRole("status").textContent).toMatch(/noch keine Lernenden/);
    // Es öffnet sich kein Fenster.
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("★ mit Kindern öffnet er das Fenster wie bisher", async () => {
    render(
      <LwClassMessageButton
        classCode={KLASSE}
        pupils={[{ id: "p1", name: "Anna" }]}
      />,
    );
    const knopf = screen.getByRole("button", { name: /Nachricht an die Klasse/ });
    expect(knopf.getAttribute("aria-disabled")).toBe("false");
    fireEvent.click(knopf);
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("★ »An alle senden« bleibt Tabstopp und sagt bei leerem Feld, was fehlt", async () => {
    verstelleBackend({ rolle: "teacher", senden: async () => true });
    render(
      <LwClassMessageButton
        classCode={KLASSE}
        pupils={[{ id: "p1", name: "Anna" }]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Nachricht an die Klasse/ }));
    const senden = await screen.findByRole("button", { name: "An alle senden" });
    expect(senden).not.toBeDisabled();

    senden.focus();
    await act(async () => {
      fireEvent.click(senden);
    });

    expect(
      screen
        .getAllByRole("status")
        .map((p) => p.textContent)
        .join(" "),
    ).toMatch(/Bitte erst eine Nachricht schreiben\./);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("Nachricht")),
    );
  });
});

/* ══ „Meine Klasse" ═══════════════════════════════════════════════════════════
 *
 * Ab hier sieht nur die LEHRKRAFT zu - Anrede „Sie" (K21). Geprüft wird für
 * jede der geheilten Stellen dasselbe Paar: Der Knopf bleibt im Tab-Weg (also
 * nicht `disabled`), und wer ihn betätigt, bekommt die Begründung gesagt,
 * statt vor einem stummen Element zu stehen.
 */
import { KlasseUndKinder } from "../src/components/lernwerkstatt/klasse/KlasseUndKinder";
import { ClassTeachers } from "../src/components/lernwerkstatt/klasse/ClassTeachers";
import { TastenflowReiter } from "../src/components/lernwerkstatt/klasse/TastenflowReiter";
import { typingBackend } from "../src/lib/typing";
import type { TypingAccount, TypingClass } from "../src/lib/typing";
import {
  addClassTeacher,
  addPupil,
  createClass,
  listPupils,
  registerTeacher,
} from "../src/lib/typing/account";

/** Lehrkraft + Klasse + zwei Kinder im lokalen Speicher. */
function baueKlasse(): {
  lehrkraft: TypingAccount;
  klasse: TypingClass;
  kinder: TypingAccount[];
} {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Mia", "Noah"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return { lehrkraft: t.value, klasse: c.value, kinder: listPupils(c.value.code) };
}

/** „Klasse & Kinder" mit einer fertigen Klasse zeigen. */
function zeigeKlasseUndKinder() {
  const { lehrkraft, klasse, kinder } = baueKlasse();
  render(
    <KlasseUndKinder
      teacher={lehrkraft}
      classes={[klasse]}
      cls={klasse}
      pupils={kinder}
      offeneProgramme={[]}
      einstiegsProgramm="tippen"
      onSelectClass={() => {}}
      onChanged={() => {}}
    />,
  );
  return { lehrkraft, klasse, kinder };
}

/** Der Text ALLER Live-Regionen der Seite, zusammengezogen. */
function angesagt(): string {
  return screen
    .getAllByRole("status")
    .map((p) => p.textContent ?? "")
    .join(" ");
}

describe("Meine Klasse · »Klasse & Kinder« - kein Knopf sperrt sich weg", () => {
  it("★ »Klasse anlegen« bleibt Tabstopp und führt in das leere Namensfeld", async () => {
    zeigeKlasseUndKinder();
    // ★ 11.09.2026 (Nacht): „Klasse anlegen" statt „Anlegen" - und ein Satz,
    // der ALLES nennt, was fehlt (Name, Code, Schulstufe, Startniveau).
    const knopf = screen.getByRole("button", { name: "Klasse anlegen" });
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(angesagt()).toMatch(
      /Zum Anlegen fehlt noch: der Klassenname, der Klassencode, die Schulstufe und das Startniveau\./,
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(
        document.getElementById("mk-class-name"),
      ),
    );
    expect(knopf).not.toBeDisabled();
  });

  it("★ »Hinzufügen« (Kind) sagt getrennt an, was fehlt: erst der Name, dann das Passwort", async () => {
    zeigeKlasseUndKinder();
    const knopf = screen.getByRole("button", { name: "Hinzufügen" });
    expect(knopf).not.toBeDisabled();

    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(angesagt()).toMatch(/Bitte geben Sie zuerst einen Namen ein\./);
    await waitFor(() =>
      expect(document.activeElement).toBe(
        document.getElementById("mk-pupil-name"),
      ),
    );

    // Name da, Passwort zu kurz - der Knopf bleibt trotzdem im Tab-Weg.
    fireEvent.change(document.getElementById("mk-pupil-name")!, {
      target: { value: "Lea" },
    });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(angesagt()).toMatch(/Das Passwort braucht mindestens 4 Zeichen\./);
    await waitFor(() =>
      expect(document.activeElement).toBe(document.getElementById("mk-pupil-pw")),
    );
    expect(knopf).not.toBeDisabled();

    /* ★★★ B11 (11.09.2026): DIE DRITTE SPERRE - das Geburtsjahr - IST WEG.
       Für ein Kind einer Klasse kommt die Textstufe seit dem Umbau aus der
       SCHULSTUFE der Klasse (`klassenEinstellungen.ts`); das Feld gibt es in
       diesem Formular nicht mehr, also auch keine Sperre und keinen
       Fokus-Weg dorthin. Geprüft wird stattdessen, dass es wirklich weg ist -
       sonst stünde eine Pflicht ohne Feld. */
    expect(document.getElementById("mk-pupil-jahr")).toBeNull();

    // Mit Name und gültigem Passwort legt der Knopf das Kind an - ohne
    // weitere Sperre.
    fireEvent.change(document.getElementById("mk-pupil-pw")!, {
      target: { value: "gehe" },
    });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(angesagt()).toMatch(/angelegt/);
    expect(knopf).not.toBeDisabled();
  });

  it("★ »Speichern« in der Klassen-Bearbeitung bleibt Tabstopp und nennt das leere Feld", async () => {
    zeigeKlasseUndKinder();
    fireEvent.click(screen.getByRole("button", { name: /Klasse bearbeiten/ }));
    const feld = document.getElementById("mk-edit-class-name") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "   " } });

    const knopf = screen.getByRole("button", { name: "Speichern" });
    expect(knopf).not.toBeDisabled();
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(angesagt()).toMatch(/Bitte geben Sie einen Klassennamen ein\./);
    await waitFor(() => expect(document.activeElement).toBe(feld));
  });

  it("★ das Häkchen »Programme dieser Klasse« zieht sich beim Speichern nicht weg", async () => {
    // Das Speichern wird angehalten, damit der heikle Augenblick messbar wird:
    // Frueher stand hier `disabled={busy}`, und das Haekchen fiel dabei aus
    // der Fokus-Ordnung.
    spione.push(
      vi
        .spyOn(typingBackend(), "setClassPrograms")
        .mockImplementation(() => new Promise(() => {})),
    );
    zeigeKlasseUndKinder();
    // ★ 11.09.2026 (Nacht): gezielt in „Programme dieser Klasse" - seit dem
    // vollständigen Anlege-Formular steht davor das Häkchen „Klassenmatch
    // erlauben" (jsdom blendet den Inhalt eines zugeklappten `<details>` nicht
    // aus), und das erste Häkchen der Seite wäre das falsche.
    const haken = within(
      screen.getByRole("group", { name: "Programme dieser Klasse" }),
    ).getAllByRole("checkbox")[0] as HTMLInputElement;
    haken.focus();
    await act(async () => {
      fireEvent.click(haken);
    });

    expect(haken).not.toBeDisabled();
    expect(haken.getAttribute("aria-disabled")).toBe("true");
    expect(document.activeElement).toBe(haken);

    // Ein zweiter Griff wird aufgehalten - aber nicht still verschluckt.
    await act(async () => {
      fireEvent.click(haken);
    });
    expect(angesagt()).toMatch(/Einen Augenblick - die Auswahl wird noch gespeichert\./);
    expect(document.activeElement).toBe(haken);
  });
});

describe("Meine Klasse · Lehrkräfte einer Klasse", () => {
  async function zeigeLehrkraefte() {
    const { lehrkraft, klasse } = baueKlasse();
    render(<ClassTeachers classCode={klasse.code} meId={lehrkraft.id} />);
    fireEvent.click(
      await screen.findByRole("button", { name: /Lehrkräfte dieser Klasse/ }),
    );
    return { lehrkraft, klasse };
  }

  it("★ »Hinzufügen« bleibt Tabstopp und führt ins leere E-Mail-Feld", async () => {
    const { klasse } = await zeigeLehrkraefte();
    const knopf = screen.getByRole("button", { name: "Hinzufügen" });
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(screen.getByRole("status").textContent).toMatch(
      /Bitte geben Sie zuerst die E-Mail-Adresse der Lehrkraft ein\./,
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(
        document.getElementById(`addteach-${klasse.code}`),
      ),
    );
  });

  it("★★ die höfliche Meldezeile steht schon VOR der Ansage im Baum", async () => {
    // ★ Befund der Abnahme (28.08.2026): Die Meldezeile dieser Datei stand
    // frueher NUR dann im Baum, wenn sie etwas zu sagen hatte. Eine hoefliche
    // Live-Region (`role="status"`, `aria-live="polite"`) meldet ihre
    // Aenderung aber nur, wenn sie VORHER schon da war - wird sie zugleich mit
    // ihrem Text eingehaengt, hoert in aller Regel niemand etwas. Genau die
    // beiden neuen Ansagen dieser Charge liefen darueber; die Heilung waere
    // hier also stumm geblieben.
    await zeigeLehrkraefte();
    const zeile = screen.getByRole("status");
    expect(zeile.textContent).toBe("");

    const knopf = screen.getByRole("button", { name: "Hinzufügen" });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    // DASSELBE Element traegt jetzt den Text - es ist nicht neu eingehaengt
    // worden. Genau darauf kommt es an.
    expect(screen.getByRole("status")).toBe(zeile);
    expect(zeile.textContent).toMatch(/Bitte geben Sie zuerst die E-Mail-Adresse/);
  });

  it("★ »Entfernen« bleibt Tabstopp, auch während der Server noch antwortet", async () => {
    // Eine zweite Lehrkraft, damit es überhaupt etwas zu entfernen gibt.
    const zweite = registerTeacher("Herr Klein", "klein@example.org", "geheim123");
    if (!zweite.ok) throw new Error(zweite.error);
    const { lehrkraft, klasse } = baueKlasse();
    const dazu = addClassTeacher(klasse.code, "klein@example.org", lehrkraft.id);
    if (!dazu.ok) throw new Error(dazu.error);

    // Der Server antwortet nicht - genau darum ging es: Frueher sperrte sich
    // der Knopf in diesem Augenblick selbst, und der Fokus fiel auf `body`.
    spione.push(
      vi
        .spyOn(typingBackend(), "removeTeacherFromClass")
        .mockImplementation(() => new Promise(() => {})),
      vi.spyOn(window, "confirm").mockReturnValue(true),
    );

    render(<ClassTeachers classCode={klasse.code} meId={lehrkraft.id} />);
    fireEvent.click(
      await screen.findByRole("button", { name: /Lehrkräfte dieser Klasse/ }),
    );
    const knopf = await screen.findByRole("button", { name: "Entfernen" });
    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");
    expect(document.activeElement).toBe(knopf);

    // Der zweite Griff wird aufgehalten - und angesagt.
    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(screen.getByRole("status").textContent).toMatch(/Wird gespeichert/);
  });
});

describe("Meine Klasse · Tastenflow-Reiter, Wochenziel »Speichern« (vorher »Ziel speichern«)", () => {
  it("★★ der Knopf bleibt Tabstopp und sagt an, wenn nichts geändert ist", async () => {
    const { kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          // Seit Layout A (01.09.2026) trägt der Pfeil eine sichtbare
          // Beschriftung und öffnet Einstellungen UND Auswertung.
          name: "Einstellungen und Auswertung von Mia ausklappen",
        }),
      );
    });
    // ★ E4 (18.09.2026): das Wochenziel liegt seither zusätzlich hinter der
    // eigenen Zeile „Einstellungen für Mia" - erst öffnen (der `<summary>`
    // hat in jsdom keine eigene Rolle, darum über den sichtbaren Text).
    fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));

    // ★ W3b (18.09.2026): der Knopf heisst jetzt „Speichern" (Minuten pro
    // Woche, erst nach einer Rückfrage) - das Verhalten ohne Änderung blieb.
    const knopf = screen.getByRole("button", { name: "Speichern" });
    // ★ Der heikelste Fall der Charge: Hier schnappte die Sperre AUSGERECHNET
    // NACH dem Speichern zu - genau dann, wenn der Fokus auf dem Knopf steht.
    expect(knopf).not.toBeDisabled();
    expect(knopf.getAttribute("aria-disabled")).toBe("true");

    knopf.focus();
    await act(async () => {
      fireEvent.click(knopf);
    });

    expect(document.activeElement).toBe(knopf);
    expect(angesagt()).toMatch(/Am Wochenziel ist nichts geändert/);
  });
});
