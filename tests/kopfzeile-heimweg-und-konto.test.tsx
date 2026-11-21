/**
 * Drei Befunde von Johannes am Abend des 25.08.2026, alle drei an der
 * Kopfzeile bzw. am Übungsfeld:
 *
 *  1. „Ich würde gerne, wenn ich auf den Text Tastenflow klicke, immer wieder
 *     zum Programm zurückkommen, z. B. wenn Einstellungen geöffnet sind - das
 *     gleiche wie bei Esc."
 *  2. „Und wenn ich woanders hinklicke, beginnt die Eingabezeile (Cursor) auf
 *     einmal linksbündig? Woher kommt das?"
 *  3. „Wir brauchen ein Tastenkürzel für den Accountschalter/Benutzerschalter."
 *     ★ Es wurde Alt + J. Alt + A war der naheliegende Buchstabe und ist es
 *     NICHT geworden: Er gehört seit 24.08.2026 der ANGABE (§12 der
 *     Arbeitsblatt-Bauart) - dem Weg aus dem Eingabefeld zurück zum
 *     Aufgabentext. Entscheidung Johannes 25.08.: Eine Kernfunktion beim
 *     Üben schlägt einen Schalter, den man selten braucht. Die Begründung
 *     für J steht im Kopf von `src/lib/shortcuts.ts`.
 *
 * ⚠️ Zu Nummer 2 - warum hier eine BAUART geprüft wird und kein Verhalten:
 * Die Ursache ist eine Layout-Wirkung (der Browser scrollt einen Kasten, der
 * durch die Verschiebung des Eingabefelds breiter ist als sein Inhalt).
 * jsdom rechnet kein Layout: `scrollWidth`, `clientWidth` und `scrollLeft` sind
 * dort konstant 0, und ein Fokus scrollt nichts. Ein Verhaltenstest wäre also
 * grün, ganz gleich welche Regel dort steht - genau die Sorte Wächter, die
 * nichts misst. Darum hält dieser Test die EINE Eigenschaft fest, an der es
 * hängt: Der Kasten um das Eingabefeld darf kein scrollbarer Kasten sein.
 * Gemessen wurde die Wirkung am 25.08.2026 im echten Browser (Chromium,
 * 1280x720): mit `overflow-hidden` sprang `scrollLeft` beim Fokus auf 547 px
 * und hob die Verschiebung auf, mit `overflow-clip` blieb es 0.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { AppKopfzeile } from "../src/components/AppKopfzeile";

const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  einrichtungFertigMerken();
  useTypingAuth.setState({ account: JANO });
});
afterEach(cleanup);

function zeigeSeite() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

function feld(): HTMLElement | null {
  return document.querySelector('[data-typing-field="practice"]');
}

/* ══════════════════════════════════════════════════════════════════════════
   1. DER SCHRIFTZUG IST DER HEIMWEG
   ══════════════════════════════════════════════════════════════════════════ */
