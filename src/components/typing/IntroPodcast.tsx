/**
 * Tastenflow — die Willkommens-Karte mit dem Einführungs-Podcast.
 *
 * Sie hat zwei Plätze: als vorletzter Schritt der EINRICHTUNG beim ersten Start
 * (`Einrichtung.tsx`, dort ohne eigenen Schließen-Knopf) und danach hinter dem
 * Knopf „🎧 Einführung" in den EINSTELLUNGEN (Zahnrad, Gruppe „Einführung &
 * Einrichtung") — wer sie später hören will, findet sie also wieder. Bis zum
 * 09.08.2026 stand dieser Knopf dauerhaft im Seitenkopf; er ist dorthin
 * gewandert, wo man ihn sucht, statt jeden Tag im Weg zu stehen (Wunsch
 * Johannes). Ohne Einrichtung (übersprungen und Bit zurückgesetzt) kann die
 * Karte auch für sich allein über dem Trainer stehen.
 *
 * Welche der drei Folgen läuft, entscheidet die Textstufe
 * (`podcastsTippen.ts`): 7-10 die Kindersendung, 11-15 die Folge per Du,
 * Erwachsene die per Sie. Anonyme Besucher stehen auf der Vorgabestufe `teens`
 * und bekommen damit die mittlere.
 *
 * ── Die sechs Regeln dieser Datei ───────────────────────────────────────────
 *
 * 1. **Der erste Ton wird SYNCHRON in der Nutzergeste geplant** (K28,
 *    [[feedback_web_audio_gesture]]). `play()` läuft im Klick-Aufruf selbst —
 *    kein `await`, kein Effekt davor. Damit das geht, hängt das `<audio>`-
 *    Element von Anfang an im Baum und wird nur `hidden` geschaltet: Ein erst
 *    im Klick erzeugtes Element gäbe es zum Zeitpunkt des `play()` noch nicht.
 *    `hidden` nimmt es zugleich aus dem Screenreader-Baum, solange es ruht.
 *
 * 2. **Der Podcast bricht die Vorlesestimme ab.** Zwei Stimmen gleichzeitig
 *    sind für ein Kind mit Sehbeeinträchtigung unbrauchbar. Das hängt am
 *    `onPlay` des Abspielers, nicht am Knopf — so greift die Regel auch, wenn
 *    jemand die eigene Wiedergabe-Taste des Abspielers benutzt.
 *
 * 3. **Fokus per `setTimeout(0)`** ([[feedback_fokus_pflicht_alle_apps]]):
 *    Nach dem Klick bekommt der Abspieler selbst den Fokus — er ist das, was
 *    als Nächstes bedient wird (Leertaste = Pause, Pfeile = spulen). Beim
 *    Schließen geht der Fokus zurück ins Übungsfeld, wie nach Hilfe und
 *    Nachrichten.
 *
 * 4. **Die Karte ist KEIN Dialog.** Sie sperrt nichts, sie fängt keinen Fokus,
 *    sie liegt einfach über dem Trainer. Wer sofort tippen will, tippt sofort
 *    — der erste Start eines Lernprogramms ist der schlechteste Moment für
 *    eine Wand, die man erst wegklicken muss.
 *
 * 5. **Kein neues Alt-Kürzel.** Der Knopf in den Einstellungen ist über das
 *    Zahnrad (Alt + O) mit Tab erreichbar und heißt, was er tut. Ein weiteres
 *    Kürzel nähme einem tippenden Kind eine Taste weg — für etwas, das man
 *    einmal hört.
 *
 * 6. **Anhören schreibt keinen Fortschritt.** Kein Ereignis, kein Speichern,
 *    kein Abzeichen, keine Übezeit. Gemerkt wird nur dieses eine Bit im
 *    Browser: „Die Karte war schon einmal da." Es hängt bewusst NICHT am
 *    Spielstand — es beschreibt dieses Gerät, nicht die Person.
 */
import { useEffect, useRef, useState } from "react";
import { Tipp } from "@/components/Tipp";
import type { Stufe } from "@/lib/typing";
import { ansage, cancelSpeech, speakUi } from "@/lib/typing";
import {
  introPodcastFuerStufe,
  introPodcastKnopfText,
  introPodcastPfad,
} from "@/lib/typing/podcastsTippen";

/**
 * Merkt, dass die Willkommens-Karte schon einmal von selbst dastand — pro
 * Browser, wie der Auf-/Zu-Zustand der Einstellungen. Die Fassung
 * (`v1`) steckt im Wert: Kommen später neue Folgen, dürfen sie sich noch
 * einmal zeigen, ohne dass jemand einen zweiten Schlüssel erfindet.
 */
