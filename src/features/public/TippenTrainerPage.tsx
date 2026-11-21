/**
 * Standalone-Seite des 10-Finger-Trainers „Tastenflow".
 * Üben geht auch ohne Konto (Fortschritt lokal). Mit Konto wird der Spielstand
 * gespeichert; Lehrkräfte legen Klassen + Konten an, setzen Textstufen
 * und sehen die Statistik. Eigene Konten — getrennt von der LMS-Anmeldung.
 *
 * Kontrastmodus: plattformweit über den Schalter in der Kopfzeile (src/lib/contrast.ts).
 * Tippfeld-Vergrößerung: lokal über useTypingA11y (nur dieses Feld).
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSchriftartAnwenden } from "@/lib/typing/schriftart";
import { AppKopfzeile, StatistikSchliessen } from "@/components/AppKopfzeile";
import { TASTENFLOW_LOGO_BESCHREIBUNG, TastenflowLogo } from "@/components/TastenflowLogo";
import { RechtlichesFusszeile } from "@/components/RechtlichesFusszeile";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import { Merkfenster } from "@/components/typing/Merkfenster";
import { Tipp } from "@/components/Tipp";
import { hierIstTastenflow, meineKlasseHref } from "@/lib/adressen";
import { Modal } from "@/components/Modal";
import { SpendenBanner } from "@/components/SpendenBanner";
import { spendenBannerImHalbjahr } from "@/lib/spendenbanner";
import { NeuigkeitenFenster } from "@/components/typing/NeuigkeitenFenster";
// ★ Z4 (19.09.2026): der Rundgang beim allerersten Betreten.
import { RundgangUeben } from "@/components/typing/Rundgang";
import { useLesestelle } from "@/lib/arbeitsblatt/lesestelle";
import { fokuswacheStarten } from "@/lib/arbeitsblatt/fokuswache";
import { fokusMitteStarten } from "@/lib/arbeitsblatt/fokusMitte";
import { fokusVorlesenStarten } from "@/lib/typing/fokusVorlesen";
import {
  ansageMessungAngefordert,
  ansageMessungStarten,
} from "@/lib/typing/ansageMessung";
import { meldeVorfall } from "@/lib/arbeitsblatt/fokusmeldung";
import { ChangeOwnPasswordCard } from "@/components/typing/PasswordControls";
import {
  bedienCopy,
  Lang,
  hauptspracheDesWeges,
  uebungsSpracheImWeg,
  uebungsSprachenImWeg,
  Stufe,
  stufeFuer,
  gehoertEinerKlasse,
  availableVoices,
  ensureIntroduced,
  firstVoiceURIForLang,
  focusPracticeField,
  zeileNeuAnsteuern,
  focusFirstBadge,
  clearFirstBadgeFocusRequest,
  naechsteTrainerMode,
  TrainerMode,
  ansage,
  ansageAngemeldet,
  ansageGewaehlt,
  ansageSchalter,
  computePupilStats,
  setVorleseSprache,
  trainerModeAnsage,
  IDLE_CAP_MS,
  IDLE_CAP_SLOW_MS,
  setPracticeIdleCap,
  toleranzFuer,
  useDeviceNoTimePressure,
  useDeviceEinhand,
  useDeviceZeichenabstand,
  zeichenabstandFaktor,
  startpunktEinheiten,
  startpunktStand,
  loadProgress,
  matchHinweisSatz,
  primePracticeClock,
  saveProgress,
  speakUi,
  speakUiAlways,
  startpunktAnwenden,
  todayActiveMs,
  typingBackend,
  ueberschriftSpringen,
  useTypingA11y,
  useVoice,
  aktuelleWoche,
  aktuelleWocheKey,
  kindWochenzielAusFeldern,
  merkeWochenzielFenster,
  anredeFuer,
  skinForStufe,
  wochenzielFenster,
  wochenzielFensterGezeigt,
  // ★ Der Tastatur-Hinweis (20.09.2026, Auftrag Johannes) - siehe
  // `geraeteHinweis.ts` und `merkfensterTexte.ts`.
  moeglicherweiseOhneTastatur,
  istEchteTastatureingabe,
  tastaturHinweisFenster,
  tastaturHinweisGesehen,
  merkeTastaturHinweisGesehen,
} from "@/lib/typing";
import { klangName, klangWechseln, melodieUmschalten } from "@/lib/typing/melodie";
import { vorleseSprache } from "@/lib/typing/vorlesen";
import { TypingSettings } from "@/components/typing/TypingSettings";
import { AKUSTIK_TEXTE, AkustikMenue } from "@/components/typing/AkustikMenue";
import { useKeyboardLayout } from "@/components/typing/useKeyboardLayout";
import { AdaptiveTrainer } from "@/components/typing/AdaptiveTrainer";
import { useGezieltSteuerung } from "@/components/typing/useGezieltSteuerung";
import { Wortspiele } from "@/components/typing/Wortspiele";
import type { UebungsformId } from "@/lib/typing/uebungsformen";
import { Einrichtung } from "@/components/typing/Einrichtung";
import { SchreibprobeLauf } from "@/components/typing/SchreibprobeLauf";
import { useSchreibprobe } from "@/lib/typing/useSchreibprobe";
import {
  ereignisVormerken,
  useNachsenden,
  useVerbindungFehlt,
} from "@/lib/typing/useNachsenden";
import { meldeVerbindungGut } from "@/lib/typing/nachsenden";
import { wirklichOffline } from "@/lib/typing/pbBackend";
import { pruefungWort } from "@/lib/typing/schreibprobe";
// ★★★ Das Klassenmatch (11.09.2026, Etappe E6).
import { KlassenmatchEinladung } from "@/components/typing/KlassenmatchEinladung";
import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import { KlassenmatchLobby } from "@/components/typing/KlassenmatchLobby";
import { KlassenmatchWahl } from "@/components/typing/KlassenmatchWahl";
import { KLASSENMATCH_EREIGNIS, useKlassenmatchAngebot } from "@/lib/typing/klassenmatchAngebot";
import { useKlassenmatch } from "@/lib/typing/useKlassenmatch";
// ★★★ „Eigene Übung" (17.09.2026): ein hochgeladener Text als Pflichtinhalt.
import { EigeneUebungLauf, eigeneUebungName } from "@/components/typing/EigeneUebungLauf";
import { useEigeneUebung } from "@/lib/typing/useEigeneUebung";
// ★★★ E6 (19.09.2026): das Ankündigungsfenster, bevor die Übung beginnt.
import { EigeneUebungAnkuendigung } from "@/components/typing/EigeneUebungAnkuendigung";
import { useEigeneUebungAnkuendigung } from "@/lib/typing/useEigeneUebungAnkuendigung";
import {
  IntroPodcast,
  IntroPodcastKnopf,
  introGesehen,
} from "@/components/typing/IntroPodcast";
import { SerienTrainer } from "@/components/typing/SerienTrainer";
import { TastenErkunden, type ErkundenModus } from "@/components/typing/TastenErkunden";
import { useFocusTrap } from "@/components/typing/useFocusTrap";
import { LehrerHilfe } from "@/components/typing/LehrerHilfe";
import { PupilSelfStats } from "@/components/typing/PupilSelfStats";
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { TypingAuth } from "@/components/typing/TypingAuth";
import { useGesperrteZeitenStand } from "@/lib/typing/useGesperrteZeiten";
import { VoiceInstallHelp } from "@/components/typing/VoiceInstallHelp";
import { WeeklyGoalRings } from "@/components/typing/WeeklyGoalRings";
import {
  klasseFuer,
  mitKlassenVorrang,
  useTypingAuth,
} from "@/components/typing/useTypingAuth";
import { einrichtungFertig, hatSchonGeuebt } from "@/lib/typing/einrichtung";
import { topfSenden, topfVerbuchen } from "@/lib/typing/topf";
import { ohneZeilenMessung } from "@/lib/typing/zeilenMessung";

import { useReichweiteApp } from "@/lib/reichweiteApp";
import {
  browserSprachen,
  texte,
  useBedienSprache,
  useBeimSprachSchalter,
  type BedienSprache,
} from "@/lib/bedienSprache";
import { activeLayout, setLayout, vorschlagLayout, type LayoutId } from "@/lib/typing/layouts";
import { altAnzeige, istAltBuchstabe, istMacSystem } from "@/lib/altTaste";
import { istNormalgroesseTaste, zoomKeyDirection } from "@/lib/shortcuts";
import { tasteFuerCode } from "@/lib/typing/anschlagDeuten";
import { WAHLTASTE, WAHLTASTE_SATZ } from "@/lib/typing/wahltaste";
import { KUERZEL_LISTE, kuerzelZeilen } from "@/lib/typing/kuerzelListe";
import { tastaturBeimSprachwechsel, type RueckfrageWeg } from "@/lib/typing/sprachwahlTastatur";
import { useTastaturErkennung } from "@/components/typing/useTastaturErkennung";
import { SprachwahlRueckfrage } from "@/components/typing/SprachwahlRueckfrage";
// ★ E1 (24.09.2026): der Lernweg (Bauplan englischer Lehrgang §2.2).
import {
  bestimmeLernweg,
  englischLehrgangProbeAn,
  // ★ E11a-6 (26.09.2026): Falle 1 des Bauplans („die 201 stillen Weichen") -
  // `bestimmeLernweg` kennt den französischen Schalter zwar als eigenes Feld,
  // aber ALLE DREI Aufrufe hier unten übergaben ihn nie. Ergebnis: `bedienSprache
  // === "fr"` fiel in der Funktion selbst auf `franzoesischLehrgangProbeAn ?
  // "fr" : "de"` zurück - und ohne das Feld ist das IMMER "de". Jeder Gast und
  // jedes Konto mit französischer Bedienung bekam darum, egal ob der Schalter
  // `?franzoesisch-lehrgang=1` gesetzt war, ausschliesslich den deutschen Weg;
  // die Bücherei blieb leer, weil ihr Korpus französische Zeichen verlangt, die
  // im deutschen `introduced` nie vorkommen (gemessen: Bild der Oberfläche für
  // das Plakat blieb ohne Geschichte, `introduced` trug „ö ä ü ß" statt „é à ç").
  franzoesischLehrgangProbeAn,
  spanischLehrgangProbeAn,
  neueLehrgangProben,
  fortschrittsLernweg,
  gastLernwegLesen,
  gastLernwegMerken,
  istLernweg,
  lernwegVon,
  type Lernweg,
} from "@/lib/typing/lernweg";
// ★ W2b (28.09.2026): der Weg je Kind - Wechsel parkt, nie löschen.
import { fortschrittImWeg, startpunktImWeg, wegGewechselt } from "@/lib/typing/wegWechsel";
// ★ W2b Punkt 5 (S6): Stimmen-Hinweis auch beim späteren Einschalten.
import { stimmeBeimEinschalten } from "@/lib/typing/stimmHinweis";
// ★ W2b (28.09.2026): Tastatur-Erkennung (Windows-Befund §3.7) - nur Vorschlag.
import { TastaturVorschlag } from "@/components/typing/TastaturVorschlag";
import { SprachpaketTor } from "@/components/typing/SprachpaketTor";
import { sprachPaketeFuer } from "@/lib/typing/sprachpaketBedarf";
import { ladeSprachpakete } from "@/lib/typing/sprachpakete";
import { starteVersionsPruefung } from "@/lib/typing/versionsPruefung";
/**
 * ★★★★ 07.09.2026: DER GEMERKTE ZUSTAND FÄLLT MIT DEM FENSTER.
 *
 * Bis heute klappte der Einstellungs-Bereich als Streifen unter der Kopfzeile
 * auf, und dass er offen blieb, war eine Bequemlichkeit: Er stand einfach da.
 * Seit er ein FENSTER ist (Johannes' Auftrag von heute), wäre dasselbe Merken
 * schädlich - die App startete mit einem Dialog vor dem Übungsfeld, der Fokus
 * läge darin, und ein Kind mit Screenreader müsste sich bei JEDEM Start erst
 * daraus herausarbeiten, um zur ersten Zeile zu kommen.
 *
 * Ein Fenster wird geöffnet, wenn man es braucht, und ist danach zu. Der alte
 * Schlüssel wird beim ersten Öffnen aufgeräumt, damit niemand mit einem
 * gespeicherten „offen" aus der Zeit davor starten muss.
 */
const SETTINGS_OPEN_KEY = "tippen-settings-open";

function raeumeAltenSettingsSchluessel(): void {
  try {
    localStorage.removeItem(SETTINGS_OPEN_KEY);
  } catch {
    /* localStorage nicht verfügbar — dann gab es auch nichts zu räumen */
  }
}

/**
 * Was das Kind hört und liest, wenn der Server den Lernstand nicht annimmt.
 * Bewusst OHNE Schuldzuweisung und ohne Beruhigung, die keine ist: Es sagt,
 * was gerade gilt, und was zu tun ist ([[feedback_nie_gegen_das_kind]]).
 */
const NICHT_GESPEICHERT =
  "Achtung: Dein Lernstand kann gerade nicht gespeichert werden. " +
  "Üben geht weiter, aber sag es deiner Lehrkraft.";

/**
 * ★★★ DERSELBE BEFUND, DIE ANDERE LESERIN (03.09.2026).
 *
 * Der Satz oben ist für ein Kind geschrieben - und **gesehen hat ihn bisher
 * ausschliesslich eine Lehrkraft.** Gemessen an den Server-Protokollen: von
 * 39 + 15 abgewiesenen Schreibversuchen stammte KEIN EINZIGER von einem Kind,
 * alle von `tt_teachers` (die Regel auf `lw_progress` liess Lehrkräfte gar
 * nicht schreiben). „Sag es deiner Lehrkraft" ging damit an jemanden, der
 * selbst die Lehrkraft ist.
 *
 * Die Ursache ist seit heute behoben (eigene Zeile am Server, siehe
 * `pocketbase/setup.mjs`). Der Streifen bleibt trotzdem - für den Netzaussetzer,
 * den es weiterhin geben kann. Er sagt jetzt nur jeder Rolle das, was sie
 * wirklich tun kann.
 */
const NICHT_GESPEICHERT_LEHRKRAFT =
  "Achtung: Dein Übungsstand kann gerade nicht gespeichert werden. " +
  "Üben geht weiter - der Fortschritt dieser Runde geht aber verloren.";

/**
 * ★★ DIE TEXTE DER ÜBUNGSSEITE in beiden Bedienungssprachen (Probestück
 * „englische Bedienung", 12.09.2026, Bauplan §3.4).
 *
 * Die deutsche Spalte ist wortgleich mit dem, was vorher im JSX stand - in
 * deutscher Bedienung ändert sich also kein Zeichen. Englisch: britisch, Glossar im
 * Bauplan §4, Kinder mit „you", keine Maus-Wörter.
 */
