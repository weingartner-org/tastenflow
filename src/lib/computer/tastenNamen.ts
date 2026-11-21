/**
 * im Griff - das Tasten-Wörterbuch (Etappe T1, Bauplan „Tasten-Lektion" §1/§4.2).
 *
 * Johannes, 06.08.2026: „eine Lektion … bei der man die Tasten lernt die man
 * dann benötigt: Tab, Feststell, Umschalt, Löschtaste, FN,…" und „ein
 * exploriermodus [in dem] man einfach herumdrücken kann und der tastenname wird
 * angesagt."
 *
 * Diese Datei ist die EINE Quelle für die Frage „welche Taste ist das?". Sie ist
 * rein und ohne React - genau wie `chord.ts`, und aus demselben Grund: Was ein
 * Kind ohne Sicht als Namen zu hören bekommt, muss sich prüfen lassen, ohne ein
 * DOM zu bauen.
 *
 * ── ★★ Warum die LAGE das wichtigste Feld ist ───────────────────────────────
 *
 * Ein sehendes Kind sucht eine Taste, indem es hinschaut. Ein blindes Kind kann
 * das nicht - es kann nur ABZÄHLEN. Darum trägt jeder Eintrag `lage`, und zwar
 * als Weg, den eine Hand gehen kann („linke Kante, eine Reihe über der
 * Feststelltaste"), nie als Bild („oben links"). Dieselbe Einsicht hat am
 * 06.08. schon die Mac-Sondertasten-Karte umgebaut (`dataMac.ts`,
 * `mac.grundlagen.vier-sondertasten`): abzählen statt suchen.
 *
 * Belegt sind die Angaben aus zwei Quellen, nicht geraten:
 *  · **Die Reihen-Kanten** aus `src/lib/typing/layouts.ts` - dort steht für
 *    jede Reihe, welche Zusatztaste links und rechts sitzt (`⌫` an der
 *    Zahlenreihe, `⇥` an der oberen, `⇪` an der Grundreihe, `⇧` an der
 *    unteren). Das ist derselbe Datensatz, aus dem der Tastenflow seine
 *    Tastatur zeichnet; es gibt keine zweite Wahrheit über die Tastenlage.
 *  · **Die Mac-Reihe links unten** aus Johannes' Angabe vom 06.08. (seit 2016
 *    fn · control · option · command), gegengeprüft am Produktbild der
 *    deutschen Magic Keyboard auf apple.com/de.
 *
 * ── ★★ §0.3, PRÄZISIERT am 07.08.2026 ──────────────────────────────────────
 *
 * Johannes: „es ist gut wenn die Schüler die Englischen namen dazu lernen, sie
 * können in Klammer stehen und beim lernen der tasten gerne auch genannt
 * werden. Sie sollen damit vertraut werden."
 *
 * ⇒ Der englische Name wird **mitgelehrt**, nicht versteckt. Er steht in
 * `englisch` und der Explorier-Modus sagt ihn an („Auf Englisch heißt sie
 * Backspace.").
 *
 * §0.3 gilt weiter, aber in seiner eigentlichen Bedeutung: Der englische Name
 * ist nie der HAUPTname (`name`) und steht nie allein. Der Zweck der Regel war
 * nie, Englisch zu verstecken - sondern zu verhindern, dass ein Kind ein Wort
 * als EINZIGEN Namen lernt, das es an seiner Tastatur nicht wiederfindet.
 * Daneben gestellt ist es das Gegenteil eines Problems: Ein Kind, das später
 * eine englische Anleitung liest oder eine Lehrkraft „Shift" sagen hört, ist
 * dann vorbereitet.
 *
 * ── ★★★ §0.3, NEU PRÄZISIERT am 13.09.2026 - `kurz` darf VORNE stehen ──────
 *
 * Johannes: „beides zuerst die kurzfassung und dann die lange" - und auf
 * Rückfrage ausdrücklich bestätigt: „Ja, immer kurz dann lang", auch wenn die
 * Kurzfassung englisch ist: „Finde Shift, die Umschalttaste." / „Finde Esc,
 * die Escape-Taste."
 *
 * Das ist KEIN Widerspruch zu §0.3 oben: Der HAUPTname (`name`) bleibt der
 * deutsche Langname, und nur er wird in `auchGenannt`/§0.3-Sinne „gelehrt".
 * `kurz` ist keine zweite Version des Namens, sondern die Kurzform, an der ein
 * Kind die Taste auf einer Anleitung, einer Tastatur-Beschriftung oder bei
 * einer Lehrkraft wiedererkennt - genau das, wofür §0.3 den englischen Namen
 * ursprünglich vorgesehen hat. Reihenfolge in der ANSAGE: erst `kurz` (wenn
 * vorhanden), dann `name` mit Artikel - nie umgekehrt, und nie `kurz` allein.
 *
 * `auchGenannt` ist davon getrennt: Dort stehen andere DEUTSCHE Schreibweisen
 * (Apples „Rückschritttaste", Microsofts „Rücktaste"). Die werden NICHT
 * angesagt - sonst lernte ein Kind zwei deutsche Namen als gleichwertig, wo wir
 * uns für einen entschieden haben.
 *
 * ── ★★ Die Löschtaste ──────────────────────────────────────────────────────
 *
 * Johannes, 07.08.: „die ‚Rückschritttaste‘ nenne ich immer löschtaste".
 * Nachrecherchiert auf Apples deutschen Seiten - und Apple ist sich selbst
 * uneinig:
 *  · macOS-Benutzerhandbuch, „Bedeutung der Symbole in Menüs auf dem Mac"
 *    (support.apple.com/de-de/guide/mac-help/cpmh0011/mac) nennt ⌫ **„Löschen"**
 *    und ⌦ **„Entfernen (vorwärts)"**. Das ist Apples kanonische Symboltabelle.
 *  · Der Support-Artikel „Mac-Shortcuts" (support.apple.com/de-de/102650) nennt
 *    ⌫ in seiner Legende **„Entfernen-Taste"**, im Fließtext derselben Seite
 *    aber durchgehend **„Rückschritttaste"** (z. B. „Befehlstaste-
 *    Rückschritttaste: Das markierte Objekt in den Papierkorb verschieben").
 *  · Auf der Taste selbst steht **gar kein Wort** - nur das Zeichen ⌫
 *    (Produktbild der deutschen Magic Keyboard, apple.com/de).
 *
 * Drei Apple-Namen für eine Taste. Wenn die Quelle uneinig ist, entscheidet das
 * Kind: Gelehrt wird **„Löschtaste"** - es ist der Name, den Johannes im
 * Unterricht benutzt, und er liegt am nächsten an Apples eigener Symboltabelle
 * („Löschen"). Die anderen stehen in `auchGenannt`.
 *
 * ⚠️ Die Verwechslungsgefahr, die dieser Name mitbringt, ist bekannt und wird
 * ausdrücklich unterrichtet statt umgangen: Es gibt ZWEI Tasten, die löschen.
 * Die Löschtaste löscht nach LINKS, die Entf-Taste nach RECHTS. Genau das
 * trennen die Lektionstexte in jedem Satz, in dem sie vorkommen.
 */