const GESEHEN_KEY = "tippen-intro-podcast";
const GESEHEN_WERT = "v1";

export function introGesehen(): boolean {
  try {
    return localStorage.getItem(GESEHEN_KEY) === GESEHEN_WERT;
  } catch {
    // Kein localStorage (Privatmodus, gesperrte Umgebung) → die Karte zeigt
    // sich eben jedes Mal. Lieber einmal zu viel als ein Fehler beim Start.
    return false;
  }
}

export function introGesehenMerken(): void {
  try {
    localStorage.setItem(GESEHEN_KEY, GESEHEN_WERT);
  } catch {
    /* dann eben nur für diese Sitzung */
  }
}

/** Nur für Tests: das Bit wieder löschen. */
export function _introGesehenZuruecksetzen(): void {
  try {
    localStorage.removeItem(GESEHEN_KEY);
  } catch {
    /* egal */
  }
}

export interface IntroPodcastProps {
  /** Textstufe — entscheidet, welche der drei Folgen läuft. */
  stufe: Stufe;
  /** Sichtbar? (Erster Start oder Knopf „🎧 Einführung" im Seitenkopf.) */
  offen: boolean;
  /** Schließen — die Seite blendet die Karte aus. */
  onClose: () => void;
  /**
   * Ohne eigenen „Schließen"-Knopf und ohne den Hinweis, wo man die Karte
   * wiederfindet: So steckt sie IN der Einrichtung (Einrichtung.tsx), wo der
   * Schritt schon seinen eigenen „Weiter"-Knopf hat. Zwei Weiter-Knöpfe
   * nebeneinander wären genau die Sorte Rätsel, die einen ersten Start
   * verdirbt.
   */
  ohneSchliessen?: boolean;
}

