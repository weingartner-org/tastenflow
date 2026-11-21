/**
 * Ein Übungslauf (eine Runde Zeilen) des Tipptrainers — gemeinsam genutzt von
 * den geführten Lektionen UND der adaptiven Lernumgebung „Mein Training".
 *
 * Zeichen-für-Zeichen-Rückmeldung (grün/rot, „erst richtig, dann weiter"), große
 * Bildschirmtastatur mit Hervorhebung der nächsten Taste, Töne, optionale
 * Sprachausgabe, Tempo/Genauigkeit, Profil-Texte (Kind/Erwachsen) und — neu —
 * Telemetrie pro EINZELNEM Buchstaben (richtig/falsch + Anschlagszeit) als
 * Grundlage der individuellen Auswertung. Siehe [[project_zehnfinger_trainer]].
 */
import { schriftZu, useSchriftart } from "@/lib/typing/schriftart";
import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  BadgeDef,
  Hand,
  KeyEvent,
  LAUFWEITE_CH_JE_STUFE,
  Lang,
  laufweiteWirksamerFaktor,
  naechsterTakt,
  gleitDauer,
  zeilenUebergang,
  Stufe,
  TaskEvent,
  ZeichenabstandFaktor,
  ZeilenArt,
  accuracy as accuracyOf,
  badgeBeschreibung,
  badgeName,
  bedienCopy,
  fingerName,
  charLabel,
  clearPracticeFocusRequest,
  copyFor,
  cpm as cpmOf,
  FOCUS_FIELD_EVENT,
  focusPracticeField,
  fingerForChar,
  FINGER_ANSAGE_JE_SPRACHE,
  fmtPercent,
  formatPracticeSpoken,
  formatPracticeTime,
  getPracticeMs,
  inZusatzliste,
  isRealWord,
  isSpeaking,
  sprachausgabeBeschaeftigt,
  needsShift,
  notePracticeActivity,
  practiceIdleCap,
  wochenzielAnsage,
  isStoryBadge,
  playBadgeSound,
  playStoryBadgeSound,
  playErrorSound,
  playKeyTick,
  playStarReward,
  playSuccessSound,
  primeSpeech,
  roundStars,
  SHIFT_UNIT,
  shiftHandFor,
  skinForStufe,
  ansageAufstieg,
  ansageFuerZeilenart,
  ansageSchluesselFuerZeilenart,
  ansageNeueAbzeichen,
  ansageUebezeit,
  ansageUmschaltSeite,
  ansageWerte,
  ansageZeilenstand,
  // ★ E4 (25.09.2026, Bauplan §4.3 Punkt 6, §14 E4): Totasten-Statistik und
  // Feststelltaste-Hinweis - nur auf Tastaturen wirksam, deren Lehrgang eine
  // eigene Totasten-Einheit lehrt (ES-P7a-Behebung M1: vorher nur fr).
  hatLehrgangsTotasten,
  activeLayout,
  activeLayoutId,
  bottomLabelsFuer,
  kombizeichenZu,
  umschaltVorTilde,
  umschaltVorTildeText,
  polnischerBuchstabeHinweis,
  totasteAnsage,
  totasteName,
  grossbuchstabeWeg,
  totasteWartetText,
  type Kombizeichen,
  speakChar,
  zeileGanzSprechtext,
  speakSequence,
  speakUi,
  spokenLabel,
  starsSpokenFor,
  vorleseSprache,
  spokenMs,
  takePracticeDelta,
  takePracticeFocusRequest,
  typingGapMs,
  readPlanAt,
  useTypingA11y,
  AUSBLENDEN_ZEICHEN,
  AUSBLENDEN_SOFORT,
  CURSOR_STELLE_MITTE,
  CURSOR_STELLE_VORGABE,
  useVoice,
  istWortspiel,
  zeilenLuecke,
} from "@/lib/typing";
import { melodieAnschlag, useMelodie } from "@/lib/typing/melodie";
import { isSoundMuted } from "@/lib/typing/sound";
import { MelodieLadeanzeige } from "./MelodieLadeanzeige";
import { istAltGrBuchstabe, istKuerzel, istZeichenAnschlag } from "@/lib/typing/zeichenTaste";
import type { Lernweg } from "@/lib/typing/lernweg";
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { grossFuer, kleinFuer } from "@/lib/typing/sprachRegister";
import { statistikSchluessel } from "@/lib/typing/letters";
import { useContrast } from "@/lib/contrast";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { BadgeMedal } from "./BadgeMedal";
import { KeyboardPanel, keyboardHidden } from "./KeyboardPanel";
import { Hinweisflaeche } from "./Zeigerhinweis";
import { naechsteVariante } from "@/lib/typing/rundenAbwechslung";
import { Tipp } from "@/components/Tipp";
import { useTypingItem } from "./useTypingItem";
import { useFocusTrap } from "./useFocusTrap";
import { FeststelltasteFenster } from "./FeststelltasteWarnung";
import { Merkfenster } from "./Merkfenster";
import { useAnrede } from "./useAnrede";
// ★ L7 (19.09.2026): beim Schreiben nur die Übungszeile hell (Teil von CVI).
import { CviAbdunkeln } from "./CviAbdunkeln";
import { FRANZ_EINGABE } from "@/lib/typing/eingabeVarianten";
import {
  grossschreibungFenster,
  umschaltFenster,
  type Fenstertext,
} from "@/lib/typing/merkfensterTexte";
import {
  grossschreibungGesehen,
  merkeGrossschreibungGesehen,
  setzeUmschaltFensterAus,
  zeigeUmschaltFenster,
} from "@/lib/typing/merkfenster";
import {
  ZeilenMesser,
  wackeligZaehlen,
  zeilenMessFelder,
} from "@/lib/typing/zeilenMessung";

/** Anschlagszeiten über dieser Grenze (ms) gelten als Denkpause, nicht als Tempo. */
const MAX_DWELL = 3000;

/**
 * Höchstens so viele Anschläge nimmt `tasteAnnehmen` aus einer
 * Zeilenpause mit. Die Pause dauert Bruchteile einer Sekunde; mehr als eine
 * Handvoll kommt darin nur, wenn jemand auf der Tastatur liegt - und das soll
 * nicht als Zeile nachgespielt werden.
 */
const MITNEHMEN_HOECHSTENS = 20;

/**
 * Schritt M: welche Taste - `code` bleibt beim Loslassen dieselbe, auch wenn
 * dazwischen die Umschalttaste kam (`key` wäre dann „F" statt „f").
 */
const tastenKennung = (e: { code?: string; key: string }): string =>
  e.code || e.key.toLowerCase();

/**
 * Liegt gerade ein modaler Vollbild-Dialog ÜBER dem Trainer (z. B. die Polar-
 * Expedition-Bühne, das Tor vor einer neuen Taste, ein Feier-/Hilfe-Dialog)? Solche
 * Overlays liegen als `role="dialog" aria-modal="true"` im Portal an <body> und haben
 * den Fokus auf ihrem eigenen Spielfeld (`role="application"`). Dann darf das Tippfeld
 * den Fokus/Tastendruck NICHT an sich reißen: Ohne diese Sperre riss der Dokument-
 * Tastenhorcher („einfach losschreiben", s. u.) den Fokus mitten im Spiel zurück ins
 * Tippfeld — danach reagierte die Expedition nicht mehr auf Tasten und die Vorlese-
 * Stimme sagte den zu tippenden Buchstaben statt der Spielansage (Johannes 15.07.:
 * „der Fokus ist nicht im Fenster … egal welche Taste, sagt die Stimme ‚s‘").
 */
function modalOverlayOpen(): boolean {
  return (
    typeof document !== "undefined" &&
    !!document.querySelector('[role="dialog"][aria-modal="true"]')
  );
}

/**
 * ★ Nr 27 der Fokusziele (22.08.2026): Steht der Fokus gerade IM offenen
 * Einstellungs-Bereich (Zahnrad)?
 *
 * Wer dort „Lektionen" betätigt, tauscht die ganze Übungskarte aus - der
 * Bereich selbst bleibt aber offen, und der Knopf steht weiterhin da. Johannes'
 * Entscheidung dazu ist R3: Der Fokus BLEIBT auf dem Knopf, damit man
 * anschließend gleich den nächsten Schalter erreicht. Ohne diese Sperre zog das
 * frisch aufgebaute Tippfeld ihn sofort zu sich, und wer die drei Übungsarten
 * durchprobieren wollte, musste sich nach jedem Versuch zurücktabben.
 *
 * Die Sperre gilt NUR für das selbsttätige Nachziehen des Feldes. Eine
 * ausdrückliche Anforderung (Alt + E, Escape, Alt + B) kommt über
 * `FOCUS_FIELD_EVENT` und wird davon nicht berührt - dort hat jemand genau das
 * verlangt.
 */
function fokusStehtInDenEinstellungen(): boolean {
  if (typeof document === "undefined") return false;
  const bereich = document.getElementById("tippen-einstellungen");
  return !!bereich && bereich.contains(document.activeElement);
}

/**
 * ★ Steht der Fokus auf dem SPRACHSCHALTER der Kopfzeile (19.09.2026)?
 *
 * Seit er für jeden da ist, zieht er die Übungssprache mit - die Übungskarte
 * bekommt neue Zeilen, und ohne diese Sperre holte sich das Tippfeld den
 * Fokus. Die Regel des Schalters ist aber: Der Fokus bleibt auf ihm, ein
 * zweiter Druck macht es rückgängig (Bauplan §3.3). Dieselbe Bauart wie bei
 * {@link fokusStehtInDenEinstellungen}; erkannt wird er an
 * `data-sprachschalter` (`AppKopfzeile.tsx`).
 */
function fokusStehtAufDemSprachschalter(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.activeElement;
  return !!el && el instanceof Element && !!el.closest("[data-sprachschalter]");
}

/**
 * ★★ 29.08.2026 - DIE ANSAGE FRAGT DEN GENERATOR (Entscheidung Johannes nach
 * Jens' Rückmeldung). Bis dahin stand hier ein `lineIsNonsense`, das den fertigen
 * Text ansah und das Lexikon fragte, ob JEDES Wort echt sei. Das ging an beiden
 * Enden schief - gemessen an englischen Runden (`scripts/_englisch.mts`):
 *   • Ein einziger Zufallstreffer („ada", „öl") kippte eine ganze Unsinn-Zeile
 *     auf „echte Wörter".
 *   • Eine Zeile ohne Buchstaben galt NIE als Unsinn: „133 61 236", „6° 633°"
 *     und „[166, 7]" wurden als „echte Wörter" angekündigt - **63 % aller
 *     Zeilen auf dem Stand „+ Zahlen"** bekamen so die falsche Ansage.
 * Jetzt trägt jede Zeile ihr Etikett vom Generator mit (`RoundLine.art`), und
 * Zahlenzeilen haben eine eigene Ansage. Die Zuordnung steht in `vorlesen.ts`.
 */


/**
 * ★ DIE ANFASSER UNTER DER ÜBUNGSZEILE (Johannes 12./13.11.2026): zwei Punkte
 * am unteren Rand des Feldes.
 *
 * - Der VOLLE Punkt steht genau unter dem Schreibzeiger. Wer ihn von der Mitte
 *   nach links zieht, holt den Schreibzeiger mit - bis ganz an den linken Rand
 *   (12.11.: mehrere Meldungen, die den Schreibzeiger lieber links hätten).
 * - Der HOHLE Punkt links davon (13.11.) zeigt, wo das Geschriebene ganz
 *   verschwunden ist. Dicht am Schreibzeiger = weg nach einem Zeichen, ganz am
 *   linken Rand = es blendet gar nicht aus. Er ersetzt den Schalter
 *   „Geschriebenes ausblenden" in den Einstellungen.
 *
 * Beide zeigen beim Überfahren einen Hinweis (`Hinweisflaeche`), Doppelklick
 * stellt die Vorgabe wieder her.
 *
 * ★ Nur für Sehende, darum bewusst OHNE Tastenweg und vor Sprachausgabe und
 * Braillezeile verborgen (`aria-hidden`, kein Tabstopp): Sie ändern nichts am
 * Feld darunter, nur wie die sichtbare Zeile aussieht. Der Fokus bleibt beim
 * Ziehen im Eingabefeld.
 */
function ZeilenAnfasser({
  stelle,
  setStelle,
  ausblendZeichen,
  setAusblendZeichen,
  zeichenBreite,
  feldRef,
  hilfeZeiger,
  hilfeAusblenden,
  nurAusblenden = false,
}: {
  stelle: number;
  setStelle: (anteil: number) => void;
  ausblendZeichen: number;
  setAusblendZeichen: (zeichen: number) => void;
  /** Mittlere Breite eines Zeichens der Zeile in px (misst `PromptText`). */
  zeichenBreite: number;
  feldRef: React.RefObject<HTMLTextAreaElement | null>;
  hilfeZeiger: string;
  hilfeAusblenden: string;
  /**
   * Auf der Seite (ab 2 Zeilen) nur der hohle Ring - der Schreibzeiger wandert
   * dort selbst. Der Ring zeigt weiter, ob alles stehen bleibt (ganz links) oder
   * ausgeblendet wird (Johannes 13.11.2026).
   */
  nurAusblenden?: boolean;
}) {
  const schieneRef = useRef<HTMLDivElement>(null);
  const [zieht, setZieht] = useState<"zeiger" | "ausblenden" | null>(null);
  // Gemessen wird die Zeichenbreite nur in der einzeiligen Ansicht. Wer gleich
  // auf der Seite startet, hat dort noch keinen Messwert - dann aus der Schrift.
  if (!(zeichenBreite > 0)) {
    const px = feldRef.current ? parseFloat(getComputedStyle(feldRef.current).fontSize) : 0;
    zeichenBreite = px > 0 ? px * 0.6 : 0;
  }
  const anteilBei = (clientX: number): number | null => {
    const r = schieneRef.current?.getBoundingClientRect();
    if (!r || r.width <= 0) return null;
    const a = (clientX - r.left) / r.width;
    // Nahe der Vorgabe (goldener Schnitt) und der Mitte rastet er ein.
    if (Math.abs(a - CURSOR_STELLE_VORGABE) < 0.02) return CURSOR_STELLE_VORGABE;
    if (Math.abs(a - CURSOR_STELLE_MITTE) < 0.02) return CURSOR_STELLE_MITTE;
    return Math.min(CURSOR_STELLE_MITTE, Math.max(0, a));
  };
  /** Wie viele Zeichen zwischen Schreibzeiger und `clientX` liegen; 0 = am linken Rand (aus). */
  const zeichenBei = (clientX: number): number | null => {
    const r = schieneRef.current?.getBoundingClientRect();
    if (!r || r.width <= 0 || zeichenBreite <= 0) return null;
    const x = clientX - r.left;
    // Ganz links (die letzten 10 px oder links vom Feld) heisst: nicht ausblenden.
    if (x <= 10) return 0;
    const abstand = stelle * r.width - x;
    // Dicht am vollen Punkt (bis zur Hälfte des ersten Zeichens) heisst „sofort".
    if (abstand < SOFORT_ABSTAND_PX + zeichenBreite / 2) return AUSBLENDEN_SOFORT;
    return Math.max(1, Math.round((abstand - SOFORT_ABSTAND_PX) / zeichenBreite));
  };
  const ziehen = (art: "zeiger" | "ausblenden") => ({
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onPointerDown: (e: React.PointerEvent<HTMLSpanElement>) => {
      // Fokus bleibt im Eingabefeld, kein Markieren von Text.
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setZieht(art);
      feldRef.current?.focus();
    },
    onPointerMove: (e: React.PointerEvent<HTMLSpanElement>) => {
      if (zieht !== art) return;
      if (art === "zeiger") {
        const a = anteilBei(e.clientX);
        if (a !== null) setStelle(a);
      } else {
        const z = zeichenBei(e.clientX);
        if (z !== null) setAusblendZeichen(z);
      }
    },
    onPointerUp: (e: React.PointerEvent<HTMLSpanElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      setZieht(null);
    },
    onPointerCancel: () => setZieht(null),
  });
  // Der hohle Punkt: so viele Zeichen links vom Schreibzeiger, nie links aus dem Feld.
  // Abstand des hohlen Rings vom vollen Punkt: „sofort" = direkt daneben,
  // sonst so viele Zeichen weiter links.
  const ausblendAbstand =
    ausblendZeichen === AUSBLENDEN_SOFORT
      ? SOFORT_ABSTAND_PX
      : Math.round(SOFORT_ABSTAND_PX + ausblendZeichen * zeichenBreite);
  const ausblendLinks =
    ausblendZeichen === 0 ? "0px" : `max(0px, calc(${stelle * 100}% - ${ausblendAbstand}px))`;
  // Stehen die beiden Punkte dicht beieinander, werden ihre Greifflächen
  // schmaler - sonst nähme der eine dem anderen die Maus weg.
  const eng = ausblendZeichen === AUSBLENDEN_SOFORT && !nurAusblenden;
  const punkt =
    "pointer-events-auto absolute top-1/2 flex h-7 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center " +
    (eng ? "w-3.5 " : "w-7 ");
  return (
    <div
      ref={schieneRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-5 bottom-0 z-10 h-3"
    >
      {/* Während des Ziehens: die Strecke, über die das Geschriebene ausblendet. */}
      {zieht === "ausblenden" && ausblendZeichen !== 0 && (
        <span
          className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full"
          style={{
            left: ausblendLinks,
            width: `calc(${stelle * 100}% - ${ausblendLinks})`,
            background: "linear-gradient(to right, transparent, rgb(var(--c-accent)))",
          }}
        />
      )}
      <span
        data-ausblend-anfasser
        className={punkt + (zieht === "ausblenden" ? "cursor-grabbing" : "cursor-ew-resize")}
        style={{ left: ausblendLinks }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setAusblendZeichen(AUSBLENDEN_ZEICHEN);
          feldRef.current?.focus();
        }}
        {...ziehen("ausblenden")}
      >
        <Hinweisflaeche hilfe={hilfeAusblenden} className="flex h-full w-full items-center justify-center">
          <span
            className={
              "block rounded-full border-2 border-accent bg-surface transition-transform " +
              (zieht === "ausblenden" ? "h-3.5 w-3.5" : "h-2.5 w-2.5 opacity-60 hover:opacity-100")
            }
          />
        </Hinweisflaeche>
      </span>
      {!nurAusblenden && (
      <span
        data-cursor-anfasser
        className={punkt + (zieht === "zeiger" ? "cursor-grabbing" : "cursor-ew-resize")}
        style={{ left: `${stelle * 100}%` }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setStelle(CURSOR_STELLE_VORGABE);
          feldRef.current?.focus();
        }}
        {...ziehen("zeiger")}
      >
        <Hinweisflaeche hilfe={hilfeZeiger} className="flex h-full w-full items-center justify-center">
          <span
            className={
              "block rounded-full border-2 border-accent bg-accent transition-transform " +
              (zieht === "zeiger" ? "h-3.5 w-3.5" : "h-2.5 w-2.5 opacity-60 hover:opacity-100")
            }
          />
        </Hinweisflaeche>
      </span>
      )}
    </div>
  );
}

/**
 * ★ DER ANFASSER RECHTS UNTEN AM ÜBUNGSFELD (Johannes 13.11.2026): nach unten
 * ziehen = mehr Zeilen. Ab zwei Zeilen steht der Text wie in einem
 * Word-Dokument (`PromptSeite`), ganz nach oben gezogen ist es wieder die
 * übliche eine Zeile. Ein Zeilenschritt = eine Zeilenhöhe der Übungsschrift.
 * Doppelklick = zurück zu einer Zeile. Nur für Sehende, wie die Punkte unten.
 */
function SeitenAnfasser({
  zeilen,
  setZeilen,
  hoechstens,
  feldRef,
  hilfe,
}: {
  zeilen: number;
  setZeilen: (zeilen: number) => void;
  /** So viele Zeilen passen bis zum unteren Fensterrand - weiter zieht er nicht. */
  hoechstens: number;
  feldRef: React.RefObject<HTMLTextAreaElement | null>;
  hilfe: string;
}) {
  const start = useRef<{ y: number; zeilen: number; schritt: number } | null>(null);
  const [zieht, setZieht] = useState(false);
  return (
    <span
      aria-hidden="true"
      data-seiten-anfasser
      className={
        "absolute bottom-0 right-0 z-10 flex h-7 w-7 touch-none items-center justify-center " +
        (zieht ? "cursor-grabbing" : "cursor-ns-resize")
      }
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setZeilen(1);
        feldRef.current?.focus();
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        const schriftPx = feldRef.current
          ? parseFloat(getComputedStyle(feldRef.current).fontSize) || 32
          : 32;
        start.current = { y: e.clientY, zeilen, schritt: schriftPx * SEITE_ZEILENHOEHE };
        setZieht(true);
        feldRef.current?.focus();
      }}
      onPointerMove={(e) => {
        const s = start.current;
        if (!zieht || !s) return;
        setZeilen(Math.min(hoechstens, s.zeilen + Math.round((e.clientY - s.y) / s.schritt)));
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        start.current = null;
        setZieht(false);
      }}
      onPointerCancel={() => {
        start.current = null;
        setZieht(false);
      }}
    >
      <Hinweisflaeche
        hilfe={hilfe}
        ausrichtung="rechts"
        className="flex h-full w-full items-center justify-center"
      >
        <span
          className={
            "block rounded-full border-2 border-accent bg-accent transition-transform " +
            (zieht ? "h-3.5 w-3.5" : "h-2.5 w-2.5 opacity-60 hover:opacity-100")
          }
        />
      </Hinweisflaeche>
    </span>
  );
}

/**
 * ★ Ausblenden (Johannes 12.11.2026): Deckkraft eines schon geschriebenen
 * Zeichens, `abstand` Zeichen hinter dem Schreibzeiger. Das direkt davor ist
 * voll da, über `zeichen` Zeichen wird es blasser, danach ist es weg.
 * `zeichen` 0 = gar nicht ausblenden (13.11.2026, hohler Punkt ganz links).
 */
export function ausblendDeckkraft(abstand: number, zeichen: number = AUSBLENDEN_ZEICHEN): number {
  if (abstand <= 0) return 1;
  // „Sofort": schon das gerade getippte Zeichen ist weg.
  if (zeichen === AUSBLENDEN_SOFORT) return 0;
  if (zeichen <= 0) return 1;
  return Math.max(0, 1 - (abstand - 1) / zeichen);
}

/** Zeilenhöhe der Seite, als Vielfaches der Schrift - mit Luft für die Balken über und unter dem aktiven Zeichen. */
const SEITE_ZEILENHOEHE = 2.1;
/**
 * Mitte zu Mitte zwischen vollem Punkt und hohlem Ring bei „sofort": zwei
 * Punkte zu 10 px und dazwischen rund 1 mm Luft (Johannes 13.11.2026).
 */
const SOFORT_ABSTAND_PX = 14;

/**
 * ★ Wie viele Seitenzeilen bis zum unteren Fensterrand Platz haben (Johannes
 * 13.11.2026: „der untere Fensterrand ist entscheidend, wird das Fenster kleiner
 * gemacht, müssen die Zeilen weniger werden, damit alles Platz hat").
 * `kastenOben` ist die Oberkante des Zeilenkastens im DOKUMENT (also ohne
 * Scrollstand - sonst wüchse die Seite beim Scrollen), `rand` sein Innenabstand
 * oben + unten. Mindestens 1.
 * Exportiert für den Test.
 */
export function seitenZeilenImFenster(
  fensterHoehe: number,
  kastenOben: number,
  rand: number,
  schriftPx: number,
): number {
  const zeileH = schriftPx * SEITE_ZEILENHOEHE;
  if (!(zeileH > 0) || !(fensterHoehe > 0)) return 1;
  // 8 px Luft, damit der Rahmen des Feldes nicht am Fensterrand klebt.
  const frei = fensterHoehe - kastenOben - rand - 8;
  return Math.max(1, Math.floor(frei / zeileH));
}

/** Ein Zeichen auf der Seite: Text, Zustand und Abstand zum Schreibzeiger. */
interface SeitenZeichen {
  ch: string;
  /** < 0 schon geschrieben (so viele Zeichen hinter dem Schreibzeiger), 0 aktiv, > 0 kommt noch. */
  abstand: number;
}

/**
 * Die Zeilen der Runde als ein fortlaufender Text: geschriebene Zeilen, die
 * aktuelle und die kommenden. Jede Zeile ist eine Liste von WÖRTERN, ein
 * Leerzeichen ist ein eigenes Wort (dort darf die Seite umbrechen).
 * Exportiert für den Test.
 */
export function seitenText(
  zeilen: readonly string[],
  qi: number,
  zeileJetzt: string,
  index: number,
  zeilenEnde: boolean,
): SeitenZeichen[][][] {
  // Wie viele Zeichen vor dem Schreibzeiger liegen (über alle Zeilen).
  const texte = zeilen.map((z, k) => (k === qi ? zeileJetzt : z) + (zeilenEnde ? "↵" : ""));
  let vorher = 0;
  for (let k = 0; k < qi && k < texte.length; k++) vorher += [...texte[k]].length;
  const aktivGesamt = vorher + index;
  let pos = 0;
  return texte.map((t) => {
    const woerter: SeitenZeichen[][] = [];
    let wort: SeitenZeichen[] = [];
    for (const ch of [...t]) {
      const z = { ch, abstand: pos - aktivGesamt };
      pos++;
      if (ch === " ") {
        if (wort.length) woerter.push(wort);
        woerter.push([z]);
        wort = [];
      } else {
        wort.push(z);
      }
    }
    if (wort.length) woerter.push(wort);
    return woerter;
  });
}

/**
 * ★★ DIE SEITE (Johannes 13.11.2026): „es wird ein mehrzeiliger Text wie in
 * einem Word-Dokument, und der Cursor bewegt sich mit, bis er Zeile für Zeile
 * rechts unten angekommen ist; dann kommt die neue Seite und man fängt wieder
 * oben links an."
 *
 * Alle Zeilen der Runde stehen als fortlaufender Text, der am Feldrand
 * zwischen den Wörtern umbricht. Gezeigt wird die Seite, auf der der
 * Schreibzeiger steht: `seitenZeilen` Bildschirmzeilen hoch, danach blättert
 * sie um. Mit „Zeilenende mit Enter" endet jede Übungszeile mit ↵ und einem
 * Umbruch, sonst laufen die Zeilen mit einem Leerraum weiter.
 *
 * ⚠️ NUR die Anzeige. Das echte (unsichtbare) Eingabefeld, aus dem
 * Sprachausgabe und Braillezeile lesen, bleibt die EINE Übungszeile wie
 * bisher - nur wird es hier nicht mehr waagrecht mitgezogen (`mirrorRef`),
 * weil der sichtbare Schreibzeiger jetzt über die Seite wandert.
 */
