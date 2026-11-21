/**
 * ★★★ DEUTSCH-FÄNGER FÜR DEN RAHMEN DES LEHRKRAFT-BEREICHS (EN6b, 19.09.2026).
 *
 * Bereich: „Meine Klassen" von Tastenflow OHNE die Klassenansicht selbst
 * (Tabelle, Klassenüberblick, Wochenziel, Einstellungen der Klasse - die
 * gehören EN6a und haben ihren eigenen Fänger):
 *  · der Seitenrahmen - Kopfzeile, Klassenkopf mit Klassenwahl, Umschalter
 *    „Lernstand | Kinder und Zugänge", Programm-Reiter, „Downloads", das
 *    Fenster „Tastenwege", die Seite für Nicht-Lehrkräfte;
 *  · „Kinder und Zugänge" - Erste Schritte, Klasse anlegen (samt „was fehlt"),
 *    Klasse bearbeiten, Kind hinzufügen, Passwort, Kontakt-E-Mail, Verschieben
 *    (samt Rückfrage), Co-Lehrkräfte, Excel-Import mit Vorschau;
 *  · der Kasten der Tippchallenge (Formular, eine vergangene Runde
 *    aufgeklappt, eine laufende Runde) und der Kasten „Eigene Übung" mit einer
 *    Reihe von zwei Übungen, „Meine Texte", „Vorlagen", Vorschau, Rückfrage;
 *  · die Hilfe zu „Meine Klassen", die Hilfe für Lehrkräfte, das
 *    Nachrichten-Fenster (Glocke, Posteingang, Gespräch, Nachricht an die
 *    Klasse) und die Anmeldung der Lernenden (eigenes Konto anlegen).
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`, der
 * ganze `<body>` - Fenster hängen als Portal dort) und an den Rückfragen
 * (`window.confirm`), die der Test abfängt.
 *
 * ★★ Ausgenommen, mit Grund:
 *  · `TastenflowZahlenHilfe` (die Spalten, die Leistungsstufe, die drei
 *    Werte) steht in beiden Hilfen - sie gehört EN6a und wird hier durch
 *    englische Platzhalter ersetzt; ihr eigener Fänger prüft sie.
 *  · Der Rundgang (Z4, eigene Dateien, eigene Texte) wird hier ersetzt - er
 *    öffnet sich sonst bei einer neuen Lehrkraft von selbst über die Seite.
 *  · Einzelne Tastenzeichen der DEUTSCHEN Tastatur (ä ö ü ß) sind kein Wort
 *    (wie in den anderen Fängern).
 *
 * ★★★ DIE GEGENPROBE: dieselben Zustände in der DEUTSCHEN Bedienung müssen
 * viele Funde liefern - ein Fänger, der nichts liest, wäre sonst genauso grün.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

vi.mock("@/components/typing/TastenflowZahlenHilfe", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/components/typing/TastenflowZahlenHilfe")>();
  return {
    ...echt,
    SpaltenHilfe: () => <p>(columns - EN6a)</p>,
    LeistungsstufeHilfe: () => <p>(difficulty level - EN6a)</p>,
    DreiWerteHilfe: () => <p>(three figures - EN6a)</p>,
  };
});

vi.mock("@/components/typing/Rundgang", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/components/typing/Rundgang")>();
  return {
    ...echt,
    RundgangMeineKlassen: () => null,
    RundgangMeineKlassenKnopf: () => null,
    RundgangLehrkraftKnoepfe: () => null,
  };
});

import { MeineKlassePage } from "../src/features/public/MeineKlassePage";
import { KlasseUndKinder } from "../src/components/lernwerkstatt/klasse/KlasseUndKinder";
import { SchreibprobeKasten } from "../src/components/lernwerkstatt/klasse/SchreibprobeKasten";
import { EigeneUebungKasten } from "../src/components/lernwerkstatt/klasse/EigeneUebungKasten";
import { MeineKlasseHilfe } from "../src/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { LehrerHilfe } from "../src/components/typing/LehrerHilfe";
import { LwMessageBell } from "../src/components/lernwerkstatt/LwMessageBell";
import { LwClassMessageButton } from "../src/components/lernwerkstatt/LwTeacherCompose";
import { TypingAuth } from "../src/components/typing/TypingAuth";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { AnnounceProvider } from "../src/lib/a11y";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
  setClassPrograms,
  type TypingAccount,
  type TypingClass,
} from "../src/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "../src/lib/typing/backend";
import { werteAus, type Probenergebnis } from "../src/lib/typing/schreibprobeAuswertung";
import { lwMessages, type LwConversation, type LwMessage } from "../src/lib/lernwerkstatt/messages";
import { BLATT_KINDER_EN, KOPF_PASSWORT_EN, KOPF_START_EN } from "../src/lib/lernwerkstatt/kinderImport";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache) {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode, adresse = "/meine-klasse?app=tippen") {
  // ⚠️ `MeineKlassePage` liest Klasse und Programm EINMAL aus `window.location`
  // (nicht aus dem Router) - darum steht die Adresse auch dort.
  window.history.replaceState(null, "", adresse);
  return render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={[adresse]}>
        <BedienSpracheProvider>{knoten}</BedienSpracheProvider>
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

/** Alle Rückfragen (`window.confirm`), die der Zustand gestellt hat. */
let rueckfragen: string[] = [];
/** Was `window.confirm` antwortet. */
let bestaetigen = false;

