/**
 * „Mein Training" — die individuelle, adaptive Lernumgebung des Tipptrainers.
 *
 * Das Programm misst für jedes Kind jeden Buchstaben einzeln, übt automatisch
 * die schwächsten und schaltet einen neuen Buchstaben erst frei, wenn die
 * bisherigen sitzen (treffsicher + zügig). Die Buchstaben-Karte zeigt sichtbar,
 * wo es noch hakt. Aufbauend auf `TypingSession` (gemeinsamer Übungslauf) und
 * der Engine in `letters.ts`. Siehe [[project_zehnfinger_trainer]].
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeDef,
  KeyEvent,
  Lang,
  Stufe,
  TaskEvent,
  TempoLevel,
  TypingProgress,
  ZeichenabstandFaktor,
  adaptiveRound,
  neuFreigeschaltet,
  rueckmeldungFuer,
  type Rueckmeldung,
  uebungsZeilenFuer,
  arcPlanLineCount,
  planArcRound,
  roundEndArcUpdate,
  weaveArcGroups,
  wendeRundenendeAn,
  loeseVormerkungEin,
  type Mastery,
  corpusManifestCount,
  corpusManifestVersion,
  decodeSeen,
  emptySeen,
  encodeSeen,
  seenAdd,
  seenLedgerValid,
  awardBadges,
  RoundDetail,
  copyFor,
  currentLevel,
  emptyProgress,
  focusPracticeField,
  ensureIntroduced,
  allowedFromIntroduced,
  nextSerieFor,
  serieStatus,
  FloeCourse,
  masteryForLevel,
  mergeLetters,
  playerLevel,
  recordCalibrationSample,
  recordRound,
  SHIFT_UNIT,
  activeBelohnungsSpiel,
  gateModeFor,
  showsFreePlay,
  skinForStufe,
  speakUi,
  nextLetter,
  speedTargetCpm,
  updateSpeedEma,
  useVoice,
  focusUnits,
  fokusBreiteFuer,
  offeneBaustellen,
  rundenWert,
  zeilenJeRunde,
  bedienCopy,
} from "@/lib/typing";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { FloeFreePlay } from "./FloeFreePlay";
import { ExpeditionStage } from "./expedition/ExpeditionStage";
import { StoryOffer } from "./StoryOffer";
import { UebungsformAngebot } from "./UebungsformAngebot";
import { PyramidenSchmuck } from "./PyramidenSchmuck";
import { RaetselLauf } from "./RaetselLauf";
import { BuchstabensalatLauf } from "./BuchstabensalatLauf";
import { IgluLauf } from "./IgluLauf";
import { useUebungsform } from "./useUebungsform";
import { GESCHICHTE, formFuer, formName, type UebungsformId } from "@/lib/typing/uebungsformen";
import { waehleSalatwort } from "@/lib/typing/uebungsformen/buchstabensalat";
import { StandZeile } from "./StandZeile";
import { buildTorCourse } from "@/lib/typing/expedition/course";
import { wackeligeTastenAus } from "@/lib/typing/zeilenMessung";
import { TypingSession } from "./TypingSession";
import { UnlockCelebration } from "./UnlockCelebration";
// ★ E1 (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt
// (Kopie, von `TippenTrainerPage` beim Laden aus dem Konto nachgetragen).
import { lernwegDef, lernwegVon, type Lernweg } from "@/lib/typing/lernweg";
import { GrundstellungPruefen } from "./GrundstellungPruefen";
import { franzVariante } from "@/lib/typing/franzVariante";
import { naechsteVariante } from "@/lib/typing/rundenAbwechslung";
import { esVariante } from "@/lib/typing/esVariante";
import type { Gezielt } from "@/lib/typing/gezielt";
import { gezieltFuerRunde } from "@/lib/typing/gezieltRunde";

/**
 * Zeilen einer Runde. Seit 29.08.2026 nur noch die OBERGRENZE: Ein Kind, dem
 * eine volle Runde über {@link RUNDE_ZIEL_MINUTEN} dauern würde, bekommt weniger
 * Zeilen - und die kürzere Runde zählt fürs Tor entsprechend weniger
 * (`rundenlaenge.ts`). Gleich viel Übung, öfter Luft holen.
 */
const ITEMS_PER_SESSION = 12;

