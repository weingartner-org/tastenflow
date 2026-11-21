/**
 * ★★★ KINDER EINER KLASSE AUS EXCEL ANLEGEN (12.09.2026, Auftrag Johannes;
 * Vorlage neu gestaltet 13.09.2026).
 *
 * Die reine Logik hinter „Vorlage herunterladen (Excel)" und „Kinder aus Excel
 * importieren" im Bereich „Kinder und Zugänge" (`KlasseUndKinder.tsx`) - ohne
 * React, damit jeder Fall einzeln prüfbar ist
 * (`tests/tastenflow-kinder-import.test.ts`).
 *
 * Johannes' Entscheidungen (12.09.2026, verbindlich):
 *  1. Die Vorlage legt NUR KINDER an, und zwar in der gerade gewählten Klasse.
 *     Keine Klassen-Spalten.
 *  2. Spalten: Name · Passwort · Tastenflow: womit anfangen? · E-Mail
 *     (optional, seit 14.09.2026 - Kind bekommt das Passwort automatisch
 *     zugeschickt, wenn hier eine Adresse steht).
 *  3. Leeres Passwort ⇒ die App erzeugt ein leicht tippbares Passwort. Nach dem
 *     Import stehen ALLE importierten Kinder in „Zugangsdaten drucken".
 *
 * ★★★ 13.09.2026, Johannes: *„Bitte oben immer den Klassennamen und das Datum
 * als Überschrift einfügen. Gestalte die Tabelle ansprechend zur App passend.
 * Die Zelle Womit anfangen kann nicht ausgefüllt werden, da ja niemand den
 * genauen Wortlaut kennt. Wir brauchen eine Auswahlliste in den Zellen in der
 * Spalte C, und wir brauchen oben in der Tabelle eine Funktion ‚Womit anfangen
 * (Auswahl) für alle übernehmen'."*
 *
 * Darum, seit 13.09.2026:
 *  · Die Vorlage wird mit exceljs GESCHRIEBEN (Farben, Zeichen, Auswahllisten -
 *    siehe `excelMarke.ts`). GELESEN wird sie weiter mit SheetJS.
 *  · Oben ein Kasten „für alle übernehmen" mit EINER Auswahlzelle, vorbelegt
 *    mit dem Startniveau der Klasse. Jede Zelle in Spalte C trägt eine
 *    Auswahlliste UND die Formel „nimm den Wert von oben". Wer in einer Zeile
 *    etwas anderes wählt, überschreibt die Formel - genau so gewollt.
 *  · Eine Zeile ist nur dann ein Kind, wenn Name ODER Passwort gefüllt ist:
 *    Die 40 vorbereiteten Zeilen tragen alle einen Wert in Spalte C.
 *
 * ★★★ 18.10.2026, Johannes: *„beim Import von Schülern (Excel) ist die Frage
 * nach dem Tastenflow-Startniveau - mach die Anmeldung programmneutraler."*
 * Darum gibt es die Vorlage in ZWEI Fassungen (`VorlageKlasse.mitStart`):
 *  · mit Tastenflow (Vorgabe, wie bisher): Name · Passwort · Startniveau · E-Mail;
 *  · OHNE Tastenflow: Name · Passwort · E-Mail - kein Kasten „für alle
 *    übernehmen", keine Auswahlzellen, im Hinweisblatt keine Liste der
 *    Startniveaus. Ihre Sätze stehen NUR deutsch (`OHNE_START_DE`): Ausserhalb
 *    von Deutsch gibt es in „Meine Klassen" nur Tastenflow
 *    (`programmInSprache`), die Fassung ohne Start wird dort nie gewählt.
 * ⚠️ GELESEN wird beides gleich: Die Kopfzeile wird an den Spaltennamen erkannt,
 * eine fehlende Startspalte heisst „Vorgabe der Klasse" (`leseKinderXlsx`).
 *
 * ★ SheetJS und exceljs kommen immer per `await import` - beide bleiben aus dem
 *   Hauptbündel.
 *
 * ★★ EN6b (19.09.2026): DIE VORLAGE AUCH ENGLISCH. Wer „Meine Klassen" auf
 * Englisch bedient, lädt eine englische Vorlage herunter (Blätter „Pupils",
 * „Notes", Spalten „Name · Password · Tastenflow: where to start? · Email
 * (optional)", die Startniveaus mit ihren englischen Namen) und liest die
 * Gründe der Vorschau englisch. Jede Funktion nimmt dafür `sprache` (Vorgabe
 * „de" - ohne Angabe genau die Datei und die Sätze von vorher).
 * ⚠️ GELESEN wird jede Vorlage in JEDER Sprache: Die Kopfzeile wird an
 * deutschen UND englischen Spaltennamen erkannt, ein Startniveau an seinem
 * deutschen UND englischen Namen - eine Vorlage, die eine Kollegin in der
 * anderen Sprache heruntergeladen hat, bleibt brauchbar.
 */
import type { StartPoint } from "@/lib/typing/letters";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import type { AktiveBedienSprache } from "@/lib/bedienSprache/sprache";
import { GEBIET, mehrzahl, texte } from "@/lib/bedienSprache/texte";
import { minPasswortLaenge } from "@/lib/lernwerkstatt/passwort";
import { synthEmail } from "@/lib/typing/pbBackend";
// ★ O-TR (02.10.2026): türkische Köpfe klein nach dem Gebietsschema (i/İ, ı/I).
import { istGeruestSprache, kleinFuer } from "@/lib/typing/sprachRegister";
import {
  FARBE,
  argb,
  dateiHerunterladen,
  dateisystemName,
  datumDeutsch,
  datumIso,
  flaeche,
  klassenBezeichnung,
  linienRundum,
  mappeAlsBytes,
  neueMappe,
  schrift,
  setzeMarkenKopf,
  zeilenHoehe,
  type Blatt,
  type Mappe,
} from "@/lib/typing/excelMarke";
// ★ E1 (24.09.2026): der Lernweg der Klasse (Bauplan englischer Lehrgang §2.2).
import { lernwegVon, type Lernweg } from "@/lib/typing/lernweg";

/** Die vier Spalten der Vorlage - in dieser Reihenfolge. */
export const KOPF_NAME = "Name";
export const KOPF_PASSWORT = "Passwort";
/** Dasselbe Wort wie am Feld „Tastenflow: womit anfangen?" im Formular. */
export const KOPF_START = "Tastenflow: womit anfangen?";
/** Optional (14.09.2026) - löst bei Ausfüllung die Passwort-Mail aus. */
export const KOPF_EMAIL = "E-Mail (optional)";
export const VORLAGE_KOPF = [KOPF_NAME, KOPF_PASSWORT, KOPF_START, KOPF_EMAIL] as const;

/** ★ 14.09.2026: „Teilnehmer" statt „Kinder" - auch der Blattname und der
 * Dateiname, nicht nur die Knöpfe in der Oberfläche (Wunsch Johannes: „in der
 * liste soll auch nicht kinder stehen"). */
export const BLATT_KINDER = "Teilnehmer";
export const BLATT_HINWEISE = "Hinweise";
/** Ausgeblendet: die Liste hinter den Auswahlzellen. */
export const BLATT_LISTEN = "Listen";

/**
 * ★ Wo im Blatt „Teilnehmer" was steht (Excel-Zeilen, 1-basiert). Zeilen 1 bis 3
 * sind der Kopf mit dem Zeichen (`setzeMarkenKopf`).
 */
export const VORLAGE = {
  fuerAlleZeile: 5,
  hinweisZeile: 6,
  kopfZeile: 8,
  ersteKindZeile: 9,
  /** So viele Zeilen sind vorbereitet - mit Zebra, Linien, Auswahl und Formel. */
  kinderZeilen: 40,
} as const;
/** Die EINE Auswahlzelle „für alle übernehmen". */
export const FUER_ALLE_ZELLE = `C${VORLAGE.fuerAlleZeile}`;
/** Der Text links neben ihr - am Wort „für alle" erkennt `leseKinderXlsx` sie. */
export const FUER_ALLE_TEXT = "Womit anfangen - für alle übernehmen:";
export const FUER_ALLE_SATZ =
  "Gilt für jeden Teilnehmer, bei dem Sie in Spalte C nichts anderes wählen. Die Auswahlliste öffnet sich mit Alt + Pfeil nach unten (am Mac: Wahltaste + Pfeil nach unten). Spalte „Passwort“ leer lassen: Das Programm erstellt automatisch eines.";
/** In jeder C-Zelle: „nimm den Wert von oben". */
export const FUER_ALLE_FORMEL = `IF($C$${VORLAGE.fuerAlleZeile}="","",$C$${VORLAGE.fuerAlleZeile})`;
/** Die Meldung der Datenüberprüfung, wenn etwas anderes eingetippt wird. */
export const AUSWAHL_FEHLER = "Bitte wählen Sie ein Startniveau aus der Liste.";

/** Der Teil der Überschrift nach dem Klassennamen. */
export const VORLAGE_TITEL_ZUSATZ = "Teilnehmer anlegen";

// ── EN6b: die englischen Zwillinge (Glossar §3.8: Teilnehmer ⇒ *pupil*) ─────
export const BLATT_KINDER_EN = "Pupils";
export const BLATT_HINWEISE_EN = "Notes";
export const BLATT_LISTEN_EN = "Lists";
export const KOPF_PASSWORT_EN = "Password";
/** Dasselbe Wort wie am Feld „Tastenflow: where to start?" (Glossar §3.15). */
export const KOPF_START_EN = "Tastenflow: where to start?";
export const KOPF_EMAIL_EN = "Email (optional)";
export const FUER_ALLE_TEXT_EN = "Where to start - apply to everyone:";
export const VORLAGE_TITEL_ZUSATZ_EN = "Add pupils";

// ── E11a: die französischen Zwillinge (Glossar §9.2: Teilnehmer ⇒ élève) ────
export const BLATT_KINDER_FR = "Élèves";
export const BLATT_HINWEISE_FR = "Remarques";
export const BLATT_LISTEN_FR = "Listes";
export const KOPF_PASSWORT_FR = "Mot de passe";
export const KOPF_START_FR = "Tastenflow : par où commencer ?";
export const KOPF_EMAIL_FR = "E-mail (facultatif)";
export const FUER_ALLE_TEXT_FR = "Par où commencer - appliquer à tous :";
export const VORLAGE_TITEL_ZUSATZ_FR = "Ajouter des élèves";

// ── ES-O (27.09.2026): die spanischen Zwillinge (Teilnehmer ⇒ participante) ─
export const BLATT_KINDER_ES = "Participantes";
export const BLATT_HINWEISE_ES = "Indicaciones";
export const BLATT_LISTEN_ES = "Listas";
export const KOPF_NAME_ES = "Nombre";
export const KOPF_PASSWORT_ES = "Contraseña";
export const KOPF_START_ES = "Tastenflow: ¿por dónde empezar?";
export const KOPF_EMAIL_ES = "Correo electrónico (opcional)";
export const FUER_ALLE_TEXT_ES = "Por dónde empezar - aplicar a todos:";
export const VORLAGE_TITEL_ZUSATZ_ES = "Añadir participantes";

// ── O-PL (02.10.2026): die polnischen Zwillinge (Teilnehmer ⇒ uczniowie, Glossar §2.5/§2.6) ─
export const BLATT_KINDER_PL = "Uczniowie";
export const BLATT_HINWEISE_PL = "Instrukcja";
export const BLATT_LISTEN_PL = "Listy";
export const KOPF_NAME_PL = "Imię";
export const KOPF_PASSWORT_PL = "Hasło";
export const KOPF_START_PL = "Tastenflow: od czego zacząć?";
export const KOPF_EMAIL_PL = "E-mail (nieobowiązkowo)";
export const FUER_ALLE_TEXT_PL = "Od czego zacząć - dla wszystkich:";
export const VORLAGE_TITEL_ZUSATZ_PL = "Dodaj uczniów";

// ── O-TR (02.10.2026): die türkischen Zwillinge (Teilnehmer ⇒ öğrenciler, Glossar §2.5/§2.6) ─
export const BLATT_KINDER_TR = "Öğrenciler";
export const BLATT_HINWEISE_TR = "Açıklamalar";
export const BLATT_LISTEN_TR = "Listeler";
export const KOPF_NAME_TR = "Ad";
export const KOPF_PASSWORT_TR = "Şifre";
export const KOPF_START_TR = "Tastenflow: nereden başlansın?";
export const KOPF_EMAIL_TR = "E-posta (isteğe bağlı)";
export const FUER_ALLE_TEXT_TR = "Nereden başlansın - herkese uygula:";
export const VORLAGE_TITEL_ZUSATZ_TR = "Öğrenci ekle";

// ── O-CS (03.10.2026): die tschechischen Zwillinge (Teilnehmer ⇒ žáci, Spalte „Jméno", Glossar §2.5/§2.6) ─
export const BLATT_KINDER_CS = "Žáci";
export const BLATT_HINWEISE_CS = "Pokyny";
export const BLATT_LISTEN_CS = "Seznamy";
export const KOPF_NAME_CS = "Jméno";
export const KOPF_PASSWORT_CS = "Heslo";
export const KOPF_START_CS = "Tastenflow: kde začít?";
export const KOPF_EMAIL_CS = "E-mail (nepovinné)";
export const FUER_ALLE_TEXT_CS = "Kde začít - pro všechny:";
export const VORLAGE_TITEL_ZUSATZ_CS = "Přidat žáky";

// ── O-IT (02.10.2026): die italienischen Zwillinge (Teilnehmer ⇒ alunni, Glossar §2.5) ─
export const BLATT_KINDER_IT = "Alunni";
export const BLATT_HINWEISE_IT = "Istruzioni";
export const BLATT_LISTEN_IT = "Elenchi";
export const KOPF_NAME_IT = "Nome";
export const KOPF_PASSWORT_IT = "Password";
export const KOPF_START_IT = "Tastenflow: da dove iniziare?";
export const KOPF_EMAIL_IT = "Email (facoltativa)";
export const FUER_ALLE_TEXT_IT = "Da dove iniziare - applica a tutti:";
export const VORLAGE_TITEL_ZUSATZ_IT = "Aggiungere alunni";

/**
 * ★★★ 18.10.2026: die Sätze der Vorlage OHNE Startniveau-Spalte - nur Deutsch
 * (siehe Dateikopf). Alles andere (Kopf der Spalten, Blattnamen, Prüfgründe)
 * kommt unverändert aus `VORLAGE_TEXTE`.
 */
const OHNE_START_DE = {
  /** Der Satz unter dem Titel, an Stelle von „für alle übernehmen". */
  hinweisSatz:
    "Spalte „Passwort“ leer lassen: Das Programm erstellt automatisch eines. Die E-Mail-Adresse ist freiwillig.",
  schritt3:
    "3. Speichern Sie die Datei. Wählen Sie dann in „Meine Klassen“ im Bereich „Lernende“ den Schalter „Teilnehmer aus Excel importieren“. Die Teilnehmer kommen in die Klasse, die dort gewählt ist. Vor dem Anlegen zeigt das Programm eine Vorschau.",
} as const;

// Bulgarische Zwillinge (Teilnehmer = ученици, Spalte Име, Glossar bg §2.5/§2.12)
export const BLATT_KINDER_BG = "Ученици";
export const BLATT_HINWEISE_BG = "Указания";
export const BLATT_LISTEN_BG = "Списъци";
export const KOPF_NAME_BG = "Име";
export const KOPF_PASSWORT_BG = "Парола";
export const KOPF_START_BG = "Tastenflow: откъде да започне?";
export const KOPF_EMAIL_BG = "Имейл (по желание)";
export const FUER_ALLE_TEXT_BG = "Откъде да започне - за всички:";
export const VORLAGE_TITEL_ZUSATZ_BG = "Добави ученици";

// Griechische Namen der Vorlage (Blätter höchstens 31 Zeichen, ohne : \ / ? * [ ]).
export const BLATT_KINDER_EL = "Μαθητές";
export const BLATT_HINWEISE_EL = "Οδηγίες";
export const BLATT_LISTEN_EL = "Λίστες";
export const KOPF_NAME_EL = "Όνομα";
export const KOPF_PASSWORT_EL = "Κωδικός πρόσβασης";
export const KOPF_START_EL = "Tastenflow: σημείο εκκίνησης";
export const KOPF_EMAIL_EL = "E-mail (προαιρετικό)";
export const FUER_ALLE_TEXT_EL = "Σημείο εκκίνησης - για όλους:";
export const VORLAGE_TITEL_ZUSATZ_EL = "Προσθήκη μαθητών";

export const BLATT_KINDER_HU = "Tanulók";
export const BLATT_HINWEISE_HU = "Útmutató";
export const BLATT_LISTEN_HU = "Listák";
export const KOPF_NAME_HU = "Név";
export const KOPF_PASSWORT_HU = "Jelszó";
export const KOPF_START_HU = "Tastenflow: honnan induljon?";
export const KOPF_EMAIL_HU = "E-mail (nem kötelező)";
export const FUER_ALLE_TEXT_HU = "Honnan induljon - mindenkinek:";
export const VORLAGE_TITEL_ZUSATZ_HU = "Tanulók felvétele";

export const BLATT_KINDER_NL = "Leerlingen";
export const BLATT_HINWEISE_NL = "Uitleg";
export const BLATT_LISTEN_NL = "Lijsten";
export const KOPF_NAME_NL = "Naam";
export const KOPF_PASSWORT_NL = "Wachtwoord";
export const KOPF_START_NL = "Tastenflow: waar beginnen?";
export const KOPF_EMAIL_NL = "E-mail (optioneel)";
export const FUER_ALLE_TEXT_NL = "Waar beginnen - voor iedereen:";
export const VORLAGE_TITEL_ZUSATZ_NL = "Leerlingen toevoegen";

export const BLATT_KINDER_PT = "Estudantes";
export const BLATT_HINWEISE_PT = "Instruções";
export const BLATT_LISTEN_PT = "Listas";
export const KOPF_NAME_PT = "Nome";
export const KOPF_PASSWORT_PT = "Palavra-passe";
export const KOPF_START_PT = "Tastenflow: por onde começar?";
export const KOPF_EMAIL_PT = "E-mail (opcional)";
export const FUER_ALLE_TEXT_PT = "Por onde começar - para todas as pessoas:";
export const VORLAGE_TITEL_ZUSATZ_PT = "Adicionar estudantes";

export const BLATT_KINDER_BR = "Estudantes";
export const BLATT_HINWEISE_BR = "Instruções";
export const BLATT_LISTEN_BR = "Listas";
export const KOPF_NAME_BR = "Nome";
export const KOPF_PASSWORT_BR = "Senha";
export const KOPF_START_BR = "Tastenflow: por onde começar?";
export const KOPF_EMAIL_BR = "E-mail (opcional)";
export const FUER_ALLE_TEXT_BR = "Por onde começar - para todas as pessoas:";
export const VORLAGE_TITEL_ZUSATZ_BR = "Adicionar estudantes";

export const BLATT_KINDER_RO = "Elevi";
export const BLATT_HINWEISE_RO = "Instrucțiuni";
export const BLATT_LISTEN_RO = "Liste";
export const KOPF_NAME_RO = "Nume";
export const KOPF_PASSWORT_RO = "Parolă";
export const KOPF_START_RO = "Tastenflow: de unde începe?";
export const KOPF_EMAIL_RO = "E-mail (opțional)";
export const FUER_ALLE_TEXT_RO = "De unde începe - pentru toți:";
export const VORLAGE_TITEL_ZUSATZ_RO = "Adăugați elevi";