import type { KeyEventLike } from "./chord";
import type { Plattform } from "./model";

/** Ein Eintrag des Wörterbuchs - alles, was die App über eine Taste sagen kann. */
export interface TastenName {
  /** Stabile Kennung, z. B. "loeschtaste". EINGEFROREN - die Lektionen zeigen darauf. */
  id: string;
  /** Der gelehrte deutsche Name. Genau das sagt der Explorier-Modus an. */
  name: string;
  /**
   * ★★★ Die Kurzfassung (13.09.2026, Johannes: „immer kurz dann lang") - so,
   * wie die Taste auf einer Beschriftung oder in einer Anleitung steht oder
   * wie eine Lehrkraft sie nennt: „Tab", „Strg", „Shift", „Esc". `null`, wenn
   * es keine eigene gibt oder sie nur den Namen wiederholen würde
   * („Ende" - „Ende-Taste" bliebe sonst „Ende, die Ende-Taste").
   *
   * Steht in der Ansage IMMER vor `name`, auch wenn sie englisch ist - das ist
   * kein Widerspruch zu §0.3, siehe oben: Der Hauptname bleibt der deutsche
   * Langname, `kurz` ist nur die Wiedererkennung.
   *
   * ★ EINE Quelle mit `erklaerungFuerId()` aus `lib/typing/tastenErklaerung.ts`
   * (Tastenflow): Für jede Kennung, die beide Dateien kennen, müssen `kurz` und
   * `name` übereinstimmen - der Wächter dafür steht in
   * `tests/computer-tastennamen-eine-quelle.test.ts`.
   */
  kurz: string | null;
  /**
   * Was auf der Taste STEHT - oder `null`, wenn dort nur ein Zeichen ohne Wort
   * steht. `null` ist eine Auskunft, keine Lücke: „Auf ihr steht kein Wort"
   * erspart einem Kind das Suchen nach einer Beschriftung, die es nicht gibt.
   */
  aufdruck: string | null;
  /** Das Zeichen auf der Taste (⇧ ⇪ ⇥ ⌫ ⏎ ⌘ ⌥ ⌃) oder `null`. */
  zeichen: string | null;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Was sie tut, in einem Satz. */
  aufgabe: string;
  /**
   * ★★ Der ENGLISCHE Name. Johannes, 07.08.: „es ist gut wenn die Schüler die
   * Englischen namen dazu lernen, sie können in Klammer stehen und beim lernen
   * der tasten gerne auch genannt werden. Sie sollen damit vertraut werden."
   *
   * Er wird also GELEHRT, nicht nur geduldet - der Explorier-Modus sagt ihn mit
   * an. §0.3 bleibt trotzdem gültig: Der englische Name ist nie der HAUPTname,
   * sondern steht daneben („Löschtaste, englisch Backspace"). Der Zweck der
   * Regel war nie, Englisch zu verstecken, sondern zu verhindern, dass ein Kind
   * ein Wort als EINZIGEN Namen lernt, das es an seiner Tastatur nicht findet.
   */
  englisch?: readonly string[];
  /**
   * Andere DEUTSCHE Schreibweisen, die einem Kind begegnen können (Apples
   * abweichende Namen, Microsofts Wort). Nur zum EINORDNEN, nie als Ansage -
   * sonst lernt ein Kind zwei Namen als gleichwertig, wo wir uns für einen
   * entschieden haben.
   */
  auchGenannt?: readonly string[];
  /**
   * Lässt sie sich im Explorier-Modus finden? `false` heißt: Die Taste erzeugt
   * kein Tastatur-Ereignis, das der Browser sieht. Dann wird sie ERKLÄRT statt
   * gesucht - ein Kind suchen zu lassen, was es nie finden kann, ist die
   * grausamste Form von Fehl-Lehre.
   */
  suchbar: boolean;
  /** Wenn `suchbar: false`: warum nicht. Wird dem Kind wörtlich gesagt. */
  warumNichtSuchbar?: string;
  /** Zusatz-Warnung nach dem Drücken (heute nur die Feststelltaste). */
  achtung?: string;
}

/* ══ Die geteilten Tasten ═══════════════════════════════════════════════════
 *
 * Tab, Umschalt, Feststell, Esc, Leertaste und die Pfeile heißen auf beiden
 * Plattformen gleich und liegen an derselben Stelle. Sie stehen darum EINMAL
 * hier und werden in beide Listen gehängt - kein Kopieren, keine zwei
 * Wahrheiten. Was sich unterscheidet (Löschtaste, Zeilenschalter/Eingabetaste,
 * die Sondertasten), steht je Plattform.
 * ═══════════════════════════════════════════════════════════════════════════ */

const TABULATOR: TastenName = {
  id: "tabulator",
  name: "Tabulatortaste",
  kurz: "Tab",
  aufdruck: null,
  zeichen: "⇥",
  lage: "Linker kleiner Finger: eine Reihe hoch, ganz an den Rand.",
  aufgabe:
    "Sie springt zum nächsten Bedienelement - von Feld zu Feld, von Knopf zu Knopf. " +
    "Mit der Umschalttaste dazu springt sie rückwärts.",
  englisch: ["Tab"],
  auchGenannt: ["Tabtaste"],
  suchbar: true,
};

const UMSCHALT: TastenName = {
  id: "umschalt",
  name: "Umschalttaste",
  kurz: "Shift",
  aufdruck: null,
  zeichen: "⇧",
  lage: "Zweimal: links und rechts in der untersten Buchstabenreihe.",
  aufgabe:
    "Gehalten schreibt sie groß. Sie verändert andere Tasten, sie tut allein nichts.",
  englisch: ["Shift"],
  suchbar: true,
};

const FESTSTELL: TastenName = {
  id: "feststell",
  name: "Feststelltaste",
  kurz: "Caps Lock",
  aufdruck: null,
  zeichen: "⇪",
  lage: "Linker kleiner Finger: einen Schritt nach links.",
  aufgabe:
    "Sie rastet ein und schreibt ab dann alles groß, bis du sie noch einmal drückst. " +
    "Sie ist ein Schalter, kein Halten.",
  englisch: ["Caps Lock"],
  suchbar: true,
  /**
   * ★ 23.09.2026: Die alte Fassung „bleibt an, drück sie noch einmal" stimmt
   * nach dem ZWEITEN Druck unter Windows nicht mehr - dann ist sie wieder aus.
   * Die neue Frage passt in jedem Fall: Steht sie noch an, hilft der Hinweis;
   * ist sie schon wieder aus, verneint das Kind die Frage einfach für sich.
   */
  achtung: "Schreibt jetzt alles groß? Dann drück sie noch einmal.",
};

