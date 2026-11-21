/**
 * „Meine Klassen" (MK-E0) — EIN Lehrkraft-Bereich für alle vier Lernprogramme
 * der Lernwerkstatt (Tastenflow, Punktgenau, Klangpunkte, im Griff).
 *
 * Warum eine eigene Seite? Konten und Klassen sind längst geteilt, die
 * Oberflächen waren es nicht: Jede App hatte ihre eigene Lehrkraft-Sicht, in
 * zweien konnte man Kinder anlegen (mit verschiedenen Feldern), „im Griff"
 * hatte gar keine und sprang nach Tastenflow.
 * Bauplan: `Sensorik/BAUPLAN-2026-08-03-MEINE-KLASSE.md`.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ DER UMBAU VOM 09.09.2026 - „DIE REITERREIHE BEDEUTET NUR NOCH EINES"
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Der Anlass ist ein Satz von Johannes über einen Kasten dieser Seite:
 * *„ich bin selbst nicht draufgekommen, wozu dieser Bereich ist."* Dazu:
 * *„dass das Verwalten der Klassen ein kleiner Reiter neben den Klassen ist,
 * ist vielleicht auch nicht günstig"* und *„der Überblickreiter ist nicht
 * nötig"*.
 *
 * Die gemeinsame Ursache: Die Reiterreihe trug DREI verschiedene Arten von
 * Sachen, alle gleich gezeichnet - eine Auswertung („Überblick"), eine
 * Verwaltung („Klasse & Konten") und vier Programme. Wo alles gleich aussieht,
 * sagt die Reihe nichts mehr, und man sucht das Wichtige nicht mehr gezielt.
 *
 * Seither gilt:
 *  • Die Reiterreihe beantwortet GENAU EINE Frage: **welches Programm?**
 *    Sie besteht nur noch aus Programm-Karten - gross, mit Zeichen und Namen.
 *  • Die KLASSE steht im Kopf, als Überschrift mit den zwei Angaben, die man
 *    ständig braucht (wie viele Kinder, welcher Klassencode) - nicht mehr
 *    als graue Pille zwischen anderen Pillen.
 *  • Das VERWALTEN ist ein eigener Bildschirm (`/meine-klasse/verwalten`),
 *    erreichbar über den Umschalter „Lernstand | Kinder und Zugänge" im
 *    Klassenkopf (E2, 18.09.2026 - siehe unten). Es ist Vorbereitung, nicht
 *    Unterricht - und gehört darum nicht neben Tastenflow.
 *    ⚠️ Derselbe Seiten-Baustein, nur ein anderer Modus (`verwalten`): eine
 *    zweite Komponente wäre eine zweite Stelle für Anmeldung, Klassen- und
 *    Kinder-Laden ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *  • Der Reiter „Überblick" ist WEG, samt „Braucht Aufmerksamkeit"
 *    (Entscheidung Johannes, 09.09.2026: ersatzlos).
 *  • Die HANDBÜCHER hängen jetzt am Klassenkopf statt in der Verwaltung -
 *    eine Lehrkraft, die eine Stunde vorbereitet, soll sie nicht hinter einem
 *    zweiten Bildschirm suchen.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ E2 (18.09.2026) - EIN UMSCHALTER STATT KNOPF UND RÜCKWEG
 * ════════════════════════════════════════════════════════════════════════════
 * Johannes, 18.09.2026: Kolleginnen und Kollegen verstehen den Unterschied
 * zwischen „Meine Klassen" und dem Verwaltungsbereich nicht, und niemand
 * findet den Weg zurück („← zurück zu Meinen Klassen"). Bis dahin führte ein
 * Knopf „Meine Klassen verwalten" oben in der Kopfzeile HIN, und ein kleiner
 * Link „← zurück zu …" auf dem Verwaltungs-Bildschirm ZURÜCK - zwei
 * verschiedene Bauarten an zwei verschiedenen Stellen.
 *
 * Jetzt gibt es EINEN zweiteiligen Umschalter „Lernstand | Kinder und
 * Zugänge" (`BereichUmschalter`), rechts neben Klassenname und Klassenwahl im
 * Klassenkopf (`Klassenkopf`, `umschalter`-Eigenschaft) - an GENAU DERSELBEN
 * Stelle auf BEIDEN Bildschirmen. Beide Hälften sind echte Links (die Adresse
 * wechselt wirklich, Lesezeichen bleiben gültig); die aktuelle trägt
 * `aria-current="page"`. Nach dem Umschalten bekommt die jetzt aktuelle
 * Hälfte den Fokus (`bereichFokusErledigt`, unten) - dieselbe Technik wie
 * `selbstUeben` im Verlaufseintrag (A6, 11.09.2026).
 *
 * Aufruf aus den Apps: `/lernwerkstatt/<programm>/klasse` bzw.
 * `/meine-klasse?app=<schlüssel>` (F9 - zwei Adressen, je nach Rechnernamen).
 * `app` öffnet gleich das passende Programm und füttert „Selbst üben".
 *
 * Anrede „Sie" (K21) — reine Lehrkraft-Oberfläche.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AppKopfzeile } from "@/components/AppKopfzeile";
import { Tipp } from "@/components/Tipp";
import { ProgrammZeichen } from "@/components/lernwerkstatt/ProgrammZeichen";
import { RechtlichesFusszeile } from "@/components/RechtlichesFusszeile";
import { hausApp, hausStartHref, klasseVerwaltenHref, meineKlasseHref, mitHausName } from "@/lib/adressen";
import { MeineKlasseHilfe } from "@/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { Modal } from "@/components/Modal";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { TypingAccount, TypingClass, typingBackend } from "@/lib/typing";
import { useProgrammeCatalog } from "@/lib/useProgrammeReleases";
import {
  LW_PROGRAMS,
  programmInSprache,
  STANDARD_EINSTIEGSPROGRAMM,
  effectiveProgramsOfClass,
  lwProgram,
  type LwProgram,
  type LwProgramKey,
} from "@/lib/lernwerkstatt/klassen";
import { liesZuletztKlasse, merkeZuletztKlasse, waehleKlasse } from "@/lib/lernwerkstatt/zuletztKlasse";
import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { PunktgenauReiter } from "@/components/lernwerkstatt/klasse/PunktgenauReiter";
import { ImGriffReiter } from "@/components/lernwerkstatt/klasse/ImGriffReiter";
import { PlusReiter } from "@/components/lernwerkstatt/klasse/PlusReiter";
import { LexamiReiter } from "@/components/lernwerkstatt/klasse/LexamiReiter";
import { HandbuecherKasten } from "@/components/lernwerkstatt/klasse/HandbuecherKasten";
import { KlangpunkteKlassenMatrix } from "@/components/klangpunkte/KlangpunkteKlassenMatrix";
import { NeuigkeitenFenster } from "@/components/typing/NeuigkeitenFenster";
import { RundgangMeineKlassen } from "@/components/typing/Rundgang"; // ★ Z4 (19.09.2026)
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";
import { programmNameLang, programmReiterHinweis } from "@/components/lernwerkstatt/klasse/programmTexte";

/** Ein Reiter ist seit 09.09.2026 IMMER ein Programm - nichts sonst. */
type Reiter = LwProgramKey;

/**
 * ★★ DIE TEXTE DES SEITENRAHMENS in beiden Bedienungssprachen (EN6b,
 * 19.09.2026) - Kopf, Klassenwahl, Umschalter „Lernstand | Kinder und
 * Zugänge", Programm-Reiter, Downloads (bis 19.09.2026 „Handbücher"), Tastenwege-Fenster.
 *
 * ⚠️ GEMEINSAMER TEIL: Diese Seite gehört allen vier Programmen. Englisch
 * wird sie nur über den Anbieter (`useBedienSprache`), und der ist nur auf den
 * Tastenflow-Adressen aktiv (`TastenflowSprachBereich.tsx`) - die Seite von
 * Punktgenau, Klangpunkte und »im Griff« bleibt Zeichen für Zeichen deutsch.
 * Die Reiter der ANDEREN Programme bleiben auch in der englischen Bedienung
 * deutsch (ihre Apps haben noch kein Englisch) - sie stehen dann in
 * `lang="de"`.
 *
 * Glossar §3.8/§3.15, wörtlich wie im englischen Handbuch
 * (`scripts/tastenflow-handbuch-en.mts`, `L`): *My classes · Progress |
 * Pupils and logins · Manage my classes · Class / Change class · Downloads ·
 * Practise yourself*. Kind (Lehrkraft-Sicht) ⇒ *pupil*, Lernprogramm ⇒ *app*.
 * Wo ein Satz einen Knopf nennt, ist der Name ein eigener Eintrag, damit die
 * deutschen Textknoten bleiben, wie sie waren.
 */
