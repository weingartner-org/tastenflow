/**
 * ★★★ DIE MOUSEOVER-HINWEISE DER TIPPCHALLENGE - an EINER Stelle (10.09.2026).
 *
 * Johannes: *„vergiss nicht die mousover infos bei allen bereichen
 * mitzudenken"*. Bis zu diesem Tag trug kein einziger Bereich der
 * Tippchallenge einen Hinweis - weder der Kasten der Lehrkraft (Formular,
 * Ergebnis-Tabelle) noch die Ergebnis-Karte oder die Statistik des Kindes.
 *
 * ── Warum hier und nicht in den Bauteilen ───────────────────────────────────
 * Dieselben Sätze stehen an drei Orten: an der Tabelle der Lehrkraft, in der
 * Statistik des Kindes und im Lehrerhandbuch
 * (`scripts/erzeuge-tastenflow-handbuch.mts`). Drei Abschriften liefen beim
 * nächsten Nachbessern auseinander
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Wie die Sätze gebaut sind ───────────────────────────────────────────────
 *  • Alle Zahlen kommen aus den Konstanten der Rechnung, keine ist
 *    abgeschrieben. Ändert sich das Fehlergewicht, ändert sich der Hinweis.
 *  • Die Sätze der Ergebnis-Tabelle einer Runde und der Ergebnis-Karte haben
 *    keine Anrede. Die Hinweise des Formulars richten sich an die Lehrkraft.
 *  • ★ Die Tabelle der Tippchallenges EINES Kindes steht bei der Lehrkraft UND
 *    in „Meine Statistik" des Kindes - ihre Köpfe sprechen darum je
 *    Zielgruppe an ({@link HINWEIS_TABELLE}, Johannes 10.09.2026).
 *  • Nichts gegen ein Kind ([[feedback_nie_gegen_das_kind]]): Der Leistungswert
 *    ist „keine Note", wacklige Tasten sind „keine Diagnose".
 *  • Nur der Bindestrich `-` (Braillezeile).
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import {
  DAUER_MIN_GROESST,
  DAUER_MIN_KLEINST,
  EINSTIEGSFENSTER_MIN,
  PROBEN_JE_NIVEAU,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_MEHRZAHL,
  PRUEFUNG_WORT_MEHRZAHL_EN,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_MEHRZAHL_FR,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_MEHRZAHL_ES,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_MEHRZAHL_IT,
  PRUEFUNG_WORT_PL,
} from "./schreibprobe";
import { mehrzahl } from "../bedienSprache/texte";
import {
  BEZUGSTEMPO,
  FEHLER_GEWICHT,
  FEHLER_GEWICHT_FREI,
  MIND_ZEICHEN_WERTUNG,
} from "./schreibprobeWertung";
import { WACKLIG_MIND_DRAN, WACKLIG_QUOTE } from "./schreibprobeAuswertung";

export const HINWEIS_CHALLENGE = {
  // ── Während sie läuft (Lehrkraft) ────────────────────────────────────────
  /*
    ★ „Bereit" im Ablauf mit „Jetzt starten" (10.09.2026): Die Challenge ist in
    dem Augenblick offen, in dem Sie starten. Bereit heisst darum: Sie ist auf
    dem Gerät angekommen und das Kind sieht den Startbildschirm. Ob es schon
    tippt, meldet das Gerät nicht - das sieht die Lehrkraft im Raum.
  */
  bereit:
    `Bereit heisst: Die ${PRUEFUNG_WORT} ist auf dem Gerät des Kindes ` +
    `angekommen, es sieht jetzt den Startbildschirm. Wer noch nicht bereit ist, ` +
    `hat die Seite vielleicht nicht offen oder kein Netz - einmal neu laden ` +
    `hilft. Wer schon abgegeben hat, zählt als bereit.`,

  // ── Die Spalte in „Meine Klassen" ─────────────────────────────────────────
  spalte:
    `Erste Zahl: wie viele ${PRUEFUNG_WORT_MEHRZAHL} geschrieben wurden. ` +
    `Zweite Zahl: der Leistungswert im Schnitt, von 0 bis 100 - gezählt wird ` +
    `nur, was lang genug für eine Wertung war. Aufklappen zeigt jede ` +
    `${PRUEFUNG_WORT} einzeln.`,

  // ── Die Ergebnisse einer Runde, die Übersicht und die Ergebnis-Karte ──────
  niveau:
    `Welche Tasten im Text vorkamen - von der Grundreihe bis zum Programmcode. ` +
    `Alle in der Klasse schreiben auf demselben Niveau.`,
  anschlaege:
    `Richtig geschriebene Zeichen je Minute, gemessen an der Prüfungsuhr. ` +
    `Nachdenken zählt mit, das Warten auf das Vorlesen nicht.`,
  treffsicherheit: `Der Anteil der richtigen Anschläge an allen Anschlägen.`,
  leistungswert:
    `Treffsicherheit und Tempo in einer Zahl von 0 bis 100. Die ` +
    `Treffsicherheit wiegt schwerer: Ein Fehlgriff zählt so viel wie ` +
    `${FEHLER_GEWICHT} Zeichen, und doppeltes Tempo zählt nicht doppelt ` +
    `(gezählt wird bis ${BEZUGSTEMPO} Anschläge je Minute). Unter ` +
    `${MIND_ZEICHEN_WERTUNG} Zeichen gibt es keinen Leistungswert. Er ist ` +
    `keine Note.`,

  // ── Die Ergebnisse einer Runde (Lehrkraft) und die Ergebnis-Karte ─────────
  rang:
    `Prozent vom besten Ergebnis dieser einen ${PRUEFUNG_WORT}: 100 % hat das ` +
    `beste. Über mehrere ${PRUEFUNG_WORT_MEHRZAHL} hinweg sagt der Rang nichts - ` +
    `dafür gibt es den Leistungswert.`,
  zeichen: `Richtig geschriebene Zeichen, Leerzeichen mitgezählt.`,
  fehler:
    `Jeder Fehlgriff unterwegs, auch einer, der sofort verbessert wurde. Am ` +
    `Ende steht immer der richtige Text da.`,
  zeilen: `Wie viele Zeilen des Textes ganz geschrieben wurden.`,
  schreibzeit:
    `Die Zeit auf der Prüfungsuhr ohne das Warten auf das Vorlesen - ` +
    `Nachdenken zählt mit.`,
  vorlesezeit:
    `So lange hat die App vorgelesen, während gewartet wurde. Diese Zeit ist ` +
    `von der Prüfungszeit abgezogen - wer mitgetippt hat, während die Stimme ` +
    `sprach, bekommt dafür nichts abgezogen.`,
  vorlesen:
    `Ob die App vorgelesen hat - und wie viel Wartezeit auf die Stimme deshalb ` +
    `von der Prüfungszeit abgezogen wurde. Vorgelesen wird in der ${PRUEFUNG_WORT}, ` +
    `wenn das Kind sein eigenes Vorlesen eingeschaltet hat - genau wie beim Üben.`,
  // Nur noch für ältere Ergebnisse: Bis 10.09.2026 gab es einen Zeitzuschlag.
  zuschlagErgebnis: `Um so viel Prozent war die Prüfungszeit verlängert.`,
  wacklig:
    `Tasten, die mindestens ${WACKLIG_MIND_DRAN} mal dran waren und dabei ` +
    `unter ${Math.round(WACKLIG_QUOTE * 100)} % getroffen wurden. Ein Hinweis, ` +
    `wo sich Üben lohnt - keine Diagnose.`,

  // ── Das Formular zum Starten (nur die Lehrkraft liest es) ─────────────────
  tastaturniveau:
    `Welche Zeichen im Text vorkommen dürfen. Alle Kinder der Klasse bekommen ` +
    `denselben Text - auch wenn ihr eigener Lernstand darunter oder darüber liegt.`,
  start:
    `Wann Sie die ${PRUEFUNG_WORT} gestartet haben. Ab da haben die Kinder ` +
    `${EINSTIEGSFENSTER_MIN} Minuten Zeit, um anzufangen.`,
  jetztStarten:
    `Startet die ${PRUEFUNG_WORT} sofort für die ganze Klasse - mit Niveau und ` +
    `Prüfungszeit von oben. Ab jetzt haben die Kinder ${EINSTIEGSFENSTER_MIN} ` +
    `Minuten Zeit, um anzufangen.`,
  pruefungszeit:
    `Wie lange jedes Kind schreibt (${DAUER_MIN_KLEINST} bis ` +
    `${DAUER_MIN_GROESST} Minuten). Die Zeit läuft für jedes Kind einzeln ab ` +
    `seinem ersten Tastendruck.`,
  /*
    ★★★ 10.09.2026: „zeitzuschlag" und „zuschlagJeKind" sind weg - Johannes:
    „den Zeitzuschlag und die Häkchen unten brauchen wir nicht. Blinde
    verwenden Vorlesen." An ihre Stelle trat zunächst das Häkchen je Kind -
    und das ist seit 11.09.2026 (D4) selbst wieder weg: „schaff das Häkchen
    ab, es verwirrt nur."
  */
  vorlesenErlaubt:
    `Kinder bekommen in der ${PRUEFUNG_WORT} vorgelesen, wenn sie ihr eigenes ` +
    `Vorlesen eingeschaltet haben - wie beim Üben, ohne eigenes Häkchen der ` +
    `Lehrkraft. Die Wartezeit auf die Stimme wird dabei von der Prüfungszeit ` +
    `abgezogen.`,
  /*
    ★★★ 23.09.2026 („Freies Schreiben" - BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md
    §7): die Wahl zwischen den zwei Arten der Tippchallenge. Der Faktor
    zwischen den beiden Fehlergewichten steht nicht als Zahl da, sondern
    ausgerechnet („zehnmal so schwer") - eine Lehrkraft soll den Satz lesen
    können, ohne selbst zu dividieren.
  */
  artStreng:
    `Wie bisher: Eine falsche Taste rückt nicht vor, jeder Fehlgriff zählt - ` +
    `auch ein sofort verbesserter.`,
  artFrei:
    `Fehler bleiben beim Schreiben stehen und werden NICHT markiert - wie bei ` +
    `der Abschrift von Typewriter. Gewertet wird, was am Ende falsch dasteht: ` +
    `Ein stehender Fehler wiegt darum zehnmal so schwer wie ein Fehlgriff im ` +
    `strengen Modus (${FEHLER_GEWICHT_FREI} statt ${FEHLER_GEWICHT} Zeichen), ` +
    `weil ausgebesserte Fehler nicht zählen. Die Rücktaste bessert in der ` +
    `aktuellen Zeile aus.`,
  text:
    `Je Niveau gibt es ${PROBEN_JE_NIVEAU} Texte. Die nächste ${PRUEFUNG_WORT} ` +
    `dieses Niveaus beginnt dort, wo das Kind aufgehört hat, das in der letzten ` +
    `am weitesten kam: an der nächsten Zeile, bei Texten mit Sätzen am nächsten ` +
    `Satzanfang. Ist ein Text zu Ende, geht es ohne Pause im nächsten weiter.`,
  /*
    ★★★ 23.09.2026 (E6, „Freies Schreiben"): die Ergebnisse im freien Modus -
    „Fehler" heisst dort „stehengeblieben" (siehe `Probenergebnis.fehler`), und
    die Rücktaste bekommt eine eigene Spalte/Zeile. Beide NUR bei
    `istFreiesSchreiben(plan)` sichtbar, siehe `SchreibprobeErgebnis.tsx` und
    `SchreibprobeKasten.tsx`.
  */
  fehlerFrei:
    `Was am Ende noch falsch dasteht - je Wort höchstens ein Fehler: ein ` +
    `falsches, ein fehlendes oder ein zusätzliches Wort, oder ein fehlendes ` +
    `Leerzeichen. Ausgebesserte Stellen zählen nicht, ebenso wenig das ` +
    `angefangene letzte Wort.`,
  korrekturen:
    `Wie oft die Rücktaste gedrückt wurde, um eine Stelle in der aktuellen ` +
    `Zeile auszubessern. Nur zur Auskunft - das geht in keine Wertung ein.`,
} as const;

export type HinweisChallenge = keyof typeof HINWEIS_CHALLENGE;

/**
 * ★★★ DIESELBEN HINWEISE ENGLISCH (EN5, 19.09.2026).
 *
 * Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten - `tsc` meldet
 * einen fehlenden Schlüssel, der Wächter
 * `tests/tastenflow-englisch-challenge-match.test.tsx` vergleicht die Zahlen.
 * Wörter nach dem Glossar (§3.2, §3.7): Leistungswert ⇒ *score* (diese Sätze
 * stehen nur neben Challenge-Zahlen, dort genügt *score*), Treffsicherheit ⇒
 * *accuracy*, Fehlgriff ⇒ *wrong key*, Niveau ⇒ *key range*, Prüfungszeit ⇒
 * *time limit*, Rang ⇒ *place*, Note ⇒ *mark*, Kind (Lehrkraft-Sicht) ⇒
 * *pupil*. „abgeben" ⇒ *hand in* (britischer Schulgebrauch). Prozent ohne
 * Leerzeichen (`90%`, Glossar §1.2).
 */
export const HINWEIS_CHALLENGE_EN: Record<HinweisChallenge, string> = {
  bereit:
    `Ready means: the ${PRUEFUNG_WORT_EN} has reached the pupil's device, and they ` +
    `can now see the start screen. A pupil who is not ready yet may not have the ` +
    `page open or may have no connection - reloading the page once helps. Anyone ` +
    `who has already handed in counts as ready.`,
  spalte:
    `First number: how many ${PRUEFUNG_WORT_MEHRZAHL_EN} were done. Second ` +
    `number: the average score, from 0 to 100 - only what was long enough to be ` +
    `scored counts. Expand the row to see each ${PRUEFUNG_WORT_EN} on its own.`,
  niveau:
    `Which keys the text used - from the home row to program code. Everyone in ` +
    `the class types with the same key range.`,
  anschlaege:
    `Characters typed correctly per minute, measured on the challenge clock. ` +
    `Thinking time counts; waiting for the read aloud does not.`,
  treffsicherheit: `The proportion of all keystrokes that were correct.`,
  leistungswert:
    `Accuracy and speed in one number from 0 to 100. Accuracy counts for more: ` +
    `a wrong key counts as much as ${FEHLER_GEWICHT} characters, and double the ` +
    `speed does not count double (speed counts up to ${BEZUGSTEMPO} keystrokes ` +
    `per minute). With fewer than ${MIND_ZEICHEN_WERTUNG} characters there is no ` +
    `score. It is not a mark.`,
  rang:
    `Percentage of the best result in this one ${PRUEFUNG_WORT_EN}: the best ` +
    `result has 100%. Across several ${PRUEFUNG_WORT_MEHRZAHL_EN} the place tells ` +
    `you nothing - that is what the score is for.`,
  zeichen: `Characters typed correctly, spaces included.`,
  fehler:
    `Every wrong key along the way, even one that was put right straight away. ` +
    `At the end the text is always correct.`,
  zeilen: `How many lines of the text were typed in full.`,
  schreibzeit:
    `The time on the challenge clock, minus the time spent waiting for the read ` +
    `aloud - thinking time counts.`,
  vorlesezeit:
    `How long the app read aloud while nobody was typing. This time has been taken ` +
    `off the time limit - anyone who kept typing while the voice was speaking gets ` +
    `nothing taken off for that.`,
  vorlesen:
    `Whether the app read aloud - and how much time spent waiting for the voice ` +
    `was therefore taken off the time limit. In the ${PRUEFUNG_WORT_EN} the app ` +
    `reads aloud if the pupil has switched on their own read aloud - just as when ` +
    `practising.`,
  zuschlagErgebnis: `How much extra time there was, as a percentage of the time limit.`,
  wacklig:
    `Keys that came up at least ${WACKLIG_MIND_DRAN} times and were typed correctly ` +
    `less than ${Math.round(WACKLIG_QUOTE * 100)}% of the time. A pointer to where ` +
    `practice pays off - not a diagnosis.`,
  tastaturniveau:
    `Which characters the text may contain. Every pupil in the class gets the same ` +
    `text - even if their own progress is below or above it.`,
  start:
    `When you started the ${PRUEFUNG_WORT_EN}. From then on, pupils have ` +
    `${EINSTIEGSFENSTER_MIN} minutes to begin.`,
  jetztStarten:
    `Starts the ${PRUEFUNG_WORT_EN} straight away for the whole class - with the ` +
    `key range and time limit set above. From now on, pupils have ` +
    `${EINSTIEGSFENSTER_MIN} minutes to begin.`,
  pruefungszeit:
    `How long each pupil types (${DAUER_MIN_KLEINST} to ${DAUER_MIN_GROESST} ` +
    `minutes). Each pupil's time runs separately, from their first keystroke.`,
  vorlesenErlaubt:
    `In the ${PRUEFUNG_WORT_EN}, the app reads aloud to pupils who have switched ` +
    `on their own read aloud - just as when practising, with no separate tick box ` +
    `for the teacher. The time spent waiting for the voice is taken off the time ` +
    `limit.`,
  artStreng:
    `As before: a wrong key does not move on, every wrong key counts - even one ` +
    `put right straight away.`,
  artFrei:
    `Mistakes stay as typed and are NOT marked - as in Typewriter's dictation. ` +
    `What is scored is what is still wrong at the end: a mistake left standing ` +
    `therefore counts ten times as much as a wrong key in the strict type ` +
    `(${FEHLER_GEWICHT_FREI} instead of ${FEHLER_GEWICHT} characters), because ` +
    `corrected mistakes do not count. Backspace corrects within the current line.`,
  text:
    `There are ${PROBEN_JE_NIVEAU} texts for each key range. The next ` +
    `${PRUEFUNG_WORT_EN} with this key range starts where the pupil who got ` +
    `furthest last time stopped: at the next line, or for texts with sentences, at ` +
    `the start of the next sentence. When a text ends, the next one follows ` +
    `without a break.`,
  fehlerFrei:
    `What is still wrong at the end - at most one mistake per word: a wrong, a ` +
    `missing or an extra word, or a missing space. Corrected spots do not ` +
    `count, and neither does the last, unfinished word.`,
  korrekturen:
    `How many times Backspace was pressed to correct a spot in the current ` +
    `line. For information only - it does not affect the score.`,
};

/**
 * ★★★ DIESELBEN HINWEISE FRANZÖSISCH (E11a-5, 26.09.2026) - neu geschrieben,
 * nicht übertragen. Gleiche Schlüssel, gleiche Zahlen aus denselben
 * Konstanten. Wörter wie in `LehrerHilfe.fr.tsx` und Glossar §9.2: *le Défi*,
 * *score*, *précision*, *niveau*, *temps* (Prüfungszeit), *erreur de frappe*
 * (Fehlgriff), *touches instables*, *rendre* (abgeben), *élève*; die
 * Lehrkraft liest „vous", die übrigen Sätze haben keine Anrede. Prozent mit
 * Leerzeichen („90 %", Bauplan §9.1). Nie „faute".
 */
export const HINWEIS_CHALLENGE_FR: Record<HinweisChallenge, string> = {
  bereit:
    `Prêt signifie : le ${PRUEFUNG_WORT_FR} est arrivé sur l'appareil de l'élève, ` +
    `qui voit maintenant l'écran de départ. Un élève pas encore prêt n'a peut-être ` +
    `pas la page ouverte ou pas de connexion - recharger la page une fois aide. ` +
    `Les élèves qui ont déjà rendu comptent comme prêts.`,
  spalte:
    `Premier nombre : combien de ${PRUEFUNG_WORT_MEHRZAHL_FR} ont été faits. ` +
    `Deuxième nombre : le score moyen, de 0 à 100 - seul compte ce qui était assez ` +
    `long pour un score. Déplier la ligne montre chaque ${PRUEFUNG_WORT_FR} séparément.`,
  niveau:
    `Quelles touches le texte utilisait - de la rangée de base au code informatique. ` +
    `Toute la classe écrit au même niveau.`,
  anschlaege:
    `Caractères tapés correctement par minute, mesurés sur l'horloge du ` +
    `${PRUEFUNG_WORT_FR}. Le temps de réflexion compte, l'attente de la lecture à ` +
    `voix haute non.`,
  treffsicherheit: `La part des frappes correctes parmi toutes les frappes.`,
  leistungswert:
    `Précision et vitesse en un nombre de 0 à 100. La précision pèse plus lourd : ` +
    `une erreur de frappe compte comme ${FEHLER_GEWICHT} caractères, et doubler la ` +
    `vitesse ne compte pas double (la vitesse compte jusqu'à ${BEZUGSTEMPO} frappes ` +
    `par minute). En dessous de ${MIND_ZEICHEN_WERTUNG} caractères, il n'y a pas ` +
    `de score. Ce n'est pas une note.`,
  rang:
    `Pourcentage du meilleur résultat de ce ${PRUEFUNG_WORT_FR} : le meilleur a ` +
    `100 %. D'un ${PRUEFUNG_WORT_FR} à l'autre, le rang ne dit rien - c'est le rôle ` +
    `du score.`,
  zeichen: `Caractères tapés correctement, espaces compris.`,
  fehler:
    `Chaque erreur de frappe en cours de route, même corrigée aussitôt. À la fin, ` +
    `le texte est toujours juste.`,
  zeilen: `Combien de lignes du texte ont été tapées en entier.`,
  schreibzeit:
    `Le temps sur l'horloge du ${PRUEFUNG_WORT_FR}, sans l'attente de la lecture ` +
    `à voix haute - le temps de réflexion compte.`,
  vorlesezeit:
    `Le temps pendant lequel l'application a lu à voix haute pendant l'attente. Ce temps ` +
    `est retiré du temps du ${PRUEFUNG_WORT_FR} - qui a continué à taper pendant que ` +
    `la voix parlait n'a rien de retiré pour cela.`,
  vorlesen:
    `Si l'application a lu à voix haute - et combien de temps d'attente de la voix a donc ` +
    `été retiré du temps du ${PRUEFUNG_WORT_FR}. Dans le ${PRUEFUNG_WORT_FR}, l'application ` +
    `lit à voix haute si l'élève a activé sa propre lecture à voix haute - comme à ` +
    `l'entrainement.`,
  zuschlagErgebnis: `De combien de pour cent le temps du ${PRUEFUNG_WORT_FR} a été prolongé.`,
  wacklig:
    `Touches venues au moins ${WACKLIG_MIND_DRAN} fois et réussies moins de ` +
    `${Math.round(WACKLIG_QUOTE * 100)} % des cas. Une indication de ce qui vaut ` +
    `la peine d'être exercé - pas un diagnostic.`,
  tastaturniveau:
    `Quels caractères le texte peut contenir. Tous les élèves de la classe reçoivent ` +
    `le même texte - même si leur propre niveau est plus bas ou plus haut.`,
  start:
    `Quand vous avez lancé le ${PRUEFUNG_WORT_FR}. À partir de là, les élèves ont ` +
    `${EINSTIEGSFENSTER_MIN} minutes pour commencer.`,
  jetztStarten:
    `Lance le ${PRUEFUNG_WORT_FR} tout de suite pour toute la classe - avec le ` +
    `niveau et le temps choisis plus haut. À partir de maintenant, les élèves ont ` +
    `${EINSTIEGSFENSTER_MIN} minutes pour commencer.`,
  pruefungszeit:
    `Combien de temps chaque élève écrit (${DAUER_MIN_KLEINST} à ` +
    `${DAUER_MIN_GROESST} minutes). Le temps compte séparément pour chaque élève, ` +
    `à partir de sa première frappe.`,
  vorlesenErlaubt:
    `Dans le ${PRUEFUNG_WORT_FR}, l'application lit à voix haute pour les élèves qui ont ` +
    `activé leur propre lecture à voix haute - comme à l'entrainement, sans case à ` +
    `cocher séparée pour vous. Le temps d'attente de la voix est retiré du temps ` +
    `du ${PRUEFUNG_WORT_FR}.`,
  artStreng:
    `Comme avant : une touche fausse ne fait pas avancer, chaque erreur de frappe compte - ` +
    `même corrigée aussitôt.`,
  artFrei:
    `Les erreurs restent telles qu'elles ont été tapées et ne sont PAS signalées - ` +
    `comme dans l'épreuve de copie de Typewriter. Ce qui compte, c'est ce qui reste faux à ` +
    `la fin : une erreur laissée pèse donc dix fois plus qu'une erreur de frappe en ` +
    `mode strict (${FEHLER_GEWICHT_FREI} au lieu de ${FEHLER_GEWICHT} caractères), ` +
    `parce que les erreurs corrigées ne comptent pas. Retour arrière corrige dans ` +
    `la ligne en cours.`,
  text:
    `Il y a ${PROBEN_JE_NIVEAU} textes par niveau. Le prochain ${PRUEFUNG_WORT_FR} ` +
    `de ce niveau reprend à l'endroit le plus loin atteint la dernière fois : ` +
    `à la ligne suivante, ou au début de la phrase suivante pour les textes avec des ` +
    `phrases. Quand un texte se termine, le suivant commence sans pause.`,
  fehlerFrei:
    `Ce qui reste faux à la fin - au plus une erreur par mot : un mot faux, ` +
    `manquant ou en trop, ou une espace manquante. Les endroits corrigés ne ` +
    `comptent pas, pas plus que le dernier mot inachevé.`,
  korrekturen:
    `Combien de fois Retour arrière a servi à corriger un endroit de la ligne en ` +
    `cours. Pour information seulement - cela n'entre dans aucun score.`,
};

