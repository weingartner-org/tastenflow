/**
 * Abzeichen (Badges) des Tipptrainers „Tastenflow" — das Motivations-System.
 *
 * Gestaltungs-Grundsätze (aus dem Vergleich mit TypingClub, Typing.com, Typing
 * Pal, Duolingo, Khan Academy und Nitro Type, Recherche 2026-07-07):
 *   • WENIGE FAMILIEN mit Steigerungs-Stufen statt einer Badge-Flut — jede
 *     Familie hat ein klares „nächstes Ziel", das sich ansagen lässt
 *     („Noch 3 fehlerfreie Runden bis Null-Fehler-Ninja").
 *   • TREFFSICHERHEIT IST DIE KÖNIGSDISZIPLIN: zwei eigene Genauigkeits-Familien
 *     (fehlerfreie Runden + saubere Serien); das EINZIGE Tempo-Abzeichen setzt
 *     95 % Treffsicherheit voraus (Ratatype-Prinzip: Tempo zählt nur sauber).
 *     Khan Academy hat reine Tempo-Abzeichen 2020 sogar ganz abgeschafft.
 *   • KEIN DRUCK: Tage-Abzeichen zählen nur AUFWÄRTS (kein Serien-Verlust, keine
 *     Rangliste); auch das langsamste Kind erreicht jede Familie.
 *   • GEHEIM-ABZEICHEN (Khan-„???"-Prinzip) als Überraschung und Gesprächsstoff —
 *     darunter das „Gemütliche Faultier": langsam, aber fehlerfrei. Genauigkeit
 *     schlägt Tempo, sogar als Auszeichnung.
 *
 * ── AUSBAU 09.08.2026: von 52 auf 116 Abzeichen ─────────────────────────────
 *
 * Anlass (Johannes): „Jano hat 32 von 50 Abzeichen und kann noch nicht einmal
 * alle Buchstaben." Die Messung gab ihm recht — der Lernweg hat 73 Einheiten,
 * und auf den letzten 42 davon (Satzzeichen, Ziffern, 25 Sonderzeichen = 58 %
 * des Weges) hing GENAU EIN Abzeichen. Wer die Anfangs-Ernte eingefahren hatte,
 * lief monatelang durch eine Wüste. Fünf neue Achsen füllen sie:
 *
 *   1. **Tastenwelt** — welche Zeichen sind erobert? Folgt dem Lernweg bis zum
 *      letzten Sonderzeichen (11 Abzeichen, acht davon in der früheren Wüste).
 *   2. **Sitzt!** — Qualität statt Menge: eine ganze Zeichengruppe sitzt.
 *   3. **Tempo** — die echten Schulnormen als Treppe (60 · 90 · 120 · 160 ·
 *      200 · 300 Anschläge/min), jede mit Genauigkeits-Tor. ⚠️ Johannes hat sich
 *      am 09.08. bewusst für ABSOLUTE Zahlen entschieden (statt „dein Ziel um
 *      die Hälfte übertroffen"): Sie sind vergleichbar mit dem, was Schule und
 *      Wettbewerb verlangen — die obersten Stufen sind damit für ein Kind mit
 *      starker motorischer Einschränkung bewusst nicht erreichbar. Das ist die
 *      EINZIGE Familie, für die das gilt.
 *   4. **Am Stück** — fehlerfreie Anschlagsketten ÜBER Runden hinweg
 *      (100 … 2000). Eine späte Runde hat ~516 Anschläge; „500 am Stück" sind
 *      also ein bis zwei Runden ohne einen einzigen Ausrutscher.
 *   5. **Meisterprüfung** — 10-Minuten-Abschrift (≤ 0,5 % Fehler, die klassische
 *      Schulprüfung), Lehrgangs-Meister, goldene Tastatur.
 *
 * Dazu **20 GEHEIM-Abzeichen** (Wunsch Johannes, zweite Charge am selben Abend:
 * „geheime Abzeichen sind super, da darf es ruhig 20 geheime geben"). Sie sind
 * bewusst so gewählt, dass sie beim normalen Üben nebenbei passieren — niemand
 * muss sie jagen, und keines verlangt etwas, das ein Kind nicht ohnehin täte.
 *
 * ★★ **KEIN Abzeichen darf an einem der beiden Lernwege hängen.** Gemessen wird
 * immer der Lernstand (Tasten, Sitzen, Tempo, Fleiß) — nie der Weg dorthin. Bis
 * 09.08. verstieß die Familie „Lektionen" dagegen (sie hing an
 * `lessons[…].completed`, das nur der Lektionen-Weg schreibt); seither zählt
 * `lessonsDoneCount` eine Lektion auch dann, wenn ihre Tasten in „Mein Training"
 * freigeschaltet und gelernt sind. Ein Wächter-Test sichert die Regel.
 *
 * ★ **Stiller Nachtrag** (Entscheidung Johannes 09.08.): Bestehende Kinder haben
 * viele der neuen Abzeichen längst verdient. Sie werden EINMALIG ohne Klang und
 * ohne Ansage nachgetragen ({@link CATALOG_VERSION}) — sonst ratterte eine
 * Minute lang der „Ta-daa".
 *
 * Verdiente Abzeichen liegen im Spielstand (`progress.badges`: id → Zeitstempel)
 * und wandern damit automatisch mit (Server-Konto ODER lokal). Die Zähler, die
 * über den gekappten Runden-Verlauf hinausreichen (Lebenszeit-Werte), führt
 * `progress.badgeTally` mit. Beides additiv/optional — Altstände starten leer
 * und bekommen beim ersten Rundenende eine Best-Effort-Saat aus dem Verlauf.
 * Siehe [[project_zehnfinger_trainer]].
 */
import { LESSONS, lektionenFuer, lessonsDoneCount, lessonsWithThreeStars } from "./curriculum";
// ★ E1 (24.09.2026): Abzeichen am Tastenstand rechnen mit dem Weg des Kindes.
import type { Lernweg } from "./lernweg";
import { isoWeekKey } from "./goals";
import type { Skin } from "./skin";
import { usesMascots } from "./skin";
import { levelTargetCpm, LV_STEP2_CPM } from "./level";
import {
  DIGIT_ORDER,
  LETTER_ORDER,
  PUNCT_ORDER,
  SHIFT_UNIT,
  SYMBOL_ORDER,
  introOrder,
  isMastered,
  letterLevel,
  masteryForLevel,
  personalBaseMs,
} from "./letters";
import type { LetterStat, TypingProgress } from "./progress";
import { playerLevel } from "./progress";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenTextEn, type AbzeichenZahlen } from "./badgesEn";
import { ABZEICHEN_FR, ABZEICHEN_GRUPPEN_FR } from "./badgesFr";
import { ABZEICHEN_ES, ABZEICHEN_GRUPPEN_ES } from "./badgesEs";
import { ABZEICHEN_GRUPPEN_IT, ABZEICHEN_IT } from "./badgesIt";
// ★ O-PL (02.10.2026): der polnische Katalog.
import { ABZEICHEN_GRUPPEN_PL, ABZEICHEN_PL } from "./badgesPl";
// ★ O-TR (02.10.2026): der türkische Katalog.
import { ABZEICHEN_GRUPPEN_TR, ABZEICHEN_TR } from "./badgesTr";
// ★ O-CS (03.10.2026): der tschechische Katalog.
import { ABZEICHEN_CS, ABZEICHEN_GRUPPEN_CS } from "./badgesCs";
// ★ G3c-VERTEILER (25.10.2026): die Abzeichen der neun Gerüst-Sprachen (`badges<Xx>.ts`, heute leer ⇒ englisch).
import { ABZEICHEN_BG, ABZEICHEN_GRUPPEN_BG } from "./badgesBg";
import { ABZEICHEN_EL, ABZEICHEN_GRUPPEN_EL } from "./badgesEl";
import { ABZEICHEN_HU, ABZEICHEN_GRUPPEN_HU } from "./badgesHu";
import { ABZEICHEN_NL, ABZEICHEN_GRUPPEN_NL } from "./badgesNl";
import { ABZEICHEN_PT, ABZEICHEN_GRUPPEN_PT } from "./badgesPt";
import { ABZEICHEN_BR, ABZEICHEN_GRUPPEN_BR } from "./badgesBr";
import { ABZEICHEN_RO, ABZEICHEN_GRUPPEN_RO } from "./badgesRo";
import { ABZEICHEN_SV, ABZEICHEN_GRUPPEN_SV } from "./badgesSv";
import { ABZEICHEN_UK, ABZEICHEN_GRUPPEN_UK } from "./badgesUk";
import { eintraegeOderEn } from "./geruestRueckfall";
import type { BedienSprache } from "../bedienSprache/sprache";
import { ABZEICHEN_NUR_FR, ABZEICHEN_NUR_FR_EINHEITEN } from "./badgesNurFr";
import { mitRueckfallEn } from "@/lib/typing/sprachRegister";

// --- Definitionen -------------------------------------------------------------

export interface BadgeDef {
  id: string;
  /**
   * Emoji — rein dekorativ (aria-hidden); Screenreader hören den Namen.
   *
   * ★★ SEIT 22.08.2026 IST DAS AUCH DER SCHLÜSSEL ZUM MEDAILLEN-BILD. Die
   * Medaille zeigt kein System-Emoji mehr, sondern ein festes Bild aus dem
   * Motivpool ([[src/lib/abzeichen/motivpool]], Fluent Emoji, MIT); den
   * Dateinamen leitet `motivCode()` aus GENAU DIESEM Zeichen ab. Es gibt
   * bewusst kein zweites Feld mit Codepoints — eine zweite Wahrheit über
   * dasselbe Motiv wäre beim nächsten neuen Abzeichen falsch, ohne dass es
   * jemandem auffiele.
   *
   * ⚠️ Wer hier ein Emoji ÄNDERT oder ein neues Abzeichen anlegt, muss ein
   * Zeichen wählen, zu dem es im Pool ein Bild gibt, und eines, das noch kein
   * anderes Abzeichen trägt (Regel Johannes: jedes Motiv plattformweit nur
   * einmal). Beides bewacht `tests/abzeichen-motivpool.test.ts`; freie Motive
   * findet `sucheFreieMotive("owl")`.
   */
  emoji: string;
  /**
   * Das MOTIV IN WORTEN, für die Sprachausgabe: „ein Ninja", „eine Zielscheibe
   * mit einem Pfeil in der Mitte". Nur der Bildinhalt — Metall und Bandfarbe
   * setzt `medaillenBeschreibung()` in [[BadgeMedal]] automatisch davor, damit
   * eine geänderte Metallstufe nicht 116 Sätze zu Lügnern macht.
   *
   * WARUM (22.08.2026): Die Medaille ist `aria-hidden` — für ein Kind mit
   * Blindheit gab es sie schlicht nicht. Ein sehendes Kind daneben sieht einen
   * Ninja und redet darüber. Der Satz gehört in den sr-only-Text hinter Name
   * und Bedingung, damit beide über dasselbe reden können.
   *
   * ⚠️ Kurz halten: Zusammen mit Metall und Band muss der ganze Satz unter
   * 120 Zeichen bleiben (Wächter in `tests/typing-badge-medaille.test.tsx`) —
   * auf einer Braillezeile ist jedes Zeichen kostbar.
   */
  bildbeschreibung: string;
  /** Lustiger Anzeige-Name (auch gesprochen — muss laut vorgelesen funktionieren). */
  name: string;
  /**
   * Trockener Zweitname für die Jugend- und Erwachsenen-Tonlage (Weiche 3,
   * Johannes 29.07.2026): Maskottchen-Namen („Präzisions-Pinguin") sehen nur
   * Kinder; ab 11 erscheint der neutrale Name („Dreimal sauber"). Die ID —
   * und damit jedes verdiente Abzeichen — bleibt unverändert. Fehlt der
   * Zweitname, gilt der Name für alle (idiomatische Namen wie
   * „Gewohnheitstier" oder „Nachteule" funktionieren in jeder Tonlage).
   */
  nameNeutral?: string;
  /**
   * Beschreibung OHNE direkte Anrede — gilt unverändert für das Kinder-Profil
   * (Du) und das Erwachsenen-Profil (Sie). [[feedback_du_ansprache]]
   */
  description: string;
  /** Anzeige-Gruppe der Galerie (Familien bleiben beieinander). */
  group: string;
  /** Geheim: vor dem Verdienen erscheint nur „???" (Überraschungs-Prinzip). */
  secret?: boolean;
}

/** Schwellen der Steigerungs-Familien (bewusst hier gebündelt, leicht tunbar). */
export const PERFECT_TIERS = [1, 5, 15, 40, 80, 150] as const; // fehlerfreie Runden
export const STREAK_TIERS = [3, 7, 15, 25] as const; // saubere Runden IN FOLGE (≥ CLEAN_ROUND_ACC)
export const ROUNDS_TIERS = [1, 25, 100, 250, 500, 1000] as const; // Runden gesamt
export const HITS_TIERS = [1000, 10000, 50000, 100000, 250000] as const; // richtige Anschläge (Lebenszeit)
export const DAYS_TIERS = [3, 7, 20, 50, 100, 200] as const; // verschiedene Übungstage
export const STARS3_TIERS = [1, 10, 30, 75] as const; // 3-Sterne-Runden
export const LESSON_TIERS = [5, 15, LESSONS.length] as const; // geübte Lektionen (Weg „de")

/**
 * ★ E8 (24.09.2026, Bauplan §7): dieselben drei Sprossen (5, 15, alle) - aber
 * die dritte zählt die Lektionen DES WEGES, nicht immer die deutschen 27. Weg
 * „en" hat nur 19 (`lektionenFuer`) - ohne diese Funktion bliebe „Lehrgangs-
 * Legende" auf Weg „en" für immer unerreichbar (`lessonsDoneCount` zählt dort
 * nie höher als 19). `LESSON_TIERS` bleibt unverändert stehen, für Weg „de"
 * identisch mit dieser Funktion.
 */
export function lessonTiersFor(lernweg: Lernweg): readonly number[] {
  return [5, 15, lektionenFuer(lernweg).length];
}
export const XP_LEVEL_TIERS = [5, 10, 20, 50, 100, 200] as const; // Spielstufe (XP)
export const ADVENTURE_TIERS = [1, 10, 30, 60] as const; // freie Eisschollen-Abenteuer
export const STORY_TIERS = [1, 3, 8, 15] as const; // ganz zu Ende gelesene Geschichten
export const ETAPPE_TIERS = [1, 10, 30, 75] as const; // gelesene Geschichten-Etappen
/** Übungs-WOCHEN (Kalenderwochen mit mindestens einem Übungstag). */
export const WEEK_TIERS = [12, 26, 52] as const;
/** „Am Stück": längste fehlerfreie Anschlagskette (über Runden hinweg). */
export const CHAIN_TIERS = [100, 250, 500, 1000, 2000] as const;
/** „Fischfänger": so viele Bonus-Fische (kumulativ über alle Abenteuer). */
export const FISH_NEED = 15;
/** „Immer trocken": so viele Abenteuer ganz ohne Plumpsen. */
export const CLEAN_ADVENTURE_NEED = 10;

/**
 * Die Tempo-Treppe — ABSOLUTE Anschlagszahlen nach echten Normen (Entscheidung
 * Johannes 09.08.2026, siehe Dateikopf). Jede Stufe verlangt Tempo UND
 * Treffsicherheit in derselben Runde; nach oben wird das Genauigkeits-Tor
 * strenger, damit „schnell" nie ohne „sauber" zu haben ist.
 *
 * Woher die Zahlen kommen (Recherche 09.08.2026):
 *   •  60 — Bundesjugendschreiben, bestandene Mindestleistung (bei ≤ 0,5 % Fehlern)
 *   •  90 — Ende 7. Schulstufe (700 Anschläge in 10 min ≈ 70/min) mit Luft nach oben
 *   • 120 — Bayern, LehrplanPLUS Tastschreiben
 *   • 160 — Österreich, Lehrplan Maschinschreiben (Netto-Anschläge)
 *   • 200 — unteres Ende „regulärer 10-Finger-Schreiber" (200–400)
 *   • 300 — Profi-Niveau (Wettbewerbe gehen bis 750)
 * Zum Vergleich: 1 Wort/Minute (WPM) = 5 Anschläge/Minute.
 */
