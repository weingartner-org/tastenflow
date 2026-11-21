/**
 * Übungsform „Lückentext-Rätsel".
 *
 * Herkunft: eine der Übungsformen aus Testerin Mail (Kollegin, dieselbe
 * Zielgruppe), am 01.09.2026 mit Johannes durchgesprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §3, Punkt 8): „Giraffen
 * haben einen langen …". Gibt dem Tippen einen Sinn - statt eine beliebige
 * Zeile abzuschreiben, tippt das Kind die Antwort auf eine echte Frage.
 *
 * ★★★ Warum die Lösung NIRGENDS stehen darf: Wäre sie sichtbar oder würde sie
 * vorgelesen, wäre die Aufgabe Abschreiben statt Können - genau die Falle, die
 * `RaetselAufgabe` in `typen.ts` für diese Bauart vorsieht (`frage` zeigt nie
 * die Antwort). Deshalb läuft diese Form über den Rätsel-Bildschirm: Der Satz
 * MIT Lücke wird gehört/gelesen, getippt wird nur das fehlende Wort. Nach der
 * richtigen Eingabe hört das Kind den vollständigen Satz (`aufloesung`) - so
 * bekommt es die Bestätigung als ganzen, sinnvollen Satz statt als bloßes
 * „richtig".
 *
 * Die Lücke steht als DREI EINZELNE PUNKTE `...`, nicht als eigenes
 * Auslassungszeichen (…) - Braillezeilen und Sprachausgaben behandeln beide
 * unterschiedlich, und drei Punkte werden zuverlässig gelesen.
 *
 * ★★ Getippt werden muss nur die LÖSUNG, nicht der Satz - deshalb prüft die
 * Auswahl unten jede Lösung einzeln gegen `fitText` (Tastenstand), während der
 * Satz selbst frei bleiben darf (er wird nur angesagt/angezeigt).
 *
 * ★ Bewusst vermieden: Wissen, das nur ein sehendes Kind hat. Wo eine Aufgabe
 * eine wahrnehmbare Eigenschaft braucht, ist es eine ERTASTETE oder
 * ERSCHMECKTE (Geschmack, Temperatur, Form, Klang) - nie eine reine
 * Sehfarbe, ausser sie steckt in einer feststehenden Wendung
 * („Schwarzes Brett").
 */
import { fitText } from "../corpus";
import { contentStufenFor, type InhaltsStufe, type Lang } from "../account";
import type { FormKontext, RaetselAufgabe, Uebungsform } from "./typen";
import { wandleSchreibweise } from "../schreibweise";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon, nurInhalt } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import { RAETSEL_FR } from "./lueckentextFr";
import { RAETSEL_ES } from "./lueckentextEs";
import { RAETSEL_IT } from "./lueckentextIt";
import { RAETSEL_PL } from "./lueckentextPl";
import { RAETSEL_CS } from "./lueckentextCs";
import { RAETSEL_TR } from "./lueckentextTr";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege haben je eine eigene, noch leere Datei (`lueckentext<Xx>.ts`).
import { RAETSEL_BG } from "./lueckentextBg";
import { RAETSEL_EL } from "./lueckentextEl";
import { RAETSEL_HU } from "./lueckentextHu";
import { RAETSEL_NL } from "./lueckentextNl";
import { RAETSEL_PT } from "./lueckentextPt";
import { RAETSEL_BR } from "./lueckentextBr";
import { RAETSEL_RO } from "./lueckentextRo";
import { RAETSEL_SV } from "./lueckentextSv";
import { RAETSEL_UK } from "./lueckentextUk";
import { eigenOderEn } from "../geruestRueckfall";
import type { Lernweg } from "../lernweg";

/** Ein einzelnes Lückentext-Rätsel - der Inhalt, nicht die Auswahl. */
export interface Raetsel {
  /** Der Satz MIT Lücke. Die Lücke steht als drei Punkte: ... */
  satz: string;
  /** Alles, was als Lösung zählt. Die erste ist die genannte. */
  loesungen: string[];
  /** Für welche Altersstufen der Inhalt taugt. */
  stufen: InhaltsStufe[];
}

/**
 * Deutsche Rätsel - acht Themen (Tiere, Natur, Alltag, Körper, Essen, Zeit,
 * Schule, Sprache), jedes einzeln daraufhin geprüft, dass die Lücke ohne Bild
 * und ohne Sonderwissen aus dem Satz heraus lösbar ist. Wo mehrere Antworten
 * gleich gut passen (z. B. „Telefon"/„Handy"), stehen beide in `loesungen" -
 * ein Rätsel mit nur einer von mehreren gleich guten Lösungen wäre eines
 * gegen das Kind.
 */