/**
 * ★★★ DIESELBEN HINWEISE SPANISCH (ES-O, 27.09.2026) - neu geschrieben, nicht
 * übertragen. Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten.
 * Wörter: *el Reto*, *puntuación*, *precisión*, *nivel*, *error* (Fehlgriff),
 * *teclas inseguras*, *entregar*, *estudiante*; die Lehrkraft liest „usted",
 * die übrigen Sätze haben keine Anrede. „90 %" mit Leerzeichen (RAE).
 */
export const HINWEIS_CHALLENGE_ES: Record<HinweisChallenge, string> = {
  bereit:
    `Preparado significa: el ${PRUEFUNG_WORT_ES} ha llegado al dispositivo de la persona, ` +
    `que ahora ve la pantalla de inicio. Quien todavía no está preparado quizá no tenga ` +
    `la página abierta o no tenga conexión - suele bastar con volver a cargar la página. ` +
    `Quien ya ha entregado cuenta como preparado.`,
  spalte:
    `Primer número: cuántos ${PRUEFUNG_WORT_MEHRZAHL_ES} se han hecho. ` +
    `Segundo número: la puntuación media, de 0 a 100 - solo cuenta lo que fue lo bastante ` +
    `largo para una puntuación. Al desplegar la fila se ve cada ${PRUEFUNG_WORT_ES} por separado.`,
  niveau:
    `Qué teclas usaba el texto - de la fila guía al código informático. ` +
    `Toda la clase escribe en el mismo nivel.`,
  anschlaege:
    `Caracteres escritos correctamente por minuto, medidos con el reloj del ` +
    `${PRUEFUNG_WORT_ES}. El tiempo para pensar cuenta; la espera de la lectura en ` +
    `voz alta, no.`,
  treffsicherheit: `El porcentaje de pulsaciones correctas entre todas las pulsaciones.`,
  leistungswert:
    `Precisión y velocidad en un número de 0 a 100. La precisión pesa más: ` +
    `un error cuenta como ${FEHLER_GEWICHT} caracteres, y el doble de velocidad ` +
    `no cuenta el doble (la velocidad cuenta hasta ${BEZUGSTEMPO} pulsaciones ` +
    `por minuto). Por debajo de ${MIND_ZEICHEN_WERTUNG} caracteres no hay ` +
    `puntuación. No es una nota.`,
  rang:
    `Porcentaje del mejor resultado de este ${PRUEFUNG_WORT_ES}: el mejor tiene ` +
    `100 %. De un ${PRUEFUNG_WORT_ES} a otro, el puesto no dice nada - para eso ` +
    `está la puntuación.`,
  zeichen: `Caracteres escritos correctamente, espacios incluidos.`,
  fehler:
    `Cada error por el camino, aunque se corrija enseguida. Al final, ` +
    `el texto siempre está bien.`,
  zeilen: `Cuántas líneas del texto se escribieron enteras.`,
  schreibzeit:
    `El tiempo en el reloj del ${PRUEFUNG_WORT_ES}, sin la espera de la lectura ` +
    `en voz alta - el tiempo para pensar cuenta.`,
  vorlesezeit:
    `El tiempo que la aplicación leyó en voz alta durante la espera. Ese tiempo ` +
    `no cuenta en el cálculo de la velocidad del ${PRUEFUNG_WORT_ES} - a quien siguió escribiendo mientras ` +
    `la voz hablaba no se le descuenta nada por ello.`,
  vorlesen:
    `Si la aplicación leyó en voz alta - y cuánto tiempo de espera de la voz ` +
    `quedó fuera por eso del cálculo de la velocidad. En el ${PRUEFUNG_WORT_ES}, la aplicación ` +
    `lee en voz alta si la persona tiene activada su propia lectura en voz alta - como ` +
    `al practicar.`,
  zuschlagErgebnis: `En qué porcentaje se alargó el tiempo del ${PRUEFUNG_WORT_ES}.`,
  wacklig:
    `Teclas que salieron al menos ${WACKLIG_MIND_DRAN} veces y se acertaron en menos del ` +
    `${Math.round(WACKLIG_QUOTE * 100)} % de los casos. Una pista de lo que vale ` +
    `la pena practicar - no un diagnóstico.`,
  tastaturniveau:
    `Qué caracteres puede tener el texto. Todo el alumnado de la clase recibe ` +
    `el mismo texto - aunque su propio nivel sea más bajo o más alto.`,
  start:
    `Cuándo empezó el ${PRUEFUNG_WORT_ES}. A partir de ese momento, el alumnado tiene ` +
    `${EINSTIEGSFENSTER_MIN} minutos para empezar.`,
  jetztStarten:
    `Inicia el ${PRUEFUNG_WORT_ES} ahora mismo para toda la clase - con el ` +
    `nivel y el tiempo elegidos arriba. Desde ahora, el alumnado tiene ` +
    `${EINSTIEGSFENSTER_MIN} minutos para empezar.`,
  pruefungszeit:
    `Cuánto tiempo escribe cada estudiante (de ${DAUER_MIN_KLEINST} a ` +
    `${DAUER_MIN_GROESST} minutos). El tiempo cuenta por separado para cada estudiante, ` +
    `a partir de su primera pulsación.`,
  vorlesenErlaubt:
    `En el ${PRUEFUNG_WORT_ES}, la aplicación lee en voz alta para quienes tengan ` +
    `activada su propia lectura en voz alta - como al practicar, sin una casilla ` +
    `aparte para usted. El tiempo de espera de la voz no cuenta en el cálculo ` +
    `de la velocidad.`,
  artStreng:
    `Una tecla equivocada no hace avanzar, y cada error cuenta - ` +
    `aunque se corrija enseguida.`,
  artFrei:
    `Los errores se quedan tal como se escribieron y NO se señalan - ` +
    `como en una prueba de transcripción. Cuenta lo que sigue mal al ` +
    `final: por eso un error que se queda pesa diez veces más que un error en ` +
    `el modo estricto (${FEHLER_GEWICHT_FREI} en lugar de ${FEHLER_GEWICHT} caracteres), ` +
    `porque los errores corregidos no cuentan. Retroceso corrige en ` +
    `la línea en curso.`,
  text:
    `Hay ${PROBEN_JE_NIVEAU} textos por nivel. El próximo ${PRUEFUNG_WORT_ES} ` +
    `de este nivel sigue en el punto más lejano al que se llegó la última vez: ` +
    `en la línea siguiente, o al principio de la frase siguiente en los textos con ` +
    `frases. Cuando un texto termina, el siguiente empieza sin pausa.`,
  fehlerFrei:
    `Lo que sigue mal al final - como mucho un error por palabra: una palabra mal escrita, ` +
    `que falta o que sobra, o un espacio que falta. Lo que se corrigió no ` +
    `cuenta, ni tampoco la última palabra sin terminar.`,
  korrekturen:
    `Cuántas veces se usó Retroceso para corregir algo en la línea en ` +
    `curso. Solo como información - no entra en ninguna puntuación.`,
};

/**
 * ★★★ DIESELBEN HINWEISE ITALIENISCH (O-IT, 02.10.2026) - neu geschrieben.
 * Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten. Wörter nach dem
 * Glossar Italienisch §2.3/§2.6: *la Sfida*, *punteggio*, *precisione*,
 * *tasto sbagliato*, *tasti usati* (Niveau), *durata della sfida*
 * (Prüfungszeit), *voto* (Note), *consegnare* (abgeben), *alunni* oder *persona*;
 * die Lehrkraft neutral ohne „Lei" (Regel 1). „90%" ohne Leerzeichen.
 */
export const HINWEIS_CHALLENGE_IT: Record<HinweisChallenge, string> = {
  bereit:
    `Una persona è pronta quando la ${PRUEFUNG_WORT_IT} è arrivata sul suo dispositivo ` +
    `e vede la schermata iniziale. Se manca qualcuno, forse non ha la pagina aperta ` +
    `o non ha connessione - di solito basta ricaricare la pagina una volta. Anche ` +
    `chi ha già consegnato è contato tra le persone pronte.`,
  spalte:
    `Primo numero: quante ${PRUEFUNG_WORT_MEHRZAHL_IT} sono state fatte. Secondo ` +
    `numero: il punteggio medio, da 0 a 100 - conta solo ciò che era abbastanza ` +
    `lungo per una valutazione. Aprendo la riga si vede ogni ${PRUEFUNG_WORT_IT} da sola.`,
  niveau:
    `Quali tasti usava il testo - dalla riga di base al codice. Tutta la classe ` +
    `scrive con gli stessi tasti.`,
  anschlaege:
    `Caratteri scritti correttamente al minuto, misurati con l'orologio della ` +
    `${PRUEFUNG_WORT_IT}. Il tempo per pensare conta; l'attesa della lettura ad alta ` +
    `voce no.`,
  treffsicherheit: `La quota di battute giuste su tutte le battute.`,
  leistungswert:
    `Precisione e velocità in un numero da 0 a 100. La precisione pesa di più: ` +
    `un tasto sbagliato conta come ${FEHLER_GEWICHT} caratteri, e una velocità doppia ` +
    `non conta il doppio (la velocità conta fino a ${BEZUGSTEMPO} battute al ` +
    `minuto). Sotto i ${MIND_ZEICHEN_WERTUNG} caratteri non c'è punteggio. Non è ` +
    `un voto.`,
  rang:
    `Percentuale rispetto al miglior risultato di questa ${PRUEFUNG_WORT_IT}: il ` +
    `migliore ha 100%. Tra più ${PRUEFUNG_WORT_MEHRZAHL_IT} il posto non dice nulla - ` +
    `per questo c'è il punteggio.`,
  zeichen: `Caratteri scritti correttamente, spazi compresi.`,
  fehler:
    `Ogni tasto sbagliato lungo il percorso, anche se corretto subito. Alla fine ` +
    `il testo è sempre giusto.`,
  zeilen: `Quante righe del testo sono state scritte per intero.`,
  schreibzeit:
    `Il tempo sull'orologio della ${PRUEFUNG_WORT_IT}, senza l'attesa della lettura ` +
    `ad alta voce - il tempo per pensare conta.`,
  vorlesezeit:
    `Per quanto tempo l'app ha letto ad alta voce durante l'attesa. Questo tempo è ` +
    `tolto dalla durata della sfida - chi ha continuato a scrivere mentre la voce ` +
    `parlava non ha nulla di tolto per questo.`,
  vorlesen:
    `Se l'app ha letto ad alta voce - e quanto tempo di attesa della voce è stato ` +
    `tolto per questo dalla durata della sfida. Nella ${PRUEFUNG_WORT_IT} l'app ` +
    `legge ad alta voce se la persona ha attivato la propria lettura ad alta voce - ` +
    `come durante l'esercizio.`,
  zuschlagErgebnis: `Di quanto per cento era stata allungata la durata della sfida.`,
  wacklig:
    `Tasti che sono capitati almeno ${WACKLIG_MIND_DRAN} volte e sono stati presi ` +
    `giusti meno del ${Math.round(WACKLIG_QUOTE * 100)}% delle volte. Un'indicazione ` +
    `di dove conviene esercitarsi - non una diagnosi.`,
  tastaturniveau:
    `Quali caratteri può contenere il testo. Tutta la classe riceve lo stesso ` +
    `testo - anche se i progressi di qualcuno sono più indietro o più avanti.`,
  start:
    `Quando è stata avviata la ${PRUEFUNG_WORT_IT}. Da quel momento gli alunni ` +
    `hanno ${EINSTIEGSFENSTER_MIN} minuti per iniziare.`,
  jetztStarten:
    `Avvia subito la ${PRUEFUNG_WORT_IT} per tutta la classe - con i tasti usati e ` +
    `la durata scelti sopra. Da ora gli alunni hanno ${EINSTIEGSFENSTER_MIN} ` +
    `minuti per iniziare.`,
  pruefungszeit:
    `Quanto tempo scrive ogni persona (da ${DAUER_MIN_KLEINST} a ` +
    `${DAUER_MIN_GROESST} minuti). Il tempo scorre per ogni persona separatamente, ` +
    `dal suo primo tasto.`,
  vorlesenErlaubt:
    `Nella ${PRUEFUNG_WORT_IT} l'app legge ad alta voce a chi ha attivato la ` +
    `propria lettura ad alta voce - come durante l'esercizio, senza una casella ` +
    `apposita per l'insegnante. Il tempo di attesa della voce viene tolto dalla ` +
    `durata della sfida.`,
  artStreng:
    `Come prima: un tasto sbagliato non fa andare avanti, ogni tasto sbagliato ` +
    `conta - anche se corretto subito.`,
  artFrei:
    `Gli errori restano come sono stati scritti e NON vengono segnati - come in un ` +
    `dettato di trascrizione. Conta ciò che è ancora sbagliato alla fine: per ` +
    `questo un errore rimasto pesa dieci volte più di un tasto sbagliato nella ` +
    `modalità rigorosa (${FEHLER_GEWICHT_FREI} invece di ${FEHLER_GEWICHT} ` +
    `caratteri), perché gli errori corretti non contano. Backspace corregge nella ` +
    `riga in corso.`,
  text:
    `Per ogni scelta di tasti ci sono ${PROBEN_JE_NIVEAU} testi. La prossima ` +
    `${PRUEFUNG_WORT_IT} con gli stessi tasti riprende dal punto più lontano ` +
    `raggiunto l'ultima volta: alla riga successiva, o all'inizio della frase ` +
    `successiva nei testi con frasi. Quando un testo finisce, il successivo inizia ` +
    `senza pausa.`,
  fehlerFrei:
    `Ciò che alla fine è ancora sbagliato - al massimo un errore per parola: una ` +
    `parola sbagliata, mancante o in più, oppure uno spazio mancante. I punti ` +
    `corretti non contano, e neppure l'ultima parola non finita.`,
  korrekturen:
    `Quante volte è stato premuto Backspace per correggere un punto nella riga in ` +
    `corso. Solo come informazione - non entra in nessuna valutazione.`,
};


/*
 * ★ O-PL (02.10.2026): Zahl + Hauptwort mit allen vier Formen (Glossar
 * §2.10a) - die Zahlen kommen aus Konstanten und dürfen sich ändern, ohne
 * dass „5 znaki" entsteht. Die Formen gelten für die Stelle, an der sie stehen
 * (Nominativ, Akkusativ oder Genitiv nach „do", „poniżej", „od … do").
 */
/** „jak 5 znaków" - Nominativ. */
const znakiPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `${z} znak`, few: (z) => `${z} znaki`, many: (z) => `${z} znaków`, other: (z) => `${z} znaku` });
/** „poniżej 200 znaków" - Genitiv. */
const znakowGenPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `${z} znaku`, few: (z) => `${z} znaków`, many: (z) => `${z} znaków`, other: (z) => `${z} znaku` });
/** „do 240 uderzeń" - Genitiv. */
const uderzenGenPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `${z} uderzenia`, few: (z) => `${z} uderzeń`, many: (z) => `${z} uderzeń`, other: (z) => `${z} uderzenia` });
/** „mają 10 minut" - Akkusativ (Einzahl „minutę"). */
const minutAkkPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `${z} minutę`, few: (z) => `${z} minuty`, many: (z) => `${z} minut`, other: (z) => `${z} minuty` });
/** „do 60 minut" - Genitiv. */
const minutGenPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `${z} minuty`, few: (z) => `${z} minut`, many: (z) => `${z} minut`, other: (z) => `${z} minuty` });
/** „co najmniej 3 razy". */
const razyPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `${z} raz`, few: (z) => `${z} razy`, many: (z) => `${z} razy`, other: (z) => `${z} raza` });
/** „jest 15 tekstów" - das Verb beugt mit. */
const jestTekstowPl = (n: number): string =>
  mehrzahl(n, "pl", { one: (z) => `jest ${z} tekst`, few: (z) => `są ${z} teksty`, many: (z) => `jest ${z} tekstów`, other: (z) => `jest ${z} tekstu` });

/**
 * ★★★ DIESELBEN HINWEISE POLNISCH (O-PL, 02.10.2026) - neu geschrieben.
 * Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten. Wörter nach dem
 * Glossar Polnisch §2.2/§2.3: *Wyzwanie* (gross, gebeugt ausgeschrieben),
 * *wynik*, *dokładność*, *pomyłka*, *używane klawisze*, *czas wyzwania*
 * (Prüfungszeit), *ocena* nur als „to nie jest ocena", *oddać* (abgeben);
 * Lehrkraft unpersönlich (-no-Form), Kinder „uczniowie" oder „osoba"; nie
 * „gotowy" über eine Person. „90%" ohne Leerzeichen.
 */
export const HINWEIS_CHALLENGE_PL: Record<HinweisChallenge, string> = {
  bereit:
    `Gotowość oznacza: ${PRUEFUNG_WORT_PL} dotarło na urządzenie ucznia i widać już ` +
    `ekran startowy. Jeśli przy kimś gotowości jeszcze nie widać, może brakować ` +
    `otwartej strony albo połączenia z internetem - zwykle pomaga jednorazowe ` +
    `odświeżenie strony. Oddane prace też liczą się do gotowości.`,
  spalte:
    `Pierwsza liczba: ile Wyzwań napisano. Druga liczba: średni wynik, od 0 do 100 - ` +
    `liczy się tylko to, co było wystarczająco długie, żeby obliczyć wynik. Po ` +
    `rozwinięciu wiersza widać każde ${PRUEFUNG_WORT_PL} osobno.`,
  niveau:
    `Jakich klawiszy używał tekst - od rzędu podstawowego po kod. Cała klasa pisze ` +
    `tymi samymi klawiszami.`,
  anschlaege:
    `Poprawnie napisane znaki na minutę, mierzone zegarem Wyzwania. Namysł się ` +
    `liczy, czekanie na czytanie na głos - nie.`,
  treffsicherheit: `Udział poprawnych uderzeń we wszystkich uderzeniach.`,
  leistungswert:
    `Dokładność i tempo w jednej liczbie od 0 do 100. Dokładność waży więcej: jedna ` +
    `pomyłka liczy się jak ${znakiPl(FEHLER_GEWICHT)}, a dwa razy szybsze tempo nie ` +
    `liczy się podwójnie (tempo liczy się do ${uderzenGenPl(BEZUGSTEMPO)} na minutę). ` +
    `Poniżej ${znakowGenPl(MIND_ZEICHEN_WERTUNG)} nie ma wyniku. To nie jest ocena.`,
  rang:
    `Procent najlepszego wyniku w tym jednym Wyzwaniu: najlepszy wynik ma 100%. ` +
    `Przy kilku Wyzwaniach miejsce nic nie mówi - do tego służy wynik.`,
  zeichen: `Poprawnie napisane znaki, razem ze spacjami.`,
  fehler:
    `Każda pomyłka po drodze, także od razu poprawiona. Na końcu tekst jest zawsze ` +
    `poprawny.`,
  zeilen: `Ile wierszy tekstu napisano w całości.`,
  schreibzeit: `Czas na zegarze Wyzwania bez czekania na czytanie na głos - namysł się liczy.`,
  vorlesezeit:
    `Jak długo program czytał na głos w czasie czekania. Ten czas odjęto od czasu ` +
    `wyzwania - jeśli pisanie trwało dalej, gdy głos mówił, za ten czas nic się ` +
    `nie odejmuje.`,
  vorlesen:
    `Czy program czytał na głos - i ile czasu czekania na głos dlatego odjęto od ` +
    `czasu wyzwania. W Wyzwaniu program czyta na głos, jeśli dana osoba ma włączone ` +
    `własne czytanie na głos - tak samo jak podczas ćwiczeń.`,
  zuschlagErgebnis: `O ile procent wydłużono czas wyzwania.`,
  wacklig:
    `Klawisze, które pojawiły się co najmniej ${razyPl(WACKLIG_MIND_DRAN)} i były ` +
    `trafiane rzadziej niż w ${Math.round(WACKLIG_QUOTE * 100)}% przypadków. ` +
    `Wskazówka, gdzie warto poćwiczyć - nie diagnoza.`,
  tastaturniveau:
    `Jakie znaki może zawierać tekst. Cała klasa dostaje ten sam tekst - także ` +
    `wtedy, gdy ktoś ma za sobą więcej albo mniej lekcji.`,
  start:
    `Kiedy uruchomiono ${PRUEFUNG_WORT_PL}. Od tej chwili uczniowie mają ` +
    `${minutAkkPl(EINSTIEGSFENSTER_MIN)}, żeby zacząć.`,
  jetztStarten:
    `Od razu uruchamia ${PRUEFUNG_WORT_PL} dla całej klasy - z klawiszami i czasem ` +
    `wybranymi powyżej. Od teraz uczniowie mają ${minutAkkPl(EINSTIEGSFENSTER_MIN)}, ` +
    `żeby zacząć.`,
  pruefungszeit:
    `Jak długo pisze każda osoba (od ${DAUER_MIN_KLEINST} do ` +
    `${minutGenPl(DAUER_MIN_GROESST)}). Czas biegnie dla każdej osoby osobno, od jej ` +
    `pierwszego naciśnięcia klawisza.`,
  vorlesenErlaubt:
    `W Wyzwaniu program czyta na głos osobom, które mają włączone własne czytanie ` +
    `na głos - tak jak podczas ćwiczeń, bez osobnego pola wyboru dla nauczycieli. ` +
    `Czas czekania na głos jest odejmowany od czasu wyzwania.`,
  artStreng:
    `Tak jak dotąd: po pomyłce kursor nie idzie dalej, każda pomyłka się liczy - ` +
    `także od razu poprawiona.`,
  artFrei:
    `Błędy zostają tak, jak je napisano, i NIE są zaznaczane - jak przy ` +
    `przepisywaniu tekstu. Liczy się to, co na końcu nadal jest źle: dlatego ` +
    `pozostawiony błąd waży dziesięć razy więcej niż pomyłka w trybie ścisłym ` +
    `(${znakiPl(FEHLER_GEWICHT_FREI)} zamiast ${FEHLER_GEWICHT}), bo poprawione ` +
    `błędy się nie liczą. Klawisz Backspace poprawia w bieżącym wierszu.`,
  text:
    `Dla każdego zestawu klawiszy ${jestTekstowPl(PROBEN_JE_NIVEAU)}. Następne ` +
    `${PRUEFUNG_WORT_PL} z tymi samymi klawiszami zaczyna się od najdalszego miejsca, ` +
    `do którego klasa doszła ostatnim razem: od następnego wiersza, a w tekstach ze ` +
    `zdaniami - od początku następnego zdania. Gdy tekst się kończy, bez przerwy ` +
    `zaczyna się następny.`,
  fehlerFrei:
    `To, co na końcu nadal jest źle - najwyżej jeden błąd na słowo: słowo błędne, ` +
    `brakujące albo dodatkowe lub brakująca spacja. Poprawione miejsca się nie ` +
    `liczą, tak samo jak ostatnie, niedokończone słowo.`,
  korrekturen:
    `Ile razy naciśnięto klawisz Backspace, żeby poprawić miejsce w bieżącym ` +
    `wierszu. Tylko informacyjnie - nie wpływa na żaden wynik.`,
};