export const SPEED_TIERS = [
  { id: "tempo-60", cpm: 60, acc: 0.95 },
  { id: "tempo-90", cpm: 90, acc: 0.95 },
  { id: "tempo-120", cpm: 120, acc: 0.98 },
  { id: "tempo-160", cpm: 160, acc: 0.98 },
  { id: "tempo-200", cpm: 200, acc: 0.98 },
  { id: "tempo-300", cpm: 300, acc: 0.99 },
] as const;

/**
 * So viele Anschläge muss eine Runde mindestens haben, damit sie für die
 * Tempo-Treppe zählt. Kurze Runden (die Ziffern-Lektion hat gemessen nur ~132
 * Anschläge) würden sonst zufällige Spitzenwerte liefern.
 */
export const SPEED_MIN_KEYS = 150;

/** „Die 10-Minuten-Abschrift": so lange am Stück, mit höchstens so vielen Fehlern. */
export const EXAM_MS = 10 * 60 * 1000;
/** Fehlergrenze der Abschrift: 0,5 % — die Grenze für „ausreichend" im Schul-Schlüssel. */
export const EXAM_MAX_ERROR_RATE = 0.005;
/** Längere Pause als das → der Prüfungslauf beginnt von vorn (kein „am Stück" mehr). */
export const EXAM_GAP_MS = 5 * 60 * 1000;
/** „Zurück im Sattel": nach so langer Pause wieder geübt. */
export const COMEBACK_DAYS = 14;

/**
 * Fassung des Abzeichen-Katalogs. Steigt sie, trägt {@link awardBadges} alles
 * schon Verdiente EINMALIG still nach (kein Klang, keine Ansage) — siehe
 * Dateikopf. Erhöhen, wann immer neue Abzeichen dazukommen, die rückwirkend
 * verdient sein können.
 */
export const CATALOG_VERSION = 2;

/** Ab dieser Treffsicherheit gilt eine Runde als „sauber" (Serien-Familie). */
export const CLEAN_ROUND_ACC = 0.95;
/** „Gemütliches Faultier": fehlerfrei UND langsamer als dieser Anteil des Ziels. */
export const SLOTH_FRAC = 0.6;
/**
 * „Gemütliches Faultier" OHNE Tempo-Ziel (Stufe 1 oder „Zeit lassen"): fehlerfrei
 * und langsamer als dieses feste Tempo (Anschläge/Min).
 *
 * ★ Reparatur 14.08.2026: Das Abzeichen verlangte ein Tempo-Ziel über null und
 * war damit ausgerechnet dort gesperrt, wo das Tempo nicht zählt — das
 * langsame, sorgfältige Kind, für das dieses Abzeichen gedacht ist, konnte es
 * als einziges nie bekommen. Der Maßstab ist jetzt derselbe wie auf der
 * langsamsten gemessenen Stufe: 60 % des Tempo-Ziels von Stufe 2.
 */
export const SLOTH_NO_TARGET_CPM = LV_STEP2_CPM * SLOTH_FRAC;
/** „Flinker Fuchs": Tempo-Ziel erreicht UND mindestens so treffsicher. */
export const FOX_ACC = 0.95;