const ESC: TastenName = {
  id: "esc",
  name: "Escape-Taste",
  kurz: "Esc",
  aufdruck: "esc",
  zeichen: "⎋",
  lage: "Ganz links oben in der Ecke.",
  aufgabe: "Sie bricht ab: schließt Menüs und Fenster, ohne etwas zu ändern.",
  englisch: ["Escape"],
  auchGenannt: ["Fluchttaste"],
  suchbar: true,
};

const LEERTASTE: TastenName = {
  id: "leertaste",
  name: "Leertaste",
  kurz: null,
  aufdruck: null,
  zeichen: null,
  lage: "Die lange Taste unter deinen Daumen.",
  aufgabe: "Sie macht den Abstand zwischen zwei Wörtern.",
  suchbar: true,
};

/**
 * ★★★ Umbenannt am 13.09.2026, Johannes' Entscheidung auf Rückfrage: Die
 * Pfeile heißen in beiden Programmteilen „Pfeil nach links" (entsprechend
 * rechts/oben/unten), nicht „Linkspfeil" - Befund der Tastenflow-Sitzung war
 * „Finde die Linkspfeil", was zeigte, dass der alte Name auch grammatisch
 * unbequem ist. `istMaennlicherTastenname()` erkennt die neue Form am
 * Präfix „Pfeil nach ".
 */
const PFEILE: readonly TastenName[] = [
  {
    id: "pfeil-links",
    name: "Pfeil nach links",
    kurz: null,
    aufdruck: null,
    zeichen: "◀",
    lage: "Rechts unten bei den Pfeilen, der linke.",
    aufgabe: "Er bewegt die Schreibmarke ein Zeichen nach links.",
    suchbar: true,
  },
  {
    id: "pfeil-rechts",
    name: "Pfeil nach rechts",
    kurz: null,
    aufdruck: null,
    zeichen: "▶",
    lage: "Rechts unten bei den Pfeilen, der rechte.",
    aufgabe: "Er bewegt die Schreibmarke ein Zeichen nach rechts.",
    suchbar: true,
  },
  {
    id: "pfeil-auf",
    name: "Pfeil nach oben",
    kurz: null,
    aufdruck: null,
    zeichen: "▲",
    lage: "Rechts unten bei den Pfeilen, der obere.",
    aufgabe: "Er bewegt die Schreibmarke eine Zeile nach oben.",
    suchbar: true,
  },
  {
    id: "pfeil-ab",
    name: "Pfeil nach unten",
    kurz: null,
    aufdruck: null,
    zeichen: "▼",
    lage: "Rechts unten bei den Pfeilen, unter dem Pfeil nach oben.",
    aufgabe: "Er bewegt die Schreibmarke eine Zeile nach unten.",
    suchbar: true,
  },
];

/* ══ Windows ════════════════════════════════════════════════════════════════ */

