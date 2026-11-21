/**
 * Spielstand des Tipptrainers — lokal im Browser (localStorage). Struktur
 * backend-freundlich; mit Konto speichert account.ts denselben Stand pro
 * Schüler:in, damit die Lehrkraft die Statistik sieht.
 */
import {
  CAL_WINDOW,
  CLEAN_ACC,
  LEVEL_MAX,
  RoundResult,
  adaptLevel,
  calibrateFromSpeeds,
  startLevelForTempo,
} from "./level";
import type { TempoLevel } from "./letters";

export interface LessonRecord {
  completed: boolean;
  bestStars: number; // 0..3
  bestCpm: number; // beste Anschläge/Minute
  attempts: number;
}

/**
 * Pro-Zeichen-Statistik für die individuelle (adaptive) Lernumgebung. Wird aus
 * jedem einzelnen Anschlag gespeist (modusübergreifend: Lektionen + Mein
 * Training) und ist die Grundlage für „wo hakt es" und die buchstabenweise
 * Freischaltung. Zeichen werden kleingeschrieben gespeichert (Taste, nicht
 * Groß-/Kleinform).
 */
export interface LetterStat {
  hits: number; // korrekte Anschläge dieses Zeichens (Lebenszeit — für die Lehrkraft)
  misses: number; // Fehlanschläge an dieser Stelle (Lebenszeit)
  sumMs: number; // Summe der gemessenen Anschlagszeiten (Lebenszeit, nur saubere Treffer)
  timed: number; // Anzahl gemessener Anschläge (Lebenszeit)
  /**
   * Gleitendes Fenster der letzten Anschläge (für „sitzt/wackelig/hakt" und die
   * Aufstiegs-Entscheidung). So zählt die AKTUELLE Fertigkeit: wer sich anfangs
   * oft vertippt hat, kommt mit ein paar sauberen Anschlägen wieder heraus —
   * statt von alten Fehlern ewig ausgebremst zu werden. Kodierung je Anschlag:
   * Zahl > 0 = getakteter Treffer (ms), 0 = Treffer ohne Zeitmessung, −1 = Fehler.
   * Optional für Altstände (ohne Fenster wird auf die Lebenszeit-Werte gerechnet).
   */
  recent?: number[];
}

