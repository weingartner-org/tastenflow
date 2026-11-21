/**
 * WÄCHTER der DREI PROFILE (Charge S2, 15.08.2026 - Bauplan §0.2, §0b.2, §0b.4).
 *
 * Zwei Dinge werden hier festgehalten, die man leicht wieder verliert:
 *
 * 1. **Das mittlere Profil ist restlos weg.** Nach dem Wegfall eines Profils
 *    SCHWEIGT `tsc`: Ein Zweig, der es noch kennt, wird nicht zum Fehler,
 *    sondern zu totem Text (bekannte Falle, skin.ts + Bauplan §4 S2). Darum
 *    prüft der erste Block die Quelltexte selbst - regelbasiert, mit
 *    ausgewiesener Grundmenge (Regel 12).
 * 2. **Die Elfjährigen können ihr Spiel behalten** - nicht mehr über ein eigenes
 *    Profil, sondern über die Wahl im Zahnrad. Der Weg muss erreichbar
 *    bleiben, und die Tonlage darf davon unberührt bleiben (ein Vierzehnjähriger
 *    mit Eisschollen-Spiel bekommt trotzdem keinen Kinder-Jubel).
 *
 * ★ 22.08.2026 (Charge »SCHLANK«): Der dritte Wert »Tipp-Sprint« ist entfallen,
 *   die Vorgabe ab 11 ist jetzt KEIN Spiel, und einen freien Spiel-Einstieg
 *   (»Spielen«) gibt es nur noch in der Kinder-Stufe.
 * ★★ 31.08.2026 (Johannes): Der freie Einstieg steht wieder bis 15 Jahre
 *   (`showsFreePlay`, Wächter in `typing-schlank.test.tsx`). Was HIER geprüft
 *   wird, ist davon unberührt und bleibt gültig: `gateModeFor` - das Spiel
 *   NACH einer neuen Taste - gehört weiter nur den Kindern fest.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

// Die ANSAGE der Spiel-Wahl ist sonst unbeobachtbar - und genau sie ist das,
// was ein Kind mit Blindheit von der Umstellung mitbekommt.
vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn() };
});

import {
  BADGES,
  UI_COPY,
  activeBelohnungsSpiel,
  badgeName,
  copyFor,
  gateModeFor,
  isFormal,
  setBelohnungsSpiel,
  showsConfetti,
  skinForStufe,
  speakUi,
  subscribeBelohnungsSpiel,
  usesMascots,
  VORGABE_BELOHNUNGSSPIEL,
} from "../src/lib/typing";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { TypingSettings } from "../src/components/typing/TypingSettings";

afterEach(() => {
  cleanup();
});

/* ── 1 · Der Quelltext-Wächter ─────────────────────────────────────────────── */

/** Alle Quelldateien unter einem Ordner (rekursiv, nur .ts/.tsx). */
function quellen(...ordner: string[]): { pfad: string; text: string }[] {
  const out: { pfad: string; text: string }[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = resolve(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(e.name)) out.push({ pfad: p, text: readFileSync(p, "utf8") });
    }
  };
  for (const o of ordner) walk(resolve(__dirname, "..", o));
  return out;
}