export const BADGES: BadgeDef[] = [
  // Familie „Fehlerfrei" — die Königsdisziplin: Runden ganz ohne Fehler.
  { id: "volltreffer", emoji: "🎯", bildbeschreibung: "eine Zielscheibe mit einem Pfeil in der Mitte", name: "Volltreffer", group: "Fehlerfrei", description: "Eine ganze Runde ohne einen einzigen Fehler." },
  { id: "null-fehler-ninja", emoji: "🥷", bildbeschreibung: "ein Ninja", name: "Null-Fehler-Ninja", group: "Fehlerfrei", description: "5 Runden ganz ohne Fehler." },
  { id: "makellos-meister", emoji: "✨", bildbeschreibung: "drei funkelnde Sterne", name: "Makellos-Meister", group: "Fehlerfrei", description: "15 Runden ganz ohne Fehler." },
  { id: "diamant-finger", emoji: "💎", bildbeschreibung: "ein blauer Edelstein", name: "Diamant-Finger", group: "Fehlerfrei", description: "40 Runden ganz ohne Fehler." },
  { id: "weisse-weste", emoji: "🕊️", bildbeschreibung: "eine weiße Taube", name: "Weiße Weste", group: "Fehlerfrei", description: "80 Runden ganz ohne Fehler." },
  { id: "einhorn-finger", emoji: "🦄", bildbeschreibung: "ein Einhorn", name: "Einhorn-Finger", nameNeutral: "150 fehlerfreie Runden", group: "Fehlerfrei", description: "150 Runden ganz ohne Fehler." },
  // Familie „Saubere Serie" — Treffsicherheit über mehrere Runden am Stück.
  { id: "praezisions-pinguin", emoji: "🐧", bildbeschreibung: "ein Pinguin", name: "Präzisions-Pinguin", nameNeutral: "Dreimal sauber", group: "Saubere Serie", description: "3 saubere Runden hintereinander (mindestens 95 % Treffsicherheit)." },
  { id: "adlerauge", emoji: "🦅", bildbeschreibung: "ein Adler", name: "Adlerauge", group: "Saubere Serie", description: "7 saubere Runden hintereinander (mindestens 95 % Treffsicherheit)." },
  { id: "laser-lama", emoji: "🦙", bildbeschreibung: "ein Lama", name: "Laser-Lama", nameNeutral: "Lasermodus", group: "Saubere Serie", description: "15 saubere Runden hintereinander (mindestens 95 % Treffsicherheit)." },
  { id: "eiskalte-serie", emoji: "🧊", bildbeschreibung: "ein Eiswürfel", name: "Eiskalte Serie", group: "Saubere Serie", description: "25 saubere Runden hintereinander (mindestens 95 % Treffsicherheit)." },
  // Familie „Fleiß" — Runden gesamt (jede Runde zählt, egal wie sie ausging).
  { id: "tasten-kueken", emoji: "🐣", bildbeschreibung: "ein Küken, das aus dem Ei schlüpft", name: "Tasten-Küken", nameNeutral: "Erste Runde", group: "Fleiß", description: "Die allererste Runde ist geschafft." },
  { id: "ausdauer-ameise", emoji: "🐜", bildbeschreibung: "eine Ameise", name: "Ausdauer-Ameise", nameNeutral: "Warmgelaufen", group: "Fleiß", description: "25 Runden geübt." },
  { id: "marathon-maus", emoji: "🐭", bildbeschreibung: "ein Mäusegesicht", name: "Marathon-Maus", nameNeutral: "Hundert Runden", group: "Fleiß", description: "100 Runden geübt." },
  { id: "munteres-murmeltier", emoji: "🦫", bildbeschreibung: "ein Biber", name: "Munteres Murmeltier", nameNeutral: "Marathon", group: "Fleiß", description: "250 Runden geübt." },
  { id: "dauerlaeufer", emoji: "🏃", bildbeschreibung: "eine laufende Person", name: "Dauerläufer", group: "Fleiß", description: "500 Runden geübt." },
  { id: "tausendsassa", emoji: "🐳", bildbeschreibung: "ein Wal, der Wasser spritzt", name: "Tausendsassa", nameNeutral: "Tausend Runden", group: "Fleiß", description: "1.000 Runden geübt." },
  // Familie „Anschläge" — richtige Anschläge über die ganze Lebenszeit.
  { id: "tausend-tasten-tiger", emoji: "🐯", bildbeschreibung: "ein Tigergesicht", name: "Tausend-Tasten-Tiger", nameNeutral: "Tausend Treffer", group: "Anschläge", description: "1.000 richtige Anschläge." },
  { id: "tasten-t-rex", emoji: "🦖", bildbeschreibung: "ein T-Rex", name: "Tasten-T-Rex", nameNeutral: "Zehntausend Treffer", group: "Anschläge", description: "10.000 richtige Anschläge." },
  { id: "galaktische-fingerspitzen", emoji: "🚀", bildbeschreibung: "eine startende Rakete", name: "Galaktische Fingerspitzen", group: "Anschläge", description: "50.000 richtige Anschläge." },
  { id: "hunderttausend-held", emoji: "⚡", bildbeschreibung: "ein gelber Blitz", name: "Hunderttausend-Held", nameNeutral: "Hunderttausend Treffer", group: "Anschläge", description: "100.000 richtige Anschläge." },
  { id: "viertelmillion", emoji: "🛰️", bildbeschreibung: "ein Satellit", name: "Viertelmillion", group: "Anschläge", description: "250.000 richtige Anschläge - so viel steckt in einem ganzen Buch." },
  // Familie „Dranbleiben" — verschiedene Übungstage (zählt nur aufwärts, kein Verlust).
  { id: "dranbleib-dachs", emoji: "🦡", bildbeschreibung: "ein Dachs", name: "Dranbleib-Dachs", nameNeutral: "Drangeblieben", group: "Dranbleiben", description: "An 3 verschiedenen Tagen geübt." },
  { id: "gewohnheitstier", emoji: "🐢", bildbeschreibung: "eine Schildkröte", name: "Gewohnheitstier", group: "Dranbleiben", description: "An 7 verschiedenen Tagen geübt." },
  { id: "wie-ein-uhrwerk", emoji: "⏰", bildbeschreibung: "ein roter Wecker", name: "Wie ein Uhrwerk", group: "Dranbleiben", description: "An 20 verschiedenen Tagen geübt." },
  { id: "unaufhaltsam", emoji: "🏔️", bildbeschreibung: "ein Berg mit schneebedeckter Spitze", name: "Unaufhaltsam", group: "Dranbleiben", description: "An 50 verschiedenen Tagen geübt." },
  { id: "tief-verwurzelt", emoji: "🌳", bildbeschreibung: "ein grüner Laubbaum", name: "Tief verwurzelt", group: "Dranbleiben", description: "An 100 verschiedenen Tagen geübt." },
  { id: "fels-in-der-brandung", emoji: "🗿", bildbeschreibung: "eine Steinfigur von der Osterinsel", name: "Fels in der Brandung", group: "Dranbleiben", description: "An 200 verschiedenen Tagen geübt - ein ganzes Schuljahr fast Tag für Tag." },
  // Familie „Übungswochen" — Kalenderwochen mit mindestens einem Übungstag. Die
  // einzige Familie, die sich NICHT durch Fleiß an einem Tag abkürzen lässt:
  // Zeit vergeht nun einmal in eigenem Tempo (zählt nur aufwärts, wie die Tage).
  { id: "vierteljahr-dabei", emoji: "🍂", bildbeschreibung: "ein braunes Herbstblatt", name: "Ein Vierteljahr dabei", group: "Übungswochen", description: "In 12 verschiedenen Wochen geübt." },
  { id: "halbes-jahr-dabei", emoji: "🌨️", bildbeschreibung: "eine Wolke, aus der Schnee fällt", name: "Ein halbes Jahr dabei", group: "Übungswochen", description: "In 26 verschiedenen Wochen geübt." },
  { id: "ganzes-jahr-dabei", emoji: "🎂", bildbeschreibung: "eine Geburtstagstorte mit Kerze", name: "Ein ganzes Jahr dabei", group: "Übungswochen", description: "In 52 verschiedenen Wochen geübt." },
  // Familie „Sterne" — 3-Sterne-Runden.
  { id: "sternschnuppe", emoji: "🌠", bildbeschreibung: "eine Sternschnuppe am Nachthimmel", name: "Sternschnuppe", group: "Sterne", description: "Die erste Runde mit 3 Sternen." },
  { id: "sternen-sammler", emoji: "🌟", bildbeschreibung: "ein leuchtender gelber Stern", name: "Sternen-Sammler", group: "Sterne", description: "10 Runden mit 3 Sternen." },
  { id: "sternenhimmel", emoji: "🌌", bildbeschreibung: "die Milchstraße am Nachthimmel", name: "Sternenhimmel", group: "Sterne", description: "30 Runden mit 3 Sternen." },
  { id: "sternenmeer", emoji: "✴️", bildbeschreibung: "ein achtzackiger orangefarbener Stern", name: "Sternenmeer", group: "Sterne", description: "75 Runden mit 3 Sternen." },
  // Familie „Lektionen" — geübte Lektionen des Lehrgangs.
  { id: "lektions-loewe", emoji: "🦁", bildbeschreibung: "ein Löwe", name: "Lektions-Löwe", nameNeutral: "Fünf Lektionen", group: "Lektionen", description: "5 Lektionen abgeschlossen." },
  { id: "kapitel-kaeptn", emoji: "⚓", bildbeschreibung: "ein Anker", name: "Kapitel-Käpt'n", group: "Lektionen", description: "15 Lektionen abgeschlossen." },
  { id: "lehrgangs-legende", emoji: "🏆", bildbeschreibung: "ein goldener Pokal", name: "Lehrgangs-Legende", group: "Lektionen", description: `Alle ${LESSONS.length} Lektionen abgeschlossen.` },
  // Familie „Spielstufe" — Übungspunkte (Fleiß), sichtbar als Spielstufe.
  { id: "kletter-koala", emoji: "🐨", bildbeschreibung: "ein Koala", name: "Kletter-Koala", nameNeutral: "Stufe 5", group: "Stufen", description: "Stufe 5 im Punktering erreicht." },
  { id: "punkte-rakete", emoji: "🎈", bildbeschreibung: "ein roter Luftballon", name: "Punkte-Rakete", group: "Stufen", description: "Stufe 10 im Punktering erreicht." },
  { id: "gipfel-gaemse", emoji: "🐐", bildbeschreibung: "eine Ziege", name: "Gipfel-Gämse", nameNeutral: "Stufe 20", group: "Stufen", description: "Stufe 20 im Punktering erreicht." },
  { id: "hoehenflug", emoji: "🚁", bildbeschreibung: "ein Hubschrauber", name: "Höhenflug", nameNeutral: "Stufe 50", group: "Stufen", description: "Stufe 50 im Punktering erreicht." },
  { id: "ueber-den-wolken", emoji: "🛸", bildbeschreibung: "eine fliegende Untertasse", name: "Über den Wolken", nameNeutral: "Stufe 100", group: "Stufen", description: "Stufe 100 im Punktering erreicht." },
  { id: "sternenreise", emoji: "☄️", bildbeschreibung: "ein Komet mit langem Schweif", name: "Sternenreise", nameNeutral: "Stufe 200", group: "Stufen", description: "Stufe 200 im Punktering erreicht." },
  // ── Familie „Tastenwelt" — der Lernweg selbst, Einheit für Einheit bis zum
  // letzten Sonderzeichen (09.08.2026). Sie hängt allein am Tastenstand
  // (`introduced`) und ist damit in BEIDEN Lernwegen gleich zu holen: „Mein
  // Training" schaltet Zeichen einzeln frei, der Lehrgang über die Lektionen —
  // am Ende deckt er dieselben 73 Einheiten ab.
  { id: "grundstellungs-gorilla", emoji: "🦍", bildbeschreibung: "ein Gorilla", name: "Grundstellungs-Gorilla", nameNeutral: "Grundreihe steht", group: "Tastenwelt", description: "Alle acht Tasten der Grundstellung freigeschaltet: f j d k s l a ö." },
  { id: "gross-baumeister", emoji: "🔠", bildbeschreibung: "vier Großbuchstaben auf blauen Tasten", name: "Groß-Baumeister", nameNeutral: "Großschreibung", group: "Tastenwelt", description: "Die Umschalttaste ist gelernt - echte Großbuchstaben mit der eigenen Hand." },
  { id: "puenktchen-panda", emoji: "🐼", bildbeschreibung: "ein Panda", name: "Pünktchen-Panda", nameNeutral: "Die Umlaute", group: "Tastenwelt", description: "ä, ö und ü freigeschaltet." },
  { id: "schlangen-s", emoji: "🐍", bildbeschreibung: "eine Schlange", name: "Schlangen-S", nameNeutral: "Das scharfe s", group: "Tastenwelt", description: "Das ß freigeschaltet - der letzte Buchstabe der Tastatur." },
  { id: "alphabet-as", emoji: "🔤", bildbeschreibung: "kleine Buchstaben auf blauen Tasten", name: "Alphabet-As", group: "Tastenwelt", description: "Alle Buchstaben von A bis Z freigeschaltet." },
  { id: "punkt-und-komma", emoji: "✒️", bildbeschreibung: "eine schwarze Schreibfeder", name: "Punkt und Komma", group: "Tastenwelt", description: "Punkt und Komma freigeschaltet - die ersten echten Satzzeichen." },
  { id: "satzzeichen-sammler", emoji: "❗", bildbeschreibung: "ein dickes rotes Rufzeichen", name: "Satzzeichen-Sammler", nameNeutral: "Alle Satzzeichen", group: "Tastenwelt", description: "Alle sieben Satzzeichen freigeschaltet: . , - ? ! : ;" },
  { id: "zahlen-zebra", emoji: "🦓", bildbeschreibung: "ein Zebra", name: "Zahlen-Zebra", nameNeutral: "Halbe Zahlenreihe", group: "Tastenwelt", description: "Fünf Ziffern der Zahlenreihe freigeschaltet." },
  { id: "zahlen-zauberer", emoji: "🔟", bildbeschreibung: "eine blaue Taste mit der Zahl 10", name: "Zahlen-Zauberer", nameNeutral: "Zahlenreihe komplett", group: "Tastenwelt", description: "Die ganze Zahlenreihe von 1 bis 0 freigeschaltet." },
  { id: "klammer-krokodil", emoji: "🐊", bildbeschreibung: "ein Krokodil", name: "Klammer-Krokodil", nameNeutral: "Klammern auf, Klammern zu", group: "Tastenwelt", description: "Die runden Klammern ( ) freigeschaltet - die ersten Sonderzeichen." },
  { id: "alltags-ass", emoji: "📧", bildbeschreibung: "ein Briefumschlag für E-Mails", name: "Alltags-Ass", nameNeutral: "Die Alltagszeichen", group: "Tastenwelt", description: "@, €, $ und § freigeschaltet - die Zeichen für E-Mail, Geld und Paragrafen." },
  { id: "tastatur-krone", emoji: "👑", bildbeschreibung: "eine goldene Krone", name: "Tastatur-Königin", nameNeutral: "Die ganze Tastatur", group: "Tastenwelt", description: "ALLE Zeichen der Tastatur freigeschaltet - bis zum letzten Sonderzeichen." },
  // ── Familie „Sitzt!" — Qualität statt Menge: Nicht „habe ich schon gesehen",
  // sondern „sitzt wirklich" (derselbe Maßstab, mit dem das Programm neue
  // Zeichen freigibt). Zeichen, die es auf der eingestellten Tastatur nicht gibt
  // (Schweiz: ß), zählen wie erledigt — sonst wäre die Familie dort unerreichbar.
  { id: "feste-burg", emoji: "🏠", bildbeschreibung: "ein Haus", name: "Feste Burg", nameNeutral: "Grundreihe sitzt", group: "Sitzt!", description: "Alle acht Tasten der Grundstellung sitzen sicher." },
  { id: "buchstaben-baendiger", emoji: "🅰️", bildbeschreibung: "ein rotes Feld mit einem großen A", name: "Buchstaben-Bändiger", nameNeutral: "Alle Buchstaben sitzen", group: "Sitzt!", description: "Jeder einzelne Buchstabe sitzt - keiner wackelt mehr." },
  { id: "zahlen-fels", emoji: "🧮", bildbeschreibung: "ein Rechenrahmen mit bunten Kugeln", name: "Zahlen-Fels", nameNeutral: "Alle Ziffern sitzen", group: "Sitzt!", description: "Die ganze Zahlenreihe sitzt sicher." },
  { id: "nichts-wackelt", emoji: "💠", bildbeschreibung: "eine blaue Raute mit einem Punkt in der Mitte", name: "Nichts wackelt", group: "Sitzt!", description: "Jede einzelne Taste der Tastatur sitzt sicher - die ganze Tastatur, nicht nur freigeschaltet." },
  // ── Familie „Tempo" — sauber erarbeitete Geschwindigkeit. Der Fuchs misst am
  // PERSÖNLICHEN Ziel, die Treppe darunter an echten Schulnormen (SPEED_TIERS).
  { id: "flinker-fuchs", emoji: "🦊", bildbeschreibung: "ein Fuchs", name: "Flinker Fuchs", nameNeutral: "Schnell und sauber", group: "Tempo", description: "Tempo-Ziel erreicht UND mindestens 95 % Treffsicherheit - schnell zählt nur sauber." },
  { id: "tempo-60", emoji: "🐇", bildbeschreibung: "ein Hase", name: "Hoppel-Hase", nameNeutral: "60 Anschläge sauber", group: "Tempo", description: "Eine Runde mit 60 Anschlägen pro Minute bei mindestens 95 % Treffsicherheit - so viel verlangt der Schreib-Wettbewerb zum Bestehen." },
  { id: "tempo-90", emoji: "🦌", bildbeschreibung: "ein Reh", name: "Renn-Reh", nameNeutral: "90 Anschläge sauber", group: "Tempo", description: "Eine Runde mit 90 Anschlägen pro Minute bei mindestens 95 % Treffsicherheit." },
  { id: "tempo-120", emoji: "🐎", bildbeschreibung: "ein galoppierendes Pferd", name: "Galopp-Pferd", nameNeutral: "120 Anschläge sauber", group: "Tempo", description: "Eine Runde mit 120 Anschlägen pro Minute bei mindestens 98 % Treffsicherheit - das Ziel des bayerischen Lehrplans." },
  { id: "tempo-160", emoji: "🚂", bildbeschreibung: "eine Dampflok", name: "Dampflok", nameNeutral: "160 Anschläge sauber", group: "Tempo", description: "Eine Runde mit 160 Anschlägen pro Minute bei mindestens 98 % Treffsicherheit - das Ziel des österreichischen Lehrplans." },
  { id: "tempo-200", emoji: "🚄", bildbeschreibung: "ein Schnellzug", name: "Schnellzug", nameNeutral: "200 Anschläge sauber", group: "Tempo", description: "Eine Runde mit 200 Anschlägen pro Minute bei mindestens 98 % Treffsicherheit - geübtes Zehnfinger-Niveau." },
  { id: "tempo-300", emoji: "🛩️", bildbeschreibung: "ein kleines Flugzeug", name: "Düsenjet", nameNeutral: "300 Anschläge sauber", group: "Tempo", description: "Eine Runde mit 300 Anschlägen pro Minute bei mindestens 99 % Treffsicherheit - Profi-Niveau." },
  // ── Familie „Am Stück" — die längste fehlerfreie Kette, ÜBER Runden hinweg.
  // Ein einziger Fehler setzt die laufende Kette zurück; der Bestwert bleibt.
  { id: "kette-100", emoji: "🔗", bildbeschreibung: "zwei Kettenglieder", name: "Kettenreaktion", nameNeutral: "100 am Stück", group: "Am Stück", description: "100 richtige Anschläge hintereinander, ohne einen einzigen Fehler." },
  { id: "kette-250", emoji: "⛓️", bildbeschreibung: "eine Kette aus mehreren Gliedern", name: "Ohne Stolpern", group: "Am Stück", description: "250 richtige Anschläge hintereinander." },
  { id: "kette-500", emoji: "🧵", bildbeschreibung: "eine Garnrolle mit Faden", name: "Roter Faden", nameNeutral: "500 am Stück", group: "Am Stück", description: "500 richtige Anschläge hintereinander - eine ganze Runde und mehr." },
  { id: "kette-1000", emoji: "🗻", bildbeschreibung: "der Berg Fuji mit Schneekappe", name: "Tausend ohne Fehler", group: "Am Stück", description: "1.000 richtige Anschläge hintereinander." },
  { id: "kette-2000", emoji: "🌋", bildbeschreibung: "ein Vulkan, aus dem Lava fließt", name: "Die eiserne Kette", nameNeutral: "2000 am Stück", group: "Am Stück", description: "2.000 richtige Anschläge hintereinander - vier bis fünf Runden ohne den kleinsten Ausrutscher." },
  // Familie „Abenteuer" — geschaffte freie Eisschollen-Abenteuer (das Spiel
  // zählt nicht als Übezeit, aber Dranbleiben im Abenteuer wird belohnt).
  { id: "erste-expedition", emoji: "🧭", bildbeschreibung: "ein Kompass", name: "Erste Expedition", group: "Abenteuer", description: "Das erste freie Eisschollen-Abenteuer bis zum Iglu geschafft." },
  { id: "polarforscher", emoji: "❄️", bildbeschreibung: "eine Schneeflocke", name: "Polarforscher", group: "Abenteuer", description: "10 freie Eisschollen-Abenteuer geschafft." },
  { id: "eismeer-legende", emoji: "🌊", bildbeschreibung: "eine hohe blaue Welle", name: "Eismeer-Legende", group: "Abenteuer", description: "30 freie Eisschollen-Abenteuer geschafft." },
  { id: "packeis-profi", emoji: "🧳", bildbeschreibung: "ein Reisekoffer", name: "Packeis-Profi", nameNeutral: "60 Abenteuer", group: "Abenteuer", description: "60 freie Eisschollen-Abenteuer geschafft." },
  // Familie „Abenteuer-Kunststücke" — besondere Momente im Eisschollen-Spiel.
  { id: "trockener-frack", emoji: "🎩", bildbeschreibung: "ein schwarzer Zylinderhut", name: "Trockener Frack", group: "Abenteuer-Kunststücke", description: "Ein ganzes Abenteuer ohne ein einziges Mal ins Wasser oder in den Schnee zu plumpsen." },
  { id: "immer-trocken", emoji: "🌂", bildbeschreibung: "ein zusammengeklappter Regenschirm", name: "Immer trocken", group: "Abenteuer-Kunststücke", description: `${CLEAN_ADVENTURE_NEED} Abenteuer ohne ein einziges Plumpsen.` },
  { id: "fischfaenger", emoji: "🐟", bildbeschreibung: "ein blauer Fisch", name: "Fischfänger", group: "Abenteuer-Kunststücke", description: `${FISH_NEED} Bonus-Fische im Eisschollen-Abenteuer gefangen.` },
  // Familie „Expedition" — besondere Zonen der Polar-Expedition (freies Spiel,
  // die ganze Reise vom Morgen in die Nacht). Additiv zu den Abenteuer-Familien.
  { id: "hoehlen-lauscher", emoji: "🦇", bildbeschreibung: "eine Fledermaus", name: "Höhlen-Lauscher", group: "Expedition", description: "Die Echo-Höhle blind, nur nach Gehör, bis zum Ausgang geschafft." },
  { id: "sturm-trotzer", emoji: "🌬️", bildbeschreibung: "ein Gesicht, das Wind bläst", name: "Sturm-Trotzer", group: "Expedition", description: "Den Schneesturm gemeistert - Merkfolgen aus dem Gedächtnis getippt." },
  { id: "funker-freund", emoji: "📻", bildbeschreibung: "ein Radio", name: "Funker-Freund", group: "Expedition", description: "An der Polarstation einen ganzen Funkspruch entschlüsselt und gesendet." },
  { id: "polarlicht-entdecker", emoji: "💫", bildbeschreibung: "ein Stern mit einer Schleife aus Funken", name: "Polarlicht-Entdecker", group: "Expedition", description: "Die ganze Polar-Expedition ohne einen einzigen Fehler geschafft - das Polarlicht tanzt." },
  // Familie „Geschichten" — ganze Geschichten aus der Bücherei zu Ende gelesen.
  { id: "lese-luchs", emoji: "🐆", bildbeschreibung: "ein Leopard", name: "Lese-Luchs", nameNeutral: "Erste Geschichte", group: "Geschichten", description: "Die erste Geschichte ganz zu Ende gelesen und getippt." },
  { id: "buecherwurm", emoji: "🐛", bildbeschreibung: "eine grüne Raupe", name: "Bücherwurm", group: "Geschichten", description: "3 Geschichten ganz zu Ende gelesen." },
  { id: "buecherei-baer", emoji: "🐻", bildbeschreibung: "ein Bär", name: "Bücherei-Bär", nameNeutral: "Acht Geschichten", group: "Geschichten", description: "8 Geschichten ganz zu Ende gelesen." },
  { id: "vielleser", emoji: "📚", bildbeschreibung: "ein Stapel bunter Bücher", name: "Vielleser", group: "Geschichten", description: "15 Geschichten ganz zu Ende gelesen." },
  // Familie „Lesestunde" — einzelne Etappen (je 12 Zeilen) einer Geschichte.
  { id: "seiten-spatz", emoji: "🐦", bildbeschreibung: "ein kleiner blauer Vogel", name: "Seiten-Spatz", nameNeutral: "Erste Seite", group: "Lesestunde", description: "Die erste Etappe einer Geschichte getippt." },
  { id: "kapitel-krake", emoji: "🐙", bildbeschreibung: "ein Krake", name: "Kapitel-Krake", nameNeutral: "Zehn Etappen", group: "Lesestunde", description: "10 Etappen gelesen und getippt." },
  { id: "geschichten-gigant", emoji: "🐘", bildbeschreibung: "ein Elefant", name: "Geschichten-Gigant", group: "Lesestunde", description: "30 Etappen gelesen und getippt." },
  { id: "leseratte", emoji: "📜", bildbeschreibung: "eine Schriftrolle", name: "Leseratte", nameNeutral: "75 Etappen", group: "Lesestunde", description: "75 Etappen gelesen und getippt." },
  // Familie „Lese-Kunststücke" — besondere Lese-Momente.
  { id: "federleicht", emoji: "🪶", bildbeschreibung: "eine weiße Feder", name: "Federleicht", group: "Lese-Kunststücke", description: "Eine ganze Etappe ohne einen einzigen Fehler getippt." },
  { id: "in-einem-rutsch", emoji: "🌀", bildbeschreibung: "eine blaue Spirale", name: "In einem Rutsch", group: "Lese-Kunststücke", description: "Eine ganze Geschichte an einem einzigen Tag zu Ende gelesen." },
  { id: "lesezeichen-held", emoji: "🔖", bildbeschreibung: "ein Lesezeichen", name: "Lesezeichen-Held", group: "Lese-Kunststücke", description: "An einem anderen Tag genau dort weitergelesen, wo zuletzt Schluss war." },
  // ── Familie „Meisterprüfung" — der Schluss. Drei Abschlüsse, die es erst nach
  // Monaten gibt und die man nicht nebenbei einsammelt.
  { id: "zehn-minuten-abschrift", emoji: "⏱️", bildbeschreibung: "eine Stoppuhr", name: "Die 10-Minuten-Abschrift", group: "Meisterprüfung", description: "Zehn Minuten am Stück getippt und dabei höchstens 0,5 % Fehler gemacht - genau das verlangt die klassische Schreibprüfung." },
  { id: "lehrgangs-meister", emoji: "🎓", bildbeschreibung: "ein schwarzer Doktorhut", name: "Lehrgangs-Meister", group: "Meisterprüfung", description: `Alle ${LESSONS.length} Lektionen mit drei Sternen abgeschlossen.` },
  { id: "goldene-tastatur", emoji: "🏅", bildbeschreibung: "eine Sportmedaille an einem Band", name: "Die goldene Tastatur", group: "Meisterprüfung", description: "Jede Taste freigeschaltet, jede Taste sitzt - und einmal 160 Anschläge pro Minute bei 98 % Treffsicherheit. Das letzte Abzeichen." },
  // Geheim-Abzeichen (vor dem Verdienen nur „???").
  { id: "gemuetliches-faultier", emoji: "🦥", bildbeschreibung: "ein Faultier", name: "Gemütliches Faultier", group: "Geheim", secret: true, description: "Ganz gemütlich und trotzdem fehlerfrei - Treffsicherheit schlägt Tempo!" },
  { id: "comeback-kaenguru", emoji: "🦘", bildbeschreibung: "ein Känguru", name: "Comeback-Känguru", group: "Geheim", secret: true, description: "Direkt nach einer 1-Stern-Runde eine 3-Sterne-Runde geschafft." },
  { id: "nachteule", emoji: "🦉", bildbeschreibung: "eine Eule", name: "Nachteule", group: "Geheim", secret: true, description: "Eine Runde nach 21 Uhr beendet." },
  { id: "frueher-vogel", emoji: "🐓", bildbeschreibung: "ein Hahn", name: "Früher Vogel", group: "Geheim", secret: true, description: "Eine Runde vor 7 Uhr morgens beendet." },
  { id: "nimmersatt", emoji: "🍏", bildbeschreibung: "ein grüner Apfel", name: "Nimmersatt", group: "Geheim", secret: true, description: "Gleich 3 Etappen an einem einzigen Tag verschlungen." },
  { id: "ferien-held", emoji: "🏖️", bildbeschreibung: "ein Strand mit Sonnenschirm", name: "Ferien-Held", group: "Geheim", secret: true, description: "Mitten in den Sommerferien geübt - im Juli oder August." },
  { id: "wochenend-schreiber", emoji: "📅", bildbeschreibung: "ein Kalenderblatt", name: "Wochenend-Schreiber", group: "Geheim", secret: true, description: "An einem Samstag und an einem Sonntag geübt." },
  { id: "zurueck-im-sattel", emoji: "🔄", bildbeschreibung: "zwei Pfeile im Kreis", name: "Zurück im Sattel", group: "Geheim", secret: true, description: `Nach mehr als ${COMEBACK_DAYS} Tagen Pause wieder geübt - Wiederkommen zählt.` },
  { id: "doppelt-genaeht", emoji: "🪡", bildbeschreibung: "eine Nähnadel mit Faden", name: "Doppelt genäht", group: "Geheim", secret: true, description: "Zwei fehlerfreie Runden direkt hintereinander." },
  // Zweite Geheim-Charge (Wunsch Johannes 09.08.2026: „geheime Abzeichen sind
  // super, da darf es ruhig 20 geheime geben"). Bewusst so gewählt, dass sie
  // beim NORMALEN Üben nebenbei passieren — niemand muss sie jagen.
  { id: "winterkind", emoji: "⛄", bildbeschreibung: "ein Schneemann", name: "Winterkind", group: "Geheim", secret: true, description: "Mitten im Winter geübt - im Dezember oder Jänner." },
  { id: "jahreswechsel", emoji: "🎆", bildbeschreibung: "ein Feuerwerk am Nachthimmel", name: "Jahreswechsel", group: "Geheim", secret: true, description: "Am letzten Tag des Jahres oder am ersten des neuen geübt." },
  { id: "tages-marathon", emoji: "🏇", bildbeschreibung: "eine Person auf einem Rennpferd", name: "Tages-Marathon", group: "Geheim", secret: true, description: "Zehn Runden an einem einzigen Tag." },
  { id: "sternentag", emoji: "🌞", bildbeschreibung: "eine Sonne mit einem Gesicht", name: "Sternentag", group: "Geheim", secret: true, description: "Drei Runden mit drei Sternen an einem einzigen Tag." },
  { id: "blitzsauber", emoji: "🧼", bildbeschreibung: "ein Stück Seife mit Schaum", name: "Blitzsauber", group: "Geheim", secret: true, description: "Drei fehlerfreie Runden an einem einzigen Tag." },
  { id: "volle-woche", emoji: "📗", bildbeschreibung: "ein grünes Buch", name: "Volle Woche", group: "Geheim", secret: true, description: "In EINER Woche an fünf verschiedenen Tagen geübt." },
  { id: "blindflug", emoji: "🙈", bildbeschreibung: "ein Affe, der die Hände vor die Augen hält", name: "Blindflug", group: "Geheim", secret: true, description: "Eine ganze Runde fehlerfrei - mit ausgeblendeter Bildschirm-Tastatur. Genau darum geht es beim Zehnfingersystem." },
  { id: "sprachwechsler", emoji: "🌍", bildbeschreibung: "die Erdkugel mit Europa und Afrika", name: "Sprachwechsler", group: "Geheim", secret: true, description: "In zwei Sprachen geübt - zum Beispiel auf Deutsch und auf Englisch." },
  { id: "lesenacht", emoji: "🌜", bildbeschreibung: "ein Mond mit einem Gesicht", name: "Lesenacht", group: "Geheim", secret: true, description: "Eine Geschichten-Etappe nach 20 Uhr gelesen." },
  { id: "zaehe-taste", emoji: "🐌", bildbeschreibung: "eine Schnecke", name: "Zähe Taste", group: "Geheim", secret: true, description: "Eine Taste, die lange gehakt hat, sitzt jetzt sicher." },
  { id: "aufsteiger", emoji: "📈", bildbeschreibung: "ein Diagramm mit steigender Kurve", name: "Aufsteiger", group: "Geheim", secret: true, description: "Fünf Leistungsstufen höher als am Anfang." },
];

