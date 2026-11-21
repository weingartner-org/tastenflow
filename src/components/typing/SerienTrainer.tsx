/**
 * „Geschichten & Wissen" — die Bücherei des Tipptrainers (Textwelt-Ebene 2, TW-E3).
 *
 * Zwei Ansichten in einer Komponente:
 *  • BÜCHEREI: Auswahl der Serien, gefiltert auf die passende Altersstufe UND das
 *    freigeschaltete Tier (der Wortschatz kommt mit den schon gelernten Tasten aus).
 *    Zeigt je Serie den Fortschritt (neu / weiter bei Etappe X / fertig).
 *  • LESER: eine Serie Etappe für Etappe tippen (variable Rundenlänge 12–16), mit
 *    Resume und Cliffhanger („Weiter" führt zur nächsten Etappe). Fortschritt strikt
 *    linear (jede Etappe genau einmal, `storyProgress`); eine fertige Serie kann auf
 *    Wunsch neu gelesen werden.
 *
 * Baut auf `TypingSession` (gemeinsamer Übungslauf) auf — dieselbe Zeichen-für-
 * Zeichen-Rückmeldung, Tastatur, Töne, Sprachausgabe und Braille-Tauglichkeit wie
 * „Mein Training" und die Lektionen. Siehe Bauplan
 * `Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md` und
 * [[project_tastenflow_textwelt_neuaufbau]].
 */
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeDef,
  FloeCourse,
  KeyEvent,
  Lang,
  Serie,
  Stufe,
  TaskEvent,
  TempoLevel,
  TypingProgress,
  ZeichenabstandFaktor,
  advanceIntroduced,
  loeseVormerkungEin,
  neuFreigeschaltet,
  stampUnlocks,
  advanceStory,
  allowedFromIntroduced,
  awardBadges,
  RoundDetail,
  dayKey,
  collectHerkunft,
  copyFor,
  currentLevel,
  isFormal,
  emptyProgress,
  ensureIntroduced,
  nextLetter,
  fitText,
  focusPracticeField,
  lockedSerien,
  masteryForLevel,
  mergeLetters,
  noteStoryLine,
  playerLevel,
  recordRound,
  recordStoryEtappe,
  resetStory,
  resumeSerie,
  serieBySlug,
  serieEtappeCount,
  serieStatus,
  activeBelohnungsSpiel,
  gateModeFor,
  skinForStufe,
  speakUi,
  speedTargetCpm,
  startEtappeFor,
  startLineFor,
  storyStateFor,
  unlockedSerien,
  updateSpeedEma,
  useVoice,
  SHIFT_UNIT,
  ansage,
  bedienCopy,
} from "@/lib/typing";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { SprachpaketTor } from "./SprachpaketTor";
import { sprachPaketeFuer } from "@/lib/typing/sprachpaketBedarf";
import { belohnungsAngebot } from "./AdaptiveTrainer";
import { topfTastenVerbuchen } from "@/lib/typing/topf";
import { ExpeditionStage } from "./expedition/ExpeditionStage";
import { PlayerLevelRing } from "./PlayerLevelRing";
import { StandZeile } from "./StandZeile";
// Die Bücherei-ÜBERSICHT (kein Tippfeld, kein Ausblenden) behält ihre Uhr.
import { PracticeClock } from "./PracticeClock";
import { buildTorCourse } from "@/lib/typing/expedition/course";
import { TypingSession } from "./TypingSession";
import { UnlockCelebration } from "./UnlockCelebration";
import { useAnrede } from "./useAnrede";
import { wackeligeTastenAus } from "@/lib/typing/zeilenMessung";
// ★ E1 (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt.
import { lernwegVon } from "@/lib/typing/lernweg";

const HEADER_RING = 44;

/** ★ ES-O (27.09.2026): das Wort für „Punkte" (Erwachsenen-Profil) je fremder Bedienung. */
const PUNKTE_WORT: Record<Exclude<BedienSprache, "de">, string> = {
  en: "points",
  fr: "points",
  es: "puntos",
  it: "punti",
  // ★ O-PL (02.10.2026): Genitiv Mehrzahl - der Ring sagt „40 z 100 punktów" (PlayerLevelRing).
  pl: "punktów",
  // ★ O-TR (02.10.2026): nach einer Zahl Einzahl - der Ring sagt "60 puan kaldı" (PlayerLevelRing).
  tr: "puan",
  // ★ O-CS (03.10.2026): Genitiv Mehrzahl - der Ring sagt „40 ze 100 bodů" (PlayerLevelRing).
  cs: "bodů",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "точки",
  el: "πόντοι",
  hu: "pont",
  nl: "punten",
  pt: "pontos",
  br: "pontos",
  ro: // Inelul spune „40 din 100 de puncte” - după 100 (forma „other”) stă „de” (Glosar §2.11).
  "de puncte",
  sv: "poäng",
  uk: "балів",
};

/**
 * ★★ DIE BÜCHEREI UND DER LESER in beiden Bedienungssprachen (EN1,
 * 19.09.2026). Deutsch Zeichen für Zeichen wie vorher - wo das JSX mehrere
 * Textknoten erzeugte, stehen TEILE (`Teil[]`). Englisch nach Glossar §3.6:
 * *Stories & non-fiction*, *Library*, *Continue reading*; eine Etappe heisst
 * wie in der Statistik (EN3) *stage*. Titel und Quellenangaben sind INHALT
 * und bleiben, wie sie sind (bei aktivem Sprachbereich als Deutsch ausgezeichnet).
 */
