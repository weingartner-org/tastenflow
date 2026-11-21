/**
 * ★★★ DAS ANKÜNDIGUNGSFENSTER „EIGENE ÜBUNG" - WANN ES STEHT (E6, 19.09.2026;
 * Reihe und Merker am Konto seit Z1, 19.09.2026).
 *
 * Beantwortet GENAU eine Frage: Soll JETZT das Fenster „Weiter geht es mit
 * einer Übung von deiner Lehrkraft" stehen? `EigeneUebungAnkuendigung.tsx`
 * zeigt nur noch, was hier „ja" heisst - dieser Haken kennt weder Modal noch
 * Sprachausgabe, nur den Stand.
 *
 * ── Die Regeln (Johannes, 18.09.2026 abends, Entwurf §7b/§7c; 19.09.2026) ────
 *  1. Sobald DIESES Kind eine Übung vor sich hat (`useEigeneUebung.dran`),
 *     kommt das Fenster - SOFORT per Realtime. Dieser Haken muss dafür selbst
 *     nichts tun: `useEigeneUebung` beobachtet die Klasse schon über
 *     `useKlassenBeobachtung` (Realtime, der 45-Sekunden-Takt nur als Netz).
 *  2. Läuft gerade eine Tippchallenge oder ein Klassenmatch, WARTET das
 *     Fenster, bis das vorbei ist - das übergibt der Aufrufer als `gesperrt`.
 *  3. Wer beim Starten nicht in Tastenflow war, sieht es beim nächsten
 *     Öffnen - ergibt sich von selbst: `dran` mit einer noch nicht bestätigten
 *     Übung.
 *  4. JEDE Übung der Reihe hat ihr eigenes Fenster (Johannes 19.09.: „dann
 *     kommt zuerst die alte und dann die neue"). Bestätigt wird einmal je
 *     Übung und je KIND, am Konto (`angekuendigt`, von `useEigeneUebung`) -
 *     bis Z1 stand das am GERÄT, und auf einem Klassen-Rechner bekam nur das
 *     erste Kind das Fenster. Dieselbe Übung fortzusetzen kündigt nicht
 *     erneut an (sonst wäre es keine Ankündigung, sondern ein Störer).
 */
import { useState } from "react";

export interface EigeneUebungAnkuendigungAuftrag {
  /** Hat DIESES Kind gerade eine eigene Übung vor sich? */
  dran: boolean;
  /** Die Übung, solange `dran` gilt - sonst `null`. */
  zeiger: { textId: string } | null;
  /**
   * Läuft gerade etwas, das vorgeht (Tippchallenge, Klassenmatch)? Dann
   * bleibt das Fenster stumm, bis `gesperrt` wieder `false` wird.
   */
  gesperrt: boolean;
  /** Wurde das Fenster für diese Übung schon bestätigt (am Konto)? */
  angekuendigt: boolean;
  /** Bestätigen am Konto merken (`useEigeneUebung.bestaetigeAnkuendigung`). */
  merkeBestaetigt: () => void;
}

export interface EigeneUebungAnkuendigungStand {
  /** Soll das Fenster JETZT stehen? */
  zeigen: boolean;
  /** Bestätigt - merkt es am Konto (für DIESE Übung), das Fenster geht zu. */
  bestaetigen: () => void;
}

export function useEigeneUebungAnkuendigung({
  dran,
  zeiger,
  gesperrt,
  angekuendigt,
  merkeBestaetigt,
}: EigeneUebungAnkuendigungAuftrag): EigeneUebungAnkuendigungStand {
  const textId = zeiger?.textId ?? null;
  // Sofort zu, auch bevor der Merker am Konto zurückkommt.
  const [bestaetigtFuer, setBestaetigtFuer] = useState<string | null>(null);

  return {
    zeigen: dran && !!textId && !gesperrt && !angekuendigt && bestaetigtFuer !== textId,
    bestaetigen: () => {
      if (!textId) return;
      setBestaetigtFuer(textId);
      merkeBestaetigt();
    },
  };
}
