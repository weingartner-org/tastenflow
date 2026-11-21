/**
 * Werkzeug für die Tests, die eine GANZE Übungsrunde durchtippen
 * (`typing-runde-probelauf`, `typing-page` > Geschichten-Hauptweg).
 *
 * ── Warum es diese Datei gibt (gemessen 08.09.2026) ────────────────────────
 *
 * Diese Tests scheiterten am 60-Sekunden-Zeitablauf - erst nur unter Last,
 * dann auch allein. Gemessen wurde, statt geraten; ein CPU-Profil eines
 * einzelnen Tipp-Durchlaufs sagt:
 *
 *     440 Anschläge × 128 ms = 56,3 s   ← 83 % der Laufzeit
 *     Wartezeit zwischen den Zeilen      9,1 s   ← 13 %
 *     Aufbau der Seite                   2,6 s   ←  4 %
 *
 * Ein einzelner Tastendruck kostete also 128 ms. Davon entfielen keine 3 % auf
 * den geprüften Code - dafür 20,7 % auf `cssstyle` und 9,4 % auf
 * `@asamuzakjp/css-color`: **CSS-Farben parsen**. Die Ursache ist die
 * Bildschirm-Tastatur (`KeyboardPanel`): Sie zeichnet bei jedem Anschlag rund
 * fünfzig Tasten neu (die nächste Taste wechselt ja), **zweimal** - einmal als
 * unsichtbare Messvorlage, einmal sichtbar -, und jede Taste trägt ein
 * `style={{ borderColor, background }}`. jsdom muss jede dieser Farben durch
 * seinen CSS-Parser schicken. Das ist im Browser billig und in jsdom teuer.
 *
 * Die Tastatur ist ausdrücklich `aria-hidden` - eine rein optische Hilfe. Für
 * die Frage „wie lang ist die Runde?" trägt sie nichts bei. Sie wird hier
 * darum abgeschaltet, über denselben Schalter, den auch ein Kind hat.
 *
 * GEMESSEN, derselbe Durchlauf mit und ohne:
 *     Tastatur AN : 451 Anschläge · 139,1 ms/Anschlag · 74,4 s
 *     Tastatur AUS: 481 Anschläge ·  17,0 ms/Anschlag · 18,8 s
 * Im Profil fällt `cssstyle` dabei von 20,7 % auf 0,1 %.
 *
 * ⚠️ WO ES NICHTS BRINGT (auch gemessen, damit es niemand blind überall
 * einbaut): beim SEITENAUFBAU. Sieben Aufbauten mit und sieben ohne Tastatur,
 * im selben Lauf, ergaben einen Median von 2422 ms gegen 2421 ms - kein
 * Unterschied, die Streuung war reines Lastrauschen. Der Gewinn steckt allein
 * im Neuzeichnen JE ANSCHLAG. Dateien, die viel rendern und wenig tippen
 * (`typing-fokusziele`, `typing-taste-vor-spiel`), haben davon nichts; dort
 * wurde der Handgriff nach der Messung wieder zurückgenommen.
 *
 * ⚠️ WARUM KEINE GEFÄLSCHTEN ZEITGEBER (`vi.useFakeTimers`). Der naheliegende
 * Weg für die 9,1 s Wartezeit wurde erprobt und verworfen - er ist eine Falle:
 * `findBy…` und `waitFor` von Testing Library **hängen unter Vitests
 * Fake-Timern**, selbst wenn die Bedingung längst erfüllt ist (gemessen: beide
 * liefen in den Zeitablauf, während dieselbe Prüfung mit echten Zeitgebern in
 * 330 ms durchlief). Testing Library erkennt nur Jests Fake-Timer und dreht
 * die Uhr sonst nicht weiter. Wer sie hier einführt, tauscht eine
 * Lastabhängigkeit gegen ein sicheres Hängenbleiben.
 *
 * Statt eines festen Schlafs wird darum auf den ECHTEN Zeilenwechsel gewartet
 * (siehe `naechsteZeile`) - der dauert so lange wie er dauert, nicht 700 ms.
 *
 * ⚠️ NACHGEMESSEN 11.09.2026: Eingebaut wurde `naechsteZeile` damals in KEINEN
 * Test. `typing-page` (Geschichten-Hauptweg) und `typing-runde-probelauf`
 * warten weiter fest 700 ms je Zeile. Die Hilfe benutzen
 * `tastenflow-anschlaege-zeilenwechsel` und ihr Wächter
 * `typing-probelauf-hilfe`.
 */