/**
 * ★ E10b-2 (26.09.2026): Abzeichen, die es nur auf EINEM Weg gibt - nicht in
 * {@link BADGES}, damit die Regale der anderen Wege unverändert bleiben
 * (`badgesNurFr.ts`). Eine Tabelle je Weg, damit ein vierter sich meldet.
 */
const NUR_AUF_WEG: Record<Lernweg, readonly BadgeDef[]> = {
  de: [],
  en: [],
  fr: ABZEICHEN_NUR_FR,
  es: [], // es: LEER (ES-F2) - eigene Abzeichen kommen frühestens mit ES-F4/F5.
  it: [], // ★ O-IT: LEER - eigene Abzeichen (à è ì ò ù) gehören zur Reihenfolge (F4), nicht zur Oberfläche.
  pl: [], // ★ O-PL: LEER - eigene Abzeichen (ą ć ę ł ń ó ś ź ż) gehören zur Reihenfolge, nicht zur Oberfläche.
  tr: [], // ★ O-TR: LEER - eigene Abzeichen (ç ğ ı ş, â î û) gehören zur Reihenfolge, nicht zur Oberfläche.
  cs: [], // ★ O-CS: LEER - eigene Abzeichen (ě š č ř ž ý á í é ů) gehören zur Reihenfolge, nicht zur Oberfläche.
  // ★ O2-LIB (30.10.2026): echte Werte - die neun haben (noch) keine eigenen Abzeichen.
  bg: [],
  el: [],
  hu: [],
  nl: [],
  pt: [],
  br: [],
  ro: [],
  sv: [],
  uk: [],
};

const KATALOG_JE_WEG = new Map<Lernweg, readonly BadgeDef[]>();

/**
 * Der Katalog, den ein Kind auf seinem Weg sieht und verdienen kann: für „de"
 * und „en" genau {@link BADGES}, für „fr" dazu die drei aus `badgesNurFr.ts`.
 * Das Regal (`BadgeShelf.tsx`) liest heute noch `BADGES` - siehe Befund E10b-2.
 */
export function badgesFuerWeg(lernweg: Lernweg): readonly BadgeDef[] {
  const zusatz = NUR_AUF_WEG[lernweg];
  if (zusatz.length === 0) return BADGES;
  let k = KATALOG_JE_WEG.get(lernweg);
  if (!k) {
    k = [...BADGES, ...zusatz];
    KATALOG_JE_WEG.set(lernweg, k);
  }
  return k;
}

const BY_ID = new Map([...BADGES, ...ABZEICHEN_NUR_FR].map((b) => [b.id, b]));

export function badgeById(id: string): BadgeDef | undefined {
  return BY_ID.get(id);
}

// --- Lebenszeit-Zähler (Tally) -------------------------------------------------

/**
 * Kleine Lebenszeit-Zähler für die Abzeichen — nötig, weil der Runden-Verlauf im
 * Spielstand gekappt ist (MAX_ROUNDS) und z. B. „250 Runden" sonst nie erreichbar
 * wäre. Wird bei JEDEM Rundenende fortgeschrieben. Alle Felder additiv.
 */
export interface BadgeTally {
  /** Runden gesamt (Lebenszeit). */
  rounds: number;
  /** Fehlerfreie Runden (Treffsicherheit 100 %). */
  perfect: number;
  /** Aktuelle Serie sauberer Runden (≥ {@link CLEAN_ROUND_ACC}) in Folge. */
  cleanStreak: number;
  /** Längste je erreichte saubere Serie. */
  bestCleanStreak: number;
  /** Runden mit 3 Sternen. */
  stars3: number;
  /** Anzahl verschiedener Übungstage. */
  days: number;
  /** Zuletzt gezählter Übungstag (lokales Datum als YYYY-MM-DD). */
  lastDay?: string;
  /** Sterne der VORIGEN Runde (für das Comeback-Känguru). */
  lastStars?: number;
  /** Geschaffte freie Eisschollen-Abenteuer (optional — Altstände starten bei 0). */
  adventures?: number;
  /** Davon ohne einziges Untergehen/Ausrutschen („Trockener Frack"). */
  cleanAdventures?: number;
  /** Gefangene Bonus-Fische, kumulativ („Fischfänger"). */
  fishCaught?: number;
  /** Gelesene Geschichten-Etappen (je 12 Zeilen), kumulativ. */
  etappen?: number;
  /** Ganz zu Ende gelesene Geschichten, kumulativ. */
  storiesDone?: number;
  /** Tag der zuletzt gelesenen Etappe (YYYY-MM-DD) — für „Lesezeichen-Held". */
  lastStoryDay?: string;
  /** Wie viele Etappen an genau diesem Tag schon gelesen wurden („Nimmersatt"). */
  storyDayCount?: number;

  // ── Ausbau 09.08.2026 — alle Felder optional, Altstände starten leer ───────
  /** Fassung des Katalogs, die dieser Stand schon gesehen hat (stiller Nachtrag). */
  catalog?: number;
  /** Laufende Kette richtiger Anschläge — überlebt das Rundenende. */
  cleanRun?: number;
  /** Längste je erreichte fehlerfreie Kette („Am Stück"). */
  bestCleanRun?: number;
  /** Verschiedene Übungs-WOCHEN. */
  weeks?: number;
  /** Zuletzt gezählte Kalenderwoche (ISO, z. B. „2026-W32"). */
  lastWeek?: string;
  /** Zeitpunkt der letzten Runde (für „Zurück im Sattel" und den Prüfungslauf). */
  lastRoundTs?: number;
  /** War die vorige Runde fehlerfrei? („Doppelt genäht") */
  lastPerfect?: boolean;
  /** Schon an einem Samstag / an einem Sonntag geübt? („Wochenend-Schreiber") */
  satDone?: boolean;
  sunDone?: boolean;
  /** Laufender Prüfungs-Lauf der 10-Minuten-Abschrift: Tippzeit, Anschläge, Fehler. */
  examMs?: number;
  examKeys?: number;
  examErrors?: number;

  // ── Zweite Geheim-Charge (09.08.2026) ─────────────────────────────────────
  /** Runden / fehlerfreie / 3-Sterne-Runden am HEUTIGEN Tag (Tages-Abzeichen). */
  dayRounds?: number;
  dayPerfect?: number;
  dayStars3?: number;
  /** Übungstage in der laufenden Kalenderwoche („Volle Woche"). */
  weekDays?: number;
  /** Leistungsstufe der allerersten gezählten Runde („Aufsteiger"). */
  firstLevel?: number;
  /** Einheiten, die schon einmal „hakt" waren („Zähe Taste") — als Zeichenkette. */
  struggled?: string;
  /** Sprachen, in denen schon geübt wurde („Sprachwechsler"), z. B. „deen". */
  langs?: string;
}

/**
 * ★ D1 Randfund (28.09.2026): die Sprachen aus `langs` („deenfr" → de, en,
 * fr) - je zwei Buchstaben, statt mit `includes` im ganzen Text zu suchen.
 */
export function geuebteSprachen(langs: string | undefined): string[] {
  const out: string[] = [];
  for (let i = 0; i + 1 < (langs ?? "").length; i += 2) out.push((langs as string).slice(i, i + 2));
  return out;
}

function emptyTally(): BadgeTally {
  return { rounds: 0, perfect: 0, cleanStreak: 0, bestCleanStreak: 0, stars3: 0, days: 0 };
}

/**
 * Kalenderwoche nach ISO 8601 („2026-W32") — die Übungswochen zählen nach der
 * Uhr des Kindes, genau wie die Übungstage. Maßgeblich ist der Donnerstag
 * derselben Woche (so bestimmt ISO 8601 das Wochenjahr).
 *
 * (Bis 11.09.2026 stand hier eine eigene, unabhängige Berechnung - identisch
 * zu `isoWeekKey` aus `goals.ts`, nur mit anderem Rechenweg zum selben
 * Donnerstag-Bezug. Für 20 Zeitpunkte inkl. Jahreswechsel/KW 53/Sonntag-Montag
 * geprüft gleich, deshalb zusammengeführt: `weekKey` ruft jetzt `isoWeekKey`.)
 */
export function weekKey(ts: number): string {
  return isoWeekKey(ts);
}

/** Lokales Datum als YYYY-MM-DD (Übungstage zählen nach der Uhr des Kindes). */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Best-Effort-Saat der Zähler aus dem (gekappten) Runden-Verlauf — damit Kinder
 * mit Altstand ihre längst verdienten Abzeichen rückwirkend bekommen, statt bei
 * null anzufangen. Läuft genau einmal (danach existiert das Tally).
 */
export function seedTally(p: TypingProgress): BadgeTally {
  const t = emptyTally();
  const rounds = p.rounds ?? [];
  const seenDays = new Set<string>();
  for (const r of rounds) {
    t.rounds += 1;
    if (r.acc >= 1) t.perfect += 1;
    if (r.stars >= 3) t.stars3 += 1;
    if (r.acc >= CLEAN_ROUND_ACC) {
      t.cleanStreak += 1;
      t.bestCleanStreak = Math.max(t.bestCleanStreak, t.cleanStreak);
    } else {
      t.cleanStreak = 0;
    }
    if (r.ts > 0) seenDays.add(dayKey(r.ts));
    t.lastStars = r.stars;
  }
  t.days = seenDays.size;
  const last = rounds[rounds.length - 1];
  if (last && last.ts > 0) t.lastDay = dayKey(last.ts);
  return t;
}

// --- Auswertung ----------------------------------------------------------------

