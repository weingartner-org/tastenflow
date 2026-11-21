/**
 * Die Bühne des FREIEN Spiels (Wunsch Johannes 10.07.): jederzeit „dazwischen"
 * startbar — in „Mein Training" UND im Lektionen-Weg, in jeder Altersstufe
 * (auch „Texte für Erwachsene").
 *
 * Gestartet wird ausschließlich über das Ereignis `tippen-open-freeplay`, das
 * der Knopf „🐧 Spielen" im KOPF DER ÜBUNGSKARTE schickt. Er wanderte zweimal:
 * am 09.08.2026 aus dem Karten-Kopf in die obere Leiste (damit derselbe
 * Einstieg nicht zweimal auf dem Bildschirm stand), und am 22.08.2026 mit dem
 * Wegfall dieser Leiste wieder zurück — jetzt aber NUR NOCH IN DER
 * KINDER-STUFE (Charge „SCHLANK"): Jugend und Erwachsene bekommen keinen
 * freien Spiel-Einstieg mehr angeboten.
 * Zurück geht der Fokus an das Bedienelement, von dem der Start kam (K27) —
 * gibt es das nicht mehr, ins Übungsfeld.
 *
 * Seit E8 (Bauplan) ist das freie
 * Spiel die GANZE Polar-Expedition (ExpeditionJourney) statt des alten
 * Eisschollen-Minispiels: die Reise vom Morgen in die Nacht über alle Zonen,
 * mit Tages-Parcours (dailySeed). Es übt immer die Tasten, die gerade am
 * schwersten fallen, schaltet nichts frei und zählt bewusst NICHT als Übezeit:
 * Die Übezeit-Uhr läuft nur über Anschläge im Tippfeld (notePracticeActivity in
 * TypingSession), und die Reise erzeugt keine Telemetrie-Ereignisse. Reine
 * Motivation.
 *
 * Geschaffte Reisen (Ankunft am Iglu) zählen über {@link recordAdventure} auf
 * die Abzeichen-Familien „Abenteuer" (+ „Trockener Frack"/„Fischfänger") sowie
 * die neuen „Expedition"-Meilensteine (Höhle/Sturm/Station, Polarlicht bei
 * fehlerfreier Gesamtreise); neue Abzeichen bekommen ihren „Ta-daa" + Ansage.
 * Dieser Wrapper ist bewusst dünn — die Reise-Logik liegt in
 * {@link ExpeditionJourney}. Siehe [[project_zehnfinger_trainer]].
 */
import { useEffect, useRef, useState } from "react";
import {
  AdventureResult,
  SHIFT_UNIT,
  Stufe,
  TempoLevel,
  TypingProgress,
  buildFreePlayCourse,
  currentLevel,
  dailySeed,
  ensureIntroduced,
  focusPracticeField,
  masteryForLevel,
  playBadgeSound,
  recordAdventure,
  badgeName,
  skinForStufe,
  speakUiNachLaufender,
  useVoice,
  ansageNeueAbzeichen,
} from "@/lib/typing";
import { useBedienSprache } from "@/lib/bedienSprache";
import { ExpeditionJourney } from "./expedition/ExpeditionJourney";
import type { ZeichenabstandFaktor } from "@/lib/typing/zeichenabstand";
// ★ E1 (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt.
import { lernwegVon } from "@/lib/typing/lernweg";