export const SEITEN_TEXTE = texte({
  de: {
    nichtGespeichert: NICHT_GESPEICHERT,
    nichtGespeichertLehrkraft: NICHT_GESPEICHERT_LEHRKRAFT,
    // ★ 27.09.2026: nur ein Netzaussetzer. Wahr und kurz (vierte Prüfung S5):
    // die Zeilen kommen später nach, der Lernstand nur, solange das Fenster
    // offen bleibt - darum die Bitte, ohne Vorhalt.
    ohneVerbindung:
      "Gerade keine Verbindung. Die geübten Zeilen werden später gesendet - bitte das Fenster offen lassen.",
    // ★★★★★ 23.09.2026: die Anmeldung ist abgelaufen (`useTypingAuth`).
    abgelaufenKind:
      "Deine Anmeldung ist abgelaufen. Melde dich bitte neu an - dann wird wieder gespeichert.",
    abgelaufenLehrkraft: "Ihre Anmeldung ist abgelaufen. Bitte melden Sie sich neu an.",
    neuAnmelden: "Neu anmelden",
    bereichAdaptiv: "Mein Training",
    bereichBuecherei: "Geschichten",
    bereichWortspiele: "Wortspiele",
    zurueckZuMeinTraining: "Zurück zu Mein Training",
    logoTipp: "Das Tastenflow-Zeichen: Taste mit T und Welle",
    logoBeschreibung: TASTENFLOW_LOGO_BESCHREIBUNG,
    vorlesenAus: "Vorlesen aus.",
    kurztastenName: "Tastenkürzel in Tastenflow",
    kurztastenTitel: "Tastenkürzel",
    schliessen: "Schließen",
    spalteKuerzel: "Kürzel",
    spalteFunktion: "Funktion",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.de,
    // ★ EN1 (19.09.2026): der Rest der Übungsseite - Fenster, Knöpfe, Sätze
    // von Alt + B. Deutsch wortgleich wie vorher.
    einstellungen: "Einstellungen",
    zurueckZumUeben: "Zurück zum Üben",
    passwortAendern: "Passwort ändern",
    verstanden: "Verstanden",
    uebungsartBleibtProbe: (wort: string) => `Du schreibst gerade eine ${wort}. Die Übungsart bleibt.`,
    uebungsartBleibtEigene: (wort: string) => `Gerade läuft ${wort}. Die Übungsart bleibt.`,
  },
  en: {
    nichtGespeichert:
      "Careful: your progress can't be saved right now. " +
      "You can keep practising, but tell your teacher.",
    nichtGespeichertLehrkraft:
      "Careful: your practice progress can't be saved right now. " +
      "You can keep practising, but the progress from this round will be lost.",
    ohneVerbindung:
      "No connection right now. Your practice lines will be sent later - please keep this window open.",
    abgelaufenKind: "Your sign-in has expired. Please sign in again - then your progress is saved again.",
    abgelaufenLehrkraft: "Your sign-in has expired. Please sign in again.",
    neuAnmelden: "Sign in again",
    bereichAdaptiv: "My training",
    bereichBuecherei: "Stories",
    bereichWortspiele: "Word games",
    zurueckZuMeinTraining: "Back to My training",
    logoTipp: "The Tastenflow logo: a key with a T and a wave",
    logoBeschreibung:
      "The Tastenflow logo: a blue keyboard key with rounded corners. " +
      "At the top a large white T, below it a flat, uneven white wave.",
    vorlesenAus: "Reading aloud off.",
    kurztastenName: "Keyboard shortcuts in Tastenflow",
    kurztastenTitel: "Keyboard shortcuts",
    schliessen: "Close",
    spalteKuerzel: "Shortcut",
    spalteFunktion: "What it does",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.en,
    einstellungen: "Settings",
    // Glossar §3.6 (EN4): „Zurück zum Üben" ⇒ *Back to practice*.
    zurueckZumUeben: "Back to practice",
    passwortAendern: "Change password",
    verstanden: "Got it",
    uebungsartBleibtProbe: (wort: string) =>
      `You're doing a ${wort} right now. The practice type stays as it is.`,
    // Glossar §5 Nr 9: Das Kind liest „an exercise from your teacher".
    uebungsartBleibtEigene: (_wort: string) =>
      "An exercise from your teacher is running right now. The practice type stays as it is.",
  },
  // ★ E11a: „tu" - die Übungsseite spricht immer die lernende Person an (F9).
  fr: {
    nichtGespeichert:
      "Attention : tes progrès ne peuvent pas être enregistrés en ce moment. " +
      "Tu peux continuer à t'exercer, mais dis-le à ton enseignant ou ton enseignante.",
    nichtGespeichertLehrkraft:
      "Attention : les progrès d'exercice ne peuvent pas être enregistrés en ce moment. " +
      "Vous pouvez continuer, mais les progrès de cette série seront perdus.",
    ohneVerbindung:
      "Pas de connexion pour l'instant. Les lignes tapées seront envoyées plus tard - merci de laisser cette fenêtre ouverte.",
    abgelaufenKind: "Ta connexion a expiré. Merci de te reconnecter - tes progrès seront à nouveau enregistrés.",
    abgelaufenLehrkraft: "Votre connexion a expiré. Merci de vous reconnecter.",
    neuAnmelden: "Se reconnecter",
    bereichAdaptiv: "Mon entrainement",
    bereichBuecherei: "Histoires",
    bereichWortspiele: "Jeux de lettres",
    zurueckZuMeinTraining: "Retour à Mon entrainement",
    logoTipp: "Le symbole Tastenflow : une touche avec un T et une vague",
    logoBeschreibung:
      "Le symbole Tastenflow : une touche de clavier bleue aux coins arrondis. " +
      "En haut, un grand T blanc, en dessous, une vague blanche plate et irrégulière.",
    vorlesenAus: "Lecture à voix haute désactivée.",
    kurztastenName: "Raccourcis clavier dans Tastenflow",
    kurztastenTitel: "Raccourcis clavier",
    schliessen: "Fermer",
    spalteKuerzel: "Raccourci",
    spalteFunktion: "Ce qu'il fait",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.fr,
    einstellungen: "Réglages",
    zurueckZumUeben: "Retour à l'exercice",
    passwortAendern: "Changer le mot de passe",
    verstanden: "Compris",
    uebungsartBleibtProbe: (wort: string) => `Tu es en train de faire un ${wort}. Le type d'exercice ne change pas.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Un texte de la classe est en cours. Le type d'exercice ne change pas.",
  },
  // ★ ES-O (27.09.2026): Kind und Selbstlernende tú, Lehrkraft usted - wie „fr".
  es: {
    nichtGespeichert:
      "Atención: ahora mismo no se puede guardar tu progreso. " +
      "Puedes seguir practicando, pero díselo a tu docente.",
    nichtGespeichertLehrkraft:
      "Atención: ahora mismo no se puede guardar el progreso de práctica. " +
      "Puede seguir, pero el progreso de esta serie se perderá.",
    ohneVerbindung:
      "Ahora mismo no hay conexión. Las líneas practicadas se enviarán más tarde - deja esta ventana abierta, por favor.",
    abgelaufenKind: "Tu sesión ha caducado. Vuelve a iniciar sesión, por favor - así tu progreso se guarda otra vez.",
    abgelaufenLehrkraft: "Su sesión ha caducado. Vuelva a iniciar sesión, por favor.",
    neuAnmelden: "Volver a iniciar sesión",
    bereichAdaptiv: "Mi entrenamiento",
    bereichBuecherei: "Cuentos",
    bereichWortspiele: "Juegos de palabras",
    zurueckZuMeinTraining: "Volver a Mi entrenamiento",
    logoTipp: "El símbolo de Tastenflow: una tecla con una T y una ola",
    logoBeschreibung:
      "El símbolo de Tastenflow: una tecla azul de teclado con las esquinas redondeadas. " +
      "Arriba, una T grande y blanca; debajo, una ola blanca, plana e irregular.",
    vorlesenAus: "Lectura en voz alta desactivada.",
    kurztastenName: "Atajos de teclado en Tastenflow",
    kurztastenTitel: "Atajos de teclado",
    schliessen: "Cerrar",
    spalteKuerzel: "Atajo",
    spalteFunktion: "Qué hace",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.es,
    einstellungen: "Configuración",
    zurueckZumUeben: "Volver a practicar",
    passwortAendern: "Cambiar la contraseña",
    verstanden: "Entendido",
    uebungsartBleibtProbe: (wort: string) => `Ahora estás haciendo un ${wort}. El tipo de ejercicio no cambia.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Está en marcha un texto de la clase. El tipo de ejercicio no cambia.",
  },
  // ★ O-IT (02.10.2026): Kind „tu", Lehrkraft-Satz neutral; Namen nach dem
  // Glossar (Il mio allenamento, Storie, Giochi di parole, Gara di classe).
  it: {
    nichtGespeichert:
      "Attenzione: in questo momento i tuoi progressi non si possono salvare. " +
      "Puoi continuare a esercitarti, ma dillo all'insegnante.",
    nichtGespeichertLehrkraft:
      "Attenzione: in questo momento i progressi dell'esercizio non si possono salvare. " +
      "Si può continuare, ma i progressi di questa serie andranno persi.",
    ohneVerbindung:
      "In questo momento manca la connessione. Le righe scritte verranno inviate più tardi - lascia aperta questa finestra.",
    abgelaufenKind: "Il tuo accesso è scaduto. Accedi di nuovo - così i progressi vengono salvati di nuovo.",
    abgelaufenLehrkraft: "L'accesso è scaduto. Accedere di nuovo.",
    neuAnmelden: "Accedi di nuovo",
    bereichAdaptiv: "Il mio allenamento",
    bereichBuecherei: "Storie",
    bereichWortspiele: "Giochi di parole",
    zurueckZuMeinTraining: "Torna al mio allenamento",
    logoTipp: "Il simbolo di Tastenflow: un tasto con una T e un'onda",
    logoBeschreibung:
      "Il simbolo di Tastenflow: un tasto blu della tastiera con gli angoli arrotondati. " +
      "In alto una grande T bianca, sotto un'onda bianca, piatta e irregolare.",
    vorlesenAus: "Lettura ad alta voce disattivata.",
    kurztastenName: "Scorciatoie da tastiera in Tastenflow",
    kurztastenTitel: "Scorciatoie da tastiera",
    schliessen: "Chiudi",
    spalteKuerzel: "Scorciatoia",
    spalteFunktion: "Che cosa fa",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.it,
    einstellungen: "Impostazioni",
    zurueckZumUeben: "Torna all'esercizio",
    passwortAendern: "Cambia la password",
    verstanden: "Ho capito",
    uebungsartBleibtProbe: (wort: string) => `Ora stai facendo una ${wort}. Il tipo di esercizio non cambia.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "È in corso un esercizio dell'insegnante. Il tipo di esercizio non cambia.",
  },
  // ★ O-PL (02.10.2026): Kind „ty", Lehrkraft unpersönlich (Glossar Regel 1);
  // Bereiche nach §2.2 (Mój trening, Opowiadania, Gry słowne), Tasten nach §2.9
  // (Ctrl statt Strg, Option auf dem Mac), Zeile = „wiersz".
  pl: {
    nichtGespeichert:
      "Uwaga: twoich postępów nie da się teraz zapisać. " +
      "Możesz dalej ćwiczyć, ale powiedz o tym nauczycielowi lub nauczycielce.",
    nichtGespeichertLehrkraft:
      "Uwaga: postępów z tego ćwiczenia nie da się teraz zapisać. " +
      "Można ćwiczyć dalej, ale postępy z tej serii przepadną.",
    ohneVerbindung:
      "Nie ma teraz połączenia. Napisane wiersze zostaną wysłane później - nie zamykaj tego okna.",
    abgelaufenKind: "Twoje logowanie wygasło. Zaloguj się ponownie - wtedy postępy znowu będą zapisywane.",
    abgelaufenLehrkraft: "Logowanie wygasło. Zaloguj się ponownie.",
    neuAnmelden: "Zaloguj się ponownie",
    bereichAdaptiv: "Mój trening",
    bereichBuecherei: "Opowiadania",
    bereichWortspiele: "Gry słowne",
    zurueckZuMeinTraining: "Wróć do treningu",
    logoTipp: "Znak programu Tastenflow: klawisz z literą T i falą",
    logoBeschreibung:
      "Znak programu Tastenflow: niebieski klawisz klawiatury o zaokrąglonych rogach. " +
      "U góry duża biała litera T, pod nią biała, płaska, nieregularna fala.",
    vorlesenAus: "Czytanie na głos wyłączone.",
    kurztastenName: "Skróty klawiaturowe w programie Tastenflow",
    kurztastenTitel: "Skróty klawiaturowe",
    schliessen: "Zamknij",
    spalteKuerzel: "Skrót",
    spalteFunktion: "Co robi",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.pl,
    einstellungen: "Ustawienia",
    zurueckZumUeben: "Wróć do ćwiczeń",
    passwortAendern: "Zmień hasło",
    verstanden: "Rozumiem",
    uebungsartBleibtProbe: (wort: string) => `Trwa: ${wort}. Rodzaj ćwiczenia się nie zmienia.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Trwa ćwiczenie dla klasy. Rodzaj ćwiczenia się nie zmienia.",
  },
  // ★ O-TR (02.10.2026): Kind "sen", Lehrkraft "siz" mit -(y)In, was beide sehen
  // ohne Anrede (Glossar Regel 1); Bereiche nach §2.2 (Antrenmanım, Öyküler,
  // Kelime oyunları), Tasten nach §2.9 (Ctrl, Option auf dem Mac, "... tuşu"),
  // Zeile = "satır", "Satır X, toplam Y" (Regel 6), Ton = "ses efektleri" (§4 Nr. 8).
  tr: {
    nichtGespeichert:
      "Dikkat: İlerlemen şu anda kaydedilemiyor. " +
      "Çalışmaya devam edebilirsin, ama öğretmenine söyle.",
    nichtGespeichertLehrkraft:
      "Dikkat: Alıştırma durumunuz şu anda kaydedilemiyor. " +
      "Çalışmaya devam edebilirsiniz - ama bu turun ilerlemesi kaybolur.",
    ohneVerbindung:
      "Şu anda bağlantı yok. Yazılan satırlar daha sonra gönderilir - bunun için pencere açık kalmalı.",
    abgelaufenKind: "Girişinin süresi doldu. Yeniden giriş yap - sonra ilerlemen yine kaydedilir.",
    abgelaufenLehrkraft: "Girişinizin süresi doldu. Lütfen yeniden giriş yapın.",
    neuAnmelden: "Yeniden giriş yap",
    bereichAdaptiv: "Antrenmanım",
    bereichBuecherei: "Öyküler",
    bereichWortspiele: "Kelime oyunları",
    zurueckZuMeinTraining: "Antrenmanıma dön",
    logoTipp: "Tastenflow simgesi: T harfli ve dalgalı bir tuş",
    logoBeschreibung:
      "Tastenflow simgesi: köşeleri yuvarlatılmış mavi bir klavye tuşu. " +
      "Üstte büyük beyaz bir T, altında beyaz, yassı, düzensiz bir dalga.",
    vorlesenAus: "Sesli okuma kapalı.",
    kurztastenName: "Tastenflow klavye kısayolları",
    kurztastenTitel: "Klavye kısayolları",
    schliessen: "Kapat",
    spalteKuerzel: "Kısayol",
    spalteFunktion: "Ne yapar",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.tr,
    einstellungen: "Ayarlar",
    zurueckZumUeben: "Alıştırmaya dön",
    passwortAendern: "Şifreyi değiştir",
    verstanden: "Anladım",
    uebungsartBleibtProbe: (wort: string) => `Şu anda süren: ${wort}. Alıştırma türü değişmez.`,
    uebungsartBleibtEigene: (_wort: string) =>
      'Şu anda "Öğretmenden alıştırma" sürüyor. Alıştırma türü değişmez.',
  },
  // ★ O-CS (03.10.2026): Kind "ty", Lehrkraft "vy", was beide sehen ohne Anrede
  // (Glossar Regel 1), Kürzel-Liste im Infinitiv; Bereiche nach §2.2 (Můj trénink,
  // Příběhy, Slovní hry), Tasten nach §2.9 (Ctrl, Option auf dem Mac), Zeile =
  // "řádek", "Řádek X/Y" (Regel 13), Průzkum kláves / Hledání kláves wie die Hilfe.
  cs: {
    nichtGespeichert:
      "Pozor: tvůj pokrok se teď nedá uložit. " +
      "Můžeš cvičit dál, ale řekni o tom ve třídě.",
    nichtGespeichertLehrkraft:
      "Pozor: stav cvičení se teď nedá uložit. " +
      "Cvičit můžete dál - pokrok z tohoto kola se ale ztratí.",
    ohneVerbindung:
      "Teď není připojení. Napsané řádky se odešlou později - okno proto musí zůstat otevřené.",
    abgelaufenKind: "Tvoje přihlášení vypršelo. Přihlas se prosím znovu - pak se bude zase ukládat.",
    abgelaufenLehrkraft: "Přihlášení vypršelo. Přihlaste se prosím znovu.",
    neuAnmelden: "Přihlásit se znovu",
    bereichAdaptiv: "Můj trénink",
    bereichBuecherei: "Příběhy",
    bereichWortspiele: "Slovní hry",
    zurueckZuMeinTraining: "Zpět na Můj trénink",
    logoTipp: "Značka Tastenflow: klávesa s písmenem T a vlnou",
    logoBeschreibung:
      "Značka Tastenflow: modrá klávesa se zaoblenými rohy. " +
      "Nahoře velké bílé písmeno T, pod ním bílá, plochá, nepravidelná vlna.",
    vorlesenAus: "Předčítání vypnuto.",
    kurztastenName: "Klávesové zkratky v aplikaci Tastenflow",
    kurztastenTitel: "Klávesové zkratky",
    schliessen: "Zavřít",
    spalteKuerzel: "Zkratka",
    spalteFunktion: "Co dělá",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.cs,
    einstellungen: "Nastavení",
    zurueckZumUeben: "Zpět ke cvičení",
    passwortAendern: "Změnit heslo",
    verstanden: "Rozumím",
    uebungsartBleibtProbe: (wort: string) => `Právě probíhá: ${wort}. Druh cvičení se nemění.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Právě probíhá Cvičení ze školy. Druh cvičení se nemění.",
  },
  bg: {
    nichtGespeichert:
      "Внимание: напредъкът ти в момента не може да се запише. " +
      "Можеш да продължиш да се упражняваш, но кажи в клас.",
    nichtGespeichertLehrkraft:
      "Внимание: напредъкът в упражненията в момента не може да се запише. " +
      "Можете да продължите - но напредъкът от този кръг ще се загуби.",
    ohneVerbindung:
      "В момента няма интернет връзка. Написаните редове ще се изпратят по-късно - затова прозорецът трябва да остане отворен.",
    abgelaufenKind: "Входът ти изтече. Влез отново - тогава пак ще се записва.",
    abgelaufenLehrkraft: "Входът изтече. Влезте отново.",
    neuAnmelden: "Влез отново",
    bereichAdaptiv: "Моята тренировка",
    bereichBuecherei: "Истории",
    bereichWortspiele: "Игри с думи",
    zurueckZuMeinTraining: "Обратно към Моята тренировка",
    logoTipp: "Знакът на Tastenflow: клавиш с буква T и вълна",
    logoBeschreibung:
      "Знакът на Tastenflow: син клавиш със заоблени ъгли. " +
      "Горе голяма бяла буква T, под нея бяла, плоска, неравна вълна.",
    vorlesenAus: "Четенето на глас е изключено.",
    kurztastenName: "Клавишни комбинации в Tastenflow",
    kurztastenTitel: "Клавишни комбинации",
    schliessen: "Затвори",
    spalteKuerzel: "Комбинация",
    spalteFunktion: "Какво прави",
    ...KUERZEL_LISTE.bg,
    einstellungen: "Настройки",
    zurueckZumUeben: "Обратно към упражненията",
    passwortAendern: "Смени паролата",
    verstanden: "Разбрах",
    uebungsartBleibtProbe: (wort: string) => `В момента тече: ${wort}. Видът упражнение не се променя.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "В момента тече Упражнение от училище. Видът упражнение не се променя.",
  },
  el: {
    nichtGespeichert:
      "Προσοχή: η πρόοδός σου δεν μπορεί να αποθηκευτεί αυτή τη στιγμή. " +
      "Μπορείς να συνεχίσεις την εξάσκηση, αλλά πες το στην τάξη.",
    nichtGespeichertLehrkraft:
      "Προσοχή: η πρόοδος της εξάσκησης δεν μπορεί να αποθηκευτεί αυτή τη στιγμή. " +
      "Μπορείτε να συνεχίσετε - η πρόοδος αυτού του γύρου όμως θα χαθεί.",
    ohneVerbindung:
      "Δεν υπάρχει σύνδεση αυτή τη στιγμή. Οι γραμμές που γράφτηκαν θα σταλούν αργότερα - το παράθυρο πρέπει να μείνει ανοιχτό.",
    abgelaufenKind: "Η σύνδεσή σου έληξε. Συνδέσου ξανά - μετά η πρόοδος αποθηκεύεται πάλι.",
    abgelaufenLehrkraft: "Η σύνδεση έληξε. Συνδεθείτε ξανά.",
    neuAnmelden: "Νέα σύνδεση",
    bereichAdaptiv: "Η εξάσκησή μου",
    bereichBuecherei: "Ιστορίες",
    bereichWortspiele: "Παιχνίδια λέξεων",
    zurueckZuMeinTraining: "Επιστροφή: Η εξάσκησή μου",
    logoTipp: "Το λογότυπο του Tastenflow: πλήκτρο με T και κύμα",
    logoBeschreibung:
      "Το λογότυπο του Tastenflow: ένα μπλε πλήκτρο με στρογγυλεμένες γωνίες. " +
      "Επάνω ένα μεγάλο λευκό T, από κάτω ένα λευκό, επίπεδο, ακανόνιστο κύμα.",
    vorlesenAus: "Εκφώνηση ανενεργή.",
    kurztastenName: "Συντομεύσεις πληκτρολογίου στο Tastenflow",
    kurztastenTitel: "Συντομεύσεις πληκτρολογίου",
    schliessen: "Κλείσιμο",
    spalteKuerzel: "Συντόμευση",
    spalteFunktion: "Τι κάνει",
    ...KUERZEL_LISTE.el,
    einstellungen: "Ρυθμίσεις",
    zurueckZumUeben: "Επιστροφή στην εξάσκηση",
    passwortAendern: "Αλλαγή κωδικού πρόσβασης",
    verstanden: "Κατάλαβα",
    uebungsartBleibtProbe: (wort: string) => `Τώρα γίνεται: ${wort}. Το είδος άσκησης δεν αλλάζει.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Τώρα γίνεται: Άσκηση από το σχολείο. Το είδος άσκησης δεν αλλάζει.",
  },
  hu: {
    nichtGespeichert:
      "Figyelem: a haladásod most nem menthető. " +
      "Gyakorolhatsz tovább, de szólj róla a tanárodnak.",
    nichtGespeichertLehrkraft:
      "Figyelem: a gyakorlás állása most nem menthető. " +
      "A gyakorlás folytatható - ennek a körnek az eredménye azonban elvész.",
    ohneVerbindung:
      "Most nincs kapcsolat. A begépelt sorokat később küldjük el - ezért az ablaknak nyitva kell maradnia.",
    abgelaufenKind: "Lejárt a bejelentkezésed. Jelentkezz be újra - utána a mentés ismét működik.",
    abgelaufenLehrkraft: "A bejelentkezés lejárt. Jelentkezzen be újra.",
    neuAnmelden: "Bejelentkezés újra",
    bereichAdaptiv: "Saját gyakorlás",
    bereichBuecherei: "Történetek",
    bereichWortspiele: "Szójátékok",
    zurueckZuMeinTraining: "Vissza a Saját gyakorlás részhez",
    logoTipp: "A Tastenflow jele: billentyű T betűvel és hullámmal",
    logoBeschreibung:
      "A Tastenflow jele: kék billentyű lekerekített sarkokkal. " +
      "Fent egy nagy fehér T betű, alatta egy lapos, egyenetlen fehér hullám.",
    vorlesenAus: "Felolvasás kikapcsolva.",
    kurztastenName: "Billentyűparancsok a Tastenflow programban",
    kurztastenTitel: "Billentyűparancsok",
    schliessen: "Bezárás",
    spalteKuerzel: "Billentyűparancs",
    spalteFunktion: "Mit csinál",
    ...KUERZEL_LISTE.hu,
    einstellungen: "Beállítások",
    zurueckZumUeben: "Vissza a gyakorláshoz",
    passwortAendern: "Jelszó módosítása",
    verstanden: "Értem",
    uebungsartBleibtProbe: (wort: string) => `Most ez zajlik: ${wort}. A gyakorlattípus nem változik.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Most ez zajlik: Iskolai gyakorlat. A gyakorlattípus nem változik.",
  },
  nl: {
    nichtGespeichert:
      "Let op: je voortgang kan nu niet worden opgeslagen. " +
      "Je kunt verder oefenen, maar zeg het tegen je leerkracht.",
    nichtGespeichertLehrkraft:
      "Let op: de voortgang van het oefenen kan nu niet worden opgeslagen. " +
      "Je kunt verder oefenen, maar de voortgang van deze ronde gaat verloren.",
    ohneVerbindung:
      "Er is nu geen verbinding. De geoefende regels worden later verzonden - laat dit venster daarom open.",
    abgelaufenKind: "Je bent automatisch uitgelogd. Log opnieuw in - dan wordt er weer opgeslagen.",
    abgelaufenLehrkraft: "Je bent automatisch uitgelogd. Log opnieuw in.",
    neuAnmelden: "Opnieuw inloggen",
    bereichAdaptiv: "Mijn training",
    bereichBuecherei: "Verhalen",
    bereichWortspiele: "Woordspelletjes",
    zurueckZuMeinTraining: "Terug naar Mijn training",
    logoTipp: "Het logo van Tastenflow: een toets met een T en een golf",
    logoBeschreibung:
      "Het logo van Tastenflow: een blauwe toets met afgeronde hoeken. " +
      "Bovenaan een grote witte T, daaronder een witte, vlakke, onregelmatige golf.",
    vorlesenAus: "Voorlezen uit.",
    kurztastenName: "Sneltoetsen in Tastenflow",
    kurztastenTitel: "Sneltoetsen",
    schliessen: "Sluiten",
    spalteKuerzel: "Sneltoets",
    spalteFunktion: "Wat het doet",
    ...KUERZEL_LISTE.nl,
    einstellungen: "Instellingen",
    zurueckZumUeben: "Terug naar het oefenen",
    passwortAendern: "Wachtwoord wijzigen",
    verstanden: "Begrepen",
    uebungsartBleibtProbe: (wort: string) => `Nu bezig: ${wort}. De soort oefening blijft hetzelfde.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Nu bezig: Oefening van de leerkracht. De soort oefening blijft hetzelfde.",
  },
  pt: {
    nichtGespeichert:
      "Atenção: neste momento, não é possível guardar os teus progressos. " +
      "Podes continuar a praticar, mas avisa na turma.",
    nichtGespeichertLehrkraft:
      "Atenção: neste momento, não é possível guardar o estado da prática. " +
      "Pode continuar a praticar, mas os progressos desta ronda perdem-se.",
    ohneVerbindung:
      "Sem ligação de momento. As linhas escritas serão enviadas mais tarde - a janela tem de ficar aberta.",
    abgelaufenKind: "A tua sessão expirou. Inicia sessão outra vez - depois, os teus progressos voltam a ser guardados.",
    abgelaufenLehrkraft: "A sessão expirou. Inicie sessão outra vez.",
    neuAnmelden: "Iniciar sessão outra vez",
    bereichAdaptiv: "O meu treino",
    bereichBuecherei: "Histórias",
    bereichWortspiele: "Jogos de palavras",
    zurueckZuMeinTraining: "Voltar ao meu treino",
    logoTipp: "O símbolo do Tastenflow: tecla com um T e uma onda",
    logoBeschreibung:
      "O símbolo do Tastenflow: uma tecla azul com cantos arredondados. " +
      "Em cima, um T branco grande; por baixo, uma onda branca, plana e irregular.",
    vorlesenAus: "Leitura em voz alta desligada.",
    kurztastenName: "Atalhos de teclado no Tastenflow",
    kurztastenTitel: "Atalhos de teclado",
    schliessen: "Fechar",
    spalteKuerzel: "Atalho",
    spalteFunktion: "O que faz",
    ...KUERZEL_LISTE.pt,
    einstellungen: "Definições",
    zurueckZumUeben: "Voltar a praticar",
    passwortAendern: "Alterar palavra-passe",
    verstanden: "Entendido",
    uebungsartBleibtProbe: (wort: string) => `Neste momento está a decorrer: ${wort}. O tipo de exercício não muda.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Neste momento está a decorrer um Exercício da escola. O tipo de exercício não muda.",
  },
  br: {
    nichtGespeichert:
      "Atenção: seu progresso não pode ser salvo agora. " +
      "Você pode continuar praticando, mas avise quem dá aula.",
    nichtGespeichertLehrkraft:
      "Atenção: o estado da prática não pode ser salvo agora. " +
      "Você pode continuar praticando, mas o progresso desta rodada vai se perder.",
    ohneVerbindung:
      "Sem conexão no momento. As linhas digitadas serão enviadas depois - deixe a janela aberta.",
    abgelaufenKind: "Sua sessão expirou. Entre de novo - aí tudo volta a ser salvo.",
    abgelaufenLehrkraft: "Sua sessão expirou. Entre de novo.",
    neuAnmelden: "Entrar de novo",
    bereichAdaptiv: "Meu treino",
    bereichBuecherei: "Histórias",
    bereichWortspiele: "Jogos de palavras",
    zurueckZuMeinTraining: "Voltar para Meu treino",
    logoTipp: "O símbolo do Tastenflow: tecla com T e onda",
    logoBeschreibung:
      "O símbolo do Tastenflow: uma tecla azul com cantos arredondados. " +
      "Em cima, um T grande e branco; embaixo dele, uma onda branca, plana e irregular.",
    vorlesenAus: "Leitura em voz alta desligada.",
    kurztastenName: "Atalhos de teclado no Tastenflow",
    kurztastenTitel: "Atalhos de teclado",
    schliessen: "Fechar",
    spalteKuerzel: "Atalho",
    spalteFunktion: "Função",
    ...KUERZEL_LISTE.br,
    einstellungen: "Configurações",
    zurueckZumUeben: "Voltar a praticar",
    passwortAendern: "Alterar senha",
    verstanden: "Entendi",
    uebungsartBleibtProbe: (wort: string) => `Em andamento: ${wort}. O tipo de prática continua o mesmo.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Em andamento: Exercício da escola. O tipo de prática continua o mesmo.",
  },
  ro: {
    nichtGespeichert:
      "Atenție: progresul tău nu se poate salva acum. " +
      "Poți exersa în continuare, dar spune asta la clasă.",
    nichtGespeichertLehrkraft:
      "Atenție: progresul exersării nu se poate salva acum. " +
      "Puteți exersa în continuare, dar progresul din această rundă se va pierde.",
    ohneVerbindung:
      "Momentan nu există conexiune. Rândurile scrise se trimit mai târziu - de aceea fereastra trebuie să rămână deschisă.",
    abgelaufenKind: "Conectarea ta a expirat. Conectează-te din nou - apoi se salvează iar.",
    abgelaufenLehrkraft: "Conectarea a expirat. Conectați-vă din nou.",
    neuAnmelden: "Conectați-vă din nou",
    bereichAdaptiv: "Antrenamentul meu",
    bereichBuecherei: "Povești",
    bereichWortspiele: "Jocuri cu cuvinte",
    zurueckZuMeinTraining: "Înapoi la Antrenamentul meu",
    logoTipp: "Semnul Tastenflow: o tastă cu litera T și un val",
    logoBeschreibung:
      "Semnul Tastenflow: o tastă albastră cu colțuri rotunjite. " +
      "Sus, un T mare alb, dedesubt un val alb, plat și neregulat.",
    vorlesenAus: "Citire cu voce tare: oprită.",
    kurztastenName: "Comenzi rapide de la tastatură în Tastenflow",
    kurztastenTitel: "Comenzi rapide",
    schliessen: "Închideți",
    spalteKuerzel: "Comandă rapidă",
    spalteFunktion: "Ce face",
    ...KUERZEL_LISTE.ro,
    einstellungen: "Setări",
    zurueckZumUeben: "Înapoi la exersare",
    passwortAendern: "Modificați parola",
    verstanden: "Am înțeles",
    uebungsartBleibtProbe: (wort: string) => `Acum se desfășoară: ${wort}. Tipul de exercițiu rămâne același.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Acum se desfășoară: Exercițiu de la școală.Tipul de exercițiu rămâne același.",
  },
  sv: {
    nichtGespeichert:
      "Obs: dina framsteg går inte att spara just nu. " +
      "Du kan öva vidare, men säg till din lärare.",
    nichtGespeichertLehrkraft:
      "Obs: övningsframstegen går inte att spara just nu. " +
      "Du kan öva vidare, men framstegen från den här omgången försvinner.",
    ohneVerbindung:
      "Ingen anslutning just nu. Raderna du har skrivit skickas senare - låt fönstret vara öppet.",
    abgelaufenKind: "Din inloggning har gått ut. Logga in igen - då sparas dina framsteg igen.",
    abgelaufenLehrkraft: "Din inloggning har gått ut. Logga in igen.",
    neuAnmelden: "Logga in igen",
    bereichAdaptiv: "Min träning",
    bereichBuecherei: "Berättelser",
    bereichWortspiele: "Ordlekar",
    zurueckZuMeinTraining: "Tillbaka till Min träning",
    logoTipp: "Tastenflow-logotypen: en tangent med ett T och en våg",
    logoBeschreibung:
      "Tastenflow-logotypen: en blå tangent med rundade hörn. " +
      "Högst upp ett stort vitt T, under det en platt, ojämn vit våg.",
    vorlesenAus: "Uppläsning av.",
    kurztastenName: "Kortkommandon i Tastenflow",
    kurztastenTitel: "Kortkommandon",
    schliessen: "Stäng",
    spalteKuerzel: "Kortkommando",
    spalteFunktion: "Vad det gör",
    ...KUERZEL_LISTE.sv,
    einstellungen: "Inställningar",
    zurueckZumUeben: "Tillbaka till övningen",
    passwortAendern: "Ändra lösenord",
    verstanden: "Jag förstår",
    uebungsartBleibtProbe: (wort: string) => `Just nu pågår: ${wort}. Övningsformen ändras inte.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Just nu pågår: Från läraren. Övningsformen ändras inte.",
  },
  uk: {
    nichtGespeichert:
      "Увага: зараз не вдається зберегти твій поступ. " +
      "Можеш тренуватися далі, але скажи про це педагогові.",
    nichtGespeichertLehrkraft:
      "Увага: зараз не вдається зберегти стан тренування. " +
      "Можна тренуватися далі, але поступ цього раунду буде втрачено.",
    ohneVerbindung:
      "Зараз немає з'єднання. Надруковані рядки буде надіслано пізніше - тому вікно має залишатися відкритим.",
    abgelaufenKind: "Термін дії входу минув. Увійди ще раз - тоді все знову зберігатиметься.",
    abgelaufenLehrkraft: "Термін дії входу минув. Увійдіть ще раз.",
    neuAnmelden: "Увійти ще раз",
    bereichAdaptiv: "Моє тренування",
    bereichBuecherei: "Історії",
    bereichWortspiele: "Ігри зі словами",
    zurueckZuMeinTraining: "Назад до розділу Моє тренування",
    logoTipp: "Знак Tastenflow: клавіша з літерою T і хвилею",
    logoBeschreibung:
      "Знак Tastenflow: синя клавіша із заокругленими кутами. " +
      "Угорі велика біла літера T, під нею біла плоска нерівна хвиля.",
    vorlesenAus: "Читання вголос вимкнено.",
    kurztastenName: "Сполучення клавіш у Tastenflow",
    kurztastenTitel: "Сполучення клавіш",
    schliessen: "Закрити",
    spalteKuerzel: "Сполучення",
    spalteFunktion: "Що робить",
    // ★ 18.10.2026: die Kürzel-Liste (Alt + T) steht in `lib/typing/kuerzelListe.ts` - das Handbuch liest dieselben Zeilen.
    ...KUERZEL_LISTE.uk,
    einstellungen: "Налаштування",
    zurueckZumUeben: "Назад до тренування",
    passwortAendern: "Змінити пароль",
    verstanden: "Зрозуміло",
    uebungsartBleibtProbe: (wort: string) => `Зараз триває: ${wort}. Вид вправи не змінюється.`,
    uebungsartBleibtEigene: (_wort: string) =>
      "Зараз триває Шкільна вправа. Вид вправи не змінюється.",
  },
});

/**
 * ★★★ DIE ÜBUNGSSEITE. Ihre Bedienungssprache (Probestück „englische
 * Bedienung", 12.09.2026, `BAUPLAN-2026-09-12-ENGLISCHE-BEDIENUNG-PROBESTUECK.md`)
 * kommt seit EN0 (18.09.2026) NICHT mehr aus einem eigenen Provider hier,
 * sondern aus dem EINEN in `Root` (`TastenflowSprachBereich.tsx`) - er überlebt
 * die Navigation und gilt auch in „Meine Klassen". ⚠️ Wer die Seite ohne ihn
 * zeigt (Tests), bekommt Deutsch - wie jede fremde App.
 */
export function TippenTrainerPage() {
  // ★ 09.10.2026: die gewählte Schrift der Übungszeile (lib/typing/schriftart.ts).
  useSchriftartAnwenden();
  /*
    Reichweite (08.09.2026): meldet Besuch und Verweildauer von Tastenflow.
    Der Hook holt sich selbst, ob gerade ein Kind angemeldet ist - daraus
    entsteht die Antwort auf „wie viele üben OHNE Anmeldung". Er muss ganz
    oben stehen: Ein Hook hinter einem frühen `return` liefe nicht bei jedem
    Rendern, und React bricht dann ab.
  */
  useReichweiteApp("tippen");

  /*
    ★★ DIE BEDIENUNGSSPRACHE (Probestück 12.09.2026, für jeden seit
    19.09.2026). Ohne Provider (Tests, die die Seite allein zeigen) liefert der
    Haken „de" und `bereichAktiv = false` - dann läuft jede Zeile unten genau
    wie vor der zweiten Sprache.

    ★ ZWEI SORTEN ANSAGEN: Was die BEDIENUNG sagt (Farbwahl, Abmelden, Vorlesen
    an), steht in der Bedienungssprache und kommt mit deren Stimme
    (`sprichBedienung`). Was zur ÜBUNG gehört, folgt weiter der Übungssprache
    (Bauplan §3.5). Den Sprachschalter selbst sagt seit EN0 der Provider an
    (`wechsle`, `lib/bedienSprache`) - für jede Seite gleich.
  */
  const {
    sprache,
    bereichAktiv,
    // ★ W2b (Punkt 2): für die Tastatur-Rückfrage vor einem Sprachwechsel.
    spracheGewaehlt,
    wechsle: wechsleBedienung,
    spracheOptionen,
  } = useBedienSprache();
  const T = SEITEN_TEXTE[sprache];
  // ★ 18.10.2026: Mac oder nicht - nur für die Anzeige der Kürzel-Liste (`altAnzeige`).
  const mac = istMacSystem();
  /*
    ★ EN1 (19.09.2026): über einen Ref. Der Kürzel-Horcher unten wird nur
    EINMAL angemeldet und hielte sonst die Sprache des ersten Bildes fest - nach
    einem Sprachwechsel spräche Alt + O weiter die alte Sprache. So liest jede
    Ansage die Sprache im Augenblick, in dem sie gesprochen wird.
  */
  const bedienRef = useRef({ sprache, bereichAktiv });
  bedienRef.current = { sprache, bereichAktiv };
  /** Die Sprache für `ansage(…)` der Bedienung - ohne Provider `undefined` (= Vorlese-Sprache, wie bisher). */
  const bedienLang = (): Lang | undefined =>
    bedienRef.current.bereichAktiv ? bedienRef.current.sprache : undefined;
  const sprichBedienung = (text: string) => {
    const b = bedienRef.current;
    if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
    else speakUi(text);
  };
  const navigate = useNavigate();
  /**
   * ★ A6 (Umbau 11.09.2026): Die Marke „übt selbst" hängt seither am
   * Verlaufseintrag dieser Navigation, nicht mehr am Tab - siehe
   * `umgeleitetFuer` unten.
   */
  const location = useLocation();
  const account = useTypingAuth((s) => s.account);
  const abgelaufen = useTypingAuth((s) => s.abgelaufen);
  const update = useTypingAuth((s) => s.update);
  const logout = useTypingAuth((s) => s.logout);

  /*
    ★★★ E1 (24.09.2026): DER LERNWEG - in welcher Reihenfolge die Tasten
    kommen (`lib/typing/lernweg.ts`, Bauplan englischer Lehrgang §2.2).

    Gespeichert steht er am Konto (Wahrheit, am Server einmal schreibbar),
    bei Gästen im Gerät, als Kopie im Fortschritt. Steht nirgends einer,
    entscheidet die Bedienungssprache (`bestimmeLernweg`) - ★ FREIGABE
    25.09.2026: `englischLehrgangProbeAn()` ist die Grundeinstellung, nur
    `?englisch-lehrgang=0` (Not-Aus) erzwingt weiter „de". Festgeschrieben
    wird der Weg beim ERSTEN Fortschritt (`saveFn` unten), danach springt er
    nie mehr um.

    Die Trainer lesen den Weg aus ihrem Fortschritt (`lernwegVon`); darum
    trägt `loadFn` ihn dort nach, wo er vom Vorgabewert abweicht. Mit dem
    Not-Aus und ohne gespeicherten Weg ändert sich an keinem Fortschritt
    etwas.
  */
  const lernwegProbe = useMemo(() => englischLehrgangProbeAn(), []);
  // ★ E11a-6 (26.09.2026): dasselbe für den französischen Schalter - ohne
  // dieses Feld bleibt `bestimmeLernweg` unten bei "fr"-Bedienung immer bei
  // "de" stehen (siehe Kommentar am Import oben).
  const franzLernwegProbe = useMemo(() => franzoesischLehrgangProbeAn(), []);
  // ★ ES-O (27.09.2026): derselbe Fehler wie vor E11a-6 bei „fr" - ohne dieses
  // Feld blieb `bestimmeLernweg` bei „es"-Bedienung IMMER bei „de" stehen, auch
  // mit `?spanisch-lehrgang=1`: spanische Knöpfe über deutschem Übungsstoff.
  const spanLernwegProbe = useMemo(() => spanischLehrgangProbeAn(), []);
  // ★ G2a (02.10.2026): die vier Schalter der neuen Sprachen (Vorgabe aus) -
  // ohne sie fiele jede it/pl/tr/cs-Bedienung nie auf ihren Weg, auch mit Schalter.
  const neueProben = useMemo(() => neueLehrgangProben(), []);
  const [fortschrittsWeg, setFortschrittsWegState] = useState<{
    id: string;
    weg: Lernweg;
  } | null>(null);
  // Über einen Ref, damit ein Laden ohne gespeicherten Weg (der Normalfall)
  // gar keinen Zustand setzt - dann ändert sich für niemanden etwas.
  const fortschrittsWegRef = useRef<{ id: string; weg: Lernweg } | null>(null);
  const setFortschrittsWeg = (w: { id: string; weg: Lernweg } | null) => {
    const alt = fortschrittsWegRef.current;
    if (alt === w || (alt && w && alt.id === w.id && alt.weg === w.weg)) return;
    fortschrittsWegRef.current = w;
    setFortschrittsWegState(w);
  };
  const fortschrittsWegHier =
    fortschrittsWeg && fortschrittsWeg.id === (account?.id ?? "") ? fortschrittsWeg.weg : null;
  const gespeicherterWeg = (konto: typeof account, pWeg: Lernweg | null): Lernweg | null =>
    konto
      ? istLernweg(konto.lernweg)
        ? konto.lernweg
        : pWeg
      : (gastLernwegLesen() ?? pWeg);
  const lernweg = bestimmeLernweg({
    gespeichert: gespeicherterWeg(account, fortschrittsWegHier),
    bedienSprache: sprache,
    lehrgangProbeAn: lernwegProbe,
    franzoesischLehrgangProbeAn: franzLernwegProbe,
    spanischLehrgangProbeAn: spanLernwegProbe,
    ...neueProben,
  });
  /** Hat dieses Konto (dieser Gast) seinen Weg schon festgeschrieben? Latcht je Sitzung. */
  const lernwegFestRef = useRef<string | null>(null);

  /*
    ★★★ W2b (28.09.2026, Punkt 2): DIE TASTATUR-RÜCKFRAGE BEIM ERSTEN START.
    Solange der Weg nicht feststeht, wählt die Bedienungssprache ihn. Wer im
    Sprachwähler eine Sprache nimmt, deren Weg eine andere Tastatur braucht
    (fr, es), wird gefragt - „Nein" lässt die bisherige Sprache stehen. Die
    Entscheidung steht rein in `lib/typing/sprachwahlTastatur.ts`. Der
    Sprachwähler selbst ist der gemeinsame der Kopfzeile - er bekommt nur
    seine vorhandenen Eigenschaften (`sprachSchalter`, `sprachen`) von hier.
  */
  const erkannteTastaturJetzt = useTastaturErkennung();
  const [sprachFrage, setSprachFrage] = useState<{
    neu: BedienSprache;
    weg: RueckfrageWeg;
    layout: LayoutId;
  } | null>(null);
  const sprachWechselMitTastatur = (neu: BedienSprache) => {
    const neuerWeg = bestimmeLernweg({
      gespeichert: null,
      bedienSprache: neu,
      lehrgangProbeAn: lernwegProbe,
      franzoesischLehrgangProbeAn: franzLernwegProbe,
      spanischLehrgangProbeAn: spanLernwegProbe,
      ...neueProben,
    });
    const e = tastaturBeimSprachwechsel({
      wegFest: gespeicherterWeg(account, fortschrittsWegHier) !== null,
      neuerWeg,
      eingestellt: activeLayout().id,
      erkannt: erkannteTastaturJetzt,
      vorschlag: vorschlagLayout(neu, browserSprachen()),
    });
    if (e.art === "frage") {
      // ⚠️ ZWEI Takte warten: Der Sprachwähler schliesst seine Liste und gibt
      // den Fokus erst im NÄCHSTEN Takt an seinen Knopf zurück
      // (`useAufklapper.schliessen(true)`, AppKopfzeile). Ginge das Fenster
      // vorher auf, holte jener Takt den Fokus aus dem offenen Fenster, und das
      // Fenster merkte sich nicht den Knopf als Auslöser - „Nein" landete dann
      // in der Übungszeile statt auf dem Sprachwähler (im Test gemessen).
      const frage = { neu, weg: e.weg, layout: e.layout };
      window.setTimeout(() => window.setTimeout(() => setSprachFrage(frage), 0), 0);
      return;
    }
    if (e.layout) setLayout(e.layout);
    wechsleBedienung(neu);
  };
  const zoomIn = useTypingA11y((s) => s.zoomIn);
  const zoomOut = useTypingA11y((s) => s.zoomOut);
  // ★ 18.10.2026 (Kürzel einheitlich): Alt + 0 = normale Größe, das Gegenstück zu Alt + Plus / Minus.
  const resetZoom = useTypingA11y((s) => s.resetZoom);
  const zoom = useTypingA11y((s) => s.zoom);

  /**
   * ★★★ DIE ÜBUNGSFLÄCHE - Behälter für die Ränder (§6.1), Anker für die
   * Lesestelle (§6.2) und Bereich des Fokus-Wächters (§3).
   *
   * ⚠️ Die Kennzeichen aus §13 allein tun nichts. Sie stehen seit dem
   * 25.08.2026 in `TypingSession` (`data-aufgabe` an der Zeile, `data-angabe`
   * am Text, `data-feld` am Tippfeld) - erst diese drei Zeilen hier hängen
   * Wächter und Lesestelle daran.
   */
  const blattflaeche = useRef<HTMLElement>(null);

  /**
   * ★★★ DIE LESESTELLE BLEIBT BEIM VERGRÖSSERN STEHEN (§6.2).
   *
   * ⚠️ Und zwar bei BEIDEN Vergrößerungen. Strg/Cmd + Plus geht nicht durch
   * unseren Code - davor merken ist unmöglich; `useLesestelle` merkt darum
   * fortlaufend mit. Alt + Plus vergrößert in Tastenflow nur das Tippfeld -
   * und genau das schiebt alles darunter nach unten.
   */
  const { merken, halten } = useLesestelle(() => blattflaeche.current);

  // ⚠️ `useLayoutEffect`, nicht `useEffect`: Gerollt wird NACH dem neuen
  // Umbruch und VOR dem Zeichnen - sonst sieht man die Seite springen.
  useLayoutEffect(() => {
    halten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  /**
   * ★★★ DER FOKUS-WÄCHTER (§3) - gegen den Sprung an den Dokumentenanfang.
   *
   * ⚠️ Er rettet, aber die Rettung ist nicht die Heilung. Jeder Vorfall geht
   * an `meldeVorfall`: in die Konsole und nach `__fokusvorfaelle`. Ein
   * Wächter, der still repariert, verbirgt genau die Fehler, die er finden
   * soll.
   */
  useEffect(() => {
    const w = blattflaeche.current;
    if (!w) return;
    return fokuswacheStarten(w, meldeVorfall);
  }, []);

  /**
   * Neuer Stand live ⇒ dieses Fenster lädt sich in einem ruhigen Moment selbst
   * neu (im Hintergrund oder nach drei Minuten ohne Eingabe, nie beim Tippen).
   * Anlass: Mock-Bündel am 10.11.2026, offene Fenster blieben darauf hängen.
   */
  useEffect(() => starteVersionsPruefung(), []);

  /**
   * ★★★★★ DIE ARBEITSSTELLE ROLLT IN DIE MITTE (§6.4, Johannes 09.09.2026:
   * „das wäre eine riesige Unterstützung für Menschen mit Sehbehinderung").
   *
   * Der Browser rollt ein neu fokussiertes Element so WENIG wie möglich ins
   * Bild - die Arbeitsstelle klebt dadurch am Rand. Bei starker Vergrösserung
   * sieht man von seiner Aufgabe dann nur die Zeile, in der man steht.
   *
   * ⚠️ Zuerst nur im Mathecoach gebaut und am 09.09. nachgezogen. Das Bauteil
   * gehört allen (`lib/arbeitsblatt/fokusMitte.ts`); die drei Fallen stehen
   * dort: `instant` statt `auto`, `pointerdown` statt `keydown`, `setTimeout`
   * statt `requestAnimationFrame`.
   */
  useEffect(() => {
    const w = blattflaeche.current;
    if (!w) return;
    return fokusMitteStarten(w);
  }, []);

  /**
   * ★★★★★ WAS UNTER DEM FOKUS STEHT, WIRD VORGELESEN (03.09.2026 abends).
   *
   * Johannes: *„wenn ich mit Vorlesen an durchs Menü tab, dann wird kein
   * Schalter und keine Erklärung vorgelesen."* Am Code nachgesehen: Es gab
   * überhaupt keine Fokus-Ansage - die eigene Stimme sprach nur beim KLICKEN
   * eines Schalters und beim Tippen.
   *
   * ★ Das gilt für die GANZE Seite, nicht nur für die Einstellungen. „Vorlesen"
   *   ist für Kinder gebaut, die keinen Screenreader haben; für die ist es der
   *   einzige Kanal, und der Fokus wandert überall hin. Die Begründung und die
   *   drei Stellen, an denen die Ansage schweigt, stehen in `fokusVorlesen.ts`.
   *
   * ⚠️ Der Wächter meldet sich immer an - `speakUi` schweigt von selbst,
   * solange „Vorlesen" aus ist. Ein Effekt, der am Schalter hinge, müsste bei
   * jedem Umschalten neu binden; das ist mehr Bewegung für dasselbe Ergebnis.
   */
  useEffect(() => fokusVorlesenStarten(), []);
  const setVoice = useVoice((s) => s.setEnabled);
  const setVoiceURI = useVoice((s) => s.setVoiceURI);

  const [showHelp, setShowHelp] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  // Stets aktueller Stand für den Tastatur-Handler: Alt + H und Alt + T müssen
  // wissen, ob sie gerade ÖFFNEN oder SCHLIESSEN — beim Schließen gehört der
  // Fokus in die Eingabezeile (Nr 15 der Fokusziele).
  const showHelpRef = useRef(showHelp);
  showHelpRef.current = showHelp;
  const showShortcutsRef = useRef(showShortcuts);
  showShortcutsRef.current = showShortcuts;
  // ★★★★★ Fokusfalle der Kurztasten-Liste (Befund F2 des Vollaudits).
  // Gemessen am 30.08.: `24x Tab: im Fenster 1 · DRAUSSEN 21` - erster Austritt
  // schon bei Tab 1, obwohl das Fenster `aria-modal="true"` trägt. Ein Kind
  // schlug seine eigenen Tastenkürzel nach und stand nach EINEM Tab in einer
  // Seite, die der Screenreader als nicht vorhanden meldet. Regel R-A7.
  // Gegenprobe derselben Messung: die Hilfe (Alt + H) hält 24 von 24 - sie
  // benutzt genau diesen Haken. Hier dieselbe Bauart, nicht eine zweite.
  const kurztastenCardRef = useRef<HTMLDivElement>(null);
  const kurztastenCloseRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(showShortcuts, kurztastenCardRef, {
    initialFocus: kurztastenCloseRef,
  });
  const [showAuth, setShowAuth] = useState(false);
  const [showVoiceInstall, setShowVoiceInstall] = useState(false);
  // „Tasten erkunden" (Alt + 3): jede gedrückte Taste wird angesagt. Bewusst
  // NICHT gespeichert — nach einem Neuladen ist die App immer im Normalzustand
  // (Johannes' Notausgang, falls jemand versehentlich hineingerät).
  // ★ 30.08.2026 von Alt + K auf Alt + 3 umgezogen: Alt + 3 war seit dem
  //   07.08. schon der AUSGANG aus dem Modus („eine Kombi, die beim Erkunden
  //   nie aus Versehen entsteht"). Jetzt ist es auch der Eingang - rein und
  //   raus auf derselben Taste. Alt + K gehört seither dem Farbschalter der
  //   Kopfzeile.
  // ★ 13.09.2026: EIN Zustand für offen UND Anfangs-Modus - `null` heißt zu.
  //   Alt + 3 öffnet „Tasten erkunden", Alt + 4 direkt „Tasten finden"; im
  //   Fenster wechselt der Baustein selbst (`startModus` gilt nur beim Öffnen).
  const [erkundenModus, setErkundenModus] = useState<ErkundenModus | null>(null);
  // Der Einführungs-Podcast: beim ALLERERSTEN Start von selbst offen, danach
  // nur noch über den Knopf „🎧 Einführung" IM ZAHNRAD (bis 09.08.2026 stand er
  // dauerhaft im Seitenkopf — für etwas, das man einmal hört). Das Bit dazu liegt
  // im Browser (IntroPodcast.tsx), nicht im Spielstand — es beschreibt dieses
  // Gerät, nicht die Person. `useState(fn)` liest es genau einmal beim
  // Aufbauen; ein Effekt wäre hier ein sichtbares Aufblitzen.
  const [showIntro, setShowIntro] = useState(() => !introGesehen());
  // Die EINRICHTUNG beim ersten Start (Alter · Sprache · Tastatur · Startpunkt ·
  // Ton/Vorlesen · Podcast) — Vorbild ist der Im-Griff-Rundgang. Sie tritt an
  // die Stelle des Trainers, statt sich als Fenster darüberzulegen; Alt + R
  // startet sie jederzeit neu (dasselbe Kürzel wie dort).
  // ⚠️ Wer BEREITS ANGEMELDET ist, sieht sie beim Aufbauen NICHT (Wunsch
  // Johannes 09.08.): Sonst blitzt sie bei jedem alten Konto auf, nur weil das
  // Bit in diesem Browser fehlt. Ob sie doch fällig ist (frisch angelegtes
  // Konto, das noch nie geübt hat), entscheidet der Spielstand — siehe den
  // Lade-Effekt weiter unten.
  const [einrichtung, setEinrichtung] = useState(
    () => !account && !einrichtungFertig(),
  );
  const authTriggerRef = useRef<HTMLButtonElement>(null);
  /**
   * Der EINSTELLUNGS-Bereich (Zahnrad in der Kopfzeile, Alt + O). Er klappt
   * seit 22.08.2026 direkt unter der Kopfzeile auf, über die volle Breite —
   * vorher hing er unter einer eigenen grauen Leiste über der Übungskarte.
   */
  // Immer zu beim Einstieg - siehe `raeumeAltenSettingsSchluessel` oben.
  const [settingsOffen, setSettingsOffen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  // Stets aktueller Stand für den Tastatur-Handler (der hängt nicht an diesem
  // Zustand, sonst würde er bei jedem Auf und Zu neu angemeldet).
  const settingsOffenRef = useRef(settingsOffen);
  settingsOffenRef.current = settingsOffen;
  // Frisch aufgeklappt → Fokus ins erste Bedienelement (siehe Effekt unten).
  const fokusInSettings = useRef(false);
  /**
   * Wird gerade überhaupt geübt? Nur dann gibt es das Zahnrad und den Bereich
   * (in Statistik, Anmeldung und Einrichtung wäre „Was übst du?" sinnlos).
   * Alt + O muss dieselbe Grenze kennen - sonst meldet die Sprachausgabe
   * „Einstellungen geöffnet", während nichts aufgeht.
   */
  const uebtGeradeRef = useRef(false);
  /**
   * Alt + B schaltet die Übungsart reihum. Der Tastatur-Handler wird nur einmal
   * angemeldet und darf darum nicht am wechselnden `mode` hängen — er ruft
   * diesen Ref, der bei jedem Rendern frisch belegt wird (gleiches Muster wie
   * `progressRef` in den Trainern).
   */
  const uebungsartWeiterRef = useRef<() => void>(() => {});

  /**
   * Auf/Zu — und wohin danach der Fokus geht.
   *   • Aufklappen: immer IN den Bereich (er steht weit weg vom Zahnrad; wer
   *     ihn öffnet, will etwas darin einstellen).
   *   • Zuklappen per ZAHNRAD: der Fokus bleibt auf dem Zahnrad — es steht ja
   *     weiterhin da (Fokus-Pflicht: nur was verschwindet, braucht ein Ziel).
   *   • Zuklappen per Alt + O: der Fokus stand im Bereich, der gerade
   *     verschwindet → zurück in die Eingabezeile (Hausregel 14.08.2026).
   */
  const toggleSettings = () => {
    if (!uebtGeradeRef.current) return;
    const next = !settingsOffenRef.current;
    settingsOffenRef.current = next;
    setSettingsOffen(next);
    raeumeAltenSettingsSchluessel();
    sprichBedienung(
      ansageSchalter("einstellungenGeoeffnet", "einstellungenGeschlossen", next, bedienLang()),
    );
    if (next) fokusInSettings.current = true;
    /*
      ★★★ JEDER Weg aus dem Fenster führt zurück ins Übungsfeld - Zahnrad,
      Alt + O, Escape, „Zurück zum Üben", Klick auf „Tastenflow" (07.09.2026).

      Vorher waren es zwei Regeln: Zuklappen per Zahnrad ließ den Fokus dort
      stehen, alles andere holte ihn ins Feld. Bei einem AUFKLAPPBEREICH war
      das richtig - das Zahnrad blieb sichtbar. Bei einem FENSTER hing es
      plötzlich am Zufall: `Modal` gibt den Fokus an den Öffner zurück, aber
      nur, wenn React genau dieses Element noch im Baum hat; sonst fällt es
      selbst auf das Übungsfeld. Eine Regel, die manchmal so und manchmal
      anders ausgeht, ist keine.

      Eine Regel, und sie ist Johannes' eigene: „wieder zum programm".
      ⚠️ `setTimeout(0)`, weil `Modal` beim Abbau selbst noch einen Fokus setzt.
    */
    else window.setTimeout(() => focusPracticeField(), 0);
  };

  /**
   * Schließen über Escape, den Zurück-Knopf oder den Klick auf „Tastenflow" -
   * und danach steht der Fokus in der EINGABEZEILE.
   *
   * ★★★ WARUM NICHT AUF DEM ZAHNRAD, wie `Modal` es von sich aus täte:
   * Johannes' Wortlaut vom 07.09. ist „das mit esc und mit zurück wieder zum
   * PROGRAMM wechselt" - und die Hausregel vom 14.08. sagt dasselbe: „ESC ⇒
   * Eingabezeile, in JEDER App" ([[feedback_fokus_pflicht_alle_apps]]). Wer
   * das Fenster über einen dieser drei Wege verlässt, will weiterüben.
   *
   * ⚠️ `setTimeout(0)` ist hier PFLICHT, nicht Vorsicht: `Modal` setzt den
   * Fokus beim Abbau auf den Öffner zurück. Ohne die Verzögerung setzten wir
   * zuerst und das Modal danach - der Fokus landete auf dem Zahnrad, und der
   * Grund wäre aus dem Quelltext nicht zu sehen.
   *
   * ★ Das ZAHNRAD selbst bleibt davon unberührt: Wer damit zuklappt, bekommt
   * den Fokus von `Modal` dorthin zurück - es steht ja weiterhin da (Fokus-
   * Pflicht: nur was verschwindet, braucht ein neues Ziel).
   */
  const schliesseSettings = () => {
    if (!settingsOffenRef.current) return;
    settingsOffenRef.current = false;
    setSettingsOffen(false);
    sprichBedienung(ansage("einstellungenGeschlossen", bedienLang()));
    window.setTimeout(() => focusPracticeField(), 0);
  };

  /*
    ★ 07.09.2026: Der eigene Fokus-Sprung ist WEG. `Modal` setzt den Fokus beim
    Öffnen selbst in den Dialog und gibt ihn beim Schließen an den Öffner (das
    Zahnrad) zurück. Zwei Stellen, die denselben Fokus setzen, ergäben genau
    das Ruckeln, das [[feedback_fokus_pflicht_alle_apps]] beschreibt.
    `fokusInSettings` bleibt als Merker der ANSAGE erhalten - siehe
    `toggleSettings`.
  */

  // PWA-Manifest: auf weingartner.org nur auf dieser Seite aktiv.
  //
  // Zwei Fassungen, weil Tastenflow seit dem 22.08.2026 unter zwei Adressen
  // erreichbar ist. Der Geltungsbereich („scope") eines Manifests MUSS die
  // Seite enthalten, sonst bietet der Browser das Installieren gar nicht an:
  //   - weingartner.org ⇒ start_url/scope „/programme/tastenflow"
  //   - tastenflow.org  ⇒ start_url/scope „/" (dort ist die Wurzel Tastenflow)
  //
  // ★★★ Auf tastenflow.org gehört die GANZE Adresse Tastenflow (28.09.2026):
  // Manifest und Zeichen bleiben dort auch nach dem Wechsel in „Meine
  // Klassen", Impressum usw. Bis dahin räumte dieser Effekt beim Verlassen
  // beides weg und setzte das Sensorik-Zeichen ein - eine Kollegin hat
  // Tastenflow aus „Meine Klassen" installiert und bekam das Sensorik-S auf
  // den Schreibtisch. Den Direkteinstieg auf einer anderen Seite deckt der
  // Splash in index.html (hängt das Manifest dort schon vor React an).
  useEffect(() => {
    const eigeneAdresse = hierIstTastenflow();
    if (eigeneAdresse) {
      if (!document.querySelector('link[rel="manifest"]')) {
        const mf = document.createElement("link");
        mf.rel = "manifest";
        mf.href = "/tastenflow-manifest.json";
        document.head.appendChild(mf);
      }
      for (const el of Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]'),
      )) {
        el.href = el.href.includes(".svg")
          ? "/tastenflow-logo.svg?v=2"
          : "/tastenflow-logo-180.png?v=2";
      }
      return;
    }
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/tippen-manifest.json";
    document.head.appendChild(link);
    // Browser-Tab-Zeichen: Solange diese Seite offen ist, zeigt der Tab das
    // Tastenflow-Logo statt des Sensorik-S (30.08.2026). Beim ersten Laden
    // tauscht das schon der Splash in index.html - hier greift der Tausch
    // auch nach einem SPA-Wechsel HERAUS aus Tastenflow wieder zurück
    // (Aufräumteil), und hinein (Effekt) für den Weg über die Lernwerkstatt.
    const icons = Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"], link[rel="apple-touch-icon"]',
      ),
    );
    for (const el of icons) {
      el.href = el.href.includes(".svg")
        ? "/tastenflow-logo.svg?v=2"
        : "/tastenflow-logo-180.png?v=2";
    }
    return () => {
      document.head.removeChild(link);
      // Zurück zum Plattform-Zeichen (Werte aus index.html) - NICHT zum
      // Vorzustand: Beim Direkteinstieg hat der Splash die Zeichen schon vor
      // React getauscht, der Vorzustand WÄRE also das Tastenflow-Logo, und
      // der Tab behielte es auf der Lernwerkstatt.
      for (const el of icons) {
        el.href = el.href.includes(".svg") ? "/logo.svg?v=5" : "/logo-180.png?v=5";
      }
    };
  }, []);
  // Jedes Fenster gibt den Fokus an dieselbe Stelle zurück: in die
  // Eingabezeile (Grundregel 14.08.2026, siehe Escape-Zweig unten).
  const closeHelp = () => {
    setShowHelp(false);
    focusPracticeField();
  };
  const schliesseKurztasten = () => {
    setShowShortcuts(false);
    focusPracticeField();
  };

  const [pupilView, setPupilView] = useState<"ueben" | "statistik">("ueben");

  /**
   * ★★★ DIE SCHREIBPROBE der eigenen Klasse (09.09.2026).
   *
   * Der Haken fragt die Klasse in Abständen nach; ohne Konto, ohne Klasse oder
   * ohne gestartete Probe kommt „keine" heraus, und dann ändert sich an dieser
   * Seite gar nichts. Siehe `lib/typing/useSchreibprobe.ts`.
   */
  const probe = useSchreibprobe(account);
  /**
   * ★★ 27.09.2026: Die Warteschlange im Gerät nachsenden (Tippchallenge-
   * Ergebnis ohne Netz abgegeben) - beim Start/Anmelden, bei `online`, im
   * Takt. Siehe `lib/typing/nachsenden.ts`.
   */
  useNachsenden(account);
  /**
   * Übernimmt die Schreibprobe gerade den Bildschirm?
   *
   * ★ Bewusst NICHT bei „wartet": Eine Probe, die erst später beginnt, darf ein
   * Kind nicht vorher vom Üben aussperren. Und nicht bei „verpasst": Wer nicht
   * eingestiegen ist, übt normal weiter - die Lehrkraft sieht ihn als „nicht
   * angetreten", das genügt.
   *
   * ★ Nach dem Abgeben nur, bis die Auswertung gelesen ist - „Weiter üben"
   * oder Escape führen zurück ins normale Üben (Johannes 10.09.2026). Vorher
   * blieb die Auswertung stehen, bis die Lehrkraft die Challenge aus der
   * Klasse nahm.
   */
  const schreibprobeDran =
    probe.phase === "offen" ||
    probe.phase === "laeuft" ||
    (probe.phase === "abgegeben" && !probe.stand.gesehen);
  /**
   * Dasselbe über einen Ref - der Tastatur-Handler wird nur EINMAL angemeldet
   * und sähe sonst den Stand vom ersten Rendern. Dieselbe Falle, die
   * `uebungsartWeiterRef` und `showHelpRef` in dieser Datei schon abfangen.
   */
  const schreibprobeDranRef = useRef(false);
  schreibprobeDranRef.current = schreibprobeDran;

  /*
    ★★★ DAS KLASSENMATCH (11.09.2026, Etappe E6).

    Der Haken beantwortet, ob dieses Kind ein Match ausschreiben darf, ob
    gerade jemand einlädt und wo das eigene Match steht. Ohne Konto, ohne
    Klasse oder mit abgeschaltetem Match kommt „nichts" heraus - dann ändert
    sich an dieser Seite gar nichts. Siehe `lib/typing/useKlassenmatch.ts`.
  */
  const match = useKlassenmatch(account);
  const setMatchAngebot = useKlassenmatchAngebot((s) => s.setAngebot);
  /*
    Der Schalter in der Stand-Zeile - siehe `lib/typing/klassenmatchAngebot.ts`.

    ★ Er steht auch dann da, wenn gerade nicht eingeladen werden kann, weil das
    eigene Match läuft oder in der Klasse schon zwei laufen (§2.6): Dann trägt
    er den Grund (`match.hinweis`) statt zu verschwinden.
  */
  useEffect(() => {
    setMatchAngebot(match.geladen && (match.erlaubt || !!match.hinweis), match.hinweis);
    return () => setMatchAngebot(false, "");
  }, [match.erlaubt, match.hinweis, match.geladen, setMatchAngebot]);
  /**
   * Übernimmt das Match gerade den Bildschirm?
   *
   * ★ Sobald dieses Kind DABEI ist - also ab der eigenen Einladung oder dem
   * eigenen „Bin dabei". Wer wartet, wartet: Das Wartefenster sagt, wer schon
   * da ist, und hat einen Weg zurück („Absagen" bzw. „Doch nicht", auch mit
   * Escape). Ein Tippfeld daneben wäre eine zweite Sache auf demselben
   * Bildschirm, und die Ansage „3 dabei" verdrängte beim Schreiben die
   * Braillezeile - genau das, was die Live-Region-Regel verbietet.
   *
   * ⚠️ Wer NICHT dabei ist, sieht davon nichts ausser dem Einladungs-Fenster
   * (weiter unten) - es liegt über der Seite, und ein „Jetzt nicht" bringt den
   * Fokus zurück in die Eingabezeile.
   */
  const matchDran = !!match.meinMatch && match.phase !== "keine";
  /** Für den Tastatur-Handler, der nur EINMAL angemeldet wird (Alt + M). */
  const matchRef = useRef(match);
  matchRef.current = match;

  /*
    ★★★ „EIGENE ÜBUNG" (17.09.2026, Reihe seit Z1 19.09.2026).

    Der Haken beantwortet, an welcher Übung aus der Reihe der Klasse DIESES
    Kind gerade arbeitet - der ältesten, die es noch nicht fertig hat; jedes
    Kind übt im eigenen Tempo, siehe `lib/typing/useEigeneUebung.ts`.
  */
  const eigeneUebung = useEigeneUebung(account);
  /**
   * Übernimmt die eigene Übung gerade den Bildschirm?
   *
   * ★ Niedrigste Priorität der drei klassenweiten Zustände (siehe die Ternäre
   * weiter unten): weder zeitkritisch wie die Tippchallenge noch verabredet
   * mit einem anderen Kind wie das Klassenmatch - eine Prüfung und ein
   * laufendes Match dürfen beide vorgehen. Erst NACH dem ersten Laden
   * entscheiden, sonst reisst ein kurzes „ungeladen" das Kind für einen
   * Augenblick aus einer laufenden eigenen Übung heraus.
   */
  const eigeneUebungDran = eigeneUebung.geladen && eigeneUebung.dran;
  /** Für den Tastatur-Handler (Alt + B), der nur EINMAL angemeldet wird. */
  const eigeneUebungDranRef = useRef(false);
  eigeneUebungDranRef.current = eigeneUebungDran;
  /*
    ★★★ E6 (19.09.2026): DAS ANKÜNDIGUNGSFENSTER, BEVOR DIE ÜBUNG BEGINNT -
    seit Z1 vor JEDER Übung der Reihe, am Konto gemerkt.

    „gesperrt" sind genau die beiden Zustände, die in der Ternäre weiter unten
    ohnehin schon VOR der eigenen Übung stehen - eine laufende Tippchallenge
    oder ein laufendes Klassenmatch sollen das Fenster nicht durchbrechen,
    siehe `useEigeneUebungAnkuendigung.ts` Regel 2.
  */
  const eigeneUebungAnkuendigung = useEigeneUebungAnkuendigung({
    dran: eigeneUebungDran,
    zeiger: eigeneUebung.zeiger,
    gesperrt: schreibprobeDran || matchDran,
    angekuendigt: eigeneUebung.angekuendigt,
    merkeBestaetigt: eigeneUebung.bestaetigeAnkuendigung,
  });
  /*
    Der Schalter aus der Stand-Zeile meldet sich über ein Ereignis - dasselbe
    Muster wie „🐧 Spielen" (`tippen-open-freeplay`). So braucht die Zeile
    keinen Weg zurück zu dieser Seite, und der Schalter funktioniert in allen
    drei Trainern gleich.
  */
  useEffect(() => {
    const oeffne = () => matchRef.current.einladen();
    window.addEventListener(KLASSENMATCH_EREIGNIS, oeffne);
    return () => window.removeEventListener(KLASSENMATCH_EREIGNIS, oeffne);
  }, []);

  // Stets aktueller Stand für den Tastatur-Handler (Alt + S schaltet um).
  const pupilViewRef = useRef(pupilView);
  pupilViewRef.current = pupilView;
  /**
   * ★ Nr 2 der Fokusziele - GEÄNDERT am 22.08.2026 abends von Johannes selbst
   * (`Sensorik/FOKUSZIELE-TASTENFLOW.md` §0.5), umgesetzt am 28.08.2026.
   *
   * Am Nachmittag stand hier noch die Überschrift als Ziel (R4: eine Seite zum
   * Lesen bekommt ihre Überschrift). Am Abend hat Johannes das überstimmt:
   *
   *   „Beim Öffnen von ‚Meine Statistik' steht der Fokus auf dem ERSTEN
   *   Abzeichen (oben links) - die Abzeichen sind extrem wichtig für die
   *   Kinder."
   *
   * Der Fokus kann hier NICHT einfach im nächsten Takt gesetzt werden: Die
   * Statistik lädt Fortschritt und Ereignisse nach und zeigt zuerst „Lädt …" -
   * im nächsten Takt gibt es noch gar kein Abzeichen. `focusFirstBadge()`
   * stellt darum eine Anforderung, die das Abzeichen-Regal beim Erscheinen
   * selbst einlöst (`src/lib/typing/focusStats.ts`, dort steht auch die
   * Rangfolge der Ziele bis hinunter zur Überschrift).
   *
   * Der Rückweg bleibt unverändert das Tippfeld (`schliesseStatistik`).
   */
  const oeffneStatistik = () => {
    setPupilView("statistik");
    sprichBedienung(ansage("statistik", bedienLang()));
    focusFirstBadge();
  };
  const schliesseStatistik = () => {
    setPupilView("ueben");
    // Eine noch offene Abzeichen-Anforderung verwerfen: Sie gilt fünf Sekunden,
    // und ein Regal, das in dieser Zeit noch irgendwo aufgebaut wird, risse den
    // Fokus sonst aus der Eingabezeile zurück.
    clearFirstBadgeFocusRequest();
    focusPracticeField();
    /*
     * ⚠️ C5 (11.09.2026): Johannes meldete „Statistik schließen wirkt nicht"
     * (Mac, Chrome; Escape ging). Zweimal unabhängig gemessen - programmatisch
     * UND mit echten Mausklicks an drei Fenstergrössen, beiden Schaltern, in
     * Training, Bücherei-Liste und Wortspielen: jedes Mal schliesst die
     * Statistik, der Fokus landet im Übungsfeld bzw. auf der Bereichs-
     * Überschrift (in der Bücherei-Liste holt ihn `SerienTrainer` selbst,
     * 19 ms nach dem Klick). Ein Sicherheitsnetz, das hier zwischenzeitlich
     * stand, lief 7 ms nach dem Klick ins Leere und wurde entfernt - ein
     * Rückfall, der nichts fängt, täuscht eine Behebung vor. Der Fall bleibt
     * offen: nach dem Deploy am Live-Stand mit dem gemeldeten Konto und
     * Browser erneut prüfen (Messprotokoll: Umbauplan vom 11.09., §7).
     */
  };
  // „Passwort ändern" — seit 10.08. im Konto-Menü statt unten in der Statistik.
  const [showPasswort, setShowPasswort] = useState(false);
  /**
   * OHNE Konto: die selbst gewählte Stufe (undefined = keine gewählt) und das
   * freiwillige Geburtsjahr. Beides zusammen ergibt über `stufeFuer` die
   * geltende Stufe — dasselbe Vorrangmodell wie am Konto, damit Gast und Konto
   * sich nicht unterschiedlich verhalten. Gemerkt wird nur für diese Sitzung.
   */
  const [localStufe, setLocalStufe] = useState<Stufe | undefined>(undefined);
  const [localGeburtsjahr, setLocalGeburtsjahr] = useState<number | undefined>(undefined);
  // ★ Probestück 12.09.2026, für jeden seit 19.09.2026: Die Übungssprache OHNE
  // Kinderkonto (Gast, Lehrkraft) beginnt in der Bedienungssprache - wer die
  // App englisch bedient, bekommt auch englische Zeilen, schon in der
  // Einrichtung als Vorgabe. Konten der Lernenden behalten ihre gespeicherte
  // Übungssprache (`lang` weiter unten); nur der Sprachschalter zieht sie mit
  // (`useBeimSprachSchalter`, bei `changeLang`). Ohne Provider ist `sprache`
  // „de" - wie vorher.
  const [localLang, setLocalLang] = useState<Lang>(() => sprache);
  const [mode, setMode] = useState<TrainerMode>("adaptiv");
  /**
   * WORTSPIELE (02.09.2026): Welche Form wurde gerade aus dem Regal genommen?
   * `null` heisst: Das Regal steht offen. Geübt wird die Form danach im Lauf
   * von „Mein Training" - der Bereich bringt keinen eigenen Übungslauf mit.
   */
  const [wortspiel, setWortspiel] = useState<UebungsformId | null>(null);
  const layout = useKeyboardLayout();
  // Startpunkt ohne Anmeldung (Anzahl freigeschalteter Einheiten) + Zähler, der
  // den Trainer nach einer Änderung neu laden lässt.
  const [startUnits, setStartUnits] = useState<number | undefined>(undefined);
  const [reloadNonce, setReloadNonce] = useState(0);
  // Einweben (TW-E3): eine bestimmte Serie beim Wechsel in die Bücherei direkt
  // öffnen (aus dem „Weiter mit deiner Geschichte?"-Angebot in „Mein Training").
  const [pendingStorySlug, setPendingStorySlug] = useState<string | null>(null);
  // Aus welchem Übungsmodus die aktuelle Geschichte geöffnet wurde.
  // Wohin die Bücherei nach der letzten Etappe zurückführt. „Wortspiele"
  // gehört seit 02.09.2026 dazu: Wer von dort aus eine Geschichte öffnet,
  // soll auch dorthin zurückkommen - sonst landet er wortlos woanders.
  const storyReturnRef = useRef<Extract<TrainerMode, "adaptiv" | "wortspiele">>("adaptiv");

  // ★ W4 (19.09.2026): Die gesperrten Zeiten der eigenen Klasse - Übung darin
  // zählt fürs Wochenziel nicht (`wochenziel.ts` „Eine Stunde sperren"). Der
  // frühere Wochenrhythmus (`useKlassenRhythmus`, Unterrichtstag) fällt hier
  // weg: Die neue Wochenziel-Rechnung kennt nur noch die feste Montag-08:00-
  // Grenze, keinen einstellbaren Rhythmus mehr.
  // ★ EN10-Befund: samt `geladen` - das Wochenziel-Fenster wartet darauf.
  const { zeiten: gesperrteZeiten, geladen: sperrenGeladen } = useGesperrteZeitenStand(
    account?.classCode,
  );

  const authVisible = showAuth && !account;
  const isTeacher = account?.role === "lehrkraft";

  /*
   * ★ T3 (01.09.2026): WER SICH ALS LEHRKRAFT ANMELDET, LANDET IN DER
   * VERWALTUNG - nicht im Trainer.
   *
   * Vorher landete auch ein Lehrkraft-Konto im Übungsfeld und musste erst
   * Alt + S finden. Entschieden im Entwurf §4.2 (Weg T3).
   *
   * ⚠️ AUSGELÖST WIRD DER ÜBERGANG, NICHT DER ZUSTAND. Ein `if (isTeacher)
   * navigate(...)` würde jede Lehrkraft, die auf „Selbst üben" geklickt hat,
   * im selben Takt wieder hinauswerfen - sie ist ja weiterhin angemeldet.
   * Gemerkt wird darum die Konto-Kennung, mit der zuletzt umgeleitet wurde:
   * Erst ein WECHSEL des Kontos löst wieder aus.
   */
  const umgeleitetFuer = useRef<string | null>(
    // ★ Der Anfangswert entscheidet alles: Wer beim ERSTEN Bild dieser Seite
    // schon als Lehrkraft angemeldet ist, kam gerade aus „Meine Klassen" über
    // „Selbst üben" (oder hat neu geladen) - der wird NICHT umgeleitet. Der
    // Zustand steht beim ersten Bild bereit; `useTypingAuth` liest das Konto
    // synchron beim Anlegen des Speichers (`currentAccount()`).
    //
    // ★★★ 10.09.2026: Das galt bis dahin für JEDE schon angemeldete Lehrkraft -
    // auch für die, die Tastenflow am nächsten Morgen neu öffnet und damit im
    // Übungsfeld landete. Johannes: „Lehrer müssen immer zuerst in der Meine-
    // Klasse-Seite starten, nicht auf Selbst üben." Verschont wird jetzt nur,
    // wer über „Selbst üben" kam.
    //
    // ★★★★★ A6 (Umbau 11.09.2026): Die Marke lag im `sessionStorage` des
    // TABS - und blieb dort auch nach einem Browser-Neustart mit
    // wiederhergestellten Tabs stehen, so dass ein blosser Aufruf von
    // tastenflow.org im selben Tab weiterhin ins Üben führte (Johannes: „in
    // Selber üben lande ich immer, auch als Lehrer"). Die Marke gehört an
    // den VERLAUFSEINTRAG dieser einen Navigation (`navigate(pfad, { state })`
    // in `MeineKlassePage.tsx`), nicht an den Tab: Ein Neuladen behält den
    // Eintrag samt State (bleibt im Üben), jeder NEUE Aufruf der Adresse hat
    // keinen State (führt in „Meine Klassen").
    account?.role === "lehrkraft" &&
    (location.state as { selbstUeben?: boolean } | null)?.selbstUeben
      ? account.id
      : null,
  );
  useEffect(() => {
    if (!account || account.role !== "lehrkraft") {
      // Abmelden setzt zurück - die nächste Anmeldung soll wieder führen.
      umgeleitetFuer.current = null;
      return;
    }
    if (umgeleitetFuer.current === account.id) return;
    umgeleitetFuer.current = account.id;
    // `replace`: Die Zurück-Taste in „Meine Klassen" führte sonst in den
    // Trainer, der sofort wieder hierher umleitet - eine Falle ohne Ausgang.
    navigate(meineKlasseHref("tippen"), { replace: true });
  }, [account, navigate]);
  /**
   * ★★★ DAS MESSGERÄT FÜR DIE ANSAGE - nur auf ausdrückliche Anforderung
   * (`?ansagemessung=1`, 04.09.2026).
   *
   * Es misst im LAUFENDEN Trainer, wie lange es vom Anschlag bis zum
   * Sprechbeginn dauert - über die ganze eigene Kette (readPlanAt →
   * speakSequence → runSpeech → cancelIfBusy → speak). Das Messblatt in
   * `public/ansage-tempo-messung.html` kann das nicht: Es ruft `speak()`
   * direkt und überspringt damit genau die Schicht, um die es geht.
   *
   * Ohne den URL-Zusatz läuft keine Zeile davon - ein Kind kann es weder
   * auslösen noch sehen.
   */
  useEffect(() => {
    if (!ansageMessungAngefordert()) return;
    return ansageMessungStarten();
  }, []);

  const isPupil = account?.role === "schueler";
  // „Einhand schreiben": schaltet die Umschalt-Gegenhand-Regel aus. Seit
  // 19.09.2026 zwei Quellen wie bei „Zeit lassen" (`einhand.ts`): Ein
  // Kind-Konto führt den Wert selbst (in einer Klasse setzt ihn die
  // Lehrkraft, ein Konto ohne Lehrkraft sich selbst); sonst merkt ihn das
  // Gerät - für Gäste UND Lehrkräfte, die selbst üben. Bis dahin galt ohne
  // Kind-Konto immer „Regel an", ohne Weg, das zu ändern.
  const deviceEinhand = useDeviceEinhand((s) => s.on);
  const setDeviceEinhand = useDeviceEinhand((s) => s.setOn);
  const einhand = isPupil ? !!account?.oneHand : deviceEinhand;
  const enforceShiftHand = !einhand;

  /**
   * ★ Zeilenende mit Enter (23.09.2026) - reine Klassen-Einstellung, KEIN
   * Geräte-/Selbst-Wert wie „Einhand schreiben" oder „Zeit lassen": Sie gilt
   * nur für Kinder EINER Klasse (`mitKlassenVorrang` in `useTypingAuth.ts`
   * legt `account.zeilenEndeEnter` schon aus der Klasse darüber) und bleibt
   * für jedes andere Konto (Lehrkraft, Gast, selbstlernend) unverändert
   * `false`.
   */
  const zeilenEnde = !!account?.zeilenEndeEnter;

  /**
   * ★★★★★ WER IN EINER KLASSE IST - der EINE Satz, aus dem alle drei
   * Selbst-Einstellungen folgen (04.09.2026).
   *
   * Johannes 03.09.: *„Alle, die nicht einer Klasse zugeordnet sind, müssen
   * sich das selbst in den Einstellungen einstellen können, sowie auch Tempo.
   * Nur Schüler einer Klasse können das nicht ändern."*
   *
   * Dieselbe Regel stand hier bis zum 04.09. in DREI Fassungen, und zwei davon
   * sagten etwas anderes:
   *
   * | Einstellung | stand da | wer fiel durch |
   * |---|---|---|
   * | Geburtsjahr | `!isPupil \|\| selfManaged` | niemand - richtig |
   * | „Zeit lassen" | `!account \|\| selfManaged` | **Lehrkräfte** |
   * | „Womit anfangen?" | `!account \|\| selfManaged` | **Lehrkräfte** |
   *
   * `!account` fragt „ist niemand angemeldet?" statt „gehört diese Person einer
   * Klasse an?". Eine Lehrkraft ist angemeldet und hat trotzdem keine
   * Lehrkraft über sich - sie fiel damit in die Sperre, die für Kinder einer
   * Klasse gedacht ist. Seit dem 03.09. üben Lehrkräfte selbst; gemeldet von
   * Johannes am 04.09.: „als Lehrer kann man kein Startlevel von sich selbst
   * einstellen und auch nicht das Tempo".
   *
   * ⇒ Es gibt jetzt EINEN Ausdruck. Wer ihn ändert, ändert alle drei - und das
   *   ist der Punkt: Es ist eine Regel, keine drei.
   *
   * Die Regel selbst steht jetzt in `lib/typing/account.ts` — dort, wo auch
   * die Kontoarten stehen, und von dort aus prüfbar
   * (`tests/tastenflow-selbst-einstellen.test.ts`).
   */
  const istKlassenkind = gehoertEinerKlasse(account);

  // „ZEIT LASSEN" (14.08.2026) — zwei Quellen, eine Wahrheit:
  //  • Ein LERNENDEN-Konto führt den Wert selbst (`tt_pupils.noTimePressure`).
  //    Bei Kindern einer Klasse setzt ihn die Lehrkraft (wie „Einhand
  //    schreiben"), selbstlernende Konten sich selbst.
  //  • Sonst merkt es dieses Gerät (wie Ton, Vorlesen, Zoom) — für Gäste UND
  //    für Lehrkräfte.
  //
  // ⚠️ 04.09.2026: Hier stand `account ? account.noTimePressure : …`. Für eine
  // Lehrkraft las das ein Feld, das es in `tt_teachers` nicht gibt (immer
  // „aus"), und `setNoTimePressure` hätte den Wert in `tt_pupils` unter der
  // Lehrkraft-Kennung gesucht — der Aufruf wäre still im `catch` verschwunden.
  // Der Schalter hätte sich also selbst nach dem Entsperren nicht gemerkt.
  // Genau wie beim Geburtsjahr eine Zeile weiter unten entscheidet darum
  // `isPupil`, nicht `account`.
  const deviceZeitLassen = useDeviceNoTimePressure((s) => s.on);
  const setDeviceZeitLassen = useDeviceNoTimePressure((s) => s.setOn);
  const zeitLassen = isPupil ? !!account?.noTimePressure : deviceZeitLassen;
  const darfZeitLassenSelbst = !istKlassenkind;
  /**
   * ★★★★★ WER SEINEN STARTPUNKT SELBST SETZEN DARF (03.09.2026 abends).
   *
   * Bis dahin stand hier `account ? undefined : …` - den Startpunkt gab es
   * also NUR ohne Anmeldung. Ein selbstlernendes Konto (eigene Anmeldung, aber
   * keine Klasse) fiel damit in dieselbe Sperre wie ein Kind, dessen Lehrkraft
   * den Startpunkt führt - obwohl es gar keine Lehrkraft hat, die es
   * umstellen könnte. Wer schon tippen kann, blieb bei F und J hängen.
   *
   * Der Wert selbst liegt für ALLE im Lernstand (`introduced`, über
   * `loadFn`/`saveFn`) - für Lehrkräfte seit dem 03.09. genauso am Server wie
   * für Kinder. Hier war nur das Tor zu.
   */
  const darfStartpunktSelbst = !istKlassenkind;
  const changeZeitLassen = (on: boolean) => {
    if (!isPupil || !account) {
      setDeviceZeitLassen(on);
      return;
    }
    void typingBackend()
      .setNoTimePressure(account.id, on)
      .then((a) => {
        if (a) update(a);
      });
  };

  /**
   * „ZEICHENABSTAND GROSS (CVI)" (E11, 18./19.09.2026) - dieselbe Bauart wie
   * „Zeit lassen" direkt darüber: MIT Kind-Konto entscheidet das Konto, OHNE
   * (Gäste, Lehrkräfte, die selbst üben) merkt es dieses Gerät.
   *
   * ★★★ Seit 19.09.2026 stellt ihn JEDE Person selbst ein, auch ein Kind
   * einer Klasse - Johannes, wörtlich: *„die CVI-Einstellungen kann sich
   * jedes Kind immer auch selbst in den Einstellungen einstellen, aber auch
   * die Lehrkraft, Kinder dürfen es ändern wie sie möchten, natürlich auch
   * Selbstlernende und welche ohne Account"*. Darum gibt es hier kein
   * `darfZeichenabstandSelbst` mehr; die Lehrkraft stellt ihn weiter in
   * „Meine Klassen" um, und wer zuletzt stellt, gilt (das Kind sieht ihre
   * Änderung über `kontoBeobachten` in `useTypingAuth.ts` sofort).
   */
  const deviceZeichenabstand = useDeviceZeichenabstand((s) => s.faktor);
  const setDeviceZeichenabstand = useDeviceZeichenabstand((s) => s.setFaktor);
  const zeichenabstand = isPupil
    ? zeichenabstandFaktor(account?.zeichenabstand)
    : deviceZeichenabstand;
  /**
   * „EINHAND SCHREIBEN" selbst umlegen (19.09.2026, Johannes: *„Selbstlernende
   * sollen sich alles einstellen können"* - *„auch Leute ohne Anmeldung"*).
   * Dieselbe Regel wie „Zeit lassen": in einer Klasse nur die Lehrkraft.
   */
  const darfEinhandSelbst = !istKlassenkind;
  const changeEinhand = (on: boolean) => {
    if (!isPupil || !account) {
      setDeviceEinhand(on);
      return;
    }
    void typingBackend()
      .setOneHand(account.id, on)
      .then((a) => {
        if (a) update(a);
      });
  };
  /**
   * ★ „GEZIELT ÜBEN" (13.11.2026, Bauplan BAUPLAN-2026-11-13-GEZIELT-UEBEN.md): einzelne Tasten/Zeichen wählen. Dieselbe
   * Bauart wie „Einhand schreiben": MIT Kind-Konto das Konto (in einer Klasse stellt die Lehrkraft ein - `account.gezielt`
   * ist dort schon mit Vorrang Kind/Klasse gerechnet), OHNE das Gerät. Alles dazu - Dialog, Vorschlag, Ansage,
   * Vorstellen einer vorgezogenen Taste - steckt im Haken; die Seite reicht es nur weiter. Gilt NUR in „Mein Training".
   */
  const gez = useGezieltSteuerung({
    account,
    istKlassenkind,
    lernweg,
    einhand,
    update,
    // Neue Runde, damit die Wahl sofort gilt (sonst erst bei der nächsten).
    onGespeichert: () => setReloadNonce((n) => n + 1),
  });
  const gezRef = useRef(gez);
  gezRef.current = gez;
  /**
   * „MEIN WOCHENZIEL" (19.09.2026, derselbe Auftrag) - nur für ein Konto
   * OHNE Lehrkraft. In einer Klasse setzt es die Lehrkraft; Gäste und
   * Lehrkräfte, die selbst üben, haben kein Wochenziel (es braucht die
   * gespeicherten Übungszeilen eines Kind-Kontos).
   */
  const darfWochenzielSelbst = isPupil && !!account && !istKlassenkind;
  const eigenesWochenziel =
    darfWochenzielSelbst && account ? kindWochenzielAusFeldern(account) : undefined;
  const changeWochenziel = (ziel: { minuten: number; nachholen: boolean }) => {
    if (!account || !eigenesWochenziel) return;
    void typingBackend()
      .setWochenziel(account.id, {
        minuten: ziel.minuten,
        // Die Ziel-Kalenderwochen bleiben, wie sie sind (leer = jede Woche).
        wochen: eigenesWochenziel.wochen,
        nachholen: ziel.nachholen,
      })
      .then((a) => {
        if (a) update(a);
      });
  };
  const changeZeichenabstand = (faktor: ReturnType<typeof zeichenabstandFaktor>) => {
    if (!isPupil || !account) {
      setDeviceZeichenabstand(faktor);
      return;
    }
    void typingBackend()
      .setZeichenabstand(account.id, faktor)
      .then((a) => {
        if (a) update(a);
      });
  };

  /**
   * ZURÜCK INS PROGRAMM - der eine Weg heim.
   *
   * Bis 25.08.2026 stand das hier als Rumpf im Escape-Zweig. Seither ruft es
   * ZWEI Wege auf: Escape (unverändert) und der Klick auf den Schriftzug
   * „Tastenflow" in der Kopfzeile (Johannes 25.08.2026: „ich würde gerne, wenn
   * ich auf den Text Tastenflow klicke, immer wieder zum Programm
   * zurückkommen, z. B. wenn Einstellungen geöffnet sind - das gleiche wie bei
   * Esc").
   *
   * ★ Warum EINE Funktion und nicht zwei ähnliche: Diese Liste ist über
   * Monate gewachsen (jedes neue Fenster musste hier eingetragen werden). Zwei
   * Abschriften davon liefen beim nächsten Fenster garantiert auseinander -
   * und die Abweichung fiele erst dem Kind auf, das über den einen Weg heim
   * kommt und über den anderen nicht.
   */
  const zurueckInsProgramm = () => {
    setShowHelp(false);
    setShowShortcuts(false);
    setShowVoiceInstall(false);
    setShowPasswort(false);
    setShowAuth(false);
    setShowIntro(false);
    setPupilView("ueben");
    // Wie in `schliesseStatistik`: eine noch offene Abzeichen-Anforderung darf
    // den Fokus nicht nachträglich aus der Eingabezeile holen.
    clearFirstBadgeFocusRequest();
    schliesseSettings();
    // Aufklappbares, das anderswo wohnt (Lektionsliste im Lehrgang):
    // Es hört auf dieses Ereignis.
    window.dispatchEvent(new Event("tippen-esc"));
    focusPracticeField();
  };
  // ⚠️ Über ein Ref, nicht über die Abhängigkeitsliste: Der Kürzel-Effekt unten
  // hängt an `[zoomIn, zoomOut, merken, setVoice, isPupil, isTeacher]` und wird
  // nicht bei jedem Zustandswechsel neu aufgesetzt. Ohne Ref riefe Escape die
  // Fassung von damals - dieselbe Falle, die `showHelpRef` und
  // `uebungsartWeiterRef` in dieser Datei schon abfangen.
  const zurueckRef = useRef(zurueckInsProgramm);
  zurueckRef.current = zurueckInsProgramm;

  /**
   * ★★ VORLESEN AN/AUS - EIN ZUSTAND, DREI TÜREN (30.08.2026).
   *
   * Seit dem 30.08. gibt es dafür einen Knopf in der Kopfzeile. Er, das Kürzel
   * Alt + V und der Schalter im Zahnrad schreiben in DENSELBEN Speicher
   * (`useVoice`) und laufen durch DIESE eine Funktion. Ein zweiter Weg mit
   * eigener Ansage wäre genau die Doppelung, die einander nicht kennt: Zwei
   * Stellen, die dasselbe tun, sagen es beim nächsten Nachbessern verschieden.
   *
   * Die Ansage gehört dazu, nicht zum Knopf: Wer nicht sehen kann, ob der
   * Schalter umgesprungen ist, hört es hier - „an" spricht regulär, „aus" muss
   * an der An/Aus-Prüfung vorbei, weil der Schalter da schon aus ist.
   */
  const vorlesenAn = useVoice((s) => s.enabled);
  const vorlesenUmschalten = () => {
    const on = !useVoice.getState().enabled;
    setVoice(on);
    if (on) sprichBedienung(ansage("vorlesenAn", bedienLang()));
    // Englische (★ E11a-5: und französische) Bedienung: derselbe Sonderfall,
    // nur mit dem Satz und der Stimme der Bedienung (der Schalter ist in
    // diesem Augenblick schon aus). Bis E11a-5 prüfte die Zeile nur „en" -
    // „fr" hätte hier „Vorlesen aus." mit deutscher Stimme gesagt.
    else if (sprache !== "de") speakUiAlways(SEITEN_TEXTE[sprache].vorlesenAus, undefined, sprache);
    else speakUiAlways("Vorlesen aus.");
  };
  // Wie bei `zurueckRef`: Der Kürzel-Effekt unten wird nicht bei jedem
  // Zustandswechsel neu aufgesetzt und riefe sonst die Fassung von damals.
  const vorlesenUmschaltenRef = useRef(vorlesenUmschalten);
  vorlesenUmschaltenRef.current = vorlesenUmschalten;

  // Tastenkürzel für die wichtigsten Funktionen. Alt-/Wahltaste, damit sie auch
  // funktionieren, während im Tippfeld geschrieben wird (Alt+Buchstabe ist kein
  // normaler Anschlag). e.code ist tastatur-layout-unabhängig (auch auf dem Mac).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      /*
       * ★★★★★ DER BESTE BEWEIS KOMMT VOM TIPPEN SELBST (20.09.2026).
       *
       * VOR jeder anderen Prüfung, an genau DER Stelle, die ohnehin JEDEN
       * Anschlag dieser Seite sieht (auch während der Tastatur-Hinweis offen
       * ist und den Fokus hält) - kein zweiter Horcher. Ein `event.code` einer
       * ECHTEN Tastatur beantwortet die Frage endgültig: Das Gerät hat eine,
       * gleichgültig ob gerade Alt-Kürzel, Escape oder ein gewöhnliches
       * Zeichen kam. Der Ref latcht, damit ab dem ersten Beweis kein weiterer
       * Anschlag mehr etwas nachprüft oder in den Speicher schreibt.
       */
      if (!echterTastendruckRef.current && istEchteTastatureingabe(e)) {
        echterTastendruckRef.current = true;
        if (!tastaturHinweisGesehen()) merkeTastaturHinweisGesehen();
        setTastaturHinweisOffen(false);
      }
      // ★★ EINE REGEL FÜR ALLES (Johannes 14.08.2026): Escape schließt JEDES
      // offene Fenster — Statistik, Tastenkürzel, Hilfe, Einstellungen,
      // Lektionsliste, Anmeldung, Einführungs-Karte — und der Fokus steht
      // danach IMMER in der Eingabezeile. Auch wenn gar nichts offen war, holt
      // Escape den Fokus zurück ins Feld. Vorher schloss Escape nur das
      // OBERSTE der drei Fenster, die diese Seite kannte, und gab den Fokus nur
      // bei der Hilfe zurück — wer aus der Statistik kam, musste sich erst
      // wieder ins Feld tabben.
      //
      // Fenster, die ihren eigenen Ausweg mitbringen, bleiben unangetastet und
      // schließen wie gehabt selbst (sie leiten den Fokus über
      // `focusPracticeField` zurück): der Passwort-Dialog (`Modal` fängt
      // Escape im Capture ab), die Expeditions-Bühne, die Feier-Karte, die
      // Einrichtung — und „Tasten erkunden", wo einmal Escape bewusst der
      // Lernstoff ist (dort schließt erst der zweite Druck).
      if (e.key === "Escape") {
        zurueckRef.current();
        return;
      }
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      // Tippfeld vergrößern/verkleinern: „+"/„−" zuerst über e.key (klappt unter
      // Windows). Am Mac erzeugt die Wahltaste (Option) bei „+"/„−" ein anderes
      // Zeichen, sodass e.key NICHT mehr "+"/"−" ist — darum unten zusätzlich die
      // PHYSISCHEN e.code der QWERTZ-Tasten (BracketRight = „+", Slash = „−").
      // ★ Vor der Änderung merken, wo das Kind steht - danach hält
      // `useLayoutEffect` die Stelle (§6.2).
      // ★ 29.10.2026: In „Meine Statistik" gehört Alt + Plus / Minus / 0 der
      // STATISTIK (eigene Stufe, `useStatistikSchriftTasten` - der Horcher
      // lebt, solange sie offen ist). Die Übungszeile ist dort nicht zu
      // sehen; sie hier nebenbei zu verstellen hieße, dass das Kind beim
      // Zurückkehren eine andere Zeilengröße vorfindet, als es hatte.
      const inStatistik = pupilViewRef.current === "statistik";
      if (inStatistik && (zoomKeyDirection(e) || istNormalgroesseTaste(e))) return;
      if (e.key === "+") {
        e.preventDefault();
        merken();
        zoomIn();
        return;
      }
      if (e.key === "-") {
        e.preventDefault();
        merken();
        zoomOut();
        return;
      }
      // ★ 18.10.2026 (Kürzel einheitlich, `UNIVERSAL_SHORTCUTS`): Alt + 0 holt das
      // Tippfeld in die normale Größe zurück - wie Plus und Minus darüber VOR der
      // Formularfeld-Sperre, über `e.code` (am Mac liefert Wahl + 0 ein „º").
      if (istNormalgroesseTaste(e)) {
        e.preventDefault();
        merken();
        resetZoom();
        return;
      }
      // Alt+O (Optionen) steht VOR der Formularfeld-Sperre unten: Wer den
      // Einstellungsbereich aufgeklappt hat, steht mit dem Fokus in einem
      // Auswahlfeld — er muss ihn von dort aus auch wieder zuklappen können.
      if (e.code === "KeyO") {
        e.preventDefault();
        toggleSettings();
        return;
      }
      // Buchstaben-Kürzel dürfen echte Formularfelder (Anmeldung, Lehrkraft-
      // Verwaltung, Auswahlfelder) nicht kapern — sonst frisst der Handler
      // Tastendrücke, noch bevor NVDA/JAWS sie als Eingabe erkennen (NVDA-Test
      // 2026-07-01, wie bei Punktgenau/im Griff). NUR das Tippfeld selbst ist
      // bewusst ausgenommen (data-typing-field="practice" in TypingSession.tsx):
      // Alt-Kombis zählen dort nie als Anschlag, die Kürzel sollen WÄHREND des
      // Tippens weiter funktionieren.
      // ★ 12.09.2026: Ebenso das Feld von „Tasten erkunden" - es trägt
      // `data-kuerzel="an"`, denselben Freischein, den die gemeinsame
      // Kopfzeile schon kennt (AppKopfzeile.tsx, `laesstDurch`).
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const inForm =
        (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") &&
        target?.dataset.typingField !== "practice" &&
        target?.dataset.kuerzel !== "an";
      if (inForm) return;

      /*
        ★★ 18.10.2026 (Johannes: „Alt + Z = wo bin ich; Alt + Y nicht mehr
        mitwirken lassen"): Alt + Z und Alt + W gelten nach dem AUFGEDRUCKTEN
        Buchstaben, nicht nach der Lage der Taste. `e.code` nennt die Lage auf
        einer US-Tastatur: Auf QWERTZ (de, ch) trägt `KeyY` das Z, auf AZERTY
        (fr, be) trägt `KeyW` das Z und `KeyZ` das W. Bis heute fing die Seite
        `KeyY` UND `KeyZ` ab - damit sagte auf QWERTZ auch das Y die Zeile an,
        und auf AZERTY sprang die W-Taste in die Zeilen-Ansage.

        Tastenflow kennt die eingestellte Tastatur (`activeLayout`, dieselbe,
        die die Bildschirmtastatur zeigt) - der Buchstabe kommt darum aus
        deren Daten (`tasteFuerCode`). Nur für eine Taste, die dort nicht
        steht, fragt `istAltBuchstabe` (lib/altTaste.ts) den Browser.

        ⚠️ W wandert mit: Auf AZERTY läge Alt + W sonst auf derselben Taste
        wie Alt + Z (`KeyW`), und die Aufgaben-Ansage wäre verloren. Auf
        QWERTZ und QWERTY ändert sich für W nichts.
      */
      const gedruckt = tasteFuerCode(activeLayout(), e.code)?.toLowerCase() ?? null;
      const aufdruck = (b: string) =>
        gedruckt !== null && /^[a-z]$/.test(gedruckt) ? gedruckt === b : istAltBuchstabe(e, b);
      if (aufdruck("z")) {
        // „Zeile X von Y" ansagen.
        e.preventDefault();
        window.dispatchEvent(new Event("tippen-announce-progress"));
        return;
      }
      if (aufdruck("w")) {
        // Aktuelle Aufgabe erneut ansagen (wie Alt+W bei Punktgenau).
        e.preventDefault();
        window.dispatchEvent(new Event("tippen-announce-task"));
        return;
      }

      switch (e.code) {
        case "KeyB":
          // ÜBUNGSART reihum: Mein Training → Geschichten → Wortspiele
          // (22.08.2026; „Lektionen" ist seit E7, 19.09.2026, entfallen).
          // ★ Warum B und nicht A („Art"): Alt + A heißt in Punktgenau und
          // Klangpunkte „Zur Anmeldung springen". Gleiche Taste, andere
          // Wirkung — genau die Divergenz, die src/lib/shortcuts.ts verhindern
          // soll. B wie „Bereich": in welchem der drei Bereiche geübt wird.
          e.preventDefault();
          uebungsartWeiterRef.current();
          break;
        case "KeyH":
          // ★ Nr 15 der Fokusziele (22.08.2026): Alt + H schließt jetzt so,
          // wie Escape schließt - in die Eingabezeile. Bisher rief das Kürzel
          // nur `setShowHelp(v => !v)`: Der Schließen-Knopf, auf dem der Fokus
          // stand, verschwand, und niemand setzte ein Ziel.
          e.preventDefault();
          if (showHelpRef.current) closeHelp();
          else setShowHelp(true);
          break;
        case "KeyE":
          e.preventDefault();
          zeileNeuAnsteuern();
          break;
        case "KeyV": {
          e.preventDefault();
          vorlesenUmschaltenRef.current();
          break;
        }
        case "Digit6":
        case "Numpad6": {
          // ★ 15.10.2026: Melodie beim Tippen an/aus - derselbe Weg wie der
          //   Schalter im Zahnrad (`melodieUmschalten`). Das kurze Motiv dort
          //   bestätigt hörbar, die Ansage nur bei Vorlesen an.
          e.preventDefault();
          const an = melodieUmschalten();
          sprichBedienung(ansage(an ? "melodieAn" : "melodieAus", bedienLang()));
          break;
        }
        case "Digit7":
        case "Numpad7":
        case "Digit8":
        case "Numpad8": {
          // ★ 16.10.2026: Klang der Melodie zurück (7) / vor (8). Die
          //   Hörprobe bestätigt hörbar, der Name kommt bei Vorlesen an.
          e.preventDefault();
          const klang = klangWechseln(e.code.endsWith("7") ? -1 : 1);
          sprichBedienung(klangName(klang, bedienLang() ?? vorleseSprache()));
          break;
        }
        case "KeyU":
          if (isPupil || isTeacher) {
            e.preventDefault();
            if (isPupil) setPupilView("ueben");
            focusPracticeField();
          }
          break;
        case "KeyS":
          if (isPupil || isTeacher) {
            e.preventDefault();
            // ★ UMSCHALTEN (Johannes 10.08.): Alt + S öffnet die Statistik und
            //   schließt sie auch wieder — sonst sucht man den Schalter.
            //   Beide Richtungen gehen jetzt über dieselben zwei Wege wie der
            //   Punkt im Konto-Menü und „Statistik schließen" (Nr 2): hin auf
            //   die Überschrift, zurück ins Tippfeld.
            if (isPupil) {
              if (pupilViewRef.current === "statistik") schliesseStatistik();
              else oeffneStatistik();
            }
            // Lehrkraft: „Meine Klassen" ist seit 03.08. ein eigener Bereich für
            // alle vier Lernprogramme (MK-E5), keine Ansicht dieser App mehr.
            else navigate(meineKlasseHref("tippen"));
          }
          break;
        // Alt + W und Alt + Z: oben, nach dem Aufdruck (18.10.2026). Hier fingen
        // bis dahin die Fälle KeyY UND KeyZ die Zeilen-Ansage ab („QWERTZ:
        // Z-Taste = e.code KeyY, beide abfangen") - damit wirkte auch das Y.
        case "KeyD":
          // Übezeit (D = Dauer) auf Braillezeile + ansagen.
          e.preventDefault();
          window.dispatchEvent(new Event("tippen-announce-time"));
          break;
        case "KeyT":
          // Tastenkürzel-Liste öffnen / schließen. ★ Nr 15: dasselbe wie bei
          // Alt + H - beim Schließen ins Tippfeld, statt das ✕ unter dem
          // Fokus verschwinden zu lassen.
          e.preventDefault();
          if (showShortcutsRef.current) schliesseKurztasten();
          else setShowShortcuts(true);
          break;
        case "KeyR":
          // Einrichtung neu starten (Alt+R wie bei »im Griff«). Sie ersetzt den
          // Trainer, darum keine Umschaltung: einmal gestartet, führt sie bis
          // zum Ende oder bis „überspringen".
          e.preventDefault();
          setEinrichtung(true);
          break;
        case "KeyG":
          // ★ 30.08.2026: Zur nächsten Überschrift springen und vorlesen
          //   (G wie Gliederung) - der Überschriften-Sprung der Vorlese-
          //   Stimme, zyklisch. Siehe lib/typing/ueberschriften.ts.
          e.preventDefault();
          ueberschriftSpringen();
          break;
        case "Digit3":
        case "Numpad3":
          // „Tasten erkunden" auf/zu (30.08.2026: von Alt + K hierher gezogen).
          // Alt + 3 war schon vorher der Ausgang - der Modus selbst fängt
          // genau diese Kombi ab (`TastenErkunden.tsx`, `Digit3`/`Numpad3`).
          // Jetzt ist es auch der Eingang: rein und raus auf derselben Taste.
          // Weitere Auswege: „Beenden" und zweimal Esc.
          e.preventDefault();
          setErkundenModus((m) => (m ? null : "erkunden"));
          break;
        case "Digit2":
        case "Numpad2":
          // ★ 13.11.2026: „Gezielt üben" - Dialog „Tasten wählen" öffnen. (Alt + A und Alt + Q sind plattformweit
          // vergeben - `lib/shortcuts.ts` -, alle Buchstaben in Tastenflow ebenso; die 2 war die erste freie Zahl.)
          // Bei einem Kind einer Klasse sagt die Taste die Tasten der Lehrkraft an.
          e.preventDefault();
          gezRef.current.kuerzel();
          break;
        case "Digit4":
        case "Numpad4":
          // ★ 13.09.2026: dasselbe Fenster, direkt im Modus „Tasten finden"
          // (Johannes: „einen [schalter] mit Tasten finden"). Ist es offen,
          // fängt der Baustein Alt + 4 selbst ab und wechselt den Modus.
          e.preventDefault();
          setErkundenModus((m) => m ?? "finden");
          break;
        case "KeyL":
          // Spielstufe (XP-Level) anzeigen — Trainer antwortet mit announce-level.
          e.preventDefault();
          window.dispatchEvent(new Event("tippen-request-level"));
          break;
        case "KeyM":
          /*
            ★★★ ALT + M: ein Klassenmatch ausschreiben (11.09.2026, F1).

            ⚠️ Nur, wenn es das Match hier überhaupt gibt - also bei einem Kind
            einer Klasse, deren Lehrkraft es erlaubt hat. Sonst bleibt die Taste
            UNBEHANDELT und tut nichts - dieselbe Regel wie bei Alt + S und
            Alt + N („wenn angemeldet"): Ein Kürzel, das stillschweigend nichts
            tut, gibt es in diesem Programm nicht (R-A3), und darum steht der
            Zusatz auch in der Kürzel-Liste und in der Hilfe.

            ★★ UND GENAU DARUM ANTWORTET SIE, wenn es das Match zwar gibt, aber
            gerade nicht geht (11.09.2026, §2.6): Das eigene Match läuft, oder
            in der Klasse laufen schon zwei. Dann sagt Alt + M denselben Satz,
            den der Schalter in der Stand-Zeile trägt - über `speakUi` wie
            Alt + S („Meine Statistik"), NICHT über eine Live-Region: Die ist
            beim Tippen verboten, weil sie die Braillezeile vier Sekunden lang
            verdrängt ([[reference_live_region_ist_braille_blitzmeldung]]). Auf
            der Zeile steht der Grund ohnehin - in der Beschriftung des
            Schalters, sobald der Fokus ihn erreicht.

            M wie Match. Gemessen am 11.09.2026 war es der letzte freie
            Buchstabe der App (belegt: O J B H E V W Y/Z D 3 K G R T L N U S X
            und plattformweit A F C Q I P).
          */
          if (matchRef.current.erlaubt) {
            e.preventDefault();
            matchRef.current.einladen();
          } else if (matchRef.current.hinweis) {
            e.preventDefault();
            // ★ EN1: Der Hinweis steht schon in der Bedienungssprache
            // (`useKlassenmatch`) - also auch mit ihrer Stimme.
            sprichBedienung(matchHinweisSatz(matchRef.current.hinweis));
          }
          break;
        case "Equal":
        case "NumpadAdd":
        case "BracketRight": // QWERTZ-„+"-Taste (Mac: Option+„+" liefert kein e.key "+")
          e.preventDefault();
          merken();
          zoomIn();
          break;
        case "Minus":
        case "NumpadSubtract":
        case "Slash": // QWERTZ-„−"-Taste (Mac: Option+„−" liefert kein e.key "−")
          e.preventDefault();
          merken();
          zoomOut();
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomIn, zoomOut, resetZoom, merken, setVoice, isPupil, isTeacher]);

  /**
   * ★ Nr 5 der Fokusziele (22.08.2026): **Die Anmeldung endet nicht im Nichts.**
   *
   * Bis dahin sperrte sich der Abschick-Knopf im Augenblick des Absendens
   * selbst (`disabled`, siehe R5), und sobald die Antwort da war, verschwand
   * die ganze Anmelde-Karte: Der Fokus lag auf `body`, gesagt wurde nichts,
   * und wer mit Braillezeile arbeitet, hatte keinen Anhaltspunkt, ob es
   * geklappt hat. Jetzt sagt die Seite den Namen an und holt den Fokus in die
   * Eingabezeile - dorthin, wo es weitergeht.
   *
   * Der Ref merkt sich beim ersten Rendern, wer schon angemeldet WAR: Wer die
   * Seite mit bestehendem Konto öffnet, hat sich gerade nicht angemeldet und
   * bekommt darum keine Ansage.
   */
  const zuletztAngemeldet = useRef<string | null>(account?.id ?? null);
  useEffect(() => {
    const vorher = zuletztAngemeldet.current;
    zuletztAngemeldet.current = account?.id ?? null;
    if (!account || vorher === account.id) return;
    sprichBedienung(ansageAngemeldet(account.name, bedienLang()));
    focusPracticeField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id]);

  // stufeFuer statt `account.stufe`: Ist keine Stufe ausdrücklich gewählt,
  // entscheidet das Geburtsjahr (und wächst mit), sonst die Vorgabe (teens).
  const stufe: Stufe = isPupil
    ? stufeFuer(account)
    : stufeFuer({ stufe: localStufe, geburtsjahr: localGeburtsjahr });
  const changeStufe = (s: Stufe) => {
    if (isPupil && account) {
      void typingBackend()
        .setStufe(account.id, s)
        .then((a) => {
          if (a) update(a);
        });
    } else {
      setLocalStufe(s);
    }
  };
  /**
   * Das Geburtsjahr darf setzen, wer keine Lehrkraft über sich hat — dieselbe
   * Regel wie bei „Zeit lassen" und „Womit anfangen?" (Kinder einer Klasse
   * bekommen es von ihrer Lehrkraft in „Meine Klassen"; der Server-Guard
   * tt_pupils_field_guard erzwingt das). Fehlt das Recht, blenden die
   * Oberflächen das Feld aus. Gäste und Lehrkräfte stellen nur ihre eigene
   * Vorschau ein — bei ihnen wirkt es (wie die Stufe selbst) rein lokal.
   *
   * ★ Diese Fassung war von den dreien die einzig richtige; seit dem 04.09.
   * teilen sich alle drei denselben Ausdruck (`istKlassenkind`, oben).
   */
  const darfGeburtsjahrSelbst = !istKlassenkind;
  /**
   * ★★★ B11 (11.09.2026): Und aus demselben Grund darf ein Kind einer Klasse
   * die TEXTSTUFE nicht mehr selbst wählen. Sie kommt seit dem Umbau aus der
   * Schulstufe der Klasse (`klassenEinstellungen.ts`, aufgelegt in
   * `useTypingAuth`); ein Feld, das man verstellen kann und das beim nächsten
   * Start wieder auf dem Wert der Klasse steht, wäre ein Schalter ohne Wirkung
   * - genau die Sorte, die der Vollaudit vom 30.08. gesucht hat.
   */
  const darfTextstufeSelbst = !istKlassenkind;
  const geburtsjahr = isPupil ? account?.geburtsjahr : localGeburtsjahr;
  const changeGeburtsjahr = (jahr: number | undefined) => {
    if (isPupil && account) {
      void typingBackend()
        .setGeburtsjahr(account.id, jahr)
        .then((a) => {
          if (a) update(a);
        });
      return;
    }
    setLocalGeburtsjahr(jahr);
    // Ein Jahr soll wirken: die vorher von Hand gewählte Stufe tritt zurück
    // (sonst bliebe sie nach dem Vorrangmodell vorrangig).
    if (jahr !== undefined) setLocalStufe(undefined);
  };

  // Welche Einführungs-Folge angeboten wird: normalerweise die zur Textstufe.
  // Eine Lehrkraft bekommt die Erwachsenen-Folge, auch wenn im Zahnrad gerade
  // eine Kinder-Textstufe steht — die Textstufe beschreibt dort die Texte fürs
  // Vorführen, nicht die Person, die zuhört.
  const introStufe: Stufe = isTeacher ? "erwachsen" : stufe;

  // ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M2/S8): Die Übungssprache gilt
  // nur, wenn sie zum Weg passt - auf Weg „fr"/„es" ist sie an den Weg
  // gebunden, auf Weg „de"/„en" bleibt Deutsch/Englisch frei wie bisher
  // (`uebungsSpracheImWeg`, account.ts). Gespeichert wird hier nichts: Ein
  // Konto auf Weg „fr" mit `lang: "de"` übt Französisch, sein Datensatz bleibt.
  const lang: Lang = uebungsSpracheImWeg(isPupil ? (account?.lang ?? "de") : localLang, lernweg);
  /*
    ★★★ DIE SPRACHPAKETE DIESES WEGES (28.09.2026, Johannes: „nur die sprache
    vom kind laden! und englische texte kommen immer mit"). Welche es sind,
    steht an EINER Stelle (`sprachPaketeFuer`). Geladen wird sofort - auch
    während Anmeldung oder Einrichtung noch offen sind -, damit das Tor vor
    der Übung (`SprachpaketTor` unten) meist gar nicht warten muss. Ändert
    sich der Weg (Einrichtung, Lehrkraft, anderes Konto, `/es` …) oder die
    Übungssprache, kommt das neue Paket von selbst.
  */
  const paketBedarf = useMemo(() => sprachPaketeFuer(lernweg, lang), [lernweg, lang]);
  useEffect(() => {
    void ladeSprachpakete(paketBedarf).catch(() => {
      /* Das Tor zeigt den Fehler, wenn es so weit ist. */
    });
  }, [paketBedarf]);
  // ★ DIE VORLESE-SPRACHE FOLGT DER INHALTSSPRACHE (29.08.2026, Rückmeldung
  // Jens). Genau EINE Stelle setzt sie; alle Ansagen holen sie sich von dort
  // (`vorlesen.ts`). Sie steht bewusst hier und nicht in `changeLang`: Beim
  // Anmelden kommt die Sprache aus dem KONTO, ohne dass jemand umschaltet -
  // sonst spräche die App für ein englisches Kind nach jedem Neuladen deutsch.
  useEffect(() => {
    setVorleseSprache(lang);
  }, [lang]);
  /**
   * Die Übungssprache umstellen - aus dem Zahnrad, der Einrichtung und (seit
   * 19.09.2026) vom Sprachschalter in der Kopfzeile.
   * @param vomSprachschalter Der Schalter meint die BEDIENUNG; die Anleitung
   *   „englische Stimme installieren" kommt dann nur, wenn Vorlesen an ist -
   *   wer ohne Ton übt (der Normalfall), bekäme sonst ein Fenster, das mit
   *   seinem Tastendruck nichts zu tun hat.
   */
  const changeLang = (l: Lang, vomSprachschalter = false) => {
    if (isPupil && account) {
      void typingBackend()
        .setLang(account.id, l)
        .then((a) => {
          if (a) update(a);
        });
    } else {
      setLocalLang(l);
    }
    // Vorlese-Stimme automatisch zur Inhaltssprache umschalten (geräte-lokal):
    // Englisch/Französisch → erste installierte Stimme dieser Sprache;
    // Deutsch → automatisch (de).
    // ★ E11a-4 (26.09.2026): auf „fr" geweitet - vorher fiel eine
    // Übungssprache „fr" hier still auf „automatisch (deutsch)" zurück
    // (derselbe Fehler, den `VoiceInstallHelp` seit EN1 für Englisch löst).
    // ★ ES-O (27.09.2026): und „es" - sonst las eine deutsche Stimme den
    // spanischen Übungstext („automatisch (deutsch)" unten).
    // ★ G2b-2 (02.10.2026): jede Sprache ausser Deutsch - nicht mehr die Aufzählung
    // en/fr/es. Vorher las eine DEUTSCHE Stimme italienischen, polnischen, türkischen
    // und tschechischen Text, ohne Hinweis „Stimme installieren". `firstVoiceURIForLang`
    // und `VORZUGS_STIMMEN[sprache] ?? []` (voice.ts) sind sprachoffen.
    if (l !== "de") {
      const uri = firstVoiceURIForLang(l);
      if (uri) {
        setVoiceURI(uri);
      } else if (
        availableVoices().length > 0 &&
        (!vomSprachschalter || useVoice.getState().enabled)
      ) {
        // Stimmen da, aber keine passende → Anleitung zum Installieren zeigen.
        setShowVoiceInstall(true);
      }
    } else {
      setVoiceURI(""); // zurück auf „automatisch (deutsch)"
    }
  };
  /*
    ★★ W2b Punkt 5 = S6 (Windows-Befund §3.5, 28.09.2026): Der Hinweis „keine
    Stimme installiert" kam nur, wenn das Vorlesen VOR dem Sprachwechsel an
    war (oben, `changeLang`). Wird es erst DANACH eingeschaltet - Einrichtung
    Schritt „Ton", Zahnrad, Vorlese-Knopf -, schaut jetzt derselbe Blick nach
    (`stimmeBeimEinschalten`, rein in `lib/typing/stimmHinweis.ts`): passende
    Stimme ⇒ gewählt, keine ⇒ die Anleitung. Nur beim Übergang aus ⇒ an.
  */
  const vorlesenVorher = useRef(vorlesenAn);
  useEffect(() => {
    const warAn = vorlesenVorher.current;
    vorlesenVorher.current = vorlesenAn;
    const { voiceURI } = useVoice.getState();
    const stimmen = availableVoices();
    const folge = stimmeBeimEinschalten({
      warAn,
      istAn: vorlesenAn,
      lang,
      gewaehlt: voiceURI,
      gewaehltSprache: stimmen.find((v) => v.voiceURI === voiceURI)?.lang ?? null,
      stimmeFuerSprache: lang === "de" ? null : firstVoiceURIForLang(lang),
      stimmenDa: stimmen.length > 0,
    });
    // ★ NVDA-Lauf 31.10.2026: ohne Abbruch - das „Vorlesen an" spricht in diesem Augenblick schon.
    if (folge?.art === "stimme") setVoiceURI(folge.uri, { ohneAbbruch: true });
    else if (folge?.art === "hinweis") setShowVoiceInstall(true);
    // Nur am Schalter des Vorlesens - ein Sprachwechsel läuft über `changeLang`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vorlesenAn]);
  /*
    ★★★ DER SPRACHSCHALTER ZIEHT DIE ÜBUNGSSPRACHE MIT (Johannes 19.09.2026):
    *„die Eingabesprache wird automatisch an die Oberflächensprache angepasst,
    kann aber nachträglich wieder geändert werden, z. B.: wer englische
    Oberfläche einstellt, hat automatisch sofort englische Texte, kann aber
    auch auf deutsche Texte einstellen"*.

    · NUR der Druck auf den Schalter (`useBeimSprachSchalter`) - nicht die
      Erkennung beim ersten Besuch: Die setzt nur die Vorgabe (`localLang`
      oben) und überschreibt nie die Übungssprache eines Kontos.
    · Derselbe Weg wie im Zahnrad (`changeLang`): beim Kind `setLang` mit der
      unveränderten `teacherUid` (`selfPupilFields` in `pbBackend.ts`), ohne
      Kinderkonto `localLang`.
    · ⚠️ Hat die Lehrkraft die Sprache GESPERRT (`langLocked`), bleibt die
      Übungssprache - nur die Bedienung wechselt. Der Server setzt sie in dem
      Fall ohnehin zurück (`tt_pupils_field_guard.pb.js`); gar nicht erst
      schreiben erspart dem Kind eine Übungssprache, die kurz springt.
    · Danach lässt sie sich im Zahnrad wieder unabhängig umstellen.
  */
  useBeimSprachSchalter((neu) => {
    if (isPupil && account?.langLocked) return;
    // ★ ES-M2 (Prüfbericht ES-P2 S8): Der Schalter zieht die Übungssprache
    // nur mit, wenn sie auf diesem Weg geübt werden kann. Auf Weg „es" macht
    // „DE" die Bedienung deutsch, die Texte bleiben spanisch; auf Weg „de"
    // macht „Español" keine spanischen Texte auf der deutschen Reihenfolge.
    if (!uebungsSprachenImWeg(lernweg).includes(neu)) return;
    // ★ D1 Nr. 18 (28.09.2026): Auf einem Weg mit Hauptsprache (fr/es) zieht
    // der Schalter die Übungssprache NIE mit - Englisch ist dort ein Zusatz,
    // den das Kind (oder die Lehrkraft) ausdrücklich im Zahnrad wählt; wer
    // auf Weg „fr" die Bedienung auf „EN" stellt, übt weiter Französisch, und
    // wer englisch übt, bleibt beim Zurückschalten auf „FR" dabei.
    if (hauptspracheDesWeges(lernweg)) return;
    if (neu !== lang) changeLang(neu, true);
  });

  const showTrainer =
    !authVisible &&
    !einrichtung &&
    !(isPupil && pupilView === "statistik");
  /**
   * ★ 30.08.2026 (Johannes): Das Zahnrad gibt es AUCH in der Statistik -
   * vorher war es dort ausgeblendet, und wer beim Anschauen der Abzeichen
   * das Vorlesen oder die Stimme umstellen wollte, musste erst zurück.
   * Die Gruppe „Was übst du?" fehlt dort weiterhin (sie würde unsichtbar
   * die Übungsart wechseln) - das regelt TypingSettings von selbst, wenn
   * `mode`/`onModeChange` fehlen.
   */
  const istStatistik = isPupil && pupilView === "statistik" && !!account;

  // Der Name der Übungsart steht seit 25.08.2026 in der Kopfzeile („Tastenflow
  // · Mein Training"). Bis dahin trug ihn die Karte über dem Übungsfeld - die
  // ist weg, der Name blieb nötig: Alt + B wechselt reihum, und man muss sehen
  // können, wo man gelandet ist. Beim Anmelden, in der Einrichtung und in der
  // Statistik steht dort nichts - da wird nicht geübt.
  const bereich = schreibprobeDran
    ? // ★ Die Schreibprobe steht in der KOPFZEILE, nicht nur auf dem Blatt
      // (09.09.2026). Johannes: „Die schüler dieser Klasse sehen eine andere
      // Farbe und Markierung »Prüfung«." Ein Kind mit Braillezeile liest die
      // Kopfzeile als Fokuskontext - dort muss das Wort stehen, sonst erfährt
      // es nur über die Farbe, dass gerade etwas anderes gilt.
      pruefungWort(sprache)
    : eigeneUebungDran
      ? // Dieselbe Überlegung wie bei der Schreibprobe - ein Kind mit
        // Braillezeile liest den Fokuskontext, nicht nur das Blatt.
        // ★ EN1: aus Sicht des Kindes („Exercise from your teacher").
        eigeneUebungName(sprache)
      : !showTrainer
        ? undefined
        : mode === "buecherei"
          ? T.bereichBuecherei
          : mode === "wortspiele"
            ? T.bereichWortspiele
            : // E7 (19.09.2026): "adaptiv" UND jeder alte, nicht mehr gültige
              // Wert ("lektionen") - derselbe sichere Regelfall wie in der
              // Render-Weiche weiter unten.
              T.bereichAdaptiv;
  // Der Tastatur-Handler hängt nicht an diesem Wert (er wird nur einmal
  // angemeldet) — darum bei jedem Rendern frisch belegen.
  // Alt + O kennt dieselbe Grenze wie das Zahnrad: Üben ODER Statistik.
  uebtGeradeRef.current = showTrainer || istStatistik;


  /*
   * ★ Datei-Ausweis für geschützte Inhalte (Befund 23.08.2026): Das Handbuch
   * liegt hinter `/handbuecher/...` und verlangt das HttpOnly-Cookie
   * `sensorik_inhalt`. Die LMS-Hülle (`Layout.tsx`) holt es zentral - die
   * eigenständige Tastenflow-Seite (auch tastenflow.org) muss es selbst tun,
   * sonst antwortet der Download für angemeldete Lehrkräfte mit 404.
   * Gleicher Takt wie dort: sofort nach der Anmeldung, dann alle 10 Minuten
   * (Cookie hält 20).
   */
  useEffect(() => {
    if (!account) return;
    const b = typingBackend();
    void b.inhaltsAusweisSichern();
    const timer = window.setInterval(
      () => void b.inhaltsAusweisSichern(),
      10 * 60 * 1000,
    );
    return () => window.clearInterval(timer);
  }, [account]);

  // Fortschritt/Telemetrie: mit Konto über den Server (von jedem Gerät), ohne
  // Konto nur lokal auf diesem Gerät. Alle Aufrufe sind asynchron.
  /*
   * ════════════════════════════════════════════════════════════════════════
   * ★★★ VORKENNTNISSE: hier wird der Startpunkt der Lehrkraft WIRKSAM
   * ════════════════════════════════════════════════════════════════════════
   * Testerin, 01.09.2026: *„Klassiker bei uns ist, dass Schüler zwar die
   * Buchstaben können, aber nicht die Ziffern. Das hätte ich gern zum
   * Auswählen."*
   *
   * Die Lehrkraft trägt den Startpunkt am KONTO ein (`startUnits`), nicht im
   * Fortschritt. Sie kann ihn dort auch gar nicht eintragen: Die Server-Regel
   * `lw_progress.update` lässt ausschliesslich das Kind selbst schreiben - und
   * daran wird nicht gerüttelt, das ist die Grenze, die den Lernstand schützt.
   * Angewandt wird der Wunsch deshalb GENAU HIER, beim Laden durch das Kind.
   *
   * ★ Die AUTOMATIK nimmt nur dazu: Steht das Kind schon weiter, passiert
   *   nichts. Eine Lehrkraft kann sich hier nicht zum Schaden des Kindes
   *   vertun.
   * ★★★ ZURÜCKSTUFEN GIBT ES SEIT 04.09.2026 (Johannes: *„Lehrer dürfen ihre
   *   Schüler auch downgraden"*, Anlass war Saids zu hoch eingestellter
   *   Startpunkt). Es geschieht aber nur auf einen frischen BESCHLUSS hin und
   *   genau EINMAL - sonst nähme jedes Öffnen dem Kind wieder weg, was es sich
   *   seither erübt hat. Wovon das abhängt, steht bei `startpunktAnwenden`;
   *   der Vermerk darüber liegt im Fortschritt (`startAngewandtAm`).
   * ★ EINE Stelle: Alle drei Trainer holen ihren Fortschritt über dieses
   *   `loadFn`. Die Regel zweimal zu schreiben wäre wieder die Doppelung, die
   *   voneinander nichts weiss ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   * ★ Gäste haben keine Lehrkraft - sie wählen ihren Startpunkt im Zahnrad
   *   selbst, und dieser Zweig fasst sie nicht an.
   */
  const loadFn = account
    ? async () => {
        /*
          ★★★ DAS STARTNIVEAU DER KLASSE (11.09.2026, Nacht). Johannes wählte
          „Startniveau als Vorgabe an der Klasse speichern" - ein Kind, das der
          Klasse beitritt, beginnt dort. Die Regel steht an EINER Stelle
          (`mitKlassenVorrang` → `startpunktMitKlasse`).
          ⚠️ Die Klasse wird HIER abgewartet (`klasseFuer`, mit Merker): Das
          Konto im Speicher bekommt sie erst einen Netzweg später, und der
          Fortschritt ist oft schneller da. Ohne das Warten liefe der Startpunkt
          genau einmal mit dem Wert des Kontos - und die Vorgabe der Klasse
          käme nie an, weil dasselbe Rennen bei jedem Öffnen neu stattfindet.
          Ein Ladefehler der Klasse nimmt nichts weg (`null` ⇒ Konto wie es kam).
          ⚠️ Gewartet wird höchstens `KLASSE_FRIST_MS` (3 s): Eine Anfrage, die
          im Schul-WLAN hängt, ohne zu scheitern, hielte sonst die ganze
          Übungsseite auf (Prüfbefund 11.09.2026 Nacht, nachgestellt).
        */
        const [p, klasse] = await Promise.all([
          typingBackend().getProgress(account.id),
          klasseFuer(account),
        ]);
        // ★ E1 (24.09.2026): der Weg des Kindes - `startUnits` ist eine Anzahl
        // in ihm. Weicht er vom Vorgabewert ab, wandert er als Kopie in den
        // Fortschritt, aus dem die Trainer ihn lesen (siehe oben).
        // Wer schon geübt hat, ohne Weg, ist Bestand und bleibt „de" - das
        // zählt nur mit Probe-Schalter, ohne ihn ist ohnehin jeder auf „de".
        const pWeg = fortschrittsLernweg(p, lernwegProbe && hatSchonGeuebt(p));
        setFortschrittsWeg(pWeg ? { id: account.id, weg: pWeg } : null);
        const weg = bestimmeLernweg({
          gespeichert: gespeicherterWeg(account, pWeg),
          bedienSprache: sprache,
          lehrgangProbeAn: lernwegProbe,
          franzoesischLehrgangProbeAn: franzLernwegProbe,
          spanischLehrgangProbeAn: spanLernwegProbe,
          ...neueProben,
        });
        // ★ W2b (28.09.2026, Weg je Kind): Hat die Lehrkraft den Weg dieses
        // Kindes umgestellt, steht am Konto ein anderer Weg als im Fortschritt.
        // Dann wird der bisherige Stand GEPARKT und der des neuen Weges
        // zurückgeholt oder frisch begonnen - nichts wird gelöscht
        // (`lib/typing/wegWechsel.ts`). Nur mit einem Weg AM KONTO: Einen
        // Gast-Weg stellt niemand um.
        // ★ S1 (28.09.2026): mit dem Startpunkt des KONTOS (ohne Klasse) - er
        // entscheidet, ob der Beschluss zum bisherigen Weg gehört.
        const pMitWeg = istLernweg(account.lernweg)
          ? fortschrittImWeg(p, weg, account)
          : weg === lernwegVon(p)
            ? p
            : { ...p, lernweg: weg };
        // ★ S1: Ein Beschluss, der auf einem anderen Weg gesetzt wurde, gilt
        // hier nicht (`startpunktImWeg`) - erst danach die Vorgabe der Klasse.
        const konto = mitKlassenVorrang(startpunktImWeg(account, pMitWeg), klasse);
        const gewechselt = pMitWeg !== p && wegGewechselt(p, pMitWeg);
        if (gewechselt) setFortschrittsWeg({ id: account.id, weg });
        const erg = startpunktAnwenden(
          pMitWeg.introduced,
          konto.startUnits,
          konto.startUnitsAt,
          { units: pMitWeg.startAngewandt, am: pMitWeg.startAngewandtAm },
          weg,
        );
        if (!erg) {
          // Der Wechsel selbst wird sofort festgeschrieben - sonst stünde am
          // Server bis zur ersten getippten Zeile noch der alte Stand obenauf.
          if (gewechselt) {
            await typingBackend()
              .saveProgress(account.id, pMitWeg)
              .catch(() => undefined);
          }
          return pMitWeg;
        }
        const neu = {
          ...pMitWeg,
          ...(erg.introduced ? { introduced: erg.introduced } : {}),
          startAngewandt: erg.vermerk.units,
          startAngewandtAm: erg.vermerk.am,
        };
        // Sofort festschreiben: Sonst käme die Angleichung bei jedem Laden neu,
        // und ein Kind, das die Seite schliesst, ohne zu tippen, hätte sie nie.
        // Beim Zurückstufen ist es mehr als Bequemlichkeit: Der Vermerk IST das,
        // was es bei einem Mal belässt.
        await typingBackend()
          .saveProgress(account.id, neu)
          .catch(() => undefined);
        return neu;
      }
    : () => {
        // ★ E1: auch für Gäste - der Weg aus dem Gerät, sonst wie oben.
        const p = loadProgress();
        const pWeg = fortschrittsLernweg(p, lernwegProbe && hatSchonGeuebt(p));
        setFortschrittsWeg(pWeg ? { id: "", weg: pWeg } : null);
        const weg = bestimmeLernweg({
          gespeichert: gespeicherterWeg(null, pWeg),
          bedienSprache: sprache,
          lehrgangProbeAn: lernwegProbe,
          franzoesischLehrgangProbeAn: franzLernwegProbe,
          spanischLehrgangProbeAn: spanLernwegProbe,
          ...neueProben,
        });
        return Promise.resolve(weg === lernwegVon(p) ? p : { ...p, lernweg: weg });
      };
  /*
   * ★★★ EIN MISSLUNGENES SPEICHERN DARF NICHT STUMM BLEIBEN (31.08.2026).
   *
   * `saveFn` lief bis dahin ohne `catch` - jeder Aufruf von `persist` in
   * AdaptiveTrainer und SerienTrainer (bis 19.09.2026 auch in `TypingTrainer`,
   * seither entfallen, siehe E7) warf die Zusage weg. Wird der Schreibzugriff
   * abgewiesen oder setzt das Netz aus, übt ein Kind weiter, sieht seine
   * Übezeit-Uhr laufen, seine Sterne kommen - und nichts davon ist am
   * nächsten Tag da. Das ist genau die Fehlerklasse aus §5a des Entwurfs: ein
   * misslungener Zugriff sieht aus wie ein gelungener.
   *
   * ★ WARUM HIER UND NICHT IN DEN TRAINERN SELBST: Sie bekommen `saveFn` von
   * dieser Stelle. Die Behandlung gehört deshalb einmal hierher - mehrere
   * Kopien wären wieder die Doppelung, die voneinander nichts weiß
   * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
   *
   * ★ KEIN FENSTER, KEIN FOKUSWECHSEL: Das Kind tippt gerade. Es bekommt einen
   * sichtbaren Streifen unter der Kopfzeile und eine Ansage - aber die
   * Schreibstelle bleibt, wo sie ist.
   */
  const [speicherFehler, setSpeicherFehler] = useState(false);
  const speicherFehlerRef = useRef(false);
  const verbindungFehlt = useVerbindungFehlt(account?.id ?? "");
  /*
   * ★★★★★ 23.09.2026: DIE ANMELDUNG IST ABGELAUFEN (`useTypingAuth` hat sie
   * beendet). Bis heute blieb das Kind in diesem Fall „angemeldet", jeder
   * Schreibversuch scheiterte, und der Streifen oben bat, der Lehrkraft
   * Bescheid zu geben - obwohl nur eine neue Anmeldung hilft. Jetzt sagt ein
   * Streifen genau das, mit dem Knopf dazu. Der Speicher-Streifen verschwindet:
   * Er beschrieb die Folge, dieser Streifen die Ursache.
   *
   * Wie beim Speicher-Streifen: kein Fenster, kein Fokuswechsel - nur ein
   * `role="alert"` und EINE Ansage beim Übergang (`speakUi`, nie
   * `speakUiAlways` - der Streifen ist selbst eine Live-Meldung).
   */
  const abgelaufenText = abgelaufen === "lehrkraft" ? T.abgelaufenLehrkraft : T.abgelaufenKind;
  useEffect(() => {
    if (!abgelaufen) return;
    speicherFehlerRef.current = false;
    setSpeicherFehler(false);
    sprichBedienung(abgelaufenText);
    // Nur beim Übergang - nicht bei jedem Sprachwechsel noch einmal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abgelaufen]);
  const merkeSpeicherstand = (ok: boolean) => {
    if (speicherFehlerRef.current === !ok) return; // nichts Neues zu melden
    speicherFehlerRef.current = !ok;
    setSpeicherFehler(!ok);
    // Nur den ÜBERGANG ansagen, nicht jede Zeile - sonst redet die Stimme
    // dem Kind bei jedem Anschlag dazwischen.
    // ⚠️ `speakUi`, NICHT `speakUiAlways` - DIESELBE STELLE WIE BEI DER
    //    DOPPELTEN UMSCHALTTASTE (03.09.2026 abends). Der Streifen unten trägt
    //    `role="alert"`, ist also selbst eine Live-Meldung: Ein Screenreader
    //    liest ihn ohnehin vor. Mit `speakUiAlways` sprachen bei „Vorlesen aus"
    //    zwei Stimmen übereinander - genau das, was Johannes am iPad gehört
    //    hat. Gefunden beim Nachsehen, ob es dieselbe Stelle noch einmal gibt.
    if (!ok) sprichBedienung(isTeacher ? T.nichtGespeichertLehrkraft : T.nichtGespeichert);
  };
  /*
    ★★★ E1 (24.09.2026): DER ERSTE FORTSCHRITT LEGT DEN LERNWEG FEST - seit
    der Freigabe (25.09.2026) der Normalfall, nur mit dem Not-Aus
    (`?englisch-lehrgang=0`) unterdrückt. Welcher Weg: der, mit dem der
    Trainer gerade übt (`lernwegVon(p)` - `loadFn` hat ihn eingetragen). Er
    geht ans Konto (einmal schreibbar, am Server erzwungen) bzw. ins Gerät des
    Gastes, und als Kopie in den Fortschritt. Mit dem Not-Aus passiert hier
    nichts.
  */
  const lernwegFestschreiben = (p: Parameters<typeof saveProgress>[0]) => {
    if (!lernwegProbe) return p;
    const schluessel = account?.id ?? "";
    if (lernwegFestRef.current === schluessel) return p;
    // Ein schon gespeicherter Weg gewinnt (auch „Bestand = de", siehe
    // `loadFn`); sonst der, mit dem gerade geübt wird.
    const bekannt = fortschrittsWegRef.current;
    const weg =
      gespeicherterWeg(account, bekannt && bekannt.id === schluessel ? bekannt.weg : null) ??
      lernwegVon(p);
    lernwegFestRef.current = schluessel;
    if (account) {
      if (!istLernweg(account.lernweg)) {
        void Promise.resolve(typingBackend().setLernweg?.(account.id, weg))
          .then((konto) => {
            if (konto) update(konto);
          })
          .catch(() => undefined);
      }
    } else {
      gastLernwegMerken(weg);
    }
    setFortschrittsWeg({ id: schluessel, weg });
    return p.lernweg === weg ? p : { ...p, lernweg: weg };
  };
  /*
    ★★ 27.09.2026 (Befund Netzabbruch §3.1): Der Lernstand wird genau wie
    bisher DIREKT gespeichert; das nächste gelungene Speichern im selben Tab
    holt nach, was fehlte. Was ohne Netz erübt wurde, übersteht darum nur,
    solange der Tab offen bleibt - wie bisher. (Eine Kopie im Gerät wurde nach
    drei Prüfungen verworfen: Sie konnte den neueren Stand am Server und ein
    Zurückstufen der Lehrkraft überschreiben.)
    Neu ist nur, was das Kind SIEHT: Fehlt das Netz WIRKLICH
    (`wirklichOffline`), kommt kein Warnstreifen „sag es deiner Lehrkraft",
    sondern der ruhige Satz unter dem Trainer. Die geübten Zeilen (Übezeit,
    Wochenziel) gehen über die Warteschlange im Gerät ohnehin nicht verloren.
  */
  const [lernstandOhneNetz, setLernstandOhneNetz] = useState(false);
  // Ein anderes Konto hat mit dem vorigen Speichern nichts zu tun (K4).
  useEffect(() => {
    setLernstandOhneNetz(false);
  }, [account?.id]);
  const saveFn = account
    ? (p: Parameters<typeof saveProgress>[0]) =>
        typingBackend()
          .saveProgress(account.id, lernwegFestschreiben(p))
          .then(
            () => {
              setLernstandOhneNetz(false);
              // Der Server ist da - wartende Zeilen nicht länger warten lassen.
              meldeVerbindungGut(account.id);
              merkeSpeicherstand(true);
            },
            (e: unknown) => {
              const offline = wirklichOffline(e);
              setLernstandOhneNetz(offline);
              merkeSpeicherstand(offline);
            },
          )
    : (p: Parameters<typeof saveProgress>[0]) => saveProgress(lernwegFestschreiben(p));
  // ★ 29.08.2026: `onTask` ist jetzt IMMER gesetzt - vorher war es für Gäste
  // `undefined`, und damit wurde ohne Anmeldung nirgends etwas verbucht. Johannes'
  // Entscheidung E8 lautet aber „Gäste zählen mit". Die anonyme Gerätebilanz
  // (topf.ts) bekommt deshalb JEDE Übungszeile; der persönliche Lernstand am
  // Server nur die von Angemeldeten - wie bisher.
  const onTask = (e: {
    lesson: string; chars: number; errors: number; ms: number;
    blurred?: boolean; pasted?: boolean; activeMs?: number; lang?: Lang;
  }) => {
    /*
      ★ Schritt M (19.09.2026): Die Messungen je Zeile für den
      Eigenständigkeits-Check (`zeilenMessung.ts`) werden NUR für Kinder einer
      Klasse gespeichert - sie sind für deren Lehrkraft. Wer ohne Klasse übt
      (Selbstlernende, Lehrkräfte selbst), hat niemanden, für den gemessen
      würde; dort bleiben sie weg (Datensparsamkeit, so steht es auch in der
      Datenschutzerklärung).
    */
    const ereignis = { ts: Date.now(), ...(istKlassenkind ? e : ohneZeilenMessung(e)) };
    topfVerbuchen(ereignis);
    // Einmal am Tag zum Server - `topfSenden` begrenzt sich selbst, der Aufruf
    // je Zeile kostet danach nur ein localStorage-Lesen.
    void topfSenden(stufe, lang);
    if (!account) return;
    // ★★ 27.09.2026: über die Warteschlange im Gerät - ohne Netz geübte Zeilen
    // kommen nach (Befund Netzabbruch §3.2: sie fehlten bis dahin dauerhaft in
    // Übezeit, Wochenziel und Statistik). Nach dem Senden meldet die Schlange
    // `tippen-events-recorded` - die Wochenziel-Kreise laden sofort nach.
    ereignisVormerken(account, ereignis);
  };

  // Übezeit-Uhr beim Laden auf die heute schon gespeicherte Übezeit aufsetzen:
  // Uhr und Wochenziel-Kreise zeigen so auch nach einem Neuladen (oder am
  // zweiten Gerät) dieselbe „heute geübt"-Zeit. Bei Kontowechsel am selben
  // Gerät setzt primePracticeClock die Uhr zurück (keine fremde Übezeit).
  /*
   * ★★ Hier wird AUCH die Pausentoleranz gesetzt (01.09.2026) - und zwar HIER,
   * weil an dieser Stelle die Ereignisse des Kindes ohnehin geladen werden.
   *
   * Bis dahin stand die Toleranz in einem eigenen useEffect daneben
   * (`zeitLassen ? SLOW : NORMAL`). Seit sie aus den Pausen des Kindes
   * gerechnet wird, bräuchte der zweite Effekt dieselben Ereignisse - zwei
   * Stellen, die dieselbe Zahl setzen und einander nicht kennen
   * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Darum eine.
   *
   * ⚠️ OHNE KONTO gibt es keine Geschichte und damit nichts zu rechnen: Gäste
   * bekommen die Vorgabe (bzw. die Obergrenze, wenn sie „Zeit lassen" am Gerät
   * gesetzt haben). Ein Gast ist niemand, dessen Lesetempo wir kennen könnten.
   */
  useEffect(() => {
    if (!account) {
      primePracticeClock("anon", 0);
      setPracticeIdleCap(zeitLassen ? IDLE_CAP_SLOW_MS : IDLE_CAP_MS);
      return;
    }
    let alive = true;
    void typingBackend()
      .getEvents(account.id)
      .then((events) => {
        if (!alive) return;
        primePracticeClock(account.id, todayActiveMs(events, Date.now()));
        setPracticeIdleCap(toleranzFuer(events, zeitLassen));
      });
    return () => {
      alive = false;
    };
  }, [account?.id, zeitLassen]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * ★ SPENDENBANNER (18.09.2026), NUR für Selbstlernende ohne Klasse - ein
   * Kind einer Klasse bekommt ihn NIE (`gehoertEinerKlasse`), eine Lehrkraft
   * sieht ihn in „Meine Klassen" (`TastenflowReiter.tsx`), nicht hier: Sie
   * wird von dieser Seite ja sofort dorthin weitergeleitet.
   */
  const [spendenbannerStunden, setSpendenbannerStunden] = useState<number | null>(null);
  // ★ 21.09.2026: dasselbe für die letzten sechs Monate (Bitte nach einem Jahr).
  const [spendenbannerStundenHalbjahr, setSpendenbannerStundenHalbjahr] = useState<number | null>(null);
  useEffect(() => {
    // ★ Diese Zahl ist NUR für ein selbstlernendes Konto gedacht (der Banner
    // hier ist die Du-Form) - anders als bei den Selbst-Einstellungen weiter
    // unten geht es hier NICHT um „wer gehört einer Klasse an", sondern um
    // die exakt umgekehrte, enge Frage „ist genau das hier der Fall". Ein
    // Gast, ein Kind einer Klasse und eine Lehrkraft bekommen alle `null` -
    // Lehrkräfte sehen ihre eigene (Sie-)Fassung in `TastenflowReiter.tsx`.
    if (!account?.selfManaged) {
      setSpendenbannerStunden(null);
      setSpendenbannerStundenHalbjahr(null);
      return;
    }
    const kontoId = account.id;
    let alive = true;
    void typingBackend()
      .getEvents(kontoId)
      .then((events) => {
        if (!alive) return;
        setSpendenbannerStunden(computePupilStats(events).totalMs / 3_600_000);
        setSpendenbannerStundenHalbjahr(
          computePupilStats(spendenBannerImHalbjahr(events)).totalMs / 3_600_000,
        );
      });
    return () => {
      alive = false;
    };
  }, [account?.id, account?.selfManaged]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * ★★★ DAS WOCHENZIEL-FENSTER (W4, 19.09.2026, Bauplan §„W4 Kind").
   *
   * Ersetzt das Tagesziel-Fenster vom 16.09.2026 (das damals seinerseits das
   * ursprüngliche Wochenziel-Fenster ersetzt hatte): Seit `wochenziel.ts` gibt
   * es keine Einheiten und kein Tageslimit mehr, nur noch Minuten je
   * KALENDERWOCHE (Montag 08:00 bis zum nächsten Montag 08:00) - das Fenster
   * feiert darum wieder das WOCHENZIEL selbst, nicht mehr eine einzelne
   * Tages-Einheit.
   *
   * ★ EINMAL JE ZIEL-WOCHE, OHNE Haken (Merker in `merkfenster.ts`, nach
   *   ISO-Wochenschlüssel statt Kalendertag).
   * ★ NICHT für eine Woche mit Ziel 0 (kein Wochenziel gesetzt, erlassen, vor
   *   `zurueckgesetztAb`) - dieselbe Bedingung wie in `WeeklyGoalRings.tsx`.
   * ★ NUR für angemeldete Lernende - ohne Konto gibt es kein Wochenziel.
   */
  // ★ EN1: nur OB das Fenster offen ist - der Text entsteht beim Zeichnen, in
  // der Sprache, die dann gilt (`wochenzielFenster(skin, sprache)`).
  const [wochenzielOffen, setWochenzielOffen] = useState(false);
  useEffect(() => {
    if (!isPupil || !account) return;
    // ★ EN10-Befund (19.09.2026): erst entscheiden, wenn die Sperrzeiten der
    // Klasse da sind - sonst zählt eine gesperrte Stunde mit, und das Fenster
    // kommt (und bleibt für die Woche gemerkt), obwohl das Ziel offen ist.
    if (!sperrenGeladen) return;
    const jetzt = Date.now();
    const wocheKey = aktuelleWocheKey(jetzt);
    if (wochenzielFensterGezeigt(wocheKey)) return;
    let alive = true;
    void typingBackend()
      .getEvents(account.id)
      .then((events) => {
        if (!alive) return;
        const ziel = kindWochenzielAusFeldern(account);
        const woche = aktuelleWoche(events, ziel, jetzt, gesperrteZeiten);
        // Nichts zu melden: kein Ziel diese Woche, oder noch nicht erreicht.
        if (woche.zielMin <= 0 || woche.rest > 0) return;
        merkeWochenzielFenster(wocheKey);
        setWochenzielOffen(true);
      })
      // Ein misslungener Lesezugriff darf hier NICHTS tun ausser: kein Fenster.
      // Die Meldung darüber macht der Speicher-Streifen, nicht dieses Fenster.
      .catch(() => {});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // ★ `gesperrteZeiten` gehört dazu - sie kommen einen Takt später vom
    // Server, und das Fenster soll denselben Stand prüfen wie der Ring.
  }, [account?.id, isPupil, gesperrteZeiten, sperrenGeladen]);

  /*
   * ★★★ DIE BITTE UM EINE TASTATUR (Auftrag Johannes, 20.09.2026): *„kannst du
   * erkennen ob ein mobiles gerät tastenflow öffnet und eine meldung ausgeben,
   * bitte eine tastatur anschließen, sonst versuchen menschen am
   * touchbildschirm des iPads zu schreiben?"*
   *
   * Erkennung und Wortlaut stehen in `geraeteHinweis.ts`/`merkfensterTexte.ts` -
   * hier nur, WANN sie kommt und WANN sie wieder geht:
   *
   *  • Auf, sobald die Übungsfläche steht (`showTrainer`), auf diesem Gerät
   *    grob/berührend aussieht UND noch nicht gemerkt ist. EINMAL JE GERÄT,
   *    wie die Grossschreibung und die Lesezeile.
   *  • Zu, sobald irgendwo auf der Seite ein Anschlag mit einem echten
   *    `event.code` ankommt - das beantwortet die Frage sicherer als jede
   *    Bildschirm-Vermutung, siehe `echterTastendruckRef` weiter unten
   *    (derselbe Tastatur-Horcher wie die übrigen Kürzel dieser Seite, kein
   *    zweiter).
   *
   * ★ SIE SPERRT NICHTS: Wer keine Tastatur hat, übt sofort weiter - die
   * Übungsfläche steht unverändert dahinter.
   */
  const [tastaturHinweisOffen, setTastaturHinweisOffen] = useState(false);
  useEffect(() => {
    if (!showTrainer) return;
    if (tastaturHinweisGesehen()) return;
    if (!moeglicherweiseOhneTastatur()) return;
    merkeTastaturHinweisGesehen();
    setTastaturHinweisOffen(true);
  }, [showTrainer]);
  /**
   * Nur EINMAL prüfen und schreiben, danach latcht der Ref: Sonst läse und
   * schriebe jeder weitere Anschlag erneut in `localStorage`, ohne dass sich
   * noch etwas ändern könnte.
   */
  const echterTastendruckRef = useRef(false);

  // Resume: beim Öffnen den zuletzt geübten Modus wiederherstellen (falls
  // gespeichert). Ein kurzes Aufblitzen der „adaptiv"-Standardansicht ist
  // hier ein bewusst akzeptierter Kompromiss — loadFn ist asynchron, diese
  // Seite hält keinen eigenen geladenen Fortschritt.
  useEffect(() => {
    let alive = true;
    void loadFn().then((p) => {
      if (!alive) return;
      // ★ E7 (19.09.2026): „lektionen" ist keine gültige Übungsart mehr - ein
      // Altstand mit diesem Wert landet bei „Mein Training", nicht bei einem
      // Knopf, den es nicht mehr gibt (sonst zeigte die Gruppe „Was übst du?"
      // keinen der drei Knöpfe als gedrückt an).
      if (p.lastPlace?.mode) {
        setMode(p.lastPlace.mode === "lektionen" ? "adaptiv" : p.lastPlace.mode);
      }
      // ⚠️ Nicht mehr nur ohne Anmeldung: Auch ein selbstlernendes Konto
      //    braucht den Wert, sonst zeigte das Feld immer den ersten Startpunkt.
      // ★ D-1 (28.09.2026): in der Startpunkt-Zählung, nicht die Länge - wer
      //    Punkt und Komma schon nach ⇧ bekommen hat, ist damit nicht weiter
      //    bei „Alle Buchstaben" (siehe `startpunktStand`).
      if (darfStartpunktSelbst) setStartUnits(startpunktStand(p.introduced, lernwegVon(p)));
      // Die Einrichtung für ein ANGEMELDETES Konto: nur, wenn dort noch nie
      // geübt wurde (frisch angelegt — vor allem die selbstlernenden Konten,
      // die keine Lehrkraft eingerichtet hat). Wer schon Punkte, Runden oder
      // Lektionen hat, wird nicht mehr gefragt.
      if (account && !einrichtungFertig() && !hatSchonGeuebt(p)) {
        setEinrichtung(true);
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id]);

  const handleModeChange = (m: TrainerMode, ausDemFenster = true) => {
    // Wer den Bereich verlässt, legt das Wortspiel zurück ins Regal - sonst
    // stünde es beim nächsten Besuch mitten in einer alten Runde.
    setWortspiel(null);
    setMode(m);
    void loadFn().then((p) => saveFn({ ...p, lastPlace: { ...p.lastPlace, mode: m } }));
    /*
      ★★★ DIE ÜBUNGSART SCHLIESST DAS FENSTER (07.09.2026).

      Sie ist, wie der Quelltext selbst festhält, „die einzige Einstellung, die
      sofort etwas anderes zeigt". Solange die Einstellungen ein Streifen unter
      der Kopfzeile waren, sah man das Ergebnis darunter. Seit sie ein FENSTER
      sind, steht der Dialog davor - wer auf „Geschichten" drückt, bekommt die
      Bücherei zwar, sieht aber weiter die Einstellungen. Der Fokus bliebe
      zudem im Dialog, und die Bücherei setzt ihr eigenes Fokusziel (Nr 9),
      das dann ins Leere ginge.

      ⚠️ Nur HIER, nicht bei jeder Einstellung: Textstufe, Tastatur oder Ton
      ändert man oft mehrere hintereinander - dort wäre ein Fenster, das nach
      jedem Klick zufällt, eine Zumutung.

      ⚠️⚠️ Und nur vom KNOPF IM FENSTER aus. Alt + B schaltet reihum durch alle
      vier Übungsarten (`uebungsartWeiterRef`); fiele dabei das Fenster zu,
      käme man mit dem Kürzel nur einen Schritt weit. Es setzt sein Fokusziel
      ohnehin selbst.
    */
    if (ausDemFenster) schliesseSettings();
  };

  // ★ 17.10.2026 (Johannes): der Schalter „Zurück zu Mein Training" oben in
  // Geschichten und Wortspielen. Dieselbe Ansage und derselbe Fokusweg wie das
  // „Weiter üben" der Abschluss-Karte (`onBackToPractice`) - nur mit festem Ziel.
  const zuMeinTraining = () => {
    sprichBedienung(trainerModeAnsage("adaptiv", bedienLang()));
    handleModeChange("adaptiv", false);
    focusPracticeField();
  };

  // Alt + B: eine Übungsart weiter — und sie ansagen, denn auf dem Bildschirm
  // wechselt zwar die Karte, gehört wird davon ohne Ansage nichts.
  uebungsartWeiterRef.current = () => {
    // Dieselbe Grenze wie bei Alt + O: Wo gerade nicht geübt wird (Statistik,
    // Anmeldung, Einrichtung), gäbe es nur eine Ansage ohne sichtbare Wirkung.
    if (!showTrainer) return;
    // ★ Und während einer SCHREIBPROBE gar nicht (09.09.2026): Die Probe hat
    // den Bildschirm; Alt + B würde die Übungsart im Hintergrund umstellen und
    // dazu „Wortspiele" ansagen - eine Ansage, der nichts entspricht, und das
    // mitten in einer Prüfung. Wer fragt, bekommt stattdessen die Wahrheit.
    if (schreibprobeDranRef.current) {
      const b = bedienRef.current;
      sprichBedienung(SEITEN_TEXTE[b.sprache].uebungsartBleibtProbe(pruefungWort(b.sprache)));
      return;
    }
    // ★ Und während „Eigene Übung" auch nicht (17.09.2026) - dieselbe
    // Überlegung wie bei der Schreibprobe: Alt + B stellte sonst still auf
    // eine andere Übungsart um, während die Klasse eigentlich diesen einen
    // Text schreiben soll.
    if (eigeneUebungDranRef.current) {
      const b = bedienRef.current;
      sprichBedienung(SEITEN_TEXTE[b.sprache].uebungsartBleibtEigene(eigeneUebungName(b.sprache)));
      return;
    }
    const next = naechsteTrainerMode(mode);
    // ★ EN1: der Name des Bereichs in der Bedienungssprache.
    sprichBedienung(trainerModeAnsage(next, bedienLang()));
    handleModeChange(next, false);
    // ★ Nr 27 der Fokusziele (22.08.2026): Beim Kürzel steht der Fokus im
    // Tippfeld, und die ganze Karte darunter wird ausgetauscht - bisher hing
    // die Rückkehr daran, dass das NEUE Feld ihn im nächsten Takt von selbst
    // an sich zieht. Das gilt aber nicht für die Bücherei (die zeigt eine
    // Liste, kein Feld) und nicht, solange ein Dialog offen ist. Darum
    // ausdrücklich - die Bücherei setzt ihr eigenes Ziel (Nr 9) und verbraucht
    // die Anforderung nicht.
    if (next !== "buecherei") focusPracticeField();
  };

  // Einweb-Angebot aus „Mein Training": eine offene Geschichte direkt in der
  // Bücherei fortsetzen. Merkt sich den Slug und schaltet in den Bücherei-Modus.
  const openStoryInBuecherei = (slug: string) => {
    setPendingStorySlug(slug);
    // Merken, von wo aus gelesen wird: Nach der letzten Etappe geht es genau
    // dorthin zurück, damit der Kreislauf „üben → lesen → üben" weiterläuft.
    storyReturnRef.current = mode === "buecherei" ? "adaptiv" : mode;
    handleModeChange("buecherei");
  };

  // Der Startpunkt OHNE Anmeldung: Wer schon tippen kann, soll nicht bei F und J
  // anfangen müssen (Wunsch Johannes 28.07.2026). Bei angemeldeten Lernenden
  // legt ihn die Lehrkraft beim Anlegen fest — dort bleibt er darum weg.
  const startValue = useMemo(() => {
    const pts = startPunkte(sprache, lernweg);
    const cur = startUnits ?? pts[0].units;
    // Der größte Startpunkt, der nicht über dem aktuellen Stand liegt — so zeigt
    // das Feld, wo die Person GERADE steht, nicht nur, was sie einmal gewählt hat.
    return [...pts].reverse().find((s) => s.units <= cur)?.units ?? pts[0].units;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startUnits, layout.id, lernweg]);

  /*
   * ★★★ WER SEINEN STARTPUNKT SELBST SETZT, DARF AUCH ZURÜCK (04.09.2026).
   *
   * Johannes: *„wer sich sein Startlevel einstellen kann, soll es auch wieder
   * weniger hoch stellen können."* Die Zuweisung unten konnte das immer schon -
   * gehalten hat sie trotzdem nicht: Beim nächsten Laden holte die Angleichung
   * den ALTEN Wert vom Konto zurück, und die Person stand wieder oben. Ein
   * Zurückstellen, das genau bis zum Neuladen hält, ist schlimmer als keines.
   *
   * ⇒ Darum wandert die Wahl ZUERST ans Konto (`setStartUnits` schreibt Wert
   *   UND Beschluss-Zeitpunkt), und der Fortschritt merkt sich denselben
   *   Beschluss gleich mit. Danach hat das nächste Laden nichts mehr zu tun.
   *
   * Gäste haben kein Konto - für sie bleibt es bei der Zuweisung im Fortschritt.
   */
  const changeStartUnits = (units: number) => {
    setStartUnits(units);
    void (async () => {
      const konto = account
        ? await typingBackend().setStartUnits(account.id, units)
        : null;
      if (konto) update(konto);
      const p = account ? await typingBackend().getProgress(account.id) : loadProgress();
      // ★ E1: der Weg, in dem `units` gezählt ist, geht mit (nur wenn er vom
      // Vorgabewert abweicht - sonst bleibt der Fortschritt, wie er war).
      await saveFn({
        ...p,
        ...(lernweg === lernwegVon(p) ? {} : { lernweg }),
        introduced: startpunktEinheiten(units, lernweg), // ★ D-1: Startpunkt-Zählung
        startAngewandt: units,
        startAngewandtAm: konto?.startUnitsAt ?? 0,
      });
      // Der Trainer hält den Fortschritt in seinem eigenen Zustand — er muss neu
      // laden, sonst übt die Person in der alten Freischaltung weiter.
      setReloadNonce((n) => n + 1);
    })();
  };

  // Alle Einstellungen (Übungsart, Texte, Tastatur, Ton, Vorlesen) hinter dem
  // Zahnrad in der Kopfzeile.
  const trainerSettings = (
    <TypingSettings
      // In der STATISTIK fehlt die Übungsart-Gruppe: Sie wechselte dort
      // unsichtbar die Übungsart hinter der Auswertung (30.08.2026).
      mode={istStatistik ? undefined : mode}
      onModeChange={istStatistik ? undefined : handleModeChange}
      stufe={stufe}
      onStufeChange={darfTextstufeSelbst ? changeStufe : undefined}
      geburtsjahr={geburtsjahr}
      onGeburtsjahrChange={darfGeburtsjahrSelbst ? changeGeburtsjahr : undefined}
      lang={lang}
      onLangChange={changeLang}
      langLocked={!!(isPupil && account?.langLocked)}
      startUnits={darfStartpunktSelbst ? startValue : undefined}
      onStartUnitsChange={darfStartpunktSelbst ? changeStartUnits : undefined}
      lernweg={lernweg}
      onEinrichtungNeu={() => setEinrichtung(true)}
      zeitLassen={zeitLassen}
      onZeitLassenChange={darfZeitLassenSelbst ? changeZeitLassen : undefined}
      zeichenabstand={zeichenabstand}
      onZeichenabstandChange={changeZeichenabstand}
      einhand={einhand}
      onEinhandChange={darfEinhandSelbst ? changeEinhand : undefined}
      gezielt={{
        wirksam: gez.wirksam,
        vonLehrkraft: !gez.darfAendern,
        onWaehlen: gez.oeffnen,
        onAus: gez.ausschalten,
      }}
      wochenziel={eigenesWochenziel}
      onWochenzielChange={eigenesWochenziel ? changeWochenziel : undefined}
      einfuehrung={
        // ★ EN1: In englischer Bedienung ohne Podcast (Johannes 12.09.2026:
        //   „Podcasts weglassen" - die Folgen sind deutsch). Dieselbe Regel
        //   wie bei der Willkommens-Karte weiter unten. ★ E11a-5: ebenso in
        //   der französischen (Bauplan §6.1: kein Podcast für „fr").
        sprache !== "de" ? undefined : (
          <IntroPodcastKnopf
            stufe={introStufe}
            offen={showIntro}
            onToggle={() => setShowIntro((v) => !v)}
          />
        )
      }
      selbstlernend={!!account?.selfManaged}
      adresseBestaetigt={!!account?.verified}
    />
  );

  // „Dein Wochenziel" — seit 25.08.2026 in der KOMPAKTEN Fassung und in der
  // Stand-Zeile UNTER dem Übungsfeld: ein Ring mit den Restminuten der
  // laufenden Einheit, daneben ein Strich je Einheit der Woche. Vorher standen
  // dort fünf gleich große Ringe mit fünfmal derselben Zahl.
  // Nur Lernende mit gesetztem Ziel; sonst nichts.
  const goalSlot =
    isPupil && account ? (
      <WeeklyGoalRings account={account} poll kompakt size={34} />
    ) : undefined;

  return (
    <div className="min-h-screen bg-surface px-4 py-8 font-legible text-ink">
      <div className="mx-auto w-full max-w-6xl">
        {/* ★ Z4: `data-rundgang` - der Rundgang findet darin die Übungsart
            (Überschrift), die Werkzeuge und das Konto (`Rundgang.tsx`). */}
        <div className="mb-4" data-rundgang="kopfzeile">
          <AppKopfzeile
          titel="Tastenflow"
          // ★ Das App-Zeichen (30.08.2026) - MIT Bildbeschreibung: Wer mit dem
          // Screenreader darauf kommt, erfährt, wie das Logo aussieht.
          // h-9 wie der Sensorik-Kreis und die runden Werkzeug-Knöpfe - EINE
          // Kreisfamilie, 36 px (Wunsch Johannes 30.08.).
          // Der Tipp zeigt Sehenden dasselbe in kurz - sofort und lesbar wie
          // bei den Knöpfen rechts. Die Id wird bewusst NICHT angehängt: Die
          // Sprachausgabe hat die volle Bildbeschreibung schon als Namen.
          zeichen={
            <Tipp text={T.logoTipp}>
              {() => <TastenflowLogo beschreibung={T.logoBeschreibung} className="h-9 w-9" />}
            </Tipp>
          }
          // ★ 28.09.2026 (Johannes): „Sensorik" links oben führt nach
          // weingartner.org - die Seite gibt es nur auf Deutsch. In jeder
          // anderen Bedienungssprache (/en, /fr, /es oder umgeschaltet)
          // verschwindet der Verweis.
          ohneHeimVerweis={sprache !== "de"}
          bereich={bereich}
          // ★ Der Schriftzug „Tastenflow" ist der Heimweg (Johannes
          // 25.08.2026) - GENAU der Escape-Weg, nicht eine zweite Fassung
          // davon (siehe `zurueckInsProgramm`).
          onZumProgramm={zurueckInsProgramm}
          // ★ W2b (Punkt 2): derselbe Sprachwähler wie aus dem Anbieter -
          // nur läuft die Wahl erst durch die Tastatur-Rückfrage
          // (`sprachWechselMitTastatur`). Ohne aktiven Anbieter: nichts.
          sprachSchalter={
            bereichAktiv
              ? { sprache: spracheGewaehlt, onWechsel: sprachWechselMitTastatur }
              : undefined
          }
          sprachen={bereichAktiv ? spracheOptionen : undefined}
          onHilfe={() => setShowHelp(true)}
          onKurztasten={() => setShowShortcuts((v) => !v)}
          kurztastenOffen={showShortcuts}
          // ★ 22.09.2026: „Tasten erkunden" als runder Schalter neben „Alt" -
          // derselbe Zustand wie Alt + 3, keine zweite Fassung.
          onTastenErkunden={() => setErkundenModus((m) => (m ? null : "erkunden"))}
          tastenErkundenOffen={erkundenModus !== null}
          account={
            account
              ? {
                  id: account.id,
                  name: account.name,
                  classCode: account.classCode,
                  istLehrkraft: isTeacher,
                  // ★ Entscheidet, WO „Melden" steht (Johannes 02.09.2026):
                  // im Konto-Menü über „Abmelden". Siehe `KopfKonto`.
                  selbstlernend: !!account.selfManaged,
                }
              : null
          }
          // ★ Nr 3 der Fokusziele (22.08.2026): „Abmelden" nimmt sich selbst
          // samt Konto-Liste aus dem Baum. An genau derselben Stelle der
          // Kopfzeile steht danach der Knopf „Konto" - das ist das Ziel, und
          // die Ansage sagt, dass es geklappt hat. Bisher setzte niemand einen
          // Fokus; er fiel auf `body`.
          // `setShowAuth(false)` gehört dazu: Wer sich abmeldet, will nicht im
          // selben Augenblick vor dem Anmelde-Formular stehen (es wäre wieder
          // sichtbar, falls die Anmeldung in dieser Sitzung einmal offen war)
          // - und der Fokus hätte dann zwei Bewerber.
          onAbmelden={() => {
            logout();
            setShowAuth(false);
            sprichBedienung(ansage("abgemeldet", bedienLang()));
            window.setTimeout(() => authTriggerRef.current?.focus(), 0);
          }}
          onAnmelden={() => setShowAuth(true)}
          anmeldenRef={authTriggerRef}
          // Die Statistik gibt es nur beim Üben — Lehrkräfte sehen sie
          // in „Meine Klassen" für jedes Kind.
          onStatistik={isPupil ? oeffneStatistik : undefined}
          onPasswort={account ? () => setShowPasswort(true) : undefined}
          klasseHref={meineKlasseHref("tippen")}
          // Nach dem Nachrichten-Fenster: Fokus zurück ins Tipp-Übungsfeld.
          bellAfterClose={() => focusPracticeField()}
          // Escape im Konto-Menü folgt derselben Hausregel: zurück ins Feld.
          escAfterClose={() => focusPracticeField()}
          // ⚙ Einstellungen — seit 22.08.2026 in der Kopfzeile statt in einer
          // eigenen Leiste über der Übungskarte (Charge „SCHLANK").
          onEinstellungen={
            showTrainer || istStatistik ? () => toggleSettings() : undefined
          }
          /* ★★★ 07.09.2026 (Johannes): „das einstellungsfenster [soll] nicht
             oben den inhalt nach unten schieben, sondern ein eigenes fenster
             öffnen". Damit fällt `einstellungenOffen`/`aria-expanded` weg -
             ein Dialog wird nicht auf- und zugeklappt, er geht auf. Ohne
             `einstellungenOffen` setzt die Kopfzeile von selbst
             `aria-haspopup="dialog"`, genau wie bei »Im Griff«, das dieses
             Muster seit dem 06.08. hat. */
          // Vorlese-Schalter in der Kopfzeile (30.08.2026). Er greift auf
          // denselben Weg wie Alt + V und der Schalter im Zahnrad zu - kein
          // eigener Zustand, keine zweite Ansage.
          onVorlesen={vorlesenUmschalten}
          vorlesenAn={vorlesenAn}
          // ★ 17.10.2026 (Johannes): unter dem runden Lautsprecher-Schalter
          // ein Menü mit ALLEN Akustik-Einstellungen, mit Schiebereglern und
          // Mouseover-Erklärung. Der Schalter öffnet es; Vorlesen an/aus steht
          // darin als erster Schalter, Alt + V schaltet weiter direkt um.
          akustikMenue={{
            inhalt: <AkustikMenue onVorlesen={vorlesenUmschalten} lang={lang} lernweg={lernweg} />,
            tipp: AKUSTIK_TEXTE[spracheGewaehlt].tipp,
            name: AKUSTIK_TEXTE[spracheGewaehlt].titel,
          }}
          // ★ 31.08.2026 (Vollaudit, Zensus Nr 40): Die Farbwahl im Menü
          // Alt + K wechselte den Kontrast auf der ganzen Seite, ohne ein
          // Wort zu sagen. Derselbe zweisprachige Satz, den die Einrichtung
          // für die Sprachwahl und das Zahnrad für die Textstufe schon
          // benutzen (`Einrichtung.tsx:341`, `TypingSettings.tsx:363`) -
          // kein neuer Wortlaut, keine neue Übersetzung.
          // Die Kopfzeile meldet nur das Etikett; gesprochen wird hier, mit
          // der Stimme DIESER App - siehe `onFarbeGewaehlt` in
          // `AppKopfzeile.tsx`.
          onFarbeGewaehlt={(label) => sprichBedienung(ansageGewaehlt(label, bedienLang()))}
          // ★ Probestück „englische Bedienung" (12.09.2026): Sprache und
          // Sprachschalter der Kopfzeile kommen seit EN0 (18.09.2026) aus dem
          // Provider in `Root` - die Kopfzeile fragt ihn selbst, auf JEDER
          // Tastenflow-Seite gleich. Seit 19.09.2026 für jeden: Gast, Kind,
          // Selbstlernende und Lehrkraft. Was er an der Übungssprache ändert,
          // steht bei `useBeimSprachSchalter` (oben, nach `changeLang`).
          />
        </div>

        {/*
          ★★★ „Nicht gespeichert" - der SICHTBARE Kanal (31.08.2026).

          Die Ansage allein erreicht nur, wer zuhört. Wer sehend ohne
          Screenreader übt und das Vorlesen aus hat, bekäme sonst gar nichts -
          dieselbe Fehlerklasse wie bei der falschen Umschalttaste (Audit §7.5:
          „Erfolg spricht, Fehler schweigt").

          Kein Fenster, kein Fokuswechsel: Das Kind tippt gerade. Der Streifen
          steht über der Übungskarte und bleibt, bis wieder gespeichert wird.
          `role="alert"` meldet ihn der Sprachausgabe genau einmal - deshalb
          steht er im Baum, sobald er gilt, und nicht dauerhaft leer da.
        */}
        {/* Das Wochenziel-Fenster - einmal je Ziel-Woche, ohne Haken. */}
        {wochenzielOffen && (
          <Merkfenster
            {...wochenzielFenster(skinForStufe(stufe), sprache, anredeFuer(account))}
            onSchliessen={() => setWochenzielOffen(false)}
          />
        )}

        {/* Die Bitte um eine echte Tastatur (20.09.2026) - einmal je Gerät,
            ohne Haken, wie die Lesezeile; verschwindet zusätzlich von selbst
            beim ersten echten Tastendruck (siehe `onKey` oben). */}
        {tastaturHinweisOffen && (
          <Merkfenster
            {...tastaturHinweisFenster(anredeFuer(account), sprache)}
            mitHaken={false}
            onSchliessen={() => {
              if (!tastaturHinweisGesehen()) merkeTastaturHinweisGesehen();
              setTastaturHinweisOffen(false);
            }}
          />
        )}

        {account?.selfManaged && (
          <SpendenBanner
            app="tastenflow"
            zielgruppe="selbstlernend"
            kontoId={account.id}
            stundenGesamt={spendenbannerStunden}
            stundenHalbjahr={spendenbannerStundenHalbjahr}
            name={account.name}
          />
        )}

        {/* ★ Z3 (19.09.2026): „Was gibt's Neues" - nur für eine Lehrkraft, die über „Selbst üben" kam. */}
        <NeuigkeitenFenster ort="ueben" />

        {/* ★ Z4 (19.09.2026): der Rundgang beim allerersten Betreten - nach der
            Einrichtung, nur beim gewöhnlichen Üben (nicht in Tippchallenge,
            Klassenmatch, Eigener Übung). Regel: `lib/typing/rundgang.ts`. */}
        <RundgangUeben
          stufe={stufe}
          bereit={
            showTrainer &&
            !schreibprobeDran &&
            !matchDran &&
            !eigeneUebungDran &&
            !eigeneUebungAnkuendigung.zeigen
          }
        />

        {/* ★ W2b (28.09.2026, Windows-Befund §3.7): die App erkennt die
            Tastatur selbst und SCHLÄGT sie vor - nie still umgestellt. Nicht
            in Tippchallenge/Klassenmatch/Eigener Übung (dort zählt jede
            Sekunde, und die Tastatur wechselt man vorher). */}
        <TastaturVorschlag
          lernweg={lernweg}
          bereit={showTrainer && !schreibprobeDran && !matchDran && !eigeneUebungDran}
        />

        {/* ★ W2b (Punkt 2): „Verwendest du eine französische Tastatur?" -
            „Ja" stellt die Tastatur des Landes ein UND wechselt die Sprache,
            „Nein" (auch Escape, ✕) lässt beides; der Fokus geht an den
            Sprachwähler zurück. */}
        {sprachFrage && (
          <SprachwahlRueckfrage
            weg={sprachFrage.weg}
            onJa={() => {
              const f = sprachFrage;
              setSprachFrage(null);
              setLayout(f.layout);
              wechsleBedienung(f.neu);
            }}
            onNein={() => setSprachFrage(null)}
          />
        )}

        {speicherFehler && (
          <div
            role="alert"
            className="mb-4 rounded-xl border-2 border-warning bg-warning-soft px-4 py-3 text-base font-medium text-ink"
          >
            {isTeacher ? T.nichtGespeichertLehrkraft : T.nichtGespeichert}
          </div>
        )}

        {abgelaufen && !account && !authVisible && (
          <div
            role="alert"
            className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border-2 border-warning bg-warning-soft px-4 py-3 text-base font-medium text-ink"
          >
            <span>{abgelaufenText}</span>
            <button
              type="button"
              className="btn-primary"
              // Fokus: Die Anmeldung setzt ihn selbst ins erste Feld; wer dort
              // abbricht, landet auf „Anmelden" in der Kopfzeile (`onCancel`
              // unten) - dieser Streifen ist dann wieder da, direkt darunter.
              onClick={() => setShowAuth(true)}
            >
              {T.neuAnmelden}
            </button>
          </div>
        )}

        {/*
          Die Willkommens-Karte steht GANZ OBEN — sie ist das Erste, was
          beim ersten Start begegnet, und verschwindet mit „Schließen". Sie
          sperrt nichts: Wer sofort tippen will, tippt sofort.
        */}
        {/* ★ In englischer Bedienung ohne Podcast - Johannes 12.09.2026:
            „Podcasts weglassen" (Bauplan §1, Nr 4). Die Folgen sind deutsch. */}
        {/* ★ E11a-5: ebenso ohne Podcast in französischer Bedienung (Bauplan §6.1). */}
        {showTrainer && sprache === "de" && (
          <IntroPodcast
            stufe={introStufe}
            offen={showIntro}
            onClose={() => setShowIntro(false)}
          />
        )}

        {/*
          ════════════════════════════════════════════════════════════════════
          ★★★ DIE EINSTELLUNGEN STEHEN IN EINEM FENSTER (07.09.2026, Johannes)
          ════════════════════════════════════════════════════════════════════
          Sein Wortlaut: *„beim öffnen der einstellungen in Tastenflow und den
          anderen apps soll das einstellungefenster nicht oben den inhalt nach
          unten schieben sondern ein eigenes fester öffnen das mit esc und mit
          zurück wieder zum programm wechselt, auch oben auf Tastenflow kann
          geklickt werden um es zu schließen. so soll es bei allen apps sein."*

          Bis dahin klappte hier ein `<div>` auf und schob die Übungskarte nach
          unten - wer die Einstellungen öffnete, verlor die Zeile, an der er
          gerade saß. »Im Griff« und Mathecoach hatten längst ein Fenster; diese
          App war die letzte mit der Aufklapp-Bauart.

          `Modal` bringt alles mit, was Johannes nennt: Escape schließt,
          der Fokus geht danach auf das Zahnrad zurück, der Hintergrund ist
          gesperrt. Der Klick auf „Tastenflow" oben schließt ebenfalls - er
          ruft `zurueckInsProgramm`, und das ruft `schliesseSettings`.
        */}
        {(showTrainer || istStatistik) && settingsOffen && (
          <Modal
            title={T.einstellungen}
            // ★ 19.09.2026, Johannes: „das Einstellungsfenster … kann ruhig
            // breiter sein, dann passt auch alles besser" - 64 statt 48 rem.
            // ★ 17.10.2026, Johannes: „passe die Breite dem restlichen
            // Tastenflow an" - `voll` ist 72 rem, genau die Breite der Seite
            // (`max-w-6xl` oben), nicht mehr schmaler als Kopfzeile und Karten.
            size="voll"
            onClose={schliesseSettings}
            /* ★ Der ZURÜCK-Weg als sichtbarer Knopf - `Modal` zeichnet ihn, seit
               ihn alle drei Einstellungs-Fenster brauchen (07.09.2026). */
            zurueck={T.zurueckZumUeben}
          >
            {/* ★ 25.10.2026, Testerin: „Könntest Du im Einstellungsmenü noch einen
                Scroll-Balken einbauen?" - Windows 11 blendet den Balken des Fensters aus,
                bis die Maus darüber steht. Der Inhalt rollt deshalb in einem eigenen
                Kasten mit einem Balken, der immer zu sehen ist (`index.css`,
                `.rollkasten-sichtbar`). */}
            <div ref={settingsRef} className="rollkasten-sichtbar">
              {trainerSettings}
            </div>
          </Modal>
        )}

        {/* ★★★ `blatt-flaeche` - der Behälter, an dem die Ränder gemessen werden
            (Bauart §6.1). Er misst den PLATZ, nicht unseren Vergrößerungs-
            Faktor, und deckt damit beide Vergrößerungen ab: die des Browsers
            (Strg/Cmd + Plus, die die Kinder benutzen) und unsere eigene. Wird
            es eng, werden Innenränder und Ecken schmäler, statt dem Text den
            Platz wegzunehmen. Solange Platz da ist, ändert sich nichts. */}
        <main ref={blattflaeche} className="blatt-flaeche">
          {/*
            ★ Warum das Klassenmatch nicht losging (11.09.2026 abends, Johannes:
            „dann passiert gar nichts"). Ein Satz, kein Fenster: Er soll stehen
            bleiben, bis das Kind ihn gelesen hat, und er nimmt niemandem den
            Fokus. `role="status"` - eine Blitzmeldung auf der Braillezeile,
            aber hier tippt gerade niemand, und gesprochen wird er ohnehin.
          */}
          {match.meldung && (
            <p role="status" className="m-0 mb-2 rounded-lg border border-hairline bg-warning-soft px-3 py-2 text-sm text-ink">
              {match.meldung}{" "}
              <button
                type="button"
                className="btn-secondary btn-toggle ml-2 text-sm"
                onClick={() => {
                  match.meldungLoeschen();
                  focusPracticeField();
                }}
              >
                {T.verstanden}
              </button>
            </p>
          )}
          {authVisible ? (
            <TypingAuth
              onCancel={() => {
                setShowAuth(false);
                authTriggerRef.current?.focus();
              }}
            />
          ) : einrichtung ? (
            <Einrichtung
              stufe={stufe}
              // ★ 30.08.2026: kein `onStufeChange` mehr - die Einrichtung
              //   fragt nur noch das Geburtsjahr, die Stufe leitet sich daraus
              //   ab. Umgestellt wird im Zahnrad.
              geburtsjahr={geburtsjahr}
              onGeburtsjahrChange={
                darfGeburtsjahrSelbst ? changeGeburtsjahr : undefined
              }
              lang={lang}
              onLangChange={changeLang}
              langLocked={!!(isPupil && account?.langLocked)}
              // ★ B11/§2.3: Für ein Kind einer Klasse entfällt der Schritt
              // „alter" ganz - die Textstufe kommt aus der Schulstufe der Klasse.
              klassenkind={istKlassenkind}
              startUnits={darfStartpunktSelbst ? startValue : undefined}
              onStartUnitsChange={darfStartpunktSelbst ? changeStartUnits : undefined}
              lernweg={lernweg}
              onExit={() => {
                setEinrichtung(false);
                // Die Einrichtung hat den Podcast schon angeboten — die
                // Willkommens-Karte darf danach nicht auch noch aufspringen.
                // (Gilt für beide Auswege: durchgegangen wie übersprungen.)
                setShowIntro(false);
                // Fokus dorthin, wo es weitergeht: ins Übungsfeld (erst im
                // nächsten Takt, wenn der Trainer wirklich im Baum steht).
                focusPracticeField();
              }}
            />
          ) : (
            /*
              ★★★ DAS TOR DER SPRACHPAKETE (28.09.2026, `SprachpaketTor`): Alles
              ab hier braucht die Texte des Weges - es steht erst, wenn sie
              geladen sind. Anmeldung und Einrichtung stehen DAVOR und
              brauchen keine Texte (sonst verschwände die Einrichtung mitten in
              der Sprachwahl, während das neue Paket lädt).
            */
            <SprachpaketTor sprachen={paketBedarf} fokusNachWarten={focusPracticeField}>
          {schreibprobeDran && account ? (
            /*
              ★★★ DIE SCHREIBPROBE HAT VORRANG (09.09.2026).

              Johannes: *„Die schüler dieser Klasse sehen eine andere Farbe und
              Markierung »Prüfung«."* Sie steht deshalb VOR allen Übungsarten -
              wer gerade eine Prüfung schreibt, wechselt nicht nebenbei in die
              Bücherei.

              ⚠️ Sie steht NACH `authVisible` und `einrichtung`: Wer sich
              gerade anmeldet oder zum ersten Mal eingerichtet wird, ist noch
              gar nicht in seiner Klasse angekommen.

              ⚠️ Und sie greift NUR in den Phasen „offen", „läuft" und
              „abgegeben" ({@link schreibprobeDran}) - nicht in „wartet". Eine
              Probe, die erst um 10 Uhr beginnt, darf ein Kind um 8 Uhr nicht
              vom Üben aussperren; es erfährt davon in seinem gewohnten
              Bildschirm, nicht statt seiner.
            */
            <SchreibprobeLauf
              probe={probe}
              account={account}
              stufe={stufe}
              onTask={onTask}
            />
          ) : matchDran && account && match.meinMatch && match.phase === "einladung" ? (
            /*
              ★★★ DAS WARTEFENSTER (F3/F4): wer ist dabei, und „Starten".
              Beim Gastgeber mit „Starten" und „Absagen", bei allen anderen
              mit „Doch nicht".
            */
            <KlassenmatchLobby
              match={match.meinMatch}
              staende={match.staende}
              binGastgeber={match.binGastgeber}
              imCountdown={false}
              restMs={0}
              kannStarten={match.kannStarten}
              unentschieden={match.unentschieden}
              onStarten={match.starten}
              onAbbrechen={match.binGastgeber ? match.absagen : match.aussteigen}
            />
          ) : matchDran && account && match.meinMatch ? (
            /*
              ★★★ DAS KLASSENMATCH (11.09.2026, F5 bis F14).

              Es steht NACH der Tippchallenge: Eine Prüfung geht einem Spiel
              vor.
            */
            <KlassenmatchLauf
              match={match.meinMatch}
              staende={match.staende}
              account={account}
              stufe={stufe}
              lang={lang}
              loadFn={loadFn}
              saveFn={saveFn}
              onTask={onTask}
              startTempo={isPupil ? account.tempo : undefined}
              enforceShiftHand={enforceShiftHand}
              zeitLassen={zeitLassen}
              onStand={match.standMelden}
              onFertig={match.fertigMelden}
              onWeiter={match.verlassen}
              onVerlassen={match.mittendrinVerlassen}
            />
          ) : eigeneUebungAnkuendigung.zeigen && account ? (
            /*
              ★★★ E6 (19.09.2026): DAS ANKÜNDIGUNGSFENSTER.

              Steht hier an genau derselben Stelle wie die Übung selbst
              (Kommentar direkt darunter) - eine laufende Tippchallenge oder
              ein laufendes Klassenmatch lässt diese Ternäre also gar nicht
              erst hierher kommen, und `useEigeneUebungAnkuendigung` sperrt
              zusätzlich selbst dagegen (siehe dort).
            */
            <EigeneUebungAnkuendigung
              skin={skinForStufe(stufe)}
              onWeiter={eigeneUebungAnkuendigung.bestaetigen}
            />
          ) : eigeneUebungDran && account ? (
            /*
              ★★★ „EIGENE ÜBUNG" (17.09.2026).

              Steht NACH Tippchallenge UND Klassenmatch: Eine Prüfung und ein
              verabredetes Match gehen einer ungewerteten Einzelübung vor.
            */
            <EigeneUebungLauf
              stand={eigeneUebung}
              account={account}
              stufe={stufe}
              lang={lang}
              onTask={onTask}
            />
          ) : isPupil && pupilView === "statistik" && account ? (
            <div className="space-y-3">
              <StatistikSchliessen onClose={schliesseStatistik} />
              <PupilSelfStats account={account} />
              <StatistikSchliessen onClose={schliesseStatistik} />
            </div>
          ) : mode === "buecherei" ? (
            <SerienTrainer
              key={`${account?.id ?? "anon"}:buecherei:${layout.id}:${reloadNonce}`}
              loadFn={loadFn}
              saveFn={saveFn}
              onTask={onTask}
              stufe={stufe}
              lang={lang}
              startTempo={isPupil ? account?.tempo : undefined}
              goalSlot={goalSlot}
              enforceShiftHand={enforceShiftHand}
              zeitLassen={zeitLassen}
              zeichenabstand={zeichenabstand}
              // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
              zeilenEnde={zeilenEnde}
              initialSlug={pendingStorySlug}
              onInitialConsumed={() => setPendingStorySlug(null)}
              // ★ 17.10.2026 (Johannes): ein Schalter OBEN, der immer nach
              // „Mein Training" führt - mit Ansage, wie Alt + B sie macht.
              onZuMeinTraining={zuMeinTraining}
              zuMeinTrainingName={T.zurueckZuMeinTraining}
              // ★ Nr 11 der Fokusziele (22.08.2026): „🎉 Weiter üben" auf der
              // Abschluss-Karte einer Etappe wechselt zurück in den Trainer,
              // aus dem gelesen wurde. Bisher setzte niemand ein Ziel - der
              // Knopf verschwand mit der Karte, und der Fokus hing daran, ob
              // das neue Tippfeld ihn im nächsten Takt von selbst holt.
              onBackToPractice={() => {
                // ★ 31.08.2026 (Vollaudit, Zensus Nr 92): das Gegenstück zu
                // Nr 91. In die Bücherei hinein wird angesagt (Alt + B und der
                // Mount-Gruß der Bücherei), aus ihr heraus bisher nicht -
                // `AdaptiveTrainer` hat keinen eigenen Gruß. Ein Kind, das
                // eine Etappe abschloss, wechselte
                // stumm die Übungsart. Dieselbe Funktion, die Alt + B schon
                // benutzt (`uebungsartWeiterRef` oben) - kein neuer Wortlaut.
                sprichBedienung(trainerModeAnsage(storyReturnRef.current, bedienLang()));
                handleModeChange(storyReturnRef.current);
                focusPracticeField();
              }}
            />
          ) : mode === "wortspiele" ? (
            // Das Regal - und, sobald etwas herausgenommen ist, derselbe
            // Übungslauf wie in „Mein Training". Ein zweiter Lauf hiesse
            // Spielstand, Telemetrie und Übezeit ein zweites Mal.
            wortspiel === null ? (
              <Wortspiele
                key={`${account?.id ?? "anon"}:regal:${reloadNonce}`}
                loadFn={loadFn}
                stufe={stufe}
                lang={lang}
                oneHand={!enforceShiftHand}
                onWaehlen={setWortspiel}
                onZuMeinTraining={zuMeinTraining}
                zuMeinTrainingName={T.zurueckZuMeinTraining}
              />
            ) : (
              <AdaptiveTrainer
                key={`${account?.id ?? "anon"}:wortspiel:${wortspiel}:${layout.id}:${reloadNonce}`}
                loadFn={loadFn}
                saveFn={saveFn}
                onTask={onTask}
                stufe={stufe}
                lang={lang}
                startTempo={isPupil ? account?.tempo : undefined}
                goalSlot={goalSlot}
                enforceShiftHand={enforceShiftHand}
                zeitLassen={zeitLassen}
                zeichenabstand={zeichenabstand}
                // ★ Zeilenende mit Enter (23.09.2026) - gilt auch für die
                // Zeilen-Wortspiele, siehe TypingClass.zeilenEndeEnter.
                zeilenEnde={zeilenEnde}
                startForm={wortspiel}
                onFormEnde={() => setWortspiel(null)}
              />
            )
          ) : (
            // "adaptiv" - UND der sichere Regelfall für jeden nicht mehr
            // gültigen Altwert (E7, 19.09.2026: „lektionen" ist entfallen,
            // `TypingTrainer.tsx` gibt es nicht mehr). Ein Kind, dessen
            // gespeicherter Modus noch "lektionen" lautet, landet hier ohne
            // Fehlermeldung im normalen, adaptiven Training.
            <AdaptiveTrainer
              key={`${account?.id ?? "anon"}:adaptiv:${layout.id}:${reloadNonce}`}
              loadFn={loadFn}
              saveFn={saveFn}
              onTask={onTask}
              stufe={stufe}
              lang={lang}
              startTempo={isPupil ? account?.tempo : undefined}
              goalSlot={goalSlot}
              enforceShiftHand={enforceShiftHand}
              zeitLassen={zeitLassen}
              zeichenabstand={zeichenabstand}
              // ★ Zeilenende mit Enter (23.09.2026) - „Mein Training",
              // siehe TypingClass.zeilenEndeEnter.
              zeilenEnde={zeilenEnde}
              onOpenStory={openStoryInBuecherei}
              // ★ GEZIELT ÜBEN (13.11.2026): nur „Mein Training" - nicht Wortspiele, Klassenmatch, Tippchallenge.
              gezielt={gez.wirksam}
              onVorgezogen={gez.onVorgezogen}
              onGezieltRunde={gez.onRunde}
              gezieltSlot={gez.schild}
            />
          )}
            </SprachpaketTor>
          )}
          {/* ★ 27.09.2026: Netz kurz weg - ruhig, KEIN Live-Bereich, keine
              Ansage: die Braillezeile springt nicht, das Kind tippt einfach
              weiter. Bewusst UNTER dem Trainer (Prüfbefund K2): Ein Satz
              darüber schöbe die Übungszeile nach unten - mit Lupe oder
              CVI-Lesezeile verlöre das Kind seine Stelle. */}
          {gez.knoten}
          {(verbindungFehlt || lernstandOhneNetz) && !speicherFehler && (
            <p className="mt-4 rounded-xl border border-hairline px-4 py-2 text-base text-ink-soft">
              {T.ohneVerbindung}
            </p>
          )}
        </main>

        {/*
          FUSSZEILE - Pflicht, und sonst nichts.
          ==================================================================
          Seit dem 22.08.2026 läuft Tastenflow unter seiner eigenen Adresse
          tastenflow.org. Wer dort ankommt, sieht NUR diese Seite - und hatte
          bis hierher keinen Weg zu Impressum und Datenschutzerklärung. Beides
          muss aber von jeder Seite aus unmittelbar erreichbar sein
          (§ 25 MedienG, § 5 ECG, Art. 13 DSGVO).

          Darum steht sie GANZ UNTEN, hinter allem Inhalt: eine Zeile, kleine
          Schrift, kein Rahmen, keine Farbe, kein eigener Kasten. Vom Üben
          zieht sie damit nichts weg. Sie ist normaler Tab-Weg-Inhalt (kein
          `aria-hidden`) und wird beim Durchgehen zuletzt erreicht - genau
          dort gehört Rechtliches hin. `aria-label` gibt der Landmarke einen
          Namen, damit sie in der Regionen-Liste eines Screenreaders nicht
          bloß „Fußzeile" heißt.

          Sie steht AUSSERHALB aller Ansichts-Bedingungen, also unter dem
          Üben genauso wie unter Statistik, Anmeldung und Einrichtung.

          ⚠️ Die beiden Rechtstexte bleiben RELATIV. Dieselbe Anwendung
          beantwortet sie unter beiden Adressen; ein absoluter Verweis würde
          den Rechnernamen wechseln - und mit ihm die Sitzung (www-Falle,
          siehe src/lib/adressen.ts). KEIN dritter Verweis (Johannes 23.08.:
          zur Plattform führt das Sensorik-Zeichen oben links, das reicht).
        */}
        {/*
          ★ Der dritte Verweis „Unterstützen" führt auf `/unterstuetzen`; die
          Bitte um einen Kaffee steht dort und nicht hier. Johannes, 02.09.2026:
          *„nein nicht beim einstieg schon so present den spendenaufruf"* - ein
          Spendenblock direkt unter „Willkommen bei Tastenflow" macht aus der
          ersten Minute eine Kasse.

          `unterstuetzenApp` wirkt nur, wenn die App freigegeben ist
          (`src/lib/unterstuetzen.ts`). Alle anderen Seiten, die diese Fußzeile
          einbinden - Mathecoach dreimal -, geben nichts mit und bleiben
          unverändert.
        */}
        {/* ★ EN1 (19.09.2026): Bis EN8 waren die Rechtstexte nur deutsch, und die
            Fußzeile stand darum in englischer Bedienung in `lang="de"`. Seit
            EN8 folgt sie selbst der Bedienungssprache (`RechtlichesFusszeile`)
            - die Hülle ist weg. */}
        <RechtlichesFusszeile barrierefreiheit unterstuetzenApp="tastenflow" />
      </div>

      {isTeacher ? (
        <LehrerHilfe open={showHelp} onClose={closeHelp} />
      ) : (
        // Die Hilfe folgt DERSELBEN Stufe wie der Rest der Seite — auch ohne
        // Anmeldung (Befund S6, 22.08.2026). Bis dahin bekam jeder Gast die
        // Erwachsenen-Fassung, damit ihm nichts fehlt; seit der Einrichtung nach
        // der Stufe FRAGT („Für wen sind die Texte?") und `stufe` für Gäste aus
        // eigener Wahl bzw. Geburtsjahr entsteht, war das ein Widerspruch: Der
        // Ring sagte „Spielstufe", die Hilfe siezte. Verloren geht dabei nichts —
        // die Hilfe verzweigt nur auf `=== 1`, `>= 2` und `>= 3`, also sehen
        // teens (die Vorgabe für alle, die nichts gewählt haben) und Erwachsene
        // dieselben Abschnitte; verschieden sind Anrede und Tonfall.
        <TippenHilfe
          open={showHelp}
          onClose={closeHelp}
          stufe={stufe}
          lernweg={lernweg}
        />
      )}

      <VoiceInstallHelp
        open={showVoiceInstall}
        onClose={() => {
          setShowVoiceInstall(false);
          focusPracticeField();
        }}
      />

      {/* „Passwort ändern" — seit 10.08.2026 aus dem KONTO-MENÜ statt unten in
          der Statistik (dort suchte es niemand, Johannes). */}
      {showPasswort && account && (
        <Modal
          title={T.passwortAendern}
          onClose={() => {
            setShowPasswort(false);
            focusPracticeField();
          }}
        >
          <ChangeOwnPasswordCard
            minLen={isTeacher ? 6 : 4}
            // Die Anrede aus der EINEN Regel (skin.ts, 19.09.2026).
            tone={anredeFuer(account) === "Sie" ? "sie" : "du"}
            immerOffen
            // ★ Nr 6 der Fokusziele (Johannes' Entscheidung F2, 22.08.2026):
            // Nach einem erfolgreichen Wechsel schließt der Dialog von selbst.
            // Vorher blieb er stehen - mit drei geleerten Feldern und einem
            // Knopf, der nichts mehr tun konnte, und einer Erfolgsmeldung, die
            // erst zu finden war. Jetzt: zu, Ansage, Eingabezeile.
            onErfolg={() => {
              setShowPasswort(false);
              sprichBedienung(ansage("passwortGeaendert", bedienLang()));
              focusPracticeField();
            }}
          />
        </Modal>
      )}
      {/* Der Rückweg ins Übungsfeld liegt seit dem 22.08.2026 IN der
          Komponente (Nr 20): Sie kennt JEDEN Ausweg - „Beenden", Alt + 3 und
          zweimal Escape -, das `onClose` hier sah damals nur drei von vieren.
          ★ 30.08.2026: Der vierte war Alt + K, das von der Seite aus schloss;
          seit der Modus auf Alt + 3 hört, laufen alle Auswege durch die
          Komponente. Die Regel bleibt trotzdem dort, wo sie hingehört. */}
      {/* ★ 13.09.2026 (Johannes): „Beenden" direkt beim Titel wie in »Im
          Griff« - für die Bildschirmlupe (`kopfKompakt`). */}
      <TastenErkunden
        open={erkundenModus !== null}
        onClose={() => setErkundenModus(null)}
        startModus={erkundenModus ?? "erkunden"}
        kopfKompakt
        gegenhand={enforceShiftHand}
        // ★ 25.09.2026 (Johannes): „Tasten finden" mit „Meine Tasten / Alle
        // Tasten" - die gelernten Zeichen kommen aus dem Fortschritt.
        ladeGelernte={() => loadFn().then((p) => ensureIntroduced(p.introduced, lernwegVon(p)))}
      />

      {/*
        ★★★ DIE EINLADUNG ZUM KLASSENMATCH (F2, 11.09.2026).

        Sie liegt ÜBER der Seite: Das Kind übt gerade, und der Wechsel in ein
        Spiel ist eine Entscheidung, keine Übernahme. „Bin dabei" führt in die
        Lobby, „Jetzt nicht" (und Escape) zurück in die Eingabezeile - und
        dieselbe Einladung kommt dann nicht wieder.

        ⚠️ Nicht während einer Tippchallenge: Wer gerade eine Prüfung schreibt,
        bekommt kein Fenster vor die Zeile. `useKlassenmatch` sorgt dafür, dass
        gebundene Kinder ohnehin keine Einladung sehen (F9) - die Challenge ist
        der zweite Fall, den nur diese Seite kennt.

        ★ `key` = die Match-Kennung (11.09.2026 abends): Das Fenster spricht
        seinen Satz beim Öffnen. Wechselt die Einladung, während es offen ist,
        muss es als NEUES Fenster aufgehen - sonst stünde Miras Name da, und
        gesagt worden wäre Sarahs. `vorsatz` sagt, was eben passiert ist
        („Sarah hat schon eingeladen."), siehe `useKlassenmatch`.
      */}
      {/*
        ★★★ „Arne lädt gerade ein. Mitmachen oder selbst einladen?"
        (02.10.2026) - die Antwort auf „Klassenmatch", solange eine fremde
        Einladung offen steht. Sie steht AN STELLE des Einladungsfensters,
        nie darüber: zwei Fenster übereinander wären zwei Fokusfallen.
      */}
      {match.rueckfrage && !schreibprobeDran ? (
        <KlassenmatchWahl
          key={match.rueckfrage.id}
          hostName={match.rueckfrage.hostName}
          onMitmachen={match.rueckfrageMitmachen}
          onSelbst={match.rueckfrageSelbst}
          onSchliessen={match.rueckfrageSchliessen}
        />
      ) : match.einladung && !schreibprobeDran ? (
        /*
          ★★★ Seit 02.10.2026 auch über der PLATZIERUNGSLISTE: Ist das Match
          vorbei, ist das Kind frei (`aufRangliste` im Haken). „Bin dabei"
          schliesst die Liste und öffnet das Wartefenster, „Jetzt nicht" führt
          zur Liste zurück - der Fokus auf ihre Überschrift, denn eine
          Eingabezeile gibt es dort nicht. Escape fängt das Fenster ab
          (`Modal`), die Liste bekommt es nicht mit.
        */
        <KlassenmatchEinladung
          key={match.einladung.id}
          hostName={match.einladung.hostName}
          vorsatz={match.einladungVorsatz}
          onDabei={() => match.beitreten(match.einladung!.id)}
          onNichtJetzt={() => match.ablehnen(match.einladung!.id)}
          onGezeigt={() => match.einladungGezeigt(match.einladung!.id)}
          fokusNachNein={
            match.aufRangliste
              ? () => document.querySelector<HTMLElement>("[data-match-titel]")?.focus()
              : undefined
          }
        />
      ) : null}

      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={T.kurztastenName}
          onClick={schliesseKurztasten}
        >
          <div
            ref={kurztastenCardRef}
            className="card my-8 w-full max-w-xl space-y-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="m-0 text-xl font-semibold text-ink">
                {T.kurztastenTitel}
              </h2>
              <button
                type="button"
                className="btn-ghost btn-toggle"
                ref={kurztastenCloseRef}
                onClick={schliesseKurztasten}
                aria-keyshortcuts="Alt+T"
                aria-label={T.schliessen}
              >
                ✕
              </button>
            </div>
            {/* ★ 12.09.2026 (Johannes: „mach es bei kürzellisten in allen apps"):
                Taste rechtsbündig DIREKT an ihrer linksbündigen Funktion (rund
                12 px), die Tabelle nur so breit wie nötig. Unter 8-facher
                Bildschirmlupe (rund 240 × 135 Pixel) lagen Taste und Funktion
                vorher mittig 260-500 px auseinander - man sah eins von beiden,
                nie beide (gemessen in »Im Griff«, Commit 79a023ae). Eine Tabelle
                bleibt es, damit ein Screenreader Spalte für Spalte liest.
                `data-kuerzelliste` nimmt sie aus der Mittig-Regel aus
                (tests/tippchallenge-tabellen-mittig-und-anrede.test.ts). */}
            <table data-kuerzelliste className="w-auto max-w-full text-sm">
              <thead>
                <tr className="text-ink-muted">
                  <th scope="col" className="pb-2 pr-3 text-right font-medium">{T.spalteKuerzel}</th>
                  <th scope="col" className="pb-2 text-left font-medium">{T.spalteFunktion}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {/* Die Zeilen stehen seit 12.09.2026 in `SEITEN_TEXTE` oben -
                    beide Sprachen nebeneinander, samt den Begründungen je Zeile. */}
                {/* ★ 18.10.2026: `kuerzelZeilen` (lib/typing/kuerzelListe.ts) - dieselben
                    Zeilen liest die Tabelle „Alle Tastenkürzel" der Handbücher. */}
                {kuerzelZeilen(sprache, bedienCopy(stufe, sprache).progressLabel).map(([key, label]) => (
                  <tr key={key} className="align-top">
                    <td className="py-1.5 pr-3 text-right align-top font-mono whitespace-nowrap">
                      {/* ★ 18.10.2026 (Kürzel einheitlich): am Mac „Wahl + O" -
                          in Taste UND Text („noch einmal Alt + 3"). */}
                      <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
                        {altAnzeige(key, mac, WAHLTASTE[sprache])}
                      </kbd>
                    </td>
                    <td className="py-1.5 text-left align-top text-ink">{altAnzeige(label, mac, WAHLTASTE[sprache])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="m-0 text-sm text-ink-muted">
              {mac ? `${WAHLTASTE_SATZ[sprache]} ${T.fussnoteFeld}` : T.fussnote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