/**
 * ★★★ DIESELBEN HINWEISE TÜRKISCH (O-TR, 02.10.2026) - neu geschrieben.
 * Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten. Wörter nach dem
 * Glossar Türkisch §2.2/§2.3: *yarışma* (klein im Satz, Endungen nur am
 * ausgeschriebenen Wort), *yarışma puanı*, *doğruluk*, *yanlış tuş*,
 * *kullanılan tuşlar*, *yarışma süresi*, *teslim etmek*; Lehrkraft "siz"
 * (-In), sonst ohne Anrede, das Kind heisst *öğrenci*. KEINE Endung an einer
 * Zahl oder Konstante (Regel 6): "${n} karakter kadar", "%${q} değerinin
 * altında". Nach der Zahl die Einzahl ("10 dakika"), Prozent vor der Zahl.
 */
export const HINWEIS_CHALLENGE_TR: Record<HinweisChallenge, string> = {
  bereit:
    `Hazır demek: yarışma öğrencinin cihazına ulaştı ve öğrenci başlangıç ` +
    `ekranını görüyor. Henüz hazır olmayan öğrencide sayfa açık olmayabilir ya da ` +
    `internet bağlantısı olmayabilir - sayfayı bir kez yenilemek genellikle yeter. ` +
    `Teslim etmiş olan öğrenci de hazır sayılır.`,
  spalte:
    `Birinci sayı: kaç yarışma yazıldığı. İkinci sayı: 0 ile 100 arasında ortalama ` +
    `yarışma puanı - yalnızca puan hesaplanacak kadar uzun olanlar sayılır. Satır ` +
    `açılınca her yarışma ayrı ayrı görünür.`,
  niveau:
    `Metinde hangi tuşların geçtiği - temel sıradan program koduna kadar. Sınıftaki ` +
    `herkes aynı tuşlarla yazar.`,
  anschlaege:
    `Dakikada doğru yazılan karakter sayısı, yarışma saatiyle ölçülür. Düşünme ` +
    `süresi sayılır, sesli okumayı beklemek sayılmaz.`,
  treffsicherheit: `Doğru vuruşların tüm vuruşlar içindeki oranı.`,
  leistungswert:
    `Doğruluk ve hız, 0 ile 100 arasında tek bir sayıda. Doğruluk daha ağır basar: ` +
    `bir yanlış tuş ${FEHLER_GEWICHT} karakter kadar sayılır, iki kat hız ise iki ` +
    `kat sayılmaz (hız en çok dakikada ${BEZUGSTEMPO} vuruş kadar sayılır). ` +
    `${MIND_ZEICHEN_WERTUNG} karakterden kısa yazılara puan verilmez. Bu bir not ` +
    `değildir.`,
  rang:
    `Bu tek yarışmadaki en iyi sonuca göre yüzde: en iyi sonuç %100 alır. Birden ` +
    `çok yarışma arasında sıra bir şey söylemez - bunun için yarışma puanı var.`,
  zeichen: `Doğru yazılan karakterler, boşluklar dahil.`,
  fehler:
    `Yol boyunca her yanlış tuş, hemen düzeltilen de. Sonunda metin her zaman ` +
    `doğrudur.`,
  zeilen: `Metnin kaç satırının tamamen yazıldığı.`,
  schreibzeit:
    `Yarışma saatindeki süre, sesli okumayı bekleme süresi olmadan - düşünme süresi ` +
    `sayılır.`,
  vorlesezeit:
    `Beklenirken programın ne kadar süre sesli okuduğu. Bu süre yarışma süresinden ` +
    `düşüldü - ses konuşurken yazmaya devam eden öğrenci için bu süre düşülmez.`,
  vorlesen:
    `Programın sesli okuyup okumadığı - ve bu yüzden sesi bekleme süresinin ne ` +
    `kadarının yarışma süresinden düşüldüğü. Yarışmada program, öğrenci kendi sesli ` +
    `okumasını açtıysa sesli okur - alıştırmada olduğu gibi.`,
  zuschlagErgebnis: `Yarışma süresinin yüzde kaç uzatıldığı.`,
  wacklig:
    `En az ${WACKLIG_MIND_DRAN} kez gelen ve doğru basılma oranı ` +
    `%${Math.round(WACKLIG_QUOTE * 100)} değerinin altında kalan tuşlar. Çalışmanın ` +
    `nerede işe yarayacağına dair bir ipucu - tanı değildir.`,
  tastaturniveau:
    `Metinde hangi karakterlerin bulunabileceği. Sınıftaki tüm öğrenciler aynı ` +
    `metni alır - kendi ilerlemeleri bunun altında ya da üstünde olsa bile.`,
  start:
    `Yarışmayı başlattığınız zaman. O andan itibaren öğrencilerin başlamak için ` +
    `${EINSTIEGSFENSTER_MIN} dakika süresi var.`,
  jetztStarten:
    `Yarışmayı tüm sınıf için hemen başlatır - yukarıda seçilen tuşlar ve yarışma ` +
    `süresiyle. Bundan sonra öğrencilerin başlamak için ${EINSTIEGSFENSTER_MIN} ` +
    `dakika süresi var.`,
  pruefungszeit:
    `Her öğrencinin ne kadar süre yazacağı (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} ` +
    `dakika). Süre her öğrenci için ayrı işler, ilk tuşa bastığı andan itibaren.`,
  vorlesenErlaubt:
    `Yarışmada program, kendi sesli okumasını açmış öğrencilere sesli okur - ` +
    `alıştırmada olduğu gibi, öğretmen için ayrı bir onay kutusu olmadan. Sesi ` +
    `bekleme süresi yarışma süresinden düşülür.`,
  artStreng:
    `Eskisi gibi: yanlış tuşta imleç ilerlemez, her yanlış tuş sayılır - hemen ` +
    `düzeltilen de.`,
  artFrei:
    `Hatalar yazıldığı gibi kalır ve işaretlenmez - dikte yazarken olduğu gibi. ` +
    `Sonunda yanlış kalan puanlanır: bu yüzden bırakılan ` +
    `bir hata, sıkı yazmadaki bir yanlış tuştan on kat ağır basar ` +
    `(${FEHLER_GEWICHT} karakter yerine ${FEHLER_GEWICHT_FREI} karakter), çünkü ` +
    `düzeltilen yanlışlar sayılmaz. Backspace tuşu o anki satırda düzeltir.`,
  text:
    `Her tuş grubu için ${PROBEN_JE_NIVEAU} metin var. Aynı tuşlarla yapılan bir ` +
    `sonraki yarışma, geçen sefer en ileri giden öğrencinin kaldığı yerden başlar: ` +
    `bir sonraki satırdan, cümleli metinlerde bir sonraki cümlenin başından. Bir ` +
    `metin bitince ara vermeden sonraki başlar.`,
  fehlerFrei:
    `Sonunda yanlış kalan - kelime başına en çok bir hata: yanlış, eksik ya da ` +
    `fazla bir kelime veya eksik bir boşluk. Düzeltilen yerler sayılmaz, yarım ` +
    `kalan son kelime de sayılmaz.`,
  korrekturen:
    `O anki satırda bir yeri düzeltmek için Backspace tuşuna kaç kez basıldığı. ` +
    `Yalnızca bilgi için - hiçbir puanı etkilemez.`,
};

/*
 * ★ O-CS (03.10.2026): Zahl + Hauptwort mit allen vier Formen (Glossar §2.11) -
 * die Zahlen kommen aus Konstanten und dürfen sich ändern, ohne dass „5 znaky"
 * entsteht. Die Formen gelten für die Stelle, an der sie stehen.
 */
/** „jako 5 znaků", „kratší než 200 znaků" - Nominativ. */
const znakyCs = (n: number): string =>
  mehrzahl(n, "cs", { one: (z) => `${z} znak`, few: (z) => `${z} znaky`, many: (z) => `${z} znaku`, other: (z) => `${z} znaků` });
/** „do 240 úhozů" - Genitiv. */
const uhozuGenCs = (n: number): string =>
  mehrzahl(n, "cs", { one: (z) => `${z} úhozu`, few: (z) => `${z} úhozů`, many: (z) => `${z} úhozu`, other: (z) => `${z} úhozů` });
/** „mají 10 minut" - Akkusativ (Einzahl „minutu"). */
const minutAkkCs = (n: number): string =>
  mehrzahl(n, "cs", { one: (z) => `${z} minutu`, few: (z) => `${z} minuty`, many: (z) => `${z} minuty`, other: (z) => `${z} minut` });
/** „je k dispozici 15 textů" - das Verb zieht mit. */
const textyKDispoziciCs = (n: number): string =>
  mehrzahl(n, "cs", {
    one: (z) => `je k dispozici ${z} text`,
    few: (z) => `jsou k dispozici ${z} texty`,
    many: (z) => `je k dispozici ${z} textu`,
    other: (z) => `je k dispozici ${z} textů`,
  });

/**
 * ★★★ DIESELBEN HINWEISE TSCHECHISCH (O-CS, 03.10.2026) - neu geschrieben.
 * Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten. Wörter nach dem
 * Glossar Tschechisch §2.2/§2.3: *Výzva* (gross wie ein Name, gebeugt
 * ausgeschrieben), *skóre*, *přesnost*, *překlep*, *použité
 * klávesy*, *čas Výzvy* (Prüfungszeit), *známka* nur als „Není to známka",
 * *odevzdat*; Lehrkraft vy, sonst Hauptwort-Sätze und „se"-Sätze, Kinder
 * „žáci"/„dítě". KEINE Vergangenheit über eine Person, keine Präposition fest
 * vor einer Zahl, „90 %" mit geschütztem Leerzeichen.
 */
export const HINWEIS_CHALLENGE_CS: Record<HinweisChallenge, string> = {
  bereit:
    `Připraveno znamená: Výzva dorazila do zařízení dítěte a je vidět její úvodní ` +
    `obrazovka. Kde připraveno ještě není, nemusí být otevřená stránka nebo chybí ` +
    `připojení k internetu - obvykle pomůže stránku jednou obnovit. Odevzdané ` +
    `práce se počítají také jako připravené.`,
  spalte:
    `První číslo: kolik Výzev bylo napsáno. Druhé číslo: průměrné skóre od 0 do 100 - ` +
    `počítá se jen to, co bylo dost dlouhé na hodnocení. Po rozbalení řádku je ` +
    `vidět každá Výzva zvlášť.`,
  niveau:
    `Které klávesy se v textu vyskytovaly - od základní řady po programový kód. ` +
    `Celá třída píše se stejnými klávesami.`,
  anschlaege:
    `Správně napsané znaky za minutu, měřeno hodinami Výzvy. Přemýšlení se počítá, ` +
    `čekání na předčítání ne.`,
  treffsicherheit: `Podíl správných úhozů ze všech úhozů.`,
  leistungswert:
    `Přesnost a rychlost v jednom čísle od 0 do 100, přičemž přesnost váží víc: jeden ` +
    `překlep se počítá jako ${znakyCs(FEHLER_GEWICHT)} a dvojnásobná rychlost se ` +
    `nepočítá dvojnásobně (rychlost se počítá nejvýše do ${uhozuGenCs(BEZUGSTEMPO)} ` +
    `za minutu). Výsledek kratší než ${znakyCs(MIND_ZEICHEN_WERTUNG)} skóre nemá. ` +
    `Není to známka.`,
  rang:
    `Procento z nejlepšího výsledku v této jedné Výzvě: nejlepší výsledek má ` +
    `100 %. Napříč více Výzvami pořadí nic neříká - k tomu slouží skóre.`,
  zeichen: `Správně napsané znaky včetně mezer.`,
  fehler:
    `Každý překlep cestou, i ten hned opravený. Na konci je text vždy napsaný ` +
    `správně.`,
  zeilen: `Kolik řádků textu bylo napsáno celých.`,
  schreibzeit: `Čas na hodinách Výzvy bez čekání na předčítání - přemýšlení se počítá.`,
  vorlesezeit:
    `Jak dlouho aplikace předčítala, zatímco se čekalo. Tento čas se odečetl od ` +
    `času Výzvy - když se psalo dál, zatímco hlas mluvil, nic se za to neodečítá.`,
  vorlesen:
    `Zda aplikace předčítala - a kolik času čekání na hlas se proto odečetlo od ` +
    `času Výzvy. Ve Výzvě aplikace předčítá, pokud má dítě zapnuté vlastní ` +
    `předčítání - stejně jako při cvičení.`,
  zuschlagErgebnis: `O kolik procent se prodloužil čas Výzvy.`,
  wacklig:
    `Klávesy, které se objevily aspoň ${WACKLIG_MIND_DRAN}krát a jejich přesnost ` +
    `byla nižší než ${Math.round(WACKLIG_QUOTE * 100)} %. Tip, kde se vyplatí ` +
    `cvičit - ne diagnóza.`,
  tastaturniveau:
    `Které znaky se smějí v textu vyskytovat. Všechny děti ve třídě dostanou stejný ` +
    `text - i když je jejich vlastní pokrok níž nebo výš.`,
  start:
    `Čas spuštění Výzvy. Od té chvíle mají žáci ${minutAkkCs(EINSTIEGSFENSTER_MIN)} ` +
    `na to, aby začali psát.`,
  jetztStarten:
    `Spustí Výzvu hned pro celou třídu - s klávesami a časem nastavenými výše. Od té ` +
    `chvíle mají žáci ${minutAkkCs(EINSTIEGSFENSTER_MIN)} na to, aby začali psát.`,
  pruefungszeit:
    `Jak dlouho píše každé dítě (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} min). ` +
    `Čas běží pro každé dítě zvlášť od jeho prvního stisku klávesy.`,
  vorlesenErlaubt:
    `Ve Výzvě aplikace předčítá dětem, které mají zapnuté vlastní předčítání - ` +
    `stejně jako při cvičení, bez zvláštního zaškrtávacího políčka pro vyučující. ` +
    `Čekání na hlas se přitom odečítá od času Výzvy.`,
  artStreng:
    `Jako dosud: po chybné klávese kurzor nepostoupí, každý překlep se počítá - ` +
    `i ten hned opravený.`,
  artFrei:
    `Chyby při psaní zůstávají a NEJSOU označené - jako při opisu textu. Hodnotí ` +
    `se, co je na konci špatně: ponechaná chyba proto váží desetkrát víc než ` +
    `překlep v přísném režimu (${znakyCs(FEHLER_GEWICHT_FREI)} místo ` +
    `${FEHLER_GEWICHT}), protože opravené chyby se nepočítají. Klávesou Backspace ` +
    `se opravuje v aktuálním řádku.`,
  text:
    `Pro každou volbu kláves ${textyKDispoziciCs(PROBEN_JE_NIVEAU)}. Další Výzva se ` +
    `stejnými klávesami začne tam, kam se ve třídě minule došlo nejdál: na dalším ` +
    `řádku, u textů s větami na začátku další věty. Když text skončí, bez ` +
    `přestávky pokračuje další.`,
  fehlerFrei:
    `Co je na konci ještě špatně - nejvýše jedna chyba na slovo: chybné, chybějící ` +
    `nebo přebývající slovo, nebo chybějící mezera. Opravená místa se nepočítají, ` +
    `stejně jako poslední nedopsané slovo.`,
  korrekturen:
    `Kolikrát se stiskla klávesa Backspace, aby se opravilo místo v aktuálním ` +
    `řádku. Jen pro informaci - do hodnocení se nepočítá.`,
};

/**
 * ★ O2-LIB (30.10.2026): DIESELBEN HINWEISE BULGARISCH - gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten.
 * Wörter nach dem Glossar Bulgarisch: Предизвикателство (Tippchallenge), резултат (Leistungswert), точност, погрешен
 * клавиш, използвани клавиши, време на Предизвикателството, оценка nur als „Не е оценка", предай. Lehrkraft Вие
 * (-ете), Kinder ти; Sätze über die Sache, keine Vergangenheit in der 2. Person (Geschlecht). Prozent ohne Leerzeichen.
 */
/** ★ O2-LIB (30.10.2026): „1 знак · 5 знака" - die Zählform nach einer Zahl, bulgarisch. */
const znakBg = (n: number): string =>
  mehrzahl(n, "bg", { one: (z) => `${z} знак`, other: (z) => `${z} знака` });

/** ★ O2-LIB (30.10.2026): „1 минута · 10 минути", bulgarisch. */
const minutiBg = (n: number): string =>
  mehrzahl(n, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` });

/** ★ O2-LIB (30.10.2026): „има 1 текст · има 15 текста", bulgarisch. */
const textoveBg = (n: number): string =>
  mehrzahl(n, "bg", { one: (z) => `има ${z} текст`, other: (z) => `има ${z} текста` });

export const HINWEIS_CHALLENGE_BG: Record<HinweisChallenge, string> = {
  bereit:
    `Готов означава: Предизвикателството е стигнало до устройството на ученика и началният екран се вижда. ` +
    `Ако някой още не е готов, може страницата да не е отворена или да няма връзка с интернет - ` +
    `обикновено помага страницата да се презареди веднъж. Предалите работата също се броят за готови.`,
  spalte:
    `Първо число: колко Предизвикателства са написани. Второ число: средният резултат от 0 до 100 - ` +
    `броят се само работите, които са били достатъчно дълги за резултат. Разгъването на реда показва ` +
    `всяко Предизвикателство поотделно.`,
  niveau:
    `Кои клавиши са се срещали в текста - от основния ред до програмния код. ` +
    `Целият клас пише със същите клавиши.`,
  anschlaege:
    `Правилно написани знаци в минута, измерени по часовника на Предизвикателството. ` +
    `Мисленето се брои, чакането на четенето на глас не се брои.`,
  treffsicherheit: `Делът на правилните натискания от всички натискания.`,
  leistungswert:
    `Точност и скорост в едно число от 0 до 100, като точността тежи повече: един погрешен клавиш ` +
    `се брои като ${znakBg(FEHLER_GEWICHT)}, а двойна скорост не се брои двойно (скоростта се брои най-много ` +
    `до ${BEZUGSTEMPO} знака в минута). Под ${znakBg(MIND_ZEICHEN_WERTUNG)} няма резултат. ` +
    `Не е оценка.`,
  rang:
    `Процент от най-добрия резултат в това едно Предизвикателство: най-добрият резултат има 100%. ` +
    `При няколко Предизвикателства мястото не казва нищо - за това служи резултатът.`,
  zeichen: `Правилно написани знаци, включително интервалите.`,
  fehler:
    `Всеки погрешен клавиш по пътя, дори и веднага поправеният. В края текстът винаги е написан ` +
    `правилно.`,
  zeilen: `Колко реда от текста са написани докрай.`,
  schreibzeit:
    `Времето по часовника на Предизвикателството без чакането на четенето на глас - мисленето се брои.`,
  vorlesezeit:
    `Колко дълго приложението е четяло на глас, докато никой не е писал. Това време е извадено от ` +
    `времето на Предизвикателството - ако се е писало и докато гласът е говорел, за това нищо не се вади.`,
  vorlesen:
    `Дали приложението е четяло на глас - и колко време за чакане на гласа е извадено от времето на ` +
    `Предизвикателството. В Предизвикателството приложението чете на глас, ако ученикът е включил ` +
    `собственото си четене на глас - както при упражняване.`,
  zuschlagErgebnis: `С колко процента е удължено времето на Предизвикателството.`,
  wacklig:
    `Клавиши, които са се появили поне ${WACKLIG_MIND_DRAN} пъти и са написани правилно в по-малко от ` +
    `${Math.round(WACKLIG_QUOTE * 100)}% от случаите. Насока къде си струва да се упражнява - не диагноза.`,
  tastaturniveau:
    `Кои знаци може да съдържа текстът. Всички ученици в класа получават един и същ текст - ` +
    `дори собственият им напредък да е по-нисък или по-висок.`,
  start:
    `Кога е започнало Предизвикателството. Оттогава учениците имат ${minutiBg(EINSTIEGSFENSTER_MIN)}, ` +
    `за да започнат да пишат.`,
  jetztStarten:
    `Започва Предизвикателството веднага за целия клас - с клавишите и времето, зададени по-горе. ` +
    `Оттогава учениците имат ${minutiBg(EINSTIEGSFENSTER_MIN)}, за да започнат да пишат.`,
  pruefungszeit:
    `Колко дълго пише всеки ученик (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} мин). ` +
    `Времето тече за всеки ученик поотделно, от първото натискане на клавиш.`,
  vorlesenErlaubt:
    `В Предизвикателството приложението чете на глас на учениците, които са включили собственото си ` +
    `четене на глас - както при упражняване, без отделно поле за отметка за учителите. ` +
    `Чакането на гласа се изважда от времето на Предизвикателството.`,
  artStreng:
    `Както досега: след погрешен клавиш курсорът не напредва, всеки погрешен клавиш се брои - ` +
    `дори поправеният веднага.`,
  artFrei:
    `Грешките остават както са написани и НЕ се отбелязват - както при преписване на текст. ` +
    `Оценява се това, което в края още е грешно: останала грешка тежи десет пъти повече от погрешен клавиш ` +
    `при вида Строго (${znakBg(FEHLER_GEWICHT_FREI)} вместо ${FEHLER_GEWICHT}), защото поправените грешки не ` +
    `се броят. С Backspace се поправя в текущия ред.`,
  text:
    `За всеки избор на клавиши ${textoveBg(PROBEN_JE_NIVEAU)}. Следващото Предизвикателство със същите ` +
    `клавиши започва там, докъдето в класа е стигнал най-напредналият миналия път: на следващия ред, а при ` +
    `текстове с изречения - в началото на следващото изречение. Когато един текст свърши, следващият ` +
    `продължава без прекъсване.`,
  fehlerFrei:
    `Какво в края още е грешно - най-много една грешка на дума: грешна, липсваща или излишна дума, ` +
    `или липсващ интервал. Поправените места не се броят, както и последната недовършена дума.`,
  korrekturen:
    `Колко пъти е натиснат Backspace, за да се поправи място в текущия ред. Само за информация - ` +
    `не влияе на резултата.`,
};

/*
 * ★ O2-LIB (30.10.2026): Zahl + Hauptwort griechisch (Glossar §2.11) - die Zahlen kommen aus Konstanten
 * und dürfen sich ändern, ohne dass „1 χαρακτήρες" entsteht. Die Formen gelten für die Stelle, an der sie stehen.
 */
/** „όσο 5 χαρακτήρες", „λιγότερους από 200 χαρακτήρες" - Akkusativ. */
const charsEl = (n: number): string =>
  mehrzahl(n, "el", { one: (z) => `${z} χαρακτήρα`, other: (z) => `${z} χαρακτήρες` });

/** „έως 240 πατήματα" - das Pressen einer Taste ist ein Anschlag. */
const pressesEl = (n: number): string =>
  mehrzahl(n, "el", { one: (z) => `${z} πάτημα`, other: (z) => `${z} πατήματα` });

/** „έχουν 10 λεπτά". */
const minEl = (n: number): string =>
  mehrzahl(n, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` });

/** „υπάρχουν 15 κείμενα" - das Verb zieht mit. */
const textsEl = (n: number): string =>
  mehrzahl(n, "el", { one: (z) => `υπάρχει ${z} κείμενο`, other: (z) => `υπάρχουν ${z} κείμενα` });

/**
 * ★★★ O2-LIB (30.10.2026): DIESELBEN HINWEISE GRIECHISCH - an die Lehrkraft (εσείς), ohne Person als Subjekt
 * (Glossar Regel 2). Gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten. Wörter nach dem Glossar:
 * Πρόκληση (§2.3, groß wie ein Name), σκορ, ακρίβεια, λάθος πλήκτρο, πατήματα (Regel 6), αβέβαια πλήκτρα,
 * εκφώνηση. Das Wort „βαθμός" nur als „Δεν είναι βαθμός". Prozent ohne Leerzeichen (Regel 5), kein
 * Semikolon als Satzzeichen (Griechisch: Fragezeichen).
 */
