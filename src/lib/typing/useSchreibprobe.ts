/**
 * ★★★ Die SCHREIBPROBE aus der Sicht des KINDES (09.09.2026).
 *
 * Der Haken beantwortet genau eine Frage: *Muss dieses Kind gerade eine
 * Schreibprobe schreiben - und wie weit ist es damit?*
 *
 * ── Warum ein eigener Haken und nicht ein Blick in `cls.settings` ───────────
 * Dieselbe Fehlerklasse wie bei {@link useKlassenRhythmus}: Die Probe hängt an
 * der KLASSE, das Kind hat aber nur seinen Klassencode. Ohne einen gemeinsamen
 * Ort rechnete die Lehrkraft-Sicht mit dem Plan und die Kind-Sicht mit einem
 * zweiten, den sie sich selbst zusammensucht
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Wehrhaft, in beide Richtungen ───────────────────────────────────────────
 * Kein Konto, keine Klasse, kein Netz, ein kaputter Wert: In jedem dieser Fälle
 * kommt „keine Schreibprobe" heraus, und das ist genau das bisherige Verhalten.
 * **Ein Ladefehler darf einem Kind nie eine Prüfung vor die Nase setzen** - und
 * er darf einem Kind, das mitten in einer schreibt, auch nicht die Uhr
 * zurückstellen.
 *
 * ── Der Stand des Kindes überlebt einen Neustart ────────────────────────────
 * ★★★★★ Das ist die Zeile, an der die ganze Sache hängt: Wann dieses Kind
 * BEGONNEN hat, steht im Gerät (localStorage), nicht nur im Speicher. Ein Kind,
 * das mitten in der Prüfung die Seite neu lädt - versehentlich, oder weil der
 * Rechner hakt -, bekäme sonst frische zehn Minuten. Wer den Neustart als
 * Schummelweg offen lässt, hat keine Prüfung gebaut.
 *
 * Und weil ein Gerätespeicher gelöscht werden kann, fragt der Haken zusätzlich
 * den SERVER: Liegt dort schon ein Ergebnis zu dieser Probe, ist das Kind
 * fertig - egal, was das Gerät sagt.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { TypingAccount } from "./account";
import { typingBackend } from "./backend";
import {
  LEBENSZEICHEN_MS,
  LEERER_STAND,
  einstiegBisMs,
  klasseVorbeiMs,
  phaseVon,
  planAusEinstellungen,
  type KindStand,
  type ProbenPhase,
  type SchreibprobePlan,
} from "./schreibprobe";
import { fuersSpeichern, type Probenergebnis } from "./schreibprobeAuswertung";
import { merkeVor } from "./nachsenden";
import { nachsendenJetzt, useAusstehend } from "./useNachsenden";

/**
 * So oft wird die Klasse nachgefragt, solange KEINE Probe läuft (ms).
 *
 * 45 Sekunden. Eine Lehrkraft, die „jetzt starten" drückt, will nicht warten -
 * aber sie steht auch im selben Raum und sagt es. Häufiger zu fragen hiesse,
 * dass jedes Gerät jeder Klasse dauernd am Server hängt; das ist die Last, vor
 * der [[feedback_seminarraum_ist_der_massstab]] warnt: 30 Kinder im selben
 * WLAN sind für den Server EINE Adresse.
 */
const NACHFRAGE_MS = 45_000;

/**
 * Frühestens so lange nach der letzten Nachfrage fragt ein Gerät SOFORT noch
 * einmal nach (Tab sichtbar, Fenster im Fokus, Netz zurück) - ms. Fokus und
 * Sichtbarkeit kommen oft im selben Augenblick; zweimal zu fragen brächte
 * nichts.
 */
export const NACHFRAGE_SOFORT_MIN_MS = 10_000;

/**
 * Über so viele ms wird das sofortige Nachfragen gestreut. Eine Klasse, die auf
 * „Tab wieder vorne" gleichzeitig reagiert (die Lehrkraft sagt „schaut jetzt
 * alle her"), soll den Server nicht in derselben Millisekunde treffen
 * ([[feedback_seminarraum_ist_der_massstab]]).
 */
export const NACHFRAGE_STREUUNG_MS = 1_000;

