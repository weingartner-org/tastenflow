/**
 * ★★★★ WÄCHTER: Das Startniveau der ganzen Klasse (B8, Umbau 11.09.2026).
 *
 * Johannes wörtlich: *„In Ihrer Klasse sind 3 Kinder schon weiter als die
 * eingestellte Stufe - soll die ganze Klasse wirklich auf dieses Niveau
 * eingestuft werden?"* Und auf die Frage nach dem dritten Knopf: *„so ist es
 * gut, eine Möglichkeit mehr."*
 *
 * Geprüft wird genau das:
 *   · die Zahl der Kinder, die SCHON WEITER sind, wird gezählt und genannt;
 *   · der Dialog hat DREI Knöpfe;
 *   · „Alle einstufen" schreibt bei allen, „Nur die, die noch nicht so weit
 *     sind" nur bei den anderen;
 *   · „Abbrechen" ändert NICHTS;
 *   · ohne ein Kind, das weiter ist, erscheint gar keine Rückfrage.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { startPoints, typingBackend } from "@/lib/typing";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
  setStartUnits,
} from "@/lib/typing/account";

const STARTS = startPoints("de", "de");
/** Die zweitunterste Stufe - dorthin wird im Test eingestuft. */
const ZIEL = STARTS[1];
/** Eine deutlich höhere Stufe - „schon weiter". */
const HOCH = STARTS[4];

function baueKlasse(): { cls: TypingClass; teacherId: string; kinder: TypingAccount[] } {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Anna", "Ben", "Mia", "Tom"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return { cls: getClass(c.value.code)!, teacherId: t.value.id, kinder: listPupils(c.value.code) };
}

const startVon = (id: string) => getAccount(id)?.startUnits;

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

async function oeffne(cls: TypingClass, teacherId: string, kinder: TypingAccount[]) {
  render(
    <TastenflowReiter
      pupils={kinder}
      onChanged={() => {}}
      cls={cls}
      teacherId={teacherId}
    />,
  );
  await screen.findByRole("table", { name: /Lernende der Klasse/ });
  // ★ E3 (18.09.2026): „Einstellungen der Klasse" steht seither hinter einem
  // eigenen Schalter der Aufgaben-Zeile - alle Fälle dieser Datei brauchen
  // ihn offen, um die Felder darin zu erreichen.
  await userEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
}

