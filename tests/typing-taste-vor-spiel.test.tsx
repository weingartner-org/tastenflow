/**
 * Wächter: FREISCHALTEN UND FEIERN SIND GETRENNT (Johannes 14.08.2026).
 *
 * Bis dahin war das Spiel ein TOR: Wer die Mastery-Schwelle erreicht hatte,
 * bekam die neue Taste erst, wenn er den Parcours schaffte — und für die Profile
 * „kind" und „mittel" war das der EINZIGE Weg zu einer neuen Taste. Damit
 * bestrafte es genau das langsame, sorgfältige Kind, und zwar unsichtbar: Es
 * erlebte nicht „eine Regel hält mich auf", sondern nur „ich komme nicht
 * weiter".
 *
 * Jetzt: Die Taste gehört dem Kind, sobald die Schwelle erreicht ist. Das Spiel
 * kommt danach als Belohnung — freiwillig, und ohne jede Folge für den Lernstand.
 *
 * Hier wird wirklich eine Runde getippt (wie in typing-badges-runde-integration):
 * Nur so fällt auf, wenn die Verdrahtung zwischen Session, Trainer und
 * Freischaltung reißt.
 *
 * S1 (15.08.2026): Anonyme Besucher stehen auf `teens`, das Profil ist damit
 * `jugend`. Seit dem 22.08.2026 (Charge „SCHLANK") bekommt diese Stufe von
 * sich aus GAR KEIN Spiel mehr angeboten — der Tipp-Sprint ist entfallen, die
 * Vorgabe ist „keins". Damit hier überhaupt ein Angebot zu prüfen ist, schaltet
 * `beforeEach` die Geräte-Einstellung auf das Eisschollen-Spiel. Am Wächter
 * ändert das nichts: Geprüft wird, dass die Taste OHNE Spiel freigeschaltet ist
 * und das Spiel nur ein Angebot bleibt.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import {
  defaultIntroduced,
  emptyProgress,
  setBelohnungsSpiel,
  type LetterStat,
  type TypingProgress,
} from "../src/lib/typing";

const STORAGE_KEY = "tippen-trainer:v1";

/** Eine Taste, die nach jedem Maßstab „sitzt": treffsicher und flott. */
function sitzt(): LetterStat {
  return {
    hits: 30,
    misses: 0,
    sumMs: 9000,
    timed: 30,
    recent: Array.from({ length: 20 }, () => 300),
  };
}

/**
 * Ein Lernstand, bei dem die nächste Taste FÄLLIG ist: Alles, was bisher
 * eingeführt wurde, sitzt — die nächste Runde lässt `introduced` wachsen.
 */
function standVorDerNeuenTaste(): TypingProgress {
  const introduced = defaultIntroduced("de");
  const letters: Record<string, LetterStat> = {};
  for (const c of introduced) letters[c] = sitzt();
  return { ...emptyProgress(), introduced, letters };
}

function gespeicherterStand(): TypingProgress | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as TypingProgress) : null;
}

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
  // Vorgabe ab 11 ist seit 22.08.2026 „kein Spiel". Hier soll aber genau das
  // ANGEBOT geprüft werden — also die Wahl setzen, die es überhaupt erzeugt.
  setBelohnungsSpiel("expedition");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(standVorDerNeuenTaste()));
});

/** Die Spiel-BÜHNE: die Eisschollen-Expedition meldet sich als `role="application"`. */
function buehne(): HTMLElement | null {
  return screen.queryByRole("application");
}

/** Die Feier-Karte am Ende der Runde - das echte Zeichen, dass sie vorbei ist. */
function feierKarte(): HTMLElement | null {
  return screen.queryByRole("dialog", { name: /freigeschaltet/i });
}

/**
 * Eine ganze Runde fehlerfrei durchtippen (12 Zeilen oder bis zum Ende).
 *
 * ⚠️ WACKLER GEHEILT 24.08.2026 - bitte nicht zurückbauen: Vorher wartete diese
 * Schleife nach jeder Zeile nur darauf, dass eine NEUE Zeile im Feld steht -
 * 1,5 Sekunden lang, und ein Zeitablauf galt STILL als „letzte Zeile, Runde
 * vorbei". Auf einem ausgelasteten Rechner (voller Suite-Lauf, ~390 Dateien
 * gleichzeitig) hieß „langsam" damit „fertig": Die Runde brach mittendrin ab,
 * die Taste wurde nie freigeschaltet, und der Test weiter unten wurde grundlos
 * rot. Genau so ist er am 24.08. einmal umgefallen.
 *
 * Jetzt wird auf das ECHTE Ende gewartet: Nach einer Zeile passiert genau eines
 * von beidem - die nächste Zeile steht im Feld, oder die Feier-Karte kommt.
 * Tritt keines von beidem ein, ist wirklich etwas kaputt; dann bricht die
 * Schleife ab und lässt die eigentliche Erwartung des Tests reden.
 */
