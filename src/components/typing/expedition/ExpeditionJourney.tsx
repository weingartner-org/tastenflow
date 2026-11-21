/**
 * Reise-Orchestrator der Polar-Expedition (Bauplan-Etappe E7). Der Spiel-Hook
 * {@link useExpedition} ist EINZONIG (Zone/Szene/Ambience global pro Kurs) — deshalb
 * sequenziert diese Schicht die Reise vom Morgen in die Nacht Zone für Zone (Übergabe §4.4,
 * Orchestrator-Ansatz): pro Zone erst das Expeditionstagebuch, dann die Zone als eigener,
 * frisch gemounteter {@link ExpeditionStage} (der getestete Hook bleibt unangetastet), das
 * `onFinished({clean,fish})` einsammeln, weiter zur nächsten — und nach der letzten Zone das
 * Polarlicht-Finale NUR bei einem komplett fehlerfreien Gesamtlauf (§4.6).
 *
 * Freies Spiel = die GANZE Reise (Tages-Seed). Der geschützte Probe-Schritt beim Erstbesuch
 * einer Zone (§4.7) steckt im Hook (`protectFirst`); welche Zone erstmals besucht wird, merkt
 * sich der Browser (localStorage) über Läufe hinweg.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  masteryFor,
  speakUi,
  speakUiDe,
  sprachausgabeBeschaeftigt,
  type AdventureResult,
  type FloeCourse,
  type LetterStat,
  type Mastery,
} from "@/lib/typing";
import {
  EXPEDITION_ZONES,
  buildCaveCourse,
  buildPackeisCourse,
  buildSlideCourse,
  buildStationCourse,
  buildSteilwandCourse,
  buildStormCourse,
  zoneName,
  type Zone,
} from "@/lib/typing/expedition/course";
import { diaryText } from "@/lib/typing/expedition/texts";
import type { Lernweg } from "@/lib/typing/lernweg";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { playAurora, stopAllExpedition } from "@/lib/typing/expedition/audio";
import { useFocusTrap } from "../useFocusTrap";
import { PenguinRig } from "./PenguinRig";
import { ExpeditionStage, type JourneyStageInfo } from "./ExpeditionStage";
import type { ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";
import { AuroraFinale } from "./scenes/AuroraFinale";
import type { HudZone } from "./Hud";
import "./expedition.css";

/**
 * Nach dem Zielerreichen einer Zone: MINDESTENS so lang Pause, dann zieht die Reise
 * weiter (Tempo der Reise - unverändert seit E7, Johannes hat daran nichts auszusetzen
 * gehabt, siehe Punkt 4 unten: „Auf das Spiel hatte das aber keinen Einfluss").
 */
const WIN_HOLD_MS = 2200;
/**
 * ★★★★★ PUNKT 4 (Testerin Durchgang, 20.09.2026) - Johannes: „Im Schneesturm wurde der
 * letzte Satz der Ansage nicht zuende gesprochen. Da muss vermutlich nur die Pause
 * zwischen den Spielen größer sein, damit die Dame noch fertig reden kann. Auf das
 * Spiel hatte das aber keinen Einfluss."
 *
 * BELEG: `handleZoneDone` wechselte bisher nach der FESTEN Frist {@link WIN_HOLD_MS}
 * (2,2 s) sofort die Zone (`setStep`) - unabhängig davon, ob die Ansage aus
 * `arriveFinish` (useExpedition.ts: „Geschafft!" + ggf. der Fische-Satz) da überhaupt
 * fertig gesprochen war. `key={step}` unmountet danach den alten `ExpeditionStage` und
 * mountet den neuen; dessen Zonen-Intro ruft sofort `say(...)`, was jede noch laufende
 * Ansage abwürgt (`cancelIfBusy`, voice.ts). Bei einer längeren Ansage (Fische-Satz,
 * langsamere Sprechrate) reichten 2,2 s nicht - GENAU das „zwischen den Spielen".
 *
 * FIX: {@link handleZoneDone} wartet weiterhin MINDESTENS {@link WIN_HOLD_MS} (das
 * Tempo bleibt, s. o.), aber erst DANACH, wenn `sprachausgabeBeschaeftigt()` (voice.ts)
 * meldet, dass die Stimme wirklich fertig ist - dieselbe robuste Prüfung wie bei
 * `afterIntro` in useExpedition.ts (dort ebenfalls an diesem Tag nachgeschärft). Zwei
 * Sicherheitsnetze: Hat die Stimme (Vorlesen aus) nie gesprochen, wechselt die Zone
 * trotzdem nach der Mindestpause; hängt sie, bricht diese Notbremse spätestens nach
 * {@link SPEECH_WAIT_CAP_MS} durch (dieselbe Zahl wie `VOICE_WAIT_CAP_MS` in
 * useExpedition.ts, dort ausführlich begründet: großzügig genug für jede plausible
 * Ansage, aber die Reise hängt nie für immer an einer verklemmten Engine).
 */
const SPEECH_WAIT_CAP_MS = 10000;
/** localStorage-Schlüssel: welche Zonen wurden schon einmal besucht (Erstbesuch-Erkennung). */
const VISITED_KEY = "px-journey-visited";