export interface FloeFreePlayProps {
  /** Aktueller Lernstand (liefert die schwächsten Tasten + Zeit-Fairness). */
  progress: TypingProgress;
  stufe: Stufe;
  /** Start-Anforderung der Lehrkraft (für Zeit-Fairness wie im Training). */
  startTempo?: TempoLevel;
  /**
   * „Zeit lassen" (Eigenschaft des Kindes): Dann hat auch das freie Spiel KEIN
   * Zeitfenster — sonst wäre ausgerechnet die Belohnung wieder ein Wettlauf.
   */
  zeitLassen?: boolean;
  /**
   * Spielstand speichern (Abenteuer-Zähler + neue Abzeichen nach einer
   * geschafften Reise). Fehlt der Callback, wird nichts verbucht.
   */
  onProgress?: (p: TypingProgress) => void;
  /**
   * „Zeichenabstand groß (CVI)" - DERSELBE Wert wie in der Übungszeile
   * (19.09.2026, Johannes: *„… und Spielen, überall"*). Siehe `ExpeditionStage`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
}

/** Ein gestarteter Lauf: die Eingaben werden beim Start EINGEFROREN (ein beiläufiger
 *  Eltern-Re-Render, z. B. der 45-s-Wochenziel-Poll, darf die laufende Reise nicht
 *  neu würfeln — genau der Bug vom 10.07. beim alten Spiel). */
interface RunSnapshot {
  introduced: string[];
  letters: TypingProgress["letters"];
  mastery: ReturnType<typeof masteryForLevel>;
  seed: number;
  uppercase: boolean;
  /** ★ E6a (24.09.2026): der Lernweg dieses Laufs - eingefroren wie alles andere. */
  lernweg: ReturnType<typeof lernwegVon>;
}

export function FloeFreePlay({
  progress,
  stufe,
  startTempo,
  zeitLassen = false,
  onProgress,
  zeichenabstand = 1,
}: FloeFreePlayProps) {
  const voiceEnabled = useVoice((s) => s.enabled);
  // ★ EN3 (19.09.2026): Die neuen Abzeichen nach der Reise heissen in der
  // Bedienungssprache und werden mit deren Stimme angesagt (bei aktivem
  // Sprachbereich - sonst genau der Aufruf von vorher).
  const { sprache, bereichAktiv } = useBedienSprache();
  const [run, setRun] = useState<RunSnapshot | null>(null);
  /** Wer das Spiel geöffnet hat — dorthin geht der Fokus zurück (K27). */
  const openerRef = useRef<HTMLElement | null>(null);
  const isAdult = skinForStufe(stufe) === "erwachsen";
  // Stets frischer Stand für Start + Sieg-Verbuchung (progress wechselt je Rendern).
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const start = () => {
    const p = progressRef.current;
    const introduced = ensureIntroduced(p.introduced, lernwegVon(p));
    const mastery = masteryForLevel(currentLevel(p, startTempo), zeitLassen);
    // Nur öffnen, wenn es überhaupt spielbare Zonen gibt (kein leeres Overlay) —
    // gleiche „ist etwas da?"-Prüfung wie früher der Kurs-Bau.
    // ★ E6a (24.09.2026): der echte Lernweg des Kindes statt der Vorgabe „de" -
    // sonst würde die Reise die wackligsten Zeichen eines Weges „en" nach der
    // deutschen Schwierigkeits-Tabelle einschätzen (z. B. „;" nicht als
    // Grundtaste erkennen, siehe `keyDifficulty` in `letters.ts`). `seed` bleibt
    // 0 wie vorher - diese Prüfung fragt nur „gibt es überhaupt etwas
    // Spielbares", der echte Tages-Seed kommt erst unten in `setRun`.
    if (buildFreePlayCourse(introduced, p.letters, mastery, 0, lernwegVon(p)).stages.length === 0) return;
    // Der Öffner MERKT sich, bevor die Bühne den Fokus an sich zieht.
    const opener = document.activeElement;
    openerRef.current = opener instanceof HTMLElement ? opener : null;
    setRun({
      introduced,
      letters: p.letters,
      mastery,
      seed: dailySeed(),
      uppercase: introduced.includes(SHIFT_UNIT),
      lernweg: lernwegVon(p),
    });
  };
  // Der EINZIGE Einstieg: der „🐧 Spielen"-Knopf (Stand-Zeile bzw. Kopf der
  // Lektions-Karte) schickt dieses Ereignis - seit 31.08.2026 bis 15 Jahre, ab
  // 16 nicht. Über einen Ref, damit der Listener stets die frischen
  // Problem-Tasten nimmt.
  const startRef = useRef(start);
  startRef.current = start;
  useEffect(() => {
    const open = () => startRef.current();
    window.addEventListener("tippen-open-freeplay", open);
    return () => window.removeEventListener("tippen-open-freeplay", open);
  }, []);
  const close = (grund?: "escape") => {
    setRun(null);
    const opener = openerRef.current;
    openerRef.current = null;
    // ★ R6 (Johannes, 22.08.2026): ESCAPE endet IMMER in der Eingabezeile, nie
    // auf dem Auslöser. Bis dahin liefen bei Escape drei Ziele hintereinander
    // los - die Fokus-Falle der Bühne, dieser Öffner-Rückweg und das globale
    // Escape der Seite; auf einer Braillezeile sind das drei Sprünge für einen
    // Tastendruck, von denen nur der letzte stehen bleibt.
    //
    // Über die Knöpfe („Fertig", „Spiel beenden") bleibt es beim Öffner-Rückweg
    // (K27): Der „🐧 Spielen"-Knopf steht sichtbar an derselben Stelle, und von
    // dort aus spielt man die nächste Runde. Ist er weg (Übungsart gewechselt),
    // geht es dorthin, wo weitergeübt wird.
    if (grund !== "escape" && opener && document.contains(opener)) opener.focus();
    else focusPracticeField();
  };

  // Reise geschafft (Iglu): Abenteuer verbuchen; neue Abzeichen hörbar machen (der
  // „Ta-daa" kommt kurz NACH dem Finale-Jubel). Reine Verbuchung — kein Übezeit-Puls.
  const finished = (result: AdventureResult) => {
    if (!onProgress) return;
    const rec = recordAdventure(
      progressRef.current,
      result,
      Date.now(),
      lernwegVon(progressRef.current),
    );
    if (rec.progress !== progressRef.current) onProgress(rec.progress);
    if (rec.newly.length > 0) {
      window.setTimeout(() => {
        playBadgeSound();
        /*
         * ★★★★★ WARTET AUF DEN SCHLUSS-JUBEL (04.09.2026, Testerin Meldung
         * „beim Eisschollenspiel wird die letzte Ansage abgewürgt").
         *
         * Die 1200 ms unten waren als „kurz nach dem Finale-Jubel" gedacht -
         * der Jubel dauert aber rund fünf Sekunden („Zuhause am Iglu - die
         * ganze Reise ohne einen einzigen Fehler …"). Jede neue Ansage
         * schneidet die laufende ab, also hörte das Kind das Abzeichen MITTEN
         * im Satz. Der Klang darf ruhig dazwischen, das WORT nicht.
         *
         * Das Abzeichen ist eine Zugabe zum Jubel, keine Ablösung - darum
         * wartet es, statt zu verdrängen.
         */
        if (voiceEnabled && bereichAktiv)
          speakUiNachLaufender(
            ansageNeueAbzeichen(
              rec.newly.map((b) => badgeName(b, skinForStufe(stufe), sprache)),
              rec.newly.length,
              skinForStufe(stufe) !== "kind",
              sprache,
            ).trim(),
            undefined,
            sprache,
          );
        else if (voiceEnabled)
          speakUiNachLaufender(
            ansageNeueAbzeichen(
              rec.newly.map((b) => badgeName(b, skinForStufe(stufe))),
              rec.newly.length,
              skinForStufe(stufe) !== "kind",
            ).trim(),
          );
      }, 1200);
    }
  };

  return (
    <ExpeditionJourney
      open={run !== null}
      onClose={close}
      introduced={run?.introduced ?? []}
      letters={run?.letters}
      mastery={run?.mastery}
      isAdult={isAdult}
      uppercase={run?.uppercase ?? false}
      voiceEnabled={voiceEnabled}
      noTimePressure={zeitLassen}
      seed={run?.seed ?? 0}
      onComplete={finished}
      zeichenabstand={zeichenabstand}
      lernweg={run?.lernweg ?? "de"}
    />
  );
}