export const BLATT_KINDER_SV = "Elever";
export const BLATT_HINWEISE_SV = "Anvisningar";
export const BLATT_LISTEN_SV = "Listor";
export const KOPF_NAME_SV = "Namn";
export const KOPF_PASSWORT_SV = "Lösenord";
export const KOPF_START_SV = "Tastenflow: var vill du börja?";
export const KOPF_EMAIL_SV = "E-post (valfritt)";
export const FUER_ALLE_TEXT_SV = "Var vill du börja - för alla:";
export const VORLAGE_TITEL_ZUSATZ_SV = "Lägg till elever";

export const BLATT_KINDER_UK = "Учні";
export const BLATT_HINWEISE_UK = "Вказівки";
export const BLATT_LISTEN_UK = "Списки";
export const KOPF_NAME_UK = "Ім'я";
export const KOPF_PASSWORT_UK = "Пароль";
export const KOPF_START_UK = "Tastenflow: з чого почати?";
export const KOPF_EMAIL_UK = "Електронна пошта (необов'язково)";
export const FUER_ALLE_TEXT_UK = "З чого почати - для всіх:";
export const VORLAGE_TITEL_ZUSATZ_UK = "Додати учнів";

/**
 * ★ Alle Sätze der Vorlage und der Prüfung in beiden Sprachen. Deutsch sind es
 * genau die Konstanten oben bzw. die Sätze von vorher.
 */