export const HINWEIS_CHALLENGE_EL: Record<HinweisChallenge, string> = {
  bereit:
    `Έτοιμα σημαίνει ότι η Πρόκληση έφτασε στη συσκευή του παιδιού και εμφανίζεται η αρχική οθόνη. ` +
    `Παιδιά που δεν είναι ακόμα έτοιμα ίσως δεν έχουν ανοιχτή τη σελίδα ή δεν έχουν σύνδεση ` +
    `στο διαδίκτυο - συνήθως βοηθά μία ανανέωση της σελίδας. Όσα παιδιά έχουν ήδη παραδώσει ` +
    `θεωρούνται έτοιμα.`,
  spalte:
    `Πρώτος αριθμός: πόσες Προκλήσεις έχουν γραφτεί. Δεύτερος αριθμός: το μέσο σκορ, από 0 ` +
    `έως 100 - προσμετράται μόνο ό,τι ήταν αρκετά μεγάλο για να υπολογιστεί σκορ. Με το άνοιγμα ` +
    `της γραμμής φαίνεται κάθε Πρόκληση χωριστά.`,
  niveau:
    `Ποια πλήκτρα εμφανίζονταν στο κείμενο - από τη βασική σειρά μέχρι τον κώδικα ` +
    `προγραμμάτων. Όλο το τμήμα γράφει με τα ίδια πλήκτρα.`,
  anschlaege:
    `Σωστά πατήματα ανά λεπτό, μετρημένα με το ρολόι της Πρόκλησης. Ο χρόνος σκέψης ` +
    `προσμετράται, η αναμονή για την εκφώνηση όχι.`,
  treffsicherheit: `Το ποσοστό των σωστών πατημάτων επί όλων των πατημάτων.`,
  leistungswert:
    `Ακρίβεια και ταχύτητα σε έναν αριθμό από 0 έως 100. Η ακρίβεια μετράει περισσότερο: ` +
    `ένα λάθος πλήκτρο μετράει όσο ${charsEl(FEHLER_GEWICHT)} και διπλάσια ταχύτητα δεν ` +
    `μετράει διπλάσια (η ταχύτητα προσμετράται έως ${pressesEl(BEZUGSTEMPO)} ανά λεπτό). ` +
    `Με λιγότερους από ${charsEl(MIND_ZEICHEN_WERTUNG)} δεν υπάρχει σκορ. Δεν είναι βαθμός.`,
  rang:
    `Ποσοστό του καλύτερου αποτελέσματος σε αυτή τη μία Πρόκληση: το καλύτερο αποτέλεσμα έχει ` +
    `100%. Σε περισσότερες Προκλήσεις η θέση δεν λέει τίποτα - για αυτό υπάρχει το σκορ.`,
  zeichen: `Σωστά γραμμένοι χαρακτήρες, μαζί με τα διαστήματα.`,
  fehler:
    `Κάθε λάθος πλήκτρο στη διαδρομή, ακόμα και όταν διορθώθηκε αμέσως. Στο τέλος το κείμενο ` +
    `είναι πάντα σωστό.`,
  zeilen: `Πόσες γραμμές του κειμένου γράφτηκαν ολόκληρες.`,
  schreibzeit:
    `Ο χρόνος στο ρολόι της Πρόκλησης χωρίς την αναμονή για την εκφώνηση - ο χρόνος σκέψης ` +
    `προσμετράται.`,
  vorlesezeit:
    `Πόση ώρα εκφωνούσε η εφαρμογή ενώ κανείς δεν έγραφε. Αυτός ο χρόνος αφαιρέθηκε από τη ` +
    `διάρκεια της Πρόκλησης. Αν συνεχιζόταν η γραφή ενώ μιλούσε η φωνή, δεν αφαιρείται τίποτα ` +
    `για αυτόν τον χρόνο.`,
  vorlesen:
    `Αν η εφαρμογή εκφωνούσε - και πόσος χρόνος αναμονής για τη φωνή αφαιρέθηκε έτσι από τη ` +
    `διάρκεια της Πρόκλησης. Στην Πρόκληση η εφαρμογή εκφωνεί όταν το παιδί έχει ενεργή τη ` +
    `δική του εκφώνηση - όπως και στην εξάσκηση.`,
  zuschlagErgebnis: `Κατά πόσο τοις εκατό παρατάθηκε η διάρκεια της Πρόκλησης.`,
  wacklig:
    `Πλήκτρα που εμφανίστηκαν τουλάχιστον ${WACKLIG_MIND_DRAN} φορές και γράφτηκαν σωστά σε ` +
    `λιγότερο από ${Math.round(WACKLIG_QUOTE * 100)}% των περιπτώσεων. Μια ένδειξη για το πού ` +
    `αξίζει η εξάσκηση - όχι διάγνωση.`,
  tastaturniveau:
    `Ποιοι χαρακτήρες επιτρέπεται να υπάρχουν στο κείμενο. Όλα τα παιδιά του τμήματος παίρνουν ` +
    `το ίδιο κείμενο - ακόμα και αν η δική τους πρόοδος είναι χαμηλότερα ή ψηλότερα.`,
  start:
    `Η ώρα που ξεκίνησε η Πρόκληση. Από τότε τα παιδιά έχουν ${minEl(EINSTIEGSFENSTER_MIN)} ` +
    `για να αρχίσουν να γράφουν.`,
  jetztStarten:
    `Ξεκινά την Πρόκληση αμέσως για όλο το τμήμα - με τα πλήκτρα και τη διάρκεια που έχουν ` +
    `οριστεί παραπάνω. Από τότε τα παιδιά έχουν ${minEl(EINSTIEGSFENSTER_MIN)} για να ` +
    `αρχίσουν να γράφουν.`,
  pruefungszeit:
    `Πόση ώρα γράφει κάθε παιδί (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} λεπτά). Ο χρόνος ` +
    `τρέχει χωριστά για κάθε παιδί, από το πρώτο του πάτημα πλήκτρου.`,
  vorlesenErlaubt:
    `Στην Πρόκληση η εφαρμογή εκφωνεί στα παιδιά που έχουν ενεργή τη δική τους εκφώνηση - ` +
    `όπως και στην εξάσκηση, χωρίς ξεχωριστό πλαίσιο επιλογής για τον εκπαιδευτικό. Ο χρόνος ` +
    `αναμονής για τη φωνή αφαιρείται από τη διάρκεια της Πρόκλησης.`,
  artStreng:
    `Όπως μέχρι τώρα: μετά από λάθος πλήκτρο ο δρομέας δεν προχωρά, κάθε λάθος πλήκτρο ` +
    `μετράει - ακόμα και αυτό που διορθώθηκε αμέσως.`,
  artFrei:
    `Τα λάθη μένουν όπως γράφτηκαν και ΔΕΝ επισημαίνονται - όπως σε μια υπαγόρευση. ` +
    `Μετράει ό,τι είναι ακόμα λάθος στο τέλος: ένα λάθος που έμεινε μετράει έτσι δέκα φορές ` +
    `περισσότερο από ένα λάθος πλήκτρο στην επιλογή Αυστηρά ` +
    `(${charsEl(FEHLER_GEWICHT_FREI)} αντί για ${FEHLER_GEWICHT}), επειδή τα διορθωμένα λάθη ` +
    `δεν προσμετρώνται. Με το Backspace γίνεται διόρθωση μέσα στην τρέχουσα γραμμή.`,
  text:
    `Για κάθε επιλογή πλήκτρων ${textsEl(PROBEN_JE_NIVEAU)}. Η επόμενη Πρόκληση με τα ίδια ` +
    `πλήκτρα ξεκινά εκεί που έφτασε πιο μακριά το τμήμα την τελευταία φορά: στην επόμενη ` +
    `γραμμή ή, στα κείμενα με προτάσεις, στην αρχή της επόμενης πρότασης. Όταν τελειώνει ένα ` +
    `κείμενο, το επόμενο ακολουθεί χωρίς διάλειμμα.`,
  fehlerFrei:
    `Ό,τι είναι ακόμα λάθος στο τέλος - το πολύ ένα λάθος ανά λέξη: μια λάθος λέξη, μια λέξη ` +
    `που λείπει ή περισσεύει, ή ένα διάστημα που λείπει. Τα διορθωμένα σημεία δεν ` +
    `προσμετρώνται, ούτε η τελευταία, ημιτελής λέξη.`,
  korrekturen:
    `Πόσες φορές πατήθηκε το Backspace για να διορθωθεί ένα σημείο στην τρέχουσα γραμμή. Μόνο ` +
    `ως πληροφορία - δεν επηρεάζει το σκορ.`,
};

/**
 * ★★★ O2-LIB (30.10.2026): DIESELBEN HINWEISE UNGARISCH - neu geschrieben, nach dem Glossar Ungarisch
 * (pontszám, pontosság, elütés, Kihívás, beadás); Lehrkraft-Sicht ohne Anrede (Regel 1), nach einer
 * Zahl die Einzahl (Regel 13), „95%" ohne Leerzeichen (Regel 5). Gleiche Schlüssel, gleiche Zahlen
 * aus denselben Konstanten.
 */
export const HINWEIS_CHALLENGE_HU: Record<HinweisChallenge, string> = {
  bereit:
    `„Készen” azt jelenti: a Kihívás megérkezett a tanuló eszközére, és a tanuló látja az ` +
    `indítóképernyőt. Ha valaki még nem áll készen, lehet, hogy nincs megnyitva az oldal, ` +
    `vagy nincs internetkapcsolat - az oldal egyszeri újratöltése általában segít. Aki már ` +
    `beadta, az készen állónak számít.`,
  spalte:
    `Első szám: hány Kihívás készült. Második szám: az átlagos pontszám 0 és 100 között - ` +
    `csak az számít, ami elég hosszú volt az értékeléshez. A sor kibontása után minden ` +
    `Kihívás külön látható.`,
  niveau:
    `Mely billentyűk szerepeltek a szövegben - az alapsortól a programkódig. Az osztály ` +
    `minden tanulója ugyanazokkal a billentyűkkel gépel.`,
  anschlaege:
    `Helyesen leírt karakterek percenként, a Kihívás órája szerint mérve. A gondolkodás ` +
    `ideje beleszámít, a felolvasásra várakozás nem.`,
  treffsicherheit: `A helyes leütések aránya az összes leütésből.`,
  leistungswert:
    `A pontosság és a sebesség egyetlen, 0 és 100 közötti számban. A pontosság többet nyom ` +
    `a latba: egy elütés ${FEHLER_GEWICHT} karakternek számít, a kétszeres sebesség pedig ` +
    `nem számít kétszeresnek (a sebesség legfeljebb ${BEZUGSTEMPO} leütés/percig számít). ` +
    `${MIND_ZEICHEN_WERTUNG} karakternél rövidebb szövegre nincs pontszám. Nem érdemjegy.`,
  rang:
    `Az adott Kihívás legjobb eredményének százaléka: a legjobb eredmény 100%. Több ` +
    `Kihívás között a helyezés nem mond semmit - arra való a pontszám.`,
  zeichen: `Helyesen leírt karakterek, a szóközökkel együtt.`,
  fehler:
    `Minden elütés útközben, az azonnal kijavított is. A végén a szöveg mindig helyes.`,
  zeilen: `A szöveg hány sorát írták le teljesen.`,
  schreibzeit:
    `A Kihívás órájának ideje, a felolvasásra várakozás nélkül - a gondolkodás ideje ` +
    `beleszámít.`,
  vorlesezeit:
    `Mennyi ideig olvasott fel az alkalmazás, miközben senki nem gépelt. Ezt az időt ` +
    `levonták a Kihívás idejéből - aki közben tovább gépelt, miközben a hang beszélt, annak ` +
    `ezért nem vonnak le semmit.`,
  vorlesen:
    `Felolvasott-e az alkalmazás - és ezért mennyi, a hangra várakozással töltött időt ` +
    `vontak le a Kihívás idejéből. A Kihívásban az alkalmazás akkor olvas fel, ha a tanuló ` +
    `bekapcsolta a saját felolvasását - ugyanúgy, mint gyakorláskor.`,
  zuschlagErgebnis: `Mennyi pótidő volt, a Kihívás idejének százalékában.`,
  wacklig:
    `Olyan billentyűk, amelyek legalább ${WACKLIG_MIND_DRAN} alkalommal előfordultak, és a ` +
    `leütéseiknek kevesebb mint ${Math.round(WACKLIG_QUOTE * 100)}%-a volt helyes. Támpont ` +
    `arra, hol érdemes gyakorolni - nem diagnózis.`,
  tastaturniveau:
    `Milyen karakterek szerepelhetnek a szövegben. Az osztály minden tanulója ugyanazt a ` +
    `szöveget kapja - akkor is, ha a saját haladása ennél alacsonyabb vagy magasabb.`,
  start:
    `A Kihívás indításának ideje. Ettől kezdve ${EINSTIEGSFENSTER_MIN} perc áll a tanulók ` +
    `rendelkezésére a kezdéshez.`,
  jetztStarten:
    `Azonnal elindítja a Kihívást az egész osztálynak - a fent beállított billentyűkkel és ` +
    `idővel. Ettől kezdve ${EINSTIEGSFENSTER_MIN} perc áll a tanulók rendelkezésére a ` +
    `kezdéshez.`,
  pruefungszeit:
    `Mennyi ideig gépel egy-egy tanuló (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} perc). ` +
    `Mindenkinek külön fut az ideje, az első leütéstől számítva.`,
  vorlesenErlaubt:
    `A Kihívásban az alkalmazás felolvas azoknak a tanulóknak, akik bekapcsolták a saját ` +
    `felolvasásukat - ugyanúgy, mint gyakorláskor, külön jelölőnégyzet nélkül a tanár ` +
    `számára. A hangra várakozás ideje levonódik a Kihívás idejéből.`,
  artStreng:
    `Mint eddig: hibás billentyűnél a kurzor nem lép tovább, minden elütés számít - az ` +
    `azonnal kijavított is.`,
  artFrei:
    `A hibák úgy maradnak, ahogy le lettek írva, és NINCSENEK megjelölve. Az számít, ami a ` +
    `végén még hibás: a benne hagyott hiba ezért tízszer annyit nyom a latba, mint egy ` +
    `elütés a szigorú módban (${FEHLER_GEWICHT_FREI} karakter ${FEHLER_GEWICHT} helyett), ` +
    `mert a kijavított hibák nem számítanak. A Backspace billentyűvel az aktuális soron ` +
    `belül lehet javítani.`,
  text:
    `Minden billentyűkészlethez ${PROBEN_JE_NIVEAU} szöveg tartozik. Az ugyanazokkal a ` +
    `billentyűkkel indított következő Kihívás ott folytatódik, ahol a legutóbb a legtovább ` +
    `jutó tanuló megállt: a következő sornál, mondatokból álló szövegeknél a következő ` +
    `mondat elején. Ha egy szöveg véget ér, szünet nélkül jön a következő.`,
  fehlerFrei:
    `Ami a végén még hibás - szavanként legfeljebb egy hiba: hibás, hiányzó vagy felesleges ` +
    `szó, illetve hiányzó szóköz. A kijavított helyek nem számítanak, és az utolsó, ` +
    `befejezetlen szó sem.`,
  korrekturen:
    `Hányszor nyomták meg a Backspace billentyűt, hogy az aktuális sorban kijavítsanak egy ` +
    `helyet. Csak tájékoztatásul - a pontszámot nem befolyásolja.`,
};

/**
 * ★ O2-LIB (30.10.2026): Zahl + Hauptwort, niederländisch (Glossar nl §2.11: one/other, "5 uur" bleibt
 * Einzahl; das Verb zieht mit). Die Zahlen kommen aus Konstanten und dürfen sich ändern.
 */
const tekensNl = (n: number): string =>
  mehrzahl(n, "nl", { one: (z) => `${z} teken`, other: (z) => `${z} tekens` });

const minutenNl = (n: number): string =>
  mehrzahl(n, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` });

/** "Er is 1 tekst" / "Er zijn 15 teksten" - das Verb zieht mit. */
const erZijnTekstenNl = (n: number): string =>
  mehrzahl(n, "nl", { one: (z) => `is er ${z} tekst`, other: (z) => `zijn er ${z} teksten` });

/**
 * ★★★ O2-LIB (30.10.2026): DIESELBEN HINWEISE NIEDERLÄNDISCH. Gleiche Schlüssel, gleiche Zahlen aus
 * denselben Konstanten. Wörter nach dem Glossar nl: Uitdaging (gross wie ein Name, auch in der Mehrzahl;
 * nie "toets"), score, nauwkeurigheid, verkeerde toets, duur van de Uitdaging, plaats, beoordeling,
 * leerling (Lehrkraft-Sicht), inleveren. Anrede der Lehrkraft: je, ohne hij/zij. "90%" ohne Leerzeichen.
 */
export const HINWEIS_CHALLENGE_NL: Record<HinweisChallenge, string> = {
  bereit:
    `Klaar betekent: de Uitdaging is op het apparaat van de leerling aangekomen en ` +
    `het startscherm is te zien. Wie nog niet klaar is, heeft de pagina misschien ` +
    `niet open of geen verbinding - de pagina een keer opnieuw laden helpt. Wie al ` +
    `heeft ingeleverd, telt als klaar.`,
  spalte:
    `Eerste getal: hoeveel Uitdagingen er zijn gemaakt. Tweede getal: de ` +
    `gemiddelde score van 0 tot 100 - alleen wat lang genoeg was voor een score ` +
    `telt mee. Uitklappen toont elke Uitdaging apart.`,
  niveau:
    `Welke toetsen in de tekst voorkwamen - van de basisrij tot programmacode. ` +
    `Iedereen in de klas typt met dezelfde toetsen.`,
  anschlaege:
    `Goed getypte tekens per minuut, gemeten met de klok van de Uitdaging. ` +
    `Nadenken telt mee, wachten op het voorlezen niet.`,
  treffsicherheit: `Het deel van alle aanslagen dat goed was.`,
  leistungswert:
    `Nauwkeurigheid en snelheid in één getal van 0 tot 100. Nauwkeurigheid weegt ` +
    `zwaarder: een verkeerde toets telt als ${tekensNl(FEHLER_GEWICHT)} en dubbele ` +
    `snelheid telt niet dubbel (snelheid telt mee tot ${BEZUGSTEMPO} aanslagen per ` +
    `minuut). Met minder dan ${tekensNl(MIND_ZEICHEN_WERTUNG)} is er geen score. ` +
    `Het is geen beoordeling.`,
  rang:
    `Percentage van het beste resultaat in deze ene Uitdaging: het beste resultaat ` +
    `krijgt 100%. Over meerdere Uitdagingen zegt de plaats niets - daarvoor dient ` +
    `de score.`,
  zeichen: `Goed getypte tekens, spaties meegerekend.`,
  fehler:
    `Elke verkeerde toets onderweg, ook als die meteen is verbeterd. Aan het eind ` +
    `is de tekst altijd goed.`,
  zeilen: `Hoeveel regels van de tekst helemaal zijn getypt.`,
  schreibzeit:
    `De tijd op de klok van de Uitdaging, min de tijd die is gewacht op het ` +
    `voorlezen - nadenken telt mee.`,
  vorlesezeit:
    `Hoe lang de app voorlas terwijl er niet werd getypt. Deze tijd is van de duur ` +
    `van de Uitdaging afgetrokken - wie doortypte terwijl de stem sprak, krijgt ` +
    `daarvoor niets afgetrokken.`,
  vorlesen:
    `Of de app heeft voorgelezen - en hoeveel wachttijd op de stem er daarom van ` +
    `de duur van de Uitdaging is afgetrokken. In de Uitdaging leest de app voor als ` +
    `de leerling zelf Voorlezen heeft aangezet - net als bij het oefenen.`,
  zuschlagErgebnis: `Hoeveel extra tijd er was, als percentage van de duur van de Uitdaging.`,
  wacklig:
    `Toetsen die minstens ${WACKLIG_MIND_DRAN} keer voorkwamen en minder dan ` +
    `${Math.round(WACKLIG_QUOTE * 100)}% van de keren goed zijn getypt. Een ` +
    `aanwijzing waar oefenen loont - geen diagnose.`,
  tastaturniveau:
    `Welke tekens er in de tekst mogen voorkomen. Elke leerling in de klas krijgt ` +
    `dezelfde tekst - ook als de eigen voortgang lager of hoger ligt.`,
  start:
    `Het moment waarop de Uitdaging is gestart. Vanaf dan hebben de leerlingen ` +
    `${minutenNl(EINSTIEGSFENSTER_MIN)} de tijd om te beginnen.`,
  jetztStarten:
    `Start de Uitdaging meteen voor de hele klas - met de toetsen en de duur die ` +
    `hierboven zijn ingesteld. Vanaf dan hebben de leerlingen ` +
    `${minutenNl(EINSTIEGSFENSTER_MIN)} de tijd om te beginnen.`,
  pruefungszeit:
    `Hoe lang elke leerling typt (${DAUER_MIN_KLEINST} tot ${DAUER_MIN_GROESST} ` +
    `minuten). De tijd loopt voor elke leerling apart, vanaf de eerste aanslag.`,
  vorlesenErlaubt:
    `In de Uitdaging leest de app voor aan leerlingen die zelf Voorlezen hebben ` +
    `aangezet - net als bij het oefenen, zonder apart vinkje voor de leerkracht. ` +
    `De wachttijd op de stem wordt van de duur van de Uitdaging afgetrokken.`,
  artStreng:
    `Zoals voorheen: na een verkeerde toets gaat de cursor niet verder, elke ` +
    `verkeerde toets telt - ook als die meteen is verbeterd.`,
  artFrei:
    `Fouten blijven staan zoals getypt en worden NIET gemarkeerd - zoals bij het ` +
    `overtypen van een tekst. Beoordeeld wordt wat aan het eind nog fout is: een ` +
    `fout die blijft staan telt daarom tien keer zo zwaar als een verkeerde toets ` +
    `bij Streng (${FEHLER_GEWICHT_FREI} in plaats van ${tekensNl(FEHLER_GEWICHT)}), ` +
    `omdat verbeterde fouten niet meetellen. Met Backspace verbeter je binnen de ` +
    `huidige regel.`,
  text:
    `Voor elke keuze van toetsen ${erZijnTekstenNl(PROBEN_JE_NIVEAU)}. De volgende ` +
    `Uitdaging met dezelfde toetsen begint waar de leerling die de vorige keer het ` +
    `verst kwam is gestopt: bij de volgende regel, of bij teksten met zinnen aan ` +
    `het begin van de volgende zin. Als een tekst afgelopen is, volgt de volgende ` +
    `zonder pauze.`,
  fehlerFrei:
    `Wat aan het eind nog fout is - hoogstens één fout per woord: een fout, ` +
    `ontbrekend of overbodig woord, of een ontbrekende spatie. Verbeterde plekken ` +
    `tellen niet mee, en het laatste, onafgemaakte woord ook niet.`,
  korrekturen:
    `Hoe vaak Backspace is gebruikt om een plek in de huidige regel te ` +
    `verbeteren. Alleen ter informatie - het heeft geen invloed op de score.`,
};

/**
 * ★ O2-LIB (30.10.2026): o Desafio em português (Portugal) - escrito com maiúscula como um nome
 * (Glossário pt §2.3); os mesmos valores que {@link pruefungWort}.
 */
const PRUEFUNG_WORT_PT = "Desafio";

const PRUEFUNG_WORT_MEHRZAHL_PT = "Desafios";

/** ★ O2-LIB (30.10.2026): "1 caráter · 5 carateres" (pt-PT, AO90) - o número vem de constantes. */
const carateresPt = (n: number): string =>
  mehrzahl(n, "pt", { one: (z) => `${z} caráter`, other: (z) => `${z} carateres`, many: (z) => `${z} de carateres` });

/** ★ O2-LIB (30.10.2026): "até 240 toques". */
const toquesPt = (n: number): string =>
  mehrzahl(n, "pt", { one: (z) => `${z} toque`, other: (z) => `${z} toques`, many: (z) => `${z} de toques` });

/** ★ O2-LIB (30.10.2026): "têm 10 minutos". */
const minutosPt = (n: number): string =>
  mehrzahl(n, "pt", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos`, many: (z) => `${z} de minutos` });