/** Die gerade beendete Runde (für Runden-abhängige Abzeichen). */
export interface BadgeRound {
  acc: number; // Treffsicherheit 0..1
  cpm: number; // Rundentempo (Anschläge/Min)
  stars: number; // 1..3
  level: number; // Leistungsstufe, auf der die Runde lief
  /**
   * Tempo-Ziel, gegen das die Runde bewertet wurde (dasselbe wie bei den
   * Sternen, siehe speedTargetCpm). Wichtig für Fuchs/Faultier: in „Mein
   * Training" verschiebt die Anfangs-Kalibrierung die Leistungsstufe schon
   * WÄHREND der Runde — das Stufen-Ziel am Rundenende wäre dann ein anderes
   * als das, gegen das das Kind gerade getippt hat. Fehlt der Wert (ältere
   * Aufrufer), gilt das Stufen-Ziel als Rückfall.
   */
  target?: number;
  /**
   * Feinauskunft der Runde aus der Tipp-Sitzung (TypingSession). Nötig für die
   * Familien „Am Stück" (fehlerfreie Ketten über Runden hinweg), „Tempo"
   * (Mindestlänge einer wertbaren Runde) und die 10-Minuten-Abschrift. Fehlt
   * sie (ältere Aufrufer, Tests), bleiben genau diese Abzeichen unberührt —
   * alles andere zählt wie bisher.
   */
  detail?: RoundDetail;
  /**
   * Sprache der Übungsinhalte dieser Runde („Sprachwechsler"). Optional —
   * fehlt sie, bleibt das Abzeichen unberührt.
   */
  lang?: string;
  /**
   * ★★★★★ War das ein WORTSPIEL? Dann bleiben die drei TEMPO-Abzeichen
   * unberührt - Flinker Fuchs, Gemütliches Faultier und die Tempo-Treppe.
   *
   * Johannes am 02.09.2026: Wer im Lückentext nachdenkt oder im
   * Buchstabensalat sucht, tippt langsam, und zwar richtig so. Ein Fuchs, der
   * dafür ausbleibt, wäre unfair; ein Faultier, das dafür kommt, wäre eine
   * Auszeichnung für etwas, das gar nicht gemessen wurde. Beides zählt hier
   * einfach nicht. Genauigkeit, Ketten und alle übrigen Abzeichen bleiben
   * unberührt - ein Wortspiel ist volle Übung.
   */
  wortspiel?: boolean;
}

/**
 * Was die Tipp-Sitzung über eine beendete Runde weiß, über acc/cpm hinaus.
 * Alles in ANSCHLÄGEN (inklusive Umschalt-Anschlägen), nicht in Zeichen.
 */
export interface RoundDetail {
  /** Anschläge dieser Runde (richtige + falsche). */
  keys: number;
  /** Fehlanschläge dieser Runde. */
  errors: number;
  /** Reine Tippzeit dieser Runde in ms (ohne Wartezeit auf das Vorlesen). */
  ms: number;
  /**
   * War das ein WORTSPIEL? Die Tipp-Sitzung meldet es hier mit, weil sie es an
   * ihrer `contextId` (`form:<id>`) als Einzige sicher weiss. Siehe
   * `BadgeRound.wortspiel`.
   */
  wortspiel?: boolean;
  /** Richtige Anschläge VOR dem ersten Fehler der Runde (setzt die Kette fort). */
  leadClean: number;
  /** Richtige Anschläge NACH dem letzten Fehler (die Kette läuft damit weiter). */
  trailClean: number;
  /** Längste fehlerfreie Kette INNERHALB dieser Runde. */
  bestClean: number;
  /** Gab es in dieser Runde überhaupt einen Fehler? */
  hadError: boolean;
  /**
   * War die Bildschirm-Tastatur die ganze Runde über ausgeblendet? Grundlage
   * für „Blindflug" — das eigentliche Ziel des Zehnfingersystems.
   */
  keyboardHidden?: boolean;
}

/** Summe der richtigen Anschläge über alle Zeichen (Lebenszeit, aus letters). */
export function totalHits(letters: Record<string, LetterStat> | undefined): number {
  if (!letters) return 0;
  let sum = 0;
  for (const s of Object.values(letters)) sum += s.hits;
  return sum;
}

function tierIds(prefixIds: readonly string[], tiers: readonly number[], value: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < tiers.length; i++) if (value >= tiers[i]) out.push(prefixIds[i]);
  return out;
}

const PERFECT_IDS = ["volltreffer", "null-fehler-ninja", "makellos-meister", "diamant-finger", "weisse-weste", "einhorn-finger"] as const;
const STREAK_IDS = ["praezisions-pinguin", "adlerauge", "laser-lama", "eiskalte-serie"] as const;
const ROUNDS_IDS = ["tasten-kueken", "ausdauer-ameise", "marathon-maus", "munteres-murmeltier", "dauerlaeufer", "tausendsassa"] as const;
const HITS_IDS = ["tausend-tasten-tiger", "tasten-t-rex", "galaktische-fingerspitzen", "hunderttausend-held", "viertelmillion"] as const;
const DAYS_IDS = ["dranbleib-dachs", "gewohnheitstier", "wie-ein-uhrwerk", "unaufhaltsam", "tief-verwurzelt", "fels-in-der-brandung"] as const;
const WEEK_IDS = ["vierteljahr-dabei", "halbes-jahr-dabei", "ganzes-jahr-dabei"] as const;
const STARS3_IDS = ["sternschnuppe", "sternen-sammler", "sternenhimmel", "sternenmeer"] as const;
const LESSON_IDS = ["lektions-loewe", "kapitel-kaeptn", "lehrgangs-legende"] as const;
const XP_IDS = ["kletter-koala", "punkte-rakete", "gipfel-gaemse", "hoehenflug", "ueber-den-wolken", "sternenreise"] as const;
const ADVENTURE_IDS = ["erste-expedition", "polarforscher", "eismeer-legende", "packeis-profi"] as const;
const STORY_IDS = ["lese-luchs", "buecherwurm", "buecherei-baer", "vielleser"] as const;
const ETAPPE_IDS = ["seiten-spatz", "kapitel-krake", "geschichten-gigant", "leseratte"] as const;
const CHAIN_IDS = ["kette-100", "kette-250", "kette-500", "kette-1000", "kette-2000"] as const;

// --- Tastenwelt + „Sitzt!" ------------------------------------------------------

/** Die reinen Buchstaben a–z (ohne Umlaute/ß) — für „Alphabet-As". */
const AZ = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const UMLAUTE = ["ä", "ö", "ü"] as const;
const GRUNDREIHE = LETTER_ORDER.slice(0, 8); // f j d k s l a ö
const ALLTAGS_ZEICHEN = ["@", "€", "$", "§"] as const;

/**
 * Sind alle diese Einheiten freigeschaltet? Zeichen, die es auf der EINGESTELLTEN
 * Tastatur gar nicht gibt (Schweiz: ß; englische Layouts: ä ö ü), fallen heraus —
 * genau wie bei den übersprungenen Lektionen ({@link lessonsDoneCount}). Sonst
 * bliebe „Pünktchen-Panda" für ein Kind mit englischer Tastatur für immer
 * unerreichbar, und die Regel „alle Abzeichen sind erreichbar" wäre verletzt.
 */
function hasUnits(
  introduced: readonly string[] | undefined,
  units: readonly string[],
  lernweg: Lernweg,
): boolean {
  const vorhanden = new Set(introOrder(lernweg));
  const noetig = units.filter((u) => vorhanden.has(u));
  if (noetig.length === 0) return true; // gibt es hier nicht → gilt als erledigt
  const set = new Set(introduced ?? []);
  return noetig.every((u) => set.has(u));
}

/** Wie viele dieser (auf dieser Tastatur vorhandenen) Einheiten sind schon frei? */
function countUnits(
  introduced: readonly string[] | undefined,
  units: readonly string[],
  lernweg: Lernweg,
): number {
  const vorhanden = new Set(introOrder(lernweg));
  const set = new Set(introduced ?? []);
  return units.filter((u) => vorhanden.has(u) && set.has(u)).length;
}

/**
 * Die Familie „Tastenwelt" an EINER Stelle: Abzeichen → verlangte Einheiten.
 * Daraus ergibt sich beides — die Vergabe (alle Einheiten frei?) und das
 * „nächste Ziel" in der Galerie (ab wie vielen freigeschalteten Zeichen ist es
 * fällig?). Weil das Programm die Zeichen streng der Reihe nach freischaltet,
 * ist „die ersten fünf Ziffern" dasselbe wie „fünf Ziffern".
 */
const TASTENWELT: ReadonlyArray<{ id: string; units: readonly string[] }> = [
  { id: "grundstellungs-gorilla", units: GRUNDREIHE },
  { id: "gross-baumeister", units: [SHIFT_UNIT] },
  { id: "puenktchen-panda", units: UMLAUTE },
  { id: "alphabet-as", units: AZ },
  { id: "schlangen-s", units: ["ß"] },
  { id: "punkt-und-komma", units: [".", ","] },
  { id: "satzzeichen-sammler", units: PUNCT_ORDER },
  { id: "zahlen-zebra", units: DIGIT_ORDER.slice(0, 5) },
  { id: "zahlen-zauberer", units: DIGIT_ORDER },
  { id: "klammer-krokodil", units: ["(", ")"] },
  { id: "alltags-ass", units: ALLTAGS_ZEICHEN },
  { id: "tastatur-krone", units: SYMBOL_ORDER }, // die letzten Zeichen des Weges
];

/**
 * Ab wie vielen freigeschalteten Zeichen ist dieses Tastenwelt-Abzeichen fällig?
 * = Platz der SPÄTESTEN verlangten Einheit in der Reihenfolge DIESER Tastatur.
 * 0 heißt „gibt es hier nicht" (dann gilt das Abzeichen ohnehin als erledigt).
 */
function tastenweltSchwelle(units: readonly string[], lernweg: Lernweg): number {
  const order = introOrder(lernweg);
  let max = 0;
  for (const u of units) {
    const i = order.indexOf(u);
    if (i >= 0) max = Math.max(max, i + 1);
  }
  return max;
}

/**
 * Sitzen alle diese Einheiten? („Sitzt!"-Familie) — erst freigeschaltet, dann
 * nach demselben Maßstab beurteilt, mit dem das Programm neue Zeichen freigibt
 * ({@link isMastered} auf dem gleitenden Fenster). Nicht vorhandene Zeichen
 * zählen wie bei {@link hasUnits} als erledigt.
 */
function unitsMastered(
  p: TypingProgress,
  units: readonly string[],
  level: number,
  lernweg: Lernweg,
): boolean {
  const vorhanden = new Set(introOrder(lernweg));
  const noetig = units.filter((u) => vorhanden.has(u));
  if (noetig.length === 0) return true;
  const introduced = p.introduced ?? [];
  const set = new Set(introduced);
  if (!noetig.every((u) => set.has(u))) return false;
  const m = masteryForLevel(level);
  const base = personalBaseMs(introduced, p.letters, lernweg, m);
  return noetig.every((u) => isMastered(p.letters?.[u], m, lernweg, u, base));
}

/**
 * Alle Abzeichen, die sich allein aus dem ZUSTAND ergeben (Zähler, Tastenstand,
 * Sitzen, Lektionen) — ohne die Moment-Abzeichen, die nur im Augenblick des
 * Verdienens prüfbar sind (Fuchs, Nachteule, Tempo-Treppe …).
 *
 * Diese Trennung trägt zweierlei: die normale Vergabe am Rundenende UND den
 * stillen Nachtrag ({@link backfillSilently}) — nachgetragen wird genau das, was
 * ein Kind ohne neue Leistung schon verdient hätte.
 */
function earnedFromState(
  p: TypingProgress,
  t: BadgeTally,
  level: number,
  lernweg: Lernweg,
): Set<string> {
  const introduced = p.introduced;
  const earned = new Set<string>([
    ...tierIds(PERFECT_IDS, PERFECT_TIERS, t.perfect),
    ...tierIds(STREAK_IDS, STREAK_TIERS, t.bestCleanStreak),
    ...tierIds(ROUNDS_IDS, ROUNDS_TIERS, t.rounds),
    ...tierIds(HITS_IDS, HITS_TIERS, totalHits(p.letters)),
    ...tierIds(DAYS_IDS, DAYS_TIERS, t.days),
    ...tierIds(WEEK_IDS, WEEK_TIERS, t.weeks ?? 0),
    ...tierIds(STARS3_IDS, STARS3_TIERS, t.stars3),
    ...tierIds(LESSON_IDS, lessonTiersFor(lernweg), lessonsDoneCount(p, lernweg)),
    ...tierIds(XP_IDS, XP_LEVEL_TIERS, playerLevel(p.xp).level),
    ...tierIds(CHAIN_IDS, CHAIN_TIERS, t.bestCleanRun ?? 0),
    // Abenteuer-Familien werden in recordAdventure vergeben — hier nur zur
    // Selbstheilung mitgeprüft (falls ein Zähler ohne Abzeichen dasteht).
    ...tierIds(ADVENTURE_IDS, ADVENTURE_TIERS, t.adventures ?? 0),
    // Ebenso die Lese-Familien (vergeben werden sie in recordStoryEtappe).
    ...tierIds(STORY_IDS, STORY_TIERS, t.storiesDone ?? 0),
    ...tierIds(ETAPPE_IDS, ETAPPE_TIERS, t.etappen ?? 0),
  ]);
  if ((t.cleanAdventures ?? 0) >= 1) earned.add("trockener-frack");
  if ((t.cleanAdventures ?? 0) >= CLEAN_ADVENTURE_NEED) earned.add("immer-trocken");
  if ((t.fishCaught ?? 0) >= FISH_NEED) earned.add("fischfaenger");

  // Tastenwelt — hängt allein am Tastenstand und ist damit in beiden Lernwegen
  // gleich zu holen.
  // ★ E2 (24.09.2026): zwei Ausnahmen (Bauplan §6.3) - Pünktchen-Panda (ä ö ü)
  // und Schlangen-S (ß) gibt es auf Weg „en" NICHT, auch nicht „automatisch
  // erledigt" wie eine fehlende Taste (`hasUnits`s sonstige Regel). Ohne diese
  // Ausnahme würde ein Kind mit deutscher/Schweizer Tastatur „ö" für Weg „en"
  // an der 8. Grundtaste sehen ({@link achteGrundtasteFuerLayout}) und
  // Pünktchen-Panda unbeabsichtigt doch verdienen können.
  //
  // ★ E11a-5 (26.09.2026): dieselben zwei auf Weg „fr" - dort gibt es weder
  // ä/ü noch ß in der Reihenfolge. Ohne die Ausnahme hielte `hasUnits` sie auf
  // AZERTY für „gibt es hier nicht ⇒ erledigt" und vergäbe beide sofort, mit
  // einer Beschreibung („ä, ö et ü débloqués"), die nicht stimmt. Eine Tabelle
  // je Weg statt `lernweg === "en"`, damit ein vierter Weg sich melden muss.
  const KEIN_ABZEICHEN_AUF_WEG: Record<Lernweg, ReadonlySet<string>> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({
    de: new Set(),
    en: new Set(["puenktchen-panda", "schlangen-s"]),
    fr: new Set(["puenktchen-panda", "schlangen-s"]),
    // es: wie „en" (ES-F2: `lernwegDef("es")` ist ein Alias von „en") - weder
    // ä/ü noch ß kommen auf diesem Weg vor.
    es: new Set(["puenktchen-panda", "schlangen-s"]),
    // ★ O-IT: auf Weg „it" gibt es weder ä/ü noch ß - echt, kein Rückfall.
    it: new Set(["puenktchen-panda", "schlangen-s"]),
    // ★ O-PL: auf Weg „pl" gibt es weder ä/ü noch ß - echt, kein Rückfall.
    pl: new Set(["puenktchen-panda", "schlangen-s"]),
    // ★ O-TR: auf Weg "tr" gibt es weder ä noch ß (ö und ü schon, das
    // Abzeichen verlangt aber alle drei Umlaute) - echt, kein Rückfall.
    tr: new Set(["puenktchen-panda", "schlangen-s"]),
    // ★ O-CS: auf Weg „cs" gibt es weder ä/ü noch ß als Einheit (¨ ist
    // Totaste, das Abzeichen verlangt die drei Umlaute) - echt, kein Rückfall.
    cs: new Set(["puenktchen-panda", "schlangen-s"]),
  });
  for (const w of TASTENWELT) {
    if (KEIN_ABZEICHEN_AUF_WEG[lernweg].has(w.id)) continue;
    if (hasUnits(introduced, w.units, lernweg)) earned.add(w.id);
  }

  // ★ E10b-2: die Tastenwelt-Abzeichen, die es nur auf diesem Weg gibt
  // (Weg „fr": é è ç à, die Totasten ^ und ¨).
  for (const d of NUR_AUF_WEG[lernweg]) {
    if (hasUnits(introduced, ABZEICHEN_NUR_FR_EINHEITEN[d.id] ?? [], lernweg)) earned.add(d.id);
  }

  // Sitzt! — dieselbe Messlatte, mit der das Programm neue Zeichen freigibt.
  // ⚠️ E2/E6: GRUNDREIHE und LETTER_ORDER sind die des Weges „de" (Bauplan §6.3).
  if (unitsMastered(p, GRUNDREIHE, level, lernweg)) earned.add("feste-burg");
  if (unitsMastered(p, LETTER_ORDER, level, lernweg)) earned.add("buchstaben-baendiger");
  if (unitsMastered(p, DIGIT_ORDER, level, lernweg)) earned.add("zahlen-fels");
  if (unitsMastered(p, introOrder(lernweg), level, lernweg)) earned.add("nichts-wackelt");

  // Meisterprüfung: der Lehrgangs-Meister zählt Lektionen mit drei Sternen —
  // in „Mein Training" zählt der gleichwertige Tastenstand (curriculum.ts).
  // ★ E8 (24.09.2026): gegen `lektionenFuer(lernweg).length`, nicht die
  // deutschen `LESSONS.length` - sonst wäre das Abzeichen auf Weg „en"
  // unerreichbar (nur 19 statt 27 Lektionen, siehe `lessonTiersFor`).
  if (lessonsWithThreeStars(p, lernweg) >= lektionenFuer(lernweg).length) earned.add("lehrgangs-meister");
  return earned;
}