const VORLAGE_TEXTE = texte({
  de: {
    blattKinder: BLATT_KINDER,
    blattHinweise: BLATT_HINWEISE,
    blattListen: BLATT_LISTEN,
    kopfName: KOPF_NAME,
    kopfPasswort: KOPF_PASSWORT,
    kopfStart: KOPF_START,
    kopfEmail: KOPF_EMAIL,
    fuerAlleText: FUER_ALLE_TEXT,
    fuerAlleSatz: FUER_ALLE_SATZ,
    auswahlFehler: AUSWAHL_FEHLER,
    auswahlTitel: "Startniveau",
    titelZusatz: VORLAGE_TITEL_ZUSATZ,
    datei: "Teilnehmer-Vorlage",
    stand: (datum: string) => `Stand: ${datum}`,
    soAusfuellen: "So füllen Sie die Vorlage aus",
    soGehtEs: "So geht es",
    dieSpalten: "Die Spalten",
    spalte: "Spalte",
    wasHinein: "Was hinein gehört",
    dieStartniveaus: "Die Startniveaus",
    nummer: "Nummer",
    startniveauInTastenflow: "Startniveau in Tastenflow",
    kurzwort: "Kurzwort",
    schritt1: (blatt: string) =>
      `1. Tragen Sie im Blatt „${blatt}“ je Teilnehmer eine Zeile ein: den Namen und, wenn Sie wollen, ein Passwort.`,
    schritt2:
      "2. Ein leeres Passwort erzeugt das Programm, zum Beispiel km482. Alle Passwörter stehen danach unter „Zugangsdaten drucken“.",
    schritt3:
      "3. Oben im Kasten „für alle übernehmen“ wählen Sie, womit die Teilnehmer in Tastenflow anfangen. Das gilt für jeden Teilnehmer, bei dem Sie in Spalte C nichts anderes wählen.",
    schritt4:
      "4. Soll ein Teilnehmer woanders anfangen, wählen Sie in seiner Zeile in Spalte C ein anderes Startniveau. Die Auswahlliste öffnet sich mit Alt + Pfeil nach unten (am Mac: Wahltaste + Pfeil nach unten).",
    schritt5:
      "5. Speichern Sie die Datei und wählen Sie in Tastenflow „Teilnehmer aus Excel importieren“. Die Teilnehmer kommen in die Klasse, die dort gewählt ist. Vor dem Anlegen zeigt das Programm eine Vorschau.",
    spalteName: "Der Name des Teilnehmers, mit dem er sich anmeldet. Jeder Name nur einmal je Klasse.",
    spaltePasswort: (min: number) =>
      `Mindestens ${min} Zeichen. Leer lassen: Das Programm erzeugt ein leicht tippbares Passwort.`,
    spalteStart:
      "Ist schon ausgefüllt - mit der Wahl aus dem Kasten „für alle übernehmen“. Wählen Sie nur dort etwas anderes, wo ein Teilnehmer woanders anfangen soll.",
    spalteEmail:
      "Leer lassen ist möglich. Steht hier eine Adresse, bekommt der Teilnehmer seine Zugangsdaten automatisch per Mail - beim Anlegen und bei jedem späteren Zurücksetzen.",
    nachsatz:
      "Statt eines Namens aus der Liste versteht das Programm auch die Nummer oder das Kurzwort - zum Beispiel aus einer eigenen Tabelle.",
    nichtLesbar:
      "Die Datei lässt sich nicht als Excel-Datei lesen. Bitte speichern Sie sie als Excel-Arbeitsmappe (.xlsx) und wählen Sie sie noch einmal.",
    blattLeer: (blatt: string) =>
      `Im Blatt „${blatt}“ steht nichts. Bitte tragen Sie die Teilnehmer unter der Kopfzeile ein.`,
    keinKopf: (name: string, passwort: string) =>
      `In der Datei fehlt die Kopfzeile mit „${name}“ und „${passwort}“. Bitte nehmen Sie die Vorlage („Vorlage herunterladen (Excel)“).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Die Datei trägt die Überschrift „${titel}“, gewählt ist aber „${klasse}“. Angelegt wird in der gewählten Klasse - bitte prüfen Sie, ob das so gewollt ist.`,
    startDerKlasse: "Startniveau der Klasse",
    nameFehlt: "Der Name fehlt.",
    passwortKurz: (min: number) => `Das Passwort hat weniger als ${min} Zeichen.`,
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `„${zelle}“ ist kein Startniveau. Möglich sind die Nummern 1 bis ${anzahl} aus dem Blatt „${blatt}“ - oder die Zelle leer lassen.`,
    keineEmail: (zelle: string) =>
      `„${zelle}“ sieht nicht wie eine E-Mail-Adresse aus - oder die Zelle leer lassen.`,
    nameSchonDa: "Diesen Namen gibt es in der Klasse schon.",
    nameDoppelt: (zeile: number) => `Der Name steht in der Datei schon in Zeile ${zeile}.`,
    zeile: (zeile: number) => `Zeile ${zeile}`,
  },
  en: {
    blattKinder: BLATT_KINDER_EN,
    blattHinweise: BLATT_HINWEISE_EN,
    blattListen: BLATT_LISTEN_EN,
    kopfName: KOPF_NAME,
    kopfPasswort: KOPF_PASSWORT_EN,
    kopfStart: KOPF_START_EN,
    kopfEmail: KOPF_EMAIL_EN,
    fuerAlleText: FUER_ALLE_TEXT_EN,
    fuerAlleSatz:
      "Applies to every pupil for whom you don't choose something else in column C. The drop-down list opens with Alt + down arrow (on a Mac: Option + down arrow). Leave the column “Password” empty: the app creates one automatically.",
    auswahlFehler: "Please choose a starting point from the list.",
    auswahlTitel: "Starting point",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_EN,
    datei: "Pupil-template",
    stand: (datum: string) => `As of ${datum}`,
    soAusfuellen: "How to fill in the template",
    soGehtEs: "How it works",
    // Das Deutsche sagt „drei" - es sind vier Spalten; englisch ohne Zahl.
    dieSpalten: "The columns",
    spalte: "Column",
    wasHinein: "What goes in it",
    dieStartniveaus: "The starting points",
    nummer: "Number",
    startniveauInTastenflow: "Starting point in Tastenflow",
    kurzwort: "Short word",
    schritt1: (blatt: string) =>
      `1. In the sheet “${blatt}”, fill in one row per pupil: their name and, if you like, a password.`,
    schritt2:
      "2. If the password is left empty, the app creates one, for example km482. All passwords then appear under “Print login details”.",
    schritt3:
      "3. At the top, in the box “apply to everyone”, choose where the pupils start in Tastenflow. It applies to every pupil for whom you don't choose something else in column C.",
    schritt4:
      "4. If a pupil should start somewhere else, choose a different starting point in column C of their row. The drop-down list opens with Alt + down arrow (on a Mac: Option + down arrow).",
    schritt5:
      "5. Save the file and, in Tastenflow, choose “Import pupils from Excel”. The pupils are added to the class that is selected there. The app shows a preview before anyone is added.",
    spalteName: "The pupil's name, which they use to sign in. Each name only once per class.",
    spaltePasswort: (min: number) =>
      `At least ${min} characters. Leave it empty: the app creates an easy-to-type password.`,
    spalteStart:
      "Already filled in - with the choice from the box “apply to everyone”. Only choose something else where a pupil should start somewhere else.",
    spalteEmail:
      "Can be left empty. If there is an address here, the pupil automatically gets their login details by email - when they are added and whenever the password is reset later.",
    nachsatz:
      "Instead of a name from the list, the app also understands the number or the short word - for example from a table of your own.",
    nichtLesbar:
      "The file can't be read as an Excel file. Please save it as an Excel workbook (.xlsx) and choose it again.",
    blattLeer: (blatt: string) =>
      `The sheet “${blatt}” is empty. Please fill in the pupils under the header row.`,
    keinKopf: (name: string, passwort: string) =>
      `The file has no header row with “${name}” and “${passwort}”. Please use the template (“Download template (Excel)”).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `The file has the heading “${titel}”, but the class selected is “${klasse}”. The pupils will be added to the selected class - please check that this is what you want.`,
    startDerKlasse: "the class's starting point",
    nameFehlt: "The name is missing.",
    passwortKurz: (min: number) => `The password has fewer than ${min} characters.`,
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `“${zelle}” is not a starting point. You can use the numbers 1 to ${anzahl} from the sheet “${blatt}” - or leave the cell empty.`,
    keineEmail: (zelle: string) =>
      `“${zelle}” doesn't look like an email address - or leave the cell empty.`,
    nameSchonDa: "There is already a pupil with this name in the class.",
    nameDoppelt: (zeile: number) => `This name is already in the file, in row ${zeile}.`,
    zeile: (zeile: number) => `Row ${zeile}`,
  },
  fr: {
    blattKinder: BLATT_KINDER_FR,
    blattHinweise: BLATT_HINWEISE_FR,
    blattListen: BLATT_LISTEN_FR,
    kopfName: KOPF_NAME,
    kopfPasswort: KOPF_PASSWORT_FR,
    kopfStart: KOPF_START_FR,
    kopfEmail: KOPF_EMAIL_FR,
    fuerAlleText: FUER_ALLE_TEXT_FR,
    fuerAlleSatz:
      'S\'applique à chaque élève pour qui vous ne choisissez rien d\'autre en colonne C. La liste déroulante s\'ouvre avec Alt + flèche bas (sur Mac : Option + flèche bas). Laissez la colonne "Mot de passe" vide : l\'application en crée un automatiquement.',
    auswahlFehler: "Merci de choisir un niveau de départ dans la liste.",
    auswahlTitel: "Niveau de départ",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_FR,
    datei: "Modele-eleves",
    stand: (datum: string) => `Au ${datum}`,
    soAusfuellen: "Comment remplir le modèle",
    soGehtEs: "Comment ça marche",
    dieSpalten: "Les colonnes",
    spalte: "Colonne",
    wasHinein: "Ce qui va dedans",
    dieStartniveaus: "Les niveaux de départ",
    nummer: "Numéro",
    startniveauInTastenflow: "Niveau de départ dans Tastenflow",
    kurzwort: "Mot court",
    schritt1: (blatt: string) =>
      `1. Dans la feuille "${blatt}", remplissez une ligne par élève : son nom et, si vous le souhaitez, un mot de passe.`,
    schritt2:
      '2. Un mot de passe laissé vide est créé par l\'appli, par exemple km482. Tous les mots de passe apparaissent ensuite sous "Imprimer les identifiants".',
    schritt3:
      '3. En haut, dans le cadre "appliquer à tous", choisissez où les élèves commencent dans Tastenflow. Cela s\'applique à chaque élève pour qui vous ne choisissez rien d\'autre en colonne C.',
    schritt4:
      "4. Si un élève doit commencer ailleurs, choisissez un autre niveau de départ dans la colonne C de sa ligne. La liste déroulante s'ouvre avec Alt + flèche bas (sur Mac : Option + flèche bas).",
    schritt5:
      '5. Enregistrez le fichier et, dans Tastenflow, choisissez "Importer des participants depuis Excel". Les élèves sont ajoutés à la classe choisie là-bas. L\'application affiche un aperçu avant toute création.',
    spalteName: "Le nom de l'élève, avec lequel il se connecte. Chaque nom une seule fois par classe.",
    spaltePasswort: (min: number) =>
      `${min} caractères minimum. Laissez vide : l'application crée un mot de passe facile à taper.`,
    spalteStart:
      'Déjà rempli - avec le choix du cadre "appliquer à tous". Ne changez la valeur que si un élève doit commencer ailleurs.',
    spalteEmail:
      "Peut rester vide. Si une adresse est indiquée ici, l'élève reçoit automatiquement ses identifiants par e-mail - à la création et à chaque réinitialisation ultérieure.",
    nachsatz:
      "Au lieu d'un nom de la liste, l'application comprend aussi le numéro ou le mot court - par exemple depuis votre propre tableau.",
    nichtLesbar:
      "Le fichier ne peut pas être lu comme fichier Excel. Merci de l'enregistrer comme classeur Excel (.xlsx) et de le choisir à nouveau.",
    blattLeer: (blatt: string) =>
      `La feuille "${blatt}" est vide. Merci de saisir les élèves sous la ligne d'en-tête.`,
    keinKopf: (name: string, passwort: string) =>
      `Il manque la ligne d'en-tête avec "${name}" et "${passwort}" dans le fichier. Merci d'utiliser le modèle ("Télécharger le modèle (Excel)").`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Le fichier porte le titre "${titel}", mais la classe choisie est "${klasse}". La création se fera dans la classe choisie - merci de vérifier que c'est bien voulu.`,
    startDerKlasse: "niveau de départ de la classe",
    nameFehlt: "Le nom manque.",
    passwortKurz: (min: number) => `Le mot de passe compte moins de ${min} caractères.`,
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `"${zelle}" n'est pas un niveau de départ. Les numéros possibles vont de 1 à ${anzahl} dans la feuille "${blatt}" - ou laissez la cellule vide.`,
    keineEmail: (zelle: string) =>
      `"${zelle}" ne ressemble pas à une adresse e-mail - ou laissez la cellule vide.`,
    nameSchonDa: "Ce nom existe déjà dans la classe.",
    nameDoppelt: (zeile: number) => `Ce nom figure déjà dans le fichier, à la ligne ${zeile}.`,
    zeile: (zeile: number) => `Ligne ${zeile}`,
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted.
  es: {
    blattKinder: BLATT_KINDER_ES,
    blattHinweise: BLATT_HINWEISE_ES,
    blattListen: BLATT_LISTEN_ES,
    kopfName: KOPF_NAME_ES,
    kopfPasswort: KOPF_PASSWORT_ES,
    kopfStart: KOPF_START_ES,
    kopfEmail: KOPF_EMAIL_ES,
    fuerAlleText: FUER_ALLE_TEXT_ES,
    fuerAlleSatz:
      'Se aplica a cada participante para quien no elija otra cosa en la columna C. La lista desplegable se abre con Alt + flecha abajo (en Mac: Opción + flecha abajo). Deje vacía la columna "Contraseña": la aplicación crea una automáticamente.',
    auswahlFehler: "Elija un nivel de partida de la lista, por favor.",
    auswahlTitel: "Nivel de partida",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_ES,
    datei: "Plantilla-participantes",
    stand: (datum: string) => `Actualizado: ${datum}`,
    soAusfuellen: "Cómo completar la plantilla",
    soGehtEs: "Cómo funciona",
    dieSpalten: "Las columnas",
    spalte: "Columna",
    wasHinein: "Qué va dentro",
    dieStartniveaus: "Los niveles de partida",
    nummer: "Número",
    startniveauInTastenflow: "Nivel de partida en Tastenflow",
    kurzwort: "Abreviatura",
    schritt1: (blatt: string) =>
      `1. En la hoja "${blatt}", complete una fila por participante: su nombre y, si quiere, una contraseña.`,
    schritt2:
      '2. Si deja vacía la contraseña, la aplicación crea una, por ejemplo km482. Después todas las contraseñas aparecen en "Imprimir los datos de acceso".',
    schritt3:
      '3. Arriba, en el recuadro "aplicar a todos", elija por dónde empieza el alumnado en Tastenflow. Se aplica a cada participante para quien no elija otra cosa en la columna C.',
    schritt4:
      "4. Si alguien debe empezar en otro punto, elija otro nivel de partida en la columna C de su fila. La lista desplegable se abre con Alt + flecha abajo (en Mac: Opción + flecha abajo).",
    schritt5:
      '5. Guarde el archivo y, en Tastenflow, elija "Importar participantes desde Excel". Los participantes se añaden a la clase elegida allí. La aplicación muestra una vista previa antes de crear nada.',
    spalteName: "El nombre de la persona, con el que inicia sesión. Cada nombre solo una vez por clase.",
    spaltePasswort: (min: number) =>
      `Mínimo ${min} caracteres. Si se deja vacía, la aplicación crea una contraseña fácil de escribir.`,
    spalteStart:
      'Ya viene completada - con la elección del recuadro "aplicar a todos". Cambie el valor solo si alguien debe empezar en otro punto.',
    spalteEmail:
      "Puede quedar vacía. Si aquí se indica una dirección, la persona recibe automáticamente sus datos de acceso por correo electrónico - al crearla y cada vez que se restablezcan después.",
    nachsatz:
      "En lugar de un nombre de la lista, la aplicación entiende también el número o la palabra corta - por ejemplo, desde su propia tabla.",
    nichtLesbar:
      "El archivo no se puede leer como archivo de Excel. Guárdelo como libro de Excel (.xlsx) y vuelva a elegirlo, por favor.",
    blattLeer: (blatt: string) =>
      `La hoja "${blatt}" está vacía. Escriba a los participantes debajo de la fila de encabezado, por favor.`,
    keinKopf: (name: string, passwort: string) =>
      `En el archivo falta la fila de encabezado con "${name}" y "${passwort}". Use la plantilla ("Descargar la plantilla (Excel)"), por favor.`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `El archivo lleva el título "${titel}", pero la clase elegida es "${klasse}". Se creará en la clase elegida - compruebe que es lo que quiere, por favor.`,
    startDerKlasse: "nivel de partida de la clase",
    nameFehlt: "Falta el nombre.",
    passwortKurz: (min: number) => `La contraseña tiene menos de ${min} caracteres.`,
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `"${zelle}" no es un nivel de partida. Los números posibles van del 1 al ${anzahl} en la hoja "${blatt}" - o deje la celda vacía.`,
    keineEmail: (zelle: string) =>
      `"${zelle}" no parece una dirección de correo electrónico - o deje la celda vacía.`,
    nameSchonDa: "Este nombre ya existe en la clase.",
    nameDoppelt: (zeile: number) => `Este nombre ya está en el archivo, en la fila ${zeile}.`,
    zeile: (zeile: number) => `Fila ${zeile}`,
  },
  // ★ O-IT (02.10.2026): Lehrkräfte - Infinitiv und neutrale Formen (Glossar
  // Regel 1); „punto di partenza" für Startniveau (§2.2).
  it: {
    blattKinder: BLATT_KINDER_IT,
    blattHinweise: BLATT_HINWEISE_IT,
    blattListen: BLATT_LISTEN_IT,
    kopfName: KOPF_NAME_IT,
    kopfPasswort: KOPF_PASSWORT_IT,
    kopfStart: KOPF_START_IT,
    kopfEmail: KOPF_EMAIL_IT,
    fuerAlleText: FUER_ALLE_TEXT_IT,
    fuerAlleSatz:
      `Vale per ogni persona per cui nella colonna C non si sceglie altro. L'elenco a discesa si apre con Alt + freccia giù (sul Mac: Opzione + freccia giù). Lasciare vuota la colonna "Password": il programma ne crea una automaticamente.`,
    auswahlFehler: "Scegliere un punto di partenza dall'elenco.",
    auswahlTitel: "Punto di partenza",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_IT,
    datei: "Modello-alunni",
    stand: (datum: string) => `Ultimo aggiornamento: ${datum}`,
    soAusfuellen: "Come compilare il modello",
    soGehtEs: "Come funziona",
    dieSpalten: "Le colonne",
    spalte: "Colonna",
    wasHinein: "Che cosa inserire",
    dieStartniveaus: "I punti di partenza",
    nummer: "Numero",
    startniveauInTastenflow: "Punto di partenza in Tastenflow",
    kurzwort: "Parola breve",
    schritt1: (blatt: string) =>
      `1. Nel foglio "${blatt}" inserire una riga per ogni persona: il nome e, se si vuole, una password.`,
    schritt2:
      `2. Se la password resta vuota, la crea il programma, ad esempio km482. Poi tutte le password si trovano in "Stampa i dati di accesso".`,
    schritt3:
      `3. In alto, nella casella "applica a tutti", scegliere da dove iniziano gli alunni in Tastenflow. Vale per ogni persona per cui nella colonna C non si sceglie altro.`,
    schritt4:
      "4. Se qualcuno deve iniziare da un altro punto, scegliere un altro punto di partenza nella colonna C della sua riga. L'elenco a discesa si apre con Alt + freccia giù (sul Mac: Opzione + freccia giù).",
    schritt5:
      `5. Salvare il file e in Tastenflow scegliere "Importa alunni da Excel". Gli alunni vengono aggiunti alla classe scelta lì. Prima di creare gli account il programma mostra un'anteprima.`,
    spalteName: "Il nome della persona, con cui accede. Ogni nome una sola volta per classe.",
    spaltePasswort: (min: number) =>
      `Almeno ${min} caratteri. Se resta vuota, il programma crea una password facile da scrivere.`,
    spalteStart:
      `È già compilata - con la scelta della casella "applica a tutti". Cambiare il valore solo dove qualcuno deve iniziare da un altro punto.`,
    spalteEmail:
      "Può restare vuota. Se qui c'è un indirizzo, la persona riceve automaticamente i dati di accesso via email - quando l'account viene creato e ogni volta che viene reimpostato.",
    nachsatz:
      "Al posto di un nome dell'elenco il programma capisce anche il numero o la parola breve - ad esempio da una propria tabella.",
    nichtLesbar:
      "Il file non si può leggere come file Excel. Salvarlo come cartella di lavoro Excel (.xlsx) e sceglierlo di nuovo.",
    blattLeer: (blatt: string) =>
      `Il foglio "${blatt}" è vuoto. Inserire gli alunni sotto la riga di intestazione.`,
    keinKopf: (name: string, passwort: string) =>
      `Nel file manca la riga di intestazione con "${name}" e "${passwort}". Usare il modello ("Scarica il modello (Excel)").`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Il file ha il titolo "${titel}", ma la classe scelta è "${klasse}". Gli account vengono creati nella classe scelta - controllare che sia giusto.`,
    startDerKlasse: "punto di partenza della classe",
    nameFehlt: "Manca il nome.",
    passwortKurz: (min: number) => `La password ha meno di ${min} caratteri.`,
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `"${zelle}" non è un punto di partenza. Sono possibili i numeri da 1 a ${anzahl} del foglio "${blatt}" - oppure lasciare vuota la cella.`,
    keineEmail: (zelle: string) =>
      `"${zelle}" non sembra un indirizzo email - oppure lasciare vuota la cella.`,
    nameSchonDa: "Questo nome esiste già nella classe.",
    nameDoppelt: (zeile: number) => `Questo nome è già nel file, alla riga ${zeile}.`,
    zeile: (zeile: number) => `Riga ${zeile}`,
  },
  // ★ O-PL (02.10.2026): Lehrkraft ty-Befehlsform (Glossar Regel 1), „punkt
  // startowy" (§2.2), Knopfnamen ohne Anführung (Regel 8), Mehrzahl mit vier Formen.
  pl: {
    blattKinder: BLATT_KINDER_PL,
    blattHinweise: BLATT_HINWEISE_PL,
    blattListen: BLATT_LISTEN_PL,
    kopfName: KOPF_NAME_PL,
    kopfPasswort: KOPF_PASSWORT_PL,
    kopfStart: KOPF_START_PL,
    kopfEmail: KOPF_EMAIL_PL,
    fuerAlleText: FUER_ALLE_TEXT_PL,
    fuerAlleSatz:
      "Dotyczy każdej osoby, dla której w kolumnie C nie wybierzesz nic innego. Listę rozwijaną otwiera Alt + strzałka w dół (na Macu: Option + strzałka w dół). Kolumnę „Hasło” możesz zostawić pustą: program sam utworzy hasło.",
    auswahlFehler: "Wybierz punkt startowy z listy.",
    auswahlTitel: "Punkt startowy",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_PL,
    datei: "Szablon-uczniowie",
    stand: (datum: string) => `Ostatnia aktualizacja: ${datum}`,
    soAusfuellen: "Jak wypełnić szablon",
    soGehtEs: "Jak to działa",
    dieSpalten: "Kolumny",
    spalte: "Kolumna",
    wasHinein: "Co wpisać",
    dieStartniveaus: "Punkty startowe",
    nummer: "Numer",
    startniveauInTastenflow: "Punkt startowy w programie Tastenflow",
    kurzwort: "Skrót",
    schritt1: (blatt: string) =>
      `1. W arkuszu „${blatt}” wpisz po jednym wierszu dla każdej osoby: imię i, jeśli chcesz, hasło.`,
    schritt2:
      "2. Puste hasło utworzy program, na przykład km482. Wszystkie hasła znajdziesz potem pod przyciskiem Drukuj dane logowania.",
    schritt3:
      "3. U góry, w polu „dla wszystkich”, wybierz, od czego uczniowie zaczną w programie Tastenflow. Dotyczy to każdej osoby, dla której w kolumnie C nie wybierzesz nic innego.",
    schritt4:
      "4. Jeśli ktoś ma zacząć gdzie indziej, wybierz w kolumnie C w wierszu tej osoby inny punkt startowy. Listę rozwijaną otwiera Alt + strzałka w dół (na Macu: Option + strzałka w dół).",
    schritt5:
      "5. Zapisz plik i wybierz w programie Tastenflow przycisk Importuj uczniów z pliku Excel. Uczniowie trafią do klasy, która jest tam wybrana. Przed założeniem kont program pokaże podgląd.",
    spalteName: "Imię osoby, którym się loguje. Każde imię tylko raz w klasie.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "pl", {
        one: (z) => `Co najmniej ${z} znak.`,
        few: (z) => `Co najmniej ${z} znaki.`,
        many: (z) => `Co najmniej ${z} znaków.`,
        other: (z) => `Co najmniej ${z} znaku.`,
      }) + " Puste pole: program utworzy hasło łatwe do wpisania.",
    spalteStart:
      "Jest już wypełniona - wyborem z pola „dla wszystkich”. Zmień ją tylko tam, gdzie ktoś ma zacząć gdzie indziej.",
    spalteEmail:
      "Można zostawić puste. Jeśli jest tu adres, osoba dostanie dane logowania automatycznie e-mailem - przy zakładaniu konta i przy każdym późniejszym ustawianiu nowego hasła.",
    nachsatz:
      "Zamiast nazwy z listy program rozumie też numer albo skrót - na przykład z własnej tabeli.",
    nichtLesbar:
      "Tego pliku nie da się odczytać jako pliku Excel. Zapisz go jako skoroszyt programu Excel (.xlsx) i wybierz jeszcze raz.",
    blattLeer: (blatt: string) =>
      `Arkusz „${blatt}” jest pusty. Wpisz uczniów pod wierszem nagłówka.`,
    keinKopf: (name: string, passwort: string) =>
      `W pliku brakuje wiersza nagłówka z „${name}” i „${passwort}”. Użyj szablonu (przycisk Pobierz szablon (Excel)).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Plik ma tytuł „${titel}”, ale wybrana jest klasa „${klasse}”. Konta zostaną założone w wybranej klasie - sprawdź, czy tak ma być.`,
    startDerKlasse: "punkt startowy klasy",
    nameFehlt: "Brakuje imienia.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "pl", {
        one: (z) => `Hasło ma mniej niż ${z} znak.`,
        few: (z) => `Hasło ma mniej niż ${z} znaki.`,
        many: (z) => `Hasło ma mniej niż ${z} znaków.`,
        other: (z) => `Hasło ma mniej niż ${z} znaku.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `„${zelle}” to nie jest punkt startowy. Możliwe są numery od 1 do ${anzahl} z arkusza „${blatt}” - albo pusta komórka.`,
    keineEmail: (zelle: string) =>
      `„${zelle}” nie wygląda na adres e-mail - możesz też zostawić pustą komórkę.`,
    nameSchonDa: "To imię jest już w klasie.",
    nameDoppelt: (zeile: number) => `To imię jest już w pliku, w wierszu ${zeile}.`,
    zeile: (zeile: number) => `Wiersz ${zeile}`,
  },
  // ★ O-TR (02.10.2026): Lehrkraft siz mit -(y)In (Glossar Regel 1), "başlangıç
  // noktası" (§2.2), Knopfnamen in geraden Anführungszeichen (Regel 7); keine
  // Endung an Platzhalter, Zahl, "Tastenflow" (Regel 6), nach einer Zahl Einzahl.
  tr: {
    blattKinder: BLATT_KINDER_TR,
    blattHinweise: BLATT_HINWEISE_TR,
    blattListen: BLATT_LISTEN_TR,
    kopfName: KOPF_NAME_TR,
    kopfPasswort: KOPF_PASSWORT_TR,
    kopfStart: KOPF_START_TR,
    kopfEmail: KOPF_EMAIL_TR,
    fuerAlleText: FUER_ALLE_TEXT_TR,
    fuerAlleSatz:
      'C sütununda başka bir şey seçmediğiniz her öğrenci için geçerlidir. Açılır liste Alt + aşağı ok ile açılır (Mac bilgisayarda: Option + aşağı ok). "Şifre" sütununu boş bırakabilirsiniz: program şifreyi kendisi oluşturur.',
    auswahlFehler: "Lütfen listeden bir başlangıç noktası seçin.",
    auswahlTitel: "Başlangıç noktası",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_TR,
    datei: "Öğrenci-şablonu",
    stand: (datum: string) => `Son güncelleme: ${datum}`,
    soAusfuellen: "Şablon nasıl doldurulur",
    soGehtEs: "Adımlar",
    dieSpalten: "Sütunlar",
    spalte: "Sütun",
    wasHinein: "Ne yazılır",
    dieStartniveaus: "Başlangıç noktaları",
    nummer: "Numara",
    startniveauInTastenflow: "Başlangıç noktası (Tastenflow)",
    kurzwort: "Kısa ad",
    schritt1: (blatt: string) =>
      `1. "${blatt}" sayfasına her öğrenci için bir satır yazın: adını ve isterseniz bir şifre.`,
    schritt2:
      '2. Boş bıraktığınız şifreyi program oluşturur, örneğin km482. Tüm şifreleri sonra "Giriş bilgilerini yazdır" düğmesinde bulursunuz.',
    schritt3:
      '3. Yukarıdaki "herkese uygula" kutusunda öğrencilerin Tastenflow ile nereden başlayacağını seçin. Bu, C sütununda başka bir şey seçmediğiniz her öğrenci için geçerlidir.',
    schritt4:
      "4. Bir öğrenci başka bir yerden başlayacaksa, o öğrencinin satırında C sütunundan başka bir başlangıç noktası seçin. Açılır liste Alt + aşağı ok ile açılır (Mac bilgisayarda: Option + aşağı ok).",
    schritt5:
      '5. Dosyayı kaydedin, sonra "Sınıflarım" bölümünde "Excel dosyasından öğrenci ekle" düğmesine basın. Öğrenciler orada seçili olan sınıfa eklenir. Hesaplar oluşturulmadan önce program bir önizleme gösterir.',
    spalteName: "Öğrencinin giriş yaparken kullandığı ad. Bir sınıfta her ad yalnızca bir kez olabilir.",
    spaltePasswort: (min: number) =>
      `En az ${min} karakter. Boş bırakılırsa program kolay yazılan bir şifre oluşturur.`,
    spalteStart:
      '"Herkese uygula" kutusundaki seçimle zaten doldurulmuştur. Yalnızca başka bir yerden başlayacak öğrencilerin satırında değiştirin.',
    spalteEmail:
      "Boş bırakılabilir. Burada bir adres varsa öğrenci giriş bilgilerini otomatik olarak e-postayla alır - hesap oluşturulurken ve şifre her sıfırlandığında.",
    nachsatz:
      "Program, listedeki adın yerine numarayı veya kısa adı da anlar - örneğin kendi tablonuzdan.",
    nichtLesbar:
      "Bu dosya Excel dosyası olarak okunamıyor. Lütfen dosyayı Excel çalışma kitabı (.xlsx) olarak kaydedin ve yeniden seçin.",
    blattLeer: (blatt: string) =>
      `"${blatt}" sayfası boş. Lütfen öğrencileri başlık satırının altına yazın.`,
    keinKopf: (name: string, passwort: string) =>
      `Dosyada "${name}" ve "${passwort}" başlıklarının bulunduğu satır yok. Lütfen şablonu kullanın ("Şablonu indir (Excel)" düğmesi).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Dosyanın başlığı: "${titel}". Seçili sınıf: ${klasse}. Hesaplar seçili sınıfta oluşturulur - lütfen bunun doğru olup olmadığını kontrol edin.`,
    startDerKlasse: "sınıfın başlangıç noktası",
    nameFehlt: "Ad eksik.",
    passwortKurz: (min: number) => `Şifre, en az ${min} karakter olmalı.`,
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `"${zelle}" bir başlangıç noktası değil. "${blatt}" sayfasındaki 1 ile ${anzahl} arasındaki numaralar kullanılabilir - ya da hücreyi boş bırakın.`,
    keineEmail: (zelle: string) =>
      `"${zelle}" bir e-posta adresine benzemiyor - isterseniz hücreyi boş bırakın.`,
    nameSchonDa: "Bu ad sınıfta zaten var.",
    nameDoppelt: (zeile: number) => `Bu ad dosyada zaten var: satır ${zeile}.`,
    zeile: (zeile: number) => `Satır ${zeile}`,
  },
  // ★ O-CS (03.10.2026): Lehrkraft vy-Mehrzahl (Glossar Regel 1), „výchozí bod"
  // (§2.2), „šablona", „Jméno" (§2.6); Knopfnamen ohne Anführung (Regel 7), in
  // Prosa der Vorlage tschechische Anführung; Blatt- und Spaltennamen hinter einem Kopfwort, nie
  // gebeugt (Regel 12); Mehrzahl mit vier Formen (§2.11).
  cs: {
    blattKinder: BLATT_KINDER_CS,
    blattHinweise: BLATT_HINWEISE_CS,
    blattListen: BLATT_LISTEN_CS,
    kopfName: KOPF_NAME_CS,
    kopfPasswort: KOPF_PASSWORT_CS,
    kopfStart: KOPF_START_CS,
    kopfEmail: KOPF_EMAIL_CS,
    fuerAlleText: FUER_ALLE_TEXT_CS,
    fuerAlleSatz:
      "Platí pro každou osobu, u které ve sloupci C nevyberete nic jiného. Rozbalovací seznam otevřete klávesami Alt + šipka dolů (na Macu: Option + šipka dolů). Sloupec Heslo můžete nechat prázdný: heslo vytvoří program.",
    auswahlFehler: "Vyberte prosím výchozí bod ze seznamu.",
    auswahlTitel: "Výchozí bod",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_CS,
    datei: "Šablona-žáci",
    stand: (datum: string) => `Poslední aktualizace: ${datum}`,
    soAusfuellen: "Jak šablonu vyplnit",
    soGehtEs: "Postup",
    dieSpalten: "Sloupce",
    spalte: "Sloupec",
    wasHinein: "Co sem patří",
    dieStartniveaus: "Výchozí body",
    nummer: "Číslo",
    startniveauInTastenflow: "Výchozí bod v Tastenflow",
    kurzwort: "Zkratka",
    schritt1: (blatt: string) =>
      `1. Na listu ${blatt} napište pro každou osobu jeden řádek: jméno a podle potřeby heslo.`,
    schritt2:
      "2. Prázdné heslo vytvoří program, například km482. Všechna hesla pak najdete pod tlačítkem Vytisknout přihlašovací údaje.",
    schritt3:
      "3. Nahoře v poli „pro všechny“ vyberte, kde žáci v Tastenflow začnou. Platí to pro každou osobu, u které ve sloupci C nevyberete nic jiného.",
    schritt4:
      "4. Má-li někdo začít jinde, vyberte v řádku této osoby ve sloupci C jiný výchozí bod. Rozbalovací seznam otevřete klávesami Alt + šipka dolů (na Macu: Option + šipka dolů).",
    schritt5:
      "5. Soubor uložte a v Tastenflow vyberte tlačítko Přidat žáky ze souboru Excel. Žáci přibudou do třídy, která je tam vybraná. Před vytvořením účtů program ukáže náhled.",
    spalteName: "Jméno, kterým se osoba přihlašuje. Každé jméno smí být ve třídě jen jednou.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `Aspoň ${z} znak.`,
        few: (z) => `Aspoň ${z} znaky.`,
        many: (z) => `Aspoň ${z} znaku.`,
        other: (z) => `Aspoň ${z} znaků.`,
      }) + " Prázdné pole: program vytvoří heslo, které se snadno píše.",
    spalteStart:
      "Je už vyplněný - výběrem z pole „pro všechny“. Změňte ho jen tam, kde má někdo začít jinde.",
    spalteEmail:
      "Může zůstat prázdné. Je-li tu adresa, přijdou přihlašovací údaje automaticky e-mailem - při vytvoření účtu a při každém dalším obnovení hesla.",
    nachsatz:
      "Místo názvu ze seznamu program rozumí i číslu nebo zkratce - například z vlastní tabulky.",
    nichtLesbar:
      "Tento soubor nelze přečíst jako soubor Excel. Uložte ho prosím jako sešit Excel (.xlsx) a vyberte ho znovu.",
    blattLeer: (blatt: string) =>
      `List ${blatt} je prázdný. Napište prosím žáky pod řádek záhlaví.`,
    keinKopf: (name: string, passwort: string) =>
      `V souboru chybí řádek záhlaví se sloupci ${name} a ${passwort}. Použijte prosím šablonu (tlačítko Stáhnout šablonu (Excel)).`,
    // ★ O-CS: die Klasse in Klammern, damit kein Satz auf einer Zahl endet (Glossar §4 Falle 4).
    fremdeKlasse: (titel: string, klasse: string) =>
      `Vybraná třída (${klasse}) se liší od nadpisu souboru (${titel}). Účty se vytvoří ve vybrané třídě - zkontrolujte prosím, zda je to tak správně.`,
    startDerKlasse: "výchozí bod třídy",
    nameFehlt: "Chybí jméno.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `Heslo má méně než ${z} znak.`,
        few: (z) => `Heslo má méně než ${z} znaky.`,
        many: (z) => `Heslo má méně než ${z} znaku.`,
        other: (z) => `Heslo má méně než ${z} znaků.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `Hodnota ${zelle} není výchozí bod. Použít lze čísla 1 až ${anzahl} z listu ${blatt} - nebo buňku nechte prázdnou.`,
    keineEmail: (zelle: string) =>
      `Hodnota ${zelle} nevypadá jako e-mailová adresa - buňku můžete nechat i prázdnou.`,
    nameSchonDa: "Toto jméno už ve třídě je.",
    nameDoppelt: (zeile: number) => `Řádek ${zeile} v souboru už toto jméno obsahuje.`,
    zeile: (zeile: number) => `Řádek ${zeile}`,
  },
  bg: {
    blattKinder: BLATT_KINDER_BG,
    blattHinweise: BLATT_HINWEISE_BG,
    blattListen: BLATT_LISTEN_BG,
    kopfName: KOPF_NAME_BG,
    kopfPasswort: KOPF_PASSWORT_BG,
    kopfStart: KOPF_START_BG,
    kopfEmail: KOPF_EMAIL_BG,
    fuerAlleText: FUER_ALLE_TEXT_BG,
    fuerAlleSatz:
      "Важи за всеки ученик, за когото не изберете нещо друго в колона C. Падащият списък се отваря с Alt + стрелка надолу (на Mac: Option + стрелка надолу). Колоната „Парола“ може да остане празна: програмата създава паролата сама.",
    auswahlFehler: "Изберете начална точка от списъка.",
    auswahlTitel: "Начална точка",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_BG,
    datei: "Шаблон-ученици",
    stand: (datum: string) => `Последна актуализация: ${datum}`,
    soAusfuellen: "Как да попълните шаблона",
    soGehtEs: "Стъпки",
    dieSpalten: "Колоните",
    spalte: "Колона",
    wasHinein: "Какво се пише",
    dieStartniveaus: "Началните точки",
    nummer: "Номер",
    startniveauInTastenflow: "Начална точка в Tastenflow",
    kurzwort: "Кратко име",
    schritt1: (blatt: string) =>
      `1. В листа „${blatt}“ напишете по един ред за всеки ученик: името и при желание парола.`,
    schritt2:
      "2. Празна парола програмата създава сама, например km482. После всички пароли са в „Отпечатай данните за вход“.",
    schritt3:
      "3. Горе, в полето „за всички“, изберете откъде учениците започват в Tastenflow. Това важи за всеки ученик, за когото не изберете нещо друго в колона C.",
    schritt4:
      "4. Ако някой ученик трябва да започне другаде, изберете друга начална точка в колона C на неговия ред. Падащият списък се отваря с Alt + стрелка надолу (на Mac: Option + стрелка надолу).",
    schritt5:
      "5. Запишете файла и в Tastenflow изберете „Добави ученици от файл на Excel“. Учениците се добавят в класа, който е избран там. Преди създаването програмата показва преглед.",
    spalteName: "Името, с което ученикът влиза. Всяко име само веднъж в класа.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "bg", {
        one: (z) => `Поне ${z} знак.`,
        other: (z) => `Поне ${z} знака.`,
      }) + " Празно поле: програмата създава парола, която се пише лесно.",
    spalteStart:
      "Вече е попълнена - с избора от полето „за всички“. Променете я само там, където някой ученик трябва да започне другаде.",
    spalteEmail:
      "Може да остане празна. Ако тук има адрес, данните за вход идват автоматично по имейл - при създаването и при всяко следващо нулиране на паролата.",
    nachsatz:
      "Вместо име от списъка програмата разбира и номера или краткото име - например от ваша собствена таблица.",
    nichtLesbar:
      "Файлът не може да се прочете като файл на Excel. Запишете го като работна книга на Excel (.xlsx) и го изберете отново.",
    blattLeer: (blatt: string) =>
      `Листът „${blatt}“ е празен. Напишете учениците под заглавния ред.`,
    keinKopf: (name: string, passwort: string) =>
      `Във файла липсва заглавният ред с колоните „${name}“ и „${passwort}“. Използвайте шаблона (бутона „Изтегли шаблона (Excel)“).`,
    // Klasse in Klammern, damit kein Satz auf einer Zahl endet (wie cs)
    fremdeKlasse: (titel: string, klasse: string) =>
      `Избраният клас (${klasse}) не съвпада със заглавието на файла (${titel}). Акаунтите ще се създадат в избрания клас - проверете дали е правилно така.`,
    startDerKlasse: "началната точка на класа",
    nameFehlt: "Липсва име.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "bg", {
        one: (z) => `Паролата има по-малко от ${z} знак.`,
        other: (z) => `Паролата има по-малко от ${z} знака.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `Стойността „${zelle}“ не е начална точка. Може да се използват числата от 1 до ${anzahl} от листа „${blatt}“ - или клетката да остане празна.`,
    keineEmail: (zelle: string) =>
      `Стойността „${zelle}“ не прилича на имейл адрес - клетката може да остане и празна.`,
    nameSchonDa: "Това име вече го има в класа.",
    nameDoppelt: (zeile: number) => `Името вече е във файла, на ред ${zeile}.`,
    zeile: (zeile: number) => `Ред ${zeile}`,
  },
  el: {
    blattKinder: BLATT_KINDER_EL,
    blattHinweise: BLATT_HINWEISE_EL,
    blattListen: BLATT_LISTEN_EL,
    kopfName: KOPF_NAME_EL,
    kopfPasswort: KOPF_PASSWORT_EL,
    kopfStart: KOPF_START_EL,
    kopfEmail: KOPF_EMAIL_EL,
    fuerAlleText: FUER_ALLE_TEXT_EL,
    fuerAlleSatz:
      "Ισχύει για κάθε άτομο για το οποίο δεν επιλέγετε κάτι άλλο στη στήλη C. Η αναπτυσσόμενη λίστα ανοίγει με Alt + Κάτω βέλος (σε Mac: Option + Κάτω βέλος). Τη στήλη «Κωδικός πρόσβασης» μπορείτε να την αφήσετε κενή: τον κωδικό τον δημιουργεί το πρόγραμμα.",
    auswahlFehler: "Επιλέξτε ένα σημείο εκκίνησης από τη λίστα.",
    auswahlTitel: "Σημείο εκκίνησης",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_EL,
    datei: "Πρότυπο-μαθητές",
    stand: (datum: string) => `Τελευταία ενημέρωση: ${datum}`,
    soAusfuellen: "Πώς συμπληρώνεται το πρότυπο",
    soGehtEs: "Βήματα",
    dieSpalten: "Οι στήλες",
    spalte: "Στήλη",
    wasHinein: "Τι γράφεται εδώ",
    dieStartniveaus: "Τα σημεία εκκίνησης",
    nummer: "Αριθμός",
    startniveauInTastenflow: "Σημείο εκκίνησης στο Tastenflow",
    kurzwort: "Σύντομη λέξη",
    schritt1: (blatt: string) =>
      `1. Στο φύλλο «${blatt}» γράψτε μία γραμμή για κάθε άτομο: το όνομα και, αν θέλετε, έναν κωδικό πρόσβασης.`,
    schritt2:
      "2. Αν ο κωδικός πρόσβασης μείνει κενός, το πρόγραμμα δημιουργεί έναν, για παράδειγμα km482. Όλους τους κωδικούς τους βρίσκετε μετά στο «Εκτύπωση στοιχείων σύνδεσης».",
    schritt3:
      "3. Επάνω, στο πλαίσιο «για όλους», επιλέξτε από πού ξεκινούν οι μαθητές στο Tastenflow. Αυτό ισχύει για κάθε άτομο για το οποίο δεν επιλέγετε κάτι άλλο στη στήλη C.",
    schritt4:
      "4. Αν ένα άτομο πρέπει να ξεκινήσει αλλού, επιλέξτε στη γραμμή του, στη στήλη C, άλλο σημείο εκκίνησης. Η αναπτυσσόμενη λίστα ανοίγει με Alt + Κάτω βέλος (σε Mac: Option + Κάτω βέλος).",
    schritt5:
      "5. Αποθηκεύστε το αρχείο και επιλέξτε στο Tastenflow «Προσθήκη μαθητών από αρχείο Excel». Οι μαθητές μπαίνουν στο τμήμα που είναι επιλεγμένο εκεί. Πριν από τη δημιουργία των λογαριασμών το πρόγραμμα δείχνει μια προεπισκόπηση.",
    spalteName: "Το όνομα με το οποίο συνδέεται το άτομο. Κάθε όνομα μόνο μία φορά ανά τμήμα.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "el", {
        one: (z) => `Τουλάχιστον ${z} χαρακτήρας.`,
        other: (z) => `Τουλάχιστον ${z} χαρακτήρες.`,
      }) + " Κενό πεδίο: το πρόγραμμα δημιουργεί έναν κωδικό πρόσβασης που γράφεται εύκολα.",
    spalteStart:
      "Είναι ήδη συμπληρωμένη - με την επιλογή από το πλαίσιο «για όλους». Αλλάξτε την μόνο εκεί όπου ένα άτομο πρέπει να ξεκινήσει αλλού.",
    spalteEmail:
      "Μπορεί να μείνει κενή. Αν υπάρχει εδώ διεύθυνση, τα στοιχεία σύνδεσης έρχονται αυτόματα με e-mail - κατά τη δημιουργία του λογαριασμού και σε κάθε επόμενη επαναφορά του κωδικού πρόσβασης.",
    nachsatz:
      "Αντί για ένα όνομα από τη λίστα, το πρόγραμμα καταλαβαίνει και τον αριθμό ή τη σύντομη λέξη - για παράδειγμα από δικό σας πίνακα.",
    nichtLesbar:
      "Αυτό το αρχείο δεν διαβάζεται ως αρχείο Excel. Αποθηκεύστε το ως βιβλίο εργασίας Excel (.xlsx) και επιλέξτε το ξανά.",
    blattLeer: (blatt: string) =>
      `Το φύλλο «${blatt}» είναι κενό. Γράψτε τους μαθητές κάτω από τη γραμμή κεφαλίδας.`,
    keinKopf: (name: string, passwort: string) =>
      `Στο αρχείο λείπει η γραμμή κεφαλίδας με τις στήλες «${name}» και «${passwort}». Χρησιμοποιήστε το πρότυπο (κουμπί «Λήψη προτύπου (Excel)»).`,
    // Klasse in Klammern, wie cs.
    fremdeKlasse: (titel: string, klasse: string) =>
      `Το επιλεγμένο τμήμα (${klasse}) διαφέρει από τον τίτλο του αρχείου (${titel}). Οι λογαριασμοί θα δημιουργηθούν στο επιλεγμένο τμήμα - ελέγξτε αν αυτό είναι σωστό.`,
    startDerKlasse: "σημείο εκκίνησης του τμήματος",
    nameFehlt: "Λείπει το όνομα.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "el", {
        one: (z) => `Ο κωδικός πρόσβασης έχει λιγότερο από ${z} χαρακτήρα.`,
        other: (z) => `Ο κωδικός πρόσβασης έχει λιγότερους από ${z} χαρακτήρες.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `Η τιμή «${zelle}» δεν είναι σημείο εκκίνησης. Μπορείτε να χρησιμοποιήσετε τους αριθμούς 1 έως ${anzahl} από το φύλλο «${blatt}» - ή να αφήσετε το κελί κενό.`,
    keineEmail: (zelle: string) =>
      `Η τιμή «${zelle}» δεν μοιάζει με διεύθυνση e-mail - το κελί μπορεί να μείνει και κενό.`,
    nameSchonDa: "Αυτό το όνομα υπάρχει ήδη στο τμήμα.",
    nameDoppelt: (zeile: number) => `Η γραμμή ${zeile} του αρχείου έχει ήδη αυτό το όνομα.`,
    zeile: (zeile: number) => `Γραμμή ${zeile}`,
  },
  hu: {
    blattKinder: BLATT_KINDER_HU,
    blattHinweise: BLATT_HINWEISE_HU,
    blattListen: BLATT_LISTEN_HU,
    kopfName: KOPF_NAME_HU,
    kopfPasswort: KOPF_PASSWORT_HU,
    kopfStart: KOPF_START_HU,
    kopfEmail: KOPF_EMAIL_HU,
    fuerAlleText: FUER_ALLE_TEXT_HU,
    fuerAlleSatz:
      "Minden tanulóra érvényes, akinél a C oszlopban nem választ mást. A legördülő lista az Alt + le nyíl billentyűkkel nyílik meg (Mac gépen: Option + le nyíl). A „Jelszó” oszlop üresen hagyható: a jelszót a program hozza létre.",
    auswahlFehler: "Válasszon kiindulópontot a listából.",
    auswahlTitel: "Kiindulópont",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_HU,
    datei: "Tanulók-sablon",
    stand: (datum: string) => `Utolsó frissítés: ${datum}`,
    soAusfuellen: "A sablon kitöltése",
    soGehtEs: "Lépések",
    dieSpalten: "Az oszlopok",
    spalte: "Oszlop",
    wasHinein: "Mi kerül bele",
    dieStartniveaus: "A kiindulópontok",
    nummer: "Szám",
    startniveauInTastenflow: "Kiindulópont a Tastenflow programban",
    kurzwort: "Rövid szó",
    schritt1: (blatt: string) =>
      `1. A munkalapra („${blatt}”) minden tanulóhoz írjon be egy sort: a nevet és, ha szükséges, egy jelszót.`,
    schritt2:
      "2. Az üres jelszót a program hozza létre, például km482. Az összes jelszó ezután a „Belépési adatok nyomtatása” gombnál található.",
    schritt3:
      "3. Fent, a „mindenkinek” mezőben válassza ki, honnan induljanak a tanulók a Tastenflow programban. Ez minden tanulóra érvényes, akinél a C oszlopban nem választ mást.",
    schritt4:
      "4. Ha egy tanulónak máshonnan kell indulnia, válasszon a sorában, a C oszlopban másik kiindulópontot. A legördülő lista az Alt + le nyíl billentyűkkel nyílik meg (Mac gépen: Option + le nyíl).",
    schritt5:
      "5. Mentse a fájlt, és a Tastenflow programban válassza a „Tanulók felvétele Excel-fájlból” lehetőséget. A tanulók abba az osztályba kerülnek, amely ott ki van választva. A fiókok létrehozása előtt a program előnézetet mutat.",
    spalteName: "A név, amellyel a tanuló bejelentkezik. Minden név osztályonként csak egyszer szerepelhet.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "hu", {
        one: (z) => `Legalább ${z} karakter.`,
        other: (z) => `Legalább ${z} karakter.`,
      }) + " Üresen hagyva: a program könnyen begépelhető jelszót hoz létre.",
    spalteStart:
      "Már ki van töltve - a „mindenkinek” mezőben választott értékkel. Csak ott válasszon mást, ahol egy tanulónak máshonnan kell indulnia.",
    spalteEmail:
      "Üresen hagyható. Ha itt cím áll, a tanuló automatikusan megkapja a belépési adatait e-mailben - a felvételkor és minden későbbi jelszó-visszaállításkor.",
    nachsatz:
      "A listában szereplő név helyett a program a számot vagy a rövid szót is megérti - például egy saját táblázatból.",
    nichtLesbar:
      "Ez a fájl nem olvasható Excel-fájlként. Mentse Excel-munkafüzetként (.xlsx), és válassza ki újra.",
    blattLeer: (blatt: string) =>
      `A munkalap („${blatt}”) üres. Írja be a tanulókat a fejlécsor alá.`,
    keinKopf: (name: string, passwort: string) =>
      `A fájlból hiányzik a fejlécsor ezekkel az oszlopokkal: „${name}” és „${passwort}”. Használja a sablont („Sablon letöltése (Excel)”).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `A kiválasztott osztály („${klasse}”) eltér a fájl címétől („${titel}”). A fiókok a kiválasztott osztályban jönnek létre - ellenőrizze, hogy ez így helyes-e.`,
    startDerKlasse: "az osztály kiindulópontja",
    nameFehlt: "Hiányzik a név.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "hu", {
        one: (z) => `A jelszó ${z} karakternél rövidebb.`,
        other: (z) => `A jelszó ${z} karakternél rövidebb.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `A cella tartalma („${zelle}”) nem kiindulópont. Használható számok: 1-${anzahl}, a munkalapról („${blatt}”) - vagy a cella üresen hagyható.`,
    keineEmail: (zelle: string) =>
      `A cella tartalma („${zelle}”) nem tűnik e-mail-címnek - a cella üresen is hagyható.`,
    nameSchonDa: "Ez a név már szerepel az osztályban.",
    nameDoppelt: (zeile: number) => `Sor: ${zeile} - ez a név ott már szerepel a fájlban.`,
    zeile: (zeile: number) => `Sor: ${zeile}`,
  },
  nl: {
    blattKinder: BLATT_KINDER_NL,
    blattHinweise: BLATT_HINWEISE_NL,
    blattListen: BLATT_LISTEN_NL,
    kopfName: KOPF_NAME_NL,
    kopfPasswort: KOPF_PASSWORT_NL,
    kopfStart: KOPF_START_NL,
    kopfEmail: KOPF_EMAIL_NL,
    fuerAlleText: FUER_ALLE_TEXT_NL,
    fuerAlleSatz:
      "Geldt voor elke leerling bij wie je in kolom C niets anders kiest. De keuzelijst open je met Alt + pijl omlaag (op een Mac: Option + pijl omlaag). Laat de kolom \"Wachtwoord\" leeg: het programma maakt er automatisch een.",
    auswahlFehler: "Kies een startpunt uit de lijst.",
    auswahlTitel: "Startpunt",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_NL,
    datei: "Sjabloon-leerlingen",
    stand: (datum: string) => `Laatst bijgewerkt: ${datum}`,
    soAusfuellen: "Zo vul je het sjabloon in",
    soGehtEs: "Zo werkt het",
    dieSpalten: "De kolommen",
    spalte: "Kolom",
    wasHinein: "Wat erin hoort",
    dieStartniveaus: "De startpunten",
    nummer: "Nummer",
    startniveauInTastenflow: "Startpunt in Tastenflow",
    kurzwort: "Kort woord",
    schritt1: (blatt: string) =>
      `1. Vul in het werkblad "${blatt}" per leerling een rij in: de naam en, als je wilt, een wachtwoord.`,
    schritt2:
      "2. Bij een leeg wachtwoord maakt het programma er een, bijvoorbeeld km482. Alle wachtwoorden staan daarna onder \"Inloggegevens afdrukken\".",
    schritt3:
      "3. Kies bovenaan in het vak \"voor iedereen\" waar de leerlingen in Tastenflow beginnen. Dat geldt voor elke leerling bij wie je in kolom C niets anders kiest.",
    schritt4:
      "4. Moet een leerling ergens anders beginnen, kies dan in de rij van die leerling in kolom C een ander startpunt. De keuzelijst open je met Alt + pijl omlaag (op een Mac: Option + pijl omlaag).",
    schritt5:
      "5. Sla het bestand op en kies in Tastenflow \"Leerlingen importeren uit Excel\". De leerlingen komen in de klas die daar is gekozen. Voordat ze worden toegevoegd, toont het programma een voorbeeld.",
    spalteName: "De naam waarmee de leerling inlogt. Elke naam maar een keer per klas.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "nl", {
        one: (z) => `Minstens ${z} teken.`,
        other: (z) => `Minstens ${z} tekens.`,
      }) + " Leeg laten: het programma maakt een wachtwoord dat makkelijk te typen is.",
    spalteStart:
      "Is al ingevuld - met de keuze uit het vak \"voor iedereen\". Kies alleen iets anders als een leerling ergens anders moet beginnen.",
    spalteEmail:
      "Mag leeg blijven. Staat hier een adres, dan krijgt de leerling de inloggegevens automatisch per e-mail - bij het toevoegen en telkens als het wachtwoord later opnieuw wordt ingesteld.",
    nachsatz:
      "In plaats van een naam uit de lijst begrijpt het programma ook het nummer of het korte woord - bijvoorbeeld uit een eigen tabel.",
    nichtLesbar:
      "Dit bestand kan niet als Excel-bestand worden gelezen. Sla het op als Excel-werkmap (.xlsx) en kies het opnieuw.",
    blattLeer: (blatt: string) =>
      `Het werkblad "${blatt}" is leeg. Vul de leerlingen in onder de koprij.`,
    keinKopf: (name: string, passwort: string) =>
      `In het bestand ontbreekt de koprij met "${name}" en "${passwort}". Gebruik het sjabloon ("Sjabloon downloaden (Excel)").`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Het bestand heeft de kop "${titel}", maar gekozen is "${klasse}". De leerlingen komen in de gekozen klas - controleer of dat de bedoeling is.`,
    startDerKlasse: "startpunt van de klas",
    nameFehlt: "De naam ontbreekt.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "nl", {
        one: (z) => `Het wachtwoord heeft minder dan ${z} teken.`,
        other: (z) => `Het wachtwoord heeft minder dan ${z} tekens.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `"${zelle}" is geen startpunt. Mogelijk zijn de nummers 1 tot en met ${anzahl} uit het werkblad "${blatt}" - of laat de cel leeg.`,
    keineEmail: (zelle: string) =>
      `"${zelle}" lijkt geen e-mailadres - je kunt de cel ook leeg laten.`,
    nameSchonDa: "Deze naam bestaat al in de klas.",
    nameDoppelt: (zeile: number) => `Deze naam staat al in rij ${zeile} van het bestand.`,
    zeile: (zeile: number) => `Rij ${zeile}`,
  },
  pt: {
    blattKinder: BLATT_KINDER_PT,
    blattHinweise: BLATT_HINWEISE_PT,
    blattListen: BLATT_LISTEN_PT,
    kopfName: KOPF_NAME_PT,
    kopfPasswort: KOPF_PASSWORT_PT,
    kopfStart: KOPF_START_PT,
    kopfEmail: KOPF_EMAIL_PT,
    fuerAlleText: FUER_ALLE_TEXT_PT,
    fuerAlleSatz:
      "Vale para cada pessoa para quem não escolher outra opção na coluna C. A lista abre-se com Alt + seta para baixo (no Mac: Opção + seta para baixo). A coluna \"Palavra-passe\" pode ficar vazia: o programa cria uma palavra-passe.",
    auswahlFehler: "Escolha um ponto de partida da lista.",
    auswahlTitel: "Ponto de partida",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_PT,
    datei: "Modelo-estudantes",
    stand: (datum: string) => `Última atualização: ${datum}`,
    soAusfuellen: "Como preencher o modelo",
    soGehtEs: "Como funciona",
    dieSpalten: "As colunas",
    spalte: "Coluna",
    wasHinein: "O que escrever aqui",
    dieStartniveaus: "Os pontos de partida",
    nummer: "Número",
    startniveauInTastenflow: "Ponto de partida no Tastenflow",
    kurzwort: "Palavra curta",
    schritt1: (blatt: string) =>
      `1. Na folha "${blatt}", escreva uma linha por pessoa: o nome e, se quiser, uma palavra-passe.`,
    schritt2:
      "2. Se a palavra-passe ficar vazia, o programa cria uma, por exemplo km482. Depois, todas as palavras-passe ficam em \"Imprimir dados de acesso\".",
    schritt3:
      "3. Em cima, no campo \"para todas as pessoas\", escolha por onde as pessoas começam no Tastenflow. Vale para cada pessoa para quem não escolher outra opção na coluna C.",
    schritt4:
      "4. Se alguém tiver de começar noutro ponto, escolha outro ponto de partida na linha dessa pessoa, na coluna C. A lista abre-se com Alt + seta para baixo (no Mac: Opção + seta para baixo).",
    schritt5:
      "5. Guarde o ficheiro e, no Tastenflow, selecione \"Adicionar estudantes a partir de um ficheiro Excel\". As pessoas são adicionadas à turma selecionada nessa altura. Antes de criar as contas, o programa mostra uma pré-visualização.",
    spalteName: "O nome com que a pessoa inicia sessão. Cada nome só pode existir uma vez na turma.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "pt", {
        one: (z) => `Pelo menos ${z} caráter.`,
        other: (z) => `Pelo menos ${z} carateres.`,
      }) + " Se ficar vazia, o programa cria uma palavra-passe fácil de escrever.",
    spalteStart:
      "Já está preenchida - com a escolha do campo \"para todas as pessoas\". Altere-a apenas quando alguém tiver de começar noutro ponto.",
    spalteEmail:
      "Pode ficar vazia. Se houver aqui um endereço, os dados de acesso seguem automaticamente por e-mail - ao adicionar a pessoa e sempre que a palavra-passe for reposta.",
    nachsatz:
      "Em vez de um nome da lista, o programa também entende o número ou a palavra curta - por exemplo, de uma tabela própria.",
    nichtLesbar:
      "Não é possível ler este ficheiro como ficheiro Excel. Guarde-o como livro do Excel (.xlsx) e selecione-o outra vez.",
    blattLeer: (blatt: string) =>
      `A folha "${blatt}" está vazia. Escreva os nomes por baixo da linha de cabeçalho.`,
    keinKopf: (name: string, passwort: string) =>
      `Falta no ficheiro a linha de cabeçalho com "${name}" e "${passwort}". Use o modelo (botão "Transferir modelo (Excel)").`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `A turma selecionada (${klasse}) é diferente do título do ficheiro (${titel}). As contas são criadas na turma selecionada - verifique se é isso que pretende.`,
    startDerKlasse: "ponto de partida da turma",
    nameFehlt: "Falta o nome.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "pt", {
        one: (z) => `A palavra-passe tem menos de ${z} caráter.`,
        other: (z) => `A palavra-passe tem menos de ${z} carateres.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `"${zelle}" não é um ponto de partida. Pode usar os números 1 a ${anzahl} da folha "${blatt}" - ou deixar a célula vazia.`,
    keineEmail: (zelle: string) =>
      `"${zelle}" não parece um endereço de e-mail - a célula também pode ficar vazia.`,
    nameSchonDa: "Este nome já existe na turma.",
    nameDoppelt: (zeile: number) => `O ficheiro já tem este nome na linha ${zeile}.`,
    zeile: (zeile: number) => `Linha ${zeile}`,
  },
  br: {
    blattKinder: BLATT_KINDER_BR,
    blattHinweise: BLATT_HINWEISE_BR,
    blattListen: BLATT_LISTEN_BR,
    kopfName: KOPF_NAME_BR,
    kopfPasswort: KOPF_PASSWORT_BR,
    kopfStart: KOPF_START_BR,
    kopfEmail: KOPF_EMAIL_BR,
    fuerAlleText: FUER_ALLE_TEXT_BR,
    fuerAlleSatz:
      "Vale para cada pessoa em que você não escolher outra opção na coluna C. A lista de seleção abre com Alt + seta para baixo (no Mac: Option + seta para baixo). A coluna Senha pode ficar em branco: o aplicativo cria a senha.",
    auswahlFehler: "Escolha um ponto de partida da lista.",
    auswahlTitel: "Ponto de partida",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_BR,
    datei: "Modelo-estudantes",
    stand: (datum: string) => `Última atualização: ${datum}`,
    soAusfuellen: "Como preencher o modelo",
    soGehtEs: "Passo a passo",
    dieSpalten: "As colunas",
    spalte: "Coluna",
    wasHinein: "O que colocar",
    dieStartniveaus: "Os pontos de partida",
    nummer: "Número",
    startniveauInTastenflow: "Ponto de partida no Tastenflow",
    kurzwort: "Abreviação",
    schritt1: (blatt: string) =>
      `1. Na planilha ${blatt}, escreva uma linha para cada pessoa: o nome e, se quiser, uma senha.`,
    schritt2:
      "2. Se a senha ficar em branco, o aplicativo cria uma, por exemplo km482. Depois, todas as senhas aparecem em Imprimir dados de acesso.",
    schritt3:
      "3. No alto, na caixa \"para todas as pessoas\", escolha por onde a turma começa no Tastenflow. Vale para cada pessoa em que você não escolher outra opção na coluna C.",
    schritt4:
      "4. Se alguém deve começar em outro ponto, escolha outro ponto de partida na linha dessa pessoa, na coluna C. A lista de seleção abre com Alt + seta para baixo (no Mac: Option + seta para baixo).",
    schritt5:
      "5. Salve o arquivo e, no Tastenflow, escolha Adicionar estudantes de um arquivo Excel. Estudantes entram na turma selecionada ali. Antes de criar as contas, o aplicativo mostra uma prévia.",
    spalteName: "O nome que a pessoa usa para entrar. Cada nome só pode aparecer uma vez por turma.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "br", {
        one: (z) => `Pelo menos ${z} caractere.`,
        other: (z) => `Pelo menos ${z} caracteres.`,
      }) + " Em branco: o aplicativo cria uma senha fácil de digitar.",
    spalteStart:
      "Já vem preenchida com a escolha da caixa \"para todas as pessoas\". Mude só onde alguém deve começar em outro ponto.",
    spalteEmail:
      "Pode ficar em branco. Se houver um endereço aqui, os dados de acesso vão automaticamente por e-mail - ao criar a conta e a cada nova redefinição de senha.",
    nachsatz:
      "Em vez de um nome da lista, o aplicativo também entende o número ou a abreviação - por exemplo, de uma tabela sua.",
    nichtLesbar:
      "Não foi possível ler este arquivo como arquivo do Excel. Salve-o como pasta de trabalho do Excel (.xlsx) e escolha de novo.",
    blattLeer: (blatt: string) =>
      `A planilha ${blatt} está vazia. Escreva os nomes abaixo da linha de cabeçalho.`,
    keinKopf: (name: string, passwort: string) =>
      `Falta no arquivo a linha de cabeçalho com as colunas ${name} e ${passwort}. Use o modelo (botão Baixar modelo (Excel)).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `A turma selecionada (${klasse}) é diferente do título do arquivo (${titel}). As contas serão criadas na turma selecionada - verifique se é isso mesmo que você quer.`,
    startDerKlasse: "ponto de partida da turma",
    nameFehlt: "Falta o nome.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "br", {
        one: (z) => `A senha tem menos de ${z} caractere.`,
        other: (z) => `A senha tem menos de ${z} caracteres.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `O valor ${zelle} não é um ponto de partida. Use os números de 1 a ${anzahl} da planilha ${blatt} - ou deixe a célula em branco.`,
    keineEmail: (zelle: string) =>
      `O valor ${zelle} não parece um endereço de e-mail - a célula também pode ficar em branco.`,
    nameSchonDa: "Este nome já existe na turma.",
    nameDoppelt: (zeile: number) => `O nome já aparece na linha ${zeile} do arquivo.`,
    zeile: (zeile: number) => `Linha ${zeile}`,
  },
  ro: {
    blattKinder: BLATT_KINDER_RO,
    blattHinweise: BLATT_HINWEISE_RO,
    blattListen: BLATT_LISTEN_RO,
    kopfName: KOPF_NAME_RO,
    kopfPasswort: KOPF_PASSWORT_RO,
    kopfStart: KOPF_START_RO,
    kopfEmail: KOPF_EMAIL_RO,
    fuerAlleText: FUER_ALLE_TEXT_RO,
    fuerAlleSatz:
      "Se aplică fiecărei persoane pentru care nu alegeți altceva în coloana C. Lista derulantă se deschide cu Alt + săgeată în jos (pe Mac: Opțiune + săgeată în jos). Coloana Parolă poate rămâne goală: parola o creează programul.",
    auswahlFehler: "Alegeți un punct de plecare din listă.",
    auswahlTitel: "Punct de plecare",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_RO,
    datei: "Șablon-elevi",
    stand: (datum: string) => `Ultima actualizare: ${datum}`,
    soAusfuellen: "Cum completați șablonul",
    soGehtEs: "Pașii",
    dieSpalten: "Coloanele",
    spalte: "Coloană",
    wasHinein: "Ce se scrie aici",
    dieStartniveaus: "Punctele de plecare",
    nummer: "Număr",
    startniveauInTastenflow: "Punct de plecare în Tastenflow",
    kurzwort: "Cuvânt scurt",
    schritt1: (blatt: string) =>
      `1. În foaia ${blatt}, scrieți câte un rând pentru fiecare persoană: numele și, dacă doriți, o parolă.`,
    schritt2:
      "2. O parolă goală o creează programul, de exemplu km482. Toate parolele se găsesc apoi la butonul Imprimați datele de conectare.",
    schritt3:
      "3. Sus, în câmpul „pentru toți”, alegeți de unde încep elevii în Tastenflow. Se aplică fiecărei persoane pentru care nu alegeți altceva în coloana C.",
    schritt4:
      "4. Dacă cineva trebuie să înceapă altundeva, alegeți în rândul acestei persoane, în coloana C, alt punct de plecare. Lista derulantă se deschide cu Alt + săgeată în jos (pe Mac: Opțiune + săgeată în jos).",
    schritt5:
      "5. Salvați fișierul și alegeți în Tastenflow butonul Adăugați elevi dintr-un fișier Excel. Elevii se adaugă în clasa aleasă acolo. Înainte de crearea conturilor, programul arată o previzualizare.",
    spalteName: "Numele cu care se conectează persoana. Fiecare nume doar o dată în clasă.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "ro", {
        one: (_z) => "Cel puțin un caracter.",
        few: (z) => `Cel puțin ${z} caractere.`,
        other: (z) => `Cel puțin ${z} de caractere.`,
      }) + " Câmp gol: programul creează o parolă ușor de scris.",
    spalteStart:
      "Este deja completată - cu alegerea din câmpul „pentru toți”. Schimbați-o doar acolo unde cineva trebuie să înceapă altundeva.",
    spalteEmail:
      "Poate rămâne goală. Dacă aici există o adresă, datele de conectare sosesc automat prin e-mail - la adăugare și la fiecare resetare a parolei.",
    nachsatz:
      "În locul unui nume din listă, programul înțelege și numărul sau cuvântul scurt - de exemplu dintr-un tabel propriu.",
    nichtLesbar:
      "Acest fișier nu se poate citi ca fișier Excel. Salvați-l ca registru de lucru Excel (.xlsx) și alegeți-l din nou.",
    blattLeer: (blatt: string) =>
      `Foaia ${blatt} este goală. Scrieți elevii sub rândul de antet.`,
    keinKopf: (name: string, passwort: string) =>
      `În fișier lipsește rândul de antet cu coloanele ${name} și ${passwort}. Folosiți șablonul (butonul Descărcați șablonul (Excel)).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Clasa aleasă (${klasse}) diferă de titlul fișierului (${titel}). Conturile se creează în clasa aleasă - verificați dacă așa doriți.`,
    startDerKlasse: "punctul de plecare al clasei",
    nameFehlt: "Lipsește numele.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "ro", {
        one: (_z) => "Parola are mai puțin de un caracter.",
        few: (z) => `Parola are mai puțin de ${z} caractere.`,
        other: (z) => `Parola are mai puțin de ${z} de caractere.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `Valoarea ${zelle} nu este un punct de plecare. Se pot folosi numerele de la 1 la ${anzahl} din foaia ${blatt} - sau lăsați celula goală.`,
    keineEmail: (zelle: string) =>
      `Valoarea ${zelle} nu arată ca o adresă de e-mail - celula poate rămâne și goală.`,
    nameSchonDa: "Acest nume există deja în clasă.",
    nameDoppelt: (zeile: number) => `Rândul ${zeile} din fișier conține deja acest nume.`,
    zeile: (zeile: number) => `Rândul ${zeile}`,
  },
  sv: {
    blattKinder: BLATT_KINDER_SV,
    blattHinweise: BLATT_HINWEISE_SV,
    blattListen: BLATT_LISTEN_SV,
    kopfName: KOPF_NAME_SV,
    kopfPasswort: KOPF_PASSWORT_SV,
    kopfStart: KOPF_START_SV,
    kopfEmail: KOPF_EMAIL_SV,
    fuerAlleText: FUER_ALLE_TEXT_SV,
    fuerAlleSatz:
      "Gäller för varje elev som du inte väljer något annat för i kolumn C. Listrutan öppnas med Alt + Nedåtpil (på Mac: Alternativ + Nedåtpil). Kolumnen Lösenord kan vara tom: programmet skapar ett lösenord.",
    auswahlFehler: "Välj en startpunkt i listan.",
    auswahlTitel: "Startpunkt",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_SV,
    datei: "Elevmall",
    stand: (datum: string) => `Senast uppdaterad: ${datum}`,
    soAusfuellen: "Så fyller du i mallen",
    soGehtEs: "Så gör du",
    dieSpalten: "Kolumnerna",
    spalte: "Kolumn",
    wasHinein: "Vad som ska stå där",
    dieStartniveaus: "Startpunkterna",
    nummer: "Nummer",
    startniveauInTastenflow: "Startpunkt i Tastenflow",
    kurzwort: "Kortord",
    schritt1: (blatt: string) =>
      `1. Fyll i en rad per elev på bladet ${blatt}: namnet och, om du vill, ett lösenord.`,
    schritt2:
      "2. Om lösenordet är tomt skapar programmet ett, till exempel km482. Alla lösenord finns sedan under Skriv ut inloggningsuppgifter.",
    schritt3:
      "3. Högst upp, i rutan \"för alla\", väljer du var eleverna ska börja i Tastenflow. Det gäller för varje elev som du inte väljer något annat för i kolumn C.",
    schritt4:
      "4. Om en elev ska börja någon annanstans väljer du en annan startpunkt i kolumn C på elevens rad. Listrutan öppnas med Alt + Nedåtpil (på Mac: Alternativ + Nedåtpil).",
    schritt5:
      "5. Spara filen och välj Lägg till elever från en Excel-fil i Tastenflow. Eleverna läggs till i den klass som är vald där. Innan någon läggs till visar programmet en förhandsvisning.",
    spalteName: "Namnet som eleven loggar in med. Varje namn får bara finnas en gång per klass.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "sv", {
        one: (z) => `Minst ${z} tecken.`,
        other: (z) => `Minst ${z} tecken.`,
      }) + " Tomt fält: programmet skapar ett lösenord som är lätt att skriva.",
    spalteStart:
      "Är redan ifylld - med valet från rutan \"för alla\". Välj bara något annat där en elev ska börja någon annanstans.",
    spalteEmail:
      "Kan lämnas tom. Om det står en adress här får eleven sina inloggningsuppgifter automatiskt via e-post - när eleven läggs till och varje gång lösenordet återställs.",
    nachsatz:
      "I stället för ett namn från listan förstår programmet också numret eller kortordet - till exempel från en egen tabell.",
    nichtLesbar:
      "Det går inte att läsa filen som en Excel-fil. Spara den som en Excel-arbetsbok (.xlsx) och välj den igen.",
    blattLeer: (blatt: string) =>
      `Bladet ${blatt} är tomt. Fyll i eleverna under rubrikraden.`,
    keinKopf: (name: string, passwort: string) =>
      `Rubrikraden med ${name} och ${passwort} saknas i filen. Använd mallen (knappen Ladda ned mall (Excel)).`,
    // Klasse in Klammern, damit kein Satz auf einer Zahl endet (wie cs).
    fremdeKlasse: (titel: string, klasse: string) =>
      `Den valda klassen (${klasse}) stämmer inte med filens rubrik (${titel}). Eleverna läggs till i den valda klassen - kontrollera att det är rätt.`,
    startDerKlasse: "klassens startpunkt",
    nameFehlt: "Namnet saknas.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "sv", {
        one: (z) => `Lösenordet har färre än ${z} tecken.`,
        other: (z) => `Lösenordet har färre än ${z} tecken.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `${zelle} är ingen startpunkt. Du kan använda numren 1 till ${anzahl} från bladet ${blatt} - eller lämna cellen tom.`,
    keineEmail: (zelle: string) =>
      `${zelle} ser inte ut som en e-postadress - du kan också lämna cellen tom.`,
    nameSchonDa: "Det finns redan en elev med det namnet i klassen.",
    nameDoppelt: (zeile: number) => `Rad ${zeile} i filen innehåller redan det här namnet.`,
    zeile: (zeile: number) => `Rad ${zeile}`,
  },
  uk: {
    blattKinder: BLATT_KINDER_UK,
    blattHinweise: BLATT_HINWEISE_UK,
    blattListen: BLATT_LISTEN_UK,
    kopfName: KOPF_NAME_UK,
    kopfPasswort: KOPF_PASSWORT_UK,
    kopfStart: KOPF_START_UK,
    kopfEmail: KOPF_EMAIL_UK,
    fuerAlleText: FUER_ALLE_TEXT_UK,
    fuerAlleSatz:
      "Діє для кожної особи, для якої ви не виберете інше в стовпці C. Розкривний список відкривається клавішами Alt + стрілка вниз (на Mac: Option + стрілка вниз). Стовпець Пароль можна залишити порожнім: пароль створить програма.",
    auswahlFehler: "Виберіть, будь ласка, точку старту зі списку.",
    auswahlTitel: "Точка старту",
    titelZusatz: VORLAGE_TITEL_ZUSATZ_UK,
    datei: "Шаблон-учні",
    stand: (datum: string) => `Останнє оновлення: ${datum}`,
    soAusfuellen: "Як заповнити шаблон",
    soGehtEs: "Як це працює",
    dieSpalten: "Стовпці",
    spalte: "Стовпець",
    wasHinein: "Що сюди вписати",
    dieStartniveaus: "Точки старту",
    nummer: "Номер",
    startniveauInTastenflow: "Точка старту в Tastenflow",
    kurzwort: "Скорочення",
    schritt1: (blatt: string) =>
      `1. На аркуші ${blatt} впишіть для кожної особи один рядок: ім'я і, за потреби, пароль.`,
    schritt2:
      "2. Порожній пароль створить програма, наприклад km482. Усі паролі потім є за кнопкою Друкувати дані для входу.",
    schritt3:
      "3. Угорі в полі «для всіх» виберіть, з чого учні почнуть у Tastenflow. Це діє для кожної особи, для якої ви не виберете інше в стовпці C.",
    schritt4:
      "4. Якщо хтось має почати з іншого місця, виберіть у рядку цієї особи в стовпці C іншу точку старту. Розкривний список відкривається клавішами Alt + стрілка вниз (на Mac: Option + стрілка вниз).",
    schritt5:
      "5. Збережіть файл і в Tastenflow виберіть кнопку Додати учнів з файлу Excel. Учні потраплять до класу, який там вибрано. Перед створенням облікових записів програма покаже попередній перегляд.",
    spalteName: "Ім'я, з яким особа входить. Кожне ім'я може бути в класі лише один раз.",
    spaltePasswort: (min: number) =>
      mehrzahl(min, "uk", {
        one: (z) => `Щонайменше ${z} знак.`,
        few: (z) => `Щонайменше ${z} знаки.`,
        many: (z) => `Щонайменше ${z} знаків.`,
        other: (z) => `Щонайменше ${z} знака.`,
      }) + " Порожнє поле: програма створить пароль, який легко надрукувати.",
    spalteStart:
      "Уже заповнено - вибором із поля «для всіх». Змінюйте лише там, де хтось має почати з іншого місця.",
    spalteEmail:
      "Може залишатися порожнім. Якщо тут є адреса, дані для входу надходять автоматично електронною поштою - під час створення облікового запису та під час кожного наступного скидання пароля.",
    nachsatz:
      "Замість назви зі списку програма розуміє також номер або скорочення - наприклад, із власної таблиці.",
    nichtLesbar:
      "Цей файл не вдається прочитати як файл Excel. Збережіть його як книгу Excel (.xlsx) і виберіть ще раз.",
    blattLeer: (blatt: string) =>
      `Аркуш ${blatt} порожній. Впишіть учнів під рядком заголовків.`,
    keinKopf: (name: string, passwort: string) =>
      `У файлі немає рядка заголовків зі стовпцями ${name} і ${passwort}. Скористайтеся шаблоном (кнопка Завантажити шаблон (Excel)).`,
    fremdeKlasse: (titel: string, klasse: string) =>
      `Вибраний клас (${klasse}) відрізняється від заголовка файлу (${titel}). Облікові записи буде створено у вибраному класі - перевірте, чи так і має бути.`,
    startDerKlasse: "точка старту класу",
    nameFehlt: "Немає імені.",
    passwortKurz: (min: number) =>
      mehrzahl(min, "uk", {
        one: (z) => `Пароль має менше ніж ${z} знак.`,
        few: (z) => `Пароль має менше ніж ${z} знаки.`,
        many: (z) => `Пароль має менше ніж ${z} знаків.`,
        other: (z) => `Пароль має менше ніж ${z} знака.`,
      }),
    keinStartniveau: (zelle: string, anzahl: number, blatt: string) =>
      `Значення ${zelle} не є точкою старту. Можна використати номери 1-${anzahl} з аркуша ${blatt} - або залишити клітинку порожньою.`,
    keineEmail: (zelle: string) =>
      `Значення ${zelle} не схоже на адресу електронної пошти - клітинку можна залишити й порожньою.`,
    nameSchonDa: "У класі вже є учень із таким іменем.",
    nameDoppelt: (zeile: number) => `У файлі це ім'я вже є в рядку ${zeile}.`,
    zeile: (zeile: number) => `Рядок ${zeile}`,
  },
});

