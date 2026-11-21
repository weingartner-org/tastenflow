/**
 * Tastenflow — die Einrichtung beim ersten Start (08.08.2026).
 *
 * Ein Schritt, eine Frage: Alter · Sprache · Tastatur · Startpunkt · Ton und
 * Vorlesen · Einführungs-Podcast. Vorbild ist der Im-Griff-Rundgang; die
 * Schrittfolge selbst liegt (rein und testbar) in `lib/typing/einrichtung.ts`.
 *
 * ── Die sieben Regeln dieser Datei ──────────────────────────────────────────
 *
 * 1. **Jede Wahl wirkt SOFORT.** Die Knöpfe rufen genau die Funktionen, die
 *    auch das Zahnrad ruft (`setLayout`, `setSoundMuted`, `setVoice` …) —
 *    kein zweiter Zustand, kein „Speichern"-Knopf, der auseinanderlaufen kann.
 *    Wer im Schritt „Ton" den Ton anschaltet, hört den nächsten Klang.
 *
 * 2. **Kein Dialog, keine Fokusfalle.** Die Einrichtung tritt an die Stelle des
 *    Trainers (wie der Rundgang bei »im Griff«), statt sich als Fenster
 *    darüberzulegen. Ein Kind mit Screenreader läuft so nicht gegen eine
 *    unsichtbare Wand.
 *
 * 3. **Fokus je Schritt auf die Überschrift** (per `setTimeout(0)`,
 *    [[feedback_fokus_pflicht_alle_apps]]): Screenreader lesen damit den neuen
 *    Schritt vor, ohne dass jemand suchen muss. Zusätzlich eine Live-Region mit
 *    „Schritt X von Y" — und dieselbe Ansage über `speakUi` fürs Selbst-Vorlesen.
 *
 * 4. **Immer ein Ausweg.** „Einrichtung überspringen" steht in JEDEM Schritt,
 *    und Esc tut dasselbe. Niemand sitzt fest, nur weil er sofort tippen will.
 *
 * 5. **Nichts ist endgültig.** Unter jedem Schritt steht, dass sich alles im
 *    Zahnrad ändern lässt. Neu starten geht mit Alt + R — dasselbe Kürzel wie
 *    bei »im Griff« ([[feedback_shortcut_konzept]]).
 *
 * 6. **Der Podcast steht NACH dem Alter** — vorher weiß niemand, welche der
 *    drei Folgen die richtige ist.
 *
 * 7. **Kein Fortschritt.** Die Einrichtung schreibt keine Übezeit, kein
 *    Ereignis, kein Abzeichen. Sie merkt sich genau ein Bit im Browser.
 */
import { htmlLang } from "./htmlLang";
import { tastaturDesLandes } from "@/lib/typing/landesTastatur";
import { useEffect, useRef, useState } from "react";
import {
  ansage,
  ansageGewaehlt,
  ansageSchalter,
  ansageSchritt,
  ansageStart,
  ansageTastatur,
  geburtsjahrAusText,
  activeLayoutId,
  hatGemerktesLayout,
  isSoundMuted,
  langLabel,
  uebungsSprachenImWeg,
  hauptspracheDesWeges,
  primeSpeech,
  setLayout,
  setSoundMuted,
  stufeLabel,
  type Lang,
  type Stufe,
  useTypingA11y,
  useVoice,
  vorschlagLayout,
} from "@/lib/typing";
import { franzoesischLehrgangProbeAn, italienischLehrgangProbeAn, polnischLehrgangProbeAn, spanischLehrgangProbeAn, tschechischLehrgangProbeAn, tuerkischLehrgangProbeAn } from "@/lib/typing/lernweg";
import { geruestLehrgangProben } from "@/lib/typing/lehrgangSchalter";
import { tastaturenFuerWeg, tastaturPasstZumWeg } from "@/lib/typing/wegTastaturen";
import {
  einrichtungFertigMerken,
  einrichtungSchritte,
  einrichtungTexte,
  naechsterSchritt,
  schrittNummer,
  vorigerSchritt,
  zusammenfassung,
  einrichtungAufzaehlung,
  type EinrichtungLage,
  type EinrichtungStepId,
} from "@/lib/typing/einrichtung";
import { introPodcastFuerStufe } from "@/lib/typing/podcastsTippen";
// ★ O-IT (02.10.2026): Tastatur-Namen über `layoutTexteIn` - italienisch beschriftet (layouts.ts bleibt unberührt).
import { layoutTexteIn } from "@/lib/typing/tastaturTexteIt";
// ★ O-IT (02.10.2026): die Startpunkte über `startPunkte` - italienisch beschriftet (letters.ts bleibt unberührt).
import { startPunkte } from "@/lib/typing/startpunkteIt";
import { browserSprachen, texte, useBedienSprache } from "@/lib/bedienSprache";
import { wahlText, wahlTexte } from "@/lib/typing/wahltaste";
import { IntroPodcast, introGesehenMerken } from "./IntroPodcast";
import { useBedienStimme } from "./useBedienStimme";
import { useKeyboardLayout } from "./useKeyboardLayout";
import { useTastaturErkennung } from "./useTastaturErkennung";
import type { Lernweg } from "@/lib/typing/lernweg";

/**
 * ★★ DIE SÄTZE DER EINRICHTUNG - beide Sprachen nebeneinander (EN2,
 * 19.09.2026). Die Überschriften, Knöpfe und die Fussnote stehen in
 * `lib/typing/einrichtung.ts` (`einrichtungTexte`), weil auch Tests und die
 * Anmeldung sie lesen; hier stehen die Absätze der Schritte.
 *
 * Die deutsche Spalte ist WORTGLEICH mit dem früheren JSX. Satzteile, die JSX
 * um einen eingesetzten Wert herum trennt, stehen als Teile da - so bleiben
 * die Textknoten der deutschen Fassung dieselben.
 *
 * ★★★ „Die Bedienung bleibt deutsch" (Schritt „sprache") ist in BEIDEN
 * Sprachen wahr: Die Wahl hier stellt nur die Übungssprache ein, nie die
 * Sprache der Schalter - die bleibt, wie sie ist, auf Deutsch deutsch und auf
 * Englisch englisch.
 */