const WINDOWS_EIGEN: readonly TastenName[] = [
  {
    /**
     * ★ Der Name, um den es Johannes ging. Microsoft schreibt in seinen
     * deutschen Anleitungen „Rücktaste"; auf der Taste steht auf deutschen
     * Windows-Tastaturen nur ein Pfeil nach links (`layouts.ts`, Zeichen ⌫ an
     * der rechten Kante der Zahlenreihe). Gelehrt wird „Löschtaste" - derselbe
     * Name wie am Mac, damit ein Kind beim Rechnerwechsel nicht umlernen muss.
     */
    id: "loeschtaste",
    name: "Löschtaste",
    kurz: "Backspace",
    aufdruck: null,
    zeichen: "⌫",
    lage: "Rechte Hand ganz an den Rand, zwei Reihen hoch.",
    aufgabe:
      "Sie löscht nach LINKS - das Zeichen VOR der Schreibmarke, also das, was du " +
      "zuletzt getippt hast.",
    englisch: ["Backspace"],
    auchGenannt: ["Rücktaste"],
    suchbar: true,
  },
  {
    id: "entf",
    name: "Entfernen-Taste",
    kurz: "Entf",
    aufdruck: "Entf",
    zeichen: null,
    lage: "Im Sechserblock über den Pfeilen, unten links. Am Notebook oben rechts.",
    aufgabe:
      "Sie löscht nach RECHTS - das Zeichen HINTER der Schreibmarke. Das ist der " +
      "Unterschied zur Löschtaste.",
    englisch: ["Delete"],
    auchGenannt: ["Entfernen"],
    suchbar: true,
  },
  {
    id: "eingabe",
    name: "Eingabetaste",
    kurz: "Enter",
    aufdruck: null,
    zeichen: "↵",
    lage: "Rechte Hand ganz an den Rand: die große Taste.",
    aufgabe: "Sie bestätigt und beginnt eine neue Zeile.",
    englisch: ["Enter", "Return"],
    auchGenannt: ["Zeilenschalter"],
    suchbar: true,
  },
  /* ── ★★ X-LS1 (10.08.2026): der Sechserblock ────────────────────────────────
   *
   * Vier Tasten, die das Wörterbuch bis heute nicht kannte - obwohl die App sie
   * seit Phase P9 LEHRT: `excel.blattwechsel` nennt **Strg+Bild-auf/ab**,
   * `excel.datenblock-kanten` und `word.navigieren-wortweise` nennen **Pos1**
   * und **Ende**, und die Anleitung der Excel-Brücke nennt Strg+Pos1. Ein Kind,
   * dem eine Anleitung „Strg und Bild-ab" sagt, konnte hier bis heute nicht
   * nachschlagen, WO diese Taste liegt - genau die Auskunft, für die das
   * Wörterbuch da ist. Gefunden hat die Lücke die Blätter-Prüfung P1a.
   *
   * ⚠️ Ein Kommentar in `tests/computer-haus-baum.test.tsx` sagte bis heute,
   * das Wörterbuch führe „Pos1" und „Ende" bewusst nicht, weil es „die großen
   * Sondertasten beschreibt, nicht den Ziffernblock". Beides stimmt so nicht:
   * Diese vier Tasten liegen NICHT im Ziffernblock, sondern im Sechserblock
   * zwischen Buchstabenfeld und Ziffernblock - und sie sind Lehrstoff.
   *
   * ── Nur Windows, und das ist keine Nachlässigkeit ─────────────────────────
   *
   * Mac-Tastaturen ohne Ziffernblock haben diese vier Tasten schlicht nicht;
   * dort tritt fn mit einer Pfeiltaste an ihre Stelle. Genau das lehrt
   * `mac.grundlagen.vier-sondertasten` bereits ausführlich. Ein Mac-Eintrag
   * würde also entweder eine Taste behaupten, die das Kind nicht hat, oder den
   * bestehenden Lernschritt doppeln.
   *
   * ── Aufdruck: Wort und Zeichen getrennt ───────────────────────────────────
   *
   * Auf deutschen Tastaturen steht auf den Bild-Tasten das Wort „Bild" und
   * daneben ein Pfeil. Der Pfeil steht darum in `zeichen` und nicht im
   * `aufdruck`: Eine Ansage, die den Aufdruck wörtlich vorliest, würde sonst
   * „Auf ihr steht Bild Pfeil nach oben" sagen - je nach Sprachausgabe ein
   * Rätsel. Was den Unterschied zwischen den beiden ausmacht, sagt statt
   * dessen die Lage.
   * ═════════════════════════════════════════════════════════════════════════ */
  {
    /**
     * ★ X-LS1. `aufgabe` bleibt bewusst bei „Zeile": In Excel springt Pos1 in
     * die erste Spalte der aktuellen Zeile, in einem Text an den Zeilenanfang -
     * derselbe Satz stimmt für beides. Was Strg+Pos1 tut, steht in den
     * Lernschritten (`excel.datenblock-kanten`, `word.navigieren-wortweise`)
     * und ausdrücklich NICHT hier: Bei fixierten Fensterausschnitten landet es
     * nicht in A1, und diese Ausnahme gehört zu ihrem Lernschritt, nicht ins
     * Wörterbuch.
     */
    id: "pos1",
    name: "Position-1-Taste",
    kurz: "Pos1",
    aufdruck: "Pos 1",
    zeichen: null,
    lage: "Im Sechserblock über den Pfeilen, oben in der Mitte. Am Notebook oft mit fn.",
    aufgabe:
      "Sie springt an den Anfang der Zeile, in der du gerade stehst.",
    englisch: ["Home"],
    // ★ 13.09.2026: „Pos1" stand hier als `auchGenannt` - jetzt überflüssig,
    // seit `kurz: "Pos1"` genau das schon in der Ansage sagt.
    suchbar: true,
  },
  {
    /**
     * ★ X-LS1. ⚠️ **Bewusst NICHT behauptet:** was die Ende-Taste ALLEIN in
     * Excel tut. Sie springt dort nicht ans Zeilenende, sondern schaltet den
     * Ende-Modus ein, in dem erst die nächste Pfeiltaste springt. Die App lehrt
     * diesen Modus nirgends, also steht er auch hier nicht - der Satz redet
     * darum nur vom Text. Was Strg+Ende tut, steht in `excel.datenblock-kanten`.
     */
    id: "ende",
    name: "Ende-Taste",
    kurz: null,
    aufdruck: "Ende",
    zeichen: null,
    lage: "Im Sechserblock über den Pfeilen, unten in der Mitte. Am Notebook oft mit fn.",
    aufgabe:
      "Sie springt in einem Text ans Ende der Zeile, in der du gerade stehst.",
    englisch: ["End"],
    suchbar: true,
  },
  {
    /**
     * ★★ Q3-Einfg (14.08.2026) - die SECHSTE Taste des Sechserblocks und die
     * letzte, die dem Wörterbuch gefehlt hat. X-LS1 hat sie namentlich offen
     * gelassen („Sie gehört zur Screenreader-Charge, nicht zu Excel") - hier
     * ist sie.
     *
     * Sie ist keine Nebensache: Für ein Kind mit NVDA oder JAWS ist sie DIE
     * Taste. Die App lehrt das seit IG-E6 (`bedienungshilfen.sr-taste`) und
     * nennt sie in `excel.spaltenkopf` sogar in einem Kürzel
     * (Einf+Alt+Strg+C) - nachschlagen, WO sie liegt, konnte ein Kind bis
     * heute nirgends. Genau dafür ist das Wörterbuch da.
     *
     * ── ★★ Warum `suchbar: false` ───────────────────────────────────────────
     *
     * Anders als bei der fn-Taste liegt es hier nicht am Browser: Die
     * Einfg-Taste erzeugt sehr wohl ein Tastatur-Ereignis. Es liegt am
     * Screenreader. Läuft NVDA oder JAWS, gehört ihm diese Taste - ob sein
     * Kind sie danach überhaupt noch an die Seite weiterreicht, hängt an
     * seinen Einstellungen und ist NICHT gemessen (→ Messpunkt M25). Ein
     * Suchauftrag wäre damit ein Versprechen, das die App nicht halten kann,
     * und zwar ausgerechnet gegenüber den Kindern, für die diese Taste zählt.
     * Also wird sie ERKLÄRT statt gesucht - dieselbe Entscheidung wie bei fn,
     * aus einem anderen Grund.
     *
     * ★ Trotzdem steht sie in `CODE_ZU_ID_WINDOWS`: Kommt der Tastendruck an
     * (Kind ohne Screenreader, oder Vorleser reicht durch), nennt der freie
     * Explorier-Modus ihren Namen, statt „diese Taste kenne ich hier nicht" zu
     * sagen. Nicht suchen lassen und trotzdem erkennen ist beides zugleich
     * möglich - der Suchauftrag liest `suchbareTasten()`, das Erkennen nicht.
     *
     * ⚠️ **Bewusst NICHT behauptet:** was die Einfg-Taste OHNE Vorleser tut.
     * Sie schaltet dort zwischen Einfügen und Überschreiben um; diesen Modus
     * lehrt die App nirgends, also steht er auch hier nicht - dieselbe Regel
     * wie bei der Ende-Taste und dem Ende-Modus in Excel.
     */
    id: "einfg",
    name: "Einfügen-Taste",
    kurz: "Einfg",
    aufdruck: "Einfg",
    zeichen: null,
    lage: "Im Sechserblock über den Pfeilen, oben links, über der Entf-Taste. Am Notebook fehlt sie oft.",
    aufgabe:
      "Läuft NVDA oder JAWS, ist sie die Screenreader-Taste: Fast jeder Befehl " +
      "deines Vorlesers beginnt mit ihr.",
    englisch: ["Insert"],
    auchGenannt: ["Einf"],
    suchbar: false,
    warumNichtSuchbar:
      "Die Einfg-Taste lässt dich diese App nicht suchen, und der Grund liegt nicht " +
      "an der Taste: Läuft NVDA oder JAWS, gehört sie deinem Vorleser. Ob dein Druck " +
      "danach überhaupt noch bei dieser Seite ankommt, entscheidet er und nicht diese " +
      "App. Suchen lassen wir dich nur, was sicher ankommt, darum wird sie hier " +
      "erklärt: obere Reihe des Sechserblocks, ganz links, direkt über der Entf-Taste.",
    achtung:
      "Achtung: Dass sie hier angekommen ist, heißt nicht, dass sie es überall tut. " +
      "Läuft dein Vorleser mit, nimmt er sich diese Taste normalerweise für seine " +
      "eigenen Befehle.",
  },
  {
    /** ★ X-LS1 - die Taste aus `excel.blattwechsel` (Strg+Bild-auf/ab). */
    id: "bild-auf",
    name: "Bild-auf-Taste",
    kurz: null,
    aufdruck: "Bild",
    zeichen: "↑",
    lage: "Im Sechserblock über den Pfeilen, oben rechts. Am Notebook oft mit fn.",
    aufgabe:
      "Sie blättert eine Bildschirmseite nach oben - nicht eine Zeile, sondern so viel, " +
      "wie auf einmal Platz hat.",
    englisch: ["Page Up", "PgUp"],
    auchGenannt: ["Bild nach oben"],
    suchbar: true,
  },
  {
    /** ★ X-LS1 - die Gegenrichtung, siehe Bild-auf-Taste. */
    id: "bild-ab",
    name: "Bild-ab-Taste",
    kurz: null,
    aufdruck: "Bild",
    zeichen: "↓",
    lage: "Im Sechserblock über den Pfeilen, unten rechts. Am Notebook oft mit fn.",
    aufgabe:
      "Sie blättert eine Bildschirmseite nach unten - nicht eine Zeile, sondern so viel, " +
      "wie auf einmal Platz hat.",
    englisch: ["Page Down", "PgDn"],
    auchGenannt: ["Bild nach unten"],
    suchbar: true,
  },
  {
    id: "strg",
    name: "Steuerungstaste",
    kurz: "Strg",
    aufdruck: "Strg",
    zeichen: null,
    lage: "Ganz links unten in der Ecke.",
    aufgabe:
      "Sie ist die Kürzel-Taste: gehalten macht sie aus C das Kopieren und aus V das " +
      "Einfügen. Allein tut sie nichts.",
    englisch: ["Control", "Ctrl"],
    auchGenannt: ["Steuerung"],
    suchbar: true,
  },
  {
    id: "alt",
    name: "Alt-Taste",
    kurz: null,
    aufdruck: "Alt",
    zeichen: null,
    lage: "Unten, links neben der Leertaste.",
    aufgabe: "Sie öffnet die Menüs eines Programms und gehört zu vielen Kürzeln dazu.",
    suchbar: true,
  },
  {
    /**
     * ⚠️ AltGr meldet sich im Browser als Strg+Alt gleichzeitig - das ist keine
     * Eigenart dieser App, sondern wie Windows die Taste an Programme
     * weitergibt. Erkannt wird sie darum über `e.code === "AltRight"`, nicht
     * über die Modifier-Flags.
     */
    id: "altgr",
    name: "AltGr-Taste",
    kurz: null,
    aufdruck: "Alt Gr",
    zeichen: null,
    lage: "Unten, rechts neben der Leertaste.",
    aufgabe:
      "Sie holt das dritte Zeichen einer Taste: das @ auf AltGr und Q, das € auf " +
      "AltGr und E.",
    suchbar: true,
  },
  {
    id: "windows-taste",
    name: "Windows-Taste",
    kurz: "Win",
    aufdruck: null,
    zeichen: "⊞",
    lage: "Unten links, zwischen Strg und Alt.",
    aufgabe: "Sie öffnet das Startmenü und gehört zu den Kürzeln des Betriebssystems.",
    suchbar: true,
  },
];