export interface TypingProgress {
  xp: number;
  lessons: Record<string, LessonRecord>;
  /** Pro-Zeichen-Statistik (adaptive Lernumgebung); optional für Altstände. */
  letters?: Record<string, LetterStat>;
  /** Adaptive: bereits freigeschaltete Buchstaben in Reihenfolge; optional. */
  introduced?: string[];
  /**
   * WANN jede Einheit freigeschaltet wurde (Einheit → Zeitpunkt in ms).
   *
   * Bis 28.08.2026 wurde die Freischaltung nur gefeiert, nie aufgeschrieben —
   * damit war die Frage „wie lange hat das Kind bis zur nächsten Taste geübt?"
   * für KEIN Kind beantwortbar (Befund an Janos Konto, [[project_zehnfinger_trainer]]).
   * Additiv und rückwärtsverträglich: fehlende Einträge heißen „vor dieser
   * Änderung freigeschaltet", nicht „nie". Deshalb NIE aus dem Fehlen eines
   * Eintrags auf einen Zeitpunkt schließen — {@link ohneZeitstempel} zählt sie.
   */
  introducedAt?: Record<string, number>;
  /**
   * ★★★ WELCHEN STARTPUNKT-BESCHLUSS DIESES KIND SCHON ÜBERNOMMEN HAT
   * (04.09.2026, Johannes: *„Lehrer dürfen ihre Schüler auch downgraden"*).
   *
   * Der Startpunkt („Womit anfangen?") steht am KONTO - schreiben darf ihn nur,
   * wer das Konto führt. Angewandt wird er beim Laden durch das Kind
   * ({@link startpunktAnwenden}), und seit dem 04.09. auch NACH UNTEN.
   *
   * Genau dafür gibt es diesen Vermerk: Ein Zurückstufen darf **einmal**
   * geschehen, nicht bei jedem Öffnen - sonst nähme es einem Kind alles wieder
   * weg, was es sich seit dem Beschluss erübt hat. `startAngewandtAm` trägt den
   * Beschluss-Zeitpunkt (`TypingAccount.startUnitsAt`), `startAngewandt` den
   * Wert dazu. Beides additiv; fehlt es, ist noch nie etwas übernommen worden.
   */
  startAngewandt?: number;
  startAngewandtAm?: number;
  /**
   * ★★ S1 (28.09.2026, Schlussprüfung Nachtlauf): ein Startpunkt-Beschluss des
   * Kontos, der NICHT zu diesem Weg gehört - er wurde auf einem anderen Weg
   * gesetzt und dort übernommen, bevor die Lehrkraft den Weg umgestellt hat.
   * `startUnits` ist eine Anzahl in SEINEM Weg; hier hiesse sie etwas anderes.
   * Solange am Konto genau dieser Beschluss steht, gilt auf diesem Weg die
   * eigene Zahl des Standes (`startAngewandt`). Ein neuer Beschluss der
   * Lehrkraft (anderer Zeitpunkt) gilt wieder normal. Geschrieben NUR über
   * `wegWechsel.ts` (`fortschrittImWeg`), gelesen über `startpunktImWeg`.
   */
  startpunktFremd?: { units: number; am: number };
  /**
   * ★★★★★ EINE TASTE, DIE EIN KLASSENMATCH VERDIENT HAT - UND DIE NOCH WARTET
   * (02.10.2026, Johannes: *„ein match darf eine neue taste für nach dem match
   * freischalten aber nie während dem match! nach dem abschluss, wenn es
   * wieder in mein training geht kommt die meldung der neuen taste!"*).
   *
   * Befund Arda (CSS6): Das Match schaltete das R am Ende SOFORT in
   * `introduced` - die Spiele danach (Pinguinspiel, Polarstation, Höhle) nehmen
   * `introduced` und fragten ein R ab, das das Kind nie kennengelernt hatte.
   * Darum steht die Entscheidung des Matchs HIER und nicht in `introduced`:
   * Bis das Kind seine Taste im Training vorgestellt bekommen hat, kennt sie
   * KEIN Spiel, kein Wortspiel und kein Match-Text (alle lesen nur
   * `introduced`) - dieses Feld zählt nirgends als gelernt.
   *
   * ★ Gewählt ist die LISTE der Einheiten (nicht nur ein Zeitstempel):
   *  (1) Die Entscheidung des Matchs gilt - der Trainer würfelt `canAdvance`
   *      nicht neu, er übernimmt, was das Match entschieden hat (auch ein Paar
   *      wie ¿ mit ?).
   *  (2) Er kann prüfen, ob die Vormerkung noch passt: Ist das Kind
   *      inzwischen anders weiter (Startpunkt der Lehrkraft, Weg gewechselt),
   *      stimmt die Taste nicht mehr mit der nächsten überein und die
   *      Vormerkung wird still verworfen.
   * `ts` ist nur der Zeitpunkt des Matchs (zur Nachvollziehbarkeit); der
   * Freischalt-Zeitstempel (`introducedAt`) entsteht erst bei der Vorstellung.
   *
   * Additiv und optional - kein neues Server-Feld, es reist im Fortschritts-
   * Blob. Gelöscht wird es von `loeseVormerkungEin` (tastenfreischaltung.ts),
   * sobald das Kind in „Mein Training" (oder nach einer Serien-Etappe) kommt.
   */
  freischaltungAusMatch?: { einheiten: string[]; ts: number };
  /**
   * Runden seit der letzten neuen Taste. Grundlage der Geduld-Regel
   * ({@link GEDULD_SPANNE}): Das Tor gleitet über 40 Runden von voller Strenge
   * auf ganz offen, damit kein Kind ewig ohne neue Taste bleibt. Wird bei jeder
   * Freischaltung auf 0 zurückgesetzt — wer gut vorankommt, merkt nie etwas davon.
   */
  rundenOhneTaste?: number;
  /**
   * Gleitendes Mittel des bisher üblichen Rundentempos (Anschläge/Min). Grundlage
   * für das persönliche, mitwachsende Tempo-Ziel der Sterne (siehe stars.ts).
   * Optional — fehlt bei neuen/alten Ständen (dann zählt erst das Stufen-Ziel).
   */
  speedEma?: number;
  /**
   * Aktuelle Leistungsstufe (1..50, siehe level.ts) — passt sich automatisch an.
   * Optional; fehlt, leitet sich der Start aus der Anforderungs-Wahl ab.
   */
  level?: number;
  /**
   * Verlauf der abgeschlossenen Runden (gekappt). Grundlage für die automatische
   * Stufen-Anpassung UND die Steigerungs-Statistik. Optional für Altstände.
   */
  rounds?: RoundResult[];
  /**
   * Anfangs-Kalibrierung: gesammelte saubere Tempi (Anschläge/Min), aus denen
   * sich die Leistungsstufe einpendelt (siehe `calibrateFromSpeeds`). Gefüllt in
   * der ersten Runde nach jeder Zeile, danach je Runde. Optional.
   */
  calSpeeds?: number[];
  /**
   * Ist die Anfangs-Kalibrierung eingependelt? Dann übernimmt das gedämpfte
   * 5-Runden-Fenster (`adaptLevel`). Solange falsch/leer, läuft die feinkörnige
   * Kalibrierung. Optional (fehlt = noch am Kalibrieren).
   */
  calibrated?: boolean;
  /**
   * NEU (Resume): zuletzt geübter Modus. Additiv, nie required — Altstände
   * ohne dieses Feld starten wie bisher bei "adaptiv".
   *
   * ★ E7 (19.09.2026): „lektionen" ist als ÜBUNGSART (`TrainerMode`,
   * `trainerMode.ts`) entfallen, steht hier aber WEITER in der Typisierung -
   * ein Altstand kann diesen Wert wörtlich noch tragen (nichts schreibt ihn
   * mehr, aber niemand hat ihn aus alten Datensätzen entfernt). Wer dieses
   * Feld liest, muss ihn auf einen gültigen `TrainerMode` zurückführen
   * (`TippenTrainerPage.tsx` tut das beim Wiederherstellen); `lessonId` ist
   * aus demselben Grund nur noch für ALTE Datensätze da - seit dem
   * Wegfall von `TypingTrainer.tsx` schreibt niemand mehr hinein.
   */
  lastPlace?: {
    mode: "adaptiv" | "lektionen" | "buecherei" | "wortspiele";
    /** @deprecated Nur noch für alte Datensätze - seit E7 (19.09.2026) schreibt niemand mehr hinein. */
    lessonId?: string;
    /**
     * NEU (21.07.): die zuletzt geöffnete Serie der Bücherei. Damit bietet die
     * Bücherei beim nächsten Besuch ganz oben „Weiter: <Titel>" an, statt das
     * Kind die Geschichte in der Liste wiedersuchen zu lassen. Additiv/optional.
     */
    serieSlug?: string;
  };
  /**
   * NEU (Abzeichen): verdiente Abzeichen (id → Verdien-Zeitstempel) und die
   * Lebenszeit-Zähler dahinter (siehe badges.ts). Beides additiv/optional —
   * Altstände bekommen beim ersten Rundenende eine Saat aus dem Verlauf.
   * Der Typ des Tallys liegt in badges.ts; hier bewusst strukturell (kein
   * Import), damit progress.ts frei von Zyklen bleibt.
   */
  badges?: Record<string, number>;
  badgeTally?: {
    rounds: number;
    perfect: number;
    cleanStreak: number;
    bestCleanStreak: number;
    stars3: number;
    days: number;
    lastDay?: string;
    lastStars?: number;
    /** Freie Eisschollen-Abenteuer (siehe badges.recordAdventure) — additiv. */
    adventures?: number;
    cleanAdventures?: number;
    fishCaught?: number;
    /** Bücherei (siehe badges.recordStoryEtappe) — additiv. */
    etappen?: number;
    storiesDone?: number;
    lastStoryDay?: string;
    storyDayCount?: number;
    /**
     * Abzeichen-Ausbau 09.08.2026 (siehe badges.ts): Katalog-Fassung für den
     * stillen Nachtrag, fehlerfreie Ketten, Übungswochen, Prüfungslauf der
     * 10-Minuten-Abschrift und die kleinen Merker der Geheim-Abzeichen.
     * Wie alles hier: additiv/optional — Altstände laufen unverändert weiter.
     */
    catalog?: number;
    cleanRun?: number;
    bestCleanRun?: number;
    weeks?: number;
    lastWeek?: string;
    lastRoundTs?: number;
    lastPerfect?: boolean;
    satDone?: boolean;
    sunDone?: boolean;
    examMs?: number;
    examKeys?: number;
    examErrors?: number;
    /**
     * Zweite Geheim-Charge (09.08.2026): Tages- und Wochen-Zähler, die erste je
     * gesehene Leistungsstufe, die einmal hakenden Tasten und die schon geübten
     * Sprachen. Ebenfalls durchweg optional.
     */
    dayRounds?: number;
    dayPerfect?: number;
    dayStars3?: number;
    weekDays?: number;
    firstLevel?: number;
    struggled?: string;
    langs?: string;
  };
  /**
   * NEU (Textwelt / No-Repeat-Ledger, TW-E1): kompaktes Bitset (base64-kodiert)
   * der bereits getippten Baustein-Indizes gegen das Content-Manifest
   * (siehe ledger.ts). Additiv/optional — Altstände ohne dieses Feld haben nichts
   * „gesehen" und starten mit vollem Vorrat. Verbucht wird erst ab TW-E2.
   */
  seenBausteine?: string;
  /**
   * NEU (Textwelt, TW-E1): Fortschritt je Geschichten-/Wissens-Serie
   * (`slug → { etappe, done }`, siehe serie.ts/ledger.ts). Strikt linear, jede
   * Etappe genau einmal. Additiv/optional.
   */
  storyProgress?: Record<
    string,
    { etappe: number; done?: boolean; line?: number }
  >;
  /**
   * „Eigene Übung" (17.09.2026): je zugewiesenem Text (Schlüssel = seine Id in
   * `tt_eigene_texte`) die Zeile, an der DIESES Kind zuletzt stand, und ob es
   * einmal ganz durch ist. `fertig: true` schaltet die Übung für dieses Kind
   * ab - unabhängig vom Stand der Klasse (siehe `useEigeneUebung`). Additiv/
   * optional, dieselbe Bauart wie `storyProgress`.
   *
   * `angekuendigt` (Z1, 19.09.2026): Das Fenster „Weiter geht es mit einer
   * Übung von deiner Lehrkraft" wurde für diesen Text schon bestätigt. Bis
   * dahin stand das am GERÄT (`localStorage`, ein Wert für alle Konten) - auf
   * einem Klassen-Rechner, an dem sich Kinder nacheinander anmelden, bekam
   * dann nur das erste Kind das Fenster. Jetzt je Kind, am Konto.
   * Alle drei Werte wachsen nur (`zeile` nie zurück, `fertig`/`angekuendigt`
   * nie wieder `false`) - siehe `vereinigeTextStand` in `useEigeneUebung.ts`.
   */
  customTextProgress?: Record<string, { zeile: number; fertig?: boolean; angekuendigt?: boolean }>;
  /**
   * NEU (Textwelt, TW-E1): Manifest-Version, gegen die `seenBausteine` gilt.
   * Ändert sich die Version, kann das Ledger sauber behandelt werden. Optional.
   */
  manifestVersion?: number;
  /**
   * NEU (27.07., Prüfbericht Teil 0 Punkt 2): Anzahl der Manifest-IDs zum
   * Zeitpunkt des Speicherns. Erlaubt die PRÄFIX-VALIDIERUNG des Ledgers
   * (`seenLedgerValid` in corpusManifest.ts): Wurde der Inhalt seither nur
   * HINTEN erweitert (append-only Deploy), bleibt `seenBausteine` gültig und
   * wird behalten — statt bei jedem Inhalts-Deploy komplett zurückgesetzt.
   * Additiv/optional — Altstände ohne dieses Feld verhalten sich wie bisher
   * (Reset bei jeder Versions-Änderung).
   */
  seenManifestCount?: number;
  /**
   * NEU (Text-Nachschub, TN-E1): Gesamtzahl abgeschlossener Übungsrunden —
   * die Zeitachse der Themenstrang-Fälligkeit (arcs.ts: Mindestabstand in
   * Runden zwischen zwei Arc-Schritten). Hochgezählt ab TN-E2. Additiv/optional.
   */
  roundsTotal?: number;
  /**
   * NEU (Text-Nachschub, TN-E1): Fortschritt je Themenstrang
   * (`arcId → { step, lastRound }`, siehe arcs.ts). Additiv/optional.
   */
  arcProgress?: Record<string, { step: number; lastRound: number }>;
  /**
   * NEU (02.09.2026, Übungsformen): die REIHUM-Zählung der Angebote auf der
   * Abschluss-Karte - welche Übungsform (und die Geschichte) zuletzt wann dran
   * war. Siehe `uebungsformen/reihum.ts`. Additiv/optional; ein Altstand ohne
   * dieses Feld fängt einfach vorne an.
   *
   * Bewusst strukturell und ohne Import, damit progress.ts zyklenfrei bleibt -
   * dieselbe Regel wie beim Abzeichen-Tally darüber.
   */
  formStand?: { naechste: number; zuletzt: Record<string, number> };
  /**
   * ★ E1 (24.09.2026) - KOPIE des Lernwegs (Bauplan englischer Lehrgang §2.2):
   * das Netz für Gäste, Offline und den Mock. Die Wahrheit steht am Konto
   * (`TypingAccount.lernweg`); fehlt beides, gilt „de". Gelesen über
   * `lernwegVon(p)`. Strukturell getippt (kein Import), damit progress.ts
   * zyklenfrei bleibt - dieselbe Regel wie bei `formStand`.
   *
   * ★ E2a (25.09.2026, Gerüst französischer Lehrgang): „fr" dazu (Bauplan
   * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §14 E2).
   *
   * ★ ES-F2 (27.09.2026, Gerüst spanischer Lehrgang): „es" dazu, aus
   * demselben Grund (Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §9 ES-F2).
   */
  // ★ G2-NEUN (25.10.2026): die neun Wege des Gerüsts dazu (strukturell, wie oben).
  lernweg?: "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";
  /**
   * ★ W2b (28.09.2026, Weg je Kind): die GEPARKTEN Stände anderer Lernwege.
   * Stellt die Lehrkraft den Weg eines Kindes um, bleibt der bisherige Stand
   * hier unter seinem Weg liegen und kommt zurück, wenn wieder auf ihn
   * gestellt wird - nichts wird gelöscht. Geschrieben und gelesen NUR über
   * `wegWechsel.ts` (`fortschrittImWeg`). Strukturell getippt (kein Import),
   * damit progress.ts zyklenfrei bleibt - dieselbe Regel wie bei `formStand`.
   */
  wegStaende?: Partial<
    Record<
      "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk",
      Omit<TypingProgress, "wegStaende">
    >
  >;
}

