/**
 * WÄCHTER des Feinschliffs S5/S6 (22.08.2026) - die vier Befunde des
 * Tiefentests, die man ohne Pin sofort wieder verliert.
 *
 * Alle vier hängen am Umbau auf drei Stufen und sind erst dort entstanden:
 *
 * 1. **Die Hilfe folgt der Stufe - auch ohne Anmeldung.** Gäste bekamen bis
 *    22.08. immer die Erwachsenen-Fassung („Sie"), obwohl die Einrichtung sie
 *    nach der Stufe FRAGT und der Rest der Seite ihrer Wahl folgt (K34: zwei
 *    Sichten, zwei Wahrheiten). Verloren geht dabei nichts - die Hilfe
 *    verzweigt nur auf `=== 1`, `>= 2` und `>= 3`.
 * 2. **Der Alt-Wert `b` bekommt dieselbe Hilfe wie `teens`.** Sonst hinge die
 *    Ausführlichkeit daran, ob der Konto-Blob schon einmal migriert wurde.
 * 3. **Die Erklärungen im Zahnrad sind für Screenreader da.** Sie standen nur
 *    im `title` des `<label>` - dort holt sie keine Sprachausgabe ab, weil
 *    jedes Bedienelement ein eigenes `aria-label` trägt.
 * 4. **Sichtbare Tasten-Beschriftungen tragen den einfachen Bindestrich**
 *    (Braillezeile, [[feedback_nur_bindestrich]]) - „Alt + -", nicht das
 *    Minuszeichen U+2212, und keine Gedankenstriche in Zahlenspannen.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { TypingSettings } from "../src/components/typing/TypingSettings";

afterEach(() => {
  cleanup();
});

const lies = (p: string) => readFileSync(resolve(__dirname, "..", p), "utf8");

// ★ 30.08.2026: kein `angemeldet`-Prop mehr - der Handbuch-Download ist aus
//   der Kinder-Hilfe verschwunden (nur noch LehrerHilfe, Wunsch Johannes).
function zeigeHilfe(stufe: "kids" | "teens" | "erwachsen" | "b") {
  render(
    <TippenHilfe
      open
      onClose={() => {}}
      stufe={stufe as never}
    />,
  );
  return screen.getByRole("dialog", { name: "Hilfe zu Tastenflow" });
}

describe("S5/S6 · Die Hilfe spricht die Stufe, die eingestellt ist", () => {
  it("kids UND Erwachsene werden geduzt (seit 19.09.2026 - Sie nur für Lehrkräfte)", () => {
    expect(zeigeHilfe("kids").textContent).toContain("Tippe einfach los");
    cleanup();
    const erw = zeigeHilfe("erwachsen").textContent ?? "";
    expect(erw).toContain("Tippe einfach los");
    expect(erw).not.toContain("Tippen Sie einfach los");
  });

  it("teens werden geduzt und sehen trotzdem die ausführlichen Abschnitte", () => {
    const teens = zeigeHilfe("teens").textContent ?? "";
    cleanup();
    const erwachsen = zeigeHilfe("erwachsen").textContent ?? "";
    expect(teens).toContain("Tippe einfach los");
    // Der Abschnitt, der nur ab Detailstufe 3 erscheint - teens dürfen ihn
    // NICHT verlieren, sonst wäre die Umstellung der Gast-Hilfe ein Rückschritt.
    expect(teens).toContain("Textstufe");
    expect(erwachsen).toContain("Textstufe");
  });

  it("der ALTE Konto-Wert »b« bekommt genau die teens-Fassung", () => {
    const alt = zeigeHilfe("b").textContent ?? "";
    cleanup();
    const neu = zeigeHilfe("teens").textContent ?? "";
    expect(alt).toBe(neu);
  });

  it("die Seite reicht die geltende Stufe durch - auch an Gäste", () => {
    const src = lies("src/features/public/TippenTrainerPage.tsx");
    // Kein Rückfall auf die feste Erwachsenen-Fassung für Konten-lose Gäste.
    expect(src).not.toContain('stufe={account ? stufe : "erwachsen"}');
    expect(src).toMatch(/<TippenHilfe[\s\S]{0,200}stufe=\{stufe\}/);
  });
});

describe("S5/S6 · Die Erklärungen im Zahnrad erreichen die Sprachausgabe", () => {
  function zeigeEinstellungen(stufe: "kids" | "teens" | "erwachsen") {
    render(
      <TypingSettings lernweg="de"
        stufe={stufe}
        onStufeChange={() => {}}
        onGeburtsjahrChange={() => {}}
        lang="de"
        onLangChange={() => {}}
      />,
    );
  }

  it("Textstufe und Geburtsjahr tragen eine gelesene Beschreibung", () => {
    zeigeEinstellungen("teens");
    // ★ 30.08.2026: „(freiwillig)" ist aus dem Etikett verschwunden - das
    //   Geburtsjahr gehört seither zu jeder Anmeldung.
    for (const name of ["Textstufe (Alter)", "Geburtsjahr"]) {
      const el = screen.getByLabelText(name);
      const id = el.getAttribute("aria-describedby");
      expect(id, `${name} ohne aria-describedby`).toBeTruthy();
      const text = document.getElementById(id as string)?.textContent ?? "";
      expect(text.length, `${name} mit leerer Beschreibung`).toBeGreaterThan(20);
    }
  });

  it("die Beschreibung nennt die Stufen-Bezeichnung der Oberfläche, nicht »Niveau«", () => {
    zeigeEinstellungen("erwachsen");
    const id = screen.getByLabelText("Textstufe (Alter)").getAttribute("aria-describedby");
    const text = document.getElementById(id as string)?.textContent ?? "";
    expect(text).toContain("Übungsstufe");
    expect(text).not.toContain("Niveau");
  });

  it("die Spiel-Wahl der teens ist ebenfalls beschrieben", () => {
    zeigeEinstellungen("teens");
    const id = screen
      .getByLabelText("Belohnungs-Spiel nach einer neuen Taste")
      .getAttribute("aria-describedby");
    const text = document.getElementById(id as string)?.textContent ?? "";
    // Die Erklärung muss BEIDE Möglichkeiten nennen - auf der Braillezeile ist
    // sie das Einzige, was die Wahl überhaupt erklärt. Bis 22.08.2026 stand
    // hier zusätzlich der Knopf »Spielen«; den gibt es ab 11 nicht mehr.
    expect(text).toContain("Keins");
    expect(text).toContain("Eisschollen-Spiel");
    expect(text).not.toContain("Spielen«");
  });
});

describe("S5/S6 · Alt+L sagt genau das, was der Ring zeigt", () => {
  /**
   * Der Text kommt FERTIG aus dem Trainer („Übungsstufe 3"); die Sitzung darf
   * nichts davorsetzen. Bis 22.08. stand dort ein festes „Spielstufe: " —
   * gesehen wurde „Übungsstufe 3", gehört „Spielstufe: Übungsstufe 3" (K34).
   */
  it("der Trainer baut die Beschriftung aus dem Profil", () => {
    // ★ E7 (19.09.2026): `TypingTrainer.tsx` (Übungsart „Lektionen") stand
    // hier bis dahin mit - gelöscht, siehe `trainerMode.ts`.
    for (const p of ["src/components/typing/AdaptiveTrainer.tsx"]) {
      // ★ EN1 (19.09.2026): Das Wort kommt weiter aus dem Profil - in
      // Tastenflow aus dem Profil der Bedienungssprache (`bedienCopy`).
      const quelle = lies(p);
      expect(quelle).toContain("copyFor(stufe).progressLabel");
      expect(quelle).toContain("bedienCopy(stufe, b.sprache).progressLabel");
      expect(quelle).toContain("`${wort} ${pl.level}`");
    }
  });

  it("die Sitzung setzt nichts mehr davor", () => {
    const src = lies("src/components/typing/TypingSession.tsx");
    const stelle = src.slice(src.indexOf("tippen-announce-level") - 1400);
    expect(stelle).not.toContain("`Spielstufe: ${label}`");
    expect(stelle).toContain("const msg = label;");
  });
});

