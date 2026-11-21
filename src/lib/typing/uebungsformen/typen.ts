/**
 * Die ÜBUNGSFORMEN - der Vertrag, gegen den jede einzelne Form gebaut wird.
 *
 * Herkunft: eine Mail von Testerin (Kollegin, dieselbe Zielgruppe) mit rund
 * sechzehn Übungsformen aus ihrem Unterricht, am 01.09.2026 mit Johannes
 * durchgesprochen. Was gebaut wird und was bewusst nicht, steht in
 * `AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md`.
 *
 * ★★★ Die zentrale Entscheidung (Johannes, 01.09.): **kein vierter Reiter.**
 * Die Formen werden über die ABSCHLUSS-KARTE angeboten - dieselbe Bauart wie
 * das Geschichten-Angebot (`StoryOffer`), nach jeder Runde in „Mein Training"
 * und nach jeder Lektion. „Ich möchte, dass wer nur mein Training macht, an
 * allem vorbei kommt." Wer immer den Hauptknopf drückt, bekommt reihum alles.
 *
 * ★★★ Die Regel, die für ALLE Formen gilt: **Die Grafik darf nie die Aufgabe
 * tragen.** Sie ist eine kostenlose Dreingabe für Sehende, solange die Aufgabe
 * streng Zeile für Zeile lösbar bleibt. Deshalb liefert eine Form ZEILEN wie
 * jede andere Runde; Schmuck (die gemauerte Pyramide) kommt getrennt daneben
 * und ist für die Sprachausgabe ausgeblendet.
 */
import type { RoundLine } from "../generator";
import type { Lang, Stufe } from "../account";
import type { BedienSprache } from "../../bedienSprache/sprache";
import type { TextTeil } from "./bedienung";
import type { Lernweg } from "../lernweg";
import type { EnglischVariante } from "../schreibweise";
import type { FranzVariante } from "../franzVariante";
import type { EsVariante } from "../esVariante";

/**
 * Die Kennungen aller Formen. Sie stehen im Spielstand (`formStand`) und
 * dürfen deshalb NIE umbenannt werden - sonst verliert ein Kind seine
 * Reihum-Zählung und bekommt Formen doppelt.
 */
export type UebungsformId =
  // Charge A
  | "alphabetreihen"
  | "pyramide"
  | "wandernder-gross"
  | "fingerdiktat"
  // Charge B
  | "buchstabensalat"
  | "lueckentext"
  | "handschwerpunkte"
  // Charge C (02.09.2026) - von Johannes aus den Vorschlaegen ausgewaehlt
  | "spiegelwoerter"
  | "zwillingsgriffe"
  | "zahlendiktat"
  | "wasfehlt"
  | "langersatz"
  | "korrekturlesen"
  // 23.10.2026 (Testerin Galgenmännchen-Idee, Johannes: nur das wird gebaut)
  | "iglu";

/**
 * Was eine Form beim Bauen weiß. Bewusst ein schmales Bündel: Wer mehr
 * braucht, braucht wahrscheinlich keine Übungsform, sondern eine Lektion.
 */