export const T = texte({
  de: {
    fortschritt: (n: number, gesamt: number) => ["Einrichtung · Schritt ", n, " von ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow bringt dir das Schreiben mit zehn Fingern bei - ohne auf die Tastatur zu schauen. In ",
      gesamt,
      " kurzen Schritten stellen wir das Programm auf dich ein: ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      "Das dauert keine Minute. Wenn du lieber sofort losschreibst, nimm „",
      skip,
      "\" - dann gelten die Voreinstellungen.",
    ],
    alterFrage:
      "Sag uns dein Geburtsjahr. Daran erkennt das Programm, wie alt du bist - und stellt die Übungstexte, den Ton der Rückmeldungen und die Belohnungen darauf ein. Jedes Jahr neu, ganz von selbst.",
    beispielJahr: "z. B. 2016",
    alterVonLehrkraft: "Das Alter für deine Übungstexte hat deine Lehrkraft schon eingestellt. Gerade gilt: ",
    alterVonLehrkraft2:
      "Wenn die Texte zu leicht oder zu schwer sind, sag es ihr - sie kann es in „Meine Klassen\" ändern. Du gehst hier einfach weiter.",
    spracheSatz: "Gemeint sind die Übungswörter und Geschichten. Die Bedienung bleibt deutsch.",
    // ★ D1 Nr. 18 (28.09.2026): nur auf einem Weg mit Hauptsprache (fr/es).
    spracheHauptSatz: (name: string) =>
      `Die Sprache dieses Lehrgangs: ${name}. Englisch kannst du zusätzlich üben - die Tasten kommen trotzdem in der Reihenfolge dieses Lehrgangs.`,
    tastaturSatz:
      "Danach richten sich die Bildschirm-Tastatur, die Finger-Ansagen und welche Zeichen geübt werden. Im Zweifel: die deutsche.",
    // ★ D1 Nr. 7 (28.09.2026): Weg fr/es lehrt die Tastatur seines Landes.
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Dieser Lehrgang lehrt die Tastatur seines Landes - darum stehen nur ${tastaturDesLandes("de", weg)} Tastaturen zur Wahl. Die eingestellte Tastatur „${name}" passt nicht dazu. Wähle eine der Tastaturen hier.`,
    startSatz: "Wer schon tippen kann, muss nicht bei F und J anfangen. Du kannst das später jederzeit anheben.",
    tonSatz:
      "„Vorlesen\" spricht Aufgaben und Rückmeldungen selbst aus - gedacht für alle, die KEINEN Screenreader benutzen. Mit NVDA, JAWS oder VoiceOver lässt du es besser aus, sonst reden zwei Stimmen gleichzeitig.",
    ton: (aus: boolean) => (aus ? "Ton aus" : "Ton an"),
    tonErklaerung: "Klänge bei Sternen, Abzeichen und im Spiel.",
    vorlesen: (an: boolean) => (an ? "Vorlesen an" : "Vorlesen aus"),
    vorlesenErklaerung: "Die App liest Aufgaben und Rückmeldungen vor.",
    vorlesenAusAnsage: "Vorlesen aus.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Hörst du beim Tippen die Sprachausgabe deines Screenreaders (ohne Braillezeile)?",
    screenreaderErklaerung:
      "Für JAWS und NVDA. „Ja\" schaltet „Buchstabieren\" an - dann sagt dein Screenreader beim Tippen die nächste Taste. Das findest du auch in den Einstellungen (Alt + O).",
    ja: "Ja",
    nein: "Nein",
    buchstabierenAnsage: (an: boolean) => (an ? "Buchstabieren an." : "Buchstabieren aus."),
    podcastSatz: (dauer: string) => [
      "Bevor du loslegst: eine kurze Folge (",
      dauer,
      ") darüber, wie das Programm aufgebaut ist und was die Grundstellung ist - in der Fassung, die zu deiner Auswahl passt. Du kannst auch einfach weitergehen und sie später in den Einstellungen (Zahnrad) unter „Einführung\" hören.",
    ],
    fertigSatz: "So ist Tastenflow jetzt eingestellt:",
    zurueck: "Zurück",
    neuStarten: " Neu starten: Alt + R.",
  },
  en: {
    fortschritt: (n: number, gesamt: number) => ["Setup · Step ", n, " of ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow teaches you to touch type: to type with all ten fingers, without looking at the keyboard. In ",
      gesamt,
      " short steps we'll set the app up for you: ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      "It takes less than a minute. If you'd rather start typing straight away, choose “",
      skip,
      "” - then the default settings apply.",
    ],
    alterFrage:
      "Tell us the year you were born. That's how the app knows how old you are - and it matches the practice texts, the tone of the feedback and the rewards to your age. It updates every year, all by itself.",
    beispielJahr: "e.g. 2016",
    alterVonLehrkraft: "Your teacher has already set the age for your practice texts. Right now it's: ",
    alterVonLehrkraft2:
      "If the texts are too easy or too hard, tell your teacher - they can change it in “My classes”. You just carry on here.",
    spracheSatz:
      "This is about the words and stories you practise. The buttons and menus stay in English.",
    spracheHauptSatz: (name: string) =>
      `The language of this course: ${name}. You can also practise English - the keys still come in this course's order.`,
    // ★ E8 (24.09.2026, Bauplan §7/§10): „choose German" war schlechter Rat
    // für eine englische Bedienung - sie wählt seit E2 von selbst US oder UK
    // vor (siehe `vorschlagLayout` oben), nie Deutsch. Der Satz nennt jetzt
    // die schon getroffene Vorauswahl, statt eine deutsche Tastatur
    // vorzuschlagen, die hier nie die richtige Antwort ist.
    tastaturSatz:
      "The on-screen keyboard, the spoken finger hints and the characters you practise all follow this. If in doubt, keep the keyboard already selected for you below.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `This course teaches the keyboard of its country, so only ${tastaturDesLandes("en", weg)} keyboards are offered. The keyboard currently set, “${name}”, does not match. Choose one of the keyboards here.`,
    startSatz:
      "If you can already type, you don't have to start with F and J. You can move it up at any time later.",
    tonSatz:
      "“Read aloud” speaks the tasks and feedback out loud - it's meant for everyone who does NOT use a screen reader. With NVDA, JAWS or VoiceOver it's best to leave it off, or two voices will talk at once.",
    ton: (aus: boolean) => (aus ? "Sound off" : "Sound on"),
    tonErklaerung: "Sounds for stars, badges and in the game.",
    vorlesen: (an: boolean) => (an ? "Read aloud: on" : "Read aloud: off"),
    vorlesenErklaerung: "The app reads the tasks and feedback aloud.",
    vorlesenAusAnsage: "Reading aloud off.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Do you listen to your screen reader's speech while you type (without a braille display)?",
    screenreaderErklaerung:
      "For JAWS and NVDA. “Yes” turns on “Spell out” - then your screen reader says the next key as you type. You can also find it in the settings (Alt + O).",
    ja: "Yes",
    nein: "No",
    buchstabierenAnsage: (an: boolean) => (an ? "Spell out on." : "Spell out off."),
    // Kommt in der englischen Bedienung nie vor (kein Podcast, siehe `lage`) -
    // steht nur da, damit die Tabelle vollständig ist.
    podcastSatz: (dauer: string) => [
      "Before you start: a short episode (",
      dauer,
      ") about how the app works and what the home position is.",
    ],
    fertigSatz: "This is how Tastenflow is set up now:",
    zurueck: "Back",
    neuStarten: " Start again: Alt + R.",
  },
  // ★ E11a: „tu" - die Einrichtung spricht immer die lernende Person an (F9).
  fr: {
    fortschritt: (n: number, gesamt: number) => ["Configuration - étape ", n, " sur ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow t'apprend à taper avec dix doigts - sans regarder le clavier. En ",
      gesamt,
      " étapes courtes, nous réglons le programme pour toi : ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      'Cela prend moins d\'une minute. Si tu préfères commencer tout de suite, choisis "',
      skip,
      '" - les réglages par défaut s\'appliquent alors.',
    ],
    alterFrage:
      "Dis-nous ton année de naissance. Le programme sait ainsi quel âge tu as - et adapte les textes d'exercice, le ton des retours et les récompenses en conséquence. Chaque année, tout seul.",
    beispielJahr: "par ex. 2016",
    alterVonLehrkraft: "Ton enseignant ou ton enseignante a déjà réglé l'âge pour tes textes d'exercice. En ce moment : ",
    alterVonLehrkraft2:
      'Si les textes sont trop faciles ou trop difficiles, dis-le-lui - elle ou il peut le changer dans "Mes classes". Tu continues simplement ici.',
    spracheSatz: "Il s'agit des mots d'exercice et des histoires. Les boutons et menus restent en français.",
    spracheHauptSatz: (name: string) =>
      `La langue de ce parcours : ${name}. Tu peux aussi t'entrainer en anglais - les touches arrivent quand même dans l'ordre de ce parcours.`,
    tastaturSatz:
      "Le clavier à l'écran, les annonces de doigts et les caractères exercés en dépendent. Dans le doute : garde le clavier déjà choisi ci-dessous.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Ce parcours enseigne le clavier de son pays : seuls les claviers ${tastaturDesLandes("fr", weg)} sont proposés. Le clavier réglé (${name}) ne correspond pas. Choisis un des claviers ici.`,
    startSatz:
      "Qui sait déjà taper n'a pas besoin de commencer par F et J. Tu peux relever le niveau plus tard, à tout moment.",
    tonSatz:
      'Lire à voix haute prononce les activités et les retours - pensé pour les personnes qui n\'utilisent PAS de lecteur d\'écran. Avec NVDA, JAWS ou VoiceOver, mieux vaut le laisser désactivé, sinon deux voix parlent en même temps.',
    ton: (aus: boolean) => (aus ? "Son désactivé" : "Son activé"),
    tonErklaerung: "Sons pour les étoiles, les badges et dans le jeu.",
    vorlesen: (an: boolean) => (an ? "Lecture à voix haute activée" : "Lecture à voix haute désactivée"),
    vorlesenErklaerung: "L'application lit les activités et les retours à voix haute.",
    vorlesenAusAnsage: "Lecture à voix haute désactivée.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Quand tu tapes, écoutes-tu la voix de ton lecteur d'écran (sans afficheur braille) ?",
    screenreaderErklaerung:
      "Pour JAWS et NVDA. \"Oui\" active \"Épeler\" - ton lecteur d'écran annonce alors la touche suivante pendant que tu tapes. Tu le trouves aussi dans les réglages (Alt + O).",
    ja: "Oui",
    nein: "Non",
    buchstabierenAnsage: (an: boolean) => (an ? "Épeler activé." : "Épeler désactivé."),
    podcastSatz: (dauer: string) => [
      "Avant de commencer : un court épisode (",
      dauer,
      ") sur le fonctionnement du programme et sur la position de départ - dans la version qui correspond à ton choix. Tu peux aussi continuer directement et l'écouter plus tard dans les réglages (la roue dentée) sous \"Introduction\".",
    ],
    fertigSatz: "Voici comment Tastenflow est réglé maintenant :",
    zurueck: "Retour",
    neuStarten: " Recommencer : Alt + R.",
  },
  // ★ ES-O (27.09.2026): tú (Bauplan S9). `podcastSatz` kommt auf Spanisch nie
  // vor (kein Pódcast, `mitPodcast` nur für „de") - steht nur für den Typ.
  es: {
    fortschritt: (n: number, gesamt: number) => ["Configuración - paso ", n, " de ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow te enseña a escribir con diez dedos - sin mirar el teclado. En ",
      gesamt,
      " pasos cortos ajustamos el programa para ti: ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      'Tarda menos de un minuto. Si prefieres empezar enseguida, elige "',
      skip,
      '" - entonces valen los ajustes predeterminados.',
    ],
    alterFrage:
      "Dinos tu año de nacimiento. Así el programa sabe cuántos años tienes y adapta a ello los textos de práctica, el tono de los comentarios y las recompensas. Cada año, solo.",
    beispielJahr: "p. ej. 2016",
    alterVonLehrkraft: "Tu docente ya ha elegido la edad de tus textos de práctica. Ahora mismo: ",
    alterVonLehrkraft2:
      'Si los textos te resultan demasiado fáciles o demasiado difíciles, díselo - puede cambiarlo en "Mis clases". Tú sigue aquí sin más.',
    spracheSatz: "Se trata de las palabras de práctica y de los cuentos. Los botones y los menús siguen en español.",
    spracheHauptSatz: (name: string) =>
      `El idioma de este recorrido: ${name}. También puedes practicar en inglés - las teclas llegan igualmente en el orden de este recorrido.`,
    tastaturSatz:
      "De él dependen el teclado en pantalla, los avisos de los dedos y los caracteres que practicas. Si tienes dudas, deja el teclado que ya está elegido abajo.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Este recorrido enseña el teclado de su país: por eso solo se ofrecen teclados ${tastaturDesLandes("es", weg)}. El teclado elegido, "${name}", no corresponde. Elige uno de los teclados de aquí.`,
    startSatz:
      "Quien ya sabe escribir no tiene que empezar por F y J. Puedes subir el nivel más tarde, en cualquier momento.",
    tonSatz:
      "La lectura en voz alta lee las actividades y los comentarios - pensada para personas que NO usan lector de pantalla. Con NVDA, JAWS o VoiceOver es mejor dejarla desactivada; si no, hablan dos voces a la vez.",
    ton: (aus: boolean) => (aus ? "Sonido desactivado" : "Sonido activado"),
    tonErklaerung: "Sonidos para las estrellas, las insignias y en el juego.",
    vorlesen: (an: boolean) => (an ? "Lectura en voz alta activada" : "Lectura en voz alta desactivada"),
    vorlesenErklaerung: "La aplicación lee en voz alta las actividades y los comentarios.",
    vorlesenAusAnsage: "Lectura en voz alta desactivada.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "¿Escuchas la voz de tu lector de pantalla mientras escribes (sin línea braille)?",
    screenreaderErklaerung:
      "Para JAWS y NVDA. \"Sí\" activa \"Deletrear\": tu lector de pantalla dice la tecla siguiente mientras escribes. También lo encuentras en la configuración (Alt + O).",
    ja: "Sí",
    nein: "No",
    buchstabierenAnsage: (an: boolean) => (an ? "Deletrear activado." : "Deletrear desactivado."),
    podcastSatz: (dauer: string) => [
      "Antes de empezar: un episodio corto (",
      dauer,
      ") sobre cómo funciona el programa y sobre la posición inicial. También puedes seguir directamente y escucharlo más tarde en la configuración (la rueda dentada), en \"Introducción\".",
    ],
    fertigSatz: "Así está configurado Tastenflow ahora:",
    zurueck: "Volver",
    neuStarten: " Volver a empezar: Alt + R.",
  },
  // ★ O-IT (02.10.2026): Kind und Selbstlernende „tu"; „l'insegnante" (Regel 2),
  // „senza guardare la tastiera" (Regel 4), „configurazione · Passo 2 di 7" (§2.5).
  it: {
    fortschritt: (n: number, gesamt: number) => ["Configurazione - passo ", n, " di ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow ti insegna a scrivere con dieci dita - senza guardare la tastiera. In ",
      gesamt,
      " brevi passi regoliamo il programma per te: ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      `Ci vuole meno di un minuto. Se preferisci iniziare subito, scegli "`,
      skip,
      `" - allora valgono le impostazioni predefinite.`,
    ],
    alterFrage:
      "Scrivi il tuo anno di nascita. Così il programma sa quanti anni hai e adatta i testi di esercizio, il tono dei messaggi e le ricompense. Ogni anno, da solo.",
    beispielJahr: "ad es. 2016",
    alterVonLehrkraft: "L'insegnante ha già scelto l'età dei tuoi testi di esercizio. Adesso: ",
    alterVonLehrkraft2:
      `Se i testi ti sembrano troppo facili o troppo difficili, dillo all'insegnante - può cambiarlo in "Le mie classi". Tu intanto vai avanti qui.`,
    spracheSatz: "Riguarda le parole di esercizio e le storie. I pulsanti e i menu restano in italiano.",
    spracheHauptSatz: (name: string) =>
      `La lingua di questo percorso: ${name}. Puoi esercitarti anche in inglese - i tasti arrivano comunque nell'ordine di questo percorso.`,
    tastaturSatz:
      "Da qui dipendono la tastiera sullo schermo, i suggerimenti per le dita e i caratteri che eserciti. Se hai dubbi, lascia la tastiera già scelta qui sotto.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Questo percorso insegna la tastiera del suo paese: per questo ci sono solo tastiere ${tastaturDesLandes("it", weg)}. La tastiera scelta, "${name}", non corrisponde. Scegli una delle tastiere qui.`,
    startSatz:
      "Chi sa già scrivere non deve iniziare da F e J. Puoi alzare il livello più tardi, in qualsiasi momento.",
    tonSatz:
      "La lettura ad alta voce legge le attività e i messaggi - pensata per chi NON usa un lettore di schermo. Con NVDA, JAWS o VoiceOver è meglio lasciarla disattivata; altrimenti parlano due voci insieme.",
    ton: (aus: boolean) => (aus ? "Suono: no" : "Suono: sì"),
    tonErklaerung: "Suoni per le stelle, le medaglie e nel gioco.",
    vorlesen: (an: boolean) => (an ? "Lettura ad alta voce: sì" : "Lettura ad alta voce: no"),
    vorlesenErklaerung: "Il programma legge ad alta voce le attività e i messaggi.",
    vorlesenAusAnsage: "Lettura ad alta voce disattivata.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Mentre scrivi, ascolti la voce del tuo lettore di schermo (senza display braille)?",
    screenreaderErklaerung:
      "Per JAWS e NVDA. \"Sì\" attiva \"Tasto per tasto\": il lettore di schermo dice il tasto successivo mentre scrivi. Lo trovi anche nelle impostazioni (Alt + O).",
    ja: "Sì",
    nein: "No",
    buchstabierenAnsage: (an: boolean) => (an ? "Tasto per tasto: sì." : "Tasto per tasto: no."),
    podcastSatz: (dauer: string) => [
      "Prima di iniziare: un breve episodio (",
      dauer,
      `) su come funziona il programma e sulla posizione base. Puoi anche andare avanti subito e ascoltarlo più tardi nelle impostazioni (l'ingranaggio), in "Introduzione".`,
    ],
    fertigSatz: "Ecco come è impostato ora Tastenflow:",
    zurueck: "Indietro",
    neuStarten: " Ricominciare: Alt + R.",
  },
  // ★ O-PL (02.10.2026): Kind und Selbstlernende „ty"; ohne Vergangenheit 2.
  // Person und ohne Adjektiv am Kind (Regel 2); Knopfname ohne Anführung mit
  // „przycisk" davor, sonst „…” (Regel 8); „Konfiguracja - krok 2 z 7" (§2.5).
  pl: {
    fortschritt: (n: number, gesamt: number) => ["Konfiguracja - krok ", n, " z ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow uczy cię pisać dziesięcioma palcami - bez patrzenia na klawiaturę. W ",
      gesamt,
      " krótkich krokach ustawimy program dla ciebie: ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      "To zajmie mniej niż minutę. Jeśli wolisz od razu zacząć pisać, naciśnij przycisk ",
      skip,
      " - wtedy obowiązują ustawienia domyślne.",
    ],
    alterFrage:
      "Podaj swój rok urodzenia. Dzięki temu program wie, ile masz lat - i dopasowuje do tego teksty ćwiczeń, ton komunikatów i nagrody. Co roku na nowo, automatycznie.",
    beispielJahr: "np. 2016",
    alterVonLehrkraft: "Wiek twoich tekstów ćwiczeń jest już ustawiony w klasie. Teraz obowiązuje: ",
    alterVonLehrkraft2:
      "Jeśli teksty są za łatwe albo za trudne, powiedz o tym nauczycielowi lub nauczycielce - można to zmienić w zakładce „Moje klasy”. Ty po prostu idź dalej.",
    spracheSatz: "Chodzi o słowa i opowiadania do ćwiczeń. Menu i przyciski zostają po polsku.",
    spracheHauptSatz: (name: string) =>
      `Język tego kursu: ${name}. Możesz też ćwiczyć po angielsku - klawisze i tak pojawiają się w kolejności tego kursu.`,
    tastaturSatz:
      "Od tego zależą klawiatura ekranowa, podpowiedzi dla palców i znaki, które ćwiczysz. W razie wątpliwości zostaw klawiaturę, która jest już wybrana poniżej.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Ten kurs uczy klawiatury swojego kraju, dlatego do wyboru są tylko klawiatury ${tastaturDesLandes("pl", weg)}. Ustawiona klawiatura („${name}”) do niego nie pasuje. Wybierz jedną z klawiatur tutaj.`,
    startSatz:
      "Kto już umie pisać, nie musi zaczynać od F i J. Punkt startowy możesz później w każdej chwili podnieść.",
    tonSatz:
      "Czytanie na głos wypowiada zadania i komunikaty - jest dla osób, które NIE używają czytnika ekranu. Z NVDA, JAWS albo VoiceOver lepiej je wyłączyć, bo inaczej mówią dwa głosy naraz.",
    ton: (aus: boolean) => (aus ? "Dźwięk: wyłączony" : "Dźwięk: włączony"),
    tonErklaerung: "Dźwięki przy gwiazdkach, odznakach i w grze.",
    vorlesen: (an: boolean) => (an ? "Czytanie na głos: włączone" : "Czytanie na głos: wyłączone"),
    vorlesenErklaerung: "Program czyta na głos zadania i komunikaty.",
    vorlesenAusAnsage: "Czytanie na głos wyłączone.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Czy podczas pisania słuchasz mowy swojego czytnika ekranu (bez monitora brajlowskiego)?",
    screenreaderErklaerung:
      "Dla JAWS i NVDA. Przycisk Tak włącza „Klawisz po klawiszu” - wtedy czytnik ekranu podczas pisania mówi następny klawisz. Znajdziesz to też w ustawieniach (Alt + O).",
    ja: "Tak",
    nein: "Nie",
    buchstabierenAnsage: (an: boolean) => (an ? "Klawisz po klawiszu: włączony." : "Klawisz po klawiszu: wyłączony."),
    // Kommt auf Polnisch nie vor (kein Podcast, `mitPodcast` nur für „de") - steht für den Typ.
    podcastSatz: (dauer: string) => [
      "Zanim zaczniesz: krótki odcinek (",
      dauer,
      ") o tym, jak działa program i czym jest pozycja podstawowa. Możesz też od razu przejść dalej i posłuchać go później w ustawieniach (koło zębate), w części „Wprowadzenie”.",
    ],
    fertigSatz: "Tak jest teraz ustawiony program Tastenflow:",
    zurueck: "Wstecz",
    neuStarten: " Zacznij od nowa: Alt + R.",
  },
  // ★ O-TR (02.10.2026): Kind und Selbstlernende "sen" (Glossar Regel 1);
  // "Kurulum - Adım 2, toplam 7" (§2.5, nie "2 / 7"); Knopfname in geraden
  // Anführungszeichen mit "düğmesine bas" (Regel 7); keine Endung an
  // Platzhalter, Zahl oder "Tastenflow" (Regel 6); "on parmak klavye",
  // "klavyeye bakmadan" (Regel 4).
  tr: {
    fortschritt: (n: number, gesamt: number) => ["Kurulum - Adım ", n, ", toplam ", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow ile on parmak klavyeyi öğrenirsin: klavyeye bakmadan, on parmakla yazmayı. ",
      gesamt,
      " kısa adımda programı sana göre ayarlıyoruz: ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      `Bir dakikadan kısa sürer. Hemen yazmaya başlamak istersen "`,
      skip,
      `" düğmesine bas - o zaman varsayılan ayarlar geçerli olur.`,
    ],
    alterFrage:
      "Doğum yılını yaz. Program buradan kaç yaşında olduğunu anlar - alıştırma metinlerini, mesajların dilini ve ödülleri buna göre ayarlar. Her yıl kendiliğinden yeniden.",
    beispielJahr: "örn. 2016",
    alterVonLehrkraft: "Alıştırma metinlerinin yaşını öğretmenin zaten ayarladı. Şu an geçerli olan: ",
    alterVonLehrkraft2:
      `Metinler çok kolay ya da çok zor gelirse öğretmenine söyle - "Sınıflarım" bölümünden değiştirebilir. Sen burada devam et.`,
    spracheSatz: "Burada alıştırma kelimeleri ve öyküler kastediliyor. Menüler ve düğmeler Türkçe kalır.",
    spracheHauptSatz: (name: string) =>
      `Bu kursun dili: ${name}. İstersen İngilizce de çalışabilirsin - tuşlar yine bu kursun sırasıyla gelir.`,
    tastaturSatz:
      "Ekran klavyesi, parmak ipuçları ve çalıştığın işaretler buna göre belirlenir. Emin değilsen aşağıda zaten seçili olan klavyeyi bırak.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Bu kurs kendi ülkesinin klavyesini öğretir; bu yüzden yalnızca ${tastaturDesLandes("tr", weg)} klavyeler seçilebilir. Ayarlı klavye ("${name}") bu kursa uymuyor. Buradaki klavyelerden birini seç.`,
    startSatz:
      "Zaten yazabilen biri F ve J tuşlarından başlamak zorunda değil. Başlangıç noktasını daha sonra istediğin zaman yükseltebilirsin.",
    tonSatz:
      "Sesli okuma, görevleri ve mesajları sesli söyler - ekran okuyucu KULLANMAYANLAR için. NVDA, JAWS ya da VoiceOver kullanıyorsan kapalı bırakman daha iyi; yoksa iki ses aynı anda konuşur.",
    ton: (aus: boolean) => (aus ? "Ses efektleri: kapalı" : "Ses efektleri: açık"),
    tonErklaerung: "Yıldızlarda, rozetlerde ve oyunda sesler.",
    vorlesen: (an: boolean) => (an ? "Sesli okuma: açık" : "Sesli okuma: kapalı"),
    vorlesenErklaerung: "Program görevleri ve mesajları sesli okur.",
    vorlesenAusAnsage: "Sesli okuma kapalı.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Yazarken ekran okuyucunun sesini dinliyor musun (braille ekran olmadan)?",
    screenreaderErklaerung:
      "JAWS ve NVDA için. \"Evet\" düğmesi \"Harf harf\" ayarını açar - ekran okuyucu yazarken sıradaki tuşu söyler. Bu ayar Ayarlar bölümünde de var (Alt + O).",
    ja: "Evet",
    nein: "Hayır",
    buchstabierenAnsage: (an: boolean) => (an ? "Harf harf: açık." : "Harf harf: kapalı."),
    // Kommt auf Türkisch nie vor (kein Podcast, `mitPodcast` nur für "de") - steht für den Typ.
    podcastSatz: (dauer: string) => [
      "Başlamadan önce kısa bir bölüm (",
      dauer,
      `): programın nasıl çalıştığı ve temel konumun ne olduğu üzerine. İstersen hemen devam edip daha sonra Ayarlar (çark simgesi) içindeki "Tanıtım" bölümünde dinleyebilirsin.`,
    ],
    fertigSatz: "Tastenflow şu an böyle ayarlı:",
    zurueck: "Geri",
    neuStarten: " Yeniden başlat: Alt + R.",
  },
  // ★ O-CS (03.10.2026): Kind und Selbstlernende „ty" (Glossar Regel 1);
  // „Úvodní nastavení - krok 2/7" (§2.5, Regel 13: Schrägstrich statt „z 7");
  // Knopfname ohne Anführung (Regel 7); „psaní všemi deseti", „bez dívání na
  // klávesnici" (Regel 4); keine Vergangenheit 2. Person, kein Adjektiv am
  // Kind („Když nevíš", nie „Když si nejsi jistý", Regel 2); die Ziffernreihe
  // trägt Buchstaben (§2.9 Schluss, §4 Falle 1).
  cs: {
    fortschritt: (n: number, gesamt: number) => ["Úvodní nastavení - krok ", n, "/", gesamt],
    willkommen1: (gesamt: number, liste: string) => [
      "Tastenflow tě naučí psát všemi deseti - bez dívání na klávesnici. Program ti nastavíme v pár krátkých krocích (celkem ",
      gesamt,
      "): ",
      liste,
      ".",
    ],
    willkommen2: (skip: string) => [
      "Nezabere to ani minutu. Pokud chceš psát hned, vyber ",
      skip,
      " - pak platí výchozí nastavení.",
    ],
    alterFrage:
      "Napiš svůj rok narození. Podle něj program pozná, kolik ti je let - a přizpůsobí tomu texty na cvičení, tón hlášení i odměny. A to každý rok znovu, úplně automaticky.",
    beispielJahr: "např. 2016",
    alterVonLehrkraft: "Věk pro tvoje texty na cvičení už určuje tvoje třída. Teď platí: ",
    alterVonLehrkraft2:
      "Když jsou texty moc lehké nebo moc těžké, řekni to ve třídě - v části Moje třídy se to dá změnit. Ty tady prostě pokračuj.",
    spracheSatz: "Jde o slova a příběhy na cvičení. Ovládání zůstane v češtině.",
    spracheHauptSatz: (name: string) =>
      `Jazyk tohoto kurzu: ${name}. Navíc můžeš cvičit i angličtinu - klávesy ale přicházejí v pořadí tohoto kurzu.`,
    tastaturSatz:
      "Podle ní se řídí klávesnice na obrazovce, hlášení prstů a znaky, které se cvičí. Na české klávesnici jsou na číselné řadě písmena ě š č ř ž ý á í é - číslice napíšeš s klávesou Shift. Když nevíš, nech klávesnici, která je už vybraná.",
    tastaturNichtImWeg: (weg: Lang, name: string) =>
      `Tento kurz učí klávesnici své země, proto jsou na výběr jen ${tastaturDesLandes("cs", weg)} klávesnice. Nastavená klávesnice (${name}) k němu nepasuje. Vyber jednu z klávesnic tady.`,
    startSatz:
      "Kdo už umí psát, nemusí začínat u F a J. Výchozí bod můžeš později kdykoli posunout výš.",
    tonSatz:
      "Předčítání samo nahlas čte úkoly a hlášení - je pro všechny, kdo NEPOUŽÍVAJÍ odečítač obrazovky. S NVDA, JAWS nebo VoiceOver ho raději nech vypnuté, jinak budou mluvit dva hlasy najednou.",
    ton: (aus: boolean) => (aus ? "Zvuk: vypnuto" : "Zvuk: zapnuto"),
    tonErklaerung: "Zvuky u hvězdiček, odznaků a ve hře.",
    vorlesen: (an: boolean) => (an ? "Předčítání: zapnuto" : "Předčítání: vypnuto"),
    vorlesenErklaerung: "Aplikace nahlas čte úkoly a hlášení.",
    vorlesenAusAnsage: "Předčítání vypnuto.",
    // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
    screenreaderFrage: "Posloucháš při psaní řeč svého odečítače obrazovky (bez braillského řádku)?",
    screenreaderErklaerung:
      "Pro JAWS a NVDA. Ano zapne Klávesa po klávese - odečítač pak při psaní řekne další klávesu. Najdeš to i v Nastavení (Alt + O).",
    ja: "Ano",
    nein: "Ne",
    buchstabierenAnsage: (an: boolean) => (an ? "Klávesa po klávese: zapnuto." : "Klávesa po klávese: vypnuto."),
    // Kommt auf Tschechisch nie vor (kein Podcast, `mitPodcast` nur für „de") - steht für den Typ.
    podcastSatz: (dauer: string) => [
      "Než začneš: krátká epizoda (",
      dauer,
      ") o tom, jak je program postavený a co je základní postavení. Můžeš také rovnou pokračovat a poslechnout si ji později v Nastavení (ozubené kolo) v části Úvod.",
    ],
    fertigSatz: "Takhle je teď Tastenflow nastavený:",
    zurueck: "Zpět",
    neuStarten: " Začít znovu: Alt + R.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      fortschritt: (n: number, gesamt: number) => ["Първоначална настройка · Стъпка ", n, "/", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "Tastenflow те учи да пишеш с десет пръста - без да гледаш клавиатурата. В ",
        gesamt,
        " кратки стъпки ще настроим програмата за теб: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Това отнема по-малко от минута. Ако искаш да започнеш да пишеш веднага, избери „",
        skip,
        "“ - тогава важат настройките по подразбиране.",
      ],
      alterFrage:
        "Напиши годината си на раждане. Така програмата знае на колко години си - и според това настройва текстовете за упражнение, тона на съобщенията и наградите. Всяка година това става отново, от само себе си.",
      beispielJahr: "напр. 2016",
      alterVonLehrkraft: "Възрастта за текстовете за упражнение вече е настроена от учителя. В момента важи: ",
      alterVonLehrkraft2:
        "Ако текстовете са твърде лесни или твърде трудни, кажи на учителя - настройката се променя в „Моите класове“. Тук просто продължаваш напред.",
      spracheSatz:
        "Става дума за думите и историите, с които се упражняваш. Менютата и бутоните остават на български.",
      spracheHauptSatz: (name: string) =>
        `Езикът на този курс: ${name}. Можеш да се упражняваш и на английски - клавишите пак идват в реда на този курс.`,
      tastaturSatz:
        "Според нея се настройват екранната клавиатура, съобщенията за пръстите и знаците, които упражняваш. Ако се колебаеш, остави клавиатурата, която вече е избрана по-долу.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Този курс учи клавиатурата на своята страна - затова за избор има само ${tastaturDesLandes("bg", weg)} клавиатури. Настроената клавиатура „${name}“ не подхожда. Избери една от клавиатурите тук.`,
      startSatz:
        "Ако вече можеш да пишеш, не е нужно да започваш от първите два клавиша. По-късно можеш да преместиш началото напред по всяко време.",
      tonSatz:
        "„Четене на глас“ изговаря задачите и съобщенията - за всички, които НЕ използват екранен четец. С NVDA, JAWS или VoiceOver е по-добре да остане изключено, иначе два гласа говорят едновременно.",
      ton: (aus: boolean) => (aus ? "Звук: изкл." : "Звук: вкл."),
      tonErklaerung: "Звуци при звездички, значки и в играта.",
      vorlesen: (an: boolean) => (an ? "Четене на глас: вкл." : "Четене на глас: изкл."),
      vorlesenErklaerung: "Програмата чете на глас задачите и съобщенията.",
      vorlesenAusAnsage: "Четене на глас: изключено.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Слушаш ли гласа на екранния си четец, докато пишеш (без брайлов дисплей)?",
      screenreaderErklaerung:
        "За JAWS и NVDA. „Да“ включва „Клавиш по клавиш“ - тогава екранният четец казва следващия клавиш, докато пишеш. Това го има и в настройките (Alt + O).",
      ja: "Да",
      nein: "Не",
      buchstabierenAnsage: (an: boolean) => (an ? "Клавиш по клавиш: вкл." : "Клавиш по клавиш: изкл."),
      // Wie en: in der bulgarischen Bedienung gibt es keinen Podcast - nur der Vollständigkeit halber.
      podcastSatz: (dauer: string) => [
        "Преди да започнеш: кратък епизод (",
        dauer,
        ") за това как е устроена програмата и какво е изходната позиция.",
      ],
      fertigSatz: "Ето как е настроен Tastenflow сега:",
      zurueck: "Обратно",
      neuStarten: " Започни отначало: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      fortschritt: (n: number, gesamt: number) => ["Αρχικές ρυθμίσεις - Βήμα ", n, " από ", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "Το Tastenflow σού μαθαίνει να γράφεις με τα δέκα δάχτυλα - χωρίς να κοιτάζεις το πληκτρολόγιο. Σε ",
        gesamt,
        " σύντομα βήματα ρυθμίζουμε το πρόγραμμα για σένα: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Χρειάζεται λιγότερο από ένα λεπτό. Αν θέλεις να αρχίσεις να γράφεις αμέσως, διάλεξε «",
        skip,
        "» - τότε ισχύουν οι προεπιλεγμένες ρυθμίσεις.",
      ],
      alterFrage:
        "Γράψε το έτος γέννησής σου. Έτσι το πρόγραμμα ξέρει πόσο χρονών είσαι - και ταιριάζει σε αυτό τα κείμενα εξάσκησης, το ύφος των μηνυμάτων και τις επιβραβεύσεις. Κάθε χρόνο από την αρχή, εντελώς μόνο του.",
      beispielJahr: "π.χ. 2016",
      alterVonLehrkraft: "Την ηλικία για τα κείμενα εξάσκησής σου την έχουν ήδη ορίσει οι εκπαιδευτικοί σου. Τώρα ισχύει: ",
      alterVonLehrkraft2:
        "Αν τα κείμενα είναι πολύ εύκολα ή πολύ δύσκολα, πες το στους εκπαιδευτικούς σου - μπορούν να το αλλάξουν στα «Τα τμήματά μου». Εσύ απλώς συνεχίζεις εδώ.",
      spracheSatz:
        "Εννοούνται οι λέξεις και οι ιστορίες της εξάσκησης. Η γλώσσα του προγράμματος μένει στα Ελληνικά.",
      spracheHauptSatz: (name: string) =>
        `Η γλώσσα αυτής της διαδρομής μάθησης: ${name}. Μπορείς να εξασκηθείς και στα Αγγλικά - τα πλήκτρα έρχονται όμως με τη σειρά αυτής της διαδρομής.`,
      tastaturSatz:
        "Από αυτό εξαρτώνται το πληκτρολόγιο οθόνης, οι οδηγίες για τα δάχτυλα και οι χαρακτήρες που εξασκείς. Αν έχεις αμφιβολία, κράτα το πληκτρολόγιο που είναι ήδη επιλεγμένο παρακάτω.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Αυτή η διαδρομή μάθησης διδάσκει το πληκτρολόγιο της χώρας της, έτσι προσφέρονται μόνο ${tastaturDesLandes("el", weg)} πληκτρολόγια. Το πληκτρολόγιο που έχει οριστεί, «${name}», δεν ταιριάζει. Διάλεξε ένα από τα πληκτρολόγια εδώ.`,
      startSatz:
        "Αν ξέρεις ήδη να γράφεις, δεν χρειάζεται να ξεκινήσεις από το Φ και το Ξ. Μπορείς να το ανεβάσεις αργότερα όποτε θέλεις.",
      tonSatz:
        "Η «Εκφώνηση» διαβάζει δυνατά τις εργασίες και τα μηνύματα - είναι για όλους όσοι ΔΕΝ χρησιμοποιούν αναγνώστη οθόνης. Με NVDA, JAWS ή VoiceOver καλύτερα άφησέ την ανενεργή, αλλιώς μιλούν δύο φωνές μαζί.",
      ton: (aus: boolean) => (aus ? "Ήχος: ανενεργός" : "Ήχος: ενεργός"),
      tonErklaerung: "Ήχοι για τα αστέρια, τα μετάλλια και στο παιχνίδι.",
      vorlesen: (an: boolean) => (an ? "Εκφώνηση: ενεργή" : "Εκφώνηση: ανενεργή"),
      vorlesenErklaerung: "Το πρόγραμμα διαβάζει δυνατά τις εργασίες και τα μηνύματα.",
      vorlesenAusAnsage: "Εκφώνηση ανενεργή.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Ακούς τη φωνή του αναγνώστη οθόνης σου όταν γράφεις (χωρίς οθόνη Braille);",
      screenreaderErklaerung:
        "Για JAWS και NVDA. Το «Ναι» ενεργοποιεί το «Πλήκτρο πλήκτρο» - τότε ο αναγνώστης οθόνης λέει το επόμενο πλήκτρο όσο γράφεις. Το βρίσκεις και στις ρυθμίσεις (Alt + O).",
      ja: "Ναι",
      nein: "Όχι",
      buchstabierenAnsage: (an: boolean) => (an ? "Πλήκτρο πλήκτρο: ενεργό." : "Πλήκτρο πλήκτρο: ανενεργό."),
      // Wie en: kein griechischer Podcast - steht nur da, damit die Tabelle vollständig ist.
      podcastSatz: (dauer: string) => [
        "Πριν ξεκινήσεις: ένα σύντομο επεισόδιο (",
        dauer,
        ") για το πώς λειτουργεί το πρόγραμμα και τι είναι η βασική θέση.",
      ],
      fertigSatz: "Έτσι είναι τώρα ρυθμισμένο το Tastenflow:",
      zurueck: "Πίσω",
      neuStarten: " Ξανά από την αρχή: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      fortschritt: (n: number, gesamt: number) => ["Első beállítás · Lépés: ", n, "/", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "A Tastenflow megtanít tíz ujjal gépelni - a billentyűzet nézése nélkül. Néhány rövid lépésben (összesen ",
        gesamt,
        ") beállítjuk neked a programot: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Egy percig sem tart. Ha inkább rögtön gépelnél, válaszd ezt: „",
        skip,
        "” - akkor az alapbeállítások érvényesek.",
      ],
      alterFrage:
        "Add meg a születési évedet. Ebből tudja a program, hány éves vagy - és ehhez igazítja a gyakorló szövegeket, a visszajelzések hangnemét és a jutalmakat. Minden évben magától frissül.",
      beispielJahr: "pl. 2016",
      alterVonLehrkraft: "A gyakorló szövegeidhez az életkort már beállította a tanárod. Most ez érvényes: ",
      alterVonLehrkraft2:
        "Ha a szövegek túl könnyűek vagy túl nehezek, szólj a tanárodnak - az „Osztályaim” oldalon meg tudja változtatni. Te itt egyszerűen lépj tovább.",
      spracheSatz:
        "Ez a gyakorló szavakra és történetekre vonatkozik. A gombok és a menük magyarul maradnak.",
      spracheHauptSatz: (name: string) =>
        `Ennek a tanfolyamnak a nyelve: ${name}. Angolul is gyakorolhatsz - a billentyűk akkor is ennek a tanfolyamnak a sorrendjében jönnek.`,
      tastaturSatz:
        "Ehhez igazodik a képernyő-billentyűzet, az ujjakra vonatkozó bemondások, és az, hogy milyen jeleket gyakorolsz. Ha bizonytalan vagy, hagyd meg a lent már kiválasztott billentyűzetet.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Ez a tanfolyam a saját országa billentyűzetét tanítja - ezért csak ${tastaturDesLandes("hu", weg)} billentyűzetek közül választhatsz. A beállított billentyűzet („${name}”) nem illik hozzá. Válassz egyet az itteni billentyűzetek közül.`,
      startSatz:
        "Aki már tud gépelni, annak nem kell az F és a J billentyűnél kezdenie. Ezt később bármikor feljebb állíthatod.",
      tonSatz:
        "A „Felolvasás” maga mondja ki a feladatokat és a visszajelzéseket - mindenkinek, aki NEM használ képernyőolvasót. NVDA, JAWS vagy VoiceOver mellett jobb kikapcsolva hagyni, különben két hang beszél egyszerre.",
      ton: (aus: boolean) => (aus ? "Hang ki" : "Hang be"),
      tonErklaerung: "Hangok a csillagoknál, a jelvényeknél és a játékban.",
      vorlesen: (an: boolean) => (an ? "Felolvasás: be" : "Felolvasás: ki"),
      vorlesenErklaerung: "A program felolvassa a feladatokat és a visszajelzéseket.",
      vorlesenAusAnsage: "Felolvasás kikapcsolva.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Gépelés közben a képernyőolvasód hangját hallgatod (Braille-kijelző nélkül)?",
      screenreaderErklaerung:
        "JAWS és NVDA esetén. Az „Igen” bekapcsolja a „Billentyűnként” beállítást - ekkor a képernyőolvasó gépelés közben kimondja a következő billentyűt. A beállításokban is megtalálod (Alt + O).",
      ja: "Igen",
      nein: "Nem",
      buchstabierenAnsage: (an: boolean) => (an ? "Billentyűnként: be." : "Billentyűnként: ki."),
      // Wie en: in der ungarischen Bedienung gibt es keinen Podcast - steht nur für die Vollständigkeit da.
      podcastSatz: (dauer: string) => [
        "Mielőtt elkezded: egy rövid epizód (",
        dauer,
        ") arról, hogyan működik a program, és mi az alapállás.",
      ],
      fertigSatz: "Így van most beállítva a Tastenflow:",
      zurueck: "Vissza",
      neuStarten: " Újrakezdés: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      fortschritt: (n: number, gesamt: number) => ["Eerste stappen · Stap ", n, " van ", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "Met Tastenflow leer je typen met tien vingers - zonder naar het toetsenbord te kijken. In ",
        gesamt,
        " korte stappen stellen we de app op jou in: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Dat duurt nog geen minuut. Wil je liever meteen beginnen met typen, kies dan \"",
        skip,
        "\" - dan gelden de standaardinstellingen.",
      ],
      alterFrage:
        "Vertel ons je geboortejaar. Daaraan ziet de app hoe oud je bent - en ze past de oefenteksten, de toon van de reacties en de beloningen daarop aan. Elk jaar opnieuw, helemaal vanzelf.",
      beispielJahr: "bijvoorbeeld 2016",
      alterVonLehrkraft: "Je leerkracht heeft de leeftijd voor je oefenteksten al ingesteld. Op dit moment: ",
      alterVonLehrkraft2:
        "Zijn de teksten te makkelijk of te moeilijk, zeg het dan tegen je leerkracht - die kan het veranderen in \"Mijn klassen\". Jij gaat hier gewoon verder.",
      spracheSatz:
        "Het gaat om de woorden en verhalen die je oefent. De knoppen en menu's blijven in het Nederlands.",
      spracheHauptSatz: (name: string) =>
        `De taal van deze cursus: ${name}. Je kunt daarnaast ook Engels oefenen - de toetsen komen toch in de volgorde van deze cursus.`,
      tastaturSatz:
        "Het schermtoetsenbord, de vingeraanwijzingen en welke tekens je oefent, hangen hiervan af. Twijfel je? Laat dan het toetsenbord staan dat hieronder al voor je is gekozen.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Deze cursus leert het toetsenbord van zijn land - daarom kun je alleen kiezen uit ${tastaturDesLandes("nl", weg)} toetsenborden. Het ingestelde toetsenbord "${name}" past daar niet bij. Kies hier een van de toetsenborden.`,
      startSatz:
        "Kun je al typen? Dan hoef je niet bij F en J te beginnen. Je kunt het later altijd hoger zetten.",
      tonSatz:
        "\"Voorlezen\" spreekt opdrachten en reacties zelf uit - bedoeld voor iedereen die GEEN schermlezer gebruikt. Met NVDA, JAWS of VoiceOver laat je het beter uit, anders praten er twee stemmen tegelijk.",
      ton: (aus: boolean) => (aus ? "Geluid uit" : "Geluid aan"),
      tonErklaerung: "Geluiden bij sterren, medailles en in het spel.",
      vorlesen: (an: boolean) => (an ? "Voorlezen: aan" : "Voorlezen: uit"),
      vorlesenErklaerung: "De app leest opdrachten en reacties voor.",
      vorlesenAusAnsage: "Voorlezen uit.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Luister je tijdens het typen naar de spraak van je schermlezer (zonder brailleleesregel)?",
      screenreaderErklaerung:
        "Voor JAWS en NVDA. \"Ja\" zet \"Toets voor toets\" aan - dan zegt je schermlezer tijdens het typen de volgende toets. Je vindt het ook in de instellingen (Alt + O).",
      ja: "Ja",
      nein: "Nee",
      buchstabierenAnsage: (an: boolean) => (an ? "Toets voor toets: aan." : "Toets voor toets: uit."),
      // Wie in "en": in der niederländischen Bedienung gibt es keinen Podcast -
      // steht nur da, damit die Tabelle vollständig ist.
      podcastSatz: (dauer: string) => [
        "Voordat je begint: een korte aflevering (",
        dauer,
        ") over hoe de app werkt en wat de basishouding is.",
      ],
      fertigSatz: "Zo is Tastenflow nu ingesteld:",
      zurueck: "Terug",
      neuStarten: " Opnieuw beginnen: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      fortschritt: (n: number, gesamt: number) => ["Configuração inicial · Passo ", n, " de ", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "O Tastenflow ensina-te a escrever com os dez dedos, sem olhar para o teclado. Em ",
        gesamt,
        " passos curtos, ajustamos o programa a ti: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Demora menos de um minuto. Se preferires começar já a escrever, escolhe \"",
        skip,
        "\" - assim ficam as definições predefinidas.",
      ],
      alterFrage:
        "Diz-nos o teu ano de nascimento. Assim o programa sabe a tua idade - e ajusta a ela os textos de prática, o tom das mensagens e as recompensas. Todos os anos, automaticamente.",
      beispielJahr: "p. ex. 2016",
      alterVonLehrkraft: "A idade dos teus textos de prática já foi definida na tua turma. Neste momento: ",
      alterVonLehrkraft2:
        "Se os textos forem fáceis ou difíceis demais, diz isso na aula - pode ser alterado em \"As minhas turmas\". Aqui, continua simplesmente.",
      spracheSatz:
        "São as palavras e as histórias que praticas. Os botões e os menus ficam em português.",
      spracheHauptSatz: (name: string) =>
        `A língua deste curso: ${name}. Também podes praticar inglês - as teclas continuam a vir pela ordem deste curso.`,
      tastaturSatz:
        "O teclado no ecrã, os dedos ditos em voz alta e os carateres que praticas seguem esta escolha. Em caso de dúvida, fica com o teclado que já está selecionado abaixo.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Este curso ensina o teclado do seu país - por isso só aparecem teclados ${tastaturDesLandes("pt", weg)}. O teclado definido, "${name}", não corresponde. Escolhe um dos teclados daqui.`,
      startSatz:
        "Quem já sabe escrever não precisa de começar no F e no J. Podes subir o ponto de partida mais tarde, sempre que quiseres.",
      tonSatz:
        "\"Leitura em voz alta\" lê as tarefas e as mensagens - pensada para quem NÃO usa leitor de ecrã. Com NVDA, JAWS ou VoiceOver, é melhor deixá-la desligada; senão falam duas vozes ao mesmo tempo.",
      ton: (aus: boolean) => (aus ? "Som desligado" : "Som ligado"),
      tonErklaerung: "Sons para as estrelas, as medalhas e no jogo.",
      vorlesen: (an: boolean) => (an ? "Leitura em voz alta: ligada" : "Leitura em voz alta: desligada"),
      vorlesenErklaerung: "A aplicação lê em voz alta as tarefas e as mensagens.",
      vorlesenAusAnsage: "Leitura em voz alta desligada.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Enquanto escreves, ouves a voz do teu leitor de ecrã (sem linha braille)?",
      screenreaderErklaerung:
        "Para JAWS e NVDA. \"Sim\" liga \"Tecla a tecla\" - o leitor de ecrã diz a tecla seguinte enquanto escreves. Também o encontras nas definições (Alt + O).",
      ja: "Sim",
      nein: "Não",
      buchstabierenAnsage: (an: boolean) => (an ? "Tecla a tecla: ligado." : "Tecla a tecla: desligado."),
      // Kein Podcast in der portugiesischen Bedienung - steht nur da, damit die Tabelle vollständig ist.
      podcastSatz: (dauer: string) => [
        "Antes de começares: um episódio curto (",
        dauer,
        ") sobre como o programa funciona e o que é a posição inicial.",
      ],
      fertigSatz: "O Tastenflow ficou definido assim:",
      zurueck: "Voltar",
      neuStarten: " Recomeçar: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      fortschritt: (n: number, gesamt: number) => ["Configuração inicial · Passo ", n, " de ", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "O Tastenflow ensina você a digitar com os dez dedos, sem olhar para o teclado. Em ",
        gesamt,
        " passos curtos, vamos ajustar o programa para você: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Leva menos de um minuto. Se você preferir começar a digitar agora mesmo, escolha ",
        skip,
        " - aí valem as configurações padrão.",
      ],
      alterFrage:
        "Informe o seu ano de nascimento. Assim o programa sabe a sua idade - e ajusta os textos de prática, o tom das respostas e as recompensas. Todo ano de novo, automaticamente.",
      beispielJahr: "ex.: 2016",
      alterVonLehrkraft: "Quem dá aula para você já definiu a idade dos seus textos de prática. Agora vale: ",
      alterVonLehrkraft2:
        "Se os textos estiverem fáceis ou difíceis demais, avise quem dá aula para você - dá para mudar isso em Minhas turmas. Aqui você simplesmente continua.",
      spracheSatz:
        "Isto vale para as palavras e histórias que você pratica. Os botões e menus continuam em português.",
      spracheHauptSatz: (name: string) =>
        `O idioma deste curso: ${name}. Você também pode praticar inglês - as teclas continuam vindo na ordem deste curso.`,
      tastaturSatz:
        "O teclado na tela, os avisos falados dos dedos e os caracteres que você pratica seguem esta escolha. Na dúvida, fique com o teclado que já está selecionado abaixo.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Este curso ensina o teclado do seu país - por isso só aparecem teclados ${tastaturDesLandes("br", weg)}. O teclado configurado agora, "${name}", não combina com ele. Escolha um dos teclados aqui.`,
      startSatz:
        "Quem já sabe digitar não precisa começar pelo F e pelo J. Você pode mudar o ponto de partida para cima depois, a qualquer momento.",
      tonSatz:
        "Leitura em voz alta fala as tarefas e as respostas - pensada para quem NÃO usa leitor de tela. Com NVDA, JAWS ou VoiceOver, é melhor deixar desligada, senão duas vozes falam ao mesmo tempo.",
      ton: (aus: boolean) => (aus ? "Som desligado" : "Som ligado"),
      tonErklaerung: "Sons para estrelas, medalhas e no jogo.",
      vorlesen: (an: boolean) => (an ? "Leitura em voz alta: ligada" : "Leitura em voz alta: desligada"),
      vorlesenErklaerung: "O aplicativo lê em voz alta as tarefas e as respostas.",
      vorlesenAusAnsage: "Leitura em voz alta desligada.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Enquanto você digita, você ouve a voz do seu leitor de tela (sem linha braille)?",
      screenreaderErklaerung:
        "Para JAWS e NVDA. Sim liga Tecla por tecla - aí o leitor de tela fala a próxima tecla enquanto você digita. Você também encontra isso nas configurações (Alt + O).",
      ja: "Sim",
      nein: "Não",
      buchstabierenAnsage: (an: boolean) => (an ? "Tecla por tecla: ligado." : "Tecla por tecla: desligado."),
      podcastSatz: (dauer: string) => [
        "Antes de começar: um episódio curto (",
        dauer,
        ") sobre como o aplicativo funciona e o que é a posição inicial.",
      ],
      fertigSatz: "Assim o Tastenflow está configurado agora:",
      zurueck: "Voltar",
      neuStarten: " Começar de novo: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      fortschritt: (n: number, gesamt: number) => ["Configurare · Pasul ", n, " din ", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "Tastenflow te învață scrierea cu zece degete: scrii cu toate degetele, fără să te uiți la tastatură. În ",
        gesamt,
        " pași scurți potrivim aplicația pentru tine: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Durează mai puțin de un minut. Dacă vrei să începi să scrii imediat, alege „",
        skip,
        "” - atunci se aplică setările implicite.",
      ],
      alterFrage:
        "Spune-ne anul nașterii tale. Așa știe aplicația câți ani ai - și potrivește după vârsta ta textele de exersat, tonul mesajelor și recompensele. În fiecare an din nou, de la sine.",
      beispielJahr: "de ex. 2016",
      alterVonLehrkraft: "Vârsta pentru textele tale de exersat a stabilit-o deja cadrul didactic. Acum este: ",
      alterVonLehrkraft2:
        "Dacă textele sunt prea ușoare sau prea grele, spune-i cadrului didactic - se poate schimba în „Clasele mele”. Tu mergi pur și simplu mai departe.",
      spracheSatz:
        "Este vorba despre cuvintele și poveștile pe care le exersezi. Butoanele și meniurile rămân în română.",
      spracheHauptSatz: (name: string) =>
        `Limba acestui curs: ${name}. Poți exersa în plus și engleza - tastele vin totuși în ordinea acestui curs.`,
      // Ca la en: nu „alege germana”, ci tastatura deja preselectată.
      tastaturSatz:
        "După asta se potrivesc tastatura de pe ecran, anunțurile pentru degete și caracterele pe care le exersezi. Dacă ai îndoieli, păstrează tastatura deja aleasă mai jos.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Acest curs predă tastatura țării sale - de aceea sunt oferite doar tastaturi ${tastaturDesLandes("ro", weg)}. Tastatura setată acum, „${name}”, nu se potrivește. Alege una dintre tastaturile de aici.`,
      startSatz:
        "Dacă știi deja să scrii, nu trebuie să începi cu F și J. Poți muta oricând mai târziu punctul de plecare mai sus.",
      tonSatz:
        "„Citire cu voce tare” rostește singură sarcinile și mesajele - este gândită pentru toți cei care NU folosesc un cititor de ecran. Cu NVDA, JAWS sau VoiceOver e mai bine s-o lași oprită, altfel vorbesc două voci deodată.",
      ton: (aus: boolean) => (aus ? "Sunet oprit" : "Sunet pornit"),
      tonErklaerung: "Sunete la stele, la medalii și în joc.",
      vorlesen: (an: boolean) => (an ? "Citire cu voce tare: pornită" : "Citire cu voce tare: oprită"),
      vorlesenErklaerung: "Aplicația citește cu voce tare sarcinile și mesajele.",
      vorlesenAusAnsage: "Citire cu voce tare oprită.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Când scrii, asculți vocea cititorului tău de ecran (fără afișaj braille)?",
      screenreaderErklaerung:
        "Pentru JAWS și NVDA. „Da” pornește „Tastă cu tastă” - atunci cititorul de ecran spune tasta următoare cât timp scrii. O găsești și în setări (Alt + O).",
      ja: "Da",
      nein: "Nu",
      buchstabierenAnsage: (an: boolean) => (an ? "Tastă cu tastă: pornit." : "Tastă cu tastă: oprit."),
      // Ca la en: în interfața română nu există podcast - textul stă aici doar ca tabelul să fie complet.
      podcastSatz: (dauer: string) => [
        "Înainte să începi: un episod scurt (",
        dauer,
        ") despre cum este construită aplicația și ce este poziția de bază.",
      ],
      fertigSatz: "Așa este setat acum Tastenflow:",
      zurueck: "Înapoi",
      neuStarten: " Reluați configurarea: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      fortschritt: (n: number, gesamt: number) => ["Kom igång · Steg ", n, " av ", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "Tastenflow lär dig att skriva med alla tio fingrar - utan att titta på tangentbordet. I ",
        gesamt,
        " korta steg ställs programmet in efter dig: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Det tar mindre än en minut. Om du hellre vill börja skriva direkt väljer du ",
        skip,
        " - då gäller standardinställningarna.",
      ],
      alterFrage:
        "Skriv in ditt födelseår. Då vet programmet hur gammal du är - och anpassar övningstexterna, tonen i återkopplingen och belöningarna efter det. Varje år på nytt, helt av sig självt.",
      beispielJahr: "till exempel 2016",
      alterVonLehrkraft: "Din lärare har redan ställt in åldern för dina övningstexter. Just nu gäller: ",
      alterVonLehrkraft2:
        "Om texterna är för lätta eller för svåra kan du säga det till din lärare - det går att ändra under Mina klasser. Här går du bara vidare.",
      spracheSatz:
        "Det gäller orden och berättelserna som du övar med. Knappar och menyer förblir på svenska.",
      spracheHauptSatz: (name: string) =>
        `Språket i den här kursen: ${name}. Du kan också öva engelska - tangenterna kommer ändå i den här kursens ordning.`,
      tastaturSatz:
        "Skärmtangentbordet, fingertipsen som läses upp och vilka tecken du övar rättar sig efter detta. Om du är osäker: behåll tangentbordet som redan är valt åt dig här nedanför.",
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Den här kursen lär ut tangentbordet i sitt land - därför går det bara att välja ${tastaturDesLandes("sv", weg)} tangentbord. Det inställda tangentbordet, ${name}, passar inte till kursen. Välj ett av tangentborden här.`,
      startSatz:
        "Den som redan kan skriva behöver inte börja med F och J. Du kan flytta upp startpunkten när som helst senare.",
      tonSatz:
        "Uppläsning läser upp uppgifter och återkoppling - tänkt för alla som inte använder någon skärmläsare. Med NVDA, JAWS eller VoiceOver är det bäst att låta den vara avstängd, annars pratar två röster samtidigt.",
      ton: (aus: boolean) => (aus ? "Ljud av" : "Ljud på"),
      tonErklaerung: "Ljud vid stjärnor, märken och i spelet.",
      vorlesen: (an: boolean) => (an ? "Uppläsning: på" : "Uppläsning: av"),
      vorlesenErklaerung: "Appen läser upp uppgifter och återkoppling.",
      vorlesenAusAnsage: "Uppläsning av.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Lyssnar du på skärmläsarens tal när du skriver (utan punktskriftsdisplay)?",
      screenreaderErklaerung:
        "För JAWS och NVDA. Ja slår på Tangent för tangent - då säger skärmläsaren nästa tangent medan du skriver. Du hittar det också i inställningarna (Alt + O).",
      ja: "Ja",
      nein: "Nej",
      buchstabierenAnsage: (an: boolean) => (an ? "Tangent för tangent: på." : "Tangent för tangent: av."),
      // Kommt in der schwedischen Bedienung nicht vor (kein Podcast) - nur für die vollständige Tabelle.
      podcastSatz: (dauer: string) => [
        "Innan du börjar: ett kort avsnitt (",
        dauer,
        ") om hur appen fungerar och vad grundställningen är.",
      ],
      fertigSatz: "Så här är Tastenflow inställt nu:",
      zurueck: "Tillbaka",
      neuStarten: " Börja om: Alt + R.",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      fortschritt: (n: number, gesamt: number) => ["Початкове налаштування · Крок ", n, "/", gesamt],
      willkommen1: (gesamt: number, liste: string) => [
        "Tastenflow навчить тебе друкувати десятьма пальцями - не дивлячись на клавіатуру. За кілька коротких кроків (усього ",
        gesamt,
        ") ми налаштуємо програму для тебе: ",
        liste,
        ".",
      ],
      willkommen2: (skip: string) => [
        "Це триває менше хвилини. Якщо хочеш одразу почати друкувати, вибери «",
        skip,
        "» - тоді діють типові налаштування.",
      ],
      alterFrage:
        "Вкажи рік свого народження. З нього програма знає, скільки тобі років, - і добирає до твого віку тексти вправ, тон відповідей і нагороди. Щороку знову, автоматично.",
      beispielJahr: "напр. 2016",
      alterVonLehrkraft: "Вік для текстів твоїх вправ визначає твій педагог. Зараз діє: ",
      alterVonLehrkraft2:
        "Якщо тексти занадто легкі або занадто складні, скажи про це педагогові - це можна змінити в розділі «Мої класи». А ти просто йди далі.",
      spracheSatz:
        "Ідеться про слова й історії, які ти тренуєш. Кнопки й меню залишаються українською.",
      spracheHauptSatz: (name: string) =>
        `Мова цього курсу: ${name}. Додатково можна тренувати англійську - клавіші все одно з'являються в порядку цього курсу.`,
      tastaturSatz:
        "Від цього залежать екранна клавіатура, підказки про пальці й символи, які ти тренуєш. Якщо не знаєш, залиш розкладку, яку вже вибрано нижче.",
      // tastaturDesLandes kennt "uk" noch nicht (Typ der Bedienung) - der Chef ergänzt die Tabelle.
      tastaturNichtImWeg: (weg: Lang, name: string) =>
        `Цей курс навчає розкладки своєї країни, тому на вибір є лише такі розкладки: ${tastaturDesLandes("uk", weg)}. Вибрана зараз розкладка «${name}» до нього не підходить. Вибери одну з розкладок тут.`,
      startSatz:
        "Якщо ти вже вмієш друкувати, не треба починати з А і О. Пізніше це можна будь-коли змінити.",
      tonSatz:
        "Читання вголос промовляє завдання й відповіді - для всіх, хто НЕ користується читачем екрана. З NVDA, JAWS або VoiceOver краще залиш його вимкненим, інакше говоритимуть два голоси одночасно.",
      ton: (aus: boolean) => (aus ? "Звук: вимкнено" : "Звук: увімкнено"),
      tonErklaerung: "Звуки для зірок, медалей і в грі.",
      vorlesen: (an: boolean) => (an ? "Читання вголос: увімкнено" : "Читання вголос: вимкнено"),
      vorlesenErklaerung: "Програма читає вголос завдання й відповіді.",
      vorlesenAusAnsage: "Читання вголос вимкнено.",
      // ★ 13.11.2026 (Meldung wwzafyorujqubft): Frage nach der Sprachausgabe des Screenreaders.
      screenreaderFrage: "Ти слухаєш мовлення свого читача екрана, коли друкуєш (без брайлівського дисплея)?",
      screenreaderErklaerung:
        "Для JAWS і NVDA. «Так» вмикає «Клавіша за клавішею» - тоді читач екрана під час друку називає наступну клавішу. Це є і в налаштуваннях (Alt + O).",
      ja: "Так",
      nein: "Ні",
      buchstabierenAnsage: (an: boolean) => (an ? "Клавіша за клавішею: увімкнено." : "Клавіша за клавішею: вимкнено."),
      podcastSatz: (dauer: string) => [
        "Перед початком: короткий випуск (",
        dauer,
        ") про те, як влаштована програма і що таке основне положення.",
      ],
      fertigSatz: "Ось як тепер налаштовано Tastenflow:",
      zurueck: "Назад",
      neuStarten: " Почати знову: Alt + R.",
    },
});

