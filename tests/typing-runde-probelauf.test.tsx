/**
 * PROBELAUF der tempo-bemessenen Runde (29.08.2026) - im echten Trainer, nicht
 * an der Formel.
 *
 * `tests/typing-rundenlaenge.test.ts` prüft die Rechnung. Was es NICHT prüfen
 * kann: ob die Zahl auch wirklich bis zur Runde durchkommt - der Weg führt
 * durch einen `useMemo`, durch den Themenstrang-Plan und durch
 * `weaveArcGroups`. Genau dort geht so etwas verloren, ohne dass ein
 * Formel-Test etwas merkt.
 *
 * Darum wird hier eine Runde WIRKLICH getippt und die Zeilen werden gezählt.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { STANDARD_ZEILEN, MIN_ZEILEN_JE_RUNDE } from "@/lib/typing/rundenlaenge";

/** Alle Buchstaben, aber OHNE Umschalt-Einheit (sonst wird keine Zeile fertig). */
const ALLE_TASTEN = [
  "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w", "z", "v", "p", "ä", "ü",
  "x", "y", "q", "ß",
];

beforeEach(() => {
  localStorage.clear();
  einrichtungFertigMerken();
  // ★★★ 08.09.2026 - die Bildschirm-Tastatur bleibt in dieser Datei AUS.
  //
  // Sie ist `aria-hidden`, also eine rein optische Hilfe, kostete in jsdom aber
  // den Löwenanteil der Laufzeit: Bei JEDEM Anschlag zeichnet sie rund fünfzig
  // eingefärbte Tasten neu (die nächste Taste wechselt ja), und zwar DOPPELT -
  // unsichtbare Messvorlage plus sichtbare Tastatur -, jede Taste mit einem
  // `style={{ borderColor, background }}`. jsdom schickt jede dieser Farben
  // durch seinen CSS-Parser. Im Browser ist das billig, in jsdom teuer.
  //
  // IN DIESEM ORDNER GEMESSEN (A/B im selben Prozess, Last 175):
  //     Tastatur AN : 148,5 / 56,3 ms je Anschlag
  //     Tastatur AUS: 5,3 ms je Anschlag        → 19-fach
  // CPU-Profil der reinen Tipp-Schleife mit Tastatur: 27,7 % für das Parsen von
  // CSS-Farben (`cssstyle` + `@asamuzakjp/css-color`), aber nur 2,9 % für den
  // Code, den dieser Test prüft. Ohne Tastatur fällt `cssstyle` auf 0,9 %.
  //
  // Abgeschaltet wird über denselben Schalter, den ein Kind in den
  // Einstellungen hat. Kein Test in dieser Datei fasst die Tastatur an.
  //
  // ⚠️ Nebenwirkung mit Ansage: Eine fehlerfreie Runde OHNE Tastatur verdient
  // das Abzeichen „Blindflug" (`badges.ts`). Keine Zusicherung hier baut auf
  // der Liste der verdienten Abzeichen auf.
  //
  // Volle Begründung samt Messwerten - auch, warum gefälschte Zeitgeber KEIN
  // Ausweg sind: `tests/_typing-probelauf.ts`.
  ohneBildschirmTastatur();
});
afterEach(() => {
  cleanup();
});

/** Spielstand hinterlegen - mit oder ohne bekanntes Übungstempo. */
function standMit(speedEma?: number) {
  localStorage.setItem(
    "tippen-trainer:v1",
    JSON.stringify({
      xp: 0,
      lessons: {},
      introduced: ALLE_TASTEN,
      ...(speedEma === undefined ? {} : { speedEma }),
    }),
  );
}

/**
 * Eine ganze Runde fehlerfrei durchtippen und die Zeilen zählen. Zwischen zwei
 * Zeilen liegen 550 ms (Lob + Weiterschalten), die abgewartet werden müssen.
 */
async function zeilenEinerRunde(): Promise<number> {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
  await screen.findByRole("textbox");
  let zeilen = 0;
  for (let i = 0; i < STANDARD_ZEILEN + 3; i++) {
    const feld = screen.queryByRole("textbox") as HTMLInputElement | null;
    if (!feld?.value) break;
    for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
    zeilen++;
    await new Promise((r) => setTimeout(r, 700));
  }
  return zeilen;
}

describe("Probelauf: die Runde kommt in der bemessenen Länge an", () => {
  it("ohne bekanntes Tempo bleibt es bei der vollen Runde", async () => {
    // Ein neues Konto darf nicht zerstückelt starten - erst messen, dann teilen.
    standMit(undefined);
    expect(await zeilenEinerRunde()).toBe(STANDARD_ZEILEN);
  }, 60000);

  it("ein Kind mit 30 Anschlägen/min bekommt eine deutlich kürzere Runde", async () => {
    // Bei diesem Tempo dauerte die volle Runde 16 Minuten (gemessen,
    // scripts/_langsam.mts). Erwartet werden rund 5 Zeilen - geprüft wird die
    // Spanne, nicht die eine Zahl: Die Themenstrang-Zeilen dürfen sich um eine
    // verschieben, ohne dass dieser Wächter deshalb rot wird.
    standMit(30);
    const zeilen = await zeilenEinerRunde();
    expect(zeilen).toBeGreaterThanOrEqual(MIN_ZEILEN_JE_RUNDE);
    expect(zeilen).toBeLessThanOrEqual(7);
  }, 60000);

  it("ein schnelles Kind merkt von der Regel nichts", async () => {
    standMit(190);
    expect(await zeilenEinerRunde()).toBe(STANDARD_ZEILEN);
  }, 60000);
});
