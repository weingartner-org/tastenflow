/**
 * im Griff — was jedes Kürzel BEWIRKT, und wie ein Kind das schreiben darf.
 *
 * ── Wozu diese Tabelle da ist ────────────────────────────────────────────────
 *
 * Das Kürzel-Üben fragt in beide Richtungen (Neubau 25.08.2026):
 *
 *   Richtung 1 — HANDELN:  „Kopiere den Text.“          → das Kind drückt Strg+C
 *   Richtung 2 — WISSEN:   „Was bewirkt Strg+C?“        → das Kind schreibt es hin
 *
 * Für Richtung 2 braucht die App zweierlei: eine vorbildliche Antwort, die sie
 * zurückmeldet und ansagt (`muster`, echte Umlaute), und ein möglichst weites
 * Feld an Formulierungen, die als richtig gelten (`antworten`). Johannes am
 * 25.08.: „du musst ein großes Portfolio für jede Antwort haben, wie Kinder das
 * schreiben können: klein, groß, ein ganzer Satz, Abkürzungen, falsch
 * geschrieben, …". Groß/klein, Satzbau, Beugung und Tippfehler erledigt der
 * Prüfer (`antwortPruefer.ts`) von selbst — hier stehen die INHALTLICH anderen
 * Wege, dieselbe Sache zu sagen: „Zwischenablage“ für Kopieren, „blau machen“
 * für Markieren, „zurück“ für Rückgängig.
 *
 * ── Warum nach Wirkung und nicht nach Atom ───────────────────────────────────
 *
 * `grundlagen.kopieren`, `explorer.kopieren`, `word.kopieren` und
 * `mac.grundlagen.kopieren` sind vier Atome mit EINER Wirkung. Stünde das
 * Portfolio am Atom, gäbe es dieselbe Wortliste viermal — und beim fünften
 * Zusatz stünde sie dreimal veraltet da. Darum: eine Tabelle der Wirkungen,
 * und eine Zuordnung Atom → Wirkung.
 *
 * ── Die Sperren ──────────────────────────────────────────────────────────────
 *
 * `sperren` nennt die Nachbarn, mit denen sich eine Wirkung verwechseln lässt.
 * Ohne sie ginge „suchen und ersetzen“ bei der Frage nach Strg+F als richtig
 * durch. Mit ihnen bekommt das Kind die Auskunft, WAS es gerade beschrieben
 * hat — eine Aussage über die Sache, nie über das Kind.
 *
 * Reine Daten, kein React, kein Import aus `data.ts`. Der Wächter-Test
 * `tests/computer-kuerzel-wirkung.test.ts` stellt sicher, dass JEDES
 * Kürzel-Atom beider Plattformen hier eine Wirkung hat.
 */
import type { WirkungErwartung } from "./antwortPruefer";

