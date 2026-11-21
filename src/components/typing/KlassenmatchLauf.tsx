/**
 * ★★★★★ DAS KLASSENMATCH, WÄHREND ES LÄUFT (F5 bis F7, F11 bis F14).
 *
 * Gebaut nach dem Muster von `SchreibprobeLauf` - mit drei Unterschieden, und
 * jeder davon ist der Auftrag:
 *
 *  1. **Jeder schreibt auf SEINEM Niveau** (F6). Der Text kommt aus
 *     `adaptiveRound` auf den eigenen `introduced` - Sarah schreibt Zahlen,
 *     Franz die Grundreihe. Die Challenge macht das Gegenteil (dort ist
 *     derselbe Text die Bedingung einer Prüfung); hier wäre er die Bedingung
 *     dafür, dass die Hälfte der Klasse nicht mitspielen kann.
 *  2. **Es zählt wie eine Übungsrunde** (F7) - mit EINER Ausnahme.
 *     `onTask` je fertiger Zeile (Übezeit, Wochenziel, Tage) UND `onLetters`
 *     in den Lernstand - und am Ende dieselbe Rundenend-REGEL wie „Mein
 *     Training" ({@link merkeMatchRundenende}). Ein Match kann also
 *     entscheiden, dass eine neue Taste fällig ist. Es schaltet sie aber
 *     NICHT frei: Es merkt sie nur vor (`progress.freischaltungAusMatch`).
 *     ★★★★★ Johannes, 02.10.2026: *„ein match darf eine neue taste für nach
 *     dem match freischalten aber nie während dem match! nach dem
 *     abschluss, wenn es wieder in mein training geht kommt die meldung der
 *     neuen taste!"* Befund Arda (Klasse CSS6): Das R kam am Match-Ende
 *     sofort in `introduced`, die Spiele danach (Pinguinspiel,
 *     Polarstation, Höhle) fragten es ab, und das Kind hatte es nie
 *     vorgestellt bekommen. Jetzt stellt „Mein Training" die Taste beim
 *     nächsten Einstieg vor - mit der gewöhnlichen Feier, einmalig
 *     (`loeseVormerkungEin`); bis dahin bleibt sie überall aus. Das
 *     ist der Unterschied zur Prüfung (die gar nichts entscheidet) UND zur
 *     Übungsrunde (die sofort freischaltet und feiert).
 *  3. **Unter dem Feld steht das Ranking statt der Tastatur** (F11,
 *     {@link TypingSessionProps.untenSlot}).
 *
 * ── ⚠️⚠️⚠️ WÄHREND DES TIPPENS GEHT NICHTS IN DIE LIVE-REGION ──────────────
 * Die Regel dieses Programms, an der NVDA-Quelle belegt: Jede Live-Meldung
 * verdrängt die Braillezeile vier Sekunden lang
 * ([[reference_live_region_ist_braille_blitzmeldung]]), und auf genau diese
 * Zeile schreibt das Kind gerade ab. Hier meldet darum NICHTS - kein
 * Platzwechsel, kein Countdown, keine Kugel, keine Uhr. Vier Wege bleiben, und
 * sie genügen:
 *  • **Fühlen:** der Vorspann `P2 3:45 ` links im Feld ({@link matchZeitstand}) -
 *    acht Zellen, immer gleich breit, ohne einen einzigen Tastendruck lesbar.
 *  • **Sehen:** Minutenleiste und „Platz 2 von 6" über dem Feld, beides
 *    `aria-hidden`.
 *  • **Hören:** zwei Ansagen, bei einer Minute und bei zehn Sekunden
 *    ({@link MATCH_ANSAGE_BEI_SEKUNDEN}) - über `speakUi`, das von sich aus
 *    schweigt, wenn das App-Vorlesen aus ist.
 *  • **Fragen:** Alt + X. Wer fragt, will eine Antwort - diese eine geht
 *    ausdrücklich AUCH in den Live-Bereich, wie die Restzeit in der Challenge
 *    (SchreibprobeLauf.tsx:455-471). Dieselbe Taste, dieselbe Bedeutung
 *    („wie steht es gerade?"), und sie wird nur eingehängt, solange das Match
 *    wirklich läuft.
 *
 * ── Der Text geht nie aus ───────────────────────────────────────────────────
 * Vorgelegt wird eine Charge von {@link MATCH_ZEILEN_JE_CHARGE} Zeilen (die
 * Zahl ist gemessen, siehe dort). {@link MATCH_NACHSCHUB_VORLAUF} Zeilen vor
 * ihrem Ende wird die nächste erzeugt und HINTEN ANGEHÄNGT - die Session bleibt
 * in ihrer Zeile (`zeilenAnhaengen`), die Zahlen laufen in den Refs hier
 * weiter, und das Kind schreibt einfach weiter. **Ein Match hält nicht an**,
 * weil ein Textvorrat zu Ende ist.
 *
 * ⚠️ Bis 11.09.2026 lief der Wechsel über das RUNDENENDE der Session: Die
 * Abschluss-Karte stand einen Takt lang da, der Belohnungsklang spielte, und
 * das Tippfeld fiel aus dem Baum - mit ihm der Fokus und jeder Anschlag dieser
 * Zeit (nachgestellt, `tests/tastenflow-anschlaege-zeilenwechsel.test.tsx`).
 *
 * ⚠️ Anders als die Tippchallenge, die ihren ganzen Vorrat auf einmal
 * bereitlegt ({@link VORRAT_ANSCHLAEGE_JE_MIN}): Ihre Texte sind FERTIG und
 * werden nur geladen; die Zeilen hier werden GERECHNET, und zwar je Kind
 * anders. Der ganze Vorrat auf einmal kostete Sekunden Rechenzeit.
 *
 * ── Der Textvorrat des Lehrgangs wird NICHT verbraucht ──────────────────────
 * `adaptiveRound` bekommt KEIN `seen`-Ledger (Vorgabe §2.6). Ein Spiel darf
 * dem Kind nicht die Zeilen wegnehmen, die es im Lehrgang noch nie gelesen hat
 * - sonst kostete jedes Match ein Stück Bücherei.
 */
import { htmlLang } from "./htmlLang";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MATCH_ANSAGE_BEI_SEKUNDEN,
  SHIFT_UNIT,
  adaptiveRound,
  currentLevel,
  emptyProgress,
  ensureIntroduced,
  focusPracticeField,
  matchApm,
  matchBrailleSatz,
  matchPlatzliste,
  matchRestGesprochen,
  matchZeitstand,
  masteryForLevel,
  mergeLetters,
  platzSatz,
  rangliste,
  rundenWert,
  serverJetzt,
  speakUi,
  useVoice,
  merkeMatchRundenende,
  zeichenabstandFaktor,
  type KeyEvent,
  type Lang,
  type Match,
  type MatchStand,
  type Stufe,
  type TaskEvent,
  type TempoLevel,
  type TypingAccount,
  type TypingProgress,
} from "@/lib/typing";
import { Modal } from "@/components/Modal";
import { KlassenmatchErgebnis } from "./KlassenmatchErgebnis";
import { KlassenmatchLobby } from "./KlassenmatchLobby";
import { KlassenmatchRanking } from "./KlassenmatchRanking";
import { MinutenLeiste } from "./MinutenLeiste";
import { TypingSession } from "./TypingSession";
import { wackeligeTastenAus } from "@/lib/typing/zeilenMessung";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
// ★ E1 (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt.
import { lernwegVon } from "@/lib/typing/lernweg";
import { franzVariante } from "@/lib/typing/franzVariante";
import { esVariante } from "@/lib/typing/esVariante";
import { wahlText } from "@/lib/typing/wahltaste";