/* ══ Mac ════════════════════════════════════════════════════════════════════ */

const MAC_EIGEN: readonly TastenName[] = [
  {
    /**
     * ★★ Siehe Kopf: Apple nennt diese Taste an drei Stellen drei Mal anders.
     * Gelehrt wird „Löschtaste" (Johannes, 07.08.) - und damit unter Windows
     * und am Mac dasselbe Wort.
     */
    id: "loeschtaste",
    name: "Löschtaste",
    kurz: "Backspace",
    aufdruck: null,
    zeichen: "⌫",
    lage: "Rechte Hand ganz an den Rand, zwei Reihen hoch.",
    aufgabe:
      "Sie löscht nach LINKS - das Zeichen VOR der Schreibmarke, also das, was du " +
      "zuletzt getippt hast.",
    englisch: ["Backspace"],
    auchGenannt: ["Rückschritttaste", "Entfernen-Taste", "Löschen"],
    suchbar: true,
  },
  {
    /**
     * ⚠️ Am Mac hat nicht jede Tastatur diese Taste. Auf der kleinen Magic
     * Keyboard (Produktbild apple.com/de) gibt es sie nicht - dort macht
     * fn + Löschtaste dasselbe. Genau das sagt die Lage-Angabe, statt ein Kind
     * eine Taste suchen zu lassen, die seine Tastatur nicht hat.
     */
    id: "entf",
    name: "Entfernen-Taste",
    kurz: null,
    aufdruck: null,
    zeichen: "⌦",
    lage: "Nur auf großen Tastaturen, rechts neben dem Zeilenschalter. Sonst fn und Löschtaste.",
    aufgabe:
      "Sie löscht nach RECHTS - das Zeichen HINTER der Schreibmarke. Das ist der " +
      "Unterschied zur Löschtaste.",
    englisch: ["Delete"],
    auchGenannt: ["Entfernen (vorwärts)"],
    suchbar: true,
  },
  {
    id: "zeilenschalter",
    name: "Zeilenschalter",
    kurz: "Return",
    aufdruck: null,
    zeichen: "↩",
    lage: "Rechte Hand ganz an den Rand: die große Taste.",
    aufgabe:
      "Er bestätigt und beginnt eine neue Zeile. Im Finder ist er die Ausnahme: dort " +
      "benennt er um, statt zu öffnen.",
    englisch: ["Return", "Enter"],
    auchGenannt: ["Eingabetaste"],
    suchbar: true,
  },
  {
    /**
     * ★★ Die Reihe links unten ist der Kern der ganzen Mac-Karte (06.08.):
     * fn · control · option · command, von außen nach innen. Für ein Kind ohne
     * Sicht ist das die brauchbarste Auskunft überhaupt - abzählen statt suchen.
     */
    id: "befehlstaste",
    name: "Befehlstaste",
    kurz: "cmd",
    aufdruck: "command",
    zeichen: "⌘",
    lage: "Links unten, direkt neben der Leertaste.",
    aufgabe:
      "Sie ist die Kürzel-Taste am Mac: gehalten macht sie aus C das Kopieren. Sie " +
      "übernimmt die Aufgabe, die unter Windows die Strg-Taste hat.",
    englisch: ["Command", "Cmd"],
    suchbar: true,
  },
  {
    id: "wahltaste",
    name: "Wahltaste",
    kurz: "Option",
    aufdruck: "option",
    zeichen: "⌥",
    lage: "Links unten, die dritte Taste von außen.",
    aufgabe: "Sie holt die Sonderzeichen: das @ auf Wahl und L.",
    englisch: ["Option", "Alt"],
    suchbar: true,
  },
  {
    id: "ctrl",
    name: "Control-Taste",
    kurz: "ctrl",
    aufdruck: "control",
    zeichen: "⌃",
    lage: "Links unten, die zweite Taste von außen.",
    aufgabe:
      "Sie ist am Mac eine eigene Taste mit eigenen Aufgaben - NICHT der Ersatz für " +
      "Strg. Das macht die Befehlstaste.",
    englisch: ["Control", "Ctrl"],
    suchbar: true,
  },
  {
    /**
     * ★★ Der Fallstrick, der vor dem Bauen zu klären war (Bauplan §1, Punkt 1):
     * Die fn-Taste erzeugt am Mac GAR KEIN Tastatur-Ereignis (RECHERCHE-05 §5,
     * in `chord.ts` seit M1 festgehalten). Sie ist im Explorier-Modus nicht
     * auffindbar - also wird sie ERKLÄRT und nie gesucht.
     *
     * ★ Zum Aufdruck: Auf MacBooks steht „fn" auf der Taste (Johannes am
     * 07.08. an seinem eigenen Gerät). Auf der separaten Magic Keyboard trägt
     * dieselbe Taste nur das Globus-Zeichen und kein Wort - nachgesehen am
     * Produktbild der deutschen Magic Keyboard mit Touch ID auf apple.com/de.
     * Beides steht darum in der Lage-Angabe; Apple selbst nennt sie in 102650
     * „Fn (Funktionstaste) oder Globus-Taste".
     */
    id: "fn",
    name: "Funktionstaste",
    kurz: "fn",
    aufdruck: "fn",
    zeichen: "🌐",
    lage: "Links unten, die erste Taste, ganz außen. Am MacBook steht „fn“ darauf.",
    aufgabe:
      "Sie schaltet um, was die F-Tasten oben tun, und gehört zu eigenen Kürzeln - " +
      "fn und Löschtaste löschen zum Beispiel nach rechts.",
    // ★ 13.09.2026: „Funktionstaste" stand hier als `auchGenannt` - jetzt
    // überflüssig, seit `name` selbst so heißt (`kurz: "fn"` bleibt die
    // Wiedererkennung).
    auchGenannt: ["Globustaste"],
    suchbar: false,
    warumNichtSuchbar:
      "Die fn-Taste kannst du hier nicht suchen: Der Mac behält sie für sich und sagt " +
      "keinem Programm Bescheid, wenn du sie drückst. Sie ist die einzige Taste, die " +
      "du dir merken musst, ohne sie hier zu finden - ganz außen links in der Ecke.",
  },
];

