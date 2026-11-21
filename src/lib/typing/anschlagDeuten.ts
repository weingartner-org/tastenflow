/**
 * ★★★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2, §3.8 Punkt 2):
 * WAS HAT DIESER ANSCHLAG WIRKLICH ERZEUGT?
 *
 * Bis hierher nahm die Übungszeile ein Zeichen nur auf dem Weg an, den ihr
 * Tastaturmodell (`layouts.ts`, `access`) kannte. Kannte das Modell eine
 * Totaste nicht, war ihr `Dead`-Ereignis sofort ein Fehlgriff, und das danach
 * richtig zusammengesetzte Zeichen wurde verschluckt. Gemessen am 27.09. an
 * Windows 11 (Edge 154, Chrome 153): Auf „Frankreich AZERTY" stand schon in
 * der ERSTEN Zeile nach der Einrichtung ein „Ù" - auf Windows nur über AltGr + 7
 * (Totaste `) und dann Umschalt + U zu schreiben. Die Zeile war auf keinem Weg
 * lösbar (viermal an einem Tag, nicht ein Randfall). Dasselbe auf
 * Schweiz-Französisch für jeden Satz mit À/É/È am Anfang.
 *
 * Johannes' Entscheidung (§3.8): **Jedes richtig entstandene Zeichen wird
 * angenommen, egal auf welchem Weg; eine Totaste ist KEIN Fehler, bewertet
 * wird erst das fertige Zeichen.** Diese Datei deutet darum den Anschlag
 * selbst - nicht gegen das Modell, sondern gegen das, was der Browser meldet.
 * Das Modell braucht es nur noch, um der Totaste einen NAMEN zu geben
 * („Zirkumflex wartet") und um eine leere AltGr-Ebene zu erkennen.
 *
 * ── Die gemessenen Folgen (Windows, Edge 154 = Chrome 153, Befund Teil 2) ──
 *  1. `^` dann `e`:      keydown Dead · keydown „ê" · input „ê"
 *  2. `^` dann `p`:      keydown Dead · keydown „p" · input „^" · input „p"
 *                         (EIN keydown, ZWEI Zeichen - das „^" steht nur im input)
 *  3. `^` dann Leertaste: keydown Dead · keydown „^" (code Space) · input „^"
 *  4. Belgien AltGr + 7:  keydown „è" (AltGraph an) - KEIN input. Die AltGr-
 *                         Ebene der Taste ist leer; der Browser meldet die
 *                         Grundbeschriftung. Eine Regel „keydown mit einem
 *                         Zeichen = getippt" erfände hier ein „è".
 *  5. Mac Safari/Firefox (BEFUND-2026-09-25-E1): nach einer Totaste ein
 *     ZWEI-Zeichen-`key` („^p") statt eines einzelnen.
 *
 * Die Übungszeile verhindert jede echte Eingabe (`onBeforeInput`), darum gibt
 * es dort nie ein `input`-Ereignis - alles steht im keydown, und Folge 2 ist
 * nur zu erkennen, weil die Totaste davor gemerkt ist.
 *
 * ⚠️ Reine Funktion, kein Zustand: Wer sie aufruft, trägt die „offene
 * Totaste" von Anschlag zu Anschlag selbst weiter (`useTypingItem`,
 * `useExpedition`). Wächter: `tests/tastenflow-w1-anschlag-deuten.test.ts`
 * (jede Folge oben wörtlich).
 */
import type { KeyboardLayout } from "./layouts";

