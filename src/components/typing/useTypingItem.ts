/**
 * Tipp-Logik für EINE Übungszeile. Prinzip „erst richtig, dann weiter": Bei
 * einem Fehlanschlag rückt der Cursor NICHT vor — die richtige Taste muss
 * gefunden werden (baut korrektes Muskelgedächtnis auf, kein Schummeln; ideal
 * für blinde Lernende, die nicht eben zurückschauen können). Jeder Fehler wird
 * pro Position einmal gezählt. Groß-/Kleinschreibung ist relevant (übt Shift).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { activeLayout, layoutSprache } from "../../lib/typing/layouts";
import { kleinFuer } from "../../lib/typing/sprachRegister";
import type { Lang } from "../../lib/typing/account";
import {
  anschlagAus,
  deuteAnschlag,
  type OffeneTotaste,
} from "../../lib/typing/anschlagDeuten";
import type { EingabeVarianten } from "../../lib/typing/eingabeVarianten";
import { feststelltasteGewollt } from "../../lib/typing/feststelltasteGewollt";

export interface UseTypingItemArgs {
  expected: string;
  /**
   * ★ G2b-1 (02.10.2026, Türkisch T7): die Sprache der Zeile (Weg/Übung) für
   * die Auto-Großschreibung: türkisch gilt „ı" für „I" und „i" für „İ" (nicht
   * „i" für „I"). Fehlt sie, gilt die der eingestellten Tastatur, sonst
   * Deutsch (= `toLowerCase()`, wie bisher).
   */
  sprache?: Lang;
  active: boolean;
  onComplete: (errors: number) => void;
  onCorrect?: (ch: string, index: number) => void;
  /**
   * ★ E4 (25.09.2026, Bauplan §3.2, §14 E4 Punkt 5): der vierte Wert ist
   * `true`, wenn die FESTSTELLTASTE beim Fehlanschlag an war (nur auf
   * französischen Tastaturen geprüft - siehe `handleKey`). Gemessen
   * (BEFUND-2026-09-25-E1-TOTASTEN-WINDOWS.md §2): auf AZERTY (fr/be) gibt
   * die Feststelltaste bei „é è ç à" Ziffern statt Grossbuchstaben - ein
   * stummer Fehler ohne diesen Hinweis, weil die Gegenhand-Regel
   * (`correctShiftHeld`) hier nichts prüft (die Stelle braucht ja gar kein
   * Umschalt).
   */
  onWrong?: (expectedCh: string, typed: string, index: number, capsLockOn?: boolean) => void;
  /**
   * Auto-Großschreibung: Solange die Umschalttaste noch nicht gelernt ist, zählt
   * der kleine Buchstabe als richtig für den erwarteten GROSSEN — der große
   * erscheint trotzdem (die Schreibung bleibt korrekt). Ist die Umschalttaste
   * gelernt, muss der Großbuchstabe „echt" mit Umschalt getippt werden.
   */
  acceptLowerForUpper?: boolean;
  /**
   * Prüft bei Groß-/Sonderzeichen, ob die RICHTIGE (Gegenhand-)Umschalttaste
   * gehalten wurde. Liefert der Callback `false`, gilt der Anschlag als Fehler,
   * OBWOHL das erzeugte Zeichen stimmt — die falsche Umschalttaste oder die
   * Feststelltaste (Caps Lock) zählen also nicht. Für Zeichen ohne Umschalt gibt
   * er `true` zurück (nichts zu prüfen). Wird nur gesetzt, sobald die
   * Umschalttaste gelernt ist; davor greift stattdessen die Auto-Großschreibung.
   */
  correctShiftHeld?: (want: string) => boolean;
  /**
   * Die Nummer der Zeile in ihrer Runde. Eine NEUE Nummer setzt zurück, auch
   * wenn der Text derselbe ist - siehe den Rücksetz-Effekt unten.
   */
  zeile?: number;
  /**
   * ★ Zeilenende mit Enter (23.09.2026, Klassen-Einstellung
   * `TypingClass.zeilenEndeEnter`) - `true`: Die Zeile ist erst fertig, wenn
   * zusätzlich die Eingabetaste kommt; sie zählt dabei als EIN Zeichen der
   * Zeile (`"\n"`), wie jeder andere Anschlag - „erst richtig, dann weiter"
   * gilt dafür genauso (eine falsche Taste am Zeilenende ist ein Fehler an
   * dieser Position, Enter mitten in der Zeile ein gewöhnlicher Fehlanschlag).
   *
   * ⚠️ Der Wert wird BEIM RÜCKSETZEN DER ZEILE festgehalten (siehe den
   * Rücksetz-Effekt unten) - eine spätere Änderung der Klassen-Einstellung
   * springt so nicht mitten in einer laufenden Zeile um.
   */
  zeilenEnde?: boolean;
  /**
   * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8): eine Totaste
   * wurde gedrückt und wartet auf den nächsten Anschlag - KEIN Fehler, nichts
   * gewertet. `tot` ist das Akzentzeichen („^"), `null`, wenn das Modell der
   * Tastatur die Taste nicht kennt. Für die Ansage „Zirkumflex wartet" -
   * Windows selbst bleibt dabei stumm (gemessen: NVDA sagt nichts).
   */
  onTotaste?: (tot: string | null) => void;
  /**
   * Feststelltaste an, und das Kind hat einen BUCHSTABEN angeschlagen: kommt
   * bei jedem solchen Anschlag, auf jeder Tastatur (nicht nur bei einem Fehler).
   */
  onFeststelltaste?: () => void;
  /**
   * ★★★ W2a (28.09.2026, D-6): andere richtige Schreibweisen an derselben
   * Stelle - Weg „fr": das Leerzeichen vor `; : ! ?` und innen an `« »` mit
   * UND ohne, `"` für `« »` (`lib/typing/eingabeVarianten.ts`). Fehlt es,
   * gilt jedes Zeichen genau so, wie es im Text steht.
   */
  varianten?: EingabeVarianten;
  /**
   * Die Zeile wurde an die Schreibweise des Kindes angepasst (siehe
   * `varianten`) - gerufen VOR `onCorrect`, mit der ganzen neuen Zeile (ohne
   * das Zeilenende-„\n"), damit der Aufrufer im selben Anschlag schon mit ihr
   * rechnet (nächste Taste ansagen, Zeichen zählen).
   */
  onZeileAngepasst?: (zeile: string) => void;
}

