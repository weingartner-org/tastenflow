/**
 * ★★★ DER GEMEINSAME HAKEN „REALTIME + SOFORT-NACHFRAGE + TAKT" (11.09.2026).
 *
 * ── Warum es ihn gibt ───────────────────────────────────────────────────────
 * Dasselbe Muster stand am 11.09.2026 an drei Stellen im Programm, jedes Mal
 * von Hand:
 *  • `useSchreibprobe.ts:309-370` (das Kind beobachtet seine Klasse),
 *  • `SchreibprobeKasten.tsx:660-679` (die Lehrkraft beobachtet ihre Kinder),
 *  • und ab heute das Klassenmatch, das es gleich zweimal braucht (Matches
 *    und Stände).
 *
 * Drei Fassungen derselben Sache sind genau die Bauart, vor der
 * [[feedback_zwei_stellen_die_voneinander_nichts_wissen]] warnt: Wer die
 * Streuung repariert, repariert sie an einer Stelle, und die anderen zwei
 * schlagen weiter gleichzeitig auf den Server. G2 des Umbauplans nennt es beim
 * Namen. Dies ist die eine Fassung.
 *
 * ⚠️ `useSchreibprobe` und `SchreibprobeKasten` werden hier NICHT umgebaut -
 * das ist Etappe E8. Der Schnitt ist aber so gelegt, dass es geht: Der Haken
 * kennt weder Klasse noch Match noch PocketBase, sondern nur drei Funktionen.
 *
 * ── Die drei Wege, von schnell nach sicher ──────────────────────────────────
 *  1. **Realtime.** Der Server meldet jede Änderung in etwa einer Sekunde
 *     (gemessen 10.09.2026: der Proxy puffert den Ereignisstrom nicht).
 *  2. **Sofort nachfragen**, wenn der Tab wieder sichtbar wird, das Fenster den
 *     Fokus bekommt oder das Netz zurückkommt - dann könnte die Verbindung aus
 *     1. gerissen sein. Gedrosselt (nicht öfter als {@link SOFORT_MIN_MS}) und
 *     gestreut (über {@link STREUUNG_MS}), damit 30 Geräte einer Klasse nicht
 *     in derselben Millisekunde feuern.
 *  3. **Die Nachfrage im Takt** als Netz - sie allein genügt nie, aber ohne sie
 *     hängt eine gerissene Verbindung still für immer.
 *
 * ── Wehrhaft: ein Ladefehler nimmt nie etwas weg ────────────────────────────
 * Scheitert eine Nachfrage, bleibt der bisherige Stand STEHEN. Ein
 * Netzaussetzer mitten im Match darf das Ranking nicht leeren - eine leere
 * Liste sähe aus wie „alle haben aufgegeben".
 */
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Frühestens so lange nach der letzten Nachfrage wird sofort nachgefragt (ms).
 *
 * ★ Zehn Sekunden - dieselbe Zahl wie `NACHFRAGE_SOFORT_MIN_MS` der
 * Tippchallenge (`useSchreibprobe.ts:65`), und am 11.09.2026 von 2 s dorthin
 * angeglichen. Sichtbarkeit, Fokus und „Netz zurück" kommen oft im selben
 * Augenblick; wer bei jedem Fensterwechsel erneut fragt, baut sich aus lauter
 * Sofort-Nachfragen einen zweiten Takt. Zwei Zahlen für dieselbe Sache wären
 * ausserdem genau die Doppelung, die dieser Haken abschaffen soll.
 */
export const SOFORT_MIN_MS = 10_000;

/** Über so viele ms wird das sofortige Nachfragen gestreut (ms). */
export const STREUUNG_MS = 1_000;

export interface BeobachtungsAuftrag<T> {
  /**
   * Ist gerade etwas zu beobachten? `false` hält alles an und setzt den Stand
   * auf `null` - kein Takt, kein Abo, kein geweckter Rechner für nichts.
   */
  aktiv: boolean;
  /**
   * Der VOLLE Stand vom Server. Wird beim Aufbauen, im Takt und bei jeder
   * sofortigen Nachfrage gerufen.
   */
  hole: () => Promise<T>;
  /**
   * Das Realtime-Abo. Bekommt zwei Werkzeuge:
   *  • `einrechnen` - eine EINZELNE Änderung in den vorhandenen Stand
   *    einrechnen (`alt` kann `null` sein, solange die erste volle Antwort
   *    unterwegs ist). **Das ist der Normalweg.**
   *  • `nachfragen` - alles neu holen. Nur für Meldungen, die den Stand nicht
   *    selbst mitbringen. ⚠️ Sparsam: Eine Meldung je Änderung mal 30 Kinder
   *    mal eine volle Abfrage ist genau die Last, die der Takt vermeiden soll.
   *
   * Gibt die Abmeldung zurück. Ohne Server (lokales Backend, Tests) darf der
   * Auftrag das Feld weglassen - dann tragen Takt und Sofort-Nachfrage allein.
   */
  beobachte?: (werkzeug: {
    einrechnen: (aendern: (alt: T | null) => T | null) => void;
    nachfragen: () => void;
  }) => () => void;
  /** Wie oft von selbst nachgefragt wird (ms). */
  taktMs: number;
  /**
   * Gleichheits-Prüfung: Ist der neue Stand inhaltlich derselbe, bleibt der
   * ALTE stehen. Ohne das bekäme jeder Takt ein neues Objekt, und jedes Bauteil
   * daran rechnete neu - bei drei Sekunden Takt und 30 Kindern ist das kein
   * Schönheitsfehler, sondern Last. Vorgabe: `JSON.stringify`.
   */
  gleich?: (a: T | null, b: T) => boolean;
}