// --- Welche Taste liegt an welchem `code`? -------------------------------------
//
// ★ `code` benennt die physische Stelle (die Stelle auf einer US-Tastatur),
// layoutunabhängig; `layout.rows` steht in physischer Reihenfolge. Gemessen
// (Befund Teil 1, Edge und Chrome): Scancode 0C = Minus, 0D = Equal,
// 1A = BracketLeft, 1B = BracketRight, 27 = Semicolon, 28 = Quote,
// 29 = Backquote, 2B = Backslash, 35 = Slash, 56 = IntlBackslash.
// Dieselbe Tabelle zeichnet die gedrückte Taste in der Bildschirm-Tastatur
// (`Keyboard.tsx` importiert sie von hier - EINE Tabelle, nicht zwei).
//  • `Backslash` ist bei ANSI die 13. Taste der oberen Reihe, bei ISO die 12.
//    der Grundreihe - es passt immer genau eine Stelle.
//  • `IntlBackslash` (ISO) steht vorn in der unteren Reihe; die untere Reihe
//    zählt darum von RECHTS.
//  • ★★★ G4-NAHT (25.10.2026, Befund G3b §5): `IntlRo` (Scancode 73) ist die
//    Zusatztaste ganz rechts in der unteren Reihe, links neben Umschalt rechts -
//    auf der brasilianischen ABNT2-Tastatur `/` und `?` (Windows-Tabelle
//    KBDBR). Sie steht als `zusatzRechts` neben den Codes: Eine Tastatur hat sie
//    genau dann, wenn ihre untere Reihe EINE Taste mehr trägt, als die Codes
//    zählen (ABNT2: 12 statt 11). Für jede andere Tastatur rechnet die Tabelle
//    Zeichen für Zeichen wie vorher (`IntlRo` trifft dort keine Taste).
export interface ReiheCodes {
  readonly codes: readonly string[];
  readonly zaehltVon: "links" | "rechts";
  /** Eine Zusatztaste rechts AUSSERHALB von `codes` (nur untere Reihe: `IntlRo`). */
  readonly zusatzRechts?: string;
}
export const REIHEN_CODES: readonly ReiheCodes[] = [
  {
    codes: [
      "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6",
      "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal",
    ],
    zaehltVon: "links",
  },
  {
    codes: [
      "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP",
      "BracketLeft", "BracketRight", "Backslash",
    ],
    zaehltVon: "links",
  },
  {
    codes: [
      "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL",
      "Semicolon", "Quote", "Backslash",
    ],
    zaehltVon: "links",
  },
  {
    codes: [
      "IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM",
      "Comma", "Period", "Slash",
    ],
    zaehltVon: "rechts",
    zusatzRechts: "IntlRo",
  },
];

/** ★ G4-NAHT: alle Codes der vier Buchstabenreihen, samt Zusatztasten - je einmal (`Backslash` steht in zwei Reihen). */
export const TASTEN_CODES: readonly string[] = [
  ...new Set(REIHEN_CODES.flatMap((r) => (r.zusatzRechts ? [...r.codes, r.zusatzRechts] : [...r.codes]))),
];

/** Reihe und Spalte der Taste mit diesem `code` auf diesem Layout - oder `null`. */
export function stelleFuerCode(
  layout: KeyboardLayout,
  code: string | undefined,
): { reihe: number; spalte: number } | null {
  if (!code) return null;
  for (let r = 0; r < REIHEN_CODES.length; r++) {
    const { codes, zaehltVon, zusatzRechts } = REIHEN_CODES[r];
    const anzahl = layout.rows[r]?.keys.length ?? 0;
    // ★ G4-NAHT: trägt die Reihe eine Taste mehr als die Codes zählen, ist die letzte die Zusatztaste.
    const mitZusatz = zusatzRechts !== undefined && anzahl === codes.length + 1;
    if (code === zusatzRechts) {
      if (mitZusatz) return { reihe: r, spalte: anzahl - 1 };
      continue;
    }
    const i = codes.indexOf(code);
    if (i < 0) continue;
    const n = mitZusatz ? anzahl - 1 : anzahl;
    const spalte = zaehltVon === "links" ? i : i - (codes.length - n);
    if (spalte >= 0 && spalte < n) return { reihe: r, spalte };
  }
  return null;
}

/** Die Beschriftung (Grundebene) der Taste mit diesem `code` - oder `null`. */
export function tasteFuerCode(layout: KeyboardLayout, code: string | undefined): string | null {
  const s = stelleFuerCode(layout, code);
  return s ? layout.rows[s.reihe].keys[s.spalte] : null;
}

// --- Totasten ------------------------------------------------------------------

/**
 * Das kombinierende Zeichen je Totaste - daran wird erkannt, ob der Browser
 * nach einer Totaste ein ZUSAMMENGESETZTES Zeichen gemeldet hat („ê" zerfällt
 * in e + U+0302) oder nur den nackten zweiten Buchstaben (Folge 2: „p").
 */
const KOMBINIEREND: Readonly<Record<string, string>> = {
  "^": "̂",
  "¨": "̈",
  "`": "̀",
  "´": "́",
  "~": "̃",
  "¸": "̧",
  // ★ F3-cs: der Háček (Caron, U+030C) - ď ť ň č š ř ž ě zerfallen in Buchstabe + U+030C. Ohne diesen Eintrag
  // hielte `traegtAkzent` das richtige „ď" nach der Totaste für den nackten zweiten Buchstaben (Fehlgriff).
  "ˇ": "̌",
};