async function rundeTippen(feld: HTMLInputElement): Promise<void> {
  for (let zeile = 0; zeile < 12; zeile++) {
    const text = feld.value;
    if (!text) break;
    for (const ch of text) fireEvent.keyDown(feld, { key: ch });
    try {
      await waitFor(
        () => expect(feld.value !== text || feierKarte() !== null).toBe(true),
        { timeout: 5000 },
      );
    } catch (_) {
      break; // weder neue Zeile noch Feier - hier hilft kein weiteres Tippen
    }
    if (feierKarte()) break;
  }
}

describe("Die neue Taste hängt an keinem Spiel mehr", () => {
  it("★★★ nach der Runde ist die Taste SOFORT freigeschaltet — ohne Parcours", async () => {
    const vorher = defaultIntroduced("de").length;
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox")) as HTMLInputElement;
    await rundeTippen(feld);

    await waitFor(
      () => {
        const p = gespeicherterStand();
        expect((p?.introduced ?? []).length).toBeGreaterThan(vorher);
      },
      /*
        ⚠️ ZEITBUDGET ERHÖHT am 01.09.2026 - die ZUSICHERUNG ist unverändert.
        Mit der neuen Pausentoleranz von 30 s (`IDLE_CAP_MS`) gilt ein Kind
        länger als „übt gerade"; die Stand-Zeile bleibt damit sichtbar und
        zeichnet sich alle 300 ms neu. In jsdom kostet das genug Zeit, dass
        eine getippte Runde statt in 5 s erst in rund 14 s fertig ist.
        Gemessen: mit grösserem Budget läuft derselbe Fall grün, die Taste wird
        also sehr wohl freigeschaltet. Am PRODUKT ändert das nichts - ein Kind
        tippt eine Runde ohnehin in Minuten.
      */
      { timeout: 20000 },
    );
  }, 60_000);

  it("★★★ die Feier bietet das Spiel als Belohnung an — sie erzwingt es nicht", async () => {
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox")) as HTMLInputElement;
    await rundeTippen(feld);

    // Die Feier-Karte kommt (die Taste ist verdient) …
    const einladung = await screen.findByRole(
      "button",
      { name: /Ab ins Eis|Eisschollen-Spiel/ },
      { timeout: 5000 },
    );
    // … und daneben steht in DERSELBEN Karte der Weiterweg, der das Spiel
    // überspringt.
    const feier = screen.getByRole("dialog", { name: /freigeschaltet/i });
    expect(within(feier).getByRole("button", { name: /weiter/i })).toBeInTheDocument();
    // Die Bühne ist NOCH ZU: Niemand wird ins Spiel gezwungen. (Eisschollen =
    // role application.)
    expect(buehne()).toBeNull();

    // Wer mag, geht hinein — jetzt erst öffnet die Bühne.
    fireEvent.click(einladung);
    await waitFor(() => expect(buehne()).not.toBeNull());
  }, 40_000);

  it("★★ „Weiter“ statt Spiel lässt die Taste trotzdem frei (kein Rückschritt)", async () => {
    const vorher = defaultIntroduced("de").length;
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox")) as HTMLInputElement;
    await rundeTippen(feld);

    await screen.findByRole(
      "button",
      { name: /Ab ins Eis|Eisschollen-Spiel/ },
      { timeout: 5000 },
    );
    const feier = screen.getByRole("dialog", { name: /freigeschaltet/i });
    fireEvent.click(within(feier).getByRole("button", { name: /weiter/i }));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /Ab ins Eis|Eisschollen-Spiel/ })).toBeNull(),
    );

    const p = gespeicherterStand();
    expect((p?.introduced ?? []).length).toBeGreaterThan(vorher);
  }, 40_000);
});