/** ★ Einzelne Tastenzeichen der DEUTSCHEN Tastatur (ä, ö, ü, ß) sind kein deutsches Wort. */
function nurTastenzeichen(fund: string): boolean {
  const woerter = fund.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
  return woerter.length > 0 && woerter.every((w) => [...w].length === 1);
}

/** Was der Fänger jetzt findet - DOM und Rückfragen. */
function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  for (const r of rueckfragen) {
    const f = pruefeText("Rückfrage", r);
    if (f) funde.add(f);
  }
  return [...funde].filter((f) => !nurTastenzeichen(f));
}

/** Frau Berger mit 3b (zwei Kinder) und 4a (leer) - Tastenflow UND Punktgenau in 3b. */
function baue(): { lehrkraft: TypingAccount; klasse: TypingClass; kinder: TypingAccount[] } {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  const d = createClass(t.value.id, "4a", "4A");
  if (!c.ok || !d.ok) throw new Error("Klasse");
  const a = addPupil("3B", "Mia", "pw1234");
  const b = addPupil("3B", "Jonas", "pw1234");
  if (!a.ok || !b.ok) throw new Error("Kind");
  return { lehrkraft: t.value, klasse: getClass("3B")!, kinder: [a.value, b.value] };
}

/** Ein Ergebnis der Tippchallenge (gewertet, mit Vorlesezeit und wackligen Tasten). */
function ergebnis(probeId: string, over: Partial<Parameters<typeof werteAus>[0]> = {}): Probenergebnis {
  const mal = (char: string, richtig: number, falsch: number) => [
    ...Array.from({ length: richtig }, () => ({ char, correct: true, ms: 200 })),
    ...Array.from({ length: falsch }, () => ({ char, correct: false })),
  ];
  return werteAus({
    probeId,
    niveau: "start",
    textNr: 0,
    textTitel: "Text",
    startZeile: 0,
    beginnMs: Date.now() - 3 * 86_400_000,
    endeMs: Date.now() - 3 * 86_400_000 + 600_000,
    zeitMs: 600_000,
    zuschlagProzent: 0,
    wartezeitMs: 42_000,
    zeichen: 1400,
    fehler: 23,
    zeilen: 41,
    schreibMs: 520_000,
    anschlaege: [...mal(" ", 20, 4), ...mal("k", 6, 2), ...mal("f", 30, 0)],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: true,
    ...over,
  });
}