export interface FormKontext {
  /**
   * ★ E6a (24.09.2026, Bauplan §6.3): der LERNWEG des Kindes - Pflicht, kein
   * stiller Rückfall auf „de" (wie überall sonst seit E1/§2.3): sonst
   * übersieht man eine Stelle, an der ein Kind auf Weg „en" versehentlich in
   * der deutschen Reihenfolge oder mit deutschem Inhalt (Umlaute, ß,
   * Fremdwörter-Bonuspaare) geprüft wird. Der Aufrufer liest ihn aus
   * `lernwegVon(progress)` - siehe `useUebungsform.ts`/`Wortspiele.tsx`.
   */
  lernweg: Lernweg;
  /** Freigeschaltete Einheiten (`progress.introduced`) - Buchstaben, ⇧, Ziffern, Zeichen. */
  introduced: string[];
  /** Ist die Umschalttaste schon „echt" gelernt? */
  shift: boolean;
  /**
   * Kind mit dem Häkchen „Einhand schreiben": Die Umschalt-Gegenhand-Regel
   * gilt für dieses Kind NICHT. Formen, die genau diese Regel üben
   * (wandernder Großbuchstabe), taugen dann nicht oder nehmen jede
   * Umschalttaste an.
   */
  oneHand: boolean;
  stufe: Stufe;
  /** Die ÜBUNGSSPRACHE - Wörter, Sätze, Lösungen. */
  lang: Lang;
  /**
   * ★ E9 (24.09.2026, Bauplan §8.2): britisch oder amerikanisch - nur bei
   * `lang === "en"` von Bedeutung, optional (Vorgabe „gb"). Siehe
   * `CorpusQuery.variante`/`schreibweise.ts`.
   */
  variante?: EnglischVariante;
  /**
   * ★ E10a (25.09.2026, Bauplan §10.1/§8.1): die französische Landesvariante
   * - nur bei `lang === "fr"` von Bedeutung, optional (Vorgabe „fr-FR", wie
   * {@link franzVariante} selbst ohne aktive Probe). Lebt bisher NUR im
   * Zahlendiktat (`zahlwortFr`, Bauplan §8.1 „schönster Landesbezug des
   * Baus") - der Bezug der ECHTEN Kind-/Klassen-Variante aus
   * `franzVariante.ts` in die aufrufenden Bildschirme (`Wortspiele.tsx` u. a.)
   * ist ★ NOCH OFFEN, wie schon `variante` (Englisch) dort nicht gesetzt
   * wird; ohne sie gilt sicher „fr-FR", nie ein stiller Rückfall auf Deutsch.
   */
  franzVariante?: FranzVariante;
  /**
   * ★ ES-F7 (27.09.2026, Bauplan §1.2 S2): die spanische Landesvariante - nur
   * bei `lang === "es"` von Bedeutung, optional (Vorgabe „es-ES", wie
   * {@link esVariante} selbst ohne aktive Probe). Wie `franzVariante`: lebt
   * bisher NUR dort, wo ein Aufrufer sie ausdrücklich setzt - ohne sie gilt
   * sicher „es-ES", nie ein stiller Rückfall auf Deutsch/Englisch.
   */
  esVariante?: EsVariante;
  /**
   * ★ Die BEDIENUNGSSPRACHE (EN4, 18.09.2026) - Ankündigung und Rahmen einer
   * Frage. Fehlt sie, spricht die Bedienung die Übungssprache, genau wie vor
   * EN4 (ohne aktiven Sprachbereich, und in allen Wächtern). Gelesen wird sie nur
   * über `bedienSpracheVon` (`bedienung.ts`), dort steht die Begründung.
   */
  sprache?: BedienSprache;
  /** Wie viele Zeilen die Runde haben soll (Vorgabe der Rundenlänge). */
  count: number;
  /**
   * Zufall - hereingereicht, nicht importiert. Nur so kann ein Test eine
   * Form festnageln, ohne `Math.random` zu verbiegen.
   */
  zufall: () => number;
}

/**
 * Schmuck neben der Tippzeile. Sehende sehen ihn, die Sprachausgabe nicht
 * (`aria-hidden`) - und die Aufgabe bleibt ohne ihn vollständig lösbar.
 *
 * `pyramide`: die gemauerten Stufen, nach Pyramiden gruppiert. Aneinander-
 * gehängt ergibt `pyramiden` genau `zeilen.map((z) => z.text)` - daran hängt
 * der Bildschirm ab, in welcher Pyramide und auf welcher Stufe eine Zeile
 * steht. Fertige Stufen stehen klein darüber, die kommende als leerer Umriss
 * (Form ja, Buchstaben nein) - **niemand hat die Übersicht voraus, auch das
 * sehende Kind nicht.**
 */
export type FormSchmuck = { art: "pyramide"; pyramiden: string[][] };

/** Eine fertig gebaute Runde einer Übungsform. */
export interface FormRunde {
  /** Die Zeilen zum Tippen - genau wie bei jeder anderen Runde. */
  zeilen: RoundLine[];
  /** Optionaler Schmuck neben der Tippzeile. */
  schmuck?: FormSchmuck;
}