export interface TypingItemState {
  index: number; // wie viele Zeichen schon richtig getippt
  /**
   * ★ W2a (D-6): die Zeile, wie sie JETZT dasteht - `expected`, oder die an die
   * Schreibweise des Kindes angepasste Fassung (siehe `varianten`). Schon im
   * ersten Render einer neuen Zeile richtig (nie die alte Anpassung).
   */
  zeile: string;
  errors: number; // Fehlanschläge (einmal je Position)
  done: boolean;
  wrongTick: number; // erhöht sich bei jedem Fehler (für rote Blink-Animation)
  handleKey: (e: React.KeyboardEvent | KeyboardEvent) => void;
  reset: () => void;
}

/**
 * Ein Großbuchstabe eines echten Buchstabens?
 *
 * ★ S3 (Mechanik-Prüfung fr, 26.09.2026): vorher nur `a–z, ä ö ü`. Auf Kanada
 * steht „É" als eigenes Zeichen im Text (keine Ersetzung wie auf Windows-
 * AZERTY) - vor der Umschalttaste galt es darum NICHT als Großbuchstabe, die
 * Auto-Großschreibung nahm das kleine „é" nicht an, und das Kind blieb an
 * „École" stehen, ohne die Umschalttaste gelernt zu haben. Deutsch/Englisch:
 * gemessen kein einziger anderer Großbuchstabe in Korpus und Serien.
 */
function isUpperLetter(ch: string, sprache: Lang): boolean {
  const lower = kleinFuer(ch, sprache);
  return ch !== lower && /\p{Ll}/u.test(lower);
}