const STORAGE_KEY = "tippen-trainer:v1";
const XP_PER_PLAYER_LEVEL = 100;
/** So viele Runden bleiben im Verlauf erhalten (für Anpassung + Steigerung). */
export const MAX_ROUNDS = 150;

export function emptyProgress(): TypingProgress {
  return { xp: 0, lessons: {}, letters: {} };
}

/**
 * Aktuelle Leistungsstufe eines Spielstands. Liegt keine vor (neues Konto),
 * ergibt sie sich aus der Anforderungs-Wahl der Lehrkraft (`tempo`).
 */
export function currentLevel(p: TypingProgress, tempo?: TempoLevel): number {
  if (typeof p.level === "number" && Number.isFinite(p.level))
    return Math.max(1, Math.min(LEVEL_MAX, Math.round(p.level)));
  return startLevelForTempo(tempo);
}

/**
 * Eine saubere EINZEL-Messung (eine Zeile in der ersten Runde) in die Anfangs-
 * Kalibrierung geben und die Leistungsstufe sofort nachziehen. So pendelt sich
 * die Stufe schon WÄHREND der ersten Runde ans gezeigte Tempo ein, statt erst am
 * Rundenende. Unsaubere/ungemessene Zeilen ändern nichts (gleiche Referenz
 * zurück). Nach dem Einpendeln (`calibrated`) passiert nichts mehr.
 */
