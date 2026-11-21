/**
 * ★★ WÄCHTER: Die Tastenkürzel aller Lern-Apps - die gemeinsame Grundlage
 * (Johannes, 18.10.2026, nach dem Vergleich der Kürzel aller Lern-Apps).
 *
 *  (a) Am Mac heißt die Taste überall „Wahl" - erkannt am System
 *      (`lib/altTaste.ts`), auch in der Kopfzeile jeder App. `aria-keyshortcuts`
 *      bleibt der technische Name „Alt+X".
 *  (b) Alt + S ist überall „Meine Statistik": ein Kind kommt in seine
 *      Statistik, eine Lehrkraft nach „Meine Klassen" - behandelt in der
 *      Kopfzeile, wo eine App die Taste nicht selbst beansprucht.
 *  (c) Die gemeinsame Liste kennt Alt + 0 und das Melden.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppKopfzeile } from "../src/components/AppKopfzeile";
import { altAnzeige, ariaKuerzel, buchstabeDerTaste, istAltBuchstabe, istMacSystem } from "../src/lib/altTaste";
import { GEMEINSAME_KUERZEL, UNIVERSAL_SHORTCUTS, hoertAufWeiter, istNormalgroesseTaste } from "../src/lib/shortcuts";

const plattformVorher = Object.getOwnPropertyDescriptor(Navigator.prototype, "platform");
function alsMac(mac: boolean) {
  Object.defineProperty(navigator, "platform", { configurable: true, get: () => (mac ? "MacIntel" : "Win32") });
}
afterEach(() => {
  cleanup();
  delete (navigator as unknown as { platform?: string }).platform;
  if (plattformVorher) Object.defineProperty(Navigator.prototype, "platform", plattformVorher);
});

const kopf = (extra: Partial<Parameters<typeof AppKopfzeile>[0]> = {}) =>
  render(
    <MemoryRouter initialEntries={["/programme/probe"]}>
      <Routes>
        <Route
          path="/programme/probe"
          element={<AppKopfzeile titel="Probe" onHilfe={() => {}} onKurztasten={() => {}} {...extra} />}
        />
        <Route path="/meine-klasse/*" element={<p>Meine Klassen offen</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("(a) Am Mac heißt die Taste Wahl - überall", () => {
  it("altAnzeige: Mac ⇒ Wahl, sonst unverändert; aria bleibt Alt", () => {
    expect(altAnzeige("Alt + O", true)).toBe("Wahl + O");
    expect(altAnzeige("Klang und Vorlesen einstellen (Alt + V schaltet das Vorlesen)", true)).toContain("Wahl + V");
    expect(altAnzeige("Alt + O", false)).toBe("Alt + O");
    expect(ariaKuerzel("Wahl + O")).toBe("Alt+O");
    alsMac(true);
    expect(istMacSystem()).toBe(true);
    alsMac(false);
    expect(istMacSystem()).toBe(false);
  });

  it("die Kopfzeile schreibt am Mac Wahl an Hilfe, Liste und Einstellungen - aria-keyshortcuts bleibt Alt", () => {
    alsMac(true);
    kopf({ onEinstellungen: () => {} });
    const hilfe = screen.getByRole("button", { name: /Hilfe/ });
    expect(hilfe.getAttribute("aria-label")).toContain("Wahl + H");
    expect(hilfe).toHaveAttribute("aria-keyshortcuts", "Alt+H");
    expect(screen.getByRole("button", { name: /Einstellungen/ }).getAttribute("aria-label")).toContain("Wahl + O");
  });

  it("an Windows bleibt Alt", () => {
    alsMac(false);
    kopf();
    expect(screen.getByRole("button", { name: /Hilfe/ }).getAttribute("aria-label")).toContain("Alt + H");
  });
});

describe("(b) Alt + S - Meine Statistik in jeder App", () => {
  it("ein Kind: Alt + S öffnet die Statistik (derselbe Weg wie im Konto-Menü)", () => {
    const onStatistik = vi.fn();
    kopf({ onStatistik, account: { id: "k1", name: "Mia", istLehrkraft: false } as never });
    fireEvent.keyDown(document.body, { key: "ß", code: "KeyS", altKey: true });
    expect(onStatistik).toHaveBeenCalledTimes(1);
  });

  it("eine Lehrkraft: Alt + S führt nach Meine Klassen", () => {
    kopf({ klasseHref: "/meine-klasse/punktgenau", account: { id: "l1", name: "Frau B.", istLehrkraft: true } as never });
    fireEvent.keyDown(document.body, { key: "ß", code: "KeyS", altKey: true });
    expect(screen.getByText("Meine Klassen offen")).toBeInTheDocument();
  });

  it("beansprucht eine App Alt + S selbst, tritt die Kopfzeile zurück", () => {
    const onStatistik = vi.fn();
    kopf({ onStatistik, account: { id: "k1", name: "Mia", istLehrkraft: false } as never });
    const seite = (e: KeyboardEvent) => { if (e.code === "KeyS") e.preventDefault(); };
    document.addEventListener("keydown", seite);
    fireEvent.keyDown(document.body, { key: "ß", code: "KeyS", altKey: true });
    document.removeEventListener("keydown", seite);
    expect(onStatistik).not.toHaveBeenCalled();
  });
});

describe("(c) Die gemeinsame Liste", () => {
  it("kennt Alt + 0 und das Melden, und die Taste Alt + 0 wird über e.code erkannt", () => {
    const tasten = UNIVERSAL_SHORTCUTS.map(([k]) => k);
    expect(tasten).toContain("Alt + 0");
    expect(tasten).toContain("Alt + Umschalt + P");
    expect(istNormalgroesseTaste(new KeyboardEvent("keydown", { key: "º", code: "Digit0", altKey: true }))).toBe(true);
    expect(istNormalgroesseTaste(new KeyboardEvent("keydown", { key: "0", code: "Digit0" }))).toBe(false);
  });

  it("der gemeinsame Wortlaut nennt jede Taste genau einmal", () => {
    const tasten = Object.values(GEMEINSAME_KUERZEL).map(([k]) => k);
    expect(new Set(tasten).size).toBe(tasten.length);
  });
});

describe("(d) Alt + Z nach dem Aufdruck - Alt + Y wirkt nicht mehr mit", () => {
  const sprache = Object.getOwnPropertyDescriptor(Navigator.prototype, "language");
  const alsSprache = (l: string) => Object.defineProperty(navigator, "language", { configurable: true, get: () => l });
  afterEach(() => {
    delete (navigator as unknown as { language?: string }).language;
    if (sprache) Object.defineProperty(Navigator.prototype, "language", sprache);
  });
  const taste = (key: string, code: string) => new KeyboardEvent("keydown", { key, code, altKey: true });

  it("Windows: e.key entscheidet - Z ist Z, Y ist Y, auf jeder Belegung", () => {
    expect(istAltBuchstabe(taste("z", "KeyY"), "z")).toBe(true);  // deutsche Tastatur
    expect(istAltBuchstabe(taste("y", "KeyZ"), "z")).toBe(false); // deutsche Tastatur, Y gedrückt
    expect(istAltBuchstabe(taste("z", "KeyZ"), "z")).toBe(true);  // US-Tastatur
  });

  it("Mac ohne Buchstaben in e.key: deutsch ⇒ QWERTZ (Y und Z getauscht), sonst US", () => {
    alsSprache("de-AT");
    expect(buchstabeDerTaste(taste("Ω", "KeyY"))).toBe("z");
    expect(buchstabeDerTaste(taste("¥", "KeyZ"))).toBe("y");
    alsSprache("en-US");
    expect(buchstabeDerTaste(taste("Ω", "KeyZ"))).toBe("z");
  });
});

describe("(e) Zwei gemeinsame Fehler, gefunden beim Vereinheitlichen (18.10.2026)", () => {
  it("Alt + Umschalt + 0 ist NICHT die normale Größe - in »Im Griff« ist das Lernstoff (Excel AutoSumme)", () => {
    expect(istNormalgroesseTaste(new KeyboardEvent("keydown", { key: "=", code: "Digit0", altKey: true, shiftKey: true }))).toBe(false);
  });

  it("Alt + C führt auch am Mac weiter, wo die Wahltaste „ç\" liefert", () => {
    const weiter = vi.fn();
    const weg = hoertAufWeiter(weiter);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ç", code: "KeyC", altKey: true }));
    weg();
    expect(weiter).toHaveBeenCalledTimes(1);
  });
});