function PromptSeite({
  zeilen,
  qi,
  zeileJetzt,
  index,
  flash,
  fontSize,
  mirrorRef,
  showFingerColors,
  zeichenabstand,
  zeilenEnde,
  ausblendZeichen,
  seitenZeilen,
}: {
  zeilen: readonly string[];
  qi: number;
  zeileJetzt: string;
  index: number;
  flash: boolean;
  fontSize: string;
  mirrorRef?: React.RefObject<HTMLElement | null>;
  showFingerColors: boolean;
  zeichenabstand: ZeichenabstandFaktor;
  zeilenEnde: boolean;
  ausblendZeichen: number;
  seitenZeilen: number;
}) {
  const leerzeichenZeigen = useTypingA11y((z) => z.leerzeichenZeigen);
  const wrapRef = useRef<HTMLDivElement>(null);
  const innenRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  const text = useMemo(
    () => seitenText(zeilen, qi, zeileJetzt, index, zeilenEnde),
    [zeilen, qi, zeileJetzt, index, zeilenEnde],
  );

  useLayoutEffect(() => {
    // Das Eingabefeld steht still - der Schreibzeiger wandert über die Seite.
    const feld = mirrorRef?.current;
    if (feld) {
      feld.style.transition = "none";
      feld.style.transform = "none";
    }
    const wrap = wrapRef.current;
    const innen = innenRef.current;
    if (!wrap || !innen) return;
    const blaettern = () => {
      const zeileH = parseFloat(getComputedStyle(innen).lineHeight);
      const a = activeRef.current;
      if (!a || !(zeileH > 0)) return;
      const zeile = Math.floor((a.offsetTop + a.offsetHeight / 2) / zeileH);
      const seite = Math.floor(zeile / seitenZeilen);
      innen.style.transform = `translateY(${-seite * seitenZeilen * zeileH}px)`;
    };
    blaettern();
    const raf = requestAnimationFrame(blaettern);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(blaettern);
      ro.observe(wrap);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [text, fontSize, seitenZeilen, zeichenabstand, mirrorRef]);

  const laufweite = laufweiteWirksamerFaktor(zeichenabstand);
  const zeichen = (z: SeitenZeichen, key: string) => {
    const isActive = z.abstand === 0;
    const farbe =
      showFingerColors && isActive && !flash && z.ch !== "↵"
        ? fingerForChar(z.ch)?.farbe
        : undefined;
    let cls = "inline-block rounded px-[0.06em] ";
    if (z.abstand < 0) cls += "text-success tt-prompt-typed";
    else if (isActive)
      cls +=
        (flash
          ? "bg-danger text-[rgb(var(--c-on-accent))] tt-prompt-fehler"
          : "bg-accent-soft text-ink") + " tt-prompt-active";
    else cls += "text-ink-muted";
    const deckkraft = ausblendDeckkraft(-z.abstand, ausblendZeichen);
    return (
      <span
        key={key}
        ref={isActive ? activeRef : undefined}
        className={cls}
        style={{
          lineHeight: 1.375,
          ...(farbe ? { "--tt-balken-farbe": farbe } : null),
          ...(deckkraft < 1 ? { opacity: deckkraft } : null),
        } as React.CSSProperties}
      >
        {z.ch === " " ? (leerzeichenZeigen ? "␣" : "\u00a0") : z.ch}
      </span>
    );
  };

  return (
    <div
      ref={wrapRef}
      data-seite
      className="overflow-hidden"
      style={{ fontSize, height: `${seitenZeilen * SEITE_ZEILENHOEHE}em` }}
    >
      <div
        ref={innenRef}
        className="tt-uebungsschrift relative font-legible font-semibold tracking-wide"
        style={{
          lineHeight: SEITE_ZEILENHOEHE,
          overflowWrap: "anywhere",
          ...(laufweite > 1
            ? { letterSpacing: `${(laufweite - 1) * LAUFWEITE_CH_JE_STUFE}ch` }
            : null),
        }}
      >
        {text.map((woerter, k) => (
          <Fragment key={k}>
            {/* ★ Das Leerzeichen hängt am Wort DAVOR (im selben nowrap-Block),
               umgebrochen wird erst dahinter. Als eigener inline-block durfte
               Safari VOR ihm umbrechen - die neue Zeile begann dann mit „␣"
               (gemessen 13.11.2026, Chromium brach dahinter um). */}
            {woerter.map((wort, w) => {
              const istLeer = (x: SeitenZeichen[] | undefined) =>
                !!x && x.length === 1 && x[0].ch === " ";
              // Ein Leerzeichen, das schon am Wort davor hängt, nicht noch einmal.
              if (istLeer(wort) && w > 0 && !istLeer(woerter[w - 1])) return null;
              const dran = !istLeer(wort) && istLeer(woerter[w + 1]) ? woerter[w + 1][0] : null;
              return (
                <Fragment key={w}>
                  <span className="whitespace-nowrap">
                    {wort.map((z, i) => zeichen(z, `${k}-${w}-${i}`))}
                    {dran && zeichen(dran, `${k}-${w}-l`)}
                  </span>
                  {(dran || istLeer(wort)) && <wbr />}
                </Fragment>
              );
            })}
            {k < text.length - 1 && (zeilenEnde ? <br /> : " ")}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Zeigt die zu tippende Zeile mit Farb-Status je Zeichen. Das aktuelle Zeichen
 * steht IMMER mittig im Feld, die Zeile wandert darunter durch - der Cursor
 * steht still, der Text läuft von rechts nach links (wie ein Teleprompter).
 *
 * ★ Bis 23.08.2026 galt das nur bei Vergrößerung; passte die Zeile ins Feld,
 * wurde sie als Ganzes zentriert und der Cursor begann LINKS und wanderte.
 * Johannes: „Der Schreibcursor soll immer mittig sein, egal wie lang die Zeile
 * ist - für Kinder mit Sehbehinderung ist das einfacher" (der Blick bleibt an
 * einer Stelle, die Lupe muss nicht mitfahren).
 */
function PromptText({
  expected,
  index,
  flash,
  fontSize,
  centerActive,
  mirrorRef,
  showFingerColors,
  praefix = "",
  zeichenabstand,
  zeilenEnde = false,
  ausblendZeichen = 0,
  cursorStelle = CURSOR_STELLE_VORGABE,
  onZeichenBreite,
}: {
  expected: string;
  index: number;
  flash: boolean;
  fontSize: string;
  /**
   * Das aktuell zu tippende Zeichen mittig im Feld halten (statt die ganze Zeile
   * zu zentrieren). Seit 23.08.2026 IMMER an (siehe Kopf); `false` gibt es nur
   * noch für die alte Darstellung in Tests.
   */
  centerActive: boolean;
  /**
   * Das echte (transparente) Eingabefeld. Es bekommt DIESELBE Verschiebung wie die
   * sichtbare Zeile, damit der System-Cursor (und Windows' Cursorhervorhebung)
   * exakt unter dem sichtbaren aktiven Zeichen sitzt — und nicht auf der
   * unsichtbaren, unverschobenen Zeile herumwandert (Wunsch Johannes).
   */
  mirrorRef?: React.RefObject<HTMLElement | null>;
  /** Jeden Buchstaben mit seinem Finger-Farbrahmen umranden (nur Hell/Dunkel). */
  showFingerColors: boolean;
  /**
   * ★★★ EIN VORSPANN VOR DER ZEILE - für die Tippchallenge der Zeitstand
   * (10.09.2026, Wunsch Johannes: *„kann man den zeitstand links auf der zeile
   * mitlaufen lassen und dann 3 leerzeichen machen und dann beginnt der text"*).
   *
   * ⚠️⚠️ ER MUSS IN BEIDEN WELTEN STEHEN, sonst geht die Deckungsgleichheit
   * verloren. Das transparente Eingabefeld liegt über dieser Zeile und wird um
   * genau dieselbe Strecke verschoben (`mirrorRef`), damit der Schreibzeiger
   * unter dem aktiven Zeichen sitzt - daran hängt die Cursorhervorhebung für
   * Kinder mit Sehbehinderung. Stünde der Vorspann NUR im Feld, läge der Zeiger
   * um seine Breite daneben.
   *
   * Weil er hier UND dort steht, bleibt die vorhandene Rechnung unverändert
   * richtig: Sie misst das aktive Zeichen, und das verschiebt sich in beiden
   * gleich weit.
   *
   * Er ist nie tippbar - er gehört nicht zu `expected` und zählt in keiner
   * Statistik.
   */
  praefix?: string;
  /**
   * „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus, 2 = doppelt,
   * 3 = dreifach, 4 = vierfach - siehe `zeichenabstand.ts` und die Erklärung
   * an `.tt-laufweite` in `index.css`.
   */
  zeichenabstand: ZeichenabstandFaktor;
  /**
   * ★ Zeilenende mit Enter (23.09.2026) - hängt EIN zusätzliches „↵" ans Ende
   * der sichtbaren Zeile an (Position `expected.length`, wie am echten Ziel
   * der Sitzung `expected + "\n"`) - farblich/aktiv genau wie jedes andere
   * Zeichen behandelt. `expected` selbst bleibt OHNE `\n` (siehe das Feld
   * darunter, `zeilenPraefix + expected`, sonst würde die Braillezeile
   * zweizeilig).
   */
  zeilenEnde?: boolean;
  /**
   * ★ Ausblenden (Johannes 12.11.2026): das Geschriebene blendet über
   * `AUSBLENDEN_ZEICHEN` Zeichen hinter dem Schreibzeiger aus. Die Zeichen
   * bleiben mit ihrer Breite stehen (nur `opacity`) - sonst verschöbe sich die
   * Zeile gegen das Eingabefeld darunter.
   */
  /** 13.11.2026: über so viele Zeichen; 0 = nicht ausblenden. */
  ausblendZeichen?: number;
  /**
   * ★ Wo das aktive Zeichen steht, als Anteil der Feldbreite (Johannes
   * 12.11.2026): Vorgabe der goldene Schnitt (≈ 0,382), 0,5 = Mitte, 0 = ganz links. Der Anfasser unter
   * der Zeile stellt ihn ein.
   */
  cursorStelle?: number;
  /**
   * ★ 13.11.2026: meldet die mittlere Breite eines Zeichens (px) - der hohle
   * Ausblend-Punkt unter der Zeile rechnet damit Zeichen in Pixel um.
   */
  onZeichenBreite?: (px: number) => void;
}) {
  const leerzeichenZeigen = useTypingA11y((z) => z.leerzeichenZeigen);
  /**
   * ★ Stufe 5 „einfach" (22.09.2026): die Klasse `tt-laufweite` und die
   * Variable `--tt-laufweite` tragen die Zeichen-ZUSATZSTRECKE - bei Stufe 5
   * bleibt die 1 (keine Vergrösserung), siehe `laufweiteWirksamerFaktor`. Das
   * Gleiten der Zeile ({@link zeilenUebergang} weiter unten) hängt NICHT
   * daran, sondern an `zeichenabstand` selbst - CVI bleibt aktiv.
   */
  const laufweiteFaktor = laufweiteWirksamerFaktor(zeichenabstand);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  /** Der gleitende Anschlag-Abstand des Kindes (ms), siehe `zeilenUebergang`. */
  const taktRef = useRef<number | null>(null);
  /** Wo die Zeile zuletzt stand - für den Takt und für „neue Zeile". */
  const zuletztRef = useRef<{ expected: string; index: number; zeit: number } | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    // ★★ Die Zeile gleitet im Takt des Kindes (Johannes 19.09.2026, CVI) -
    // die Begründung steht an `zeilenUebergang` in `zeichenabstand.ts`.
    // Gleiten nur, wenn es auf DERSELBEN Zeile vorwärts geht. Eine neue Zeile,
    // eine neue Schriftgrösse oder der erste Auftritt stehen mit
    // Zeichenabstand sofort da: Die ganze Zeile quer über den Bildschirm
    // gleiten zu sehen, wäre genau die Unruhe, die wegsoll.
    const jetzt = performance.now();
    const vorher = zuletztRef.current;
    const vorwaerts = !!vorher && vorher.expected === expected && index > vorher.index;
    if (vorwaerts) {
      taktRef.current = naechsterTakt(
        taktRef.current,
        (jetzt - vorher.zeit) / (index - vorher.index),
      );
    }
    zuletztRef.current = { expected, index, zeit: jetzt };
    const uebergang =
      zeichenabstand > 1 && !vorwaerts ? "none" : zeilenUebergang(zeichenabstand, taktRef.current);
    // Zeile und Eingabefeld bekommen DENSELBEN Übergang - sonst läge der
    // Schreibzeiger während des Gleitens neben dem sichtbaren Zeichen.
    track.style.transition = uebergang;
    if (mirrorRef?.current) mirrorRef.current.style.transition = uebergang;
    // ★★ 28.09.2026 (Johannes: „beim CVI funktioniert das smooth Weiterlaufen
    // nicht an allen Rechnern"): Die globale Regel für „weniger Bewegung" in
    // `index.css` drückt JEDEN Übergang auf ≈ 0 - an Schulrechnern schaltet die
    // IT die Windows-Animationseffekte oft für alle ab, ebenso Fernzugriff und
    // virtuelle Maschinen; dort sprang die Zeile. Das Gleiten ist aber keine
    // Verzierung, sondern die CVI-Einstellung, die für DIESES Kind gewählt
    // wurde (langsam, im eigenen Takt). Die Klasse `tt-cvi-gleiten` nimmt es
    // von der Regel aus; die Dauer kommt über `--tt-gleit-ms`.
    const gleitMs = zeichenabstand > 1 ? gleitDauer(taktRef.current) : null;
    for (const el of [track, mirrorRef?.current]) {
      if (!el) continue;
      el.classList.toggle("tt-cvi-gleiten", gleitMs !== null);
      if (gleitMs !== null) el.style.setProperty("--tt-gleit-ms", `${gleitMs}ms`);
    }
    const place = () => {
      const avail = wrap.clientWidth;
      if (avail <= 0) return; // noch nicht vermessen (z. B. erster Frame)
      const fits = track.offsetWidth <= avail;
      let tx: number;
      if (fits && !centerActive) {
        tx = (avail - track.offsetWidth) / 2; // ganze Zeile zentriert (alte Darstellung)
      } else {
        // aktives Zeichen in die Mitte (Teleprompter) - seit 23.08.2026 immer.
        // ★ 12.11.2026: nicht mehr fest die Mitte, sondern die Stelle des
        // Anfassers. Ganz links bleibt das aktive Zeichen ganz sichtbar
        // (mindestens seine halbe Breite vom Rand).
        const a = activeRef.current;
        const activeCenter = a
          ? a.offsetLeft + a.offsetWidth / 2
          : track.offsetWidth / 2;
        const halbeBreite = a ? a.offsetWidth / 2 : 0;
        tx = Math.max(halbeBreite, avail * cursorStelle) - activeCenter;
      }
      const shift = `translateX(${Math.round(tx)}px)`;
      track.style.transform = shift;
      // Das echte Eingabefeld exakt mitziehen → Cursor sitzt unter dem sichtbaren
      // aktiven Zeichen (Typografie des Felds ist auf die Zeile abgestimmt).
      if (mirrorRef?.current) mirrorRef.current.style.transform = shift;
      const anzahl = track.children.length;
      if (anzahl > 0) onZeichenBreite?.(track.offsetWidth / anzahl);
    };
    place();
    // „Sofort" heisst: ohne Übergang ankommen und DANN erst wieder gleiten
    // dürfen. Das Lesen der Breite zwingt den Browser, die Stellung jetzt zu
    // übernehmen; erst danach kommt der Übergang für den nächsten Anschlag.
    if (uebergang === "none") {
      void track.offsetWidth;
      const naechster = zeilenUebergang(zeichenabstand, taktRef.current);
      track.style.transition = naechster;
      if (mirrorRef?.current) mirrorRef.current.style.transition = naechster;
    }
    // Nach Font-/Layout-Settle noch einmal (Atkinson-Schrift, Zoomwechsel) — sonst
    // sitzt die Mitte bei großer Vergrößerung neben dem Tippfeld.
    const raf = requestAnimationFrame(place);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(place);
      ro.observe(wrap);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [expected, index, fontSize, centerActive, zeichenabstand, cursorStelle]);

  return (
    <div
      ref={wrapRef}
      className="tt-prompt-spur flex overflow-hidden"
      // ⚠️ DIESELBE Schriftgrösse wie die Zeile darunter, obwohl hier gar kein
      // Text steht: Der Streifen hält über und unter der Zeile die Luft für die
      // Balken frei, und dieses Mass MUSS mit der Schrift mitwachsen. Ohne das
      // erbt er die Grundschrift (16 px), sein `em` wüchse nicht mit - und bei
      // mittlerer Vergrösserung schneidet er den dicken Fehler-Balken ab
      // (nachgerechnet: bis 35 px bei 100 px Schrift). Die Zeichen selbst
      // berührt es nicht, die Spur darunter setzt ihre Grösse selbst.
      style={{ fontSize }}
    >
      <div
        ref={trackRef}
        className={
          "tt-uebungsschrift flex w-max shrink-0 whitespace-nowrap font-legible font-semibold leading-snug tracking-wide" +
          (laufweiteFaktor > 1 ? " tt-laufweite" : "")
        }
        // ⚠️ Kein `transition` hier: Den setzt der Effekt oben je Anschlag
        // (Takt des Kindes), für die Zeile UND das Eingabefeld gleich.
        // `will-change` legt die Zeile mit Zeichenabstand auf eine eigene
        // Ebene - dann gleitet sie auf der Grafikkarte, ohne die Seite neu zu
        // zeichnen.
        style={{
          fontSize,
          ...(laufweiteFaktor > 1
            ? ({ "--tt-laufweite": laufweiteFaktor, willChange: "transform" } as React.CSSProperties)
            : null),
        }}
      >
        {/*
          Der Vorspann (Zeitstand) - UNSICHTBAR, aber mit seiner Breite
          (Johannes 10.09.2026: *„am zeilenanfang sollen bei der Prüfung die
          sehenden nicht die Zeit sehen, nur für die braillezeile"*).

          `invisible` (visibility: hidden) und nicht weglassen: Die Zeichen
          behalten ihren Platz, das aktive Zeichen verschiebt sich hier und im
          Tippfeld gleich weit, und der Schreibzeiger sitzt weiter darunter
          (siehe `praefix` oben). Gelesen wird der Zeitstand ohnehin nur aus
          dem Tippfeld; sichtbar steht die Uhr neben den Minutenstrichen.
        */}
        {praefix
          ? [...praefix].map((ch, i) => (
              <span key={`p${i}`} className="invisible rounded px-[0.06em]">
                {ch === " " ? "\u00a0" : ch}
              </span>
            ))
          : null}
        {[...expected].map((ch, i) => {
          const isSpace = ch === " ";
          const isActive = i === index;
          // ★★★ DIE FINGERFARBE FÄHRT IM BALKEN, NICHT MEHR IM RAHMEN
          // (Johannes, 09.09.2026: *„wenn die Tastatur mit Farben an ist, sind
          // die Klammern um das zu schreibende Zeichen total dick - mach es wie
          // im Kontrastmodus, oben und unten Balken"* und *„die Balken können
          // natürlich die Farbe je nach Finger ändern"*).
          //
          // Bis dahin stand hier ein `outline` rings um das Zeichen. Sichtbar
          // waren davon nur die zwei SENKRECHTEN Kanten - die waagrechten
          // schneidet `.tt-prompt-spur` mit `overflow-hidden` weg, weil die
          // Zeichen als Flex-Elemente exakt so hoch sind wie der Streifen.
          // Übrig blieb genau die gemeldete Klammer. Dieselbe Fehlerform wie im
          // Kontrastmodus, nur mit einer anderen Ursache (dort die Backplate).
          //
          // Die Balken zeichnet jetzt das Stylesheet für BEIDE Darstellungen
          // (`src/index.css`, Abschnitt „Das aktive Zeichen"); von hier kommt
          // nur noch die Farbe als Variable. Ohne Fingerfarben bleibt es bei
          // der Akzentfarbe aus der Regel, beim Fehlgriff bei der Warnfarbe.
          const farbe =
            showFingerColors && isActive && !flash
              ? fingerForChar(ch)?.farbe
              : undefined;
          let cls = "rounded px-[0.06em] ";
          if (i < index) cls += "text-success tt-prompt-typed";
          else if (isActive)
            cls +=
              (flash
                ? "bg-danger text-[rgb(var(--c-on-accent))] tt-prompt-fehler"
                : "bg-accent-soft text-ink") + " tt-prompt-active";
          else cls += "text-ink-muted";
          const deckkraft = ausblendDeckkraft(index - i, ausblendZeichen);
          const style =
            farbe || deckkraft < 1
              ? ({
                  ...(farbe ? { "--tt-balken-farbe": farbe } : null),
                  ...(deckkraft < 1 ? { opacity: deckkraft } : null),
                } as React.CSSProperties)
              : undefined;
          return (
            <span
              key={i}
              ref={isActive ? activeRef : undefined}
              className={cls}
              style={style}
            >
              {isSpace ? (leerzeichenZeigen ? "␣" : "\u00a0") : ch}
            </span>
          );
        })}
        {/*
          ★ Zeilenende mit Enter (23.09.2026): das „↵" am Zeilenende, GENAUSO
          behandelt wie jedes andere Zeichen (Position `expected.length`,
          getroffen/aktiv/offen) - nur OHNE Fingerfarbe: `Keyboard.tsx` hält
          die Eingabetaste bewusst neutral-grau („Struktur-/Modifikatortaste"),
          dieselbe Regel gilt hier für die sichtbare Zeile.
        */}
        {zeilenEnde &&
          (() => {
            const i = expected.length;
            const isActive = i === index;
            let cls = "rounded px-[0.06em] ";
            // Das ↵ ist nie „schon geschrieben und noch sichtbar": Nach ihm
            // kommt die nächste Zeile - darum kein Ausblenden hier.
            if (i < index) cls += "text-success tt-prompt-typed";
            else if (isActive)
              cls +=
                (flash
                  ? "bg-danger text-[rgb(var(--c-on-accent))] tt-prompt-fehler"
                  : "bg-accent-soft text-ink") + " tt-prompt-active";
            else cls += "text-ink-muted";
            return (
              <span key="enter" ref={isActive ? activeRef : undefined} className={cls}>
                ↵
              </span>
            );
          })()}
      </div>
    </div>
  );
}

/**
 * Schlanker Hinweis, der NUR erscheint, solange die Umschalttaste noch nicht
 * gelernt ist, in der Zeile aber ein Großbuchstabe steht (Auto-Großschreibung):
 * Groß erscheint „von selbst", der kleine Buchstabe genügt. Klick öffnet ein
 * kleines Popup mit kurzer Erklärung; es schließt per Klick daneben oder Escape.
 * Bewusst alters-neutral formuliert (TypingSession dient Kind- und Erwachsenen-Profil).
 * Wird in „Mein Training" in den LetterMap-Header verschoben (dort exportiert).
 */
/**
 * ★ E11a-5 (26.09.2026): der SICHTBARE Name eines Zeichens in der
 * Bedienungssprache (Rückmeldung bei einem Fehlgriff, Umschalt-Fenster).
 * Deutsch wie bisher `charLabel`, sonst der Name der Sprachausgabe dieser
 * Sprache (`spokenLabel`, E12 für „fr"). Bis dahin stand an drei Stellen
 * `sprache === "en" ? spokenLabel(want, "en") : charLabel(want)` - „fr"
 * bekam den DEUTSCHEN Namen (Falle 30).
 */
function zeichenNameSichtbar(ch: string, sprache: BedienSprache): string {
  return sprache === "de" ? charLabel(ch) : spokenLabel(ch, sprache);
}

/** ★ E11a-5: der Satz, wenn in der Übungszeile Tab gedrückt wird - je Sprache. */
const DAS_IST_TAB: Record<BedienSprache, string> = {
  de: "Das ist Tab.",
  en: "That's Tab.",
  fr: "C'est la touche Tab.",
  es: "Esa es la tecla Tab.",
  it: "Questo è il tasto Tab.",
  // ★ O-PL (02.10.2026): Glossar §2.9 - „klawisz Tab".
  pl: "To jest klawisz Tab.",
  // ★ O-TR (02.10.2026): Glossar §2.9 - "Tab tuşu".
  tr: "Bu, Tab tuşu.",
  // ★ O-CS (03.10.2026): Glossar §2.9 - im Satz „Tabulátor" (Microsoft „Alt+Tabulátor"), wie `FreieSchreibzeile.tsx`.
  cs: "To je Tabulátor.",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Това е Tab.",
  el: "Αυτό είναι το πλήκτρο Tab.",
  hu: "Ez a Tab billentyű.",
  nl: "Dat is Tab.",
  pt: "É a tecla de tabulação.",
  br: "Esta é a tecla Tab.",
  ro: "Aceasta este tasta Tab.",
  sv: "Det här är Tabb.",
  uk: "Це клавіша Tab.",
};

/** ★ E11a-5: Name und Aufschrift des Knopfs je Bedienungssprache (statt `en ? … : …`). */
const AUTOCAP_KNOPF_NAME: Record<BedienSprache, string> = {
  de: "Große Buchstaben ohne Umschalttaste: Erklärung anzeigen",
  en: "Capital letters without Shift: show explanation",
  fr: "Majuscules sans la touche Maj : afficher l'explication",
  es: "Mayúsculas sin la tecla Mayús: mostrar la explicación",
  it: "Maiuscole senza il tasto Maiusc: mostra la spiegazione",
  // ★ O-PL (02.10.2026): Glossar §2.1 „Wielka litera bez Shift".
  pl: "Wielkie litery bez klawisza Shift: pokaż wyjaśnienie",
  // ★ O-TR (02.10.2026): Glossar §2.1/§2.9 "büyük harf", "Shift tuşu".
  tr: "Shift tuşu olmadan büyük harf: açıklamayı göster",
  // ★ O-CS (03.10.2026): Glossar §2.1/§2.9 „velké písmeno", „bez klávesy Shift"
  // (Kopfwort, Regel 11); Knopf im Infinitiv „zobrazit".
  cs: "Velká písmena bez klávesy Shift: zobrazit vysvětlení",
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: "Главни букви без Shift: покажи обяснението",
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: "Κεφαλαία χωρίς Shift: εμφάνιση εξήγησης",
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: "Nagybetűk a Shift billentyű nélkül: magyarázat megjelenítése",
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: "Hoofdletters zonder Shift: uitleg tonen",
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: "Maiúsculas sem a tecla Shift: mostrar explicação",
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: "Letras maiúsculas sem Shift: mostrar explicação",
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: "Litere mari fără tasta Shift: afișați explicația",
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: "Stora bokstäver utan Skift: visa förklaring",
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: "Великі літери без Shift: показати пояснення",
};
const AUTOCAP_KNOPF: Record<BedienSprache, string> = {
  de: "Groß ohne Umschalt",
  en: "Capital without Shift",
  fr: "Majuscule sans Maj",
  es: "Mayúscula sin Mayús",
  it: "Maiuscola senza Maiusc",
  pl: "Wielka litera bez Shift",
  // ★ O-TR: "olmadan" ist ein eigenes Wort - keine Endung an "Shift" (Regel 6).
  tr: "Shift olmadan büyük harf",
  // ★ O-CS (03.10.2026): „Shift" nie gebeugt - mit Kopfwort (Regel 11).
  cs: "Velká bez klávesy Shift",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Главни без Shift",
  el: "Κεφαλαία χωρίς Shift",
  hu: "Nagybetű Shift nélkül",
  nl: "Hoofdletter zonder Shift",
  pt: "Maiúsculas sem Shift",
  br: "Maiúscula sem Shift",
  ro: "Majuscule fără Shift",
  sv: "Stor utan Skift",
  uk: "Велика без Shift",
};

export function AutoCapHint() {
  // ★ EN1 (19.09.2026): Knopf und Erklärung in der Bedienungssprache.
  // ★ E11a-5 (26.09.2026): dritte Sprache - bis dahin zeigte „fr" hier die
  // DEUTSCHE Fassung (`en = sprache === "en"`, sonst Deutsch; Falle 30).
  const { sprache } = useBedienSprache();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const kastenId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    // ★ R6 (Johannes, 22.08.2026): Escape schließt und holt die Eingabezeile -
    // hier wie überall sonst. Bisher schloss es nur den Kasten.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      focusPracticeField();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-sunken px-3 py-1 text-sm font-medium text-ink-soft hover:text-ink"
        aria-expanded={open}
        aria-controls={open ? kastenId : undefined}
        aria-describedby={open ? kastenId : undefined}
        aria-label={AUTOCAP_KNOPF_NAME[sprache]}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span aria-hidden="true">⇧</span>
        {AUTOCAP_KNOPF[sprache]}
        <span aria-hidden="true" className="text-ink-muted">
          ⓘ
        </span>
      </button>
      {open && (
        // ★ Nr 31 der Fokusziele (22.08.2026): KEIN Dialog mehr. Der Kasten trug
        // `role="dialog"`, enthielt aber kein einziges Bedienelement und bekam
        // nie den Fokus - eine Sprachausgabe meldete einen Dialog, in den man
        // nicht hineinkam. Jetzt hängt der Text über `aria-describedby` am
        // Knopf und wird beim Aufklappen einfach vorgelesen; `aria-expanded`
        // sagt den Zustand. Gleiche Behandlung wie der Erklärkasten in
        // `LetterMap` (Nr 13).
        <div
          id={kastenId}
          className="absolute left-1/2 top-full z-40 mt-2 w-72 max-w-[80vw] -translate-x-1/2 rounded-xl border border-hairline bg-surface-raised p-3 text-left text-sm font-normal text-ink-soft shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {sprache === "fr" ? (
            // ★ E11a-5: Glossar §9.2 - Maj, majuscule, minuscule; „tu".
            <>
              Ici, <strong className="text-ink">les majuscules apparaissent toutes seules</strong>{" "}
              - tu n'as pas encore besoin de la <strong className="text-ink">touche Maj</strong>.
              Tape simplement la lettre <strong className="text-ink">minuscule</strong>, la
              majuscule vient automatiquement. La touche Maj arrive bientôt.
            </>
          ) : sprache === "pl" ? (
            // ★ O-PL (02.10.2026): Glossar §2.1/§2.9 - wielka/mała litera, klawisz Shift; ty.
            <>
              Tutaj <strong className="text-ink">wielkie litery pojawiają się same</strong> -{" "}
              <strong className="text-ink">klawisz Shift</strong> nie jest ci jeszcze potrzebny.
              Po prostu napisz <strong className="text-ink">małą</strong> literę, a wielka
              pojawi się automatycznie. Klawisz Shift dojdzie wkrótce.
            </>
          ) : sprache === "cs" ? (
            // ★ O-CS (03.10.2026): Glossar §2.1/§2.9 - velké/malé písmeno, klávesa
            // Shift; ty. Sagt nur, dass Shift HIER noch nicht nötig ist - nicht,
            // dass Shift immer den Grossbuchstaben macht (§4 Falle 1).
            <>
              Tady se <strong className="text-ink">velká písmena objeví sama</strong> -{" "}
              <strong className="text-ink">klávesu Shift</strong> zatím nepotřebuješ.
              Napiš <strong className="text-ink">malé</strong> písmeno a velké se objeví
              samo. Klávesa Shift přijde brzy.
            </>
          ) : sprache === "tr" ? (
            // ★ O-TR (02.10.2026): Glossar §2.1/§2.9 - büyük/küçük harf, Shift tuşu; sen.
            <>
              Burada <strong className="text-ink">büyük harfler kendiliğinden gelir</strong> -{" "}
              <strong className="text-ink">Shift tuşuna</strong> henüz gerek yok. Sadece{" "}
              <strong className="text-ink">küçük</strong> harfi yaz, büyük harf kendiliğinden
              gelir. Shift tuşu yakında eklenecek.
            </>
          ) : sprache === "it" ? (
            // ★ O-IT (02.10.2026): Glossar §2.9 - Maiusc, maiuscola, minuscola; tu.
            <>
              Qui <strong className="text-ink">le maiuscole compaiono da sole</strong> - non ti
              serve ancora il <strong className="text-ink">tasto Maiusc</strong>. Scrivi
              semplicemente la lettera <strong className="text-ink">minuscola</strong> e la
              maiuscola arriva da sola. Il tasto Maiusc arriva presto.
            </>
          ) : sprache === "es" ? (
            // ★ ES-O (27.09.2026): Glossar S13 - Mayús, mayúscula, minúscula; tú.
            <>
              Aquí <strong className="text-ink">las mayúsculas aparecen solas</strong> - todavía
              no necesitas la <strong className="text-ink">tecla Mayús</strong>. Escribe
              simplemente la letra <strong className="text-ink">minúscula</strong> y la mayúscula
              sale automáticamente. La tecla Mayús llega pronto.
            </>
          ) : sprache === "bg" ? (
            // ★ O2-COMP (30.10.2026): bg.
            <>
              Тук <strong className="text-ink">главните букви се появяват сами</strong> -{" "}
              <strong className="text-ink">клавишът Shift</strong> още не ти трябва. Просто напиши{" "}
              <strong className="text-ink">малката</strong> буква и главната ще се появи сама.
              Клавишът Shift идва скоро.
            </>
          ) : sprache === "el" ? (
            // ★ O2-COMP (30.10.2026): el.
            <>
              Εδώ <strong className="text-ink">τα κεφαλαία εμφανίζονται μόνα τους</strong> -{" "}
              <strong className="text-ink">το πλήκτρο Shift</strong> δεν το χρειάζεσαι ακόμα.
              Απλώς γράψε το <strong className="text-ink">μικρό</strong> γράμμα, και το κεφαλαίο
              έρχεται αυτόματα. Το πλήκτρο Shift έρχεται σύντομα.
            </>
          ) : sprache === "hu" ? (
            // ★ O2-COMP (30.10.2026): hu.
            <>
              Itt <strong className="text-ink">a nagybetűk maguktól jönnek</strong> -{" "}
              <strong className="text-ink">a Shift billentyűre</strong> még nincs szükséged.
              Egyszerűen írd be a <strong className="text-ink">kisbetűt</strong>, és a nagybetű
              magától megjelenik. A Shift billentyű hamarosan jön.
            </>
          ) : sprache === "nl" ? (
            // ★ O2-COMP (30.10.2026): nl.
            <>
              Hier <strong className="text-ink">komen de hoofdletters vanzelf</strong> - de{" "}
              <strong className="text-ink">Shift-toets</strong> heb je nog niet nodig. Typ gewoon de{" "}
              <strong className="text-ink">kleine</strong> letter, dan verschijnt de hoofdletter
              vanzelf. De Shift-toets komt binnenkort.
            </>
          ) : sprache === "pt" ? (
            // ★ O2-COMP (30.10.2026): pt.
            <>
              Aqui <strong className="text-ink">as maiúsculas aparecem sozinhas</strong> - ainda não
              precisas da <strong className="text-ink">tecla Shift</strong>. Escreve simplesmente a
              letra <strong className="text-ink">minúscula</strong> e a maiúscula aparece
              automaticamente. A tecla Shift chega em breve.
            </>
          ) : sprache === "br" ? (
            // ★ O2-COMP (30.10.2026): br.
            <>
              Aqui <strong className="text-ink">as letras maiúsculas aparecem automaticamente</strong> - você
              ainda não precisa da <strong className="text-ink">tecla Shift</strong>. É só digitar a
              letra <strong className="text-ink">minúscula</strong>, e a maiúscula aparece
              automaticamente. A tecla Shift vem em breve.
            </>
          ) : sprache === "ro" ? (
            // ★ O2-COMP (30.10.2026): ro.
            // ★ O-RO (29.10.2026): Glosar §2.1/§2.9 - literă mare/mică, tasta Shift; tu. Spune doar
            // că Shift AICI nu e încă nevoie - nu că Shift face mereu litera mare.
            <>
              Aici <strong className="text-ink">literele mari apar singure</strong> - încă nu ai
              nevoie de <strong className="text-ink">tasta Shift</strong>. Scrie pur și simplu
              litera <strong className="text-ink">mică</strong>, iar cea mare apare automat.
              Tasta Shift vine în curând.
            </>
          ) : sprache === "sv" ? (
            // ★ O2-COMP (30.10.2026): sv.
            <>
              Här <strong className="text-ink">kommer stora bokstäver av sig själva</strong> - du
              behöver inte <strong className="text-ink">tangenten Skift</strong> än. Skriv bara den{" "}
              <strong className="text-ink">lilla</strong> bokstaven, så blir den stor automatiskt.
              Tangenten Skift kommer snart.
            </>
          ) : sprache === "uk" ? (
            // ★ O2-COMP (30.10.2026): uk.
            <>
              Тут <strong className="text-ink">великі літери з'являються самі</strong> -{" "}
              <strong className="text-ink">клавіша Shift</strong> тобі поки не потрібна. Просто
              надрукуй <strong className="text-ink">малу</strong> літеру, і велика з'явиться
              сама. Клавіша Shift буде згодом.
            </>
          ) : sprache !== "de" ? (
            // Glossar §3.5: *capital letter*, *small letter*, *Shift*.
            <>
              Here,{" "}
              <strong className="text-ink">capital letters appear by themselves</strong> - you
              don't need the <strong className="text-ink">Shift key</strong> yet. Just type the{" "}
              <strong className="text-ink">small</strong> letter and the capital comes
              automatically. The Shift key will be added soon.
            </>
          ) : (
            <>
              Hier erscheinen{" "}
              <strong className="text-ink">große Buchstaben von selbst</strong> - die{" "}
              <strong className="text-ink">Umschalttaste</strong> ist noch nicht nötig.
              Einfach den <strong className="text-ink">kleinen</strong> Buchstaben
              tippen, der große kommt automatisch. Die Umschalttaste kommt bald dazu.
            </>
          )}
        </div>
      )}
    </div>
  );
}

export interface TypingSessionProps {
  /** Die Zeilen dieser Runde. Eine neue Array-Referenz startet eine neue Runde. */
  items: string[];
  /**
   * No-Repeat-Ledger (Textwelt TW-E2): pro Zeile der stabile Baustein-Index
   * (aus dem Korpus-Manifest) oder `null` für generierte Zeilen. Parallel zu
   * `items`. Ist gesetzt, meldet die Session beim Zeilenabschluss `onLineSeen`
   * mit diesem Index. Optional — ohne bleibt alles wie bisher.
   */
  sources?: (number | null)[];
  /**
   * Woraus jede Zeile besteht - parallel zu `items`, direkt aus dem Generator
   * (`RoundLine.art`). Grundlage der Inhaltswechsel-Ansage. Fehlt das Feld
   * (Bücherei, Alt-Aufrufer, Tests), wird NICHTS angekündigt: Ohne Etikett ist
   * jede Ansage geraten, und geraten hat sie sich schon einmal blamiert.
   */
  arten?: ZeilenArt[];
  /**
   * Wird beim Abschluss einer Zeile gerufen, deren `sources`-Eintrag ein Baustein-
   * Index ist — der Aufrufer verbucht ihn dann als „gesehen" (No-Repeat, TW-E2).
   */
  onLineSeen?: (bausteinIndex: number) => void;
  /** Lektions-/Kontext-Kennung für die Telemetrie (z. B. "adaptiv"). */
  contextId: string;
  /** Alle freigeschalteten Tasten (für die Tastatur-Darstellung). */
  unlocked: Set<string>;
  /**
   * Ist die Umschalttaste schon gelernt? Wenn NICHT, gilt die Auto-Großschreibung:
   * Der kleine Buchstabe genügt für einen großen (der große erscheint trotzdem),
   * und es wird KEINE Umschalttaste verlangt/gezählt. Sobald sie gelernt ist,
   * werden Großbuchstaben „echt" mit Umschalt getippt.
   */
  shiftLearned: boolean;
  /**
   * Umschalt-Gegenhand-Regel erzwingen (Standard true). false = „Einhand
   * schreiben" (Lehrkraft-Häkchen am Kind): Großbuchstaben/Sonderzeichen werden
   * mit BELIEBIGER Umschalttaste (oder Feststelltaste) angenommen; es wird auch
   * keine bestimmte Umschalt-Seite mehr angesagt/angezeigt.
   */
  enforceShiftHand?: boolean;
  /**
   * ★ Zeilenende mit Enter (23.09.2026, Klassen-Einstellung
   * `TypingClass.zeilenEndeEnter`) - `true`: jede Zeile dieser Sitzung ist
   * erst fertig, wenn zusätzlich die Eingabetaste kommt. Sie zählt dann als
   * EIN Zeichen der Zeile (Tempo, Treffsicherheit) - nur in die Tasten-
   * Statistik (`onLetters`) geht sie NICHT ein, siehe `useTypingItem.ts`.
   * Vorgabe `false` (wie heute). Gilt NUR hier, nicht in RaetselLauf,
   * BuchstabensalatLauf, Fingerdiktat, Floe/Expedition oder „Tasten
   * erkunden" - die reichen den Wert gar nicht erst durch.
   */
  zeilenEnde?: boolean;
  /**
   * „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): 1 = aus (Standard),
   * 2 = doppelt, 3 = dreifach, 4 = vierfache Laufweite zwischen JEDEM
   * Zeichen - siehe `zeichenabstand.ts` und `.tt-laufweite` in `index.css`.
   * Der Aufrufer normalisiert den Kontowert vorher über
   * `zeichenabstandFaktor()`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  stufe: Stufe;
  /** Sprache der Übungsinhalte — wird je Übung mitgeschrieben (Statistik DE/EN). */
  lang?: Lang;
  voiceEnabled: boolean;
  /**
   * Tempo-Ziel (Anschläge/Min) für die Sterne dieser Runde — wächst mit der
   * Spielstufe und passt sich ans Kind an (siehe stars.ts). Fehlt es, gibt es
   * keine Tempo-Komponente (nur Treffsicherheit).
   */
  speedTarget?: number;
  /** Pro abgeschlossener Zeile (für Statistik + KI-/Eigenständigkeits-Check). */
  onItemDone?: (e: Omit<TaskEvent, "ts">) => void;
  /** Pro Zeile: die einzelnen Anschläge (für die Buchstaben-Auswertung). */
  onLetters?: (events: KeyEvent[]) => void;
  /**
   * Pro abgeschlossener Zeile: Genauigkeit (0..1) und Tempo (Anschläge/Min)
   * DIESER Zeile. Für die feinkörnige Anfangs-Kalibrierung der Leistungsstufe
   * schon WÄHREND der ersten Runde (siehe AdaptiveTrainer / progress.ts).
   */
  onLineDone?: (acc: number, cpm: number) => void;
  /** Am Rundenende (Genauigkeit 0..1, Anschläge/Min, Sterne 1..3). */
  onSessionDone?: (
    acc: number,
    cpm: number,
    stars: number,
    /**
     * Feinauskunft der Runde für die Abzeichen (badges.ts → RoundDetail):
     * Anschläge, Fehler, reine Tippzeit und die fehlerfreien Ketten. Der
     * vierte Platz ist bewusst optional — Aufrufer, die ihn nicht brauchen,
     * bleiben unverändert.
     */
    detail?: {
      keys: number;
      errors: number;
      ms: number;
      leadClean: number;
      trailClean: number;
      bestClean: number;
      hadError: boolean;
      keyboardHidden?: boolean;
      /**
       * War das ein WORTSPIEL? Dann zaehlt das Tempo dieser Runde nirgends -
       * weder fuer die Sterne noch fuer die Abzeichen noch fuer das persoenliche
       * Tempo-Ziel. Siehe `istWortspiel` in `account.ts`.
       */
      wortspiel?: boolean;
    },
  ) => void;
  /**
   * Kam in dieser Runde eine Leistungsstufe dazu? Dann zeigt die Abschluss-Karte
   * einen (bewusst NUMMERNLOSEN) Aufstiegs-Glückwunsch und spielt den besonderen
   * Aufstiegs-Klang statt des normalen 3-Sterne-Klangs (Wunsch #3). Die konkrete
   * Stufen-Nummer sehen nur Lehrkräfte (Klassenliste/Mail), nicht die Kinder.
   */
  leveledUp?: boolean;
  /**
   * In dieser Runde NEU verdiente Abzeichen (siehe badges.ts) — die Abschluss-
   * Karte zeigt sie als Chips, spielt den Abzeichen-Jingle und nennt sie in der
   * Ansage („Neues Abzeichen: Null-Fehler-Ninja!").
   */
  newBadges?: BadgeDef[];
  /**
   * ★ E8 (24.09.2026, Bauplan §7): der Lernweg DES KINDES - die Abschluss-
   * Karte braucht ihn für `badgeBeschreibung` (nur ein Abzeichen unterscheidet
   * sich je Weg: „Grundstellungs-Gorilla" nennt die Grundreihe des Weges).
   * OPTIONAL, Vorgabe „de" - jeder Aufrufer vor E8 verhält sich unverändert.
   */
  lernweg?: Lernweg;
  /** „Nochmal/Noch einmal" — die Eltern liefern frische Zeilen. */
  onRetry: () => void;
  /**
   * Beschriftung des Knopfs am Rundenende. Standard ist „Nochmal/Noch einmal"
   * (Lektion = dieselbe Lektion erneut). „Mein Training" liefert echte Folge-
   * Zeilen und setzt daher „Weiter".
   */
  retryLabel?: string;
  /** Optionaler Inhalt über dem Tippfeld (z. B. die Buchstaben-Karte). */
  topSlot?: React.ReactNode;
  /**
   * Die {@link StandZeile} (Stufe, Übezeit, Wochenziel, nächste Taste) - direkt
   * ÜBER dem Tippfeld, unter allem anderen.
   *
   * ★ Sie stand kurz UNTER dem Feld, aus Sorge vor einem Sprung beim
   * Ausblenden. Die Sorge ist unbegründet: Ausgeblendet wird nur die FARBE
   * (`opacity`), der Platz bleibt reserviert - die Schreibstelle bewegt sich
   * in keiner der beiden Lagen. Oben ist sie dort, wo man Status sucht
   * (Johannes 25.08.2026).
   */
  standSlot?: React.ReactNode;
  /**
   * Optionaler Inhalt in der Abschluss-Karte, direkt NEBEN dem „Weiter/Nochmal"-
   * Knopf — z. B. das Einweb-Angebot „Weiter mit deiner Geschichte?" (TW-E3) in
   * „Mein Training". Additiv; ohne bleibt die Karte wie bisher.
   */
  endSlot?: React.ReactNode;
  /**
   * Ein Satz am Rundenende, der eine HANDLUNG für die nächste Runde nennt
   * (siehe rueckmeldung.ts). Steht auf der Zusammenfassung UND wird angesagt -
   * für blinde Kinder ist die Ansage die Rückmeldung.
   */
  hinweis?: string | null;
  /** Erklärung dessen, was in der NÄCHSTEN Runde anders ist (Pseudowort-Zeilen). */
  naechsteRundeHinweis?: string | null;
  /**
   * Den Sternen-/Aufstiegs-Klang am Rundenende unterdrücken — z. B. wenn statt-
   * dessen die große Freischalt-Fanfare spielt (siehe UnlockCelebration), damit
   * nicht zwei Klänge übereinanderliegen. Die Sterne werden trotzdem angesagt.
   */
  suppressRewardSound?: boolean;
  /**
   * ★ Liegt gerade ein eigenes Fenster ÜBER der Abschluss-Karte — die
   * Freischalt-Feier (`UnlockCelebration`) oder die Expeditions-Bühne?
   *
   * Dann gehören Fokus-Falle und Escape DIESEM Fenster, nicht der Karte
   * darunter: zwei Fallen gleichzeitig ziehen den Fokus gegeneinander hin und
   * her, und zwei Escape-Wege würden die nächste Runde doppelt starten. Die
   * Trainer wissen als einzige, ob so ein Fenster offen ist, und sagen es hier.
   */
  ueberlagert?: boolean;
  /**
   * Den „Groß ohne Umschalt"-Hinweis unter dem Tippfeld unterdrücken — wenn er
   * stattdessen im LetterMap-Header angezeigt wird (AdaptiveTrainer / Mein Training).
   */
  hideAutoCapHint?: boolean;
  /**
   * Bei welcher Zeile (0-basiert) diese Runde beginnen soll — normalerweise 0.
   * Wird gesetzt, wenn die Sprache mitten in einer Runde gewechselt wird: dann
   * setzt der Elternteil die Zeilen-Position des letzten Stands hier rein, damit
   * keine schon getippten Sätze wiederholt werden.
   */
  initialQi?: number;
  /** Wird gerufen, wann immer sich die aktuelle Zeilen-Nummer (qi) ändert. */
  onQiChange?: (qi: number) => void;

  // ── Abbruch von aussen (Schreibprobe, 09.09.2026) ────────────────────────
  /**
   * ★★★ Ein ZÄHLER, kein Schalter: Jede Erhöhung bricht den laufenden Lauf ab
   * und meldet über {@link onStopp}, was in der ANGEFANGENEN Zeile schon
   * geschrieben wurde.
   *
   * Warum es das gibt: Bei einer Schreibprobe ist die Zeit um, wo sie um ist -
   * mitten in der Zeile. Ohne diesen Weg müsste der Aufrufer die Session
   * einfach aushängen; die angefangene Zeile wäre dann verloren. Bei zehn
   * Minuten Prüfungszeit sind das bis zu 40 Zeichen, und sie fehlen ausgerechnet
   * dem Kind, das gerade am schnellsten schrieb.
   *
   * Warum ein Zähler und kein `boolean`: Ein `true`, das `true` bleibt, feuert
   * nur einmal, und ein Aufrufer, der es zurücksetzt, hat einen zweiten Zustand
   * zu pflegen. Ein Zähler ist in beiden Richtungen eindeutig.
   */
  stoppSignal?: number;
  /**
   * Was in der angefangenen Zeile stand, als {@link stoppSignal} kam. Wird
   * genau EINMAL je Erhöhung gerufen, auch wenn nichts geschrieben wurde
   * (dann mit lauter Nullen) - der Aufrufer soll nicht raten müssen, ob er
   * eine Meldung bekommt.
   */
  onStopp?: (rest: {
    /** Richtig geschriebene Zeichen dieser Zeile. */
    chars: number;
    /** Fehlanschläge dieser Zeile. */
    errors: number;
    /** Zeit an dieser Zeile in ms, ohne die Wartezeit aufs Vorlesen. */
    ms: number;
    /** Die Anschläge dieser Zeile. */
    letters: KeyEvent[];
    /**
     * ★ F1c: das Zuhören in dieser angefangenen Zeile (ms) - bis zum Stopp,
     * auch nach dem letzten Anschlag. Ohne das verlor ein Kind, das beim
     * Abpfiff gerade der Zeilenansage zuhörte, genau diese Zeit auf der Uhr.
     */
    wartezeitMs: number;
    /**
     * ★ F1c: Zeilenwechsel-Pause vor dieser Zeile (oder, bei einem Stopp in
     * der Pause, die Pause bis zum Stopp) - Zeit der App, siehe
     * {@link onZeilenWartezeit}.
     */
    zeilenwechselMs: number;
  }) => void;
  /**
   * Die aufgelaufene WARTEZEIT auf das Vorlesen einer fertigen Zeile (ms).
   *
   * Die Session rechnet sie ohnehin aus, um das Zeilentempo fair zu halten -
   * die Schreibprobe zieht damit die Vorlesezeit von der Prüfungsuhr ab
   * (Johannes: „bei braillelesern wird die lesezeit abgezogen"). Ohne diesen
   * Weg müsste ein zweiter Zähler dieselbe Sache noch einmal messen, und zwei
   * Messungen derselben Sache laufen auseinander.
   *
   * ★★★★★ Seit F1c (18.09.2026) ungekappt und - mit
   * {@link zeilenuhrAbAnzeige}, also in Klassenmatch und Tippchallenge - mit
   * dem Zuhören VOR dem ersten Anschlag der Zeile (die Zeilenansage). Vorher
   * fehlte genau dieser Teil, und beide zogen ihn nicht von ihrer Uhr ab.
   *
   * Der zweite Wert ist die ZEILENWECHSEL-Pause vor dieser Zeile (nur mit
   * {@link zeilenuhrAbAnzeige}, sonst 0): die Zeit
   * vom Ende der vorigen Zeile, bis diese dastand (oder bis zum ersten
   * Anschlag, der in der Pause fiel). Das ist Zeit der App, kein Vorlesen -
   * darum getrennt: `wartezeitMs > 0` heisst weiter „die App hat vorgelesen"
   * (Zeitzuschlag nur ohne Messung, Mail an die Lehrkraft).
   */
  onZeilenWartezeit?: (ms: number, zeilenwechselMs: number) => void;
  /**
   * ★★★★★ DIE ZEILEN-UHR AB DER ANZEIGE (Bauplan F1c, `eineMessart.ts`) -
   * NUR für Klassenmatch und Tippchallenge, Standard `false`.
   *
   * `true`: Eine Zeile misst ihre Zeit ab dem Augenblick, in dem sie dasteht.
   * Das Zuhören davor (die Zeilenansage) wird gemessen und über
   * {@link onZeilenWartezeit} gemeldet, das Überlegen zählt, die
   * Zeilenwechsel-Pause wird eigens gemeldet - damit die FESTE Uhr dieser
   * beiden Modi genau das abziehen kann, was Zeit der App war.
   *
   * `false` (Üben, Wortspiele, Eigene Übung, Geschichten …): wie vor F1c - die
   * Zeile beginnt mit ihrem ERSTEN ANSCHLAG. Die Zeit davor (Lesen der neuen
   * Zeile, Zuhören, Überlegen) zählt beim Üben nicht. ⚠️ Bewusst so gelassen
   * (Entscheidung Johannes offen, NACHTLAUF-2026-09-19 §3): Ein Kind, das die Zeile auf
   * der Braillezeile oder mit dem eigenen Screenreader liest, erzeugt keine
   * messbare Wartezeit - diese Zeit als Überlegen zu zählen, senkte über Nacht
   * genau seine Übungszahlen (Sterne, Kalibrierung, Rundenlänge, Stufe).
   */
  zeilenuhrAbAnzeige?: boolean;
  /**
   * ★★★ LÄUFT DIE UHR DES AUFRUFERS SCHON, BEVOR DER ERSTE ANSCHLAG FÄLLT?
   * (nur mit {@link zeilenuhrAbAnzeige})
   *
   * Auch dort beginnt die ERSTE Zeile einer Runde mit ihrem ersten Anschlag,
   * denn davor läuft noch keine Uhr (Tippchallenge: die Prüfungsuhr startet
   * mit dem ersten Anschlag). `true` heisst: Die Uhr läuft schon, wenn die
   * erste Zeile erscheint - im Klassenmatch (fester Start für alle) und in
   * einer Tippchallenge, die nach einem Neuladen weiterläuft. Gelesen wird der
   * Wert beim Beginn einer Runde.
   */
  uhrLaeuftSchon?: boolean;
  /**
   * Pause zwischen zwei Zeilen in ms (Standard 550 - so lange braucht der
   * Erfolgsklang). Die Schreibprobe kürzt sie: Bei rund 170 Zeilen wären 550 ms
   * anderthalb Minuten, in denen die Prüfungsuhr läuft und niemand schreiben
   * kann.
   */
  zeilenPauseMs?: number;
  /**
   * ★★★ EIN VORSPANN AUF DER ZEILE - für die Tippchallenge der Zeitstand
   * (10.09.2026, Johannes: *„kann man den zeitstand links auf der zeile
   * mitlaufen lassen und dann 3 leerzeichen machen und dann beginnt der
   * text"*).
   *
   * Er steht im Eingabefeld VOR der Zeile und damit auf der Braillezeile links
   * vom Text - lesbar, ohne dass jemand eine Taste drücken muss. Getippt wird
   * er nie: Der Schreibzeiger sitzt hinter ihm, und `expected` ist unverändert
   * die Zeile.
   *
   * ⚠️ **Die Breite muss FEST sein.** Wechselt sie („9:59" auf „10:00"),
   * wandert der ganze Text unter den lesenden Fingern um eine Stelle. Der
   * Aufrufer liefert darum eine Zeichenkette gleichbleibender Länge.
   *
   * ⚠️ Nicht verwechseln mit einer Live-Region: Hier ändert sich der WERT eines
   * Feldes, es wird nichts gemeldet. Die Braillezeile aktualisiert die Zellen,
   * ohne den Lesefluss zu unterbrechen - das ist der Unterschied zu einer
   * Blitzmeldung ([[reference_live_region_ist_braille_blitzmeldung]]).
   * ⏳ Mit echtem NVDA und echter Braillezeile ist es NICHT nachgemessen.
   */
  zeilenPraefix?: string;
  /**
   * ★★★ ERSETZT DIE ZEILENSTRICHE im Kopf des Feldes.
   *
   * Für die Tippchallenge (Johannes 10.09.2026): Dort ist ein Strich je ZEILE
   * sinnlos - ein Text trägt 30 Minuten Vorrat, geschafft werden 17 bis 43
   * Zeilen (gemessen an der Klasse MSWEIN). Sie zeigt einen Strich je Minute
   * und die Uhr daneben. Der unsichtbare Text „Zeile x von y" bleibt stehen.
   */
  fortschrittSlot?: React.ReactNode;
  /**
   * ★★★ ERSETZT DIE BILDSCHIRM-TASTATUR unter dem Feld.
   *
   * Für das Klassenmatch (11.09.2026, F11): *„Während des Matchs UNTER dem
   * Eingabefeld statt der Tastatur ein Ranking."*
   *
   * ★ Ersetzt und steht nicht dazu: Die Tastatur ist ein Nachschlagewerk
   * („welche Taste liegt wo"), das Ranking ist das Spiel. Beide untereinander
   * schöben die Schreibstelle nach oben aus dem Bild - und ein Kind, das
   * gerade um die Wette schreibt, schaut nicht nach, wo das „t" liegt.
   *
   * Mit ersetzt werden der Umschalt-Hinweis und der Schalter „Tastatur
   * anzeigen": Ein Schalter für etwas, das gar nicht da ist, wäre genau die
   * Art von Kürzel, die stillschweigend nichts tut (R-A3).
   */
  untenSlot?: React.ReactNode;
  /**
   * ★★★ DEN SATZ AUSREDEN LASSEN (Tippchallenge, Johannes 10.09.2026:
   * *„Sprachausgabe soll weitersprechen wenn schon getippt wird"*).
   *
   * Solange der ganze Satz vom Zeilenanfang noch gesprochen wird oder wartet,
   * schweigen die Ansagen zum Anschlag. Ohne das würgte spätestens die
   * Leertaste nach dem ersten Wort den Satz ab - „nur das erste Wort".
   *
   * ★★★★★ Seit 04.11.2026 überall AN (Standard), auch im Lehrgang - Johannes,
   * nach der Meldung von Sarah: *„es muss überall möglich sein zu schreiben
   * während gelesen wird"*. Das revidiert seine Regel vom 03.09. („sofort wenn
   * eine Taste gedrückt wird muss die nächste angesagt werden") NUR für die
   * Zeit, in der die ganze Zeile am Zeilenanfang noch spricht; danach gilt
   * wieder die Ansage der nächsten Taste zum Anschlag.
   */
  satzAusreden?: boolean;
  /**
   * ★★★ „Mein Training" (Sara, 21.10.2026): am Zeilenanfang auch Zahlen- und
   * Sonderzeichen-Zeilen GANZ vorlesen (siehe `ReadModes.zeileGanz`).
   */
  zeileGanz?: boolean;
  /**
   * Wörter, die ZUSÄTZLICH zum Lexikon als echte Wörter gelten (klein, nur
   * Buchstaben - wie `normalizeWord` sie liefert). Für die Tippchallenge die
   * Wörter ihrer Texte, die das Wörterbuch kennt: Sie werden ganz gesprochen,
   * und eine Zeile aus ihnen wird als Satz gelesen.
   */
  zusatzWoerter?: ReadonlySet<string>;
  /**
   * ★★★ DER VORRAT WIRD VERLÄNGERT, NICHT NEU BEGONNEN (Klassenmatch, 11.09.2026).
   *
   * Sonst gilt: Eine neue `items`-Referenz ist eine neue Runde, zurück auf die
   * erste Zeile. Im Klassenmatch hiess das an jeder Chargen-Grenze: Abschluss-
   * Karte, Belohnungsklang, und das Tippfeld fiel einen Takt lang aus dem Baum
   * - mit ihm der Fokus und jeder Anschlag dieser Zeit (gemessen).
   *
   * Mit dem Schalter ist eine neue Liste, die mit den BISHERIGEN Zeilen
   * beginnt, Nachschub: Zeile und angefangene Eingabe bleiben stehen. Ein
   * Rundenende gibt es dann nicht mehr, `onSessionDone` wird nie gerufen. Ist
   * die letzte Zeile fertig, bevor Nachschub da ist, wartet die Session - die
   * Anschläge dieser Zeit werden mitgenommen wie in jeder Zeilenpause
   * (`tasteAnnehmen`) - und geht weiter, sobald er kommt. Beendet wird sie nur
   * über {@link stoppSignal}.
   */
  zeilenAnhaengen?: boolean;
  /**
   * ★ DIE WACKLIGEN TASTEN DES KINDES (Schritt M, 19.09.2026 - Johannes' Idee
   * H: *„wenn die dann manchmal überhaupt nicht wackeln und dann schon wieder,
   * ist das dann nicht ein Hinweis auf Schummeln?"*).
   *
   * Die Session hält sie beim ersten Anschlag einer Zeile fest und zählt, wie
   * diese Tasten in der Zeile gingen (`wackeligTreffer`/`wackeligVersuche` im
   * Ereignis). Nur gemessen, nirgends angezeigt. Der Aufrufer liefert die
   * Auswahl der Lehrkraft (`wackeligeTastenAus`); fehlt sie, wird nichts
   * gezählt.
   */
  wackeligeTasten?: readonly string[];
}

/**
 * ★★ DIE BESCHRIFTUNGEN DER ÜBUNGSKARTE in beiden Bedienungssprachen
 * (Probestück „englische Bedienung", 12.09.2026). Deutsch wortgleich wie
 * vorher. Englisch britisch, Glossar im Bauplan §4 (Shift, space bar,
 * keystrokes per minute - nicht in WPM umgerechnet).
 */
/**
 * ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.3, F3/S3): bis W1
 * stand hier eine lokale Liste `FINGER_FR`, und `fingerHinweis` nannte die
 * ZEICHEN auf Französisch und Spanisch über das DEUTSCHE `charLabel` - in der
 * französischen Oberfläche stand „senkrechter Strich, index droit", „großes D,
 * majeur gauche", in der spanischen „großes I, medio derecho". Jetzt nennt
 * jede Bedienungssprache Zeichen und Finger in ihrer Sprache
 * (`spokenLabel`/`fingerName`, dieselben Namen wie die Sprachausgabe).
 * Wächter: `tests/tastenflow-w1-zeichennamen-je-sprache.test.ts`.
 */

/**
 * ★★ W1 (27.09.2026, BEFUND §3.3 F6): der Fingerhinweis für ein Zeichen über
 * eine TOTASTE („ô", „Ê", „À" auf Windows-AZERTY, „Ä" auf der Schweizer
 * Tastatur). Bis W1 stand dort nur „ô," - ohne Finger und Taste, weil das
 * Zeichen auf keiner Taste liegt. Jetzt: die Totaste mit ihrem Finger (und
 * AltGr/Umschalt, falls nötig), dann der Buchstabe wie jeder andere.
 */
interface TotastenHinweis {
  /** Name der Totaste in der Bedienungssprache („accent circonflexe"). */
  totName: string;
  /** Der Finger der Totaste, schon in der Bedienungssprache. */
  totFinger: string;
  /** Braucht die Totaste AltGr oder Umschalt? */
  totMod: "altgr" | "shift" | undefined;
  /** Die Beschriftung der AltGr-Taste auf dieser Tastatur. */
  altgrName: string;
  /** Der Hinweis für den Buchstaben danach (wie `fingerHinweis`). */
  dann: string;
}


export const SITZUNG_TEXTE = texte({
  de: {
    leertasteDaumen: "Leertaste mit dem Daumen",
    // ★ Zeilenende mit Enter (23.09.2026) - fester Satz wie bei der Leertaste.
    eingabetasteFinger: "Eingabetaste mit dem rechten kleinen Finger",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${charLabel(zeichen)}, ${f?.name ?? ""}` +
      (seite
        ? ` + ${seite === "links" ? "linke" : "rechte"} Umschalttaste`
        : umschalt
          ? " + Umschalttaste"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Umschalttaste" : ""}), dann ${h.dann}`,
    fertig: "Fertig!",
    // In TEILEN (`Teil` in lib/bedienSprache/texte.ts): genau die Textknoten, die
    // das JSX vorher erzeugte - der Prüfstand liest sie einzeln.
    zeileVon: (n: number, gesamt: number) => ["Zeile ", n, " von ", gesamt],
    fingerTitel: "Welcher Finger als Nächstes dran ist.",
    zeilenTitel: "Die Zeilen dieser Runde.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Klang lädt …",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Schreibzeiger verschieben: nach links ziehen oder zurück zur Mitte. Doppelklick: zurück zur Vorgabe.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Geschriebenes verschwindet sofort. Nach links ziehen: bleibt länger stehen. Doppelklick: Vorgabe."
        : z === 0
        ? "Ausblenden ist aus - alles Geschriebene bleibt stehen. Zum Schreibzeiger hin ziehen, dann verschwindet es."
        : `Geschriebenes verschwindet nach ${z} Zeichen. Zum Schreibzeiger ziehen: früher weg. Ganz nach links: bleibt stehen. Doppelklick: Vorgabe.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Nach unten ziehen: mehrere Zeilen wie auf einer Seite. Der Schreibzeiger wandert mit, danach kommt eine neue Seite."
        : `${n} Zeilen pro Seite. Nach unten ziehen: mehr Zeilen. Ganz nach oben: wieder eine Zeile. Doppelklick: eine Zeile.`,
    umschaltZweimal: "Umschalttaste zweimal drücken - dann wird der Finger angesagt.",
    tastaturTitel: "Die Tastatur zum Nachschauen - ein oder aus.",
    tastatur: (offen: boolean) => [" Tastatur", " ", offen ? "ausblenden" : "anzeigen"],
    aufstieg: (sober: boolean) =>
      sober ? "Aufstieg: nächste Übungsstufe." : "Aufstieg! Du wirst immer besser!",
    sterne: (n: number) => `${n} von 3 Sternen`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "de", { one: () => "Neues Abzeichen!", other: () => "Neue Abzeichen!" }),
    treffsicherheitName: (prozent: string) => `Treffsicherheit ${prozent}`,
    treffsicherheit: "Treffsicherheit",
    tempoName: (anschlaege: number) => `Tempo ${anschlaege} Anschläge pro Minute`,
    anschlaegeMin: "Anschläge/Min",
    tempoZiel: (anschlaege: number) => ["Tempo-Ziel für 3 Sterne: ", anschlaege, " Anschläge/Min"],
    // ★ EN1 (19.09.2026): die Meldungen im Live-Bereich beim Tippen (nur bei
    // „Buchstabieren") - Deutsch wortgleich wie vorher, samt dem Leerzeichen
    // vor dem Komma im Umschalt-Satz (so stand er da).
    geschafft: "Geschafft.",
    falsch: (richtig: string) => `Falsch. Richtig ist: ${richtig}.`,
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Fast! ${zeichen} braucht die ${links ? "linke" : "rechte"} Umschalttaste ` +
      `, nicht die andere und nicht die Feststelltaste.`,
  },
  en: {
    leertasteDaumen: "Space bar with your thumb",
    // ★ Finish each line with Enter (23.09.2026) - fixed phrase like space bar.
    eingabetasteFinger: "Enter with your right little finger",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "en")}, ${f ? fingerName(f, "en") : ""}` +
      (seite ? ` + ${seite === "links" ? "left" : "right"} Shift` : umschalt ? " + Shift" : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), then ${h.dann}`,
    fertig: "Done!",
    zeileVon: (n: number, gesamt: number) => ["Line ", n, " of ", gesamt],
    fingerTitel: "Which finger comes next.",
    zeilenTitel: "The lines of this round.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Loading sound …",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Move the cursor: drag left, or back to the middle. Double-click: back to the default.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Typed text disappears at once. Drag left: it stays longer. Double-click: default."
        : z === 0
        ? "Fading is off - everything you type stays visible. Drag towards the cursor to make it fade."
        : `Typed text fades after ${z} characters. Drag towards the cursor: gone sooner. All the way left: stays visible. Double-click: default.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Drag down: several lines like on a page. The cursor moves along, then a new page starts."
        : `${n} lines per page. Drag down: more lines. All the way up: back to one line. Double-click: one line.`,
    umschaltZweimal: "Press Shift twice to hear which finger to use.",
    tastaturTitel: "Show or hide the on-screen keyboard.",
    tastatur: (offen: boolean) => [" ", offen ? "Hide keyboard" : "Show keyboard"],
    aufstieg: (sober: boolean) =>
      sober ? "Level up: next level." : "Level up! You're getting better and better!",
    sterne: (n: number) => `${n} of 3 stars`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "en", { one: () => "New badge!", other: () => "New badges!" }),
    treffsicherheitName: (prozent: string) => `Accuracy ${prozent}`,
    treffsicherheit: "Accuracy",
    tempoName: (anschlaege: number) => `Speed ${anschlaege} keystrokes per minute`,
    anschlaegeMin: "Keystrokes/min",
    tempoZiel: (anschlaege: number) => ["Speed goal for 3 stars: ", anschlaege, " keystrokes/min"],
    // Kein „wrong" (Glossar §1.4) - die Meldung sagt, welche Taste gemeint war.
    geschafft: "Done.",
    falsch: (richtig: string) => `Not quite. The right one is: ${richtig}.`,
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Almost! ${zeichen} needs the ${links ? "left" : "right"} Shift key, not the other one and not Caps Lock.`,
  },
  // ★ E11a: „tu" - die Übungsseite spricht immer die lernende Person an (F9).
  // ★ W1 (27.09.2026, F3): Zeichen und Finger auf Französisch (siehe oben).
  fr: {
    leertasteDaumen: "Espace avec le pouce",
    eingabetasteFinger: "Touche Entrée avec l'auriculaire droit",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "fr")}, ${f ? (fingerName(f, "fr") ?? "") : ""}` +
      (seite
        ? ` + touche Majuscule ${seite === "links" ? "gauche" : "droite"}`
        : umschalt
          ? " + touche Majuscule"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + touche Majuscule" : ""}), puis ${h.dann}`,
    fertig: "Terminé !",
    zeileVon: (n: number, gesamt: number) => ["Ligne ", n, " sur ", gesamt],
    fingerTitel: "Quel doigt vient ensuite.",
    zeilenTitel: "Les lignes de cette série.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Chargement du son …",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Déplacer le curseur : tire vers la gauche ou vers le milieu. Double-clic : retour au réglage de base.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Le texte tapé disparait aussitôt. Tire vers la gauche : il reste plus longtemps. Double-clic : réglage d'origine."
        : z === 0
        ? "Le fondu est désactivé : tout le texte tapé reste visible. Tire vers le curseur pour qu'il disparaisse."
        : `Le texte tapé disparait après ${z} caractères. Vers le curseur : plus tôt. Tout à gauche : il reste. Double-clic : réglage de base.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Tire vers le bas : plusieurs lignes comme sur une page. Le curseur avance, puis une nouvelle page commence."
        : `${n} lignes par page. Vers le bas : plus de lignes. Tout en haut : une seule ligne. Double-clic : une ligne.`,
    umschaltZweimal: "Appuie deux fois sur la touche Majuscule - le doigt à utiliser est alors annoncé.",
    tastaturTitel: "Le clavier pour vérifier - affiché ou masqué.",
    tastatur: (offen: boolean) => [" ", offen ? "Masquer" : "Afficher", " le clavier"],
    aufstieg: (sober: boolean) =>
      sober ? "Niveau supérieur : palier suivant." : "Niveau supérieur ! Tu progresses de plus en plus !",
    sterne: (n: number) => `${n} sur 3 étoiles`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "fr", { one: () => "Nouveau badge !", other: () => "Nouveaux badges !" }),
    treffsicherheitName: (prozent: string) => `Précision ${prozent}`,
    treffsicherheit: "Précision",
    tempoName: (anschlaege: number) => `Vitesse ${anschlaege} frappes par minute`,
    anschlaegeMin: "Frappes/min",
    tempoZiel: (anschlaege: number) => ["Objectif de vitesse pour 3 étoiles : ", anschlaege, " frappes/min"],
    geschafft: "Réussi.",
    falsch: (richtig: string) => `Pas tout à fait. La bonne réponse est : ${richtig}.`,
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Presque ! ${zeichen} a besoin de la touche Majuscule ${links ? "gauche" : "droite"}, pas de l'autre ni de Verr. Maj.`,
  },
  // ★ ES-O (27.09.2026): tú; Fingernamen aus `fingers.ts` (ES-F8), Tasten nach
  // Glossar S13 (Mayús, Bloq Mayús, Intro).
  es: {
    leertasteDaumen: "Barra espaciadora con el pulgar",
    eingabetasteFinger: "Intro con el meñique derecho",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "es")}, ${f ? (fingerName(f, "es") ?? "") : ""}` +
      (seite
        ? ` + tecla Mayús ${seite === "links" ? "izquierda" : "derecha"}`
        : umschalt
          ? " + tecla Mayús"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + tecla Mayús" : ""}), después ${h.dann}`,
    fertig: "¡Terminado!",
    zeileVon: (n: number, gesamt: number) => ["Línea ", n, " de ", gesamt],
    fingerTitel: "Qué dedo va ahora.",
    zeilenTitel: "Las líneas de esta serie.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Cargando sonido …",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Mover el cursor: arrastra a la izquierda o de vuelta al centro. Doble clic: volver a lo predeterminado.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Lo escrito desaparece al instante. Arrastra a la izquierda: se queda más tiempo. Doble clic: valor inicial."
        : z === 0
        ? "El desvanecido está desactivado: todo lo escrito sigue visible. Arrastra hacia el cursor para que desaparezca."
        : `Lo escrito desaparece tras ${z} caracteres. Hacia el cursor: antes. Del todo a la izquierda: se queda. Doble clic: predeterminado.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Arrastra hacia abajo: varias líneas como en una página. El cursor avanza y luego empieza una página nueva."
        : `${n} líneas por página. Hacia abajo: más líneas. Del todo arriba: una sola línea. Doble clic: una línea.`,
    umschaltZweimal: "Pulsa dos veces la tecla Mayús y se anuncia qué dedo usar.",
    tastaturTitel: "El teclado para comprobar - visible u oculto.",
    tastatur: (offen: boolean) => [" ", offen ? "Ocultar" : "Mostrar", " el teclado"],
    aufstieg: (sober: boolean) =>
      sober ? "Subes de nivel: siguiente escalón." : "¡Subes de nivel! ¡Cada vez lo haces mejor!",
    sterne: (n: number) => `${n} de 3 estrellas`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "es", { one: () => "¡Insignia nueva!", other: () => "¡Insignias nuevas!" }),
    treffsicherheitName: (prozent: string) => `Precisión ${prozent}`,
    treffsicherheit: "Precisión",
    tempoName: (anschlaege: number) => `Velocidad ${anschlaege} pulsaciones por minuto`,
    anschlaegeMin: "Pulsaciones por minuto",
    tempoZiel: (anschlaege: number) => ["Meta de velocidad para 3 estrellas: ", anschlaege, " pulsaciones por minuto"],
    geschafft: "Conseguido.",
    falsch: (richtig: string) => `Casi. La respuesta correcta es: ${richtig}.`,
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `¡Casi! ${zeichen} necesita la tecla Mayús ${links ? "izquierda" : "derecha"}, no la otra ni Bloq Mayús.`,
  },
  // ★ O-IT (02.10.2026): „tu"; Tastennamen wie auf der italienischen Kappe
  // (Glossar §2.9); höchstens ein Ausrufezeichen je Meldung (Regel 1).
  it: {
    leertasteDaumen: "Barra spaziatrice con il pollice",
    eingabetasteFinger: "Invio con il mignolo destro",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "it")}, ${f ? (fingerName(f, "it") ?? "") : ""}` +
      (seite
        ? ` + tasto Maiusc ${seite === "links" ? "sinistro" : "destro"}`
        : umschalt
          ? " + tasto Maiusc"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + tasto Maiusc" : ""}), poi ${h.dann}`,
    fertig: "Finito!",
    zeileVon: (n: number, gesamt: number) => ["Riga ", n, " di ", gesamt],
    fingerTitel: "Quale dito tocca adesso.",
    zeilenTitel: "Le righe di questo giro.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Caricamento suono …",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Sposta il cursore: trascina a sinistra o di nuovo al centro. Doppio clic: torna all'impostazione di base.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Il testo scritto sparisce subito. Trascina a sinistra: resta più a lungo. Doppio clic: impostazione iniziale."
        : z === 0
        ? "La dissolvenza è disattivata: tutto il testo scritto resta visibile. Trascina verso il cursore per farlo sparire."
        : `Il testo scritto sparisce dopo ${z} caratteri. Verso il cursore: prima. Tutto a sinistra: resta. Doppio clic: impostazione di base.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Trascina in basso: più righe come su una pagina. Il cursore avanza, poi inizia una nuova pagina."
        : `${n} righe per pagina. In basso: più righe. Tutto in alto: di nuovo una riga. Doppio clic: una riga.`,
    umschaltZweimal: "Premi due volte il tasto Maiusc e senti quale dito usare.",
    tastaturTitel: "La tastiera per controllare - visibile o nascosta.",
    tastatur: (offen: boolean) => [" ", offen ? "Nascondi" : "Mostra", " la tastiera"],
    aufstieg: (sober: boolean) =>
      sober ? "Sali di livello: prossimo gradino." : "Sali di livello! Vai sempre meglio.",
    sterne: (n: number) => `${n} di 3 stelle`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "it", { one: () => "Nuova medaglia!", other: () => "Nuove medaglie!" }),
    treffsicherheitName: (prozent: string) => `Precisione ${prozent}`,
    treffsicherheit: "Precisione",
    tempoName: (anschlaege: number) => `Velocità ${anschlaege} battute al minuto`,
    anschlaegeMin: "Battute al minuto",
    tempoZiel: (anschlaege: number) => ["Obiettivo di velocità per 3 stelle: ", anschlaege, " battute al minuto"],
    geschafft: "Fatto.",
    falsch: (richtig: string) => `Quasi. La risposta giusta è: ${richtig}.`,
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Quasi! ${zeichen} richiede il tasto Maiusc ${links ? "sinistro" : "destro"}, non l'altro e non Bloc Maiusc.`,
  },
  // ★ O-PL (02.10.2026): Glossar §2.1/§2.9 (spacja, Enter, Shift, mały palec),
  // Zeile = „wiersz", „2 z 3 gwiazdek", „uderzeń na minutę" mit vier Formen;
  // nie gegen das Kind („Prawie." statt „Źle!").
  pl: {
    leertasteDaumen: "Spacja kciukiem",
    eingabetasteFinger: "Enter prawym małym palcem",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "pl")}, ${f ? (fingerName(f, "pl") ?? "") : ""}` +
      (seite
        ? ` + ${seite === "links" ? "lewy" : "prawy"} Shift`
        : umschalt
          ? " + Shift"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), potem ${h.dann}`,
    fertig: "Gotowe!",
    zeileVon: (n: number, gesamt: number) => ["Wiersz ", n, " z ", gesamt],
    fingerTitel: "Który palec jest teraz potrzebny.",
    zeilenTitel: "Wiersze tej rundy.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Wczytywanie dźwięku ...",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Przesuń kursor w lewo albo z powrotem na środek. Dwuklik: ustawienie domyślne.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Napisany tekst znika od razu. Przesuń w lewo: zostaje dłużej. Dwuklik: ustawienie domyślne."
        : z === 0
        ? "Znikanie jest wyłączone - cały napisany tekst zostaje. Przesuń punkt w stronę kursora, aby znikał."
        : `Napisany tekst znika po ${z} znakach. W stronę kursora: szybciej. Do lewej krawędzi: zostaje. Dwuklik: domyślnie.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Przesuń w dół: kilka wierszy jak na stronie. Kursor idzie dalej, potem zaczyna się nowa strona."
        : `${n} ${n >= 2 && n <= 4 ? "wiersze" : "wierszy"} na stronie. W dół: więcej wierszy. Do góry: znowu jeden wiersz. Dwuklik: jeden wiersz.`,
    umschaltZweimal: "Naciśnij dwa razy Shift - wtedy usłyszysz, którego palca użyć.",
    tastaturTitel: "Klawiatura do podejrzenia - widoczna albo ukryta.",
    tastatur: (offen: boolean) => [" ", offen ? "Ukryj" : "Pokaż", " klawiaturę"],
    aufstieg: (sober: boolean) =>
      sober ? "Awans: następny poziom." : "Awans! Idzie ci coraz lepiej!",
    sterne: (n: number) => `${n} z 3 gwiazdek`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "pl", {
        one: () => "Nowa odznaka!",
        few: () => "Nowe odznaki!",
        many: () => "Nowe odznaki!",
        other: () => "Nowe odznaki!",
      }),
    treffsicherheitName: (prozent: string) => `Dokładność ${prozent}`,
    treffsicherheit: "Dokładność",
    tempoName: (anschlaege: number) =>
      `Tempo: ${mehrzahl(anschlaege, "pl", {
        one: (z) => `${z} uderzenie na minutę`,
        few: (z) => `${z} uderzenia na minutę`,
        many: (z) => `${z} uderzeń na minutę`,
        other: (z) => `${z} uderzenia na minutę`,
      })}`,
    anschlaegeMin: "Uderzenia/min",
    tempoZiel: (anschlaege: number) => [
      "Cel tempa na 3 gwiazdki: ",
      anschlaege,
      mehrzahl(anschlaege, "pl", {
        one: () => " uderzenie na minutę",
        few: () => " uderzenia na minutę",
        many: () => " uderzeń na minutę",
        other: () => " uderzenia na minutę",
      }),
    ],
    geschafft: "Udało się.",
    falsch: (richtig: string) => `Prawie. Poprawnie: ${richtig}.`,
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Prawie! ${zeichen} wymaga ${links ? "lewego" : "prawego"} klawisza Shift, nie drugiego i nie Caps Lock.`,
  },
  // ★ O-TR (02.10.2026): sen; Glossar §2.1/§2.9 (boşluk çubuğu, Enter tuşu, Shift,
  // serçe parmak), Zeile = "satır", "Satır 3, toplam 12" und "2 yıldız (en çok 3)"
  // (Regel 6: keine Endung an eine Zahl), "dakikada vuruş" mit Einzahl, Spalte
  // "Vuruş/dk"; nie gegen das Kind ("Henüz değil." statt "Yanlış!").
  tr: {
    leertasteDaumen: "Boşluk çubuğu başparmakla",
    eingabetasteFinger: "Enter tuşu sağ serçe parmakla",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "tr")}, ${f ? (fingerName(f, "tr") ?? "") : ""}` +
      (seite
        ? ` + ${seite === "links" ? "sol" : "sağ"} Shift`
        : umschalt
          ? " + Shift"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), sonra ${h.dann}`,
    fertig: "Bitti!",
    zeileVon: (n: number, gesamt: number) => ["Satır ", n, ", toplam ", gesamt],
    fingerTitel: "Sırada hangi parmak var.",
    zeilenTitel: "Bu turun satırları.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Ses yükleniyor ...",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "İmleci taşı: sola ya da ortaya geri kaydır. İki kez bas: varsayılana dön.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Yazılan hemen kaybolur. Sola kaydır: daha uzun kalır. İki kez bas: varsayılan."
        : z === 0
        ? "Soldurma kapalı - yazılan her şey görünür kalır. Kaybolması için noktayı imlece doğru kaydır."
        : `Yazılan metin ${z} karakter sonra kaybolur. İmlece doğru: daha erken. En sola: kalır. İki kez bas: varsayılan.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Aşağı kaydır: bir sayfadaki gibi birkaç satır. İmleç ilerler, sonra yeni sayfa başlar."
        : `Sayfa başına ${n} satır. Aşağı: daha çok satır. En yukarı: yine tek satır. İki kez bas: tek satır.`,
    umschaltZweimal: "Shift tuşuna iki kez bas - hangi parmağı kullanacağını duyarsın.",
    tastaturTitel: "Bakmak için ekran klavyesi - göster ya da gizle.",
    tastatur: (offen: boolean) => [" ", offen ? "Klavyeyi gizle" : "Klavyeyi göster"],
    aufstieg: (sober: boolean) =>
      sober ? "Yeni seviye: sonraki alıştırma seviyesi." : "Seviye atladın! Gittikçe daha iyi oluyorsun.",
    sterne: (n: number) => `${n} yıldız (en çok 3)`,
    // Kein Zahlwort davor - "rozetler" ist hier die echte Mehrzahl.
    neueAbzeichen: (n: number) => (n === 1 ? "Yeni rozet!" : "Yeni rozetler!"),
    treffsicherheitName: (prozent: string) => `Doğruluk: ${prozent}`,
    treffsicherheit: "Doğruluk",
    tempoName: (anschlaege: number) => `Hız: dakikada ${anschlaege} vuruş`,
    anschlaegeMin: "Vuruş/dk",
    tempoZiel: (anschlaege: number) => ["3 yıldız için hız hedefi: dakikada ", anschlaege, " vuruş"],
    geschafft: "Başardın.",
    falsch: (richtig: string) => `Henüz değil. Doğrusu: ${richtig}.`,
    // Satzanfang mit grossFuer ("büyük A" ⇒ "Büyük A"); Endung an "tuş" (Regel 6).
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Neredeyse! ${grossFuer(zeichen.slice(0, 1), "tr")}${zeichen.slice(1)} için ${links ? "sol" : "sağ"} Shift tuşu gerekir; diğeri ve Caps Lock olmaz.`,
  },
  // ★ O-CS (03.10.2026): ty; Glossar §2.1/§2.9 (mezerník, Enter, Shift mit
  // Kopfwort „klávesa", pravý malíček), Zeile = „řádek", „Řádek 3/12" und
  // „Hvězdičky: 2/3" (Schrägstrich statt „z/ze", Regel 13), „úhozy za minutu"
  // mit vier Formen, Spalte „úhozů/min"; keine Vergangenheit der 2. Person
  // („Povedlo se." statt einer Form mit Geschlecht), nie gegen das Kind („Ještě ne.").
  cs: {
    leertasteDaumen: "Mezerník palcem",
    eingabetasteFinger: "Enter pravým malíčkem",
    fingerHinweis: (
      zeichen: string,
      f: Parameters<typeof fingerName>[0] | null | undefined,
      seite: "links" | "rechts" | null,
      umschalt: boolean,
    ) =>
      `${spokenLabel(zeichen, "cs")}, ${f ? (fingerName(f, "cs") ?? "") : ""}` +
      (seite
        ? ` + ${seite === "links" ? "levý" : "pravý"} Shift`
        : umschalt
          ? " + Shift"
          : ""),
    fingerHinweisTotaste: (h: TotastenHinweis) =>
      `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), potom ${h.dann}`,
    fertig: "Hotovo!",
    zeileVon: (n: number, gesamt: number) => ["Řádek ", n, "/", gesamt],
    fingerTitel: "Který prst je na řadě.",
    zeilenTitel: "Řádky tohoto kola.",
    // ★ 16.10.2026: Melodie - Aufnahmen werden noch geladen (MelodieLadeanzeige).
    melodieLaedt: "Načítá se zvuk ...",
    // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
    anfasserZeiger: "Posunout kurzor: táhni doleva nebo zpět doprostřed. Dvojklik: zpět na výchozí.",
    anfasserAusblenden: (z: number) =>
      z < 0
        ? "Napsaný text hned zmizí. Táhni doleva: zůstane déle. Dvojklik: výchozí nastavení."
        : z === 0
        ? "Mizení je vypnuté - vše napsané zůstává vidět. Táhni ke kurzoru, aby text mizel."
        : `Napsaný text zmizí po ${z} znacích. Ke kurzoru: dřív. Úplně doleva: zůstane. Dvojklik: výchozí.`,
    anfasserSeite: (n: number) =>
      n <= 1
        ? "Táhni dolů: více řádků jako na stránce. Kurzor jde s textem, pak začne nová stránka."
        : `${n} ${n >= 2 && n <= 4 ? "řádky" : "řádků"} na stránku. Dolů: více řádků. Úplně nahoru: zase jeden řádek. Dvojklik: jeden řádek.`,
    umschaltZweimal: "Stiskni dvakrát klávesu Shift - uslyšíš, kterým prstem psát.",
    tastaturTitel: "Klávesnice na obrazovce - zobrazit nebo skrýt.",
    tastatur: (offen: boolean) => [" ", offen ? "Skrýt klávesnici" : "Zobrazit klávesnici"],
    aufstieg: (sober: boolean) =>
      sober ? "Postup: další úroveň cvičení." : "Postup na další úroveň! Jde ti to čím dál líp.",
    sterne: (n: number) => `Hvězdičky: ${n}/3`,
    neueAbzeichen: (n: number) =>
      mehrzahl(n, "cs", {
        one: () => "Nový odznak!",
        few: () => "Nové odznaky!",
        many: () => "Nové odznaky!",
        other: () => "Nové odznaky!",
      }),
    treffsicherheitName: (prozent: string) => `Přesnost: ${prozent}`,
    treffsicherheit: "Přesnost",
    tempoName: (anschlaege: number) =>
      `Rychlost: ${mehrzahl(anschlaege, "cs", {
        one: (z) => `${z} úhoz za minutu`,
        few: (z) => `${z} úhozy za minutu`,
        many: (z) => `${z} úhozu za minutu`,
        other: (z) => `${z} úhozů za minutu`,
      })}`,
    anschlaegeMin: "úhozů/min",
    tempoZiel: (anschlaege: number) => ["Cílová rychlost pro 3 hvězdičky: ", anschlaege, " úhozů/min"],
    geschafft: "Povedlo se.",
    // Ohne Schlusspunkt: das Zeichen kann eine Ziffer sein („5." wäre die
    // Ordnungszahl, Glossar §4 Falle 4).
    falsch: (richtig: string) => `Ještě ne. Správně je: ${richtig}`,
    // Satzanfang gross („velké A" ⇒ „Velké A"); Kopfwort „klávesu" (Regel 11).
    umschaltFalsch: (zeichen: string, links: boolean) =>
      `Skoro! ${grossFuer(zeichen.slice(0, 1), "cs")}${zeichen.slice(1)} vyžaduje ${links ? "levou" : "pravou"} klávesu Shift, ne tu druhou a ne Caps Lock.`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      leertasteDaumen: "Интервал с палеца",
      eingabetasteFinger: "Enter с дясното кутре",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "bg")}, ${f ? fingerName(f, "bg") : ""}` +
        (seite ? ` + ${seite === "links" ? "ляв" : "десен"} Shift` : umschalt ? " + Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), след това ${h.dann}`,
      fertig: "Готово!",
      zeileVon: (n: number, gesamt: number) => ["Ред ", n, "/", gesamt],
      fingerTitel: "Кой пръст е следващият.",
      zeilenTitel: "Редовете в този кръг.",
      melodieLaedt: "Зареждане на звука...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Премести курсора: плъзни наляво или обратно към средата. Двойно щракване: по подразбиране.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "Написаното изчезва веднага. Наляво: остава по-дълго. Двойно щракване: по подразбиране."
          : z === 0
          ? "Избледняването е изключено - всичко написано остава. Плъзни към курсора, за да изчезва."
          : `Написаното изчезва след ${z} знака. Към курсора: по-рано. Най-вляво: остава. Двойно щракване: по подразбиране.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Плъзни надолу: няколко реда като на страница. Курсорът върви напред, после започва нова страница."
          : `${n} реда на страница. Надолу: повече редове. Най-горе: пак един ред. Двойно щракване: един ред.`,
      umschaltZweimal: "Натисни Shift два пъти, за да чуеш кой пръст да използваш.",
      tastaturTitel: "Покажи или скрий екранната клавиатура.",
      tastatur: (offen: boolean) => [" ", offen ? "Скрий клавиатурата" : "Покажи клавиатурата"],
      aufstieg: (sober: boolean) =>
        sober ? "Напред: следващо ниво." : "Ново ниво. Пишеш все по-добре!",
      sterne: (n: number) => `${n}/3 звездички`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "bg", { one: () => "Нова значка!", other: () => "Нови значки!" }),
      treffsicherheitName: (prozent: string) => `Точност: ${prozent}`,
      treffsicherheit: "Точност",
      tempoName: (anschlaege: number) => `Скорост: ${anschlaege} знака в минута`,
      anschlaegeMin: "Знаци/мин",
      tempoZiel: (anschlaege: number) => ["Цел за скорост за 3 звездички: ", anschlaege, " знака в минута"],
      geschafft: "Готово.",
      falsch: (richtig: string) => `Още не. Правилно е: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Почти! За ${zeichen} е нужен ${links ? "левият" : "десният"} Shift, не другият и не Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      leertasteDaumen: "Πλήκτρο διαστήματος με τον αντίχειρα",
      eingabetasteFinger: "Enter με το δεξί μικρό δάχτυλο",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "el")}, ${f ? fingerName(f, "el") : ""}` +
        (seite ? ` + ${seite === "links" ? "αριστερό" : "δεξί"} Shift` : umschalt ? " + Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), μετά ${h.dann}`,
      fertig: "Τέλος!",
      zeileVon: (n: number, gesamt: number) => ["Γραμμή ", n, " από ", gesamt],
      fingerTitel: "Ποιο δάχτυλο έρχεται μετά.",
      zeilenTitel: "Οι γραμμές αυτού του γύρου.",
      melodieLaedt: "Φόρτωση ήχου...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Μετακίνηση δρομέα: σύρε αριστερά ή πίσω στη μέση. Διπλό κλικ: προεπιλογή.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "Το γραμμένο κείμενο χάνεται αμέσως. Σύρε αριστερά: μένει περισσότερο. Διπλό κλικ: προεπιλογή."
          : z === 0
          ? "Το ξεθώριασμα είναι ανενεργό - όλο το γραμμένο κείμενο μένει. Σύρε προς τον δρομέα για να χάνεται."
          : `Το γραμμένο κείμενο χάνεται μετά από ${z} χαρακτήρες. Προς τον δρομέα: νωρίτερα. Τέρμα αριστερά: μένει. Διπλό κλικ: προεπιλογή.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Σύρε προς τα κάτω: πολλές γραμμές όπως σε σελίδα. Ο δρομέας προχωρά, μετά αρχίζει νέα σελίδα."
          : `${n} γραμμές ανά σελίδα. Κάτω: περισσότερες γραμμές. Τέρμα πάνω: πάλι μία γραμμή. Διπλό κλικ: μία γραμμή.`,
      umschaltZweimal: "Πάτησε δύο φορές το Shift για να ακούσεις ποιο δάχτυλο χρειάζεται.",
      tastaturTitel: "Εμφάνιση ή απόκρυψη του πληκτρολογίου οθόνης.",
      tastatur: (offen: boolean) => [" ", offen ? "Απόκρυψη πληκτρολογίου" : "Εμφάνιση πληκτρολογίου"],
      aufstieg: (sober: boolean) =>
        sober ? "Άνοδος: επόμενο επίπεδο." : "Ανέβηκες επίπεδο! Πας όλο και καλύτερα!",
      sterne: (n: number) => `${n} από 3 αστέρια`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "el", { one: () => "Νέο μετάλλιο!", other: () => "Νέα μετάλλια!" }),
      treffsicherheitName: (prozent: string) => `Ακρίβεια ${prozent}`,
      treffsicherheit: "Ακρίβεια",
      tempoName: (anschlaege: number) =>
        `Ταχύτητα: ${mehrzahl(anschlaege, "el", { one: (z) => `${z} πάτημα`, other: (z) => `${z} πατήματα` })} ανά λεπτό`,
      anschlaegeMin: "πατήματα/λεπτό",
      tempoZiel: (anschlaege: number) => ["Στόχος ταχύτητας για 3 αστέρια: ", anschlaege, " πατήματα/λεπτό"],
      // Kein „Λάθος!" (Glossar §2.2) - die Meldung sagt, welche Taste gemeint war.
      geschafft: "Τα κατάφερες.",
      falsch: (richtig: string) => `Όχι ακόμα. Το σωστό είναι: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Σχεδόν! Για ${zeichen} χρειάζεται το ${links ? "αριστερό" : "δεξί"} Shift, όχι το άλλο και όχι το Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      leertasteDaumen: "Szóköz a hüvelykujjal",
      eingabetasteFinger: "Enter billentyű a jobb kisujjal",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "hu")}, ${f ? fingerName(f, "hu") : ""}` +
        (seite ? ` + ${seite === "links" ? "bal" : "jobb"} Shift` : umschalt ? " + Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), utána ${h.dann}`,
      fertig: "Kész!",
      zeileVon: (n: number, gesamt: number) => ["Sor: ", n, "/", gesamt],
      fingerTitel: "Melyik ujj következik.",
      zeilenTitel: "Ennek a körnek a sorai.",
      melodieLaedt: "Hang betöltése...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Kurzor mozgatása: húzd balra vagy vissza középre. Dupla kattintás: alapbeállítás.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "A begépelt szöveg azonnal eltűnik. Húzd balra: tovább marad. Dupla kattintás: alapbeállítás."
          : z === 0
          ? "Az elhalványítás ki van kapcsolva - minden begépelt szöveg látszik. Húzd a kurzor felé, hogy eltűnjön."
          : `A begépelt szöveg ${z} karakter után eltűnik. A kurzor felé: hamarabb. Teljesen balra: megmarad. Dupla kattintás: alapbeállítás.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Húzd lefelé: több sor, mint egy oldalon. A kurzor halad, aztán új oldal kezdődik."
          : `Oldalanként ${n} sor. Lefelé: több sor. Teljesen fel: újra egy sor. Dupla kattintás: egy sor.`,
      umschaltZweimal: "Nyomd meg kétszer a Shift billentyűt - akkor a program bemondja az ujjat.",
      tastaturTitel: "A képernyő-billentyűzet megjelenítése vagy elrejtése.",
      tastatur: (offen: boolean) => [" ", offen ? "Billentyűzet elrejtése" : "Billentyűzet megjelenítése"],
      aufstieg: (sober: boolean) =>
        sober ? "Szintlépés: következő gyakorlási szint." : "Szintlépés! Egyre ügyesebb vagy.",
      sterne: (n: number) => `Csillag: ${n}/3`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "hu", { one: () => "Új jelvény!", other: () => "Új jelvények!" }),
      treffsicherheitName: (prozent: string) => `Pontosság: ${prozent}`,
      treffsicherheit: "Pontosság",
      tempoName: (anschlaege: number) => `Sebesség: ${anschlaege} leütés percenként`,
      anschlaegeMin: "leütés/perc",
      tempoZiel: (anschlaege: number) => ["Sebességcél 3 csillaghoz: ", anschlaege, " leütés/perc"],
      // Nie „Rossz!" (Glossar hu §2.2). Kein Schlusspunkt nach ${richtig} - eine Ziffer würde als Ordnungszahl gelesen (§4 Falle 4).
      geschafft: "Kész.",
      falsch: (richtig: string) => `Még nem. A helyes billentyű: ${richtig}`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Majdnem! Ennél a jelnél (${zeichen}) a ${links ? "bal" : "jobb"} Shift billentyű kell - nem a másik, és nem a Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      leertasteDaumen: "Spatiebalk met je duim",
      eingabetasteFinger: "Enter met je rechterpink",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "nl")}, ${f ? fingerName(f, "nl") : ""}` +
        (seite ? ` + Shift ${seite === "links" ? "links" : "rechts"}` : umschalt ? " + Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), dan ${h.dann}`,
      fertig: "Klaar!",
      zeileVon: (n: number, gesamt: number) => ["Regel ", n, " van ", gesamt],
      fingerTitel: "Welke vinger nu aan de beurt is.",
      zeilenTitel: "De regels van deze ronde.",
      melodieLaedt: "Geluid laden...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Cursor verplaatsen: sleep naar links of terug naar het midden. Dubbelklik: terug naar standaard.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "Wat je typt verdwijnt meteen. Sleep naar links: het blijft langer staan. Dubbelklik: standaard."
          : z === 0
          ? "Vervagen staat uit - alles wat je typt blijft staan. Sleep naar de cursor om het te laten verdwijnen."
          : `Getypte tekst verdwijnt na ${z} tekens. Naar de cursor: eerder weg. Helemaal links: blijft staan. Dubbelklik: standaard.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Sleep omlaag: meerdere regels zoals op een pagina. De cursor loopt mee, daarna begint een nieuwe pagina."
          : `${n} regels per pagina. Omlaag: meer regels. Helemaal omhoog: weer één regel. Dubbelklik: één regel.`,
      umschaltZweimal: "Druk twee keer op Shift om te horen welke vinger je gebruikt.",
      tastaturTitel: "Het schermtoetsenbord tonen of verbergen.",
      tastatur: (offen: boolean) => [" ", offen ? "Toetsenbord verbergen" : "Toetsenbord tonen"],
      aufstieg: (sober: boolean) =>
        sober ? "Omhoog: volgend niveau." : "Een niveau hoger - je wordt steeds beter!",
      sterne: (n: number) => `${n} van 3 sterren`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "nl", { one: () => "Nieuwe medaille!", other: () => "Nieuwe medailles!" }),
      treffsicherheitName: (prozent: string) => `Nauwkeurigheid ${prozent}`,
      treffsicherheit: "Nauwkeurigheid",
      tempoName: (anschlaege: number) => `Snelheid ${anschlaege} aanslagen per minuut`,
      anschlaegeMin: "Aanslagen/min",
      tempoZiel: (anschlaege: number) => ["Snelheidsdoel voor 3 sterren: ", anschlaege, " aanslagen/min"],
      // Kein „Fout!" (Glossar §2.2) - die Meldung sagt, welche Taste gemeint war.
      geschafft: "Gelukt.",
      falsch: (richtig: string) => `Nog niet. De goede is: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Bijna! Voor ${zeichen} heb je de ${links ? "linker" : "rechter"} Shift-toets nodig, niet de andere en niet Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      leertasteDaumen: "Barra de espaço com o polegar",
      eingabetasteFinger: "Enter com o mindinho direito",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "pt")}, ${f ? fingerName(f, "pt") : ""}` +
        (seite ? ` + tecla Shift ${seite === "links" ? "esquerda" : "direita"}` : umschalt ? " + tecla Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + tecla Shift" : ""}), depois ${h.dann}`,
      fertig: "Concluído!",
      zeileVon: (n: number, gesamt: number) => ["Linha ", n, " de ", gesamt],
      fingerTitel: "Que dedo vem a seguir.",
      zeilenTitel: "As linhas desta ronda.",
      melodieLaedt: "A carregar o som...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Mover o cursor: arrasta para a esquerda ou de volta ao meio. Duplo clique: voltar ao padrão.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "O texto escrito desaparece logo. Arrasta para a esquerda: fica mais tempo. Duplo clique: predefinição."
          : z === 0
          ? "O esbater está desligado - todo o texto escrito fica visível. Arrasta para o cursor para o fazer desaparecer."
          : `O texto escrito desaparece após ${z} caracteres. Para o cursor: mais cedo. Toda à esquerda: fica. Duplo clique: padrão.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Arrasta para baixo: várias linhas como numa página. O cursor avança e depois começa uma página nova."
          : `${n} linhas por página. Para baixo: mais linhas. Todo para cima: outra vez uma linha. Duplo clique: uma linha.`,
      umschaltZweimal: "Prime Shift duas vezes para ouvir que dedo usar.",
      tastaturTitel: "Mostrar ou ocultar o teclado no ecrã.",
      tastatur: (offen: boolean) => [" ", offen ? "Ocultar teclado" : "Mostrar teclado"],
      aufstieg: (sober: boolean) =>
        sober ? "Subida: nível seguinte." : "Subiste de nível! Estás cada vez melhor!",
      sterne: (n: number) => `${n} de 3 estrelas`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "pt", { one: () => "Nova medalha!", other: () => "Novas medalhas!" }),
      treffsicherheitName: (prozent: string) => `Precisão ${prozent}`,
      treffsicherheit: "Precisão",
      tempoName: (anschlaege: number) => `Velocidade ${anschlaege} toques por minuto`,
      anschlaegeMin: "Toques/min",
      tempoZiel: (anschlaege: number) => ["Meta de velocidade para 3 estrelas: ", anschlaege, " toques/min"],
      geschafft: "Concluído.",
      falsch: (richtig: string) => `Ainda não. A tecla certa é: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Quase! ${zeichen} precisa da tecla Shift ${links ? "esquerda" : "direita"}, não da outra nem da tecla Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      leertasteDaumen: "Barra de espaço com o polegar",
      eingabetasteFinger: "Enter com o dedo mínimo direito",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "br")}, ${f ? fingerName(f, "br") : ""}` +
        (seite ? ` + Shift da ${seite === "links" ? "esquerda" : "direita"}` : umschalt ? " + Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), depois ${h.dann}`,
      fertig: "Pronto!",
      zeileVon: (n: number, gesamt: number) => ["Linha ", n, " de ", gesamt],
      fingerTitel: "Qual dedo vem a seguir.",
      zeilenTitel: "As linhas desta rodada.",
      melodieLaedt: "Carregando o som …",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Mover o cursor: arraste para a esquerda ou de volta ao meio. Clique duplo: voltar ao padrão.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "O texto digitado some na hora. Arraste para a esquerda: fica mais tempo. Clique duplo: padrão."
          : z === 0
          ? "O esmaecimento está desligado - todo o texto digitado fica visível. Arraste em direção ao cursor para ele sumir."
          : `O texto digitado some depois de ${z} caracteres. Em direção ao cursor: mais cedo. Toda à esquerda: fica. Clique duplo: padrão.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Arraste para baixo: várias linhas como numa página. O cursor avança e depois começa uma página nova."
          : `${n} linhas por página. Para baixo: mais linhas. Todo para cima: de novo uma linha. Clique duplo: uma linha.`,
      umschaltZweimal: "Pressione Shift duas vezes para ouvir qual dedo usar.",
      tastaturTitel: "Mostrar ou ocultar o teclado na tela.",
      tastatur: (offen: boolean) => [" ", offen ? "Ocultar teclado" : "Mostrar teclado"],
      aufstieg: (sober: boolean) =>
        sober ? "Subiu de nível: próximo nível." : "Subiu de nível! Você está cada vez melhor!",
      sterne: (n: number) => `${n} de 3 estrelas`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "br", { one: () => "Nova medalha!", other: () => "Novas medalhas!" }),
      treffsicherheitName: (prozent: string) => `Precisão ${prozent}`,
      treffsicherheit: "Precisão",
      tempoName: (anschlaege: number) => `Velocidade ${anschlaege} toques por minuto`,
      anschlaegeMin: "Toques/min",
      tempoZiel: (anschlaege: number) => ["Velocidade para 3 estrelas: ", anschlaege, " toques/min"],
      // Kein „Errado" (Glossar §2.2) - die Meldung sagt, welche Taste gemeint war.
      geschafft: "Pronto.",
      falsch: (richtig: string) => `Ainda não. A tecla certa é: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Quase! ${zeichen} precisa do Shift da ${links ? "esquerda" : "direita"}, não do outro e não do Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      leertasteDaumen: "Bara de spațiu cu degetul mare",
      eingabetasteFinger: "Tasta Enter cu degetul mic drept",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "ro")}, ${f ? fingerName(f, "ro") : ""}` +
        (seite
          ? ` + tasta Shift ${seite === "links" ? "din stânga" : "din dreapta"}`
          : umschalt
            ? " + tasta Shift"
            : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + tasta Shift" : ""}), apoi ${h.dann}`,
      fertig: "Gata!",
      zeileVon: (n: number, gesamt: number) => ["Rândul ", n, " din ", gesamt],
      fingerTitel: "Ce deget urmează.",
      zeilenTitel: "Rândurile acestei runde.",
      melodieLaedt: "Se încarcă sunetul...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Mută cursorul: trage spre stânga sau înapoi la mijloc. Dublu clic: înapoi la setarea implicită.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "Textul scris dispare imediat. Trage spre stânga: rămâne mai mult. Dublu clic: implicit."
          : z === 0
          ? "Estomparea este oprită - tot textul scris rămâne vizibil. Trage spre cursor ca să dispară."
          : `Textul scris dispare după ${z} caractere. Spre cursor: mai devreme. Complet la stânga: rămâne. Dublu clic: implicit.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Trage în jos: mai multe rânduri ca pe o pagină. Cursorul înaintează, apoi începe o pagină nouă."
          : `${n} rânduri pe pagină. În jos: mai multe rânduri. Complet sus: din nou un rând. Dublu clic: un rând.`,
      umschaltZweimal: "Apasă de două ori tasta Shift - atunci se anunță degetul.",
      tastaturTitel: "Afișați sau ascundeți tastatura de pe ecran.",
      tastatur: (offen: boolean) => [" ", offen ? "Ascundeți tastatura" : "Afișați tastatura"],
      aufstieg: (sober: boolean) =>
        sober ? "Nivel nou: următorul nivel de exersare." : "Nivel nou - scrii tot mai bine!",
      sterne: (n: number) => `${n} din 3 stele`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "ro", { one: () => "Medalie nouă!", few: () => "Medalii noi!", other: () => "Medalii noi!" }),
      treffsicherheitName: (prozent: string) => `Precizie ${prozent}`,
      treffsicherheit: "Precizie",
      tempoName: (anschlaege: number) =>
        `Viteză: ${mehrzahl(anschlaege, "ro", {
          one: (z) => `${z} caracter pe minut`,
          few: (z) => `${z} caractere pe minut`,
          other: (z) => `${z} de caractere pe minut`,
        })}`,
      anschlaegeMin: "car./min",
      tempoZiel: (anschlaege: number) => ["Ținta de viteză pentru 3 stele: ", anschlaege, " car./min"],
      // Nu „Greșit” (Glosar §2.2) - mesajul spune ce tastă era cea corectă.
      geschafft: "Gata.",
      falsch: (richtig: string) => `Încă nu. Corect este: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Aproape! Pentru ${zeichen} e nevoie de tasta Shift ${links ? "din stânga" : "din dreapta"}, nu de cealaltă și nu de tasta Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      leertasteDaumen: "Mellanslag med tummen",
      eingabetasteFinger: "Retur med höger lillfinger",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "sv")}, ${f ? fingerName(f, "sv") : ""}` +
        (seite ? ` + ${seite === "links" ? "vänster" : "höger"} Skift` : umschalt ? " + Skift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Skift" : ""}), sedan ${h.dann}`,
      fertig: "Klart!",
      zeileVon: (n: number, gesamt: number) => ["Rad ", n, " av ", gesamt],
      fingerTitel: "Vilket finger som är på tur.",
      zeilenTitel: "Raderna i den här omgången.",
      melodieLaedt: "Ljudet läses in...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Flytta markören: dra åt vänster eller tillbaka till mitten. Dubbelklick: tillbaka till standard.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "Det du skriver försvinner direkt. Dra åt vänster: det syns längre. Dubbelklick: standard."
          : z === 0
          ? "Uttoning är av - allt du skriver syns kvar. Dra mot markören för att få det att försvinna."
          : `Skriven text försvinner efter ${z} tecken. Mot markören: tidigare. Längst till vänster: syns kvar. Dubbelklick: standard.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Dra nedåt: flera rader som på en sida. Markören följer med, sedan börjar en ny sida."
          : `${n} rader per sida. Nedåt: fler rader. Längst upp: en rad igen. Dubbelklick: en rad.`,
      umschaltZweimal: "Tryck två gånger på Skift så hör du vilket finger du ska använda.",
      tastaturTitel: "Visa eller dölj skärmtangentbordet.",
      tastatur: (offen: boolean) => [" ", offen ? "Dölj tangentbordet" : "Visa tangentbordet"],
      aufstieg: (sober: boolean) =>
        sober ? "Upp en nivå: nästa nivå." : "Upp en nivå! Du blir bättre och bättre.",
      sterne: (n: number) => `${n} av 3 stjärnor`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "sv", { one: () => "Nytt märke!", other: () => "Nya märken!" }),
      treffsicherheitName: (prozent: string) => `Träffsäkerhet ${prozent}`,
      treffsicherheit: "Träffsäkerhet",
      tempoName: (anschlaege: number) => `Hastighet ${anschlaege} anslag per minut`,
      anschlaegeMin: "Anslag/min",
      tempoZiel: (anschlaege: number) => ["Hastighetsmål för 3 stjärnor: ", anschlaege, " anslag/min"],
      geschafft: "Klart.",
      falsch: (richtig: string) => `Inte riktigt. Rätt är: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Nästan! ${zeichen} behöver ${links ? "vänster" : "höger"} Skift, inte den andra och inte Caps Lock.`,
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      leertasteDaumen: "Пробіл - великим пальцем",
      eingabetasteFinger: "Enter - правим мізинцем",
      fingerHinweis: (
        zeichen: string,
        f: Parameters<typeof fingerName>[0] | null | undefined,
        seite: "links" | "rechts" | null,
        umschalt: boolean,
      ) =>
        `${spokenLabel(zeichen, "uk")}, ${f ? fingerName(f, "uk") : ""}` +
        (seite ? ` + ${seite === "links" ? "ліва" : "права"} клавіша Shift` : umschalt ? " + клавіша Shift" : ""),
      fingerHinweisTotaste: (h: TotastenHinweis) =>
        `${h.totName} (${h.totFinger}${h.totMod === "altgr" ? ` + ${h.altgrName}` : h.totMod === "shift" ? " + Shift" : ""}), потім ${h.dann}`,
      fertig: "Готово!",
      zeileVon: (n: number, gesamt: number) => ["Рядок ", n, "/", gesamt],
      fingerTitel: "Який палець наступний.",
      zeilenTitel: "Рядки цього раунду.",
      melodieLaedt: "Завантаження звуку...",
      // ★ 13.11.2026: Hinweise beim Überfahren der drei Anfasser am Übungsfeld.
      anfasserZeiger: "Перемістити курсор: тягни ліворуч або назад до середини. Подвійне клацання: за замовчуванням.",
      anfasserAusblenden: (z: number) =>
        z < 0
          ? "Написане зникає одразу. Тягни ліворуч: лишається довше. Подвійне клацання: типово."
          : z === 0
          ? "Згасання вимкнено - усе написане лишається видимим. Тягни до курсора, щоб воно зникало."
          : `Написане зникає через ${z} знаків. До курсора: раніше. Зовсім ліворуч: лишається. Подвійне клацання: за замовчуванням.`,
      anfasserSeite: (n: number) =>
        n <= 1
          ? "Тягни вниз: кілька рядків, як на сторінці. Курсор іде далі, потім починається нова сторінка."
          : `${n} рядків на сторінці. Вниз: більше рядків. Зовсім угору: знову один рядок. Подвійне клацання: один рядок.`,
      umschaltZweimal: "Натисни Shift двічі - і почуєш, яким пальцем друкувати.",
      tastaturTitel: "Показати або сховати екранну клавіатуру.",
      tastatur: (offen: boolean) => [" ", offen ? "Сховати клавіатуру" : "Показати клавіатуру"],
      aufstieg: (sober: boolean) =>
        sober ? "Новий рівень: наступний рівень вправ." : "Новий рівень! Ти друкуєш дедалі краще!",
      sterne: (n: number) => `Зірки: ${n}/3`,
      neueAbzeichen: (n: number) =>
        mehrzahl(n, "uk", {
          one: () => "Нова медаль!",
          few: () => "Нові медалі!",
          many: () => "Нові медалі!",
          other: () => "Нові медалі!",
        }),
      treffsicherheitName: (prozent: string) => `Точність ${prozent}`,
      treffsicherheit: "Точність",
      tempoName: (anschlaege: number) =>
        `Швидкість: ${mehrzahl(anschlaege, "uk", {
          one: (z) => `${z} знак`,
          few: (z) => `${z} знаки`,
          many: (z) => `${z} знаків`,
          other: (z) => `${z} знака`,
        })} за хвилину`,
      anschlaegeMin: "Знаків/хв",
      tempoZiel: (anschlaege: number) => ["Ціль швидкості для 3 зірок: ", anschlaege, " знаків/хв"],
      // Kein „Неправильно" (Glossar §2.2) - die Meldung sagt, welche Taste gemeint war.
      geschafft: "Готово.",
      falsch: (richtig: string) => `Ще ні. Правильно: ${richtig}.`,
      umschaltFalsch: (zeichen: string, links: boolean) =>
        `Майже! Для знака ${zeichen} потрібна ${links ? "ліва" : "права"} клавіша Shift, не інша і не Caps Lock.`,
    },
});

/** ★ W1 (F6): die Teile des Totasten-Hinweises für das nächste Zeichen (siehe {@link TotastenHinweis}). */
export function totastenHinweisFuer(
  k: Kombizeichen,
  sprache: BedienSprache,
  st: (typeof SITZUNG_TEXTE)[BedienSprache],
  seite: "links" | "rechts" | null,
  umschalt: boolean,
): TotastenHinweis {
  const lay = activeLayout();
  const fTot = fingerForChar(k.tot);
  return {
    totName: totasteName(k.tot, sprache) ?? zeichenNameSichtbar(k.tot, sprache),
    totFinger: fTot ? fingerName(fTot, sprache) : "",
    totMod: lay.access[k.tot]?.mod,
    altgrName: bottomLabelsFuer(lay)[2],
    dann: st.fingerHinweis(k.dann, fingerForChar(k.dann), seite, umschalt),
  };
}

export function TypingSession({
  items,
  sources,
  arten,
  onLineSeen,
  contextId,
  unlocked,
  shiftLearned,
  enforceShiftHand = true,
  zeilenEnde = false,
  zeichenabstand = 1,
  stufe,
  lang,
  voiceEnabled,
  speedTarget,
  onItemDone,
  onLetters,
  onLineDone,
  onSessionDone,
  onRetry,
  retryLabel,
  topSlot,
  standSlot,
  endSlot,
  hinweis,
  naechsteRundeHinweis,
  leveledUp,
  newBadges,
  lernweg = "de",
  suppressRewardSound,
  ueberlagert,
  hideAutoCapHint,
  initialQi,
  onQiChange,
  stoppSignal,
  onStopp,
  onZeilenWartezeit,
  zeilenuhrAbAnzeige = false,
  uhrLaeuftSchon = false,
  zeilenPauseMs = 550,
  zeilenPraefix = "",
  fortschrittSlot,
  untenSlot,
  satzAusreden = true,
  zeileGanz = false,
  zusatzWoerter,
  zeilenAnhaengen = false,
  wackeligeTasten,
}: TypingSessionProps) {
  // In welcher Sprache VORGELESEN wird: die Sprache dieser Runde. Fehlt sie
  // (Alt-Aufrufer, Tests), gilt die Vorlese-Sprache der Seite - und ohne die
  // Deutsch. Die SICHTBARE Oberfläche und die Braillezeile bleiben deutsch;
  // nur die Stimme folgt dem Inhalt (Entscheidung Johannes 29.08.2026).
  const vorleseLang: Lang = lang ?? vorleseSprache();
  /*
    ★★ DIE BEDIENUNGSSPRACHE (Probestück 12.09.2026). Sie gilt für die
    Beschriftungen dieser Karte; was vorgelesen wird, folgt weiter `vorleseLang`.
    In Tastenflow (`bereichAktiv`) tragen Übungsfeld und sichtbare Zeile
    `lang` = die Übungssprache - eine deutsche Zeile in englischer Bedienung
    wird sonst mit englischer Aussprache gelesen. Ohne aktiven Sprachbereich
    (ohne Provider) kommt kein Attribut dazu.
  */
  const { sprache: bedienSprache, bereichAktiv } = useBedienSprache();
  const st = SITZUNG_TEXTE[bedienSprache];
  // ★ Die Anrede der Person (19.09.2026): „Sie" nur für die Lehrkraft, alle
  // Lernenden „du" - auch ab 16. Die Regel steht in `anredeFuer` (skin.ts).
  const anrede = useAnrede();
  const bedien = bedienCopy(stufe, bedienSprache, anrede);
  const zeilenLang: Lang | undefined = bereichAktiv ? vorleseLang : undefined;
  /*
    ★★ EN1 (19.09.2026): WAS DIE BEDIENUNG SAGT. In Tastenflow kommen die
    Antworten auf Alt + Z, Alt + D und Alt + L, die Meldungen beim Tippen
    (Live-Bereich), der Satz auf zweimal Umschalt und die Ansage der
    Abschluss-Karte in der BEDIENUNGSSPRACHE und mit ihrer Stimme - sie
    gehören zur Oberfläche, die in dieser Sprache dasteht. Was zur ÜBUNG
    gehört (die Zeile, die nächste Taste, das Zeichen nach einem Fehlgriff),
    folgt weiter `vorleseLang`. Ohne aktiven Sprachbereich läuft jede Zeile
    wie vorher.
    Über einen Ref, weil die Tasten- und Ereignis-Wege unten ihre
    Abhängigkeiten bewusst schmal halten.
  */
  const bedienRef = useRef({ sprache: bedienSprache, bereichAktiv, st });
  bedienRef.current = { sprache: bedienSprache, bereichAktiv, st };
  /** Eine Ansage der Bedienung: in Tastenflow in ihrer Sprache und Stimme. */
  const sprichBedienung = (text: string) => {
    const b = bedienRef.current;
    if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
    else speakUi(text);
  };
  const sprichBedienungRef = useRef(sprichBedienung);
  sprichBedienungRef.current = sprichBedienung;

  /**
   * „Echtes Wort?" für das Vorlesen: das Lexikon, und dazu `zusatzWoerter`.
   * Über einen Ref, weil die Liste nachgeladen wird und die Vorlese-Effekte
   * ihre Abhängigkeiten bewusst schmal halten.
   */
  const zusatzWoerterRef = useRef(zusatzWoerter);
  zusatzWoerterRef.current = zusatzWoerter;
  const istWort = (t: string): boolean =>
    // ★ 26.09.2026 (Befund E13a §11): `normalizeWord` MIT Sprache - ohne sie
    // fielen die Akzente weg, und „léa"/„équitation" standen nie in der
    // französischen Zusatzliste. Für „de"/„en" ist das Ergebnis byte-gleich
    // (dieselbe Zeichenklasse wie ohne Sprachangabe, `lexicon.ts`).
    // ★ E9a (26.09.2026): `inZusatzliste` statt `.has(normalizeWord(...))`
    // direkt - fällt auf die alte, bindestrichlose Form zurück, falls eine
    // Zusatzliste noch so gepflegt ist (siehe deren Kopf-Doku).
    isRealWord(t, vorleseLang) || inZusatzliste(zusatzWoerterRef.current, t, vorleseLang);

  /**
   * Liest die Stimme gerade den GANZEN Satz vom Zeilenanfang - und darf ihn
   * `satzAusreden` noch schützen? Ist die Sprachausgabe fertig, fällt der
   * Riegel von selbst, und die Ansagen zum Anschlag laufen wie gewohnt.
   */
  const satzLaeuftRef = useRef(false);
  const satzSprichtNoch = useCallback((): boolean => {
    if (!satzAusreden || !satzLaeuftRef.current) return false;
    if (sprachausgabeBeschaeftigt()) return true;
    satzLaeuftRef.current = false;
    return false;
  }, [satzAusreden]);
  const contrastMode = useContrast((s) => s.mode);
  // Finger-Farben sind nur in den normalen Hell/Dunkel-Designs sinnvoll — die
  // Kontrast-Modi (S/W, Gelb/Blau …) leben von garantierten Kontrastpaaren, die
  // beliebige Buntfarben aufweichen würden.
  const colorsAllowed = contrastMode === "hell" || contrastMode === "dunkel";
  // Zusätzlich abschaltbar - seit 25.08.2026 in den Einstellungen, Gruppe
  // „Anzeige" (vorher als Häkchen unter der Tastatur). Standard: an.
  const fingerColorPref = useTypingA11y((z) => z.fingerFarben);
  const showFingerColors = colorsAllowed && fingerColorPref;
  // ★ 12.11.2026: Ausblenden des Geschriebenen und die Stelle des Schreibzeigers.
  const ausblendZeichen = useTypingA11y((z) => z.ausblendZeichen);
  const setAusblendZeichen = useTypingA11y((z) => z.setAusblendZeichen);
  // ★ 13.11.2026: eine Zeile (1) oder eine Seite mit so vielen Zeilen.
  // ★ Gewünscht ist, was das Kind gezogen hat; gezeigt wird höchstens, was bis
  // zum unteren Fensterrand passt. Wird das Fenster wieder größer, kommen die
  // gewünschten Zeilen zurück.
  const seitenZeilenWunsch = useTypingA11y((z) => z.seitenZeilen);
  const setSeitenZeilen = useTypingA11y((z) => z.setSeitenZeilen);
  const zeilenKastenRef = useRef<HTMLDivElement>(null);
  const [seitenZeilenPlatz, setSeitenZeilenPlatz] = useState(Number.POSITIVE_INFINITY);
  const seitenZeilen = Math.max(1, Math.min(seitenZeilenWunsch, seitenZeilenPlatz));
  const [zeichenBreite, setZeichenBreite] = useState(0);
  const meldeZeichenBreite = useCallback((px: number) => {
    setZeichenBreite((alt) => (Math.abs(alt - px) < 0.5 ? alt : px));
  }, []);
  const cursorStelle = useTypingA11y((z) => z.cursorStelle);
  const setCursorStelle = useTypingA11y((z) => z.setCursorStelle);
  // Bildschirm-Tastatur: Der Schalter sitzt jetzt in der Hinweis-Zeile unter
  // dem Feld, die Tastatur selbst liest denselben Zustand (a11y.ts).
  const tastenAnsage = useTypingA11y((z) => z.tastenAnsage);
  const tastenAnsageRef = useRef(tastenAnsage);
  tastenAnsageRef.current = tastenAnsage;
  const tastaturOffen = useTypingA11y((z) => z.tastaturOffen);
  const setTastaturOffen = useTypingA11y((z) => z.setTastaturOffen);
  // Vergrößerung gilt NUR fürs Tippfeld (nicht für die ganze Seite). Die
  // Knöpfe dazu stehen seit 25.08.2026 in den Einstellungen; hier wird der
  // Faktor nur noch gelesen.
  const zoom = useTypingA11y((s) => s.zoom);
  const schreibschrift = useSchriftart((s) => schriftZu(s.schrift).schreibschrift === true);
  const copy = copyFor(stufe);
  // Tonlage der Ansagen: nur das Kinder-Profil (7-10) bekommt den lauten Jubel
  // („Super!"), alle übrigen die ruhige Fassung. Die Abzeichen-NAMEN hängen
  // NICHT hier dran, sondern an `usesMascots` — eigene Achse, eigener Helfer.
  const skin = skinForStufe(stufe);
  /*
   * ★★★ DIE ZWEI ERKLÄR-FENSTER (31.08.2026, Auftrag Johannes).
   *
   * Beide hängen an Stellen, die es im Code SCHON GAB - nur ohne sichtbaren
   * Kanal. Die Umschalt-Erklärung stand als `announce()` da und war damit für
   * ein sehendes Kind ohne Screenreader unsichtbar, sobald das Vorlesen aus
   * war. Genau das ist Lehre §7.5 des Audits: „Erfolg spricht, Fehler
   * schweigt."
   *
   * `merkfenster` trägt den Text des gerade offenen Fensters (oder nichts).
   * EIN Zustand für beide - es kann nie mehr als eines offen sein, und wer
   * zwei Zustände hält, muss sie gegeneinander absichern.
   */
  const [merkfenster, setMerkfenster] = useState<
    (Fenstertext & { mitHaken: boolean; art: "umschalt" | "gross" }) | null
  >(null);
  const sober = skin !== "kind";

  // Vorlese-Granularität (Mehrfachauswahl): Buchstaben / Wörter / Sätze.
  const readWords = useVoice((s) => s.readWords);
  const readSentences = useVoice((s) => s.readSentences);

  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"run" | "summary">("run");
  /** EN1: Endete die Runde über `stoppSignal` (Tippchallenge, Klassenmatch)? */
  const vonAussenGestoppt = useRef(false);
  /**
   * ★ 29.10.2026 (Wunsch einer Lehrerin: „die Rückmeldung ist immer die
   * gleiche, auch bei drei Sternen"): welcher der Sätze je Sternzahl auf der
   * Abschluss-Karte steht (`rundenAbwechslung.ts`). Gezogen wird beim
   * Rundenende, die Karte liest nur. Die Bemerkung zählt wie die Karte:
   * bei „100 %" als drei Sterne.
   */
  const kartenVariante = useRef({ titel: 0, bemerkung: 0 });
  const zieheKartenVarianten = (acc: number, sterne: number) => {
    kartenVariante.current = {
      titel: naechsteVariante("karte", sterne),
      bemerkung: naechsteVariante("bemerkung", Math.round(acc * 100) >= 100 ? 3 : sterne),
    };
  };
  const [flash, setFlash] = useState(false);
  // Kurze „Zeile X von Y"-Einblendung auf Tastenkürzel (Alt+Z).
  const [progressFlash, setProgressFlash] = useState(false);
  // Kurze Übezeit-Einblendung auf Tastenkürzel (Alt+D).
  const [timeFlash, setTimeFlash] = useState<string | null>(null);
  // Kurze Spielstufen-Einblendung auf Tastenkürzel (Alt+L).
  const [levelFlash, setLevelFlash] = useState<string | null>(null);
  /**
   * ★ E4 (25.09.2026, Bauplan §3.2, §14 E4 Punkt 5): sichtbarer Hinweis „die
   * Feststelltaste ist an" - NUR auf französischen Tastaturen (siehe
   * `onWrong`). Sichtbar in der Hilfszeile unter dem Feld (wie
   * `umschaltZweimal`/`AutoCapHint"), `aria-hidden` wie die anderen kurzen
   * Einblendungen hier - die Sprachausgabe bekommt denselben Satz über
   * `announceBeimTippen` (nur bei „Buchstabieren an", Regel 09.09.: die
   * Braillezeile springt nie).
   */
  /*
   * ★ W2a (28.09.2026): EINE Hilfszeile für alle kurzen Hinweise beim Tippen -
   * Feststelltaste (E4), Umschalt vor der Tilde (D-7, Weg „es") und die
   * Umschalttaste derselben Hand (§3.8 Punkt 2). Ein neuer Hinweis ersetzt den
   * alten und bekommt seine eigene Zeit (`zeigeKurzHinweis`).
   */
  const [kurzHinweis, setKurzHinweis] = useState<{ zeichen: string; text: string } | null>(null);
  const kurzHinweisUhr = useRef<number | null>(null);
  const zeigeKurzHinweis = (zeichen: string, text: string, ms: number) => {
    if (kurzHinweisUhr.current !== null) window.clearTimeout(kurzHinweisUhr.current);
    setKurzHinweis({ zeichen, text });
    kurzHinweisUhr.current = window.setTimeout(() => {
      kurzHinweisUhr.current = null;
      setKurzHinweis(null);
    }, ms);
  };
  useEffect(
    () => () => {
      if (kurzHinweisUhr.current !== null) window.clearTimeout(kurzHinweisUhr.current);
    },
    [],
  );
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  /** Die Karte um das Übungsfeld — sie wird bei Fokus ins Bild gerückt. */
  const karteRef = useRef<HTMLDivElement>(null);
  /** Die ABSCHLUSS-Karte (Rundenende) und ihre Überschrift — siehe F1 unten. */
  const summaryRef = useRef<HTMLDivElement>(null);
  const summaryTitelRef = useRef<HTMLHeadingElement>(null);
  const liveTimer = useRef<number | null>(null);
  /** Wechselt bei jeder Ansage - siehe `pushLive`. */
  const livePendel = useRef(false);

  // Beim Sprachwechsel mitten in einer Runde wird initialQi gesetzt, damit die
  // nächste items-Änderung nicht bei 0 beginnt, sondern beim letzten Stand.
  const pendingInitialQiRef = useRef(0);

  // Session-Summen + Zeitmessung je Zeile
  const sum = useRef({ chars: 0, errors: 0, ms: 0 });
  /**
   * Fehlerfreie Kette der laufenden Runde — Grundlage der Abzeichen-Familie
   * „Am Stück" (badges.ts). Gezählt wird über ZEILEN hinweg; der Trainer setzt
   * sie am Rundenende über die Runden hinweg fort:
   *   • `cur`  — Anschläge seit dem letzten Fehler (am Ende = Auslauf der Runde),
   *   • `best` — längste fehlerfreie Kette INNERHALB dieser Runde,
   *   • `lead` — Anschläge VOR dem ersten Fehler (setzt die alte Kette fort),
   *   • `sawError` — gab es überhaupt einen Fehler?
   */
  const chain = useRef({ cur: 0, best: 0, lead: 0, sawError: false });
  const itemStart = useRef<number | null>(null);
  const blurred = useRef(false);
  /*
   * ★ MESSUNGEN JE ZEILE (Schritt M, 19.09.2026, `zeilenMessung.ts`) - für den
   * künftigen Eigenständigkeits-Check. NUR gemessen: Nichts hiervon ändert,
   * was angenommen, angezeigt oder angesagt wird, und nichts davon berührt die
   * Zeilenzeit (F1c). Der Messer sieht jeden ANKOMMENDEN Anschlag
   * (`tasteAnnehmen`, auch die in der Zeilenpause gemerkten - dort mit ihrer
   * echten Ankunftszeit), das Loslassen, und ob das Fenster vorne ist.
   */
  const [messer] = useState(() => new ZeilenMesser());
  const wackeligeTastenRef = useRef(wackeligeTasten);
  wackeligeTastenRef.current = wackeligeTasten;
  /** Die wackligen Tasten, wie sie beim ersten Anschlag DIESER Zeile waren. */
  const wackeligBeiStart = useRef<ReadonlySet<string> | null>(null);
  // Vorgelesene Zeit (ms) beim letzten Anschlag — um pro Abstand die Sprechzeit zu
  // bestimmen. Und die aufsummierte echte WARTEZEIT der Zeile: nur die Zeit, in der
  // die Person auf die Ansage gewartet hat (nicht das parallele Tippen Sehender),
  // wird aus dem Zeilen-Tempo herausgerechnet. Fairness, siehe typingGapMs/voice.ts.
  const lastSpokenSnapshot = useRef(0);
  const waitMs = useRef(0);
  // ★ Bauplan F1/F1b (Messung 18.09., §11/§12, siehe zeilenzeit.ts): Die
  // Zeilenzeit ist die SUMME der einzelnen (gekappten, geflooerten)
  // Anschlags-Lücken - nicht mehr „Wanduhr minus Wartezeit" ohne Grenzen.
  // `waitMs` bleibt die tatsächlich abgezogene Wartezeit (seit F1c ungekappt,
  // siehe `zeilenLuecke`), für die Prüfungsuhr (`onZeilenWartezeit`).
  const lineMs = useRef(0);
  /*
   * ★★★★★ KLASSENMATCH UND TIPPCHALLENGE: DIE ZEILEN-UHR BEGINNT, WENN DIE
   * ZEILE DASTEHT (Bauplan F1c, 18.09.2026, `eineMessart.ts`,
   * {@link TypingSessionProps.zeilenuhrAbAnzeige}).
   *
   * Vorher begann sie überall mit dem ERSTEN ANSCHLAG der Zeile. Auf der
   * festen Uhr von Klassenmatch und Tippchallenge lief die Zeit davor aber
   * voll mit - und das Zuhören der Zeilenansage wurde dort NICHT abgezogen,
   * weil es nie gemessen war: ein Nachteil genau für die Kinder mit
   * Sprachausgabe. In diesen beiden Modi misst die erste Lücke jetzt ab dem
   * Erscheinen der Zeile; ihr Zuhören wird abgezogen, ihr Überlegen zählt.
   *
   * ⚠️ BEIM ÜBEN BLEIBT ES BEIM ERSTEN ANSCHLAG (Entscheidung Johannes offen,
   * NACHTLAUF-2026-09-19 §3) - Begründung bei `zeilenuhrAbAnzeige`.
   *
   * `uhrLaeuft`: Läuft überhaupt schon eine Uhr? Die erste Zeile einer Runde
   * beginnt mit ihrem ersten Anschlag - davor läuft keine (siehe
   * {@link TypingSessionProps.uhrLaeuftSchon}).
   */
  const zeilenuhrRef = useRef(zeilenuhrAbAnzeige);
  zeilenuhrRef.current = zeilenuhrAbAnzeige;
  const uhrLaeuft = useRef(false);
  const uhrLaeuftSchonRef = useRef(uhrLaeuftSchon);
  uhrLaeuftSchonRef.current = uhrLaeuftSchon;
  /** Wann die vorige Zeile fertig war - Beginn der Zeilenwechsel-Pause. */
  const zeileFertigAt = useRef<number | null>(null);
  /** Dasselbe, festgehalten für DIESE Zeile (Anschläge aus der Pause, s. u.). */
  const wechselPauseVon = useRef<number | null>(null);
  /** Die Zeilenwechsel-Pause vor dieser Zeile (ms) - Zeit der App, F1c. */
  const wechselPauseMs = useRef(0);

  // Buchstaben-Telemetrie: letzte Anschlagszeit + gesammelte Anschläge der Zeile
  const lastTs = useRef<number | null>(null);
  const lineEvents = useRef<KeyEvent[]>([]);

  // Doppel-Druck auf die Umschalttaste → Finger ansagen (für blinde Lernende).
  const lastShiftTs = useRef<number | null>(null);

  // Welche Umschalttaste(n) gerade GEHALTEN werden — links/rechts getrennt (der
  // Browser unterscheidet sie über `event.code`). Grundlage der Gegenhand-Regel:
  // Für einen Großbuchstaben muss die Umschalttaste der GEGENHAND gehalten sein;
  // die falsche Umschalttaste oder die Feststelltaste zählen als Fehler.
  const heldShift = useRef<Set<Hand>>(new Set());

  // ── Zwischen zwei Zeilen (`tasteAnnehmen`, `zeilenAnhaengen`) ───────────
  /** Gesetzt von „Zeile fertig" bis „nächste Zeile steht". */
  const zeilenwechselRef = useRef(false);
  /** Die Anschläge aus dieser Zeit: Zeichen, damals gehaltene Umschalttasten, Zeitpunkt. */
  const pufferRef = useRef<{ key: string; umschalt: Set<Hand>; ts: number }[]>([]);
  /** Letzte Zeile fertig, Nachschub noch nicht da - nur mit `zeilenAnhaengen`. */
  const wartetAufNachschubRef = useRef(false);
  /** Die Zeilen zum Zeitpunkt, an dem die Pause ABLÄUFT (Nachschub kann in ihr kommen). */
  const itemsRef = useRef(items);
  itemsRef.current = items;
  /** Die vorige Zeilenliste - daran wird Nachschub von einer neuen Runde unterschieden. */
  const vorigeItemsRef = useRef<string[] | null>(null);
  // Seite einer Umschalt-Taste aus dem Tastatur-Event bestimmen (mit Fallback
  // über `event.location`, falls `code` fehlt).
  const shiftSideOfEvent = (
    e: React.KeyboardEvent | KeyboardEvent,
  ): Hand | null =>
    e.code === "ShiftLeft" || e.location === 1
      ? "links"
      : e.code === "ShiftRight" || e.location === 2
        ? "rechts"
        : null;

  // Inhaltswechsel-Ansage: war die zuletzt VORGELESENE Zeile Unsinn? (null = noch
  // keine in dieser Runde — dann wird der erste Wechsel nicht angekündigt).
  /** Welche Inhalts-Klasse die vorige Zeile hatte - nur ein WECHSEL wird angesagt. */
  const prevNonsenseRef = useRef<string | null>(null);

  const expected = items[qi] ?? "";
  /**
   * ★★★ W2a (28.09.2026, D-6): die Zeile, wie sie nach einer anderen richtigen
   * Schreibweise des Kindes dasteht (Weg „fr": „Tu viens?" statt „Tu viens ?")
   * - gesetzt vom Hook (`onZeileAngepasst`), SYNCHRON im Anschlag, damit die
   * Ansage der nächsten Taste und die Zeichen-Zählung am Zeilenende schon mit
   * ihr rechnen. Gebunden an Text und Nummer der Zeile: Eine neue Zeile ist nie
   * „angepasst". Gezeigt wird die Fassung des Hooks (`zeileJetzt` unten).
   */
  const angepasstRef = useRef<{ quelle: string; qi: number; text: string } | null>(null);
  const aktuelleZeile = (): string => {
    const a = angepasstRef.current;
    return a && a.quelle === expected && a.qi === qi ? a.text : expected;
  };

  /**
   * ★ Zeilenende mit Enter (23.09.2026): der Schalter, PRO ZEILE festgehalten -
   * hier für alles ausserhalb des Hooks (`useTypingItem`), das das Ziel dieser
   * Zeile kennen muss: die Ansage der nächsten Taste, die ↵-Anzeige, die
   * Tastatur-Hervorhebung und die Zeichen-Zählung beim Abschluss. Derselbe
   * Rücksetz-Zeitpunkt wie im Hook (`[expected, qi]`, der Hook bekommt
   * `zeile: qi` weiter unten) - beide lesen denselben Wert aus demselben
   * Render, springen also nie auseinander.
   */
  const zeilenEndeAktivRef = useRef(zeilenEnde);
  useEffect(() => {
    zeilenEndeAktivRef.current = zeilenEnde;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expected, qi]);

  // Wenn initialQi sich ändert (Sprachwechsel), den Wert für den nächsten
  // items-Reset merken. Dieser Effect läuft VOR dem items-Reset-Effect (gleiche
  // Render-Runde, früher in der Liste → React garantiert FIFO).
  useEffect(() => {
    pendingInitialQiRef.current = initialQi ?? 0;
  }, [initialQi]);

  // Neue Runde oder Sprachwechsel (frische Zeilen): alles zurücksetzen.
  useEffect(() => {
    const vorige = vorigeItemsRef.current;
    vorigeItemsRef.current = items;
    // ★ `zeilenAnhaengen`: Beginnt die neue Liste mit den bisherigen Zeilen,
    //   ist sie Nachschub - nichts zurücksetzen. Wartet die Session schon am
    //   Ende, geht es jetzt mit der nächsten Zeile weiter.
    if (
      zeilenAnhaengen &&
      vorige &&
      items.length > vorige.length &&
      vorige.every((z, i) => items[i] === z)
    ) {
      if (wartetAufNachschubRef.current) {
        wartetAufNachschubRef.current = false;
        setQi((n) => n + 1);
      }
      return;
    }
    pufferRef.current = [];
    zeilenwechselRef.current = false;
    wartetAufNachschubRef.current = false;
    const startAt = pendingInitialQiRef.current;
    pendingInitialQiRef.current = 0; // einmalig verbrauchen
    setQi(startAt);
    setPhase("run");
    vonAussenGestoppt.current = false;
    sum.current = { chars: 0, errors: 0, ms: 0 };
    chain.current = { cur: 0, best: 0, lead: 0, sawError: false };
    prevNonsenseRef.current = null; // neue Runde: erster Inhalt wird nicht angekündigt
    // ★ F1c: Neue Runde - die Uhr läuft erst mit dem ersten Anschlag, ausser
    //   der Aufrufer sagt, dass seine schon läuft (Klassenmatch, Neuladen).
    uhrLaeuft.current = uhrLaeuftSchonRef.current;
    zeileFertigAt.current = null;
    messer.verwerfen(); // Schritt M: neue Runde, neue erste Zeile
  }, [items, messer]);

  // Elternteil über den aktuellen Zeilenstand informieren (für Sprachwechsel).
  useEffect(() => {
    onQiChange?.(qi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  // Telemetrie je Zeile zurücksetzen - und die Zeilen-Uhr stellen (F1c, s. o.).
  useEffect(() => {
    lineEvents.current = [];
    waitMs.current = 0;
    lineMs.current = 0;
    wechselPauseMs.current = 0;
    lastSpokenSnapshot.current = spokenMs();
    const jetzt = Date.now();
    if (phase === "run" && zeilenuhrRef.current && uhrLaeuft.current) {
      // Die Zeile steht da: Ab jetzt ist es ihre Zeit. Die Lücke bis zum
      // ersten Anschlag wird wie jede andere verteilt (`zeilenLuecke`).
      lastTs.current = jetzt;
      wechselPauseVon.current = zeileFertigAt.current;
      if (zeileFertigAt.current !== null)
        wechselPauseMs.current = Math.max(0, jetzt - zeileFertigAt.current);
    } else {
      // Üben (und vor dem ersten Anschlag einer Runde): wie vor F1c - die
      // Zeile beginnt mit ihrem ersten Anschlag.
      lastTs.current = null;
      wechselPauseVon.current = null;
    }
    zeileFertigAt.current = null;
    // Schritt M: Die Zeile steht da - ab jetzt zählt „Fenster weg" für sie.
    messer.zeileSteht(jetzt);
  }, [phase, qi, messer]);

  // Fensterwechsel je Zeile merken (für Eigenständigkeits-Check).
  useEffect(() => {
    const onBlur = () => {
      blurred.current = true;
      // Beim Fenster-/Fokuswechsel kann das keyup der Umschalttaste ausbleiben —
      // sonst gälte sie fälschlich weiter als gehalten.
      heldShift.current.clear();
      messer.weg(Date.now()); // Schritt M: wie LANGE, nicht nur ob
    };
    /*
     * ★ Schritt M: Die DAUER „nicht im Vordergrund". `blur` allein sieht einen
     * Wechsel des Tabs nicht immer (die Seite wird dann verborgen), darum auch
     * `visibilitychange`. Zurück ist es erst, wenn die Seite sichtbar UND das
     * Fenster vorne ist - ein sichtbares Fenster hinter einem anderen ist weg.
     */
    const onFocus = () => {
      if (document.visibilityState !== "hidden") messer.zurueck(Date.now());
    };
    const onSichtbar = () => {
      if (document.visibilityState === "hidden") messer.weg(Date.now());
      else if (document.hasFocus()) messer.zurueck(Date.now());
    };
    /*
     * ★ Schritt M: das Loslassen einer Taste - für Haltezeit und Überlappung.
     * Am FENSTER und in der Einfangphase, weil ein Merkfenster, das beim
     * Drücken aufgeht, den Fokus schon hat, wenn die Taste hochkommt. Der
     * Messer kennt nur Tasten, die er runtergehen sah; alle anderen übergeht er.
     */
    const onHoch = (e: KeyboardEvent) => {
      messer.losgelassen(e.timeStamp, tastenKennung(e));
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onSichtbar);
    window.addEventListener("keyup", onHoch, true);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onSichtbar);
      window.removeEventListener("keyup", onHoch, true);
    };
  }, [messer]);

  // Meldungen für Screenreader (Braillezeile/Sprache) über eine unsichtbare
  // Live-Region. WICHTIG (Wunsch Johannes): Ist das EIGENE Vorlesen der App an,
  // wird die Live-Region NICHT befüllt — sonst spräche der Screenreader (NVDA/
  // JAWS) jede Meldung ein zweites Mal ÜBER die App-Stimme (doppelt). Dann spricht
  // allein die App. Ist das Vorlesen aus, übernimmt wie bisher der Screenreader.
  // Das Eingabefeld und die Braille-Ausgabe der Tippzeile bleiben davon UNBERÜHRT
  // (sie laufen über das echte Feld, nicht über diese Region).
  // Erst leeren, dann (50 ms später) füllen: Sonst spricht NVDA zwei GLEICHE
  // Meldungen hintereinander nicht erneut (z. B. „Geschafft." Zeile für Zeile,
  // oder denselben Fehler zweimal) — die Live-Region ändert sich ja nicht.
  // Muster wie in der Plattform-a11y (braille/announce.ts, Im-Griff-Parität).
  /**
   * ★★★★★ ZWEIMAL DASSELBE MUSS ZWEIMAL GESPROCHEN WERDEN (03.09.2026 abends).
   *
   * Johannes am iPad: *„VoiceOver spricht bei gleichen Buchstaben immer nur den
   * ersten - also bei jjj spricht sie nur beim ersten j, dann nicht mehr."*
   *
   * Genau der Fall, für den das Leeren-und-neu-Füllen gebaut war - es reicht
   * aber nicht: Am Ende steht wieder derselbe Text, und VoiceOver vergleicht
   * offenbar das ERGEBNIS, nicht die Zahl der Änderungen. Bei `jjj` heisst die
   * nächste Taste dreimal hintereinander „j" - und ein Kind hörte sie einmal.
   *
   * ⇒ Der Inhalt wird jetzt nachweislich ANDERS: An jede zweite Ansage kommt
   *   ein Leerzeichen ans Ende. Gesprochen und auf der Braillezeile ändert das
   *   nichts (nachgestelltes Leerzeichen wird nirgends genannt), aber der
   *   Textknoten unterscheidet sich garantiert vom vorigen.
   */
  /*
   * ★ EN10 (19.09.2026, im Browser gefunden): Der Live-Bereich trägt Sätze
   * der BEDIENUNG („Not quite. The right one is: …") UND Stücke der ÜBUNG
   * (die nächste Taste, die Zeile auf Alt + W) - diese folgen `vorleseLang`
   * (EN1). In der englischen Bedienung stand eine deutsche Übung darum als
   * „großes W" ohne `lang` im englischen Umfeld; eine Sprachausgabe, die
   * `lang` beachtet, las es mit englischer Aussprache. Jetzt bekommt der
   * Bereich je Meldung die Sprache ihres Inhalts, sobald sie von der
   * Bedienung abweicht - nur bei aktivem Sprachbereich, ohne ihn bleibt der
   * Bereich wie vorher ohne Attribut.
   */
  const pushLive = (msg: string, inhaltLang?: Lang) => {
    const el = liveRef.current;
    if (!el) return;
    if (liveTimer.current !== null) window.clearTimeout(liveTimer.current);
    el.textContent = "";
    if (bedienRef.current.bereichAktiv) {
      if (inhaltLang && inhaltLang !== bedienRef.current.sprache)
        el.setAttribute("lang", feinesLangAttribut(inhaltLang) ?? inhaltLang);
      else el.removeAttribute("lang");
    }
    livePendel.current = !livePendel.current;
    const text = livePendel.current ? msg : msg + " ";
    liveTimer.current = window.setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = text;
      liveTimer.current = null;
    }, 50);
  };
  const announce = (msg: string, inhaltLang?: Lang) => {
    if (voiceEnabled) return;
    pushLive(msg, inhaltLang);
  };
  /*
   * ★★★★★ WÄHREND DES TIPPENS BLEIBT DER LIVE-BEREICH STILL - AUSSER
   * „BUCHSTABIEREN" IST AN (Johannes 09.09.2026, nach dem Unterricht).
   *
   * ── DER BEFUND ──────────────────────────────────────────────────────────
   *
   * Die Kinder haben mit Braillezeile gearbeitet, und Johannes hat berichtet:
   *
   *   „Mit JAWS funktioniert es großteils, aber immer bei Leerzeichen
   *    verschwindet die Zeile und er zeigt nur ‚Leerzeichen' an. Bei NVDA
   *    funktioniert es überhaupt nicht: wenn man einen Buchstaben drückt,
   *    kommt nur der eine Buchstabe ganz links, es springt also ständig."
   *
   * Beides ist DIESELBE Ursache: Alles, was in den Live-Bereich geschrieben
   * wird, zeigt der Screenreader nicht nur mit der Stimme, sondern auch als
   * BLITZMELDUNG auf der Braillezeile - für einige Sekunden verdrängt sie die
   * Übungszeile. Für NVDA ist das an der Quelle belegt (`NVDAObjects/__init__.py`,
   * `event_liveRegionChange` ⇒ `ui.message()`, und `ui.message` schreibt
   * Sprache UND Braille). JAWS macht es genauso (Flash-Meldungen). Eine
   * ARIA-Eigenschaft „nur sprechen, nicht anzeigen" gibt es nicht.
   *
   * Der einzelne Buchstabe war die Ansage der NÄCHSTEN Taste (bei
   * Übungssilben wie `fjj` bis heute UNABHÄNGIG von der Einstellung, siehe
   * unten), „Leerzeichen" ihr Wortlaut vor der Leertaste. Es traf genau die
   * Kinder, für die die Zeile gebaut ist: Wer die Zeile ertastet, braucht
   * keine Ansage der nächsten Taste - sie steht unter dem Cursor.
   *
   * ── DIE REGEL ───────────────────────────────────────────────────────────
   *
   * Johannes: *„die Anzeige darf nie auf 1 Zeichen oder auf die Ausgabe
   * ‚Leertaste' springen! Es muss immer ruhig die Zeile angezeigt werden."*
   * Und nachgelegt: *„auch bei Tippfehler darf sich die Anzeige nicht ändern,
   * der Cursor geht einfach nicht weiter, wenn die falsche Taste getippt
   * wurde. Es gibt ja einen Ton, an dem man erkennen kann, dass es falsch
   * war."*
   *
   * Darum geht WÄHREND DES TIPPENS nur noch dann etwas in den Live-Bereich,
   * wenn „Buchstabieren" (`tastenAnsage === "naechste"`) an ist - der
   * Schalter für alle, die NUR HÖREN (Vorgabe auf Apple-Geräten, Johannes am
   * iPad). Steht er auf „aus" (Vorgabe unter Windows), schweigt die App beim
   * Anschlag vollständig: keine nächste Taste, kein „Falsch. Richtig ist …",
   * kein „Geschafft." - die Braillezeile zeigt ruhig die Zeile, der Cursor
   * rückt beim richtigen Anschlag weiter, beim falschen nicht, und der
   * Fehlerton sagt den Rest.
   *
   * ⚠️ Das revidiert die Regel vom 03.09. („Übungssilben werden auch bei
   * ‚aus' angesagt"). Sie war für Kinder gedacht, die nur hören - und traf
   * die, die lesen. Wer nur hört und die Silben angesagt haben will, schaltet
   * „Buchstabieren" an; dann kommt alles wie bisher.
   *
   * Was NICHT hierüber läuft: das Ergebnis der Runde (`announce(spoken)` in
   * der Abschluss-Karte) und die ausdrücklichen Abfragen (Alt + Z, Alt + T,
   * zweimal Umschalt) - dort BITTET jemand um eine Meldung.
   *
   * Über einen Ref, damit jeder Aufrufer (auch `handleComplete` und
   * `handleKey` mit ihren eigenen Abhängigkeitslisten) immer den AKTUELLEN
   * Schalter sieht und nicht den vom letzten Render.
   */
  const announceBeimTippen = (msg: string, inhaltLang?: Lang) => {
    if (tastenAnsageRef.current !== "naechste") return;
    announce(msg, inhaltLang);
  };
  // Schreibt IMMER auf die Braillezeile — auch wenn App-Vorlesen an ist.
  // Nur für explizite Tastenkürzel-Abfragen (Alt+Z, Alt+T), bei denen die
  // Person aktiv nachfragt und eine Antwort auf der Zeile erwartet.
  const brailleFlash = (msg: string, inhaltLang?: Lang) => {
    pushLive(msg, inhaltLang);
  };

  const handleComplete = useCallback(
    (errors: number) => {
      // Zeilenzeit = Summe der einzelnen, bereits fair behandelten
      // Anschlags-Lücken (siehe onCorrect/onWrong, zeilenzeit.ts) - NICHT mehr
      // „Wanduhr minus Wartezeit" ohne Grenzen (Bauplan F1/F1b). Wer den Text
      // SIEHT und parallel zum Vorlesen tippt, bekommt nichts abgezogen; selbst
      // gewählte Pausen bremsen das Tempo weiterhin, nur eben gekappt.
      const ms = Math.max(0, lineMs.current);
      itemStart.current = null;
      // ★ F1c: Ab hier ist es Zeit der App (Zeilenwechsel), bis die nächste
      //   Zeile dasteht.
      const fertigAt = Date.now();
      zeileFertigAt.current = fertigAt;
      // ★ Zeilenende mit Enter (23.09.2026): Enter zählt als EIN Zeichen der
      // Zeile (Tempo, Treffsicherheit, Tippchallenge, Klassenmatch bekommen
      // es damit von selbst) - der Schalter gilt so, wie er für DIESE Zeile
      // festgehalten wurde (derselbe Ref wie im Hook, siehe oben).
      // ★ W2a (D-6): die Zeile, wie sie getippt wurde (mit oder ohne das
      // Leerzeichen vor „?").
      const chars = aktuelleZeile().length + (zeilenEndeAktivRef.current ? 1 : 0);
      sum.current.chars += chars;
      sum.current.errors += errors;
      sum.current.ms += ms;
      // Schritt M: die Messungen dieser Zeile (nur festgehalten, nie bewertet).
      const messung = zeilenMessFelder(
        messer.abschliessen(fertigAt),
        wackeligZaehlen(lineEvents.current, wackeligBeiStart.current),
      );
      // „Geübte Zeit" der Zeile = Zuwachs der Übezeit-Uhr seit der letzten
      // Meldung — EINE Zeitrechnung für Uhr und Wochenziel-Kreise, damit beide
      // Anzeigen immer dieselbe Übezeit zeigen (vorher liefen sie auseinander:
      // die Uhr zählte Zwischen-Zeilen- und Ansage-Zeiten, die Telemetrie nicht).
      onItemDone?.({
        lesson: contextId,
        chars,
        errors,
        ms,
        activeMs: Math.round(takePracticeDelta()),
        blurred: blurred.current,
        lang,
        // ★ 19.10.2026: Melodie an ⇒ das Tempo dieser Zeile bremst den Score nie.
        ...(useMelodie.getState().an && !isSoundMuted() ? { melodie: true } : {}),
        ...messung,
      });
      onLetters?.(lineEvents.current);
      // Die Wartezeit AUF DAS VORLESEN dieser Zeile - für die Prüfungsuhr der
      // Schreibprobe. Sie ist oben schon aus `ms` herausgerechnet; hier wird
      // sie nur noch weitergereicht, damit niemand sie ein zweites Mal misst.
      onZeilenWartezeit?.(waitMs.current, wechselPauseMs.current);
      lineEvents.current = [];
      blurred.current = false;
      // No-Repeat-Ledger (TW-E2): war diese Zeile ein Korpus-Baustein, ihn als
      // „gesehen" verbuchen — modusübergreifend (adaptiv + Lektionen teilen es).
      const src = sources?.[qi];
      if (typeof src === "number") onLineSeen?.(src);
      // Tempo/Genauigkeit DIESER Zeile für die feinkörnige Anfangs-Kalibrierung.
      onLineDone?.(accuracyOf(chars, errors), cpmOf(chars, ms));
      playSuccessSound();
      announceBeimTippen(bedienRef.current.st.geschafft);
      // Ab hier bis zur nächsten Zeile gehen Anschläge in den Puffer (`tasteAnnehmen`).
      zeilenwechselRef.current = true;

      const last = qi + 1 >= items.length;
      window.setTimeout(() => {
        // ★ `zeilenAnhaengen`: kein Rundenende. Gezählt wird der Vorrat beim
        //   ABLAUF der Pause - Nachschub, der in ihr kam, zählt schon mit.
        if (zeilenAnhaengen) {
          if (qi + 1 < itemsRef.current.length) setQi((n) => n + 1);
          else wartetAufNachschubRef.current = true;
          return;
        }
        if (last) {
          const acc = accuracyOf(sum.current.chars, sum.current.errors);
          const speed = cpmOf(sum.current.chars, sum.current.ms);
          // ★★★★★ Bei einem Wortspiel entscheidet allein die Genauigkeit
          // ueber die Sterne (Ziel 0 = „nur Treffsicherheit", siehe stars.ts).
          // Wer im Lueckentext nachdenkt, soll dafuer keinen Stern verlieren.
          const finalStars = roundStars(acc, speed, istWortspiel(contextId) ? 0 : (speedTarget ?? 0));
          const c = chain.current;
          // Eltern ZUERST informieren (setzen ggf. den Stufen-Aufstieg), DANN in
          // die Abschluss-Karte wechseln — so steht der Aufstiegs-Hinweis beim
          // Sound bereit. Der Belohnungs-Klang spielt der Summary-Effekt.
          // ★ 29.10.2026: Welcher der Sätze auf der Karte dran ist - EINMAL hier
          // gezogen (im Ereignis, nicht im Render), damit ein neu gezeichneter
          // Bildschirm den Satz nicht wechselt.
          zieheKartenVarianten(acc, finalStars);
          onSessionDone?.(acc, speed, finalStars, {
            keys: sum.current.chars + sum.current.errors,
            errors: sum.current.errors,
            ms: sum.current.ms,
            leadClean: c.lead,
            trailClean: c.cur,
            bestClean: c.best,
            hadError: c.sawError,
            keyboardHidden: keyboardHidden(),
            wortspiel: istWortspiel(contextId),
          });
          setPhase("summary");
        } else {
          setQi((n) => n + 1);
        }
      }, zeilenPauseMs);
    },
    [
      expected,
      items.length,
      contextId,
      onItemDone,
      onLetters,
      onLineDone,
      onSessionDone,
      onLineSeen,
      sources,
      speedTarget,
      qi,
      zeilenAnhaengen,
      messer,
    ],
  );

  /**
   * ★★★★★ DER SCREENREADER BEKOMMT WÖRTER UND SÄTZE, NICHT NUR BUCHSTABEN
   * (Julian Iriogbe, obvita St. Gallen, 23.09.2026).
   *
   * Mit „Vorlesen aus" und „Buchstabieren an" kam bis heute nur die nächste
   * Taste in den Live-Bereich - ein Kind mit JAWS hörte „großes D, e, r,
   * Leertaste, H …" und musste sich jedes Wort selbst zusammensetzen. Die
   * eigene Stimme sagt dagegen seit jeher am Zeilenanfang den Satz und am
   * Wortanfang das Wort. Julian: *„mit dieser Option wird … unterdrückt, dass
   * auch der Blinde ganze, sinnvolle Wörter hören und schreiben kann."*
   *
   * Jetzt dieselbe Regel für beide Wege: `readPlanAt` mit Wörtern, Sätzen und
   * Buchstaben. Johannes 23.09.: am Zeilenanfang der GANZE Satz. Übungssilben
   * bleiben buchstabiert (`istWort`), die Umschalttaste folgt `shiftLearned`
   * („großes D" erst, wenn sie gelernt ist - wie bei der eigenen Stimme).
   *
   * Die Teile gehen als EIN Text in den Live-Bereich; ein Komma dazwischen
   * gibt dem Screenreader die Pause, die `speakSequence` sonst macht.
   */
  const screenreaderAnsage = (pos: number): string => {
    const text = aktuelleZeile();
    const zeile = zeilenEndeAktivRef.current ? text + "\n" : text;
    const teile = readPlanAt(
      zeile,
      pos,
      { letters: true, words: true, sentences: true, shiftLearned, lang: vorleseLang },
      istWort,
    );
    return teile
      .map((t, i) => (i < teile.length - 1 && !/[.!?:;,]$/.test(t) ? t + "," : t))
      .join(" ");
  };

  /**
   * ★★★★★ DIE NÄCHSTE TASTE ANSAGEN - nicht die gedrückte (03.09.2026 abends).
   *
   * Johannes am iPad: *„er sagt beim Tastenecho immer, was gedrückt wurde. Das
   * ist ja nicht das, was man hören will - man will ja die nächste Taste
   * hören."* Ein Kind, das blind schreiben lernt, weiss selbst, was es gedrückt
   * hat; es braucht die Anweisung, nicht die Quittung.
   *
   * ★ Dass der Anschlag angekommen ist, hört es daran, dass die Ansage
   *   WEITERGERÜCKT ist.
   *
   * ── ⚠️ NUR BEI „BUCHSTABIEREN" AN (seit 09.09.2026) ─────────────────────
   *
   * Vom 03.09. bis 09.09. galt: *„bei Wörtern, die keine sind, muss auch bei
   * ‚aus' jede Taste angesagt werden."* Das hat Kinder mit Braillezeile
   * getroffen - jede dieser Ansagen verdrängte die Zeile als Blitzmeldung
   * (siehe `announceBeimTippen`). Der Unterschied Wort/Silbe liegt jetzt
   * allein bei der eigenen Stimme (`readPlanAt`: Nicht-Wort ⇒ buchstabieren);
   * der Screenreader-Weg richtet sich nur nach dem Schalter.
   */
  const naechsteTasteAnsagen = useCallback(
    (cur: number) => {
      // ★ Zeilenende mit Enter: nach dem LETZTEN Zeichen kommt die
      // Eingabetaste - sie soll genauso angesagt werden wie jede andere
      // nächste Taste (`spokenLabel("\n", …)` liefert schon „Eingabetaste"/
      // "enter", siehe `fingers.ts`).
      const text = screenreaderAnsage(cur + 1);
      if (!text) return;
      announceBeimTippen(text, vorleseLang);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expected, vorleseLang, voiceEnabled, shiftLearned],
  );

  /**
   * Der erste Anschlag einer Zeile? Dann gilt sie ab jetzt als begonnen - und
   * lief noch keine Uhr (erste Zeile einer Runde, F1c), beginnt sie mit IHM.
   * Ab dem ersten Anschlag läuft die Uhr der Runde.
   */
  const zeileBeginnt = useCallback((now: number): boolean => {
    uhrLaeuft.current = true;
    if (itemStart.current !== null) return false;
    itemStart.current = now;
    // Schritt M: die wackligen Tasten, wie sie zu Beginn DIESER Zeile sind.
    // Erst hier und nicht beim Erscheinen: In der Tippchallenge kommen sie
    // aus einem Nachladen, das beim ersten Erscheinen noch laufen kann -
    // und bis zum ersten Anschlag ändert sich der Lernstand nirgends.
    const wacklige = wackeligeTastenRef.current;
    wackeligBeiStart.current = wacklige && wacklige.length > 0 ? new Set(wacklige) : null;
    // Beim Üben wie vor F1c: immer hier neu ansetzen. Mit Zeilen-Uhr ab der
    // Anzeige nur, wenn noch keine Uhr lief - sonst ginge die Zeilenansage
    // verloren, die seit dem Erscheinen der Zeile gesprochen wurde.
    if (!zeilenuhrRef.current || lastTs.current === null) lastSpokenSnapshot.current = spokenMs();
    return true;
  }, []);

  /**
   * ★ Die Lücke seit dem letzten Anschlag - oder, beim ersten, seit die Zeile
   * dasteht (F1c) - auf Zeilenzeit und Zuhören verteilen. EINE Stelle für
   * Treffer und Fehlgriff (`zeilenLuecke`, Bauplan F1/F1b/F1c): Wird WÄHREND
   * des Sprechens getippt (Text gesehen), zählt die volle Zeit; nur echtes
   * WARTEN auf die Ansage wird abgezogen, Überlegen zählt bis zur
   * Pausentoleranz dieses Kindes.
   *
   * Gibt die reine Tippzeit der Lücke zurück (für die Statistik je Taste),
   * oder `null`, wenn es keine Lücke gab.
   */
  const lueckeVerbuchen = useCallback((now: number): number | null => {
    if (lastTs.current === null) return null;
    const rawDelta = now - lastTs.current;
    if (!(rawDelta > 0)) return null;
    const spokenNow = spokenMs();
    const spokenInGap = spokenNow - lastSpokenSnapshot.current;
    const speakingNow = isSpeaking();
    lastSpokenSnapshot.current = spokenNow;
    const luecke = zeilenLuecke(rawDelta, spokenInGap, speakingNow, practiceIdleCap());
    lineMs.current += luecke.zeileMs;
    waitMs.current += luecke.zuhoerMs; // nur das echte Warten aufs Vorlesen
    return typingGapMs(rawDelta, spokenInGap, speakingNow);
  }, []);

  /**
   * ★ 05.11.2026 (Meldung w0tt7egy6eqnr4x): Ist die Totaste eines
   * Zwei-Schritt-Zeichens gedrückt („À" = Gravis, dann Umschalt + A), zeigt die
   * Bildschirm-Tastatur den zweiten Schritt. Jeder gewertete Anschlag beendet ihn.
   */
  const [totasteOffen, setTotasteOffen] = useState(false);
  // Neue Zeile: keine offene Totaste mehr (der Anschlag-Deuter beginnt sie auch neu).
  useEffect(() => setTotasteOffen(false), [expected, qi]);

  const onCorrect = useCallback((ch: string, cur: number) => {
    setTotasteOffen(false);
    const now = Date.now();
    notePracticeActivity(); // Übezeit-Uhr der Lernsession am Laufen halten
    const ersterDerZeile = zeileBeginnt(now);
    const typed = lueckeVerbuchen(now);
    // Anschlagzeit für die Pro-Buchstaben-Statistik = reine Tippzeit (ohne
    // Vorlesen). ⚠️ NICHT für den ersten Anschlag einer Zeile: Seine Lücke
    // (F1c, ab dem Erscheinen der Zeile) enthält das Lesen der neuen Zeile -
    // für die Zeilenzeit richtig, für „wie schnell sitzt diese Taste" nicht.
    const ms =
      !(ersterDerZeile && zeilenuhrRef.current) && typed !== null && typed > 0 && typed <= MAX_DWELL
        ? typed
        : undefined;
    // ★ Zeilenende mit Enter: „\n" geht NICHT in die Tasten-Statistik (Bauplan
    // 23.09.2026) - sonst bekäme die Eingabetaste eine eigene Zeile in der
    // Buchstaben-Auswertung, in der sie nichts zu suchen hat. Tempo und
    // Treffsicherheit zählen sie trotzdem mit (über `chars`/`errors`, nicht
    // über `lineEvents`).
    // ★ G2b-1: der Statistik-Schlüssel ist der Kleinbuchstabe IN DER SPRACHE der Übung -
    // türkisch „İ" ⇒ „i" (nicht der zweistellige Schlüssel „i̇"), „I" ⇒ „ı".
    if (ch !== "\n") lineEvents.current.push({ char: statistikSchluessel(ch, vorleseLang), correct: true, ms });
    // Fehlerfreie Kette („Am Stück"): ein Zeichen = ein Anschlag, wie bei den
    // Runden-Summen. Der Umschalt-Griff zählt bewusst nicht doppelt.
    const c = chain.current;
    c.cur += 1;
    if (c.cur > c.best) c.best = c.cur;
    if (!c.sawError) c.lead += 1;
    // Umschalt-Anschlag nur zählen, wenn die Umschalttaste WIRKLICH gelernt ist.
    // Solange die Auto-Großschreibung gilt, wird kein Umschalt verlangt/gezählt.
    if (shiftLearned && needsShift(ch))
      lineEvents.current.push({ char: SHIFT_UNIT, correct: true, ms });
    /*
     * ★ E4 (25.09.2026, Bauplan §4.3 Punkt 6, §4.3 letzter Punkt): „ê" zählt
     * für sich (schon durch die Zeile oben, `ch.toLowerCase()` - wie „ä"
     * heute), UND die Totaste bekommt eine EIGENE Zeile - dieselbe Bauart wie
     * die Umschalttaste zwei Zeilen darüber. Nur auf französischen
     * Tastaturen: `kombizeichenFuerLayout` findet für DE/CH/US/UK gar keinen
     * Treffer, weil `ch` dort nie eines der neun zusammengesetzten Zeichen ist.
     */
    if (hatLehrgangsTotasten(activeLayoutId())) {
      // ★ S3 (26.09.2026): auch grosse Kombizeichen („Î") - `kombizeichenZu`.
      const kombi = kombizeichenZu(ch, activeLayout());
      if (kombi) lineEvents.current.push({ char: kombi.tot, correct: true, ms });
    }
    lastTs.current = now;
    // ★ Melodie beim Tippen (15.10.2026): Ist sie an, spielt jeder richtige
    //   Anschlag den nächsten Ton - dann entfällt der Tipp-Klick. Synchron
    //   hier im Tastendruck, sonst bleibt das iPad stumm.
    if (!melodieAnschlag()) playKeyTick();
    // ★ Die Ansage kommt NACH dem Klick und NACH der Verbuchung: Sie darf die
    //   Übezeit-Rechnung oben nicht beeinflussen, und `announce` schweigt
    //   ohnehin, solange das eigene Vorlesen läuft (dann spricht die App).
    naechsteTasteAnsagen(cur);
    // ⚠️ `voiceEnabled` gehört in die Abhängigkeiten, obwohl es hier nirgends
    //   steht: `announce` schliesst es ein (es schweigt, solange das eigene
    //   Vorlesen läuft). Ohne diesen Eintrag bliebe nach dem Umschalten des
    //   Vorlesens die ALTE Fassung stehen - dieselbe Falle, die `onWrong`
    //   schon kennt, dort steht es aus genau diesem Grund seit jeher drin.
  }, [shiftLearned, naechsteTasteAnsagen, zeileBeginnt, lueckeVerbuchen, vorleseLang]);

  const onWrong = useCallback(
    (want: string, typed: string, _index: number, capsLockOn?: boolean) => {
      setTotasteOffen(false);
      const now = Date.now();
      notePracticeActivity(); // auch Fehlversuche sind aktives Üben
      zeileBeginnt(now);
      lueckeVerbuchen(now); // Zeilenzeit und Zuhören - siehe onCorrect/zeilenzeit.ts
      // Ein Fehler reißt die fehlerfreie Kette — auch der Umschalt-Fehler unten.
      chain.current.sawError = true;
      chain.current.cur = 0;
      /*
       * ★ E4 (25.09.2026, Bauplan §3.2, §14 E4 Punkt 5): FESTSTELLTASTE AUF
       * AZERTY. Gemessen (BEFUND-2026-09-25-E1-TOTASTEN-WINDOWS.md §2): mit
       * Feststelltaste an geben „é è ç à" die Ziffern „2 7 9 0" statt
       * Grossbuchstaben - ein Kleinbuchstabe als Ziel bleibt sonst ein
       * STUMMER Fehler (die Gegenhand-Regel unten prüft hier nichts, die
       * Stelle braucht ja gar kein Umschalt). NUR auf französischen
       * Tastaturen und nur bei einem echten Kleinbuchstaben als Ziel
       * (Bauplan: „oder überhaupt ein Kleinbuchstabe").
       */
      const feststelltasteBetroffen =
        !!capsLockOn &&
        hatLehrgangsTotasten(activeLayoutId()) &&
        /^\p{Ll}$/u.test(want);
      if (feststelltasteBetroffen) {
        if (want !== "\n") lineEvents.current.push({ char: statistikSchluessel(want, vorleseLang), correct: false });
        lastTs.current = now;
        playErrorSound(); // Ton wie jeder Fehlgriff (Bauplan)
        setFeststelltasteOffen(true); // Ziffer statt Buchstabe: gleiches Fenster wie bei jedem Buchstaben
        return;
      }
      // „Falsche Umschalttaste": Der Buchstabe stimmt (das erzeugte Zeichen ist
      // das gewünschte), nur die Umschalt-Seite war falsch bzw. es war die
      // Feststelltaste. Dann steckt der Fehler in der UMSCHALTTASTE, nicht im
      // Buchstaben — entsprechend gezielt zählen und ansagen.
      // ★ 17.10.2026 (Johannes): wieder ein Fehlgriff, wie vor W2a. Die Regel
      //   vom 27.09. („Falsche Umschalt-Seite nur als Hinweis", §3.8 Punkt 2)
      //   ist zurückgenommen: Wer „Einhand schreiben" nicht eingeschaltet hat,
      //   schreibt Grossbuchstaben mit der Umschalttaste der GEGENHAND.
      const wrongShift =
        shiftLearned && enforceShiftHand && needsShift(want) && typed === want;
      if (wrongShift) {
        lineEvents.current.push({ char: SHIFT_UNIT, correct: false });
        const side = shiftHandFor(want);
        // SICHTBAR/Braillezeile in der BEDIENUNGSSPRACHE (bis EN1: immer
        // deutsch), GESPROCHEN folgt der Vorlese-Sprache. Beide Wege stehen
        // sich nicht im Weg: Wer einen Screenreader nutzt, lässt das
        // Selbst-Vorlesen aus.
        const b = bedienRef.current;
        const hint = b.st.umschaltFalsch(
          zeichenNameSichtbar(want, b.sprache),
          side === "links",
        );
        lastTs.current = now;
        playErrorSound();
        announceBeimTippen(hint);
        if (voiceEnabled && !satzSprichtNoch())
          speakUi(
            ansageUmschaltSeite(
              spokenLabel(want, vorleseLang),
              side === "links",
              vorleseLang,
            ),
            undefined,
            // ★★★★ Auch dieser Hinweis ist die Antwort auf EINEN Anschlag
            //   (04.09.2026) - er erklärt, welche Umschalttaste gefehlt hat.
            //   Kommt er eine Sekunde später, hat das Kind schon weitergetippt.
            "sofort",
          );
        /*
         * ★ Das Fenster (Johannes 31.08.: „immer Dialog, bis das Häkchen
         *   gesetzt ist"). Es kommt ZUSÄTZLICH zu Ton und Ansage, nicht statt
         *   ihrer - wer mit Screenreader arbeitet, hat die Erklärung schon
         *   gehört, bevor das Fenster steht.
         *   `side` kann theoretisch fehlen (Sicherheitsnetz in shiftHandFor);
         *   ohne Seite gäbe es nichts zu erklären, dann bleibt es beim Ton.
         */
        if (side && zeigeUmschaltFenster())
          setMerkfenster({
            ...umschaltFenster(
              zeichenNameSichtbar(want, b.sprache),
              side,
              skin,
              b.sprache,
            ),
            mitHaken: true,
            art: "umschalt",
          });
        return;
      }
      // ★ Zeilenende mit Enter: eine falsche Taste STATT Enter am Zeilenende
      // (want === "\n") geht NICHT in die Tasten-Statistik - dieselbe
      // Begründung wie in `onCorrect`. Enter MITTEN in der Zeile (want ist ein
      // gewöhnliches Zeichen, typed === "\n") bleibt unverändert diesem
      // Zeichen zugeschlagen.
      if (want !== "\n") lineEvents.current.push({ char: statistikSchluessel(want, vorleseLang), correct: false });
      // Der Umschalt-Griff bekommt einen Fehler NUR, wenn er auch schuld ist:
      // Das Kind hat den richtigen Buchstaben erwischt, aber klein geschrieben —
      // dann fehlte die Umschalttaste. Wer stattdessen eine ganz andere Taste
      // trifft, hat sich im BUCHSTABEN vergriffen; die Umschalttaste hat damit
      // nichts zu tun. Bis 28.08.2026 wurde sie pauschal mitbestraft und erbte
      // so die Fehler aller Großbuchstaben — sie war deshalb bei Kindern
      // regelmäßig die „schlechteste Taste", ohne es zu sein (Befund an Janos
      // Konto: 76,7 % Lebenszeit, dadurch dauerhaft gesperrt).
      const umschaltVergessen =
        shiftLearned && needsShift(want) && typed === kleinFuer(want, vorleseLang);
      if (umschaltVergessen)
        lineEvents.current.push({ char: SHIFT_UNIT, correct: false });
      lastTs.current = now;
      playErrorSound();
      /*
       * ★★★ W2a (28.09.2026, D-7): Weg „es" - Umschalt VOR der Tilde-Taste
       * („ä" statt „á"). Ein gewöhnlicher Fehlgriff wie jeder andere (oben
       * schon gezählt, kein zweiter); dazu der Hinweis, WORAN es lag - sichtbar
       * in der Hilfszeile, im Live-Bereich nur bei „Buchstabieren an" (Regel
       * 09.09.: die Braillezeile springt nie), gesprochen nur bei „Vorlesen an".
       */
      const tildeHinweis =
        lernweg === "es" && umschaltVorTilde(want, typed)
          ? umschaltVorTildeText(bedienRef.current.sprache)
          : null;
      if (tildeHinweis) zeigeKurzHinweis("´", tildeHinweis, 4000);
      /*
       * ★★★ F8-pl (03.10.2026, Glossar Pl §3 Falle 1): ein polnischer Buchstabe (ą ć ę ł ń ó ś ź ż) liegt auf AltGr (Mac: Option) +
       * seinem Grundbuchstaben. Wer den Grundbuchstaben schreibt, hat sich vergriffen - ein gewöhnlicher Fehlgriff (oben schon
       * gezählt), dazu der Hinweis auf den WEG, nie ein „falsch" gegen das Kind. Dieselben Wege wie der Tilde-Hinweis: sichtbar in
       * der Hilfszeile, im Live-Bereich nur bei „Buchstabieren an", gesprochen nur bei „Vorlesen an". Die Eigenschaft liegt an der
       * Tastatur (`KeyAccess.buchstabe`), nicht am Weg; auf jeder anderen Tastatur ist der Hinweis `null`.
       */
      const ogonekHinweis = tildeHinweis ? null : polnischerBuchstabeHinweis(bedienRef.current.sprache, want, typed);
      if (ogonekHinweis) zeigeKurzHinweis(want, ogonekHinweis, 4500);
      const wegHinweis = tildeHinweis ?? ogonekHinweis;
      const falschSatz = bedienRef.current.st.falsch(
        zeichenNameSichtbar(want, bedienRef.current.sprache),
      );
      announceBeimTippen(wegHinweis ? `${falschSatz} ${wegHinweis}` : falschSatz);
      /*
       * Auto-Großschreibung: solange ⇧ nicht gelernt ist, tippt das Kind die
       * kleine Taste - dann sagt die Stimme auch nicht „großes …".
       *
       * ★★★★ „sofort" seit 04.09.2026 (Johannes' Entscheidung d). Diese
       * Korrektur gehört zum ANSCHLAG - genau wie die Ansage der nächsten
       * Taste, und mit derselben Begründung: Sie ist eine Zehntelsekunde
       * später veraltet. Als „ereignis" reihte sie sich hinter der laufenden
       * Ansage ein UND wartete auf das Ruhefenster; am iPad gemessen lagen
       * drei solche Werte bei 736, 815 und 816 ms.
       */
      // ★ Tippchallenge (`satzAusreden`): Solange der Satz noch spricht, sagt
      //   der Fehlerton genug - die Korrektur würgte den Satz sonst ab.
      if (voiceEnabled && !satzSprichtNoch()) {
        speakChar(want, shiftLearned, vorleseLang, "sofort");
        // ★ W2a (D-7): der Hinweis HINTER dem Zeichen, nicht statt seiner.
        if (wegHinweis)
          speakUi(wegHinweis, undefined, "ereignis", bedienRef.current.bereichAktiv ? bedienRef.current.sprache : undefined);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voiceEnabled, shiftLearned, enforceShiftHand, satzSprichtNoch, zeileBeginnt, lueckeVerbuchen, lernweg, vorleseLang],
  );

  // Gegenhand-Regel: Braucht ein Zeichen die Umschalttaste, zählt der Anschlag
  // nur, wenn die Umschalttaste der GEGENHAND gehalten wird. Zeichen ohne
  // Umschalt sind unkritisch (true). Wird nur ausgewertet, wenn die Umschalttaste
  // schon gelernt ist (davor gilt die Auto-Großschreibung).
  const correctShiftHeld = useCallback((want: string) => {
    if (!needsShift(want)) return true;
    const side = shiftHandFor(want);
    if (!side) return true; // Sicherheitsnetz — sollte bei needsShift nie greifen
    return heldShift.current.has(side);
  }, []);

  /**
   * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8 Punkt 2): eine
   * Totaste wartet - „Zirkumflex wartet", in der Bedienungssprache. Gemessen:
   * Windows und NVDA sagen beim Drücken der Totaste NICHTS; ein Kind, das
   * nicht sieht, weiss sonst nicht, ob sie angekommen ist.
   *
   * Dieselben zwei Wege wie jede Antwort auf einen Anschlag (Regel 09.09.:
   * die Braillezeile springt nie): der Live-Bereich NUR bei „Buchstabieren
   * an" (`announceBeimTippen`), die eigene Stimme nur bei „Vorlesen an" -
   * `speakUi` neben `announce`, nie `speakUiAlways`. Bei „Buchstabieren aus"
   * kommt also KEINE Blitzmeldung auf die Braillezeile.
   */
  /** Feststelltaste an: bei JEDEM Buchstaben ein Fenster, bestätigt mit „Weiter". */
  const [feststelltasteOffen, setFeststelltasteOffen] = useState(false);
  const onFeststelltaste = useCallback(() => setFeststelltasteOffen(true), []);

  const onTotaste = useCallback(
    (tot: string | null) => {
      setTotasteOffen(true);
      const b = bedienRef.current;
      const text = totasteWartetText(tot, b.sprache);
      announceBeimTippen(text);
      if (voiceEnabled && !satzSprichtNoch())
        speakUi(text, undefined, "sofort", b.bereichAktiv ? b.sprache : undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voiceEnabled, satzSprichtNoch],
  );

  const {
    index,
    zeile: zeileJetzt,
    errors: zeilenFehler,
    wrongTick,
    handleKey,
  } = useTypingItem({
    expected,
    sprache: vorleseLang, // G2b-1: Auto-Großschreibung in der Sprache der Übung
    active: phase === "run",
    onComplete: handleComplete,
    onCorrect,
    onWrong,
    // Auto-Großschreibung, bis die Umschalttaste gelernt ist (kleiner Buchstabe
    // genügt für den großen — der große erscheint trotzdem).
    acceptLowerForUpper: !shiftLearned,
    // Ist die Umschalttaste gelernt UND die Gegenhand-Regel aktiv, wird die
    // richtige (Gegenhand-)Umschalttaste verlangt — falsche Umschalttaste/
    // Feststelltaste zählen als Fehler. Bei „Einhand schreiben" (enforceShiftHand
    // false) entfällt die Prüfung: jede Umschalttaste/Feststelltaste ist ok.
    correctShiftHeld:
      shiftLearned && enforceShiftHand ? correctShiftHeld : undefined,
    // Zwei gleiche Zeilen hintereinander setzen trotzdem zurück (useTypingItem.ts).
    zeile: qi,
    // ★ Zeilenende mit Enter (23.09.2026) - DIE Stelle, an der der Hook den
    // Schalter bekommt. Ohne sie verlangt der Hook nie Enter, obwohl die
    // übrige Sitzung (Zeichen-Zählung, ↵-Anzeige, Tastatur) längst davon
    // ausgeht - genau der Widerspruch, den `tests/tastenflow-zeilenende-enter.test.tsx`
    // fängt (die Zeile schloss nach "ab" mit chars=3, aber ohne je Enter
    // verlangt zu haben).
    zeilenEnde,
    onTotaste,
    onFeststelltaste,
    // ★★★ W2a (28.09.2026, D-6): Weg „fr" - Leerzeichen vor ; : ! ? und innen
    // an « » mit UND ohne, " für « » (`eingabeVarianten.ts`). Nur dort.
    varianten: lernweg === "fr" ? FRANZ_EINGABE : undefined,
    onZeileAngepasst: (text: string) => {
      angepasstRef.current = { quelle: expected, qi, text };
    },
  });

  /**
   * ★★★★★ KEIN ANSCHLAG VERSCHWINDET ZWISCHEN ZWEI ZEILEN (11.09.2026).
   *
   * Johannes nach dem ersten Klassenmatch mit einer Klasse: *„Zwei schüler
   * hatten das gefühl dass nicht alle Tasten erkannt wurden und sie öfter
   * gedrückt werden müssen."* Nachgestellt: Zwischen dem letzten Zeichen einer
   * Zeile und der nächsten Zeile (`zeilenPauseMs` - 550 ms im Lehrgang, 220 ms
   * in Match und Challenge) verschwand jeder Anschlag still, ohne Ton und ohne
   * Zählung (`useTypingItem`, `doneRef`). Wer ohne abzusetzen weiterschreibt,
   * trifft genau dieses Fenster - und drückt die Taste ein zweites Mal.
   * Hausregel: Ein Tastendruck ohne Antwort ist eine kaputte Tastatur.
   *
   * ★ ENTSCHIEDEN VON JOHANNES, 11.09.2026: *„die behebung des gap beim
   *   zeilenwechsel soll überall erfolgen bei der tippchallenge, beim match
   *   und auch beim normal üben"* - darum gibt es keinen Schalter.
   *
   * Jeder Anschlag kommt hier vorbei (Tippfeld und „einfach losschreiben").
   * Steht die Session zwischen zwei Zeilen, wird ein Einzelzeichen der Reihe
   * nach gemerkt, samt einer MOMENTAUFNAHME der gehaltenen Umschalttasten: Beim
   * Nachspielen ist die Umschalttaste längst losgelassen, und die
   * Gegenhand-Regel (`correctShiftHeld`) fragt nach dem Augenblick des
   * Anschlags. Nachgespielt wird auf die nächste Zeile, über denselben Weg wie
   * ein frischer Anschlag: Treffer oder Fehler, Ton, Buchstaben, Ansage. Die
   * Pause bleibt, der Erfolgsklang auch.
   *
   * ⚠️ NUR VON ZEILE ZU ZEILE. Endet die RUNDE (Abschluss-Karte, Sterne), wird
   * nichts in die nächste getragen - dort gehört die Taste der Karte. Ein Stopp
   * und das Aushängen verwerfen den Puffer ebenso.
   * Wächter: `tests/tastenflow-anschlaege-zeilenwechsel.test.tsx`.
   */
  const tasteAnnehmen = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      /*
       * ★ Zeilenende mit Enter (23.09.2026): Ist der Schalter für DIESE Zeile
       * an, zählt die Eingabetaste wie ein Einzelzeichen - sie muss also auch
       * hier durch, in der Messung UND im Zeilenwechsel-Puffer, sonst
       * verschwände sie genau in der Zeitspanne, gegen die dieser ganze
       * Puffer ursprünglich gebaut wurde (11.09.2026, siehe oben).
       */
      const eingabetaste = zeilenEndeAktivRef.current && e.key === "Enter";
      /*
       * ★ Schritt M: jeden ankommenden Zeichen-Anschlag messen - HIER, bevor
       * er angenommen oder für die nächste Zeile gemerkt wird, mit seiner
       * echten Ankunftszeit. Gemerkte Anschläge werden später direkt über
       * `handleKey` nachgespielt - an dieser Stelle vorbei, also nie doppelt
       * gezählt. Ändert nichts am Anschlag.
       */
      // ★ 23.09.2026: AltGr (Windows: Strg + Alt) tippt ein Zeichen - `zeichenTaste.ts`.
      if (istZeichenAnschlag(e) || (eingabetaste && !e.altKey && !e.ctrlKey && !e.metaKey)) {
        const nativ = "nativeEvent" in e ? e.nativeEvent : e;
        messer.taste({
          t: nativ.timeStamp,
          id: tastenKennung(nativ),
          echt: nativ.isTrusted !== false,
          wiederholung: nativ.repeat === true,
          gesprochenMs: spokenMs(),
          sprichtJetzt: isSpeaking(),
          deckelMs: practiceIdleCap(),
        });
      }
      if (zeilenwechselRef.current) {
        if (eingabetaste ? istKuerzel(e) : !istZeichenAnschlag(e)) return;
        e.preventDefault();
        if (pufferRef.current.length < MITNEHMEN_HOECHSTENS)
          pufferRef.current.push({
            key: e.key,
            umschalt: new Set(heldShift.current),
            ts: Date.now(),
          });
        return;
      }
      handleKey(e);
    },
    [handleKey, messer],
  );

  /**
   * Die gemerkten Anschläge auf die neue Zeile nachspielen - sobald sie steht.
   *
   * ⚠️ Dieser Effekt steht NACH `useTypingItem`: Dessen Rücksetzen auf die neue
   * Zeile läuft im selben Takt davor (Effekte laufen in der Reihenfolge ihrer
   * Deklaration). Stünde er weiter oben, träfen die Anschläge noch auf die als
   * „fertig" markierte alte Zeile und verschwänden genau so wie vorher.
   *
   * Beendet ein nachgespielter Anschlag die Zeile gleich wieder (kurze Zeile,
   * schnelles Kind), wartet der Rest auf die übernächste. Endet die Runde statt
   * einer neuen Zeile, verfällt der Puffer.
   */
  useEffect(() => {
    if (phase !== "run") {
      pufferRef.current = [];
      zeilenwechselRef.current = false;
      return;
    }
    if (!zeilenwechselRef.current || wartetAufNachschubRef.current) return;
    zeilenwechselRef.current = false;
    const liste = pufferRef.current;
    pufferRef.current = [];
    // Die Zeile beginnt mit dem ERSTEN gemerkten Anschlag, nicht mit dem
    // Nachspielen - sonst fehlte ihrer Schreibzeit (Tempo, Challenge-Wertung)
    // die Spanne bis zum Nachspielen. ★ F1c (Klassenmatch, Tippchallenge):
    // Die Zeilen-Uhr wird darum auf ihn zurückgestellt, und die
    // Zeilenwechsel-Pause (Zeit der App) endet dort.
    if (liste.length && itemStart.current === null) {
      const erster = liste[0].ts;
      if (zeilenuhrRef.current) {
        if (lastTs.current === null || erster < lastTs.current) lastTs.current = erster;
        if (wechselPauseVon.current !== null)
          wechselPauseMs.current = Math.max(0, erster - wechselPauseVon.current);
      } else {
        // Üben: wie vor F1c.
        itemStart.current = erster;
        lastSpokenSnapshot.current = spokenMs();
      }
    }
    for (let i = 0; i < liste.length; i++) {
      if (zeilenwechselRef.current) {
        pufferRef.current.push(...liste.slice(i));
        break;
      }
      const { key, umschalt } = liste[i];
      const jetztGehalten = heldShift.current;
      heldShift.current = umschalt;
      try {
        handleKey({ key, preventDefault() {} } as unknown as KeyboardEvent);
      } finally {
        heldShift.current = jetztGehalten;
      }
    }
    // Nur an der ZEILE: `handleKey` ist in diesem Takt schon die Fassung für
    // die neue Zeile, und bei jedem Anschlag neu nachzuspielen wäre falsch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, expected, phase]);

  // Beim Aushängen nichts stehen lassen.
  useEffect(
    () => () => {
      pufferRef.current = [];
      zeilenwechselRef.current = false;
      wartetAufNachschubRef.current = false;
    },
    [],
  );

  /**
   * Der Abbruch-Rückruf über einen Ref: So sieht der Effekt unten immer den
   * AKTUELLEN Rückruf, ohne dass dieser in seine Abhängigkeitsliste müsste.
   */
  const onStoppRef = useRef(onStopp);
  useEffect(() => {
    onStoppRef.current = onStopp;
  }, [onStopp]);

  /**
   * ★★★ ABBRUCH VON AUSSEN (Schreibprobe, 09.09.2026).
   *
   * Meldet, was in der ANGEFANGENEN Zeile schon steht, und friert den Lauf ein.
   * Der Aufrufer hängt die Session danach aus und zeigt sein Ergebnis.
   *
   * ⚠️ `stoppSignal` ist ein Zähler, und der Effekt hängt NUR an ihm: Stünden
   * `onStopp` oder `index` in der Abhängigkeitsliste, feuerte er bei jedem
   * Anschlag neu.
   */
  const stoppRef = useRef(stoppSignal ?? 0);
  useEffect(() => {
    const jetzt = stoppSignal ?? 0;
    if (jetzt === stoppRef.current) return;
    stoppRef.current = jetzt;
    if (jetzt <= 0) return;
    itemStart.current = null;
    /*
      ★ STEHT DIE SESSION ZWISCHEN ZWEI ZEILEN, ist die angefangene Zeile leer
      (11.09.2026): Die fertige ist über `onItemDone` schon gemeldet, `index`
      zeigt aber noch auf ihr Ende. Bis dahin zählte ein Stopp in der Pause sie
      ein zweites Mal - nachgestellt: 2 statt 0 Zeichen. In der Tippchallenge
      ist das eine Wertung.
    */
    const zwischenZeilen = zeilenwechselRef.current;
    pufferRef.current = [];
    zeilenwechselRef.current = false;
    wartetAufNachschubRef.current = false;
    /*
      ★ F1c: Das Zuhören der angefangenen Zeile - auch das seit dem letzten
      Anschlag. Wer beim Abpfiff gerade der Zeilenansage zuhörte, hat seither
      nicht getippt, also gewartet; auf der festen Uhr von Match und Challenge
      darf ihm das nicht fehlen. Steht die Session in der Zeilenwechsel-Pause,
      ist die Zeit seit dem Ende der vorigen Zeile Zeit der App.
    */
    const stoppAt = Date.now();
    let restZuhoeren = 0;
    if (!zwischenZeilen && lastTs.current !== null) {
      const roh = Math.max(0, stoppAt - lastTs.current);
      restZuhoeren = Math.min(roh, Math.max(0, spokenMs() - lastSpokenSnapshot.current));
    }
    const pauseBisJetzt =
      zeilenuhrRef.current && uhrLaeuft.current && zeileFertigAt.current !== null
        ? Math.max(0, stoppAt - zeileFertigAt.current)
        : 0;
    onStoppRef.current?.({
      chars: zwischenZeilen ? 0 : index,
      errors: zwischenZeilen ? 0 : zeilenFehler,
      // Zeilenzeit wie in handleComplete (Bauplan F1/F1b) - siehe zeilenzeit.ts.
      ms: zwischenZeilen ? 0 : Math.max(0, lineMs.current),
      letters: [...lineEvents.current],
      wartezeitMs: zwischenZeilen ? 0 : waitMs.current + restZuhoeren,
      zeilenwechselMs: zwischenZeilen ? pauseBisJetzt : wechselPauseMs.current,
    });
    lineEvents.current = [];
    messer.verwerfen(); // Schritt M: die angefangene Zeile wird kein Ereignis
    vonAussenGestoppt.current = true; // EN1: die Karte danach schweigt (siehe dort)
    {
      const a = accuracyOf(sum.current.chars, sum.current.errors);
      const v = cpmOf(sum.current.chars, sum.current.ms);
      zieheKartenVarianten(a, roundStars(a, v, istWortspiel(contextId) ? 0 : (speedTarget ?? 0)));
    }
    setPhase("summary");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stoppSignal]);


  /*
   * ★★★ DER GROSSSCHREIBUNGS-HINWEIS - genau EINMAL (Johannes 31.08.).
   *
   * Solange die Umschalttaste nicht freigeschaltet ist, gilt die
   * Auto-Grossschreibung: Der kleine Buchstabe zählt, das grosse Zeichen steht
   * trotzdem da (`useTypingItem.ts`, `acceptLowerForUpper`). Für ein Kind sieht
   * das aus wie ein Widerspruch - es sucht die Umschalttaste, die es noch gar
   * nicht gibt.
   *
   * ★ ER KOMMT VOR DEM ERSTEN VERSUCH, nicht danach. Sobald eine Zeile mit
   * einem Grossbuchstaben ansteht, wird erklärt - das verhindert die
   * Verwirrung, statt sie hinterher aufzulösen.
   *
   * ★ NICHT, wenn die Umschalttaste schon gelernt ist (dann gilt das Gegenteil)
   * und nicht, wenn schon ein anderes Fenster offen steht.
   */
  useEffect(() => {
    if (phase !== "run" || shiftLearned || merkfenster) return;
    // ★★ NICHT beim Öffnen der Runde, sondern wenn der Schreibpunkt WIRKLICH
    //    auf dem Grossbuchstaben steht (31.08.2026, gemessen).
    //
    //    Die erste Fassung sah die ganze Zeile an und öffnete das Fenster,
    //    sobald irgendwo ein Grossbuchstabe vorkam - also sofort beim Aufbau.
    //    Damit riss sie den Fokus aus dem Tippfeld, kaum dass es da war, und
    //    brach die gemessene Regel Nr 10 der Fokusziele („eine Serie öffnen
    //    führt in das Tippfeld des Lesers"). In der Bücherei fängt fast jede
    //    Geschichte mit einem Grossbuchstaben an - es traf also praktisch
    //    jeden Einstieg.
    //
    //    Jetzt wartet es, bis das Kind dort ANKOMMT. Das ist auch inhaltlich
    //    der richtige Augenblick: Die Frage „wo ist die Umschalttaste?"
    //    stellt sich genau dann, nicht vorher.
    // ★★ ERST AB DEM ZWEITEN ZEICHEN DER ZEILE (31.08.2026, zweite Messung).
    //
    //    Steht der Grossbuchstabe an POSITION 0, ist der Schreibpunkt schon
    //    beim Aufbau dort - das Fenster ginge also wieder sofort auf und risse
    //    den Fokus aus dem Tippfeld (Regel Nr 10 der Fokusziele: „eine Serie
    //    öffnen führt in das Tippfeld des Lesers"). In der Bücherei fängt fast
    //    jede Geschichte mit einem Grossbuchstaben an.
    //
    //    Das ist keine Notlösung, sondern näher an dem, wonach Johannes
    //    gefragt hat: „einmaliges Popup bei GROSSGESCHRIEBENEN WÖRTERN" - also
    //    bei den Hauptwörtern mitten im Satz. Dass ein Satz gross anfängt,
    //    verwirrt kein Kind; dass „Hund" mitten im Satz gross wird, schon.
    if (index === 0) return;
    const zeichen = zeileJetzt[index];
    // ★ S3 (26.09.2026): jeder Großbuchstabe, auch „É" (vorher nur A-Z Ä Ö Ü).
    if (!zeichen || !/\p{Lu}/u.test(zeichen)) return;
    if (grossschreibungGesehen()) return;
    merkeGrossschreibungGesehen();
    setMerkfenster({
      ...grossschreibungFenster(skin, bedienRef.current.sprache, anrede),
      mitHaken: false,
      art: "gross",
    });
    // `merkfenster` bewusst NICHT in den Abhängigkeiten: Das Schliessen des
    // Fensters soll es nicht sofort wieder aufmachen - der Merker verhindert
    // das zwar ohnehin, aber ein Effekt, der sich selbst auslöst, ist eine
    // Falle für den Nächsten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeileJetzt, index, phase, shiftLearned, skin, anrede]);

  // Rotes Aufblinken des aktuellen Zeichens bei Fehlern.
  useEffect(() => {
    if (wrongTick === 0) return;
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 320);
    return () => window.clearTimeout(t);
  }, [wrongTick]);

  // Sprachausgabe nach gewählter Granularität (Mehrfachauswahl Buchstaben/Wörter/
  // Sätze): Zeilenanfang erst der ganze SATZ, dann das erste WORT, dann (nur falls
  // ohne Wort) der BUCHSTABE; Wortanfang mitten in der Zeile das Wort; sonst der
  // Buchstabe — nacheinander (speakSequence). Das Vertippen wird gesondert angesagt
  // (onWrong: der zu tippende Buchstabe), unabhängig von der Granularität.
  //
  // BEWUSST IN ZWEI EFFEKTE GETEILT (Wunsch Johannes: nach dem automatischen
  // Zeilenwechsel soll die neue Zeile SOFORT vorgelesen werden — das war vorher
  // unzuverlässig):
  //
  // (1) ZEILENANFANG — an qi + expected gekoppelt (NICHT an index). So feuert es
  //     genau einmal je Zeile und liest IMMER ab Position 0, egal ob der Cursor
  //     beim Wechsel für einen Moment noch auf der alten (Zeilenende-)Position
  //     steht. Greift auch für die erste Zeile einer neuen Runde.
  useEffect(() => {
    if (phase !== "run" || !voiceEnabled) return;
    // Inhaltswechsel ankündigen: springt die neue Zeile von echten Wörtern auf
    // Unsinn (oder zurück), vorher „Achtung …" sagen (Wunsch Johannes). Beim ersten
    // Vorlesen einer Runde (prev = null) wird noch nichts angekündigt.
    // Ohne Etikett wird nichts angekündigt (siehe `arten`).
    const art = arten?.[qi];
    const klasse = art ? ansageSchluesselFuerZeilenart(art) : null;
    const prev = prevNonsenseRef.current;
    prevNonsenseRef.current = klasse;
    const warn =
      klasse && prev !== null && prev !== klasse
        ? ansageFuerZeilenart(art as ZeilenArt, vorleseLang)
        : null;
    /*
      ★ Zeilenende mit Enter: HIER bewusst NICHT mit „\n" - dieser Effekt liest
      nur den ZEILENANFANG (immer `index = 0`: das erste Wort oder, bei
      „sentences", die ganze Zeile als EIN Satz). Die Eingabetaste ist nie der
      Anfang einer Zeile; sie wird angesagt, sobald der Cursor sie erreicht
      (Effekt unten, an `index`). Ein „\n" hier würde nur den Satz-Vergleich
      unten (`satzLaeuftRef`) verfälschen, ohne dass es je etwas anzusagen gäbe.
    */
    const plan = readPlanAt(
      expected,
      0,
      { letters: tastenAnsage === "naechste", words: readWords, sentences: readSentences, shiftLearned, lang: vorleseLang, zeileGanz },
      // echtes Wort → ganzes Wort; Übungssilbe → buchstabieren. Sprachbewusst:
      // im Englisch-Modus darf „öl" kein Wort sein (siehe lexicon.ts).
      istWort,
    );
    // Die Warnung wird der Lese-Reihe VORANGESTELLT (eine speakSequence, damit die
    // Reihenfolge „Achtung …" → Zeile erhalten bleibt; speakUi würde sie abschneiden).
    const full = warn ? [warn, ...plan] : plan;
    // Nur ein GANZER Satz wird vor dem Abwürgen geschützt (`satzAusreden`) -
    // `readPlanAt` stellt ihn als ersten Teil voran.
    satzLaeuftRef.current =
      plan[0] === expected ||
      (zeileGanz && plan[0] === zeileGanzSprechtext(expected, shiftLearned, vorleseLang));
    if (full.length) speakSequence(full);
    // Lese-Granularität bewusst NICHT in den Abhängigkeiten: ein Umschalten der
    // Granularität soll nicht mitten in der Zeile den ganzen Satz neu vorlesen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, expected, phase, voiceEnabled]);

  // (2) CURSOR WANDERT WEITER — nur MITTEN in der Zeile (index > 0). Position 0
  //     übernimmt der Zeilenanfang-Effekt oben (sonst doppelte Ansage).
  /**
   * ★★★★★ DAS ERSTE ZEICHEN EINER ZEILE (03.09.2026 abends).
   *
   * Johannes am iPad: *„zudem spricht sie das erste Zeichen einer Zeile
   * nicht."* Stimmt - und der Grund liegt in der Bauart: Die Ansage der
   * nächsten Taste hängt am ANSCHLAG. Am Zeilenanfang hat aber noch niemand
   * getippt, also gab es nichts, woran sie hängen konnte. Ein Kind stand vor
   * einer neuen Zeile und wusste nicht, womit sie anfängt.
   *
   * ★ Nur für den Screenreader-Weg. Ist das eigene Vorlesen an, liest der
   *   Zeilenanfang-Effekt darüber ohnehin - dort wäre das die zweite Stimme.
   *
   * ⚠️ MIT ABSTAND. Beim Zeilenwechsel steht kurz zuvor „Geschafft." im
   * Live-Bereich; ohne Verzögerung überschriebe die neue Ansage sie, und das
   * Lob einer geschafften Zeile ginge unter.
   */
  useEffect(() => {
    if (phase !== "run" || voiceEnabled) return;
    // ⚠️ Dieselbe Regel wie beim Anschlag (09.09.2026): nur bei „Buchstabieren".
    if (tastenAnsage !== "naechste") return;
    const text = screenreaderAnsage(0);
    if (!text) return;
    const t = window.setTimeout(() => announce(text, vorleseLang), 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, expected, phase, voiceEnabled, tastenAnsage]);

  useEffect(() => {
    if (phase !== "run" || !voiceEnabled || index <= 0) return;
    // ★ Tippchallenge: den Satz vom Zeilenanfang nicht abwürgen (`satzAusreden`).
    if (satzSprichtNoch()) return;
    const plan = readPlanAt(
      // ★ Zeilenende mit Enter: siehe die Begründung oben am Zeilenanfang-Effekt.
      // ★ W2a (D-6): die Zeile, wie sie JETZT dasteht.
      zeilenEndeAktivRef.current ? zeileJetzt + "\n" : zeileJetzt,
      index,
      { letters: tastenAnsage === "naechste", words: readWords, sentences: readSentences, shiftLearned, lang: vorleseLang, zeileGanz },
      istWort,
    );
    /*
     * ★★★★★ „sofort" - Johannes am iPad, 03.09.2026 abends:
     * *„sofort wenn eine Taste gedrückt wird muss die nächste angesagt
     * werden."* Gemessen hatte er fast eine Sekunde.
     *
     * Diese Ansage gehört zum Anschlag und ist eine Zehntelsekunde später
     * veraltet - sie darf nicht im Ruhefenster warten, bis das Kind innehält.
     * ⚠️ Nur DIESE. Der Zeilenanfang oben bleibt „ersetzbar": Eine ganze Zeile
     * vorzulesen ist keine Quittung auf einen Anschlag.
     */
    if (plan.length) speakSequence(plan, "sofort");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // „Ins Eingabefeld springen" — per Tastenkürzel (Alt+E) aus der Seite heraus
  // UND nach jedem Escape (die Regel „Esc holt immer die Eingabezeile",
  // focusField.ts). Eine Anforderung, die kam, während dieses Feld noch gar
  // nicht im Baum stand (nach der Statistik lädt der Trainer erst seinen
  // Spielstand), wird beim Erscheinen NACHGEHOLT — sonst verhallt genau das
  // Escape, das aus einer ganzseitigen Ansicht zurückführt.
  useEffect(() => {
    const focusField = () => {
      if (modalOverlayOpen()) return; // Bühne offen → Fokus dort lassen
      const el = fieldRef.current;
      if (!el) return;
      clearPracticeFocusRequest();
      el.focus();
    };
    window.addEventListener(FOCUS_FIELD_EVENT, focusField);
    if (takePracticeFocusRequest()) focusField();
    return () => window.removeEventListener(FOCUS_FIELD_EVENT, focusField);
  }, []);

  // „Wie viele Zeilen von wie vielen?" — per Tastenkürzel (Alt+Z): kurz
  // einblenden UND auf die Braillezeile schreiben (immer, auch wenn TTS an ist).
  useEffect(() => {
    const onAnnounce = () => {
      const total = items.length;
      const current = Math.min(qi + 1, total);
      const b = bedienRef.current;
      // ★ EN1: In Tastenflow in der Bedienungssprache - Zeile UND Stimme.
      const msg = ansageZeilenstand(current, total, b.bereichAktiv ? b.sprache : "de");
      brailleFlash(msg); // immer auf Braillezeile — Person fragt aktiv nach
      if (b.bereichAktiv) sprichBedienungRef.current(msg);
      else speakUi(ansageZeilenstand(current, total, vorleseLang));
      setProgressFlash(true);
      window.setTimeout(() => setProgressFlash(false), 1900);
    };
    window.addEventListener("tippen-announce-progress", onAnnounce);
    return () =>
      window.removeEventListener("tippen-announce-progress", onAnnounce);
  }, [qi, items.length]);

  // Übezeit schnell ausgeben — per Tastenkürzel (Alt+D): auf die Braillezeile
  // schreiben (immer) UND ansagen + kurz als Pill einblenden.
  useEffect(() => {
    const onAnnounceTime = () => {
      const ms = getPracticeMs();
      // Seit 25.08.2026 sagt Alt + D auch den Wochenziel-Stand an: Wochenziel
      // und Restminuten hatten bis dahin ÜBERHAUPT keine Ansage - sie standen
      // nur als Ringe da. Kein neues Kürzel nötig; wer nach der Zeit fragt,
      // meint dasselbe Thema. Ohne gesetztes Ziel bleibt es beim alten Satz.
      const ziel = wochenzielAnsage();
      const b = bedienRef.current;
      if (b.bereichAktiv) {
        // ★ EN1: In Tastenflow ist alles in der Bedienungssprache - auch
        // der Wochenziel-Satz, den der Ring in derselben Sprache hinterlegt
        // (`WeeklyGoalRings`). Zeile und Stimme sagen dasselbe.
        const satz = ansageUebezeit(formatPracticeSpoken(ms, b.sprache), ziel, b.sprache);
        brailleFlash(satz);
        sprichBedienungRef.current(satz);
      } else {
        const msg = ansageUebezeit(formatPracticeSpoken(ms, "de"), ziel, "de");
        brailleFlash(msg); // immer auf Braillezeile — Person fragt aktiv nach
        // Das Wochenziel kommt fertig aus der Anzeige und ist deutsch - im
        // Englisch-Modus bleibt es deshalb weg statt halb übersetzt zu klingen.
        speakUi(
          ansageUebezeit(
            formatPracticeSpoken(ms, vorleseLang),
            vorleseLang !== "de" ? null : ziel,
            vorleseLang,
          ),
        );
      }
      const display = formatPracticeTime(ms);
      setTimeFlash(display);
      window.setTimeout(() => setTimeFlash(null), 1900);
    };
    window.addEventListener("tippen-announce-time", onAnnounceTime);
    return () =>
      window.removeEventListener("tippen-announce-time", onAnnounceTime);
  }, []);

  // Übungs-/Spielstufe anzeigen — per Tastenkürzel (Alt+L): kurz einblenden +
  // ansagen.
  //
  // ★ Der Text kommt FERTIG aus dem Trainer (`AdaptiveTrainer`
  // baut ihn als `${copyFor(stufe).progressLabel} ${level}`, also z. B.
  // „Übungsstufe 3") — hier wird nichts mehr davorgesetzt. Bis 22.08.2026 stand
  // hier ein festes „Spielstufe: " davor: Gesehen wurde „📊 Übungsstufe 3",
  // gehört und auf der Braillezeile gelesen aber „Spielstufe: Übungsstufe 3".
  // Genau den Widerspruch sollte die Korrektur vom 30.07. beseitigen; er war
  // nur an die zweite Stelle gewandert (K34 — zwei Sichten, zwei Wahrheiten).
  useEffect(() => {
    const onLevel = (e: Event) => {
      const label = (e as CustomEvent<string>).detail ?? "";
      if (!label) return;
      const msg = label;
      brailleFlash(msg);
      // ★ EN1: Der Text kommt in Tastenflow schon in der Bedienungssprache
      // aus dem Trainer - also auch mit deren Stimme.
      sprichBedienungRef.current(msg);
      setLevelFlash(label);
      window.setTimeout(() => setLevelFlash(null), 1900);
    };
    window.addEventListener("tippen-announce-level", onLevel);
    return () => window.removeEventListener("tippen-announce-level", onLevel);
  }, []);

  // Aktuelle Aufgabe wiederholen — per Tastenkürzel (Alt+W): die aktuelle Zeile
  // auf der Braillezeile ausgeben + ansagen, damit man sie nochmal hören kann.
  useEffect(() => {
    const onAnnounceTask = () => {
      if (!expected) return;
      brailleFlash(expected, vorleseLang);
      speakUi(expected);
    };
    window.addEventListener("tippen-announce-task", onAnnounceTask);
    return () => window.removeEventListener("tippen-announce-task", onAnnounceTask);
  }, [expected, vorleseLang]);

  // Einfach losschreiben: Wer irgendwo auf der Seite eine normale Taste drückt
  // (kein Bedienfeld im Fokus), landet automatisch im Tippfeld — der erste
  // Anschlag zählt schon. So muss man nicht erst mit der Maus hineinklicken.
  useEffect(() => {
    if (phase !== "run") return;
    const onDocKey = (e: KeyboardEvent) => {
      // ★ 23.09.2026: auch ein AltGr-Zeichen (`@`, `€`) holt das Feld.
      if (!istZeichenAnschlag(e)) return;
      // Liegt die Expeditions-Bühne (o. a. modaler Dialog) über dem Trainer, gehört die
      // Taste dorthin — das Tippfeld darf sie nicht abfangen und den Fokus stehlen.
      if (modalOverlayOpen()) return;
      const field = fieldRef.current;
      if (!field) return;
      const ae = document.activeElement;
      if (ae === field) return; // schon im Feld → das Feld behandelt die Taste
      const tag = (ae?.tagName ?? "").toLowerCase();
      if (["input", "select", "textarea", "button"].includes(tag)) return;
      if (voiceEnabled) primeSpeech(); // Vorlesen in der Geste freischalten
      // ★ F3-pl: Option + Buchstabe (Mac, Polnisch) ist ein Zeichen - die Alt-Kürzel am Fenster nicht auslösen.
      if (istAltGrBuchstabe(e)) e.stopPropagation();
      field.focus();
      tasteAnnehmen(e); // diesen ersten Anschlag nicht verschlucken
    };
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [phase, tasteAnnehmen, voiceEnabled]);

  // Cursor (auf der Braillezeile = Punkt 7 + 8) ans NÄCHSTE zu tippende Zeichen
  // setzen. Das echte (nur-lese) Tippfeld trägt die GANZE Zeile als Wert; die
  // Auswahl-Position bestimmt, wo Screenreader + Braillezeile den Cursor zeigen.
  const syncCaret = useCallback(() => {
    const el = fieldRef.current;
    if (!el) return;
    try {
      // ★ Um den Vorspann versetzt (Zeitstand der Tippchallenge): Der Zeiger
      // gehört an das nächste zu TIPPENDE Zeichen, und das beginnt hinter ihm.
      const ab = zeilenPraefix.length + index;
      el.setSelectionRange(ab, ab);
    } catch {
      /* Umgebung ohne Selektions-API (z. B. Test) */
    }
  }, [index, zeilenPraefix.length]);
  useLayoutEffect(() => {
    if (phase !== "run") return;
    // Fokus VOR setSelectionRange: ein ungefokussiertes Feld quittiert
    // setSelectionRange auf manchen Browsern still; danach setzt focus() den
    // Cursor ans Zeilenende — auf der Braillezeile kurz als zweiter, falscher
    // Cursor sichtbar. Synchron in useLayoutEffect (vor dem Paint) bleibt kein
    // Zwischenzustand, den NVDA lesen könnte.
    const el = fieldRef.current;
    // Nicht ins Tippfeld ziehen, solange ein modaler Dialog (Expeditions-Bühne) offen
    // ist — sonst reißt ein beiläufiger Re-Render (z. B. der Wochenziel-Poll) den Fokus
    // mitten im Spiel aus der Bühne zurück (Johannes 15.07.).
    if (
      el &&
      document.activeElement !== el &&
      !modalOverlayOpen() &&
      // Nr 27: nicht aus dem offenen Einstellungs-Bereich herausreißen.
      !fokusStehtInDenEinstellungen() &&
      // … und nicht vom Sprachschalter, der gerade neue Zeilen gebracht hat.
      !fokusStehtAufDemSprachschalter()
    )
      el.focus();
    syncCaret();
    // ⚠️ `zeilenPraefix` gehört NICHT in diese Liste - siehe den Effekt darunter.
    // ★ W2a (D-6): `zeileJetzt` - eine angepasste Zeile ist ein neuer Wert im
    //   Feld; der Schreibzeiger muss danach wieder an seine Stelle.
  }, [syncCaret, expected, zeileJetzt, qi, phase]);
  /*
   * ★★★ DER VORSPANN SETZT DEN ZEIGER, ER HOLT KEINEN FOKUS (11.09.2026).
   *
   * Gemessen im Klassenmatch: Der Vorspann trägt die Uhr (`P2 3:45 `) und
   * ändert sich jede Sekunde. Solange er in der Liste oben stand, zog der
   * Effekt dort den Fokus jede Sekunde zurück ins Feld - wer mit Tab den Knopf
   * „Verlassen" erreichte, stand nach etwa einer Sekunde wieder in der
   * Eingabezeile. In der Tippchallenge (Uhr im Vorspann) ebenso.
   *
   * Den Fokus holt die Session weiter bei neuer Zeile, neuer Runde und
   * Phasenwechsel. Ändert sich NUR der Vorspann, wird nur der Schreibzeiger neu
   * gesetzt: Mit dem neuen Feldwert stellt der Browser ihn ans Ende, auf der
   * Braillezeile gehört er an das nächste zu tippende Zeichen. Steht der Fokus
   * gerade woanders, holt `onFocus` das beim Zurückkommen ohnehin nach.
   * Wächter: `tests/tastenflow-anschlaege-zeilenwechsel.test.tsx` (6).
   */
  useLayoutEffect(() => {
    if (phase !== "run") return;
    syncCaret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeilenPraefix]);

  // ★ Zeilenende mit Enter: nach dem letzten Zeichen ist die Eingabetaste
  // „die nächste Taste" - genau wie in `naechsteTasteAnsagen` oben.
  // ★ W2a (D-6): gemessen an der Zeile, wie sie JETZT dasteht.
  const nextChar =
    zeilenEndeAktivRef.current && index === zeileJetzt.length ? "\n" : zeileJetzt[index];
  const finger = nextChar ? fingerForChar(nextChar) : null;
  // Braucht das nächste Zeichen (schon gelernt) überhaupt eine Umschalttaste?
  // Sonst genügt dank Auto-Großschreibung der kleine Buchstabe (kein Hinweis).
  const needsShiftNow = !!nextChar && shiftLearned && needsShift(nextChar);
  // Eine bestimmte Umschalt-SEITE wird nur bei aktiver Gegenhand-Regel angesagt;
  // bei „Einhand schreiben" bleibt der Hinweis neutral („+ Umschalttaste").
  const shiftSide =
    needsShiftNow && enforceShiftHand ? shiftHandFor(nextChar) : null;
  /** ★ W1 (F6): kommt das nächste Zeichen über eine Totaste? (auf jeder Tastatur) */
  const kombiNext =
    nextChar && nextChar !== " " && nextChar !== "\n" ? kombizeichenZu(nextChar, activeLayout()) : undefined;

  // Schlanker „Auto-Großschreibung"-Hinweis: nur solange die Umschalttaste noch
  // NICHT gelernt ist UND in der Zeile ein Großbuchstabe steht — der erscheint
  // dann „von selbst", der kleine Buchstabe genügt (siehe AutoCapHint).
  // ★ S3 (26.09.2026): jeder Großbuchstabe, auch „É" (vorher nur A-Z Ä Ö Ü).
  const autoCapActive = !shiftLearned && /\p{Lu}/u.test(expected);

  // Finger-Hinweis (welche Taste mit welchem Finger) — sitzt jetzt MITTIG in der
  // Leiste über dem Tippfeld (vorher unter dem Feld).
  const fingerHint = nextChar
    ? nextChar === " "
      ? st.leertasteDaumen
      : // ★ Zeilenende mit Enter (23.09.2026): eigener, fester Satz - wie bei
        // der Leertaste kein „Taste X: Finger Y", sondern EIN fester Hinweis.
        nextChar === "\n"
        ? st.eingabetasteFinger
        : kombiNext
          ? st.fingerHinweisTotaste(totastenHinweisFuer(kombiNext, bedienSprache, st, shiftSide, needsShiftNow))
          : st.fingerHinweis(nextChar, finger, shiftSide, needsShiftNow)
    : st.fertig;

  // AUSNAHME (E7, §2.7): Die Übungszeile hat ihren EIGENEN Zoom (Alt + / -)
  // und ist von der Schriftgrössen-Regel des Reviers ausdrücklich ausgenommen.
  // Tippfeld-Schrift wächst mit dem Zoom-Schalter über dem Feld; Tastatur und
  // Hinweise bleiben in fester Größe (nur das Tippfeld soll größer werden).
  const promptSize = `${(2.4 * zoom).toFixed(2)}rem`;
  // ★ Wie viele Seitenzeilen bis zum unteren Fensterrand passen - neu gemessen,
  // wenn das Fenster oder der Inhalt darüber die Größe ändert.
  useLayoutEffect(() => {
    const messen = () => {
      const kasten = zeilenKastenRef.current;
      const feld = fieldRef.current;
      if (!kasten || !feld || typeof window === "undefined") return;
      const r = kasten.getBoundingClientRect();
      const cs = getComputedStyle(kasten);
      const rand = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const schriftPx = parseFloat(getComputedStyle(feld).fontSize) || 0;
      const n = seitenZeilenImFenster(window.innerHeight, r.top + window.scrollY, rand, schriftPx);
      setSeitenZeilenPlatz((alt) => (alt === n ? alt : n));
    };
    messen();
    window.addEventListener("resize", messen);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(messen);
      ro.observe(document.documentElement);
    }
    return () => {
      window.removeEventListener("resize", messen);
      ro?.disconnect();
    };
  }, [promptSize]);

  // Session-Kennzahlen für die Abschluss-Karte. Das Tempo zählt die GANZE Runde
  // (inkl. Pausen) — wer mittendrin pausiert, ist langsam und bekommt keine
  // 3 Sterne. Sterne = Mittel aus Treffsicherheit und Tempo (gegen das Ziel).
  const acc = accuracyOf(sum.current.chars, sum.current.errors);
  const speed = cpmOf(sum.current.chars, sum.current.ms);
  // Dieselbe Rechnung wie beim Speichern (oben, `finalStars`): ein Wortspiel
  // wertet nur die Treffsicherheit. Bis 25.09. zeigte die Karte hier weniger
  // Sterne, als gespeichert wurden.
  const stars = roundStars(acc, speed, istWortspiel(contextId) ? 0 : (speedTarget ?? 0));
  // ★ 25.09.2026 (Testerin): Bei „100 %" kein Satz über Genauigkeit oder „ruhiger" -
  // die Bemerkungen für 1 und 2 Sterne widersprächen der Zahl daneben.
  const remark = bedien.summaryRemark(
    Math.round(acc * 100) >= 100 ? 3 : stars,
    kartenVariante.current.bemerkung,
  );
  const celebrate = stars >= 3 || !!leveledUp || !!newBadges?.length;

  // Belohnungs-Klang + Ansage beim Eintritt in die Abschluss-Karte (einmal je
  // Runde). Bei Stufenaufstieg der besondere Aufstiegs-Klang (Wunsch #3).
  useEffect(() => {
    if (phase !== "summary") return;
    /*
      ★★ EN1 (19.09.2026): NACH EINEM STOPP VON AUSSEN SCHWEIGT DIE KARTE.
      Den Stopp gibt es nur in Tippchallenge und Klassenmatch (`stoppSignal`).
      Beide zeigen danach ihre EIGENE Auswertung und sagen sie an
      (`SchreibprobeErgebnis`, `KlassenmatchErgebnis`) - die Übungs-Ansage
      davor („Super! 3 Sterne erreicht!") war ein Überbleibsel: Sterne gibt es
      dort nicht (kein `speedTarget`), und zwei Ergebnis-Ansagen hintereinander
      verdrängen einander. Klang und Ansage fallen darum weg.
    */
    if (vonAussenGestoppt.current) return;
    let badgeTimer: number | undefined;
    if (!suppressRewardSound) {
      playStarReward(stars, { levelUp: !!leveledUp });
      // Neues Abzeichen: eigener „Ta-daa"-Jingle NACH dem Sterne-Klang (kurz
      // versetzt, damit die Klänge nicht übereinanderliegen). Bei laufender
      // Freischalt-Fanfare (suppressRewardSound) bewusst still — die Abzeichen
      // stehen dann trotzdem in Karte + Ansage.
      // Lese-Abzeichen (Bücherei) haben einen EIGENEN Klang — Umblättern statt
      // Fanfare —, damit blinde Kinder sofort hören, wofür es kam.
      if (newBadges?.length) {
        const fuersLesen = newBadges.some(isStoryBadge);
        badgeTimer = window.setTimeout(
          fuersLesen ? playStoryBadgeSound : playBadgeSound,
          900,
        );
      }
    }
    // Altersgerechte Ansage mit BEIDEN erreichten Werten + Sternzahl. Wird auf
    // die Live-Region geschrieben (Screenreader/Braillezeile) UND — falls
    // Vorlesen an ist — laut gesprochen, damit blinde Kinder das Ergebnis hören.
    // Neue Abzeichen werden mit NAMEN genannt — für blinde Kinder ist die
    // Ansage das Abzeichen (höchstens 3 nennen, sonst wird es ein Vortrag).
    // ★ EN1: In Tastenflow spricht die Karte in der BEDIENUNGSSPRACHE -
    // sie steht in dieser Sprache da, und Satz, Abzeichen-Namen und Stimme
    // gehören zusammen. Die Rat-Sätze (`hinweis`) liefert der Trainer dann in
    // derselben Sprache. Ohne aktiven Sprachbereich: die Vorlese-Sprache, wie bisher.
    const ansageLang: Lang = bereichAktiv ? bedienSprache : vorleseLang;
    const badgeSpoken = ansageNeueAbzeichen(
      (newBadges ?? []).slice(0, 3).map((b) => badgeName(b, skin, bedienSprache)),
      newBadges?.length ?? 0,
      sober,
      ansageLang,
    );
    const spoken =
      (leveledUp ? ansageAufstieg(sober, ansageLang) : "") +
      starsSpokenFor(copy, stars, ansageLang, kartenVariante.current.titel) +
      badgeSpoken +
      ansageWerte(fmtPercent(acc, bedienSprache), speed, ansageLang) +
      // Der Rat kommt NACH den Zahlen: erst das Ergebnis, dann was als Nächstes
      // hilft. Und die Ankündigung der Übungszeilen ganz zuletzt, damit ein Kind
      // nicht von Unsinnwörtern überrascht wird (Wunsch Johannes 28.08.2026).
      (hinweis ? " " + hinweis : "") +
      (naechsteRundeHinweis ? " " + naechsteRundeHinweis : "");
    announce(spoken);
    // Satz und Stimme gehören zusammen - in Tastenflow die Stimme der Bedienung.
    if (bereichAktiv) speakUi(spoken, undefined, undefined, bedienSprache);
    else speakUi(spoken);
    return () => {
      if (badgeTimer) window.clearTimeout(badgeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /**
   * ★★★ F1 (Johannes 31.08.2026) — DIE ABSCHLUSS-KARTE HÄLT DEN FOKUS FEST.
   *
   * Gemessen wurde: Nach jeder geschafften Runde OHNE neue Taste sprang der
   * Fokus auf „Weiter" — den einzigen Tabstopp der Karte. Von zwölf
   * Tab-Schritten führten elf hinaus, der erste ins Impressum, und Escape tat
   * gar nichts: `zurueckInsProgramm()` endet mit `focusPracticeField()`, und
   * das Tippfeld steht in dieser Phase nicht mehr im Baum — die Anforderung
   * verpuffte. Ein Kind mit Blindheit stand danach ohne Anhaltspunkt in der
   * Fusszeile. (Beleg: `pruefstand/kind/befunde/gegenpruefung.md` Nr 7,
   * `befunde/medaillen.md` B7, Messläufe `protokolle/f1-abschlusskarte-*.txt`.)
   *
   * Johannes' Entscheidung, alle drei Punkte:
   *  1. Der Fokus steht beim Erscheinen auf dem TEXT der Karte (der
   *     Überschrift, `tabIndex={-1}`) — nicht auf „Weiter". Das Kind soll
   *     zuerst hören, WAS es geschafft hat, statt „Weiter, Schalter".
   *     ⚠️ Damit gewinnt die Überschrift auch gegen den Selbst-Fokus des
   *     Geschichten-Angebots (`StoryOffer`): Der Angebots-Knopf bleibt der
   *     erste Tabstopp, EIN Tab genügt — aber angesagt wird zuerst das
   *     Ergebnis der Runde.
   *  2. Escape tut dasselbe wie „Weiter": weiterüben.
   *  3. Tab läuft in der Karte im Kreis, vorwärts wie rückwärts. Der Preis ist
   *     ausdrücklich in Kauf genommen: Solange die Karte steht, sind Hilfe,
   *     Zahnrad und Konto nicht per Tab erreichbar (die Kürzel bleiben).
   *
   * ★★★ AM 31.08.2026 EIN ZWEITES MAL BESTÄTIGT und damit erledigt. Aus einer
   * Nachbarsitzung kam die Auslegung, die Karte solle „durchlässig" sein, also
   * ohne Falle. Vorgelegt wurden Johannes drei Wege; seine Antwort: „A - Karte
   * schliessen, dann kommt man raus." Die Falle BLEIBT, der Weg hinaus ist
   * Escape oder „Weiter" (beide gehen durch `weiterUeben` und landen in der
   * Eingabezeile).
   *
   * ⚠️ WER SIE WIEDER MELDET, hat diese Zeilen nicht gelesen: Ohne Falle kommt
   * der gemessene Befund F1 zurück - 11 von 12 Tab-Schritten führten aus der
   * Karte hinaus, der erste ins Impressum, und ein Kind mit Blindheit stand
   * danach in der Fusszeile. Das ist eine begründete Bauart, kein Befund.
   *
   * Beides ruht, solange ein eigenes Fenster über der Karte liegt
   * (`ueberlagert`) — die Freischalt-Feier bringt Falle und Escape selbst mit
   * (`UnlockCelebration`), und zwei Fallen zerren am selben Fokus.
   */
  const karteHaeltFokus = phase === "summary" && !ueberlagert;
  useFocusTrap(karteHaeltFokus, summaryRef, { initialFocus: summaryTitelRef });
  // Über ein Ref, damit der Effekt nur an `karteHaeltFokus` hängt und nicht bei
  // jedem Render neu aufgesetzt wird (dieselbe Bauart wie in UnlockCelebration).
  const onRetryRef = useRef(onRetry);
  onRetryRef.current = onRetry;
  /*
   * ★★ JW-17, Teil 2 (Johannes 31.08.2026): „Weiter" macht DASSELBE wie Escape -
   * Karte schliessen und in die Eingabezeile springen.
   *
   * Bis dahin riefen beide nur `onRetry()`. Das startet die neue Runde, setzt
   * aber KEINEN Fokus - es blieb der Hoffnung überlassen, dass das neu
   * gebaute Tippfeld ihn von selbst holt. Genau diese Hoffnung ist am 22.08.
   * schon einmal gescheitert (Nr 19 der Fokusziele: „ausdrücklich in die
   * Eingabezeile, statt zu hoffen"). `setTimeout(0)`, weil das Feld im selben
   * Takt noch nicht im Baum steht.
   *
   * ★ EINE Stelle für beide Wege - sonst driften Escape und „Weiter"
   * auseinander, und genau das ist die Fehlerklasse, die dieses Programm im
   * August sechsmal getroffen hat.
   */
  const weiterUeben = useCallback(() => {
    onRetryRef.current();
    window.setTimeout(() => focusPracticeField(), 0);
  }, []);
  useEffect(() => {
    if (!karteHaeltFokus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") weiterUeben();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [karteHaeltFokus, weiterUeben]);

  if (phase === "summary") {
    return (
      <div className="space-y-4">
        {topSlot}
        <div
          ref={summaryRef}
          className="card relative space-y-4 overflow-hidden p-6 text-center"
        >
          {leveledUp && (
            // Kein role="status" — der Aufstieg wird bereits über die assertive
            // Live-Region angesagt (sonst doppelte Ansage auf der Braillezeile).
            <div className="tt-levelup mx-auto inline-flex items-center gap-2 rounded-xl border border-accent bg-accent-soft px-3 py-2 font-semibold text-ink">
              <span aria-hidden="true">🎉</span>{" "}
              {st.aufstieg(sober)}
            </div>
          )}
          {/* Das Fokus-Ziel der Karte (F1): anspringbar, aber KEIN zusätzlicher
              Tab-Halt — dieselbe Bauart wie die Bücherei-Überschrift
              (`SerienTrainer.tsx`, „Geschichten & Wissen"). */}
          <h3
            ref={summaryTitelRef}
            tabIndex={-1}
            className="m-0 text-xl font-semibold text-ink outline-none"
          >
            {bedien.summaryTitle(stars, kartenVariante.current.titel)}
          </h3>
          {/* Großer Stern-Knall: Sterne ploppen kurz riesig auf. */}
          <div
            className="relative flex justify-center gap-3 py-1"
            aria-label={st.sterne(stars)}
            role="img"
          >
            {celebrate && <span aria-hidden className="tt-ring" />}
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className={
                  "tt-star " + (i < stars ? "text-warning" : "text-ink-muted/40")
                }
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {i < stars ? "★" : "☆"}
              </span>
            ))}
          </div>
          {remark && <p className="m-0 text-ink-soft">{remark}</p>}
          {/* NEU verdiente Abzeichen — als große Medaillen mit Namen + Bedingung.
             (Angesagt werden sie bereits über die Live-Region, daher hier ohne
             eigene role="status" — sonst doppelte Braillezeilen-Meldung.) */}
          {!!newBadges?.length && (
            <div className="space-y-1.5">
              <p className="m-0 text-sm font-semibold uppercase tracking-wide text-accent">
                {st.neueAbzeichen(newBadges.length)}
              </p>
              <div className="flex flex-wrap items-start justify-center gap-3" role="list">
                {newBadges.map((b) => (
                  <Hinweisflaeche
                    key={b.id}
                    role="listitem"
                    className="inline-flex max-w-[7.5rem] flex-col items-center gap-1 text-center"
                    // ★ EN1: Seit EN3 ist der Abzeichen-Katalog auch englisch
                    // (`badgesEn.ts`) - das `lang="de"` von damals ist weg.
                    // ★ N15c: Hinweisflaeche statt `title` - groß und sofort,
                    // die Karte ist kein Tabstopp.
                    hilfe={badgeBeschreibung(b, bedienSprache, lernweg)}
                  >
                    <BadgeMedal def={b} size={76} />
                    <span aria-hidden="true" className="text-sm font-semibold text-ink">
                      {badgeName(b, skin, bedienSprache)}
                    </span>
                    <span className="sr-only">
                      {badgeName(b, skin, bedienSprache)}: {badgeBeschreibung(b, bedienSprache, lernweg)}
                    </span>
                  </Hinweisflaeche>
                ))}
              </div>
            </div>
          )}
          {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl` - die Spannweite der
              Schriftgrössen im Revier wird auf 14 bis 20 px eingeschnürt. */}
          <div className="flex justify-center gap-6 text-ink">
            <div role="group" aria-label={st.treffsicherheitName(fmtPercent(acc, bedienSprache))}>
              <p className="m-0 text-xl font-bold" aria-hidden="true">
                {fmtPercent(acc, bedienSprache)}
              </p>
              <p className="m-0 text-sm text-ink-muted" aria-hidden="true">
                {st.treffsicherheit}
              </p>
            </div>
            <div
              role="group"
              aria-label={st.tempoName(speed)}
            >
              <p className="m-0 text-xl font-bold" aria-hidden="true">
                {speed}
              </p>
              <p className="m-0 text-sm text-ink-muted" aria-hidden="true">
                {st.anschlaegeMin}
              </p>
            </div>
          </div>
          {speedTarget && speedTarget > 0 && (
            <p className="m-0 text-sm text-ink-muted">
              {st.tempoZiel(Math.round(speedTarget))}
            </p>
          )}
          {/* Rückmeldung und Ankündigung: KEIN role="status" — beides steht
              schon in der assertiven Ansage oben (sonst doppelt auf der
              Braillezeile). Sie stehen VOR den Knöpfen, damit sie beim
              Durchtabben vor „Weiter" kommen. */}
          {hinweis && (
            <p className="m-0 rounded-xl border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
              {hinweis}
            </p>
          )}
          {naechsteRundeHinweis && (
            <p className="m-0 text-sm text-ink-muted">{naechsteRundeHinweis}</p>
          )}
          {/* Der endSlot steht VOR „Weiter": Dort sitzt seit 28.07. der
              angekündigte Geschichten-Hauptweg, und der soll die erste (und
              fokussierte) Wahl sein — „lieber weiter üben" daneben. Ohne endSlot
              bleibt alles wie vorher. */}
          <div className="flex flex-wrap justify-center gap-2">
            {endSlot}
            {/* Kein `autoFocus` mehr (F1, 31.08.2026): Den Anfangsfokus setzt
                seit der Fokus-Falle die Überschrift der Karte. Ein zweiter
                Fokus-Setzer daneben wäre genau die Doppelung, die einander
                nicht kennt. */}
            <button type="button" className="btn-secondary" onClick={weiterUeben}>
              {retryLabel ?? bedien.retry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    /*
     * ★★★ DIE KENNZEICHEN DER GEMEINSAMEN BAUART (§13). Wer sie setzt, bekommt
     * die Lesestelle (§6.2) und den Fokus-Wächter (§3) ohne eine weitere Zeile
     * Code; wer sie weglässt, bekommt nichts davon.
     *
     * ★ Was in Tastenflow eine „Aufgabe" ist, ist die ZEILE - sie wechselt,
     * und genau beim Wechsel kann der Fokus verloren gehen. Der Schlüssel zählt
     * darum mit ihr mit: Steht das Kind in Zeile 7 und verschwindet sein Feld
     * unter den Fingern, sucht der Wächter das Ersatzziel in Zeile 7 und nicht
     * am Anfang des Blattes.
     */
    <div className="relative space-y-4" data-aufgabe={`zeile-${qi + 1}`}>
      {progressFlash && (
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
            {st.zeileVon(Math.min(qi + 1, items.length), items.length)}
          </span>
        </div>
      )}
      {timeFlash && (
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
            ⏱ {timeFlash}
          </span>
        </div>
      )}
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
      {topSlot}
      {/* Die Stand-Zeile (Stufe, Übezeit, Wochenziel, nächste Taste) - sie
         blendet sich beim Tippen aus. Siehe StandZeile.tsx. */}
      {standSlot}
      {/* Tippfeld — ein echtes Textfeld: Die GANZE Zeile steht im Wert, der
         System-Cursor (auf der Braillezeile = Punkt 7 + 8) sitzt am nächsten zu
         tippenden Zeichen. Sehende sehen die farbige Zeile als Overlay darüber; der
         eigentliche Text + Cursor des Felds sind unsichtbar (transparent). Live-
         Region meldet Treffer/Fehler an Screenreader.

         Barrierefreiheit (Wunsch Johannes): Auf der Braillezeile soll NUR der Text
         stehen. Darum KEIN beschreibendes aria-label (sonst klebt dessen Text vor
         der Zeile) und KEIN readonly (NVDA zeigte sonst „sef" = schreibgeschütztes
         Eingabefeld; ohne readonly nur das schlichte Eingabefeld). Damit trotzdem
         nichts eingetippt/eingefügt werden kann, sind Eingaben über onBeforeInput/
         onPaste/onDrop unterbunden (onKeyDown verarbeitet die Anschläge selbst). */}
      {/* overflow-hidden: Das (für die Cursor-/Lupenposition) horizontal
         verschobene Spiegel-Eingabefeld unten ist `w-full` und ragt beim
         Zentrieren sonst über die Karte hinaus → die ganze Seite wird seitlich
         scrollbar und das Tippbild „verrutscht" beim Schreiben. Der Fokus-Ring
         ist ein Box-Shadow der Karte selbst und bleibt davon unberührt. */}
      {/* ⚠️ KEIN `overflow-hidden` auf DIESER Ebene: Ein überlaufverstecktes
         Element ist ein Scroll-Behälter. Das Eingabefeld wird beim Zentrieren
         weit nach rechts verschoben (`translateX`), und der Browser scrollt
         den Behälter, um das fokussierte Feld sichtbar zu halten - dabei
         wanderte die Kopfzeile mit nach links aus dem Bild (der Finger-Hinweis
         war beim Tippen unsichtbar, gefunden im Probelauf 25.08.2026). Das
         Verstecken sitzt darum eine Ebene tiefer, beim Feld selbst. */}
      {/* ★ Z4 (19.09.2026): `data-rundgang` - der Bereich „Übungszeile" des
          Rundgangs beim ersten Betreten (`components/typing/Rundgang.tsx`). */}
      <div
        ref={karteRef}
        data-rundgang="uebungszeile"
        className="card rounded-2xl focus-within:ring-4 focus-within:ring-accent"
      >
        {/* KOPFZEILE DES FELDES (25.08.2026): Der Finger-Hinweis und der
           Zeilen-Fortschritt standen bis dahin in einer eigenen Leiste ÜBER
           dem Feld - zusammen mit den Zoom-Knöpfen, die man einmal im Leben
           einstellt. Die Leiste ist weg: Die Zoom-Knöpfe stehen jetzt in den
           Einstellungen (Alt + O, weiterhin auch Alt + Plus/Minus), und die
           beiden Dinge, die zur laufenden Zeile gehören, sind an das Feld
           herangerückt - kurzer Weg zwischen Anweisung und Schreibstelle.

           Die sichtbare Zahl „1 / 12" ist entfallen: Die Striche daneben
           zeigen dasselbe, und Alt + Z sagt es an. Für Sprachausgabe und
           Braillezeile steht sie unverändert als sr-only-Text da. */}
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-1.5">
          {/* ★ N15c: Hinweisflaeche statt `title` - keins der beiden Felder ist
             ein Tabstopp, der Hinweis muss also nicht per Fokus erreichbar
             sein, nur gross und sofort bei der Maus. */}
          <Hinweisflaeche
            className="m-0 min-w-0 flex-1 text-ink-soft"
            aria-live="off"
            hilfe={st.fingerTitel}
          >
            {fingerHint}
          </Hinweisflaeche>
          <span className="sr-only">
            {st.zeileVon(qi + 1, items.length)}
          </span>
          <MelodieLadeanzeige text={st.melodieLaedt} />
          {fortschrittSlot ?? (
            <Hinweisflaeche aria-hidden className="tt-ticks shrink-0" hilfe={st.zeilenTitel}>
              {Array.from({ length: items.length }, (_, i) => (
                <span
                  key={i}
                  className={"tt-tick" + (i < qi ? " tt-tick--on" : "")}
                />
              ))}
            </Hinweisflaeche>
          )}
        </div>
        {/* ★★★ `overflow-clip` statt `overflow-hidden` (Johannes 25.08.2026:
           „wenn ich woanders hinklicke, beginnt die Eingabezeile auf einmal
           linksbuendig - woher kommt das?").

           Ursache, gemessen: Das echte Eingabefeld liegt `absolute inset-0`
           ueber dem Kasten und wird von PromptText um dieselbe Strecke
           verschoben wie die sichtbare Zeile (`mirrorRef`), damit der
           unsichtbare Schreibzeiger unter dem aktiven Zeichen sitzt. Dadurch
           ragt es rechts hinaus - hier gemessen 547 px (scrollWidth 1697 bei
           clientWidth 1150). `overflow-hidden` versteckt den Ueberstand zwar,
           macht den Kasten aber zu einem SCROLLBAREN Kasten. Sobald das Feld
           den Fokus bekommt - jeder Klick hinein, jede Rueckkehr per Escape -
           scrollt der Browser den Schreibzeiger ins Bild und setzt
           `scrollLeft` auf genau diese 547 px. Der Scroll hebt die
           Verschiebung Pixel fuer Pixel wieder auf: Die Zeile landet an ihrer
           unverschobenen Stelle, also linksbuendig, und die Mittigkeit
           (Johannes 23.08.) ist weg.

           `overflow: clip` schneidet genauso ab, macht den Kasten aber NICHT
           scrollbar - `scrollLeft` bleibt 0, der Browser kann nichts mehr
           wegschieben. Gemessen: nach dem Fokus `scrollLeft` 0 statt 547, und
           kein Vorfahr und kein Dokument bekommt dadurch waagrechten
           Ueberstand (0 px) - waagrechtes Scrollen ist genau das, was
           Vergroesserung unbrauchbar macht. */}
        <div
          ref={zeilenKastenRef}
          className="relative cursor-text overflow-clip rounded-b-2xl px-5 py-3"
          onClick={() => fieldRef.current?.focus()}
        >
          {/* Rein optisches Overlay (farbige Zeile mit Zeichen-Status). MUSS vor
             Screenreader/Braillezeile verborgen sein (aria-hidden): Sonst steht die
             Zeile DOPPELT in der Braille-Ausgabe — einmal aus diesen <span>s (ohne
             Cursor) und einmal aus dem echten Feld (mit Cursor). Das verwirrt mit
             „zwei Cursorn an verschiedenen Stellen". Der zugängliche Text + Cursor
             kommen ausschließlich aus dem Feld darunter (einem <textarea>, siehe dort). */}
            {/* ★ `data-angabe`: der Text, den das Kind tippt - für die Lesestelle
              der Anker dieser Zeile (§13). Er bleibt `aria-hidden`; gelesen wird
              die Zeile aus dem Feld darunter, wo auch der Schreibzeiger sitzt. */}
        <div
          className="pointer-events-none relative"
          aria-hidden="true"
          data-angabe
          lang={feinesLangAttribut(zeilenLang)}
        >
            {seitenZeilen > 1 ? (
            <PromptSeite
              zeilen={items}
              qi={qi}
              zeileJetzt={zeileJetzt}
              index={index}
              flash={flash}
              fontSize={promptSize}
              mirrorRef={fieldRef}
              showFingerColors={showFingerColors}
              zeichenabstand={zeichenabstand}
              zeilenEnde={zeilenEndeAktivRef.current}
              ausblendZeichen={ausblendZeichen}
              seitenZeilen={seitenZeilen}
            />
            ) : (
            <PromptText
              expected={zeileJetzt}
              index={index}
              flash={flash}
              fontSize={promptSize}
              // Immer mittig (Johannes 23.08.2026), nicht mehr nur bei Vergrößerung.
              centerActive
              mirrorRef={fieldRef}
              showFingerColors={showFingerColors}
              praefix={zeilenPraefix}
              zeichenabstand={zeichenabstand}
              zeilenEnde={zeilenEndeAktivRef.current}
              ausblendZeichen={ausblendZeichen}
              cursorStelle={cursorStelle}
              onZeichenBreite={meldeZeichenBreite}
            />
            )}
          </div>
          {/*
            ★★★★★ EIN TEXTAREA, KEIN INPUT - DAMIT LINKS AUF DER BRAILLEZEILE
            NICHTS VOR DER ZEILE STEHT (Kollegen mit NVDA, 10.09.2026: „auf der
            zeile stehen links unterschiedliche dinge, manchmal nur 'ef' und dann
            auch wieder 'lernen dok spmk Haupt ef' - diese informationen stören
            nur und sollen da nie stehen").

            Das ist NVDAs FOKUSKONTEXT, keine Meldung von uns: das Ende des
            Seitentitels, „dok" (Dokument), „spmk Haupt" (Sprungmarke), „ef"
            (Eingabefeld). Wie viel davon links steht, hängt an der Länge der
            Zeile und daran, ob sich der Kontext geändert hat - darum „manchmal
            nur ef" (UEBERGABE-2026-09-09-DIE-BRAILLEZEILE-BLEIBT-RUHIG §4a).

            ★ Der Hebel liegt in NVDA selbst (nvaccess/nvda, braille/regions/
            textInfo.py und braille/buffers.py): Ist das Feld MEHRZEILIG, setzt
            NVDA den Feldinhalt HART LINKS an den Anfang der Zeile - bei jeder
            Einstellung der Fokuskontext-Darstellung. Rolle und Kontext stehen
            dann links außerhalb der Zeile; wer sie sucht, blättert zurück.

            ⚠️ `aria-multiline="true"` an einem <input> WIRKT NICHT: Chromium
            meldet „mehrzeilig" nur für <textarea> und contenteditable, ein
            <input> ist dort ausdrücklich immer einzeilig (AXObject::IsMultiline).
            Darum das Textarea, mit `rows={1}` und `wrap="off"`: Es bleibt EINE
            Zeile und bricht nie um - ein umbrechendes Feld zerteilte die
            Übungszeile auf der Braillezeile dort, wo der Bildschirm umbricht.

            Der Preis, benannt und gemessen: NVDA sagt beim Hineinkommen
            „Eingabefeld, mehrzeilig" statt „Eingabefeld" - ein Wort, einmal.

            Gemessen mit echtem NVDA 2025.3.3 und einer Zeile mit 40 Zellen:
            vorher „lernen dok spmk Haupt ef jff jj", Cursor auf Zelle 27 -
            nachher nur die Übungszeile, Cursor auf Zelle 1
            (BEFUND-2026-09-10-BRAILLEZEILE-OHNE-KONTEXT.md). Der Wächter dazu:
            tests/tastenflow-braillezeile-ohne-kontext.test.tsx.

            ⚠️ NICHT auf die Wortspiel-Felder übertragen: Dort steht die
            Beschriftung ABSICHTLICH vor dem Feldinhalt (Buchstabensalat: der
            Buchstabenvorrat unter den Fingern, Johannes 02.09.2026).
          */}
          <textarea
            ref={fieldRef}
            // Markiert dieses Feld als die Tipp-Übungsfläche — der globale Alt-
            // Kürzel-Handler in TippenTrainerPage erkennt daran, dass er hier
            // (anders als bei echten Formularfeldern wie der Anmeldung) NICHT
            // greifen soll: Alt-Kombis zählen unten (onKeyDown) ohnehin nie als
            // Anschlag und sollen die Seiten-Kürzel während des Tippens weiter
            // auslösen können.
            data-typing-field="practice"
            // Die Übungssprache - bei aktivem Sprachbereich (siehe `zeilenLang`).
            // ★ E10: „en" wird nur mit dem Probe-Schalter zu „en-GB"/„en-US"
            // (feinesLangAttribut, siehe schreibweise.ts) - ohne ihn bleibt es
            // byte-identisch bei „en".
            lang={feinesLangAttribut(zeilenLang)}
            // ★★★ `data-feld` (§13): das Antwort-Element dieser Zeile. Daran
            // findet der Fokus-Wächter zurück, wenn der Fokus ins Nichts fällt.
            data-feld="tippen"
            rows={1}
            wrap="off"
            value={zeilenPraefix + zeileJetzt}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            onFocus={() => {
            syncCaret();
            // ★ Die Schreibstelle muss zu sehen sein (Probelauf 25.08.2026).
            // Bei starker Vergrößerung bricht die Kopfzeile auf mehrere Zeilen
            // um und schiebt das Feld nach unten; bei 300 % fehlten dann die
            // letzten Pixel. `block: "nearest"` rückt nur, wenn es nötig ist -
            // steht das Feld ohnehin ganz im Bild, passiert gar nichts.
            // Gescrollt wird die KARTE, nicht das Feld: Das Feld ist für die
            // Zeilen-Mitte waagrecht verschoben (translateX), die Karte nicht.
            karteRef.current?.scrollIntoView({ block: "nearest" });
          }}
            // Typografie EXAKT wie die sichtbare Zeile (PromptText): gleiche
            // Schriftgröße/-stärke + Laufweite (die sichtbare Zeile hat tracking-wide
            // ≈0,025em plus 0,06em Innenabstand je Seite und Zeichen ≈0,12em →
            // zusammen ≈0,145em). Nur so liegt der unsichtbare Caret deckungsgleich
            // unter dem aktiven Zeichen; PromptText verschiebt das Feld zusätzlich
            // synchron (mirrorRef).
            // ★★★ „Zeichenabstand groß (CVI)" (E11, 18./19.09.2026): Dieselbe
            // Zusatzstrecke wie `.tt-laufweite` (`(Faktor − 1) × 1ch`) kommt HIER
            // oben auf die Basis-Laufweite drauf - `letterSpacing` fügt sie nach
            // JEDEM Zeichen ein, `gap` zwischen JEDEM Geschwisterpaar: für die
            // Anzahl Zwischenräume VOR dem `index`-ten Zeichen (wo der Caret
            // steht) ist das dieselbe Rechnung. Bei Faktor 1 ("aus") ergibt die
            // Formel wieder genau die alte Zahl.
            // `forcedColorAdjust: none` hält den Rohtext im Windows-Hochkontrast­modus
            // transparent (sonst überdeckte er das farbige Overlay).
            style={{
              forcedColorAdjust: "none",
              fontSize: promptSize,
              // ★ Schreibschrift (09.10.2026): Basis 0 - die sichtbare Zeile steht dann
              // ohne Sperrung und Innenabstand (`.tt-schreibschrift` in index.css).
              letterSpacing: `calc(${schreibschrift ? "0em" : "0.145em"} + (${laufweiteWirksamerFaktor(zeichenabstand)} - 1) * ${LAUFWEITE_CH_JE_STUFE}ch)`,
              lineHeight: 1.375,
              // Den Übergang (`transition`) setzt `PromptText` je Anschlag,
              // gleich wie an der sichtbaren Zeile (Takt des Kindes bei CVI).
              // Das Textarea benimmt sich wie das frühere Eingabefeld: eine
              // Zeile, kein Umbruch, kein Ziehgriff, kein Rollbalken - und genau
              // EINE Zeile hoch, senkrecht mittig im Kasten (`my-auto`), so wie
              // ein <input> seine Zeile von selbst mittig setzt. Sonst säße der
              // Schreibzeiger oben statt auf der Höhe der sichtbaren Zeile
              // (1,5rem = das `py-3` oben und unten).
              resize: "none",
              overflow: "hidden",
              whiteSpace: "pre",
              height: "calc(1.375em + 1.5rem)",
            } as React.CSSProperties}
            // Eingaben blockieren (Tippen/Einfügen/Ziehen), ohne das Feld als
            // „schreibgeschützt" zu kennzeichnen — der Wert bleibt fest die Zeile.
            onChange={() => {}}
            onBeforeInput={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              // Sprachausgabe innerhalb der Geste freischalten (Browser sperren sie
              // sonst): der erste Tastendruck schaltet sie frei, danach klappen auch
              // die automatischen Ansagen. Idempotent.
              if (voiceEnabled) primeSpeech();
              /*
               * ★★★★★ F3-pl (02.10.2026): Option + Buchstabe am Mac „Polish - Pro" (ą ć ę ł ń ó ś ź ż)
               * ist hier ein ZEICHEN, kein Alt-Kürzel (`istAltGrBuchstabe`, `zeichenTaste.ts`). Die
               * Kürzel der Seite hören am Fenster mit und lesen die TASTE (Alt + C „Weiter", Alt + N,
               * Alt + O, Alt + X …) - sie dürfen den Anschlag nicht bekommen. Auf jeder anderen
               * Tastatur ist die Bedingung nie wahr: kein Anschlag ändert sich.
               */
              if (istAltGrBuchstabe(e)) e.stopPropagation();
              // ★ Enter setzt in einem Textarea einen Zeilenumbruch - hier nie:
              // Der Wert bleibt die EINE Übungszeile (oben, warum ein Textarea).
              if (e.key === "Enter") e.preventDefault();
              /*
               * ★★★ 25.09.2026 - DIE KINDER LANDETEN IMMER WIEDER IM IMPRESSUM.
               * Gemessen: aus der Übungszeile führt Tab zu „Tastatur
               * ausblenden", dann „Datenschutz", dann „Impressum" - und das
               * nächste Enter öffnet es. Tab liegt links neben Q; der kleine
               * Finger trifft ihn beim Üben leicht. Buchstaben holen den Fokus
               * zwar zurück („Einfach losschreiben" unten), Enter aber nicht.
               *
               * Johannes' Entscheidung: Tab bleibt in der Zeile. Er wird nur
               * gesagt („Das ist Tab."), zählt nicht als Fehler, und die Zeile
               * springt nicht - darum `sprichBedienung` (achtet „Vorlesen"),
               * kein Live-Bereich (der wäre eine Blitzmeldung auf der
               * Braillezeile). Umschalt + Tab führt weiter nach oben hinaus, und
               * alle Alt-Kürzel gehen weiter - keine Tastaturfalle.
               */
              if (e.key === "Tab" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                sprichBedienungRef.current(DAS_IST_TAB[bedienRef.current.sprache]);
                return;
              }
              // Tastenkürzel (Alt/Strg/Cmd + …) gehören der Seite — nicht als
              // Anschlag werten, sonst zählt z. B. Alt+H als Fehler.
              // ★★★★★ 23.09.2026: AUSSER AltGr (Windows meldet es als Strg +
              // Alt) - sonst waren `@ € { } [ ] | ~` nicht tippbar
              // (`lib/typing/zeichenTaste.ts`).
              if (istKuerzel(e)) return;
              // Umschalttaste zweimal kurz hintereinander → Finger ansagen.
              // ★ E4 (25.09.2026): „Dead" braucht HIER keine eigene Ausnahme -
              // dieser Zweig ist reine Doppel-Umschalt-UI (Fingerhilfe
              // ansagen), keine Wertung. Ein „Dead"-Ereignis fällt einfach
              // durch zu `tasteAnnehmen(e)` unten (wie jede andere Taste
              // ausser Shift) und damit zu `useTypingItem.handleKey`, wo die
              // eigentliche Totasten-Prüfung sitzt (siehe dort).
              if (e.key === "Shift") {
                // Gehaltene Seite merken (links/rechts) für die Gegenhand-Regel.
                const side = shiftSideOfEvent(e);
                if (side) heldShift.current.add(side);
                if (e.repeat) return;
                const now = Date.now();
                if (lastShiftTs.current && now - lastShiftTs.current < 450) {
                  // ★ EN1: In der Bedienungssprache - der Satz steht auch auf
                  // der Braillezeile (Live-Bereich). ★ E11a-5: über eine
                  // Tabelle (`FINGER_ANSAGE_JE_SPRACHE`) - bis dahin bekam
                  // „fr" hier die deutsche Ansage.
                  const fingerAnsage = FINGER_ANSAGE_JE_SPRACHE[bedienRef.current.sprache];
                  /*
                   * ★★★ E4 (25.09.2026, Bauplan §4.3 Punkt 4, §14 E4): ein
                   * zusammengesetztes Zeichen (z. B. „ê") ist auf KEINEM
                   * Layout eine eigene Taste - `fingerGuide`/`fingerGuideEn"
                   * fänden dafür keinen Finger und keine Heimattaste. Die
                   * ZWEI-SCHRITTE-Ansage nennt stattdessen die Totaste UND den
                   * Grundbuchstaben („accent circonflexe, puis e" /
                   * „Zirkumflex, dann e" / „circumflex, then e") - dieselbe
                   * Reihenfolge, in der die Bildschirm-Tastatur sie leuchten
                   * liesse. Nur auf französischen Tastaturen; sonst (und für
                   * jedes normale Zeichen) unverändert die bisherige Ansage.
                   */
                  // ★ W1 (27.09.2026): dazu jeder GROSSBUCHSTABE über eine
                  // Totaste, auf jeder Tastatur - „Ä" auf der Schweizer
                  // Tastatur ist unter Windows ¨, dann Umschalt + A (nicht
                  // mehr die Feststelltaste, BEFUND-2026-09-27-WINDOWS §3.2).
                  const kombiZiel =
                    nextChar &&
                    (hatLehrgangsTotasten(activeLayoutId()) ||
                      grossbuchstabeWeg(nextChar, activeLayout()) === "totaste")
                      ? kombizeichenZu(nextChar, activeLayout())
                      : undefined;
                  const guide = kombiZiel
                    ? totasteAnsage(kombiZiel, bedienRef.current.sprache)
                    : nextChar
                      ? fingerAnsage(nextChar, !enforceShiftHand, lernweg)
                      : "";
                  if (guide) {
                    announce(guide);
                    /*
                     * ★★★★★ NICHT `speakUiAlways` - SONST SPRECHEN ZWEI STIMMEN
                     * (Johannes am iPad, 03.09.2026 abends):
                     *
                     *   „bei VoiceOver am iPad, wenn ich zweimal Umschalt
                     *    drücke, klingt es wie wenn zwei Stimmen sprechen -
                     *    hier spricht dann auch die Vorlese-Stimme mit."
                     *
                     * Genau so war es gebaut: `announce` füllt den Live-Bereich
                     * (der Screenreader spricht) und `speakUiAlways` sprach
                     * ZUSÄTZLICH mit der eigenen Stimme - unabhängig vom
                     * Schalter. Bei „Vorlesen aus" kam damit beides.
                     *
                     * ⚠️ DAS WAR EINMAL RICHTIG. Johannes am 24.08.2026: „Wer
                     * die Umschalttaste ZWEIMAL drückt, bittet ausdrücklich um
                     * die Ansage - sie muss auch kommen, wenn Vorlesen aus
                     * ist." Damals trug der Live-Bereich noch nicht
                     * verlässlich; heute tut er es (gemessen mit echtem
                     * VoiceOver und echtem NVDA, je drei Läufe).
                     *
                     * ★ DIE REGEL DAHINTER, sie gilt überall: Wo `announce`
                     *   schon steht, gehört `speakUi` daneben - NIE
                     *   `speakUiAlways`. Sonst spricht bei „Vorlesen aus"
                     *   jemand doppelt. `speakUiAlways` bleibt dem einen Fall
                     *   vorbehalten, für den es gedacht ist: der Ansage „Vorlesen
                     *   aus", die der Schalter selbst nicht mehr durchliesse.
                     *
                     * Der Preis, benannt: Wer Vorlesen AUS hat und KEINEN
                     * Screenreader, hört hier nichts mehr - sieht den
                     * Fingerhinweis aber über dem Feld und hat ihn auf der
                     * Braillezeile. Die App kann einen Screenreader nicht
                     * erkennen ([[reference_screenreader_nicht_abfragbar]]);
                     * der Vorlesen-Schalter IST die Antwort auf die Frage.
                     */
                    // Fingerhilfe in der Bedienungssprache (ohne aktiven
                    // Sprachbereich: deutsch, mit der Stimme der Vorlese-Sprache).
                    sprichBedienung(guide);
                  }
                  lastShiftTs.current = null;
                } else {
                  lastShiftTs.current = now;
                }
                return;
              }
              // jede andere Taste hebt die „Doppel-Umschalt"-Erkennung auf
              lastShiftTs.current = null;
              tasteAnnehmen(e);
            }}
            onKeyUp={(e) => {
              // Losgelassene Umschalttaste aus der Menge der gehaltenen entfernen.
              // ★ E4 (25.09.2026): „Dead" braucht HIER keine eigene Ausnahme -
              // es gibt kein „gehaltenes Dead" nachzuführen (anders als bei
              // Shift, das man gedrückt HÄLT); die Totasten-Prüfung selbst
              // sitzt in `useTypingItem.handleKey`.
              if (e.key === "Shift") {
                const side = shiftSideOfEvent(e);
                if (side) heldShift.current.delete(side);
                else heldShift.current.clear(); // Seite unbekannt → sicherheitshalber leeren
              }
            }}
            onBlur={() => heldShift.current.clear()}
            // ★ Die Eingabetaste im virtuellen Cursor von JAWS kommt als Klick an und
            // setzt die Einfügemarke auf 0 (gemessen 31.10.2026). Die Stelle gehört dem
            // Kind: zurück an das nächste Zeichen, auch nach einem Mausklick.
            onClick={syncCaret}
            className="tt-uebungsschrift absolute inset-0 my-auto w-full rounded-2xl bg-transparent px-5 py-3 font-legible font-semibold leading-snug text-transparent caret-transparent outline-none"
          />
          {/* ★ 13.11.2026: der volle Punkt (Schreibzeiger) nur bei EINER Zeile -
             auf der Seite wandert der Schreibzeiger selbst. Der hohle Ring
             (Ausblenden) bleibt immer da: er zeigt, ob alles stehen bleibt.
             Rechts unten immer der Punkt für die Zahl der Zeilen. */}
          <ZeilenAnfasser
            nurAusblenden={seitenZeilen > 1}
            stelle={cursorStelle}
            setStelle={setCursorStelle}
            ausblendZeichen={ausblendZeichen}
            setAusblendZeichen={setAusblendZeichen}
            zeichenBreite={zeichenBreite}
            feldRef={fieldRef}
            hilfeZeiger={st.anfasserZeiger}
            hilfeAusblenden={st.anfasserAusblenden(ausblendZeichen)}
          />
          <SeitenAnfasser
            zeilen={seitenZeilen}
            setZeilen={setSeitenZeilen}
            hoechstens={seitenZeilenPlatz}
            feldRef={fieldRef}
            hilfe={st.anfasserSeite(seitenZeilen)}
          />
        </div>
      </div>


      {/* Schlanker Hinweis direkt unter dem Feld: zeigt an, dass die sichtbaren
         Großbuchstaben OHNE Umschalttaste entstehen (Auto-Großschreibung), mit
         Klick-Erklärung. Erscheint nur, wenn das gerade zutrifft — und nicht,
         wenn er bereits im LetterMap-Header (Mein Training) angezeigt wird. */}
      {autoCapActive && !hideAutoCapHint && (
        <div className="flex justify-center">
          <AutoCapHint />
        </div>
      )}
      {/* ★ E4 (25.09.2026, Bauplan §3.2, §14 E4 Punkt 5): Feststelltaste-Hinweis -
         die Hilfszeile unter dem Feld. `aria-hidden`: die Sprachausgabe bekommt
         denselben Satz über die Live-Region (`announceBeimTippen` in `onWrong`),
         nur bei „Buchstabieren an" - genau wie die übrigen kurzen Einblendungen
         hier (Regel 09.09.: die Braillezeile springt nie). */}
      {kurzHinweis && (
        <div className="flex justify-center" aria-hidden="true">
          <p className="m-0 rounded-full bg-surface-sunken px-3 py-1 text-sm font-semibold text-ink">
            {kurzHinweis.zeichen} {kurzHinweis.text}
          </p>
        </div>
      )}
      {/* Umschalt-Hinweis und Tastatur eng zusammen, damit die Tastatur möglichst
         nah unter dem Eingabefeld sitzt (Wunsch: der Zwischenraum war zu groß).
         ★ 11.09.2026: Ein {@link TypingSessionProps.untenSlot} ERSETZT diesen
         ganzen Block - im Klassenmatch steht dort das Ranking (F11). */}
      {untenSlot ?? (
      // ★ Z4: der Bereich „Bildschirm-Tastatur" des Rundgangs (Schalter + Tastatur).
      <div className="space-y-1.5" data-rundgang="tastatur">
        {/* EINE Zeile für beides (Johannes 25.08.2026): der Umschalt-Hinweis und
           der Schalter für die Bildschirm-Tastatur. Der Schalter stand bisher
           eine Zeile tiefer, zusammen mit dem Finger-Farben-Häkchen - und das
           Häkchen ist in die Einstellungen gezogen. Macht unter dem Feld zwei
           Zeilen zu einer. */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <p className="m-0 text-sm text-ink-muted" aria-live="off">
            {st.umschaltZweimal}
          </p>
          {/* ★ N15c: Tipp statt `title` - der Knopf ist ein Tabstopp, der
             Hinweis muss also auch beim Fokus (nicht nur bei der Maus)
             erscheinen. */}
          <Tipp text={st.tastaturTitel}>
            {(hinweisId) => (
              <button
                type="button"
                className="btn-secondary btn-toggle"
                aria-expanded={tastaturOffen}
                onClick={() => setTastaturOffen(!tastaturOffen)}
                aria-describedby={hinweisId}
              >
                <span aria-hidden="true">⌨️</span>{st.tastatur(tastaturOffen)}
              </button>
            )}
          </Tipp>
        </div>

        <KeyboardPanel
          nextChar={nextChar}
          unlocked={unlocked}
          showFingerColors={showFingerColors}
          totasteOffen={totasteOffen}
        />
      </div>
      )}

      {/*
        ★ Das Erklär-Fenster. Es steht als LETZTES im Baum, damit es nichts
        verschiebt, und schliesst immer in die Eingabezeile zurück (Hausregel).
      */}
      {feststelltasteOffen && !merkfenster && (
        <FeststelltasteFenster
          sprache={bedienSprache}
          onSchliessen={() => {
            setFeststelltasteOffen(false);
            window.setTimeout(() => focusPracticeField(), 0);
          }}
        />
      )}
      {merkfenster && (
        <Merkfenster
          titel={merkfenster.titel}
          absaetze={merkfenster.absaetze}
          mitHaken={merkfenster.mitHaken}
          onSchliessen={(nichtMehrZeigen) => {
            if (merkfenster.art === "umschalt" && nichtMehrZeigen)
              setzeUmschaltFensterAus(true);
            setMerkfenster(null);
          }}
        />
      )}

      {/*
        ★ L7 (19.09.2026): Mit „Zeichenabstand groß (CVI)" wird beim Schreiben
        alles ausser dieser Karte abgedunkelt, nach 5 Sekunden ohne Anschlag
        wieder hell. Rein sichtbar - es hört nur mit (`CviAbdunkeln.tsx`).
        Hier, weil JEDE Übungsart diese Karte benutzt (Mein Training,
        Geschichten, Tippchallenge, Klassenmatch, Eigene Übung).
      */}
      <CviAbdunkeln aktiv={zeichenabstand > 1} zielRef={karteRef} />

      {/* Screenreader-Live-Region (beim Laden vorhanden, sonst wird die erste Meldung verschluckt) */}
      <div
        ref={liveRef}
        className="sr-only"
        role="status"
        aria-live="assertive"
      />
    </div>
  );
}
