/**
 * Tastenflow - „Tasten erkunden" / „Tasten finden" in der ENGLISCHEN
 * Bedienung (EN1, 19.09.2026).
 *
 * Die Logik bleibt EINE: `erkundeTaste` in `tastenErklaerung.ts` entscheidet
 * wie bisher, was eine Taste ist (Sondertaste, Zeichen, Kombination, dritter
 * Layer, Totaste) und ob sie geschluckt wird. Hier stehen nur die WÖRTER -
 * dieselben Fächer wie in der deutschen Datei, Eintrag für Eintrag.
 *
 * ── Warum eine eigene Datei ────────────────────────────────────────────────
 *  · `tastenErklaerung.ts` ist ein gemeinsamer Teil (Tastenflow + »Im
 *    Griff«, `apps/GEMEINSAM.md`) und ohnehin 900 Zeilen lang. Die englischen
 *    Sätze daneben machten beide Sprachen schwerer lesbar.
 *  · Das Tasten-Wörterbuch von »Im Griff« (`lib/computer/tastenNamen.ts`)
 *    bleibt UNBERÜHRT: Es ist deutsch und gehört einer deutschsprachigen App.
 *    Für „Tasten finden" stehen darum die englischen Namen und Lagen hier, nach
 *    derselben Kennung (`id`).
 *
 * ── Die Regeln der Sätze (wie im Deutschen) ────────────────────────────────
 *  · Einfache Sprache, kurze Sätze, ein Kind ist gemeint. Britisch.
 *  · Glossar §3.5: *Shift*, *Caps Lock*, *Backspace*, *Enter*, *space bar*,
 *    *Ctrl*, *Esc*, *Tab*; *cursor* für die Schreibmarke; *full stop*.
 *  · Geübt wird oft auf einer DEUTSCHEN Tastatur. Wo dort ein anderes Wort auf
 *    der Taste steht („Strg", „Entf", „Pos 1"), sagt ein Satz das - aber nur
 *    bei eingestellter deutscher Tastatur (`de`), sonst stimmt er nicht.
 *  · Nur Bindestrich `-`. Keine Maus-Wörter. Jeder Satz endet mit einem Punkt.
 *  · „End" als Knopfname wäre hier doppeldeutig (die End-Taste!) - darum heisst
 *    der Knopf „Close".
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** „On a German keyboard it says …" - nur bei eingestellter deutscher Tastatur. */
function deutscheAufschrift(layout: LayoutId, wort: string): string[] {
  return layout === "de" ? [`On a German keyboard it says “${wort}”.`] : [];
}

