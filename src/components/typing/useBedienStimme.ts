/**
 * ★★ DIE STIMME DER BEDIENUNG - für Bauteile ausserhalb der Übungsseite
 * (EN2, 19.09.2026: Zahnrad, Einrichtung, Anmeldung).
 *
 * Dieselbe Regel wie `sprichBedienung`/`bedienLang` in `TippenTrainerPage`
 * (EN1), nur als Haken, damit nicht jedes Bauteil sie nachbaut:
 *
 *  · IN TASTENFLOW (`bereichAktiv`) spricht eine Ansage der BEDIENUNG („Ton an.",
 *    „Deutsch gewählt.") in der Bedienungssprache und mit deren Stimme -
 *    Satz und Bild sagen dasselbe (Glossar §4).
 *  · OHNE AKTIVEN SPRACHBEREICH (ohne Provider) läuft alles genau wie vorher: `lang()` ist
 *    `undefined` (= die Vorlese-Sprache, die jede `ansage…`-Funktion ohne
 *    Angabe nimmt), und gesprochen wird mit genau EINEM Argument -
 *    `speakUi(text)`. ⚠️ Das ist kein Stil: Tests prüfen
 *    `toHaveBeenCalledWith("Belohnungs-Spiel: keins.")`, und ein Aufruf mit
 *    drei weiteren `undefined` wäre dort ein anderer Aufruf.
 *
 * Über einen Ref, damit auch ein Horcher, der nur einmal angemeldet wird
 * (Esc in der Einrichtung), die Sprache des Augenblicks liest.
 */
import { useMemo, useRef } from "react";
import { useBedienSprache } from "@/lib/bedienSprache";
import type { Lang } from "@/lib/typing/account";
import { speakUi, speakUiAlways } from "@/lib/typing/voice";

export interface BedienStimme {
  /** Die Sprache für `ansage(…, lang)` - ohne aktiven Sprachbereich `undefined` (= wie bisher). */
  lang: () => Lang | undefined;
  /** Eine Ansage der Bedienung, achtet den Vorlesen-Schalter (`speakUi`). */
  sprich: (text: string) => void;
  /** Wie `sprich`, aber auch bei ausgeschaltetem Vorlesen (`speakUiAlways`). */
  sprichImmer: (text: string) => void;
}

export function useBedienStimme(): BedienStimme {
  const { sprache, bereichAktiv } = useBedienSprache();
  const ref = useRef({ sprache, bereichAktiv });
  ref.current = { sprache, bereichAktiv };
  return useMemo<BedienStimme>(
    () => ({
      lang: () => (ref.current.bereichAktiv ? ref.current.sprache : undefined),
      sprich: (text) => {
        const b = ref.current;
        if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
        else speakUi(text);
      },
      sprichImmer: (text) => {
        const b = ref.current;
        if (b.bereichAktiv) speakUiAlways(text, undefined, b.sprache);
        else speakUiAlways(text);
      },
    }),
    [],
  );
}