/** Eine Excel-Datei mit englischen Spaltenköpfen (die englische Vorlage) - eine Zeile fehlerhaft. */
async function englischeDatei(): Promise<File> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Class 3b - Add pupils"],
      [],
      ["Name", KOPF_PASSWORT_EN, KOPF_START_EN, "Email (optional)"],
      ["Lena", "", "Home position", ""],
      ["Tom", "ab", "", ""],
      ["Mia", "", "", "not-an-address"],
    ]),
    BLATT_KINDER_EN,
  );
  const bytes = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new File([bytes], "pupils.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/** Das Nachrichten-Backend ohne Server (wie in `lernwerkstatt-senden-fokus.test.tsx`). */
const spione: { mockRestore: () => void }[] = [];
function nachricht(over: Partial<LwMessage>): LwMessage {
  return {
    id: "n1",
    pupilUid: "p1",
    teacherUid: "t1",
    classCode: "3B",
    senderRole: "pupil",
    body: "Hello!",
    fromName: "",
    pupilName: "Mia",
    subject: "",
    createdAt: Date.UTC(2026, 8, 19, 8, 35),
    readPupilAt: 0,
    readTeacherAt: 0,
    ...over,
  };
}
function verstelleNachrichten(rolle: "teacher" | "pupil") {
  const api = lwMessages();
  const verlauf = [
    nachricht({ id: "n1", senderRole: "teacher", body: "Well done this week!", subject: "Practice" }),
    nachricht({ id: "n2", senderRole: "pupil", body: "Thank you" }),
  ];
  const gespraech: LwConversation = {
    pupilUid: "p1",
    pupilName: "Mia",
    classCode: "3B",
    messages: verlauf,
    lastAt: verlauf[1].createdAt,
    unread: 1,
  };
  spione.push(
    vi.spyOn(api, "identity").mockReturnValue({
      id: rolle === "teacher" ? "t1" : "p1",
      role: rolle,
      name: rolle === "teacher" ? "Frau Berger" : "Mia",
      classCode: "3B",
      teacherUid: "t1",
    }),
    vi.spyOn(api, "loadInbox").mockResolvedValue([gespraech]),
    vi.spyOn(api, "listForPupil").mockResolvedValue(verlauf),
    vi.spyOn(api, "markRead").mockResolvedValue(undefined),
    vi.spyOn(api, "sendFromTeacher").mockResolvedValue(false),
    vi.spyOn(api, "sendFromPupil").mockResolvedValue(true),
  );
}

const LANG = { timeout: 8000 };

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  useTypingAuth.setState({ account: null });
  rueckfragen = [];
  bestaetigen = false;
  vi.stubGlobal("confirm", (satz: string) => {
    rueckfragen.push(satz);
    return bestaetigen;
  });
  vi.stubGlobal("open", () => null);
});
afterEach(() => {
  cleanup();
  useTypingAuth.setState({ account: null });
  while (spione.length) spione.pop()!.mockRestore();
  vi.unstubAllGlobals();
});

/** Einen Knopf (per Rolle und Name) drücken - im Takt von React. */
async function druecke(name: RegExp | string) {
  const knopf = screen.getByRole("button", { name });
  await act(async () => {
    fireEvent.click(knopf);
  });
  return knopf;
}

// ---------------------------------------------------------------------------
// Die Zustände - jeder in beiden Sprachen
// ---------------------------------------------------------------------------

interface Zustand {
  name: string;
  lauf: (sprache: BedienSprache) => Promise<void>;
  /** So viele Funde muss die GEGENPROBE (deutsch) mindestens liefern. */
  mindestensDe: number;
}

const W = { en: "Typing Challenge", de: "Tippchallenge" } as const;