export function useTypingItem({
  expected,
  sprache,
  active,
  onComplete,
  onCorrect,
  onWrong,
  acceptLowerForUpper = false,
  correctShiftHeld,
  zeile,
  zeilenEnde,
  onTotaste,
  onFeststelltaste,
  varianten,
  onZeileAngepasst,
}: UseTypingItemArgs): TypingItemState {
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [wrongTick, setWrongTick] = useState(0);

  // Refs sind die Quelle der Wahrheit (synchron); State nur fürs Rendern.
  const idxRef = useRef(0);
  const errRef = useRef(0);
  const doneRef = useRef(false);
  const erroredAt = useRef<Set<number>>(new Set());
  /**
   * ★ Zeilenende mit Enter: der je-Zeile festgehaltene Schalter (siehe
   * {@link UseTypingItemArgs.zeilenEnde}) - eine eigene Ref, nicht die
   * `idxRef`-Familie: sie wird nicht bei jedem `reset()` neu gesetzt, sondern
   * NUR im Rücksetz-Effekt unten (der die aktuelle Zeile bestimmt).
   */
  const zeilenEndeRef = useRef(false);
  /**
   * ★★★ W1 (27.09.2026): die gedrückte Totaste, deren Zeichen noch nicht
   * feststeht (`lib/typing/anschlagDeuten.ts`). Bis W1 stand hier
   * `totasteFehlgriffRef` (E4): eine Totaste, die das Modell an der Stelle
   * nicht erwartete, war SOFORT ein Fehlgriff und der nächste Anschlag wurde
   * verschluckt - auch wenn er das richtige Zeichen brachte (Windows „Ù" über
   * AltGr + 7, dann Umschalt + U: die Zeile war unlösbar). Jetzt entscheidet
   * erst das fertige Zeichen.
   */
  const offeneTotasteRef = useRef<OffeneTotaste | null>(null);
  /**
   * ★ W2a (D-6): die Zeile, gegen die JETZT verglichen wird - `expected`, bis
   * eine Variante sie anpasst. Die Ref ist die Wahrheit (synchron), der State
   * nur fürs Rendern; `quelle`/`nr` binden die Anpassung an IHRE Zeile, damit
   * der erste Render einer neuen Zeile nie die alte Anpassung zeigt.
   */
  const zeileRef = useRef(expected);
  const quelleRef = useRef(expected);
  quelleRef.current = expected;
  const [angepasst, setAngepasst] = useState<{ quelle: string; nr: number | undefined; text: string } | null>(null);

  const reset = useCallback(() => {
    idxRef.current = 0;
    errRef.current = 0;
    doneRef.current = false;
    erroredAt.current = new Set();
    offeneTotasteRef.current = null;
    zeileRef.current = quelleRef.current;
    setAngepasst(null);
    setIndex(0);
    setErrors(0);
    setDone(false);
    setWrongTick(0);
  }, []);

  /*
    Bei neuer Zeile zurücksetzen.

    ★★★ AN DER ZEILENNUMMER, NICHT NUR AM TEXT (11.09.2026, gefunden beim
    Nachstellen von Johannes' Klassenmatch-Befund „nicht alle Tasten erkannt").
    Bis dahin hing der Effekt nur an `expected`. Folgten zwei GLEICHE Zeilen
    aufeinander, änderte sich der Text nicht, der Effekt lief nicht, und
    `doneRef` blieb auf „fertig" stehen: Jede weitere Taste verschwand ohne Ton,
    für den Rest der Runde. `adaptiveRound` erzeugt so ein Paar selten, aber es
    erzeugt es (gemessen: eine Doppelzeile in 2520 Zeilen).
    Wächter: `tests/tastenflow-anschlaege-zeilenwechsel.test.tsx` (3).
  */
  useEffect(() => {
    /*
      ★ Zeilenende mit Enter (23.09.2026): HIER, im selben Rücksetz-Effekt,
      wird der Schalter für die ganze kommende Zeile festgehalten - nicht in
      einem eigenen Effekt an `zeilenEnde` (der liefe bei JEDER Änderung der
      Klassen-Einstellung erneut, auch mitten in einer laufenden Zeile - genau
      das soll nicht geschehen). `zeilenEnde` bewusst NICHT in den
      Abhängigkeiten: Sein Wert wird nur beim Zeilenwechsel gelesen.
    */
    zeilenEndeRef.current = !!zeilenEnde;
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expected, zeile, reset]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      /*
        ⚠️ HIER VERSCHWAND EIN ANSCHLAG STILL (Befund 11.09.2026, Johannes'
        Klasse im Klassenmatch: „nicht alle Tasten erkannt, öfter drücken").
        Kommt er zwischen „Zeile fertig" und „nächste Zeile bereit" - in der
        Zeilenpause der Session -, ist `doneRef` noch gesetzt: kein Ton, kein
        Zählen, nichts. Die Stelle bleibt so, denn der Hook weiss nicht, ob
        überhaupt eine nächste Zeile kommt. Mitgenommen werden solche Anschläge
        eine Ebene höher (`TypingSession`, `tasteAnnehmen`).
      */
      if (!active || doneRef.current) return;
      const key = e.key;
      /*
        ★ Zeilenende mit Enter: Die Eingabetaste zählt - nur wenn der Schalter
        für diese Zeile an ist - als EIN Zeichen der Zeile ("\n"), wie jeder
        andere Anschlag. Ausserhalb dieses Falls bleibt es bei „nur
        Einzelzeichen" (Shift, Tab, Pfeile … weiter ignoriert).
      */
      const eingabetaste = zeilenEndeRef.current && key === "Enter";

      let ziel = zeilenEndeRef.current ? zeileRef.current + "\n" : zeileRef.current;
      const cur = idxRef.current;
      if (cur >= ziel.length) return;
      let want = ziel[cur];

      /*
        ★ E4 (25.09.2026, Bauplan §3.2, §14 E4 Punkt 5): war die
        Feststelltaste GERADE JETZT an? Nur ausgelesen, nie gemerkt (anders
        als die offene Totaste) - jeder Anschlag bringt seinen eigenen,
        echten Modifikator-Zustand mit.
      */
      const capsLockOn =
        typeof e.getModifierState === "function" && e.getModifierState("CapsLock");
      // Jeder Buchstabe bei eingeschalteter Feststelltaste bekommt die Warnung -
      // ausser dem Grossbuchstaben, den sie auf dieser Tastatur richtig macht
      // (Schweiz: Ä Ö Ü).
      if (capsLockOn && /^\p{L}$/u.test(key) && !(key === want && feststelltasteGewollt(key))) {
        onFeststelltaste?.();
      }

      // Je Position höchstens EIN Fehler, egal woher er kommt (Totaste oder
      // gewöhnlicher Fehlanschlag) - dieselbe Zählung wie bisher unten.
      const registriereFehler = (eingegeben: string) => {
        if (!erroredAt.current.has(cur)) {
          erroredAt.current.add(cur);
          errRef.current += 1;
          setErrors(errRef.current);
        }
        setWrongTick((t) => t + 1);
        onWrong?.(want, eingegeben, cur, capsLockOn);
      };

      /*
        ★★★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2, §3.8):
        ANGENOMMEN WIRD, WAS ENTSTANDEN IST - AUF JEDER TASTATUR, JEDEM WEG.
        Der Anschlag wird gedeutet (`deuteAnschlag`), nicht gegen den Weg des
        Modells geprüft:
         · `Dead` ist nie ein Fehler, sondern ein Wartezustand - die Totaste
           wird gemerkt und (für Screenreader) angesagt (`onTotaste`).
         · Das danach gemeldete ZUSAMMENGESETZTE Zeichen („ê", „Ù") ist ein
           gewöhnliches Zeichen und wird unten verglichen - egal, ob das
           Modell diesen Weg kennt.
         · Nur der nackte zweite Buchstabe nach einer Totaste („p" - Windows
           schreibt „^p") und eine leere AltGr-Ebene (Belgien AltGr + 7:
           keydown „è", entstanden ist nichts) sind sicher falsch: EIN
           Fehlgriff.
        Bis W1 galt das nur auf den französischen/spanischen Tastaturen (E4)
        und dort mit umgekehrter Regel (Totaste sofort ein Fehler, wo das
        Modell keine erwartete); auf „de"/„en" wurde `Dead` still übergangen.
      */
      const { deutung, offen } = deuteAnschlag(anschlagAus(e), offeneTotasteRef.current, activeLayout());
      offeneTotasteRef.current = offen;

      if (deutung.art === "totaste") {
        e.preventDefault();
        onTotaste?.(deutung.tot);
        return;
      }
      if (deutung.art === "fehlgriff") {
        e.preventDefault();
        /*
          ★★★ G4-NAHT (25.10.2026, Falle 55): nach `'` oder `"` auf US-International (nur die Totasten der neun
          Gerüst-Sprachen, `durchschlag`) schreibt Windows BEIDE Zeichen („'s"). Steht genau diese Folge an dieser Stelle der
          Zeile („auto's"), ist sie richtig entstanden: beide Zeichen gelten. Die Umschalt-Regel prüft den zweiten Anschlag
          (den, der jetzt gedrückt ist); die Totaste davor ist vorbei. Auf allen anderen Wegen fehlt `durchschlag` - wie vorher.
        */
        const zwei = deutung.durchschlag;
        if (
          zwei !== undefined &&
          ziel.startsWith(zwei, cur) &&
          [...zwei].length === 2 &&
          (!correctShiftHeld || correctShiftHeld(ziel[cur + 1]))
        ) {
          idxRef.current = cur + 2;
          setIndex(cur + 2);
          onCorrect?.(ziel[cur], cur);
          onCorrect?.(ziel[cur + 1], cur + 1);
          if (idxRef.current >= ziel.length) {
            doneRef.current = true;
            setDone(true);
            onComplete(errRef.current);
          }
          return;
        }
        registriereFehler(deutung.eingabe);
        return;
      }
      if (deutung.art === "sondertaste" && !eingabetaste) return; // Umschalt, Tab, Pfeile … nicht gewertet
      e.preventDefault();

      const eingegeben = deutung.art === "zeichen" ? deutung.zeichen : "\n";

      // Auto-Großschreibung: kleiner Buchstabe genügt für den erwarteten großen,
      // solange die Umschalttaste noch nicht gelernt ist (der große erscheint
      // trotzdem, weil `want` großgeschrieben bleibt).
      const passt = (soll: string) =>
        eingegeben === soll ||
        (varianten?.gleichwertig(soll, eingegeben) ?? false) ||
        (acceptLowerForUpper && isUpperLetter(soll, sprache ?? layoutSprache()) && eingegeben === kleinFuer(soll, sprache ?? layoutSprache()));
      let matched = passt(want);

      /*
        ★★★ W2a (28.09.2026, D-6): eine andere richtige Schreibweise an dieser
        Stelle (Weg „fr": „Tu viens?" für „Tu viens ?", „Allo !" für
        „Allo!"). Die Zeile passt sich an - danach wird ganz gewöhnlich
        verglichen, mit allen Regeln unten (Umschalt, Zeilenende).
      */
      if (!matched && varianten && deutung.art === "zeichen" && cur < zeileRef.current.length) {
        const neu = varianten.anpassen(zeileRef.current, cur, eingegeben);
        if (neu !== null) {
          zeileRef.current = neu;
          setAngepasst({ quelle: expected, nr: zeile, text: neu });
          ziel = zeilenEndeRef.current ? neu + "\n" : neu;
          want = ziel[cur];
          matched = passt(want);
          onZeileAngepasst?.(neu);
        }
      }

      // Umschalt-Seiten-Regel: Groß-/Sonderzeichen zählen NUR als Treffer, wenn
      // die richtige (Gegenhand-)Umschalttaste gehalten wurde. Die falsche
      // Umschalttaste oder die Feststelltaste erzeugen zwar dasselbe Zeichen,
      // gelten hier aber als Fehlanschlag (kein „mit einer Hand beide Tasten").
      if (matched && correctShiftHeld && !correctShiftHeld(want)) {
        matched = false;
      }

      if (matched) {
        idxRef.current = cur + 1;
        setIndex(cur + 1);
        onCorrect?.(want, cur);
        if (idxRef.current >= ziel.length) {
          doneRef.current = true;
          setDone(true);
          onComplete(errRef.current);
        }
        return;
      }

      // Fehlanschlag — Position nicht vorrücken; je Position einmal zählen.
      // (Trifft auch Enter MITTEN in der Zeile: ein gewöhnlicher Fehlanschlag.)
      registriereFehler(eingegeben);
    },
    [
      active,
      expected,
      onComplete,
      onCorrect,
      onWrong,
      acceptLowerForUpper,
      correctShiftHeld,
      onTotaste,
      onFeststelltaste,
      varianten,
      onZeileAngepasst,
      zeile,
      sprache,
    ],
  );

  const zeileJetzt =
    angepasst && angepasst.quelle === expected && angepasst.nr === zeile ? angepasst.text : expected;

  return { index, zeile: zeileJetzt, errors, done, wrongTick, handleKey, reset };
}