/**
 * ★ Die Texte des Laufs in beiden Bedienungssprachen (EN5, 19.09.2026).
 * Deutsch wortgleich wie vorher, in TEILEN, wo das JSX mehrere Textknoten
 * erzeugte. Englisch nach dem Glossar §3.7: *Leave the Class Match?*, *The
 * others will keep typing.*, Weiterschreiben ⇒ *Keep typing*.
 * ⚠️ Die Zeilen des Matches sind INHALT in der Übungssprache (`lang`), nicht
 * Bedienung. Und der Vorspann `P2 3:45 ` links im Feld hat keine Wörter - er
 * bleibt in beiden Sprachen Zeichen für Zeichen gleich (Braillezeile).
 */
const LAUF_TEXTE = texte({
  de: {
    verlassenGesagt: "Du hast das Klassenmatch verlassen.",
    frage: "Willst du das Klassenmatch wirklich verlassen? Die anderen schreiben weiter.",
    frageTitel: "Klassenmatch verlassen?",
    weiterschreiben: "Weiterschreiben",
    verlassen: "Verlassen",
    escapeZeile: "Escape bringt dich zurück in die Zeile.",
    gleich: "Gleich geht es los …",
    titel: "Klassenmatch",
    kopfHinweis: (kuerzel: string) => [kuerzel, " sagt dir, wie es steht. Escape: Match verlassen."],
  },
  en: {
    verlassenGesagt: "You left the Class Match.",
    frage: "Do you really want to leave the Class Match? The others will keep typing.",
    frageTitel: "Leave the Class Match?",
    weiterschreiben: "Keep typing",
    verlassen: "Leave",
    escapeZeile: "Escape takes you back to your line.",
    gleich: "Starting in a moment …",
    titel: "Class Match",
    kopfHinweis: (kuerzel: string) => [
      kuerzel,
      " tells you how you're doing. Escape: leave the match.",
    ],
  },
  fr: {
    verlassenGesagt: "Tu as quitté le Match de la classe.",
    frage: "Veux-tu vraiment quitter le Match de la classe ? Les autres continuent d'écrire.",
    frageTitel: "Quitter le Match de la classe ?",
    weiterschreiben: "Continuer à écrire",
    verlassen: "Quitter",
    escapeZeile: "Échap te ramène à la ligne.",
    gleich: "Ça commence dans un instant …",
    titel: "Match de la classe",
    kopfHinweis: (kuerzel: string) => [kuerzel, " te dit où tu en es. Échap : quitter le match."],
  },
  es: {
    verlassenGesagt: "Has salido de la Competición de la clase.",
    frage: "¿De verdad quieres salir de la Competición de la clase? Las demás personas siguen escribiendo.",
    frageTitel: "¿Salir de la Competición de la clase?",
    weiterschreiben: "Seguir escribiendo",
    verlassen: "Salir",
    escapeZeile: "Esc te lleva de vuelta a la línea.",
    gleich: "Empieza enseguida …",
    titel: "Competición de la clase",
    kopfHinweis: (kuerzel: string) => [kuerzel, " te dice cómo vas. Esc: salir de la competición."],
  },
  it: {
    verlassenGesagt: "Hai lasciato la Gara di classe.",
    frage: "Vuoi davvero lasciare la Gara di classe? Le altre persone continuano a scrivere.",
    frageTitel: "Lasciare la Gara di classe?",
    weiterschreiben: "Continua a scrivere",
    verlassen: "Esci",
    escapeZeile: "Esc ti riporta alla riga.",
    gleich: "Si comincia subito...",
    titel: "Gara di classe",
    kopfHinweis: (kuerzel: string) => [kuerzel, " ti dice come stai andando. Esc: lasciare la gara."],
  },
  // ★ O-PL (02.10.2026): ty, ohne gegenderte Vergangenheit („Wyścig klasowy
  // opuszczony.", nicht „opuściłeś"); „Wyścigu" gebeugt ausgeschrieben.
  pl: {
    verlassenGesagt: "Wyścig klasowy opuszczony.",
    frage: "Czy na pewno chcesz opuścić Wyścig klasowy? Pozostałe osoby piszą dalej.",
    frageTitel: "Opuścić Wyścig klasowy?",
    weiterschreiben: "Pisz dalej",
    verlassen: "Wyjdź",
    escapeZeile: "Klawisz Esc przenosi cię z powrotem do wiersza.",
    gleich: "Zaraz się zaczyna...",
    titel: "Wyścig klasowy",
    kopfHinweis: (kuerzel: string) => [kuerzel, " mówi ci, jak ci idzie. Esc: wyjście z wyścigu."],
  },
  // ★ O-TR (02.10.2026): sen; Endungen nur am festen Wort ("Sınıf Maçından"),
  // nie am Kürzel (Glossar §1 Regel 6).
  tr: {
    verlassenGesagt: "Sınıf Maçından ayrıldın.",
    frage: "Sınıf Maçından gerçekten ayrılmak istiyor musun? Diğerleri yazmaya devam ediyor.",
    frageTitel: "Maçtan ayrılıyor musun?",
    weiterschreiben: "Yazmaya devam et",
    verlassen: "Ayrıl",
    escapeZeile: "Esc tuşu seni satıra geri götürür.",
    gleich: "Birazdan başlıyor...",
    titel: "Sınıf Maçı",
    kopfHinweis: (kuerzel: string) => [kuerzel, " kısayolu durumu söyler. Esc: maçtan ayrıl."],
  },
  // ★ O-CS (03.10.2026): ty ohne Vergangenheit („Třídní závod je pro tebe u
  // konce.", nicht „opustil/a jsi"); Kürzel mit Kopfwort „Klávesová zkratka".
  cs: {
    verlassenGesagt: "Třídní závod je pro tebe u konce.",
    frage: "Opravdu chceš Třídní závod opustit? Ostatní píšou dál.",
    frageTitel: "Opustit Třídní závod?",
    weiterschreiben: "Psát dál",
    verlassen: "Odejít",
    escapeZeile: "Klávesou Esc se vrátíš do řádku.",
    gleich: "Za chvíli to začne...",
    titel: "Třídní závod",
    kopfHinweis: (kuerzel: string) => ["Klávesová zkratka ", kuerzel, " ti řekne, jak to vypadá. Esc: opustit závod."],
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      verlassenGesagt: "Напусна състезанието в класа.",
      frage: "Наистина ли искаш да напуснеш състезанието? Другите продължават да пишат.",
      frageTitel: "Да напуснеш ли състезанието?",
      weiterschreiben: "Пиши нататък",
      verlassen: "Напусни",
      escapeZeile: "Esc те връща в реда.",
      gleich: "Започваме след малко …",
      titel: "Състезание в класа",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " ти казва как вървиш. Esc: напусни състезанието.",
      ],
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      verlassenGesagt: "Βγήκες από τον αγώνα τμήματος.",
      frage: "Θέλεις σίγουρα να βγεις από τον αγώνα τμήματος; Τα άλλα παιδιά συνεχίζουν να γράφουν.",
      frageTitel: "Έξοδος από τον αγώνα τμήματος;",
      weiterschreiben: "Συνέχεια γραφής",
      verlassen: "Έξοδος",
      escapeZeile: "Με το Esc επιστρέφεις στη γραμμή.",
      gleich: "Ξεκινάμε σε λίγο...",
      titel: "Αγώνας τμήματος",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " σου λέει πώς πας. Esc: έξοδος από τον αγώνα.",
      ],
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      verlassenGesagt: "Kiléptél az Osztályversenyből.",
      frage: "Biztosan kilépsz az Osztályversenyből? A többiek gépelnek tovább.",
      frageTitel: "Kilépsz az Osztályversenyből?",
      weiterschreiben: "Gépelés tovább",
      verlassen: "Kilépés",
      escapeZeile: "Az Esc billentyű visszavisz a sorodhoz.",
      gleich: "Mindjárt kezdődik…",
      titel: "Osztályverseny",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        ": megmondja, hogy állsz. Esc billentyű: kilépés a versenyből.",
      ],
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      verlassenGesagt: "Je hebt de klassenwedstrijd verlaten.",
      frage: "Wil je de klassenwedstrijd echt verlaten? De anderen typen verder.",
      frageTitel: "Klassenwedstrijd verlaten?",
      weiterschreiben: "Verder typen",
      verlassen: "Verlaten",
      escapeZeile: "Met Escape ga je terug naar je regel.",
      gleich: "Het begint zo …",
      titel: "Klassenwedstrijd",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " vertelt je hoe je ervoor staat. Escape: wedstrijd verlaten.",
      ],
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      verlassenGesagt: "Saíste da Corrida da turma.",
      frage: "Queres mesmo sair da Corrida da turma? As outras pessoas continuam a escrever.",
      frageTitel: "Sair da Corrida da turma?",
      weiterschreiben: "Continuar a escrever",
      verlassen: "Sair",
      escapeZeile: "Esc leva-te de volta à tua linha.",
      gleich: "Vai começar já...",
      titel: "Corrida da turma",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " diz-te como estás a ir. Esc: sair da corrida.",
      ],
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      verlassenGesagt: "Você saiu da Competição da turma.",
      frage: "Quer mesmo sair da Competição da turma? As outras pessoas continuam digitando.",
      frageTitel: "Sair da Competição da turma?",
      weiterschreiben: "Continuar digitando",
      verlassen: "Sair",
      escapeZeile: "Esc leva você de volta à linha.",
      gleich: "Já vai começar...",
      titel: "Competição da turma",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " diz como você está indo. Esc: sair da competição.",
      ],
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      verlassenGesagt: "Ai ieșit din Întrecerea clasei.",
      frage: "Sigur vrei să ieși din Întrecerea clasei? Ceilalți scriu mai departe.",
      frageTitel: "Ieși din Întrecerea clasei?",
      weiterschreiben: "Scrieți mai departe",
      verlassen: "Ieșiți",
      escapeZeile: "Tasta Esc te duce înapoi în rând.",
      gleich: "Începe imediat …",
      titel: "Întrecerea clasei",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " îți spune cum stai. Esc: ieși din întrecere.",
      ],
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      verlassenGesagt: "Du har lämnat Klasstävlingen.",
      frage: "Vill du verkligen lämna Klasstävlingen? De andra skriver vidare.",
      frageTitel: "Lämna Klasstävlingen?",
      weiterschreiben: "Skriv vidare",
      verlassen: "Lämna",
      escapeZeile: "Escape tar dig tillbaka till raden.",
      gleich: "Snart börjar det...",
      titel: "Klasstävlingen",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " berättar hur det går. Escape: lämna tävlingen.",
      ],
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      // „Ти вийшов" wäre gegendert (Glossar §2.5) - darum -но-Form.
      verlassenGesagt: "Вихід із Перегонів класу виконано.",
      frage: "Справді вийти з Перегонів класу? Інші друкують далі.",
      frageTitel: "Вийти з Перегонів класу?",
      weiterschreiben: "Друкувати далі",
      verlassen: "Вийти",
      escapeZeile: "Esc повертає в рядок.",
      gleich: "Зараз почнемо...",
      titel: "Перегони класу",
      kopfHinweis: (kuerzel: string) => [
        kuerzel,
        " повідомляє, як у тебе справи. Esc: вийти з Перегонів.",
      ],
    },
});