const ZUSTAENDE: Zustand[] = [
  {
    name: "Seitenrahmen · Lernstand mit Klassenwahl, Reitern und leerer Klasse, dazu „Downloads“ und „Tastenwege“",
    mindestensDe: 12,
    lauf: async (sprache) => {
      const { lehrkraft } = baue();
      // Eine LEERE Klasse zeigt statt der Tabelle den Satz dieses Rahmens - die
      // Tabelle selbst ist EN6a (eigener Fänger).
      const leer = createClass(lehrkraft.id, "5c", "5C");
      if (!leer.ok) throw new Error(leer.error);
      setClassPrograms("5C", lehrkraft.id, ["tippen", "braille"]);
      useTypingAuth.setState({ account: lehrkraft });
      zeige(<MeineKlassePage />, "/meine-klasse?app=tippen&klasse=5C");
      await screen.findByText(sprache === "en" ? /There are no pupils/ : /noch keine Lernenden/, {}, LANG);
      // ★ 19.09.2026: „Handbücher"/„Guides" heisst in beiden Sprachen „Downloads".
      await druecke("Downloads");
      await screen.findByRole("dialog", {}, LANG);
    },
  },
  {
    name: "Seitenrahmen · das Fenster „Tastenwege“ (Alt + T)",
    mindestensDe: 6,
    lauf: async (sprache) => {
      const { lehrkraft } = baue();
      useTypingAuth.setState({ account: lehrkraft });
      zeige(<MeineKlassePage />);
      await screen.findByRole("combobox", { name: sprache === "en" ? "Change class" : "Klasse wechseln" }, LANG);
      await druecke(sprache === "en" ? /^Keyboard shortcuts - the full list/ : /^Kurztasten/);
      await screen.findByRole("dialog", { name: sprache === "en" ? "Keyboard shortcuts" : "Tastenwege" }, LANG);
    },
  },
  {
    name: "Seitenrahmen · ohne Lehrkonto",
    mindestensDe: 3,
    lauf: async () => {
      zeige(<MeineKlassePage />);
      await screen.findByRole("heading", { level: 1 }, LANG);
    },
  },
  {
    name: "Kinder und Zugänge · Erste Schritte, „Neue Klasse anlegen“ mit dem Satz, was fehlt",
    mindestensDe: 12,
    lauf: async (sprache) => {
      const t = registerTeacher("Herr Adam", "adam@example.org", "geheim123");
      if (!t.ok) throw new Error(t.error);
      useTypingAuth.setState({ account: t.value });
      zeige(<MeineKlassePage verwalten />, "/meine-klasse/verwalten?app=tippen");
      await screen.findByRole("heading", { name: sprache === "en" ? "Getting started" : "Erste Schritte" }, LANG);
      const form = document.getElementById("mk-class-name")!.closest("form")!;
      await act(async () => {
        fireEvent.submit(form);
      });
      await screen.findAllByText(sprache === "en" ? /^Still missing/ : /^Zum Anlegen fehlt/, {}, LANG);
    },
  },
  {
    name: "Kinder und Zugänge · Klasse bearbeiten, Kind: Passwort, Kontakt-E-Mail, Verschieben (samt Rückfrage), Co-Lehrkräfte",
    mindestensDe: 30,
    lauf: async (sprache) => {
      const { lehrkraft } = baue();
      useTypingAuth.setState({ account: lehrkraft });
      zeige(<MeineKlassePage verwalten />, "/meine-klasse/verwalten?app=tippen&klasse=3B");
      const en = sprache === "en";
      await screen.findByRole("heading", { name: en ? /^Learners/ : /^Lernende/ }, LANG);
      // Klasse bearbeiten, neuer Code ⇒ die Warnung für alle Lernenden.
      await druecke(en ? "Edit class" : "Klasse bearbeiten");
      fireEvent.change(document.getElementById("mk-edit-class-code")!, { target: { value: "3BX" } });
      // Co-Lehrkräfte aufklappen.
      await druecke(en ? /Teachers of this class/ : /Lehrkräfte dieser Klasse/);
      // Mia: Passwort, Kontakt-E-Mail, Verschieben.
      const zeile = screen
        .getAllByRole("listitem")
        .find((li) => li.textContent?.startsWith("Mia"))!;
      await act(async () => {
        fireEvent.click(within(zeile).getByRole("button", { name: en ? "Change password" : "Passwort ändern" }));
      });
      await act(async () => {
        fireEvent.click(within(zeile).getByRole("button", { name: en ? "Contact email: Mia" : "Kontakt-E-Mail: Mia" }));
      });
      fireEvent.change(within(zeile).getByLabelText(en ? /^Contact email for/ : /^Kontakt-E-Mail von/), {
        target: { value: "keine-adresse" },
      });
      await act(async () => {
        fireEvent.submit(within(zeile).getByLabelText(en ? /^Contact email for/ : /^Kontakt-E-Mail von/).closest("form")!);
      });
      await act(async () => {
        fireEvent.click(
          within(zeile).getByRole("button", { name: en ? "Move to another class: Mia" : "In andere Klasse verschieben: Mia" }),
        );
      });
      const ziel = within(zeile).getByLabelText(en ? "Class code of the new class" : "Klassencode der neuen Klasse");
      fireEvent.change(ziel, { target: { value: "4A" } });
      await act(async () => {
        fireEvent.submit(ziel.closest("form")!);
      });
      await waitFor(() => expect(rueckfragen.length).toBe(1));
      // Löschen fragt auch nach - Kind und Klasse.
      await act(async () => {
        fireEvent.click(within(zeile).getByRole("button", { name: en ? "Delete Mia" : "Mia löschen" }));
      });
      await druecke(en ? "Delete class" : "Klasse löschen");
      expect(rueckfragen.length).toBe(3);
    },
  },
  {
    name: "Kinder und Zugänge · „Neue Klasse anlegen“ offen, Excel-Import mit Vorschau",
    mindestensDe: 12,
    lauf: async (sprache) => {
      const { lehrkraft, klasse } = baue();
      render(
        <AnnounceProvider>
          <MemoryRouter>
            <BedienSpracheProvider>
              <KlasseUndKinder
                teacher={lehrkraft}
                classes={[klasse]}
                cls={klasse}
                pupils={listPupils(klasse.code)}
                offeneProgramme={[]}
                einstiegsProgramm="tippen"
                onSelectClass={() => {}}
                onChanged={() => {}}
              />
            </BedienSpracheProvider>
          </MemoryRouter>
        </AnnounceProvider>,
      );
      // Den zugeklappten Abschnitt öffnen (die Zeile nennt, was darin steht).
      const zeile = document.querySelector("summary")!;
      await act(async () => {
        fireEvent.click(zeile);
      });
      const datei = await englischeDatei();
      await act(async () => {
        fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [datei] } });
      });
      await screen.findByRole("heading", { name: sprache === "en" ? /^Preview/ : /^Vorschau/ }, LANG);
    },
  },
  {
    name: `${W.en} · Formular und eine vergangene Runde, aufgeklappt`,
    mindestensDe: 20,
    lauf: async (sprache) => {
      const { lehrkraft, klasse, kinder } = baue();
      await typingBackend().speichereProbenergebnis(kinder[0], ergebnis("sp-alt"));
      await typingBackend().speichereProbenergebnis(
        kinder[1],
        ergebnis("sp-alt", { zeichen: 60, fehler: 1, anschlaege: [] }),
      );
      render(
        <BedienSpracheProvider>
          <SchreibprobeKasten cls={klasse} pupils={listPupils(klasse.code)} onClassChange={() => {}} eingebettet />
        </BedienSpracheProvider>,
      );
      void lehrkraft;
      const kopf = await screen.findByRole("heading", { name: sprache === "en" ? /^Past/ : /^Vergangene/ }, LANG);
      const runde = kopf.parentElement!.querySelector<HTMLButtonElement>("button[aria-expanded]")!;
      // ★ L3: jede vergangene Runde steht ZU - ein Druck öffnet sie.
      expect(runde.getAttribute("aria-expanded")).toBe("false");
      await act(async () => {
        fireEvent.click(runde);
      });
      expect(runde.getAttribute("aria-expanded")).toBe("true");
      await screen.findByRole("table", {}, LANG);
      await screen.findAllByText(sprache === "en" ? /It starts with|It continues at/ : /Es kommt|Es geht weiter/, {}, LANG);
      // ★ E-1 (24.09.2026): englisch steht offen da, dass die eingebauten
      // Texte noch deutsch sind - deutsch steht dort nichts.
      const hinweis = document.querySelector('[data-testid="challenge-texte-noch-deutsch"]');
      if (sprache === "en") {
        expect(hinweis?.textContent).toMatch(/built-in texts are in German for now/);
        expect(hinweis?.textContent).toContain("Custom file");
      } else {
        expect(hinweis).toBeNull();
      }
    },
  },
  {
    name: `${W.en} · läuft (Bereit, Abgegeben, absagen) samt Rückfrage`,
    mindestensDe: 10,
    lauf: async (sprache) => {
      const { lehrkraft, klasse } = baue();
      const jetzt = Date.now();
      await typingBackend().setzeSchreibprobe(
        klasse.code,
        lehrkraft.id,
        {
          id: "sp-jetzt",
          niveau: "start",
          startMs: jetzt - 60_000,
          dauerMin: 10,
          textNr: 1,
          startZeile: 57,
          zuschlagProzent: 0,
          angelegtMs: jetzt - 60_000,
        },
        {},
      );
      render(
        <BedienSpracheProvider>
          <SchreibprobeKasten
            cls={getClass(klasse.code)!}
            pupils={listPupils(klasse.code)}
            onClassChange={() => {}}
            eingebettet
          />
        </BedienSpracheProvider>,
      );
      await screen.findAllByText(sprache === "en" ? /^Ready: 0 of 2/ : /^Bereit: 0 von 2/, {}, LANG);
      await druecke(sprache === "en" ? `Call off the ${W.en}` : `${W.de} absagen`);
      expect(rueckfragen.length).toBe(1);
    },
  },
  {
    name: "Eigene Übung · eine Reihe von zwei, „Beenden“ mit Rückfrage, „Meine Texte“, „Vorlagen“",
    mindestensDe: 14,
    lauf: async (sprache) => {
      const { lehrkraft, klasse } = baue();
      const b = typingBackend();
      const eins = await b.speichereEigenenText(klasse.code, lehrkraft.id, "autumn.txt", ["The leaves fall."]);
      const zwei = await b.speichereEigenenText(klasse.code, lehrkraft.id, "winter.txt", ["Snow is white."]);
      await b.starteEigeneUebung(klasse.code, lehrkraft.id, { textId: eins!, dateiname: "autumn.txt" });
      await b.starteEigeneUebung(klasse.code, lehrkraft.id, { textId: zwei!, dateiname: "winter.txt" });
      await b.speichereMeinenText(lehrkraft.id, "poem.txt", ["Roses are red."]);
      render(
        <BedienSpracheProvider>
          <EigeneUebungKasten
            cls={getClass(klasse.code)!}
            onClassChange={() => {}}
            eingebettet
            kinderFortschritt={[{ customTextProgress: {} }, { customTextProgress: {} }]}
          />
        </BedienSpracheProvider>,
      );
      const en = sprache === "en";
      await screen.findByRole("heading", { name: en ? "Running exercises, in order" : "Laufende Übungen, der Reihe nach" }, LANG);
      // ★ L4: „Eigene Übung:" steht vorn in der Zeile der drei Wege.
      const gruppe = screen.getByRole("group", { name: en ? "Where does the text come from?" : "Woher kommt der Text?" });
      expect(gruppe.parentElement!.textContent).toMatch(en ? /^Custom exercise:/ : /^Eigene Übung:/);
      await druecke(en ? "My texts" : "Meine Texte");
      await screen.findByText("poem.txt", {}, LANG);
      await druecke(en ? "Templates" : "Vorlagen");
      await druecke(en ? /^End “autumn.txt”/ : /^Beenden „autumn.txt"/);
      await screen.findByRole("dialog", {}, LANG);
    },
  },
  {
    name: "Eigene Übung · Datei hochgeladen: Vorschau mit Zeichen-Bericht, dazu eine abgelehnte Datei",
    mindestensDe: 6,
    lauf: async (sprache) => {
      const { klasse } = baue();
      render(
        <BedienSpracheProvider>
          <EigeneUebungKasten cls={klasse} onClassChange={() => {}} eingebettet />
        </BedienSpracheProvider>,
      );
      const feld = document.querySelector<HTMLInputElement>('input[type="file"]')!;
      await act(async () => {
        fireEvent.change(feld, {
          target: { files: [new File(["The fox – runs ☃ fast.\nSecond line."], "fox.txt", { type: "text/plain" })] },
        });
      });
      await screen.findByRole("button", { name: sprache === "en" ? "Start the custom exercise" : "Eigene Übung starten" }, LANG);
      render(
        <BedienSpracheProvider>
          <EigeneUebungKasten cls={klasse} onClassChange={() => {}} />
        </BedienSpracheProvider>,
      );
      const zweites = document.querySelectorAll<HTMLInputElement>('input[type="file"]')[1];
      await act(async () => {
        fireEvent.change(zweites, { target: { files: [new File(["x"], "fox.pdf")] } });
      });
      await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(2));
    },
  },
  {
    name: "Hilfe zu „Meine Klassen“ (Tastenflow offen)",
    mindestensDe: 25,
    lauf: async () => {
      zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
      await screen.findByRole("dialog", {}, LANG);
    },
  },
  {
    name: "Hilfe für Lehrkräfte",
    mindestensDe: 60,
    lauf: async () => {
      zeige(<LehrerHilfe open onClose={() => {}} />);
      await screen.findByRole("dialog", {}, LANG);
    },
  },
  {
    name: "Nachrichten · Glocke der Lehrkraft, Posteingang, Gespräch, Nachricht an die Klasse",
    mindestensDe: 10,
    lauf: async (sprache) => {
      verstelleNachrichten("teacher");
      const en = sprache === "en";
      zeige(
        <>
          <LwMessageBell accountId="t1" />
          <LwClassMessageButton classCode="3B" pupils={[{ id: "p1", name: "Mia" }]} />
        </>,
      );
      const glocke = await screen.findByRole("button", { name: en ? "Messages: 1 new" : "Nachrichten: 1 neu" }, LANG);
      await act(async () => {
        fireEvent.click(glocke);
      });
      const fenster = await screen.findByRole("dialog", {}, LANG);
      await act(async () => {
        fireEvent.click(within(fenster).getByRole("button", { name: /Mia/ }));
      });
      await screen.findByLabelText(en ? "Write a message" : "Nachricht schreiben", {}, LANG);
      fireEvent.change(screen.getByLabelText(en ? "Write a message" : "Nachricht schreiben"), {
        target: { value: "Well done!" },
      });
      await druecke(en ? "Send" : "Senden");
      // Der Versand scheitert (Spion) - die dringliche Zeile steht da.
      await waitFor(() =>
        expect(screen.getAllByRole("alert").some((a) => (a.textContent ?? "").length > 0)).toBe(true),
      );
    },
  },
  {
    name: "Nachrichten · Nachricht an die Klasse (Fenster) und das Gespräch des Kindes",
    mindestensDe: 6,
    lauf: async (sprache) => {
      verstelleNachrichten("pupil");
      const en = sprache === "en";
      zeige(<LwClassMessageButton classCode="3B" pupils={[{ id: "p1", name: "Mia" }]} />);
      await druecke(en ? /Message to the class/ : /Nachricht an die Klasse/);
      await screen.findByRole("dialog", {}, LANG);
      cleanup();
      zeige(<LwMessageBell accountId="p1" />);
      await screen.findByLabelText(en ? "Write a message" : "Nachricht schreiben", {}, LANG);
    },
  },
  {
    name: "Anmeldung der Lernenden · eigenes Konto anlegen, Geburtsjahr fehlt",
    mindestensDe: 10,
    lauf: async (sprache) => {
      const en = sprache === "en";
      zeige(<TypingAuth onCancel={() => {}} />, "/programme/tastenflow");
      const haekchen = screen.getByRole("checkbox", {
        name: en ? /I'm practising on my own/ : /Ich übe allein/,
      });
      await act(async () => {
        fireEvent.click(haekchen);
      });
      await druecke(en ? "Create account" : "Konto erstellen");
      await act(async () => {
        fireEvent.submit(document.getElementById("e-mail")!.closest("form")!);
      });
      await screen.findByLabelText(en ? "Where do you want to start?" : "Womit anfangen?", {}, LANG);
      await waitFor(() => expect(document.getElementById("e-jahr-fehler")).not.toBeNull());
    },
  },
];