describe("★★★ B8 - Startniveau für die ganze Klasse", () => {
  it("ohne ein Kind, das weiter ist, wird ohne Rückfrage gesetzt", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);

    const feld = screen.getByLabelText(/Startniveau für alle Kinder der Klasse/);
    await userEvent.selectOptions(feld, String(ZIEL.units));

    await waitFor(() => expect(startVon(kinder[0].id)).toBe(ZIEL.units));
    for (const k of kinder) expect(startVon(k.id)).toBe(ZIEL.units);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("★ auch die Stufe, auf der die meisten stehen, lässt sich wählen (Prüfbefund E3: toter Schalter)", async () => {
    // Frische Konten stehen alle auf der untersten Stufe - genau die nennt der
    // Platzhalter. Stand sie als WERT im Feld, feuerte ihre Wahl kein
    // `change`, und der Beschluss blieb aus. Jetzt ist jede Wahl eine Änderung.
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);

    const feld = screen.getByLabelText(/Startniveau für alle Kinder der Klasse/) as HTMLSelectElement;
    expect(feld.value).toBe("");
    expect(feld.options[0].textContent).toMatch(new RegExp(`die meisten stehen bei „${STARTS[0].label}"`));
    // Erkannt wird ein Beschluss am ZEITSTEMPEL, nicht am Wert (Regel vom
    // 04.09.2026) - genau deshalb muss auch die schon stehende Stufe wählbar sein.
    const stempelVorher = kinder.map((k) => getAccount(k.id)?.startUnitsAt ?? 0);

    await userEvent.selectOptions(feld, String(STARTS[0].units));

    await waitFor(() => expect(getAccount(kinder[0].id)?.startUnitsAt ?? 0).toBeGreaterThan(stempelVorher[0]));
    kinder.forEach((k, i) => {
      expect(startVon(k.id)).toBe(STARTS[0].units);
      expect(getAccount(k.id)?.startUnitsAt ?? 0).toBeGreaterThan(stempelVorher[i]);
    });
    // Danach steht wieder der Platzhalter - das Feld ist eine Handlung, kein Speicher.
    expect(feld.value).toBe("");
  });

  it("sind Kinder schon weiter, fragt die App - mit der Zahl und drei Knöpfen", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    // Zwei Kinder stehen deutlich weiter als das gewählte Ziel.
    setStartUnits(kinder[0].id, HOCH.units);
    setStartUnits(kinder[1].id, HOCH.units);
    await oeffne(cls, teacherId, listPupils(cls.code));

    const feld = screen.getByLabelText(/Startniveau für alle Kinder der Klasse/);
    await userEvent.selectOptions(feld, String(ZIEL.units));

    const dialog = await screen.findByRole("dialog");
    const text = (dialog.textContent || "").replace(/\s+/g, " ");
    expect(text).toMatch(/2 Kinder/);
    expect(text).toMatch(/schon weiter als die eingestellte Stufe/);
    expect(text).toMatch(/wirklich auf dieses Niveau eingestuft/);

    expect(screen.getByRole("button", { name: "Alle einstufen" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Nur die, die noch nicht so weit sind" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Abbrechen" })).toBeTruthy();
  });

  it(`„Abbrechen" ändert nichts - kein einziges Konto wird geschrieben`, async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    setStartUnits(kinder[0].id, HOCH.units);
    const vorher = kinder.map((k) => startVon(k.id));
    await oeffne(cls, teacherId, listPupils(cls.code));

    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(ZIEL.units),
    );
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Abbrechen" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(kinder.map((k) => startVon(k.id))).toEqual(vorher);
  });

  it(`„Alle einstufen" setzt ALLE - auch die, die schon weiter waren`, async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    setStartUnits(kinder[0].id, HOCH.units);
    await oeffne(cls, teacherId, listPupils(cls.code));

    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(ZIEL.units),
    );
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Alle einstufen" }));

    await waitFor(() => expect(startVon(kinder[0].id)).toBe(ZIEL.units));
    for (const k of kinder) expect(startVon(k.id)).toBe(ZIEL.units);
  });

  it(`„Nur die, die noch nicht so weit sind" lässt die Weiteren unberührt`, async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const weiter = kinder[0];
    setStartUnits(weiter.id, HOCH.units);
    await oeffne(cls, teacherId, listPupils(cls.code));

    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(ZIEL.units),
    );
    await screen.findByRole("dialog");
    await userEvent.click(
      screen.getByRole("button", { name: "Nur die, die noch nicht so weit sind" }),
    );

    await waitFor(() => expect(startVon(kinder[1].id)).toBe(ZIEL.units));
    // ⚠️ Das Kind, das weiter war, behält seinen Stand - niemandem wird etwas
    // weggenommen, was er schon hat.
    expect(startVon(weiter.id)).toBe(HOCH.units);
    for (const k of kinder.slice(1)) expect(startVon(k.id)).toBe(ZIEL.units);
  });
});

describe("★★★ B8 - die übrigen Klasseneinstellungen", () => {
  it(`Schulstufe 7 schreibt Stufe und Eintragsjahr und nennt „11-15 Jahre"`, async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);

    await userEvent.selectOptions(
      screen.getByLabelText(/Schulstufe der Klasse/),
      "7",
    );

    await waitFor(() => expect(getClass(cls.code)?.schulstufe).toBe(7));
    expect(getClass(cls.code)?.schulstufeSchuljahr).toBeGreaterThan(2000);
    // Der Satz daneben nennt die Altersspanne - erst nach dem Nachladen der
    // Klasse durch die Seite; im Test steht `cls` fest, darum prüfen wir den
    // gespeicherten Wert und den Satz der Vorgabe.
    expect(screen.getByText(/wächst mit jedem Schuljahr|Vorgabe:/)).toBeTruthy();
  });

  it("Sprache und Sperre gelten der Klasse, nicht einem Kind", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);

    // ⚠️ Exakt, nicht als Muster: Der Schloss-Knopf daneben heisst „Sprache
    // der Klasse 3b sperren" und passte auf dasselbe Muster.
    await userEvent.selectOptions(screen.getByLabelText("Sprache der Klasse 3b"), "en");
    await waitFor(() => expect(getClass(cls.code)?.lang).toBe("en"));

    await userEvent.click(screen.getByRole("button", { name: /Sprache der Klasse .* sperren/ }));
    await waitFor(() => expect(getClass(cls.code)?.langLocked).toBe(true));
  });

  it("das Klassenmatch ist vorgegeben erlaubt und lässt sich abschalten", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);

    const haken = screen.getByLabelText("Klassenmatch erlauben") as HTMLInputElement;
    expect(haken.checked).toBe(true);
    await userEvent.click(haken);
    await waitFor(() => expect(getClass(cls.code)?.klassenmatchAus).toBe(true));
  });
});