export function IntroPodcast({
  stufe,
  offen,
  onClose,
  ohneSchliessen,
}: IntroPodcastProps) {
  const podcast = introPodcastFuerStufe(stufe);
  const [laeuft, setLaeuft] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  /** Das Fokus-Ziel beim Öffnen (Nr 1) - der „▶ …"-Knopf der Karte. */
  const startRef = useRef<HTMLButtonElement>(null);

  // Wechselt die Stufe, wechselt die Folge — dann fängt die Karte von vorn an,
  // sonst stünde ein offener Abspieler mit der Folge der VORIGEN Stufe da.
  useEffect(() => {
    setLaeuft(false);
    const el = audioRef.current;
    return () => {
      if (el) {
        try {
          if (!el.paused) el.pause();
        } catch {
          /* ein ruhender Abspieler ist kein Fehler */
        }
      }
    };
  }, [podcast?.id]);

  /**
   * ★ Nr 1 der Fokusziele (22.08.2026) - Johannes' eigenes Beispiel: „Im
   * Zahnrad den Schalter »Einführung« betätigen ⇒ der Fokus müsste auf dem
   * Start-Knopf des Podcasts stehen."
   *
   * Bisher blieb der Fokus unten im Zahnrad, während die Karte GANZ OBEN
   * erschien - wer sie nicht sieht, hätte sie erst suchen müssen.
   *
   * Geprüft wird der ÜBERGANG zu / auf, nicht der Zustand „offen": Beim
   * allerersten Start steht die Karte vom ersten Rendern an offen, und dort
   * hat niemand einen Schalter betätigt - ein Fokus-Sprung ohne Zutun wäre
   * genau das, was Regel 0.1 verbietet. Ziel ist der Start-Knopf; läuft die
   * Folge schon (die Karte war offen, wurde geschlossen und wieder geöffnet),
   * ist der Start-Knopf weg und der Abspieler das erste Bedienelement (R1).
   */
  const warOffen = useRef(offen);
  useEffect(() => {
    const vorher = warOffen.current;
    warOffen.current = offen;
    if (!offen || vorher) return;
    const t = window.setTimeout(() => {
      (startRef.current ?? audioRef.current)?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [offen]);

  if (!offen || !podcast) return null;

  function starten() {
    const el = audioRef.current;
    setLaeuft(true);
    introGesehenMerken();
    // Regel 1: SYNCHRON in der Geste. `play()` gibt ein Promise zurück, das
    // abgelehnt wird, wenn der Browser die Wiedergabe doch nicht erlaubt — das
    // ist kein Fehler, der Abspieler steht dann mit seiner eigenen
    // Wiedergabe-Taste bereit. Ein `play()` ganz OHNE Promise gibt es auch
    // (ältere Browser, jsdom) — beide Fälle abfangen und nie werfen: Ein
    // Ausnahmefehler hier risse die ganze Startansicht mit.
    try {
      const lauf = el?.play() as Promise<void> | undefined;
      if (lauf && typeof lauf.catch === "function") lauf.catch(() => {});
    } catch {
      /* Wiedergabe nicht möglich — der Abspieler steht trotzdem bereit */
    }
    // Regel 3: erst im nächsten Tick, wenn `hidden` weg ist.
    window.setTimeout(() => audioRef.current?.focus(), 0);
  }

  function schliessen() {
    const el = audioRef.current;
    try {
      if (el && !el.paused) el.pause();
    } catch {
      /* egal */
    }
    introGesehenMerken();
    onClose();
    // Zurück ins Übungsfeld — gleiche Rückkehr wie nach Hilfe und Nachrichten.
    window.dispatchEvent(new Event("tippen-focus-field"));
  }

  return (
    <section
      aria-labelledby="tippen-intro-titel"
      className="mb-4 rounded-xl border border-accent/40 bg-surface-raised/80 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="tippen-intro-titel"
            className="m-0 flex items-center gap-2 text-lg font-semibold text-ink"
          >
            <span aria-hidden="true">🎧</span>
            Willkommen bei Tastenflow
          </h2>
          <p className="m-0 mt-1 max-w-prose text-sm text-ink-muted">
            {podcast.beschreibung}
          </p>
        </div>
        {!ohneSchliessen && (
          <button
            type="button"
            className="btn-ghost btn-toggle shrink-0"
            onClick={schliessen}
          >
            Schließen
          </button>
        )}
      </div>

      <div className="mt-3">
        {!laeuft && (
          <button
            type="button"
            ref={startRef}
            onClick={starten}
            className="btn-primary btn-toggle"
          >
            <span aria-hidden="true">▶ </span>
            {introPodcastKnopfText(podcast)}
          </button>
        )}
        {/*
          Immer im Baum (Regel 1), aber `hidden`, solange nichts läuft: kein
          Netzverkehr (`preload="none"`), kein Eintrag im Screenreader-Baum.
        */}
        <audio
          ref={audioRef}
          hidden={!laeuft}
          controls
          /*
            `tabIndex={0}` ist Absicht: Ein `<audio controls>` liegt im Browser
            ohnehin in der Tab-Reihenfolge — das Attribut ändert dort nichts,
            macht das Element aber AUSDRÜCKLICH fokussierbar. Ohne es griff der
            programmatische Fokus aus Regel 3 nicht überall (im Test-DOM gar
            nicht). `-1` wäre falsch: Das nähme einem Tastatur-Kind den Weg
            dorthin.
          */
          tabIndex={0}
          preload="none"
          src={introPodcastPfad(podcast)}
          aria-label={`Einführungs-Podcast: ${podcast.titel}, ${podcast.dauer}`}
          className="w-full"
          onPlay={() => {
            // Regel 2 — hier und nicht im Knopf, damit sie auch für die eigene
            // Wiedergabe-Taste des Abspielers gilt.
            cancelSpeech();
          }}
        >
          {/* Kein <source>: Ein einziges Format, `src` genügt und bleibt testbar. */}
        </audio>
        {!ohneSchliessen && (
          <p className="m-0 mt-2 text-sm text-ink-muted">
            Du kannst jederzeit weiterschreiben - der Podcast läuft nebenher.
            Später wiederfinden: im Zahnrad „Einstellungen" unter „Einführung".
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * Der Knopf in den Einstellungen (Zahnrad). Eigene kleine Komponente, damit die
 * Seite nicht wissen muss, ob es zur aktuellen Stufe überhaupt eine Folge gibt
 * — gibt es keine, ist hier nichts (statt eines Knopfes, der auf eine leere
 * Karte zeigt).
 */
export function IntroPodcastKnopf({
  stufe,
  offen,
  onToggle,
}: {
  stufe: Stufe;
  offen: boolean;
  onToggle: () => void;
}) {
  if (!introPodcastFuerStufe(stufe)) return null;
  return (
    <Tipp text="Einführungs-Podcast: das Programm in wenigen Minuten erklärt">
      {(tippId) => (
        <button
          type="button"
          className="btn-secondary btn-toggle"
          aria-pressed={offen}
          aria-describedby={tippId}
          onClick={() => {
            if (!offen) speakUi(ansage("podcastGeoeffnet"));
            onToggle();
          }}
        >
          <span aria-hidden="true">🎧</span> Einführung
        </button>
      )}
    </Tipp>
  );
}