/**
 * ★★★ G3a-SCHRIFT (25.10.2026, Falle 55: eine Totaste ist nie ein Fehler, jedes richtig entstandene Zeichen zählt): die
 * Totasten der neun Sprachen des Gerüsts, die KEINE Tastatur der acht Sprachen davor als Totaste führt - für deren
 * Tastaturen ändert sich darum nichts. Ohne diese Einträge wäre jedes „ά" nach dem griechischen Tonos ein Fehlgriff
 * gewesen. Je Totaste ALLE Folgen kombinierender Zeichen, die sie bildet (Windows-Tabellen, `DLL-TABELLEN-8-SPRACHEN.txt`):
 *  · `΄` Tonos (U+0384, el) ⇒ U+0301 · `΅` Dialytika mit Tonos (U+0385, el) ⇒ U+0308 U+0301 (ΐ ΰ - ZWEI Zeichen daran)
 *  · `'` und `"` auf US-International (nl-intl) ⇒ U+0301 bzw. U+0327 (ç) und U+0308
 *  · AltGr-Totasten von hu und ro (kein Lernziel, aber ein Druck aus Versehen darf nicht hängen): `˘` U+0306, `˝` U+030B,
 *    `˛` U+0328, `˙` U+0307.
 * ⚠️ NICHT dabei: `°` (Kroužek, U+030A) - die tschechische Tastatur führt ihn schon als Totaste, ein Eintrag änderte dort
 * das Verhalten (heute: Totaste `°`, dann u ⇒ Fehlgriff „°u" statt ů). Offen für den Chat (Befund G3a-SCHRIFT §6).
 */
const KOMBINIEREND_NEU: Readonly<Record<string, readonly string[]>> = {
  "΄": ["́"],
  "΅": ["̈́"],
  "'": ["́", "̧"],
  "\"": ["̈"],
  "˘": ["̆"],
  "˝": ["̋"],
  "˛": ["̨"],
  "˙": ["̇"],
};

/**
 * ★★★ G4-NAHT (25.10.2026, Falle 55): die Totasten, nach denen ein nicht zusammensetzbarer Buchstabe BEIDE Zeichen schreibt
 * und das in einer Zeile richtig sein kann - US-International (`nl-intl`): `'` + s = „'s" (auto's, zo'n, 's avonds), `"` + D =
 * „"D". Bauplan NL N4/N20 plant genau diese Folgen. Bewusst NUR die Totasten aus {@link KOMBINIEREND_NEU} (keine Tastatur
 * der acht Sprachen vor dem 25.10.2026 führt sie als Totaste ⇒ deren Wege bleiben Byte für Byte; „^p" auf Deutsch bleibt
 * ein Fehlgriff, wie gemessen und entschieden).
 */
const TOTASTEN_MIT_DURCHSCHLAG: ReadonlySet<string> = new Set(Object.keys(KOMBINIEREND_NEU));

/** Die Zeichen, die eine Totaste mit der Leertaste allein ergibt (Folge 3). */
// ★ G3a-SCHRIFT: bewusst NUR die alten Schlüssel - ein `'` nach einer UNBEKANNTEN Totaste bleibt, was es war.
const AKZENT_ALLEIN = new Set(Object.keys(KOMBINIEREND));

/**
 * Ist `zeichen` ein Buchstabe mit genau dieser Totaste (bzw. mit irgendeiner, wenn `tot` unbekannt ist)?
 *
 * ★ G3a-SCHRIFT (25.10.2026): die Zerlegung (NFD) ist hier RICHTIG, auch für й, ї, ő, ă, å: gefragt ist nur, ob das
 * Zeichen, das der Browser NACH einer offenen Totaste meldet, deren Zeichen trägt - und dann hat die Totaste es gebildet
 * (ungarisch AltGr + `˝`, dann o ⇒ ő ist richtig entstanden). Auf den Tastaturen, deren Buchstaben solche Zeichen SIND
 * (bg, uk: keine Totaste; hu, ro, sv: eigene Tasten), kommt der Buchstabe ohne offene Totaste und erreicht diese Prüfung
 * nie. Wo „й ist kein и + Breve" zählt, fragt `eigenerBuchstabe` (sprachRegister.ts).
 */