/** Die Wirkungen, nach Kennung. */
export const WIRKUNGEN: Record<string, WirkungErwartung> = {
  // ══ Zwischenablage ═════════════════════════════════════════════════════════
  kopieren: {
    id: "kopieren",
    muster: "Kopieren",
    antworten: [
      "kopieren", "kopie", "abkopieren", "vervielfältigen", "duplizieren",
      "zwischenablage", "in die zwischenablage", "merken für später",
      // ★ D6.1 (19.10.2026): „Zwischenspeicher" meint hier dieselbe Ablage wie
      // „Zwischenablage" - Strg+C legt den Text dorthin. Ohne diesen Eintrag
      // landete „zwischenspeicher" bei der Frage nach Strg+C als „Speichern".
      // Gegenprobe: „Ausschneiden in den Zwischenspeicher" bleibt falsch
      // (Sperre „ausschneiden"), ebenso „aus dem Zwischenspeicher einfügen"
      // (Sperre „einfügen").
      "zwischenspeicher",
      "doppelt vorhanden", "noch einmal vorhanden", "zweite kopie",
      "copy",
    ],
    sperren: ["ausschneiden", "einfügen", "einsetzen", "löschen"],
  },
  einfuegen: {
    id: "einfuegen",
    muster: "Einfügen",
    antworten: [
      "einfügen", "einsetzen", "hineinsetzen", "hinsetzen", "hereinsetzen",
      "füge ein", "fügt ein", "eingefügt", "setze ein", "setzt ein",
      "hineintun", "hinzufügen", "ablegen", "abladen", "hinkopieren",
      // ★ D6.1: „hineinkopieren" = den kopierten Text an eine Stelle hinein
      // kopieren - dasselbe wie „hinkopieren" (die Gegenprobe „hineinkopieren"
      // für Kopieren bleibt falsch).
      "hineinkopieren",
      "aus der zwischenablage", "wieder hervorholen", "paste", "einkleben",
    ],
    sperren: ["kopieren", "ausschneiden"],
  },
  ausschneiden: {
    id: "ausschneiden",
    muster: "Ausschneiden",
    antworten: [
      "ausschneiden", "wegschneiden", "herausschneiden", "ausschnitt",
      "schneide aus", "schneidet aus", "ausgeschnitten",
      "wegnehmen und merken", "verschieben", "umlegen", "cut",
      "wegnehmen", "herausnehmen",
    ],
    sperren: ["kopieren", "einfügen"],
  },

  // ══ Zurück und vor ═════════════════════════════════════════════════════════
  rueckgaengig: {
    id: "rueckgaengig",
    muster: "Rückgängig machen",
    antworten: [
      "rückgängig", "zurücknehmen", "zurück", "widerrufen", "undo",
      "mache rückgängig", "nehme zurück", "nimmt zurück",
      "letzten schritt zurück", "fehler weg", "wieder wie vorher",
      "ungeschehen", "zurückgehen",
    ],
    sperren: ["wiederherstellen", "nach vorn"],
  },
  wiederherstellen: {
    id: "wiederherstellen",
    muster: "Wiederherstellen - das Zurückgenommene wieder nach vorn",
    antworten: [
      "wiederherstellen", "wiederholen", "nach vorn", "vorwärts", "redo",
      "stelle wieder her", "wieder nach vorn",
      "doch wieder machen", "zurücknehmen aufheben", "wieder herstellen",
    ],
    sperren: ["rückgängig"],
  },

  // ══ Markieren ══════════════════════════════════════════════════════════════
  "alles-markieren": {
    id: "alles-markieren",
    muster: "Alles markieren",
    antworten: [
      "alles markieren", "alles auswählen", "alle markieren", "alle auswählen",
      // ★ D6.1: „selektieren" ist das Fachwort für markieren - dieselbe Wirkung.
      "alles selektieren",
      "alles blau machen", "alles anwählen", "markiere alles", "wähle alles aus",
      "komplett markieren", "ganzes dokument markieren", "gesamten text markieren",
      "alles blau", "alles nehmen", "alles anwählen", "select all",
    ],
    sperren: ["wort", "zeichen", "spalte", "zeile"],
  },
  "markieren-zeichen": {
    id: "markieren-zeichen",
    muster: "Zeichen für Zeichen markieren",
    antworten: [
      "zeichen markieren", "buchstaben markieren", "buchstabe markieren",
      "einzelne zeichen markieren", "schrittweise markieren",
      "zeichenweise markieren", "einen buchstaben auswählen",
    ],
    sperren: ["wort", "alles", "spalte", "zeile"],
  },
  "markieren-wort": {
    id: "markieren-wort",
    muster: "Wort für Wort markieren",
    antworten: [
      "wort markieren", "wörter markieren", "wortweise markieren",
      "ganze wörter markieren", "wort für wort", "wortweise auswählen",
    ],
    sperren: ["zeichen", "buchstabe", "alles", "spalte", "zeile"],
  },
  "spalte-markieren": {
    id: "spalte-markieren",
    muster: "Die ganze Spalte markieren",
    antworten: [
      "spalte markieren", "ganze spalte", "spalte auswählen",
      "senkrechte reihe markieren", "spalte nehmen",
    ],
    sperren: ["zeile", "waagrecht"],
  },
  "zeile-markieren": {
    id: "zeile-markieren",
    muster: "Die ganze Zeile markieren",
    antworten: [
      "zeile markieren", "ganze zeile", "zeile auswählen",
      "waagrechte reihe markieren", "zeile nehmen",
    ],
    sperren: ["spalte", "senkrecht"],
  },

  // ══ Dateien und Ordner ═════════════════════════════════════════════════════
  oeffnen: {
    id: "oeffnen",
    muster: "Öffnen",
    antworten: [
      "öffnen", "aufmachen", "hineingehen", "reingehen", "starten",
      "mache auf", "macht auf", "geht auf", "geöffnet", "gehe hinein",
      "aufgehen", "anzeigen lassen", "in den ordner gehen", "aufrufen",
    ],
    sperren: ["schließen", "umbenennen", "löschen"],
  },
  umbenennen: {
    id: "umbenennen",
    muster: "Umbenennen",
    antworten: [
      "umbenennen", "namen ändern", "anders nennen", "neuen namen geben",
      "namen vergeben", "benennen", "umtaufen", "titel ändern",
    ],
    sperren: ["löschen", "öffnen", "verschieben"],
  },
  "neuer-ordner": {
    id: "neuer-ordner",
    muster: "Einen neuen Ordner anlegen",
    antworten: [
      "neuer ordner", "ordner anlegen", "ordner erstellen", "ordner machen",
      "neues verzeichnis", "mappe anlegen", "neuen ordner erzeugen",
    ],
    sperren: ["löschen", "umbenennen", "tabellenblatt"],
  },
  papierkorb: {
    id: "papierkorb",
    muster: "In den Papierkorb legen",
    antworten: [
      "löschen", "in den papierkorb", "papierkorb", "wegwerfen", "entsorgen",
      "werfe weg", "wirft weg", "gelöscht", "tue weg",
      "wegtun", "entfernen", "müll", "in den mülleimer", "weglegen",
    ],
    sperren: ["endgültig", "unwiederbringlich"],
  },
  duplizieren: {
    id: "duplizieren",
    muster: "Eine zweite Ausgabe derselben Datei anlegen",
    antworten: [
      "duplizieren", "duplikat", "zweite ausgabe", "kopie anlegen",
      "datei verdoppeln", "noch einmal dieselbe datei", "kopie daneben",
    ],
    sperren: ["einfügen", "zwischenablage"],
  },
  "ebene-hoeher": {
    id: "ebene-hoeher",
    muster: "Eine Ebene nach oben gehen",
    antworten: [
      "eine ebene höher", "nach oben", "übergeordneter ordner", "hinausgehen",
      "zurück in den oberen ordner", "eine stufe hinauf", "raus aus dem ordner",
      // ★ D6.1: „eine Ebene hoch" und „einen Ordner höher" sagen dasselbe wie
      // „eine Ebene höher" (und stehen nicht bei Hineingehen - das ist die Sperre).
      "ordner darüber", "eine ebene zurück", "eine ebene hoch", "einen ordner höher",
    ],
    sperren: ["hineingehen", "öffnen"],
  },
  adressleiste: {
    id: "adressleiste",
    muster: "In die Adressleiste springen",
    antworten: [
      "adressleiste", "adresszeile", "pfad eingeben", "in die adresse springen",
      "zur adresse", "wo der pfad steht", "url zeile", "adressfeld",
    ],
    sperren: [],
  },
  eigenschaften: {
    id: "eigenschaften",
    muster: "Die Eigenschaften anzeigen",
    antworten: [
      "eigenschaften", "informationen", "infos anzeigen", "details anzeigen",
      "nachsehen was es ist", "größe und datum sehen", "auskunft über die datei",
      "informationsfenster",
    ],
    sperren: [],
  },
  uebersicht: {
    id: "uebersicht",
    muster: "Die Übersicht öffnen - kurz hineinschauen, ohne zu öffnen",
    antworten: [
      "übersicht", "vorschau", "kurz hineinschauen", "schnellansicht",
      // ★ D6.1: „Quick Look" ist der Mac-Name der Vorschau, einmal zusammengeschrieben.
      "anschauen ohne öffnen", "reinschauen", "quick look", "quicklook", "vorschaufenster",
    ],
    sperren: [],
  },
  bewegen: {
    id: "bewegen",
    muster: "Die Datei ans Ziel bewegen (sie verschwindet vom alten Platz)",
    antworten: [
      "bewegen", "verschieben", "umziehen", "an den neuen platz",
      "weg vom alten platz", "hierher holen und dort löschen", "versetzen",
    ],
    sperren: ["kopieren"],
  },
  "ansicht-details": {
    id: "ansicht-details",
    muster: "Die Ansicht „Details“ einschalten",
    antworten: [
      "detailansicht", "ansicht details", "liste mit spalten", "details",
      "ansicht umschalten auf details", "tabellenansicht",
    ],
    sperren: [],
  },

  // ══ Speichern ══════════════════════════════════════════════════════════════
  speichern: {
    id: "speichern",
    muster: "Speichern",
    antworten: [
      "speichern", "sichern", "abspeichern", "aufheben", "behalten",
      "arbeit sichern", "damit nichts verloren geht", "save",
    ],
    sperren: ["unter", "neuen namen", "neuer name"],
  },
  "speichern-unter": {
    id: "speichern-unter",
    muster: "Speichern unter - mit neuem Namen oder an neuem Ort",
    antworten: [
      "speichern unter", "unter neuem namen speichern", "neuen namen geben und speichern",
      "woanders speichern", "als kopie speichern", "an anderer stelle sichern",
      "speichern unter fenster",
    ],
    sperren: [],
  },

  // ══ Schrift ════════════════════════════════════════════════════════════════
  fett: {
    id: "fett",
    muster: "Fett machen",
    antworten: [
      "fett", "fett machen", "fettdruck", "dick", "dicker", "kräftig",
      "mache fett", "fett geschrieben", "fett schreiben",
      "hervorheben durch fett", "bold",
    ],
    sperren: ["kursiv", "unterstreichen", "schräg"],
  },
  kursiv: {
    id: "kursiv",
    muster: "Kursiv machen",
    antworten: [
      "kursiv", "schräg", "schräg stellen", "geneigt", "schrägschrift", "italic",
    ],
    sperren: ["fett", "unterstreichen"],
  },
  unterstreichen: {
    id: "unterstreichen",
    muster: "Unterstreichen",
    antworten: [
      "unterstreichen", "unterstrichen", "strich darunter", "linie darunter",
      "unterstreichung",
    ],
    sperren: ["fett", "kursiv", "ausfüllen"],
  },
  ueberschrift1: {
    id: "ueberschrift1",
    muster: "Überschrift 1 zuweisen",
    antworten: [
      "überschrift 1", "überschrift eins", "hauptüberschrift", "titel der ersten ebene",
      "erste überschriftenebene", "als überschrift 1 formatieren",
    ],
    sperren: ["überschrift 2", "überschrift zwei", "standard"],
  },
  ueberschrift2: {
    id: "ueberschrift2",
    muster: "Überschrift 2 zuweisen",
    antworten: [
      "überschrift 2", "überschrift zwei", "unterüberschrift",
      "zweite überschriftenebene", "als überschrift 2 formatieren",
    ],
    sperren: ["überschrift 1", "überschrift eins", "standard"],
  },
  "standard-format": {
    id: "standard-format",
    muster: "Die Formatvorlage „Standard“ zuweisen",
    antworten: [
      "standard", "standardformat", "formatvorlage standard", "normaler text",
      "formatierung zurücksetzen", "wieder normal", "keine überschrift mehr",
    ],
    sperren: ["überschrift"],
  },
  links: {
    id: "links",
    muster: "Linksbündig ausrichten",
    antworten: [
      "linksbündig", "links ausrichten", "nach links", "am linken rand",
      "linksbündig machen",
    ],
    sperren: ["zentriert", "mitte", "rechts"],
  },
  zentriert: {
    id: "zentriert",
    muster: "Zentriert ausrichten",
    antworten: [
      "zentriert", "in die mitte", "mittig", "zentrieren", "mitte ausrichten",
    ],
    sperren: ["links", "rechts"],
  },
  zeilenumbruch: {
    id: "zeilenumbruch",
    muster: "Zeilenumbruch im selben Absatz",
    antworten: [
      "zeilenumbruch", "neue zeile", "umbruch ohne neuen absatz",
      "gleicher absatz neue zeile", "weicher umbruch", "zeilenwechsel",
    ],
    sperren: ["neuer absatz", "absatzwechsel"],
  },
  rechtschreibung: {
    id: "rechtschreibung",
    muster: "Die Rechtschreibprüfung starten",
    antworten: [
      "rechtschreibprüfung", "rechtschreibung prüfen", "fehler suchen",
      "rechtschreibung", "schreibfehler finden", "korrektur",
    ],
    sperren: [],
  },
  fensterbereiche: {
    id: "fensterbereiche",
    muster: "Zwischen den Bereichen des Fensters wechseln",
    antworten: [
      "fensterbereich wechseln", "bereich wechseln", "zwischen den bereichen springen",
      "in die statusleiste", "zum nächsten bereich", "bereichswechsel",
      "zum menüband und zurück",
    ],
    sperren: [],
  },
  "formatvorlagen-bereich": {
    id: "formatvorlagen-bereich",
    muster: "Den Formatvorlagen-Bereich öffnen",
    antworten: [
      "formatvorlagen-bereich öffnen", "formatvorlagen öffnen", "stilliste öffnen",
      "die liste der formatvorlagen zeigen", "den bereich mit den formatvorlagen holen",
      "zeigt alle formatvorlagen", "aufgabenbereich formatvorlagen",
    ],
    sperren: ["überschrift 1", "standard"],
  },

  // ══ Suchen ═════════════════════════════════════════════════════════════════
  suchen: {
    id: "suchen",
    muster: "Suchen",
    antworten: [
      "suchen", "finden", "suche öffnen", "nach etwas suchen", "durchsuchen",
      "suchfeld", "suchfenster", "wort suchen", "stelle finden",
    ],
    sperren: ["ersetzen", "austauschen"],
  },
  ersetzen: {
    id: "ersetzen",
    muster: "Suchen und Ersetzen",
    antworten: [
      "ersetzen", "suchen und ersetzen", "austauschen", "durch etwas anderes ersetzen",
      "wort austauschen", "überall ändern", "ersetzen fenster",
    ],
    sperren: [],
  },

  // ══ Tabellen ═══════════════════════════════════════════════════════════════
  "gehe-zu-zelle": {
    id: "gehe-zu-zelle",
    muster: "Zu einer bestimmten Zelle springen",
    antworten: [
      "zu einer zelle springen", "gehe zu", "zelle anspringen", "zur zelle gehen",
      "adresse eingeben und hinspringen", "sprungfenster", "direkt zu einer zelle",
    ],
    sperren: ["bearbeiten", "formatieren"],
  },
  "zelle-bearbeiten": {
    id: "zelle-bearbeiten",
    muster: "In der Zelle weiterschreiben",
    antworten: [
      "zelle bearbeiten", "in der zelle schreiben", "weiterschreiben",
      "inhalt ändern", "hineinschreiben", "bearbeiten", "ändern was drin steht",
      "in die zelle hinein",
    ],
    sperren: ["formatieren", "springen", "markieren"],
  },
  "zelle-formatieren": {
    id: "zelle-formatieren",
    muster: "Das Fenster „Zellen formatieren“ öffnen",
    antworten: [
      "zelle formatieren", "zellen formatieren", "format ändern", "zellformat",
      "aussehen der zelle ändern", "formatfenster", "zahlenformat einstellen",
    ],
    sperren: ["bearbeiten", "springen"],
  },
  "zum-rand": {
    id: "zum-rand",
    muster: "Zum Rand der Daten springen",
    antworten: [
      "zum rand", "ans ende der daten", "zum letzten eintrag", "tabellenrand",
      "ans ende springen", "zum datenrand", "bis wo etwas steht",
      "an den rand des datenblocks",
    ],
    sperren: [],
  },
  autosumme: {
    id: "autosumme",
    muster: "Die AutoSumme einsetzen",
    antworten: [
      "autosumme", "summe", "zusammenzählen", "addieren", "summe bilden",
      "alles aufsummieren", "summenformel einsetzen",
    ],
    sperren: [],
  },
  "ausfuellen-unten": {
    id: "ausfuellen-unten",
    muster: "Nach unten ausfüllen",
    antworten: [
      "nach unten ausfüllen", "unten ausfüllen", "nach unten kopieren",
      "in die zellen darunter", "formel nach unten ziehen", "abwärts ausfüllen",
    ],
    sperren: ["rechts", "unterstreichen"],
  },
  "ausfuellen-rechts": {
    id: "ausfuellen-rechts",
    muster: "Nach rechts ausfüllen",
    antworten: [
      "nach rechts ausfüllen", "rechts ausfüllen", "nach rechts kopieren",
      "in die zellen daneben", "formel nach rechts ziehen",
    ],
    sperren: ["unten", "abwärts"],
  },
  "absoluter-bezug": {
    id: "absoluter-bezug",
    muster: "Einen Bezug festhalten (absoluter Bezug mit Dollarzeichen)",
    antworten: [
      "absoluter bezug", "bezug festhalten", "dollarzeichen", "festhalten",
      "bezug fixieren", "damit sich der bezug nicht verschiebt", "feste zelle",
      "bezug einfrieren",
    ],
    sperren: [],
  },
  datum: {
    id: "datum",
    muster: "Das heutige Datum einfügen",
    antworten: [
      "datum", "heutiges datum", "datum einfügen", "tag einsetzen",
      "welcher tag heute ist",
    ],
    sperren: ["uhrzeit", "zeit"],
  },
  uhrzeit: {
    id: "uhrzeit",
    muster: "Die aktuelle Uhrzeit einfügen",
    antworten: [
      // ★ D6.1: „aktuelle Zeit" meint die Uhrzeit. Bei der Frage nach Datum
      // sperrt „Zeit" die Verwechslung ab.
      "uhrzeit", "zeit einfügen", "aktuelle uhrzeit", "aktuelle zeit", "wie spät es ist",
      "stunde und minute einsetzen",
    ],
    sperren: ["datum", "tag"],
  },
  kommentar: {
    id: "kommentar",
    muster: "Einen Kommentar einfügen",
    antworten: [
      "kommentar", "notiz", "anmerkung", "bemerkung einfügen", "hinweis anhängen",
      "kommentar schreiben",
    ],
    sperren: [],
  },
  autofilter: {
    id: "autofilter",
    muster: "Den Autofilter ein- und ausschalten",
    antworten: [
      "autofilter", "filter", "filtern", "filter einschalten", "filter setzen",
      "nur bestimmte zeilen zeigen",
    ],
    sperren: [],
  },
  blattwechsel: {
    id: "blattwechsel",
    muster: "Das Tabellenblatt wechseln",
    antworten: [
      "tabellenblatt wechseln", "blatt wechseln", "nächstes blatt", "anderes blatt",
      "blattwechsel", "zur nächsten tabelle", "register wechseln",
    ],
    sperren: ["neues blatt", "anlegen"],
  },
  "neues-blatt": {
    id: "neues-blatt",
    muster: "Ein neues Tabellenblatt anlegen",
    antworten: [
      "neues tabellenblatt", "neues blatt", "blatt anlegen", "blatt hinzufügen",
      "tabelle hinzufügen", "neues register",
    ],
    sperren: ["wechseln"],
  },

  // ══ Browser ════════════════════════════════════════════════════════════════
  "neu-laden": {
    id: "neu-laden",
    muster: "Die Seite neu laden",
    antworten: [
      "neu laden", "seite neu laden", "aktualisieren", "auffrischen", "neu holen",
      // ★ D6.1: „reload" ist der englische Name derselben Taste (wie „refresh" schon da).
      "lade neu", "lädt neu", "neu geladen", "reload",
      "seite erneuern", "refresh", "noch einmal laden",
    ],
    sperren: [],
  },
  lesezeichen: {
    id: "lesezeichen",
    muster: "Ein Lesezeichen setzen",
    antworten: [
      // ★ D6.1: „bookmark" ist der englische Name für Lesezeichen.
      "lesezeichen", "bookmark", "favorit", "merken", "seite merken", "lesezeichen setzen",
      "zu den favoriten", "seite speichern zum wiederfinden",
    ],
    sperren: [],
  },
  verlauf: {
    id: "verlauf",
    muster: "Den Verlauf öffnen",
    antworten: [
      "verlauf", "chronik", "verlauf öffnen", "was ich besucht habe",
      "besuchte seiten", "history", "liste der besuchten seiten",
    ],
    sperren: [],
  },

  // ══ Nachrichten ════════════════════════════════════════════════════════════
  senden: {
    id: "senden",
    muster: "Die Nachricht abschicken",
    antworten: [
      "senden", "abschicken", "absenden", "verschicken", "mail senden",
      "schicke ab", "schickt ab", "abgeschickt",
      "nachricht abschicken", "wegschicken", "losschicken",
    ],
    sperren: ["löschen"],
  },
  "nachricht-loeschen": {
    id: "nachricht-loeschen",
    muster: "Die Nachricht löschen",
    antworten: [
      "löschen", "nachricht löschen", "mail löschen", "wegwerfen",
      "in den papierkorb", "entfernen",
    ],
    sperren: ["senden", "abschicken"],
  },

  // ══ Hilfsmittel ════════════════════════════════════════════════════════════
  "sr-stopp": {
    id: "sr-stopp",
    muster: "Die Sprachausgabe anhalten",
    antworten: [
      "sprachausgabe anhalten", "stumm", "still", "stoppen", "anhalten",
      "sprachausgabe stoppen", "reden aufhören", "screenreader anhalten",
      "vorlesen stoppen", "schweigen",
      // ★ 18.10.2026 (Testerin schrieb „sprachausgabe unterbrechen" und bekam „falsch")
      "unterbrechen", "sprachausgabe unterbrechen", "vorlesen unterbrechen",
      "stimme unterbrechen", "stimme anhalten", "stimme stoppen", "stimme stumm",
      "sprachausgabe pausieren", "pausieren", "pause", "sprachausgabe pause",
      "vorlesen anhalten", "sprachausgabe stumm", "sprachausgabe still",
      "sprache anhalten", "sprache unterbrechen", "screenreader unterbrechen",
      "screenreader stoppen",
    ],
    sperren: [],
  },
};

