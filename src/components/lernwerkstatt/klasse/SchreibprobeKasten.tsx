/**
 * ★★★★★ Die SCHREIBPROBE aus der Sicht der LEHRKRAFT - ein Kasten in „Meine
 * Klassen" (09.09.2026).
 *
 * Auftrag Johannes, 09.09.2026 (wörtlich):
 * *„in der Klassenverwaltung »Meine Klasse« brauchen wir einen weiteren Bereich
 * mit Prüfung. Gilt für die ganze klasse, das Tastaturlevel kann im Puldwonmenü
 * eingestellt werden, von grundreihe bis alles, … ein schalter mit »jetzt
 * Starten« gibt es auch, die prüfung beginnt bei jedem kind erst mit dem ersten
 * tastendruck. Ab dem startpunkt haben schüler 10min zeit die prüfung zu
 * starten. Die prüfungszeit kann eingegeben werden. … genau so die lehrer, sie
 * sehen das in der klassenübersicht"*
 *
 * ★★ Gestartet wird NUR sofort (Johannes 10.09.2026 abends: Datum, Uhrzeit
 * und der zweite Schalter gehören nicht in das Formular, „Jetzt starten"
 * bleibt). Die Lehrkraft steht im Raum; ein Termin im Voraus war eine Uhr
 * mehr, die niemand brauchte. Die Prüfungszeit steht direkt neben dem Niveau -
 * die zwei Angaben, die man vor dem Start wirklich einstellt.
 *
 * ── Was dieser Kasten ist und was er NICHT ist ─────────────────────────────
 * Er ist die BEDIENUNG einer Sache, die vollständig in `lib/typing/schreibprobe.ts`
 * beschrieben ist: Zeiten, Niveaus, Textrotation, Phasen. **Hier wird nichts
 * davon nachgerechnet** - jede Zahl kommt aus einer Funktion dort. Wer eine
 * Regel ändern will, ändert sie im Modul; dieser Kasten zeigt sie nur.
 * Der Grund ist die Fehlerklasse, an der wir mehrfach hängen geblieben sind:
 * zwei Stellen, die voneinander nichts wissen
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Zwei Zustände, nicht zwei Kästen - und EINE Zeile, die immer steht ─────
 *   A  keine gestartet ODER vorbei → in der Zeile: Niveau · Min · „Jetzt starten"
 *   B  gestartet, läuft            → in der Zeile: „läuft", Restzeit, Bereit bzw.
 *                                    Abgegeben, „absagen"
 * ★★★ Seit 11.09.2026 klappt der Kasten ein und steht beim Laden ZU (Johannes:
 * *„Die Tastenchallenge kann man einklappen und ist es standardmäßig auch,
 * aber auch eingeklappt kann man die drei wichtigen Dinge sehen und einstellen
 * (Niveau; Min; Starten)"*). Aufgeklappt kommen dazu: die Einzelheiten des
 * Zustands und die Ergebnisse jeder Runde (seit L3, 19.09.2026, auch die eben
 * beendete ZUGEKLAPPT, jede mit einem grossen Aufklapp-Schalter - siehe
 * `FruehereProbe`). Warum ein Knopf und kein `<details>`: siehe die Zeile unten.
 *
 * ★★★ Wer den Bereich öffnet, sieht immer das Formular (Johannes 10.09.2026:
 * *„wenn ich auf Tippchallenge gehe soll man immer die seite sehen die kommt
 * wenn man »neue Tippchallenge …« klickt"*). Wer ihn öffnet, will die nächste
 * Runde starten; die Ergebnisse stehen darunter.
 *
 * ── Die Rangliste (10.09.2026) ─────────────────────────────────────────────
 * Die Ergebnistabelle jeder Runde ist nach dem
 * Rangprozent geordnet, das beste Kind oben. Wie geordnet wird und warum ein
 * zu kurzes Ergebnis KEINEN letzten Platz bekommt, steht bei {@link rangliste};
 * gerechnet wird nichts davon hier, sondern in `schreibprobeWertung.ts`.
 *
 * ── ⚠️⚠️ WARUM DER ZEITSTAND NICHT IN EINER LIVE-REGION STEHT ─────────────
 * Jede `aria-live`-Meldung verdrängt auf der Braillezeile vier Sekunden lang,
 * was dort steht (an der NVDA-Quelle belegt, JAWS ebenso -
 * `UEBERGABE-2026-09-09-DIE-BRAILLEZEILE-BLEIBT-RUHIG.md`,
 * [[reference_live_region_ist_braille_blitzmeldung]]). Ein Zeitstand, der jede
 * Sekunde neu gemeldet wird, macht die Seite für eine Lehrkraft mit
 * Braillezeile unbenutzbar - sie käme nie mehr zum Lesen.
 * ⇒ Die laufende Zahl ist `aria-hidden` und daneben steht ein Satz, der die
 *   Sache OHNE Ticken sagt („Das Einstiegsfenster schliesst um 10:35 Uhr").
 *   Nur Erfolgsmeldungen nach dem Speichern gehen in die Live-Region.
 *
 * ── Weitere Pflichten dieses Repositories ──────────────────────────────────
 *  • Anrede „Sie" (K21) - reine Lehrkraft-Oberfläche.
 *  • **Nichts wird je `disabled`** (R5): ein Knopf, der beim Drücken aus der
 *    Fokus-Ordnung fällt, lässt einen Menschen mit Braillezeile im Nichts
 *    stehen. Stattdessen `aria-disabled`, Sperre im Handler - und der sagt,
 *    warum nichts passiert ist.
 *  • Jeder Schalter hat ein Fokus-Ziel ([[feedback_fokus_pflicht_alle_apps]]):
 *    nach dem Starten „läuft" in der Zeile, nach dem Absagen der Schalter des
 *    Kastens - beide stehen auch zugeklappt sichtbar da (11.09.2026).
 *  • Nie etwas gegen ein Kind ([[feedback_nie_gegen_das_kind]]): „nicht
 *    angetreten" ist eine Tatsache, mehr steht da nicht.
 *  • Farben nur über die Kürzel des Repositories - es gibt sieben
 *    Kontrastmodi, ein fester Farbwert stimmt in höchstens einem davon.
 *
 * ⚠️ Das Wort für die Sache kommt aus {@link PRUEFUNG_WORT} und wird hier
 * NIRGENDS ausgeschrieben. Die Sätze setzen voraus, dass es WEIBLICH ist
 * („die Schreibprobe", „die Prüfung") - wer ein sächliches Wort einsetzt, muss
 * die Artikel hier mitziehen.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { klassenUebungsSprache, type TypingAccount, type TypingClass } from "@/lib/typing/account";
import { typingBackend } from "@/lib/typing/backend";
import { fmtPercent } from "@/lib/typing/metrics";
import {
  DAUER_MIN_GROESST,
  DAUER_MIN_KLEINST,
  DAUER_VORGABE,
  EINSTIEGSFENSTER_MIN,
  niveauDefs,
  PRUEFUNG_WORT,
  bereitSatz,
  niveauTexte,
  pruefungWort,
  pruefungWortMehrzahl,
  uhrzeitFr,
  bereitschaft,
  einstiegRestMs,
  type BereitMeldung,
  istFreiesSchreiben,
  klasseVorbeiMs,
  mmss,
  naechsterStart,
  neueProbenId,
  niveauDef,
  niveauHatBank,
  defiGrundreihe,
  planAusEinstellungen,
  startGeschrieben,
  stelleBezeichnung,
  zeigerAusEinstellungen,
  type NaechsterStart,
  type ProbenNiveau,
  type SchreibprobePlan,
} from "@/lib/typing/schreibprobe";
import {
  WACKLIG_MIND_DRAN,
  WACKLIG_QUOTE,
  endeVon,
  tastenName,
  type Probenergebnis,
} from "@/lib/typing/schreibprobeAuswertung";
import { ladeTexte, type Probentext } from "@/lib/typing/schreibproben";
import { entferneUntippbareZeichen } from "@/lib/typing/eigenerText";
import { klassenStufe } from "@/lib/typing/klassenEinstellungen";
import { useEigenerTextUpload } from "@/lib/typing/useEigenerTextUpload";
import { EigenerTextQuelle } from "./EigenerTextQuelle";
import { EigenerTextVorschauAnzeige } from "./EigenerTextVorschauAnzeige";
import { bestenWert, rangProzent, type Wertung } from "@/lib/typing/schreibprobeWertung";
import { probeVorbei } from "@/lib/typing/useSchreibprobe";
// ⚠️ Die Rundung und die Ersatzrechnung stehen im Bauteil der Kind-Ansicht -
// EINMAL, für alle drei Anzeigen der Wertung. Zwei Fassungen derselben Rundung
// liefen unweigerlich auseinander
// ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
import { eineStelle, wertungVon } from "@/components/typing/SchreibprobeErgebnis";
import { Erklaert } from "@/components/typing/Erklaert";
import { Spaltenkopf } from "@/components/typing/Spaltenkopf";
import { Tipp } from "@/components/Tipp";
import { Aufklappen } from "@/components/Aufklappen";
import { hinweiseChallenge } from "@/lib/typing/schreibprobeHinweise";
// ⚠️ `texte` heisst hier schon der Zustand mit den Prüfungstexten (weiter unten).
import {
  GEBIET,
  mehrzahl,
  texte as textTabelle,
  useBedienSprache,
  type BedienSprache,
} from "@/lib/bedienSprache";
import type { Teil } from "@/lib/bedienSprache/texte";
// ★ E1 (24.09.2026): der Lernweg (Klasse, Plan, Ergebnis).
import { lernwegVon, type Lernweg } from "@/lib/typing/lernweg";
import { activeLayoutId } from "@/lib/typing/layouts";

/**
 * ★★★ DIE TEXTE DES TIPPCHALLENGE-KASTENS der Lehrkraft in beiden
 * Bedienungssprachen (EN6b, 19.09.2026). Deutsch wortgleich wie vorher; wo ein
 * Satz im JSX aus mehreren Textknoten bestand, liefert die Tabelle dieselben
 * Stücke (`Teil[]`).
 *
 * Wörter nach Glossar §3.7 und dem englischen Handbuch (Kapitel 6): *Typing
 * Challenge* (aus `pruefungWort`) · *Key range* · *Min* · *Start now* · *in
 * progress* · *Ready: 12 of 14* · *Handed in: 3 of 18* · *Not handed in yet* ·
 * *Call off the Typing Challenge* · *Past Typing Challenges* · *window for
 * starting* · *time limit* · *place* · *score* · *too short to score* · *did
 * not take part* · *wobbly keys*. Kind ⇒ *pupil*. Die Lehrkraft liest *you*.
 * Uhrzeiten englisch 24 Stunden ohne „Uhr" (Glossar §1.2).
 */