/** Die eigenen Texte dieses Trainers in beiden Bedienungssprachen (12.09.2026). */
const TRAINER_TEXTE = texte({
  de: {
    laedt: "Lädt …",
    lieberWeiter: "lieber weiter üben",
    weiter: "Weiter",
    // ★ EN1 (19.09.2026): das Angebot des Belohnungs-Spiels auf der
    // Freischalt-Karte. Der Ton folgt dem PROFIL (Kind jubelt, ab 11 trocken).
    spielFrage: (kind: boolean) =>
      kind
        ? "Du hast dir das verdient - willst du es im Eis feiern?"
        : "Verdient. Magst du eine Runde ins Eis?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 Ab ins Eis!" : "🐧 Eisschollen-Spiel"),
    // ★ D-8 (28.09.2026): das Angebot auf der ersten Abschluss-Karte.
    grundstellungAngebot: "Grundstellung prüfen: Liegen alle acht Finger richtig?",
  },
  en: {
    laedt: "Loading …",
    lieberWeiter: "keep practising instead",
    weiter: "Continue",
    // Glossar §3.6: *Ice Floe game*; ein Ausrufezeichen nur für Kinder (§1.2).
    spielFrage: (kind: boolean) =>
      kind
        ? "You've earned it - do you want to celebrate on the ice?"
        : "Well earned. Fancy a round on the ice?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 Onto the ice!" : "🐧 Ice Floe game"),
    grundstellungAngebot: "Check your home position: are all eight fingers in the right place?",
  },
  fr: {
    laedt: "Chargement …",
    lieberWeiter: "plutôt continuer à s'exercer",
    weiter: "Continuer",
    spielFrage: (kind: boolean) =>
      kind
        ? "Tu l'as bien mérité - tu veux fêter ça sur la banquise ?"
        : "Bien mérité. Envie d'un tour sur la banquise ?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 En route pour la banquise !" : "🐧 Jeu de la banquise"),
    grundstellungAngebot: "Vérifier la position de base : les huit doigts sont-ils bien placés ?",
  },
  es: {
    laedt: "Cargando …",
    lieberWeiter: "mejor seguir practicando",
    weiter: "Continuar",
    spielFrage: (kind: boolean) =>
      kind
        ? "Te lo has ganado - ¿quieres celebrarlo en la banquisa?"
        : "Bien merecido. ¿Te apetece una vuelta por la banquisa?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 ¡A la banquisa!" : "🐧 Juego de la Banquisa"),
    grundstellungAngebot: "Comprobar la posición de base: ¿están bien colocados los ocho dedos?",
  },
  // ★ O-IT (02.10.2026): „Gioco dei lastroni" (Glossar §2.3), „posizione base" (§2.1).
  it: {
    laedt: "Caricamento in corso...",
    lieberWeiter: "meglio continuare a esercitarsi",
    weiter: "Avanti",
    spielFrage: (kind: boolean) =>
      kind
        ? "Te lo sei meritato - vuoi festeggiare sui lastroni?"
        : "Meritato. Ti va un giro sui lastroni?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 Ai lastroni!" : "🐧 Gioco dei lastroni"),
    grundstellungAngebot: "Controlla la posizione base: le otto dita sono al posto giusto?",
  },
  // ★ O-PL (02.10.2026): „Skoki po krach" (Glossar §2.3), „pozycja podstawowa" (§2.1);
  // „Należy ci się" statt einer Vergangenheit der 2. Person (Regel 2).
  pl: {
    laedt: "Wczytywanie...",
    lieberWeiter: "wolę ćwiczyć dalej",
    weiter: "Dalej",
    spielFrage: (kind: boolean) =>
      kind
        ? "Należy ci się - chcesz to uczcić na lodzie?"
        : "Zasłużona nagroda. Może runda na lodzie?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 Na lód!" : "🐧 Skoki po krach"),
    grundstellungAngebot: "Sprawdź pozycję podstawową: czy osiem palców leży we właściwym miejscu?",
  },
  // ★ O-TR (02.10.2026): "Buz Kütlesi Oyunu" (Glossar §2.3), "temel konum" (§2.1); Kind
  // höchstens ein "!", ab 11 keins (Regel 1).
  tr: {
    laedt: "Yükleniyor...",
    lieberWeiter: "çalışmaya devam et",
    weiter: "Devam et",
    spielFrage: (kind: boolean) =>
      kind
        ? "Bunu hak ettin - buzda kutlamak ister misin?"
        : "Hak edildi. Buzda bir tur ister misin?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 Haydi buza!" : "🐧 Buz Kütlesi Oyunu"),
    grundstellungAngebot: "Temel konumu kontrol et: sekiz parmağın da doğru yerde mi?",
  },
  // ★ O-CS (03.10.2026): „Ledové kry" (Glossar §2.3), „základní postavení" (§2.1); Kind
  // höchstens ein „!", ab 11 keins (Regel 1); „si zasloužíš" (Präsens) statt einer
  // Vergangenheit der 2. Person (Regel 2).
  cs: {
    laedt: "Načítá se...",
    lieberWeiter: "radši cvičit dál",
    weiter: "Pokračovat",
    spielFrage: (kind: boolean) =>
      kind
        ? "Tohle si zasloužíš - chceš to oslavit na ledě?"
        : "Zaslouženo. Dáš si jedno kolo na ledě?",
    spielKnopf: (kind: boolean) => (kind ? "🐧 Hurá na led!" : "🐧 Ledové kry"),
    grundstellungAngebot: "Zkontrolovat základní postavení: leží všech osm prstů správně?",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      laedt: "Зареждане...",
      lieberWeiter: "предпочитам да се упражнявам още",
      weiter: "Продължи",
      // Glossar §2.3: „Ледени късове"; Aorist „заслужи" ohne Geschlecht.
      spielFrage: (kind: boolean) =>
        kind
          ? "Заслужи си го - искаш ли да го отпразнуваш на леда?"
          : "Заслужено. Един кръг на леда?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Към леда!" : "🐧 Ледени късове"),
      grundstellungAngebot: "Провери изходната позиция: всичките осем пръста на място ли са?",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      laedt: "Φόρτωση...",
      lieberWeiter: "θέλω να συνεχίσω την εξάσκηση",
      weiter: "Συνέχεια",
      // Glossar §2.3: Παγοκομμάτια; Ausrufezeichen nur für Kinder (§1 Regel 1).
      spielFrage: (kind: boolean) =>
        kind
          ? "Το άξιζες - θέλεις να το γιορτάσεις στον πάγο;"
          : "Το άξιζες. Ένας γύρος στον πάγο;",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Πάμε στον πάγο!" : "🐧 Παγοκομμάτια"),
      grundstellungAngebot: "Έλεγχος βασικής θέσης: είναι και τα οκτώ δάχτυλα στη σωστή θέση;",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      laedt: "Betöltés…",
      lieberWeiter: "inkább gyakorlok tovább",
      weiter: "Tovább",
      spielFrage: (kind: boolean) =>
        kind
          ? "Ezt kiérdemelted - megünnepled a jégen?"
          : "Megérdemelt. Egy kör a jégen?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Irány a jég!" : "🐧 Jégtáblák"),
      grundstellungAngebot: "Alapállás ellenőrzése: mind a nyolc ujjad a helyén van?",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      laedt: "Laden …",
      lieberWeiter: "liever verder oefenen",
      weiter: "Verder",
      // Glossar §2.3: IJsschotsenspel (IJ beide groß); ein Ausrufezeichen nur für Kinder (Regel 1).
      spielFrage: (kind: boolean) =>
        kind
          ? "Dat heb je verdiend - wil je het vieren op het ijs?"
          : "Verdiend. Zin in een rondje op het ijs?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Het ijs op!" : "🐧 IJsschotsenspel"),
      grundstellungAngebot: "Basishouding controleren: liggen alle acht vingers goed?",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      laedt: "A carregar...",
      lieberWeiter: "prefiro continuar a praticar",
      weiter: "Continuar",
      spielFrage: (kind: boolean) =>
        kind
          ? "Mereceste - queres festejar no gelo?"
          : "Bem merecido. Apetece-te uma ronda no gelo?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Para o gelo!" : "🐧 Blocos de gelo"),
      grundstellungAngebot: "Verificar a posição inicial: os oito dedos estão no sítio certo?",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      laedt: "Carregando...",
      lieberWeiter: "prefiro continuar praticando",
      weiter: "Continuar",
      // Glossar §2.3: Placas de gelo; Ausrufezeichen nur für Kinder (Regel 1).
      spielFrage: (kind: boolean) =>
        kind
          ? "Você mereceu - quer comemorar no gelo?"
          : "Merecido. Que tal uma rodada no gelo?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Para o gelo!" : "🐧 Placas de gelo"),
      grundstellungAngebot: "Verificar a posição inicial: os oito dedos estão no lugar certo?",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      laedt: "Se încarcă …",
      lieberWeiter: "mai bine exersez în continuare",
      weiter: "Mai departe",
      spielFrage: (kind: boolean) =>
        kind
          ? "Ai meritat - vrei să sărbătorești pe gheață?"
          : "Meritat. O rundă pe gheață?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Pe gheață!" : "🐧 Sloiuri de gheață"),
      grundstellungAngebot: "Verifică poziția de bază: sunt toate cele opt degete la locul lor?",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      laedt: "Läser in...",
      lieberWeiter: "öva hellre vidare",
      weiter: "Fortsätt",
      // Glossar §2.3 „Isflaken"; ein Ausrufezeichen nur für Kinder (§1 Regel 1).
      spielFrage: (kind: boolean) =>
        kind
          ? "Det har du förtjänat - vill du fira ute på isen?"
          : "Välförtjänt. En omgång på isen?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 Ut på isen!" : "🐧 Isflaken"),
      grundstellungAngebot: "Kontrollera grundställningen: ligger alla åtta fingrar rätt?",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      laedt: "Завантаження...",
      lieberWeiter: "краще тренуватися далі",
      weiter: "Далі",
      // Glossar §2.3: Крижини; „Ти заслужив" wäre gegendert - darum am Hauptwort.
      spielFrage: (kind: boolean) =>
        kind
          ? "Це заслужена нагорода - відсвяткуємо на кризі?"
          : "Заслужено. Один раунд на кризі?",
      spielKnopf: (kind: boolean) => (kind ? "🐧 На кригу!" : "🐧 Крижини"),
      grundstellungAngebot: "Перевір основне положення: усі вісім пальців на місці?",
    },
});

/**
 * ★ EN1: dasselbe Angebot für den Leser der Bücherei (`SerienTrainer`) - EINE
 * Fassung, damit beide Karten dasselbe fragen.
 */
export function belohnungsAngebot(sprache: BedienSprache, kind: boolean) {
  const t = TRAINER_TEXTE[sprache];
  return { frage: t.spielFrage(kind), label: t.spielKnopf(kind) };
}
/** Durchmesser der Kopf-Ringe — Spielstand UND Wochenziel gleich groß. */