export function recordCalibrationSample(
  p: TypingProgress,
  acc: number,
  cpm: number,
  playedLevel: number,
): TypingProgress {
  if (p.calibrated) return p;
  if (!(cpm > 0 && acc >= CLEAN_ACC)) return p; // nur saubere, gemessene Zeilen
  const calSpeeds = [...(p.calSpeeds ?? []), cpm].slice(-CAL_WINDOW);
  const c = calibrateFromSpeeds(playedLevel, calSpeeds);
  return {
    ...p,
    calSpeeds,
    level: c.level,
    calibrated: c.settled ? true : p.calibrated,
  };
}

/**
 * Eine abgeschlossene Runde in den Verlauf eintragen und die Leistungsstufe
 * automatisch nachführen. Gibt den neuen Spielstand und zurück, ob eine Stufe
 * dazukam (für Sound + Glückwunsch). `playedLevel` ist die Stufe, auf der die
 * Runde lief (= currentLevel VOR der Runde).
 *
 * Zwei Phasen: Solange die Anfangs-Kalibrierung noch nicht eingependelt ist
 * (`calibrated` ungesetzt), zieht eine saubere Runde die Stufe direkt aufs
 * gezeigte Tempo (feinkörnig, schnell). Danach übernimmt die gedämpfte
 * 5-Runden-Fenster-Anpassung ({@link adaptLevel}).
 */
