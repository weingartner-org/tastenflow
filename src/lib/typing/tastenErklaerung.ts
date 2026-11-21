/**
 * Tastenflow - was „Tasten erkunden" (Alt + 3) zu jeder Taste sagt.
 *
 * Wunsch Johannes, 12.09.2026: „nicht nur zb: TAB - Tabulatortaste zu sagen
 * sondern TAB - Tabulatortaste springt von Element zu Element wie zB Link,
 * Eingabefeld, Schalter … Immer zuerst die abkürzung, dann der Nahme und dann
 * die möglichen funktionen, begonnen mit den wichtigsten zuerst … einfache
 * sprache, es ist für Kinder".
 *
 * Darum hat jede Taste hier drei Teile:
 *  · `kurz`  - die Abkürzung, so wie sie auf der Taste steht oder wie man sie
 *              nennt („Tab", „Strg", „Shift"). `null`, wenn es keine gibt oder
 *              sie nur den Namen wiederholen würde („Ende" - „Ende-Taste").
 *  · `name`  - der ausgeschriebene Name („Tabulatortaste", „Steuerungstaste").
 *  · `was`   - was sie tut, in kurzen Sätzen, das Wichtigste zuerst.
 *
 * ── Zwei Ausgaben, weil Stimme und Braillezeile Verschiedenes brauchen ──────
 *  · `zeile`  steht auf dem Schirm und in der Live-Region, also als Meldung auf
 *             der Braillezeile: „Tab - Tabulatortaste - springt …". Der
 *             Bindestrich trennt, und bei Zeichen steht das Zeichen selbst
 *             vorne, damit man es auf der Zeile ertasten kann.
 *  · `ansage` geht an die Stimme: „Tab, Tabulatortaste: Springt …". Komma und
 *             Doppelpunkt statt Bindestrich - ein freistehendes „-" liest nicht
 *             jede Stimme als Pause.
 *
 * ── Woher die Tasten erkannt werden ────────────────────────────────────────
 * Welche Sondertaste gedrückt wurde, sagt weiter das Tasten-Wörterbuch von
 * »Im Griff« (`lib/computer/tastenNamen.ts`, gemeinsamer Teil - hier NUR
 * gelesen, nicht geändert). Die kindgerechten Texte stehen dagegen hier, im
 * Revier von Tastenflow: Das Wörterbuch spricht mit Lage und englischem Namen
 * zu Lernenden in »Im Griff«, diese Tabelle zu Kindern beim Ertasten.
 *
 * ⚠️ Bewusste Abweichung von den Wörterbuch-Namen: Wo die Abkürzung schon der
 * Name war („Strg-Taste", „Entf-Taste", „Esc-Taste", „Einfg-Taste",
 * „Pos1-Taste"), steht hier der ausgeschriebene Name - sonst hiesse es
 * „Strg - Strg-Taste", und die Abkürzung erklärte nichts.
 *
 * ── Regeln für jeden Satz in dieser Datei ──────────────────────────────────
 *  · Einfache Sprache, kurze Sätze, ein Kind ist gemeint.
 *  · Nur Bindestrich `-`, nie Gedankenstriche (Braillezeile).
 *  · Nichts über Tastenwege, die nur auf EINER Tastatur stimmen: Tastenflow
 *    kennt deutsche, österreichische und Schweizer Tastaturen. „Euro mit
 *    AltGr + E" stimmt auf allen dreien, „@ mit AltGr + Q" nicht.
 *  · Nur Aufgaben, die sicher stimmen. Lieber ein Satz weniger.
 *  · Keine Maus-Wörter.
 *  · Jeder Satz endet mit einem Punkt (der Wächter prüft das).
 */
import { matchesChord, parseChord } from "../computer/chord";
import type { KeyEventLike } from "../computer/chord";
// ★★★ 28.09.2026: der Katalog von »Im Griff« NICHT mehr statisch - er kommt
// nachgeladen (`kuerzelKatalog.ts`); sonst lüde jeder Tastenflow-Besucher alle
// Übungsdaten von »Im Griff« mit.
import { kuerzelKatalog, kuerzelKatalogGeladen } from "./kuerzelKatalog";
import { WEG_ERSTER_GRIFF, wirkungFuer } from "../computer/kuerzelWirkung";
import type { ModulId, Plattform } from "../computer/model";
import { istQwertz } from "../computer/tastatur";
import { tasteFuerEreignis } from "../computer/tastenNamen";
import type { BedienSprache } from "../bedienSprache";
import { spokenLabel } from "./fingers";
import type { LayoutId } from "./layouts";
import {
  AKZENTE_EN,
  EIGENE_KOMBINATIONEN_EN,
  ERKUNDEN_WOERTER_EN,
  ORT_EN,
  TASTE_KURZ_EN,
  ZEICHEN_EN,
  aufzaehlungEn,
  nachKeyEn,
  sondertasteEn,
  wirkungEn,
  zeichenNameEn,
} from "./tastenErklaerungEn";
/**
 * ★ E12 (26.09.2026, Bauplan Auftrag Punkt 1): das französische Gegenstück,
 * angebunden wie die englische Datei - EIGENE Sätze, dieselbe Logik. Jede der
 * fünf Weichen unten (`code-bestand.md` §F.2) bekommt einen DRITTEN Zweig
 * statt eines neuen `=== "en" ?` (Weichen-Zähler, Bauplan §2.3 Punkt 3).
 */
import {
  AKZENTE_FR,
  EIGENE_KOMBINATIONEN_FR,
  ERKUNDEN_WOERTER_FR,
  ORT_FR,
  TASTE_KURZ_FR,
  ZEICHEN_FR,
  aufzaehlungFr,
  nachKeyFr,
  sondertasteFr,
  wirkungFr,
  zeichenNameFr,
} from "./tastenErklaerungFr";
/**
 * ★ ES-O (27.09.2026): das spanische Gegenstück, angebunden wie die
 * französische Datei - EIGENE Sätze, dieselbe Logik (Bauplan S13).
 */
import {
  AKZENTE_ES,
  EIGENE_KOMBINATIONEN_ES,
  ERKUNDEN_WOERTER_ES,
  ORT_ES,
  TASTE_KURZ_ES,
  ZEICHEN_ES,
  aufzaehlungEs,
  nachKeyEs,
  sondertasteEs,
  wirkungEs,
  zeichenNameEs,
} from "./tastenErklaerungEs";
/**
 * ★ O-IT (02.10.2026): das italienische Gegenstück, angebunden wie die
 * spanische Datei - EIGENE Sätze, dieselbe Logik (Glossar Italienisch §2.9).
 */
import {
  AKZENTE_IT,
  EIGENE_KOMBINATIONEN_IT,
  ERKUNDEN_WOERTER_IT,
  ORT_IT,
  TASTE_KURZ_IT,
  ZEICHEN_IT,
  aufzaehlungIt,
  nachKeyIt,
  sondertasteIt,
  wirkungIt,
  zeichenNameIt,
} from "./tastenErklaerungIt";
/**
 * ★ O-PL (02.10.2026): das polnische Gegenstück, angebunden wie die
 * italienische Datei - EIGENE Sätze, dieselbe Logik (Glossar Polnisch §2.9).
 */
import {
  AKZENTE_PL,
  EIGENE_KOMBINATIONEN_PL,
  ERKUNDEN_WOERTER_PL,
  ORT_PL,
  TASTE_KURZ_PL,
  ZEICHEN_PL,
  aufzaehlungPl,
  nachKeyPl,
  sondertastePl,
  wirkungPl,
  zeichenNamePl,
} from "./tastenErklaerungPl";
/**
 * ★ O-TR (02.10.2026): das türkische Gegenstück, angebunden wie die
 * polnische Datei - EIGENE Sätze, dieselbe Logik (Glossar Türkisch §2.9).
 */
import {
  AKZENTE_TR,
  EIGENE_KOMBINATIONEN_TR,
  ERKUNDEN_WOERTER_TR,
  ORT_TR,
  TASTE_KURZ_TR,
  ZEICHEN_TR,
  aufzaehlungTr,
  nachKeyTr,
  sondertasteTr,
  wirkungTr,
  zeichenNameTr,
} from "./tastenErklaerungTr";
/**
 * ★ O-CS (03.10.2026): das tschechische Gegenstück, angebunden wie die
 * türkische Datei - EIGENE Sätze, dieselbe Logik (Glossar Tschechisch §2.9).
 */
import {
  AKZENTE_CS,
  EIGENE_KOMBINATIONEN_CS,
  ERKUNDEN_WOERTER_CS,
  ORT_CS,
  TASTE_KURZ_CS,
  ZEICHEN_CS,
  aufzaehlungCs,
  nachKeyCs,
  sondertasteCs,
  wirkungCs,
  zeichenNameCs,
} from "./tastenErklaerungCs";
import { grossFuer, geruestAufEn, istGeruestSprache, type GeruestSprache } from "./sprachRegister";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Sprachen liefern ihre Sätze als EIN Objekt (`tastenErklaerungSatz.ts`) aus ihrer Datei.
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";
import { AKZENTE_NEU, istNeuerAkzent, type NeuerAkzent } from "./tastenErklaerungAkzenteNeu";
import { TASTEN_SATZ_BG } from "./tastenErklaerungBg";
import { TASTEN_SATZ_EL } from "./tastenErklaerungEl";
import { TASTEN_SATZ_HU } from "./tastenErklaerungHu";
import { TASTEN_SATZ_NL } from "./tastenErklaerungNl";
import { TASTEN_SATZ_PT } from "./tastenErklaerungPt";
import { TASTEN_SATZ_BR } from "./tastenErklaerungBr";
import { TASTEN_SATZ_RO } from "./tastenErklaerungRo";
import { TASTEN_SATZ_SV } from "./tastenErklaerungSv";
import { TASTEN_SATZ_UK } from "./tastenErklaerungUk";

const TASTEN_SATZ_GERUEST: Readonly<Record<GeruestSprache, TastenErklaerungSatz>> = {
  bg: TASTEN_SATZ_BG,
  el: TASTEN_SATZ_EL,
  hu: TASTEN_SATZ_HU,
  nl: TASTEN_SATZ_NL,
  pt: TASTEN_SATZ_PT,
  br: TASTEN_SATZ_BR,
  ro: TASTEN_SATZ_RO,
  sv: TASTEN_SATZ_SV,
  uk: TASTEN_SATZ_UK,
};

/** ★ G3c-VERTEILER (25.10.2026): die Sätze einer Gerüst-Sprache - `null` für die acht Sprachen mit eigener Kette unten. */
function geruestSatz(sprache: BedienSprache): TastenErklaerungSatz | null {
  return istGeruestSprache(sprache) ? TASTEN_SATZ_GERUEST[sprache] : null;
}

/** Was über eine Taste gesagt wird. */
export interface TastenErklaerung {
  /** Die Abkürzung („Tab", „Strg") - `null`, wenn es keine eigene gibt. */
  kurz: string | null;
  /** Der ausgeschriebene Name („Tabulatortaste"). */
  name: string;
  /** Was sie tut - das Wichtigste zuerst. Der erste Satz beginnt klein. */
  was: readonly string[];
}