/** Der Speicherplatz des Kind-Stands im Gerät. */
function standSchluessel(accountId: string, probeId: string): string {
  return `tastenflow:schreibprobe:${accountId}:${probeId}`;
}

function leseStand(accountId: string, probeId: string): Partial<KindStand> {
  try {
    const roh = localStorage.getItem(standSchluessel(accountId, probeId));
    if (!roh) return {};
    const o = JSON.parse(roh) as Record<string, unknown>;
    return {
      beginnMs: typeof o.beginnMs === "number" ? o.beginnMs : 0,
      abgegeben: o.abgegeben === true,
      abgemeldet: o.abgemeldet === true,
      gesehen: o.gesehen === true,
    };
  } catch {
    return {};
  }
}

function schreibeStand(accountId: string, probeId: string, stand: KindStand): void {
  try {
    localStorage.setItem(
      standSchluessel(accountId, probeId),
      JSON.stringify({
        beginnMs: stand.beginnMs,
        abgegeben: stand.abgegeben,
        abgemeldet: stand.abgemeldet,
        gesehen: stand.gesehen,
      }),
    );
  } catch {
    // Kein Speicher (privates Fenster, volle Platte): Dann gilt eben nur der
    // Server-Riegel. Das ist schlechter, aber nicht schlimmer als gar nichts -
    // und es darf die Prüfung nicht verhindern.
  }
}

/**
 * ★★★★★ WAS EIN KIND SCHON GESCHRIEBEN HAT - im Gerät gemerkt.
 *
 * ── Der Befund, aus dem das entstanden ist (09.09.2026, Probelauf im Browser)
 * Ein Neuladen mitten in der Prüfung warf ALLES Geschriebene weg: Die Uhr lief
 * richtig weiter (die stand ja im Gerät), aber die gezählten Zeichen, Fehler
 * und Anschläge lagen nur im Arbeitsspeicher. Ein Kind, dessen Rechner in
 * Minute neun von zehn hakt, bekam danach ein Ergebnis mit lauter Nullen -
 * und zwar ausgerechnet ein Kind, das die ganze Zeit geschrieben hatte.
 *
 * Gemessen: Nach dem Neuladen stand da „0 Anschläge je Minute, 0 Zeichen,
 * 0 Fehler". Das ist kein Randfall, das ist ein verlorener Prüfungslauf.
 *
 * ── Was das kostet, und warum es trotzdem richtig ist ───────────────────────
 * ⚠️ Wer den Gerätespeicher von Hand ändern kann, kann sich damit ein
 * Ergebnis schreiben. Das ist eine echte Lücke, und sie ist bewusst in Kauf
 * genommen:
 *  • Die Alternative ist nicht „sicher", sondern „ein Absturz vernichtet die
 *    Arbeit eines Kindes". Das eine ist möglich, das andere passiert.
 *  • Die Plattform vertraut dem Gerät des Kindes ohnehin für ALLE Lerndaten
 *    (`lw_progress` schreibt das Kind selbst). Ausgerechnet hier paranoid zu
 *    sein, kauft keine Sicherheit - es verschiebt sie nur.
 *  • Die Prüfung wird in einem Raum geschrieben, in dem die Lehrkraft steht.
 *
 * {@link fortschrittSiegel} macht die triviale Änderung („zeichen: 9999")
 * wenigstens unwirksam. Es ist kein Schutz gegen jemanden, der es darauf
 * anlegt, und will keiner sein.
 *
 * ⏳ Steht in `FRAGEN-2026-09-10-TIPPCHALLENGE.md` zur Entscheidung.
 */