/** „19 September 2026" - das englische Datum (Glossar §1.2). */
function datumEnglisch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** ★ E11a-5 (26.09.2026): „19 septembre 2026" - das französische Datum (Bauplan §9.1). */
function datumFranzoesisch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** ★ O-PL (02.10.2026): „21 września 2026 r." - Monat im Genitiv (Intl), „r." nach dem Jahr (Glossar §2.7/§2.10). */
function datumPolnisch(jetztMs: number): string {
  return `${new Date(jetztMs).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })} r.`;
}

/** ★ O-TR (02.10.2026): "21 Eylül 2026" - das türkische Datum (Glossar §2.10, gemessen mit Intl). */
function datumTuerkisch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

/** ★ O-CS (03.10.2026): „2. října 2026" - Monat im Genitiv (Intl, Glossar §2.10, §4 Falle 7). */
function datumTschechisch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * ★ E11a-5: das Datum der Unterzeile je Sprache - Tabelle statt `sprache ===
 * "en" ? … : Deutsch` (die Weiche gab „fr" das deutsche Datum, Falle 30).
 */
/** ★ ES-O (27.09.2026): „19 de septiembre de 2026" - das spanische Datum. */
function datumSpanisch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

/** ★ O-IT (02.10.2026): „19 settembre 2026" - das italienische Datum (Glossar §2.10). */
function datumItalienisch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

/** ★ O2-SONST (30.10.2026): das Datum der neun über das Gebiet der Sprache. */
function datumGebiet(sprache: AktiveBedienSprache): (jetztMs: number) => string {
  return (ms) => new Date(ms).toLocaleDateString(GEBIET[sprache], { day: "numeric", month: "long", year: "numeric" });
}

const DATUM_JE_SPRACHE: Record<AktiveBedienSprache, (jetztMs: number) => string> = {
  de: (ms) => datumDeutsch(ms),
  en: datumEnglisch,
  fr: datumFranzoesisch,
  es: datumSpanisch,
  it: datumItalienisch,
  pl: datumPolnisch,
  tr: datumTuerkisch,
  cs: datumTschechisch,
  bg: datumGebiet("bg"),
  el: datumGebiet("el"),
  hu: datumGebiet("hu"),
  nl: datumGebiet("nl"),
  pt: datumGebiet("pt"),
  br: datumGebiet("br"),
  ro: datumGebiet("ro"),
  sv: datumGebiet("sv"),
  uk: datumGebiet("uk"),
};

/** „Klasse 3b - Teilnehmer anlegen" - die Überschrift beider Blätter (englisch „Class 3b - Add pupils"). */
export function vorlageTitel(
  klassenname: string | null | undefined,
  sprache: AktiveBedienSprache = "de",
): string {
  return `${klassenBezeichnung(klassenname, sprache)} - ${VORLAGE_TEXTE[sprache].titelZusatz}`;
}

/** `Teilnehmer-Vorlage_3b_2026-09-13.xlsx` - Ortszeit, Klassenname dateisystemtauglich (englisch `Pupil-template_…`). */
export function vorlageDateiname(
  klassenname: string | null | undefined,
  jetztMs: number,
  sprache: AktiveBedienSprache = "de",
): string {
  return `${VORLAGE_TEXTE[sprache].datei}_${dateisystemName(klassenname)}_${datumIso(jetztMs)}.xlsx`;
}

/** Bezug der Auswahlliste auf das ausgeblendete Blatt: `Listen!$A$1:$A$7` (englisch `Lists!…`). */
export function listenBezug(anzahl: number, sprache: AktiveBedienSprache = "de"): string {
  return `${VORLAGE_TEXTE[sprache].blattListen}!$A$1:$A$${anzahl}`;
}

/**
 * ★ Die Mindestlänge ist DIESELBE wie beim Formular und am Server (4 Zeichen
 * für Kinder) - aus `passwort.ts`, keine zweite Zahl.
 */
export const MIN_PASSWORT_KIND = minPasswortLaenge("tt_pupils");

// ── Passwort erzeugen ──────────────────────────────────────────────────────

/*
 * ★★ LEICHT TIPPBAR (Entscheidung 3, auf 5 Zeichen gekürzt am 14.09.2026).
 * Ein Kind, das gerade das Zehnfinger-Schreiben lernt, tippt das Passwort
 * Zeichen für Zeichen - ein Kind mit Blindheit liest es von der Braillezeile.
 * Darum, wie zuvor beim Wort-Format:
 *  · nur Kleinbuchstaben, keine Umschalttaste;
 *  · kein ä ö ü ß (fehlen auf manchen Tastaturen, ß tippt sich in der
 *    Braille-Schrift anders);
 *  · kein y und kein z - die tauschen zwischen deutscher und englischer
 *    Tastatur den Platz;
 *  · kein l (sieht aus wie I und 1) und keine Ziffern 0 und 1 (O, l, I).
 * Fünf Zeichen aus Buchstaben und Ziffern gemischt, z. B. „km482" - kürzer
 * zu tippen als das vorherige „sonne472" und mit 31^5 (≈ 28,6 Mio.)
 * Möglichkeiten breiter als dessen 32.768.
 */
export const PASSWORT_BUCHSTABEN = "abcdefghijkmnopqrstuvwx";
export const PASSWORT_ZIFFERN = "23456789";
const PASSWORT_LAENGE = 5;

/** Zufall in [0, 1) - aus `crypto`, wo es das gibt (Passwörter!). */
function standardZufall(): number {
  const c = globalThis.crypto;
  if (c?.getRandomValues) return c.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
  return Math.random();
}

function waehle<T>(liste: ArrayLike<T>, zufall: () => number): T {
  const i = Math.min(liste.length - 1, Math.max(0, Math.floor(zufall() * liste.length)));
  return liste[i];
}

/** Ein leicht tippbares Passwort, z. B. „km482". Zufall injizierbar für Tests. */
export function erzeugePasswort(zufall: () => number = standardZufall): string {
  const alphabet = PASSWORT_BUCHSTABEN + PASSWORT_ZIFFERN;
  let ergebnis = "";
  for (let i = 0; i < PASSWORT_LAENGE; i++) ergebnis += waehle(alphabet, zufall);
  return ergebnis;
}

// ── Startniveau aus einer Zelle ────────────────────────────────────────────

/** Klein, ß als ss (auch „Grossschreibung" aus der Schweiz), ohne Leerraum. */
// ★ O-TR (02.10.2026): `"İ".toLowerCase()` ist "i" + U+0307 (Glossar §4 Nr. 1) - der
// kombinierende Punkt fällt weg, damit "İlk harfler" und "ilk harfler" gleich sind.
// Für de/en/fr/es/it/pl ändert das nichts (dort kommt U+0307 nicht vor).
const ohneLeerraum = (s: string) =>
  s.toLowerCase().replace(/\u0307/g, "").replace(/ß/g, "ss").replace(/\s+/g, "");

/**
 * Das Startniveau aus der Zelle „Tastenflow: womit anfangen?".
 * Akzeptiert: die Nummer 1-7 (Reihenfolge der Liste), das Kurzwort (`key`,
 * z. B. „start") oder den Namen, wie er im Formular steht - Gross/klein und
 * Leerzeichen egal. Beim Namen genügt auch der Teil vor der Klammer
 * („Grundstellung"): Der Klammerteil nennt die Tasten und hängt an der
 * Tastatur, auf der die Vorlage heruntergeladen wurde.
 *
 * @returns `undefined` bei leerer Zelle (Vorgabe gilt), `null` wenn unbekannt.
 */
export function startniveauAusZelle(
  zelle: string,
  /** ★ E1 (24.09.2026): Pflicht - die Startpunkte im Lernweg der Klasse. */
  punkte: StartPoint[],
): StartPoint | null | undefined {
  const roh = zelle.trim();
  if (!roh) return undefined;
  if (/^\d+$/.test(roh)) {
    const nr = Number(roh);
    return nr >= 1 && nr <= punkte.length ? punkte[nr - 1] : null;
  }
  const w = ohneLeerraum(roh);
  return (
    punkte.find((p) => ohneLeerraum(p.label) === w || ohneLeerraum(p.key) === w) ??
    punkte.find((p) => {
      const kurz = ohneLeerraum(p.label.split("(")[0]);
      return kurz !== "" && kurz === w;
    }) ??
    null
  );
}

/**
 * Womit die Vorlage „für alle" vorbelegt ist: das Startniveau der Klasse
 * (`cls.startUnits`), sonst das erste - wie `pupilStart` im Formular.
 */
export function vorbelegtesStartniveau(
  startUnits: number | null | undefined,
  /** ★ E1 (24.09.2026): Pflicht - die Startpunkte im Lernweg der Klasse. */
  punkte: StartPoint[],
): StartPoint {
  return punkte.find((p) => p.units === startUnits) ?? punkte[0];
}

// ── Die Vorlage ────────────────────────────────────────────────────────────

/** Was die Vorlage über die Klasse wissen muss. */
export interface VorlageKlasse {
  name?: string | null;
  startUnits?: number | null;
  /**
   * ★ E1 (24.09.2026): der Lernweg der Klasse - `startUnits` und die
   * Startniveau-Liste sind Anzahlen in ihm. Fehlend = „de" (`lernwegVon`).
   */
  lernweg?: Lernweg;
  /**
   * ★ 18.10.2026: Hat die Klasse Tastenflow? Nur dann trägt die Vorlage die
   * Spalte „Tastenflow: womit anfangen?". Fehlend = ja (wie bisher).
   * Gilt nur für Deutsch (`OHNE_START_DE`).
   */
  mitStart?: boolean;
}

/**
 * Die Texte des Blattes „Hinweise" - einfache Sprache, WENIG Text
 * ([[feedback_uebungsdateien_weniger_text_mehr_ueben]] gilt hier sinngemäss).
 * ⚠️ Ohne Maus-Wörter: „wählen", nicht „klicken"; der Tastenweg zur Liste steht
 * dabei.
 */
export function vorlageHinweise(
  /** ★ E1 (24.09.2026): Pflicht - die Startpunkte im Lernweg der Klasse. */
  punkte: StartPoint[],
  sprache: AktiveBedienSprache = "de",
  /** ★ 18.10.2026: `false` ⇒ Fassung ohne Startniveau (nur Deutsch). */
  mitStart = true,
): {
  schritte: string[];
  spalten: [string, string][];
  liste: [string, string, string][];
  nachsatz: string;
} {
  const t = VORLAGE_TEXTE[sprache];
  if (!mitStart && sprache === "de") {
    return {
      schritte: [t.schritt1(t.blattKinder), t.schritt2, OHNE_START_DE.schritt3],
      spalten: [
        [t.kopfName, t.spalteName],
        [t.kopfPasswort, t.spaltePasswort(MIN_PASSWORT_KIND)],
        [t.kopfEmail, t.spalteEmail],
      ],
      liste: [],
      nachsatz: "",
    };
  }
  return {
    schritte: [t.schritt1(t.blattKinder), t.schritt2, t.schritt3, t.schritt4, t.schritt5],
    spalten: [
      [t.kopfName, t.spalteName],
      [t.kopfPasswort, t.spaltePasswort(MIN_PASSWORT_KIND)],
      [t.kopfStart, t.spalteStart],
      [t.kopfEmail, t.spalteEmail],
    ],
    liste: punkte.map((p, i) => [String(i + 1), p.label, p.key]),
    nachsatz: t.nachsatz,
  };
}

/** Eine Kopfzeile: Akzentgrund, weiss, fett. */
function kopfzeile(ws: Blatt, zeile: number, koepfe: readonly string[], zentriert: boolean): void {
  koepfe.forEach((kopf, i) => {
    const c = ws.getCell(zeile, i + 1);
    c.value = kopf;
    c.font = schrift({ size: 11, bold: true, color: { argb: argb(FARBE.weiss) } });
    c.fill = flaeche(FARBE.akzent);
    c.alignment = zentriert
      ? { vertical: "middle", horizontal: "center" }
      : { vertical: "middle", horizontal: "left", indent: 1 };
    c.border = linienRundum(FARBE.weiss);
  });
  ws.getRow(zeile).height = 24;
}

async function schreibeKinderBlatt(
  wb: Mappe,
  ws: Blatt,
  o: {
    titel: string;
    jetztMs: number;
    vorbelegt: StartPoint;
    punkte: StartPoint[];
    sprache: AktiveBedienSprache;
    /** ★ 18.10.2026: `false` ⇒ ohne Startniveau-Spalte (nur Deutsch). */
    mitStart: boolean;
  },
): Promise<void> {
  const t = VORLAGE_TEXTE[o.sprache];
  const breiteC = Math.max(44, ...o.punkte.map((p) => p.label.length + 8));
  const spaltenZahl = o.mitStart ? 4 : 3;
  ws.columns = o.mitStart
    ? [{ width: 30 }, { width: 20 }, { width: breiteC }, { width: 28 }]
    : [{ width: 30 }, { width: 20 }, { width: 34 }];
  await setzeMarkenKopf(wb, ws, {
    titel: o.titel,
    unterzeile: t.stand(DATUM_JE_SPRACHE[o.sprache](o.jetztMs)),
    // Ohne Angabe bleibt die deutsche Datei Byte für Byte, wie sie war.
    // ★ E11a-5: jede übersetzte Sprache reicht sich selbst herein (bis dahin nur „en").
    ...(o.sprache !== "de" ? { sprache: o.sprache } : {}),
    // ★ 18.10.2026: eine Vorlage OHNE Tastenflow trägt nicht den Namen Tastenflow.
    ...(o.mitStart ? {} : { marke: "Lernwerkstatt" }),
  });
  ws.getRow(4).height = 10;

  const auswahl = {
    type: "list" as const,
    allowBlank: true,
    formulae: [listenBezug(o.punkte.length, o.sprache)],
    showErrorMessage: true,
    errorStyle: "stop",
    errorTitle: t.auswahlTitel,
    error: t.auswahlFehler,
  };
  const akzent = { style: "thin" as const, color: { argb: argb(FARBE.akzent) } };

  // ── Der Kasten „für alle übernehmen" (nur mit Startniveau) ─────────────
  const fz = VORLAGE.fuerAlleZeile;
  if (o.mitStart) {
  ws.mergeCells(fz, 1, fz, 2);
  const text = ws.getCell(fz, 1);
  text.value = t.fuerAlleText;
  text.font = schrift({ size: 11, bold: true, color: { argb: argb(FARBE.akzent) } });
  text.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  for (const k of [1, 2]) {
    const c = ws.getCell(fz, k);
    c.fill = flaeche(FARBE.akzentHell);
    c.border = { top: akzent, ...(k === 1 ? { left: akzent } : {}) };
  }
  const wahl = ws.getCell(FUER_ALLE_ZELLE);
  wahl.value = o.vorbelegt.label;
  wahl.font = schrift({ size: 11, bold: true });
  wahl.fill = flaeche(FARBE.weiss);
  wahl.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  const kraeftig = { style: "medium" as const, color: { argb: argb(FARBE.akzent) } };
  wahl.border = { top: kraeftig, left: kraeftig, bottom: kraeftig, right: kraeftig };
  wahl.dataValidation = { ...auswahl };
  ws.getRow(fz).height = 28;
  } else {
    // Zeile bleibt als Abstand stehen - die Zeilen darunter (Kopf in Zeile 8)
    // behalten ihre Nummern in beiden Fassungen.
    ws.getRow(fz).height = 10;
  }

  const hz = VORLAGE.hinweisZeile;
  ws.mergeCells(hz, 1, hz, spaltenZahl);
  const satz = ws.getCell(hz, 1);
  satz.value = o.mitStart ? t.fuerAlleSatz : OHNE_START_DE.hinweisSatz;
  satz.font = schrift({ size: 9, color: { argb: argb(FARBE.gedaempft) } });
  satz.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };
  for (let k = 1; k <= spaltenZahl; k++) {
    const c = ws.getCell(hz, k);
    c.fill = flaeche(FARBE.akzentHell);
    c.border = {
      bottom: akzent,
      // ohne Startniveau hat der Kasten oben keine Kanten - dann auch hier nur unten und seitlich
      ...(o.mitStart ? {} : { top: akzent }),
      ...(k === 1 ? { left: akzent } : {}),
      ...(k === spaltenZahl ? { right: akzent } : {}),
    };
  }
  // ★ 32 statt 20 (14.09.2026): der Satz trägt jetzt zusätzlich den
  // Passwort-Hinweis - „da kommt aber niemand drauf" (Johannes), solange er
  // nur im Hinweise-Blatt stand. Zwei Zeilen bei wrapText brauchen mehr Höhe.
  ws.getRow(hz).height = 32;
  ws.getRow(hz + 1).height = 12;

  // ── Die Tabelle ───────────────────────────────────────────────────────
  kopfzeile(
    ws,
    VORLAGE.kopfZeile,
    o.mitStart
      ? [t.kopfName, t.kopfPasswort, t.kopfStart, t.kopfEmail]
      : [t.kopfName, t.kopfPasswort, t.kopfEmail],
    true,
  );
  for (let r = 0; r < VORLAGE.kinderZeilen; r++) {
    const zeile = ws.getRow(VORLAGE.ersteKindZeile + r);
    zeile.height = 20;
    const grund = r % 2 === 0 ? FARBE.weiss : FARBE.grundHell;
    for (let k = 1; k <= spaltenZahl; k++) {
      const c = zeile.getCell(k);
      c.font = schrift({ size: 11 });
      c.fill = flaeche(grund);
      c.border = linienRundum();
      c.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    }
    // ★ Als Text, damit ein Passwort wie 0815 seine Null behält.
    zeile.getCell(2).numFmt = "@";
    if (!o.mitStart) continue;
    const start = zeile.getCell(3);
    // ★ Mit gespeichertem Ergebnis: Die Datei trägt den Wert auch dort, wo
    // nichts neu rechnet (SheetJS liest das Ergebnis, nicht die Formel).
    start.value = { formula: FUER_ALLE_FORMEL, result: o.vorbelegt.label };
    start.dataValidation = { ...auswahl };
  }

  const erste = `A${VORLAGE.ersteKindZeile}`;
  ws.views = [
    {
      state: "frozen",
      ySplit: VORLAGE.kopfZeile,
      topLeftCell: erste,
      activeCell: erste,
      showGridLines: false,
    },
  ];
  ws.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    printTitlesRow: `${VORLAGE.kopfZeile}:${VORLAGE.kopfZeile}`,
    margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.7, header: 0.3, footer: 0.3 },
  };
}