/** Was „Tasten erkunden" nach einem Tastendruck zeigt und sagt. */
export interface ErkundenAusgabe {
  /** Das grosse Zeichen in der Mitte des Schirms. */
  gross: string;
  /** Schirm und Braillezeile: „Tab - Tabulatortaste - springt …". */
  zeile: string;
  /** Die Stimme: „Tab, Tabulatortaste: Springt …". */
  ansage: string;
  /**
   * `true`: Die Taste gehört dem Erkunden und wird geschluckt (Tab soll nicht
   * davonspringen; seit 28.09.2026 auch F1-F24, seit 27.10.2026 auch F5 und
   * die Menü-Taste). `false`: Sie läuft zum Browser weiter (Unbekanntes bleibt
   * unangetastet).
   */
  schlucken: boolean;
  /**
   * ★★★ 28.09.2026: `true`, wenn eine KOMBINATION beantwortet werden musste,
   * bevor der Kürzel-Katalog von »Im Griff« geladen war (`kuerzelKatalog.ts`).
   * Dann fehlt, was sie tut - das Fenster wartet auf den Katalog und fragt
   * neu, statt eine unvollständige Ansage zu machen. `schlucken` gilt schon
   * (Kombinationen werden immer geschluckt). Sonst fehlt das Feld.
   */
  katalogFehlt?: true;
}

/* ══ Sondertasten - nach der Kennung aus dem Tasten-Wörterbuch ═════════════ */

const pfeilWort = (plattform: Plattform) => (plattform === "macos" ? "Option" : "Strg");

/** Der Satz zu einer Wörterbuch-Kennung („tabulator", „strg" …) - oder `null`. */
export function erklaerungFuerId(id: string, plattform: Plattform): TastenErklaerung | null {
  return sondertaste(id, plattform);
}

/**
 * ★ 23.10.2026 (Testerin): die Erklärung einer Wörterbuch-Taste in der
 * Sprache der Oberfläche - für „Tasten finden", das nach dem Treffer sagt,
 * WAS die Taste tut. Dieselben Tabellen wie „Tasten erkunden", keine neuen Sätze.
 */
export function erklaerungFuerSprache(
  id: string,
  plattform: Plattform,
  layout: LayoutId,
  sprache: BedienSprache,
): TastenErklaerung | null {
  // RÜCKFALL-EN (G2-NEUN): die neun Sprachen des Gerüsts bekommen die ENGLISCHE Erklärung - ohne den Aufruf fielen
  // sie in den deutschen `default` (G2-NEUN-Suche nach festen Listen, Falle 57).
  // ★ G3c-VERTEILER (25.10.2026): eine Gerüst-Sprache aus ihrer eigenen Datei (heute dieselbe englische Erklärung wie vorher).
  const satz = geruestSatz(sprache);
  if (satz) return satz.sondertaste(id, plattform, layout);
  switch (geruestAufEn(sprache)) {
    case "en":
      return sondertasteEn(id, plattform, layout);
    case "fr":
      return sondertasteFr(id, plattform, layout);
    case "es":
      return sondertasteEs(id, plattform, layout);
    case "it":
      return sondertasteIt(id, plattform, layout);
    case "pl":
      return sondertastePl(id, plattform, layout);
    case "tr":
      return sondertasteTr(id, plattform, layout);
    case "cs":
      return sondertasteCs(id, plattform, layout);
    default:
      return sondertaste(id, plattform);
  }
}