function traegtAkzent(zeichen: string, tot: string | null): boolean {
  const zerlegt = zeichen.normalize("NFD");
  if (zerlegt.length < 2) return false;
  const zeichenDesAkzents = zerlegt.slice(1);
  if (tot === null) return /^[̀-ͯ]+$/.test(zeichenDesAkzents);
  const mark = KOMBINIEREND[tot];
  if (mark !== undefined) return zeichenDesAkzents === mark;
  return (KOMBINIEREND_NEU[tot] ?? []).includes(zeichenDesAkzents);
}

/**
 * Welche Totaste ist das? Aus der gedrückten STELLE (`code`) und den
 * Zusatztasten, nachgeschlagen im Modell der Tastatur. `null`, wenn das
 * Modell an dieser Stelle keine Totaste kennt - angenommen wird das
 * entstehende Zeichen trotzdem (Entscheidung §3.8), nur der Name fehlt dann.
 */
export function totasteAusAnschlag(
  layout: KeyboardLayout,
  code: string | undefined,
  umschalt: boolean,
  altGr: boolean,
): string | null {
  const taste = tasteFuerCode(layout, code);
  if (taste === null) return null;
  const mod = altGr ? "altgr" : umschalt ? "shift" : undefined;
  for (const [zeichen, zugang] of Object.entries(layout.access)) {
    if (zugang.dead === true && zugang.base === taste && zugang.mod === mod) return zeichen;
  }
  return null;
}

// --- Die Deutung -----------------------------------------------------------------

/** Das Nötige eines Tastendrucks - passt auf React- und DOM-Ereignisse und auf Testdaten. */
export interface Anschlag {
  key: string;
  code?: string;
  shiftKey?: boolean;
  /** AltGr gehalten? (`getModifierState("AltGraph")`, sonst Strg + Alt unter Windows.) */
  altGr?: boolean;
}

/** Eine gedrückte Totaste, deren Zeichen noch nicht feststeht. */
export interface OffeneTotaste {
  /** Das Akzentzeichen („^"), oder `null`, wenn das Modell die Taste nicht kennt. */
  tot: string | null;
}

export type Deutung =
  /** Eine Totaste wartet auf den nächsten Anschlag - kein Fehler, nichts zu werten. */
  | { art: "totaste"; tot: string | null }
  /** Es ist genau dieses Zeichen entstanden - jetzt mit dem Ziel vergleichen. */
  | { art: "zeichen"; zeichen: string }
  /**
   * Es ist sicher NICHT ein einzelnes richtiges Zeichen entstanden: Totaste +
   * nicht zusammensetzbarer Buchstabe („^p"), oder eine leere AltGr-Ebene
   * (`eingabe` ist dann leer). Ein Fehlgriff, EINER.
   */
  | {
      art: "fehlgriff";
      eingabe: string;
      /**
       * ★★★ G4-NAHT (25.10.2026, Falle 55): nur nach einer Totaste der neun Gerüst-Sprachen ({@link TOTASTEN_MIT_DURCHSCHLAG},
       * die keine Tastatur der acht Sprachen davor führt): die ZWEI Zeichen, die Windows dann wirklich schreibt (`'` + s = „'s"
       * auf US-International). Steht genau diese Folge in der Zeile („auto's", „zo'n"), ist sie richtig entstanden - der Aufrufer
       * nimmt beide an. Sonst bleibt es EIN Fehlgriff wie bisher.
       */
      durchschlag?: string;
    }
  /** Eine benannte Taste (Umschalt, Enter, Pfeile …) - der Aufrufer entscheidet. */
  | { art: "sondertaste" };

/**
 * ★★★ G4-NAHT (25.10.2026, Befund G3b §2 el-220): Zeichen, die Unicode als GLEICH führt und die jede Normalisierung (NFC) in
 * ein anderes verwandelt - das griechische Fragezeichen U+037E ist kanonisch `;` (U+003B), die Ano Teleia U+0387 ist `·`
 * (U+00B7). Die Texte stehen in NFC, darin gibt es U+037E nicht; die Taste Q der Tastatur „Greek (220)" meldet aber U+037E
 * (gemessen, Edge). Ohne diese Zeile wäre jedes richtig getippte Fragezeichen dort ein Fehlgriff (Falle 55).
 * Bewusst eine kleine Tabelle statt `normalize("NFC")` für jeden Anschlag: so ist sicher, dass auf keiner anderen Tastatur
 * ein Zeichen anders gewertet wird als vorher.
 */
const SOLL_GLEICH: Readonly<Record<string, string>> = {
  "\u037E": ";",
  "\u0387": "\u00B7",
};