async function schreibeHinweisBlatt(
  wb: Mappe,
  ws: Blatt,
  o: { titel: string; punkte: StartPoint[]; sprache: AktiveBedienSprache; mitStart: boolean },
): Promise<void> {
  const t = VORLAGE_TEXTE[o.sprache];
  const breiten = [30, 62, 16];
  const gesamt = breiten.reduce((s, b) => s + b, 0);
  ws.columns = breiten.map((width) => ({ width }));
  let z = await setzeMarkenKopf(wb, ws, {
    titel: o.titel,
    unterzeile: t.soAusfuellen,
    ...(o.sprache !== "de" ? { sprache: o.sprache } : {}),
    ...(o.mitStart ? {} : { marke: "Lernwerkstatt" }),
  });
  const h = vorlageHinweise(o.punkte, o.sprache, o.mitStart);

  const abschnitt = (text: string) => {
    ws.getRow(z++).height = 10;
    const c = ws.getCell(z, 1);
    c.value = text;
    c.font = schrift({ size: 13, bold: true, color: { argb: argb(FARBE.akzent) } });
    for (let k = 1; k <= 3; k++)
      ws.getCell(z, k).border = {
        bottom: { style: "medium", color: { argb: argb(FARBE.akzent) } },
      };
    ws.getRow(z++).height = 24;
    ws.getRow(z++).height = 6;
  };

  abschnitt(t.soGehtEs);
  h.schritte.forEach((schritt, i) => {
    ws.mergeCells(z, 1, z, 3);
    const c = ws.getCell(z, 1);
    c.value = schritt;
    c.font = schrift({ size: 11 });
    c.alignment = { vertical: "middle", wrapText: true, indent: 1 };
    for (let k = 1; k <= 3; k++) ws.getCell(z, k).fill = flaeche(i % 2 === 0 ? FARBE.akzentHell : FARBE.weiss);
    ws.getRow(z++).height = zeilenHoehe(schritt, gesamt - 4, 11);
  });

  abschnitt(t.dieSpalten);
  kopfzeile(ws, z, [t.spalte, t.wasHinein], false);
  ws.mergeCells(z, 2, z, 3);
  z++;
  h.spalten.forEach(([name, text], i) => {
    ws.mergeCells(z, 2, z, 3);
    const a = ws.getCell(z, 1);
    const b = ws.getCell(z, 2);
    a.value = name;
    b.value = text;
    a.font = schrift({ bold: true });
    b.font = schrift();
    for (let k = 1; k <= 3; k++) {
      const c = ws.getCell(z, k);
      c.fill = flaeche(i % 2 === 0 ? FARBE.weiss : FARBE.grundHell);
      c.border = linienRundum();
      c.alignment = { vertical: "top", wrapText: true, indent: 1 };
    }
    ws.getRow(z++).height = zeilenHoehe(text, breiten[1] + breiten[2] - 4);
  });

  if (h.liste.length > 0) {
  abschnitt(t.dieStartniveaus);
  kopfzeile(ws, z++, [t.nummer, t.startniveauInTastenflow, t.kurzwort], false);
  }
  h.liste.forEach((werte, i) => {
    werte.forEach((wert, k) => {
      const c = ws.getCell(z, k + 1);
      c.value = wert;
      c.font = schrift({ bold: k === 1 });
      c.fill = flaeche(i % 2 === 0 ? FARBE.weiss : FARBE.grundHell);
      c.border = linienRundum();
      c.alignment = { vertical: "middle", horizontal: k === 0 ? "center" : "left", indent: k === 0 ? 0 : 1 };
    });
    ws.getRow(z++).height = 19;
  });
  if (h.nachsatz) {
    ws.getRow(z++).height = 8;
    ws.mergeCells(z, 1, z, 3);
    const nach = ws.getCell(z, 1);
    nach.value = h.nachsatz;
    nach.font = schrift({ size: 9, color: { argb: argb(FARBE.gedaempft) } });
    nach.alignment = { vertical: "top", wrapText: true };
    ws.getRow(z).height = zeilenHoehe(h.nachsatz, gesamt, 9);
  }

  ws.views = [{ state: "normal", showGridLines: false, activeCell: "A1" }];
  ws.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.7, header: 0.3, footer: 0.3 },
  };
}