/** ★ O2-LIB (30.10.2026): "Há 15 textos" - o verbo acompanha o número. */
const haTextosPt = (n: number): string =>
  mehrzahl(n, "pt", { one: (z) => `Há ${z} texto`, other: (z) => `Há ${z} textos`, many: (z) => `Há ${z} de textos` });

/**
 * ★★★ O2-LIB (30.10.2026): os mesmos avisos em português (Portugal) - mesmas chaves, mesmos números
 * das mesmas constantes. Palavras do Glossário pt: Desafio, pontuação, precisão, tecla errada,
 * teclas usadas, tempo do Desafio, "Não é uma nota", entregar. Docentes sem pronome (imperativo),
 * sem adjetivo nem particípio colado a uma pessoa; "criança" e "quem" para os estudantes.
 */
export const HINWEIS_CHALLENGE_PT: Record<HinweisChallenge, string> = {
  bereit:
    `O estado Pronto significa que o ${PRUEFUNG_WORT_PT} chegou ao dispositivo da criança e que ela ` +
    `já vê o ecrã inicial. Quando o estado não aparece, a página pode não estar aberta ou pode ` +
    `faltar a ligação à internet - atualizar a página uma vez costuma bastar. Quem já entregou ` +
    `também tem o estado Pronto.`,
  spalte:
    `Primeiro número: quantos ${PRUEFUNG_WORT_MEHRZAHL_PT} foram feitos. Segundo número: a ` +
    `pontuação média, de 0 a 100 - só conta o que foi suficientemente longo para ser avaliado. ` +
    `Ao expandir a linha, vê cada ${PRUEFUNG_WORT_PT} em separado.`,
  niveau:
    `As teclas que o texto usou - da fila de base ao código de programação. Toda a turma ` +
    `escreve com as mesmas teclas.`,
  anschlaege:
    `Carateres escritos corretamente por minuto, medidos no relógio do ${PRUEFUNG_WORT_PT}. ` +
    `O tempo para pensar conta; a espera pela leitura em voz alta não.`,
  treffsicherheit: `A proporção de toques certos entre todos os toques.`,
  leistungswert:
    `Precisão e velocidade num só número, de 0 a 100. A precisão pesa mais: uma tecla errada ` +
    `conta tanto como ${carateresPt(FEHLER_GEWICHT)}, e o dobro da velocidade não conta a dobrar ` +
    `(a velocidade conta até ${toquesPt(BEZUGSTEMPO)} por minuto). Com menos de ` +
    `${carateresPt(MIND_ZEICHEN_WERTUNG)} não há pontuação. Não é uma nota.`,
  rang:
    `Percentagem do melhor resultado deste ${PRUEFUNG_WORT_PT}: o melhor tem 100%. Entre vários ` +
    `${PRUEFUNG_WORT_MEHRZAHL_PT}, o lugar não diz nada - para isso serve a pontuação.`,
  zeichen: `Carateres escritos corretamente, incluindo os espaços.`,
  fehler:
    `Cada tecla errada pelo caminho, mesmo a que foi corrigida logo a seguir. No fim, o texto ` +
    `fica sempre certo.`,
  zeilen: `Quantas linhas do texto foram escritas por inteiro.`,
  schreibzeit:
    `O tempo no relógio do ${PRUEFUNG_WORT_PT}, sem a espera pela leitura em voz alta - o tempo ` +
    `para pensar conta.`,
  vorlesezeit:
    `Durante quanto tempo a aplicação leu em voz alta enquanto ninguém escrevia. Este tempo foi ` +
    `descontado ao tempo do ${PRUEFUNG_WORT_PT} - quem continuou a escrever enquanto a voz falava ` +
    `não tem nada descontado por isso.`,
  vorlesen:
    `Se a aplicação leu em voz alta - e quanto tempo de espera pela voz foi por isso descontado ` +
    `ao tempo do ${PRUEFUNG_WORT_PT}. No ${PRUEFUNG_WORT_PT}, a aplicação lê em voz alta se a ` +
    `criança tiver ligado a sua própria leitura em voz alta - tal como na prática.`,
  zuschlagErgebnis: `Quanto tempo extra houve, em percentagem do tempo do ${PRUEFUNG_WORT_PT}.`,
  wacklig:
    `Teclas que apareceram pelo menos ${WACKLIG_MIND_DRAN} vezes e em que a precisão ficou ` +
    `abaixo de ${Math.round(WACKLIG_QUOTE * 100)}%. Uma pista sobre onde compensa praticar - ` +
    `não um diagnóstico.`,
  tastaturniveau:
    `Que carateres o texto pode conter. Todas as crianças da turma recebem o mesmo texto - ` +
    `mesmo que o seu próprio progresso esteja abaixo ou acima.`,
  start:
    `Quando o ${PRUEFUNG_WORT_PT} foi iniciado. A partir daí, os estudantes têm ` +
    `${minutosPt(EINSTIEGSFENSTER_MIN)} para começar.`,
  jetztStarten:
    `Começa o ${PRUEFUNG_WORT_PT} de imediato para a turma toda - com as teclas e o tempo ` +
    `definidos acima. A partir daí, os estudantes têm ${minutosPt(EINSTIEGSFENSTER_MIN)} para ` +
    `começar.`,
  pruefungszeit:
    `Durante quanto tempo escreve cada criança (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} min). ` +
    `O tempo de cada criança corre em separado, a partir do seu primeiro toque.`,
  vorlesenErlaubt:
    `No ${PRUEFUNG_WORT_PT}, a aplicação lê em voz alta às crianças que ligaram a sua própria ` +
    `leitura em voz alta - tal como na prática, sem caixa de verificação própria para docentes. ` +
    `O tempo de espera pela voz é descontado ao tempo do ${PRUEFUNG_WORT_PT}.`,
  artStreng:
    `Como até agora: uma tecla errada não avança, e cada tecla errada conta - mesmo a que é ` +
    `corrigida logo a seguir.`,
  artFrei:
    `Os erros ficam como foram escritos e NÃO são assinalados - como num ditado. Avalia-se o que ` +
    `continua errado no fim: um erro deixado por corrigir conta por isso dez vezes mais do que ` +
    `uma tecla errada no modo rigoroso (${FEHLER_GEWICHT_FREI} em vez de ` +
    `${carateresPt(FEHLER_GEWICHT)}), porque os erros corrigidos não contam. A tecla Backspace ` +
    `corrige dentro da linha atual.`,
  text:
    `${haTextosPt(PROBEN_JE_NIVEAU)} para cada seleção de teclas. O próximo ${PRUEFUNG_WORT_PT} ` +
    `com as mesmas teclas começa onde parou quem chegou mais longe da última vez: na linha ` +
    `seguinte ou, nos textos com frases, no início da frase seguinte. Quando um texto acaba, o ` +
    `seguinte continua sem pausa.`,
  fehlerFrei:
    `O que continua errado no fim - no máximo um erro por palavra: uma palavra errada, em falta ` +
    `ou a mais, ou um espaço em falta. Os pontos corrigidos não contam, nem a última palavra, ` +
    `por acabar.`,
  korrekturen:
    `Quantas vezes a tecla Backspace foi premida para corrigir um ponto da linha atual. Apenas ` +
    `informativo - não influencia a pontuação.`,
};

/*
 * ★ O2-LIB (30.10.2026): Zahl + Hauptwort für die Hinweise, Portugiesisch (Brasilien).
 * Die Zahlen kommen aus Konstanten; "one" gilt im brasilianischen Portugiesisch für 0 und 1.
 */
/** "como 5 caracteres", "menos de 200 caracteres". */
const caracteresBr = (n: number): string =>
  mehrzahl(n, "br", { one: (z) => `${z} caractere`, other: (z) => `${z} caracteres` });

/** "até 240 toques". */
const toquesBr = (n: number): string =>
  mehrzahl(n, "br", { one: (z) => `${z} toque`, other: (z) => `${z} toques` });

/** "têm 10 minutos". */
const minutosBr = (n: number): string =>
  mehrzahl(n, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` });

/** "há 15 textos" - das Verb zieht mit. */
const textosDisponiveisBr = (n: number): string =>
  mehrzahl(n, "br", { one: (z) => `há ${z} texto`, other: (z) => `há ${z} textos` });

/**
 * ★ O2-LIB (30.10.2026): dieselben Hinweise, Portugiesisch (Brasilien) - Glossar pt-BR:
 * Desafio (gross wie ein Name), pontuação, precisão, tecla errada, teclas usadas,
 * entregar; você bzw. Sätze über die Sache, nichts über das Geschlecht einer Person.
 */
export const HINWEIS_CHALLENGE_BR: Record<HinweisChallenge, string> = {
  bereit:
    `Pronto significa: o Desafio chegou ao dispositivo da criança e ela já vê a tela ` +
    `inicial. Se alguém ainda não está pronto, talvez a página não esteja aberta ou ` +
    `falte conexão - recarregar a página uma vez costuma resolver. O que já foi ` +
    `entregue também conta como pronto.`,
  spalte:
    `Primeiro número: quantos Desafios foram feitos. Segundo número: a pontuação ` +
    `média, de 0 a 100 - só conta o que foi longo o bastante para ser avaliado. ` +
    `Ao expandir a linha, cada Desafio aparece separado.`,
  niveau:
    `Quais teclas o texto usou - da fileira central até o código de programação. ` +
    `A turma toda digita com as mesmas teclas.`,
  anschlaege:
    `Caracteres digitados corretamente por minuto, medidos no relógio do Desafio. ` +
    `O tempo de reflexão conta; a espera pela leitura em voz alta não.`,
  treffsicherheit: `A proporção de toques corretos entre todos os toques.`,
  leistungswert:
    `Precisão e velocidade em um só número, de 0 a 100. A precisão pesa mais: ` +
    `uma tecla errada vale como ${caracteresBr(FEHLER_GEWICHT)}, e o dobro da ` +
    `velocidade não conta em dobro (a velocidade conta até ${toquesBr(BEZUGSTEMPO)} ` +
    `por minuto). Com menos de ${caracteresBr(MIND_ZEICHEN_WERTUNG)} não há pontuação. ` +
    `Não é uma nota.`,
  rang:
    `Porcentagem do melhor resultado neste Desafio: o melhor resultado tem ` +
    `100%. Entre vários Desafios a posição não diz nada - para isso existe a pontuação.`,
  zeichen: `Caracteres digitados corretamente, incluindo espaços.`,
  fehler:
    `Cada tecla errada pelo caminho, mesmo a corrigida na hora. No final o texto ` +
    `está sempre correto.`,
  zeilen: `Quantas linhas do texto foram digitadas por inteiro.`,
  schreibzeit:
    `O tempo no relógio do Desafio, sem a espera pela leitura em voz alta - o tempo ` +
    `de reflexão conta.`,
  vorlesezeit:
    `Por quanto tempo o aplicativo leu em voz alta enquanto ninguém digitava. Esse ` +
    `tempo foi descontado da duração do Desafio - quem continuou digitando enquanto ` +
    `a voz falava não tem nada descontado por isso.`,
  vorlesen:
    `Se o aplicativo leu em voz alta - e quanto tempo de espera pela voz foi ` +
    `descontado da duração do Desafio. No Desafio, o aplicativo lê em voz alta quando ` +
    `a própria leitura em voz alta está ativada - como na prática.`,
  zuschlagErgebnis: `Quanto tempo extra houve, em porcentagem da duração do Desafio.`,
  wacklig:
    `Teclas que apareceram pelo menos ${WACKLIG_MIND_DRAN} vezes e foram digitadas ` +
    `corretamente em menos de ${Math.round(WACKLIG_QUOTE * 100)}% das vezes. Uma pista ` +
    `de onde a prática compensa - não um diagnóstico.`,
  tastaturniveau:
    `Quais caracteres o texto pode conter. Todos da turma recebem o mesmo texto - ` +
    `mesmo que o próprio progresso esteja abaixo ou acima dele.`,
  start:
    `Quando o Desafio foi iniciado. A partir daí, os estudantes têm ` +
    `${minutosBr(EINSTIEGSFENSTER_MIN)} para começar a digitar.`,
  jetztStarten:
    `Inicia o Desafio agora mesmo para a turma toda - com as teclas e a duração ` +
    `definidas acima. A partir daí, os estudantes têm ${minutosBr(EINSTIEGSFENSTER_MIN)} ` +
    `para começar a digitar.`,
  pruefungszeit:
    `Por quanto tempo cada estudante digita (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} ` +
    `min). O tempo corre separadamente para cada pessoa, a partir do primeiro toque.`,
  vorlesenErlaubt:
    `No Desafio, o aplicativo lê em voz alta para quem ativou a própria leitura em ` +
    `voz alta - como na prática, sem uma caixa de seleção separada para docentes. ` +
    `A espera pela voz é descontada da duração do Desafio.`,
  artStreng:
    `Como antes: uma tecla errada não avança o cursor, e cada tecla errada conta - ` +
    `mesmo a corrigida na hora.`,
  artFrei:
    `Os erros ficam como foram digitados e NÃO são marcados - como na cópia de um ` +
    `texto. Vale o que continua errado no final: por isso um erro deixado pesa dez ` +
    `vezes mais do que uma tecla errada no modo rigoroso (${caracteresBr(FEHLER_GEWICHT_FREI)} ` +
    `em vez de ${FEHLER_GEWICHT}), pois erros corrigidos não contam. Com Backspace ` +
    `se corrige dentro da linha atual.`,
  text:
    `Para cada escolha de teclas ${textosDisponiveisBr(PROBEN_JE_NIVEAU)}. O próximo ` +
    `Desafio com as mesmas teclas começa onde a turma parou da última vez: na linha ` +
    `seguinte ou, em textos com frases, no início da frase seguinte. Quando um texto ` +
    `termina, o próximo continua sem pausa.`,
  fehlerFrei:
    `O que ainda está errado no final - no máximo um erro por palavra: uma palavra ` +
    `errada, faltando ou sobrando, ou um espaço faltando. Trechos corrigidos não ` +
    `contam, nem a última palavra, que ficou incompleta.`,
  korrekturen:
    `Quantas vezes Backspace foi pressionado para corrigir um trecho da linha ` +
    `atual. Só para informação - não entra na pontuação.`,
};

/**
 * ★ O2-LIB (30.10.2026): DIESELBEN HINWEISE RUMÄNISCH - gleiche Schlüssel, gleiche Zahlen aus
 * denselben Konstanten. Wörter nach dem Glossar Rumänisch: Provocare, scor, precizie, tastă
 * greșită, taste folosite, cadru didactic; Lehrkraft in der Höflichkeitsform (Mehrzahl),
 * Personen als „persoană"/„elevii", ohne Adjektive an Personen. „95 %" mit geschütztem Leerzeichen.
 */
export const HINWEIS_CHALLENGE_RO: Record<HinweisChallenge, string> = {
  bereit:
    `Pregătit înseamnă: Provocarea a ajuns pe dispozitivul persoanei, iar ecranul de ` +
    `start este vizibil. Dacă o persoană lipsește din număr, poate că pagina nu este ` +
    `deschisă sau lipsește conexiunea la internet - de obicei ajută o singură ` +
    `reîncărcare a paginii. Lucrările predate se numără ca pregătite.`,
  spalte:
    `Primul număr: câte Provocări au fost scrise. Al doilea număr: scorul mediu, de la ` +
    `0 la 100 - se numără doar ce a fost destul de lung pentru a fi evaluat. Prin ` +
    `deschiderea rândului se vede fiecare Provocare în parte.`,
  niveau:
    `Ce taste au apărut în text - de la șirul de bază până la codul de program. ` +
    `Toată clasa scrie cu aceleași taste.`,
  anschlaege:
    `Caractere scrise corect pe minut, măsurate cu ceasul Provocării. Gândirea se ` +
    `numără, așteptarea citirii cu voce tare nu.`,
  treffsicherheit: `Ponderea apăsărilor corecte din toate apăsările.`,
  leistungswert:
    `Precizia și viteza într-un singur număr de la 0 la 100. Precizia contează mai ` +
    `mult: o tastă greșită cântărește cât ${caractereRo(FEHLER_GEWICHT)}, iar viteza ` +
    `dublă nu contează dublu (viteza se numără până la ${caractereRo(BEZUGSTEMPO)} pe ` +
    `minut). Sub ${caractereRo(MIND_ZEICHEN_WERTUNG)} nu există scor. Nu este o notă.`,
  rang:
    `Procentul din cel mai bun rezultat dintr-o singură Provocare: cel mai bun ` +
    `rezultat are 100 %. La mai multe Provocări locul nu spune nimic - pentru asta ` +
    `există scorul.`,
  zeichen: `Caractere scrise corect, inclusiv spațiile.`,
  fehler:
    `Fiecare tastă greșită pe parcurs, chiar și una corectată imediat. La final textul ` +
    `este întotdeauna corect.`,
  zeilen: `Câte rânduri din text au fost scrise integral.`,
  schreibzeit:
    `Timpul de pe ceasul Provocării, fără așteptarea citirii cu voce tare - gândirea ` +
    `se numără.`,
  vorlesezeit:
    `Cât timp a citit aplicația cu voce tare, cât nu se scria. Acest timp a fost scăzut ` +
    `din durata Provocării - dacă se scria mai departe cât timp vorbea vocea, nu se ` +
    `scade nimic pentru aceasta.`,
  vorlesen:
    `Dacă aplicația a citit cu voce tare - și câtă așteptare a vocii a fost scăzută ` +
    `din durata Provocării. În Provocare aplicația citește cu voce tare dacă persoana ` +
    `are pornită propria citire cu voce tare - la fel ca la exersare.`,
  zuschlagErgebnis: `Cu câte procente s-a prelungit durata Provocării.`,
  wacklig:
    `Taste care au apărut de cel puțin ${oriRo(WACKLIG_MIND_DRAN)} și cu o precizie ` +
    `sub ${Math.round(WACKLIG_QUOTE * 100)} %. Un indiciu despre unde merită să se ` +
    `exerseze - nu un diagnostic.`,
  tastaturniveau:
    `Ce caractere poate conține textul. Toți elevii din clasă primesc același text - ` +
    `chiar dacă propriul progres este sub sau deasupra lui.`,
  start:
    `Momentul în care a început Provocarea. De atunci elevii au ` +
    `${minuteRo(EINSTIEGSFENSTER_MIN)} ca să înceapă să scrie.`,
  jetztStarten:
    `Pornește Provocarea imediat pentru toată clasa - cu tastele și durata stabilite ` +
    `mai sus. De atunci elevii au ${minuteRo(EINSTIEGSFENSTER_MIN)} ca să înceapă să ` +
    `scrie.`,
  pruefungszeit:
    `Cât timp scrie fiecare persoană (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} min). ` +
    `Timpul curge separat pentru fiecare persoană, de la prima ei apăsare de tastă.`,
  vorlesenErlaubt:
    `În Provocare, aplicația citește cu voce tare pentru persoanele care au pornită ` +
    `propria citire cu voce tare - la fel ca la exersare, fără o căsuță separată pentru ` +
    `cadrul didactic. Timpul de așteptare a vocii se scade din durata Provocării.`,
  artStreng:
    `Ca până acum: după o tastă greșită cursorul nu înaintează, fiecare tastă greșită ` +
    `se numără - chiar și una corectată imediat.`,
  artFrei:
    `Greșelile rămân așa cum au fost scrise și NU sunt marcate - ca la copierea unui ` +
    `text. Se evaluează ce este încă greșit la final: o greșeală lăsată în text ` +
    `cântărește de zece ori mai mult decât o tastă greșită în modul strict ` +
    `(${FEHLER_GEWICHT_FREI} în loc de ${caractereRo(FEHLER_GEWICHT)}), pentru că ` +
    `greșelile corectate nu se numără. Cu tasta Backspace se corectează în rândul ` +
    `curent.`,
  text:
    `Pentru fiecare alegere de taste ${texteRo(PROBEN_JE_NIVEAU)}. Următoarea Provocare ` +
    `cu aceleași taste începe de unde s-a oprit data trecută cea mai avansată persoană ` +
    `din clasă: la rândul următor sau, la textele cu propoziții, la începutul ` +
    `propoziției următoare. Când un text se termină, urmează următorul fără pauză.`,
  fehlerFrei:
    `Ce este încă greșit la final - cel mult o greșeală pe cuvânt: un cuvânt greșit, ` +
    `lipsă sau în plus, ori un spațiu lipsă. Locurile corectate nu se numără, nici ` +
    `ultimul cuvânt neterminat.`,
  korrekturen:
    `De câte ori s-a apăsat tasta Backspace pentru a corecta un loc din rândul curent. ` +
    `Doar pentru informare - nu influențează scorul.`,
};

/** ★ O2-LIB (30.10.2026): Zahl + Hauptwort, Rumänisch (one / few / other mit „de" ab 20). */
function caractereRo(n: number): string {
  return mehrzahl(n, "ro", { one: (z) => `${z} caracter`, few: (z) => `${z} caractere`, other: (z) => `${z} de caractere` });
}

/** „de cel puțin 20 de ori". */
function oriRo(n: number): string {
  return mehrzahl(n, "ro", { one: () => `o dată`, few: (z) => `${z} ori`, other: (z) => `${z} de ori` });
}

/** „elevii au 10 minute". */
function minuteRo(n: number): string {
  return mehrzahl(n, "ro", { one: () => `un minut`, few: (z) => `${z} minute`, other: (z) => `${z} de minute` });
}

/** „există 15 texte" - das Verb zieht mit. */
function texteRo(n: number): string {
  return mehrzahl(n, "ro", { one: () => `există un text`, few: (z) => `există ${z} texte`, other: (z) => `există ${z} de texte` });
}

/**
 * ★ O2-LIB (29.10.2026): DIESELBEN HINWEISE SCHWEDISCH. Gleiche Schlüssel, gleiche
 * Zahlen aus denselben Konstanten. Wörter nach dem Glossar Schwedisch: Utmaningen
 * (gross wie ein Name), poäng, träffsäkerhet, felslag, märke; du für alle, Kinder
 * als elever (Lehrkraft-Sicht).
 */
export const HINWEIS_CHALLENGE_SV: Record<HinweisChallenge, string> = {
  bereit:
    `Redo betyder: Utmaningen har nått elevens enhet och eleven ser nu startskärmen. ` +
    `Den som inte är redo har kanske inte sidan öppen eller saknar nätverk - det ` +
    `brukar hjälpa att läsa in sidan på nytt en gång. Den som redan har lämnat in ` +
    `räknas som redo.`,
  spalte:
    `Första talet: hur många Utmaningar som har skrivits. Andra talet: genomsnittlig ` +
    `poäng, från 0 till 100 - bara det som var långt nog för en bedömning räknas. ` +
    `Fäll ut raden så visas varje Utmaning för sig.`,
  niveau:
    `Vilka tangenter som fanns i texten - från grundraden till programkod. Alla i ` +
    `klassen skriver med samma tangenter.`,
  anschlaege:
    `Rätt skrivna tecken per minut, mätt med Utmaningens klocka. Betänketid räknas, ` +
    `väntan på uppläsningen räknas inte.`,
  treffsicherheit: `Andelen rätta anslag av alla anslag.`,
  leistungswert:
    `Träffsäkerhet och hastighet i ett tal från 0 till 100. Träffsäkerheten väger ` +
    `tyngre: ett felslag räknas som ${FEHLER_GEWICHT} tecken, och dubbel hastighet ` +
    `räknas inte dubbelt (hastigheten räknas upp till ${BEZUGSTEMPO} anslag per ` +
    `minut). Med färre än ${MIND_ZEICHEN_WERTUNG} tecken blir det ingen poäng. Det är ` +
    `inget betyg.`,
  rang:
    `Procent av det bästa resultatet i just den här Utmaningen: det bästa resultatet ` +
    `har 100 %. Över flera Utmaningar säger placeringen ingenting - det är ` +
    `poängen till för.`,
  zeichen: `Rätt skrivna tecken, mellanslag inräknade.`,
  fehler:
    `Varje felslag på vägen, även ett som rättades direkt. I slutet är texten alltid ` +
    `rätt.`,
  zeilen: `Hur många rader av texten som skrevs i sin helhet.`,
  schreibzeit:
    `Tiden på Utmaningens klocka minus väntan på uppläsningen - betänketid räknas.`,
  vorlesezeit:
    `Hur länge appen läste upp medan ingen skrev. Den tiden har dragits av från tiden ` +
    `för Utmaningen - den som fortsatte skriva medan rösten talade får inget avdrag ` +
    `för det.`,
  vorlesen:
    `Om appen läste upp - och hur mycket väntetid på rösten som därför drogs av från ` +
    `tiden för Utmaningen. I Utmaningen läser appen upp om eleven har slagit på sin ` +
    `egen uppläsning - precis som vid övning.`,
  zuschlagErgebnis: `Hur mycket extra tid det fanns, i procent av tiden för Utmaningen.`,
  wacklig:
    `Tangenter som förekom minst ${WACKLIG_MIND_DRAN} gånger och som skrevs rätt i ` +
    `mindre än ${Math.round(WACKLIG_QUOTE * 100)} % av fallen. Ett tips om var ` +
    `övning lönar sig - ingen diagnos.`,
  tastaturniveau:
    `Vilka tecken texten får innehålla. Alla elever i klassen får samma text - även ` +
    `om deras egna framsteg ligger under eller över den.`,
  start:
    `Tiden då Utmaningen startades. Från den stunden har eleverna ` +
    `${minuterAntalSv(EINSTIEGSFENSTER_MIN)} på sig att börja skriva.`,
  jetztStarten:
    `Startar Utmaningen direkt för hela klassen - med de tangenter och den tid som är ` +
    `inställda ovan. Från den stunden har eleverna ${minuterAntalSv(EINSTIEGSFENSTER_MIN)} ` +
    `på sig att börja skriva.`,
  pruefungszeit:
    `Hur länge varje elev skriver (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} minuter). ` +
    `Varje elevs tid går för sig, från elevens första tangenttryckning.`,
  vorlesenErlaubt:
    `I Utmaningen läser appen upp för elever som har slagit på sin egen uppläsning - ` +
    `precis som vid övning, utan någon separat ruta för läraren. Väntetiden på rösten ` +
    `dras av från tiden för Utmaningen.`,
  artStreng:
    `Som förut: efter ett felslag går markören inte vidare, och varje felslag räknas ` +
    `- även ett som rättades direkt.`,
  artFrei:
    `Fel blir stående som de skrevs och markeras INTE - som vid en vanlig ` +
    `avskrivning. Det som bedöms är det som fortfarande är fel i slutet: ett fel som ` +
    `lämnas kvar väger därför tio gånger så mycket som ett felslag vid strikt ` +
    `skrivning (${FEHLER_GEWICHT_FREI} i stället för ${FEHLER_GEWICHT} tecken), ` +
    `eftersom rättade fel inte räknas. Med Backsteg rättar du på den aktuella raden.`,
  text:
    `${texterAntalSv(PROBEN_JE_NIVEAU)} för varje val av tangenter. Nästa Utmaning ` +
    `med samma tangenter börjar där eleven som kom längst förra gången slutade: på ` +
    `nästa rad, eller för texter med meningar i början av nästa mening. När en text ` +
    `är slut fortsätter nästa utan paus.`,
  fehlerFrei:
    `Det som fortfarande är fel i slutet - högst ett fel per ord: ett felaktigt, ` +
    `saknat eller extra ord, eller ett saknat mellanslag. Rättade ställen räknas ` +
    `inte, inte heller det sista, ofärdiga ordet.`,
  korrekturen:
    `Hur många gånger Backsteg trycktes för att rätta ett ställe på den aktuella ` +
    `raden. Bara till information - det påverkar inte poängen.`,
};

/** ★ O2-LIB (29.10.2026): „5 minuter" / „1 minut" - Zahl und Hauptwort, schwedisch. */
function minuterAntalSv(n: number): string {
  return mehrzahl(n, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` });
}