export const RAETSEL_DE: Raetsel[] = [
  // --- Tiere ---
  { satz: "Giraffen haben einen langen ...", loesungen: ["Hals"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Elefant hat einen langen ...", loesungen: ["Rüssel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Igel haben viele spitze ...", loesungen: ["Stacheln"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bienen machen aus Nektar den ...", loesungen: ["Honig"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Fische atmen unter Wasser mit ihren ...", loesungen: ["Kiemen"], stufen: ["teens", "erwachsen"] },
  { satz: "Der Hase hat lange ...", loesungen: ["Ohren"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Schnecke trägt ihr Haus auf dem ...", loesungen: ["Rücken"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Löwe gilt als König der ...", loesungen: ["Tiere"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eulen jagen nicht am Tag, sondern in der ...", loesungen: ["Nacht"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Pinguin kann nicht fliegen, aber sehr gut ...", loesungen: ["schwimmen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Spinne hat acht ...", loesungen: ["Beine"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Kühe geben uns ...", loesungen: ["Milch"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Schafe tragen ein Fell aus dicker ...", loesungen: ["Wolle"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Hund gilt als bester Freund des ...", loesungen: ["Menschen"], stufen: ["teens", "erwachsen"] },
  { satz: "Die Katze fängt gerne ...", loesungen: ["Mäuse"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Natur ---
  { satz: "Im Winter fällt kalter ...", loesungen: ["Schnee"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach dem Regen scheint oft wieder die ...", loesungen: ["Sonne"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bäume verlieren im Herbst ihre ...", loesungen: ["Blätter"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Blumen brauchen zum Wachsen Wasser und ...", loesungen: ["Sonne", "Licht"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Im Frühling wachsen die ersten ...", loesungen: ["Blumen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Baum hat Wurzeln, einen Stamm und ...", loesungen: ["Äste", "Blätter"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der höchste Berg der Welt heißt Mount ...", loesungen: ["Everest"], stufen: ["teens", "erwachsen"] },
  { satz: "Wind ist Luft, die sich ...", loesungen: ["bewegt"], stufen: ["teens", "erwachsen"] },
  { satz: "Vulkane spucken heiße ...", loesungen: ["Lava"], stufen: ["teens", "erwachsen"] },
  { satz: "Regenwürmer leben unter der ...", loesungen: ["Erde"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Alltag ---
  { satz: "Zum Zähneputzen braucht man eine ...", loesungen: ["Zahnbürste"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wenn es klingelt, öffnet man die ...", loesungen: ["Tür"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Im Kühlschrank bleiben Lebensmittel ...", loesungen: ["kalt", "frisch"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Schreiben braucht man einen ...", loesungen: ["Stift"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bevor man schlafen geht, putzt man sich die ...", loesungen: ["Zähne"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Am Morgen klingelt der ...", loesungen: ["Wecker"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wäsche wird sauber in der ...", loesungen: ["Waschmaschine"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer jemanden anrufen will, braucht ein ...", loesungen: ["Telefon", "Handy"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ohne Schlüssel kommt man nicht durch die ...", loesungen: ["Tür"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Körper ---
  { satz: "Zum Sehen braucht man die ...", loesungen: ["Augen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Hören braucht man die ...", loesungen: ["Ohren"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Riechen braucht man die ...", loesungen: ["Nase"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Schmecken braucht man die ...", loesungen: ["Zunge"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Im Mund sitzen die ...", loesungen: ["Zähne"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Das Herz pumpt das Blut durch den ganzen ...", loesungen: ["Körper"], stufen: ["teens", "erwachsen"] },
  { satz: "An jeder Hand hat man fünf ...", loesungen: ["Finger"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "An jedem Fuß hat man fünf ...", loesungen: ["Zehen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Laufen braucht man die ...", loesungen: ["Beine"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Essen ---
  { satz: "Aus Mehl und Wasser backt man ...", loesungen: ["Brot"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Honig schmeckt ...", loesungen: ["süß"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zitronen schmecken ...", loesungen: ["sauer"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Kartoffeln wachsen unter der ...", loesungen: ["Erde"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Aus Trauben macht man ...", loesungen: ["Wein", "Saft"], stufen: ["teens", "erwachsen"] },
  { satz: "Nudeln kocht man in heißem ...", loesungen: ["Wasser"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Chili schmeckt sehr ...", loesungen: ["scharf"], stufen: ["teens", "erwachsen"] },
  { satz: "Im Sommer isst man gern kaltes ...", loesungen: ["Eis"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eine Banane ist innen ...", loesungen: ["weich"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Süßen von Tee nimmt man oft ...", loesungen: ["Zucker", "Honig"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Zeit ---
  { satz: "Eine Woche hat sieben ...", loesungen: ["Tage"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Jahr hat zwölf ...", loesungen: ["Monate"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Tag hat vierundzwanzig ...", loesungen: ["Stunden"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eine Stunde hat sechzig ...", loesungen: ["Minuten"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach dem Winter kommt der ...", loesungen: ["Frühling"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach dem Sommer kommt der ...", loesungen: ["Herbst"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der erste Tag der Woche heißt ...", loesungen: ["Montag"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der letzte Tag der Woche heißt ...", loesungen: ["Sonntag"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Schule ---
  { satz: "In der Schule schreibt man mit einem ...", loesungen: ["Stift"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zahlen rechnet man im Fach ...", loesungen: ["Mathematik", "Mathe"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In der Pause geht man auf den ...", loesungen: ["Schulhof", "Pausenhof"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Am Ende des Schuljahres bekommt man ein ...", loesungen: ["Zeugnis"], stufen: ["teens", "erwachsen"] },
  { satz: "Bücher leiht man sich in der ...", loesungen: ["Bücherei", "Bibliothek"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer eine Schule leitet, ist der ...", loesungen: ["Direktor", "Rektor", "Schulleiter"], stufen: ["teens", "erwachsen"] },
  { satz: "In der ersten Stunde beginnt der ...", loesungen: ["Unterricht"], stufen: ["teens", "erwachsen"] },
  { satz: "Am Montag beginnt die neue ...", loesungen: ["Schulwoche", "Woche"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Sprache ---
  { satz: "Am Satzende steht meistens ein ...", loesungen: ["Punkt"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Am Ende einer Frage steht ein ...", loesungen: ["Fragezeichen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach einem Ausruf steht ein ...", loesungen: ["Ausrufezeichen"], stufen: ["teens", "erwachsen"] },
  { satz: "Namen schreibt man immer ...", loesungen: ["groß"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nomen schreibt man im Deutschen immer ...", loesungen: ["groß"], stufen: ["teens", "erwachsen"] },
  { satz: "Jeder deutsche Satz beginnt mit einem großen ...", loesungen: ["Buchstaben"], stufen: ["teens", "erwachsen"] },
  { satz: "Buchstaben zusammen ergeben ein ...", loesungen: ["Wort"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Viele Sätze zusammen ergeben einen ...", loesungen: ["Text", "Absatz"], stufen: ["teens", "erwachsen"] },

  // ══ Charge 2 (02.09.2026): auf Johannes' Auftrag verdoppelt ═══════════
  // ★ Die Großschreibung zählt seit heute mit (`grossKleinZaehlt`). Jede
  //   Lösung steht deshalb GENAU so da, wie sie geschrieben gehört: Nomen
  //   groß, Eigenschafts- und Tunwörter klein. Ein Tippfehler in dieser
  //   Datei wird ab jetzt zum Fehler des Kindes.

  // --- Tiere ---
  { satz: "Der Frosch lebt am liebsten im ...", loesungen: ["Wasser"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Am liebsten frisst der Hund einen ...", loesungen: ["Knochen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Biene sticht mit ihrem ...", loesungen: ["Stachel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Maulwurf gräbt seine Gänge unter der ...", loesungen: ["Erde"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Für seine Eier baut ein Vogel ein ...", loesungen: ["Nest"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Fledermaus schläft, wenn andere wach sind - also am ...", loesungen: ["Tag"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Pferd trägt an den Hufen ...", loesungen: ["Eisen"], stufen: ["teens", "erwachsen"] },
  { satz: "Bei Gefahr rollt sich der Igel zu einer ...", loesungen: ["Kugel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Schildkröte trägt einen harten ...", loesungen: ["Panzer"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Schwein wälzt sich gern im ...", loesungen: ["Schlamm"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eichhörnchen sammeln im Herbst ...", loesungen: ["Nüsse"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Viele Ameisen leben zusammen in einem ...", loesungen: ["Haufen"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Natur ---
  { satz: "Ein Fluss fließt am Ende ins ...", loesungen: ["Meer"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach dem Blitz hört man den ...", loesungen: ["Donner"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bei Kälte wird Wasser zu ...", loesungen: ["Eis"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Aus einem kleinen Samen wächst eine ...", loesungen: ["Pflanze"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Mond scheint in der ...", loesungen: ["Nacht"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Baum, der Nadeln trägt, heißt ...", loesungen: ["Nadelbaum"], stufen: ["teens", "erwachsen"] },
  { satz: "Zwischen den Fingern fühlt sich Sand ...", loesungen: ["körnig", "rau"], stufen: ["teens", "erwachsen"] },
  { satz: "Im Winter sind die Nächte besonders ...", loesungen: ["lang"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Berg ist viel höher als ein ...", loesungen: ["Hügel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Regen sammelt sich in einer ...", loesungen: ["Pfütze"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Alltag ---
  { satz: "Zum Schneiden nimmt man ein ...", loesungen: ["Messer"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Sitzen braucht man einen ...", loesungen: ["Stuhl"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Händewaschen dreht man auf den ...", loesungen: ["Wasserhahn"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wenn man friert, zieht man eine warme ...", loesungen: ["Jacke"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Brief kommt in einen ...", loesungen: ["Umschlag"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer einkauft, bezahlt an der ...", loesungen: ["Kasse"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Schmutzige Hände wäscht man mit ...", loesungen: ["Seife"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Öffnen der Tür braucht man einen ...", loesungen: ["Schlüssel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Post steckt der Bote in den ...", loesungen: ["Briefkasten"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer müde ist, geht ins ...", loesungen: ["Bett"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Körper ---
  { satz: "Zum Greifen braucht man die ...", loesungen: ["Hände"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Daumen ist der kürzeste ...", loesungen: ["Finger"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Gehen braucht man die ...", loesungen: ["Beine"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Das Herz schlägt in der ...", loesungen: ["Brust"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Beim Sport wird die Haut ...", loesungen: ["warm"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Man atmet durch die Nase ein und durch den ... aus.", loesungen: ["Mund"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Kopf sitzt auf dem ...", loesungen: ["Hals"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "An beiden Händen hat man zehn ...", loesungen: ["Finger"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Essen ---
  { satz: "Aus Milch macht man Butter und ...", loesungen: ["Käse"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Ei hat außen eine harte ...", loesungen: ["Schale"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Kartoffeln schält man vor dem ...", loesungen: ["Kochen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Salz schmeckt ...", loesungen: ["salzig"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Aus Äpfeln presst man ...", loesungen: ["Saft"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Brot wird gebacken im ...", loesungen: ["Ofen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Suppe isst man mit einem ...", loesungen: ["Löffel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eine Banane hat außen eine weiche ...", loesungen: ["Schale"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Zeit ---
  { satz: "Eine Minute hat sechzig ...", loesungen: ["Sekunden"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach dem Montag kommt der ...", loesungen: ["Dienstag"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der erste Monat im Jahr heißt ...", loesungen: ["Jänner", "Januar"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Nach dem Frühling kommt der ...", loesungen: ["Sommer"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wenn es dunkel wird, beginnt der ...", loesungen: ["Abend"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Der Tag vor heute war ...", loesungen: ["gestern"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ein Jahrhundert hat hundert ...", loesungen: ["Jahre"], stufen: ["teens", "erwachsen"] },

  // --- Schule ---
  { satz: "Wer zu spät kommt, verpasst den Anfang der ...", loesungen: ["Stunde"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zum Rechnen braucht man ...", loesungen: ["Zahlen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer eine Frage hat, hebt die ...", loesungen: ["Hand"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Hausaufgaben macht man nach der ...", loesungen: ["Schule"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Im Buch blättert man um zur nächsten ...", loesungen: ["Seite"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer gut zuhört, kann besser ...", loesungen: ["lernen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer etwas nicht versteht, stellt eine ...", loesungen: ["Frage"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Sprache ---
  { satz: "Ein Aussagesatz endet mit einem ...", loesungen: ["Punkt"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Zwischen zwei Wörtern steht ein ...", loesungen: ["Leerzeichen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eine Frage endet mit einem ...", loesungen: ["Fragezeichen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Den Satzanfang schreibt man immer ...", loesungen: ["groß"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Das Gegenteil von laut ist ...", loesungen: ["leise"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Das Gegenteil von schnell ist ...", loesungen: ["langsam"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Die Mehrzahl von Buch heißt ...", loesungen: ["Bücher"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Musik ---
  { satz: "Eine Gitarre hat sechs ...", loesungen: ["Saiten"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer singt, benutzt seine ...", loesungen: ["Stimme"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Auf einem Klavier drückt man die ...", loesungen: ["Tasten"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eine Trommel schlägt man mit den ...", loesungen: ["Händen"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Töne schreibt man mit ...", loesungen: ["Noten"], stufen: ["teens", "erwachsen"] },

  // --- Tastatur ---
  { satz: "Die längste Taste auf der Tastatur ist die ...", loesungen: ["Leertaste"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wer einen Buchstaben groß schreiben will, drückt die ...", loesungen: ["Umschalttaste"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Beim Zehnfingerschreiben liegen die Finger auf der ...", loesungen: ["Grundreihe"], stufen: ["kids", "teens", "erwachsen"] },
];

/**
 * Englische Rätsel - dieselben acht Themen, kleinere Auswahl. Ebenfalls ohne
 * Bild lösbar, keine Farbe ausser als feststehende Wendung.
 */
export const RAETSEL_EN: Raetsel[] = [
  // --- Animals ---
  { satz: "Giraffes have a very long ...", loesungen: ["neck"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Elephants have a long ...", loesungen: ["trunk"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bees make ...", loesungen: ["honey"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Fish breathe with their ...", loesungen: ["gills"], stufen: ["teens", "erwachsen"] },
  { satz: "Rabbits have long ...", loesungen: ["ears"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A spider has eight ...", loesungen: ["legs"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Cows give us ...", loesungen: ["milk"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Dogs are known as man's best ...", loesungen: ["friend"], stufen: ["teens", "erwachsen"] },

  // --- Nature ---
  { satz: "In winter, cold ... falls from the sky.", loesungen: ["snow"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Trees lose their ... in autumn.", loesungen: ["leaves"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Plants need water and ... to grow.", loesungen: ["light", "sun"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Everyday life ---
  { satz: "You clean your teeth with a ...", loesungen: ["brush"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "When someone knocks, you open the ...", loesungen: ["door"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In the morning, the alarm ... rings.", loesungen: ["clock"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You write with a ...", loesungen: ["pen", "pencil"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Body ---
  { satz: "You see with your ...", loesungen: ["eyes"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You hear with your ...", loesungen: ["ears"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You smell with your ...", loesungen: ["nose"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In your mouth you have ...", loesungen: ["teeth"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Food ---
  { satz: "Bread is made from flour and ...", loesungen: ["water"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Lemons taste ...", loesungen: ["sour"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Honey tastes ...", loesungen: ["sweet"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Potatoes grow under the ...", loesungen: ["ground", "earth"], stufen: ["teens", "erwachsen"] },

  // --- Time ---
  { satz: "A week has seven ...", loesungen: ["days"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A year has twelve ...", loesungen: ["months"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "An hour has sixty ...", loesungen: ["minutes"], stufen: ["kids", "teens", "erwachsen"] },

  // --- School ---
  { satz: "At school you write with a ...", loesungen: ["pen", "pencil"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You borrow books from the ...", loesungen: ["library"], stufen: ["teens", "erwachsen"] },

  // --- Language ---
  { satz: "A question ends with a question ...", loesungen: ["mark"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Letters together make a ...", loesungen: ["word"], stufen: ["kids", "teens", "erwachsen"] },

  // ══ Batch 2 (02.09.2026): brought up to the German level ══════════════
  // ★ Capitals count from today on (`grossKleinZaehlt`). Every answer is
  //   spelled exactly as it should be typed - lower case except for names
  //   of days and months.

  // --- Animals ---
  { satz: "Frogs like to live near the ...", loesungen: ["water"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A young dog is called a ...", loesungen: ["puppy"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bees live together in a ...", loesungen: ["hive"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Moles dig their tunnels under the ...", loesungen: ["ground"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Birds build a ... for their eggs.", loesungen: ["nest"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A tortoise carries a hard ...", loesungen: ["shell"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Squirrels collect ... in autumn.", loesungen: ["nuts"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A horse wears iron ... on its hooves.", loesungen: ["shoes"], stufen: ["teens", "erwachsen"] },
  { satz: "Cats have sharp ...", loesungen: ["claws"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Sheep give us ...", loesungen: ["wool"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Owls hunt at ...", loesungen: ["night"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A snake has no ...", loesungen: ["legs"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Penguins cannot fly, but they can ...", loesungen: ["swim"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Whales live in the ...", loesungen: ["sea", "ocean"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A baby cat is called a ...", loesungen: ["kitten"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bats sleep during the ...", loesungen: ["day"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Nature ---
  { satz: "A river flows into the ...", loesungen: ["sea"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "After lightning you hear ...", loesungen: ["thunder"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Water turns to ice when it gets ...", loesungen: ["cold"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The moon shines at ...", loesungen: ["night"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Rain collects in a ...", loesungen: ["puddle"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A mountain is much higher than a ...", loesungen: ["hill"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In summer the sand on the beach feels ...", loesungen: ["warm", "hot"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A seed grows into a ...", loesungen: ["plant"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Trees have roots, a trunk and ...", loesungen: ["branches"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In winter the nights are very ...", loesungen: ["long"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Wind is moving ...", loesungen: ["air"], stufen: ["teens", "erwachsen"] },
  { satz: "Volcanoes throw out hot ...", loesungen: ["lava"], stufen: ["teens", "erwachsen"] },
  { satz: "Earthworms live in the ...", loesungen: ["soil"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A forest is full of ...", loesungen: ["trees"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Everyday life ---
  { satz: "You cut bread with a ...", loesungen: ["knife"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You sit on a ...", loesungen: ["chair"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Water comes out of the ...", loesungen: ["tap"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "When you are cold you put on a ...", loesungen: ["coat", "jacket"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A letter goes into an ...", loesungen: ["envelope"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In a shop you pay at the ...", loesungen: ["till", "counter"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You wash your hands with ...", loesungen: ["soap"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You open a door with a ...", loesungen: ["key"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "When you are tired you go to ...", loesungen: ["bed"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Clothes get clean in the washing ...", loesungen: ["machine"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You dry your hands on a ...", loesungen: ["towel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You carry your books in a ...", loesungen: ["bag"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You keep milk cold in the ...", loesungen: ["fridge"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You sweep the floor with a ...", loesungen: ["broom"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A candle gives ...", loesungen: ["light"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You tell the time with a ...", loesungen: ["clock", "watch"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Body ---
  { satz: "You hold things with your ...", loesungen: ["hands"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You walk with your ...", loesungen: ["legs"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Your heart beats inside your ...", loesungen: ["chest"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You breathe in through your ...", loesungen: ["nose"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Your head sits on your ...", loesungen: ["neck"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "On both hands together you have ten ...", loesungen: ["fingers"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You have ten toes on your two ...", loesungen: ["feet"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Blood is pumped by your ...", loesungen: ["heart"], stufen: ["teens", "erwachsen"] },
  { satz: "You taste with your ...", loesungen: ["tongue"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bones are hard, but skin is ...", loesungen: ["soft"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "When you run fast your heart beats ...", loesungen: ["faster"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The thumb is the shortest ...", loesungen: ["finger"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Food ---
  { satz: "Milk is used to make butter and ...", loesungen: ["cheese"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "An egg has a hard ...", loesungen: ["shell"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You boil pasta in hot ...", loesungen: ["water"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Salt tastes ...", loesungen: ["salty"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Bread is baked in an ...", loesungen: ["oven"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You eat soup with a ...", loesungen: ["spoon"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Apples grow on ...", loesungen: ["trees"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Carrots grow under the ...", loesungen: ["ground"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Butter is made from ...", loesungen: ["milk", "cream"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Rice is cooked in ...", loesungen: ["water"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Sugar tastes ...", loesungen: ["sweet"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A banana has a soft ...", loesungen: ["skin", "peel"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Tea is made with hot ...", loesungen: ["water"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Chocolate is made from cocoa ...", loesungen: ["beans"], stufen: ["teens", "erwachsen"] },

  // --- Time ---
  { satz: "A minute has sixty ...", loesungen: ["seconds"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "After Monday comes ...", loesungen: ["Tuesday"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The first month of the year is ...", loesungen: ["January"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "After spring comes ...", loesungen: ["summer"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "When it gets dark, the ... begins.", loesungen: ["evening"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The day before today was ...", loesungen: ["yesterday"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A century has one hundred ...", loesungen: ["years"], stufen: ["teens", "erwachsen"] },
  { satz: "A day has twenty-four ...", loesungen: ["hours"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "There are four seasons in a ...", loesungen: ["year"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The last day of the week is ...", loesungen: ["Sunday"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Half an hour is thirty ...", loesungen: ["minutes"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A leap year has three hundred and sixty-six ...", loesungen: ["days"], stufen: ["teens", "erwachsen"] },

  // --- School ---
  { satz: "At break time you go out to the ...", loesungen: ["playground", "yard"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "To count you need ...", loesungen: ["numbers"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "If you have a question you raise your ...", loesungen: ["hand"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In a book you turn to the next ...", loesungen: ["page"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "At the end of the year you get a ...", loesungen: ["report"], stufen: ["teens", "erwachsen"] },
  { satz: "You do your homework after ...", loesungen: ["school"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "If you listen well you ... more.", loesungen: ["learn"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A teacher works in a ...", loesungen: ["school"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Twelve plus twelve is twenty-...", loesungen: ["four"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Ten times ten is one ...", loesungen: ["hundred"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Half of twenty is ...", loesungen: ["ten"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "If you are not sure, you ask a ...", loesungen: ["question"], stufen: ["kids", "teens", "erwachsen"] },

  // --- Language ---
  { satz: "A statement ends with a full ...", loesungen: ["stop"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Between two words there is a ...", loesungen: ["space"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A word we shout ends with an exclamation ...", loesungen: ["mark"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A sentence begins with a capital ...", loesungen: ["letter"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The opposite of loud is ...", loesungen: ["quiet"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The opposite of fast is ...", loesungen: ["slow"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The opposite of warm is ...", loesungen: ["cold"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The plural of child is ...", loesungen: ["children"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The plural of mouse is ...", loesungen: ["mice"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The past of go is ...", loesungen: ["went"], stufen: ["teens", "erwachsen"] },
  { satz: "The past of eat is ...", loesungen: ["ate"], stufen: ["teens", "erwachsen"] },
  { satz: "A word for a thing or a person is a ...", loesungen: ["noun"], stufen: ["teens", "erwachsen"] },

  // --- Music ---
  { satz: "A guitar has six ...", loesungen: ["strings"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "When you sing you use your ...", loesungen: ["voice"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "On a piano you press the ...", loesungen: ["keys"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "You beat a drum with your ...", loesungen: ["hands"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Music is written with ...", loesungen: ["notes"], stufen: ["teens", "erwachsen"] },
  { satz: "A group that sings together is a ...", loesungen: ["choir"], stufen: ["teens", "erwachsen"] },
  { satz: "A violin is played with a ...", loesungen: ["bow"], stufen: ["teens", "erwachsen"] },
  { satz: "Many musicians playing together are an ...", loesungen: ["orchestra"], stufen: ["teens", "erwachsen"] },

  // --- Keyboard ---
  { satz: "The longest key on the keyboard is the space ...", loesungen: ["bar"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "To type a capital letter you press ...", loesungen: ["shift"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "In touch typing your fingers rest on the home ...", loesungen: ["row"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A screen reader reads the screen out ...", loesungen: ["loud"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "A braille display shows every letter with ...", loesungen: ["dots"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "To delete the letter before the cursor you press ...", loesungen: ["backspace"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "The key that starts a new line is called ...", loesungen: ["enter", "return"], stufen: ["kids", "teens", "erwachsen"] },
  { satz: "Eight bits together make one ...", loesungen: ["byte"], stufen: ["teens", "erwachsen"] },
];

/** Ab so vielen tippbaren Rätseln taugt die Form mit diesem Tastenstand. */
const MINDEST_RAETSEL = 5;

/**
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): eine
 * Tabelle statt der Zwei-Wege-Ternäre (nur „en" oder sonst Deutsch) - die
 * Ternäre gab für „fr" still den deutschen Vorrat zurück. ★ E10b-2
 * (26.09.2026): „fr" hat jetzt eigenen, auf Französisch geschriebenen Inhalt
 * (eigene Datei `…Fr.ts`).
 */
// ★ ES-W (27.09.2026): „es" hat eigene Rätsel (`lueckentextEs.ts`).
const RAETSEL_JE_SPRACHE: Record<Lang, Raetsel[]> = {
  de: RAETSEL_DE,
  en: RAETSEL_EN,
  fr: RAETSEL_FR,
  es: RAETSEL_ES,
  // ★ IT-W (03.10.2026): „it" hat eigene Rätsel (`lueckentextIt.ts`) - vorher das Englische.
  it: RAETSEL_IT,
  // ★ PL-W (09.10.2026): „pl" hat eigene Rätsel (`lueckentextPl.ts`) - vorher das Englische.
  pl: RAETSEL_PL,
  // ★ TR-W (09.10.2026): „tr" hat eigene Rätsel (`lueckentextTr.ts`) - vorher das Englische.
  tr: RAETSEL_TR,
  // ★ CS-W (09.10.2026): „cs" hat eigene Rätsel (`lueckentextCs.ts`) - vorher das Englische.
  cs: RAETSEL_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`lueckentext<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(RAETSEL_BG, RAETSEL_EN),
  el: eigenOderEn(RAETSEL_EL, RAETSEL_EN),
  hu: eigenOderEn(RAETSEL_HU, RAETSEL_EN),
  nl: eigenOderEn(RAETSEL_NL, RAETSEL_EN),
  pt: eigenOderEn(RAETSEL_PT, RAETSEL_EN),
  br: eigenOderEn(RAETSEL_BR, RAETSEL_EN),
  ro: eigenOderEn(RAETSEL_RO, RAETSEL_EN),
  sv: eigenOderEn(RAETSEL_SV, RAETSEL_EN),
  uk: eigenOderEn(RAETSEL_UK, RAETSEL_EN),
};

function raetselQuelle(lang: Lang): Raetsel[] {
  return RAETSEL_JE_SPRACHE[lang];
}

/**
 * Die getippten Fassungen der Lösungen eines Rätsels, die mit `allowed`
 * tippbar sind - über `fitText`, wie überall sonst im Korpus. Reihenfolge wie
 * in `loesungen`, dedupliziert. Leer, wenn keine einzige Lösung passt.
 */
function tippbareAntworten(r: Raetsel, allowed: Set<string>, lernweg: Lernweg): string[] {
  const out: string[] = [];
  for (const l of r.loesungen) {
    // ★ ES-W (27.09.2026): mit dem Weg - auf „es" zählen Akzentbuchstaben
    // (Totaste ´), sobald Totaste und Grundbuchstabe gelernt sind. Für
    // „de"/„en" byte-gleich, für „fr" ebenso (keine Lösung mit ê/â/ï und
    // keine mit Bindestrich, Wächter wortspiele-fr).
    const fitted = fitText(l, allowed, lernweg);
    if (fitted !== null && !out.includes(fitted)) out.push(fitted);
  }
  return out;
}

/**
 * Rätsel, die zu Stufe und Sprache passen UND mindestens eine mit dem
 * aktuellen Tastenstand tippbare Lösung haben - mit genau diesen tippbaren
 * Antworten. Der SATZ selbst wird hier nicht gegen `allowed` geprüft: er wird
 * nur gelesen/angesagt, nicht getippt.
 */
export function lueckentextKandidaten(
  ctx: FormKontext,
): { raetsel: Raetsel; antworten: string[] }[] {
  const allowed = new Set(ctx.introduced);
  const etiketten = new Set(contentStufenFor(ctx.stufe));
  // ★ E10: Schreibweise VOR der Tastenprüfung - Satz und Lösungen kommen aus
  // derselben Fassung, sonst passt die Auflösung nicht mehr zum Satz.
  const varianteAn = ctx.lang === "en" && ctx.variante === "us";
  const out: { raetsel: Raetsel; antworten: string[] }[] = [];
  for (const roh of raetselQuelle(ctx.lang)) {
    if (!roh.stufen.some((s) => etiketten.has(s))) continue;
    const r: Raetsel = varianteAn
      ? {
          ...roh,
          satz: wandleSchreibweise(roh.satz, "us"),
          loesungen: roh.loesungen.map((l) => wandleSchreibweise(l, "us")),
        }
      : roh;
    const antworten = tippbareAntworten(r, allowed, ctx.lernweg);
    if (antworten.length === 0) continue;
    out.push({ raetsel: r, antworten });
  }
  return out;
}

function lueckentextTaugt(ctx: FormKontext): boolean {
  return lueckentextKandidaten(ctx).length >= MINDEST_RAETSEL;
}

/**
 * Der vollständige Satz mit eingesetzter Lösung - was ein Kind nach der
 * richtigen Eingabe als Bestätigung hört. Ersetzt die Lücke `...` durch die
 * Lösung; ein fehlender Satzschluss (Lücke stand am Satzende, also ohne
 * eigenen Punkt danach) wird ergänzt, ein vorhandener (Lücke stand mitten im
 * Satz, der Satz trägt seinen Punkt schon) bleibt unverändert.
 */
function baueAufloesung(satz: string, loesung: string): string {
  const eingesetzt = satz.replace("...", loesung);
  return /[.!?]$/.test(eingesetzt) ? eingesetzt : `${eingesetzt}.`;
}

/**
 * Baut die Rätsel-Aufgaben einer Runde: ungefähr `ctx.count` Stück, ohne
 * Wiederholung, gemischt über `ctx.zufall()` (Fisher-Yates, damit dieselbe
 * Zufallsfolge dieselbe Runde ergibt).
 */
export function lueckentextAufgaben(ctx: FormKontext): RaetselAufgabe[] {
  const kandidaten = lueckentextKandidaten(ctx);
  if (kandidaten.length === 0) return [];

  const gemischt = [...kandidaten];
  for (let i = gemischt.length - 1; i > 0; i--) {
    const j = Math.floor(ctx.zufall() * (i + 1));
    [gemischt[i], gemischt[j]] = [gemischt[j], gemischt[i]];
  }

  const anzahl = Math.min(ctx.count, gemischt.length);
  return gemischt.slice(0, anzahl).map(({ raetsel, antworten }) => {
    const aufloesung = baueAufloesung(raetsel.satz, antworten[0]);
    // ★ EN4: Satz und Auflösung sind ganz INHALT (Übungssprache) - in
    // englischer Bedienung mit deutscher Übungssprache stehen sie in
    // `lang="de"` und sprechen deutsch.
    return {
      frage: raetsel.satz,
      frageTeile: nurInhalt(raetsel.satz),
      antworten,
      aufloesung,
      aufloesungTeile: nurInhalt(aufloesung),
    };
  });
}

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: {
    ankuendigung: "Jetzt kommen Rätselsätze. Du hörst den Satz und tippst das fehlende Wort.",
  },
  en: {
    ankuendigung: "Now for some gap-fill puzzles. You'll hear a sentence - type the missing word.",
  },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: {
    ankuendigung: "Voici un texte à trous. Tu entends une phrase et tu tapes le mot qui manque.",
  },
  es: {
    ankuendigung: "Aquí tienes un texto con huecos. Oyes una frase y escribes la palabra que falta.",
  },
  it: {
    ankuendigung: "Ora tocca alle frasi da completare. Senti la frase e scrivi la parola che manca.",
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung: "Teraz kolej na: Uzupełnij zdania. Słyszysz zdanie i piszesz brakujące słowo.",
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: {
    ankuendigung: "Sırada: Cümleyi tamamla. Cümleyi duyarsın ve eksik kelimeyi yazarsın.",
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: {
    ankuendigung: "Teď: doplňovačka. Uslyšíš větu a napíšeš slovo, které chybí.",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: попълни пропуските. Чуваш изречение - напиши думата, която липсва.",
  },
  el: {
    ankuendigung: "Τώρα: συμπλήρωσε την πρόταση. Ακούς μια πρόταση - γράψε τη λέξη που λείπει.",
  },
  hu: {
    ankuendigung: "Most: szövegkiegészítés. Hallasz egy mondatot - írd be a hiányzó szót.",
  },
  nl: {
    ankuendigung: "Nu: invulzinnen. Je hoort een zin - typ het woord dat ontbreekt.",
  },
  pt: {
    ankuendigung: "Agora: frases para completar. Ouves uma frase - escreve a palavra que falta.",
  },
  br: {
    ankuendigung: "Agora: frases para completar. Você ouve uma frase - digite a palavra que falta.",
  },
  ro: {
    ankuendigung: "Acum: propoziții de completat. Auzi o propoziție - scrie cuvântul care lipsește.",
  },
  sv: {
    ankuendigung: "Nu: lucktext. Du hör en mening - skriv ordet som saknas.",
  },
  uk: {
    ankuendigung: "Далі: доповни речення. Ти чуєш речення - надрукуй слово, якого бракує.",
  },
});

export const lueckentext: Uebungsform = {
  id: "lueckentext",
  name: FORM_NAMEN.de.lueckentext,
  ankuendigung: (ctx) => TEXTE[bedienSpracheVon(ctx)].ankuendigung,
  taugt: lueckentextTaugt,
  eigenerBildschirm: "raetsel",
  // Die Umschalttaste ist hier Lehrgegenstand - siehe `grossKleinZaehlt`.
  grossKleinZaehlt: true,
  fragen: lueckentextAufgaben,
};