/* ══ Die Listen ═════════════════════════════════════════════════════════════ */

/**
 * Alle Tasten einer Plattform, in LEHR-Reihenfolge: erst die, mit denen man
 * sich bewegt, dann die zum Löschen, dann die, die andere Tasten verändern.
 * Dieselbe Gruppierung, die auch die Lektion benutzt (Bauplan §2: „nicht eine
 * Taste je Atom, sondern nach Aufgabe gruppiert").
 */
export function tastenFuer(plattform: Plattform): readonly TastenName[] {
  const eigen = plattform === "macos" ? MAC_EIGEN : WINDOWS_EIGEN;
  const finde = (id: string): TastenName => {
    const t = eigen.find((k) => k.id === id);
    /* c8 ignore next */
    if (!t) throw new Error(`tastenNamen: „${id}" fehlt für ${plattform}`);
    return t;
  };
  return [
    // Bewegen
    TABULATOR,
    ...PFEILE,
    /**
     * ★ X-LS1 (10.08.2026): die vier Sprungtasten des Sechserblocks. Sie stehen
     * bei den Bewegungs-Tasten, weil sie genau das tun - springen und blättern.
     *
     * ⚠️ Nur unter Windows, und dieser Zweig ist der Grund, warum sie NICHT
     * einfach in `WINDOWS_EIGEN` stehen bleiben durften: `tasteMitId()` und
     * `suchbareTasten()` lesen ausschließlich diese Liste. Ein Eintrag, den
     * `tastenFuer()` nicht zurückgibt, ist für die ganze App unsichtbar - vier
     * sorgfältig geschriebene Karteikarten, die niemand je zu Gesicht bekäme.
     */
    ...(plattform === "windows"
      ? [finde("pos1"), finde("ende"), finde("bild-auf"), finde("bild-ab")]
      : []),
    LEERTASTE,
    finde(plattform === "macos" ? "zeilenschalter" : "eingabe"),
    // Löschen und abbrechen
    finde("loeschtaste"),
    finde("entf"),
    ESC,
    // Tasten, die andere Tasten verändern
    UMSCHALT,
    FESTSTELL,
    ...(plattform === "macos"
      ? [finde("befehlstaste"), finde("wahltaste"), finde("ctrl"), finde("fn")]
      : [
          finde("strg"),
          finde("alt"),
          finde("altgr"),
          finde("windows-taste"),
          /**
           * ★★ Q3-Einfg (14.08.2026): Sie steht bei den Tasten, die ANDERE
           * Tasten verändern, und nicht bei den Sprungtasten des
           * Sechserblocks - obwohl sie physisch dort liegt. Was diese App
           * lehrt, ist ihre EINE Aufgabe: Sie ist die Screenreader-Taste, und
           * eine Screenreader-Taste tut genau das, was Strg und Alt tun -
           * sie ändert, was eine zweite Taste bedeutet.
           *
           * ⚠️ Nur unter Windows, und das ist kein Versehen: Mac-Tastaturen
           * haben keine Einfg-Taste, und anders als bei Pos1 und Ende holt
           * die fn-Taste sie auch nicht zurück. Was am Mac an ihre Stelle
           * tritt, lehrt `mac.bedienungshilfen.keine-einfg-taste`.
           */
          finde("einfg"),
        ]),
  ];
}

/** Eine Taste nachschlagen. `null`, wenn es sie auf dieser Plattform nicht gibt. */
export function tasteMitId(id: string, plattform: Plattform): TastenName | null {
  return tastenFuer(plattform).find((t) => t.id === id) ?? null;
}

