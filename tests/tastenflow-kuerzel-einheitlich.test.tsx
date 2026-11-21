/**
 * ★★ WÄCHTER: Tastenflow nach dem Auftrag „Kürzel einheitlich" (Johannes,
 * 18.10.2026: „die Tastenkürzel sollen möglichst einheitlich bei allen
 * Lern-Apps sein"). Die gemeinsame Grundlage bewacht `kuerzel-einheitlich.test.tsx`;
 * hier steht, was Tastenflow daraus macht.
 *
 *  (a) Alt + 0 = normale Größe des Tippfelds - das Gegenstück zu Alt + Plus / Minus.
 *  (b) Alt + Z gilt nach dem AUFGEDRUCKTEN Z der eingestellten Tastatur -
 *      QWERTZ (`KeyY`), QWERTY (`KeyZ`), AZERTY (`KeyW`). Alt + Y wirkt nicht
 *      mehr mit. Auf AZERTY wandert Alt + W mit (sonst läge es auf derselben Taste).
 *  (c) Kürzel-Liste (Alt + T) und Hilfe (Alt + H, „Wichtige Tasten") nennen
 *      DIESELBEN Tasten - in jeder Sprache der Bedienung.
 *  (d) Alt + N (Nachrichten) wirkt auch im Schreibfeld - die Liste verspricht
 *      „funktioniert auch direkt im Schreibfeld".
 *  (e) Am Mac heißt die Taste in Liste und Hilfe „Wahl" (in der Sprache: Option, Opción …).
 *
 * Die Taste kommt im Test bewusst mit einem `key`, der KEIN Buchstabe ist (so
 * meldet es der Mac: Wahl + Z ⇒ „Ω") - geprüft wird damit, dass die Seite den
 * Buchstaben aus ihrer eigenen Tastatur liest, nicht aus `e.key`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { SEITEN_TEXTE, TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { useTypingA11y } from "../src/lib/typing/a11y";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { LwMessageBell } from "../src/components/lernwerkstatt/LwMessageBell";
import { lwMessages } from "../src/lib/lernwerkstatt/messages";
import type { BedienSprache } from "../src/lib/bedienSprache";

/*
  it, pl, tr und cs sind hinter ihrem Schalter versteckt - der echte Anbieter
  fiele dort auf Deutsch zurück. Wie in `tastenflow-italienisch-alles.test.tsx`
  wird die Sprache darum für die Hilfe direkt gesetzt; `null` = der echte Anbieter.
*/
const bedien = vi.hoisted(() => ({ sprache: null as null | string }));
vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (bedien.sprache === null) return actual.useBedienSprache();
      return {
        sprache: bedien.sprache,
        spracheGewaehlt: bedien.sprache,
        setzeSprache: () => {},
        bereichAktiv: true,
        wechsle: () => {},
        beimSchalter: () => () => {},
        spracheOptionen: ["de", "en", "fr", "es", "it", "pl", "tr", "cs"],
      };
    },
  };
});

const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

const plattformVorher = Object.getOwnPropertyDescriptor(Navigator.prototype, "platform");
function alsMac(mac: boolean) {
  Object.defineProperty(navigator, "platform", { configurable: true, get: () => (mac ? "MacIntel" : "Win32") });
}

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  einrichtungFertigMerken();
  useTypingAuth.setState({ account: JANO });
  setLayout("de");
});

afterEach(() => {
  cleanup();
  bedien.sprache = null;
  vi.restoreAllMocks();
  delete (navigator as unknown as { platform?: string }).platform;
  if (plattformVorher) Object.defineProperty(Navigator.prototype, "platform", plattformVorher);
  localStorage.clear();
  setLayout("de");
});

function zeigeSeite() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