/**
 * Die Lektions-Kennung der Telemetrie.
 *
 * ⚠️ Sie darf NICHT mit `form:` beginnen - `istWortspiel()` in `account.ts`
 * erkennt Wortspiele daran und nimmt sie aus der Tempo-Rechnung heraus. Ein
 * Match ist eine Abschrift auf Zeit; sein Tempo soll zählen wie das einer
 * Übungsrunde. (Dieselbe Prüfung wie bei `schreibprobe`, 09.09.2026.)
 *
 * ★★★ SIE BLEIBT „klassenmatch" - ENTSCHIEDEN AM 11.09.2026 (Johannes/Fable),
 * nachdem der Prüfer gefragt hat, ob F10 („Lehrer wissen nicht, wer wie oft ein
 * Match macht") einen neutralen Wert verlangt. Zwei Gründe:
 *  1. **Ein Etikett, das lügt, wäre schlimmer.** Stünde „adaptiv" an einer
 *     Match-Runde, wäre jede Fehlersuche in den Ereignissen eine Suche nach
 *     etwas, das es laut Datenbank nicht gibt.
 *  2. Die beiden Match-Sammlungen sind vor Lehrkräften verschlossen, und
 *     **keine Oberfläche liest diese Kennung** (geprüft am 11.09.2026:
 *     `PupilStatsPanel`, `TastenflowReiter`, `PupilSelfStats`).
 *
 * ⚠️⚠️ **Und genau dabei muss es bleiben: Wer hier eine Auswertung anhängt,
 * baut die Statistik, die F10 ausschliesst.** Die Kennung ist zum Suchen eines
 * Fehlers da, nicht zum Zählen von Spielen.
 */
const KONTEXT_ID = "klassenmatch";

/** Alt + X - „wie steht es?". Begründung im Dateikopf. */
const STAND_TASTE = "KeyX";
const STAND_KUERZEL = "Alt + X";
/** Alt + P - „wer ist auf welchem Platz?" (Tester 13.11.2026). */
const PLATZLISTE_TASTE = "KeyP";

/**
 * Pause zwischen zwei Zeilen (ms) - wie in der Challenge gekürzt. Der Standard
 * von 550 ms deckt den Erfolgsklang ab; über fünf Minuten wären das bei einem
 * schnellen Kind eine halbe Minute, in der die Match-Uhr läuft und niemand
 * schreiben kann.
 */
const ZEILEN_PAUSE_MS = 220;

/**
 * ★★★ WIE VIELE ZEILEN AUF EINMAL ERZEUGT WERDEN - eine GEMESSENE Zahl.
 *
 * Der Vorrat der Tippchallenge ({@link VORRAT_ANSCHLAEGE_JE_MIN} = 800
 * Anschläge je Minute) wären über fünf Minuten 4000 Zeichen. Eine Übungszeile
 * trägt im Mittel **11,1 Zeichen** (gemessen am 11.09.2026 über
 * `adaptiveRound` mit 40 bis 200 Zeilen) - das wären rund 360 Zeilen.
 *
 * ⚠️ Und genau das ist zu teuer: Gemessen im selben Lauf kostet
 * `adaptiveRound` einen Grundpreis von etwa anderthalb Sekunden (der
 * Korpus-Index) und danach rund 35 ms je Zeile. 360 Zeilen sind also sechs bis
 * sieben Sekunden, in denen nichts anderes läuft. (Gemessen in jsdom unter
 * vitest, also im ungünstigsten Fall - im Browser ist es schneller. ⏳ Dort
 * nachzumessen steht aus.)
 *
 * 60 Zeilen sind rund 670 Zeichen. Ein Kind mit 150 Anschlägen je Minute
 * (das schnellste der Klasse MSWEIN am 10.09.2026) schreibt in fünf Minuten
 * 750 - es kommt also knapp ans Ende und bekommt dort nahtlos die nächste
 * Charge (siehe Dateikopf). **Die erste Charge entsteht während des
 * Countdowns**, also in den zehn Sekunden, in denen ohnehin nur gewartet wird.
 */
const MATCH_ZEILEN_JE_CHARGE = 60;

/**
 * ★ SO VIELE ZEILEN VOR DEM ENDE wird die nächste Charge angehängt (11.09.2026).
 *
 * Rechtzeitig genug, dass niemand je ans Ende kommt: Das schnellste Kind der
 * Klasse MSWEIN braucht für 20 Zeilen rund anderthalb Minuten. Und spät genug,
 * dass ein Kind, das nicht so weit kommt, keine zweite Charge umsonst rechnen
 * lässt.
 *
 * Gerechnet wird in einem eigenen Takt (`setTimeout`), nicht mitten in einem
 * Anschlag. Gemessen am 11.09.2026 in jsdom, NACH dem ersten Aufruf: 2 bis 6 ms
 * je Charge, sobald Texte zum Tastenstand passen; 180 bis 200 ms auf dem
 * Grundreihen-Stand (nur f/j, d/k). Ein Anschlag in dieser Zeit wartet, er geht
 * nicht verloren. Die teure Hälfte der Messung an
 * {@link MATCH_ZEILEN_JE_CHARGE} ist der ERSTE Aufruf (der Korpus-Index) - und
 * der fällt in den Countdown.
 */
