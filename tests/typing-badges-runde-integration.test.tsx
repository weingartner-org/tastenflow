/**
 * Ende-zu-Ende-Wächter für die Feinauskunft der Runde (`RoundDetail`,
 * 09.08.2026): Sie entsteht in `TypingSession`, reist über den Trainer zu
 * `awardBadges` und trägt dort drei neue Familien —
 *   • „Am Stück" (fehlerfreie Anschlagsketten über Runden hinweg),
 *   • die Tempo-Treppe (Mindestlänge einer wertbaren Runde),
 *   • die 10-Minuten-Abschrift (Tippzeit + Fehlerquote).
 *
 * Die Einzelteile prüft `typing-badges-ausbau.test.ts` mit erfundenen Zahlen.
 * HIER wird wirklich getippt — damit die Verdrahtung nicht still reißt (genau
 * das wäre nicht aufgefallen: Die Abzeichen kämen einfach nie).
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import type { TypingProgress } from "../src/lib/typing";

const STORAGE_KEY = "tippen-trainer:v1";

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

function gespeicherterStand(): TypingProgress | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as TypingProgress) : null;
}

describe("Runden-Feinauskunft — von der Tastatur bis ins Abzeichen", () => {
  // Eine ganze Runde dauert im Test real ~8 s (550 ms Zeilenwechsel × 12).
  it("★ eine fehlerfrei durchgetippte Runde füllt Kette und Prüfungslauf", async () => {
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox")) as HTMLInputElement;

    // Eine ganze Runde durchtippen: Der Feldwert ist immer die aktuelle Zeile.
    // Zwölf Zeilen (ITEMS_PER_SESSION) — die Schleife bricht ab, sobald keine
    // neue Zeile mehr kommt (Rundenende).
    let anschlaege = 0;
    for (let zeile = 0; zeile < 12; zeile++) {
      const text = feld.value;
      if (!text) break;
      for (const ch of text) fireEvent.keyDown(feld, { key: ch });
      anschlaege += text.length;
      // Nach jeder Zeile wartet die Session 550 ms auf den Wechsel.
      await waitFor(() => expect(feld.value).not.toBe(text), { timeout: 1500 }).catch(
        () => {
          /* letzte Zeile: der Wert bleibt stehen, die Runde endet */
        },
      );
    }
    expect(anschlaege).toBeGreaterThan(20);

    // Der Spielstand muss die neuen Zähler tragen — sonst ist die Verdrahtung
    // zwischen Session, Trainer und Abzeichen gerissen.
    await waitFor(() => {
      const p = gespeicherterStand();
      expect(p?.badgeTally?.bestCleanRun ?? 0).toBeGreaterThan(0);
    }, { timeout: 5000 });

    const p = gespeicherterStand()!;
    // Fehlerfrei getippt → die Kette ist mindestens so lang wie eine Zeile …
    expect(p.badgeTally!.bestCleanRun!).toBeGreaterThan(5);
    // … der Prüfungslauf der 10-Minuten-Abschrift hat Anschläge gesammelt …
    expect(p.badgeTally!.examKeys ?? 0).toBeGreaterThan(0);
    expect(p.badgeTally!.examErrors ?? 0).toBe(0);
    // … und die Katalog-Fassung steht (stiller Nachtrag ist abgehakt).
    expect(p.badgeTally!.catalog).toBeGreaterThanOrEqual(2);
  }, 40_000);

  it("ein Fehler reißt die laufende Kette", async () => {
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox")) as HTMLInputElement;
    const text = feld.value;
    // ★ Gleich der ERSTE Anschlag daneben — und zwar mit einer freigeschalteten
    //   Buchstaben-Taste (f und j sind es immer). Zwei Fallen stecken hier:
    //   Zeichen, die das Kind noch nicht gelernt hat, ignoriert die Session
    //   bewusst (ein verirrtes „q" darf keinen Fehler kosten), und an der
    //   Stelle eines LEERZEICHENS zählt ein Buchstabe ebenfalls nicht als
    //   Fehler. Die erste Stelle einer Zeile ist nie ein Leerzeichen.
    const falsch = text[0] === "f" ? "j" : "f";
    fireEvent.keyDown(feld, { key: falsch });
    for (const ch of text) fireEvent.keyDown(feld, { key: ch });

    // Die Zeichen-Statistik wird erst am ZEILENENDE gespeichert — darum auf den
    // Zeilenwechsel warten, nicht bloß auf irgendeinen Spielstand.
    await waitFor(() => expect(feld.value).not.toBe(text), { timeout: 3000 });
    await waitFor(() => {
      const p = gespeicherterStand();
      const fehler = Object.values(p?.letters ?? {}).reduce(
        (s, l) => s + l.misses,
        0,
      );
      expect(fehler).toBeGreaterThan(0);
    }, { timeout: 3000 });
  }, 20_000);
});