/**
 * ★★★ Die Vorlage als xlsx-Bytes (für den Download, für Tests und das
 * Muster-Skript). Blätter: „Teilnehmer", „Hinweise", „Listen" (ausgeblendet).
 */
export async function vorlageAlsBytes(
  klasse: VorlageKlasse = {},
  o: { jetztMs?: number; punkte?: StartPoint[]; sprache?: AktiveBedienSprache } = {},
): Promise<Uint8Array> {
  const sprache = o.sprache ?? "de";
  const t = VORLAGE_TEXTE[sprache];
  // ★ 18.10.2026: ohne Startniveau nur auf Deutsch (`OHNE_START_DE`).
  const mitStart = klasse.mitStart !== false || sprache !== "de";
  const punkte = o.punkte ?? startPunkte(sprache, lernwegVon(klasse));
  const jetztMs = o.jetztMs ?? Date.now();
  const titel = vorlageTitel(klasse.name, sprache);
  const wb = await neueMappe();
  const kinder = wb.addWorksheet(t.blattKinder, {
    properties: { tabColor: { argb: argb(FARBE.akzent) } },
  });
  const hinweise = wb.addWorksheet(t.blattHinweise, {
    properties: { tabColor: { argb: argb(FARBE.logoBlau) } },
  });
  // ★ Die Liste steht in einem Blatt, nicht als Text in der Datenüberprüfung:
  // Dort ist Platz für höchstens 255 Zeichen, und die sieben Namen sind lang.
  const listen = wb.addWorksheet(t.blattListen, { state: "hidden" });
  punkte.forEach((p, i) => {
    listen.getCell(i + 1, 1).value = p.label;
  });
  listen.getColumn(1).width = 60;

  await schreibeKinderBlatt(wb, kinder, {
    titel,
    jetztMs,
    vorbelegt: vorbelegtesStartniveau(klasse.startUnits, punkte),
    punkte,
    sprache,
    mitStart,
  });
  await schreibeHinweisBlatt(wb, hinweise, { titel, punkte, sprache, mitStart });
  return mappeAlsBytes(wb);
}

