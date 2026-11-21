/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN PORTUGIESISCH (BRASILIEN) - Einhängepunkt.
 *
 * ★ O-INHALT-BR (29.10.2026): geschrieben nach Glossar `GLOSSAR-pt-BR.md` (Zahlwörter): „dezesseis · dezessete · dezenove",
 * 14 = „catorze" (Vorgabe des Glossars, §5 Nr. 9; „quatorze" ist ebenso richtig, wird hier aber nicht verlangt). Sonst dieselben
 * Regeln wie Portugal (`zahlwortPortugiesischKern.ts`): „e" zwischen den Teilen, „cem"/„cento", „mil" ohne „um", „um milhão".
 * Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`). Wächter: `tests/tastenflow-zahlwort-pt-br-sv.test.ts`.
 * ⚠️ Gegen das Sprachwissen des Baus gelesen, nicht von einer Person mit brasilianischem Portugiesisch als Erstsprache.
 */
import { zahlwortPortugiesisch } from "./zahlwortPortugiesischKern";

/** Ein Zahlwort je Zahl (0 bis 1.000.000) in Portugiesisch (Brasilien). */
export const ZAHLWORT_BR: ((n: number) => string) | null = (n) => zahlwortPortugiesisch(n, "br");