/** ★ O2-LIB (29.10.2026): „Det finns 15 texter" / „Det finns 1 text" - schwedisch. */
function texterAntalSv(n: number): string {
  return mehrzahl(n, "sv", { one: (z) => `Det finns ${z} text`, other: (z) => `Det finns ${z} texter` });
}

/*
 * ★ O2-LIB (30.10.2026): Zahl + Hauptwort mit allen vier Formen ukrainisch (Glossar §2.11) - die Zahlen kommen aus
 * Konstanten und dürfen sich ändern, ohne dass „5 знаки" entsteht. one = 1, 21 … · few = 2-4, 22-24 … · many = 0, 5-20 ….
 */
/** „як 5 знаків", „як 1 знак" - Nominativ, ukrainisch. */
const znakyUk = (n: number): string =>
  mehrzahl(n, "uk", { one: (z) => `${z} знак`, few: (z) => `${z} знаки`, many: (z) => `${z} знаків`, other: (z) => `${z} знака` });

/** „менше ніж 200 знаків", „до 240 знаків" - Genitiv, ukrainisch. */
const znakivUk = (n: number): string =>
  mehrzahl(n, "uk", { one: (z) => `${z} знака`, few: (z) => `${z} знаків`, many: (z) => `${z} знаків`, other: (z) => `${z} знака` });

/** „щонайменше 5 разів", ukrainisch. */
const razivUk = (n: number): string =>
  mehrzahl(n, "uk", { one: (z) => `${z} раз`, few: (z) => `${z} рази`, many: (z) => `${z} разів`, other: (z) => `${z} раза` });

/** „мають 10 хвилин" - Akkusativ, ukrainisch. */
const hvylynAkkUk = (n: number): string =>
  mehrzahl(n, "uk", { one: (z) => `${z} хвилину`, few: (z) => `${z} хвилини`, many: (z) => `${z} хвилин`, other: (z) => `${z} хвилини` });

/** „є 15 текстів" - das Verb „є" ändert sich nicht, ukrainisch. */
const tekstyUk = (n: number): string =>
  mehrzahl(n, "uk", { one: (z) => `${z} текст`, few: (z) => `${z} тексти`, many: (z) => `${z} текстів`, other: (z) => `${z} тексту` });

/**
 * ★★★ O2-LIB (30.10.2026): DIESELBEN HINWEISE UKRAINISCH - gleiche Schlüssel, gleiche Zahlen aus denselben Konstanten.
 * Wörter nach dem Glossar Ukrainisch: Виклик (gross wie ein Name, gebeugt ausgeschrieben), бали, точність, хибне
 * натискання, клавіші тексту, тривалість Виклику, оцінка nur als „Це не оцінка", здати; Sätze über die Sache, ohne Anrede
 * und ohne Vergangenheit über eine Person (Geschlecht). Prozent ohne Leerzeichen (Glossar §1 Regel 5).
 */
export const HINWEIS_CHALLENGE_UK: Record<HinweisChallenge, string> = {
  bereit:
    `Готово означає: Виклик дійшов до пристрою дитини, і дитина бачить початковий екран. Якщо ` +
    `готовності ще немає, можливо, сторінка не відкрита або немає з'єднання з інтернетом - ` +
    `зазвичай допомагає один раз оновити сторінку. Здані роботи теж вважаються готовими.`,
  spalte:
    `Перше число: скільки Викликів виконано. Друге число: середній бал від 0 до 100 - ` +
    `враховується лише те, що було достатньо довгим для оцінювання. Після розгортання рядка ` +
    `кожен Виклик видно окремо.`,
  niveau:
    `Які клавіші траплялися в тексті - від основного ряду до програмного коду. ` +
    `Увесь клас друкує з однаковими клавішами.`,
  anschlaege:
    `Правильно надруковані знаки за хвилину за годинником Виклику. Роздуми зараховуються, ` +
    `очікування читання вголос - ні.`,
  treffsicherheit: `Частка правильних натискань від усіх натискань.`,
  leistungswert:
    `Точність і швидкість в одному числі від 0 до 100, причому точність важить більше: одне ` +
    `хибне натискання враховується як ${znakyUk(FEHLER_GEWICHT)}, а вдвічі більша швидкість не ` +
    `враховується вдвічі (швидкість зараховується до ${znakivUk(BEZUGSTEMPO)} за хвилину). ` +
    `Якщо знаків менше ніж ${znakivUk(MIND_ZEICHEN_WERTUNG)}, балів немає. Це не оцінка.`,
  rang:
    `Відсоток від найкращого результату в цьому одному Виклику: найкращий результат має ` +
    `100%. Між кількома Викликами місце нічого не говорить - для цього є бали.`,
  zeichen: `Правильно надруковані знаки, разом з пробілами.`,
  fehler:
    `Кожне хибне натискання по дорозі, навіть те, яке одразу виправлено. У кінці текст ` +
    `завжди правильний.`,
  zeilen: `Скільки рядків тексту надруковано повністю.`,
  schreibzeit:
    `Час за годинником Виклику без очікування читання вголос - роздуми зараховуються.`,
  vorlesezeit:
    `Скільки часу застосунок читав вголос, поки ніхто не друкував. Цей час віднято від ` +
    `тривалості Виклику - якщо друкування тривало, поки говорив голос, за цей час нічого ` +
    `не віднімається.`,
  vorlesen:
    `Чи читав застосунок вголос - і скільки часу очікування голосу через це віднято від ` +
    `тривалості Виклику. У Виклику застосунок читає вголос, якщо в дитини ввімкнено власне ` +
    `читання вголос - так само, як під час тренування.`,
  zuschlagErgebnis: `На скільки відсотків подовжено тривалість Виклику.`,
  wacklig:
    `Клавіші, які траплялися щонайменше ${razivUk(WACKLIG_MIND_DRAN)} і були надруковані ` +
    `правильно менш ніж у ${Math.round(WACKLIG_QUOTE * 100)}% випадків. Підказка, де тренування ` +
    `дасть найбільше, - не діагноз.`,
  tastaturniveau:
    `Які знаки може містити текст. Усі діти в класі отримують однаковий текст - навіть ` +
    `якщо їхній власний поступ нижчий або вищий.`,
  start:
    `Час початку Виклику. Відтоді в дітей є ${hvylynAkkUk(EINSTIEGSFENSTER_MIN)} ` +
    `на те, щоб почати друкувати.`,
  jetztStarten:
    `Запускає Виклик одразу для всього класу - з клавішами й тривалістю, налаштованими ` +
    `вище. Відтоді в дітей є ${hvylynAkkUk(EINSTIEGSFENSTER_MIN)} на те, щоб почати друкувати.`,
  pruefungszeit:
    `Скільки друкує кожна дитина (${DAUER_MIN_KLEINST}-${DAUER_MIN_GROESST} хв). ` +
    `Час іде для кожної дитини окремо, від її першого натискання клавіші.`,
  vorlesenErlaubt:
    `У Виклику застосунок читає вголос дітям, які ввімкнули власне читання вголос - ` +
    `так само, як під час тренування, без окремого поля вибору для педагога. ` +
    `Очікування голосу віднімається від тривалості Виклику.`,
  artStreng:
    `Як і раніше: після хибної клавіші курсор не просувається, кожне хибне натискання ` +
    `враховується - навіть те, яке одразу виправлено.`,
  artFrei:
    `Помилки залишаються як надруковано й НЕ позначаються - як під час диктанту. Оцінюється ` +
    `те, що в кінці лишається хибним: помилка, яка залишилася, тому важить у десять разів ` +
    `більше, ніж хибне натискання у виді Суворий (${znakyUk(FEHLER_GEWICHT_FREI)} замість ` +
    `${FEHLER_GEWICHT}), бо виправлені помилки не враховуються. Клавіша Backspace виправляє ` +
    `в поточному рядку.`,
  text:
    `Для кожного набору клавіш є ${tekstyUk(PROBEN_JE_NIVEAU)}. Наступний Виклик з тими самими ` +
    `клавішами починається там, де минулого разу в класі дійшли найдалі: з наступного ` +
    `рядка, а в текстах із реченнями - з початку наступного речення. Коли текст ` +
    `закінчується, без перерви продовжується наступний.`,
  fehlerFrei:
    `Що в кінці ще хибне - щонайбільше одна помилка на слово: хибне, пропущене або зайве ` +
    `слово чи пропущений пробіл. Виправлені місця не враховуються, як і останнє ` +
    `недописане слово.`,
  korrekturen:
    `Скільки разів натиснуто клавішу Backspace, щоб виправити місце в поточному ` +
    `рядку. Лише для інформації - до балів не зараховується.`,
};

/**
 * ★ E11a-5 (Falle 30): eine TABELLE statt `sprache === "en" ? … : Deutsch` -
 * die Ternäre gab für „fr" still die deutschen Hinweise.
 */
const HINWEISE_JE_SPRACHE: Record<BedienSprache, Readonly<Record<HinweisChallenge, string>>> = {
  de: HINWEIS_CHALLENGE,
  en: HINWEIS_CHALLENGE_EN,
  fr: HINWEIS_CHALLENGE_FR,
  es: HINWEIS_CHALLENGE_ES,
  it: HINWEIS_CHALLENGE_IT,
  pl: HINWEIS_CHALLENGE_PL,
  tr: HINWEIS_CHALLENGE_TR,
  cs: HINWEIS_CHALLENGE_CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: HINWEIS_CHALLENGE_BG,
  el: HINWEIS_CHALLENGE_EL,
  hu: HINWEIS_CHALLENGE_HU,
  nl: HINWEIS_CHALLENGE_NL,
  pt: HINWEIS_CHALLENGE_PT,
  br: HINWEIS_CHALLENGE_BR,
  ro: HINWEIS_CHALLENGE_RO,
  sv: HINWEIS_CHALLENGE_SV,
  uk: HINWEIS_CHALLENGE_UK,
};

/** Die Hinweise der Tippchallenge in der Bedienungssprache - ohne Angabe Deutsch. */
export function hinweiseChallenge(
  sprache: BedienSprache = "de",
): Readonly<Record<HinweisChallenge, string>> {
  return HINWEISE_JE_SPRACHE[sprache];
}

/**
 * ★ B7 (Umbau 11.09.2026): Der Hinweis an „Steigerung im Verlauf" - für das
 * Kind UND die Lehrkraft (§2.4, `LevelTrend`). EINE Konstante, damit E3 (die
 * Klassenstatistik) denselben Satz nimmt und keine zweite Fassung entsteht
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * Beide Fassungen sagen dasselbe: Der Satz braucht keine Anrede, weil er
 * über die Kurve spricht, nicht über die lesende Person.
 */
export const STEIGERUNG_HINWEIS =
  "Es ist normal, dass die Kurve nicht nur hinaufgeht. Kommen neue Tasten " +
  "dazu, geht sie meist erst einmal nach unten - besonders bei der " +
  "Umschalttaste und den Zahlen.";

/** Dieselbe Erklärung, an die Lehrkraft gerichtet. */
export const STEIGERUNG_HINWEIS_SIE =
  "Es ist normal, dass die Kurve nicht nur steigt. Kommen neue Tasten " +
  "dazu, geht sie meist erst einmal nach unten - besonders bei der " +
  "Umschalttaste und den Zahlen.";

/**
 * ★ Englisch (EN5, 19.09.2026): EIN Satz für Kind und Lehrkraft - die zwei
 * deutschen Fassungen unterscheiden sich nur im Verb („hinaufgeht"/„steigt"),
 * und der Satz spricht über die Kurve, nicht über die lesende Person.
 */
export const STEIGERUNG_HINWEIS_EN =
  "It is normal for the curve not to go up all the time. When new keys are " +
  "added, it usually dips at first - especially with the Shift key and the " +
  "numbers.";

/**
 * ★ E11a-5 (26.09.2026): französisch - EIN Satz für Kind und Lehrkraft wie im
 * Englischen, wortgleich mit `LehrerHilfe.fr.tsx` (dort steht er schon).
 */
export const STEIGERUNG_HINWEIS_FR =
  "Il est normal que la courbe ne fasse pas que monter. Quand de nouvelles " +
  "touches s'ajoutent, elle redescend d'abord la plupart du temps - surtout " +
  "avec la touche Maj et les chiffres.";

/** ★ ES-O (27.09.2026): spanisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_ES =
  "Es normal que la curva no solo suba. Cuando se añaden teclas nuevas, " +
  "casi siempre baja primero - sobre todo con la tecla Mayús y los números.";

/** ★ O-IT (02.10.2026): italienisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_IT =
  "È normale che la curva non salga sempre. Quando arrivano tasti nuovi, di " +
  "solito prima scende - soprattutto con il tasto Maiusc e con i numeri.";

/** ★ O-PL (02.10.2026): polnisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_PL =
  "To normalne, że krzywa nie zawsze idzie w górę. Gdy dochodzą nowe klawisze, " +
  "zwykle najpierw spada - szczególnie przy klawiszu Shift i cyfrach.";

/** ★ O-TR (02.10.2026): türkisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_TR =
  "Eğrinin her zaman yükselmemesi normaldir. Yeni tuşlar eklenince genellikle " +
  "önce düşer - özellikle Shift tuşunda ve rakamlarda.";

/** ★ O-CS (03.10.2026): tschechisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_CS =
  "Je normální, že křivka nejde pořád nahoru. Když přibudou nové klávesy, většinou " +
  "nejdřív klesne - hlavně u klávesy Shift a u číslic.";

/** ★ O2-LIB (30.10.2026): bulgarisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_BG =
  "Нормално е кривата да не върви непрекъснато нагоре. Когато се добавят нови клавиши, " +
  "тя обикновено първо спада - най-вече при клавиша Shift и при цифрите.";

/** ★ O2-LIB (30.10.2026): Griechisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_EL =
  "Είναι φυσιολογικό η καμπύλη να μην ανεβαίνει συνεχώς. Όταν προστίθενται νέα πλήκτρα, " +
  "συνήθως πέφτει στην αρχή - ιδίως με το πλήκτρο Shift και με τα ψηφία.";

/** ★ O2-LIB (30.10.2026): Ungarisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_HU =
  "Az a normális, hogy a görbe nem megy folyamatosan felfelé. Amikor új billentyűk " +
  "jönnek, általában először lejjebb megy - főleg a Shift billentyűnél és a számjegyeknél.";

/** ★ O2-LIB (30.10.2026): ein Satz für Kind und Lehrkraft, niederländisch - ohne Anrede, über die Kurve. */
export const STEIGERUNG_HINWEIS_NL =
  "Het is normaal dat de lijn niet steeds omhoog gaat. Komen er nieuwe toetsen bij, " +
  "dan zakt de lijn meestal eerst - vooral bij de Shift-toets en de cijfers.";

/** ★ O2-LIB (30.10.2026): português (Portugal) - UMA frase para crianças e docentes (sem tratamento). */
export const STEIGERUNG_HINWEIS_PT =
  "É normal que a curva nem sempre suba. Quando se juntam teclas novas, costuma descer " +
  "primeiro - sobretudo com a tecla Shift e com os números.";

/** ★ O2-LIB (30.10.2026): Portugiesisch (Brasilien) - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_BR =
  "É normal que a curva não suba o tempo todo. Quando entram teclas novas, ela " +
  "costuma cair no começo - principalmente com a tecla Shift e com os números.";

/**
 * ★ O2-LIB (30.10.2026): EIN Satz für Elevi und Lehrkraft - Rumänisch (ohne Anrede).
 */
export const STEIGERUNG_HINWEIS_RO =
  "Este normal ca linia curbei să nu urce tot timpul. Când se adaugă taste noi, " +
  "de obicei coboară întâi - mai ales la tasta Shift și la cifre.";

/** ★ O2-LIB (29.10.2026): schwedisch - EIN Satz für Elev und Lärare (ohne Anrede). */
export const STEIGERUNG_HINWEIS_SV =
  "Det är normalt att kurvan inte stiger hela tiden. När nya tangenter kommer till " +
  "sjunker den oftast först - särskilt med Skift och siffrorna.";

/** ★ O2-LIB (30.10.2026): ukrainisch - EIN Satz für Kind und Lehrkraft (ohne Anrede). */
export const STEIGERUNG_HINWEIS_UK =
  "Це нормально, що крива не весь час іде вгору. Коли додаються нові клавіші, вона " +
  "зазвичай спочатку йде вниз - особливо з клавішею Shift і цифрами.";

/** ★ E11a-5 (Falle 30): je Sprache eine Wahl statt `if (sprache === "en")`. */
const STEIGERUNG_JE_SPRACHE: Record<BedienSprache, (anrede: TabellenAnrede) => string> = {
  de: (anrede) => (anrede === "Sie" ? STEIGERUNG_HINWEIS_SIE : STEIGERUNG_HINWEIS),
  en: () => STEIGERUNG_HINWEIS_EN,
  fr: () => STEIGERUNG_HINWEIS_FR,
  es: () => STEIGERUNG_HINWEIS_ES,
  it: () => STEIGERUNG_HINWEIS_IT,
  pl: () => STEIGERUNG_HINWEIS_PL,
  tr: () => STEIGERUNG_HINWEIS_TR,
  cs: () => STEIGERUNG_HINWEIS_CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: () => STEIGERUNG_HINWEIS_BG,
  el: () => STEIGERUNG_HINWEIS_EL,
  hu: () => STEIGERUNG_HINWEIS_HU,
  nl: () => STEIGERUNG_HINWEIS_NL,
  pt: () => STEIGERUNG_HINWEIS_PT,
  br: () => STEIGERUNG_HINWEIS_BR,
  ro: () => STEIGERUNG_HINWEIS_RO,
  sv: () => STEIGERUNG_HINWEIS_SV,
  uk: () => STEIGERUNG_HINWEIS_UK,
};

/** Der Hinweis an „Steigerung im Verlauf" in der Bedienungssprache. */
export function steigerungHinweis(
  anrede: TabellenAnrede,
  sprache: BedienSprache = "de",
): string {
  return STEIGERUNG_JE_SPRACHE[sprache](anrede);
}

/** Wer die Tabelle der Tippchallenges eines Kindes liest. */
export type TabellenAnrede = "du" | "Sie";

/** Die Spalten der Tabelle der Tippchallenges eines Kindes. */
export type TabellenSpalte =
  | "datum"
  | "minuten"
  | "niveau"
  | "anschlaege"
  | "treffsicherheit"
  | "leistungswert";

/**
 * ★★ DIE KÖPFE DER TABELLE „TIPPCHALLENGES" - je Zielgruppe (Johannes
 * 10.09.2026: Mouseover-Hinweise an den Spaltenköpfen wie bei den anderen
 * Tabellen, das Kind mit „du", die Lehrkraft mit „Sie").
 *
 * Dieselbe Tabelle steht an zwei Orten (`SchreibprobenTabelle`): aufgeklappt
 * in „Meine Klassen", wo die Lehrkraft über ein Kind liest, und in „Meine
 * Statistik", wo das Kind über sich selbst liest. Ein Satz ohne Anrede
 * passt an beiden Orten nur halb.
 *
 * ⚠️ Beide Fassungen sagen DASSELBE - nur die Anrede wechselt. Wer eine Zahl
 * oder eine Regel ändert, ändert beide; der Wächter vergleicht die Zahlen.
 */