/**
 * ★ D2 (18.10.2026, Testerin): Tasten, die eine übliche Laptop-Tastatur nicht
 * oder nur mit der Fn-Taste hat. Am Laptop fragt die Suchrunde „Tasten finden"
 * sie nicht (Einstellung „Tastatur: Laptop", `tastaturArt.ts`).
 *
 * Das sind die vier Sprungtasten des Sechserblocks (Pos1, Ende, Bild auf,
 * Bild ab) und Einfg (die ist ohnehin `suchbar: false`, steht hier der
 * Vollständigkeit halber). Einen Ziffernblock sowie Rollen, Pause und Druck gibt es
 * in dieser Liste nicht - sie stehen nicht im Wörterbuch und müssen nicht
 * gefiltert werden. Entf bleibt: Sie liegt auch am Laptop als eigene Taste.
 * Am Mac steht keine dieser Tasten in der Liste (Eigentum von Windows).
 */
export const LAPTOP_OHNE: ReadonlySet<string> = new Set([
  "pos1",
  "ende",
  "bild-auf",
  "bild-ab",
  "einfg",
]);

/**
 * Die Liste für die eingestellte Tastatur-Art: am Laptop ohne {@link LAPTOP_OHNE}.
 * Bliebe dadurch nichts übrig, gilt die volle Liste (eine leere Suchrunde wäre
 * schlimmer als eine mit einer Taste mehr).
 */
export function fuerTastaturArt(
  liste: readonly TastenName[],
  art: "computer" | "laptop",
): readonly TastenName[] {
  if (art !== "laptop") return liste;
  const gefiltert = liste.filter((t) => !LAPTOP_OHNE.has(t.id));
  return gefiltert.length > 0 ? gefiltert : liste;
}

/** Nur die Tasten, die sich im Explorier-Modus wirklich finden lassen. */
export function suchbareTasten(
  plattform: Plattform,
  art: "computer" | "laptop" = "computer",
): readonly TastenName[] {
  return fuerTastaturArt(
    tastenFuer(plattform).filter((t) => t.suchbar),
    art,
  );
}

/* ══ Erkennen ═══════════════════════════════════════════════════════════════ */

/**
 * `KeyboardEvent.code` → Wörterbuch-id. Über den CODE, nicht über `key`:
 * Der Code sagt, welche physische Taste gedrückt wurde, und genau darum geht es
 * hier. `key` hinge am Layout - die Taste links unten meldet je nach
 * Einstellung Verschiedenes, die physische Taste bleibt dieselbe.
 *
 * ⚠️ Die Zuordnung ist plattform-ABHÄNGIG, obwohl die Codes gleich heißen:
 * `MetaLeft` ist unter Windows die Windows-Taste und am Mac die Befehlstaste;
 * `AltLeft` ist unter Windows die Alt-Taste und am Mac die Wahltaste. Ein
 * gemeinsamer Eintrag wäre genau die Fehl-Lehre, die `chord.ts` im Kopf
 * beschreibt.
 */
const CODE_ZU_ID_GETEILT: Readonly<Record<string, string>> = {
  Tab: "tabulator",
  ShiftLeft: "umschalt",
  ShiftRight: "umschalt",
  CapsLock: "feststell",
  Escape: "esc",
  Space: "leertaste",
  Backspace: "loeschtaste",
  Delete: "entf",
  ArrowLeft: "pfeil-links",
  ArrowRight: "pfeil-rechts",
  ArrowUp: "pfeil-auf",
  ArrowDown: "pfeil-ab",
};

const CODE_ZU_ID_WINDOWS: Readonly<Record<string, string>> = {
  Enter: "eingabe",
  NumpadEnter: "eingabe",
  /**
   * ★ X-LS1: der Sechserblock. Er MUSS hier stehen, weil die vier Einträge
   * `suchbar: true` tragen - und `suchbar` heißt laut Feld-Beschreibung genau
   * eines: Der Browser sieht das Tastatur-Ereignis. Diese vier erzeugen es
   * (anders als fn); ohne Eintrag hier bekäme ein Kind auf seinen Tastendruck
   * trotzdem „diese Taste kenne ich hier nicht" zu hören, und das Wörterbuch
   * behauptete etwas, was der Explorier-Modus nicht einlöst.
   */
  Home: "pos1",
  End: "ende",
  PageUp: "bild-auf",
  PageDown: "bild-ab",
  /**
   * ★★ Q3-Einfg: Sie trägt `suchbar: false` und steht trotzdem hier. Das ist
   * kein Widerspruch: Der Suchauftrag liest `suchbareTasten()`, das ERKENNEN
   * liest diese Tabelle. Kommt der Tastendruck an, soll der freie
   * Explorier-Modus ihren Namen sagen statt „diese Taste kenne ich hier
   * nicht" - ein Kind, das die Karte im Wörterbuch gelesen hat, bekäme sonst
   * die App als Widerspruch zu sich selbst zu hören.
   */
  Insert: "einfg",
  ControlLeft: "strg",
  ControlRight: "strg",
  AltLeft: "alt",
  // ⚠️ AltGr meldet sich als Strg+Alt - erkannt wird sie über den Code.
  AltRight: "altgr",
  MetaLeft: "windows-taste",
  MetaRight: "windows-taste",
};

const CODE_ZU_ID_MAC: Readonly<Record<string, string>> = {
  Enter: "zeilenschalter",
  NumpadEnter: "zeilenschalter",
  MetaLeft: "befehlstaste",
  MetaRight: "befehlstaste",
  AltLeft: "wahltaste",
  AltRight: "wahltaste",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
};

/**
 * Welche Taste war das? `null`, wenn die Taste nicht zum Lernstoff gehört
 * (Buchstaben, Ziffern, F-Tasten) - dann sagt der Explorier-Modus ehrlich, dass
 * er sie hier nicht erklärt, statt zu raten.
 *
 * ★ Der Rückfall auf `e.key` ist für Tastaturen, die keinen `code` liefern
 * (ältere Browser, manche Bildschirmtastaturen). Er kann links und rechts nicht
 * unterscheiden - für den Namen ist das gleichgültig, beide heißen gleich.
 */