/** Ein Auswahlknopf: groß, mit Erklärzeile, Zustand über `aria-pressed`. */
function Wahl({
  gewaehlt,
  titel,
  erklaerung,
  onClick,
}: {
  gewaehlt: boolean;
  titel: string;
  erklaerung?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={gewaehlt}
      onClick={onClick}
      className={
        "flex w-full flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-colors " +
        (gewaehlt
          ? "border-accent bg-accent/10 text-ink"
          : "border-hairline bg-surface hover:border-accent")
      }
    >
      <span className="font-semibold text-ink">{titel}</span>
      {erklaerung && (
        <span className="text-sm text-ink-muted">{erklaerung}</span>
      )}
    </button>
  );
}

export interface EinrichtungProps {
  /**
   * Die Textstufe, die GERADE gilt - zum Anzeigen, nicht zum Wählen.
   *
   * ⚠️ `onStufeChange` gab es hier bis zum 30.08.2026. Mit den vier
   * Stufen-Schaltern ist der Rückruf weggefallen: Die Einrichtung stellt die
   * Stufe nicht mehr ein, sie leitet sich aus dem Geburtsjahr ab. Ein Rückruf,
   * den niemand mehr auslöst, wäre eine Programmleiche - und die nächste
   * Person hielte ihn für einen Weg, den es gibt. Umgestellt wird im Zahnrad.
   *
   * Gebraucht wird die Stufe hier trotzdem an drei Stellen: für die
   * Einführungs-Folge, für die Zusammenfassung am Ende und für den Satz an
   * Kinder, deren Lehrkraft das Alter gesetzt hat.
   */
  stufe: Stufe;
  /**
   * Geburtsjahr (freiwillig, Bauplan §0b.3). FEHLT der Rückruf, gibt es das Feld
   * gar nicht — genau wie beim Startpunkt: Kinder MIT Lehrkraft dürfen ihr
   * Geburtsjahr nicht selbst setzen (der Server-Guard tt_pupils_field_guard
   * würde es zurückdrehen), und ein Feld ohne Wirkung ist schlimmer als keins.
   */
  geburtsjahr?: number;
  onGeburtsjahrChange?: (jahr: number | undefined) => void;
  lang: Lang;
  onLangChange: (l: Lang) => void;
  langLocked?: boolean;
  /**
   * ★★★ B11/§2.3 (11.09.2026): Gehört das Konto einer Klasse an? Dann fällt
   * der Schritt „alter" ganz weg - die Textstufe kommt aus der Schulstufe der
   * Klasse. Bis dahin stand dort nur ein Ersatztext, also ein ganzer Schritt,
   * der sagte, dass es hier nichts zu tun gibt.
   */
  klassenkind?: boolean;
  /** Startpunkt (nur ohne Anmeldung — sonst setzt ihn die Lehrkraft). */
  startUnits?: number;
  onStartUnitsChange?: (units: number) => void;
  /**
   * ★ E1 (24.09.2026): der Lernweg der Person - die Startpunkte sind
   * ANZAHLEN und gelten nur in ihm (Bauplan englischer Lehrgang §2.4).
   */
  lernweg: Lernweg;
  /** Einrichtung verlassen — `true`, wenn sie regulär zu Ende gegangen ist. */
  onExit: (fertig: boolean) => void;
}

