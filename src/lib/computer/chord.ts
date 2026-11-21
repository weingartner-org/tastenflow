/**
 * im Griff — Akkord-Parser (Motor 1, Phase P2).
 * Zerlegt deutsche Chord-Strings in ein maschinenlesbares Chord-Objekt
 * und prüft KeyboardEvent-Treffer. Kein React-Import nötig — testbar im Node-Kontext.
 *
 * Deutsche Bezeichnungen:
 *   Modifier: Strg=Ctrl · Umschalt=Shift · Alt=Alt · Win=Meta
 *   Sondertasten: Entf/Einfg/Einf/Pos1/Ende/Bild-auf/Bild-ab/Pfeil-auf/…
 *   Funktionstasten: F1…F12 (bleiben wie sie sind)
 *   Buchstaben/Ziffern: Kleinbuchstabe des KeyboardEvent.key-Werts
 *
 * ── macOS (Etappe M1, Bauplan §5.1) ─────────────────────────────────────────
 *   Modifier: Cmd=Meta · Wahl=Alt · ctrl=Ctrl · Umschalt=Shift
 *   Tasten:   Zeilenschalter/Eingabe=Enter · Löschtaste=Backspace ·
 *             Entf=Delete (die VORWÄRTS-Löschtaste — am Mac fn+Löschtaste)
 *   Geschrieben wird in den Mac-Atomen die Mac-Schreibweise („Cmd+C"), unter
 *   Windows die Windows-Schreibweise („Strg+C") — die Anzeige rendert `keys`
 *   roh, es gibt keine Übersetzungsschicht und keine doppelte Wahrheit.
 *
 * ★★ `fn` ist KEIN prüfbarer Modifikator. Die fn-/Globus-Taste erzeugt am Mac
 * gar kein Tastatur-Ereignis (RECHERCHE-05 §5) — eine fn-Kombination lässt sich
 * darum niemals „drücken lassen". fn-Kombinationen sind Wissens- und
 * Wege-Stoff, nie ein `chord`-expect; ein Wächter-Test hält das fest.
 * `Win` bleibt Windows-only (am Mac heißt dieselbe physische Taste Cmd, tut
 * aber etwas völlig anderes — ein gemeinsamer Name wäre eine Fehl-Lehre).
 *
 * Spezialfall „Strg" allein (z. B. bedienungshilfen.sr-stopp):
 *   parseChord("Strg") → { ctrl:true, shift:false, alt:false, meta:false, key:"Control" }
 *   matchesChord erkennt das und prüft korrekt: Ctrl gedrückt, kein anderer Modifier.
 */

import { physischerCode } from "./tastatur";
import type { LayoutId } from "./tastatur";

/** Modifizierter Tastendruck mit allen Modifier-Flags und einem Basis-Key. */
export interface Chord {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  /** Kanonischer KeyboardEvent.key-Wert (z. B. "c", "F2", "Enter", "Delete", "ArrowUp"). */
  key: string;
}

/**
 * Minimales Interface — sowohl KeyboardEvent (DOM) als auch
 * React.KeyboardEvent<Element> erfüllen es.
 */