export interface Fortschritt {
  /** Richtig geschriebene Soll-Zeichen. */
  zeichen: number;
  /** Fehlanschläge. */
  fehler: number;
  /** Fertig geschriebene Zeilen. */
  zeilen: number;
  /** Summe der Zeilenzeiten in ms - seit F1c NICHT mehr der Nenner des Tempos (siehe `SchreibprobeLauf.beenden`). */
  schreibMs: number;
  /** Abgezogene Vorlesezeit in ms. */
  wartezeitMs: number;
  /**
   * ★ F1c: Zeilenwechsel-Pausen in ms (Zeit der App, `eineMessart.ts`).
   * Optional: Gerätestände von vor dem 18.09.2026 haben es nicht (dann 0).
   * Bewusst NICHT im Siegel - sonst gälten diese alten Stände als verfälscht.
   */
  zeilenwechselMs?: number;
  /** Die Anschläge - Grundlage der wackligen Tasten. */
  anschlaege: { char: string; correct: boolean; ms?: number }[];
  /**
   * ★★★ 23.09.2026 („Freies Schreiben"): die fertigen Ist-Zeilen bisher - nur
   * im freien Modus gebraucht, dort aber Pflicht für die Auswertung „Original
   * gegen Eingabe" (Bauplan §7: „Keine Markierung beim Schreiben ... Die
   * Fehlerstellen zeigt erst die Auswertung"). Optional wie
   * {@link zeilenwechselMs}: Ein Gerätestand von vor diesem Tag und jeder
   * strenge Lauf haben sie nicht.
   */
  getippt?: string[];
  /** Rücktasten im freien Modus bisher - nur zur Auskunft, keine Wertung. */
  korrekturen?: number;
  /** Fehlgriffe im freien Modus bisher, AUCH ausgebesserte - nur zur Auskunft. */
  fehlgriffe?: number;
}

export const LEERER_FORTSCHRITT: Fortschritt = {
  zeichen: 0,
  fehler: 0,
  zeilen: 0,
  schreibMs: 0,
  wartezeitMs: 0,
  anschlaege: [],
};

/**
 * Ein einfaches Siegel über die Zahlen - siehe die Warnung oben. Es hängt an
 * der Probe UND am Beginn dieses Kindes, damit ein Stand nicht in eine andere
 * Prüfung wandern kann.
 */