/** Lädt die Vorlage der Klasse herunter und gibt den Dateinamen zurück. */
export async function vorlageHerunterladen(
  klasse: VorlageKlasse,
  jetztMs: number = Date.now(),
  sprache: AktiveBedienSprache = "de",
): Promise<string> {
  const dateiname = vorlageDateiname(klasse.name, jetztMs, sprache);
  dateiHerunterladen(
    await vorlageAlsBytes(klasse, sprache !== "de" ? { jetztMs, sprache } : { jetztMs }),
    dateiname,
  );
  return dateiname;
}

// ── Die Datei lesen ────────────────────────────────────────────────────────

/** Eine Zeile der Datei, getrimmt. `zeile` wie in Excel (1-basiert). */
export interface KinderZeile {
  zeile: number;
  name: string;
  passwort: string;
  /** Schon aufgelöst: die C-Zelle, sonst der „für alle"-Wert, sonst leer. */
  start: string;
  /** Optional (14.09.2026) - löst nach dem Anlegen die Passwort-Mail aus. */
  email: string;
}

export type KinderDatei =
  | {
      ok: true;
      zeilen: KinderZeile[];
      /** Der Wert neben „für alle übernehmen" - leer in alten Vorlagen. */
      fuerAlle: string;
      /** „Klasse 3b - Teilnehmer anlegen", wenn die Datei so eine Überschrift trägt. */
      titel: string | null;
    }
  | { ok: false; fehler: string };


/** Bytes einer gewählten Datei - `Blob.arrayBuffer`, sonst `FileReader`. */
export function dateiBytes(datei: Blob): Promise<ArrayBuffer> {
  if (typeof datei.arrayBuffer === "function") return datei.arrayBuffer();
  return new Promise((ok, fehler) => {
    const r = new FileReader();
    r.onload = () => ok(r.result as ArrayBuffer);
    r.onerror = () => fehler(r.error);
    r.readAsArrayBuffer(datei);
  });
}

const kopfText = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
/**
 * Spaltenkopf erkennen - auch ohne das Wort „Tastenflow".
 * ★ EN6b: deutsche UND englische Köpfe (siehe Dateikopf).
 */
// ★ ES-O (27.09.2026): auch die spanischen Köpfe der eigenen Vorlage - und die
// französischen, die bis dahin am Wort „Mot de passe" scheiterten (die Vorlage
// „fr" liess sich nicht wieder einlesen). Nur ERWEITERT: jeder bisher erkannte
// Kopf wird weiter erkannt.
// ★ O-PL (02.10.2026): auch die polnischen Köpfe („Imię", „Hasło", „od czego
// zacząć") - nur ERWEITERT, jeder bisher erkannte Kopf wird weiter erkannt.
// „imię"/„hasło" enden auf einen Buchstaben ausserhalb von ASCII - darum `\p{L}`
// statt `\b` (das ASCII-`\b` fände hinter „ę" keine Wortgrenze).
// ★ O-TR (02.10.2026): auch die türkischen Köpfe ("Ad", "Adı", "Ad Soyad", "İsim",
// "Şifre", "Parola", "E-posta", "nereden başla...", "herkese uygula") - nur
// ERWEITERT. Verglichen wird über `kleinFuer(text, "tr")` statt `toLowerCase()`
// (Glossar §4 Nr. 1: "ŞİFRE".toLowerCase() trüge einen kombinierenden Punkt);
// `[iı]`, weil eine Lehrkraft "ISIM" auch auf einer fremden Tastatur tippt.
const kopfTextTr = (s: string) => kleinFuer(s, "tr").replace(/\s+/g, " ").trim();
/**
 * ★ O2-SONST (30.10.2026): beim Einlesen die Spalten-, Blatt- und Titelnamen der neun Sprachen erkennen - aus DENSELBEN
 * Konstanten, aus denen die Vorlage geschrieben wird. Was vor dem Doppelpunkt („Tastenflow:") oder dem Bindestrich steht,
 * zählt nicht; so bleibt eine leicht gekürzte Überschrift lesbar.
 */
const NEUN_VORLAGEN = [
  { name: KOPF_NAME_BG, passwort: KOPF_PASSWORT_BG, start: KOPF_START_BG, email: KOPF_EMAIL_BG, fuerAlle: FUER_ALLE_TEXT_BG, blatt: BLATT_KINDER_BG },
  { name: KOPF_NAME_EL, passwort: KOPF_PASSWORT_EL, start: KOPF_START_EL, email: KOPF_EMAIL_EL, fuerAlle: FUER_ALLE_TEXT_EL, blatt: BLATT_KINDER_EL },
  { name: KOPF_NAME_HU, passwort: KOPF_PASSWORT_HU, start: KOPF_START_HU, email: KOPF_EMAIL_HU, fuerAlle: FUER_ALLE_TEXT_HU, blatt: BLATT_KINDER_HU },
  { name: KOPF_NAME_NL, passwort: KOPF_PASSWORT_NL, start: KOPF_START_NL, email: KOPF_EMAIL_NL, fuerAlle: FUER_ALLE_TEXT_NL, blatt: BLATT_KINDER_NL },
  { name: KOPF_NAME_PT, passwort: KOPF_PASSWORT_PT, start: KOPF_START_PT, email: KOPF_EMAIL_PT, fuerAlle: FUER_ALLE_TEXT_PT, blatt: BLATT_KINDER_PT },
  { name: KOPF_NAME_BR, passwort: KOPF_PASSWORT_BR, start: KOPF_START_BR, email: KOPF_EMAIL_BR, fuerAlle: FUER_ALLE_TEXT_BR, blatt: BLATT_KINDER_BR },
  { name: KOPF_NAME_RO, passwort: KOPF_PASSWORT_RO, start: KOPF_START_RO, email: KOPF_EMAIL_RO, fuerAlle: FUER_ALLE_TEXT_RO, blatt: BLATT_KINDER_RO },
  { name: KOPF_NAME_SV, passwort: KOPF_PASSWORT_SV, start: KOPF_START_SV, email: KOPF_EMAIL_SV, fuerAlle: FUER_ALLE_TEXT_SV, blatt: BLATT_KINDER_SV },
  { name: KOPF_NAME_UK, passwort: KOPF_PASSWORT_UK, start: KOPF_START_UK, email: KOPF_EMAIL_UK, fuerAlle: FUER_ALLE_TEXT_UK, blatt: BLATT_KINDER_UK },
];
const beginntMitWort = (text: string, wort: string) => text.startsWith(wort) && !/^\p{L}/u.test(text.slice(wort.length));
const IST_NEUN_NAME = (s: string) => NEUN_VORLAGEN.some((v) => beginntMitWort(kopfText(s), kopfText(v.name)));
const IST_NEUN_PASSWORT = (s: string) => NEUN_VORLAGEN.some((v) => beginntMitWort(kopfText(s), kopfText(v.passwort)));
const IST_NEUN_START = (s: string) =>
  NEUN_VORLAGEN.some((v) => kopfText(s).includes(kopfText(v.start).split(": ").pop()!.replace(/[?؟;]$/, "")));