import { useTypingA11y } from "@/lib/typing/a11y";

/**
 * Die Bildschirm-Tastatur ausblenden - denselben Schalter benutzt ein Kind in
 * den Einstellungen. Gehört in `beforeEach`, VOR dem `render`.
 *
 * ⚠️ Nebenwirkung mit Ansage: Eine fehlerfreie Runde ohne Tastatur verdient
 * das Abzeichen „Blindflug" (`badges.ts`). Für die Zeilenzählung ist das ohne
 * Belang - sie endet, bevor die Abschlusskarte steht.
 */
export function ohneBildschirmTastatur(): void {
  useTypingA11y.getState().setTastaturOffen(false);
}

/**
 * Woran das Übungsfeld erkannt wird: an seiner MARKE, nicht am Elementnamen.
 *
 * ── Warum (gemessen 11.09.2026) ────────────────────────────────────────────
 *
 * Bis dahin stand hier `input[type="text"], input:not([type])`. Seit dem
 * 10.09.2026 ist das Übungsfeld ein `<textarea>` (Braillezeilen-Umbau,
 * `BEFUND-2026-09-10-BRAILLEZEILE-OHNE-KONTEXT.md`). Die Suche fand nichts
 * mehr, und `naechsteZeile` las „kein Feld" als „Runde vorbei": gemessen
 * `false` nach 0 ms, während die Runde weiterlief und Zeile 2 kurz darauf
 * dastand. Ein Netz, das nichts fängt, sieht aus wie ein grüner Test.
 *
 * Darum zweierlei: Gesucht wird über `data-typing-field="practice"` - dieselbe
 * Marke, an der `TippenTrainerPage` das Feld für die Alt-Kürzel erkennt. Und
 * FEHLT das Feld, ist das kein Ergebnis, sondern ein Fehler.
 */
export const TIPPFELD = '[data-typing-field="practice"]';

/** Das Übungsfeld, oder `null`, wenn gerade keines im Dokument steht. */
export function tippfeld(): HTMLTextAreaElement | null {
  return document.querySelector<HTMLTextAreaElement>(TIPPFELD);
}

/** Das Übungsfeld. Fehlt es, scheitert der Aufruf LAUT - samt dem, was stattdessen da ist. */
export function tippfeldPflicht(wer = "tippfeldPflicht"): HTMLTextAreaElement {
  const feld = tippfeld();
  if (!feld) throw new Error(`${wer}: kein Übungsfeld ${TIPPFELD} im Dokument. ${wasDaIst()}`);
  return feld;
}

/**
 * Die Abschlusskarte der Runde - erkannt an ihrer Sternwertung
 * (`role="img"`, „2 von 3 Sternen", `TypingSession.tsx`), die auf der
 * Tastenflow-Seite nur dort steht. Das ist das POSITIVE Zeichen für „Runde
 * vorbei"; ein fehlendes Feld ist keines.
 *
 * ⚠️ Ändert sich der Wortlaut der Sternwertung, findet diese Suche nichts mehr.
 * Dann meldet `naechsteZeile` nicht still „vorbei", sondern scheitert am
 * Zeitablauf mit einer Beschreibung dessen, was im Dokument steht.
 *
 * ★ 12.09.2026: auch die englische Bedienung („2 of 3 stars", Probestück,
 * `tests/tastenflow-englische-bedienung.test.tsx`).
 */
export function abschlussKarte(): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>('[role="img"][aria-label]')) {
    if (/^\d (von 3 Sternen|of 3 stars)$/.test(el.getAttribute("aria-label") ?? "")) {
      return el.closest<HTMLElement>(".card") ?? el;
    }
  }
  return null;
}

/** Für Fehlermeldungen: welche Eingabefelder, welche Zeilen-Marke, ob eine Abschlusskarte. */
function wasDaIst(): string {
  const felder = [...document.querySelectorAll("input, textarea, [contenteditable]")].map((el) => {
    const marke = el.getAttribute("data-typing-field") ?? el.getAttribute("data-feld");
    return `<${el.tagName.toLowerCase()}${marke ? ` ${marke}` : ""}>`;
  });
  return (
    `Eingabefelder im Dokument: ${felder.length ? felder.join(", ") : "keine"} · ` +
    `data-aufgabe: "${zeilenMarke()}" · Abschlusskarte: ${abschlussKarte() ? "da" : "keine"}.`
  );
}