export interface ExpeditionJourneyProps {
  open: boolean;
  /** Siehe `ExpeditionStage`: `"escape"` verlangt die Eingabezeile (R6). */
  onClose: (grund?: "escape") => void;
  /** Freigeschaltete Tasten (bestimmt Wörter/Folgen). */
  introduced: readonly string[];
  letters?: Record<string, LetterStat>;
  mastery?: Mastery;
  isAdult?: boolean;
  /** Buchstaben groß anzeigen (erst nach gelernter Umschalttaste). */
  uppercase?: boolean;
  noTimePressure?: boolean;
  voiceEnabled?: boolean;
  /** Tages-Parcours-Seed (variiert Längen/Auswahl, am selben Tag stabil). */
  seed?: number;
  /**
   * Die GANZE Reise geschafft (Ankunft am Iglu): kumulierte Bilanz für die
   * Abzeichen-Verbuchung (`recordAdventure`). Feuert genau einmal beim Finale —
   * clean = kein einziges Scheitern über alle Zonen, fish = Summe der Bonus-Fische,
   * aurora = fehlerfreie Gesamtreise (Polarlicht), zonesCleared = durchquerte Zonen.
   */
  onComplete?: (result: AdventureResult) => void;
  /** „Zeichenabstand groß (CVI)" - an jede Zone weitergereicht (siehe `ExpeditionStage`). */
  zeichenabstand?: ZeichenabstandFaktor;
  /**
   * ★ E6a (24.09.2026, Bauplan §6.3): der Lernweg des Kindes - entscheidet, nach
   * welcher Schwierigkeits-Tabelle die „wackligsten Zeichen" gesucht werden
   * (`keyDifficulty`/`weakestLetters`, `letters.ts`). Vorgabe „de" (wie vor
   * dieser Etappe), falls ein Aufrufer den Weg (noch) nicht kennt.
   */
  lernweg?: Lernweg;
}

/** Den passenden Zonen-Kurs bauen — die ganze Reise spielt im „freien" Stil (§4.9). */
function buildZoneCourse(
  zone: Zone,
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  seed: number,
  lernweg: Lernweg,
): FloeCourse {
  switch (zone.kind) {
    case "climb":
      return buildSteilwandCourse(introduced, letters, mastery, { free: true, seed, lernweg });
    case "cave":
      return buildCaveCourse(introduced, letters, mastery, { seed, lernweg });
    case "storm":
      return buildStormCourse(introduced, letters, mastery, { seed, lernweg });
    case "station":
      return buildStationCourse(introduced, letters, mastery, { seed, lernweg });
    case "slide":
      return buildSlideCourse(introduced, letters, mastery, { free: true, seed, lernweg });
    default:
      return buildPackeisCourse(introduced, letters, mastery, { free: true, seed, lernweg });
  }
}