describe("Der App-Name in der Kopfzeile führt zurück ins Programm", () => {
  it("★★★ ist ein Schalter - und heißt genau wie die sichtbaren Wörter", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // ★★ 30.08.2026 (Johannes): „der text tastenflow und mein training soll der
    // gleiche link sein". Bis dahin war NUR „Tastenflow" der Schalter und der
    // Bereich stand daneben. Jetzt liegen beide in EINEM Schalter - sein Name
    // sind darum beide Wörter, ohne den Mittelpunkt (der bleibt aria-hidden).
    const schalter = screen.getByRole("button", { name: "Tastenflow Mein Training" });
    // WCAG 2.5.3 „Label in Name": Wer per Sprache „Tastenflow" oder „Mein
    // Training" sagt, muss diesen Schalter treffen. Die Erklärung gehört in den
    // Tooltip, NICHT in den Namen - sie wanderte sonst in den Namen der
    // Überschrift und würde bei jedem Seitenüberblick mitgelesen.
    expect(schalter.getAttribute("aria-label")).toBeNull();
    // ★ 30.08.2026: Die Erklärung kommt aus dem Tipp-Baustein, nicht mehr aus
    //   `title` (sofort sichtbar, lesbare Größe, auch bei Fokus).
    // ★ 15.11.2026 (NVDA- und VoiceOver-Prüfung, Johannes: „für alle Apps"): Der Schalter verweist
    //   NICHT mehr per `aria-describedby` auf den Hinweis - sonst las der Screenreader die lange
    //   Erklärung bei jedem Sprung zur Überschrift mit. Der Hinweis bleibt für die Augen im Baum.
    expect(schalter.getAttribute("title")).toBeNull();
    expect(schalter.getAttribute("aria-describedby")).toBeNull();
    expect([...document.querySelectorAll("[role='tooltip']")].some((t) => /Escape/.test(t.textContent ?? ""))).toBe(true);
    // Er sitzt in der Überschrift der Seite, nicht daneben.
    expect(schalter.closest("h1")).not.toBeNull();
    // Der Mittelpunkt zwischen beiden ist reine Optik.
    const punkt = [...schalter.querySelectorAll("span")].find(
      (x) => x.textContent === "\u00b7",
    );
    expect(punkt?.getAttribute("aria-hidden")).toBe("true");
  });

  it("★★★ schließt Offenes und holt die Eingabezeile - wie Escape", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });

    // Die Einstellungen öffnen (Johannes' Beispiel - am 07.09.2026 hat er es
    // wörtlich wiederholt: „auch oben auf Tastenflow kann geklickt werden um
    // es zu schließen").
    // ⚠️ Seit demselben Tag ist das ein FENSTER, kein Aufklappbereich - darum
    // `role="dialog"` statt `aria-expanded`.
    fireEvent.click(screen.getByRole("button", { name: /Einstellungen/i }));
    await screen.findByRole("dialog");

    fireEvent.click(screen.getByRole("button", { name: "Tastenflow Mein Training" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(feld()));
  });

  it("Gegenprobe: ohne den Rückruf bleibt der Name schlichter Text", () => {
    render(
      <MemoryRouter>
        <AppKopfzeile
          titel="Klangpunkte"
          onHilfe={() => {}}
          onKurztasten={() => {}}
        />
      </MemoryRouter>,
    );
    // Kein Schalter, der nichts tut.
    expect(screen.queryByRole("button", { name: "Klangpunkte" })).toBeNull();
    expect(
      screen.getByRole("heading", { name: /Klangpunkte/ }),
    ).toBeInTheDocument();
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   2. DAS ÜBUNGSFELD DARF KEIN SCROLLBARER KASTEN SEIN
   ══════════════════════════════════════════════════════════════════════════ */
describe("Die Zeile bleibt mittig, auch nach einem Klick woanders hin", () => {
  it("★★★ der Kasten um das Eingabefeld schneidet ab, ohne scrollbar zu sein", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const eingabe = feld();
    expect(eingabe).not.toBeNull();
    const kasten = eingabe!.parentElement!;

    // `overflow-clip` schneidet genauso ab wie `overflow-hidden`, macht den
    // Kasten aber NICHT scrollbar. Nur so kann der Browser die Verschiebung
    // des Feldes nicht wegscrollen, wenn es den Fokus bekommt.
    expect(kasten.classList.contains("overflow-clip")).toBe(true);
    expect(kasten.classList.contains("overflow-hidden")).toBe(false);
    expect(kasten.classList.contains("overflow-auto")).toBe(false);
    expect(kasten.classList.contains("overflow-scroll")).toBe(false);
  });

  it("★ und das Feld wird überhaupt nur deshalb verschoben - die Kopplung festhalten", () => {
    // Der Grund, warum der Kasten überhaupt überläuft: PromptText zieht das
    // echte (durchsichtige) Feld um dieselbe Strecke mit wie die sichtbare
    // Zeile (`mirrorRef`), damit der unsichtbare Schreibzeiger unter dem
    // aktiven Zeichen sitzt. Fiele das weg, hielte der Wächter oben eine Regel
    // gegen ein Problem fest, das es nicht mehr gibt - dann gehört beides
    // zusammen noch einmal angesehen.
    //
    // ⚠️ Gelesen wird die QUELLE, nicht das gerenderte Feld: In jsdom ist
    // `clientWidth` immer 0, `place()` steigt darum vor der Verschiebung aus,
    // und `style.transform` bliebe leer - ein Test darauf wäre grün, ganz
    // gleich ob die Mechanik noch existiert.
    const quelle = readFileSync(
      resolve(__dirname, "..", "src/components/typing/TypingSession.tsx"),
      "utf8",
    );
    expect(quelle).toContain("mirrorRef.current.style.transform = shift");
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   3. ALT + J - DER KONTO-SCHALTER
   ══════════════════════════════════════════════════════════════════════════ */
function altJ(ziel: Document | HTMLElement = document) {
  fireEvent.keyDown(ziel, { key: "j", code: "KeyJ", altKey: true });
}

describe("Alt + J öffnet und schließt Mein Konto", () => {
  it("★★★ angemeldet: öffnet das Konto-Menü, noch einmal schließt es", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const knopf = screen.getByRole("button", { name: /Mein Konto: Jano/i });
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
    expect(knopf.getAttribute("aria-keyshortcuts")).toBe("Alt+J");

    altJ();
    await waitFor(() => expect(knopf.getAttribute("aria-expanded")).toBe("true"));
    expect(screen.getByRole("button", { name: /Abmelden/i })).toBeInTheDocument();

    altJ();
    await waitFor(() =>
      expect(knopf.getAttribute("aria-expanded")).toBe("false"),
    );
  });

  it("★★ abgemeldet: ruft denselben Weg wie der Knopf „Konto“", () => {
    const anmelden = vi.fn();
    render(
      <MemoryRouter>
        <AppKopfzeile
          titel="Punktgenau"
          onHilfe={() => {}}
          onKurztasten={() => {}}
          onAnmelden={anmelden}
        />
      </MemoryRouter>,
    );
    altJ();
    expect(anmelden).toHaveBeenCalledTimes(1);
  });

  it("★★★ hält sich aus echten Formularfeldern heraus (NVDA-Muster)", () => {
    const anmelden = vi.fn();
    render(
      <MemoryRouter>
        <>
          <AppKopfzeile
            titel="Punktgenau"
            onHilfe={() => {}}
            onKurztasten={() => {}}
            onAnmelden={anmelden}
          />
          <input aria-label="Name" />
        </>
      </MemoryRouter>,
    );
    const eingabe = screen.getByLabelText("Name");
    eingabe.focus();
    altJ(eingabe);
    expect(anmelden).not.toHaveBeenCalled();

    // Gegenprobe: das Tippfeld ist ausdrücklich ausgenommen - dort zählen
    // Alt-Kombis nie als Anschlag, die Kürzel sollen weiter greifen.
    eingabe.setAttribute("data-typing-field", "practice");
    altJ(eingabe);
    expect(anmelden).toHaveBeenCalledTimes(1);
  });

  it("★★ schweigt, solange ein modaler Dialog offen ist", () => {
    const anmelden = vi.fn();
    render(
      <MemoryRouter>
        <>
          <AppKopfzeile
            titel="Punktgenau"
            onHilfe={() => {}}
            onKurztasten={() => {}}
            onAnmelden={anmelden}
          />
          <div role="dialog" aria-modal="true">
            Ein Fenster
          </div>
        </>
      </MemoryRouter>,
    );
    altJ();
    expect(anmelden).not.toHaveBeenCalled();
  });

});