/**
 * Auf die NÄCHSTE Zeile warten, statt eine Pause abzusitzen.
 *
 * Nach einer geschafften Zeile wartet der Trainer 550 ms (Lob + Weiter-
 * schalten, `TypingSession.tsx`). Gewartet wird auf die Marke
 * `data-aufgabe="zeile-N"`, die die Aufgaben-Karte trägt: Sie wechselt genau
 * dann, wenn wirklich weitergeschaltet wurde.
 *
 * Rückgabe: `true`, wenn eine neue Zeile da ist; `false` NUR, wenn die
 * Abschlusskarte steht (`abschlussKarte`).
 *
 * WIRFT, statt etwas zu melden,
 *  - wenn beim Aufruf weder ein Übungsfeld noch eine Abschlusskarte da ist
 *    (wer auf die nächste Zeile wartet, hat eben in einem Feld getippt), und
 *  - wenn bis `grenzeMs` weder eine neue Zeile noch die Abschlusskarte kommt.
 */
export async function naechsteZeile(vorher: string, grenzeMs = 5000): Promise<boolean> {
  if (!tippfeld() && !abschlussKarte()) {
    throw new Error(`naechsteZeile: weder Übungsfeld ${TIPPFELD} noch Abschlusskarte. ${wasDaIst()}`);
  }
  const bis = Date.now() + grenzeMs;
  for (;;) {
    const jetzt = zeilenMarke();
    if (jetzt && jetzt !== vorher) return true;
    if (abschlussKarte()) return false;
    if (Date.now() > bis) {
      throw new Error(
        `naechsteZeile: nach ${grenzeMs} ms weder eine neue Zeile (Marke vorher "${vorher}") ` +
          `noch die Abschlusskarte. ${wasDaIst()}`,
      );
    }
    await new Promise((r) => setTimeout(r, 15));
  }
}

/** Die Marke der gerade gezeigten Zeile („zeile-3"), oder "" wenn keine da ist. */
export function zeilenMarke(): string {
  return document.querySelector("[data-aufgabe]")?.getAttribute("data-aufgabe") ?? "";
}

/**
 * Die vom Trainer ANGEKÜNDIGTE Rundenlänge, aus der Ansage für Sprachausgaben
 * („Zeile 1 von 12", `TypingSession.tsx`). Das ist `items.length` der laufenden
 * Runde - die Zahl also, nachdem sie den ganzen Weg durch `useMemo`, den
 * Themenstrang-Plan und `weaveArcGroups` hinter sich hat.
 */
export function angekuendigteRundenlaenge(): number | null {
  for (const el of document.querySelectorAll("span.sr-only")) {
    const m = /^\s*Zeile\s+\d+\s+von\s+(\d+)\s*$/.exec(el.textContent ?? "");
    if (m) return Number(m[1]);
  }
  return null;
}

/**
 * Alle Ansagen MITSCHREIBEN, statt den Live-Bereich zu einem Zeitpunkt
 * abzulesen.
 *
 * ── Warum (gemessen 08.09.2026) ────────────────────────────────────────────
 *
 * Der Live-Bereich hält immer nur die JÜNGSTE Ansage: `pushLive` löscht ihn
 * und schreibt 50 ms später den Text (damit NVDA gleiche Folgemeldungen erneut
 * vorliest). Nach einer geschafften Zeile steht dort also „Geschafft." - aber
 * nur bis der Trainer 550 ms später weiterschaltet und das erste Zeichen der
 * NÄCHSTEN Zeile ansagt.
 *
 * Wer den Bereich abliest, muss dieses Fenster von einer halben Sekunde
 * treffen. Unter Last verpasst er es: Der Test „tippt eine Zeile fehlerfrei
 * durch" fiel mit `expected 'j' to contain 'Geschafft'` - 'j' war das erste
 * Zeichen der Folgezeile. Er prüfte damit nicht mehr, OB gemeldet wird,
 * sondern wie schnell der Rechner gerade ist.
 *
 * Mitgeschrieben wird über einen `MutationObserver`: Was einmal angesagt
 * wurde, bleibt in der Liste - `waitFor` kann es nicht mehr verpassen.
 */
export function ansagenMitschreiben(): { texte: string[]; stopp: () => void } {
  const texte: string[] = [];
  const el = document.querySelector('[role="status"]');
  if (!el) return { texte, stopp: () => {} };
  const merken = () => {
    const t = (el.textContent ?? "").trim();
    if (t && texte[texte.length - 1] !== t) texte.push(t);
  };
  merken();
  const beobachter = new MutationObserver(merken);
  beobachter.observe(el, { childList: true, characterData: true, subtree: true });
  return { texte, stopp: () => beobachter.disconnect() };
}