/**
 * Welches Kürzel-Atom welche Wirkung hat.
 *
 * Die Mac-Atome stehen mit ihrer eigenen id da (kein automatisches Ableiten
 * über das Präfix): Am Mac heißen die Dinge teils anders — `mac.finder.bewegen`
 * hat kein Windows-Gegenstück, und `mac.excel.bezuege` heißt dort nicht
 * „absoluter Bezug“. Eine ausgeschriebene Zuordnung ist die einzige, bei der
 * ein neues Atom auffällt, statt still auf eine falsche Wirkung zu zeigen.
 */
export const ATOM_WIRKUNG: Record<string, string> = {
  // ── Windows ───────────────────────────────────────────────────────────────
  "grundlagen.kopieren": "kopieren",
  "grundlagen.einfuegen": "einfuegen",
  "grundlagen.ausschneiden": "ausschneiden",
  "grundlagen.rueckgaengig": "rueckgaengig",
  "grundlagen.alles-markieren": "alles-markieren",
  "bedienungshilfen.sr-stopp": "sr-stopp",
  "explorer.oeffnen": "oeffnen",
  "explorer.umbenennen": "umbenennen",
  "explorer.neuer-ordner": "neuer-ordner",
  "explorer.kopieren": "kopieren",
  "explorer.ausschneiden": "ausschneiden",
  "explorer.einfuegen": "einfuegen",
  "explorer.loeschen": "papierkorb",
  "explorer.ebene-hoeher": "ebene-hoeher",
  "explorer.adressleiste": "adressleiste",
  "explorer.suchen": "suchen",
  "explorer.eigenschaften": "eigenschaften",
  "explorer.ansicht-details": "ansicht-details",
  "word.speichern": "speichern",
  "word.speichern-unter": "speichern-unter",
  "word.rueckgaengig": "rueckgaengig",
  "word.fett": "fett",
  "word.kursiv": "kursiv",
  "word.unterstreichen": "unterstreichen",
  "word.markieren-zeichen": "markieren-zeichen",
  "word.markieren-wort": "markieren-wort",
  "word.alles-markieren": "alles-markieren",
  "word.kopieren": "kopieren",
  "word.einfuegen": "einfuegen",
  "word.ueberschrift1": "ueberschrift1",
  "word.ueberschrift2": "ueberschrift2",
  "word.standard": "standard-format",
  "word.suchen": "suchen",
  "word.ersetzen": "ersetzen",
  "word.ausrichtung-links": "links",
  "word.ausrichtung-zentriert": "zentriert",
  "word.zeilenumbruch": "zeilenumbruch",
  "word.rechtschreibung": "rechtschreibung",
  "word.fensterbereiche": "fensterbereiche",
  "word.formatvorlagen-bereich": "formatvorlagen-bereich",
  "excel.gehe-zu": "gehe-zu-zelle",
  "excel.zelle-bearbeiten": "zelle-bearbeiten",
  "excel.zelle-formatieren": "zelle-formatieren",
  "excel.spalte-markieren": "spalte-markieren",
  "excel.zeile-markieren": "zeile-markieren",
  "excel.zum-rand": "zum-rand",
  "excel.autosumme": "autosumme",
  "excel.ausfuellen-unten": "ausfuellen-unten",
  "excel.ausfuellen-rechts": "ausfuellen-rechts",
  "excel.absoluter-bezug": "absoluter-bezug",
  "excel.datum": "datum",
  "excel.uhrzeit": "uhrzeit",
  "excel.kommentar": "kommentar",
  "excel.autofilter": "autofilter",
  "excel.blattwechsel": "blattwechsel",
  "excel.neues-blatt": "neues-blatt",
  "browser.neu-laden": "neu-laden",
  "browser.suchen-auf-seite": "suchen",
  "browser.lesezeichen": "lesezeichen",
  "browser.verlauf-oeffnen": "verlauf",
  "outlook.senden": "senden",
  "outlook.loeschen": "nachricht-loeschen",

  // ── macOS ─────────────────────────────────────────────────────────────────
  "mac.grundlagen.kopieren": "kopieren",
  "mac.grundlagen.einfuegen": "einfuegen",
  "mac.grundlagen.ausschneiden": "ausschneiden",
  "mac.grundlagen.alles-markieren": "alles-markieren",
  "mac.grundlagen.rueckgaengig": "rueckgaengig",
  "mac.finder.kopieren": "kopieren",
  "mac.finder.einsetzen": "einfuegen",
  "mac.finder.duplizieren": "duplizieren",
  "mac.finder.uebersicht": "uebersicht",
  "mac.finder.oeffnen": "oeffnen",
  "mac.finder.uebergeordneter-ordner": "ebene-hoeher",
  "mac.finder.neuer-ordner": "neuer-ordner",
  "mac.finder.informationen": "eigenschaften",
  "mac.finder.bewegen": "bewegen",
  "mac.finder.in-den-papierkorb": "papierkorb",
  "mac.word.speichern": "speichern",
  "mac.word.fett": "fett",
  "mac.word.unterstrichen": "unterstreichen",
  "mac.word.kursiv": "kursiv",
  "mac.word.rueckgaengig": "rueckgaengig",
  "mac.word.wiederholen": "wiederherstellen",
  "mac.word.suchen": "suchen",
  "mac.word.ersetzen": "ersetzen",
  "mac.excel.zelle-bearbeiten": "zelle-bearbeiten",
  "mac.excel.ausfuellen-unten": "ausfuellen-unten",
  "mac.excel.gehe-zu": "gehe-zu-zelle",
  "mac.excel.blattwechsel": "blattwechsel",
  "mac.excel.datenblock": "zum-rand",
  "mac.excel.ausfuellen-rechts": "ausfuellen-rechts",
  "mac.excel.bezuege": "absoluter-bezug",
  "mac.excel.autosumme": "autosumme",
  "mac.excel.zellen-formatieren": "zelle-formatieren",
  "mac.browser.seite-durchsuchen": "suchen",
  "mac.browser.lesezeichen": "lesezeichen",
  "mac.browser.neu-laden": "neu-laden",
  "mac.browser.adressleiste": "adressleiste",
  "mac.outlook.senden": "senden",
};

/**
 * ★ Wege, die früher ein Kürzel waren (Wege-Umbau 01.10.2026): Ihre Taste wird weiter
 * erklärt („Tasten erkunden“ sagt bei Strg+H: Suchen und Ersetzen), obwohl der Lernschritt
 * jetzt eine Folge von Schritten lehrt. Eintrag = Lernschritt-id → der erste Griff des Wegs.
 * Sie stehen auch in `ATOM_WIRKUNG`; der Wächter (`computer-antwort-pruefer.test.ts`)
 * lässt Zuordnungen nur für Kürzel-Atome und für genau diese Liste zu.
 */
export const WEG_ERSTER_GRIFF: Readonly<Record<string, string>> = {
  "explorer.umbenennen": "F2",
  "word.ersetzen": "Strg+H",
};

/** Die Wirkung eines Kürzel-Atoms — oder `undefined`, wenn keine hinterlegt ist. */
export function wirkungFuer(atomId: string): WirkungErwartung | undefined {
  const id = ATOM_WIRKUNG[atomId];
  return id ? WIRKUNGEN[id] : undefined;
}
