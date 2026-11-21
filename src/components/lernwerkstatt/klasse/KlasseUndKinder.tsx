/**
 * Reiter „Klasse & Konten" (MK-E1 + MK-E2) — der programm-NEUTRALE Teil von
 * „Meine Klassen".
 *
 * Hier und NUR hier passiert alles, was allen vier Lernprogrammen gemeinsam
 * gehört: Klasse anlegen/bearbeiten/löschen, Klassencode, Lehrkräfte,
 * Wochenbericht, Kinder anlegen/verschieben/Passwort/löschen, Druckliste und die Auswahl
 * „Programme dieser Klasse". Alles Programm-Eigene (Textstufe, Hilfsmittel,
 * Lern-Schalter …) steht in den Programm-Reitern — damit die Lehrkraft immer
 * sieht, wozu eine Einstellung gehört.
 *
 * Ein Kind wird bewusst nur mit NAME + PASSWORT angelegt. Alles Weitere ist
 * programm-eigen und dort einstellbar; die Voreinstellungen (Textstufe
 * „11-15 Jahre", Niveau „normal", Einstieg ganz vorn) entsprechen dem
 * bisherigen Anlege-Formular von Tastenflow.
 *
 * ★★★ SEIT 12.09.2026: VIELE KINDER AUF EINMAL AUS EXCEL (Auftrag Johannes).
 * Die Vorlage legt NUR Kinder an, in der gerade gewählten Klasse; Spalten
 * Name · Passwort · „Tastenflow: womit anfangen?". Ein leeres Passwort erzeugt
 * die App, und alle importierten Kinder stehen danach in „Zugangsdaten
 * drucken". Erst eine Vorschau, geschrieben wird erst nach der Bestätigung -
 * über DENSELBEN Weg wie das Formular (`legeKindAn`). Logik:
 * `lib/lernwerkstatt/kinderImport.ts`.
 *
 * ★★★ AUSNAHME SEIT 11.09.2026 (Nacht) - DIE KLASSE WIRD VOLLSTÄNDIG ANGELEGT.
 * Johannes, wörtlich: *„Alles was im Bereich ‚Einstellungen der Klasse'
 * vorkommt muss beim Erstellen einer neuen Klasse abgefragt werden … Lass uns
 * den Bereich neue Klasse anlegen zum Ausklappen machen und erst wenn alles
 * ausgefüllt ist kann man Klasse erstellen."* Schulstufe, Sprache samt Sperre,
 * Startniveau und Klassenmatch sind Tastenflow-Einstellungen in einem Formular
 * für alle Programme - der Abschnitt sagt darum in einer Zeile, wofür sie
 * gelten. Die Felder kommen aus demselben Bauteil wie „Einstellungen der
 * Klasse" (`KlassenEinstellungsFelder.tsx`).
 *
 * Anrede „Sie" (K21).
 */
import { useEffect, useId, useRef, useState } from "react";
import {
  KindVerschoben,
  Result,
  TypingAccount,
  TypingClass,
  VORGABE_STUFE,
  typingBackend,
} from "@/lib/typing";
import { pruefungWort } from "@/lib/typing/schreibprobe";
// ★ EN9: Sätze vom Server (Kind verschieben, Klassencode ändern) in der
// Sprache der Bedienung - die Tabelle steht in `lib/typing/serverMeldungen.ts`.
import { ServerMeldung } from "@/components/typing/ServerMeldung";
import { serverMeldung } from "@/lib/typing/serverMeldungen";
import { ZUGANGSDATEN_TEXTE } from "@/lib/lernwerkstatt/teilnehmerlisteDocx";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import type { Teil } from "@/lib/bedienSprache/texte";
import { PROGRAMM_BESCHREIBUNG, programmNameLang } from "./programmTexte";
import { klassencodeFehler, klassencodeVorschlag } from "@/lib/lernwerkstatt/klassencode";
import {
  BLATT_HINWEISE_EN,
  BLATT_KINDER_EN,
  VORLAGE,
  abgelehntSatzIn,
  dateiBytes,
  erzeugePasswort,
  fremdeKlasseHinweis,
  leseKinderXlsx,
  pruefeKinderZeilen,
  vorlageDateiname,
  vorlageHerunterladen,
  type KinderPlan,
} from "@/lib/lernwerkstatt/kinderImport";
import { neueKlassenSprache, type KlassenAnlage, type Lang } from "@/lib/typing/account";
import {
  nichtGespeicherteEinstellungen,
  schuljahrStartjahr,
} from "@/lib/typing/klassenEinstellungen";
// ★ D2 (28.09.2026): Vorgabe für den Beginn des Schuljahres einer neuen Klasse.
import { schuljahrBeginnVorgabeDesGeraets } from "@/lib/typing/schuljahrBeginn";
import { KlassenEinstellungsFelder } from "@/components/typing/KlassenEinstellungsFelder";
import { ClassTeachers } from "./ClassTeachers";
import { Tipp } from "@/components/Tipp";
import { Aufklappen } from "@/components/Aufklappen";
import { Erklaert } from "@/components/typing/Erklaert";
import { ResetPupilPasswordForm } from "@/components/typing/PasswordControls";
import { LwClassMessageButton } from "@/components/lernwerkstatt/LwTeacherCompose";
import { ProgrammZeichen } from "@/components/lernwerkstatt/ProgrammZeichen";
import {
  LW_PROGRAMS,
  type LwProgram,
  type LwProgramKey,
  klasseMitTastenflow,
  saveClassPrograms,
} from "@/lib/lernwerkstatt/klassen";
// ★ E1 (24.09.2026): der Lernweg (Bauplan englischer Lehrgang §2.2).
import {
  bestimmeLernweg,
  englischLehrgangProbeAn,
  franzoesischLehrgangProbeAn,
  neueLehrgangProben,
  spanischLehrgangProbeAn,
  lernwegVon,
} from "@/lib/typing/lernweg";
import type { EnglischVariante } from "@/lib/typing/schreibweise";
import { FilmKnopf } from "@/components/FilmKnopf";

/**
 * ★★★ DIE TEXTE VON „KINDER UND ZUGÄNGE" in beiden Bedienungssprachen (EN6b,
 * 19.09.2026) - Klasse anlegen/bearbeiten/löschen, Kinder anlegen, Excel-
 * Import, Druckliste, Verschieben, Kontakt-E-Mail, Programme der Klasse.
 *
 * ⚠️ GEMEINSAMER TEIL (alle vier Programme): Englisch nur über den Anbieter,
 * und der ist nur auf den Tastenflow-Adressen aktiv - von Punktgenau aus
 * bleibt der Bereich Zeichen für Zeichen deutsch. Deutsch wortgleich wie
 * vorher; wo ein deutscher Satz im JSX aus mehreren Textknoten bestand,
 * liefert die Tabelle dieselben Stücke (`Teil[]`), damit der DOM bleibt, wie
 * er war.
 *
 * Wörter nach Glossar §3.8/§3.15 und dem englischen Handbuch (Kapitel 2):
 * *Create a new class · Class name · Class code · For Tastenflow · Create a
 * class · Edit · Apps in this class · Weekly report by email · Learners · Add
 * to class · Tastenflow: where to start? · Add · Print login details · Change
 * password · Move to another class · Class code of the new class · Download
 * template (Excel) · Import pupils from Excel · class list*. Kind / Teilnehmer
 * (Lehrkraft-Sicht) ⇒ *pupil*; Zeilen einer Excel-Datei ⇒ *rows*;
 * Erziehungsberechtigte ⇒ *parents and carers*. Rückfragen nennen die Folgen,
 * wie im Deutschen.
 *
 * ⚠️ Sätze, die über `ServerMeldung` angezeigt werden (Fehlerzeile, Meldung
 * beim Verschieben), kommen entweder vom Server (dann übersetzt die Tabelle
 * `serverMeldungen.ts`) oder als EIGENE Sätze in der Bedienungssprache - die
 * beiden werden auseinandergehalten (`eigen`), sonst stünde ein englischer
 * eigener Satz als „unbekannt" in `lang="de"`.
 */
/**
 * ★★★ 18.10.2026: die Sätze für eine Klasse OHNE Tastenflow - nur Deutsch.
 * Ausserhalb von Deutsch gibt es in „Meine Klassen" nur Tastenflow
 * (`programmInSprache`), `klasseMitTastenflow` ist dort immer wahr.
 */
const OHNE_TASTENFLOW_DE = {
  hinzufuegenTipp:
    "Legt das Kind mit Name und Passwort in dieser Klasse an. Alles Weitere (Sprache, Hilfsmittel …) stellen Sie danach im Reiter des jeweiligen Programms ein. Danach steht der Fokus wieder im Namensfeld.",
  vorlageTipp: (datei: string) =>
    `Lädt die Excel-Datei „${datei}“ herunter: im Blatt „Teilnehmer“ oben Klasse und Datum, darunter 40 Zeilen zum Ausfüllen; im Blatt „Hinweise“ die Anleitung. Tragen Sie je Teilnehmer eine Zeile ein (Name und Passwort - leer erzeugt das Programm eines) und importieren Sie die Datei danach hier; vor dem Anlegen sehen Sie eine Vorschau.`,
} as const;

export const T = texte({
  de: {
    // --- Programme dieser Klasse
    auswahlSpeichert: "Einen Augenblick - die Auswahl wird noch gespeichert.",
    keinProgramm: "Kein Programm gewählt - angezeigt wird das Programm, über das Sie hereinkommen.",
    auswahlGespeichert: "Programm-Auswahl gespeichert.",
    programmeKlasse: "Programme dieser Klasse",
    nurAnsicht: "Das steuert nur ",
    ihreAnsicht: "Ihre Ansicht",
    nurAnsichtRest:
      ": abgewählte Programme bekommen hier keinen Reiter und keine Spalte. Die Kinder dürfen weiterhin jedes Programm öffnen - es wird nichts gesperrt.",
    // --- Was beim Anlegen fehlt
    fehltName: "der Klassenname",
    fehltCodeGueltig:
      "ein gültiger Klassencode (2 bis 12 Zeichen: Buchstaben, Ziffern, Punkt oder Bindestrich)",
    fehltCode: "der Klassencode",
    fehltSchulstufe: "die Schulstufe",
    fehltStart: "das Startniveau",
    und: " und ",
    fehltSatz: (liste: string) => `Zum Anlegen fehlt noch: ${liste}.`,
    // --- Wörter mit Zahl
    teilnehmer: (n: number) => `${n} Teilnehmer`,
    zeilen: (n: number) => `${n} ${n === 1 ? "Zeile" : "Zeilen"}`,
    // --- Erste Schritte
    ersteSchritte: "Erste Schritte",
    schrittKlasse: "Klasse anlegen",
    schrittKlasseText:
      "Name, Klassencode und die Programme der Klasse. Nur bei Tastenflow kommen Schulstufe, Sprache, Startniveau und Klassenmatch dazu. Den Code schlägt das Programm passend zum Namen vor; Sie können ihn ändern. Mit ihm melden sich die Kinder in allen Lernprogrammen an.",
    schrittLernende: "Lernende anlegen",
    schrittLernendeText:
      "Name und Passwort, mehr nicht. Danach können Sie die Zugangsdaten als Liste ausdrucken und austeilen.",
    schrittProgramme: "Programme ankreuzen",
    schrittProgrammeText:
      "Welche Lernprogramme nutzt diese Klasse? Das ordnet nur Ihre Ansicht - die Kinder dürfen weiterhin jedes Programm öffnen.",
    erledigt: ", erledigt",
    jetztDran: ", jetzt dran",
    // --- Meldungen
    wirdGespeichert: "Wird gespeichert …",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Die Klasse „${name}“ ist angelegt, aber nicht gespeichert wurde: ` +
      `${liste}. Bitte tragen Sie das unter „Einstellungen der ` +
      `Klasse“ im Reiter Tastenflow nach.`,
    klasseAngelegt: (name: string) => `Klasse „${name}“ angelegt.`,
    /*
      ★ Nachbesserung 20.09.2026 (Johannes: „Das Programm kann ja eine Nummer
      vergeben und damit arbeiten"): der vorgeschlagene Klassencode war bei
      einer anderen Lehrkraft schon vergeben - das Programm ist selbst auf den
      nächsten freien ausgewichen. Der Klassenname bleibt unverändert; nur der
      Code unterscheidet sich vom Vorschlag, und genau das sagt der Satz.
    */
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Klasse „${name}“ angelegt - der Klassencode „${gewuenscht.trim().toUpperCase()}“ war ` +
      `schon vergeben, darum gilt jetzt der Klassencode „${code}“.`,
    nameZuerst: "Bitte geben Sie zuerst einen Namen ein.",
    passwortKurz: "Das Passwort braucht mindestens 4 Zeichen.",
    kontaktFalsch: "Die Kontakt-E-Mail sieht nicht richtig aus - oder das Feld leer lassen.",
    kindAngelegt: (name: string) => `${name} angelegt.`,
    vorlageLaedt: (datei: string) => `Die Vorlage „${datei}“ wird heruntergeladen.`,
    vorlageFehler:
      "Die Vorlage ließ sich nicht erzeugen. Bitte laden Sie die Seite neu und versuchen Sie es noch einmal.",
    listeWird: "Die Teilnehmerliste wird zusammengestellt.",
    listeLaedt: (klasse: string) => `Die Teilnehmerliste der Klasse ${klasse} wird heruntergeladen.`,
    listeFehler:
      "Die Teilnehmerliste ließ sich nicht erzeugen. Bitte laden Sie die Seite neu und versuchen Sie es noch einmal.",
    nochSpeichern: "Einen Augenblick - es wird noch gespeichert.",
    dateiNichtOffen: "Die Datei ließ sich nicht öffnen. Bitte wählen Sie sie noch einmal.",
    dateiLeer: (datei: string) =>
      `In „${datei}“ steht unter der Kopfzeile kein Kind. Bitte tragen Sie je Kind eine Zeile ein und importieren Sie die Datei noch einmal.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Vorschau: ${anlegen} zum Anlegen` +
      (abgelehnt ? `, ${abgelehnt} nicht übernommen.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Aus dieser Datei lässt sich kein Teilnehmer anlegen - die Gründe stehen in der Vorschau. Bitte korrigieren Sie die Datei und importieren Sie sie noch einmal.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Wird angelegt: ${nr} von ${von} (${name}) …`,
    kontoNicht: "Das Konto konnte nicht angelegt werden.",
    ergebnisAngelegt: (anzahl: string) => `${anzahl} angelegt.`,
    ergebnisNicht: (n: number, liste: string) => `${n} nicht: ${liste}.`,
    ergebnisDrucken: "Namen und Passwörter stehen unter „Zugangsdaten drucken“.",
    anlegenLaeuft: "Das Anlegen läuft schon - bitte warten Sie, bis es fertig ist.",
    importAbgebrochen: "Import abgebrochen - es wurde kein Teilnehmer angelegt.",
    kindLoeschenFrage: (name: string) =>
      `„${name}“ wirklich löschen? Der gesamte Lernstand in ALLEN ` +
      `Lernprogrammen geht verloren. Das lässt sich nicht rückgängig machen.`,
    kindGeloescht: (name: string) => `${name} gelöscht.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Klasse „${name}“ wirklich löschen?` +
      (n > 0
        ? ` Damit werden auch ${n} lernende Person${n === 1 ? "" : "en"} samt ` +
          `Lernstand endgültig gelöscht.`
        : "") +
      " Das lässt sich nicht rückgängig machen.",
    klasseGeloescht: (name: string) => `Klasse „${name}“ gelöscht.`,
    klassennameFehlt: "Bitte geben Sie einen Klassennamen ein.",
    codeFehlt: "Bitte geben Sie einen Klassencode ein - mit ihm melden sich die Kinder an.",
    codeUngueltig:
      "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.",
    klasseGespeichert: "Klasse gespeichert.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} ist jetzt in der Klasse „${klasse}“ ` +
      `(Klassencode ${code}) und meldet sich ab jetzt mit diesem Code an.`,
    wochenberichtAn: "Wochenbericht eingeschaltet.",
    wochenberichtAus: "Wochenbericht ausgeschaltet.",
    druckBlockiert: "Das Druckfenster wurde blockiert. Bitte Pop-ups für diese Seite erlauben.",
    // --- Klassen, Neue Klasse anlegen
    klassen: "Klassen",
    klasseWaehlenTipp: (name: string) => `Wählt die Klasse ${name} - alle Reiter zeigen dann ihre Lernenden.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Klasse ${name}${gewaehlt ? ", gewählt" : ""}`,
    neueKlasse: "Neue Klasse anlegen",
    neueKlasseInhalt: "· Name, Klassencode, Programme",
    neuProgrammeTitel: "Welche Programme nutzt die Klasse?",
    neuProgrammeHinweis:
      "Das ordnet nur Ihre Ansicht - die Kinder dürfen weiterhin jedes Programm öffnen. Die Angaben zu Tastenflow (Schulstufe, Sprache, Startniveau, Klassenmatch) erscheinen nur, wenn Tastenflow angekreuzt ist.",
    neuProgrammName: (label: string) => `${label} für die neue Klasse`,
    fehltProgramm: "mindestens ein Programm",
    klassenname: "Klassenname",
    klassennameBeispiel: "z. B. 3b oder Vorbereitungskurs",
    klassencode: "Klassencode",
    klassencodeTipp:
      "Pflicht. Mit diesem Code melden sich die Kinder an - in jedem Lernprogramm, mit demselben Namen und Passwort. Er wird passend zum Namen vorgeschlagen und lässt sich ändern: 2 bis 12 Zeichen, Buchstaben, Ziffern, Punkt oder Bindestrich.",
    klassencodeBeispiel: "z. B. 3.MS",
    fuerTastenflowTipp: `Diese Angaben gelten nur im 10-Finger-Schreiben (Tastenflow); die anderen Programme ändern sie nicht. Später unter „Einstellungen der Klasse" im Reiter Tastenflow änderbar.`,
    fuerTastenflow: "Für Tastenflow",
    bezugNeu: "der neuen Klasse",
    bitteWaehlen: "Bitte wählen",
    startHinweis: "was die Kinder schon können - gilt auch für alle, die später dazukommen",
    startSrHinweis:
      "Pflicht. Die Tasten bis zu dieser Stufe sind für jedes Kind dieser Klasse von Anfang an freigeschaltet - " +
      "auch für Kinder, die später dazukommen. Ein Kind, das schon weiter ist, verliert nichts.",
    anlegenTipp: "Legt die Klasse mit allen Angaben an. Der Klassencode gilt dann für alle Lernprogramme.",
    klasseAnlegen: "Klasse anlegen",
    zuerstKlasse: "Legen Sie zuerst eine Klasse an - mit ihrem Klassencode melden sich die Kinder an.",
    // --- Die Klasse
    klasseVor: "Klasse ",
    codeFuerLernende: " · Klassencode für die Lernenden",
    bearbeitenTipp: "Klassenname oder Klassencode ändern.",
    klasseBearbeiten: "Klasse bearbeiten",
    bearbeiten: " Bearbeiten",
    loeschenTipp: "Diese Klasse mit allen Lernenden löschen - nach einer Rückfrage.",
    klasseLoeschen: "Klasse löschen",
    klasseLoeschenKnopf: " Klasse löschen",
    codeAendernTipp:
      "2 bis 12 Zeichen, Buchstaben, Ziffern, Punkt oder Bindestrich. Ändern Sie ihn, melden sich alle Lernenden dieser Klasse künftig mit dem neuen Code an.",
    speichernTipp: "Übernimmt den neuen Klassennamen und Klassencode.",
    speichern: "Speichern",
    abbrechenTipp: "Schließt das Bearbeiten, ohne etwas zu ändern.",
    abbrechen: "Abbrechen",
    codeWarnVor: "⚠️ Wird der Code geändert, gilt für",
    codeWarnWer: (n: number) => (n === 1 ? "die lernende Person" : `alle ${n} Lernenden`),
    codeWarnMitte: "dieser Klasse ab dann der ",
    codeWarnNeu: "neue",
    codeWarnEnde: " Code.",
    wochenbericht: " Wochenbericht per E-Mail (einmal pro Woche, montags, mit den Tastenflow-Zahlen)",
    wochenberichtAnAdresse: "an ",
    // --- Lernende
    lernende: "Lernende (",
    druckenTipp: "Namen, Passwörter und Klassencode der eben angelegten Kinder ausdrucken.",
    drucken: " Zugangsdaten drucken (",
    zurKlasse: "Zur Klasse hinzufügen",
    nameTipp: "Der Vorname reicht. Er muss in dieser Klasse einmalig sein - Groß-/Kleinschreibung zählt dabei nicht.",
    name: "Name",
    passwort: "Passwort",
    passwortBeispiel: "mind. 4 Zeichen",
    zufallTipp: "Erzeugt ein leicht tippbares Passwort aus 5 Buchstaben und Ziffern und setzt es in das Feld.",
    zufall: "Zufällig",
    kontakt: "Kontakt-E-Mail (optional)",
    kontaktTipp:
      "Steht hier eine Adresse, bekommt das Kind seine Zugangsdaten automatisch per Mail - beim Anlegen und bei jedem späteren Zurücksetzen.",
    kontaktBeispiel: "z. B. für die Erziehungsberechtigten",
    womitAnfangen: "Tastenflow: womit anfangen?",
    womitTipp:
      "Was das Kind schon kann. Die Tasten bis hierher sind von Anfang an freigeschaltet. Vorgewählt ist das Startniveau der Klasse.",
    hinzufuegenTipp:
      "Legt das Kind mit Name, Passwort und - für Tastenflow - womit es anfängt in dieser Klasse an. Alles Weitere (Sprache, Hilfsmittel …) stellen Sie danach im Reiter des jeweiligen Programms ein. Die Übungstexte richten sich nach der Schulstufe der Klasse (beim Anlegen der Klasse eingetragen, zählt jedes Schuljahr von selbst weiter) - ein Geburtsjahr wird nicht erhoben. Danach steht der Fokus wieder im Namensfeld.",
    hinzufuegen: "Hinzufügen",
    // --- Excel
    excelTitel: "Viele Teilnehmer auf einmal (Excel)",
    kommenInKlasse: "Die Teilnehmer kommen in die Klasse ",
    vorlageTipp: (datei: string) =>
      `Lädt die Excel-Datei „${datei}“ herunter: im Blatt „Teilnehmer“ oben Klasse und Datum, darunter die Auswahl „womit anfangen“ für alle Teilnehmer und 40 Zeilen zum Ausfüllen; im Blatt „Hinweise“ die Anleitung und die Liste der Startniveaus. Tragen Sie je Teilnehmer eine Zeile ein (Name und Passwort - leer erzeugt das Programm eines) und importieren Sie die Datei danach hier; vor dem Anlegen sehen Sie eine Vorschau.`,
    vorlage: "Vorlage herunterladen (Excel)",
    importTipp:
      "Öffnet die Dateiauswahl für die ausgefüllte Vorlage (.xlsx). Zuerst erscheint eine Vorschau - angelegt wird erst, wenn Sie es bestätigen.",
    importieren: "Teilnehmer aus Excel importieren",
    listeTipp:
      "Lädt eine Word-Datei mit Name, Passwort und Klassencode ALLER Lernenden dieser Klasse herunter - zum Ausdrucken und Austeilen.",
    liste: "Teilnehmerliste herunterladen",
    vorschauVor: "Vorschau: „",
    vorschauNach: "“",
    vorschauSatz: (anzahl: number, wort: string, klasse: string) =>
      `${wort} ${anzahl === 1 ? "wird" : "werden"} in der Klasse ${klasse} angelegt. Gespeichert wird erst, wenn Sie „${wort} anlegen“ wählen.`,
    vorschauKeiner: "Aus dieser Datei wird kein Teilnehmer angelegt.",
    escape: "Escape bricht ab.",
    passwortPunkt: " · Passwort",
    passwortErzeugt: " (Passwort erzeugt)",
    tastenflowPunkt: " · Tastenflow:",
    startDerKlasse: " (Startniveau der Klasse)",
    vorgabe: " (Vorgabe)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      `${n} ${n === 1 ? "Zeile" : "Zeilen"}`,
      " ",
      n === 1 ? "wird" : "werden",
      " nicht übernommen",
    ],
    korrigieren:
      "Diese Zeilen können Sie in der Datei korrigieren und später noch einmal importieren. Wer dann schon angelegt ist, steht in der Vorschau mit „Diesen Namen gibt es in der Klasse schon.“",
    anlegenTippImport:
      "Legt die Kinder aus der Vorschau nacheinander in dieser Klasse an. Danach steht der Fokus auf der Überschrift „Lernende“, darunter das Ergebnis.",
    anlegenKnopf: (n: number): readonly Teil[] => [`${n} Teilnehmer`, " anlegen"],
    verwerfenTipp: "Verwirft die Vorschau, ohne ein Kind anzulegen (Escape).",
    nochKeine:
      "Noch keine Lernenden. Oben anlegen - danach melden sie sich mit Klassencode, Name und Passwort an (von jedem Gerät).",
    // --- Eine Kind-Zeile
    wirdVerschoben: "Wird verschoben …",
    verschiebenLaeuft: "Einen Augenblick - das Verschieben läuft noch.",
    zielFehlt: "Bitte den Klassencode der neuen Klasse eingeben.",
    verschiebenFrage: (name: string, code: string, pruefung: string) =>
      `${name} in die Klasse mit dem Klassencode ${code} verschieben?\n\n` +
      `- ${name} meldet sich danach mit dem neuen Klassencode ${code} an.\n` +
      `- Die Lehrkräfte der neuen Klasse sehen ${name} und den Lernstand.\n` +
      `- ${pruefung}-Ergebnisse und Nachrichten bleiben bei der bisherigen Klasse.\n` +
      `- Sie selbst sehen ${name} danach nur noch, wenn Sie auch Lehrkraft der neuen Klasse sind.`,
    nichtsVerschoben: "Es wurde nichts verschoben.",
    emailFalsch: "Das sieht nicht wie eine E-Mail-Adresse aus - oder das Feld leer lassen.",
    kontaktGespeichert: "Kontakt-E-Mail gespeichert.",
    kontaktEntfernt: "Kontakt-E-Mail entfernt.",
    passwortTipp: (name: string) => `Klappt das Feld für ein neues Passwort von ${name} auf und zu.`,
    passwortAendern: "Passwort ändern",
    kontaktKnopfTipp: (name: string) =>
      `Klappt das Feld für die Kontakt-E-Mail von ${name} auf und zu - ist sie gesetzt, bekommt das Kind sein Passwort automatisch per Mail, sobald es gesetzt oder zurückgesetzt wird.`,
    kontaktKnopfName: (name: string) => `Kontakt-E-Mail: ${name}`,
    kontaktKnopf: "Kontakt-E-Mail",
    verschiebenTipp: (name: string) =>
      `Klappt das Feld auf, mit dem ${name} in eine andere Klasse wechselt - auch in die Klasse einer anderen Lehrkraft, deren Klassencode Sie kennen.`,
    verschiebenName: (name: string) => `In andere Klasse verschieben: ${name}`,
    verschiebenKnopf: "In andere Klasse verschieben",
    loeschenKindTipp: (name: string) =>
      `Löscht ${name} samt Lernstand in allen Lernprogrammen - nach einer Rückfrage.`,
    loeschenKindName: (name: string) => `${name} löschen`,
    loeschenKnopf: " Löschen",
    kontaktVon: "Kontakt-E-Mail von ",
    kontaktLeer: "leer lassen = keine Mail",
    kontaktSpeichernTipp: (name: string) =>
      `Speichert die Kontakt-E-Mail von ${name} - leer lassen entfernt sie wieder.`,
    schliessenTipp: "Schliesst das Feld, ohne zu speichern (Escape).",
    codeNeueKlasse: "Klassencode der neuen Klasse",
    folgenTipp: (name: string, pruefung: string) =>
      `Danach meldet sich ${name} mit dem neuen Klassencode an. Die Lehrkräfte der neuen Klasse sehen ${name} und den Lernstand. ${pruefung}-Ergebnisse und Nachrichten bleiben bei dieser Klasse.`,
    zielBeispiel: "z. B. 4A",
    verschiebeTipp: (name: string) =>
      `Verschiebt ${name} nach einer Rückfrage in die Klasse mit diesem Klassencode.`,
    verschieben: "Verschieben",
    nichtVerschiebenTipp: "Schliesst das Feld, ohne etwas zu verschieben (Escape).",
  },
  en: {
    auswahlSpeichert: "One moment - your choice is still being saved.",
    keinProgramm: "No app selected - you will see the app you came in from.",
    auswahlGespeichert: "Choice of apps saved.",
    programmeKlasse: "Apps in this class",
    nurAnsicht: "This only changes ",
    ihreAnsicht: "your view",
    nurAnsichtRest:
      ": apps you untick get no tab and no column here. Pupils can still open every app - nothing is locked.",
    fehltName: "the class name",
    fehltCodeGueltig:
      "a valid class code (2 to 12 characters: letters, digits, full stops or hyphens)",
    fehltCode: "the class code",
    fehltSchulstufe: "the year group",
    fehltStart: "the starting point",
    und: " and ",
    fehltSatz: (liste: string) => `Still missing before you can create the class: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` }),
    zeilen: (n: number) => mehrzahl(n, "en", { one: (z) => `${z} row`, other: (z) => `${z} rows` }),
    ersteSchritte: "Getting started",
    schrittKlasse: "Create a class",
    schrittKlasseText:
      "Name, class code, year group, language, starting point and Class Match. The app suggests a code to match the name; you can change it. Pupils use it to sign in to all the apps.",
    schrittLernende: "Add pupils",
    schrittLernendeText:
      "Name and password, nothing more. Afterwards you can print the login details as a list and hand them out.",
    schrittProgramme: "Tick the apps",
    schrittProgrammeText:
      "Which apps does this class use? This only arranges your view - pupils can still open every app.",
    erledigt: ", done",
    jetztDran: ", next step",
    wirdGespeichert: "Saving …",
    angelegtAberFehlt: (name: string, liste: string) =>
      `The class “${name}” has been created, but these were not saved: ${liste}. ` +
      `Please add them under “Class settings” in the Tastenflow tab.`,
    klasseAngelegt: (name: string) => `Class “${name}” created.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Class “${name}” created - the class code “${gewuenscht.trim().toUpperCase()}” was ` +
      `already taken, so the class code “${code}” applies instead.`,
    nameZuerst: "Please enter a name first.",
    passwortKurz: "The password needs at least 4 characters.",
    kontaktFalsch: "The contact email doesn't look right - or leave the field empty.",
    kindAngelegt: (name: string) => `${name} added.`,
    vorlageLaedt: (datei: string) => `The template “${datei}” is downloading.`,
    vorlageFehler: "The template couldn't be created. Please reload the page and try again.",
    listeWird: "Putting the class list together.",
    listeLaedt: (klasse: string) => `The class list for ${klasse} is downloading.`,
    listeFehler: "The class list couldn't be created. Please reload the page and try again.",
    nochSpeichern: "One moment - still saving.",
    dateiNichtOffen: "The file couldn't be opened. Please choose it again.",
    dateiLeer: (datei: string) =>
      `There is no pupil under the header row in “${datei}”. Please fill in one row per pupil and import the file again.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Preview: ${anlegen} to add` +
      (abgelehnt ? `, ${abgelehnt} left out.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "No pupils can be added from this file - the reasons are in the preview. Please correct the file and import it again.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Adding: ${nr} of ${von} (${name}) …`,
    kontoNicht: "The account couldn't be created.",
    ergebnisAngelegt: (anzahl: string) => `${anzahl} added.`,
    ergebnisNicht: (n: number, liste: string) => `${n} not added: ${liste}.`,
    ergebnisDrucken: "Names and passwords are under “Print login details”.",
    anlegenLaeuft: "The pupils are already being added - please wait until it has finished.",
    importAbgebrochen: "Import cancelled - no pupils were added.",
    kindLoeschenFrage: (name: string) =>
      `Delete “${name}”? All of their progress in EVERY app will be lost. This can't be undone.`,
    kindGeloescht: (name: string) => `${name} deleted.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Delete the class “${name}”?` +
      (n > 0
        ? ` This also permanently deletes ${mehrzahl(n, "en", {
            one: (z) => `${z} pupil`,
            other: (z) => `${z} pupils`,
          })} and all their progress.`
        : "") +
      " This can't be undone.",
    klasseGeloescht: (name: string) => `Class “${name}” deleted.`,
    klassennameFehlt: "Please enter a class name.",
    codeFehlt: "Please enter a class code - your pupils use it to sign in.",
    codeUngueltig:
      "A class code can have 2 to 12 characters: letters, digits, full stops or hyphens.",
    klasseGespeichert: "Class saved.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} is now in the class “${klasse}” (class code ${code}) and signs in with this code from now on.`,
    wochenberichtAn: "Weekly report switched on.",
    wochenberichtAus: "Weekly report switched off.",
    druckBlockiert: "The print window was blocked. Please allow pop-ups for this page.",
    klassen: "Classes",
    klasseWaehlenTipp: (name: string) => `Selects the class ${name} - every tab then shows its pupils.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Class ${name}${gewaehlt ? ", selected" : ""}`,
    neueKlasse: "Create a new class",
    neueKlasseInhalt: "· Name, class code, year group, language, starting point, Class Match",
    neuProgrammeTitel: "Which apps does the class use?",
    neuProgrammeHinweis:
      "This only organises your view - pupils can still open every app. The Tastenflow details (year group, language, starting point, Class Match) appear only when Tastenflow is ticked.",
    neuProgrammName: (label: string) => `${label} for the new class`,
    fehltProgramm: "at least one app",
    klassenname: "Class name",
    klassennameBeispiel: "e.g. 3b or Preparation course",
    klassencode: "Class code",
    klassencodeTipp:
      "Required. Pupils sign in with this code - in every app, with the same name and password. A code to match the name is suggested, and you can change it: 2 to 12 characters, letters, digits, full stops or hyphens.",
    klassencodeBeispiel: "e.g. 3.MS",
    fuerTastenflowTipp:
      "These settings only apply to touch typing (Tastenflow); the other apps don't change them. You can change them later under “Class settings” in the Tastenflow tab.",
    fuerTastenflow: "For Tastenflow",
    // `KlassenEinstellungsFelder` setzt „for …" / „in …" selbst davor (EN6a).
    bezugNeu: "the new class",
    bitteWaehlen: "Please choose",
    startHinweis: "What the pupils can already do - it also applies to anyone who joins later.",
    startSrHinweis:
      "Required. The keys up to this stage are unlocked from the start for every pupil in this class - " +
      "including pupils who join later. A pupil who is already further on loses nothing.",
    anlegenTipp: "Creates the class with all these details. The class code then applies to all the apps.",
    klasseAnlegen: "Create a class",
    zuerstKlasse: "First create a class - pupils sign in with its class code.",
    klasseVor: "Class ",
    codeFuerLernende: " · class code for the pupils",
    bearbeitenTipp: "Change the class name or class code.",
    klasseBearbeiten: "Edit class",
    bearbeiten: " Edit",
    loeschenTipp: "Deletes this class with all its pupils - after asking you to confirm.",
    klasseLoeschen: "Delete class",
    klasseLoeschenKnopf: " Delete class",
    codeAendernTipp:
      "2 to 12 characters, letters, digits, full stops or hyphens. If you change it, all the pupils in this class will sign in with the new code from then on.",
    speichernTipp: "Saves the new class name and class code.",
    speichern: "Save",
    abbrechenTipp: "Closes editing without changing anything.",
    abbrechen: "Cancel",
    codeWarnVor: "⚠️ If the code is changed,",
    codeWarnWer: (n: number) => (n === 1 ? "the pupil" : `all ${n} pupils`),
    codeWarnMitte: "in this class will use the ",
    codeWarnNeu: "new",
    codeWarnEnde: " code from then on.",
    // Glossar §3.14: genau so heisst der Schalter der Selbstlernenden.
    wochenbericht: " Weekly report by email (once a week, on Mondays, with the Tastenflow figures)",
    wochenberichtAnAdresse: "to ",
    lernende: "Learners (",
    druckenTipp: "Print the names, passwords and class code of the pupils you have just added.",
    drucken: " Print login details (",
    zurKlasse: "Add to class",
    nameTipp:
      "A first name is enough. It must be unique in this class - capital and small letters count as the same.",
    name: "Name",
    passwort: "Password",
    passwortBeispiel: "at least 4 characters",
    zufallTipp: "Creates an easy-to-type password of 5 letters and digits and puts it in the field.",
    zufall: "Random",
    kontakt: "Contact email (optional)",
    kontaktTipp:
      "If there is an address here, the pupil automatically gets their login details by email - when they are added and whenever the password is reset later.",
    kontaktBeispiel: "e.g. for parents and carers",
    womitAnfangen: "Tastenflow: where to start?",
    womitTipp:
      "What the pupil can already do. The keys up to here are unlocked from the start. The class's starting point is preselected.",
    hinzufuegenTipp:
      "Adds the pupil to this class with their name, password and - for Tastenflow - where they start. Everything else (language, assistive technology …) you set afterwards in the tab of the app concerned. The practice texts follow the class's year group (entered when the class was created; it moves up by itself every school year) - no year of birth is collected. Afterwards the focus is back in the name field.",
    hinzufuegen: "Add",
    excelTitel: "Many pupils at once (Excel)",
    kommenInKlasse: "The pupils will be added to the class ",
    vorlageTipp: (datei: string) =>
      `Downloads the Excel file “${datei}”: in the sheet “${BLATT_KINDER_EN}”, the class and date at the top, below that the “where to start” choice for all pupils and ${VORLAGE.kinderZeilen} rows to fill in; in the sheet “${BLATT_HINWEISE_EN}”, the instructions and the list of starting points. Fill in one row per pupil (name and password - if the password is left empty, the app creates one) and then import the file here; you will see a preview before anyone is added.`,
    vorlage: "Download template (Excel)",
    importTipp:
      "Opens the file picker for the completed template (.xlsx). A preview appears first - nobody is added until you confirm.",
    importieren: "Import pupils from Excel",
    listeTipp:
      "Downloads a Word file with the name, password and class code of ALL the pupils in this class - to print and hand out.",
    liste: "Download class list",
    vorschauVor: "Preview: “",
    vorschauNach: "”",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `${wort} will be added to the class ${klasse}. Nothing is saved until you choose “Add ${wort}”.`,
    vorschauKeiner: "No pupils will be added from this file.",
    escape: "Escape cancels.",
    passwortPunkt: " · password",
    passwortErzeugt: " (password created)",
    tastenflowPunkt: " · Tastenflow:",
    startDerKlasse: " (class starting point)",
    vorgabe: " (default)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "en", { one: (z) => `${z} row`, other: (z) => `${z} rows` }),
      " will be left out",
    ],
    korrigieren:
      "You can correct these rows in the file and import it again later. Anyone who has been added by then appears in the preview with “There is already a pupil with this name in the class.”",
    anlegenTippImport:
      "Adds the pupils from the preview to this class, one after another. Afterwards the focus is on the heading “Learners”, with the result below it.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      `Add ${mehrzahl(n, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` })}`,
    ],
    verwerfenTipp: "Discards the preview without adding anyone (Escape).",
    nochKeine:
      "No pupils yet. Add them above - they then sign in with the class code, their name and password (on any device).",
    wirdVerschoben: "Moving …",
    verschiebenLaeuft: "One moment - the move is still in progress.",
    zielFehlt: "Please enter the class code of the new class.",
    verschiebenFrage: (name: string, code: string, pruefung: string) =>
      `Move ${name} to the class with the class code ${code}?\n\n` +
      `- From then on, ${name} signs in with the new class code ${code}.\n` +
      `- The teachers of the new class will see ${name} and their progress.\n` +
      `- ${pruefung} results and messages stay with the previous class.\n` +
      `- After that, you will only see ${name} if you are also a teacher of the new class.`,
    nichtsVerschoben: "Nothing has been moved.",
    emailFalsch: "That doesn't look like an email address - or leave the field empty.",
    kontaktGespeichert: "Contact email saved.",
    kontaktEntfernt: "Contact email removed.",
    passwortTipp: (name: string) => `Opens and closes the field for a new password for ${name}.`,
    passwortAendern: "Change password",
    kontaktKnopfTipp: (name: string) =>
      `Opens and closes the field for ${name}'s contact email - if one is set, the pupil automatically gets their password by email whenever it is set or reset.`,
    kontaktKnopfName: (name: string) => `Contact email: ${name}`,
    kontaktKnopf: "Contact email",
    verschiebenTipp: (name: string) =>
      `Opens the field for moving ${name} to another class - including another teacher's class, if you know its class code.`,
    verschiebenName: (name: string) => `Move to another class: ${name}`,
    verschiebenKnopf: "Move to another class",
    loeschenKindTipp: (name: string) =>
      `Deletes ${name} and all their progress in every app - after asking you to confirm.`,
    loeschenKindName: (name: string) => `Delete ${name}`,
    loeschenKnopf: " Delete",
    kontaktVon: "Contact email for ",
    kontaktLeer: "leave empty = no email",
    kontaktSpeichernTipp: (name: string) =>
      `Saves ${name}'s contact email - leaving it empty removes it.`,
    schliessenTipp: "Closes the field without saving (Escape).",
    codeNeueKlasse: "Class code of the new class",
    folgenTipp: (name: string, pruefung: string) =>
      `Afterwards ${name} signs in with the new class code. The teachers of the new class will see ${name} and their progress. ${pruefung} results and messages stay with this class.`,
    zielBeispiel: "e.g. 4A",
    verschiebeTipp: (name: string) =>
      `Moves ${name} to the class with this class code - after asking you to confirm.`,
    verschieben: "Move",
    nichtVerschiebenTipp: "Closes the field without moving anyone (Escape).",
  },
  // ★ E11a (25.09.2026): durchgehend „vous" - der ganze Klassenbereich ist
  // Lehrkraft-Ansicht (F9).
  fr: {
    auswahlSpeichert: "Un instant - la sélection est en cours d'enregistrement.",
    keinProgramm: "Aucun programme choisi - le programme par lequel vous entrez est affiché.",
    auswahlGespeichert: "Sélection de programmes enregistrée.",
    programmeKlasse: "Programmes de cette classe",
    nurAnsicht: "Cela ne règle que ",
    ihreAnsicht: "votre affichage",
    nurAnsichtRest:
      " : les programmes décochés n'ont ici ni onglet ni colonne. Les élèves peuvent toujours ouvrir chaque programme - rien n'est verrouillé.",
    fehltName: "le nom de la classe",
    fehltCodeGueltig:
      "un code de classe valide (2 à 12 caractères : lettres, chiffres, point ou tiret)",
    fehltCode: "le code de classe",
    fehltSchulstufe: "le niveau scolaire",
    fehltStart: "le niveau de départ",
    und: " et ",
    fehltSatz: (liste: string) => `Il manque encore pour créer la classe : ${liste}.`,
    teilnehmer: (n: number) => `${n} ${n === 1 ? "participant" : "participants"}`,
    zeilen: (n: number) => `${n} ${n === 1 ? "ligne" : "lignes"}`,
    ersteSchritte: "Premiers pas",
    schrittKlasse: "Créer la classe",
    schrittKlasseText:
      "Nom, code de classe, niveau scolaire, langue, niveau de départ et Match de la classe. Le programme propose un code adapté au nom ; vous pouvez le modifier. Les élèves s'y connectent dans tous les programmes d'apprentissage.",
    schrittLernende: "Créer des élèves",
    schrittLernendeText:
      "Nom et mot de passe, rien de plus. Vous pourrez ensuite imprimer les identifiants sous forme de liste et les distribuer.",
    schrittProgramme: "Cocher les programmes",
    schrittProgrammeText:
      "Quels programmes d'apprentissage cette classe utilise-t-elle ? Cela ne règle que votre affichage - les élèves peuvent toujours ouvrir chaque programme.",
    erledigt: ", terminé",
    jetztDran: ", à faire maintenant",
    wirdGespeichert: "Enregistrement en cours …",
    angelegtAberFehlt: (name: string, liste: string) =>
      `La classe "${name}" est créée, mais ces indications n'ont pas été enregistrées : ` +
      `${liste}. Merci de le compléter sous "Réglages de la ` +
      `classe" dans l'onglet Tastenflow.`,
    klasseAngelegt: (name: string) => `Classe "${name}" créée.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Classe "${name}" créée - le code de classe "${gewuenscht.trim().toUpperCase()}" était ` +
      `déjà pris, le code de classe "${code}" s'applique donc maintenant.`,
    nameZuerst: "Merci de saisir d'abord un nom.",
    passwortKurz: "Le mot de passe doit compter au moins 4 caractères.",
    kontaktFalsch: "L'e-mail de contact ne semble pas correct - ou laissez le champ vide.",
    kindAngelegt: (name: string) => `Compte de ${name} créé.`,
    vorlageLaedt: (datei: string) => `Le modèle "${datei}" est en cours de téléchargement.`,
    vorlageFehler:
      "Le modèle n'a pas pu être créé. Merci de recharger la page et de réessayer.",
    listeWird: "La liste des participants est en cours de préparation.",
    listeLaedt: (klasse: string) => `La liste des participants de la classe ${klasse} est en cours de téléchargement.`,
    listeFehler:
      "La liste des participants n'a pas pu être créée. Merci de recharger la page et de réessayer.",
    nochSpeichern: "Un instant - l'enregistrement est en cours.",
    dateiNichtOffen: "Le fichier n'a pas pu être ouvert. Merci de le choisir à nouveau.",
    dateiLeer: (datei: string) =>
      `Dans "${datei}", aucun élève ne figure sous l'en-tête. Merci de saisir une ligne par élève et d'importer à nouveau le fichier.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Aperçu : ${anlegen} à créer` +
      (abgelehnt ? `, ${abgelehnt} non repris.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Aucun participant ne peut être créé à partir de ce fichier - les raisons figurent dans l'aperçu. Merci de corriger le fichier et de l'importer à nouveau.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Création en cours : ${nr} sur ${von} (${name}) …`,
    kontoNicht: "Le compte n'a pas pu être créé.",
    ergebnisAngelegt: (anzahl: string) => `${anzahl} créés.`,
    ergebnisNicht: (n: number, liste: string) => `Non créés (${n}) : ${liste}.`,
    ergebnisDrucken: 'Les noms et mots de passe figurent sous "Imprimer les identifiants".',
    anlegenLaeuft: "La création est déjà en cours - merci d'attendre qu'elle se termine.",
    importAbgebrochen: "Import annulé - aucun participant n'a été créé.",
    kindLoeschenFrage: (name: string) =>
      `Vraiment supprimer "${name}" ? Tous les progrès dans TOUS les ` +
      `programmes d'apprentissage sont perdus. Cela ne peut pas être annulé.`,
    kindGeloescht: (name: string) => `Compte de ${name} supprimé.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Vraiment supprimer la classe "${name}" ?` +
      (n > 0
        ? ` Cela supprime aussi définitivement ${n} ${n === 1 ? "élève" : "élèves"} ` +
          `et leurs progrès.`
        : "") +
      " Cela ne peut pas être annulé.",
    klasseGeloescht: (name: string) => `Classe "${name}" supprimée.`,
    klassennameFehlt: "Merci de saisir un nom de classe.",
    codeFehlt: "Saisissez un code de classe - c'est avec ce code que les élèves se connectent.",
    codeUngueltig:
      "Le code de classe peut compter de 2 à 12 caractères : lettres, chiffres, point ou tiret.",
    klasseGespeichert: "Classe enregistrée.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} est maintenant dans la classe "${klasse}" ` +
      `(code de classe ${code}) et se connecte désormais avec ce code.`,
    wochenberichtAn: "Bilan hebdomadaire activé.",
    wochenberichtAus: "Bilan hebdomadaire désactivé.",
    druckBlockiert: "La fenêtre d'impression a été bloquée. Merci d'autoriser les fenêtres pop-up pour cette page.",
    klassen: "Classes",
    klasseWaehlenTipp: (name: string) => `Choisit la classe ${name} - tous les onglets affichent alors ses élèves.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Classe ${name}${gewaehlt ? ", choisie" : ""}`,
    neueKlasse: "Créer une nouvelle classe",
    neueKlasseInhalt: "- Nom, code de classe, niveau scolaire, langue, niveau de départ, Match de la classe",
    neuProgrammeTitel: "Quels programmes la classe utilise-t-elle ?",
    neuProgrammeHinweis:
      "Cela ne règle que votre affichage - les élèves peuvent toujours ouvrir chaque programme. Les indications pour Tastenflow (niveau scolaire, langue, niveau de départ, Match de la classe) n'apparaissent que si Tastenflow est coché.",
    neuProgrammName: (label: string) => `${label} pour la nouvelle classe`,
    fehltProgramm: "au moins un programme",
    klassenname: "Nom de la classe",
    klassennameBeispiel: "par ex. 3b ou cours préparatoire",
    klassencode: "Code de classe",
    klassencodeTipp:
      "Obligatoire. Les élèves se connectent avec ce code - dans chaque programme d'apprentissage, avec le même nom et mot de passe. Il est proposé en fonction du nom et peut être modifié : 2 à 12 caractères, lettres, chiffres, point ou tiret.",
    // ★ E11a-5 (Feinschliff-Liste): kein österreichischer Klassenname -
    // ein französischer Klassenname, als gültiger Code geschrieben
    // (`KLASSENCODE_RE`: kein Leerzeichen).
    klassencodeBeispiel: "par ex. CM2-B",
    fuerTastenflowTipp: `Ces indications ne valent que pour la dactylographie à 10 doigts (Tastenflow) ; les autres programmes ne les modifient pas. Modifiable plus tard sous "Réglages de la classe" dans l'onglet Tastenflow.`,
    fuerTastenflow: "Pour Tastenflow",
    bezugNeu: "de la nouvelle classe",
    bitteWaehlen: "Merci de choisir",
    startHinweis: "ce que les élèves savent déjà faire - vaut aussi pour ceux qui arrivent plus tard",
    startSrHinweis:
      "Obligatoire. Les touches jusqu'à ce niveau sont débloquées dès le départ pour chaque élève de cette classe - " +
      "aussi pour ceux qui arrivent plus tard. Un élève déjà plus avancé ne perd rien.",
    anlegenTipp: "Crée la classe avec toutes les indications. Le code de classe vaut alors pour tous les programmes d'apprentissage.",
    klasseAnlegen: "Créer la classe",
    zuerstKlasse: "Créez d'abord une classe - les élèves s'y connectent avec son code de classe.",
    klasseVor: "Classe ",
    codeFuerLernende: " - code de classe pour les élèves",
    bearbeitenTipp: "Modifier le nom ou le code de la classe.",
    klasseBearbeiten: "Modifier la classe",
    bearbeiten: " Modifier",
    loeschenTipp: "Supprimer cette classe avec tous ses élèves - après confirmation.",
    klasseLoeschen: "Supprimer la classe",
    klasseLoeschenKnopf: " Supprimer la classe",
    codeAendernTipp:
      "2 à 12 caractères, lettres, chiffres, point ou tiret. En le modifiant, tous les élèves de cette classe se connecteront désormais avec le nouveau code.",
    speichernTipp: "Applique le nouveau nom et le nouveau code de classe.",
    speichern: "Enregistrer",
    abbrechenTipp: "Ferme l'édition sans rien modifier.",
    abbrechen: "Annuler",
    codeWarnVor: "⚠️ Si le code est modifié, ",
    codeWarnWer: (n: number) => (n === 1 ? "l'élève de cette classe devra" : `les ${n} élèves de cette classe devront`),
    codeWarnMitte: "désormais utiliser le ",
    codeWarnNeu: "nouveau",
    codeWarnEnde: " code.",
    wochenbericht: " Bilan hebdomadaire par e-mail (une fois par semaine, le lundi, avec les chiffres Tastenflow)",
    wochenberichtAnAdresse: "à ",
    lernende: "Élèves (",
    druckenTipp: "Imprimer les noms, mots de passe et code de classe des élèves qui viennent d'être créés.",
    drucken: " Imprimer les identifiants (",
    zurKlasse: "Ajouter à la classe",
    nameTipp: "Le prénom suffit. Il doit être unique dans cette classe - majuscules et minuscules ne comptent pas.",
    name: "Nom",
    passwort: "Mot de passe",
    passwortBeispiel: "4 caractères min.",
    zufallTipp: "Crée un mot de passe facile à taper avec 5 lettres et chiffres et le place dans le champ.",
    zufall: "Aléatoire",
    kontakt: "E-mail de contact (facultatif)",
    kontaktTipp:
      "Si une adresse est indiquée ici, l'élève reçoit ses identifiants automatiquement par e-mail - à la création et à chaque réinitialisation ultérieure.",
    kontaktBeispiel: "par ex. pour les responsables légaux",
    womitAnfangen: "Tastenflow : par où commencer ?",
    womitTipp:
      "Ce que l'élève sait déjà faire. Les touches jusque-là sont débloquées dès le départ. Le niveau de départ de la classe est présélectionné.",
    hinzufuegenTipp:
      "Crée l'élève avec nom, mot de passe et - pour Tastenflow - le point de départ dans cette classe. Tout le reste (langue, aide technique …) se règle ensuite dans l'onglet de chaque programme. Les textes d'exercice suivent le niveau scolaire de la classe (indiqué à la création de la classe, il avance ensuite tout seul à chaque année scolaire) - aucune année de naissance n'est demandée. Le focus revient ensuite dans le champ du nom.",
    hinzufuegen: "Ajouter",
    excelTitel: "Beaucoup de participants à la fois (Excel)",
    kommenInKlasse: "Les participants seront ajoutés à la classe ",
    vorlageTipp: (datei: string) =>
      `Télécharge le fichier Excel "${datei}" : dans la feuille "Participants" la classe et la date en haut, en dessous le choix "par où commencer" pour tous les participants et 40 lignes à remplir ; dans la feuille "Remarques" le mode d'emploi et la liste des niveaux de départ. Saisissez une ligne par participant (nom et mot de passe - laissé vide, le programme en crée un) et importez ensuite le fichier ici ; un aperçu s'affiche avant la création.`,
    vorlage: "Télécharger le modèle (Excel)",
    importTipp:
      "Ouvre la sélection de fichier pour le modèle rempli (.xlsx). Un aperçu s'affiche d'abord - la création n'a lieu qu'après votre confirmation.",
    importieren: "Importer des participants depuis Excel",
    listeTipp:
      "Télécharge un fichier Word avec le nom, le mot de passe et le code de classe de TOUS les élèves de cette classe - à imprimer et à distribuer.",
    liste: "Télécharger la liste des participants",
    vorschauVor: 'Aperçu : "',
    vorschauNach: '"',
    vorschauSatz: (anzahl: number, wort: string, klasse: string) =>
      `${wort} ${anzahl === 1 ? "va être créé" : "vont être créés"} dans la classe ${klasse}. ` +
      `L'enregistrement n'a lieu qu'après avoir choisi de créer ${wort}.`,
    vorschauKeiner: "Aucun participant ne sera créé à partir de ce fichier.",
    escape: "Échap annule.",
    passwortPunkt: " - Mot de passe",
    passwortErzeugt: " (mot de passe généré)",
    tastenflowPunkt: " - Tastenflow :",
    startDerKlasse: " (niveau de départ de la classe)",
    vorgabe: " (par défaut)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      `${n} ${n === 1 ? "ligne" : "lignes"}`,
      " ",
      n === 1 ? "n'est" : "ne sont",
      ` pas reprise${n === 1 ? "" : "s"}`,
    ],
    korrigieren:
      'Vous pouvez corriger ces lignes dans le fichier et les importer à nouveau plus tard. Qui est déjà créé apparait dans l\'aperçu avec "Ce nom existe déjà dans la classe."',
    anlegenTippImport:
      'Crée les élèves de l\'aperçu les uns après les autres dans cette classe. Le focus revient ensuite sur le titre "Élèves", avec le résultat en dessous.',
    anlegenKnopf: (n: number): readonly Teil[] => ["Créer ", `${n} participants`],
    verwerfenTipp: "Annule l'aperçu, sans créer aucun élève (Échap).",
    nochKeine:
      "Pas encore d'élèves. Créez-en ci-dessus - ils se connectent ensuite avec le code de classe, le nom et le mot de passe (depuis n'importe quel appareil).",
    wirdVerschoben: "Déplacement en cours …",
    verschiebenLaeuft: "Un instant - le déplacement est en cours.",
    zielFehlt: "Merci de saisir le code de la nouvelle classe.",
    verschiebenFrage: (name: string, code: string, pruefung: string) =>
      `Déplacer ${name} vers la classe avec le code ${code} ?\n\n` +
      `- ${name} se connectera ensuite avec le nouveau code de classe ${code}.\n` +
      `- Le personnel enseignant de la nouvelle classe voit ${name} et ses progrès.\n` +
      `- Les résultats ${pruefung} et les messages restent dans l'ancienne classe.\n` +
      `- Vous ne verrez plus ${name} par la suite, sauf si vous enseignez aussi dans la nouvelle classe.`,
    nichtsVerschoben: "Rien n'a été déplacé.",
    emailFalsch: "Cela ne ressemble pas à une adresse e-mail - ou laissez le champ vide.",
    kontaktGespeichert: "E-mail de contact enregistré.",
    kontaktEntfernt: "E-mail de contact retiré.",
    passwortTipp: (name: string) => `Déplie et replie le champ pour un nouveau mot de passe de ${name}.`,
    passwortAendern: "Changer le mot de passe",
    kontaktKnopfTipp: (name: string) =>
      `Déplie et replie le champ pour l'e-mail de contact de ${name} - s'il est renseigné, l'élève reçoit son mot de passe automatiquement par e-mail dès qu'il est défini ou réinitialisé.`,
    kontaktKnopfName: (name: string) => `E-mail de contact : ${name}`,
    kontaktKnopf: "E-mail de contact",
    verschiebenTipp: (name: string) =>
      `Déplie le champ pour déplacer ${name} vers une autre classe - même celle d'un ou d'une collègue, si vous connaissez son code de classe.`,
    verschiebenName: (name: string) => `Déplacer vers une autre classe : ${name}`,
    verschiebenKnopf: "Déplacer vers une autre classe",
    loeschenKindTipp: (name: string) =>
      `Supprime ${name} et ses progrès dans tous les programmes d'apprentissage - après confirmation.`,
    loeschenKindName: (name: string) => `Supprimer ${name}`,
    loeschenKnopf: " Supprimer",
    kontaktVon: "E-mail de contact de ",
    kontaktLeer: "laisser vide = pas d'e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Enregistre l'e-mail de contact de ${name} - laisser vide le retire à nouveau.`,
    schliessenTipp: "Ferme le champ sans enregistrer (Échap).",
    codeNeueKlasse: "Code de la nouvelle classe",
    folgenTipp: (name: string, pruefung: string) =>
      `${name} se connectera ensuite avec le nouveau code de classe. Le personnel enseignant de la nouvelle classe voit ${name} et ses progrès. Les résultats ${pruefung} et les messages restent dans cette classe.`,
    zielBeispiel: "par ex. 4A",
    verschiebeTipp: (name: string) =>
      `Déplace ${name} vers la classe avec ce code de classe, après confirmation.`,
    verschieben: "Déplacer",
    nichtVerschiebenTipp: "Ferme le champ sans rien déplacer (Échap).",
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted; „estudiante"/
  // „participante" sind geschlechtsneutral (Bauplan S10).
  es: {
    auswahlSpeichert: "Un momento - se está guardando la selección.",
    keinProgramm: "Ningún programa elegido - se muestra el programa por el que ha entrado.",
    auswahlGespeichert: "Selección de programas guardada.",
    programmeKlasse: "Programas de esta clase",
    nurAnsicht: "Esto solo ajusta ",
    ihreAnsicht: "su vista",
    nurAnsichtRest:
      ": los programas sin marcar no tienen aquí ni pestaña ni columna. El alumnado puede abrir siempre cualquier programa - no se bloquea nada.",
    fehltName: "el nombre de la clase",
    fehltCodeGueltig:
      "un código de clase válido (de 2 a 12 caracteres: letras, números, punto o guion)",
    fehltCode: "el código de clase",
    fehltSchulstufe: "el curso",
    fehltStart: "el nivel de partida",
    und: " y ",
    fehltSatz: (liste: string) => `Para crear la clase todavía falta: ${liste}.`,
    teilnehmer: (n: number) => `${n} ${n === 1 ? "participante" : "participantes"}`,
    zeilen: (n: number) => `${n} ${n === 1 ? "fila" : "filas"}`,
    ersteSchritte: "Primeros pasos",
    schrittKlasse: "Crear la clase",
    schrittKlasseText:
      "Nombre, código de clase, curso, idioma, nivel de partida y Competición de la clase. El programa propone un código a partir del nombre; puede cambiarlo. El alumnado inicia sesión con él en todos los programas de aprendizaje.",
    schrittLernende: "Crear estudiantes",
    schrittLernendeText:
      "Nombre y contraseña, nada más. Después puede imprimir los datos de acceso como lista y repartirlos.",
    schrittProgramme: "Marcar los programas",
    schrittProgrammeText:
      "¿Qué programas de aprendizaje usa esta clase? Esto solo ajusta su vista - el alumnado puede abrir siempre cualquier programa.",
    erledigt: ", hecho",
    jetztDran: ", ahora toca",
    wirdGespeichert: "Guardando …",
    angelegtAberFehlt: (name: string, liste: string) =>
      `La clase "${name}" está creada, pero estos datos no se guardaron: ` +
      `${liste}. Complételos en "Configuración de la ` +
      `clase", en la pestaña Tastenflow.`,
    klasseAngelegt: (name: string) => `Clase "${name}" creada.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Clase "${name}" creada - el código de clase "${gewuenscht.trim().toUpperCase()}" ya ` +
      `estaba ocupado, por eso ahora vale el código de clase "${code}".`,
    nameZuerst: "Escriba primero un nombre, por favor.",
    passwortKurz: "La contraseña debe tener al menos 4 caracteres.",
    kontaktFalsch: "El correo de contacto no parece correcto - o deje el campo vacío.",
    kindAngelegt: (name: string) => `Cuenta de ${name} creada.`,
    vorlageLaedt: (datei: string) => `Se está descargando la plantilla "${datei}".`,
    vorlageFehler:
      "No se pudo crear la plantilla. Vuelva a cargar la página y a intentarlo, por favor.",
    listeWird: "Se está preparando la lista de participantes.",
    listeLaedt: (klasse: string) => `Se está descargando la lista de participantes de la clase ${klasse}.`,
    listeFehler:
      "No se pudo crear la lista de participantes. Vuelva a cargar la página y a intentarlo, por favor.",
    nochSpeichern: "Un momento - se está guardando.",
    dateiNichtOffen: "No se pudo abrir el archivo. Elíjalo otra vez, por favor.",
    dateiLeer: (datei: string) =>
      `En "${datei}" no hay ningún estudiante debajo del encabezado. Escriba una fila por estudiante y vuelva a importar el archivo, por favor.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Vista previa: ${anlegen} para crear` +
      (abgelehnt ? `, ${abgelehnt} sin incluir.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Con este archivo no se puede crear a nadie - los motivos están en la vista previa. Corrija el archivo y vuelva a importarlo, por favor.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Creando: ${nr} de ${von} (${name}) …`,
    kontoNicht: "No se pudo crear la cuenta.",
    ergebnisAngelegt: (anzahl: string) => `${anzahl} creados.`,
    ergebnisNicht: (n: number, liste: string) => `Sin crear (${n}): ${liste}.`,
    ergebnisDrucken: 'Los nombres y las contraseñas están en "Imprimir los datos de acceso".',
    anlegenLaeuft: "La creación ya está en marcha - espere a que termine, por favor.",
    importAbgebrochen: "Importación cancelada - no se ha creado a nadie.",
    kindLoeschenFrage: (name: string) =>
      `¿Eliminar de verdad a "${name}"? Se pierde todo el progreso en TODOS los ` +
      `programas de aprendizaje. No se puede deshacer.`,
    kindGeloescht: (name: string) => `Cuenta de ${name} eliminada.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `¿Eliminar de verdad la clase "${name}"?` +
      (n > 0
        ? ` Así se eliminan también para siempre ${n} ${n === 1 ? "estudiante" : "estudiantes"} ` +
          `y su progreso.`
        : "") +
      " No se puede deshacer.",
    klasseGeloescht: (name: string) => `Clase "${name}" eliminada.`,
    klassennameFehlt: "Escriba un nombre de clase, por favor.",
    codeFehlt: "Escriba un código de clase - el alumnado inicia sesión con él.",
    codeUngueltig:
      "El código de clase puede tener de 2 a 12 caracteres: letras, números, punto o guion.",
    klasseGespeichert: "Clase guardada.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} está ahora en la clase "${klasse}" ` +
      `(código de clase ${code}) y desde ahora inicia sesión con ese código.`,
    wochenberichtAn: "Resumen semanal activado.",
    wochenberichtAus: "Resumen semanal desactivado.",
    druckBlockiert: "La ventana de impresión se bloqueó. Permita las ventanas emergentes para esta página, por favor.",
    klassen: "Clases",
    klasseWaehlenTipp: (name: string) => `Elige la clase ${name} - todas las pestañas muestran entonces a su alumnado.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Clase ${name}${gewaehlt ? ", elegida" : ""}`,
    neueKlasse: "Crear una clase nueva",
    neueKlasseInhalt: "- Nombre, código de clase, curso, idioma, nivel de partida, Competición de la clase",
    neuProgrammeTitel: "¿Qué programas usa la clase?",
    neuProgrammeHinweis:
      "Esto solo ordena su vista: el alumnado puede abrir cualquier programa. Los datos de Tastenflow (curso, idioma, nivel de partida, Competición de la clase) solo aparecen si Tastenflow está marcado.",
    neuProgrammName: (label: string) => `${label} para la clase nueva`,
    fehltProgramm: "al menos un programa",
    klassenname: "Nombre de la clase",
    klassennameBeispiel: "p. ej. 3.º B o Grupo Girasoles",
    klassencode: "Código de clase",
    klassencodeTipp:
      "Obligatorio. El alumnado inicia sesión con este código - en cada programa de aprendizaje, con el mismo nombre y contraseña. Se propone a partir del nombre y se puede cambiar: de 2 a 12 caracteres, letras, números, punto o guion.",
    klassencodeBeispiel: "p. ej. 3B-SOL",
    fuerTastenflowTipp: `Estos datos solo valen para la mecanografía con diez dedos (Tastenflow); los demás programas no los cambian. Se pueden cambiar más tarde en "Configuración de la clase", en la pestaña Tastenflow.`,
    fuerTastenflow: "Para Tastenflow",
    bezugNeu: "de la clase nueva",
    bitteWaehlen: "Elija, por favor",
    startHinweis: "lo que el alumnado ya sabe hacer - vale también para quienes se incorporen más tarde",
    startSrHinweis:
      "Obligatorio. Las teclas hasta este nivel están desbloqueadas desde el principio para cada estudiante de esta clase - " +
      "también para quienes se incorporen más tarde. Quien ya va más adelantado no pierde nada.",
    anlegenTipp: "Crea la clase con todos los datos. El código de clase vale entonces para todos los programas de aprendizaje.",
    klasseAnlegen: "Crear la clase",
    zuerstKlasse: "Cree primero una clase - el alumnado inicia sesión con su código de clase.",
    klasseVor: "Clase ",
    codeFuerLernende: " - código de clase para el alumnado",
    bearbeitenTipp: "Cambiar el nombre o el código de la clase.",
    klasseBearbeiten: "Editar la clase",
    bearbeiten: " Editar",
    loeschenTipp: "Eliminar esta clase con todo su alumnado - tras una confirmación.",
    klasseLoeschen: "Eliminar la clase",
    klasseLoeschenKnopf: " Eliminar la clase",
    codeAendernTipp:
      "De 2 a 12 caracteres, letras, números, punto o guion. Si lo cambia, todo el alumnado de esta clase iniciará sesión desde entonces con el código nuevo.",
    speichernTipp: "Aplica el nombre nuevo y el código de clase nuevo.",
    speichern: "Guardar",
    abbrechenTipp: "Cierra la edición sin cambiar nada.",
    abbrechen: "Cancelar",
    codeWarnVor: "⚠️ Si se cambia el código, ",
    codeWarnWer: (n: number) => (n === 1 ? "la persona de esta clase tendrá" : `los ${n} estudiantes de esta clase tendrán`),
    codeWarnMitte: "que usar desde entonces el código ",
    codeWarnNeu: "nuevo",
    codeWarnEnde: ".",
    wochenbericht: " Resumen semanal por correo electrónico (una vez por semana, el lunes, con las cifras de Tastenflow)",
    wochenberichtAnAdresse: "a ",
    lernende: "Estudiantes (",
    druckenTipp: "Imprimir los nombres, las contraseñas y el código de clase de quienes se acaban de crear.",
    drucken: " Imprimir los datos de acceso (",
    zurKlasse: "Añadir a la clase",
    nameTipp: "Basta con el nombre de pila. Tiene que ser único en esta clase - mayúsculas y minúsculas no cuentan.",
    name: "Nombre",
    passwort: "Contraseña",
    passwortBeispiel: "mín. 4 caracteres",
    zufallTipp: "Crea una contraseña fácil de escribir con 5 letras y números y la pone en el campo.",
    zufall: "Al azar",
    kontakt: "Correo de contacto (opcional)",
    kontaktTipp:
      "Si aquí se indica una dirección, la persona recibe sus datos de acceso automáticamente por correo electrónico - al crearla y cada vez que se restablezcan después.",
    kontaktBeispiel: "p. ej. para la familia",
    womitAnfangen: "Tastenflow: ¿por dónde empieza?",
    womitTipp:
      "Lo que ya sabe hacer. Las teclas hasta ese punto están desbloqueadas desde el principio. Está preseleccionado el nivel de partida de la clase.",
    hinzufuegenTipp:
      "Crea a la persona con nombre, contraseña y - para Tastenflow - el punto de partida en esta clase. Todo lo demás (idioma, ayudas técnicas …) se ajusta después en la pestaña de cada programa. Los textos de práctica siguen el curso de la clase (indicado al crear la clase; después avanza solo con cada curso escolar) - no se pide ningún año de nacimiento. Después, el foco vuelve al campo del nombre.",
    hinzufuegen: "Añadir",
    excelTitel: "Muchos participantes a la vez (Excel)",
    kommenInKlasse: "Los participantes se añaden a la clase ",
    vorlageTipp: (datei: string) =>
      `Descarga el archivo de Excel "${datei}": en la hoja "Participantes", arriba la clase y la fecha, debajo la elección "por dónde empezar" para todos y 40 filas para rellenar; en la hoja "Indicaciones", las instrucciones y la lista de los niveles de partida. Escriba una fila por participante (nombre y contraseña - si se deja vacía, el programa crea una) y después importe el archivo aquí; antes de crear nada se muestra una vista previa.`,
    vorlage: "Descargar la plantilla (Excel)",
    importTipp:
      "Abre la selección de archivo para la plantilla rellenada (.xlsx). Primero se muestra una vista previa - solo se crea algo cuando usted lo confirma.",
    importieren: "Importar participantes desde Excel",
    listeTipp:
      "Descarga un archivo de Word con el nombre, la contraseña y el código de clase de TODO el alumnado de esta clase - para imprimir y repartir.",
    liste: "Descargar la lista de participantes",
    vorschauVor: 'Vista previa: "',
    vorschauNach: '"',
    vorschauSatz: (anzahl: number, wort: string, klasse: string) =>
      `Se ${anzahl === 1 ? "va a crear" : "van a crear"} ${wort} en la clase ${klasse}. ` +
      `Solo se guarda cuando elija crear ${wort}.`,
    vorschauKeiner: "Con este archivo no se creará a nadie.",
    escape: "Esc cancela.",
    passwortPunkt: " - Contraseña",
    passwortErzeugt: " (contraseña generada)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (nivel de partida de la clase)",
    vorgabe: " (predeterminado)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      `${n} ${n === 1 ? "fila" : "filas"}`,
      " ",
      n === 1 ? "no se incluye" : "no se incluyen",
    ],
    korrigieren:
      'Puede corregir estas filas en el archivo y volver a importarlas más tarde. Quien ya está creado aparece en la vista previa con "Este nombre ya existe en la clase."',
    anlegenTippImport:
      'Crea una tras otra en esta clase a las personas de la vista previa. Después, el foco vuelve al título "Estudiantes", con el resultado debajo.',
    anlegenKnopf: (n: number): readonly Teil[] => ["Crear ", `${n} participantes`],
    verwerfenTipp: "Cancela la vista previa sin crear a nadie (Esc).",
    nochKeine:
      "Todavía no hay estudiantes. Créelos arriba - después inician sesión con el código de clase, el nombre y la contraseña (desde cualquier dispositivo).",
    wirdVerschoben: "Moviendo …",
    verschiebenLaeuft: "Un momento - se está moviendo.",
    zielFehlt: "Escriba el código de la clase nueva, por favor.",
    verschiebenFrage: (name: string, code: string, pruefung: string) =>
      `¿Mover a ${name} a la clase con el código ${code}?\n\n` +
      `- ${name} iniciará sesión después con el nuevo código de clase ${code}.\n` +
      `- El profesorado de la clase nueva ve a ${name} y su progreso.\n` +
      `- Los resultados del ${pruefung} y los mensajes se quedan en la clase anterior.\n` +
      `- Usted ya no verá a ${name}, salvo que también dé clase en la clase nueva.`,
    nichtsVerschoben: "No se ha movido nada.",
    emailFalsch: "Eso no parece una dirección de correo electrónico - o deje el campo vacío.",
    kontaktGespeichert: "Correo de contacto guardado.",
    kontaktEntfernt: "Correo de contacto quitado.",
    passwortTipp: (name: string) => `Despliega y pliega el campo para una contraseña nueva de ${name}.`,
    passwortAendern: "Cambiar la contraseña",
    kontaktKnopfTipp: (name: string) =>
      `Despliega y pliega el campo para el correo de contacto de ${name} - si está rellenado, la persona recibe su contraseña automáticamente por correo en cuanto se fija o se restablece.`,
    kontaktKnopfName: (name: string) => `Correo de contacto: ${name}`,
    kontaktKnopf: "Correo de contacto",
    verschiebenTipp: (name: string) =>
      `Despliega el campo para mover a ${name} a otra clase - también a la de otra persona docente, si conoce su código de clase.`,
    verschiebenName: (name: string) => `Mover a otra clase: ${name}`,
    verschiebenKnopf: "Mover a otra clase",
    loeschenKindTipp: (name: string) =>
      `Elimina a ${name} y su progreso en todos los programas de aprendizaje - tras una confirmación.`,
    loeschenKindName: (name: string) => `Eliminar a ${name}`,
    loeschenKnopf: " Eliminar",
    kontaktVon: "Correo de contacto de ",
    kontaktLeer: "vacío = sin correo",
    kontaktSpeichernTipp: (name: string) =>
      `Guarda el correo de contacto de ${name} - si se deja vacío, se vuelve a quitar.`,
    schliessenTipp: "Cierra el campo sin guardar (Esc).",
    codeNeueKlasse: "Código de la clase nueva",
    folgenTipp: (name: string, pruefung: string) =>
      `${name} iniciará sesión después con el nuevo código de clase. El profesorado de la clase nueva ve a ${name} y su progreso. Los resultados del ${pruefung} y los mensajes se quedan en esta clase.`,
    zielBeispiel: "p. ej. 4A",
    verschiebeTipp: (name: string) =>
      `Mueve a ${name} a la clase con este código de clase, tras una confirmación.`,
    verschieben: "Mover",
    nichtVerschiebenTipp: "Cierra el campo sin mover nada (Esc).",
  },
  // ★ O-IT (02.10.2026): Lehrkraft neutral (Infinitiv, „si"), nie „Lei" (Regel 1);
  // „alunni" als Sammelwort, die einzelne „persona" (Regel 2); „codice classe",
  // „classe frequentata", „punto di partenza", „Gara di classe" (Glossar §2.5/§2.6).
  // Mengen ohne Partizip, das sich nach Zahl und Geschlecht richten müsste
  // („Creati: 3 alunni.").
  it: {
    auswahlSpeichert: "Un momento - la scelta viene salvata.",
    keinProgramm: "Nessun programma scelto - si vede il programma da cui si è entrati.",
    auswahlGespeichert: "Scelta dei programmi salvata.",
    programmeKlasse: "Programmi di questa classe",
    nurAnsicht: "Questo regola solo ",
    ihreAnsicht: "la propria vista",
    nurAnsichtRest:
      ": i programmi non selezionati qui non hanno né scheda né colonna. Gli alunni possono sempre aprire ogni programma - non si blocca niente.",
    fehltName: "il nome della classe",
    fehltCodeGueltig:
      "un codice classe valido (da 2 a 12 caratteri: lettere, numeri, punto o trattino)",
    fehltCode: "il codice classe",
    fehltSchulstufe: "la classe frequentata",
    fehltStart: "il punto di partenza",
    und: " e ",
    fehltSatz: (liste: string) => `Per creare la classe manca ancora: ${liste}.`,
    teilnehmer: (n: number) => (n === 1 ? "1 persona" : `${n} alunni`),
    zeilen: (n: number) => `${n} ${n === 1 ? "riga" : "righe"}`,
    ersteSchritte: "Primi passi",
    schrittKlasse: "Creare la classe",
    schrittKlasseText:
      "Nome, codice classe, classe frequentata, lingua, punto di partenza e Gara di classe. Il programma propone un codice a partire dal nome; si può cambiare. Con questo codice gli alunni accedono a tutti i programmi di apprendimento.",
    schrittLernende: "Aggiungere gli alunni",
    schrittLernendeText:
      "Nome e password, nient'altro. Poi si possono stampare i dati di accesso come elenco e distribuirli.",
    schrittProgramme: "Selezionare i programmi",
    schrittProgrammeText:
      "Quali programmi di apprendimento usa questa classe? Questo regola solo la propria vista - gli alunni possono sempre aprire ogni programma.",
    erledigt: ", fatto",
    jetztDran: ", ora tocca a questo",
    wirdGespeichert: "Salvataggio in corso...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `La classe "${name}" è creata, ma questi dati non sono stati salvati: ` +
      `${liste}. Si possono completare in "Impostazioni della ` +
      `classe", nella scheda Tastenflow.`,
    klasseAngelegt: (name: string) => `Classe "${name}" creata.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Classe "${name}" creata - il codice classe "${gewuenscht.trim().toUpperCase()}" era ` +
      `già occupato, per questo ora vale il codice classe "${code}".`,
    nameZuerst: "Prima scrivere un nome.",
    passwortKurz: "La password deve avere almeno 4 caratteri.",
    kontaktFalsch: "L'email di contatto non sembra corretta - oppure lasciare il campo vuoto.",
    kindAngelegt: (name: string) => `Account di ${name} creato.`,
    vorlageLaedt: (datei: string) => `Il modello "${datei}" viene scaricato.`,
    vorlageFehler:
      "Non è stato possibile creare il modello. Ricaricare la pagina e riprovare, per favore.",
    listeWird: "L'elenco della classe è in preparazione.",
    listeLaedt: (klasse: string) => `L'elenco della classe ${klasse} viene scaricato.`,
    listeFehler:
      "Non è stato possibile creare l'elenco della classe. Ricaricare la pagina e riprovare, per favore.",
    nochSpeichern: "Un momento - il salvataggio è in corso.",
    dateiNichtOffen: "Non è stato possibile aprire il file. Sceglierlo di nuovo, per favore.",
    dateiLeer: (datei: string) =>
      `In "${datei}" non c'è nessuna persona sotto l'intestazione. Scrivere una riga per persona e importare di nuovo il file, per favore.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Anteprima: da aggiungere ${anlegen}` +
      (abgelehnt ? `; fuori dall'importazione ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Con questo file non si può aggiungere nessuno - i motivi sono nell'anteprima. Correggere il file e importarlo di nuovo, per favore.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Creazione: ${nr} su ${von} (${name})...`,
    kontoNicht: "Non è stato possibile creare l'account.",
    ergebnisAngelegt: (anzahl: string) => `Creati: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Non creati (${n}): ${liste}.`,
    ergebnisDrucken: `Nomi e password sono in "Stampa i dati di accesso".`,
    anlegenLaeuft: "La creazione è già in corso - attendere la fine, per favore.",
    importAbgebrochen: "Importazione annullata - non è stato aggiunto nessuno.",
    kindLoeschenFrage: (name: string) =>
      `Eliminare davvero "${name}"? Si perdono tutti i progressi in TUTTI i ` +
      `programmi di apprendimento. Non si può annullare.`,
    kindGeloescht: (name: string) => `Account di ${name} eliminato.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Eliminare davvero la classe "${name}"?` +
      (n > 0
        ? ` Così si eliminano per sempre anche ${n === 1 ? "1 persona" : `${n} alunni`} ` +
          `e i loro progressi.`
        : "") +
      " Non si può annullare.",
    klasseGeloescht: (name: string) => `Classe "${name}" eliminata.`,
    klassennameFehlt: "Scrivere un nome per la classe, per favore.",
    codeFehlt: "Scrivere un codice classe - gli alunni accedono con questo codice.",
    codeUngueltig:
      "Il codice classe può avere da 2 a 12 caratteri: lettere, numeri, punto o trattino.",
    klasseGespeichert: "Classe salvata.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} ora è nella classe "${klasse}" ` +
      `(codice classe ${code}) e da adesso accede con questo codice.`,
    wochenberichtAn: "Resoconto settimanale attivato.",
    wochenberichtAus: "Resoconto settimanale disattivato.",
    druckBlockiert: "La finestra di stampa è stata bloccata. Consentire le finestre pop-up per questa pagina, per favore.",
    klassen: "Classi",
    klasseWaehlenTipp: (name: string) => `Sceglie la classe ${name} - tutte le schede mostrano poi i suoi alunni.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Classe ${name}${gewaehlt ? ", scelta" : ""}`,
    neueKlasse: "Creare una classe nuova",
    neueKlasseInhalt: "- Nome, codice classe, classe frequentata, lingua, punto di partenza, Gara di classe",
    neuProgrammeTitel: "Quali programmi usa la classe?",
    neuProgrammeHinweis:
      "Questo ordina solo la visualizzazione: gli alunni possono comunque aprire ogni programma. Le indicazioni per Tastenflow (classe frequentata, lingua, punto di partenza, Gara di classe) compaiono solo se Tastenflow è selezionato.",
    neuProgrammName: (label: string) => `${label} per la classe nuova`,
    fehltProgramm: "almeno un programma",
    klassenname: "Nome della classe",
    klassennameBeispiel: "ad es. 3B o Gruppo Girasoli",
    klassencode: "Codice classe",
    klassencodeTipp:
      "Obbligatorio. Gli alunni accedono con questo codice - in ogni programma di apprendimento, con lo stesso nome e la stessa password. Viene proposto a partire dal nome e si può cambiare: da 2 a 12 caratteri, lettere, numeri, punto o trattino.",
    klassencodeBeispiel: "ad es. 3B-SOLE",
    fuerTastenflowTipp: `Questi dati valgono solo per la scrittura con dieci dita (Tastenflow); gli altri programmi non li cambiano. Si possono cambiare più tardi in "Impostazioni della classe", nella scheda Tastenflow.`,
    fuerTastenflow: "Per Tastenflow",
    bezugNeu: "della classe nuova",
    bitteWaehlen: "Scegliere, per favore",
    startHinweis: "quello che gli alunni sanno già fare - vale anche per chi arriva più tardi",
    startSrHinweis:
      "Obbligatorio. I tasti fino a questo punto sono sbloccati fin dall'inizio per ogni persona di questa classe - " +
      "anche per chi arriva più tardi. Chi è già più avanti non perde niente.",
    anlegenTipp: "Crea la classe con tutti i dati. Il codice classe vale poi per tutti i programmi di apprendimento.",
    klasseAnlegen: "Crea la classe",
    zuerstKlasse: "Prima creare una classe - gli alunni accedono con il suo codice classe.",
    klasseVor: "Classe ",
    codeFuerLernende: " - codice classe per gli alunni",
    bearbeitenTipp: "Cambiare il nome o il codice della classe.",
    klasseBearbeiten: "Modificare la classe",
    bearbeiten: " Modifica",
    loeschenTipp: "Eliminare questa classe con tutti i suoi alunni - dopo una conferma.",
    klasseLoeschen: "Eliminare la classe",
    klasseLoeschenKnopf: " Elimina la classe",
    codeAendernTipp:
      "Da 2 a 12 caratteri, lettere, numeri, punto o trattino. Se si cambia, tutti gli alunni di questa classe accedono da quel momento con il codice nuovo.",
    speichernTipp: "Applica il nome nuovo e il codice classe nuovo.",
    speichern: "Salva",
    abbrechenTipp: "Chiude la modifica senza cambiare niente.",
    abbrechen: "Annulla",
    codeWarnVor: "⚠️ Se si cambia il codice,",
    codeWarnWer: (n: number) => (n === 1 ? "la persona di questa classe dovrà" : `tutti i ${n} alunni di questa classe dovranno`),
    codeWarnMitte: "usare da quel momento il codice ",
    codeWarnNeu: "nuovo",
    codeWarnEnde: ".",
    wochenbericht: " Resoconto settimanale via email (una volta alla settimana, il lunedì, con i numeri di Tastenflow)",
    wochenberichtAnAdresse: "a ",
    lernende: "Alunni (",
    druckenTipp: "Stampare nomi, password e codice classe delle persone appena aggiunte.",
    drucken: " Stampa i dati di accesso (",
    zurKlasse: "Aggiungi alla classe",
    nameTipp: "Basta il nome di battesimo. Deve essere unico in questa classe - maiuscole e minuscole non contano.",
    name: "Nome",
    passwort: "Password",
    passwortBeispiel: "almeno 4 caratteri",
    zufallTipp: "Crea una password facile da scrivere con 5 lettere e numeri e la mette nel campo.",
    zufall: "A caso",
    kontakt: "Email di contatto (facoltativa)",
    kontaktTipp:
      "Se qui c'è un indirizzo, la persona riceve i suoi dati di accesso automaticamente via email - quando viene aggiunta e ogni volta che vengono reimpostati.",
    kontaktBeispiel: "ad es. per la famiglia",
    womitAnfangen: "Tastenflow: da dove iniziare?",
    womitTipp:
      "Quello che la persona sa già fare. I tasti fino a quel punto sono sbloccati fin dall'inizio. È già scelto il punto di partenza della classe.",
    hinzufuegenTipp:
      "Aggiunge la persona con nome, password e - per Tastenflow - il punto di partenza in questa classe. Tutto il resto (lingua, ausili...) si regola dopo nella scheda di ogni programma. I testi di esercizio seguono la classe frequentata (indicata quando si crea la classe; poi avanza da sola a ogni anno scolastico) - non si chiede nessun anno di nascita. Dopo, il focus torna al campo del nome.",
    hinzufuegen: "Aggiungi",
    excelTitel: "Più persone insieme (Excel)",
    kommenInKlasse: "Le persone vengono aggiunte alla classe ",
    vorlageTipp: (datei: string) =>
      `Scarica il file Excel "${datei}": nel foglio "Alunni", in alto la classe e la data, sotto la scelta "da dove iniziare" per tutti e 40 righe da compilare; nel foglio "Istruzioni" le indicazioni e l'elenco dei punti di partenza. Scrivere una riga per persona (nome e password - se resta vuota, il programma ne crea una) e poi importare il file qui; prima di creare qualcosa si vede un'anteprima.`,
    vorlage: "Scarica il modello (Excel)",
    importTipp:
      "Apre la scelta del file per il modello compilato (.xlsx). Prima si vede un'anteprima - si crea qualcosa solo dopo la conferma.",
    importieren: "Importa alunni da Excel",
    listeTipp:
      "Scarica un file Word con nome, password e codice classe di TUTTI gli alunni di questa classe - da stampare e distribuire.",
    liste: "Scarica l'elenco della classe",
    vorschauVor: `Anteprima: "`,
    vorschauNach: `"`,
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Da aggiungere nella classe ${klasse}: ${wort}. ` +
      `Si salva solo quando si sceglie di aggiungere.`,
    vorschauKeiner: "Con questo file non si aggiunge nessuno.",
    escape: "Esc annulla.",
    passwortPunkt: " - Password",
    passwortErzeugt: " (password generata)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (punto di partenza della classe)",
    vorgabe: " (predefinito)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      `${n} ${n === 1 ? "riga" : "righe"}`,
      " ",
      n === 1 ? "non viene inclusa" : "non vengono incluse",
    ],
    korrigieren:
      `Queste righe si possono correggere nel file e importare di nuovo più tardi. Chi è già stato aggiunto compare nell'anteprima con "Questo nome esiste già nella classe."`,
    anlegenTippImport:
      `Aggiunge una dopo l'altra a questa classe le persone dell'anteprima. Dopo, il focus torna al titolo "Alunni", con il risultato sotto.`,
    anlegenKnopf: (n: number): readonly Teil[] => ["Aggiungi ", n === 1 ? "1 persona" : `${n} alunni`],
    verwerfenTipp: "Annulla l'anteprima senza aggiungere nessuno (Esc).",
    nochKeine:
      "Ancora nessun alunno. Si aggiungono qui sopra - poi accedono con codice classe, nome e password (da qualsiasi dispositivo).",
    wirdVerschoben: "Spostamento in corso...",
    verschiebenLaeuft: "Un momento - lo spostamento è in corso.",
    zielFehlt: "Scrivere il codice della classe nuova, per favore.",
    verschiebenFrage: (name: string, code: string, pruefung: string) =>
      `Spostare ${name} nella classe con il codice ${code}?\n\n` +
      `- ${name} accede poi con il nuovo codice classe ${code}.\n` +
      `- Gli insegnanti della classe nuova vedono ${name} e i suoi progressi.\n` +
      `- I risultati della ${pruefung} e i messaggi restano nella classe precedente.\n` +
      `- ${name} non sarà più visibile in questo account, a meno di insegnare anche nella classe nuova.`,
    nichtsVerschoben: "Non è stato spostato niente.",
    emailFalsch: "Non sembra un indirizzo email - oppure lasciare il campo vuoto.",
    kontaktGespeichert: "Email di contatto salvata.",
    kontaktEntfernt: "Email di contatto tolta.",
    passwortTipp: (name: string) => `Apre e chiude il campo per una nuova password di ${name}.`,
    passwortAendern: "Cambia la password",
    kontaktKnopfTipp: (name: string) =>
      `Apre e chiude il campo per l'email di contatto di ${name} - se è compilato, la persona riceve la sua password automaticamente via email appena viene impostata o reimpostata.`,
    kontaktKnopfName: (name: string) => `Email di contatto: ${name}`,
    kontaktKnopf: "Email di contatto",
    verschiebenTipp: (name: string) =>
      `Apre il campo per spostare ${name} in un'altra classe - anche in quella di un'altra persona che insegna, se si conosce il suo codice classe.`,
    verschiebenName: (name: string) => `Spostare in un'altra classe: ${name}`,
    verschiebenKnopf: "Sposta in un'altra classe",
    loeschenKindTipp: (name: string) =>
      `Elimina ${name} e i suoi progressi in tutti i programmi di apprendimento - dopo una conferma.`,
    loeschenKindName: (name: string) => `Eliminare ${name}`,
    loeschenKnopf: " Elimina",
    kontaktVon: "Email di contatto di ",
    kontaktLeer: "vuoto = nessuna email",
    kontaktSpeichernTipp: (name: string) =>
      `Salva l'email di contatto di ${name} - se resta vuoto, viene tolta di nuovo.`,
    schliessenTipp: "Chiude il campo senza salvare (Esc).",
    codeNeueKlasse: "Codice della classe nuova",
    folgenTipp: (name: string, pruefung: string) =>
      `${name} accede poi con il nuovo codice classe. Gli insegnanti della classe nuova vedono ${name} e i suoi progressi. I risultati della ${pruefung} e i messaggi restano in questa classe.`,
    zielBeispiel: "ad es. 4A",
    verschiebeTipp: (name: string) =>
      `Sposta ${name} nella classe con questo codice classe, dopo una conferma.`,
    verschieben: "Sposta",
    nichtVerschiebenTipp: "Chiude il campo senza spostare niente (Esc).",
  },
  // ★ O-PL (02.10.2026): Lehrkraft ty-Befehlsform und unpersönlich (Glossar
  // Regel 1), nie Pan/Pani; Kinder als „uczniowie"/„osoba" (Regel 2), Namen nur
  // nach Doppelpunkt (Regel 11), Mehrzahl mit vier Formen (§2.10a), Knopfnamen
  // ohne Anführung (Regel 8); „Utwórz klasę", „Dodaj", „Przenieś" (§2.6).
  pl: {
    auswahlSpeichert: "Chwileczkę - wybór jest zapisywany.",
    keinProgramm: "Nie wybrano żadnego programu - widoczny jest program, z którego tu przechodzisz.",
    auswahlGespeichert: "Wybór programów zapisany.",
    programmeKlasse: "Programy tej klasy",
    nurAnsicht: "To ustawia tylko ",
    ihreAnsicht: "twój widok",
    nurAnsichtRest:
      ": odznaczone programy nie mają tu zakładki ani kolumny. Uczniowie nadal mogą otwierać każdy program - nic nie jest blokowane.",
    fehltName: "nazwa klasy",
    fehltCodeGueltig:
      "prawidłowy kod klasy (od 2 do 12 znaków: litery, cyfry, kropka albo łącznik)",
    fehltCode: "kod klasy",
    fehltSchulstufe: "klasa, do której chodzą uczniowie",
    fehltStart: "punkt startowy",
    und: " i ",
    fehltSatz: (liste: string) => `Do utworzenia klasy brakuje jeszcze: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} wiersz`,
        few: (z) => `${z} wiersze`,
        many: (z) => `${z} wierszy`,
        other: (z) => `${z} wiersza`,
      }),
    ersteSchritte: "Pierwsze kroki",
    schrittKlasse: "Utwórz klasę",
    schrittKlasseText:
      "Nazwa, kod klasy, klasa, do której chodzą uczniowie, język, punkt startowy i Wyścig klasowy. Program proponuje kod na podstawie nazwy; można go zmienić. Tym kodem uczniowie logują się do wszystkich programów do nauki.",
    schrittLernende: "Dodaj uczniów",
    schrittLernendeText:
      "Imię i hasło, nic więcej. Potem możesz wydrukować dane logowania jako listę i rozdać.",
    schrittProgramme: "Wybierz programy",
    schrittProgrammeText:
      "Z których programów do nauki korzysta ta klasa? To ustawia tylko twój widok - uczniowie zawsze mogą otworzyć każdy program.",
    erledigt: ", gotowe",
    jetztDran: ", teraz ten krok",
    wirdGespeichert: "Zapisywanie...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Klasa „${name}” jest utworzona, ale tych danych nie zapisano: ` +
      `${liste}. Można je uzupełnić w części „Ustawienia klasy”, ` +
      `w zakładce Tastenflow.`,
    klasseAngelegt: (name: string) => `Utworzono klasę „${name}”.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Utworzono klasę „${name}” - kod klasy „${gewuenscht.trim().toUpperCase()}” był ` +
      `już zajęty, dlatego obowiązuje teraz kod klasy „${code}”.`,
    nameZuerst: "Najpierw wpisz imię.",
    passwortKurz: "Hasło musi mieć co najmniej 4 znaki.",
    kontaktFalsch: "Kontaktowy adres e-mail wygląda na nieprawidłowy - możesz też zostawić puste pole.",
    kindAngelegt: (name: string) => `Konto utworzone: ${name}.`,
    vorlageLaedt: (datei: string) => `Pobieranie szablonu „${datei}”.`,
    vorlageFehler:
      "Nie udało się utworzyć szablonu. Odśwież stronę i spróbuj jeszcze raz.",
    listeWird: "Lista klasy jest przygotowywana.",
    listeLaedt: (klasse: string) => `Pobieranie listy klasy: ${klasse}.`,
    listeFehler:
      "Nie udało się utworzyć listy klasy. Odśwież stronę i spróbuj jeszcze raz.",
    nochSpeichern: "Chwileczkę - trwa zapisywanie.",
    dateiNichtOffen: "Nie udało się otworzyć pliku. Wybierz go jeszcze raz.",
    dateiLeer: (datei: string) =>
      `W pliku „${datei}” pod nagłówkiem nie ma żadnej osoby. Wpisz po jednym wierszu na osobę i zaimportuj plik jeszcze raz.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Podgląd - do dodania: ${anlegen}` +
      (abgelehnt ? `; pominięte: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Z tego pliku nie da się dodać nikogo - powody są w podglądzie. Popraw plik i zaimportuj go jeszcze raz.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Zakładanie kont: ${nr} z ${von} (${name})...`,
    kontoNicht: "Nie udało się założyć konta.",
    ergebnisAngelegt: (anzahl: string) => `Dodano: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Nie dodano (${n}): ${liste}.`,
    ergebnisDrucken: "Imiona i hasła są pod przyciskiem Drukuj dane logowania.",
    anlegenLaeuft: "Zakładanie kont już trwa - poczekaj, aż się skończy.",
    importAbgebrochen: "Import przerwany - nikogo nie dodano.",
    kindLoeschenFrage: (name: string) =>
      `Naprawdę usunąć konto: ${name}? Przepadną wszystkie postępy we WSZYSTKICH ` +
      `programach do nauki. Tego nie da się cofnąć.`,
    kindGeloescht: (name: string) => `Usunięto konto: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Naprawdę usunąć klasę „${name}”?` +
      (n > 0
        ? ` Na zawsze zostaną usunięte także konta uczniów (${mehrzahl(n, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      })}) ` +
          `i ich postępy.`
        : "") +
      " Tego nie da się cofnąć.",
    klasseGeloescht: (name: string) => `Usunięto klasę „${name}”.`,
    klassennameFehlt: "Wpisz nazwę klasy.",
    codeFehlt: "Wpisz kod klasy - uczniowie logują się tym kodem.",
    codeUngueltig:
      "Kod klasy może mieć od 2 do 12 znaków: litery, cyfry, kropkę albo łącznik.",
    klasseGespeichert: "Klasa zapisana.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Przeniesiono do klasy „${klasse}” (kod klasy ${code}): ${name}. ` +
      `Od teraz logowanie odbywa się tym kodem.`,
    wochenberichtAn: "Podsumowanie tygodnia włączone.",
    wochenberichtAus: "Podsumowanie tygodnia wyłączone.",
    druckBlockiert: "Okno drukowania zostało zablokowane. Zezwól tej stronie na wyskakujące okna.",
    klassen: "Klasy",
    klasseWaehlenTipp: (name: string) => `Wybiera klasę ${name} - wszystkie zakładki pokazują potem jej uczniów.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Klasa ${name}${gewaehlt ? ", wybrana" : ""}`,
    neueKlasse: "Utwórz nową klasę",
    neueKlasseInhalt: "- nazwa, kod klasy, klasa, do której chodzą uczniowie, język, punkt startowy, Wyścig klasowy",
    neuProgrammeTitel: "Z jakich programów korzysta klasa?",
    neuProgrammeHinweis:
      "To porządkuje tylko Twój widok - uczniowie nadal mogą otworzyć każdy program. Ustawienia dla Tastenflow (klasa, do której chodzą uczniowie, język, punkt startowy, Wyścig klasowy) pojawiają się tylko po zaznaczeniu Tastenflow.",
    neuProgrammName: (label: string) => `${label} dla nowej klasy`,
    fehltProgramm: "co najmniej jeden program",
    klassenname: "Nazwa klasy",
    klassennameBeispiel: "np. 3B albo Słoneczniki",
    klassencode: "Kod klasy",
    klassencodeTipp:
      "Obowiązkowe. Uczniowie logują się tym kodem - w każdym programie do nauki, z tym samym imieniem i hasłem. Program proponuje go na podstawie nazwy i można go zmienić: od 2 do 12 znaków, litery, cyfry, kropka albo łącznik.",
    klassencodeBeispiel: "np. 3B-SLONCE",
    fuerTastenflowTipp:
      "Te dane dotyczą tylko pisania dziesięcioma palcami (Tastenflow); inne programy ich nie zmieniają. Można je zmienić później w części „Ustawienia klasy”, w zakładce Tastenflow.",
    fuerTastenflow: "Dla programu Tastenflow",
    bezugNeu: "nowej klasy",
    bitteWaehlen: "Wybierz",
    startHinweis: "to, co uczniowie już umieją - dotyczy też osób, które dołączą później",
    startSrHinweis:
      "Obowiązkowe. Klawisze do tego poziomu są odblokowane od początku dla każdej osoby w tej klasie - " +
      "także dla osób, które dołączą później. Kto jest już dalej, nic nie traci.",
    anlegenTipp: "Tworzy klasę ze wszystkimi danymi. Kod klasy obowiązuje potem we wszystkich programach do nauki.",
    klasseAnlegen: "Utwórz klasę",
    zuerstKlasse: "Najpierw utwórz klasę - uczniowie logują się jej kodem.",
    klasseVor: "Klasa ",
    codeFuerLernende: " - kod klasy dla uczniów",
    bearbeitenTipp: "Zmień nazwę albo kod klasy.",
    klasseBearbeiten: "Edytuj klasę",
    bearbeiten: " Edytuj",
    loeschenTipp: "Usuń tę klasę razem ze wszystkimi uczniami - po potwierdzeniu.",
    klasseLoeschen: "Usuń klasę",
    klasseLoeschenKnopf: " Usuń klasę",
    codeAendernTipp:
      "Od 2 do 12 znaków, litery, cyfry, kropka albo łącznik. Po zmianie wszyscy uczniowie tej klasy logują się od razu nowym kodem.",
    speichernTipp: "Zapisuje nową nazwę i nowy kod klasy.",
    speichern: "Zapisz",
    abbrechenTipp: "Zamyka edycję bez zmian.",
    abbrechen: "Anuluj",
    codeWarnVor: "⚠️ Po zmianie kodu",
    codeWarnWer: (n: number) => (n === 1 ? "osoba z tej klasy loguje się" : `uczniowie tej klasy (${n}) logują się`),
    codeWarnMitte: "od tej chwili ",
    codeWarnNeu: "nowym",
    codeWarnEnde: " kodem.",
    wochenbericht: " Podsumowanie tygodnia e-mailem (raz w tygodniu, w poniedziałek, z liczbami z programu Tastenflow)",
    wochenberichtAnAdresse: "na adres ",
    lernende: "Uczniowie (",
    druckenTipp: "Wydrukuj imiona, hasła i kod klasy osób dodanych przed chwilą.",
    drucken: " Drukuj dane logowania (",
    zurKlasse: "Dodaj do klasy",
    nameTipp: "Wystarczy imię. Musi być niepowtarzalne w tej klasie - wielkość liter nie ma znaczenia.",
    name: "Imię",
    passwort: "Hasło",
    passwortBeispiel: "co najmniej 4 znaki",
    zufallTipp: "Tworzy łatwe do wpisania hasło z 5 liter i cyfr i wpisuje je w pole.",
    zufall: "Losowe",
    kontakt: "Kontaktowy adres e-mail (nieobowiązkowo)",
    kontaktTipp:
      "Jeśli jest tu adres, osoba dostaje dane logowania automatycznie e-mailem - przy dodaniu i przy każdym ustawieniu nowego hasła.",
    kontaktBeispiel: "np. dla rodziców",
    womitAnfangen: "Tastenflow: od czego zacząć?",
    womitTipp:
      "To, co ta osoba już umie. Klawisze do tego miejsca są odblokowane od początku. Wybrany jest już punkt startowy klasy.",
    hinzufuegenTipp:
      "Dodaje osobę z imieniem, hasłem i - dla programu Tastenflow - punktem startowym w tej klasie. Wszystko inne (język, technologie wspomagające...) ustawia się później w zakładce każdego programu. Teksty do ćwiczeń dopasowują się do klasy, do której chodzą uczniowie (podanej przy tworzeniu klasy; potem z każdym rokiem szkolnym rośnie sama) - nikt nie podaje roku urodzenia. Potem fokus wraca do pola z imieniem.",
    hinzufuegen: "Dodaj",
    excelTitel: "Wiele osób naraz (Excel)",
    kommenInKlasse: "Osoby trafią do klasy ",
    vorlageTipp: (datei: string) =>
      `Pobiera plik Excel „${datei}”: w arkuszu „Uczniowie” u góry klasa i data, pod nimi wybór „od czego zacząć” dla wszystkich i 40 wierszy do wypełnienia; w arkuszu „Instrukcja” wskazówki i lista punktów startowych. Wpisz po jednym wierszu na osobę (imię i hasło - puste hasło utworzy program), a potem zaimportuj plik tutaj; przed dodaniem kogokolwiek zobaczysz podgląd.`,
    vorlage: "Pobierz szablon (Excel)",
    importTipp:
      "Otwiera wybór pliku dla wypełnionego szablonu (.xlsx). Najpierw zobaczysz podgląd - konta powstaną dopiero po potwierdzeniu.",
    importieren: "Importuj uczniów z pliku Excel",
    listeTipp:
      "Pobiera plik Word z imionami, hasłami i kodem klasy WSZYSTKICH uczniów tej klasy - do wydrukowania i rozdania.",
    liste: "Pobierz listę klasy",
    vorschauVor: "Podgląd: „",
    vorschauNach: "”",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Do dodania w klasie ${klasse}: ${wort}. ` +
      `Zapis nastąpi dopiero po wybraniu przycisku Dodaj.`,
    vorschauKeiner: "Z tego pliku nikt nie zostanie dodany.",
    escape: "Esc przerywa.",
    passwortPunkt: " - Hasło",
    passwortErzeugt: " (hasło utworzone przez program)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (punkt startowy klasy)",
    vorgabe: " (domyślnie)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "pl", {
        one: (z) => `${z} wiersz`,
        few: (z) => `${z} wiersze`,
        many: (z) => `${z} wierszy`,
        other: (z) => `${z} wiersza`,
      }),
      " ",
      mehrzahl(n, "pl", {
        one: () => "zostanie pominięty",
        few: () => "zostaną pominięte",
        many: () => "zostanie pominiętych",
        other: () => "zostanie pominięte",
      }),
    ],
    korrigieren:
      "Te wiersze można poprawić w pliku i zaimportować później jeszcze raz. Osoby już dodane pojawią się w podglądzie z uwagą „To imię jest już w klasie.”",
    anlegenTippImport:
      "Dodaje do tej klasy po kolei osoby z podglądu. Potem fokus wraca do nagłówka „Uczniowie”, a pod nim jest wynik.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Dodaj: ",
      mehrzahl(n, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      }),
    ],
    verwerfenTipp: "Odrzuca podgląd bez dodawania kogokolwiek (Esc).",
    nochKeine:
      "Nie ma jeszcze uczniów. Dodaj ich powyżej - potem logują się kodem klasy, imieniem i hasłem (z dowolnego urządzenia).",
    wirdVerschoben: "Przenoszenie...",
    verschiebenLaeuft: "Chwileczkę - trwa przenoszenie.",
    zielFehlt: "Wpisz kod nowej klasy.",
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Przenieść do klasy z kodem ${code}: ${name}?\n\n` +
      `- Ta osoba loguje się potem nowym kodem klasy ${code}.\n` +
      `- Nauczyciele nowej klasy widzą tę osobę i jej postępy.\n` +
      `- Wyniki Wyzwań i wiadomości zostają w poprzedniej klasie.\n` +
      `- Ta osoba nie będzie już widoczna na tym koncie, chyba że prowadzisz też nową klasę.`,
    nichtsVerschoben: "Nic nie zostało przeniesione.",
    emailFalsch: "To nie wygląda na adres e-mail - możesz też zostawić puste pole.",
    kontaktGespeichert: "Kontaktowy adres e-mail zapisany.",
    kontaktEntfernt: "Kontaktowy adres e-mail usunięty.",
    passwortTipp: (name: string) => `Otwiera i zamyka pole nowego hasła. Osoba: ${name}.`,
    passwortAendern: "Zmień hasło",
    kontaktKnopfTipp: (name: string) =>
      `Otwiera i zamyka pole kontaktowego adresu e-mail. Osoba: ${name}. Jeśli pole jest wypełnione, ta osoba dostaje hasło automatycznie e-mailem, gdy tylko zostanie ustawione albo zmienione.`,
    kontaktKnopfName: (name: string) => `Kontaktowy adres e-mail: ${name}`,
    kontaktKnopf: "Kontaktowy e-mail",
    verschiebenTipp: (name: string) =>
      `Otwiera pole do przeniesienia do innej klasy - także do klasy innej osoby prowadzącej, jeśli znasz jej kod klasy. Osoba: ${name}.`,
    verschiebenName: (name: string) => `Przenieś do innej klasy: ${name}`,
    verschiebenKnopf: "Przenieś do innej klasy",
    loeschenKindTipp: (name: string) =>
      `Usuwa konto i postępy we wszystkich programach do nauki - po potwierdzeniu. Osoba: ${name}.`,
    loeschenKindName: (name: string) => `Usuń: ${name}`,
    loeschenKnopf: " Usuń",
    kontaktVon: "Kontaktowy adres e-mail: ",
    kontaktLeer: "puste pole = bez e-maila",
    kontaktSpeichernTipp: (name: string) =>
      `Zapisuje kontaktowy adres e-mail - puste pole go usuwa. Osoba: ${name}.`,
    schliessenTipp: "Zamyka pole bez zapisywania (Esc).",
    codeNeueKlasse: "Kod nowej klasy",
    folgenTipp: (name: string, _pruefung: string) =>
      `Ta osoba loguje się potem nowym kodem klasy. Nauczyciele nowej klasy widzą ją i jej postępy. Wyniki Wyzwań i wiadomości zostają w tej klasie. Osoba: ${name}.`,
    zielBeispiel: "np. 4A",
    verschiebeTipp: (name: string) =>
      `Przenosi do klasy z tym kodem, po potwierdzeniu. Osoba: ${name}.`,
    verschieben: "Przenieś",
    nichtVerschiebenTipp: "Zamyka pole bez przenoszenia (Esc).",
  },
  // ★ O-TR (02.10.2026): Lehrkraft siz mit -(y)In (Glossar Regel 1), Knöpfe im
  // Stamm ("Sınıf oluştur", "Ekle", "Başka sınıfa taşı"); Kinder = "öğrenci"
  // (Regel 2), nach einer Zahl Einzahl (Regel 5); Namen, Klassen und Codes nur
  // nach Doppelpunkt, nie mit Endung (Regel 6); Knopfnamen in geraden
  // Anführungszeichen (Regel 7).
  tr: {
    auswahlSpeichert: "Bir dakika - seçim henüz kaydediliyor.",
    keinProgramm: "Hiçbir program seçilmedi - buraya hangi programdan geldiyseniz o program gösteriliyor.",
    auswahlGespeichert: "Program seçimi kaydedildi.",
    programmeKlasse: "Bu sınıfın programları",
    nurAnsicht: "Bu seçim yalnızca ",
    ihreAnsicht: "sizin görünümünüzü",
    nurAnsichtRest:
      " belirler: seçilmeyen programlar burada bölüm ve sütun almaz. Öğrenciler her programı açmaya devam edebilir - hiçbir şey kilitlenmez.",
    fehltName: "sınıf adı",
    fehltCodeGueltig:
      "geçerli bir sınıf kodu (2 ile 12 karakter arası: harf, rakam, nokta veya kısa çizgi)",
    fehltCode: "sınıf kodu",
    fehltSchulstufe: "sınıf düzeyi",
    fehltStart: "başlangıç noktası",
    und: " ve ",
    fehltSatz: (liste: string) => `Sınıfı oluşturmak için eksik olanlar: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "tr", { one: (z) => `${z} öğrenci`, other: (z) => `${z} öğrenci` }),
    zeilen: (n: number) => mehrzahl(n, "tr", { one: (z) => `${z} satır`, other: (z) => `${z} satır` }),
    ersteSchritte: "İlk adımlar",
    schrittKlasse: "Sınıf oluştur",
    schrittKlasseText:
      "Ad, sınıf kodu, sınıf düzeyi, dil, başlangıç noktası ve Sınıf Maçı. Program ada uygun bir kod önerir; kodu değiştirebilirsiniz. Öğrenciler tüm öğrenme programlarına bu kodla giriş yapar.",
    schrittLernende: "Öğrenci ekle",
    schrittLernendeText:
      "Ad ve şifre, başka bir şey gerekmez. Sonra giriş bilgilerini liste olarak yazdırıp dağıtabilirsiniz.",
    schrittProgramme: "Programları seç",
    schrittProgrammeText:
      "Bu sınıf hangi öğrenme programlarını kullanıyor? Bu yalnızca sizin görünümünüzü düzenler - öğrenciler her programı açmaya devam edebilir.",
    erledigt: ", tamamlandı",
    jetztDran: ", sıradaki adım",
    wirdGespeichert: "Kaydediliyor...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Sınıf oluşturuldu: ${name}. Ancak şunlar kaydedilmedi: ${liste}. ` +
      `Lütfen bunları Tastenflow bölümündeki "Sınıf ayarları" kısmında tamamlayın.`,
    klasseAngelegt: (name: string) => `Sınıf oluşturuldu: ${name}.`,
    // ★ O-TR: `toUpperCase()` wie im Codefeld - der Code ist ein WERT (so ist er
    // gespeichert), kein türkischer Text; `grossFuer` zeigte sonst einen anderen Code.
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Sınıf oluşturuldu: ${name}. İstenen sınıf kodu ("${gewuenscht.trim().toUpperCase()}") ` +
      `başka bir sınıfta kullanılıyordu; bu yüzden geçerli sınıf kodu: ${code}.`,
    nameZuerst: "Lütfen önce bir ad yazın.",
    passwortKurz: "Şifre en az 4 karakter olmalı.",
    kontaktFalsch: "İletişim e-postası doğru görünmüyor - isterseniz alanı boş bırakın.",
    kindAngelegt: (name: string) => `Öğrenci eklendi: ${name}.`,
    vorlageLaedt: (datei: string) => `Şablon indiriliyor: "${datei}".`,
    vorlageFehler: "Şablon oluşturulamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.",
    listeWird: "Sınıf listesi hazırlanıyor.",
    listeLaedt: (klasse: string) => `Sınıf listesi indiriliyor: ${klasse}.`,
    listeFehler: "Sınıf listesi oluşturulamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.",
    nochSpeichern: "Bir dakika - kayıt henüz sürüyor.",
    dateiNichtOffen: "Dosya açılamadı. Lütfen dosyayı yeniden seçin.",
    dateiLeer: (datei: string) =>
      `"${datei}" dosyasında başlık satırının altında hiç öğrenci yok. Lütfen her öğrenci için bir satır yazın ve dosyayı yeniden içe aktarın.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Önizleme - eklenecek: ${anlegen}` +
      (abgelehnt ? `; alınmayacak: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Bu dosyadan hiçbir öğrenci eklenemiyor - nedenleri önizlemede. Lütfen dosyayı düzeltin ve yeniden içe aktarın.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Ekleniyor: ${nr}, toplam ${von} (${name})...`,
    kontoNicht: "Hesap oluşturulamadı.",
    ergebnisAngelegt: (anzahl: string) => `Eklendi: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Eklenemedi (${n}): ${liste}.`,
    ergebnisDrucken: 'Adları ve şifreleri "Giriş bilgilerini yazdır" düğmesinde bulursunuz.',
    anlegenLaeuft: "Ekleme zaten sürüyor - lütfen bitmesini bekleyin.",
    importAbgebrochen: "İçe aktarma iptal edildi - hiçbir öğrenci eklenmedi.",
    kindLoeschenFrage: (name: string) =>
      `Öğrenci silinecek: ${name}. TÜM öğrenme programlarındaki ilerleme kaybolur ` +
      `ve bu işlem geri alınamaz. Gerçekten silinsin mi?`,
    kindGeloescht: (name: string) => `Öğrenci silindi: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Sınıf silinecek: ${name}.` +
      (n > 0
        ? ` Bu sınıftaki ${mehrzahl(n, "tr", { one: (z) => `${z} öğrenci`, other: (z) => `${z} öğrenci` })} de ` +
          `ilerlemesiyle birlikte kalıcı olarak silinir.`
        : "") +
      " Bu işlem geri alınamaz. Gerçekten silinsin mi?",
    klasseGeloescht: (name: string) => `Sınıf silindi: ${name}.`,
    klassennameFehlt: "Lütfen bir sınıf adı yazın.",
    codeFehlt: "Lütfen bir sınıf kodu yazın - öğrenciler bu kodla giriş yapar.",
    codeUngueltig:
      "Sınıf kodu 2 ile 12 karakter arasında olmalı: harf, rakam, nokta veya kısa çizgi.",
    klasseGespeichert: "Sınıf kaydedildi.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Öğrenci taşındı: ${name}. Yeni sınıf: ${klasse} (sınıf kodu: ${code}). ` +
      `Öğrenci bundan sonra bu kodla giriş yapar.`,
    wochenberichtAn: "Haftalık rapor açıldı.",
    wochenberichtAus: "Haftalık rapor kapatıldı.",
    druckBlockiert: "Yazdırma penceresi engellendi. Lütfen bu sayfa için açılır pencerelere izin verin.",
    klassen: "Sınıflar",
    klasseWaehlenTipp: (name: string) => `Bu sınıfı seçer: ${name}. Sonra tüm bölümler bu sınıfın öğrencilerini gösterir.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Sınıf ${name}${gewaehlt ? ", seçili" : ""}`,
    neueKlasse: "Yeni sınıf oluştur",
    neueKlasseInhalt: "- ad, sınıf kodu, sınıf düzeyi, dil, başlangıç noktası, Sınıf Maçı",
    neuProgrammeTitel: "Sınıf hangi programları kullanıyor?",
    neuProgrammeHinweis:
      "Bu yalnızca sizin görünümünüzü düzenler - öğrenciler yine de her programı açabilir. Tastenflow ile ilgili bilgiler (sınıf düzeyi, dil, başlangıç noktası, Sınıf Maçı) yalnızca Tastenflow işaretliyse görünür.",
    neuProgrammName: (label: string) => `Yeni sınıf için ${label}`,
    fehltProgramm: "en az bir program",
    klassenname: "Sınıf adı",
    klassennameBeispiel: "örn. 3B veya Papatyalar",
    klassencode: "Sınıf kodu",
    klassencodeTipp:
      "Zorunlu. Öğrenciler her öğrenme programına bu kodla, aynı ad ve şifreyle giriş yapar. Kod ada uygun olarak önerilir ve değiştirilebilir: 2 ile 12 karakter arası, harf, rakam, nokta veya kısa çizgi.",
    klassencodeBeispiel: "örn. 3B-PAPATYA",
    fuerTastenflowTipp:
      'Bu bilgiler yalnızca on parmak klavye çalışması (Tastenflow) için geçerlidir; diğer programlar bunları değiştirmez. Daha sonra Tastenflow bölümündeki "Sınıf ayarları" kısmında değiştirilebilir.',
    fuerTastenflow: "Tastenflow için",
    bezugNeu: "yeni sınıf",
    bitteWaehlen: "Lütfen seçin",
    startHinweis: "öğrencilerin zaten bildikleri - sonradan katılacak öğrenciler için de geçerlidir",
    startSrHinweis:
      "Zorunlu. Bu düzeye kadar olan tuşların kilidi, bu sınıftaki her öğrenci için baştan açıktır - " +
      "sonradan katılan öğrenciler için de. Daha ileride olan bir öğrenci hiçbir şey kaybetmez.",
    anlegenTipp: "Sınıfı tüm bilgileriyle oluşturur. Sınıf kodu bundan sonra tüm öğrenme programlarında geçerlidir.",
    klasseAnlegen: "Sınıf oluştur",
    zuerstKlasse: "Önce bir sınıf oluşturun - öğrenciler o sınıfın koduyla giriş yapar.",
    klasseVor: "Sınıf: ",
    codeFuerLernende: " - öğrenciler için sınıf kodu",
    bearbeitenTipp: "Sınıf adını veya sınıf kodunu değiştirin.",
    klasseBearbeiten: "Sınıfı düzenle",
    bearbeiten: " Düzenle",
    loeschenTipp: "Bu sınıfı tüm öğrencileriyle birlikte siler - önce onayınız istenir.",
    klasseLoeschen: "Sınıfı sil",
    klasseLoeschenKnopf: " Sınıfı sil",
    codeAendernTipp:
      "2 ile 12 karakter arası, harf, rakam, nokta veya kısa çizgi. Kodu değiştirirseniz bu sınıftaki tüm öğrenciler bundan sonra yeni kodla giriş yapar.",
    speichernTipp: "Yeni sınıf adını ve sınıf kodunu kaydeder.",
    speichern: "Kaydet",
    abbrechenTipp: "Hiçbir şeyi değiştirmeden düzenlemeyi kapatır.",
    abbrechen: "İptal",
    codeWarnVor: "⚠️ Kod değiştirilirse",
    codeWarnWer: (n: number) => (n === 1 ? "bu sınıftaki öğrenci" : `bu sınıftaki ${n} öğrencinin tümü`),
    codeWarnMitte: "bundan sonra ",
    codeWarnNeu: "yeni",
    codeWarnEnde: " kodla giriş yapar.",
    wochenbericht: " Haftalık rapor e-postayla (haftada bir, pazartesi günleri, Tastenflow sayılarıyla)",
    wochenberichtAnAdresse: " - alıcı: ",
    lernende: "Öğrenciler (",
    druckenTipp: "Az önce eklenen öğrencilerin adlarını, şifrelerini ve sınıf kodunu yazdırın.",
    drucken: " Giriş bilgilerini yazdır (",
    zurKlasse: "Sınıfa ekle",
    nameTipp: "Ad yeterlidir. Ad bu sınıfta yalnızca bir kez olabilir - büyük/küçük harf fark etmez.",
    name: "Ad",
    passwort: "Şifre",
    passwortBeispiel: "en az 4 karakter",
    zufallTipp: "5 harf ve rakamdan oluşan, kolay yazılan bir şifre oluşturur ve alana yazar.",
    zufall: "Rastgele",
    kontakt: "İletişim e-postası (isteğe bağlı)",
    kontaktTipp:
      "Burada bir adres varsa öğrenci giriş bilgilerini otomatik olarak e-postayla alır - eklenirken ve şifre her sıfırlandığında.",
    kontaktBeispiel: "örn. veli için",
    womitAnfangen: "Tastenflow: nereden başlansın?",
    womitTipp:
      "Öğrencinin zaten bildikleri. Buraya kadar olan tuşların kilidi baştan açıktır. Sınıfın başlangıç noktası önceden seçilidir.",
    hinzufuegenTipp:
      "Öğrenciyi adı, şifresi ve - Tastenflow için - başlangıç noktasıyla bu sınıfa ekler. Diğer her şeyi (dil, yardımcı teknolojiler...) sonra ilgili programın bölümünde ayarlayın. Alıştırma metinleri sınıfın sınıf düzeyine göre seçilir (sınıf oluşturulurken girilir, her öğretim yılında kendiliğinden bir artar) - doğum yılı sorulmaz. Ardından odak yeniden ad alanına gelir.",
    hinzufuegen: "Ekle",
    excelTitel: "Çok sayıda öğrenci birden (Excel)",
    kommenInKlasse: "Öğrenciler şu sınıfa eklenir: ",
    vorlageTipp: (datei: string) =>
      `"${datei}" Excel dosyasını indirir: "Öğrenciler" sayfasında üstte sınıf ve tarih, altında tüm öğrenciler için "nereden başlansın" seçimi ve doldurmak için 40 satır; "Açıklamalar" sayfasında adımlar ve başlangıç noktalarının listesi. Her öğrenci için bir satır yazın (ad ve şifre - boş bırakılan şifreyi program oluşturur), sonra dosyayı burada içe aktarın; öğrenciler eklenmeden önce bir önizleme görürsünüz.`,
    vorlage: "Şablonu indir (Excel)",
    importTipp:
      "Doldurulmuş şablon (.xlsx) için dosya seçimini açar. Önce bir önizleme gelir - hesaplar ancak siz onayladıktan sonra oluşturulur.",
    importieren: "Excel dosyasından öğrenci ekle",
    listeTipp:
      "Bu sınıftaki TÜM öğrencilerin adını, şifresini ve sınıf kodunu içeren bir Word dosyası indirir - yazdırıp dağıtmak için.",
    liste: "Sınıf listesini indir",
    vorschauVor: 'Önizleme: "',
    vorschauNach: '"',
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Eklenecek: ${wort}. Sınıf: ${klasse}. ` +
      `Kayıt ancak "Ekle" düğmesine bastığınızda yapılır.`,
    vorschauKeiner: "Bu dosyadan hiçbir öğrenci eklenmeyecek.",
    escape: "Esc ile iptal edilir.",
    passwortPunkt: " - Şifre",
    passwortErzeugt: " (şifreyi program oluşturdu)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (sınıfın başlangıç noktası)",
    vorgabe: " (varsayılan)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "tr", { one: (z) => `${z} satır`, other: (z) => `${z} satır` }),
      " ",
      "alınmayacak",
    ],
    korrigieren:
      'Bu satırları dosyada düzeltip daha sonra yeniden içe aktarabilirsiniz. O sırada zaten eklenmiş olan öğrenciler önizlemede "Bu ad sınıfta zaten var." notuyla görünür.',
    anlegenTippImport:
      'Önizlemedeki öğrencileri sırayla bu sınıfa ekler. Ardından odak "Öğrenciler" başlığına gelir; sonuç bu başlığın altındadır.',
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Ekle: ",
      mehrzahl(n, "tr", { one: (z) => `${z} öğrenci`, other: (z) => `${z} öğrenci` }),
    ],
    verwerfenTipp: "Hiçbir öğrenci eklemeden önizlemeyi kapatır (Esc).",
    nochKeine:
      "Henüz öğrenci yok. Yukarıdan ekleyin - öğrenciler sonra sınıf kodu, ad ve şifreyle giriş yapar (her cihazdan).",
    wirdVerschoben: "Taşınıyor...",
    verschiebenLaeuft: "Bir dakika - taşıma henüz sürüyor.",
    zielFehlt: "Lütfen yeni sınıfın sınıf kodunu yazın.",
    verschiebenFrage: (name: string, code: string, pruefung: string) =>
      `Öğrenci başka sınıfa taşınacak: ${name}. Yeni sınıf kodu: ${code}.\n\n` +
      `- Öğrenci bundan sonra yeni sınıf koduyla giriş yapar.\n` +
      `- Yeni sınıfın öğretmenleri öğrenciyi ve ilerlemesini görür.\n` +
      `- ${pruefung} sonuçları ve mesajlar önceki sınıfta kalır.\n` +
      `- Siz de yeni sınıfın öğretmeni değilseniz öğrenciyi bundan sonra görmezsiniz.\n\n` +
      `Taşınsın mı?`,
    nichtsVerschoben: "Hiçbir şey taşınmadı.",
    emailFalsch: "Bu bir e-posta adresine benzemiyor - isterseniz alanı boş bırakın.",
    kontaktGespeichert: "İletişim e-postası kaydedildi.",
    kontaktEntfernt: "İletişim e-postası kaldırıldı.",
    passwortTipp: (name: string) => `Yeni şifre alanını açar ve kapatır. Öğrenci: ${name}.`,
    passwortAendern: "Şifreyi değiştir",
    kontaktKnopfTipp: (name: string) =>
      `İletişim e-postası alanını açar ve kapatır. Öğrenci: ${name}. Adres girilmişse öğrenci, şifresi belirlendiğinde veya sıfırlandığında şifresini otomatik olarak e-postayla alır.`,
    kontaktKnopfName: (name: string) => `İletişim e-postası: ${name}`,
    kontaktKnopf: "İletişim e-postası",
    verschiebenTipp: (name: string) =>
      `Öğrenciyi başka bir sınıfa taşımak için alanı açar - sınıf kodunu biliyorsanız başka bir öğretmenin sınıfına da. Öğrenci: ${name}.`,
    verschiebenName: (name: string) => `Başka sınıfa taşı: ${name}`,
    verschiebenKnopf: "Başka sınıfa taşı",
    loeschenKindTipp: (name: string) =>
      `Öğrenciyi tüm öğrenme programlarındaki ilerlemesiyle birlikte siler - önce onayınız istenir. Öğrenci: ${name}.`,
    loeschenKindName: (name: string) => `Sil: ${name}`,
    loeschenKnopf: " Sil",
    kontaktVon: "İletişim e-postası: ",
    kontaktLeer: "boş bırakılırsa e-posta gönderilmez",
    kontaktSpeichernTipp: (name: string) =>
      `İletişim e-postasını kaydeder - alan boş bırakılırsa adres kaldırılır. Öğrenci: ${name}.`,
    schliessenTipp: "Kaydetmeden alanı kapatır (Esc).",
    codeNeueKlasse: "Yeni sınıfın sınıf kodu",
    folgenTipp: (name: string, pruefung: string) =>
      `Öğrenci bundan sonra yeni sınıf koduyla giriş yapar. Yeni sınıfın öğretmenleri öğrenciyi ve ilerlemesini görür. ${pruefung} sonuçları ve mesajlar bu sınıfta kalır. Öğrenci: ${name}.`,
    zielBeispiel: "örn. 4A",
    verschiebeTipp: (name: string) =>
      `Onayınızdan sonra öğrenciyi bu sınıf koduna sahip sınıfa taşır. Öğrenci: ${name}.`,
    verschieben: "Taşı",
    nichtVerschiebenTipp: "Hiçbir şey taşımadan alanı kapatır (Esc).",
  },
  // ★ O-CS (03.10.2026): Lehrkraft vy-Mehrzahl, Knöpfe im Infinitiv (Glossar
  // Regel 1); Kinder = „žáci"/„osoba", Lehrkraft = „vyučující" (Regel 2); Namen,
  // Klassen und Codes nur nach Doppelpunkt oder hinter einem Kopfwort, nie
  // gebeugt (Regel 12); Mehrzahl mit vier Formen, das Verb zieht mit (§2.11);
  // Knopfnamen ohne Anführung (Regel 7); „Vytvořit třídu", „Přidat osobu",
  // „Přesunout do jiné třídy", „Přidat žáky ze souboru Excel" (§2.6).
  cs: {
    auswahlSpeichert: "Okamžik - výběr se ještě ukládá.",
    keinProgramm: "Není vybraný žádný program - zobrazuje se program, ze kterého sem přicházíte.",
    auswahlGespeichert: "Výběr programů se uložil.",
    programmeKlasse: "Programy této třídy",
    nurAnsicht: "Tento výběr nastavuje jen ",
    ihreAnsicht: "vaše zobrazení",
    nurAnsichtRest:
      ": nevybrané programy tu nemají kartu ani sloupec. Žáci mohou dál otevřít každý program - nic se nezamyká.",
    fehltName: "název třídy",
    fehltCodeGueltig:
      "platný kód třídy (2 až 12 znaků: písmena, číslice, tečka nebo spojovník)",
    fehltCode: "kód třídy",
    fehltSchulstufe: "ročník",
    fehltStart: "výchozí bod",
    und: " a ",
    fehltSatz: (liste: string) => `K vytvoření třídy ještě chybí: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} řádek`,
        few: (z) => `${z} řádky`,
        many: (z) => `${z} řádku`,
        other: (z) => `${z} řádků`,
      }),
    ersteSchritte: "První kroky",
    schrittKlasse: "Vytvořit třídu",
    schrittKlasseText:
      "Název, kód třídy, ročník, jazyk, výchozí bod a Třídní závod. Program navrhne kód podle názvu; můžete ho změnit. Tímto kódem se žáci přihlašují do všech výukových programů.",
    schrittLernende: "Přidat osobu",
    schrittLernendeText:
      "Jméno a heslo, nic dalšího. Potom můžete přihlašovací údaje vytisknout jako seznam a rozdat.",
    schrittProgramme: "Vybrat programy",
    schrittProgrammeText:
      "Které výukové programy tato třída používá? Nastavuje to jen vaše zobrazení - žáci mohou dál otevřít každý program.",
    erledigt: ", hotovo",
    jetztDran: ", teď na řadě",
    wirdGespeichert: "Ukládání...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Třída je vytvořená: ${name}. Tyto údaje se ale neuložily: ${liste}. ` +
      `Doplňte je prosím na kartě Tastenflow v části Nastavení třídy.`,
    klasseAngelegt: (name: string) => `Třída je vytvořená: ${name}.`,
    // ★ O-CS: `toUpperCase()` wie im Codefeld - der Code ist ein WERT, kein Text.
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Třída je vytvořená: ${name}. Požadovaný kód třídy (${gewuenscht.trim().toUpperCase()}) ` +
      `už používá jiná třída, proto platí kód třídy: ${code}.`,
    nameZuerst: "Nejdřív prosím napište jméno.",
    passwortKurz: "Heslo musí mít aspoň 4 znaky.",
    kontaktFalsch: "Kontaktní e-mail nevypadá správně - pole můžete nechat i prázdné.",
    kindAngelegt: (name: string) => `Účet vytvořen: ${name}.`,
    vorlageLaedt: (datei: string) => `Stahuje se šablona: ${datei}`,
    vorlageFehler: "Šablonu se nepodařilo vytvořit. Obnovte prosím stránku a zkuste to znovu.",
    listeWird: "Seznam třídy se připravuje.",
    listeLaedt: (klasse: string) => `Stahuje se seznam třídy: ${klasse}`,
    listeFehler: "Seznam třídy se nepodařilo vytvořit. Obnovte prosím stránku a zkuste to znovu.",
    nochSpeichern: "Okamžik - ukládání ještě probíhá.",
    dateiNichtOffen: "Soubor se nepodařilo otevřít. Vyberte ho prosím znovu.",
    dateiLeer: (datei: string) =>
      `V souboru ${datei} není pod záhlavím žádná osoba. Napište prosím jeden řádek pro každou osobu a soubor importujte znovu.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Náhled - přibude: ${anlegen}` +
      (abgelehnt ? `; vynechá se: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Z tohoto souboru nelze přidat nikoho - důvody jsou v náhledu. Opravte prosím soubor a importujte ho znovu.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Vytváření účtů: ${nr}/${von} (${name})...`,
    kontoNicht: "Účet se nepodařilo vytvořit.",
    ergebnisAngelegt: (anzahl: string) => `Přidáno: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Nepřidáno (${n}): ${liste}.`,
    ergebnisDrucken: "Jména a hesla najdete pod tlačítkem Vytisknout přihlašovací údaje.",
    anlegenLaeuft: "Vytváření účtů už probíhá - počkejte prosím, až skončí.",
    importAbgebrochen: "Import se přerušil - nevznikl žádný účet.",
    kindLoeschenFrage: (name: string) =>
      `Opravdu odstranit účet: ${name}? Zmizí veškerý pokrok ve VŠECH ` +
      `výukových programech. Tuto akci nelze vrátit zpět.`,
    kindGeloescht: (name: string) => `Účet odstraněn: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Opravdu odstranit třídu: ${name}?` +
      (n > 0
        ? ` Trvale se odstraní i účty žáků (${mehrzahl(n, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      })}) ` +
          `a jejich pokrok.`
        : "") +
      " Tuto akci nelze vrátit zpět.",
    klasseGeloescht: (name: string) => `Třída odstraněna: ${name}.`,
    klassennameFehlt: "Napište prosím název třídy.",
    codeFehlt: "Napište prosím kód třídy - žáci se tímto kódem přihlašují.",
    codeUngueltig:
      "Kód třídy musí mít 2 až 12 znaků: písmena, číslice, tečku nebo spojovník.",
    klasseGespeichert: "Třída je uložená.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Přesunuto: ${name}. Nová třída: ${klasse} (kód třídy: ${code}). ` +
      `Přihlašování od teď probíhá s tímto kódem.`,
    wochenberichtAn: "Týdenní přehled je zapnutý.",
    wochenberichtAus: "Týdenní přehled je vypnutý.",
    druckBlockiert: "Okno tisku se zablokovalo. Povolte prosím pro tuto stránku vyskakovací okna.",
    klassen: "Třídy",
    klasseWaehlenTipp: (name: string) => `Vybere třídu ${name} - všechny karty pak ukazují její žáky.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Třída ${name}${gewaehlt ? ", vybraná" : ""}`,
    neueKlasse: "Vytvořit novou třídu",
    neueKlasseInhalt: "- název, kód třídy, ročník, jazyk, výchozí bod, Třídní závod",
    neuProgrammeTitel: "Které programy třída používá?",
    neuProgrammeHinweis:
      "Tím se jen uspořádá váš pohled - žáci mohou dál otevřít každý program. Údaje pro Tastenflow (ročník, jazyk, výchozí bod, Třídní závod) se zobrazí, jen když je Tastenflow zaškrtnutý.",
    neuProgrammName: (label: string) => `${label} pro novou třídu`,
    fehltProgramm: "alespoň jeden program",
    klassenname: "Název třídy",
    klassennameBeispiel: "např. 3.B nebo Sluníčka",
    klassencode: "Kód třídy",
    klassencodeTipp:
      "Povinné. Žáci se tímto kódem přihlašují do každého výukového programu, se stejným jménem a heslem. Program kód navrhne podle názvu a můžete ho změnit: 2 až 12 znaků, písmena, číslice, tečka nebo spojovník.",
    klassencodeBeispiel: "např. 3B-SLUNCE",
    fuerTastenflowTipp:
      "Tyto údaje platí jen pro psaní všemi deseti (Tastenflow); ostatní programy je nemění. Později je můžete změnit na kartě Tastenflow v části Nastavení třídy.",
    fuerTastenflow: "Pro Tastenflow",
    bezugNeu: "nové třídy",
    bitteWaehlen: "Vyberte prosím",
    startHinweis: "co žáci už umí - platí i pro ty, kdo přibudou později",
    startSrHinweis:
      "Povinné. Klávesy až po tuto úroveň jsou od začátku odemčené pro každou osobu v této třídě - " +
      "i pro ty, kdo přibudou později. Kdo je už dál, nic neztratí.",
    anlegenTipp: "Vytvoří třídu se všemi údaji. Kód třídy pak platí ve všech výukových programech.",
    klasseAnlegen: "Vytvořit třídu",
    zuerstKlasse: "Nejdřív vytvořte třídu - žáci se přihlašují jejím kódem.",
    klasseVor: "Třída: ",
    codeFuerLernende: " - kód třídy pro žáky",
    bearbeitenTipp: "Změnit název nebo kód třídy.",
    klasseBearbeiten: "Upravit třídu",
    bearbeiten: " Upravit",
    loeschenTipp: "Odstraní tuto třídu se všemi žáky - až po potvrzení.",
    klasseLoeschen: "Odstranit třídu",
    klasseLoeschenKnopf: " Odstranit třídu",
    codeAendernTipp:
      "2 až 12 znaků, písmena, číslice, tečka nebo spojovník. Po změně se všichni žáci této třídy hned přihlašují novým kódem.",
    speichernTipp: "Uloží nový název a kód třídy.",
    speichern: "Uložit",
    abbrechenTipp: "Zavře úpravy beze změny.",
    abbrechen: "Zrušit",
    codeWarnVor: "⚠️ Po změně kódu",
    // ★ O-CS: das Verb zieht mit der Zahl (Glossar §2.11) - darum steht es hier.
    codeWarnWer: (n: number) =>
      mehrzahl(n, "cs", {
        one: () => "se osoba z této třídy přihlašuje",
        few: (z) => `se všichni žáci této třídy (${z}) přihlašují`,
        many: (z) => `se všichni žáci této třídy (${z}) přihlašují`,
        other: (z) => `se všichni žáci této třídy (${z}) přihlašují`,
      }),
    codeWarnMitte: "od teď ",
    codeWarnNeu: "novým",
    codeWarnEnde: " kódem.",
    wochenbericht: " Týdenní přehled e-mailem (jednou týdně, v pondělí, s čísly z Tastenflow)",
    wochenberichtAnAdresse: "na adresu ",
    lernende: "Žáci (",
    druckenTipp: "Vytiskněte jména, hesla a kód třídy u právě přidaných osob.",
    drucken: " Vytisknout přihlašovací údaje (",
    zurKlasse: "Přidat do třídy",
    nameTipp: "Stačí jméno. V této třídě smí být jen jednou - na velkých a malých písmenech nezáleží.",
    name: "Jméno",
    passwort: "Heslo",
    passwortBeispiel: "aspoň 4 znaky",
    zufallTipp: "Vytvoří heslo z 5 písmen a číslic, které se snadno píše, a vloží ho do pole.",
    zufall: "Náhodné",
    kontakt: "Kontaktní e-mail (nepovinné)",
    kontaktTipp:
      "Je-li tu adresa, přijdou přihlašovací údaje automaticky e-mailem - při přidání a při každém novém nastavení hesla.",
    kontaktBeispiel: "např. pro rodiče",
    womitAnfangen: "Tastenflow: kde začít?",
    womitTipp:
      "Co tato osoba už umí. Klávesy až sem jsou od začátku odemčené. Předem je vybraný výchozí bod třídy.",
    hinzufuegenTipp:
      "Přidá do této třídy osobu se jménem, heslem a - pro Tastenflow - výchozím bodem. Vše ostatní (jazyk, kompenzační pomůcky...) nastavíte později na kartě daného programu. Texty ke cvičení se řídí ročníkem třídy (zadává se při vytvoření třídy a s každým školním rokem se sám zvýší o jeden) - na rok narození se nikdo neptá. Potom se fokus vrátí do pole Jméno.",
    hinzufuegen: "Přidat",
    excelTitel: "Více osob najednou (Excel)",
    kommenInKlasse: "Žáci přibudou do této třídy: ",
    vorlageTipp: (datei: string) =>
      `Stáhne soubor Excel ${datei}: na listu Žáci nahoře třída a datum, pod tím výběr výchozího bodu pro všechny a 40 řádků k vyplnění; na listu Pokyny postup a seznam výchozích bodů. Napište jeden řádek pro každou osobu (jméno a heslo - prázdné heslo vytvoří program), pak soubor importujte tady; před přidáním uvidíte náhled.`,
    vorlage: "Stáhnout šablonu (Excel)",
    importTipp:
      "Otevře výběr souboru pro vyplněnou šablonu (.xlsx). Nejdřív se ukáže náhled - účty vzniknou až po potvrzení.",
    importieren: "Přidat žáky ze souboru Excel",
    listeTipp:
      "Stáhne soubor Word se jmény, hesly a kódem třídy VŠECH žáků této třídy - k vytištění a rozdání.",
    liste: "Stáhnout seznam třídy",
    vorschauVor: "Náhled: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Přibude do třídy ${klasse}: ${wort}. ` +
      `Uloží se to až po stisknutí tlačítka Přidat.`,
    vorschauKeiner: "Z tohoto souboru nepřibude nikdo.",
    escape: "Esc přeruší.",
    passwortPunkt: " - Heslo",
    passwortErzeugt: " (heslo vytvořil program)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (výchozí bod třídy)",
    vorgabe: " (výchozí)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "cs", {
        one: (z) => `${z} řádek`,
        few: (z) => `${z} řádky`,
        many: (z) => `${z} řádku`,
        other: (z) => `${z} řádků`,
      }),
      " ",
      mehrzahl(n, "cs", {
        one: () => "se vynechá",
        few: () => "se vynechají",
        many: () => "se vynechá",
        other: () => "se vynechá",
      }),
    ],
    korrigieren:
      "Tyto řádky můžete v souboru opravit a později importovat znovu. Osoby, které už ve třídě jsou, se v náhledu ukážou s poznámkou „Toto jméno už ve třídě je.“",
    anlegenTippImport:
      "Přidá do této třídy postupně osoby z náhledu. Potom přejde fokus na nadpis Žáci, pod ním je výsledek.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Přidat: ",
      mehrzahl(n, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      }),
    ],
    verwerfenTipp: "Zahodí náhled, aniž by se někdo přidal (Esc).",
    nochKeine:
      "Zatím tu nejsou žádní žáci. Přidejte je výše - pak se přihlašují kódem třídy, jménem a heslem (z jakéhokoli zařízení).",
    wirdVerschoben: "Přesouvání...",
    verschiebenLaeuft: "Okamžik - přesouvání ještě probíhá.",
    zielFehlt: "Napište prosím kód nové třídy.",
    // ★ O-CS: „Výzev" (Genitiv Mehrzahl) steht fest - der Platzhalter käme im Nominativ.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Přesunout do třídy s kódem ${code}: ${name}?\n\n` +
      `- Přihlašování pak probíhá s novým kódem třídy.\n` +
      `- Vyučující nové třídy uvidí tuto osobu a její pokrok.\n` +
      `- Výsledky Výzev a zprávy zůstanou v předchozí třídě.\n` +
      `- Pokud novou třídu nevedete i vy, tuto osobu už neuvidíte.`,
    nichtsVerschoben: "Nic se nepřesunulo.",
    emailFalsch: "Tohle nevypadá jako e-mailová adresa - pole můžete nechat i prázdné.",
    kontaktGespeichert: "Kontaktní e-mail je uložený.",
    kontaktEntfernt: "Kontaktní e-mail je odstraněný.",
    passwortTipp: (name: string) => `Otevře a zavře pole pro nové heslo. Osoba: ${name}.`,
    passwortAendern: "Změnit heslo",
    kontaktKnopfTipp: (name: string) =>
      `Otevře a zavře pole pro kontaktní e-mail. Osoba: ${name}. Je-li vyplněný, přijde heslo automaticky e-mailem, jakmile se nastaví nebo změní.`,
    kontaktKnopfName: (name: string) => `Kontaktní e-mail: ${name}`,
    kontaktKnopf: "Kontaktní e-mail",
    verschiebenTipp: (name: string) =>
      `Otevře pole pro přesun do jiné třídy - i do třídy jiných vyučujících, pokud znáte její kód třídy. Osoba: ${name}.`,
    verschiebenName: (name: string) => `Přesunout do jiné třídy: ${name}`,
    verschiebenKnopf: "Přesunout do jiné třídy",
    loeschenKindTipp: (name: string) =>
      `Odstraní účet i pokrok ve všech výukových programech - až po potvrzení. Osoba: ${name}.`,
    loeschenKindName: (name: string) => `Odstranit: ${name}`,
    loeschenKnopf: " Odstranit",
    kontaktVon: "Kontaktní e-mail: ",
    kontaktLeer: "prázdné pole = bez e-mailu",
    kontaktSpeichernTipp: (name: string) =>
      `Uloží kontaktní e-mail - prázdné pole ho odstraní. Osoba: ${name}.`,
    schliessenTipp: "Zavře pole bez uložení (Esc).",
    codeNeueKlasse: "Kód nové třídy",
    folgenTipp: (name: string, _pruefung: string) =>
      `Přihlašování pak probíhá s novým kódem třídy. Vyučující nové třídy uvidí tuto osobu a její pokrok. Výsledky Výzev a zprávy zůstanou v této třídě. Osoba: ${name}.`,
    zielBeispiel: "např. 4A",
    verschiebeTipp: (name: string) =>
      `Po potvrzení přesune do třídy s tímto kódem. Osoba: ${name}.`,
    verschieben: "Přesunout",
    nichtVerschiebenTipp: "Zavře pole bez přesunu (Esc).",
  },
  bg: {
    auswahlSpeichert: "Момент - изборът още се записва.",
    keinProgramm: "Няма избрана програма - показва се програмата, от която идвате.",
    auswahlGespeichert: "Изборът на програми е записан.",
    programmeKlasse: "Програми на този клас",
    nurAnsicht: "Този избор променя само ",
    ihreAnsicht: "вашия изглед",
    nurAnsichtRest:
      ": програмите, които не са избрани, нямат тук раздел и колона. Учениците могат да отварят всяка програма както досега - нищо не се заключва.",
    fehltName: "името на класа",
    fehltCodeGueltig:
      "валиден код на класа (от 2 до 12 знака: букви, цифри, точка или малко тире)",
    fehltCode: "кодът на класа",
    fehltSchulstufe: "класът в училище",
    fehltStart: "началната точка",
    und: " и ",
    fehltSatz: (liste: string) => `За създаването на класа още липсват данни: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `${z} ученик`,
        other: (z) => `${z} ученици`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `${z} ред`,
        other: (z) => `${z} реда`,
      }),
    ersteSchritte: "Първи стъпки",
    schrittKlasse: "Създаване на клас",
    schrittKlasseText:
      "Име, код на класа, клас в училище, език, начална точка и Състезание в класа. Програмата предлага код според името - можете да го промените. С този код учениците влизат във всички програми за обучение.",
    schrittLernende: "Добавяне на ученици",
    schrittLernendeText:
      "Име и парола, нищо повече. После можете да отпечатате данните за вход като списък и да ги раздадете.",
    schrittProgramme: "Избор на програми",
    schrittProgrammeText:
      "Кои програми за обучение използва този клас? Това подрежда само вашия изглед - учениците могат да отварят всяка програма както досега.",
    erledigt: ", готово",
    jetztDran: ", следваща стъпка",
    wirdGespeichert: "Записване...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Класът е създаден: ${name}. Тези данни обаче не бяха записани: ${liste}. ` +
      `Добавете ги в раздела Tastenflow, в частта Настройки на класа.`,
    klasseAngelegt: (name: string) => `Класът е създаден: ${name}.`,
    // Der Code ist ein WERT: toUpperCase wie im Codefeld.
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Класът е създаден: ${name}. Желаният код на класа (${gewuenscht.trim().toUpperCase()}) ` +
      `вече се използва от друг клас, затова важи кодът на класа: ${code}.`,
    nameZuerst: "Първо въведете име.",
    passwortKurz: "Паролата трябва да има поне 4 знака.",
    kontaktFalsch: "Имейлът за контакт не изглежда правилен - можете да оставите полето и празно.",
    kindAngelegt: (name: string) => `Акаунтът е създаден: ${name}.`,
    vorlageLaedt: (datei: string) => `Шаблонът се изтегля: ${datei}`,
    vorlageFehler: "Шаблонът не можа да бъде създаден. Презаредете страницата и опитайте отново.",
    listeWird: "Списъкът на класа се подготвя.",
    listeLaedt: (klasse: string) => `Списъкът на класа се изтегля: ${klasse}`,
    listeFehler: "Списъкът на класа не можа да бъде създаден. Презаредете страницата и опитайте отново.",
    nochSpeichern: "Момент - записването още не е приключило.",
    dateiNichtOffen: "Файлът не можа да бъде отворен. Изберете го отново.",
    dateiLeer: (datei: string) =>
      `Във файла ${datei} под заглавния ред няма нито един ученик. Попълнете по един ред за всеки ученик и заредете файла отново.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Предварителен преглед - ще бъдат добавени: ${anlegen}` +
      (abgelehnt ? `, ще бъдат пропуснати: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "От този файл не може да бъде добавен нито един ученик - причините са в предварителния преглед. Поправете файла и го заредете отново.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Създаване на акаунти: ${nr}/${von} (${name})...`,
    kontoNicht: "Акаунтът не можа да бъде създаден.",
    ergebnisAngelegt: (anzahl: string) => `Добавени: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Недобавени (${n}): ${liste}.`,
    ergebnisDrucken: "Имената и паролите са под бутона Отпечатай данните за вход.",
    anlegenLaeuft: "Акаунтите вече се създават - изчакайте, докато приключи.",
    importAbgebrochen: "Добавянето от файла е прекъснато - не е създаден нито един акаунт.",
    kindLoeschenFrage: (name: string) =>
      `Наистина ли да се изтрие акаунтът: ${name}? Целият напредък във ВСИЧКИ ` +
      `програми за обучение ще изчезне. Това действие не може да бъде отменено.`,
    kindGeloescht: (name: string) => `Акаунтът е изтрит: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Наистина ли да се изтрие класът: ${name}?` +
      (n > 0
        ? ` Завинаги се изтриват и акаунтите на учениците (${mehrzahl(n, "bg", {
            one: (z) => `${z} ученик`,
            other: (z) => `${z} ученици`,
          })}) ` + `и техният напредък.`
        : "") +
      " Това действие не може да бъде отменено.",
    klasseGeloescht: (name: string) => `Класът е изтрит: ${name}.`,
    klassennameFehlt: "Въведете име на класа.",
    codeFehlt: "Въведете код на класа - с него учениците влизат.",
    codeUngueltig:
      "Кодът на класа трябва да има от 2 до 12 знака: букви, цифри, точка или малко тире.",
    klasseGespeichert: "Класът е записан.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Преместено: ${name}. Нов клас: ${klasse} (код на класа: ${code}). ` +
      `Отсега входът е с този код.`,
    wochenberichtAn: "Седмичният отчет е включен.",
    wochenberichtAus: "Седмичният отчет е изключен.",
    druckBlockiert: "Прозорецът за печат беше блокиран. Разрешете изскачащите прозорци за тази страница.",
    klassen: "Класове",
    klasseWaehlenTipp: (name: string) => `Избира класа ${name} - после всички раздели показват неговите ученици.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Клас ${name}${gewaehlt ? ", избран" : ""}`,
    neueKlasse: "Създай нов клас",
    neueKlasseInhalt: "- име, код на класа, клас в училище, език, начална точка, Състезание в класа",
    neuProgrammeTitel: "Кои програми използва класът?",
    neuProgrammeHinweis:
      "Това подрежда само вашия изглед - учениците могат да отварят всяка програма както досега. Данните за Tastenflow (клас в училище, език, начална точка, Състезание в класа) се показват само когато Tastenflow е избран.",
    neuProgrammName: (label: string) => `${label} за новия клас`,
    fehltProgramm: "поне една програма",
    klassenname: "Име на класа",
    klassennameBeispiel: "напр. 3б или Слънчогледи",
    klassencode: "Код на класа",
    klassencodeTipp:
      "Задължително. С този код учениците влизат във всяка програма за обучение, със същото име и парола. Програмата предлага код според името, а вие можете да го промените: от 2 до 12 знака, букви, цифри, точка или малко тире.",
    klassencodeBeispiel: "напр. 3B-SOFIA",
    fuerTastenflowTipp:
      "Тези данни важат само за писането с десет пръста (Tastenflow) - другите програми не ги променят. По-късно можете да ги промените в раздела Tastenflow, в частта Настройки на класа.",
    fuerTastenflow: "За Tastenflow",
    // Steht nach einem Feldnamen (KlassenEinstellungsFelder setzt den Bezug selbst davor).
    bezugNeu: "новия клас",
    bitteWaehlen: "Изберете",
    startHinweis: "какво вече умеят учениците - важи и за тези, които се добавят по-късно",
    startSrHinweis:
      "Задължително. Клавишите до това ниво са отключени от самото начало за всеки ученик в този клас - " +
      "и за тези, които се добавят по-късно. Който вече е по-напред, не губи нищо.",
    anlegenTipp: "Създава класа с всички тези данни. После кодът на класа важи във всички програми за обучение.",
    klasseAnlegen: "Създай клас",
    zuerstKlasse: "Първо създайте клас - учениците влизат с неговия код.",
    klasseVor: "Клас: ",
    codeFuerLernende: " - код на класа за учениците",
    bearbeitenTipp: "Промяна на името или кода на класа.",
    klasseBearbeiten: "Редактирай класа",
    bearbeiten: " Редактирай",
    loeschenTipp: "Изтрива този клас с всички ученици - след потвърждение.",
    klasseLoeschen: "Изтрий класа",
    klasseLoeschenKnopf: " Изтрий класа",
    codeAendernTipp:
      "От 2 до 12 знака, букви, цифри, точка или малко тире. След промяната всички ученици от този клас веднага влизат с новия код.",
    speichernTipp: "Записва новото име и новия код на класа.",
    speichern: "Запиши",
    abbrechenTipp: "Затваря редактирането без промени.",
    abbrechen: "Отказ",
    codeWarnVor: "⚠️ След промяната на кода",
    // Das Verb zieht mit der Zahl (Glossar §2.11) - darum steht es hier.
    codeWarnWer: (n: number) =>
      mehrzahl(n, "bg", {
        one: () => "ученикът от този клас влиза",
        other: (z) => `всички ученици от този клас (${z}) влизат`,
      }),
    codeWarnMitte: "отсега ",
    codeWarnNeu: "с новия",
    codeWarnEnde: " код.",
    wochenbericht: " Седмичен отчет по имейл (веднъж седмично, в понеделник, с числата от Tastenflow)",
    wochenberichtAnAdresse: "до ",
    lernende: "Ученици (",
    druckenTipp: "Отпечатайте имената, паролите и кода на класа на току-що добавените ученици.",
    drucken: " Отпечатай данните за вход (",
    zurKlasse: "Добави в класа",
    nameTipp: "Достатъчно е име. В този клас то може да се среща само веднъж - главните и малките букви нямат значение.",
    name: "Име",
    passwort: "Парола",
    passwortBeispiel: "поне 4 знака",
    zufallTipp: "Създава лесна за писане парола от 5 букви и цифри и я поставя в полето.",
    zufall: "Случайна",
    kontakt: "Имейл за контакт (по желание)",
    kontaktTipp:
      "Ако тук има адрес, данните за вход пристигат автоматично по имейл - при добавянето и при всяка нова парола.",
    kontaktBeispiel: "напр. за родителите",
    womitAnfangen: "Tastenflow: откъде да започнете?",
    womitTipp:
      "Какво вече умее ученикът. Клавишите дотук са отключени от самото начало. Предварително е избрана началната точка на класа.",
    hinzufuegenTipp:
      "Добавя в този клас ученик с име, парола и - за Tastenflow - начална точка. Всичко останало (език, помощни средства...) настройвате после в раздела на съответната програма. Текстовете за упражнение следват класа в училище (въвежда се при създаването на класа и всяка учебна година сам се вдига с един) - година на раждане не се пита. После фокусът се връща в полето Име.",
    hinzufuegen: "Добави",
    excelTitel: "Много ученици наведнъж (Excel)",
    kommenInKlasse: "Учениците ще бъдат добавени в този клас: ",
    vorlageTipp: (datei: string) =>
      `Изтегля файла на Excel ${datei}: в листа Ученици горе са класът и датата, под тях изборът на начална точка за всички и 40 реда за попълване, в листа Указания - стъпките и списъкът на началните точки. Попълнете по един ред за всеки ученик (име и парола - празна парола програмата създава сама), после заредете файла тук. Преди добавянето ще видите предварителен преглед.`,
    vorlage: "Изтегли шаблона (Excel)",
    importTipp:
      "Отваря избора на файл за попълнения шаблон (.xlsx). Първо се показва предварителен преглед - акаунтите се създават едва след потвърждение.",
    importieren: "Добави ученици от файл на Excel",
    listeTipp:
      "Изтегля файл на Word с имената, паролите и кода на класа на ВСИЧКИ ученици в този клас - за отпечатване и раздаване.",
    liste: "Изтегли списъка на класа",
    vorschauVor: "Предварителен преглед: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Ще бъдат добавени в класа ${klasse}: ${wort}. ` +
      `Записва се едва след натискане на бутона Добави.`,
    vorschauKeiner: "От този файл няма да бъде добавен никой.",
    escape: "Esc прекъсва.",
    passwortPunkt: " - Парола",
    passwortErzeugt: " (паролата е създадена от програмата)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (начална точка на класа)",
    vorgabe: " (по подразбиране)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "bg", {
        one: (z) => `${z} ред`,
        other: (z) => `${z} реда`,
      }),
      " ",
      mehrzahl(n, "bg", {
        one: () => "ще бъде пропуснат",
        other: () => "ще бъдат пропуснати",
      }),
    ],
    korrigieren:
      "Можете да поправите тези редове във файла и по-късно да го заредите отново. Учениците, които вече са в класа, се показват в предварителния преглед с бележката „Това име вече го има в класа.“",
    anlegenTippImport:
      "Добавя в този клас един след друг учениците от предварителния преглед. После фокусът отива на заглавието Ученици, под него е резултатът.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Добави: ",
      mehrzahl(n, "bg", {
        one: (z) => `${z} ученик`,
        other: (z) => `${z} ученици`,
      }),
    ],
    verwerfenTipp: "Отхвърля предварителния преглед, без да добавя никого (Esc).",
    nochKeine:
      "Все още няма ученици. Добавете ги по-горе - после те влизат с кода на класа, името и паролата си (от всяко устройство).",
    wirdVerschoben: "Преместване...",
    verschiebenLaeuft: "Момент - преместването още не е приключило.",
    zielFehlt: "Въведете кода на новия клас.",
    // Wie cs: das Wort für die Tippchallenge steht fest in der Mehrzahl.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Да се премести ли в класа с код ${code}: ${name}?\n\n` +
      `- После входът е с новия код на класа.\n` +
      `- Учителите на новия клас ще виждат този ученик и напредъка му.\n` +
      `- Резултатите от предизвикателствата и съобщенията остават в предишния клас.\n` +
      `- Ако не водите и новия клас, повече няма да виждате този ученик.`,
    nichtsVerschoben: "Нищо не е преместено.",
    emailFalsch: "Това не изглежда като имейл адрес - можете да оставите полето и празно.",
    kontaktGespeichert: "Имейлът за контакт е записан.",
    kontaktEntfernt: "Имейлът за контакт е премахнат.",
    passwortTipp: (name: string) => `Отваря и затваря полето за нова парола. Ученик: ${name}.`,
    passwortAendern: "Смени паролата",
    kontaktKnopfTipp: (name: string) =>
      `Отваря и затваря полето за имейл за контакт. Ученик: ${name}. Ако е попълнено, паролата пристига автоматично по имейл, щом бъде зададена или сменена.`,
    kontaktKnopfName: (name: string) => `Имейл за контакт: ${name}`,
    kontaktKnopf: "Имейл за контакт",
    verschiebenTipp: (name: string) =>
      `Отваря полето за преместване в друг клас - и в клас на друг учител, ако знаете кода на класа. Ученик: ${name}.`,
    verschiebenName: (name: string) => `Премести в друг клас: ${name}`,
    verschiebenKnopf: "Премести в друг клас",
    loeschenKindTipp: (name: string) =>
      `Изтрива акаунта и напредъка във всички програми за обучение - след потвърждение. Ученик: ${name}.`,
    loeschenKindName: (name: string) => `Изтрий: ${name}`,
    loeschenKnopf: " Изтрий",
    kontaktVon: "Имейл за контакт: ",
    kontaktLeer: "празно поле = без имейл",
    kontaktSpeichernTipp: (name: string) =>
      `Записва имейла за контакт - празно поле го премахва. Ученик: ${name}.`,
    schliessenTipp: "Затваря полето без записване (Esc).",
    codeNeueKlasse: "Код на новия клас",
    folgenTipp: (name: string, _pruefung: string) =>
      `После входът е с новия код на класа. Учителите на новия клас ще виждат този ученик и напредъка му. Резултатите от предизвикателствата и съобщенията остават в този клас. Ученик: ${name}.`,
    zielBeispiel: "напр. 4A",
    verschiebeTipp: (name: string) =>
      `След потвърждение премества в класа с този код. Ученик: ${name}.`,
    verschieben: "Премести",
    nichtVerschiebenTipp: "Затваря полето без преместване (Esc).",
  },
  el: {
    auswahlSpeichert: "Μια στιγμή - η επιλογή αποθηκεύεται ακόμα.",
    keinProgramm: "Δεν έχει επιλεγεί πρόγραμμα - εμφανίζεται το πρόγραμμα από το οποίο ήρθατε εδώ.",
    auswahlGespeichert: "Η επιλογή προγραμμάτων αποθηκεύτηκε.",
    programmeKlasse: "Προγράμματα αυτού του τμήματος",
    nurAnsicht: "Αυτή η επιλογή ρυθμίζει μόνο ",
    ihreAnsicht: "τη δική σας προβολή",
    nurAnsichtRest:
      ": τα προγράμματα που δεν επιλέξατε δεν έχουν εδώ καρτέλα ούτε στήλη. Τα παιδιά μπορούν να ανοίγουν κάθε πρόγραμμα όπως πριν - τίποτα δεν κλειδώνει.",
    fehltName: "το όνομα του τμήματος",
    fehltCodeGueltig:
      "ένας έγκυρος κωδικός τμήματος (2 έως 12 χαρακτήρες: λατινικά γράμματα, ψηφία, τελεία ή παύλα)",
    fehltCode: "ο κωδικός τμήματος",
    fehltSchulstufe: "η τάξη",
    fehltStart: "το σημείο εκκίνησης",
    und: " και ",
    fehltSatz: (liste: string) => `Για τη δημιουργία του τμήματος λείπει ακόμα: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `${z} άτομο`,
        other: (z) => `${z} άτομα`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `${z} γραμμή`,
        other: (z) => `${z} γραμμές`,
      }),
    ersteSchritte: "Πρώτα βήματα",
    schrittKlasse: "Δημιουργία τμήματος",
    schrittKlasseText:
      "Όνομα, κωδικός τμήματος, τάξη, γλώσσα, σημείο εκκίνησης και Αγώνας τμήματος. Το πρόγραμμα προτείνει έναν κωδικό με βάση το όνομα. Μπορείτε να τον αλλάξετε. Με αυτόν τον κωδικό τα παιδιά συνδέονται σε όλες τις εφαρμογές μάθησης.",
    schrittLernende: "Προσθήκη ατόμου",
    schrittLernendeText:
      "Όνομα και κωδικός πρόσβασης, τίποτα άλλο. Μετά μπορείτε να εκτυπώσετε τα στοιχεία σύνδεσης ως λίστα και να τα μοιράσετε.",
    schrittProgramme: "Επιλογή προγραμμάτων",
    schrittProgrammeText:
      "Ποιες εφαρμογές μάθησης χρησιμοποιεί αυτό το τμήμα; Αυτό ρυθμίζει μόνο τη δική σας προβολή - τα παιδιά μπορούν να ανοίγουν κάθε πρόγραμμα όπως πριν.",
    erledigt: ", ολοκληρώθηκε",
    jetztDran: ", σειρά έχει τώρα",
    wirdGespeichert: "Αποθήκευση...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Το τμήμα δημιουργήθηκε: ${name}. Αυτά τα στοιχεία όμως δεν αποθηκεύτηκαν: ${liste}. ` +
      `Συμπληρώστε τα στην καρτέλα Tastenflow, στις «Ρυθμίσεις τμήματος».`,
    klasseAngelegt: (name: string) => `Το τμήμα δημιουργήθηκε: ${name}.`,
    // `toUpperCase()` wie im Codefeld - der Code ist ein WERT, kein Text.
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Το τμήμα δημιουργήθηκε: ${name}. Τον κωδικό τμήματος που ζητήσατε (${gewuenscht.trim().toUpperCase()}) ` +
      `τον χρησιμοποιεί ήδη άλλο τμήμα, για αυτό ισχύει ο κωδικός τμήματος: ${code}.`,
    nameZuerst: "Γράψτε πρώτα ένα όνομα.",
    passwortKurz: "Ο κωδικός πρόσβασης χρειάζεται τουλάχιστον 4 χαρακτήρες.",
    kontaktFalsch: "Το e-mail επικοινωνίας δεν φαίνεται σωστό - μπορείτε και να αφήσετε το πεδίο κενό.",
    kindAngelegt: (name: string) => `Ο λογαριασμός δημιουργήθηκε: ${name}.`,
    vorlageLaedt: (datei: string) => `Λήψη προτύπου: ${datei}`,
    vorlageFehler: "Το πρότυπο δεν δημιουργήθηκε. Ανανεώστε τη σελίδα και δοκιμάστε ξανά.",
    listeWird: "Ο κατάλογος τμήματος ετοιμάζεται.",
    listeLaedt: (klasse: string) => `Λήψη καταλόγου τμήματος: ${klasse}`,
    listeFehler: "Ο κατάλογος τμήματος δεν δημιουργήθηκε. Ανανεώστε τη σελίδα και δοκιμάστε ξανά.",
    nochSpeichern: "Μια στιγμή - η αποθήκευση συνεχίζεται ακόμα.",
    dateiNichtOffen: "Το αρχείο δεν άνοιξε. Επιλέξτε το ξανά.",
    dateiLeer: (datei: string) =>
      `Στο αρχείο ${datei} δεν υπάρχει κανένα άτομο κάτω από την κεφαλίδα. Γράψτε μία γραμμή για κάθε άτομο και εισαγάγετε ξανά το αρχείο.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Προεπισκόπηση - προστίθενται: ${anlegen}` +
      (abgelehnt ? `. Δεν περνούν: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Από αυτό το αρχείο δεν μπορεί να προστεθεί κανείς - οι λόγοι φαίνονται στην προεπισκόπηση. Διορθώστε το αρχείο και εισαγάγετε το ξανά.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Δημιουργία λογαριασμών: ${nr} από ${von} (${name})...`,
    kontoNicht: "Ο λογαριασμός δεν δημιουργήθηκε.",
    ergebnisAngelegt: (anzahl: string) => `Προστέθηκαν: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Δεν προστέθηκαν (${n}): ${liste}.`,
    ergebnisDrucken: "Τα ονόματα και οι κωδικοί πρόσβασης βρίσκονται στο κουμπί «Εκτύπωση στοιχείων σύνδεσης».",
    anlegenLaeuft: "Η δημιουργία λογαριασμών είναι ήδη σε εξέλιξη - περιμένετε μέχρι να τελειώσει.",
    importAbgebrochen: "Η εισαγωγή διακόπηκε - δεν δημιουργήθηκε κανένας λογαριασμός.",
    kindLoeschenFrage: (name: string) =>
      `Θέλετε σίγουρα να διαγράψετε τον λογαριασμό: ${name}; Χάνεται όλη η πρόοδος σε ΟΛΕΣ ` +
      `τις εφαρμογές μάθησης. Αυτό δεν αναιρείται.`,
    kindGeloescht: (name: string) => `Ο λογαριασμός διαγράφηκε: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Θέλετε σίγουρα να διαγράψετε το τμήμα: ${name};` +
      (n > 0
        ? ` Διαγράφονται οριστικά και οι λογαριασμοί των μαθητών (${mehrzahl(n, "el", {
        one: (z) => `${z} άτομο`,
        other: (z) => `${z} άτομα`,
      })}) ` +
          `μαζί με την πρόοδό τους.`
        : "") +
      " Αυτό δεν αναιρείται.",
    klasseGeloescht: (name: string) => `Το τμήμα διαγράφηκε: ${name}.`,
    klassennameFehlt: "Γράψτε ένα όνομα τμήματος.",
    codeFehlt: "Γράψτε έναν κωδικό τμήματος - με αυτόν συνδέονται τα παιδιά.",
    codeUngueltig:
      "Ο κωδικός τμήματος μπορεί να έχει 2 έως 12 χαρακτήρες: λατινικά γράμματα, ψηφία, τελεία ή παύλα.",
    klasseGespeichert: "Το τμήμα αποθηκεύτηκε.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Μετακινήθηκε: ${name}. Νέο τμήμα: ${klasse} (κωδικός τμήματος: ${code}). ` +
      `Η σύνδεση γίνεται από τώρα με αυτόν τον κωδικό.`,
    wochenberichtAn: "Η εβδομαδιαία σύνοψη ενεργοποιήθηκε.",
    wochenberichtAus: "Η εβδομαδιαία σύνοψη απενεργοποιήθηκε.",
    druckBlockiert: "Το παράθυρο εκτύπωσης μπλοκαρίστηκε. Επιτρέψτε τα αναδυόμενα παράθυρα για αυτή τη σελίδα.",
    klassen: "Τμήματα",
    klasseWaehlenTipp: (name: string) => `Επιλέγει το τμήμα ${name} - όλες οι καρτέλες δείχνουν μετά τους μαθητές του.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Τμήμα ${name}${gewaehlt ? ", επιλεγμένο" : ""}`,
    neueKlasse: "Δημιουργία νέου τμήματος",
    neueKlasseInhalt: "- όνομα, κωδικός τμήματος, τάξη, γλώσσα, σημείο εκκίνησης, Αγώνας τμήματος",
    neuProgrammeTitel: "Ποια προγράμματα χρησιμοποιεί το τμήμα;",
    neuProgrammeHinweis:
      "Αυτό οργανώνει μόνο τη δική σας προβολή - τα παιδιά μπορούν να ανοίγουν κάθε πρόγραμμα όπως πριν. Τα στοιχεία για το Tastenflow (τάξη, γλώσσα, σημείο εκκίνησης, Αγώνας τμήματος) εμφανίζονται μόνο όταν είναι επιλεγμένο το Tastenflow.",
    neuProgrammName: (label: string) => `${label} για το νέο τμήμα`,
    fehltProgramm: "τουλάχιστον ένα πρόγραμμα",
    klassenname: "Όνομα τμήματος",
    klassennameBeispiel: "π.χ. Γ2 ή Προπαρασκευαστικό",
    klassencode: "Κωδικός τμήματος",
    klassencodeTipp:
      "Υποχρεωτικό. Με αυτόν τον κωδικό τα παιδιά συνδέονται σε κάθε εφαρμογή μάθησης, με το ίδιο όνομα και τον ίδιο κωδικό πρόσβασης. Το πρόγραμμα προτείνει τον κωδικό με βάση το όνομα και μπορείτε να τον αλλάξετε: 2 έως 12 χαρακτήρες, λατινικά γράμματα, ψηφία, τελεία ή παύλα.",
    klassencodeBeispiel: "π.χ. G2-ATHINA",
    fuerTastenflowTipp:
      "Αυτά τα στοιχεία ισχύουν μόνο για τη δακτυλογράφηση με δέκα δάχτυλα (Tastenflow). Τα άλλα προγράμματα δεν τα αλλάζουν. Αργότερα μπορείτε να τα αλλάξετε στην καρτέλα Tastenflow, στις «Ρυθμίσεις τμήματος».",
    fuerTastenflow: "Για το Tastenflow",
    bezugNeu: "του νέου τμήματος",
    bitteWaehlen: "Επιλέξτε",
    startHinweis: "τι ξέρουν ήδη τα παιδιά - ισχύει και για όσους έρθουν αργότερα",
    startSrHinweis:
      "Υποχρεωτικό. Τα πλήκτρα μέχρι αυτό το σημείο είναι από την αρχή ξεκλείδωτα για κάθε παιδί αυτού του τμήματος - " +
      "και για όσους έρθουν αργότερα. Ένα παιδί που έχει ήδη προχωρήσει πιο πέρα δεν χάνει τίποτα.",
    anlegenTipp: "Δημιουργεί το τμήμα με όλα τα στοιχεία. Ο κωδικός τμήματος ισχύει μετά σε όλες τις εφαρμογές μάθησης.",
    klasseAnlegen: "Δημιουργία τμήματος",
    zuerstKlasse: "Δημιουργήστε πρώτα ένα τμήμα - τα παιδιά συνδέονται με τον κωδικό του.",
    klasseVor: "Τμήμα: ",
    codeFuerLernende: " - κωδικός τμήματος για τους μαθητές",
    bearbeitenTipp: "Αλλαγή ονόματος ή κωδικού τμήματος.",
    klasseBearbeiten: "Επεξεργασία τμήματος",
    bearbeiten: " Επεξεργασία",
    loeschenTipp: "Διαγράφει αυτό το τμήμα μαζί με όλους τους μαθητές - μόνο μετά από επιβεβαίωση.",
    klasseLoeschen: "Διαγραφή τμήματος",
    klasseLoeschenKnopf: " Διαγραφή τμήματος",
    codeAendernTipp:
      "2 έως 12 χαρακτήρες, λατινικά γράμματα, ψηφία, τελεία ή παύλα. Αν τον αλλάξετε, όλα τα παιδιά αυτού του τμήματος συνδέονται αμέσως με τον νέο κωδικό.",
    speichernTipp: "Αποθηκεύει το νέο όνομα και τον νέο κωδικό τμήματος.",
    speichern: "Αποθήκευση",
    abbrechenTipp: "Κλείνει την επεξεργασία χωρίς αλλαγές.",
    abbrechen: "Άκυρο",
    codeWarnVor: "⚠️ Αν αλλάξει ο κωδικός,",
    // Das Verb zieht mit der Zahl - darum steht es hier.
    codeWarnWer: (n: number) =>
      mehrzahl(n, "el", {
        one: () => "το παιδί αυτού του τμήματος συνδέεται",
        other: (z) => `και τα ${z} παιδιά αυτού του τμήματος συνδέονται`,
      }),
    codeWarnMitte: "από εκεί και πέρα με τον ",
    codeWarnNeu: "νέο",
    codeWarnEnde: " κωδικό.",
    wochenbericht: " Εβδομαδιαία σύνοψη με e-mail (μία φορά την εβδομάδα, τη Δευτέρα, με τα στοιχεία του Tastenflow)",
    wochenberichtAnAdresse: "στη διεύθυνση ",
    lernende: "Μαθητές (",
    druckenTipp: "Εκτύπωση ονομάτων, κωδικών πρόσβασης και κωδικού τμήματος για τα άτομα που μόλις προστέθηκαν.",
    drucken: " Εκτύπωση στοιχείων σύνδεσης (",
    zurKlasse: "Προσθήκη στο τμήμα",
    nameTipp: "Αρκεί το μικρό όνομα. Πρέπει να υπάρχει μόνο μία φορά σε αυτό το τμήμα - κεφαλαία και πεζά δεν μετράνε.",
    name: "Όνομα",
    passwort: "Κωδικός πρόσβασης",
    passwortBeispiel: "τουλάχιστον 4 χαρακτήρες",
    zufallTipp: "Δημιουργεί έναν κωδικό πρόσβασης με 5 γράμματα και ψηφία, που γράφεται εύκολα, και τον βάζει στο πεδίο.",
    zufall: "Τυχαίος",
    kontakt: "E-mail επικοινωνίας (προαιρετικά)",
    kontaktTipp:
      "Αν υπάρχει εδώ διεύθυνση, τα στοιχεία σύνδεσης στέλνονται αυτόματα με e-mail - κατά την προσθήκη και σε κάθε νέα αλλαγή του κωδικού πρόσβασης.",
    kontaktBeispiel: "π.χ. για τους γονείς",
    womitAnfangen: "Tastenflow: από πού να ξεκινήσετε;",
    womitTipp:
      "Τι ξέρει ήδη αυτό το παιδί. Τα πλήκτρα μέχρι εδώ είναι από την αρχή ξεκλείδωτα. Προεπιλεγμένο είναι το σημείο εκκίνησης του τμήματος.",
    hinzufuegenTipp:
      "Προσθέτει σε αυτό το τμήμα ένα παιδί με όνομα, κωδικό πρόσβασης και - για το Tastenflow - σημείο εκκίνησης. Όλα τα άλλα (γλώσσα, υποστηρικτική τεχνολογία...) τα ρυθμίζετε μετά στην καρτέλα του αντίστοιχου προγράμματος. Τα κείμενα εξάσκησης ακολουθούν την τάξη του τμήματος (ορίζεται κατά τη δημιουργία του τμήματος και ανεβαίνει μόνη της κάθε σχολικό έτος) - δεν ζητείται έτος γέννησης. Μετά η εστίαση επιστρέφει στο πεδίο «Όνομα».",
    hinzufuegen: "Προσθήκη",
    excelTitel: "Πολλά άτομα μαζί (Excel)",
    kommenInKlasse: "Οι μαθητές προστίθενται στο τμήμα: ",
    vorlageTipp: (datei: string) =>
      `Κατεβάζει το αρχείο Excel ${datei}: στο φύλλο «Μαθητές» επάνω το τμήμα και η ημερομηνία, από κάτω η επιλογή του σημείου εκκίνησης για όλους και 40 γραμμές για συμπλήρωση. Στο φύλλο «Οδηγίες» οι οδηγίες και η λίστα με τα σημεία εκκίνησης. Γράψτε μία γραμμή για κάθε άτομο (όνομα και κωδικός πρόσβασης - έναν κενό κωδικό τον δημιουργεί το πρόγραμμα), μετά εισαγάγετε το αρχείο εδώ. Πριν από την προσθήκη βλέπετε μια προεπισκόπηση.`,
    vorlage: "Λήψη προτύπου (Excel)",
    importTipp:
      "Ανοίγει την επιλογή αρχείου για το συμπληρωμένο πρότυπο (.xlsx). Πρώτα εμφανίζεται μια προεπισκόπηση - οι λογαριασμοί δημιουργούνται μόνο μετά από επιβεβαίωση.",
    importieren: "Προσθήκη μαθητών από αρχείο Excel",
    listeTipp:
      "Κατεβάζει ένα αρχείο Word με όνομα, κωδικό πρόσβασης και κωδικό τμήματος ΟΛΩΝ των μαθητών αυτού του τμήματος - για εκτύπωση και μοίρασμα.",
    liste: "Λήψη καταλόγου τμήματος",
    vorschauVor: "Προεπισκόπηση: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Προστίθενται στο τμήμα ${klasse}: ${wort}. ` +
      `Η αποθήκευση γίνεται μόνο όταν πατήσετε το κουμπί «Προσθήκη».`,
    vorschauKeiner: "Από αυτό το αρχείο δεν προστίθεται κανείς.",
    escape: "Το Esc διακόπτει.",
    passwortPunkt: " - Κωδικός πρόσβασης",
    passwortErzeugt: " (τον δημιούργησε το πρόγραμμα)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (σημείο εκκίνησης του τμήματος)",
    vorgabe: " (προεπιλογή)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "el", {
        one: (z) => `${z} γραμμή`,
        other: (z) => `${z} γραμμές`,
      }),
      " ",
      mehrzahl(n, "el", {
        one: () => "δεν περνά",
        other: () => "δεν περνούν",
      }),
    ],
    korrigieren:
      "Αυτές τις γραμμές μπορείτε να τις διορθώσετε στο αρχείο και να το εισαγάγετε ξανά αργότερα. Τα άτομα που υπάρχουν ήδη στο τμήμα εμφανίζονται στην προεπισκόπηση με τη σημείωση «Αυτό το όνομα υπάρχει ήδη στο τμήμα.»",
    anlegenTippImport:
      "Προσθέτει σε αυτό το τμήμα ένα ένα τα άτομα της προεπισκόπησης. Μετά η εστίαση πηγαίνει στην επικεφαλίδα «Μαθητές», και από κάτω είναι το αποτέλεσμα.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Προσθήκη: ",
      mehrzahl(n, "el", {
        one: (z) => `${z} άτομο`,
        other: (z) => `${z} άτομα`,
      }),
    ],
    verwerfenTipp: "Απορρίπτει την προεπισκόπηση χωρίς να προστεθεί κανείς (Esc).",
    nochKeine:
      "Δεν υπάρχουν ακόμα μαθητές. Προσθέστε τους παραπάνω - μετά συνδέονται με κωδικό τμήματος, όνομα και κωδικό πρόσβασης (από οποιαδήποτε συσκευή).",
    wirdVerschoben: "Μετακίνηση...",
    verschiebenLaeuft: "Μια στιγμή - η μετακίνηση συνεχίζεται ακόμα.",
    zielFehlt: "Γράψτε τον κωδικό του νέου τμήματος.",
    // Das Wort der Tippchallenge steht fest (Glossar §2.3: Πρόκληση, Mz. Προκλήσεις) - der Platzhalter käme ungebeugt.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Μετακίνηση στο τμήμα με κωδικό ${code}: ${name};\n\n` +
      `- Η σύνδεση γίνεται μετά με τον νέο κωδικό τμήματος.\n` +
      `- Οι εκπαιδευτικοί του νέου τμήματος βλέπουν αυτό το παιδί και την πρόοδό του.\n` +
      `- Τα αποτελέσματα των Προκλήσεων και τα μηνύματα μένουν στο προηγούμενο τμήμα.\n` +
      `- Αν δεν διδάσκετε και εσείς στο νέο τμήμα, δεν θα βλέπετε πια αυτό το παιδί.`,
    nichtsVerschoben: "Δεν μετακινήθηκε τίποτα.",
    emailFalsch: "Αυτό δεν μοιάζει με διεύθυνση e-mail - μπορείτε και να αφήσετε το πεδίο κενό.",
    kontaktGespeichert: "Το e-mail επικοινωνίας αποθηκεύτηκε.",
    kontaktEntfernt: "Το e-mail επικοινωνίας αφαιρέθηκε.",
    passwortTipp: (name: string) => `Ανοίγει και κλείνει το πεδίο για νέο κωδικό πρόσβασης. Παιδί: ${name}.`,
    passwortAendern: "Αλλαγή κωδικού πρόσβασης",
    kontaktKnopfTipp: (name: string) =>
      `Ανοίγει και κλείνει το πεδίο για το e-mail επικοινωνίας. Παιδί: ${name}. Αν είναι συμπληρωμένο, ο κωδικός πρόσβασης στέλνεται αυτόματα με e-mail, μόλις οριστεί ή αλλάξει.`,
    kontaktKnopfName: (name: string) => `E-mail επικοινωνίας: ${name}`,
    kontaktKnopf: "E-mail επικοινωνίας",
    verschiebenTipp: (name: string) =>
      `Ανοίγει το πεδίο για μετακίνηση σε άλλο τμήμα - και σε τμήμα άλλων εκπαιδευτικών, αν ξέρετε τον κωδικό του. Παιδί: ${name}.`,
    verschiebenName: (name: string) => `Μετακίνηση σε άλλο τμήμα: ${name}`,
    verschiebenKnopf: "Μετακίνηση σε άλλο τμήμα",
    loeschenKindTipp: (name: string) =>
      `Διαγράφει τον λογαριασμό και την πρόοδο σε όλες τις εφαρμογές μάθησης - μόνο μετά από επιβεβαίωση. Παιδί: ${name}.`,
    loeschenKindName: (name: string) => `Διαγραφή: ${name}`,
    loeschenKnopf: " Διαγραφή",
    kontaktVon: "E-mail επικοινωνίας: ",
    kontaktLeer: "κενό πεδίο = χωρίς e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Αποθηκεύει το e-mail επικοινωνίας - ένα κενό πεδίο το αφαιρεί. Παιδί: ${name}.`,
    schliessenTipp: "Κλείνει το πεδίο χωρίς αποθήκευση (Esc).",
    codeNeueKlasse: "Κωδικός του νέου τμήματος",
    folgenTipp: (name: string, _pruefung: string) =>
      `Η σύνδεση γίνεται μετά με τον νέο κωδικό τμήματος. Οι εκπαιδευτικοί του νέου τμήματος βλέπουν αυτό το παιδί και την πρόοδό του. Τα αποτελέσματα των Προκλήσεων και τα μηνύματα μένουν σε αυτό το τμήμα. Παιδί: ${name}.`,
    zielBeispiel: "π.χ. 4A",
    verschiebeTipp: (name: string) =>
      `Μετά από επιβεβαίωση μετακινεί στο τμήμα με αυτόν τον κωδικό. Παιδί: ${name}.`,
    verschieben: "Μετακίνηση",
    nichtVerschiebenTipp: "Κλείνει το πεδίο χωρίς μετακίνηση (Esc).",
  },
  hu: {
    auswahlSpeichert: "Egy pillanat - a kiválasztás mentése még folyamatban van.",
    keinProgramm: "Nincs kiválasztott program - az a program látható, amelyikből ez az oldal megnyílt.",
    auswahlGespeichert: "A programok kiválasztása mentve.",
    programmeKlasse: "Az osztály programjai",
    nurAnsicht: "Ez a kiválasztás csak ",
    ihreAnsicht: "a saját nézetet",
    nurAnsichtRest:
      " állítja be: a ki nem választott programoknak itt nincs lapjuk és oszlopuk. A tanulók továbbra is minden programot megnyithatnak - semmi sem zárolódik.",
    fehltName: "az osztály neve",
    fehltCodeGueltig:
      "érvényes osztálykód (2-12 karakter: betűk, számjegyek, pont vagy kötőjel)",
    fehltCode: "osztálykód",
    fehltSchulstufe: "évfolyam",
    fehltStart: "kiindulópont",
    und: " és ",
    fehltSatz: (liste: string) => `Az osztály létrehozásához még hiányzik: ${liste}.`,
    // Zahl + Hauptwort = Einzahl (Glossar Regel 13): beide Formen gleich.
    teilnehmer: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} tanuló`,
        other: (z) => `${z} tanuló`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} sor`,
        other: (z) => `${z} sor`,
      }),
    ersteSchritte: "Első lépések",
    schrittKlasse: "Osztály létrehozása",
    schrittKlasseText:
      "Név, osztálykód, évfolyam, nyelv, kiindulópont és Osztályverseny. A program a név alapján kódot javasol, amely módosítható. Ezzel a kóddal jelentkeznek be a tanulók minden tanulóprogramba.",
    schrittLernende: "Tanuló felvétele",
    schrittLernendeText:
      "Név és jelszó, semmi más. Utána a belépési adatok listaként kinyomtathatók és kioszthatók.",
    schrittProgramme: "Programok kiválasztása",
    schrittProgrammeText:
      "Mely tanulóprogramokat használja ez az osztály? Ez csak a saját nézetet állítja be - a tanulók továbbra is minden programot megnyithatnak.",
    erledigt: ", kész",
    jetztDran: ", most következik",
    wirdGespeichert: "Mentés...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Az osztály létrejött: ${name}. Ezek az adatok azonban nem mentődtek el: ${liste}. ` +
      `Kérjük, pótolja őket a Tastenflow lapon, az osztály beállításainál.`,
    klasseAngelegt: (name: string) => `Az osztály létrejött: ${name}.`,
    // `toUpperCase()` wie im Codefeld - der Code ist ein WERT, kein Text.
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Az osztály létrejött: ${name}. A kért osztálykódot (${gewuenscht.trim().toUpperCase()}) ` +
      `már egy másik osztály használja, ezért az érvényes osztálykód: ${code}.`,
    nameZuerst: "Kérjük, előbb adja meg a nevet.",
    passwortKurz: "A jelszónak legalább 4 karakterből kell állnia.",
    kontaktFalsch: "A kapcsolattartási e-mail-cím nem tűnik helyesnek - a mező üresen is hagyható.",
    kindAngelegt: (name: string) => `Fiók létrehozva: ${name}.`,
    vorlageLaedt: (datei: string) => `Sablon letöltése: ${datei}`,
    vorlageFehler: "A sablont nem sikerült létrehozni. Kérjük, frissítse az oldalt, és próbálja újra.",
    listeWird: "Az osztálynévsor készül.",
    listeLaedt: (klasse: string) => `Osztálynévsor letöltése: ${klasse}`,
    listeFehler: "Az osztálynévsort nem sikerült létrehozni. Kérjük, frissítse az oldalt, és próbálja újra.",
    nochSpeichern: "Egy pillanat - a mentés még folyamatban van.",
    dateiNichtOffen: "A fájlt nem sikerült megnyitni. Kérjük, válassza ki újra.",
    dateiLeer: (datei: string) =>
      `A fájlban (${datei}) a fejléc alatt nincs egyetlen tanuló sem. Kérjük, minden tanulóhoz írjon be egy sort, és töltse be újra a fájlt.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Előnézet - felvétel: ${anlegen}` +
      (abgelehnt ? `; kimarad: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Ebből a fájlból senkit sem lehet felvenni - az okok az előnézetben láthatók. Kérjük, javítsa a fájlt, és töltse be újra.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Fiókok létrehozása: ${nr}/${von} (${name})...`,
    kontoNicht: "A fiókot nem sikerült létrehozni.",
    ergebnisAngelegt: (anzahl: string) => `Felvéve: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Nem sikerült felvenni (${n}): ${liste}.`,
    ergebnisDrucken: "A nevek és a jelszavak a „Belépési adatok nyomtatása” gombbal érhetők el.",
    anlegenLaeuft: "A fiókok létrehozása már folyamatban van - kérjük, várja meg a végét.",
    importAbgebrochen: "A betöltés megszakadt - egyetlen fiók sem jött létre.",
    kindLoeschenFrage: (name: string) =>
      `Fiók törlése: ${name}? MINDEN tanulóprogramban elvész az összes eredmény. ` +
      `Ez a művelet nem vonható vissza.`,
    kindGeloescht: (name: string) => `Fiók törölve: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Osztály törlése: ${name}?` +
      (n > 0
        ? ` Véglegesen törlődnek a tanulók fiókjai is (${mehrzahl(n, "hu", {
        one: (z) => `${z} tanuló`,
        other: (z) => `${z} tanuló`,
      })}) ` +
          `és az eredményeik.`
        : "") +
      " Ez a művelet nem vonható vissza.",
    klasseGeloescht: (name: string) => `Osztály törölve: ${name}.`,
    klassennameFehlt: "Kérjük, adja meg az osztály nevét.",
    codeFehlt: "Kérjük, adja meg az osztálykódot - a tanulók ezzel a kóddal jelentkeznek be.",
    codeUngueltig:
      "Az osztálykód 2-12 karakterből állhat: betűk, számjegyek, pont vagy kötőjel.",
    klasseGespeichert: "Az osztály mentve.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Áthelyezve: ${name}. Új osztály: ${klasse} (osztálykód: ${code}). ` +
      `A bejelentkezés mostantól ezzel a kóddal történik.`,
    wochenberichtAn: "A heti összesítő bekapcsolva.",
    wochenberichtAus: "A heti összesítő kikapcsolva.",
    druckBlockiert: "A nyomtatási ablak le lett tiltva. Kérjük, engedélyezze a felugró ablakokat ezen az oldalon.",
    klassen: "Osztályok",
    klasseWaehlenTipp: (name: string) => `Kiválasztja ezt az osztályt: ${name} - utána minden lap ennek a tanulóit mutatja.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Osztály: ${name}${gewaehlt ? ", kiválasztva" : ""}`,
    neueKlasse: "Új osztály létrehozása",
    neueKlasseInhalt: "- név, osztálykód, évfolyam, nyelv, kiindulópont, Osztályverseny",
    neuProgrammeTitel: "Mely programokat használja az osztály?",
    neuProgrammeHinweis:
      "Ez csak a saját nézetet rendezi - a tanulók továbbra is minden programot megnyithatnak. A Tastenflow adatai (évfolyam, nyelv, kiindulópont, Osztályverseny) csak akkor jelennek meg, ha a Tastenflow be van jelölve.",
    neuProgrammName: (label: string) => `${label} - az új osztálynak`,
    fehltProgramm: "legalább egy program",
    klassenname: "Az osztály neve",
    klassennameBeispiel: "pl. 3.b vagy Napsugár",
    klassencode: "Osztálykód",
    klassencodeTipp:
      "Kötelező. A tanulók ezzel a kóddal jelentkeznek be minden tanulóprogramba, ugyanazzal a névvel és jelszóval. A program a név alapján kódot javasol, amely módosítható: 2-12 karakter, betűk, számjegyek, pont vagy kötőjel.",
    klassencodeBeispiel: "pl. 3B-NAPSUGAR",
    fuerTastenflowTipp:
      "Ezek az adatok csak a tízujjas gépelésre (Tastenflow) vonatkoznak; a többi program nem változtat rajtuk. Később a Tastenflow lapon, az osztály beállításainál módosíthatók.",
    fuerTastenflow: "Beállítások: Tastenflow",
    // Wird an Feldnamen angehängt („Évfolyam (új osztály)") - ohne Endung.
    bezugNeu: "(új osztály)",
    bitteWaehlen: "Kérjük, válasszon",
    startHinweis: "amit a tanulók már tudnak - a később érkezőkre is vonatkozik",
    startSrHinweis:
      "Kötelező. Az eddig a szintig tartó billentyűk az osztály minden tanulója számára kezdettől fel vannak oldva - " +
      "a később érkezőknek is. Aki már előrébb tart, nem veszít semmit.",
    anlegenTipp: "Létrehozza az osztályt az összes adattal. Az osztálykód ezután minden tanulóprogramban érvényes.",
    klasseAnlegen: "Osztály létrehozása",
    zuerstKlasse: "Előbb hozzon létre egy osztályt - a tanulók annak kódjával jelentkeznek be.",
    klasseVor: "Osztály: ",
    codeFuerLernende: " - osztálykód a tanulóknak",
    bearbeitenTipp: "Az osztály nevének vagy kódjának módosítása.",
    klasseBearbeiten: "Osztály szerkesztése",
    bearbeiten: " Szerkesztés",
    loeschenTipp: "Törli ezt az osztályt az összes tanulóval együtt - csak megerősítés után.",
    klasseLoeschen: "Osztály törlése",
    klasseLoeschenKnopf: " Osztály törlése",
    codeAendernTipp:
      "2-12 karakter, betűk, számjegyek, pont vagy kötőjel. A módosítás után az osztály minden tanulója azonnal az új kóddal jelentkezik be.",
    speichernTipp: "Menti az osztály új nevét és kódját.",
    speichern: "Mentés",
    abbrechenTipp: "Változtatás nélkül bezárja a szerkesztést.",
    abbrechen: "Mégse",
    codeWarnVor: "⚠️ A kód módosítása után",
    // Verb bleibt Einzahl (Glossar Regel 13) - beide Formen passen zu „jelentkezik".
    codeWarnWer: (n: number) =>
      mehrzahl(n, "hu", {
        one: () => "az osztály tanulója",
        other: (z) => `az osztály összes tanulója (${z})`,
      }),
    codeWarnMitte: "mostantól az ",
    codeWarnNeu: "új",
    codeWarnEnde: " kóddal jelentkezik be.",
    wochenbericht: " Heti összesítő e-mailben (hetente egyszer, hétfőn, a Tastenflow számaival)",
    wochenberichtAnAdresse: "erre a címre: ",
    lernende: "Tanulók (",
    druckenTipp: "Az imént felvett tanulók nevének, jelszavának és az osztálykódnak a kinyomtatása.",
    drucken: " Belépési adatok nyomtatása (",
    zurKlasse: "Felvétel az osztályba",
    nameTipp: "Elég a név. Ebben az osztályban csak egyszer szerepelhet - a kis- és nagybetű ennél nem számít.",
    name: "Név",
    passwort: "Jelszó",
    passwortBeispiel: "legalább 4 karakter",
    zufallTipp: "Létrehoz egy könnyen gépelhető, 5 betűből és számjegyből álló jelszót, és beírja a mezőbe.",
    zufall: "Véletlen",
    kontakt: "Kapcsolattartási e-mail (nem kötelező)",
    kontaktTipp:
      "Ha itt van cím, a belépési adatok automatikusan megérkeznek e-mailben - a felvételkor és minden új jelszó beállításakor.",
    kontaktBeispiel: "pl. a szülőknek",
    womitAnfangen: "Tastenflow: honnan induljon?",
    womitTipp:
      "Amit ez a tanuló már tud. Az eddig tartó billentyűk kezdettől fel vannak oldva. Előre ki van választva az osztály kiindulópontja.",
    hinzufuegenTipp:
      "Felvesz ebbe az osztályba egy tanulót névvel, jelszóval és - a Tastenflow számára - kiindulóponttal. Minden más (nyelv, kedvezmények...) később az adott program lapján állítható be. A gyakorló szövegek az osztály évfolyamához igazodnak (az osztály létrehozásakor kell megadni, és minden tanévvel magától eggyel nő) - a születési évet senki sem kérdezi. Utána a fókusz visszatér a Név mezőre.",
    hinzufuegen: "Felvétel",
    excelTitel: "Több tanuló egyszerre (Excel)",
    kommenInKlasse: "A tanulók ebbe az osztályba kerülnek: ",
    vorlageTipp: (datei: string) =>
      `Letölti az Excel-fájlt (${datei}): a Tanulók munkalapon felül az osztály és a dátum, alatta a kiindulópont kiválasztása mindenkinek és 40 kitöltendő sor; az Útmutató munkalapon a teendők és a kiindulópontok listája. Minden tanulóhoz írjon be egy sort (név és jelszó - üres jelszó esetén a program készít egyet), majd töltse be itt a fájlt; a felvétel előtt előnézet jelenik meg.`,
    vorlage: "Sablon letöltése (Excel)",
    importTipp:
      "Megnyitja a fájlválasztót a kitöltött sablonhoz (.xlsx). Előbb előnézet jelenik meg - a fiókok csak megerősítés után jönnek létre.",
    importieren: "Tanulók felvétele Excel-fájlból",
    listeTipp:
      "Letölt egy Word-fájlt az osztály ÖSSZES tanulójának nevével, jelszavával és az osztálykóddal - kinyomtatáshoz és kiosztáshoz.",
    liste: "Osztálynévsor letöltése",
    vorschauVor: "Előnézet: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Felvétel az osztályba (${klasse}): ${wort}. ` +
      `A mentés csak a „Felvétel” gomb megnyomása után történik.`,
    vorschauKeiner: "Ebből a fájlból senki sem kerül felvételre.",
    escape: "Az Esc billentyű megszakítja.",
    passwortPunkt: " - jelszó:",
    passwortErzeugt: " (a jelszót a program készítette)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (az osztály kiindulópontja)",
    vorgabe: " (alapértelmezett)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      "Kimarad: ",
      mehrzahl(n, "hu", {
        one: (z) => `${z} sor`,
        other: (z) => `${z} sor`,
      }),
    ],
    korrigieren:
      "Ezek a sorok a fájlban javíthatók, és később újra betölthetők. Akik már az osztályban vannak, az előnézetben ezzel a megjegyzéssel jelennek meg: „Ez a név már szerepel az osztályban.”",
    anlegenTippImport:
      "Egymás után felveszi ebbe az osztályba az előnézetben szereplő tanulókat. Utána a fókusz a Tanulók címsorra kerül, alatta látható az eredmény.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Felvétel: ",
      mehrzahl(n, "hu", {
        one: (z) => `${z} tanuló`,
        other: (z) => `${z} tanuló`,
      }),
    ],
    verwerfenTipp: "Elveti az előnézetet, senki sem kerül felvételre (Esc).",
    nochKeine:
      "Még nincsenek tanulók. Fent vehetők fel - utána osztálykóddal, névvel és jelszóval jelentkeznek be (bármilyen eszközről).",
    wirdVerschoben: "Áthelyezés...",
    verschiebenLaeuft: "Egy pillanat - az áthelyezés még folyamatban van.",
    zielFehlt: "Kérjük, adja meg az új osztály kódját.",
    // „Kihívások" steht fest (Glossar §2.3) - der Platzhalter bräuchte eine Endung.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Áthelyezés az osztályba (osztálykód: ${code}): ${name}?\n\n` +
      `- A bejelentkezés ezután az új osztálykóddal történik.\n` +
      `- Az új osztály tanárai látják ezt a tanulót és az eredményeit.\n` +
      `- A Kihívások eredményei és az üzenetek az előző osztályban maradnak.\n` +
      `- Ha az új osztály kezelése nem közös, ez a tanuló többé nem lesz látható.`,
    nichtsVerschoben: "Semmi sem lett áthelyezve.",
    emailFalsch: "Ez nem tűnik e-mail-címnek - a mező üresen is hagyható.",
    kontaktGespeichert: "A kapcsolattartási e-mail mentve.",
    kontaktEntfernt: "A kapcsolattartási e-mail eltávolítva.",
    passwortTipp: (name: string) => `Megnyitja és bezárja az új jelszó mezőjét. Tanuló: ${name}.`,
    passwortAendern: "Jelszó módosítása",
    kontaktKnopfTipp: (name: string) =>
      `Megnyitja és bezárja a kapcsolattartási e-mail mezőjét. Tanuló: ${name}. Ha ki van töltve, a jelszó automatikusan megérkezik e-mailben, amint beállítják vagy módosítják.`,
    kontaktKnopfName: (name: string) => `Kapcsolattartási e-mail: ${name}`,
    kontaktKnopf: "Kapcsolattartási e-mail",
    verschiebenTipp: (name: string) =>
      `Megnyitja a mezőt az áthelyezéshez egy másik osztályba - más tanárok osztályába is, ha ismert az osztálykódja. Tanuló: ${name}.`,
    verschiebenName: (name: string) => `Áthelyezés másik osztályba: ${name}`,
    verschiebenKnopf: "Áthelyezés másik osztályba",
    loeschenKindTipp: (name: string) =>
      `Törli a fiókot és az eredményeket minden tanulóprogramban - csak megerősítés után. Tanuló: ${name}.`,
    loeschenKindName: (name: string) => `Törlés: ${name}`,
    loeschenKnopf: " Törlés",
    kontaktVon: "Kapcsolattartási e-mail: ",
    kontaktLeer: "üres mező = nincs e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Menti a kapcsolattartási e-mailt - üres mező esetén eltávolítja. Tanuló: ${name}.`,
    schliessenTipp: "Mentés nélkül bezárja a mezőt (Esc).",
    codeNeueKlasse: "Az új osztály kódja",
    folgenTipp: (name: string, _pruefung: string) =>
      `A bejelentkezés ezután az új osztálykóddal történik. Az új osztály tanárai látják ezt a tanulót és az eredményeit. A Kihívások eredményei és az üzenetek ebben az osztályban maradnak. Tanuló: ${name}.`,
    zielBeispiel: "pl. 4.a",
    verschiebeTipp: (name: string) =>
      `Megerősítés után áthelyezi az ezzel a kóddal rendelkező osztályba. Tanuló: ${name}.`,
    verschieben: "Áthelyezés",
    nichtVerschiebenTipp: "Áthelyezés nélkül bezárja a mezőt (Esc).",
  },
  nl: {
    auswahlSpeichert: "Een ogenblik - de keuze wordt nog opgeslagen.",
    keinProgramm: "Geen programma gekozen - je ziet het programma waarmee je hier bent binnengekomen.",
    auswahlGespeichert: "Keuze van de programma's opgeslagen.",
    programmeKlasse: "Programma's van deze klas",
    nurAnsicht: "Dit bepaalt alleen ",
    ihreAnsicht: "jouw weergave",
    nurAnsichtRest:
      ": programma's die niet zijn gekozen, krijgen hier geen tabblad en geen kolom. De leerlingen kunnen elk programma blijven openen - er wordt niets geblokkeerd.",
    fehltName: "de klasnaam",
    fehltCodeGueltig:
      "een geldige klascode (2 tot 12 tekens: letters, cijfers, punt of koppelteken)",
    fehltCode: "de klascode",
    fehltSchulstufe: "het leerjaar",
    fehltStart: "het startpunt",
    und: " en ",
    fehltSatz: (liste: string) => `Om de klas aan te maken ontbreekt nog: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "nl", { one: (z) => `${z} leerling`, other: (z) => `${z} leerlingen` }),
    zeilen: (n: number) => mehrzahl(n, "nl", { one: (z) => `${z} regel`, other: (z) => `${z} regels` }),
    ersteSchritte: "Eerste stappen",
    schrittKlasse: "Klas aanmaken",
    schrittKlasseText:
      "Naam, klascode en de programma's van de klas. Alleen bij Tastenflow komen daar leerjaar, taal, startpunt en klassenwedstrijd bij. Het programma stelt een code voor die bij de naam past; je kunt die wijzigen. Daarmee loggen de leerlingen in bij alle leerprogramma's.",
    schrittLernende: "Leerlingen toevoegen",
    schrittLernendeText:
      "Naam en wachtwoord, meer niet. Daarna kun je de inloggegevens als lijst afdrukken en uitdelen.",
    schrittProgramme: "Programma's aanvinken",
    schrittProgrammeText:
      "Welke leerprogramma's gebruikt deze klas? Dit ordent alleen jouw weergave - de leerlingen kunnen elk programma blijven openen.",
    erledigt: ", klaar",
    jetztDran: ", nu aan de beurt",
    wirdGespeichert: "Opslaan...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `De klas "${name}" is aangemaakt, maar dit is niet opgeslagen: ${liste}. ` +
      `Vul dat aan onder "Klasinstellingen" op het tabblad Tastenflow.`,
    klasseAngelegt: (name: string) => `Klas "${name}" aangemaakt.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Klas "${name}" aangemaakt - de klascode "${gewuenscht.trim().toUpperCase()}" was ` +
      `al in gebruik, daarom geldt nu de klascode "${code}".`,
    nameZuerst: "Vul eerst een naam in.",
    passwortKurz: "Het wachtwoord moet minstens 4 tekens hebben.",
    kontaktFalsch: "Het contact-e-mailadres lijkt niet te kloppen - of laat het veld leeg.",
    kindAngelegt: (name: string) => `${name} toegevoegd.`,
    vorlageLaedt: (datei: string) => `Het sjabloon "${datei}" wordt gedownload.`,
    vorlageFehler:
      "Het sjabloon kon niet worden gemaakt. Laad de pagina opnieuw en probeer het nog eens.",
    listeWird: "De klassenlijst wordt samengesteld.",
    listeLaedt: (klasse: string) => `De klassenlijst van klas ${klasse} wordt gedownload.`,
    listeFehler:
      "De klassenlijst kon niet worden gemaakt. Laad de pagina opnieuw en probeer het nog eens.",
    nochSpeichern: "Een ogenblik - er wordt nog opgeslagen.",
    dateiNichtOffen: "Het bestand kon niet worden geopend. Kies het nog eens.",
    dateiLeer: (datei: string) =>
      `In "${datei}" staat onder de kopregel geen leerling. Vul per leerling een regel in en importeer het bestand opnieuw.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Voorbeeld: ${anlegen} om toe te voegen` +
      (abgelehnt ? `, ${abgelehnt} niet overgenomen.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Uit dit bestand kan geen leerling worden toegevoegd - de redenen staan in het voorbeeld. Verbeter het bestand en importeer het opnieuw.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Toevoegen: ${nr} van ${von} (${name})...`,
    kontoNicht: "Het account kon niet worden aangemaakt.",
    ergebnisAngelegt: (anzahl: string) => `${anzahl} toegevoegd.`,
    ergebnisNicht: (n: number, liste: string) => `${n} niet toegevoegd: ${liste}.`,
    ergebnisDrucken: "Namen en wachtwoorden vind je onder \"Inloggegevens afdrukken\".",
    anlegenLaeuft: "Het toevoegen is al bezig - wacht tot het klaar is.",
    importAbgebrochen: "Import afgebroken - er is geen leerling toegevoegd.",
    kindLoeschenFrage: (name: string) =>
      `"${name}" echt verwijderen? Alle voortgang in ALLE ` +
      `leerprogramma's gaat verloren. Dit kan niet ongedaan worden gemaakt.`,
    kindGeloescht: (name: string) => `${name} verwijderd.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Klas "${name}" echt verwijderen?` +
      (n > 0
        ? mehrzahl(n, "nl", {
            one: (z) => ` Daarmee wordt ook ${z} leerling met alle voortgang definitief verwijderd.`,
            other: (z) => ` Daarmee worden ook ${z} leerlingen met alle voortgang definitief verwijderd.`,
          })
        : "") +
      " Dit kan niet ongedaan worden gemaakt.",
    klasseGeloescht: (name: string) => `Klas "${name}" verwijderd.`,
    klassennameFehlt: "Vul een klasnaam in.",
    codeFehlt: "Vul een klascode in - daarmee loggen de leerlingen in.",
    codeUngueltig:
      "De klascode mag 2 tot 12 tekens hebben: letters, cijfers, punt of koppelteken.",
    klasseGespeichert: "Klas opgeslagen.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} zit nu in de klas "${klasse}" ` +
      `(klascode ${code}) en logt vanaf nu in met deze code.`,
    wochenberichtAn: "Weekverslag ingeschakeld.",
    wochenberichtAus: "Weekverslag uitgeschakeld.",
    druckBlockiert: "Het afdrukvenster is geblokkeerd. Sta pop-upvensters toe voor deze pagina.",
    klassen: "Klassen",
    klasseWaehlenTipp: (name: string) => `Kiest de klas ${name} - alle tabbladen tonen dan de leerlingen van die klas.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Klas ${name}${gewaehlt ? ", gekozen" : ""}`,
    neueKlasse: "Nieuwe klas aanmaken",
    neueKlasseInhalt: "- naam, klascode, programma's",
    neuProgrammeTitel: "Welke programma's gebruikt de klas?",
    neuProgrammeHinweis:
      "Dit ordent alleen jouw weergave - de leerlingen kunnen elk programma blijven openen. De gegevens voor Tastenflow (leerjaar, taal, startpunt, klassenwedstrijd) verschijnen alleen als Tastenflow is aangevinkt.",
    neuProgrammName: (label: string) => `${label} voor de nieuwe klas`,
    fehltProgramm: "minstens één programma",
    klassenname: "Klasnaam",
    klassennameBeispiel: "bijvoorbeeld 3b of Voorbereidingscursus",
    klassencode: "Klascode",
    klassencodeTipp:
      "Verplicht. Met deze code loggen de leerlingen in - bij elk leerprogramma, met dezelfde naam en hetzelfde wachtwoord. De code wordt voorgesteld op basis van de naam en je kunt hem wijzigen: 2 tot 12 tekens, letters, cijfers, punt of koppelteken.",
    klassencodeBeispiel: "bijvoorbeeld 3.MS",
    fuerTastenflowTipp:
      "Deze gegevens gelden alleen voor typen met tien vingers (Tastenflow); de andere programma's veranderen ze niet. Later te wijzigen onder \"Klasinstellingen\" op het tabblad Tastenflow.",
    fuerTastenflow: "Voor Tastenflow",
    bezugNeu: "van de nieuwe klas",
    bitteWaehlen: "Kies",
    startHinweis: "wat de leerlingen al kunnen - geldt ook voor iedereen die er later bij komt",
    startSrHinweis:
      "Verplicht. De toetsen tot en met dit punt zijn voor elke leerling van deze klas vanaf het begin vrijgespeeld - " +
      "ook voor leerlingen die er later bij komen. Een leerling die al verder is, verliest niets.",
    anlegenTipp: "Maakt de klas aan met alle gegevens. De klascode geldt dan voor alle leerprogramma's.",
    klasseAnlegen: "Klas aanmaken",
    zuerstKlasse: "Maak eerst een klas aan - met de klascode loggen de leerlingen in.",
    klasseVor: "Klas ",
    codeFuerLernende: " - klascode voor de leerlingen",
    bearbeitenTipp: "Klasnaam of klascode wijzigen.",
    klasseBearbeiten: "Klas bewerken",
    bearbeiten: " Bewerken",
    loeschenTipp: "Deze klas met alle leerlingen verwijderen - na een controlevraag.",
    klasseLoeschen: "Klas verwijderen",
    klasseLoeschenKnopf: " Klas verwijderen",
    codeAendernTipp:
      "2 tot 12 tekens, letters, cijfers, punt of koppelteken. Wijzig je de code, dan loggen alle leerlingen van deze klas voortaan in met de nieuwe code.",
    speichernTipp: "Neemt de nieuwe klasnaam en klascode over.",
    speichern: "Opslaan",
    abbrechenTipp: "Sluit het bewerken zonder iets te wijzigen.",
    abbrechen: "Annuleren",
    codeWarnVor: "⚠️ Als de code wordt gewijzigd, geldt voor",
    codeWarnWer: (n: number) =>
      mehrzahl(n, "nl", { one: () => "de leerling", other: (z) => `alle ${z} leerlingen` }),
    codeWarnMitte: "van deze klas vanaf dan de ",
    codeWarnNeu: "nieuwe",
    codeWarnEnde: " code.",
    wochenbericht: " Weekverslag per e-mail (één keer per week, op maandag, met de gegevens van Tastenflow)",
    wochenberichtAnAdresse: "naar ",
    lernende: "Leerlingen (",
    druckenTipp: "Druk de namen, wachtwoorden en klascode af van de leerlingen die je net hebt toegevoegd.",
    drucken: " Inloggegevens afdrukken (",
    zurKlasse: "Toevoegen aan de klas",
    nameTipp: "De voornaam is genoeg. Die mag in deze klas maar één keer voorkomen - hoofdletters en kleine letters tellen daarbij niet mee.",
    name: "Naam",
    passwort: "Wachtwoord",
    passwortBeispiel: "minstens 4 tekens",
    zufallTipp: "Maakt een makkelijk te typen wachtwoord van 5 letters en cijfers en zet het in het veld.",
    zufall: "Willekeurig",
    kontakt: "Contact-e-mailadres (optioneel)",
    kontaktTipp:
      "Staat hier een adres, dan krijgt de leerling de inloggegevens automatisch per e-mail - bij het toevoegen en telkens als het wachtwoord later opnieuw wordt ingesteld.",
    kontaktBeispiel: "bijvoorbeeld voor de ouders",
    womitAnfangen: "Tastenflow: waar beginnen?",
    womitTipp:
      "Wat de leerling al kan. De toetsen tot en met dit punt zijn vanaf het begin vrijgespeeld. Vooraf gekozen is het startpunt van de klas.",
    hinzufuegenTipp:
      "Voegt de leerling toe aan deze klas met naam, wachtwoord en - voor Tastenflow - het startpunt. Al het andere (taal, hulpmiddelen...) stel je daarna in op het tabblad van het programma. De oefenteksten volgen het leerjaar van de klas (ingevuld bij het aanmaken van de klas, telt elk schooljaar vanzelf door) - een geboortejaar wordt niet gevraagd. Daarna staat de focus weer in het veld Naam.",
    hinzufuegen: "Toevoegen",
    excelTitel: "Veel leerlingen tegelijk (Excel)",
    kommenInKlasse: "De leerlingen komen in de klas ",
    vorlageTipp: (datei: string) =>
      `Downloadt het Excel-bestand "${datei}": op het eerste werkblad bovenaan de klas en de datum, daaronder de keuze "waar beginnen" voor alle leerlingen en 40 regels om in te vullen; op het tweede werkblad de uitleg en de lijst met startpunten. Vul per leerling een regel in (naam en wachtwoord - laat je het wachtwoord leeg, dan maakt het programma er een aan) en importeer het bestand daarna hier; je ziet een voorbeeld voordat er iemand wordt toegevoegd.`,
    vorlage: "Sjabloon downloaden (Excel)",
    importTipp:
      "Opent de bestandskeuze voor het ingevulde sjabloon (.xlsx). Eerst verschijnt een voorbeeld - er wordt pas iemand toegevoegd als je dat bevestigt.",
    importieren: "Leerlingen importeren uit Excel",
    listeTipp:
      "Downloadt een Word-bestand met de naam, het wachtwoord en de klascode van ALLE leerlingen van deze klas - om af te drukken en uit te delen.",
    liste: "Klassenlijst downloaden",
    vorschauVor: "Voorbeeld: \"",
    vorschauNach: "\"",
    vorschauSatz: (anzahl: number, wort: string, klasse: string) =>
      mehrzahl(anzahl, "nl", {
        one: () => `${wort} wordt toegevoegd aan de klas ${klasse}.`,
        other: () => `${wort} worden toegevoegd aan de klas ${klasse}.`,
      }) + ` Er wordt pas opgeslagen als je "${wort} toevoegen" kiest.`,
    vorschauKeiner: "Uit dit bestand wordt geen leerling toegevoegd.",
    escape: "Esc breekt af.",
    passwortPunkt: " - wachtwoord",
    passwortErzeugt: " (wachtwoord aangemaakt)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (startpunt van de klas)",
    vorgabe: " (standaard)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "nl", { one: (z) => `${z} regel`, other: (z) => `${z} regels` }),
      " ",
      mehrzahl(n, "nl", { one: () => "wordt niet overgenomen", other: () => "worden niet overgenomen" }),
    ],
    korrigieren:
      "Deze regels kun je in het bestand verbeteren en later opnieuw importeren. Wie dan al is toegevoegd, staat in het voorbeeld met de opmerking dat die naam al in de klas bestaat.",
    anlegenTippImport:
      "Voegt de leerlingen uit het voorbeeld na elkaar toe aan deze klas. Daarna staat de focus op de kop \"Leerlingen\", met het resultaat eronder.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "nl", { one: (z) => `${z} leerling`, other: (z) => `${z} leerlingen` }),
      " toevoegen",
    ],
    verwerfenTipp: "Gooit het voorbeeld weg zonder iemand toe te voegen (Esc).",
    nochKeine:
      "Nog geen leerlingen. Voeg ze hierboven toe - daarna loggen ze in met klascode, naam en wachtwoord (op elk apparaat).",
    wirdVerschoben: "Verplaatsen...",
    verschiebenLaeuft: "Een ogenblik - het verplaatsen is nog bezig.",
    zielFehlt: "Vul de klascode van de nieuwe klas in.",
    // Mehrzahl „Uitdagingen" steht fest - der Platzhalter käme in der Einzahl.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `${name} verplaatsen naar de klas met klascode ${code}?\n\n` +
      `- ${name} logt daarna in met de nieuwe klascode ${code}.\n` +
      `- De leerkrachten van de nieuwe klas zien ${name} en de voortgang.\n` +
      `- Resultaten van Uitdagingen en berichten blijven bij de vorige klas.\n` +
      `- Zelf zie je ${name} daarna alleen nog als je ook leerkracht van de nieuwe klas bent.`,
    nichtsVerschoben: "Er is niets verplaatst.",
    emailFalsch: "Dat lijkt geen e-mailadres - of laat het veld leeg.",
    kontaktGespeichert: "Contact-e-mailadres opgeslagen.",
    kontaktEntfernt: "Contact-e-mailadres verwijderd.",
    passwortTipp: (name: string) => `Opent en sluit het veld voor een nieuw wachtwoord van ${name}.`,
    passwortAendern: "Wachtwoord wijzigen",
    kontaktKnopfTipp: (name: string) =>
      `Opent en sluit het veld voor het contact-e-mailadres van ${name} - is dat ingevuld, dan krijgt de leerling het wachtwoord automatisch per e-mail zodra het wordt ingesteld of opnieuw ingesteld.`,
    kontaktKnopfName: (name: string) => `Contact-e-mailadres: ${name}`,
    kontaktKnopf: "Contact-e-mailadres",
    verschiebenTipp: (name: string) =>
      `Opent het veld om ${name} naar een andere klas te verplaatsen - ook naar de klas van een andere leerkracht, als je de klascode daarvan kent.`,
    verschiebenName: (name: string) => `Naar een andere klas verplaatsen: ${name}`,
    verschiebenKnopf: "Naar een andere klas verplaatsen",
    loeschenKindTipp: (name: string) =>
      `Verwijdert ${name} met alle voortgang in alle leerprogramma's - na een controlevraag.`,
    loeschenKindName: (name: string) => `${name} verwijderen`,
    loeschenKnopf: " Verwijderen",
    kontaktVon: "Contact-e-mailadres van ",
    kontaktLeer: "leeg laten = geen e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Slaat het contact-e-mailadres van ${name} op - leeg laten verwijdert het weer.`,
    schliessenTipp: "Sluit het veld zonder op te slaan (Esc).",
    codeNeueKlasse: "Klascode van de nieuwe klas",
    folgenTipp: (name: string, _pruefung: string) =>
      `Daarna logt ${name} in met de nieuwe klascode. De leerkrachten van de nieuwe klas zien ${name} en de voortgang. Resultaten van Uitdagingen en berichten blijven bij deze klas.`,
    zielBeispiel: "bijvoorbeeld 4A",
    verschiebeTipp: (name: string) =>
      `Verplaatst ${name} na een controlevraag naar de klas met deze klascode.`,
    verschieben: "Verplaatsen",
    nichtVerschiebenTipp: "Sluit het veld zonder iets te verplaatsen (Esc).",
  },
  pt: {
    auswahlSpeichert: "Um momento - a seleção ainda está a ser guardada.",
    keinProgramm: "Nenhum programa selecionado - é apresentado o programa pelo qual entrou.",
    auswahlGespeichert: "Seleção de programas guardada.",
    programmeKlasse: "Programas desta turma",
    nurAnsicht: "Isto altera apenas ",
    ihreAnsicht: "a sua vista",
    nurAnsichtRest:
      ": os programas não selecionados deixam de ter separador e coluna aqui. A turma continua a poder abrir qualquer programa - nada é bloqueado.",
    fehltName: "o nome da turma",
    fehltCodeGueltig:
      "um código da turma válido (2 a 12 carateres: letras, algarismos, ponto ou hífen)",
    fehltCode: "o código da turma",
    fehltSchulstufe: "o ano de escolaridade",
    fehltStart: "o ponto de partida",
    und: " e ",
    fehltSatz: (liste: string) => `Para criar a turma, falta ainda: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} pessoa`,
        other: (z) => `${z} pessoas`,
        many: (z) => `${z} de pessoas`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} linha`,
        other: (z) => `${z} linhas`,
        many: (z) => `${z} de linhas`,
      }),
    ersteSchritte: "Primeiros passos",
    schrittKlasse: "Criar turma",
    schrittKlasseText:
      "Nome, código da turma e programas da turma. Só no Tastenflow se juntam o ano de escolaridade, a língua, o ponto de partida e a Corrida da turma. O programa sugere um código adequado ao nome; pode alterá-lo. Com ele, a turma inicia sessão em todos os programas de aprendizagem.",
    schrittLernende: "Adicionar pessoas",
    schrittLernendeText:
      "Nome e palavra-passe, nada mais. Depois, pode imprimir os dados de acesso numa lista e distribuí-los.",
    schrittProgramme: "Selecionar programas",
    schrittProgrammeText:
      "Que programas de aprendizagem usa esta turma? Isto organiza apenas a sua vista - a turma continua a poder abrir qualquer programa.",
    erledigt: ", concluído",
    jetztDran: ", é a vez deste passo",
    wirdGespeichert: "A guardar...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Turma criada: ${name}. Mas não foi guardado: ${liste}. ` +
      `Preencha estes dados em "Definições da turma", no separador Tastenflow.`,
    klasseAngelegt: (name: string) => `Turma criada: ${name}.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Turma criada: ${name}. O código da turma pedido (${gewuenscht.trim().toUpperCase()}) ` +
      `já estava atribuído; por isso, vale agora o código da turma ${code}.`,
    nameZuerst: "Introduza primeiro um nome.",
    passwortKurz: "A palavra-passe precisa de ter pelo menos 4 carateres.",
    kontaktFalsch: "O e-mail de contacto não parece correto - também pode deixar o campo vazio.",
    kindAngelegt: (name: string) => `Conta criada: ${name}.`,
    vorlageLaedt: (datei: string) => `A transferir o modelo: ${datei}`,
    vorlageFehler: "Não foi possível criar o modelo. Atualize a página e tente outra vez.",
    listeWird: "A preparar a lista da turma.",
    listeLaedt: (klasse: string) => `A transferir a lista da turma: ${klasse}`,
    listeFehler: "Não foi possível criar a lista da turma. Atualize a página e tente outra vez.",
    nochSpeichern: "Um momento - ainda a guardar.",
    dateiNichtOffen: "Não foi possível abrir o ficheiro. Selecione-o outra vez.",
    dateiLeer: (datei: string) =>
      `Em ${datei} não há nenhuma pessoa por baixo da linha de cabeçalho. Escreva uma linha por pessoa e carregue o ficheiro outra vez.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Pré-visualização - a adicionar: ${anlegen}` +
      (abgelehnt ? `; não incluídas: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Não é possível adicionar ninguém a partir deste ficheiro - os motivos estão na pré-visualização. Corrija o ficheiro e carregue-o outra vez.",
    wirdAngelegt: (nr: number, von: number, name: string) => `A criar contas: ${nr} de ${von} (${name})...`,
    kontoNicht: "Não foi possível criar a conta.",
    ergebnisAngelegt: (anzahl: string) => `Contas criadas: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Contas não criadas (${n}): ${liste}.`,
    ergebnisDrucken: "Os nomes e as palavras-passe estão em \"Imprimir dados de acesso\".",
    anlegenLaeuft: "As contas já estão a ser criadas - espere até terminar.",
    importAbgebrochen: "Operação cancelada - não foi criada nenhuma conta.",
    kindLoeschenFrage: (name: string) =>
      `Quer mesmo eliminar a conta: ${name}? Todos os progressos em TODOS os ` +
      `programas de aprendizagem serão perdidos. Esta ação não pode ser anulada.`,
    kindGeloescht: (name: string) => `Conta eliminada: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Quer mesmo eliminar a turma ${name}?` +
      (n > 0
        ? ` Serão também eliminados definitivamente as contas e os progressos de ${mehrzahl(n, "pt", {
            one: (z) => `${z} pessoa`,
            other: (z) => `${z} pessoas`,
            many: (z) => `${z} de pessoas`,
          })}.`
        : "") +
      " Esta ação não pode ser anulada.",
    klasseGeloescht: (name: string) => `Turma eliminada: ${name}.`,
    klassennameFehlt: "Introduza um nome para a turma.",
    codeFehlt: "Introduza um código da turma - é com ele que a turma inicia sessão.",
    codeUngueltig:
      "O código da turma deve ter 2 a 12 carateres: letras, algarismos, ponto ou hífen.",
    klasseGespeichert: "Turma guardada.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} está agora na turma ${klasse} (código da turma: ${code}) ` +
      `e passa a iniciar sessão com este código.`,
    wochenberichtAn: "Resumo semanal ligado.",
    wochenberichtAus: "Resumo semanal desligado.",
    druckBlockiert: "A janela de impressão foi bloqueada. Permita as janelas pop-up nesta página.",
    klassen: "Turmas",
    klasseWaehlenTipp: (name: string) => `Seleciona a turma ${name} - todos os separadores passam a mostrar estudantes desta turma.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Turma ${name}${gewaehlt ? ", selecionada" : ""}`,
    neueKlasse: "Criar nova turma",
    neueKlasseInhalt: "- nome, código da turma, programas",
    neuProgrammeTitel: "Que programas usa a turma?",
    neuProgrammeHinweis:
      "Isto organiza apenas a sua vista - a turma continua a poder abrir qualquer programa. Os dados do Tastenflow (ano de escolaridade, língua, ponto de partida, Corrida da turma) só aparecem se o Tastenflow estiver selecionado.",
    neuProgrammName: (label: string) => `${label} para a nova turma`,
    fehltProgramm: "pelo menos um programa",
    klassenname: "Nome da turma",
    klassennameBeispiel: "p. ex., 3B ou Curso de preparação",
    klassencode: "Código da turma",
    klassencodeTipp:
      "Obrigatório. Com este código, a turma inicia sessão em qualquer programa de aprendizagem, com o mesmo nome e a mesma palavra-passe. O código é sugerido de acordo com o nome e pode ser alterado: 2 a 12 carateres, letras, algarismos, ponto ou hífen.",
    klassencodeBeispiel: "p. ex., 3.B",
    fuerTastenflowTipp:
      "Estes dados valem apenas para a escrita com os dez dedos (Tastenflow); os outros programas não os alteram. Mais tarde, pode alterá-los em \"Definições da turma\", no separador Tastenflow.",
    fuerTastenflow: "Para o Tastenflow",
    bezugNeu: "da nova turma",
    bitteWaehlen: "Selecione",
    startHinweis: "o que a turma já sabe - vale também para quem entrar mais tarde",
    startSrHinweis:
      "Obrigatório. As teclas até este nível ficam desbloqueadas desde o início para cada pessoa desta turma - " +
      "também para quem entrar mais tarde. Quem já estiver mais à frente não perde nada.",
    anlegenTipp: "Cria a turma com todos os dados. O código da turma vale depois em todos os programas de aprendizagem.",
    klasseAnlegen: "Criar turma",
    zuerstKlasse: "Crie primeiro uma turma - é com o código dela que se inicia sessão.",
    klasseVor: "Turma: ",
    codeFuerLernende: " - código da turma para estudantes",
    bearbeitenTipp: "Alterar o nome ou o código da turma.",
    klasseBearbeiten: "Editar turma",
    bearbeiten: " Editar",
    loeschenTipp: "Elimina esta turma com todas as pessoas - depois de uma confirmação.",
    klasseLoeschen: "Eliminar turma",
    klasseLoeschenKnopf: " Eliminar turma",
    codeAendernTipp:
      "2 a 12 carateres, letras, algarismos, ponto ou hífen. Se o alterar, toda a turma passa a iniciar sessão com o novo código.",
    speichernTipp: "Guarda o novo nome e o novo código da turma.",
    speichern: "Guardar",
    abbrechenTipp: "Fecha a edição sem alterar nada.",
    abbrechen: "Cancelar",
    codeWarnVor: "⚠️ Depois de alterar o código,",
    // Das Verb zieht mit der Zahl (Glossar §2.11) - darum steht es hier.
    codeWarnWer: (n: number) =>
      mehrzahl(n, "pt", {
        one: () => "a pessoa desta turma inicia sessão",
        other: (z) => `as ${z} pessoas desta turma iniciam sessão`,
        many: (z) => `as ${z} de pessoas desta turma iniciam sessão`,
      }),
    codeWarnMitte: "a partir de agora com o ",
    codeWarnNeu: "novo",
    codeWarnEnde: " código.",
    wochenbericht: " Resumo semanal por e-mail (uma vez por semana, à segunda-feira, com os números do Tastenflow)",
    wochenberichtAnAdresse: "para ",
    lernende: "Estudantes (",
    druckenTipp: "Imprimir nomes, palavras-passe e código da turma das pessoas acabadas de adicionar.",
    drucken: " Imprimir dados de acesso (",
    zurKlasse: "Adicionar à turma",
    nameTipp: "Basta o nome próprio. Só pode existir uma vez nesta turma - maiúsculas e minúsculas não contam.",
    name: "Nome",
    passwort: "Palavra-passe",
    passwortBeispiel: "pelo menos 4 carateres",
    zufallTipp: "Cria uma palavra-passe fácil de escrever, com 5 letras e algarismos, e coloca-a no campo.",
    zufall: "Aleatória",
    kontakt: "E-mail de contacto (opcional)",
    kontaktTipp:
      "Se houver aqui um endereço, os dados de acesso seguem automaticamente por e-mail - ao adicionar a pessoa e sempre que a palavra-passe for reposta.",
    kontaktBeispiel: "p. ex., para encarregados de educação",
    womitAnfangen: "Tastenflow: por onde começar?",
    womitTipp:
      "O que esta pessoa já sabe. As teclas até aqui ficam desbloqueadas desde o início. O ponto de partida da turma vem pré-selecionado.",
    hinzufuegenTipp:
      "Adiciona a pessoa a esta turma com nome, palavra-passe e - para o Tastenflow - o ponto de partida. Tudo o resto (língua, produtos de apoio...) define-se depois no separador do programa respetivo. Os textos dos exercícios seguem o ano de escolaridade da turma (indicado ao criar a turma, avança sozinho em cada ano letivo) - não é pedido o ano de nascimento. Depois, o foco volta ao campo do nome.",
    hinzufuegen: "Adicionar",
    excelTitel: "Várias pessoas de uma vez (Excel)",
    kommenInKlasse: "As pessoas entram nesta turma: ",
    vorlageTipp: (datei: string) =>
      `Transfere o ficheiro Excel ${datei}: na primeira folha, em cima, a turma e a data, por baixo a escolha do ponto de partida para todas as pessoas e 40 linhas para preencher; na folha de instruções, a explicação e a lista dos pontos de partida. Escreva uma linha por pessoa (nome e palavra-passe - se ficar vazia, o programa cria uma) e carregue depois o ficheiro aqui; antes de adicionar, verá uma pré-visualização.`,
    vorlage: "Transferir modelo (Excel)",
    importTipp:
      "Abre a seleção de ficheiros para o modelo preenchido (.xlsx). Primeiro aparece uma pré-visualização - as contas só são criadas depois de confirmar.",
    importieren: "Adicionar estudantes a partir de um ficheiro Excel",
    listeTipp:
      "Transfere um ficheiro Word com nome, palavra-passe e código da turma de TODAS as pessoas desta turma - para imprimir e distribuir.",
    liste: "Transferir lista da turma",
    vorschauVor: "Pré-visualização: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `A adicionar à turma ${klasse}: ${wort}. ` +
      `Só fica guardado depois de selecionar "Adicionar".`,
    vorschauKeiner: "Este ficheiro não adiciona ninguém.",
    escape: "Esc cancela.",
    passwortPunkt: " - Palavra-passe",
    passwortErzeugt: " (palavra-passe criada pelo programa)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (ponto de partida da turma)",
    vorgabe: " (predefinido)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "pt", {
        one: (z) => `${z} linha`,
        other: (z) => `${z} linhas`,
        many: (z) => `${z} de linhas`,
      }),
      " ",
      mehrzahl(n, "pt", {
        one: () => "não será incluída",
        other: () => "não serão incluídas",
        many: () => "não serão incluídas",
      }),
    ],
    korrigieren:
      "Pode corrigir estas linhas no ficheiro e carregá-lo outra vez mais tarde. As pessoas que já estiverem na turma aparecem na pré-visualização com a nota \"Este nome já existe na turma.\"",
    anlegenTippImport:
      "Adiciona à turma, uma a uma, as pessoas da pré-visualização. Depois, o foco passa para o título \"Estudantes\", com o resultado por baixo.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Adicionar: ",
      mehrzahl(n, "pt", {
        one: (z) => `${z} pessoa`,
        other: (z) => `${z} pessoas`,
        many: (z) => `${z} de pessoas`,
      }),
    ],
    verwerfenTipp: "Fecha a pré-visualização sem adicionar ninguém (Esc).",
    nochKeine:
      "Ainda não há estudantes nesta turma. Adicione pessoas acima - depois, iniciam sessão com o código da turma, o nome e a palavra-passe (em qualquer dispositivo).",
    wirdVerschoben: "A mover...",
    verschiebenLaeuft: "Um momento - a mudança de turma ainda está a decorrer.",
    zielFehlt: "Introduza o código da nova turma.",
    // Der Desafio steht fest (Mehrzahl mit Artikel) - wie cs ohne den Platzhalter.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Mover ${name} para a turma com o código ${code}?\n\n` +
      `- ${name} passa a iniciar sessão com o novo código da turma ${code}.\n` +
      `- Docentes da nova turma veem ${name} e os progressos.\n` +
      `- Os resultados dos Desafios e as mensagens ficam na turma anterior.\n` +
      `- Só continua a ver ${name} se também for docente da nova turma.`,
    nichtsVerschoben: "Nada foi movido.",
    emailFalsch: "Isto não parece um endereço de e-mail - também pode deixar o campo vazio.",
    kontaktGespeichert: "E-mail de contacto guardado.",
    kontaktEntfernt: "E-mail de contacto removido.",
    passwortTipp: (name: string) => `Abre e fecha o campo da nova palavra-passe. Pessoa: ${name}.`,
    passwortAendern: "Alterar palavra-passe",
    kontaktKnopfTipp: (name: string) =>
      `Abre e fecha o campo do e-mail de contacto. Pessoa: ${name}. Se estiver preenchido, a palavra-passe segue automaticamente por e-mail sempre que for definida ou reposta.`,
    kontaktKnopfName: (name: string) => `E-mail de contacto: ${name}`,
    kontaktKnopf: "E-mail de contacto",
    verschiebenTipp: (name: string) =>
      `Abre o campo para mudar de turma - também para uma turma de outros docentes, se conhecer o código da turma. Pessoa: ${name}.`,
    verschiebenName: (name: string) => `Mover para outra turma: ${name}`,
    verschiebenKnopf: "Mover para outra turma",
    loeschenKindTipp: (name: string) =>
      `Elimina a conta e os progressos em todos os programas de aprendizagem - depois de uma confirmação. Pessoa: ${name}.`,
    loeschenKindName: (name: string) => `Eliminar: ${name}`,
    loeschenKnopf: " Eliminar",
    kontaktVon: "E-mail de contacto: ",
    kontaktLeer: "campo vazio = sem e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Guarda o e-mail de contacto - um campo vazio remove-o. Pessoa: ${name}.`,
    schliessenTipp: "Fecha o campo sem guardar (Esc).",
    codeNeueKlasse: "Código da nova turma",
    folgenTipp: (name: string, _pruefung: string) =>
      `Depois, ${name} inicia sessão com o novo código da turma. Docentes da nova turma veem ${name} e os progressos. Os resultados dos Desafios e as mensagens ficam nesta turma.`,
    zielBeispiel: "p. ex., 4A",
    verschiebeTipp: (name: string) =>
      `Depois de uma confirmação, muda para a turma com este código. Pessoa: ${name}.`,
    verschieben: "Mover",
    nichtVerschiebenTipp: "Fecha o campo sem mover nada (Esc).",
  },
  br: {
    auswahlSpeichert: "Um instante - a seleção ainda está sendo salva.",
    keinProgramm: "Nenhum aplicativo selecionado - aparece o aplicativo de onde você veio.",
    auswahlGespeichert: "A seleção de aplicativos foi salva.",
    programmeKlasse: "Aplicativos desta turma",
    nurAnsicht: "Esta seleção muda apenas ",
    ihreAnsicht: "a sua visualização",
    nurAnsichtRest:
      ": os aplicativos não selecionados ficam sem guia e sem coluna aqui. As pessoas da turma continuam podendo abrir todos os aplicativos - nada é bloqueado.",
    fehltName: "o nome da turma",
    fehltCodeGueltig:
      "um código da turma válido (de 2 a 12 caracteres: letras, algarismos, ponto ou hífen)",
    fehltCode: "o código da turma",
    fehltSchulstufe: "o ano escolar",
    fehltStart: "o ponto de partida",
    und: " e ",
    fehltSatz: (liste: string) => `Para criar a turma, preencha ainda: ${liste}.`,
    teilnehmer: (n: number) =>
      n === 0
        ? "nenhuma pessoa"
        : mehrzahl(n, "br", {
            one: (z) => `${z} pessoa`,
            other: (z) => `${z} pessoas`,
          }),
    zeilen: (n: number) =>
      n === 0
        ? "nenhuma linha"
        : mehrzahl(n, "br", {
            one: (z) => `${z} linha`,
            other: (z) => `${z} linhas`,
          }),
    ersteSchritte: "Primeiros passos",
    schrittKlasse: "Criar turma",
    schrittKlasseText:
      "Nome, código da turma, ano escolar, idioma, ponto de partida e Competição da turma. O programa sugere um código a partir do nome; você pode mudá-lo. Com esse código, as pessoas da turma entram em todos os aplicativos de aprendizagem.",
    schrittLernende: "Adicionar pessoa",
    schrittLernendeText:
      "Nome e senha, nada mais. Depois você pode imprimir os dados de acesso como lista e distribuí-los.",
    schrittProgramme: "Escolher aplicativos",
    schrittProgrammeText:
      "Quais aplicativos de aprendizagem esta turma usa? Isso muda apenas a sua visualização - as pessoas da turma continuam podendo abrir todos os aplicativos.",
    erledigt: ", concluído",
    jetztDran: ", agora é este",
    wirdGespeichert: "Salvando...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Turma criada: ${name}. Mas estes dados não foram salvos: ${liste}. ` +
      `Complete-os na guia Tastenflow, em Configurações da turma.`,
    klasseAngelegt: (name: string) => `Turma criada: ${name}.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Turma criada: ${name}. O código da turma desejado (${gewuenscht.trim().toUpperCase()}) ` +
      `já é usado por outra turma, por isso vale o código da turma: ${code}.`,
    nameZuerst: "Primeiro, escreva o nome.",
    passwortKurz: "A senha precisa ter pelo menos 4 caracteres.",
    kontaktFalsch: "O e-mail de contato não parece correto - você também pode deixar o campo vazio.",
    kindAngelegt: (name: string) => `Conta criada: ${name}.`,
    vorlageLaedt: (datei: string) => `Baixando o modelo: ${datei}`,
    vorlageFehler: "Não foi possível criar o modelo. Atualize a página e tente de novo.",
    listeWird: "A lista da turma está sendo preparada.",
    listeLaedt: (klasse: string) => `Baixando a lista da turma: ${klasse}`,
    listeFehler: "Não foi possível criar a lista da turma. Atualize a página e tente de novo.",
    nochSpeichern: "Um instante - ainda está salvando.",
    dateiNichtOffen: "Não foi possível abrir o arquivo. Selecione-o de novo.",
    dateiLeer: (datei: string) =>
      `No arquivo ${datei} não há nenhuma pessoa abaixo do cabeçalho. Escreva uma linha para cada pessoa e carregue o arquivo de novo.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Prévia - adicionar: ${anlegen}` +
      (abgelehnt ? `; deixar de fora: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Não é possível adicionar ninguém deste arquivo - os motivos estão na prévia. Corrija o arquivo e carregue-o de novo.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Criando contas: ${nr}/${von} (${name})...`,
    kontoNicht: "Não foi possível criar a conta.",
    ergebnisAngelegt: (anzahl: string) => `Adição concluída: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Sem adição (${n}): ${liste}.`,
    ergebnisDrucken: "Os nomes e as senhas estão no botão Imprimir dados de acesso.",
    anlegenLaeuft: "As contas já estão sendo criadas - aguarde o fim do processo.",
    importAbgebrochen: "A importação foi interrompida - nenhuma conta foi criada.",
    kindLoeschenFrage: (name: string) =>
      `Excluir mesmo a conta: ${name}? Todo o progresso em TODOS os ` +
      `aplicativos de aprendizagem será perdido. Esta ação não pode ser desfeita.`,
    kindGeloescht: (name: string) => `Conta excluída: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Excluir mesmo a turma: ${name}?` +
      (n > 0
        ? ` As contas das pessoas da turma (${mehrzahl(n, "br", {
            one: (z) => `${z} pessoa`,
            other: (z) => `${z} pessoas`,
          })}) ` +
          `e o progresso delas também serão excluídos definitivamente.`
        : "") +
      " Esta ação não pode ser desfeita.",
    klasseGeloescht: (name: string) => `Turma excluída: ${name}.`,
    klassennameFehlt: "Escreva o nome da turma.",
    codeFehlt: "Escreva o código da turma - é com ele que as pessoas da turma entram.",
    codeUngueltig:
      "O código da turma precisa ter de 2 a 12 caracteres: letras, algarismos, ponto ou hífen.",
    klasseGespeichert: "A turma foi salva.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Mudança de turma concluída: ${name}. Nova turma: ${klasse} (código da turma: ${code}). ` +
      `A partir de agora, a entrada é com esse código.`,
    wochenberichtAn: "O resumo semanal está ligado.",
    wochenberichtAus: "O resumo semanal está desligado.",
    druckBlockiert: "A janela de impressão foi bloqueada. Permita janelas pop-up nesta página.",
    klassen: "Turmas",
    klasseWaehlenTipp: (name: string) => `Seleciona a turma ${name} - depois, todas as guias mostram as pessoas dela.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Turma ${name}${gewaehlt ? ", selecionada" : ""}`,
    neueKlasse: "Criar nova turma",
    neueKlasseInhalt: "- nome, código da turma, ano escolar, idioma, ponto de partida, Competição da turma",
    neuProgrammeTitel: "Quais aplicativos a turma usa?",
    neuProgrammeHinweis:
      "Isso só organiza a sua visualização - as pessoas da turma continuam podendo abrir todos os aplicativos. Os dados do Tastenflow (ano escolar, idioma, ponto de partida, Competição da turma) só aparecem quando o Tastenflow está marcado.",
    neuProgrammName: (label: string) => `${label} para a nova turma`,
    fehltProgramm: "pelo menos um aplicativo",
    klassenname: "Nome da turma",
    klassennameBeispiel: "ex.: 3º B ou Girassóis",
    klassencode: "Código da turma",
    klassencodeTipp:
      "Obrigatório. Com esse código, as pessoas da turma entram em todos os aplicativos de aprendizagem, com o mesmo nome e a mesma senha. O programa sugere um código a partir do nome, e você pode mudá-lo: de 2 a 12 caracteres, letras, algarismos, ponto ou hífen.",
    klassencodeBeispiel: "ex.: 3B-SOL",
    fuerTastenflowTipp:
      "Estes dados valem só para a digitação com os dez dedos (Tastenflow); os outros aplicativos não os mudam. Mais tarde, você pode alterá-los na guia Tastenflow, em Configurações da turma.",
    fuerTastenflow: "Para o Tastenflow",
    bezugNeu: "da nova turma",
    bitteWaehlen: "Selecione",
    startHinweis: "o que as pessoas da turma já sabem - vale também para quem entrar depois",
    startSrHinweis:
      "Obrigatório. As teclas até este ponto ficam desbloqueadas desde o início para cada pessoa desta turma - " +
      "também para quem entrar depois. Quem já está mais à frente não perde nada.",
    anlegenTipp: "Cria a turma com todos os dados. Depois, o código da turma vale em todos os aplicativos de aprendizagem.",
    klasseAnlegen: "Criar turma",
    zuerstKlasse: "Primeiro, crie uma turma - é com o código dela que as pessoas entram.",
    klasseVor: "Turma: ",
    codeFuerLernende: " - código da turma para estudantes",
    bearbeitenTipp: "Alterar o nome ou o código da turma.",
    klasseBearbeiten: "Editar turma",
    bearbeiten: " Editar",
    loeschenTipp: "Exclui esta turma com todas as pessoas dela - só depois de confirmar.",
    klasseLoeschen: "Excluir turma",
    klasseLoeschenKnopf: " Excluir turma",
    codeAendernTipp:
      "De 2 a 12 caracteres, letras, algarismos, ponto ou hífen. Depois da mudança, todas as pessoas desta turma entram logo com o novo código.",
    speichernTipp: "Salva o novo nome e o novo código da turma.",
    speichern: "Salvar",
    abbrechenTipp: "Fecha a edição sem mudar nada.",
    abbrechen: "Cancelar",
    codeWarnVor: "⚠️ Depois da mudança do código,",
    // Das Verb zieht mit der Zahl (Glossar §2.11); 0 und 1 fallen beide auf "one".
    codeWarnWer: (n: number) =>
      mehrzahl(n, "br", {
        one: () => "quem está nesta turma entra",
        other: (z) => `as ${z} pessoas desta turma entram`,
      }),
    codeWarnMitte: "a partir de agora com o ",
    codeWarnNeu: "novo",
    codeWarnEnde: " código.",
    wochenbericht: " Resumo semanal por e-mail (uma vez por semana, às segundas-feiras, com os números do Tastenflow)",
    wochenberichtAnAdresse: "para ",
    lernende: "Estudantes (",
    druckenTipp: "Imprima os nomes, as senhas e o código da turma das pessoas que você acabou de adicionar.",
    drucken: " Imprimir dados de acesso (",
    zurKlasse: "Adicionar à turma",
    nameTipp: "O nome basta. Ele só pode aparecer uma vez nesta turma - maiúsculas e minúsculas não fazem diferença.",
    name: "Nome",
    passwort: "Senha",
    passwortBeispiel: "pelo menos 4 caracteres",
    zufallTipp: "Cria uma senha de 5 letras e algarismos, fácil de digitar, e a coloca no campo.",
    zufall: "Aleatória",
    kontakt: "E-mail de contato (opcional)",
    kontaktTipp:
      "Se houver um endereço aqui, os dados de acesso chegam automaticamente por e-mail - ao adicionar e a cada nova definição de senha.",
    kontaktBeispiel: "ex.: dos responsáveis",
    womitAnfangen: "Tastenflow: por onde começar?",
    womitTipp:
      "O que esta pessoa já sabe. As teclas até este ponto ficam desbloqueadas desde o início. O ponto de partida da turma já vem selecionado.",
    hinzufuegenTipp:
      "Adiciona a esta turma uma pessoa com nome, senha e - para o Tastenflow - ponto de partida. Todo o resto (idioma, adaptações...) você define depois, na guia do aplicativo. Os textos de prática seguem o ano escolar da turma (informado ao criar a turma, e sobe automaticamente a cada ano letivo) - ninguém precisa informar o ano de nascimento. Depois, o foco volta para o campo Nome.",
    hinzufuegen: "Adicionar",
    excelTitel: "Várias pessoas de uma vez (Excel)",
    kommenInKlasse: "As pessoas entram nesta turma: ",
    vorlageTipp: (datei: string) =>
      `Baixa o arquivo Excel ${datei}: na planilha Estudantes, a turma e a data no alto, abaixo a escolha do ponto de partida para todas as pessoas e 40 linhas para preencher; na planilha Instruções, o passo a passo e a lista dos pontos de partida. Escreva uma linha para cada pessoa (nome e senha - com a senha vazia, o programa cria uma) e depois carregue o arquivo aqui; antes de adicionar, você vê uma prévia.`,
    vorlage: "Baixar modelo (Excel)",
    importTipp:
      "Abre a seleção de arquivo para o modelo preenchido (.xlsx). Primeiro aparece uma prévia - as contas só são criadas depois de confirmar.",
    importieren: "Adicionar estudantes de um arquivo Excel",
    listeTipp:
      "Baixa um arquivo Word com os nomes, as senhas e o código da turma de TODAS as pessoas desta turma - para imprimir e distribuir.",
    liste: "Baixar lista da turma",
    vorschauVor: "Prévia: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Adição à turma ${klasse}: ${wort}. ` +
      `Nada é salvo antes de você pressionar Adicionar.`,
    vorschauKeiner: "Ninguém será adicionado deste arquivo.",
    escape: "Esc interrompe.",
    passwortPunkt: " - Senha",
    passwortErzeugt: " (senha criada pelo programa)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (ponto de partida da turma)",
    vorgabe: " (padrão)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "br", {
        one: (z) => `${z} linha`,
        other: (z) => `${z} linhas`,
      }),
      " ",
      mehrzahl(n, "br", {
        one: () => "fica de fora",
        other: () => "ficam de fora",
      }),
    ],
    korrigieren:
      "Você pode corrigir essas linhas no arquivo e carregá-lo de novo mais tarde. As pessoas que já estão na turma aparecem na prévia com a observação: Este nome já está na turma.",
    anlegenTippImport:
      "Adiciona a esta turma, uma a uma, as pessoas da prévia. Depois, o foco vai para o título Estudantes; o resultado fica logo abaixo.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Adicionar: ",
      mehrzahl(n, "br", {
        one: (z) => `${z} pessoa`,
        other: (z) => `${z} pessoas`,
      }),
    ],
    verwerfenTipp: "Descarta a prévia sem adicionar ninguém (Esc).",
    nochKeine:
      "Ainda não há ninguém aqui. Adicione as pessoas acima - depois, elas entram com o código da turma, o nome e a senha (de qualquer dispositivo).",
    wirdVerschoben: "Movendo...",
    verschiebenLaeuft: "Um instante - ainda está movendo.",
    zielFehlt: "Escreva o código da nova turma.",
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Mover para a turma com o código ${code}: ${name}?\n\n` +
      `- Depois, a entrada é com o novo código da turma.\n` +
      `- Quem dá aula na nova turma verá esta pessoa e o progresso dela.\n` +
      `- Os resultados dos Desafios e as mensagens ficam na turma anterior.\n` +
      `- Se você não dá aula também na nova turma, não verá mais esta pessoa.`,
    nichtsVerschoben: "Nada foi movido.",
    emailFalsch: "Isso não parece um endereço de e-mail - você também pode deixar o campo vazio.",
    kontaktGespeichert: "O e-mail de contato foi salvo.",
    kontaktEntfernt: "O e-mail de contato foi removido.",
    passwortTipp: (name: string) => `Abre e fecha o campo para a nova senha. Pessoa: ${name}.`,
    passwortAendern: "Alterar senha",
    kontaktKnopfTipp: (name: string) =>
      `Abre e fecha o campo do e-mail de contato. Pessoa: ${name}. Se estiver preenchido, a senha chega automaticamente por e-mail assim que for definida ou alterada.`,
    kontaktKnopfName: (name: string) => `E-mail de contato: ${name}`,
    kontaktKnopf: "E-mail de contato",
    verschiebenTipp: (name: string) =>
      `Abre o campo para mover para outra turma - também para a turma de outra pessoa docente, se você souber o código da turma. Pessoa: ${name}.`,
    verschiebenName: (name: string) => `Mover para outra turma: ${name}`,
    verschiebenKnopf: "Mover para outra turma",
    loeschenKindTipp: (name: string) =>
      `Exclui a conta e o progresso em todos os aplicativos de aprendizagem - só depois de confirmar. Pessoa: ${name}.`,
    loeschenKindName: (name: string) => `Excluir: ${name}`,
    loeschenKnopf: " Excluir",
    kontaktVon: "E-mail de contato: ",
    kontaktLeer: "campo vazio = sem e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Salva o e-mail de contato - o campo vazio o remove. Pessoa: ${name}.`,
    schliessenTipp: "Fecha o campo sem salvar (Esc).",
    codeNeueKlasse: "Código da nova turma",
    folgenTipp: (name: string, _pruefung: string) =>
      `Depois, a entrada é com o novo código da turma. Quem dá aula na nova turma verá esta pessoa e o progresso dela. Os resultados dos Desafios e as mensagens ficam nesta turma. Pessoa: ${name}.`,
    zielBeispiel: "ex.: 4A",
    verschiebeTipp: (name: string) =>
      `Depois de confirmar, move para a turma com este código. Pessoa: ${name}.`,
    verschieben: "Mover",
    nichtVerschiebenTipp: "Fecha o campo sem mover (Esc).",
  },
  ro: {
    auswahlSpeichert: "O clipă - alegerea se salvează încă.",
    keinProgramm: "Niciun program ales - se afișează programul din care ați ajuns aici.",
    auswahlGespeichert: "Alegerea programelor a fost salvată.",
    programmeKlasse: "Programele acestei clase",
    nurAnsicht: "Această alegere schimbă doar ",
    ihreAnsicht: "vizualizarea dumneavoastră",
    nurAnsichtRest:
      ": programele nealese nu au aici nici filă, nici coloană. Elevii pot deschide în continuare orice program - nu se blochează nimic.",
    fehltName: "numele clasei",
    fehltCodeGueltig:
      "un cod al clasei valid (2 până la 12 caractere: litere, cifre, punct sau cratimă)",
    fehltCode: "codul clasei",
    fehltSchulstufe: "anul de studiu",
    fehltStart: "punctul de plecare",
    und: " și ",
    fehltSatz: (liste: string) => `Pentru a crea clasa mai lipsește: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} persoană`,
        few: (z) => `${z} persoane`,
        other: (z) => `${z} de persoane`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} rând`,
        few: (z) => `${z} rânduri`,
        other: (z) => `${z} de rânduri`,
      }),
    ersteSchritte: "Primii pași",
    schrittKlasse: "Creați o clasă",
    schrittKlasseText:
      "Numele, codul clasei și programele clasei. Doar la Tastenflow se adaugă anul de studiu, limba, punctul de plecare și Întrecerea clasei. Programul propune un cod potrivit numelui; îl puteți schimba. Cu acest cod se conectează elevii în toate programele de învățare.",
    schrittLernende: "Adăugați o persoană",
    schrittLernendeText:
      "Numele și parola, nimic altceva. Apoi puteți imprima datele de conectare ca listă și le puteți împărți.",
    schrittProgramme: "Alegeți programele",
    schrittProgrammeText:
      "Ce programe de învățare folosește această clasă? Alegerea schimbă doar vizualizarea dumneavoastră - elevii pot deschide în continuare orice program.",
    erledigt: ", gata",
    jetztDran: ", urmează acum",
    wirdGespeichert: "Se salvează...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Clasă creată: ${name}. Aceste date nu s-au salvat însă: ${liste}. ` +
      `Completați-le în fila Tastenflow, la Setările clasei.`,
    klasseAngelegt: (name: string) => `Clasă creată: ${name}.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Clasă creată: ${name}. Codul clasei dorit (${gewuenscht.trim().toUpperCase()}) ` +
      `este deja folosit, de aceea se aplică acest cod al clasei: ${code}.`,
    nameZuerst: "Scrieți mai întâi un nume.",
    passwortKurz: "Parola trebuie să aibă cel puțin 4 caractere.",
    kontaktFalsch: "E-mailul de contact nu pare corect - puteți lăsa câmpul și gol.",
    kindAngelegt: (name: string) => `Cont creat: ${name}.`,
    vorlageLaedt: (datei: string) => `Se descarcă șablonul: ${datei}`,
    vorlageFehler: "Șablonul nu a putut fi creat. Reîmprospătați pagina și încercați din nou.",
    listeWird: "Lista clasei se pregătește.",
    listeLaedt: (klasse: string) => `Se descarcă lista clasei: ${klasse}`,
    listeFehler: "Lista clasei nu a putut fi creată. Reîmprospătați pagina și încercați din nou.",
    nochSpeichern: "O clipă - salvarea este încă în curs.",
    dateiNichtOffen: "Fișierul nu a putut fi deschis. Alegeți-l din nou.",
    dateiLeer: (datei: string) =>
      `În fișierul ${datei} nu există nicio persoană sub rândul de antet. Scrieți câte un rând pentru fiecare persoană și importați din nou fișierul.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Previzualizare - se adaugă: ${anlegen}` +
      (abgelehnt ? `; nu se preiau: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Din acest fișier nu se poate adăuga nicio persoană - motivele sunt în previzualizare. Corectați fișierul și importați-l din nou.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Se creează conturile: ${nr}/${von} (${name})...`,
    kontoNicht: "Contul nu a putut fi creat.",
    ergebnisAngelegt: (anzahl: string) => `Adăugare reușită: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Nu s-au adăugat (${n}): ${liste}.`,
    ergebnisDrucken: "Numele și parolele se găsesc la butonul Imprimați datele de conectare.",
    anlegenLaeuft: "Crearea conturilor este deja în curs - așteptați până se termină.",
    importAbgebrochen: "Importul s-a întrerupt - nu s-a creat niciun cont.",
    kindLoeschenFrage: (name: string) =>
      `Ștergeți contul: ${name}? Se pierde tot progresul din TOATE ` +
      `programele de învățare. Această acțiune nu poate fi anulată.`,
    kindGeloescht: (name: string) => `Cont șters: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Ștergeți clasa: ${name}?` +
      (n > 0
        ? ` Se șterg definitiv și conturile elevilor (${mehrzahl(n, "ro", {
            one: (z) => `${z} persoană`,
            few: (z) => `${z} persoane`,
            other: (z) => `${z} de persoane`,
          })}) ` +
          `și progresul lor.`
        : "") +
      " Această acțiune nu poate fi anulată.",
    klasseGeloescht: (name: string) => `Clasă ștearsă: ${name}.`,
    klassennameFehlt: "Scrieți numele clasei.",
    codeFehlt: "Scrieți codul clasei - cu el se conectează elevii.",
    codeUngueltig:
      "Codul clasei trebuie să aibă 2 până la 12 caractere: litere, cifre, punct sau cratimă.",
    klasseGespeichert: "Clasa a fost salvată.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Mutare reușită: ${name}. Clasa nouă: ${klasse} (codul clasei: ${code}). ` +
      `De acum înainte, conectarea se face cu acest cod.`,
    wochenberichtAn: "Raportul săptămânal a fost activat.",
    wochenberichtAus: "Raportul săptămânal a fost dezactivat.",
    druckBlockiert: "Fereastra de imprimare a fost blocată. Permiteți ferestrele pop-up pentru această pagină.",
    klassen: "Clase",
    klasseWaehlenTipp: (name: string) => `Selectează clasa ${name} - toate filele arată apoi elevii ei.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Clasa ${name}${gewaehlt ? ", selectată" : ""}`,
    neueKlasse: "Creați o clasă nouă",
    neueKlasseInhalt: "- numele, codul clasei, programele",
    neuProgrammeTitel: "Ce programe folosește clasa?",
    neuProgrammeHinweis:
      "Alegerea schimbă doar vizualizarea dumneavoastră - elevii pot deschide în continuare orice program. Datele pentru Tastenflow (anul de studiu, limba, punctul de plecare, Întrecerea clasei) apar doar dacă Tastenflow este bifat.",
    neuProgrammName: (label: string) => `${label} pentru clasa nouă`,
    fehltProgramm: "cel puțin un program",
    klassenname: "Numele clasei",
    klassennameBeispiel: "de ex. 3B sau Curs pregătitor",
    klassencode: "Codul clasei",
    klassencodeTipp:
      "Obligatoriu. Cu acest cod se conectează elevii - în fiecare program de învățare, cu același nume și aceeași parolă. Programul propune un cod potrivit numelui și îl puteți schimba: 2 până la 12 caractere, litere, cifre, punct sau cratimă.",
    klassencodeBeispiel: "de ex. 3.MS",
    fuerTastenflowTipp:
      "Aceste date sunt valabile doar pentru scrierea cu zece degete (Tastenflow); celelalte programe nu le schimbă. Le puteți schimba mai târziu în fila Tastenflow, la Setările clasei.",
    fuerTastenflow: "Pentru Tastenflow",
    // `KlassenEinstellungsFelder` setzt „pentru clasa …" selbst davor.
    bezugNeu: "nouă",
    bitteWaehlen: "Alegeți",
    startHinweis: "ce știu deja elevii - este valabil și pentru cei care vin mai târziu",
    startSrHinweis:
      "Obligatoriu. Tastele până la acest nivel sunt deblocate de la început pentru fiecare persoană din această clasă - " +
      "și pentru cei care vin mai târziu. Cine a ajuns deja mai departe nu pierde nimic.",
    anlegenTipp: "Creează clasa cu toate datele. Codul clasei este apoi valabil în toate programele de învățare.",
    klasseAnlegen: "Creați clasa",
    zuerstKlasse: "Creați mai întâi o clasă - elevii se conectează cu codul ei.",
    klasseVor: "Clasa: ",
    codeFuerLernende: " - codul clasei pentru elevi",
    bearbeitenTipp: "Schimbați numele sau codul clasei.",
    klasseBearbeiten: "Modificați clasa",
    bearbeiten: " Modificați",
    loeschenTipp: "Șterge această clasă cu toți elevii ei - după o confirmare.",
    klasseLoeschen: "Ștergeți clasa",
    klasseLoeschenKnopf: " Ștergeți clasa",
    codeAendernTipp:
      "2 până la 12 caractere, litere, cifre, punct sau cratimă. Dacă îl schimbați, toți elevii acestei clase se conectează de atunci cu noul cod.",
    speichernTipp: "Salvează noul nume și noul cod al clasei.",
    speichern: "Salvați",
    abbrechenTipp: "Închide modificarea fără nicio schimbare.",
    abbrechen: "Anulați",
    codeWarnVor: "⚠️ După schimbarea codului,",
    // Das Verb zieht mit der Zahl, darum steht es hier.
    codeWarnWer: (n: number) =>
      mehrzahl(n, "ro", {
        one: () => "persoana din această clasă se conectează",
        few: (z) => `toți cei ${z} elevi din această clasă se conectează`,
        other: (z) => `toți cei ${z} de elevi din această clasă se conectează`,
      }),
    codeWarnMitte: "de acum cu ",
    codeWarnNeu: "noul",
    codeWarnEnde: " cod.",
    wochenbericht: " Raport săptămânal prin e-mail (o dată pe săptămână, lunea, cu cifrele din Tastenflow)",
    wochenberichtAnAdresse: "la adresa ",
    lernende: "Elevi (",
    druckenTipp: "Imprimați numele, parolele și codul clasei pentru persoanele adăugate adineauri.",
    drucken: " Imprimați datele de conectare (",
    zurKlasse: "Adăugați în clasă",
    nameTipp: "Este suficient prenumele. Trebuie să apară o singură dată în această clasă - literele mari și mici nu contează.",
    name: "Nume",
    passwort: "Parolă",
    passwortBeispiel: "cel puțin 4 caractere",
    zufallTipp: "Creează o parolă ușor de scris, din 5 litere și cifre, și o pune în câmp.",
    zufall: "La întâmplare",
    kontakt: "E-mail de contact (opțional)",
    kontaktTipp:
      "Dacă aici există o adresă, datele de conectare sosesc automat prin e-mail - la adăugare și la fiecare resetare a parolei.",
    kontaktBeispiel: "de ex. pentru părinți",
    womitAnfangen: "Tastenflow: de unde începe?",
    womitTipp:
      "Ce știe deja această persoană. Tastele până aici sunt deblocate de la început. Este preselectat punctul de plecare al clasei.",
    hinzufuegenTipp:
      "Adaugă în această clasă o persoană cu nume, parolă și - pentru Tastenflow - punct de plecare. Tot restul (limba, tehnologii asistive...) setați apoi în fila programului respectiv. Textele de exersare se orientează după anul de studiu al clasei (se introduce la crearea clasei și crește singur în fiecare an școlar) - anul nașterii nu se cere. Apoi focalizarea revine în câmpul Nume.",
    hinzufuegen: "Adăugați",
    excelTitel: "Mai multe persoane deodată (Excel)",
    kommenInKlasse: "Elevii se adaugă în această clasă: ",
    vorlageTipp: (datei: string) =>
      `Descarcă fișierul Excel ${datei}: în foaia Elevi, sus clasa și data, dedesubt alegerea punctului de plecare pentru toți și 40 de rânduri de completat; în foaia Instrucțiuni, pașii și lista punctelor de plecare. Scrieți câte un rând pentru fiecare persoană (numele și parola - dacă parola rămâne goală, o creează programul), apoi importați fișierul aici; înainte de adăugare vedeți o previzualizare.`,
    vorlage: "Descărcați șablonul (Excel)",
    importTipp:
      "Deschide alegerea fișierului pentru șablonul completat (.xlsx). Mai întâi apare o previzualizare - conturile se creează abia după confirmare.",
    importieren: "Adăugați elevi dintr-un fișier Excel",
    listeTipp:
      "Descarcă un fișier Word cu numele, parolele și codul clasei pentru TOȚI elevii acestei clase - de imprimat și de împărțit.",
    liste: "Descărcați lista clasei",
    vorschauVor: "Previzualizare: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Se adaugă în clasa ${klasse}: ${wort}. ` +
      `Se salvează abia după ce alegeți butonul de adăugare.`,
    vorschauKeiner: "Din acest fișier nu se adaugă nicio persoană.",
    escape: "Esc întrerupe.",
    passwortPunkt: " - Parolă",
    passwortErzeugt: " (parolă creată de program)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (punctul de plecare al clasei)",
    vorgabe: " (implicit)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "ro", {
        one: (z) => `${z} rând`,
        few: (z) => `${z} rânduri`,
        other: (z) => `${z} de rânduri`,
      }),
      " ",
      mehrzahl(n, "ro", {
        one: () => "nu se preia",
        few: () => "nu se preiau",
        other: () => "nu se preiau",
      }),
    ],
    korrigieren:
      "Puteți corecta aceste rânduri în fișier și le puteți importa din nou mai târziu. Persoanele care există deja în clasă apar în previzualizare cu mențiunea „Acest nume există deja în clasă.”",
    anlegenTippImport:
      "Adaugă pe rând în această clasă persoanele din previzualizare. Apoi focalizarea trece pe titlul Elevi, iar dedesubt este rezultatul.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Adăugați: ",
      mehrzahl(n, "ro", {
        one: (z) => `${z} persoană`,
        few: (z) => `${z} persoane`,
        other: (z) => `${z} de persoane`,
      }),
    ],
    verwerfenTipp: "Renunță la previzualizare fără să adauge nicio persoană (Esc).",
    nochKeine:
      "Încă nu există elevi. Adăugați-i mai sus - apoi se conectează cu codul clasei, numele și parola (de pe orice dispozitiv).",
    wirdVerschoben: "Se mută...",
    verschiebenLaeuft: "O clipă - mutarea este încă în curs.",
    zielFehlt: "Scrieți codul clasei noi.",
    // „Provocărilor" steht fest (Genitiv Mehrzahl) - der Platzhalter käme im Nominativ.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Mutați în clasa cu codul ${code}: ${name}?\n\n` +
      `- Conectarea se face apoi cu noul cod al clasei.\n` +
      `- Cadrele didactice ale clasei noi vor vedea această persoană și progresul ei.\n` +
      `- Rezultatele Provocărilor și mesajele rămân la clasa anterioară.\n` +
      `- Dacă nu predați și la clasa nouă, nu veți mai vedea această persoană.`,
    nichtsVerschoben: "Nu s-a mutat nimic.",
    emailFalsch: "Nu pare o adresă de e-mail - puteți lăsa câmpul și gol.",
    kontaktGespeichert: "E-mailul de contact a fost salvat.",
    kontaktEntfernt: "E-mailul de contact a fost eliminat.",
    passwortTipp: (name: string) => `Deschide și închide câmpul pentru o parolă nouă. Persoana: ${name}.`,
    passwortAendern: "Schimbați parola",
    kontaktKnopfTipp: (name: string) =>
      `Deschide și închide câmpul pentru e-mailul de contact. Persoana: ${name}. Dacă este completat, parola sosește automat prin e-mail, de fiecare dată când este setată sau resetată.`,
    kontaktKnopfName: (name: string) => `E-mail de contact: ${name}`,
    kontaktKnopf: "E-mail de contact",
    verschiebenTipp: (name: string) =>
      `Deschide câmpul pentru mutarea în altă clasă - și în clasa altui cadru didactic, dacă îi cunoașteți codul clasei. Persoana: ${name}.`,
    verschiebenName: (name: string) => `Mutați în altă clasă: ${name}`,
    verschiebenKnopf: "Mutați în altă clasă",
    loeschenKindTipp: (name: string) =>
      `Șterge contul și progresul din toate programele de învățare - după o confirmare. Persoana: ${name}.`,
    loeschenKindName: (name: string) => `Ștergeți: ${name}`,
    loeschenKnopf: " Ștergeți",
    kontaktVon: "E-mail de contact: ",
    kontaktLeer: "câmp gol = fără e-mail",
    kontaktSpeichernTipp: (name: string) =>
      `Salvează e-mailul de contact - un câmp gol îl elimină. Persoana: ${name}.`,
    schliessenTipp: "Închide câmpul fără salvare (Esc).",
    codeNeueKlasse: "Codul clasei noi",
    folgenTipp: (name: string, _pruefung: string) =>
      `Conectarea se face apoi cu noul cod al clasei. Cadrele didactice ale clasei noi vor vedea această persoană și progresul ei. Rezultatele Provocărilor și mesajele rămân la această clasă. Persoana: ${name}.`,
    zielBeispiel: "de ex. 4A",
    verschiebeTipp: (name: string) =>
      `După confirmare, mută în clasa cu acest cod. Persoana: ${name}.`,
    verschieben: "Mutați",
    nichtVerschiebenTipp: "Închide câmpul fără mutare (Esc).",
  },
  sv: {
    auswahlSpeichert: "Ett ögonblick - valet sparas fortfarande.",
    keinProgramm: "Inget program är valt - programmet du kom hit från visas.",
    auswahlGespeichert: "Valet av program har sparats.",
    programmeKlasse: "Program i den här klassen",
    nurAnsicht: "Det här styr bara ",
    ihreAnsicht: "din visning",
    nurAnsichtRest:
      ": program som inte är valda får ingen flik och ingen kolumn här. Eleverna kan fortfarande öppna alla program - inget låses.",
    fehltName: "klassnamnet",
    fehltCodeGueltig:
      "en giltig klasskod (2 till 12 tecken: bokstäver, siffror, punkt eller bindestreck)",
    fehltCode: "klasskoden",
    fehltSchulstufe: "årskursen",
    fehltStart: "startpunkten",
    und: " och ",
    fehltSatz: (liste: string) => `För att skapa klassen saknas fortfarande: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "sv", { one: (z) => `${z} elev`, other: (z) => `${z} elever` }),
    zeilen: (n: number) => mehrzahl(n, "sv", { one: (z) => `${z} rad`, other: (z) => `${z} rader` }),
    ersteSchritte: "Kom igång",
    schrittKlasse: "Skapa klass",
    schrittKlasseText:
      "Namn, klasskod och klassens program. Bara för Tastenflow tillkommer årskurs, språk, startpunkt och Klasstävlingen. Programmet föreslår en kod som passar namnet; du kan ändra den. Med den loggar eleverna in i alla lärprogram.",
    schrittLernende: "Lägg till elever",
    schrittLernendeText:
      "Namn och lösenord, inget mer. Sedan kan du skriva ut inloggningsuppgifterna som en lista och dela ut dem.",
    schrittProgramme: "Välj program",
    schrittProgrammeText:
      "Vilka lärprogram använder klassen? Det ordnar bara din visning - eleverna kan fortfarande öppna alla program.",
    erledigt: ", klart",
    jetztDran: ", nästa steg",
    wirdGespeichert: "Sparar...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Klassen ${name} har skapats, men det här sparades inte: ${liste}. ` +
      `Fyll i det under Klassens inställningar på fliken Tastenflow.`,
    klasseAngelegt: (name: string) => `Klassen ${name} har skapats.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Klassen ${name} har skapats - klasskoden ${gewuenscht.trim().toUpperCase()} används redan, ` +
      `så nu gäller klasskoden ${code}.`,
    nameZuerst: "Skriv först ett namn.",
    passwortKurz: "Lösenordet måste ha minst 4 tecken.",
    kontaktFalsch: "E-postadressen för kontakt ser inte rätt ut - du kan också lämna fältet tomt.",
    kindAngelegt: (name: string) => `${name} har lagts till.`,
    vorlageLaedt: (datei: string) => `Mallen ${datei} laddas ned.`,
    vorlageFehler: "Det gick inte att skapa mallen. Läs in sidan på nytt och försök igen.",
    listeWird: "Klasslistan ställs samman.",
    listeLaedt: (klasse: string) => `Klasslistan för klassen ${klasse} laddas ned.`,
    listeFehler: "Det gick inte att skapa klasslistan. Läs in sidan på nytt och försök igen.",
    nochSpeichern: "Ett ögonblick - det sparas fortfarande.",
    dateiNichtOffen: "Det gick inte att öppna filen. Välj den igen.",
    dateiLeer: (datei: string) =>
      `I filen ${datei} finns ingen elev under rubrikraden. Fyll i en rad per elev och läs in filen igen.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Förhandsvisning: ${anlegen} läggs till` +
      (abgelehnt ? `, ${abgelehnt} tas inte med.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "Det går inte att lägga till någon elev från den här filen - orsakerna står i förhandsvisningen. Rätta filen och läs in den igen.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Läggs till: ${nr}/${von} (${name})...`,
    kontoNicht: "Det gick inte att skapa kontot.",
    ergebnisAngelegt: (anzahl: string) => `Tillagda: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Inte tillagda (${n}): ${liste}.`,
    ergebnisDrucken: "Namn och lösenord finns under Skriv ut inloggningsuppgifter.",
    anlegenLaeuft: "Eleverna läggs redan till - vänta tills det är klart.",
    importAbgebrochen: "Inläsningen avbröts - ingen elev har lagts till.",
    kindLoeschenFrage: (name: string) =>
      `Vill du ta bort ${name}? Alla framsteg i alla lärprogram försvinner. Det går inte att ångra.`,
    kindGeloescht: (name: string) => `${name} har tagits bort.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Vill du ta bort klassen ${name}?` +
      (n > 0
        ? ` Då tas även ${mehrzahl(n, "sv", {
            one: (z) => `${z} elev`,
            other: (z) => `${z} elever`,
          })} och alla framsteg bort för alltid.`
        : "") +
      " Det går inte att ångra.",
    klasseGeloescht: (name: string) => `Klassen ${name} har tagits bort.`,
    klassennameFehlt: "Skriv ett klassnamn.",
    codeFehlt: "Skriv en klasskod - eleverna loggar in med den.",
    codeUngueltig:
      "Klasskoden ska ha 2 till 12 tecken: bokstäver, siffror, punkt eller bindestreck.",
    klasseGespeichert: "Klassen har sparats.",
    verschoben: (name: string, klasse: string, code: string) =>
      `${name} är nu i klassen ${klasse} (klasskod ${code}) och loggar in med den här koden från och med nu.`,
    wochenberichtAn: "Veckorapporten är påslagen.",
    wochenberichtAus: "Veckorapporten är avstängd.",
    druckBlockiert: "Utskriftsfönstret blockerades. Tillåt popup-fönster för den här sidan.",
    klassen: "Klasser",
    klasseWaehlenTipp: (name: string) => `Väljer klassen ${name} - alla flikar visar sedan dess elever.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Klass ${name}${gewaehlt ? ", vald" : ""}`,
    neueKlasse: "Skapa ny klass",
    neueKlasseInhalt: "- namn, klasskod, program",
    neuProgrammeTitel: "Vilka program använder klassen?",
    neuProgrammeHinweis:
      "Det ordnar bara din visning - eleverna kan fortfarande öppna alla program. Uppgifterna för Tastenflow (årskurs, språk, startpunkt, Klasstävlingen) visas bara när Tastenflow är markerat.",
    neuProgrammName: (label: string) => `${label} för den nya klassen`,
    fehltProgramm: "minst ett program",
    klassenname: "Klassnamn",
    klassennameBeispiel: "till exempel 3b eller Förberedande kurs",
    klassencode: "Klasskod",
    klassencodeTipp:
      "Obligatoriskt. Eleverna loggar in med den här koden - i varje lärprogram, med samma namn och lösenord. Programmet föreslår en kod som passar namnet och du kan ändra den: 2 till 12 tecken, bokstäver, siffror, punkt eller bindestreck.",
    klassencodeBeispiel: "till exempel 3.MS",
    fuerTastenflowTipp:
      "De här uppgifterna gäller bara när eleverna skriver med alla tio fingrar (Tastenflow); de andra programmen ändrar dem inte. Du kan ändra dem senare under Klassens inställningar på fliken Tastenflow.",
    fuerTastenflow: "För Tastenflow",
    bezugNeu: "den nya klassen",
    bitteWaehlen: "Välj",
    startHinweis: "vad eleverna redan kan - gäller även dem som kommer till senare",
    startSrHinweis:
      "Obligatoriskt. Tangenterna fram till den här nivån är upplåsta från början för varje elev i klassen - " +
      "även för elever som kommer till senare. En elev som redan har kommit längre förlorar ingenting.",
    anlegenTipp: "Skapar klassen med alla uppgifter. Klasskoden gäller sedan i alla lärprogram.",
    klasseAnlegen: "Skapa klass",
    zuerstKlasse: "Skapa först en klass - eleverna loggar in med klassens klasskod.",
    klasseVor: "Klass ",
    codeFuerLernende: " - klasskod för eleverna",
    bearbeitenTipp: "Ändra klassnamn eller klasskod.",
    klasseBearbeiten: "Redigera klass",
    bearbeiten: " Redigera",
    loeschenTipp: "Tar bort den här klassen med alla elever - efter en bekräftelsefråga.",
    klasseLoeschen: "Ta bort klass",
    klasseLoeschenKnopf: " Ta bort klass",
    codeAendernTipp:
      "2 till 12 tecken, bokstäver, siffror, punkt eller bindestreck. Om du ändrar koden loggar alla elever i klassen in med den nya koden från och med då.",
    speichernTipp: "Sparar det nya klassnamnet och den nya klasskoden.",
    speichern: "Spara",
    abbrechenTipp: "Stänger redigeringen utan att ändra något.",
    abbrechen: "Avbryt",
    codeWarnVor: "⚠️ Om koden ändras använder",
    codeWarnWer: (n: number) =>
      mehrzahl(n, "sv", { one: () => "eleven", other: (z) => `alla ${z} elever` }),
    codeWarnMitte: "i klassen från och med då den ",
    codeWarnNeu: "nya",
    codeWarnEnde: " koden.",
    wochenbericht: " Veckorapport via e-post (en gång i veckan, på måndagar, med siffrorna från Tastenflow)",
    wochenberichtAnAdresse: "till ",
    lernende: "Elever (",
    druckenTipp: "Skriv ut namn, lösenord och klasskod för de elever du just har lagt till.",
    drucken: " Skriv ut inloggningsuppgifter (",
    zurKlasse: "Lägg till i klassen",
    nameTipp: "Det räcker med förnamnet. Namnet får bara finnas en gång i klassen - stora och små bokstäver räknas som samma.",
    name: "Namn",
    passwort: "Lösenord",
    passwortBeispiel: "minst 4 tecken",
    zufallTipp: "Skapar ett lösenord med 5 bokstäver och siffror som är lätt att skriva och lägger in det i fältet.",
    zufall: "Slumpat",
    kontakt: "E-post för kontakt (frivilligt)",
    kontaktTipp:
      "Om det står en adress här får eleven sina inloggningsuppgifter automatiskt via e-post - när eleven läggs till och varje gång lösenordet återställs.",
    kontaktBeispiel: "till exempel till föräldrar",
    womitAnfangen: "Tastenflow: var ska eleven börja?",
    womitTipp:
      "Vad eleven redan kan. Tangenterna fram till hit är upplåsta från början. Klassens startpunkt är förvald.",
    hinzufuegenTipp:
      "Lägger till eleven i den här klassen med namn, lösenord och - för Tastenflow - startpunkt. Allt annat (språk, hjälpmedel...) ställer du in senare på fliken för respektive program. Övningstexterna följer klassens årskurs (anges när klassen skapas och räknas upp av sig själv varje läsår) - inget födelseår samlas in. Sedan är fokus i namnfältet igen.",
    hinzufuegen: "Lägg till",
    excelTitel: "Många elever på en gång (Excel)",
    kommenInKlasse: "Eleverna läggs till i klassen ",
    vorlageTipp: (datei: string) =>
      `Laddar ned Excel-filen ${datei}: på bladet Elever står klass och datum överst, under det valet av startpunkt för alla elever och 40 rader att fylla i; på bladet Anvisningar finns instruktionerna och listan över startpunkter. Fyll i en rad per elev (namn och lösenord - om lösenordet är tomt skapar programmet ett) och läs sedan in filen här; du ser en förhandsvisning innan någon läggs till.`,
    vorlage: "Ladda ned mall (Excel)",
    importTipp:
      "Öppnar filvalet för den ifyllda mallen (.xlsx). Först visas en förhandsvisning - eleverna läggs inte till förrän du bekräftar.",
    importieren: "Lägg till elever från en Excel-fil",
    listeTipp:
      "Laddar ned en Word-fil med namn, lösenord och klasskod för alla elever i klassen - att skriva ut och dela ut.",
    liste: "Ladda ned klasslista",
    vorschauVor: "Förhandsvisning: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Läggs till i klassen ${klasse}: ${wort}. ` +
      `Inget sparas förrän du väljer Lägg till.`,
    vorschauKeiner: "Ingen elev läggs till från den här filen.",
    escape: "Esc avbryter.",
    passwortPunkt: " - lösenord",
    passwortErzeugt: " (lösenordet skapat av programmet)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (klassens startpunkt)",
    vorgabe: " (standard)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "sv", { one: (z) => `${z} rad`, other: (z) => `${z} rader` }),
      " tas inte med",
    ],
    korrigieren:
      "Du kan rätta de här raderna i filen och läsa in den igen senare. Den som redan har lagts till då visas i förhandsvisningen med texten: Det finns redan en elev med det namnet i klassen.",
    anlegenTippImport:
      "Lägger till eleverna från förhandsvisningen i klassen, en i taget. Sedan är fokus på rubriken Elever, med resultatet under den.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Lägg till ",
      mehrzahl(n, "sv", { one: (z) => `${z} elev`, other: (z) => `${z} elever` }),
    ],
    verwerfenTipp: "Kastar förhandsvisningen utan att lägga till någon (Esc).",
    nochKeine:
      "Inga elever än. Lägg till dem ovan - sedan loggar de in med klasskod, namn och lösenord (från vilken enhet som helst).",
    wirdVerschoben: "Flyttar...",
    verschiebenLaeuft: "Ett ögonblick - flytten pågår fortfarande.",
    zielFehlt: "Skriv klasskoden för den nya klassen.",
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Flytta ${name} till klassen med klasskoden ${code}?\n\n` +
      `- ${name} loggar sedan in med den nya klasskoden ${code}.\n` +
      `- Lärarna i den nya klassen ser ${name} och framstegen.\n` +
      `- Resultat från Utmaningar och meddelanden ligger kvar i den tidigare klassen.\n` +
      `- Du ser sedan bara ${name} om du också är lärare i den nya klassen.`,
    nichtsVerschoben: "Inget har flyttats.",
    emailFalsch: "Det ser inte ut som en e-postadress - du kan också lämna fältet tomt.",
    kontaktGespeichert: "E-post för kontakt har sparats.",
    kontaktEntfernt: "E-post för kontakt har tagits bort.",
    passwortTipp: (name: string) => `Öppnar och stänger fältet för ett nytt lösenord: ${name}.`,
    passwortAendern: "Ändra lösenord",
    kontaktKnopfTipp: (name: string) =>
      `Öppnar och stänger fältet för e-post för kontakt: ${name}. Om en adress finns får eleven sitt lösenord automatiskt via e-post så snart det sätts eller återställs.`,
    kontaktKnopfName: (name: string) => `E-post för kontakt: ${name}`,
    kontaktKnopf: "E-post för kontakt",
    verschiebenTipp: (name: string) =>
      `Öppnar fältet för att flytta ${name} till en annan klass - även till en annan lärares klass, om du känner till klasskoden.`,
    verschiebenName: (name: string) => `Flytta till en annan klass: ${name}`,
    verschiebenKnopf: "Flytta till en annan klass",
    loeschenKindTipp: (name: string) =>
      `Tar bort ${name} och alla framsteg i alla lärprogram - efter en bekräftelsefråga.`,
    loeschenKindName: (name: string) => `Ta bort ${name}`,
    loeschenKnopf: " Ta bort",
    kontaktVon: "E-post för kontakt: ",
    kontaktLeer: "tomt fält = ingen e-post",
    kontaktSpeichernTipp: (name: string) =>
      `Sparar e-post för kontakt: ${name}. Ett tomt fält tar bort adressen.`,
    schliessenTipp: "Stänger fältet utan att spara (Esc).",
    codeNeueKlasse: "Klasskod för den nya klassen",
    folgenTipp: (name: string, _pruefung: string) =>
      `Sedan loggar ${name} in med den nya klasskoden. Lärarna i den nya klassen ser ${name} och framstegen. Resultat från Utmaningar och meddelanden ligger kvar i den här klassen.`,
    zielBeispiel: "till exempel 4A",
    verschiebeTipp: (name: string) =>
      `Flyttar ${name} till klassen med den här klasskoden - efter en bekräftelsefråga.`,
    verschieben: "Flytta",
    nichtVerschiebenTipp: "Stänger fältet utan att flytta något (Esc).",
  },
  uk: {
    auswahlSpeichert: "Хвилинку - вибір ще зберігається.",
    keinProgramm: "Не вибрано жодної програми - показано програму, з якої ви сюди перейшли.",
    auswahlGespeichert: "Вибір програм збережено.",
    programmeKlasse: "Програми цього класу",
    nurAnsicht: "Цей вибір змінює лише ",
    ihreAnsicht: "те, що бачите ви",
    nurAnsichtRest:
      ": невибрані програми не мають тут вкладки й стовпця. Учні можуть і далі відкривати кожну програму - нічого не блокується.",
    fehltName: "назва класу",
    fehltCodeGueltig:
      "дійсний код класу (від 2 до 12 знаків: літери, цифри, крапка або дефіс)",
    fehltCode: "код класу",
    fehltSchulstufe: "рік навчання",
    fehltStart: "точка старту",
    und: " і ",
    fehltSatz: (liste: string) => `Щоб створити клас, ще бракує: ${liste}.`,
    teilnehmer: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} особа`,
        few: (z) => `${z} особи`,
        many: (z) => `${z} осіб`,
        other: (z) => `${z} особи`,
      }),
    zeilen: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} рядок`,
        few: (z) => `${z} рядки`,
        many: (z) => `${z} рядків`,
        other: (z) => `${z} рядка`,
      }),
    ersteSchritte: "Перші кроки",
    schrittKlasse: "Створити клас",
    schrittKlasseText:
      "Назва, код класу й програми класу. Лише для Tastenflow додаються рік навчання, мова, точка старту й Перегони класу. Код програма пропонує відповідно до назви; ви можете його змінити. З цим кодом учні входять в усі навчальні програми.",
    schrittLernende: "Додати учнів",
    schrittLernendeText:
      "Ім'я й пароль, більше нічого. Потім ви можете надрукувати дані для входу як список і роздати.",
    schrittProgramme: "Вибрати програми",
    schrittProgrammeText:
      "Які навчальні програми використовує цей клас? Це змінює лише те, що бачите ви - учні можуть і далі відкривати кожну програму.",
    erledigt: ", виконано",
    jetztDran: ", зараз на черзі",
    wirdGespeichert: "Збереження...",
    angelegtAberFehlt: (name: string, liste: string) =>
      `Клас створено: ${name}. Але ці дані не збережено: ${liste}. ` +
      `Додайте їх, будь ласка, на вкладці Tastenflow у розділі Налаштування класу.`,
    klasseAngelegt: (name: string) => `Клас створено: ${name}.`,
    klasseAngelegtAndererCode: (name: string, gewuenscht: string, code: string) =>
      `Клас створено: ${name}. Бажаний код класу (${gewuenscht.trim().toUpperCase()}) ` +
      `уже використовує інший клас, тому діє код класу: ${code}.`,
    nameZuerst: "Спочатку введіть, будь ласка, ім'я.",
    passwortKurz: "Пароль має містити щонайменше 4 знаки.",
    kontaktFalsch: "Контактна електронна пошта має неправильний вигляд - поле можна також залишити порожнім.",
    kindAngelegt: (name: string) => `Обліковий запис створено: ${name}.`,
    vorlageLaedt: (datei: string) => `Завантаження шаблону: ${datei}`,
    vorlageFehler: "Не вдалося створити шаблон. Оновіть, будь ласка, сторінку й спробуйте ще раз.",
    listeWird: "Список класу готується.",
    listeLaedt: (klasse: string) => `Завантаження списку класу: ${klasse}`,
    listeFehler: "Не вдалося створити список класу. Оновіть, будь ласка, сторінку й спробуйте ще раз.",
    nochSpeichern: "Хвилинку - збереження ще триває.",
    dateiNichtOffen: "Не вдалося відкрити файл. Виберіть його, будь ласка, ще раз.",
    dateiLeer: (datei: string) =>
      `У файлі ${datei} під рядком заголовків немає жодної особи. Впишіть, будь ласка, по одному рядку для кожної особи й імпортуйте файл ще раз.`,
    vorschauStatus: (anlegen: string, abgelehnt: string | null, hinweis: string | null) =>
      `Попередній перегляд - буде додано: ${anlegen}` +
      (abgelehnt ? `; буде пропущено: ${abgelehnt}.` : ".") +
      (hinweis ? ` ${hinweis}` : ""),
    keinerAnlegbar:
      "З цього файлу не можна додати нікого - причини вказано в попередньому перегляді. Виправте, будь ласка, файл і імпортуйте його ще раз.",
    wirdAngelegt: (nr: number, von: number, name: string) => `Створення облікових записів: ${nr}/${von} (${name})...`,
    kontoNicht: "Не вдалося створити обліковий запис.",
    ergebnisAngelegt: (anzahl: string) => `Додано: ${anzahl}.`,
    ergebnisNicht: (n: number, liste: string) => `Не додано (${n}): ${liste}.`,
    ergebnisDrucken: "Імена й паролі можна знайти за кнопкою Друкувати дані для входу.",
    anlegenLaeuft: "Створення облікових записів уже триває - зачекайте, будь ласка, доки воно завершиться.",
    importAbgebrochen: "Імпорт перервано - жодного облікового запису не створено.",
    kindLoeschenFrage: (name: string) =>
      `Справді видалити обліковий запис: ${name}? Увесь поступ у ВСІХ ` +
      `навчальних програмах буде втрачено. Цю дію неможливо скасувати.`,
    kindGeloescht: (name: string) => `Обліковий запис видалено: ${name}.`,
    klasseLoeschenFrage: (name: string, n: number) =>
      `Справді видалити клас: ${name}?` +
      (n > 0
        ? ` Буде назавжди видалено також облікові записи учнів (${mehrzahl(n, "uk", {
        one: (z) => `${z} особа`,
        few: (z) => `${z} особи`,
        many: (z) => `${z} осіб`,
        other: (z) => `${z} особи`,
      })}) ` +
          `і їхній поступ.`
        : "") +
      " Цю дію неможливо скасувати.",
    klasseGeloescht: (name: string) => `Клас видалено: ${name}.`,
    klassennameFehlt: "Введіть, будь ласка, назву класу.",
    codeFehlt: "Введіть, будь ласка, код класу - з цим кодом учні входять.",
    codeUngueltig:
      "Код класу має містити від 2 до 12 знаків: літери, цифри, крапка або дефіс.",
    klasseGespeichert: "Клас збережено.",
    verschoben: (name: string, klasse: string, code: string) =>
      `Переведено: ${name}. Новий клас: ${klasse} (код класу: ${code}). ` +
      `Відтепер вхід виконується з цим кодом.`,
    wochenberichtAn: "Тижневий звіт увімкнено.",
    wochenberichtAus: "Тижневий звіт вимкнено.",
    druckBlockiert: "Вікно друку заблоковано. Дозвольте, будь ласка, спливні вікна для цієї сторінки.",
    klassen: "Класи",
    klasseWaehlenTipp: (name: string) => `Вибирає клас ${name} - усі вкладки тоді показують його учнів.`,
    klasseKnopf: (name: string, gewaehlt: boolean) => `Клас ${name}${gewaehlt ? ", вибрано" : ""}`,
    neueKlasse: "Створити новий клас",
    neueKlasseInhalt: "- назва, код класу, програми",
    neuProgrammeTitel: "Які програми використовує клас?",
    neuProgrammeHinweis:
      "Це впорядковує лише те, що бачите ви - учні можуть і далі відкривати кожну програму. Дані для Tastenflow (рік навчання, мова, точка старту, Перегони класу) з'являються, лише якщо Tastenflow позначено.",
    neuProgrammName: (label: string) => `${label} для нового класу`,
    fehltProgramm: "щонайменше одна програма",
    klassenname: "Назва класу",
    klassennameBeispiel: "напр. 3-Б або Сонечка",
    klassencode: "Код класу",
    klassencodeTipp:
      "Обов'язково. З цим кодом учні входять у кожну навчальну програму, з тим самим іменем і паролем. Програма пропонує код відповідно до назви, і ви можете його змінити: від 2 до 12 знаків, літери, цифри, крапка або дефіс.",
    klassencodeBeispiel: "напр. 3B-25",
    fuerTastenflowTipp:
      "Ці дані діють лише для десятипальцевого методу (Tastenflow); інші програми їх не змінюють. Пізніше їх можна змінити на вкладці Tastenflow у розділі Налаштування класу.",
    fuerTastenflow: "Для Tastenflow",
    bezugNeu: "нового класу",
    bitteWaehlen: "Виберіть, будь ласка",
    startHinweis: "що учні вже вміють - діє також для тих, хто приєднається пізніше",
    startSrHinweis:
      "Обов'язково. Клавіші до цього рівня від початку відкрито для кожної особи в цьому класі - " +
      "також для тих, хто приєднається пізніше. Хто вже далі, нічого не втрачає.",
    anlegenTipp: "Створює клас з усіма даними. Код класу тоді діє в усіх навчальних програмах.",
    klasseAnlegen: "Створити клас",
    zuerstKlasse: "Спочатку створіть клас - учні входять із його кодом.",
    klasseVor: "Клас: ",
    codeFuerLernende: " - код класу для учнів",
    bearbeitenTipp: "Змінити назву або код класу.",
    klasseBearbeiten: "Редагувати клас",
    bearbeiten: " Редагувати",
    loeschenTipp: "Видаляє цей клас з усіма учнями - лише після підтвердження.",
    klasseLoeschen: "Видалити клас",
    klasseLoeschenKnopf: " Видалити клас",
    codeAendernTipp:
      "Від 2 до 12 знаків, літери, цифри, крапка або дефіс. Після зміни всі учні цього класу входитимуть із новим кодом.",
    speichernTipp: "Зберігає нову назву й код класу.",
    speichern: "Зберегти",
    abbrechenTipp: "Закриває редагування без змін.",
    abbrechen: "Скасувати",
    codeWarnVor: "⚠️ Після зміни коду",
    // Das Verb zieht mit der Zahl; "one" gilt auch für 21, 31 ..., darum die Prüfung auf "1".
    codeWarnWer: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => (z === "1" ? "особа з цього класу входить" : `усі учні цього класу (${z}) входять`),
        few: (z) => `усі учні цього класу (${z}) входять`,
        many: (z) => `усі учні цього класу (${z}) входять`,
        other: (z) => `усі учні цього класу (${z}) входять`,
      }),
    codeWarnMitte: "відтепер із ",
    codeWarnNeu: "новим",
    codeWarnEnde: " кодом.",
    wochenbericht: " Тижневий звіт електронною поштою (раз на тиждень, у понеділок, із даними Tastenflow)",
    wochenberichtAnAdresse: "на адресу ",
    lernende: "Учні (",
    druckenTipp: "Надрукувати імена, паролі й код класу щойно доданих учнів.",
    drucken: " Друкувати дані для входу (",
    zurKlasse: "Додати до класу",
    nameTipp: "Достатньо імені. У цьому класі воно може бути лише один раз - великі й малі літери не мають значення.",
    name: "Ім'я",
    passwort: "Пароль",
    passwortBeispiel: "щонайменше 4 знаки",
    zufallTipp: "Створює пароль із 5 літер і цифр, який легко надрукувати, і вставляє його в поле.",
    zufall: "Випадковий",
    kontakt: "Контактна електронна пошта (необов'язково)",
    kontaktTipp:
      "Якщо тут є адреса, дані для входу надходять автоматично електронною поштою - під час додавання і щоразу, коли пароль скидають.",
    kontaktBeispiel: "напр. для батьків",
    womitAnfangen: "Tastenflow: з чого почати?",
    womitTipp:
      "Що ця особа вже вміє. Клавіші до цього місця від початку відкрито. Попередньо вибрано точку старту класу.",
    hinzufuegenTipp:
      "Додає до цього класу особу з іменем, паролем і - для Tastenflow - точкою старту. Усе інше (мова, допоміжні засоби...) ви налаштовуєте потім на вкладці відповідної програми. Тексти для вправ залежать від року навчання класу (його вказують під час створення класу, і щороку він сам збільшується на один) - рік народження не запитується. Потім фокус повертається до поля Ім'я.",
    hinzufuegen: "Додати",
    excelTitel: "Багато учнів одразу (Excel)",
    kommenInKlasse: "Учнів буде додано до цього класу: ",
    vorlageTipp: (datei: string) =>
      `Завантажує файл Excel ${datei}: на аркуші «Учні» вгорі клас і дата, нижче вибір точки старту для всіх і 40 рядків для заповнення; на аркуші «Вказівки» - порядок дій і список точок старту. Впишіть по одному рядку для кожної особи (ім'я й пароль - порожній пароль створить програма), потім імпортуйте файл тут; перед додаванням ви побачите попередній перегляд.`,
    vorlage: "Завантажити шаблон (Excel)",
    importTipp:
      "Відкриває вибір файлу для заповненого шаблону (.xlsx). Спочатку з'явиться попередній перегляд - облікові записи буде створено лише після підтвердження.",
    importieren: "Імпортувати учнів з Excel",
    listeTipp:
      "Завантажує файл Word з іменами, паролями й кодом класу ВСІХ учнів цього класу - щоб надрукувати й роздати.",
    liste: "Завантажити список класу",
    vorschauVor: "Попередній перегляд: ",
    vorschauNach: "",
    vorschauSatz: (_anzahl: number, wort: string, klasse: string) =>
      `Буде додано до класу ${klasse}: ${wort}. ` +
      `Збереження відбудеться лише після натискання кнопки Додати.`,
    vorschauKeiner: "З цього файлу нікого не буде додано.",
    escape: "Esc скасовує.",
    passwortPunkt: " - пароль",
    passwortErzeugt: " (пароль створено програмою)",
    tastenflowPunkt: " - Tastenflow:",
    startDerKlasse: " (точка старту класу)",
    vorgabe: " (типово)",
    abgelehntKopf: (n: number): readonly Teil[] => [
      mehrzahl(n, "uk", {
        one: (z) => `${z} рядок`,
        few: (z) => `${z} рядки`,
        many: (z) => `${z} рядків`,
        other: (z) => `${z} рядка`,
      }),
      " ",
      "буде пропущено",
    ],
    korrigieren:
      "Ці рядки можна виправити у файлі й пізніше імпортувати ще раз. Особи, які вже є в класі, буде показано в попередньому перегляді з приміткою «У класі вже є учень із таким іменем.»",
    anlegenTippImport:
      "Додає до цього класу по черзі осіб із попереднього перегляду. Потім фокус переходить до заголовка Учні, нижче - результат.",
    anlegenKnopf: (n: number): readonly Teil[] => [
      "Додати: ",
      mehrzahl(n, "uk", {
        one: (z) => `${z} особа`,
        few: (z) => `${z} особи`,
        many: (z) => `${z} осіб`,
        other: (z) => `${z} особи`,
      }),
    ],
    verwerfenTipp: "Відхиляє попередній перегляд, нікого не додаючи (Esc).",
    nochKeine:
      "Учнів ще немає. Додайте їх вище - потім вони входять із кодом класу, іменем і паролем (з будь-якого пристрою).",
    wirdVerschoben: "Переведення...",
    verschiebenLaeuft: "Хвилинку - переведення ще триває.",
    zielFehlt: "Введіть, будь ласка, код нового класу.",
    // "Викликів" (Genitiv Mehrzahl) steht fest - der Platzhalter käme im Nominativ.
    verschiebenFrage: (name: string, code: string, _pruefung: string) =>
      `Перевести до класу з кодом ${code}: ${name}?\n\n` +
      `- Потім вхід виконується з новим кодом класу.\n` +
      `- Педагоги нового класу бачитимуть цю особу та її поступ.\n` +
      `- Результати Викликів і повідомлення залишаться в попередньому класі.\n` +
      `- Якщо новий клас не ведете також ви, цієї особи ви більше не бачитимете.`,
    nichtsVerschoben: "Нікого не переведено.",
    emailFalsch: "Це не схоже на адресу електронної пошти - поле можна також залишити порожнім.",
    kontaktGespeichert: "Контактну електронну пошту збережено.",
    kontaktEntfernt: "Контактну електронну пошту видалено.",
    passwortTipp: (name: string) => `Відкриває й закриває поле для нового пароля. Особа: ${name}.`,
    passwortAendern: "Змінити пароль",
    kontaktKnopfTipp: (name: string) =>
      `Відкриває й закриває поле для контактної електронної пошти. Особа: ${name}. Якщо її вказано, пароль надходить автоматично електронною поштою, щойно його задають або скидають.`,
    kontaktKnopfName: (name: string) => `Контактна електронна пошта: ${name}`,
    kontaktKnopf: "Контактна електронна пошта",
    verschiebenTipp: (name: string) =>
      `Відкриває поле для переведення до іншого класу - також до класу інших педагогів, якщо ви знаєте його код. Особа: ${name}.`,
    verschiebenName: (name: string) => `Перевести до іншого класу: ${name}`,
    verschiebenKnopf: "Перевести до іншого класу",
    loeschenKindTipp: (name: string) =>
      `Видаляє обліковий запис і поступ в усіх навчальних програмах - лише після підтвердження. Особа: ${name}.`,
    loeschenKindName: (name: string) => `Видалити: ${name}`,
    loeschenKnopf: " Видалити",
    kontaktVon: "Контактна електронна пошта: ",
    kontaktLeer: "порожнє поле = без електронної пошти",
    kontaktSpeichernTipp: (name: string) =>
      `Зберігає контактну електронну пошту - порожнє поле її видаляє. Особа: ${name}.`,
    schliessenTipp: "Закриває поле без збереження (Esc).",
    codeNeueKlasse: "Код нового класу",
    folgenTipp: (name: string, _pruefung: string) =>
      `Потім вхід виконується з новим кодом класу. Педагоги нового класу бачитимуть цю особу та її поступ. Результати Викликів і повідомлення залишаться в цьому класі. Особа: ${name}.`,
    zielBeispiel: "напр. 4A",
    verschiebeTipp: (name: string) =>
      `Після підтвердження переводить до класу з цим кодом. Особа: ${name}.`,
    verschieben: "Перевести",
    nichtVerschiebenTipp: "Закриває поле без переведення (Esc).",
  },
});

/** Was `nichtGespeicherteEinstellungen` meldet - englisch benannt (Glossar §3.4). */
const NICHT_GESPEICHERT_EN: Readonly<Record<string, string>> = {
  Schulstufe: "year group",
  Sprache: "language",
  "Sprach-Sperre": "language lock",
  Startniveau: "starting point",
  Klassenmatch: "Class Match",
  "Zeilenende mit Enter": "Finish each line with Enter",
  "Beginn des Schuljahres": "Start of the school year",
};

/**
 * ★ E11a-5 (26.09.2026): dasselbe französisch - mit den Namen der Felder, wie
 * sie im Formular stehen. Bis dahin ging für „fr" die DEUTSCHE Liste hinaus
 * (die Zeile unten prüfte nur „en", Falle 30).
 */
const NICHT_GESPEICHERT_FR: Readonly<Record<string, string>> = {
  Schulstufe: "niveau scolaire",
  Sprache: "langue",
  "Sprach-Sperre": "verrou de la langue",
  Startniveau: "niveau de départ",
  Klassenmatch: "Match de la classe",
  "Zeilenende mit Enter": "Finir chaque ligne avec Entrée",
  "Beginn des Schuljahres": "Début de l'année scolaire",
};

/** ★ ES-O (27.09.2026): dasselbe spanisch - mit den Namen der Felder im Formular. */
const NICHT_GESPEICHERT_ES: Readonly<Record<string, string>> = {
  Schulstufe: "curso",
  Sprache: "idioma",
  "Sprach-Sperre": "bloqueo del idioma",
  Startniveau: "nivel de partida",
  Klassenmatch: "Competición de la clase",
  "Zeilenende mit Enter": "Terminar cada línea con Intro",
  "Beginn des Schuljahres": "Inicio del curso escolar",
};

/** ★ O-IT (02.10.2026): dasselbe italienisch - mit den Namen der Felder im Formular. */
const NICHT_GESPEICHERT_IT: Readonly<Record<string, string>> = {
  Schulstufe: "classe frequentata",
  Sprache: "lingua",
  "Sprach-Sperre": "blocco della lingua",
  Startniveau: "punto di partenza",
  Klassenmatch: "Gara di classe",
  "Zeilenende mit Enter": "Finire ogni riga con Invio",
  "Beginn des Schuljahres": "Inizio dell'anno scolastico",
};

/** ★ O-PL (02.10.2026): die Namen polnisch - im Nominativ, sie stehen nach einem Doppelpunkt. */
const NICHT_GESPEICHERT_PL: Readonly<Record<string, string>> = {
  Schulstufe: "klasa, do której chodzą uczniowie",
  Sprache: "język",
  "Sprach-Sperre": "blokada języka",
  Startniveau: "punkt startowy",
  Klassenmatch: "Wyścig klasowy",
  "Zeilenende mit Enter": "Koniec wiersza klawiszem Enter",
  "Beginn des Schuljahres": "Początek roku szkolnego",
};

/** ★ O-TR (02.10.2026): die Namen türkisch - ohne Endung, sie stehen nach einem Doppelpunkt (Glossar Regel 6). */
const NICHT_GESPEICHERT_TR: Readonly<Record<string, string>> = {
  Schulstufe: "sınıf düzeyi",
  Sprache: "dil",
  "Sprach-Sperre": "dil kilidi",
  Startniveau: "başlangıç noktası",
  Klassenmatch: "Sınıf Maçı",
  "Zeilenende mit Enter": "Satır sonunda Enter",
  "Beginn des Schuljahres": "Öğretim yılının başlangıcı",
};

/** ★ O-CS (03.10.2026): die Namen tschechisch - im Nominativ, sie stehen nach einem Doppelpunkt (Glossar Regel 12). */
const NICHT_GESPEICHERT_CS: Readonly<Record<string, string>> = {
  Schulstufe: "ročník",
  Sprache: "jazyk",
  "Sprach-Sperre": "zámek jazyka",
  Startniveau: "výchozí bod",
  Klassenmatch: "Třídní závod",
  "Zeilenende mit Enter": "Konec řádku klávesou Enter",
  "Beginn des Schuljahres": "Začátek školního roku",
};

/** ★ O2-SONST (30.10.2026): die Namen der neun - im Wortlaut der Feldnamen. */
const NICHT_GESPEICHERT_BG: Readonly<Record<string, string>> = {
  Schulstufe: "клас в училище",
  Sprache: "език",
  "Sprach-Sperre": "катинар за езика",
  Startniveau: "начална точка",
  Klassenmatch: "Състезание в класа",
  "Zeilenende mit Enter": "Край на реда с Enter",
  "Beginn des Schuljahres": "Начало на учебната година",
};

const NICHT_GESPEICHERT_EL: Readonly<Record<string, string>> = {
  Schulstufe: "τάξη",
  Sprache: "γλώσσα",
  "Sprach-Sperre": "κλείδωμα γλώσσας",
  Startniveau: "σημείο εκκίνησης",
  Klassenmatch: "Αγώνας τμήματος",
  "Zeilenende mit Enter": "Τέλος γραμμής με Enter",
  "Beginn des Schuljahres": "Αρχή του σχολικού έτους",
};

const NICHT_GESPEICHERT_HU: Readonly<Record<string, string>> = {
  Schulstufe: "évfolyam",
  Sprache: "nyelv",
  "Sprach-Sperre": "nyelv rögzítése",
  Startniveau: "kiindulópont",
  Klassenmatch: "Osztályverseny",
  "Zeilenende mit Enter": "Sor vége az Enter billentyűvel",
  "Beginn des Schuljahres": "A tanév kezdete",
};

const NICHT_GESPEICHERT_NL: Readonly<Record<string, string>> = {
  Schulstufe: "leerjaar",
  Sprache: "taal",
  "Sprach-Sperre": "taalvergrendeling",
  Startniveau: "startpunt",
  Klassenmatch: "klassenwedstrijd",
  "Zeilenende mit Enter": "regel afsluiten met Enter",
  "Beginn des Schuljahres": "begin van het schooljaar",
};

const NICHT_GESPEICHERT_PT: Readonly<Record<string, string>> = {
  Schulstufe: "ano de escolaridade",
  Sprache: "língua",
  "Sprach-Sperre": "bloqueio da língua",
  Startniveau: "ponto de partida",
  Klassenmatch: "Corrida da turma",
  "Zeilenende mit Enter": "Fim de linha com Enter",
  "Beginn des Schuljahres": "Início do ano letivo",
};

const NICHT_GESPEICHERT_BR: Readonly<Record<string, string>> = {
  Schulstufe: "ano escolar",
  Sprache: "idioma",
  "Sprach-Sperre": "bloqueio do idioma",
  Startniveau: "ponto de partida",
  Klassenmatch: "Competição da turma",
  "Zeilenende mit Enter": "Fim de linha com Enter",
  "Beginn des Schuljahres": "Início do ano letivo",
};

const NICHT_GESPEICHERT_RO: Readonly<Record<string, string>> = {
  Schulstufe: "anul de studiu",
  Sprache: "limba",
  "Sprach-Sperre": "blocarea limbii",
  Startniveau: "punctul de plecare",
  Klassenmatch: "Întrecerea clasei",
  "Zeilenende mit Enter": "Sfârșit de rând cu tasta Enter",
  "Beginn des Schuljahres": "Începutul anului școlar",
};

const NICHT_GESPEICHERT_SV: Readonly<Record<string, string>> = {
  Schulstufe: "årskurs",
  Sprache: "språk",
  "Sprach-Sperre": "språklås",
  Startniveau: "startpunkt",
  Klassenmatch: "Klasstävlingen",
  "Zeilenende mit Enter": "Radslut med Retur",
  "Beginn des Schuljahres": "Läsårets början",
};

const NICHT_GESPEICHERT_UK: Readonly<Record<string, string>> = {
  Schulstufe: "рік навчання",
  Sprache: "мова",
  "Sprach-Sperre": "блокування мови",
  Startniveau: "точка старту",
  Klassenmatch: "Перегони класу",
  "Zeilenende mit Enter": "Кінець рядка - клавішею Enter",
  "Beginn des Schuljahres": "Початок навчального року",
};

/** ★ E11a-5: die Namen je Bedienungssprache - Deutsch ist die Grundfassung. */
const NICHT_GESPEICHERT_JE_SPRACHE: Record<
  Exclude<BedienSprache, "de">,
  Readonly<Record<string, string>>
> = {
  en: NICHT_GESPEICHERT_EN,
  fr: NICHT_GESPEICHERT_FR,
  es: NICHT_GESPEICHERT_ES,
  it: NICHT_GESPEICHERT_IT,
  pl: NICHT_GESPEICHERT_PL,
  tr: NICHT_GESPEICHERT_TR,
  cs: NICHT_GESPEICHERT_CS,
  bg: NICHT_GESPEICHERT_BG,
  el: NICHT_GESPEICHERT_EL,
  hu: NICHT_GESPEICHERT_HU,
  nl: NICHT_GESPEICHERT_NL,
  pt: NICHT_GESPEICHERT_PT,
  br: NICHT_GESPEICHERT_BR,
  ro: NICHT_GESPEICHERT_RO,
  sv: NICHT_GESPEICHERT_SV,
  uk: NICHT_GESPEICHERT_UK,
};

/** Der Fehler zum Klassencode in der Bedienungssprache (`klassencodeFehler` spricht nur Deutsch). */
function codeFehlerIn(eingabe: string, sprache: BedienSprache): string | null {
  const fehler = klassencodeFehler(eingabe);
  if (!fehler || sprache === "de") return fehler;
  // ★ E11a-5: der Satz in der Bedienungssprache - bis dahin fest englisch.
  return eingabe.trim() ? T[sprache].codeUngueltig : T[sprache].codeFehlt;
}

/**
 * Druckliste: Name · Passwort · Code zum Austeilen (öffnet ein Druckfenster).
 * ★ EN6b: englisch mit denselben Wörtern wie die Word-Liste
 * (`ZUGANGSDATEN_TEXTE`, Glossar §3.15) - Deutsch genau das Blatt von vorher.
 */
function drucke(
  cls: TypingClass,
  zeilen: { name: string; pw: string }[],
  sprache: BedienSprache = "de",
) {
  const esc = (s: string) =>
    s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  const rows = zeilen
    .map(
      (z) =>
        `<tr><td>${esc(z.name)}</td><td>${esc(z.pw)}</td><td>${esc(cls.code)}</td></tr>`,
    )
    .join("");
  // ★ E11a-5 (26.09.2026): jede übersetzte Sprache nimmt denselben Aufbau -
  // bis dahin druckte die französische Bedienung das DEUTSCHE Blatt (die
  // Weiche prüfte nur „en"). Deutsch bleibt Zeichen für Zeichen das Blatt von
  // vorher.
  const en = ZUGANGSDATEN_TEXTE[sprache];
  const html =
    sprache !== "de"
      ? `<!doctype html><html lang="${sprache}"><head><meta charset="utf-8">` +
        `<title>${esc(en.titel(cls.name))}</title><style>` +
        `body{font-family:system-ui,sans-serif;padding:2rem;color:#111}` +
        `h1{font-size:1.25rem}table{border-collapse:collapse;width:100%;margin-top:1rem}` +
        `th,td{border:1px solid #999;padding:.5rem .75rem;text-align:left;font-size:1rem}` +
        `p{font-size:.9rem;color:#444}</style></head><body>` +
        `<h1>${esc(en.titel(cls.name))}</h1>` +
        `<p>${esc(en.anmeldung)}</p>` +
        `<table><thead><tr><th>${en.name}</th><th>${en.passwort}</th><th>${en.klassencode}</th></tr></thead>` +
        `<tbody>${rows}</tbody></table></body></html>`
      : `<!doctype html><html lang="de"><head><meta charset="utf-8">` +
    `<title>Zugangsdaten ${esc(cls.name)}</title><style>` +
    `body{font-family:system-ui,sans-serif;padding:2rem;color:#111}` +
    `h1{font-size:1.25rem}table{border-collapse:collapse;width:100%;margin-top:1rem}` +
    `th,td{border:1px solid #999;padding:.5rem .75rem;text-align:left;font-size:1rem}` +
    `p{font-size:.9rem;color:#444}</style></head><body>` +
    `<h1>Zugangsdaten: Klasse ${esc(cls.name)}</h1>` +
    `<p>Anmeldung in jedem Lernprogramm der Lernwerkstatt mit Klassencode, Name und Passwort.</p>` +
    `<table><thead><tr><th>Name</th><th>Passwort</th><th>Klassencode</th></tr></thead>` +
    `<tbody>${rows}</tbody></table></body></html>`;
  const w = window.open("", "_blank", "width=720,height=800");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
  return true;
}

/** Ankreuz-Liste „Programme dieser Klasse" (MK-E2) — reiner Anzeige-Filter. */
function ProgrammAuswahl({
  cls,
  teacherId,
  offen,
  onSaved,
}: {
  cls: TypingClass;
  teacherId: string;
  offen: LwProgram[];
  onSaved: (msg: string) => void;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const gewaehlt = cls.programs ?? [];
  const [busy, setBusy] = useState(false);
  const aktiv = (k: LwProgramKey) => gewaehlt.length === 0 || gewaehlt.includes(k);

  const toggle = async (k: LwProgramKey) => {
    if (busy) {
      // ★ R5, 28.08.2026: Früher stand hier `disabled={busy}` am Häkchen. Es
      // sperrte sich beim Umlegen selbst, der Fokus fiel auf `body`, und die
      // Lehrkraft stand mit der Braillezeile wieder am Seitenanfang. Jetzt
      // hält diese Zeile den zweiten Griff auf - und sagt ihn an, statt ihn
      // still zu verschlucken.
      onSaved(t.auswahlSpeichert);
      return;
    }
    // Leer = „alle" — beim ersten Abwählen also von der vollen Liste ausgehen.
    const basis: LwProgramKey[] =
      gewaehlt.length === 0 ? offen.map((p) => p.key) : (gewaehlt as LwProgramKey[]);
    const neu = basis.includes(k) ? basis.filter((x) => x !== k) : [...basis, k];
    setBusy(true);
    await saveClassPrograms(cls.code, teacherId, neu);
    setBusy(false);
    onSaved(neu.length === 0 ? t.keinProgramm : t.auswahlGespeichert);
  };

  return (
    <fieldset className="m-0 rounded-lg border border-hairline bg-surface-sunken px-3 py-2">
      <legend className="px-1 text-sm font-semibold text-ink">
        {t.programmeKlasse}
      </legend>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {offen.map((p) => (
          /* ⚠️ `Erklaert` UM das `<label>`, nie darin: Der Hinweissatz hinge
             sonst am Namen des Häkchens (gemessene Falle, bricht
             `getByLabelText`). */
          <Erklaert key={p.key} hilfe={PROGRAMM_BESCHREIBUNG[sprache][p.key]}>
            <label className="flex items-center gap-2 text-sm text-ink">
              {/* ★ R5: `aria-disabled` statt `disabled` - das Häkchen darf sich
                  nicht unter dem eigenen Fokus wegziehen (Muster aus
                  `PunktgenauReiter.tsx`). Die Sperre steckt in `toggle`. */}
              <input
                type="checkbox"
                className="h-4 w-4 accent-[rgb(var(--c-accent))] aria-disabled:opacity-40"
                checked={aktiv(p.key)}
                aria-disabled={busy}
                onChange={() => void toggle(p.key)}
              />
              {/* ★ Das echte Zeichen der App (10.09.2026, Johannes) - hier
                  stand bis dahin das Sinnbild aus dem Katalog. */}
              <ProgrammZeichen programm={p.key} />{" "}
              {programmNameLang(p.key, sprache) ? (
                <span lang={programmNameLang(p.key, sprache)}>{p.label}</span>
              ) : (
                p.label
              )}
            </label>
          </Erklaert>
        ))}
      </div>
      {/*
        ★ E12 (19.09.2026): GEPRÜFT UND BEWUSST NICHT VERSCHOBEN. Ein Versuch,
        diesen Satz in einen `Erklaert` an der `<legend>` zu hängen, sah im
        Browser gut aus, brach aber `getByRole("group", { name: "Programme
        dieser Klasse" })` (`tests/lernwerkstatt-senden-fokus.test.tsx`): Ein
        `<fieldset>` berechnet seinen zugänglichen Namen aus dem GESAMTEN
        Text seiner `<legend>`, der unsichtbare Hinweistext zählt also mit.
        Anders als beim einzelnen Häkchen (`Erklaert` UM das `<label>`, siehe
        oben) gibt es hier keine Stelle, die den Satz trüge, ohne den Namen
        der ganzen Gruppe zu verändern - er bleibt darum als eigener Absatz
        stehen. Wirklich REAL bleibt der Inhalt ohnehin: Er sagt, was die
        Kästchen NICHT tun (nichts wird für die Kinder gesperrt) - das ist
        keine Bedienungsanleitung, sondern eine Tatsache über die Auswirkung.
      */}
      <p className="m-0 mt-1 text-sm text-ink-muted">
        {t.nurAnsicht}
        <strong>{t.ihreAnsicht}</strong>
        {t.nurAnsichtRest}
      </p>
    </fieldset>
  );
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ WAS „ALLES AUSGEFÜLLT" HEISST (11.09.2026, Nacht)
 * ════════════════════════════════════════════════════════════════════════════
 * Johannes: *„… erst wenn alles ausgefüllt ist kann man Klasse erstellen."*
 *
 * Ausfüllen MUSS die Lehrkraft diese Angaben - die ohne sinnvolle Vorgabe:
 *   · Klassenname (nicht leer)
 *   · Klassencode (gültig: 2 bis 12 Zeichen, `klassencodeFehler`)
 *   · Programme (mindestens eines; das Einstiegsprogramm ist vorgewählt)
 *   · NUR WENN TASTENFLOW ANGEKREUZT IST (18.10.2026, Johannes: „wenn jemand
 *     eine Klasse anlegt, ist es verwirrend, dass nach Tastenflow gefragt
 *     wird - vielleicht möchte er nur Im Griff verwenden"):
 *       · Schulstufe (1-13 oder „Erwachsen" - kein „nicht gesetzt" beim Anlegen)
 *       · Startniveau (eine der benannten Stufen)
 *     Ohne Tastenflow bleiben beide ungesetzt - das ist der Zustand jeder
 *     Klasse von vor dem 11.09.2026, und der Tastenflow-Reiter trägt sie
 *     später nach.
 * Immer ausgefüllt sind die drei mit Vorgabe, die trotzdem SICHTBAR im
 * Formular stehen: Sprache (Deutsch), Sperre (frei) und Klassenmatch
 * (erlaubt). Eine Vorgabe, die man sehen und ändern kann, ist eine Antwort;
 * ein Pflicht-Häkchen „Klassenmatch ja/nein" wäre nur ein Klick mehr.
 *
 * Die Reihenfolge ist die des Formulars - der Fokus geht auf das ERSTE, was
 * fehlt.
 */
type AnlageFeld = "name" | "code" | "programme" | "schulstufe" | "start";
function fehlendeAngaben(
  w: {
    name: string;
    code: string;
    schulstufe: number;
    start: number;
    /** Wie viele Programme angekreuzt sind (mindestens eines). */
    programme: number;
    /**
     * Ist Tastenflow dabei? Nur dann sind Schulstufe und Startniveau Pflicht -
     * sie sind Tastenflow-Angaben (Johannes 18.10.2026: wer nur »Im Griff«
     * nutzt, soll nicht nach Tastenflow gefragt werden).
     */
    mitTastenflow: boolean;
  },
  sprache: BedienSprache = "de",
): { feld: AnlageFeld; wort: string }[] {
  const t = T[sprache];
  const fehlt: { feld: AnlageFeld; wort: string }[] = [];
  if (!w.name.trim()) fehlt.push({ feld: "name", wort: t.fehltName });
  if (klassencodeFehler(w.code))
    fehlt.push({
      feld: "code",
      wort: w.code.trim() ? t.fehltCodeGueltig : t.fehltCode,
    });
  if (w.programme < 1) fehlt.push({ feld: "programme", wort: t.fehltProgramm });
  if (w.mitTastenflow) {
    if (!(w.schulstufe > 0)) fehlt.push({ feld: "schulstufe", wort: t.fehltSchulstufe });
    if (!(w.start > 0)) fehlt.push({ feld: "start", wort: t.fehltStart });
  }
  return fehlt;
}

/**
 * „a", „a und b", „a, b und c" - englisch „a, b and c" (britisch ohne Komma
 * vor dem letzten „and").
 */
function aufzaehlung(woerter: string[], sprache: BedienSprache = "de"): string {
  if (woerter.length <= 1) return woerter.join("");
  return `${woerter.slice(0, -1).join(", ")}${T[sprache].und}${woerter[woerter.length - 1]}`;
}

/** „1 Teilnehmer", „12 Teilnehmer" - gleiche Form in Ein- und Mehrzahl (englisch „1 pupil"). */
const kinderWort = (n: number, sprache: BedienSprache = "de") => T[sprache].teilnehmer(n);
/** „1 Zeile", „3 Zeilen" (englisch „1 row", „3 rows"). */
const zeilenWort = (n: number, sprache: BedienSprache = "de") => T[sprache].zeilen(n);

/**
 * „Erste Schritte" (MK-E6) — für frisch registrierte Lehrkräfte. Zeigt sich nur,
 * solange der Weg nicht zu Ende gegangen ist, und hakt sich selbst ab. Vorher
 * landete eine Lehrkraft, die sich gerade erst angemeldet hatte, vor einem
 * leeren Bereich ohne Anhaltspunkt, was zuerst zu tun ist.
 */
function ErsteSchritte({ schritt }: { schritt: 1 | 2 }) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const SCHRITTE: [string, string][] = [
    [t.schrittKlasse, t.schrittKlasseText],
    [t.schrittLernende, t.schrittLernendeText],
    [t.schrittProgramme, t.schrittProgrammeText],
  ];
  return (
    <div className="card space-y-2 p-4">
      <h2 className="m-0 text-lg font-semibold text-ink">{t.ersteSchritte}</h2>
      <ol className="m-0 list-none space-y-2 p-0">
        {SCHRITTE.map(([titel, text], i) => {
          const nr = i + 1;
          const erledigt = nr < schritt;
          const dran = nr === schritt;
          return (
            <li key={titel} className="flex items-start gap-2 text-sm">
              <span
                aria-hidden="true"
                className={
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
                  (erledigt
                    ? "bg-success-soft text-ink"
                    : dran
                      ? "bg-accent text-white"
                      : "bg-surface-sunken text-ink-muted")
                }
              >
                {erledigt ? "✓" : nr}
              </span>
              <span>
                <span className={dran ? "font-semibold text-ink" : "text-ink"}>
                  {titel}
                </span>
                {erledigt && <span className="sr-only">{t.erledigt}</span>}
                {dran && <span className="sr-only">{t.jetztDran}</span>}
                <span className="block text-ink-muted">{text}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function KlasseUndKinder({
  teacher,
  classes,
  cls,
  pupils,
  offeneProgramme,
  einstiegsProgramm,
  klasseEinstieg,
  onSelectClass,
  onChanged,
}: {
  teacher: TypingAccount;
  classes: TypingClass[];
  cls: TypingClass | null;
  pupils: TypingAccount[];
  offeneProgramme: LwProgram[];
  /**
   * ★ E5 (19.09.2026): das Programm, aus dem der Weg in „Meine Klassen"
   * führte (oder die Vorgabe der Lernwerkstatt) - eine NEU angelegte Klasse
   * speichert es gleich als ihre Programm-Liste
   * (`src/lib/lernwerkstatt/klassen.ts`, `effectiveProgramsOfClass`).
   */
  einstiegsProgramm: LwProgramKey;
  /**
   * ★ 18.10.2026: der Einstieg der GEWÄHLTEN Klasse (erstes Programm ihrer
   * Liste, sonst das Programm, aus dem der Weg führte) - er entscheidet, ob
   * Tastenflow-Angaben beim Kind und in der Excel-Vorlage erscheinen
   * (`klasseMitTastenflow`). Fehlt er, gilt `einstiegsProgramm`.
   */
  klasseEinstieg?: LwProgramKey;
  onSelectClass: (code: string) => void;
  onChanged: () => void;
}) {
  const backend = typingBackend();
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  /*
    ★ E1 (24.09.2026): zwei Lernwege (Bauplan englischer Lehrgang §2.2, §7).
    Ein NEUES Kind erbt den Weg seiner Klasse - die Startpunkte im Formular
    sind Anzahlen in ihm. Eine NEUE Klasse bekommt ihn aus der Bedienung der
    Lehrkraft (★ FREIGABE 25.09.2026: `englischLehrgangProbeAn()` ist jetzt
    die Grundeinstellung - englische Bedienung ⇒ „en", deutsche Bedienung ⇒
    „de", unverändert).
  */
  const kindWeg = lernwegVon(cls);
  // ★ E11c (26.09.2026): französische Bedienung ⇒ Weg „fr" - aber NUR mit dem
  // Schalter des französischen Lehrgangs (Bauplan F16); ohne ihn wie bisher „de".
  const neuerKlassenWeg = bestimmeLernweg({
    gespeichert: null,
    bedienSprache: sprache,
    lehrgangProbeAn: englischLehrgangProbeAn(),
    franzoesischLehrgangProbeAn: franzoesischLehrgangProbeAn(),
    // ★ ES-O (27.09.2026): und der spanische Schalter (sonst immer „de").
    spanischLehrgangProbeAn: spanischLehrgangProbeAn(),
    // ★ G2a (02.10.2026): die Schalter der vier neuen Sprachen (Vorgabe aus).
    ...neueLehrgangProben(),
  });
  const [status, setStatus] = useState("");
  /*
   * ★ EN6b: Die Fehlerzeile zeigt Sätze vom SERVER (über `ServerMeldung`, die
   * übersetzt sie) und EIGENE Sätze dieses Bereichs, die schon in der
   * Bedienungssprache stehen (`eigen`). Ohne die Unterscheidung stünde ein
   * englischer eigener Satz als „unbekannt" in `lang="de"`.
   */
  const [fehler, setFehler] = useState<{ text: string; eigen: boolean }>({ text: "", eigen: false });
  const error = fehler.text;
  const setError = (text: string) => setFehler({ text, eigen: false });
  const setEigenerFehler = (text: string) => setFehler({ text, eigen: true });
  const [busy, setBusy] = useState(false);

  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  /**
   * ★★ Hat die Lehrkraft den Klassencode SELBST geschrieben? (10.09.2026)
   * Solange nicht, folgt der Code dem Namen (`klassencodeVorschlag`) - aus
   * „MS-Wein" wird beim Tippen „MSWEIN". Sobald sie im Codefeld etwas ändert,
   * bleibt ihr Code stehen; leert sie das Feld, folgt es wieder dem Namen.
   */
  const [codeSelbst, setCodeSelbst] = useState(false);
  const classCodeRef = useRef<HTMLInputElement>(null);
  /*
   * ★★★ Die Tastenflow-Angaben der neuen Klasse (11.09.2026, Nacht). `0` heisst
   * bei Schulstufe und Startniveau „Bitte wählen" - noch nicht ausgefüllt.
   * Sprache, Sperre und Klassenmatch haben ihre Vorgabe (Begründung bei
   * `fehlendeAngaben`).
   *
   * ★★★★★ Befund 24.09.2026 (Bauplan englischer Lehrgang §7): die Vorgabe der
   * Übungssprache stand fest auf „de" - eine Lehrkraft mit englischer
   * Bedienung bekam trotzdem eine deutsche Klasse vorgeschlagen. Die Vorgabe
   * folgt jetzt der Bedienungssprache, wie schon beim Lernweg
   * (`neuerKlassenWeg` oben) und beim Tastatur-Schritt der Einrichtung.
   */
  const [neuSchulstufe, setNeuSchulstufe] = useState(0);
  /*
   * ★★★ PROGRAMME ZUERST (18.10.2026). Welche Programme die Klasse nutzt, wird
   * beim Anlegen gefragt - vorgewählt ist das Einstiegsprogramm (E5). Die
   * Tastenflow-Angaben unten erscheinen nur, wenn Tastenflow dabei ist.
   * Die Auswahl gibt es nur in deutscher Bedienung und nur bei mehr als einem
   * freigegebenen Programm (wie die Ankreuz-Liste `ProgrammAuswahl`).
   */
  const [neuProgramme, setNeuProgramme] = useState<LwProgramKey[]>([einstiegsProgramm]);
  useEffect(() => {
    setNeuProgramme([einstiegsProgramm]);
  }, [einstiegsProgramm]);
  const zeigeProgrammWahl = sprache === "de" && offeneProgramme.length > 1;
  const neueProgramme: LwProgramKey[] = zeigeProgrammWahl
    ? [
        // Das Einstiegsprogramm zuerst: `MeineKlassePage` nimmt das ERSTE der
        // gespeicherten Liste als Einstieg.
        ...offeneProgramme.map((p) => p.key).filter((k) => k === einstiegsProgramm),
        ...offeneProgramme.map((p) => p.key).filter((k) => k !== einstiegsProgramm),
      ].filter((k) => neuProgramme.includes(k))
    : [einstiegsProgramm];
  const mitTastenflow = neueProgramme.includes("tippen");
  const programmeRef = useRef<HTMLInputElement>(null);
  // ★ E11c (26.09.2026): aus der französischen Bedienung ⇒ Vorgabe „fr" - aber
  // nur, wenn die Klasse auch den Weg „fr" bekommt (Schalter des französischen
  // Lehrgangs an, `neuerKlassenWeg` oben). Ohne den Schalter wie bisher „de"
  // (Französisch gibt es nur auf Weg „fr", Bauplan F15). Die Auswahl bietet
  // „Français" dann an (`KlassenEinstellungsFelder`, Weg „fr").
  // ★ ES-O (27.09.2026): ebenso „es" - nur mit dem Schalter des spanischen Lehrgangs.
  // ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M3): Anfangswert UND Zurücksetzen
  // nach dem Anlegen aus EINER Funktion (`neueKlassenSprache`, account.ts) -
  // das Zurücksetzen kannte fr/es nicht, die zweite Klasse bekam Deutsch.
  const [neuLang, setNeuLang] = useState<Lang>(() => neueKlassenSprache(sprache, neuerKlassenWeg));
  const [neuLangLocked, setNeuLangLocked] = useState(false);
  const [neuStart, setNeuStart] = useState(0);
  const [neuMatchAus, setNeuMatchAus] = useState(false);
  // ★ Zeilenende mit Enter (23.09.2026) - Vorgabe aus (wie am Server).
  const [neuZeilenEnde, setNeuZeilenEnde] = useState(false);
  // ★ D2 (28.09.2026): der Beginn des Schuljahres - Vorgabe aus dem Land der
  // Lehrkraft (Sprach-Region, ersatzweise Zeitzone des Browsers;
  // `schuljahrBeginn.ts`). DACH und unbekannt: August wie bisher.
  const [neuSchuljahrBeginn, setNeuSchuljahrBeginn] = useState(schuljahrBeginnVorgabeDesGeraets);
  // ★ E9 (24.09.2026, Bauplan §8.2) - Vorgabe „automatisch" (leer), wie am Server.
  const [neueSchreibweise, setNeueSchreibweise] = useState<EnglischVariante | "">("");
  /** Hat die Lehrkraft „Klasse anlegen" schon einmal gedrückt? Erst dann steht der Satz, was fehlt. */
  const [anlegeVersucht, setAnlegeVersucht] = useState(false);
  const schulstufeRef = useRef<HTMLSelectElement>(null);
  const startniveauRef = useRef<HTMLSelectElement>(null);
  const anlegenKopfRef = useRef<HTMLElement>(null);
  /*
   * ════════════════════════════════════════════════════════════════════════
   * ★★★ „NEUE KLASSE ANLEGEN" IST ZUKLAPPBAR - UND WANN ES OFFEN STEHT
   * ════════════════════════════════════════════════════════════════════════
   * Johannes (11.09.2026, Nacht): *„Lass uns den Bereich neue Klasse anlegen
   * zum Ausklappen machen"*. Bauart nach R7 des Bauplans vom 11.09.2026
   * (`<details>` mit 36 px hoher Zeile, beim Laden zu).
   *
   * ⚠️ AUSNAHME: Hat die Lehrkraft noch GAR KEINE Klasse, steht er offen. Dann
   * ist Anlegen das Einzige, was auf dieser Seite zu tun ist („Erste Schritte",
   * Schritt 1) - ein zugeklappter Abschnitt wäre ein Weg, den eine neue
   * Lehrkraft erst suchen muss, und mit der Sprachausgabe hört sie nur „Neue
   * Klasse anlegen, zugeklappt" zwischen anderen Zeilen.
   *
   * ⚠️ Die Klassen kommen vom Server - beim ersten Bild ist die Liste noch leer.
   * Darum folgt der Zustand der Zahl der Klassen, SOLANGE die Lehrkraft den
   * Abschnitt nicht selbst auf- oder zugeklappt hat.
   */
  const [anlegenOffen, setAnlegenOffen] = useState(classes.length === 0);
  const anlegenSelbstGeklappt = useRef(false);
  useEffect(() => {
    if (!anlegenSelbstGeklappt.current) setAnlegenOffen(classes.length === 0);
  }, [classes.length]);
  const fehltJetzt = fehlendeAngaben(
    {
      name: className,
      code: classCode,
      schulstufe: neuSchulstufe,
      start: neuStart,
      programme: neueProgramme.length,
      mitTastenflow,
    },
    sprache,
  );
  const fehltSatz =
    fehltJetzt.length > 0 ? t.fehltSatz(aufzaehlung(fehltJetzt.map((f) => f.wort), sprache)) : "";
  /** Fokus-Ziel, wenn ein Kind die Liste verlassen hat (Verschieben). */
  const lernendeRef = useRef<HTMLHeadingElement>(null);
  /** Was zuletzt verschoben wurde - SICHTBAR, die Statuszeile ist nur für Sprachausgaben. */
  const [verschoben, setVerschoben] = useState("");
  const [pupilName, setPupilName] = useState("");
  const [pupilPw, setPupilPw] = useState("");
  /**
   * Kontakt-E-Mail (optional, 14.09.2026, Wunsch Johannes) - ist sie gesetzt,
   * bekommt das Kind nach dem Anlegen und bei jedem späteren Zurücksetzen
   * automatisch das aktuelle Passwort zugeschickt. Wird wie Name/Passwort
   * nach dem Anlegen geleert - stünde eine Adresse stehen, ginge sie sonst
   * versehentlich an das NÄCHSTE, andere Kind mit.
   */
  const [pupilEmail, setPupilEmail] = useState("");
  /*
   * ★★★ B11 (11.09.2026): DAS GEBURTSJAHR IST HIER WEG - Feld, Zustand und
   * Pflichtprüfung. Für ein Kind einer Klasse kommt die Textstufe seit dem
   * Umbau aus der SCHULSTUFE der Klasse (`klassenEinstellungen.ts`), und
   * dieses Formular legt ausschliesslich Kinder EINER Klasse an.
   *
   * ⚠️ Es war seit 30.08.2026 Pflicht, mit gutem Grund: Ohne Jahr wuchs die
   * Textstufe nicht mit. Genau das leistet die Schulstufe jetzt besser - sie
   * wird einmal je Klasse eingetragen statt 24-mal je Kind, und sie zählt
   * jedes Schuljahr von selbst weiter.
   *
   * ⚠️ Geprüft (`grep -rl geburtsjahr src`, 11.09.2026): Kein anderes Programm
   * liest `pupil.geburtsjahr`. Das Serverfeld bleibt für selbstlernende
   * Konten.
   */
  /**
   * Vorkenntnisse für Tastenflow (01.09.2026): Mit wie vielen Lern-Einheiten
   * das Kind startet. Vorgabe ist der erste Startpunkt („Anfänger: nur F und
   * J") - wer nichts anfasst, bekommt genau das, was bisher fest verdrahtet war.
   *
   * ★ Der Wert bleibt nach dem Anlegen stehen: Eine Lehrkraft legt meist
   *   mehrere Kinder derselben Gruppe hintereinander an, die dieselben
   *   Vorkenntnisse haben. Name und Passwort werden geleert, diese Wahl nicht.
   */
  /*
    ★★★ 18.10.2026: Nutzt die gewählte Klasse Tastenflow? Nur dann fragt das
    Formular „Kind hinzufügen" nach dem Tastenflow-Startniveau, und nur dann
    trägt die Excel-Vorlage die Spalte dazu. Wer nur »Im Griff« nutzt, wird
    nicht nach Tastenflow gefragt. Das Kind bekommt trotzdem den Startwert
    (`pupilStart`, ersten Punkt oder Vorgabe der Klasse) - Tastenflow steht ihm
    ja weiter offen („Jedes Kind darf jedes Programm öffnen").
  */
  const mitTastenflowKlasse = klasseMitTastenflow(cls, klasseEinstieg ?? einstiegsProgramm, sprache);
  const [pupilStart, setPupilStart] = useState<number>(
    cls?.startUnits ?? startPunkte(sprache, kindWeg)[0].units,
  );
  /*
    ★ Das Startniveau der KLASSE ist vorgewählt (11.09.2026, Nacht) - es gilt
    für jedes Kind, das beitritt. Nachgezogen nur beim Klassenwechsel oder wenn
    sich die Vorgabe ändert, nicht nach jedem Anlegen (die Wahl bleibt stehen,
    siehe oben).
  */
  useEffect(() => {
    if (cls?.startUnits) setPupilStart(cls.startUnits);
  }, [cls?.code, cls?.startUnits]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  /** Zuletzt angelegte Kinder dieser Sitzung — nur für die Druckliste. */
  const [frisch, setFrisch] = useState<{ name: string; pw: string }[]>([]);
  const pupilNameRef = useRef<HTMLInputElement>(null);
  /*
   * ★ R5 (FOKUSZIELE-TASTENFLOW.md §0.5, 28.08.2026): An den drei Formular-
   * Knöpfen dieser Datei stand `disabled={… || busy}`. Wer den Knopf mit einem
   * leeren Feld suchte, fand ihn gar nicht im Tab-Weg und erfuhr nirgends,
   * WORAN es liegt; und wer ihn betätigte, verlor im selben Augenblick den
   * Fokus, weil `busy` sofort greift. Die Knöpfe tragen jetzt `aria-disabled`,
   * die Sperre steckt in den Handlern - und jede Sperre nennt ihren Grund und
   * führt den Fokus in das Feld, das noch fehlt. Dafür diese Anker.
   */
  const classNameRef = useRef<HTMLInputElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);
  const editCodeRef = useRef<HTMLInputElement>(null);
  const pupilPwRef = useRef<HTMLInputElement>(null);
  const pupilEmailRef = useRef<HTMLInputElement>(null);
  /*
   * ★★★ KINDER AUS EXCEL (12.09.2026). `importPlan` ist die VORSCHAU - sie
   * gehört zu EINER Klasse (`klasse`) und wird beim Klassenwechsel verworfen:
   * Johannes' Entscheidung 1 sagt „in der gerade gewählten Klasse", und eine
   * Vorschau, die nach dem Wechsel stehen bliebe, legte die Kinder in der
   * falschen an.
   */
  const [importPlan, setImportPlan] = useState<
    | (KinderPlan & {
        klasse: string;
        datei: string;
        /** ★ 13.09.2026: Die Überschrift der Datei nennt eine andere Klasse. */
        hinweisKlasse: string | null;
      })
    | null
  >(null);
  /** Sichtbarer Satz am Import (Datei nicht lesbar …) - KEINE Live-Region. */
  const [importMeldung, setImportMeldung] = useState("");
  /** „Wird angelegt: 3 von 12" - sichtbar; für die Sprachausgabe die Statuszeile. */
  const [importFortschritt, setImportFortschritt] = useState("");
  /** Der EINE Ergebnissatz nach dem Anlegen, sichtbar unter „Lernende". */
  const [importErgebnis, setImportErgebnis] = useState<{ satz: string; alleOk: boolean } | null>(
    null,
  );
  const importDateiRef = useRef<HTMLInputElement>(null);
  const importKnopfRef = useRef<HTMLButtonElement>(null);
  /** „Teilnehmerliste herunterladen" (14.09.2026) - eigener Zustand, kein
      Griff in `busy`: die beiden Vorgänge haben nichts miteinander zu tun. */
  const [teilnehmerlisteBusy, setTeilnehmerlisteBusy] = useState(false);
  const vorschauKopfRef = useRef<HTMLHeadingElement>(null);
  const vorschauId = useId();

  /**
   * Fokus in ein Feld, im NÄCHSTEN TAKT - nie mit `requestAnimationFrame`
   * ([[feedback_fokus_pflicht_alle_apps]]).
   */
  const fokusAuf = (feld: React.RefObject<HTMLInputElement>) => {
    window.setTimeout(() => feld.current?.focus(), 0);
  };
  /** Dasselbe für Schalter und Überschriften. */
  const fokusAufElement = (ziel: React.RefObject<HTMLElement>) => {
    window.setTimeout(() => ziel.current?.focus(), 0);
  };

  useEffect(() => {
    setEditing(false);
    setFrisch([]);
    // Die Bestätigung gehört zu der Klasse, aus der das Kind gegangen ist.
    setVerschoben("");
    // ★ Die Excel-Vorschau gehört zur bisherigen Klasse (12.09.2026).
    setImportPlan(null);
    setImportMeldung("");
    setImportFortschritt("");
    setImportErgebnis(null);
  }, [cls?.code]);

  const isOwner = !cls || cls.teacherId === teacher.id;

  const onCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) {
      setStatus(t.wirdGespeichert);
      return;
    }
    /*
      ★★★ ERST WENN ALLES AUSGEFÜLLT IST (11.09.2026, Nacht). Der Knopf ist
      NIE `disabled` (R5): Er bleibt im Tab-Weg und trägt `aria-disabled`,
      solange etwas fehlt. Wer ihn trotzdem drückt, bekommt EINEN Satz, der
      alles nennt, was noch fehlt - sichtbar unter dem Knopf und in der
      Statuszeile -, und der Fokus geht in das erste fehlende Feld.
      ★ Der Klassencode ist Pflicht (10.09.2026) - dieselbe Bauart.
    */
    if (fehltJetzt.length > 0) {
      setAnlegeVersucht(true);
      setStatus(fehltSatz);
      const ziel: Record<AnlageFeld, React.RefObject<HTMLInputElement | HTMLSelectElement>> = {
        name: classNameRef,
        code: classCodeRef,
        programme: programmeRef,
        schulstufe: schulstufeRef,
        start: startniveauRef,
      };
      const feld = ziel[fehltJetzt[0].feld];
      window.setTimeout(() => feld.current?.focus(), 0);
      return;
    }
    /*
      ★★★ OHNE TASTENFLOW KEINE TASTENFLOW-EINSTELLUNGEN (18.10.2026). Die
      Klasse wird nur mit Name und Code angelegt; Schulstufe, Startniveau,
      Sprache und Klassenmatch bleiben beim Vorgabewert des Servers und lassen
      sich später im Tastenflow-Reiter nachtragen (`createClass` schreibt
      Schulstufe und Startniveau nur, wenn sie > 0 sind).
    */
    const einstellungen: KlassenAnlage | undefined = !mitTastenflow ? undefined : {
      schulstufe: neuSchulstufe,
      // ★ Das Schuljahr des EINTRAGS - ohne es wüsste niemand, wie oft die
      // Schulstufe weiterzuzählen ist (`klassenEinstellungen.ts`).
      // ★ D2: im Schuljahr DIESER Klasse (ihr Beginn-Monat).
      schulstufeSchuljahr: schuljahrStartjahr(Date.now(), neuSchuljahrBeginn),
      schuljahrBeginn: neuSchuljahrBeginn,
      lang: neuLang,
      langLocked: neuLangLocked,
      klassenmatchAus: neuMatchAus,
      startUnits: neuStart,
      zeilenEndeEnter: neuZeilenEnde,
      // ★ E1: nur „en" wird geschrieben (Vorgabe für neue Kinder der Klasse).
      // ★ E11c: ebenso „fr" (nur mit dem Schalter, siehe `neuerKlassenWeg`).
      // ★ ES-M (27.09.2026): jeder Weg ausser „de" - damit auch „es" (nur mit
      // dem Schalter des spanischen Lehrgangs, siehe `neuerKlassenWeg`).
      ...(neuerKlassenWeg !== "de" ? { lernweg: neuerKlassenWeg } : {}),
      // ★ E9: nur „gb"/„us" wird geschrieben (leer = automatisch, Vorgabe).
      ...(neueSchreibweise ? { schreibweise: neueSchreibweise } : {}),
    };
    /*
      ★ Nachbesserung 20.09.2026 (Johannes: „Das Programm kann ja eine Nummer
      vergeben und damit arbeiten"). `angefragterCode` wird VOR dem Aufruf
      gemerkt, weil `classCode` gleich danach zurückgesetzt wird - nur so
      lässt sich hinterher noch sagen, ob das Backend selbst ausgewichen ist.
      `!codeSelbst`: NUR ein aus dem Namen VORGESCHLAGENER Code darf
      ausweichen, ein selbst getippter bleibt stehen (siehe `klassencode.ts`).
    */
    const angefragterCode = classCode;
    setBusy(true);
    const r = await backend.createClass(
      teacher.id,
      className,
      classCode,
      einstellungen,
      !codeSelbst,
    );
    if (r.ok) {
      /*
        ★ 18.10.2026: gespeichert wird die ANGEKREUZTE Liste (vorgewählt ist
        das Einstiegsprogramm, es steht vorn).
        ★ E5 (19.09.2026): eine NEU angelegte Klasse speichert gleich das
        Einstiegsprogramm als ihre Liste (Johannes: „wer über Tastenflow
        einsteigt, sieht nur Tastenflow …"). Bewusst ein ZWEITER Aufruf über
        denselben Weg wie die Ankreuz-Liste (`saveClassPrograms`, siehe
        `ProgrammAuswahl` oben) statt eines neuen Felds an `createClass`
        selbst - das Anlegen gehört den gemeinsam genutzten Backends
        (`lib/typing/{account,backend,pbBackend}.ts`), die in dieser Nacht
        eine andere Sitzung umbaut.
      */
      await saveClassPrograms(r.value.code, teacher.id, neueProgramme);
    }
    setBusy(false);
    if (r.ok) {
      /*
        ⚠️ Kam alles an? PocketBase übergeht ein Feld, das es nicht kennt, OHNE
        Fehler. Eine halb eingerichtete Klasse darf nicht still stehen bleiben:
        Dann sagt ein sichtbarer Satz, WAS nicht gespeichert wurde und wo man
        es nachträgt. (Die Programm-Liste selbst prüft `saveClassPrograms`
        nicht mit - sie betrifft nur die eigene Ansicht, nie ein Kind.)
      */
      const fehltAmServer = einstellungen ? nichtGespeicherteEinstellungen(einstellungen, r.value) : [];
      setClassName("");
      setClassCode("");
      setCodeSelbst(false);
      setNeuSchulstufe(0);
      setNeuProgramme([einstiegsProgramm]);
      setNeuLang(neueKlassenSprache(sprache, neuerKlassenWeg));
      setNeuLangLocked(false);
      setNeuStart(0);
      setNeuMatchAus(false);
      setNeuZeilenEnde(false);
      setNeuSchuljahrBeginn(schuljahrBeginnVorgabeDesGeraets());
      setAnlegeVersucht(false);
      if (fehltAmServer.length > 0) {
        const satz = t.angelegtAberFehlt(
          r.value.name,
          aufzaehlung(
            sprache !== "de"
              ? fehltAmServer.map((w) => NICHT_GESPEICHERT_JE_SPRACHE[sprache][w] ?? w)
              : fehltAmServer,
            sprache,
          ),
        );
        setEigenerFehler(satz);
        setStatus(satz);
      } else if (r.value.code !== angefragterCode.trim().toUpperCase()) {
        /*
          ★ Nachbesserung 20.09.2026: das Backend ist selbst ausgewichen -
          Johannes bekommt jetzt klar gesagt, WELCHER Code jetzt gilt, statt
          es stillschweigend anders zu machen als angefragt.
        */
        setError("");
        setStatus(t.klasseAngelegtAndererCode(r.value.name, angefragterCode, r.value.code));
      } else {
        setError("");
        setStatus(t.klasseAngelegt(r.value.name));
      }
      // Zuklappen und den Fokus auf die Zeile des Abschnitts - das Feld unter
      // dem Fokus verschwindet sonst mit dem zugeklappten Inhalt.
      setAnlegenOffen(false);
      window.setTimeout(() => anlegenKopfRef.current?.focus(), 0);
      onSelectClass(r.value.code);
      onChanged();
    } else setError(r.error);
  };

  /**
   * ★★ EIN WEG, EIN KIND ANZULEGEN - für das Formular UND den Excel-Import
   * (12.09.2026). Bis dahin stand die Regel „niedriger als die Vorgabe der
   * Klasse" nur in `onAddPupil`; eine zweite Fassung im Import liefe beim
   * nächsten Umbau still auseinander.
   */
  const legeKindAn = async (
    klasse: TypingClass,
    name: string,
    pw: string,
    startUnits: number,
    contactEmail = "",
  ): Promise<Result<TypingAccount>> => {
    // Programm-eigene Voreinstellungen - änderbar in den Programm-Reitern.
    const r = await backend.addPupil(
      klasse.code,
      name,
      pw,
      VORGABE_STUFE,
      "normal",
      startUnits,
      undefined,
      undefined,
      undefined,
      contactEmail || undefined,
    );
    /*
      ★★ NIEDRIGER ALS DIE VORGABE DER KLASSE? (11.09.2026, Nacht) Die Vorgabe
      nimmt beim Laden nur dazu (`startpunktMitKlasse`) - ein Kind, das die
      Lehrkraft ausdrücklich tiefer anlegt, begänne sonst trotzdem auf der
      Stufe der Klasse. Ein eigener Beschluss (Wert + Zeitpunkt) ist neuer als
      der der Klasse und gilt darum.
    */
    if (r.ok && klasse.startUnits && startUnits < klasse.startUnits)
      await backend.setStartUnits(r.value.id, startUnits);
    return r;
  };

  const onAddPupil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cls) return;
    if (busy) {
      setStatus(t.wirdGespeichert);
      return;
    }
    if (!pupilName.trim()) {
      setStatus(t.nameZuerst);
      fokusAuf(pupilNameRef);
      return;
    }
    if (pupilPw.length < 4) {
      setStatus(t.passwortKurz);
      fokusAuf(pupilPwRef);
      return;
    }
    if (pupilEmail.trim() && !pupilEmail.includes("@")) {
      setStatus(t.kontaktFalsch);
      fokusAuf(pupilEmailRef);
      return;
    }
    /* ★ B11 (11.09.2026): Die Pflichtprüfung auf das Geburtsjahr ist weg -
       das Feld gibt es nicht mehr (Begründung am Formular). Die beiden Sperren
       darüber (Name, Passwort) bleiben unverändert: nichts wird `disabled`,
       der Knopf bleibt im Tab-Weg, und die Sperre nennt ihren Grund und führt
       den Fokus in das Feld, das noch fehlt (R5). */
    setBusy(true);
    // ★ Derselbe Weg wie der Excel-Import (`legeKindAn`, 12.09.2026).
    const r = await legeKindAn(cls, pupilName, pupilPw, pupilStart, pupilEmail.trim());
    setBusy(false);
    if (r.ok) {
      setFrisch((f) => [...f, { name: pupilName.trim(), pw: pupilPw }]);
      setStatus(t.kindAngelegt(r.value.name));
      setPupilName("");
      setPupilPw("");
      setPupilEmail("");
      setError("");
      onChanged();
      // Fokus zurück ins Namensfeld — die Lehrkraft legt meist mehrere an.
      // setTimeout(0) statt rAF ([[feedback_fokus_pflicht_alle_apps]]).
      setTimeout(() => pupilNameRef.current?.focus(), 0);
    } else setError(r.error);
  };

  /* ════════════════════════════════════════════════════════════════════════
   * ★★★ KINDER AUS EXCEL (12.09.2026, Auftrag Johannes)
   * ════════════════════════════════════════════════════════════════════════
   * Ablauf: Vorlage herunterladen · Datei wählen · VORSCHAU (Fokus auf ihre
   * Überschrift) · „N Kinder anlegen" oder „Abbrechen". Geschrieben wird erst
   * nach „anlegen", nacheinander und über `legeKindAn` - derselbe Weg wie das
   * Formular. Fehlschläge je Kind werden gesammelt; am Ende steht EIN Satz.
   * Nichts wird `disabled` (R5): jede Sperre sagt ihren Grund.
   */
  /*
   * ★ 13.09.2026: Die Vorlage gehört zur gewählten Klasse - Johannes: „Bitte
   * oben immer den Klassennamen und das Datum als Überschrift einfügen." Name
   * und Startniveau der Klasse gehen mit (Vorbelegung „für alle übernehmen").
   */
  const onVorlageHerunterladen = () => {
    setImportMeldung("");
    if (!cls) return;
    void vorlageHerunterladen(
      { name: cls.name, startUnits: cls.startUnits, mitStart: mitTastenflowKlasse },
      Date.now(),
      sprache,
    ).then(
      (dateiname) => setStatus(t.vorlageLaedt(dateiname)),
      () => {
        const satz = t.vorlageFehler;
        setImportMeldung(satz);
        setStatus(satz);
      },
    );
  };

  /**
   * ★★★ „TEILNEHMERLISTE HERUNTERLADEN" (14.09.2026, Wunsch Johannes): Name +
   * Passwort + Klassencode ALLER Lernenden dieser Klasse als Word-Datei -
   * anders als „Zugangsdaten drucken" unten, das nur die eben angelegten
   * zeigt. Die Passwörter kommen NICHT aus `pupils` (das Feld gibt
   * `mapPupil` absichtlich nie weiter, siehe `listPupilPasswords` in
   * `backend.ts`), sondern über einen eigenen, engen Weg - nur in diesem
   * Augenblick gelesen, nirgends zwischengespeichert.
   */
  const onTeilnehmerlisteHerunterladen = async () => {
    if (!cls || teilnehmerlisteBusy) return;
    setTeilnehmerlisteBusy(true);
    setStatus(t.listeWird);
    try {
      const zeilen = await typingBackend().listPupilPasswords(cls.code);
      const { downloadTeilnehmerliste } = await import(
        "@/lib/lernwerkstatt/teilnehmerlisteDocx"
      );
      await downloadTeilnehmerliste(cls, zeilen, sprache);
      setStatus(t.listeLaedt(cls.name));
    } catch {
      setStatus(t.listeFehler);
    } finally {
      setTeilnehmerlisteBusy(false);
    }
  };

  const onImportWaehlen = () => {
    if (busy) {
      setStatus(t.nochSpeichern);
      return;
    }
    importDateiRef.current?.click();
  };

  const onImportDatei = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const datei = e.target.files?.[0];
    // Leeren, damit dieselbe Datei nach einer Korrektur noch einmal geht.
    e.target.value = "";
    if (!datei || !cls) return;
    const klasse = cls;
    setImportErgebnis(null);
    /* ★ Nicht lesbar ⇒ ein verständlicher Satz, sichtbar am Import und in der
       Statuszeile, und der Fokus zurück auf den Schalter, mit dem es weitergeht. */
    const scheitern = (satz: string) => {
      setImportPlan(null);
      setImportMeldung(satz);
      setStatus(satz);
      fokusAufElement(importKnopfRef);
    };
    let gelesen: Awaited<ReturnType<typeof leseKinderXlsx>>;
    try {
      gelesen = await leseKinderXlsx(await dateiBytes(datei), sprache);
    } catch {
      gelesen = {
        ok: false,
        fehler: t.dateiNichtOffen,
      };
    }
    if (!gelesen.ok) return scheitern(gelesen.fehler);
    if (gelesen.zeilen.length === 0) return scheitern(t.dateiLeer(datei.name));
    const plan = pruefeKinderZeilen(gelesen.zeilen, {
      vorhandeneNamen: pupils.map((p) => p.name),
      // Leer ⇒ der erste Startpunkt - wie `pupilStart` im Formular.
      startVorgabe: klasse.startUnits,
      sprache,
      // ★ E1: die neuen Kinder erben den Weg der Klasse (Bauplan §2.2).
      lernweg: lernwegVon(klasse),
    });
    /* ★ 13.09.2026: Nennt die Überschrift der Datei eine andere Klasse, sagt
       es die Vorschau sichtbar und die Statuszeile hörbar - ohne zu sperren. */
    const hinweisKlasse = fremdeKlasseHinweis(gelesen.titel, klasse.name, sprache);
    setImportMeldung("");
    setImportPlan({ ...plan, klasse: klasse.code, datei: datei.name, hinweisKlasse });
    setStatus(
      t.vorschauStatus(
        kinderWort(plan.anlegen.length, sprache),
        plan.abgelehnt.length > 0 ? zeilenWort(plan.abgelehnt.length, sprache) : null,
        hinweisKlasse,
      ),
    );
    fokusAufElement(vorschauKopfRef);
  };

  const onImportAnlegen = async () => {
    if (!cls || !importPlan || importPlan.klasse !== cls.code) return;
    if (busy) {
      setStatus(t.nochSpeichern);
      return;
    }
    const { anlegen } = importPlan;
    if (anlegen.length === 0) {
      setStatus(t.keinerAnlegbar);
      fokusAufElement(vorschauKopfRef);
      return;
    }
    const klasse = cls;
    setBusy(true);
    const neu: { name: string; pw: string }[] = [];
    const nicht: { name: string; grund: string }[] = [];
    for (let i = 0; i < anlegen.length; i++) {
      const kind = anlegen[i];
      const stand = t.wirdAngelegt(i + 1, anlegen.length, kind.name);
      setImportFortschritt(stand);
      setStatus(stand);
      let r: Result<TypingAccount>;
      try {
        r = await legeKindAn(klasse, kind.name, kind.passwort, kind.startUnits, kind.email);
      } catch {
        // Deutsch, wie ein Server-Satz - die Anzeige übersetzt ihn (`serverMeldungen.ts`).
        r = { ok: false, error: T.de.kontoNicht };
      }
      if (r.ok) neu.push({ name: r.value.name, pw: kind.passwort });
      else nicht.push({ name: kind.name, grund: r.error });
    }
    setBusy(false);
    setImportFortschritt("");
    setImportPlan(null);
    // ★ Entscheidung 3: ALLE importierten Kinder in „Zugangsdaten drucken".
    if (neu.length > 0) setFrisch((f) => [...f, ...neu]);
    const satz = [
      t.ergebnisAngelegt(kinderWort(neu.length, sprache)),
      nicht.length > 0
        ? t.ergebnisNicht(
            nicht.length,
            nicht
              .map((n) => `${n.name} (${serverMeldung(n.grund, sprache).text.replace(/\.$/, "")})`)
              .join("; "),
          )
        : "",
      neu.length > 0 ? t.ergebnisDrucken : "",
    ]
      .filter(Boolean)
      .join(" ");
    setImportErgebnis({ satz, alleOk: nicht.length === 0 });
    setStatus(satz);
    setError("");
    onChanged();
    // Die Vorschau verschwindet mit ihren Schaltern - der Fokus geht auf die
    // Überschrift „Lernende", direkt darunter steht der Ergebnissatz.
    fokusAufElement(lernendeRef);
  };

  const onImportAbbrechen = () => {
    if (busy) {
      setStatus(t.anlegenLaeuft);
      return;
    }
    setImportPlan(null);
    setStatus(t.importAbgebrochen);
    fokusAufElement(importKnopfRef);
  };

  const onDeletePupil = (pupil: TypingAccount) => {
    if (!window.confirm(t.kindLoeschenFrage(pupil.name))) return;
    void backend.deletePupil(pupil.id).then((r) => {
      if (r.ok) {
        setStatus(t.kindGeloescht(pupil.name));
        onChanged();
      } else setError(r.error);
    });
  };

  const onDeleteClass = () => {
    if (!cls) return;
    const n = pupils.length;
    if (!window.confirm(t.klasseLoeschenFrage(cls.name, n))) return;
    void backend.deleteClass(cls.code, teacher.id).then(() => {
      setStatus(t.klasseGeloescht(cls.name));
      onChanged();
    });
  };

  const openEditClass = () => {
    if (!cls) return;
    setEditName(cls.name);
    setEditCode(cls.code);
    setEditing(true);
  };

  const onUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cls) return;
    if (busy) {
      setStatus(t.wirdGespeichert);
      return;
    }
    if (!editName.trim()) {
      setStatus(t.klassennameFehlt);
      fokusAuf(editNameRef);
      return;
    }
    // ★ Beim Bearbeiten darf der Klassencode nicht geleert werden (10.09.2026).
    const codeFehler = codeFehlerIn(editCode, sprache);
    if (codeFehler) {
      setStatus(codeFehler);
      fokusAuf(editCodeRef);
      return;
    }
    setBusy(true);
    const r = await backend.updateClass(cls.code, teacher.id, {
      name: editName,
      code: editCode,
    });
    setBusy(false);
    if (r.ok) {
      setEditing(false);
      setError("");
      setStatus(t.klasseGespeichert);
      onSelectClass(r.value.code);
      onChanged();
    } else setError(r.error);
  };

  /**
   * ★★★ Ein Kind verschieben (10.09.2026, Wunsch Johannes). Die Rückfrage mit
   * den Folgen stellt die Zeile selbst (`PupilZeile`); hier geht es nur noch
   * zum Server und danach um den Fokus: Die Zeile des Kindes verschwindet aus
   * der Liste, und mit ihr das Element, das den Fokus hatte. Er geht darum auf
   * die Überschrift „Lernende", unter der die Bestätigung steht.
   */
  const onMovePupil = async (
    pupil: TypingAccount,
    zielCode: string,
  ): Promise<Result<KindVerschoben>> => {
    const r = await backend.kindVerschieben(pupil.id, zielCode);
    if (r.ok) {
      const satz = t.verschoben(
        pupil.name,
        r.value.zielName || r.value.zielCode,
        r.value.zielCode,
      );
      setVerschoben(satz);
      setStatus(satz);
      setError("");
      onChanged();
      setTimeout(() => lernendeRef.current?.focus(), 0);
    }
    return r;
  };

  const onResetPupilPassword = (
    pupilId: string,
    pw: string,
  ): Promise<Result<true>> => backend.resetPupilPassword(pupilId, pw);

  /**
   * Kontakt-E-Mail setzen/ändern/löschen (14.09.2026) - anders als beim
   * Passwort-Reset MUSS die Liste danach neu laden: Der Haken am Schalter
   * (`pupil.contactEmail`) kommt aus `pupils`, nicht aus einem eigenen Zustand.
   */
  const onSetPupilContactEmail = async (
    pupilId: string,
    email: string,
  ): Promise<Result<true>> => {
    const r = await backend.setContactEmail(pupilId, email);
    if (r.ok) onChanged();
    return r;
  };

  return (
    <div className="space-y-5">
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      {classes.length === 0 ? (
        <ErsteSchritte schritt={1} />
      ) : cls && pupils.length === 0 ? (
        <ErsteSchritte schritt={2} />
      ) : null}

      {/* --- Klasse anlegen ---------------------------------------------- */}
      <div data-rundgang="klassen" className="card space-y-3 p-4">
        <h2 className="m-0 text-lg font-semibold text-ink">{t.klassen}</h2>
        {classes.length > 0 && (
          <div role="group" aria-label={t.klassen} className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <Tipp
                key={c.code}
                text={t.klasseWaehlenTipp(c.name)}
                ausrichtung="links"
              >
                {(hinweisId) => (
                  <button
                    type="button"
                    aria-pressed={cls?.code === c.code}
                    aria-label={t.klasseKnopf(c.name, cls?.code === c.code)}
                    aria-describedby={hinweisId}
                    onClick={() => onSelectClass(c.code)}
                    className={cls?.code === c.code ? "btn-primary" : "btn-secondary"}
                  >
                    {c.name}
                  </button>
                )}
              </Tipp>
            ))}
          </div>
        )}
        {/*
          ★★★ „Neue Klasse anlegen" - zuklappbar (R7), Begründung für „offen
          ohne Klasse" beim Zustand `anlegenOffen`. Ein `<details>`: In der
          Zeile stehen keine Bedienelemente, also bringt der Browser Tastatur,
          „zu"/„auf"-Ansage und Fokus mit. Die `h3` steht IN der `<summary>`
          (dieselbe Bauart wie „Einstellungen der Klasse").
        */}
        <div className="flex flex-wrap items-start gap-2">
        <details
          className="group min-w-0 flex-1 rounded-xl border border-hairline bg-surface-sunken px-3 py-1"
          open={anlegenOffen}
          onToggle={(e) => {
            const offen = e.currentTarget.open;
            if (offen !== anlegenOffen) {
              anlegenSelbstGeklappt.current = true;
              setAnlegenOffen(offen);
            }
          }}
        >
          <summary
            ref={anlegenKopfRef}
            className="flex min-h-9 cursor-pointer list-none flex-wrap content-center items-center gap-x-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span aria-hidden="true" className="text-ink-muted transition group-open:rotate-90">
              ▸
            </span>
            <h3 className="m-0 text-sm font-semibold text-ink">{t.neueKlasse}</h3>
            {/* Die Zeile nennt, was darin steht (R7: ein zugeklappter Bereich
                verschweigt seinen Inhalt nicht). */}
            {/*
              ★ BEI SCHMALEM FENSTER NUR DER TITEL (11.09.2026, Nacht - Prüfbefund).
              Im Browser gemessen: Einzeilig braucht die Zeile 628,9 px; bei
              700 px Fensterbreite stehen 608 px zur Verfügung (92 px gehen an
              Seitenrand, Karte und Abschnitt) - sie brach auf 40 statt 36 px um.
              Die Aufzählung passt ab 721 px. Sichtbar steht sie darum erst ab
              `md` (768 px): 47 px Reserve für Schriften, die breiter laufen
              (Windows). Für Sprachausgaben steht sie IMMER da (`sr-only`) - der
              Name der Zeile ist bei jeder Breite derselbe.
            */}
            <span aria-hidden="true" className="hidden font-normal text-ink-muted md:inline">
              {t.neueKlasseInhalt}
            </span>
            <span className="sr-only">{t.neueKlasseInhalt}</span>
          </summary>
          <form className="mb-2 mt-1 space-y-3 border-t border-hairline pt-3" onSubmit={onCreateClass}>
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[10rem] flex-1">
                {/* ★ „Klassenname" - dasselbe Wort wie beim Bearbeiten. „Neue
                    Klasse anlegen" ist seit 11.09.2026 (Nacht) die Zeile des
                    Abschnitts. */}
                <label className="field-label" htmlFor="mk-class-name">
                  {t.klassenname}
                </label>
                <input
                  id="mk-class-name"
                  ref={classNameRef}
                  className="field-input"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    // ★ Der Vorschlag folgt dem Namen, bis die Lehrkraft den Code
                    // selbst schreibt (`codeSelbst`).
                    if (!codeSelbst) setClassCode(klassencodeVorschlag(e.target.value, sprache));
                  }}
                  placeholder={t.klassennameBeispiel}
                  aria-required="true"
                />
              </div>
              <div className="min-w-[8rem]">
                {/*
                  ★★ „Klassencode", Pflicht (10.09.2026, Johannes). Dasselbe Wort,
                  das die Kinder beim Anmelden lesen - eine Sache, ein Wort.
                */}
                <label className="field-label" htmlFor="mk-class-code">
                  {t.klassencode}
                </label>
                {/* Der Hinweis liegt UM dem Feld, nicht im `<label>`.
                    ⚠️ „rechts", nicht „links" - im Browser gemessen (11.09.2026,
                    Nacht, 1280 px, Abschnitt offen): Seit „Klasse anlegen" in
                    einer eigenen Zeile steht, sitzt dieses Feld am rechten Rand.
                    Links angedockt lief der 320 px breite Hinweis von 1004 bis
                    1324 px und machte die Seite 44 px breiter, auch unsichtbar.
                    Rechts angedockt läuft er nach innen.
                    ★ E12 (19.09.2026): der Satz, dass eine Klasse für ALLE
                    Lernprogramme gilt, stand bis dahin als eigener Absatz
                    über dem Formular - jetzt hier, am Pflichtfeld, das genau
                    das ausmacht (der Code, mit dem sich Kinder überall
                    anmelden). */}
                <Tipp
                  text={t.klassencodeTipp}
                  ausrichtung="rechts"
                  className="w-full"
                >
                  {(hinweisId) => (
                    <input
                      id="mk-class-code"
                      ref={classCodeRef}
                      className="field-input uppercase"
                      value={classCode}
                      onChange={(e) => {
                        const v = e.target.value.toUpperCase();
                        setClassCode(v);
                        setCodeSelbst(v.trim() !== "");
                      }}
                      placeholder={t.klassencodeBeispiel}
                      aria-required="true"
                      autoComplete="off"
                      aria-describedby={hinweisId}
                    />
                  )}
                </Tipp>
              </div>
            </div>

            {/*
              ★★★ PROGRAMME ZUERST (18.10.2026, Johannes: „wenn jemand eine
              Klasse anlegt, ist es verwirrend, dass nach Tastenflow gefragt
              wird, weil jemand vielleicht nur Im Griff verwenden möchte").
              Erst die Frage, WAS die Klasse nutzt - die Tastenflow-Angaben
              darunter erscheinen nur, wenn Tastenflow angekreuzt ist. Kein
              `disabled`, nichts wird gesperrt: Ein abgewähltes Programm
              verschwindet nur aus der Ansicht der Lehrkraft.
              Die Gruppe heisst anders als „Programme dieser Klasse" (die
              Ankreuz-Liste einer vorhandenen Klasse) - zwei Gruppen mit
              demselben Namen wären für die Sprachausgabe nicht zu trennen.
            */}
            {zeigeProgrammWahl && (
              <fieldset className="m-0 rounded-lg border border-hairline bg-surface px-3 py-2">
                <legend className="px-1 text-sm font-semibold text-ink">
                  {t.neuProgrammeTitel}
                </legend>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {offeneProgramme.map((p, i) => (
                    <Erklaert key={p.key} hilfe={PROGRAMM_BESCHREIBUNG[sprache][p.key]}>
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input
                          type="checkbox"
                          ref={i === 0 ? programmeRef : undefined}
                          className="h-4 w-4 accent-[rgb(var(--c-accent))]"
                          checked={neuProgramme.includes(p.key)}
                          aria-label={t.neuProgrammName(p.label)}
                          onChange={() =>
                            setNeuProgramme((alt) =>
                              alt.includes(p.key) ? alt.filter((k) => k !== p.key) : [...alt, p.key],
                            )
                          }
                        />
                        <ProgrammZeichen programm={p.key} />{" "}
                        {programmNameLang(p.key, sprache) ? (
                          <span lang={programmNameLang(p.key, sprache)}>{p.label}</span>
                        ) : (
                          p.label
                        )}
                      </label>
                    </Erklaert>
                  ))}
                </div>
                <p className="m-0 mt-1 text-sm text-ink-muted">{t.neuProgrammeHinweis}</p>
              </fieldset>
            )}

            {/*
              ★★ TASTENFLOW-ANGABEN IN EINEM FORMULAR FÜR ALLE PROGRAMME. Eine
              Lehrkraft, die nur Punktgenau nutzt, soll nicht rätseln, was eine
              „Schulstufe" dort bewirkt - darum eine Haarlinie, eine kleine
              Überschrift (R6) und EIN Satz, wofür sie gelten.
              ★ 18.10.2026: und sie stehen NUR da, wenn Tastenflow angekreuzt ist.
              ⏳ Kommt im Kasten „Einstellungen der Klasse" etwas dazu, steht es
              über `KlassenEinstellungsFelder` von selbst auch hier; Pflicht wird
              es über `fehlendeAngaben`.
              ★ E12 (19.09.2026): der Satz stand bis dahin als eigener Absatz
              unter der Überschrift - jetzt an ihr selbst (`Erklaert`, kein
              neuer Tabstopp für eine Zwischenüberschrift).
            */}
            {mitTastenflow && (
            <div className="space-y-2 border-t border-hairline pt-3">
              <h4 className="m-0 text-base font-semibold text-ink">
                <Erklaert hilfe={t.fuerTastenflowTipp}>{t.fuerTastenflow}</Erklaert>
              </h4>
              <KlassenEinstellungsFelder
                bezug={t.bezugNeu}
                werte={{
                  schulstufe: neuSchulstufe > 0 ? neuSchulstufe : null,
                  lang: neuLang,
                  langLocked: neuLangLocked,
                  klassenmatchAus: neuMatchAus,
                  zeilenEndeEnter: neuZeilenEnde,
                  schreibweise: neueSchreibweise,
                  schuljahrBeginn: neuSchuljahrBeginn,
                }}
                jetztMs={Date.now()}
                pflicht
                startniveau={{
                  lernweg: neuerKlassenWeg,
                  wert: neuStart > 0 ? String(neuStart) : "",
                  platzhalter: t.bitteWaehlen,
                  hinweis: t.startHinweis,
                  srHinweis: t.startSrHinweis,
                }}
                schulstufeRef={schulstufeRef}
                startniveauRef={startniveauRef}
                onSchulstufe={setNeuSchulstufe}
                onSprache={setNeuLang}
                onSperre={setNeuLangLocked}
                onStartniveau={setNeuStart}
                onKlassenmatch={(erlaubt) => setNeuMatchAus(!erlaubt)}
                onZeilenEnde={setNeuZeilenEnde}
                onSchreibweise={setNeueSchreibweise}
                onSchuljahrBeginn={setNeuSchuljahrBeginn}
              />
            </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {/* ★ R5: `aria-disabled` statt `disabled` - bis alles ausgefüllt
                  ist. Der Knopf bleibt auffindbar und sagt beim Drücken, was
                  fehlt; beim Speichern kann er sich nicht unter dem eigenen
                  Fokus wegziehen. */}
              <Tipp text={t.anlegenTipp}>
                {(hinweisId) => (
                  <button
                    type="submit"
                    className="btn-primary aria-disabled:opacity-40"
                    aria-disabled={fehltJetzt.length > 0 || busy}
                    aria-describedby={hinweisId}
                  >
                    {t.klasseAnlegen}
                  </button>
                )}
              </Tipp>
              {/* Sichtbar, aber KEINE Live-Region - die Statuszeile oben sagt es
                  der Sprachausgabe schon; zweimal wäre eine doppelte Ansage. Der
                  Satz zieht mit, während die Lehrkraft ausfüllt. */}
              {anlegeVersucht && fehltSatz && (
                <p className="m-0 text-sm text-ink">{fehltSatz}</p>
              )}
            </div>
          </form>
        </details>
        <FilmKnopf nr="T-L01" />
        </div>
      </div>

      {!cls ? (
        <p className="text-ink-muted">{t.zuerstKlasse}</p>
      ) : (
        <>
          {/* --- Die Klasse ------------------------------------------------ */}
          <div data-rundgang="klasse" className="card space-y-4 p-4">
            <h2 className="sr-only">
              {t.klasseVor}
              {cls.name}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="m-0 text-sm text-ink-muted">
                  {cls.name}
                  {t.codeFuerLernende}
                </p>
                {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl` - die Schrift
                    bleibt `font-legible` und `tracking-widest`, nur die Grösse
                    fügt sich in die eingeschnürte Spannweite (14-20 px). */}
                <p className="m-0 font-legible text-xl font-bold tracking-widest text-ink">
                  {cls.code}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <LwClassMessageButton
                  classCode={cls.code}
                  pupils={pupils.map((p) => ({ id: p.id, name: p.name }))}
                />
                <Tipp text={t.bearbeitenTipp}>
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary btn-toggle"
                      onClick={openEditClass}
                      aria-label={t.klasseBearbeiten}
                      aria-describedby={hinweisId}
                    >
                      <span aria-hidden="true">✏️</span>
                      {t.bearbeiten}
                    </button>
                  )}
                </Tipp>
                {isOwner && (
                  <Tipp text={t.loeschenTipp}>
                    {(hinweisId) => (
                      <button
                        type="button"
                        className="btn-secondary btn-toggle text-danger"
                        onClick={onDeleteClass}
                        aria-label={t.klasseLoeschen}
                        aria-describedby={hinweisId}
                      >
                        <span aria-hidden="true">🗑</span>
                        {t.klasseLoeschenKnopf}
                      </button>
                    )}
                  </Tipp>
                )}
              </div>
            </div>

            {/* ★ 19.09.2026: „Bearbeiten" klappt das Formular SICHTBAR auf,
                der Rest der Karte gleitet mit (`Aufklappen`, Johannes: „der
                Rest rutscht nach unten und der andere kommt nach"). */}
            <Aufklappen offen={editing}>
              <form
                onSubmit={onUpdateClass}
                className="space-y-2 rounded-xl border border-accent bg-accent-soft p-3"
              >
                <h3 className="m-0 text-sm font-semibold text-ink">
                  {t.klasseBearbeiten}
                </h3>
                <div className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[10rem] flex-1">
                    <label className="field-label" htmlFor="mk-edit-class-name">
                      {t.klassenname}
                    </label>
                    <input
                      id="mk-edit-class-name"
                      ref={editNameRef}
                      className="field-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="min-w-[8rem]">
                    <label className="field-label" htmlFor="mk-edit-class-code">
                      {t.klassencode}
                    </label>
                    {/* ★ K2 (19.09.2026): war ohne Hinweis - die Folge einer
                        Änderung (alle Lernenden bekommen den neuen Code) stand
                        bisher nur als bedingter Absatz weiter unten, sichtbar
                        erst NACHDEM man zu tippen begonnen hat. */}
                    <Tipp
                      text={t.codeAendernTipp}
                      ausrichtung="rechts"
                    >
                      {(hinweisId) => (
                        <input
                          id="mk-edit-class-code"
                          ref={editCodeRef}
                          className="field-input uppercase"
                          value={editCode}
                          onChange={(e) => setEditCode(e.target.value.toUpperCase())}
                          aria-required="true"
                          autoComplete="off"
                          aria-describedby={hinweisId}
                        />
                      )}
                    </Tipp>
                  </div>
                  {/* ★ R5: `aria-disabled` statt `disabled`. */}
                  <Tipp text={t.speichernTipp} ausrichtung="links">
                    {(hinweisId) => (
                      <button
                        type="submit"
                        className="btn-primary aria-disabled:opacity-40"
                        aria-disabled={busy || !editName.trim() || !editCode.trim()}
                        aria-describedby={hinweisId}
                      >
                        {t.speichern}
                      </button>
                    )}
                  </Tipp>
                  <Tipp text={t.abbrechenTipp} ausrichtung="links">
                    {(hinweisId) => (
                      <button
                        type="button"
                        className="btn-secondary"
                        aria-describedby={hinweisId}
                        onClick={() => {
                          setEditing(false);
                          setError("");
                        }}
                      >
                        {t.abbrechen}
                      </button>
                    )}
                  </Tipp>
                </div>
                {pupils.length > 0 &&
                  editCode.trim().toUpperCase() !== cls.code && (
                    <p className="m-0 text-sm text-ink">
                      {t.codeWarnVor}{" "}
                      {t.codeWarnWer(pupils.length)}{" "}
                      {t.codeWarnMitte}
                      <strong>{t.codeWarnNeu}</strong>
                      {t.codeWarnEnde}
                    </p>
                  )}
              </form>
            </Aufklappen>

            {/* ★ 28.09.2026: ausserhalb von Deutsch gibt es nur Tastenflow
                (`programmInSprache`) - eine Auswahl aus einem Programm wäre
                keine. Die gespeicherte Liste der Klasse bleibt unangetastet. */}
            {sprache === "de" && (
              <ProgrammAuswahl
                cls={cls}
                teacherId={teacher.id}
                offen={offeneProgramme.length > 0 ? offeneProgramme : LW_PROGRAMS}
                onSaved={(m) => {
                  setStatus(m);
                  onChanged();
                }}
              />
            )}

            {/*
              ★★★ 18.10.2026: DER WOCHENBERICHT ENTHÄLT NUR TASTENFLOW-ZAHLEN
              (`tt_weekly_report.pb.js`: geübte Zeit, Treffsicherheit,
              Leistungsstufe, Wochenziel - alles aus den Tastenflow-Daten). Für
              eine Klasse ohne Tastenflow wäre die Mail leer; der Schalter steht
              dort darum nicht da. Hat die Klasse ihn schon AN, bleibt er sichtbar -
              sonst liesse sich der Bericht nicht mehr abschalten.
            */}
            {(mitTastenflowKlasse || !!cls.weeklyReport) && (
            <label className="flex flex-wrap items-center gap-2 rounded-lg border border-hairline bg-surface-sunken px-3 py-2 text-sm text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[rgb(var(--c-accent))]"
                checked={!!cls.weeklyReport}
                onChange={(e) => {
                  void backend
                    .setClassWeeklyReport(cls.code, teacher.id, e.target.checked)
                    .then(() => {
                      setStatus(e.target.checked ? t.wochenberichtAn : t.wochenberichtAus);
                      onChanged();
                    });
                }}
              />
              <span aria-hidden="true">📧</span>
              {t.wochenbericht}
              {teacher.email ? (
                <span className="text-ink-muted">
                  {t.wochenberichtAnAdresse}
                  {teacher.email}
                </span>
              ) : null}
            </label>
            )}

            <ClassTeachers classCode={cls.code} meId={teacher.id} />
          </div>

          {/* --- Kinder ---------------------------------------------------- */}
          <div data-rundgang="lernende" className="card space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* `tabIndex={-1}`: das Fokus-Ziel, wenn ein Kind die Liste
                  verlassen hat (Verschieben) - sein Schalter ist dann weg. */}
              <div className="flex flex-wrap items-center gap-2">
              <h2
                ref={lernendeRef}
                tabIndex={-1}
                className="m-0 text-lg font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {t.lernende}
                {pupils.length})
              </h2>
              <FilmKnopf nr="T-L02" />
              </div>
              {frisch.length > 0 && (
                <Tipp text={t.druckenTipp}>
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary btn-toggle"
                      aria-describedby={hinweisId}
                      onClick={() => {
                        if (!drucke(cls, frisch, sprache)) setEigenerFehler(t.druckBlockiert);
                      }}
                    >
                      <span aria-hidden="true">🖨</span>
                      {t.drucken}
                      {frisch.length})
                    </button>
                  )}
                </Tipp>
              )}
            </div>
            {/* ★ Das Ergebnis des Excel-Imports (12.09.2026) - SICHTBAR, direkt
                unter der Überschrift, auf der danach der Fokus steht. Keine
                Live-Region: die Statuszeile oben sagt es der Sprachausgabe schon. */}
            {importErgebnis && (
              <p
                className={
                  "m-0 rounded-lg p-2 text-sm text-ink " +
                  (importErgebnis.alleOk ? "bg-success-soft" : "border border-hairline bg-surface-sunken")
                }
              >
                {importErgebnis.satz}
              </p>
            )}

            <form className="flex flex-wrap items-end gap-2" onSubmit={onAddPupil}>
              <div className="min-w-[10rem] flex-1">
                <label className="field-label" htmlFor="mk-pupil-name">
                  {t.zurKlasse}
                </label>
                {/* ★ K2 (19.09.2026): war das einzige Feld dieser Zeile ohne
                    Hinweis - Passwort (samt „Zufällig") und Kontakt-E-Mail
                    daneben hatten schon einen. */}
                <Tipp text={t.nameTipp}>
                  {(hinweisId) => (
                    <input
                      id="mk-pupil-name"
                      ref={pupilNameRef}
                      className="field-input"
                      value={pupilName}
                      onChange={(e) => setPupilName(e.target.value)}
                      placeholder={t.name}
                      aria-describedby={hinweisId}
                    />
                  )}
                </Tipp>
              </div>
              <div>
                <label className="field-label" htmlFor="mk-pupil-pw">
                  {t.passwort}
                </label>
                <div className="flex gap-1">
                  <input
                    id="mk-pupil-pw"
                    ref={pupilPwRef}
                    className="field-input"
                    value={pupilPw}
                    onChange={(e) => setPupilPw(e.target.value)}
                    placeholder={t.passwortBeispiel}
                  />
                  <Tipp text={t.zufallTipp}>
                    {(hinweisId) => (
                      <button
                        type="button"
                        className="btn-secondary shrink-0"
                        aria-describedby={hinweisId}
                        onClick={() => {
                          setPupilPw(erzeugePasswort());
                          pupilPwRef.current?.focus();
                        }}
                      >
                        {t.zufall}
                      </button>
                    )}
                  </Tipp>
                </div>
              </div>
              <div className="min-w-[12rem] flex-1">
                <label className="field-label" htmlFor="mk-pupil-email">
                  {t.kontakt}
                </label>
                <Tipp text={t.kontaktTipp} className="w-full">
                  {(hinweisId) => (
                    <input
                      id="mk-pupil-email"
                      ref={pupilEmailRef}
                      type="email"
                      className="field-input"
                      value={pupilEmail}
                      onChange={(e) => setPupilEmail(e.target.value)}
                      placeholder={t.kontaktBeispiel}
                      aria-describedby={hinweisId}
                    />
                  )}
                </Tipp>
              </div>
              {/*
                ★★★ B11 (11.09.2026): DAS FELD „GEBURTSJAHR" IST HIER WEG.
                Johannes: *„Jede Klasse hat also nur eine Textstufe."* Für ein
                Kind, das einer Klasse angehört, kommt die Textstufe seit dem
                Umbau aus der SCHULSTUFE der Klasse (Kasten „Einstellungen der
                Klasse" im Tastenflow-Reiter) - das Geburtsjahr bewirkte hier
                also nichts mehr und wäre eine Angabe, die niemand braucht
                (Datenminimierung).

                ⚠️ Geprüft am 11.09.2026 (`grep -rl geburtsjahr src`): KEIN
                anderes Programm liest `pupil.geburtsjahr` - weder Punktgenau
                noch Mathecoach noch die Lernwerkstatt. Das Feld am Server
                bleibt für selbstlernende Konten, die es weiterhin selbst im
                Zahnrad setzen.
              */}
              {/*
                ★★ VORKENNTNISSE SCHON BEIM ANLEGEN (Johannes, 01.09.2026):
                *„und wenn ein Schüler angelegt wird soll man auch aussuchen
                mit welchen Tasten er startet"*.

                ⚠️ Dieses Formular gehört ALLEN Programmen (`apps/GEMEINSAM.md`).
                Darum genau EIN Feld mit der Vorgabe „Anfänger" und dem Programm
                im Namen - wer nur Punktgenau nutzt, geht mit einem Tabstopp
                daran vorbei. Ändern lässt es sich danach jederzeit im
                Tastenflow-Reiter, dort steht dasselbe Feld.
              */}
              {mitTastenflowKlasse && (
              <div className="w-56">
                <label className="field-label" htmlFor="mk-pupil-start">
                  {t.womitAnfangen}
                </label>
                {/* Der Hinweis liegt UM dem Feld, nicht im `<label>`. */}
                <Tipp text={t.womitTipp} className="w-full">
                  {(hinweisId) => (
                    <select
                      id="mk-pupil-start"
                      className="field-input"
                      value={String(pupilStart)}
                      onChange={(e) => setPupilStart(Number(e.target.value))}
                      aria-describedby={hinweisId}
                    >
                      {startPunkte(sprache, kindWeg).map((sp) => (
                        <option key={sp.key} value={sp.units}>
                          {sp.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Tipp>
              </div>
              )}
              {/* ★ R5: `aria-disabled` statt `disabled`. Gerade hier zählt
                  es doppelt: Die Lehrkraft legt meist mehrere Kinder
                  hintereinander an und arbeitet dabei rein mit der Tastatur.
                  ★ E12 (19.09.2026): der Absatz, was dieses Formular NICHT
                  abfragt und wo das Weitere steht, stand bis dahin fest
                  darunter - jetzt hier, am Knopf, der es abschickt. */}
              <Tipp text={mitTastenflowKlasse ? t.hinzufuegenTipp : OHNE_TASTENFLOW_DE.hinzufuegenTipp}>
                {(hinweisId) => (
                  <button
                    type="submit"
                    className="btn-primary aria-disabled:opacity-40"
                    aria-disabled={!pupilName.trim() || pupilPw.length < 4 || busy}
                    aria-describedby={hinweisId}
                  >
                    {t.hinzufuegen}
                  </button>
                )}
              </Tipp>
            </form>

            {/*
              ★★★ VIELE TEILNEHMER AUF EINMAL AUS EXCEL (12.09.2026, Auftrag
              Johannes; Wortlaut „Teilnehmer" statt „Kinder" - 14.09.2026,
              nachgezogen auf Blattname und Dateiname am selben Tag abends:
              „da kommt aber niemand drauf" traf zuerst nur die Knöpfe hier,
              nicht die Datei selbst):
              *„Die Vorlage legt NUR TEILNEHMER an, und zwar in der gerade
              gewählten Klasse."* Darum steht der Import hier, in der Karte
              „Lernende" DIESER Klasse, und nennt ihren Namen.
              ⚠️ Das Dateifeld ist versteckt und kein Tabstopp - der Schalter
              öffnet es. Bricht die Lehrkraft die Dateiauswahl ab, steht der Fokus
              von selbst wieder auf dem Schalter.
            */}
            <div data-rundgang="excel" className="space-y-2 border-t border-hairline pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="m-0 text-base font-semibold text-ink">{t.excelTitel}</h3>
                <FilmKnopf nr="T-L03" />
              </div>
              {/* ★ E12 (19.09.2026): der Ablauf (Vorlage - ausfüllen -
                  importieren) stand bis dahin als eigener Absatz hier - jetzt
                  am Knopf „Vorlage herunterladen", der ihn auslöst. Sichtbar
                  bleibt nur die eine Tatsache, die diese Klassen-Karte
                  betrifft: WELCHE Klasse (echter Name, kein Absatz, der es
                  nur behauptet). */}
              <p className="m-0 text-sm text-ink-muted">
                {t.kommenInKlasse}
                <strong>{cls.name}</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                {/* ★ 13.09.2026: Dateiname mit Klasse und Datum, Blätter neu. */}
                <Tipp
                  text={
                    mitTastenflowKlasse
                      ? t.vorlageTipp(vorlageDateiname(cls.name, Date.now(), sprache))
                      : OHNE_TASTENFLOW_DE.vorlageTipp(vorlageDateiname(cls.name, Date.now(), sprache))
                  }
                  ausrichtung="links"
                >
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary"
                      aria-describedby={hinweisId}
                      onClick={onVorlageHerunterladen}
                    >
                      {t.vorlage}
                    </button>
                  )}
                </Tipp>
                <Tipp text={t.importTipp} ausrichtung="links">
                  {(hinweisId) => (
                    <button
                      ref={importKnopfRef}
                      type="button"
                      className="btn-secondary aria-disabled:opacity-40"
                      aria-disabled={busy}
                      aria-describedby={hinweisId}
                      onClick={onImportWaehlen}
                    >
                      {t.importieren}
                    </button>
                  )}
                </Tipp>
                {/* ★★★ „TEILNEHMERLISTE HERUNTERLADEN" (14.09.2026, Wunsch
                    Johannes): Name + Passwort + Klassencode ALLER Lernenden
                    als Word-Datei, nicht nur der eben importierten - daneben,
                    weil beide Schalter Zugangsdaten dieser Klasse betreffen. */}
                <Tipp text={t.listeTipp} ausrichtung="links">
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary aria-disabled:opacity-40"
                      aria-disabled={teilnehmerlisteBusy || pupils.length === 0}
                      aria-describedby={hinweisId}
                      onClick={() => void onTeilnehmerlisteHerunterladen()}
                    >
                      {t.liste}
                    </button>
                  )}
                </Tipp>
              </div>
              <input
                ref={importDateiRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => void onImportDatei(e)}
              />
              {importMeldung && <p className="m-0 text-sm text-ink">{importMeldung}</p>}

              {/* ★ 19.09.2026: Die Vorschau wächst sichtbar auf, die Liste der
                  Lernenden darunter gleitet mit (`Aufklappen`). */}
              <Aufklappen offen={!!importPlan && importPlan.klasse === cls.code}>
                {importPlan && importPlan.klasse === cls.code && (
                  <section
                    aria-labelledby={vorschauId}
                    className="space-y-3 rounded-xl border border-accent bg-accent-soft p-3"
                    onKeyDown={(e) => {
                      // Escape bricht ab und führt auf den Import-Schalter zurück (R3).
                      if (e.key === "Escape") {
                        e.preventDefault();
                        e.stopPropagation();
                        onImportAbbrechen();
                      }
                    }}
                  >
                    {/* `tabIndex={-1}`: Fokus-Ziel nach dem Lesen der Datei. */}
                    <h4
                      id={vorschauId}
                      ref={vorschauKopfRef}
                      tabIndex={-1}
                      className="m-0 text-base font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {t.vorschauVor}
                      {importPlan.datei}
                      {t.vorschauNach}
                    </h4>
                    <p className="m-0 text-sm text-ink">
                      {importPlan.anlegen.length > 0
                        ? t.vorschauSatz(
                            importPlan.anlegen.length,
                            kinderWort(importPlan.anlegen.length, sprache),
                            cls.name,
                          )
                        : t.vorschauKeiner}{" "}
                      {t.escape}
                    </p>
                    {/* ★ 13.09.2026: Vorlage einer anderen Klasse - sichtbar, sperrt nichts. */}
                    {importPlan.hinweisKlasse && (
                      <p className="m-0 rounded-lg border border-hairline bg-surface-raised px-2 py-1 text-sm text-ink">
                        {importPlan.hinweisKlasse}
                      </p>
                    )}
                    {importPlan.anlegen.length > 0 && (
                      <ul className="m-0 list-none space-y-1 p-0">
                        {importPlan.anlegen.map((k) => (
                          <li
                            key={k.zeile}
                            className="rounded-lg border border-hairline bg-surface-raised px-2 py-1 text-sm text-ink"
                          >
                            <span className="font-medium">{k.name}</span>
                            {t.passwortPunkt}{" "}
                            <span className="font-legible">{k.passwort}</span>
                            {k.passwortErzeugt && t.passwortErzeugt}
                            {mitTastenflowKlasse && (
                              <>
                                {t.tastenflowPunkt}{" "}
                                {k.startLabel}
                                {k.startVorgabe && (cls.startUnits ? t.startDerKlasse : t.vorgabe)}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {importPlan.abgelehnt.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="m-0 text-sm font-semibold text-ink">
                          {t.abgelehntKopf(importPlan.abgelehnt.length)}
                        </h5>
                        <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-ink">
                          {importPlan.abgelehnt.map((a) => (
                            <li key={a.zeile}>{abgelehntSatzIn(a, sprache)}</li>
                          ))}
                        </ul>
                        <p className="m-0 text-sm text-ink-muted">{t.korrigieren}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* ★ R5: `aria-disabled` statt `disabled` - bei 0 Kindern
                          und während des Anlegens. Die Sperre nennt ihren Grund
                          (`onImportAnlegen`). */}
                      <Tipp text={t.anlegenTippImport} ausrichtung="links">
                        {(hinweisId) => (
                          <button
                            type="button"
                            className="btn-primary aria-disabled:opacity-40"
                            aria-disabled={importPlan.anlegen.length === 0 || busy}
                            aria-describedby={hinweisId}
                            onClick={() => void onImportAnlegen()}
                          >
                            {t.anlegenKnopf(importPlan.anlegen.length)}
                          </button>
                        )}
                      </Tipp>
                      <Tipp text={t.verwerfenTipp} ausrichtung="links">
                        {(hinweisId) => (
                          <button
                            type="button"
                            className="btn-secondary aria-disabled:opacity-40"
                            aria-disabled={busy}
                            aria-describedby={hinweisId}
                            onClick={onImportAbbrechen}
                          >
                            {t.abbrechen}
                          </button>
                        )}
                      </Tipp>
                    </div>
                    {importFortschritt && (
                      <p className="m-0 text-sm text-ink">{importFortschritt}</p>
                    )}
                  </section>
                )}
              </Aufklappen>
            </div>

            {pupils.length === 0 ? (
              <p role="status" aria-live="polite" className="m-0 text-sm text-ink-muted">
                {t.nochKeine}
              </p>
            ) : (
              <ul className="m-0 list-none space-y-2 p-0">
                {pupils.map((p) => (
                  <PupilZeile
                    key={p.id}
                    pupil={p}
                    onDelete={() => onDeletePupil(p)}
                    onResetPassword={(pw) => onResetPupilPassword(p.id, pw)}
                    onVerschieben={(code) => onMovePupil(p, code)}
                    onSetContactEmail={(email) => onSetPupilContactEmail(p.id, email)}
                  />
                ))}
              </ul>
            )}
            {/* Die Bestätigung nach dem Verschieben - SICHTBAR. Keine
                Live-Region: die Statuszeile oben sagt es der Sprachausgabe
                schon, zweimal wäre eine doppelte Blitzmeldung. */}
            {verschoben && (
              <p className="m-0 rounded-lg bg-success-soft p-2 text-sm text-ink">{verschoben}</p>
            )}
          </div>
        </>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm text-ink">
          {fehler.eigen ? error : <ServerMeldung text={error} />}
        </p>
      )}
    </div>
  );
}

/**
 * Eine Kind-Zeile: Name + aufklappbares Passwort-Zurücksetzen + aufklappbares
 * Verschieben + Löschen.
 */
function PupilZeile({
  pupil,
  onDelete,
  onResetPassword,
  onVerschieben,
  onSetContactEmail,
}: {
  pupil: TypingAccount;
  onDelete: () => void;
  onResetPassword: (pw: string) => Promise<Result<true>>;
  /** Zum Server; bei Erfolg verschwindet die Zeile, den Fokus führt die Liste. */
  onVerschieben: (zielCode: string) => Promise<Result<KindVerschoben>>;
  /** Kontakt-E-Mail setzen/ändern/löschen (14.09.2026) - siehe `Tipp`-Text unten. */
  onSetContactEmail: (email: string) => Promise<Result<true>>;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [open, setOpen] = useState(false);
  const [verschiebenOffen, setVerschiebenOffen] = useState(false);
  const [zielCode, setZielCode] = useState("");
  /*
   * ★ EN6b: wie die Fehlerzeile des Bereichs - EIGENE Sätze stehen schon in
   * der Bedienungssprache, Server-Sätze übersetzt `ServerMeldung`.
   */
  const [meldungStand, setMeldungStand] = useState<{ text: string; eigen: boolean }>({
    text: "",
    eigen: false,
  });
  const meldung = meldungStand.text;
  const setMeldung = (text: string) => setMeldungStand({ text, eigen: true });
  const setServerMeldung = (text: string) => setMeldungStand({ text, eigen: false });
  const [verschiebt, setVerschiebt] = useState(false);
  const verschiebenKnopfRef = useRef<HTMLButtonElement>(null);
  const zielRef = useRef<HTMLInputElement>(null);
  const zielId = useId();
  const [emailOffen, setEmailOffen] = useState(false);
  const [emailDraft, setEmailDraft] = useState(pupil.contactEmail ?? "");
  const [emailMeldung, setEmailMeldung] = useState("");
  const [emailSpeichert, setEmailSpeichert] = useState(false);
  const emailKnopfRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const emailId = useId();

  /** Fokus im NÄCHSTEN TAKT - erst dann gibt es das Feld bzw. den Schalter. */
  const fokus = (ziel: React.RefObject<HTMLElement>) =>
    window.setTimeout(() => ziel.current?.focus(), 0);

  const schliesseVerschieben = () => {
    setVerschiebenOffen(false);
    setZielCode("");
    setMeldung("");
    fokus(verschiebenKnopfRef);
  };

  const schliesseEmail = () => {
    setEmailOffen(false);
    setEmailDraft(pupil.contactEmail ?? "");
    setEmailMeldung("");
    fokus(emailKnopfRef);
  };

  /**
   * Kontakt-E-Mail speichern (14.09.2026) - leer lassen ist gültig und
   * schaltet die Passwort-Mail für dieses Kind wieder ab.
   */
  const speichereEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSpeichert) {
      setEmailMeldung(t.nochSpeichern);
      return;
    }
    const wert = emailDraft.trim();
    if (wert && !wert.includes("@")) {
      setEmailMeldung(t.emailFalsch);
      fokus(emailRef);
      return;
    }
    setEmailSpeichert(true);
    setEmailMeldung(t.wirdGespeichert);
    const r = await onSetContactEmail(wert);
    setEmailSpeichert(false);
    if (r.ok) {
      setEmailMeldung(wert ? t.kontaktGespeichert : t.kontaktEntfernt);
    } else {
      // Ein Satz vom Server - in der Bedienungssprache (`serverMeldungen.ts`).
      setEmailMeldung(serverMeldung(r.error, sprache).text);
      fokus(emailRef);
    }
  };

  /**
   * ★★★ „In andere Klasse verschieben" (10.09.2026, Wunsch Johannes).
   * Die Rückfrage nennt die FOLGEN, nicht nur die Handlung: Wer ein Kind in
   * die Klasse einer anderen Lehrkraft schiebt, gibt dieser den Lernstand des
   * Kindes - das soll niemand erst hinterher merken.
   * Nichts wird `disabled` (R5): Solange das Verschieben läuft, sagt die Zeile,
   * warum ein zweiter Druck nichts tut.
   */
  const verschieben = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verschiebt) {
      setMeldung(t.verschiebenLaeuft);
      return;
    }
    const code = zielCode.trim().toUpperCase();
    if (!code) {
      setMeldung(t.zielFehlt);
      fokus(zielRef);
      return;
    }
    const ja = window.confirm(t.verschiebenFrage(pupil.name, code, pruefungWort(sprache)));
    if (!ja) {
      setMeldung(t.nichtsVerschoben);
      fokus(zielRef);
      return;
    }
    setVerschiebt(true);
    setMeldung(t.wirdVerschoben);
    const r = await onVerschieben(code);
    setVerschiebt(false);
    if (!r.ok) {
      setServerMeldung(r.error);
      fokus(zielRef);
    }
    // Bei Erfolg verschwindet diese Zeile; die Liste darüber sagt, wohin.
  };

  return (
    <li className="rounded-lg border border-hairline px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-ink">{pupil.name}</span>
        <div className="flex flex-wrap gap-2">
          {/* `unterdruecken={open}`: Aufgeklappt stünde der Hinweis über dem
              Passwort-Feld, das gerade erscheint. */}
          <Tipp text={t.passwortTipp(pupil.name)} unterdruecken={open}>
            {(hinweisId) => (
              <button
                type="button"
                className="btn-secondary btn-toggle"
                aria-expanded={open}
                aria-describedby={hinweisId}
                onClick={() => setOpen((o) => !o)}
              >
                {t.passwortAendern}
              </button>
            )}
          </Tipp>
          <Tipp text={t.kontaktKnopfTipp(pupil.name)} unterdruecken={emailOffen}>
            {(hinweisId) => (
              <button
                ref={emailKnopfRef}
                type="button"
                className="btn-secondary btn-toggle"
                aria-expanded={emailOffen}
                aria-label={t.kontaktKnopfName(pupil.name)}
                aria-describedby={hinweisId}
                onClick={() => {
                  if (emailOffen) {
                    schliesseEmail();
                  } else {
                    setEmailOffen(true);
                    fokus(emailRef);
                  }
                }}
              >
                {t.kontaktKnopf}
                {pupil.contactEmail ? " ✓" : ""}
              </button>
            )}
          </Tipp>
          <Tipp text={t.verschiebenTipp(pupil.name)} unterdruecken={verschiebenOffen}>
            {(hinweisId) => (
              <button
                ref={verschiebenKnopfRef}
                type="button"
                className="btn-secondary btn-toggle"
                aria-expanded={verschiebenOffen}
                // Der sichtbare Wortlaut steht VORN im Namen (WCAG 2.5.3), der
                // Name des Kindes dahinter - sonst hiessen alle Zeilen gleich.
                aria-label={t.verschiebenName(pupil.name)}
                aria-describedby={hinweisId}
                onClick={() => {
                  if (verschiebenOffen) {
                    schliesseVerschieben();
                  } else {
                    setVerschiebenOffen(true);
                    fokus(zielRef);
                  }
                }}
              >
                {t.verschiebenKnopf}
              </button>
            )}
          </Tipp>
          <Tipp text={t.loeschenKindTipp(pupil.name)}>
            {(hinweisId) => (
              <button
                type="button"
                className="btn-ghost btn-toggle text-danger"
                onClick={onDelete}
                aria-label={t.loeschenKindName(pupil.name)}
                aria-describedby={hinweisId}
              >
                <span aria-hidden="true">🗑</span>
                {t.loeschenKnopf}
              </button>
            )}
          </Tipp>
        </div>
      </div>
      {/* ★ 19.09.2026: Die drei Formulare einer Kind-Zeile klappen SICHTBAR
          auf und zu (`Aufklappen`, Johannes: „der Rest rutscht nach unten und
          der andere kommt nach") - die Kinder darunter gleiten mit. */}
      <Aufklappen offen={open}>
        <div className="mt-2">
          <ResetPupilPasswordForm
            pupilName={pupil.name}
            onReset={onResetPassword}
          />
        </div>
      </Aufklappen>
      <Aufklappen offen={emailOffen}>
        <form
          onSubmit={speichereEmail}
          onKeyDown={(e) => {
            // Escape schliesst und führt auf den Schalter zurück (R3).
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              schliesseEmail();
            }
          }}
          className="mt-2 space-y-2 rounded-lg border border-hairline bg-surface-sunken p-2"
        >
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[14rem] flex-1">
              <label className="field-label" htmlFor={emailId}>
                {t.kontaktVon}
                {pupil.name}
              </label>
              <input
                id={emailId}
                ref={emailRef}
                type="email"
                className="field-input"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder={t.kontaktLeer}
                autoComplete="off"
              />
            </div>
            <Tipp text={t.kontaktSpeichernTipp(pupil.name)} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="submit"
                  className="btn-primary aria-disabled:opacity-40"
                  aria-disabled={emailSpeichert}
                  aria-describedby={hinweisId}
                >
                  {t.speichern}
                </button>
              )}
            </Tipp>
            <Tipp text={t.schliessenTipp} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-secondary"
                  aria-describedby={hinweisId}
                  onClick={schliesseEmail}
                >
                  {t.abbrechen}
                </button>
              )}
            </Tipp>
          </div>
          <p role="status" aria-live="polite" className="m-0 min-h-5 text-sm text-ink">
            {emailMeldung}
          </p>
        </form>
      </Aufklappen>
      <Aufklappen offen={verschiebenOffen}>
        <form
          onSubmit={verschieben}
          onKeyDown={(e) => {
            // Escape schliesst und führt auf den Schalter zurück (R3).
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              schliesseVerschieben();
            }
          }}
          className="mt-2 space-y-2 rounded-lg border border-hairline bg-surface-sunken p-2"
        >
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[10rem]">
              <label className="field-label" htmlFor={zielId}>
                {t.codeNeueKlasse}
              </label>
              {/* ★ E12 (19.09.2026): der Satz zu den FOLGEN des Verschiebens
                  hing bis dahin als eigener, immer sichtbarer Absatz unter
                  dem Feld - jetzt an ihm selbst (`Tipp`). */}
              <Tipp
                text={t.folgenTipp(pupil.name, pruefungWort(sprache))}
                className="w-full"
              >
                {(hinweisId) => (
                  <input
                    id={zielId}
                    ref={zielRef}
                    className="field-input uppercase"
                    value={zielCode}
                    onChange={(e) => setZielCode(e.target.value.toUpperCase())}
                    placeholder={t.zielBeispiel}
                    autoComplete="off"
                    aria-describedby={hinweisId}
                  />
                )}
              </Tipp>
            </div>
            <Tipp text={t.verschiebeTipp(pupil.name)} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="submit"
                  className="btn-primary aria-disabled:opacity-40"
                  aria-disabled={verschiebt}
                  aria-describedby={hinweisId}
                >
                  {t.verschieben}
                </button>
              )}
            </Tipp>
            <Tipp text={t.nichtVerschiebenTipp} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="button"
                  className="btn-secondary"
                  aria-describedby={hinweisId}
                  onClick={schliesseVerschieben}
                >
                  {t.abbrechen}
                </button>
              )}
            </Tipp>
          </div>
          {/* Die Statuszeile ist IMMER da - eine Live-Region, die erst mit
              ihrem Text entsteht, sagen manche Sprachausgaben nicht an. */}
          <p role="status" aria-live="polite" className="m-0 min-h-5 text-sm text-ink">
            {meldungStand.eigen ? meldung : <ServerMeldung text={meldung} />}
          </p>
        </form>
      </Aufklappen>
    </li>
  );
}