interface AdaptiveTrainerProps {
  loadFn: () => Promise<TypingProgress>;
  saveFn: (p: TypingProgress) => void | Promise<void>;
  onTask?: (e: Omit<TaskEvent, "ts">) => void | Promise<void>;
  stufe: Stufe;
  /** Sprache der Übungsinhalte (Deutsch/Englisch). */
  lang: Lang;
  /** Start-Anforderung der Lehrkraft (legt die Einstiegs-Leistungsstufe fest). */
  startTempo?: TempoLevel;
  /** „Dein Wochenziel" (Kreisringe) — rechts im Kopf, nur für Lernende mit Ziel. */
  goalSlot?: React.ReactNode;
  /** false = „Einhand schreiben": Umschalt-Gegenhand-Regel nicht erzwingen. */
  enforceShiftHand?: boolean;
  /**
   * true = „Zeit lassen" (Eigenschaft des Kindes, siehe noTimePressure.ts):
   * kein Zeitfenster im Spiel, kein Tempo-Ziel bei den Sternen, keine
   * Tempo-Messung bei den Buchstaben, kein Auf- und Abstieg der Leistungsstufe.
   */
  zeitLassen?: boolean;
  /**
   * „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus, 2 = doppelt,
   * 3 = dreifach, 4 = vierfach - siehe `zeichenabstand.ts`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /**
   * ★ Zeilenende mit Enter (23.09.2026, Klassen-Einstellung
   * `TypingClass.zeilenEndeEnter`) - jede Zeile dieser Runde ist erst fertig,
   * wenn zusätzlich die Eingabetaste kommt. Vorgabe `false` (wie heute).
   */
  zeilenEnde?: boolean;
  /**
   * Einweben (TW-E3): eine offene Geschichte am Rundenende anbieten und beim Klick
   * in der Bücherei fortsetzen. Ist der Callback gesetzt UND eine Serie offen,
   * erscheint in der Abschluss-Karte „Weiter mit deiner Geschichte?".
   */
  onOpenStory?: (slug: string) => void;
  /**
   * WORTSPIELE (02.09.2026): eine bestimmte Übungsform SOFORT starten, statt
   * sie erst am Rundenende anzubieten.
   *
   * ★ Warum der Bereich „Wortspiele" hier hereingeht und keinen eigenen
   * Übungslauf mitbringt: Ein zweiter Lauf hiesse Spielstand, Telemetrie,
   * Buchstaben-Auswertung, Übezeit-Uhr und Abzeichen ein zweites Mal - fünf
   * Stellen, die von der ersten nichts wüssten. Genau diese Doppelung ist in
   * diesem Projekt schon mehrfach auseinandergelaufen. Der Bereich ist darum
   * nur das REGAL; geübt wird in demselben Lauf wie in „Mein Training".
   */
  startForm?: UebungsformId;
  /** Die gestartete Form ist durch - zurück ins Regal. */
  onFormEnde?: () => void;
  /**
   * ★ GEZIELT ÜBEN (13.11.2026, Etappe A): die WIRKSAME Einstellung (der Aufrufer hat Vorrang Kind/Klasse und Ablauf schon
   * gerechnet, `gezieltFuerKind`). Nur „Mein Training" bekommt sie - Klassenmatch und Tippchallenge nie. Noch nicht gelernte
   * Zeichen werden für die Runde VORGEZOGEN, nie gespeichert.
   */
  gezielt?: Gezielt | null;
  /** Einmal je Rundenbau: die Zeichen der Einstellung, die das Kind noch nicht gelernt hat (Etappe B stellt sie vor). */
  onVorgezogen?: (zeichen: string[]) => void;
  /** Einmal je Rundenbau, wenn „Gezielt üben" gilt: die erreichbaren Zeichen der Runde (Etappe B: die Ansage „Gezielt: ö, ä …"). */
  onGezieltRunde?: (zeichen: string[]) => void;
  /** Das Schildchen „Gezielt: ö ä ß ?" samt „Ändern" - steht in der Stand-Zeile (`StandZeile.gezieltSlot`). */
  gezieltSlot?: React.ReactNode;
}