/**
 * Wächst der Katalog (siehe {@link CATALOG_VERSION}), trägt diese Funktion alles
 * schon Verdiente EINMALIG in den Spielstand ein — **ohne** es als „neu" zu
 * melden. Entscheidung Johannes 09.08.2026: Ein Kind wie Jano hätte sonst beim
 * ersten Rundenende ein Dutzend „Ta-daa" hintereinander gehört.
 *
 * Gibt die (ggf. ergänzte) Abzeichen-Tafel zurück; `t.catalog` wird mitgesetzt.
 */
function backfillSilently(
  p: TypingProgress,
  t: BadgeTally,
  now: number,
  lernweg: Lernweg,
): Record<string, number> {
  const have = p.badges ?? {};
  if ((t.catalog ?? 0) >= CATALOG_VERSION) return have;
  t.catalog = CATALOG_VERSION;
  // Ein Stand ganz ohne Abzeichen ist ein NEUES Kind — da gibt es nichts
  // nachzutragen, und es soll jedes Abzeichen selbst erleben.
  if (Object.keys(have).length === 0) return have;
  const schon = earnedFromState(p, t, p.level ?? 1, lernweg);
  const dazu = badgesFuerWeg(lernweg).filter((b) => schon.has(b.id) && !(b.id in have));
  if (dazu.length === 0) return have;
  return { ...have, ...Object.fromEntries(dazu.map((b) => [b.id, now])) };
}

/**
 * Rundenende: Zähler fortschreiben, neu verdiente Abzeichen ermitteln und in den
 * Spielstand schreiben. Gibt den neuen Spielstand und die NEU verdienten
 * Abzeichen (in Definitions-Reihenfolge) zurück — reine, testbare Funktion.
 * `now` kommt vom Aufrufer (wie bei recordRound).
 */
export function awardBadges(
  p: TypingProgress,
  round: BadgeRound,
  now: number,
  /** ★ E1 (24.09.2026): der Lernweg des Kindes (Tastenwelt, „Sitzt!", Lektionen). */
  lernweg: Lernweg,
): { progress: TypingProgress; newly: BadgeDef[] } {
  // 0) Stiller Nachtrag: Wächst der Katalog, holt sich ein bestehender Stand
  //    EINMALIG alles, was er längst verdient hat — ohne Klang, ohne Ansage.
  const t: BadgeTally = p.badgeTally ? { ...p.badgeTally } : seedTally(p);
  const have = backfillSilently(p, t, now, lernweg);

  // Werte, die VOR dem Fortschreiben der Zähler gelesen werden müssen.
  const warVorigePerfekt = t.lastPerfect === true;
  const pauseVorher = t.lastRoundTs ? now - t.lastRoundTs : 0;
  const tag = dayKey(now);
  const neuerTag = t.lastDay !== tag;

  // 1) Zähler fortschreiben (Altstand: einmalig aus dem Verlauf säen — die
  //    gerade beendete Runde steckt dank recordRound bereits im Verlauf).
  if (p.badgeTally) {
    t.rounds += 1;
    if (round.acc >= 1) t.perfect += 1;
    if (round.stars >= 3) t.stars3 += 1;
    if (round.acc >= CLEAN_ROUND_ACC) {
      t.cleanStreak += 1;
      t.bestCleanStreak = Math.max(t.bestCleanStreak, t.cleanStreak);
    } else {
      t.cleanStreak = 0;
    }
    if (neuerTag) t.days += 1;
  }
  // Übungswochen (auch für frisch gesäte Tallys — sie kennen keine Wochen).
  const woche = weekKey(now);
  if (t.lastWeek !== woche) {
    t.weeks = (t.weeks ?? 0) + 1;
    t.lastWeek = woche;
    t.weekDays = 0; // neue Woche → die Übungstage darin zählen von vorn
  }
  // Wochentag merken (Wochenend-Schreiber).
  const wochentag = new Date(now).getDay();
  if (wochentag === 6) t.satDone = true;
  if (wochentag === 0) t.sunDone = true;
  t.lastPerfect = round.acc >= 1;
  t.lastRoundTs = now;

  // Tages-Zähler der Geheim-Abzeichen (Marathon, Sternentag, Blitzsauber) und
  // die Übungstage der laufenden Woche („Volle Woche"). Der Tageswechsel wird
  // hier eigens bestimmt: Die Zeile weiter oben läuft nur für Stände, die schon
  // ein Tally haben — frisch gesäte hätten sonst nie einen „neuen Tag".
  if (neuerTag) {
    t.dayRounds = 0;
    t.dayPerfect = 0;
    t.dayStars3 = 0;
    t.weekDays = (t.weekDays ?? 0) + 1;
    t.lastDay = tag;
  }
  t.dayRounds = (t.dayRounds ?? 0) + 1;
  if (round.acc >= 1) t.dayPerfect = (t.dayPerfect ?? 0) + 1;
  if (round.stars >= 3) t.dayStars3 = (t.dayStars3 ?? 0) + 1;

  // Erste je gesehene Leistungsstufe („Aufsteiger" misst gegen sie).
  if (t.firstLevel === undefined) t.firstLevel = round.level;
  // Gelernte Sprachen („Sprachwechsler").
  if (round.lang && !geuebteSprachen(t.langs).includes(round.lang))
    t.langs = (t.langs ?? "") + round.lang;
  // Zähe Tasten merken: Was jetzt „hakt", darf später als „sitzt jetzt" gefeiert
  // werden. Gespeichert als Zeichenkette (jede Einheit ist genau ein Zeichen).
  const mNow = masteryForLevel(round.level);
  const introNow = p.introduced ?? [];
  const baseNow = personalBaseMs(introNow, p.letters, lernweg, mNow);
  let zaehSitzt = false;
  for (const u of introNow) {
    const stand = letterLevel(p.letters?.[u], mNow, lernweg, u, baseNow);
    if (stand === "hakt" && !(t.struggled ?? "").includes(u))
      t.struggled = (t.struggled ?? "") + u;
    else if (stand === "sitzt" && (t.struggled ?? "").includes(u)) zaehSitzt = true;
  }

  // Fehlerfreie Kette („Am Stück"): Sie läuft ÜBER Runden hinweg weiter. Ohne
  // Fehler wächst sie um die ganze Runde; mit Fehler zählt der Anlauf (leadClean)
  // noch zur alten Kette, danach beginnt sie beim Auslauf (trailClean) neu.
  const d = round.detail;
  if (d) {
    const bisher = t.cleanRun ?? 0;
    const fortgesetzt = bisher + d.leadClean;
    t.bestCleanRun = Math.max(t.bestCleanRun ?? 0, fortgesetzt, d.bestClean);
    t.cleanRun = d.hadError ? d.trailClean : fortgesetzt;
    // 10-Minuten-Abschrift: Ein Prüfungslauf sammelt Tippzeit, Anschläge und
    // Fehler über aufeinanderfolgende Runden. Eine längere Pause beendet ihn
    // („am Stück"), ebenso das Erreichen der zehn Minuten — danach beginnt ein
    // frischer Anlauf, egal wie er ausgegangen ist.
    if (pauseVorher > EXAM_GAP_MS) {
      t.examMs = 0;
      t.examKeys = 0;
      t.examErrors = 0;
    }
    t.examMs = (t.examMs ?? 0) + Math.max(0, d.ms);
    t.examKeys = (t.examKeys ?? 0) + Math.max(0, d.keys);
    t.examErrors = (t.examErrors ?? 0) + Math.max(0, d.errors);
  }

  // 2) Verdiente Abzeichen zusammentragen: erst alles, was am ZUSTAND hängt …
  const earned = earnedFromState(p, t, round.level, lernweg);

  // Runden-abhängige Abzeichen (nur im Moment des Verdienens prüfbar):
  const target = round.target ?? levelTargetCpm(round.level);
  // Bei einem Wortspiel wird Tempo nirgends gewertet (siehe `wortspiel`).
  // Zwei Wege herein, damit weder die Trainer noch die Tests etwas nachbauen
  // muessen: die Runde selbst, sonst die Feinauskunft der Tipp-Sitzung.
  const tempoZaehlt = !(round.wortspiel ?? round.detail?.wortspiel);
  // Flinker Fuchs: Tempo-Ziel erreicht UND sauber. Auf Stufe 1 gibt es kein
  // Tempo-Ziel — dort ist der Fuchs bewusst nicht zu holen.
  if (tempoZaehlt && target > 0 && round.cpm >= target && round.acc >= FOX_ACC)
    earned.add("flinker-fuchs");
  // Gemütliches Faultier: fehlerfrei, aber deutlich unter dem Tempo-Ziel — die
  // hörbare Botschaft „Genauigkeit schlägt Tempo". Ohne Tempo-Ziel (Stufe 1 oder
  // „Zeit lassen") gilt der feste Maßstab SLOTH_NO_TARGET_CPM: Gerade dort ist
  // das Abzeichen zu Hause, und gerade dort war es bis 14.08.2026 gesperrt.
  const slothLimit = target > 0 ? target * SLOTH_FRAC : SLOTH_NO_TARGET_CPM;
  if (tempoZaehlt && round.acc >= 1 && round.cpm > 0 && round.cpm < slothLimit)
    earned.add("gemuetliches-faultier");
  // Comeback-Känguru: Vorrunde 1 Stern, diese Runde 3 Sterne. Beim frisch
  // gesäten Tally steht die aktuelle Runde schon im Verlauf → vorletzten Wert
  // nehmen (seedTally setzte lastStars auf die LETZTE Runde = diese).
  const prevStars = p.badgeTally
    ? p.badgeTally.lastStars
    : (p.rounds ?? [])[(p.rounds?.length ?? 0) - 2]?.stars;
  if (prevStars === 1 && round.stars >= 3) earned.add("comeback-kaenguru");
  // Nachteule / Früher Vogel: nach der Uhr des Geräts.
  const hour = new Date(now).getHours();
  if (hour >= 21) earned.add("nachteule");
  if (hour < 7) earned.add("frueher-vogel");
  // Ferien-Held: mitten in den Sommerferien geübt (Juli oder August).
  const monat = new Date(now).getMonth();
  if (monat === 6 || monat === 7) earned.add("ferien-held");
  // Wochenend-Schreiber: einmal an einem Samstag UND einmal an einem Sonntag.
  if (t.satDone && t.sunDone) earned.add("wochenend-schreiber");
  // Doppelt genäht: zwei fehlerfreie Runden direkt hintereinander.
  if (warVorigePerfekt && round.acc >= 1) earned.add("doppelt-genaeht");
  // Zurück im Sattel: nach einer längeren Pause wieder da (Wiederkommen zählt).
  if (pauseVorher >= COMEBACK_DAYS * 24 * 3600 * 1000) earned.add("zurueck-im-sattel");
  // Zweite Geheim-Charge (09.08.2026) — alles aus den eben gepflegten Zählern.
  const datum = new Date(now);
  if (monat === 11 || monat === 0) earned.add("winterkind");
  if ((monat === 11 && datum.getDate() === 31) || (monat === 0 && datum.getDate() === 1))
    earned.add("jahreswechsel");
  if ((t.dayRounds ?? 0) >= 10) earned.add("tages-marathon");
  if ((t.dayStars3 ?? 0) >= 3) earned.add("sternentag");
  if ((t.dayPerfect ?? 0) >= 3) earned.add("blitzsauber");
  if ((t.weekDays ?? 0) >= 5) earned.add("volle-woche");
  if (d?.keyboardHidden && !d.hadError && round.acc >= 1) earned.add("blindflug");
  // ★ D1 Randfund (28.09.2026): „Viaje entre idiomas" / „Sprachwechsler"
  // zählte nur Deutsch UND Englisch - ein Kind auf Weg „fr"/„es", das seit
  // D1 Nr. 18 zusätzlich Englisch üben darf, kam nie dran. Jetzt: zwei
  // VERSCHIEDENE Sprachen, gleich welche (Weg „de" mit Deutsch und Englisch
  // wie bisher). Die Übezeit je Sprache stimmt seit `eventPack` fr/es.
  if (new Set(geuebteSprachen(t.langs)).size >= 2) earned.add("sprachwechsler");
  if (zaehSitzt) earned.add("zaehe-taste");
  if (t.firstLevel !== undefined && round.level >= t.firstLevel + 5)
    earned.add("aufsteiger");
  // Tempo-Treppe: absolute Anschlagszahlen nach echten Normen — aber nur an
  // einer Runde mit genug Substanz (SPEED_MIN_KEYS).
  if (tempoZaehlt && round.detail && round.detail.keys >= SPEED_MIN_KEYS)
    for (const stufe of SPEED_TIERS)
      if (round.cpm >= stufe.cpm && round.acc >= stufe.acc) earned.add(stufe.id);
  // Die 10-Minuten-Abschrift: Sind die zehn Minuten voll, wird abgerechnet —
  // höchstens 0,5 % Fehler. Danach beginnt ein frischer Anlauf, damit ein
  // verpatzter Versuch nicht für immer im Weg steht.
  if ((t.examMs ?? 0) >= EXAM_MS) {
    const keys = t.examKeys ?? 0;
    if (keys > 0 && (t.examErrors ?? 0) <= keys * EXAM_MAX_ERROR_RATE)
      earned.add("zehn-minuten-abschrift");
    t.examMs = 0;
    t.examKeys = 0;
    t.examErrors = 0;
  }
  // Die goldene Tastatur: alles frei, alles sitzt — und einmal Lehrplan-Tempo.
  if (
    earned.has("nichts-wackelt") &&
    (earned.has("tempo-160") || "tempo-160" in (p.badges ?? {}))
  )
    earned.add("goldene-tastatur");

  // 3) Neu = verdient, aber noch nicht im Spielstand. In Definitions-Reihenfolge.
  const newly = badgesFuerWeg(lernweg).filter((b) => earned.has(b.id) && !(b.id in have));
  const badges = newly.length
    ? { ...have, ...Object.fromEntries(newly.map((b) => [b.id, now])) }
    : have;

  t.lastStars = round.stars;
  return {
    progress: { ...p, badges, badgeTally: t },
    newly,
  };
}