/** Englische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteEn(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "de",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "Tab key",
        was: [
          "moves from one thing to the next, for example to a link, a text box or a button.",
          "With Shift it moves back.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: null,
            name: "Return key",
            was: ["confirms and sends.", "It opens links and starts a new line in a text."],
          }
        : {
            kurz: null,
            name: "Enter key",
            was: [
              "confirms and sends.",
              "It opens links, presses buttons and starts a new line in a text.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "space bar",
        was: ["makes a space between two words.", "It also presses buttons and ticks boxes."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: "Backspace key",
        was: ["deletes the character to the left of the cursor.", "That's how you fix a typing mistake."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "Forward Delete key",
            was: [
              "deletes the character to the right of the cursor.",
              "If your keyboard doesn't have it, use fn and the Backspace key.",
            ],
          }
        : {
            kurz: "Del",
            name: "Delete key",
            was: [
              "deletes the character to the right of the cursor.",
              "It also deletes selected files.",
              ...deutscheAufschrift(layout, "Entf"),
            ],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "Escape key",
        was: [
          "cancels.",
          "It closes menus, windows and messages.",
          "In Tastenflow it takes you back to the typing field.",
        ],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "Shift key",
        was: [
          "types capital letters while you hold it down.",
          "It also gets the top character on a key, for example the question mark.",
        ],
      };
    case "feststell":
      return {
        kurz: null,
        name: "Caps Lock key",
        was: ["types everything in capitals until you press it again."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "Left arrow",
        was: [
          "moves the cursor one character to the left.",
          `With ${pfeilWort} it jumps a whole word.`,
        ],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "Right arrow",
        was: [
          "moves the cursor one character to the right.",
          `With ${pfeilWort} it jumps a whole word.`,
        ],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "Up arrow",
        was: ["moves the cursor up one line.", "In lists and menus it goes up one item.", `With ${pfeilWort} it jumps a whole paragraph up.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "Down arrow",
        was: ["moves the cursor down one line.", "In lists and menus it goes down one item.", `With ${pfeilWort} it jumps a whole paragraph down.`],
      };
    case "pos1":
      return {
        kurz: null,
        name: "Home key",
        was: [
          "jumps to the start of the line.",
          "On a web page it jumps right to the top.",
          "With Ctrl it jumps to the start of the whole text.",
          ...deutscheAufschrift(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "End key",
        was: [
          "jumps to the end of the line.",
          "On a web page it jumps right to the bottom.",
          "With Ctrl it jumps to the end of the whole text.",
          ...deutscheAufschrift(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return {
        kurz: "PgUp",
        name: "Page Up key",
        was: ["goes up one screen.", ...deutscheAufschrift(layout, "Bild ↑")],
      };
    case "bild-ab":
      return {
        kurz: "PgDn",
        name: "Page Down key",
        was: ["goes down one screen.", ...deutscheAufschrift(layout, "Bild ↓")],
      };
    case "einfg":
      return {
        kurz: "Ins",
        name: "Insert key",
        was: [
          "is the screen reader key for NVDA and JAWS.",
          "Almost every screen reader command starts with it.",
          ...deutscheAufschrift(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "Control key",
        was: [
          "is for keyboard shortcuts.",
          "Ctrl + C copies, Ctrl + V pastes, Ctrl + Z undoes.",
          "On its own it makes the speech stop.",
          ...deutscheAufschrift(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "Alt key",
        was: [
          "is for keyboard shortcuts.",
          "Alt + Tab switches between windows.",
          "In Tastenflow, Alt + H opens the help.",
        ],
      };
    case "altgr":
      return {
        kurz: null,
        name: "AltGr key",
        was: [
          // Auf der britischen Tastatur liegt das Euro-Zeichen auf AltGr + 4,
          // auf der deutschen und der Schweizer auf AltGr + E.
          `types the third character on a key, for example the euro sign with AltGr + ${layout === "uk" ? "4" : "E"}.`,
        ],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "Windows key",
        was: [
          "opens the Start menu.",
          "Press it again to close it.",
          "Together with other keys it does more, for example Win + D shows the desktop.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "Command key",
        was: ["is for keyboard shortcuts.", "cmd + C copies, cmd + V pastes, cmd + Z undoes."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "Option key",
        was: ["types symbols, for example the at sign.", "With the arrow keys it jumps a whole word."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "Control key",
        was: ["is part of keyboard shortcuts on a Mac.", "On its own it makes VoiceOver stop talking."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "Function key",
        was: ["gives other keys a second job, for example turning the volume up and down."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie man sie schreibt („Ctrl + Home", „Shift + Tab"). Ohne Eintrag gilt
 * `kurz ?? name` der Erklärung.
 */
export const TASTE_KURZ_EN: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Space",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Left arrow",
  "pfeil-rechts": "Right arrow",
  "pfeil-auf": "Up arrow",
  "pfeil-ab": "Down arrow",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "AltGr",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Option",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_EN: Readonly<Record<string, readonly string[]>> = {
  F1: ["opens the help in many programs."],
  F2: ["renames a selected file."],
  F3: ["starts a search."],
  F4: ["closes the window together with Alt."],
  F5: ["reloads a web page.", "Here nothing happens, so you can keep exploring."],
  F6: ["jumps to the address bar in the browser."],
  F7: ["checks the spelling in Word."],
  F10: ["jumps to the menu bar in many programs."],
  F11: ["switches full screen on and off in the browser.", "On a laptop often together with the Fn key."],
  F12: ["opens the Save As window in Word."],
};