const BUECHEREI_TEXTE = texte({
  de: {
    laedt: "Lädt …",
    titel: "Geschichten & Wissen",
    // ★ 19.09.2026: ab 16 per Du; „Sie" nur für die Lehrkraft (`isFormal`).
    leadErwachsen: (sie: boolean) =>
      "Zusammenhängende Geschichten und Wissens-Reihen - Etappe für Etappe, ohne Wiederholung. " +
      `Es erscheint, was ${sie ? "Ihr" : "dein"} Tastenstand schon hergibt.`,
    leadJugend:
      "Geschichten und Wissens-Reihen, Etappe für Etappe - es erscheint, was dein Tastenstand schon hergibt.",
    leadKind:
      "Hier warten ganze Geschichten und spannendes Wissen - Stück für Stück. Du liest genau das, was du mit deinen Tasten schon schreiben kannst.",
    fortsetzen: (sober: boolean) => (sober ? "Fortsetzen" : "Hier warst du zuletzt"),
    etappeVon: (n: number, gesamt: number) => ["Etappe ", n, " von ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` · Zeile ${n} von ${gesamt}`,
    weiterlesen: "Weiterlesen",
    listeName: "Geschichten und Wissens-Reihen",
    nochmalLesen: "Nochmal lesen",
    weiterEtappe: (n: number) => `Weiter (Etappe ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Beginnen" : skin === "jugend" ? "Loslegen" : "Los geht’s",
    fertigGelesen: "fertig gelesen",
    weiterBei: (n: number, gesamt: number) => `weiter bei Etappe ${n} von ${gesamt}`,
    etappen: (n: number) => `${n} Etappen`,
    art: (wissen: boolean) => (wissen ? "Wissen" : "Geschichte"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "Sobald Sie ein paar Tasten mehr sicher beherrschen, erscheinen hier die ersten Geschichten."
          : "Sobald du ein paar Tasten mehr sicher beherrschst, erscheinen hier die ersten Geschichten."
        : skin === "jugend"
          ? "Noch ein paar Tasten mehr, dann erscheinen hier die ersten Texte."
          : "Übe noch ein bisschen weiter - dann kannst du hier bald deine erste Geschichte lesen!",
    bald: (sober: boolean) => (sober ? "Bald verfügbar" : "Das kannst du bald lesen"),
    baldWann: (sober: boolean) => (sober ? "sobald mehr Tasten sitzen" : "sobald du mehr Tasten kannst"),
    quellen: "Quellen & Dank",
    dank: (sober: boolean) =>
      sober
        ? "Übernommene Texte werden unter ihrer Lizenz genannt; frei lizenzierte Inhalte (CC) mit Urheber:in. Die eigenen Texte hat Johannes Weingartner mit Hilfe von KI verfasst und selbst geprüft."
        : "Danke an alle, deren Texte wir hier üben dürfen! Unsere eigenen Texte hat Johannes mit Hilfe von KI geschrieben und selbst geprüft.",
    zurueckName: "Zurück zur Bücherei",
    buecherei: "Bücherei",
    weiter: "Weiter",
    weiterUeben: "🎉 Weiter üben",
    zurBuecherei: "🎉 Zur Bücherei",
  },
  en: {
    laedt: "Loading …",
    titel: "Stories & non-fiction",
    leadErwachsen: (_sie: boolean) =>
      "Stories and non-fiction series that carry on from one stage to the next, with no repeats. You'll see whatever your keys already allow.",
    leadJugend:
      "Stories and non-fiction series, stage by stage - you'll see whatever your keys already allow.",
    leadKind:
      "Whole stories and amazing facts are waiting for you here - bit by bit. You read exactly what you can already type with your keys.",
    fortsetzen: (sober: boolean) => (sober ? "Continue" : "Where you left off"),
    etappeVon: (n: number, gesamt: number) => ["Stage ", n, " of ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` · line ${n} of ${gesamt}`,
    weiterlesen: "Continue reading",
    listeName: "Stories and non-fiction series",
    nochmalLesen: "Read again",
    weiterEtappe: (n: number) => `Continue (stage ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Start" : skin === "jugend" ? "Get started" : "Let's go!",
    fertigGelesen: "finished",
    weiterBei: (n: number, gesamt: number) => `continue at stage ${n} of ${gesamt}`,
    etappen: (n: number) => mehrzahl(n, "en", { one: (z) => `${z} stage`, other: (z) => `${z} stages` }),
    art: (wissen: boolean) => (wissen ? "Non-fiction" : "Story"),
    leer: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen"
        ? "Once you have mastered a few more keys, the first stories will appear here."
        : skin === "jugend"
          ? "A few more keys, and the first texts will appear here."
          : "Keep practising a little longer - soon you'll be able to read your first story here!",
    bald: (sober: boolean) => (sober ? "Coming soon" : "You'll be able to read this soon"),
    baldWann: (sober: boolean) => (sober ? "once more keys are mastered" : "once you know more keys"),
    quellen: "Sources & thanks",
    dank: (sober: boolean) =>
      sober
        ? "Texts we have borrowed are listed under their licence, and freely licensed content (CC) with its author - the details are given in German. Johannes Weingartner wrote our own texts with the help of AI and checked them himself."
        : "Thank you to everyone whose texts we can practise with here! Johannes wrote our own texts with the help of AI and checked them himself. The details are given in German.",
    zurueckName: "Back to the library",
    buecherei: "Library",
    weiter: "Continue",
    weiterUeben: "🎉 Keep practising",
    zurBuecherei: "🎉 Back to the library",
  },
  fr: {
    laedt: "Chargement …",
    titel: "Histoires et documentaires",
    leadErwachsen: (sie: boolean) =>
      "Des histoires et des séries documentaires qui s'enchainent, étape par étape, sans répétition. " +
      `Ce qui apparait dépend de ce que ${sie ? "vos" : "tes"} touches permettent déjà.`,
    leadJugend:
      "Histoires et séries documentaires, étape par étape - ce qui apparait dépend de ce que tes touches permettent déjà.",
    leadKind:
      "Des histoires entières et des savoirs passionnants t'attendent ici - petit à petit. Tu lis exactement ce que tu sais déjà écrire avec tes touches.",
    fortsetzen: (sober: boolean) => (sober ? "Continuer" : "Là où tu en étais"),
    etappeVon: (n: number, gesamt: number) => ["Étape ", n, " sur ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` - ligne ${n} sur ${gesamt}`,
    weiterlesen: "Continuer la lecture",
    listeName: "Histoires et séries documentaires",
    nochmalLesen: "Relire",
    weiterEtappe: (n: number) => `Continuer (étape ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Commencer" : skin === "jugend" ? "C'est parti" : "C'est parti !",
    fertigGelesen: "lu en entier",
    weiterBei: (n: number, gesamt: number) => `reprendre à l'étape ${n} sur ${gesamt}`,
    etappen: (n: number) => mehrzahl(n, "fr", { one: (z) => `${z} étape`, other: (z) => `${z} étapes` }),
    art: (wissen: boolean) => (wissen ? "Documentaire" : "Histoire"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "Dès que vous maitriserez quelques touches de plus, les premières histoires apparaitront ici."
          : "Dès que tu maitriseras quelques touches de plus, les premières histoires apparaitront ici."
        : skin === "jugend"
          ? "Encore quelques touches, et les premiers textes apparaitront ici."
          : "Continue à t'exercer encore un peu - bientôt tu pourras lire ta première histoire ici !",
    bald: (sober: boolean) => (sober ? "Bientôt disponible" : "Tu pourras bientôt lire ça"),
    baldWann: (sober: boolean) =>
      sober ? "dès que plus de touches seront acquises" : "dès que tu sauras plus de touches",
    quellen: "Sources et remerciements",
    dank: (sober: boolean) =>
      sober
        ? "Les textes repris sont mentionnés sous leur licence, et les contenus librement sous licence (CC) avec leur auteur - les détails sont donnés en allemand. Johannes Weingartner a écrit nos propres textes avec l'aide de l'IA et les a vérifiés lui-même."
        : "Merci à toutes les personnes dont nous pouvons exercer les textes ici ! Johannes a écrit nos propres textes avec l'aide de l'IA et les a vérifiés lui-même. Les détails sont donnés en allemand.",
    zurueckName: "Retour à la bibliothèque",
    buecherei: "Bibliothèque",
    weiter: "Continuer",
    weiterUeben: "🎉 Continuer à s'exercer",
    zurBuecherei: "🎉 Retour à la bibliothèque",
  },
  // ★ ES-O (27.09.2026): tú; „sie" (Erwachsene mit Sie-Anrede) usted.
  es: {
    laedt: "Cargando …",
    titel: "Cuentos y saberes",
    leadErwachsen: (sie: boolean) =>
      "Cuentos y series de divulgación que continúan, paso a paso y sin repeticiones. " +
      `Lo que aparece depende de lo que ${sie ? "sus" : "tus"} teclas ya permiten.`,
    leadJugend:
      "Cuentos y series de divulgación, paso a paso - lo que aparece depende de lo que tus teclas ya permiten.",
    leadKind:
      "Aquí te esperan cuentos enteros y cosas emocionantes que saber - poco a poco. Lees justo lo que ya sabes escribir con tus teclas.",
    fortsetzen: (sober: boolean) => (sober ? "Continuar" : "Donde lo dejaste"),
    etappeVon: (n: number, gesamt: number) => ["Etapa ", n, " de ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` - línea ${n} de ${gesamt}`,
    weiterlesen: "Seguir leyendo",
    listeName: "Cuentos y series de divulgación",
    nochmalLesen: "Leer otra vez",
    weiterEtappe: (n: number) => `Continuar (etapa ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Empezar" : skin === "jugend" ? "Vamos" : "¡Vamos!",
    fertigGelesen: "leído entero",
    weiterBei: (n: number, gesamt: number) => `seguir en la etapa ${n} de ${gesamt}`,
    etappen: (n: number) => mehrzahl(n, "es", { one: (z) => `${z} etapa`, other: (z) => `${z} etapas` }),
    art: (wissen: boolean) => (wissen ? "Divulgación" : "Cuento"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "En cuanto domine algunas teclas más, aquí aparecerán los primeros cuentos."
          : "En cuanto domines algunas teclas más, aquí aparecerán los primeros cuentos."
        : skin === "jugend"
          ? "Unas pocas teclas más y aquí aparecerán los primeros textos."
          : "Sigue practicando un poco más - ¡pronto podrás leer aquí tu primer cuento!",
    bald: (sober: boolean) => (sober ? "Disponible pronto" : "Pronto podrás leer esto"),
    baldWann: (sober: boolean) =>
      sober ? "en cuanto se dominen más teclas" : "en cuanto sepas más teclas",
    quellen: "Fuentes y agradecimientos",
    dank: (sober: boolean) =>
      sober
        ? "Los textos tomados de otras fuentes se citan con su licencia, y los contenidos con licencia libre (CC), con su autoría - los detalles están en alemán. Johannes Weingartner escribió los textos propios con ayuda de la IA y los revisó él mismo."
        : "¡Gracias a todas las personas cuyos textos podemos practicar aquí! Johannes escribió los textos propios con ayuda de la IA y los revisó él mismo. Los detalles están en alemán.",
    zurueckName: "Volver a la biblioteca",
    buecherei: "Biblioteca",
    weiter: "Continuar",
    weiterUeben: "🎉 Seguir practicando",
    zurBuecherei: "🎉 Volver a la biblioteca",
  },
  // ★ O-IT (02.10.2026): Kind und Jugend „tu", Erwachsene mit `sie` neutral (Regel 1);
  // ohne Partizip, das ein Geschlecht verrät („da dove avevi lasciato").
  it: {
    laedt: "Caricamento in corso...",
    titel: "Storie e curiosità",
    leadErwachsen: (sie: boolean) =>
      "Storie e serie di divulgazione che continuano, passo per passo e senza ripetizioni. " +
      `Quello che compare dipende da quello che ${sie ? "i tasti imparati" : "i tuoi tasti"} permettono già.`,
    leadJugend:
      "Storie e serie di divulgazione, passo per passo - quello che compare dipende da quello che i tuoi tasti permettono già.",
    leadKind:
      "Qui ti aspettano storie intere e cose emozionanti da sapere - un po' alla volta. Leggi proprio quello che sai già scrivere con i tuoi tasti.",
    fortsetzen: (sober: boolean) => (sober ? "Continua" : "Riprendi da dove avevi lasciato"),
    etappeVon: (n: number, gesamt: number) => ["Tappa ", n, " di ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` - riga ${n} di ${gesamt}`,
    weiterlesen: "Continua a leggere",
    listeName: "Storie e serie di divulgazione",
    nochmalLesen: "Leggi di nuovo",
    weiterEtappe: (n: number) => `Continua (tappa ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Inizia" : skin === "jugend" ? "Andiamo" : "Andiamo!",
    fertigGelesen: "letto tutto",
    weiterBei: (n: number, gesamt: number) => `continua dalla tappa ${n} di ${gesamt}`,
    etappen: (n: number) => mehrzahl(n, "it", { one: (z) => `${z} tappa`, other: (z) => `${z} tappe` }),
    art: (wissen: boolean) => (wissen ? "Divulgazione" : "Storia"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "Appena si conosceranno alcuni tasti in più, qui compariranno le prime storie."
          : "Appena conoscerai alcuni tasti in più, qui compariranno le prime storie."
        : skin === "jugend"
          ? "Ancora pochi tasti e qui compariranno i primi testi."
          : "Continua a esercitarti ancora un po' - presto qui potrai leggere la tua prima storia!",
    bald: (sober: boolean) => (sober ? "Disponibile presto" : "Presto potrai leggere questo"),
    baldWann: (sober: boolean) =>
      sober ? "appena si conosceranno più tasti" : "appena saprai più tasti",
    quellen: "Fonti e ringraziamenti",
    dank: (sober: boolean) =>
      sober
        ? "I testi presi da altre fonti sono citati con la loro licenza, e i contenuti con licenza libera (CC) con i nomi di chi li ha scritti - i dettagli sono in tedesco. Johannes Weingartner ha scritto i testi propri con l'aiuto dell'IA e li ha controllati lui stesso."
        : "Grazie a tutte le persone di cui possiamo esercitare qui i testi! Johannes ha scritto i testi propri con l'aiuto dell'IA e li ha controllati lui stesso. I dettagli sono in tedesco.",
    zurueckName: "Torna alla biblioteca",
    buecherei: "Biblioteca",
    weiter: "Avanti",
    weiterUeben: "🎉 Continua a esercitarti",
    zurBuecherei: "🎉 Torna alla biblioteca",
  },
  // ★ O-PL (02.10.2026): „Opowiadania i ciekawostki", „Biblioteka", „etap" (Glossar §2.2);
  // Kind und Jugend „ty", Erwachsene mit `sie` unpersönlich (Regel 1); keine Vergangenheit
  // der 2. Person (Regel 2) - „Tu zatrzymało się czytanie"; „etap" mit vier Formen.
  pl: {
    laedt: "Wczytywanie...",
    titel: "Opowiadania i ciekawostki",
    leadErwachsen: (sie: boolean) =>
      "Powiązane opowiadania i serie ciekawostek - etap po etapie, bez powtórzeń. " +
      `Pojawia się to, na co pozwalają już ${sie ? "opanowane" : "twoje"} klawisze.`,
    leadJugend:
      "Opowiadania i serie ciekawostek, etap po etapie - pojawia się to, na co pozwalają już twoje klawisze.",
    leadKind:
      "Tu czekają całe opowiadania i ciekawe rzeczy do poznania - kawałek po kawałku. Czytasz dokładnie to, co już umiesz napisać swoimi klawiszami.",
    fortsetzen: (sober: boolean) => (sober ? "Kontynuuj" : "Tu zatrzymało się czytanie"),
    etappeVon: (n: number, gesamt: number) => ["Etap ", n, " z ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` - wiersz ${n} z ${gesamt}`,
    weiterlesen: "Czytaj dalej",
    listeName: "Opowiadania i serie ciekawostek",
    nochmalLesen: "Przeczytaj jeszcze raz",
    weiterEtappe: (n: number) => `Dalej (etap ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Zacznij" : skin === "jugend" ? "Zaczynamy" : "Zaczynamy!",
    fertigGelesen: "przeczytane w całości",
    weiterBei: (n: number, gesamt: number) => `dalej od etapu ${n} z ${gesamt}`,
    etappen: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} etap`,
        few: (z) => `${z} etapy`,
        many: (z) => `${z} etapów`,
        other: (z) => `${z} etapu`,
      }),
    art: (wissen: boolean) => (wissen ? "Ciekawostki" : "Opowiadanie"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "Gdy kilka kolejnych klawiszy będzie już pewnych, pojawią się tu pierwsze opowiadania."
          : "Gdy opanujesz kilka klawiszy więcej, pojawią się tu pierwsze opowiadania."
        : skin === "jugend"
          ? "Jeszcze kilka klawiszy i pojawią się tu pierwsze teksty."
          : "Poćwicz jeszcze trochę - niedługo przeczytasz tu swoje pierwsze opowiadanie!",
    bald: (sober: boolean) => (sober ? "Wkrótce dostępne" : "Wkrótce to przeczytasz"),
    baldWann: (sober: boolean) => (sober ? "gdy więcej klawiszy będzie pewnych" : "gdy poznasz więcej klawiszy"),
    quellen: "Źródła i podziękowania",
    dank: (sober: boolean) =>
      sober
        ? "Przejęte teksty podajemy z ich licencją, a treści na wolnej licencji (CC) z nazwiskiem autora lub autorki - szczegóły są po niemiecku. Własne teksty napisał Johannes Weingartner z pomocą sztucznej inteligencji i sam je sprawdził."
        : "Dziękujemy wszystkim, których teksty możemy tu ćwiczyć! Własne teksty napisał Johannes z pomocą sztucznej inteligencji i sam je sprawdził. Szczegóły są po niemiecku.",
    zurueckName: "Wróć do biblioteki",
    buecherei: "Biblioteka",
    weiter: "Dalej",
    weiterUeben: "🎉 Ćwicz dalej",
    zurBuecherei: "🎉 Do biblioteki",
  },
  // ★ O-TR (02.10.2026): "Öyküler ve bilgiler", "Kitaplık", "bölüm" (Glossar §2.2);
  // "Bölüm 2, toplam 8" und "5 bölüm" (Regel 5 und 6); Kind und Jugend sen, die
  // Lehrkraft mit `sie` siz (Regel 1).
  tr: {
    laedt: "Yükleniyor...",
    titel: "Öyküler ve bilgiler",
    leadErwachsen: (sie: boolean) =>
      "Birbirine bağlı öyküler ve bilgi dizileri - bölüm bölüm, tekrar olmadan. " +
      `${sie ? "Öğrendiğiniz" : "Öğrendiğin"} tuşların izin verdiği metinler görünür.`,
    leadJugend:
      "Öyküler ve bilgi dizileri, bölüm bölüm - öğrendiğin tuşların izin verdiği metinler görünür.",
    leadKind:
      "Burada bütün öyküler ve heyecanlı bilgiler seni bekliyor - parça parça. Tuşlarınla yazabildiğin metinleri okursun.",
    fortsetzen: (sober: boolean) => (sober ? "Devam et" : "En son burada kalmıştın"),
    etappeVon: (n: number, gesamt: number) => ["Bölüm ", n, ", toplam ", gesamt],
    zeileVon: (n: number, gesamt: number) => ` - satır ${n}, toplam ${gesamt}`,
    weiterlesen: "Okumaya devam et",
    listeName: "Öyküler ve bilgi dizileri",
    nochmalLesen: "Yeniden oku",
    weiterEtappe: (n: number) => `Devam (bölüm ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Başla" : skin === "jugend" ? "Başlayalım" : "Haydi başlayalım",
    fertigGelesen: "tamamı okundu",
    weiterBei: (n: number, gesamt: number) => `devam: bölüm ${n}, toplam ${gesamt}`,
    etappen: (n: number) => `${n} bölüm`,
    art: (wissen: boolean) => (wissen ? "Bilgi" : "Öykü"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "Birkaç tuşu daha güvenle kullandığınızda burada ilk öyküler görünür."
          : "Birkaç tuşu daha güvenle kullandığında burada ilk öyküler görünür."
        : skin === "jugend"
          ? "Birkaç tuş daha, sonra burada ilk metinler görünür."
          : "Biraz daha çalış - yakında burada ilk öykünü okuyabilirsin!",
    bald: (sober: boolean) => (sober ? "Yakında" : "Bunu yakında okuyabilirsin"),
    baldWann: (sober: boolean) => (sober ? "daha çok tuş oturunca" : "daha çok tuş öğrenince"),
    quellen: "Kaynaklar ve teşekkür",
    dank: (sober: boolean) =>
      sober
        ? "Alınan metinler lisanslarıyla, serbest lisanslı içerikler (CC) yazarlarının adıyla belirtilir - ayrıntılar Almancadır. Kendi metinlerimizi Johannes Weingartner yapay zeka yardımıyla yazdı ve kendisi kontrol etti."
        : "Metinlerini burada çalışabildiğimiz herkese teşekkürler! Kendi metinlerimizi Johannes yapay zeka yardımıyla yazdı ve kendisi kontrol etti. Ayrıntılar Almancadır.",
    zurueckName: "Kitaplığa dön",
    buecherei: "Kitaplık",
    weiter: "Devam",
    weiterUeben: "🎉 Çalışmaya devam et",
    zurBuecherei: "🎉 Kitaplığa dön",
  },
  // ★ O-CS (03.10.2026): „Příběhy a zajímavosti", „Knihovna", „díl" (Glossar §2.2); „Díl 2/8"
  // (Regel 13) und „5 dílů" mit allen vier Formen (§2.11); „série" statt „řada" (= Tastenreihe).
  // Kind und Jugend ty, die Lehrkraft mit `sie` vy (Regel 1); nie eine Vergangenheit der
  // 2. Person (Regel 2) - „Tady se čtení zastavilo".
  cs: {
    laedt: "Načítá se...",
    titel: "Příběhy a zajímavosti",
    leadErwachsen: (sie: boolean) =>
      "Navazující příběhy a série zajímavostí - díl po dílu, bez opakování. " +
      `Objeví se to, co ${sie ? "vaše" : "tvoje"} klávesy už dovolí.`,
    leadJugend:
      "Příběhy a série zajímavostí, díl po dílu - objeví se to, co tvoje klávesy už dovolí.",
    leadKind:
      "Tady čekají celé příběhy a napínavé zajímavosti - kousek po kousku. Čteš přesně to, co už umíš napsat svými klávesami.",
    fortsetzen: (sober: boolean) => (sober ? "Pokračovat" : "Tady se čtení zastavilo"),
    etappeVon: (n: number, gesamt: number) => ["Díl ", n, "/", gesamt],
    zeileVon: (n: number, gesamt: number) => ` - řádek ${n}/${gesamt}`,
    weiterlesen: "Číst dál",
    listeName: "Příběhy a série zajímavostí",
    nochmalLesen: "Číst znovu",
    weiterEtappe: (n: number) => `Dál (díl ${n})`,
    beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
      skin === "erwachsen" ? "Začít" : skin === "jugend" ? "Jdeme na to" : "Jdeme na to!",
    fertigGelesen: "dočteno",
    weiterBei: (n: number, gesamt: number) => `pokračování: díl ${n}/${gesamt}`,
    etappen: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} díl`,
        few: (z) => `${z} díly`,
        many: (z) => `${z} dílu`,
        other: (z) => `${z} dílů`,
      }),
    art: (wissen: boolean) => (wissen ? "Zajímavosti" : "Příběh"),
    leer: (skin: "kind" | "jugend" | "erwachsen", sie: boolean) =>
      skin === "erwachsen"
        ? sie
          ? "Jakmile budete bezpečně ovládat několik dalších kláves, objeví se tu první příběhy."
          : "Jakmile budeš bezpečně ovládat několik dalších kláves, objeví se tu první příběhy."
        : skin === "jugend"
          ? "Ještě pár kláves a objeví se tu první texty."
          : "Cvič ještě chvilku - brzy si tu přečteš svůj první příběh!",
    bald: (sober: boolean) => (sober ? "Brzy k dispozici" : "Tohle si brzy přečteš"),
    baldWann: (sober: boolean) => (sober ? "až bude jistých víc kláves" : "až budeš umět víc kláves"),
    quellen: "Zdroje a poděkování",
    dank: (sober: boolean) =>
      sober
        ? "Převzaté texty uvádíme s jejich licencí, obsah se svobodnou licencí (CC) s uvedením autorství - podrobnosti jsou v němčině. Vlastní texty napsal Johannes Weingartner s pomocí umělé inteligence a sám je zkontroloval."
        : "Děkujeme všem, jejichž texty tu smíme procvičovat! Vlastní texty napsal Johannes s pomocí umělé inteligence a sám je zkontroloval. Podrobnosti jsou v němčině.",
    zurueckName: "Zpět do knihovny",
    buecherei: "Knihovna",
    weiter: "Další",
    weiterUeben: "🎉 Cvičit dál",
    zurBuecherei: "🎉 Do knihovny",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      laedt: "Зареждане...",
      titel: "Истории и любопитни факти",
      leadErwachsen: (_sie: boolean) =>
        "Свързани истории и поредици с любопитни факти - част по част, без повторения. Появява се това, което клавишите ти вече позволяват.",
      leadJugend:
        "Истории и поредици с любопитни факти, част по част - появява се това, което клавишите ти вече позволяват.",
      leadKind:
        "Тук те чакат цели истории и интересни факти - парче по парче. Четеш точно това, което вече можеш да напишеш с клавишите си.",
      fortsetzen: (sober: boolean) => (sober ? "Продължи" : "Тук спря последния път"),
      etappeVon: (n: number, gesamt: number) => ["Част ", n, "/", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · ред ${n}/${gesamt}`,
      weiterlesen: "Чети нататък",
      listeName: "Истории и поредици с любопитни факти",
      nochmalLesen: "Прочети пак",
      weiterEtappe: (n: number) => `Напред (част ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Започни" : skin === "jugend" ? "Започвай" : "Тръгваме!",
      fertigGelesen: "прочетено докрай",
      weiterBei: (n: number, gesamt: number) => `продължава с част ${n}/${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "bg", { one: (z) => `${z} част`, other: (z) => `${z} части` }),
      art: (wissen: boolean) => (wissen ? "Любопитни факти" : "История"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Когато овладееш още няколко клавиша, тук ще се появят първите истории."
          : skin === "jugend"
            ? "Още няколко клавиша - и тук ще се появят първите текстове."
            : "Упражнявай се още малко - скоро тук ще можеш да прочетеш първата си история!",
      bald: (sober: boolean) => (sober ? "Скоро" : "Скоро ще можеш да прочетеш това"),
      baldWann: (sober: boolean) => (sober ? "когато още клавиши станат сигурни" : "когато научиш още клавиши"),
      quellen: "Източници и благодарности",
      dank: (sober: boolean) =>
        sober
          ? "Заетите текстове са посочени с лиценза си, а свободно лицензираното съдържание (CC) - с автора си. Подробностите са на немски. Нашите собствени текстове Johannes Weingartner ги написа с помощта на изкуствен интелект и сам ги провери."
          : "Благодарим на всички, чиито текстове можем да упражняваме тук! Нашите собствени текстове Johannes ги написа с помощта на изкуствен интелект и сам ги провери. Подробностите са на немски.",
      zurueckName: "Обратно към библиотеката",
      buecherei: "Библиотека",
      weiter: "Напред",
      weiterUeben: "🎉 Упражнявай се още",
      zurBuecherei: "🎉 Към библиотеката",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      laedt: "Φόρτωση...",
      titel: "Ιστορίες και γνώσεις",
      leadErwachsen: (_sie: boolean) =>
        "Ιστορίες και σειρές γνώσεων που συνεχίζονται από μέρος σε μέρος, χωρίς επαναλήψεις. " +
        `Εμφανίζεται ό,τι επιτρέπουν ήδη ${_sie ? "τα πλήκτρα σας" : "τα πλήκτρα σου"}.`,
      leadJugend:
        "Ιστορίες και σειρές γνώσεων, μέρος μέρος - εμφανίζεται ό,τι επιτρέπουν ήδη τα πλήκτρα σου.",
      leadKind:
        "Εδώ σε περιμένουν ολόκληρες ιστορίες και συναρπαστικές γνώσεις - κομμάτι κομμάτι. Διαβάζεις ακριβώς ό,τι μπορείς ήδη να γράψεις με τα πλήκτρα σου.",
      fortsetzen: (sober: boolean) => (sober ? "Συνέχεια" : "Εδώ σταμάτησες"),
      etappeVon: (n: number, gesamt: number) => ["Μέρος ", n, " από ", gesamt],
      zeileVon: (n: number, gesamt: number) => `, γραμμή ${n} από ${gesamt}`,
      weiterlesen: "Συνέχεια ανάγνωσης",
      listeName: "Ιστορίες και σειρές γνώσεων",
      nochmalLesen: "Ανάγνωση ξανά",
      weiterEtappe: (n: number) => `Συνέχεια (μέρος ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Έναρξη" : skin === "jugend" ? "Ξεκινάμε" : "Πάμε!",
      fertigGelesen: "ολοκληρώθηκε",
      weiterBei: (n: number, gesamt: number) => `συνέχεια στο μέρος ${n} από ${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "el", { one: (z) => `${z} μέρος`, other: (z) => `${z} μέρη` }),
      art: (wissen: boolean) => (wissen ? "Κείμενο γνώσεων" : "Ιστορία"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Μόλις μάθεις καλά μερικά πλήκτρα ακόμα, θα εμφανιστούν εδώ οι πρώτες ιστορίες."
          : skin === "jugend"
            ? "Λίγα πλήκτρα ακόμα, και εδώ θα εμφανιστούν τα πρώτα κείμενα."
            : "Συνέχισε λίγο ακόμα την εξάσκηση - σύντομα θα μπορείς να διαβάσεις εδώ την πρώτη σου ιστορία!",
      bald: (sober: boolean) => (sober ? "Σύντομα διαθέσιμο" : "Αυτό θα μπορείς να το διαβάσεις σύντομα"),
      baldWann: (sober: boolean) => (sober ? "μόλις γίνουν σίγουρα περισσότερα πλήκτρα" : "μόλις μάθεις περισσότερα πλήκτρα"),
      quellen: "Πηγές και ευχαριστίες",
      dank: (sober: boolean) =>
        sober
          ? "Τα κείμενα που δανειστήκαμε αναφέρονται με την άδειά τους, και το ελεύθερα αδειοδοτημένο περιεχόμενο (CC) με τα στοιχεία δημιουργού - οι λεπτομέρειες είναι στα Γερμανικά. Τα δικά μας κείμενα τα έγραψε ο Johannes Weingartner με τη βοήθεια τεχνητής νοημοσύνης και τα έλεγξε ο ίδιος."
          : "Ευχαριστούμε όλους όσοι μας επιτρέπουν να εξασκούμαστε με τα κείμενά τους! Τα δικά μας κείμενα τα έγραψε ο Johannes με τη βοήθεια τεχνητής νοημοσύνης και τα έλεγξε ο ίδιος. Οι λεπτομέρειες είναι στα Γερμανικά.",
      zurueckName: "Πίσω στη βιβλιοθήκη",
      buecherei: "Βιβλιοθήκη",
      weiter: "Συνέχεια",
      weiterUeben: "🎉 Συνέχεια εξάσκησης",
      zurBuecherei: "🎉 Στη βιβλιοθήκη",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      laedt: "Betöltés...",
      titel: "Történetek és érdekességek",
      leadErwachsen: (_sie: boolean) =>
        "Összefüggő történetek és ismeretterjesztő sorozatok - részről részre, ismétlés nélkül. Az jelenik meg, amit a billentyűid már lehetővé tesznek.",
      leadJugend:
        "Történetek és ismeretterjesztő sorozatok, részről részre - az jelenik meg, amit a billentyűid már lehetővé tesznek.",
      leadKind:
        "Itt egész történetek és izgalmas érdekességek várnak rád - darabról darabra. Pontosan azt olvasod, amit a billentyűiddel már le tudsz írni.",
      fortsetzen: (sober: boolean) => (sober ? "Folytatás" : "Itt tartottál legutóbb"),
      etappeVon: (n: number, gesamt: number) => ["Rész: ", n, "/", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · sor: ${n}/${gesamt}`,
      weiterlesen: "Olvasás tovább",
      listeName: "Történetek és ismeretterjesztő sorozatok",
      nochmalLesen: "Újraolvasás",
      weiterEtappe: (n: number) => `Tovább (rész: ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Kezdés" : skin === "jugend" ? "Indulás" : "Gyerünk!",
      fertigGelesen: "végigolvasva",
      weiterBei: (n: number, gesamt: number) => `folytatás innen: rész ${n}/${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "hu", { one: (z) => `${z} rész`, other: (z) => `${z} rész` }),
      art: (wissen: boolean) => (wissen ? "Ismeretterjesztő" : "Történet"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Ha még néhány billentyű biztosan megy, itt jelennek meg az első történetek."
          : skin === "jugend"
            ? "Még néhány billentyű, és itt megjelennek az első szövegek."
            : "Gyakorolj még egy kicsit - és hamarosan itt olvashatod az első történetedet!",
      bald: (sober: boolean) => (sober ? "Hamarosan elérhető" : "Ezt hamarosan elolvashatod"),
      baldWann: (sober: boolean) => (sober ? "ha több billentyű biztos" : "ha több billentyűt ismersz"),
      quellen: "Források és köszönet",
      dank: (sober: boolean) =>
        sober
          ? "Az átvett szövegeket a licencükkel, a szabad licencű (CC) tartalmakat a szerzőjükkel együtt nevezzük meg - a részletek német nyelvűek. A saját szövegeinket Johannes Weingartner írta mesterséges intelligencia segítségével, és ő maga ellenőrizte őket."
          : "Köszönet mindenkinek, akinek a szövegeivel itt gyakorolhatunk! A saját szövegeinket Johannes írta mesterséges intelligencia segítségével, és ő maga ellenőrizte őket. A részletek német nyelvűek.",
      zurueckName: "Vissza a könyvtárba",
      buecherei: "Könyvtár",
      weiter: "Tovább",
      weiterUeben: "🎉 Gyakorlás tovább",
      zurBuecherei: "🎉 Vissza a könyvtárba",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      laedt: "Laden...",
      titel: "Verhalen en weetjes",
      leadErwachsen: (_sie: boolean) =>
        "Verhalen en weetjesreeksen die van deel tot deel doorlopen, zonder herhaling. Je ziet wat je toetsen al toelaten.",
      leadJugend:
        "Verhalen en weetjesreeksen, deel voor deel - je ziet wat je toetsen al toelaten.",
      leadKind:
        "Hier wachten hele verhalen en spannende weetjes op je - stukje voor stukje. Je leest precies wat je met je toetsen al kunt typen.",
      fortsetzen: (sober: boolean) => (sober ? "Verder" : "Hier was je gebleven"),
      etappeVon: (n: number, gesamt: number) => ["Deel ", n, " van ", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · regel ${n} van ${gesamt}`,
      weiterlesen: "Verder lezen",
      listeName: "Verhalen en weetjesreeksen",
      nochmalLesen: "Opnieuw lezen",
      weiterEtappe: (n: number) => `Verder (deel ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Beginnen" : skin === "jugend" ? "Aan de slag" : "Daar gaan we!",
      fertigGelesen: "uitgelezen",
      weiterBei: (n: number, gesamt: number) => `verder bij deel ${n} van ${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "nl", { one: (z) => `${z} deel`, other: (z) => `${z} delen` }),
      art: (wissen: boolean) => (wissen ? "Weetjes" : "Verhaal"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Zodra je nog een paar toetsen zeker beheerst, verschijnen hier de eerste verhalen."
          : skin === "jugend"
            ? "Nog een paar toetsen, dan verschijnen hier de eerste teksten."
            : "Oefen nog een beetje verder - dan kun je hier straks je eerste verhaal lezen!",
      bald: (sober: boolean) => (sober ? "Binnenkort beschikbaar" : "Dit kun je straks lezen"),
      baldWann: (sober: boolean) => (sober ? "zodra meer toetsen zeker zijn" : "zodra je meer toetsen kent"),
      quellen: "Bronnen en dank",
      dank: (sober: boolean) =>
        sober
          ? "Overgenomen teksten staan vermeld met hun licentie, vrij gelicenseerde inhoud (CC) met de maker - de details staan in het Duits. Johannes Weingartner heeft onze eigen teksten met hulp van AI geschreven en zelf gecontroleerd."
          : "Dank aan iedereen met wiens teksten we hier mogen oefenen! Johannes heeft onze eigen teksten met hulp van AI geschreven en zelf gecontroleerd. De details staan in het Duits.",
      zurueckName: "Terug naar de bibliotheek",
      buecherei: "Bibliotheek",
      weiter: "Verder",
      weiterUeben: "🎉 Verder oefenen",
      zurBuecherei: "🎉 Naar de bibliotheek",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      laedt: "A carregar...",
      titel: "Histórias e curiosidades",
      leadErwachsen: (_sie: boolean) =>
        "Histórias e séries de curiosidades que continuam de uma parte para a outra, sem repetições. Aparece o que as tuas teclas já permitem.",
      leadJugend:
        "Histórias e séries de curiosidades, parte a parte - aparece o que as tuas teclas já permitem.",
      leadKind:
        "Aqui esperam-te histórias inteiras e curiosidades fantásticas - pouco a pouco. Lês exatamente o que já consegues escrever com as tuas teclas.",
      fortsetzen: (sober: boolean) => (sober ? "Continuar" : "Ficaste aqui"),
      etappeVon: (n: number, gesamt: number) => ["Parte ", n, " de ", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · linha ${n} de ${gesamt}`,
      weiterlesen: "Continuar a ler",
      listeName: "Histórias e séries de curiosidades",
      nochmalLesen: "Ler outra vez",
      weiterEtappe: (n: number) => `Continuar (parte ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Começar" : skin === "jugend" ? "Vamos lá" : "Vamos!",
      fertigGelesen: "leitura concluída",
      weiterBei: (n: number, gesamt: number) => `continuar na parte ${n} de ${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "pt", { one: (z) => `${z} parte`, other: (z) => `${z} partes` }),
      art: (wissen: boolean) => (wissen ? "Curiosidades" : "História"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Quando dominares mais algumas teclas, as primeiras histórias aparecem aqui."
          : skin === "jugend"
            ? "Mais algumas teclas, e os primeiros textos aparecem aqui."
            : "Continua a praticar mais um pouco - em breve vais poder ler aqui a tua primeira história!",
      bald: (sober: boolean) => (sober ? "Em breve" : "Em breve vais poder ler isto"),
      baldWann: (sober: boolean) => (sober ? "quando houver mais teclas dominadas" : "quando souberes mais teclas"),
      quellen: "Fontes e agradecimentos",
      dank: (sober: boolean) =>
        sober
          ? "Os textos de outras fontes são indicados com a sua licença, e os conteúdos com licença livre (CC) com a sua autoria - os pormenores estão em alemão. Johannes Weingartner escreveu os nossos próprios textos com a ajuda de IA e reviu-os pessoalmente."
          : "Obrigado a todas as pessoas cujos textos podemos praticar aqui! Johannes escreveu os nossos próprios textos com a ajuda de IA e reviu-os pessoalmente. Os pormenores estão em alemão.",
      zurueckName: "Voltar à biblioteca",
      buecherei: "Biblioteca",
      weiter: "Continuar",
      weiterUeben: "🎉 Continuar a praticar",
      zurBuecherei: "🎉 Voltar à biblioteca",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      laedt: "Carregando …",
      titel: "Histórias e curiosidades",
      leadErwachsen: (_sie: boolean) =>
        "Histórias e coleções de curiosidades que continuam de uma parte para a outra, sem repetição. Aparece o que as suas teclas já permitem.",
      leadJugend:
        "Histórias e coleções de curiosidades, parte por parte - aparece o que as suas teclas já permitem.",
      leadKind:
        "Aqui esperam por você histórias inteiras e curiosidades incríveis - pedacinho por pedacinho. Você lê exatamente o que já consegue digitar com as suas teclas.",
      fortsetzen: (sober: boolean) => (sober ? "Continuar" : "Onde você parou"),
      etappeVon: (n: number, gesamt: number) => ["Parte ", n, " de ", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · linha ${n} de ${gesamt}`,
      weiterlesen: "Continuar lendo",
      listeName: "Histórias e coleções de curiosidades",
      nochmalLesen: "Ler de novo",
      weiterEtappe: (n: number) => `Continuar (parte ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Começar" : skin === "jugend" ? "Vamos começar" : "Vamos lá!",
      fertigGelesen: "leitura concluída",
      weiterBei: (n: number, gesamt: number) => `continuar na parte ${n} de ${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "br", { one: (z) => `${z} parte`, other: (z) => `${z} partes` }),
      art: (wissen: boolean) => (wissen ? "Curiosidades" : "História"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Quando você dominar mais algumas teclas, as primeiras histórias vão aparecer aqui."
          : skin === "jugend"
            ? "Mais algumas teclas, e os primeiros textos aparecem aqui."
            : "Continue praticando mais um pouco - logo você vai poder ler a sua primeira história aqui!",
      bald: (sober: boolean) => (sober ? "Em breve" : "Logo você vai poder ler isto"),
      baldWann: (sober: boolean) => (sober ? "quando houver mais teclas seguras" : "quando você souber mais teclas"),
      quellen: "Fontes e agradecimentos",
      dank: (sober: boolean) =>
        sober
          ? "Os textos de terceiros são citados com a sua licença, e o conteúdo de licença livre (CC) com a sua autoria - os detalhes estão em alemão. Johannes Weingartner escreveu os nossos próprios textos com a ajuda de IA e os revisou pessoalmente."
          : "Agradecemos a todas as pessoas cujos textos podemos usar para praticar aqui! Johannes escreveu os nossos próprios textos com a ajuda de IA e os revisou pessoalmente. Os detalhes estão em alemão.",
      zurueckName: "Voltar para a biblioteca",
      buecherei: "Biblioteca",
      weiter: "Continuar",
      weiterUeben: "🎉 Continuar praticando",
      zurBuecherei: "🎉 Voltar para a biblioteca",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      laedt: "Se încarcă...",
      titel: "Povești și curiozități",
      leadErwachsen: (_sie: boolean) =>
        "Povești și serii de curiozități care continuă de la o parte la alta, fără repetări. Apare ce îți permit deja tastele tale.",
      leadJugend:
        "Povești și serii de curiozități, parte cu parte - apare ce îți permit deja tastele tale.",
      leadKind:
        "Aici te așteaptă povești întregi și curiozități interesante - bucată cu bucată. Citești exact ce poți deja să scrii cu tastele tale.",
      fortsetzen: (sober: boolean) => (sober ? "Continuați" : "Aici ai rămas"),
      etappeVon: (n: number, gesamt: number) => ["Partea ", n, " din ", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · rândul ${n} din ${gesamt}`,
      weiterlesen: "Citiți mai departe",
      listeName: "Povești și serii de curiozități",
      nochmalLesen: "Citiți din nou",
      weiterEtappe: (n: number) => `Mai departe (partea ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Începeți" : skin === "jugend" ? "Hai să începem" : "Să începem!",
      fertigGelesen: "citită până la capăt",
      weiterBei: (n: number, gesamt: number) => `continuă de la partea ${n} din ${gesamt}`,
      etappen: (n: number) =>
        mehrzahl(n, "ro", {
          one: (z) => `${z} parte`,
          few: (z) => `${z} părți`,
          other: (z) => `${z} de părți`,
        }),
      art: (wissen: boolean) => (wissen ? "Curiozități" : "Poveste"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Când vei stăpâni sigur încă câteva taste, aici vor apărea primele povești."
          : skin === "jugend"
            ? "Încă câteva taste, și aici apar primele texte."
            : "Mai exersează puțin - în curând poți citi aici prima ta poveste!",
      bald: (sober: boolean) => (sober ? "În curând" : "Asta poți citi în curând"),
      baldWann: (sober: boolean) => (sober ? "când mai multe taste sunt sigure" : "când știi mai multe taste"),
      quellen: "Surse și mulțumiri",
      dank: (sober: boolean) =>
        sober
          ? "Textele preluate sunt menționate cu licența lor, iar conținutul cu licență liberă (CC) cu autorul lui - detaliile sunt în limba germană. Johannes Weingartner a scris textele noastre proprii cu ajutorul IA și le-a verificat el însuși."
          : "Mulțumim tuturor celor ale căror texte le putem exersa aici! Johannes a scris textele noastre proprii cu ajutorul IA și le-a verificat el însuși. Detaliile sunt în limba germană.",
      zurueckName: "Înapoi la bibliotecă",
      buecherei: "Bibliotecă",
      weiter: "Mai departe",
      weiterUeben: "🎉 Exersați în continuare",
      zurBuecherei: "🎉 Înapoi la bibliotecă",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      laedt: "Läser in...",
      titel: "Berättelser och fakta",
      leadErwachsen: (_sie: boolean) =>
        "Sammanhängande berättelser och faktatexter i flera delar - del för del, utan upprepningar. Här visas det som dina tangenter redan räcker till.",
      leadJugend:
        "Berättelser och faktatexter, del för del - här visas det som dina tangenter redan räcker till.",
      leadKind:
        "Här väntar hela berättelser och spännande fakta - bit för bit. Du läser precis det som du redan kan skriva med dina tangenter.",
      fortsetzen: (sober: boolean) => (sober ? "Fortsätt" : "Här var du senast"),
      etappeVon: (n: number, gesamt: number) => ["Del ", n, " av ", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · rad ${n} av ${gesamt}`,
      weiterlesen: "Läs vidare",
      listeName: "Berättelser och faktatexter i flera delar",
      nochmalLesen: "Läs igen",
      weiterEtappe: (n: number) => `Fortsätt (del ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Börja" : skin === "jugend" ? "Kör igång" : "Nu kör vi!",
      fertigGelesen: "färdigläst",
      weiterBei: (n: number, gesamt: number) => `fortsätt vid del ${n} av ${gesamt}`,
      etappen: (n: number) => mehrzahl(n, "sv", { one: (z) => `${z} del`, other: (z) => `${z} delar` }),
      art: (wissen: boolean) => (wissen ? "Fakta" : "Berättelse"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "När du kan några tangenter till säkert visas de första berättelserna här."
          : skin === "jugend"
            ? "Några tangenter till, sedan visas de första texterna här."
            : "Öva lite till - snart kan du läsa din första berättelse här!",
      bald: (sober: boolean) => (sober ? "Kommer snart" : "Det här kan du snart läsa"),
      baldWann: (sober: boolean) => (sober ? "när fler tangenter sitter" : "när du kan fler tangenter"),
      quellen: "Källor och tack",
      dank: (sober: boolean) =>
        sober
          ? "Lånade texter anges med sin licens, och fritt licensierat innehåll (CC) med sin upphovsperson - detaljerna står på tyska. Johannes Weingartner har skrivit de egna texterna med hjälp av AI och granskat dem själv."
          : "Tack till alla vars texter vi får öva med här! Johannes har skrivit våra egna texter med hjälp av AI och granskat dem själv. Detaljerna står på tyska.",
      zurueckName: "Tillbaka till biblioteket",
      buecherei: "Biblioteket",
      weiter: "Fortsätt",
      weiterUeben: "🎉 Öva vidare",
      zurBuecherei: "🎉 Till biblioteket",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      laedt: "Завантаження...",
      titel: "Історії і цікавинки",
      leadErwachsen: (_sie: boolean) =>
        "Пов'язані історії й пізнавальні серії - частина за частиною, без повторів. З'являється те, що вже дозволяють твої клавіші.",
      leadJugend:
        "Історії й пізнавальні серії, частина за частиною - з'являється те, що вже дозволяють твої клавіші.",
      leadKind:
        "Тут на тебе чекають цілі історії й цікаві знання - крок за кроком. Ти читаєш саме те, що вже вмієш надрукувати своїми клавішами.",
      fortsetzen: (sober: boolean) => (sober ? "Продовжити" : "Продовжити звідси"),
      etappeVon: (n: number, gesamt: number) => ["Частина ", n, "/", gesamt],
      zeileVon: (n: number, gesamt: number) => ` · рядок ${n}/${gesamt}`,
      weiterlesen: "Читати далі",
      listeName: "Історії й пізнавальні серії",
      nochmalLesen: "Прочитати ще раз",
      weiterEtappe: (n: number) => `Далі (частина ${n})`,
      beginnen: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen" ? "Почати" : skin === "jugend" ? "Уперед" : "Починаємо!",
      fertigGelesen: "прочитано",
      weiterBei: (n: number, gesamt: number) => `продовжити з частини ${n}/${gesamt}`,
      etappen: (n: number) =>
        mehrzahl(n, "uk", {
          one: (z) => `${z} частина`,
          few: (z) => `${z} частини`,
          many: (z) => `${z} частин`,
          other: (z) => `${z} частини`,
        }),
      art: (wissen: boolean) => (wissen ? "Пізнавальний текст" : "Історія"),
      leer: (skin: "kind" | "jugend" | "erwachsen") =>
        skin === "erwachsen"
          ? "Щойно ти впевнено опануєш ще кілька клавіш, тут з'являться перші історії."
          : skin === "jugend"
            ? "Ще кілька клавіш - і тут з'являться перші тексти."
            : "Потренуйся ще трохи - і скоро тут можна буде прочитати твою першу історію!",
      bald: (sober: boolean) => (sober ? "Скоро" : "Це ти скоро зможеш прочитати"),
      baldWann: (sober: boolean) => (sober ? "коли більше клавіш стануть впевненими" : "коли знатимеш більше клавіш"),
      quellen: "Джерела й подяка",
      dank: (sober: boolean) =>
        sober
          ? "Запозичені тексти наведено з їхньою ліцензією, вільно ліцензований вміст (CC) - з автором; подробиці подано німецькою. Власні тексти написав Johannes Weingartner за допомогою ШІ й сам їх перевірив."
          : "Дякуємо всім, чиї тексти ми можемо тут тренувати! Наші власні тексти написав Johannes за допомогою ШІ й сам їх перевірив. Подробиці подано німецькою.",
      zurueckName: "Назад до бібліотеки",
      buecherei: "Бібліотека",
      weiter: "Далі",
      weiterUeben: "🎉 Тренуватися далі",
      zurBuecherei: "🎉 До бібліотеки",
    },
});

interface SerienTrainerProps {
  loadFn: () => Promise<TypingProgress>;
  saveFn: (p: TypingProgress) => void | Promise<void>;
  onTask?: (e: Omit<TaskEvent, "ts">) => void | Promise<void>;
  /** Zurück in den Übungsmodus, aus dem die Geschichte geöffnet wurde. */
  onBackToPractice?: () => void;
  /**
   * ★ 17.10.2026 (Johannes): ein Schalter OBEN in der Bücherei, der immer nach
   * „Mein Training" zurückführt (anders als `onBackToPractice`, das in den
   * Bereich zurückgeht, aus dem gelesen wurde). Mit der Beschriftung in der
   * Bedienungssprache - die Seite kennt die Wörter.
   */
  onZuMeinTraining?: () => void;
  zuMeinTrainingName?: string;
  stufe: Stufe;
  lang: Lang;
  startTempo?: TempoLevel;
  goalSlot?: React.ReactNode;
  enforceShiftHand?: boolean;
  /** „Zeit lassen" (Eigenschaft des Kindes) — Tempo zählt nirgends. */
  zeitLassen?: boolean;
  /**
   * „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus, 2 = doppelt,
   * 3 = dreifach, 4 = vierfach - siehe `zeichenabstand.ts`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /**
   * ★ Zeilenende mit Enter (23.09.2026, Klassen-Einstellung
   * `TypingClass.zeilenEndeEnter`) - gilt auch beim Lesen/Tippen einer
   * Geschichte (Bauplan: „Geschichten" gehört zu den Übungsarten, die die
   * Pflicht mitbekommen). Vorgabe `false` (wie heute).
   */
  zeilenEnde?: boolean;
  /**
   * Direkt in diese Serie springen (Einweben aus „Mein Training": „Weiter mit
   * deiner Geschichte?"). Wird EINMAL beim Öffnen ausgewertet; danach räumt die
   * Komponente selbst zwischen Bücherei und Leser um.
   */
  initialSlug?: string | null;
  /** Meldet der Seite, dass `initialSlug` verbraucht ist (damit es nicht klebt). */
  onInitialConsumed?: () => void;
}

function kindIcon(serie: Serie): string {
  return serie.kind === "wissen-serie" ? "💡" : "📖";
}

export function SerienTrainer({
  loadFn,
  saveFn,
  onTask,
  onBackToPractice,
  onZuMeinTraining,
  zuMeinTrainingName,
  stufe,
  lang,
  startTempo,
  goalSlot,
  enforceShiftHand = true,
  zeitLassen = false,
  zeichenabstand = 1,
  zeilenEnde = false,
  initialSlug,
  onInitialConsumed,
}: SerienTrainerProps) {
  const voiceEnabled = useVoice((s) => s.enabled);
  // ★ EN1: Bedienungssprache - für die Beschriftungen, und in Tastenflow
  // auch für das, was die Bedienung SAGT (Alt + L, „Geschichten und Wissen").
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - BUECHEREI_TEXTE, bedienCopy() und belohnungsAngebot() kennen
  // „fr" bereits.
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = BUECHEREI_TEXTE[sprache];
  // ★ Die Anrede (19.09.2026): „Sie" nur für die Lehrkraft (`anredeFuer`).
  const anrede = useAnrede();
  const bedienRef = useRef({ sprache, bereichAktiv });
  bedienRef.current = { sprache, bereichAktiv };
  const [progress, setProgress] = useState<TypingProgress>(() => emptyProgress());
  const [ready, setReady] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  // Bei welcher Etappe der Leser öffnet (Resume-Stand ODER 0 bei „nochmal lesen").
  const [startEtappe, setStartEtappe] = useState(0);
  // …und bei welcher ZEILE innerhalb dieser Etappe (zeilengenaues Resume).
  const [startLine, setStartLine] = useState(0);
  // Kurze Stufen-Einblendung auf Alt+L - NUR in der Bücherei-Liste; im Leser
  // blendet `TypingSession` ein (siehe den Alt+L-Block weiter unten).
  const [levelFlash, setLevelFlash] = useState<string | null>(null);

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const initialDoneRef = useRef(false);
  const liveRef = useRef<HTMLDivElement>(null);
  const liveTimer = useRef<number | null>(null);

  // Spielstand laden; danach — falls die Seite ein `initialSlug` mitgibt (Einweben)
  // — direkt in diese Serie an ihrem Resume-Stand springen.
  useEffect(() => {
    let alive = true;
    void loadFn().then((p) => {
      if (!alive) return;
      progressRef.current = p;
      setProgress(p);
      setReady(true);
      if (initialSlug && !initialDoneRef.current) {
        initialDoneRef.current = true;
        const serie = serieBySlug(initialSlug);
        if (serie) {
          setStartEtappe(startEtappeFor(p, serie));
          setStartLine(startLineFor(p, serie));
          setActiveSlug(serie.slug);
          // ★ 31.08.2026 (Vollaudit, Zensus Nr 91): Dieser Zweig ist der
          // ausdrückliche Haupt-Lese-Weg der App („Jetzt kommt eine
          // Geschichte: X" auf der Abschluss-Karte). Er ging bisher als
          // einziger an `startSerie` vorbei - und damit an der Ansage des
          // Titels. Wer über die Bücherei-Liste einstieg, hörte den Titel;
          // wer den erwünschten Weg nahm, hörte nichts. Derselbe Aufruf wie
          // in `startSerie` (unten), kein neuer Wortlaut.
          speakUi(serie.titel + ".");
          // Nr 10, dritter Weg: das Geschichten-Angebot der Abschluss-Karte
          // (`StoryOffer`) - auch dort ist das Ziel das Tippfeld des Lesers.
          focusPracticeField();
        }
        onInitialConsumed?.();
      } else {
        // Nr 9: Die Bücherei baut sich auf, weil jemand hierher gewechselt hat
        // („📖 Geschichten", Zahnrad, Alt + B). Fokus auf ihre Überschrift.
        fokusBuecherei();
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    (p: TypingProgress) => {
      progressRef.current = p; // Ref sofort nachziehen (Lost-Update-Schutz)
      setProgress(p);
      saveFn(p);
    },
    [saveFn],
  );

  // ── Alt+L: Übungs-/Spielstufe (XP-Level) ansagen ───────────────────────────
  //
  // Bis 22.08.2026 war Alt+L in der Bücherei STUMM. `TippenTrainerPage` wirft
  // auf Alt+L das Ereignis `tippen-request-level`; geantwortet hat aber nur
  // `AdaptiveTrainer` (bis 19.09.2026 auch `TypingTrainer`, siehe E7) - und
  // die Trainer werden EXKLUSIV gerendert. In „Geschichten & Wissen" war also
  // niemand da, der antwortet, obwohl die Kürzel-Liste das Kürzel ohne
  // Einschränkung allen zusagt und der Ring die Stufe sehr wohl ANZEIGT. Wer
  // sieht, bekam die Zahl; wer auf Sprachausgabe oder Braillezeile
  // angewiesen ist, kam gar nicht an sie heran - die Umkehrung dessen, wofür
  // diese App da ist.
  //
  // Gebaut wie in `AdaptiveTrainer`: `progressRef` statt des States
  // `progress`, sonst hinge eine veraltete Zahl im Abschluss fest. Und
  // `stufe` MUSS in den Abhängigkeiten stehen, sonst bliebe nach einem
  // Stufenwechsel das Wort der vorigen Tonlage hängen („Spielstufe" statt
  // „Übungsstufe"). Der Wortlaut kommt aus dem Profil (`progressLabel`), nie
  // aus festem Text - genau das war der Fehler vom 22.08. (K34).
  useEffect(() => {
    const onRequest = () => {
      const pl = playerLevel(progressRef.current.xp);
      // ★ EN1: in Tastenflow das Wort der Bedienungssprache.
      const b = bedienRef.current;
      const wort = b.bereichAktiv ? bedienCopy(stufe, b.sprache).progressLabel : copyFor(stufe).progressLabel;
      const label = `${wort} ${pl.level}`;
      window.dispatchEvent(new CustomEvent("tippen-announce-level", { detail: label }));
    };
    window.addEventListener("tippen-request-level", onRequest);
    return () => window.removeEventListener("tippen-request-level", onRequest);
  }, [stufe]);

  // …und die Antwort AUSGEBEN, solange die Bücherei-Liste offen ist. Im Leser
  // erledigt das `TypingSession` (Einblendung + Braillezeile + Sprachausgabe) -
  // in der Liste steht aber keine `TypingSession` im Baum, dort hörte die
  // Antwort sonst niemand. `activeSlug` hält beide Wege auseinander, damit
  // Alt+L nie DOPPELT spricht: Liste = hier, Leser = `TypingSession`.
  // Kein Fokus-Eingriff - das Kind tippt womöglich gerade.
  useEffect(() => {
    if (activeSlug) return;
    const onLevel = (e: Event) => {
      const label = (e as CustomEvent<string>).detail ?? "";
      if (!label) return;
      // Erst leeren, 50 ms später füllen: Zwei GLEICHE Meldungen hintereinander
      // liest NVDA sonst nicht erneut (die Live-Region ändert sich ja nicht) -
      // und zweimal Alt+L ist genau der Normalfall. Muster wie `TypingSession`.
      if (liveRef.current) {
        if (liveTimer.current !== null) window.clearTimeout(liveTimer.current);
        liveRef.current.textContent = "";
        liveTimer.current = window.setTimeout(() => {
          if (liveRef.current) liveRef.current.textContent = label;
          liveTimer.current = null;
        }, 50);
      }
      const b = bedienRef.current;
      if (b.bereichAktiv) speakUi(label, undefined, undefined, b.sprache);
      else speakUi(label);
      setLevelFlash(label);
      window.setTimeout(() => setLevelFlash(null), 1900);
    };
    window.addEventListener("tippen-announce-level", onLevel);
    return () => window.removeEventListener("tippen-announce-level", onLevel);
  }, [activeSlug]);

  const allowed = useMemo(
    () => allowedFromIntroduced(progress.introduced, lernwegVon(progress)),
    [progress.introduced, progress.lernweg],
  );
  // ★ 28.09.2026: die Sprachen dieses Kindes - für „Quellen & Dank".
  const meineSprachen = useMemo(() => sprachPaketeFuer(lernwegVon(progress), lang), [progress.lernweg, lang]);

  /**
   * ★ Nr 9 der Fokusziele (22.08.2026): das EINE Fokus-Ziel der Bücherei.
   *
   * Wer in die Bücherei kommt, landet auf ihrer Überschrift „Geschichten &
   * Wissen" (`tabIndex={-1}`), und sie wird angesagt - R4 für eine Ansicht,
   * in der man liest und wählt (im Unterschied zu einer Übung, die das
   * Tippfeld bekommt). Es gibt drei Wege hinein, und alle drei enden hier:
   * „Zurück zur Bücherei" im Leser, der Knopf „📖 Geschichten" in den
   * Lektionen und der Wechsel der Übungsart im Zahnrad. Für die letzten
   * beiden gab es bisher gar kein Ziel: Die ganze Karte wurde ausgetauscht,
   * und niemand setzte einen Fokus.
   */
  const fokusBuecherei = useCallback(() => {
    // ★ EN1: der Name des Bereichs ist Bedienung - in Tastenflow in ihrer
    // Sprache und Stimme.
    const b = bedienRef.current;
    if (b.bereichAktiv) speakUi(ansage("modusBuecherei", b.sprache), undefined, undefined, b.sprache);
    else speakUi(ansage("modusBuecherei"));
    window.setTimeout(() => {
      document
        .getElementById("buecherei-titel")
        ?.focus({ preventScroll: true });
    }, 0);
  }, []);

  const openLibrary = useCallback(() => {
    setActiveSlug(null);
    fokusBuecherei();
  }, [fokusBuecherei]);

  const startSerie = useCallback(
    (serie: Serie) => {
      const cur = progressRef.current;
      const status = serieStatus(cur, serie.slug);
      // Zuletzt geöffnete Serie merken — die Bücherei bietet sie beim nächsten
      // Besuch ganz oben als „Weiter: …" an (Resume, 21.07.).
      const lastPlace = { ...cur.lastPlace, mode: "buecherei" as const, serieSlug: serie.slug };
      if (status === "fertig") {
        // „Nochmal lesen": Fortschritt zurücksetzen, wieder bei Etappe 0 beginnen.
        persist({
          ...cur,
          lastPlace,
          storyProgress: resetStory(cur.storyProgress, serie.slug),
        });
        setStartEtappe(0);
        setStartLine(0);
      } else {
        persist({ ...cur, lastPlace });
        setStartEtappe(startEtappeFor(cur, serie));
        setStartLine(startLineFor(cur, serie));
      }
      speakUi(serie.titel + ".");
      setActiveSlug(serie.slug);
      // ★ Nr 10 der Fokusziele (22.08.2026): Der Leser ist eine ÜBUNG, sein
      // Ziel ist darum das Tippfeld (R4) - und zwar ausdrücklich. Bisher hing
      // es am Zufall: Das frisch aufgebaute Feld zieht den Fokus im nächsten
      // Takt von selbst an sich, aber nur, solange kein Dialog offen ist und
      // die Serie sofort im Baum steht. Diese eine Stelle deckt beide Wege
      // („Weiterlesen" auf der Fortsetzen-Karte und jede Serien-Kachel).
      focusPracticeField();
    },
    [persist],
  );

  const activeSerie = activeSlug ? serieBySlug(activeSlug) : undefined;

  if (!ready)
    return <div className="card p-6 text-center text-ink-muted">{t.laedt}</div>;

  // ── LESER ──────────────────────────────────────────────────────────────────
  if (activeSerie) {
    return (
      <SerieReader
        key={activeSerie.slug}
        serie={activeSerie}
        startEtappe={startEtappe}
        startLine={startLine}
        stufe={stufe}
        lang={lang}
        startTempo={startTempo}
        voiceEnabled={voiceEnabled}
        enforceShiftHand={enforceShiftHand}
        zeitLassen={zeitLassen}
        zeichenabstand={zeichenabstand}
        zeilenEnde={zeilenEnde}
        progressRef={progressRef}
        persist={persist}
        onTask={onTask}
        onExit={openLibrary}
        onBackToPractice={onBackToPractice}
        goalSlot={goalSlot}
      />
    );
  }

  // ── BÜCHEREI ───────────────────────────────────────────────────────────────
  const skin = skinForStufe(stufe);
  // Viele der ruhigen Texte sind anrede-frei — jugend und erwachsen teilen sie
  // (`sober`); wo eine Anrede oder ein Ton vorkommt, gibt es eigene Fassungen
  // je Profil.
  const sober = skin !== "kind";
  const copy = copyFor(stufe);
  const pl = playerLevel(progress.xp);
  // ★ D-2 (28.09.2026): Erwachsene vor ⇧ - Geschichten mit Grossbuchstaben
  // bleiben zu, bis die Umschalttaste gelernt ist (`nurKleinschrift`).
  const umschaltGelernt = ensureIntroduced(progress.introduced, lernwegVon(progress)).includes(SHIFT_UNIT);
  const unlocked = unlockedSerien(allowed, stufe, lang, lernwegVon(progress), umschaltGelernt);
  const locked = lockedSerien(allowed, stufe, lang, lernwegVon(progress), umschaltGelernt);

  // Angefangene Geschichte fürs „Weiter"-Angebot oben (Resume, 21.07.). Zeigt
  // Etappe UND — wenn mittendrin abgebrochen wurde — die Zeile, jeweils 1-basiert
  // zum Anzeigen.
  const weiterSerie = resumeSerie(progress, allowed, stufe, lang, lernwegVon(progress), umschaltGelernt);
  const weiter = weiterSerie
    ? {
        serie: weiterSerie,
        total: serieEtappeCount(weiterSerie),
        etappe: startEtappeFor(progress, weiterSerie) + 1,
        line: startLineFor(progress, weiterSerie),
        lines:
          weiterSerie.etappen[startEtappeFor(progress, weiterSerie)]?.lines.length ?? 0,
      }
    : null;

  const sie = isFormal(skin, anrede);
  const lead =
    skin === "erwachsen" ? t.leadErwachsen(sie) : skin === "jugend" ? t.leadJugend : t.leadKind;
  /** Titel sind INHALT: bei aktivem Sprachbereich in ihrer Sprache ausgezeichnet. */
  const inhaltLang = (serie: Serie) => (bereichAktiv ? feinesLangAttribut(serie.lang ?? "de") : undefined);

  return (
    // ★ 17.10.2026 (Johannes: „riesiges Fenster"): die Bücherei ist eine
    // schlanke Liste in einer Spalte, nicht mehr ein Raster über die ganze Seite.
    <div className="relative mx-auto w-full max-w-3xl space-y-4">
      {onZuMeinTraining && (
        <div>
          <button type="button" className="btn-secondary btn-umriss" onClick={onZuMeinTraining}>
            <span aria-hidden>{"\u2190 "}</span>
            {zuMeinTrainingName}
          </button>
        </div>
      )}
      {/* Stufen-Einblendung auf Alt+L. Nur fürs Auge (`aria-hidden`) - den Text
          tragen die Live-Region ganz unten und die Sprachausgabe. Gleiche
          Gestalt wie die Pille in `TypingSession`, damit Bücherei und Übung
          nicht auseinanderlaufen. */}
      {levelFlash && (
        <div
          aria-hidden
          className="tt-flash pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2"
        >
          <span
            className="rounded-full px-4 py-1.5 text-lg font-bold shadow-lg"
            style={{
              background: "rgb(var(--c-accent-solid))",
              color: "rgb(var(--c-on-accent))",
            }}
          >
            📊 {levelFlash}
          </span>
        </div>
      )}
      <div className="card grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-2 p-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h2
            id="buecherei-titel"
            tabIndex={-1}
            className="m-0 text-xl font-semibold text-ink outline-none"
          >
            {t.titel}
          </h2>
          <PlayerLevelRing
            level={pl.level}
            into={pl.into}
            need={pl.need}
            label={bedienCopy(stufe, sprache).progressLabel}
            // ★ EN1: „Punkte" (Erwachsenen-Profil) heisst englisch UND
            // französisch *points* (Glossar §3.6/§9.2, XP / points); XP
            // bleibt XP. ★ E11a-4: auf „fr" geweitet (`!== "de"` statt
            // `=== "en"`) - dasselbe Wort trifft zufällig beide Sprachen.
            // ★ ES-O (27.09.2026): „es" sagt *puntos* - Tabelle statt „points" für alle.
            xpUnit={sprache !== "de" && copy.xpUnit === "Punkte" ? PUNKTE_WORT[sprache] : copy.xpUnit}
            size={HEADER_RING}
          />
        </div>
        <div className="justify-self-center">
          <PracticeClock />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
          {goalSlot}
        </div>
      </div>

      <p className="m-0 px-1 text-sm text-ink-soft">{lead}</p>

      {/* Resume (21.07.): Wer mittendrin aufgehört hat, findet die Geschichte
          ganz oben wieder — ein Klick, und es geht genau dort weiter (Etappe UND
          Zeile). Bewusst KEIN automatischer Sprung: das Kind soll sich auch
          etwas anderes aussuchen dürfen. */}
      {weiter && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-brand/40 bg-brand/5 p-4">
          <div className="flex min-w-0 items-start gap-2">
            <span aria-hidden className="text-xl leading-none">
              {kindIcon(weiter.serie)}
            </span>
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold uppercase tracking-wide text-ink-muted">
                {t.fortsetzen(sober)}
              </p>
              <h3 className="m-0 truncate text-lg font-semibold text-ink" lang={inhaltLang(weiter.serie)}>
                {weiter.serie.titel}
              </h3>
              <p className="m-0 text-sm text-ink-muted">
                {t.etappeVon(weiter.etappe, weiter.total)}
                {/* `line` ist der 0-basierte Index der NÄCHSTEN Zeile → +1 zum Anzeigen. */}
                {weiter.line > 0 && t.zeileVon(weiter.line + 1, weiter.lines)}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => startSerie(weiter.serie)}
          >
            {t.weiterlesen}
          </button>
        </div>
      )}

      {unlocked.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0" aria-label={t.listeName}>
          {unlocked.map((serie) => {
            const status = serieStatus(progress, serie.slug);
            const total = serieEtappeCount(serie);
            const next = Math.min(total, progress.storyProgress?.[serie.slug]?.etappe ?? 0) + 1;
            const btnLabel =
              status === "fertig"
                ? t.nochmalLesen
                : status === "offen"
                  ? t.weiterEtappe(Math.min(next, total))
                  : t.beginnen(skin);
            const statusText =
              status === "fertig"
                ? t.fertigGelesen
                : status === "offen"
                  ? t.weiterBei(Math.min(next, total), total)
                  : t.etappen(total);
            return (
              <li key={serie.slug} className="card flex flex-wrap items-center gap-x-3 gap-y-2 p-3">
                <span aria-hidden className="text-xl leading-none">
                  {kindIcon(serie)}
                </span>
                <div className="min-w-0 flex-1 basis-48">
                  <h3 className="m-0 break-words text-base font-semibold text-ink" lang={inhaltLang(serie)}>
                    {serie.titel}
                  </h3>
                  <p className="m-0 text-sm text-ink-muted">
                    {t.art(serie.kind === "wissen-serie")}
                    {" · "}
                    {statusText}
                    {status === "fertig" && (
                      <span className="text-success" aria-hidden>
                        {" ✓"}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary shrink-0"
                  onClick={() => startSerie(serie)}
                >
                  {btnLabel}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p role="status" className="card p-6 text-center text-ink-soft">
          {t.leer(skin, sie)}
        </p>
      )}

      {locked.length > 0 && (
        // ★ 17.10.2026: zugeklappt - dreissig gesperrte Zeilen machten die Seite
        // doppelt so lang wie das, was das Kind jetzt lesen kann.
        <details className="card p-3">
          <summary className="cursor-pointer text-sm font-semibold text-ink-soft">
            {t.bald(sober)} ({locked.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {locked.map((serie) => (
              <li key={serie.slug} className="flex items-center gap-2 text-sm text-ink-muted">
                <span aria-hidden>🔒</span>
                <span>
                  {bereichAktiv ? <span lang={feinesLangAttribut(serie.lang ?? "de")}>{serie.titel}</span> : serie.titel}
                  {" - "}
                  {t.baldWann(sober)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Quellen & Dank (§10): Namensnennung/Lizenz der Bücherei-Texte. Sobald
          CC-/gemeinfreie Serien dazukommen, erscheinen sie hier automatisch. */}
      {/* ★ 28.09.2026: Vorher nur mit `herkuenfte.length > 0` - die Liste ist nie
          leer (schon die Serien im Code tragen ihre Herkunft), darum steht der
          Bereich immer; seine Liste lädt erst beim Aufklappen (`QuellenListe`). */}
      {(
        <details
          className="rounded-xl border border-hairline bg-surface-raised/60 px-4 py-2 text-sm"
        >
          <summary className="cursor-pointer font-semibold text-ink-soft">
            {t.quellen}
          </summary>
          {/* Die Angaben selbst sind Datensätze auf Deutsch (Quelle, Lizenz,
              Urheber) - in englischer Bedienung als solche ausgezeichnet, der
              Satz darunter sagt es dazu. */}
          {/* Sind schon alle Pakete da (etwa auf einem Gerät, das die
              Statistik geöffnet hatte), steht die Liste wie bisher sofort im
              Bereich; sonst erst beim Aufklappen. */}
          {/* ★ 28.09.2026 (Johannes): nur die Sprachen dieses Kindes
              (Weg + Englisch). Die Pakete sind auf der Übungsseite schon da -
              die Liste steht darum wieder sofort im Bereich, wie vor dem
              Sprachpaket-Umbau. */}
          <SprachpaketTor sprachen={meineSprachen}>
            <QuellenListe sprache={sprache} sprachen={meineSprachen} />
          </SprachpaketTor>
          <p className="mt-2 m-0 text-sm text-ink-muted">
            {t.dank(sober)}
          </p>
        </details>
      )}

      {/* Screenreader-Live-Region für Alt+L (schon beim Laden im Baum, sonst
          wird die ERSTE Meldung verschluckt). Im Leser hat `TypingSession`
          eine eigene. */}
      <div ref={liveRef} className="sr-only" role="status" aria-live="assertive" />
    </div>
  );
}

/**
 * ★ „Quellen & Dank" (§10) als eigene Liste (28.09.2026): Sie nennt die
 * Herkunft ALLER Serien und Korpus-Zeilen, jeder Sprache
 * (`collectHerkunft`) - dafür braucht es alle Sprachpakete. Die Bücherei lädt
 * sie darum erst, wenn der Bereich aufgeklappt wird (`SprachpaketTor` oben);
 * vorher steht nur die Überschrift da, wie bisher bei zugeklapptem Bereich.
 */
function QuellenListe({ sprache, sprachen }: { sprache: BedienSprache; sprachen: readonly Lang[] }) {
  return (
    <ul className="mt-2 space-y-1" lang={sprache !== "de" ? "de" : undefined}>
      {collectHerkunft(sprachen).map((h, i) =>
        // ★ 23.09.2026: Hat die Angabe eine englische Fassung, steht sie in
        // der englischen Bedienung als ENGLISCHE Zeile da.
        sprache === "en" && h.en ? (
          <li key={i} className="text-ink-muted" lang="en">
            <span className="text-ink">{h.en.quelle}</span>
            {" - "}
            {/* KI-Transparenz auch auf Englisch (24.09.2026 nachgezogen -
                vorher bekam nur die deutsche Zeile den Hinweis, die
                englische EIGEN-Angabe blieb ohne ihn). */}
            {/^own work/i.test(h.en.lizenz)
              ? `${h.en.lizenz} · with AI assistance, editorially reviewed`
              : h.en.lizenz}
            {h.en.autor ? ` · ${h.en.autor}` : ""}
            {/* `fundstelle` ist ein deutsches Datenfeld (oft ein Prüfsatz,
                nicht nur ein Verweis) - nur eine reine URL ist
                sprachneutral und darf hier stehen (24.09.2026). */}
            {h.fundstelle && /^https?:\/\//.test(h.fundstelle) ? (
              <>
                {" · "}
                <span className="break-all">{h.fundstelle}</span>
              </>
            ) : null}
          </li>
        ) : (
        <li key={i} className="text-ink-muted">
          <span className="text-ink">{h.quelle}</span>
          {" - "}
          {/* KI-Transparenz (2026-08-03): eigene Texte sind KI-gestützt
              entstanden — das Label sagt das ehrlich dazu, statt nur
              „selbst verfasst" zu behaupten. */}
          {/* Gehört zur deutschen Angabe (die Liste steht in `lang="de"`). */}
          {/eigenes werk|selbst verfasst/i.test(h.lizenz)
            ? `${h.lizenz} · mit KI-Unterstützung, redaktionell geprüft`
            : h.lizenz}
          {h.autor ? ` · ${h.autor}` : ""}
          {h.fundstelle ? (
            <>
              {" · "}
              <span className="break-all">{h.fundstelle}</span>
            </>
          ) : null}
        </li>
        ),
      )}
    </ul>
  );
}

// ── Leser einer Serie ─────────────────────────────────────────────────────────

interface SerieReaderProps {
  serie: Serie;
  startEtappe: number;
  /** Zeile innerhalb der Start-Etappe, bei der wieder eingestiegen wird. */
  startLine: number;
  stufe: Stufe;
  lang: Lang;
  startTempo?: TempoLevel;
  voiceEnabled: boolean;
  enforceShiftHand?: boolean;
  /** „Zeit lassen" (Eigenschaft des Kindes) — Tempo zählt nirgends. */
  zeitLassen?: boolean;
  /**
   * „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus, 2 = doppelt,
   * 3 = dreifach, 4 = vierfach - siehe `zeichenabstand.ts`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /** ★ Zeilenende mit Enter (23.09.2026) - siehe `SerienTrainerProps`. */
  zeilenEnde?: boolean;
  progressRef: React.MutableRefObject<TypingProgress>;
  persist: (p: TypingProgress) => void;
  onTask?: (e: Omit<TaskEvent, "ts">) => void | Promise<void>;
  onExit: () => void;
  /**
   * Zurück in den Übungsmodus, aus dem die Geschichte geöffnet wurde — damit der
   * Kreislauf „Runde üben → Etappe lesen → Runde üben" von selbst weiterläuft
   * (Wunsch Johannes 28.07.2026). Fehlt der Callback, geht es wie bisher in die
   * Bücherei-Liste zurück.
   */
  onBackToPractice?: () => void;
  /** „Dein Wochenziel" (kompakt) — steht in der Stand-Zeile unter dem Feld. */
  goalSlot?: React.ReactNode;
}

function SerieReader({
  serie,
  startEtappe,
  startLine,
  stufe,
  lang,
  startTempo,
  voiceEnabled,
  enforceShiftHand,
  zeitLassen = false,
  zeichenabstand = 1,
  zeilenEnde = false,
  progressRef,
  persist,
  onTask,
  onExit,
  onBackToPractice,
  goalSlot,
}: SerieReaderProps) {
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` (Muster wie oben in `SerienTrainer`).
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = BUECHEREI_TEXTE[sprache];
  const total = serie.etappen.length;
  const [etappeIdx, setEtappeIdx] = useState(() =>
    Math.max(0, Math.min(total - 1, startEtappe)),
  );
  const [leveledUp, setLeveledUp] = useState(false);
  // Neu verdiente Abzeichen dieser Etappe (Runden- UND Lese-Abzeichen).
  const [newBadges, setNewBadges] = useState<BadgeDef[]>([]);
  // Freischaltung einer neuen Taste: bei Kindern erst nach dem Eisschollen-Tor
  // (wie in „Mein Training"), bei Erwachsenen direkt.
  // Freischalten und Feiern sind getrennt (14.08.2026, siehe AdaptiveTrainer):
  // `belohnung` ist das Angebot in der Feier-Karte, `spiel` der laufende
  // Belohnungs-Lauf. Die Taste hängt an keinem von beiden mehr. Seit
  // 22.08.2026 gibt es nur noch das Eisschollen-Spiel oder gar keine Belohnung
  // — darum ist `course` nie `null` (der Tipp-Sprint ist entfallen).
  const [belohnung, setBelohnung] = useState<{ unit: string; course: FloeCourse } | null>(
    null,
  );
  const [spiel, setSpiel] = useState<{ unit: string; course: FloeCourse } | null>(null);
  // ★ ES-M2 (27.09.2026): ALLE neuen Einheiten der Runde (¿ mit ?), nicht nur die letzte.
  const [justUnlocked, setJustUnlocked] = useState<readonly string[] | null>(null);
  // Zeilengenaues Resume: NUR die zuerst geöffnete Etappe steigt mittendrin ein;
  // jede FOLGE-Etappe beginnt wieder bei Zeile 1 (siehe onRetry).
  const [initialLine, setInitialLine] = useState(() => Math.max(0, startLine));
  // Aktuelle Zeilen-Nummer der laufenden Etappe — wird nicht gespeichert, sondern
  // beim Zeilenabschluss zusammen mit der Buchstaben-Statistik verbucht (ein
  // Schreibvorgang statt zwei).
  const qiRef = useRef(Math.max(0, startLine));

  const etappe = serie.etappen[etappeIdx];

  // Tastatur-Anzeige + Groß-/Kleinschreibung: der volle Stand der Person (die
  // Bücherei ist bereits auf tippbare Serien gefiltert, alle Buchstaben sind da).
  const introduced = ensureIntroduced(
    progressRef.current.introduced,
    lernwegVon(progressRef.current),
  );
  const unlocked = useMemo(() => new Set(introduced), [introduced.join("")]); // eslint-disable-line react-hooks/exhaustive-deps
  const shiftLearned = introduced.includes(SHIFT_UNIT);

  // Die Etappen-Zeilen an den Tastenstand anpassen (wie im Korpus: noch nicht
  // gelernte Satzzeichen werden weggelassen — „ohne Punkt und Beistrich"). So
  // verlangt die Geschichte NIE eine Taste, die die Person noch nicht kann.
  const items = useMemo(() => {
    const allowed = allowedFromIntroduced(
      progressRef.current.introduced,
      lernwegVon(progressRef.current),
    );
    // ★ E8b Block 1b: `serie.nurWeg` gewinnt (wie `serieTypeable`/
    // `computeSerieMinTier`) - sonst würde eine Serie nur für Weg „fr" hier
    // gegen den Weg des Kindes geprüft statt gegen ihren eigenen.
    const effektiverWeg = serie.nurWeg ?? lernwegVon(progressRef.current);
    return etappe.lines.map((l) => fitText(l, allowed, effektiverWeg) ?? l);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etappe]);
  const hasNext = etappeIdx + 1 < total;

  const level = currentLevel(progressRef.current, startTempo);
  const speedTarget = useMemo(
    () => speedTargetCpm(level, progressRef.current.speedEma, zeitLassen),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [etappeIdx, level, zeitLassen],
  );

  const onLetters = useCallback(
    (events: KeyEvent[]) => {
      const cur = progressRef.current;
      persist({
        ...cur,
        letters: mergeLetters(cur.letters, events),
        // Die eben getippte Zeile ist durch → beim nächsten Mal geht es bei der
        // FOLGENDEN weiter. `noteStoryLine` schreibt nur, wenn der Leser wirklich
        // auf der fälligen Etappe steht (kein Stand aus einer anderen Etappe).
        storyProgress: noteStoryLine(
          cur.storyProgress,
          serie.slug,
          etappeIdx,
          qiRef.current + 1,
          dayKey(Date.now()),
        ),
      });
    },
    [persist, progressRef, serie.slug, etappeIdx],
  );

  // Eine geschaffte Etappe zählt seit 28.07.2026 GENAUSO VIEL wie eine Übungsrunde
  // (Wunsch Johannes): XP + Leistungsstufe, Abzeichen — und sie kann die nächste
  // Taste freischalten (bei Kindern über dasselbe Eisschollen-Tor wie in „Mein
  // Training", bei Erwachsenen direkt). Sonst würde ausgerechnet der empfohlene
  // Weg „weiter mit einer Geschichte" den Lernfortschritt halbieren. Dazu die
  // Lese-Abzeichen (eigene Familien) und das strikte Vorrücken der Serie —
  // alles in EINEM persist, damit nichts verloren geht.
  const onSessionDone = useCallback(
    (acc: number, cpm: number, stars: number, detail?: RoundDetail) => {
      const cur = progressRef.current;
      const playedLevel = currentLevel(cur, startTempo);
      const m = masteryForLevel(playedLevel, zeitLassen);
      const lernweg = lernwegVon(cur);
      const introCur = ensureIntroduced(cur.introduced, lernweg);
      /*
        ★★★ 02.10.2026: Hat ein Klassenmatch eine Taste VORGEMERKT
        (`freischaltungAusMatch`) und das Kind ist noch nicht in „Mein
        Training" gewesen, kommt sie hier - an derselben Stelle, an der diese
        Etappe sonst eine Taste freischalten würde, mit derselben Feier. Die
        Entscheidung des Matchs gilt (`canAdvance` wird nicht neu gewürfelt);
        es kommt nie eine ZWEITE Taste obendrauf. Passt die Vormerkung nicht
        mehr, wird sie still verworfen und die Regel läuft wie immer.
      */
      const vorm = loeseVormerkungEin(cur, Date.now(), lernweg);
      const grown =
        vorm.neu.length > 0
          ? ensureIntroduced(vorm.progress.introduced, lernweg)
          : advanceIntroduced(introCur, cur.letters, lernweg, m, cur.rundenOhneTaste);
      // Anonymer Topf (topf.ts): Wie viele Tasten stehen wann frei? Genau daran
      // justieren wir das Tor kuenftig an echten Kindern statt an Simulationen.
      // Der Aufruf schreibt nur, wenn sich die Zahl AENDERT, und steht in BEIDEN
      // Trainern - wer einen davon umbaut, muss den anderen mitnehmen
      // (Waechter: tests/typing-topf.test.ts).
      topfTastenVerbuchen(Date.now(), grown.length);
      const gain = 15 + Math.round(acc * 15);
      const speedEma =
        cpm > 0 && acc >= 0.5 ? updateSpeedEma(cur.speedEma, cpm) : cur.speedEma;
      const now = Date.now();
      const rec = recordRound(
        { ...cur, xp: cur.xp + gain, introduced: introCur, speedEma },
        { acc, cpm, stars },
        playedLevel,
        now,
        zeitLassen,
      );
      // Runden-Abzeichen wie überall …
      const badged = awardBadges(
        rec.progress,
        { acc, cpm, stars, level: playedLevel, target: speedTarget, detail, lang },
        now,
        lernweg,
      );
      // … und zusätzlich die LESE-Abzeichen dieser Etappe.
      const letzte = etappeIdx + 1 >= total;
      const startDay = storyStateFor(cur.storyProgress, serie.slug).startDay;
      const gelesen = recordStoryEtappe(
        badged.progress,
        {
          clean: acc >= 1,
          storyDone: letzte,
          sameDay: !!startDay && startDay === dayKey(now),
        },
        now,
        lernweg,
      );
      // Die neue Taste gehört dem Kind, sobald die Schwelle erreicht ist — das
      // Spiel kommt danach freiwillig obendrauf (14.08.2026, wie in „Mein
      // Training"): kind die Eisschollen, Erwachsene keins, ab 11 das im Zahnrad
      // Gewählte — keins (Vorgabe) oder die Eisschollen (S2, frisch gelesen wie
      // im AdaptiveTrainer).
      const mode = gateModeFor(skinForStufe(stufe), activeBelohnungsSpiel());
      const gewachsen = grown.length > introCur.length;
      persist({
        ...(gewachsen
          ? {
              ...gelesen.progress,
              introduced: grown,
              // Zweite Stelle, an der eine Taste dazukommt — sie MUSS denselben
              // Zeitstempel schreiben wie „Mein Training", sonst hätte die
              // Auswertung Löcher, je nachdem wo das Kind gerade übt.
              introducedAt: stampUnlocks(introCur, grown, cur.introducedAt, now),
              rundenOhneTaste: 0, // neue Taste da → Geduld-Zähler zurück auf Anfang
            }
          : { ...gelesen.progress, rundenOhneTaste: (cur.rundenOhneTaste ?? 0) + 1 }),
        storyProgress: advanceStory(gelesen.progress.storyProgress, serie.slug, total),
        // Eine eingelöste oder verworfene Vormerkung des Matchs verschwindet hier.
        ...(vorm.geaendert ? { freischaltungAusMatch: undefined } : {}),
      });
      setLeveledUp(rec.leveledUp);
      setNewBadges([...badged.newly, ...gelesen.newly]);
      if (gewachsen) {
        // ★ ES-M2 (Prüfbericht ES-P2 M1): alle neuen Einheiten, siehe AdaptiveTrainer.
        const neu = neuFreigeschaltet(introCur, grown);
        const unit = neu[0] ?? grown[grown.length - 1];
        setJustUnlocked(neu.length > 0 ? neu : [unit]);
        setBelohnung(
          mode === "keins"
            ? null
            : { unit, course: buildTorCourse(introCur, cur.letters, m, lernwegVon(cur)) },
        );
      }
    },
    [persist, progressRef, serie.slug, startTempo, total, etappeIdx, speedTarget, stufe, zeitLassen],
  );

  // Aus der Feier-Karte ins Belohnungs-Spiel (die Taste ist längst frei).
  const belohnungStarten = useCallback(() => {
    setJustUnlocked(null);
    setSpiel(belohnung);
    setBelohnung(null);
  }, [belohnung]);

  const onRetry = useCallback(() => {
    setLeveledUp(false);
    setNewBadges([]);
    if (hasNext) {
      // Folge-Etappe: wieder bei Zeile 1 (der Resume-Stand galt nur für die
      // Etappe, in der das Kind zuletzt abgebrochen hat).
      setInitialLine(0);
      qiRef.current = 0;
      setEtappeIdx((i) => i + 1);
    } else (onBackToPractice ?? onExit)();
  }, [hasNext, onExit, onBackToPractice]);

  const topSlot = (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-hairline bg-surface-raised/80 px-3 py-2">
      <button
        type="button"
        className="btn-ghost btn-toggle"
        onClick={onExit}
        aria-label={t.zurueckName}
      >
        <span aria-hidden>‹ </span>{t.buecherei}
      </button>
      <p
        className="m-0 min-w-0 flex-1 truncate text-sm font-semibold text-ink"
        aria-live="polite"
      >
        <span aria-hidden>{serie.kind === "wissen-serie" ? "💡 " : "📖 "}</span>
        {bereichAktiv ? <span lang={feinesLangAttribut(serie.lang ?? "de")}>{serie.titel}</span> : serie.titel}
        <span className="text-ink-muted">
          {" · "}
          {t.etappeVon(etappeIdx + 1, total)}
        </span>
      </p>
      {/* Die Übezeit stand hier bis 25.08.2026 als eigene Uhr. Sie steht
          jetzt - wie Stufe, Wochenziel und die nächste Taste - in der
          Stand-Zeile UNTER dem Übungsfeld, in allen drei Übungsarten gleich. */}
    </div>
  );

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";

  return (
    <div className="space-y-4">
      {/* Belohnungs-Lauf NACH der Freischaltung — dasselbe wie in „Mein
          Training": Wer beim Lesen so weit kommt, dass eine neue Taste dran ist,
          bekommt sie, und darf danach spielen. Der Lauf ändert nichts mehr. */}
      <ExpeditionStage
        open={!!spiel}
        course={spiel?.course ?? undefined}
        free={false}
        isAdult={isAdult}
        uppercase={shiftLearned}
        voiceEnabled={voiceEnabled}
        letters={progressRef.current.letters}
        mastery={masteryForLevel(currentLevel(progressRef.current, startTempo), zeitLassen)}
        noTimePressure={zeitLassen}
        // ★ CVI (19.09.2026, „überall"): derselbe Wert wie die Lesezeile.
        zeichenabstand={zeichenabstand}
        // ★ Nr 19 der Fokusziele (22.08.2026): Der Öffner dieses Laufs war die
        // Feier-Karte, und die ist längst entfernt - `restoreFocus` der Bühne
        // findet nichts und lässt den Fokus auf `body`. Darum ausdrücklich in
        // die Eingabezeile, wo es weitergeht.
        onWin={() => {
          setSpiel(null);
          focusPracticeField();
        }}
        onClose={() => {
          setSpiel(null);
          focusPracticeField();
        }}
      />

      <UnlockCelebration
        unit={justUnlocked?.[0] ?? null}
        mit={justUnlocked?.slice(1)}
        lernweg={lernwegVon(progressRef.current)}
        skin={skin}
        belohnung={
          belohnung
            ? {
                // Wortlaut wie in „Mein Training": Der Ton folgt dem Profil,
                // nicht dem gewählten Spiel (S2).
                ...belohnungsAngebot(sprache, skin === "kind"),
                onStart: belohnungStarten,
              }
            : undefined
        }
        // ★ Nr 12 der Fokusziele (22.08.2026): „Weiter", Escape und der
        // Hintergrund enden ausdrücklich in der Eingabezeile. Bisher hing das
        // daran, dass das neu aufgebaute Tippfeld den Fokus im nächsten Takt
        // von selbst holt - und genau das galt nicht, solange noch ein Dialog
        // im Baum stand.
        onClose={() => {
          setJustUnlocked(null);
          setBelohnung(null);
          focusPracticeField();
        }}
      />

      <TypingSession
        key={etappeIdx}
        items={items}
        contextId={`serie:${serie.slug}`}
        unlocked={unlocked}
        shiftLearned={shiftLearned}
        enforceShiftHand={enforceShiftHand}
        zeichenabstand={zeichenabstand}
        // ★ Zeilenende mit Enter (23.09.2026), siehe `SerienTrainerProps`.
        zeilenEnde={zeilenEnde}
        stufe={stufe}
        lang={lang}
        lernweg={lernwegVon(progressRef.current)}
        voiceEnabled={voiceEnabled}
        speedTarget={speedTarget}
        initialQi={initialLine}
        onQiChange={(qi) => {
          qiRef.current = qi;
        }}
        onItemDone={(e) => onTask?.(e)}
        onLetters={onLetters}
        // Schritt M (19.09.2026): die wackligen Tasten - nur gemessen.
        wackeligeTasten={wackeligeTastenAus(progressRef.current.letters, introduced, {
          lernweg: lernwegVon(progressRef.current), // ★ D-5
          stufe,
        })}
        onSessionDone={onSessionDone}
        onRetry={onRetry}
        retryLabel={hasNext ? t.weiter : onBackToPractice ? t.weiterUeben : t.zurBuecherei}
        leveledUp={leveledUp}
        newBadges={newBadges}
        suppressRewardSound={!!justUnlocked || !!spiel}
        // Wie im AdaptiveTrainer: Solange ein eigenes Fenster über der
        // Abschluss-Karte liegt, gehören ihm Fokus-Falle und Escape
        // (F1, 31.08.2026).
        ueberlagert={!!justUnlocked || !!spiel}
        topSlot={topSlot}
        standSlot={
          <StandZeile
            stufeLabel={bedienCopy(stufe, sprache).progressLabel}
            level={playerLevel(progressRef.current.xp).level}
            nextUnit={nextLetter(introduced, lernwegVon(progressRef.current))}
            shiftLearned={shiftLearned}
            goalSlot={goalSlot}
            spielen={false}
          />
        }
      />
    </div>
  );
}