describe("★★★ B10 - je Kind bleibt nur, was wirklich je Kind gilt", () => {
  it(`keine Textstufe, kein Geburtsjahr, keine Sprache und kein „für alle" mehr`, async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await oeffne(cls, teacherId, kinder);

    await userEvent.click(
      screen.getByRole("button", { name: /Einstellungen und Auswertung von Anna ausklappen/ }),
    );
    // ★ E4 (18.09.2026): „Womit anfangen?" samt Häkchen liegt seither
    // zusätzlich hinter der eigenen Zeile „Einstellungen für Anna" - erst
    // öffnen (der `<summary>` hat in jsdom keine eigene Rolle, darum über
    // den sichtbaren Text).
    await userEvent.click(screen.getByText(/^Einstellungen für Anna\b/));

    expect(screen.queryByLabelText(/Textstufe von Anna/)).toBeNull();
    expect(screen.queryByLabelText(/Geburtsjahr von Anna/)).toBeNull();
    expect(screen.queryByLabelText(/Sprache von Anna/)).toBeNull();
    expect(
      screen.queryByRole("button", { name: /Diese Einstellungen für alle übernehmen/ }),
    ).toBeNull();
    // Geblieben: „Womit anfangen?", Einhand, Tempo zählt nicht.
    expect(screen.getByLabelText(/Womit Anna anfängt/)).toBeTruthy();
    expect(screen.getByLabelText(/Einhand schreiben für Anna/)).toBeTruthy();
    expect(screen.getByLabelText(/Tempo zählt nicht für Anna/)).toBeTruthy();
  });
});

/* Der Backend-Weg selbst - ohne Oberfläche, damit ein Fehler dort sofort
   sichtbar wird und nicht erst als merkwürdiges Verhalten der Seite. */
describe("★ setClassEinstellungen - ein Aufruf für alle vier Felder", () => {
  it("schreibt Schulstufe samt Eintragsjahr, Sprache und Sperre", async () => {
    const { cls, teacherId } = baueKlasse();
    const neu = await typingBackend().setClassEinstellungen(cls.code, teacherId, {
      schulstufe: 5,
      schulstufeSchuljahr: 2026,
      lang: "en",
      langLocked: true,
    });
    expect(neu?.schulstufe).toBe(5);
    expect(neu?.schulstufeSchuljahr).toBe(2026);
    expect(neu?.lang).toBe("en");
    expect(neu?.langLocked).toBe(true);
  });

  it("Schulstufe 0 löscht Stufe UND Eintragsjahr", async () => {
    const { cls, teacherId } = baueKlasse();
    await typingBackend().setClassEinstellungen(cls.code, teacherId, {
      schulstufe: 5,
      schulstufeSchuljahr: 2026,
    });
    const neu = await typingBackend().setClassEinstellungen(cls.code, teacherId, {
      schulstufe: 0,
    });
    expect(neu?.schulstufe).toBeUndefined();
    expect(neu?.schulstufeSchuljahr).toBeUndefined();
  });

  it("eine fremde Lehrkraft ändert nichts", async () => {
    const { cls } = baueKlasse();
    const neu = await typingBackend().setClassEinstellungen(cls.code, "fremd", {
      schulstufe: 9,
    });
    expect(neu).toBeNull();
    expect(getClass(cls.code)?.schulstufe).toBeUndefined();
  });
});