/** Englisch zu `nachKey` - F-Tasten, Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyEn(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "de",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "has its own job in some programs.",
            "On a Mac these keys often control brightness and volume.",
          ]
        : (F_TASTEN_WINDOWS_EN[key] ?? ["has its own job in some programs."]);
    return { kurz: key, name: "Function key", was };
  }
  switch (key) {
    case "Home":
      return sondertasteEn("pos1", "windows", layout);
    case "End":
      return sondertasteEn("ende", "windows", layout);
    case "PageUp":
      return sondertasteEn("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteEn("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteEn("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "Num Lock key",
        was: ["switches the numbers on the numeric keypad on and off."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "5 key on the numeric keypad",
        was: ["types 5 when Num Lock is on.", "Num Lock is off now, so it does nothing."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "Menu key",
        was: [
          "opens a menu with commands for the place where you are.",
          "Shift + F10 does the same.",
        ],
      };
    case "PrintScreen":
      return { kurz: null, name: "Print Screen key", was: ["takes a picture of the screen.", "On Windows it often opens a screenshot tool.", "Esc closes it again."] };
    case "ScrollLock":
      return { kurz: null, name: "Scroll Lock key", was: ["is hardly ever needed nowadays."] };
    case "Pause":
      return { kurz: null, name: "Pause key", was: ["is hardly ever needed nowadays."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "Volume Up key", was: ["makes the sound louder."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "Volume Down key", was: ["makes the sound quieter."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "Mute key", was: ["switches the sound off and on again."] };
    case "Fn":
      return sondertasteEn("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "accent key",
        was: [
          "puts a mark on the next letter, for example an accent on the e.",
          "The mark only appears with the next letter.",
        ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_EN = "The mark only appears with the next letter.";

/** Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle. */
export const AKZENTE_EN: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "circumflex",
    was: ["puts a little hat on the next letter, for example ê.", ERSCHEINT_SPAETER_EN],
  },
  akut: {
    name: "acute accent",
    was: ["puts a line going up to the right on the next letter, for example é.", ERSCHEINT_SPAETER_EN],
  },
  gravis: {
    name: "grave accent",
    was: ["puts a line going up to the left on the next letter, for example è.", ERSCHEINT_SPAETER_EN],
  },
  trema: {
    name: "diaeresis",
    was: ["puts two dots on the next letter, for example ë.", ERSCHEINT_SPAETER_EN],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_EN = ["is used in programming."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "en")`; `name` steht nur, wo die englische Tabelle
 * dort keinen kennt.
 */
export const ZEICHEN_EN: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["goes at the end of a sentence."] },
  ",": { was: ["separates parts of a sentence."] },
  "?": { was: ["goes at the end of a question."] },
  "!": { was: ["goes at the end of an exclamation."] },
  ":": { was: ["introduces something, for example a list."] },
  ";": { was: ["separates two parts of a sentence, more strongly than a comma."] },
  "-": { was: ["joins words, for example in well-known."] },
  "@": { was: ["is in every email address."] },
  "+": { was: ["means plus in sums.", "In keyboard shortcuts it means press at the same time."] },
  "*": { was: ["means times on a computer."] },
  "/": { was: ["means divided by on a computer.", "It is also in web addresses."] },
  "=": { was: ["comes before the answer to a sum."] },
  "'": { was: ["shows that a letter is missing, for example in don't."] },
  '"': { name: "quotation mark", was: ["goes before and after what someone says."] },
  "(": { name: "open round bracket", was: ["starts something extra that you add."] },
  ")": { name: "close round bracket", was: ["ends the extra bit you have added."] },
  "%": { name: "percent sign", was: ["means out of a hundred, for example 50 per cent."] },
  "&": { name: "ampersand", was: ["means and."] },
  "#": { name: "hash", was: ["is also used for hashtags."] },
  "€": { name: "euro sign", was: ["is the sign for euros."] },
  $: { was: ["is the sign for dollars."] },
  "£": { was: ["is the sign for pounds."] },
  "§": { was: ["goes in front of laws and rules."] },
  "°": { was: ["shows degrees, for example for the temperature."] },
  "<": { name: "less-than sign", was: ["compares two numbers: the one on the left is smaller."] },
  ">": { name: "greater-than sign", was: ["compares two numbers: the one on the left is bigger."] },
  _: { name: "underscore", was: ["is often in email addresses and file names."] },
  "^": { was: ["means to the power of in maths, for example 2 to the power of 3."] },
  "²": { name: "squared", was: ["is used for areas, for example square metres."] },
  "³": { name: "cubed", was: ["is used for volumes, for example cubic metres."] },
  "[": { was: PROGRAMMIEREN_EN },
  "]": { was: PROGRAMMIEREN_EN },
  "{": { was: PROGRAMMIEREN_EN },
  "}": { was: PROGRAMMIEREN_EN },
  "\\": { was: PROGRAMMIEREN_EN },
  "|": { was: PROGRAMMIEREN_EN },
  "~": { was: PROGRAMMIEREN_EN },
  "´": { was: ["puts an accent on a letter."] },
  "`": { was: ["puts an accent on a letter."] },
  "¨": { was: ["puts two dots on a letter."] },
};

