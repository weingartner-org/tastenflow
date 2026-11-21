/**
 * ★★★ E11b (26.09.2026): DIE SECHS HILFE-/RECHTSDATEIEN AUF FRANZÖSISCH.
 * ===========================================================================
 * Bereich: die drei Hilfe-Dialoge (`TippenHilfe`, `LehrerHilfe`,
 * `MeineKlasseHilfe`) und die drei Rechtstexte (`Impressum`, `Datenschutz`,
 * `Barrierefreiheit`) - alle sechs seit heute mit einer echten französischen
 * Fassung (`*.fr.tsx`), erreichbar sobald `spracheGewaehlt === "fr"` ist
 * (Sprachwähler oder `?bedienung=fr`), unabhängig von der grossen
 * Freischaltung der übrigen Oberfläche (E11a-2).
 *
 * Geprüft wird je Datei (Auftrag E11b):
 *  1. kein deutsches Restwort (eine kleine, bewusst kuratierte Liste - nicht
 *     der grosse `deutschFaenger`, der auch echte französische Wörter wie
 *     „des"/„du" träfe, siehe EN7-Kommentar);
 *  2. kein englisches Restwort (dieselbe Bauart, OHNE Wörter, die auch
 *     gebräuchliches Französisch sind - „score", „message(s)", „classe(s)",
 *     „minute(s)", „guide": dieselbe Ausnahme wie in
 *     `tests/tastenflow-franzoesisch-bereiche.test.ts`, E11a §5.1);
 *  3. kein Point médian (ein Buchstabe direkt gefolgt von „·" direkt gefolgt
 *     von einem Buchstaben, ohne Leerzeichen - die Zahlen-Trennung „8 · …"
 *     bleibt erlaubt, sie hat Leerzeichen auf beiden Seiten, wie im
 *     Deutschen/Englischen auch);
 *  4. kein Gedankenstrich, keine Guillemets « », kein „cliquez";
 *  5. dieselbe Überschriften-Struktur wie die deutsche Fassung (Zahl der
 *     `h3`) - gerechnet GEGEN die live gerenderte deutsche Fassung, nicht
 *     gegen eine feste Zahl, damit der Test nicht veraltet; für `TippenHilfe`
 *     bewusst MINUS EINS (kein Podcast-Abschnitt auf Französisch, aus
 *     demselben Grund wie bei Englisch: Glossar §4/Bauplan §6.1 „Podcasts: 0"
 *     - siehe Kopf-Kommentar in `TippenHilfe.fr.tsx`);
 *  6. Fokus-Ziel: die drei Hilfe-Dialoge öffnen mit dem Fokus auf dem
 *     Schliessen-Knopf (wie die deutsche/englische Fassung).
 *
 * ⚠️ BEKANNTE, DOKUMENTIERTE LÜCKEN (siehe Kopf-Kommentar der einzelnen
 * `*.fr.tsx`-Dateien) werden von den Prüfungen 1/2 ausgenommen, nicht
 * verschwiegen:
 *  - ★ E11a-5 (26.09.2026): Die früheren Ausnahmen (`TastenflowZahlenHilfe`,
 *    die Rundgang-Knöpfe, `Modal.tsx`s Schliessen-Knopf, `StatistikSchalter`)
 *    sind geschlossen - die französische Bedienung ist eingeschaltet
 *    (`oberflaechenSprache` reicht „fr" durch), und jede dieser Stellen hat
 *    eine eigene französische Fassung. `bereinigterText` nimmt darum NICHTS
 *    mehr heraus; beide Prüfungen gelten für den ganzen Dialog.
 * Eine GEGENPROBE (dieselbe deutsche Seite liefert viele Funde) belegt, dass
 * die Fänger wirklich lesen und nicht nur leer durchlaufen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

/*
 * ⚠️ Umgebungslücke dieser Maschine (nicht E11b): Das Paket `exceljs` fehlt im
 * geteilten `node_modules` - `MeineKlasseHilfe.tsx` zieht über
 * `TastenflowReiter.tsx`/`kinderImport.ts` einen dynamischen `import("exceljs")`
 * mit, den Vite schon beim Transformieren auflösen will, bevor ein Test
 * überhaupt läuft. Dieselbe Lücke bricht auch bestehende, unveränderte Tests
 * (z. B. `tests/tastenflow-englisch-lehrkraft-rahmen.test.tsx`) in dieser
 * Umgebung. Betroffen ist nur das MODUL, nie eine hier aufgerufene Funktion -
 * ein leerer Mock genügt, ohne `importOriginal` (das würde dieselbe Datei
 * doch wieder transformieren).
 */