export interface Beobachtung<T> {
  /** Der Stand, oder `null` (noch nichts geladen bzw. nicht aktiv). */
  daten: T | null;
  /** Ist die erste Antwort da? Vorher NICHTS anzeigen. */
  geladen: boolean;
  /** Von Hand nachfragen - nach einer eigenen Schreib-Handlung. */
  jetztNachfragen: () => void;
}

export function useKlassenBeobachtung<T>(auftrag: BeobachtungsAuftrag<T>): Beobachtung<T> {
  const { aktiv, taktMs } = auftrag;
  const [daten, setDaten] = useState<T | null>(null);
  const [geladen, setGeladen] = useState(false);

  /*
   * ★ Der Auftrag über einen Ref, NICHT über die Abhängigkeitsliste.
   *
   * `hole` und `beobachte` sind in jeder Aufrufstelle frische Funktionen (sie
   * schliessen über Klassencode und Match-Kennung). Stünden sie in den
   * Abhängigkeiten, würde bei JEDEM Rendern das Realtime-Abo abgemeldet und
   * neu angemeldet - eine Verbindung, die sich fortwährend selbst kappt, ist
   * schlechter als gar keine.
   */
  const auftragRef = useRef(auftrag);
  auftragRef.current = auftrag;

  /** Von Hand auslösbare Nachfrage - siehe {@link Beobachtung.jetztNachfragen}. */
  const holeRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!aktiv) {
      setDaten(null);
      setGeladen(false);
      holeRef.current = () => {};
      return;
    }
    let lebt = true;
    let zuletzt = 0;

    const uebernimm = (neu: T) => {
      const gleich = auftragRef.current.gleich;
      setDaten((alt) =>
        gleich
          ? gleich(alt, neu)
            ? alt
            : neu
          : JSON.stringify(alt) === JSON.stringify(neu)
            ? alt
            : neu,
      );
      setGeladen(true);
    };

    const hole = () => {
      zuletzt = Date.now();
      void auftragRef.current
        .hole()
        .then((neu) => {
          if (lebt) uebernimm(neu);
        })
        .catch(() => {
          // ⚠️ Den bisherigen Stand STEHEN LASSEN - siehe Dateikopf.
          if (lebt) setGeladen(true);
        });
    };
    holeRef.current = hole;
    hole();
    /*
     * ★ Der Takt fragt nur bei SICHTBAREM Fenster (28.09.2026, Serverlast).
     *
     * Gemessen (5 Tage): 62.607 Lesungen `tt_classes`, 17.947 `tt_matches` -
     * auch aus Tabs, die niemand ansieht. Das Netz unter dem Netz bleibt
     * gespannt, nur nicht dort, wo niemand hineinfallen kann: Ein verborgener
     * Tab zeigt keinem Kind etwas. Kommt er nach vorn, fragt `sofort` unten
     * nach (gedrosselt: nicht, wenn die letzte Nachfrage jünger als
     * {@link SOFORT_MIN_MS} ist - dann ist der Stand ohnehin frisch), und der
     * Takt läuft im selben Rhythmus weiter. Ein SICHTBARES Kind fragt genau so
     * oft wie bisher - die Startmeldung der Tippchallenge kann es darum nicht
     * später erreichen als vorher. Realtime und `nachfragen` bleiben
     * unberührt.
     */
    const t = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      hole();
    }, taktMs);

    const aus = auftragRef.current.beobachte?.({
      einrechnen: (aendern) => {
        if (!lebt) return;
        setDaten((alt) => aendern(alt));
        setGeladen(true);
      },
      nachfragen: () => {
        if (lebt) hole();
      },
    });

    const sofort = () => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - zuletzt < SOFORT_MIN_MS) return;
      zuletzt = Date.now();
      window.setTimeout(
        () => {
          if (lebt) hole();
        },
        Math.floor(Math.random() * STREUUNG_MS),
      );
    };
    document.addEventListener("visibilitychange", sofort);
    window.addEventListener("focus", sofort);
    window.addEventListener("online", sofort);

    return () => {
      lebt = false;
      holeRef.current = () => {};
      window.clearInterval(t);
      aus?.();
      document.removeEventListener("visibilitychange", sofort);
      window.removeEventListener("focus", sofort);
      window.removeEventListener("online", sofort);
    };
    // ⚠️ NUR diese beiden: alles andere läuft über `auftragRef` (siehe oben).
  }, [aktiv, taktMs]);

  const jetztNachfragen = useCallback(() => holeRef.current(), []);

  return { daten, geladen, jetztNachfragen };
}