/** Bilanz einer gelesenen Geschichten-Etappe (12 Zeilen aus der Bücherei). */
export interface StoryEtappeResult {
  /** Ohne einen einzigen Fehlanschlag getippt („Federleicht"). */
  clean: boolean;
  /** Mit dieser Etappe ist die ganze Geschichte zu Ende. */
  storyDone: boolean;
  /**
   * Die Geschichte wurde am SELBEN Tag begonnen und beendet („In einem Rutsch").
   * Nur zusammen mit `storyDone` sinnvoll.
   */
  sameDay?: boolean;
}

/**
 * Eine gelesene Etappe verbuchen: Lese-Zähler fortschreiben und die Lese-
 * Abzeichen vergeben. Bewusst GETRENNT von {@link awardBadges} (das die Runde
 * verbucht) — eine Etappe ist beides: eine Übungsrunde UND ein Stück Lektüre,
 * darum laufen im SerienTrainer beide Funktionen nacheinander.
 *
 * „Lesezeichen-Held" belohnt genau das Fortsetzen an einem ANDEREN Tag: Wer die
 * Geschichte gestern begonnen und heute weitergelesen hat, bekommt es.
 */
export function recordStoryEtappe(
  p: TypingProgress,
  result: StoryEtappeResult,
  now: number,
  /** ★ E1: der Lernweg des Kindes - für den stillen Nachtrag. */
  lernweg: Lernweg,
): { progress: TypingProgress; newly: BadgeDef[] } {
  const t: BadgeTally = p.badgeTally ? { ...p.badgeTally } : seedTally(p);
  const have = backfillSilently(p, t, now, lernweg);
  const day = dayKey(now);
  const weiterAnAnderemTag = !!t.lastStoryDay && t.lastStoryDay !== day;
  t.etappen = (t.etappen ?? 0) + 1;
  t.storyDayCount = t.lastStoryDay === day ? (t.storyDayCount ?? 0) + 1 : 1;
  t.lastStoryDay = day;
  if (result.storyDone) t.storiesDone = (t.storiesDone ?? 0) + 1;

  const earned = new Set<string>([
    ...tierIds(ETAPPE_IDS, ETAPPE_TIERS, t.etappen),
    ...tierIds(STORY_IDS, STORY_TIERS, t.storiesDone ?? 0),
  ]);
  if (result.clean) earned.add("federleicht");
  if (result.storyDone && result.sameDay) earned.add("in-einem-rutsch");
  if (weiterAnAnderemTag) earned.add("lesezeichen-held");
  if ((t.storyDayCount ?? 0) >= 3) earned.add("nimmersatt");
  // Lesenacht: eine Etappe am späten Abend — nach der Uhr des Geräts.
  if (new Date(now).getHours() >= 20) earned.add("lesenacht");

  const newly = BADGES.filter((b) => earned.has(b.id) && !(b.id in have));
  const badges = newly.length
    ? { ...have, ...Object.fromEntries(newly.map((b) => [b.id, now])) }
    : have;
  return { progress: { ...p, badges, badgeTally: t }, newly };
}

/** Gehört dieses Abzeichen zum LESEN (eigener Klang statt „Ta-daa")? */
export function isStoryBadge(def: BadgeDef): boolean {
  return (
    def.group === "Geschichten" ||
    def.group === "Lesestunde" ||
    def.group === "Lese-Kunststücke" ||
    def.id === "nimmersatt"
  );
}

/** Bilanz eines geschafften freien Laufs (Bauplan §4.6). */
export interface AdventureResult {
  /** Ohne ein einziges Untergehen/Ausrutschen (ganze Reise). */
  clean: boolean;
  /** Gefangene Bonus-Fische. */
  fish: number;
  /**
   * Ganze Polar-Expedition fehlerfrei bis zum Polarlicht-Finale gebracht
   * (nur die vollständige Reise, nicht der kurze Tages-Parcours) → „Polarlicht-Entdecker".
   */
  aurora?: boolean;
  /** Zonen-Arten, die dieser Lauf durchquert hat (für die Expeditions-Meilensteine). */
  zonesCleared?: readonly string[];
}

/**
 * Ende eines FREIEN Laufs (Sieg am Iglu): Abenteuer-Zähler fortschreiben und neu
 * verdiente Abenteuer-/Expeditions-Abzeichen vergeben — das Spiel zählt bewusst
 * nicht als Übezeit, aber Dranbleiben im Abenteuer wird über die Abzeichen belohnt.
 * Reine, testbare Funktion (Muster wie awardBadges); Tor-Durchgänge zählen NICHT
 * (nur das freiwillige Abenteuer/die freiwillige Reise).
 */
export function recordAdventure(
  p: TypingProgress,
  result: AdventureResult,
  now: number,
  /** ★ E1: der Lernweg des Kindes - für den stillen Nachtrag. */
  lernweg: Lernweg,
): { progress: TypingProgress; newly: BadgeDef[] } {
  const t: BadgeTally = p.badgeTally ? { ...p.badgeTally } : seedTally(p);
  const have = backfillSilently(p, t, now, lernweg);
  t.adventures = (t.adventures ?? 0) + 1;
  if (result.clean) t.cleanAdventures = (t.cleanAdventures ?? 0) + 1;
  t.fishCaught = (t.fishCaught ?? 0) + Math.max(0, result.fish);

  const earned = new Set<string>(
    tierIds(ADVENTURE_IDS, ADVENTURE_TIERS, t.adventures),
  );
  if ((t.cleanAdventures ?? 0) >= 1) earned.add("trockener-frack");
  if ((t.cleanAdventures ?? 0) >= CLEAN_ADVENTURE_NEED) earned.add("immer-trocken");
  if ((t.fishCaught ?? 0) >= FISH_NEED) earned.add("fischfaenger");
  // Expeditions-Familie (Polar-Expedition, freie Reise): einmalige Meilensteine —
  // welche besonderen Zonen der Lauf durchquert hat und ob er komplett fehlerfrei
  // bis zum Polarlicht kam. Einmal verdient, bleiben sie im Spielstand (kein
  // Tally nötig; ein Lauf ohne diese Zonen entfernt sie nie).
  const zonesCleared = new Set(result.zonesCleared ?? []);
  if (zonesCleared.has("cave")) earned.add("hoehlen-lauscher");
  if (zonesCleared.has("storm")) earned.add("sturm-trotzer");
  if (zonesCleared.has("station")) earned.add("funker-freund");
  if (result.aurora) earned.add("polarlicht-entdecker");

  const newly = BADGES.filter((b) => earned.has(b.id) && !(b.id in have));
  const badges = newly.length
    ? { ...have, ...Object.fromEntries(newly.map((b) => [b.id, now])) }
    : have;
  return { progress: { ...p, badges, badgeTally: t }, newly };
}

// --- „Nächstes Ziel" (für die Galerie + Ansage) ---------------------------------

export interface NextGoal {
  def: BadgeDef;
  /** Aktueller Zähler-Stand. */
  have: number;
  /** Schwelle des nächsten Abzeichens. */
  need: number;
  /** Einheit in Worten (für „Noch 3 fehlerfreie Runden bis …"). */
  unit: string;
  /** Dieselbe Einheit englisch (EN3, 19.09.2026) - „rounds without a mistake". */
  unitEn: string;
  /** Dieselbe Einheit französisch (E11a-5, 26.09.2026) - « séries sans erreur ». */
  unitFr: string;
  /** Dieselbe Einheit spanisch (ES-O, 27.09.2026) - « series sin errores ». */
  unitEs: string;
  /** Dieselbe Einheit italienisch (O-IT, 02.10.2026) - « giri senza errori ». */
  unitIt: string;
  /** Dieselbe Einheit polnisch (O-PL, 02.10.2026) - „rundy bez błędów" (nach Doppelpunkt, Nominativ). */
  unitPl: string;
  /** Dieselbe Einheit türkisch (O-TR, 02.10.2026) - "hatasız turlar" (nach Doppelpunkt, ohne Endung an der Zahl). */
  unitTr: string;
  /** Dieselbe Einheit tschechisch (O-CS, 03.10.2026) - „kola bez chyby" (nach Doppelpunkt, Nominativ Mehrzahl). */
  unitCs: string;
  unitBg: string;
  unitEl: string;
  unitHu: string;
  unitNl: string;
  unitPt: string;
  unitBr: string;
  unitRo: string;
  unitSv: string;
  unitUk: string;
}

/**
 * ★ E11a-5: die Einheit eines Ziels in der Bedienungssprache - EINE Stelle
 * statt `sprache === "en" ? g.unitEn : g.unit` im Regal (Falle 30).
 */
export function nextGoalUnit(g: NextGoal, sprache: BedienSprache): string {
  const feld: Record<BedienSprache, "unit" | "unitEn" | "unitFr" | "unitEs" | "unitIt" | "unitPl" | "unitTr" | "unitCs" | "unitBg" | "unitEl" | "unitHu" | "unitNl" | "unitPt" | "unitBr" | "unitRo" | "unitSv" | "unitUk"> = {
    de: "unit",
    en: "unitEn",
    fr: "unitFr",
    es: "unitEs",
    it: "unitIt",
    pl: "unitPl", // ★ O-PL
    tr: "unitTr", // ★ O-TR
    cs: "unitCs", // ★ O-CS (03.10.2026)
    // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
    bg: "unitBg",
    el: "unitEl",
    hu: "unitHu",
    nl: "unitNl",
    pt: "unitPt",
    br: "unitBr",
    ro: "unitRo",
    sv: "unitSv",
    uk: "unitUk",
  };
  return g[feld[sprache]];
}

/**
 * Das jeweils NÄCHSTE erreichbare Abzeichen jeder Zähler-Familie (TypingClub-
 * Muster: immer ein klares nächstes Ziel zeigen). Geheim-Abzeichen und die
 * Moment-Abzeichen (Fuchs) tauchen hier bewusst nicht auf.
 */