const IST_NEUN_EMAIL = (s: string) => NEUN_VORLAGEN.some((v) => beginntMitWort(kopfText(s), kopfText(v.email).split(/[ (]/)[0]));
const IST_NEUN_FUER_ALLE = (s: string) =>
  NEUN_VORLAGEN.some((v) => kopfText(s).includes(kopfText(v.fuerAlle).split(" - ").pop()!.replace(/:$/, "")));
const IST_NEUN_BLATT = (s: string) => NEUN_VORLAGEN.some((v) => kopfText(s) === kopfText(v.blatt));

const IST_NAME_TR = (s: string) =>
  /^(öğrenc[iı] ad[ıi]?|ad[ıi]?|[iı]s[iı]m)(?![\p{L}])/u.test(kopfTextTr(s));
// ★ O-CS (03.10.2026): auch die tschechischen Köpfe ("Jméno", "Křestní jméno",
// "Jméno a příjmení", "Žák", "Heslo", "E-mailová adresa", "kde začít", "pro
// všechny") - nur ERWEITERT; ohne Häkchen getippt ("Jmeno") zählt mit.
const IST_NAME_CS = (s: string) =>
  /^((k[řr]estn[íi] )?jm[ée]no|ž[áa]k|ž[áa]ci)(?![\p{L}])/u.test(kopfText(s));
const IST_NAME = (s: string) =>
  /^(name|nombre|nome)\b/.test(kopfText(s)) || /^imię(?![\p{L}])/u.test(kopfText(s)) || IST_NAME_TR(s) || IST_NAME_CS(s) || IST_NEUN_NAME(s);
const IST_PASSWORT = (s: string) =>
  /^(passwort|kennwort|password|mot de passe|contraseña|hasło)(?![\p{L}])/u.test(kopfText(s)) ||
  /^(ş[iı]fre|parola)(?![\p{L}])/u.test(kopfTextTr(s)) ||
  /^heslo(?![\p{L}])/u.test(kopfText(s)) ||
  IST_NEUN_PASSWORT(s);
const IST_START = (s: string) =>
  /womit anfangen|startniveau|where to start|starting point|par où commencer|por dónde empezar|da dove iniziare|punto di partenza|od czego zacząć|punkt startowy/.test(kopfText(s)) ||
  /nereden başla|başlangıç noktası/.test(kopfTextTr(s)) ||
  /kde začít|výchozí bod/.test(kopfText(s)) ||
  IST_NEUN_START(s);
const IST_EMAIL = (s: string) =>
  /^(e-?mail|correo)(?![\p{L}])/u.test(kopfText(s)) || /^e-?posta(?![\p{L}])/u.test(kopfTextTr(s)) ||
  /^e-?mailov[áa] adresa(?![\p{L}])/u.test(kopfText(s)) ||
  IST_NEUN_EMAIL(s);
const IST_FUER_ALLE = (s: string) =>
  /für alle|apply to everyone|appliquer à tous|aplicar a todos|applica a tutti|dla wszystkich/.test(kopfText(s)) ||
  /herkese uygula/.test(kopfTextTr(s)) ||
  /pro všechny/.test(kopfText(s)) ||
  IST_NEUN_FUER_ALLE(s);
const IST_TITEL = (s: string) =>
  new RegExp(
    `\\s-\\s(${VORLAGE_TITEL_ZUSATZ}|${VORLAGE_TITEL_ZUSATZ_EN}|${VORLAGE_TITEL_ZUSATZ_FR}|${VORLAGE_TITEL_ZUSATZ_ES}|${VORLAGE_TITEL_ZUSATZ_IT}|${VORLAGE_TITEL_ZUSATZ_PL}|${VORLAGE_TITEL_ZUSATZ_TR}|${VORLAGE_TITEL_ZUSATZ_CS}|${VORLAGE_TITEL_ZUSATZ_BG}|${VORLAGE_TITEL_ZUSATZ_EL}|${VORLAGE_TITEL_ZUSATZ_HU}|${VORLAGE_TITEL_ZUSATZ_NL}|${VORLAGE_TITEL_ZUSATZ_PT}|${VORLAGE_TITEL_ZUSATZ_BR}|${VORLAGE_TITEL_ZUSATZ_RO}|${VORLAGE_TITEL_ZUSATZ_SV}|${VORLAGE_TITEL_ZUSATZ_UK})$`,
    "i",
  ).test(s.trim());

/**
 * Liest eine ausgefüllte Vorlage: das Blatt „Teilnehmer", sonst das erste Blatt.
 * Die Kopfzeile wird an den Spaltennamen erkannt (die Spalten dürfen auch
 * vertauscht sein und tiefer stehen - seit 13.09.2026 steht sie in Zeile 8);
 * alles wird getrimmt.
 *
 * ★★ 13.09.2026:
 *  · Eine Zeile ist nur dann ein Kind, wenn Name ODER Passwort gefüllt ist.
 *    Die 40 vorbereiteten Zeilen tragen alle einen Wert in Spalte C - sie
 *    dürfen nicht als „Name fehlt" abgelehnt werden.
 *  · Über der Kopfzeile: der „für alle"-Wert (die erste gefüllte Zelle rechts
 *    neben dem Text „für alle") und die Überschrift „… - Teilnehmer anlegen".
 *  · Leere Startzelle ⇒ der „für alle"-Wert; ist auch der leer, gilt später
 *    die Vorgabe der Klasse (`pruefeKinderZeilen`).
 *  · Formelzellen: Gelesen wird das gespeicherte Ergebnis. Fehlt es (ein
 *    Programm, das nicht rechnet), ist die Zelle leer - und es gilt wieder der
 *    „für alle"-Wert, genau das, was die Formel ergeben hätte.
 *  · Alte Vorlagen (Kopfzeile in Zeile 1, kein Kasten) bleiben lesbar.
 *
 * ★ `raw: false` hält ein Passwort wie `1234` als Zeichenkette - sonst käme es
 *   als Zahl zurück, und `0815` verlöre seine Null nur dann nicht, wenn Excel
 *   die Zelle schon als Text führt.
 * ★ `blankrows: true`, damit die Zeilennummer im Befund die aus Excel ist.
 */
export async function leseKinderXlsx(
  buf: ArrayBuffer | Uint8Array,
  sprache: AktiveBedienSprache = "de",
): Promise<KinderDatei> {
  const t = VORLAGE_TEXTE[sprache];
  const XLSX = await import("xlsx");
  let wb;
  try {
    wb = XLSX.read(buf, { type: "array" });
  } catch {
    return { ok: false, fehler: t.nichtLesbar };
  }
  const blattName =
    wb.SheetNames.find(
      (n) =>
        kopfText(n) === kopfText(BLATT_KINDER) ||
        kopfText(n) === kopfText(BLATT_KINDER_EN) ||
        kopfText(n) === kopfText(BLATT_KINDER_FR) ||
        kopfText(n) === kopfText(BLATT_KINDER_ES) ||
        kopfText(n) === kopfText(BLATT_KINDER_IT) ||
        kopfText(n) === kopfText(BLATT_KINDER_PL) ||
        kopfText(n) === kopfText(BLATT_KINDER_TR) ||
        kopfText(n) === kopfText(BLATT_KINDER_CS) ||
        IST_NEUN_BLATT(n),
    ) ?? wb.SheetNames[0];
  const ws = blattName ? wb.Sheets[blattName] : undefined;
  if (!ws) return { ok: false, fehler: t.nichtLesbar };
  const ref = ws["!ref"];
  if (!ref)
    return {
      ok: false,
      fehler: t.blattLeer(blattName),
    };
  const ersteZeile = XLSX.utils.decode_range(ref).s.r + 1;
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: "",
    blankrows: true,
    raw: false,
  });
  const zellen = aoa.map((z) => z.map((c) => String(c ?? "").trim()));

  const kopfIndex = zellen.slice(0, 30).findIndex((z) => z.some(IST_NAME) && z.some(IST_PASSWORT));
  if (kopfIndex === -1)
    return {
      ok: false,
      fehler: t.keinKopf(t.kopfName, t.kopfPasswort),
    };
  const kopf = zellen[kopfIndex];
  const iName = kopf.findIndex(IST_NAME);
  const iPw = kopf.findIndex(IST_PASSWORT);
  const iStart = kopf.findIndex(IST_START);
  const iEmail = kopf.findIndex(IST_EMAIL);

  const ueberKopf = zellen.slice(0, kopfIndex);
  let fuerAlle = "";
  for (const z of ueberKopf) {
    const i = z.findIndex(IST_FUER_ALLE);
    if (i >= 0) {
      fuerAlle = z.slice(i + 1).find((c) => c !== "") ?? "";
      break;
    }
  }
  const titel = ueberKopf.flat().find(IST_TITEL) ?? null;

  const zeilen: KinderZeile[] = [];
  for (let i = kopfIndex + 1; i < zellen.length; i++) {
    const z = zellen[i];
    const name = z[iName] ?? "";
    const passwort = z[iPw] ?? "";
    // Ein Kind hat einen Namen oder ein Passwort - ein Wert allein in Spalte C
    // (die vorbereiteten Zeilen) oder eine Notiz daneben macht keines.
    if (!name && !passwort) continue;
    const start = (iStart >= 0 ? (z[iStart] ?? "") : "") || fuerAlle;
    const email = iEmail >= 0 ? (z[iEmail] ?? "") : "";
    zeilen.push({ zeile: ersteZeile + i, name, passwort, start, email });
  }
  return { ok: true, zeilen, fuerAlle, titel };
}

/**
 * ★ Steht in der Überschrift der Datei eine ANDERE Klasse als die gewählte?
 * Dann ein sichtbarer Satz in der Vorschau - kein Hindernis: Wer die Vorlage
 * von 3a für 3b weiterverwendet, darf das.
 *
 * @returns den Satz, oder `null`, wenn es passt oder die Datei keine
 *   Überschrift trägt (alte Vorlage, eigene Tabelle).
 */
export function fremdeKlasseHinweis(
  titel: string | null | undefined,
  klassenname: string | null | undefined,
  sprache: AktiveBedienSprache = "de",
): string | null {
  if (!titel) return null;
  const gleich = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  // ★ EN6b: Die Vorlage derselben Klasse kann aus der anderen Sprache stammen.
  if (gleich(titel) === gleich(vorlageTitel(klassenname))) return null;
  if (gleich(titel) === gleich(vorlageTitel(klassenname, "en"))) return null;
  // ★ O-TR (02.10.2026): die türkische Vorlage derselben Klasse ("3b sınıfı -
  // Öğrenci ekle") ist keine fremde Klasse.
  if (sprache === "tr" && gleich(titel) === gleich(vorlageTitel(klassenname, "tr"))) return null;
  // ★ O-CS (03.10.2026): ebenso die tschechische Vorlage derselben Klasse
  // ("Třída 3b - Přidat žáky").
  if (sprache === "cs" && gleich(titel) === gleich(vorlageTitel(klassenname, "cs"))) return null;
  // ★ O5 (30.10.2026): ebenso die Vorlage in einer der neun Sprachen - sonst galt die eigene Vorlage als fremde Klasse.
  if (istGeruestSprache(sprache) && gleich(titel) === gleich(vorlageTitel(klassenname, sprache))) return null;
  // ★ 06.11.2026: ebenso die Vorlage in fr, es, it, pl (gleiche Regel für jede Bedienungssprache; die eigene
  // Vorlage derselben Klasse galt dort bisher als fremde Klasse).
  if (gleich(titel) === gleich(vorlageTitel(klassenname, sprache))) return null;
  return VORLAGE_TEXTE[sprache].fremdeKlasse(titel.trim(), klassenBezeichnung(klassenname, sprache));
}

// ── Zeilen prüfen ──────────────────────────────────────────────────────────

export interface GeplantesKind {
  zeile: number;
  name: string;
  passwort: string;
  /** Die Zelle war leer - das Programm hat das Passwort erzeugt. */
  passwortErzeugt: boolean;
  startUnits: number;
  startLabel: string;
  /** Die Zelle war leer - es gilt die Vorgabe der Klasse. */
  startVorgabe: boolean;
  /** Optional, leer wenn nicht ausgefüllt. */
  email: string;
}

export interface AbgelehnteZeile {
  zeile: number;
  name: string;
  grund: string;
}

export interface KinderPlan {
  anlegen: GeplantesKind[];
  abgelehnt: AbgelehnteZeile[];
}

/**
 * ★★ Wann zwei Namen „derselbe" sind - DIESELBE Regel wie am Server, nicht
 * eine dritte (12.09.2026, nachgesehen):
 *  · lokal (`account.ts` `addPupil`): ohne Gross-/Kleinschreibung;
 *  · live (`pbBackend.ts`): über die Anmelde-Adresse `synthEmail` - klein,
 *    ä/ö/ü/ß ausgeschrieben, alles andere als Bindestrich. Dort sind auch
 *    „Anna-Lena" und „anna lena" derselbe Name, und PocketBase lehnt den
 *    zweiten mit „Diesen Namen gibt es in der Klasse schon." ab.
 * Die Server-Regel schliesst die lokale ein - darum gilt sie hier. Die Vorschau
 * sagt es dann VOR dem Anlegen statt danach.
 */
export const namensSchluessel = (name: string) => synthEmail("", name);

/**
 * Prüft jede Zeile und plant die Kinder. Geschrieben wird hier nichts.
 * Gründe in der Reihenfolge: Name fehlt · Passwort zu kurz · Startniveau
 * unbekannt · Name schon in der Klasse · Name doppelt in der Datei.
 */
export function pruefeKinderZeilen(
  zeilen: KinderZeile[],
  optionen: {
    vorhandeneNamen: string[];
    /** Startniveau der Klasse (`cls.startUnits`); leer ⇒ erster Startpunkt. */
    startVorgabe?: number;
    zufall?: () => number;
    punkte?: StartPoint[];
    /** ★ EN6b: Sprache der Gründe und der Startniveau-Namen - ohne Angabe Deutsch. */
    sprache?: AktiveBedienSprache;
    /**
     * ★ E1 (24.09.2026): der Lernweg der Klasse - die neuen Kinder erben ihn,
     * und `startVorgabe` sowie die Startniveaus sind Anzahlen in ihm.
     */
    lernweg: Lernweg;
  },
): KinderPlan {
  const sprache = optionen.sprache ?? "de";
  const t = VORLAGE_TEXTE[sprache];
  const punkte = optionen.punkte ?? startPunkte(sprache, optionen.lernweg);
  /*
   * ★ EN6b: Eine Vorlage aus der ANDEREN Sprache trägt die Startniveaus mit
   * deren Namen. Beide Listen stehen in derselben Reihenfolge mit denselben
   * Kurzwörtern - gefunden wird darum über das Kurzwort. Nur ohne eigene
   * `punkte` (die Tests reichen feste Listen herein).
   */
  // ★ E11a-5 (26.09.2026): mit drei Sprachen gibt es ZWEI andere - beide
  // werden der Reihe nach gefragt (Deutsch/Englisch zuerst wie bisher; eine
  // Vorlage aus „fr" findet so ebenfalls ihr Startniveau).
  const anderePunkte = optionen.punkte
    ? null
    : // ★ O-IT: „it" dazu - eine italienische Vorlage findet so ihr Startniveau.
      // ★ O-PL: "pl" ebenso. ★ O-TR: "tr" ebenso.
      // ★ O-CS (03.10.2026): "cs" ebenso.
      (["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const)
        .filter((s) => s !== sprache)
        .map((s) => startPunkte(s, optionen.lernweg));
  const findeStart = (zelle: string): StartPoint | null | undefined => {
    const hier = startniveauAusZelle(zelle, punkte);
    if (hier !== null || !anderePunkte) return hier;
    for (const liste of anderePunkte) {
      const dort = startniveauAusZelle(zelle, liste);
      if (dort) return punkte.find((p) => p.key === dort.key) ?? null;
    }
    return null;
  };
  const vorgabeUnits = optionen.startVorgabe || punkte[0].units;
  const vorgabeLabel =
    punkte.find((p) => p.units === vorgabeUnits)?.label ?? t.startDerKlasse;
  const inKlasse = new Set(optionen.vorhandeneNamen.map(namensSchluessel));
  const ersteZeile = new Map<string, number>();
  const plan: KinderPlan = { anlegen: [], abgelehnt: [] };

  for (const z of zeilen) {
    const ablehnen = (grund: string) => plan.abgelehnt.push({ zeile: z.zeile, name: z.name, grund });
    const schluessel = namensSchluessel(z.name);
    const frueher = schluessel ? ersteZeile.get(schluessel) : undefined;
    if (schluessel && frueher === undefined) ersteZeile.set(schluessel, z.zeile);

    if (!z.name) {
      ablehnen(t.nameFehlt);
      continue;
    }
    if (z.passwort && z.passwort.length < MIN_PASSWORT_KIND) {
      ablehnen(t.passwortKurz(MIN_PASSWORT_KIND));
      continue;
    }
    const start = findeStart(z.start);
    if (start === null) {
      ablehnen(t.keinStartniveau(z.start, punkte.length, t.blattHinweise));
      continue;
    }
    const email = z.email.trim();
    if (email && !email.includes("@")) {
      ablehnen(t.keineEmail(z.email));
      continue;
    }
    if (inKlasse.has(schluessel)) {
      ablehnen(t.nameSchonDa);
      continue;
    }
    if (frueher !== undefined) {
      ablehnen(t.nameDoppelt(frueher));
      continue;
    }
    const passwortErzeugt = !z.passwort;
    plan.anlegen.push({
      zeile: z.zeile,
      name: z.name,
      passwort: passwortErzeugt ? erzeugePasswort(optionen.zufall) : z.passwort,
      passwortErzeugt,
      startUnits: start ? start.units : vorgabeUnits,
      startLabel: start ? start.label : vorgabeLabel,
      startVorgabe: !start,
      email,
    });
  }
  return plan;
}

/** „Zeile 4 - Mia: Das Passwort hat weniger als 4 Zeichen." */
export function abgelehntSatz(a: AbgelehnteZeile): string {
  return abgelehntSatzIn(a, "de");
}

/**
 * ★ EN6b: derselbe Satz in der Bedienungssprache („Row 4 - Mia: …"). Eine
 * eigene Funktion statt eines zweiten Parameters an `abgelehntSatz` - die wird
 * als `.map(abgelehntSatz)` gereicht, und dort käme der Index als Sprache an.
 */
export function abgelehntSatzIn(a: AbgelehnteZeile, sprache: AktiveBedienSprache): string {
  return `${VORLAGE_TEXTE[sprache].zeile(a.zeile)}${a.name ? ` - ${a.name}` : ""}: ${a.grund}`;
}