export function Einrichtung({
  stufe,
  geburtsjahr,
  onGeburtsjahrChange,
  lang,
  onLangChange,
  langLocked,
  klassenkind,
  startUnits,
  onStartUnitsChange,
  lernweg,
  onExit,
}: EinrichtungProps) {
  const layout = useKeyboardLayout();
  // ★ EN2: Bedienungssprache (ohne Provider immer „de") und ihre Stimme.
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - T, einrichtungTexte(), stufeLabel(), langLabel() kennen „fr"
  // jetzt. ⚠️ AUSSER `layoutTexte()` (Tastatur-Namen): `layouts.ts` steht auf
  // der Nicht-anfassen-Liste dieser Etappe (E9a-2/E9-kids arbeiten dort) -
  // die Tastatur-Namen bleiben darum vorerst englisch für „fr"
  // (`layoutSprache` unten), dokumentiert statt stillschweigend falsch.
  const { spracheGewaehlt: sprache } = useBedienSprache();
  // ★ E11a-5 (26.09.2026): aufgehoben - `layoutTexte()` kennt jetzt „fr"
  // (`LAYOUT_TEXTE_FR` in `layouts.ts`); die Tastatur-Namen sind französisch.
  const layoutSprache = sprache;
  // ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): am Mac „Neu starten:
  //   Wahl + R." - `wahlTexte`, ohne Mac dieselben Tabellen.
  const t = wahlTexte(T[sprache], sprache);
  const et = wahlTexte(einrichtungTexte(sprache), sprache);
  const stimme = useBedienStimme();
  const voiceEnabled = useVoice((s) => s.enabled);
  const setVoice = useVoice((s) => s.setEnabled);
  // ★ 13.11.2026: „Buchstabieren" - derselbe Zustand wie im Zahnrad.
  const tastenAnsage = useTypingA11y((s) => s.tastenAnsage);
  const setTastenAnsage = useTypingA11y((s) => s.setTastenAnsage);
  const [muted, setMuted] = useState(() => isSoundMuted());
  // Was im Feld steht (Text, nicht Zahl): „20" beim Tippen ist noch kein
  // Geburtsjahr — erst geburtsjahrAusText entscheidet, ob daraus eine Zahl wird.
  const [jahrText, setJahrText] = useState(geburtsjahr ? String(geburtsjahr) : "");
  const [schritt, setSchritt] = useState<EinrichtungStepId>("willkommen");
  const titelRef = useRef<HTMLHeadingElement>(null);

  // ★ ES-M2: die Übungssprachen, die auf diesem Weg möglich sind. Gibt es nur
  // eine, entfällt der Schritt (siehe `spracheGebunden`).
  // ★ D1 Nr. 18 (28.09.2026): auf Weg „fr"/„es" sind es zwei - die
  // Hauptsprache und Englisch -, der Schritt ist wieder da, mit einem Satz,
  // dass die Tasten in der Reihenfolge des Lehrgangs kommen.
  const sprachen = uebungsSprachenImWeg(lernweg);
  const hauptsprache = hauptspracheDesWeges(lernweg);
  const lage: EinrichtungLage = {
    langLocked,
    spracheGebunden: sprachen.length <= 1,
    klassenkind,
    mitStartpunkt: startUnits !== undefined && !!onStartUnitsChange,
    // ★ EN2: In der englischen Bedienung ohne Podcast - die Folgen sind
    //   deutsch (Johannes 12.09.2026: „Podcasts weglassen").
    // ★ E11a-4 (26.09.2026): auf „fr" geweitet - Bauplan §6.1 nennt für
    //   Französisch ausdrücklich 0 Podcasts (Falle 30: `!== "en"` allein
    //   hätte „fr" fälschlich die deutschen Folgen gezeigt).
    mitPodcast: sprache === "de" && !!introPodcastFuerStufe(stufe),
  };
  const alle = einrichtungSchritte(lage);
  const nummer = schrittNummer(schritt, lage);
  const gesamt = alle.length;
  const podcast = introPodcastFuerStufe(stufe);
  const starts = startPunkte(sprache, lernweg);

  // Regel 3: Fokus + Ansage bei jedem Schrittwechsel. `setTimeout(0)` statt
  // rAF — der Knopf, von dem der Fokus kommt, verschwindet im selben Takt.
  useEffect(() => {
    const t = window.setTimeout(() => titelRef.current?.focus(), 0);
    stimme.sprich(ansageSchritt(nummer, gesamt, et.titel[schritt], stimme.lang()));
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schritt]);

  // ★ 23.09.2026: In der englischen Bedienung die Tastatur des Landes
  //   vorwählen (US, in Grossbritannien und Irland UK) - vorher stand bei
  //   jedem neuen Gerät die deutsche da. Nur, wenn noch keine gemerkt ist.
  // ★ E11a-4 (26.09.2026): auf „fr" geweitet (`!== "de"` statt `=== "en"`) -
  // `vorschlagLayout` kennt „fr" bereits (Bauplan §3.3, E3: AZERTY FR/BE/
  // Schweiz-Französisch/Kanada je nach Browser-Sprache).
  //
  // ★★ W2b (28.09.2026, S5 aus dem Windows-Befund §3.5): „In der spanischen
  // Oberfläche ist bei der Einrichtung die deutsche Tastatur vorgewählt." Die
  // Vorwahl lief nur EINMAL beim Aufbau - wer die Einrichtung deutsch öffnete
  // und DANN im Sprachwähler „Español" nahm, behielt die deutsche Tastatur.
  // Jetzt läuft sie bei jedem Sprachwechsel neu, solange auf diesem Gerät
  // vorher keine Tastatur gemerkt war UND die Person in der Einrichtung noch
  // keine selbst angeklickt hat (nie still überschreiben, was jemand gewählt
  // hat). Grundlage, in dieser Reihenfolge:
  //  1. die ERKANNTE Tastatur, wenn sie zum Weg passt (Punkt 3,
  //     `tastaturErkennung.ts`),
  //  2. die Vorwahl des Landes aus der Hauptsprache des Weges (Weg „fr"/„es",
  //     auch bei deutscher Bedienung) bzw. der Bedienungssprache
  //     (`vorschlagLayout`, es-ES ⇒ Spanien, andere es-* ⇒ Lateinamerika).
  // Deutsch beim Aufbau ändert wie bisher nichts.
  const durfteVorwaehlen = useRef(!hatGemerktesLayout());
  const selbstGewaehlt = useRef(false);
  const ersteBasis = useRef<string | null>(null);
  const sprachGewechselt = useRef(false);
  const erkannt = useTastaturErkennung();
  useEffect(() => {
    // ★ Nachtlauf 28.09.2026 (live gefunden): Eine gemerkte Tastatur, die der
    // Weg gar nicht anbietet (AZERTY von einem früheren französischen Besuch,
    // jetzt auf /es), ist keine Wahl, die man schützen müsste - dann wählt die
    // Einrichtung die passende vor, sonst stünde „Francés (Francia, AZERTY)"
    // samt AZERTY-Hinweis in der spanischen Einrichtung.
    const unpassend = !tastaturPasstZumWeg(activeLayoutId(), lernweg);
    if ((!durfteVorwaehlen.current && !unpassend) || selbstGewaehlt.current) return;
    const basis = hauptsprache ?? sprache;
    if (ersteBasis.current === null) ersteBasis.current = basis;
    // Einmal gewechselt, gilt auch „de" als Wahl (zurück von Español ⇒ Deutsch).
    if (basis !== ersteBasis.current) sprachGewechselt.current = true;
    const ausErkennung =
      erkannt?.art === "app" && tastaturPasstZumWeg(erkannt.id, lernweg) ? erkannt.id : null;
    const ausSprache =
      basis !== "de" || sprachGewechselt.current || unpassend ? vorschlagLayout(basis, browserSprachen()) : null;
    const ziel = ausErkennung ?? ausSprache;
    if (ziel && ziel !== activeLayoutId()) setLayout(ziel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprache, hauptsprache, lernweg, erkannt]);

  // Regel 4: Esc = überspringen, aus jedem Schritt.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        ueberspringen();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function weiter() {
    const next = naechsterSchritt(schritt, lage);
    if (next) {
      setSchritt(next);
      return;
    }
    einrichtungFertigMerken();
    // Wer die Einrichtung durchgeht, hat den Podcast angeboten bekommen — die
    // Willkommens-Karte muss danach nicht noch einmal von selbst aufgehen.
    introGesehenMerken();
    onExit(true);
  }

  function zurueck() {
    const prev = vorigerSchritt(schritt, lage);
    if (prev) setSchritt(prev);
  }

  function ueberspringen() {
    einrichtungFertigMerken();
    introGesehenMerken();
    // Über `stimme.lang()`: Esc ruft diese Funktion aus einem Horcher, der nur
    // EINMAL angemeldet wird - er liest die Sprache des Augenblicks.
    // ★ 18.10.2026: gesprochen am Mac „Mit Wahl und R …" (`wahlText`).
    const jetzt = stimme.lang() ?? "de";
    stimme.sprichImmer(wahlText(einrichtungTexte(jetzt).skipAnsage, jetzt));
    onExit(false);
  }

  return (
    <section
      aria-labelledby="tippen-einrichtung-titel"
      className="blatt-karte rounded-2xl border border-hairline bg-surface-raised/80 p-5"
      lang={htmlLang(sprache)}
    >
      {/* Fortschritt: sichtbar UND als Live-Region für Screenreader. */}
      <p className="m-0 text-sm font-medium text-ink-muted" aria-live="polite">
        {t.fortschritt(nummer, gesamt)}
      </p>
      {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`. */}
      <h2
        id="tippen-einrichtung-titel"
        ref={titelRef}
        tabIndex={-1}
        className="m-0 mt-1 text-xl font-semibold text-ink outline-none"
      >
        {et.titel[schritt]}
      </h2>

      <div className="mt-4 space-y-3">
        {schritt === "willkommen" && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">
              {t.willkommen1(gesamt, einrichtungAufzaehlung(lage, sprache))}
            </p>
            <p className="m-0 max-w-prose text-ink-soft">{t.willkommen2(et.skipLabel)}</p>
          </>
        )}

        {/* ★★★ NUR NOCH DAS GEBURTSJAHR (30.08.2026, Johannes: „es ist wichtig
            dass die app mitwächst und wenn jemand älter wird auch passende
            texte bekommt").
            Hier standen bis dahin ZWEI Wege nebeneinander: das Jahr und vier
            Stufen-Schalter. Das war keine Auswahl, sondern ein Widerspruch -
            eine von Hand gewählte Stufe schlägt im Vorrangmodell das Jahr
            (`stufeFuer` in `lib/typing/account.ts`) und WÄCHST NICHT MIT. Wer
            mit neun „7 bis 9" anklickte, bekam mit zwölf noch immer Texte für
            Siebenjährige. Die Schalter sind darum weg, nicht nur zusammen-
            gefasst [[feedback_zwei_stellen_die_voneinander_nichts_wissen]].
            Umstellen geht weiter - im Zahnrad, wo eine Ausnahme hingehört. */}
        {schritt === "alter" && (
          <>
            {onGeburtsjahrChange ? (
              <>
                <p className="m-0 max-w-prose text-ink-soft">{t.alterFrage}</p>
                <div className="rounded-xl border border-hairline bg-surface-sunken p-3">
                  <label className="field-label" htmlFor="tt-einr-jahr">
                    {et.geburtsjahrLabel}
                  </label>
                  <input
                    id="tt-einr-jahr"
                    className="field-input max-w-[10rem]"
                    inputMode="numeric"
                    value={jahrText}
                    placeholder={t.beispielJahr}
                    onChange={(e) => {
                      const roh = e.target.value;
                      setJahrText(roh);
                      onGeburtsjahrChange(geburtsjahrAusText(roh));
                    }}
                  />
                  <p className="m-0 mt-1 text-sm text-ink-muted">
                    {et.geburtsjahrErklaerung}
                  </p>
                </div>
              </>
            ) : (
              /* ★ B11 (11.09.2026): Für Kinder einer Klasse kommt dieser
                 Zweig nicht mehr vor - der ganze Schritt „alter" entfällt für
                 sie (`klassenkind` in `einrichtungSchritte`). Er bleibt als
                 Netz für den Fall stehen, dass ein Aufrufer weder den Rückruf
                 noch `klassenkind` setzt: Ein Schritt ohne einen einzigen
                 Inhalt wäre für ein Kind mit Screenreader eine Sackgasse - die
                 Überschrift wird vorgelesen, danach kommt nichts. Der
                 ursprüngliche Grund:
                 Das Geburtsjahr setzt die Lehrkraft, der
                 Server-Wächter `tt_pupils_field_guard` drehte eine eigene
                 Eingabe zurück. Nähme man nur die Schalter weg, stünde für
                 diese Kinder ein Schritt ohne einen einzigen Inhalt da - für
                 ein Kind mit Screenreader eine Sackgasse: Die Überschrift wird
                 vorgelesen, danach kommt nichts, und niemand weiß, ob die
                 Seite noch lädt. Also sagt der Schritt, was gilt und wer es
                 eingestellt hat. */
              <>
                <p className="m-0 max-w-prose text-ink-soft">
                  {t.alterVonLehrkraft}
                  <strong>{stufeLabel(stufe, sprache)}</strong>.
                </p>
                <p className="m-0 max-w-prose text-ink-soft">{t.alterVonLehrkraft2}</p>
              </>
            )}
          </>
        )}

        {schritt === "sprache" && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">{t.spracheSatz}</p>
            {hauptsprache && (
              <p className="m-0 max-w-prose text-ink-soft">
                {t.spracheHauptSatz(langLabel(hauptsprache, sprache))}
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {sprachen.map((l) => (
                <Wahl
                  key={l}
                  gewaehlt={lang === l}
                  titel={langLabel(l, sprache)}
                  onClick={() => {
                    onLangChange(l);
                    stimme.sprich(ansageGewaehlt(langLabel(l, sprache), stimme.lang()));
                  }}
                />
              ))}
            </div>
          </>
        )}

        {schritt === "tastatur" && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">{t.tastaturSatz}</p>
            {/* ★ D1 Nr. 7 (28.09.2026): auf Weg „fr"/„es" nur die Tastaturen
                seines Landes; passt die eingestellte nicht, sagt es ein Satz. */}
            {hauptsprache && !tastaturPasstZumWeg(layout.id, lernweg) && (
              <p className="m-0 max-w-prose font-semibold text-ink">
                {t.tastaturNichtImWeg(hauptsprache, layoutTexteIn(layout, layoutSprache).label)}
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              {tastaturenFuerWeg(lernweg, franzoesischLehrgangProbeAn(), spanischLehrgangProbeAn(), {
                it: italienischLehrgangProbeAn(),
                pl: polnischLehrgangProbeAn(),
                tr: tuerkischLehrgangProbeAn(),
                cs: tschechischLehrgangProbeAn(),
                // ★★★ G3b (25.10.2026): die Schalter der neun Gerüst-Sprachen (ihre Tastaturen nur mit dem eigenen Schalter).
                ...geruestLehrgangProben(),
              }).map((l) => (
                <Wahl
                  key={l.id}
                  gewaehlt={layout.id === l.id}
                  titel={layoutTexteIn(l, layoutSprache).label}
                  onClick={() => {
                    // ★ W2b: ab jetzt wählt die Person - keine Vorwahl mehr darüber.
                    selbstGewaehlt.current = true;
                    setLayout(l.id);
                    stimme.sprich(ansageTastatur(layoutTexteIn(l, layoutSprache).kurz, stimme.lang()));
                  }}
                />
              ))}
            </div>
            {layoutTexteIn(layout, layoutSprache).hinweis && (
              // ★ E11a-5: der Hinweis ist jetzt in der Sprache der Bedienung -
              // kein eigenes `lang` mehr nötig (bis dahin „en" für „fr").
              <p className="m-0 text-sm text-ink-muted">
                {layoutTexteIn(layout, layoutSprache).hinweis}
              </p>
            )}
          </>
        )}

        {schritt === "start" && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">{t.startSatz}</p>
            <div className="grid gap-2">
              {starts.map((s) => (
                <Wahl
                  key={s.key}
                  gewaehlt={startUnits === s.units}
                  titel={s.label}
                  onClick={() => {
                    onStartUnitsChange?.(s.units);
                    stimme.sprich(ansageStart(s.label, stimme.lang()));
                  }}
                />
              ))}
            </div>
          </>
        )}

        {schritt === "ton" && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">{t.tonSatz}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Wahl
                gewaehlt={!muted}
                titel={t.ton(muted)}
                erklaerung={t.tonErklaerung}
                onClick={() => {
                  const aus = !muted;
                  setMuted(aus);
                  setSoundMuted(aus);
                  stimme.sprich(ansageSchalter("tonAus", "tonAn", aus, stimme.lang()));
                }}
              />
              <Wahl
                gewaehlt={voiceEnabled}
                titel={t.vorlesen(voiceEnabled)}
                erklaerung={t.vorlesenErklaerung}
                onClick={() => {
                  const an = !voiceEnabled;
                  // Die Sprachausgabe muss IN der Nutzergeste geweckt werden —
                  // sonst bleibt sie in manchen Browsern bis zum nächsten Klick
                  // stumm (K28-Verwandtschaft, [[feedback_web_audio_gesture]]).
                  if (an) primeSpeech();
                  setVoice(an);
                  if (an) stimme.sprich(ansage("vorlesenAn", stimme.lang()));
                  else stimme.sprichImmer(t.vorlesenAusAnsage);
                }}
              />
            </div>
            {/* ★ 13.11.2026 (Meldung wwzafyorujqubft, Entscheidung Johannes):
                Wer nur mit der Sprache von JAWS oder NVDA arbeitet, braucht
                „Buchstabieren" an - unter Windows ist es von Haus aus AUS
                (wegen der Braillezeile, `tastenAnsageAus` in a11y.ts), und
                dann hört man beim Tippen fast nichts. Die App kann keinen
                Screenreader erkennen ([[reference_screenreader_nicht_abfragbar]]),
                also fragt sie. „Ja" setzt dieselbe Einstellung wie der
                Schalter im Zahnrad, „Nein" setzt sie auf „aus". Zwei
                aria-pressed-Schalter, keine radiogroup (Begründung in
                TypingSettings); der Fokus bleibt auf dem gedrückten Schalter. */}
            <div
              role="group"
              aria-labelledby="tt-einr-sr-frage"
              aria-describedby="tt-einr-sr-erklaerung"
              className="rounded-xl border border-hairline bg-surface-sunken p-3"
            >
              <p id="tt-einr-sr-frage" className="m-0 max-w-prose font-semibold text-ink">
                {t.screenreaderFrage}
              </p>
              <p id="tt-einr-sr-erklaerung" className="m-0 mt-1 max-w-prose text-sm text-ink-muted">
                {t.screenreaderErklaerung}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([true, false] as const).map((ja) => (
                  <Wahl
                    key={ja ? "ja" : "nein"}
                    gewaehlt={(tastenAnsage === "naechste") === ja}
                    titel={ja ? t.ja : t.nein}
                    onClick={() => {
                      setTastenAnsage(ja ? "naechste" : "aus");
                      stimme.sprich(t.buchstabierenAnsage(ja));
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {schritt === "podcast" && podcast && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">{t.podcastSatz(podcast.dauer)}</p>
            <IntroPodcast
              stufe={stufe}
              offen
              onClose={weiter}
              ohneSchliessen
            />
          </>
        )}

        {schritt === "fertig" && (
          <>
            <p className="m-0 max-w-prose text-ink-soft">{t.fertigSatz}</p>
            <dl className="m-0 grid max-w-md grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {zusammenfassung(
                {
                  stufeLabel: stufeLabel(stufe, sprache),
                  sprachLabel: langLabel(lang, sprache),
                  tastaturLabel: layoutTexteIn(layout, layoutSprache).kurz,
                  startLabel:
                    startUnits !== undefined
                      ? starts.find((s) => s.units === startUnits)?.label
                      : undefined,
                  ton: !muted,
                  vorlesen: voiceEnabled,
                },
                sprache,
              ).map((z) => (
                <div key={z.was} className="contents">
                  <dt className="text-ink-muted">{z.was}</dt>
                  <dd className="m-0 font-medium text-ink">{z.gewaehlt}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary" onClick={weiter}>
          {et.weiter[schritt]}
        </button>
        {vorigerSchritt(schritt, lage) && (
          <button type="button" className="btn-secondary btn-toggle" onClick={zurueck}>
            {t.zurueck}
          </button>
        )}
        <button
          type="button"
          className="btn-ghost btn-toggle ms-auto"
          onClick={ueberspringen}
        >
          {et.skipLabel}
        </button>
      </div>
      <p className="m-0 mt-3 text-sm text-ink-muted">
        {et.fussnote}
        {t.neuStarten}
      </p>
    </section>
  );
}