export function AdaptiveTrainer({
  loadFn,
  saveFn,
  onTask,
  stufe,
  lang,
  startTempo,
  goalSlot,
  enforceShiftHand = true,
  zeitLassen = false,
  zeichenabstand = 1,
  zeilenEnde = false,
  onOpenStory,
  startForm,
  onFormEnde,
  gezielt = null,
  onVorgezogen,
  onGezieltRunde,
  gezieltSlot,
}: AdaptiveTrainerProps) {
  const voiceEnabled = useVoice((s) => s.enabled);
  // Sichtbare Beschriftungen folgen der Bedienung; was gesprochen wird (Alt + L,
  // Rückmeldung), weiter der Übungssprache - siehe Bauplan §3.5.
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - TRAINER_TEXTE, bedienCopy() und formName() kennen „fr"
  // bereits (bedienCopy() bekam dabei eine echte UI_COPY_FR-Tabelle, Falle 30:
  // die alte `=== "en"`-Weiche hätte „fr" still Deutsch gegeben).
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const tt = TRAINER_TEXTE[sprache];
  /*
    ★ EN1 (19.09.2026): Was die BEDIENUNG sagt (Alt + L, die Ankündigung einer
    Übungsform aus dem Regal, der Rat am Rundenende), kommt in Tastenflow
    (`bereichAktiv`) in der Bedienungssprache und mit ihrer Stimme. Ohne
    aktiven Sprachbereich: wie bisher.
    Über einen Ref, weil die Horcher und `onSessionDone` ihre Abhängigkeiten
    bewusst schmal halten.
  */
  const bedienRef = useRef({ sprache, bereichAktiv });
  bedienRef.current = { sprache, bereichAktiv };
  // Schlanke Oberfläche (Wunsch): Beschreibung + Buchstaben-Karte standardmäßig
  // EINGEKLAPPT. Status hier gehalten, damit er beim Rundenwechsel der Session
  // nicht verlorengeht.
  const [progress, setProgress] = useState<TypingProgress>(() => emptyProgress());
  const [ready, setReady] = useState(false);
  const [round, setRound] = useState(0);
  // ★ ES-M2 (27.09.2026): ALLE neuen Einheiten der Runde (¿ mit ?), nicht nur die letzte.
  const [justUnlocked, setJustUnlocked] = useState<readonly string[] | null>(null);
  const [rueckmeldung, setRueckmeldung] = useState<Rueckmeldung | null>(null);
  /**
   * ★★ FREISCHALTEN UND FEIERN SIND GETRENNT (Johannes 14.08.2026).
   *
   * Bis dahin war das Spiel ein TOR: Wer die Mastery-Schwelle erreicht hatte,
   * bekam die neue Taste erst, wenn er den Parcours schaffte (08.07.). Für die
   * jüngeren Profile war das der EINZIGE Weg zu einer neuen Taste — und damit
   * bestrafte es genau das langsame, sorgfältige Kind, und zwar unsichtbar: Es
   * erlebte nicht „eine Regel hält mich auf", sondern nur „ich komme nicht
   * weiter".
   *
   * Jetzt gehört die Taste dem Kind, sobald die Schwelle erreicht ist. Das Spiel
   * kommt DANACH als Belohnung („Du hast dir das verdient — willst du es im Eis
   * feiern?"): `belohnung` ist das Angebot in der Feier-Karte, `spiel` der
   * laufende Belohnungs-Lauf. Gewinnen, abbrechen oder gar nicht erst
   * hineingehen ändert am Lernstand nichts mehr.
   *
   * ★ Seit 22.08.2026 ist `course` nie mehr `null`: Es gibt nur noch das
   * Eisschollen-Spiel oder gar keine Belohnung (der Tipp-Sprint, der ohne
   * Parcours auskam, ist entfallen). Angebot ohne Parcours gibt es also nicht.
   */
  const [belohnung, setBelohnung] = useState<{ unit: string; course: FloeCourse } | null>(
    null,
  );
  const [spiel, setSpiel] = useState<{ unit: string; course: FloeCourse } | null>(null);
  // Stufen-Aufstieg + neu verdiente Abzeichen dieser Runde (für Belohnungs-Klang
  // + Glückwunsch + Abzeichen-Chips in der Karte). Die NUMMER der Leistungsstufe
  // bekommen Lernende bewusst NICHT zu sehen (nur die Lehrkraft) — daher
  // nur ein Boolean, kein Stufen-Label.
  const [reward, setReward] = useState<{
    leveledUp: boolean;
    badges: BadgeDef[];
  }>({ leveledUp: false, badges: [] });

  // Sprachwechsel mitten in einer Runde: Signal zählt hoch → items regenerieren.
  // Der qi-Stand wird gemerkt, damit TypingSession nahtlos weitermacht.
  const [langSignal, setLangSignal] = useState(0);
  const prevLangRef = useRef(lang);
  const qiRef = useRef(0);
  const startFromRef = useRef(0);
  // Die laufende Zeilennummer auch als ZUSTAND: Der Pyramiden-Schmuck über der
  // Tippzeile muss sich mitbewegen, und eine Ref löst kein Neuzeichnen aus.
  const [qi, setQi] = useState(0);
  /**
   * Das Angebot der Abschluss-Karte im Spielstand vermerken - als Ref, weil
   * `onSessionDone` weiter oben steht als der Haken, der es liefert.
   *
   * ⚠️ Bewusst PUR (ein `TypingProgress` rein, einer raus) und in DENSELBEN
   * `persist` gefaltet: Am Rundenende feuern mehrere Verbucher im selben Tick -
   * ein eigener `persist` würde den der anderen überschreiben (K9).
   */
  const vermerkeInRef = useRef<(p: TypingProgress) => TypingProgress>((p) => p);
  /** Aus demselben Grund als Ref: `onRetry` steht vor dem Haken. */
  const formBeendenRef = useRef<() => void>(() => {});
  /** Rückweg ins Regal „Wortspiele" - nur gesetzt, wenn die Form von dort kam. */
  const formEndeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (lang !== prevLangRef.current) {
      prevLangRef.current = lang;
      startFromRef.current = qiRef.current; // Stand vor Sprachwechsel merken
      setLangSignal((s) => s + 1);
    }
  }, [lang]);

  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Stufe/Sprache/Start-Anforderung in einem Ref: immer aktuell (auch für
  // Sprachwechsel-Items-Regenerierung).
  const paramsRef = useRef({ stufe, lang, startTempo, zeitLassen });
  paramsRef.current = { stufe, lang, startTempo, zeitLassen };
  const gezieltRef = useRef({ gezielt, onVorgezogen, onGezieltRunde });
  gezieltRef.current = { gezielt, onVorgezogen, onGezieltRunde };

  /**
   * ★★ DIE FEIER DER NEUEN TASTE - EINE Stelle für beide Wege (02.10.2026).
   *
   * Bis dahin stand sie nur am Ende von `onSessionDone`. Seit das Klassenmatch
   * eine Taste nur noch VORMERKT, wird sie ein zweites Mal gebraucht: beim
   * Einstieg ins Training. Dieselbe Karte, dieselbe Belohnung - nicht neu
   * erfunden. Alles Gelesene kommt aus Refs, darum bleibt die Funktion stabil.
   *
   * ★ ES-M2 (Prüfbericht ES-P2 M1): alle neuen Einheiten, bei einem Paar
   * (¿ mit ?) bis hierher nur die letzte, das öffnende Zeichen fehlte.
   */
  const feiereNeueTaste = useCallback(
    (vorher: string[], nachher: string[], letters: TypingProgress["letters"], m: Mastery, weg: Lernweg) => {
      // Welches Spiel als BELOHNUNG angeboten wird (Weiche 2, Johannes 29.07.):
      // kind die Polar-Expedition, Erwachsene gar keins - und ab 11 das, was im
      // Zahnrad eingestellt ist (S2, Vorgabe: keins). Die Geräte-Einstellung
      // wird hier FRISCH gelesen, damit ein Umstellen mitten in der Runde noch
      // für diese Freischaltung gilt. Die TASTE hängt seit 14.08.2026 an keinem
      // Spiel mehr.
      const mode = gateModeFor(skinForStufe(paramsRef.current.stufe), activeBelohnungsSpiel());
      const neu = neuFreigeschaltet(vorher, nachher);
      const unit = neu[0] ?? nachher[nachher.length - 1];
      setJustUnlocked(neu.length > 0 ? neu : [unit]); // die Taste IST jetzt frei - erst die Feier ...
      // ... und dann das freiwillige Spiel obendrauf (kind/jugend).
      setBelohnung(
        mode === "keins" ? null : { unit, course: buildTorCourse(vorher, letters, m, weg) },
      );
    },
    [],
  );

  // Spielstand asynchron laden (Server oder lokal); bis dahin „Lädt …".
  useEffect(() => {
    let alive = true;
    void loadFn().then((p0) => {
      if (!alive) return;
      /*
        ★★★★★ EINE TASTE, DIE EIN KLASSENMATCH VERDIENT HAT, WIRD HIER
        VORGESTELLT (02.10.2026, Johannes: *„nach dem abschluss, wenn es wieder
        in mein training geht kommt die meldung der neuen taste!"*).

        Das Match merkt die Taste nur vor (`freischaltungAusMatch`); bis zu
        diesem Einstieg kennt sie kein Spiel. Jetzt läuft der gewöhnliche
        Freischalt-Weg: Einheiten dazu, `introducedAt`, Geduld-Zähler, Topf
        (`loeseVormerkungEin`) und dieselbe Feier wie nach einer Runde
        (`feiereNeueTaste`) - einmalig, denn das Merkfeld ist danach weg und
        wird mit gespeichert. Die Entscheidung des Matchs gilt; `canAdvance`
        wird nicht neu gewürfelt.

        ⚠️ NICHT im Regal „Wortspiele" (`startForm`): Dort sollen Spiele nur
        sehen, was vorgestellt ist - die Vormerkung bleibt, bis das Kind in sein
        Training geht. Dieselbe Komponente, anderer Einstieg.
      */
      let p = p0;
      if (!startForm && p0.freischaltungAusMatch) {
        const lw = lernwegVon(p0);
        const vorher = ensureIntroduced(p0.introduced, lw);
        const erg = loeseVormerkungEin(p0, Date.now(), lw);
        p = erg.progress;
        void Promise.resolve(saveFn(p)).catch(() => undefined);
        if (erg.neu.length > 0) {
          const m0 = masteryForLevel(
            currentLevel(p0, paramsRef.current.startTempo),
            paramsRef.current.zeitLassen,
          );
          feiereNeueTaste(vorher, ensureIntroduced(p.introduced, lw), p.letters, m0, lw);
        }
      }
      progressRef.current = p;
      setProgress(p);
      setReady(true);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    (p: TypingProgress) => {
      // Ref SOFORT nachziehen: Am Zeilenende feuern onLetters (Buchstaben-
      // Telemetrie) und onLineDone (Kalibrierung) synchron im selben Tick und
      // lesen beide progressRef.current. Ohne diese Zeile läse der zweite Aufruf
      // den VOR-Stand (setProgress rendert erst später) und überschriebe den
      // ersten Persist — in Runde 0 gingen so die Buchstaben-Zähler sauber
      // getippter Zeilen verloren (K9 Lost-Update).
      progressRef.current = p;
      setProgress(p);
      saveFn(p);
    },
    [saveFn],
  );

  // Alt+L: Übungs-/Spielstufe (XP-Level) ansagen — von TippenTrainerPage
  // ausgelöst. Das Wort kommt aus dem Profil: Der Ring heißt außerhalb des
  // Kinder-Profils „Übungsstufe", die Ansage sagte aber für alle „Spielstufe" —
  // gesprochen und gesehen liefen auseinander (gefunden 30.07. im Browser).
  useEffect(() => {
    const onRequest = () => {
      const pl = playerLevel(progressRef.current.xp);
      // ★ EN1: in Tastenflow das Wort der Bedienungssprache („Game level 3").
      const b = bedienRef.current;
      const wort = b.bereichAktiv ? bedienCopy(stufe, b.sprache).progressLabel : copyFor(stufe).progressLabel;
      const label = `${wort} ${pl.level}`;
      window.dispatchEvent(new CustomEvent("tippen-announce-level", { detail: label }));
    };
    window.addEventListener("tippen-request-level", onRequest);
    return () => window.removeEventListener("tippen-request-level", onRequest);
    // `stufe` MUSS in den Abhängigkeiten stehen, sonst bliebe das Wort der
    // vorigen Tonlage hängen.
  }, [stufe]);

  // Live (aktualisiert sich nach jeder Zeile): Leistungsstufe, Tasten-Karte, Fokus.
  const level = currentLevel(progress, startTempo);
  const mastery = useMemo(
    () => masteryForLevel(level, zeitLassen),
    [level, zeitLassen],
  );
  const lernweg = lernwegVon(progress);
  const introduced = ensureIntroduced(progress.introduced, lernweg);
  // Umschalttaste schon dran? Wenn nicht, gilt die Auto-Großschreibung (kleiner
  // Buchstabe genügt für den großen — er erscheint trotzdem korrekt).
  const shiftLearned = introduced.includes(SHIFT_UNIT);

  // Die Übungszeilen bleiben WÄHREND einer Runde stabil; neue Zeilen bei
  // „Weiter" (round) ODER Sprachwechsel (langSignal) — dann mit aktuellem
  // Zeichen-Satz, Fokus, Stufe und Sprache aus paramsRef.
  const roundLines = useMemo(
    () => {
      const cur = progressRef.current;
      const wegHier = lernwegVon(cur);
      const intro = ensureIntroduced(cur.introduced, wegHier);
      const p = paramsRef.current;
      const m = masteryForLevel(currentLevel(cur, p.startTempo), p.zeitLassen);
      // Fokus und Übungszeilen richten sich nach den offenen Baustellen: Wer gut
      // läuft, bekommt gar keine Übungszeilen; wer feststeckt, bekommt einen
      // breiteren Fokus UND gezielte Pseudowort-Zeilen (28.08.2026).
      const offen = offeneBaustellen(intro, cur.letters, wegHier, m);
      const f = focusUnits(intro, cur.letters, wegHier, fokusBreiteFuer(offen), m);
      // No-Repeat-Ledger (TW-E2): schon getippte Bausteine meiden. `seenLedgerValid`
      // prüft mit PRÄFIX-VALIDIERUNG: Nach einem reinen Anhänge-Deploy bleibt das
      // Bitset gültig (Indizes stabil) — nur ein echter Bruch (Inhalt geändert/
      // umsortiert) zählt den Vorrat als frisch (leeres Bitset).
      const seen = seenLedgerValid(cur.manifestVersion, cur.seenManifestCount)
        ? decodeSeen(cur.seenBausteine)
        : emptySeen();
      // Themenstränge (TN-E2, arcEngine.ts): fällige Wiederkehr-Schritte zuerst
      // planen — das Frage/Antwort-Paar bleibt zusammen, der Generator meidet
      // dieselben Zeilen (exclude), der Rest der Runde entsteht wie gehabt.
      const arcPlan = planArcRound({
        arcProgress: cur.arcProgress,
        seen,
        story: cur.storyProgress,
        roundsTotal: cur.roundsTotal ?? 0,
        stufe: p.stufe,
        lang: p.lang,
        lernweg: wegHier,
        allowed: new Set(intro.filter((u) => u.length === 1)),
        umschalt: intro.includes(SHIFT_UNIT), // ★ D-2
      });
      // Runde nach TEMPO bemessen (29.08.2026): Wer langsam tippt, bekommt eine
      // kürzere Runde - sonst sitzt er 16 Minuten ohne Pause und ohne Stern.
      // Das Pensum bis zur nächsten Taste bleibt gleich, weil `rundenWert` die
      // kürzere Runde unten entsprechend geringer verbucht.
      const zielZeilen = Math.min(
        ITEMS_PER_SESSION,
        zeilenJeRunde(cur.speedEma, intro.length),
      );
      // ★ GEZIELT ÜBEN: erreichbare Zeichen, noch nicht gelernte nur für DIESEN Aufruf in der erlaubten Menge - `intro` bleibt
      // unberührt (kein ensureIntroduced, nichts wird gespeichert, keine Freischaltung).
      const gz = gezieltFuerRunde(gezieltRef.current.gezielt, intro, wegHier);
      if (gz && gz.vorgezogen.length > 0) gezieltRef.current.onVorgezogen?.(gz.vorgezogen);
      if (gz) gezieltRef.current.onGezieltRunde?.(gz.gezielt.zeichen);
      const base = adaptiveRound({
        introduced: gz ? gz.introFuerRunde : intro,
        ...(gz ? { gezielt: gz.gezielt } : {}),
        focus: f,
        stufe: p.stufe,
        lang: p.lang,
        lernweg: wegHier,
        // ★ E11a-5 (aus E10d): die französische Landesvariante, nur auf Weg „fr".
        ...(wegHier === "fr" ? { franzVariante: franzVariante() } : {}),
        // ★ ES-F7 (27.09.2026): dieselbe Weitergabe für Weg „es".
        ...(wegHier === "es" ? { esVariante: esVariante() } : {}),
        count: Math.max(1, zielZeilen - arcPlanLineCount(arcPlan)),
        seen,
        exclude: arcPlan.exclude,
        uebungsZeilen: uebungsZeilenFuer(offen),
      });
      return weaveArcGroups(base, arcPlan.groups);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, ready, langSignal],
  );
  const items = useMemo(() => roundLines.map((l) => l.text), [roundLines]);
  const sources = useMemo(() => roundLines.map((l) => l.source), [roundLines]);
  // Woraus jede Zeile besteht - die Ansage liest es, statt es zu erraten.
  const arten = useMemo(() => roundLines.map((l) => l.art), [roundLines]);
  // Wie viele Zeilen die eben gespielte Runde WIRKLICH hatte - `onSessionDone`
  // verbucht damit ihren Wert fürs Tor (kurze Runde = anteilig weniger).
  const zeilenRef = useRef(roundLines.length);
  zeilenRef.current = roundLines.length;

  // Tempo-Ziel für die Sterne dieser Runde — aus der Leistungsstufe und dem
  // bisher üblichen Tempo. Pro Runde stabil (vor der Runde berechnet).
  const speedTarget = useMemo(
    () =>
      speedTargetCpm(
        currentLevel(progressRef.current, paramsRef.current.startTempo),
        progressRef.current.speedEma,
        paramsRef.current.zeitLassen,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, ready, zeitLassen],
  );

  const unlocked = useMemo(() => new Set(introduced), [introduced.join("")]); // eslint-disable-line react-hooks/exhaustive-deps
  // Schritt M (19.09.2026): die wackligen Tasten - die Session hält sie je
  // Zeile fest und zählt, wie sie in der Zeile gingen (nur gemessen).
  const wackelig = useMemo(
    () => wackeligeTastenAus(progress.letters, introduced, { lernweg, stufe }), // ★ D-5
    [progress.letters, introduced.join(""), lernweg, stufe], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Tempo-Ziel der LAUFENDEN Runde für die Abzeichen (Fuchs/Faultier) — als Ref,
  // damit onSessionDone (useCallback ohne diese Abhängigkeit) nie veraltet liest.
  const speedTargetRef = useRef(speedTarget);
  speedTargetRef.current = speedTarget;

  const onLetters = useCallback(
    (events: KeyEvent[]) => {
      const cur = progressRef.current;
      persist({ ...cur, letters: mergeLetters(cur.letters, events) });
    },
    [persist],
  );

  // No-Repeat-Ledger (TW-E2): eine getippte Korpus-Zeile als „gesehen" verbuchen,
  // damit sie nicht wiederkehrt. Modusübergreifend über `seenBausteine` (dasselbe
  // Feld nutzen die Lektionen). Server-Sync läuft über `persist` → `saveFn`.
  const onLineSeen = useCallback(
    (index: number) => {
      const cur = progressRef.current;
      const base = seenLedgerValid(cur.manifestVersion, cur.seenManifestCount)
        ? decodeSeen(cur.seenBausteine)
        : emptySeen();
      persist({
        ...cur,
        seenBausteine: encodeSeen(seenAdd(base, index)),
        manifestVersion: corpusManifestVersion(),
        seenManifestCount: corpusManifestCount(),
      });
    },
    [persist],
  );

  // Feinkörnige Anfangs-Kalibrierung: in der ERSTEN Runde (round 0) zieht jede
  // saubere Zeile die Leistungsstufe schon mit, bis sie sich einpendelt — danach
  // übernimmt das Rundenende (onSessionDone → recordRound). Siehe progress.ts.
  const onLine = useCallback(
    (acc: number, cpm: number) => {
      const cur = progressRef.current;
      // „Zeit lassen": Die Kalibrierung sucht die Stufe am TEMPO — sie hat hier
      // nichts zu suchen (die Stufe bleibt, wo sie ist).
      if (paramsRef.current.zeitLassen) return;
      if (cur.calibrated || round !== 0) return;
      const playedLevel = currentLevel(cur, paramsRef.current.startTempo);
      const updated = recordCalibrationSample(cur, acc, cpm, playedLevel);
      if (updated !== cur) persist(updated);
    },
    [persist, round],
  );

  const onSessionDone = useCallback(
    (acc: number, cpm: number, stars: number, detail?: RoundDetail) => {
      const cur = progressRef.current;
      const playedLevel = currentLevel(cur, paramsRef.current.startTempo);
      const m = masteryForLevel(playedLevel, paramsRef.current.zeitLassen);
      const introCur = ensureIntroduced(cur.introduced, lernwegVon(cur));
      const now = Date.now();
      // Was diese Runde fürs Tor zählt (rundenlaenge.ts): eine gekürzte oder in
      // Sekunden weggetippte Runde ist anteilig weniger Übung. Eine volle Runde
      // in üblichem Tempo zählt wie immer 1,0.
      const rundenGutschrift = rundenWert(zeilenRef.current, detail?.ms);
      /*
        ★★★★★ WANN EINE NEUE TASTE DAZUKOMMT - seit 11.09.2026 EINMAL, in
        `lib/typing/tastenfreischaltung.ts`.

        Hier standen bis dahin vier Dinge nebeneinander: `advanceIntroduced`,
        der Vergleich der Längen, `topfTastenVerbuchen` und weiter unten
        `stampUnlocks` samt Geduld-Zähler. Das Klassenmatch (F7) schaltet Tasten
        frei „wie eine normale Runde" und bräuchte dieselben vier - eine zweite
        Fassung derselben Regel, und zwar an der Stelle, an der ein Fehler
        heisst: Ein Kind bekommt seine Taste nicht.

        Die Begründung für diesen Weg (statt eines „match"-Modus im Trainer)
        steht im Kopf der neuen Datei.
      */
      const frei = wendeRundenendeAn(cur, m, rundenGutschrift, now, lernwegVon(cur));
      const grown = frei.introduced;
      const gain = 15 + Math.round(acc * 15);
      // Übliches Tempo nur aus halbwegs sauberen Runden lernen (sonst verfälschen
      // Fehler-Runden das persönliche Ziel).
      // ★★★★★ Wortspiel? Dann bewegt diese Runde das persoenliche Tempo-Ziel
      // NICHT. Sonst zoege eine Runde, in der ein Kind ueberlegt statt
      // abschreibt, sein Ziel nach unten - und die naechste gewoehnliche Runde
      // erschiene faelschlich als Fortschritt (Johannes, 02.09.2026).
      const wortspiel = !!detail?.wortspiel;
      const speedEma =
        !wortspiel && cpm > 0 && acc >= 0.5
          ? updateSpeedEma(cur.speedEma, cpm)
          : cur.speedEma;
      // Runde verbuchen + Leistungsstufe automatisch nachführen. Die NEUE
      // Einheit wird hier noch NICHT übernommen — erst das Eisschollen-Spiel
      // („Tor vor der neuen Taste") schaltet sie bei Erfolg wirklich frei.
      const rec = recordRound(
        { ...cur, xp: cur.xp + gain, introduced: introCur, speedEma },
        { acc, cpm, stars },
        playedLevel,
        now,
        paramsRef.current.zeitLassen,
      );
      // Abzeichen NACH dem Verbuchen prüfen (die Runde steckt dann im Verlauf).
      // Fuchs/Faultier messen gegen DASSELBE Tempo-Ziel wie die Sterne.
      const badged = awardBadges(
        rec.progress,
        {
          acc,
          cpm,
          stars,
          level: playedLevel,
          target: speedTargetRef.current,
          detail,
          lang: paramsRef.current.lang,
          wortspiel,
        },
        now,
        lernwegVon(rec.progress),
      );
      // Die Freischaltung (samt anonymem Topf und Geduld-Zähler) ist oben in
      // `wendeRundenendeAn` gefallen - hier steht nur noch, was sie ergab.
      const gewachsen = frei.gewachsen;
      // Themenstränge (TN-E2): Rundenzähler +1 und Strang-Fortschritt gegen das
      // frische Bitset (die eben getippten Arc-Zeilen sind via onLineSeen schon
      // verbucht) — reist im selben persist mit.
      const arcUpd = roundEndArcUpdate({
        arcProgress: cur.arcProgress,
        seen: seenLedgerValid(cur.manifestVersion, cur.seenManifestCount)
          ? decodeSeen(cur.seenBausteine)
          : emptySeen(),
        story: cur.storyProgress,
        roundsTotal: cur.roundsTotal,
        stufe: paramsRef.current.stufe,
        lang: paramsRef.current.lang,
        lernweg: lernwegVon(cur),
      });
      persist(
        vermerkeInRef.current({
        ...(gewachsen
          ? {
              ...badged.progress,
              introduced: grown,
              // Seit 28.08.2026 wird der Zeitpunkt mitgeschrieben — vorher wurde
              // die Freischaltung nur gefeiert und war hinterher nicht mehr
              // nachvollziehbar (Befund an Janos Konto).
              introducedAt: frei.introducedAt,
              rundenOhneTaste: frei.rundenOhneTaste, // neue Taste da → 0
            }
          : {
              ...badged.progress,
              rundenOhneTaste: frei.rundenOhneTaste,
            }),
        ...arcUpd,
        }),
      );
      setReward({ leveledUp: rec.leveledUp, badges: badged.newly });
      // Rückmeldung für den Endbildschirm: was das Kind in der NÄCHSTEN Runde
      // tun kann - und was darin anders sein wird (Pseudowort-Zeilen).
      const nachRunde = gewachsen ? grown : introCur;
      const offenDanach = offeneBaustellen(nachRunde, badged.progress.letters, lernwegVon(cur), m);
      // Wie die Karte: bei „100 %" zählen die Sterne als drei.
      const sterneEff = Math.round(acc * 100) >= 100 ? 3 : stars;
      setRueckmeldung(
        rueckmeldungFuer({
          introduced: nachRunde,
          letters: badged.progress.letters,
          lernweg: lernwegVon(cur),
          m,
          rundenOhneTaste: gewachsen
            ? 0
            : (cur.rundenOhneTaste ?? 0) + rundenGutschrift,
          freigeschaltet: gewachsen,
          uebungsZeilen: uebungsZeilenFuer(offenDanach),
          rundeAcc: acc,
          // ★ 29.10.2026: bei drei Sternen ein passender Rat, jede Runde ein anderer.
          sterne: sterneEff,
          variante: sterneEff >= 3 ? naechsteVariante("rat", 3) : undefined,
          // ★ EN1: Der Rat steht auf der Abschluss-Karte - in Tastenflow in
          // der Bedienungssprache, sonst in der Vorlese-Sprache wie bisher.
          lang: bedienRef.current.bereichAktiv ? bedienRef.current.sprache : paramsRef.current.lang,
        }),
      );
      if (gewachsen) feiereNeueTaste(introCur, grown, cur.letters, m, lernwegVon(cur));
    },
    [persist, feiereNeueTaste],
  );

  const onRetry = useCallback(() => {
    startFromRef.current = 0; // neue Runde beginnt immer bei Zeile 0
    // Eine Übungsform dauert genau eine Runde. „Weiter" führt zurück ins
    // gewöhnliche Training - das nächste Angebot kommt auf der nächsten Karte.
    // Kam sie aus dem Regal „Wortspiele", geht es dorthin zurück: Wer sich
    // etwas aus einem Regal nimmt, landet danach wieder davor.
    formBeendenRef.current();
    if (formEndeRef.current) {
      formEndeRef.current();
      return;
    }
    setJustUnlocked(null);
    setBelohnung(null);
    setReward({ leveledUp: false, badges: [] });
    setRound((r) => r + 1);
  }, []);

  // Belohnungs-Lauf beendet (geschafft, abgebrochen oder Escape): Am Lernstand
  // ändert das nichts mehr — es geht einfach mit der nächsten Runde weiter.
  // ★ Nr 19 der Fokusziele (22.08.2026): Der Öffner dieses Laufs war die
  // Feier-Karte - die gibt es nicht mehr, `restoreFocus` der Bühne greift also
  // ins Leere und der Fokus bleibt auf `body`. Ausdrücklich in die
  // Eingabezeile, statt zu hoffen, dass das neue Tippfeld ihn holt.
  const spielFertig = useCallback(() => {
    setSpiel(null);
    onRetry();
    focusPracticeField();
  }, [onRetry]);

  // Aus der Feier-Karte ins Belohnungs-Spiel (die Taste ist längst frei).
  const belohnungStarten = useCallback(() => {
    setJustUnlocked(null);
    setSpiel(belohnung);
    setBelohnung(null);
  }, [belohnung]);

  const pl = playerLevel(progress.xp);
  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";

  // Der GESCHICHTEN-HAUPTWEG (Wunsch Johannes 28.07.2026): Nach jeder Runde wird
  // die nächste fällige Geschichte angekündigt — erst zu Ende lesen, was offen
  // ist, dann die nächste ungelesene. Wer immer bestätigt, kommt so durch die
  // ganze Bücherei. Der Knopf ist der HAUPTknopf der Karte (StoryOffer setzt den
  // Fokus darauf), „lieber weiter üben" steht klein daneben.
  const openSerie = useMemo(
    () =>
      onOpenStory
        ? nextSerieFor(
            progress,
            allowedFromIntroduced(progress.introduced, lernwegVon(progress)),
            stufe,
            lang,
            lernwegVon(progress),
            // ★ D-2: Erwachsene vor ⇧ - keine Geschichte mit Grossbuchstaben.
            ensureIntroduced(progress.introduced, lernwegVon(progress)).includes(SHIFT_UNIT),
          )
        : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onOpenStory, progress.storyProgress, progress.introduced, progress.lernweg, stufe, lang],
  );
  // Die ÜBUNGSFORMEN (02.09.2026) - sieben Formen aus Testerin Unterricht, angeboten
  // auf derselben Abschluss-Karte wie die Geschichte und im SELBEN Wechsel:
  // Wer immer den Hauptknopf drückt, kommt reihum an allem vorbei (Johannes,
  // 01.09.). Kein vierter Reiter.
  const {
    ctx: formCtx,
    angebot,
    form,
    lauf,
    starten: formStarten,
    starteBestimmte: formStarteBestimmte,
    beenden: formBeenden,
    vermerkeIn,
  } = useUebungsform({
    progress,
    stufe,
    lang,
    oneHand: !enforceShiftHand,
    round,
    storyOffen: !!openSerie && !!onOpenStory,
  });
  vermerkeInRef.current = vermerkeIn;
  formBeendenRef.current = formBeenden;

  // Aus dem Regal „Wortspiele" gewählt: die Form sofort starten - nicht erst
  // am Rundenende anbieten. Erst, wenn der Spielstand geladen ist, denn der
  // Tastenstand entscheidet, was eine Form überhaupt bauen kann.
  const gestarteteFormRef = useRef<UebungsformId | null>(null);
  formEndeRef.current = startForm ? onFormEnde : undefined;
  useEffect(() => {
    if (!ready || !startForm || gestarteteFormRef.current === startForm) return;
    const f = formFuer(startForm);
    if (!f || !f.taugt(formCtx)) return;
    gestarteteFormRef.current = startForm;
    // ★ Abnahme 02.09.2026: Aus dem Regal gestartet, sagte sich eine Zeilenform
    // GAR NICHT an. Auf der Abschluss-Karte steht der Ankündigungssatz auf dem
    // Knopf - im Regal steht dort nur der Name, und ein Kind mit Blindheit
    // begänne wortlos zu tippen. Angesagt wird hier, aus DEMSELBEN
    // Zusammenhang, aus dem gleich die Runde entsteht: Formen, die ihren
    // Schwerpunkt auswürfeln, sagen damit genau den an, den sie auch bauen.
    // ★ EN1: Der Satz ist in Tastenflow in der Bedienungssprache
    // geschrieben (`useUebungsform`) - also auch mit ihrer Stimme.
    const satz = f.ankuendigung(formCtx);
    if (bereichAktiv) speakUi(satz, undefined, undefined, sprache);
    else speakUi(satz);
    formStarteBestimmte(f);
    // `formCtx` bewusst NICHT in den Abhängigkeiten: Er entsteht bei jedem
    // Tastenstand-Wechsel neu, und die Form soll genau EINMAL starten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, startForm]);

  const storyOffer =
    angebot === GESCHICHTE && openSerie && onOpenStory ? (
      <StoryOffer
        serie={openSerie}
        weiter={serieStatus(progress, openSerie.slug) === "offen"}
        skin={skin}
        onOpen={() => onOpenStory(openSerie.slug)}
      />
    ) : undefined;

  // Läuft gerade eine Form, wird sie nicht gleich noch einmal angeboten - erst
  // die Karte NACH ihr trägt wieder ein Angebot.
  const formAngebot =
    form && !lauf ? (
      <UebungsformAngebot
        ankuendigung={form.ankuendigung(formCtx)}
        onStart={formStarten}
      />
    ) : undefined;
  /*
    ★ D-8 (28.09.2026): „Grundstellung prüfen" als Angebot am ANFANG - auf der
    ersten Abschluss-Karte einer Sitzung (`round === 0`), solange ein Kind noch
    an der Grundreihe übt. Nur, wenn die Karte sonst nichts anbietet: Eine
    Geschichte oder ein Wortspiel hat Vorrang, und es bleibt EIN Hauptknopf.
    Jederzeit steht es ausserdem im Regal „Wortspiele".
  */
  const [grundstellungOffen, setGrundstellungOffen] = useState(false);
  const nochAnDerGrundreihe =
    introduced.filter((u) => u !== SHIFT_UNIT).length <= lernwegDef(lernweg).homeRowLetters;
  const grundstellungAngebot =
    !startForm && !lauf && round === 0 && nochAnDerGrundreihe ? (
      <UebungsformAngebot
        ankuendigung={tt.grundstellungAngebot}
        onStart={() => setGrundstellungOffen(true)}
      />
    ) : undefined;
  const angebotSlot = storyOffer ?? formAngebot ?? grundstellungAngebot;

  // Der Erklärtext („Geübt wird gezielt, was bei dir noch wackelt …") stand
  // bis 25.08.2026 hier, hinter dem Dreieck vor „Mein Training". Mit der
  // Kopf-Karte ist auch er gegangen - er steht jetzt dauerhaft in der Hilfe
  // (Alt + H), statt einmal aufgeklappt und nie wieder gelesen zu werden.

  // Die Zeilen einer laufenden Übungsform. ⚠️ MEMOISIERT: Eine neue
  // Array-Referenz startet in `TypingSession` eine neue Runde - ohne `useMemo`
  // begänne die Form bei jedem Neuzeichnen von vorn.
  const formItems = useMemo(
    () => lauf?.runde?.zeilen.map((l) => l.text) ?? null,
    [lauf],
  );
  const formSources = useMemo(
    () => lauf?.runde?.zeilen.map(() => null) ?? null,
    [lauf],
  );
  const schmuck = lauf?.runde?.schmuck;
  // ★ 25.09.2026: Aufgaben und Quellwort werden EINMAL je Lauf gewürfelt. Bis
  // dahin standen beide Aufrufe im Rendern selbst (mit `Math.random`) - jedes
  // Neuzeichnen mitten in der Runde gab dem Buchstabensalat ein anderes Wort,
  // während nur das erste angesagt worden war.
  const raetselAufgaben = useMemo(
    () => (lauf?.form.eigenerBildschirm === "raetsel" && lauf.form.fragen ? lauf.form.fragen(formCtx) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lauf],
  );
  const salatwort = useMemo(
    () => (lauf?.form.eigenerBildschirm === "buchstabensalat" ? waehleSalatwort(formCtx) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lauf],
  );

  if (!ready)
    return (
      <div className="card p-6 text-center text-ink-muted">{tt.laedt}</div>
    );

  // ★ D-8: „Grundstellung prüfen" - zurück (Esc oder „Zurück") geht in die
  // nächste Runde, der Fokus in die Eingabezeile.
  if (grundstellungOffen)
    return (
      <GrundstellungPruefen
        lang={lang}
        onZurueck={() => {
          setGrundstellungOffen(false);
          onRetry();
          focusPracticeField();
        }}
      />
    );

  // Formen mit EIGENEM Bildschirm - Frage und Antwort fallen dort auseinander,
  // die gewohnte Tippzeile taugt dafür nicht (sie zeigt immer die Lösung).
  if (lauf?.form.eigenerBildschirm === "raetsel" && raetselAufgaben) {
    const aufgaben = raetselAufgaben;
    return (
      <RaetselLauf
        titel={formName(lauf.form.id, sprache)}
        ankuendigung={lauf.form.ankuendigung(formCtx)}
        aufgaben={aufgaben}
        grossKleinZaehlt={lauf.form.grossKleinZaehlt}
        eingabeAnsagen={lauf.form.eingabeAnsagen}
        // ★ Punkt 15 (20.09.2026): einzeichige Antworten (Fingerdiktat)
        // brauchen kein Prüfen/Enter mehr - siehe `typen.ts`.
        einzeichigeAntwort={lauf.form.einzeichigeAntwort}
        // ★★★★★ Die Gegenhand-Regel gilt auch im Rätsel-Bildschirm
        //   (04.09.2026, Testerin Meldung: „Im Lückentext ist es egal, welchen
        //   Umschalter man nutzt … es wäre konsequent, wenn das in allen
        //   Übungen wichtig ist."). Sie hängt an derselben Achse wie die
        //   Großschreibung - siehe die Erklärung an `RaetselLauf`.
        enforceShiftHand={enforceShiftHand}
        shiftLearned={shiftLearned}
        contextId={`form:${lauf.form.id}`}
        onAufgabeFertig={(e) => onTask?.(e)}
        lang={lang}
        // ★ CVI (19.09.2026, „überall"): derselbe Wert wie die Tippzeile.
        zeichenabstand={zeichenabstand}
        onFertig={onRetry}
        onAbbruch={onRetry}
      />
    );
  }
  if (lauf?.form.eigenerBildschirm === "buchstabensalat") {
    const quellwort = salatwort;
    if (quellwort)
      return (
        <BuchstabensalatLauf
          quellwort={quellwort}
          ankuendigung={lauf.form.ankuendigung(formCtx)}
          contextId={`form:${lauf.form.id}`}
          onAufgabeFertig={(e) => onTask?.(e)}
          lang={lang}
          zeichenabstand={zeichenabstand}
          onFertig={onRetry}
          onAbbruch={onRetry}
        />
      );
  }

  if (lauf?.form.eigenerBildschirm === "iglu") {
    // Das Wort wird im Bildschirm selbst je Runde gewürfelt (Zustand, nicht Rendern).
    return (
      <IgluLauf
        ctx={formCtx}
        ankuendigung={lauf.form.ankuendigung(formCtx)}
        contextId={`form:${lauf.form.id}`}
        onAufgabeFertig={(e) => onTask?.(e)}
        lang={lang}
        zeichenabstand={zeichenabstand}
        onFertig={onRetry}
        onAbbruch={onRetry}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Freies Eisschollen-Spiel: jederzeit „dazwischen" startbar, zählt nicht
          als Übezeit (Wunsch Johannes 10.07.). Nur die BÜHNE — gestartet wird
          über „🐧 Spielen" in der Stand-Zeile unter dem Übungsfeld, und den
          gibt es seit 31.08.2026 wieder bis 15 Jahre (nur ab 16 nicht). */}
      <FloeFreePlay
        progress={progress}
        stufe={stufe}
        startTempo={startTempo}
        zeitLassen={zeitLassen}
        onProgress={persist}
        zeichenabstand={zeichenabstand}
      />

      {/* Belohnungs-Lauf NACH der Freischaltung (14.08.2026): ein kurzer
          Packeis-Parcours auf der Vollbild-Bühne. Ob er gelingt, hat KEINE Folge
          mehr für den Lernstand — die Taste ist schon frei. Das adaptive
          Zeitfenster kommt aus den Messwerten (letters/mastery, §5) und entfällt
          ganz, wenn für dieses Kind „Zeit lassen" gilt. */}
      <ExpeditionStage
        open={!!spiel}
        course={spiel?.course ?? undefined}
        free={false}
        isAdult={isAdult}
        uppercase={shiftLearned}
        voiceEnabled={voiceEnabled}
        letters={progress.letters}
        mastery={mastery}
        noTimePressure={zeitLassen}
        zeichenabstand={zeichenabstand}
        onWin={spielFertig}
        onClose={spielFertig}
      />

      <UnlockCelebration
        unit={justUnlocked?.[0] ?? null}
        mit={justUnlocked?.slice(1)}
        lernweg={lernweg}
        skin={skin}
        belohnung={
          belohnung
            ? {
                // Der Ton folgt dem PROFIL, nicht dem Spiel: Seit S2 kann auch
                // die Jugend-Stufe die Expedition wählen — sie bekommt sie
                // trocken angeboten, nicht mit Kinder-Jubel.
                ...belohnungsAngebot(sprache, skin === "kind"),
                onStart: belohnungStarten,
              }
            : undefined
        }
        onClose={() => {
          // „Weiter" (sowie Escape und der Hintergrund) startet direkt die
          // nächste Runde: justUnlocked wird gelöscht, neue Zeilen kommen — so
          // kann man mit EINEM Enter auf dem fokussierten „Weiter" sofort
          // weiterschreiben (Wunsch Johannes).
          // ★ Nr 12 (22.08.2026): Der Fokus geht ausdrücklich in die
          // Eingabezeile. Bisher hing er daran, dass das neu aufgebaute Feld
          // ihn von selbst holt - und das tut es nicht, solange noch ein
          // Dialog im Baum steht. Einen Selbstschließer nach sieben Sekunden
          // gibt es nicht mehr; die Karte wartet, bis das Kind antwortet.
          onRetry();
          focusPracticeField();
        }}
      />

      <TypingSession
        items={formItems ?? items}
        sources={formSources ?? sources}
        // ★ Abnahme 02.09.2026: WÄHREND einer Übungsform schweigt die
        // Inhaltswechsel-Ansage. Jede Form kündigt sich selbst an - und in
        // einer Pyramide wäre die Zeilen-Ansage sogar falsch: `Haa` ist eine
        // STUFE von `Haar`, kein Unsinnwort. Ohne Etikett wird nichts
        // angekündigt, und das ist hier genau richtig.
        arten={lauf ? undefined : arten}
        onLineSeen={onLineSeen}
        contextId={lauf ? `form:${lauf.form.id}` : "adaptiv"}
        unlocked={unlocked}
        shiftLearned={shiftLearned}
        enforceShiftHand={enforceShiftHand}
        zeichenabstand={zeichenabstand}
        // ★ Zeilenende mit Enter (23.09.2026) - gilt hier (Mein Training UND
        // Zeilen-Wortspiele): RaetselLauf/BuchstabensalatLauf haben oben
        // eigene, frühere Rückgaben und bekommen sie darum gar nicht erst.
        zeilenEnde={zeilenEnde}
        stufe={stufe}
        lang={lang}
        voiceEnabled={voiceEnabled}
        // ★ Sara 21.10.2026: Mein Training wie Klassenmatch - die Zeilenansage
        // wird beim Tippen nicht abgewürgt, und auch Zahlen-/Sonderzeichen-
        // Zeilen werden ganz gelesen.
        satzAusreden
        zeileGanz
        speedTarget={speedTarget}
        onItemDone={(e) => onTask?.(e)}
        onLetters={onLetters}
        onLineDone={onLine}
        wackeligeTasten={wackelig}
        onSessionDone={onSessionDone}
        onRetry={onRetry}
        retryLabel={angebotSlot ? tt.lieberWeiter : tt.weiter}
        endSlot={angebotSlot}
        leveledUp={reward.leveledUp}
        newBadges={reward.badges}
        lernweg={lernweg}
        hinweis={rueckmeldung?.satz ?? null}
        naechsteRundeHinweis={rueckmeldung?.pseudoHinweis ?? null}
        suppressRewardSound={!!justUnlocked || !!spiel}
        // Dieselbe Lage, zwei Folgen: Liegt die Feier-Karte oder die
        // Expeditions-Bühne über der Abschluss-Karte, schweigt nicht nur der
        // Sternen-Klang — die Karte überlässt dem Fenster auch Fokus-Falle und
        // Escape (F1, 31.08.2026).
        ueberlagert={!!justUnlocked || !!spiel}
        initialQi={startFromRef.current}
        onQiChange={(n) => {
          qiRef.current = n;
          setQi(n);
        }}
        // Der Pyramiden-Schmuck steht ÜBER der Tippzeile und ist für die
        // Sprachausgabe ausgeblendet: Die Aufgabe bleibt Zeile für Zeile
        // lösbar, die Grafik trägt sie nie.
        topSlot={
          schmuck?.art === "pyramide" ? (
            <PyramidenSchmuck
              pyramiden={schmuck.pyramiden}
              zeile={qi}
              lang={lang}
              zeichenabstand={zeichenabstand}
            />
          ) : undefined
        }
        // Die Buchstaben-Karte stand bis 25.08.2026 ÜBER dem Feld. Sie steht
        // jetzt in „Meine Statistik" (Alt + S) — beim Üben zählt, welche Taste
        // als NÄCHSTE kommt, und die steht in der Stand-Zeile.
        standSlot={
          <StandZeile
            stufeLabel={bedienCopy(stufe, sprache).progressLabel}
            level={pl.level}
            nextUnit={nextLetter(introduced, lernweg)}
            shiftLearned={shiftLearned}
            goalSlot={goalSlot}
            gezieltSlot={gezieltSlot}
            spielen={showsFreePlay(skin)}
          />
        }
      />
    </div>
  );
}