/** ★ G4-NAHT: das Zeichen, als das ein gemeldeter Anschlag mit der (NFC-)Zeile verglichen wird. */
export function alsSollZeichen(key: string): string {
  return SOLL_GLEICH[key] ?? key;
}

/** Umschalt, Strg, Alt, AltGr, Feststell, Befehl: lassen eine offene Totaste offen. */
const ZUSATZTASTEN = new Set([
  "Shift", "Control", "Alt", "AltGraph", "CapsLock", "Meta", "OS", "Fn",
]);

/** Benannte Tasten (UI-Events: ASCII-Wort mit Grossbuchstaben vorn, z. B. „Shift", „F5"). */
const BENANNTE_TASTE = /^[A-Z][A-Za-z0-9]*$/;

/**
 * Einen Anschlag deuten. `offen` ist die Totaste, die beim VORIGEN Anschlag
 * gedrückt wurde (oder `null`); zurück kommt die Deutung UND der neue Stand
 * der offenen Totaste, den der Aufrufer für den nächsten Anschlag aufhebt.
 */
export function deuteAnschlag(
  a: Anschlag,
  offen: OffeneTotaste | null,
  layout: KeyboardLayout,
): { deutung: Deutung; offen: OffeneTotaste | null } {
  // ★ G4-NAHT: Zeichen, die in jedem Text nach NFC ein ANDERES sind (griechisches Fragezeichen U+037E ⇒ `;`), als das gewertet.
  const key = alsSollZeichen(a.key);

  // Die Totaste selbst: ein Zwischenzustand. ⚠️ Zweimal hintereinander ist
  // unter Windows UNGEMESSEN - bewusst nicht als Fehler gewertet (wer nicht
  // misst, bestraft nicht); die neue Totaste wartet, der nächste Anschlag
  // entscheidet.
  if (key === "Dead") {
    const tot = totasteAusAnschlag(layout, a.code, !!a.shiftKey, !!a.altGr);
    return { deutung: { art: "totaste", tot }, offen: { tot } };
  }

  if (key.length !== 1) {
    if (ZUSATZTASTEN.has(key)) return { deutung: { art: "sondertaste" }, offen };
    if (BENANNTE_TASTE.test(key)) return { deutung: { art: "sondertaste" }, offen: null };
    // Folge 5 (Mac Safari/Firefox): „^p" - zwei Zeichen, also nie eines richtig.
    return { deutung: { art: "fehlgriff", eingabe: key }, offen: null };
  }

  if (offen) {
    // Folge 3: Totaste + Leertaste ergibt den Akzent allein („^").
    if (key === offen.tot || (offen.tot === null && AKZENT_ALLEIN.has(key))) {
      return { deutung: { art: "zeichen", zeichen: key }, offen: null };
    }
    // Folge 1: das fertige, zusammengesetzte Zeichen („ê", „Ù").
    if (traegtAkzent(key, offen.tot)) {
      return { deutung: { art: "zeichen", zeichen: key }, offen: null };
    }
    // Folge 2: nur der nackte zweite Buchstabe - entstanden ist „^p".
    const eingabe = (offen.tot ?? "") + key;
    if (offen.tot !== null && TOTASTEN_MIT_DURCHSCHLAG.has(offen.tot)) {
      return { deutung: { art: "fehlgriff", eingabe, durchschlag: eingabe }, offen: null };
    }
    return {
      deutung: { art: "fehlgriff", eingabe },
      offen: null,
    };
  }

  // Folge 4: AltGr auf einer Taste mit LEERER AltGr-Ebene - der Browser meldet
  // die Grundbeschriftung, entstanden ist nichts.
  if (a.altGr && tasteFuerCode(layout, a.code) === a.key) {
    return { deutung: { art: "fehlgriff", eingabe: "" }, offen: null };
  }

  return { deutung: { art: "zeichen", zeichen: key }, offen: null };
}

/**
 * Die Felder eines echten Tastendrucks für {@link deuteAnschlag}. AltGr: wie
 * `istAltGr` in `zeichenTaste.ts` - `getModifierState("AltGraph")`, sonst
 * Strg + Alt (Windows).
 */
export function anschlagAus(e: {
  key: string;
  code?: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  getModifierState?: (taste: "AltGraph") => boolean;
}): Anschlag {
  const altGraph =
    typeof e.getModifierState === "function" ? e.getModifierState("AltGraph") === true : false;
  return {
    key: e.key,
    code: e.code,
    shiftKey: e.shiftKey === true,
    altGr: altGraph || (e.ctrlKey === true && e.altKey === true),
  };
}