/** Die schon besuchten Zonen laden (für den Erstbesuch-Probe-Schritt). Fällt still auf leer. */
function loadVisited(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VISITED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

/** Eine Zone als besucht vermerken (best effort — Privatmodus etc. ignorieren). */
function markVisited(kind: string): void {
  try {
    const set = loadVisited();
    set.add(kind);
    window.localStorage.setItem(VISITED_KEY, JSON.stringify([...set]));
  } catch {
    /* localStorage nicht verfügbar — egal, dann ist eben alles „Erstbesuch". */
  }
}

export function ExpeditionJourney({
  open,
  onClose,
  introduced,
  letters,
  mastery,
  isAdult = false,
  uppercase = false,
  noTimePressure = false,
  voiceEnabled = false,
  seed = 0,
  onComplete,
  zeichenabstand = 1,
  lernweg = "de",
}: ExpeditionJourneyProps) {
  const m = mastery ?? masteryFor("normal");
  // ★ EN3: Tagebuch und Reisekarte in der Bedienungssprache.
  const { sprache } = useBedienSprache();
  // ★ E11a-5: über `zoneName` (eine Tabelle je Sprache) statt der Weiche
  // `sprache === "en" ? z.nameEn : z.name`, die „fr" still deutsch gelassen hätte.
  const zonenName = (z: Zone) => zoneName(z, sprache);

  // Die spielbaren Zonen dieser Reise (leere Kurse — z. B. ohne passende Wörter — fallen raus).
  const legs = useMemo(() => {
    return EXPEDITION_ZONES.map((zone) => ({
      zone,
      course: buildZoneCourse(zone, introduced, letters, m, seed, lernweg),
    })).filter((l) => l.course.stages.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introduced, letters, m, seed, lernweg]);

  const total = legs.length;
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<{ clean: boolean; flawless: boolean; fish: number }[]>([]);
  // Erstbesuch-Schnappschuss beim Öffnen (danach nicht mehr ändern — sonst „springt" der
  // Probe-Schritt innerhalb einer Reise, wenn markVisited zwischendurch schreibt).
  const visitedRef = useRef<Set<string>>(new Set());
  const holdRef = useRef<number | null>(null);

  // Beim (Neu-)Öffnen die Reise zurücksetzen und den Besuchs-Schnappschuss ziehen.
  useEffect(() => {
    if (!open) return;
    visitedRef.current = loadVisited();
    setStep(0);
    setResults([]);
    return () => {
      if (holdRef.current !== null) {
        window.clearTimeout(holdRef.current);
        holdRef.current = null;
      }
    };
  }, [open]);

  if (!open || total === 0) return null;

  // Reisekarte-Punkte (alle Beine der Reise; Zustand relativ zum aktuellen Schritt).
  const mapZones: HudZone[] = legs.map((l, i) => ({
    name: zonenName(l.zone),
    timeOfDay: l.zone.timeOfDay,
    state: i < step ? "done" : i === step ? "current" : "todo",
  }));

  // --- Finale nach der letzten Zone (§4.6) --------------------------------------
  if (step >= total) {
    // POLARLICHT (Johannes 14.07.): Es tanzt, wenn KEINE Zone von vorn begonnen werden musste
    // — Fehler sind also verzeihlich (zwei Herzen je Zone), aber beide Herzen zu verlieren
    // kostet die Aurora. `allFlawless` ist die strengere Stufe (kein einziger Fehler auf der
    // ganzen Reise) und trägt das Abzeichen — vorher hieß „clean" bloß „nie die Zeit
    // überschritten", weshalb das Spiel nach beliebig vielen Tippfehlern „fehlerfrei" lobte.
    const allClean = results.length === total && results.every((r) => r.clean);
    const allFlawless = results.length === total && results.every((r) => r.flawless);
    const journeyResult: AdventureResult = {
      clean: allFlawless,
      fish: results.reduce((n, r) => n + r.fish, 0),
      aurora: allClean,
      zonesCleared: legs.map((l) => l.zone.kind),
    };
    return (
      <FinaleOverlay
        allClean={allClean}
        allFlawless={allFlawless}
        isAdult={isAdult}
        voiceEnabled={voiceEnabled}
        onClose={onClose}
        result={journeyResult}
        onComplete={onComplete}
      />
    );
  }

  const leg = legs[step];
  const firstVisit = !visitedRef.current.has(leg.zone.kind);
  // ★ 28.09.2026: mit dem Weg - das Höhlen-Blatt nennt das Wesen nur auf Weg „de".
  const d = diaryText(leg.zone.kind, isAdult, sprache, lernweg);
  const journeyInfo: JourneyStageInfo = {
    index: step,
    total,
    zones: mapZones,
    diary: { zoneName: zonenName(leg.zone), task: d.task, example: d.example, firstVisit },
  };

  // Zone fertig (freier Gewinn) → Ergebnis merken, kurz ausklingen lassen, weiter.
  // Punkt 4 (20.09.2026, s. Konstanten oben): wartet MINDESTENS WIN_HOLD_MS, danach
  // zusätzlich, bis die Ansage aus `arriveFinish` wirklich fertig ist (oder gar nicht
  // erst begann) - statt blind nach einer festen Frist die Zone zu wechseln.
  const handleZoneDone = (result: { clean: boolean; flawless: boolean; fish: number }) => {
    if (holdRef.current !== null) return; // der Hook meldet einmal pro Zone
    markVisited(leg.zone.kind);
    setResults((r) => [...r, result]);
    const t0 = Date.now();
    let sawBusy = false;
    let quiet = 0;
    const tick = () => {
      const busy = sprachausgabeBeschaeftigt();
      if (busy) {
        sawBusy = true;
        quiet = 0;
      } else {
        quiet += 1;
      }
      const elapsed = Date.now() - t0;
      // Fertig gesprochen (oder nie welche gehabt - Vorlesen aus) UND die alte
      // Mindestpause ist um: erst DANN wechselt die Zone.
      const speechDone = !sawBusy || quiet >= 2;
      if (elapsed >= SPEECH_WAIT_CAP_MS || (elapsed >= WIN_HOLD_MS && speechDone)) {
        holdRef.current = null;
        setStep((s) => s + 1);
        return;
      }
      holdRef.current = window.setTimeout(tick, 120);
    };
    holdRef.current = window.setTimeout(tick, 120);
  };

  return (
    <ExpeditionStage
      key={step}
      open
      onClose={onClose}
      course={leg.course}
      free
      isAdult={isAdult}
      uppercase={uppercase}
      noTimePressure={noTimePressure}
      letters={letters}
      mastery={m}
      voiceEnabled={voiceEnabled}
      journey={journeyInfo}
      timeOfDay={leg.zone.timeOfDay}
      protectFirst={firstVisit}
      onFinished={handleZoneDone}
      zeichenabstand={zeichenabstand}
      lernweg={lernweg}
    />
  );
}

/** Skalierung des Rigs im Finale (etwas größer, weil er im Vordergrund jubelt). */
const FINALE_PENGUIN = "translate(560 660) scale(0.62)";

/**
 * ★ Das Finale in beiden Bedienungssprachen (EN3, 19.09.2026). Deutsch
 * wortgleich wie vorher. Glossar §3.6: Polarlicht ⇒ *northern lights*, Iglu ⇒
 * *igloo*; „beim ersten Anlauf" ⇒ *at the first attempt*. Kind warm mit einem
 * Ausrufezeichen, Erwachsene sachlich (§1.5).
 */
export const FINALE_TEXTE = texte({
  de: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Zuhause am Iglu - die ganze Reise ohne einen einzigen Fehler. Schau: das Polarlicht tanzt."
          : "Zuhause am Iglu! Die ganze Reise ohne einen einzigen Fehler - schau, das Polarlicht tanzt!"
        : sauber
          ? erwachsen
            ? "Zuhause am Iglu. Keine Zone musste noch einmal von vorn beginnen - das Polarlicht tanzt."
            : "Zuhause am Iglu! Du hast jede Zone beim ersten Anlauf geschafft - schau, das Polarlicht tanzt!"
          : erwachsen
            ? "Zuhause am Iglu. Was für eine Reise!"
            : "Zuhause am Iglu! Was für eine Reise - gut gemacht!",
    dialogName: (sauber: boolean) => `Polar-Expedition: Finale${sauber ? ", Polarlicht" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Polarlicht-Finale" : "Zuhause am Iglu"),
    bild: (sauber: boolean) =>
      sauber ? "Das Polarlicht tanzt über dem Iglu." : "Zuhause am Iglu, tief in der Nacht.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Die ganze Reise ohne einen Fehler - das Polarlicht tanzt."
          : "Fehlerfrei durch die ganze Reise - schau, das Polarlicht!"
        : sauber
          ? erwachsen
            ? "Jede Zone beim ersten Anlauf - das Polarlicht tanzt."
            : "Jede Zone beim ersten Anlauf geschafft - schau, das Polarlicht!"
          : erwachsen
            ? "Am Ziel angekommen. Was für eine Reise!"
            : "Zuhause am Iglu - was für eine Reise!",
    fertig: "Fertig",
  },
  en: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Home at the igloo - the whole journey without a single mistake. Look: the northern lights are dancing."
          : "Home at the igloo! The whole journey without a single mistake - look, the northern lights are dancing!"
        : sauber
          ? erwachsen
            ? "Home at the igloo. No zone had to start again from the beginning - the northern lights are dancing."
            : "Home at the igloo! You got through every zone at the first attempt - look, the northern lights are dancing!"
          : erwachsen
            ? "Home at the igloo. What a journey!"
            : "Home at the igloo! What a journey - well done!",
    dialogName: (sauber: boolean) => `Polar Expedition: finale${sauber ? ", northern lights" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Northern lights finale" : "Home at the igloo"),
    bild: (sauber: boolean) =>
      sauber ? "The northern lights are dancing over the igloo." : "Home at the igloo, deep in the night.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "The whole journey without a mistake - the northern lights are dancing."
          : "No mistakes on the whole journey - look, the northern lights!"
        : sauber
          ? erwachsen
            ? "Every zone at the first attempt - the northern lights are dancing."
            : "Every zone done at the first attempt - look, the northern lights!"
          : erwachsen
            ? "You have reached the finish. What a journey!"
            : "Home at the igloo - what a journey!",
    fertig: "Done",
  },
  fr: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "De retour à l'igloo - tout le voyage sans une seule erreur. Regarde : l'aurore boréale danse."
          : "De retour à l'igloo ! Tout le voyage sans une seule erreur - regarde, l'aurore boréale danse !"
        : sauber
          ? erwachsen
            ? "De retour à l'igloo. Aucune zone n'a dû recommencer depuis le début - l'aurore boréale danse."
            : "De retour à l'igloo ! Tu as réussi chaque zone du premier coup - regarde, l'aurore boréale danse !"
          : erwachsen
            ? "De retour à l'igloo. Quel voyage !"
            : "De retour à l'igloo ! Quel voyage - bravo !",
    dialogName: (sauber: boolean) => `Expédition polaire : finale${sauber ? ", aurore boréale" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Finale de l'aurore boréale" : "De retour à l'igloo"),
    bild: (sauber: boolean) =>
      sauber ? "L'aurore boréale danse au-dessus de l'igloo." : "De retour à l'igloo, en pleine nuit.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Tout le voyage sans une erreur - l'aurore boréale danse."
          : "Aucune erreur sur tout le voyage - regarde, l'aurore boréale !"
        : sauber
          ? erwachsen
            ? "Chaque zone du premier coup - l'aurore boréale danse."
            : "Chaque zone réussie du premier coup - regarde, l'aurore boréale !"
          : erwachsen
            ? "Tu as atteint le but. Quel voyage !"
            : "De retour à l'igloo - quel voyage !",
    fertig: "Terminé",
  },
  // ★ ES-O (27.09.2026): tú (die Expedition tutea a todo el mundo).
  es: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "De vuelta en el iglú - todo el viaje sin un solo error. Mira: la aurora austral baila."
          : "¡De vuelta en el iglú! Todo el viaje sin un solo error - ¡mira, la aurora austral baila!"
        : sauber
          ? erwachsen
            ? "De vuelta en el iglú. Ninguna zona tuvo que empezar de nuevo - la aurora austral baila."
            : "¡De vuelta en el iglú! Has superado cada zona a la primera - ¡mira, la aurora austral baila!"
          : erwachsen
            ? "De vuelta en el iglú. ¡Qué viaje!"
            : "¡De vuelta en el iglú! ¡Qué viaje - muy bien!",
    dialogName: (sauber: boolean) => `Expedición polar: final${sauber ? ", aurora austral" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Final con aurora austral" : "De vuelta en el iglú"),
    bild: (sauber: boolean) =>
      sauber ? "La aurora austral baila sobre el iglú." : "De vuelta en el iglú, en plena noche.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Todo el viaje sin un error - la aurora austral baila."
          : "Ningún error en todo el viaje - ¡mira, la aurora austral!"
        : sauber
          ? erwachsen
            ? "Cada zona a la primera - la aurora austral baila."
            : "Cada zona superada a la primera - ¡mira, la aurora austral!"
          : erwachsen
            ? "Has llegado a la meta. ¡Qué viaje!"
            : "De vuelta en el iglú - ¡qué viaje!",
    fertig: "Terminado",
  },
  // ★ O-IT (02.10.2026): „aurora boreale", „igloo" (Glossar §2.3); Kind höchstens
  // ein „!", Erwachsene keins (Regel 1); Lob ohne Adjektiv-Endung (Regel 2).
  it: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Di nuovo all'igloo - tutto il viaggio senza un solo errore. Guarda: l'aurora boreale danza."
          : "Di nuovo all'igloo! Tutto il viaggio senza un solo errore - guarda, l'aurora boreale danza."
        : sauber
          ? erwachsen
            ? "Di nuovo all'igloo. Nessuna tappa è dovuta ripartire - l'aurora boreale danza."
            : "Di nuovo all'igloo! Hai superato ogni tappa al primo colpo - guarda, l'aurora boreale danza."
          : erwachsen
            ? "Di nuovo all'igloo. Che viaggio."
            : "Di nuovo all'igloo! Che viaggio - ottimo lavoro.",
    dialogName: (sauber: boolean) => `Spedizione polare: finale${sauber ? ", aurora boreale" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Finale con aurora boreale" : "Di nuovo all'igloo"),
    bild: (sauber: boolean) =>
      sauber ? "L'aurora boreale danza sopra l'igloo." : "Di nuovo all'igloo, in piena notte.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Tutto il viaggio senza un errore - l'aurora boreale danza."
          : "Nessun errore in tutto il viaggio - guarda, l'aurora boreale!"
        : sauber
          ? erwachsen
            ? "Ogni tappa al primo colpo - l'aurora boreale danza."
            : "Ogni tappa superata al primo colpo - guarda, l'aurora boreale!"
          : erwachsen
            ? "Meta raggiunta. Che viaggio."
            : "Di nuovo all'igloo - che viaggio!",
    fertig: "Fatto",
  },
  // ★ O-PL (02.10.2026): „zorza polarna", „igloo", „etap" (Glossar §2.3); Kind höchstens
  // ein „!", Erwachsene keins; Lob als Satz über die Sache, nie über das Kind (Regel 2).
  pl: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Z powrotem przy igloo - cała wyprawa bez ani jednego błędu. Patrz: zorza polarna tańczy."
          : "Z powrotem przy igloo! Cała wyprawa bez ani jednego błędu - patrz, zorza polarna tańczy."
        : sauber
          ? erwachsen
            ? "Z powrotem przy igloo. Żaden etap nie musiał zaczynać się od nowa - zorza polarna tańczy."
            : "Z powrotem przy igloo! Każdy etap udał się za pierwszym razem - patrz, zorza polarna tańczy."
          : erwachsen
            ? "Z powrotem przy igloo. Co za wyprawa."
            : "Z powrotem przy igloo! Co za wyprawa - świetna robota.",
    dialogName: (sauber: boolean) => `Wyprawa polarna: finał${sauber ? ", zorza polarna" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Finał z zorzą polarną" : "Z powrotem przy igloo"),
    bild: (sauber: boolean) =>
      sauber ? "Zorza polarna tańczy nad igloo." : "Z powrotem przy igloo, w środku nocy.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Cała wyprawa bez błędu - zorza polarna tańczy."
          : "Bez błędów przez całą wyprawę - patrz, zorza polarna!"
        : sauber
          ? erwachsen
            ? "Każdy etap za pierwszym razem - zorza polarna tańczy."
            : "Każdy etap za pierwszym razem - patrz, zorza polarna!"
          : erwachsen
            ? "Meta osiągnięta. Co za wyprawa."
            : "Z powrotem przy igloo - co za wyprawa!",
    fertig: "Gotowe",
  },
  // ★ O-TR (02.10.2026): "kutup ışıkları", "iglo", "aşama" (Glossar §2.3); Kind höchstens
  // ein "!", Erwachsene keins (Regel 1).
  tr: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "İgloya döndün - bütün yolculuk tek bir hata olmadan. Bak: kutup ışıkları dans ediyor."
          : "İgloya döndün! Bütün yolculuk tek bir hata olmadan - bak, kutup ışıkları dans ediyor."
        : sauber
          ? erwachsen
            ? "İgloya döndün. Hiçbir aşama baştan başlamak zorunda kalmadı - kutup ışıkları dans ediyor."
            : "İgloya döndün! Her aşamayı ilk denemede geçtin - bak, kutup ışıkları dans ediyor."
          : erwachsen
            ? "İgloya döndün. Ne yolculuktu."
            : "İgloya döndün! Ne yolculuktu - harika iş çıkardın.",
    dialogName: (sauber: boolean) => `Kutup Keşfi: final${sauber ? ", kutup ışıkları" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Kutup ışıklarıyla final" : "İgloya dönüş"),
    bild: (sauber: boolean) =>
      sauber ? "Kutup ışıkları iglonun üstünde dans ediyor." : "Gece yarısı, igloya dönüş.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Bütün yolculuk hatasız - kutup ışıkları dans ediyor."
          : "Bütün yolculuk hatasız - bak, kutup ışıkları!"
        : sauber
          ? erwachsen
            ? "Her aşama ilk denemede - kutup ışıkları dans ediyor."
            : "Her aşamayı ilk denemede geçtin - bak, kutup ışıkları!"
          : erwachsen
            ? "Hedefe ulaşıldı. Ne yolculuktu."
            : "İgloya döndün - ne yolculuktu!",
    fertig: "Bitti",
  },
  // ★ O-CS (03.10.2026): „polární záře", „iglú", „etapa" (Glossar §2.3); Kind höchstens
  // ein „!", Erwachsene keins (Regel 1); keine Vergangenheit der 2. Person (Regel 2) -
  // Sätze über die Sache („Každá etapa vyšla napoprvé").
  cs: {
    ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Zpátky u iglú - celá výprava bez jediné chyby. Podívej: polární záře tančí."
          : "Zpátky u iglú! Celá výprava bez jediné chyby - podívej, polární záře tančí."
        : sauber
          ? erwachsen
            ? "Zpátky u iglú. Žádná etapa nemusela začínat znovu - polární záře tančí."
            : "Zpátky u iglú! Každá etapa vyšla hned napoprvé - podívej, polární záře tančí."
          : erwachsen
            ? "Zpátky u iglú. To byla výprava."
            : "Zpátky u iglú! To byla výprava - skvělá práce.",
    dialogName: (sauber: boolean) => `Polární výprava: finále${sauber ? ", polární záře" : ""}`,
    kopf: (sauber: boolean) => (sauber ? "Finále s polární září" : "Zpátky u iglú"),
    bild: (sauber: boolean) =>
      sauber ? "Nad iglú tančí polární záře." : "Zpátky u iglú, hluboko v noci.",
    status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
      fehlerfrei
        ? erwachsen
          ? "Celá výprava bez chyby - polární záře tančí."
          : "Celá výprava bez chyby - podívej, polární záře!"
        : sauber
          ? erwachsen
            ? "Každá etapa napoprvé - polární záře tančí."
            : "Každá etapa hned napoprvé - podívej, polární záře!"
          : erwachsen
            ? "Cíl splněn. To byla výprava."
            : "Zpátky u iglú - to byla výprava!",
    fertig: "Hotovo",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "У дома при иглуто - цялото пътуване без нито една грешка. Виж: полярното сияние танцува."
            : "У дома при иглуто! Цялото пътуване без нито една грешка - виж, полярното сияние танцува."
          : sauber
            ? erwachsen
              ? "У дома при иглуто. Нито една зона не трябваше да започва отначало - полярното сияние танцува."
              : "У дома при иглуто! Мина всяка зона от първия опит - виж, полярното сияние танцува."
            : erwachsen
              ? "У дома при иглуто. Какво пътуване!"
              : "У дома при иглуто. Какво пътуване - браво!",
      dialogName: (sauber: boolean) => `Полярна експедиция: финал${sauber ? ", полярно сияние" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Финал с полярно сияние" : "У дома при иглуто"),
      bild: (sauber: boolean) =>
        sauber ? "Полярното сияние танцува над иглуто." : "У дома при иглуто, дълбоко през нощта.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Цялото пътуване без грешка - полярното сияние танцува."
            : "Без грешки през цялото пътуване - виж, полярното сияние!"
          : sauber
            ? erwachsen
              ? "Всяка зона от първия опит - полярното сияние танцува."
              : "Всяка зона от първия опит - виж, полярното сияние!"
            : erwachsen
              ? "Целта е достигната. Какво пътуване!"
              : "У дома при иглуто - какво пътуване!",
      fertig: "Готово",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Πίσω στο ιγκλού - όλο το ταξίδι χωρίς ούτε ένα λάθος. Κοίτα: χορεύει το πολικό σέλας."
            : "Πίσω στο ιγκλού! Όλο το ταξίδι χωρίς ούτε ένα λάθος - κοίτα, χορεύει το πολικό σέλας!"
          : sauber
            ? erwachsen
              ? "Πίσω στο ιγκλού. Καμία ζώνη δεν χρειάστηκε να ξεκινήσει από την αρχή - χορεύει το πολικό σέλας."
              : "Πίσω στο ιγκλού! Πέρασες κάθε ζώνη με την πρώτη προσπάθεια - κοίτα, χορεύει το πολικό σέλας!"
            : erwachsen
              ? "Πίσω στο ιγκλού. Τι ταξίδι!"
              : "Πίσω στο ιγκλού! Τι ταξίδι - μπράβο!",
      dialogName: (sauber: boolean) => `Πολική εξερεύνηση: φινάλε${sauber ? ", πολικό σέλας" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Φινάλε με πολικό σέλας" : "Πίσω στο ιγκλού"),
      bild: (sauber: boolean) =>
        sauber ? "Το πολικό σέλας χορεύει πάνω από το ιγκλού." : "Πίσω στο ιγκλού, μέσα στη βαθιά νύχτα.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Όλο το ταξίδι χωρίς λάθος - χορεύει το πολικό σέλας."
            : "Όλο το ταξίδι χωρίς λάθη - κοίτα, το πολικό σέλας!"
          : sauber
            ? erwachsen
              ? "Κάθε ζώνη με την πρώτη προσπάθεια - χορεύει το πολικό σέλας."
              : "Κάθε ζώνη με την πρώτη προσπάθεια - κοίτα, το πολικό σέλας!"
            : erwachsen
              ? "Ο στόχος έφτασε. Τι ταξίδι!"
              : "Πίσω στο ιγκλού - τι ταξίδι!",
      fertig: "Τέλος",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      // Kinder: höchstens ein Ausrufezeichen je Meldung; Erwachsene keines (Glossar hu Regel 1).
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Otthon az iglunál - az egész út egyetlen hiba nélkül. Nézd: táncol a sarki fény."
            : "Otthon az iglunál! Az egész út egyetlen hiba nélkül - nézd, táncol a sarki fény."
          : sauber
            ? erwachsen
              ? "Otthon az iglunál. Egyetlen szakaszt sem kellett elölről kezdeni - táncol a sarki fény."
              : "Otthon az iglunál! Minden szakaszt elsőre teljesítettél - nézd, táncol a sarki fény."
            : erwachsen
              ? "Otthon az iglunál. Micsoda utazás."
              : "Otthon az iglunál! Micsoda utazás - ügyes voltál.",
      dialogName: (sauber: boolean) => `Sarki expedíció: finálé${sauber ? ", sarki fény" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Sarki fény finálé" : "Otthon az iglunál"),
      bild: (sauber: boolean) =>
        sauber ? "Táncol a sarki fény az iglu fölött." : "Otthon az iglunál, késő éjjel.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Az egész út hiba nélkül - táncol a sarki fény."
            : "Hibátlanul az egész úton - nézd, a sarki fény!"
          : sauber
            ? erwachsen
              ? "Minden szakasz elsőre - táncol a sarki fény."
              : "Minden szakasz elsőre sikerült - nézd, a sarki fény!"
            : erwachsen
              ? "Célba értél. Micsoda utazás."
              : "Otthon az iglunál - micsoda utazás!",
      fertig: "Kész",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Thuis bij de iglo - de hele tocht zonder één fout. Kijk: het poollicht danst."
            : "Thuis bij de iglo! De hele tocht zonder één fout - kijk, het poollicht danst."
          : sauber
            ? erwachsen
              ? "Thuis bij de iglo. Geen enkele zone hoefde opnieuw te beginnen - het poollicht danst."
              : "Thuis bij de iglo! Je hebt elke zone in één keer gehaald - kijk, het poollicht danst."
            : erwachsen
              ? "Thuis bij de iglo. Wat een tocht."
              : "Thuis bij de iglo! Wat een tocht - goed gedaan.",
      dialogName: (sauber: boolean) => `Poolexpeditie: finale${sauber ? ", poollicht" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Poollichtfinale" : "Thuis bij de iglo"),
      bild: (sauber: boolean) =>
        sauber ? "Het poollicht danst boven de iglo." : "Thuis bij de iglo, diep in de nacht.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "De hele tocht zonder fout - het poollicht danst."
            : "Foutloos door de hele tocht - kijk, het poollicht!"
          : sauber
            ? erwachsen
              ? "Elke zone in één keer - het poollicht danst."
              : "Elke zone in één keer gehaald - kijk, het poollicht!"
            : erwachsen
              ? "Aangekomen bij het doel. Wat een tocht."
              : "Thuis bij de iglo - wat een tocht!",
      fertig: "Klaar",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Em casa, no iglu - a viagem inteira sem um único erro. Olha: a aurora polar está a dançar."
            : "Em casa, no iglu! A viagem inteira sem um único erro - olha, a aurora polar está a dançar!"
          : sauber
            ? erwachsen
              ? "Em casa, no iglu. Nenhuma zona teve de recomeçar do início - a aurora polar está a dançar."
              : "Em casa, no iglu! Passaste todas as zonas à primeira - olha, a aurora polar está a dançar!"
            : erwachsen
              ? "Em casa, no iglu. Que viagem!"
              : "Em casa, no iglu! Que viagem - muito bem!",
      dialogName: (sauber: boolean) => `Expedição polar: final${sauber ? ", aurora polar" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Final com aurora polar" : "Em casa, no iglu"),
      bild: (sauber: boolean) =>
        sauber ? "A aurora polar dança por cima do iglu." : "Em casa, no iglu, a meio da noite.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "A viagem inteira sem um erro - a aurora polar está a dançar."
            : "Sem erros na viagem inteira - olha, a aurora polar!"
          : sauber
            ? erwachsen
              ? "Todas as zonas à primeira - a aurora polar está a dançar."
              : "Todas as zonas à primeira - olha, a aurora polar!"
            : erwachsen
              ? "Chegada à meta. Que viagem!"
              : "Em casa, no iglu - que viagem!",
      fertig: "Concluído",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Em casa, no iglu - a viagem inteira sem nenhum erro. Veja: a aurora polar está dançando."
            : "Em casa, no iglu! A viagem inteira sem nenhum erro - veja, a aurora polar está dançando!"
          : sauber
            ? erwachsen
              ? "Em casa, no iglu. Nenhuma zona precisou recomeçar do início - a aurora polar está dançando."
              : "Em casa, no iglu! Você passou por cada zona na primeira tentativa - veja, a aurora polar está dançando!"
            : erwachsen
              ? "Em casa, no iglu. Que viagem!"
              : "Em casa, no iglu! Que viagem - mandou bem!",
      dialogName: (sauber: boolean) => `Expedição polar: final${sauber ? ", aurora polar" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Final com aurora polar" : "Em casa, no iglu"),
      bild: (sauber: boolean) =>
        sauber ? "A aurora polar dança sobre o iglu." : "Em casa, no iglu, no meio da noite.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "A viagem inteira sem nenhum erro - a aurora polar está dançando."
            : "Sem erros na viagem inteira - veja, a aurora polar!"
          : sauber
            ? erwachsen
              ? "Cada zona na primeira tentativa - a aurora polar está dançando."
              : "Cada zona vencida na primeira tentativa - veja, a aurora polar!"
            : erwachsen
              ? "Chegada ao destino. Que viagem!"
              : "Em casa, no iglu - que viagem!",
      fertig: "Concluir",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Acasă la iglu - toată expediția fără nicio greșeală. Uite: aurora polară dansează."
            : "Acasă la iglu! Toată expediția fără nicio greșeală - uite, aurora polară dansează."
          : sauber
            ? erwachsen
              ? "Acasă la iglu. Nicio zonă nu a trebuit luată de la capăt - aurora polară dansează."
              : "Acasă la iglu! Ai trecut de fiecare zonă din prima încercare - uite, aurora polară dansează."
            : erwachsen
              ? "Acasă la iglu. Ce expediție!"
              : "Acasă la iglu - ce expediție! Foarte bine.",
      dialogName: (sauber: boolean) => `Expediția polară: finalul${sauber ? ", aurora polară" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Finalul cu aurora polară" : "Acasă la iglu"),
      bild: (sauber: boolean) =>
        sauber ? "Aurora polară dansează deasupra iglului." : "Acasă la iglu, în toiul nopții.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Toată expediția fără nicio greșeală - aurora polară dansează."
            : "Fără greșeli prin toată expediția - uite, aurora polară!"
          : sauber
            ? erwachsen
              ? "Fiecare zonă din prima încercare - aurora polară dansează."
              : "Fiecare zonă reușită din prima încercare - uite, aurora polară!"
            : erwachsen
              ? "Ai ajuns la destinație. Ce expediție!"
              : "Acasă la iglu - ce expediție!",
      fertig: "Gata",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Hemma vid igloon - hela resan utan ett enda fel. Titta: norrskenet dansar."
            : "Hemma vid igloon! Hela resan utan ett enda fel - titta, norrskenet dansar."
          : sauber
            ? erwachsen
              ? "Hemma vid igloon. Ingen zon behövde börja om från början - norrskenet dansar."
              : "Hemma vid igloon! Du klarade varje zon på första försöket - titta, norrskenet dansar."
            : erwachsen
              ? "Hemma vid igloon. Vilken resa."
              : "Hemma vid igloon. Vilken resa - bra jobbat!",
      dialogName: (sauber: boolean) => `Polarexpeditionen: final${sauber ? ", norrsken" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Norrskensfinal" : "Hemma vid igloon"),
      bild: (sauber: boolean) =>
        sauber ? "Norrskenet dansar över igloon." : "Hemma vid igloon, mitt i natten.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Hela resan utan ett fel - norrskenet dansar."
            : "Utan fel genom hela resan - titta, norrskenet!"
          : sauber
            ? erwachsen
              ? "Varje zon på första försöket - norrskenet dansar."
              : "Varje zon klarad på första försöket - titta, norrskenet!"
            : erwachsen
              ? "Framme vid målet. Vilken resa."
              : "Hemma vid igloon - vilken resa!",
      fertig: "Klar",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      ansage: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Вдома біля іглу - уся подорож без жодної помилки. Подивись: танцює полярне сяйво."
            : "Вдома біля іглу! Уся подорож без жодної помилки - подивись, танцює полярне сяйво!"
          : sauber
            ? erwachsen
              ? "Вдома біля іглу. Жодну зону не довелося починати спочатку - танцює полярне сяйво."
              : "Вдома біля іглу! Кожну зону пройдено з першої спроби - подивись, танцює полярне сяйво!"
            : erwachsen
              ? "Вдома біля іглу. Яка подорож!"
              : "Вдома біля іглу! Яка подорож - чудова робота!",
      dialogName: (sauber: boolean) => `Полярна експедиція: фінал${sauber ? ", полярне сяйво" : ""}`,
      kopf: (sauber: boolean) => (sauber ? "Фінал із полярним сяйвом" : "Вдома біля іглу"),
      bild: (sauber: boolean) =>
        sauber ? "Над іглу танцює полярне сяйво." : "Вдома біля іглу, глибока ніч.",
      status: (fehlerfrei: boolean, sauber: boolean, erwachsen: boolean) =>
        fehlerfrei
          ? erwachsen
            ? "Уся подорож без помилки - танцює полярне сяйво."
            : "Уся подорож без помилок - подивись, полярне сяйво!"
          : sauber
            ? erwachsen
              ? "Кожна зона з першої спроби - танцює полярне сяйво."
              : "Кожну зону пройдено з першої спроби - подивись, полярне сяйво!"
            : erwachsen
              ? "Мету подорожі досягнуто. Яка подорож!"
              : "Вдома біля іглу - яка подорож!",
      fertig: "Готово",
    },
});

/**
 * Das Reise-Finale (Bauplan §4.6): „Zuhause am Iglu". Nur bei durchweg fehlerfreiem Lauf
 * (`allClean`) tanzt das Polarlicht und der sphärische Klang erklingt. Eigene, schlanke
 * Overlay-Hülle (role=dialog, Fokusfalle, Escape) — kein Spiel-Hook nötig.
 */
// ★ EN3: exportiert für den Deutsch-Fänger (`tests/tastenflow-englisch-statistik.test.tsx`) -
// das Finale ist sonst nur am Ende einer ganzen Reise zu sehen.
export function FinaleOverlay({
  allClean,
  allFlawless,
  isAdult,
  voiceEnabled,
  onClose,
  result,
  onComplete,
}: {
  /** Keine Zone musste von vorn begonnen werden → das Polarlicht tanzt. */
  allClean: boolean;
  /** Kein einziger Fehler auf der ganzen Reise → nur DANN lobt der Text „ohne Fehler". */
  allFlawless: boolean;
  isAdult: boolean;
  voiceEnabled: boolean;
  onClose: (grund?: "escape") => void;
  result: AdventureResult;
  onComplete?: (result: AdventureResult) => void;
}) {
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = FINALE_TEXTE[sprache];
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  useFocusTrap(true, rootRef, { initialFocus: doneRef, restoreFocus: true });

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current("escape"); // R6: Escape endet in der Eingabezeile
      }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, []);

  // Abenteuer-Bilanz genau EINMAL beim Erreichen des Finales verbuchen (Abzeichen).
  // Über einen Ref, damit ein beiläufiger Re-Render (z. B. Fokus) nicht doppelt bucht.
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  useEffect(() => {
    completeRef.current?.(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ansage (Doppelsprech-Regel) + Polarlicht-Klang nur bei fehlerfreiem Lauf.
  useEffect(() => {
    const text = t.ansage(allFlawless, allClean, isAdult);
    // ★ EN3: in Tastenflow mit der Stimme der Bedienung, sonst genau wie vorher.
    if (voiceEnabled) {
      if (bereichAktiv) speakUi(text, undefined, undefined, sprache);
      else speakUiDe(text);
    }
    else if (alertRef.current) alertRef.current.textContent = text;
    const id = allClean ? window.setTimeout(playAurora, 400) : null;
    return () => {
      if (id !== null) window.clearTimeout(id);
      stopAllExpedition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={rootRef}
      className="px-stage"
      data-time="night"
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogName(allClean)}
    >
      <div ref={alertRef} className="sr-only" role="alert" />
      <div className="px-hud">
        <span className="px-hud__zone">🐧 {t.kopf(allClean)}</span>
      </div>
      <div className="px-viewport" role="img" aria-label={t.bild(allClean)}>
        <AuroraFinale aurora={allClean} penguin={<PenguinRig pose="cheer" transform={FINALE_PENGUIN} />} />
      </div>
      <div className="px-controls">
        <p className="px-status" aria-hidden="true">
          {t.status(allFlawless, allClean, isAdult)}
        </p>
        <button ref={doneRef} type="button" className="px-btn px-btn--action" onClick={() => onClose()}>
          {t.fertig}
        </button>
      </div>
    </div>,
    document.body,
  );
}