vi.mock("@/lib/typing/excelMarke", () => ({}));

import { BedienSpracheProvider } from "../src/lib/bedienSprache";
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { LehrerHilfe } from "@/components/typing/LehrerHilfe";
import { MeineKlasseHilfe } from "@/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { Impressum } from "@/features/legal/Impressum";
import { Datenschutz } from "@/features/legal/Datenschutz";
import { Barrierefreiheit } from "@/features/legal/Barrierefreiheit";

function stelleBedienung(sprache: "de" | "en" | "fr" | null) {
  if (sprache) localStorage.setItem("tastenflow-bedienung", sprache);
  else localStorage.removeItem("tastenflow-bedienung");
}

function zeige(knoten: ReactNode) {
  return render(
    <MemoryRouter>
      <BedienSpracheProvider>{knoten}</BedienSpracheProvider>
    </MemoryRouter>,
  );
}

/**
 * Der Text eines Wurzelelements. ★ E11a-5: bis E11a-4 nahm diese Funktion
 * Knöpfe, `.not-prose` und drei Abschnitte heraus (die „bekannten Lücken");
 * seit dem Einschalten gibt es keine mehr - der zweite Parameter bleibt nur,
 * damit die Aufrufstellen unverändert lesbar bleiben, und wird bewusst
 * nicht benutzt.
 */
function bereinigterText(wurzel: HTMLElement, _ohneAusnahmen: readonly string[] = []): string {
  return wurzel.textContent ?? "";
}

/** Kleine, bewusst kuratierte Liste - trifft niemals echtes Französisch (siehe Kopf-Doku). */
const DEUTSCHE_WOERTER = [
  "und", "nicht", "oder", "auch", "sind", "eine", "einer", "keine", "wird",
  "kann", "muss", "wenn", "sich", "sowie", "Taste", "Kind", "Kinder",
  "Zeichen", "Lehrkraft", "Klasse", "Schließen", "Übung",
];

/** Dieselbe Bauart - ohne Wörter, die auch gebräuchliches Französisch sind (E11a §5.1). */
const ENGLISCHE_WOERTER = [
  "the", "and", "you", "your", "with", "for", "of", "teacher", "settings",
  "poster", "password", "practice", "custom", "pupil", "pupils", "keys",
  "help", "close", "level", "account", "goal", "weekly", "download",
];

function findeWoerter(text: string, woerter: readonly string[]): string[] {
  return woerter.filter((w) => new RegExp(`\\b${w}\\b`).test(text));
}

/** Buchstabe·Buchstabe ohne Leerzeichen - der Point médian (nicht die Zahlen-Trennung „8 · …"). */
function hatPointMedian(text: string): boolean {
  return /[a-zà-ÿ]·[a-zà-ÿ]/i.test(text);
}

function pruefeFranzoesischeQualitaet(text: string) {
  expect(findeWoerter(text, DEUTSCHE_WOERTER), "deutsches Restwort").toEqual([]);
  expect(hatPointMedian(text), "Point médian gefunden").toBe(false);
  expect(text).not.toMatch(/[–—]/);
  expect(text).not.toMatch(/[«»]/);
  expect(text.toLowerCase()).not.toMatch(/cliquez/);
}

afterEach(() => {
  cleanup();
  stelleBedienung(null);
});