/** Der englische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNameEn(ch: string): string {
  return ZEICHEN_EN[ch]?.name ?? spokenLabel(ch, "en");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - englisch. */
export const ORT_EN: Readonly<Record<string, string>> = {
  explorer: "in File Explorer",
  finder: "in Finder",
  word: "in Word",
  excel: "in Excel",
  browser: "in the browser",
  teams: "in Teams",
  powerpoint: "in PowerPoint",
  outlook: "in Outlook",
  bedienungshilfen: "in the screen reader",
};

/** Die kleine eigene Liste der deutschen Datei, englisch. */
export const EIGENE_KOMBINATIONEN_EN: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "jumps back to the previous item." },
    { keys: "Strg+P", was: "opens the print window." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "jumps back to the previous item." },
    { keys: "Cmd+P", was: "opens the print window." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - englisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, 56
 * Wirkungen; dort nur gelesen). Word- und Excel-Namen so, wie sie in der
 * britischen Fassung heissen („Normal", „Format Cells", „AutoSum").
 * Fehlt eine Kennung, sagt die Zeile ehrlich, dass es vom Programm abhängt -
 * lieber allgemein als ein deutsches Wort mitten im englischen Satz.
 */
export function wirkungEn(id: string, plattform: Plattform): string | null {
  const w = WIRKUNG_EN[id];
  if (id === "papierkorb") return plattform === "macos" ? "Move to the Bin" : "Move to the Recycle Bin";
  return w ?? null;
}

const WIRKUNG_EN: Readonly<Record<string, string>> = {
  kopieren: "Copy",
  einfuegen: "Paste",
  ausschneiden: "Cut",
  rueckgaengig: "Undo",
  wiederherstellen: "Redo, bring back what was undone",
  "alles-markieren": "Select all",
  "markieren-zeichen": "Select character by character",
  "markieren-wort": "Select word by word",
  "spalte-markieren": "Select the whole column",
  "zeile-markieren": "Select the whole row",
  oeffnen: "Open",
  umbenennen: "Rename",
  "neuer-ordner": "Create a new folder",
  papierkorb: "Move to the Recycle Bin",
  duplizieren: "Make a second copy of the same file",
  "ebene-hoeher": "Go up one level",
  adressleiste: "Jump to the address bar",
  eigenschaften: "Show the properties",
  uebersicht: "Open the preview, a quick look without opening",
  bewegen: "Move the file to where it should go (it disappears from the old place)",
  "ansicht-details": "Switch to the “Details” view",
  speichern: "Save",
  "speichern-unter": "Save as, with a new name or in a new place",
  fett: "Make bold",
  kursiv: "Make italic",
  unterstreichen: "Underline",
  ueberschrift1: "Apply Heading 1",
  ueberschrift2: "Apply Heading 2",
  "standard-format": "Apply the “Normal” style",
  links: "Align left",
  zentriert: "Centre",
  zeilenumbruch: "Line break in the same paragraph",
  rechtschreibung: "Start the spelling check",
  fensterbereiche: "Switch between the parts of the window",
  suchen: "Find",
  ersetzen: "Find and replace",
  "gehe-zu-zelle": "Go to a particular cell",
  "zelle-bearbeiten": "Carry on typing in the cell",
  "zelle-formatieren": "Open the “Format Cells” window",
  "zum-rand": "Jump to the edge of the data",
  autosumme: "Insert AutoSum",
  "ausfuellen-unten": "Fill down",
  "ausfuellen-rechts": "Fill right",
  "absoluter-bezug": "Fix a reference (absolute reference with dollar signs)",
  datum: "Insert today's date",
  uhrzeit: "Insert the current time",
  kommentar: "Insert a comment",
  autofilter: "Switch AutoFilter on and off",
  blattwechsel: "Switch to another worksheet",
  "neues-blatt": "Insert a new worksheet",
  "neu-laden": "Reload the page",
  lesezeichen: "Add a bookmark",
  verlauf: "Open the history",
  senden: "Send the message",
  "nachricht-loeschen": "Delete the message",
  "sr-stopp": "Stop the speech",
};

/** „a, b and c" - die englische Aufzählung. */
export function aufzaehlungEn(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} and ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, englisch. */
export const ERKUNDEN_WOERTER_EN = {
  kombination: "key combination",
  kombiUnbekannt: "what it does depends on the program.",
  mit: "With",
  akzentTaste: "accent key",
  unbekannt: "I can't recognise this key.",
  taste: (key: string) => `Key ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) englisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteEn {
  /** Im Satz, mit Artikel: „Find the Tab key." */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

const SECHSERBLOCK = "In the block of six above the arrows";

/** Die Tasten der Suchrunde, englisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_EN: Readonly<Record<string, TasteEn | ((plattform: Plattform) => TasteEn)>> = {
  tabulator: {
    nennung: "the Tab key",
    lage: "Left little finger: one row up, out to the edge.",
  },
  "pfeil-links": {
    nennung: "the left arrow",
    lage: "Bottom right by the arrows, the left one.",
  },
  "pfeil-rechts": {
    nennung: "the right arrow",
    lage: "Bottom right by the arrows, the right one.",
  },
  "pfeil-auf": {
    nennung: "the up arrow",
    lage: "Bottom right by the arrows, the top one.",
  },
  "pfeil-ab": {
    nennung: "the down arrow",
    lage: "Bottom right by the arrows, below the up arrow.",
  },
  pos1: {
    nennung: "the Home key",
    lage: `${SECHSERBLOCK}, top middle. Often with fn on a laptop.`,
  },
  ende: {
    nennung: "the End key",
    lage: `${SECHSERBLOCK}, bottom middle. Often with fn on a laptop.`,
  },
  "bild-auf": {
    nennung: "the Page Up key",
    lage: `${SECHSERBLOCK}, top right. Often with fn on a laptop.`,
  },
  "bild-ab": {
    nennung: "the Page Down key",
    lage: `${SECHSERBLOCK}, bottom right. Often with fn on a laptop.`,
  },
  leertaste: {
    nennung: "the space bar",
    lage: "The long key under your thumbs.",
  },
  eingabe: {
    nennung: "the Enter key",
    lage: "Right hand out to the edge: the big key.",
  },
  zeilenschalter: {
    nennung: "the Return key",
    lage: "Right hand out to the edge: the big key.",
  },
  loeschtaste: {
    nennung: "the Backspace key",
    lage: "Right hand out to the edge, two rows up.",
  },
  entf: (plattform) =>
    plattform === "macos"
      ? {
          nennung: "the Forward Delete key",
          lage: "Only on large keyboards, next to Return. Otherwise fn and Backspace.",
        }
      : {
          nennung: "the Delete key",
          lage: `${SECHSERBLOCK}, bottom left. Top right on a laptop.`,
        },
  esc: {
    nennung: "the Esc key",
    lage: "Top left corner.",
  },
  umschalt: {
    nennung: "the Shift key",
    lage: "Twice: left and right in the bottom letter row.",
  },
  feststell: {
    nennung: "the Caps Lock key",
    lage: "Left little finger: one step to the left.",
    // ★ 23.09.2026: „stays on" stimmt nach dem zweiten Druck unter Windows
    // nicht mehr - dieselbe Behebung wie im Deutschen.
    achtung: "Typing in capitals now? Press it again.",
  },
  strg: {
    nennung: "the Ctrl key",
    lage: "Bottom left corner.",
  },
  alt: { nennung: "the Alt key", lage: "At the bottom, to the left of the space bar." },
  altgr: {
    nennung: "the AltGr key",
    lage: "At the bottom, to the right of the space bar.",
  },
  "windows-taste": {
    nennung: "the Windows key",
    lage: "At the bottom left, between Ctrl and Alt.",
  },
  einfg: {
    nennung: "the Insert key",
    lage: `${SECHSERBLOCK}, top left, above Delete. Often missing on a laptop.`,
  },
  befehlstaste: {
    nennung: "the Command key",
    lage: "Bottom left, right next to the space bar.",
  },
  wahltaste: {
    nennung: "the Option key",
    lage: "Bottom left, the third key from the edge.",
  },
  ctrl: {
    nennung: "the Control key",
    lage: "Bottom left, the second key from the edge.",
  },
  fn: {
    nennung: "the fn key",
    lage: "Bottom left, the first key, right in the corner. On a MacBook it says “fn”.",
  },
};

function tasteEn(t: TastenName, plattform: Plattform): TasteEn {
  const e = TASTEN_EN[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne englischen Eintrag.
  return e ?? { nennung: t.kurz ?? t.name, lage: "" };
}

/** „the Tab key" - wie eine Taste im Satz heisst. */
export function tastenNennungEn(t: TastenName, plattform: Plattform): string {
  return tasteEn(t, plattform).nennung;
}

/** Nur die Lage („On the left edge …") - oder "" (25.09.2026, `findenRunde.ts`). */
export function tastenLageEn(t: TastenName, plattform: Plattform): string {
  return tasteEn(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Find the Tab key. On the left edge …" */
export function ansageSuchauftragEn(t: TastenName, plattform: Plattform): string {
  const e = tasteEn(t, plattform);
  return e.lage ? `Find ${e.nennung}. ${e.lage}` : `Find ${e.nennung}.`;
}

/** Erster Treffer - Johannes' Kern der Suchrunde: erst die Wiederholung zählt. */
export function ansageGefundenEn(t: TastenName, plattform: Plattform): string {
  return `Found it! Press another key, then ${tastenNennungEn(t, plattform)} again.`;
}

/**
 * Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste).
 * ★ 23.09.2026 (Johannes: „halte dich kürzer", dieselbe Kürzung wie im
 * Deutschen): ohne den Tastennamen - das Kind hat die Taste gerade zweimal
 * gedrückt.
 */
export function ansageBestaetigtEn(t: TastenName, plattform: Plattform): string {
  const e = tasteEn(t, plattform);
  return e.achtung ? `Got it! ${e.achtung}` : "Got it!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_EN = "Not a key we learn here.";

/**
 * Der Satz zu einem Schritt der Suchrunde - englisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 * ★ 23.09.2026: dieselbe Kürze wie im Deutschen - „Find …" statt „You're
 * looking for …", die unbekannte Taste ohne wiederholte Lage, das Ende neu
 * geordnet mit Ausrufezeichen.
 */
export function suchSatzEn(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteEn(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_EN} Find ${g.nennung}.`;
      return `That's ${tastenNennungEn(taste, plattform)}. Find ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenEn(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtEn(gesucht, plattform)} All ${suchbar.length} keys found. Brilliant!`;
    case "weiter":
      return `${ansageBestaetigtEn(gesucht, plattform)} ${ansageSuchauftragEn(suchbar[index + 1]!, plattform)}`;
  }
}