function sondertaste(id: string, plattform: Plattform): TastenErklaerung | null {
  const mac = plattform === "macos";
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "Tabulatortaste",
        was: [
          "springt von Element zu Element, zum Beispiel zu Link, Eingabefeld oder Schalter.",
          "Mit Shift dazu springt sie zurück.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Return",
            name: "Zeilenschalter",
            was: [
              "bestätigt und schickt ab.",
              "Er öffnet Links und macht im Text eine neue Zeile.",
            ],
          }
        : {
            kurz: "Enter",
            name: "Eingabetaste",
            was: [
              "bestätigt und schickt ab.",
              "Sie öffnet Links, drückt Schalter und macht im Text eine neue Zeile.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "Leertaste",
        was: [
          "macht einen Abstand zwischen zwei Wörtern.",
          "Sie drückt auch Schalter und setzt Häkchen.",
        ],
      };
    case "loeschtaste":
      return {
        kurz: "Backspace",
        name: "Löschtaste",
        was: [
          "löscht das Zeichen links von der Schreibmarke.",
          "So verbesserst du einen Tippfehler.",
          "Sie heißt auch Rücktaste.",
        ],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "Entfernen-Taste",
            was: [
              "löscht das Zeichen rechts von der Schreibmarke.",
              "Hat deine Tastatur sie nicht, geht das mit fn und der Löschtaste.",
            ],
          }
        : {
            kurz: "Entf",
            name: "Entfernen-Taste",
            was: [
              "löscht das Zeichen rechts von der Schreibmarke.",
              "Sie löscht auch ausgewählte Dateien.",
            ],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "Escape-Taste",
        was: [
          "bricht ab.",
          "Sie schließt Menüs, Fenster und Meldungen.",
          "In Tastenflow bringt sie dich zurück ins Schreibfeld.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Shift",
        name: "Umschalttaste",
        was: [
          "schreibt große Buchstaben, solange du sie hältst.",
          "Sie holt auch das obere Zeichen einer Taste, zum Beispiel das Fragezeichen.",
          // ★ Testerin 24.10.2026: mehrere Namen für dieselbe Taste (Shift steht schon vorne).
          "Sie heißt auch Großschreibtaste.",
        ],
      };
    case "feststell":
      return {
        kurz: "Caps Lock",
        name: "Feststelltaste",
        was: ["schreibt alles groß, bis du sie noch einmal drückst.", "Sie heißt auch Dauergroßschreibtaste."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "Pfeil nach links",
        was: [
          "bewegt die Schreibmarke ein Zeichen nach links.",
          `Mit ${pfeilWort(plattform)} dazu springt sie ein ganzes Wort.`,
        ],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "Pfeil nach rechts",
        was: [
          "bewegt die Schreibmarke ein Zeichen nach rechts.",
          `Mit ${pfeilWort(plattform)} dazu springt sie ein ganzes Wort.`,
        ],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "Pfeil nach oben",
        was: [
          "bewegt die Schreibmarke eine Zeile nach oben.",
          "In Listen und Menüs geht er einen Eintrag nach oben.",
          // ★ Testerin 24.10.2026: wie bei links/rechts der Weg mit Strg (Absatz).
          `Mit ${pfeilWort(plattform)} dazu springt sie einen Absatz nach oben.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "Pfeil nach unten",
        was: [
          "bewegt die Schreibmarke eine Zeile nach unten.",
          "In Listen und Menüs geht er einen Eintrag nach unten.",
          `Mit ${pfeilWort(plattform)} dazu springt sie einen Absatz nach unten.`,
        ],
      };
    case "pos1":
      return {
        kurz: "Pos1",
        name: "Position-1-Taste",
        was: [
          "springt an den Anfang der Zeile.",
          "Auf einer Webseite springt sie ganz nach oben.",
          // ★ Testerin 24.10.2026: Strg + Pos1 für Dokumente.
          "Mit Strg dazu springt sie an den Anfang vom ganzen Text.",
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "Ende-Taste",
        was: [
          "springt ans Ende der Zeile.",
          "Auf einer Webseite springt sie ganz nach unten.",
          "Mit Strg dazu springt sie ans Ende vom ganzen Text.",
        ],
      };
    case "bild-auf":
      return {
        kurz: null,
        name: "Bild-auf-Taste",
        was: ["blättert eine Bildschirmseite nach oben."],
      };
    case "bild-ab":
      return {
        kurz: null,
        name: "Bild-ab-Taste",
        was: ["blättert eine Bildschirmseite nach unten."],
      };
    case "einfg":
      return {
        kurz: "Einfg",
        name: "Einfügen-Taste",
        was: [
          "ist bei NVDA und JAWS die Screenreader-Taste.",
          "Fast jeder Befehl vom Screenreader beginnt mit ihr.",
        ],
      };
    case "strg":
      return {
        kurz: "Strg",
        name: "Steuerungstaste",
        was: [
          "ist für Tastenkürzel.",
          "Strg + C kopiert, Strg + V fügt ein, Strg + Z macht rückgängig.",
          "Allein macht sie die Sprachausgabe still.",
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "Alt-Taste",
        was: [
          "ist für Tastenkürzel.",
          "Alt + Tab wechselt zwischen Fenstern.",
          "In Tastenflow öffnet Alt + H die Hilfe.",
        ],
      };
    case "altgr":
      return {
        kurz: null,
        name: "AltGr-Taste",
        was: [
          "schreibt das dritte Zeichen einer Taste, zum Beispiel das Euro-Zeichen mit AltGr + E.",
        ],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "Windows-Taste",
        was: [
          "öffnet das Startmenü.",
          // ★ Testerin 24.10.2026: was gleich passiert - und wie es wieder zugeht.
          "Drück sie noch einmal, dann ist es wieder zu.",
          "Mit anderen Tasten zusammen macht sie mehr, zum Beispiel Win + D zeigt den Desktop.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "Befehlstaste",
        was: [
          "ist für Tastenkürzel.",
          "cmd + C kopiert, cmd + V fügt ein, cmd + Z macht rückgängig.",
        ],
      };
    case "wahltaste":
      return {
        kurz: "Option",
        name: "Wahltaste",
        was: [
          "schreibt Sonderzeichen, zum Beispiel das At-Zeichen.",
          "Mit den Pfeiltasten springt sie ein ganzes Wort.",
        ],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "Control-Taste",
        was: [
          "gehört zu Tastenkürzeln am Mac.",
          "Allein macht sie VoiceOver still.",
        ],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "Funktionstaste",
        was: ["gibt anderen Tasten eine zweite Aufgabe, zum Beispiel lauter und leiser."],
      };
    default:
      return null;
  }
}

/* ══ Tasten, die das Wörterbuch nicht führt - nach `KeyboardEvent.key` ═════ */

/** F1 bis F12 unter Windows: die Aufgabe, die ein Kind am ehesten braucht. */
const F_TASTEN_WINDOWS: Readonly<Record<string, readonly string[]>> = {
  F1: ["öffnet in vielen Programmen die Hilfe."],
  F2: ["benennt eine ausgewählte Datei um."],
  F3: ["startet die Suche."],
  F4: ["schließt mit Alt dazu das Fenster."],
  F5: ["lädt eine Webseite neu.", "Hier passiert nichts, damit du weiter erkunden kannst."],
  F6: ["springt im Browser in die Adresszeile."],
  F7: ["prüft in Word die Rechtschreibung."],
  F10: ["springt in vielen Programmen zur Menüleiste."],
  // ★ Testerin 24.10.2026: „F11 für Vollbildmodus? Diese Funktion geht bei mir nicht" - am Laptop oft nur mit Fn.
  F11: ["schaltet im Browser den Vollbildmodus ein und aus.", "Am Laptop oft zusammen mit der Fn-Taste."],
  F12: ["öffnet in Word das Fenster Speichern unter."],
};

function nachKey(key: string, plattform: Plattform): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "hat in manchen Programmen eine eigene Aufgabe.",
            "Am Mac liegen auf diesen Tasten oft Helligkeit und Lautstärke.",
          ]
        : (F_TASTEN_WINDOWS[key] ?? ["hat in manchen Programmen eine eigene Aufgabe."]);
    return { kurz: key, name: "Funktionstaste", was };
  }
  switch (key) {
    // Am Mac führt das Wörterbuch diese vier nicht - grosse Mac-Tastaturen
    // haben sie trotzdem. Dieselben Sätze wie unter Windows.
    case "Home":
      return sondertaste("pos1", "windows");
    case "End":
      return sondertaste("ende", "windows");
    case "PageUp":
      return sondertaste("bild-auf", "windows");
    case "PageDown":
      return sondertaste("bild-ab", "windows");
    case "Insert":
      return sondertaste("einfg", "windows");
    case "NumLock":
      return {
        kurz: null,
        name: "Num-Taste",
        was: ["schaltet die Ziffern am Ziffernblock ein und aus."],
      };
    // ★ Testerin 24.10.2026: die 5 im Ziffernblock meldet bei ausgeschaltetem Num „Clear" (vorher „Taste Clear").
    case "Clear":
      return {
        kurz: "5",
        name: "Taste 5 im Ziffernblock",
        was: ["schreibt die 5, wenn die Num-Taste an ist.", "Jetzt ist Num aus, darum tut sie nichts."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "Menü-Taste",
        was: [
          "öffnet ein Menü mit Befehlen für die Stelle, an der du gerade bist.",
          "Dasselbe geht mit Shift + F10.",
        ],
      };
    case "PrintScreen":
      return { kurz: null, name: "Drucktaste", was: ["macht ein Bild vom Bildschirm.", "Unter Windows öffnet sie oft ein Programm für Bildschirmfotos.", "Mit Esc ist es wieder zu."] };
    case "ScrollLock":
      return { kurz: null, name: "Rollen-Taste", was: ["wird heute fast nie gebraucht."] };
    case "Pause":
      return { kurz: null, name: "Pause-Taste", was: ["wird heute fast nie gebraucht."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "Lauter-Taste", was: ["macht den Ton lauter."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "Leiser-Taste", was: ["macht den Ton leiser."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "Ton-aus-Taste", was: ["schaltet den Ton aus und wieder ein."] };
    case "Fn":
      return sondertaste("fn", plattform);
    case "Dead":
      // Eine „tote" Taste: ^ ´ ` ¨ erscheinen erst mit dem nächsten Buchstaben.
      // WELCHES Zeichen es ist, hängt an der Tastatur - darum allgemein.
      return {
        kurz: null,
        name: "Akzent-Taste",
        was: [
          "setzt ein Zeichen auf den nächsten Buchstaben, zum Beispiel einen Strich auf das e.",
          "Das Zeichen erscheint erst mit dem nächsten Buchstaben.",
        ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit ihrer Zusatzbezeichnung ═══════════════════════════════════
 *
 * Johannes, 13.09.2026: „die taste rechts neben dem ß heißt genau gleich wie
 * die taste links neben dem 1 bitte gib die zusatzbezeichnung auch an."
 *
 * Der Browser meldet JEDE Totaste als `key: "Dead"` - welches Zeichen sie
 * setzt, sagt er nicht. Erkannt wird es darum aus der physischen Taste
 * (`event.code`), der eingestellten Tastatur (`layout`) und Umschalt.
 *
 * ⚠️ Nur, was sicher stimmt. Nicht in dieser Tabelle (englische Tastaturen,
 * AltGr, die Wahltaste am Mac, jede andere Taste) bleibt es bei der
 * allgemeinen „Akzent-Taste" aus `nachKey` - lieber allgemein als falsch.
 *
 * ⚠️ Am Mac mit ISO-Tastatur meldet Chrome die Taste links neben der 1 teils
 * als `IntlBackslash` (die Taste neben der linken Umschalttaste dafür als
 * `Backquote` - vertauscht). Beide stehen darum bei `^`. Das ist unschädlich:
 * Gefragt wird nur, wenn der Browser wirklich eine Totaste meldet, und die
 * Taste mit `<` ist nie eine.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface Akzent {
  /** ★ EN1: die Kennung - danach sucht die englische Bedienung ihren Wortlaut (`AKZENTE_EN`). */
  // ★ O2-TASTATUR (30.10.2026): dazu Tilde (pt, br, nl) und Tonos (el) - ihr Wortlaut steht in `AKZENTE_NEU`.
  id: keyof typeof AKZENTE_EN | NeuerAkzent;
  /** Das Zeichen, das die Taste setzt - gross in der Mitte und vorne auf der Zeile. */
  zeichen: string;
  /** Die Zusatzbezeichnung. */
  name: string;
  was: readonly string[];
}

const ERSCHEINT_SPAETER = "Das Zeichen erscheint erst mit dem nächsten Buchstaben.";

const ZIRKUMFLEX: Akzent = {
  id: "zirkumflex",
  zeichen: "^",
  name: "Zirkumflex",
  was: ["setzt ein kleines Dach auf den nächsten Buchstaben, zum Beispiel ê.", ERSCHEINT_SPAETER],
};
const AKUT: Akzent = {
  id: "akut",
  zeichen: "´",
  name: "Akut",
  was: ["setzt einen Strich nach rechts oben auf den nächsten Buchstaben, zum Beispiel é.", ERSCHEINT_SPAETER],
};
const GRAVIS: Akzent = {
  id: "gravis",
  zeichen: "`",
  name: "Gravis",
  was: ["setzt einen Strich nach links oben auf den nächsten Buchstaben, zum Beispiel è.", ERSCHEINT_SPAETER],
};
const TREMA: Akzent = {
  id: "trema",
  zeichen: "¨",
  name: "Trema",
  was: ["setzt zwei Punkte auf den nächsten Buchstaben, zum Beispiel ë.", ERSCHEINT_SPAETER],
};

// ★ O2-TASTATUR (30.10.2026): die Totasten der neuen Tastaturen. Der deutsche Wortlaut kommt wie bei den anderen aus der Konstante,
// jede andere Bedienung liest `AKZENTE_NEU`.
const TILDE: Akzent = { id: "tilde", zeichen: "~", name: AKZENTE_NEU.de.tilde.name, was: [AKZENTE_NEU.de.tilde.was, ERSCHEINT_SPAETER] };
const TONOS: Akzent = { id: "tonos", zeichen: "΄", name: AKZENTE_NEU.de.tonos.name, was: [AKZENTE_NEU.de.tonos.was, ERSCHEINT_SPAETER] };
const DIALYTIKA_TONOS: Akzent = { id: "dialytikaTonos", zeichen: "΅", name: AKZENTE_NEU.de.dialytikaTonos.name, was: [AKZENTE_NEU.de.dialytikaTonos.was, ERSCHEINT_SPAETER] };

/** Tastatur → physische Taste → [ohne Umschalt, mit Umschalt]. `null` = keine Totaste. */
const TOTASTEN: Partial<Record<LayoutId, Readonly<Record<string, readonly [Akzent | null, Akzent | null]>>>> = {
  de: {
    Backquote: [ZIRKUMFLEX, null], // links neben der 1; mit Umschalt das °, keine Totaste
    IntlBackslash: [ZIRKUMFLEX, null], // dieselbe Taste am Mac mit ISO-Tastatur (Chrome)
    Equal: [AKUT, GRAVIS], // rechts neben dem ß
  },
  ch: {
    Equal: [ZIRKUMFLEX, GRAVIS], // rechts neben dem '
    BracketRight: [TREMA, null], // rechts neben dem ü; mit Umschalt das !, keine Totaste
  },
  // ★ E3 (25.09.2026, Bauplan §4, Auftrag E3 Punkt 2): nur ^ und ¨ - die
  // zusammengesetzten Zeichen (ê â î ô û ë ï) sind E4.
  fr: {
    // rechts neben p - ^ ohne Umschalt, ¨ MIT Umschalt (derselben Taste,
    // anders als auf Schweiz-Deutsch/-Französisch - BEFUND-MAC/-WINDOWS §1).
    BracketLeft: [ZIRKUMFLEX, TREMA],
  },
  be: {
    BracketLeft: [ZIRKUMFLEX, TREMA], // wie Frankreich (BEFUND-WINDOWS §3)
  },
  "ch-fr": {
    // dieselben physischen Tasten wie CH (Bauplan §3.1: „gleiche Kappen") -
    // ¨ ist hier eine EIGENE Taste (nicht Maj+^), jetzt zusätzlich markiert.
    Equal: [ZIRKUMFLEX, GRAVIS],
    BracketRight: [TREMA, null],
  },
  "ca-csa": {
    // rechts von p (BEFUND-WINDOWS §3: „^ als Totaste rechts von p" - für
    // beide kanadischen Belegungen). ⚠️ Die Umschalt-Form (¨) ist für Kanada
    // NICHT gemessen (Bauplan §14 E3 „CA: siehe Befunde" nennt sie nicht) -
    // aus der Microsoft-Dokumentation für „Canadian Multilingual Standard"
    // übernommen (kbdlayout.info), nicht durch eine eigene Messung bestätigt.
    BracketLeft: [ZIRKUMFLEX, TREMA],
  },
  "ca-fr": {
    // Platzhalter, identisch mit ca-csa - siehe layouts.ts#CA_FR.
    BracketLeft: [ZIRKUMFLEX, TREMA],
  },
  // ★ O-CS (03.10.2026, R1 §2.1/§3, `layouts.ts` CS): die letzte Taste der Zahlenreihe (rechts neben „=") ist ohne
  // Umschalt die Čárka (Akut), mit Umschalt der Háček - den kennt `Akzent` nicht (`null`: dann sagt `nachKeyCs`
  // „Dead" den Satz der Sprache). Die Trema-Totaste am Ende der Grundreihe (ISO-Stelle von „#"). Windows und Mac gleich.
  cs: {
    Equal: [AKUT, null],
    Backslash: [TREMA, null],
  },
  "cs-qwerty": {
    Equal: [AKUT, null],
    Backslash: [TREMA, null],
  },
  // ★ O2-TASTATUR (30.10.2026, `layouts.ts`, Wächter `tastenflow-erkunden-totasten-neun` vergleicht jede Zeile mit `access`).
  // Griechisch: der Tonos rechts neben dem λ; ¨ mit Umschalt darauf (408, 319) oder auf der eigenen Taste rechts daneben (220).
  el: {
    Semicolon: [TONOS, TREMA],
    KeyW: [null, DIALYTIKA_TONOS], // Umschalt + ς
  },
  "el-220": {
    Semicolon: [TONOS, null],
    Quote: [TREMA, DIALYTIKA_TONOS],
  },
  "el-319": {
    Semicolon: [TONOS, TREMA],
  },
  // US-International: ' und " sind die Totasten für Akut und Trema, ` und ~ für Gravis und Tilde, Umschalt + 6 für das Dach.
  "nl-intl": {
    Backquote: [GRAVIS, TILDE],
    Quote: [{ ...AKUT, zeichen: "'" }, { ...TREMA, zeichen: '"' }],
    Digit6: [null, ZIRKUMFLEX],
  },
  "nl-dutch": {
    BracketLeft: [TREMA, ZIRKUMFLEX],
    Quote: [AKUT, GRAVIS],
    Equal: [null, TILDE],
  },
  pt: {
    BracketRight: [AKUT, GRAVIS],
    Backslash: [TILDE, ZIRKUMFLEX],
  },
  "br-abnt2": {
    BracketLeft: [AKUT, GRAVIS],
    Quote: [TILDE, ZIRKUMFLEX],
    Digit6: [null, TREMA],
  },
  sv: {
    Equal: [AKUT, GRAVIS],
    BracketRight: [TREMA, ZIRKUMFLEX],
  },
};

/** Welcher Akzent ist diese Totaste? `null`, wenn es nicht sicher bekannt ist. */
function benannteTotaste(e: KeyEventLike, layout: LayoutId): Akzent | null {
  if (e.key !== "Dead" || e.altKey || e.ctrlKey || e.metaKey) return null;
  const paar = TOTASTEN[layout]?.[e.code ?? ""];
  return paar ? paar[e.shiftKey ? 1 : 0] : null;
}

/* ══ Zeichen - Satzzeichen und Sonderzeichen ════════════════════════════════
 *
 * Buchstaben und Ziffern bekommen keinen Satz: „a" ist „a". Satz- und
 * Sonderzeichen bekommen einen, weil man sie beim Namen allein nicht einordnen
 * kann. Der Name kommt aus `spokenLabel` (dieselben Namen wie beim Üben);
 * `name` steht nur dort, wo `spokenLabel` keinen kennt.
 * ═══════════════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN = ["wird beim Programmieren gebraucht."] as const;

const ZEICHEN: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["steht am Ende von einem Satz."] },
  ",": { was: ["trennt Teile von einem Satz."] },
  "?": { was: ["steht am Ende von einer Frage."] },
  "!": { was: ["steht am Ende von einem Ausruf."] },
  ":": { was: ["kündigt etwas an, zum Beispiel eine Aufzählung."] },
  ";": { was: ["trennt zwei Teile von einem Satz, stärker als ein Komma."] },
  "-": { was: ["verbindet Wörter, zum Beispiel bei E-Mail."] },
  "@": { was: ["steht in jeder E-Mail-Adresse."] },
  "+": { was: ["rechnet plus.", "In Tastenkürzeln bedeutet es gleichzeitig drücken."] },
  "*": { was: ["rechnet am Computer mal."] },
  "/": { was: ["rechnet am Computer geteilt.", "Er steht auch in Internet-Adressen."] },
  "=": { was: ["steht vor dem Ergebnis einer Rechnung."] },
  "'": { was: ["zeigt, dass ein Buchstabe fehlt, zum Beispiel bei geht's."] },
  '"': { name: "Anführungszeichen", was: ["steht vor und nach dem, was jemand sagt."] },
  "(": { name: "runde Klammer auf", was: ["beginnt etwas, das man dazuschreibt."] },
  ")": { name: "runde Klammer zu", was: ["beendet das, was man dazugeschrieben hat."] },
  "%": { name: "Prozent", was: ["bedeutet von hundert, zum Beispiel 50 Prozent."] },
  // ★ Testerin 24.10.2026: „kaufmännisches Und wie bei Müller & Söhne, also in Firmennamen.
  // Nicht, dass die Schüler in Texten anfangen, das zu benutzen."
  "&": {
    name: "kaufmännisches Und",
    was: ["steht in Firmennamen, zum Beispiel Müller & Söhne.", "Im normalen Text schreibt man und aus."],
  },
  // ★ Testerin 24.10.2026: Raute, Hashtag oder Nummernzeichen - alle drei Namen.
  "#": { name: "Raute", was: ["heißt auch Hashtag oder Nummernzeichen."] },
  "€": { name: "Euro", was: ["ist das Zeichen für Euro."] },
  $: { was: ["ist das Zeichen für Dollar."] },
  "£": { was: ["ist das Zeichen für das englische Pfund."] },
  "§": { was: ["steht vor Gesetzen und Regeln."] },
  "°": { was: ["zeigt Grad an, zum Beispiel bei der Temperatur."] },
  "<": { name: "kleiner als", was: ["vergleicht zwei Zahlen, die linke ist kleiner."] },
  ">": { name: "größer als", was: ["vergleicht zwei Zahlen, die linke ist größer."] },
  _: { name: "Unterstrich", was: ["steht oft in E-Mail-Adressen und Dateinamen."] },
  "^": { was: ["heißt beim Rechnen hoch, zum Beispiel 2 hoch 3."] },
  "²": { name: "hoch 2", was: ["steht bei Flächen, zum Beispiel Quadratmeter."] },
  "³": { name: "hoch 3", was: ["steht bei Rauminhalten, zum Beispiel Kubikmeter."] },
  "[": { was: PROGRAMMIEREN },
  "]": { was: PROGRAMMIEREN },
  "{": { was: PROGRAMMIEREN },
  "}": { was: PROGRAMMIEREN },
  "\\": { was: PROGRAMMIEREN },
  // ★ Testerin 24.10.2026: mit Namen ansagen (vorher nur der Satz zum Programmieren).
  "|": { name: "senkrechter Strich", was: PROGRAMMIEREN },
  "~": { was: PROGRAMMIEREN },
  "´": { was: ["setzt einen Strich auf einen Buchstaben."] },
  "`": { was: ["setzt einen Strich auf einen Buchstaben."] },
  "¨": { was: ["setzt zwei Punkte auf einen Buchstaben."] },
};

/* ══ Zusammensetzen ═════════════════════════════════════════════════════════ */

/** Sprungtasten: geschluckt wie unter Windows, auch wo das Wörterbuch sie nicht führt. */
const SPRUNGTASTEN = new Set(["Home", "End", "PageUp", "PageDown", "Insert"]);

/** Was der Ziffernblock ohne Num meldet - `key` und `code` heissen dann wie die eigene Taste. */
const ZIFFERNBLOCK_OHNE_NUM = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Home", "End", "PageUp", "PageDown", "Insert", "Delete",
]);

/**
 * F1-F24 - alle werden geschluckt. ★ Bis 27.10.2026 lief F5 durch (Neuladen
 * als dritter Ausweg). Testerin 24.10.: Wer F5 erkunden will, landet auf der
 * Startseite. Alt + 3 und zweimal Esc reichen als Ausweg.
 */
export function istFTasteOhneAusweg(key: string): boolean {
  return /^F([1-9]|1[0-9]|2[0-4])$/.test(key);
}

const gross1 = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** „Tab - Tabulatortaste - springt …" für Schirm und Braillezeile. */
export function zeileFuer(t: TastenErklaerung): string {
  const kopf = t.kurz ? `${t.kurz} - ${t.name}` : t.name;
  return t.was.length ? `${kopf} - ${t.was.join(" ")}` : kopf;
}

/** „Tab, Tabulatortaste: Springt …" für die Stimme. */
export function ansageFuer(t: TastenErklaerung): string {
  // ★ Testerin 04.11.2026: „Entf" sprach die Stimme als „Entfach". Der Name
  // „Entfernen-Taste" sagt dasselbe - die Abkürzung bleibt auf Schirm und
  // Braillezeile (`zeileFuer`), nur die STIMME lässt sie weg.
  const sprichtFalsch = t.kurz === "Entf" && t.name.startsWith("Entfernen");
  const kopf = t.kurz && !sprichtFalsch ? `${t.kurz}, ${t.name}` : t.name;
  return t.was.length ? `${kopf}: ${gross1(t.was.join(" "))}` : `${kopf}.`;
}

/**
 * Die Erklärung einer Sondertaste - oder `null`, wenn es ein Zeichen ist
 * (Buchstabe, Ziffer, Satzzeichen) oder eine Taste, die hier niemand kennt.
 */
export function erklaereSondertaste(
  e: KeyEventLike,
  plattform: Plattform,
): TastenErklaerung | null {
  const eintrag = tasteFuerEreignis(e, plattform);
  if (eintrag) return sondertaste(eintrag.id, plattform);
  return nachKey(e.key, plattform);
}

/* ══ Tastenkombinationen und der dritte Layer ═══════════════════════════════
 *
 * Johannes, 12.09.2026: „dritter layer funktioniert nicht, also die
 * sonderzeichen wie geschweifte klammer oder eckigeklammer oder @" und
 * „tastenkombinationen funktionieren nicht, du kennst von im Griff die tasten
 * die durchgereicht werden".
 *
 *  · DURCHGEREICHT werden nur die eigenen Kürzel von Tastenflow - dieselbe
 *    Regel wie im Explorier-Modus von »im Griff« (`isAppShortcut`).
 *  · Jede andere Kombination ist Lernstoff: Sie wird angesagt, und was sie
 *    tut, kommt aus dem Kürzel-Katalog von »im Griff« (`skillsFuer`,
 *    `wirkungFuer` - nur gelesen). Kennt der Katalog sie nicht, sagt die Zeile
 *    das ehrlich.
 *  · Der DRITTE LAYER ist keine Kombination: unter Windows AltGr (der Browser
 *    meldet Strg + Alt, erkannt über `getModifierState("AltGraph")`), am Mac
 *    die Wahltaste (Option + L = @, Option + 5 = [). Bis dahin fiel am Mac jedes
 *    Option-Zeichen unter „Alt-Kombination, durchreichen" und blieb stumm.
 *    Das Zeichen wird erklärt, und der Weg dorthin steht dahinter:
 *    „@ - At-Zeichen - steht in jeder E-Mail-Adresse. Mit Option + L."
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Die Alt-Kürzel von Tastenflow selbst (physische Tasten). Sie gehören der
 * Seite und laufen im Erkunden-Modus durch.
 *
 * ⚠️ Diese Liste steht ein zweites Mal im Code der Seite - darum hält ein
 * Wächter sie dagegen (`tests/typing-tasten-erkunden-kombinationen.test.ts`
 * liest die `case`-Zeilen von `onKey` in `TippenTrainerPage.tsx` und die
 * `unsereAltTaste`-Aufrufe in `AppKopfzeile.tsx`). Wer dort ein Alt-Kürzel
 * dazulegt, bekommt den Wächter rot, bis es auch hier steht.
 * Alt + 3 fehlt mit Absicht: Das ist der Ausgang, den der Modus selbst behandelt.
 * Alt + 4 ebenso (13.09.2026): Es wechselt im Fenster zwischen Erkunden und Finden.
 */
export const TASTENFLOW_ALT_CODES: ReadonlySet<string> = new Set([
  // TippenTrainerPage.tsx, onKey
  "KeyB", "KeyD", "KeyE", "KeyG", "KeyH", "KeyL", "KeyM", "KeyO", "KeyR",
  "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyY", "KeyZ",
  "Equal", "NumpadAdd", "BracketRight", "Minus", "NumpadSubtract", "Slash",
  // ★ 15.10.2026: Alt + 6, Melodie beim Tippen; 16.10.: Alt + 7 / Alt + 8 Klang
  "Digit6", "Numpad6", "Digit7", "Numpad7", "Digit8", "Numpad8",
  // ★ 18.10.2026 (Kürzel einheitlich): Alt + 0, normale Größe (`istNormalgroesseTaste`).
  //   KeyW, KeyY und KeyZ oben bleiben ALLE drei: Alt + Z und Alt + W gelten seitdem
  //   nach dem Aufdruck der eingestellten Tastatur - welche Lage sie haben, hängt an ihr.
  "Digit0", "Numpad0",
  // ★ 13.11.2026: Alt + 2, „Gezielt üben" - Tasten wählen.
  "Digit2", "Numpad2",
  // AppKopfzeile.tsx, unsereAltTaste (Konto, Farben)
  "KeyJ", "KeyK",
]);

/**
 * Gehört dieser Tastendruck der Seite (ein Tastenflow-Kürzel)? Dann reicht der
 * Erkunden-Modus ihn durch, ohne ihn anzusagen.
 *
 * ★ Am Mac gewinnt der dritte Layer: Option + L ist dort das @ und zugleich
 * Alt + L (Übungsstufe), Option + E das € und Alt + E. Im Erkunden-Modus ist
 * das Zeichen der Lernstoff - wer die Übungsstufe hören will, verlässt ihn.
 */
export function gehoertDerSeite(e: KeyEventLike, plattform: Plattform, altGr = false): boolean {
  if (!e.altKey || e.ctrlKey || e.metaKey || altGr) return false;
  if (plattform === "macos" && istDritterLayerZeichen(e)) return false;
  return TASTENFLOW_ALT_CODES.has(e.code ?? "") || e.key === "+" || e.key === "-";
}

/**
 * Ist das ein Zeichen, das „Tasten erkunden" erklärt (eines aus `ZEICHEN`)?
 *
 * ★ 12.09.2026, seit »Im Griff« den Modus mitbenutzt (Alt + 3): Beide Apps
 * entscheiden am Mac damit, ob Option + Taste der dritte Layer ist (erklären)
 * oder ein Kürzel der Seite (durchreichen). Die Plattform- und Modifier-Prüfung
 * bleibt beim Aufrufer.
 *
 * ⚠️ Mit Absicht NICHT „jedes druckbare Zeichen": Option + H liefert am Mac „ª"
 * und muss Alt + H bleiben, Option + V liefert „√" und bleibt Alt + V.
 */
export function istDritterLayerZeichen(e: KeyEventLike): boolean {
  return e.key.length === 1 && !!ZEICHEN[e.key];
}

/** Tasten, die allein keine Kombination sind, sondern selbst erklärt werden. */
const MODIFIKATOR_KEYS = new Set(["Control", "Alt", "Meta", "Shift", "AltGraph", "CapsLock", "Fn", "OS"]);

/** Ist das eine Tastenkombination (und nicht ein Zeichen oder eine einzelne Taste)? */
function istKombination(e: KeyEventLike, plattform: Plattform, altGr: boolean): boolean {
  if (MODIFIKATOR_KEYS.has(e.key)) return false;
  if (altGr) return false;
  if (e.ctrlKey || e.metaKey) return true;
  if (e.altKey) {
    // Mac: Option + Taste mit EIGENEM Zeichen (oder Totaste) ist der dritte
    // Layer. Bleibt es der blanke Buchstabe oder die Ziffer, hat die Wahltaste
    // nichts daraus gemacht - dann ist es eine Kombination (Probelauf
    // 12.09.2026: „l - Mit Option + L." wäre Unsinn gewesen).
    const zeichen = e.key.length === 1 && !/^\s$/.test(e.key) && !/^[a-z0-9]$/i.test(e.key);
    return !(plattform === "macos" && (zeichen || e.key === "Dead"));
  }
  // Umschalt + Buchstabe ist ein Grossbuchstabe; Umschalt + Tab, Pfeil,
  // Enter, Leertaste … ist eine Kombination.
  // ★ 13.09.2026: Umschalt + Totaste ist keine Kombination, sondern eine
  // eigene Totaste (auf der deutschen Tastatur der Gravis `).
  if (e.shiftKey) return e.key !== "Dead" && (e.key.length !== 1 || e.key === " ");
  return false;
}

/**
 * Was auf der Taste steht: „C", „Z" (QWERTZ!), „5", „Tab", „Pfeil nach links".
 * ★ EN1: englisch der kurze Name aus `TASTE_KURZ_EN` („Space", „Home").
 */
function tastenAufdruck(
  e: KeyEventLike,
  plattform: Plattform,
  layout: LayoutId,
  sprache: BedienSprache = "de",
): string {
  const code = e.code ?? "";
  const buchstabe = /^Key([A-Z])$/.exec(code);
  if (buchstabe) {
    const b = buchstabe[1];
    // Auf QWERTZ liegen Y und Z vertauscht: KeyY trägt den Aufdruck Z.
    if (istQwertz(layout) && (b === "Y" || b === "Z")) return b === "Y" ? "Z" : "Y";
    return b;
  }
  const ziffer = /^(?:Digit|Numpad)(\d)$/.exec(code);
  if (ziffer) return ziffer[1];
  // ★ Meldung 28.10.2026: AltGr + < meldete `key` „|" - der Weg hiess „AltGr + |". Die Taste links neben Y trägt auf ISO-Tastaturen den Aufdruck „<" (UK: „\\").
  if (code === "IntlBackslash") return layout === "uk" ? "\\" : layout === "us" || layout.startsWith("ca") ? e.key : "<";
  const en = sprache === "en";
  const fr = sprache === "fr";
  const es = sprache === "es";
  const it = sprache === "it";
  const pl = sprache === "pl";
  // ★ G3c-VERTEILER (25.10.2026): eine Gerüst-Sprache aus ihrer Datei - vorher fiel sie hier durch alle Zweige in den DEUTSCHEN (Falle 30).
  const satz = geruestSatz(sprache);
  // ★ O-TR (02.10.2026): türkische Kurznamen und Sätze (`tastenErklaerungTr.ts`).
  const tr = sprache === "tr";
  // ★ O-CS (03.10.2026): tschechische Kurznamen und Sätze (`tastenErklaerungCs.ts`).
  const cs = sprache === "cs";
  const TASTE_KURZ = satz ? satz.tasteKurz : en ? TASTE_KURZ_EN : fr ? TASTE_KURZ_FR : es ? TASTE_KURZ_ES : it ? TASTE_KURZ_IT : pl ? TASTE_KURZ_PL : tr ? TASTE_KURZ_TR : cs ? TASTE_KURZ_CS : null;
  if (e.key === " " || code === "Space") return TASTE_KURZ?.leertaste ?? "Leertaste";
  const eintrag = tasteFuerEreignis(e, plattform);
  if (TASTE_KURZ && eintrag && TASTE_KURZ[eintrag.id]) return TASTE_KURZ[eintrag.id];
  const t = satz
    ? eintrag
      ? satz.sondertaste(eintrag.id, plattform, layout)
      : satz.nachKey(e.key, plattform, layout)
    : cs
    ? eintrag
      ? sondertasteCs(eintrag.id, plattform, layout)
      : nachKeyCs(e.key, plattform, layout)
    : tr
    ? eintrag
      ? sondertasteTr(eintrag.id, plattform, layout)
      : nachKeyTr(e.key, plattform, layout)
    : pl
    ? eintrag
      ? sondertastePl(eintrag.id, plattform, layout)
      : nachKeyPl(e.key, plattform, layout)
    : it
    ? eintrag
      ? sondertasteIt(eintrag.id, plattform, layout)
      : nachKeyIt(e.key, plattform, layout)
    : en
    ? eintrag
      ? sondertasteEn(eintrag.id, plattform, layout)
      : nachKeyEn(e.key, plattform, layout)
    : fr
      ? eintrag
        ? sondertasteFr(eintrag.id, plattform, layout)
        : nachKeyFr(e.key, plattform, layout)
      : es
        ? eintrag
          ? sondertasteEs(eintrag.id, plattform, layout)
          : nachKeyEs(e.key, plattform, layout)
        : eintrag
          ? sondertaste(eintrag.id, plattform)
          : nachKey(e.key, plattform);
  if (t) return t.kurz ?? t.name;
  // ★ O-TR (02.10.2026): türkisch gross gerechnet („i" ⇒ „İ", nie „I"; Glossar §4 Nr. 1).
  if (e.key.length === 1) return satz ? satz.aufdruckGross(e.key) : tr ? grossFuer(e.key, "tr") : e.key.toUpperCase();
  return e.key;
}

/**
 * ★ E11a-5 (26.09.2026): die Umschalttaste und AltGr in einer Kombination je
 * Sprache - Deutsch und Englisch wie bisher („Shift", „AltGr"), Französisch
 * so, wie es auf der AZERTY-Kappe steht und `tastenErklaerungFr.ts` die Taste
 * nennt („Maj", „Alt Gr", Glossar §9.2). Nur Wörter - welche Taste gedrückt
 * ist, entscheidet dieselbe Logik.
 */
// ★ ES-O: Spanisch wie auf der Kappe - „Mayús", „Alt Gr" (Bauplan S13).
const SHIFT_WORT: Readonly<Record<BedienSprache, string>> = {
  de: "Shift",
  en: "Shift",
  fr: "Maj",
  es: "Mayús",
  // ★ O-IT (02.10.2026): wie auf der italienischen Kappe (Glossar §2.9).
  it: "Maiusc",
  pl: "Shift", // ★ O-PL (02.10.2026): wie auf der polnischen Kappe (Glossar §2.9).
  tr: "Shift", // ★ O-TR (02.10.2026): wie auf der türkischen Kappe (Glossar §2.9).
  cs: "Shift", // ★ O-CS (03.10.2026): wie auf der tschechischen Kappe (Glossar §2.9).
  // ★ O2-TASTATUR (30.10.2026): wie auf der Kappe (Glossare §2.9) - nur Schwedisch weicht ab („Skift").
  bg: "Shift",
  el: "Shift",
  hu: "Shift",
  nl: "Shift",
  pt: "Shift",
  br: "Shift",
  ro: "Shift",
  sv: "Skift",
  uk: "Shift",
};
const ALTGR_WORT: Readonly<Record<BedienSprache, string>> = {
  de: "AltGr",
  en: "AltGr",
  fr: "Alt Gr",
  es: "Alt Gr",
  it: "Alt Gr",
  pl: "prawy Alt", // ★ O-PL (02.10.2026): auf US-Kappen steht rechts nur „Alt" (Glossar §2.9).
  tr: "Alt Gr", // ★ O-TR (02.10.2026): wie auf der türkischen Kappe (Glossar §2.9).
  cs: "AltGr", // ★ O-CS (03.10.2026): „AltGr" wie in der tschechischen Hersteller-Hilfe, nie „Alt Gr" (Glossar §2.9) - gilt auch für cs.
  // ★ O2-TASTATUR (30.10.2026): die Schreibweise der Glossare §2.9 (el, nl, pt, br, ro, sv mit Leerzeichen).
  bg: "AltGr",
  el: "Alt Gr",
  hu: "AltGr",
  nl: "Alt Gr",
  pt: "Alt Gr",
  br: "Alt Gr",
  ro: "Alt Gr",
  sv: "Alt Gr",
  uk: "AltGr",
};

/**
 * ★ E11a-5: der Doppelpunkt vor einer Wirkung mit Ort („In Word: Speichern.") -
 * Französisch mit Leerzeichen davor („Dans Word : Enregistrer."), wie im
 * übrigen französischen Code (Bauplan F8). Der Satz steht auf der Braillezeile.
 */
const DOPPELPUNKT: Readonly<Record<BedienSprache, string>> = {
  de: ": ",
  en: ": ",
  fr: " : ",
  es: ": ",
  it: ": ", // ★ O-IT: Italienisch ohne Leerzeichen vor dem Doppelpunkt (Glossar Regel 7).
  pl: ": ", // ★ O-PL: kein Leerzeichen vor dem Doppelpunkt (Glossar Regel 8).
  tr: ": ", // ★ O-TR: kein Leerzeichen vor dem Doppelpunkt (Glossar Regel 7).
  cs: ": ", // ★ O-CS: kein Leerzeichen vor dem Doppelpunkt (Glossar Regel 7) - gilt auch für cs.
  // ★ O2-TASTATUR (30.10.2026): in allen neun kein Leerzeichen vor dem Doppelpunkt.
  bg: ": ",
  el: ": ",
  hu: ": ",
  nl: ": ",
  pt: ": ",
  br: ": ",
  ro: ": ",
  sv: ": ",
  uk: ": ",
};

/** „Strg + Shift + N" (Windows) bzw. „Option + Shift + cmd + N" (Mac, Apples Reihenfolge). */
function kombinationsName(
  e: KeyEventLike,
  plattform: Plattform,
  layout: LayoutId,
  sprache: BedienSprache = "de",
): string {
  const teile: string[] = [];
  if (plattform === "macos") {
    if (e.ctrlKey) teile.push("ctrl");
    if (e.altKey) teile.push("Option");
    if (e.shiftKey) teile.push(SHIFT_WORT[sprache]);
    if (e.metaKey) teile.push("cmd");
  } else {
    // ★ E12: eine Tabelle statt einer weiteren Ternäre (Weichen-Zähler) - „Strg"
    // ist die Vorgabe, Englisch UND Französisch sagen „Ctrl" (Glossar §9.2).
    const CTRL_WORT: Readonly<Record<BedienSprache, string>> = {
      de: "Strg",
      en: "Ctrl",
      fr: "Ctrl",
      es: "Ctrl",
      it: "Ctrl", // ★ O-IT: „Ctrl" auf der italienischen Kappe (Glossar §2.9).
      pl: "Ctrl", // ★ O-PL: „Ctrl", nie „Strg" (Glossar §2.9, Falle 6).
      tr: "Ctrl", // ★ O-TR: „Ctrl", nie „Strg" (Glossar §2.9).
      cs: "Ctrl", // ★ O-CS: „Ctrl", nie „Strg" (Glossar §2.9) - gilt auch für cs.
      // ★ O2-TASTATUR (30.10.2026): „Ctrl" auf der Kappe, in allen neun (Glossare §2.9).
      bg: "Ctrl",
      el: "Ctrl",
      hu: "Ctrl",
      nl: "Ctrl",
      pt: "Ctrl",
      br: "Ctrl",
      ro: "Ctrl",
      sv: "Ctrl",
      uk: "Ctrl",
    };
    if (e.ctrlKey) teile.push(CTRL_WORT[sprache]);
    if (e.shiftKey) teile.push(SHIFT_WORT[sprache]);
    if (e.altKey) teile.push("Alt");
    if (e.metaKey) teile.push("Win");
  }
  teile.push(tastenAufdruck(e, plattform, layout, sprache));
  return teile.join(" + ");
}

/** Wo eine Wirkung gilt - in Kindersprache. `grundlagen` gilt fast überall. */
const ORT: Partial<Record<ModulId, string>> = {
  explorer: "im Explorer",
  finder: "im Finder",
  word: "in Word",
  excel: "in Excel",
  browser: "im Browser",
  teams: "in Teams",
  powerpoint: "in PowerPoint",
  outlook: "in Outlook",
  bedienungshilfen: "beim Screenreader",
};

/**
 * Kombinationen, die ein Kind beim Erkunden oft trifft, die der Katalog von
 * »im Griff« aber (noch) nicht lehrt. Bewusst kurz - nur, was sicher stimmt.
 */
const EIGENE_KOMBINATIONEN: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "springt zurück zum vorigen Element." },
    { keys: "Strg+P", was: "öffnet das Fenster zum Drucken." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "springt zurück zum vorigen Element." },
    { keys: "Cmd+P", was: "öffnet das Fenster zum Drucken." },
  ],
};

function aufzaehlung(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}`;
}

const klein1 = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);

/**
 * Was diese Kombination tut - höchstens drei Sätze, das Allgemeine zuerst.
 * Leer, wenn weder der Katalog von »im Griff« noch die eigene kleine Liste sie
 * kennt. ⚠️ Seit 28.09.2026 zählt der Katalog nur, wenn er schon geladen ist
 * (`ladeKuerzelKatalog`) - vorher antwortet nur die eigene Liste.
 */
export function wirkungenDerKombination(
  e: KeyEventLike,
  plattform: Plattform,
  layout: LayoutId = "de",
  /**
   * ★ EN1 (19.09.2026), erweitert ★ E12 (26.09.2026): die Bedienungssprache.
   * Englisch/Französisch kommen die Wirkungen aus `wirkungEn`/`wirkungFr`
   * (nach der Kennung der Wirkung, der Katalog von »Im Griff« bleibt deutsch
   * und unberührt); eine Wirkung ohne Eintrag in der jeweiligen Sprache fällt
   * weg, statt deutsch mitten im fremdsprachigen Satz zu stehen.
   */
  sprache: BedienSprache = "de",
): string[] {
  const en = sprache === "en";
  const fr = sprache === "fr";
  const es = sprache === "es";
  const it = sprache === "it";
  const pl = sprache === "pl";
  // ★ O-TR (02.10.2026): türkische Wirkungen und Orte (`tastenErklaerungTr.ts`).
  const tr = sprache === "tr";
  // ★ O-CS (03.10.2026): tschechische Wirkungen und Orte (`tastenErklaerungCs.ts`).
  const cs = sprache === "cs";
  // ★ G3c-VERTEILER (25.10.2026): eine Gerüst-Sprache aus ihrer Datei (vorher: der deutsche Katalog, Falle 30).
  const satz = geruestSatz(sprache);
  const eigeneKombinationen = satz
    ? satz.eigeneKombinationen
    : cs
    ? EIGENE_KOMBINATIONEN_CS
    : tr
    ? EIGENE_KOMBINATIONEN_TR
    : pl
    ? EIGENE_KOMBINATIONEN_PL
    : it
    ? EIGENE_KOMBINATIONEN_IT
    : en
    ? EIGENE_KOMBINATIONEN_EN
    : fr
      ? EIGENE_KOMBINATIONEN_FR
      : es
        ? EIGENE_KOMBINATIONEN_ES
        : EIGENE_KOMBINATIONEN;
  const saetze: string[] = [];
  for (const k of eigeneKombinationen[plattform]) {
    if (matchesChord(e, parseChord(k.keys), layout)) saetze.push(k.was);
  }
  const nachWirkung = new Map<string, { ueberall: boolean; orte: string[] }>();
  // Ohne geladenen Katalog nur die eigene kleine Liste - wer ihn braucht,
  // erfährt es über `katalogFehlt` (siehe `erkundeTaste`).
  for (const s of kuerzelKatalog(plattform) ?? []) {
    // Ein Weg, der früher ein Kürzel war, zählt mit seinem ersten Griff (Wege-Umbau 01.10.2026).
    const griff = s.check.type === "chord" ? s.check.expect : (WEG_ERSTER_GRIFF[s.id] ?? "");
    if (!griff.includes("+")) continue;
    if (!matchesChord(e, parseChord(griff), layout)) continue;
    const wirkung = wirkungFuer(s.id);
    const roh = satz
      ? wirkung
        ? satz.wirkung(wirkung.id, plattform)
        : null
      : cs
      ? wirkung
        ? wirkungCs(wirkung.id, plattform)
        : null
      : tr
      ? wirkung
        ? wirkungTr(wirkung.id, plattform)
        : null
      : pl
      ? wirkung
        ? wirkungPl(wirkung.id, plattform)
        : null
      : it
      ? wirkung
        ? wirkungIt(wirkung.id, plattform)
        : null
      : en
      ? wirkung
        ? wirkungEn(wirkung.id, plattform)
        : null
      : fr
        ? wirkung
          ? wirkungFr(wirkung.id, plattform)
          : null
        : es
          ? wirkung
            ? wirkungEs(wirkung.id, plattform)
            : null
          : (wirkung?.muster ?? s.titel);
    if (roh === null) continue;
    // Ein „ - " im Muster liest sich auf der Braillezeile wie ein neuer Teil.
    const muster = roh.replace(/ - /g, ", ");
    const eintrag = nachWirkung.get(muster) ?? { ueberall: false, orte: [] };
    if (s.modul === "grundlagen") eintrag.ueberall = true;
    else {
      const ort = satz ? satz.ort[s.modul] : cs ? ORT_CS[s.modul] : tr ? ORT_TR[s.modul] : pl ? ORT_PL[s.modul] : it ? ORT_IT[s.modul] : en ? ORT_EN[s.modul] : fr ? ORT_FR[s.modul] : es ? ORT_ES[s.modul] : ORT[s.modul];
      if (ort && !eintrag.orte.includes(ort)) eintrag.orte.push(ort);
    }
    nachWirkung.set(muster, eintrag);
  }
  const aufzaehlen = satz ? satz.aufzaehlung : cs ? aufzaehlungCs : tr ? aufzaehlungTr : pl ? aufzaehlungPl : it ? aufzaehlungIt : en ? aufzaehlungEn : fr ? aufzaehlungFr : es ? aufzaehlungEs : aufzaehlung;
  const reihe = [...nachWirkung.entries()].sort(([, a], [, b]) => Number(b.ueberall) - Number(a.ueberall));
  for (const [muster, { ueberall, orte }] of reihe) {
    saetze.push(ueberall || orte.length === 0 ? `${muster}.` : `${aufzaehlen(orte)}${DOPPELPUNKT[sprache]}${muster}.`);
  }
  return saetze.slice(0, 3).map((s, i) => (i === 0 ? klein1(s) : gross1(s)));
}

/** Wie der Modus aufgerufen wird: welche Tastatur, und ob AltGr gehalten ist. */
export interface ErkundenOptionen {
  /** Die eingestellte Tastatur - Vorgabe deutsch (QWERTZ). */
  layout?: LayoutId;
  /**
   * ★ EN1 (19.09.2026), erweitert ★ E12 (26.09.2026): die Bedienungssprache -
   * Vorgabe Deutsch, also genau die Sätze von vorher (»Im Griff« gibt sie nie
   * mit). Englisch/Französisch kommen die Wörter aus `tastenErklaerungEn.ts`/
   * `tastenErklaerungFr.ts`; was geschluckt wird, entscheidet dieselbe Logik.
   */
  sprache?: BedienSprache;
  /** `event.getModifierState("AltGraph")` - der Browser weiss es, `KeyEventLike` nicht. */
  altGr?: boolean;
  /**
   * `event.getModifierState("CapsLock")` beim Druck der Feststelltaste - ob sie
   * jetzt an ist. Ohne Angabe bleibt der Satz wie bisher (»Im Griff«, Tests).
   */
  feststellAn?: boolean;
}

/**
 * ★ Testerin 24.10.2026: der Zustand der Feststelltaste nach dem Druck. Die
 * fr/es/it/pl/tr/cs und die neun Sprachen: Vorgabe, von Muttersprachlern ungeprüft.
 */
const FESTSTELL_ZUSTAND: Readonly<Record<BedienSprache, { an: string; aus: string }>> = {
  // ★ Testerin 04.11.2026 (Meldung p20iv0clc9c0tph): „Schreibt jetzt alles groß?" kann ein Kind im laufenden Programm nicht
  // feststellen. Darum sagt der Satz, was IST, und wie man wieder klein schreibt.
  de: {
    an: "Sie ist jetzt an: Alles wird groß geschrieben. Drück sie noch einmal, dann schreibst du wieder klein.",
    aus: "Sie ist jetzt aus: Du schreibst wieder klein.",
  },
  en: {
    an: "It is on now: everything comes out in capitals. Press it again to type small letters again.",
    aus: "It is off now: you type small letters again.",
  },
  fr: { an: "Elle est maintenant activée. Appuie encore une fois pour la désactiver.", aus: "Elle est maintenant désactivée." },
  es: { an: "Ahora está activada. Púlsala otra vez para desactivarla.", aus: "Ahora está desactivada." },
  it: { an: "Ora è attivo. Premilo ancora una volta per disattivarlo.", aus: "Ora è disattivato." },
  pl: { an: "Teraz jest włączony. Naciśnij go jeszcze raz, żeby go wyłączyć.", aus: "Teraz jest wyłączony." },
  tr: { an: "Şimdi açık. Kapatmak için bir kez daha bas.", aus: "Şimdi kapalı." },
  cs: { an: "Teď je zapnutá. Stiskni ji ještě jednou a vypne se.", aus: "Teď je vypnutá." },
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen, ohne Muttersprachler-Lesung. Das Geschlecht folgt dem Kopfwort der Taste
  // (клавиш m., πλήκτρο n., клавіша f., tasta f., tecla f.).
  bg: { an: "Сега е включен. Натисни го още веднъж, за да го изключиш.", aus: "Сега е изключен." },
  el: { an: "Τώρα είναι ενεργό. Πάτησέ το άλλη μία φορά για να το απενεργοποιήσεις.", aus: "Τώρα είναι ανενεργό." },
  hu: { an: "Most be van kapcsolva. Nyomd meg még egyszer, és kikapcsol.", aus: "Most ki van kapcsolva." },
  nl: { an: "Hij staat nu aan. Druk nog een keer om hem uit te zetten.", aus: "Hij staat nu uit." },
  pt: { an: "Agora está ligada. Prime-a outra vez para a desligar.", aus: "Agora está desligada." },
  br: { an: "Agora está ligada. Pressione de novo para desligar.", aus: "Agora está desligada." },
  ro: { an: "Acum este pornită. Apas-o încă o dată ca să o oprești.", aus: "Acum este oprită." },
  sv: { an: "Den är på nu. Tryck en gång till för att stänga av den.", aus: "Den är av nu." },
  uk: { an: "Зараз вона ввімкнена. Натисни її ще раз, щоб вимкнути.", aus: "Зараз вона вимкнена." },
};

/**
 * ★ Testerin 24.10.2026: „Bei J und F sind die Markierungen dargestellt, das
 * könnte man noch als Hinweis mitliefern (auch bei Num5)." Erkannt am `code`,
 * also an der Lage der Taste - auf AZERTY oder Türkisch-F trägt dieselbe
 * Stelle die Marke, egal welcher Buchstabe darauf steht.
 * fr/es/it/pl/tr/cs und die neun Sprachen: Vorgabe, von Muttersprachlern ungeprüft.
 */
const TASTMARKE: Readonly<Record<BedienSprache, { erhebung: string; zeigefinger: string; mittelfinger: string }>> = {
  de: { erhebung: "Auf dieser Taste ist eine kleine Erhebung zum Ertasten.", zeigefinger: "Hier liegt ein Zeigefinger.", mittelfinger: "Hier liegt der Mittelfinger." },
  en: { erhebung: "This key has a small bump you can feel.", zeigefinger: "An index finger rests here.", mittelfinger: "Your middle finger rests here." },
  fr: { erhebung: "Cette touche a un petit relief que tu peux sentir.", zeigefinger: "Un index se pose ici.", mittelfinger: "Le majeur se pose ici." },
  es: { erhebung: "Esta tecla tiene un pequeño relieve que puedes notar.", zeigefinger: "Aquí se apoya un dedo índice.", mittelfinger: "Aquí se apoya el dedo corazón." },
  it: { erhebung: "Questo tasto ha un piccolo rilievo che puoi sentire.", zeigefinger: "Qui si appoggia un dito indice.", mittelfinger: "Qui si appoggia il dito medio." },
  pl: { erhebung: "Na tym klawiszu jest mała wypukłość, którą możesz wyczuć.", zeigefinger: "Tu leży palec wskazujący.", mittelfinger: "Tu leży palec środkowy." },
  tr: { erhebung: "Bu tuşta parmakla hissedebileceğin küçük bir çıkıntı var.", zeigefinger: "İşaret parmağı burada durur.", mittelfinger: "Orta parmak burada durur." },
  cs: { erhebung: "Na této klávese je malý výstupek, který nahmatáš.", zeigefinger: "Tady leží ukazováček.", mittelfinger: "Tady leží prostředníček." },
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen, ohne Muttersprachler-Lesung. Erkannt wird weiter an der Lage (`code`).
  bg: { erhebung: "На този клавиш има малка издатина, която можеш да напипаш.", zeigefinger: "Тук стои показалец.", mittelfinger: "Тук стои средният пръст." },
  el: { erhebung: "Αυτό το πλήκτρο έχει ένα μικρό εξόγκωμα που μπορείς να νιώσεις.", zeigefinger: "Εδώ ακουμπά ένας δείκτης.", mittelfinger: "Εδώ ακουμπά ο μέσος." },
  hu: { erhebung: "Ezen a billentyűn kis kiemelkedés van, amit kitapinthatsz.", zeigefinger: "Itt nyugszik egy mutatóujj.", mittelfinger: "Itt nyugszik a középső ujj." },
  nl: { erhebung: "Op deze toets zit een klein bobbeltje dat je kunt voelen.", zeigefinger: "Hier rust een wijsvinger.", mittelfinger: "Hier rust de middelvinger." },
  pt: { erhebung: "Esta tecla tem um pequeno relevo que podes sentir.", zeigefinger: "Aqui fica um indicador.", mittelfinger: "Aqui fica o dedo médio." },
  br: { erhebung: "Esta tecla tem um pequeno relevo que dá para sentir.", zeigefinger: "Aqui fica um indicador.", mittelfinger: "Aqui fica o dedo médio." },
  ro: { erhebung: "Această tastă are o mică proeminență pe care o poți simți.", zeigefinger: "Aici stă un arătător.", mittelfinger: "Aici stă mijlociul." },
  sv: { erhebung: "Den här tangenten har en liten upphöjning som du kan känna.", zeigefinger: "Här vilar ett pekfinger.", mittelfinger: "Här vilar långfingret." },
  uk: { erhebung: "На цій клавіші є маленький виступ, який можна намацати.", zeigefinger: "Тут лежить вказівний палець.", mittelfinger: "Тут лежить середній палець." },
};

/** Der Satz zur Tastmarke - oder `null`, wenn die Taste keine hat. */
export function tastmarke(e: KeyEventLike, sprache: BedienSprache): string | null {
  const finger = e.code === "KeyF" || e.code === "KeyJ" ? "zeigefinger" : e.code === "Numpad5" ? "mittelfinger" : null;
  if (!finger) return null;
  const s = TASTMARKE[sprache]!;
  return `${s.erhebung} ${s[finger]}`;
}

export function feststellZustand(sprache: BedienSprache, an: boolean): string {
  const s = FESTSTELL_ZUSTAND[sprache]!;
  return an ? s.an : s.aus;
}

/**
 * Was „Tasten erkunden" nach diesem Tastendruck zeigt, sagt und ob es die
 * Taste schluckt. Rein und ohne DOM - so lässt sich jede Zeile prüfen.
 */
export function erkundeTaste(
  e: KeyEventLike,
  plattform: Plattform,
  optionen: ErkundenOptionen = {},
): ErkundenAusgabe {
  const layout = optionen.layout ?? "de";
  const altGr = optionen.altGr === true;
  // ★ EN1, erweitert E12: Nur die WÖRTER hängen an der Sprache - jede
  // Entscheidung unten (Kombination? Zeichen? schlucken?) bleibt für alle
  // drei Sprachen dieselbe.
  const en = optionen.sprache === "en";
  const fr = optionen.sprache === "fr";
  const es = optionen.sprache === "es";
  // ★ O-IT (02.10.2026): italienische Wörter (`tastenErklaerungIt.ts`).
  const it = optionen.sprache === "it";
  // ★ O-PL (02.10.2026): polnische Wörter (`tastenErklaerungPl.ts`).
  const pl = optionen.sprache === "pl";
  // ★ O-TR (02.10.2026): türkische Wörter (`tastenErklaerungTr.ts`).
  const tr = optionen.sprache === "tr";
  // ★ O-CS (03.10.2026): tschechische Wörter (`tastenErklaerungCs.ts`).
  const cs = optionen.sprache === "cs";
  // ★ G3c-VERTEILER (25.10.2026): eine Gerüst-Sprache aus ihrer Datei (vorher: die deutschen Wörter, Falle 30).
  const satz = geruestSatz(optionen.sprache ?? "de");
  const W = satz ? satz.erkundenWoerter : cs ? ERKUNDEN_WOERTER_CS : tr ? ERKUNDEN_WOERTER_TR : pl ? ERKUNDEN_WOERTER_PL : it ? ERKUNDEN_WOERTER_IT : en ? ERKUNDEN_WOERTER_EN : fr ? ERKUNDEN_WOERTER_FR : es ? ERKUNDEN_WOERTER_ES : null;

  // ★ Testerin 24.10.2026: „Bei ausgeschaltetem Nummernblock kommen die englischen
  // Tastennamen (Arrow Down usw.)". Ohne Num meldet der Ziffernblock `key`
  // ArrowDown, Home, Delete … mit `code` Numpad2, Numpad7, NumpadDecimal - kein
  // Wörterbuch kennt diese Paare, also kam der letzte Ausweg „Taste ArrowDown".
  // Dieselbe Taste wie die eigene Pfeil-, Pos1- oder Entf-Taste erklären.
  if (e.code?.startsWith("Numpad") && ZIFFERNBLOCK_OHNE_NUM.has(e.key)) {
    return erkundeTaste({ ...e, code: e.key }, plattform, optionen);
  }

  // 0. Tastenkombinationen: angesagt und geschluckt (Lernstoff).
  if (istKombination(e, plattform, altGr)) {
    const kombi = kombinationsName(e, plattform, layout, optionen.sprache);
    const was = wirkungenDerKombination(e, plattform, layout, optionen.sprache);
    const t: TastenErklaerung = {
      kurz: kombi,
      name: W ? W.kombination : "Tastenkombination",
      was: was.length ? was : [W ? W.kombiUnbekannt : "was sie tut, hängt vom Programm ab."],
    };
    return {
      gross: kombi.replace(/ \+ /g, "+"),
      zeile: zeileFuer(t),
      ansage: ansageFuer(t),
      schlucken: true,
      ...(!kuerzelKatalogGeladen() ? { katalogFehlt: true as const } : {}),
    };
  }

  // Der Weg über den dritten Layer, für Zeichen und Totasten: „ Mit AltGr + Q."
  const dritterLayer = altGr || (plattform === "macos" && e.altKey && !e.ctrlKey && !e.metaKey);
  const mit = dritterLayer
    ? ` ${W ? W.mit : "Mit"} ${[plattform === "macos" ? "Option" : ALTGR_WORT[optionen.sprache ?? "de"], ...(e.shiftKey ? [SHIFT_WORT[optionen.sprache ?? "de"]] : []), tastenAufdruck(e, plattform, layout, optionen.sprache)].join(" + ")}.`
    : "";

  // 1. Sondertasten, die das Wörterbuch kennt: immer schlucken (Tab!).
  const eintrag = tasteFuerEreignis(e, plattform);
  if (eintrag) {
    const t = satz
      ? satz.sondertaste(eintrag.id, plattform, layout)
      : cs
      ? sondertasteCs(eintrag.id, plattform, layout)
      : tr
      ? sondertasteTr(eintrag.id, plattform, layout)
      : pl
      ? sondertastePl(eintrag.id, plattform, layout)
      : it
      ? sondertasteIt(eintrag.id, plattform, layout)
      : en
      ? sondertasteEn(eintrag.id, plattform, layout)
      : fr
        ? sondertasteFr(eintrag.id, plattform, layout)
        : es
          ? sondertasteEs(eintrag.id, plattform, layout)
          : sondertaste(eintrag.id, plattform);
    // Englisch/Französisch steht gross das Zeichen der Taste (⇧, ⇥) - sonst
    // ihr eigener Kurzname statt der deutschen Aufschrift („Home" statt „Pos 1").
    const TASTE_KURZ = satz ? satz.tasteKurz : cs ? TASTE_KURZ_CS : tr ? TASTE_KURZ_TR : pl ? TASTE_KURZ_PL : it ? TASTE_KURZ_IT : en ? TASTE_KURZ_EN : fr ? TASTE_KURZ_FR : es ? TASTE_KURZ_ES : null;
    const gross = TASTE_KURZ
      ? (eintrag.zeichen ?? TASTE_KURZ[eintrag.id] ?? t?.name ?? eintrag.name)
      : (eintrag.zeichen ?? eintrag.aufdruck ?? eintrag.name);
    if (t) {
      // ★ Testerin 24.10.2026: „Capslock wird auch aktiviert". Abschalten kann die
      // Seite sie nicht (das macht das System), aber sagen, wie sie jetzt steht.
      const zustand =
        eintrag.id === "feststell" && optionen.feststellAn !== undefined
          ? feststellZustand(optionen.sprache ?? "de", optionen.feststellAn)
          : null;
      const tz = zustand ? { ...t, was: [...t.was, zustand] } : t;
      return { gross, zeile: zeileFuer(tz), ansage: ansageFuer(tz), schlucken: true };
    }
    // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne Satz hier. Der Wächter
    // in `tests/typing-tasten-erklaerung.test.ts` lässt das nicht zu.
    return { gross, zeile: eintrag.name, ansage: `${eintrag.name}.`, schlucken: true };
  }

  // 2. Zeichen: Buchstaben, Ziffern, Satz- und Sonderzeichen.
  if (e.key.length === 1) {
    const ch = e.key;
    const z = satz ? satz.zeichen[ch] : cs ? ZEICHEN_CS[ch] : tr ? ZEICHEN_TR[ch] : pl ? ZEICHEN_PL[ch] : it ? ZEICHEN_IT[ch] : en ? ZEICHEN_EN[ch] : fr ? ZEICHEN_FR[ch] : es ? ZEICHEN_ES[ch] : ZEICHEN[ch];
    const name = satz
      ? satz.zeichenName(ch)
      : cs
      ? zeichenNameCs(ch)
      : tr
      ? zeichenNameTr(ch)
      : pl
      ? zeichenNamePl(ch)
      : it
      ? zeichenNameIt(ch)
      : en
      ? zeichenNameEn(ch)
      : fr
        ? zeichenNameFr(ch)
        : es
          ? zeichenNameEs(ch)
          : (z?.name ?? spokenLabel(ch));
    // ★ Testerin 24.10.2026: die Tastmarke auf F, J und der 5 im Ziffernblock.
    const marke = tastmarke(e, optionen.sprache ?? "de");
    if (!z) {
      // Buchstabe oder Ziffer: „a" bleibt „a"; „ä" wird „ä - a Umlaut".
      const kopf = name === ch ? ch : `${ch} - ${name}`;
      const zeile = mit ? `${kopf} - ${mit.trim()}` : kopf;
      return {
        gross: ch,
        zeile: marke ? `${zeile} - ${marke}` : zeile,
        ansage: `${name}.${mit}${marke ? ` ${marke}` : ""}`,
        schlucken: true,
      };
    }
    const t: TastenErklaerung = { kurz: null, name, was: marke ? [...z.was, marke] : z.was };
    return {
      gross: ch,
      zeile: `${ch} - ${zeileFuer(t)}${mit}`,
      ansage: `${ansageFuer(t)}${mit}`,
      schlucken: true,
    };
  }

  // 3a. ★ 13.09.2026: eine Totaste, deren Akzent sicher bekannt ist - mit
  //     Zusatzbezeichnung, wie ein Zeichen: „^ - Zirkumflex - Akzent-Taste - …".
  //     Nicht geschluckt, wie jede Totaste bisher.
  const akzent = dritterLayer ? null : benannteTotaste(e, layout);
  if (akzent) {
    // ★ O2-TASTATUR (30.10.2026): Tilde und Tonos aus `AKZENTE_NEU`; der zweite Satz („erscheint erst mit dem nächsten Buchstaben")
    // ist der des Akuts derselben Sprache, das Wort „Akzent-Taste" dasselbe wie sonst.
    const akzentBau = (akzente: Readonly<Record<keyof typeof AKZENTE_EN, { name: string; was: readonly string[] }>>, name: string): TastenErklaerung => {
      if (!istNeuerAkzent(akzent.id)) return { kurz: akzente[akzent.id].name, name, was: akzente[akzent.id].was };
      const neu = AKZENTE_NEU[optionen.sprache ?? "de"][akzent.id];
      return { kurz: neu.name, name, was: [neu.was, ...akzente.akut.was.slice(1)] };
    };
    const t: TastenErklaerung = satz
      ? akzentBau(satz.akzente, satz.erkundenWoerter.akzentTaste)
      : cs
      ? akzentBau(AKZENTE_CS, ERKUNDEN_WOERTER_CS.akzentTaste)
      : tr
      ? akzentBau(AKZENTE_TR, ERKUNDEN_WOERTER_TR.akzentTaste)
      : pl
      ? akzentBau(AKZENTE_PL, ERKUNDEN_WOERTER_PL.akzentTaste)
      : it
      ? akzentBau(AKZENTE_IT, ERKUNDEN_WOERTER_IT.akzentTaste)
      : en
      ? akzentBau(AKZENTE_EN, ERKUNDEN_WOERTER_EN.akzentTaste)
      : fr
        ? akzentBau(AKZENTE_FR, ERKUNDEN_WOERTER_FR.akzentTaste)
        : es
          ? akzentBau(AKZENTE_ES, ERKUNDEN_WOERTER_ES.akzentTaste)
          : { kurz: akzent.name, name: "Akzent-Taste", was: akzent.was };
    return {
      gross: akzent.zeichen,
      zeile: `${akzent.zeichen} - ${zeileFuer(t)}`,
      ansage: ansageFuer(t),
      schlucken: false,
    };
  }

  // 3. Tasten ausserhalb des Wörterbuchs (F-Tasten, Num, Menü-Taste …):
  //    ansagen, aber dem Browser lassen.
  //    Ausnahme: die Sprungtasten, die das Wörterbuch nur für Windows führt.
  //    Sie werden auch am Mac geschluckt, sonst rollt die Seite davon.
  //    ★ 28.09.2026 (Johannes: „bau das mit den F-Tasten"): auch F1-F24
  //    AUSSER F5 werden geschluckt. Bis dahin sagte das Erkunden sie an und
  //    liess sie dann durch - F1 öffnete die Browser-Hilfe, F3 die Suche, F6
  //    sprang in die Adresszeile, F7 fragte nach dem Textcursor-Modus, F11
  //    schaltete auf Vollbild: das Kind war danach nicht mehr im Feld. Ob der
  //    Browser jede F-Taste abfangen lässt (F11, F12), misst der Windows-PC.
  //    ★ 27.10.2026 (Testerin 24.10.): auch F5 und die Menü-Taste - F5 lud neu
  //    und warf aus Tasten erkunden, die Menü-Taste öffnete das Kontextmenü.
  const t = satz
    ? satz.nachKey(e.key, plattform, layout)
    : cs
    ? nachKeyCs(e.key, plattform, layout)
    : tr
    ? nachKeyTr(e.key, plattform, layout)
    : pl
    ? nachKeyPl(e.key, plattform, layout)
    : it
    ? nachKeyIt(e.key, plattform, layout)
    : en
    ? nachKeyEn(e.key, plattform, layout)
    : fr
      ? nachKeyFr(e.key, plattform, layout)
      : es
        ? nachKeyEs(e.key, plattform, layout)
        : nachKey(e.key, plattform);
  if (t) {
    // Eine Totaste über den dritten Layer (Mac: Option + U = ¨) sagt den Weg dazu.
    const weg = e.key === "Dead" ? mit : "";
    // Die 5 im Ziffernblock ohne Num (`Clear`) trägt die Tastmarke auch.
    const marke = tastmarke(e, optionen.sprache ?? "de");
    const tm = marke ? { ...t, was: [...t.was, marke] } : t;
    return {
      gross: tm.kurz ?? tm.name,
      zeile: zeileFuer(tm) + weg,
      ansage: ansageFuer(tm) + weg,
      schlucken: SPRUNGTASTEN.has(e.key) || istFTasteOhneAusweg(e.key) || e.key === "ContextMenu",
    };
  }
  // 4. Keine Auskunft vom Browser: „Unidentified" oder gar leer (manche
  //    Sondertasten von Notebooks). Kein englisches Wort auf die Braillezeile,
  //    keine leere Zeile - ein Satz, der stimmt.
  if (!e.key || e.key === "Unidentified") {
    const satz = W ? W.unbekannt : "Diese Taste kann ich nicht erkennen.";
    return { gross: "?", zeile: satz, ansage: satz, schlucken: false };
  }
  const taste = W ? W.taste(e.key) : `Taste ${e.key}`;
  return { gross: e.key, zeile: taste, ansage: `${taste}.`, schlucken: false };
}

/** Für den Wächter und die Übersichtstabelle: alle Tasten mit Satz. */
export function alleSondertasten(plattform: Plattform): { taste: string; t: TastenErklaerung }[] {
  const ids = [
    "tabulator", "eingabe", "leertaste", "loeschtaste", "entf", "esc", "umschalt",
    "feststell", "pfeil-links", "pfeil-rechts", "pfeil-auf", "pfeil-ab",
    ...(plattform === "macos"
      ? ["befehlstaste", "wahltaste", "ctrl", "fn"]
      : ["pos1", "ende", "bild-auf", "bild-ab", "einfg", "strg", "alt", "altgr", "windows-taste"]),
  ];
  const liste = ids.map((id) => ({ taste: id, t: sondertaste(id, plattform)! }));
  const keys = [
    ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
    "NumLock", "ContextMenu", "PrintScreen", "ScrollLock", "Pause",
    "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute", "Dead",
  ];
  for (const k of keys) liste.push({ taste: k, t: nachKey(k, plattform)! });
  return liste;
}

/**
 * Der Name eines Zeichens, genau wie „Tasten erkunden" ihn sagt („Punkt",
 * „Fragezeichen", englisch „full stop", französisch „point"). ★ 25.09.2026
 * für „Tasten finden", seit dort auch Zeichen gesucht werden (`findenRunde.ts`).
 * ★ E12 (26.09.2026): eine Tabelle statt einer weiteren Ternäre - „fr" bekam
 * hier sonst still den deutschen Namen (Weichen-Zähler, Bauplan §2.3 Punkt 3).
 */
const ZEICHEN_NAME_FUNKTION: Readonly<Record<BedienSprache, (ch: string) => string>> = {
  de: (ch) => ZEICHEN[ch]?.name ?? spokenLabel(ch),
  en: zeichenNameEn,
  fr: zeichenNameFr,
  es: zeichenNameEs,
  it: zeichenNameIt,
  pl: zeichenNamePl, // ★ O-PL (02.10.2026)
  tr: zeichenNameTr, // ★ O-TR (02.10.2026)
  cs: zeichenNameCs, // ★ O-CS (03.10.2026)
  bg: TASTEN_SATZ_BG.zeichenName,
  el: TASTEN_SATZ_EL.zeichenName,
  hu: TASTEN_SATZ_HU.zeichenName,
  nl: TASTEN_SATZ_NL.zeichenName,
  pt: TASTEN_SATZ_PT.zeichenName,
  br: TASTEN_SATZ_BR.zeichenName,
  ro: TASTEN_SATZ_RO.zeichenName,
  sv: TASTEN_SATZ_SV.zeichenName,
  uk: TASTEN_SATZ_UK.zeichenName,
};

export function zeichenName(ch: string, sprache: BedienSprache = "de"): string {
  return ZEICHEN_NAME_FUNKTION[sprache](ch);
}

/** Für den Wächter und die Übersichtstabelle: alle Zeichen mit Satz. */
export function alleZeichen(): string[] {
  return Object.keys(ZEICHEN);
}