export const T = texte({
  de: {
    meineKlassen: "Meine Klassen",
    nurLehrVor:
      "Dieser Bereich ist für Lehrkräfte. Bitte melden Sie sich in einem " +
      'Lernprogramm mit Ihrem Lehrkonto an - danach führt Sie dort der Knopf „Meine Klassen" (oder ',
    nurLehrNach: ") hierher zurück.",
    lernprogramme: "Lernprogramme",
    zurLernwerkstatt: "← Zur Lernwerkstatt",
    verwalten: "Meine Klassen verwalten",
    selbstUebenTipp: (programm: string) => `Selbst üben - ${programm} öffnen (Alt + U)`,
    selbstUebenLwTipp: "Selbst üben - zur Lernwerkstatt (Alt + U)",
    selbstUeben: "Selbst üben",
    keinProgramm: "Für diese Klasse ist gerade kein Lernprogramm freigegeben.",
    kinderUndZugaenge: "Kinder und Zugänge",
    handbuecherTitel: "Downloads für Lehrkräfte",
    tastenwege: "Tastenwege",
    tastenwegeCaption: "Tastenwege im Bereich Meine Klassen",
    hilfeTaste: "Hilfe öffnen / schließen",
    listeTaste: "Diese Liste öffnen / schließen",
    uebenTaste: (programm: string) => `Selbst üben - ${programm} öffnen`,
    uebenLwTaste: "Selbst üben - zur Lernwerkstatt",
    zeitraumTaste:
      "Einen Zeitabschnitt zurück oder vor - Woche, Monat oder Schuljahr in der Lernenden-Tabelle",
    nachrichtenTaste: "Nachrichten öffnen / schließen",
    farbenTaste: "Farben und Kontrast",
    kontoTaste: "Konto-Menü öffnen / schließen",
    mac: "Alt + Taste. Auf dem Mac: Wahltaste (⌥) + Taste.",
    klasse: "Klasse",
    klasseWechseln: "Klasse wechseln",
    kinderLaden: "Kinder werden geladen …",
    kinder: (n: number) => (n === 1 ? "1 Kind" : `${n} Kinder`),
    codePunkt: "· Klassencode",
    // ★ 19.09.2026: „Handbücher" heisst jetzt „Downloads" (Johannes) - dahinter
    // liegen die Handbücher UND das Tastenflow-Plakat zum Aufhängen.
    handbuecherTipp: "Die Handbücher für Lehrkräfte und das Plakat zum Aufhängen - zum Lesen und Ausdrucken.",
    handbuecher: "Downloads",
    bereich: "Bereich",
    lernstandTipp: "Die Lernenden-Tabelle und die Programme dieser Klasse.",
    lernstand: "Lernstand",
    verwaltenTipp:
      "Kinder anlegen, verschieben, Passwörter und Zugangsdaten, Klassencode und die Programme dieser Klasse.",
    programme: "Programme",
    zuerstKlasse:
      'Legen Sie zuerst über „Kinder und Zugänge" neben dem Klassennamen eine Klasse an.',
    laedt: "Lädt …",
    leerVor:
      "In dieser Klasse sind noch keine Lernenden. Legen Sie sie über „Kinder " +
      'und Zugänge" neben dem Klassennamen an - danach sehen Sie hier ihren Stand in ',
    leerNach: ".",
    keineAnsicht: ": Für dieses Programm gibt es noch keine Klassen-Ansicht.",
  },
  en: {
    meineKlassen: "My classes",
    nurLehrVor:
      "This area is for teachers. Please sign in to one of the apps with your " +
      "teacher account - then the button “My classes” there (or ",
    nurLehrNach: ") brings you back here.",
    lernprogramme: "Apps",
    zurLernwerkstatt: "← Go to Lernwerkstatt",
    verwalten: "Manage my classes",
    selbstUebenTipp: (programm: string) => `Practise yourself - open ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Practise yourself - go to Lernwerkstatt (Alt + U)",
    selbstUeben: "Practise yourself",
    keinProgramm: "No app is available for this class at the moment.",
    kinderUndZugaenge: "Pupils and logins",
    handbuecherTitel: "Downloads for teachers",
    // „Tastenwege" ist hier die Liste der Tastenkürzel - derselbe Name wie
    // der Knopf der Kopfzeile (Glossar §3.1 ★ *keyboard shortcuts*).
    tastenwege: "Keyboard shortcuts",
    tastenwegeCaption: "Keyboard shortcuts in My classes",
    hilfeTaste: "Open / close help",
    listeTaste: "Open / close this list",
    uebenTaste: (programm: string) => `Practise yourself - open ${programm}`,
    uebenLwTaste: "Practise yourself - go to Lernwerkstatt",
    // Seit K4 (19.09.2026) blättert Alt + ←/→ auch den Monat (Deutsch beim
    // Übersetzen nachgezogen).
    zeitraumTaste: "One period back or forward in the table of pupils - week, month or school year",
    nachrichtenTaste: "Open / close messages",
    farbenTaste: "Colours and contrast",
    kontoTaste: "Open / close the account menu",
    mac: "Alt + key. On a Mac: Option (⌥) + key.",
    klasse: "Class",
    klasseWechseln: "Change class",
    kinderLaden: "Loading pupils …",
    kinder: (n: number) =>
      mehrzahl(n, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` }),
    codePunkt: "· class code",
    handbuecherTipp: "The guides for teachers and the poster for hanging up - to read and to print.",
    handbuecher: "Downloads",
    // Die beiden Hälften sind zwei Ansichten derselben Klasse.
    bereich: "View",
    lernstandTipp: "The table of pupils and the apps of this class.",
    lernstand: "Progress",
    verwaltenTipp:
      "Add and move pupils, passwords and login details, the class code and the apps of this class.",
    programme: "Apps",
    zuerstKlasse: "First create a class under “Pupils and logins” next to the class name.",
    laedt: "Loading …",
    leerVor:
      "There are no pupils in this class yet. Add them under “Pupils and logins” " +
      "next to the class name - then you will see their progress in ",
    leerNach: " here.",
    keineAnsicht: ": there is no class view for this app yet.",
  },
  // ★ E11a: durchgehend „vous" - der ganze Bereich „Mes classes" ist
  // Lehrkraft-Ansicht (F9). ★ E11a-5 (Feinschliff-Liste): „Selbst üben"
  // heisst nach Glossar §9.2 „M'entrainer", die Lehrkraft „les enseignants
  // et enseignantes".
  fr: {
    meineKlassen: "Mes classes",
    nurLehrVor:
      "Cet espace est réservé aux enseignants et enseignantes. Connectez-vous dans " +
      'un programme d\'apprentissage avec votre compte enseignant - le bouton "Mes classes" (ou ',
    nurLehrNach: ") vous y ramène ensuite.",
    lernprogramme: "Programmes",
    zurLernwerkstatt: "← Vers Lernwerkstatt",
    verwalten: "Gérer mes classes",
    selbstUebenTipp: (programm: string) => `M'entrainer - ouvrir ${programm} (Alt + U)`,
    selbstUebenLwTipp: "M'entrainer - Lernwerkstatt (Alt + U)",
    selbstUeben: "M'entrainer",
    keinProgramm: "Aucun programme n'est disponible pour cette classe en ce moment.",
    kinderUndZugaenge: "Élèves et accès",
    handbuecherTitel: "Téléchargements pour les enseignants et enseignantes",
    tastenwege: "Raccourcis clavier",
    tastenwegeCaption: "Raccourcis clavier dans Mes classes",
    hilfeTaste: "Ouvrir / fermer l'aide",
    listeTaste: "Ouvrir / fermer cette liste",
    uebenTaste: (programm: string) => `M'entrainer - ouvrir ${programm}`,
    uebenLwTaste: "M'entrainer - Lernwerkstatt",
    zeitraumTaste:
      "Une période en arrière ou en avant - semaine, mois ou année scolaire dans le tableau des élèves",
    nachrichtenTaste: "Ouvrir / fermer les messages",
    farbenTaste: "Couleurs et contraste",
    kontoTaste: "Ouvrir / fermer le menu du compte",
    mac: "Alt + touche. Sur Mac : Option (⌥) + touche.",
    klasse: "Classe",
    klasseWechseln: "Changer de classe",
    kinderLaden: "Chargement des élèves …",
    kinder: (n: number) =>
      mehrzahl(n, "fr", { one: (z) => `${z} élève`, other: (z) => `${z} élèves` }),
    codePunkt: "- code de classe",
    handbuecherTipp: "Les guides pour les enseignants et enseignantes et l'affiche à accrocher - à lire et à imprimer.",
    handbuecher: "Téléchargements",
    bereich: "Vue",
    lernstandTipp: "Le tableau des élèves et les programmes de cette classe.",
    lernstand: "Progrès",
    verwaltenTipp:
      "Créer et déplacer des élèves, mots de passe et identifiants, le code de classe et les programmes de cette classe.",
    programme: "Programmes",
    zuerstKlasse:
      'Créez d\'abord une classe sous "Élèves et accès", à côté du nom de la classe.',
    laedt: "Chargement …",
    leerVor:
      'Cette classe n\'a pas encore d\'élèves. Ajoutez-les sous "Élèves et ' +
      'accès", à côté du nom de la classe - vous verrez ensuite leurs progrès dans ',
    leerNach: " ici.",
    keineAnsicht: " : il n'y a pas encore de vue de classe pour ce programme.",
  },
  // ★ ES-O (27.09.2026): Lehrkraft-Ansicht - usted; „Selbst üben" heisst
  // „Practicar por mi cuenta".
  es: {
    meineKlassen: "Mis clases",
    nurLehrVor:
      "Este espacio es solo para docentes. Inicie sesión en " +
      'un programa de aprendizaje con su cuenta de docente - el botón "Mis clases" (o ',
    nurLehrNach: ") le trae de vuelta aquí.",
    lernprogramme: "Programas",
    zurLernwerkstatt: "← Ir a Lernwerkstatt",
    verwalten: "Gestionar mis clases",
    selbstUebenTipp: (programm: string) => `Practicar por mi cuenta - abrir ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Practicar por mi cuenta - Lernwerkstatt (Alt + U)",
    selbstUeben: "Practicar por mi cuenta",
    keinProgramm: "Ahora mismo no hay ningún programa disponible para esta clase.",
    kinderUndZugaenge: "Estudiantes y accesos",
    handbuecherTitel: "Descargas para docentes",
    tastenwege: "Atajos de teclado",
    tastenwegeCaption: "Atajos de teclado en Mis clases",
    hilfeTaste: "Abrir o cerrar la ayuda",
    listeTaste: "Abrir o cerrar esta lista",
    uebenTaste: (programm: string) => `Practicar por mi cuenta - abrir ${programm}`,
    uebenLwTaste: "Practicar por mi cuenta - Lernwerkstatt",
    zeitraumTaste:
      "Un periodo hacia atrás o hacia delante - semana, mes o curso escolar en la tabla del alumnado",
    nachrichtenTaste: "Abrir o cerrar los mensajes",
    farbenTaste: "Colores y contraste",
    kontoTaste: "Abrir o cerrar el menú de la cuenta",
    mac: "Alt + tecla. En Mac: Opción (⌥) + tecla.",
    klasse: "Clase",
    klasseWechseln: "Cambiar de clase",
    kinderLaden: "Cargando el alumnado …",
    kinder: (n: number) =>
      mehrzahl(n, "es", { one: (z) => `${z} estudiante`, other: (z) => `${z} estudiantes` }),
    codePunkt: "- código de clase",
    handbuecherTipp: "Las guías para docentes y el cartel para colgar - para leer e imprimir.",
    handbuecher: "Descargas",
    bereich: "Vista",
    lernstandTipp: "La tabla del alumnado y los programas de esta clase.",
    lernstand: "Progreso",
    verwaltenTipp:
      "Crear y mover cuentas, contraseñas y datos de acceso, el código de clase y los programas de esta clase.",
    programme: "Programas",
    zuerstKlasse:
      'Cree primero una clase en "Estudiantes y accesos", junto al nombre de la clase.',
    laedt: "Cargando …",
    leerVor:
      'Esta clase todavía no tiene estudiantes. Añádalos en "Estudiantes y ' +
      'accesos", junto al nombre de la clase - después verá aquí su progreso en ',
    leerNach: ".",
    keineAnsicht: ": todavía no hay vista de clase para este programa.",
  },
  // ★ O-IT (02.10.2026): Lehrkräfte - Infinitiv und neutrale Formen (Glossar
  // Regel 1); „Esercitarsi" für „Selbst üben", „Alunni e accessi" (§2.6).
  it: {
    meineKlassen: "Le mie classi",
    nurLehrVor:
      "Quest'area è per insegnanti. Accedere a un " +
      `programma di apprendimento con l'account da insegnante - poi il pulsante "Le mie classi" (oppure `,
    nurLehrNach: ") riporta qui.",
    lernprogramme: "Programmi di apprendimento",
    zurLernwerkstatt: "← Vai alla Lernwerkstatt",
    verwalten: "Gestisci le mie classi",
    selbstUebenTipp: (programm: string) => `Esercitarsi - apre ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Esercitarsi - apre la Lernwerkstatt (Alt + U)",
    selbstUeben: "Esercitarsi",
    keinProgramm: "Al momento nessun programma di apprendimento è disponibile per questa classe.",
    kinderUndZugaenge: "Alunni e accessi",
    handbuecherTitel: "Download per insegnanti",
    tastenwege: "Percorsi da tastiera",
    tastenwegeCaption: "Percorsi da tastiera in Le mie classi",
    hilfeTaste: "Apri o chiudi l'aiuto",
    listeTaste: "Apri o chiudi questo elenco",
    uebenTaste: (programm: string) => `Esercitarsi - apre ${programm}`,
    uebenLwTaste: "Esercitarsi - apre la Lernwerkstatt",
    zeitraumTaste:
      "Un periodo indietro o avanti - settimana, mese o anno scolastico nella tabella degli alunni",
    nachrichtenTaste: "Apri o chiudi i messaggi",
    farbenTaste: "Colori e contrasto",
    kontoTaste: "Apri o chiudi il menu dell'account",
    mac: "Alt + tasto. Sul Mac: Opzione (⌥) + tasto.",
    klasse: "Classe",
    klasseWechseln: "Cambia classe",
    kinderLaden: "Caricamento degli alunni in corso...",
    kinder: (n: number) =>
      mehrzahl(n, "it", { one: (z) => `${z} persona`, other: (z) => `${z} alunni` }),
    codePunkt: "- codice classe",
    handbuecherTipp: "Le guide per insegnanti e il poster da appendere - da leggere e stampare.",
    handbuecher: "Download",
    bereich: "Area",
    lernstandTipp: "La tabella degli alunni e i programmi di questa classe.",
    lernstand: "Progressi",
    verwaltenTipp:
      "Aggiungere e spostare alunni, password e dati di accesso, il codice classe e i programmi di questa classe.",
    programme: "Programmi",
    zuerstKlasse:
      `Creare prima una classe con "Alunni e accessi", accanto al nome della classe.`,
    laedt: "Caricamento...",
    leerVor:
      `In questa classe non ci sono ancora alunni. Aggiungerli con "Alunni e ` +
      `accessi", accanto al nome della classe - poi qui si vedono i loro progressi in `,
    leerNach: ".",
    keineAnsicht: ": per questo programma non c'è ancora una vista della classe.",
  },
  // ★ O-PL (02.10.2026): Lehrkräfte ty-Befehlsform und Substantivstil (Glossar
  // Regel 1), Knopfnamen ohne Anführung (Regel 8), „Uczniowie i dostęp" (§2.6),
  // Kinder als „osoba" (vier Formen, §2.10a).
  pl: {
    meineKlassen: "Moje klasy",
    nurLehrVor:
      "Ta sekcja jest dla nauczycieli. Zaloguj się w programie do nauki kontem " +
      "dla nauczycieli - potem przycisk Moje klasy (albo ",
    nurLehrNach: ") przyprowadzi cię tutaj.",
    lernprogramme: "Programy do nauki",
    zurLernwerkstatt: "← Przejdź do Lernwerkstatt",
    verwalten: "Zarządzaj moimi klasami",
    selbstUebenTipp: (programm: string) => `Poćwicz - otwiera program ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Poćwicz - otwiera Lernwerkstatt (Alt + U)",
    selbstUeben: "Poćwicz",
    keinProgramm: "Dla tej klasy nie jest teraz udostępniony żaden program do nauki.",
    kinderUndZugaenge: "Uczniowie i dostęp",
    handbuecherTitel: "Do pobrania dla nauczycieli",
    tastenwege: "Obsługa z klawiatury",
    tastenwegeCaption: "Obsługa z klawiatury w sekcji Moje klasy",
    hilfeTaste: "Otwórz lub zamknij pomoc",
    listeTaste: "Otwórz lub zamknij tę listę",
    uebenTaste: (programm: string) => `Poćwicz - otwiera program ${programm}`,
    uebenLwTaste: "Poćwicz - otwiera Lernwerkstatt",
    zeitraumTaste:
      "Okres wstecz lub naprzód - tydzień, miesiąc albo rok szkolny w tabeli uczniów",
    nachrichtenTaste: "Otwórz lub zamknij wiadomości",
    farbenTaste: "Kolory i kontrast",
    kontoTaste: "Otwórz lub zamknij menu konta",
    mac: "Alt + klawisz. Na Macu: Option (⌥) + klawisz.",
    klasse: "Klasa",
    klasseWechseln: "Zmień klasę",
    kinderLaden: "Wczytywanie uczniów...",
    kinder: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      }),
    codePunkt: "- kod klasy",
    handbuecherTipp: "Podręczniki dla nauczycieli i plakat do powieszenia - do czytania i drukowania.",
    handbuecher: "Do pobrania",
    bereich: "Sekcja",
    lernstandTipp: "Tabela uczniów i programy tej klasy.",
    lernstand: "Postępy",
    verwaltenTipp:
      "Dodawanie i przenoszenie uczniów, hasła i dane logowania, kod klasy i programy tej klasy.",
    programme: "Programy",
    zuerstKlasse:
      "Najpierw utwórz klasę przyciskiem Uczniowie i dostęp obok nazwy klasy.",
    laedt: "Wczytywanie...",
    leerVor:
      "W tej klasie nie ma jeszcze uczniów. Dodaj ich przyciskiem Uczniowie i dostęp " +
      "obok nazwy klasy - potem zobaczysz tu ich postępy w programie ",
    leerNach: ".",
    keineAnsicht: ": dla tego programu nie ma jeszcze widoku klasy.",
  },
  // ★ O-TR (02.10.2026): Lehrkräfte "siz" mit -(y)In, Knöpfe im Stamm (Glossar
  // Regel 1); "Öğrenciler ve girişler" (§2.6), Einzahl nach der Zahl ("12 öğrenci");
  // der Programmname steht hinter "Program:" ohne Endung (Regel 6).
  tr: {
    meineKlassen: "Sınıflarım",
    nurLehrVor:
      "Bu bölüm öğretmenler içindir. Bir öğrenme programında öğretmen hesabınızla " +
      'giriş yapın - ardından oradaki "Sınıflarım" düğmesi (veya ',
    nurLehrNach: ") sizi buraya geri getirir.",
    lernprogramme: "Öğrenme programları",
    zurLernwerkstatt: "← Lernwerkstatt sayfasına git",
    verwalten: "Sınıflarımı yönet",
    selbstUebenTipp: (programm: string) => `Alıştırma yap - ${programm} açılır (Alt + U)`,
    selbstUebenLwTipp: "Alıştırma yap - Lernwerkstatt açılır (Alt + U)",
    selbstUeben: "Alıştırma yap",
    keinProgramm: "Bu sınıf için şu anda hiçbir öğrenme programı açık değil.",
    kinderUndZugaenge: "Öğrenciler ve girişler",
    handbuecherTitel: "Öğretmenler için indirmeler",
    tastenwege: "Klavye kısayolları",
    tastenwegeCaption: "Sınıflarım bölümündeki klavye kısayolları",
    hilfeTaste: "Yardımı aç / kapat",
    listeTaste: "Bu listeyi aç / kapat",
    uebenTaste: (programm: string) => `Alıştırma yap - ${programm} açılır`,
    uebenLwTaste: "Alıştırma yap - Lernwerkstatt açılır",
    zeitraumTaste:
      "Bir dönem geri veya ileri - öğrenci tablosunda hafta, ay veya öğretim yılı",
    nachrichtenTaste: "Mesajları aç / kapat",
    farbenTaste: "Renkler ve karşıtlık",
    kontoTaste: "Hesap menüsünü aç / kapat",
    mac: "Alt + tuş. Mac'te: Option (⌥) + tuş.",
    klasse: "Sınıf",
    klasseWechseln: "Sınıfı değiştir",
    kinderLaden: "Öğrenci listesi açılıyor...",
    kinder: (n: number) => `${n} öğrenci`,
    codePunkt: "· sınıf kodu",
    handbuecherTipp: "Öğretmen kılavuzları ve asılacak afiş - okumak ve yazdırmak için.",
    handbuecher: "İndirmeler",
    bereich: "Bölüm",
    lernstandTipp: "Bu sınıfın öğrenci tablosu ve programları.",
    lernstand: "İlerleme",
    verwaltenTipp:
      "Öğrenci ekleme ve taşıma, şifreler ve giriş bilgileri, sınıf kodu ve bu sınıfın programları.",
    programme: "Programlar",
    zuerstKlasse:
      'Önce sınıf adının yanındaki "Öğrenciler ve girişler" ile bir sınıf oluşturun.',
    laedt: "Açılıyor...",
    leerVor:
      'Bu sınıfta henüz öğrenci yok. Öğrencileri sınıf adının yanındaki "Öğrenciler ve ' +
      'girişler" ile ekleyin - ardından ilerlemelerini burada görürsünüz. Program: ',
    leerNach: ".",
    keineAnsicht: ": Bu program için henüz sınıf görünümü yok.",
  },
  // ★ O-CS (03.10.2026): Lehrkräfte "vy" in der Mehrzahlform, Knöpfe im Infinitiv
  // (Glossar Regel 1); "Žáci a přístupy" (§2.6), "Cvičit" (Selbst üben, §2.6);
  // ein Kind in der Lehrkraft-Sicht = "osoba" mit vier Mehrzahlformen (§2.11);
  // der Programmname steht hinter dem Kopfwort "program" ungebeugt (Regel 12).
  cs: {
    meineKlassen: "Moje třídy",
    nurLehrVor:
      "Tato část je pro vyučující. Přihlaste se prosím ve výukovém programu " +
      "svým účtem pro vyučující - potom vás tam tlačítko Moje třídy (nebo ",
    nurLehrNach: ") přivede zpět sem.",
    lernprogramme: "Výukové programy",
    zurLernwerkstatt: "← Přejít na Lernwerkstatt",
    verwalten: "Spravovat moje třídy",
    selbstUebenTipp: (programm: string) => `Cvičit - otevře program ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Cvičit - otevře Lernwerkstatt (Alt + U)",
    selbstUeben: "Cvičit",
    keinProgramm: "Pro tuto třídu teď není povolený žádný výukový program.",
    kinderUndZugaenge: "Žáci a přístupy",
    handbuecherTitel: "Ke stažení pro vyučující",
    tastenwege: "Klávesové zkratky",
    tastenwegeCaption: "Klávesové zkratky v části Moje třídy",
    hilfeTaste: "Otevřít / zavřít nápovědu",
    listeTaste: "Otevřít / zavřít tento seznam",
    uebenTaste: (programm: string) => `Cvičit - otevře program ${programm}`,
    uebenLwTaste: "Cvičit - otevře Lernwerkstatt",
    zeitraumTaste:
      "O období zpět nebo dopředu - týden, měsíc nebo školní rok v tabulce žáků",
    nachrichtenTaste: "Otevřít / zavřít zprávy",
    farbenTaste: "Barvy a kontrast",
    kontoTaste: "Otevřít / zavřít nabídku účtu",
    mac: "Alt + klávesa. Na Macu: Option (⌥) + klávesa.",
    klasse: "Třída",
    klasseWechseln: "Změnit třídu",
    kinderLaden: "Načítání žáků...",
    kinder: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      }),
    codePunkt: "· kód třídy",
    handbuecherTipp: "Příručky pro vyučující a plakát na zeď - ke čtení a vytištění.",
    handbuecher: "Ke stažení",
    bereich: "Část",
    lernstandTipp: "Tabulka žáků a programy této třídy.",
    lernstand: "Pokrok",
    verwaltenTipp:
      "Přidávání a přesouvání žáků, hesla a přihlašovací údaje, kód třídy a programy této třídy.",
    programme: "Programy",
    zuerstKlasse:
      "Nejdřív vytvořte třídu tlačítkem Žáci a přístupy vedle názvu třídy.",
    laedt: "Načítání...",
    leerVor:
      "V této třídě zatím nejsou žádní žáci. Přidejte je tlačítkem Žáci a přístupy " +
      "vedle názvu třídy - potom tu uvidíte jejich pokrok v programu ",
    leerNach: ".",
    keineAnsicht: ": pro tento program zatím není přehled třídy.",
  },
  bg: {
    meineKlassen: "Моите класове",
    nurLehrVor:
      "Тази част е за учители. Влезте в някоя програма за обучение " +
      "с учителския си акаунт - после бутонът Моите класове там (или ",
    nurLehrNach: ") ще ви върне тук.",
    lernprogramme: "Програми за обучение",
    zurLernwerkstatt: "← Към Lernwerkstatt",
    verwalten: "Управлявай класовете",
    selbstUebenTipp: (programm: string) => `Упражнения - отваря ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Упражнения - отваря Lernwerkstatt (Alt + U)",
    selbstUeben: "Упражнения",
    keinProgramm: "За този клас в момента няма разрешена програма за обучение.",
    kinderUndZugaenge: "Ученици и достъп",
    handbuecherTitel: "Изтегляния за учители",
    tastenwege: "Клавишни комбинации",
    tastenwegeCaption: "Клавишни комбинации в Моите класове",
    hilfeTaste: "Отваряне / затваряне на помощта",
    listeTaste: "Отваряне / затваряне на този списък",
    uebenTaste: (programm: string) => `Упражнения - отваря ${programm}`,
    uebenLwTaste: "Упражнения - отваря Lernwerkstatt",
    zeitraumTaste:
      "Един период назад или напред - седмица, месец или учебна година в таблицата на учениците",
    nachrichtenTaste: "Отваряне / затваряне на съобщенията",
    farbenTaste: "Цветове и контраст",
    kontoTaste: "Отваряне / затваряне на менюто на акаунта",
    mac: "Alt + клавиш. На Mac: Option (⌥) + клавиш.",
    klasse: "Клас",
    klasseWechseln: "Смени класа",
    kinderLaden: "Зареждане на учениците...",
    kinder: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `${z} ученик`,
        other: (z) => `${z} ученици`,
      }),
    codePunkt: "· код на класа",
    handbuecherTipp: "Ръководствата за учители и плакатът за стената - за четене и отпечатване.",
    handbuecher: "Изтегляния",
    bereich: "Изглед",
    lernstandTipp: "Таблицата на учениците и програмите на този клас.",
    lernstand: "Напредък",
    verwaltenTipp:
      "Добавяне и преместване на ученици, пароли и данни за вход, кодът на класа и програмите на този клас.",
    programme: "Програми",
    zuerstKlasse:
      "Първо създайте клас с бутона Ученици и достъп до името на класа.",
    laedt: "Зареждане...",
    leerVor:
      "В този клас още няма ученици. Добавете ги с бутона Ученици и достъп " +
      "до името на класа - после тук ще виждате напредъка им в програмата ",
    leerNach: ".",
    keineAnsicht: ": за тази програма още няма преглед на класа.",
  },
  el: {
    meineKlassen: "Τα τμήματά μου",
    nurLehrVor:
      "Αυτή η ενότητα είναι για εκπαιδευτικούς. Συνδεθείτε σε ένα πρόγραμμα μάθησης " +
      "με τον λογαριασμό εκπαιδευτικού σας - μετά το κουμπί «Τα τμήματά μου» εκεί (ή ",
    nurLehrNach: ") σας φέρνει πίσω εδώ.",
    lernprogramme: "Εφαρμογές μάθησης",
    zurLernwerkstatt: "← Μετάβαση στο Lernwerkstatt",
    verwalten: "Διαχείριση των τμημάτων μου",
    selbstUebenTipp: (programm: string) => `Εξάσκηση - ανοίγει το ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Εξάσκηση - ανοίγει το Lernwerkstatt (Alt + U)",
    selbstUeben: "Εξάσκηση",
    keinProgramm: "Για αυτό το τμήμα δεν είναι διαθέσιμο αυτή τη στιγμή κανένα πρόγραμμα μάθησης.",
    kinderUndZugaenge: "Μαθητές και πρόσβαση",
    handbuecherTitel: "Αρχεία για εκπαιδευτικούς",
    tastenwege: "Συντομεύσεις πληκτρολογίου",
    tastenwegeCaption: "Συντομεύσεις πληκτρολογίου στην ενότητα «Τα τμήματά μου»",
    hilfeTaste: "Άνοιγμα / κλείσιμο βοήθειας",
    listeTaste: "Άνοιγμα / κλείσιμο αυτής της λίστας",
    uebenTaste: (programm: string) => `Εξάσκηση - ανοίγει το ${programm}`,
    uebenLwTaste: "Εξάσκηση - ανοίγει το Lernwerkstatt",
    zeitraumTaste:
      "Μία περίοδο πίσω ή μπροστά - εβδομάδα, μήνας ή σχολικό έτος στον πίνακα μαθητών",
    nachrichtenTaste: "Άνοιγμα / κλείσιμο μηνυμάτων",
    farbenTaste: "Χρώματα και αντίθεση",
    kontoTaste: "Άνοιγμα / κλείσιμο μενού λογαριασμού",
    mac: "Alt + πλήκτρο. Σε Mac: Option (⌥) + πλήκτρο.",
    klasse: "Τμήμα",
    klasseWechseln: "Αλλαγή τμήματος",
    kinderLaden: "Φόρτωση μαθητών...",
    kinder: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `${z} άτομο`,
        other: (z) => `${z} άτομα`,
      }),
    codePunkt: "· κωδικός τμήματος",
    handbuecherTipp: "Οι οδηγοί για εκπαιδευτικούς και η αφίσα για τον τοίχο - για ανάγνωση και εκτύπωση.",
    handbuecher: "Αρχεία για λήψη",
    bereich: "Ενότητα",
    lernstandTipp: "Ο πίνακας μαθητών και τα προγράμματα αυτού του τμήματος.",
    lernstand: "Πρόοδος",
    verwaltenTipp:
      "Προσθήκη και μετακίνηση μαθητών, κωδικοί πρόσβασης και στοιχεία σύνδεσης, κωδικός τμήματος και τα προγράμματα αυτού του τμήματος.",
    programme: "Προγράμματα",
    zuerstKlasse:
      "Δημιουργήστε πρώτα ένα τμήμα με το κουμπί «Μαθητές και πρόσβαση» δίπλα στο όνομα του τμήματος.",
    laedt: "Φόρτωση...",
    leerVor:
      "Σε αυτό το τμήμα δεν υπάρχουν ακόμα μαθητές. Προσθέστε τους με το κουμπί «Μαθητές και πρόσβαση» " +
      "δίπλα στο όνομα του τμήματος - μετά θα βλέπετε εδώ την πρόοδό τους στο πρόγραμμα ",
    leerNach: ".",
    keineAnsicht: ": για αυτό το πρόγραμμα δεν υπάρχει ακόμα επισκόπηση τμήματος.",
  },
  hu: {
    meineKlassen: "Osztályaim",
    nurLehrVor:
      "Ez a rész tanároknak szól. Jelentkezzen be egy oktatóprogramba " +
      "a tanári fiókjával - utána ott az „Osztályaim” gomb (vagy ",
    nurLehrNach: ") visszavezet ide.",
    lernprogramme: "Oktatóprogramok",
    zurLernwerkstatt: "← Tovább a Lernwerkstatt oldalára",
    verwalten: "Osztályaim kezelése",
    selbstUebenTipp: (programm: string) => `Gyakorlás - megnyitja: ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Gyakorlás - megnyitja a Lernwerkstatt oldalát (Alt + U)",
    selbstUeben: "Gyakorlás",
    keinProgramm: "Ehhez az osztályhoz most nincs engedélyezett oktatóprogram.",
    kinderUndZugaenge: "Tanulók és belépések",
    handbuecherTitel: "Letöltések tanároknak",
    tastenwege: "Billentyűparancsok",
    tastenwegeCaption: "Billentyűparancsok az „Osztályaim” részben",
    hilfeTaste: "Súgó megnyitása / bezárása",
    listeTaste: "Ennek a listának a megnyitása / bezárása",
    uebenTaste: (programm: string) => `Gyakorlás - megnyitja: ${programm}`,
    uebenLwTaste: "Gyakorlás - megnyitja a Lernwerkstatt oldalát",
    zeitraumTaste:
      "Egy időszakkal vissza vagy előre - hét, hónap vagy tanév a tanulók táblázatában",
    nachrichtenTaste: "Üzenetek megnyitása / bezárása",
    farbenTaste: "Színek és kontraszt",
    kontoTaste: "Fiókmenü megnyitása / bezárása",
    mac: "Alt + billentyű. Mac gépen: Option (⌥) + billentyű.",
    klasse: "Osztály",
    klasseWechseln: "Osztályváltás",
    kinderLaden: "Tanulók betöltése...",
    kinder: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} tanuló`,
        other: (z) => `${z} tanuló`,
      }),
    codePunkt: "· osztálykód",
    handbuecherTipp: "Kézikönyvek tanároknak és a plakát a falra - olvasáshoz és nyomtatáshoz.",
    handbuecher: "Letöltések",
    bereich: "Nézet",
    lernstandTipp: "A tanulók táblázata és az osztály programjai.",
    lernstand: "Haladás",
    verwaltenTipp:
      "Tanulók felvétele és áthelyezése, jelszavak és belépési adatok, az osztálykód és az osztály programjai.",
    programme: "Programok",
    zuerstKlasse:
      "Először hozzon létre egy osztályt a „Tanulók és belépések” gombbal az osztály neve mellett.",
    laedt: "Betöltés...",
    leerVor:
      "Ebben az osztályban még nincsenek tanulók. A „Tanulók és belépések” gombbal vehetők fel, " +
      "az osztály neve mellett - utána itt látható a haladásuk ebben a programban: ",
    leerNach: ".",
    keineAnsicht: ": ehhez a programhoz még nincs osztálynézet.",
  },
  nl: {
    meineKlassen: "Mijn klassen",
    nurLehrVor:
      "Dit deel is voor leerkrachten. Log in bij een leerprogramma met je account voor " +
      "leerkrachten - daarna brengt de knop \"Mijn klassen\" daar (of ",
    nurLehrNach: ") je hier terug.",
    lernprogramme: "Leerprogramma's",
    zurLernwerkstatt: "← Naar Lernwerkstatt",
    verwalten: "Mijn klassen beheren",
    selbstUebenTipp: (programm: string) => `Oefenen - ${programm} openen (Alt + U)`,
    selbstUebenLwTipp: "Oefenen - naar Lernwerkstatt (Alt + U)",
    selbstUeben: "Oefenen",
    keinProgramm: "Voor deze klas is op dit moment geen leerprogramma beschikbaar.",
    kinderUndZugaenge: "Leerlingen en toegang",
    handbuecherTitel: "Downloads voor leerkrachten",
    tastenwege: "Sneltoetsen",
    tastenwegeCaption: "Sneltoetsen in Mijn klassen",
    hilfeTaste: "Help openen / sluiten",
    listeTaste: "Deze lijst openen / sluiten",
    uebenTaste: (programm: string) => `Oefenen - ${programm} openen`,
    uebenLwTaste: "Oefenen - naar Lernwerkstatt",
    zeitraumTaste:
      "Een periode terug of vooruit - week, maand of schooljaar in de tabel met leerlingen",
    nachrichtenTaste: "Berichten openen / sluiten",
    farbenTaste: "Kleuren en contrast",
    kontoTaste: "Accountmenu openen / sluiten",
    mac: "Alt + toets. Op een Mac: Option (⌥) + toets.",
    klasse: "Klas",
    klasseWechseln: "Andere klas kiezen",
    kinderLaden: "Leerlingen laden...",
    kinder: (n: number) =>
      mehrzahl(n, "nl", { one: (z) => `${z} leerling`, other: (z) => `${z} leerlingen` }),
    codePunkt: "· klascode",
    handbuecherTipp: "De handleidingen voor leerkrachten en de poster om op te hangen - om te lezen en af te drukken.",
    handbuecher: "Downloads",
    bereich: "Weergave",
    lernstandTipp: "De tabel met leerlingen en de programma's van deze klas.",
    lernstand: "Voortgang",
    verwaltenTipp:
      "Leerlingen toevoegen en verplaatsen, wachtwoorden en inloggegevens, de klascode en de programma's van deze klas.",
    programme: "Programma's",
    zuerstKlasse:
      "Maak eerst een klas aan via \"Leerlingen en toegang\" naast de naam van de klas.",
    laedt: "Laden...",
    leerVor:
      "In deze klas zitten nog geen leerlingen. Voeg ze toe via \"Leerlingen en toegang\" " +
      "naast de naam van de klas - daarna zie je hier hun voortgang in ",
    leerNach: ".",
    keineAnsicht: ": voor dit programma is er nog geen klasoverzicht.",
  },
  pt: {
    meineKlassen: "As minhas turmas",
    nurLehrVor:
      "Esta área é para docentes. Inicie sessão num programa de aprendizagem " +
      "com a sua conta de docente - depois, o botão \"As minhas turmas\" (ou ",
    nurLehrNach: ") traz de volta a esta página.",
    lernprogramme: "Programas de aprendizagem",
    zurLernwerkstatt: "← Ir para a Lernwerkstatt",
    verwalten: "Gerir as minhas turmas",
    selbstUebenTipp: (programm: string) => `Praticar - abrir o programa ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Praticar - abrir a Lernwerkstatt (Alt + U)",
    selbstUeben: "Praticar",
    keinProgramm: "De momento, nenhum programa de aprendizagem está disponível para esta turma.",
    kinderUndZugaenge: "Estudantes e acessos",
    handbuecherTitel: "Transferências para docentes",
    tastenwege: "Atalhos de teclado",
    tastenwegeCaption: "Atalhos de teclado na área \"As minhas turmas\"",
    hilfeTaste: "Abrir / fechar a ajuda",
    listeTaste: "Abrir / fechar esta lista",
    uebenTaste: (programm: string) => `Praticar - abrir o programa ${programm}`,
    uebenLwTaste: "Praticar - abrir a Lernwerkstatt",
    zeitraumTaste:
      "Um período para trás ou para a frente - semana, mês ou ano letivo na tabela de estudantes",
    nachrichtenTaste: "Abrir / fechar as mensagens",
    farbenTaste: "Cores e contraste",
    kontoTaste: "Abrir / fechar o menu da conta",
    mac: "Alt + tecla. No Mac: Opção (⌥) + tecla.",
    klasse: "Turma",
    klasseWechseln: "Mudar de turma",
    kinderLaden: "A carregar estudantes...",
    kinder: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} pessoa`,
        other: (z) => `${z} pessoas`,
      }),
    codePunkt: "· código da turma",
    handbuecherTipp: "Os guias para docentes e o cartaz para afixar - para ler e imprimir.",
    handbuecher: "Transferências",
    bereich: "Área",
    lernstandTipp: "A tabela de estudantes e os programas desta turma.",
    lernstand: "Progressos",
    verwaltenTipp:
      "Adicionar e mover estudantes, palavras-passe e dados de acesso, código da turma e programas desta turma.",
    programme: "Programas",
    zuerstKlasse:
      "Primeiro, crie uma turma com o botão \"Estudantes e acessos\", ao lado do nome da turma.",
    laedt: "A carregar...",
    leerVor:
      "Esta turma ainda não tem estudantes. Adicione pessoas com o botão \"Estudantes e acessos\", " +
      "ao lado do nome da turma - depois, verá aqui os progressos no programa ",
    leerNach: ".",
    keineAnsicht: ": este programa ainda não tem vista de turma.",
  },
  br: {
    meineKlassen: "Minhas turmas",
    nurLehrVor:
      "Esta área é para docentes. Entre em um aplicativo de aprendizagem " +
      "com sua conta docente - depois, o botão Minhas turmas (ou ",
    nurLehrNach: ") traz você de volta para cá.",
    lernprogramme: "Aplicativos de aprendizagem",
    zurLernwerkstatt: "← Ir para a Lernwerkstatt",
    verwalten: "Gerenciar minhas turmas",
    selbstUebenTipp: (programm: string) => `Praticar - abre ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Praticar - abre a Lernwerkstatt (Alt + U)",
    selbstUeben: "Praticar",
    keinProgramm: "Nenhum aplicativo está disponível para esta turma no momento.",
    kinderUndZugaenge: "Estudantes e acessos",
    handbuecherTitel: "Downloads para docentes",
    tastenwege: "Atalhos de teclado",
    tastenwegeCaption: "Atalhos de teclado na área Minhas turmas",
    hilfeTaste: "Abrir / fechar a ajuda",
    listeTaste: "Abrir / fechar esta lista",
    uebenTaste: (programm: string) => `Praticar - abre ${programm}`,
    uebenLwTaste: "Praticar - abre a Lernwerkstatt",
    zeitraumTaste:
      "Voltar ou avançar um período - semana, mês ou ano letivo na tabela de estudantes",
    nachrichtenTaste: "Abrir / fechar as mensagens",
    farbenTaste: "Cores e contraste",
    kontoTaste: "Abrir / fechar o menu da conta",
    mac: "Alt + tecla. No Mac: Option (⌥) + tecla.",
    klasse: "Turma",
    klasseWechseln: "Trocar de turma",
    kinderLaden: "Carregando estudantes...",
    // Null nie über mehrzahl (Glossar Regel 13: pt-BR 0 = one).
    kinder: (n: number) =>
      n === 0
        ? "Nenhuma pessoa"
        : mehrzahl(n, "br", {
            one: (z) => `${z} estudante`,
            other: (z) => `${z} estudantes`,
          }),
    codePunkt: "· código da turma",
    handbuecherTipp: "Os manuais para docentes e o cartaz para pendurar - para ler e imprimir.",
    handbuecher: "Downloads",
    bereich: "Área",
    lernstandTipp: "A tabela de estudantes e os aplicativos desta turma.",
    lernstand: "Progresso",
    verwaltenTipp:
      "Adicionar e mover estudantes, senhas e dados de acesso, código da turma e os aplicativos desta turma.",
    programme: "Aplicativos",
    zuerstKlasse:
      "Primeiro, crie uma turma com o botão Estudantes e acessos, ao lado do nome da turma.",
    laedt: "Carregando...",
    leerVor:
      "Esta turma ainda não tem estudantes. Adicione pelo botão Estudantes e acessos, " +
      "ao lado do nome da turma - depois, você vê aqui o progresso em ",
    leerNach: ".",
    keineAnsicht: ": este aplicativo ainda não tem visualização da turma.",
  },
  ro: {
    meineKlassen: "Clasele mele",
    nurLehrVor:
      "Această secțiune este pentru cadre didactice. Conectați-vă într-un program de învățare " +
      "cu contul pentru cadre didactice - apoi butonul Clasele mele (sau ",
    nurLehrNach: ") vă aduce înapoi aici.",
    lernprogramme: "Programe de învățare",
    zurLernwerkstatt: "← Mergeți la Lernwerkstatt",
    verwalten: "Administrați clasele mele",
    selbstUebenTipp: (programm: string) => `Exersați - deschide ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Exersați - deschide Lernwerkstatt (Alt + U)",
    selbstUeben: "Exersați",
    keinProgramm: "Pentru această clasă nu este disponibil acum niciun program de învățare.",
    kinderUndZugaenge: "Elevi și conturi",
    handbuecherTitel: "Descărcări pentru cadre didactice",
    tastenwege: "Comenzi rapide",
    tastenwegeCaption: "Comenzi rapide în secțiunea Clasele mele",
    hilfeTaste: "Deschideți / închideți Ajutorul",
    listeTaste: "Deschideți / închideți această listă",
    uebenTaste: (programm: string) => `Exersați - deschide ${programm}`,
    uebenLwTaste: "Exersați - deschide Lernwerkstatt",
    zeitraumTaste:
      "O perioadă înapoi sau înainte - săptămână, lună sau an școlar în tabelul elevilor",
    nachrichtenTaste: "Deschideți / închideți mesajele",
    farbenTaste: "Culori și contrast",
    kontoTaste: "Deschideți / închideți meniul contului",
    mac: "Alt + tastă. Pe Mac: Opțiune (⌥) + tastă.",
    klasse: "Clasă",
    klasseWechseln: "Schimbați clasa",
    kinderLaden: "Se încarcă elevii...",
    kinder: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} persoană`,
        few: (z) => `${z} persoane`,
        other: (z) => `${z} de persoane`,
      }),
    codePunkt: "· codul clasei",
    handbuecherTipp: "Ghidurile pentru cadre didactice și afișul de pus pe perete - de citit și de imprimat.",
    handbuecher: "Descărcări",
    bereich: "Secțiune",
    lernstandTipp: "Tabelul elevilor și programele acestei clase.",
    lernstand: "Progres",
    verwaltenTipp:
      "Adăugarea și mutarea elevilor, parole și date de conectare, codul clasei și programele acestei clase.",
    programme: "Programe",
    zuerstKlasse:
      "Mai întâi creați o clasă cu butonul Elevi și conturi de lângă numele clasei.",
    laedt: "Se încarcă...",
    leerVor:
      "În această clasă nu sunt încă elevi. Adăugați-i cu butonul Elevi și conturi " +
      "de lângă numele clasei - apoi vedeți aici progresul lor în programul ",
    leerNach: ".",
    keineAnsicht: ": pentru acest program nu există încă o prezentare a clasei.",
  },
  sv: {
    meineKlassen: "Mina klasser",
    nurLehrVor:
      "Det här området är för lärare. Logga in i ett lärprogram " +
      "med ditt lärarkonto - sedan tar knappen Mina klasser (eller ",
    nurLehrNach: ") dig tillbaka hit.",
    lernprogramme: "Lärprogram",
    zurLernwerkstatt: "← Gå till Lernwerkstatt",
    verwalten: "Hantera mina klasser",
    selbstUebenTipp: (programm: string) => `Öva själv - öppnar ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Öva själv - öppnar Lernwerkstatt (Alt + U)",
    selbstUeben: "Öva själv",
    keinProgramm: "Inget lärprogram är tillgängligt för den här klassen just nu.",
    kinderUndZugaenge: "Elever och inloggningar",
    handbuecherTitel: "Att ladda ned för lärare",
    tastenwege: "Kortkommandon",
    tastenwegeCaption: "Kortkommandon i Mina klasser",
    hilfeTaste: "Öppna eller stäng hjälpen",
    listeTaste: "Öppna eller stäng den här listan",
    uebenTaste: (programm: string) => `Öva själv - öppnar ${programm}`,
    uebenLwTaste: "Öva själv - öppnar Lernwerkstatt",
    zeitraumTaste:
      "En period bakåt eller framåt - vecka, månad eller läsår i elevtabellen",
    nachrichtenTaste: "Öppna eller stäng meddelanden",
    farbenTaste: "Färger och kontrast",
    kontoTaste: "Öppna eller stäng kontomenyn",
    mac: "Alt + tangent. På Mac: Alternativ (⌥) + tangent.",
    klasse: "Klass",
    klasseWechseln: "Byt klass",
    kinderLaden: "Läser in elever...",
    kinder: (n: number) =>
      mehrzahl(n, "sv", {
        one: (z) => `${z} elev`,
        other: (z) => `${z} elever`,
      }),
    codePunkt: "· klasskod",
    handbuecherTipp: "Handböckerna för lärare och affischen att sätta upp - att läsa och skriva ut.",
    handbuecher: "Att ladda ned",
    bereich: "Visning",
    lernstandTipp: "Elevtabellen och klassens program.",
    lernstand: "Framsteg",
    verwaltenTipp:
      "Lägg till och flytta elever, lösenord och inloggningsuppgifter, klasskod och klassens program.",
    programme: "Program",
    zuerstKlasse:
      "Skapa först en klass med knappen Elever och inloggningar bredvid klassnamnet.",
    laedt: "Läser in...",
    leerVor:
      "Det finns inga elever i den här klassen än. Lägg till dem med knappen Elever och inloggningar " +
      "bredvid klassnamnet - sedan ser du deras framsteg här i programmet ",
    leerNach: ".",
    keineAnsicht: ": det finns ingen klassöversikt för det här programmet än.",
  },
  uk: {
    meineKlassen: "Мої класи",
    nurLehrVor:
      "Цей розділ призначений для педагогів. Увійдіть у навчальну програму " +
      "зі своїм обліковим записом педагога - після цього кнопка Мої класи (або ",
    nurLehrNach: ") поверне вас сюди.",
    lernprogramme: "Навчальні програми",
    zurLernwerkstatt: "← Перейти до Lernwerkstatt",
    verwalten: "Керувати моїми класами",
    selbstUebenTipp: (programm: string) => `Тренуватися - відкрити програму ${programm} (Alt + U)`,
    selbstUebenLwTipp: "Тренуватися - відкрити Lernwerkstatt (Alt + U)",
    selbstUeben: "Тренуватися",
    keinProgramm: "Для цього класу зараз не відкрито жодної навчальної програми.",
    kinderUndZugaenge: "Учні й доступи",
    handbuecherTitel: "Завантаження для педагогів",
    tastenwege: "Сполучення клавіш",
    tastenwegeCaption: "Сполучення клавіш у розділі Мої класи",
    hilfeTaste: "Відкрити / закрити довідку",
    listeTaste: "Відкрити / закрити цей список",
    uebenTaste: (programm: string) => `Тренуватися - відкрити програму ${programm}`,
    uebenLwTaste: "Тренуватися - відкрити Lernwerkstatt",
    zeitraumTaste:
      "На один період назад або вперед - тиждень, місяць або навчальний рік у таблиці учнів",
    nachrichtenTaste: "Відкрити / закрити повідомлення",
    farbenTaste: "Кольори й контраст",
    kontoTaste: "Відкрити / закрити меню облікового запису",
    mac: "Alt + клавіша. На Mac: Option (⌥) + клавіша.",
    klasse: "Клас",
    klasseWechseln: "Змінити клас",
    kinderLaden: "Завантаження списку учнів...",
    kinder: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} особа`,
        few: (z) => `${z} особи`,
        many: (z) => `${z} осіб`,
        other: (z) => `${z} особи`,
      }),
    codePunkt: "· код класу",
    handbuecherTipp: "Посібники для педагогів і плакат на стіну - щоб читати й друкувати.",
    handbuecher: "Завантаження",
    bereich: "Розділ",
    lernstandTipp: "Таблиця учнів і програми цього класу.",
    lernstand: "Поступ",
    verwaltenTipp:
      "Додавання й переведення учнів, паролі та дані для входу, код класу й програми цього класу.",
    programme: "Програми",
    zuerstKlasse:
      "Спочатку створіть клас кнопкою Учні й доступи поруч із назвою класу.",
    laedt: "Завантаження...",
    leerVor:
      "У цьому класі ще немає учнів. Додайте їх кнопкою Учні й доступи " +
      "поруч із назвою класу - тоді тут буде видно їхній поступ у програмі ",
    leerNach: ".",
    keineAnsicht: ": для цієї програми ще немає огляду класу.",
  },
});

export function MeineKlassePage({ verwalten = false }: { verwalten?: boolean }) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const account = useTypingAuth((s) => s.account);
  const { released } = useProgrammeCatalog();
  const backend = typingBackend();

  // Adresse EINMAL beim Öffnen lesen — danach führt der Zustand.
  // Grund: `Root` in App.tsx hängt `key={location.key}` an die Seite; jede
  // Router-Navigation (auch `setSearchParams` mit `replace`) baut sie komplett
  // neu auf und würde den gewählten Reiter zurückwerfen (Fehlerklasse K33:
  // Zustands-Reset am falschen Anker). Die Adresse wird darum unten nur noch
  // per `history.replaceState` NACHGEZOGEN — ohne Navigation, ohne Neuaufbau.
  const [start] = useState(() => new URLSearchParams(window.location.search));
  /**
   * ★ Das Programm steht seit dem 01.09.2026 an ZWEI Stellen, je nach
   * Rechnernamen (F9): auf `weingartner.org` im Pfad
   * (`/lernwerkstatt/tippen/klasse`), auf `tastenflow.org` im Anhang
   * (`/meine-klasse?app=tippen`). Der Pfad hat Vorrang; fehlt er, gilt der
   * Anhang - so kommt die alte Adresse `/lernwerkstatt/klasse?app=tippen`
   * weiterhin an, auch ohne die Umleitung.
   */
  const { programm: programmAusPfad } = useParams<{ programm?: string }>();
  // ★ 16.11.2026: Ohne Programm im Pfad/Anhang gilt auf tastenflow.org und
  // lexami.org die App der Adresse - eine Lehrkraft auf lexami.org sieht zuerst Lexami.
  const herkunft = lwProgram(programmAusPfad ?? start.get("app") ?? hausApp());
  const [classes, setClasses] = useState<TypingClass[]>([]);
  const [klassenGeladen, setKlassenGeladen] = useState(false);
  const [pupils, setPupils] = useState<TypingAccount[]>([]);
  /**
   * Für WELCHE Klasse die Liste in `pupils` gilt. Der Anker für die Regel
   * unten: „Lädt …" nur, solange für die gewählte Klasse noch gar nichts da
   * ist - beim Nachladen bleibt das Bisherige stehen.
   */
  const [pupilsFuer, setPupilsFuer] = useState<string | null>(null);
  const [nachladend, setNachladend] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((n) => n + 1);

  const [reiter, setReiter] = useState<Reiter | null>(
    () => lwProgram(start.get("reiter"))?.key ?? herkunft?.key ?? null,
  );
  /**
   * ★ E5 (19.09.2026): für welche Klasse das Einstiegsprogramm sein EINMALIGES
   * Vorrecht schon wahrgenommen hat - siehe die Reiter-Korrektur weiter unten.
   */
  const einstiegDurchgesetztFuer = useRef<string | null>(null);
  const [gewaehlt, setGewaehlt] = useState<string | null>(start.get("klasse"));
  const [handbuecherOffen, setHandbuecherOffen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  /**
   * ★ E2 (18.09.2026): die zwei Hälften des Umschalters „Lernstand | Kinder
   * und Zugänge" - Ziel des Fokus nach einem echten Bildschirmwechsel (siehe
   * den Fokus-Block weiter unten).
   */
  const lernstandLinkRef = useRef<HTMLAnchorElement>(null);
  const verwaltenLinkRef = useRef<HTMLAnchorElement>(null);
  const bereichFokusErledigt = useRef<string | null>(null);
  const istLehrkraft = account?.role === "lehrkraft";

  // Klassen laden.
  useEffect(() => {
    if (!istLehrkraft || !account) return;
    let alive = true;
    void backend.listClasses(account.id).then((cs) => {
      if (alive) {
        setClasses(cs);
        setKlassenGeladen(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [backend, account, istLehrkraft, refresh]);

  // ★ 21.09.2026: ohne ausdrückliche Wahl (Adresse, Klick) öffnet die Seite die
  // Klasse, die diese Lehrkraft zuletzt offen hatte - nicht die oberste der Liste.
  const zuletzt = useMemo(() => liesZuletztKlasse(account?.id), [account?.id]);
  const cls = useMemo(
    () => waehleKlasse(classes, gewaehlt, zuletzt),
    [classes, gewaehlt, zuletzt],
  );
  useEffect(() => {
    if (cls) merkeZuletztKlasse(account?.id, cls.code);
  }, [account?.id, cls?.code]);

  /*
   * ★ FOKUS-FÜHRUNG: still nachladen statt austauschen.
   *
   * Jede Einstellung in einem Reiter meldet die Änderung mit `bump()` hierher
   * zurück, damit die Kinder-Liste frisch vom Server kommt. Früher schaltete
   * dieser Lauf `ladend` auf wahr und der ganze Reiter wich einem „Lädt …" -
   * das Bedienelement unter dem Fokus verschwand also mitten im Arbeiten aus
   * dem Baum, und wer mit Tastatur oder Braillezeile arbeitet, stand danach
   * wieder am Seitenanfang ([[feedback_fokus_pflicht_alle_apps]]).
   *
   * Jetzt gilt: „Lädt …" nur, wenn für die gewählte Klasse noch NICHTS da ist
   * (erstes Öffnen, Klassenwechsel). Bei einem Nachladen bleibt die bisherige
   * Liste stehen und wird ausgetauscht, sobald die neue da ist - dieselben
   * Zeilen (`key` = Konto-Kennung), dieselben DOM-Elemente, derselbe Fokus.
   * `nachladend` sagt das währenddessen nur über `aria-busy` an.
   */
  useEffect(() => {
    if (!cls) {
      setPupils([]);
      setPupilsFuer(null);
      return;
    }
    let alive = true;
    setNachladend(true);
    void backend.listPupils(cls.code).then((ps) => {
      if (alive) {
        setPupils(ps);
        setPupilsFuer(cls.code);
        setNachladend(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [backend, cls?.code, refresh]);

  /** Erstes Laden dieser Klasse - nur dann darf der Reiter weichen. */
  const ladend = !!cls && pupilsFuer !== cls.code;

  /**
   * ★ E5 (19.09.2026): DAS EINSTIEGSPROGRAMM DIESER SITZUNG.
   *
   * Johannes: *„wer über Tastenflow einsteigt, sieht nur Tastenflow, wer über
   * Im Griff einsteigt, sieht die Statistik von Im Griff … Einstieg über die
   * Lernwerkstatt wählt das erste Programm vor."* Kommt der Weg aus einem
   * Programm (`herkunft`, Pfad oder `?app=`), gilt das. Ohne Programm im
   * Pfad/Anhang (Einstieg über die Lernwerkstatt) gilt das ERSTE Programm der
   * GESPEICHERTEN Liste der gewählten Klasse - ohne eine solche Liste
   * `STANDARD_EINSTIEGSPROGRAMM` (Tastenflow).
   */
  const einstiegsProgramm: LwProgramKey = useMemo(() => {
    if (herkunft) return herkunft.key;
    return lwProgram(cls?.programs?.[0])?.key ?? STANDARD_EINSTIEGSPROGRAMM;
  }, [herkunft, cls]);

  // ★ 28.09.2026: ausserhalb von Deutsch nur Tastenflow (`programmInSprache`).
  const releasedHier = useCallback(
    (key: string) => released(key) && programmInSprache(key, sprache),
    [released, sprache],
  );
  const programme = useMemo(
    () => effectiveProgramsOfClass(cls, einstiegsProgramm, releasedHier),
    [cls, einstiegsProgramm, releasedHier],
  );
  const offeneProgramme = useMemo(
    () => LW_PROGRAMS.filter((p) => releasedHier(p.key)),
    [releasedHier],
  );

  /*
   * ★★★ WER NOCH KEINE KLASSE HAT, LANDET IN DER VERWALTUNG.
   *
   * Bis 09.09.2026 sprang die Seite dafür auf den Reiter „Klasse & Konten".
   * Den Reiter gibt es nicht mehr - die Regel bleibt: Ohne Klasse ist jede
   * Programm-Ansicht leer, und der Erste-Schritte-Weg (MK-E6) steht in der
   * Verwaltung. Erst NACH dem Laden entscheiden, sonst sähe jede Lehrkraft für
   * einen Wimpernschlag „keine Klasse".
   */
  const zeigeVerwaltung = verwalten || (klassenGeladen && classes.length === 0);

  /*
   * Ein abgewähltes Programm darf nicht als toter Reiter stehen bleiben - und
   * ohne gewähltes Programm zeigt die Seite das erste der Klasse.
   *
   * ★★★ E5 (19.09.2026): DAS EINSTIEGSPROGRAMM BEKOMMT EINMAL JE KLASSE DEN
   * VORTRITT - auch wenn der aktuelle Reiter zufällig schon ein GÜLTIGES
   * Mitglied von `programme` ist.
   *
   * Warum das nötig ist: `cls` (die Klasse) und `released` (die Admin-
   * Freigabe, `useProgrammeCatalog`) laden über ZWEI VERSCHIEDENE, unabhängig
   * asynchrone Wege. Lädt die Klasse VOR der Freigabe fertig, kann eine
   * Zwischenrechnung von `programme` das Einstiegsprogramm noch nicht
   * enthalten (z. B. ein noch nicht als freigegeben erkanntes Punktgenau) -
   * die einfache Regel „nur korrigieren, wenn der Reiter ungültig ist" würde
   * dann auf ein anderes, zufällig schon gültiges Programm einrasten und dort
   * STEHEN BLEIBEN, auch nachdem das Einstiegsprogramm kurz danach verfügbar
   * wird (gemessen: `tests/meine-klasse-programme-je-einstieg.test.tsx`).
   *
   * Der Ref merkt sich darum, für welchen Klassencode das Einstiegsprogramm
   * sein Vorrecht schon einmal bekommen hat - ERST danach darf die Lehrkraft
   * frei zwischen den Reitern wechseln, ohne dass diese Korrektur sie zurück
   * ins Einstiegsprogramm zieht.
   */
  useEffect(() => {
    if (!cls || programme.length === 0) return;
    const einstiegDa = programme.some((p) => p.key === einstiegsProgramm);
    if (einstiegDurchgesetztFuer.current !== cls.code && einstiegDa) {
      einstiegDurchgesetztFuer.current = cls.code;
      if (reiter !== einstiegsProgramm) setReiter(einstiegsProgramm);
      return;
    }
    if (!reiter || !programme.some((p) => p.key === reiter))
      setReiter(einstiegDa ? einstiegsProgramm : programme[0].key);
  }, [cls, programme, reiter, einstiegsProgramm]);

  const selectClass = (code: string) => setGewaehlt(code);

  /*
   * ★ T3 (01.09.2026): Dieser Bereich trägt die gemeinsame `AppKopfzeile`.
   * Sie bringt Hilfe-Knopf, Kurztasten-Knopf, Konto-Menü, Nachrichten-Glocke
   * und Farbschalter mit - und ALLE müssen etwas tun. Ein Knopf ohne Wirkung
   * ist der Befund vom 30.08.2026, nicht eine Kleinigkeit.
   *
   * Die Kopfzeile behandelt Alt + K und Alt + J selbst; Alt + N gehört der
   * Glocke. Hier bleiben Alt + H, Alt + T und Alt + U.
   */
  const [hilfeOffen, setHilfeOffen] = useState(false);
  const [kurztastenOffen, setKurztastenOffen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useTypingAuth((s) => s.logout);
  /** Der Weg zum eigenen Üben - in das Programm, aus dem der Weg hierher kam. */
  // ★ 16.11.2026: Die App der eigenen Adresse liegt dort unter „/" - so bleibt
  // der Rückweg auf tastenflow.org bzw. lexami.org und ohne Umweg.
  const uebenPfad =
    herkunft && herkunft.key === hausApp() ? "/" : (herkunft?.path ?? hausStartHref());

  /**
   * ★★★★★ DIE TASTE, NICHT DAS ZEICHEN (berichtigt 09.09.2026).
   *
   * > **Johannes, 09.09.2026:** „die tastenkombination ALT+t funktioniert immer
   * > noch nicht! sie ist eine der wichtigsten!!!"
   *
   * ⚠️⚠️ Hier stand `e.key.toLowerCase()`. **Am Mac erzeugt die Wahltaste ein
   * Sonderzeichen** - aus Alt + T wird `„†"`, aus Alt + H `„˙"`, aus Alt + U
   * ein toter Akzent (`„¨"`). Der Vergleich mit dem Buchstaben konnte dort nie
   * zutreffen: **alle drei Tasten waren in »Meine Klasse« tot**, und das ist
   * der Lehrkraft-Bereich ALLER vier Programme. `e.code` ist der Name der
   * TASTE und bleibt `„KeyT"`, egal welches Zeichen dabei herauskommt.
   *
   * Dieselbe Falle, ein Haus weiter: `BereichSchalter` (05.09.),
   * `WasFehltSchalter` (07.09.). Der Wächter dagegen sah bis heute nur ins
   * Mathecoach-Revier und nur auf `e.key === "x"` - diese Zeile schreibt den
   * Buchstaben erst in eine Variable und rutschte deshalb durch
   * (`tests/kuerzel-alt-t.test.tsx` §1 sieht jetzt in ganz `src/`).
   *
   * ⚠️ **Alt + T steht hier nicht mehr.** Die Taste wird seit dem 09.09. EINMAL
   * behandelt, in `AppKopfzeile` - dort, wo ihr Knopf sitzt, und damit in jeder
   * App. Stünde sie zusätzlich hier, schaltete sie zweimal um, also gar nicht.
   */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      // Die Kopfzeile hat die Taste schon behandelt (Alt + T, Alt + J, Alt + K,
      // Alt + N) ⇒ nicht ein zweites Mal.
      if (e.defaultPrevented) return;
      if (e.code === "KeyH") {
        e.preventDefault();
        setHilfeOffen((v) => !v);
      } else if (e.code === "KeyU") {
        e.preventDefault();
        // ★ A6 (Umbau 11.09.2026): Die Marke „übt selbst" hängt seither am
        // Verlaufseintrag (`state`), nicht mehr am Tab (`sessionStorage") -
        // ein neuer Aufruf der Adresse trägt sie nie mit, ein Neuladen DIESES
        // Eintrags behält sie. Siehe `TippenTrainerPage.tsx`.
        navigate(uebenPfad, { state: { selbstUeben: true } });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, uebenPfad]);

  // Adresse mitführen (teilbar, überlebt ein Neuladen) — ohne Navigation.
  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    // Steht das Programm schon im Pfad, gehört es nicht ein zweites Mal in den
    // Anhang - sonst trägt die Adresse dieselbe Angabe zweimal.
    if (herkunft && !programmAusPfad) next.set("app", herkunft.key);
    if (cls) next.set("klasse", cls.code);
    if (reiter && !zeigeVerwaltung) next.set("reiter", reiter);
    else next.delete("reiter");
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${next.toString()}`,
    );
  }, [herkunft, programmAusPfad, cls, reiter, zeigeVerwaltung]);

  const wechsle = (r: Reiter) => {
    setReiter(r);
    // Fokus in die neue Region — sonst bleibt der Wechsel für Screenreader und
    // Braillezeile unbemerkt. setTimeout(0) statt rAF: rAF ist in versteckten
    // Tabs tot ([[feedback_fokus_pflicht_alle_apps]]).
    setTimeout(() => panelRef.current?.focus(), 0);
  };

  /*
   * ★★★ E2 (18.09.2026): FOKUS AUF DER JETZT AKTUELLEN UMSCHALTER-HÄLFTE.
   *
   * Ein Klick auf „Lernstand" oder „Kinder und Zugänge" ist eine ECHTE
   * Navigation (andere Adresse, anderer Bildschirm) - anders als `wechsle()`
   * oben, das nur den Reiter innerhalb DERSELBEN Seite tauscht. `Root` in
   * `App.tsx` hängt `key={location.key}` an jede Route und baut den
   * Bildschirm bei jeder Navigation komplett neu auf; der lokale Zustand
   * dieser Komponente (samt der beiden Ref-Ziele) ist danach frisch.
   *
   * Der Link trägt darum die Marke `{ bereichFokus: true }` im
   * Verlaufseintrag (dieselbe Technik wie `selbstUeben`, A6 11.09.2026) - sie
   * überlebt den Neuaufbau, weil sie am Eintrag hängt, nicht an einem
   * Zustand. Der Fokus kann aber erst gesetzt werden, sobald die Klasse
   * (und mit ihr der Umschalter) geladen ist - `cls` steht darum in den
   * Abhängigkeiten, `bereichFokusErledigt` verhindert, dass ein späterer
   * Klassenwechsel den Fokus ein zweites Mal wegzieht.
   *
   * ⚠️ `setTimeout(0)`, nicht direkt: `FocusOnRouteChange` (`src/lib/a11y.tsx`)
   * setzt beim selben Bildschirmwechsel synchron den Fokus auf `#seitentitel`.
   * Der Zeitgeber läuft garantiert NACH diesem synchronen Lauf ab und
   * gewinnt darum zuverlässig - ganz gleich, in welcher Reihenfolge React die
   * Effekte der beiden (voneinander unabhängigen) Bauteile ausführt.
   */
  /*
   * ⚠️ Abnahme 18.09.2026: Die Marke wird erst IM Zeitgeber gesetzt. Ändert
   * sich `cls` gleich nach dem Wechsel noch einmal (die Klassenliste lädt
   * nach), räumt React den Zeitgeber ab - stünde die Marke dann schon auf
   * „erledigt", bekäme der Umschalter den Fokus nie. Sie merkt sich den
   * Verlaufseintrag (`location.key`) statt nur ja/nein; das stimmt auch dann
   * noch, falls `Root` die Seite einmal nicht mehr je Navigation neu aufbaut.
   */
  useEffect(() => {
    if (bereichFokusErledigt.current === location.key) return;
    if (!(location.state as { bereichFokus?: boolean } | null)?.bereichFokus) return;
    if (!cls) return; // Die Klasse (und der Umschalter) sind noch nicht da.
    const ziel = zeigeVerwaltung ? verwaltenLinkRef.current : lernstandLinkRef.current;
    if (!ziel) return;
    const schluessel = location.key;
    const zeitgeber = setTimeout(() => {
      ziel.focus();
      bereichFokusErledigt.current = schluessel;
    }, 0);
    return () => clearTimeout(zeitgeber);
  }, [location.key, location.state, zeigeVerwaltung, cls]);

  /**
   * ★ E2 (18.09.2026): der Umschalter „Lernstand | Kinder und Zugänge" -
   * dieselbe Stelle im Klassenkopf, auf BEIDEN Bildschirmen (siehe
   * `Klassenkopf`, Eigenschaft `umschalter`). Ohne Klasse gibt es noch
   * keinen Lernstand und darum auch keinen Umschalter - `Klassenkopf` selbst
   * zeigt in dem Fall ohnehin nichts an (`if (!cls) return null;`).
   */
  const bereichUmschalter = cls ? (
    <BereichUmschalter
      zeigeVerwaltung={zeigeVerwaltung}
      lernstandHref={meineKlasseHref(herkunft?.key ?? reiter, cls.code)}
      verwaltenHref={klasseVerwaltenHref(herkunft?.key ?? reiter, cls.code)}
      lernstandRef={lernstandLinkRef}
      verwaltenRef={verwaltenLinkRef}
    />
  ) : null;

  if (!account || !istLehrkraft) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto w-full max-w-2xl space-y-4">
          {/* ★ E7 (11.09.2026): Seitentitel höchstens 22 px (`text-[1.375rem]`),
              nicht `text-2xl` (24 px) - siehe §2.7 des Umbauplans. */}
          <h1 className="text-[1.375rem] font-semibold text-ink">{t.meineKlassen}</h1>
          <p className="text-ink-muted">
            {t.nurLehrVor}<kbd>Alt</kbd> + <kbd>S</kbd>{t.nurLehrNach}
          </p>
          <nav aria-label={t.lernprogramme} className="flex flex-wrap gap-2">
            {LW_PROGRAMS.filter((p) => programmInSprache(p.key, sprache)).map((p) => (
              <Link
                key={p.key}
                to={p.path}
                className="btn-secondary inline-flex items-center gap-2"
              >
                {/* ★ Das echte Zeichen der App (10.09.2026, Johannes). */}
                <ProgrammZeichen programm={p.key} /> <ProgrammName programm={p} />
              </Link>
            ))}
          </nav>
          {/* ★ 28.09.2026: die Lernwerkstatt gibt es nur auf Deutsch. */}
          {sprache === "de" && (
            <p className="text-sm">
              <Link to={hausStartHref()} className="text-accent underline underline-offset-2">
                {mitHausName(t.zurLernwerkstatt)}
              </Link>
            </p>
          )}
          <RechtlichesFusszeile className="mt-8 text-sm text-ink-muted" />
        </div>
      </div>
    );
  }

  return (
    /*
      ★★★ `bedien-schlank` (11.09.2026): EINE Bedienhöhe für die ganze Seite -
      alle vier Programm-Reiter, der Klassenkopf, die Verwaltung. Johannes:
      *„schaue dir die schalterhöhen an, ich glaube es gibt 5 verschiedene
      höhen … bitte gestalte diese wichtige seite richtig ansprechend
      übersichtlich und schlank"*. Die Regeln stehen in `index.css`
      (`.bedien-schlank`), der Auftrag in
      `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md` (R1, R10).
      `space-y-4` statt `-5`: 16 px zwischen Abschnitten (R5).
    */
    <div className="bedien-schlank min-h-screen px-4 py-6">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/*
          ★ T3 (01.09.2026): die gemeinsame Kopfzeile statt einer eigenen.
          `bereich` sagt, wo man ist. Zusammen liest eine Sprachausgabe
          „Tastenflow, Meine Klassen" als EINE Überschrift.
          ⚠️ `AppKopfzeile` selbst ist unverändert (gemeinsamer Teil,
          `apps/GEMEINSAM.md` §1) - hier wird sie nur benutzt.

          ★★★ E5 (19.09.2026): `titel` folgt dem OFFENEN Programm, nicht mehr
          nur der Herkunft. Johannes: *„oben in der Kopfzeile ‚Tastenflow -
          Meine Klassen', das ändert sich aber nicht, wenn man umschaltet"* -
          genau das war der Fehler. Auf dem Lernstand-Bildschirm gilt darum
          der offene Reiter (`reiter`), auf der Verwaltung (ohne Programm-
          Reiter) bleibt die Herkunft massgeblich - dieselbe Unterscheidung
          wie bei `programmName` der Hilfe weiter unten.
        */}
        <AppKopfzeile
          titel={
            zeigeVerwaltung
              ? (herkunft?.label ?? "Lernwerkstatt")
              : (lwProgram(reiter)?.label ?? herkunft?.label ?? "Lernwerkstatt")
          }
          titelId="seitentitel"
          // ★ 28.09.2026 (Johannes): „Sensorik" links oben führt nach
          // weingartner.org, das es nur auf Deutsch gibt - in jeder anderen
          // Bedienungssprache (nur auf den Tastenflow-Adressen möglich) fehlt
          // der Verweis. Auf weingartner.org bleibt `sprache` immer "de".
          ohneHeimVerweis={sprache !== "de"}
          // ★ Der Name des Bereichs, nicht der eines Knopfs (seit E2,
          // 18.09.2026 gibt es dafür keinen eigenen Knopf mehr - zwischen den
          // beiden Ansichten wechselt der Umschalter „Lernstand | Kinder und
          // Zugänge" im Klassenkopf, siehe `bereichUmschalter`).
          bereich={zeigeVerwaltung ? t.verwalten : t.meineKlassen}
          onHilfe={() => setHilfeOffen((v) => !v)}
          onKurztasten={() => setKurztastenOffen((v) => !v)}
          kurztastenOffen={kurztastenOffen}
          hilfeKuerzel="Alt + H"
          kurztastenKuerzel="Alt + T"
          account={{
            id: account.id,
            name: account.name,
            istLehrkraft: true,
          }}
          onAbmelden={() => {
            logout();
            navigate(uebenPfad);
          }}
          extra={
            <>
              {/*
                ★ E2 (18.09.2026): Der Weg zur Verwaltung UND der Rückweg von
                dort sind hier weg - beide waren eigene Bauarten an zwei
                verschiedenen Stellen (Knopf oben, kleiner Link unten auf dem
                Verwaltungs-Bildschirm) und genau das hat Kolleginnen und
                Kollegen verwirrt. An ihre Stelle tritt EIN Umschalter
                „Lernstand | Kinder und Zugänge" im Klassenkopf, auf BEIDEN
                Bildschirmen an derselben Stelle (`bereichUmschalter`, siehe
                oben im Bauteil und `Klassenkopf` weiter unten).
              */}
              {/*
                ★ „Selbst üben" - der Rückweg aus der Verwaltung ins Programm.
                Er heisst NICHT „Zurück zu …": Eine Lehrkraft landet mit T3 nach
                der Anmeldung gleich hier, kommt also gar nicht „von dort".

                ★ N15b (19.09.2026): `ausrichtung="links"` - bei 375 px ist
                dieser Knopf der ERSTE der Werkzeug-Reihe (linker Rand).
                Rechtsbündig gemessen: der Kasten reichte 168 px über den
                linken Fensterrand hinaus (unsichtbar in Ruhe, sichtbar erst
                beim Zeigen/Fokus - `scrollWidth` allein zeigt das nicht).
              */}
              <Tipp
                text={herkunft ? t.selbstUebenTipp(herkunft.label) : t.selbstUebenLwTipp}
                ausrichtung="links"
              >
                {(hinweisId) => (
                  <Link
                    to={uebenPfad}
                    // ★ A6 (Umbau 11.09.2026): die Marke „übt selbst" hängt am
                    // Verlaufseintrag dieser Navigation (`state`), nicht mehr
                    // an einem Merkposten im Tab. Siehe `TippenTrainerPage.tsx`.
                    state={{ selbstUeben: true }}
                    className="btn-secondary btn-toggle text-sm"
                    aria-describedby={hinweisId}
                  >
                    {t.selbstUeben}
                  </Link>
                )}
              </Tipp>
            </>
          }
        />

        {zeigeVerwaltung ? (
          <>
            {/*
              ★ E2 (18.09.2026): Derselbe Klassenkopf wie auf dem Lernstand-
              Bildschirm - Klassenname, Klassenwahl und der Umschalter „Lernstand
              | Kinder und Zugänge" stehen hier an DERSELBEN Stelle. Ohne
              `programmWahl`: Programm-Karten gehören zum Lernstand, nicht zur
              Verwaltung. `Klassenkopf` zeigt ohnehin nichts, solange `cls` fehlt
              - der Erste-Schritte-Weg unten bleibt dafür unverändert.
            */}
            <Klassenkopf
              cls={cls}
              classes={classes}
              kinder={ladend ? null : pupils.length}
              onSelectClass={selectClass}
              onHandbuecher={() => setHandbuecherOffen(true)}
              umschalter={bereichUmschalter}
            />
            <KlasseUndKinder
              teacher={account}
              classes={classes}
              cls={cls}
              pupils={pupils}
              offeneProgramme={offeneProgramme}
              /*
                ★ E5 (19.09.2026): eine NEU angelegte Klasse bekommt gleich
                das Programm als Liste gespeichert, aus dem der Weg hierher
                führte - NICHT das erste Programm der gerade GEWÄHLTEN
                (anderen) Klasse: Eine neue Klasse hat noch keine eigene
                Geschichte, aus der sich „das erste Programm" ableiten liesse
                (Regel 1 sagt für genau diesen Fall „ohne Liste ⇒ Tastenflow").
              */
              einstiegsProgramm={herkunft?.key ?? STANDARD_EINSTIEGSPROGRAMM}
              /*
                ★ 18.10.2026: ob die GEWÄHLTE Klasse Tastenflow nutzt (Feld
                „womit anfangen" beim Kind, Spalte in der Excel-Vorlage),
                entscheidet ihr eigener Einstieg - derselbe wie bei den
                Reitern oben (`einstiegsProgramm`, erstes Programm ihrer
                Liste), nicht die Vorgabe für NEUE Klassen.
              */
              klasseEinstieg={einstiegsProgramm}
              onSelectClass={selectClass}
              onChanged={bump}
            />
          </>
        ) : (
          <>
            {/*
              ★★★ DIE REITERREIHE BEDEUTET NUR NOCH EINES: WELCHES PROGRAMM.
              Seit 10.09.2026 steht sie SCHLANK im Klassenkopf, mit dem echten
              Zeichen jeder App (Johannes: „die vier Apps alle schlanker in die
              Zeile darüber, mit den richtigen Icons"). Der Kurzsatz ist in den
              Hinweis gewandert. Der offene Reiter trägt Farbe UND Rahmen.
            */}
            <Klassenkopf
              cls={cls}
              classes={classes}
              kinder={ladend ? null : pupils.length}
              /*
                ★ „Nachricht an die Klasse" steht seit 11.09.2026 (Nacht) NICHT
                mehr in diesem Kopf, sondern rechts in der Kopfzeile der Karte
                „Klasse · Schuljahr …" im Tastenflow-Reiter (Johannes:
                *„Bringe den Schalter ‚Nachricht an die Klasse' rechts auf
                gleiche Höhe wie: ‚Klasse · Schuljahr 2026/27'"*). Der Kopf
                braucht die Kinderliste darum nicht mehr.
                ⚠️ Die Regel von vorher gilt dort weiter: Solange eine Klasse
                lädt, darf der Knopf nicht die Kinder der VORIGEN Klasse
                bekommen (siehe `ClassOverview`).
              */
              onSelectClass={selectClass}
              onHandbuecher={() => setHandbuecherOffen(true)}
              umschalter={bereichUmschalter}
              /*
                ★★★ E5 (19.09.2026): DER SCHALTER NUR BEI MEHR ALS EINEM
                PROGRAMM. Johannes: *„Wer ein Konto anmeldet und nichts
                anderes aktiviert, soll den Tastenflow-Schalter gar nicht
                sehen … wenn mehrere Programme verwendet werden, brauchen wir
                die Schalter."* Bei genau einem Programm in `programme` (siehe
                `effectiveProgramsOfClass`) gibt es nichts umzuschalten - die
                Reiterreihe bliebe ein Schalter mit einer einzigen, immer
                gedrückten Karte.
              */
              programmWahl={
                programme.length > 1 ? (
                  <div role="tablist" aria-label={t.programme} className="flex flex-wrap gap-2">
                    {programme.map((p, i) => (
                      <ProgrammKarte
                        key={p.key}
                        programm={p}
                        aktiv={reiter === p.key}
                        onClick={() => wechsle(p.key)}
                        erste={i === 0}
                      />
                    ))}
                  </div>
                ) : undefined
              }
            />

            <div
              ref={panelRef}
              tabIndex={-1}
              role="tabpanel"
              id={`mk-panel-${reiter ?? "keins"}`}
              aria-labelledby={`mk-tab-${reiter ?? "keins"}`}
              // Still nachladen: Der Inhalt bleibt stehen (und damit der Fokus),
              // die Sprachausgabe erfährt trotzdem, dass gerade etwas nachkommt.
              aria-busy={nachladend && !ladend ? true : undefined}
              className="outline-none"
            >
              {!reiter ? (
                <p className="text-ink-muted">
                  {t.keinProgramm}{" "}
                  {cls && (
                    <Link
                      to={klasseVerwaltenHref(herkunft?.key ?? null, cls.code)}
                      className="text-accent underline underline-offset-2"
                    >
                      {t.kinderUndZugaenge}
                    </Link>
                  )}
                </p>
              ) : (
                <ProgrammReiter
                  programm={reiter}
                  cls={cls}
                  pupils={pupils}
                  ladend={ladend}
                  teacherId={account.id}
                  onChanged={bump}
                />
              )}
            </div>
          </>
        )}

        {/*
          Impressum und Datenschutz - Pflicht auf jeder Seite (02.09.2026).
          Dieser Bereich hängt als eigene Route neben dem Plattform-Layout und
          hatte deshalb keinen Weg dorthin. Begründung und Gestaltungsregel
          stehen in `RechtlichesFusszeile.tsx`.

          ★ Seit 02.09.2026 hängt hier auch „Unterstützen" (Johannes: „auf der
          wichtigsten seite … fehlt dieser link unten"). NUR hier, nicht am
          Bildschirm für Nicht-Lehrkräfte weiter oben: Wer noch gar keinen
          Zugang hat, wird nicht um Geld gebeten.
        */}
        <RechtlichesFusszeile unterstuetzenApp="meine-klasse" />
      </div>

      {/*
        ★★★ ALLE HANDBÜCHER AN EINER STELLE (07.09.2026), seit 09.09. am
        KLASSENKOPF statt in der Verwaltung: Wer eine Stunde vorbereitet, soll
        sie nicht hinter einem zweiten Bildschirm suchen. Sie stehen genau
        hier - nicht zusätzlich auch noch in der Verwaltung, sonst wären es
        wieder zwei Stellen für dieselbe Sache.
      */}
      {handbuecherOffen && (
        <Modal
          title={t.handbuecherTitel}
          onClose={() => setHandbuecherOffen(false)}
          size="md"
        >
          <HandbuecherKasten programme={programme.map((p) => p.key)} />
        </Modal>
      )}

      {hilfeOffen && (
        <MeineKlasseHilfe
          onClose={() => {
            setHilfeOffen(false);
            // R3: Der Fokus geht auf den Öffner zurück - das erledigt `Modal`
            // von selbst. Hier steht nur der Zustand.
          }}
          /*
            ★ Gemessen am 01.09.2026 im Browser: Hier stand `herkunft?.label` -
            also das Programm, aus dem der Weg HIERHER führte. Wer den Bereich
            direkt aufruft und dann auf „Tastenflow" wechselt, bekam damit eine
            Hilfe ohne ein Wort über die Tabelle, die vor ihm steht.
            ⇒ Massgeblich ist das OFFENE PROGRAMM; die Herkunft ist nur der
            Rückfall, solange keines offen ist (Verwaltungs-Bildschirm).
          */
          programmName={
            zeigeVerwaltung
              ? herkunft?.label
              : (lwProgram(reiter)?.label ?? herkunft?.label)
          }
        />
      )}

      {/*
        ════════════════════════════════════════════════════════════════════
        ★★★ DIE TASTENWEGE STEHEN IN EINEM FENSTER - wie überall sonst
        ════════════════════════════════════════════════════════════════════
        Johannes, 01.09.2026: *„warum gibst du die Tastenwege beim Klicken auf
        ‚ALT' unten dazu, mach bitte ein Popup wie in allen anderen
        Oberflächen auch. Das ist total verwirrend. Was einheitlich geht machen
        wir immer einheitlich."*

        Bis dahin hing die Liste als Kasten am ENDE der Seite. Gemessen im
        Browser: Ihre Oberkante lag bei 5696 px, während der Lesepunkt bei 0
        stand - hinter der ganzen Klassentabelle. Wer den Knopf drückte, sah
        nichts.

        ★ `Modal` bringt alles mit, was hier von Hand nachgebaut werden müsste:
        Fokusfalle, Escape schliesst, Fokus geht auf den Öffner zurück, der
        Rest der Seite wird für die Sprachausgabe stillgelegt.

        ⚠️ `Modal` gehört fünf Apps (`apps/GEMEINSAM.md` §1). Hier wird es
        BENUTZT, nicht geändert.
      */}
      {kurztastenOffen && (
        <Modal
          title={t.tastenwege}
          onClose={() => setKurztastenOffen(false)}
          size="md"
        >
          <table className="w-full text-sm">
            <caption className="sr-only">{t.tastenwegeCaption}</caption>
            <tbody>
              {(
                [
                  ["Alt + H", t.hilfeTaste],
                  ["Alt + T", t.listeTaste],
                  ["Alt + U", herkunft ? t.uebenTaste(herkunft.label) : t.uebenLwTaste],
                  ["Alt + ← / →", t.zeitraumTaste],
                  ["Alt + N", t.nachrichtenTaste],
                  ["Alt + K", t.farbenTaste],
                  ["Alt + J", t.kontoTaste],
                ] as [string, string][]
              ).map(([taste, was]) => (
                // Alle Tabellenspalten mittig (Johannes 10.09.2026).
                <tr key={taste} className="align-top text-center">
                  <td className="py-1.5 pr-6 font-mono whitespace-nowrap">
                    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
                      {taste}
                    </kbd>
                  </td>
                  <td className="py-1.5 text-ink">{was}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="m-0 mt-2 text-sm text-ink-muted">{t.mac}</p>
        </Modal>
      )}

      {/* ★ Z3 (19.09.2026): „Was gibt's Neues" - einmal je bestehender Lehrkraft, nur für Tastenflow. */}
      <NeuigkeitenFenster ort="meine-klassen" programm={herkunft?.key} />
      <RundgangMeineKlassen verwalten={zeigeVerwaltung} programm={zeigeVerwaltung ? herkunft?.key : reiter} klassenGeladen={klassenGeladen} klassenAnzahl={classes.length} />
    </div>
  );
}

/**
 * Der Kopf: WELCHE Klasse, wie gross, welcher Klassencode - und die zwei
 * Wege, die nicht zu einem Programm gehören.
 *
 * ★★★ Bis 09.09.2026 stand die Klasse als graue Pille zwischen anderen Pillen,
 * obwohl sie der Gegenstand der ganzen Seite ist. Jetzt ist sie die
 * Überschrift. Der Umschalter erscheint nur, wenn es überhaupt etwas zu
 * wechseln gibt - eine Auswahlliste mit einem einzigen Eintrag ist ein Schalter
 * ohne Wirkung.
 */
function Klassenkopf({
  cls,
  classes,
  kinder,
  umschalter,
  programmWahl,
  onSelectClass,
  onHandbuecher,
}: {
  cls: TypingClass | null;
  classes: TypingClass[];
  /** Anzahl der Kinder - `null`, solange sie noch nicht geladen sind. */
  kinder: number | null;
  /**
   * ★ E2 (18.09.2026): der Umschalter „Lernstand | Kinder und Zugänge" -
   * rechts neben Klassenname und Klassenwahl, auf BEIDEN Bildschirmen an
   * derselben Stelle (`bereichUmschalter` in `MeineKlassePage`). `undefined`
   * nur in der Zwischenzeit, bevor die Klasse geladen ist.
   */
  umschalter?: React.ReactNode;
  /**
   * Die Programm-Reiter. Vom 10.09.2026 an in der Zeile der Klasse, seit
   * 19.09.2026 (Johannes) in einer ZWEITEN Zeile darunter. Fehlt auf dem Verwaltungs-Bildschirm (E2,
   * 18.09.2026): Programm-Karten gehören zum Lernstand, nicht zur Verwaltung.
   */
  programmWahl?: React.ReactNode;
  onSelectClass: (code: string) => void;
  onHandbuecher: () => void;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  if (!cls) return null;
  return (
    /*
      ════════════════════════════════════════════════════════════════════════
      ★★★ EINE ZEILE, EINE HÖHE (11.09.2026, R1/R4/R5 des Bauplans
      `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`)
      ════════════════════════════════════════════════════════════════════════
      Johannes: *„schaue dir die schalterhöhen an, ich glaube es gibt 5
      verschiedene höhen … bitte gestalte diese wichtige seite richtig
      ansprechend übersichtlich und schlank"*. In diesem Kopf standen drei
      Höhen nebeneinander - Klassenauswahl 44, Programm-Reiter 40, „Handbücher"
      44 px - und darunter eine zweite Zeile mit Kinderzahl und Klassencode.

      Jetzt: alles 36 px (`.bedien-schlank` in `index.css`), Kinderzahl und
      Klassencode in DERSELBEN Zeile neben dem Namen, rechts „Handbücher" - der
      eine Weg, der keinem Programm gehört. Drei Gruppen, 16 px zwischen ihnen,
      8 px darin. Beim Umbruch rutscht eine GANZE Gruppe in die nächste Zeile,
      nie ein halber Schalter.

      ★ 11.09.2026 (Nacht): „Nachricht an die Klasse" ist aus dieser Zeile
      gewandert - Johannes auf seinem Bildschirmfoto, wo der Kopf in zwei
      Zeilen brach: *„Bringe den Schalter ‚Nachricht an die Klasse' rechts auf
      gleiche Höhe wie: ‚Klasse · Schuljahr 2026/27'"*. Er steht jetzt rechts in
      der Kopfzeile der Klassen-Karte im Tastenflow-Reiter
      (`Jahreskarte` → `kopfRechts`, gefüllt in `ClassOverview`).
    */
    <div data-rundgang="klassenkopf" className="space-y-2 rounded-xl bg-surface-sunken px-4 py-3">
      {/*
        ★ 19.09.2026, Johannes: *„die Schalter der Apps wie Tastenflow,
        Punktgenau, … gehören in die zweite Zeile und Lernstand; Kinder und
        Zugänge; Handbücher hinauf"* - oben Klasse, Umschalter und
        „Handbücher", darunter (nur bei mehr als einem Programm) die
        Programm-Reiter.
      */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {classes.length > 1 ? (
            /*
              ════════════════════════════════════════════════════════════════
              ★★★ DIE KLASSENAUSWAHL IST DAS HAUPTELEMENT DES KOPFES (11.09.2026)
              ════════════════════════════════════════════════════════════════
              Johannes, wörtlich: *„die darstellung von dem
              Klassenumschalt-schalter gefällt mir nicht er ist zu wichtig für
              diese größe"*.

              Bis dahin stand der Name ZWEIMAL da - als Überschrift und daneben
              klein in einer Auswahlliste hinter einem grauen „wechseln". Das
              Wichtigste des Kopfes war das Unscheinbarste. Jetzt ist die
              Auswahl selbst der Name: Grund und Rahmen eines Eingabefeldes
              (`field-input`), der Pfeil des Browsers, davor sichtbar „Klasse".

              ★★ SCHRIFT WIE DIE PROGRAMM-REITER (11.09.2026, Nacht). Johannes,
              wörtlich: *„verkleinere die Schriftart bei dem Klassenwahlschalter
              und kontrolliere ob dieser Schalter genauso hoch ist wie die
              Appschalter in dieser Reihe"*. Bis dahin 20 px `font-semibold` als
              „Titel der Seite" (Ausnahme in R4 des Bauplans) - in derselben
              36-px-Zeile wirkte der Name grösser als alles daneben. Jetzt
              `text-sm font-medium`, abgelesen am Namen im Reiter
              (`ProgrammKarte`: `text-sm font-medium text-ink`); die Höhe setzt
              `.bedien-schlank` (36 px) für beide. Die R4-Ausnahme ist gestrichen.

              ── Warum die Überschrift nur für Sprachausgaben da ist ────────────
              Die Seite braucht weiter eine `h2` mit dem Klassennamen: Wer mit
              der Sprachausgabe von Überschrift zu Überschrift springt, muss die
              Klasse finden. Zwei Wege gab es:
               • die Auswahl IN die Überschrift stecken - dann rechnet jede
                 Sprachausgabe den Namen der Überschrift selbst aus einem
                 Bedienelement zusammen, und das tun sie verschieden (die eine
                 liest den gewählten Eintrag, die andere die Beschriftung, eine
                 Überschriftenliste zeigt womöglich gar nichts). Ein Name, der
                 vom Programm abhängt, ist auf der Braillezeile keiner.
               • ⇒ eine `h2` nur für Sprachausgaben (`sr-only`) DAVOR, und die
                 Auswahl als eigenes Feld. Die Überschriften-Navigation landet
                 auf „3b", die Tabtaste auf „Klasse wechseln, Auswahlliste, 3b".
                 Sichtbar steht der Name nur einmal.
              Der Preis: Im Lesemodus kommt der Name zweimal hintereinander -
              erst als Orientierung, dann als Bedienelement. Das ist die
              gewöhnliche Folge „Überschrift, dann Feld" und kein Doppel.

              ⚠️ `aria-label="Klasse wechseln"` beginnt mit dem sichtbaren Wort
              „Klasse" (WCAG 2.5.3) - wer per Sprache steuert, sagt, was er
              sieht. Mit genau einer Klasse gibt es nichts zu wechseln; dort
              bleibt die sichtbare Überschrift (Zweig darunter).
            */
            <>
              <h2 className="sr-only">{cls.name}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="mk-klassenwahl" className="field-label mb-0">
                  {t.klasse}
                </label>
                {/*
                  ⚠️ Bewusst OHNE `Tipp` (gemessen 11.09.2026 bei 320 px): Ein
                  Hinweis, der am linken Rand andockt, läuft bis zu 320 px nach
                  rechts - auch unsichtbar macht er die Seite breiter (394 ⇒ 403
                  px). Sichtbare Beschriftung „Klasse" und der Name „Klasse
                  wechseln" sagen schon, was die Auswahl tut.
                */}
                <select
                  id="mk-klassenwahl"
                  aria-label={t.klasseWechseln}
                  className="field-input w-auto text-sm font-medium"
                  value={cls.code}
                  onChange={(e) => onSelectClass(e.target.value)}
                >
                  {classes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            /* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`.
               ★ `h-9` (11.09.2026, R1): so hoch wie die Auswahl im Zweig darüber
               und wie jeder Schalter der Zeile - dann hat die Zeile EINE Kante. */
            <h2 className="m-0 flex h-9 items-center text-xl font-semibold text-ink">
              {cls.name}
            </h2>
          )}
          {/* Kinderzahl und Klassencode stehen seit 11.09.2026 in DERSELBEN
              Zeile neben dem Namen - vorher eine zweite Zeile darunter. */}
          <p className="m-0 text-sm text-ink-muted">
            {kinder === null ? t.kinderLaden : t.kinder(kinder)}{" "}
            {t.codePunkt}{" "}
            <span className="rounded border border-hairline px-1.5 py-0.5 font-mono text-ink">
              {cls.code}
            </span>
          </p>
        </div>
        {/*
          ★ E2 (18.09.2026) stand der Umschalter rechts neben Klassenname und
          Klassenwahl, vor den Programm-Karten. ★ 19.09.2026, Johannes: *„die
          Schalter Lernstand und Kinder und Zugänge nach rechts"* - seither
          rechts in dieser Zeile, direkt vor „Handbücher" (das ganz rechts
          steht), an derselben Stelle auf beiden Bildschirmen (dort fehlt
          `programmWahl` einfach).
        */}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/*
            ★ Hier stand vom 11.09.2026 abends (R11) bis in die Nacht „Nachricht
            an die Klasse". Er ist in die Kopfzeile der Klassen-Karte gewandert
            (Johannes: *„Bringe den Schalter ‚Nachricht an die Klasse' rechts auf
            gleiche Höhe wie: ‚Klasse · Schuljahr 2026/27'"*) - damit passt dieser
            Kopf wieder in EINE Zeile. In der Verwaltung (`KlasseUndKinder.tsx`)
            steht derselbe Baustein weiter.
          */}
          {/* ★ 19.09.2026, Johannes: „der Schalter Handbücher kommt ganz nach
              rechts" - der Umschalter steht darum davor. Seit demselben Abend
              heisst er „Downloads" (dahinter auch das Plakat zum Aufhängen). */}
          {umschalter}
          <Tipp text={t.handbuecherTipp}>
            {(hinweisId) => (
              <button
                type="button"
                className="btn-secondary btn-umriss"
                aria-describedby={hinweisId}
                onClick={onHandbuecher}
              >
                {t.handbuecher}
              </button>
            )}
          </Tipp>
        </div>
      </div>
      {programmWahl}
    </div>
  );
}

/**
 * ★★★ DER UMSCHALTER „LERNSTAND | KINDER UND ZUGÄNGE" (E2, 18.09.2026).
 *
 * Ersetzt den Knopf „Meine Klassen verwalten" (oben in der Kopfzeile) und den
 * Link „← zurück zu …" (auf dem Verwaltungs-Bildschirm) - zwei Bauarten an
 * zwei Stellen, die genau die Verwirrung erzeugt haben, die Johannes am
 * 18.09.2026 gemeldet hat. EIN Umschalter, an derselben Stelle auf beiden
 * Bildschirmen (`Klassenkopf`, Eigenschaft `umschalter`).
 *
 * ⚠️ ZWEI ECHTE LINKS, kein Umschalter, der nur Zustand hält: Die Adresse
 * wechselt wirklich (`/meine-klasse` ⇄ `/meine-klasse/verwalten`, mit
 * Klassencode und Programm im Anhang) - Lesezeichen und das Handbuch bleiben
 * darum gültig. `aria-current="page"` sagt, welche Hälfte gerade offen ist -
 * dieselbe Auszeichnung wie `CourseTabs.tsx` (Studi-Reiter) - und der
 * Kontrastmodus zeichnet sie über die gemeinsame Regel für `[aria-current]`
 * in `index.css` automatisch mit einem dicken Rahmen.
 *
 * Die `<nav>` mit `aria-label="Bereich"` gibt der Gruppe einen Namen für die
 * Sprachausgabe - ohne ihn wären zwei Links ohne erkennbaren Zusammenhang.
 */
function BereichUmschalter({
  zeigeVerwaltung,
  lernstandHref,
  verwaltenHref,
  lernstandRef,
  verwaltenRef,
}: {
  zeigeVerwaltung: boolean;
  lernstandHref: string;
  verwaltenHref: string;
  lernstandRef: React.RefObject<HTMLAnchorElement>;
  verwaltenRef: React.RefObject<HTMLAnchorElement>;
}) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  // ★ Dieselbe Bauart wie der Zeitraum-Umschalter (`ZeitraumKopf.tsx`):
  // `btn-primary` für die aktuelle Hälfte, sonst `btn-secondary`, dazu
  // `btn-toggle` (schlank) und `btn-umriss` (sichtbare Kante) - drei
  // Umschalter auf einer Seite dürfen nicht drei Formen haben.
  const schalter = (aktiv: boolean) =>
    (aktiv ? "btn-primary" : "btn-secondary") +
    " btn-toggle btn-umriss whitespace-nowrap text-sm";
  return (
    <nav data-rundgang="bereich" aria-label={t.bereich} className="flex flex-wrap gap-2">
      <Tipp text={t.lernstandTipp} ausrichtung="links">
        {(hinweisId) => (
          <Link
            ref={lernstandRef}
            to={lernstandHref}
            // ★ Dieselbe Technik wie `selbstUeben` (A6, 11.09.2026): die
            // Marke hängt am Verlaufseintrag, nicht an einem Zustand - sie
            // überlebt den Neuaufbau der Seite nach der Navigation.
            state={{ bereichFokus: true }}
            aria-current={zeigeVerwaltung ? undefined : "page"}
            aria-describedby={hinweisId}
            className={schalter(!zeigeVerwaltung)}
          >
            {t.lernstand}
          </Link>
        )}
      </Tipp>
      <Tipp text={t.verwaltenTipp} ausrichtung="rechts">
        {(hinweisId) => (
          <Link
            ref={verwaltenRef}
            to={verwaltenHref}
            state={{ bereichFokus: true }}
            aria-current={zeigeVerwaltung ? "page" : undefined}
            aria-describedby={hinweisId}
            className={schalter(zeigeVerwaltung)}
          >
            {t.kinderUndZugaenge}
          </Link>
        )}
      </Tipp>
    </nav>
  );
}

/**
 * Eine Programm-Karte in der Reiterreihe.
 *
 * ⚠️ Der Kurzsatz („10-Finger-Schreiben") ist BESCHREIBUNG, nicht Name.
 * Ohne `aria-label` rechnet der Browser den Namen aus dem Inhalt zusammen, und
 * der Reiter hiesse „im Griff Tastenkürzel & Computer-Wege" - wer sich durch
 * die Reihe hört, bekäme bei jedem Schritt einen Nebensatz, und die Hilfe
 * nennt einen anderen Namen als die Oberfläche. Mit `aria-label` heisst er
 * „im Griff"; der Satz kommt über `aria-describedby` hinterher, geht also
 * niemandem verloren ([[feedback_data_transparency]]).
 */
function ProgrammKarte({
  programm,
  aktiv,
  onClick,
  erste = false,
}: {
  programm: LwProgram;
  aktiv: boolean;
  onClick: () => void;
  /**
   * ★ Nur der ERSTE Reiter dockt seinen Hinweis links an (11.09.2026, im
   * Browser gemessen). Seit die Reiter in der ersten Zeile des Klassenkopfs
   * neben Kinderzahl und Klassencode stehen, sitzt „im Griff" bei 700 px am
   * rechten Rand - ein links andockender Hinweis lief bis 792 px und machte die
   * Seite 91 px breiter, auch unsichtbar. Rechts andockend läuft er nach innen.
   * Der erste Reiter kann beim Umbruch am linken Rand stehen, dort wäre ein
   * rechts andockender Hinweis abgeschnitten.
   */
  erste?: boolean;
}) {
  const { sprache } = useBedienSprache();
  return (
    <Tipp text={programmReiterHinweis(programm, sprache)} ausrichtung={erste ? "links" : "rechts"}>
      {(hinweisId) => (
        <button
          type="button"
          role="tab"
          id={`mk-tab-${programm.key}`}
          aria-selected={aktiv}
          aria-controls={`mk-panel-${programm.key}`}
          aria-label={programm.label}
          aria-describedby={hinweisId}
          // ★ EN6b: In der englischen Bedienung steht der Name eines
          // deutschsprachigen Programms in `lang="de"` (Glossar §2).
          lang={programmNameLang(programm.key, sprache)}
          onClick={onClick}
          className={
            /* ★ 11.09.2026 (`BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`,
               R1-R4): 36 px GESETZT (vorher 40 aus `py-1` und dem 28-px-Zeichen),
               1 px Kante wie jedes Bedienelement, 20-px-App-Zeichen, 14 px
               Schrift. Der offene Reiter trägt weiter Farbe UND einen zweiten
               Rahmen - als Ring nach innen (`ring-inset`), damit er nichts
               verschiebt. Im Kontrastmodus zeigt ihn die Regel für
               `[role="tab"][aria-selected="true"]` in `index.css`. */
            "inline-flex h-9 items-center gap-2 rounded-lg border pl-1.5 pr-3 transition " +
            (aktiv
              ? "border-accent bg-accent-soft ring-1 ring-inset ring-accent"
              : "border-hairline hover:border-ink-muted")
          }
        >
          <ProgrammZeichen programm={programm.key} className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium text-ink">{programm.label}</span>
        </button>
      )}
    </Tipp>
  );
}

/**
 * Der Reiter eines Programms.
 *
 * ★★★ SEIT DEM UMBAU VOM 11.09.2026 (D1) GIBT ES HIER NUR NOCH EINEN EINZIGEN
 * BEREICH - die Klassenstatistik. Der frühere Unterreiter „Tippchallenge"
 * fiel weg: Die Tippchallenge steht jetzt schlank ganz oben IN der
 * Klassenstatistik selbst (`TastenflowReiter`, direkt unter der Überschrift).
 * Mit nur einem Bereich braucht es keine Reiterzeile mehr - eine Auswahl mit
 * einem einzigen Eintrag ist ein Schalter ohne Wirkung.
 */
function ProgrammReiter({
  programm,
  cls,
  pupils,
  ladend,
  teacherId,
  onChanged,
}: {
  programm: LwProgramKey;
  cls: TypingClass | null;
  pupils: TypingAccount[];
  ladend: boolean;
  teacherId: string;
  onChanged: () => void;
}) {
  const p = LW_PROGRAMS.find((x) => x.key === programm) as LwProgram;
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  if (!cls) return <p className="text-ink-muted">{t.zuerstKlasse}</p>;
  /*
    ★ „Lädt …" und „noch keine Kinder" stehen IM Bereich statt der ganzen
    Reihe. Gerade eine leere Klasse braucht den Weg zum Verwalten - er steht
    seit 18.09.2026 (E2) im Umschalter neben dem Klassennamen, und der Satz
    nennt ihn.
  */
  const leer = ladend ? (
    <p role="status" aria-live="polite" className="text-ink-muted">
      {t.laedt}
    </p>
  ) : pupils.length === 0 ? (
    <p data-rundgang="keine-kinder" className="text-ink-muted">
      {t.leerVor}
      <ProgrammName programm={p} />
      {t.leerNach}
    </p>
  ) : null;

  // ★ Nachbesserung E5b (11.09.2026): Die Hülle `<div className="space-y-4">`
  // ist weg - sie hatte genau EIN Kind, `space-y-4` wirkt aber nur ZWISCHEN
  // Kindern. Eine Hülle ohne Aufgabe (Prüfbefund E5, §1).
  return (
    leer ?? (
      <ProgrammStand
        programm={programm}
        cls={cls}
        pupils={pupils}
        teacherId={teacherId}
        onChanged={onChanged}
      />
    )
  );
}

/** „Klassenstatistik" - die Tabelle genau dieses Programms. */
function ProgrammStand({
  programm,
  cls,
  pupils,
  teacherId,
  onChanged,
}: {
  programm: LwProgramKey;
  cls: TypingClass;
  pupils: TypingAccount[];
  teacherId: string;
  onChanged: () => void;
}) {
  const p = LW_PROGRAMS.find((x) => x.key === programm) as LwProgram;
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  switch (programm) {
    case "tippen":
      return (
        <TastenflowReiter
          pupils={pupils}
          onChanged={onChanged}
          // ★ N6: Der Wochenrhythmus hängt an der KLASSE (F29), nicht an der
          // Person - darum kommt er von hier und nicht aus dem Reiter.
          cls={cls}
          teacherId={teacherId}
        />
      );
    case "braille":
      return (
        <FremdeAnsicht>
        <PunktgenauReiter
          classCode={cls.code}
          // ★ 18.09.2026 (Bauplan E1): der Anzeigename für die Überschrift
          // über der Tabelle („Klasse 3b") - `cls.code` ist der Klassencode zum
          // Beitreten, nicht der Anzeigename.
          klassenname={cls.name}
          teacherId={teacherId}
          pupils={pupils}
        />
        </FremdeAnsicht>
      );
    case "klangpunkte":
      return (
        <FremdeAnsicht>
        <div className="space-y-3">
          <div>
            <h2 className="m-0 text-lg font-semibold text-ink">
              Stand in Klangpunkte
            </h2>
            <p className="m-0 text-sm text-ink-muted">
              Je Klangwelt die Zahl gemeisterter Kapitel.
            </p>
          </div>
          <KlangpunkteKlassenMatrix pupils={pupils} />
        </div>
        </FremdeAnsicht>
      );
    case "computer":
      return (
        <FremdeAnsicht>
          <ImGriffReiter pupils={pupils} onChanged={onChanged} teacherId={teacherId} cls={cls} />
        </FremdeAnsicht>
      );
    case "plus":
      return (
        <FremdeAnsicht>
          <PlusReiter pupils={pupils} cls={cls} onChanged={onChanged} />
        </FremdeAnsicht>
      );
    case "lexami":
      // Bauplan LERNEN §11 (13.11.2026 abends): Vokabelprobe, Lernaufgabe, Klassenlisten.
      return (
        <FremdeAnsicht>
          <LexamiReiter pupils={pupils} cls={cls} teacherId={teacherId} />
        </FremdeAnsicht>
      );
    default:
      return (
        <p className="text-ink-muted">
          <ProgrammName programm={p} />
          {t.keineAnsicht}
        </p>
      );
  }
}

/**
 * ★ EN6b (19.09.2026): Der NAME eines Programms - in der englischen Bedienung
 * bei den drei deutschsprachigen Programmen in `lang="de"`, damit eine
 * Sprachausgabe „im Griff" deutsch spricht. Auf Deutsch genau der Name als
 * Textknoten, wie vorher.
 */
function ProgrammName({ programm }: { programm: LwProgram }) {
  const { sprache } = useBedienSprache();
  const lang = programmNameLang(programm.key, sprache);
  return lang ? <span lang={lang}>{programm.label}</span> : <>{programm.label}</>;
}

/**
 * ★ EN6b (19.09.2026): Die Ansicht eines ANDEREN Programms (Punktgenau,
 * Klangpunkte, »im Griff«) hat noch kein Englisch - in der englischen
 * Bedienung steht sie darum als deutscher Block in `lang="de"` (richtig
 * ausgesprochen, ehrlich ausgezeichnet). Auf Deutsch kein zusätzliches
 * Element: der DOM bleibt, wie er war.
 */
function FremdeAnsicht({ children }: { children: React.ReactNode }) {
  const { sprache } = useBedienSprache();
  // ★ E11a-5 (26.09.2026): ebenso in der französischen Bedienung - bis dahin
  // prüfte die Zeile nur „en", und der deutsche Block stand unter `<html
  // lang="fr">` ohne eigenes `lang` (französische Aussprache).
  return sprache !== "de" ? <div lang="de">{children}</div> : <>{children}</>;
}