function fortschrittSiegel(f: Fortschritt, probeId: string, beginnMs: number): number {
  // ★ 23.09.2026 („Freies Schreiben"): `getippt`/`korrekturen`/`fehlgriffe`
  // gehen ABSICHTLICH NICHT ins Siegel ein - aus demselben Grund wie
  // `zeilenwechselMs` oben: Ein Gerätestand, der VOR diesem Tag geschrieben
  // wurde, hätte diese Felder nicht, und das Siegel eines älteren Standes
  // würde beim Zurücklesen NACH einem Deploy nicht mehr zum neu berechneten
  // passen ⇒ ein Kind mitten in einer Tippchallenge verlöre beim Neuladen
  // seinen ganzen Fortschritt, genau wegen eines Feldes, das mit seinem Lauf
  // nichts zu tun hat. Bewusst NICHT im Siegel, sonst gälten alte Stände als
  // verfälscht.
  const roh = `${probeId}|${beginnMs}|${f.zeichen}|${f.fehler}|${f.zeilen}|${Math.round(f.schreibMs)}|${f.anschlaege.length}`;
  let h = 2166136261;
  for (let i = 0; i < roh.length; i++) {
    h ^= roh.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fortschrittSchluessel(accountId: string, probeId: string): string {
  return `tastenflow:schreibprobe-stand:${accountId}:${probeId}`;
}

/**
 * Den gemerkten Fortschritt lesen - nur, wenn das Siegel passt.
 *
 * Passt es nicht (von Hand geändert, andere Probe, anderer Beginn), gilt
 * „nichts geschrieben". Lieber von vorne zählen als eine falsche Zahl
 * übernehmen.
 */
function leseFortschritt(
  accountId: string,
  probeId: string,
  beginnMs: number,
): Fortschritt {
  if (!(beginnMs > 0)) return LEERER_FORTSCHRITT;
  try {
    const roh = localStorage.getItem(fortschrittSchluessel(accountId, probeId));
    if (!roh) return LEERER_FORTSCHRITT;
    const o = JSON.parse(roh) as { siegel?: unknown; daten?: unknown };
    const d = o.daten as Partial<Fortschritt> | undefined;
    if (!d || typeof d !== "object") return LEERER_FORTSCHRITT;
    const f: Fortschritt = {
      zeichen: zahlOderNull(d.zeichen),
      fehler: zahlOderNull(d.fehler),
      zeilen: zahlOderNull(d.zeilen),
      schreibMs: zahlOderNull(d.schreibMs),
      wartezeitMs: zahlOderNull(d.wartezeitMs),
      zeilenwechselMs: zahlOderNull(d.zeilenwechselMs),
      // ★ 23.09.2026: wehrhaft wie die bestehenden Felder darüber - ein alter
      // Gerätestand ohne diese Felder liefert 0/[], genau wie er es bei
      // `zeilenwechselMs` schon vorher tat.
      korrekturen: zahlOderNull(d.korrekturen),
      fehlgriffe: zahlOderNull(d.fehlgriffe),
      getippt: Array.isArray(d.getippt)
        ? d.getippt.filter((x): x is string => typeof x === "string")
        : [],
      anschlaege: Array.isArray(d.anschlaege)
        ? d.anschlaege
            .filter((x): x is { char: string; correct: boolean; ms?: number } =>
              !!x && typeof x === "object" && typeof (x as { char?: unknown }).char === "string",
            )
            .map((x) => ({ char: x.char, correct: x.correct === true, ms: x.ms }))
        : [],
    };
    if (o.siegel !== fortschrittSiegel(f, probeId, beginnMs)) return LEERER_FORTSCHRITT;
    return f;
  } catch {
    return LEERER_FORTSCHRITT;
  }
}

function schreibeFortschritt(
  accountId: string,
  probeId: string,
  beginnMs: number,
  f: Fortschritt,
): void {
  if (!(beginnMs > 0)) return;
  try {
    localStorage.setItem(
      fortschrittSchluessel(accountId, probeId),
      JSON.stringify({ siegel: fortschrittSiegel(f, probeId, beginnMs), daten: f }),
    );
  } catch {
    // Kein Speicher: Dann gilt wieder das Alte - ein Neuladen kostet den Lauf.
    // Das darf die Prüfung nicht verhindern.
  }
}

function zahlOderNull(x: unknown): number {
  return typeof x === "number" && Number.isFinite(x) && x >= 0 ? x : 0;
}

export interface SchreibprobeStand {
  /** Der Plan der Klasse, oder `null` (der Normalfall). */
  plan: SchreibprobePlan | null;
  /** Wo dieses Kind gerade steht. */
  phase: ProbenPhase;
  stand: KindStand;
  /** Ist der Plan schon geladen? (Vorher NICHTS anzeigen - siehe unten.) */
  geladen: boolean;
  /** Ende des Einstiegsfensters (ms) - für die Anzeige „noch 4 Minuten". */
  einstiegBis: number;
  /** Den ersten Tastendruck vermerken. Ruft der Lauf, nicht die Seite. */
  beginne: () => void;
  /** „Ich schreibe nicht mit" - dieses Kind übt normal weiter. */
  melde: () => void;
  /** „Weiter üben" nach dem Abgeben - die Auswertung ist gelesen. */
  schliesseErgebnis: () => void;
  /** Das fertige Ergebnis abgeben. */
  gibAb: (ergebnis: Probenergebnis) => Promise<void>;
  /**
   * Was dieses Kind bisher geschrieben hat - aus dem Gerät gelesen, damit ein
   * Neuladen nichts vernichtet. Siehe {@link Fortschritt}.
   */
  fortschritt: Fortschritt;
  /** Den Fortschritt fortschreiben (ruft der Lauf nach jeder fertigen Zeile). */
  merkeFortschritt: (f: Fortschritt) => void;
  /**
   * ★ 27.09.2026: Liegt das abgegebene Ergebnis noch im Gerät, weil der Server
   * es noch nicht bestätigt hat (kein Netz)? Nur für einen ruhigen Satz auf
   * dem Ergebnis-Bildschirm - das Kind ist trotzdem fertig.
   */
  ergebnisUnterwegs?: boolean;
}

export function useSchreibprobe(
  account: TypingAccount | null | undefined,
): SchreibprobeStand {
  const classCode = account?.role === "schueler" ? account.classCode : undefined;
  const accountId = account?.id ?? "";

  const [plan, setPlan] = useState<SchreibprobePlan | null>(null);
  const [geladen, setGeladen] = useState(false);
  const [stand, setStand] = useState<KindStand>(LEERER_STAND);
  const [fortschritt, setFortschritt] = useState<Fortschritt>(LEERER_FORTSCHRITT);
  // Die Uhr - sie treibt den Phasenwechsel „offen" → „verpasst".
  const [jetzt, setJetzt] = useState(() => Date.now());

  // --- Den Plan der Klasse holen - sofort, bei jeder Änderung, im Takt ------
  /*
   * ★★★ DAS FENSTER KOMMT IN ETWA EINER SEKUNDE (10.09.2026, Johannes: „das
   * Fenster soll bei allen Kindern schnell kommen").
   *
   * Bis dahin gab es nur die Nachfrage alle 45 Sekunden: Eine Lehrkraft, die
   * „Jetzt starten" drückt, sah ihre Klasse bis zu einer Dreiviertelminute
   * warten - im Hintergrund-Tab drosselt der Browser den Takt noch weiter.
   * Jetzt drei Wege, von schnell nach sicher:
   *  1. REALTIME: Das Gerät beobachtet den Datensatz seiner Klasse
   *     (`beobachteKlasse`) und übernimmt den Plan bei jeder Änderung.
   *     Gemessen am 10.09.2026: Der Proxy vor dem Server reicht den
   *     Ereignisstrom ungepuffert durch.
   *  2. SOFORT NACHFRAGEN, wenn der Tab wieder sichtbar wird, das Fenster den
   *     Fokus bekommt oder das Netz zurückkommt - dann könnte die
   *     Verbindung aus 1. gerissen sein. Gedrosselt und gestreut, damit 30
   *     Geräte nicht gleichzeitig und nicht mehrfach feuern (Fokus und
   *     Sichtbarkeit kommen oft im selben Augenblick).
   *  3. Die NACHFRAGE IM TAKT bleibt als Netz.
   */
  useEffect(() => {
    if (!classCode || !accountId) {
      setPlan(null);
      setGeladen(true);
      return;
    }
    let lebt = true;
    let zuletzt = 0;
    /**
     * ★ Den Plan nur ersetzen, wenn er sich INHALTLICH geändert hat. Jede
     * Nachfrage liefert ein neues Objekt; hinge daran der Stand-Effekt, fragte
     * jedes Gerät bei jeder Nachfrage auch seine Ergebnisse neu ab - und jede
     * Realtime-Meldung (auch „Programme dieser Klasse" geändert) ebenso.
     */
    const uebernimm = (settings: unknown) => {
      const neu = planAusEinstellungen(settings);
      setPlan((alt) => (JSON.stringify(alt) === JSON.stringify(neu) ? alt : neu));
      setGeladen(true);
    };
    const hole = () => {
      zuletzt = Date.now();
      void typingBackend()
        .getClass(classCode)
        .then((cls) => {
          if (!lebt) return;
          uebernimm(cls?.settings);
        })
        .catch(() => {
          if (!lebt) return;
          // ⚠️ Bei einem Fehler den bisherigen Plan STEHEN LASSEN. Ein
          // Netzaussetzer mitten in der Prüfung darf sie nicht abbrechen.
          setGeladen(true);
        });
    };
    hole();
    // ★ 28.09.2026 (Serverlast): der Takt nur bei SICHTBAREM Fenster - dieselbe
    // Regel wie in `useKlassenBeobachtung` (siehe dort). Kommt der Tab nach
    // vorn, fragt `sofort` unten nach; ein sichtbares Kind fragt so oft wie
    // bisher und sieht den Start der Tippchallenge nicht später.
    const t = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      hole();
    }, NACHFRAGE_MS);

    const aus = typingBackend().beobachteKlasse(classCode, (cls) => {
      if (lebt && cls.code === classCode) uebernimm(cls.settings);
    });

    const sofort = () => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - zuletzt < NACHFRAGE_SOFORT_MIN_MS) return;
      zuletzt = Date.now();
      window.setTimeout(() => {
        if (lebt) hole();
      }, Math.floor(Math.random() * NACHFRAGE_STREUUNG_MS));
    };
    document.addEventListener("visibilitychange", sofort);
    window.addEventListener("focus", sofort);
    window.addEventListener("online", sofort);

    return () => {
      lebt = false;
      window.clearInterval(t);
      aus();
      document.removeEventListener("visibilitychange", sofort);
      window.removeEventListener("focus", sofort);
      window.removeEventListener("online", sofort);
    };
  }, [classCode, accountId]);

  // --- Den eigenen Stand zu DIESER Probe laden ------------------------------
  useEffect(() => {
    if (!plan || !accountId) {
      setStand(LEERER_STAND);
      return;
    }
    const ausGeraet = leseStand(accountId, plan.id);
    // ★ `zuschlag: false`: Den Zeitzuschlag je Kind gibt es seit 10.09.2026
    // nicht mehr (Ausgleich nur noch über die gemessene Vorlesezeit - seit
    // 11.09.2026 ohne eigenes Häkchen, siehe D4). Ein alter Gerätestand darf
    // ihn nicht wieder einschalten.
    setStand({ ...LEERER_STAND, ...ausGeraet, zuschlag: false });
    setFortschritt(leseFortschritt(accountId, plan.id, ausGeraet.beginnMs ?? 0));

    // Zusätzlich am Server nachsehen: Liegt dort schon ein Ergebnis, ist dieses
    // Kind fertig - auch wenn der Gerätespeicher leer ist (anderes Gerät,
    // gelöschte Daten). Der Server ist der Riegel, das Gerät nur die Abkürzung.
    let lebt = true;
    void typingBackend()
      .leseProbenergebnisse(accountId)
      .then((liste) => {
        if (!lebt) return;
        if (liste.some((e) => e.probeId === plan.id)) {
          setStand((s) => {
            const neu = { ...s, abgegeben: true };
            schreibeStand(accountId, plan.id, neu);
            return neu;
          });
        }
      })
      .catch(() => {
        // Nicht lesbar: Dann gilt der Gerätestand. Eine Prüfung zu verhindern,
        // weil eine Abfrage scheiterte, wäre schlimmer.
      });
    return () => {
      lebt = false;
    };
  }, [plan, accountId]);

  // --- „Bereit" melden ------------------------------------------------------
  /*
   * ★★ DIE LEHRKRAFT SIEHT, WER BEREIT IST (10.09.2026, Johannes). Sobald
   * dieses Gerät den Plan einer gestarteten Challenge kennt, meldet es das -
   * und danach höchstens jede Minute als Lebenszeichen, solange sie läuft.
   * Nach dem Abgeben nicht mehr: Dann steht das Ergebnis da, und das zählt
   * bei der Lehrkraft als bereit.
   *
   * ⚠️ SPARSAM: eine Klasse von 30 Kindern schreibt so höchstens 30 kleine
   * Zeilen je Minute - und nur, solange eine Challenge läuft. Die Zeit
   * setzt der Server; das Gerät schickt nur die Kennung.
   */
  useEffect(() => {
    if (!plan || !accountId || !classCode || stand.abgegeben) return;
    if (probeVorbei(plan, Date.now())) return;
    let lebt = true;
    const melde = () => {
      if (!lebt || probeVorbei(plan, Date.now())) return;
      void typingBackend()
        .meldeProbeBereit(accountId, plan.id)
        .catch(() => {
          // Nicht gemeldet heisst nur: Die Lehrkraft sieht das Kind als „noch
          // nicht". Die Challenge selbst hängt daran nicht.
        });
    };
    melde();
    const t = window.setInterval(melde, LEBENSZEICHEN_MS);
    return () => {
      lebt = false;
      window.clearInterval(t);
    };
  }, [plan, accountId, classCode, stand.abgegeben]);

  // --- Die Uhr --------------------------------------------------------------
  // Sekundengenau nur, solange überhaupt eine Probe im Spiel ist. Ein Takt, der
  // immer läuft, weckt jedes Gerät jede Sekunde auf - für nichts.
  const relevant = plan !== null && !stand.abgegeben && !stand.abgemeldet;
  useEffect(() => {
    if (!relevant) return;
    const t = window.setInterval(() => setJetzt(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [relevant]);

  /**
   * Der Stand über einen Ref: `merkeFortschritt` braucht den AKTUELLEN
   * `beginnMs` fürs Siegel, darf ihn aber nicht in seine Abhängigkeitsliste
   * nehmen - sonst bekäme der Lauf nach dem ersten Anschlag eine neue Funktion
   * und schriebe sie in seine eigenen Effekte.
   */
  const standRef = useRef(stand);
  standRef.current = stand;

  const beginne = useCallback(() => {
    if (!plan || !accountId) return;
    setStand((s) => {
      if (s.beginnMs > 0) return s; // schon begonnen - nie zurückstellen
      const neu = { ...s, beginnMs: Date.now() };
      schreibeStand(accountId, plan.id, neu);
      return neu;
    });
  }, [plan, accountId]);

  const melde = useCallback(() => {
    if (!plan || !accountId) return;
    setStand((s) => {
      const neu = { ...s, abgemeldet: true };
      schreibeStand(accountId, plan.id, neu);
      return neu;
    });
  }, [plan, accountId]);

  /**
   * „Weiter üben" nach dem Abgeben (Johannes 10.09.2026: *„nach der
   * abgegebenen tippchallenge kommt man mit weiter oder esc wieder zum normalen
   * modus"*). Im Gerät gemerkt - sonst übernähme die Auswertung nach jedem
   * Neuladen wieder den Bildschirm, solange die Challenge in der Klasse steht.
   */
  const schliesseErgebnis = useCallback(() => {
    if (!plan || !accountId) return;
    setStand((s) => {
      if (s.gesehen) return s;
      const neu = { ...s, gesehen: true };
      schreibeStand(accountId, plan.id, neu);
      return neu;
    });
  }, [plan, accountId]);

  /**
   * Das Ergebnis abgeben.
   *
   * ⚠️ Der Gerätestand wird ZUERST auf „abgegeben" gesetzt und erst danach
   * geschrieben. Scheitert das Schreiben (kein Netz), ist das Kind trotzdem
   * fertig - sonst stünde es vor einem Bildschirm, der die Prüfung noch einmal
   * anbietet, während die Zeit längst um ist.
   *
   * ★★★ 27.09.2026 (Befund Netzabbruch §3.3): Bis dahin wurde EINMAL gesendet
   * und jeder Fehler geschluckt - ohne Netz war das Ergebnis weg, und die
   * Lehrkraft sah „nicht angetreten". Jetzt liegt das fertige Ergebnis ZUERST
   * in der Warteschlange im Gerät (`nachsenden.ts`, je Konto, Schlüssel = die
   * Probe) und wird so lange nachgeschickt, bis der Server es bestätigt - beim
   * nächsten `online`, im Takt und beim nächsten Start dieses Kontos
   * (`useNachsenden`). Doppelt kann es dabei nicht werden: am Server
   * UNIQUE(pupilUid, probeId), und ein abgewiesener zweiter Versuch sieht
   * nach, ob die Zeile schon liegt.
   */
  const gibAb = useCallback(
    async (ergebnis: Probenergebnis) => {
      if (!plan || !account) return;
      setStand((s) => {
        const neu = { ...s, abgegeben: true };
        schreibeStand(account.id, plan.id, neu);
        return neu;
      });
      const imGeraet = merkeVor(account.id, "probe", ergebnis.probeId, fuersSpeichern(ergebnis));
      if (imGeraet) {
        await nachsendenJetzt(account, { auchAbgewiesene: true }).catch(() => undefined);
        return;
      }
      // Kein Gerätespeicher (privates Fenster, voll): der eine Versuch wie früher.
      try {
        await typingBackend().speichereProbenergebnis(account, ergebnis);
      } catch {
        // Best effort - ohne Gerätespeicher gibt es keinen zweiten Versuch.
      }
    },
    [plan, account],
  );

  const merkeFortschritt = useCallback(
    (f: Fortschritt) => {
      setFortschritt(f);
      if (!plan || !accountId) return;
      schreibeFortschritt(accountId, plan.id, standRef.current.beginnMs, f);
    },
    [plan, accountId],
  );

  const phase = phaseVon(plan, stand, jetzt);
  const ergebnisUnterwegs = useAusstehend(accountId, "probe", plan?.id);

  return {
    plan,
    phase,
    stand,
    geladen,
    einstiegBis: plan ? einstiegBisMs(plan) : 0,
    beginne,
    melde,
    schliesseErgebnis,
    gibAb,
    fortschritt,
    merkeFortschritt,
    ergebnisUnterwegs,
  };
}

/**
 * Ist die Schreibprobe für die ganze Klasse vorbei? Für die Lehrkraft-Sicht -
 * dort entscheidet es, ob „läuft gerade" oder „Ergebnisse" steht.
 */
export function probeVorbei(plan: SchreibprobePlan | null, jetztMs: number): boolean {
  return plan === null || jetztMs > klasseVorbeiMs(plan);
}