// ---------------------------------------------------------------------------
// Die Prüfung
// ---------------------------------------------------------------------------

/** Alle Textknoten des Dokuments, MIT Lücke dazwischen (sonst kleben Wörter aneinander). */
function alleTexte(): string {
  const gang = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const teile: string[] = [];
  for (let n = gang.nextNode(); n; n = gang.nextNode()) teile.push(n.textContent ?? "");
  return teile.join(" ");
}

function melde(sprache: string, name: string, funde: string[]) {
  if (process.env.FAENGER_ZEIGEN) console.log(`${sprache} · ${name}: ${funde.length}\n${funde.join("\n")}`);
}

describe("★★★ EN6b: der Rahmen des Lehrkraft-Bereichs ist in der englischen Bedienung frei von Deutsch", () => {
  for (const z of ZUSTAENDE) {
    it(`EN · ${z.name}`, async () => {
      stelleBedienung("en");
      await z.lauf("en");
      const funde = fange();
      melde("EN", z.name, funde);
      if (process.env.FAENGER_TEXT) console.log(`=== ${z.name}\n${alleTexte().replace(/\s+/g, " ")}`);
      // Gegenprobe im selben Lauf: Es stand wirklich eine englische Seite da.
      const englisch = alleTexte().match(
        /\b(the|and|you|your|with|for|class|pupils?|password|email|teacher|Typing|Custom|messages?|Guides|write|send)\b/gi,
      );
      expect(englisch?.length ?? 0, "keine englische Bedienung im Dokument").toBeGreaterThanOrEqual(3);
      expect(funde, `Deutsch in der englischen Bedienung:\n${funde.join("\n")}`).toEqual([]);
    }, 30000);
  }
});