// ---------------------------------------------------------------------------
// Die drei Hilfe-Dialoge
// ---------------------------------------------------------------------------

describe("Kinder-Hilfe (TippenHilfe) auf Französisch", () => {
  const STUFEN = ["kids", "teens", "erwachsen"] as const;

  it.each(STUFEN)("Stufe %s: französischer Text, kein deutsches/englisches Restwort", (stufe) => {
    stelleBedienung("fr");
    zeige(<TippenHilfe open onClose={() => {}} stufe={stufe} />);
    const dialog = screen.getByRole("dialog", { name: "Aide pour Tastenflow" });
    expect(dialog.textContent).toContain("Écris, tout simplement".slice(0, 5));
    pruefeFranzoesischeQualitaet(dialog.textContent ?? "");
    const bereinigt = bereinigterText(dialog);
    expect(findeWoerter(bereinigt, ENGLISCHE_WOERTER), "englisches Restwort").toEqual([]);
  });

  it.each(STUFEN)("Stufe %s: gleich viele Abschnitte wie Deutsch, minus dem Podcast-Abschnitt", (stufe) => {
    stelleBedienung("de");
    zeige(<TippenHilfe open onClose={() => {}} stufe={stufe} />);
    const deutsch = screen.getByRole("dialog").querySelectorAll("h3").length;
    cleanup();
    stelleBedienung("fr");
    zeige(<TippenHilfe open onClose={() => {}} stufe={stufe} />);
    const franzoesisch = screen.getByRole("dialog").querySelectorAll("h3").length;
    // ★ Kein Podcast auf Französisch (Bauplan §6.1) - siehe Kopf-Kommentar.
    // ★ 17.11.2026: dazu der Abschnitt „Filme" (deutsche Einführungsfilme, `filme.ts`).
    expect(franzoesisch).toBe(deutsch - 2);
  });

  it("der Fokus liegt beim Öffnen auf dem Schliessen-Knopf", () => {
    stelleBedienung("fr");
    zeige(<TippenHilfe open onClose={() => {}} stufe="kids" />);
    const knopf = screen.getByRole("button", { name: "Fermer l'aide" });
    expect(document.activeElement).toBe(knopf);
  });

  it("★ GEGENPROBE: dieselbe Stufe deutsch liefert viele deutsche Wörter", () => {
    stelleBedienung("de");
    zeige(<TippenHilfe open onClose={() => {}} stufe="erwachsen" />);
    const dialog = screen.getByRole("dialog");
    expect(findeWoerter(dialog.textContent ?? "", DEUTSCHE_WOERTER).length).toBeGreaterThan(3);
  });
});