export const HINWEIS_TABELLE: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Wann du die ${PRUEFUNG_WORT} begonnen hast - mit deinem ersten Tastendruck.`,
    minuten:
      `Wie lange du schreiben durftest. Die Zeit, in der du auf das Vorlesen ` +
      `gewartet hast, ist nicht mitgezählt.`,
    niveau:
      `Welche Tasten im Text vorkamen - von der Grundreihe bis zum Programmcode. ` +
      `Deine ganze Klasse hat auf demselben Niveau geschrieben.`,
    anschlaege:
      `Wie viele Zeichen du je Minute richtig geschrieben hast. Die Zeit, in der ` +
      `du auf das Vorlesen gewartet hast, ist abgezogen.`,
    treffsicherheit: `Wie viele deiner Anschläge richtig waren, in Prozent.`,
    leistungswert:
      `Deine Treffsicherheit und dein Tempo in einer Zahl von 0 bis 100. Genau ` +
      `schreiben zählt mehr: Ein Fehlgriff zählt so viel wie ${FEHLER_GEWICHT} ` +
      `Zeichen, und doppeltes Tempo zählt nicht doppelt (gezählt wird bis ` +
      `${BEZUGSTEMPO} Anschläge je Minute). Unter ${MIND_ZEICHEN_WERTUNG} Zeichen ` +
      `gibt es keinen Leistungswert. Er ist keine Note.`,
  },
  Sie: {
    datum: `Wann das Kind die ${PRUEFUNG_WORT} begonnen hat - mit seinem ersten Tastendruck.`,
    minuten:
      `Wie lange das Kind schreiben durfte: die Prüfungszeit, die Sie eingestellt ` +
      `haben. Die Wartezeit auf das Vorlesen ist darin nicht mitgezählt.`,
    niveau:
      `Welche Tasten im Text vorkamen - das Niveau, das Sie für die ganze Klasse ` +
      `gewählt haben.`,
    anschlaege:
      `Richtig geschriebene Zeichen je Minute, gemessen an der Prüfungsuhr. ` +
      `Nachdenken zählt mit, das Warten des Kindes auf das Vorlesen nicht.`,
    treffsicherheit: `Der Anteil der richtigen Anschläge an allen Anschlägen des Kindes.`,
    leistungswert:
      `Treffsicherheit und Tempo in einer Zahl von 0 bis 100. Die Treffsicherheit ` +
      `wiegt schwerer: Ein Fehlgriff zählt so viel wie ${FEHLER_GEWICHT} Zeichen, ` +
      `und doppeltes Tempo zählt nicht doppelt (gezählt wird bis ${BEZUGSTEMPO} ` +
      `Anschläge je Minute). Unter ${MIND_ZEICHEN_WERTUNG} Zeichen gibt es keinen ` +
      `Leistungswert. Er ist keine Note - die Note bilden Sie.`,
  },
};

/**
 * ★★ DIE KÖPFE DER TABELLE ENGLISCH (EN5, 19.09.2026) - dieselbe Aufteilung
 * nach Zielgruppe: Das Kind liest *you*, die Lehrkraft liest über *the pupil*
 * (Glossar §3.8). Gleiche Zahlen aus denselben Konstanten wie oben.
 */
export const HINWEIS_TABELLE_EN: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `When you started the ${PRUEFUNG_WORT_EN} - with your first keystroke.`,
    minuten:
      `How long you had to type. The time you spent waiting for the read aloud is ` +
      `not included.`,
    niveau:
      `Which keys the text used - from the home row to program code. Your whole ` +
      `class typed with the same key range.`,
    anschlaege:
      `How many characters you typed correctly per minute. The time you spent ` +
      `waiting for the read aloud has been taken off.`,
    treffsicherheit: `How many of your keystrokes were correct, as a percentage.`,
    leistungswert:
      `Your accuracy and your speed in one number from 0 to 100. Typing carefully ` +
      `counts for more: a wrong key counts as much as ${FEHLER_GEWICHT} characters, ` +
      `and double the speed does not count double (speed counts up to ` +
      `${BEZUGSTEMPO} keystrokes per minute). With fewer than ` +
      `${MIND_ZEICHEN_WERTUNG} characters there is no score. It is not a mark.`,
  },
  Sie: {
    datum: `When the pupil started the ${PRUEFUNG_WORT_EN} - with their first keystroke.`,
    minuten:
      `How long the pupil had to type: the time limit you set. Time spent waiting ` +
      `for the read aloud is not included.`,
    niveau: `Which keys the text used - the key range you chose for the whole class.`,
    anschlaege:
      `Characters typed correctly per minute, measured on the challenge clock. ` +
      `Thinking time counts; the pupil's waiting for the read aloud does not.`,
    treffsicherheit: `The proportion of the pupil's keystrokes that were correct.`,
    leistungswert:
      `Accuracy and speed in one number from 0 to 100. Accuracy counts for more: a ` +
      `wrong key counts as much as ${FEHLER_GEWICHT} characters, and double the ` +
      `speed does not count double (speed counts up to ${BEZUGSTEMPO} keystrokes ` +
      `per minute). With fewer than ${MIND_ZEICHEN_WERTUNG} characters there is no ` +
      `score. It is not a mark - the mark is yours to give.`,
  },
};

/**
 * ★★ DIE KÖPFE DER TABELLE FRANZÖSISCH (E11a-5, 26.09.2026) - dieselbe
 * Aufteilung nach Zielgruppe: das Kind liest „tu", die Lehrkraft „vous" über
 * *l'élève*. Gleiche Zahlen aus denselben Konstanten wie oben.
 */
export const HINWEIS_TABELLE_FR: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Quand tu as commencé le ${PRUEFUNG_WORT_FR} - avec ta première frappe.`,
    minuten:
      `Combien de temps tu avais pour écrire. Le temps passé à attendre la lecture ` +
      `à voix haute n'est pas compté.`,
    niveau:
      `Quelles touches le texte utilisait - de la rangée de base au code informatique. ` +
      `Toute ta classe a écrit au même niveau.`,
    anschlaege:
      `Combien de caractères tu as tapés correctement par minute. Le temps passé à ` +
      `attendre la lecture à voix haute est retiré.`,
    treffsicherheit: `Combien de tes frappes étaient correctes, en pour cent.`,
    leistungswert:
      `Ta précision et ta vitesse en un nombre de 0 à 100. Taper juste compte plus : ` +
      `une erreur de frappe compte comme ${FEHLER_GEWICHT} caractères, et doubler la ` +
      `vitesse ne compte pas double (la vitesse compte jusqu'à ${BEZUGSTEMPO} frappes ` +
      `par minute). En dessous de ${MIND_ZEICHEN_WERTUNG} caractères, il n'y a pas de ` +
      `score. Ce n'est pas une note.`,
  },
  Sie: {
    datum: `Quand l'élève a commencé le ${PRUEFUNG_WORT_FR} - avec sa première frappe.`,
    minuten:
      `Combien de temps l'élève avait pour écrire : le temps que vous avez réglé. ` +
      `L'attente de la lecture à voix haute n'y est pas comptée.`,
    niveau: `Quelles touches le texte utilisait - le niveau que vous avez choisi pour toute la classe.`,
    anschlaege:
      `Caractères tapés correctement par minute, mesurés sur l'horloge du ` +
      `${PRUEFUNG_WORT_FR}. Le temps de réflexion compte, l'attente de l'élève pour ` +
      `la lecture à voix haute non.`,
    treffsicherheit: `La part des frappes correctes parmi toutes les frappes de l'élève.`,
    leistungswert:
      `Précision et vitesse en un nombre de 0 à 100. La précision pèse plus lourd : ` +
      `une erreur de frappe compte comme ${FEHLER_GEWICHT} caractères, et doubler la ` +
      `vitesse ne compte pas double (la vitesse compte jusqu'à ${BEZUGSTEMPO} frappes ` +
      `par minute). En dessous de ${MIND_ZEICHEN_WERTUNG} caractères, il n'y a pas de ` +
      `score. Ce n'est pas une note - la note, c'est vous qui la donnez.`,
  },
};

/**
 * ★ ES-O (27.09.2026): DIE KÖPFE DER TABELLE SPANISCH - das Kind liest „tú",
 * die Lehrkraft „usted" (über die Person, ohne Geschlechtsendung).
 */
export const HINWEIS_TABELLE_ES: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Cuándo empezaste el ${PRUEFUNG_WORT_ES} - con tu primera pulsación.`,
    minuten:
      `Cuánto tiempo tenías para escribir. El tiempo esperando la lectura ` +
      `en voz alta solo se descuenta al calcular tu velocidad.`,
    niveau:
      `Qué teclas usaba el texto - de la fila guía al código informático. ` +
      `Toda tu clase escribió en el mismo nivel.`,
    anschlaege:
      `Cuántos caracteres escribiste bien por minuto. El tiempo esperando la ` +
      `lectura en voz alta se descuenta.`,
    treffsicherheit: `Cuántas de tus pulsaciones fueron correctas, en porcentaje.`,
    leistungswert:
      `Tu precisión y tu velocidad en un número de 0 a 100. Acertar cuenta más: ` +
      `un error cuenta como ${FEHLER_GEWICHT} caracteres, y el doble de ` +
      `velocidad no cuenta el doble (la velocidad cuenta hasta ${BEZUGSTEMPO} pulsaciones ` +
      `por minuto). Por debajo de ${MIND_ZEICHEN_WERTUNG} caracteres no hay ` +
      `puntuación. No es una nota.`,
  },
  Sie: {
    datum: `Cuándo empezó el ${PRUEFUNG_WORT_ES} - con su primera pulsación.`,
    minuten:
      `Cuánto tiempo tenía para escribir: el tiempo que usted fijó. ` +
      `La espera de la lectura en voz alta solo se descuenta en el cálculo de la velocidad.`,
    niveau: `Qué teclas usaba el texto - el nivel que usted eligió para toda la clase.`,
    anschlaege:
      `Caracteres escritos correctamente por minuto, medidos con el reloj del ` +
      `${PRUEFUNG_WORT_ES}. El tiempo para pensar cuenta; la espera de la lectura ` +
      `en voz alta, no.`,
    treffsicherheit: `El porcentaje de pulsaciones correctas entre todas sus pulsaciones.`,
    leistungswert:
      `Precisión y velocidad en un número de 0 a 100. La precisión pesa más: ` +
      `un error cuenta como ${FEHLER_GEWICHT} caracteres, y el doble de ` +
      `velocidad no cuenta el doble (la velocidad cuenta hasta ${BEZUGSTEMPO} pulsaciones ` +
      `por minuto). Por debajo de ${MIND_ZEICHEN_WERTUNG} caracteres no hay ` +
      `puntuación. No es una nota - la nota la pone usted.`,
  },
};

/**
 * ★ O-IT (02.10.2026): DIE KÖPFE DER TABELLE ITALIENISCH - das Kind liest „tu",
 * die Lehrkraft neutral über „la persona" (Glossar Regel 1 und 2).
 */
export const HINWEIS_TABELLE_IT: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Quando hai iniziato la ${PRUEFUNG_WORT_IT} - con il tuo primo tasto.`,
    minuten:
      `Quanto tempo avevi per scrivere. Il tempo in cui hai aspettato la lettura ` +
      `ad alta voce non è contato.`,
    niveau:
      `Quali tasti usava il testo - dalla riga di base al codice. Tutta la tua ` +
      `classe ha scritto con gli stessi tasti.`,
    anschlaege:
      `Quanti caratteri hai scritto giusti al minuto. Il tempo in cui hai ` +
      `aspettato la lettura ad alta voce è tolto.`,
    treffsicherheit: `Quante delle tue battute erano giuste, in percentuale.`,
    leistungswert:
      `La tua precisione e la tua velocità in un numero da 0 a 100. Scrivere ` +
      `preciso conta di più: un tasto sbagliato conta come ${FEHLER_GEWICHT} ` +
      `caratteri, e una velocità doppia non conta il doppio (la velocità conta ` +
      `fino a ${BEZUGSTEMPO} battute al minuto). Sotto i ${MIND_ZEICHEN_WERTUNG} ` +
      `caratteri non c'è punteggio. Non è un voto.`,
  },
  Sie: {
    datum: `Quando la persona ha iniziato la ${PRUEFUNG_WORT_IT} - con il primo tasto premuto.`,
    minuten:
      `Quanto tempo aveva la persona per scrivere: la durata impostata per la ` +
      `classe. L'attesa della lettura ad alta voce non è contata.`,
    niveau: `Quali tasti usava il testo - quelli scelti per tutta la classe.`,
    anschlaege:
      `Caratteri scritti correttamente al minuto, misurati con l'orologio della ` +
      `${PRUEFUNG_WORT_IT}. Il tempo per pensare conta, l'attesa della lettura ad ` +
      `alta voce no.`,
    treffsicherheit: `La quota di battute giuste su tutte le battute della persona.`,
    leistungswert:
      `Precisione e velocità in un numero da 0 a 100. La precisione pesa di più: ` +
      `un tasto sbagliato conta come ${FEHLER_GEWICHT} caratteri, e una velocità ` +
      `doppia non conta il doppio (la velocità conta fino a ${BEZUGSTEMPO} battute ` +
      `al minuto). Sotto i ${MIND_ZEICHEN_WERTUNG} caratteri non c'è punteggio. ` +
      `Non è un voto - il voto lo dà l'insegnante.`,
  },
};

/**
 * ★ O-PL (02.10.2026): DIE KÖPFE DER TABELLE POLNISCH - das Kind liest „ty"
 * (ohne Vergangenheit der 2. Person: „zaczęło się twoje Wyzwanie", „udało ci
 * się"), die Lehrkraft liest über „ta osoba", unpersönlich.
 */
export const HINWEIS_TABELLE_PL: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Kiedy zaczęło się twoje ${PRUEFUNG_WORT_PL} - od pierwszego naciśnięcia klawisza.`,
    minuten:
      `Ile czasu było na pisanie. Czas czekania na czytanie na głos nie jest ` +
      `wliczony.`,
    niveau:
      `Jakich klawiszy używał tekst - od rzędu podstawowego po kod. Cała twoja ` +
      `klasa pisała tymi samymi klawiszami.`,
    anschlaege:
      `Ile znaków na minutę udało ci się napisać poprawnie. Czas czekania na ` +
      `czytanie na głos jest odjęty.`,
    treffsicherheit: `Ile twoich uderzeń było poprawnych, w procentach.`,
    leistungswert:
      `Twoja dokładność i twoje tempo w jednej liczbie od 0 do 100. Dokładne ` +
      `pisanie liczy się bardziej: jedna pomyłka liczy się jak ` +
      `${znakiPl(FEHLER_GEWICHT)}, a dwa razy szybsze tempo nie liczy się podwójnie ` +
      `(tempo liczy się do ${uderzenGenPl(BEZUGSTEMPO)} na minutę). Poniżej ` +
      `${znakowGenPl(MIND_ZEICHEN_WERTUNG)} nie ma wyniku. To nie jest ocena.`,
  },
  Sie: {
    datum: `Kiedy ta osoba zaczęła ${PRUEFUNG_WORT_PL} - od pierwszego naciśnięcia klawisza.`,
    minuten:
      `Ile czasu było na pisanie: czas ustawiony dla klasy. Czas czekania na ` +
      `czytanie na głos nie jest wliczony.`,
    niveau: `Jakich klawiszy używał tekst - tych wybranych dla całej klasy.`,
    anschlaege:
      `Poprawnie napisane znaki na minutę, mierzone zegarem Wyzwania. Namysł się ` +
      `liczy, czekanie na czytanie na głos - nie.`,
    treffsicherheit: `Udział poprawnych uderzeń tej osoby we wszystkich jej uderzeniach.`,
    leistungswert:
      `Dokładność i tempo w jednej liczbie od 0 do 100. Dokładność waży więcej: ` +
      `jedna pomyłka liczy się jak ${znakiPl(FEHLER_GEWICHT)}, a dwa razy szybsze ` +
      `tempo nie liczy się podwójnie (tempo liczy się do ` +
      `${uderzenGenPl(BEZUGSTEMPO)} na minutę). Poniżej ` +
      `${znakowGenPl(MIND_ZEICHEN_WERTUNG)} nie ma wyniku. To nie jest ocena - ` +
      `ocenę wystawia się osobno.`,
  },
};

/**
 * ★ O-TR (02.10.2026): DIE KÖPFE DER TABELLE TÜRKISCH - das Kind liest "sen",
 * die Lehrkraft "siz" über *öğrenci*. Gleiche Zahlen aus denselben Konstanten.
 */
export const HINWEIS_TABELLE_TR: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Yarışmaya ne zaman başladığın - ilk tuşa bastığın andan itibaren.`,
    minuten:
      `Ne kadar süre yazabildiğin. Sesli okumayı beklediğin süre buna dahil ` +
      `değildir.`,
    niveau:
      `Metinde hangi tuşların geçtiği - temel sıradan program koduna kadar. Tüm ` +
      `sınıfın aynı tuşlarla yazdı.`,
    anschlaege:
      `Dakikada kaç karakteri doğru yazdığın. Sesli okumayı beklediğin süre ` +
      `düşüldü.`,
    treffsicherheit: `Vuruşlarının yüzde kaçının doğru olduğu.`,
    leistungswert:
      `Doğruluğun ve hızın, 0 ile 100 arasında tek bir sayıda. Dikkatli yazmak ` +
      `daha çok sayılır: bir yanlış tuş ${FEHLER_GEWICHT} karakter kadar sayılır, ` +
      `iki kat hız ise iki kat sayılmaz (hız en çok dakikada ${BEZUGSTEMPO} vuruş ` +
      `kadar sayılır). ${MIND_ZEICHEN_WERTUNG} karakterden kısa yazılara puan ` +
      `verilmez. Bu bir not değildir.`,
  },
  Sie: {
    datum: `Öğrencinin yarışmaya ne zaman başladığı - ilk tuşa bastığı andan itibaren.`,
    minuten:
      `Öğrencinin ne kadar süre yazabildiği: sizin ayarladığınız yarışma süresi. ` +
      `Sesli okumayı bekleme süresi buna dahil değildir.`,
    niveau: `Metinde hangi tuşların geçtiği - tüm sınıf için seçtiğiniz tuşlar.`,
    anschlaege:
      `Dakikada doğru yazılan karakter sayısı, yarışma saatiyle ölçülür. Düşünme ` +
      `süresi sayılır, öğrencinin sesli okumayı beklemesi sayılmaz.`,
    treffsicherheit: `Öğrencinin doğru vuruşlarının tüm vuruşları içindeki oranı.`,
    leistungswert:
      `Doğruluk ve hız, 0 ile 100 arasında tek bir sayıda. Doğruluk daha ağır ` +
      `basar: bir yanlış tuş ${FEHLER_GEWICHT} karakter kadar sayılır, iki kat hız ` +
      `ise iki kat sayılmaz (hız en çok dakikada ${BEZUGSTEMPO} vuruş kadar ` +
      `sayılır). ${MIND_ZEICHEN_WERTUNG} karakterden kısa yazılara puan verilmez. ` +
      `Bu bir not değildir - notu siz verirsiniz.`,
  },
};

/**
 * ★ O-CS (03.10.2026): DIE KÖPFE DER TABELLE TSCHECHISCH - das Kind liest ty,
 * die Lehrkraft vy. Beide OHNE Vergangenheit über eine Person (Glossar §1
 * Regel 2): Hauptwort-Sätze und „se"-Sätze. Gleiche Zahlen aus denselben
 * Konstanten.
 */
export const HINWEIS_TABELLE_CS: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Začátek Výzvy - od tvého prvního stisku klávesy.`,
    minuten: `Čas na psaní. Čekání na předčítání se do něj nepočítá.`,
    niveau:
      `Které klávesy se v textu vyskytovaly - od základní řady po programový kód. ` +
      `Celá tvoje třída psala se stejnými klávesami.`,
    anschlaege:
      `Tvoje správně napsané znaky za minutu. Čekání na předčítání je odečtené.`,
    treffsicherheit: `Kolik procent tvých úhozů bylo správně.`,
    leistungswert:
      `Tvoje přesnost a rychlost v jednom čísle od 0 do 100, přičemž pečlivé psaní se počítá ` +
      `víc: jeden překlep se počítá jako ${znakyCs(FEHLER_GEWICHT)} a dvojnásobná ` +
      `rychlost se nepočítá dvojnásobně (rychlost se počítá nejvýše do ` +
      `${uhozuGenCs(BEZUGSTEMPO)} za minutu). Výsledek kratší než ` +
      `${znakyCs(MIND_ZEICHEN_WERTUNG)} skóre nemá. Není to známka.`,
  },
  Sie: {
    datum: `Začátek Výzvy - od prvního stisku klávesy.`,
    minuten:
      `Čas na psaní: čas Výzvy podle vašeho nastavení. Čekání na předčítání se do ` +
      `něj nepočítá.`,
    niveau: `Které klávesy se v textu vyskytovaly - podle vaší volby pro celou třídu.`,
    anschlaege:
      `Správně napsané znaky za minutu, měřeno hodinami Výzvy. Přemýšlení se počítá, ` +
      `čekání na předčítání ne.`,
    treffsicherheit: `Podíl správných úhozů ze všech úhozů.`,
    leistungswert:
      `Přesnost a rychlost v jednom čísle od 0 do 100, přičemž přesnost váží víc: jeden ` +
      `překlep se počítá jako ${znakyCs(FEHLER_GEWICHT)} a dvojnásobná rychlost se ` +
      `nepočítá dvojnásobně (rychlost se počítá nejvýše do ${uhozuGenCs(BEZUGSTEMPO)} ` +
      `za minutu). Výsledek kratší než ${znakyCs(MIND_ZEICHEN_WERTUNG)} skóre nemá. ` +
      `Není to známka - známku dáváte vy.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): DIE KÖPFE DER TABELLE BULGARISCH - das Kind liest ти, die Lehrkraft Вие. Beide ohne
 * Vergangenheit über eine Person. Gleiche Zahlen aus denselben Konstanten. (`znakBg` steht oben bei
 * {@link HINWEIS_CHALLENGE_BG}.)
 */
export const HINWEIS_TABELLE_BG: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Началото на Предизвикателството - от първото ти натискане на клавиш.`,
    minuten: `Времето за писане. Чакането на четенето на глас не се брои в него.`,
    niveau:
      `Кои клавиши са се срещали в текста - от основния ред до програмния код. ` +
      `Целият ти клас е писал със същите клавиши.`,
    anschlaege:
      `Твоите правилно написани знаци в минута. Чакането на четенето на глас е извадено.`,
    treffsicherheit: `Колко процента от твоите натискания са били правилни.`,
    leistungswert:
      `Твоята точност и скорост в едно число от 0 до 100, като внимателното писане тежи повече: един ` +
      `погрешен клавиш се брои като ${znakBg(FEHLER_GEWICHT)}, а двойна скорост не се брои двойно ` +
      `(скоростта се брои най-много до ${BEZUGSTEMPO} знака в минута). Под ` +
      `${znakBg(MIND_ZEICHEN_WERTUNG)} няма резултат. Не е оценка.`,
  },
  Sie: {
    datum: `Началото на Предизвикателството - от първото натискане на клавиш.`,
    minuten:
      `Времето за писане: времето на Предизвикателството според вашата настройка. Чакането на ` +
      `четенето на глас не се брои в него.`,
    niveau: `Кои клавиши са се срещали в текста - според вашия избор за целия клас.`,
    anschlaege:
      `Правилно написани знаци в минута, измерени по часовника на Предизвикателството. ` +
      `Мисленето се брои, чакането на четенето на глас не се брои.`,
    treffsicherheit: `Делът на правилните натискания от всички натискания.`,
    leistungswert:
      `Точност и скорост в едно число от 0 до 100, като точността тежи повече: един погрешен клавиш се ` +
      `брои като ${znakBg(FEHLER_GEWICHT)}, а двойна скорост не се брои двойно (скоростта се брои най-много ` +
      `до ${BEZUGSTEMPO} знака в минута). Под ${znakBg(MIND_ZEICHEN_WERTUNG)} няма резултат. ` +
      `Не е оценка - оценката поставяте вие.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): DIE KÖPFE DER TABELLE GRIECHISCH - das Kind liest εσύ, die Lehrkraft εσείς.
 * Gleiche Zahlen aus denselben Konstanten. Die Zahl-Hilfen stehen bei {@link HINWEIS_CHALLENGE_EL}.
 */