describe("★★★ GEGENPROBE: dieselben Zustände in der deutschen Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`DE · ${z.name}: der Fänger findet Deutsch`, async () => {
      stelleBedienung("de");
      await z.lauf("de");
      const funde = fange();
      melde("DE", z.name, funde);
      expect(funde.length, "Der Fänger liest nichts - dann misst er auch nichts").toBeGreaterThanOrEqual(
        z.mindestensDe,
      );
    }, 30000);
  }
});

describe("★ EN10: eine laufende Tippchallenge von EINER Minute", () => {
  /*
   * Im Browser gefunden: „Time limit 1 minutes per pupil". Englisch mit
   * Einzahl, Deutsch Zeichen für Zeichen wie vorher.
   */
  for (const sprache of ["en", "de"] as const) {
    it(`${sprache.toUpperCase()} · die Zeitangabe`, async () => {
      stelleBedienung(sprache);
      const { lehrkraft, klasse } = baue();
      const jetzt = Date.now();
      await typingBackend().setzeSchreibprobe(
        klasse.code,
        lehrkraft.id,
        {
          id: "sp-eine",
          niveau: "start",
          startMs: jetzt - 10_000,
          dauerMin: 1,
          textNr: 1,
          startZeile: 57,
          zuschlagProzent: 0,
          angelegtMs: jetzt - 10_000,
        },
        {},
      );
      render(
        <BedienSpracheProvider>
          <SchreibprobeKasten
            cls={getClass(klasse.code)!}
            pupils={listPupils(klasse.code)}
            onClassChange={() => {}}
            eingebettet
          />
        </BedienSpracheProvider>,
      );
      const zeit = await screen.findByText(
        sprache === "en" ? /minutes? per pupil/ : /Minuten je Kind/,
        {},
        LANG,
      );
      expect(zeit.textContent).toBe(
        sprache === "en"
          ? "1 minute per pupil, from their first keystroke"
          : "1 Minuten je Kind, ab dessen erstem Tastendruck",
      );
    }, 30000);
  }
});