/** Zählt die Ansage-Ereignisse, die Alt + Z und Alt + W auslösen. */
function horche() {
  const zahl = { zeile: 0, aufgabe: 0 };
  const z = () => zahl.zeile++;
  const w = () => zahl.aufgabe++;
  window.addEventListener("tippen-announce-progress", z);
  window.addEventListener("tippen-announce-task", w);
  return {
    zahl,
    ende: () => {
      window.removeEventListener("tippen-announce-progress", z);
      window.removeEventListener("tippen-announce-task", w);
    },
  };
}

/** Alt + Taste wie am Mac: `key` ist ein Sonderzeichen, kein Buchstabe. */
function altMac(code: string) {
  fireEvent.keyDown(document.body, { code, key: "Ω", altKey: true });
}

// ---------------------------------------------------------------------------
describe("(a) Alt + 0 - normale Größe", () => {
  it("Alt + Plus zweimal, dann Alt + 0 ⇒ das Tippfeld steht wieder in der Grundgröße", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    useTypingA11y.getState().resetZoom();
    fireEvent.keyDown(document.body, { code: "Equal", key: "+", altKey: true });
    fireEvent.keyDown(document.body, { code: "Equal", key: "+", altKey: true });
    expect(useTypingA11y.getState().zoom).toBe(1.5);
    // Am Mac liefert Wahl + 0 ein „º" - erkannt wird über `e.code`.
    fireEvent.keyDown(document.body, { code: "Digit0", key: "º", altKey: true });
    // Grundgrösse 100 %, nicht die kleinste Stufe (seit 13.11.2026 gibt es kleinere).
    expect(useTypingA11y.getState().zoom).toBe(1);
  });

  it("auch direkt im Schreibfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const feld = document.querySelector<HTMLElement>('[data-typing-field="practice"]');
    expect(feld).not.toBeNull();
    useTypingA11y.getState().zoomIn();
    expect(useTypingA11y.getState().zoom).toBe(1.25);
    fireEvent.keyDown(feld!, { code: "Numpad0", key: "0", altKey: true });
    expect(useTypingA11y.getState().zoom).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe("(b) Alt + Z nach dem Aufdruck - Alt + Y wirkt nicht mehr", () => {
  const FAELLE: [LayoutId, string, string, string][] = [
    // Tastatur, Code der Z-Taste, Code der Y-Taste, Code der W-Taste
    ["de", "KeyY", "KeyZ", "KeyW"],
    ["ch", "KeyY", "KeyZ", "KeyW"],
    ["us", "KeyZ", "KeyY", "KeyW"],
    ["uk", "KeyZ", "KeyY", "KeyW"],
    ["fr", "KeyW", "KeyY", "KeyZ"],
    ["be", "KeyW", "KeyY", "KeyZ"],
  ];

  it.each(FAELLE)("%s: Z-Taste (%s) sagt die Zeile, Y-Taste (%s) nicht, W-Taste (%s) die Aufgabe", async (layout, zCode, yCode, wCode) => {
    setLayout(layout);
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const h = horche();
    try {
      altMac(zCode);
      expect(h.zahl).toEqual({ zeile: 1, aufgabe: 0 });
      altMac(yCode);
      expect(h.zahl, "Alt + Y darf nichts ansagen").toEqual({ zeile: 1, aufgabe: 0 });
      altMac(wCode);
      expect(h.zahl).toEqual({ zeile: 1, aufgabe: 1 });
    } finally {
      h.ende();
    }
  });

  it("Windows meldet den Buchstaben in e.key - auch dann zählt nur das Z", async () => {
    setLayout("de");
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const h = horche();
    try {
      fireEvent.keyDown(document.body, { code: "KeyY", key: "z", altKey: true });
      fireEvent.keyDown(document.body, { code: "KeyZ", key: "y", altKey: true });
      expect(h.zahl).toEqual({ zeile: 1, aufgabe: 0 });
    } finally {
      h.ende();
    }
  });
});

// ---------------------------------------------------------------------------
const SPRACHEN: BedienSprache[] = ["de", "en", "fr", "es", "it", "pl", "tr", "cs"];

/** „Alt + 7 / Alt + 8" ⇒ {Alt+7, Alt+8}; „Alt + + / -" ⇒ {Alt++, Alt+-}. */
function griffe(beschriftung: string): string[] {
  const teile = beschriftung.split(" / ").map((t) => t.replace(/\s+/g, ""));
  return teile.map((t, i) => (i > 0 && !t.includes("+") && teile[0].startsWith("Alt+") ? `Alt+${t}` : t));
}

function listenTasten(sprache: BedienSprache): string[] {
  const T = SEITEN_TEXTE[sprache];
  const alle = [...T.kurztastenVorher, ["Alt + L", ""], ...T.kurztastenNachher] as [string, string][];
  return [...new Set(alle.flatMap(([k]) => griffe(k)))].sort();
}

function hilfeTasten(): string[] {
  const zellen = [...document.querySelectorAll('li > span[class*="min-w-[8.5rem]"]')];
  return [...new Set(zellen.flatMap((z) => griffe(z.textContent ?? "")))].sort();
}

function zeigeHilfe(sprache: BedienSprache) {
  bedien.sprache = sprache;
  render(<TippenHilfe open onClose={() => {}} stufe="teens" />);
}

describe("(c) Kürzel-Liste und Hilfe nennen dieselben Tasten", () => {
  it.each(SPRACHEN)("%s", (sprache) => {
    zeigeHilfe(sprache);
    const hilfe = hilfeTasten();
    const liste = listenTasten(sprache);
    expect(hilfe.length).toBeGreaterThan(25);
    expect(hilfe).toEqual(liste);
  });

  it("die neuen Tasten stehen in beiden: Alt + 0, Melden, Alt + X, Umschalt zweimal", () => {
    const liste = listenTasten("de");
    for (const k of ["Alt+0", "Alt+Umschalt+P", "Alt+X", "UmschaltUmschalt", "Strg", "Alt+5"]) {
      expect(liste, k).toContain(k);
    }
  });

  it("die Hilfe nennt Alt + S „Meine Statistik\", nicht mehr „Abzeichen\"", () => {
    zeigeHilfe("de");
    const zeile = [...document.querySelectorAll("li")].find((li) =>
      li.querySelector('span[class*="min-w-[8.5rem]"]')?.textContent?.replace(/\s/g, "") === "Alt+S",
    );
    expect(zeile?.textContent).toContain("Meine Statistik (Lehrkräfte: Meine Klassen)");
    expect(zeile?.textContent).not.toMatch(/Abzeichen/);
  });

  it("Alt + 5 und Alt + X tragen ihre Bedingung im Text", () => {
    const T = SEITEN_TEXTE.de;
    const text = (k: string) => [...T.kurztastenVorher, ...T.kurztastenNachher].find(([t]) => t === k)?.[1] ?? "";
    expect(text("Alt + 5")).toMatch(/^Nur in „Tasten finden/);
    expect(text("Alt + X")).toMatch(/^Nur während einer Tippchallenge/);
  });
});

// ---------------------------------------------------------------------------
/** Ein Token, wie PocketBase es ausgibt - nur Ablaufdatum und Kennung zählen hier. */
function token(): string {
  const teil = (o: object) => btoa(JSON.stringify(o));
  return `${teil({ alg: "HS256", typ: "JWT" })}.${teil({
    id: "kind-elisa",
    type: "auth",
    collectionId: "tt_pupils_id",
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}.unterschrift`;
}

async function durchlaufen() {
  await act(async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve();
  });
}

describe("(d) Alt + N wirkt auch im Schreibfeld", () => {
  function zeigeGlocke(feldAttribute: Record<string, string>) {
    localStorage.setItem(
      "tt_pb_auth",
      JSON.stringify({
        token: token(),
        record: { id: "kind-elisa", collectionName: "tt_pupils", name: "Elisa", classCode: "3CS", teacherUid: "lehrkraft-1" },
      }),
    );
    vi.spyOn(lwMessages(), "loadInbox").mockImplementation(async () => []);
    render(
      <>
        <textarea aria-label="Schreibfeld" {...feldAttribute} />
        <LwMessageBell accountId="kind-elisa" ohneKnopf />
      </>,
    );
  }

  it("im Tippfeld (data-typing-field=\"practice\") öffnet Alt + N die Nachrichten", async () => {
    zeigeGlocke({ "data-typing-field": "practice" });
    await durchlaufen();
    const feld = screen.getByLabelText("Schreibfeld");
    feld.focus();
    fireEvent.keyDown(feld, { code: "KeyN", key: "˜", altKey: true });
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
  });

  it("in einem Feld mit data-kuerzel=\"an\" ebenso", async () => {
    zeigeGlocke({ "data-kuerzel": "an" });
    await durchlaufen();
    const feld = screen.getByLabelText("Schreibfeld");
    fireEvent.keyDown(feld, { code: "KeyN", key: "˜", altKey: true });
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
  });

  it("Gegenprobe: in einem gewöhnlichen Feld (Anmeldung, Suche) bleibt Alt + N still", async () => {
    zeigeGlocke({});
    await durchlaufen();
    const feld = screen.getByLabelText("Schreibfeld");
    fireEvent.keyDown(feld, { code: "KeyN", key: "˜", altKey: true });
    await durchlaufen();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
describe("(e) Am Mac heißt die Taste in Liste und Hilfe „Wahl\"", () => {
  it("Kürzel-Liste (Alt + T): „Wahl + O\" in Taste und Text, und der Wahl-Satz statt der Fußnote", async () => {
    alsMac(true);
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document.body, { code: "KeyT", key: "†", altKey: true });
    const tabelle = await waitFor(() => {
      const t = document.querySelector("table[data-kuerzelliste]");
      expect(t).not.toBeNull();
      return t as HTMLElement;
    });
    const tasten = [...tabelle.querySelectorAll("kbd")].map((k) => k.textContent ?? "");
    expect(tasten).toContain("Wahl + O");
    expect(tasten).toContain("Wahl + 0");
    expect(tasten).toContain("Wahl + Umschalt + P");
    expect(tasten.filter((t) => /\bAlt\b/.test(t))).toEqual([]);
    expect(within(tabelle).getByText(/noch einmal Wahl \+ 3/)).toBeInTheDocument();
    const fuss = tabelle.parentElement?.textContent ?? "";
    expect(fuss).toContain("Wahl ist die Wahltaste (⌥).");
    expect(fuss).not.toContain("Auf dem Mac:");
  });

  it("Gegenprobe Windows: „Alt + O\" und die Fußnote", async () => {
    alsMac(false);
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document.body, { code: "KeyT", key: "t", altKey: true });
    const tabelle = await waitFor(() => {
      const t = document.querySelector("table[data-kuerzelliste]");
      expect(t).not.toBeNull();
      return t as HTMLElement;
    });
    const tasten = [...tabelle.querySelectorAll("kbd")].map((k) => k.textContent ?? "");
    expect(tasten).toContain("Alt + O");
    expect(tabelle.parentElement?.textContent).toContain("Auf dem Mac: Wahltaste (⌥) + Taste.");
  });

  it.each([
    ["de", "Wahl"],
    ["en", "Option"],
    ["es", "Opción"],
    ["it", "Opzione"],
  ] as [BedienSprache, string][])("Hilfe %s: alle Alt-Tasten heißen „%s\"", (sprache, wort) => {
    alsMac(true);
    zeigeHilfe(sprache);
    const tasten = hilfeTasten();
    expect(tasten.filter((t) => t.startsWith("Alt+"))).toEqual([]);
    expect(tasten).toContain(`${wort}+O`);
    expect(tasten).toContain(`${wort}+0`);
  });
});