const K = textTabelle({
  de: {
    // --- Wo es weitergeht
    weiterIn: (stelle: string) => `Es geht weiter in ${stelle}.`,
    esKommt: (stelle: string) => `Es kommt ${stelle}.`,
    herkunftWeiter: (w: string) =>
      `So weit kam das Kind, das in der letzten ${w} dieses Niveaus am weitesten geschrieben hat.`,
    herkunftWiederholt: (w: string) =>
      `Die letzte ${w} dieses Niveaus hat niemand abgegeben - sie beginnt an derselben Stelle.`,
    herkunftNeu: "Diesen Text hat die Klasse noch nicht geschrieben.",
    nachsehen: "Es wird nachgesehen, wo es weitergeht.",
    // --- Die Tabelle einer Runde
    keine: "keine",
    undWeitere: (namen: string, rest: number) => `${namen} und ${rest} weitere`,
    prozent: (wert: string) => `${wert} %`,
    keinVergleich: "kein Vergleichswert",
    zuKurz: "zu kurz für eine Wertung",
    nochKeinErgebnis: "Es liegt noch kein Ergebnis vor.",
    klassenschnitt: "Klassenschnitt:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      apm,
      " Anschläge je Minute, ",
      genau,
      " ",
      "Treffsicherheit - aus ",
      mit,
      " von ",
      alle,
      " ",
      alle === 1 ? "Kind" : "Kindern",
      ".",
    ],
    wertSchnitt: "Leistungswert im Schnitt:",
    ausGewerteten: (n: number) => ` (aus ${n} gewerteten Ergebnissen)`,
    ohneWertungBleibt: " Ohne Wertung bleiben die anderen Zahlen der Zeile trotzdem stehen.",
    rang: "Rang",
    name: "Name",
    leistungswert: "Leistungswert",
    vorlesen: "Vorlesen",
    anschlaege: "Anschläge/Min",
    treffsicherheit: "Treffsicherheit",
    zeichen: "Zeichen",
    fehler: "Fehler",
    // ★ 23.09.2026 („Freies Schreiben"): die Spalte nur bei freiem Plan.
    korrekturen: "Korrekturen",
    wacklig: "Wacklige Tasten",
    ohneWertung: "ohne Wertung",
    vorgelesen: (zeit: string) => `ja, ${zeit} abgezogen`,
    nein: "nein",
    zuschlag: "mit Zeitzuschlag gewertet: ",
    nichtAngetreten: "nicht angetreten",
    // --- Meldungen
    kindBereit: "Das Kind ist bereit.",
    alleBereit: (n: number) => `Alle ${n} Kinder sind bereit.`,
    belegt: "Einen Augenblick - die vorige Änderung wird noch gespeichert.",
    dauerFalsch: (von: number, bis: number) =>
      `Die Prüfungszeit muss zwischen ${von} und ${bis} Minuten liegen. Nichts gespeichert.`,
    dateiZuerst: "Bitte zuerst eine eigene Datei hochladen. Nichts gespeichert.",
    dateiNicht: "Die Datei konnte nicht gespeichert werden. Bitte noch einmal versuchen.",
    texteNicht: "Die Texte konnten gerade nicht geladen werden. Nichts gespeichert - bitte noch einmal versuchen.",
    nichtGespeichert: "Nicht gespeichert. Bitte noch einmal versuchen.",
    gestartetDatei: (min: number, datei: string) => `Gestartet: ${min} Minuten, „${datei}".`,
    gestartet: (min: number, stelle: string) => `Gestartet: ${min} Minuten, ${stelle}.`,
    absagenFrage: (w: string) =>
      `${w} wirklich absagen? Kinder, die schon abgegeben haben, behalten ihr Ergebnis.`,
    nichtsAbgesagt: "Abgesagt wurde nichts.",
    nichtAbgesagt: "Nicht abgesagt. Bitte noch einmal versuchen.",
    abgesagt: (w: string) => `${w} ist abgesagt. Sie können eine neue starten.`,
    // --- Der Zeitstand
    uhr: (zeit: string) => `${zeit} Uhr`,
    bisEinstieg: (uhr: string) => `bis das Einstiegsfenster um ${uhr} schliesst`,
    beginnenBis: (uhr: string) => `Beginnen bis ${uhr}`,
    bisLetztes:
      "bis die Schreibzeit auch des letzten Kindes abgelaufen ist - das Einstiegsfenster ist zu, wer begonnen hat, schreibt noch",
    einstiegZu: "Einstieg zu - wer begonnen hat, schreibt noch",
    nochSatz: (satz: string): readonly Teil[] => ["Noch ", satz, "."],
    nichtMehrInKlasse: "nicht mehr in dieser Klasse",
    // --- Der Stand für den Aussen-Schalter
    laeuft: "läuft",
    laeuftMit: (teil: string) => `läuft · ${teil}`,
    bereitKurz: (a: number, b: number) => `Bereit: ${a} von ${b}`,
    abgegebenKurz: (a: number, b: number) => `Abgegeben: ${a} von ${b}`,
    // --- Die Zeile
    niveau: "Niveau",
    tastaturniveau: "Tastaturniveau",
    // ★ 23.09.2026 („Freies Schreiben"): die Wahl der Art - Bauplan §7, wörtlich
    // „Streng - jede Taste muss stimmen" und „Freies Schreiben - Fehler bleiben
    // stehen, Rücktaste erlaubt".
    art: "Art",
    artStreng: "Streng - jede Taste muss stimmen",
    artFrei: "Freies Schreiben - Fehler bleiben stehen, Rücktaste erlaubt",
    /** Kurzer Vermerk neben dem Niveau der laufenden Challenge, wenn frei. */
    frei: "Freies Schreiben",
    min: "Min",
    pruefungszeitName: "Prüfungszeit (Minuten)",
    jetztStarten: "Jetzt starten",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Bereit: ", a, " von", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Abgegeben: ", a, " von", " ", b],
    absagenTipp: (w: string) =>
      `Nimmt die laufende ${w} zurück. Wer schon abgegeben hat, behält sein Ergebnis.`,
    absagenKnopf: (w: string): readonly Teil[] => [w, " absagen"],
    // --- Aufgeklappt
    wiederVonVorn:
      "Ist der Text zu Ende, bevor die Prüfungszeit vorbei ist, beginnt er einfach wieder von vorn - bei einem kurzen Text unter Umständen mehrfach.",
    gestartetDt: "Gestartet",
    pruefungszeit: "Prüfungszeit",
    text: "Text",
    // Deutsch wortgleich wie vorher (auch bei 1) - nur das Englische unterscheidet.
    jeKind: (_minuten: number) => " Minuten je Kind, ab dessen erstem Tastendruck",
    eigeneDatei: "eigene Datei",
    // ★ E-1 (24.09.2026) - erscheint nur in der englischen Bedienung, der
    // Schlüssel steht hier nur, weil `textTabelle` beide Sprachen verlangt.
    texteNochDeutsch: "",
    zitat: (name: string) => `„${name}"`,
    werAbgegeben: "Es wird nachgesehen, wer schon abgegeben hat.",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Abgegeben: ", a, " von ", b],
    alleAbgegeben: "Alle Kinder haben abgegeben.",
    nochNichtAbgegeben: (namen: string) => `Noch nicht abgegeben: ${namen}`,
    listeAlt:
      "Die Liste konnte gerade nicht neu geladen werden - was hier steht, ist der zuletzt gelesene Stand.",
    vergangene: (w: string, n: number): readonly Teil[] => ["Vergangene ", w, " (", n, ")"],
    ergebnisseAlt:
      "Die Ergebnisse konnten gerade nicht geladen werden. Was hier steht, ist der zuletzt gelesene Stand - bitte laden Sie die Seite später noch einmal.",
    zeitpunktFehlt: "Zeitpunkt nicht vermerkt",
    /** L3 (19.09.2026): der Hinweis am Aufklapp-Schalter einer vergangenen Runde. */
    rundeTipp: (w: string) => `Klappt die Ergebnistabelle dieser ${w} auf oder zu.`,
    ergebnisse: (n: number) => `${n} ${n === 1 ? "Ergebnis" : "Ergebnisse"}`,
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      "„Wacklig\" heisst: Die Taste war mindestens ",
      dran,
      " mal dran und wurde in weniger als ",
      quote,
      " ",
      "Prozent der Fälle getroffen. Bei so wenigen Anschlägen ist das ein Hinweis, wo sich Üben lohnt - keine Diagnose.",
    ],
    nochKeineRunde: (w: string): readonly Teil[] => [
      "Es ist noch keine ",
      w,
      " zu Ende gegangen - ihre Ergebnisse stehen danach hier.",
    ],
  },
  en: {
    weiterIn: (stelle: string) => `It continues at ${stelle}.`,
    esKommt: (stelle: string) => `It starts with ${stelle}.`,
    herkunftWeiter: (w: string) =>
      `That is where the pupil who got furthest in the last ${w} with this key range stopped.`,
    herkunftWiederholt: (w: string) =>
      `Nobody handed in the last ${w} with this key range - it starts at the same place.`,
    herkunftNeu: "The class hasn't typed this text yet.",
    nachsehen: "Checking where it continues …",
    keine: "none",
    undWeitere: (namen: string, rest: number) => `${namen} and ${rest} more`,
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "nothing to compare with",
    zuKurz: "too short to score",
    nochKeinErgebnis: "There are no results yet.",
    klassenschnitt: "Class average:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `${apm} keystrokes per minute, ${genau} accuracy - from ${mit} of ${mehrzahl(alle, "en", {
        one: (z) => `${z} pupil`,
        other: (z) => `${z} pupils`,
      })}.`,
    ],
    wertSchnitt: "Average score:",
    ausGewerteten: (n: number) =>
      mehrzahl(n, "en", { one: (z) => ` (from ${z} scored result)`, other: (z) => ` (from ${z} scored results)` }),
    ohneWertungBleibt: " Without a score, the other figures in the row still stand.",
    rang: "Place",
    name: "Name",
    leistungswert: "Score",
    vorlesen: "Read aloud",
    anschlaege: "Keystrokes/min",
    treffsicherheit: "Accuracy",
    zeichen: "Characters",
    fehler: "Mistakes",
    korrekturen: "Corrections",
    wacklig: "Wobbly keys",
    ohneWertung: "not scored",
    vorgelesen: (zeit: string) => `yes, ${zeit} taken off`,
    nein: "no",
    zuschlag: "scored with extra time: ",
    nichtAngetreten: "did not take part",
    kindBereit: "The pupil is ready.",
    alleBereit: (n: number) => `All ${n} pupils are ready.`,
    belegt: "One moment - the previous change is still being saved.",
    dauerFalsch: (von: number, bis: number) =>
      `The time limit must be between ${von} and ${bis} minutes. Nothing has been saved.`,
    dateiZuerst: "Please upload a file of your own first. Nothing has been saved.",
    dateiNicht: "The file couldn't be saved. Please try again.",
    texteNicht: "The texts couldn't be loaded just now. Nothing has been saved - please try again.",
    nichtGespeichert: "Not saved. Please try again.",
    gestartetDatei: (min: number, datei: string) =>
      `Started: ${mehrzahl(min, "en", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` })}, “${datei}”.`,
    gestartet: (min: number, stelle: string) =>
      `Started: ${mehrzahl(min, "en", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` })}, ${stelle}.`,
    absagenFrage: (w: string) =>
      `Call off the ${w}? Pupils who have already handed in keep their result.`,
    nichtsAbgesagt: "Nothing has been called off.",
    nichtAbgesagt: "Not called off. Please try again.",
    abgesagt: (w: string) => `The ${w} has been called off. You can start a new one.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Counting down until the window for starting closes at ${uhr}.`,
    beginnenBis: (uhr: string) => `Start by ${uhr}`,
    bisLetztes:
      "Counting down until the last pupil's typing time is up - the window for starting has closed; anyone who has begun is still typing.",
    einstiegZu: "Window for starting closed - anyone who has begun is still typing",
    // Englisch steht der Satz schon ganz da (siehe `bisEinstieg`, `bisLetztes`).
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "no longer in this class",
    laeuft: "in progress",
    laeuftMit: (teil: string) => `in progress · ${teil}`,
    bereitKurz: (a: number, b: number) => `Ready: ${a} of ${b}`,
    abgegebenKurz: (a: number, b: number) => `Handed in: ${a} of ${b}`,
    niveau: "Key range",
    tastaturniveau: "Key range",
    // ★ 23.09.2026: dieselbe Wahl englisch. Kein Glossar-Eintrag vorhanden -
    // „Type" nach britischem Schulgebrauch („exam type"); „Free writing" wörtlich
    // wie die Bauplan-Überschrift.
    art: "Type",
    artStreng: "Strict - every key must be correct",
    artFrei: "Free writing - mistakes stay, backspace allowed",
    frei: "Free writing",
    min: "Min",
    pruefungszeitName: "Time limit (minutes)",
    jetztStarten: "Start now",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Ready: ", a, " of", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Handed in: ", a, " of", " ", b],
    absagenTipp: (w: string) =>
      `Withdraws the ${w} that is running. Anyone who has already handed in keeps their result.`,
    absagenKnopf: (w: string): readonly Teil[] => [`Call off the ${w}`],
    // (Das Deutsche sagte es bis 19.09. verdreht - beim Übersetzen gefunden und
    // berichtigt; Übergabe 17.09.: „bei kurzem Text beginnt er einfach von vorne".)
    wiederVonVorn:
      "If the text ends before the time limit is up, it simply starts again from the beginning - with a short text, possibly several times.",
    gestartetDt: "Started",
    pruefungszeit: "Time limit",
    text: "Text",
    // ★ EN10 (19.09.2026, im Browser): „1 minutes per pupil" - Einzahl bei 1.
    jeKind: (minuten: number) =>
      minuten === 1
        ? " minute per pupil, from their first keystroke"
        : " minutes per pupil, from their first keystroke",
    eigeneDatei: "custom file",
    // ★ E-1 (24.09.2026, BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md §10): Die
    // eingebauten Texte sind deutsch (ä ö ü; auf US/UK-Tastaturen nicht
    // tippbar). Bis die englische Bank steht (E7), sagen wir es offen.
    texteNochDeutsch:
      "The built-in texts are in German for now (with ä, ö and ü). For an English class, " +
      "choose “Custom file” under Key range. English texts are being written.",
    zitat: (name: string) => `“${name}”`,
    werAbgegeben: "Checking who has handed in …",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Handed in: ", a, " of ", b],
    alleAbgegeben: "All pupils have handed in.",
    nochNichtAbgegeben: (namen: string) => `Not handed in yet: ${namen}`,
    listeAlt:
      "The list couldn't be reloaded just now - what you see here is the last state that was read.",
    vergangene: (w: string, n: number): readonly Teil[] => ["Past ", w, " (", n, ")"],
    ergebnisseAlt:
      "The results couldn't be loaded just now. What you see here is the last state that was read - please reload the page later.",
    zeitpunktFehlt: "Time not recorded",
    rundeTipp: (w: string) => `Opens or closes the table of results for this ${w}.`,
    ergebnisse: (n: number) =>
      mehrzahl(n, "en", { one: (z) => `${z} result`, other: (z) => `${z} results` }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `“Wobbly” means: the key came up at least ${dran} times and was typed correctly less than ${quote}% of the time. With so few keystrokes, that is a pointer to where practice pays off - not a diagnosis.`,
    ],
    nochKeineRunde: (w: string): readonly Teil[] => [
      `No ${w} has finished yet - its results will appear here afterwards.`,
    ],
  },
  /*
    ★★★ E11a-5 (26.09.2026): FRANZÖSISCH, neu geschrieben aus der Funktion des
    Kastens - die Lehrkraft liest „vous", das Kind heisst *l'élève*. Wörter wie
    in `LehrerHilfe.fr.tsx` §8b und Glossar §9.2: *le Défi* (aus
    `pruefungWort`), *niveau de touches*, *type* (Strict / Écriture libre),
    *temps* (Prüfungszeit), *Lancer maintenant*, *délai pour commencer*,
    *rendre* (abgeben), *rang*, *score*, *précision*, *touches instables*,
    *n'a pas participé*. Uhrzeit „10 h 14" (Bauplan §9.1, siehe `uhrzeitFr`),
    Prozent mit Leerzeichen, gerade Anführungszeichen (Braillezeile).
    ⚠️ Bis hierher fehlte `fr` ganz: `texte` heisst in dieser Datei
    `textTabelle`, darum sah der fr-Lücken-Zähler die Tabelle nie, und „fr"
    bekam still Englisch.
  */
  fr: {
    weiterIn: (stelle: string) => `Suite : ${stelle}.`,
    esKommt: (stelle: string) => `À venir : ${stelle}.`,
    herkunftWeiter: (w: string) =>
      `C'est l'endroit le plus loin atteint lors du dernier ${w} de ce niveau.`,
    herkunftWiederholt: (w: string) =>
      `Personne n'a rendu le dernier ${w} de ce niveau - il reprend au même endroit.`,
    herkunftNeu: "La classe n'a pas encore écrit ce texte.",
    nachsehen: "Recherche de l'endroit où reprendre …",
    keine: "aucune",
    undWeitere: (namen: string, rest: number) => `${namen} et ${rest} autres`,
    prozent: (wert: string) => `${wert} %`,
    keinVergleich: "pas de valeur de comparaison",
    zuKurz: "trop court pour un score",
    nochKeinErgebnis: "Il n'y a pas encore de résultat.",
    klassenschnitt: "Moyenne de la classe :",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `${apm} frappes par minute, ${genau} de précision - ${mit} sur ${mehrzahl(alle, "fr", {
        one: (z) => `${z} élève`,
        other: (z) => `${z} élèves`,
      })}.`,
    ],
    wertSchnitt: "Score moyen :",
    ausGewerteten: (n: number) =>
      mehrzahl(n, "fr", {
        one: (z) => ` (sur ${z} résultat avec score)`,
        other: (z) => ` (sur ${z} résultats avec score)`,
      }),
    ohneWertungBleibt: " Sans score, les autres chiffres de la ligne restent affichés.",
    rang: "Rang",
    name: "Nom",
    leistungswert: "Score",
    vorlesen: "Lecture à voix haute",
    anschlaege: "Frappes/min",
    treffsicherheit: "Précision",
    zeichen: "Caractères",
    fehler: "Erreurs",
    korrekturen: "Corrections",
    wacklig: "Touches instables",
    ohneWertung: "sans score",
    vorgelesen: (zeit: string) => `oui, ${zeit} déduites`,
    nein: "non",
    zuschlag: "noté avec temps supplémentaire : ",
    nichtAngetreten: "n'a pas participé",
    kindBereit: "L'élève peut commencer.",
    alleBereit: (n: number) => `Les ${n} élèves peuvent commencer.`,
    belegt: "Un instant - la modification précédente est encore en cours d'enregistrement.",
    dauerFalsch: (von: number, bis: number) =>
      `Le temps doit être entre ${von} et ${bis} minutes. Rien n'a été enregistré.`,
    dateiZuerst: "Chargez d'abord un fichier personnel. Rien n'a été enregistré.",
    dateiNicht: "Le fichier n'a pas pu être enregistré. Veuillez réessayer.",
    texteNicht: "Les textes n'ont pas pu être chargés. Rien n'a été enregistré - veuillez réessayer.",
    nichtGespeichert: "Non enregistré. Veuillez réessayer.",
    gestartetDatei: (min: number, datei: string) =>
      `Lancé : ${mehrzahl(min, "fr", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` })}, "${datei}".`,
    gestartet: (min: number, stelle: string) =>
      `Lancé : ${mehrzahl(min, "fr", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` })}, ${stelle}.`,
    absagenFrage: (w: string) =>
      `Vraiment annuler le ${w} ? Les élèves qui ont déjà rendu gardent leur résultat.`,
    nichtsAbgesagt: "Rien n'a été annulé.",
    nichtAbgesagt: "Non annulé. Veuillez réessayer.",
    abgesagt: (w: string) => `Le ${w} est annulé. Vous pouvez en lancer un nouveau.`,
    // Die Uhrzeit kommt schon als „10 h 14" (siehe `UHRZEIT` unten).
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) =>
      `Compte à rebours jusqu'à la fin du délai pour commencer, à ${uhr}.`,
    beginnenBis: (uhr: string) => `Commencer avant ${uhr}`,
    bisLetztes:
      "Compte à rebours jusqu'à la fin du temps du dernier élève - le délai pour commencer est écoulé ; qui a commencé tape encore.",
    einstiegZu: "Délai pour commencer écoulé - qui a commencé tape encore",
    // Wie im Englischen steht der Satz schon ganz da.
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "n'est plus dans cette classe",
    laeuft: "en cours",
    laeuftMit: (teil: string) => `en cours · ${teil}`,
    bereitKurz: (a: number, b: number) => `Prêts : ${a} sur ${b}`,
    abgegebenKurz: (a: number, b: number) => `Rendus : ${a} sur ${b}`,
    niveau: "Niveau",
    tastaturniveau: "Niveau de touches",
    art: "Type",
    artStreng: "Strict - chaque touche doit être juste",
    artFrei: "Écriture libre - les erreurs restent, Retour arrière permis",
    frei: "Écriture libre",
    min: "Min",
    pruefungszeitName: "Temps (minutes)",
    jetztStarten: "Lancer maintenant",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Prêts : ", a, " sur", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Rendus : ", a, " sur", " ", b],
    absagenTipp: (w: string) =>
      `Retire le ${w} en cours. Qui a déjà rendu garde son résultat.`,
    absagenKnopf: (w: string): readonly Teil[] => [`Annuler le ${w}`],
    wiederVonVorn:
      "Si le texte se termine avant la fin du temps, il recommence simplement au début - avec un texte court, parfois plusieurs fois.",
    gestartetDt: "Lancé",
    pruefungszeit: "Temps",
    text: "Texte",
    jeKind: (minuten: number) =>
      minuten === 1
        ? " minute par élève, à partir de sa première frappe"
        : " minutes par élève, à partir de sa première frappe",
    eigeneDatei: "fichier personnel",
    // Nur, wo die eingebauten Texte wirklich deutsch sind (siehe `hinweisNochDeutsch`).
    texteNochDeutsch:
      'Pour ce niveau, les textes intégrés sont en allemand (avec ä, ö et ü). Pour écrire en français, choisissez "Fichier personnel" sous Niveau de touches.',
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Recherche de qui a déjà rendu …",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Rendus : ", a, " sur ", b],
    alleAbgegeben: "Tous les élèves ont rendu.",
    nochNichtAbgegeben: (namen: string) => `Pas encore rendu : ${namen}`,
    listeAlt:
      "La liste n'a pas pu être rechargée - ce qui est affiché ici est le dernier état lu.",
    // ★ E11a-5: als Vorlage `${w} passés` - so findet der Handbuch-Wächter
    // (`tastenflow-handbuch-fr.test.ts`) das Wort, das das Heft nennt.
    vergangene: (w: string, n: number): readonly Teil[] => [`${w} passés (`, n, ")"],
    ergebnisseAlt:
      "Les résultats n'ont pas pu être chargés. Ce qui est affiché ici est le dernier état lu - veuillez recharger la page plus tard.",
    zeitpunktFehlt: "Heure non enregistrée",
    rundeTipp: (w: string) => `Ouvre ou ferme le tableau des résultats de ce ${w}.`,
    ergebnisse: (n: number) =>
      mehrzahl(n, "fr", { one: (z) => `${z} résultat`, other: (z) => `${z} résultats` }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Instable" signifie : la touche est venue au moins ${dran} fois et a été réussie dans moins de ${quote} % des cas. Avec si peu de frappes, c'est une indication de ce qui vaut la peine d'être exercé - pas un diagnostic.`,
    ],
    nochKeineRunde: (w: string): readonly Teil[] => [
      `Aucun ${w} n'est encore terminé - ses résultats apparaitront ici ensuite.`,
    ],
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted. „Reto" ist männlich.
  es: {
    weiterIn: (stelle: string) => `Continúa: ${stelle}.`,
    esKommt: (stelle: string) => `Lo siguiente: ${stelle}.`,
    herkunftWeiter: (w: string) =>
      `Es el punto más lejano al que se llegó en el último ${w} de este nivel.`,
    herkunftWiederholt: (w: string) =>
      `Nadie entregó el último ${w} de este nivel - sigue en el mismo punto.`,
    herkunftNeu: "La clase todavía no ha escrito este texto.",
    nachsehen: "Buscando dónde seguir …",
    keine: "ninguna",
    undWeitere: (namen: string, rest: number) => `${namen} y ${rest} más`,
    prozent: (wert: string) => `${wert} %`,
    keinVergleich: "sin valor de comparación",
    zuKurz: "demasiado corto para una puntuación",
    nochKeinErgebnis: "Todavía no hay ningún resultado.",
    klassenschnitt: "Media de la clase:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `${apm} pulsaciones por minuto, ${genau} de precisión - ${mit} de ${mehrzahl(alle, "es", {
        one: (z) => `${z} estudiante`,
        other: (z) => `${z} estudiantes`,
      })}.`,
    ],
    wertSchnitt: "Puntuación media:",
    ausGewerteten: (n: number) =>
      mehrzahl(n, "es", {
        one: (z) => ` (de ${z} resultado con puntuación)`,
        other: (z) => ` (de ${z} resultados con puntuación)`,
      }),
    ohneWertungBleibt: " Sin puntuación, las demás cifras de la fila siguen visibles.",
    rang: "Puesto",
    name: "Nombre",
    leistungswert: "Puntuación",
    vorlesen: "Lectura en voz alta",
    anschlaege: "Pulsaciones por minuto",
    treffsicherheit: "Precisión",
    zeichen: "Caracteres",
    fehler: "Errores",
    korrekturen: "Correcciones",
    wacklig: "Teclas inseguras",
    ohneWertung: "sin puntuación",
    vorgelesen: (zeit: string) => `sí, ${zeit} descontados`,
    nein: "no",
    zuschlag: "valorado con tiempo extra: ",
    nichtAngetreten: "no participó",
    kindBereit: "Puede empezar.",
    alleBereit: (n: number) => `Los ${n} estudiantes pueden empezar.`,
    belegt: "Un momento - el cambio anterior todavía se está guardando.",
    dauerFalsch: (von: number, bis: number) =>
      `El tiempo tiene que estar entre ${von} y ${bis} minutos. No se ha guardado nada.`,
    dateiZuerst: "Suba primero un archivo propio. No se ha guardado nada.",
    dateiNicht: "No se pudo guardar el archivo. Vuelva a intentarlo, por favor.",
    texteNicht: "No se pudieron cargar los textos. No se ha guardado nada - vuelva a intentarlo, por favor.",
    nichtGespeichert: "No se ha guardado. Vuelva a intentarlo, por favor.",
    gestartetDatei: (min: number, datei: string) =>
      `Iniciado: ${mehrzahl(min, "es", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })}, "${datei}".`,
    gestartet: (min: number, stelle: string) =>
      `Iniciado: ${mehrzahl(min, "es", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` })}, ${stelle}.`,
    absagenFrage: (w: string) =>
      `¿Cancelar de verdad el ${w}? Quienes ya lo han entregado conservan su resultado.`,
    nichtsAbgesagt: "No se ha cancelado nada.",
    nichtAbgesagt: "No se ha cancelado. Vuelva a intentarlo, por favor.",
    abgesagt: (w: string) => `El ${w} está cancelado. Puede iniciar uno nuevo.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) =>
      `Tiempo restante hasta el final del plazo para empezar, a las ${uhr}.`,
    beginnenBis: (uhr: string) => `Empezar antes de las ${uhr}`,
    bisLetztes:
      "Tiempo restante hasta que termine la última persona - el plazo para empezar ha terminado; quien ya empezó sigue escribiendo.",
    einstiegZu: "Plazo para empezar terminado - quien ya empezó sigue escribiendo",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "ya no está en esta clase",
    laeuft: "en curso",
    laeuftMit: (teil: string) => `en curso · ${teil}`,
    bereitKurz: (a: number, b: number) => `Preparados: ${a} de ${b}`,
    abgegebenKurz: (a: number, b: number) => `Entregados: ${a} de ${b}`,
    niveau: "Nivel",
    tastaturniveau: "Nivel de teclas",
    art: "Tipo",
    artStreng: "Estricto - cada tecla tiene que estar bien",
    artFrei: "Escritura libre - los errores se quedan, se permite Retroceso",
    frei: "Escritura libre",
    min: "Min",
    pruefungszeitName: "Tiempo (minutos)",
    jetztStarten: "Iniciar ahora",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Preparados: ", a, " de", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Entregados: ", a, " de", " ", b],
    absagenTipp: (w: string) =>
      `Retira el ${w} en curso. Quien ya lo ha entregado conserva su resultado.`,
    absagenKnopf: (w: string): readonly Teil[] => [`Cancelar el ${w}`],
    wiederVonVorn:
      "Si el texto termina antes de que se acabe el tiempo, simplemente vuelve a empezar - con un texto corto, a veces varias veces.",
    gestartetDt: "Iniciado",
    pruefungszeit: "Tiempo",
    text: "Texto",
    jeKind: (minuten: number) =>
      minuten === 1
        ? " minuto por estudiante, desde su primera pulsación"
        : " minutos por estudiante, desde su primera pulsación",
    eigeneDatei: "archivo propio",
    texteNochDeutsch:
      'Para este nivel, los textos integrados están en alemán (con ä, ö y ü). Para escribir en español, elija "Archivo propio" en Nivel de teclas.',
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Buscando quién ya ha entregado …",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Entregados: ", a, " de ", b],
    alleAbgegeben: "Todo el alumnado ha entregado.",
    nochNichtAbgegeben: (namen: string) => `Todavía sin entregar: ${namen}`,
    listeAlt:
      "No se pudo volver a cargar la lista - lo que se ve aquí es el último estado leído.",
    vergangene: (w: string, n: number): readonly Teil[] => [`${w} anteriores (`, n, ")"],
    ergebnisseAlt:
      "No se pudieron cargar los resultados. Lo que se ve aquí es el último estado leído - vuelva a cargar la página más tarde, por favor.",
    zeitpunktFehlt: "Hora no registrada",
    rundeTipp: (w: string) => `Abre o cierra la tabla de resultados de este ${w}.`,
    ergebnisse: (n: number) =>
      mehrzahl(n, "es", { one: (z) => `${z} resultado`, other: (z) => `${z} resultados` }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Insegura" significa: la tecla salió al menos ${dran} veces y se acertó en menos del ${quote} % de los casos. Con tan pocas pulsaciones es una pista de lo que vale la pena practicar - no un diagnóstico.`,
    ],
    nochKeineRunde: (w: string): readonly Teil[] => [
      `Todavía no ha terminado ningún ${w} - después sus resultados aparecerán aquí.`,
    ],
  },
  // ★ O-IT (02.10.2026): „Sfida" ist weiblich („la Sfida", „dell'ultima Sfida");
  // „battute al minuto", „95%" ohne Leerzeichen (Glossar Regel 5/6); Lehrkraft neutral.
  it: {
    weiterIn: (stelle: string) => `Si continua: ${stelle}.`,
    esKommt: (stelle: string) => `Il prossimo: ${stelle}.`,
    herkunftWeiter: (w: string) =>
      `È il punto più lontano raggiunto nell'ultima ${w} di questo livello.`,
    herkunftWiederholt: (w: string) =>
      `Nessuno ha consegnato l'ultima ${w} di questo livello - si riparte dallo stesso punto.`,
    herkunftNeu: "La classe non ha ancora scritto questo testo.",
    nachsehen: "Ricerca del punto da cui continuare...",
    keine: "nessuna",
    undWeitere: (namen: string, rest: number) => `${namen} e altri ${rest}`,
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "nessun valore di confronto",
    zuKurz: "troppo breve per un punteggio",
    nochKeinErgebnis: "Ancora nessun risultato.",
    klassenschnitt: "Media della classe:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `${apm} battute al minuto, ${genau} di precisione - ${mit} su ${alle === 1 ? "1 persona" : `${alle} alunni`}.`,
    ],
    wertSchnitt: "Punteggio medio:",
    ausGewerteten: (n: number) =>
      mehrzahl(n, "it", {
        one: (z) => ` (su ${z} risultato con punteggio)`,
        other: (z) => ` (su ${z} risultati con punteggio)`,
      }),
    ohneWertungBleibt: " Senza punteggio, gli altri numeri della riga restano visibili.",
    rang: "Posto",
    name: "Nome",
    leistungswert: "Punteggio",
    vorlesen: "Lettura ad alta voce",
    anschlaege: "Battute al minuto",
    treffsicherheit: "Precisione",
    zeichen: "Caratteri",
    fehler: "Errori",
    korrekturen: "Correzioni",
    wacklig: "Tasti incerti",
    ohneWertung: "senza punteggio",
    vorgelesen: (zeit: string) => `sì, ${zeit} tolti`,
    nein: "no",
    zuschlag: "valutato con tempo in più: ",
    nichtAngetreten: "non ha partecipato",
    kindBereit: "Può iniziare.",
    alleBereit: (n: number) => `Tutti i ${n} alunni possono iniziare.`,
    belegt: "Un momento - la modifica precedente è ancora in salvataggio.",
    dauerFalsch: (von: number, bis: number) =>
      `Il tempo deve essere tra ${von} e ${bis} minuti. Non è stato salvato niente.`,
    dateiZuerst: "Prima caricare un proprio file. Non è stato salvato niente.",
    dateiNicht: "Non è stato possibile salvare il file. Riprovare, per favore.",
    texteNicht: "Non è stato possibile caricare i testi. Non è stato salvato niente - riprovare, per favore.",
    nichtGespeichert: "Non è stato salvato. Riprovare, per favore.",
    gestartetDatei: (min: number, datei: string) =>
      `Avviata: ${mehrzahl(min, "it", { one: (z) => `${z} minuto`, other: (z) => `${z} minuti` })}, "${datei}".`,
    gestartet: (min: number, stelle: string) =>
      `Avviata: ${mehrzahl(min, "it", { one: (z) => `${z} minuto`, other: (z) => `${z} minuti` })}, ${stelle}.`,
    absagenFrage: (w: string) =>
      `Annullare davvero la ${w}? Chi l'ha già consegnata conserva il proprio risultato.`,
    nichtsAbgesagt: "Non è stato annullato niente.",
    nichtAbgesagt: "Non è stata annullata. Riprovare, per favore.",
    abgesagt: (w: string) => `La ${w} è annullata. Se ne può avviare una nuova.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) =>
      `Tempo che resta fino alla fine del periodo per iniziare, alle ${uhr}.`,
    beginnenBis: (uhr: string) => `Iniziare entro le ${uhr}`,
    bisLetztes:
      "Tempo che resta finché finisce l'ultima persona - il periodo per iniziare è finito; chi ha già iniziato continua a scrivere.",
    einstiegZu: "Periodo per iniziare finito - chi ha già iniziato continua a scrivere",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "non è più in questa classe",
    laeuft: "in corso",
    laeuftMit: (teil: string) => `in corso · ${teil}`,
    bereitKurz: (a: number, b: number) => `Pronti: ${a} su ${b}`,
    abgegebenKurz: (a: number, b: number) => `Consegnate: ${a} su ${b}`,
    niveau: "Livello",
    tastaturniveau: "Tasti usati",
    art: "Tipo",
    artStreng: "Rigoroso - ogni tasto deve essere giusto",
    artFrei: "Scrittura libera - gli errori restano, Backspace è permesso",
    frei: "Scrittura libera",
    min: "Min",
    pruefungszeitName: "Tempo (minuti)",
    jetztStarten: "Avvia ora",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Pronti: ", a, " su", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Consegnate: ", a, " su", " ", b],
    absagenTipp: (w: string) =>
      `Ritira la ${w} in corso. Chi l'ha già consegnata conserva il proprio risultato.`,
    absagenKnopf: (w: string): readonly Teil[] => [`Annulla la ${w}`],
    wiederVonVorn:
      "Se il testo finisce prima del tempo, ricomincia semplicemente da capo - con un testo breve, a volte più volte.",
    gestartetDt: "Avviata",
    pruefungszeit: "Tempo",
    text: "Testo",
    jeKind: (minuten: number) =>
      minuten === 1
        ? " minuto per persona, dalla sua prima battuta"
        : " minuti per persona, dalla sua prima battuta",
    eigeneDatei: "file personale",
    texteNochDeutsch:
      `Per questo livello i testi integrati sono in tedesco (con ä, ö e ü). Per scrivere in italiano, scegliere "File personale" in Tasti usati.`,
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Ricerca di chi ha già consegnato...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Consegnate: ", a, " su ", b],
    alleAbgegeben: "Tutti gli alunni hanno consegnato.",
    nochNichtAbgegeben: (namen: string) => `Non ancora consegnata: ${namen}`,
    listeAlt:
      "Non è stato possibile ricaricare l'elenco - quello che si vede qui è l'ultimo stato letto.",
    vergangene: (w: string, n: number): readonly Teil[] => [`${w} precedenti (`, n, ")"],
    ergebnisseAlt:
      "Non è stato possibile caricare i risultati. Quello che si vede qui è l'ultimo stato letto - ricaricare la pagina più tardi, per favore.",
    zeitpunktFehlt: "Ora non registrata",
    rundeTipp: (w: string) => `Apre o chiude la tabella dei risultati di questa ${w}.`,
    ergebnisse: (n: number) =>
      mehrzahl(n, "it", { one: (z) => `${z} risultato`, other: (z) => `${z} risultati` }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Incerto" significa: il tasto è comparso almeno ${dran} volte ed è stato preso giusto in meno del ${quote}% dei casi. Con così poche battute è un indizio di cosa vale la pena esercitare - non una diagnosi.`,
    ],
    nochKeineRunde: (w: string): readonly Teil[] => [
      `Nessuna ${w} è ancora finita - dopo, qui compaiono i suoi risultati.`,
    ],
  },
  /*
    ★ O-PL (02.10.2026): POLNISCH - die Lehrkraft liest Knöpfe in der
    ty-Befehlsform („Zacznij teraz", „Odwołaj Wyzwanie"), Beschreibungen
    unpersönlich („Uruchomiono", „Nic nie zapisano"); Kinder als „osoba"/
    „uczniowie", nie „gotowy" über eine Person („Gotowość: 12 z 14"); Namen
    nur nach Doppelpunkt; „Wyzwanie" ausgeschrieben, wo ein anderer Fall als
    Nominativ/Akkusativ nötig ist; Zahl + Hauptwort mit vier Formen (Glossar
    §2.3, §2.10a). Uhrzeit aus Intl pl-PL („08:05").
  */
  pl: {
    weiterIn: (stelle: string) => `Dalej: ${stelle}.`,
    esKommt: (stelle: string) => `Następny: ${stelle}.`,
    herkunftWeiter: () =>
      "Tu skończyła najdalej pisząca osoba w ostatnim Wyzwaniu z tymi klawiszami.",
    herkunftWiederholt: () =>
      "W ostatnim Wyzwaniu z tymi klawiszami nie ma oddanych prac - zaczyna się w tym samym miejscu.",
    herkunftNeu: "Klasa jeszcze nie pisała tego tekstu.",
    nachsehen: "Sprawdzanie, od którego miejsca pisać dalej...",
    keine: "brak",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "pl", {
        one: (z) => `${namen} i jeszcze ${z} klawisz`,
        few: (z) => `${namen} i jeszcze ${z} klawisze`,
        many: (z) => `${namen} i jeszcze ${z} klawiszy`,
        other: (z) => `${namen} i jeszcze ${z} klawisza`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "brak wartości do porównania",
    zuKurz: "za krótkie, żeby obliczyć wynik",
    nochKeinErgebnis: "Nie ma jeszcze wyników.",
    klassenschnitt: "Średnia klasy:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `${mehrzahl(apm, "pl", {
        one: (z) => `${z} uderzenie`,
        few: (z) => `${z} uderzenia`,
        many: (z) => `${z} uderzeń`,
        other: (z) => `${z} uderzenia`,
      })} na minutę, ${genau} dokładności - na podstawie wyników osób: ${mit} z ${alle}.`,
    ],
    wertSchnitt: "Średni wynik:",
    ausGewerteten: (n: number) => ` (policzone wyniki: ${n})`,
    ohneWertungBleibt: " Bez wyniku pozostałe liczby w wierszu i tak zostają.",
    rang: "Miejsce",
    name: "Imię",
    leistungswert: "Wynik",
    vorlesen: "Czytanie na głos",
    anschlaege: "Uderzenia/min",
    treffsicherheit: "Dokładność",
    zeichen: "Znaki",
    fehler: "Błędy",
    korrekturen: "Poprawki",
    wacklig: "Niepewne klawisze",
    ohneWertung: "bez wyniku",
    vorgelesen: (zeit: string) => `tak, odjęto ${zeit}`,
    nein: "nie",
    zuschlag: "wynik z dodatkowym czasem: ",
    nichtAngetreten: "bez udziału",
    kindBereit: "Gotowość: 1 z 1.",
    alleBereit: (n: number) => `Gotowość: ${n} z ${n}.`,
    belegt: "Chwileczkę - poprzednia zmiana jest jeszcze zapisywana.",
    dauerFalsch: (von: number, bis: number) =>
      `Czas wyzwania musi wynosić od ${von} do ${mehrzahl(bis, "pl", {
        one: (z) => `${z} minuty`,
        few: (z) => `${z} minut`,
        many: (z) => `${z} minut`,
        other: (z) => `${z} minuty`,
      })}. Nic nie zapisano.`,
    dateiZuerst: "Najpierw prześlij własny plik. Nic nie zapisano.",
    dateiNicht: "Nie udało się zapisać pliku. Spróbuj ponownie.",
    texteNicht: "Nie udało się teraz wczytać tekstów. Nic nie zapisano - spróbuj ponownie.",
    nichtGespeichert: "Nie zapisano. Spróbuj ponownie.",
    gestartetDatei: (min: number, datei: string) =>
      `Uruchomiono: ${minutenPl(min)}, „${datei}”.`,
    gestartet: (min: number, stelle: string) => `Uruchomiono: ${minutenPl(min)}, ${stelle}.`,
    absagenFrage: (w: string) => `Na pewno odwołać ${w}? Oddane prace zachowują swoje wyniki.`,
    nichtsAbgesagt: "Niczego nie odwołano.",
    nichtAbgesagt: "Nie odwołano. Spróbuj ponownie.",
    abgesagt: (w: string) => `${w} jest odwołane. Możesz uruchomić nowe.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Pozostały czas na rozpoczęcie (do ${uhr}).`,
    beginnenBis: (uhr: string) => `Rozpoczęcie do ${uhr}`,
    bisLetztes:
      "Pozostały czas, aż skończy się czas pisania ostatniej osoby - na rozpoczęcie jest już za późno; osoby, które zaczęły, piszą dalej.",
    einstiegZu: "Czas na rozpoczęcie minął - osoby, które zaczęły, piszą dalej",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "już nie w tej klasie",
    laeuft: "trwa",
    laeuftMit: (teil: string) => `trwa · ${teil}`,
    bereitKurz: (a: number, b: number) => `Gotowość: ${a} z ${b}`,
    abgegebenKurz: (a: number, b: number) => `Oddane: ${a} z ${b}`,
    niveau: "Używane klawisze",
    tastaturniveau: "Używane klawisze",
    art: "Rodzaj",
    artStreng: "Ścisły - każdy klawisz musi się zgadzać",
    artFrei: "Swobodne pisanie - błędy zostają, Backspace dozwolony",
    frei: "Swobodne pisanie",
    min: "min",
    pruefungszeitName: "Czas wyzwania (minuty)",
    jetztStarten: "Zacznij teraz",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Gotowość: ", a, " z", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Oddane: ", a, " z", " ", b],
    absagenTipp: (w: string) => `Wycofuje trwające ${w}. Oddane prace zachowują swoje wyniki.`,
    absagenKnopf: (w: string): readonly Teil[] => [`Odwołaj ${w}`],
    wiederVonVorn:
      "Jeśli tekst skończy się przed końcem czasu, zaczyna się po prostu od początku - krótki tekst czasem kilka razy.",
    gestartetDt: "Uruchomiono",
    pruefungszeit: "Czas wyzwania",
    text: "Tekst",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "pl", {
        one: () => " minuta na osobę, od jej pierwszego naciśnięcia klawisza",
        few: () => " minuty na osobę, od jej pierwszego naciśnięcia klawisza",
        many: () => " minut na osobę, od jej pierwszego naciśnięcia klawisza",
        other: () => " minuty na osobę, od jej pierwszego naciśnięcia klawisza",
      }),
    eigeneDatei: "własny plik",
    texteNochDeutsch:
      "Wbudowane teksty dla tych klawiszy są na razie po niemiecku (z ä, ö i ü). Do pisania po polsku wybierz „Własny plik” w polu Używane klawisze.",
    zitat: (name: string) => `„${name}”`,
    werAbgegeben: "Sprawdzanie oddanych prac...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Oddane: ", a, " z ", b],
    alleAbgegeben: "Wszystkie prace są oddane.",
    nochNichtAbgegeben: (namen: string) => `Jeszcze nie oddane: ${namen}`,
    listeAlt:
      "Nie udało się teraz odświeżyć listy - widoczny jest ostatnio wczytany stan.",
    vergangene: (w: string, n: number): readonly Teil[] => [`Wcześniejsze ${w} (`, n, ")"],
    ergebnisseAlt:
      "Nie udało się teraz wczytać wyników. Widoczny jest ostatnio wczytany stan - odśwież stronę później.",
    zeitpunktFehlt: "Godzina nieznana",
    rundeTipp: () => "Rozwija lub zwija tabelę wyników tego Wyzwania.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} wynik`,
        few: (z) => `${z} wyniki`,
        many: (z) => `${z} wyników`,
        other: (z) => `${z} wyniku`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `„Niepewny” oznacza: klawisz pojawił się co najmniej ${mehrzahl(dran, "pl", {
        one: (z) => `${z} raz`,
        few: (z) => `${z} razy`,
        many: (z) => `${z} razy`,
        other: (z) => `${z} raza`,
      })} i był trafiany rzadziej niż w ${quote}% przypadków. Przy tak niewielu uderzeniach to wskazówka, gdzie warto poćwiczyć - nie diagnoza.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Nie zakończyło się jeszcze żadne Wyzwanie - potem pojawią się tu jego wyniki.",
    ],
  },
  /*
    ★ O-TR (02.10.2026): TÜRKISCH - die Lehrkraft liest "siz" mit -In
    ("yükleyin", "deneyin"), Knöpfe im Stamm ("Şimdi başlat", "Yarışmayı iptal
    et"); Kinder heissen "öğrenci"; "Hazır: 12 kişi, toplam 14" statt "12 / 14"
    (Glossar §1 Regel 6); KEINE Endung an `w`, Zahl, Uhrzeit oder Namen -
    wo der Satz eine Endung braucht, steht "yarışma" ausgeschrieben; nach der
    Zahl die Einzahl ("10 dakika"), "%95" (Glossar §2.3, §2.10). Uhrzeit aus
    Intl tr-TR ("08:05").
  */
  tr: {
    weiterIn: (stelle: string) => `Devam edilecek yer: ${stelle}.`,
    esKommt: (stelle: string) => `Sıradaki: ${stelle}.`,
    herkunftWeiter: () =>
      "Bu tuşlarla yapılan son yarışmada en ileri giden öğrencinin kaldığı yer.",
    herkunftWiederholt: () =>
      "Bu tuşlarla yapılan son yarışmayı kimse teslim etmedi - aynı yerden başlar.",
    herkunftNeu: "Sınıf bu metni henüz yazmadı.",
    nachsehen: "Nereden devam edileceğine bakılıyor...",
    keine: "yok",
    undWeitere: (namen: string, rest: number) => `${namen} ve ${rest} tuş daha`,
    prozent: (wert: string) => `%${wert}`,
    keinVergleich: "karşılaştırılacak değer yok",
    zuKurz: "puan için çok kısa",
    nochKeinErgebnis: "Henüz sonuç yok.",
    klassenschnitt: "Sınıf ortalaması:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `Dakikada ${apm} vuruş, doğruluk ${genau} - sonucu olan: ${mit} öğrenci, toplam ${alle}.`,
    ],
    wertSchnitt: "Ortalama yarışma puanı:",
    ausGewerteten: (n: number) => ` (puanlanan sonuç: ${n})`,
    ohneWertungBleibt: " Puan olmasa da satırdaki diğer sayılar yerinde kalır.",
    rang: "Sıra",
    name: "Ad",
    leistungswert: "Yarışma puanı",
    vorlesen: "Sesli okuma",
    anschlaege: "Vuruş/dk",
    treffsicherheit: "Doğruluk",
    zeichen: "Karakter",
    fehler: "Hata",
    korrekturen: "Düzeltme",
    wacklig: "Henüz oturmamış tuşlar",
    ohneWertung: "puan yok",
    vorgelesen: (zeit: string) => `evet, düşülen süre: ${zeit}`,
    nein: "hayır",
    zuschlag: "ek süreyle puanlandı: ",
    nichtAngetreten: "katılmadı",
    kindBereit: "Öğrenci hazır.",
    alleBereit: (n: number) => `Tüm öğrenciler hazır (${n} kişi).`,
    belegt: "Bir dakika - önceki değişiklik kaydedilmeye devam ediyor.",
    dauerFalsch: (von: number, bis: number) =>
      `Yarışma süresi ${von}-${bis} dakika arasında olmalı. Hiçbir şey kaydedilmedi.`,
    dateiZuerst: "Önce kendi dosyanızı yükleyin. Hiçbir şey kaydedilmedi.",
    dateiNicht: "Dosya kaydedilemedi. Lütfen tekrar deneyin.",
    texteNicht: "Metinler şu anda yüklenemedi. Hiçbir şey kaydedilmedi - lütfen tekrar deneyin.",
    nichtGespeichert: "Kaydedilmedi. Lütfen tekrar deneyin.",
    gestartetDatei: (min: number, datei: string) => `Başlatıldı: ${min} dakika, "${datei}".`,
    gestartet: (min: number, stelle: string) => `Başlatıldı: ${min} dakika, ${stelle}.`,
    absagenFrage: (w: string) =>
      `${w} gerçekten iptal edilsin mi? Teslim etmiş öğrencilerin sonuçları kalır.`,
    nichtsAbgesagt: "Hiçbir şey iptal edilmedi.",
    nichtAbgesagt: "İptal edilmedi. Lütfen tekrar deneyin.",
    abgesagt: (w: string) => `${w} iptal edildi. Yeni bir yarışma başlatabilirsiniz.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Başlama süresinin bitmesine kalan süre (bitiş: ${uhr}).`,
    beginnenBis: (uhr: string) => `Son başlama: ${uhr}`,
    bisLetztes:
      "Son öğrencinin yazma süresinin bitmesine kalan süre - başlama süresi doldu; başlamış olanlar yazmaya devam ediyor.",
    einstiegZu: "Başlama süresi doldu - başlamış olanlar yazmaya devam ediyor",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "artık bu sınıfta değil",
    laeuft: "sürüyor",
    laeuftMit: (teil: string) => `sürüyor · ${teil}`,
    bereitKurz: (a: number, b: number) => `Hazır: ${a} kişi, toplam ${b}`,
    abgegebenKurz: (a: number, b: number) => `Teslim eden: ${a} kişi, toplam ${b}`,
    niveau: "Kullanılan tuşlar",
    tastaturniveau: "Kullanılan tuşlar",
    art: "Tür",
    artStreng: "Sıkı - her tuş doğru olmalı",
    artFrei: "Serbest yazma - yanlışlar kalır, Backspace kullanılabilir",
    frei: "Serbest yazma",
    min: "dk",
    pruefungszeitName: "Yarışma süresi (dakika)",
    jetztStarten: "Şimdi başlat",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Hazır: ", a, " kişi, toplam", " ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Teslim eden: ", a, " kişi, toplam", " ", b],
    absagenTipp: () => "Süren yarışmayı geri alır. Teslim etmiş öğrencilerin sonuçları kalır.",
    absagenKnopf: (): readonly Teil[] => ["Yarışmayı iptal et"],
    wiederVonVorn:
      "Metin, yarışma süresi bitmeden biterse yeniden baştan başlar - kısa bir metin bazen birkaç kez.",
    gestartetDt: "Başlatıldı",
    pruefungszeit: "Yarışma süresi",
    text: "Metin",
    jeKind: () => " dakika, her öğrenci için ilk tuşa bastığı andan itibaren",
    eigeneDatei: "kendi dosyanız",
    texteNochDeutsch:
      `Bu tuşlar için hazır metinler şimdilik Almanca (ä, ö ve ü ile). Türkçe yazmak için "Kullanılan tuşlar" alanında "Kendi dosyan" seçeneğini seçin.`,
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Kimin teslim ettiğine bakılıyor...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Teslim eden: ", a, " kişi, toplam ", b],
    alleAbgegeben: "Tüm öğrenciler teslim etti.",
    nochNichtAbgegeben: (namen: string) => `Henüz teslim etmeyenler: ${namen}`,
    listeAlt: "Liste şu anda yenilenemedi - burada en son okunan durum görünüyor.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Önceki yarışmalar (", n, ")"],
    ergebnisseAlt:
      "Sonuçlar şu anda yüklenemedi. Burada en son okunan durum görünüyor - lütfen sayfayı daha sonra yeniden yükleyin.",
    zeitpunktFehlt: "Saat kaydedilmedi",
    rundeTipp: () => "Bu yarışmanın sonuç tablosunu açar veya kapatır.",
    ergebnisse: (n: number) => `${n} sonuç`,
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Henüz oturmamış" demek: tuş en az ${dran} kez geldi ve doğru basılma oranı %${quote} değerinin altında kaldı. Bu kadar az vuruşta bu, çalışmanın nerede işe yarayacağına dair bir ipucudur - tanı değildir.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Henüz biten bir yarışma yok - sonuçları, yarışma bitince burada görünür.",
    ],
  },
  /*
    ★ O-CS (03.10.2026): TSCHECHISCH - die Lehrkraft liest vy („nahrajte",
    „zkuste"), Knöpfe im Infinitiv („Spustit hned", „Zrušit Výzvu");
    Beschreibungen mit „se" oder als Hauptwort („Spuštěno", „Nic se
    neuložilo") - KEINE Vergangenheit über eine Person; Kinder als „dítě"/
    „děti"/„žáci"; „Připraveno: 12/14" (Doppelpunkt + Schrägstrich); Namen nur
    nach Doppelpunkt („Ještě neodevzdáno: Honza, Eva"); „Výzva" ausgeschrieben, wo ein
    anderer Fall als der Nominativ nötig ist; Zahl + Hauptwort mit vier Formen;
    kein Satz endet mit einer Zahl vor dem Punkt (Glossar §2.3, §2.11, §4
    Falle 4). Uhrzeit aus Intl cs-CZ („8:05").
  */
  cs: {
    weiterIn: (stelle: string) => `Pokračování: ${stelle}`,
    esKommt: (stelle: string) => `Na řadě: ${stelle}`,
    herkunftWeiter: () =>
      "Místo, kam se ve třídě v poslední Výzvě s těmito klávesami došlo nejdál.",
    herkunftWiederholt: () =>
      "U poslední Výzvy s těmito klávesami nejsou žádné odevzdané práce - začne na stejném místě.",
    herkunftNeu: "Tento text třída ještě nepsala.",
    nachsehen: "Zjišťuje se, kde se bude pokračovat...",
    keine: "žádné",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "cs", {
        one: (z) => `${namen} a ještě ${z} klávesa`,
        few: (z) => `${namen} a ještě ${z} klávesy`,
        many: (z) => `${namen} a ještě ${z} klávesy`,
        other: (z) => `${namen} a ještě ${z} kláves`,
      }),
    prozent: (wert: string) => `${wert} %`,
    keinVergleich: "není s čím porovnat",
    zuKurz: "na skóre moc krátké",
    nochKeinErgebnis: "Zatím tu nejsou žádné výsledky.",
    klassenschnitt: "Průměr třídy:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `úhozy za minutu: ${apm}, přesnost: ${genau} (výsledky: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Průměrné skóre:",
    ausGewerteten: (n: number) => ` (hodnocené výsledky: ${n})`,
    ohneWertungBleibt: " I bez skóre zůstávají ostatní čísla v řádku.",
    rang: "Pořadí",
    name: "Jméno",
    leistungswert: "Skóre",
    vorlesen: "Předčítání",
    anschlaege: "Úhozů/min",
    treffsicherheit: "Přesnost",
    zeichen: "Znaky",
    fehler: "Překlepy",
    korrekturen: "Opravy",
    wacklig: "Nejisté klávesy",
    ohneWertung: "bez skóre",
    vorgelesen: (zeit: string) => `ano, odečteno ${zeit}`,
    nein: "ne",
    zuschlag: "hodnoceno s prodlouženým časem: ",
    nichtAngetreten: "bez účasti",
    kindBereit: "Připraveno: 1/1",
    alleBereit: (n: number) => `Připraveno: ${n}/${n}`,
    belegt: "Okamžik - předchozí změna se ještě ukládá.",
    dauerFalsch: (von: number, bis: number) =>
      `Čas Výzvy musí být v rozmezí ${von}-${bis} min. Nic se neuložilo.`,
    dateiZuerst: "Nejdřív nahrajte vlastní soubor. Nic se neuložilo.",
    dateiNicht: "Soubor se nepodařilo uložit. Zkuste to prosím znovu.",
    texteNicht: "Texty se teď nepodařilo načíst. Nic se neuložilo - zkuste to prosím znovu.",
    nichtGespeichert: "Neuloženo. Zkuste to prosím znovu.",
    gestartetDatei: (min: number, datei: string) => `Spuštěno: ${min} min, „${datei}“.`,
    gestartet: (min: number, stelle: string) => `Spuštěno: ${min} min · ${stelle}`,
    absagenFrage: () => "Opravdu zrušit Výzvu? Výsledky odevzdaných prací zůstanou.",
    nichtsAbgesagt: "Nic se nezrušilo.",
    nichtAbgesagt: "Nezrušeno. Zkuste to prosím znovu.",
    abgesagt: (w: string) => `${w} je zrušená. Můžete spustit novou.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Zbývající čas na začátek (do ${uhr}).`,
    beginnenBis: (uhr: string) => `Začátek do ${uhr}`,
    bisLetztes:
      "Zbývající čas, než skončí psaní i posledního dítěte - na začátek už je pozdě; kdo už píše, píše dál.",
    einstiegZu: "Na začátek je pozdě - kdo už píše, píše dál",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "už není v této třídě",
    laeuft: "probíhá",
    laeuftMit: (teil: string) => `probíhá · ${teil}`,
    bereitKurz: (a: number, b: number) => `Připraveno: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Odevzdáno: ${a}/${b}`,
    niveau: "Použité klávesy",
    tastaturniveau: "Použité klávesy",
    art: "Způsob",
    artStreng: "Přísně - každá klávesa musí sedět",
    artFrei: "Volné psaní - chyby zůstávají, Backspace je povolený",
    frei: "Volné psaní",
    min: "min",
    pruefungszeitName: "Čas Výzvy (minuty)",
    jetztStarten: "Spustit hned",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Připraveno: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Odevzdáno: ", a, "/", b],
    absagenTipp: () => "Vezme probíhající Výzvu zpět. Výsledky odevzdaných prací zůstanou.",
    absagenKnopf: (): readonly Teil[] => ["Zrušit Výzvu"],
    wiederVonVorn:
      "Když text skončí dřív než čas Výzvy, začne prostě znovu od začátku - krátký text případně i několikrát.",
    gestartetDt: "Spuštěno",
    pruefungszeit: "Čas Výzvy",
    text: "Text",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "cs", {
        one: () => " minuta na každé dítě, od jeho prvního stisku klávesy",
        few: () => " minuty na každé dítě, od jeho prvního stisku klávesy",
        many: () => " minuty na každé dítě, od jeho prvního stisku klávesy",
        other: () => " minut na každé dítě, od jeho prvního stisku klávesy",
      }),
    eigeneDatei: "vlastní soubor",
    texteNochDeutsch:
      "Vestavěné texty pro tyto klávesy jsou zatím v němčině (s ä, ö a ü). Pro psaní v češtině vyberte v poli Použité klávesy možnost Vlastní soubor.",
    zitat: (name: string) => `„${name}“`,
    werAbgegeben: "Zjišťují se odevzdané práce...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Odevzdáno: ", a, "/", b],
    alleAbgegeben: "Všechny práce jsou odevzdané.",
    nochNichtAbgegeben: (namen: string) => `Ještě neodevzdáno: ${namen}`,
    listeAlt: "Seznam se teď nepodařilo obnovit - zobrazuje se naposledy načtený stav.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Předchozí Výzvy (", n, ")"],
    ergebnisseAlt:
      "Výsledky se teď nepodařilo načíst. Zobrazuje se naposledy načtený stav - načtěte prosím stránku později znovu.",
    zeitpunktFehlt: "Čas není zaznamenaný",
    rundeTipp: () => "Rozbalí nebo sbalí tabulku výsledků této Výzvy.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} výsledek`,
        few: (z) => `${z} výsledky`,
        many: (z) => `${z} výsledku`,
        other: (z) => `${z} výsledků`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `„Nejistá“ znamená: klávesa se objevila aspoň ${dran}krát a její přesnost byla nižší než ${quote} %. Při tak malém počtu úhozů je to tip, kde se vyplatí cvičit - ne diagnóza.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Zatím neskončila žádná Výzva - její výsledky se pak zobrazí tady.",
    ],
  },
  bg: {
    weiterIn: (stelle: string) => `Продължава: ${stelle}`,
    esKommt: (stelle: string) => `Предстои: ${stelle}`,
    herkunftWeiter: () =>
      "Мястото, до което се стигна най-далеч в класа при последното Предизвикателство с тези клавиши.",
    herkunftWiederholt: () =>
      "При последното Предизвикателство с тези клавиши няма предадени работи - то започва от същото място.",
    herkunftNeu: "Класът още не е писал този текст.",
    nachsehen: "Проверява се откъде продължава...",
    keine: "няма",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "bg", {
        one: (z) => `${namen} и още ${z} клавиш`,
        other: (z) => `${namen} и още ${z} клавиша`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "няма с какво да се сравни",
    zuKurz: "твърде кратко за резултат",
    nochKeinErgebnis: "Все още няма резултати.",
    klassenschnitt: "Средно за класа:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `знака в минута: ${apm}, точност: ${genau} (резултати: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Среден резултат:",
    ausGewerteten: (n: number) => ` (оценени резултати: ${n})`,
    ohneWertungBleibt: " И без резултат останалите числа в реда остават.",
    rang: "Място",
    name: "Име",
    leistungswert: "Резултат",
    vorlesen: "Четене на глас",
    anschlaege: "Знаци/мин",
    treffsicherheit: "Точност",
    zeichen: "Знаци",
    fehler: "Грешки",
    korrekturen: "Поправки",
    wacklig: "Несигурни клавиши",
    ohneWertung: "без резултат",
    vorgelesen: (zeit: string) => `да, извадено ${zeit}`,
    nein: "не",
    zuschlag: "оценено с допълнително време: ",
    nichtAngetreten: "без участие",
    kindBereit: "Готови: 1/1",
    alleBereit: (n: number) => `Готови: ${n}/${n}`,
    belegt: "Момент - предишната промяна още се записва.",
    dauerFalsch: (von: number, bis: number) =>
      `Времето на предизвикателството трябва да е между ${von} и ${bis} мин. Нищо не е записано.`,
    dateiZuerst: "Първо качете собствен файл. Нищо не е записано.",
    dateiNicht: "Файлът не можа да се запише. Моля, опитайте отново.",
    texteNicht: "Текстовете не можаха да се заредят точно сега. Нищо не е записано - моля, опитайте отново.",
    nichtGespeichert: "Не е записано. Моля, опитайте отново.",
    gestartetDatei: (min: number, datei: string) => `Започнато: ${min} мин, „${datei}“.`,
    gestartet: (min: number, stelle: string) => `Започнато: ${min} мин · ${stelle}`,
    absagenFrage: () => "Наистина ли да се отмени Предизвикателството? Резултатите от предадените работи остават.",
    nichtsAbgesagt: "Нищо не е отменено.",
    nichtAbgesagt: "Не е отменено. Моля, опитайте отново.",
    abgesagt: (w: string) => `${w} е отменено. Можете да започнете ново.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Оставащо време за влизане (до ${uhr}).`,
    beginnenBis: (uhr: string) => `Начало до ${uhr}`,
    bisLetztes:
      "Оставащо време, докато изтече времето за писане и на последния ученик - времето за влизане свърши; който вече пише, продължава.",
    einstiegZu: "Времето за влизане свърши - който вече пише, продължава",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "вече не е в този клас",
    laeuft: "тече",
    laeuftMit: (teil: string) => `тече · ${teil}`,
    bereitKurz: (a: number, b: number) => `Готови: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Предали: ${a}/${b}`,
    niveau: "Използвани клавиши",
    tastaturniveau: "Използвани клавиши",
    art: "Начин",
    artStreng: "Строго - всеки клавиш трябва да е верен",
    artFrei: "Свободно писане - грешките остават, Backspace е разрешен",
    frei: "Свободно писане",
    min: "мин",
    pruefungszeitName: "Време на предизвикателството (минути)",
    jetztStarten: "Започни сега",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Готови: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Предали: ", a, "/", b],
    absagenTipp: () => "Връща назад текущото Предизвикателство. Резултатите от предадените работи остават.",
    absagenKnopf: (): readonly Teil[] => ["Отмени Предизвикателството"],
    wiederVonVorn:
      "Ако текстът свърши преди времето на предизвикателството, той просто започва отначало - кратък текст понякога и няколко пъти.",
    gestartetDt: "Започнато",
    pruefungszeit: "Време на предизвикателството",
    text: "Текст",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "bg", {
        one: () => " минута за всеки ученик, от първото натискане на клавиш",
        other: () => " минути за всеки ученик, от първото натискане на клавиш",
      }),
    eigeneDatei: "собствен файл",
    texteNochDeutsch:
      "Вградените текстове за тези клавиши засега са на немски (с ä, ö и ü). За писане на български изберете в полето Използвани клавиши възможността Собствен файл.",
    zitat: (name: string) => `„${name}“`,
    werAbgegeben: "Проверява се кой вече е предал...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Предали: ", a, "/", b],
    alleAbgegeben: "Всички работи са предадени.",
    nochNichtAbgegeben: (namen: string) => `Още не са предали: ${namen}`,
    listeAlt: "Списъкът не можа да се обнови точно сега - показва се последното заредено състояние.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Минали предизвикателства (", n, ")"],
    ergebnisseAlt:
      "Резултатите не можаха да се заредят точно сега. Показва се последното заредено състояние - моля, заредете страницата отново по-късно.",
    zeitpunktFehlt: "Часът не е записан",
    rundeTipp: () => "Отваря или затваря таблицата с резултатите от това Предизвикателство.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `${z} резултат`,
        other: (z) => `${z} резултата`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `„Несигурен“ означава: клавишът се е появил поне ${dran} пъти и точността при него е под ${quote}%. При толкова малко знаци това е подсказка къде си струва да се упражнява - не е диагноза.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Още не е приключило нито едно Предизвикателство - резултатите ще се появят тук след това.",
    ],
  },
  el: {
    weiterIn: (stelle: string) => `Συνέχεια: ${stelle}`,
    esKommt: (stelle: string) => `Σειρά έχει: ${stelle}`,
    herkunftWeiter: () =>
      "Το σημείο όπου έφτασε πιο μακριά το τμήμα στην τελευταία Πρόκληση με αυτά τα πλήκτρα.",
    herkunftWiederholt: () =>
      "Στην τελευταία Πρόκληση με αυτά τα πλήκτρα δεν υπάρχουν παραδόσεις - ξεκινά από το ίδιο σημείο.",
    herkunftNeu: "Αυτό το κείμενο το τμήμα δεν το έχει γράψει ακόμα.",
    nachsehen: "Γίνεται έλεγχος για το πού συνεχίζει...",
    keine: "κανένα",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "el", {
        one: (z) => `${namen} και ${z} ακόμα πλήκτρο`,
        other: (z) => `${namen} και ${z} ακόμα πλήκτρα`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "δεν υπάρχει τιμή σύγκρισης",
    zuKurz: "πολύ σύντομο για σκορ",
    nochKeinErgebnis: "Δεν υπάρχουν ακόμα αποτελέσματα.",
    klassenschnitt: "Μέσος όρος τμήματος:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `πατήματα ανά λεπτό: ${apm}, ακρίβεια: ${genau} (αποτελέσματα: ${mit} από ${alle}).`,
    ],
    wertSchnitt: "Μέσο σκορ:",
    ausGewerteten: (n: number) => ` (αποτελέσματα με σκορ: ${n})`,
    ohneWertungBleibt: " Και χωρίς σκορ, οι υπόλοιποι αριθμοί της γραμμής μένουν.",
    rang: "Θέση",
    name: "Όνομα",
    leistungswert: "Σκορ",
    vorlesen: "Εκφώνηση",
    anschlaege: "Πατήματα/λεπτό",
    treffsicherheit: "Ακρίβεια",
    zeichen: "Χαρακτήρες",
    fehler: "Λάθη",
    korrekturen: "Διορθώσεις",
    wacklig: "Αβέβαια πλήκτρα",
    ohneWertung: "χωρίς σκορ",
    vorgelesen: (zeit: string) => `ναι, αφαιρέθηκε χρόνος: ${zeit}`,
    nein: "όχι",
    zuschlag: "σκορ με επιπλέον χρόνο: ",
    nichtAngetreten: "χωρίς συμμετοχή",
    kindBereit: "Έτοιμα: 1 από 1",
    alleBereit: (n: number) => `Έτοιμα: ${n} από ${n}`,
    belegt: "Μια στιγμή - η προηγούμενη αλλαγή αποθηκεύεται ακόμα.",
    dauerFalsch: (von: number, bis: number) =>
      `Η διάρκεια της Πρόκλησης πρέπει να είναι από ${von} έως ${bis} λεπτά. Δεν αποθηκεύτηκε τίποτα.`,
    dateiZuerst: "Ανεβάστε πρώτα ένα δικό σας αρχείο. Δεν αποθηκεύτηκε τίποτα.",
    dateiNicht: "Δεν ήταν δυνατή η αποθήκευση του αρχείου. Δοκιμάστε ξανά.",
    texteNicht: "Δεν ήταν δυνατή η φόρτωση των κειμένων αυτή τη στιγμή. Δεν αποθηκεύτηκε τίποτα - δοκιμάστε ξανά.",
    nichtGespeichert: "Δεν αποθηκεύτηκε. Δοκιμάστε ξανά.",
    gestartetDatei: (min: number, datei: string) =>
      `Έναρξη: ${mehrzahl(min, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })}, «${datei}».`,
    gestartet: (min: number, stelle: string) =>
      `Έναρξη: ${mehrzahl(min, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` })} · ${stelle}`,
    absagenFrage: () =>
      "Θέλετε σίγουρα να ακυρώσετε την Πρόκληση; Όσα παιδιά έχουν ήδη παραδώσει κρατούν το αποτέλεσμά τους.",
    nichtsAbgesagt: "Δεν ακυρώθηκε τίποτα.",
    nichtAbgesagt: "Δεν ακυρώθηκε. Δοκιμάστε ξανά.",
    // Πρόκληση ist weiblich - das Wort steht darum fest im Satz (wie cs).
    abgesagt: (_w: string) => "Η Πρόκληση ακυρώθηκε. Μπορείτε να ξεκινήσετε νέα.",
    uhr: (zeit: string) => zeit,
    // Uhrzeit nach Doppelpunkt (Glossar Regel 13: „στη 1:00" / „στις 2:00").
    bisEinstieg: (uhr: string) => `Χρόνος που απομένει για την έναρξη (λήξη: ${uhr}).`,
    beginnenBis: (uhr: string) => `Έναρξη έως: ${uhr}`,
    bisLetztes:
      "Χρόνος που απομένει, ώσπου να τελειώσει η γραφή και του τελευταίου παιδιού - ο χρόνος εισόδου έκλεισε, τα παιδιά που έχουν ξεκινήσει γράφουν ακόμα.",
    einstiegZu: "Ο χρόνος εισόδου έκλεισε - τα παιδιά που έχουν ξεκινήσει γράφουν ακόμα",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "δεν είναι πια σε αυτό το τμήμα",
    laeuft: "σε εξέλιξη",
    laeuftMit: (teil: string) => `σε εξέλιξη · ${teil}`,
    bereitKurz: (a: number, b: number) => `Έτοιμα: ${a} από ${b}`,
    abgegebenKurz: (a: number, b: number) => `Παραδόσεις: ${a} από ${b}`,
    niveau: "Πλήκτρα που χρησιμοποιούνται",
    tastaturniveau: "Πλήκτρα που χρησιμοποιούνται",
    art: "Είδος",
    artStreng: "Αυστηρά - κάθε πλήκτρο πρέπει να είναι σωστό",
    artFrei: "Ελεύθερη γραφή - τα λάθη μένουν, επιτρέπεται το Backspace",
    frei: "Ελεύθερη γραφή",
    min: "λεπτά",
    pruefungszeitName: "Διάρκεια της Πρόκλησης (λεπτά)",
    jetztStarten: "Έναρξη τώρα",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Έτοιμα: ", a, " από ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Παραδόσεις: ", a, " από ", b],
    absagenTipp: () =>
      "Ακυρώνει την Πρόκληση που είναι σε εξέλιξη. Όσα παιδιά έχουν ήδη παραδώσει κρατούν το αποτέλεσμά τους.",
    absagenKnopf: (): readonly Teil[] => ["Ακύρωση Πρόκλησης"],
    wiederVonVorn:
      "Αν το κείμενο τελειώσει πριν από το τέλος της Πρόκλησης, ξεκινά απλώς ξανά από την αρχή - ένα σύντομο κείμενο ίσως και πολλές φορές.",
    gestartetDt: "Έναρξη",
    pruefungszeit: "Διάρκεια της Πρόκλησης",
    text: "Κείμενο",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "el", {
        one: () => " λεπτό για κάθε παιδί, από το πρώτο του πάτημα",
        other: () => " λεπτά για κάθε παιδί, από το πρώτο του πάτημα",
      }),
    eigeneDatei: "δικό σας αρχείο",
    texteNochDeutsch:
      "Τα ενσωματωμένα κείμενα για αυτά τα πλήκτρα είναι προς το παρόν στα Γερμανικά (με ä, ö και ü). Για γραφή στα Ελληνικά επιλέξτε στο πεδίο «Πλήκτρα που χρησιμοποιούνται» την επιλογή «Δικό σας αρχείο».",
    zitat: (name: string) => `«${name}»`,
    werAbgegeben: "Γίνεται έλεγχος για τις παραδόσεις...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Παραδόσεις: ", a, " από ", b],
    alleAbgegeben: "Όλα τα παιδιά έχουν παραδώσει.",
    nochNichtAbgegeben: (namen: string) => `Δεν έχουν παραδώσει ακόμα: ${namen}`,
    listeAlt:
      "Δεν ήταν δυνατή η ανανέωση της λίστας αυτή τη στιγμή - εμφανίζεται η κατάσταση που διαβάστηκε τελευταία.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Προηγούμενες Προκλήσεις (", n, ")"],
    ergebnisseAlt:
      "Δεν ήταν δυνατή η φόρτωση των αποτελεσμάτων αυτή τη στιγμή. Εμφανίζεται η κατάσταση που διαβάστηκε τελευταία - φορτώστε ξανά τη σελίδα αργότερα.",
    zeitpunktFehlt: "Η ώρα δεν καταγράφηκε",
    rundeTipp: () => "Ανοίγει ή κλείνει τον πίνακα αποτελεσμάτων αυτής της Πρόκλησης.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `${z} αποτέλεσμα`,
        other: (z) => `${z} αποτελέσματα`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `«Αβέβαιο» σημαίνει: το πλήκτρο εμφανίστηκε τουλάχιστον ${dran} φορές και η ακρίβειά του ήταν κάτω από ${quote}%. Με τόσο λίγα πατήματα είναι μια ένδειξη για το πού αξίζει η εξάσκηση - όχι διάγνωση.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Δεν έχει τελειώσει ακόμα καμία Πρόκληση - τα αποτελέσματά της θα εμφανιστούν μετά εδώ.",
    ],
  },
  hu: {
    weiterIn: (stelle: string) => `Folytatás: ${stelle}`,
    esKommt: (stelle: string) => `Következik: ${stelle}`,
    herkunftWeiter: () =>
      "Eddig jutott a legmesszebb valaki az osztályban az ezekkel a billentyűkkel írt legutóbbi Kihívásban.",
    herkunftWiederholt: () =>
      "Az ezekkel a billentyűkkel írt legutóbbi Kihívásból nincs beadott munka - ugyanott kezdődik.",
    herkunftNeu: "Ezt a szöveget az osztály még nem írta.",
    nachsehen: "A folytatás helyének keresése...",
    keine: "nincs",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "hu", {
        one: (z) => `${namen} és még ${z} billentyű`,
        other: (z) => `${namen} és még ${z} billentyű`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "nincs mivel összehasonlítani",
    zuKurz: "túl rövid a pontozáshoz",
    nochKeinErgebnis: "Még nincs eredmény.",
    klassenschnitt: "Osztályátlag:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `leütés/perc: ${apm}, pontosság: ${genau} (eredmények: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Átlagos pontszám:",
    ausGewerteten: (n: number) => ` (pontozott eredmények: ${n})`,
    ohneWertungBleibt: " Pontszám nélkül is megmaradnak a sor többi számai.",
    rang: "Helyezés",
    name: "Név",
    leistungswert: "Pontszám",
    vorlesen: "Felolvasás",
    anschlaege: "Leütés/perc",
    treffsicherheit: "Pontosság",
    zeichen: "Karakterek",
    fehler: "Hibák",
    korrekturen: "Javítások",
    wacklig: "Bizonytalan billentyűk",
    ohneWertung: "pontozás nélkül",
    vorgelesen: (zeit: string) => `igen, levonva: ${zeit}`,
    nein: "nem",
    zuschlag: "hosszabb idővel pontozva: ",
    nichtAngetreten: "nem vett részt",
    kindBereit: "Készen: 1/1",
    alleBereit: (n: number) => `Készen: ${n}/${n}`,
    belegt: "Egy pillanat - az előző módosítás mentése még folyamatban van.",
    dauerFalsch: (von: number, bis: number) =>
      `A Kihívás ideje ${von}-${bis} perc lehet. Nem történt mentés.`,
    dateiZuerst: "Előbb töltsön fel egy saját fájlt. Nem történt mentés.",
    dateiNicht: "A fájlt nem sikerült menteni. Próbálja újra.",
    texteNicht: "A szövegeket most nem sikerült betölteni. Nem történt mentés - próbálja újra.",
    nichtGespeichert: "Nincs mentve. Próbálja újra.",
    gestartetDatei: (min: number, datei: string) => `Elindítva: ${min} perc, „${datei}”.`,
    gestartet: (min: number, stelle: string) => `Elindítva: ${min} perc · ${stelle}`,
    absagenFrage: () => "Biztosan visszavonja a Kihívást? A beadott munkák eredményei megmaradnak.",
    nichtsAbgesagt: "Nem történt visszavonás.",
    nichtAbgesagt: "Nincs visszavonva. Próbálja újra.",
    abgesagt: (w: string) => `${w}: visszavonva. Új Kihívás indítható.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Hátralévő idő a kezdésig (${uhr}-ig).`,
    beginnenBis: (uhr: string) => `Kezdés eddig: ${uhr}`,
    bisLetztes:
      "Hátralévő idő, amíg az utolsó tanuló gépelési ideje is lejár - kezdeni már nem lehet; aki már gépel, folytatja.",
    einstiegZu: "Kezdeni már nem lehet - aki már gépel, folytatja",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "már nincs ebben az osztályban",
    laeuft: "folyamatban",
    laeuftMit: (teil: string) => `folyamatban · ${teil}`,
    bereitKurz: (a: number, b: number) => `Készen: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Beadva: ${a}/${b}`,
    niveau: "Használt billentyűk",
    tastaturniveau: "Használt billentyűk",
    art: "Típus",
    artStreng: "Szigorú - minden leütésnek helyesnek kell lennie",
    artFrei: "Szabad gépelés - a hibák megmaradnak, a Backspace billentyű engedélyezett",
    frei: "Szabad gépelés",
    min: "perc",
    pruefungszeitName: "A Kihívás ideje (perc)",
    jetztStarten: "Kezdés most",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Készen: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Beadva: ", a, "/", b],
    absagenTipp: () => "Visszavonja a folyamatban lévő Kihívást. A beadott munkák eredményei megmaradnak.",
    absagenKnopf: (): readonly Teil[] => ["Kihívás visszavonása"],
    wiederVonVorn:
      "Ha a szöveg a Kihívás ideje előtt véget ér, egyszerűen elölről kezdődik - rövid szövegnél akár többször is.",
    gestartetDt: "Elindítva",
    pruefungszeit: "A Kihívás ideje",
    text: "Szöveg",
    // Ungarisch: nach der Zahl Einzahl (Glossar Regel 13) - beide Formen gleich.
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "hu", {
        one: () => " perc tanulónként, az első leütésétől számítva",
        other: () => " perc tanulónként, az első leütésétől számítva",
      }),
    eigeneDatei: "saját fájl",
    texteNochDeutsch:
      "Az ezekhez a billentyűkhöz tartozó beépített szövegek egyelőre németül vannak (többek között ä és ß betűkkel). Magyar nyelvű gépeléshez válassza a Használt billentyűk mezőben a Saját fájl lehetőséget.",
    zitat: (name: string) => `„${name}”`,
    werAbgegeben: "A beadott munkák ellenőrzése...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Beadva: ", a, "/", b],
    alleAbgegeben: "Minden munka beadva.",
    nochNichtAbgegeben: (namen: string) => `Még nincs beadva: ${namen}`,
    listeAlt: "A listát most nem sikerült frissíteni - a legutóbb betöltött állapot látható.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Korábbi Kihívások (", n, ")"],
    ergebnisseAlt:
      "Az eredményeket most nem sikerült betölteni. A legutóbb betöltött állapot látható - később töltse be újra az oldalt.",
    zeitpunktFehlt: "Az időpont nincs rögzítve",
    rundeTipp: () => "Kinyitja vagy becsukja ennek a Kihívásnak az eredménytáblázatát.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} eredmény`,
        other: (z) => `${z} eredmény`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `„Bizonytalan” azt jelenti: a billentyű legalább ${dran} alkalommal szerepelt, és a pontossága ${quote}% alatt volt. Ilyen kevés leütésnél ez csak jelzés arra, hol érdemes gyakorolni - nem diagnózis.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Még nem ért véget Kihívás - az eredményei utána itt jelennek meg.",
    ],
  },
  nl: {
    weiterIn: (stelle: string) => `Verder vanaf: ${stelle}`,
    esKommt: (stelle: string) => `Aan de beurt: ${stelle}`,
    herkunftWeiter: () =>
      "Tot hier is de klas het verst gekomen in de laatste Uitdaging met deze toetsen.",
    herkunftWiederholt: () =>
      "Bij de laatste Uitdaging met deze toetsen is niets ingeleverd - ze begint op dezelfde plaats.",
    herkunftNeu: "Deze tekst heeft de klas nog niet getypt.",
    nachsehen: "Er wordt gekeken waar het verdergaat...",
    keine: "geen",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "nl", {
        one: (z) => `${namen} en nog ${z} toets`,
        other: (z) => `${namen} en nog ${z} toetsen`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "niets om mee te vergelijken",
    zuKurz: "te kort voor een score",
    nochKeinErgebnis: "Er zijn nog geen resultaten.",
    klassenschnitt: "Klasgemiddelde:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `${apm} aanslagen per minuut, nauwkeurigheid ${genau} - uit ${mit} van ${mehrzahl(alle, "nl", {
        one: (z) => `${z} leerling`,
        other: (z) => `${z} leerlingen`,
      })}.`,
    ],
    wertSchnitt: "Gemiddelde score:",
    ausGewerteten: (n: number) =>
      mehrzahl(n, "nl", {
        one: (z) => ` (uit ${z} resultaat met score)`,
        other: (z) => ` (uit ${z} resultaten met score)`,
      }),
    ohneWertungBleibt: " Ook zonder score blijven de andere getallen in de tabel staan.",
    rang: "Plaats",
    name: "Naam",
    leistungswert: "Score",
    vorlesen: "Voorlezen",
    anschlaege: "Aanslagen/min",
    treffsicherheit: "Nauwkeurigheid",
    zeichen: "Tekens",
    fehler: "Fouten",
    korrekturen: "Correcties",
    wacklig: "Onzekere toetsen",
    ohneWertung: "zonder score",
    vorgelesen: (zeit: string) => `ja, ${zeit} afgetrokken`,
    nein: "nee",
    zuschlag: "beoordeeld met extra tijd: ",
    nichtAngetreten: "heeft niet meegedaan",
    kindBereit: "De leerling is klaar.",
    alleBereit: (n: number) => `Alle ${n} leerlingen zijn klaar.`,
    belegt: "Een ogenblik - de vorige wijziging wordt nog opgeslagen.",
    dauerFalsch: (von: number, bis: number) =>
      `De duur van de Uitdaging moet tussen ${von} en ${bis} minuten liggen. Er is niets opgeslagen.`,
    dateiZuerst: "Upload eerst een eigen bestand. Er is niets opgeslagen.",
    dateiNicht: "Het bestand kon niet worden opgeslagen. Probeer het nog eens.",
    texteNicht: "De teksten konden nu niet worden geladen. Er is niets opgeslagen - probeer het nog eens.",
    nichtGespeichert: "Niet opgeslagen. Probeer het nog eens.",
    gestartetDatei: (min: number, datei: string) => `Gestart: ${min} min, "${datei}".`,
    gestartet: (min: number, stelle: string) => `Gestart: ${min} min, ${stelle}.`,
    absagenFrage: () => "De Uitdaging echt annuleren? Leerlingen die al hebben ingeleverd, houden hun resultaat.",
    nichtsAbgesagt: "Er is niets geannuleerd.",
    nichtAbgesagt: "Niet geannuleerd. Probeer het nog eens.",
    abgesagt: (w: string) => `De ${w} is geannuleerd. Je kunt een nieuwe starten.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Tijd om te beginnen: tot ${uhr}.`,
    beginnenBis: (uhr: string) => `Beginnen tot ${uhr}`,
    bisLetztes:
      "Resterende tijd tot ook de laatste leerling klaar is met typen - beginnen kan niet meer; wie al bezig is, typt nog.",
    einstiegZu: "Beginnen kan niet meer - wie al bezig is, typt nog",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "niet meer in deze klas",
    laeuft: "bezig",
    laeuftMit: (teil: string) => `bezig · ${teil}`,
    bereitKurz: (a: number, b: number) => `Klaar: ${a} van ${b}`,
    abgegebenKurz: (a: number, b: number) => `Ingeleverd: ${a} van ${b}`,
    niveau: "Gebruikte toetsen",
    tastaturniveau: "Gebruikte toetsen",
    art: "Soort",
    artStreng: "Streng - elke toets moet kloppen",
    artFrei: "Vrij typen - fouten blijven staan, Backspace mag",
    frei: "Vrij typen",
    min: "min",
    pruefungszeitName: "Duur van de Uitdaging (minuten)",
    jetztStarten: "Nu starten",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Klaar: ", a, " van ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Ingeleverd: ", a, " van ", b],
    absagenTipp: () => "Trekt de lopende Uitdaging terug. Wie al heeft ingeleverd, houdt het resultaat.",
    absagenKnopf: (): readonly Teil[] => ["Uitdaging annuleren"],
    wiederVonVorn:
      "Is de tekst op voordat de tijd om is, dan begint hij gewoon opnieuw - een korte tekst soms meerdere keren.",
    gestartetDt: "Gestart",
    pruefungszeit: "Duur van de Uitdaging",
    text: "Tekst",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "nl", {
        one: () => " minuut per leerling, vanaf de eerste aanslag",
        other: () => " minuten per leerling, vanaf de eerste aanslag",
      }),
    eigeneDatei: "eigen bestand",
    texteNochDeutsch:
      "De ingebouwde teksten voor deze toetsen zijn voorlopig in het Duits (met ä, ö en ü). Kies voor typen in het Nederlands bij Gebruikte toetsen de mogelijkheid Eigen bestand.",
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Er wordt gekeken wie al heeft ingeleverd...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Ingeleverd: ", a, " van ", b],
    alleAbgegeben: "Alle leerlingen hebben ingeleverd.",
    nochNichtAbgegeben: (namen: string) => `Nog niet ingeleverd: ${namen}`,
    listeAlt: "De lijst kon nu niet opnieuw worden geladen - je ziet de laatst opgehaalde gegevens.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Eerdere Uitdagingen (", n, ")"],
    ergebnisseAlt:
      "De resultaten konden nu niet worden geladen. Je ziet de laatst opgehaalde gegevens - laad de pagina later opnieuw.",
    zeitpunktFehlt: "Tijdstip niet vastgelegd",
    rundeTipp: () => "Opent of sluit de tabel met resultaten van deze Uitdaging.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "nl", { one: (z) => `${z} resultaat`, other: (z) => `${z} resultaten` }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Onzeker" betekent: de toets kwam minstens ${dran} keer aan de beurt en de nauwkeurigheid was lager dan ${quote}%. Bij zo weinig aanslagen is dat een aanwijzing waar oefenen loont - geen diagnose.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Er is nog geen Uitdaging afgelopen - de resultaten komen daarna hier te staan.",
    ],
  },
  pt: {
    weiterIn: (stelle: string) => `Continua: ${stelle}`,
    esKommt: (stelle: string) => `A seguir: ${stelle}`,
    herkunftWeiter: () =>
      "Este é o ponto mais avançado a que a turma chegou no último Desafio com estas teclas.",
    herkunftWiederholt: () =>
      "No último Desafio com estas teclas não houve entregas - começa no mesmo ponto.",
    herkunftNeu: "A turma ainda não escreveu este texto.",
    nachsehen: "A verificar onde continua...",
    keine: "nenhuma",
    undWeitere: (namen: string, rest: number) => `${namen} e mais ${rest}`,
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "sem valor de comparação",
    zuKurz: "demasiado curto para ter pontuação",
    nochKeinErgebnis: "Ainda não há resultados.",
    klassenschnitt: "Média da turma:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `toques por minuto: ${apm}, precisão: ${genau} (resultados: ${mit} de ${alle}).`,
    ],
    wertSchnitt: "Pontuação média:",
    ausGewerteten: (n: number) => ` (resultados com pontuação: ${n})`,
    ohneWertungBleibt: " Mesmo sem pontuação, os outros números da linha mantêm-se.",
    rang: "Lugar",
    name: "Nome",
    leistungswert: "Pontuação",
    vorlesen: "Leitura em voz alta",
    anschlaege: "Toques/min",
    treffsicherheit: "Precisão",
    zeichen: "Carateres",
    fehler: "Erros",
    korrekturen: "Correções",
    wacklig: "Teclas em consolidação",
    ohneWertung: "sem pontuação",
    vorgelesen: (zeit: string) => `sim, descontado: ${zeit}`,
    nein: "não",
    zuschlag: "pontuação com tempo extra: ",
    nichtAngetreten: "sem participação",
    kindBereit: "Prontos: 1 de 1",
    alleBereit: (n: number) => `Prontos: ${n} de ${n}`,
    belegt: "Um momento - a alteração anterior ainda está a ser guardada.",
    dauerFalsch: (von: number, bis: number) =>
      `A duração do Desafio tem de estar entre ${von} e ${bis} min. Nada foi guardado.`,
    dateiZuerst: "Carregue primeiro um ficheiro próprio. Nada foi guardado.",
    dateiNicht: "Não foi possível guardar o ficheiro. Tente outra vez.",
    texteNicht: "Não foi possível carregar os textos neste momento. Nada foi guardado - tente outra vez.",
    nichtGespeichert: "Não guardado. Tente outra vez.",
    gestartetDatei: (min: number, datei: string) => `Começou: ${min} min, "${datei}".`,
    gestartet: (min: number, stelle: string) => `Começou: ${min} min · ${stelle}`,
    absagenFrage: () => "Quer mesmo cancelar o Desafio? Os resultados já entregues mantêm-se.",
    nichtsAbgesagt: "Nada foi cancelado.",
    nichtAbgesagt: "Não cancelado. Tente outra vez.",
    abgesagt: (_w: string) => "O Desafio foi cancelado. Pode começar um novo.",
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Tempo restante para começar (até às ${uhr}).`,
    beginnenBis: (uhr: string) => `Começar até às ${uhr}`,
    bisLetztes:
      "Tempo restante até acabar o tempo de escrita da última pessoa - já não é possível começar; quem já começou continua a escrever.",
    einstiegZu: "Entrada fechada - quem já começou continua a escrever",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "já não está nesta turma",
    laeuft: "em curso",
    laeuftMit: (teil: string) => `em curso · ${teil}`,
    bereitKurz: (a: number, b: number) => `Prontos: ${a} de ${b}`,
    abgegebenKurz: (a: number, b: number) => `Entregues: ${a} de ${b}`,
    niveau: "Teclas usadas",
    tastaturniveau: "Teclas usadas",
    art: "Tipo",
    artStreng: "Rigoroso - cada tecla tem de estar certa",
    artFrei: "Escrita livre - os erros ficam, a tecla de retrocesso é permitida",
    frei: "Escrita livre",
    min: "min",
    pruefungszeitName: "Duração do Desafio (minutos)",
    jetztStarten: "Começar agora",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Prontos: ", a, " de ", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Entregues: ", a, " de ", b],
    absagenTipp: () => "Retira o Desafio em curso. Os resultados já entregues mantêm-se.",
    absagenKnopf: (): readonly Teil[] => ["Cancelar o Desafio"],
    wiederVonVorn:
      "Se o texto acabar antes do fim da duração do Desafio, recomeça simplesmente do início - um texto curto, possivelmente várias vezes.",
    gestartetDt: "Início",
    pruefungszeit: "Duração do Desafio",
    text: "Texto",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "pt", {
        one: () => " minuto por pessoa, a contar do primeiro toque",
        other: () => " minutos por pessoa, a contar do primeiro toque",
      }),
    eigeneDatei: "ficheiro próprio",
    texteNochDeutsch:
      "Os textos incluídos para estas teclas ainda estão em alemão (com ä, ö e ü). Para escrever em português, selecione a opção Ficheiro próprio no campo Teclas usadas.",
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "A verificar as entregas...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Entregues: ", a, " de ", b],
    alleAbgegeben: "Todas as entregas foram feitas.",
    nochNichtAbgegeben: (namen: string) => `Ainda sem entrega: ${namen}`,
    listeAlt: "Não foi possível atualizar a lista neste momento - é apresentado o último estado lido.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Desafios anteriores (", n, ")"],
    ergebnisseAlt:
      "Não foi possível carregar os resultados neste momento. É apresentado o último estado lido - volte a carregar a página mais tarde.",
    zeitpunktFehlt: "Hora não registada",
    rundeTipp: () => "Abre ou fecha a tabela de resultados deste Desafio.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} resultado`,
        other: (z) => `${z} resultados`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Em consolidação" significa: a tecla apareceu pelo menos ${dran} vezes e a precisão foi inferior a ${quote}%. Com tão poucos toques, é uma indicação de onde vale a pena praticar - não um diagnóstico.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Ainda nenhum Desafio terminou - os resultados aparecem aqui depois.",
    ],
  },
  br: {
    weiterIn: (stelle: string) => `Continua em: ${stelle}`,
    esKommt: (stelle: string) => `A seguir: ${stelle}`,
    herkunftWeiter: () =>
      "É o ponto mais avançado a que a turma chegou no último Desafio com estas teclas.",
    herkunftWiederholt: () =>
      "O último Desafio com estas teclas não teve nenhuma entrega - ele começa no mesmo ponto.",
    herkunftNeu: "A turma ainda não digitou este texto.",
    nachsehen: "Verificando onde continuar...",
    keine: "nenhuma",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "br", {
        one: (z) => `${namen} e mais ${z} tecla`,
        other: (z) => `${namen} e mais ${z} teclas`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "sem comparação",
    zuKurz: "curto demais para ter pontuação",
    nochKeinErgebnis: "Ainda não há resultados.",
    klassenschnitt: "Média da turma:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `toques por minuto: ${apm}, precisão: ${genau} (resultados: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Pontuação média:",
    ausGewerteten: (n: number) => ` (resultados com pontuação: ${n})`,
    ohneWertungBleibt: " Mesmo sem pontuação, os outros números da linha continuam aparecendo.",
    rang: "Posição",
    name: "Nome",
    leistungswert: "Pontuação",
    vorlesen: "Leitura em voz alta",
    anschlaege: "Toques/min",
    treffsicherheit: "Precisão",
    zeichen: "Caracteres",
    fehler: "Erros",
    korrekturen: "Correções",
    wacklig: "Teclas inseguras",
    ohneWertung: "sem pontuação",
    vorgelesen: (zeit: string) => `sim, tempo descontado: ${zeit}`,
    nein: "não",
    zuschlag: "pontuação com tempo extra: ",
    nichtAngetreten: "sem participação",
    kindBereit: "Já entraram: 1/1",
    alleBereit: (n: number) => `Já entraram: ${n}/${n}`,
    belegt: "Um momento - a alteração anterior ainda está sendo salva.",
    dauerFalsch: (von: number, bis: number) =>
      `A duração do desafio precisa ficar entre ${von} e ${bis} min. Nada foi salvo.`,
    dateiZuerst: "Primeiro carregue um arquivo próprio. Nada foi salvo.",
    dateiNicht: "Não foi possível salvar o arquivo. Tente de novo.",
    texteNicht: "Não foi possível carregar os textos agora. Nada foi salvo - tente de novo.",
    nichtGespeichert: "Não foi salvo. Tente de novo.",
    gestartetDatei: (min: number, datei: string) => `Começou: ${min} min, "${datei}".`,
    gestartet: (min: number, stelle: string) => `Começou: ${min} min · ${stelle}`,
    absagenFrage: () => "Cancelar mesmo o Desafio? Os resultados já entregues continuam salvos.",
    nichtsAbgesagt: "Nada foi cancelado.",
    nichtAbgesagt: "Não foi cancelado. Tente de novo.",
    abgesagt: (w: string) => `${w} cancelado. Você pode começar outro.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Tempo restante para começar (até às ${uhr}).`,
    beginnenBis: (uhr: string) => `Começar até às ${uhr}`,
    bisLetztes:
      "Tempo restante até acabar o tempo de digitação da última pessoa - a janela de entrada já fechou; quem já começou continua digitando.",
    einstiegZu: "Janela de entrada fechada - quem já começou continua digitando",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "não está mais nesta turma",
    laeuft: "em andamento",
    laeuftMit: (teil: string) => `em andamento · ${teil}`,
    bereitKurz: (a: number, b: number) => `Já entraram: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Entregues: ${a}/${b}`,
    niveau: "Teclas usadas",
    tastaturniveau: "Teclas usadas",
    art: "Tipo",
    artStreng: "Rigoroso - cada tecla precisa estar certa",
    artFrei: "Escrita livre - os erros ficam, Backspace permitido",
    frei: "Escrita livre",
    min: "min",
    pruefungszeitName: "Duração do desafio (minutos)",
    jetztStarten: "Começar agora",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Já entraram: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Entregues: ", a, "/", b],
    absagenTipp: () => "Retira o Desafio em andamento. Os resultados já entregues continuam salvos.",
    absagenKnopf: (): readonly Teil[] => ["Cancelar o Desafio"],
    wiederVonVorn:
      "Se o texto acabar antes do fim do desafio, ele simplesmente recomeça do início - um texto curto, talvez várias vezes.",
    gestartetDt: "Data de início",
    pruefungszeit: "Duração do desafio",
    text: "Texto",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "br", {
        one: () => " minuto por pessoa, a partir do primeiro toque de cada uma",
        other: () => " minutos por pessoa, a partir do primeiro toque de cada uma",
      }),
    eigeneDatei: "arquivo próprio",
    texteNochDeutsch:
      "Os textos prontos para estas teclas ainda estão em alemão (com ä, ö e ü). Para digitar em português, escolha Arquivo próprio no campo Teclas usadas.",
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Verificando as entregas...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Entregues: ", a, "/", b],
    alleAbgegeben: "Todas as pessoas já entregaram.",
    nochNichtAbgegeben: (namen: string) => `Ainda sem entrega: ${namen}`,
    listeAlt: "Não foi possível atualizar a lista agora - você está vendo o último estado carregado.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Desafios anteriores (", n, ")"],
    ergebnisseAlt:
      "Não foi possível carregar os resultados agora. Você está vendo o último estado carregado - atualize a página mais tarde.",
    zeitpunktFehlt: "Horário não registrado",
    rundeTipp: () => "Abre ou fecha a tabela de resultados deste Desafio.",
    ergebnisse: (n: number) =>
      n === 0
        ? "Nenhum resultado"
        : mehrzahl(n, "br", {
            one: (z) => `${z} resultado`,
            other: (z) => `${z} resultados`,
          }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `"Insegura" significa: a tecla apareceu pelo menos ${dran} vezes e a precisão ficou abaixo de ${quote}%. Com tão poucos toques, é uma dica de onde vale a pena praticar - não um diagnóstico.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Nenhum Desafio terminou ainda - os resultados vão aparecer aqui depois.",
    ],
  },
  ro: {
    weiterIn: (stelle: string) => `Continuare: ${stelle}`,
    esKommt: (stelle: string) => `Urmează: ${stelle}`,
    herkunftWeiter: () =>
      "Locul până la care s-a ajuns cel mai departe în clasă, la ultima Provocare cu aceste taste.",
    herkunftWiederholt: () =>
      "La ultima Provocare cu aceste taste nu există lucrări predate - începe din același loc.",
    herkunftNeu: "Clasa nu a scris încă acest text.",
    nachsehen: "Se verifică de unde se continuă...",
    keine: "niciuna",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "ro", {
        one: () => `${namen} și încă o tastă`,
        few: (z) => `${namen} și încă ${z} taste`,
        other: (z) => `${namen} și încă ${z} de taste`,
      }),
    prozent: (wert: string) => `${wert} %`,
    keinVergleich: "fără termen de comparație",
    zuKurz: "prea scurt pentru scor",
    nochKeinErgebnis: "Încă nu există rezultate.",
    klassenschnitt: "Media clasei:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `caractere pe minut: ${apm}, precizie: ${genau} (rezultate: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Scor mediu:",
    ausGewerteten: (n: number) => ` (rezultate cu scor: ${n})`,
    ohneWertungBleibt: " Și fără scor, celelalte cifre din rând rămân afișate.",
    rang: "Loc",
    name: "Nume",
    leistungswert: "Scor",
    vorlesen: "Citire cu voce tare",
    anschlaege: "Car./min",
    treffsicherheit: "Precizie",
    zeichen: "Caractere",
    fehler: "Greșeli",
    korrekturen: "Corecturi",
    wacklig: "Taste nesigure",
    ohneWertung: "fără scor",
    vorgelesen: (zeit: string) => `da, scăzut: ${zeit}`,
    nein: "nu",
    zuschlag: "evaluat cu timp suplimentar: ",
    nichtAngetreten: "fără participare",
    kindBereit: "Pregătit: 1/1",
    alleBereit: (n: number) => `Pregătit: ${n}/${n}`,
    belegt: "Un moment - modificarea anterioară încă se salvează.",
    dauerFalsch: (von: number, bis: number) =>
      `Durata Provocării trebuie să fie între ${von} și ${bis} min. Nu s-a salvat nimic.`,
    dateiZuerst: "Încărcați mai întâi un fișier propriu. Nu s-a salvat nimic.",
    dateiNicht: "Fișierul nu a putut fi salvat. Încercați din nou.",
    texteNicht: "Textele nu au putut fi încărcate acum. Nu s-a salvat nimic - încercați din nou.",
    nichtGespeichert: "Nu s-a salvat. Încercați din nou.",
    gestartetDatei: (min: number, datei: string) => `Început: ${min} min, „${datei}”.`,
    gestartet: (min: number, stelle: string) => `Început: ${min} min · ${stelle}`,
    absagenFrage: () => "Sigur anulați Provocarea? Rezultatele lucrărilor predate rămân.",
    nichtsAbgesagt: "Nu s-a anulat nimic.",
    nichtAbgesagt: "Nu s-a anulat. Încercați din nou.",
    abgesagt: (_w: string) => "Provocarea este anulată. Puteți începe una nouă.",
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Timp rămas pentru începere (până la ${uhr}).`,
    beginnenBis: (uhr: string) => `Începeți până la ${uhr}`,
    bisLetztes:
      "Timp rămas până se termină scrisul și pentru ultima persoană - pentru începere este prea târziu; cine a început, scrie mai departe.",
    einstiegZu: "Prea târziu pentru începere - cine a început, scrie mai departe",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "nu mai este în această clasă",
    laeuft: "în curs",
    laeuftMit: (teil: string) => `în curs · ${teil}`,
    bereitKurz: (a: number, b: number) => `Pregătit: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Predat: ${a}/${b}`,
    niveau: "Taste folosite",
    tastaturniveau: "Taste folosite",
    art: "Tip",
    artStreng: "Strict - fiecare tastă trebuie să fie corectă",
    artFrei: "Scriere liberă - greșelile rămân, tasta Backspace este permisă",
    frei: "Scriere liberă",
    min: "min",
    pruefungszeitName: "Durata Provocării (minute)",
    jetztStarten: "Începeți acum",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Pregătit: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Predat: ", a, "/", b],
    absagenTipp: () => "Retrage Provocarea în curs. Rezultatele lucrărilor predate rămân.",
    absagenKnopf: (): readonly Teil[] => ["Anulați Provocarea"],
    wiederVonVorn:
      "Dacă textul se termină înainte de sfârșitul Provocării, începe pur și simplu din nou de la început - un text scurt, eventual de mai multe ori.",
    gestartetDt: "Început",
    pruefungszeit: "Durata Provocării",
    text: "Text",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "ro", {
        one: () => " minut pentru fiecare persoană, de la prima apăsare de tastă",
        few: () => " minute pentru fiecare persoană, de la prima apăsare de tastă",
        other: () => " de minute pentru fiecare persoană, de la prima apăsare de tastă",
      }),
    eigeneDatei: "fișier propriu",
    texteNochDeutsch:
      "Textele integrate pentru aceste taste sunt deocamdată în germană (cu ä, ö și ü). Pentru a scrie în română, alegeți Fișier propriu în câmpul Taste folosite.",
    zitat: (name: string) => `„${name}”`,
    werAbgegeben: "Se verifică lucrările predate...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Predat: ", a, "/", b],
    alleAbgegeben: "Toate lucrările sunt predate.",
    nochNichtAbgegeben: (namen: string) => `Încă nepredat: ${namen}`,
    listeAlt: "Lista nu a putut fi reîmprospătată acum - se afișează ultima stare citită.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Provocări anterioare (", n, ")"],
    ergebnisseAlt:
      "Rezultatele nu au putut fi încărcate acum. Se afișează ultima stare citită - reîncărcați pagina mai târziu.",
    zeitpunktFehlt: "Momentul nu este înregistrat",
    rundeTipp: () => "Deschide sau închide tabelul cu rezultatele acestei Provocări.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} rezultat`,
        few: (z) => `${z} rezultate`,
        other: (z) => `${z} de rezultate`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `„Nesigură” înseamnă: tasta a apărut de mai multe ori (minimum: ${dran}), iar precizia ei a fost sub ${quote} %. La atât de puține apăsări, este un indiciu despre unde merită exersat - nu un diagnostic.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Încă nu s-a încheiat nicio Provocare - rezultatele vor apărea aici după aceea.",
    ],
  },
  sv: {
    weiterIn: (stelle: string) => `Fortsätter: ${stelle}`,
    esKommt: (stelle: string) => `Näst på tur: ${stelle}`,
    herkunftWeiter: () =>
      "Stället där klassen kom längst i den senaste Utmaningen med de här tangenterna.",
    herkunftWiederholt: () =>
      "I den senaste Utmaningen med de här tangenterna lämnade ingen in - den börjar på samma ställe.",
    herkunftNeu: "Klassen har inte skrivit den här texten än.",
    nachsehen: "Kontrollerar var det fortsätter...",
    keine: "inga",
    undWeitere: (namen: string, rest: number) => `${namen} och ${rest} till`,
    prozent: (wert: string) => `${wert} %`,
    keinVergleich: "inget att jämföra med",
    zuKurz: "för kort för poäng",
    nochKeinErgebnis: "Det finns inga resultat än.",
    klassenschnitt: "Klassens genomsnitt:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `anslag per minut: ${apm}, träffsäkerhet: ${genau} (resultat: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Genomsnittliga utmaningspoäng:",
    ausGewerteten: (n: number) => ` (resultat med poäng: ${n})`,
    ohneWertungBleibt: " Även utan poäng står de andra siffrorna i raden kvar.",
    rang: "Placering",
    name: "Namn",
    leistungswert: "Utmaningspoäng",
    vorlesen: "Uppläsning",
    anschlaege: "Anslag/min",
    treffsicherheit: "Träffsäkerhet",
    zeichen: "Tecken",
    fehler: "Felslag",
    korrekturen: "Rättelser",
    wacklig: "Osäkra tangenter",
    ohneWertung: "utan poäng",
    vorgelesen: (zeit: string) => `ja, ${zeit} avdraget`,
    nein: "nej",
    zuschlag: "bedömt med förlängd tid: ",
    nichtAngetreten: "deltog inte",
    kindBereit: "Redo: 1/1",
    alleBereit: (n: number) => `Redo: ${n}/${n}`,
    belegt: "Ett ögonblick - den förra ändringen sparas fortfarande.",
    dauerFalsch: (von: number, bis: number) =>
      `Tiden för Utmaningen måste vara ${von}-${bis} min. Inget sparades.`,
    dateiZuerst: "Ladda först upp en egen fil. Inget sparades.",
    dateiNicht: "Det gick inte att spara filen. Försök igen.",
    texteNicht: "Det gick inte att läsa in texterna just nu. Inget sparades - försök igen.",
    nichtGespeichert: "Inte sparat. Försök igen.",
    gestartetDatei: (min: number, datei: string) => `Började: ${min} min, "${datei}".`,
    gestartet: (min: number, stelle: string) => `Började: ${min} min · ${stelle}`,
    absagenFrage: () => "Vill du ställa in Utmaningen? Resultaten för det som redan är inlämnat finns kvar.",
    nichtsAbgesagt: "Inget ställdes in.",
    nichtAbgesagt: "Inte inställt. Försök igen.",
    abgesagt: (w: string) => `${w} är inställd. Du kan börja en ny.`,
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Tid kvar att gå med (till ${uhr}).`,
    beginnenBis: (uhr: string) => `Börja senast ${uhr}`,
    bisLetztes:
      "Tid kvar tills skrivtiden är slut även för den sista eleven - det går inte längre att gå med; den som har börjat skriver vidare.",
    einstiegZu: "Det går inte längre att gå med - den som har börjat skriver vidare",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "inte längre i den här klassen",
    laeuft: "pågår",
    laeuftMit: (teil: string) => `pågår · ${teil}`,
    bereitKurz: (a: number, b: number) => `Redo: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Inlämnat: ${a}/${b}`,
    niveau: "Tangenter som används",
    tastaturniveau: "Tangenter som används",
    art: "Typ",
    artStreng: "Strikt - varje tangent måste stämma",
    artFrei: "Fri skrivning - fel står kvar, Backsteg är tillåtet",
    frei: "Fri skrivning",
    min: "min",
    pruefungszeitName: "Tid för Utmaningen (minuter)",
    jetztStarten: "Börja nu",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Redo: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Inlämnat: ", a, "/", b],
    absagenTipp: () => "Tar tillbaka den pågående Utmaningen. Resultaten för det som redan är inlämnat finns kvar.",
    absagenKnopf: (): readonly Teil[] => ["Ställ in Utmaningen"],
    wiederVonVorn:
      "Om texten tar slut innan tiden är ute börjar den helt enkelt om från början - en kort text kanske flera gånger.",
    gestartetDt: "Började",
    pruefungszeit: "Tid för Utmaningen",
    text: "Text",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "sv", {
        one: () => " minut per elev, från elevens första anslag",
        other: () => " minuter per elev, från elevens första anslag",
      }),
    eigeneDatei: "egen fil",
    texteNochDeutsch:
      "De inbyggda texterna för de här tangenterna är än så länge på tyska (med ä, ö och ü). Om klassen ska skriva på svenska väljer du Egen fil under Tangenter som används.",
    zitat: (name: string) => `"${name}"`,
    werAbgegeben: "Kontrollerar vilka som har lämnat in...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Inlämnat: ", a, "/", b],
    alleAbgegeben: "Alla elever har lämnat in.",
    nochNichtAbgegeben: (namen: string) => `Inte inlämnat än: ${namen}`,
    listeAlt: "Det gick inte att uppdatera listan just nu - här visas det senast inlästa läget.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Tidigare Utmaningar (", n, ")"],
    ergebnisseAlt:
      "Det gick inte att läsa in resultaten just nu. Här visas det senast inlästa läget - ladda om sidan senare.",
    zeitpunktFehlt: "Tidpunkten är inte registrerad",
    rundeTipp: () => "Öppnar eller stänger resultattabellen för den här Utmaningen.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "sv", {
        one: (z) => `${z} resultat`,
        other: (z) => `${z} resultat`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `Osäker betyder: tangenten kom minst ${dran} gånger och träffsäkerheten var under ${quote} %. Med så få anslag är det ett tips om var övning lönar sig - ingen diagnos.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Ingen Utmaning har avslutats än - resultaten visas här efteråt.",
    ],
  },
  uk: {
    weiterIn: (stelle: string) => `Продовження: ${stelle}`,
    esKommt: (stelle: string) => `Далі: ${stelle}`,
    herkunftWeiter: () =>
      "Місце, куди клас дійшов найдалі в останньому Виклику з цими клавішами.",
    herkunftWiederholt: () =>
      "В останньому Виклику з цими клавішами ніхто нічого не здав - він почнеться з того самого місця.",
    herkunftNeu: "Цей текст клас ще не друкував.",
    nachsehen: "Перевіряється, звідки продовжувати...",
    keine: "немає",
    undWeitere: (namen: string, rest: number) =>
      mehrzahl(rest, "uk", {
        one: (z) => `${namen} і ще ${z} клавіша`,
        few: (z) => `${namen} і ще ${z} клавіші`,
        many: (z) => `${namen} і ще ${z} клавіш`,
        other: (z) => `${namen} і ще ${z} клавіші`,
      }),
    prozent: (wert: string) => `${wert}%`,
    keinVergleich: "немає з чим порівняти",
    zuKurz: "занадто коротко для балів",
    nochKeinErgebnis: "Результатів ще немає.",
    klassenschnitt: "Середній показник класу:",
    schnittSatz: (apm: number, genau: string, mit: number, alle: number): readonly Teil[] => [
      `знаків за хвилину: ${apm}, точність: ${genau} (результати: ${mit}/${alle}).`,
    ],
    wertSchnitt: "Середній бал:",
    ausGewerteten: (n: number) => ` (оцінені результати: ${n})`,
    ohneWertungBleibt: " Навіть без балів інші числа в рядку залишаються.",
    rang: "Місце",
    name: "Ім'я",
    leistungswert: "Бали",
    vorlesen: "Читання вголос",
    anschlaege: "Знаків/хв",
    treffsicherheit: "Точність",
    zeichen: "Знаки",
    fehler: "Помилки",
    korrekturen: "Виправлення",
    wacklig: "Непевні клавіші",
    ohneWertung: "без балів",
    vorgelesen: (zeit: string) => `так, віднято ${zeit}`,
    nein: "ні",
    zuschlag: "оцінено з додатковим часом: ",
    nichtAngetreten: "не брали участі",
    kindBereit: "Готові: 1/1",
    alleBereit: (n: number) => `Готові: ${n}/${n}`,
    belegt: "Хвилинку - попередня зміна ще зберігається.",
    dauerFalsch: (von: number, bis: number) =>
      `Тривалість Виклику має бути в межах ${von}-${bis} хв. Нічого не збережено.`,
    dateiZuerst: "Спочатку додайте власний файл. Нічого не збережено.",
    dateiNicht: "Не вдалося зберегти файл. Спробуйте ще раз.",
    texteNicht: "Зараз не вдалося завантажити тексти. Нічого не збережено - спробуйте ще раз.",
    nichtGespeichert: "Не збережено. Спробуйте ще раз.",
    gestartetDatei: (min: number, datei: string) => `Розпочато: ${min} хв, файл: ${datei}.`,
    gestartet: (min: number, stelle: string) => `Розпочато: ${min} хв - ${stelle}`,
    absagenFrage: () => "Справді скасувати Виклик? Результати тих, хто вже здав, залишаться.",
    nichtsAbgesagt: "Нічого не скасовано.",
    nichtAbgesagt: "Не скасовано. Спробуйте ще раз.",
    abgesagt: (_w: string) => "Виклик скасовано. Можете почати новий.",
    uhr: (zeit: string) => zeit,
    bisEinstieg: (uhr: string) => `Залишок часу на початок (до ${uhr}).`,
    beginnenBis: (uhr: string) => `Почати до ${uhr}`,
    bisLetztes:
      "Залишок часу, доки не завершиться друк останньої дитини - починати вже пізно; хто почав, друкує далі.",
    einstiegZu: "Починати вже пізно - хто почав, друкує далі",
    nochSatz: (satz: string): readonly Teil[] => [satz],
    nichtMehrInKlasse: "уже не в цьому класі",
    laeuft: "триває",
    laeuftMit: (teil: string) => `триває · ${teil}`,
    bereitKurz: (a: number, b: number) => `Готові: ${a}/${b}`,
    abgegebenKurz: (a: number, b: number) => `Здали: ${a}/${b}`,
    niveau: "Клавіші тексту",
    tastaturniveau: "Клавіші тексту",
    art: "Вид",
    artStreng: "Суворий - кожна клавіша має бути правильною",
    artFrei: "Вільне письмо - помилки залишаються, клавіша Backspace дозволена",
    frei: "Вільне письмо",
    min: "хв",
    pruefungszeitName: "Тривалість Виклику (хвилини)",
    jetztStarten: "Почати зараз",
    bereitTeile: (a: number, b: number): readonly Teil[] => ["Готові: ", a, "/", b],
    abgegebenTeile: (a: number, b: number): readonly Teil[] => ["Здали: ", a, "/", b],
    absagenTipp: () => "Скасовує поточний Виклик. Результати тих, хто вже здав, залишаться.",
    absagenKnopf: (): readonly Teil[] => ["Скасувати Виклик"],
    wiederVonVorn:
      "Якщо текст закінчиться раніше, ніж мине тривалість Виклику, він просто почнеться знову - короткий текст, можливо, кілька разів.",
    gestartetDt: "Розпочато",
    pruefungszeit: "Тривалість Виклику",
    text: "Текст",
    jeKind: (minuten: number) =>
      mehrzahl(minuten, "uk", {
        one: () => " хвилина для кожної дитини, від її першого натискання",
        few: () => " хвилини для кожної дитини, від її першого натискання",
        many: () => " хвилин для кожної дитини, від її першого натискання",
        other: () => " хвилини для кожної дитини, від її першого натискання",
      }),
    eigeneDatei: "власний файл",
    texteNochDeutsch:
      "Вбудовані тексти для цих клавіш поки що німецькою мовою (з ä, ö і ü). Щоб друкувати українською, виберіть у полі Клавіші тексту варіант Власний файл.",
    zitat: (name: string) => `«${name}»`,
    werAbgegeben: "Перевіряється, хто вже здав...",
    abgegebenKopf: (a: number, b: number): readonly Teil[] => ["Здали: ", a, "/", b],
    alleAbgegeben: "Усі діти здали.",
    nochNichtAbgegeben: (namen: string) => `Ще не здали: ${namen}`,
    listeAlt: "Зараз не вдалося оновити список - показано останні завантажені дані.",
    vergangene: (_w: string, n: number): readonly Teil[] => ["Попередні Виклики (", n, ")"],
    ergebnisseAlt:
      "Зараз не вдалося завантажити результати. Показано останні завантажені дані - будь ласка, оновіть сторінку пізніше.",
    zeitpunktFehlt: "Час не зафіксовано",
    rundeTipp: () => "Розгортає або згортає таблицю результатів цього Виклику.",
    ergebnisse: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} результат`,
        few: (z) => `${z} результати`,
        many: (z) => `${z} результатів`,
        other: (z) => `${z} результату`,
      }),
    wackligSatz: (dran: number, quote: number): readonly Teil[] => [
      `«Непевна» означає: спроб на цій клавіші щонайменше ${dran}, а точність нижча за ${quote}%. За такої малої кількості натискань це лише підказка, де варто потренуватися, а не діагноз.`,
    ],
    nochKeineRunde: (): readonly Teil[] => [
      "Жоден Виклик ще не завершився - його результати з'являться тут.",
    ],
  },
});

/** ★ O-PL (02.10.2026): „10 minut" nach Doppelpunkt - Nominativ, vier Formen. */
function minutenPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
}

function uhrzeit24(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * ★ E11a-5 (26.09.2026, Falle 30): die Uhrzeit im Zeitstand je Sprache -
 * vorher `sprache === "en" ? GEBIET.en : "de-AT"`, für „fr" also still die
 * österreichische Uhrzeit. Französisch „10 h 14" von Hand (`uhrzeitFr`).
 */
const UHRZEIT: Record<BedienSprache, (d: Date) => string> = {
  de: (d) => d.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" }),
  en: (d) => d.toLocaleTimeString(GEBIET.en, { hour: "2-digit", minute: "2-digit" }),
  fr: (d) => uhrzeitFr(d),
  // ★ ES-O (27.09.2026): „10:14" - 24 Stunden, in Spanien und Amerika gelesen.
  es: (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  // ★ O-IT (02.10.2026): „10:14" - 24 Stunden wie in Italien üblich.
  it: (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  // ★ O-PL (02.10.2026): „08:05" aus Intl pl-PL (Glossar §2.10).
  pl: (d) => d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }),
  // ★ O-TR (02.10.2026): "08:05" aus Intl tr-TR, ohne Endung (Glossar §2.10).
  tr: (d) => d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
  // ★ O-CS (03.10.2026): „8:05" aus Intl cs-CZ, Stunde ohne Null (Glossar §2.10).
  cs: (d) => d.toLocaleTimeString("cs-CZ", { hour: "numeric", minute: "2-digit" }),
  // ★ O2-SONST (30.10.2026): die neun - „08:05", 24 Stunden. Nicht aus Intl: el-GR hängt „π.μ." an, bg-BG „ч.".
  bg: uhrzeit24,
  el: uhrzeit24,
  hu: uhrzeit24,
  nl: uhrzeit24,
  pt: uhrzeit24,
  br: uhrzeit24,
  ro: uhrzeit24,
  sv: uhrzeit24,
  uk: uhrzeit24,
};

/**
 * So oft werden die Ergebnisse nachgeladen, SOLANGE eine Probe läuft (ms).
 *
 * Dieselben 45 Sekunden wie in `useSchreibprobe` - und aus demselben Grund:
 * Die Lehrkraft steht im selben Raum wie die Kinder, sie braucht keine
 * Sekundenaktualität. Häufiger zu fragen hiesse, dass jede offene Klassenseite
 * dauernd am Server hängt ([[feedback_seminarraum_ist_der_massstab]]).
 */
const NACHFRAGE_MS = 45_000;

/**
 * So oft wird „Bereit" nachgefragt, solange eine Challenge läuft (ms) - nur das
 * Netz unter der Realtime-Beobachtung. Eine Anfrage liest die ganze Klasse auf
 * einmal, und das nur, solange dieser Bereich offen ist.
 */
const BEREIT_NACHFRAGE_MS = 30_000;

/** So viele wacklige Tasten stehen höchstens in einer Tabellenzelle. */
const WACKLIG_IN_TABELLE = 6;

/**
 * Wo jedes Kind aufgehört hat - aus allen Ergebnissen der Klasse.
 *
 * ★ W2b (28.09.2026, Weg je Kind): NUR Ergebnisse aus der Bank des Weges
 * `weg`. In einer gemischten Klasse schreibt ein Kind auf einem anderen Weg
 * dasselbe Niveau aus SEINER Bank (`textWegFuerKind`); seine Endstelle ist eine
 * Stelle in einem anderen Text und würde die nächste Challenge der Klasse
 * sonst an eine falsche Zeile schieben. Ohne `weg` (jeder Aufrufer vor W2b)
 * alle, wie bisher.
 */
function alleEnden(proben: Record<string, Probenergebnis[]>, weg?: Lernweg) {
  return Object.values(proben)
    .flat()
    .filter((e) => weg === undefined || lernwegVon(e) === weg)
    .map(endeVon);
}

/** „Es geht weiter in Text 2, ab Zeile 58." oder „Es kommt Text 5 von 15." */
function startSatz(s: NaechsterStart, sprache: BedienSprache = "de"): string {
  const stelle = stelleBezeichnung(s.textNr, s.zeile, sprache);
  return s.zeile > 0 ? K[sprache].weiterIn(stelle) : K[sprache].esKommt(stelle);
}

/** Woher die Stelle kommt - damit die Lehrkraft sie nachvollziehen kann. */
function herkunftSatz(s: NaechsterStart, sprache: BedienSprache = "de"): string {
  switch (s.herkunft) {
    case "weiter":
      return K[sprache].herkunftWeiter(pruefungWort(sprache));
    case "wiederholt":
      return K[sprache].herkunftWiederholt(pruefungWort(sprache));
    default:
      return K[sprache].herkunftNeu;
  }
}

/** Eine Zeile der Ergebnistabelle - ein Kind, mit oder ohne Ergebnis. */
interface Zeile {
  id: string;
  name: string;
  ergebnis: Probenergebnis | null;
}

/** Die wackligen Tasten einer Probe als lesbare Aufzählung. */
function wackligText(e: Probenergebnis, sprache: BedienSprache = "de"): string {
  if (!e.wacklig.length) return K[sprache].keine;
  const namen = e.wacklig.slice(0, WACKLIG_IN_TABELLE).map((t) => tastenName(t.zeichen, sprache));
  const rest = e.wacklig.length - namen.length;
  return rest > 0 ? K[sprache].undWeitere(namen.join(" "), rest) : namen.join(" ");
}

/** Eine Zeile der Tabelle, um die Wertung und den Rang erweitert. */
interface RangZeile extends Zeile {
  /** null = kein Ergebnis, also auch keine Wertung. */
  wertung: Wertung | null;
  /**
   * Prozent vom besten Ergebnis DIESER Runde.
   *
   * ⚠️ `null` heisst ausdrücklich NICHT „letzter Platz", sondern „nicht
   * gewertet" - entweder weil zu wenig geschrieben wurde oder weil es gar
   * kein Ergebnis gibt.
   */
  rang: number | null;
}

/**
 * ★★★ DIE RANGLISTE (10.09.2026) - die Ordnung der Ergebnistabelle.
 *
 * Johannes: *„ein Prozentranking vom besten ausgehend, genauigkeit schlägt
 * zeit"*. Gerechnet wird das in `schreibprobeWertung.ts`; hier wird nur
 * geordnet. Drei Gruppen, in dieser Reihenfolge:
 *
 *  1. **gewertet** - nach Leistungswert, das beste Kind oben,
 *  2. **zu kurz für eine Wertung** - nach Namen,
 *  3. **nicht angetreten** - nach Namen.
 *
 * ⚠️⚠️ Der Unterschied zwischen 1 und 2 ist der ganze Punkt: „nicht gewertet"
 * ist KEIN schlechtes Ergebnis. Ein Kind mit 150 Zeichen hinter das schwächste
 * gewertete Kind zu reihen, hiesse ihm den letzten Platz zu geben - und die
 * Recherche sagt, warum das falsch wäre: Bei so wenigen Zeichen entscheidet
 * ein einziger Fehlgriff über einen Prozentpunkt Treffsicherheit, das ist
 * Rauschen (`RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md` §4.3).
 *
 * ⚠️ Innerhalb der Gruppen 2 und 3 wird nach NAMEN geordnet, nicht nach
 * irgendeiner Zahl. Jede andere Ordnung wäre eine heimliche zweite Rangliste -
 * eine, die niemand angekündigt hat und die niemand nachlesen kann
 * ([[feedback_nie_gegen_das_kind]]).
 */
function rangliste(zeilen: Zeile[]): RangZeile[] {
  const mitWertung = zeilen.map((z) => ({
    ...z,
    wertung: z.ergebnis ? wertungVon(z.ergebnis) : null,
  }));
  // Der Massstab ist das beste Ergebnis DIESER Runde - über die Runde hinaus
  // bedeutet ein Rangprozent nichts (§4.6 der Recherche).
  const bester = bestenWert(
    mitWertung.map((z) => z.wertung).filter((w): w is Wertung => w !== null),
  );
  const gruppe = (z: RangZeile): number => (z.wertung?.gewertet ? 0 : z.ergebnis ? 1 : 2);
  return mitWertung
    .map((z) => ({
      ...z,
      rang: z.wertung?.gewertet ? rangProzent(z.wertung.wert, bester) : null,
    }))
    .sort((a, b) => {
      const g = gruppe(a) - gruppe(b);
      if (g !== 0) return g;
      if (gruppe(a) === 0 && a.wertung && b.wertung && a.wertung.wert !== b.wertung.wert) {
        return b.wertung.wert - a.wertung.wert;
      }
      return a.name.localeCompare(b.name, "de");
    });
}

/**
 * Was in der Rang-Spalte steht.
 *
 * ⚠️ Der Rang hängt an der ZAHL, nie an einer Farbe: Es gibt sieben
 * Kontrastmodi, und wer die Seite auf einer Braillezeile liest, sieht gar
 * keine. Kein Podest, keine Medaille, kein „Platz 1" - eine Reihenfolge und
 * ein Prozentwert.
 */
function rangZelle(z: RangZeile, sprache: BedienSprache = "de") {
  const k = K[sprache];
  if (z.rang !== null) {
    return (
      <span className="font-semibold tabular-nums text-ink">
        {/* ★ E11a-5: Deutsch behält seine zwei Textknoten von vorher; Englisch
            und Französisch schreiben den Prozentwert ganz (Komma bzw. Punkt
            aus `eineStelle`, Leerzeichen vor „%" nur französisch). */}
        {sprache === "de" ? <>{eineStelle(z.rang)} %</> : k.prozent(eineStelle(z.rang, sprache))}
      </span>
    );
  }
  if (!z.ergebnis) return null;
  // Gewertet, aber es gibt keinen Massstab: Dann liegt der beste Wert der Runde
  // bei null, und ein Prozentsatz davon wäre eine Division durch nichts.
  if (z.wertung?.gewertet) return <span className="text-ink-muted">{k.keinVergleich}</span>;
  return <span className="text-ink-muted">{k.zuKurz}</span>;
}

/**
 * Die Ergebnisse einer Probe: Klassenschnitt und Tabelle.
 *
 * Ein eigenes Bauteil, weil die aktuelle Probe und jede frühere dieselbe
 * Tabelle brauchen - zwei Fassungen liefen unweigerlich auseinander.
 */
function ErgebnisTabelle({ beschriftung, zeilen }: { beschriftung: string; zeilen: Zeile[] }) {
  const { sprache } = useBedienSprache();
  const k = K[sprache];
  const H = hinweiseChallenge(sprache);
  /*
    ★ 23.09.2026 („Freies Schreiben"): eine Runde gehört zu GENAU EINEM Plan,
    also zu genau einem Modus - ob dieser hier „frei" war, steht darum schon
    in jedem einzelnen Ergebnis (`Probenergebnis.modus`). Ein Kind ohne
    Ergebnis ("nicht angetreten") sagt dazu nichts, darum reicht `.some()`.
  */
  const modusFrei = zeilen.some((z) => z.ergebnis?.modus === "frei");
  const geordnet = rangliste(zeilen);
  const mit = zeilen.filter((z) => z.ergebnis !== null);
  const schnittAnschlaege = mit.length
    ? Math.round(mit.reduce((s, z) => s + (z.ergebnis?.anschlaege ?? 0), 0) / mit.length)
    : 0;
  const schnittGenau = mit.length
    ? mit.reduce((s, z) => s + (z.ergebnis?.genauigkeit ?? 0), 0) / mit.length
    : 0;
  // Der Leistungswert im Schnitt - nur aus GEWERTETEN Ergebnissen, wie in der
  // Spalte „3 / 82" der Klassenstatistik (`schreibprobenUebersicht.ts`).
  const gewertete = geordnet.filter((z) => z.wertung?.gewertet);
  const schnittWert = gewertete.length
    ? gewertete.reduce((s, z) => s + (z.wertung?.wert ?? 0), 0) / gewertete.length
    : null;

  // Ist die Tabelle breiter als ihr Platz? Nur dann Rollkasten (siehe unten).
  // Gemessen wird bei jeder Grössenänderung der Hülle - ein gedrehtes iPad
  // oder ein schmaleres Fenster sollen es sofort richtig machen.
  const huelle = useRef<HTMLDivElement | null>(null);
  const [zuBreit, setZuBreit] = useState(false);
  useEffect(() => {
    const el = huelle.current;
    if (!el) return;
    const miss = () => {
      const tabelle = el.firstElementChild as HTMLElement | null;
      setZuBreit(!!tabelle && tabelle.offsetWidth > el.clientWidth + 1);
    };
    miss();
    if (typeof ResizeObserver === "undefined") return;
    const beobachter = new ResizeObserver(miss);
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [zeilen]);

  return (
    <div className="space-y-2">
      <p className="m-0 text-sm text-ink">
        {mit.length === 0 ? (
          <>{k.nochKeinErgebnis}</>
        ) : (
          <>
            <span className="font-semibold">{k.klassenschnitt}</span>{" "}
            {k.schnittSatz(schnittAnschlaege, fmtPercent(schnittGenau, sprache), mit.length, zeilen.length)}
            {schnittWert !== null && (
              <>
                {" "}
                <span className="font-semibold">{k.wertSchnitt}</span>{" "}
                {eineStelle(schnittWert, sprache)}
                {gewertete.length < mit.length ? k.ausGewerteten(gewertete.length) : ""}
                .
              </>
            )}
          </>
        )}
      </p>

      {/*
        ★★★ Rollkasten NUR, wenn die Tabelle wirklich zu breit ist (10.09.2026,
        Johannes: „in der Tabelle der vergangenen Challenges fehlt die mouseover
        erklärung"). Die Hinweise waren da - aber ein `overflow-x-auto` macht
        den Kasten auch SENKRECHT zum Rollkasten und schnitt sie ab: nach unten
        fehlt bei wenigen Zeilen der Platz, nach oben liegt die Kante des
        Kastens. Neun Spalten passen auf einem Klassen-iPad trotzdem nicht
        immer nebeneinander, und die Seite selbst darf nicht wandern - darum
        wird gemessen statt verzichtet. `SchreibprobenTabelle` kommt mit sechs
        Spalten ganz ohne Rollkasten aus.
      */}
      <div ref={huelle} className={zuBreit ? "overflow-x-auto" : undefined}>
        <table className="w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">{beschriftung}</caption>
          <thead>
            {/* ★ Alle Spalten mittig, Kopf und Zellen (Johannes 10.09.2026:
                nicht gemischt links und rechts). */}
            <tr className="bg-surface-raised text-center text-ink-muted">
              {/* ★ Seit 10.09.2026 trägt jeder erklärte Kopf seinen Hinweis
                  (Johannes: „vergiss nicht die mousover infos bei allen
                  bereichen"). Die Sätze stehen in `schreibprobeHinweise.ts`. */}
              <Spaltenkopf className="px-2 py-2" hilfe={H.rang}>
                {k.rang}
              </Spaltenkopf>
              <th scope="col" className="px-2 py-2">
                {k.name}
              </th>
              {/* ★ Der Leistungswert, den das Kind auf seiner Karte liest
                  (Johannes 10.09.2026: „bei den Ergebnissen möchte ich auch
                  diesen allgemeinen Score-Wert sehen"). Der Rang allein sagt
                  nur, wie weit vom Besten - nicht die Zahl selbst.
                  ★ E12 (19.09.2026): der Absatz unter der Tabelle, der die
                  Wertung noch einmal in eigenen Worten erklärte, stand als
                  eigener Absatz fest da - dieselbe Sache stand hier schon,
                  nur ohne den einen Zusatz, dass ein Ergebnis OHNE Wertung
                  nicht spurlos verschwindet. Der ist jetzt hier mit dabei,
                  der Absatz ist weg. */}
              <Spaltenkopf className="px-2 py-2" hilfe={`${H.leistungswert}${k.ohneWertungBleibt}`}>
                {k.leistungswert}
              </Spaltenkopf>
              {/* ★ Wem die App vorgelesen hat (10.09.2026, Johannes: „das muss
                  auch beim Ergebnis mitgeliefert werden"). */}
              <Spaltenkopf className="px-2 py-2" hilfe={H.vorlesen}>
                {k.vorlesen}
              </Spaltenkopf>
              <Spaltenkopf className="px-2 py-2" hilfe={H.anschlaege}>
                {k.anschlaege}
              </Spaltenkopf>
              <Spaltenkopf className="px-2 py-2" hilfe={H.treffsicherheit}>
                {k.treffsicherheit}
              </Spaltenkopf>
              <Spaltenkopf className="px-2 py-2" hilfe={H.zeichen}>
                {k.zeichen}
              </Spaltenkopf>
              {/* ★ 23.09.2026 („Freies Schreiben"): derselbe Kopf „Fehler" wie
                  immer - nur der Hinweis nennt je Modus etwas anderes (streng:
                  jeder Fehlgriff; frei: was am Ende stehengeblieben ist). */}
              <Spaltenkopf className="px-2 py-2" hilfe={modusFrei ? H.fehlerFrei : H.fehler} ausrichtung="rechts">
                {k.fehler}
              </Spaltenkopf>
              {/* ★ 23.09.2026: nur bei freiem Plan - die Rücktaste gibt es im
                  strengen Modus gar nicht. */}
              {modusFrei && (
                <Spaltenkopf className="px-2 py-2" hilfe={H.korrekturen} ausrichtung="rechts">
                  {k.korrekturen}
                </Spaltenkopf>
              )}
              <Spaltenkopf className="px-2 py-2" hilfe={H.wacklig} ausrichtung="rechts">
                {k.wacklig}
              </Spaltenkopf>
            </tr>
          </thead>
          <tbody className="text-center [&_td]:border-t [&_td]:border-hairline/60 [&_td]:px-2 [&_td]:py-2 [&_th]:border-t [&_th]:border-hairline/60 [&_th]:px-2 [&_th]:py-2">
            {geordnet.map((z) => (
              <tr key={z.id}>
                <td>{rangZelle(z, sprache)}</td>
                <th scope="row" className="font-normal text-ink">
                  {z.name}
                </th>
                {z.ergebnis ? (
                  <>
                    <td className="font-semibold tabular-nums text-ink">
                      {z.wertung?.gewertet ? (
                        eineStelle(z.wertung.wert, sprache)
                      ) : (
                        <span className="font-normal text-ink-muted">{k.ohneWertung}</span>
                      )}
                    </td>
                    <td className="text-ink">
                      {z.ergebnis.wartezeitMs > 0 ? k.vorgelesen(mmss(z.ergebnis.wartezeitMs)) : k.nein}
                    </td>
                    <td className="text-ink">
                      {z.ergebnis.anschlaege}
                      {/*
                        ⚠️ Wo der Zeitzuschlag gewirkt hat, steht die GEWERTETE
                        Zahl daneben. Ohne sie stünde ein Kind weiter oben, als
                        seine Anschlagszahl erklärt - und niemand könnte
                        nachrechnen, warum. Der Zuschlag wirkt auf die RATE,
                        nicht auf die Uhr: mehr Zeit hiesse mehr Zeichen in mehr
                        Zeit, die Anschläge je Minute blieben gleich
                        (`schreibprobeWertung.ts`).
                      */}
                      {z.wertung && z.wertung.anschlaegeGewertet !== z.ergebnis.anschlaege && (
                        <span className="ml-1 block text-sm font-normal text-ink-muted">
                          {k.zuschlag}
                          {z.wertung.anschlaegeGewertet}
                        </span>
                      )}
                    </td>
                    <td className="text-ink">
                      {fmtPercent(z.ergebnis.genauigkeit, sprache)}
                    </td>
                    <td className="text-ink">{z.ergebnis.zeichen}</td>
                    <td className="text-ink">{z.ergebnis.fehler}</td>
                    {modusFrei && <td className="text-ink">{z.ergebnis.korrekturen ?? 0}</td>}
                    <td className="text-ink">{wackligText(z.ergebnis, sprache)}</td>
                  </>
                ) : (
                  /* ★ „nicht angetreten" ist eine Tatsache und bleibt eine.
                     Warum jemand nicht angetreten ist, weiss nur, wer die
                     Klasse unterrichtet ([[feedback_nie_gegen_das_kind]]). */
                  <td colSpan={modusFrei ? 8 : 7} className="text-ink-muted">
                    {k.nichtAngetreten}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/**
 * Eine frühere Probe zum Aufklappen.
 *
 * ⚠️ Bewusst KEIN `<details>`: Der Kasten steht in einem `role="tabpanel"`, und
 * die Kopfzeile trägt Titel und Zähler. Ein `<summary>` mit mehreren Teilen
 * lesen Sprachausgaben uneinheitlich vor; ein Knopf mit `aria-expanded` sagt
 * beides sauber an.
 *
 * ★ R6/R7 (11.09.2026, `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`): OHNE
 * eigenen Rahmen. Bis dahin war jede Runde ein gerahmter Kasten im gerahmten
 * Abschnitt in der Karte - drei Ebenen Kasten in Kasten. Jetzt trennt eine
 * Haarlinie (`divide-y` an der Liste), und der Kopf ist eine Aufklapp-Zeile wie
 * jede andere der Seite: Pfeil, fetter Titel, grauer Stand.
 * ⚠️ KEINE feste Höhe, und kein `.btn`: Datum und Stand brechen bei schmalem
 * Fenster lieber um, als in einem 36 px hohen Schalter abgeschnitten zu werden.
 *
 * ★★★ L3 (19.09.2026) - GROSS UND IMMER ZU. Johannes: *„wenn man auf den
 * Schalter Tippchallenge geht, sollen die vergangenen eingeklappt bleiben, und
 * der Schalter zum Ausklappen ist zu klein, du hast bei deinem Entwurf gestern
 * so tolle Schalter gemacht, jetzt aber nirgends eingebaut"*.
 *  · Jede Runde beginnt ZUGEKLAPPT - auch die eben beendete (bis dahin stand
 *    sie offen da). Wer den Bereich öffnet, will starten; die Tabelle einer
 *    Runde holt man sich mit einem Druck.
 *  · Die GANZE Zeile ist der Schalter (wie `.kasten-details > summary` im
 *    Entwurf `ENTWURF-2026-09-18-MEINE-KLASSEN-UMBAU.html`), mindestens 44 px
 *    hoch, das Datum fett in Fliesstextgrösse, vorn der runde Pfeil-Knopf der
 *    Klassentabelle (`EinstellungenKnopf` in `TastenflowReiter.tsx`: 36 px,
 *    Haarlinie, der Pfeil dreht sich beim Aufklappen). Der Kreis ist nur
 *    Zeichen (`aria-hidden`) - bedient wird die ganze Zeile, Eingabe- und
 *    Leertaste klappen, der Fokus bleibt auf ihr, die Sprachausgabe hört
 *    „zugeklappt"/„aufgeklappt" über `aria-expanded`, und der Hinweis
 *    (`Tipp`, bei Zeiger UND Fokus) sagt, was die Zeile tut.
 */
function FruehereProbe({
  titel,
  untertitel,
  zeilen,
}: {
  titel: string;
  untertitel: string;
  zeilen: Zeile[];
}) {
  const [offen, setOffen] = useState(false);
  const panelId = useId();
  const { sprache } = useBedienSprache();
  return (
    <li>
      <Tipp text={K[sprache].rundeTipp(pruefungWort(sprache))} ausrichtung="links" className="w-full">
        {(hinweisId) => (
          <button
            type="button"
            className="group flex min-h-11 w-full items-center gap-3 py-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            aria-expanded={offen}
            aria-controls={panelId}
            aria-describedby={hinweisId}
            onClick={() => setOffen((o) => !o)}
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-raised text-ink transition-colors group-hover:bg-surface-sunken"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
                className={"transition-transform duration-150" + (offen ? " rotate-90" : "")}
              >
                <polyline points="9 5 16 12 9 19" />
              </svg>
            </span>
            <span>
              <span className="text-base font-semibold text-ink">{titel}</span>{" "}
              <span className="text-sm text-ink-muted">{untertitel}</span>
            </span>
          </button>
        )}
      </Tipp>
      {/* ★ 19.09.2026: Die Runde klappt SICHTBAR auf und zu (Johannes: „der
          Rest rutscht nach unten und der andere kommt nach"). Die Tabelle
          bleibt wie bisher zugeklappt im Baum (`bleibt`), `hidden` greift
          erst nach dem Schrumpfen; die `id` für `aria-controls` bleibt hier. */}
      <Aufklappen offen={offen} bleibt>
        {(verborgen) => (
          <div id={panelId} hidden={verborgen} className="pb-3 pt-1">
            <ErgebnisTabelle beschriftung={`${titel} - ${untertitel}`} zeilen={zeilen} />
          </div>
        )}
      </Aufklappen>
    </li>
  );
}

export function SchreibprobeKasten({
  cls,
  pupils,
  onClassChange,
  eingebettet = false,
  onStatus,
  onFokusSchalter,
}: {
  cls: TypingClass;
  /** Die Kinder dieser Klasse, schon geladen. */
  pupils: TypingAccount[];
  /** Nach jedem Speichern: die aktualisierte Klasse melden. */
  onClassChange: (cls: TypingClass) => void;
  /**
   * ★★★★★ E3 (18.09.2026, „Meine Klassen" - Aufgaben-Zeile): Der Kasten steht
   * jetzt im Panel eines Aussen-Schalters („Tippchallenge" in der Reihe der
   * vier Aufgaben) - der Aussen-Schalter öffnet und schliesst, nicht mehr der
   * eigene Kopf hier. `eingebettet` lässt darum den eigenen Rahmen, den
   * eigenen Kopf (Pfeil + „{PRUEFUNG_WORT}" in einer eigenen `h3`) und das
   * eigene Zu-/Aufklappen weg - die „immer sichtbare Zeile" und der
   * aufgeklappte Teil stehen dann beide sofort da, sobald das Panel offen ist.
   * Ohne dieses Flag (Vorgabe `false`) bleibt der Kasten genau wie bisher -
   * die Wächter, die ihn EINZELN rendern (`tastenflow-schreibprobe-kasten.test.tsx`
   * u. a.), prüfen also unverändert das eigene Ein-/Ausklappen.
   */
  eingebettet?: boolean;
  /**
   * Der kurze Stand für den Aussen-Schalter - „läuft · Bereit: 12 von 14"
   * bzw. „läuft · Abgegeben: 3 von 14", leer ausserhalb einer laufenden
   * {@link PRUEFUNG_WORT}. Reine Weitergabe eines schon hier gerechneten
   * Wertes ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]): Die
   * Zahlen selbst - wer bereit ist, wer abgegeben hat - werden NUR hier
   * gezählt, nicht ein zweites Mal aussen.
   */
  onStatus?: (kurz: string) => void;
  /**
   * Eingebettet gibt es keinen eigenen Kopf-Schalter mehr, auf den der Fokus
   * nach „{PRUEFUNG_WORT} absagen" zurückkehren könnte - das übernimmt der
   * Aussen-Schalter der Aufgaben-Zeile.
   */
  onFokusSchalter?: () => void;
}) {
  const plan = useMemo(() => planAusEinstellungen(cls.settings), [cls.settings]);
  // ★ E1 (24.09.2026): Niveaus und Texte folgen dem Weg der KLASSE (Bauplan
  // §5.3) - eine Challenge, eine Spalte, auch in einer gemischten Klasse.
  const klassenWeg = lernwegVon(cls);
  // ★ M4 (27.09.2026): auf Weg „fr" die Grundreihe der Tastatur, an der die
  // Lehrkraft den Défi startet - Schweiz-Französisch/Kanada haben für
  // „Rangée de base + e" und „Premières lettres" eigene Bänke und Etiketten.
  // Sie geht mit in den Plan; die Kinder laden die Bank von dort.
  const defiGr = defiGrundreihe(klassenWeg, activeLayoutId());
  // ★ E7a (24.09.2026): der Zeiger dieses WEGES - eigener Schlüssel für „en"
  // (`zeigerAusEinstellungen`/`schreibprobe.ts`), niemals der von „de".
  const zeiger = useMemo(
    () => zeigerAusEinstellungen(cls.settings, klassenWeg),
    [cls.settings, klassenWeg],
  );
  const { sprache } = useBedienSprache();
  const k = K[sprache];
  const H = hinweiseChallenge(sprache);
  /** Das Wort für die Sache in der Bedienungssprache (`PRUEFUNG_WORT` / *Typing Challenge*). */
  const W = pruefungWort(sprache);

  const [jetzt, setJetzt] = useState(() => Date.now());
  const [speichert, setSpeichert] = useState(false);
  const [meldung, setMeldung] = useState("");
  const [proben, setProben] = useState<Record<string, Probenergebnis[]>>({});
  const [ladefehler, setLadefehler] = useState(false);
  /**
   * ★ Ist EINMAL geladen worden?
   *
   * ⚠️ Ohne diese Unterscheidung steht in der Ergebnistabelle im Augenblick des
   * Aufschlagens bei jedem Kind „nicht angetreten" - eine Aussage über Kinder,
   * die nur heisst: Die Antwort ist noch unterwegs.
   */
  const [geladen, setGeladen] = useState(false);

  // Die Formularwerte. Vorbelegt mit dem, was zuletzt galt - eine Lehrkraft
  // schreibt meist auf demselben Niveau weiter.
  const [niveau, setNiveau] = useState<ProbenNiveau>(() => plan?.niveau ?? "start");
  const [dauer, setDauer] = useState(() => String(plan?.dauerMin ?? DAUER_VORGABE));
  /**
   * ★★★ 23.09.2026 („Freies Schreiben"): die Art der Tippchallenge - Vorgabe
   * „streng" ({@link SchreibprobePlan.modus} fehlt), wie bisher. Ein eigener
   * Wahlwert `"streng" | "frei"` statt `"frei" | undefined`: Ein Radioknopf
   * braucht für BEIDE Seiten einen `checked`-Wert, nicht nur für die
   * Ausnahme.
   */
  const [modus, setModus] = useState<"streng" | "frei">(() =>
    plan?.modus === "frei" ? "frei" : "streng",
  );
  /**
   * ★★★ Niveau „eigen" (17.09.2026): dieselbe Upload-Kette wie „Eigene
   * Übung" ({@link useEigenerTextUpload}) - ß bleibt hier VERBOTEN
   * (`true`), anders als dort: Die Rangliste braucht dieselbe Textlänge auf
   * DE- und CH-Tastatur.
   */
  const eigenerUpload = useEigenerTextUpload(false, klassenWeg);
  /**
   * ★ E8 (19.09.2026): „In Meine Texte speichern" - nur wirksam, wenn die
   * aktuelle Vorschau wirklich aus einem UPLOAD stammt (siehe
   * `EigenerTextQuelle.tsx`, `onQuelleChange` - ein Pool- oder Vorlagen-Text
   * landet sonst ein zweites Mal in der eigenen Ablage).
   */
  const [inPoolSpeichern, setInPoolSpeichern] = useState(true);
  const [quelleIstUpload, setQuelleIstUpload] = useState(true);

  const schalterRef = useRef<HTMLButtonElement>(null);
  const laufRef = useRef<HTMLSpanElement>(null);
  const [fokusZiel, setFokusZiel] = useState<"schalter" | "lauf" | null>(null);

  /**
   * Ist der Kasten aufgeklappt? Beim Laden ZU und nirgends gemerkt (Johannes
   * 11.09.2026: „ist es standardmäßig auch").
   */
  const [offen, setOffen] = useState(false);
  const teilId = useId();

  const niveauId = useId();
  const dauerId = useId();
  /** Der `name` der zwei Radioknöpfe „Art" - je Instanz eindeutig. */
  const artName = useId();

  const vorbei = plan !== null && probeVorbei(plan, jetzt);
  // Ist die Runde vorbei, gilt wieder das Formular - ihre Ergebnisse stehen
  // darunter (Dateikopf).
  const ansicht: "formular" | "lauf" = plan === null || vorbei ? "formular" : "lauf";

  /*
    ⚠️ NUR am `code` hängen, nicht an `cls.settings`: Jedes Speichern gibt eine
    neue Klasse zurück, und die Einstellungen sind danach ein NEUES Objekt mit
    demselben Inhalt. Hinge das Zurücksetzen daran, wäre nach jedem Klick das
    Formular wieder leer - eine gemessene Falle aus einem anderen Kasten dieser
    Seite, der ebenfalls an der Klasse hing.
  */
  useEffect(() => {
    setMeldung("");
    setGeladen(false);
    // Ein noch offenes Fokus-Ziel gehört der vorigen Klasse (siehe „Die
    // Fokus-Ziele" unten) - es darf nicht in der neuen zuschnappen.
    setFokusZiel(null);
    // Auch die Formularwerte gehören der Klasse: Sonst stünde in der zweiten
    // Klasse das Niveau der ersten, und niemand sähe, woher es kommt.
    setNiveau(plan?.niveau ?? "start");
    setDauer(String(plan?.dauerMin ?? DAUER_VORGABE));
    setModus(plan?.modus === "frei" ? "frei" : "streng");
    // E8: die Quelle des Eigen-Textes gehört ebenfalls der Klasse, nicht der
    // Sitzung - sonst könnte ein Häkchen der vorigen Klasse hier nachwirken.
    setInPoolSpeichern(true);
    setQuelleIstUpload(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls.code]);

  // --- Die Uhr --------------------------------------------------------------
  // Sie läuft nur, solange eine Challenge läuft. Ein Takt, der immer läuft,
  // weckt den Rechner jede Sekunde für nichts.
  useEffect(() => {
    if (!plan || vorbei) return;
    const t = window.setInterval(() => setJetzt(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [plan, vorbei]);

  // --- Die Ergebnisse der Klasse -------------------------------------------
  // Nachgefragt wird nur, solange eine Probe läuft; danach ändert sich nichts
  // mehr, und der eine Lauf beim Umschalten holt den Schlussstand.
  const laeuft = plan !== null && !vorbei;
  useEffect(() => {
    let lebt = true;
    const hole = () => {
      void typingBackend()
        .leseKlassenProben(cls.code)
        .then((r) => {
          if (!lebt) return;
          setProben(r);
          setLadefehler(false);
          setGeladen(true);
        })
        .catch(() => {
          // ⚠️ Den bisherigen Stand STEHEN LASSEN. Ein Netzaussetzer darf eine
          // Tabelle nicht leeren - eine leere Tabelle liest sich wie „niemand
          // ist angetreten", und das wäre eine falsche Aussage über Kinder.
          if (!lebt) return;
          setLadefehler(true);
          setGeladen(true);
        });
    };
    hole();
    if (!laeuft) return () => {
      lebt = false;
    };
    const t = window.setInterval(hole, NACHFRAGE_MS);
    return () => {
      lebt = false;
      window.clearInterval(t);
    };
  }, [cls.code, laeuft]);

  // --- Wer ist bereit? (10.09.2026) ----------------------------------------
  /*
   * ★★ „BEREIT: 12 VON 14 - NOCH NICHT: SAID, JANO" (Johannes, 10.09.2026).
   * Die Geräte der Kinder melden, sobald sie den Plan kennen
   * (`useSchreibprobe`). Hier wird nur gelesen: am Anfang aus der
   * Klassenliste, danach per Realtime (`beobachteKinder`) und - als Netz -
   * mit einer kurzen Nachfrage, beides NUR solange die Challenge läuft und
   * dieser Bereich offen ist.
   * ⚠️⚠️ Keine Live-Region für die Zahl (Dateikopf): Sie ändert sich mit
   * jedem Gerät. Die Statuszeile sagt es genau EINMAL - wenn alle bereit sind.
   *
   * ★ Seit gestartet wird, sobald die Lehrkraft „Jetzt starten" drückt, zählt
   * „bereit" nur im EINSTIEGSFENSTER: Da ist die Frage „ist sie bei allen
   * angekommen?". Danach kann ohnehin niemand mehr beginnen, und die Zeile
   * wiche der Abgabeliste darunter.
   */
  const [bereitVon, setBereitVon] = useState<Record<string, BereitMeldung | undefined>>(() =>
    Object.fromEntries(pupils.map((p) => [p.id, p.probeBereit])),
  );
  useEffect(() => {
    // Neu geladene Kinder bringen ihre Meldung mit - die jüngere gilt.
    setBereitVon((alt) => {
      const neu = { ...alt };
      for (const p of pupils) {
        const m = p.probeBereit;
        if (m && (!neu[p.id] || m.ms > (neu[p.id]?.ms ?? 0))) neu[p.id] = m;
      }
      return neu;
    });
  }, [pupils]);

  useEffect(() => {
    if (ansicht !== "lauf") return;
    let lebt = true;
    const nimm = (k: TypingAccount) => {
      if (!lebt || (k.classCode && k.classCode !== cls.code)) return;
      setBereitVon((alt) => ({ ...alt, [k.id]: k.probeBereit }));
    };
    const aus = typingBackend().beobachteKinder(cls.code, nimm);
    const t = window.setInterval(() => {
      void typingBackend()
        .listPupils(cls.code)
        .then((liste) => liste.forEach(nimm))
        .catch(() => {
          /* Das Bisherige bleibt stehen - ein Aussetzer macht niemanden unbereit. */
        });
    }, BEREIT_NACHFRAGE_MS);
    return () => {
      lebt = false;
      aus();
      window.clearInterval(t);
    };
  }, [cls.code, ansicht]);

  const einstiegOffen = plan !== null && einstiegRestMs(plan, jetzt) > 0;
  const bereit = useMemo(() => {
    if (!plan || ansicht !== "lauf" || !einstiegOffen) return null;
    const abgegeben = new Set(
      pupils
        .filter((p) => (proben[p.id] ?? []).some((e) => e.probeId === plan.id))
        .map((p) => p.id),
    );
    return bereitschaft(
      pupils.map((p) => ({ id: p.id, name: p.name, probeBereit: bereitVon[p.id] })),
      plan.id,
      abgegeben,
      jetzt,
    );
  }, [plan, ansicht, einstiegOffen, pupils, proben, bereitVon, jetzt]);

  /** Für welche Challenge „alle bereit" schon gesagt wurde - genau einmal. */
  const alleBereitGesagt = useRef<string | null>(null);
  useEffect(() => {
    if (!plan || !bereit || pupils.length === 0) return;
    if (bereit.nochNicht.length > 0 || alleBereitGesagt.current === plan.id) return;
    alleBereitGesagt.current = plan.id;
    setMeldung(pupils.length === 1 ? k.kindBereit : k.alleBereit(pupils.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, bereit, pupils.length]);

  // --- Die Fokus-Ziele ------------------------------------------------------
  // R1-R6: Jeder Schalter sagt, wo der Fokus danach steht. Der Umweg über einen
  // Zustand ist Absicht - erst NACH dem Rendern gibt es das neue Ziel.
  /*
   * ★★ Nachgestellt am 11.09.2026 (Wächter „nach Jetzt starten steht der Fokus
   * auf läuft"): Bis dahin wurde das Ziel nach EINEM Versuch vergessen. Auf der
   * Seite kommt die gestartete Klasse aber erst herein, wenn `onClassChange`
   * nachgeladen hat - im Augenblick des Versuchs gab es das Ziel noch nicht,
   * `ziel?.focus()` lief ins Leere, und mit dem verschwindenden Knopf „Jetzt
   * starten" fiel der Fokus an den Seitenanfang. Jetzt bleibt das Ziel stehen,
   * bis es da ist; ein Klassenwechsel verwirft es (Effekt am `cls.code` oben).
   */
  useEffect(() => {
    if (!fokusZiel) return;
    // Eingebettet gibt es den Kopf-Schalter nicht - der Aussen-Schalter der
    // Aufgaben-Zeile bekommt den Fokus stattdessen (siehe Dateikopf).
    if (fokusZiel === "schalter" && eingebettet) {
      onFokusSchalter?.();
      setFokusZiel(null);
      return;
    }
    const ziel = fokusZiel === "lauf" ? laufRef.current : schalterRef.current;
    if (!ziel) return;
    ziel.focus();
    setFokusZiel(null);
  }, [fokusZiel, ansicht, eingebettet, onFokusSchalter]);

  /** Ein Schreibvorgang zur Zeit - er meldet sich, statt still zu schlucken. */
  function belegt(): boolean {
    if (!speichert) return false;
    setMeldung(k.belegt);
    return true;
  }

  const def = niveauDef(niveau, klassenWeg, defiGr);

  // --- Wo es weitergeht (Texte sparen, 10.09.2026) --------------------------
  /*
   * Die Rechnung braucht die Zeilen der Texte - für den Satzanfang und für den
   * Übergang in den nächsten Text. Nachgeladen wird genau das Niveau, das im
   * Formular steht (dasselbe Stück, das die Kinder laden). Bis Texte UND
   * Ergebnisse da sind, steht „Es wird nachgesehen …": Eine Stelle aus halben
   * Daten wäre eine falsche Auskunft.
   *
   * ★ Nachbesserung E8 (11.09.2026, G2): Bis dahin lief das Nachladen bei
   * JEDEM Mounten dieses Kastens - und weil er seit D1 immer im Baum der
   * Klassenstatistik hängt, bei jedem Öffnen dieses Reiters, AUCH während
   * eine Challenge läuft oder längst abgegeben ist (wo die Stelle niemand
   * braucht). Jetzt nur noch, solange das Formular („Jetzt starten") die
   * sichtbare Ansicht ist - genau dann, wenn das Feld tatsächlich gebraucht
   * wird. `starten()` fragt beim Klick ohnehin noch einmal frisch nach.
   */
  const [texte, setTexte] = useState<{ niveau: ProbenNiveau; liste: Probentext[] } | null>(
    null,
  );
  useEffect(() => {
    if (ansicht !== "formular") return;
    let lebt = true;
    // ★ E7a: die Bank des KLASSENWEGES - eine „en"-Klasse startet nie deutsche Texte.
    void ladeTexte(niveau, klassenWeg, defiGr)
      .then((liste) => {
        if (lebt) setTexte({ niveau, liste });
      })
      .catch(() => {
        // Bleibt beim Satz „wird nachgesehen"; „Jetzt starten" versucht es neu.
      });
    return () => {
      lebt = false;
    };
  }, [niveau, ansicht, klassenWeg, defiGr]);
  const naechste = useMemo<NaechsterStart | null>(() => {
    if (!texte || texte.niveau !== niveau || !geladen) return null;
    return naechsterStart(niveau, cls.settings, alleEnden(proben, klassenWeg), texte.liste, klassenWeg);
  }, [texte, niveau, geladen, cls.settings, proben, klassenWeg]);

  /*
   * ★ D2 (Umbau 11.09.2026): Wo es losgeht, stand bis dahin in einer eigenen
   * Zeile unter dem Formular - jetzt nur noch im Mouseover am Knopf „Jetzt
   * starten" (`startSatz`/`herkunftSatz` bleiben unverändert, nur der Ort
   * ändert sich).
   */
  const jetztStartenHinweis = `${H.jetztStarten} ${
    naechste === null
      ? k.nachsehen
      : `${startSatz(naechste, sprache)} ${herkunftSatz(naechste, sprache)}`
  }`;


  /** Alle Ergebnisse zu EINER Probe, in der Reihenfolge der Klassenliste. */
  function zeilenZu(probeId: string): Zeile[] {
    return pupils.map((p) => ({
      id: p.id,
      name: p.name,
      ergebnis: (proben[p.id] ?? []).find((e) => e.probeId === probeId) ?? null,
    }));
  }

  // --- Starten --------------------------------------------------------------
  async function starten() {
    if (belegt()) return;

    const dauerMin = Math.round(Number(dauer));
    if (!Number.isFinite(dauerMin) || dauerMin < DAUER_MIN_KLEINST || dauerMin > DAUER_MIN_GROESST) {
      setMeldung(k.dauerFalsch(DAUER_MIN_KLEINST, DAUER_MIN_GROESST));
      return;
    }
    // ★ Niveau „eigen" braucht eine hochgeladene, verarbeitete Datei - ohne
    // sie gäbe es keinen Text, den die Klasse schreiben könnte.
    if (niveau === "eigen" && !eigenerUpload.vorschau) {
      setMeldung(k.dateiZuerst);
      return;
    }

    setSpeichert(true);

    // ★ Die Datei ablegen, BEVOR der Plan gebaut wird - der Plan braucht
    // ihre Id (`eigeneDateiId`). Ein Fehlschlag hier heisst „nichts
    // gespeichert", genau wie bei einem Netzfehler weiter unten.
    let eigeneDateiId: string | undefined;
    if (niveau === "eigen" && eigenerUpload.vorschau) {
      const v = eigenerUpload.vorschau;
      const zeilen =
        v.unbekannt.length === 0 ? v.zeilen : entferneUntippbareZeichen(v.zeilen, new Set(v.unbekannt));
      const textId = await typingBackend().speichereEigenenText(
        cls.code,
        cls.teacherId,
        eigenerUpload.dateiname,
        zeilen,
      );
      if (!textId) {
        setSpeichert(false);
        setMeldung(k.dateiNicht);
        return;
      }
      eigeneDateiId = textId;
      // E8 (19.09.2026): nebenbei in „Meine Texte" ablegen - fehlschlagen darf
      // das, ohne die Tippchallenge selbst zu gefährden.
      if (inPoolSpeichern && quelleIstUpload) {
        void typingBackend().speichereMeinenText(cls.teacherId, eigenerUpload.dateiname, zeilen);
      }
    }
    /*
      ★★ Die Startstelle wird im Augenblick des Drückens FRISCH gerechnet - mit
      den Ergebnissen, wie sie jetzt am Server liegen. Die Tabelle darunter
      kann eine Minute alt sein: Ein Kind, das eben noch abgegeben hat, fehlte
      sonst, und die Klasse schriebe seine letzten Zeilen ein zweites Mal.
      Liefert die Nachfrage nichts, gilt, was schon geladen ist.
    */
    let stelle: NaechsterStart;
    try {
      const [liste, frisch] = await Promise.all([
        ladeTexte(niveau, klassenWeg, defiGr),
        typingBackend()
          .leseKlassenProben(cls.code)
          .catch(() => ({}) as Record<string, Probenergebnis[]>),
      ]);
      stelle = naechsterStart(
        niveau,
        cls.settings,
        alleEnden({ ...proben, ...frisch }, klassenWeg),
        liste,
        klassenWeg,
      );
    } catch {
      setSpeichert(false);
      setMeldung(k.texteNicht);
      return;
    }

    const neuerPlan: SchreibprobePlan = {
      id: neueProbenId(),
      niveau,
      // Der Augenblick des Drückens - auf die Millisekunde, nicht auf die
      // Minute abgerundet: Sonst verlöre das Einstiegsfenster bis zu einer
      // Minute, bevor es überhaupt jemand sieht.
      startMs: Date.now(),
      dauerMin,
      textNr: stelle.textNr,
      startZeile: stelle.zeile,
      // ★ Seit 10.09.2026 gibt es keinen Zeitzuschlag mehr - den Ausgleich
      // macht allein das gemessene Vorlesen (seit 11.09.2026 ohne eigenes
      // Häkchen: Es liest vor, wer sein Vorlesen eingeschaltet hat).
      // Das Feld bleibt im Plan, damit ältere Datensätze lesbar bleiben.
      zuschlagProzent: 0,
      angelegtMs: Date.now(),
      ...(eigeneDateiId ? { eigeneDateiId, eigeneDateiname: eigenerUpload.dateiname } : {}),
      // ★ 23.09.2026: NUR „frei" wird je geschrieben, nie „streng" (siehe
      // `SchreibprobePlan.modus` - schont die 2000-Byte-Grenze).
      ...(modus === "frei" ? { modus: "frei" as const } : {}),
      // ★ E1 (24.09.2026): „de" wird nie geschrieben (fehlt ⇒ „de").
      // ★ M4 (27.09.2026): vorher NUR „en" - ein Défi einer „fr"-Klasse kam
      // ohne Weg in den Plan, und `planAusEinstellungen`/`lernwegVon(plan)`
      // lasen „de": die Kinder luden die DEUTSCHE Bank.
      ...(klassenWeg !== "de" ? { lernweg: klassenWeg } : {}),
      ...(defiGr ? { grundreihe: defiGr } : {}),
    };
    // Der Zeiger dieses Niveaus zeigt ab jetzt auf DIESE Challenge; die
    // anderen Niveaus behalten ihren.
    const neuerZeiger = {
      ...zeiger,
      [niveau]: { textNr: stelle.textNr, zeile: stelle.zeile, probeId: neuerPlan.id },
    };
    const neu = await typingBackend().setzeSchreibprobe(
      cls.code,
      cls.teacherId,
      neuerPlan,
      neuerZeiger,
      klassenWeg,
    );
    setSpeichert(false);
    if (!neu) {
      setMeldung(k.nichtGespeichert);
      return;
    }
    setJetzt(Date.now());
    onClassChange(neu);
    setMeldung(
      niveau === "eigen"
        ? k.gestartetDatei(dauerMin, eigenerUpload.dateiname)
        : k.gestartet(dauerMin, stelleBezeichnung(stelle.textNr, stelle.zeile, sprache)),
    );
    eigenerUpload.zuruecksetzen();
    setFokusZiel("lauf");
  }

  // --- Absagen --------------------------------------------------------------
  async function absagen() {
    if (belegt()) return;
    if (!window.confirm(k.absagenFrage(W))) {
      setMeldung(k.nichtsAbgesagt);
      return;
    }
    setSpeichert(true);
    /*
      ★★ Der Zeiger bleibt, WIE ER IST - er zeigt auf diese Challenge. Wer schon
      abgegeben hat, schiebt die nächste Startstelle hinter seine Zeile. Hat
      niemand abgegeben, beginnt die nächste an derselben Stelle
      (`naechsterStart`); wer bis zum Absagen nur geschrieben hat, hinterlässt
      keine Spur.
    */
    const neu = await typingBackend().setzeSchreibprobe(
      cls.code,
      cls.teacherId,
      null,
      zeiger,
      klassenWeg,
    );
    setSpeichert(false);
    if (!neu) {
      setMeldung(k.nichtAbgesagt);
      return;
    }
    onClassChange(neu);
    setMeldung(k.abgesagt(W));
    setFokusZiel("schalter");
  }

  // --- Der Zeitstand (B) ----------------------------------------------------
  /**
   * Was gerade zählt: die Zahl (still), der ganze Satz dazu (ohne Ticken, im
   * aufgeklappten Teil) und seine KURZE Fassung für die Zeile (11.09.2026).
   * ⚠️ Auch die kurze Fassung tickt nicht - sie nennt eine Uhrzeit oder einen
   * Zustand, nie eine Restzeit.
   */
  function zeitstand(p: SchreibprobePlan): { rest: number; satz: string; kurz: string } {
    const einstieg = einstiegRestMs(p, jetzt);
    if (einstieg > 0) {
      const zeit = UHRZEIT[sprache](new Date(p.startMs + EINSTIEGSFENSTER_MIN * 60_000));
      const uhr = k.uhr(zeit);
      return {
        rest: einstieg,
        satz: k.bisEinstieg(uhr),
        kurz: k.beginnenBis(uhr),
      };
    }
    return {
      rest: Math.max(0, klasseVorbeiMs(p) - jetzt),
      satz: k.bisLetztes,
      kurz: k.einstiegZu,
    };
  }

  // --- Frühere Proben (D) ---------------------------------------------------
  const fruehere = useMemo(() => {
    const nameVon = new Map(pupils.map((p) => [p.id, p.name]));
    const gruppen = new Map<
      string,
      {
        probeId: string;
        niveau: string;
        lernweg: Lernweg;
        textNr: number;
        startZeile: number;
        wann: number;
        zeilen: Zeile[];
      }
    >();
    for (const [kindId, liste] of Object.entries(proben)) {
      for (const e of liste) {
        // Die LAUFENDE Probe steht oben als Übersicht - ihre halbfertige
        // Tabelle gehört erst hierher, wenn die Runde vorbei ist.
        if (plan && e.probeId === plan.id && !vorbei) continue;
        let g = gruppen.get(e.probeId);
        if (!g) {
          g = {
            probeId: e.probeId,
            niveau: e.niveau,
            lernweg: lernwegVon(e),
            textNr: e.textNr,
            startZeile: e.startZeile,
            wann: 0,
            zeilen: [],
          };
          gruppen.set(e.probeId, g);
        }
        const wann = e.beginnMs > 0 ? e.beginnMs : e.endeMs;
        if (wann > 0 && (g.wann === 0 || wann < g.wann)) g.wann = wann;
        g.zeilen.push({
          id: kindId,
          // Ein Ergebnis kann von einem Kind stammen, das inzwischen nicht mehr
          // in dieser Klasse ist. Es verschweigen wäre falsch, es erfinden auch.
          name: nameVon.get(kindId) ?? k.nichtMehrInKlasse,
          ergebnis: e,
        });
      }
    }
    // ★ Eine beendete Runde OHNE ein einziges Ergebnis gehört trotzdem hierher -
    // sonst stünde „nicht angetreten" für die ganze Klasse nirgends (Befund beim
    // Handbuch-Nachziehen, 10.09.2026).
    if (plan && vorbei && !gruppen.has(plan.id)) {
      gruppen.set(plan.id, {
        probeId: plan.id,
        niveau: plan.niveau,
        lernweg: lernwegVon(plan),
        textNr: plan.textNr,
        startZeile: plan.startZeile,
        wann: plan.startMs,
        zeilen: [],
      });
    }
    const raus = [...gruppen.values()];
    for (const g of raus) g.zeilen.sort((a, b) => a.name.localeCompare(b.name, "de"));
    raus.sort((a, b) => b.wann - a.wann);
    return raus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proben, pupils, plan, vorbei]);

  /**
   * Die Abgabeliste der laufenden Runde - `null`, solange die Ergebnisse noch
   * nicht gelesen sind (sonst stünde „0 von 14" da, obwohl nur die Antwort
   * unterwegs ist).
   */
  const zeilenLauf = ansicht === "lauf" && plan && geladen ? zeilenZu(plan.id) : null;

  /*
    ★★★★★ E3 (18.09.2026): Der Stand für den Aussen-Schalter der Aufgaben-Zeile
    („Tippchallenge · läuft") - dieselben Wörter wie in der immer sichtbaren
    Zeile unten (`bereitSatz`-Zahl bzw. „Abgegeben: X von Y"), nur kurz
    zusammengefasst. Läuft nichts, bleibt der Text leer: Ein Formular ohne
    Frist ist kein Zustand, den man „nicht übersehen" darf.
  */
  useEffect(() => {
    if (!onStatus) return;
    if (ansicht !== "lauf") {
      onStatus("");
      return;
    }
    const teil = bereit
      ? k.bereitKurz(bereit.bereit.length, bereit.bereit.length + bereit.nochNicht.length)
      : zeilenLauf
        ? k.abgegebenKurz(zeilenLauf.filter((z) => z.ergebnis !== null).length, zeilenLauf.length)
        : null;
    onStatus(teil ? k.laeuftMit(teil) : k.laeuft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStatus, ansicht, bereit, zeilenLauf, sprache]);

  return (
    // ★ R2/R7 (11.09.2026, Bauplan „Klassenseite einheitlich"): gebaut wie
    // „Wochenziel - Aufgabe" und „Einstellungen der Klasse" - dieselbe Rundung,
    // derselbe Grund, dieselbe Polsterung. Die 36 px hohe Kopfzeile plus 4 px
    // oben und unten: zugeklappt gleich hoch wie die zwei anderen (gemessen
    // vorher 62 gegen 38 px - zwei Aufklapper, zwei Bauarten).
    <section
      className={eingebettet ? "" : "rounded-xl border border-hairline bg-surface-sunken px-3 py-1"}
      aria-busy={speichert}
    >
      {/*
        ════════════════════════════════════════════════════════════════════
        ★★★★★ EINGEKLAPPT - UND TROTZDEM BEDIENBAR (11.09.2026)
        ════════════════════════════════════════════════════════════════════
        Johannes, wörtlich: *„Die Tastenchallenge kann man einklappen und ist
        es standardmäßig auch, aber auch eingeklappt kann man die drei
        wichtigen Dinge sehen und einstellen (Niveau; Min; Starten)"*.

        Darum ZWEI Teile:
         • die ZEILE, immer sichtbar: der Schalter „{PRUEFUNG_WORT}" und je
           nach Zustand Niveau · Min · „Jetzt starten" (A) oder „läuft", die
           Restzeit, „Bereit" bzw. „Abgegeben" und „absagen" (B) - also genau
           das, was man in diesem Zustand TUT;
         • der AUFGEKLAPPTE Teil, das, was man nur manchmal LIEST: was im
           Niveau vorkommt und wo der Text weitergeht (A - bis dahin nur als
           Hinweis zu finden), die Einzelheiten der Runde mit allen Namen (B),
           und in beiden Zuständen die vergangenen {PRUEFUNG_WORT_MEHRZAHL}
           samt der Erklärung „Wacklig".
        Beim Laden ist er ZU und merkt sich nichts: Wer die Seite öffnet, will
        starten oder die Klasse lesen; frühere Runden sind der seltene Weg.

        ⚠️⚠️ KEIN `<details>` für den Kasten selbst. In einem `<summary>`
        dürfen keine Bedienelemente stehen - Auswahlliste und Knopf wären dort
        für eine Sprachausgabe Teil EINES Schalters -, und der Inhalt eines
        geschlossenen `<details>` ist unsichtbar; die drei Felder müssen aber
        zugeklappt stehen bleiben. ⇒ Ein Knopf mit `aria-expanded` +
        `aria-controls`, genau wie `FruehereProbe` oben. Die Überschrift
        umschliesst den Knopf (Muster „Akkordeon" der WAI-ARIA-Praxis): So
        findet die Überschriften-Navigation den Kasten, und sie sagt „zu"
        oder „offen" gleich mit.
      */}
      {/* ★ R5/R7 (11.09.2026): 8 px zwischen den Bedienelementen der Zeile -
          dasselbe Mass wie überall auf der Seite (vorher 12 waagrecht, 8 senkrecht). */}
      <div className="flex flex-wrap items-center gap-2" data-reihe="einstellungen">
        {/*
          ★ Gezeichnet wie der Kopf von „Wochenziel - Aufgabe" und „Einstellungen
          der Klasse": Pfeil, fetter Titel, kein Rahmen um den Schalter - die
          Aufklapper derselben Seite sehen gleich aus. Seit 11.09.2026 (R7) ist
          der Schalter 36 px hoch (`h-9`) wie jede Kopfzeile eines Abschnitts.
          ⚠️ Bewusst OHNE `Tipp` (gemessen 11.09.2026 bei 320 px): Ein Hinweis,
          der am linken Rand andockt, läuft bis zu 320 px nach rechts und macht
          auch unsichtbar die Seite breiter. `aria-expanded` sagt „zugeklappt"
          bzw. „aufgeklappt" an, wie beim Wochenziel.
        */}
        {/* `mr-2`: 16 px zwischen Titel und erstem Feld - im Browser las sich
            „Tippchallenge Niveau" mit 8 px als ein Wort (11.09.2026).
            ★ E3 (18.09.2026): Eingebettet übernimmt der Aussen-Schalter der
            Aufgaben-Zeile Namen, Fokus-Ziel und `aria-expanded` - ein
            zweiter Schalter mit demselben Wort direkt daneben wäre eine
            doppelte Bedienung fuer dieselbe Sache. */}
        {!eingebettet && (
          <h3 className="m-0 mr-2">
            <button
              ref={schalterRef}
              type="button"
              className="flex h-9 items-center gap-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-expanded={offen}
              aria-controls={teilId}
              onClick={() => setOffen((o) => !o)}
            >
              <span
                aria-hidden="true"
                className={"text-ink-muted transition" + (offen ? " rotate-90" : "")}
              >
                ▸
              </span>
              {W}
            </button>
          </h3>
        )}

        {/*
          ═══ A - das Formular, in der Zeile ═══════════════════════════════
          ★ Umbau 11.09.2026 (D1-D3): Der eigene Unterreiter fiel weg, der Kopf
          „{PRUEFUNG_WORT} starten" samt Erklärabsatz ebenso - es blieb EINE
          Zeile mit Niveau, Prüfungszeit und „Jetzt starten".
          ★ Abends (Einklappen): Die Beschriftungen stehen jetzt NEBEN den
          Feldern statt darüber und sind kurz - „Niveau" und „Min", wie
          Johannes sie nennt -, damit Schalter und drei Felder in eine Zeile
          passen. Die Namen für Sprachausgaben bleiben VOLLSTÄNDIG
          (`aria-label` „Tastaturniveau" und „Prüfungszeit (Minuten)"); beide
          enthalten das sichtbare Wort, wer per Sprache steuert, trifft das
          Feld also mit dem, was er liest (WCAG 2.5.3).
          ⚠️ Keine eigenen Höhen: `feld-schlank` wie beim Wochenziel,
          `btn-primary` wie bisher. Die Höhe setzt seit 11.09.2026 abends der
          Geltungsbereich `.bedien-schlank` der Seite (`index.css`, Bauplan
          „Klassenseite einheitlich" R1): 36 px für alles in dieser Zeile; der
          Schalter „{PRUEFUNG_WORT}" trägt dieselbe Höhe als `h-9`.
        */}
        {ansicht === "formular" && (
          <>
            {/* ★ `min-w-48` an der Gruppe, `min-w-0` an der Auswahl (gemessen
                11.09.2026 bei 700 px): Ohne sie ist die Auswahl mindestens so
                breit wie ihr längster Eintrag, und „Jetzt starten" rutschte
                schon bei 700 px in eine zweite Zeile. So wird der Eintrag
                eher gekürzt angezeigt - aufgeklappt steht er ganz da. */}
            <div className="flex min-w-48 flex-1 items-center gap-2">
              <label className="field-label mb-0" htmlFor={niveauId}>
                {k.niveau}
              </label>
              {/* ★ K2 (19.09.2026): Der Hinweis hing bisher NUR an der
                  Beschriftung (`Erklaert`) - wer per Tastatur zur Auswahl
                  selbst sprang, ohne über das Label zu fahren, bekam die
                  Erklärung nie zu hören. Jetzt wie bei Schulstufe/Startniveau
                  in `KlassenEinstellungsFelder.tsx`: `Tipp` am Feld selbst,
                  erscheint bei Zeiger UND Fokus.
                  ★ Der Hinweis trägt die Erklärung des gewählten Niveaus
                  (`def.erklaerung`, Nachbesserung E5b); aufgeklappt steht sie
                  zusätzlich als Satz da. */}
              <Tipp
                text={
                  def ? `${H.tastaturniveau} ${niveauTexte(def, sprache).erklaerung}` : H.tastaturniveau
                }
              >
                {(hinweisId) => (
                  <select
                    id={niveauId}
                    aria-label={k.tastaturniveau}
                    aria-describedby={hinweisId}
                    className="field-input feld-schlank"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value as ProbenNiveau)}
                  >
                    {/*
                      ★ E7a (24.09.2026): auf Weg „en" werden nur Niveaus MIT
                      einer echten Bank angeboten (Bauplan §10 E7: „nicht
                      German texts silently … not offered"). `niveauHatBank`
                      sagt für Weg „de" immer wahr - die Auswahl bleibt dort
                      unverändert (Wächter „de unveraendert").
                    */}
                    {niveauDefs(klassenWeg, defiGr)
                      .filter((n) => niveauHatBank(n.key, klassenWeg))
                      .map((n) => (
                        <option key={n.key} value={n.key}>
                          {niveauTexte(n, sprache).label}
                        </option>
                      ))}
                  </select>
                )}
              </Tipp>
            </div>
            {/*
              ═══ Art - Streng / Freies Schreiben (23.09.2026) ═══════════════
              Bauplan §7: zwei ECHTE Radioknöpfe in einem Fieldset (Pfeiltasten,
              Gruppen-Ansage, Lesemodus der Sprachausgabe kommen dadurch gratis -
              siehe `Antwortfeld.tsx`), keiner je `disabled` (R5). Der Hinweis
              sitzt wie bei Niveau/Prüfungszeit AM Feld selbst (K2), nicht nur an
              einer Beschriftung.
            */}
            <fieldset className="m-0 flex min-w-0 items-center gap-2 border-0 p-0">
              <legend className="field-label mb-0">{k.art}</legend>
              <Tipp text={H.artStreng}>
                {(hinweisId) => (
                  <label className="flex items-center gap-1 text-sm text-ink">
                    <input
                      type="radio"
                      name={artName}
                      className="accent-current"
                      checked={modus === "streng"}
                      aria-describedby={hinweisId}
                      onChange={() => setModus("streng")}
                    />
                    {k.artStreng}
                  </label>
                )}
              </Tipp>
              <Tipp text={H.artFrei}>
                {(hinweisId) => (
                  <label className="flex items-center gap-1 text-sm text-ink">
                    <input
                      type="radio"
                      name={artName}
                      className="accent-current"
                      checked={modus === "frei"}
                      aria-describedby={hinweisId}
                      onChange={() => setModus("frei")}
                    />
                    {k.artFrei}
                  </label>
                )}
              </Tipp>
            </fieldset>
            <div className="flex items-center gap-2">
              <label className="field-label mb-0" htmlFor={dauerId}>
                {k.min}
              </label>
              {/* ★ K2 (19.09.2026), wie beim Niveau oben: `Tipp` am Feld statt
                  nur an der Beschriftung.
                  ★ Das Feld steht rechts in der Reihe - sein Hinweis klappt
                  darum nach LINKS auf. Nach rechts ragte er über den Rand, und
                  auch unsichtbar macht er die Seite breiter: gemessen bei 700 px
                  Fensterbreite 831 px, die ganze Seite wanderte seitlich. */}
              <Tipp text={H.pruefungszeit} ausrichtung="rechts">
                {(hinweisId) => (
                  <input
                    id={dauerId}
                    aria-label={k.pruefungszeitName}
                    aria-describedby={hinweisId}
                    type="number"
                    inputMode="numeric"
                    min={DAUER_MIN_KLEINST}
                    max={DAUER_MIN_GROESST}
                    className="field-input feld-schlank w-20"
                    value={dauer}
                    onChange={(e) => setDauer(e.target.value)}
                  />
                )}
              </Tipp>
            </div>
            {/* Ein Knopf bekommt `Tipp`, nicht `Erklaert`: Sein Hinweis erscheint
                auch beim Fokus und wird mitgelesen - zusammen mit dem Satz,
                welcher Text drankommt (D2). So hört ihn auch, wer den Kasten
                nie aufklappt.
                ⚠️ `ausrichtung="rechts"` (gemessen 11.09.2026): Der Knopf
                steht am rechten Ende der Zeile - ein links andockender
                Hinweis ragte über den Fensterrand hinaus (148 px bei voller
                Breite, Befund aus der Nachbarsitzung zu D2). */}
            <Tipp text={jetztStartenHinweis} ausrichtung="rechts">
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-primary"
                  aria-disabled={speichert}
                  aria-describedby={hinweisId}
                  onClick={() => void starten()}
                >
                  {k.jetztStarten}
                </button>
              )}
            </Tipp>
          </>
        )}

        {/*
          ═══ B - gestartet und noch nicht vorbei, in der Zeile ═════════════
          Das Wichtigste dieses Zustands als ruhiger Text: DASS sie läuft, bis
          wann man beginnen kann, wie viele bereit sind bzw. abgegeben haben -
          und der eine Knopf, den man jetzt braucht. Die Namen stehen
          aufgeklappt.

          ★ Fokus-Ziel nach „Jetzt starten" ist „läuft" in DIESER Zeile, nicht
          eine Überschrift im aufgeklappten Teil: Die ist zugeklappt
          unsichtbar, und ein Fokus auf etwas Unsichtbares lässt eine Lehrkraft
          mit Sehrest ohne Anhaltspunkt. Die Sprachausgabe hört „{PRUEFUNG_WORT}
          läuft" (der erste Teil nur für sie - sichtbar steht das Wort schon
          im Schalter davor).

          ⚠️⚠️ KEINE `aria-live`-Region und die laufende Zahl `aria-hidden`
          (Dateikopf). Der Satz daneben sagt die Sache ohne Ticken, und
          „Bereit"/„Abgegeben" ändern sich nur, wenn ein Gerät sich meldet -
          gelesen wird beides, wenn jemand hier vorbeikommt.
        */}
        {ansicht === "lauf" &&
          plan &&
          (() => {
            const { rest, kurz } = zeitstand(plan);
            return (
              <>
                <p className="m-0 flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-ink">
                  <span
                    ref={laufRef}
                    tabIndex={-1}
                    className="font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="sr-only">{W} </span>
                    {k.laeuft}
                  </span>
                  <span aria-hidden="true" className="font-semibold tabular-nums">
                    {mmss(rest)}
                  </span>
                  <span className="text-ink-muted">{kurz}</span>
                  {bereit ? (
                    <span>
                      {k.bereitTeile(
                        bereit.bereit.length,
                        bereit.bereit.length + bereit.nochNicht.length,
                      )}
                    </span>
                  ) : zeilenLauf ? (
                    <span>
                      {k.abgegebenTeile(
                        zeilenLauf.filter((z) => z.ergebnis !== null).length,
                        zeilenLauf.length,
                      )}
                    </span>
                  ) : null}
                </p>
                <Tipp text={k.absagenTipp(W)} ausrichtung="rechts">
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary btn-umriss"
                      aria-disabled={speichert}
                      aria-describedby={hinweisId}
                      onClick={() => void absagen()}
                    >
                      {k.absagenKnopf(W)}
                    </button>
                  )}
                </Tipp>
              </>
            );
          })()}
      </div>

      {/* ═══ Der aufgeklappte Teil ═══════════════════════════════════════════ */}
      {/* ★ R7 (11.09.2026): unter der Kopfzeile eine Haarlinie, darunter 12 px
          - dieselben Masse wie „Wochenziel - Aufgabe" und „Einstellungen der
          Klasse" (`mb-2` gleicht die 4 px Polsterung des Abschnitts aus). */}
      <div
        id={teilId}
        hidden={!eingebettet && !offen}
        className={eingebettet ? "space-y-3" : "mb-2 mt-1 space-y-3 border-t border-hairline pt-3"}
      >
        {/*
          A: Was bis dahin NUR als Hinweis zu finden war - was im Niveau
          vorkommt, und wo der Text weitergeht (D2). Beides bleibt auch am
          Feld bzw. am Knopf stehen: Zugeklappt ist der Hinweis der einzige
          Weg dorthin.
        */}
        {ansicht === "formular" && (
          <div className="space-y-2 text-sm">
            {def && (
              <p className="m-0 text-ink">
                <span className="font-semibold">{niveauTexte(def, sprache).label}:</span>{" "}
                {niveauTexte(def, sprache).erklaerung}
              </p>
            )}
            {/*
              ★ E7a (24.09.2026): Der Hinweis „die eingebauten Texte sind noch
              deutsch" gilt nur, wo das auch STIMMT. Eine Klasse auf Weg „de"
              mit englischer Bedienung übt weiterhin mit den deutschen Texten
              (`sprache` ist nur die BEDIENUNG, `klassenWeg` der Lehrgang -
              siehe `lernweg.ts`) - für sie bleibt der Satz stehen. Eine Klasse
              auf Weg „en" mit einer echten englischen Bank (`start`, `gross`)
              schreibt jetzt wirklich Englisch - dort verschwindet er.
            */}
            {/*
              ★ E11a-5 (26.09.2026): auch für „fr" - aber nur, wo die Texte
              wirklich deutsch sind: Weg „de", oder ein Weg ohne eigene Bank
              für dieses Niveau. Eine Klasse auf Weg „fr" mit französischer
              Bank (E13b) sieht den Satz nicht. Englisch unverändert.
            */}
            {{
              de: false,
              en: !(klassenWeg === "en" && niveauHatBank(niveau, klassenWeg)),
              fr: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              // es: wie "en" (ES-F2: Weg "es" hat noch keine eigene Bank).
              es: !(klassenWeg === "es" && niveauHatBank(niveau, klassenWeg)),
              // ★ O-IT (02.10.2026): „it" wie „fr" - der Satz „noch deutsch" nur
              // auf Weg „de" oder ohne eigene Bank (Weg „it" hat noch keine, F4).
              it: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              // ★ O-PL (02.10.2026): wie „it" (Weg „pl" hat noch keine Bank).
              pl: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              // ★ O-TR (02.10.2026): wie "it" (Weg "tr" hat noch keine Bank).
              tr: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              // ★ O-CS (03.10.2026): wie "it" (Weg "cs" hat noch keine Bank).
              cs: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              // ★ G2-NEUN (25.10.2026): wie „cs" (die neun Wege haben noch keine eigene Bank).
              bg: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              el: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              hu: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              nl: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              pt: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              br: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              ro: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              sv: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
              uk: klassenWeg === "de" || !niveauHatBank(niveau, klassenWeg),
            }[sprache] &&
              niveau !== "eigen" &&
              niveau !== "code" && (
                <p className="m-0 text-ink" data-testid="challenge-texte-noch-deutsch">
                  {k.texteNochDeutsch}
                </p>
              )}
            {niveau === "eigen" ? (
              /*
                ★★★ Niveau „eigen" (17.09.2026): „Text X von 15" wäre hier
                Unsinn (es gibt keine Bank) - darum KEIN `naechste`-Satz,
                sondern derselbe Weg wie „Eigene Übung" (`EigenerTextQuelle.tsx`
                - Datei hochladen · Meine Texte · Vorlagen, E7/E8, 19.09.2026).
                ★ Johannes, 12.11.2026 (Christina, „dreiig"): ß BLEIBT im eigenen Text
                (`useEigenerTextUpload(false)` oben, und `verbietenSs={false}` an
                `EigenerTextQuelle`). Bis dahin wurde es beim Start gelöscht - aus
                „dreißig" wurde „dreiig". Auf der Schweizer Tastatur (kein ß) übersetzt
                die Layout-Logik wie in „Eigene Übung" ß→ss.
              */
              <div className="space-y-2">
                <EigenerTextQuelle
                  teacherId={cls.teacherId}
                  stufe={klassenStufe(cls)}
                  lang={klassenUebungsSprache(cls)}
                  lernweg={klassenWeg}
                  verbietenSs={false}
                  fuer="challenge"
                  upload={eigenerUpload}
                  inPoolSpeichern={inPoolSpeichern}
                  onInPoolSpeichernChange={setInPoolSpeichern}
                  onQuelleChange={(q) => setQuelleIstUpload(q === "upload")}
                />
                {eigenerUpload.ladeFehler && (
                  <p role="alert" className="text-sm text-danger">
                    {eigenerUpload.ladeFehler}
                  </p>
                )}
                {/* ★ 19.09.2026: Die Vorschau wächst sichtbar auf, der Satz
                    darunter gleitet mit (`Aufklappen`, wie in `EigeneUebungKasten`). */}
                <Aufklappen offen={!!eigenerUpload.vorschau}>
                  {eigenerUpload.vorschau && (
                    <EigenerTextVorschauAnzeige
                      dateiname={eigenerUpload.dateiname}
                      vorschau={eigenerUpload.vorschau}
                      textLang={klassenUebungsSprache(cls)}
                      datei={eigenerUpload.datei}
                    />
                  )}
                </Aufklappen>
                <p className="m-0 text-ink-muted">{k.wiederVonVorn}</p>
              </div>
            ) : (
              <p className="m-0 text-ink-muted">
                {naechste === null
                  ? k.nachsehen
                  : `${startSatz(naechste, sprache)} ${herkunftSatz(naechste, sprache)}`}
              </p>
            )}
          </div>
        )}

        {ansicht === "lauf" && plan && (
          <div>
            {/* ★ R6 (11.09.2026): ohne getönten Kasten - er war die dritte
                Ebene Kasten in Kasten (Karte → Abschnitt → Tönung). */}
            <dl className="m-0 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold text-ink">
                <Erklaert hilfe={H.niveau}>{k.niveau}</Erklaert>
              </dt>
              <dd className="m-0 text-ink">
                {(() => {
                  const d = niveauDef(plan.niveau, lernwegVon(plan), plan.grundreihe);
                  const bez = d ? niveauTexte(d, sprache).label : plan.niveau;
                  // ★ 23.09.2026: kurzer Vermerk „Freies Schreiben", wenn frei -
                  // die Vorgabe „Streng" braucht keine eigene Erwähnung.
                  return istFreiesSchreiben(plan) ? `${bez} · ${k.frei}` : bez;
                })()}
              </dd>
              <dt className="font-semibold text-ink">
                <Erklaert hilfe={H.start}>{k.gestartetDt}</Erklaert>
              </dt>
              <dd className="m-0 text-ink">{startGeschrieben(plan.startMs, sprache)}</dd>
              <dt className="font-semibold text-ink">
                <Erklaert hilfe={H.pruefungszeit}>{k.pruefungszeit}</Erklaert>
              </dt>
              <dd className="m-0 text-ink">
                {plan.dauerMin}
                {k.jeKind(plan.dauerMin)}
              </dd>
              <dt className="font-semibold text-ink">
                <Erklaert hilfe={H.text}>{k.text}</Erklaert>
              </dt>
              <dd className="m-0 text-ink">
                {plan.niveau === "eigen"
                  ? k.zitat(plan.eigeneDateiname || k.eigeneDatei)
                  : stelleBezeichnung(plan.textNr, plan.startZeile, sprache)}
              </dd>
            </dl>

            {/* Der ganze Satz zum Zeitstand - die laufende Zahl steht schon in
                der Zeile und kommt hier nicht ein zweites Mal. */}
            <p className="m-0 mt-2 text-sm text-ink-muted">{k.nochSatz(zeitstand(plan).satz)}</p>

            {/*
              ★★ Wer bereit ist - als Namen, nicht als Zahl allein (10.09.2026).
              ⚠️ KEINE Live-Region: Die Zahl ändert sich mit jedem Gerät, das
              sich meldet. „Alle bereit" sagt die Statuszeile unten einmal.
            */}
            {bereit && (
              <p className="m-0 mt-3 text-sm text-ink">
                <Erklaert hilfe={H.bereit}>{bereitSatz(bereit, sprache)}</Erklaert>
              </p>
            )}

            {/* Wer schon abgegeben hat - als Namen, nicht als Zahl allein. */}
            {zeilenLauf === null ? (
              <p className="m-0 mt-3 text-sm text-ink-muted">{k.werAbgegeben}</p>
            ) : (
              (() => {
                const fertig = zeilenLauf.filter((z) => z.ergebnis !== null);
                const offenListe = zeilenLauf.filter((z) => z.ergebnis === null);
                return (
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="m-0 text-ink">
                      <span className="font-semibold">
                        {k.abgegebenKopf(fertig.length, zeilenLauf.length)}
                      </span>
                      {fertig.length > 0 && ` - ${fertig.map((z) => z.name).join(", ")}`}
                    </p>
                    <p className="m-0 text-ink-muted">
                      {offenListe.length === 0
                        ? k.alleAbgegeben
                        : k.nochNichtAbgegeben(offenListe.map((z) => z.name).join(", "))}
                    </p>
                    {ladefehler && (
                      <p className="m-0 text-ink-muted">{k.listeAlt}</p>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/*
          ═══ D - die Ergebnisse jeder Runde ═════════════════════════════════
          ★ Seit 11.09.2026 abends hinter dem Schalter des ganzen Kastens statt
          hinter einem eigenen `<details>` (D3): Zwei Aufklapper ineinander -
          erst den Kasten, dann die Liste - wären ein Schritt zu viel für
          etwas, das man ohnehin nur aufklappt, um genau das zu lesen. Jede
          Runde selbst bleibt ein eigener Aufklapper (`FruehereProbe`).
        */}
        {fruehere.length > 0 ? (
          <div>
            <h4 className="m-0 text-sm font-semibold text-ink">
              {k.vergangene(pruefungWortMehrzahl(sprache), fruehere.length)}
            </h4>
            {ladefehler && (
              <p className="m-0 mt-2 text-sm text-ink-muted">{k.ergebnisseAlt}</p>
            )}
            {/* ★ R6 (11.09.2026): Haarlinien zwischen den Runden statt je eines
                gerahmten Kastens (siehe `FruehereProbe`). */}
            <ul className="m-0 mt-2 list-none divide-y divide-hairline border-y border-hairline p-0">
              {fruehere.map((g) => {
                /*
                  ★ Die eben beendete Runde steht in dieser Liste mit der
                  ganzen Klasse, auch den nicht angetretenen Kindern. Frühere
                  Runden kennen nur die Kinder mit Ergebnis - wer damals in der
                  Klasse war, weiss die Klassenliste von heute nicht mehr.
                  ★ L3 (19.09.2026): Sie steht ZU wie alle anderen (bis dahin
                  offen) - siehe `FruehereProbe`.
                */
                const ebenVorbei = vorbei && plan !== null && g.probeId === plan.id;
                return (
                  <FruehereProbe
                    key={g.probeId}
                    titel={g.wann > 0 ? startGeschrieben(g.wann, sprache) : k.zeitpunktFehlt}
                    untertitel={`${(() => {
                      const d = niveauDef(g.niveau, g.lernweg);
                      return d ? niveauTexte(d, sprache).kurz : g.niveau;
                    })()}, ${stelleBezeichnung(g.textNr, g.startZeile, sprache)} - ${k.ergebnisse(g.zeilen.length)}`}
                    zeilen={ebenVorbei && plan ? zeilenZu(plan.id) : g.zeilen}
                  />
                );
              })}
            </ul>
            <p className="m-0 mt-2 text-sm text-ink-muted">
              {k.wackligSatz(WACKLIG_MIND_DRAN, Math.round(WACKLIG_QUOTE * 100))}
            </p>
          </div>
        ) : (
          geladen && (
            <p className="m-0 text-sm text-ink-muted">{k.nochKeineRunde(W)}</p>
          )
        )}
      </div>

      {/*
        Die Statuszeile steht am ENDE, AUSSERHALB des aufgeklappten Teils, und
        ist IMMER da (nicht bedingt gerendert): Ein `aria-live`-Bereich, der
        erst mit seinem Text entsteht, wird von manchen Screenreadern nicht
        angesagt - und einer in einem zugeklappten Teil gar nicht.

        ⚠️ Hier stehen nur Meldungen NACH einer Handlung - nie eine laufende
        Zahl (Dateikopf).

        ★ Leer nimmt sie keinen Platz (`empty:`), gemessen im Browser
        11.09.2026: Sonst stand unter der zugeklappten Zeile eine leere
        Textzeile, und der schlanke Kasten war doppelt so hoch wie nötig. Sie
        bleibt dabei im Baum (Höhe 0, nicht `display: none`) - die Ansage
        funktioniert unverändert.
      */}
      {/* ★ R9 (11.09.2026, Bauplan „Klassenseite einheitlich"): keine
          Mindesthöhe mehr, auch gefüllt nicht - leer ist die Zeile 0 px hoch,
          gefüllt so hoch wie ihr Text; `pb-1` rückt die Meldung vom Rand ab. */}
      <p
        role="status"
        aria-live="polite"
        className="m-0 pb-1 text-sm text-ink-muted empty:pb-0"
      >
        {meldung}
      </p>
    </section>
  );
}