const MATCH_NACHSCHUB_VORLAUF = 20;

export interface KlassenmatchLaufProps {
  match: Match;
  /** Die Stand-Zeilen des Matches, so wie sie vom Server kommen. */
  staende: readonly MatchStand[];
  account: TypingAccount;
  stufe: Stufe;
  lang: Lang;
  /** Der Lernstand - dieselben zwei Funktionen wie beim `AdaptiveTrainer`. */
  loadFn: () => Promise<TypingProgress>;
  saveFn: (p: TypingProgress) => void | Promise<void>;
  /** Übezeit, Wochenziel, Tage - je fertiger Zeile (F7). */
  onTask: (e: Omit<TaskEvent, "ts">) => void;
  /** Start-Anforderung der Lehrkraft (legt die Einstiegs-Leistungsstufe fest). */
  startTempo?: TempoLevel;
  /** false = „Einhand schreiben". */
  enforceShiftHand?: boolean;
  /** true = „Zeit lassen" - dann bewegt auch ein Match keine Leistungsstufe. */
  zeitLassen?: boolean;
  /** Den eigenen Stand melden (gedrosselt im Haken). */
  onStand: (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => void;
  /** Die letzte Meldung - und das Match schliessen. */
  onFertig: (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => void;
  /** „Weiter üben" nach dem Ergebnis. */
  onWeiter: () => void;
  /**
   * ★★★ „Verlassen" im Countdown oder mitten im Lauf - nach der Rückfrage
   * (Johannes 11.09.2026 abends: „esc mit fragefenster, willst du wirklich
   * abbrechen?"). Bekommt die BISHERIGEN Zahlen; das Match der anderen läuft
   * weiter. Gebaut in `useKlassenmatch.mittendrinVerlassen`.
   */
  onVerlassen: (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => void;
}

export function KlassenmatchLauf({
  match,
  staende,
  account,
  stufe,
  lang,
  loadFn,
  saveFn,
  onTask,
  startTempo,
  enforceShiftHand = true,
  zeitLassen = false,
  onStand,
  onFertig,
  onWeiter,
  onVerlassen,
}: KlassenmatchLaufProps) {
  const voiceEnabled = useVoice((s) => s.enabled);
  /*
    ★ EN5: Die Bedienungssprache. Was die BEDIENUNG spricht (Restzeit, Alt + X,
    Rückfrage), kommt in Tastenflow in dieser Sprache und mit ihrer Stimme -
    ohne aktiven Sprachbereich genau der Aufruf von vorher (`speakUi(text)`).
  */
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` (Muster aus E11a-2/-3) - LAUF_TEXTE und die Klassenmatch-Sätze
  // (`platzSatz`, `matchRestGesprochen`, `matchBrailleSatz`, `countdownAnsage`)
  // kennen „fr" bereits seit E11a.
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = LAUF_TEXTE[sprache];
  const sprachRef = useRef({ sprache, bereichAktiv });
  sprachRef.current = { sprache, bereichAktiv };
  const sagBedienung = useCallback((text: string) => {
    const b = sprachRef.current;
    if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
    else speakUi(text);
  }, []);
  const [progress, setProgress] = useState<TypingProgress>(() => emptyProgress());
  const [bereit, setBereit] = useState(false);
  /**
   * Die NACHGELEGTEN Zeilen hinter der ersten Charge - und die erste Charge, an
   * die sie gehängt wurden. Ändert sich die erste (Laden, Stufe, Sprache), gilt
   * der Nachschub nicht mehr (siehe `zeilen`).
   */
  const [nachschub, setNachschub] = useState<{ an: string[] | null; zeilen: string[] }>({
    an: null,
    zeilen: [],
  });
  const [jetzt, setJetzt] = useState(() => serverJetzt());
  const [stoppSignal, setStoppSignal] = useState(0);
  const [fertig, setFertig] = useState(false);
  /** Die Antwort auf Alt + X - der EINZIGE Text, der hier je live gemeldet wird. */
  const [nachfrage, setNachfrage] = useState("");
  /**
   * ★★★★★ DIE GEMESSENE WARTEZEIT AUFS VORLESEN - Johannes 14.09.2026:
   * *„überlegen gehört bestraft, aber zuhören von blinden nicht, solange die
   * sprache spricht und noch nicht getippt wird darf die zeit nicht zählen"*.
   *
   * Dieselbe Grösse, die `SchreibprobeLauf` schon von `TypingSession` bekommt
   * ({@link TypingSession.onZeilenWartezeit}) und von der Prüfungsuhr abzieht -
   * hier nur bisher nie eingehängt. Sie ist eine MESSUNG, keine Schätzung: Sie
   * wächst nur, wenn die Stimme wirklich gesprochen hat, während noch nichts
   * getippt war (`typingGapMs` in `voice.ts`) - wer währenddessen tippt (wie
   * Tester, der sehend mitliest), bekommt nichts abgezogen, und wer einfach
   * nur überlegt (keine Stimme, keine Wartezeit), verliert die Zeit wie bisher.
   * Genau die Unterscheidung, die Johannes wollte, macht die Session schon.
   *
   * Als `state` UND `ref`: der Ref ist die Quelle für `beenden` (dort ohne
   * Re-Render), das `state` löst den Re-Render aus, der `eigen.apm` und damit
   * `wert` und die Kugel-Position NEU rechnet - der sichtbare Sprung nach vorn,
   * den Johannes verlangt hat, ist damit kein Animationscode, sondern nur die
   * Folge einer korrekten Zahl (die Kugeln laufen ohnehin mit
   * `transition: left 600ms linear`, {@link KlassenmatchRanking}).
   */
  const [wartezeitMs, setWartezeitMs] = useState(0);
  /**
   * ★ F1c: Die Zeilenwechsel-Pausen (Zeit der App, `eineMessart.ts`) - wie die
   * Wartezeit als `state` UND `ref`. Sie gehen in {@link matchApm}, nicht an
   * den Server (dort gibt es kein Feld dafür).
   */
  const [zeilenwechselMs, setZeilenwechselMs] = useState(0);

  const summe = useRef({ zeichen: 0, fehler: 0, zeilen: 0 });
  const anschlaege = useRef<KeyEvent[]>([]);
  const wartezeitRef = useRef(0);
  const zeilenwechselRef = useRef(0);
  const abgeschlossen = useRef(false);
  const angesagt = useRef(new Set<number>());
  const pendel = useRef(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  /** Steht die Rückfrage „Klassenmatch verlassen?" offen? */
  const [frageOffen, setFrageOffen] = useState(false);
  /** Für Handler, die nur einmal angemeldet werden (Alt + X). */
  const frageOffenRef = useRef(false);
  frageOffenRef.current = frageOffen;
  /** „Verlassen" ist bestätigt - `beenden` schliesst dann OHNE Freischaltung ab. */
  const verlassenGewaehlt = useRef(false);
  const weiterschreibenRef = useRef<HTMLButtonElement>(null);

  // ── Den Lernstand holen ───────────────────────────────────────────────────
  useEffect(() => {
    let lebt = true;
    void loadFn()
      .then((p) => {
        if (!lebt) return;
        setProgress(p);
        setBereit(true);
      })
      .catch(() => {
        // Ohne Lernstand wird mit dem leeren gespielt - die Grundreihe. Ein
        // Ladefehler darf ein Kind nicht aus dem Match werfen; gespeichert wird
        // am Ende ohnehin nur, was wirklich da ist.
        if (lebt) setBereit(true);
      });
    return () => {
      lebt = false;
    };
  }, [loadFn]);

  /*
    ── Die Uhr ───────────────────────────────────────────────────────────────
    ★★★ SIE GEHT NACH DER SERVER-UHR ({@link serverJetzt}), nicht nach der des
    Geräts. `startMs` und `endeMs` kommen vom Server; ein Notebook, dessen Uhr
    fünf Sekunden vorgeht, hätte sonst einen Countdown von fünf statt zehn
    Sekunden und wäre fünf Sekunden vor der Klasse fertig (Befund des Prüfers,
    11.09.2026). Der Versatz wird aus der Antwort auf die eigene Stand-Zeile
    gemessen - ohne eine einzige zusätzliche Anfrage. Ohne Messung ist er 0,
    und dann rechnet hier alles wie vorher.
  */
  useEffect(() => {
    if (fertig) return;
    const t = window.setInterval(() => setJetzt(serverJetzt()), 500);
    return () => window.clearInterval(t);
  }, [fertig]);

  const dauerMs = Math.max(1, match.endeMs - match.startMs);
  const restMs = Math.max(0, match.endeMs - jetzt);
  const verstrichenMs = Math.max(0, Math.min(dauerMs, jetzt - match.startMs));
  const laeuft = jetzt >= match.startMs && restMs > 0 && !fertig;
  const imCountdown = jetzt < match.startMs;

  // ── Der Text: das EIGENE Niveau, ohne den Vorrat des Lehrgangs zu verbrauchen
  // ★ O-TR (02.10.2026): Weg "tr" hat keine Landesvariante wie fr/es - die
  // Weitergabe unten braucht keinen tr-Zweig, das gilt auch für tr.
  // ★ O-CS (03.10.2026): Weg "cs" hat ebenso keine Landesvariante - gilt auch für cs.
  const rechneCharge = useCallback(
    () =>
      adaptiveRound({
        introduced: ensureIntroduced(
          progressRef.current.introduced,
          lernwegVon(progressRef.current),
        ),
        stufe,
        lang,
        lernweg: lernwegVon(progressRef.current),
        // ★ E11a-5 (aus E10d): die französische Landesvariante, nur auf Weg „fr".
        ...(lernwegVon(progressRef.current) === "fr" ? { franzVariante: franzVariante() } : {}),
        // ★ ES-F7 (27.09.2026): dieselbe Weitergabe für Weg „es".
        ...(lernwegVon(progressRef.current) === "es" ? { esVariante: esVariante() } : {}),
        count: MATCH_ZEILEN_JE_CHARGE,
        // ★ KEIN `seen`-Ledger (§2.6) - ein Spiel darf dem Kind nicht die
        // Zeilen wegnehmen, die es im Lehrgang noch nie gelesen hat.
      }).map((z) => z.text),
    [stufe, lang],
  );
  const ersteCharge = useMemo(
    () => rechneCharge(),
    // ⚠️ `bereit` ist der Auslöser - `progress` bewusst NICHT: Er ändert sich
    // bei JEDER fertigen Zeile (die Anschläge wandern hinein), und eine neue
    // Zeilenliste setzte die Session auf ihre erste Zeile zurück.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rechneCharge, bereit],
  );
  /**
   * Erste Charge plus Nachschub. Jede Verlängerung ist eine NEUE Liste, die mit
   * der bisherigen beginnt - genau daran erkennt `TypingSession` mit
   * `zeilenAnhaengen` Nachschub statt einer neuen Runde.
   */
  const zeilen = useMemo(
    () =>
      nachschub.an === ersteCharge && nachschub.zeilen.length > 0
        ? [...ersteCharge, ...nachschub.zeilen]
        : ersteCharge,
    [ersteCharge, nachschub],
  );
  const zeilenRef = useRef(zeilen);
  zeilenRef.current = zeilen;
  const ersteChargeRef = useRef(ersteCharge);
  ersteChargeRef.current = ersteCharge;
  /** Für welche Zeilenliste schon Nachschub unterwegs ist - je Liste genau einmal. */
  const nachschubFuer = useRef<string[] | null>(null);

  /**
   * Die Session meldet jede neue Zeile. Stehen nur noch
   * {@link MATCH_NACHSCHUB_VORLAUF} Zeilen aus, wird die nächste Charge in einem
   * eigenen Takt gerechnet und angehängt.
   */
  const zeileErreicht = useCallback(
    (qi: number) => {
      const liste = zeilenRef.current;
      if (qi < liste.length - MATCH_NACHSCHUB_VORLAUF) return;
      if (nachschubFuer.current === liste) return;
      nachschubFuer.current = liste;
      const an = ersteChargeRef.current;
      window.setTimeout(() => {
        const neu = rechneCharge();
        setNachschub((n) =>
          n.an === an ? { an, zeilen: [...n.zeilen, ...neu] } : { an, zeilen: neu },
        );
      }, 0);
    },
    [rechneCharge],
  );

  const introduced = ensureIntroduced(progress.introduced, lernwegVon(progress));
  const unlocked = useMemo(() => new Set(introduced), [introduced.join("")]); // eslint-disable-line react-hooks/exhaustive-deps
  // Schritt M (19.09.2026): die wackligen Tasten beim Start - die Anschläge
  // des Matchs kommen erst am Ende in den Lernstand, sie bleiben also stehen.
  const wackelig = useMemo(
    // ★ D-5: Weg und Stufe des Kindes bestimmen die Schwelle.
    () => wackeligeTastenAus(progress.letters, introduced, { lernweg: lernwegVon(progress), stufe }),
    [progress.letters, introduced.join(""), progress.lernweg, stufe], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Der eigene Stand, LIVE ────────────────────────────────────────────────
  /*
    ★ Die eigene Zeile kommt nicht vom Server, sondern aus den Refs hier: Die
    Server-Zeile ist bis zu drei Sekunden alt (der Takt), und die eigene Kugel
    soll sich bewegen, wenn man schreibt - nicht mit drei Sekunden Verzug.

    Die Anschläge je Minute rechnet {@link matchApm} - auf die verstrichene
    Matchzeit MINUS der gemessenen {@link wartezeitMs}, fair zwischen
    Überlegen (zählt voll) und Zuhören (zählt nicht), solange die Ansage
    spricht und noch nichts getippt ist. Die ganze Begründung samt dem
    durchgerechneten Beispiel (Sarah gegen Tester) steht dort - eine Rechnung
    an EINER Stelle, nicht zweimal (siehe auch `beenden` unten).
  */
  const eigen = useMemo<MatchStand>(() => {
    const zeichen = summe.current.zeichen;
    const fehler = summe.current.fehler;
    const apm = matchApm({ zeichen, verstrichenMs, wartezeitMs, zeilenwechselMs });
    return {
      id: "eigen",
      matchId: match.id,
      classCode: match.classCode,
      pupilUid: account.id,
      name: account.name,
      status: fertig ? "fertig" : "schreibt",
      zeichen,
      fehler,
      apm,
      wert: 0,
      wartezeitMs,
      updatedMs: jetzt,
    };
  }, [
    verstrichenMs,
    wartezeitMs,
    zeilenwechselMs,
    jetzt,
    fertig,
    match.id,
    match.classCode,
    account.id,
    account.name,
  ]);

  /** Alle Stände - die eigene Zeile durch die frische ersetzt. */
  const alleStaende = useMemo(() => {
    const ohneMich = staende.filter((s) => s.pupilUid !== account.id);
    return [...ohneMich, eigen];
  }, [staende, eigen, account.id]);

  const liste = useMemo(() => rangliste(alleStaende), [alleStaende]);
  const meinPlatz = liste.find((e) => e.stand.pupilUid === account.id)?.platz ?? 1;

  // ── Den eigenen Stand melden (der Haken drosselt auf MATCH_TAKT_MS) ───────
  useEffect(() => {
    if (!laeuft) return;
    onStand({
      zeichen: eigen.zeichen,
      fehler: eigen.fehler,
      apm: eigen.apm,
      wert: liste.find((e) => e.stand.pupilUid === account.id)?.wert ?? 0,
      wartezeitMs: eigen.wartezeitMs,
    });
  }, [laeuft, eigen, liste, account.id, onStand]);

  // ── Ansagen: eine Minute, zehn Sekunden ───────────────────────────────────
  useEffect(() => {
    if (!laeuft) return;
    const restSek = Math.round(restMs / 1000);
    for (const schwelle of MATCH_ANSAGE_BEI_SEKUNDEN) {
      if (angesagt.current.has(schwelle) || restSek > schwelle) continue;
      angesagt.current.add(schwelle);
      sagBedienung(matchRestGesprochen(restMs, sprachRef.current.sprache));
    }
  }, [laeuft, restMs, sagBedienung]);

  /**
   * Eine Meldung in den Live-Bereich - NUR auf ausdrückliche Nachfrage.
   *
   * Der Wechsel zwischen `text` und `text + " "` ist derselbe Kniff wie in
   * `TypingSession`: Ein Live-Bereich meldet nur, was sich ÄNDERT. Zweimal
   * derselbe Stand hintereinander bliebe sonst stumm, und wer zweimal fragt,
   * hielte die Taste für kaputt.
   */
  const antworte = useCallback(
    (satz: string) => {
      pendel.current = !pendel.current;
      setNachfrage(pendel.current ? satz : `${satz} `);
      sagBedienung(satz);
    },
    [sagBedienung],
  );

  // ── Alt + X: „wie steht es gerade?" ───────────────────────────────────────
  const standRef = useRef({ platz: meinPlatz, anzahl: liste.length, restMs, liste });
  standRef.current = { platz: meinPlatz, anzahl: liste.length, restMs, liste };
  useEffect(() => {
    if (!laeuft) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      // ⚠️ `e.code`, NIE `e.key`: Am Mac erzeugt die Wahltaste ein
      // Sonderzeichen (aus Alt + X wird „≈"), der Buchstabenvergleich träfe
      // dort nie zu. Wächter: `tests/kuerzel-alt-t.test.tsx` §1.
      // ★ Alt + P (Tester 13.11.): die ganze Platzliste. Alt + Umschalt + P
      //   bleibt Melden - darum ohne Umschalt.
      const platzliste = e.code === PLATZLISTE_TASTE && !e.shiftKey;
      if (e.code !== STAND_TASTE && !platzliste) return;
      // Solange die Rückfrage offen ist, gehört die Tastatur ihr - eine
      // Live-Meldung hinter dem Fenster wäre eine Antwort ohne Frage.
      if (frageOffenRef.current) return;
      e.preventDefault();
      const s = standRef.current;
      antworte(
        platzliste
          ? matchPlatzliste(s.liste, sprachRef.current.sprache)
          : matchBrailleSatz(s.platz, s.anzahl, s.restMs, s.liste, sprachRef.current.sprache),
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [laeuft, antworte]);

  /**
   * ★★★ DAS RUNDENENDE - dieselbe Regel wie „Mein Training" (F7).
   *
   * Die Anschläge gehen in den Lernstand (`mergeLetters`), und danach fällt
   * die Entscheidung über eine neue Taste in {@link merkeMatchRundenende} -
   * dieselbe Regel (`advanceIntroduced`) wie in `wendeRundenendeAn` des
   * `AdaptiveTrainer`, aber NUR als Vormerkung (02.10.2026, Dateikopf Punkt
   * 2): Das Match schaltet nie selbst frei. Sterne,
   * Abzeichen, Erfahrungspunkte und das Tor vor der neuen Taste gibt es hier
   * bewusst nicht: Das Match ist ein Spiel, kein Lehrgangsschritt.
   *
   * ⚠️ Sie steht VOR dem Stopp-Effekt, der sie ruft - eine `const` weiter
   * unten wäre in seiner Abhängigkeitsliste noch nicht da.
   *
   * ⚠️⚠️⚠️ **EIN MATCH OHNE EINEN EINZIGEN ANSCHLAG IST KEINE RUNDE** (Befund
   * des Prüfers, 11.09.2026, im Browser gemessen): Bis dahin lief die
   * Rundenend-Regel hier bei JEDEM Zeitablauf - auch bei einem Kind, das
   * beigetreten ist und nichts geschrieben hat. Gemessen an einem frischen
   * Konto: `letters` leer, `rounds` 0, keine Ereignisse - und trotzdem war
   * danach die Einheit „d" freigeschaltet (`introducedAt.d` = das Match-Ende).
   * Der Grund liegt in `canAdvance`: Ohne einen einzigen Anschlag gibt es auch
   * nichts, was eine Freischaltung aufhalten könnte.
   *
   * F7 sagt „schaltet Tasten frei **wie eine normale Runde**" - und eine
   * normale Runde endet im `AdaptiveTrainer` erst, wenn sie GETIPPT wurde
   * (`onSessionDone`). Fünf Minuten Danebensitzen sind keine. Ohne Anschlag
   * bleibt der Lernstand darum unangetastet; das Spiel selbst endet wie immer.
   */
  const beenden = useCallback(
    (
      restZeile: {
        chars: number;
        errors: number;
        ms: number;
        letters: KeyEvent[];
        wartezeitMs?: number;
        zeilenwechselMs?: number;
      } | null,
    ) => {
      if (abgeschlossen.current) return;
      abgeschlossen.current = true;
      const s = summe.current;
      const zeichen = s.zeichen + (restZeile?.chars ?? 0);
      const fehlerZahl = s.fehler + (restZeile?.errors ?? 0);
      /*
        ★ F1c: Auch das Zuhören und die Zeilenwechsel-Pause der ANGEFANGENEN
        Zeile gehören in den Abzug - wer beim Abpfiff gerade der Zeilenansage
        zuhörte, verlor diese Zeit sonst auf der festen Uhr. In die Refs UND
        ins `state`, aus demselben Grund wie `summe` weiter unten: `eigen`
        rechnet auch auf dem Ergebnisbildschirm neu.
      */
      wartezeitRef.current += Math.max(0, restZeile?.wartezeitMs ?? 0);
      zeilenwechselRef.current += Math.max(0, restZeile?.zeilenwechselMs ?? 0);
      setWartezeitMs(wartezeitRef.current);
      setZeilenwechselMs(zeilenwechselRef.current);
      const alleAnschlaege = [...anschlaege.current, ...(restZeile?.letters ?? [])];
      if (alleAnschlaege.length > 0) {
        const cur = progressRef.current;
        const mitBuchstaben: TypingProgress = {
          ...cur,
          letters: mergeLetters(cur.letters, alleAnschlaege),
        };
        /*
          ★★★ WER MITTENDRIN VERLÄSST, SCHALTET NICHTS FREI (11.09.2026 abends).
          Die Anschläge gehören dem Kind und gehen in den Lernstand - die
          Entscheidung über eine neue Taste aber gehört zu einer RUNDE, und ein
          abgebrochenes Spiel ist keine. Die Übezeit ist ohnehin je Zeile
          gezählt (`onTask`).
        */
        let neu: TypingProgress = mitBuchstaben;
        if (!verlassenGewaehlt.current) {
          const m = masteryForLevel(currentLevel(mitBuchstaben, startTempo), zeitLassen);
          const frei = merkeMatchRundenende(
            mitBuchstaben,
            m,
            rundenWert(s.zeilen + (restZeile ? 1 : 0), verstrichenMs),
            Date.now(),
            lernwegVon(mitBuchstaben),
          );
          /*
            ★★★ KEIN `recordRound` - `progress.rounds` BLEIBT LEER. Entschieden
            am 11.09.2026 (Johannes/Fable) auf die Frage des Prüfers, warum die
            Übezeit zählt, die Runde aber nicht:

            Die Rundenliste ist die Grundlage der LEISTUNGSSTUFE (`currentLevel`)
            und der Sterne. Ein Fünf-Minuten-Wettlauf soll sie nicht kalibrieren:
            Im Match wird gerast, und aus einer gerasten Runde eine höhere
            Leistungsstufe abzuleiten hiesse, dem Kind hinterher im Lehrgang ein
            Tempo vorzuhalten, das es nur im Spiel hatte. Was ein Match bewirken
            darf, steht eine Zeile höher und ist die ganze Liste: Anschläge in den
            Lernstand, Übezeit über `onTask`, und die gewöhnliche Freischalt-Regel
            (seit 02.10.2026 als Vormerkung, siehe unten).
          */
          /*
            ★★★★★ DIE TASTE WIRD NUR VORGEMERKT (02.10.2026). `introduced` und
            `introducedAt` bleiben, wie sie waren - die Taste gehört dem Kind
            erst, wenn „Mein Training" sie ihm vorgestellt hat (Grund: Dateikopf,
            Punkt 2). Bis dahin kennt sie kein Spiel.
          */
          neu = {
            ...mitBuchstaben,
            freischaltungAusMatch: frei.freischaltungAusMatch,
            rundenOhneTaste: frei.rundenOhneTaste,
          };
        }
        setProgress(neu);
        void Promise.resolve(saveFn(neu)).catch(() => {
          // Nicht gespeichert heisst: Die Anschläge dieser fünf Minuten sind
          // weg. Das Ergebnis des Spiels steht trotzdem - es hängt nicht daran.
        });
      }
      // Derselbe Abzug wie in `eigen` oben ({@link matchApm}) - der Ref, nicht
      // das `state`: ein abschliessender Wert braucht keinen Re-Render mehr.
      const apm = matchApm({
        zeichen,
        verstrichenMs,
        wartezeitMs: wartezeitRef.current,
        zeilenwechselMs: zeilenwechselRef.current,
      });
      if (verlassenGewaehlt.current) {
        // Keine Platzierungsliste: Wer geht, geht zurück ins Üben. Der Fokus
        // wartet auf die Eingabezeile, die gleich wieder im Baum steht.
        onVerlassen({ zeichen, fehler: fehlerZahl, apm, wert: 0, wartezeitMs: wartezeitRef.current });
        focusPracticeField();
        sagBedienung(LAUF_TEXTE[sprachRef.current.sprache].verlassenGesagt);
        return;
      }
      /*
        ★★★★★ DIE ANGEFANGENE ZEILE GEHÖRT AUCH IN `summe.current` (Befund
        16.09.2026): `eigen` oben liest bei jedem Rendern - auch auf dem
        Ergebnisbildschirm - direkt aus diesem Ref, nicht aus den lokalen
        `zeichen`/`fehlerZahl`. Ohne diese Zeile bekam die Meldung an den
        Server (gleich unten, `onFertig`) die angefangene Zeile, die eigene
        Anzeige aber nicht - ein Kind konnte sich darum auf dem eigenen
        Bildschirm hinter jemandem sehen, der auf jedem ANDEREN Bildschirm
        hinter ihm lag.
      */
      s.zeichen = zeichen;
      s.fehler = fehlerZahl;
      setFertig(true);
      onFertig({ zeichen, fehler: fehlerZahl, apm, wert: 0, wartezeitMs: wartezeitRef.current });
    },
    [saveFn, startTempo, zeitLassen, verstrichenMs, onFertig, onVerlassen, sagBedienung],
  );

  // ── Schluss: Zeit um ──────────────────────────────────────────────────────
  /**
   * `stoppSignal` ist ein ZÄHLER (siehe TypingSession): Die ANGEFANGENE Zeile
   * wird gemeldet, statt beim Aushängen verloren zu gehen.
   */
  useEffect(() => {
    if (fertig || abgeschlossen.current) return;
    if (restMs > 0 || jetzt < match.startMs) return;
    /*
      ⚠️⚠️ **Steht gar keine Session im Baum, wird DIREKT beendet.** Das ist
      kein Randfall, sondern derselbe, der in der Tippchallenge erst der
      Rauchtest fand (SchreibprobeLauf.tsx:598-606): Wer die Seite öffnet,
      nachdem die Zeit um ist, hat noch keinen Lernstand geladen - das
      Stopp-Signal ginge an niemanden, und `TypingSession` merkt sich beim
      Einhängen den Zählerstand, den sie VORFINDET, meldet also auch später
      nichts mehr. Das Match liefe ewig weiter und käme nie zur Liste.
      Eine angefangene Zeile gibt es in diesem Fall ohnehin nicht.
    */
    if (!bereit) {
      beenden(null);
      return;
    }
    setStoppSignal((n) => n + 1);
  }, [restMs, jetzt, match.startMs, fertig, bereit, beenden]);

  // ── Verlassen mittendrin (11.09.2026 abends) ──────────────────────────────
  /*
    ★★★★★ Johannes: „wie kann ich das Match während einem durchgang abbrechen?
    esc mit fragefenster, willst du wirklich abbrechen?"

    Escape (und der Knopf „Verlassen") öffnet eine RÜCKFRAGE, kein sofortiges
    Ende. Der erste Knopf ist „Weiterschreiben" und hat den Fokus: Ein
    versehentliches Escape und danach Enter darf niemanden aus dem Spiel
    werfen, auf das die Klasse gewartet hat. Escape im Fenster heisst
    ebenfalls „Weiterschreiben". Die Uhr läuft dabei weiter - sie steht am
    Server, für alle gleich.

    ⚠️ Der seitenweite Escape-Weg (`zurueckInsProgramm`) läuft VOR diesem
    Handler (er hängt am Dokument, dieser am Fenster) und schickt die
    Eingabezeile einen Takt später an. Bis dahin steht das Fenster, und
    `TypingSession` holt den Fokus nicht, solange ein modaler Dialog offen ist
    (`modalOverlayOpen`). Im Fenster fängt `Modal` Escape im Capture ab - der
    Seiten-Weg sieht es dort gar nicht. Wächter: `typing-klassenmatch-lauf` (g).
  */
  const frageOeffnen = useCallback(() => {
    if (abgeschlossen.current) return;
    setFrageOffen(true);
    sagBedienung(LAUF_TEXTE[sprachRef.current.sprache].frage);
  }, [sagBedienung]);

  const weiterschreiben = useCallback(() => {
    setFrageOffen(false);
    focusPracticeField();
  }, []);

  /**
   * „Verlassen" bestätigt. Steht die Session im Baum, wird die ANGEFANGENE
   * Zeile über den bestehenden Stopp-Weg mitgenommen (`stoppSignal` →
   * `onStopp` → `beenden`); im Countdown gibt es keine, dann direkt.
   */
  const verlassenBestaetigt = useCallback(() => {
    if (abgeschlossen.current) return;
    setFrageOffen(false);
    verlassenGewaehlt.current = true;
    if (bereit && !imCountdown) setStoppSignal((n) => n + 1);
    else beenden(null);
  }, [bereit, imCountdown, beenden]);

  useEffect(() => {
    if (fertig || frageOffen || !(imCountdown || laeuft)) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      frageOeffnen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fertig, frageOffen, imCountdown, laeuft, frageOeffnen]);

  const verlassenFrage =
    frageOffen && !fertig ? (
      <Modal
        title={t.frageTitel}
        onClose={weiterschreiben}
        initialFocus={weiterschreibenRef}
      >
        <div className="space-y-3">
          <p className="m-0 text-ink">{t.frage}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              ref={weiterschreibenRef}
              className="btn-primary"
              onClick={weiterschreiben}
            >
              {t.weiterschreiben}
            </button>
            <button type="button" className="btn-secondary btn-umriss" onClick={verlassenBestaetigt}>
              {t.verlassen}
            </button>
          </div>
          <p className="m-0 text-base text-ink">{t.escapeZeile}</p>
        </div>
      </Modal>
    ) : null;

  // ── Was gezeigt wird ──────────────────────────────────────────────────────

  if (imCountdown) {
    return (
      <>
        <KlassenmatchLobby
          match={match}
          staende={staende}
          binGastgeber={match.hostUid === account.id}
          imCountdown
          restMs={Math.max(0, match.startMs - jetzt)}
          kannStarten={false}
          onStarten={() => {}}
          // Im Countdown heisst der Knopf „Verlassen" und fragt nach.
          onAbbrechen={frageOeffnen}
        />
        {verlassenFrage}
      </>
    );
  }

  /**
   * Der Live-Bereich für die eine ausdrückliche Nachfrage. Er steht in JEDER
   * Phase im Baum: Ein Live-Bereich, der erst mit seiner ersten Meldung
   * entsteht, verschluckt genau diese Meldung.
   */
  const nachfrageBereich = (
    // `data-match-live`: Der Wächter `typing-klassenmatch-lauf.test.tsx` prüft
    // an dieser Marke, dass hier beim TIPPEN nichts steht. Ohne sie müsste er
    // die Live-Bereiche von `TypingSession` mitzählen - und die sind erlaubt
    // (Buchstabieren, Finger-Ansage; TypingSession.tsx:965-1032).
    <div data-match-live className="sr-only" role="status" aria-live="assertive">
      {nachfrage}
    </div>
  );

  if (fertig) {
    return (
      <>
        {nachfrageBereich}
        <KlassenmatchErgebnis
          liste={liste}
          eigeneUid={account.id}
          neueTasteWartet={!!progress.freischaltungAusMatch}
          onWeiter={() => {
            onWeiter();
            focusPracticeField();
          }}
        />
      </>
    );
  }

  if (!bereit) {
    return (
      <div
        className="card mx-auto w-full max-w-prose p-5"
        lang={htmlLang(sprache)}
      >
        <p className="m-0 text-lg text-ink">{t.gleich}</p>
        {verlassenFrage}
      </div>
    );
  }

  const kopf = (
    <div
      className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl bg-surface-sunken px-4 py-2"
      lang={htmlLang(sprache)}
    >
      <p className="m-0 text-lg font-bold tracking-wide text-ink">
        <span aria-hidden="true">⚔️ </span>
        {t.titel}
      </p>
      {/* ★ Der eigene Rang - `aria-hidden` wie die Minutenleiste (F12). Er
          ändert sich im Sekundentakt; gemeldet wird er nie, gefragt werden
          kann nach ihm mit Alt + X. Auf der Braillezeile steht er ohnehin
          links im Feld (`matchZeitstand`). */}
      <p aria-hidden className="m-0 text-lg font-semibold text-ink">
        {platzSatz(meinPlatz, liste.length, sprache)}
      </p>
      <p className="m-0 text-base text-ink">{t.kopfHinweis(wahlText(STAND_KUERZEL, sprache))}</p>
      {/* ★ Sichtbar, weil nicht jeder Escape kennt - und am Tablet gibt es sie
          nicht. Ein gewöhnlicher Knopf: Er holt sich den Fokus nicht, beim
          Tippen bleibt er in der Zeile. Er öffnet dieselbe Rückfrage. */}
      <button type="button" className="btn-secondary btn-toggle text-base" onClick={frageOeffnen}>
        {t.verlassen}
      </button>
      {/* Die Rückfrage (Portal an <body>) - hier, weil der Kopf nur im Lauf steht. */}
      {verlassenFrage}
    </div>
  );

  return (
    <>
      {nachfrageBereich}
      <TypingSession
        items={zeilen}
        contextId={KONTEXT_ID}
        unlocked={unlocked}
        shiftLearned={introduced.includes(SHIFT_UNIT)}
        enforceShiftHand={enforceShiftHand}
        zeichenabstand={zeichenabstandFaktor(account.zeichenabstand)}
        // ★ Zeilenende mit Enter (23.09.2026) - Klassenmatch bekommt die
        // Pflicht der Klasse ausdrücklich mit (Bauplan), siehe
        // TypingClass.zeilenEndeEnter.
        zeilenEnde={!!account.zeilenEndeEnter}
        stufe={stufe}
        lang={lang}
        lernweg={lernwegVon(progress)}
        voiceEnabled={voiceEnabled}
        // Kein `speedTarget`: In einem Match gibt es keine Sterne - der Platz
        // ist die Rückmeldung. Und kein `hinweis` - ein Spiel unterrichtet nicht.
        zeilenPauseMs={ZEILEN_PAUSE_MS}
        // ★ Wie in der Tippchallenge (Johannes 10.09.2026): Wer tippt, während
        // die Stimme noch spricht, bekommt dafür keine Wartezeit angerechnet -
        // ohne das wäre Mustafas Mitlesen-und-Tippen schlechter gestellt als
        // Abwarten.
        satzAusreden
        /*
          ★★★ DER VORSPANN AUF DER BRAILLEZEILE (F14, §6 Frage 4):
          `P2 3:45 ` - acht Zellen, immer. Er steht im Eingabefeld VOR der
          Zeile und damit links vom Text: Ein Kind mit Blindheit liest Platz
          und Restzeit mit dem Finger, ohne eine Taste zu drücken und ohne dass
          eine Meldung die Zeile verdrängt.
        */
        zeilenPraefix={matchZeitstand(meinPlatz, restMs)}
        onItemDone={(e) => {
          summe.current.zeichen += e.chars;
          summe.current.fehler += e.errors;
          summe.current.zeilen += 1;
          // Übezeit-Uhr, Wochenziel, Tage: geschrieben wurde wirklich (F7).
          onTask(e);
        }}
        wackeligeTasten={wackelig}
        onLetters={(events) => {
          // ★ Die Anschläge gehen in den Lernstand - anders als bei der
          // Prüfung. Verbucht werden sie am Ende in EINEM Schreibvorgang
          // (siehe `beenden`); fünf Minuten lang je Zeile zu speichern wäre
          // bei 30 Kindern derselben Klasse die falsche Last.
          anschlaege.current.push(...events);
        }}
        // ★★★★★ Die gemessene Wartezeit aufs Vorlesen - siehe den Kommentar
        // bei `eigen` oben. Derselbe Weg wie in der Tippchallenge
        // (SchreibprobeLauf.tsx), hier zum ersten Mal eingehängt.
        onZeilenWartezeit={(ms, zeilenwechsel) => {
          wartezeitRef.current += ms;
          zeilenwechselRef.current += zeilenwechsel;
          setWartezeitMs(wartezeitRef.current);
          setZeilenwechselMs(zeilenwechselRef.current);
        }}
        // ★ F1c: Die Zeilen-Uhr ab der Anzeige (`eineMessart.ts`). Die Uhr
        // läuft seit dem gemeinsamen Start - schon die erste Zeile misst ab
        // dem Augenblick, in dem sie dasteht, und ihr Zuhören (die
        // Zeilenansage) wird abgezogen.
        zeilenuhrAbAnzeige
        uhrLaeuftSchon
        stoppSignal={stoppSignal}
        onStopp={(restZeile) => beenden(restZeile)}
        /*
          ★★★ DER VORRAT WIRD VERLÄNGERT, NICHT NEU BEGONNEN (11.09.2026,
          Dateikopf „Der Text geht nie aus"). Mit `zeilenAnhaengen` gibt es kein
          Rundenende und keine Abschluss-Karte; `zeileErreicht` hängt die
          nächste Charge rechtzeitig an. „Nochmal" gibt es darum nie - nach dem
          Stopp steht hier das Ergebnis, nicht die Karte der Session.
        */
        zeilenAnhaengen
        onQiChange={zeileErreicht}
        onRetry={() => {}}
        topSlot={kopf}
        fortschrittSlot={<MinutenLeiste gesamtMs={dauerMs} restMs={restMs} />}
        /*
          ★★★ STATT DER TASTATUR das Ranking (F11). Der ganze Bereich ist
          `aria-hidden` - Begründung im Kopf von `KlassenmatchRanking.tsx`.
        */
        untenSlot={
          <KlassenmatchRanking
            liste={liste}
            eigeneUid={account.id}
            verstrichenMs={verstrichenMs}
            dauerMs={dauerMs}
          />
        }
      />
    </>
  );
}