export function recordRound(
  p: TypingProgress,
  result: { acc: number; cpm: number; stars: number },
  playedLevel: number,
  now: number,
  /**
   * „Zeit lassen" (Eigenschaft des Kindes, 14.08.2026): Dann bleibt die
   * Leistungsstufe, wo sie ist — weder Kalibrierung noch Auf-/Abstieg, denn
   * beide urteilen über das Tempo. Die Runde selbst wird ganz normal in den
   * Verlauf geschrieben (die Steigerungs-Statistik lebt weiter).
   */
  zeitLassen = false,
): { progress: TypingProgress; leveledUp: boolean; prevLevel: number; newLevel: number } {
  const round: RoundResult = {
    ts: now,
    acc: result.acc,
    cpm: result.cpm,
    stars: result.stars,
    level: playedLevel,
  };
  const rounds = [...(p.rounds ?? []), round].slice(-MAX_ROUNDS);

  let newLevel: number;
  let calSpeeds = p.calSpeeds;
  let calibrated = p.calibrated;
  if (zeitLassen) {
    newLevel = playedLevel;
  } else if (!calibrated) {
    // Kalibrierungs-Phase: saubere Runde fließt ins Tempo-Mittel, Stufe pendelt
    // sich ein; danach erst greift das gedämpfte Fenster.
    if (result.cpm > 0 && result.acc >= CLEAN_ACC)
      calSpeeds = [...(p.calSpeeds ?? []), result.cpm].slice(-CAL_WINDOW);
    const c = calibrateFromSpeeds(playedLevel, calSpeeds ?? []);
    newLevel = c.level;
    calibrated = c.settled ? true : p.calibrated;
  } else {
    newLevel = adaptLevel(playedLevel, rounds);
  }

  return {
    progress: { ...p, rounds, level: newLevel, calSpeeds, calibrated },
    leveledUp: newLevel > playedLevel,
    prevLevel: playedLevel,
    newLevel,
  };
}