describe("S5/S6 · Nur der einfache Bindestrich in sichtbaren Texten", () => {
  /**
   * Grundmenge ausweisen (Regel 12): Geprüft werden die Dateien, in denen die
   * Oberfläche von Tastenflow ihre Texte hat - nicht der ganze Baum.
   */
  const DATEIEN = [
    "src/components/typing/TippenHilfe.tsx",
    "src/components/typing/LehrerHilfe.tsx",
    "src/components/typing/TypingSettings.tsx",
    "src/components/typing/TypingSession.tsx",
    "src/components/lernwerkstatt/klasse/TastenflowReiter.tsx",
    "src/lib/typing/einrichtung.ts",
    "src/features/public/TippenTrainerPage.tsx",
  ];

  it("keine Zahlenspanne mit Gedankenstrich (Braillezeile)", () => {
    const funde: string[] = [];
    for (const p of DATEIEN) {
      for (const zeile of lies(p).split("\n")) {
        if (/\d\s?[–—]\s?\d/.test(zeile)) funde.push(`${p}: ${zeile.trim()}`);
      }
    }
    expect(DATEIEN.length).toBe(7);
    expect(funde).toEqual([]);
  });

  it("die Zoom-Kürzel zeigen die Bindestrich-Taste, nicht das Minuszeichen", () => {
    // U+2212 sieht wie ein Minus aus, ist aber nicht die Taste, die gedrückt
    // wird - und auf der Braillezeile ein anderes Zeichen.
    const sichtbar = [
      "src/features/public/TippenTrainerPage.tsx",
      "src/components/typing/TippenHilfe.tsx",
      "src/components/typing/LehrerHilfe.tsx",
      "src/components/typing/TypingSession.tsx",
    ];
    for (const p of sichtbar) {
      const treffer = lies(p)
        .split("\n")
        // Quelltext-KOMMENTARE dürfen das Zeichen nennen (sie beschreiben genau
        // diese Falle); geprüft wird, was auf den Bildschirm geht.
        .map((z) => z.replace(/\/\/.*$/, "").replace(/\/\*[\s\S]*?\*\//g, ""))
        .filter((z) => z.includes("−"));
      expect(treffer, `${p} zeigt U+2212`).toEqual([]);
    }
  });
});