export interface KeyEventLike {
  key: string;
  code?: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

/** Deutsche Tastenbezeichnung → KeyboardEvent.key-Wert. */
const GERMAN_TO_KEY: Record<string, string> = {
  Entf:          "Delete",
  Einfg:         "Insert",
  Einf:          "Insert",
  Pos1:          "Home",
  Ende:          "End",
  "Bild-auf":    "PageUp",
  "Bild-ab":     "PageDown",
  "Pfeil-auf":   "ArrowUp",
  "Pfeil-ab":    "ArrowDown",
  "Pfeil-links": "ArrowLeft",
  "Pfeil-rechts":"ArrowRight",
  Enter:         "Enter",
  Tab:           "Tab",
  Esc:           "Escape",
  Leer:          " ",
  Space:         " ",
  // M6: In den Mac-Atomen heißt die Taste ausgeschrieben „Leertaste“ — so steht
  // sie in Apples deutschen Kurzbefehlen und so wird sie vorgelesen
  // (`mac.finder.uebersicht` erwartet sie pur).
  Leertaste:     " ",
  Rück:          "Backspace",
  // macOS (M1): die deutschen Apple-Namen, so wie sie in den Mac-Atomen und in
  // den Kinder-Texten stehen (Bauplan §0.3).
  Zeilenschalter:    "Enter",
  Eingabe:           "Enter",
  // ★ T3 (07.08.): Gelehrt wird „Löschtaste" — auf BEIDEN Plattformen derselbe
  // Name (Johannes). Die alten Schreibweisen bleiben als Alias parsbar: Eine
  // übersehene Stelle im Bestand soll nicht stumm zu einem toten Kürzel werden.
  Löschtaste:        "Backspace",
  Rückschritttaste:  "Backspace",
  Rückschritt:       "Backspace",
};

/**
 * Zerlegt einen deutschen Chord-String in ein `Chord`-Objekt.
 *
 * Beispiele:
 *   "Strg+C"          → { ctrl:true,  shift:false, alt:false, meta:false, key:"c" }
 *   "Strg+Umschalt+N" → { ctrl:true,  shift:true,  alt:false, meta:false, key:"n" }
 *   "Alt+Pfeil-auf"   → { ctrl:false, shift:false, alt:true,  meta:false, key:"ArrowUp" }
 *   "Strg"            → { ctrl:true,  shift:false, alt:false, meta:false, key:"Control" }
 *   "F2"              → { ctrl:false, shift:false, alt:false, meta:false, key:"F2" }
 *   "Umschalt+ArrowRight" → { ctrl:false, shift:true, alt:false, meta:false, key:"ArrowRight" }
 */
export function parseChord(str: string): Chord {
  const parts = str.split("+").map((p) => p.trim());
  const chord: Chord = { ctrl: false, shift: false, alt: false, meta: false, key: "" };

  for (const part of parts) {
    if (part === "Strg")     { chord.ctrl  = true; continue; }
    if (part === "Umschalt") { chord.shift = true; continue; }
    if (part === "Alt")      { chord.alt   = true; continue; }
    if (part === "Win")      { chord.meta  = true; continue; }
    // macOS (M1, Bauplan §5.1). „ctrl" klein geschrieben — genau so steht es
    // auf der Apple-Tastatur und in den Kinder-Texten.
    if (part === "Cmd")      { chord.meta  = true; continue; }
    if (part === "Wahl")     { chord.alt   = true; continue; }
    if (part === "ctrl")     { chord.ctrl  = true; continue; }

    // Richtungs-agnostische Wildcards: „Pfeil" = jede Pfeiltaste,
    // „Bild" = Bild-auf ODER Bild-ab. Für Kürzel, die fachlich in jede
    // Richtung gelten (Strg+Pfeil = zum Rand, Strg+Bild = Blattwechsel) —
    // die Ansage sagt dem Kind nur „Pfeil", also darf auch jede zählen.
    if (part === "Pfeil") { chord.key = "Arrow*"; continue; }
    if (part === "Bild")  { chord.key = "Page*";  continue; }

    // Deutsche Sondertaste → KeyboardEvent.key
    const mapped = GERMAN_TO_KEY[part];
    if (mapped !== undefined) {
      chord.key = mapped;
      continue;
    }
    // Funktionstaste: F1…F12 — bleibt wie sie ist
    if (/^F\d{1,2}$/.test(part)) {
      chord.key = part;
      continue;
    }
    // Arrow-Schlüssel schon im KeyboardEvent-Format ("ArrowUp" etc.) — direkt übernehmen
    if (part.startsWith("Arrow")) {
      chord.key = part;
      continue;
    }
    // Einzelzeichen (Buchstabe, Ziffer, Sonderzeichen) → Kleinbuchstabe
    if (part.length === 1) {
      chord.key = part.toLowerCase();
      continue;
    }
    // Alles andere direkt übernehmen (z. B. "Home", "End", "PageUp" in Englisch)
    chord.key = part;
  }

  // Spezialfall: "Strg" allein → Ctrl-Taste selbst als Key
  // Modifier-Flag bleibt gesetzt, damit matchesChord die Sonderbehandlung erkennt.
  if (chord.key === "" && chord.ctrl) {
    chord.key = "Control";
  }

  return chord;
}

/**
 * Prüft, ob ein KeyboardEvent exakt dem geparsten Akkord entspricht.
 * Alle vier Modifier-Flags müssen exakt übereinstimmen.
 *
 * Sonderfälle:
 * - Modifier-Taste als Key (z. B. Strg allein: c.key="Control", c.ctrl=true):
 *   prüft nur, ob die richtige Modifier-Taste gedrückt wurde und kein anderer Modifier aktiv ist.
 * - Einzelzeichen (Buchstabe, Ziffer): Fallback auf e.code (z. B. "Digit6") für
 *   Keyboard-Layout-Unabhängigkeit (deutsches QWERTZ: Shift+6 liefert e.key="&" statt "6").
 *
 * ★ E-O: `layout` sagt, welche TASTATUR vor dem Kind liegt. Es wirkt
 * ausschließlich auf den `e.code`-Rückfall: Auf QWERTZ (de/ch) sind y und z
 * physisch vertauscht, `physicalCode("z")` ist dort `KeyY`. Ohne die Angabe
 * bleibt es beim bisherigen Verhalten (QWERTY-Lage) — jeder Aufruf ohne
 * drittes Argument verhält sich Zeichen für Zeichen wie vor E-O.
 */
export function matchesChord(
  e: KeyEventLike,
  c: Chord,
  layout?: LayoutId,
): boolean {
  // Spezialfall: Modifier-Taste als Key (z. B. Ctrl allein für bedienungshilfen.sr-stopp)
  if (c.key === "Control" && c.ctrl) {
    return e.key === "Control" && !e.shiftKey && !e.altKey && !e.metaKey;
  }
  if (c.key === "Shift" && c.shift) {
    return e.key === "Shift" && !e.ctrlKey && !e.altKey && !e.metaKey;
  }
  if (c.key === "Alt" && c.alt) {
    return e.key === "Alt" && !e.ctrlKey && !e.shiftKey && !e.metaKey;
  }

  // Normale Prüfung: alle Modifier exakt übereinstimmen
  if (e.ctrlKey  !== c.ctrl)  return false;
  if (e.shiftKey !== c.shift) return false;
  if (e.altKey   !== c.alt)   return false;
  if (e.metaKey  !== c.meta)  return false;

  // Taste selbst
  if (c.key === "" ) return false;

  // Richtungs-Wildcard („Arrow*" / „Page*"): jede Taste der Familie zählt.
  if (c.key.endsWith("*")) {
    return e.key.startsWith(c.key.slice(0, -1));
  }

  if (c.key.length === 1) {
    // Buchstabe, Ziffer oder Satzzeichen: erst e.key versuchen, dann e.code
    // als Fallback (Layout-Unabhängigkeit: Shift+6 auf QWERTZ liefert
    // e.key="&", e.code="Digit6"; Umschalt+Punkt liefert e.key=":",
    // e.code="Period" — ohne den Fallback wäre z. B. Strg+Umschalt+.
    // auf deutschen Tastaturen nie erfüllbar; am Mac liefert Wahl+V ein
    // „√" und Wahl+Cmd+V wäre ohne den Fallback ÜBERHAUPT nicht drückbar).
    if (e.key.toLowerCase() === c.key.toLowerCase()) return true;

    /*
     * ★★ Der Fallback gilt NUR, wenn `e.key` selbst kein Buchstabe ist
     * (Tiefentest M14, Fehlerklasse K24).
     *
     * Auf deutschem QWERTZ liegen **y und z physisch vertauscht**: Die Taste
     * mit dem Aufdruck Z meldet `e.code = "KeyY"`, die mit dem Aufdruck Y
     * meldet `e.code = "KeyZ"`. Ein bedingungsloser e.code-Fallback lässt
     * darum JEDE der beiden Tasten BEIDE Akkorde erfüllen — „Cmd+Z"
     * (Rückgängig) und „Cmd+Y" (Wiederholen) wären nicht mehr
     * unterscheidbar. Beide stehen in derselben Mac-Lektion
     * (`mac-l1-word-02`) und im selben Kürzel-Dojo: Ein Kind könnte beide
     * Aufgaben mit demselben Finger lösen und bekäme zweimal „Richtig" —
     * es lernt die Taste also gerade NICHT.
     *
     * Liefert die Tastatur einen Buchstaben, ist die Zuordnung eindeutig und
     * `e.key` allein entscheidet. Der Fallback bleibt genau dort, wofür er
     * gebaut wurde: wenn ein Modifikator aus der Taste ein Sonderzeichen
     * gemacht hat (Umschalt+6 → „&", Umschalt+. → „:", Wahl+V → „√") oder
     * die Tastatur gar keinen Wert liefert („Dead", "Unidentified").
     *
     * ★ E-O: Und WENN er greift, greift er seit der Tastatur-Einstellung zur
     * richtigen physischen Taste. Auf QWERTZ ist `KeyY` die Taste mit dem
     * Aufdruck Z — `physischerCode` weiß das, `Key${…}` allein wusste es nicht.
     *
     * ★★ E3 (12.09.2026): Die Sperre gilt nur für LATEINISCHE Buchstaben.
     * Vorher traf sie jeden Buchstaben - auch „с" (kyrillisch) und „ψ"
     * (griechisch). Mit einer solchen Eingabesprache liefert Strg + C genau
     * diese Zeichen, und die Übung nahm den Griff NIE an: Das Kind drückt
     * richtig, und es passiert nichts. Ein nicht-lateinischer Buchstabe sagt
     * über die lateinische Taste nichts aus - dort entscheidet, wie bei „√"
     * oder „Unidentified", die physische Taste. Für jeden lateinischen
     * Buchstaben bleibt das Urteil Zeichen für Zeichen wie vorher (Nachweis:
     * `tests/computer-e3-dialog-eingabesprache.test.tsx`), Strg + Y bei
     * verlangtem Strg + Z bleibt also abgelehnt.
     */
    if (/^\p{Script=Latin}$/u.test(e.key)) return false;

    const physCode = physischerCode(c.key, layout ?? "us");
    if (physCode && e.code === physCode) return true;
    return false;
  }

  // Sondertasten, Pfeile, F-Tasten, Enter etc. — exakter Vergleich
  return e.key === c.key;
}

/**
 * ★★★★★ WARUM DIESE FUNKTION ES GIBT (gemessen 30.08.2026).
 * ============================================================================
 * `parseChord` setzt `chord.key` in einer Schleife und prüft dabei nie, ob
 * schon eine Basistaste dastand. Die LETZTE gewinnt, still:
 *
 *     parseChord("Einf+F7")  =>  { ctrl:false, …, key:"F7" }   // Einf ist weg
 *     parseChord("Strg++")   =>  { ctrl:true,  …, key:"Control" }  // + ist weg
 *
 * Gegengeprobt mit `matchesChord`: Ein Kind, das bei `Einf+F7` nur **F7**
 * drückt, bekommt „richtig". Bei `Strg++` genügt **Strg allein** — dieselbe
 * Antwort, die `bedienungshilfen.sr-stopp` verlangt. Beide Kombinationen
 * bedeuten für die App also etwas anderes, als in ihnen steht.
 *
 * ⚠️ **Heute ist nichts kaputt, und das ist gemessen:** Kein einziges
 * `chord`-Atom trägt so ein `expect` (die 13 Atome mit Screenreader-Taste im
 * `keys`-Feld sind alle `procedure`). Diese Funktion repariert nichts - sie
 * ist eine RATSCHE für das, was als Nächstes gebaut wird.
 *
 * ★★★★ Denn genau das steht an: Von den 163 Kandidaten der Vergleichsliste
 * sind rund 33 Screenreader-Befehle (`Einf+F7`, `NVDA+Leertaste`), und §2.7
 * des Bauplans will fünf Trainingsbereiche daraus machen. Ohne diese Prüfung
 * würde das erste solche Atom lautlos die falsche Taste abfragen - und der
 * Wächter wäre grün. Das ist die Fehlerklasse aus §2a: **ein Beleg für das
 * Gegenteil.**
 *
 * ⚠️ Und sie trifft nicht nur die App: `pruefstand/durchreiche` baut seinen
 * Tastendruck aus derselben `parseChord`. Ein Messlauf über `Einf+F7` hätte
 * **F7 gedrückt** und „kommt an" ins Protokoll geschrieben.
 *
 * Absichtlich KEIN Fehler zur Laufzeit: `parseChord` verhält sich für alles,
 * was heute existiert, Zeichen für Zeichen wie vorher. Wer eine unklare
 * Kombination anlegt, erfährt es vom Wächter-Test - nicht ein Kind mitten in
 * einer Übung.
 *
 * ⇒ Die Screenreader-Taste ALS MODIFIKATOR ist damit nicht gebaut, sondern
 * nur abgesperrt. Das ist die offene Entscheidung: Bekommt `Chord` ein
 * fünftes Feld, oder bleiben Screenreader-Befehle `procedure`?
 *
 * @returns den Grund, warum die Zeichenkette kein eindeutiger Akkord ist -
 *          oder `null`, wenn sie einer ist.
 */
export function warumKeinAkkord(str: string): string | null {
  const teile = str.split("+").map((p) => p.trim());
  // Eine leere Stelle entsteht nur, wenn „+" selbst die Taste sein soll
  // („Strg++"). `parseChord` verliert sie ersatzlos.
  if (teile.some((t) => t === "") && str.trim() !== "+") {
    return `„${str}“ meint die Plus-Taste - parseChord verliert sie ersatzlos`;
  }
  const MODIFIKATOREN = new Set(["Strg", "Umschalt", "Alt", "Win", "Cmd", "Wahl", "ctrl"]);
  const basis = teile.filter((t) => !MODIFIKATOREN.has(t));
  if (basis.length > 1) {
    return `„${str}“ nennt ${basis.length} Basistasten (${basis.join(", ")}) - parseChord behält nur „${basis[basis.length - 1]}“`;
  }
  return null;
}