describe("Englische Rückfragen und Dateien", () => {
  it("die Rückfrage beim Verschieben nennt die Folgen - englisch, mit „Typing Challenge“", async () => {
    stelleBedienung("en");
    await ZUSTAENDE[4].lauf("en");
    expect(rueckfragen[0]).toMatch(/^Move Mia to the class with the class code 4A\?/);
    expect(rueckfragen[0]).toContain("Typing Challenge results and messages stay with the previous class.");
    expect(rueckfragen[1]).toMatch(/^Delete “Mia”\? .*This can't be undone\.$/);
    expect(rueckfragen[2]).toMatch(/^Delete the class “3b”\? This also permanently deletes 2 pupils/);
  }, 30000);

  it("die englische Vorlage hat englische Blätter und Köpfe - und wird in BEIDEN Sprachen gelesen", async () => {
    const { vorlageAlsBytes, leseKinderXlsx, pruefeKinderZeilen, vorlageDateiname } = await import(
      "../src/lib/lernwerkstatt/kinderImport"
    );
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load((await vorlageAlsBytes({ name: "3b" }, { sprache: "en" })) as unknown as ArrayBuffer);
    expect(wb.worksheets.map((w) => w.name)).toEqual(["Pupils", "Notes", "Lists"]);
    const blatt = wb.getWorksheet("Pupils")!;
    expect([1, 2, 3, 4].map((k) => blatt.getCell(8, k).value)).toEqual([
      "Name",
      "Password",
      "Tastenflow: where to start?",
      "Email (optional)",
    ]);
    expect(vorlageDateiname("3b", Date.UTC(2026, 8, 19, 12), "en")).toBe("Pupil-template_3b_2026-09-19.xlsx");
    // Die englische Datei, deutsch gelesen: Kopf und Startniveau werden erkannt.
    blatt.getCell("A9").value = "Lena";
    blatt.getCell("C9").value = "Home position";
    const bytes = (await wb.xlsx.writeBuffer()) as ArrayBuffer;
    const gelesen = await leseKinderXlsx(bytes, "de");
    expect(gelesen.ok).toBe(true);
    if (!gelesen.ok) return;
    const plan = pruefeKinderZeilen(gelesen.zeilen, { lernweg: "de", vorhandeneNamen: [], sprache: "de" });
    expect(plan.abgelehnt).toEqual([]);
    expect(plan.anlegen[0].startLabel).toMatch(/^Grundstellung/);
  }, 30000);
});

describe("Deutsche Bedienung bleibt, wie sie war - mit Sprachschalter für die Lehrkraft", () => {
  it("„Meine Klassen“ in deutscher Bedienung: deutsch, kein `lang=\"de\"`, Schalter „EN - English“", async () => {
    stelleBedienung("de");
    const { lehrkraft } = baue();
    useTypingAuth.setState({ account: lehrkraft });
    zeige(<MeineKlassePage verwalten />, "/meine-klasse/verwalten?app=tippen&klasse=3B");
    expect(await screen.findByRole("heading", { name: /^Lernende/ }, LANG)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Kinder und Zugänge" })).toBeTruthy();
    expect(document.body.querySelector('[lang="de"]')).toBeNull();
    expect(screen.getByRole("button", { name: "EN - English" })).toBeTruthy();
  }, 30000);
});

describe("★ 28.09.2026: Sensorik links oben nur in der deutschen Bedienung (weingartner.org gibt es nur deutsch)", () => {
  for (const sprache of ["de", "en"] as const) {
    it(`${sprache.toUpperCase()} · Meine Klassen`, async () => {
      stelleBedienung(sprache);
      const { lehrkraft } = baue();
      useTypingAuth.setState({ account: lehrkraft });
      zeige(<MeineKlassePage />, "/meine-klasse?app=tippen");
      await screen.findAllByRole("heading", {}, LANG);
      const heim = screen.queryByRole("link", { name: /Sensorik Lernplattform|Sensorik learning platform/ });
      if (sprache === "de") expect(heim).not.toBeNull();
      else expect(heim).toBeNull();
    }, 30000);
  }
});