describe("Das mittlere Profil ist restlos entfernt", () => {
  it("keine Zeile in src/ nennt es mehr im Profil-Zusammenhang", () => {
    const dateien = quellen("src");
    // Grundmenge ausweisen (Regel 12) - sonst zählt der Lauf nicht.
    console.log(`[drei-profile] durchsucht: ${dateien.length} Dateien in src/`);
    expect(dateien.length).toBeGreaterThan(100);
    // Das Wort allein ist harmlos (»Hilfsmittel«, »mittel-links« als Finger,
    // »im Mittel« als Durchschnitt, Korpus-Sätze über das Mittelalter). Verboten
    // ist es NUR dort, wo es zusammen mit Profil-Vokabular steht.
    const profilWort = /\bskin\b|UI_COPY|gateModeFor|usesMascots|showsConfetti|Tonlage|Profil/i;
    const treffer: string[] = [];
    for (const { pfad, text } of dateien)
      text.split("\n").forEach((zeile, i) => {
        if (/\bmittel\b/i.test(zeile) && profilWort.test(zeile))
          treffer.push(`${pfad}:${i + 1}: ${zeile.trim()}`);
      });
    expect(treffer, `Profil-Rest gefunden:\n${treffer.join("\n")}`).toEqual([]);
  });

  it("im Tastenflow-Kern kommt es auch als blanke Zeichenkette nicht mehr vor", () => {
    const dateien = quellen("src/lib/typing", "src/components/typing");
    console.log(`[drei-profile] Kern: ${dateien.length} Dateien`);
    // ★ SPRACHEN-9 (29.10.2026): `"mittel"` als FINGER-Art (neben `"zeige"`, `"ring"` - Lektionen hu/ro/nl, `lektionenBaukasten.ts`) ist
    // kein Profil-Rest; eine Zeile, die zugleich `"zeige"` nennt, zählt darum nicht.
    const treffer = dateien
      .filter(({ text }) => text.split("\n").some((z) => /(["'`])mittel\1/i.test(z) && !/(["'`])zeige\1/.test(z)))
      .map(({ pfad }) => pfad);
    expect(treffer, `Zeichenkette »mittel« in:\n${treffer.join("\n")}`).toEqual([]);
  });

  it("zur Laufzeit gibt es genau drei Profile", () => {
    // UI_COPY ist ein Record über den Skin-Typ - seine Schlüssel SIND zur
    // Laufzeit die Liste der Profile.
    expect(Object.keys(UI_COPY).sort()).toEqual(["erwachsen", "jugend", "kind"]);
  });
});

/* ── 2 · Verhalten je Stufe ────────────────────────────────────────────────── */

describe("kids (7-10): Kind sein ist schön", () => {
  it("jubelt hörbar - »Super!« bleibt der Kinderstufe erhalten", () => {
    const c = copyFor("kids");
    expect(c).toBe(UI_COPY.kind);
    expect(c.starsSpoken(3)).toContain("Super!");
    expect(c.summaryTitle(3)).toContain("!");
    expect(c.progressLabel).toBe("Spielstufe");
  });

  it("spielt IMMER die Expedition - die Wahl im Zahnrad greift hier nicht", () => {
    for (const wahl of ["keins", "expedition"] as const)
      expect(gateModeFor(skinForStufe("kids"), wahl)).toBe("expedition");
  });

  it("behält Maskottchen-Namen und Konfetti", () => {
    const kind = skinForStufe("kids");
    expect(usesMascots(kind)).toBe(true);
    expect(showsConfetti(kind)).toBe(true);
    const pinguin = BADGES.find((b) => b.id === "praezisions-pinguin")!;
    expect(badgeName(pinguin, kind)).toBe("Präzisions-Pinguin");
    // Kindertexte gibt es nur per Du - auch für eine Lehrkraft (19.09.2026).
    expect(isFormal(kind, "du")).toBe(false);
    expect(isFormal(kind, "Sie")).toBe(false);
  });
});

describe("teens (11-15): trocken, aber mit Wahl", () => {
  const jugend = skinForStufe("teens");

  it("jubelt nicht - kein »Super«, kein Ausrufezeichen, kein Maskottchen", () => {
    const c = copyFor("teens");
    expect(c).toBe(UI_COPY.jugend);
    const texte = [
      c.subtitle,
      c.progressLabel,
      c.retry,
      c.locked,
      ...[0, 1, 2, 3].flatMap((n) => [c.summaryTitle(n), c.summaryRemark(n), c.starsSpoken(n)]),
    ];
    for (const t of texte) {
      expect(t, `Ausrufezeichen in »${t}«`).not.toContain("!");
      expect(t.toLowerCase(), `»Super« in »${t}«`).not.toContain("super");
    }
    const pinguin = BADGES.find((b) => b.id === "praezisions-pinguin")!;
    expect(badgeName(pinguin, jugend)).toBe("Dreimal sauber");
    expect(showsConfetti(jugend)).toBe(false);
  });

  it("bekommt ohne Zutun KEIN Spiel und kann die Expedition zuschalten", () => {
    expect(gateModeFor(jugend, "keins")).toBe("keins");
    expect(gateModeFor(jugend, "expedition")).toBe("expedition");
  });
});

describe("erwachsen (ab 16): sachlich - seit 19.09.2026 per Du", () => {
  const erw = skinForStufe("erwachsen");

  it("per Du (Sie nur für die Lehrkraft), ohne Belohnungs-Runde und ohne Maskottchen", () => {
    // Johannes 19.09.2026: „Lehrer mit Sie ansprechen und Schüler und
    // Selbstlernende mit du" - auch ab 16. Das Sie hängt an der Rolle.
    expect(isFormal(erw, "du")).toBe(false);
    expect(isFormal(erw, "Sie")).toBe(true);
    expect(copyFor("erwachsen").xpUnit).toBe("Punkte");
    expect(copyFor("erwachsen").progressLabel).toBe("Übungsstufe");
    expect(usesMascots(erw)).toBe(false);
    expect(showsConfetti(erw)).toBe(false);
    for (const wahl of ["keins", "expedition"] as const)
      expect(gateModeFor(erw, wahl)).toBe("keins");
  });
});

/* ── 3 · Die Geräte-Einstellung ────────────────────────────────────────────── */

describe("Belohnungs-Spiel: Geräte-Einstellung wie das Tastatur-Layout", () => {
  beforeEach(() => {
    setBelohnungsSpiel(VORGABE_BELOHNUNGSSPIEL);
  });

  it("Vorgabe ist KEIN Spiel (seit 22.08.2026, davor der Tipp-Sprint)", () => {
    expect(VORGABE_BELOHNUNGSSPIEL).toBe("keins");
    expect(activeBelohnungsSpiel()).toBe("keins");
  });

  it("★★ alte Speicherstände mit »sprint« fallen sauber auf die Vorgabe", async () => {
    // Zwischen dem 15. und 22.08.2026 stand auf vielen Geräten „sprint" im
    // Browser-Speicher. Dieses Spiel gibt es nicht mehr; der Wert darf keine
    // leere Wahl erzeugen (Auswahlfeld ohne gültigen Eintrag) und auch keinen
    // Absturz. Frisches Modul, weil der Wert nur EINMAL gelesen wird.
    localStorage.setItem("tippen-belohnungsspiel", "sprint");
    vi.resetModules();
    const frisch = await import("../src/lib/typing/belohnungsspiel");
    expect(frisch.activeBelohnungsSpiel()).toBe(frisch.VORGABE_BELOHNUNGSSPIEL);
    expect(frisch.activeBelohnungsSpiel()).toBe("keins");
    // Lesen schreibt nicht: Der alte Wert bleibt unangetastet stehen, bis
    // jemand bewusst umstellt.
    expect(localStorage.getItem("tippen-belohnungsspiel")).toBe("sprint");
    localStorage.removeItem("tippen-belohnungsspiel");
    vi.resetModules();
  });

  it("merkt die Wahl im Browser und meldet sie den Horchern", () => {
    const gehoert = vi.fn();
    const ab = subscribeBelohnungsSpiel(gehoert);
    setBelohnungsSpiel("expedition");
    expect(activeBelohnungsSpiel()).toBe("expedition");
    expect(localStorage.getItem("tippen-belohnungsspiel")).toBe("expedition");
    expect(gehoert).toHaveBeenCalledTimes(1);
    // Dieselbe Wahl noch einmal: kein zweiter Weckruf.
    setBelohnungsSpiel("expedition");
    expect(gehoert).toHaveBeenCalledTimes(1);
    ab();
  });
});

/* ── 4 · Oberfläche ───────────────────────────────────────────────────────── */

describe("Zahnrad: die Wahl steht nur dort, wo sie wirkt", () => {
  beforeEach(() => {
    setBelohnungsSpiel("keins");
  });

  function zeigeEinstellungen(stufe: "kids" | "teens" | "erwachsen") {
    render(
      <TypingSettings lernweg="de"
        stufe={stufe}
        onStufeChange={() => {}}
        lang="de"
        onLangChange={() => {}}
      />,
    );
  }

  it("teens sehen die Auswahl und stellen damit die Einstellung um", () => {
    zeigeEinstellungen("teens");
    const wahl = screen.getByLabelText("Belohnungs-Spiel nach einer neuen Taste");
    expect(wahl).toHaveValue("keins");
    act(() => {
      fireEvent.change(wahl, { target: { value: "expedition" } });
    });
    expect(activeBelohnungsSpiel()).toBe("expedition");
  });

  it("★★★ drei Sichten derselben Wahl: Bild, Ansage, Braillezeile", () => {
    // Bild: genau zwei Möglichkeiten, „Keins" zuerst (es ist die Vorgabe).
    zeigeEinstellungen("teens");
    const wahl = screen.getByLabelText(
      "Belohnungs-Spiel nach einer neuen Taste",
    ) as HTMLSelectElement;
    expect([...wahl.options].map((o) => o.text)).toEqual([
      "Keins",
      "Eisschollen-Spiel",
    ]);
    // Braillezeile: die Erklärung hängt per aria-describedby am Feld und nennt
    // beide Möglichkeiten - sonst steht dort eine Wahl ohne Erklärung.
    const hinweis =
      document.getElementById(wahl.getAttribute("aria-describedby") as string)
        ?.textContent ?? "";
    expect(hinweis).toContain("Keins");
    expect(hinweis).toContain("Eisschollen-Spiel");
    // Ansage: beim Umstellen wird dasselbe Wort gesprochen, das im Feld steht -
    // sonst hört jemand etwas anderes, als auf der Braillezeile ankommt.
    vi.mocked(speakUi).mockClear();
    act(() => {
      fireEvent.change(wahl, { target: { value: "expedition" } });
    });
    expect(activeBelohnungsSpiel()).toBe("expedition");
    expect(wahl.value).toBe("expedition");
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith(
      "Belohnungs-Spiel: Eisschollen-Spiel.",
    );
    vi.mocked(speakUi).mockClear();
    act(() => {
      fireEvent.change(wahl, { target: { value: "keins" } });
    });
    expect(vi.mocked(speakUi)).toHaveBeenCalledWith("Belohnungs-Spiel: keins.");
  });

  it("kids und Erwachsene bekommen sie gar nicht erst zu sehen", () => {
    zeigeEinstellungen("kids");
    expect(
      screen.queryByLabelText("Belohnungs-Spiel nach einer neuen Taste"),
    ).toBeNull();
    cleanup();
    zeigeEinstellungen("erwachsen");
    expect(
      screen.queryByLabelText("Belohnungs-Spiel nach einer neuen Taste"),
    ).toBeNull();
  });
});

describe("Die Hilfe erklärt, was das jeweilige Alter wirklich sieht", () => {
  function hilfe(stufe: "kids" | "teens" | "erwachsen") {
    render(<TippenHilfe open onClose={() => {}} stufe={stufe} />);
    return screen.getByRole("dialog", { name: "Hilfe zu Tastenflow" }).textContent ?? "";
  }

  it("teens: eigener Abschnitt zur Wahl des Belohnungs-Spiels", () => {
    const t = hilfe("teens");
    expect(t).toContain("Nach einer neuen Taste");
    expect(t).toContain("Belohnungs-Spiel");
    expect(t).toContain("Eisschollen-Spiel");
    // Der Tipp-Sprint ist am 22.08.2026 entfallen - die Hilfe darf ihn nicht
    // mehr versprechen.
    expect(t).not.toContain("Tipp-Sprint");
    // Voreingestellt ist seither: keins.
    expect(t).toContain("Keins");
  });

  it("kids: keine Wahl, und das Spiel ist die Feier — kein Tor mehr", () => {
    const t = hilfe("kids");
    expect(t).not.toContain("Belohnungs-Spiel");
    // Seit 14.08.2026 hängt die Taste an keinem Spiel; die Hilfe darf nichts
    // anderes behaupten.
    expect(t).toContain("das Spiel ist die Belohnung");
    expect(t).not.toContain("wartet das Eisschollen-Spiel: Hilf dem Pinguin");
  });

  it("erwachsen: per Du, ohne Wahl - und ohne Spiel-Abschnitt", () => {
    const t = hilfe("erwachsen");
    expect(t).not.toContain("Belohnungs-Spiel");
    // Seit 22.08.2026 gibt es ab 16 weder Belohnungs-Runde noch freien
    // Einstieg. Eine Hilfe, die ein unerreichbares Spiel erklärt, ist keine.
    expect(t).not.toContain("Eisschollen-Spiel");
    expect(t).not.toContain("Tipp-Sprint");
    // Seit 19.09.2026 per Du (die Hilfe liest nie eine Lehrkraft - die
    // bekommt die LehrerHilfe). „Sie" als Pronomen („Sie wird gefeiert")
    // bleibt erlaubt; verboten ist die Anrede.
    expect(t).toContain("Tippe einfach los");
    expect(t).not.toMatch(/\b(Tippen Sie|können Sie|müssen Sie|Ihr Fortschritt)\b/);
  });
});