export function nextGoals(p: TypingProgress, lernweg: Lernweg): NextGoal[] {
  const t = p.badgeTally ?? seedTally(p);
  const lessonsDone = lessonsDoneCount(p, lernweg);
  // ★ EN3 (19.09.2026): je Familie auch die englische Einheit - „Next goal:
  // Zero-Mistake Ninja - rounds without a mistake: 3 of 5" (Glossar §3.2/§3.6).
  const families: Array<{
    ids: readonly string[];
    tiers: readonly number[];
    have: number;
    unit: string;
    unitEn: string;
    unitFr: string;
    unitEs: string;
    unitIt: string;
    unitPl: string;
    unitTr: string;
    unitCs: string;
    unitBg: string;
    unitEl: string;
    unitHu: string;
    unitNl: string;
    unitPt: string;
    unitBr: string;
    unitRo: string;
    unitSv: string;
    unitUk: string;
  }> = [
    { ids: PERFECT_IDS, tiers: PERFECT_TIERS, have: t.perfect, unit: "fehlerfreie Runden", unitEn: "rounds without a mistake", unitFr: "séries sans erreur", unitEs: "series sin errores", unitIt: "giri senza errori", unitPl: "rundy bez błędów", unitTr: "hatasız turlar", unitCs: "kola bez chyby", unitBg: "безгрешни кръга", unitEl: "γύροι χωρίς λάθη", unitHu: "hibátlan kör", unitNl: "foutloze rondes", unitPt: "rondas sem erros", unitBr: "rodadas sem erros", unitRo: "runde fără greșeli", unitSv: "felfria omgångar", unitUk: "раунди без помилок" },
    { ids: STREAK_IDS, tiers: STREAK_TIERS, have: t.cleanStreak, unit: "saubere Runden in Folge", unitEn: "clean rounds in a row", unitFr: "séries sans erreur d'affilée", unitEs: "series sin errores seguidas", unitIt: "giri senza errori di fila", unitPl: "czyste rundy z rzędu", unitTr: "arka arkaya kusursuz turlar", unitCs: "čistá kola za sebou", unitBg: "чисти кръга поред", unitEl: "καθαροί γύροι στη σειρά", unitHu: "tiszta kör egymás után", unitNl: "foutloze rondes op rij", unitPt: "rondas perfeitas seguidas", unitBr: "rodadas perfeitas seguidas", unitRo: "runde curate la rând", unitSv: "rena omgångar i rad", unitUk: "чисті раунди поспіль" },
    { ids: ROUNDS_IDS, tiers: ROUNDS_TIERS, have: t.rounds, unit: "Runden", unitEn: "rounds", unitFr: "séries", unitEs: "series", unitIt: "giri", unitPl: "rundy", unitTr: "turlar", unitCs: "kola", unitBg: "кръга", unitEl: "γύροι", unitHu: "kör", unitNl: "rondes", unitPt: "rondas", unitBr: "rodadas", unitRo: "runde", unitSv: "omgångar", unitUk: "раунди" },
    { ids: HITS_IDS, tiers: HITS_TIERS, have: totalHits(p.letters), unit: "richtige Anschläge", unitEn: "correct keystrokes", unitFr: "frappes justes", unitEs: "pulsaciones correctas", unitIt: "battute giuste", unitPl: "poprawne uderzenia", unitTr: "doğru vuruşlar", unitCs: "správné úhozy", unitBg: "верни знака", unitEl: "σωστά πατήματα", unitHu: "helyes leütés", unitNl: "juiste aanslagen", unitPt: "toques certos", unitBr: "toques certos", unitRo: "apăsări corecte", unitSv: "rätta anslag", unitUk: "правильні натискання" },
    { ids: DAYS_IDS, tiers: DAYS_TIERS, have: t.days, unit: "Übungstage", unitEn: "practice days", unitFr: "jours d'entrainement", unitEs: "días de práctica", unitIt: "giorni di esercizio", unitPl: "dni ćwiczeń", unitTr: "çalışma günleri", unitCs: "dny cvičení", unitBg: "дни с упражнения", unitEl: "ημέρες εξάσκησης", unitHu: "gyakorlónap", unitNl: "oefendagen", unitPt: "dias de prática", unitBr: "dias de prática", unitRo: "zile de exersare", unitSv: "övningsdagar", unitUk: "дні тренувань" },
    { ids: STARS3_IDS, tiers: STARS3_TIERS, have: t.stars3, unit: "3-Sterne-Runden", unitEn: "3-star rounds", unitFr: "séries à 3 étoiles", unitEs: "series con 3 estrellas", unitIt: "giri con 3 stelle", unitPl: "rundy z 3 gwiazdkami", unitTr: "3 yıldızlı turlar", unitCs: "kola za 3 hvězdičky", unitBg: "кръга с 3 звездички", unitEl: "γύροι με 3 αστέρια", unitHu: "3 csillagos kör", unitNl: "rondes met 3 sterren", unitPt: "rondas de 3 estrelas", unitBr: "rodadas com 3 estrelas", unitRo: "runde cu 3 stele", unitSv: "omgångar med 3 stjärnor", unitUk: "раунди з 3 зірками" },
    { ids: LESSON_IDS, tiers: lessonTiersFor(lernweg), have: lessonsDone, unit: "Lektionen", unitEn: "lessons", unitFr: "leçons", unitEs: "lecciones", unitIt: "lezioni", unitPl: "lekcje", unitTr: "dersler", unitCs: "lekce", unitBg: "урока", unitEl: "μαθήματα", unitHu: "lecke", unitNl: "lessen", unitPt: "lições", unitBr: "lições", unitRo: "lecții", unitSv: "lektioner", unitUk: "уроки" },
    { ids: XP_IDS, tiers: XP_LEVEL_TIERS, have: playerLevel(p.xp).level, unit: "Spielstufen", unitEn: "levels", unitFr: "niveaux", unitEs: "niveles", unitIt: "livelli", unitPl: "poziomy", unitTr: "seviyeler", unitCs: "úrovně", unitBg: "нива в играта", unitEl: "επίπεδα παιχνιδιού", unitHu: "játékszint", unitNl: "levels", unitPt: "níveis de jogo", unitBr: "níveis de jogo", unitRo: "niveluri de joc", unitSv: "spelnivåer", unitUk: "рівні гри" },
    { ids: ADVENTURE_IDS, tiers: ADVENTURE_TIERS, have: t.adventures ?? 0, unit: "Eisschollen-Abenteuer", unitEn: "Ice Floe adventures", unitFr: "aventures de la banquise", unitEs: "aventuras de la banquisa", unitIt: "avventure sui lastroni", unitPl: "przygody na krach", unitTr: "buz kütlesi maceraları", unitCs: "dobrodružství na ledových krách", unitBg: "приключения на ледените късове", unitEl: "περιπέτειες στα παγοκομμάτια", unitHu: "jégtáblás kaland", unitNl: "IJsschotsen-avonturen", unitPt: "aventuras nos blocos de gelo", unitBr: "aventuras nas placas de gelo", unitRo: "aventuri pe sloiuri de gheață", unitSv: "isflaksäventyr", unitUk: "пригоди на крижинах" },
    { ids: ["fischfaenger"], tiers: [FISH_NEED], have: t.fishCaught ?? 0, unit: "gefangene Fische", unitEn: "fish caught", unitFr: "poissons attrapés", unitEs: "peces atrapados", unitIt: "pesci presi", unitPl: "złowione rybki", unitTr: "yakalanan balıklar", unitCs: "ulovené rybky", unitBg: "уловени рибки", unitEl: "ψάρια που πιάστηκαν", unitHu: "fogott hal", unitNl: "gevangen vissen", unitPt: "peixes apanhados", unitBr: "peixes pescados", unitRo: "pești prinși", unitSv: "fångade fiskar", unitUk: "спіймані рибки" },
    // Ausbau 09.08.2026 — ohne diese Zeilen hätten die neuen Familien kein
    // „nächstes Ziel", und genau das erzeugt das Gefühl „da kommt gleich was".
    { ids: CHAIN_IDS, tiers: CHAIN_TIERS, have: t.bestCleanRun ?? 0, unit: "Anschläge am Stück ohne Fehler", unitEn: "keystrokes in a row without a mistake", unitFr: "frappes justes d'affilée", unitEs: "pulsaciones correctas seguidas sin error", unitIt: "battute giuste di fila senza errori", unitPl: "poprawne uderzenia z rzędu bez błędu", unitTr: "arka arkaya hatasız vuruşlar", unitCs: "správné úhozy za sebou bez chyby", unitBg: "знака поред без грешка", unitEl: "σωστά πατήματα στη σειρά χωρίς λάθος", unitHu: "leütés egyvégtében hiba nélkül", unitNl: "aanslagen achter elkaar zonder fout", unitPt: "toques seguidos sem erros", unitBr: "toques certos seguidos sem erro", unitRo: "apăsări corecte la rând, fără nicio greșeală", unitSv: "anslag i följd utan fel", unitUk: "натискань поспіль без помилки" },
    { ids: WEEK_IDS, tiers: WEEK_TIERS, have: t.weeks ?? 0, unit: "Übungswochen", unitEn: "practice weeks", unitFr: "semaines d'entrainement", unitEs: "semanas de práctica", unitIt: "settimane di esercizio", unitPl: "tygodnie ćwiczeń", unitTr: "çalışma haftaları", unitCs: "týdny cvičení", unitBg: "седмици с упражнения", unitEl: "εβδομάδες εξάσκησης", unitHu: "gyakorlóhét", unitNl: "oefenweken", unitPt: "semanas de prática", unitBr: "semanas de prática", unitRo: "săptămâni de exersare", unitSv: "övningsveckor", unitUk: "тижні тренувань" },
    { ids: STORY_IDS, tiers: STORY_TIERS, have: t.storiesDone ?? 0, unit: "gelesene Geschichten", unitEn: "stories read", unitFr: "histoires lues", unitEs: "cuentos leídos", unitIt: "storie lette", unitPl: "przeczytane opowiadania", unitTr: "okunan öyküler", unitCs: "přečtené příběhy", unitBg: "прочетени истории", unitEl: "ιστορίες που διαβάστηκαν", unitHu: "elolvasott történet", unitNl: "gelezen verhalen", unitPt: "histórias lidas", unitBr: "histórias lidas", unitRo: "povești citite", unitSv: "lästa berättelser", unitUk: "прочитані історії" },
    { ids: ETAPPE_IDS, tiers: ETAPPE_TIERS, have: t.etappen ?? 0, unit: "gelesene Etappen", unitEn: "stages read", unitFr: "étapes lues", unitEs: "etapas leídas", unitIt: "tappe lette", unitPl: "przeczytane etapy", unitTr: "okunan bölümler", unitCs: "přečtené díly", unitBg: "прочетени части", unitEl: "μέρη που διαβάστηκαν", unitHu: "elolvasott szakasz", unitNl: "gelezen delen", unitPt: "partes lidas", unitBr: "partes lidas", unitRo: "părți citite", unitSv: "lästa delar", unitUk: "прочитані частини" },
  ];
  // Tastenwelt: aus der Tabelle abgeleitet, nach Fälligkeit sortiert — so nennt
  // die Galerie „noch 3 Zeichen bis Satzzeichen-Sammler".
  const tastenwelt = [
    ...TASTENWELT,
    // ★ E10b-2: die Abzeichen nur dieses Weges (siehe `NUR_AUF_WEG`).
    ...NUR_AUF_WEG[lernweg].map((d) => ({ id: d.id, units: ABZEICHEN_NUR_FR_EINHEITEN[d.id] ?? [] })),
  ];
  const tw = tastenwelt.map((w) => ({ id: w.id, need: tastenweltSchwelle(w.units, lernweg) }))
    .filter((w) => w.need > 0)
    .sort((a, b) => a.need - b.need);
  families.push({
    ids: tw.map((w) => w.id),
    tiers: tw.map((w) => w.need),
    have: countUnits(p.introduced, introOrder(lernweg), lernweg),
    unit: "freigeschaltete Zeichen",
    unitEn: "characters unlocked",
    unitFr: "caractères débloqués",
    unitEs: "caracteres desbloqueados",
    unitIt: "caratteri sbloccati",
    unitPl: "odblokowane znaki",
    unitTr: "kilidi açılan işaretler",
    unitCs: "odemčené znaky",
    unitBg: "отключени знака",
    unitEl: "χαρακτήρες που ξεκλειδώθηκαν",
    unitHu: "feloldott jel",
    unitNl: "vrijgespeelde tekens",
    unitPt: "carateres desbloqueados",
    unitBr: "caracteres desbloqueados",
    unitRo: "caractere deblocate",
    unitSv: "upplåsta tecken",
    unitUk: "відкриті знаки",
  });
  const have = p.badges ?? {};
  const goals: NextGoal[] = [];
  for (const f of families) {
    for (let i = 0; i < f.tiers.length; i++) {
      const id = f.ids[i];
      if (id in have) continue;
      const def = BY_ID.get(id);
      if (def) goals.push({ def, have: f.have, need: f.tiers[i], unit: f.unit, unitEn: f.unitEn, unitFr: f.unitFr, unitEs: f.unitEs, unitIt: f.unitIt, unitPl: f.unitPl, unitTr: f.unitTr, unitCs: f.unitCs, unitBg: f.unitBg, unitEl: f.unitEl, unitHu: f.unitHu, unitNl: f.unitNl, unitPt: f.unitPt, unitBr: f.unitBr, unitRo: f.unitRo, unitSv: f.unitSv, unitUk: f.unitUk });
      break; // nur das NÄCHSTE Ziel der Familie
    }
  }
  // Die am ehesten erreichbaren zuerst (relativer Fortschritt).
  return goals.sort((a, b) => b.have / b.need - a.have / a.need);
}

/** Verdiente Abzeichen (Definitions-Reihenfolge) mit Verdien-Zeitpunkt. */
export function earnedBadges(p: TypingProgress): Array<{ def: BadgeDef; ts: number }> {
  const have = p.badges ?? {};
  // ★ E10b-2: auch die Abzeichen nur eines Weges - ein Stand auf „de"/„en"
  // trägt sie nie, das Ergebnis bleibt dort dasselbe.
  return [...BADGES, ...ABZEICHEN_NUR_FR].filter((b) => b.id in have).map((b) => ({ def: b, ts: have[b.id] }));
}

/**
 * Der Anzeige- und Sprech-Name eines Abzeichens je Tonlage: im Kinder-Profil
 * die Maskottchen-Namen, ab 11 der trockene Zweitname (falls vorhanden). IDs
 * und verdiente Abzeichen sind davon unberührt.
 *
 * Die Grenze steckt in `usesMascots` und NICHT hier als `skin === "kind"` —
 * die Achse „Maskottchen" ist eine eigene und hat schon einmal ein Profil
 * stillschweigend in den falschen Zweig rutschen lassen, ohne dass die
 * Typprüfung etwas gemerkt hätte (30.07.).
 */
export function badgeName(def: BadgeDef, skin: Skin, sprache: BedienSprache = "de"): string {
  // ★ EN3 (19.09.2026): in der englischen Bedienung der englische Name
  // (`badgesEn.ts`) - dieselbe Weiche zwischen Maskottchen und Zweitname.
  // ★ E11a-5: über die Tabelle je Sprache, auch „fr" (`badgesFr.ts`).
  const fremd = ABZEICHEN_JE_SPRACHE[sprache]?.[def.id];
  if (fremd) return usesMascots(skin) ? fremd.name : (fremd.nameNeutral ?? fremd.name);
  return usesMascots(skin) ? def.name : (def.nameNeutral ?? def.name);
}

/**
 * ★ E11a-5 (26.09.2026): der Katalog je Bedienungssprache - `null` für
 * Deutsch (es gilt `BadgeDef` selbst). EINE Tabelle statt der früheren
 * vier Weichen `sprache === "en" ? ABZEICHEN_EN[…] : undefined`, die „fr"
 * still auf Deutsch hätten fallen lassen (Leitfaden Falle 30).
 */
const ABZEICHEN_JE_SPRACHE: Record<BedienSprache, Readonly<Record<string, AbzeichenTextEn>> | null> = {
  de: null,
  en: ABZEICHEN_EN,
  fr: ABZEICHEN_FR,
  es: ABZEICHEN_ES,
  it: ABZEICHEN_IT,
  pl: ABZEICHEN_PL, // ★ O-PL (02.10.2026)
  tr: ABZEICHEN_TR, // ★ O-TR (02.10.2026)
  cs: ABZEICHEN_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): eigene Tabellen; Englisch nur für einen einzelnen fehlenden Eintrag.
  bg: eintraegeOderEn(ABZEICHEN_BG, ABZEICHEN_EN),
  el: eintraegeOderEn(ABZEICHEN_EL, ABZEICHEN_EN),
  hu: eintraegeOderEn(ABZEICHEN_HU, ABZEICHEN_EN),
  nl: eintraegeOderEn(ABZEICHEN_NL, ABZEICHEN_EN),
  pt: eintraegeOderEn(ABZEICHEN_PT, ABZEICHEN_EN),
  br: eintraegeOderEn(ABZEICHEN_BR, ABZEICHEN_EN),
  ro: eintraegeOderEn(ABZEICHEN_RO, ABZEICHEN_EN),
  sv: eintraegeOderEn(ABZEICHEN_SV, ABZEICHEN_EN),
  uk: eintraegeOderEn(ABZEICHEN_UK, ABZEICHEN_EN),
};

/** Dasselbe für die Familien-Überschriften. */
const GRUPPEN_JE_SPRACHE: Record<BedienSprache, Readonly<Record<string, string>> | null> = {
  de: null,
  en: ABZEICHEN_GRUPPEN_EN,
  fr: ABZEICHEN_GRUPPEN_FR,
  es: ABZEICHEN_GRUPPEN_ES,
  it: ABZEICHEN_GRUPPEN_IT,
  pl: ABZEICHEN_GRUPPEN_PL, // ★ O-PL (02.10.2026)
  tr: ABZEICHEN_GRUPPEN_TR, // ★ O-TR (02.10.2026)
  cs: ABZEICHEN_GRUPPEN_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): eigene Tabellen; Englisch nur für einen einzelnen fehlenden Eintrag.
  bg: eintraegeOderEn(ABZEICHEN_GRUPPEN_BG, ABZEICHEN_GRUPPEN_EN),
  el: eintraegeOderEn(ABZEICHEN_GRUPPEN_EL, ABZEICHEN_GRUPPEN_EN),
  hu: eintraegeOderEn(ABZEICHEN_GRUPPEN_HU, ABZEICHEN_GRUPPEN_EN),
  nl: eintraegeOderEn(ABZEICHEN_GRUPPEN_NL, ABZEICHEN_GRUPPEN_EN),
  pt: eintraegeOderEn(ABZEICHEN_GRUPPEN_PT, ABZEICHEN_GRUPPEN_EN),
  br: eintraegeOderEn(ABZEICHEN_GRUPPEN_BR, ABZEICHEN_GRUPPEN_EN),
  ro: eintraegeOderEn(ABZEICHEN_GRUPPEN_RO, ABZEICHEN_GRUPPEN_EN),
  sv: eintraegeOderEn(ABZEICHEN_GRUPPEN_SV, ABZEICHEN_GRUPPEN_EN),
  uk: eintraegeOderEn(ABZEICHEN_GRUPPEN_UK, ABZEICHEN_GRUPPEN_EN),
};

/** Die festen Zahlen aus diesem Katalog - unabhängig vom Kind. */
const ABZEICHEN_ZAHLEN_FEST = {
  lektionen: LESSONS.length,
  trockeneAbenteuer: CLEAN_ADVENTURE_NEED,
  fische: FISH_NEED,
  pauseTage: COMEBACK_DAYS,
};

/**
 * Die Beschreibung (Bedingung) eines Abzeichens in der Bedienungssprache -
 * ohne Angabe Deutsch, also genau `def.description` (EN3, 19.09.2026).
 *
 * @param lernweg ★ E2 (24.09.2026): nur für „grundstellungs-gorilla" (Bauplan
 *   §6.3) - die Grundreihe unterscheidet sich je Weg. Ohne Angabe „de", wie
 *   jeder Aufrufer vor E2: Die deutsche Beschreibung bleibt unverändert, egal
 *   was hier steht (D2 - der Text hängt nur an dem einen englischen Eintrag).
 */
export function badgeBeschreibung(
  def: BadgeDef,
  sprache: BedienSprache = "de",
  lernweg: Lernweg = "de",
): string {
  const fremd = ABZEICHEN_JE_SPRACHE[sprache]?.[def.id];
  if (!fremd) return def.description;
  const zahlen: AbzeichenZahlen = { ...ABZEICHEN_ZAHLEN_FEST, lernweg };
  return typeof fremd.description === "function" ? fremd.description(zahlen) : fremd.description;
}

/** Das Motiv der Medaille in Worten, in der Bedienungssprache (EN3; „fr" seit E11a-5). */
export function badgeBild(def: BadgeDef, sprache: BedienSprache = "de"): string {
  const fremd = ABZEICHEN_JE_SPRACHE[sprache]?.[def.id];
  return fremd ? fremd.bildbeschreibung : def.bildbeschreibung;
}

/** Der Name einer Abzeichen-Familie (Überschrift im Regal) in der Bedienungssprache (EN3; „fr" seit E11a-5). */
export function badgeGruppe(group: string, sprache: BedienSprache = "de"): string {
  return GRUPPEN_JE_SPRACHE[sprache]?.[group] ?? group;
}