/**
 * EINE FRAGE mit ihren richtigen Antworten - die Bauart aller Formen, bei denen
 * das Kind nicht abschreibt, sondern antwortet.
 *
 * ★★★ Warum es diese zweite Bauart überhaupt gibt: Bei „Fingerdiktat" und
 * „Lückentext-Rätsel" DARF die Lösung nicht dastehen - sonst ist es Abschreiben
 * statt Können. Die gewohnte Tippzeile zeigt aber immer den zu tippenden Text.
 * Also braucht es einen eigenen Bildschirm, auf dem FRAGE und ANTWORT
 * auseinanderfallen. Drei Formen teilen ihn sich, statt drei Mal dasselbe zu
 * bauen.
 *
 * `antworten` sind alle Schreibweisen, die zählen - die erste ist die, die in
 * der Auflösung genannt wird.
 */
export interface RaetselAufgabe {
  /** Was angesagt und angezeigt wird - nie die Lösung. */
  frage: string;
  /**
   * ★ EN4: dieselbe Frage in TEILEN - Bedienung und Inhalt getrennt
   * (`bedienung.ts`). Aneinandergehängt ergeben sie genau `frage`. Der
   * Bildschirm braucht sie nur, wenn Bedienung und Übungssprache
   * verschieden sind; fehlen sie, gilt die ganze Frage als Bedienung.
   */
  frageTeile?: readonly TextTeil[];
  /** Alles, was als richtig gilt. Mindestens eine Antwort. */
  antworten: string[];
  /**
   * Was nach der richtigen Antwort gesagt wird, wenn mehr zu sagen ist als
   * „richtig" - beim Fingerdiktat etwa der Buchstabe, den das Kind gerade
   * gefunden hat.
   */
  aufloesung?: string;
  /** ★ EN4: die Auflösung in Teilen, wie `frageTeile`. */
  aufloesungTeile?: readonly TextTeil[];
}

/**
 * Eine Form, die auf der Abschluss-Karte angeboten werden kann.
 *
 * Zwei Bauarten:
 *  • **Zeilenform** (die Regel): `baue` liefert Zeilen, gelaufen wird in der
 *    gewohnten `TypingSession`. Nichts an der Eingabe ändert sich.
 *  • **Eigener Bildschirm** (`eigenerBildschirm`, die Ausnahme): Formen, die
 *    eine andere Interaktion brauchen - freies Eingeben (Buchstabensalat)
 *    oder reines Hören (Fingerdiktat). Sie liefern kein `baue`.
 */