export const HINWEIS_TABELLE_EL: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Πότε ξεκίνησες την Πρόκληση - με το πρώτο σου πάτημα πλήκτρου.`,
    minuten:
      `Πόση ώρα είχες για να γράψεις. Ο χρόνος που περίμενες την εκφώνηση δεν ` +
      `προσμετράται.`,
    niveau:
      `Ποια πλήκτρα εμφανίστηκαν στο κείμενο - από τη βασική σειρά μέχρι τον κώδικα ` +
      `προγραμμάτων. Όλο το τμήμα σου έγραψε με τα ίδια πλήκτρα.`,
    anschlaege:
      `Πόσα σωστά πατήματα έκανες ανά λεπτό. Ο χρόνος που περίμενες την εκφώνηση έχει ` +
      `αφαιρεθεί.`,
    treffsicherheit: `Πόσα από τα πατήματά σου ήταν σωστά, σε ποσοστό.`,
    leistungswert:
      `Η ακρίβεια και η ταχύτητά σου σε έναν αριθμό από 0 έως 100. Η προσεκτική γραφή ` +
      `μετράει περισσότερο: ένα λάθος πλήκτρο μετράει όσο ${charsEl(FEHLER_GEWICHT)} και ` +
      `διπλάσια ταχύτητα δεν μετράει διπλάσια (η ταχύτητα προσμετράται έως ` +
      `${pressesEl(BEZUGSTEMPO)} ανά λεπτό). Με λιγότερους από ` +
      `${charsEl(MIND_ZEICHEN_WERTUNG)} δεν υπάρχει σκορ. Δεν είναι βαθμός.`,
  },
  Sie: {
    datum: `Πότε ξεκίνησε το παιδί την Πρόκληση - με το πρώτο του πάτημα πλήκτρου.`,
    minuten:
      `Πόση ώρα είχε το παιδί για να γράψει: η διάρκεια της Πρόκλησης που ορίσατε. Ο χρόνος ` +
      `αναμονής για την εκφώνηση δεν προσμετράται.`,
    niveau: `Ποια πλήκτρα εμφανίστηκαν στο κείμενο - η επιλογή που κάνατε για όλο το τμήμα.`,
    anschlaege:
      `Σωστά πατήματα ανά λεπτό, μετρημένα με το ρολόι της Πρόκλησης. Ο χρόνος σκέψης ` +
      `προσμετράται, η αναμονή του παιδιού για την εκφώνηση όχι.`,
    treffsicherheit: `Το ποσοστό των σωστών πατημάτων του παιδιού επί όλων των πατημάτων του.`,
    leistungswert:
      `Ακρίβεια και ταχύτητα σε έναν αριθμό από 0 έως 100. Η ακρίβεια μετράει περισσότερο: ` +
      `ένα λάθος πλήκτρο μετράει όσο ${charsEl(FEHLER_GEWICHT)} και διπλάσια ταχύτητα δεν ` +
      `μετράει διπλάσια (η ταχύτητα προσμετράται έως ${pressesEl(BEZUGSTEMPO)} ανά ` +
      `λεπτό). Με λιγότερους από ${charsEl(MIND_ZEICHEN_WERTUNG)} δεν υπάρχει σκορ. Δεν ` +
      `είναι βαθμός - τον βαθμό τον δίνετε εσείς.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): DIE KÖPFE DER TABELLE UNGARISCH - das Kind liest te, die Lehrkraft-Fassung
 * spricht über „a tanuló" ohne Anrede (Glossar Regel 1). Gleiche Zahlen aus denselben Konstanten;
 * nach einer Zahl steht die Einzahl (Regel 13).
 */
export const HINWEIS_TABELLE_HU: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Mikor kezdted el a Kihívást - az első leütéseddel.`,
    minuten:
      `Mennyi ideig gépelhettél. A felolvasásra várakozás ideje nincs benne.`,
    niveau:
      `Mely billentyűk szerepeltek a szövegben - az alapsortól a programkódig. ` +
      `Az egész osztályod ugyanazokkal a billentyűkkel gépelt.`,
    anschlaege:
      `Percenként hány karaktert írtál le helyesen. A felolvasásra várakozás ideje le van vonva.`,
    treffsicherheit: `A leütéseid hány százaléka volt helyes.`,
    leistungswert:
      `A pontosságod és a sebességed egyetlen, 0 és 100 közötti számban. A pontos gépelés ` +
      `többet nyom a latba: egy elütés ${FEHLER_GEWICHT} karakternek számít, a kétszeres ` +
      `sebesség pedig nem számít kétszeresnek (a sebesség legfeljebb ${BEZUGSTEMPO} ` +
      `leütés/percig számít). ${MIND_ZEICHEN_WERTUNG} karakternél rövidebb szövegre nincs ` +
      `pontszám. Nem érdemjegy.`,
  },
  Sie: {
    datum: `Mikor kezdte el a tanuló a Kihívást - az első leütésével.`,
    minuten:
      `Mennyi ideig gépelhetett a tanuló: a beállított Kihívás-idő. A felolvasásra ` +
      `várakozás ideje nincs benne.`,
    niveau: `Mely billentyűk szerepeltek a szövegben - az egész osztálynak választott billentyűkészlet.`,
    anschlaege:
      `Helyesen leírt karakterek percenként, a Kihívás órája szerint mérve. A gondolkodás ` +
      `ideje beleszámít, a tanuló felolvasásra várakozása nem.`,
    treffsicherheit: `A tanuló helyes leütéseinek aránya az összes leütéséből.`,
    leistungswert:
      `A pontosság és a sebesség egyetlen, 0 és 100 közötti számban. A pontosság többet ` +
      `nyom a latba: egy elütés ${FEHLER_GEWICHT} karakternek számít, a kétszeres sebesség ` +
      `pedig nem számít kétszeresnek (a sebesség legfeljebb ${BEZUGSTEMPO} leütés/percig ` +
      `számít). ${MIND_ZEICHEN_WERTUNG} karakternél rövidebb szövegre nincs pontszám. ` +
      `Nem érdemjegy - az érdemjegyet a tanár adja.`,
  },
};

/** ★ O2-LIB (30.10.2026): Zahl + Hauptwort, niederländisch (one/other; Maßwort und Verb zieht mit). */
const tekensTabelNl = (n: number): string =>
  mehrzahl(n, "nl", { one: (z) => `${z} teken`, other: (z) => `${z} tekens` });

/**
 * ★ O2-LIB (30.10.2026): DIE KÖPFE DER TABELLE NIEDERLÄNDISCH - das Kind liest je, die
 * Lehrkraft liest über "de leerling" (Glossar nl Regel 1 und 2: kein hij/zij, Imperativ und je).
 * Gleiche Zahlen aus denselben Konstanten.
 */
export const HINWEIS_TABELLE_NL: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Wanneer je de Uitdaging begon - met je eerste aanslag.`,
    minuten:
      `Hoe lang je mocht typen. De tijd die je op het voorlezen wachtte, telt ` +
      `niet mee.`,
    niveau:
      `Welke toetsen in de tekst voorkwamen - van de basisrij tot programmacode. ` +
      `Je hele klas typte met dezelfde toetsen.`,
    anschlaege:
      `Hoeveel tekens je per minuut goed hebt getypt. De tijd die je op het ` +
      `voorlezen wachtte, is eraf gehaald.`,
    treffsicherheit: `Hoeveel van je aanslagen goed waren, in procenten.`,
    leistungswert:
      `Je nauwkeurigheid en je snelheid in één getal van 0 tot 100. Nauwkeurig ` +
      `typen telt zwaarder: een verkeerde toets telt als ${tekensTabelNl(FEHLER_GEWICHT)} ` +
      `en dubbele snelheid telt niet dubbel (snelheid telt mee tot ` +
      `${BEZUGSTEMPO} aanslagen per minuut). Met minder dan ` +
      `${tekensTabelNl(MIND_ZEICHEN_WERTUNG)} is er geen score. Het is geen beoordeling.`,
  },
  Sie: {
    datum: `Wanneer de leerling de Uitdaging begon - met de eerste aanslag.`,
    minuten:
      `Hoe lang de leerling mocht typen: de duur die je hebt ingesteld. De wachttijd ` +
      `op het voorlezen telt daarin niet mee.`,
    niveau: `Welke toetsen in de tekst voorkwamen - de keuze die je voor de hele klas hebt gemaakt.`,
    anschlaege:
      `Goed getypte tekens per minuut, gemeten met de klok van de Uitdaging. ` +
      `Nadenken telt mee, wachten van de leerling op het voorlezen niet.`,
    treffsicherheit: `Het deel van de aanslagen van de leerling dat goed was.`,
    leistungswert:
      `Nauwkeurigheid en snelheid in één getal van 0 tot 100. Nauwkeurigheid weegt ` +
      `zwaarder: een verkeerde toets telt als ${tekensTabelNl(FEHLER_GEWICHT)} en dubbele ` +
      `snelheid telt niet dubbel (snelheid telt mee tot ${BEZUGSTEMPO} aanslagen per ` +
      `minuut). Met minder dan ${tekensTabelNl(MIND_ZEICHEN_WERTUNG)} is er geen score. Het is ` +
      `geen beoordeling - die geef jij.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): OS TÍTULOS DA TABELA EM PORTUGUÊS (Portugal) - quem pratica lê "tu", quem
 * ensina lê o tratamento sem pronome. Ambos SEM pretérito sobre uma pessoa com adjetivo (Glossário
 * pt, regra 2). Mesmos números das mesmas constantes.
 */
export const HINWEIS_TABELLE_PT: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Quando começaste o ${PRUEFUNG_WORT_PT} - com o teu primeiro toque.`,
    minuten:
      `Durante quanto tempo pudeste escrever. O tempo em que esperaste pela leitura em voz alta ` +
      `não está incluído.`,
    niveau:
      `As teclas que o texto usou - da fila de base ao código de programação. A tua turma toda ` +
      `escreveu com as mesmas teclas.`,
    anschlaege:
      `Quantos carateres escreveste corretamente por minuto. O tempo em que esperaste pela ` +
      `leitura em voz alta está descontado.`,
    treffsicherheit: `Quantos dos teus toques estavam certos, em percentagem.`,
    leistungswert:
      `A tua precisão e a tua velocidade num só número, de 0 a 100. Escrever com cuidado conta ` +
      `mais: uma tecla errada conta tanto como ${carateresPt(FEHLER_GEWICHT)}, e o dobro da ` +
      `velocidade não conta a dobrar (a velocidade conta até ${toquesPt(BEZUGSTEMPO)} por ` +
      `minuto). Com menos de ${carateresPt(MIND_ZEICHEN_WERTUNG)} não há pontuação. Não é uma nota.`,
  },
  Sie: {
    datum: `Quando a criança começou o ${PRUEFUNG_WORT_PT} - com o seu primeiro toque.`,
    minuten:
      `Durante quanto tempo a criança pôde escrever: o tempo do ${PRUEFUNG_WORT_PT} que definiu. ` +
      `A espera pela leitura em voz alta não está incluída.`,
    niveau: `As teclas que o texto usou - a seleção que escolheu para a turma toda.`,
    anschlaege:
      `Carateres escritos corretamente por minuto, medidos no relógio do ${PRUEFUNG_WORT_PT}. ` +
      `O tempo para pensar conta; a espera da criança pela leitura em voz alta não.`,
    treffsicherheit: `A proporção de toques certos entre todos os toques da criança.`,
    leistungswert:
      `Precisão e velocidade num só número, de 0 a 100. A precisão pesa mais: uma tecla errada ` +
      `conta tanto como ${carateresPt(FEHLER_GEWICHT)}, e o dobro da velocidade não conta a ` +
      `dobrar (a velocidade conta até ${toquesPt(BEZUGSTEMPO)} por minuto). Com menos de ` +
      `${carateresPt(MIND_ZEICHEN_WERTUNG)} não há pontuação. Não é uma nota - a nota fica a seu cargo.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): die Köpfe der Tabelle, Portugiesisch (Brasilien) - das Kind liest
 * você, die Lehrkraft liest über die Person; beide ohne Aussage über das Geschlecht.
 * Die Zahlwort-Helfer (caracteresBr, toquesBr) stehen bei den Hinweisen weiter oben in der Datei.
 */
export const HINWEIS_TABELLE_BR: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Início do Desafio - com o seu primeiro toque numa tecla.`,
    minuten:
      `Quanto tempo você teve para digitar. O tempo de espera pela leitura em voz ` +
      `alta não entra na conta.`,
    niveau:
      `Quais teclas o texto usou - da fileira central até o código de programação. ` +
      `A sua turma toda digitou com as mesmas teclas.`,
    anschlaege:
      `Quantos caracteres você digitou corretamente por minuto. O tempo de espera ` +
      `pela leitura em voz alta foi descontado.`,
    treffsicherheit: `Quantos dos seus toques estavam corretos, em porcentagem.`,
    leistungswert:
      `A sua precisão e a sua velocidade em um só número, de 0 a 100. Digitar com ` +
      `cuidado conta mais: uma tecla errada vale como ${caracteresBr(FEHLER_GEWICHT)}, ` +
      `e o dobro da velocidade não conta em dobro (a velocidade conta até ` +
      `${toquesBr(BEZUGSTEMPO)} por minuto). Com menos de ` +
      `${caracteresBr(MIND_ZEICHEN_WERTUNG)} não há pontuação. Não é uma nota.`,
  },
  Sie: {
    datum: `Início do Desafio - com o primeiro toque numa tecla.`,
    minuten:
      `Quanto tempo houve para digitar: a duração do Desafio que você definiu. O ` +
      `tempo de espera pela leitura em voz alta não entra na conta.`,
    niveau: `Quais teclas o texto usou - a escolha que você fez para a turma toda.`,
    anschlaege:
      `Caracteres digitados corretamente por minuto, medidos no relógio do Desafio. ` +
      `O tempo de reflexão conta; a espera pela leitura em voz alta não.`,
    treffsicherheit: `A proporção de toques corretos entre todos os toques.`,
    leistungswert:
      `Precisão e velocidade em um só número, de 0 a 100. A precisão pesa mais: ` +
      `uma tecla errada vale como ${caracteresBr(FEHLER_GEWICHT)}, e o dobro da ` +
      `velocidade não conta em dobro (a velocidade conta até ${toquesBr(BEZUGSTEMPO)} ` +
      `por minuto). Com menos de ${caracteresBr(MIND_ZEICHEN_WERTUNG)} não há ` +
      `pontuação. Não é uma nota - a nota fica a seu critério.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): DIE KÖPFE DER TABELLE RUMÄNISCH - das Kind liest tu, die Lehrkraft
 * die Höflichkeitsform; über die Person ohne Adjektiv. Gleiche Zahlen aus denselben Konstanten.
 */
export const HINWEIS_TABELLE_RO: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Începutul Provocării - de la prima ta apăsare de tastă.`,
    minuten:
      `Cât ai avut la dispoziție pentru scris. Timpul de așteptare a citirii cu voce ` +
      `tare nu se numără.`,
    niveau:
      `Ce taste au apărut în text - de la șirul de bază până la codul de program. ` +
      `Toată clasa ta a scris cu aceleași taste.`,
    anschlaege:
      `Câte caractere ai scris corect pe minut. Timpul de așteptare a citirii cu voce ` +
      `tare este scăzut.`,
    treffsicherheit: `Câte dintre apăsările tale au fost corecte, în procente.`,
    leistungswert:
      `Precizia și viteza ta într-un singur număr de la 0 la 100. Scrisul atent ` +
      `contează mai mult: o tastă greșită cântărește cât ${caractereTabRo(FEHLER_GEWICHT)}, ` +
      `iar viteza dublă nu contează dublu (viteza se numără până la ` +
      `${caractereTabRo(BEZUGSTEMPO)} pe minut). Sub ${caractereTabRo(MIND_ZEICHEN_WERTUNG)} ` +
      `nu există scor. Nu este o notă.`,
  },
  Sie: {
    datum: `Începutul Provocării - de la prima apăsare de tastă a persoanei.`,
    minuten:
      `Cât a avut persoana la dispoziție pentru scris: durata Provocării pe care ați ` +
      `setat-o. Timpul de așteptare a citirii cu voce tare nu este inclus.`,
    niveau: `Ce taste au apărut în text - alegerea pe care ați făcut-o pentru toată clasa.`,
    anschlaege:
      `Caractere scrise corect pe minut, măsurate cu ceasul Provocării. Gândirea se ` +
      `numără, așteptarea persoanei după citirea cu voce tare nu.`,
    treffsicherheit: `Ponderea apăsărilor corecte ale persoanei din toate apăsările ei.`,
    leistungswert:
      `Precizia și viteza într-un singur număr de la 0 la 100. Precizia contează mai ` +
      `mult: o tastă greșită cântărește cât ${caractereTabRo(FEHLER_GEWICHT)}, iar viteza ` +
      `dublă nu contează dublu (viteza se numără până la ${caractereTabRo(BEZUGSTEMPO)} pe ` +
      `minut). Sub ${caractereTabRo(MIND_ZEICHEN_WERTUNG)} nu există scor. Nu este o ` +
      `notă - nota o stabiliți dvs.`,
  },
};

/** ★ O2-LIB (30.10.2026): Zahl + Hauptwort, Rumänisch (one / few / other mit „de" ab 20). */
function caractereTabRo(n: number): string {
  return mehrzahl(n, "ro", { one: (z) => `${z} caracter`, few: (z) => `${z} caractere`, other: (z) => `${z} de caractere` });
}

/**
 * ★ O2-LIB (29.10.2026): DIE KÖPFE DER TABELLE SCHWEDISCH - du für alle: das Kind
 * liest über sich, die Lehrkraft über „eleven". Gleiche Zahlen aus denselben Konstanten.
 */
export const HINWEIS_TABELLE_SV: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `När du började Utmaningen - med din första tangenttryckning.`,
    minuten:
      `Hur länge du fick skriva. Tiden du väntade på uppläsningen ingår inte.`,
    niveau:
      `Vilka tangenter som fanns i texten - från grundraden till programkod. Hela din ` +
      `klass skrev med samma tangenter.`,
    anschlaege:
      `Hur många tecken per minut du skrev rätt. Tiden du väntade på uppläsningen är ` +
      `avdragen.`,
    treffsicherheit: `Hur många av dina anslag som var rätt, i procent.`,
    leistungswert:
      `Din träffsäkerhet och din hastighet i ett tal från 0 till 100. Att skriva ` +
      `noggrant väger tyngre: ett felslag räknas som ${FEHLER_GEWICHT} tecken, och ` +
      `dubbel hastighet räknas inte dubbelt (hastigheten räknas upp till ` +
      `${BEZUGSTEMPO} anslag per minut). Med färre än ${MIND_ZEICHEN_WERTUNG} tecken ` +
      `blir det ingen poäng. Det är inget betyg.`,
  },
  Sie: {
    datum: `När eleven började Utmaningen - med sin första tangenttryckning.`,
    minuten:
      `Hur länge eleven fick skriva: den tid för Utmaningen som du har ställt in. ` +
      `Väntetiden på uppläsningen ingår inte.`,
    niveau: `Vilka tangenter som fanns i texten - de tangenter du valde för hela klassen.`,
    anschlaege:
      `Rätt skrivna tecken per minut, mätt med Utmaningens klocka. Betänketid räknas; ` +
      `elevens väntan på uppläsningen räknas inte.`,
    treffsicherheit: `Andelen rätta anslag av alla elevens anslag.`,
    leistungswert:
      `Träffsäkerhet och hastighet i ett tal från 0 till 100. Träffsäkerheten väger ` +
      `tyngre: ett felslag räknas som ${FEHLER_GEWICHT} tecken, och dubbel hastighet ` +
      `räknas inte dubbelt (hastigheten räknas upp till ${BEZUGSTEMPO} anslag per ` +
      `minut). Med färre än ${MIND_ZEICHEN_WERTUNG} tecken blir det ingen poäng. Det är ` +
      `inget betyg - betyget sätter du.`,
  },
};

/**
 * ★ O2-LIB (30.10.2026): DIE KÖPFE DER TABELLE UKRAINISCH - das Kind liest ти, die Lehrkraft ви. Beide OHNE
 * Vergangenheit über eine Person (Glossar §1 Regel 2). Gleiche Zahlen aus denselben Konstanten. (`znakyUk` und
 * `znakivUk` stehen oben bei {@link HINWEIS_CHALLENGE_UK}.)
 */
export const HINWEIS_TABELLE_UK: Record<TabellenAnrede, Record<TabellenSpalte, string>> = {
  du: {
    datum: `Початок Виклику - від твого першого натискання клавіші.`,
    minuten: `Час на друк. Очікування читання вголос до нього не входить.`,
    niveau:
      `Які клавіші траплялися в тексті - від основного ряду до програмного коду. ` +
      `Увесь твій клас друкував з однаковими клавішами.`,
    anschlaege:
      `Твої правильно надруковані знаки за хвилину. Очікування читання вголос віднято.`,
    treffsicherheit: `Скільки відсотків твоїх натискань було правильними.`,
    leistungswert:
      `Твоя точність і швидкість в одному числі від 0 до 100, причому уважний друк важить ` +
      `більше: одне хибне натискання враховується як ${znakyUk(FEHLER_GEWICHT)}, а вдвічі ` +
      `більша швидкість не враховується вдвічі (швидкість зараховується до ` +
      `${znakivUk(BEZUGSTEMPO)} за хвилину). Якщо знаків менше ніж ` +
      `${znakivUk(MIND_ZEICHEN_WERTUNG)}, балів немає. Це не оцінка.`,
  },
  Sie: {
    datum: `Початок Виклику - від першого натискання клавіші.`,
    minuten:
      `Час на друк: тривалість Виклику за вашим налаштуванням. Очікування читання вголос ` +
      `до нього не входить.`,
    niveau: `Які клавіші траплялися в тексті - за вашим вибором для всього класу.`,
    anschlaege:
      `Правильно надруковані знаки за хвилину за годинником Виклику. Роздуми зараховуються, ` +
      `очікування читання вголос - ні.`,
    treffsicherheit: `Частка правильних натискань від усіх натискань.`,
    leistungswert:
      `Точність і швидкість в одному числі від 0 до 100, причому точність важить більше: одне ` +
      `хибне натискання враховується як ${znakyUk(FEHLER_GEWICHT)}, а вдвічі більша швидкість не ` +
      `враховується вдвічі (швидкість зараховується до ${znakivUk(BEZUGSTEMPO)} за хвилину). ` +
      `Якщо знаків менше ніж ${znakivUk(MIND_ZEICHEN_WERTUNG)}, балів немає. ` +
      `Це не оцінка - оцінку ставите ви.`,
  },
};

/** ★ E11a-5 (Falle 30): Tabelle statt `sprache === "en" ? … : Deutsch`. */
const TABELLE_JE_SPRACHE: Record<
  BedienSprache,
  Record<TabellenAnrede, Record<TabellenSpalte, string>>
> = {
  de: HINWEIS_TABELLE,
  en: HINWEIS_TABELLE_EN,
  fr: HINWEIS_TABELLE_FR,
  es: HINWEIS_TABELLE_ES,
  it: HINWEIS_TABELLE_IT,
  pl: HINWEIS_TABELLE_PL,
  tr: HINWEIS_TABELLE_TR,
  cs: HINWEIS_TABELLE_CS,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: HINWEIS_TABELLE_BG,
  el: HINWEIS_TABELLE_EL,
  hu: HINWEIS_TABELLE_HU,
  nl: HINWEIS_TABELLE_NL,
  pt: HINWEIS_TABELLE_PT,
  br: HINWEIS_TABELLE_BR,
  ro: HINWEIS_TABELLE_RO,
  sv: HINWEIS_TABELLE_SV,
  uk: HINWEIS_TABELLE_UK,
};

/** Die Tabellen-Köpfe in der Bedienungssprache - ohne Angabe Deutsch. */
export function hinweisTabelle(
  anrede: TabellenAnrede,
  sprache: BedienSprache = "de",
): Readonly<Record<TabellenSpalte, string>> {
  return TABELLE_JE_SPRACHE[sprache][anrede];
}