export function tasteFuerEreignis(
  e: KeyEventLike,
  plattform: Plattform,
): TastenName | null {
  const eigenTabelle = plattform === "macos" ? CODE_ZU_ID_MAC : CODE_ZU_ID_WINDOWS;

  const code = e.code;
  if (code) {
    const id = CODE_ZU_ID_GETEILT[code] ?? eigenTabelle[code];
    if (id) return tasteMitId(id, plattform);
    return null;
  }

  // Rückfall über e.key - ohne Seiten-Unterscheidung.
  const key = e.key;
  const ausKey: Readonly<Record<string, string>> = {
    Tab: "tabulator",
    Shift: "umschalt",
    CapsLock: "feststell",
    Escape: "esc",
    " ": "leertaste",
    Backspace: "loeschtaste",
    Delete: "entf",
    ArrowLeft: "pfeil-links",
    ArrowRight: "pfeil-rechts",
    ArrowUp: "pfeil-auf",
    ArrowDown: "pfeil-ab",
    Enter: plattform === "macos" ? "zeilenschalter" : "eingabe",
    // ★ X-LS1: der Sechserblock. Am Mac führt das Wörterbuch diese vier nicht -
    // `tasteMitId()` liefert dort `null`, und der Explorier-Modus sagt ehrlich,
    // dass er die Taste hier nicht erklärt. Genau richtig: Auf den meisten
    // Mac-Tastaturen gibt es sie gar nicht.
    Home: "pos1",
    End: "ende",
    PageUp: "bild-auf",
    PageDown: "bild-ab",
    Meta: plattform === "macos" ? "befehlstaste" : "windows-taste",
    Alt: plattform === "macos" ? "wahltaste" : "alt",
    Control: plattform === "macos" ? "ctrl" : "strg",
    AltGraph: "altgr",
  };
  const id = ausKey[key];
  return id ? tasteMitId(id, plattform) : null;
}

/* ══ Ansagen ════════════════════════════════════════════════════════════════ */

/**
 * ★ Der Artikel eines Tastennamens (13.09.2026, Befund der Tastenflow-Sitzung:
 * „Finde die Linkspfeil", „Drück noch einmal die Zeilenschalter").
 *
 * Alle gelehrten Namen enden auf „-taste" oder „-schalter" oder beginnen mit
 * „Pfeil nach " (die vier Pfeile, seit Johannes' Entscheidung vom 13.09.2026
 * „Pfeil nach links" statt „Linkspfeil" heißen). „-schalter" und „Pfeil nach "
 * sind männlich, alles andere („-taste") ist weiblich. Ein Wächter in
 * `tests/computer-tastennamen.test.ts` hält fest, dass kein Name eine andere
 * Form bekommt - sonst stünde hier still ein falscher Artikel.
 */
export function istMaennlicherTastenname(name: string): boolean {
  return /^Pfeil nach /.test(name) || /schalter$/i.test(name);
}

/** Der Artikel (Nominativ/Akkusativ/Dativ) zu einem gelehrten Tastennamen. */
function artikelFuer(name: string, fall: "akkusativ" | "nominativ" | "dativ"): string {
  const maennlich = istMaennlicherTastenname(name);
  return maennlich
    ? fall === "nominativ"
      ? "der"
      : fall === "dativ"
        ? "dem"
        : "den"
    : fall === "dativ"
      ? "der"
      : "die";
}

/**
 * ★★★ Ein Tastenname in einem Satz - mit Artikel, und mit der Kurzform davor,
 * wenn es eine gibt (Johannes, 13.09.2026: „beides zuerst die kurzfassung und
 * dann die lange", auf Rückfrage bestätigt: „Ja, immer kurz dann lang", auch
 * wenn die Kurzfassung englisch ist).
 *
 * Beispiele: „Shift, die Umschalttaste" (Akkusativ und Nominativ, weiblich -
 * beide Fälle lauten „die") · „die Leertaste" (kein `kurz`) · „Return, den
 * Zeilenschalter" (Akkusativ, männlich) · „der Pfeil nach links" (Nominativ,
 * männlich, kein `kurz`).
 *
 * Wo `kurz` nur den Namen wiederholen würde (gleicher Text ohne Groß-/
 * Kleinschreibung), steht er nicht doppelt.
 *
 * ★ Bleibt allein für den AUFTRAG beim Suchen (`ansageSuchauftrag`) - seit
 * 23.09.2026 (Johannes: „du schreibst bei den anweisungen zu viel Text, halte
 * dich kürzer") benutzen die übrigen Sätze der Suchrunde die knappere
 * `tastenNennungKurz` darunter.
 */
export function tastenNennung(
  t: TastenName,
  fall: "akkusativ" | "nominativ" | "dativ" = "akkusativ",
): string {
  const mitArtikel = `${artikelFuer(t.name, fall)} ${t.name}`;
  if (t.kurz && t.kurz.toLowerCase() !== t.name.toLowerCase()) {
    return `${t.kurz}, ${mitArtikel}`;
  }
  return mitArtikel;
}

/**
 * ★★★ 23.09.2026, Johannes: „du schreibst bei den anweisungen zu viel Text,
 * halte dich kürzer" - die knappe Nennung für die Sätze der Suchrunde (nicht
 * für den Auftrag selbst, der bleibt bei `tastenNennung`): nur die Kurzform,
 * wenn es eine gibt („Tab", „Shift", „Esc"), sonst Artikel und Name wie oben
 * („die Leertaste", „den Pfeil nach links").
 */
export function tastenNennungKurz(
  t: TastenName,
  fall: "akkusativ" | "nominativ" | "dativ" = "akkusativ",
): string {
  if (t.kurz) return t.kurz;
  return `${artikelFuer(t.name, fall)} ${t.name}`;
}

/** Der Auftrag beim Suchen. */
export function ansageSuchauftrag(t: TastenName): string {
  return `Finde ${tastenNennung(t, "akkusativ")}. ${t.lage}`;
}

/**
 * ★★ Johannes' Idee und didaktisch der wichtigste Satz der ganzen Etappe:
 * „wenn man die richtige taste gefunden hat sagt die stimme gefunden, drücke
 * noch einmal die zB Umschalttaste". Erst die Wiederholung macht aus einem
 * Zufallstreffer eine Erinnerung.
 *
 * ★ 23.09.2026: knapp mit `tastenNennungKurz` - „Gefunden! Drück noch einmal
 * Tab." statt „…Tab, die Tabulatortaste."
 */
export function ansageGefunden(t: TastenName): string {
  return `Gefunden! Drück eine andere Taste, dann noch einmal ${tastenNennungKurz(t, "akkusativ")}.`;
}

/**
 * Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste).
 *
 * ★ 23.09.2026, Johannes: „du schreibst bei den anweisungen zu viel Text,
 * halte dich kürzer". Das „Das war …" mit dem Tastennamen fällt weg - das
 * Kind hat die Taste gerade zweimal gedrückt und weiss, welche es war; die
 * Suchrunde nennt gleich darauf die nächste Aufgabe.
 */
export function ansageBestaetigt(t: TastenName): string {
  return t.achtung ? `Sitzt! ${t.achtung}` : "Sitzt!";
}

/**
 * Wenn eine Taste gedrückt wurde, die hier nicht unterrichtet wird.
 * ★ 23.09.2026: nur noch der erste Satz - der zweite (Ermunterung, welche
 * Taste zu drücken ist) kommt aus der Suchrunde selbst dazu (`tastenSuche.ts`).
 */
export const ANSAGE_UNBEKANNT = "Diese Taste lernen wir hier nicht.";