export interface Uebungsform {
  id: UebungsformId;
  /**
   * Die ANKÜNDIGUNG auf dem Hauptknopf der Karte - „Jetzt kommen drei
   * Pyramidenwörter." Ein ganzer Satz, keine Überschrift: Für ein Kind mit
   * Blindheit ist dieser Satz die ganze Information über das, was kommt.
   *
   * ★ EN4: Er ist BEDIENUNG - geschrieben in `bedienSpracheVon(ctx)`.
   */
  ankuendigung: (ctx: FormKontext) => string;
  /**
   * Kurzname der Form („Pyramidenwörter").
   *
   * ★ Seit 02.09.2026 liest ihn auch ein KIND: Im Regal „Wortspiele" ist er
   * die Beschriftung des Knopfes. Dort wäre der Ankündigungssatz falsch (es
   * kommt nichts, bevor man sich etwas nimmt) - und bei Formen, die ihren
   * Schwerpunkt auswürfeln, wäre er sogar ein Versprechen, das die Runde
   * danach nicht halten muss. Der Name muss also für sich stehen und ohne
   * weiteren Satz verständlich sein.
   *
   * ★ EN4: Das ist der DEUTSCHE Name, aus `namen.ts`. Die Fassung der
   * Bedienungssprache liefert `formName(id, sprache)`.
   */
  name: string;
  /**
   * Taugt die Form mit diesem Tastenstand? Eine Form, die nicht taugt, wird
   * nicht angeboten und rutscht in der Reihum-Zählung auch nicht weiter -
   * sie kommt einfach dran, sobald sie taugt.
   */
  taugt: (ctx: FormKontext) => boolean;
  /** Zeilenform: baut die Runde. Fehlt bei Formen mit eigenem Bildschirm. */
  baue?: (ctx: FormKontext) => FormRunde | null;
  /**
   * Ausnahme: diese Form läuft nicht in der Tippzeile.
   *  • `raetsel` - Frage hören, Antwort tippen (Fingerdiktat, Lückentext).
   *    Dann liefert `frage` die Aufgaben.
   *  • `buchstabensalat` - freies Eingeben vieler Antworten auf EIN Wort.
   */
  eigenerBildschirm?: "raetsel" | "buchstabensalat" | "iglu";
  /** Nur bei `eigenerBildschirm: "raetsel"`: die Aufgaben dieser Runde. */
  fragen?: (ctx: FormKontext) => RaetselAufgabe[];
  /**
   * Zählt die Groß- und Kleinschreibung bei der Prüfung mit?
   *
   * ★★★ Johannes am 02.09.2026: *„Bei Lückentext achte auf die richtige
   * Großschreibung!"* - und das ist keine Strenge, sondern der Lehrgegenstand.
   * Wer „nase" schreibt, hat die Umschalttaste nicht bedient; in einem
   * Zehnfinger-Programm ist genau das die Übung.
   *
   * Warum es trotzdem eine EIGENSCHAFT der Form ist und keine feste Regel:
   * Beim FINGERDIKTAT ist die Antwort der Buchstabe, der auf einem Finger
   * liegt - nicht seine Schreibung. Dort wäre ein „K" statt „k" kein Fehler
   * im Sinne der Aufgabe, sondern ein zweiter, gar nicht gefragter
   * Tastendruck. Die Form weiss das, der Bildschirm nicht.
   *
   * Fehlt der Wert, bleibt es bei der alten Nachsicht (`false`).
   */
  grossKleinZaehlt?: boolean;
  /**
   * ★★★★ DIE EINGABE MITSPRECHEN (04.09.2026).
   *
   * Testerin am 03.09.2026 zum Fingerdiktat: *„hier wäre es schön, wenn die
   * Eingabe auch angesagt würde."*
   *
   * Im Trainer hört ein Kind jeden Anschlag; auf dem Rätsel-Bildschirm ist die
   * Antwort ein gewöhnliches Eingabefeld und blieb stumm. Beim Fingerdiktat ist
   * das mehr als Bequemlichkeit: Dort ist die Antwort EIN Zeichen, und ohne
   * Echo weiss ein Kind mit Blindheit nicht, ob im Feld steht, was es tippen
   * wollte.
   *
   * ⚠️ NUR wo es der Sache dient - im Lückentext wäre ein Buchstabe je Anschlag
   * Geplapper. Darum je Form gesetzt, nicht global.
   *
   * ⚠️ Gesprochen wird ausschliesslich mit der EIGENEN Stimme (`speakChar`
   * prüft den Vorlesen-Schalter). Wer einen Screenreader hat, bekommt das Echo
   * von ihm - dann sprächen zwei. Das ist dieselbe Regel wie überall:
   * Der Vorlesen-Schalter IST die Antwort auf die Frage nach dem Screenreader.
   */
  eingabeAnsagen?: boolean;
  /**
   * ★★★★★ KEIN „PRÜFEN"-KNOPF, SOBALD DIE ANTWORT SITZT (20.09.2026, Punkt 15
   * aus Testerin Durchgang).
   *
   * Johannes: *„Den 'Prüfen'-Button finde ich eigentlich auch zu viel. Enter
   * und gut oder ein Geräusch und direkt weiter oder wenn falsch, dann
   * wiederholen. Also gar nicht bestätigen."*
   *
   * `true` NUR bei Formen, deren Antwort EIN Zeichen ist (Fingerdiktat): Sobald
   * das eine Zeichen im Feld steht, gilt es - richtig geht es weiter, falsch
   * beginnt dieselbe Aufgabe erneut. Ein Bestätigen wäre hier ein Schalter zu
   * viel, den kein Wortspiel-Bildschirm sonst kennt.
   *
   * ⚠️ NICHT bei Formen, deren Antwort ein WORT oder ein SATZ ist (Lückentext,
   * „Was fehlt hier?", Korrekturlesen, Zahlendiktat): Dort würde die Antwort
   * sonst schon nach dem ERSTEN Buchstaben gewertet - der Rätsel-Bildschirm
   * (`RaetselLauf.tsx`) prüft darum nur bei diesem Merkmal automatisch, sonst
   * bleibt es beim Prüfen-Knopf/Enter wie bisher. Fehlt der Wert, bleibt es
   * beim alten Verhalten (`false`) - genau wie bei `grossKleinZaehlt`.
   */
  einzeichigeAntwort?: boolean;
}