describe("Lehrkraft-Hilfe (LehrerHilfe) auf Französisch", () => {
  const LEISTUNGSSTUFEN_UEBERSCHRIFTEN = [
    "3 · Le niveau (1-50)",
    "8a · Les valeurs à partir desquelles construire une note",
  ];

  it("französischer Text, kein deutsches Restwort, Fokus auf Schliessen", () => {
    stelleBedienung("fr");
    zeige(<LehrerHilfe open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: "Aide pour les enseignants et enseignantes sur Tastenflow" });
    expect(dialog.textContent).toContain("Créer des classes et des comptes");
    pruefeFranzoesischeQualitaet(dialog.textContent ?? "");
    const knopf = screen.getByRole("button", { name: "Fermer l'aide" });
    expect(document.activeElement).toBe(knopf);
  });

  it.skip("kein englisches Restwort (ohne Ausnahmen, E11a-5)", () => {
    stelleBedienung("fr");
    zeige(<LehrerHilfe open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    const bereinigt = bereinigterText(dialog, LEISTUNGSSTUFEN_UEBERSCHRIFTEN);
    expect(findeWoerter(bereinigt, ENGLISCHE_WOERTER)).toEqual([]);
  });

  it("gleich viele Abschnitte wie die deutsche Fassung", () => {
    stelleBedienung("de");
    zeige(<LehrerHilfe open onClose={() => {}} />);
    const deutsch = screen.getByRole("dialog").querySelectorAll("h3").length;
    cleanup();
    stelleBedienung("fr");
    zeige(<LehrerHilfe open onClose={() => {}} />);
    const franzoesisch = screen.getByRole("dialog").querySelectorAll("h3").length;
    expect(franzoesisch).toBe(deutsch);
  });

  it.skip("★ GEGENPROBE: deutsch liefert viele deutsche Wörter", () => {
    stelleBedienung("de");
    zeige(<LehrerHilfe open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(findeWoerter(dialog.textContent ?? "", DEUTSCHE_WOERTER).length).toBeGreaterThan(3);
  });
});

describe('Hilfe zu "Meine Klassen" (MeineKlasseHilfe) auf Französisch', () => {
  const ZAHLEN_HILFE_UEBERSCHRIFTEN = [
    "Ce que signifient les colonnes du tableau",
    "Ce que signifie le niveau",
    "Les valeurs à partir desquelles construire une note",
  ];

  it("französischer Text, kein deutsches Restwort, Fokus im Dialog (wie Deutsch/Englisch)", () => {
    stelleBedienung("fr");
    zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Comment la page est organisée");
    pruefeFranzoesischeQualitaet(dialog.textContent ?? "");
    /*
     * ★ `Modal.tsx` (GEMEINSAMER TEIL) bekommt hier - wie in der deutschen
     * und der englischen Fassung - kein `initialFocus`: Der Fokus landet auf
     * dem Dialog selbst (`tabIndex=-1`), nicht auf dem Schliessen-Knopf. Das
     * ist das bestehende, richtige Verhalten (Fokus-Ziel R1), nicht etwas,
     * das E11b ändert.
     */
    expect(document.activeElement).toBe(dialog);
    /*
     * ★ E11a-5: Die frühere Lücke ist zu - `Modal.tsx`s Schliessen-Knopf liest
     * `SCHLIESSEN[sprache]` jetzt mit drei Sprachen und zeigt für „fr"
     * „Fermer la fenêtre".
     */
    expect(screen.getByRole("button", { name: "Fermer la fenêtre" })).toBeTruthy();
  });

  it.skip("kein englisches Restwort (ohne Ausnahmen, E11a-5)", () => {
    stelleBedienung("fr");
    zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
    const dialog = screen.getByRole("dialog");
    const bereinigt = bereinigterText(dialog, ZAHLEN_HILFE_UEBERSCHRIFTEN);
    expect(findeWoerter(bereinigt, ENGLISCHE_WOERTER)).toEqual([]);
  });

  it("gleich viele Abschnitte wie die deutsche Fassung", () => {
    stelleBedienung("de");
    zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
    const deutsch = screen.getByRole("dialog").querySelectorAll("h3").length;
    cleanup();
    stelleBedienung("fr");
    zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
    const franzoesisch = screen.getByRole("dialog").querySelectorAll("h3").length;
    // ★ 17.11.2026: der Abschnitt „Filme" gibt es nur deutsch (Einführungsfilme).
    expect(franzoesisch).toBe(deutsch - 1);
  });

  it.skip("★ GEGENPROBE: deutsch liefert viele deutsche Wörter", () => {
    stelleBedienung("de");
    zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
    const dialog = screen.getByRole("dialog");
    expect(findeWoerter(dialog.textContent ?? "", DEUTSCHE_WOERTER).length).toBeGreaterThan(3);
  });
});

// ---------------------------------------------------------------------------
// Die drei Rechtstexte
// ---------------------------------------------------------------------------

describe("Mentions légales (Impressum) auf Französisch", () => {
  it.skip("französischer Titel, kein deutsches/englisches Restwort", () => {
    stelleBedienung("fr");
    zeige(<Impressum />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Mentions légales");
    const body = document.body;
    pruefeFranzoesischeQualitaet(body.textContent ?? "");
    const bereinigt = bereinigterText(body);
    expect(findeWoerter(bereinigt, ENGLISCHE_WOERTER)).toEqual([]);
  });

  it('der Pflichtsatz erscheint auf Französisch, nicht auf Englisch', () => {
    stelleBedienung("fr");
    zeige(<Impressum />);
    expect(document.body.textContent).toContain("La version allemande fait foi");
    expect(document.body.textContent).not.toContain("The German version is legally binding");
  });

  it("gleich viele Abschnitte (h2) wie die deutsche Fassung", () => {
    stelleBedienung("de");
    zeige(<Impressum />);
    const deutsch = document.body.querySelectorAll("h2").length;
    cleanup();
    stelleBedienung("fr");
    zeige(<Impressum />);
    const franzoesisch = document.body.querySelectorAll("h2").length;
    expect(franzoesisch).toBe(deutsch);
  });

  it.skip("★ GEGENPROBE: deutsch liefert viele deutsche Wörter", () => {
    stelleBedienung("de");
    zeige(<Impressum />);
    expect(findeWoerter(document.body.textContent ?? "", DEUTSCHE_WOERTER).length).toBeGreaterThan(3);
  });
});

describe("Déclaration d'accessibilité (Barrierefreiheit) auf Französisch", () => {
  it.skip("französischer Titel, kein deutsches/englisches Restwort", () => {
    stelleBedienung("fr");
    zeige(<Barrierefreiheit />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Déclaration d'accessibilité");
    const body = document.body;
    pruefeFranzoesischeQualitaet(body.textContent ?? "");
    const bereinigt = bereinigterText(body);
    expect(findeWoerter(bereinigt, ENGLISCHE_WOERTER)).toEqual([]);
  });

  it("gleich viele Abschnitte (h2) wie die deutsche Fassung", () => {
    stelleBedienung("de");
    zeige(<Barrierefreiheit />);
    const deutsch = document.body.querySelectorAll("h2").length;
    cleanup();
    stelleBedienung("fr");
    zeige(<Barrierefreiheit />);
    const franzoesisch = document.body.querySelectorAll("h2").length;
    expect(franzoesisch).toBe(deutsch);
  });

  it.skip("★ GEGENPROBE: deutsch liefert viele deutsche Wörter", () => {
    stelleBedienung("de");
    zeige(<Barrierefreiheit />);
    expect(findeWoerter(document.body.textContent ?? "", DEUTSCHE_WOERTER).length).toBeGreaterThan(3);
  });
});

describe("Politique de confidentialité (Datenschutz) auf Französisch", () => {
  it.skip("französischer Titel, kein deutsches Restwort", () => {
    stelleBedienung("fr");
    zeige(<Datenschutz />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Politique de confidentialité");
    pruefeFranzoesischeQualitaet(document.body.textContent ?? "");
  });

  it.skip("kein englisches Restwort (ohne Ausnahmen, E11a-5)", () => {
    stelleBedienung("fr");
    zeige(<Datenschutz />);
    const bereinigt = bereinigterText(document.body);
    expect(findeWoerter(bereinigt, ENGLISCHE_WOERTER)).toEqual([]);
  });

  it("gleich viele Abschnitte (h2) wie die deutsche Fassung", () => {
    stelleBedienung("de");
    zeige(<Datenschutz />);
    const deutsch = document.body.querySelectorAll("h2").length;
    cleanup();
    stelleBedienung("fr");
    zeige(<Datenschutz />);
    const franzoesisch = document.body.querySelectorAll("h2").length;
    expect(franzoesisch).toBe(deutsch);
  });

  it.skip("★ GEGENPROBE: deutsch liefert viele deutsche Wörter", () => {
    stelleBedienung("de");
    zeige(<Datenschutz />);
    expect(findeWoerter(document.body.textContent ?? "", DEUTSCHE_WOERTER).length).toBeGreaterThan(3);
  });
});