export function loadProgress(): TypingProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const data = JSON.parse(raw) as Partial<TypingProgress>;
    return {
      xp: typeof data.xp === "number" ? data.xp : 0,
      lessons: data.lessons ?? {},
      letters: data.letters ?? {},
      introduced: data.introduced,
      // Whitelist-Falle: was hier fehlt, geht anonymen (localStorage-)Ständen
      // beim Neuladen verloren — dieselbe Falle wie beim Ledger weiter unten.
      introducedAt:
        data.introducedAt && typeof data.introducedAt === "object"
          ? data.introducedAt
          : undefined,
      // Startpunkt-Vermerk (04.09.2026): dieselbe Whitelist-Falle. Fehlt er
      // hier, hielte ein Zurückstufen auf diesem Gerät nur bis zum Neuladen -
      // und käme danach als „neuer Beschluss" ein zweites Mal.
      startAngewandt:
        typeof data.startAngewandt === "number" ? data.startAngewandt : undefined,
      startAngewandtAm:
        typeof data.startAngewandtAm === "number" ? data.startAngewandtAm : undefined,
      startpunktFremd:
        data.startpunktFremd && typeof data.startpunktFremd === "object"
          ? data.startpunktFremd
          : undefined,
      rundenOhneTaste:
        typeof data.rundenOhneTaste === "number" ? data.rundenOhneTaste : undefined,
      // Vormerkung aus dem Klassenmatch (02.10.2026): dieselbe Whitelist-Falle.
      freischaltungAusMatch:
        data.freischaltungAusMatch &&
        Array.isArray(data.freischaltungAusMatch.einheiten) &&
        typeof data.freischaltungAusMatch.ts === "number"
          ? data.freischaltungAusMatch
          : undefined,
      speedEma: typeof data.speedEma === "number" ? data.speedEma : undefined,
      level: typeof data.level === "number" ? data.level : undefined,
      rounds: Array.isArray(data.rounds) ? data.rounds : undefined,
      calSpeeds: Array.isArray(data.calSpeeds) ? data.calSpeeds : undefined,
      calibrated: typeof data.calibrated === "boolean" ? data.calibrated : undefined,
      lastPlace: data.lastPlace,
      badges: data.badges,
      badgeTally: data.badgeTally,
      // Textwelt (TW-E1/E2/E3): additive Ledger-/Serien-Felder MÜSSEN durchgereicht
      // werden — sonst ginge für anonyme (localStorage-)Nutzer das No-Repeat-Ledger
      // UND der Serien-Fortschritt beim Neuladen verloren (Resume-Bruch, TW-E3).
      // Kontogebundene Stände speichern den ganzen Blob ohnehin (pbBackend `data`).
      seenBausteine:
        typeof data.seenBausteine === "string" ? data.seenBausteine : undefined,
      storyProgress:
        data.storyProgress && typeof data.storyProgress === "object"
          ? data.storyProgress
          : undefined,
      // „Eigene Übung" (17.09.2026): dieselbe Whitelist-Falle - fehlt das Feld
      // hier, fängt ein anonymer Stand nach jedem Neuladen wieder bei Zeile 0
      // an UND ein bereits fertiges Kind bliebe im Pflichtbildschirm hängen.
      customTextProgress:
        data.customTextProgress && typeof data.customTextProgress === "object"
          ? data.customTextProgress
          : undefined,
      manifestVersion:
        typeof data.manifestVersion === "number" ? data.manifestVersion : undefined,
      seenManifestCount:
        typeof data.seenManifestCount === "number"
          ? data.seenManifestCount
          : undefined,
      // Text-Nachschub (TN-E1): Arc-Felder ebenso durchreichen — gleiche Falle
      // wie beim Ledger (anonyme Nutzer verlören sonst den Strang-Fortschritt).
      roundsTotal:
        typeof data.roundsTotal === "number" ? data.roundsTotal : undefined,
      arcProgress:
        data.arcProgress && typeof data.arcProgress === "object"
          ? data.arcProgress
          : undefined,
      // Übungsformen (02.09.2026): dieselbe Whitelist-Falle wie oben - fehlt das
      // Feld hier, verliert ein anonymer Stand beim Neuladen seine Reihum-Zählung
      // und bekommt dieselbe Form wieder und wieder.
      formStand:
        data.formStand && typeof data.formStand === "object"
          ? data.formStand
          : undefined,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: TypingProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* localStorage nicht verfügbar — Spielstand bleibt nur in dieser Sitzung */
  }
}

/** Spieler-Stufe + Fortschritt zur nächsten Stufe aus der Gesamt-XP. */
export function playerLevel(xp: number): {
  level: number;
  into: number;
  need: number;
} {
  const level = Math.floor(xp / XP_PER_PLAYER_LEVEL) + 1;
  const into = xp % XP_PER_PLAYER_LEVEL;
  return { level, into, need: XP_PER_PLAYER_LEVEL };
}

/** Erste Lektion immer offen, sonst sobald die vorige fertig ist. */

